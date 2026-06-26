# Planning du projet

## Objectif

Le planning du projet définit les principales phases de réalisation de **Sovlens**. Il permet de planifier les activités, de suivre l'avancement du projet et d'identifier les principaux jalons.

Le projet est organisé selon une approche Agile inspirée de Scrum, avec une progression incrémentale des fonctionnalités et des livrables.

---

# Méthodologie

Le développement est découpé en plusieurs sprints.

Chaque sprint produit un ensemble cohérent de fonctionnalités ou de livrables permettant de valider progressivement les objectifs du projet.

---

# Planification des sprints

| Sprint | Durée | Objectifs principaux | Livrables |
|---------|:-----:|----------------------|------------|
| Sprint 1 | 2 semaines | Analyse des besoins, benchmark, personas, user stories | Documentation d'analyse |
| Sprint 2 | 2 semaines | Architecture logicielle, diagrammes UML, diagrammes C4, modèles de données | Documentation d'architecture |
| Sprint 3 | 3 semaines | Développement du backend, API REST, authentification | Backend NestJS |
| Sprint 4 | 3 semaines | Développement du frontend et intégration avec l'API | Frontend Next.js |
| Sprint 5 | 2 semaines | Déploiement, tests, documentation finale et préparation de la soutenance | MVP, Killer Feature, documentation finale |

---

# Jalons

| Jalon | Description | Livrable associé |
|--------|-------------|------------------|
| J1 | Validation des besoins | Documentation d'analyse |
| J2 | Validation de l'architecture | Documentation d'architecture |
| J3 | Backend opérationnel | API REST |
| J4 | MVP fonctionnel | Frontend et Backend intégrés |
| J5 | Killer Feature opérationnelle | Bascule Cloud ↔ Stockage souverain |
| J6 | Livraison finale | Documentation complète et soutenance |

---

# Macro-planning

| Activité | S1 | S2 | S3 | S4 | S5 |
|-----------|:--:|:--:|:--:|:--:|:--:|
| Analyse des besoins | ● | | | | |
| Benchmark | ● | | | | |
| Personas | ● | | | | |
| User Stories | ● | | | | |
| Architecture | ● | ● | | | |
| Modèle de données | | ● | | | |
| Développement Backend | | | ● | ● | |
| Développement Frontend | | | | ● | ● |
| Développement API REST | | | ● | ● | |
| Tests | | | | ● | ● |
| Déploiement | | | | | ● |
| Documentation | ● | ● | ● | ● | ● |

---

# Outils de suivi

Le pilotage du projet repose sur les outils suivants :

- GitHub Projects pour le suivi des tâches ;
- GitHub Issues pour la gestion du backlog ;
- Git pour le versionnement du code source ;
- GitHub Actions pour l'intégration continue (CI).

---

# Suivi de l'avancement

À l'issue de chaque sprint :

- les fonctionnalités développées sont validées ;
- la documentation est mise à jour ;
- les risques sont réévalués ;
- le backlog est ajusté si nécessaire.

Cette approche permet une amélioration continue tout au long du projet.

---

# Conclusion

Ce planning structure le développement de Sovlens autour de jalons clairement identifiés.

L'organisation en sprints permet de produire progressivement les fonctionnalités du MVP, la Killer Feature ainsi que l'ensemble des livrables attendus, tout en assurant un suivi régulier de l'avancement du projet.