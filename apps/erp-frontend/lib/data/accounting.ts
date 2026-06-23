export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  balance: number;
}

export interface JournalLine {
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  status: "posted" | "draft" | "void";
  lines: JournalLine[];
}

export const accounts: Account[] = [
  // Activos
  { id: "A1", code: "1101", name: "Efectivo", type: "asset", balance: 3200.0 },
  { id: "A2", code: "1102", name: "Banco Nacional", type: "asset", balance: 18500.0 },
  { id: "A3", code: "1103", name: "Cuentas por Cobrar", type: "asset", balance: 4350.0 },
  { id: "A4", code: "1201", name: "Inventario", type: "asset", balance: 12180.0 },
  { id: "A5", code: "1301", name: "Equipo de Oficina", type: "asset", balance: 7000.0 },
  // Pasivos
  { id: "L1", code: "2101", name: "Cuentas por Pagar", type: "liability", balance: 6800.0 },
  { id: "L2", code: "2102", name: "IVA por Pagar", type: "liability", balance: 2450.0 },
  { id: "L3", code: "2103", name: "Retenciones por Pagar", type: "liability", balance: 1200.0 },
  { id: "L4", code: "2201", name: "Préstamo Bancario", type: "liability", balance: 2350.0 },
  // Patrimonio
  { id: "E1", code: "3101", name: "Capital Social", type: "equity", balance: 25000.0 },
  { id: "E2", code: "3201", name: "Resultados Acumulados", type: "equity", balance: 7430.0 },
  // Ingresos
  { id: "R1", code: "4101", name: "Ingresos por Ventas", type: "revenue", balance: 18500.0 },
  { id: "R2", code: "4102", name: "Ingresos por Servicios", type: "revenue", balance: 3200.0 },
  // Gastos
  { id: "X1", code: "5101", name: "Costo de Mercancía", type: "expense", balance: 8400.0 },
  { id: "X2", code: "5201", name: "Sueldos y Salarios", type: "expense", balance: 6500.0 },
  { id: "X3", code: "5202", name: "Arrendamiento", type: "expense", balance: 2400.0 },
  { id: "X4", code: "5203", name: "Servicios Públicos", type: "expense", balance: 890.0 },
  { id: "X5", code: "5204", name: "Útiles y Suministros", type: "expense", balance: 340.0 },
  { id: "X6", code: "5205", name: "Mantenimiento", type: "expense", balance: 250.0 },
];

export const journalEntries: JournalEntry[] = [
  {
    id: "AJ-001",
    date: "2026-06-23",
    description: "Venta POS - María García",
    reference: "V-001",
    status: "posted",
    lines: [
      { accountId: "A1", accountName: "Efectivo", debit: 29.0, credit: 0 },
      { accountId: "R1", accountName: "Ingresos por Ventas", debit: 0, credit: 25.0 },
      { accountId: "L2", accountName: "IVA por Pagar", debit: 0, credit: 4.0 },
    ],
  },
  {
    id: "AJ-002",
    date: "2026-06-23",
    description: "Venta POS - Carlos López",
    reference: "V-002",
    status: "posted",
    lines: [
      { accountId: "A2", accountName: "Banco Nacional", debit: 9.86, credit: 0 },
      { accountId: "R1", accountName: "Ingresos por Ventas", debit: 0, credit: 8.5 },
      { accountId: "L2", accountName: "IVA por Pagar", debit: 0, credit: 1.36 },
    ],
  },
  {
    id: "AJ-003",
    date: "2026-06-23",
    description: "Compra insumos - Café Venezolano C.A.",
    reference: "C-001",
    status: "posted",
    lines: [
      { accountId: "X1", accountName: "Costo de Mercancía", debit: 150.0, credit: 0 },
      { accountId: "L2", accountName: "IVA por Pagar", debit: 24.0, credit: 0 },
      { accountId: "L1", accountName: "Cuentas por Pagar", debit: 0, credit: 174.0 },
    ],
  },
  {
    id: "AJ-004",
    date: "2026-06-22",
    description: "Pago arrendamiento junio",
    reference: "G-001",
    status: "posted",
    lines: [
      { accountId: "X3", accountName: "Arrendamiento", debit: 2400.0, credit: 0 },
      { accountId: "A2", accountName: "Banco Nacional", debit: 0, credit: 2400.0 },
    ],
  },
  {
    id: "AJ-005",
    date: "2026-06-22",
    description: "Pago nómina quincenal",
    reference: "N-001",
    status: "posted",
    lines: [
      { accountId: "X2", accountName: "Sueldos y Salarios", debit: 3250.0, credit: 0 },
      { accountId: "L3", accountName: "Retenciones por Pagar", debit: 0, credit: 325.0 },
      { accountId: "A2", accountName: "Banco Nacional", debit: 0, credit: 2925.0 },
    ],
  },
  {
    id: "AJ-006",
    date: "2026-06-21",
    description: "Venta POS - Carmen Díaz",
    reference: "V-007",
    status: "posted",
    lines: [
      { accountId: "A1", accountName: "Efectivo", debit: 67.28, credit: 0 },
      { accountId: "R1", accountName: "Ingresos por Ventas", debit: 0, credit: 58.0 },
      { accountId: "L2", accountName: "IVA por Pagar", debit: 0, credit: 9.28 },
    ],
  },
  {
    id: "AJ-007",
    date: "2026-06-21",
    description: "Compra Panel Solar - Proveedor Solar",
    reference: "C-004",
    status: "draft",
    lines: [
      { accountId: "A4", accountName: "Inventario", debit: 450.0, credit: 0 },
      { accountId: "L2", accountName: "IVA por Pagar", debit: 72.0, credit: 0 },
      { accountId: "L1", accountName: "Cuentas por Pagar", debit: 0, credit: 522.0 },
    ],
  },
  {
    id: "AJ-008",
    date: "2026-06-20",
    description: "Pago servicios públicos mayo",
    reference: "G-002",
    status: "posted",
    lines: [
      { accountId: "X4", accountName: "Servicios Públicos", debit: 890.0, credit: 0 },
      { accountId: "A1", accountName: "Efectivo", debit: 0, credit: 890.0 },
    ],
  },
  {
    id: "AJ-009",
    date: "2026-06-20",
    description: "Ingreso por servicio de consultoría",
    reference: "S-001",
    status: "posted",
    lines: [
      { accountId: "A2", accountName: "Banco Nacional", debit: 3200.0, credit: 0 },
      { accountId: "R2", accountName: "Ingresos por Servicios", debit: 0, credit: 3200.0 },
    ],
  },
  {
    id: "AJ-010",
    date: "2026-06-19",
    description: "Compra útiles de oficina",
    reference: "G-003",
    status: "void",
    lines: [
      { accountId: "X5", accountName: "Útiles y Suministros", debit: 340.0, credit: 0 },
      { accountId: "A1", accountName: "Efectivo", debit: 0, credit: 340.0 },
    ],
  },
];

// Helpers
export function getTotalByType(type: AccountType): number {
  return accounts
    .filter((a) => a.type === type)
    .reduce((sum, a) => sum + a.balance, 0);
}

export function getJournalTotalDebit(entry: JournalEntry): number {
  return entry.lines.reduce((sum, l) => sum + l.debit, 0);
}

export function getJournalTotalCredit(entry: JournalEntry): number {
  return entry.lines.reduce((sum, l) => sum + l.credit, 0);
}

export function getFinancialSummary() {
  const totalAssets = getTotalByType("asset");
  const totalLiabilities = getTotalByType("liability");
  const totalEquity = getTotalByType("equity");
  const totalRevenue = getTotalByType("revenue");
  const totalExpenses = getTotalByType("expense");
  const netIncome = totalRevenue - totalExpenses;

  return {
    totalAssets,
    totalLiabilities,
    totalEquity,
    totalRevenue,
    totalExpenses,
    netIncome,
    balanceEquation: totalAssets === totalLiabilities + totalEquity,
  };
}
