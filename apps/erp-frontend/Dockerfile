FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/erp-frontend/package.json ./apps/erp-frontend/
COPY apps/erp-frontend/package-lock.json* ./
RUN npm ci --workspace=apps/erp-frontend

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace=apps/erp-frontend

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/erp-frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/erp-frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/erp-frontend/.next/static ./.next/static

USER nextjs
EXPOSE 3001
ENV PORT=3001
CMD ["node", "server.js"]
