# OpenERP Frontend

Next.js 16 frontend for the OpenERP system.

## Development

```bash
npm install
npm run dev
```

App runs at http://localhost:3001.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEST_API_URL | Backend API URL (server-side) | http://localhost:3000 |
| NEXT_PUBLIC_API_URL | Backend API URL (client-side) | http://localhost:3000 |

## Docker

```bash
docker compose up --build
```
