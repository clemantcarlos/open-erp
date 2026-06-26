# OpenERP MVP Plan

## Current State

- **Backend**: Auth shell (login/signup/refresh + API keys). 7 endpoints, 2 Prisma models (User, ApiKey).
- **Frontend**: Full UI for 8 modules (POS, Inventory, Sales, Purchases, Manufacturing, Accounting, Payroll, CRM). All mock data, no backend integration.
- **Gap**: Everything below the auth layer.

## MVP Status: ✅ COMPLETED

## MVP Scope

Core revenue loop: **Products → Sales → Purchases → CRM**. Manufacturing, Accounting, and Payroll stay mock — complex, standalone, don't block revenue operations.

| Module | MVP? | Why |
|--------|------|-----|
| Products / Inventory | ✅ | Foundation for POS, Sales, Purchases |
| Sales | ✅ | Core transaction |
| Purchases | ✅ | Supplier management |
| Customers (CRM) | ✅ | Customer tracking |
| Visits (CRM) | ✅ | Complements customers |
| Manufacturing | ❌ | Complex BOM/routing, no revenue impact |
| Accounting | ❌ | Double-entry is its own beast |
| Payroll / HR | ❌ | Not customer-facing, mock works for demo |

## Phase 1: Product Model

Unlocks: POS, Inventory, Sales, Purchases

**Prisma:**
```prisma
model Product {
  id        String   @id @default(cuid())
  sku       String   @unique
  name      String
  category  String
  price     Decimal  @db.Decimal(10, 2)
  quantity  Int      @default(0)
  unit      String   @default("pieza")
  minStock  Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Backend:** `products.controller.ts` — `GET /products`, `POST /products`

**Frontend:** Replace mock arrays in `pos/page.tsx` and `inventory/page.tsx` with `fetch("/api/products")`. Keep client-side search/filter/sort.

## Phase 2: Sale Model

Unlocks: Sales module, POS checkout

**Prisma:**
```prisma
model Sale {
  id            String   @id @default(cuid())
  date          DateTime @default(now())
  customer      String?
  items         Json     // [{ productId, name, quantity, price }]
  subtotal      Decimal  @db.Decimal(10, 2)
  tax           Decimal  @db.Decimal(10, 2)
  total         Decimal  @db.Decimal(10, 2)
  status        String   @default("paid") // paid | pending | cancelled
  paymentMethod String   @default("cash") // cash | card | movil
  createdAt     DateTime @default(now())
}
```

**Backend:** `sales.controller.ts` — `GET /sales`, `POST /sales`

**Frontend:** Wire `sales/page.tsx` to API. POS checkout calls `POST /sales`.

## Phase 3: Purchase Model

Unlocks: Purchases module

**Prisma:**
```prisma
model Purchase {
  id           String   @id @default(cuid())
  date         DateTime @default(now())
  supplier     String
  items        Json     // [{ productId, name, quantity, unitCost }]
  subtotal     Decimal  @db.Decimal(10, 2)
  tax          Decimal  @db.Decimal(10, 2)
  total        Decimal  @db.Decimal(10, 2)
  status       String   @default("pending") // received | pending | cancelled
  expectedDate DateTime?
  createdAt    DateTime @default(now())
}
```

**Backend:** `purchases.controller.ts` — `GET /purchases`, `POST /purchases`

**Frontend:** Wire `purchases/page.tsx` to API.

## Phase 4: Customer Model

Unlocks: CRM module

**Prisma:**
```prisma
model Customer {
  id         String   @id @default(cuid())
  name       String
  email      String?
  phone      String?
  segment    String   @default("regular") // vip | regular | new | inactive
  address    String?
  birthDate  DateTime?
  notes      String?
  createdAt  DateTime @default(now())
  visits     Visit[]
}
```

**Backend:** `customers.controller.ts` — `GET /customers`, `POST /customers`

**Frontend:** Wire `crm/customers/page.tsx` and `crm/page.tsx` dashboard stats.

## Phase 5: Visit Model

Completes: CRM module

**Prisma:**
```prisma
model Visit {
  id            String   @id @default(cuid())
  customerId    String
  customer      Customer @relation(fields: [customerId], references: [id])
  date          DateTime
  time          String
  type          String   @default("scheduled") // scheduled | unscheduled | follow_up | proposal | support
  effectiveness String   @default("pending")   // effective | partially_effective | ineffective | pending
  purpose       String?
  notes         String?
  duration      Int?     // minutes
  nextVisit     DateTime?
  createdAt     DateTime @default(now())
}
```

**Backend:** `visits.controller.ts` — `GET /visits`, `POST /visits`

**Frontend:** Wire `crm/visits/` pages and visit creation form.

## Execution Order

```
1. Prisma schema + db push (all 5 models at once) ✅
2. Seed script with realistic data ✅
3. Products API → wire POS + Inventory ✅
4. Sales API → wire Sales + POS checkout ✅
5. Purchases API → wire Purchases ✅
6. Customers API → wire CRM ✅
7. Visits API → wire CRM visits + form ✅
```

Each step is independently deployable. Stop after any phase and you have a working increment.

## Not in MVP (Future)

- [ ] Manufacturing — BOM, routing, production orders
- [ ] Accounting — chart of accounts, journal entries, double-entry
- [ ] Payroll — employees, attendance, leave, payroll records
- [ ] User management — roles, permissions, self-registration
- [ ] Reports / exports
- [ ] Multi-tenant / multi-company
