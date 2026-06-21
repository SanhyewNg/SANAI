from typing import List
from decouple import config
from pydantic import EmailStr
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ENV: str
    API_VERSION_STR: str = "/v1"

    # SECRET_KEY for JWT token generation
    # Calling secrets.token_urlsafe will generate a new secret everytime
    # the server restarts, which can be quite annoying when developing, where
    # a stable SECRET_KEY is prefered.

    # SECRET_KEY: str = secrets.token_urlsafe(32)
    SECRET_KEY: str

    # # database configurations
    # MONGO_HOST: str
    # MONGO_PORT: int
    # MONGO_USER: str
    # MONGO_PASSWORD: str
    # MONGO_DB: str

    DB_URL: str = config("DB_URL", cast=str)
    DB_NAME: str = config("DB_NAME", cast=str)

    ACCESS_TOKEN_EXPIRES_IN_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRES_IN_MINUTES: int = 60 * 24 * 7
    JWT_ALGORITHM: str = "HS256"
    # SERVER_NAME: str
    # SERVER_HOST: AnyHttpUrl

    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    # "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    # BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    PROJECT_NAME: str

    RESET_USERS_ON_STARTUP: bool = False

    MANAGERS: List
    DEVELOPERS: List

    # SSO ID and Secrets
    GOOGLE_CLIENT_ID: str = None
    GOOGLE_CLIENT_SECRET: str = None
    SSO_CALLBACK_HOSTNAME: str = None

    # OPEN_AI_ORG: str = None
    OPENAI_API_KEY: str = None

    ELEVEN_LABS_API_KEY: str = None

    CLIENT_ORIGIN: str

    EMAIL_HOST: str
    EMAIL_PORT: int
    EMAIL_USERNAME: str
    EMAIL_PASSWORD: str
    EMAIL_FROM: EmailStr

    LOGFIRE_TOKEN: str
    LOGFIRE_PYDANTIC_PLUGIN_RECORD: str

    class Config:
        env_file = ".env"
        # orm_mode = True


settings = Settings()
