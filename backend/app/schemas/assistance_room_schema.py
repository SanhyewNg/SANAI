from datetime import datetime
from typing import Optional, List
from uuid import UUID, uuid4
from pydantic import BaseModel, Field


class AssistanceMessageSchema(BaseModel):
    uuid: UUID = Field(default_factory=uuid4)
    time_stamp: datetime = Field(default_factory=datetime.now)

    sender_uuid: UUID
    text: Optional[str] = ""
    # image: str]


class AssistanceRoomListItemSchema(BaseModel):
    uuid: UUID
    assistant_uuid: UUID
    user_uuid: UUID


class AssistanceRoomGetSchema(AssistanceRoomListItemSchema):
    assistant_voice: str
    messages: List[AssistanceMessageSchema]


class DeleteAssistanceRoomRequestSchema(BaseModel):
    assistance_room_uuid: UUID


class DeleteAssistanceRoomMessageRequestSchema(BaseModel):
    assistance_room_uuid: UUID
    room_message_uuid: UUID


