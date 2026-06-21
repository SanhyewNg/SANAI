from typing import Any
from datetime import datetime, timedelta
from random import randbytes
import hashlib
import secrets
import pyotp
from urllib.parse import urlencode

from fastapi import APIRouter, Request, Response, status, Depends, HTTPException
from fastapi_sso.sso.google import GoogleSSO
from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.responses import RedirectResponse


from app.config import settings
import app.schemas as schemas
import app.models as models
from app.auth.auth import (
    authenticate_user,
    create_access_token,
    create_otp_token,
    create_refresh_token,
    get_current_active_user,
    get_current_user,
    get_current_user_from_cookie,
    get_current_user_from_otp_cookie,
    get_optional_current_user,
    get_optional_current_user_from_cookie,
)
import app.utils as utils
from app.utils.password import verify_password
from app.utils.userSerializers import userEntity

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

COOKIE_SECURE = settings.ENV.lower() in {"production", "prod"}
COOKIE_SAMESITE = "none" if COOKIE_SECURE else "lax"
POST_AUTH_REDIRECT_COOKIE = "post_auth_redirect"


def set_refresh_cookie(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        "refresh_token",
        refresh_token,
        max_age=settings.REFRESH_TOKEN_EXPIRES_IN_MINUTES * 60,
        expires=settings.REFRESH_TOKEN_EXPIRES_IN_MINUTES * 60,
        path="/",
        secure=COOKIE_SECURE,
        httponly=True,
        samesite=COOKIE_SAMESITE,
    )


def set_otp_cookie(response: Response, otp_token: str) -> None:
    response.set_cookie(
        "otp_login_token",
        otp_token,
        max_age=10 * 60,
        expires=10 * 60,
        path="/",
        secure=COOKIE_SECURE,
        httponly=True,
        samesite=COOKIE_SAMESITE,
    )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie("refresh_token", path="/")
    response.delete_cookie("otp_login_token", path="/")
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("Authorization", path="/")
    response.delete_cookie("logged_in", path="/")
    response.delete_cookie(POST_AUTH_REDIRECT_COOKIE, path="/")


def set_post_auth_redirect_cookie(response: Response, next_path: str) -> None:
    response.set_cookie(
        POST_AUTH_REDIRECT_COOKIE,
        next_path,
        max_age=10 * 60,
        expires=10 * 60,
        path="/",
        secure=COOKIE_SECURE,
        httponly=True,
        samesite=COOKIE_SAMESITE,
    )


def clear_post_auth_redirect_cookie(response: Response) -> None:
    response.delete_cookie(POST_AUTH_REDIRECT_COOKIE, path="/")


def set_session_cookies(response: Response, refresh_token: str) -> None:
    set_refresh_cookie(response, refresh_token)


def require_trusted_origin(request: Request) -> None:
    if not request.cookies.get("refresh_token"):
        return

    trusted_origin = settings.CLIENT_ORIGIN.rstrip("/")
    origin = request.headers.get("origin")
    referer = request.headers.get("referer")

    if origin:
        if origin.rstrip("/") != trusted_origin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Origin validation failed")
        return

    if referer and referer.startswith(trusted_origin):
        return

    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Origin validation failed")


def _build_frontend_url(path: str) -> str:
    return f"{settings.CLIENT_ORIGIN.rstrip('/')}#/{path.lstrip('/')}"


def _sanitize_next_path(next_path: str | None) -> str:
    if not next_path:
        return "/"
    if not next_path.startswith("/") or next_path.startswith("//"):
        return "/"
    return next_path


def _build_frontend_route_with_query(path: str, query: dict[str, str]) -> str:
    route_url = _build_frontend_url(path)
    if not query:
        return route_url
    return f"{route_url}?{urlencode(query)}"


def _build_google_callback_url(
    *,
    status_value: str,
    message: str | None = None,
    requires_otp: bool = False,
    next_path: str = "/",
) -> str:
    query = {
        "status": status_value,
        "next": _sanitize_next_path(next_path),
    }
    if message:
        query["message"] = message
    if requires_otp:
        query["requires_otp"] = "true"
    return _build_frontend_route_with_query("auth/google/callback", query)


async def _send_verification_email(user_doc: models.UserDocument, recipient_email: str) -> None:
    previous_verification_code = user_doc.email_verification_code
    previous_verification_expires_at = user_doc.email_verification_expires_at
    previous_updated_at = user_doc.updated_at

    code = randbytes(10)
    hashed_code = hashlib.sha256()
    hashed_code.update(code)
    verification_code = hashed_code.hexdigest()

    user_doc.email_verification_code = verification_code
    user_doc.email_verification_expires_at = datetime.utcnow() + timedelta(minutes=10)
    user_doc.updated_at = datetime.utcnow()
    await user_doc.save()

    try:
        url = _build_frontend_url(f"verify_email/{code.hex()}")
        await utils.send_email.Email(userEntity(user_doc), url, [recipient_email]).sendVerificationCode()
    except Exception as error:
        user_doc.email_verification_code = previous_verification_code
        user_doc.email_verification_expires_at = previous_verification_expires_at
        user_doc.updated_at = previous_updated_at or datetime.utcnow()
        await user_doc.save()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='There was an error sending email',
        ) from error

#################################################################################################################
# Register new User - to be removed if webapp is private
@router.post('/register', status_code=status.HTTP_201_CREATED, response_model=schemas.StatusMessageSchema)
@limiter.limit("3/minute")
async def register(
    request: Request,
    credentials: schemas.UserRegisterSchema,
):
    """
    Register a new user.
    """
    if not await utils.email_validate.is_valid_email(credentials.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Invalid email'
        )

    email_exists = await models.UserDocument.find_one({"email": credentials.email.lower()})
    if email_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='An account of the email already exists'
        )

    new_user = models.UserDocument(
        first_name=credentials.first_name,
        last_name=credentials.last_name,
        email=credentials.email.lower(),
        hashed_password=utils.password.get_hashed_password(credentials.password),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    await new_user.create()

    try:
        await _send_verification_email(new_user, credentials.email.lower())
    except Exception as error:
        await new_user.delete()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail='There was an error sending email')
    
    return {'status': 'success', 
            'message': 'Verification token successfully sent to your email'
            }


@router.post('/resend_verification', status_code=status.HTTP_200_OK, response_model=schemas.StatusMessageSchema)
@limiter.limit("3/minute")
async def resend_verification(request: Request, payload: schemas.ForgotPasswordSchema):
    generic_message = 'If the account exists and is not yet verified, a verification link has been sent.'
    user_doc: models.UserDocument = await models.UserDocument.find_one({"email": payload.email.lower()})

    if not user_doc or not user_doc.is_active or user_doc.email_verified:
        return {'status': 'success', 'message': generic_message}

    await _send_verification_email(user_doc, user_doc.email)

    return {'status': 'success', 'message': generic_message}


@router.get('/verify_email/{verificationCode}')
async def verify_me(verificationCode: str):
    try:
        verification_code_bytes = bytes.fromhex(verificationCode)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Invalid verification code',
        ) from error

    hashedCode = hashlib.sha256()
    hashedCode.update(verification_code_bytes)
    verification_code = hashedCode.hexdigest()

    r_user: models.UserDocument = await models.UserDocument.find_one({"email_verification_code": verification_code})

    if not r_user or r_user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail='Invalid verification code or account already verified')

    if (
        not r_user.email_verification_expires_at
        or r_user.email_verification_expires_at < datetime.utcnow()
    ):
        r_user.email_verification_code = None
        r_user.email_verification_expires_at = None
        r_user.updated_at = datetime.utcnow()
        await r_user.save()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Verification code has expired',
        )
    
    r_user.email_verification_code = None
    r_user.email_verification_expires_at = None
    r_user.email_verified = True
    r_user.updated_at = datetime.utcnow()
    await r_user.save()
    
    return {
        "status": "success",
        "message": "Account verified successfully"
    }

#########################################################################################################
@router.post("/login/access-token", response_model=schemas.Token)
@limiter.limit("5/minute")
async def login_access_token(
    request: Request,
    response: Response,
    login_data: schemas.UserLoginSchema
    ) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.

    (!Completed)
    """
    user = await authenticate_user(login_data.email.lower(), login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email and/or password")
    elif not user.is_active:
        raise HTTPException(status_code=401, detail="Inactive user")
    elif not user.email_verified:
        raise HTTPException(status_code=401, detail="Email address is not verified")

    if user.otp_enabled:
        clear_auth_cookies(response)
        set_otp_cookie(response, create_otp_token(user.uuid, user.session_version))
        response.set_cookie('logged_in', 'False', 
                            10 * 60,
                            10 * 60,
                            '/', None, COOKIE_SECURE, False, COOKIE_SAMESITE)
        return {
            "access_token": None,
            "token_type": "bearer",
            "requires_otp": True,
        }

    access_token = create_access_token(user.uuid, user.session_version)
    refresh_token = create_refresh_token(user.uuid, user.session_version)

    set_session_cookies(response, refresh_token)
    response.set_cookie('logged_in', 'True', 
                        settings.REFRESH_TOKEN_EXPIRES_IN_MINUTES * 60,
                        settings.REFRESH_TOKEN_EXPIRES_IN_MINUTES * 60,
                        '/', None, COOKIE_SECURE, False, COOKIE_SAMESITE)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "requires_otp": False,
    }


@router.get("/login/test-token", response_model=schemas.UserPrivateSchema)
async def test_token(
    current_user: models.UserDocument = Depends(get_current_user)
    ) -> Any:
    """
    Test access token
    """
    return current_user


@router.post("/login/refresh-token", response_model=schemas.Token)
@limiter.limit("20/minute")
async def refresh_token(
    request: Request,
    response: Response, 
    current_user: models.UserDocument = Depends(get_current_user_from_cookie),
    ) -> Any:
    """
    Return a new token for current user
    """
    require_trusted_origin(request)
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token = create_access_token(current_user.uuid, current_user.session_version)
    refresh_token = create_refresh_token(current_user.uuid, current_user.session_version)

    set_session_cookies(response, refresh_token)
    response.set_cookie('logged_in', 'True', 
                        settings.REFRESH_TOKEN_EXPIRES_IN_MINUTES * 60,
                        settings.REFRESH_TOKEN_EXPIRES_IN_MINUTES * 60,
                        '/', None, COOKIE_SECURE, False, COOKIE_SAMESITE)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "requires_otp": False,
    }


@router.post('/logout', status_code=status.HTTP_200_OK)
async def logout(
    request: Request,
    response: Response,
    current_user: models.UserDocument | None = Depends(get_optional_current_user),
    refresh_user: models.UserDocument | None = Depends(get_optional_current_user_from_cookie),
    ):
    require_trusted_origin(request)
    user = current_user or refresh_user
    if user is not None:
        user.session_version += 1
        user.updated_at = datetime.utcnow()
        await user.save()
    clear_auth_cookies(response)

    return {'status': 'success'}



#########################################################################################################

@router.post('/otp/generate')
async def Generate_OTP(
    payload: schemas.OTPSetupSchema,
    current_user: models.UserDocument = Depends(get_current_active_user),
):
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")

    if current_user.otp_enabled:
        if not payload.otp_token:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP code is required")
        if not current_user.otp_base32:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP is not configured")
        current_totp = pyotp.TOTP(current_user.otp_base32)
        if not current_totp.verify(payload.otp_token, valid_window=1):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP code is invalid")

    otp_base32 = pyotp.random_base32()
    otp_auth_url = pyotp.totp.TOTP(otp_base32).provisioning_uri(
        name=current_user.email, issuer_name="sanai.com")

    current_user.otp_auth_url = otp_auth_url
    current_user.otp_base32 = otp_base32
    current_user.otp_enabled = False
    current_user.otp_verified = False
    current_user.updated_at = datetime.utcnow()
    await current_user.save()

    return {'base32': otp_base32, "otpauth_url": otp_auth_url}


@router.post('/otp/verify')
async def Verify_OTP(
    payload: schemas.OTPTokenSchema,
    current_user: models.UserDocument = Depends(get_current_active_user),
):
    message = "Token is invalid or user doesn't exist"
    if not current_user.otp_base32:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=message)
    totp = pyotp.TOTP(current_user.otp_base32)
    if not totp.verify(payload.token):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=message)
    current_user.otp_enabled = True
    current_user.otp_verified = True
    current_user.updated_at = datetime.utcnow()
    await current_user.save()
    
    return {'otp_verified': True}


@router.post('/otp/validate')
@limiter.limit("10/minute")
async def Validate_OTP(
    request: Request,
    payload: schemas.OTPTokenSchema,
    response: Response,
    current_user: models.UserDocument = Depends(get_current_user_from_otp_cookie),
):
    message = "Token is invalid or user doesn't exist"
    if not current_user.otp_enabled or not current_user.otp_verified or not current_user.otp_base32:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="OTP must be verified first")

    totp = pyotp.TOTP(current_user.otp_base32)
    if not totp.verify(otp=payload.token, valid_window=1):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=message)

    access_token = create_access_token(current_user.uuid, current_user.session_version)
    refresh_token = create_refresh_token(current_user.uuid, current_user.session_version)

    set_session_cookies(response, refresh_token)
    response.delete_cookie("otp_login_token", path="/")
    response.set_cookie('logged_in', 'True', 
                        settings.REFRESH_TOKEN_EXPIRES_IN_MINUTES * 60,
                        settings.REFRESH_TOKEN_EXPIRES_IN_MINUTES * 60,
                        '/', None, COOKIE_SECURE, False, COOKIE_SAMESITE)

    return {'otp_valid': True, 'access_token': access_token, 'token_type': 'bearer'}


@router.post('/otp/disable')
async def Disable_OTP(
    payload: schemas.OTPDisableSchema,
    current_user: models.UserDocument = Depends(get_current_active_user),
):
    if not current_user.otp_enabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP is already disabled")
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    if not current_user.otp_base32:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP is not configured")

    totp = pyotp.TOTP(current_user.otp_base32)
    if not totp.verify(payload.otp_token, valid_window=1):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP code is invalid")

    current_user.otp_enabled = False
    current_user.otp_verified = False
    current_user.otp_base32 = None
    current_user.otp_auth_url = None
    current_user.updated_at = datetime.utcnow()
    await current_user.save()

    return {'otp_disabled': True}


@router.post('/forgot_password', status_code=status.HTTP_200_OK)
@limiter.limit("3/minute")
async def forgot_password(request: Request, payload: schemas.ForgotPasswordSchema):
    generic_message = 'If the account exists, a password reset link has been sent.'
    user_doc: models.UserDocument = await models.UserDocument.find_one({"email": payload.email.lower()})
    if not user_doc or not user_doc.is_active:
        return {'status': 'success', 'message': generic_message}

    reset_code = secrets.token_urlsafe(32)
    hashed_code = hashlib.sha256(reset_code.encode()).hexdigest()
    user_doc.password_reset_token = hashed_code
    user_doc.password_reset_expires_at = datetime.utcnow() + timedelta(minutes=30)
    user_doc.updated_at = datetime.utcnow()
    await user_doc.save()

    try:
        url = _build_frontend_url(f"resetpassword/{reset_code}")
        await utils.send_email.Email(userEntity(user_doc), url, [user_doc.email]).sendPasswordReset()
    except Exception as error:
        user_doc.password_reset_token = None
        user_doc.password_reset_expires_at = None
        user_doc.updated_at = datetime.utcnow()
        await user_doc.save()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='There was an error sending email',
        ) from error

    return {'status': 'success', 'message': generic_message}


@router.patch('/resetpassword/{resetCode}', status_code=status.HTTP_200_OK)
async def reset_password(resetCode: str, payload: schemas.ResetPasswordSchema):
    if payload.password != payload.passwordConfirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Passwords do not match',
        )

    hashed_code = hashlib.sha256(resetCode.encode()).hexdigest()
    user_doc: models.UserDocument = await models.UserDocument.find_one({"password_reset_token": hashed_code})
    if not user_doc or not user_doc.password_reset_expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Password reset link is invalid or expired',
        )

    if user_doc.password_reset_expires_at < datetime.utcnow():
        user_doc.password_reset_token = None
        user_doc.password_reset_expires_at = None
        user_doc.updated_at = datetime.utcnow()
        await user_doc.save()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Password reset link is invalid or expired',
        )

    user_doc.hashed_password = utils.password.get_hashed_password(payload.password)
    user_doc.session_version += 1
    user_doc.password_reset_token = None
    user_doc.password_reset_expires_at = None
    user_doc.updated_at = datetime.utcnow()
    await user_doc.save()

    return {
        'status': 'success',
        'message': 'Password reset successfully',
    }

####################################################################################################
GOOGLE_SSO_CALLBACK_URL = (
    f"{settings.SSO_CALLBACK_HOSTNAME.rstrip('/')}{settings.API_VERSION_STR}/login/google/callback"
    if settings.SSO_CALLBACK_HOSTNAME
    else None
)


google_sso = (
    GoogleSSO(
        settings.GOOGLE_CLIENT_ID,
        settings.GOOGLE_CLIENT_SECRET,
        GOOGLE_SSO_CALLBACK_URL,
    )
    if settings.GOOGLE_CLIENT_ID
    and settings.GOOGLE_CLIENT_SECRET
    and GOOGLE_SSO_CALLBACK_URL
    else None
)


@router.get("/login/google")
async def google_login(request: Request):
    """
    Generate login url and redirect
    """
    next_path = _sanitize_next_path(request.query_params.get("next"))
    if google_sso is None:
        response = RedirectResponse(
            _build_google_callback_url(
                status_value="error",
                message="Google sign-in is not configured.",
                next_path=next_path,
            ),
            status_code=status.HTTP_303_SEE_OTHER,
        )
        clear_auth_cookies(response)
        clear_post_auth_redirect_cookie(response)
        return response

    response = await google_sso.get_login_redirect()
    set_post_auth_redirect_cookie(response, next_path)
    return response


@router.get("/login/google/callback")
async def google_callback(request: Request):
    """
    Process login response from Google and return user info
    """
    next_path = _sanitize_next_path(request.cookies.get(POST_AUTH_REDIRECT_COOKIE))

    if google_sso is None:
        response = RedirectResponse(
            _build_google_callback_url(
                status_value="error",
                message="Google sign-in is not configured.",
                next_path=next_path,
            ),
            status_code=status.HTTP_303_SEE_OTHER,
        )
        clear_auth_cookies(response)
        clear_post_auth_redirect_cookie(response)
        return response

    try:
        google_user = await google_sso.verify_and_process(request)
    except Exception:
        response = RedirectResponse(
            _build_google_callback_url(
                status_value="error",
                message="Google sign-in could not be completed.",
                next_path=next_path,
            ),
            status_code=status.HTTP_303_SEE_OTHER,
        )
        clear_auth_cookies(response)
        clear_post_auth_redirect_cookie(response)
        return response

    google_email = (google_user.email or "").strip().lower()
    if not google_email:
        response = RedirectResponse(
            _build_google_callback_url(
                status_value="error",
                message="Google did not return a usable email address.",
                next_path=next_path,
            ),
            status_code=status.HTTP_303_SEE_OTHER,
        )
        clear_auth_cookies(response)
        clear_post_auth_redirect_cookie(response)
        return response

    user_doc = await models.UserDocument.find_one({"email": google_email})
    if user_doc is None:
        first_name = ((google_user.first_name or "").strip() or "Google")[:15]
        last_name = ((google_user.last_name or "").strip() or "User")[:15]
        user_doc = models.UserDocument(
            email=google_email,
            first_name=first_name,
            last_name=last_name,
            avatar=google_user.picture or "",
            provider="google",
            email_verified=True,
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        await user_doc.create()
    else:
        user_updated = False
        if not user_doc.email_verified:
            user_doc.email_verified = True
            user_doc.email_verification_code = None
            user_doc.email_verification_expires_at = None
            user_updated = True

        if not user_doc.provider:
            user_doc.provider = "google"
            user_updated = True

        if not user_doc.first_name and google_user.first_name:
            user_doc.first_name = google_user.first_name.strip()[:15]
            user_updated = True

        if not user_doc.last_name and google_user.last_name:
            user_doc.last_name = google_user.last_name.strip()[:15]
            user_updated = True

        if not user_doc.avatar and google_user.picture:
            user_doc.avatar = google_user.picture
            user_updated = True

        if user_updated:
            user_doc.updated_at = datetime.utcnow()
            await user_doc.save()

    if not user_doc.is_active:
        response = RedirectResponse(
            _build_google_callback_url(
                status_value="error",
                message="This account is inactive.",
                next_path=next_path,
            ),
            status_code=status.HTTP_303_SEE_OTHER,
        )
        clear_auth_cookies(response)
        clear_post_auth_redirect_cookie(response)
        return response

    if user_doc.otp_enabled:
        response = RedirectResponse(
            _build_google_callback_url(
                status_value="success",
                requires_otp=True,
                next_path=next_path,
            ),
            status_code=status.HTTP_303_SEE_OTHER,
        )
        clear_auth_cookies(response)
        set_otp_cookie(response, create_otp_token(user_doc.uuid, user_doc.session_version))
        clear_post_auth_redirect_cookie(response)
        response.set_cookie('logged_in', 'False', 
                            10 * 60,
                            10 * 60,
                            '/', None, COOKIE_SECURE, False, COOKIE_SAMESITE)
        return response

    response = RedirectResponse(
        _build_google_callback_url(
            status_value="success",
            next_path=next_path,
        ),
        status_code=status.HTTP_303_SEE_OTHER,
    )
    set_session_cookies(response, create_refresh_token(user_doc.uuid, user_doc.session_version))
    clear_post_auth_redirect_cookie(response)
    response.set_cookie('logged_in', 'True', 
                        settings.REFRESH_TOKEN_EXPIRES_IN_MINUTES * 60,
                        settings.REFRESH_TOKEN_EXPIRES_IN_MINUTES * 60,
                        '/', None, COOKIE_SECURE, False, COOKIE_SAMESITE)
    return response



