# Diagramme de séquence — Partage d'une photo ou d'un album

## Objectif

Ce diagramme décrit le partage public d'une photo ou d'un album par un utilisateur authentifié.

Le backend vérifie que l'utilisateur est propriétaire de la ressource, génère un token de partage, enregistre le lien puis renvoie une URL publique au frontend.

## Diagramme

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'fontSize': '16px'}}}%%
sequenceDiagram
  actor U as Utilisateur
  participant F as Frontend
  participant B as Backend
  participant DB as PostgreSQL
  actor P as Personne destinataire

  U->>F: clique sur "Partager"
  F->>B: POST /share-links
  B->>DB: vérifie propriétaire photo/album
  DB-->>B: ressource autorisée
  B->>B: génère token unique
  B->>DB: INSERT share_link
  DB-->>B: lien enregistré
  B-->>F: URL publique de partage
  F-->>U: affiche le lien de partage

  U-->>P: transmet le lien
  P->>B: GET /shared/:token
  B->>DB: recherche share_link
  DB-->>B: ressource partagée
  B-->>P: affiche photo ou album partagé
```

## Description

1. L'utilisateur clique sur l'action de partage depuis une photo ou un album.
2. Le frontend envoie une demande de création de lien public au backend.
3. Le backend vérifie que l'utilisateur est bien propriétaire de la ressource.
4. Le backend génère un token unique.
5. Le lien de partage est enregistré en base de données.
6. Le frontend affiche l'URL publique générée.
7. L'utilisateur transmet ce lien à une autre personne.
8. La personne destinataire accède à la ressource partagée via le token.

## Remarque

Le lien public ne donne pas accès au compte utilisateur complet.  
Il permet uniquement d'accéder à la ressource explicitement partagée.