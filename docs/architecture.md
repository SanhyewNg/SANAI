# Architecture

## Workspace Structure

- `frontend/` contains the client application
- `backend/` contains the API and integrations
- `docs/` contains project documentation

## Backend Structure

Key backend entry points:

- `backend/app/main.py` - FastAPI app creation, middleware, startup, Beanie initialization
- `backend/app/routers/__init__.py` - versioned API router composition
- `backend/app/config/settings.py` - runtime settings model
- `backend/app/auth/auth.py` - token creation and current-user dependencies

Main backend areas:

- `app/routers/` - HTTP routes for auth, preview, users, managers, developers, voice, assistants, translation, and records
- `app/models/` - Beanie document models
- `app/ai_engine/` - OpenAI, ElevenLabs, translator, and speech integrations
- `app/utils/` - helpers for passwords, email, and serialization

The backend mounts API routes under `/v1` and redirects `/` to `/docs`.

## Frontend Structure

Key frontend entry points:

- `frontend/src/App.tsx` - application routes
- `frontend/src/axios.ts` - global Axios request interceptor
- `frontend/src/api.services/` - backend-facing service layer
- `frontend/src/contexts/` - auth and theme state

Main frontend areas:

- public routes for home, help, registration, login, verification, reset, and Google callback
- protected routes for account pages
- feature pages for assistants, translator, communication, connection, and paint

The frontend uses `HashRouter`, so URLs are client-routed after the `#` fragment.

## Auth Flow Summary

- Email/password login returns an access token and may require OTP validation.
- Refresh token flow uses an HttpOnly cookie.
- Google login starts at the backend and returns to the frontend callback page.
- Email verification and resend verification are part of the auth flow.

## Data Flow Summary

1. Frontend service calls are built from `VITE_BACKEND_API_URL`.
2. Axios attaches the in-memory access token when present.
3. FastAPI routes handle the request under `/v1`.
4. Beanie persists and reads MongoDB documents.
5. AI routes call provider integrations as needed.