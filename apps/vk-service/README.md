# @addy/vk-service

Микросервис для отправки уведомлений пользователям через ВКонтакте в рамках `notification-system`.

## Назначение

Сервис отвечает за:

- Отправку сообщений пользователям VK от имени сообщества (VK API)
- Приём команд на отправку через RabbitMQ от `api-gateway`

Сервис не хранит бизнес-логику пользователей и авторизации — за это отвечает `identity-service`.

## Архитектура

```
api-gateway ──(RabbitMQ)──▶ vk-service ──(VK API)──▶ ВКонтакте
                                │
                                └──(RabbitMQ)──▶ identity-service (привязка аккаунта, статусы)
```

Сервис поднят как гибридное NestJS-приложение:

- **RMQ microservice** — принимает команды на отправку (`notifications.vk.send`)

## Переменные окружения

| Переменная                   | Описание                       | Пример                           |
|------------------------------|--------------------------------|----------------------------------|
| `RABBITMQ_URL`               | Строка подключения к RabbitMQ  | `amqp://user:pass@rabbitmq:5672` |
| `RABBITMQ_QUEUE_NAME`        | Строка подключения к RabbitMQ  | `notify.vk`                      |
| `RABBITMQ_QUEUE_NAME_RESULT` | Строка подключения к RabbitMQ  | `notify.result`                  |
| `VK_BOT_API_KEY`             | Токен сообщества VK (Bots API) | —                                |
| `VK_ADDY_GROUP_ID`           | ID сообщества VK               | —                                |

См. `.env.example` для полного списка.

## Запуск локально

```bash
# из корня монорепы
pnpm install
pnpm --filter @addy/vk-service dev
```

## Запуск в Docker

```bash
docker compose -f docker/docker-compose.yml up vk-service
```

## Зависимости монорепы

- `@addy/common` — общие DTO, enum'ы (`NotificationResultEnum`), утилиты (`normalizeError`), eslint/prettier конфиги

## Тестирование

```bash
pnpm --filter @addy/vk-service test
pnpm --filter @addy/vk-service test:e2e
```

## Связанные сервисы

- [`api-gateway`](../api-gateway/README.md) — приём внешних HTTP-запросов, маршрутизация в RMQ
- [`identity-service`](../identity-service/README.md) — привязка аккаунтов, OTP, авторизация
- [`telegram-service`](../telegram-service/README.md) — аналогичный сервис для Telegram