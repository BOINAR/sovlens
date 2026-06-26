# Sovlens

Application web de gestion de photos souveraine — alternative open source à Google Photos.

L'utilisateur peut stocker ses photos sur le cloud ou sur son propre serveur auto-hébergé, depuis une interface web ou mobile, sans dépendre d'un GAFAM.

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Next.js 16 |
| Backend | NestJS 11 + Fastify |
| ORM | Drizzle ORM v1 RC |
| Validation | Drizzle Zod |
| Base de données | PostgreSQL 18 |
| Stockage objet | Garage (S3 compatible) |
| Reverse proxy | Caddy |
| Orchestration | Docker Swarm |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus + Grafana |

## Fonctionnalités

- Inscription / Connexion sécurisée (JWT)
- Upload de photos (drag & drop, max 10MB)
- Galerie avec vues détaillées
- Gestion d'albums
- Partage via lien public
- **Killer Feature** : switch stockage cloud ↔ stockage souverain depuis les paramètres

## Prérequis

- Docker installé
- Docker Swarm initialisé
- Node.js 22+
- Un compte GitHub

## Installation locale

```bash
# Cloner le repo
git clone git@github.com:BOINAR/sovlens.git
cd sovlens

# Copier les variables d'environnement
cp .env.example .env

# Lancer l'application en développement local
docker compose up -d
```

L'application est accessible sur :

- Frontend : http://localhost:3000
- Backend API : http://localhost:4000
- Documentation API : http://localhost:4000/api/docs
- Grafana : http://localhost:3001

## Variables d'environnement

Copier `.env.example` en `.env` et remplir les valeurs :

```env
# Base de données
DATABASE_URL=postgresql://user:password@db:5432/sovlens

# JWT
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d

# Stockage cloud
S3_CLOUD_ENDPOINT=http://garage:3900
S3_CLOUD_ACCESS_KEY=your_access_key
S3_CLOUD_SECRET_KEY=your_secret_key
S3_CLOUD_BUCKET=photos

# Stockage souverain auto-hébergé
S3_SOVEREIGN_ENDPOINT=http://your-homelab-endpoint:3900
S3_SOVEREIGN_ACCESS_KEY=your_access_key
S3_SOVEREIGN_SECRET_KEY=your_secret_key
S3_SOVEREIGN_BUCKET=photos
```

## Structure du projet

```text
sovlens/
├── frontend/              # Next.js 16
├── backend/               # NestJS 11 + Fastify
├── infra/                 # Infrastructure Docker Swarm, Caddy, monitoring
├── documentation/         # Documentation technique et livrables
│   └── architecture/
│       ├── C4-Diagram-containers.md
│       ├── README.md
│       ├── class-diagram.md
│       ├── green-it.md
│       ├── sequence-killer-feature.md
│       ├── sequence-sharing.md
│       ├── technical-choices.md
│       └── use-case-diagram.md
├── docker-compose.yml     # Développement local
├── docker-stack.yml       # Déploiement Docker Swarm
├── Caddyfile              # Reverse proxy HTTPS
├── .github/workflows/     # Pipelines GitHub Actions
└── .env.example
```

## Lancer les tests

```bash
# Tests unitaires
docker compose exec backend npm run test

# Tests avec couverture
docker compose exec backend npm run test:cov

# Tests E2E
docker compose exec backend npm run test:e2e
```

## Déploiement

Le déploiement cible repose sur Docker Swarm.

Tout push sur `main` déclenche le pipeline GitHub Actions :

1. Lint
2. Tests unitaires
3. Scan qualité
4. Build des images Docker
5. Push vers le registry
6. Déploiement sur le VPS via SSH
7. Mise à jour de la stack Docker Swarm

Exemple de déploiement manuel :

```bash
docker stack deploy -c docker-stack.yml sovlens
```

## Documentation

La documentation complète est dans le dossier [`/documentation`](./documentation).

## Licence

MIT