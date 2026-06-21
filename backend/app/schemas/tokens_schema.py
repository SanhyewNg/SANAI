from typing import Optional
from uuid import UUID
from pydantic import BaseModel


class Token(BaseModel):
    access_token: Optional[str] = None
    token_type: str
    requires_otp: bool = False


class TokenPayload(BaseModel):
    uuid: Optional[UUID] = None
