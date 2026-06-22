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
  Bug,
  ClipboardList,
  Wrench,
  Factory,
  ShieldCheck,
  Circle,
  Target,
  Globe,
  MessageCircle,
  Receipt,
  LayoutDashboard,
  LayoutGrid,
  Wallet,
  Zap,
  UsersRound,
  HardHat,
} from "lucide-react";

const modules = [
  { name: "Conversaciones", icon: MessageSquare, color: "text-orange-500" },
  { name: "Guía de Despacho", icon: MapPin, color: "text-blue-500" },
  { name: "Contactos", icon: Users, color: "text-emerald-600" },
  { name: "Información", icon: Info, color: "text-teal-500" },
  { name: "Calendario", icon: Calendar, color: "text-red-500" },
  { name: "Contabilidad", icon: Calculator, color: "text-indigo-500" },
  { name: "Ventas", icon: TrendingUp, color: "text-purple-600" },
  { name: "Documentos", icon: FileText, color: "text-amber-500" },
  { name: "Inventario", icon: Package, color: "text-cyan-600" },
  { name: "Firma Electrónica", icon: PenTool, color: "text-sky-600" },
  { name: "Flota", icon: Truck, color: "text-violet-500" },
  { name: "Marketing Social", icon: Megaphone, color: "text-pink-500" },
  { name: "Compra", icon: ShoppingCart, color: "text-emerald-500" },
  { name: "KPI Dashboard", icon: BarChart3, color: "text-slate-600" },
  { name: "Calidad", icon: ShieldCheck, color: "text-lime-600" },
  { name: "Fuerza de Ventas", icon: Target, color: "text-rose-500" },
  { name: "Sitio Web", icon: Globe, color: "text-teal-600" },
  { name: "Mantenimiento", icon: Wrench, color: "text-blue-600" },
  { name: "Fabricación", icon: Factory, color: "text-indigo-600" },
  { name: "Requisiciones", icon: ClipboardList, color: "text-orange-600" },
  { name: "Dashboard", icon: LayoutDashboard, color: "text-red-600" },
  { name: "Tableros", icon: LayoutGrid, color: "text-purple-500" },
  { name: "Retenciones", icon: Receipt, color: "text-amber-600" },
  { name: "Operaciones Rápidas", icon: Zap, color: "text-yellow-500" },
  { name: "Empleados", icon: UsersRound, color: "text-indigo-500" },
  { name: "Taller", icon: HardHat, color: "text-sky-500" },
];

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-[#f0f0f0]">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b bg-white px-6 py-3">
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
          </div>
        </div>
      </header>

      {/* Module grid */}
      <main className="mx-auto max-w-3xl px-6 py-10 flex flex-wrap  gap-y-4">
        {modules.map((mod) => (
          <div key={mod.name} className="w-36 flex flex-col items-center justify-center gap-2">
            <button
              className="group flex flex-col items-center  rounded-sm bg-white p-2 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <mod.icon className={`size-8 ${mod.color}`} strokeWidth={1.5} />
            </button>
            <span className="text-center text-xs font-medium text-zinc-700 group-hover:text-zinc-900">
              {mod.name}
            </span>
          </div>
        ))}
      </main>
    </div>
  );
}
