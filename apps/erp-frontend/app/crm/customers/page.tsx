"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Plus,
  Star,
  Phone,
  Mail,
  X,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: "regular" | "vip" | "new" | "inactive";
  totalSpent: number;
  visits: number;
}

const segmentConfig = {
  vip: { label: "VIP", color: "bg-amber-100 text-amber-700" },
  regular: { label: "Regular", color: "bg-sage/20 text-sage" },
  new: { label: "Nuevo", color: "bg-teal-600/10 text-teal-600" },
  inactive: { label: "Inactivo", color: "bg-sand text-espresso-light" },
};

const segments = ["all", "vip", "regular", "new", "inactive"] as const;

function getInitials(name: string): string {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

const avatarColors = [
  "bg-sage/20 text-sage",
  "bg-amber-100 text-amber-700",
  "bg-teal-600/10 text-teal-600",
  "bg-sand text-espresso",
  "bg-teal-600/20 text-teal-600",
  "bg-sand text-espresso-light",
  "bg-amber-100 text-amber-600",
];

function getAvatarColor(id: string): string {
  const index = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % avatarColors.length;
  return avatarColors[index];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<(typeof segments)[number]>("all");
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", segment: "regular" as Customer["segment"] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.map((c: any) => ({
          id: c.id,
          name: c.name,
          email: c.email || "",
          phone: c.phone || "",
          segment: c.segment,
          totalSpent: 0,
          visits: 0,
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchesSegment = segmentFilter === "all" || c.segment === segmentFilter;
    return matchesSearch && matchesSegment;
  });

  const handleCreate = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(prev => [{ ...data, totalSpent: 0, visits: 0 }, ...prev]);
        setDrawerOpen(false);
        setForm({ name: "", email: "", phone: "", segment: "regular" });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 px-6 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Users className="size-5 text-teal-600" />
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "CRM", href: "/crm" }, { label: "Clientes" }]} />
        </div>
        <button onClick={() => setDrawerOpen(true)} className="flex items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-colors">
          <Plus className="size-4" />
          Nuevo cliente
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Search + filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso-light" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-sand bg-sand/30 py-2 pl-9 pr-3 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
            />
          </div>
          <div className="flex gap-1">
            {segments.map((seg) => (
              <button
                key={seg}
                onClick={() => setSegmentFilter(seg)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  segmentFilter === seg
                    ? "bg-teal-600 text-white"
                    : "bg-sand/50 text-espresso-light hover:bg-sand border border-sand"
                }`}
              >
                {seg === "all" ? "Todos" : segmentConfig[seg].label}
              </button>
            ))}
          </div>
        </div>

        {/* Customer grid */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-sand bg-white px-4 py-12 text-center text-espresso-light">
            <Users className="mx-auto mb-2 size-8" />
            <p>No se encontraron clientes</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((customer) => {
              const segment = segmentConfig[customer.segment];
              return (
                <Link
                  key={customer.id}
                  href={`/crm/customers/${customer.id}`}
                  className="group rounded-xl border border-sand bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-sage/30"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-10 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(customer.id)}`}
                      >
                        {getInitials(customer.name)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-espresso group-hover:text-sage transition-colors">
                          {customer.name}
                        </h3>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${segment.color}`}>
                          {segment.label}
                        </span>
                      </div>
                    </div>
                    {customer.segment === "vip" && (
                      <Star className="size-4 text-amber-400 fill-amber-400" />
                    )}
                  </div>

                  <div className="space-y-1.5 text-sm text-espresso-light">
                    <div className="flex items-center gap-2">
                      <Mail className="size-3.5 text-espresso-light" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5 text-espresso-light" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-sand pt-3">
                    <span className="text-xs text-espresso-light">{customer.visits} visitas</span>
                    <span className="text-sm font-semibold text-sage font-mono">
                      ${customer.totalSpent.toLocaleString()}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Create customer drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-espresso/30 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-cream shadow-xl overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-sand bg-cream px-6 py-4">
              <h2 className="font-display text-lg text-espresso">Nuevo cliente</h2>
              <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-lg p-1.5 text-espresso-light hover:bg-sand/30 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso-light">Nombre *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400" placeholder="Nombre completo" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso-light">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400" placeholder="correo@ejemplo.com" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso-light">Teléfono</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400" placeholder="+58 412 1234567" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso-light">Segmento</label>
                <select value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value as Customer["segment"] })} className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400">
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                  <option value="new">Nuevo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>
            <div className="sticky bottom-0 flex gap-3 border-t border-sand bg-cream px-6 py-4">
              <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-lg border border-sand px-4 py-2.5 text-sm font-medium text-espresso-light hover:bg-sand/30 transition-colors">Cancelar</button>
              <button onClick={handleCreate} disabled={saving || !form.name} className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors disabled:opacity-50">{saving ? "Guardando..." : "Crear cliente"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
