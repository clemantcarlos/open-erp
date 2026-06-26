export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: "regular" | "vip" | "new" | "inactive";
  totalSpent: number;
  visits: number;
  lastVisit: string;
  notes: string;
  address: string;
  birthDate: string;
  createdAt: string;
}

export interface CustomerActivity {
  id: string;
  customerId: string;
  type: "purchase" | "call" | "email" | "visit" | "note";
  description: string;
  date: string;
  amount?: number;
}

const avatarColors = [
  "bg-teal-100 text-teal-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-orange-100 text-orange-700",
];

export function getAvatarColor(id: string): string {
  const index =
    id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    avatarColors.length;
  return avatarColors[index];
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export const customers: Customer[] = [
  {
    id: "C-001",
    name: "María García",
    email: "maria.garcia@email.com",
    phone: "+58 412-555-0101",
    segment: "vip",
    totalSpent: 1250.0,
    visits: 48,
    lastVisit: "2026-06-23",
    notes: "Prefiere mesa junto a la ventana. Alérgica a frutos secos.",
    address: "Av. Principal, Caracas",
    birthDate: "1985-03-15",
    createdAt: "2025-01-10",
  },
  {
    id: "C-002",
    name: "Carlos López",
    email: "carlos.lopez@email.com",
    phone: "+58 414-555-0202",
    segment: "regular",
    totalSpent: 680.0,
    visits: 32,
    lastVisit: "2026-06-23",
    notes: "Viene los martes con su familia. Pide siempre el mismo plato.",
    address: "Calle 5, Maracaibo",
    birthDate: "1990-07-22",
    createdAt: "2025-03-05",
  },
  {
    id: "C-003",
    name: "Ana Martínez",
    email: "ana.martinez@email.com",
    phone: "+58 416-555-0303",
    segment: "regular",
    totalSpent: 420.0,
    visits: 22,
    lastVisit: "2026-06-22",
    notes: "Le gusta probar cosas nuevas. Siempre pregunta por el menú del día.",
    address: "Urb. Las Mercedes, Caracas",
    birthDate: "1988-11-08",
    createdAt: "2025-05-12",
  },
  {
    id: "C-004",
    name: "Pedro Sánchez",
    email: "pedro.sanchez@email.com",
    phone: "+58 424-555-0404",
    segment: "new",
    totalSpent: 45.0,
    visits: 3,
    lastVisit: "2026-06-22",
    notes: "Primer cliente nuevo esta semana. Vino por recomendación.",
    address: "Av. Libertador, Valencia",
    birthDate: "1995-01-30",
    createdAt: "2026-06-15",
  },
  {
    id: "C-005",
    name: "Laura Rodríguez",
    email: "laura.rodriguez@email.com",
    phone: "+58 412-555-0505",
    segment: "vip",
    totalSpent: 2100.0,
    visits: 65,
    lastVisit: "2026-06-23",
    notes: "Clienta fiel desde el primer día. Organiza eventos corporativos.",
    address: "Torre Empresarial, Caracas",
    birthDate: "1982-06-18",
    createdAt: "2024-11-20",
  },
  {
    id: "C-006",
    name: "Jorge Hernández",
    email: "jorge.hernandez@email.com",
    phone: "+58 414-555-0606",
    segment: "regular",
    totalSpent: 310.0,
    visits: 18,
    lastVisit: "2026-06-21",
    notes: "Prefiere pedir para llevar. Llama siempre antes de venir.",
    address: "Av. Bolívar, Barquisimeto",
    birthDate: "1992-09-05",
    createdAt: "2025-07-01",
  },
  {
    id: "C-007",
    name: "Carmen Díaz",
    email: "carmen.diaz@email.com",
    phone: "+58 416-555-0707",
    segment: "regular",
    totalSpent: 890.0,
    visits: 41,
    lastVisit: "2026-06-23",
    notes: "Le encanta el café. Siempre pide doble espresso.",
    address: "Centro, Caracas",
    birthDate: "1987-12-01",
    createdAt: "2025-02-14",
  },
  {
    id: "C-008",
    name: "Roberto Torres",
    email: "roberto.torres@email.com",
    phone: "+58 424-555-0808",
    segment: "inactive",
    totalSpent: 150.0,
    visits: 8,
    lastVisit: "2026-03-10",
    notes: "No ha venido en 3 meses. Enviar promoción de regreso.",
    address: "Av. Urdaneta, Caracas",
    birthDate: "1980-04-25",
    createdAt: "2025-04-20",
  },
  {
    id: "C-009",
    name: "Isabel Flores",
    email: "isabel.flores@email.com",
    phone: "+58 412-555-0909",
    segment: "new",
    totalSpent: 28.0,
    visits: 2,
    lastVisit: "2026-06-20",
    notes: "Vinó con Laura Rodríguez. Le gustó mucho el ambiente.",
    address: "Las Palmas, Caracas",
    birthDate: "1998-08-12",
    createdAt: "2026-06-18",
  },
  {
    id: "C-010",
    name: "Miguel Ángel Reyes",
    email: "miguel.reyes@email.com",
    phone: "+58 414-555-1010",
    segment: "regular",
    totalSpent: 520.0,
    visits: 27,
    lastVisit: "2026-06-19",
    notes: "Empresario. Viene a reuniones de trabajo. Pide reservación.",
    address: "Torre Florencia, Caracas",
    birthDate: "1979-02-28",
    createdAt: "2025-06-10",
  },
  {
    id: "C-011",
    name: "Valentina Castro",
    email: "valentina.castro@email.com",
    phone: "+58 416-555-1111",
    segment: "vip",
    totalSpent: 1800.0,
    visits: 52,
    lastVisit: "2026-06-23",
    notes: "Influencer local. Siempre publica fotos de la comida.",
    address: "Av. Francisco de Miranda, Caracas",
    birthDate: "1993-10-17",
    createdAt: "2024-12-05",
  },
  {
    id: "C-012",
    name: "Diego Morales",
    email: "diego.morales@email.com",
    phone: "+58 424-555-1212",
    segment: "inactive",
    totalSpent: 95.0,
    visits: 5,
    lastVisit: "2026-02-15",
    notes: "Se mudó de la ciudad. Verificar si regresa.",
    address: "Mérida (antes Caracas)",
    birthDate: "1991-05-09",
    createdAt: "2025-08-22",
  },
];

export const customerActivity: CustomerActivity[] = [
  { id: "A-001", customerId: "C-001", type: "purchase", description: "Compra: Almuerzo para 2 personas", date: "2026-06-23", amount: 32.0 },
  { id: "A-002", customerId: "C-005", type: "purchase", description: "Compra: Evento corporativo (15 personas)", date: "2026-06-23", amount: 450.0 },
  { id: "A-003", customerId: "C-001", type: "call", description: "Llamada: Confirmar reservación para el viernes", date: "2026-06-22" },
  { id: "A-004", customerId: "C-004", type: "visit", description: "Primera visita. Recomendado por Laura Rodríguez.", date: "2026-06-15" },
  { id: "A-005", customerId: "C-011", type: "purchase", description: "Compra: Brunch especial + fotos para Instagram", date: "2026-06-23", amount: 58.0 },
  { id: "A-006", customerId: "C-002", type: "purchase", description: "Compra: Cena familiar (4 personas)", date: "2026-06-23", amount: 65.0 },
  { id: "A-007", customerId: "C-008", type: "note", description: "Cliente inactivo por 3 meses.考虑 enviar cupón de descuento.", date: "2026-06-20" },
  { id: "A-008", customerId: "C-007", type: "purchase", description: "Compra: 3 café doble espresso + pastel", date: "2026-06-23", amount: 24.0 },
  { id: "A-009", customerId: "C-010", type: "call", description: "Llamada: Reservar mesa para reunión (8 personas)", date: "2026-06-18" },
  { id: "A-010", customerId: "C-003", type: "purchase", description: "Compra: Menú del día + jugo natural", date: "2026-06-22", amount: 18.5 },
  { id: "A-011", customerId: "C-009", type: "visit", description: "Segunda visita. Vino con Laura Rodríguez.", date: "2026-06-20" },
  { id: "A-012", customerId: "C-006", type: "email", description: "Email: Pidió menú para llevar por WhatsApp", date: "2026-06-21", amount: 22.0 },
];

export const segmentConfig = {
  vip: { label: "VIP", color: "bg-amber-100 text-amber-700" },
  regular: { label: "Regular", color: "bg-teal-100 text-teal-700" },
  new: { label: "Nuevo", color: "bg-sky-100 text-sky-700" },
  inactive: { label: "Inactivo", color: "bg-zinc-100 text-zinc-500" },
};

export function getCustomerById(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}

export function getActivitiesByCustomer(customerId: string): CustomerActivity[] {
  return customerActivity.filter((a) => a.customerId === customerId);
}

export function getRecentActivity(limit = 6): CustomerActivity[] {
  return [...customerActivity]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function getTotalCustomers(): number {
  return customers.length;
}

export function getActiveCustomers(): number {
  return customers.filter((c) => c.segment !== "inactive").length;
}

export function getVipCustomers(): number {
  return customers.filter((c) => c.segment === "vip").length;
}

export function getNewCustomers(): number {
  return customers.filter((c) => c.segment === "new").length;
}
