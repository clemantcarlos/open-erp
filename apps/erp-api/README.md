# OpenERP API

NestJS backend for the OpenERP system.

## Development

```bash
npm install
npx prisma migrate dev
npm run seed
npm run start:dev
```

API runs at http://localhost:3000. Swagger docs at http://localhost:3000/api.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://carlos:erp_dev_password@localhost:5432/erp |
| JWT_AT_SECRET | Access token secret | (required) |
| JWT_RT_SECRET | Refresh token secret | (required) |
| SESSION_SECRET | Session encryption key | open-erp-session-secret |
| PORT | Server port | 3000 |

## Testing

```bash
npm run test:e2e
```

## Docker

```bash
docker compose up --build
```
