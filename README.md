# NestJS

Production-ready REST API boilerplate built with NestJS 11, Prisma, PostgreSQL, and Swagger.  
It includes health checks, category/product modules with pagination & filtering, and Docker support.

## Features

- Global configuration management with `.env` validation
- Prisma ORM with PostgreSQL schema, seed data, and typed services
- Categories & Products APIs with pagination, filtering, sorting, and validation
- Global logging interceptor, validation pipe, and HTTP exception filter
- Swagger docs available at `/api/docs`
- Dockerfile for local development/build/production stages

## Getting Started

```bash
npm install
cp .env.example .env
```

Update `DATABASE_URL` in `.env` and run Prisma migrations:

```bash
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed
```

## Running the App

```bash
# development
npm run start:dev

# production build
npm run build
npm run start:prod
```

## Testing

```bash
npm run test        # unit
npm run test:e2e    # e2e
npm run test:cov    # coverage
```

## Docker

```bash
docker build -t nestjs-boilerplate .
docker run -p 3000:3000 --env-file .env nestjs-boilerplate
```

## API Overview

- `GET /health` – service status
- `GET /health/db` – database connectivity
- `CRUD /categories` – paginated category management
- `CRUD /products` – advanced filtering, sorting, pagination
- Swagger docs: `http://localhost:3000/api/docs`

## Tech Stack

- NestJS 11
- Prisma ORM
- PostgreSQL
- Swagger / OpenAPI
- class-validator & class-transformer

## Project Structure

```
src/
 ├── common/        # filters, interceptors, pipes, decorators
 ├── config/        # configuration module, env schema
 ├── prisma/        # Prisma module & service
 ├── health/        # health check endpoints
 ├── categories/    # category module (dto, service, controller)
 └── products/      # product module (dto, service, controller)
```
