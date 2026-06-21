from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, constr
from uuid import UUID


class UserRegisterSchema(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: constr(min_length=8, max_length=32)

    class Config:
        extra = "forbid"


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: constr(min_length=8, max_length=32)


class UserRequestSchema(BaseModel):
    user_uuid: str
    token: str | None = None


class OTPTokenSchema(BaseModel):
    token: constr(min_length=6)


class OTPSetupSchema(BaseModel):
    current_password: constr(min_length=8)
    otp_token: Optional[constr(min_length=6)] = None

    class Config:
        extra = "forbid"


class OTPDisableSchema(BaseModel):
    current_password: constr(min_length=8)
    otp_token: constr(min_length=6)

    class Config:
        extra = "forbid"


class ForgotPasswordSchema(BaseModel):
    email: EmailStr


class ResetPasswordSchema(BaseModel):
    password: constr(min_length=8)
    passwordConfirm: constr(min_length=8)


class StatusMessageSchema(BaseModel):
    status: str
    message: str
    requires_reauth: bool = False


class UserResponseSchema(BaseModel):
    first_name: str
    last_name: str
    email: str
    avatar: str
    id: str



############################

class UserPublicSchema(BaseModel):
    """
    Shared User properties. Visible to anyone.
    """
    uuid: UUID

    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar: Optional[str] = None


class UserPrivateSchema(UserPublicSchema):
    """
    Private User properties. Visible only to self and admins.
    """
    email: Optional[EmailStr] = None
    email_verified: bool = False
    password: Optional[str] = None
    is_active: Optional[bool] = True
    
    phone: Optional[str]
    birthday: Optional[date] = None
    language : Optional[str]

    plan: Optional[str]
    haptic: bool = True
    light_theme: bool = True

    provider: Optional[str] = None
    otp_enabled: bool = False
    otp_verified: bool = False

    created_at: Optional[datetime] = None
    updated_at: datetime | None = None
    accessed_last: Optional[datetime] = None

    rooms_uuid: Optional[List]
    translation_records_uuids: Optional[List[UUID]]


class UserProfileUpdateSchema(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar: Optional[str] = None
    phone: Optional[str] = None
    birthday: Optional[date] = None
    language: Optional[str] = None
    plan: Optional[str] = None
    haptic: Optional[bool] = None
    dark_theme: Optional[bool] = None

    class Config:
        extra = "forbid"


class UserPasswordChangeSchema(BaseModel):
    current_password: constr(min_length=8)
    new_password: constr(min_length=8)
    new_password_confirm: constr(min_length=8)
    otp_token: Optional[constr(min_length=6)] = None

    class Config:
        extra = "forbid"


class UserEmailChangeSchema(BaseModel):
    email: EmailStr
    current_password: constr(min_length=8)
    otp_token: Optional[constr(min_length=6)] = None

    class Config:
        extra = "forbid"


class UserDeleteSchema(BaseModel):
    current_password: constr(min_length=8)
    otp_token: Optional[constr(min_length=6)] = None

    class Config:
        extra = "forbid"
    

############################

class UserManagerSchema(UserPrivateSchema):
    """
    User properties returned by API. Contains private
    user information such as email, is_active, auth provider.

    Should only be returned to admins.
    """
    is_manager: Optional[bool] = False


class UserDeveloperSchema(UserPrivateSchema):
    """
    User properties returned by API. Contains private
    user information such as email, is_active, auth provider.

    Should only be returned to admins.
    """
    is_developer: Optional[bool] = False
