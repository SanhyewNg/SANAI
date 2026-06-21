from datetime import date, datetime
from uuid import UUID, uuid4
from typing import List
from pydantic import EmailStr, Field
from beanie import Document


# This is the model that will be saved to the database
class UserDocument(Document):
    uuid: UUID = Field(default_factory=uuid4)
    first_name: str = Field(min_length=1, max_length=15)
    last_name: str = Field(min_length=1, max_length=15)
    hashed_password: str = ""
    # password: str

    email: EmailStr
    email_verified: bool= False
    email_verification_code: bytes | None = None
    email_verification_expires_at: datetime | None = None

    password_reset_token: str | None = None
    password_reset_expires_at: datetime | None = None

    otp_enabled: bool = False
    otp_verified: bool = False
    otp_base32: str | None = None
    otp_auth_url: str | None = None

    created_at: datetime | None = None
    updated_at: datetime | None = None
    # created_at: datetime  =  Field(default_factory=datetime.now)
    # accessed_last: datetime  =  Field(default_factory=datetime.now)

    phone: str = ""
    birthday: date | None = None
    language : str = ""
    avatar: str = ""

    plan: str = ""
    haptic: bool = False
    dark_theme: bool = False

    provider: str = ""
    session_version: int = 0

    is_active: bool = True
    is_manager: bool = False
    is_developer: bool = False
    
    rooms_uuid: List[UUID] = Field(default_factory=list)

    like_assistants_uuids: List[UUID] = Field(default_factory=list)

    translation_records_uuids:  List[UUID] = Field(default_factory=list)


