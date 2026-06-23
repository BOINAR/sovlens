# ===== STAGE 1 : BUILD =====
FROM node:22-alpine AS builder

WORKDIR /app

# Installation de pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copie des dépendances
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copie du code source
COPY . .

# Build Next.js
RUN pnpm build

# ===== STAGE 2 : PRODUCTION =====
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copie du build Next.js standalone
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["node", "server.js"]