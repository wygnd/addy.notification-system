# @addy/telegram-service

Telegram-бот для отправки уведомлений в рамках системы ADDY. Обработывает команды бота и отправляет сообщения через Telegram Bot API.

## Содержание

- [Функциональность](#функциональность)
- [Технологии](#технологии)
- [Быстрый старт](#быстрый-старт)
- [Конфигурация](#конфигурация)
- [Команды бота](#команды-бота)
- [RabbitMQ](#rabbitmq)
- [Структура](#структура)

## Функциональность

- **Telegram-бот** — обработка команд пользователей и отправка уведомлений
- **RabbitMQ-потребитель** — получение задач на отправку из API Gateway
- **HTTP-эндпоинты** — webhooks и health-check
- **Интеграция с identity** — проверка и привязка пользователей

## Технологии

| Компонент | Технология |
|---|---|
| Фреймворк | NestJS 11 + Fastify |
| Telegram Bot API | grammy |
| Брокер | RabbitMQ (amqplib) |
| HTTP-прокси | https-proxy-agent |

## Быстрый старт

```bash
# Установить зависимости
pnpm install

# Режим разработки
pnpm start:dev

# Сборка
pnpm build

# Продакшен
pnpm start:prod
```

## Конфигурация

| Переменная | Описание |
|---|---|
| `PORT` | Порт HTTP-сервера |
| `RABBITMQ_URL` | URL RabbitMQ |
| `RABBITMQ_QUEUE_NAME_TELEGRAM` | Очередь Telegram |
| `TELEGRAM_BOT_TOKEN` | Токен Telegram-бота |
| `TELEGRAM_WEBHOOK_SECRET` | Секрет для валидации webhook |

## Команды бота

| Команда | Описание |
|---|---|
| `/start` | Начать работу с ботом |
| `/connect` | Привязать аккаунт к платформе |

## RabbitMQ

Сервис потребляет сообщения из очереди `notifications.telegram` и отправляет уведомления через Telegram Bot API. Ответы возвращаются в очередь результатов.

## Структура

```
src/
├── common/              # Общие настройки (микросервисы)
├── modules/
│   ├── identity/        # Интеракция с identity-сервисом
│   └── telegram/        # Основной модуль Telegram
│       ├── bot/         # Grammy-бот, хендлеры команд
│       │   ├── handlers/commands/  # /start, /connect
│       │   └── registrator/        # Регистрация бота
│       ├── controllers/ # HTTP и RMQ контроллеры
│       ├── guards/      # Webhook-аутентификация
│       ├── interfaces/  # Интерфейсы команд и бота
│       ├── providers/   # Провайдеры
│       └── services/    # Telegram API сервис
└── shared/              # RPC-исключения
```
