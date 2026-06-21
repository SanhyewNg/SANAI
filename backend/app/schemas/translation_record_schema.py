from datetime import datetime
from typing import Optional, List
from uuid import UUID, uuid4
from pydantic import BaseModel, Field


class TranslationItemSchema(BaseModel):
    uuid: UUID = Field(default_factory=uuid4)
    time_stamp: datetime = Field(default_factory=datetime.now)
    side: str

    original_language_name: str
    original_language_localname: str
    original_text: str

    target_language_name: str
    target_language_localname: str
    translation_text: Optional[str] = ""


class TranslationRecordsListItemSchema(BaseModel):
    uuid: UUID
    id: str
    title: str
    user_uuid: UUID


class TranslationRecordGetSchema(TranslationRecordsListItemSchema):
    voice: str

    items: List[TranslationItemSchema]
    

class DeleteTranslationRecordRequestSchema(BaseModel):
    translation_record_uuid: UUID


class DeleteTranslationRecordItemRequestSchema(BaseModel):
    translation_record_uuid: UUID
    record_item_uuid: UUID


