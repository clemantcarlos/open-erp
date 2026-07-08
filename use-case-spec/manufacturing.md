# Use-Case Spec: Manufacturing

## Context
Business owners need to manage manufacturing processes, define composite products (BOM), and track production orders.

**Current state:** Manufacturing list fetches from API. All detail pages use mock data.

---

## Use Cases

### UC-M01: Create a Composite Product (BOM)
**Actor:** Production Manager
**Goal:** Define a product assembled from materials and processes
**Flow:**
1. User navigates to `/manufacturing`
2. User clicks "Nuevo producto"
3. User enters: name, description, selling price
4. User adds materials: product (select), quantity, unit cost
5. User adds processes: name, description, cost
6. System validates and creates via POST
7. Success: product appears in list

**Acceptance Criteria:**
- [ ] Name required, unique
- [ ] Selling price > 0
- [ ] At least 1 material required
- [ ] Auto-calculated: material cost, process cost, total cost, margin
- [ ] Success toast + list refresh

### UC-M02: View Composite Products
**Actor:** Production Manager
**Flow:** Fetch GET /api/manufacturing/composite-products, show list, search by name

**Acceptance Criteria:**
- [ ] List: name, total cost, margin, materials count
- [ ] Click navigates to detail

### UC-M03: View Composite Product Details
**Flow:** Fetch GET /[id], show name, description, selling price, cost breakdown, materials table, processes table
**Acceptance Criteria:**
- [ ] Edit/delete buttons present

### UC-M04: Edit a Composite Product
**Flow:** Modify fields, materials, processes. PATCH /api/manufacturing/composite-products
**Acceptance Criteria:**
- [ ] Can add/remove materials and processes
- [ ] Auto-recalculates totals

### UC-M05: Delete a Composite Product
**Flow:** Confirmation dialog, DELETE /api/manufacturing/composite-products?id=X
**Acceptance Criteria:**
- [ ] Prevents deletion if linked to active orders

### UC-M06: Create a Production Order
**Actor:** Production Manager
**Flow:** Select composite product, enter quantity. POST /api/manufacturing/orders
**Acceptance Criteria:**
- [ ] Quantity > 0
- [ ] Total cost auto-calculated
- [ ] Status defaults to "Pendiente"

### UC-M07: View Production Orders
**Flow:** Fetch GET /api/manufacturing/orders, show list, filter by status
**Acceptance Criteria:**
- [ ] List: composite product, quantity, total cost, status, due date

### UC-M08: View Production Order Details
**Flow:** Fetch GET /[id], show order + BOM breakdown
**Acceptance Criteria:**
- [ ] Edit/delete buttons present

### UC-M09: Update Order Status
**Flow:** PATCH /api/manufacturing/orders with new status
**Acceptance Criteria:**
- [ ] Status options: Pendiente, En progreso, Completada, Cancelada

### UC-M10: Delete a Production Order
**Flow:** Confirmation dialog, DELETE /api/manufacturing/orders?id=X
**Acceptance Criteria:**
- [ ] Only pending orders deletable

---

## UI Components
Card, Table, Badge, Button, Dialog, Input, Select, Calendar, AlertDialog, Separator

## API Endpoints
- POST/GET/PATCH/DELETE /api/manufacturing/composite-products
- POST/GET/PATCH/DELETE /api/manufacturing/orders

## Validation Rules
- Composite product name required
- Materials at least 1, quantity > 0
- Order quantity > 0
- Status: Pendiente | En progreso | Completada | Cancelada
