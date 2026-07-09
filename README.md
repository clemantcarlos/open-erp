<div align="center">

# 🏢 OpenERP

**Open-source B2B enterprise management system built for growing businesses.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.4-e0234e?logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-Elastic_2.0-005B96)](LICENSE)

</div>

---

## Overview

OpenERP is a full-stack ERP system designed for small and medium-sized businesses. It covers the core operational needs — from inventory and point-of-sale to accounting, HR, and manufacturing — in a single, self-hosted platform.

### Modules

| Module | Description | Status |
|:------:|-------------|:------:|
| **POS** | Point-of-sale checkout with real-time stock sync | ✅ |
| **Inventory** | Product catalog, stock tracking, search & filters | ✅ |
| **Sales** | Sales orders with automatic inventory decrement | ✅ |
| **Purchases** | Purchase orders from suppliers | ✅ |
| **CRM** | Customer management + scheduled visit tracking | ✅ |
| **Accounting** | Chart of accounts, journal entries with balanced debits/credits | ✅ |
| **Payroll / HR** | Employees, attendance, leave requests, payroll records | ✅ |
| **Manufacturing** | Bills of materials (BOM), process steps, production orders | ✅ |
| **BI Dashboard** | Business intelligence & analytics | 🔜 |
| **Field App** | Mobile offline-first companion app | 🔜 |

---

## Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · shadcn/ui |
| **Backend** | NestJS 10 · Prisma 6 · PostgreSQL 16 |
| **Auth** | JWT (access + refresh tokens) · Passport.js |
| **Infra** | Docker Compose · Multi-stage builds |
| **Language** | TypeScript 5.8 (end-to-end) |

</div>

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [Docker](https://www.docker.com/) (optional, but recommended)
- [npm](https://www.npmjs.com/) (comes with Node)

### Option A — Docker (recommended)

```bash
git clone https://github.com/your-username/open-erp.git
cd open-erp
docker compose up --build
```

Services:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3001 | Next.js app |
| **API** | http://localhost:3000 | NestJS backend |
| **API Docs** | http://localhost:3000/api | Swagger documentation |
| **PostgreSQL** | localhost:5432 | Database |

### Option B — Local Development

```bash
git clone https://github.com/your-username/open-erp.git
cd open-erp

# Install dependencies
npm install

# Start database
docker compose up -d postgres

# Run migrations & seed
npx prisma migrate dev --schema=apps/erp-api/prisma/schema.prisma
npm run seed

# Start dev servers (API + Frontend)
npm run dev
```

### Default Credentials

| Email | Password |
|-------|----------|
| `admin@example.com` | `admin123` |

> ⚠️ Change these before deploying to production.

---

## Project Structure

```
open-erp/
├── apps/
│   ├── erp-api/              # NestJS REST API
│   │   ├── src/modules/      # 11 domain modules
│   │   └── prisma/           # Schema & migrations
│   ├── erp-frontend/         # Next.js frontend
│   │   └── app/              # App Router pages
│   ├── bi-dashboard/         # Analytics dashboard (planned)
│   └── field-app/            # Mobile app (planned)
├── libs/
│   ├── database/             # Shared DB utilities (planned)
│   └── shared/               # Shared types & utils (planned)
├── use-case-spec/            # Detailed use-case specifications
└── docker-compose.yml
```

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   Frontend  │────▶│     API     │────▶│  PostgreSQL  │
│  Next.js 16 │     │  NestJS 10  │     │     16       │
└─────────────┘     └─────────────┘     └──────────────┘
     :3001              :3000              :5432
```

- **REST API** with 75+ endpoints across 11 modules
- **JWT authentication** with access & refresh token flow
- **Prisma ORM** with 17 models (UUID primary keys)
- **Swagger/OpenAPI** docs auto-generated at `/api`
- **Rate limiting** via `@nestjs/throttler`
- **Input validation** with `class-validator` & `class-transformer`

---

## API Overview

| Module | Endpoints | Auth |
|--------|-----------|:----:|
| Auth | `POST /auth/signin`, `POST /auth/signup`, `POST /auth/refresh` | Public |
| Products | CRUD + `GET /products/stock-summary` | 🔒 |
| Sales | CRUD + auto inventory decrement | 🔒 |
| Purchases | CRUD | 🔒 |
| Customers | CRUD + search | 🔒 |
| Visits | CRUD (linked to customers) | 🔒 |
| Accounts | CRUD + balance calculation | 🔒 |
| Journal Entries | CRUD with balanced D/C validation | 🔒 |
| Employees | CRUD | 🔒 |
| Attendance | CRUD + summary | 🔒 |
| Leave Requests | CRUD + status updates | 🔒 |
| Payroll | CRUD + calculation | 🔒 |
| Manufacturing | BOM + process steps + production orders | 🔒 |

---

## Database Schema

17 models powered by Prisma:

<details>
<summary><strong>View all models</strong></summary>

- **User** — Authentication & session management
- **ApiKey** — API key authentication
- **Product** — Product catalog with stock tracking
- **Sale** — Sales orders with line items
- **Purchase** — Purchase orders from suppliers
- **Customer** — CRM customer records
- **Visit** — Scheduled customer visits
- **ProcessStep** — Manufacturing process definitions
- **CompositeProduct** — Bills of materials (BOM)
- **ProductionOrder** — Manufacturing work orders
- **Account** — Chart of accounts
- **JournalEntry** — Double-entry accounting entries
- **Employee** — HR employee records
- **AttendanceRecord** — Daily attendance tracking
- **LeaveRequest** — Time-off requests
- **PayrollRecord** — Payroll processing records

</details>

---

## Environment Variables

### API (`apps/erp-api`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/erp` |
| `JWT_AT_SECRET` | Access token secret | — |
| `JWT_RT_SECRET` | Refresh token secret | — |
| `SESSION_SECRET` | Session encryption key | `change-me-in-production` |
| `PORT` | Server port | `3000` |

### Frontend (`apps/erp-frontend`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEST_API_URL` | Backend URL (server-side) | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Backend URL (client-side) | `http://localhost:3000` |

---

## Scripts

```bash
npm run dev          # Start API + Frontend in dev mode
npm run build        # Build both apps for production
npm run start        # Start both apps in production mode
npm run seed         # Seed database with initial data
```

---

## Use-Case Specifications

The `use-case-spec/` directory contains detailed specifications for each module:

| Spec | Use Cases |
|------|-----------|
| [Accounting](use-case-spec/accounting.md) | 6 use cases — accounts & journal entries |
| [Customers](use-case-spec/customers.md) | 5 use cases — customer CRUD |
| [Inventory](use-case-spec/inventory.md) | 6 use cases — products & stock |
| [Manufacturing](use-case-spec/manufacturing.md) | 10 use cases — BOM & production |
| [Payroll](use-case-spec/payroll.md) | 11 use cases — employees, attendance, leave |
| [Purchases](use-case-spec/purchases.md) | 5 use cases — purchase orders |
| [Sales](use-case-spec/sales.md) | 5 use cases — POS & sales |
| [Visits](use-case-spec/visits.md) | 5 use cases — visit scheduling |

---

## Roadmap

- [ ] Frontend pagination & search controls
- [ ] Swagger/OpenAPI full documentation
- [ ] Unit & E2E test coverage
- [ ] Role-based access control (RBAC)
- [ ] Reports & data exports
- [ ] BI Dashboard with charts
- [ ] Field App (React Native / Expo)

---

## License

Licensed under the [Elastic License 2.0](LICENSE).

- ✅ Use, modify, and distribute
- ✅ Self-host and run in production
- ❌ Cannot offer as a hosted/managed SaaS service
- ❌ Cannot remove license key functionality

For commercial licensing inquiries, contact the maintainer.

---

<div align="center">

**Built with passion for small business operations.**

</div>
