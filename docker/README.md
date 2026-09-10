# Docker

Контейнерная инфраструктура сервиса уведомлений ADDY. Содержит два compose-файла и переменные окружения для запуска приложений и внешних зависимостей (базы данных, брокер, кэш, стек мониторинга).

## Состав

| Файл | Назначение |
|---|---|
| `docker-compose.yml` | **Production**: Node-сервисы (gateway, identity, telegram, vk) + зависимости + стек мониторинга |
| `docker-compose.development.yml` | **Development**: только зависимости + стек мониторинга (без Node-сервисов) |
| `.env` / `.env.example` | Переменные окружения compose |

> Node-сервисы в production строятся из `apps/*/Dockerfile` и берут своё окружение из отдельных файлов `apps/*/.env` (не из `docker/.env`).

## Сервисы

### Production (`docker-compose.yml`)

| Сервис | Изображение | Сеть |
|---|---|---|
| **gateway** (api-gateway) | build: `apps/api-gateway/Dockerfile` | public, private |
| **identity-service** | build: `apps/identity-service/Dockerfile` | private |
| **telegram-service** | build: `apps/telegram-service/Dockerfile` | public, private |
| **vk-service** | build: `apps/vk-service/Dockerfile` | public, private |
| **PostgreSQL** | `postgres:18-alpine` | private |
| **RabbitMQ** | `rabbitmq:4.3.2-management` | private |
| **Redis** | `redis:8.8` | private |
| **Grafana** | `grafana/grafana-oss:10.2.2` | public, private, monitoring |
| **Prometheus** | `prom/prometheus:v2.48.0` | private, monitoring |
| **Pushgateway** | `prom/pushgateway:v1.6.2` | private, monitoring |
| **Loki** | `grafana/loki:3.6` | private, monitoring |
| **Promtail** | `grafana/promtail:3.6.0` | private, monitoring |
| **sub2socks** | `sub2socks:latest` | public, private |

### Development (`docker-compose.development.yml`)

Только «OTHER CONTAINERS» — PostgreSQL, RabbitMQ, Redis, Grafana, Prometheus, Pushgateway, Loki, Promtail, sub2socks. Node-сервисов нет.

## Быстрый старт

```bash
# 1. Подготовить окружение (пороговые значения — в .env.example)
cp .env.example .env
# затем заполнить реальные значения (пароли, SUB2SOCKS_*)

# 2. Production (все сервисы)
docker compose -f docker-compose.yml up -d

# 3. Development (только зависимости + мониторинг)
docker compose -f docker-compose.development.yml up -d

# 4. Статус
docker compose -f docker-compose.yml ps
```

> В production Node-сервисы стартуют только после того, как postgres / rabbitmq / redis станут `healthy` (см. `depends_on.condition: service_healthy`).

## Конфигурация

Все переменные берутся из `.env` в этой директории (compose подхватывает его автоматически).

| Переменная | Описание | По умолчанию |
|---|---|---|
| `API_GATEWAY_PORT` | Порт API Gateway на хосте | `3000` |
| `RABBITMQ_USER` | Логин RabbitMQ | — |
| `RABBITMQ_PASSWORD` | Пароль RabbitMQ | — |
| `POSTGRES_USERNAME` | Логин PostgreSQL | — |
| `POSTGRES_PASSWORD` | Пароль PostgreSQL | — |
| `POSTGRES_DB_NAME` | Имя базы данных | — |
| `REDIS_PASSWORD` | Пароль Redis (**обязателен**, пустой сломает healthcheck) | — |
| `GRAFANA_PORT` | Порт Grafana на хосте | `3010` |
| `PROMETHEUS_PORT` | Порт Prometheus на хосте | `9090` |
| `LOKI_PORT` | Порт Loki на хосте (production) | `3100` |
| `SUB2SOCKS_PORT` | Порт sub2socks (development) | `1080` |
| `SUB2SOCKS_SUB_URL` | URL подписки sub2socks | — |
| `SUB2SOCKS_DNS_SERVER` | DNS-сервер для sub2socks | — |

> **Пример** с рекомендуемыми значениями — в `.env.example`.

## Файлы конфигурации (`../config/`)

| Путь | Назначение | Что можно/нужно добавить |
|---|---|---|
| `config/prometheus/prometheus.yaml` | Конфиг Prometheus: `global`, `scrape_configs`, `alerting` | **Node-сервисы не экспортируют `/metrics`** — их jobs закомментированы. После добавления `prom-client`/terminus раскомментировать. `alertmanagers.targets` пуст (Alertmanager в стеке нет). |
| `config/prometheus/web-config.yaml` | Web-конфиг Prometheus **и** Pushgateway (TLS, Basic Auth, CORS) | Сейчас пустой (документация) — сервисы слушают только `127.0.0.1`, TLS/Auth не нужны. Заполнить при выносе наружу. |
| `config/loki/config.yaml` | Конфиг Loki (TSDB-индекс, filesystem-хранилище) | `retention_period: 168h` (7 дней) + `retention_delete_period: 24h` — уберите/смените, чтобы менять период хранения. `ruler.alertmanager_url` указывает на `localhost:9093` (Alertmanager не развёрнут) — секцию `ruler` можно удалить, если алерты не нужны. |
| `config/promtail/config.yml` | Конфиг Promtail: сбор `/var/log` и логов контейнеров | `positions` лежит в volume (`/var/promtail/positions.yaml`). Новые источники — через `scrape_configs`. |
| `config/grafana/provisioning/datasources/datasource.yml` | Автопроvisioning datasource'ов Grafana | Подключены **Loki** (`http://loki:3100`) и **Prometheus** (`http://prometheus:9090`, default). Дашборды — в `config/grafana/provisioning/dashboards/`. |

### Что добавить в Grafana

Datasource'ов достаточно, но **дашбордов нет**. Чтобы увидеть метрики и логи, нужно:

1. Раздать провижининг дашбордов: создать `config/grafana/provisioning/dashboards/` с `dashboards.yml` (folder + path) и самими JSON-дашбордами (например, [Grafana Loki](https://grafana.com/grafana/dashboards/12821) и [Node Exporter / Loki](https://grafana.com/grafana/dashboards)).
2. Промонтировать их в контейнер Grafana (добавить volume в `docker-compose*.yml`).

## Порты

### Production

| Хост | Контейнер | Сервис |
|---|---|---|
| `127.0.0.1:${API_GATEWAY_PORT}` (3000) | `3000` | API Gateway |
| `127.0.0.1:${GRAFANA_PORT}` (3010) | `3000` | Grafana |
| `127.0.0.1:${PROMETHEUS_PORT}` (9090) | `9090` | Prometheus |
| `127.0.0.1:${LOKI_PORT}` (3100) | `3100` | Loki |
| `9091` | `9091` | Pushgateway ⚠️ наружу (без `127.0.0.1`) |

> **Pushgateway слушает на `0.0.0.0:9091`** — при необходимости ограничьте на `127.0.0.1:9091`.

### Development

| Хост | Контейнер | Сервис |
|---|---|---|
| `5433` | `5432` | PostgreSQL |
| `5672` | `5672` | RabbitMQ AMQP |
| `15672` | `15672` | RabbitMQ Management UI |
| `6379` | `6379` | Redis |
| `127.0.0.1:${GRAFANA_PORT}` (3010) | `3000` | Grafana |
| `127.0.0.1:${PROMETHEUS_PORT}` (9090) | `9090` | Prometheus |
| `9091` | `9091` | Pushgateway |
| `127.0.0.1:${SUB2SOCKS_PORT}` (1080) | `1080` | sub2socks |

> Loki в development **не пробрасывается** на хост (доступен только внутри сети). Раскомментируйте блок `ports` в `docker-compose.development.yml`, если нужен прямой доступ.

## Volumes

| Volume | Назначение |
|---|---|
| `postgres_data` | Данные PostgreSQL |
| `rabbitmq_data` | Данные RabbitMQ |
| `redis_data` | Данные Redis |
| `grafana_data` | Хранилище Grafana |
| `prometheus_data` | TSDB Prometheus |
| `loki_data` | Индексы и чанки Loki (`/loki`) |
| `promtail_data` | Positions Promtail (`/var/promtail`) |

## Networks

| Сеть | Флаг | Назначение |
|---|---|---|
| `private` | `internal: true` | Только внутренние сервисы (без выхода в интернет) |
| `public` | — | Сервисы с внешним доступом (gateway, telegram, vk, sub2socks, grafana) |
| `monitoring` | — | Стек мониторинга (prometheus, loki, promtail, grafana, pushgateway) |

## Полезные команды

```bash
# Поднять / остановить
docker compose -f docker-compose.yml up -d
docker compose -f docker-compose.yml down
docker compose -f docker-compose.yml down -v   # и удалить volumes

# Логи
docker compose -f docker-compose.yml logs -f
docker compose -f docker-compose.yml logs -f loki promtail

# Пересоздать упавшие
docker compose -f docker-compose.yml up -d --force-recreate

# Проверить здоровье
docker inspect --format='{{.State.Health.Status}}' ns-postgres
docker inspect --format='{{.State.Health.Status}}' ns-rabbitmq
docker inspect --format='{{.State.Health.Status}}' ns-redis
```

## Healthcheck

Настраивается на postgres / rabbitmq / redis / gateway (production):

- **PostgreSQL** — `pg_isready`, 10s / 5s / 5 попыток
- **RabbitMQ** — `rabbitmq-diagnostics -q ping`, 10s / 5s / 5
- **Redis** — `redis-cli -a <password> ping`, 10s / 5s / 5
- **Gateway** — `wget --spider http://0.0.0.0:3000/api/health`, 30s / 3s / 3

## Замечания по мониторингу

- **Loki** развёрнут как **одна реплика**: общий volume `loki_data` + ring `inmemory` несовместимы с горизонтальным масштабированием (TSDB shipper берёт эксклюзивную блокировку index-каталога). Для кластера — statefulset-развёртывание с object store и ring на KV-стор.
- **Promtail** в обоих compose'ах с `deploy.mode: global` (Swarm-синтаксис). При запуске через обычный `docker compose up -d` секция `deploy` игнорируется — Promtail поднимется одним контейнером, лимиты памяти не применятся. Если не используете Swarm — секцию `deploy` можно удалить.
- **Grafana** настроена на sub-path `/grafana/` (`GF_SERVER_ROOT_URL`, `GF_SERVER_SERVE_FROM_SUB_PATH=true`). Без reverse-proxy она доступна только по `localhost:<port>/grafana/`. Если прокси нет — уберите обе переменные.
