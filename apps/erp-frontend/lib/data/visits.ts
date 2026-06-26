import { customers } from "./crm";

export interface Visit {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  time: string;
  type: "scheduled" | "unscheduled" | "follow_up" | "proposal" | "support";
  effectiveness: "effective" | "partially_effective" | "ineffective" | "pending";
  purpose: string;
  notes: string;
  duration: number;
  nextVisit: string | null;
  createdAt: string;
}

export const visitTypes = {
  scheduled: { label: "Programada", color: "bg-sky-100 text-sky-700" },
  unscheduled: { label: "No programada", color: "bg-zinc-100 text-zinc-600" },
  follow_up: { label: "Seguimiento", color: "bg-violet-100 text-violet-700" },
  proposal: { label: "Propuesta", color: "bg-emerald-100 text-emerald-700" },
  support: { label: "Soporte", color: "bg-amber-100 text-amber-700" },
} as const;

export const effectivenessConfig = {
  effective: { label: "Efectiva", color: "bg-emerald-100 text-emerald-700", icon: "✓" },
  partially_effective: { label: "Parcial", color: "bg-amber-100 text-amber-700", icon: "~" },
  ineffective: { label: "No efectiva", color: "bg-red-100 text-red-700", icon: "✗" },
  pending: { label: "Pendiente", color: "bg-zinc-100 text-zinc-500", icon: "—" },
} as const;

export const visits: Visit[] = [
  {
    id: "VIS-001",
    customerId: "C-005",
    customerName: "Laura Rodríguez",
    date: "2026-06-25",
    time: "10:00",
    type: "proposal",
    effectiveness: "pending",
    purpose: "Presentar paquete de eventos corporativos Q3",
    notes: "Quiere cotización para 3 eventos en julio. Preguntar por opciones de menú personalizado.",
    duration: 60,
    nextVisit: "2026-07-01",
    createdAt: "2026-06-23",
  },
  {
    id: "VIS-002",
    customerId: "C-001",
    customerName: "María García",
    date: "2026-06-24",
    time: "14:30",
    type: "follow_up",
    effectiveness: "effective",
    purpose: "Seguimiento post-reservación cumpleaños",
    notes: "Quedó muy satisfecha con el servicio. Pidió reservar para diciembre.",
    duration: 30,
    nextVisit: "2026-12-10",
    createdAt: "2026-06-22",
  },
  {
    id: "VIS-003",
    customerId: "C-010",
    customerName: "Miguel Ángel Reyes",
    date: "2026-06-23",
    time: "09:00",
    type: "scheduled",
    effectiveness: "effective",
    purpose: "Reunión mensual — renovación de contrato de eventos",
    notes: "Renovó por 6 meses. Acordamos menú fijo los viernes.",
    duration: 45,
    nextVisit: "2026-07-23",
    createdAt: "2026-06-20",
  },
  {
    id: "VIS-004",
    customerId: "C-008",
    customerName: "Roberto Torres",
    date: "2026-06-22",
    time: "11:00",
    type: "unscheduled",
    effectiveness: "ineffective",
    purpose: "Visita de recuperación — cliente inactivo",
    notes: "No estaba en casa. Dejar tarjeta y mensaje.",
    duration: 10,
    nextVisit: "2026-06-30",
    createdAt: "2026-06-22",
  },
  {
    id: "VIS-005",
    customerId: "C-011",
    customerName: "Valentina Castro",
    date: "2026-06-26",
    time: "16:00",
    type: "proposal",
    effectiveness: "pending",
    purpose: "Proponer colaboración con contenido para redes",
    notes: "Preparar propuesta con intercambio: comidas gratuitas por publicaciones.",
    duration: 45,
    nextVisit: null,
    createdAt: "2026-06-23",
  },
  {
    id: "VIS-006",
    customerId: "C-002",
    customerName: "Carlos López",
    date: "2026-06-21",
    time: "19:00",
    type: "scheduled",
    effectiveness: "partially_effective",
    purpose: "Presentar nuevo menú de temporada",
    notes: "Le gustó pero pide opciones sin gluten. Verificar disponibilidad.",
    duration: 40,
    nextVisit: "2026-07-05",
    createdAt: "2026-06-18",
  },
  {
    id: "VIS-007",
    customerId: "C-007",
    customerName: "Carmen Díaz",
    date: "2026-06-20",
    time: "08:30",
    type: "support",
    effectiveness: "effective",
    purpose: "Resolver queja sobre servicio anterior",
    notes: "Disculpas formales. Ofrecer café gratis en próxima visita. Cliente conforma.",
    duration: 20,
    nextVisit: "2026-06-27",
    createdAt: "2026-06-19",
  },
  {
    id: "VIS-008",
    customerId: "C-004",
    customerName: "Pedro Sánchez",
    date: "2026-06-28",
    time: "12:00",
    type: "follow_up",
    effectiveness: "pending",
    purpose: "Seguimiento a primer cliente nuevo",
    notes: "Llamar para preguntar si le gustó la experiencia.",
    duration: 15,
    nextVisit: null,
    createdAt: "2026-06-23",
  },
  {
    id: "VIS-009",
    customerId: "C-003",
    customerName: "Ana Martínez",
    date: "2026-06-19",
    time: "15:00",
    type: "follow_up",
    effectiveness: "effective",
    purpose: "Invitar a evento de degustación de nuevo menú",
    notes: "Asistirá con 2 amigas. Confirmar reserva.",
    duration: 30,
    nextVisit: "2026-07-10",
    createdAt: "2026-06-17",
  },
  {
    id: "VIS-010",
    customerId: "C-012",
    customerName: "Diego Morales",
    date: "2026-06-18",
    time: "10:30",
    type: "unscheduled",
    effectiveness: "ineffective",
    purpose: "Visita de despedida — cliente se muda",
    notes: "No disponible. Enviar mensagem de despedida por email.",
    duration: 5,
    nextVisit: null,
    createdAt: "2026-06-18",
  },
];

export function getVisitById(id: string): Visit | undefined {
  return visits.find((v) => v.id === id);
}

export function getVisitsByCustomer(customerId: string): Visit[] {
  return visits.filter((v) => v.customerId === customerId);
}

export function getUpcomingVisits(): Visit[] {
  const today = "2026-06-25";
  return visits
    .filter((v) => v.date >= today && v.effectiveness === "pending")
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getEffectiveVisits(): number {
  return visits.filter((v) => v.effectiveness === "effective").length;
}

export function getPendingVisits(): number {
  return visits.filter((v) => v.effectiveness === "pending").length;
}

export function getThisWeekVisits(): number {
  return visits.filter((v) => v.date >= "2026-06-23" && v.date <= "2026-06-29").length;
}
