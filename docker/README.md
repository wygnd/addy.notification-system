# Docker

Контейнерная инфраструктура для сервиса уведомлений ADDY. Содержит `docker-compose.yml` и файлы окружения для запуска внешних зависимостей (базы данных, брокеры сообщений).

## Содержание

- [Сервисы](#сервисы)
- [Быстрый старт](#быстрый-старт)
- [Конфигурация](#конфигурация)
- [Порты](#порты)
- [Volumes](#volumes)
- [Полезные команды](#полезные-команды)

## Сервисы

| Сервис | Изображение | Статус |
|---|---|---|
| **PostgreSQL** | `postgres:latest` | ✅ Активен |
| **RabbitMQ** | `rabbitmq:4.3.2-management` | ✅ Активен |
| ~~API Gateway~~ | Custom Dockerfile | ❌ Закомментирован |
| ~~Redis~~ | `redis:latest` | ❌ Закомментирован |

## Быстрый старт

1. Скопируйте пример окружения и заполните переменные:

```bash
cp .env.example .env
```

2. Поднимите сервисы:

```bash
docker-compose up -d
```

3. Проверьте статус:

```bash
docker-compose ps
```

## Конфигурация

Файл `.env` в этой директории содержит переменные окружения:

| Переменная | Описание | По умолчанию |
|---|---|---|
| `API_GATEWAY_PORT` | Порт API Gateway | `3000` |
| `RABBITMQ_USER` | Логин RabbitMQ | — |
| `RABBITMQ_PASSWORD` | Пароль RabbitMQ | — |
| `POSTGRES_USERNAME` | Логин PostgreSQL | — |
| `POSTGRES_PASSWORD` | Пароль PostgreSQL | — |
| `POSTGRES_DB_NAME` | Имя базы данных | — |
| `REDIS_PASSWORD` | Пароль Redis | — |

> **Пример** см. в `.env.example`.

## Порты

| Хост | Контейнер | Сервис |
|---|---|---|
| `5433` | `5432` | PostgreSQL |
| `127.0.0.1:15672` | `15672` | RabbitMQ Management UI |
| `127.0.0.1:5672` | `5672` | RabbitMQ AMQP |

## Volumes

| Volume | Назначение |
|---|---|
| `postgres_data` | Данные PostgreSQL (`/var/lib/postgresql`) |
| `rabbitmq_data` | Данные RabbitMQ (`/var/lib/rabbitmq`) |

## Полезные команды

```bash
# Поднять все сервисы
docker-compose up -d

# Остановить все сервисы
docker-compose down

# Остановить и удалить volumes
docker-compose down -v

# Посмотреть логи
docker-compose logs -f

# Пересоздать упавшие контейнеры
docker-compose up -d --force-recreate

# Проверить здоровье сервисов
docker inspect --format='{{.State.Health.Status}}' notification-system-postgres
docker inspect --format='{{.State.Health.Status}}' notification-system_rabbitmq
```

## Healthcheck

Оба активных сервиса оснащены healthcheck:

- **PostgreSQL** — `pg_isready`, интервал 10s, таймаут 5s, 5 попыток
- **RabbitMQ** — `rabbitmq-diagnostics -q ping`, интервал 10s, таймаут 5s, 5 попыток
