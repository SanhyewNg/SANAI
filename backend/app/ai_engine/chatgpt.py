from openai import AsyncOpenAI
from fastapi import HTTPException

from app.config import settings


CHAT_COMPLETION_MODEL = "gpt-4o-mini"


def _get_openai_client() -> AsyncOpenAI:
    return AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def chatgpt_for_assistant(recent_msgs=[], user_msg_txt="", system="", before="", after=""):
    """ Open AI - Chat GPT
    """
    client = _get_openai_client()

    messages = []
    messages.append({"role": "system", "content": system})
    messages += recent_msgs
    messages.append({"role": "user", "content": before + user_msg_txt + after})
    print("User Msg Text: ", user_msg_txt)

    response = await client.chat.completions.create(
        model=CHAT_COMPLETION_MODEL,
        messages=messages
    )
    if not response:    # Guard: Ensure output
        raise HTTPException(status_code=400, detail="Failed in chatgpt response")
    print("Chat gen success!")

    bot_text = response.choices[0].message.content
    print("Bot Msg Text: ", bot_text)

    return bot_text


async def chatgpt_for_translator(original_txt, system, before):
    """ Open AI - Chat GPT
    """
    client = _get_openai_client()

    messages = []
    messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": before})
    messages.append({"role": "user", "content": original_txt})
    print("Original Text: ", original_txt)

    stream = await client.chat.completions.create(
        model=CHAT_COMPLETION_MODEL,
        messages=messages,
        temperature=0,
        max_tokens=1000,
        top_p=1,
        stream=True,
        frequency_penalty=1,
        presence_penalty=1,
    )

    combined = ""
    async for chunk in stream:
        delta = chunk.choices[0].delta
        if delta.content:
            combined += delta.content

    translation_text = combined
    print("Translation Text: ", translation_text)

    return translation_text
