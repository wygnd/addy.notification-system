# ADDY Notification System

Микросервисная система отправки многоканальных уведомлений для платформы ADDY. Поддерживает отправку через **Telegram** и **VK**, а также планирование через **MAX**.

## Архитектура

```
┌─────────────┐     HTTP/RPC      ┌──────────────────┐
│   Client    │ ──────────────►   │   API Gateway    │
└─────────────┘                   │  (NestJS + Fast) │
                                  └─────────┬────────┘
                                            │ RabbitMQ
                                  ┌─────────┼─────────┐
                                  ▼         ▼         ▼
                              ┌───────┐ ┌───────┐ ┌───────┐
                              │ Ident.│ │  VK   │ │  Tg   │
                              │ Serv. │ │ Serv. │ │ Serv. │
                              └───┬───┘ └───┬───┘ └───┬───┘
                                  │         │         │
                                  ▼         ▼         ▼
                              ┌────────────────────────┐
                              │   Telegram  Service    │
                              └────────────────────────┘

  Данные: PostgreSQL ── Redis ── RabbitMQ
```

## Сервисы

| Сервис | Пакет | Описание | Статус |
|---|---|---|---|
| [api-gateway](apps/api-gateway/README.md) | `@addy/api-gateway` | Шлюз API — HTTP/RPC эндпоинты, CQRS, Swagger | ✅ Готов |
| [identity-service](apps/identity-service/README.md) | `@addy/identity-service` | Управление привязками пользователей | ✅ Готов |
| [telegram-service](apps/telegram-service/README.md) | `@addy/telegram-service` | Telegram-бот (grammy) | 🚧 В работе |
| [vk-service](apps/vk-service/README.md) | `@addy/vk-service` | VK-бот (node-vk-bot-api) | ✅ Готов |

## Библиотеки

| Пакет | Описание |
|---|---|
| [@addy/common](libs/common/README.md) | Общие типы, интерфейсы, константы, утилиты |

## Технологический стек

- **Язык** — TypeScript
- **Фреймворк** — NestJS 11
- **HTTP-сервер** — Fastify / Express
- **Брокер сообщений** — RabbitMQ
- **База данных** — PostgreSQL (Sequelize ORM)
- **Кеш** — Redis
- **Монорепозиторий** — pnpm workspaces

## Быстрый старт

### Требования

- Node.js 22+
- pnpm 10+
- Docker & Docker Compose

### Установка

```bash
# Установить зависимости
pnpm install
```

### Запустить инфраструктуру

```bash
cd docker
docker-compose up -d
```

Запустятся PostgreSQL и RabbitMQ.

### Собрать и запустить сервисы

```bash
# Собрать common-библиотеку
cd libs/common && pnpm build

# Запустить API Gateway
cd ../../apps/api-gateway && pnpm start:dev

# Запустить Identity Service (в отдельном терминале)
cd ../identity-service && pnpm start:dev

# Запустить VK Service (в отдельном терминале)
cd ../vk-service && pnpm start:dev
```

### Swagger-документация

После запуска API Gateway документация доступна по адресу:

```
http://localhost:3000/api/docs
```

## Структура проекта

```
notification-system/
├── apps/                     # Микросервисы
│   ├── api-gateway/          # Главный шлюз
│   ├── identity-service/     # Сервис идентификации
│   ├── telegram-service/     # Telegram-бот
│   └── vk-service/           # VK-бот
├── libs/                     # Общие библиотеки
│   └── common/               # Типы, enums, утилиты
├── docker/                   # Docker-конфигурация
│   ├── docker-compose.yml
│   └── .env
├── pnpm-workspace.yaml       # Monorepo-настройки
└── README.md
```

## TODO

- [ ] api-gateway
    - [ ] Авторизация
- [x] identity-service
- [ ] telegram-service
- [x] vk-service
- [ ] Dockerfile в каждом сервисе

