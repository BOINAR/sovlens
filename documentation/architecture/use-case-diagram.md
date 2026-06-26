# Diagramme de cas d'utilisation — Sovlens

## Objectif

Ce diagramme présente les principaux acteurs de l'application Sovlens ainsi que les fonctionnalités qui leur sont accessibles.

## Acteurs

- **Visiteur** : utilisateur non authentifié.
- **Utilisateur authentifié** : utilisateur connecté à son espace personnel.
- **Administrateur** : utilisateur chargé de l'administration et de la supervision de la plateforme.

## Diagramme

```mermaid
---
title: Diagramme de cas d'utilisation — Sovlens
---

flowchart LR

    V([Visiteur])
    U([Utilisateur authentifié])
    A([Administrateur])

    UC1((S'inscrire))
    UC2((Se connecter))
    UC3((Se déconnecter))

    UC4((Uploader une photo))
    UC5((Consulter la galerie))
    UC6((Télécharger une photo))
    UC7((Supprimer une photo))

    UC8((Créer un album))
    UC9((Gérer ses albums))

    UC10((Partager une photo))
    UC11((Partager un album))

    UC12((Configurer le stockage))
    UC13((Basculer Cloud ↔ Homelab))

    UC14((Gérer les utilisateurs))
    UC15((Consulter les métriques))
    UC16((Superviser les services))

    V --> UC1
    V --> UC2

    U --> UC3
    U --> UC4
    U --> UC5
    U --> UC6
    U --> UC7
    U --> UC8
    U --> UC9
    U --> UC10
    U --> UC11
    U --> UC12
    U --> UC13

    UC12 -.inclut.-> UC13

    A --> UC14
    A --> UC15
    A --> UC16
```

## Description des cas d'utilisation

| Cas d'utilisation | Acteur | Description |
|-------------------|---------|-------------|
| S'inscrire | Visiteur | Création d'un nouveau compte utilisateur. |
| Se connecter | Visiteur | Authentification sur la plateforme. |
| Se déconnecter | Utilisateur | Fermeture de la session utilisateur. |
| Uploader une photo | Utilisateur | Ajout d'une photo dans l'espace personnel. |
| Consulter la galerie | Utilisateur | Affichage de l'ensemble des photos. |
| Télécharger une photo | Utilisateur | Téléchargement d'une photo stockée. |
| Supprimer une photo | Utilisateur | Suppression d'une photo. |
| Créer un album | Utilisateur | Création d'un nouvel album. |
| Gérer ses albums | Utilisateur | Modification ou suppression d'un album. |
| Partager une photo | Utilisateur | Génération d'un lien de partage public. |
| Partager un album | Utilisateur | Partage d'un album complet. |
| Configurer le stockage | Utilisateur | Paramétrage du mode de stockage. |
| Basculer Cloud ↔ Homelab | Utilisateur | Activation de la Killer Feature permettant de choisir entre un stockage cloud et un stockage souverain sur un homelab. |
| Gérer les utilisateurs | Administrateur | Administration des comptes utilisateurs. |
| Consulter les métriques | Administrateur | Consultation des métriques Prometheus/Grafana. |
| Superviser les services | Administrateur | Vérification de l'état du backend, de PostgreSQL et de Garage. |

## Remarques

La fonctionnalité **Basculer Cloud ↔ Homelab** constitue la Killer Feature de Sovlens. Elle permet à l'utilisateur de choisir dynamiquement l'emplacement de stockage de ses photos entre une infrastructure cloud et son propre serveur personnel utilisant Garage (compatible S3).