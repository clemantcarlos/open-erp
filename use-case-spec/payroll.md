# Use-Case Spec: Payroll

## Context
Business owners need to manage employees, track attendance, process leave requests, and run payroll. The system must calculate salaries, deductions, and bonuses.

**Current state:** Payroll sub-pages all use mock data.

---

## Use Cases

### UC-PY01: Create an Employee
**Actor:** HR/Manager
**Goal:** Add a new employee to the system
**Flow:**
1. User navigates to `/payroll/employees`
2. User clicks "Nuevo empleado"
3. System shows create form
4. User enters: name, email, phone, position, department, salary, startDate
5. System validates and creates via `POST /api/payroll/employees`
6. Success: employee appears in list

**Acceptance Criteria:**
- [ ] Name required
- [ ] Email optional (validated if provided)
- [ ] Phone optional
- [ ] Position required
- [ ] Department required
- [ ] Salary > 0
- [ ] Start date required
- [ ] Status defaults to "Activo"

### UC-PY02: View Employees List
**Actor:** HR/Manager
**Goal:** Browse all employees
**Flow:**
1. User navigates to `/payroll/employees`
2. System fetches `GET /api/payroll/employees?page=1&limit=20`
3. System shows table
4. User searches by name, filters by department

**Acceptance Criteria:**
- [ ] Table: name, position, department, salary, status, startDate
- [ ] Search works
- [ ] Department filter works
- [ ] Pagination works
- [ ] Click navigates to `/payroll/employees/[id]`

### UC-PY03: View Employee Details
**Actor:** HR/Manager
**Goal:** See full employee info + history
**Flow:**
1. User clicks employee in list
2. System fetches `GET /api/payroll/employees/[id]`
3. System shows info + attendance, leave, payroll records

**Acceptance Criteria:**
- [ ] Shows all contact/employment fields
- [ ] Shows linked attendance records
- [ ] Shows linked leave requests
- [ ] Shows linked payroll records
- [ ] Edit/delete buttons

### UC-PY04: Edit an Employee
**Actor:** HR/Manager
**Goal:** Update employee info
**Flow:**
1. User clicks "Editar"
2. User modifies fields
3. System updates via `PATCH /api/payroll/employees`

**Acceptance Criteria:**
- [ ] All fields editable
- [ ] Validation on submit
- [ ] Success toast

### UC-PY05: Delete an Employee
**Actor:** HR/Manager
**Goal:** Remove an employee
**Flow:**
1. User clicks "Eliminar" with confirmation
2. System deletes via `DELETE /api/payroll/employees?id=X`

**Acceptance Criteria:**
- [ ] Confirmation dialog
- [ ] Prevents deletion if linked to payroll records
- [ ] Redirects to list

### UC-PY06: Record Attendance
**Actor:** HR/Staff
**Goal:** Log employee check-in/out
**Flow:**
1. User navigates to `/payroll/attendance`
2. User clicks "Registrar asistencia"
3. System shows form
4. User selects employee, date, checkIn time, checkOut time
5. System creates via `POST /api/payroll/attendance`

**Acceptance Criteria:**
- [ ] Employee required
- [ ] Date required
- [ ] CheckIn time required
- [ ] CheckOut time optional (for ongoing shift)
- [ ] Total hours auto-calculated if both times present
- [ ] Status: "Presente" | "Tarde" | "Ausente" | "Permiso"

### UC-PY07: View Attendance Records
**Actor:** HR/Manager
**Goal:** See attendance for all employees
**Flow:**
1. User navigates to `/payroll/attendance`
2. System fetches `GET /api/payroll/attendance?page=1&limit=20`
3. System shows table
4. User filters by date range, employee, status

**Acceptance Criteria:**
- [ ] Table: date, employee, checkIn, checkOut, hours, status
- [ ] Filters work
- [ ] Pagination works

### UC-PY08: Request Leave
**Actor:** Employee/HR
**Goal:** Submit a leave request
**Flow:**
1. User navigates to `/payroll/leave`
2. User clicks "Solicitar permiso"
3. System shows form
4. User selects: employee, type, startDate, endDate, reason
5. System creates via `POST /api/payroll/leave`

**Acceptance Criteria:**
- [ ] Employee required
- [ ] Type required (Vacaciones, Permiso médico, Permiso personal, Licencia)
- [ ] Start/end dates required
- [ ] End date >= start date
- [ ] Reason required
- [ ] Status defaults to "Pendiente"

### UC-PY09: Approve/Reject Leave
**Actor:** Manager
**Goal:** Process leave requests
**Flow:**
1. Manager sees pending leave requests
2. Manager clicks approve/reject
3. System updates status via `PATCH /api/payroll/leave`

**Acceptance Criteria:**
- [ ] Can approve or reject
- [ ] Status changes to "Aprobado" or "Rechazado"
- [ ] Reason for rejection optional

### UC-PY10: Generate Payroll
**Actor:** HR/Manager
**Goal:** Run payroll for a period
**Flow:**
1. User navigates to `/payroll/payroll`
2. User clicks "Generar nómina"
3. System shows form
4. User selects: month, year, employees (all or select)
5. System calculates: base salary, deductions, bonuses, net pay
6. System creates records via `POST /api/payroll/records`

**Acceptance Criteria:**
- [ ] Month/year required
- [ ] Can select specific employees or all active
- [ ] Shows preview before confirming
- [ ] Deductions: ISSS (3%), AFP (7.25%), renta (if applicable)
- [ ] Bonuses: can add manual bonuses
- [ ] Net = base salary + bonuses - deductions

### UC-PY11: View Payroll Records
**Actor:** HR/Manager
**Goal:** See payroll history
**Flow:**
1. User navigates to `/payroll/payroll`
2. System fetches `GET /api/payroll/records?page=1&limit=20`
3. System shows table
4. User filters by month, year, employee

**Acceptance Criteria:**
- [ ] Table: period, employee, base salary, deductions, bonuses, net
- [ ] Filters work
- [ ] Pagination works

---

## UI Components
- `Card` — employee summary, payroll summary
- `Table` — all lists
- `Badge` — status indicators
- `Button` — actions
- `Dialog` — create/edit forms
- `Input` — search, amounts, times
- `Select` — employee, department, type
- `Calendar` — date picker, date range
- `AlertDialog` — delete confirmation

## API Endpoints
- `POST /api/payroll/employees` — create
- `GET /api/payroll/employees` — list
- `GET /api/payroll/employees/[id]` — detail
- `PATCH /api/payroll/employees/[id]` — update
- `DELETE /api/payroll/employees?id=X` — delete
- `POST /api/payroll/attendance` — create
- `GET /api/payroll/attendance` — list
- `PATCH /api/payroll/attendance/[id]` — update
- `POST /api/payroll/leave` — create
- `GET /api/payroll/leave` — list
- `PATCH /api/payroll/leave/[id]` — approve/reject
- `POST /api/payroll/records` — generate payroll
- `GET /api/payroll/records` — list

## Validation Rules
- Employee must exist
- Dates must be valid ranges
- End date >= start date for leave
- Payroll period unique (employee + month + year)
- Salary > 0
- Deductions calculated correctly
