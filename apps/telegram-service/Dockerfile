FROM node:24-alpine AS builder
LABEL authors="wygnd"

WORKDIR /app

# Копируем корневые файлы
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем файлы сервисов
COPY apps/telegram-gateway/package.json ./apps/telegram-gateway/
COPY libs/common/package.json ./libs/common/

RUN corepack enable
RUN pnpm --filter @addy/common install --frozen-lockfile
RUN pnpm --filter @addy/telegram-gateway install --frozen-lockfile

COPY apps/telegram-gateway ./apps/telegram-gateway
COPY libs/common ./libs/common

RUN pnpm --filter @addy/common run build
RUN pnpm --filter @addy/telegram-gateway run build

FROM node:24-alpine AS production

WORKDIR /app

# Копируем корневые файлы
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

COPY --from=builder /app/apps/telegram-gateway/package.json ./apps/telegram-gateway/
COPY --from=builder /app/apps/telegram-gateway/dist ./apps/telegram-gateway/dist
COPY --from=builder /app/libs/common/package.json ./libs/common/
COPY --from=builder /app/libs/common/dist ./libs/common/dist

RUN corepack enable
RUN pnpm --filter @addy/telegram-gateway install --frozen-lockfile --prod

EXPOSE 3000

CMD ["node", "apps/telegram-gateway/dist/main.js"]