from openai import AsyncOpenAI
from app.config import settings


TRANSCRIPTION_MODEL = "whisper-1"


def _get_openai_client() -> AsyncOpenAI:
    return AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def convert_speech_to_text(audio, language):
    """Convert speech to text
    """
    client = _get_openai_client()

    try:
        transcript = await client.audio.transcriptions.create(
            model=TRANSCRIPTION_MODEL,
            file=audio,
            language=language
        )
        return transcript.text, 0
    except Exception as e:
        print("exception:", e)
        return None, 0
