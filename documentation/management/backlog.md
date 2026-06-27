# Backlog produit

## Objectif

Le backlog produit regroupe l'ensemble des fonctionnalités prévues pour **Sovlens**. Il constitue la liste priorisée des besoins métier à développer et sert de référence pour l'organisation des sprints selon une approche Agile (Scrum).

Les fonctionnalités couvertes concernent notamment :

- l'authentification des utilisateurs ;
- la gestion des comptes (modification et réinitialisation du mot de passe) ;
- l'envoi (upload), la consultation et le téléchargement des photos ;
- la gestion des albums ;
- le partage de photos et d'albums ;
- la configuration d'un stockage compatible S3 (Killer Feature).

Chaque élément du backlog correspond à une **User Story** et est estimé en **Story Points (SP)** afin de faciliter la planification des itérations.

---

# Product Backlog

| ID | User Story | Priorité (MoSCoW) | Story Points | Statut |
|----|------------|:-----------------:|:------------:|:------:|
| US-01 | Création d'un compte utilisateur | Must | 3 | À faire |
| US-02 | Connexion à l'application | Must | 3 | À faire |
| US-03 | Modifier son mot de passe | Must | 3 | À faire |
| US-04 | Réinitialiser son mot de passe par email | Must | 5 | À faire |
| US-05 | Upload d'une photo | Must | 5 | À faire |
| US-06 | Télécharger une photo | Must | 3 | À faire |
| US-07 | Consulter la galerie | Must | 5 | À faire |
| US-08 | Gérer des albums | Should | 5 | À faire |
| US-09 | Partager une photo ou un album | Should | 5 | À faire |
| US-10 | Configurer un stockage compatible S3 (Killer Feature) | Must | 8 | À faire |

---

# Gestion du backlog

Le backlog est géré dans **GitHub Projects**.

Chaque User Story est associée à une ou plusieurs **GitHub Issues** permettant de suivre son avancement jusqu'à sa réalisation.

Les éléments du backlog sont organisés en fonction de leur priorité, de leurs dépendances techniques et des objectifs de chaque sprint afin de faciliter la planification des développements.

Une spécification de l'API est maintenue dans un document **OpenAPI** (`openapi.yaml`). Au cours du développement, cette spécification sera utilisée pour générer automatiquement une documentation interactive **Swagger UI**, facilitant les tests, la validation et la maintenance de l'API.

---

# Méthode de priorisation

Les User Stories sont priorisées selon la méthode **MoSCoW** :

- **Must** : indispensable au MVP ;
- **Should** : fortement recommandé ;
- **Could** : amélioration pouvant être développée ultérieurement ;
- **Won't** : hors périmètre de cette version.

Les critères de priorisation prennent en compte :

- la valeur apportée à l'utilisateur ;
- les dépendances techniques ;
- la complexité de développement ;
- les risques techniques ;
- la contribution à la Killer Feature.

---

# Estimation des User Stories

Les estimations sont exprimées en **Story Points (SP)**.

Les Story Points permettent d'évaluer l'effort global de développement en prenant en compte :

- la complexité technique ;
- le volume de travail ;
- les risques ;
- les incertitudes.

Cette estimation facilite la planification des sprints, le suivi de l'avancement et l'ajustement de la capacité de développement.

---

# Synthèse

Le Product Backlog constitue le référentiel des fonctionnalités prévues pour **Sovlens**.

Il est mis à jour tout au long du projet afin de refléter l'évolution des besoins et sert de support à la planification des sprints, au suivi des développements, à l'organisation des GitHub Issues et à la préparation des livraisons successives du projet.