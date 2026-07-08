import {
  TrendingUp,
  Package,
  ShoppingCart,
  Factory,
  UsersRound,
  CircleDollarSign,
  Calculator,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface Module {
  route: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  accent: string;
  hoverBorder: string;
  hoverText: string;
  barColor: string;
}

export const modules: Module[] = [
  {
    route: "pos",
    name: "Punto de Venta",
    desc: "Cobrar y procesar ventas",
    icon: CircleDollarSign,
    accent: "bg-amber-100 text-amber-700",
    hoverBorder: "hover:border-amber-400/40",
    hoverText: "group-hover:text-amber-700",
    barColor: "bg-amber-500",
  },
  {
    route: "inventory",
    name: "Inventario",
    desc: "Productos y existencias",
    icon: Package,
    accent: "bg-sky-100 text-sky-700",
    hoverBorder: "hover:border-sky-400/40",
    hoverText: "group-hover:text-sky-700",
    barColor: "bg-sky-500",
  },
  {
    route: "sales",
    name: "Ventas",
    desc: "Historial y reportes",
    icon: TrendingUp,
    accent: "bg-purple-100 text-purple-700",
    hoverBorder: "hover:border-purple-400/40",
    hoverText: "group-hover:text-purple-700",
    barColor: "bg-purple-500",
  },
  {
    route: "purchases",
    name: "Compras",
    desc: "Órdenes a proveedores",
    icon: ShoppingCart,
    accent: "bg-emerald-100 text-emerald-700",
    hoverBorder: "hover:border-emerald-400/40",
    hoverText: "group-hover:text-emerald-700",
    barColor: "bg-emerald-500",
  },
  {
    route: "manufacturing",
    name: "Fabricación",
    desc: "Órdenes de producción",
    icon: Factory,
    accent: "bg-violet-100 text-violet-700",
    hoverBorder: "hover:border-violet-400/40",
    hoverText: "group-hover:text-violet-700",
    barColor: "bg-violet-500",
  },
  {
    route: "accounting",
    name: "Contabilidad",
    desc: "Libro mayor y balance",
    icon: Calculator,
    accent: "bg-indigo-100 text-indigo-700",
    hoverBorder: "hover:border-indigo-400/40",
    hoverText: "group-hover:text-indigo-700",
    barColor: "bg-indigo-500",
  },
  {
    route: "payroll",
    name: "Empleados",
    desc: "Nómina y asistencia",
    icon: UsersRound,
    accent: "bg-rose-100 text-rose-700",
    hoverBorder: "hover:border-rose-400/40",
    hoverText: "group-hover:text-rose-700",
    barColor: "bg-rose-500",
  },
  {
    route: "crm",
    name: "CRM",
    desc: "Clientes y visitas",
    icon: Users,
    accent: "bg-teal-100 text-teal-700",
    hoverBorder: "hover:border-teal-400/40",
    hoverText: "group-hover:text-teal-700",
    barColor: "bg-teal-500",
  },
];
