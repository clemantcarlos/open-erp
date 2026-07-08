"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, Save, Trash2, ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import Link from "next/link";

interface Purchase {
  id: string;
  date: string;
  supplier: string;
  status: "received" | "pending" | "cancelled";
  expectedDate: string;
  items: any;
  subtotal: number;
  tax: number;
  total: number;
}

export default function PurchaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ supplier: "", status: "", expectedDate: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/purchases/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPurchase(data);
        setForm({
          supplier: data.supplier,
          status: data.status,
          expectedDate: data.expectedDate ? new Date(data.expectedDate).toISOString().split("T")[0] : "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/purchases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form }),
      });
      if (!res.ok) throw new Error("Error al guardar");
      const updated = await res.json();
      setPurchase(updated);
      window.alert("Compra actualizada");
    } catch {
      window.alert("Error al guardar la compra");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Eliminar esta compra?")) return;
    try {
      const res = await fetch(`/api/purchases?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      router.push("/purchases");
    } catch {
      window.alert("Error al eliminar la compra");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando compra...</p>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Compra no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <ShoppingCart className="size-5 text-emerald-600" />
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Compras", href: "/purchases" },
              { label: purchase.id.slice(0, 8) },
            ]}
          />
        </div>
        <Link
          href="/purchases"
          className="flex items-center gap-2 rounded-lg border border-sand px-3 py-2 text-sm font-medium text-espresso-light hover:bg-sand/50 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver
        </Link>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* Editable fields */}
        <div className="rounded-xl border border-sand bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-espresso">Editar compra</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-espresso-light mb-1">Proveedor</label>
              <input
                type="text"
                value={form.supplier}
                onChange={(e) => setForm((f) => ({ ...f, supplier: e.target.value }))}
                className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-espresso-light mb-1">Estado</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
              >
                <option value="received">Recibida</option>
                <option value="pending">Pendiente</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-espresso-light mb-1">Fecha esperada</label>
              <input
                type="date"
                value={form.expectedDate}
                onChange={(e) => setForm((f) => ({ ...f, expectedDate: e.target.value }))}
                className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <Save className="size-4" />
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-lg border border-terracotta/20 px-4 py-2 text-sm font-medium text-terracotta hover:bg-terracotta/5 transition-colors"
            >
              <Trash2 className="size-4" />
              Eliminar
            </button>
          </div>
        </div>

        {/* Read-only fields */}
        <div className="mt-4 rounded-xl border border-sand bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-espresso">Detalles</h2>
          <dl className="grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-xs text-espresso-light">Fecha</dt>
              <dd className="font-medium text-espresso">{new Date(purchase.date).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-xs text-espresso-light">ID</dt>
              <dd className="font-mono text-xs text-espresso">{purchase.id}</dd>
            </div>
            <div>
              <dt className="text-xs text-espresso-light">Subtotal</dt>
              <dd className="font-mono text-espresso">${Number(purchase.subtotal).toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-xs text-espresso-light">Impuesto</dt>
              <dd className="font-mono text-espresso">${Number(purchase.tax).toFixed(2)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-espresso-light">Total</dt>
              <dd className="text-lg font-bold font-mono text-terracotta">${Number(purchase.total).toFixed(2)}</dd>
            </div>
          </dl>
        </div>

        {/* Items */}
        <div className="mt-4 rounded-xl border border-sand bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-espresso">Artículos</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand bg-cream/50 text-xs font-medium text-espresso-light uppercase">
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2 text-right">Cantidad</th>
                <th className="px-4 py-2 text-right">Precio</th>
                <th className="px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {purchase.items.map((item: any, i: number) => (
                <tr key={i}>
                  <td className="px-4 py-2 font-medium">{item.name}</td>
                  <td className="px-4 py-2 text-right font-mono text-xs">{item.quantity}</td>
                  <td className="px-4 py-2 text-right font-mono text-xs">${Number(item.price).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right font-mono text-xs font-semibold">${Number(item.subtotal || item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
