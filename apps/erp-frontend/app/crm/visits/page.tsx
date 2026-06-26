"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Search,
  Plus,
  Clock,
  Eye,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface Visit {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  time: string;
  type: string;
  effectiveness: string;
  purpose: string;
  notes: string;
  duration: number;
  nextVisit: string | null;
}

const visitTypes: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Programada", color: "bg-sand/40 text-espresso-light" },
  unscheduled: { label: "No programada", color: "bg-teal-600/10 text-teal-600" },
  follow_up: { label: "Seguimiento", color: "bg-sand text-espresso-light" },
  proposal: { label: "Propuesta", color: "bg-sage/10 text-sage" },
  support: { label: "Soporte", color: "bg-teal-600/10 text-teal-600" },
};

const effectivenessConfig: Record<string, { label: string; icon: string; color: string }> = {
  effective: { label: "Efectiva", icon: "✓", color: "bg-sage/10 text-sage" },
  partially_effective: { label: "Parcial", icon: "~", color: "bg-sand text-espresso-light" },
  ineffective: { label: "No efectiva", icon: "✗", color: "bg-teal-600/10 text-teal-600" },
  pending: { label: "Pendiente", icon: "⏳", color: "bg-sand text-espresso-light" },
};

export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | string>("all");
  const [effFilter, setEffFilter] = useState<"all" | string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/visits")
      .then((res) => res.json())
      .then((data) => {
        setVisits(data.map((v: any) => ({
          id: v.id,
          customerId: v.customerId,
          customerName: v.customer?.name || "Cliente",
          date: new Date(v.date).toISOString().split("T")[0],
          time: v.time,
          type: v.type,
          effectiveness: v.effectiveness,
          purpose: v.purpose || "",
          notes: v.notes || "",
          duration: v.duration || 0,
          nextVisit: v.nextVisit ? new Date(v.nextVisit).toISOString().split("T")[0] : null,
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = visits.filter((v) => {
    const matchesSearch =
      v.customerName.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.purpose.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || v.type === typeFilter;
    const matchesEff = effFilter === "all" || v.effectiveness === effFilter;
    return matchesSearch && matchesType && matchesEff;
  });

  const effectiveCount = visits.filter((v) => v.effectiveness === "effective").length;
  const pendingCount = visits.filter((v) => v.effectiveness === "pending").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando visitas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <MapPin className="size-5 text-teal-600" />
          <h1 className="font-display text-lg text-espresso">Visitas</h1>
        </div>
        <Link
          href="/crm/visits/new"
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
        >
          <Plus className="size-4" />
          Agendar visita
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-teal-600" />
              <p className="text-xs text-espresso-light">Total</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-espresso">{visits.length}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-sand" />
              <p className="text-xs text-espresso-light">Pendientes</p>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-bold text-espresso">{pendingCount}</p>
              {pendingCount > 0 && <Clock className="size-4 text-sand" />}
            </div>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Efectivas</p>
            <p className="mt-1 text-2xl font-bold text-sage">{effectiveCount}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Recientes</p>
            <p className="mt-1 text-2xl font-bold text-espresso">{visits.length}</p>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso-light" />
            <input
              type="text"
              placeholder="Buscar por cliente, ID o propósito..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-sand bg-sand/30 py-2 pl-9 pr-3 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="self-center text-xs text-espresso-light mr-1">Tipo:</span>
            {(["all", "scheduled", "unscheduled", "follow_up", "proposal", "support"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  typeFilter === t
                    ? "bg-teal-600 text-white"
                    : "bg-sand/30 text-espresso-light hover:bg-sand border border-sand"
                }`}
              >
                {t === "all" ? "Todos" : visitTypes[t].label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex gap-1">
          <span className="self-center text-xs text-espresso-light mr-1">Efectividad:</span>
          {(["all", "effective", "partially_effective", "ineffective", "pending"] as const).map((e) => (
            <button
              key={e}
              onClick={() => setEffFilter(e)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                effFilter === e
                  ? "bg-teal-600 text-white"
                  : "bg-sand/30 text-espresso-light hover:bg-sand border border-sand"
              }`}
            >
              {e === "all" ? "Todas" : effectivenessConfig[e].label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-sand bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand bg-sand/20 text-left text-xs font-medium text-espresso-light uppercase tracking-wider">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Hora</th>
                <th className="px-4 py-3">Propósito</th>
                <th className="px-4 py-3 text-center">Tipo</th>
                <th className="px-4 py-3 text-center">Efectividad</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-espresso-light">
                    <MapPin className="mx-auto mb-2 size-8" />
                    <p>No se encontraron visitas</p>
                  </td>
                </tr>
              ) : (
                filtered.map((visit) => {
                  const type = visitTypes[visit.type];
                  const eff = effectivenessConfig[visit.effectiveness];
                  return (
                    <tr key={visit.id} className="hover:bg-sand/10 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-teal-600">
                        {visit.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 font-medium text-espresso">
                        {visit.customerName}
                      </td>
                      <td className="px-4 py-3 text-espresso-light">{visit.date}</td>
                      <td className="px-4 py-3 text-espresso-light">{visit.time}</td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-espresso-light">
                        {visit.purpose}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${type?.color || "bg-sand text-espresso-light"}`}>
                          {type?.label || visit.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${eff?.color || "bg-sand text-espresso-light"}`}>
                          {eff?.icon || "?"} {eff?.label || visit.effectiveness}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/crm/visits/${visit.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-sand px-2 py-1 text-xs text-espresso-light hover:bg-sand/30 transition-colors"
                        >
                          <Eye className="size-3" />
                          Ver
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
