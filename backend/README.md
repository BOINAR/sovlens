# SovLens — Backend

API REST NestJS 11 sur Fastify, avec Drizzle ORM et PostgreSQL 18.

## Lancer en local

```bash
pnpm install
pnpm start:dev        # http://localhost:3001
```

Les variables d'environnement attendues sont décrites dans le [README racine](../README.md#backend).

## Modules

| Module | Rôle |
|---|---|
| `auth` | Inscription, connexion, JWT, refresh token, mot de passe oublié |
| `users` | Compte utilisateur |
| `photos` | Upload, liste filtrée par mode de stockage, téléchargement, suppression |
| `albums` | Albums et association photos ↔ albums |
| `sharing` | Liens de partage publics avec expiration |
| `storage` | Pattern Strategy : `CloudStorageProvider` et `SovereignStorageProvider` |
| `storage-config` | Profil de stockage de l'utilisateur (mode actif, endpoint, bucket, clés) |
| `metrics` | Endpoint `/metrics` pour Prometheus |
| `db` | Client Drizzle et schéma global |

`health.controller.ts` expose `/health`, utilisé par le healthcheck Docker.

## Base de données

Le schéma est défini dans les fichiers `*.schema.ts` de chaque module, et les migrations sont générées dans `drizzle/`.

```bash
pnpm exec drizzle-kit generate   # générer une migration
pnpm exec drizzle-kit migrate    # appliquer les migrations
```

## Tests

```bash
pnpm test             # tests unitaires
pnpm test:cov         # couverture (rapport utilisé par SonarCloud)
pnpm test:e2e         # tests E2E (Supertest)
```
