# Rapport de veille technologique & Green IT

## Introduction

Dans le cadre du projet **Sovlens**, une veille technologique a été menée afin de sélectionner les technologies les plus adaptées au développement de l'application.

Cette veille ne s'est pas limitée aux performances techniques. Les différentes solutions ont également été évaluées selon des critères de sobriété numérique, de maintenabilité, de souveraineté des données et de facilité de déploiement.

L'objectif est de justifier les choix retenus pour l'architecture de Sovlens tout en intégrant une démarche de Green IT.

---

# Méthodologie de veille

La veille s'est appuyée sur plusieurs types de sources :

- documentations officielles ;
- benchmarks techniques ;
- retours d'expérience de la communauté ;
- articles spécialisés ;
- recommandations Green IT.

Les technologies ont été comparées selon plusieurs critères :

- performances ;
- simplicité de développement ;
- consommation de ressources ;
- compatibilité avec l'architecture retenue ;
- capacité d'auto-hébergement ;
- pérennité du projet.

---

# Analyse des technologies

## Frontend

Plusieurs frameworks ont été étudiés pour le développement de l'interface utilisateur.

### Next.js

Next.js a été retenu pour :

- son App Router ;
- les Server Components ;
- le rendu hybride (SSR, SSG) ;
- l'optimisation native des images ;
- son excellente intégration avec React.

Ces fonctionnalités permettent de proposer une application performante tout en limitant les traitements côté client.

---

## Backend

Le backend repose sur **NestJS** associé à **Fastify**.

NestJS apporte :

- une architecture modulaire ;
- l'injection de dépendances ;
- une excellente maintenabilité.

Fastify remplace Express afin de bénéficier :

- de meilleures performances ;
- d'une consommation mémoire plus faible ;
- d'un temps de réponse réduit.

Cette combinaison offre un bon compromis entre productivité et efficacité.

---

## ORM

Deux solutions ont principalement été étudiées :

- Prisma
- Drizzle ORM

Drizzle ORM a été retenu car il est :

- TypeScript-first ;
- léger ;
- dépourvu de moteur binaire externe ;
- parfaitement intégré à PostgreSQL.

Cette approche simplifie le développement tout en limitant la consommation de ressources.

---

## Base de données

PostgreSQL a été retenu comme système de gestion de base de données.

Ses principaux avantages sont :

- robustesse ;
- conformité aux standards SQL ;
- performances ;
- nombreuses fonctionnalités avancées ;
- excellente compatibilité avec Drizzle ORM.

---

## Stockage objet

Plusieurs solutions compatibles S3 ont été étudiées.

### Garage

Garage a été retenu grâce à :

- sa compatibilité avec l'API Amazon S3 ;
- son implémentation en Rust ;
- sa faible consommation de ressources ;
- son orientation vers les déploiements auto-hébergés.

### Alternatives étudiées

- MinIO Community Edition
- Cloudflare R2

Garage répond davantage aux objectifs de souveraineté des données poursuivis par Sovlens.

---

## Conteneurisation et déploiement

Le projet est déployé à l'aide de Docker Swarm.

Docker Swarm a été préféré à Kubernetes car il offre :

- une mise en œuvre plus simple ;
- une administration plus légère ;
- un niveau de complexité adapté au périmètre du projet.

Le reverse proxy est assuré par **Caddy**, choisi pour sa gestion automatique des certificats HTTPS.

---

## Intégration continue

GitHub Actions automatise :

- les tests ;
- la construction des images Docker ;
- le déploiement sur le VPS.

Cette automatisation améliore la qualité du projet tout en limitant les interventions manuelles.

---

# Analyse Green IT

## Mutualisation des ressources

Le projet repose sur deux infrastructures complémentaires :

- un VPS mutualisé pour le mode cloud ;
- un mini PC auto-hébergé sous Proxmox VE pour le mode souverain.

Le recours à un VPS mutualisé permet de partager les ressources matérielles entre plusieurs services.

L'infrastructure souveraine exploite un matériel déjà existant, limitant l'achat de nouveaux équipements.

---

## Stack légère

Les technologies retenues privilégient une faible consommation de ressources.

Exemples :

- Drizzle ORM ;
- NestJS + Fastify ;
- Garage ;
- Caddy.

Cette approche réduit la charge mémoire ainsi que les besoins matériels.

---

## Souveraineté des données

Sovlens privilégie des solutions open source et auto-hébergeables.

Les utilisateurs peuvent choisir entre :

- un stockage cloud hébergé sur le VPS ;
- un stockage souverain compatible S3 hébergé sur leur propre infrastructure.

Cette approche limite la dépendance aux plateformes propriétaires.

---

## Optimisation des transferts réseau

Plusieurs mécanismes permettent de limiter les échanges inutiles :

- optimisation automatique des images par Next.js ;
- prise en charge des formats WebP et AVIF ;
- stockage objet compatible S3 ;
- possibilité d'utiliser un stockage proche de l'utilisateur.

---

## Pipeline CI/CD optimisé

Le pipeline GitHub Actions applique plusieurs bonnes pratiques :

- cache Docker ;
- Dockerfiles multi-stage ;
- exécution ciblée des traitements ;
- réduction de la taille des images finales.

Ces optimisations réduisent le temps de construction et la consommation de ressources.

---

# Recommandations retenues

| Domaine | Technologie retenue | Justification |
|----------|---------------------|---------------|
| Frontend | Next.js | Performances et optimisation des images |
| Backend | NestJS + Fastify | Architecture modulaire et rapidité |
| ORM | Drizzle ORM | Léger et TypeScript-first |
| Base de données | PostgreSQL | Robustesse et compatibilité |
| Stockage objet | Garage | Compatible S3 et auto-hébergeable |
| Déploiement | Docker Swarm | Simplicité d'administration |
| Reverse Proxy | Caddy | HTTPS automatique |
| CI/CD | GitHub Actions | Automatisation des déploiements |

---

# Conclusion

La veille technologique réalisée a permis de sélectionner une stack cohérente avec les objectifs de Sovlens.

Les technologies retenues répondent à plusieurs exigences :

- performances ;
- simplicité de développement ;
- maintenabilité ;
- sobriété numérique ;
- souveraineté des données.

L'intégration des principes du Green IT a orienté les choix vers des solutions open source, légères et adaptées à un déploiement auto-hébergé, tout en garantissant une expérience utilisateur comparable aux grandes plateformes de gestion de photos.

---

# Sources

- https://collectif.greenit.fr
- https://nextjs.org/blog
- https://docs.nestjs.com
- https://orm.drizzle.team
- https://garagehq.deuxfleurs.fr
- https://www.postgresql.org
- https://docs.docker.com
- https://fastify.dev
- https://caddyserver.com
- https://docs.github.com/actions