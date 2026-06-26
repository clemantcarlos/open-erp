"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Users, Save, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

const SEGMENTS = ["regular", "vip", "new", "inactive"] as const;

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: string;
  address: string;
  notes: string;
  createdAt: string;
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [segment, setSegment] = useState("regular");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data: Customer) => {
        setCustomer(data);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setSegment(data.segment);
        setAddress(data.address);
        setNotes(data.notes);
      })
      .catch(() => window.alert("Error al cargar el cliente"))
      .finally(() => setLoading(false));
  }, [id]);

  function handleSave() {
    setSaving(true);
    fetch("/api/customers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, email, phone, segment, address, notes }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("save failed");
        window.alert("Cliente guardado");
      })
      .catch(() => window.alert("Error al guardar el cliente"))
      .finally(() => setSaving(false));
  }

  function handleDelete() {
    if (!window.confirm("Eliminar este cliente?")) return;
    fetch(`/api/customers?id=${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("delete failed");
        router.push("/crm/customers");
      })
      .catch(() => window.alert("Error al eliminar el cliente"));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Users className="size-8 text-sand animate-pulse" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <p className="text-espresso-light">Cliente no encontrado</p>
        <Link href="/crm/customers" className="text-sm text-teal-600 hover:underline">
          Volver a clientes
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-sand bg-cream/80 px-6 py-3 backdrop-blur-sm">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "CRM", href: "/crm" },
            { label: "Clientes", href: "/crm/customers" },
            { label: customer.name },
          ]}
        />
      </header>

      <div className="mx-auto max-w-3xl px-6 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/crm/customers"
            className="flex size-9 items-center justify-center rounded-lg border border-sand bg-white text-espresso-light hover:bg-cream"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <h1 className="font-display text-lg text-espresso">{customer.name}</h1>
        </div>

        {/* Read-only fields */}
        <div className="rounded-xl border border-sand bg-white p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-espresso-light">ID</p>
              <p className="font-mono font-medium text-espresso">{customer.id}</p>
            </div>
            <div>
              <p className="text-xs text-espresso-light">Creado</p>
              <p className="font-medium text-espresso">{customer.createdAt}</p>
            </div>
          </div>
        </div>

        {/* Editable form */}
        <div className="rounded-xl border border-sand bg-white p-5 space-y-4">
          <div>
            <label className="block text-xs text-espresso-light mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
            />
          </div>
          <div>
            <label className="block text-xs text-espresso-light mb-1">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
            />
          </div>
          <div>
            <label className="block text-xs text-espresso-light mb-1">Telefono</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
            />
          </div>
          <div>
            <label className="block text-xs text-espresso-light mb-1">Segmento</label>
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
            >
              {SEGMENTS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-espresso-light mb-1">Direccion</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30"
            />
          </div>
          <div>
            <label className="block text-xs text-espresso-light mb-1">Notas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/30 resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
          >
            <Save className="size-4" />
            {saving ? "Guardando..." : "Guardar"}
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg border border-terracotta/20 bg-white px-4 py-2 text-sm font-medium text-terracotta hover:bg-terracotta/5"
          >
            <Trash2 className="size-4" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
