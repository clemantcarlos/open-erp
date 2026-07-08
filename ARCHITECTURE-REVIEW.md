# Phase 3: Architecture Review

## Critical (fix now)

### Backend
| # | File:Line | Issue | Fix |
|---|-----------|-------|-----|
| B1 | `main.ts:8` | `app.enableCors()` with no config — any origin can call the API | `app.enableCors({ origin: process.env.ALLOWED_ORIGINS?.split(',') })` |
| B2 | `auth/common/types/payload.ts:2` | `JwtPayload.sub` typed as `number` — Prisma IDs are strings | Change to `sub: string` |
| B3 | `at.guard.ts:42` | Failed API key returns `false` → 403 instead of 401 | Throw `UnauthorizedException('Invalid API key')` |
| B4 | `tsconfig.json:15-17` | `strictNullChecks: false`, `noImplicitAny: false` — hides real bugs | Enable both, fix ~12 files that break |

### Frontend
| # | File:Line | Issue | Fix |
|---|-----------|-------|-----|
| F1 | `proxy.ts` | **Middleware never loaded** — wrong filename, auth not enforced | Rename to `middleware.ts` |
| F2 | `lib/session.ts:4` | Hardcoded JWT secret fallback `"open-erp-session-secret"` | Remove fallback, crash if env missing |
| F3 | `(auth)/login/page.tsx:34-35` | Tokens in localStorage (XSS-vulnerable) + httpOnly cookies (parallel systems) | Pick one: httpOnly cookies only |
| F4 | `pos/page.tsx:121-131` | Checkout ignores response status — clears cart regardless | Check `res.ok` before clearing |

---

## Important (fix this week)

### Backend
| # | File:Line | Issue | Fix |
|---|-----------|-------|-----|
| B5 | `sales/dto/sale.dto.ts:10` | `items: any[]` with no inner DTO — unvalidated line items | Create `SaleItemDto` |
| B6 | `purchases/dto/purchase.dto.ts:10` | `items: any[]` — same problem | Create `PurchaseItemDto` |
| B7 | `accounting/dto/journal-entry.dto.ts:17` | `lines: any[]` — unvalidated accounting lines | Create `JournalEntryLineDto` |
| B8 | `products.service.ts:41-47` | `getStockSummary()` loads ALL products into memory | Use Prisma aggregate |
| B9 | `prisma.service.ts` | No `onModuleDestroy` / `$disconnect()` | Add `OnModuleDestroy` |
| B10 | `payroll.service.ts`, `manufacturing.service.ts` | `data: any` in service methods — DTOs exist but ignored | Type with DTOs |
| B11 | All update methods | `Record<string, any>` in every `update*()` — bypasses validation | Use `PartialType(CreateXxxDto)` |
| B12 | All `findAll` endpoints | No `totalCount` returned — frontend can't paginate | Return `{ data, meta: { total, totalPages } }` |
| B13 | No global exception filter | Raw NestJS error format inconsistent | Add `AllExceptionsFilter` |

### Frontend
| # | File:Line | Issue | Fix |
|---|-----------|-------|-----|
| F5 | 14 API route files | Copy-paste — identical except resource name | Extract `createProxyRoute(resource)` factory |
| F6 | Every page | Zero `error.tsx` files — unhandled errors crash pages | Add `app/error.tsx` |
| F7 | Every page | Zero `loading.tsx` files — manual loading state in every page | Add `loading.tsx` per route |
| F8 | `lib/types.ts` | `any` types everywhere in fetch handlers | Define shared interfaces |
| F9 | `sales/[id]/page.tsx:196` | Items rendered as raw `JSON.stringify` | Render as table |
| F10 | 20 pages | No shared `<PageHeader>` component — same header block repeated | Extract `<PageHeader>` |
| F11 | `lib/data/*.ts` | Mixed mock + API data sources — pages show different data | Consolidate to API only |

---

## Nice-to-have (next sprint)

| # | Area | Issue | Fix |
|---|------|-------|-----|
| 1 | Backend | Dead code: `GetCurrentUserId` decorator, `utils/functions.ts`, `utils/imageHandlers.ts` | Delete |
| 2 | Backend | No rate limiting on auth endpoints | `@nestjs/throttler` |
| 3 | Backend | No `helmet` middleware | `app.use(helmet())` |
| 4 | Frontend | No React Query / SWR — raw fetch in every useEffect | Install SWR |
| 5 | Frontend | No shared `<DataTable>` component — tables rebuilt every page | Extract component |
| 6 | Frontend | No shared `<FilterBar>` component | Extract component |
| 7 | Frontend | No optimistic updates — every save waits round-trip | Add for list pages |
| 8 | Frontend | Hardcoded `$` currency — no locale formatting | Use `Intl.NumberFormat` |
| 9 | Frontend | `next.config.ts:6` hardcoded absolute path | Use `path.resolve` |
| 10 | Frontend | `breadcrumbs.tsx:11` missing `aria-label` | Add `aria-label="Breadcrumb"` |
| 11 | Frontend | `pos/layout.tsx` wraps children in `<>` — does nothing | Delete |
| 12 | Frontend | `app/page.tsx:109` `mounted` state always true — dead animation | Remove |
| 13 | Frontend | `app/page.tsx:17,100` `// TODO: DO IT IN A SEPARATE FILE` | Extract or remove |

---

## Summary

| Category | Backend | Frontend | Total |
|----------|---------|----------|-------|
| Critical | 4 | 4 | **8** |
| Important | 9 | 7 | **16** |
| Nice-to-have | 3 | 10 | **13** |
| **Total** | **16** | **21** | **37** |

### Quick Wins (< 30 min each)
1. Rename `proxy.ts` → `middleware.ts`
2. Add `app/error.tsx`
3. Delete `pos/layout.tsx`
4. Remove `mounted` dead code from `app/page.tsx`
5. Add `aria-label` to breadcrumbs
6. Delete dead utils files
7. Fix POS checkout `res.ok` check
8. Remove JWT secret fallback

### Architectural Priorities
1. **Auth is broken** — F1 + F2 + F3 = no real auth enforcement
2. **Type safety** — B4 + B5-B7 + B10-B11 + F8 = untyped data everywhere
3. **Validation gaps** — B5-B7 = financial data unvalidated
4. **Code duplication** — F5 + F10 + F11 = 14 copy-pasted API routes, 20 copy-pasted headers
