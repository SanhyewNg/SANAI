# Local Development

## Stack Summary

- Frontend: React 18, TypeScript, Vite, Bun
- Backend: FastAPI, Motor, Beanie, uv
- Database: MongoDB

## Prerequisites

- Python 3.12+
- Bun
- uv
- MongoDB connection string
- SMTP credentials if you want email-based flows to work locally

## Backend Startup

From `backend/`:

```shell
uv sync
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Useful local backend URLs:

- API docs: `http://localhost:8000/docs`
- OpenAPI JSON: `http://localhost:8000/v1/openapi.json`
- API root health route: `http://localhost:8000/v1/`

## Frontend Startup

From `frontend/`:

```shell
bun install
bun run dev
```

Vite normally serves the app at `http://localhost:5173`.

## Frontend to Backend Wiring

The frontend service layer reads the backend base URL from `VITE_BACKEND_API_URL`.

Recommended local value:

```env
VITE_BACKEND_API_URL=http://localhost:8000/v1
```

The backend CORS origin should match the frontend dev URL:

```env
CLIENT_ORIGIN="http://localhost:5173"
```

## Recommended Local Flow

1. Fill `backend/.env` using `backend/.env.example`.
2. Set `frontend/.env.local` with `VITE_BACKEND_API_URL=http://localhost:8000/v1`.
3. Start the backend.
4. Start the frontend.
5. Test auth and preview routes from the browser.

## Notes

- Google OAuth requires local callback URLs to be configured in Google Cloud.
- Email verification and password reset flows require working SMTP credentials.
- AI features require valid provider API keys.