# Justification des choix techniques

## Stack applicative

### Next.js 16 (Frontend)
Next.js a été choisi pour son rendu hybride SSR/SSG natif, son optimisation automatique des images — critique pour une application photo — et son App Router qui simplifie la gestion des layouts et des routes protégées. Il évite d'avoir un serveur Node.js séparé pour le rendu, ce qui réduit l'empreinte infrastructure.

### NestJS + Fastify (Backend)
NestJS impose une architecture modulaire basée sur l'injection de dépendances, ce qui facilite l'implémentation des Design Patterns requis. Fastify remplace le transport HTTP par défaut d'Express pour de meilleures performances (~2x plus rapide). La combinaison NestJS + Fastify permet de générer la documentation Swagger/OpenAPI automatiquement via des décorateurs.

### Drizzle ORM
Drizzle a été préféré à Prisma pour sa légèreté (pas de moteur binaire embarqué), sa compatibilité TypeScript native et ses performances. Le schéma est défini en TypeScript pur, ce qui le rend versionnable et auditable directement dans le repo. Argument Green IT : moins de dépendances, moins de consommation mémoire.

### PostgreSQL
PostgreSQL a été choisi pour sa robustesse, son support natif du JSON (utile pour les métadonnées de photos EXIF), ses index performants sur les requêtes de recherche et sa compatibilité totale avec Drizzle. C'est la base de données relationnelle open source de référence.

### Garage (stockage objet S3)
MinIO a été écarté suite à son passage en maintenance mode en décembre 2025. Garage a été retenu comme alternative car il est écrit en Rust (performances, sécurité mémoire), distribué sous licence AGPLv3, compatible S3 à 100% et conçu pour les déploiements self-hosted légers. Il tourne sur une VM LXC Proxmox avec une consommation minimale de ressources.

---

## Infrastructure

### Docker Compose + Caddy
Kubernetes a été écarté au profit de Docker Compose pour ce projet mono-développeur. La complexité opérationnelle de K8s (manifests, Ingress, PVC) aurait consommé un temps disproportionné par rapport à la valeur ajoutée. Docker Compose offre la même reproductibilité avec une courbe d'apprentissage maîtrisée. Caddy remplace Nginx/Traefik grâce à sa gestion automatique des certificats HTTPS via Let's Encrypt — zéro configuration SSL.

### GitLab CI/CD
GitLab CI/CD a été choisi à la place de GitHub Actions car il intègre nativement la registry Docker, les environnements de staging et un pipeline YAML expressif. Tout est centralisé dans un seul outil — code, CI, registry, issues.

### Tailscale (VPN)
Tailscale permet de créer un tunnel chiffré entre le VPS et le homelab Proxmox sans configuration firewall complexe. Il utilise le protocole WireGuard sous le capot. La version gratuite est suffisante pour ce projet.

---

## Design Patterns

### Pattern Strategy (Storage Router)
Le Storage Router implémente le pattern Strategy pour abstraire le backend de stockage. L'interface `IStorageProvider` définit le contrat (`upload`, `delete`, `getUrl`), et deux implémentations concrètes (`CloudStorageProvider`, `HomelabStorageProvider`) sont injectées dynamiquement selon la configuration utilisateur. Ce pattern permet d'ajouter de nouveaux backends de stockage sans modifier le code métier.

```typescript
interface IStorageProvider {
  upload(file: Buffer, filename: string): Promise<string>
  delete(filename: string): Promise<void>
  getUrl(filename: string): string
}
```

### Pattern Singleton (Configuration)
Le module de configuration NestJS (`ConfigModule`) est instancié en Singleton — une seule instance partagée dans toute l'application. Cela garantit que la configuration (mode storage, credentials) est lue une seule fois au démarrage.

### Pattern Observer (Événements)
Le module d'événements NestJS (`EventEmitter2`) est utilisé pour notifier les modules intéressés lors d'un upload photo (ex: génération de miniature, mise à jour des métriques Prometheus). Les modules s'abonnent aux événements sans couplage direct.

---

## Base de données — schéma simplifié

```
users
  id, email, password_hash, created_at

photos
  id, user_id, filename, url, storage_mode, size, created_at

albums
  id, user_id, name, created_at

album_photos
  album_id, photo_id

storage_config
  user_id, mode (cloud|homelab), endpoint, access_key, secret_key
```

---

## Choix écartés

| Technologie | Raison d'exclusion |
|---|---|
| Prisma | Moteur binaire lourd, moins performant que Drizzle |
| MinIO | Passage en maintenance mode décembre 2025 |
| Kubernetes / K3s | Complexité opérationnelle disproportionnée pour un projet solo |
| GitHub Actions | Moins intégré que GitLab CI pour notre workflow |
| Nginx | Configuration SSL manuelle, moins simple que Caddy |
| Cloudflare R2 | Nécessite un compte externe, contraire à la philosophie souveraineté |