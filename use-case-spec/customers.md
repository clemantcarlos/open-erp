# Use-Case Spec: Customers (CRM)

## Context
Business owners need to manage customer relationships, track contact info, and associate customers with sales and visits.

**Current state:** Customer list is read-only. Detail page has edit/delete.

---

## Use Cases

### UC-C01: Create a Customer
**Actor:** Staff user
**Goal:** Add a new customer
**Flow:**
1. User navigates to `/crm/customers`
2. User clicks "Nuevo cliente"
3. System shows create form
4. User enters: name, email, phone, address, company, notes
5. System validates and creates via `POST /api/customers`
6. Success: customer appears in list

**Acceptance Criteria:**
- [ ] Name required
- [ ] Email optional (validated if provided)
- [ ] Phone optional
- [ ] Address optional
- [ ] Company optional
- [ ] Notes optional
- [ ] Success toast + list refresh

### UC-C02: View Customers List
**Actor:** Staff user
**Goal:** Browse customer list
**Flow:**
1. User navigates to `/crm/customers`
2. System fetches `GET /api/customers?page=1&limit=20&search=`
3. System shows table
4. User searches by name/email/phone

**Acceptance Criteria:**
- [ ] Table: name, email, phone, company, total purchases count
- [ ] Search works
- [ ] Pagination works
- [ ] Click navigates to `/crm/customers/[id]`

### UC-C03: View Customer Details
**Actor:** Staff user
**Goal:** See full customer info + history
**Flow:**
1. User clicks customer in list
2. System fetches `GET /api/customers/[id]`
3. System shows info + linked sales/visits

**Acceptance Criteria:**
- [ ] Shows all contact fields
- [ ] Shows linked sales (list or count)
- [ ] Shows linked visits (list or count)
- [ ] Edit/delete buttons

### UC-C04: Edit a Customer
**Actor:** Staff user
**Goal:** Update customer info
**Flow:**
1. User clicks "Editar"
2. User modifies fields
3. System updates via `PATCH /api/customers`

**Acceptance Criteria:**
- [ ] All fields editable
- [ ] Validation on submit
- [ ] Success toast

### UC-C05: Delete a Customer
**Actor:** Staff user
**Goal:** Remove a customer
**Flow:**
1. User clicks "Eliminar" with confirmation
2. System deletes via `DELETE /api/customers?id=X`

**Acceptance Criteria:**
- [ ] Confirmation dialog
- [ ] Prevents deletion if linked to sales
- [ ] Redirects to list

---

## UI Components
- `Card` — customer info
- `Table` — customer list
- `Button` — actions
- `Dialog` — create/edit forms
- `Input` — search, form fields
- `AlertDialog` — delete confirmation

## API Endpoints
- `POST /api/customers` — create
- `GET /api/customers` — list with pagination, search
- `GET /api/customers/[id]` — detail with linked data
- `PATCH /api/customers/[id]` — update
- `DELETE /api/customers?id=X` — delete

## Validation Rules
- Name required
- Email format if provided
- Phone format if provided
