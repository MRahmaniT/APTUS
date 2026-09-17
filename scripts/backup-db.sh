#!/usr/bin/env sh
set -eu

ENV_FILE="${ENV_FILE:-.env.server}"
BACKUP_DIR="${BACKUP_DIR:-backups}"
STAMP="$(date +%Y%m%d-%H%M%S)"
TARGET="$BACKUP_DIR/aptus-$STAMP.sql"

mkdir -p "$BACKUP_DIR"
docker compose --env-file "$ENV_FILE" exec -T db pg_dump -U aptus -d aptus > "$TARGET"
echo "Database backup written to $TARGET"
