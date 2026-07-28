FROM node:24-alpine AS builder
LABEL authors="wygnd"

WORKDIR /app

# Копируем корневые файлы
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем файлы сервиса
COPY apps/api-gateway/package.json ./apps/api-gateway/

RUN pnpm --filter @addy/api-gateway install --frozen-lockfile

COPY apps/api-gateway ./apps/api-gateway
COPY libs/common ./libs/common

RUN pnpm --filter @addy/common run build
RUN pnpm --filter @addy/api-gateway run build

FROM node:24-alpine AS production

WORKDIR /app

COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=builder /app/apps/api-gateway/package.json ./
COPY --from=builder /app/libs/common/dist ./libs/common/dist
COPY --from=builder /app/libs/common/package.json ./libs/common/

# Копируем корневые файлы
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm --filter @addy/api-gateway install --frozen-lockfile --prod

EXPOSE 3000

CMD ["node", "dist/main.js"]