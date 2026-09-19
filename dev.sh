#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEV_DIR="$ROOT_DIR/.dev"
ENV_FILE="$ROOT_DIR/.env.dev"
BACKEND_LOG="$DEV_DIR/backend.log"
FRONTEND_LOG="$DEV_DIR/frontend.log"
BACKEND_PID_FILE="$DEV_DIR/backend.pid"
FRONTEND_PID_FILE="$DEV_DIR/frontend.pid"
DB_CONTAINER="aptus-dev-postgres"
DB_VOLUME="aptus_dev_postgres"
DB_IMAGE="postgres:18-alpine"

mkdir -p "$DEV_DIR"

info() { printf '\033[1;34m[dev]\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m[dev]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[dev]\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m[dev]\033[0m %s\n' "$*" >&2; exit 1; }

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "'$1' was not found. Install it first."
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
    fail "OpenSSL or Python 3 is required to generate the local PostgreSQL password."
  fi
}

ensure_dev_env() {
  if [[ ! -f "$ENV_FILE" ]]; then
    local random_password
    random_password="$(generate_password)"
    cat > "$ENV_FILE" <<EOF
# Local development only. This file is ignored by git.
POSTGRES_PASSWORD=$random_password
APTUS_DB_PORT=5432
APTUS_API_PORT=3000
APTUS_WEB_PORT=5173
DATABASE_POOL_SIZE=10
SESSION_TTL_DAYS=30
MAX_UPLOAD_MB=100
EOF
    chmod 600 "$ENV_FILE" 2>/dev/null || true
    ok "Created .env.dev with a generated local PostgreSQL password."
  fi

  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a

  : "${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required in .env.dev}"
  APTUS_DB_PORT="${APTUS_DB_PORT:-5432}"
  APTUS_API_PORT="${APTUS_API_PORT:-3000}"
  APTUS_WEB_PORT="${APTUS_WEB_PORT:-5173}"
  DATABASE_POOL_SIZE="${DATABASE_POOL_SIZE:-10}"
  SESSION_TTL_DAYS="${SESSION_TTL_DAYS:-30}"
  MAX_UPLOAD_MB="${MAX_UPLOAD_MB:-100}"
}

stop_pid_file() {
  local pid_file="$1"
  local label="$2"
  if [[ ! -f "$pid_file" ]]; then
    return
  fi

  local pid
  pid="$(cat "$pid_file" 2>/dev/null || true)"
  if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
    info "Stopping $label (PID $pid)..."
    if command -v pkill >/dev/null 2>&1; then
      pkill -TERM -P "$pid" 2>/dev/null || true
    fi
    kill -TERM "$pid" 2>/dev/null || true

    for _ in {1..20}; do
      kill -0 "$pid" 2>/dev/null || break
      sleep 0.2
    done

    if kill -0 "$pid" 2>/dev/null; then
      if command -v pkill >/dev/null 2>&1; then
        pkill -KILL -P "$pid" 2>/dev/null || true
      fi
      kill -KILL "$pid" 2>/dev/null || true
    fi
  fi

  rm -f "$pid_file"
}

cleanup_apps() {
  stop_pid_file "$FRONTEND_PID_FILE" "frontend"
  stop_pid_file "$BACKEND_PID_FILE" "backend"
}

wait_for_url() {
  local url="$1"
  local label="$2"
  local pid="$3"
  local log_file="$4"
  local attempts="${5:-90}"

  for ((i=1; i<=attempts; i++)); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      ok "$label is ready."
      return 0
    fi

    if ! kill -0 "$pid" 2>/dev/null; then
      warn "$label stopped before it became ready. Last log lines:"
      tail -n 80 "$log_file" 2>/dev/null || true
      return 1
    fi

    sleep 1
  done

  warn "$label did not become ready in time. Last log lines:"
  tail -n 80 "$log_file" 2>/dev/null || true
  return 1
}

check_node_version() {
  local major
  major="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || printf '0')"
  if (( major < 22 )); then
    fail "Node.js 22 or newer is required. Current version: $(node --version 2>/dev/null || printf 'unknown')"
  fi
}

port_in_use() {
  local port="$1"
  if command -v lsof >/dev/null 2>&1; then
    lsof -nP -iTCP:"$port" -sTCP:LISTEN -t >/dev/null 2>&1
    return
  fi

  if command -v nc >/dev/null 2>&1; then
    nc -z 127.0.0.1 "$port" >/dev/null 2>&1
    return
  fi

  return 1
}

check_app_ports() {
  if port_in_use "$APTUS_API_PORT"; then
    fail "API port $APTUS_API_PORT is already in use. Run 'bash dev.sh stop' or change APTUS_API_PORT in .env.dev."
  fi

  if port_in_use "$APTUS_WEB_PORT"; then
    fail "Frontend port $APTUS_WEB_PORT is already in use. Run 'bash dev.sh stop' or change APTUS_WEB_PORT in .env.dev."
  fi
}

ensure_postgres() {
  require_command docker
  docker info >/dev/null 2>&1 || fail "Docker is installed but not running. Start Docker Desktop/Engine and try again."

  if docker inspect "$DB_CONTAINER" >/dev/null 2>&1; then
    if [[ "$(docker inspect -f '{{.State.Running}}' "$DB_CONTAINER" 2>/dev/null || true)" != "true" ]]; then
      info "Starting existing development PostgreSQL container..."
      docker start "$DB_CONTAINER" >/dev/null
    else
      info "Development PostgreSQL is already running."
    fi
  else
    if port_in_use "$APTUS_DB_PORT"; then
      fail "PostgreSQL port $APTUS_DB_PORT is already in use. Change APTUS_DB_PORT in .env.dev or stop the other database."
    fi

    info "Creating development PostgreSQL container..."
    docker run -d \
      --name "$DB_CONTAINER" \
      --restart unless-stopped \
      -e POSTGRES_DB=aptus \
      -e POSTGRES_USER=aptus \
      -e "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" \
      -p "127.0.0.1:${APTUS_DB_PORT}:5432" \
      -v "${DB_VOLUME}:/var/lib/postgresql" \
      "$DB_IMAGE" >/dev/null
  fi

  info "Waiting for PostgreSQL..."
  for _ in {1..60}; do
    if docker exec "$DB_CONTAINER" pg_isready -U aptus -d aptus >/dev/null 2>&1; then
      ok "PostgreSQL is ready."
      return
    fi
    sleep 1
  done

  docker logs --tail=80 "$DB_CONTAINER" 2>/dev/null || true
  fail "PostgreSQL did not become ready."
}

install_dependencies() {
  if [[ ! -d "$ROOT_DIR/node_modules" ]]; then
    info "First run: installing frontend dependencies..."
    (cd "$ROOT_DIR" && npm ci)
  fi

  if [[ ! -d "$ROOT_DIR/server/node_modules" ]]; then
    info "First run: installing API dependencies..."
    (cd "$ROOT_DIR" && npm install --prefix server --ignore-scripts)
  fi
}

export_database_env() {
  export PGHOST=127.0.0.1
  export PGPORT="$APTUS_DB_PORT"
  export PGDATABASE=aptus
  export PGUSER=aptus
  export PGPASSWORD="$POSTGRES_PASSWORD"
  export DATABASE_POOL_SIZE
  export SESSION_TTL_DAYS
  export MAX_UPLOAD_MB
}

run_migrations() {
  export_database_env
  info "Applying PostgreSQL migrations..."
  (cd "$ROOT_DIR" && npm run migrate --prefix server)
}

start_all() {
  require_command docker
  require_command node
  require_command npm
  require_command curl
  check_node_version

  ensure_dev_env
  cleanup_apps
  check_app_ports
  ensure_postgres
  install_dependencies
  run_migrations

  mkdir -p "$ROOT_DIR/data/uploads"
  : > "$BACKEND_LOG"
  : > "$FRONTEND_LOG"

  info "Starting Express API..."
  (
    cd "$ROOT_DIR"
    export_database_env
    export NODE_ENV=development
    export PORT="$APTUS_API_PORT"
    export UPLOAD_DIR="$ROOT_DIR/data/uploads"
    exec node server/src/index.js
  ) > "$BACKEND_LOG" 2>&1 &
  local backend_pid=$!
  echo "$backend_pid" > "$BACKEND_PID_FILE"

  wait_for_url "http://127.0.0.1:${APTUS_API_PORT}/api/health" "API" "$backend_pid" "$BACKEND_LOG" 120 || {
    cleanup_apps
    exit 1
  }

  info "Starting Vite frontend..."
  (
    cd "$ROOT_DIR"
    export APTUS_API_PROXY="http://127.0.0.1:${APTUS_API_PORT}"
    exec npm run dev -- --host 127.0.0.1 --port "$APTUS_WEB_PORT" --strictPort
  ) > "$FRONTEND_LOG" 2>&1 &
  local frontend_pid=$!
  echo "$frontend_pid" > "$FRONTEND_PID_FILE"

  wait_for_url "http://127.0.0.1:${APTUS_WEB_PORT}" "Frontend" "$frontend_pid" "$FRONTEND_LOG" 120 || {
    cleanup_apps
    exit 1
  }

  printf '\n'
  ok "APTUS development stack is running."
  printf '  Website:        http://localhost:%s\n' "$APTUS_WEB_PORT"
  printf '  Backend API:    http://localhost:%s/api\n' "$APTUS_API_PORT"
  printf '  Backend health: http://localhost:%s/api/health\n' "$APTUS_API_PORT"
  printf '  PostgreSQL:     localhost:%s\n' "$APTUS_DB_PORT"
  printf '\n'
  printf '  Backend log:    .dev/backend.log\n'
  printf '  Frontend log:   .dev/frontend.log\n'
  printf '  Live logs:      bash dev.sh logs\n'
  printf '\n'
  info "On a fresh database, the first website account you sign up with becomes the Manager account."
  info "Press Ctrl+C to stop frontend and backend. PostgreSQL stays running for the next start."
  info "To stop everything: bash dev.sh stop"

  if [[ "$(uname -s)" == "Darwin" && "${DEV_NO_OPEN:-0}" != "1" ]]; then
    open "http://localhost:${APTUS_WEB_PORT}" >/dev/null 2>&1 || true
  fi

  trap 'cleanup_apps; printf "\n"; info "Frontend and backend stopped. PostgreSQL is still running."; exit 0' INT TERM
  trap 'cleanup_apps' EXIT

  while true; do
    if ! kill -0 "$backend_pid" 2>/dev/null; then
      warn "Backend stopped. Last log lines:"
      tail -n 80 "$BACKEND_LOG" 2>/dev/null || true
      return 1
    fi

    if ! kill -0 "$frontend_pid" 2>/dev/null; then
      warn "Frontend stopped. Last log lines:"
      tail -n 80 "$FRONTEND_LOG" 2>/dev/null || true
      return 1
    fi

    sleep 2
  done
}

stop_all() {
  ensure_dev_env
  cleanup_apps

  if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
    if docker inspect "$DB_CONTAINER" >/dev/null 2>&1; then
      info "Stopping development PostgreSQL..."
      docker stop "$DB_CONTAINER" >/dev/null 2>&1 || true
    fi
  fi

  ok "APTUS development stack stopped. PostgreSQL data is preserved."
}

show_status() {
  ensure_dev_env

  printf 'PostgreSQL: '
  if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1 && docker inspect "$DB_CONTAINER" >/dev/null 2>&1; then
    if [[ "$(docker inspect -f '{{.State.Running}}' "$DB_CONTAINER" 2>/dev/null || true)" == "true" ]]; then
      printf 'running on localhost:%s\n' "$APTUS_DB_PORT"
    else
      printf 'stopped\n'
    fi
  else
    printf 'not created / Docker unavailable\n'
  fi

  printf 'Backend:    '
  if curl -fsS "http://127.0.0.1:${APTUS_API_PORT}/api/health" >/dev/null 2>&1; then
    printf 'running on localhost:%s\n' "$APTUS_API_PORT"
  else
    printf 'not running\n'
  fi

  printf 'Frontend:   '
  if curl -fsS "http://127.0.0.1:${APTUS_WEB_PORT}" >/dev/null 2>&1; then
    printf 'running on localhost:%s\n' "$APTUS_WEB_PORT"
  else
    printf 'not running\n'
  fi
}

reset_db() {
  require_command docker
  docker info >/dev/null 2>&1 || fail "Docker is not running."

  if [[ "${2:-}" != "--yes" ]]; then
    printf 'This will delete ALL local development PostgreSQL data. Continue? [y/N] '
    read -r answer
    [[ "$answer" =~ ^[Yy]$ ]] || { info "Cancelled."; exit 0; }
  fi

  cleanup_apps
  docker rm -f "$DB_CONTAINER" >/dev/null 2>&1 || true
  docker volume rm "$DB_VOLUME" >/dev/null 2>&1 || true
  ok "Development database deleted. The next 'bash dev.sh' will create a fresh database."
}

show_logs() {
  touch "$BACKEND_LOG" "$FRONTEND_LOG"
  tail -n 80 -f "$BACKEND_LOG" "$FRONTEND_LOG"
}

show_db_logs() {
  require_command docker
  docker info >/dev/null 2>&1 || fail "Docker is not running."
  docker logs -f --tail=100 "$DB_CONTAINER"
}

show_help() {
  cat <<'EOF'
APTUS local development launcher

Usage:
  bash dev.sh                 Start PostgreSQL + API + Vite frontend
  bash dev.sh start           Same as above
  bash dev.sh stop            Stop frontend, backend, and PostgreSQL
  bash dev.sh status          Show service status
  bash dev.sh logs            Follow frontend/backend logs
  bash dev.sh db-logs         Follow PostgreSQL logs
  bash dev.sh reset-db        Delete the local development database
  bash dev.sh reset-db --yes  Reset the database without confirmation
  bash dev.sh help            Show this help

Development URLs:
  Frontend:   http://localhost:5173
  API:        http://localhost:3000/api
  PostgreSQL: localhost:5432

Notes:
  - .env.dev is generated automatically and ignored by git.
  - PostgreSQL runs in Docker; the API and Vite frontend run directly on your machine.
  - The first account created in a fresh database becomes the Manager.
  - aptus.sh remains the production/all-in-Docker launcher for servers.
EOF
}

case "${1:-start}" in
  start|dev)
    start_all
    ;;
  stop)
    stop_all
    ;;
  status)
    show_status
    ;;
  reset-db)
    reset_db "$@"
    ;;
  logs)
    show_logs
    ;;
  db-logs)
    show_db_logs
    ;;
  help|-h|--help)
    show_help
    ;;
  *)
    show_help
    exit 1
    ;;
esac
