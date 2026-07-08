# Use-Case Spec: Inventory (Products)

## Context
Business owners need to manage their product catalog with stock levels, pricing, categories, and suppliers. Inventory is decremented by sales and incremented by purchases.

**Current state:** Inventory list has create drawer + edit/delete on detail page. Stock summary endpoint exists.

---

## Use Cases

### UC-I01: Create a Product
**Actor:** Staff user
**Goal:** Add a new product to inventory
**Flow:**
1. User navigates to `/inventory`
2. User clicks "Nuevo producto"
3. System shows create drawer
4. User enters: name, description, price, cost, stock, SKU, category, supplier
5. System validates and creates via `POST /api/products`
6. Success: product appears in list

**Acceptance Criteria:**
- [ ] Name required, unique
- [ ] Price > 0, cost > 0
- [ ] Stock >= 0 (default 0)
- [ ] SKU optional (auto-generate if empty)
- [ ] Category: select or text input
- [ ] Supplier: text input
- [ ] Success toast + list refresh

### UC-I02: View Products List
**Actor:** Staff user
**Goal:** Browse product catalog
**Flow:**
1. User navigates to `/inventory`
2. System fetches `GET /api/products?page=1&limit=20&search=&category=`
3. System shows table with products
4. User searches by name/SKU
5. User filters by category, supplier

**Acceptance Criteria:**
- [ ] Table: name, SKU, category, price, cost, stock, supplier
- [ ] Stock color-coded (red if 0, yellow if low)
- [ ] Search works
- [ ] Category filter works
- [ ] Pagination works

### UC-I03: View Product Details
**Actor:** Staff user
**Goal:** See full product info
**Flow:**
1. User clicks product in list
2. System fetches `GET /api/products/[id]`
3. System shows all fields
4. User can edit or delete

**Acceptance Criteria:**
- [ ] Shows all product fields
- [ ] Edit/delete buttons
- [ ] Back button

### UC-I04: Edit a Product
**Actor:** Staff user
**Goal:** Update product info
**Flow:**
1. User clicks "Editar"
2. User modifies fields
3. System updates via `PATCH /api/products`
4. Success: detail page refreshes

**Acceptance Criteria:**
- [ ] All fields editable
- [ ] Validation on submit
- [ ] Success toast

### UC-I05: Delete a Product
**Actor:** Staff user
**Goal:** Remove a product
**Flow:**
1. User clicks "Eliminar" with confirmation
2. System deletes via `DELETE /api/products?id=X`

**Acceptance Criteria:**
- [ ] Confirmation dialog
- [ ] Prevents deletion if linked to active sales/purchases
- [ ] Redirects to list

### UC-I06: View Stock Summary
**Actor:** Manager
**Goal:** See inventory overview
**Flow:**
1. Dashboard shows stock summary card
2. System fetches `GET /api/products/stock-summary`
3. Shows: total products, total value, low stock items

**Acceptance Criteria:**
- [ ] Total products count
- [ ] Total inventory value (sum of price × stock)
- [ ] Low stock alerts (stock < threshold)

---

## UI Components
- `Card` — stock summary, product detail
- `Table` — product list
- `Badge` — stock status
- `Button` — actions
- `Drawer` — create form
- `Input` — search, form fields
- `Select` — category filter
- `AlertDialog` — delete confirmation

## API Endpoints
- `POST /api/products` — create
- `GET /api/products` — list with pagination, search, filters
- `GET /api/products/stock-summary` — inventory overview
- `GET /api/products/[id]` — detail
- `PATCH /api/products/[id]` — update
- `DELETE /api/products?id=X` — delete

## Validation Rules
- Name required, non-empty
- Price, cost: positive numbers
- Stock: non-negative integer
- SKU unique if provided
