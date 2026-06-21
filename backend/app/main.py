import os
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

import app.models as models
from app.ai_engine import init_assistants
from app.utils.password import get_hashed_password

from .config import settings
from .routers import api_router

from dotenv import load_dotenv
import logfire

load_dotenv()

logfire.configure(environment=os.getenv("ENV", "Local"))  
logfire.info('Hello, {name}!', name='world')

# Create the app
app: FastAPI = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.1.0",
    openapi_url=f"{settings.API_VERSION_STR}/openapi.json",
)

app.state.limiter = Limiter(key_func=get_remote_address)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

logfire.instrument_fastapi(app)
logfire.instrument_pydantic()

@app.get("/", tags=['Default'])
def redirect_to_docs():
    return RedirectResponse(url='/docs')

# Set all CORS enabled origins
# if settings.BACKEND_CORS_ORIGINS:
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CLIENT_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def start_database():
    app.client = AsyncIOMotorClient(settings.DB_URL)
    await init_beanie(
        database=app.client[settings.DB_NAME],
        document_models=[
            models.UserDocument,
            models.AssistantDocument,
            models.AssistanceRoomDocument,
            models.TranslationRecordDocument,
        ],
    )
    if settings.RESET_USERS_ON_STARTUP:
        user_docs = await models.UserDocument.find_all().to_list()
        for user_doc in user_docs:
            await user_doc.delete()

    # assistant_room_docs = await models.AssistanceRoomDocument.find_all().to_list()
    # for assistant_room_doc in assistant_room_docs:
    #     await assistant_room_doc.delete()

    managers = settings.MANAGERS
    for manager in managers:
        manager_doc: models.UserDocument = await models.UserDocument.find_one(
            models.UserDocument.email == manager["email"]
        )

        # manager_doc.email = manager["email"].lower()
        # manager_doc.hashed_password = get_hashed_password(manager["pw"])
        # manager_doc.first_name = manager["first_name"]
        # manager_doc.last_name = manager["last_name"]
        # manager_doc.avatar = manager["avatar"]
        # manager_doc.is_active = True
        # manager_doc.is_manager = True
        # manager_doc.is_developer = False
        # await manager_doc.save()

        if not manager_doc:
            manager_doc = models.UserDocument(
                email=manager["email"].lower(),
                hashed_password=get_hashed_password(manager["pw"]),
                first_name=manager["first_name"],
                last_name=manager["last_name"],
                avatar=manager["avatar"],
                email_verified=True,
                is_active=True,
                is_manager=True,
                is_developer=False,
            )
            await manager_doc.save()
        elif not manager_doc.email_verified:
            manager_doc.email_verified = True
            await manager_doc.save()

    developers = settings.DEVELOPERS
    for developer in developers:
        developer_doc: models.UserDocument = await models.UserDocument.find_one(
            models.UserDocument.email == developer["email"]
        )

        # developer_doc.email = developer["email"].lower()
        # developer_doc.hashed_password = get_hashed_password(developer["pw"])
        # developer_doc.first_name = developer["first_name"]
        # developer_doc.last_name = developer["last_name"]
        # developer_doc.avatar = developer["avatar"]
        # developer_doc.is_active = True
        # developer_doc.is_manager = True
        # developer_doc.is_developer = True
        # await developer_doc.save()

        if not developer_doc:
            developer_doc = models.UserDocument(
                email=developer["email"].lower(),
                hashed_password=get_hashed_password(developer["pw"]),
                first_name=developer["first_name"],
                last_name=developer["last_name"],
                avatar=developer["avatar"],
                email_verified=True,
                is_active=True,
                is_manager=True,
                is_developer=True,
            )
            await developer_doc.save()
        elif not developer_doc.email_verified:
            developer_doc.email_verified = True
            await developer_doc.save()

    await init_assistants()


app.include_router(api_router, prefix=settings.API_VERSION_STR, tags=[])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app)
