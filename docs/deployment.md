# Deployment

## Current Hosting Shape

The repository is structured for a split deployment:

- backend as a Python web service
- frontend as a static site

## Backend Deployment

The backend includes `backend/render.yaml` with this flow:

- install uv
- run `uv sync --frozen`
- start Uvicorn with the FastAPI app

Backend production requirements:

- real `SECRET_KEY`
- production MongoDB `DB_URL` and `DB_NAME`
- correct `CLIENT_ORIGIN`
- correct `SSO_CALLBACK_HOSTNAME`
- working SMTP credentials
- provider API keys for any enabled integrations

## Frontend Deployment

The frontend README documents a Render Static Site deployment using:

- install command: `bun install`
- build command: `bun run build`
- publish directory: `dist`

Frontend production requirement:

- `VITE_BACKEND_API_URL` must point to the deployed backend API prefix, for example `https://your-backend.example.com/v1`

## Cross-Service Production Alignment

These values must line up:

- frontend origin = backend `CLIENT_ORIGIN`
- backend base URL = `SSO_CALLBACK_HOSTNAME`
- frontend API base URL = `VITE_BACKEND_API_URL`
- Google OAuth redirect URI = backend callback route on the deployed backend

Example production alignment:

```env
CLIENT_ORIGIN="https://your-frontend.example.com"
SSO_CALLBACK_HOSTNAME="https://your-backend.example.com"
VITE_BACKEND_API_URL=https://your-backend.example.com/v1
```

## Operational Notes

- Do not commit real secrets.
- Store production secrets in the hosting provider dashboard.
- Use separate databases and provider credentials for development and production.
- Re-run `uv lock` after backend dependency changes and commit it with `pyproject.toml`.