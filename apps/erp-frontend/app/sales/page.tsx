"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Search,
  Plus,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { formatCurrency } from "@/lib/format";
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

const statusConfig = {
  paid: { label: "Pagada", color: "bg-sage/10 text-sage", icon: CheckCircle },
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: Clock },
  cancelled: { label: "Cancelada", color: "bg-terracotta/10 text-terracotta", icon: XCircle },
};

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending" | "cancelled">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sales")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.data ?? []);
        setSales(items.map((s: any) => ({
          id: s.id,
          date: new Date(s.date).toISOString().split("T")[0],
          customer: s.customer || "Cliente general",
          items: Array.isArray(s.items) ? s.items.length : 0,
          subtotal: Number(s.subtotal),
          tax: Number(s.tax),
          total: Number(s.total),
          status: s.status,
          paymentMethod: s.paymentMethod,
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = sales.filter((s) => {
    const matchesSearch =
      s.customer.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const todaySales = sales.filter((s) => s.date === new Date().toISOString().split("T")[0] && s.status === "paid");
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const pendingCount = sales.filter((s) => s.status === "pending").length;
  const monthlyRevenue = sales.filter((s) => s.status === "paid").reduce((sum, s) => sum + s.total, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando ventas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <TrendingUp className="size-5 text-purple-600" />
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Ventas" }]} />
        </div>
        <Link href="/pos" className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors">
          <Plus className="size-4" />
          Nueva venta
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Ventas hoy</p>
            <p className="mt-1 font-mono text-2xl font-bold text-espresso">{todaySales.length}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Ingreso hoy</p>
            <p className="mt-1 font-mono text-2xl font-bold text-purple-600">{formatCurrency(todayRevenue)}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Pendientes</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="font-mono text-2xl font-bold text-amber-700">{pendingCount}</p>
              {pendingCount > 0 && <Clock className="size-4 text-amber-500" />}
            </div>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Ingreso mensual</p>
            <p className="mt-1 font-mono text-2xl font-bold text-espresso">{formatCurrency(monthlyRevenue)}</p>
          </div>
        </div>

        {/* Search + filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso-light" />
            <input
              type="text"
              placeholder="Buscar por cliente o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-sand bg-sand/30 py-2 pl-9 pr-3 text-sm text-espresso outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
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
                    : "bg-sand/30 text-espresso-light hover:bg-sand/50"
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
              <tr className="border-b border-sand bg-sand/10 text-left text-xs font-medium text-espresso-light uppercase tracking-wider">
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
            <tbody className="divide-y divide-sand">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-espresso-light">
                    <FileText className="mx-auto mb-2 size-8" />
                    <p>No se encontraron ventas</p>
                  </td>
                </tr>
              ) : (
                filtered.map((sale) => {
                  const status = statusConfig[sale.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={sale.id} className="hover:bg-sand/5 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-purple-600">{sale.id.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-espresso-light">{sale.date}</td>
                      <td className="px-4 py-3 font-medium text-espresso">{sale.customer}</td>
                      <td className="px-4 py-3 text-right text-espresso-light">{sale.items}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-espresso">{formatCurrency(sale.total)}</td>
                      <td className="px-4 py-3 text-espresso-light">{sale.paymentMethod}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                          <StatusIcon className="size-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/sales/${sale.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-sand/30 px-2 py-1 text-xs text-espresso-light hover:bg-sand/50 transition-colors"
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
