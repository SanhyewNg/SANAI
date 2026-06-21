# SANAI Backend

This directory contains the SANAI backend API. It is a FastAPI service that handles authentication, user-related flows, AI integrations, database access, and other application APIs.

For broader project documentation, see [../docs/README.md](../docs/README.md).

## Overview

The backend currently provides:

- versioned API routes under `/v1`
- MongoDB persistence via Motor and Beanie
- email and Google authentication flows
- JWT access tokens, refresh handling, and OTP validation
- AI-related integrations such as OpenAI and ElevenLabs

Primary entry points:

- `app/main.py` - app startup, middleware, database initialization
- `app/routers/__init__.py` - API router composition
- `app/config/settings.py` - env-driven configuration

## Prerequisites

- Python 3.12+
- `uv`
- A MongoDB database
- SMTP credentials for email flows
- Optional provider credentials for Google OAuth and AI integrations

Install `uv` if needed:

```shell
pip install uv
```

## Dependency Management

The backend is `uv`-managed.

Source of truth:

- `pyproject.toml` for declared dependencies
- `uv.lock` for resolved versions

Common commands:

```shell
uv sync
uv lock
```

## Local Development

Install dependencies:

```shell
uv sync
```

Run the API locally:

```shell
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Useful local URLs:

- `http://localhost:8000/docs`
- `http://localhost:8000/v1`

The frontend origin should normally be:

```env
CLIENT_ORIGIN="http://localhost:5173"
```

## Configuration

The backend loads configuration from `.env` through `app/config/settings.py`.

Start from `.env.example`, then replace the placeholder values.

Important settings include:

- `SECRET_KEY`
- `DB_URL`
- `DB_NAME`
- `CLIENT_ORIGIN`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USERNAME`
- `EMAIL_PASSWORD`
- `EMAIL_FROM`

Optional integrations:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SSO_CALLBACK_HOSTNAME`
- `OPENAI_API_KEY`
- `ELEVEN_LABS_API_KEY`
- `LOGFIRE_TOKEN`

For the complete env reference, see [../docs/environment.md](../docs/environment.md).

## Deployment

The backend is structured for deployment as a Python web service. The current repository includes Render-oriented configuration.

Typical backend production requirements:

- real secrets and API keys
- production MongoDB settings
- correct frontend `CLIENT_ORIGIN`
- correct `SSO_CALLBACK_HOSTNAME`
- production SMTP credentials

For deployment details, see [../docs/deployment.md](../docs/deployment.md).

## Related Docs

- [../docs/local-development.md](../docs/local-development.md)
- [../docs/environment.md](../docs/environment.md)
- [../docs/architecture.md](../docs/architecture.md)
- [../docs/deployment.md](../docs/deployment.md)
