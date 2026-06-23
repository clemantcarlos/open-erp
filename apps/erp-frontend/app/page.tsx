import {
  MessageSquare,
  MapPin,
  Users,
  Info,
  Calendar,
  Calculator,
  TrendingUp,
  FileText,
  Package,
  PenTool,
  Truck,
  Megaphone,
  ShoppingCart,
  BarChart3,
  ClipboardList,
  Wrench,
  Factory,
  ShieldCheck,
  Target,
  Globe,
  Receipt,
  LayoutDashboard,
  LayoutGrid,
  Zap,
  UsersRound,
  HardHat,
  Bolt,
  CircleDollarSign,
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";

const modules = [
  { route: "pos", name: "POS", icon: CircleDollarSign, color: "text-yellow-500" },
  { route: "inventory", name: "Inventario", icon: Package, color: "text-cyan-600" },
  { route: "sales", name: "Ventas", icon: TrendingUp, color: "text-purple-600" },
  { route: "purchases", name: "Compra", icon: ShoppingCart, color: "text-emerald-500" },
  { route: "manufacturing", name: "Fabricación", icon: Factory, color: "text-indigo-600" },
  { route: "accounting", name: "Contabilidad", icon: Calculator, color: "text-indigo-500" },
  { route: "payroll", name: "Nómina", icon: Receipt, color: "text-rose-500" },
  { route: "", name: "Configuracion", icon: Bolt, color: "text-sk-500" },
  { route: "", name: "Conversaciones", icon: MessageSquare, color: "text-orange-500" },
  { route: "", name: "Guía de Despacho", icon: MapPin, color: "text-blue-500" },
  { route: "", name: "Contactos", icon: Users, color: "text-emerald-600" },
  { route: "", name: "Información", icon: Info, color: "text-teal-500" },
  { route: "", name: "Calendario", icon: Calendar, color: "text-red-500" },
  { route: "", name: "Documentos", icon: FileText, color: "text-amber-500" },
  { route: "", name: "Firma Electrónica", icon: PenTool, color: "text-sky-600" },
  { route: "", name: "Flota", icon: Truck, color: "text-violet-500" },
  { route: "", name: "Marketing Social", icon: Megaphone, color: "text-pink-500" },
  { route: "", name: "KPI Dashboard", icon: BarChart3, color: "text-slate-600" },
  { route: "", name: "Calidad", icon: ShieldCheck, color: "text-lime-600" },
  { route: "", name: "Fuerza de Ventas", icon: Target, color: "text-rose-500" },
  { route: "", name: "Sitio Web", icon: Globe, color: "text-teal-600" },
  { route: "", name: "Mantenimiento", icon: Wrench, color: "text-blue-600" },
  { route: "", name: "Requisiciones", icon: ClipboardList, color: "text-orange-600" },
  { route: "", name: "Dashboard", icon: LayoutDashboard, color: "text-red-600" },
  { route: "", name: "Tableros", icon: LayoutGrid, color: "text-purple-500" },
  { route: "", name: "Retenciones", icon: Receipt, color: "text-amber-600" },
  { route: "", name: "Operaciones Rápidas", icon: Zap, color: "text-yellow-500" },
  { route: "", name: "Empleados", icon: UsersRound, color: "text-indigo-500" },
  { route: "", name: "Taller", icon: HardHat, color: "text-sky-500" },
];

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-zinc-200">
      <header className="fixed w-full flex items-center justify-between border-b bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-zinc-900">
            <span className="text-sm font-bold text-white">OE</span>
          </div>
          <span className="text-lg font-semibold">OpenERP</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Bs/USD: 612.43</span>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-zinc-200">
              <span className="text-xs font-medium">CC</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="pt-22 max-w-3xl mx-auto py-10">
        <div className="flex flex-wrap gap-y-8 text-start *:w-1/3 md:*:w-1/4">
          {modules.map((mod) => (
            <Link
              key={mod.name}
              className="w-36 flex flex-col items-center justify-center gap-2 hover:cursor-pointer hover:*:first:-translate-y-0.5 hover:*:first:shadow-lg"
              href={mod.route}
            >
              <div
                className="group flex flex-col items-center  rounded-sm bg-white p-2 shadow-md transition-all duration
                hover:cursor-pointer"
              >
                <mod.icon
                  className={`size-12 ${mod.color} hover:cursor-pointer`}
                  strokeWidth={1.5}
                />
              </div>
              <span className="text-center text-xs font-medium text-zinc-700 group-hover:text-zinc-900 hover:cursor-pointer">
                {mod.name}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
