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
| Upload de photos | ✅ | ✅ | ✅ | ✅ |
| Téléchargement des photos | ✅ | ✅ | ✅ | ✅ |
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
- Synchronisation automatique des photos.
- Recherche performante.
- Téléchargement simple des photos.
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
- Téléchargement des photos sur les appareils Apple.
- Expérience utilisateur fluide.

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
- Téléchargement des photos.
- API documentée.

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
- upload de photos ;
- téléchargement des photos ;
- galerie de photos ;
- gestion d'albums ;
- partage par lien public.

Le projet se différencie grâce à sa Killer Feature :

- possibilité de basculer dynamiquement entre un stockage cloud et un stockage souverain compatible S3 directement depuis l'application.

Contrairement aux solutions étudiées, Sovlens ne dépend pas d'un fournisseur d'identité externe (Google, Apple, Microsoft). L'application repose sur une authentification locale sécurisée (JWT + Refresh Token) afin de conserver une indépendance vis-à-vis des services tiers et de rester cohérente avec l'objectif de souveraineté des données.

L'utilisateur conserve ainsi la même expérience d'utilisation tout en choisissant librement l'emplacement de stockage de ses données.

---

# Conclusion

Le benchmark met en évidence que les solutions actuelles proposent une excellente expérience de gestion de photos, mais restent fortement liées à un mode de stockage imposé, qu'il soit propriétaire ou auto-hébergé.

Sovlens se distingue par une architecture permettant de choisir librement le fournisseur de stockage, de rester indépendant des fournisseurs d'identité externes et de conserver une expérience utilisateur identique quel que soit le mode de stockage utilisé. Cette capacité constitue la principale valeur ajoutée du projet.