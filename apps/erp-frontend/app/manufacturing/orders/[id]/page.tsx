"use client";

import { useState, useEffect } from "react";
import {
  Factory,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  ArrowLeft,
  Pencil,
  Trash2,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface ProductionOrder {
  id: string;
  compositeProductId: string;
  compositeProductName: string;
  quantityPlanned: number;
  quantityProduced: number;
  scheduledDate: string;
  completedDate: string | null;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  notes: string;
}

const statusConfig = {
  planned: { label: "Planificada", color: "bg-violet-600/10 text-violet-600", icon: Clock },
  in_progress: { label: "En Progreso", color: "bg-amber-100 text-amber-700", icon: PlayCircle },
  completed: { label: "Completada", color: "bg-sage/10 text-sage", icon: CheckCircle },
  cancelled: { label: "Cancelada", color: "bg-violet-600/10 text-violet-600", icon: XCircle },
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [order, setOrder] = useState<ProductionOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ quantityPlanned: 1, scheduledDate: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/manufacturing/orders/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setOrder(data);
          setLoading(false);
        })
        .catch(() => { setError(true); setLoading(false); });
    });
  }, [params]);

  const openEdit = () => {
    if (!order) return;
    setEditForm({
      quantityPlanned: order.quantityPlanned,
      scheduledDate: order.scheduledDate,
      notes: order.notes || "",
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!order) return;
    setSaving(true);
    setActionError("");
    try {
      const res = await fetch(`/api/manufacturing/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Error al guardar");
      const updated = await res.json();
      setOrder(updated);
      setEditing(false);
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const patchStatus = async (status: string, extra?: Record<string, any>) => {
    if (!order) return;
    setActionError("");
    try {
      const res = await fetch(`/api/manufacturing/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...extra }),
      });
      if (!res.ok) throw new Error("Error al cambiar estado");
      const updated = await res.json();
      setOrder(updated);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const deleteOrder = async () => {
    if (!order || !confirm("¿Eliminar esta orden?")) return;
    setActionError("");
    try {
      const res = await fetch(`/api/manufacturing/orders/${order.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      router.push("/manufacturing/orders");
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando orden...</p>
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

  if (!order) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Orden no encontrada</p>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  const progress = order.quantityPlanned > 0 ? (order.quantityProduced / order.quantityPlanned) * 100 : 0;

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/manufacturing/orders" className="rounded-lg p-1.5 hover:bg-sand/50 transition-colors">
            <ArrowLeft className="size-5 text-espresso" />
          </Link>
          <Factory className="size-5 text-violet-600" />
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Fabricación", href: "/manufacturing" },
              { label: "Órdenes", href: "/manufacturing/orders" },
              { label: order.id.slice(0, 8) },
            ]}
          />
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}>
          <StatusIcon className="size-3" />
          {status.label}
        </span>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-6">
        {actionError && <p className="mb-4 text-sm text-red-600">{actionError}</p>}

        {/* Action buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={openEdit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-sand bg-white px-3 py-2 text-sm font-medium text-espresso hover:bg-cream transition-colors"
          >
            <Pencil className="size-3.5" />
            Editar
          </button>

          {order.status === "planned" && (
            <button
              onClick={() => patchStatus("in_progress")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
            >
              <PlayCircle className="size-3.5" />
              Iniciar
            </button>
          )}

          {order.status === "in_progress" && (
            <button
              onClick={() => patchStatus("completed", { completedDate: new Date().toISOString() })}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sage px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-colors"
            >
              <CheckCircle className="size-3.5" />
              Completar
            </button>
          )}

          {(order.status === "planned" || order.status === "in_progress") && (
            <button
              onClick={() => patchStatus("cancelled")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sand bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <XCircle className="size-3.5" />
              Cancelar
            </button>
          )}

          <button
            onClick={deleteOrder}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-sand bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="size-3.5" />
            Eliminar
          </button>
        </div>

        {/* Order info */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Producto</p>
            <Link
              href={`/manufacturing/${order.compositeProductId}`}
              className="mt-1 flex items-center gap-1 text-sm font-semibold text-violet-600 hover:underline"
            >
              {order.compositeProductName}
              <LinkIcon className="size-3" />
            </Link>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Planificada</p>
            <p className="mt-1 text-2xl font-bold text-espresso font-mono">{order.quantityPlanned}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Producida</p>
            <p className="mt-1 text-2xl font-bold text-violet-600 font-mono">{order.quantityProduced}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Fecha programada</p>
            <p className="mt-1 text-sm font-semibold text-espresso">{order.scheduledDate}</p>
            {order.completedDate && (
              <p className="text-[10px] text-sage">Completada: {order.completedDate}</p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {order.status !== "cancelled" && (
          <div className="mb-6 rounded-xl border border-sand bg-white p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-espresso-light">Progreso de producción</span>
              <span className="font-semibold text-espresso font-mono">{progress.toFixed(0)}%</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-cream">
              <div
                className={`h-full rounded-full transition-all ${order.status === "completed" ? "bg-sage" : "bg-violet-600"}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className="rounded-xl border border-sand bg-white p-4">
            <h2 className="mb-2 text-sm font-semibold text-espresso-light uppercase tracking-wider">Notas</h2>
            <p className="text-sm text-espresso">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Edit drawer */}
      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setEditing(false)} />
          <div className="relative ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-sand px-5 py-4">
              <h2 className="text-lg font-semibold text-espresso">Editar orden</h2>
              <button onClick={() => setEditing(false)} className="rounded-lg p-1.5 hover:bg-cream transition-colors">
                <XCircle className="size-5 text-espresso-light" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-espresso mb-1">Cantidad planificada</label>
                <input
                  type="number"
                  min={1}
                  value={editForm.quantityPlanned}
                  onChange={(e) => setEditForm({ ...editForm, quantityPlanned: parseInt(e.target.value) || 1 })}
                  className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-espresso mb-1">Fecha programada</label>
                <input
                  type="date"
                  value={editForm.scheduledDate}
                  onChange={(e) => setEditForm({ ...editForm, scheduledDate: e.target.value })}
                  className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-espresso mb-1">Notas</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-sand px-5 py-4">
              <button
                onClick={() => setEditing(false)}
                className="rounded-lg border border-sand bg-white px-4 py-2 text-sm font-medium text-espresso hover:bg-cream transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
