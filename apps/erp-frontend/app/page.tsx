"use client";

import { logout } from "@/lib/actions/auth";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { modules } from "@/lib/data/modules";
import { getGreeting } from "@/lib/utils";

export default function Home() {
  
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
              <button onClick={logout} className="rounded-lg p-2 text-espresso-light hover:bg-sand transition-colors">
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-12">
          <h1 className="font-display text-4xl text-espresso sm:text-5xl">
            {getGreeting()}
          </h1>
          <p className="mt-3 text-lg text-espresso-light/70">
            ¿Qué vamos a gestionar hoy?
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((mod, i) => (
            <Link
              key={mod.route}
              href={mod.route}
              className={`group relative rounded-xl border border-sand bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${mod.hoverBorder}`}
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
