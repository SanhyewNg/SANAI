# SANAI Frontend

This directory contains the SANAI web application. It is built with React 18, TypeScript, and Vite, and uses Bun for local dependency management and scripts.

For broader project documentation, see [../docs/README.md](../docs/README.md).

## Overview

The frontend is responsible for:

- public navigation and landing pages
- authentication, verification, reset, and Google callback screens
- assistant, translation, communication, and paint experiences
- account, settings, subscription, and help pages

## Prerequisites

- Bun installed
- A running backend API
- A Vite env value for the backend API base URL

## Local Development

Install dependencies and start the dev server:

```shell
bun install
bun run dev
```

Vite typically serves the app at:

```text
http://localhost:5173
```

## Environment

The frontend expects the backend API base URL through a Vite env variable:

```env
VITE_BACKEND_API_URL=http://localhost:8000/v1
```

Create a local env file such as `.env.local` in `frontend/` if you want to keep this configuration out of your shell session.

## Available Scripts

```shell
bun run dev
bun run build
bun run preview
bun run lint
```

## Runtime Notes

- The app uses `HashRouter`.
- API service modules build requests from `VITE_BACKEND_API_URL`.
- A global Axios interceptor attaches the in-memory access token for authenticated requests.
- The backend must allow the frontend origin configured in backend `CLIENT_ORIGIN`.

## Build

To produce a production build:

```shell
bun run build
```

## Deployment

The frontend can be deployed as a static Vite site.

Render-style setup:

1. Create a Static Site.
2. Set the install command to `bun install`.
3. Set the build command to `bun run build`.
4. Set the publish directory to `dist`.
5. Set `VITE_BACKEND_API_URL` to the deployed backend API base URL, including `/v1`.

For full deployment notes, see [../docs/deployment.md](../docs/deployment.md).

## Related Docs

- [../docs/local-development.md](../docs/local-development.md)
- [../docs/environment.md](../docs/environment.md)
- [../docs/architecture.md](../docs/architecture.md)
