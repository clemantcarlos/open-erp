export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  status: "active" | "on_leave" | "terminated";
  avatar: string;
  address: string;
  birthDate: string;
  bloodType: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  hoursWorked: number;
  status: "present" | "absent" | "late" | "half_day";
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "vacation" | "sick" | "personal" | "maternity" | "unpaid";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy: string | null;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  tax: number;
  netPay: number;
  status: "pending" | "paid" | "held";
  paidDate: string | null;
}

export const employees: Employee[] = [
  { id: "E-001", name: "María García", email: "maria@empresa.com", phone: "+58 412-1234567", position: "Gerente General", department: "Dirección", salary: 4500, hireDate: "2022-03-15", status: "active", avatar: "👩‍💼", address: "Av. Principal, Caracas", birthDate: "1985-06-20", bloodType: "O+", emergencyContact: "Juan García", emergencyPhone: "+58 412-7654321" },
  { id: "E-002", name: "Carlos López", email: "carlos@empresa.com", phone: "+58 414-2345678", position: "Contador", department: "Finanzas", salary: 2800, hireDate: "2023-01-10", status: "active", avatar: "👨‍💻", address: "Calle 5, Maracaibo", birthDate: "1990-11-05", bloodType: "A+", emergencyContact: "Ana López", emergencyPhone: "+58 414-8765432" },
  { id: "E-003", name: "Ana Martínez", email: "ana@empresa.com", phone: "+58 424-3456789", position: "Cajera", department: "Ventas", salary: 1200, hireDate: "2024-06-01", status: "active", avatar: "👩‍🔬", address: "Urb. El Rosal, Valencia", birthDate: "1995-03-12", bloodType: "B+", emergencyContact: "Pedro Martínez", emergencyPhone: "+58 424-9876543" },
  { id: "E-004", name: "Pedro Sánchez", email: "pedro@empresa.com", phone: "+58 412-4567890", position: "Cocinero", department: "Cocina", salary: 1500, hireDate: "2023-09-20", status: "active", avatar: "👨‍🍳", address: "Av. Bolívar, Barquisimeto", birthDate: "1988-07-25", bloodType: "AB+", emergencyContact: "Laura Sánchez", emergencyPhone: "+58 412-0987654" },
  { id: "E-005", name: "Laura Rodríguez", email: "laura@empresa.com", phone: "+58 414-5678901", position: "Mesera", department: "Servicio", salary: 1100, hireDate: "2024-02-14", status: "on_leave", avatar: "👩‍🎨", address: "Calle Principal, Mérida", birthDate: "1992-09-08", bloodType: "O-", emergencyContact: "Roberto Rodríguez", emergencyPhone: "+58 414-1098765" },
  { id: "E-006", name: "Jorge Hernández", email: "jorge@empresa.com", phone: "+58 424-6789012", position: "Almacenero", department: "Almacén", salary: 1300, hireDate: "2023-07-05", status: "active", avatar: "👨‍🔧", address: "Urb. Las Mercedes, Caracas", birthDate: "1987-12-01", bloodType: "A-", emergencyContact: "Carmen Hernández", emergencyPhone: "+58 424-2109876" },
  { id: "E-007", name: "Carmen Díaz", email: "carmen@empresa.com", phone: "+58 412-7890123", position: "Asistente Administrativo", department: "Administración", salary: 1400, hireDate: "2024-01-15", status: "active", avatar: "👩‍💼", address: "Av. Libertador, Caracas", birthDate: "1993-04-18", bloodType: "B-", emergencyContact: "Miguel Díaz", emergencyPhone: "+58 412-3210987" },
  { id: "E-008", name: "Roberto Torres", email: "roberto@empresa.com", phone: "+58 414-8901234", position: "Técnico de Mantenimiento", department: "Operaciones", salary: 1600, hireDate: "2023-04-22", status: "active", avatar: "👨‍🏭", address: "Calle 8, San Cristóbal", birthDate: "1986-08-30", bloodType: "O+", emergencyContact: "Isabel Torres", emergencyPhone: "+58 414-4321098" },
  { id: "E-009", name: "Miguel Ángel Reyes", email: "miguel@empresa.com", phone: "+58 424-9012345", position: "Vendedor", department: "Ventas", salary: 1300, hireDate: "2024-03-10", status: "active", avatar: "🧑‍💼", address: "Urb. El Parque, Barinas", birthDate: "1991-02-14", bloodType: "A+", emergencyContact: "Ana Reyes", emergencyPhone: "+58 424-5432109" },
  { id: "E-010", name: "Isabel Flores", email: "isabel@empresa.com", phone: "+58 412-0123456", position: "Recepcionista", department: "Administración", salary: 1000, hireDate: "2024-07-01", status: "terminated", avatar: "👩‍🏫", address: "Av. 5 de Julio, Caracas", birthDate: "1994-10-22", bloodType: "AB-", emergencyContact: "Carlos Flores", emergencyPhone: "+58 412-6543210" },
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: "A-001", employeeId: "E-001", employeeName: "María García", date: "2026-06-23", clockIn: "08:00", clockOut: "17:00", hoursWorked: 9, status: "present" },
  { id: "A-002", employeeId: "E-002", employeeName: "Carlos López", date: "2026-06-23", clockIn: "08:15", clockOut: "17:00", hoursWorked: 8.75, status: "late" },
  { id: "A-003", employeeId: "E-003", employeeName: "Ana Martínez", date: "2026-06-23", clockIn: "09:00", clockOut: "17:00", hoursWorked: 8, status: "present" },
  { id: "A-004", employeeId: "E-004", employeeName: "Pedro Sánchez", date: "2026-06-23", clockIn: "07:30", clockOut: "15:30", hoursWorked: 8, status: "present" },
  { id: "A-005", employeeId: "E-005", employeeName: "Laura Rodríguez", date: "2026-06-23", clockIn: "", clockOut: null, hoursWorked: 0, status: "absent" },
  { id: "A-006", employeeId: "E-006", employeeName: "Jorge Hernández", date: "2026-06-23", clockIn: "08:00", clockOut: "13:00", hoursWorked: 5, status: "half_day" },
  { id: "A-007", employeeId: "E-007", employeeName: "Carmen Díaz", date: "2026-06-23", clockIn: "08:00", clockOut: "17:00", hoursWorked: 9, status: "present" },
  { id: "A-008", employeeId: "E-008", employeeName: "Roberto Torres", date: "2026-06-23", clockIn: "07:45", clockOut: "16:45", hoursWorked: 9, status: "present" },
  { id: "A-009", employeeId: "E-009", employeeName: "Miguel Ángel Reyes", date: "2026-06-23", clockIn: "08:30", clockOut: "17:30", hoursWorked: 9, status: "present" },
  { id: "A-010", employeeId: "E-010", employeeName: "Isabel Flores", date: "2026-06-23", clockIn: "", clockOut: null, hoursWorked: 0, status: "absent" },
  // Previous day
  { id: "A-011", employeeId: "E-001", employeeName: "María García", date: "2026-06-22", clockIn: "08:00", clockOut: "17:00", hoursWorked: 9, status: "present" },
  { id: "A-012", employeeId: "E-002", employeeName: "Carlos López", date: "2026-06-22", clockIn: "08:00", clockOut: "17:00", hoursWorked: 9, status: "present" },
  { id: "A-013", employeeId: "E-003", employeeName: "Ana Martínez", date: "2026-06-22", clockIn: "09:30", clockOut: "17:00", hoursWorked: 7.5, status: "late" },
  { id: "A-014", employeeId: "E-004", employeeName: "Pedro Sánchez", date: "2026-06-22", clockIn: "07:30", clockOut: "15:30", hoursWorked: 8, status: "present" },
  { id: "A-015", employeeId: "E-005", employeeName: "Laura Rodríguez", date: "2026-06-22", clockIn: "08:00", clockOut: "17:00", hoursWorked: 9, status: "present" },
];

export const leaveRequests: LeaveRequest[] = [
  { id: "L-001", employeeId: "E-005", employeeName: "Laura Rodríguez", type: "vacation", startDate: "2026-06-23", endDate: "2026-06-27", days: 5, reason: "Vacaciones anuales", status: "approved", approvedBy: "María García" },
  { id: "L-002", employeeId: "E-003", employeeName: "Ana Martínez", type: "sick", startDate: "2026-06-24", endDate: "2026-06-25", days: 2, reason: "Consulta médica", status: "pending", approvedBy: null },
  { id: "L-003", employeeId: "E-008", employeeName: "Roberto Torres", type: "personal", startDate: "2026-06-28", endDate: "2026-06-28", days: 1, reason: "Trámite personal", status: "approved", approvedBy: "María García" },
  { id: "L-004", employeeId: "E-006", employeeName: "Jorge Hernández", type: "sick", startDate: "2026-06-20", endDate: "2026-06-20", days: 1, reason: "Malestar estomacal", status: "approved", approvedBy: "María García" },
  { id: "L-005", employeeId: "E-009", employeeName: "Miguel Ángel Reyes", type: "vacation", startDate: "2026-07-01", endDate: "2026-07-10", days: 10, reason: "Vacaciones familiares", status: "pending", approvedBy: null },
  { id: "L-006", employeeId: "E-007", employeeName: "Carmen Díaz", type: "personal", startDate: "2026-06-15", endDate: "2026-06-15", days: 1, reason: "Cita odontológica", status: "approved", approvedBy: "Carlos López" },
];

export const payrollRecords: PayrollRecord[] = [
  { id: "NÓM-001", employeeId: "E-001", employeeName: "María García", period: "Jun 2026", baseSalary: 4500, bonuses: 500, deductions: 225, tax: 675, netPay: 4100, status: "paid", paidDate: "2026-06-15" },
  { id: "NÓM-002", employeeId: "E-002", employeeName: "Carlos López", period: "Jun 2026", baseSalary: 2800, bonuses: 200, deductions: 140, tax: 420, netPay: 2440, status: "paid", paidDate: "2026-06-15" },
  { id: "NÓM-003", employeeId: "E-003", employeeName: "Ana Martínez", period: "Jun 2026", baseSalary: 1200, bonuses: 0, deductions: 60, tax: 180, netPay: 960, status: "paid", paidDate: "2026-06-15" },
  { id: "NÓM-004", employeeId: "E-004", employeeName: "Pedro Sánchez", period: "Jun 2026", baseSalary: 1500, bonuses: 150, deductions: 75, tax: 225, netPay: 1350, status: "paid", paidDate: "2026-06-15" },
  { id: "NÓM-005", employeeId: "E-005", employeeName: "Laura Rodríguez", period: "Jun 2026", baseSalary: 1100, bonuses: 100, deductions: 55, tax: 165, netPay: 980, status: "pending", paidDate: null },
  { id: "NÓM-006", employeeId: "E-006", employeeName: "Jorge Hernández", period: "Jun 2026", baseSalary: 1300, bonuses: 0, deductions: 65, tax: 195, netPay: 1040, status: "pending", paidDate: null },
  { id: "NÓM-007", employeeId: "E-007", employeeName: "Carmen Díaz", period: "Jun 2026", baseSalary: 1400, bonuses: 100, deductions: 70, tax: 210, netPay: 1220, status: "held", paidDate: null },
  { id: "NÓM-008", employeeId: "E-008", employeeName: "Roberto Torres", period: "Jun 2026", baseSalary: 1600, bonuses: 200, deductions: 80, tax: 240, netPay: 1480, status: "pending", paidDate: null },
];

// Helpers
export function getTotalPayroll(records: PayrollRecord[]): number {
  return records.reduce((sum, r) => sum + r.netPay, 0);
}

export function getTotalBonuses(records: PayrollRecord[]): number {
  return records.reduce((sum, r) => sum + r.bonuses, 0);
}

export function getTotalDeductions(records: PayrollRecord[]): number {
  return records.reduce((sum, r) => sum + r.deductions + r.tax, 0);
}

export function getActiveEmployees(): Employee[] {
  return employees.filter((e) => e.status === "active");
}

export function getDepartments(): string[] {
  return [...new Set(employees.map((e) => e.department))];
}

export function getEmployeesByDepartment(department: string): Employee[] {
  return employees.filter((e) => e.department === department);
}

export function getTodayAttendance(): AttendanceRecord[] {
  return attendanceRecords.filter((r) => r.date === "2026-06-23");
}

export function getPendingLeaveRequests(): LeaveRequest[] {
  return leaveRequests.filter((r) => r.status === "pending");
}
