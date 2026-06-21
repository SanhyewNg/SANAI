from typing import Any
from datetime import datetime, timedelta
from random import randbytes
import hashlib
import pyotp

from fastapi import APIRouter, HTTPException, Depends, Response
from pymongo import errors
from beanie.exceptions import RevisionIdWasChanged

from app.utils.password import get_hashed_password, verify_password
from app.auth.auth import get_current_active_user
from app.config import settings
import app.utils as utils
import app.schemas as schemas
import app.models as models


router = APIRouter()


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie("refresh_token", path="/")
    response.delete_cookie("otp_login_token", path="/")
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("Authorization", path="/")
    response.delete_cookie("logged_in", path="/")

############################################################################################
###### Logged-in User Manages His Account

# @router.get("/read_me", response_model=schemas.UserPublicSchema)
@router.get("/read_me", response_model=schemas.UserPrivateSchema)
async def read_me(
    current_user: models.UserDocument = Depends(get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user


def _build_frontend_url(path: str) -> str:
    return f"{settings.CLIENT_ORIGIN.rstrip('/')}#/{path.lstrip('/')}"


@router.patch("/update_me", response_model=schemas.UserPrivateSchema)
async def update_me(
    update: schemas.UserProfileUpdateSchema,
    current_user: models.UserDocument = Depends(get_current_active_user),
) -> Any:
    """
    Update current user.
    """
    update_data = update.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    current_user = current_user.model_copy(update=update_data)
    try:
        await current_user.save()
        return current_user
    except (errors.DuplicateKeyError, RevisionIdWasChanged):
        raise HTTPException(
            status_code=400, detail=""
        )


@router.post("/change_password", response_model=schemas.StatusMessageSchema)
async def change_password(
    payload: schemas.UserPasswordChangeSchema,
    response: Response,
    current_user: models.UserDocument = Depends(get_current_active_user),
) -> Any:
    if payload.new_password != payload.new_password_confirm:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if current_user.otp_enabled:
        if not payload.otp_token:
            raise HTTPException(status_code=400, detail="OTP code is required")
        if not current_user.otp_base32:
            raise HTTPException(status_code=400, detail="OTP is not configured")
        totp = pyotp.TOTP(current_user.otp_base32)
        if not totp.verify(payload.otp_token, valid_window=1):
            raise HTTPException(status_code=400, detail="OTP code is invalid")

    current_user.hashed_password = get_hashed_password(payload.new_password)
    current_user.session_version += 1
    current_user.updated_at = datetime.utcnow()
    await current_user.save()
    clear_auth_cookies(response)

    return {
        "status": "success",
        "message": "Password updated successfully. Please sign in again.",
        "requires_reauth": True,
    }


@router.post("/change_email", response_model=schemas.StatusMessageSchema)
async def change_email(
    payload: schemas.UserEmailChangeSchema,
    response: Response,
    current_user: models.UserDocument = Depends(get_current_active_user),
) -> Any:
    next_email = payload.email.lower()
    if next_email == current_user.email:
        return {"status": "success", "message": "Email address unchanged"}

    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    if current_user.otp_enabled:
        if not payload.otp_token:
            raise HTTPException(status_code=400, detail="OTP code is required")
        if not current_user.otp_base32:
            raise HTTPException(status_code=400, detail="OTP is not configured")
        totp = pyotp.TOTP(current_user.otp_base32)
        if not totp.verify(payload.otp_token, valid_window=1):
            raise HTTPException(status_code=400, detail="OTP code is invalid")

    email_exists = await models.UserDocument.find_one({"email": next_email})
    if email_exists and email_exists.uuid != current_user.uuid:
        raise HTTPException(status_code=409, detail="An account of the email already exists")

    previous_email = current_user.email
    previous_verification_state = current_user.email_verified
    previous_verification_code = current_user.email_verification_code
    previous_verification_expires_at = current_user.email_verification_expires_at
    previous_session_version = current_user.session_version

    code = randbytes(10)
    hashed_code = hashlib.sha256()
    hashed_code.update(code)

    current_user.email = next_email
    current_user.email_verified = False
    current_user.email_verification_code = hashed_code.hexdigest()
    current_user.email_verification_expires_at = datetime.utcnow() + timedelta(minutes=10)
    current_user.session_version += 1
    current_user.updated_at = datetime.utcnow()
    await current_user.save()

    verification_url = _build_frontend_url(f"verify_email/{code.hex()}")
    try:
        await utils.send_email.Email(
            utils.userSerializers.userEntity(current_user),
            verification_url,
            [next_email],
        ).sendVerificationCode()
    except Exception as error:
        current_user.email = previous_email
        current_user.email_verified = previous_verification_state
        current_user.email_verification_code = previous_verification_code
        current_user.email_verification_expires_at = previous_verification_expires_at
        current_user.session_version = previous_session_version
        current_user.updated_at = datetime.utcnow()
        await current_user.save()
        raise HTTPException(
            status_code=500,
            detail="There was an error sending email",
        ) from error

    clear_auth_cookies(response)

    return {
        "status": "success",
        "message": "Verification email sent to your new address. Please sign in again after verifying it.",
        "requires_reauth": True,
    }


@router.delete("/delete_me", response_model=schemas.StatusMessageSchema)
async def delete_me(
    payload: schemas.UserDeleteSchema,
    response: Response,
    current_user: models.UserDocument = Depends(get_current_active_user)
) -> Any:
    """
    Delete current user.
    """
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if current_user.otp_enabled:
        if not payload.otp_token:
            raise HTTPException(status_code=400, detail="OTP code is required")
        if not current_user.otp_base32:
            raise HTTPException(status_code=400, detail="OTP is not configured")
        totp = pyotp.TOTP(current_user.otp_base32)
        if not totp.verify(payload.otp_token, valid_window=1):
            raise HTTPException(status_code=400, detail="OTP code is invalid")

    clear_auth_cookies(response)
    await current_user.delete()
    return {
        "status": "success",
        "message": "Account deleted successfully.",
    }


# @router.get("/list-users", response_model=List[schemas.UserPublicSchema])
# async def list_users(
#     limit: Optional[int] = 10,
#     offset: Optional[int] = 0,
#     user: models.UserDocument = Depends(get_current_active_user),
# ):
#     users = await models.UserDocument.find_all().skip(offset).limit(limit).to_list()
#     return users

