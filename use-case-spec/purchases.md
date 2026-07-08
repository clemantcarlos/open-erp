# Use-Case Spec: Purchases

## Context
Business owners need to purchase inventory from suppliers. They record what was bought, track costs, and manage supplier relationships.

**Current state:** Purchases list is read-only. Detail page has edit/delete.

---

## Use Cases

### UC-P01: Create a Purchase
**Actor:** Staff user
**Goal:** Record a new purchase from a supplier
**Precondition:** User is logged in
**Flow:**
1. User navigates to `/purchases`
2. User clicks "Nueva compra" button
3. System shows create form (drawer/modal)
4. User enters: supplier name, date, items (product, qty, unit cost)
5. User submits
6. System validates input
7. System creates purchase via `POST /api/purchases`
8. System increments inventory for each item
9. System displays success

**Acceptance Criteria:**
- [ ] Form has fields: supplier name (required), date (default: today)
- [ ] Can add multiple line items
- [ ] Each item: product (select), quantity (>0), unit cost (>0)
- [ ] Subtotal auto-calculates per item and total
- [ ] Submit creates purchase and increments inventory
- [ ] Validation errors shown inline
- [ ] Success redirects to purchase detail

### UC-P02: View Purchases List
**Actor:** Staff/Manager
**Goal:** See all purchases
**Flow:**
1. User navigates to `/purchases`
2. System fetches `GET /api/purchases?page=1&limit=20`
3. System displays table: date, supplier, total, items count
4. User filters by date range, supplier
5. User clicks row to view details

**Acceptance Criteria:**
- [ ] Table columns: date, supplier, items count, total
- [ ] Pagination works
- [ ] Empty state for no purchases
- [ ] Click navigates to `/purchases/[id]`

### UC-P03: View Purchase Details
**Actor:** Staff/Manager
**Goal:** See full details of a purchase
**Flow:**
1. User clicks purchase in list
2. System fetches `GET /api/purchases/[id]`
3. System shows items, totals, supplier info
4. User can edit or delete

**Acceptance Criteria:**
- [ ] Shows line items: product, qty, unit cost, subtotal
- [ ] Shows purchase total
- [ ] Shows supplier name
- [ ] Edit/delete buttons available

### UC-P04: Edit a Purchase
**Actor:** Staff/Manager
**Goal:** Modify an existing purchase
**Flow:**
1. User clicks "Editar" on purchase detail
2. User modifies items, quantities, or supplier
3. System validates changes
4. System updates purchase via `PATCH /api/purchases`
5. System adjusts inventory delta

**Acceptance Criteria:**
- [ ] Can add/remove line items
- [ ] Can change quantities
- [ ] Inventory adjustment is correct (delta)

### UC-P05: Delete a Purchase
**Actor:** Manager only
**Goal:** Remove a purchase and restore inventory
**Flow:**
1. User clicks "Eliminar" with confirmation
2. System deletes via `DELETE /api/purchases?id=X`
3. System reverses inventory increments

**Acceptance Criteria:**
- [ ] Confirmation dialog
- [ ] Inventory restored
- [ ] Redirects to list

---

## UI Components
- `Card` — purchase summary
- `Table` — list, line items
- `Button` — actions
- `Dialog` / `Drawer` — create/edit forms
- `Input` — quantity, cost
- `Select` — product, supplier
- `Calendar` — date picker
- `AlertDialog` — delete confirmation

## API Endpoints
- `POST /api/purchases` — create (with items array)
- `GET /api/purchases` — list with pagination
- `GET /api/purchases/[id]` — detail with items
- `PATCH /api/purchases/[id]` — update
- `DELETE /api/purchases?id=X` — delete

## Validation Rules
- Supplier name required
- At least one item
- Quantity > 0, unit cost > 0
- Product must exist
- Total = sum(item.cost × item.quantity)
