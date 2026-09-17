#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEV_DIR="$ROOT_DIR/.dev"
ENV_FILE="$ROOT_DIR/.env.dev"
BACKEND_LOG="$DEV_DIR/backend.log"
FRONTEND_LOG="$DEV_DIR/frontend.log"
BACKEND_PID="$DEV_DIR/backend.pid"
FRONTEND_PID="$DEV_DIR/frontend.pid"

mkdir -p "$DEV_DIR"

info(){ printf "[aptus] %s\n" "$*"; }
ok(){ printf "[ok] %s\n" "$*"; }
fail(){ printf "[error] %s\n" "$*" >&2; exit 1; }

require(){ command -v "$1" >/dev/null 2>&1 || fail "$1 is required"; }

stop_pid(){
  local file="$1"
  [[ -f "$file" ]] || return
  local pid
  pid="$(cat "$file" 2>/dev/null || true)"
  if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
    kill -TERM "$pid" 2>/dev/null || true
  fi
  rm -f "$file"
}

cleanup(){
  stop_pid "$FRONTEND_PID"
  stop_pid "$BACKEND_PID"
}

wait_url(){
  local url="$1" label="$2" pid="$3" log="$4"
  for i in {1..120}; do
    if curl -fsS "$url" >/dev/null 2>&1; then ok "$label is ready"; return; fi
    kill -0 "$pid" 2>/dev/null || { tail -n 50 "$log"; return 1; }
    sleep 1
  done
  tail -n 50 "$log"
  return 1
}

setup_env(){
  if [[ ! -f "$ENV_FILE" ]]; then
    require openssl
    cat > "$ENV_FILE" <<EOF
BOOTSTRAP_ADMIN_EMAIL=manager@local.test
BOOTSTRAP_ADMIN_PASSWORD=$(openssl rand -hex 16)
AUTH_SECURE_COOKIE=false
EOF
    chmod 600 "$ENV_FILE" || true
    ok "Created .env.dev"
  fi
}

start(){
  require docker
  require npm
  require node
  require curl
  docker info >/dev/null 2>&1 || fail "Docker is not running"

  cleanup
  setup_env

  info "Starting PostgreSQL"
  docker compose up -d postgres

  for i in {1..60}; do
    docker compose exec -T postgres pg_isready >/dev/null 2>&1 && break
    sleep 1
  done

  : > "$BACKEND_LOG"
  : > "$FRONTEND_LOG"

  info "Starting API"
  (cd "$ROOT_DIR/server" && npm start) > "$BACKEND_LOG" 2>&1 &
  echo $! > "$BACKEND_PID"
  wait_url "http://localhost:8080/api/health" "API" "$(cat "$BACKEND_PID")" "$BACKEND_LOG"

  info "Starting website"
  (cd "$ROOT_DIR/frontend" && npm run dev) > "$FRONTEND_LOG" 2>&1 &
  echo $! > "$FRONTEND_PID"
  wait_url "http://localhost:3000" "Website" "$(cat "$FRONTEND_PID")" "$FRONTEND_LOG"

  echo
  ok "APTUS is running"
  echo "Website: http://localhost:3000"
  echo "API:     http://localhost:8080"
  echo
  echo "Logs: ./dev.sh logs"
  trap cleanup EXIT INT TERM
  while true; do sleep 2; done
}

stop(){ cleanup; docker compose stop postgres >/dev/null 2>&1 || true; ok "Stopped"; }
status(){ docker compose ps; }
logs(){ tail -f "$BACKEND_LOG" "$FRONTEND_LOG"; }

case "${1:-start}" in
 start) start ;;
 stop) stop ;;
 status) status ;;
 logs) logs ;;
 *) echo "Usage: ./dev.sh [start|stop|status|logs]" ;;
esac
