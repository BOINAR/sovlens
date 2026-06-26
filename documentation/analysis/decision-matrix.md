# Matrice de décision

## Introduction

Afin de sélectionner la Killer Feature de Sovlens, plusieurs fonctionnalités ont été comparées à l'aide d'une matrice de décision.

L'objectif est d'identifier la fonctionnalité offrant le meilleur compromis entre valeur utilisateur, innovation, faisabilité technique et temps de réalisation, tout en restant cohérente avec les objectifs du projet.

---

# Critères d'évaluation

Les fonctionnalités sont évaluées selon les critères suivants :

| Critère | Description | Poids |
|----------|-------------|------:|
| Valeur utilisateur | Réponse à un besoin réel | 30 % |
| Innovation | Différenciation par rapport aux solutions existantes | 25 % |
| Faisabilité technique | Complexité de développement | 20 % |
| Temps de réalisation | Effort estimé pour développer la fonctionnalité | 15 % |
| Cohérence avec le projet | Adéquation avec les objectifs de Sovlens | 10 % |

---

# Évaluation

| Fonctionnalité | Valeur | Innovation | Faisabilité | Temps | Cohérence | Score |
|---------------|:------:|:----------:|:-----------:|:------:|:---------:|------:|
| Stockage souverain interchangeable | 5 | 5 | 4 | 3 | 5 | **4,55 / 5** |
| Détection automatique des doublons | 4 | 3 | 4 | 4 | 3 | **3,65 / 5** |
| Recherche intelligente par métadonnées | 4 | 4 | 4 | 4 | 3 | **3,90 / 5** |

---

# Analyse

La matrice de décision montre que le **stockage souverain interchangeable** obtient le meilleur score global.

Cette fonctionnalité répond directement à la problématique de souveraineté des données tout en restant techniquement réalisable dans le cadre du projet.

Contrairement aux autres propositions, elle constitue un véritable facteur de différenciation par rapport aux solutions existantes et s'inscrit pleinement dans la vision de Sovlens.

---

# Fonctionnalité retenue

La fonctionnalité retenue est le **stockage souverain interchangeable**.

Elle permet à l'utilisateur de choisir librement où seront stockées ses photos :

- stockage cloud hébergé sur le VPS ;
- stockage personnel compatible S3.

Le changement de mode s'effectue directement depuis les paramètres de l'application, sans modifier l'expérience utilisateur.

---

# Justification

Le choix de cette fonctionnalité repose sur plusieurs éléments :

- elle répond à un besoin réel de maîtrise des données ;
- elle apporte une différenciation forte par rapport aux solutions concurrentes ;
- elle exploite pleinement l'architecture modulaire de Sovlens ;
- elle reste évolutive grâce à l'utilisation d'une interface commune compatible S3 (Strategy Pattern) ;
- elle constitue le fondement des principaux choix d'architecture du projet.

Cette décision est cohérente avec les objectifs de Sovlens ainsi qu'avec les autres livrables produits, notamment l'étude des Killer Features, les diagrammes UML et les choix techniques.