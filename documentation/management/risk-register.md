# Registre des risques

## Objectif

Le registre des risques permet d'identifier les principaux événements susceptibles d'impacter le projet **Sovlens** et de définir les actions permettant de limiter leur probabilité d'occurrence ainsi que leurs conséquences.

Il constitue un outil de pilotage permettant de suivre les risques tout au long du projet.

---

# Échelle d'évaluation

| Niveau | Probabilité | Impact |
|----------|:-----------:|:------:|
| Faible | 1 | 1 |
| Moyen | 2 | 2 |
| Élevé | 3 | 3 |

La criticité est déterminée à partir de la combinaison de la probabilité et de l'impact.

---

# Registre des risques

| ID | Risque | Probabilité | Impact | Criticité | Actions préventives | Plan de contingence |
|----|---------|:-----------:|:------:|:---------:|---------------------|---------------------|
| R1 | Mauvaise configuration du stockage compatible S3 | Moyen | Élevé | Élevée | Tester les profils de stockage avant leur utilisation | Utiliser temporairement le stockage cloud par défaut |
| R2 | Défaillance d'un service conteneurisé | Faible | Élevé | Moyenne | Supervision et redémarrage automatique des services | Redéployer le service concerné |
| R3 | Vulnérabilité de sécurité | Faible | Élevé | Moyenne | Mise à jour régulière des dépendances et application des recommandations OWASP | Déployer un correctif puis redémarrer les services |
| R4 | Perte de données | Faible | Élevé | Moyenne | Sauvegardes régulières de PostgreSQL et du stockage objet | Restaurer les données depuis les sauvegardes |
| R5 | Échec du pipeline CI/CD | Moyen | Moyen | Moyenne | Validation locale avant publication et exécution des tests | Corriger l'erreur puis relancer le pipeline |
| R6 | Indisponibilité du VPS | Faible | Élevé | Moyenne | Supervision de l'infrastructure et surveillance des ressources | Redéployer l'application sur une nouvelle instance |
| R7 | Erreur de configuration de Docker Swarm | Moyen | Moyen | Moyenne | Validation de la configuration avant déploiement | Revenir à la configuration précédente puis redéployer |
| R8 | Incompatibilité avec un stockage S3 tiers | Moyen | Élevé | Élevée | Tester la compatibilité avec plusieurs implémentations S3 et valider les paramètres de connexion | Basculer automatiquement vers le stockage cloud par défaut |
| R9 | Incompatibilité entre composants logiciels | Faible | Moyen | Faible | Gestion des versions et tests d'intégration | Mettre à jour les dépendances ou revenir à une version stable |

---

# Suivi des risques

Les risques sont réévalués à chaque évolution majeure du projet ainsi qu'à la fin de chaque sprint.

Les actions de prévention sont intégrées au processus de développement afin de réduire leur probabilité d'occurrence et leur impact sur le projet.

---

# Conclusion

Le registre des risques permet d'anticiper les principaux aléas techniques, organisationnels et opérationnels pouvant affecter le projet **Sovlens**.

Le suivi régulier de ces risques contribue à sécuriser le développement, le déploiement et la mise en œuvre de la Killer Feature de stockage souverain.