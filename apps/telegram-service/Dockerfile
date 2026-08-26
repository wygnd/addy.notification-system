FROM node:24-alpine AS builder
LABEL authors="wygnd"

WORKDIR /app

# Копируем корневые файлы
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

# Копируем файлы сервисов
COPY apps/telegram-service/package.json ./apps/telegram-service/
COPY libs/common/package.json ./libs/common/

RUN corepack enable
RUN pnpm --filter @addy/common install --frozen-lockfile
RUN pnpm --filter @addy/telegram-service install --frozen-lockfile

COPY apps/telegram-service ./apps/telegram-service
COPY libs/common ./libs/common

RUN pnpm --filter @addy/common run build
RUN pnpm --filter @addy/telegram-service run build

FROM node:24-alpine AS production

WORKDIR /app

# Копируем корневые файлы
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

COPY --from=builder /app/apps/telegram-service/package.json ./apps/telegram-service/
COPY --from=builder /app/libs/common/package.json ./libs/common/

RUN corepack enable
RUN pnpm --filter @addy/telegram-service install --frozen-lockfile --prod
RUN pnpm --filter @addy/common install --frozen-lockfile --prod

COPY --from=builder /app/apps/telegram-service/dist ./apps/telegram-service/dist
COPY --from=builder /app/libs/common/dist ./libs/common/dist

EXPOSE 3000

CMD ["node", "./apps/telegram-service/dist/main.js"]