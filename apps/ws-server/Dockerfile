FROM node:20-alpine AS base

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/ws-server/package.json ./apps/ws-server/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile

FROM base AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/ws-server/node_modules ./apps/ws-server/node_modules
COPY apps/ws-server ./apps/ws-server

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 wsuser

USER wsuser
EXPOSE 3001
ENV PORT=3001
ENV NODE_ENV=production

CMD ["node", "--import", "tsx", "apps/ws-server/src/index.ts"]
