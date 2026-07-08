"use client";

import { useState, useEffect } from "react";
import {
  Factory,
  Search,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface ProductionOrder {
  id: string;
  compositeProductName: string;
  quantityPlanned: number;
  quantityProduced: number;
  scheduledDate: string;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  notes: string;
}

const statusConfig = {
  planned: { label: "Planificada", color: "bg-violet-600/10 text-violet-600", icon: Clock },
  in_progress: { label: "En Progreso", color: "bg-amber-100 text-amber-700", icon: PlayCircle },
  completed: { label: "Completada", color: "bg-sage/10 text-sage", icon: CheckCircle },
  cancelled: { label: "Cancelada", color: "bg-violet-600/10 text-violet-600", icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "planned" | "in_progress" | "completed" | "cancelled">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/manufacturing/orders?page=${page}&limit=20`)
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.data ?? []);
        setMeta(data?.meta ?? { total: items.length, totalPages: 1 });
        setOrders(items.map((o: any) => ({
          id: o.id,
          compositeProductName: o.compositeProductName || o.name || "",
          quantityPlanned: o.quantityPlanned || o.quantity || 0,
          quantityProduced: o.quantityProduced || 0,
          scheduledDate: o.scheduledDate ? new Date(o.scheduledDate).toISOString().split("T")[0] : "",
          status: o.status,
          notes: o.notes || "",
        })));
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [page]);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.compositeProductName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeOrders = orders.filter(
    (o) => o.status === "planned" || o.status === "in_progress"
  ).length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando órdenes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <p className="text-rose-600">Error al cargar datos</p>
        <button onClick={() => window.location.reload()} className="rounded-lg border border-sand bg-white px-4 py-2 text-sm font-medium text-espresso hover:bg-cream transition-colors">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <Factory className="size-5 text-violet-600" />
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Fabricación", href: "/manufacturing" }, { label: "Órdenes" }]} />
        </div>
        <Link href="/manufacturing/orders/new" className="flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors">
          <Plus className="size-4" />
          Nueva orden
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Activas</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-bold text-violet-600 font-mono">{activeOrders}</p>
              {activeOrders > 0 && <PlayCircle className="size-4 text-violet-600" />}
            </div>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Completadas</p>
            <p className="mt-1 text-2xl font-bold text-sage font-mono">{completedOrders}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Total</p>
            <p className="mt-1 text-2xl font-bold text-espresso font-mono">{orders.length}</p>
          </div>
        </div>

        {/* Search + filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso-light" />
            <input
              type="text"
              placeholder="Buscar por producto o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-sand bg-white py-2 pl-9 pr-3 text-sm text-espresso outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "planned", "in_progress", "completed", "cancelled"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-violet-600 text-white"
                    : "bg-white text-espresso border border-sand hover:bg-cream"
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
              <tr className="border-b border-sand bg-cream text-left text-xs font-medium text-espresso-light uppercase tracking-wider">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3 text-right">Planificada</th>
                <th className="px-4 py-3 text-right">Producida</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-espresso-light">
                    <Factory className="mx-auto mb-2 size-8" />
                    <p>No se encontraron órdenes</p>
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const status = statusConfig[order.status];
                  const StatusIcon = status.icon;
                  const progress =
                    order.quantityPlanned > 0
                      ? (order.quantityProduced / order.quantityPlanned) * 100
                      : 0;
                  return (
                    <tr key={order.id} className="hover:bg-cream transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-violet-600">
                        {order.id}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-espresso">{order.compositeProductName}</p>
                        {order.notes && (
                          <p className="text-xs text-espresso-light">{order.notes}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-espresso-light font-mono">
                        {order.quantityPlanned}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-mono ${order.quantityProduced < order.quantityPlanned ? "text-violet-600 font-semibold" : "text-espresso"}`}>
                          {order.quantityProduced}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-espresso-light">{order.scheduledDate}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                          <StatusIcon className="size-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/manufacturing/orders/${order.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-cream px-2 py-1 text-xs text-espresso border border-sand hover:bg-white transition-colors"
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

        {meta.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-espresso-light">
              Página {page} de {meta.totalPages} ({meta.total} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-sand bg-white px-3 py-1.5 text-xs font-medium text-espresso disabled:opacity-40 hover:bg-cream transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="rounded-lg border border-sand bg-white px-3 py-1.5 text-xs font-medium text-espresso disabled:opacity-40 hover:bg-cream transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
