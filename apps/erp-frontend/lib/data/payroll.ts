export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
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
  { id: "E-001", name: "María García", position: "Gerente General", department: "Dirección", salary: 4500, hireDate: "2022-03-15" },
  { id: "E-002", name: "Carlos López", position: "Contador", department: "Finanzas", salary: 2800, hireDate: "2023-01-10" },
  { id: "E-003", name: "Ana Martínez", position: "Cajera", department: "Ventas", salary: 1200, hireDate: "2024-06-01" },
  { id: "E-004", name: "Pedro Sánchez", position: "Cocinero", department: "Cocina", salary: 1500, hireDate: "2023-09-20" },
  { id: "E-005", name: "Laura Rodríguez", position: "Mesera", department: "Servicio", salary: 1100, hireDate: "2024-02-14" },
  { id: "E-006", name: "Jorge Hernández", position: "Almacenero", department: "Almacén", salary: 1300, hireDate: "2023-07-05" },
  { id: "E-007", name: "Carmen Díaz", position: "Asistente Administrativo", department: "Administración", salary: 1400, hireDate: "2024-01-15" },
  { id: "E-008", name: "Roberto Torres", position: "Técnico de Mantenimiento", department: "Operaciones", salary: 1600, hireDate: "2023-04-22" },
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
