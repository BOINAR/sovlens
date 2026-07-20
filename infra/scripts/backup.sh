#!/bin/bash
set -euo pipefail

DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR=/home/nayeff/backups/postgres
CREDS_FILE=/home/nayeff/backups/.s3-backup-credentials
BUCKET=sovlens-backups
ENDPOINT=http://garage:3900
NETWORK=sovlens_sovlens-net

mkdir -p "$BACKUP_DIR"

PG_CONTAINER=$(docker ps -q -f name=sovlens_postgres)
DUMP_FILE="$BACKUP_DIR/sovlens_${DATE}.sql.gz"

# 1. Dump PostgreSQL
docker exec "$PG_CONTAINER" pg_dump -U sovlens sovlens_db | gzip > "$DUMP_FILE"

# 2. Rotation locale : conserver 7 jours
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete

# 3. Upload vers Garage (bucket dédié sovlens-backups)
ACCESS_KEY=$(sed -n '1p' "$CREDS_FILE")
SECRET_KEY=$(sed -n '2p' "$CREDS_FILE")

docker run --rm --network "$NETWORK" \
  -e AWS_ACCESS_KEY_ID="$ACCESS_KEY" \
  -e AWS_SECRET_ACCESS_KEY="$SECRET_KEY" \
  -e AWS_DEFAULT_REGION=garage \
  -v "$BACKUP_DIR":/backup:ro \
  amazon/aws-cli --endpoint-url "$ENDPOINT" s3 cp "/backup/sovlens_${DATE}.sql.gz" "s3://$BUCKET/postgres/sovlens_${DATE}.sql.gz"

echo "Backup terminé : $DUMP_FILE (local + Garage)"