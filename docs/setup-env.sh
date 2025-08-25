#!bin/bash

docker run --name todo-postgres -v postgres-data:/var/lib/postgresql/ -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:17.6-alpine3.22


npm install && npm run dev