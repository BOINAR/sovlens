# User Stories

## Introduction

Les User Stories décrivent les besoins fonctionnels de Sovlens du point de vue des utilisateurs identifiés dans les personas.

Chaque User Story est exprimée selon le format **Given / When / Then**, accompagnée de critères d'acceptation, d'une priorité **MoSCoW** et d'une estimation en **Story Points**.

---

# MVP

## US-01 — Création d'un compte

**En tant que** nouvel utilisateur,

**Je souhaite** créer un compte,

**Afin de** pouvoir accéder à mon espace personnel.

### Given / When / Then

- **Given** que je suis sur la page d'inscription.
- **When** je renseigne un email et un mot de passe valides.
- **Then** mon compte est créé et je peux me connecter.

### Critères d'acceptation

- Validation des champs.
- Adresse email unique.
- Mot de passe sécurisé.

**Priorité :** Must

**Story Points :** 3

---

## US-02 — Connexion

**En tant qu'**utilisateur,

**Je souhaite** me connecter,

**Afin d'**accéder à ma galerie.

### Given / When / Then

- **Given** que je possède un compte.
- **When** je saisis mes identifiants.
- **Then** je suis authentifié.

### Critères d'acceptation

- Génération d'un JWT.
- Ouverture de la session utilisateur.

**Priorité :** Must

**Story Points :** 3

---

## US-03 — Upload d'une photo

**En tant qu'**utilisateur,

**Je souhaite** envoyer une photo,

**Afin de** la sauvegarder.

### Given / When / Then

- **Given** que je suis connecté.
- **When** je sélectionne une photo.
- **Then** elle est enregistrée dans mon espace personnel.

### Critères d'acceptation

- Taille maximale : 10 Mo.
- Formats de fichiers autorisés.
- Confirmation de l'envoi.

**Priorité :** Must

**Story Points :** 5

---

## US-04 — Consulter la galerie

**En tant qu'**utilisateur,

**Je souhaite** consulter mes photos,

**Afin de** retrouver rapidement mes souvenirs.

### Given / When / Then

- **Given** que je possède des photos.
- **When** j'ouvre ma galerie.
- **Then** mes photos sont affichées.

### Critères d'acceptation

- Affichage rapide.
- Tri chronologique.

**Priorité :** Must

**Story Points :** 5

---

## US-05 — Gérer des albums

**En tant qu'**utilisateur,

**Je souhaite** créer et gérer des albums,

**Afin d'**organiser mes photos.

### Given / When / Then

- **Given** que je suis connecté.
- **When** je crée un album.
- **Then** je peux y ajouter ou retirer des photos.

### Critères d'acceptation

- Création d'un album.
- Modification du nom.
- Suppression d'un album.

**Priorité :** Should

**Story Points :** 5

---

## US-06 — Partager une galerie

**En tant qu'**utilisateur,

**Je souhaite** partager une photo ou un album,

**Afin que** d'autres personnes puissent les consulter.

### Given / When / Then

- **Given** que je possède une photo ou un album.
- **When** je génère un lien de partage.
- **Then** celui-ci est accessible publiquement.

### Critères d'acceptation

- Génération d'un lien unique.
- Date d'expiration configurable.
- Accès limité à la ressource partagée.

**Priorité :** Should

**Story Points :** 5

---

# Killer Feature

## US-07 — Basculer vers un stockage souverain

**En tant qu'**utilisateur,

**Je souhaite** configurer mon propre stockage compatible S3,

**Afin de** conserver la maîtrise de mes données.

### Given / When / Then

- **Given** que je suis connecté.
- **When** je renseigne les paramètres de mon stockage compatible S3.
- **Then** Sovlens utilise automatiquement cette destination pour les prochains uploads.

### Critères d'acceptation

- Validation de la connexion au stockage compatible S3.
- Sauvegarde de la configuration utilisateur.
- Changement de fournisseur de stockage sans redéploiement de l'application.

**Priorité :** Must

**Story Points :** 8

---

# Priorisation MoSCoW

| User Story | Priorité | Story Points |
|------------|----------|--------------:|
| US-01 | Must | 3 |
| US-02 | Must | 3 |
| US-03 | Must | 5 |
| US-04 | Must | 5 |
| US-05 | Should | 5 |
| US-06 | Should | 5 |
| US-07 | Must | 8 |

---

# Synthèse

Ces User Stories couvrent les fonctionnalités essentielles du MVP ainsi que la Killer Feature de Sovlens.

Elles constituent la base du backlog produit et serviront de référence pour le développement, la planification et la validation des fonctionnalités de l'application.