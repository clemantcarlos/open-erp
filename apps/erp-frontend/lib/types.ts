export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  minStock: number;
}

export interface Sale {
  id: string;
  date: string;
  customer: string | null;
  items: Array<{ productId: string; name: string; quantity: number; price: number; subtotal: number }>;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentMethod: string;
}

export interface Purchase {
  id: string;
  date: string;
  supplier: string;
  items: Array<{ productId: string; name: string; quantity: number; price: number; subtotal: number }>;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  expectedDate: string | null;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  segment: string;
  address: string | null;
}

export interface Visit {
  id: string;
  customerId: string;
  customerName?: string;
  date: string;
  time: string;
  type: string;
  effectiveness: string;
  purpose: string | null;
  notes: string | null;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  status: string;
}

export interface AttendanceRecord {
  id: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  hours: number;
  status: string;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

export interface PayrollRecord {
  id: string;
  employeeName: string;
  period: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netPay: number;
  status: string;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  balance: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  status: string;
  lines: Array<{ accountId: string; debit: number; credit: number; description: string }>;
}

export interface CompositeProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  salePrice: number;
  emoji: string;
  bom: any;
  routing: any;
}

export interface ProductionOrder {
  id: string;
  compositeProductId: string;
  compositeProductName: string;
  quantityPlanned: number;
  quantityProduced: number;
  status: string;
  scheduledDate: string;
  completedDate: string | null;
  notes: string | null;
}
