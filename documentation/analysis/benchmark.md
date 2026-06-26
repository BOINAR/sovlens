# Benchmark concurrentiel

## Introduction

Avant de définir les fonctionnalités de Sovlens, une étude comparative des principales solutions de gestion de photos a été réalisée.

L'objectif est d'identifier les fonctionnalités existantes, les limites des solutions actuelles et les opportunités de différenciation.

Les solutions étudiées sont :

- Google Photos
- Apple iCloud Photos
- Immich

---

# Tableau comparatif

| Critère | Google Photos | iCloud Photos | Immich | Sovlens |
|----------|---------------|---------------|---------|----------|
| Open Source | ❌ | ❌ | ✅ | ✅ |
| Auto-hébergement | ❌ | ❌ | ✅ | ✅ |
| Stockage cloud | ✅ | ✅ | ⚠️ (manuel) | ✅ |
| Stockage souverain | ❌ | ❌ | ✅ | ✅ |
| Changement de stockage | ❌ | ❌ | ❌ | ✅ |
| Partage de photos | ✅ | ✅ | ✅ | ✅ |
| Albums | ✅ | ✅ | ✅ | ✅ |
| API documentée | ❌ | ❌ | ✅ | ✅ |
| Compatible S3 | ❌ | ❌ | ❌ | ✅ |

---

# Analyse des solutions

## Google Photos

### Points forts

- Interface très intuitive.
- Excellente recherche.
- Synchronisation automatique.

### Limites

- Service propriétaire.
- Dépendance à Google.
- Stockage des données sur les infrastructures Google.
- Fonctionnalités avancées soumises à un abonnement.

---

## Apple iCloud Photos

### Points forts

- Très bonne intégration avec l'écosystème Apple.
- Synchronisation automatique.

### Limites

- Écosystème fermé.
- Fonctionne principalement avec les appareils Apple.
- Stockage entièrement géré par Apple.

---

## Immich

### Points forts

- Open source.
- Auto-hébergeable.
- Communauté active.

### Limites

- Installation plus technique.
- Pas de mode cloud intégré.
- Changement de stockage nécessitant une reconfiguration.

---

# Identification des besoins non couverts

L'étude met en évidence plusieurs limites des solutions existantes :

- dépendance à un fournisseur cloud ;
- absence de bascule simple entre plusieurs espaces de stockage ;
- manque de contrôle sur la localisation des données ;
- complexité des solutions auto-hébergées.

---

# Positionnement de Sovlens

Sovlens reprend les fonctionnalités essentielles d'une application moderne de gestion de photos :

- authentification sécurisée ;
- galerie ;
- albums ;
- partage par lien public.

Le projet se différencie grâce à une fonctionnalité supplémentaire :

- possibilité de basculer entre un stockage cloud et un stockage souverain compatible S3 directement depuis l'application.

Cette approche permet de conserver une expérience utilisateur identique tout en laissant à chaque utilisateur le choix du lieu de stockage de ses données.

---

# Conclusion

Le benchmark montre que les solutions existantes répondent correctement aux besoins de stockage et de partage de photos, mais offrent peu de flexibilité concernant l'hébergement des données.

Sovlens se distingue par une architecture permettant de choisir librement le fournisseur de stockage sans modifier l'utilisation quotidienne de l'application. Cette capacité constitue la principale valeur ajoutée du projet.