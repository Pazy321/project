#!/bin/bash

docker compose up --build -d
EMAIL="admin@service.local"
PASSWORD="$(tr -dc A-Za-z0-9 </dev/urandom | head -c 20)"
docker compose exec backend npm run create-admin "$EMAIL" "$PASSWORD" "admin"
echo "Registered admin user with email: $EMAIL and password: $PASSWORD"
 