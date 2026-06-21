from typing import List, Optional, Any
from fastapi import APIRouter
import app.schemas as schemas
import app.models as models


router = APIRouter()


@router.get("/all-assistants", response_model=List[schemas.AssistantPublicSchema])
async def list_assistants(
    limit: Optional[int] = 200,
    offset: Optional[int] = 0,
) -> Any:
    """
    List all assistants.

    (!Completed)
    """
    assistants = await models.AssistantDocument.find_all().skip(offset).limit(limit).project(schemas.AssistantPublicSchema).to_list()
    # print(assistants)

    return assistants


