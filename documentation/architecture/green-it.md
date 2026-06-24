# Rapport de Veille Technologique & Green IT

## Contexte

PhotoApp est une application de gestion de photos souveraine, conçue pour offrir
une alternative éthique et écologique aux solutions GAFAM. Chaque choix technique
a été évalué sous l'angle de la performance et de l'éco-responsabilité.

## Principes Green IT appliqués

### 1. Mutualisation des ressources matérielles

Le projet s'appuie sur du matériel existant — un mini PC avec Proxmox déjà en
place — plutôt que de provisionner de nouvelles machines cloud. La virtualisation
via Proxmox permet de faire tourner plusieurs services sur un seul nœud physique,
optimisant ainsi l'utilisation des ressources et évitant la surconsommation liée
aux serveurs cloud surdimensionnés des GAFAM.

### 2. Stack légère et sans dépendances lourdes

- **Drizzle ORM** : aucun binaire embarqué, ~7kb minifié contre ~50MB pour Prisma.
- **NestJS + Fastify** : Fastify consomme moins de mémoire qu'Express (~30% de gain).
- **Garage** : écrit en Rust, consommation mémoire minimale comparé à MinIO ou Ceph.
- **Caddy** : binaire unique, gestion HTTPS automatique sans dépendances externes.

### 3. Pas de dépendance aux GAFAM

L'ensemble de la stack est open source et auto-hébergée :
- Aucune donnée ne transite par AWS, Google Cloud ou Azure
- Aucun service tiers payant ou soumis à des conditions commerciales changeantes
- Souveraineté totale sur les données utilisateur

### 4. Optimisation des transferts réseau

- Les photos sont stockées directement sur le backend de stockage via l'API S3 —
  aucun transit inutile par des couches intermédiaires
- Next.js 16 intègre une optimisation automatique des images (compression, formats
  WebP/AVIF) qui réduit la bande passante consommée
- Le mode homelab permet de stocker les photos en local, éliminant tout transfert
  réseau vers un datacenter distant

### 5. CI/CD sobre

Le pipeline GitLab CI est conçu pour minimiser les jobs inutiles :
- Les jobs ne tournent que sur les branches concernées
- Les images Docker sont construites en multi-stage pour minimiser leur taille
- Le cache Docker est utilisé pour éviter de reconstruire les couches inchangées

## Comparaison d'impact

| Solution | Hébergement | Souveraineté | Empreinte |
|---|---|---|---|
| Google Photos | Datacenter Google | Aucune | Élevée |
| iCloud | Datacenter Apple | Aucune | Élevée |
| PhotoApp (mode cloud) | VPS mutualisé | Totale | Faible |
| PhotoApp (mode homelab) | Matériel existant | Totale | Minimale |

## Veille technologique

### Abandon de MinIO
MinIO community edition est passé en maintenance mode en décembre 2025 et son
repo GitHub a été archivé en février 2026. Garage a été retenu comme alternative
car il est activement maintenu, plus léger, et conçu pour les déploiements
self-hosted — ce qui est cohérent avec notre philosophie Green IT.

### Next.js 16 et Turbopack
Next.js 16.2 intègre Turbopack stable qui réduit le temps de build de ~50% par
rapport à Webpack. Moins de temps de build = moins de consommation CPU dans la CI.

### Docker multi-stage builds
Les Dockerfiles utilisent des builds multi-stage pour produire des images finales
sans outils de compilation — typiquement 10x plus légères qu'une image naïve.

## Sources

- Collectif GreenIT : collectif.greenit.fr/ecoconception
- RGAA Accessibilité : accessibilite.numerique.gouv.fr
- Next.js 16.2 release notes : nextjs.org/blog
- Garage object storage : garagehq.deuxfleurs.fr
- InfoQ — MinIO maintenance mode : infoq.com