FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/erp-api/package.json ./apps/erp-api/
COPY libs/*/package.json ./libs/
RUN npm ci --workspace=apps/erp-api

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/erp-api/node_modules ./apps/erp-api/node_modules
COPY . .
RUN npx prisma generate --schema=apps/erp-api/prisma/schema.prisma
RUN npm run build --workspace=apps/erp-api

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs

COPY --from=builder /app/apps/erp-api/dist ./dist
COPY --from=builder /app/apps/erp-api/node_modules ./node_modules
COPY --from=builder /app/apps/erp-api/package.json ./
COPY --from=builder /app/apps/erp-api/prisma ./prisma

USER nestjs
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/main"]
