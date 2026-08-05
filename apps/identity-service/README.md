# Identity Service

## Todos

- [ ] При коннекте клиента, проверять только те записи, где pending | verified
- [ ] Добавить `task queue`
    - [ ] Проверять записи со статусом `pending` и временем создания до 10 минут и помечать их как `failed` `expired`