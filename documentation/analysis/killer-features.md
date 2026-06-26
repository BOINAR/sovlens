# Étude des Killer Features

## Introduction

Avant de sélectionner la fonctionnalité principale de Sovlens, plusieurs propositions ont été étudiées.

Chaque fonctionnalité a été évaluée selon sa valeur ajoutée, sa faisabilité technique et son adéquation avec les objectifs du projet.

---

# Proposition 1 — Stockage souverain interchangeable

## Description

Permettre à l'utilisateur de choisir librement où seront stockées ses photos :

- stockage cloud hébergé sur le VPS ;
- stockage personnel compatible S3 (homelab).

Le changement s'effectue directement depuis les paramètres de l'application, sans modifier l'expérience utilisateur.

## Faisabilité technique

**9 / 10**

### SWOT

| Forces | Faiblesses |
|---------|------------|
| Fonctionnalité innovante | Configuration initiale plus complexe |
| Valorise la souveraineté des données | Dépend d'un stockage compatible S3 |

| Opportunités | Menaces |
|--------------|----------|
| Répond aux enjeux de souveraineté numérique | Solutions similaires à venir |

### Effort estimé

Élevé

### Dépendances

- Garage
- API S3
- Backend NestJS
- Docker Swarm

---

# Proposition 2 — Détection automatique des doublons

## Description

Comparer les fichiers importés afin d'éviter le stockage de plusieurs copies identiques.

## Faisabilité technique

**7 / 10**

### SWOT

| Forces | Faiblesses |
|---------|------------|
| Réduction de l'espace disque | Calcul des empreintes des fichiers |

| Opportunités | Menaces |
|--------------|----------|
| Optimisation du stockage | Temps de traitement supplémentaire |

### Effort estimé

Moyen

### Dépendances

- Calcul de hash
- Base de données

---

# Proposition 3 — Recherche intelligente par métadonnées

## Description

Permettre de retrouver rapidement des photos grâce aux métadonnées EXIF (date, appareil, localisation).

## Faisabilité technique

**8 / 10**

### SWOT

| Forces | Faiblesses |
|---------|------------|
| Recherche avancée | Dépend des métadonnées disponibles |

| Opportunités | Menaces |
|--------------|----------|
| Amélioration de l'expérience utilisateur | Métadonnées parfois absentes |

### Effort estimé

Moyen

### Dépendances

- Lecture EXIF
- PostgreSQL

---

# Comparaison

| Fonctionnalité | Faisabilité | Innovation | Valeur utilisateur |
|---------------|------------:|-----------:|-------------------:|
| Stockage souverain interchangeable | 9 | 10 | 10 |
| Détection des doublons | 7 | 6 | 8 |
| Recherche par métadonnées | 8 | 7 | 8 |

---

# Choix retenu

La fonctionnalité retenue est le **stockage souverain interchangeable**.

Elle répond directement à l'objectif principal de Sovlens : offrir une alternative aux solutions de stockage propriétaires tout en laissant à l'utilisateur le contrôle du lieu d'hébergement de ses données.

Cette fonctionnalité constitue le principal élément différenciant du projet et servira de base à l'architecture logicielle mise en œuvre.