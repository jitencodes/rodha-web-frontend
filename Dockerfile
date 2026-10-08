# Rodha Web Frontend — multi-stage Next.js standalone image
#
# APP_ENV=development uses committed `.env` (dev API).
# APP_ENV=production uses committed `.env.production` (prod API).
# scripts/select-env.mjs copies that file to `.env` and deletes `.env.production`
# before `next build`, because Next always loads `.env.production` when NODE_ENV=production.

ARG NODE_VERSION=20-alpine

# -----------------------------------------------------------------------------
# Dependencies
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# -----------------------------------------------------------------------------
# Builder
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG APP_ENV=development
ENV APP_ENV=${APP_ENV}
ENV SELECT_ENV_ISOLATE=1
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN node scripts/select-env.mjs && npm run build

# -----------------------------------------------------------------------------
# Runner
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
