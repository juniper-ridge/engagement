FROM node:24-alpine AS base
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat

# ── Stage 1: Install build dependencies ─────────────────────────────────────
FROM base AS deps

# The repo postinstall script lives under scripts/, so copy it before npm ci.
COPY package.json package-lock.json ./
COPY scripts ./scripts
RUN npm ci

# ── Stage 2: Build app and prune dev dependencies ───────────────────────────
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev

# ── Stage 3: Production runner ───────────────────────────────────────────────
FROM base AS runner

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Run pending migrations against the persistent volume, then start Next.js.
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
