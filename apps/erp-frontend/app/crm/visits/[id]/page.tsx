"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Save, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

const typeOptions = [
  { value: "scheduled", label: "Programada" },
  { value: "unscheduled", label: "No programada" },
  { value: "follow_up", label: "Seguimiento" },
  { value: "proposal", label: "Propuesta" },
  { value: "support", label: "Soporte" },
];

const effectivenessOptions = [
  { value: "effective", label: "Efectiva" },
  { value: "partially_effective", label: "Parcialmente efectiva" },
  { value: "ineffective", label: "No efectiva" },
  { value: "pending", label: "Pendiente" },
];

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
  nextVisit: string;
}

export default function VisitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    date: "",
    time: "",
    type: "scheduled",
    effectiveness: "pending",
    purpose: "",
    notes: "",
    duration: "30",
    nextVisit: "",
  });

  useEffect(() => {
    fetch(`/api/visits/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setVisit(data);
        setForm({
          date: data.date || "",
          time: data.time || "",
          type: data.type || "scheduled",
          effectiveness: data.effectiveness || "pending",
          purpose: data.purpose || "",
          notes: data.notes || "",
          duration: String(data.duration || 30),
          nextVisit: data.nextVisit || "",
        });
        setLoading(false);
      })
      .catch(() => {
        window.alert("Error al cargar la visita");
        setLoading(false);
      });
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/visits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form, duration: parseInt(form.duration) }),
      });
      if (!res.ok) throw new Error();
      window.alert("Visita actualizada");
    } catch {
      window.alert("Error al guardar la visita");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("¿Eliminar esta visita?")) return;
    try {
      const res = await fetch(`/api/visits?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/crm/visits");
    } catch {
      window.alert("Error al eliminar la visita");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando visita...</p>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Visita no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <MapPin className="size-5 text-teal-600" />
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "CRM", href: "/crm" }, { label: "Visitas", href: "/crm/visits" }, { label: "Detalle" }]} />
      </header>

      <div className="mx-auto max-w-2xl px-6 py-6 space-y-4">
        <div className="rounded-xl border border-sand bg-white p-4">
          <p className="text-xs text-espresso-light">Cliente</p>
          <p className="mt-1 font-semibold text-espresso">{visit.customerName}</p>
          <p className="text-xs text-espresso-light">ID: <span className="font-mono">{visit.customerId}</span></p>
        </div>

        <div className="rounded-xl border border-sand bg-white p-4">
          <p className="text-xs text-espresso-light">ID de visita</p>
          <p className="mt-1 font-mono text-sm text-espresso-light">{visit.id}</p>
        </div>

        <div className="rounded-xl border border-sand bg-white p-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs text-espresso-light">Fecha</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-lg border border-sand bg-sand/30 px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-espresso-light">Hora</label>
              <input
                type="text"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full rounded-lg border border-sand bg-sand/30 px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-espresso-light">Duración (min)</label>
              <input
                type="number"
                min="5"
                step="5"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full rounded-lg border border-sand bg-sand/30 px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-sand bg-white p-4">
          <label className="mb-2 block text-sm font-semibold text-espresso">Tipo</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full rounded-lg border border-sand bg-sand/30 px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
          >
            {typeOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-sand bg-white p-4">
          <label className="mb-2 block text-sm font-semibold text-espresso">Efectividad</label>
          <select
            value={form.effectiveness}
            onChange={(e) => setForm({ ...form, effectiveness: e.target.value })}
            className="w-full rounded-lg border border-sand bg-sand/30 px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
          >
            {effectivenessOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-sand bg-white p-4">
          <label className="mb-2 block text-sm font-semibold text-espresso">Propósito</label>
          <input
            type="text"
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            className="w-full rounded-lg border border-sand bg-sand/30 px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
          />
        </div>

        <div className="rounded-xl border border-sand bg-white p-4">
          <label className="mb-2 block text-sm font-semibold text-espresso">Notas</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full rounded-lg border border-sand bg-sand/30 px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 resize-none"
          />
        </div>

        <div className="rounded-xl border border-sand bg-white p-4">
          <label className="mb-2 block text-sm font-semibold text-espresso">Próxima visita (opcional)</label>
          <input
            type="date"
            value={form.nextVisit}
            onChange={(e) => setForm({ ...form, nextVisit: e.target.value })}
            className="w-full rounded-lg border border-sand bg-sand/30 px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
          />
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/crm/visits"
            className="rounded-lg border border-sand bg-white px-4 py-2 text-sm font-medium text-espresso-light hover:bg-sand/30 transition-colors"
          >
            <ArrowLeft className="mr-1 inline size-4" />
            Volver
          </Link>
          <button
            onClick={handleDelete}
            className="ml-auto rounded-lg border border-terracotta/20 bg-white px-4 py-2 text-sm font-medium text-terracotta hover:bg-terracotta/5 transition-colors"
          >
            <Trash2 className="mr-1 inline size-4" />
            Eliminar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            <Save className="mr-1 inline size-4" />
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
