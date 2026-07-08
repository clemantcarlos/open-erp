"use client";

import { useState, useEffect } from "react";
import {
  Factory,
  Package,
  Wrench,
  Clock,
  Edit3,
  Trash2,
  PlusCircle,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface BOMItem {
  ingredientId?: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  unitCost: number;
}

interface RoutingStep {
  processStepId?: string;
  processName: string;
  timeMinutes: number;
  costPerUnit: number;
}

interface CompositeProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  salePrice: number;
  emoji: string;
  bom: BOMItem[];
  routing: RoutingStep[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [product, setProduct] = useState<CompositeProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", sku: "", category: "Restaurante", unit: "unid", salePrice: "", emoji: "📦", bom: "[]", routing: "[]" });
  const [productId, setProductId] = useState("");

  useEffect(() => {
    params.then(({ id }) => {
      setProductId(id);
      fetch(`/api/manufacturing/composite-products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct({ ...data, salePrice: Number(data.salePrice) });
          setForm({
            name: data.name ?? "",
            sku: data.sku ?? "",
            category: data.category ?? "Restaurante",
            unit: data.unit ?? "unid",
            salePrice: String(data.salePrice ?? ""),
            emoji: data.emoji ?? "📦",
            bom: JSON.stringify(data.bom ?? [], null, 2),
            routing: JSON.stringify(data.routing ?? [], null, 2),
          });
          setLoading(false);
        })
        .catch(() => { setError(true); setLoading(false); });
    });
  }, [params]);

  function openEdit() {
    if (!product) return;
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      unit: product.unit,
      salePrice: String(product.salePrice),
      emoji: product.emoji,
      bom: JSON.stringify(product.bom, null, 2),
      routing: JSON.stringify(product.routing, null, 2),
    });
    setDrawerOpen(true);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const bom = JSON.parse(form.bom);
      const routing = JSON.parse(form.routing);
      if (!Array.isArray(bom) || !Array.isArray(routing)) throw new Error();
      const res = await fetch(`/api/manufacturing/composite-products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, sku: form.sku, category: form.category,
          unit: form.unit, salePrice: Number(form.salePrice),
          emoji: form.emoji, bom, routing,
        }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setProduct({
        ...updated,
        bom: Array.isArray(updated.bom) ? updated.bom : [],
        routing: Array.isArray(updated.routing) ? updated.routing : [],
      });
      setDrawerOpen(false);
    } catch {
      window.alert("Error al actualizar. Verifica que bom y routing sean JSON válido.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("¿Eliminar este producto compuesto? Esta acción no se puede deshacer.")) return;
    try {
      const res = await fetch(`/api/manufacturing/composite-products/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/manufacturing");
    } catch {
      window.alert("Error al eliminar producto.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando producto...</p>
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

  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Producto no encontrado</p>
      </div>
    );
  }

  const materialCost = (product.bom || []).reduce((sum, e) => sum + e.quantity * e.unitCost, 0);
  const processCost = (product.routing || []).reduce((sum, s) => sum + s.costPerUnit, 0);
  const unitCost = materialCost + processCost;
  const margin = product.salePrice - unitCost;
  const marginPercent = product.salePrice > 0 ? ((margin / product.salePrice) * 100).toFixed(0) : "0";
  const totalTime = (product.routing || []).reduce((sum, s) => sum + s.timeMinutes, 0);

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <Factory className="size-5 text-violet-600" />
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Fabricación", href: "/manufacturing" },
              { label: product.name },
            ]}
          />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/manufacturing/orders/new?productId=${productId}&productName=${encodeURIComponent(product.name)}`}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
          >
            <PlusCircle className="size-4" />
            Crear orden
          </Link>
          <button onClick={openEdit} className="flex items-center gap-2 rounded-lg border border-sand bg-white px-3 py-2 text-sm font-medium text-espresso hover:bg-cream transition-colors">
            <Edit3 className="size-4" />
            Editar
          </button>
          <button onClick={handleDelete} className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 className="size-4" />
            Eliminar
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* Product header */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-4xl">{product.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-espresso">{product.name}</h1>
            <p className="text-sm text-espresso-light font-mono">{product.sku} · {product.category} · {product.unit}</p>
          </div>
        </div>

        {/* Cost summary card */}
        <div className="mb-6 rounded-xl border border-sand bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-espresso-light uppercase tracking-wider">
            Resumen de Costos
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div>
              <p className="text-xs text-espresso-light">Materiales</p>
              <p className="text-xl font-bold text-espresso font-mono">${materialCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-espresso-light">Procesos</p>
              <p className="text-xl font-bold text-espresso font-mono">${processCost.toFixed(2)}</p>
            </div>
            <div className="border-l border-sand pl-4">
              <p className="text-xs text-espresso-light">Costo Unitario</p>
              <p className="text-xl font-bold text-violet-600 font-mono">${unitCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-espresso-light">Precio Venta</p>
              <p className="text-xl font-bold text-espresso font-mono">${product.salePrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-espresso-light">Margen</p>
              <p className={`text-xl font-bold font-mono ${margin > 0 ? "text-sage" : "text-violet-600"}`}>
                ${margin.toFixed(2)}
              </p>
              <p className="text-[10px] text-espresso-light">{marginPercent}%</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* BOM */}
          <div className="rounded-xl border border-sand bg-white">
            <div className="flex items-center gap-2 border-b border-sand px-4 py-3">
              <Package className="size-4 text-violet-600" />
              <h2 className="text-sm font-semibold text-espresso">Lista de Materiales (BOM)</h2>
              <span className="ml-auto text-xs text-espresso-light font-mono">
                {(product.bom || []).length} ingredientes
              </span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand bg-cream text-left text-xs text-espresso-light">
                  <th className="px-4 py-2">Ingrediente</th>
                  <th className="px-4 py-2 text-right">Cant.</th>
                  <th className="px-4 py-2 text-right">Costo/U</th>
                  <th className="px-4 py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {(product.bom || []).map((entry, i) => (
                  <tr key={i} className="hover:bg-cream transition-colors">
                    <td className="px-4 py-2 font-medium text-espresso">{entry.ingredientName}</td>
                    <td className="px-4 py-2 text-right text-espresso-light">{entry.quantity} {entry.unit}</td>
                    <td className="px-4 py-2 text-right text-espresso-light font-mono">${entry.unitCost.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right font-semibold text-espresso font-mono">${(entry.quantity * entry.unitCost).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-sand bg-cream font-semibold">
                  <td className="px-4 py-2" colSpan={3}>Total Materiales</td>
                  <td className="px-4 py-2 text-right text-violet-600 font-mono">${materialCost.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Routing */}
          <div className="rounded-xl border border-sand bg-white">
            <div className="flex items-center gap-2 border-b border-sand px-4 py-3">
              <Wrench className="size-4 text-violet-600" />
              <h2 className="text-sm font-semibold text-espresso">Routing de Producción</h2>
              <span className="ml-auto flex items-center gap-1 text-xs text-espresso-light font-mono">
                <Clock className="size-3" />
                {totalTime} min total
              </span>
            </div>
            <div className="divide-y divide-sand">
              {(product.routing || []).map((step, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-cream transition-colors">
                  <div className="flex size-8 items-center justify-center rounded-full bg-violet-600/10 text-xs font-bold text-violet-600">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-espresso">{step.processName}</p>
                    <p className="text-xs text-espresso-light">{step.timeMinutes} minutos</p>
                  </div>
                  <p className="font-semibold text-espresso font-mono">${step.costPerUnit.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-sand bg-cream px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-espresso">Total Procesos</span>
                <span className="text-sm font-bold text-violet-600 font-mono">${processCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-espresso/30 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white shadow-xl">
            <form onSubmit={handleUpdate} className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-sand px-6 py-4">
                <h2 className="font-display text-lg text-espresso">Editar producto</h2>
                <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-lg p-1.5 text-espresso-light hover:bg-sand/30 transition-colors">
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-espresso-light mb-1">Nombre</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-espresso-light mb-1">SKU</label>
                  <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso font-mono outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-espresso-light mb-1">Categoría</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30">
                      <option>Restaurante</option>
                      <option>Industrial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-espresso-light mb-1">Unidad</label>
                    <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-espresso-light mb-1">Precio venta</label>
                    <input required type="number" step="0.01" min="0" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso font-mono outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-espresso-light mb-1">Emoji</label>
                    <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-espresso-light mb-1">BOM (JSON)</label>
                  <textarea rows={4} value={form.bom} onChange={(e) => setForm({ ...form, bom: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso font-mono outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-espresso-light mb-1">Routing (JSON)</label>
                  <textarea rows={4} value={form.routing} onChange={(e) => setForm({ ...form, routing: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso font-mono outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30" />
                </div>
              </div>
              <div className="border-t border-sand px-6 py-4 flex items-center gap-3">
                <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 transition-colors disabled:opacity-50">
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
                <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-lg border border-sand px-4 py-2.5 text-sm font-medium text-espresso-light hover:bg-sand/30 transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
