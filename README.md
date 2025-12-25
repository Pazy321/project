# Установка
```bash 
cp .env.example .env
docker compose --env-file .env up
```

# Дополнительные скрипты

## Создание пользователей администраторов
```bash
docker compose exec backend npm run create-admin "$EMAIL" "$PASSWORD" "$USERNAME"
```

## Создание тестовых заявок
```bash
docker compose exec backend npm run generate-test-bookings
```
