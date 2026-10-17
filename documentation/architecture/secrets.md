# Inventaire des secrets

Ce document recense les secrets de SovLens : leur nom, leur emplacement et leur usage. **Aucune valeur n'y figure, ni ne doit y figurer.**

## Principe

La source de vérité est **GitHub Secrets**. Le pipeline injecte les secrets au moment du déploiement :

- en **variables d'environnement** des services Swarm, pour le backend et Postgres ;
- en **Docker secrets** Swarm, pour les services qui lisent un fichier (Garage, Grafana, Prometheus, sauvegarde). Ils sont chiffrés dans le cluster, montés en mémoire dans `/run/secrets/` et n'apparaissent pas dans `docker inspect`.

Aucun secret n'est versionné dans le dépôt ni écrit en clair sur le disque du VPS.

## GitHub Secrets

| Secret | Injecté dans | Usage |
|---|---|---|
| `STAGING_HOST` | Pipeline | Adresse du VPS |
| `STAGING_USER` | Pipeline | Utilisateur SSH du déploiement |
| `STAGING_SSH_KEY` | Pipeline | Clé privée SSH du déploiement |
| `STAGING_POSTGRES_USER` | Variable d'environnement | Postgres et `DATABASE_URL` du backend |
| `STAGING_POSTGRES_PASSWORD` | Variable d'environnement | Postgres et `DATABASE_URL` du backend |
| `STAGING_POSTGRES_DB` | Variable d'environnement | Postgres et `DATABASE_URL` du backend |
| `STAGING_JWT_SECRET` | Variable d'environnement | Backend : signature des JWT |
| `STAGING_S3_ACCESS_KEY` | Variable d'environnement | Backend : accès au Garage cloud |
| `STAGING_S3_SECRET_KEY` | Variable d'environnement | Backend : accès au Garage cloud |
| `STAGING_S3_BUCKET` | Variable d'environnement | Backend : bucket du Garage cloud |
| `GARAGE_RPC_SECRET` | Docker secret `garage_rpc_secret` | Garage VPS : communication RPC |
| `GARAGE_ADMIN_TOKEN` | Docker secret `garage_admin_token` | Garage VPS : API d'administration |
| `GRAFANA_ADMIN_PASSWORD` | Docker secret `grafana_admin_password` | Connexion `admin` à Grafana |
| `GARAGE_HOMELAB_METRICS_TOKEN` | Docker secret `garage_homelab_metrics_token` | Prometheus → métriques du Garage homelab |
| `BACKUP_S3_ACCESS_KEY` | Docker secret `backup_s3_access_key` | Service `backup` : envoi des dumps vers le bucket `sovlens-backups` |
| `BACKUP_S3_SECRET_KEY` | Docker secret `backup_s3_secret_key` | Service `backup` : envoi des dumps vers le bucket `sovlens-backups` |
| `SONAR_TOKEN` | Pipeline | Analyse SonarCloud (expire, à renouveler sur sonarcloud.io) |

Les Docker secrets sont suffixés par le début du SHA du commit, car un secret Swarm est immuable. Le pipeline crée la nouvelle version à chaque déploiement et supprime les anciennes.

## Secrets hors GitHub

| Secret | Emplacement | Raison |
|---|---|---|
| `metrics_token` du Garage homelab | `/etc/garage/garage.toml` sur `ubuntu-server` | Le homelab n'est pas déployé par le pipeline. Même valeur que `GARAGE_HOMELAB_METRICS_TOKEN`. |
| Clés S3 souveraines des utilisateurs | Table `storage_profiles` en base | Saisies par chaque utilisateur dans **Paramètres**. Jamais renvoyées par l'API. |
| Variables du développement local | `backend/.env` sur le poste du développeur | Non versionné. |

## Renouveler un secret

1. Générer une nouvelle valeur, par exemple `openssl rand -base64 32`.
2. La mettre à jour dans GitHub Secrets.
3. Pousser sur `main` pour redéployer.

Cas particuliers :

- **`GARAGE_HOMELAB_METRICS_TOKEN`** : reporter la même valeur dans `/etc/garage/garage.toml` sur le homelab, puis redémarrer `sovlens-garage`.
- **`GRAFANA_ADMIN_PASSWORD`** : Grafana n'applique ce secret qu'à la création de sa base. Pour le changer ensuite : `grafana cli admin reset-admin-password` dans le conteneur, puis effacer la commande de l'historique bash.
- **Clés S3 souveraines** : à modifier uniquement depuis **Paramètres**, jamais en SQL direct.
