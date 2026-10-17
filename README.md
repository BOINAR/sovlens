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

Aucun secret n'est stocké dans le dépôt ni sur le serveur : ils sont définis dans les GitHub Secrets et injectés au moment du déploiement, en variables d'environnement ou en Docker secrets. L'inventaire est dans [`documentation/architecture/secrets.md`](./documentation/architecture/secrets.md).

## Documentation

La documentation technique et les livrables sont dans [`documentation/`](./documentation).

## Licence

MIT
