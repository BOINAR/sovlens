# Justification des choix techniques

## Stack applicative

### Next.js 16 (Frontend)

Next.js 16 a été retenu pour développer l'interface utilisateur de Sovlens. Son App Router facilite l'organisation du projet et permet une séparation claire entre les différentes parties de l'application.

Le rendu hybride (SSR, SSG et Server Components) améliore les performances de l'application tout en optimisant le référencement lorsque cela est nécessaire.

L'optimisation native des images constitue également un avantage important pour une application de gestion de photos, en réduisant automatiquement la bande passante consommée grâce à des formats modernes tels que WebP ou AVIF.

---

### NestJS 11 + Fastify (Backend)

Le backend repose sur NestJS associé à Fastify.

NestJS apporte une architecture modulaire basée sur l'injection de dépendances, favorisant la séparation des responsabilités, la maintenabilité du code et l'application de Design Patterns.

Fastify remplace Express comme moteur HTTP afin d'améliorer les performances et de réduire la consommation mémoire.

Cette combinaison permet également de générer automatiquement une documentation OpenAPI (Swagger), facilitant les échanges entre le frontend et le backend.

---

### Drizzle ORM v1 RC + Drizzle Zod

Drizzle ORM a été choisi pour son approche **TypeScript-first**, son excellente intégration avec PostgreSQL et son faible coût d'exécution.

Contrairement à certains ORM reposant sur un moteur externe, Drizzle s'appuie directement sur TypeScript, ce qui simplifie le versionnement du schéma de données et limite les dépendances.

Le projet utilise également **Drizzle Zod** afin de générer automatiquement les schémas de validation à partir des modèles Drizzle.

Cette approche permet :

- d'éviter la duplication des modèles ;
- de garantir la cohérence entre la validation et la base de données ;
- d'améliorer la sécurité du typage ;
- de simplifier la maintenance de l'application.

---

### PostgreSQL 18

PostgreSQL constitue la base de données relationnelle de Sovlens.

Il a été retenu pour :

- sa robustesse ;
- ses performances ;
- son respect des standards SQL ;
- sa parfaite compatibilité avec Drizzle ORM ;
- ses fonctionnalités avancées en matière d'indexation et d'intégrité relationnelle.

La base de données stocke uniquement les données métier de l'application :

- utilisateurs ;
- photos (métadonnées uniquement) ;
- albums ;
- profils de stockage ;
- liens de partage.

Les fichiers binaires des photos ne sont jamais enregistrés dans PostgreSQL. Ils sont stockés dans un service de stockage objet compatible S3.

---

### Garage (Stockage objet compatible S3)

Garage est utilisé comme solution de stockage objet compatible S3.

Selon le mode de stockage choisi par l'utilisateur, l'application communique soit avec :

- une instance Garage hébergée sur le VPS ;
- une instance Garage auto-hébergée sur une infrastructure souveraine (mini PC Proxmox).

L'utilisation d'une API S3 commune garantit un fonctionnement identique quel que soit l'emplacement physique des données.

Garage a été retenu pour :

- sa compatibilité avec l'API Amazon S3 ;
- son implémentation en Rust ;
- sa faible consommation de ressources ;
- son orientation vers les déploiements auto-hébergés ;
- son caractère open source.

---

# Infrastructure

## Docker Swarm + Caddy

Le projet est déployé sur un VPS à l'aide de Docker Swarm.

Docker Swarm a été retenu afin de bénéficier d'une orchestration de conteneurs simple à administrer tout en restant proche d'une architecture de production.

Il permet notamment :

- le déploiement de plusieurs services ;
- la gestion des réseaux ;
- les mises à jour progressives ;
- la réplication des services ;
- une évolution possible vers plusieurs nœuds.

Kubernetes n'a pas été retenu car il introduit une complexité importante (gestion des manifests, Ingress, Persistent Volumes, contrôleurs...) qui n'apporte pas de bénéfice significatif pour le périmètre de ce projet.

Caddy est utilisé comme reverse proxy.

Il gère automatiquement les certificats HTTPS via Let's Encrypt, réduisant fortement la configuration nécessaire tout en améliorant la sécurité.

---

## GitHub Actions

L'intégration continue et le déploiement continu sont assurés par GitHub Actions.

Le pipeline automatise notamment :

- l'analyse du code ;
- l'exécution des tests ;
- la construction des images Docker ;
- la publication dans le registre de conteneurs ;
- le déploiement sur le VPS.

Les images Docker produites par le pipeline sont ensuite utilisées pour mettre à jour automatiquement les services déployés avec Docker Swarm.

---

## Réseau privé sécurisé

Le mode de stockage souverain nécessite une communication sécurisée entre le VPS hébergeant l'application et l'infrastructure souveraine de l'utilisateur.

Une solution de réseau privé basée sur WireGuard est retenue afin de sécuriser les échanges sans exposer directement l'infrastructure sur Internet.

Dans le cadre de ce projet, cette solution est implémentée avec **Tailscale**, choisi pour sa simplicité de déploiement, sa sécurité et son intégration transparente avec WireGuard.

---

# Design Patterns

## Strategy Pattern (Storage Router)

La Killer Feature de Sovlens repose sur le **Strategy Pattern**.

Une interface commune définit les opérations de stockage :

```typescript
interface IStorageProvider {
  upload(file: Buffer, filename: string): Promise<string>;
  delete(filename: string): Promise<void>;
  getUrl(filename: string): string;
}
```

Deux implémentations sont actuellement prévues :

- `CloudStorageProvider`
- `SovereignStorageProvider`

Le `StorageService` sélectionne dynamiquement la stratégie adaptée en fonction du profil de stockage de l'utilisateur.

Cette architecture permet d'ajouter ultérieurement de nouveaux fournisseurs compatibles S3 sans modifier le reste de l'application.

---

## Singleton Pattern

Le module de configuration de NestJS est utilisé sous forme de Singleton.

Une seule instance est partagée dans toute l'application afin de centraliser :

- la configuration JWT ;
- la connexion PostgreSQL ;
- les paramètres Garage ;
- les variables d'environnement.

---

## Observer Pattern

Le système d'événements de NestJS permet de déclencher automatiquement différents traitements après certaines actions importantes.

Par exemple :

- génération de miniatures ;
- mise à jour des métriques Prometheus ;
- journalisation ;
- traitements asynchrones futurs.

Cette approche réduit le couplage entre les différents modules de l'application.

---

# Base de données — Schéma simplifié

```text
users
  id
  email
  password_hash
  created_at

photos
  id
  user_id
  filename
  object_key
  storage_mode (cloud | souverain)
  size
  created_at

albums
  id
  user_id
  name
  created_at

album_photos
  album_id
  photo_id

storage_profiles
  id
  user_id
  mode
  endpoint
  bucket

share_links
  id
  photo_id
  album_id
  token
  expires_at
```

---

# Choix techniques écartés

| Technologie | Justification |
|-------------|---------------|
| Prisma | Drizzle ORM offre une approche plus légère, TypeScript-first et évite l'utilisation d'un moteur binaire externe. |
| MinIO | Garage est mieux adapté à une infrastructure auto-hébergée légère tout en offrant une compatibilité complète avec l'API S3. |
| Kubernetes | Solution très complète mais plus complexe à administrer. Docker Swarm répond aux besoins du projet avec une mise en œuvre plus simple. |
| Nginx | Caddy automatise entièrement la gestion des certificats HTTPS et réduit fortement la configuration nécessaire. |
| Cloudflare R2 | Le projet privilégie une maîtrise complète du stockage des données grâce à une infrastructure souveraine basée sur Garage. |

---

# Conclusion

Les choix techniques retenus pour Sovlens répondent à quatre objectifs principaux :

- proposer une architecture moderne, modulaire et fortement typée grâce à TypeScript ;
- privilégier des solutions open source ;
- garantir la souveraineté des données grâce à un stockage compatible S3 pouvant être auto-hébergé ;
- conserver une infrastructure simple à déployer, sécurisée et facilement maintenable.

Le **Strategy Pattern** constitue le cœur de la Killer Feature du projet. Il permet de basculer dynamiquement entre un stockage cloud hébergé sur un VPS et un stockage souverain compatible S3, auto-hébergé sur l'infrastructure de l'utilisateur, sans modifier la logique métier de l'application.