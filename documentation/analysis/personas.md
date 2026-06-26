# Personas

## Introduction

Dans le cadre de la conception de Sovlens, deux personas ont été définis afin de représenter les principaux profils d'utilisateurs ciblés par l'application.

Ces profils permettent de mieux comprendre les besoins des futurs utilisateurs, d'orienter les choix fonctionnels et de garantir que les fonctionnalités développées répondent à des cas d'usage concrets.

Les personas serviront également de base à la rédaction des User Stories et à la conception des interfaces utilisateur.

---

# Persona 1 — Thomas Martin

## Informations générales

| Critère | Valeur |
|----------|--------|
| Âge | 34 ans |
| Profession | Développeur logiciel |
| Localisation | Lyon |
| Niveau technique | Avancé |
| Équipements | Mini PC, NAS, ordinateur portable Linux, smartphone Android |

## Comportement numérique

Thomas utilise quotidiennement des logiciels open source et privilégie les solutions auto-hébergées lorsqu'elles existent. Il souhaite conserver le contrôle de ses données personnelles et limiter sa dépendance aux services proposés par les grands fournisseurs de cloud.

## Objectifs

- Conserver la maîtrise de ses données.
- Héberger lui-même ses photos.
- Accéder à ses fichiers depuis plusieurs appareils.
- Partager des albums de manière sécurisée.
- Utiliser une solution open source et pérenne.

## Frustrations

- Les services cloud imposent le stockage des données chez un tiers.
- Les abonnements augmentent régulièrement.
- Les solutions auto-hébergées sont souvent complexes à installer ou à administrer.

## Scénario d'usage

Thomas installe Sovlens sur un VPS et configure son propre stockage souverain hébergé sur un mini PC à son domicile.

Depuis les paramètres de l'application, il renseigne les informations de connexion de son serveur de stockage compatible S3. Une fois la configuration validée, toutes les nouvelles photos importées sont automatiquement enregistrées sur son infrastructure personnelle tout en restant accessibles via l'interface web.

---

# Persona 2 — Claire Dubois

## Informations générales

| Critère | Valeur |
|----------|--------|
| Âge | 29 ans |
| Profession | Photographe amateur |
| Localisation | Marseille |
| Niveau technique | Intermédiaire |
| Équipements | MacBook, iPhone |

## Comportement numérique

Claire recherche une solution simple pour sauvegarder et organiser ses photos. Elle utilise principalement des services cloud classiques mais souhaite conserver la possibilité de reprendre le contrôle de ses données sans changer d'application.

## Objectifs

- Sauvegarder facilement ses photos.
- Organiser ses albums.
- Partager des galeries avec ses proches.
- Pouvoir évoluer vers une solution plus souveraine si nécessaire.

## Frustrations

- Les espaces de stockage gratuits sont rapidement insuffisants.
- Les abonnements cloud deviennent coûteux.
- Les données sont hébergées chez des fournisseurs tiers sans véritable contrôle de leur localisation.

## Scénario d'usage

Claire crée un compte Sovlens et utilise dans un premier temps le stockage cloud proposé par l'application.

Quelques mois plus tard, elle acquiert un mini PC préconfiguré avec le mode souverain. Depuis les paramètres de Sovlens, elle renseigne les informations de connexion de son stockage personnel et bascule simplement vers ce nouveau mode sans modifier ses habitudes d'utilisation.

---

# Synthèse

Les deux personas représentent les principaux profils ciblés par Sovlens.

Thomas met en avant les besoins des utilisateurs souhaitant bénéficier d'une infrastructure auto-hébergée et d'une maîtrise complète de leurs données.

Claire représente les utilisateurs recherchant avant tout une solution simple d'utilisation, tout en conservant la possibilité d'évoluer vers un stockage souverain.

Cette complémentarité justifie le choix d'une architecture reposant sur un système de stockage interchangeable permettant de basculer entre un stockage cloud classique et un stockage souverain sans modifier l'expérience utilisateur.