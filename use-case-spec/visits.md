# Use-Case Spec: Visits (CRM)

## Context
Sales teams schedule visits to customers to build relationships and close deals. They need to schedule, track, and manage visit outcomes.

**Current state:** Visit list has create via `/new` page. Detail page has edit/delete.

---

## Use Cases

### UC-V01: Schedule a Visit
**Actor:** Sales user
**Goal:** Create a new visit record
**Flow:**
1. User navigates to `/crm/visits`
2. User clicks "Agendar visita"
3. System shows create form (`/crm/visits/new`)
4. User enters: customer (select), date, time, type, notes
5. System validates and creates via `POST /api/visits`
6. Success: visit appears in list

**Acceptance Criteria:**
- [ ] Customer required (select from list)
- [ ] Date required (future date)
- [ ] Time optional
- [ ] Type: required (Visita comercial, Seguimiento, Entrega, Reunión)
- [ ] Notes optional
- [ ] Status defaults to "Pendiente"
- [ ] Success redirects to visit list

### UC-V02: View Visits List
**Actor:** Sales user
**Goal:** See all scheduled visits
**Flow:**
1. User navigates to `/crm/visits`
2. System fetches `GET /api/visits?page=1&limit=20`
3. System shows table
4. User filters by status, date range, customer

**Acceptance Criteria:**
- [ ] Table: date, customer, type, status, notes
- [ ] Status color-coded
- [ ] Pagination works
- [ ] Click navigates to `/crm/visits/[id]`

### UC-V03: View Visit Details
**Actor:** Sales user
**Goal:** See full visit info
**Flow:**
1. User clicks visit in list
2. System fetches `GET /api/visits/[id]`
3. System shows all info + customer details

**Acceptance Criteria:**
- [ ] Shows: customer, date, time, type, status, notes
- [ ] Shows customer contact info
- [ ] Edit/delete buttons

### UC-V04: Edit a Visit
**Actor:** Sales user
**Goal:** Update visit info
**Flow:**
1. User clicks "Editar"
2. User modifies fields
3. System updates via `PATCH /api/visits`

**Acceptance Criteria:**
- [ ] All fields editable
- [ ] Status can be changed
- [ ] Validation on submit

### UC-V05: Delete a Visit
**Actor:** Sales user
**Goal:** Remove a visit
**Flow:**
1. User clicks "Eliminar" with confirmation
2. System deletes via `DELETE /api/visits?id=X`

**Acceptance Criteria:**
- [ ] Confirmation dialog
- [ ] Redirects to list

---

## UI Components
- `Card` — visit summary
- `Table` — visit list
- `Badge` — status
- `Button` — actions
- `Dialog` — create/edit forms
- `Select` — customer, type, status
- `Calendar` — date picker
- `AlertDialog` — delete confirmation

## API Endpoints
- `POST /api/visits` — create
- `GET /api/visits` — list with pagination, filters
- `GET /api/visits/[id]` — detail
- `PATCH /api/visits/[id]` — update
- `DELETE /api/visits?id=X` — delete

## Validation Rules
- Customer required
- Date required
- Type required
- Status: "Pendiente" | "Completada" | "Cancelada"
