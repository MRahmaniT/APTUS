# Self-hosted PostgreSQL deployment

APTUS now uses a local PostgreSQL database and a small Node/Express API. The browser never connects directly to PostgreSQL.

## Architecture

- React/Vite frontend
- Node 22 + Express API
- PostgreSQL 18 database
- Server filesystem for uploaded images/videos
- Optional Adminer browser UI for database inspection

All persistent data stays on the server in Docker volumes:

- `aptus_db_data` — PostgreSQL data
- `aptus_uploads` — uploaded CMS images/videos

The old Supabase project is not required by the application after this migration and can be kept temporarily as a rollback/archive source.

## Production deployment with Docker Compose

1. Install Docker Engine and Docker Compose on the server.
2. Copy the repository to the server and enter the project directory.
3. Create the server environment file:

```bash
cp .env.server.example .env.server
```

4. Edit `.env.server` and replace `POSTGRES_PASSWORD` with a long random password.
5. Build and start APTUS:

```bash
docker compose --env-file .env.server up -d --build
```

The application will be available on `APTUS_PORT` (default `3000`). PostgreSQL is **not** published to the public network.

The app container runs SQL migrations automatically before starting the API.

## First administrator

On a completely new database, the first account created through the website becomes `manager`. Every later signup starts as `member`. Managers/admins can continue using the existing role-management UI/API.

## Database UI (Adminer)

Adminer is optional and is bound to `127.0.0.1` only. Start it with:

```bash
docker compose --env-file .env.server --profile tools up -d adminer
```

On the server itself, open `http://127.0.0.1:8080` (or `ADMINER_PORT`). For a remote server, use an SSH tunnel rather than exposing Adminer publicly:

```bash
ssh -L 8080:127.0.0.1:8080 your-user@your-server
```

Then open `http://127.0.0.1:8080` on your computer.

Adminer login values:

- System: PostgreSQL
- Server: `db`
- Username: `aptus`
- Password: your `POSTGRES_PASSWORD`
- Database: `aptus`

## Local development

Start only PostgreSQL:

```bash
docker compose --env-file .env.server up -d db
```

Install API dependencies:

```bash
npm install --prefix server
```

Run migrations:

```bash
DATABASE_URL='postgresql://aptus:YOUR_PASSWORD@127.0.0.1:5432/aptus' npm run migrate --prefix server
```

Run the API:

```bash
DATABASE_URL='postgresql://aptus:YOUR_PASSWORD@127.0.0.1:5432/aptus' npm run start --prefix server
```

In another terminal run the frontend:

```bash
npm run dev
```

Vite proxies `/api` and `/uploads` to `http://127.0.0.1:3000`.

## Backups

Create a database backup:

```bash
./scripts/backup-db.sh
```

Restore a backup into the running database:

```bash
./scripts/restore-db.sh backups/aptus-YYYYMMDD-HHMMSS.sql
```

Back up uploaded files separately. For example:

```bash
docker run --rm \
  -v aptus_aptus_uploads:/data:ro \
  -v "$PWD/backups":/backup \
  alpine sh -c 'tar czf /backup/aptus-uploads.tgz -C /data .'
```

The exact Docker volume prefix may differ depending on the Compose project directory/name; check with `docker volume ls`.

## Reverse proxy / HTTPS

For a public deployment, put Nginx, Caddy, Traefik, or your hosting provider's reverse proxy in front of port 3000 and terminate HTTPS there. Only the public HTTP/HTTPS proxy needs to be reachable from the internet; keep PostgreSQL and Adminer private.

## Password reset

Local email/password authentication is active. Automatic forgot-password email is intentionally not enabled until an SMTP/email provider is configured. The UI reports this clearly instead of sending data to a third party.
