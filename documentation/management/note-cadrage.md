# Note de cadrage

# Présentation du projet

| Élément | Description |
|----------|-------------|
| Projet | Sovlens |
| Nature | Application web de gestion de photos |
| Domaine | Gestion documentaire / Stockage objet |
| Méthodologie | Agile (Scrum) |

---

# 1. Contexte

Les solutions actuelles de gestion de photos reposent principalement sur des plateformes cloud propriétaires. Bien qu'elles offrent une expérience utilisateur complète, elles imposent généralement un stockage des données sur des infrastructures administrées par des fournisseurs tiers.

Sovlens propose une alternative permettant de gérer une photothèque personnelle tout en laissant à l'utilisateur le choix du lieu de stockage de ses données grâce à une architecture compatible S3.

Le projet s'appuie sur des technologies open source et s'inscrit dans une démarche de qualité logicielle, de sécurité et d'éco-conception.

---

# 2. Problématique

Comment concevoir une application moderne de gestion de photos permettant de conserver une expérience utilisateur simple tout en laissant à l'utilisateur le choix du fournisseur de stockage de ses données ?

---

# 3. Objectifs

Le projet a pour objectifs de développer une application permettant :

- l'authentification des utilisateurs ;
- l'import et la consultation de photos ;
- l'organisation des photos en albums ;
- le partage sécurisé de contenus ;
- la configuration d'un espace de stockage compatible S3.

L'objectif principal est de proposer une solution offrant une plus grande maîtrise de l'hébergement des données tout en conservant une architecture moderne, évolutive et maintenable.

---

# 4. Périmètre

## Fonctionnalités incluses

- Authentification
- Gestion des utilisateurs
- Import de photos
- Galerie
- Albums
- Partage de photos
- Configuration du stockage
- Sélection dynamique du fournisseur de stockage

## Hors périmètre

- Édition avancée de photos
- Reconnaissance faciale
- Intelligence artificielle
- Synchronisation automatique avec les appareils mobiles

---

# 5. Contraintes

## Contraintes techniques

- Architecture modulaire
- API REST
- Base de données PostgreSQL
- Stockage objet compatible S3
- Conteneurisation de l'application

## Contraintes de qualité

- Documentation technique
- Sécurisation des échanges
- Éco-conception
- Accessibilité
- Maintenabilité

---

# 6. Livrables

Les principaux livrables du projet sont :

- Documentation technique
- Diagrammes UML
- Diagrammes C4
- Modèle de données
- Documentation API
- Documentation d'architecture
- Backlog produit
- Planning
- Registre des risques
- Rapport de veille technologique et Green IT
- Code source

---

# 7. Principaux risques

| Risque | Mesure préventive |
|---------|-------------------|
| Erreur de configuration du stockage | Validation de la configuration avant utilisation |
| Défaillance d'un service | Supervision et redémarrage des services |
| Vulnérabilité de sécurité | Application des recommandations OWASP et mises à jour régulières |
| Régression fonctionnelle | Réalisation de tests avant intégration |
| Perte de données | Sauvegardes régulières de la base de données et du stockage |

---

# 8. Critères de réussite

Le projet sera considéré comme conforme aux objectifs si :

- les fonctionnalités du MVP sont disponibles ;
- la sélection du fournisseur de stockage est opérationnelle ;
- l'application est documentée ;
- les principaux choix d'architecture sont justifiés ;
- les livrables attendus sont produits.

---

# 9. Organisation du projet

Le projet est conduit selon une approche Agile inspirée de Scrum.

Le suivi des tâches est assuré à l'aide d'un backlog organisé dans GitHub Projects. Le versionnement est réalisé avec Git et les évolutions sont tracées au travers des commits et des GitHub Issues.

---

# Conclusion

Cette note de cadrage présente le contexte, les objectifs, le périmètre et les principales contraintes du projet Sovlens. Elle constitue le document de référence pour le pilotage du projet et sera complétée par le planning, le backlog, le registre des risques et les autres livrables de gestion de projet.