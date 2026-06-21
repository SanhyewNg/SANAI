from uuid import UUID
from typing import List

import app.models as models

from .chatgpt import chatgpt_for_assistant


# def bot_respond(prior_msgs, user_msg, assistant_uuid):
async def assistant_responds_on_text_as_text(
        user_name: str,
        user_msg_text: str,
        recent_messages: List, 
        assistant_uuid: UUID
        ):
    assistant_doc = await models.AssistantDocument.find_one({'uuid': assistant_uuid})
    system, before, after = assistant_doc.system, assistant_doc.before, assistant_doc.after
    system = system + f"""

    The user's name is {user_name}    
    """

    response_text = await chatgpt_for_assistant(recent_messages, user_msg_text, system, before, after)

    return response_text

