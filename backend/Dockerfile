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

# Build NestJS
RUN pnpm build

# ===== STAGE 2 : PRODUCTION =====
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Installation de pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Uniquement les dépendances de production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Copie du build
COPY --from=builder /app/dist ./dist

# Utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 4000

CMD ["node", "dist/main.js"]