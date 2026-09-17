#!/usr/bin/env sh
set -eu

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 path/to/backup.sql" >&2
  exit 1
fi

ENV_FILE="${ENV_FILE:-.env.server}"
BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Backup file not found: $BACKUP_FILE" >&2
  exit 1
fi

cat "$BACKUP_FILE" | docker compose --env-file "$ENV_FILE" exec -T db psql -v ON_ERROR_STOP=1 -U aptus -d aptus
echo "Database restore completed from $BACKUP_FILE"
