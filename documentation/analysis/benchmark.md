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
| Open source | ❌ | ❌ | ✅ | ✅ |
| Auto-hébergement | ❌ | ❌ | ✅ | ✅ |
| Stockage cloud | ✅ | ✅ | ⚠️ (manuel) | ✅ |
| Stockage souverain | ❌ | ❌ | ✅ | ✅ |
| Changement de stockage | ❌ | ❌ | ❌ | ✅ |
| Partage de photos | ✅ | ✅ | ✅ | ✅ |
| Albums | ✅ | ✅ | ✅ | ✅ |
| Mot de passe oublié (email) | ✅ | ✅ | ✅ | ✅ |
| API documentée | ❌ | ❌ | ✅ | ✅ |
| Compatible S3 | ❌ | ❌ | ❌ | ✅ |
| Expérience utilisateur | Excellente | Excellente | Bonne | Moderne |
| Prix | Freemium | Abonnement iCloud+ | Gratuit | Open source |

---

# Analyse des solutions

## Google Photos

### Points forts

- Interface très intuitive.
- Excellente recherche.
- Synchronisation automatique.
- Intégration avec l'écosystème Google.

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
- Expérience utilisateur fluide sur les appareils Apple.

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
- Interface moderne.

### Limites

- Installation plus technique.
- Pas de mode cloud intégré.
- Changement de stockage nécessitant une reconfiguration.

---

# Identification des opportunités de différenciation

L'étude met en évidence plusieurs limites des solutions existantes :

- dépendance à un fournisseur cloud ;
- absence de bascule simple entre plusieurs espaces de stockage ;
- manque de contrôle sur la localisation des données ;
- complexité des solutions auto-hébergées.

Ces constats mettent en évidence une opportunité de proposer une solution conciliant simplicité d'utilisation et maîtrise des données.

---

# Positionnement de Sovlens

Sovlens reprend les fonctionnalités essentielles d'une application moderne de gestion de photos :

- authentification sécurisée ;
- récupération de compte via un lien de réinitialisation envoyé par email ;
- galerie de photos ;
- gestion d'albums ;
- partage par lien public.

Le projet se différencie grâce à sa Killer Feature :

- possibilité de basculer dynamiquement entre un stockage cloud et un stockage souverain compatible S3 directement depuis l'application.

L'utilisateur conserve ainsi la même expérience d'utilisation tout en choisissant librement l'emplacement de stockage de ses données.

---

# Conclusion

Le benchmark met en évidence que les solutions actuelles proposent une excellente expérience de gestion de photos, mais restent fortement liées à un mode de stockage imposé, qu'il soit propriétaire ou auto-hébergé.

Sovlens se distingue par une architecture permettant de choisir librement le fournisseur de stockage sans modifier l'utilisation quotidienne de l'application. Cette capacité constitue la principale valeur ajoutée du projet.