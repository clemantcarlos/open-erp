"use client";

import { useState } from "react";
import {
  TrendingUp,
  Search,
  ArrowLeft,
  Plus,
  Eye,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

interface Sale {
  id: string;
  date: string;
  customer: string;
  items: number;
  subtotal: number;
  tax: number;
  total: number;
  status: "paid" | "pending" | "cancelled";
  paymentMethod: string;
}

const sales: Sale[] = [
  { id: "V-001", date: "2026-06-23", customer: "María García", items: 3, subtotal: 25.0, tax: 4.0, total: 29.0, status: "paid", paymentMethod: "Efectivo" },
  { id: "V-002", date: "2026-0023", customer: "Carlos López", items: 1, subtotal: 8.5, tax: 1.36, total: 9.86, status: "paid", paymentMethod: "Tarjeta" },
  { id: "V-003", date: "2026-06-23", customer: "Ana Martínez", items: 5, subtotal: 42.0, tax: 6.72, total: 48.72, status: "pending", paymentMethod: "PagoMóvil" },
  { id: "V-004", date: "2026-06-22", customer: "Pedro Sánchez", items: 2, subtotal: 15.0, tax: 2.4, total: 17.4, status: "paid", paymentMethod: "Efectivo" },
  { id: "V-005", date: "2026-06-22", customer: "Laura Rodríguez", items: 4, subtotal: 33.5, tax: 5.36, total: 38.86, status: "cancelled", paymentMethod: "Tarjeta" },
  { id: "V-006", date: "2026-06-22", customer: "Jorge Hernández", items: 1, subtotal: 5.5, tax: 0.88, total: 6.38, status: "paid", paymentMethod: "Efectivo" },
  { id: "V-007", date: "2026-06-21", customer: "Carmen Díaz", items: 6, subtotal: 58.0, tax: 9.28, total: 67.28, status: "paid", paymentMethod: "PagoMóvil" },
  { id: "V-008", date: "2026-06-21", customer: "Roberto Torres", items: 2, subtotal: 12.0, tax: 1.92, total: 13.92, status: "pending", paymentMethod: "Tarjeta" },
  { id: "V-009", date: "2026-06-20", customer: "Isabel Flores", items: 3, subtotal: 28.5, tax: 4.56, total: 33.06, status: "paid", paymentMethod: "Efectivo" },
  { id: "V-010", date: "2026-06-20", customer: "Miguel Ángel Reyes", items: 1, subtotal: 7.0, tax: 1.12, total: 8.12, status: "paid", paymentMethod: "Tarjeta" },
];

const statusConfig = {
  paid: { label: "Pagada", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: Clock },
  cancelled: { label: "Cancelada", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function SalesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending" | "cancelled">("all");

  const filtered = sales.filter((s) => {
    const matchesSearch =
      s.customer.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const todaySales = sales.filter((s) => s.date === "2026-06-23" && s.status === "paid");
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const pendingCount = sales.filter((s) => s.status === "pending").length;
  const monthlyRevenue = sales.filter((s) => s.status === "paid").reduce((sum, s) => sum + s.total, 0);

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
          <TrendingUp className="size-5 text-purple-600" />
          <h1 className="text-lg font-semibold">Ventas</h1>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors">
          <Plus className="size-4" />
          Nueva venta
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Ventas hoy</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">{todaySales.length}</p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Ingreso hoy</p>
            <p className="mt-1 text-2xl font-bold text-purple-600">${todayRevenue.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Pendientes</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
              {pendingCount > 0 && <Clock className="size-4 text-amber-500" />}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Ingreso mensual</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">${monthlyRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Search + filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por cliente o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-300"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "paid", "pending", "cancelled"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-purple-600 text-white"
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
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3 text-right">Artículos</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Método</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-zinc-400">
                    <FileText className="mx-auto mb-2 size-8" />
                    <p>No se encontraron ventas</p>
                  </td>
                </tr>
              ) : (
                filtered.map((sale) => {
                  const status = statusConfig[sale.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={sale.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-purple-600">{sale.id}</td>
                      <td className="px-4 py-3 text-zinc-500">{sale.date}</td>
                      <td className="px-4 py-3 font-medium text-zinc-700">{sale.customer}</td>
                      <td className="px-4 py-3 text-right text-zinc-500">{sale.items}</td>
                      <td className="px-4 py-3 text-right font-semibold text-zinc-900">${sale.total.toFixed(2)}</td>
                      <td className="px-4 py-3 text-zinc-500">{sale.paymentMethod}</td>
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
