"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Plus,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";

interface Purchase {
  id: string;
  date: string;
  supplier: string;
  items: number;
  subtotal: number;
  tax: number;
  total: number;
  status: "received" | "pending" | "cancelled";
  expectedDate: string;
}

const statusConfig = {
  received: { label: "Recibida", color: "bg-sage/10 text-sage", icon: CheckCircle },
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: Clock },
  cancelled: { label: "Cancelada", color: "bg-red-100 text-red-600", icon: XCircle },
};

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "received" | "pending" | "cancelled">("all");
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ supplier: "", items: [{ productId: "", quantity: 1, unitCost: 0 }] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/purchases")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.data ?? []);
        setPurchases(items.map((p: any) => ({
          id: p.id,
          date: new Date(p.date).toISOString().split("T")[0],
          supplier: p.supplier,
          items: Array.isArray(p.items) ? p.items.length : 0,
          subtotal: Number(p.subtotal),
          tax: Number(p.tax),
          total: Number(p.total),
          status: p.status,
          expectedDate: p.expectedDate ? new Date(p.expectedDate).toISOString().split("T")[0] : "",
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = purchases.filter((p) => {
    const matchesSearch =
      p.supplier.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingOrders = purchases.filter((p) => p.status === "pending");
  const totalPending = pendingOrders.reduce((sum, p) => sum + p.total, 0);
  const receivedThisMonth = purchases.filter((p) => p.status === "received").length;
  const totalSpent = purchases.filter((p) => p.status === "received").reduce((sum, p) => sum + p.total, 0);

  const handleCreate = async () => {
    if (!form.supplier) return;
    setSaving(true);
    const items = form.items.filter(i => i.productId);
    const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);
    const tax = subtotal * 0.13;
    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items, subtotal, tax, total: subtotal + tax, status: "pending" }),
      });
      if (res.ok) {
        const data = await res.json();
        setPurchases(prev => [{ ...data, date: new Date(data.date).toISOString().split("T")[0], items: Array.isArray(data.items) ? data.items.length : 0, expectedDate: data.expectedDate ? new Date(data.expectedDate).toISOString().split("T")[0] : "" }, ...prev]);
        setDrawerOpen(false);
        setForm({ supplier: "", items: [{ productId: "", quantity: 1, unitCost: 0 }] });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando compras...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <ShoppingCart className="size-5 text-emerald-600" />
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Compras" }]} />
        </div>
        <button onClick={() => setDrawerOpen(true)} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
          <Plus className="size-4" />
          Nueva compra
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Órdenes pendientes</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-bold font-mono text-amber-600">{pendingOrders.length}</p>
              {pendingOrders.length > 0 && <Truck className="size-4 text-amber-500" />}
            </div>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Por recibir</p>
            <p className="mt-1 text-2xl font-bold font-mono text-espresso">{formatCurrency(totalPending)}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Recibidas este mes</p>
            <p className="mt-1 text-2xl font-bold font-mono text-sage">{receivedThisMonth}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Total gastado</p>
            <p className="mt-1 text-2xl font-bold font-mono text-espresso">{formatCurrency(totalSpent)}</p>
          </div>
        </div>

        {/* Search + filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso-light" />
            <input
              type="text"
              placeholder="Buscar por proveedor o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-sand bg-sand/30 py-2 pl-9 pr-3 text-sm text-espresso outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "received", "pending", "cancelled"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-emerald-600 text-white"
                    : "bg-sand/50 text-espresso-light hover:bg-sand border border-sand"
                }`}
              >
                {status === "all" ? "Todas" : statusConfig[status].label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-sand bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand bg-cream/50 text-left text-xs font-medium text-espresso-light uppercase tracking-wider">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Proveedor</th>
                <th className="px-4 py-3 text-right">Artículos</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Entrega</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-espresso-light">
                    <FileText className="mx-auto mb-2 size-8" />
                    <p>No se encontraron compras</p>
                  </td>
                </tr>
              ) : (
                filtered.map((purchase) => {
                  const status = statusConfig[purchase.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={purchase.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-emerald-600">{purchase.id.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-espresso-light">{purchase.date}</td>
                      <td className="px-4 py-3 font-medium text-espresso">{purchase.supplier}</td>
                      <td className="px-4 py-3 text-right text-espresso-light">{purchase.items}</td>
                      <td className="px-4 py-3 text-right font-semibold font-mono text-espresso">{formatCurrency(purchase.total)}</td>
                      <td className="px-4 py-3 text-espresso-light">{purchase.expectedDate}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                          <StatusIcon className="size-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/purchases/${purchase.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-sand/50 px-2 py-1 text-xs text-espresso-light hover:bg-sand transition-colors"
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

      {/* Create purchase drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-espresso/30 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-cream shadow-xl overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-sand bg-cream px-6 py-4">
              <h2 className="font-display text-lg text-espresso">Nueva compra</h2>
              <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-lg p-1.5 text-espresso-light hover:bg-sand/30 transition-colors">
                <XCircle className="size-5" />
              </button>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso-light">Proveedor *</label>
                <input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-emerald-400" placeholder="Nombre del proveedor" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-espresso-light">ID del producto</label>
                <input value={form.items[0].productId} onChange={(e) => setForm({ ...form, items: [{ ...form.items[0], productId: e.target.value }] })} className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-emerald-400" placeholder="UUID del producto" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-espresso-light">Cantidad</label>
                  <input type="number" min="1" value={form.items[0].quantity} onChange={(e) => setForm({ ...form, items: [{ ...form.items[0], quantity: Number(e.target.value) }] })} className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-emerald-400" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-espresso-light">Costo unitario</label>
                  <input type="number" min="0" step="0.01" value={form.items[0].unitCost} onChange={(e) => setForm({ ...form, items: [{ ...form.items[0], unitCost: Number(e.target.value) }] })} className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-emerald-400" />
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 flex gap-3 border-t border-sand bg-cream px-6 py-4">
              <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-lg border border-sand px-4 py-2.5 text-sm font-medium text-espresso-light hover:bg-sand/30 transition-colors">Cancelar</button>
              <button onClick={handleCreate} disabled={saving || !form.supplier} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50">{saving ? "Guardando..." : "Crear compra"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
