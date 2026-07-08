# Docker Setup

## Quick Start

```bash
docker compose up --build
```

This starts:
- **PostgreSQL** on `localhost:5432`
- **API** on `localhost:3000`
- **Frontend** on `localhost:3001`

## Services

| Service | Port | Description |
|---------|------|-------------|
| `postgres` | 5432 | PostgreSQL 16 |
| `api` | 3000 | NestJS backend |
| `frontend` | 3001 | Next.js frontend |

## Environment Variables

### API (`apps/erp-api/.env`)

```
DATABASE_URL="postgresql://carlos@localhost:5432/erp"
JWT_AT_SECRET="your-access-token-secret"
JWT_RT_SECRET="your-refresh-token-secret"
PORT=3000
```

### Frontend (set in docker-compose.yml)

```
NEST_API_URL="http://api:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## Development (without Docker)

```bash
# Terminal 1: API
npm run dev:api

# Terminal 2: Frontend
cd apps/erp-frontend && npm run dev
```

Requires PostgreSQL running locally on port 5432.

## Database

### Create database (local only)
```bash
createdb erp
```

### Run migrations
```bash
npx prisma migrate deploy
```

### Seed data
```bash
npx prisma db seed
```

### Default user
- Email: `admin@openerp.local`
- Password: `admin`

## Useful Commands

```bash
# Start in background
docker compose up -d

# Rebuild containers
docker compose up --build

# Stop all containers
docker compose down

# Stop and remove volumes (fresh start)
docker compose down -v

# View logs
docker compose logs -f api
docker compose logs -f frontend

# Access PostgreSQL
docker compose exec postgres psql -U carlos -d erp
```

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│     API     │────▶│  PostgreSQL  │
│  Next.js    │     │   NestJS    │     │     DB       │
│  :3001      │     │   :3000     │     │   :5432      │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Files

| File | Description |
|------|-------------|
| `docker-compose.yml` | Service definitions |
| `apps/erp-api/Dockerfile` | API multi-stage build |
| `apps/erp-frontend/Dockerfile` | Frontend multi-stage build |
| `.dockerignore` | Build context exclusions |
| `apps/erp-api/.env.example` | API env template |
