# Rapport de veille technologique & Green IT

## Contexte

Sovlens est une application de gestion de photos souveraine conçue comme une alternative open source aux solutions de stockage de photos proposées par les grandes plateformes cloud.

L'objectif est de permettre aux utilisateurs de conserver la maîtrise de leurs données tout en limitant l'impact environnemental de l'infrastructure utilisée.

Chaque choix technique du projet a été étudié sous l'angle de la performance, de la sobriété numérique et de la souveraineté des données.

---

# Principes Green IT appliqués

## 1. Mutualisation des ressources matérielles

Le projet repose sur deux infrastructures complémentaires :

- un VPS mutualisé hébergeant l'application en mode cloud ;
- une infrastructure souveraine reposant sur un mini PC équipé de Proxmox VE.

Le recours à un VPS mutualisé permet de partager les ressources matérielles avec d'autres applications plutôt que de mobiliser un serveur dédié.

L'infrastructure souveraine exploite un matériel déjà existant, évitant ainsi la création de nouvelles ressources matérielles dédiées.

Cette approche permet de limiter l'empreinte environnementale globale du projet.

---

## 2. Stack légère

Les technologies retenues privilégient une faible consommation de ressources.

- **Drizzle ORM** : ORM léger, TypeScript-first, sans moteur externe.
- **NestJS + Fastify** : architecture modulaire associée à un serveur HTTP performant et peu consommateur de mémoire.
- **Garage** : stockage objet compatible S3 développé en Rust, optimisé pour les environnements auto-hébergés.
- **Caddy** : reverse proxy léger intégrant automatiquement la gestion des certificats HTTPS.

---

## 3. Réduction de la dépendance aux plateformes propriétaires

Le projet privilégie des solutions open source et auto-hébergeables.

Les données utilisateur sont stockées dans une infrastructure maîtrisée par le propriétaire de l'application et ne dépendent pas d'un service de stockage propriétaire.

Cette approche favorise :

- la maîtrise des données ;
- la pérennité de la solution ;
- la réduction du risque de dépendance à un fournisseur unique.

---

## 4. Optimisation des transferts réseau

Plusieurs optimisations permettent de limiter les transferts inutiles :

- stockage des photos directement dans un service compatible S3 ;
- optimisation automatique des images par Next.js ;
- utilisation des formats modernes WebP et AVIF lorsque cela est possible ;
- possibilité de stocker les données sur une infrastructure souveraine afin de limiter les échanges avec des centres de données distants.

---

## 5. Pipeline CI/CD optimisé

Le projet utilise GitHub Actions pour automatiser les différentes étapes d'intégration continue.

Le pipeline est conçu afin de limiter les traitements inutiles :

- exécution automatique des tests ;
- construction des images Docker uniquement lorsque nécessaire ;
- utilisation du cache Docker ;
- images Docker construites en multi-stage afin de réduire leur taille.

---

# Comparaison d'impact

| Solution | Hébergement | Souveraineté | Empreinte estimée |
|-----------|-------------|--------------|-------------------|
| Google Photos | Datacenters Google | Faible | Élevée |
| Apple Photos / iCloud | Datacenters Apple | Faible | Élevée |
| Sovlens (mode cloud) | VPS mutualisé | Élevée | Faible |
| Sovlens (mode souverain) | Infrastructure personnelle | Très élevée | Très faible |

---

# Veille technologique

## Évolution des solutions de stockage objet

Une veille technologique a été réalisée afin d'identifier une solution de stockage objet adaptée aux objectifs du projet.

À la suite du passage de MinIO Community Edition en maintenance, plusieurs alternatives ont été étudiées.

Garage a finalement été retenu grâce à :

- sa compatibilité complète avec l'API Amazon S3 ;
- son implémentation en Rust ;
- sa faible consommation de ressources ;
- son développement actif ;
- son orientation vers les déploiements auto-hébergés.

---

## Next.js 16

Les évolutions de Next.js ont également été suivies.

L'utilisation de Turbopack permet d'accélérer les temps de compilation et de réduire les ressources consommées lors des phases de développement et d'intégration continue.

---

## Docker Multi-stage

Les images Docker sont construites avec des Dockerfiles multi-stage.

Cette approche permet :

- de réduire la taille des images finales ;
- de supprimer les dépendances de compilation inutiles ;
- d'améliorer la sécurité ;
- de diminuer les temps de déploiement.

---

# Conclusion

Les travaux de veille réalisés ont permis de sélectionner une stack technique cohérente avec les objectifs de Sovlens :

- privilégier des solutions open source ;
- réduire la consommation de ressources ;
- favoriser la souveraineté des données ;
- limiter les dépendances aux plateformes de stockage propriétaires.

L'utilisation d'une infrastructure souveraine associée à des technologies légères telles que Garage, Drizzle ORM, Fastify et Docker Swarm permet de proposer une solution performante tout en intégrant une démarche de sobriété numérique.

---

# Sources

- https://collectif.greenit.fr
- https://accessibilite.numerique.gouv.fr
- https://nextjs.org/blog
- https://garagehq.deuxfleurs.fr
- https://www.infoq.com
- https://www.postgresql.org
- https://docs.docker.com