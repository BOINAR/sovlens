# Registre des risques

## Objectif

Le registre des risques permet d'identifier les principaux événements susceptibles d'impacter le projet Sovlens et de définir les actions permettant de limiter leurs conséquences.

---

# Échelle d'évaluation

| Niveau | Probabilité | Impact |
|----------|:-----------:|:------:|
| Faible | 1 | 1 |
| Moyen | 2 | 2 |
| Élevé | 3 | 3 |

---

# Registre des risques

| ID | Risque | Probabilité | Impact | Criticité | Actions préventives | Plan de contingence |
|----|---------|:-----------:|:------:|:---------:|---------------------|---------------------|
| R1 | Mauvaise configuration du stockage S3 | Moyen | Élevé | Élevée | Tester les profils de stockage avant mise en production | Utiliser le stockage cloud par défaut |
| R2 | Défaillance d'un service conteneurisé | Faible | Élevé | Moyenne | Supervision et redémarrage automatique des conteneurs | Redéployer le service concerné |
| R3 | Vulnérabilité de sécurité | Faible | Élevé | Moyenne | Mise à jour des dépendances et application des recommandations OWASP | Correctif et redéploiement |
| R4 | Perte de données | Faible | Élevé | Moyenne | Sauvegardes régulières de PostgreSQL et du stockage | Restauration depuis les sauvegardes |
| R5 | Échec du pipeline CI/CD | Moyen | Moyen | Moyenne | Validation locale avant publication | Relancer le pipeline après correction |
| R6 | Indisponibilité du serveur VPS | Faible | Élevé | Moyenne | Supervision de l'infrastructure | Redéploiement sur une nouvelle instance |
| R7 | Erreur de configuration Kubernetes | Moyen | Moyen | Moyenne | Validation des manifests avant déploiement | Retour à la version précédente |
| R8 | Incompatibilité entre composants logiciels | Faible | Moyen | Faible | Gestion des versions et tests d'intégration | Mise à jour des dépendances |

---

# Suivi des risques

Les risques sont réévalués à chaque évolution majeure du projet.

Les actions de prévention sont intégrées au processus de développement afin de réduire leur probabilité d'occurrence.

---

# Conclusion

Le suivi des risques permet d'anticiper les difficultés techniques pouvant affecter le projet et de mettre en place des mesures adaptées pour assurer la continuité du développement.