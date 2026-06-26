# Matrice de décision

## Introduction

Afin de sélectionner la Killer Feature de Sovlens, plusieurs fonctionnalités ont été comparées selon une grille de décision.

L'objectif est de retenir la fonctionnalité offrant le meilleur compromis entre valeur utilisateur, innovation et faisabilité technique.

---

# Critères d'évaluation

Les fonctionnalités sont évaluées selon les critères suivants :

| Critère | Description | Poids |
|----------|-------------|------:|
| Valeur utilisateur | Réponse à un besoin réel | 30 % |
| Innovation | Différenciation par rapport aux solutions existantes | 25 % |
| Faisabilité technique | Complexité de développement | 20 % |
| Cohérence avec le projet | Adéquation avec les objectifs de Sovlens | 15 % |
| Maintenabilité | Facilité d'évolution | 10 % |

---

# Évaluation

| Fonctionnalité | Valeur | Innovation | Faisabilité | Cohérence | Maintenabilité | Score |
|---------------|:------:|:----------:|:-----------:|:---------:|:--------------:|------:|
| Stockage souverain interchangeable | 5 | 5 | 4 | 5 | 4 | **4,75 / 5** |
| Détection automatique des doublons | 4 | 3 | 4 | 3 | 4 | **3,65 / 5** |
| Recherche par métadonnées | 4 | 4 | 4 | 3 | 4 | **3,95 / 5** |

---

# Analyse

L'évaluation met en évidence que le stockage souverain interchangeable obtient le meilleur score.

Cette fonctionnalité répond directement à la problématique de souveraineté des données tout en restant cohérente avec les objectifs du projet.

Contrairement aux deux autres propositions, elle constitue un véritable facteur de différenciation vis-à-vis des solutions existantes.

---

# Fonctionnalité retenue

La fonctionnalité retenue est :

## Stockage souverain interchangeable

Cette fonctionnalité permet à l'utilisateur de choisir librement où seront stockées ses photos :

- stockage cloud hébergé sur le VPS ;
- stockage personnel compatible S3.

Le changement de mode s'effectue directement depuis les paramètres de l'application sans modifier l'expérience utilisateur.

---

# Justification

Le choix de cette fonctionnalité repose sur plusieurs éléments :

- répond à un besoin réel de maîtrise des données ;
- apporte une différenciation forte par rapport aux solutions concurrentes ;
- exploite pleinement l'architecture modulaire de Sovlens ;
- reste évolutive grâce à l'utilisation d'une interface commune compatible S3.

Cette décision est cohérente avec les objectifs du projet ainsi qu'avec les choix techniques présentés dans les autres livrables.