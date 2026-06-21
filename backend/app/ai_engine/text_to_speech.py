import json
import base64

from elevenlabs.client import ElevenLabs

from app.config import settings

ELEVEN_LABS_MODEL_ID = "eleven_multilingual_v2"

voice_shaun = "mTSvIrm2hmcnOvb21nW2"
voice_rachel_id = "21m00Tcm4TlvDq8ikWAM"
voice_antoni = "ErXwobaYiN019PkySvjV"
voice_vin_id = "4bg8qOpTXJbqFLJofqKs"


def _get_elevenlabs_client() -> ElevenLabs:
    return ElevenLabs(api_key=settings.ELEVEN_LABS_API_KEY)


def get_voices():
    client = _get_elevenlabs_client()
    voices_response = client.voices.get_all()
    voices_list = [{"voice_id": v.voice_id, "name": v.name} for v in voices_response.voices]
    return json.dumps(voices_list)


def convert_text_to_speech(
        text: str,
        voice: str = None,
):
    """Convert text to speech
    """
    print("TTS ...")
    print('Input text:', text)
    print('Voice:', voice)

    voice_id = voice if voice else voice_rachel_id
    client = _get_elevenlabs_client()

    audio_generator = client.text_to_speech.convert(
        voice_id,
        text=text,
        model_id=ELEVEN_LABS_MODEL_ID,
    )
    audio_bytes = b"".join(audio_generator)
    audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")

    return audio_base64


