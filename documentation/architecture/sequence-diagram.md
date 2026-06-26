# Diagrammes de séquence

## Objectif

Ces diagrammes illustrent les principaux flux d'interaction entre le frontend, le backend, la base de données et les services de stockage de Sovlens.

Ils présentent le fonctionnement de la Killer Feature du projet ainsi que les principaux échanges entre les différents composants de l'application.

Les scénarios couverts sont :

- upload d'une photo en mode cloud ;
- activation du mode de stockage souverain ;
- upload d'une photo en mode souverain ;
- partage public d'une photo ou d'un album.

---

## Scénario 1 — Upload en mode cloud (par défaut)

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'fontSize': '16px'}}}%%
sequenceDiagram
  actor U as Utilisateur
  participant F as Frontend
  participant B as Backend
  participant DB as PostgreSQL
  participant GC as Garage cloud

  U->>F: Upload d'une photo
  F->>B: POST /photos
  B->>DB: Lecture du profil de stockage
  DB-->>B: Mode = CLOUD
  B->>GC: PUT objet S3
  GC-->>B: URL de stockage
  B->>DB: INSERT des métadonnées
  B-->>F: 201 Created
  F-->>U: Photo ajoutée à la galerie
```

---

## Scénario 2 — Activation du mode souverain

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'fontSize': '16px'}}}%%
sequenceDiagram
  actor U as Utilisateur
  participant F as Frontend
  participant B as Backend
  participant DB as PostgreSQL

  U->>F: Ouvre les paramètres de stockage
  F->>B: GET /storage/config
  B-->>F: Configuration actuelle

  F-->>U: Affichage du formulaire

  U->>F: Configure un stockage souverain
  F->>B: PATCH /storage/config

  Note over B: Vérification de la connexion<br/>au stockage compatible S3

  B->>DB: UPDATE du profil de stockage
  B-->>F: 200 OK
  F-->>U: Mode souverain activé
```

---

## Scénario 3 — Upload en mode souverain

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'fontSize': '16px'}}}%%
sequenceDiagram
  actor U as Utilisateur
  participant F as Frontend
  participant B as Backend
  participant DB as PostgreSQL
  participant GS as Garage souverain

  U->>F: Upload d'une photo
  F->>B: POST /photos
  B->>DB: Lecture du profil de stockage
  DB-->>B: Mode = SOVEREIGN
  B->>GS: PUT objet S3
  GS-->>B: URL de stockage
  B->>DB: INSERT des métadonnées
  B-->>F: 201 Created
  F-->>U: Photo ajoutée à la galerie
```

---

## Scénario 4 — Partage d'une photo ou d'un album

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': {'fontSize': '16px'}}}%%
sequenceDiagram
  actor U as Utilisateur
  participant F as Frontend
  participant B as Backend
  participant DB as PostgreSQL
  actor P as Destinataire

  U->>F: Clique sur « Partager »
  F->>B: POST /share-links
  B->>DB: Vérifie la propriété de la ressource
  DB-->>B: Ressource autorisée
  B->>B: Génère un token unique
  B->>DB: INSERT du lien de partage
  B-->>F: URL publique
  F-->>U: Affiche le lien de partage

  U-->>P: Transmet le lien

  P->>B: GET /shared/:token
  B->>DB: Recherche du lien de partage
  DB-->>B: Ressource trouvée
  B-->>P: Affiche la photo ou l'album partagé
```

## Conclusion

Ces diagrammes présentent les principaux flux fonctionnels de Sovlens : l'upload d'une photo, l'activation du mode de stockage souverain, le stockage des fichiers selon le mode choisi et le partage public de photos ou d'albums.

Ils montrent que le frontend interagit toujours avec la même API REST. Le backend se charge ensuite de sélectionner le fournisseur de stockage approprié et de gérer les traitements métier, garantissant une expérience utilisateur identique quel que soit le mode de stockage retenu.