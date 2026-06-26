# MLD — Modèle Logique de Données

## Objectif

Ce document présente le modèle logique de données de Sovlens.

Il transforme le MCD en structure relationnelle exploitable dans une base de données SQL.

---

## Tables principales

- `users`
- `photos`
- `albums`
- `album_photos`
- `share_links`
- `storage_profiles`

---

## Modèle relationnel

```text
users(
  id PK,
  email UNIQUE NOT NULL,
  password_hash NOT NULL,
  created_at NOT NULL,
  updated_at NOT NULL
)

photos(
  id PK,
  user_id FK -> users.id NOT NULL,
  filename NOT NULL,
  mime_type NOT NULL,
  size NOT NULL,
  object_key NOT NULL,
  storage_mode NOT NULL,
  created_at NOT NULL,
  updated_at NOT NULL
)

albums(
  id PK,
  user_id FK -> users.id NOT NULL,
  name NOT NULL,
  created_at NOT NULL,
  updated_at NOT NULL
)

album_photos(
  album_id PK, FK -> albums.id NOT NULL,
  photo_id PK, FK -> photos.id NOT NULL
)

share_links(
  id PK,
  user_id FK -> users.id NOT NULL,
  photo_id FK -> photos.id NULL,
  album_id FK -> albums.id NULL,
  token UNIQUE NOT NULL,
  expires_at NULL,
  created_at NOT NULL,
  CHECK (
    (photo_id IS NOT NULL AND album_id IS NULL)
    OR
    (photo_id IS NULL AND album_id IS NOT NULL)
  )
)

storage_profiles(
  id PK,
  user_id FK -> users.id UNIQUE NOT NULL,
  mode NOT NULL,
  endpoint NULL,
  bucket NULL,
  created_at NOT NULL,
  updated_at NOT NULL
)
```

---

## Description des tables

### `users`

Table des utilisateurs de l'application.

| Colonne | Type logique | Contrainte |
|---|---|---|
| id | UUID | Clé primaire |
| email | String | Unique, obligatoire |
| password_hash | String | Obligatoire |
| created_at | DateTime | Obligatoire |
| updated_at | DateTime | Obligatoire |

---

### `photos`

Table des métadonnées des photos.

| Colonne | Type logique | Contrainte |
|---|---|---|
| id | UUID | Clé primaire |
| user_id | UUID | Clé étrangère vers `users.id`, obligatoire |
| filename | String | Obligatoire |
| mime_type | String | Obligatoire |
| size | Integer | Obligatoire |
| object_key | String | Obligatoire |
| storage_mode | String | Obligatoire |
| created_at | DateTime | Obligatoire |
| updated_at | DateTime | Obligatoire |

---

### `albums`

Table des albums créés par les utilisateurs.

| Colonne | Type logique | Contrainte |
|---|---|---|
| id | UUID | Clé primaire |
| user_id | UUID | Clé étrangère vers `users.id`, obligatoire |
| name | String | Obligatoire |
| created_at | DateTime | Obligatoire |
| updated_at | DateTime | Obligatoire |

---

### `album_photos`

Table d'association entre les albums et les photos.

Elle permet de représenter la relation plusieurs-à-plusieurs entre `albums` et `photos`.

| Colonne | Type logique | Contrainte |
|---|---|---|
| album_id | UUID | Clé primaire composée, FK vers `albums.id` |
| photo_id | UUID | Clé primaire composée, FK vers `photos.id` |

---

### `share_links`

Table des liens de partage publics.

Un lien de partage peut cibler soit une photo, soit un album.

| Colonne | Type logique | Contrainte |
|---|---|---|
| id | UUID | Clé primaire |
| user_id | UUID | Clé étrangère vers `users.id`, obligatoire |
| photo_id | UUID | Clé étrangère vers `photos.id`, nullable |
| album_id | UUID | Clé étrangère vers `albums.id`, nullable |
| token | String | Unique, obligatoire |
| expires_at | DateTime | Nullable |
| created_at | DateTime | Obligatoire |

Contrainte métier :

```text
(photo_id IS NOT NULL AND album_id IS NULL)
OR
(photo_id IS NULL AND album_id IS NOT NULL)
```

Cette contrainte garantit qu'un lien de partage cible soit une photo, soit un album, mais jamais les deux simultanément.

---

### `storage_profiles`

Table du profil de stockage actif de chaque utilisateur.

Elle permet de connaître le mode de stockage utilisé pour les fichiers de l'utilisateur.

| Colonne | Type logique | Contrainte |
|---|---|---|
| id | UUID | Clé primaire |
| user_id | UUID | Clé étrangère vers `users.id`, unique, obligatoire |
| mode | String | Obligatoire |
| endpoint | String | Nullable |
| bucket | String | Nullable |
| created_at | DateTime | Obligatoire |
| updated_at | DateTime | Obligatoire |

---

## Contraintes principales

### Contraintes d'unicité

- `users.email` doit être unique.
- `share_links.token` doit être unique.
- `storage_profiles.user_id` doit être unique.

### Contraintes relationnelles

- Une photo appartient obligatoirement à un utilisateur.
- Un album appartient obligatoirement à un utilisateur.
- Un profil de stockage appartient obligatoirement à un utilisateur.
- Un lien de partage appartient obligatoirement à l'utilisateur qui l'a généré.
- Une entrée `album_photos` relie obligatoirement un album et une photo.

### Contraintes métier

- Un lien de partage doit cibler soit une photo, soit un album, jamais les deux simultanément.
- Une photo peut exister sans être associée à un album.
- Un album peut exister sans contenir de photo.
- Un utilisateur possède un seul profil de stockage actif.
- Le mode de stockage permet de différencier le stockage cloud du stockage souverain.

---

## Index recommandés

```text
users(email)

photos(user_id)
photos(object_key)
photos(storage_mode)

albums(user_id)

album_photos(album_id)
album_photos(photo_id)

share_links(token)
share_links(user_id)
share_links(photo_id)
share_links(album_id)

storage_profiles(user_id)
storage_profiles(mode)
```

---

## Correspondance MCD / MLD

| MCD | MLD |
|---|---|
| Utilisateur | `users` |
| Photo | `photos` |
| Album | `albums` |
| Album_Photo | `album_photos` |
| Lien_Partage | `share_links` |
| Profil_Stockage | `storage_profiles` |