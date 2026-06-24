# PhotoApp

Application web de gestion de photos souveraine — alternative open source à Google Photos.

L'utilisateur peut stocker ses photos sur le cloud (VPS) ou sur son propre serveur (homelab)
depuis l'interface web ou mobile, sans dépendre d'un GAFAM.

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Next.js 16 |
| Backend | NestJS 11 + Fastify |
| ORM | Drizzle 0.45 |
| Base de données | PostgreSQL 17 |
| Stockage objet | Garage (S3 compatible) |
| Reverse proxy | Caddy |
| CI/CD | GitLab CI |
| Monitoring | Prometheus + Grafana |

## Fonctionnalités

- Inscription / Connexion sécurisée (JWT)
- Upload de photos (drag & drop, max 10MB)
- Galerie avec vues détaillées
- Gestion d'albums
- Partage via lien public
- **Killer Feature** : switch stockage cloud ↔ homelab depuis les paramètres

## Prérequis

- Docker et Docker Compose installés
- Node.js 22+
- Un compte GitLab

## Installation locale

```bash
# Cloner le repo
git clone https://gitlab.com/laplateforme/projet-fil-rouge.git
cd projet-fil-rouge

# Copier les variables d'environnement
cp .env.example .env

# Lancer l'application
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
DATABASE_URL=postgresql://user:password@db:5432/photoapp

# JWT
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d

# Stockage cloud (Garage VPS)
S3_CLOUD_ENDPOINT=http://garage:3900
S3_CLOUD_ACCESS_KEY=your_access_key
S3_CLOUD_SECRET_KEY=your_secret_key
S3_CLOUD_BUCKET=photos

# Stockage homelab (optionnel)
S3_HOMELAB_ENDPOINT=http://your-homelab-ip:3900
S3_HOMELAB_ACCESS_KEY=your_access_key
S3_HOMELAB_SECRET_KEY=your_secret_key
S3_HOMELAB_BUCKET=photos
```

## Structure du projet

```
projet-fil-rouge/
├── frontend/          # Next.js 16
├── backend/           # NestJS 11
├── docker-compose.yml # Dev local
├── docker-compose.prod.yml # Production
├── Caddyfile          # Config reverse proxy
├── .gitlab-ci.yml     # Pipeline CI/CD
├── .env.example       # Variables d'environnement
└── docs/              # Documentation technique
    ├── architecture/
    │   ├── c4-containers.md
    │   └── sequence-killer-feature.md
    ├── technical-choices.md
    ├── green-it.md
    ├── accessibility.md
    └── api.md
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

Le déploiement est automatisé via GitLab CI/CD.
Tout push sur `main` déclenche le pipeline :
1. Lint
2. Tests unitaires
3. Scan qualité SonarQube
4. Build image Docker
5. Push GitLab Registry
6. Deploy sur VPS via SSH

## Documentation

La documentation complète est dans le dossier [`/docs`](./docs).

## Licence

MIT