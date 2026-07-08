# OpenERP - Development Progress

## Current Status: Phase 1-6 Complete ✅

All API modules are now functional with proper auth, validation, error handling, and pagination.

---

## What Was Done

### Phase 1: Security & Quality Foundation ✅

**1.1 Auth Enforcement**
- Removed `@Public()` from all 5 business controllers (products, sales, purchases, customers, visits)
- All endpoints now require JWT token via `AtGuard`

**1.2 Input Validation DTOs**
- Created DTOs for all modules:
  - `products/dto/product.dto.ts` — CreateProductDto, UpdateProductDto
  - `sales/dto/sale.dto.ts` — CreateSaleDto, UpdateSaleDto
  - `purchases/dto/purchase.dto.ts` — CreatePurchaseDto, UpdatePurchaseDto
  - `customers/dto/customer.dto.ts` — CreateCustomerDto, UpdateCustomerDto
  - `visits/dto/visit.dto.ts` — CreateVisitDto, UpdateVisitDto
- Added `ValidationPipe` with `whitelist: true, forbidNonWhitelisted: true`

**1.3 Error Handling**
- All services now throw `NotFoundException` for missing records
- Sales service throws `BadRequestException` for insufficient stock

---

### Phase 2: Core Business Logic ✅

**2.1 Inventory Decrement on Sale**
- `SalesService.create()` uses Prisma `$transaction`
- Decrements product quantities atomically
- Validates sufficient stock before processing

**2.2 Stock Summary Endpoint**
- `GET /products/stock-summary` returns:
  - totalProducts, totalUnits
  - lowStockCount, outOfStockCount
  - lowStock, outOfStock arrays

**2.3 Pagination/Search/Filter**
All services support query params:
- Products: `?page=1&limit=20&search=cafe&category=Bebidas`
- Sales: `?page=1&limit=20&status=paid&from=2026-06-01&to=2026-06-30`
- Purchases: `?page=1&limit=20&status=pending&supplier=cafe`
- Customers: `?page=1&limit=20&search=maria&segment=vip`
- Visits: `?page=1&limit=20&customerId=xxx&type=scheduled`

---

### Phase 3: Accounting API ✅

**New module:** `apps/erp-api/src/modules/accounting/`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/accounting/accounts` | GET | List accounts (paginated, filterable by type) |
| `/accounting/accounts` | POST | Create account |
| `/accounting/accounts/:id` | GET/PATCH/DELETE | CRUD single account |
| `/accounting/journal` | GET | List journal entries (paginated, filterable by status) |
| `/accounting/journal` | POST | Create journal entry (validates balanced debits/credits) |
| `/accounting/journal/:id` | GET/PATCH/DELETE | CRUD single journal entry |

**DTOs:**
- `dto/account.dto.ts` — CreateAccountDto, UpdateAccountDto
- `dto/journal-entry.dto.ts` — CreateJournalEntryDto, UpdateJournalEntryDto

---

### Phase 4: Payroll API ✅

**New module:** `apps/erp-api/src/modules/payroll/`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/payroll/employees` | GET/POST | List/create employees |
| `/payroll/employees/:id` | GET/PATCH | Get/update employee |
| `/payroll/attendance` | GET/POST | List/create attendance records |
| `/payroll/attendance/:id` | PATCH | Update attendance |
| `/payroll/leave` | GET/POST | List/create leave requests |
| `/payroll/leave/:id` | PATCH | Update leave request |
| `/payroll/records` | GET/POST | List/create payroll records |
| `/payroll/records/:id` | PATCH | Update payroll record |

**DTOs:**
- `dto/employee.dto.ts` — CreateEmployeeDto, UpdateEmployeeDto
- `dto/attendance.dto.ts` — CreateAttendanceDto, UpdateAttendanceDto
- `dto/leave-request.dto.ts` — CreateLeaveRequestDto, UpdateLeaveRequestDto
- `dto/payroll-record.dto.ts` — CreatePayrollRecordDto, UpdatePayrollRecordDto

---

### Phase 5: Manufacturing API ✅

**New module:** `apps/erp-api/src/modules/manufacturing/`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/manufacturing/process-steps` | GET/POST | List/create process steps |
| `/manufacturing/process-steps/:id` | GET/PATCH/DELETE | CRUD process step |
| `/manufacturing/composite-products` | GET/POST | List/create composite products (BOM) |
| `/manufacturing/composite-products/:id` | GET/PATCH/DELETE | CRUD composite product |
| `/manufacturing/orders` | GET/POST | List/create production orders |
| `/manufacturing/orders/:id` | GET/PATCH | Get/update production order |

**DTOs:**
- `dto/process-step.dto.ts` — CreateProcessStepDto, UpdateProcessStepDto
- `dto/composite-product.dto.ts` — CreateCompositeProductDto, UpdateCompositeProductDto
- `dto/production-order.dto.ts` — CreateProductionOrderDto, UpdateProductionOrderDto

---

### Phase 6: Frontend Wiring ✅

**Updated pages to fetch from API:**
- `app/accounting/page.tsx` — Fetches journal entries + accounts from API
- `app/payroll/page.tsx` — Fetches employees, attendance, leave, payroll from API
- `app/manufacturing/page.tsx` — Fetches composite products + production orders from API
- `app/crm/page.tsx` — Fetches customers from API

**New frontend API routes:**
- `app/api/accounting/journal/route.ts`
- `app/api/accounting/accounts/route.ts`
- `app/api/payroll/employees/route.ts`
- `app/api/payroll/attendance/route.ts`
- `app/api/payroll/leave/route.ts`
- `app/api/payroll/records/route.ts`
- `app/api/manufacturing/composite-products/route.ts`
- `app/api/manufacturing/orders/route.ts`

---

## API Endpoints Summary

### Auth (Public)
| Method | Path | Auth |
|--------|------|------|
| POST | `/auth/local/signup` | No |
| POST | `/auth/local/signin` | No |
| POST | `/auth/refresh` | RT Guard |

### Auth (Protected)
| Method | Path | Auth |
|--------|------|------|
| POST | `/auth/logout` | JWT |
| POST | `/auth/api-keys` | JWT |
| GET | `/auth/api-keys` | JWT |
| DELETE | `/auth/api-keys/:id` | JWT |

### Products
| Method | Path | Query Params |
|--------|------|--------------|
| GET | `/products` | page, limit, search, category |
| GET | `/products/stock-summary` | — |
| POST | `/products` | — |
| GET | `/products/:id` | — |
| PATCH | `/products/:id` | — |
| DELETE | `/products/:id` | — |

### Sales
| Method | Path | Query Params |
|--------|------|--------------|
| GET | `/sales` | page, limit, status, from, to |
| POST | `/sales` | — (decrements inventory) |
| GET | `/sales/:id` | — |
| PATCH | `/sales/:id` | — |
| DELETE | `/sales/:id` | — |

### Purchases
| Method | Path | Query Params |
|--------|------|--------------|
| GET | `/purchases` | page, limit, status, supplier |
| POST | `/purchases` | — |
| GET | `/purchases/:id` | — |
| PATCH | `/purchases/:id` | — |
| DELETE | `/purchases/:id` | — |

### Customers
| Method | Path | Query Params |
|--------|------|--------------|
| GET | `/customers` | page, limit, search, segment |
| POST | `/customers` | — |
| GET | `/customers/:id` | — |
| PATCH | `/customers/:id` | — |
| DELETE | `/customers/:id` | — |

### Visits
| Method | Path | Query Params |
|--------|------|--------------|
| GET | `/visits` | page, limit, customerId, type |
| POST | `/visits` | — |
| GET | `/visits/:id` | — |
| PATCH | `/visits/:id` | — |
| DELETE | `/visits/:id` | — |

### Accounting
| Method | Path | Query Params |
|--------|------|--------------|
| GET | `/accounting/accounts` | page, limit, type, search |
| POST | `/accounting/accounts` | — |
| GET | `/accounting/accounts/:id` | — |
| PATCH | `/accounting/accounts/:id` | — |
| DELETE | `/accounting/accounts/:id` | — |
| GET | `/accounting/journal` | page, limit, status, search |
| POST | `/accounting/journal` | — |
| GET | `/accounting/journal/:id` | — |
| PATCH | `/accounting/journal/:id` | — |
| DELETE | `/accounting/journal/:id` | — |

### Payroll
| Method | Path | Query Params |
|--------|------|--------------|
| GET | `/payroll/employees` | page, limit, search, department, status |
| POST | `/payroll/employees` | — |
| GET | `/payroll/employees/:id` | — |
| PATCH | `/payroll/employees/:id` | — |
| GET | `/payroll/attendance` | page, limit, employeeId, status |
| POST | `/payroll/attendance` | — |
| PATCH | `/payroll/attendance/:id` | — |
| GET | `/payroll/leave` | page, limit, employeeId, status |
| POST | `/payroll/leave` | — |
| PATCH | `/payroll/leave/:id` | — |
| GET | `/payroll/records` | page, limit, employeeId, status |
| POST | `/payroll/records` | — |
| PATCH | `/payroll/records/:id` | — |

### Manufacturing
| Method | Path | Query Params |
|--------|------|--------------|
| GET | `/manufacturing/process-steps` | — |
| POST | `/manufacturing/process-steps` | — |
| GET | `/manufacturing/process-steps/:id` | — |
| PATCH | `/manufacturing/process-steps/:id` | — |
| DELETE | `/manufacturing/process-steps/:id` | — |
| GET | `/manufacturing/composite-products` | page, limit, search, category |
| POST | `/manufacturing/composite-products` | — |
| GET | `/manufacturing/composite-products/:id` | — |
| PATCH | `/manufacturing/composite-products/:id` | — |
| DELETE | `/manufacturing/composite-products/:id` | — |
| GET | `/manufacturing/orders` | page, limit, status, compositeProductId |
| POST | `/manufacturing/orders` | — |
| GET | `/manufacturing/orders/:id` | — |
| PATCH | `/manufacturing/orders/:id` | — |

---

## Files Created/Modified

### New Files
```
apps/erp-api/src/modules/accounting/
  accounting.module.ts
  accounting.service.ts
  accounting.controller.ts
  dto/account.dto.ts
  dto/journal-entry.dto.ts

apps/erp-api/src/modules/payroll/
  payroll.module.ts
  payroll.service.ts
  payroll.controller.ts
  dto/employee.dto.ts
  dto/attendance.dto.ts
  dto/leave-request.dto.ts
  dto/payroll-record.dto.ts

apps/erp-api/src/modules/manufacturing/
  manufacturing.module.ts
  manufacturing.service.ts
  manufacturing.controller.ts
  dto/process-step.dto.ts
  dto/composite-product.dto.ts
  dto/production-order.dto.ts

apps/erp-api/src/modules/products/dto/product.dto.ts
apps/erp-api/src/modules/sales/dto/sale.dto.ts
apps/erp-api/src/modules/purchases/dto/purchase.dto.ts
apps/erp-api/src/modules/customers/dto/customer.dto.ts
apps/erp-api/src/modules/visits/dto/visit.dto.ts

apps/erp-frontend/app/api/accounting/journal/route.ts
apps/erp-frontend/app/api/accounting/accounts/route.ts
apps/erp-frontend/app/api/payroll/employees/route.ts
apps/erp-frontend/app/api/payroll/attendance/route.ts
apps/erp-frontend/app/api/payroll/leave/route.ts
apps/erp-frontend/app/api/payroll/records/route.ts
apps/erp-frontend/app/api/manufacturing/composite-products/route.ts
apps/erp-frontend/app/api/manufacturing/orders/route.ts
```

### Modified Files
```
apps/erp-api/src/app.module.ts (added 3 new modules)
apps/erp-api/src/modules/products/products.controller.ts (DTOs, validation, stock-summary)
apps/erp-api/src/modules/products/products.service.ts (pagination, error handling, stock summary)
apps/erp-api/src/modules/sales/sales.controller.ts (DTOs, validation, query params)
apps/erp-api/src/modules/sales/sales.service.ts (inventory decrement, pagination, error handling)
apps/erp-api/src/modules/purchases/purchases.controller.ts (DTOs, validation, query params)
apps/erp-api/src/modules/purchases/purchases.service.ts (pagination, error handling)
apps/erp-api/src/modules/customers/customers.controller.ts (DTOs, validation, query params)
apps/erp-api/src/modules/customers/customers.service.ts (pagination, error handling)
apps/erp-api/src/modules/visits/visits.controller.ts (DTOs, validation, query params)
apps/erp-api/src/modules/visits/visits.service.ts (pagination, error handling)
apps/erp-frontend/app/accounting/page.tsx (wired to API)
apps/erp-frontend/app/payroll/page.tsx (wired to API)
apps/erp-frontend/app/manufacturing/page.tsx (wired to API)
apps/erp-frontend/app/crm/page.tsx (wired to API)
```

---

## What's Left

### Not Done (Future Work)
- [ ] Frontend pagination controls (API supports it, UI doesn't yet)
- [ ] Swagger/OpenAPI documentation
- [ ] Tests (unit + e2e)
- [ ] RBAC (roles + permissions)
- [ ] Reports/exports
- [ ] Seed data for new modules (already exists in seed.ts)
- [ ] Wire remaining sub-pages (payroll/employees, payroll/attendance, etc.)
- [ ] Delete mock data files (lib/data/*.ts)

### How to Run
```bash
# Start PostgreSQL
createdb erp

# Run migrations + seed
npx prisma migrate deploy
npx prisma db seed

# Start API
npm run dev:api

# Start Frontend (separate terminal)
cd apps/erp-frontend && npm run dev
```

### Default Credentials
- Email: `admin@openerp.local`
- Password: `admin`
