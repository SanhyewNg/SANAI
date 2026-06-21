from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from settings import settings
from models.user_model import UserDocument


# Call this from within your event loop to get beanie setup.
async def startDB():
    # Create Motor client
    mongodb_client = AsyncIOMotorClient(settings.DATABASE_URL)

    # Init beanie with the Product document class
    await init_beanie(database=mongodb_client.db_name, document_models=[UserDocument])


# Call this from within your event loop to get beanie setup.
async def closeDB():
    # Create Motor client
    mongodb_client = AsyncIOMotorClient(settings.DATABASE_URL)
    mongodb_client.close()

    # # Init beanie with the Product document class
    # await init_beanie(database=client.db_name, document_models=[User])

