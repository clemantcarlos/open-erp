# Use-Case Spec: Accounting

## Context
Business owners need to track financial transactions through journal entries with balanced debits/credits. They need to create accounts, post entries, and view financial summaries.

**Current state:** Accounting list fetches from API. Journal detail page is read-only.

---

## Use Cases

### UC-A01: Create an Account
**Actor:** Accountant/Manager
**Goal:** Set up a new chart of accounts entry
**Flow:**
1. User navigates to `/accounting`
2. System shows accounts list
3. User clicks "Nueva cuenta"
4. System shows create form
5. User enters: name, type, code, description
6. System validates and creates via `POST /api/accounting/accounts`
7. Success: account appears in list

**Acceptance Criteria:**
- [ ] Name required, unique
- [ ] Type required (Activo, Pasivo, Capital, Ingreso, Gasto)
- [ ] Code required, unique (numeric)
- [ ] Description optional
- [ ] Success toast + list refresh

### UC-A02: Create a Journal Entry
**Actor:** Accountant/Manager
**Goal:** Record a financial transaction
**Flow:**
1. User navigates to `/accounting`
2. User clicks "Nuevo asiento"
3. System shows create form
4. User enters: date, description, reference
5. User adds line items: account (select), debit amount, credit amount
6. System validates debits = credits
7. System creates via `POST /api/accounting/journal`
8. Success: entry appears in list

**Acceptance Criteria:**
- [ ] Date required
- [ ] Description required
- [ ] Reference optional
- [ ] At least 2 line items required
- [ ] Debit and credit on same line are mutually exclusive (one is 0)
- [ ] Total debits = total credits (validated)
- [ ] Account must exist
- [ ] Amount > 0
- [ ] Success toast + list refresh

### UC-A03: View Journal Entries
**Actor:** Accountant/Manager
**Goal:** Browse all journal entries
**Flow:**
1. User navigates to `/accounting`
2. System fetches `GET /api/accounting/journal?page=1&limit=20`
3. System shows table
4. User filters by date range, account

**Acceptance Criteria:**
- [ ] Table: date, description, reference, total debit, total credit, status
- [ ] Balanced entries shown in green, unbalanced in red
- [ ] Pagination works
- [ ] Click navigates to `/accounting/journal/[id]`

### UC-A04: View Journal Entry Details
**Actor:** Accountant/Manager
**Goal:** See full entry details
**Flow:**
1. User clicks entry in list
2. System fetches `GET /api/accounting/journal/[id]`
3. System shows entry + line items

**Acceptance Criteria:**
- [ ] Shows: date, description, reference, status
- [ ] Shows line items: account, debit, credit
- [ ] Shows totals (debit, credit)
- [ ] Edit/delete buttons

### UC-A05: Edit a Journal Entry
**Actor:** Accountant/Manager
**Goal:** Modify an entry (before posting)
**Flow:**
1. User clicks "Editar"
2. User modifies fields
3. System validates balanced debits/credits
4. System updates via `PATCH /api/accounting/journal`

**Acceptance Criteria:**
- [ ] Can add/remove line items
- [ ] Can change amounts
- [ ] Balanced validation enforced
- [ ] Only editable if status is "Borrador"

### UC-A06: Delete a Journal Entry
**Actor:** Accountant/Manager
**Goal:** Remove an entry
**Flow:**
1. User clicks "Eliminar" with confirmation
2. System deletes via `DELETE /api/accounting/journal?id=X`

**Acceptance Criteria:**
- [ ] Confirmation dialog
- [ ] Only deletable if status is "Borrador"
- [ ] Redirects to list

---

## UI Components
- `Card` — account summary, entry summary
- `Table` — accounts list, journal entries, line items
- `Badge` — entry status, account type
- `Button` — actions
- `Dialog` — create/edit forms
- `Input` — amounts
- `Select` — account type, accounts
- `Calendar` — date picker
- `AlertDialog` — delete confirmation

## API Endpoints
- `POST /api/accounting/accounts` — create account
- `GET /api/accounting/accounts` — list accounts
- `GET /api/accounting/accounts/[id]` — account detail
- `PATCH /api/accounting/accounts/[id]` — update account
- `DELETE /api/accounting/accounts?id=X` — delete account
- `POST /api/accounting/journal` — create entry (with line items)
- `GET /api/accounting/journal` — list entries
- `GET /api/accounting/journal/[id]` — entry detail with lines
- `PATCH /api/accounting/journal/[id]` — update entry
- `DELETE /api/accounting/journal?id=X` — delete entry

## Validation Rules
- Debits must equal credits on every entry
- Amounts must be positive
- Account must exist
- Status: "Borrador" | "Publicado" | "Cerrado"
- Only "Borrador" entries can be edited/deleted
