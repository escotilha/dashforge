FROM node:20-alpine AS base

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/simulator/package.json ./apps/simulator/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile

FROM base AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/simulator/node_modules ./apps/simulator/node_modules
COPY apps/simulator ./apps/simulator

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 simuser

USER simuser
ENV NODE_ENV=production

CMD ["node", "--import", "tsx", "apps/simulator/src/index.ts"]
