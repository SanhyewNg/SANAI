# <img src="frontend/public/assets/Logo-Vector.svg" alt="SANAI logo" width="32" /> SANAI

<p align="center">
	<img src="frontend\public\assets\Sphere.gif" alt="Sphere.gif" width="360" />
</p>

SANAI is a full-stack AI platform with a React + Vite frontend and a FastAPI backend. The repository is organized as a workspace with separate frontend and backend applications, plus shared project documentation under `docs/`.

## Overview

SANAI combines user authentication, assistant experiences, translation workflows, voice features, and supporting account/help flows in a single product workspace.

At a high level:

- `frontend/` contains the React web app
- `backend/` contains the FastAPI API and integrations
- `docs/` contains the longer-form project documentation

## Features

- Email and Google authentication flows
- OTP and verification-related auth screens
- AI assistant browsing and interaction flows
- Translation and voice-related features
- Account, settings, and help pages
- FastAPI OpenAPI docs for backend development and testing

## Repository Layout

```text
SANAI/
├── frontend/   React 18, TypeScript, Vite, Bun
├── backend/    FastAPI, Beanie, MongoDB, uv
├── docs/       Setup, environment, architecture, deployment
└── README.md   Workspace overview
```

## Quick Start

### Frontend

```shell
cd frontend
bun install
bun run dev
```

### Backend

```shell
cd backend
uv sync
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

For local development, the frontend should point to the backend API prefix:

```env
VITE_BACKEND_API_URL=http://localhost:8000/v1
```

## Documentation

- [frontend/README.md](frontend/README.md) - frontend setup and runtime notes
- [backend/README.md](backend/README.md) - backend setup, env, and deployment notes
- [docs/README.md](docs/README.md) - documentation index
- [docs/local-development.md](docs/local-development.md) - end-to-end local setup
- [docs/environment.md](docs/environment.md) - frontend and backend environment variables
- [docs/architecture.md](docs/architecture.md) - application structure and request flow
- [docs/deployment.md](docs/deployment.md) - deployment and production guidance

## Technology Stack

Frontend:

- React 18
- TypeScript
- Vite
- Bun
- Axios
- React Router

Backend:

- FastAPI
- Beanie
- Motor / MongoDB
- uv
- OpenAI
- ElevenLabs

## Dependency Management

Frontend source of truth:

- `frontend/package.json` declares dependencies
- `frontend/bun.lockb` resolves dependency versions

Backend source of truth:

- `backend/pyproject.toml` declares dependencies
- `backend/uv.lock` resolves dependency versions

## Local Development Flow

1. Create the backend `.env` from `backend/.env.example`.
2. Create the frontend local env with `VITE_BACKEND_API_URL=http://localhost:8000/v1`.
3. Start the backend.
4. Start the frontend.
5. Open the app at `http://localhost:5173`.
6. Open backend API docs at `http://localhost:8000/docs` if needed.

## Deployment Notes

- The frontend is suited to a static-site deployment.
- The backend is suited to a Python web service deployment.
- Render-oriented deployment notes already exist in the service READMEs and in [docs/deployment.md](docs/deployment.md).

## Additional Notes

- Keep real secrets out of git.
- Prefer the docs in `docs/` for the most complete setup guidance.
