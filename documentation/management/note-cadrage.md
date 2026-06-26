# Note de cadrage

# Présentation du projet

| Élément | Description |
|----------|-------------|
| Projet | Sovlens |
| Nature | Application web de gestion de photos |
| Domaine | Gestion documentaire / Stockage objet |
| Commanditaire | Projet pédagogique – RNCP Expert en Informatique et Systèmes d'Information |
| Méthodologie | Agile (Scrum) |

---

# 1. Contexte

Les solutions actuelles de gestion de photos reposent principalement sur des plateformes cloud propriétaires. Bien qu'elles offrent une expérience utilisateur complète, elles imposent généralement le stockage des données sur des infrastructures administrées par des fournisseurs tiers.

Sovlens propose une alternative permettant de gérer une photothèque personnelle tout en laissant à l'utilisateur le choix du lieu de stockage de ses données grâce à une architecture compatible S3.

Le projet s'appuie sur des technologies open source et s'inscrit dans une démarche de qualité logicielle, de sécurité, d'accessibilité et d'éco-conception.

---

# 2. Problématique

Comment concevoir une application moderne de gestion de photos permettant de conserver une expérience utilisateur simple tout en laissant à l'utilisateur le choix du fournisseur de stockage de ses données ?

---

# 3. Objectifs

## Objectif général

Développer une application web de gestion de photos permettant à chaque utilisateur de choisir librement le lieu de stockage de ses données tout en bénéficiant d'une expérience utilisateur moderne, sécurisée et performante.

## Objectifs opérationnels

Le projet doit permettre de :

- authentifier les utilisateurs ;
- importer et consulter des photos ;
- organiser les photos en albums ;
- partager des photos ou des albums via des liens publics ;
- configurer un espace de stockage compatible S3 ;
- basculer dynamiquement entre un stockage cloud et un stockage souverain.

L'objectif principal est de proposer une solution offrant une plus grande maîtrise de l'hébergement des données tout en conservant une architecture moderne, évolutive et maintenable.

---

# 4. Périmètre

## Fonctionnalités incluses

- Authentification
- Gestion des utilisateurs
- Import de photos
- Galerie de photos
- Gestion d'albums
- Partage de photos et d'albums
- Configuration du stockage
- Sélection dynamique du fournisseur de stockage (Killer Feature)

## Hors périmètre

- Édition avancée de photos
- Reconnaissance faciale
- Intelligence artificielle
- Synchronisation automatique avec les appareils mobiles
- Applications mobiles natives

---

# 5. Contraintes

## Contraintes techniques

- Architecture modulaire basée sur NestJS
- API REST
- Base de données PostgreSQL
- Stockage objet compatible S3
- Déploiement conteneurisé avec Docker Swarm
- Hébergement sur VPS

## Contraintes de qualité

- Documentation technique complète
- Sécurisation des échanges (HTTPS, JWT)
- Respect des principes d'éco-conception
- Prise en compte de l'accessibilité
- Architecture maintenable et évolutive

---

# 6. Livrables

Les principaux livrables du projet sont :

- Documentation technique
- Diagrammes UML
- Diagrammes C4
- Modèle de données (MCD / MLD)
- Documentation OpenAPI
- Documentation d'architecture
- Backlog produit
- Planning
- Registre des risques
- Rapport de veille technologique
- Code source

---

# 7. Principaux risques

| Risque | Mesure préventive |
|---------|-------------------|
| Erreur de configuration du stockage | Validation de la configuration avant utilisation |
| Défaillance d'un service | Supervision et redémarrage automatique des services |
| Vulnérabilité de sécurité | Application des recommandations OWASP et mises à jour régulières |
| Régression fonctionnelle | Réalisation de tests avant intégration |
| Perte de données | Sauvegardes régulières de la base de données et du stockage objet |

---

# 8. Critères de réussite

Le projet sera considéré comme conforme aux objectifs si :

- les fonctionnalités prévues pour le MVP sont opérationnelles ;
- la Killer Feature de sélection du fournisseur de stockage est fonctionnelle ;
- l'application est correctement documentée ;
- les principaux choix d'architecture sont justifiés ;
- l'ensemble des livrables attendus est produit.

---

# 9. Organisation du projet

Le projet est conduit selon une approche Agile inspirée de Scrum.

Le suivi des tâches est assuré à l'aide d'un backlog organisé dans GitHub Projects. Le versionnement est réalisé avec Git et les évolutions sont tracées au travers des commits et des GitHub Issues.

Les développements sont organisés par fonctionnalités afin de faciliter le suivi de l'avancement et la validation progressive des livrables.

---

# Conclusion

Cette note de cadrage présente le contexte, les objectifs, le périmètre et les principales contraintes du projet Sovlens.

Elle constitue le document de référence pour le pilotage du projet et est complétée par le backlog, le planning, le registre des risques ainsi que les autres livrables de gestion de projet.