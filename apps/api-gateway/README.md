# @addy/api-gateway

Главный шлюз API для сервиса уведомлений ADDY. Принимает HTTP/RPC-запросы, маршрутизирует их через RabbitMQ в соответствующие сервисы отправки и управляет состоянием уведомлений в PostgreSQL.

## Содержание

- [Функциональность](#функциональность)
- [Технологии](#технологии)
- [Быстрый старт](#быстрый-старт)
- [Конфигурация](#конфигурация)
- [API](#api)
- [Структура](#структура)

## Функциональность

- **HTTP-эндпоинты** для отправки уведомлений и проверки статусов
- **RabbitMQ-потребитель** для получения ответов от сервисов отправки
- **CQRS-паттерн** — команды и запросы для управления уведомлениями
- **Swagger-документация** — автоматическая генерация API-документации
- **Health-check** — мониторинг здоровья сервиса

## Технологии

| Компонент | Технология |
|---|---|
| Фреймворк | NestJS 11 + Fastify |
| БД | PostgreSQL (Sequelize) |
| Кеш | Redis (ioredis) |
| Брокер | RabbitMQ (amqp-connection-manager) |
| Документация | Swagger / Scalar |

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

Файл `.env`:

| Переменная | Описание | По умолчанию |
|---|---|---|
| `PORT` | Порт HTTP-сервера | `3000` |
| `SWAGGER_DOCS_TITLE` | Заголовок Swagger-документации | — |
| `RABBITMQ_URL` | URL RabbitMQ | `amqp://localhost:5672` |
| `RABBITMQ_QUEUE_NAME_VK` | Очередь VK | `notifications.vk` |
| `RABBITMQ_QUEUE_NAME_IDENTITY` | Очередь Identity | `notifications.identity` |
| `RABBITMQ_QUEUE_NAME_TELEGRAM` | Очередь Telegram | `notifications.telegram` |
| `DB_HOST` | Хост PostgreSQL | `localhost` |
| `DB_PORT` | Порт PostgreSQL | `5433` |
| `DB_USERNAME` | Логин PostgreSQL | — |
| `DB_PASSWORD` | Пароль PostgreSQL | — |
| `DB_NAME` | Имя базы данных | — |
| `REDIS_HOST` | Хост Redis | — |
| `REDIS_PORT` | Порт Redis | `6379` |

## API

### Уведомления

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/notifications` | Отправить уведомление |
| `GET` | `/notifications/:correlationId` | Получить статус по correlation ID |

### Пользователи

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/users/connect` | Привязать платформу к пользователю |

### Health

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/health` | Проверить здоровье сервиса |

### Swagger

Документация доступна по адресу `http://localhost:3000/api/docs`.

## Структура

```
src/
├── common/              # Общие настройки (CORS, версия, документация)
├── modules/
│   ├── database/        # Подключение к PostgreSQL
│   ├── health/          # Health-check эндпоинт
│   ├── identity/        # Интеракция с identity-сервисом
│   ├── notifications/   # Основной модуль уведомлений (CQRS)
│   │   ├── commands/    # Команды CQRS
│   │   ├── queries/     # Запросы CQRS
│   │   ├── controllers/ # HTTP и RMQ контроллеры
│   │   ├── dtos/        # DTO
│   │   ├── interfaces/  # Интерфейсы сущностей и репозиториев
│   │   ├── mappers/     # Мапперы
│   │   ├── models/      # Sequelize-модели
│   │   ├── providers/   # Провайдеры
│   │   └── services/    # Сервисы уведомлений и результатов
│   ├── redis/           # Подключение к Redis
│   ├── telegram/        # Интеракция с telegram-сервисом
│   ├── users/           # Управление пользователями
│   └── vk/              # Интеракция с VK-сервисом
└── shared/              # Фильтры, интерцепторы, типы
```
