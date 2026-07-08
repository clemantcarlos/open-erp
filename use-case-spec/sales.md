# Use-Case Spec: Sales

## Context
Small business owners sell products through a POS interface. They need to record sales, track what was sold, manage inventory impact, and handle customer relationships.

**Current state:** POS page creates sales but has no validation. Sales list page is read-only.

---

## Use Cases

### UC-S01: Create a Sale (POS)
**Actor:** Staff user
**Goal:** Record a sale with products and quantities
**Precondition:** User is logged in, products exist in inventory
**Flow:**
1. User opens POS page (`/pos`)
2. User searches products by name/barcode
3. User adds products to cart with quantity
4. User selects customer (optional)
5. User clicks "Cobrar" (checkout)
6. System validates stock availability
7. System creates sale via `POST /api/sales`
8. System decrements inventory atomically
9. System displays confirmation

**Acceptance Criteria:**
- [ ] Cart shows product name, qty, unit price, subtotal
- [ ] Cart total updates automatically
- [ ] Stock validation prevents overselling (400 if insufficient)
- [ ] Customer is optional (walk-in sales allowed)
- [ ] On success, cart clears and sale ID is shown
- [ ] Inventory is decremented in same transaction

### UC-S02: View Sales List
**Actor:** Staff/Manager
**Goal:** See all sales with filters
**Flow:**
1. User navigates to `/sales`
2. System fetches `GET /api/sales?page=1&limit=20`
3. System displays table with date, customer, total, status
4. User can filter by date range, customer, status
5. User can click row to view details

**Acceptance Criteria:**
- [ ] Table shows: date, customer name, total, status, items count
- [ ] Pagination works (next/prev)
- [ ] Empty state shows when no sales exist
- [ ] Click row navigates to `/sales/[id]`

### UC-S03: View Sale Details
**Actor:** Staff/Manager
**Goal:** See full details of a sale
**Flow:**
1. User clicks sale in list
2. System fetches `GET /api/sales/[id]`
3. System shows sale items, totals, customer info
4. User can edit or delete the sale

**Acceptance Criteria:**
- [ ] Shows line items with product, qty, unit price, subtotal
- [ ] Shows sale total
- [ ] Shows customer info (if any)
- [ ] Edit button opens edit form
- [ ] Delete button with confirmation dialog
- [ ] Back button returns to list

### UC-S04: Edit a Sale
**Actor:** Staff/Manager
**Goal:** Modify an existing sale
**Flow:**
1. User clicks "Editar" on sale detail page
2. User modifies items, quantities, or customer
3. System validates changes
4. System updates sale via `PATCH /api/sales`
5. System adjusts inventory delta if quantities changed

**Acceptance Criteria:**
- [ ] Can add/remove line items
- [ ] Can change quantities
- [ ] Can change customer
- [ ] Inventory adjustment is correct (delta)
- [ ] Validation prevents overselling on quantity increase

### UC-S05: Delete a Sale
**Actor:** Manager only
**Goal:** Remove a sale and restore inventory
**Flow:**
1. User clicks "Eliminar" on sale detail page
2. Confirmation dialog appears
3. User confirms
4. System deletes sale via `DELETE /api/sales?id=X`
5. System restores inventory for all items

**Acceptance Criteria:**
- [ ] Confirmation dialog prevents accidental deletion
- [ ] Inventory is restored for all items in the sale
- [ ] Redirects to list after deletion

---

## UI Components (shadcn/ui)
- `Card` — sale summary cards
- `Table` — sales list, line items
- `Badge` — sale status
- `Button` — actions
- `Dialog` / `Drawer` — create/edit forms
- `Input` — search, quantity
- `Select` — customer, status filters
- `Calendar` — date range filter
- `AlertDialog` — delete confirmation
- `Toast` — success/error feedback

## API Endpoints
- `POST /api/sales` — create sale (with items array)
- `GET /api/sales` — list with pagination, filters
- `GET /api/sales/[id]` — detail with items
- `PATCH /api/sales/[id]` — update sale
- `DELETE /api/sales?id=X` — delete sale

## Validation Rules
- At least one item required
- Quantity > 0 for all items
- Product must exist
- Sufficient stock for quantity increase
- Total = sum(item.price × item.quantity)

## Notes
- POS uses same API as sales module
- Sale status: `PENDING`, `COMPLETED`, `CANCELLED`
- Inventory decrement is atomic (transaction)
- `customerName` is optional string field on Sale model
