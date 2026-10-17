# SovLens — Frontend

Application Next.js 16 (App Router) avec React 19 et Tailwind CSS.

## Lancer en local

```bash
pnpm install
pnpm dev              # http://localhost:3000
```

L'URL de l'API se règle avec `NEXT_PUBLIC_API_URL` (par défaut `http://localhost:3001`).

## Structure

| Chemin | Rôle |
|---|---|
| `app/(auth)/` | Connexion, inscription, mot de passe oublié, réinitialisation |
| `app/(protected)/` | Pages authentifiées : galerie, import, albums, partages, paramètres |
| `app/share/` | Consultation publique d'un lien de partage |
| `lib/api/` | Client HTTP, endpoints et types de l'API |
| `lib/auth/` | Contexte d'authentification |
| `lib/storage/` | Contexte du mode de stockage actif (cloud ou souverain) |
| `components/` | Composants partagés |

## Commandes

```bash
pnpm build            # build de production
pnpm lint             # ESLint
```
