# User Stories

## Introduction

Les User Stories décrivent les besoins fonctionnels de Sovlens du point de vue des utilisateurs identifiés dans les personas.

Chaque User Story est exprimée selon le format Given / When / Then, accompagnée de critères d'acceptation, d'une priorité MoSCoW et d'une estimation en Story Points.

---

# MVP

## US-01 — Création d'un compte

**En tant que** nouvel utilisateur,

**Je souhaite** créer un compte,

**Afin de** pouvoir accéder à mon espace personnel.

### Given / When / Then

- **Given** que je suis sur la page d'inscription
- **When** je renseigne un email et un mot de passe valides
- **Then** mon compte est créé et je peux me connecter.

### Critères d'acceptation

- Validation des champs
- Email unique
- Mot de passe sécurisé

**Priorité :** Must

**Story Points :** 3

---

## US-02 — Connexion

**En tant qu'utilisateur**

**Je souhaite** me connecter

**Afin d'accéder** à ma galerie.

### Given / When / Then

- Given que je possède un compte
- When je saisis mes identifiants
- Then je suis authentifié.

### Critères d'acceptation

- JWT généré
- Session ouverte

**Priorité :** Must

**Story Points :** 3

---

## US-03 — Upload d'une photo

**En tant qu'utilisateur**

**Je souhaite** envoyer une photo

**Afin de** la sauvegarder.

### Given / When /Then

- Given que je suis connecté
- When je sélectionne une photo
- Then elle est enregistrée dans mon espace.

### Critères d'acceptation

- Taille maximale 10 MB
- Formats autorisés
- Confirmation d'envoi

**Priorité :** Must

**Story Points :** 5

---

## US-04 — Consulter la galerie

**En tant qu'utilisateur**

**Je souhaite** consulter mes photos

**Afin de** retrouver rapidement mes souvenirs.

### Given / When / Then

- Given que je possède des photos
- When j'ouvre ma galerie
- Then les photos sont affichées.

### Critères d'acceptation

- Affichage rapide
- Tri chronologique

**Priorité :** Must

**Story Points :** 5

---

## US-05 — Gérer des albums

**En tant qu'utilisateur**

**Je souhaite** créer des albums

**Afin d'organiser** mes photos.

### Given / When / Then

- Given que je suis connecté
- When je crée un album
- Then je peux y ajouter des photos.

### Critères d'acceptation

- Création
- Modification
- Suppression

**Priorité :** Should

**Story Points :** 5

---

## US-06 — Partager une galerie

**En tant qu'utilisateur**

**Je souhaite** partager mes photos

**Afin que** d'autres personnes puissent les consulter.

### Given / When / Then

- Given que je possède un album
- When je génère un lien
- Then celui-ci est accessible publiquement.

### Critères d'acceptation

- Lien unique
- Date d'expiration configurable

**Priorité :** Should

**Story Points :** 5

---

# Killer Feature

## US-07 — Basculer vers un stockage souverain

**En tant qu'utilisateur**

**Je souhaite** configurer mon propre stockage compatible S3

**Afin de** conserver la maîtrise de mes données.

### Given / When / Then

- Given que je suis connecté
- When je renseigne les paramètres de mon stockage
- Then Sovlens utilise automatiquement cette destination pour les prochains uploads.

### Critères d'acceptation

- Validation de la connexion S3
- Sauvegarde de la configuration
- Changement de fournisseur sans redéploiement

**Priorité :** Must

**Story Points :** 8

---

# Priorisation MoSCoW

| User Story | Priorité |
|------------|----------|
| US-01 | Must |
| US-02 | Must |
| US-03 | Must |
| US-04 | Must |
| US-05 | Should |
| US-06 | Should |
| US-07 | Must |

---

# Synthèse

Les User Stories couvrent l'ensemble du MVP de Sovlens ainsi que sa Killer Feature.

Elles serviront de base au backlog produit, au développement des fonctionnalités et à la rédaction des tests d'acceptation.