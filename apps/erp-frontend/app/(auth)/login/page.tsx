"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Credenciales inválidas");
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      router.push("/");
    } catch {
      setError("No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Left panel — brand */}
      <div className="hidden w-1/2 bg-espresso lg:flex lg:flex-col lg:items-center lg:justify-center relative overflow-hidden">
        {/* Decorative grain on dark */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }} />
        <div className="relative flex flex-col items-center gap-6 px-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-cream/10 bg-cream/5">
            <span className="font-display text-2xl text-cream">OE</span>
          </div>
          <h1 className="font-display text-4xl text-cream">OpenERP</h1>
          <p className="max-w-sm text-cream/50 text-base leading-relaxed">
            Gestión empresarial simple, directa, y completa.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="h-px w-12 bg-cream/20" />
            <span className="font-mono text-[10px] tracking-widest text-cream/30 uppercase">Sistema de gestión</span>
            <div className="h-px w-12 bg-cream/20" />
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-espresso">
              <span className="font-display text-sm text-cream">OE</span>
            </div>
            <span className="font-display text-xl text-espresso">OpenERP</span>
          </div>

          <h2 className="font-display text-3xl text-espresso">Bienvenido</h2>
          <p className="mt-2 text-sm text-espresso-light/60">
            Ingresá tus credenciales para continuar
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg border border-terracotta/20 bg-terracotta/5 px-3 py-2 text-sm text-terracotta">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-espresso" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tu@empresa.com"
                required
                className="w-full rounded-lg border border-sand bg-white px-3 py-2.5 text-sm text-espresso outline-none transition-colors placeholder:text-espresso-light/40 focus:border-terracotta focus:ring-1 focus:ring-terracotta/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-espresso" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-sand bg-white px-3 py-2.5 text-sm text-espresso outline-none transition-colors placeholder:text-espresso-light/40 focus:border-terracotta focus:ring-1 focus:ring-terracotta/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-espresso px-4 py-2.5 text-sm font-medium text-cream transition-all hover:bg-espresso-light disabled:opacity-50 mt-2"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
