# APTUS Website

APTUS is a multilingual React/Vite website with a self-hosted content platform for products, news, projects/work, standard pages, analytics, media, users, roles, and admin profiles.

## Stack

- React + Vite frontend
- Node.js 22 + Express API
- PostgreSQL 18 database
- Local server storage for uploaded images/videos
- Docker Compose for production deployment
- Optional localhost-only Adminer database UI

The browser never connects directly to PostgreSQL. Public and admin screens call the same-origin `/api` backend, and the backend is the only process with database credentials.

## Content platform

Products, news, and projects share one structured CMS model. Each item has a low-detail card (title, abstract, cover image) and a full detail page driven by one of five templates: Showcase, Editorial, Technical, Case Study, or Gallery.

English, Persian, and Turkish content are stored as separate records. A missing translation does not silently fall back to English.

Admin routes include:

- `/admin/content` — products, news, and projects/work
- `/admin/pages` — standard About/Library pages by language
- `/admin/profile` — admin profile
- `/admin/analytics` — site analytics

## Authentication

Authentication is self-hosted. Passwords are hashed with Node's `scrypt` implementation and opaque session tokens are stored in PostgreSQL. On a fresh database, the first account created becomes the initial `manager`; later signups default to `member`.

Automatic password-reset email is not enabled until an SMTP/email provider is configured.

## Production deployment

Copy the server environment example and choose a strong PostgreSQL password:

```bash
cp .env.server.example .env.server
```

Then start the full stack:

```bash
docker compose --env-file .env.server up -d --build
```

By default the website/API listens on port `3000`. PostgreSQL is private to the Docker network and is not published to the internet.

For the full deployment, backup, Adminer, local-development, and reverse-proxy instructions, see [`docs/self-hosted-postgres.md`](docs/self-hosted-postgres.md).

## Local frontend development

Install the frontend dependencies:

```bash
npm ci
```

Start PostgreSQL and the API as described in `docs/self-hosted-postgres.md`, then run:

```bash
npm run dev
```

Vite proxies `/api` and `/uploads` to the local API on port 3000.

## Verification

GitHub Actions verifies the frontend typecheck/build, API syntax, starts a PostgreSQL 18 service, applies the real SQL migration, starts the API, and checks `/api/health` against the database.
