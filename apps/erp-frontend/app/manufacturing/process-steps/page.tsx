"use client";

import { useState, useEffect } from "react";
import {
  Cog,
  Search,
  Plus,
  Eye,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface ProcessStep {
  id: string;
  name: string;
  description: string;
  order: number;
}

export default function ProcessStepsPage() {
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/manufacturing/process-steps")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : data?.data ?? [];
        setSteps(items.map((s: any) => ({
          id: s.id,
          name: s.processName || s.name || "",
          description: s.description || "",
          order: s.order ?? 0,
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = steps.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando procesos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <Cog className="size-5 text-violet-600" />
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Fabricación", href: "/manufacturing" },
              { label: "Pasos de proceso" },
            ]}
          />
        </div>
        <button
          onClick={() => alert("Próximamente")}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
        >
          <Plus className="size-4" />
          Nuevo proceso
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso-light" />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-sand bg-white py-2 pl-9 pr-3 text-sm text-espresso outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-sand bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand text-left text-xs font-medium text-espresso-light uppercase tracking-wider">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3 text-center">Orden</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-espresso-light">
                    <Cog className="mx-auto mb-2 size-8" />
                    <p>No se encontraron pasos de proceso</p>
                  </td>
                </tr>
              ) : (
                filtered.map((step) => (
                  <tr key={step.id} className="hover:bg-sand/10 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-espresso-light">{step.id}</td>
                    <td className="px-4 py-3 font-medium text-espresso">{step.name}</td>
                    <td className="px-4 py-3 text-espresso-light">{step.description || "—"}</td>
                    <td className="px-4 py-3 text-center font-mono text-espresso">{step.order}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/manufacturing/process-steps/${step.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-sand/20 px-2 py-1 text-xs text-espresso-light hover:text-violet-600 transition-colors"
                        >
                          <Eye className="size-3" />
                          Ver
                        </Link>
                        <button
                          onClick={() => alert("Próximamente")}
                          className="inline-flex items-center gap-1 rounded-lg bg-sand/20 px-2 py-1 text-xs text-espresso-light hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="size-3" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
