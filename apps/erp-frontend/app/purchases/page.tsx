"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Search,
  ArrowLeft,
  Plus,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";
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

const purchases: Purchase[] = [
  { id: "C-001", date: "2026-06-23", supplier: "Café Venezolano C.A.", items: 3, subtotal: 150.0, tax: 24.0, total: 174.0, status: "received", expectedDate: "2026-06-23" },
  { id: "C-002", date: "2026-06-22", supplier: "Distribuidora Central", items: 5, subtotal: 320.0, tax: 51.2, total: 371.2, status: "pending", expectedDate: "2026-06-25" },
  { id: "C-003", date: "2026-06-22", supplier: "Lácteos del Valle", items: 2, subtotal: 85.0, tax: 13.6, total: 98.6, status: "received", expectedDate: "2026-06-22" },
  { id: "C-004", date: "2026-06-21", supplier: "Panadería Industrial", items: 4, subtotal: 210.0, tax: 33.6, total: 243.6, status: "cancelled", expectedDate: "2026-06-24" },
  { id: "C-005", date: "2026-06-20", supplier: "Embotelladora Nacional", items: 6, subtotal: 450.0, tax: 72.0, total: 522.0, status: "received", expectedDate: "2026-06-20" },
  { id: "C-006", date: "2026-06-20", supplier: "Café Venezolano C.A.", items: 2, subtotal: 95.0, tax: 15.2, total: 110.2, status: "pending", expectedDate: "2026-06-27" },
  { id: "C-007", date: "2026-06-19", supplier: "Proveedora Total", items: 8, subtotal: 680.0, tax: 108.8, total: 788.8, status: "received", expectedDate: "2026-06-19" },
  { id: "C-008", date: "2026-06-18", supplier: "Distribuidora Central", items: 3, subtotal: 175.0, tax: 28.0, total: 203.0, status: "received", expectedDate: "2026-06-18" },
];

const statusConfig = {
  received: { label: "Recibida", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: Clock },
  cancelled: { label: "Cancelada", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function PurchasesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "received" | "pending" | "cancelled">("all");

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

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <ShoppingCart className="size-5 text-emerald-600" />
          <h1 className="text-lg font-semibold">Compras</h1>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
          <Plus className="size-4" />
          Nueva compra
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Órdenes pendientes</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-bold text-amber-600">{pendingOrders.length}</p>
              {pendingOrders.length > 0 && <Truck className="size-4 text-amber-500" />}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Por recibir</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">${totalPending.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Recibidas este mes</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">{receivedThisMonth}</p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Total gastado</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">${totalSpent.toFixed(2)}</p>
          </div>
        </div>

        {/* Search + filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por proveedor o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-300"
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
                    : "bg-white text-zinc-600 hover:bg-zinc-100 border"
                }`}
              >
                {status === "all" ? "Todas" : statusConfig[status].label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
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
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-zinc-400">
                    <FileText className="mx-auto mb-2 size-8" />
                    <p>No se encontraron compras</p>
                  </td>
                </tr>
              ) : (
                filtered.map((purchase) => {
                  const status = statusConfig[purchase.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={purchase.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-emerald-600">{purchase.id}</td>
                      <td className="px-4 py-3 text-zinc-500">{purchase.date}</td>
                      <td className="px-4 py-3 font-medium text-zinc-700">{purchase.supplier}</td>
                      <td className="px-4 py-3 text-right text-zinc-500">{purchase.items}</td>
                      <td className="px-4 py-3 text-right font-semibold text-zinc-900">${purchase.total.toFixed(2)}</td>
                      <td className="px-4 py-3 text-zinc-500">{purchase.expectedDate}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                          <StatusIcon className="size-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200 transition-colors">
                          <Eye className="size-3" />
                          Ver
                        </button>
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
