#!/bin/sh
# Sauvegarde quotidienne de PostgreSQL vers Garage (bucket sovlens-backups).
# Exécuté par le service Swarm « backup » : les identifiants S3 sont lus depuis
# les Docker secrets, le mot de passe Postgres est injecté par le pipeline.
set -eu

apk add --no-cache aws-cli >/dev/null

export AWS_ACCESS_KEY_ID="$(cat /run/secrets/backup_s3_access_key)"
export AWS_SECRET_ACCESS_KEY="$(cat /run/secrets/backup_s3_secret_key)"
export AWS_DEFAULT_REGION=garage
export PGPASSWORD="$POSTGRES_PASSWORD"

BACKUP_HOUR_UTC="${BACKUP_HOUR_UTC:-1}"

run_backup() {
  set -o pipefail
  key="postgres/sovlens_$(date -u +%Y-%m-%d_%H-%M-%S).sql.gz"
  pg_dump -h postgres -U "$POSTGRES_USER" "$POSTGRES_DB" \
    | gzip \
    | aws --endpoint-url "$S3_ENDPOINT" s3 cp - "s3://${S3_BUCKET}/${key}"
  echo "$(date -u) Sauvegarde terminée : s3://${S3_BUCKET}/${key}"
}

echo "$(date -u) Service de sauvegarde démarré (tous les jours à ${BACKUP_HOUR_UTC}h UTC)"

while true; do
  now=$(date -u +%s)
  wait=$(( (BACKUP_HOUR_UTC * 3600 - now % 86400 + 86400) % 86400 ))
  [ "$wait" -eq 0 ] && wait=86400
  sleep "$wait"
  if ! run_backup; then
    echo "$(date -u) ERREUR : la sauvegarde a échoué" >&2
  fi
done
