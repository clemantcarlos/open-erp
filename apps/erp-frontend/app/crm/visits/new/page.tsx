"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  FileText,
  User,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface Customer {
  id: string;
  name: string;
  segment: string;
}

const typeOptions = [
  { value: "scheduled", label: "Programada" },
  { value: "unscheduled", label: "No programada" },
  { value: "follow_up", label: "Seguimiento" },
  { value: "proposal", label: "Propuesta" },
  { value: "support", label: "Soporte" },
];

export default function NewVisitPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    customerId: "",
    date: "",
    time: "",
    type: "scheduled",
    purpose: "",
    notes: "",
    duration: "30",
    nextVisit: "",
  });

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.map((c: any) => ({
          id: c.id,
          name: c.name,
          segment: c.segment,
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: form.customerId,
          date: form.date,
          time: form.time,
          type: form.type,
          purpose: form.purpose,
          notes: form.notes,
          duration: parseInt(form.duration),
          nextVisit: form.nextVisit || null,
        }),
      });
      setSubmitted(true);
      setTimeout(() => router.push("/crm/visits"), 1500);
    } catch {
      alert("Error al agendar la visita");
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="rounded-xl border border-sand bg-white p-8 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-sage/10">
            <CheckCircle className="size-6 text-sage" />
          </div>
          <h2 className="text-lg font-semibold text-espresso">Visita agendada</h2>
          <p className="mt-1 text-sm text-espresso-light">Redirigiendo a la lista de visitas...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <MapPin className="size-5 text-teal-600" />
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "CRM", href: "/crm" }, { label: "Visitas", href: "/crm/visits" }, { label: "Nueva" }]} />
      </header>

      <div className="mx-auto max-w-2xl px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl border border-sand bg-white p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-espresso">
              <User className="size-4 text-teal-600" />
              Cliente
            </label>
            <select
              required
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: e.target.value })}
              className="w-full rounded-lg border border-sand bg-sand/30 px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
            >
              <option value="">Seleccionar cliente...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.segment.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-sand bg-white p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-espresso">
              <Calendar className="size-4 text-teal-600" />
              Fecha y hora
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="mb-1 text-xs text-espresso-light">Fecha</p>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full rounded-lg border border-sand bg-sand/30 px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
                />
              </div>
              <div>
                <p className="mb-1 text-xs text-espresso-light">Hora</p>
                <input
                  type="time"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full rounded-lg border border-sand bg-sand/30 px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
                />
              </div>
              <div>
                <p className="mb-1 text-xs text-espresso-light">Duración (min)</p>
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
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-espresso">
              <FileText className="size-4 text-teal-600" />
              Tipo de visita
            </label>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, type: opt.value })}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    form.type === opt.value
                      ? "bg-teal-600 text-white"
                      : "bg-sand/30 text-espresso-light hover:bg-sand"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-sand bg-white p-4">
            <label className="mb-2 text-sm font-semibold text-espresso">Propósito</label>
            <input
              type="text"
              required
              placeholder="Ej: Presentar propuesta de eventos..."
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              className="w-full rounded-lg border border-sand bg-sand/30 px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
            />
          </div>

          <div className="rounded-xl border border-sand bg-white p-4">
            <label className="mb-2 text-sm font-semibold text-espresso">Notas</label>
            <textarea
              rows={3}
              placeholder="Detalles adicionales, preparación necesaria..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-lg border border-sand bg-sand/30 px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 resize-none"
            />
          </div>

          <div className="rounded-xl border border-sand bg-white p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-espresso">
              <Clock className="size-4 text-teal-600" />
              Próxima visita (opcional)
            </label>
            <input
              type="date"
              value={form.nextVisit}
              onChange={(e) => setForm({ ...form, nextVisit: e.target.value })}
              className="w-full rounded-lg border border-sand bg-sand/30 px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/crm/visits"
              className="rounded-lg border border-sand bg-white px-4 py-2 text-sm font-medium text-espresso-light hover:bg-sand/30 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
            >
              Agendar visita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
