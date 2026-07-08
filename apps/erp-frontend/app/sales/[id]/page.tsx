"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TrendingUp, Save, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface SaleItem {
  name: string;
  quantity: number;
  price: number;
}

interface Sale {
  id: string;
  date: string;
  customer: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "paid" | "pending" | "cancelled";
  paymentMethod: "cash" | "card" | "transfer";
}

export default function SaleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState("");
  const [status, setStatus] = useState<"paid" | "pending" | "cancelled">("paid");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash");

  useEffect(() => {
    fetch(`/api/sales/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSale(data);
        setCustomer(data.customer || "");
        setStatus(data.status);
        setPaymentMethod(data.paymentMethod);
        setLoading(false);
      })
      .catch(() => {
        window.alert("Error al cargar la venta");
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/sales", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, customer, status, paymentMethod }),
      });
      if (!res.ok) throw new Error();
      window.alert("Venta actualizada");
    } catch {
      window.alert("Error al guardar");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Eliminar esta venta?")) return;
    try {
      const res = await fetch(`/api/sales?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      window.alert("Venta eliminada");
      router.push("/sales");
    } catch {
      window.alert("Error al eliminar");
    }
  };

  if (loading || !sale) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando venta...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <TrendingUp className="size-5 text-purple-600" />
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Ventas", href: "/sales" },
              { label: sale.id.slice(0, 8) },
            ]}
          />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/sales"
            className="flex items-center gap-2 rounded-lg border border-sand bg-white px-3 py-2 text-sm font-medium text-espresso-light hover:bg-sand/30 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Volver
          </Link>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
          >
            <Save className="size-4" />
            Guardar
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg border border-terracotta/20 bg-white px-3 py-2 text-sm font-medium text-terracotta hover:bg-terracotta/5 transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-6 space-y-6">
        {/* Editable fields */}
        <div className="rounded-xl border border-sand bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-espresso-light uppercase tracking-wider">
            Editar Venta
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs text-espresso-light mb-1">Cliente</label>
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
              />
            </div>
            <div>
              <label className="block text-xs text-espresso-light mb-1">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
              >
                <option value="paid">Pagada</option>
                <option value="pending">Pendiente</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-espresso-light mb-1">Método de pago</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
              >
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
                <option value="transfer">Transferencia</option>
              </select>
            </div>
          </div>
        </div>

        {/* Read-only fields */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Fecha</p>
            <p className="mt-1 font-mono text-lg font-medium text-espresso">
              {new Date(sale.date).toLocaleDateString("es-MX")}
            </p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Subtotal</p>
            <p className="mt-1 font-mono text-lg font-medium text-espresso">${sale.subtotal.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Impuesto</p>
            <p className="mt-1 font-mono text-lg font-medium text-espresso">${sale.tax.toFixed(2)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-sand bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-espresso-light">Total</p>
            <p className="font-mono text-2xl font-bold text-purple-600">${sale.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Items */}
        <div className="rounded-xl border border-sand bg-white">
          <div className="border-b border-sand px-4 py-3">
            <h2 className="text-sm font-semibold text-espresso">Artículos</h2>
          </div>
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
              {sale.items.map((item, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 font-medium">{item.name}</td>
                  <td className="px-4 py-2 text-right font-mono text-xs">{item.quantity}</td>
                  <td className="px-4 py-2 text-right font-mono text-xs">${Number(item.price).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right font-mono text-xs font-semibold">${Number(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
