#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

ENV_FILE=".env.server"
ENV_EXAMPLE=".env.server.example"
COMPOSE=(docker compose --env-file "$ENV_FILE")

info() { printf '\033[1;34m[APTUS]\033[0m %s\n' "$*"; }
ok() { printf '\033[1;32m[APTUS]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[APTUS]\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m[APTUS]\033[0m %s\n' "$*" >&2; exit 1; }

require_docker() {
  command -v docker >/dev/null 2>&1 || fail "Docker is not installed. Install Docker Desktop (Mac/Windows) or Docker Engine + Compose (Linux)."
  docker compose version >/dev/null 2>&1 || fail "Docker Compose v2 is required (the 'docker compose' command)."
  docker info >/dev/null 2>&1 || fail "Docker is installed but the Docker daemon is not running. Start Docker Desktop/Engine and run this file again."
}

generate_password() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 32
  elif command -v python3 >/dev/null 2>&1; then
    python3 - <<'PY'
import secrets
print(secrets.token_hex(32))
PY
  else
    fail "Could not generate a secure database password. Install OpenSSL or Python 3, or create .env.server manually from .env.server.example."
  fi
}

ensure_env() {
  if [[ -f "$ENV_FILE" ]]; then
    return
  fi

  [[ -f "$ENV_EXAMPLE" ]] || fail "$ENV_EXAMPLE is missing. Pull the latest repository version first."

  local password
  password="$(generate_password)"

  cat > "$ENV_FILE" <<EOF
# Generated automatically by aptus.sh. Keep this file private and never commit it.
POSTGRES_PASSWORD=$password
APTUS_PORT=3000
ADMINER_PORT=8080
DATABASE_POOL_SIZE=10
SESSION_TTL_DAYS=30
MAX_UPLOAD_MB=100
EOF

  chmod 600 "$ENV_FILE" 2>/dev/null || true
  ok "Created private $ENV_FILE with a generated PostgreSQL password."
}

read_env_value() {
  local key="$1"
  local fallback="$2"
  local value
  value="$(grep -E "^${key}=" "$ENV_FILE" 2>/dev/null | tail -n 1 | cut -d= -f2- || true)"
  printf '%s' "${value:-$fallback}"
}

wait_for_app() {
  local port
  port="$(read_env_value APTUS_PORT 3000)"

  if ! command -v curl >/dev/null 2>&1; then
    warn "curl is not installed; skipping the HTTP health check."
    return
  fi

  info "Checking application health..."
  local attempt
  for attempt in $(seq 1 60); do
    if curl -fsS "http://127.0.0.1:${port}/api/health" >/dev/null 2>&1; then
      ok "APTUS is running at http://localhost:${port}"
      return
    fi
    sleep 2
  done

  warn "Containers started, but the API health check did not become ready. Showing container status:"
  "${COMPOSE[@]}" ps
  warn "Run 'bash aptus.sh logs' to inspect the application logs."
}

start_stack() {
  require_docker
  ensure_env
  info "Building and starting APTUS + PostgreSQL..."
  "${COMPOSE[@]}" up -d --build
  wait_for_app
}

stop_stack() {
  require_docker
  ensure_env
  info "Stopping APTUS..."
  "${COMPOSE[@]}" down
}

show_help() {
  cat <<'EOF'
APTUS one-command launcher

Usage:
  bash aptus.sh              Build and start the website, API, and PostgreSQL
  bash aptus.sh start        Same as above
  bash aptus.sh rebuild      Rebuild after code changes and start
  bash aptus.sh restart      Restart all services
  bash aptus.sh stop         Stop the stack (data is preserved)
  bash aptus.sh status       Show container status
  bash aptus.sh logs         Follow website/API and database logs
  bash aptus.sh tools        Start Adminer database UI on localhost:8080
  bash aptus.sh backup       Create a PostgreSQL backup
  bash aptus.sh restore FILE Restore a PostgreSQL backup file
  bash aptus.sh help         Show this help

Notes:
  - .env.server is generated automatically on first run and is intentionally ignored by Git.
  - PostgreSQL data and uploaded media are stored in persistent Docker volumes.
  - Do not use 'docker compose down -v' unless you intentionally want to delete local data.
EOF
}

command_name="${1:-start}"

case "$command_name" in
  start|rebuild)
    start_stack
    ;;
  restart)
    require_docker
    ensure_env
    info "Restarting APTUS..."
    "${COMPOSE[@]}" down
    "${COMPOSE[@]}" up -d --build
    wait_for_app
    ;;
  stop)
    stop_stack
    ;;
  status)
    require_docker
    ensure_env
    "${COMPOSE[@]}" ps
    ;;
  logs)
    require_docker
    ensure_env
    "${COMPOSE[@]}" logs -f --tail=200
    ;;
  tools)
    require_docker
    ensure_env
    info "Starting Adminer database UI..."
    "${COMPOSE[@]}" --profile tools up -d adminer
    adminer_port="$(read_env_value ADMINER_PORT 8080)"
    ok "Adminer is available locally at http://127.0.0.1:${adminer_port}"
    ;;
  backup)
    require_docker
    ensure_env
    [[ -f scripts/backup-db.sh ]] || fail "scripts/backup-db.sh is missing."
    bash scripts/backup-db.sh
    ;;
  restore)
    require_docker
    ensure_env
    [[ $# -ge 2 ]] || fail "Usage: bash aptus.sh restore backups/your-backup.sql"
    [[ -f scripts/restore-db.sh ]] || fail "scripts/restore-db.sh is missing."
    bash scripts/restore-db.sh "$2"
    ;;
  help|-h|--help)
    show_help
    ;;
  *)
    show_help
    fail "Unknown command: $command_name"
    ;;
esac
