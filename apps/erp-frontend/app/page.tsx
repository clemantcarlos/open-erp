"use client";

import {
  TrendingUp,
  Package,
  ShoppingCart,
  Factory,
  UsersRound,
  CircleDollarSign,
  Calculator,
  Users,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const modules = [
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

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 18) return "Buenas tardes";
  return "Buenas noches";
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 border-b border-sand bg-cream/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-espresso">
              <span className="text-xs font-bold tracking-wider text-cream">OE</span>
            </div>
            <span className="font-display text-xl text-espresso">OpenERP</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden text-espresso-light sm:block font-mono text-xs">Bs/USD 612.43</span>
            <div className="h-4 w-px bg-sand hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-sand text-xs font-medium text-espresso-light">
                CC
              </div>
              <button className="rounded-lg p-2 text-espresso-light hover:bg-sand transition-colors">
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Greeting */}
        <div className={`mb-12 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <h1 className="font-display text-4xl text-espresso sm:text-5xl">
            {getGreeting()}
          </h1>
          <p className="mt-3 text-lg text-espresso-light/70">
            ¿Qué vamos a gestionar hoy?
          </p>
        </div>

        {/* Modules — editorial grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((mod, i) => (
            <Link
              key={mod.route}
              href={mod.route}
              className={`group relative rounded-xl border border-sand bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${mod.hoverBorder} ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
              style={{ transitionDelay: `${i * 50 + 100}ms` }}
            >
              <div className={`mb-3 inline-flex rounded-lg p-2 ${mod.accent} transition-transform duration-300 group-hover:scale-105`}>
                <mod.icon className="size-5" strokeWidth={1.5} />
              </div>
              <h3 className={`font-display text-lg text-espresso ${mod.hoverText} transition-colors`}>
                {mod.name}
              </h3>
              <p className="mt-1 text-sm text-espresso-light/60">
                {mod.desc}
              </p>
              {/* Subtle corner accent on hover */}
              <div className={`absolute inset-x-0 bottom-0 h-0.5 rounded-b-xl ${mod.barColor} scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-xl`} />
            </Link>
          ))}
        </div>

        {/* Footer tagline */}
        <div className="mt-16 border-t border-sand pt-8">
          <p className="text-center text-xs text-espresso-light/40 font-mono tracking-wider uppercase">
            OpenERP · Sistema de Gestión Empresarial
          </p>
        </div>
      </main>
    </div>
  );
}
