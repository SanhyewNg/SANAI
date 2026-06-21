# Environment Configuration

## Backend Environment

The backend loads settings from `backend/.env` through `backend/app/config/settings.py`.

Core variables:

- `ENV` - environment label such as `local`, `staging`, or `Render`
- `PROJECT_NAME` - API display name
- `SECRET_KEY` - JWT signing secret
- `DB_URL` - MongoDB connection string
- `DB_NAME` - MongoDB database name
- `CLIENT_ORIGIN` - frontend origin allowed by CORS

Auth and session variables:

- `ACCESS_TOKEN_EXPIRES_IN_MINUTES`
- `REFRESH_TOKEN_EXPIRES_IN_MINUTES`
- `JWT_ALGORITHM`

Bootstrap users:

- `MANAGERS`
- `DEVELOPERS`

Provider and integration variables:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SSO_CALLBACK_HOSTNAME`
- `OPENAI_API_KEY`
- `ELEVEN_LABS_API_KEY`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USERNAME`
- `EMAIL_PASSWORD`
- `EMAIL_FROM`
- `LOGFIRE_TOKEN`
- `LOGFIRE_PYDANTIC_PLUGIN_RECORD`

Use [backend/.env.example](../backend/.env.example) as the starting template.

## Frontend Environment

The frontend currently expects `VITE_BACKEND_API_URL` in its Vite environment.

Recommended local value:

```env
VITE_BACKEND_API_URL=http://localhost:8000/v1
```

Recommended production value:

```env
VITE_BACKEND_API_URL=https://your-backend-domain.example.com/v1
```

## Alignment Rules

- `CLIENT_ORIGIN` must match the real frontend origin.
- `VITE_BACKEND_API_URL` must point to the versioned backend API prefix.
- `SSO_CALLBACK_HOSTNAME` must be the backend base URL, not the frontend URL.
- Google OAuth redirect URIs must match the backend callback route exactly.

Example local alignment:

```env
CLIENT_ORIGIN="http://localhost:5173"
VITE_BACKEND_API_URL=http://localhost:8000/v1
SSO_CALLBACK_HOSTNAME="http://localhost:8000"
```