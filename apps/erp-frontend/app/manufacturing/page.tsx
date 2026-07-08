"use client";

import { useState, useEffect } from "react";
import {
  Factory,
  Search,
  Plus,
  Clock,
  ChevronRight,
  Cog,
  X,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface BOMEntry {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  unitCost: number;
}

interface RoutingStep {
  processStepId: string;
  processName: string;
  costPerUnit: number;
  timeMinutes: number;
}

interface CompositeProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  salePrice: number;
  emoji: string;
  bom: BOMEntry[];
  routing: RoutingStep[];
}

interface ProductionOrder {
  id: string;
  compositeProductName: string;
  quantityPlanned: number;
  quantityProduced: number;
  status: string;
}

const categories = ["Todas", "Restaurante", "Industrial"];

function getMaterialCost(bom: BOMEntry[]) {
  return bom.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
}

function getProcessCost(routing: RoutingStep[]) {
  return routing.reduce((sum, step) => sum + step.costPerUnit, 0);
}

function getUnitCost(product: CompositeProduct) {
  return getMaterialCost(product.bom) + getProcessCost(product.routing);
}

function getMargin(product: CompositeProduct) {
  return product.salePrice - getUnitCost(product);
}

export default function ManufacturingPage() {
  const [compositeProducts, setCompositeProducts] = useState<CompositeProduct[]>([]);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [form, setForm] = useState({
    name: "", sku: "", category: "Restaurante", unit: "unid",
    salePrice: "", emoji: "📦", bom: "[]", routing: "[]",
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/manufacturing/composite-products?page=${page}&limit=12`).then((r) => r.json()),
      fetch("/api/manufacturing/orders").then((r) => r.json()),
    ]).then(([cpData, orderData]) => {
      const cpItems = cpData?.data ?? (Array.isArray(cpData) ? cpData : []);
      setMeta(cpData?.meta ?? { total: cpItems.length, totalPages: 1 });
      setCompositeProducts(cpItems.map((p: any) => ({
        ...p,
        salePrice: Number(p.salePrice),
        bom: Array.isArray(p.bom) ? p.bom : [],
        routing: Array.isArray(p.routing) ? p.routing : [],
      })));
      setProductionOrders(Array.isArray(orderData) ? orderData : []);
      setLoading(false);
    }).catch(() => { setError(true); setLoading(false); });
  }, [page]);

  const filtered = compositeProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "Todas" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const bom = JSON.parse(form.bom);
      const routing = JSON.parse(form.routing);
      if (!Array.isArray(bom) || !Array.isArray(routing)) throw new Error();
      const res = await fetch("/api/manufacturing/composite-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, sku: form.sku, category: form.category,
          unit: form.unit, salePrice: Number(form.salePrice),
          emoji: form.emoji, bom, routing,
        }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setCompositeProducts((prev) => [...prev, {
        ...created,
        bom: Array.isArray(created.bom) ? created.bom : [],
        routing: Array.isArray(created.routing) ? created.routing : [],
      }]);
      setDrawerOpen(false);
      setForm({ name: "", sku: "", category: "Restaurante", unit: "unid", salePrice: "", emoji: "📦", bom: "[]", routing: "[]" });
    } catch {
      window.alert("Error al crear producto. Verifica que bom y routing sean JSON válido.");
    } finally {
      setCreating(false);
    }
  }

  const pendingOrders = productionOrders.filter(
    (o) => o.status === "planned" || o.status === "in_progress"
  ).length;
  const avgCost = compositeProducts.length > 0
    ? compositeProducts.reduce((sum, p) => sum + getUnitCost(p), 0) / compositeProducts.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando fabricación...</p>
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
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Fabricación" }]} />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/manufacturing/process-steps"
            className="flex items-center gap-2 rounded-lg border border-sand bg-white px-3 py-2 text-sm font-medium text-espresso hover:bg-cream transition-colors"
          >
            <Cog className="size-4" />
            Procesos
          </Link>
          <Link
            href="/manufacturing/orders"
            className="flex items-center gap-2 rounded-lg border border-sand bg-white px-3 py-2 text-sm font-medium text-espresso hover:bg-cream transition-colors"
          >
            <Clock className="size-4" />
            Órdenes
            {pendingOrders > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                {pendingOrders}
              </span>
            )}
          </Link>
          <button onClick={() => setDrawerOpen(true)} className="flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors">
            <Plus className="size-4" />
            Nuevo producto
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Productos compuestos</p>
            <p className="mt-1 text-2xl font-bold text-espresso font-mono">
              {compositeProducts.length}
            </p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Costo promedio unitario</p>
            <p className="mt-1 text-2xl font-bold text-violet-600 font-mono">
              ${avgCost.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Órdenes activas</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-bold text-violet-600 font-mono">{pendingOrders}</p>
              {pendingOrders > 0 && (
                <Clock className="size-4 text-violet-600" />
              )}
            </div>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Categorías</p>
            <div className="mt-1 flex gap-1">
              <span className="rounded-full bg-sage/10 px-2 py-0.5 text-xs font-medium text-sage">
                Restaurante
              </span>
              <span className="rounded-full bg-violet-600/10 px-2 py-0.5 text-xs font-medium text-violet-600">
                Industrial
              </span>
            </div>
          </div>
        </div>

        {/* Search + filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso-light" />
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-sand bg-white py-2 pl-9 pr-3 text-sm text-espresso outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30"
            />
          </div>
          <div className="flex gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-violet-600 text-white"
                    : "bg-white text-espresso border border-sand hover:bg-cream"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => {
            const unitCost = getUnitCost(product);
            const margin = getMargin(product);
            return (
              <Link
                key={product.id}
                href={`/manufacturing/${product.id}`}
                className="group rounded-xl border border-sand bg-white p-4 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{product.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-espresso group-hover:text-violet-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-espresso-light font-mono">
                        {product.sku}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-espresso-light/50 group-hover:text-violet-600 transition-colors" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-espresso-light uppercase">Materiales</p>
                    <p className="text-sm font-semibold text-espresso font-mono">
                      ${getMaterialCost(product.bom).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-espresso-light uppercase">Procesos</p>
                    <p className="text-sm font-semibold text-espresso font-mono">
                      ${getProcessCost(product.routing).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-espresso-light uppercase">Total</p>
                    <p className="text-sm font-bold text-violet-600 font-mono">
                      ${unitCost.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-sand pt-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      product.category === "Restaurante"
                        ? "bg-sage/10 text-sage"
                        : "bg-violet-600/10 text-violet-600"
                    }`}
                  >
                    {product.category}
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] text-espresso-light">Venta ${product.salePrice.toFixed(2)}</p>
                    <p
                      className={`text-xs font-semibold font-mono ${
                        margin > 0 ? "text-sage" : "text-violet-600"
                      }`}
                    >
                      Margen ${margin.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
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

      {/* Create composite product drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-espresso/30 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white shadow-xl">
            <form onSubmit={handleCreate} className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-sand px-6 py-4">
                <h2 className="font-display text-lg text-espresso">Nuevo producto compuesto</h2>
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
                  <textarea rows={4} value={form.bom} onChange={(e) => setForm({ ...form, bom: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso font-mono outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30" placeholder='[{"ingredientId":"...","ingredientName":"Harina","quantity":1,"unit":"kg","unitCost":2.5}]' />
                </div>
                <div>
                  <label className="block text-xs font-medium text-espresso-light mb-1">Routing (JSON)</label>
                  <textarea rows={4} value={form.routing} onChange={(e) => setForm({ ...form, routing: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso font-mono outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30" placeholder='[{"processStepId":"...","processName":"Mezclar","costPerUnit":1.5,"timeMinutes":10}]' />
                </div>
              </div>
              <div className="border-t border-sand px-6 py-4 flex items-center gap-3">
                <button type="submit" disabled={creating} className="flex-1 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-700 transition-colors disabled:opacity-50">
                  {creating ? "Creando..." : "Crear producto"}
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
