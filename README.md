# SovLens

Application web de gestion de photos souveraine, alternative open source à Google Photos.

L'utilisateur choisit où sont stockées ses photos : sur le stockage cloud SovLens, ou sur son propre serveur S3 auto-hébergé. La bascule se fait à tout moment depuis l'interface, sans changer l'expérience d'utilisation.

Production : https://sovlens.stellodev.com

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Backend | NestJS 11 + Fastify |
| ORM | Drizzle ORM |
| Validation | Zod 4 |
| Base de données | PostgreSQL 18 |
| Stockage objet | Garage (compatible S3) |
| Reverse proxy | Caddy |
| Orchestration | Docker Swarm |
| CI/CD | GitHub Actions, GHCR, SonarCloud |
| Monitoring | Prometheus, Grafana, cAdvisor, node-exporter |

## Fonctionnalités

- Inscription, connexion (JWT + refresh token en cookie httpOnly) et réinitialisation du mot de passe par e-mail
- Upload de photos (JPEG, PNG, WebP, GIF, 10 Mo maximum)
- Galerie filtrée selon le mode de stockage actif
- Albums
- Partage par lien public avec expiration
- **Killer feature** : bascule cloud ↔ souverain, implémentée avec le pattern Strategy (`IStorageProvider` → `CloudStorageProvider` / `SovereignStorageProvider`)

## Structure du projet

```text
sovlens/
├── backend/                 # API NestJS + Fastify
├── frontend/                # Application Next.js
├── infra/                   # Stack Docker Swarm, Caddyfile, template Garage, script de sauvegarde
├── monitoring/              # Stack Prometheus + Grafana
├── documentation/           # Analyse, architecture, base de données, API, gestion de projet
└── .github/workflows/       # Pipeline CI/CD
```

## Développement local

Le dépôt n'a pas de `package.json` racine : chaque application se lance depuis son dossier.

### Prérequis

- Node.js 22 et pnpm
- Une base PostgreSQL, un Garage S3 et un serveur SMTP de test (Mailpit)

### Backend

```bash
cd backend
pnpm install
pnpm start:dev        # http://localhost:3001
```

Variables attendues dans `backend/.env` (fichier non versionné) :

```env
DATABASE_URL=postgresql://user:password@host:5432/sovlens
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=

MAIL_HOST=
MAIL_PORT=1025
MAIL_FROM=noreply@sovlens.local

S3_CLOUD_ENDPOINT=
S3_CLOUD_REGION=garage
S3_CLOUD_ACCESS_KEY=
S3_CLOUD_SECRET_KEY=
S3_CLOUD_BUCKET=
```

Le stockage souverain n'a pas de variable d'environnement : l'endpoint, le bucket et les clés de chaque utilisateur sont saisis dans **Paramètres** et enregistrés dans la table `storage_profiles`.

Migrations de base de données :

```bash
pnpm exec drizzle-kit migrate
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev              # http://localhost:3000
```

L'URL de l'API se règle avec `NEXT_PUBLIC_API_URL` (par défaut `http://localhost:3001`).

## Tests

```bash
cd backend
pnpm test             # tests unitaires
pnpm test:cov         # avec couverture
pnpm test:e2e         # tests E2E
```

## Déploiement

Tout push sur `main` déclenche le pipeline `.github/workflows/ci-cd.yml` :

1. Lint et tests du backend, analyse SonarCloud
2. Lint et build du frontend
3. Build des images Docker et push sur GHCR
4. Déploiement de la stack applicative sur le VPS (Docker Swarm)
5. Déploiement de la stack de monitoring

Chaque déploiement nettoie le disque du VPS sans toucher aux autres projets : il supprime les anciennes images SovLens (elles restent dans GHCR pour un retour arrière) et les images de monitoring remplacées, et limite l'historique Swarm à 2 conteneurs arrêtés par service. Les logs de chaque conteneur sont plafonnés à 3 fichiers de 10 Mo.

Aucun secret n'est stocké dans le dépôt ni sur le serveur : ils sont définis dans les GitHub Secrets et injectés au moment du déploiement, en variables d'environnement ou en Docker secrets. L'inventaire est dans [`documentation/architecture/secrets.md`](./documentation/architecture/secrets.md).

## Sauvegarde et restauration

Le service Swarm `backup` fait un dump de PostgreSQL chaque jour à 1 h UTC et l'envoie dans le bucket Garage `sovlens-backups`, sous `postgres/`. Ses logs : `docker service logs sovlens_backup`.

### Restaurer un dump

Sur le VPS, arrêter le backend pour libérer la base :

```bash
docker service scale sovlens_backend=0
```

Ouvrir un shell dans le conteneur de sauvegarde, qui dispose des outils et des identifiants :

```bash
docker exec -it $(docker ps -q -f name=sovlens_backup) sh
```

Dans le conteneur :

```sh
export AWS_ACCESS_KEY_ID="$(cat /run/secrets/backup_s3_access_key)"
export AWS_SECRET_ACCESS_KEY="$(cat /run/secrets/backup_s3_secret_key)"
export AWS_DEFAULT_REGION=garage PGPASSWORD="$POSTGRES_PASSWORD"

# Lister les dumps disponibles
aws --endpoint-url "$S3_ENDPOINT" s3 ls "s3://$S3_BUCKET/postgres/"

# Recréer la base vide
psql -h postgres -U "$POSTGRES_USER" -d postgres -c "DROP DATABASE \"$POSTGRES_DB\";"
psql -h postgres -U "$POSTGRES_USER" -d postgres -c "CREATE DATABASE \"$POSTGRES_DB\";"

# Restaurer le dump choisi
aws --endpoint-url "$S3_ENDPOINT" s3 cp "s3://$S3_BUCKET/postgres/NOM_DU_DUMP.sql.gz" - \
  | gunzip | psql -h postgres -U "$POSTGRES_USER" "$POSTGRES_DB"

exit
```

Redémarrer le backend :

```bash
docker service scale sovlens_backend=1
```

## Mise en pause et redémarrage

L'application peut être arrêtée sans perte de données, puis remise en service à l'identique : toute l'infrastructure de production est décrite dans le dépôt et redéployée par le pipeline.

### Mettre en pause

1. **Désactiver le pipeline**, pour qu'un push sur `main` ne redéploie pas tout : *Actions → CI/CD SovLens → ⋯ → Disable workflow*.
2. **Arrêter les stacks** sur le VPS (`docker stop` ne suffit pas : Swarm relancerait les conteneurs) :

   ```bash
   docker stack rm monitoring
   docker stack rm sovlens
   ```

3. **Vérifier** : `docker service ls` doit être vide, et `docker volume ls` doit toujours lister les volumes `sovlens_*` (Postgres, Garage, certificats Caddy) et celui de Grafana.

Ce que `docker stack rm` conserve et supprime :

| Élément | Après l'arrêt | Au redémarrage |
|---|---|---|
| Volumes (base, photos, Grafana, certificats) | Conservés | Réutilisés tels quels |
| GitHub Secrets | Intacts | Réinjectés par le pipeline |
| Docker secrets Swarm (`external`) | Conservés | Recréés depuis GitHub |
| Config `backup_script` et réseau `sovlens_sovlens-net` | Supprimés | Recréés par le pipeline |
| Images Docker | Conservées dans GHCR | Retéléchargées |

Pendant la pause, le service `backup` est arrêté : plus aucun dump quotidien n'est produit.

### Redémarrer

1. **Vérifier les GitHub Secrets** listés dans [`secrets.md`](./documentation/architecture/secrets.md). `STAGING_STORAGE_ENCRYPTION_KEY` doit être **exactement** la même qu'avant la pause : sans elle, les identifiants S3 souverains chiffrés en base sont illisibles et les utilisateurs doivent les ressaisir.
2. **Réactiver le pipeline** : *Actions → CI/CD SovLens → Enable workflow*.
3. **Relancer le déploiement** : *Re-run all jobs* sur le dernier run de `main`, ou un nouveau push sur `main`.
4. **Contrôler** :

   ```bash
   curl -s https://sovlens-api.stellodev.com/health                                     # {"status":"ok"}
   curl -s -o /dev/null -w '%{http_code}\n' https://sovlens-api.stellodev.com/metrics  # 404
   docker service ls                                                                    # toutes les répliques à 1/1
   ```

Le mode cloud est alors pleinement fonctionnel. Le mot de passe admin de Grafana est conservé dans son volume.

### Mode souverain : prérequis hors pipeline

Le mode souverain s'appuie sur le Garage du homelab (`192.168.1.20:3900`), joint depuis le VPS par Tailscale. Ces éléments ne sont pas déployés par le pipeline :

1. **Conteneurs du homelab** (`ubuntu-server`) :

   ```bash
   docker start sovlens-garage sovlens-postgres mailpit
   docker update --restart=unless-stopped sovlens-garage sovlens-postgres mailpit
   ```

2. **Tailscale sur le VPS**, avec acceptation des routes de sous-réseau :

   ```bash
   sudo tailscale up --accept-routes
   ```

   Puis, dans la console Tailscale : approuver la route `192.168.1.20/32` du routeur de sous-réseau `pve`, désactiver l'expiration de clé du VPS et restreindre l'ACL du VPS aux ports `3900` (S3) et `3903` (métriques) du homelab.

3. **Contrôler depuis le VPS** : `curl -s -o /dev/null -w '%{http_code}\n' http://192.168.1.20:3903/metrics` doit renvoyer `401`, `403` ou `200`, et non `000`.

L'adresse `192.168.1.20` est autorisée comme endpoint souverain par `SOVEREIGN_ENDPOINT_ALLOWED_HOSTS` dans `infra/docker-stack.yml` (protection SSRF). Toute autre adresse privée est refusée.

## Documentation

La documentation technique et les livrables sont dans [`documentation/`](./documentation).

## Licence

MIT
