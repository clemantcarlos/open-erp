"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Search,
  Plus,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  Eye,
  X,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { formatCurrency } from "@/lib/format";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  minStock: number;
}

const categories = ["Todas", "Bebidas", "Comida", "Postres", "Limpieza", "Empaques"];

function getStockStatus(product: Product) {
  if (product.quantity === 0) return { label: "Agotado", color: "bg-red-100 text-red-700" };
  if (product.quantity <= product.minStock) return { label: "Bajo", color: "bg-amber-100 text-amber-700" };
  return { label: "Disponible", color: "bg-sage/20 text-sage" };
}

type SortKey = "sku" | "name" | "category" | "quantity" | "price";

export default function InventarioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ sku: "", name: "", category: "Bebidas", price: "", quantity: "0", unit: "pieza", minStock: "0" });

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.data ?? []);
        setProducts(items.map((p: any) => ({ ...p, price: Number(p.price) })));
        setLoading(false);
        console.log(data)
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "Todas" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const mul = sortAsc ? 1 : -1;
      if (sortKey === "quantity") return (a.quantity - b.quantity) * mul;
      if (sortKey === "price") return (a.price - b.price) * mul;
      return a[sortKey].localeCompare(b[sortKey]) * mul;
    });

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const lowStockCount = products.filter((p) => p.quantity > 0 && p.quantity <= p.minStock).length;
  const outOfStockCount = products.filter((p) => p.quantity === 0).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price), quantity: Number(form.quantity), minStock: Number(form.minStock) }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setProducts((prev) => [...prev, { ...created, price: Number(created.price) }]);
      setDrawerOpen(false);
      setForm({ sku: "", name: "", category: "Bebidas", price: "", quantity: "0", unit: "pieza", minStock: "0" });
    } catch {
      window.alert("Error al crear producto");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando inventario...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <Package className="size-5 text-sky-600" />
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Inventario" }]} />
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700 transition-colors"
        >
          <Plus className="size-4" />
          Agregar producto
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Total productos</p>
            <p className="mt-1 text-2xl font-bold font-mono text-espresso">{products.length}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Valor en inventario</p>
            <p className="mt-1 text-2xl font-bold font-mono text-espresso">{formatCurrency(totalValue)}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Stock bajo</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-bold font-mono text-sky-600">{lowStockCount}</p>
              {lowStockCount > 0 && <AlertTriangle className="size-4 text-sky-600" />}
            </div>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Agotados</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-bold font-mono text-red-600">{outOfStockCount}</p>
              {outOfStockCount > 0 && <AlertTriangle className="size-4 text-red-500" />}
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso-light" />
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-sand bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30"
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="size-4 text-espresso-light mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-sky-600 text-white"
                    : "bg-white text-espresso-light hover:bg-sand/30 border border-sand"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-sand bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand text-left text-xs font-medium text-espresso-light uppercase tracking-wider">
                <th className="px-4 py-3">
                  <button onClick={() => toggleSort("sku")} className="flex items-center gap-1 hover:text-espresso">
                    SKU <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-espresso">
                    Producto <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button onClick={() => toggleSort("category")} className="flex items-center gap-1 hover:text-espresso">
                    Categoría <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button onClick={() => toggleSort("quantity")} className="flex items-center gap-1 hover:text-espresso ml-auto">
                    Cantidad <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button onClick={() => toggleSort("price")} className="flex items-center gap-1 hover:text-espresso ml-auto">
                    Precio <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-espresso-light">
                    <Package className="mx-auto mb-2 size-8" />
                    <p>No se encontraron productos</p>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const status = getStockStatus(product);
                  return (
                    <tr key={product.id} className="hover:bg-sand/10 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-espresso-light">{product.sku}</td>
                      <td className="px-4 py-3 font-medium text-espresso">{product.name}</td>
                      <td className="px-4 py-3 text-espresso-light">{product.category}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-mono ${product.quantity <= product.minStock ? "font-semibold text-sky-600" : "text-espresso"}`}>
                          {product.quantity}
                        </span>
                        <span className="text-espresso-light ml-1 text-xs">{product.unit}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-espresso">{formatCurrency(product.price)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/inventory/${product.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-sand/20 px-2 py-1 text-xs text-espresso-light hover:text-sky-600 transition-colors"
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

      {/* Create product drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-espresso/30 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white shadow-xl">
            <form onSubmit={handleCreate} className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-sand px-6 py-4">
                <h2 className="font-display text-lg text-espresso">Nuevo producto</h2>
                <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-lg p-1.5 text-espresso-light hover:bg-sand/30 transition-colors">
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-espresso-light mb-1">SKU</label>
                  <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-espresso-light mb-1">Nombre</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-espresso-light mb-1">Categoría</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30">
                    {categories.filter((c) => c !== "Todas").map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-espresso-light mb-1">Precio</label>
                    <input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso font-mono outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-espresso-light mb-1">Cantidad</label>
                    <input type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso font-mono outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-espresso-light mb-1">Unidad</label>
                    <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-espresso-light mb-1">Stock mínimo</label>
                    <input type="number" min="0" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} className="w-full rounded-lg border border-sand bg-cream/50 px-3 py-2 text-sm text-espresso font-mono outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30" />
                  </div>
                </div>
              </div>
              <div className="border-t border-sand px-6 py-4 flex items-center gap-3">
                <button type="submit" disabled={creating} className="flex-1 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 transition-colors disabled:opacity-50">
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
