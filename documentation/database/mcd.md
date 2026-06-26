# MCD — Modèle Conceptuel de Données

## Objectif

Ce document présente le modèle conceptuel de données de Sovlens.

Il décrit les principales entités métier de l'application, leurs attributs importants et les relations entre elles.

Le MCD reste indépendant des choix techniques d'implémentation. Il ne représente donc pas Drizzle ORM, NestJS, Garage ou PostgreSQL comme des entités métier.

---

## Entités principales

- Utilisateur
- Photo
- Album
- Lien de partage
- Profil de stockage

---

## Diagramme

```mermaid
erDiagram
    UTILISATEUR {
        uuid id
        string email
        string password_hash
        datetime created_at
        datetime updated_at
    }

    PHOTO {
        uuid id
        string filename
        string mime_type
        int size
        string object_key
        string storage_mode
        datetime created_at
        datetime updated_at
    }

    ALBUM {
        uuid id
        string name
        datetime created_at
        datetime updated_at
    }

    ALBUM_PHOTO {
        uuid album_id
        uuid photo_id
    }

    LIEN_PARTAGE {
        uuid id
        uuid photo_id
        uuid album_id
        string token
        datetime expires_at
        datetime created_at
    }

    PROFIL_STOCKAGE {
        uuid id
        string mode
        string endpoint
        string bucket
        datetime updated_at
    }

    UTILISATEUR ||--o{ PHOTO : possède
    UTILISATEUR ||--o{ ALBUM : crée
    UTILISATEUR ||--|| PROFIL_STOCKAGE : configure
    UTILISATEUR ||--o{ LIEN_PARTAGE : génère

    ALBUM ||--o{ ALBUM_PHOTO : contient
    PHOTO ||--o{ ALBUM_PHOTO : appartient_a

    PHOTO ||--o{ LIEN_PARTAGE : peut_etre_partagee
    ALBUM ||--o{ LIEN_PARTAGE : peut_etre_partage
```

---

## Description des entités

### Utilisateur

L'entité `Utilisateur` représente une personne possédant un compte sur Sovlens.

Elle permet de gérer :

- l'identité du compte ;
- l'authentification ;
- les photos associées ;
- les albums créés ;
- les liens de partage générés ;
- les préférences de stockage.

---

### Photo

L'entité `Photo` représente une image ajoutée par un utilisateur.

Elle ne contient pas le fichier binaire de la photo.

Elle stocke uniquement les métadonnées nécessaires à sa gestion :

- nom du fichier ;
- type MIME ;
- taille ;
- clé de stockage objet ;
- mode de stockage utilisé.

---

### Album

L'entité `Album` permet de regrouper plusieurs photos.

Un utilisateur peut créer plusieurs albums.

Une photo peut appartenir à plusieurs albums.

Cette relation plusieurs-à-plusieurs est représentée par l'entité d'association `Album_Photo`.

---

### Album_Photo

L'entité `Album_Photo` représente l'association entre un album et une photo.

Elle permet de modéliser la relation plusieurs-à-plusieurs entre les albums et les photos.

---

### Lien de partage

L'entité `Lien_Partage` permet de partager publiquement une photo ou un album.

Un lien de partage contient :

- un token unique ;
- une date de création ;
- une date d'expiration optionnelle.

Un lien cible soit une photo, soit un album.

Les attributs `photo_id` et `album_id` sont exclusifs : un seul est renseigné pour un même lien de partage.

---

### Profil de stockage

L'entité `Profil_Stockage` représente les préférences de stockage d'un utilisateur.

Il permet de définir le mode de stockage actif :

- `cloud` : stockage objet hébergé sur l'infrastructure cloud de Sovlens ;
- `souverain` : stockage objet hébergé sur une infrastructure personnelle compatible S3.

Ce profil permet au backend de déterminer où stocker les fichiers de l'utilisateur.

---

## Cardinalités

| Relation | Cardinalité | Description |
|----------|:-----------:|-------------|
| Utilisateur — Photo | 1,n | Un utilisateur peut posséder plusieurs photos. Une photo appartient à un seul utilisateur. |
| Utilisateur — Album | 1,n | Un utilisateur peut créer plusieurs albums. Un album appartient à un seul utilisateur. |
| Utilisateur — Profil_Stockage | 1,1 | Un utilisateur possède un seul profil de stockage actif. |
| Album — Photo | n,n | Un album peut contenir plusieurs photos. Une photo peut appartenir à plusieurs albums. |
| Utilisateur — Lien_Partage | 1,n | Un utilisateur peut générer plusieurs liens de partage. |
| Photo — Lien_Partage | 0,n | Une photo peut être partagée par plusieurs liens. |
| Album — Lien_Partage | 0,n | Un album peut être partagé par plusieurs liens. |

---

## Règles métier

- Une photo appartient obligatoirement à un utilisateur.
- Un album appartient obligatoirement à un utilisateur.
- Une photo peut exister sans appartenir à un album.
- Un album peut être créé sans contenir de photo.
- Un utilisateur possède un unique profil de stockage.
- Un lien de partage cible soit une photo, soit un album, jamais les deux simultanément.
- Les fichiers binaires ne sont jamais stockés dans la base de données relationnelle. Ils sont enregistrés dans un stockage objet compatible S3.