from typing import Any
from fastapi import APIRouter
from fastapi import Depends
import base64
from pydantic import BaseModel

import app.ai_engine as ai_engine
import app.models as models
from app.auth.auth import (get_current_active_user,)

router = APIRouter()

################################################################################################
class STTRequestBodySchema(BaseModel):
    audio_base64: str
    language_code: str

@router.post("/stt")
async def on_speech_as_transcription_text(
    stt_request_body: STTRequestBodySchema,
    current_user: models.UserDocument = Depends(get_current_active_user),
) -> Any:
    """
    AI responds on a speech audio as the transcription text.
    """
    # print(stt_request_body)
    audio_base64 = stt_request_body.audio_base64
    speech = base64.b64decode(audio_base64.split(',')[1])
    # Save the file temporarily
    with open("myFile.wav", "wb") as buffer:
        buffer.write(speech)
    speech = open("myFile.wav", "rb")
    print(speech)

    # Transcribe the speech
    transcription_text, price = await ai_engine.convert_speech_to_text(
        audio=speech, 
        language=stt_request_body.language_code)
    # if not transcription_text:    # Guard: Ensure output
    #     raise HTTPException(status_code=417, detail="Failed to decode audio")

    response = {'transcription': transcription_text,}
    print(response)
    return response


################################################################################################
class TTSRequestBodySchema(BaseModel):
    text: str
    voice: str

@router.post("/tts")
async def on_text_as_speech(
    tts_request_body: TTSRequestBodySchema,
    current_user: models.UserDocument = Depends(get_current_active_user),
) -> Any:
    """
    AI responds on a text and voice_id selection as the synthesized speech audio.
    """

    audio_base64 = ai_engine.convert_text_to_speech(
        text=tts_request_body.text,
        voice=tts_request_body.voice,
    )
    
    return {'audio_base64': audio_base64}
