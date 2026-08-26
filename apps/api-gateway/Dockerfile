FROM node:24-alpine AS builder
LABEL authors="wygnd"

WORKDIR /app

# Копируем корневые файлы
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем файлы сервисов
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY libs/common/package.json ./libs/common/

RUN corepack enable
RUN pnpm --filter @addy/common install --frozen-lockfile
RUN pnpm --filter @addy/api-gateway install --frozen-lockfile

COPY apps/api-gateway ./apps/api-gateway
COPY libs/common ./libs/common

RUN pnpm --filter @addy/common run build
RUN pnpm --filter @addy/api-gateway run build

FROM node:24-alpine AS production

WORKDIR /app

# Копируем корневые файлы
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

COPY --from=builder /app/apps/api-gateway/package.json ./apps/api-gateway/
COPY --from=builder /app/apps/api-gateway/dist ./apps/api-gateway/dist
COPY --from=builder /app/libs/common/package.json ./libs/common/
COPY --from=builder /app/libs/common/dist ./libs/common/dist

RUN corepack enable
RUN pnpm --filter @addy/api-gateway install --frozen-lockfile --prod

EXPOSE 3000

CMD ["node", "app/apps/api-gateway/dist/main.js"]