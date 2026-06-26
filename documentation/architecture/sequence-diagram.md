# Diagrammes de séquence

## Objectif

Ces diagrammes illustrent les principaux flux d'interaction entre le frontend, le backend, la base de données et les services de stockage de Sovlens.

Ils présentent le fonctionnement de la Killer Feature du projet ainsi que les principaux échanges entre les différents composants de l'application.

Les scénarios couverts sont :

- upload d'une photo en mode cloud ;
- activation du mode de stockage souverain ;
- upload d'une photo en mode souverain.

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

## Conclusion

Ces trois diagrammes mettent en évidence le fonctionnement de la Killer Feature de Sovlens. Quelle que soit la destination de stockage choisie (cloud ou souveraine), le frontend utilise la même API REST. Le backend sélectionne dynamiquement le fournisseur de stockage approprié avant d'enregistrer les métadonnées dans PostgreSQL.

Cette architecture garantit une expérience utilisateur identique tout en laissant à chaque utilisateur le choix de l'emplacement de stockage de ses photos.