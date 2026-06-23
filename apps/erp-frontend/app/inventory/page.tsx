"use client";

import { useState } from "react";
import {
  Package,
  Search,
  ArrowLeft,
  Plus,
  AlertTriangle,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import Link from "next/link";

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

const products: Product[] = [
  { id: "1", sku: "BEB-001", name: "Café Americano (500g)", category: "Bebidas", quantity: 120, unit: "kg", price: 12.5, minStock: 20 },
  { id: "2", sku: "BEB-002", name: "Cappuccino Mix (1kg)", category: "Bebidas", quantity: 8, unit: "kg", price: 18.0, minStock: 15 },
  { id: "3", sku: "BEB-003", name: "Jugo de Naranja (1L)", category: "Bebidas", quantity: 45, unit: "unid", price: 3.0, minStock: 30 },
  { id: "4", sku: "BEB-004", name: "Agua Mineral (500ml)", category: "Bebidas", quantity: 200, unit: "unid", price: 1.5, minStock: 50 },
  { id: "5", sku: "COM-001", name: "Pan Integral (unidad)", category: "Comida", quantity: 0, unit: "unid", price: 2.5, minStock: 25 },
  { id: "6", sku: "COM-002", name: "Mantequilla (250g)", category: "Comida", quantity: 35, unit: "unid", price: 4.0, minStock: 20 },
  { id: "7", sku: "COM-003", name: "Jamón Sliced (200g)", category: "Comida", quantity: 12, unit: "unid", price: 5.5, minStock: 15 },
  { id: "8", sku: "COM-004", name: "Queso Mozzarella (500g)", category: "Comida", quantity: 5, unit: "unid", price: 7.0, minStock: 10 },
  { id: "9", sku: "POS-001", name: "Harina de Trigo (1kg)", category: "Postres", quantity: 60, unit: "kg", price: 2.0, minStock: 30 },
  { id: "10", sku: "POS-002", name: "Azúcar Refinada (1kg)", category: "Postres", quantity: 85, unit: "kg", price: 1.8, minStock: 40 },
  { id: "11", sku: "POS-003", name: "Chocolate en Polvo (500g)", category: "Postres", quantity: 3, unit: "kg", price: 8.0, minStock: 10 },
  { id: "12", sku: "LIM-001", name: "Detergente Multiusos", category: "Limpieza", quantity: 50, unit: "unid", price: 3.5, minStock: 20 },
  { id: "13", sku: "LIM-002", name: "Jabón de Manos (500ml)", category: "Limpieza", quantity: 0, unit: "unid", price: 4.5, minStock: 15 },
  { id: "14", sku: "EMP-001", name: "Vasos Descartables (50un)", category: "Empaques", quantity: 180, unit: "paq", price: 6.0, minStock: 30 },
  { id: "15", sku: "EMP-002", name: "Bolsas Papel (100un)", category: "Empaques", quantity: 40, unit: "paq", price: 8.5, minStock: 20 },
];

const categories = ["Todas", "Bebidas", "Comida", "Postres", "Limpieza", "Empaques"];

function getStockStatus(product: Product) {
  if (product.quantity === 0) return { label: "Agotado", color: "bg-red-100 text-red-700" };
  if (product.quantity <= product.minStock) return { label: "Bajo", color: "bg-amber-100 text-amber-700" };
  return { label: "Disponible", color: "bg-emerald-100 text-emerald-700" };
}

type SortKey = "sku" | "name" | "category" | "quantity" | "price";

export default function InventarioPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

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
          <Package className="size-5 text-cyan-600" />
          <h1 className="text-lg font-semibold">Inventario</h1>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-700 transition-colors">
          <Plus className="size-4" />
          Agregar producto
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Stats cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Total productos</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">{products.length}</p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Valor en inventario</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">${totalValue.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Stock bajo</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
              {lowStockCount > 0 && <AlertTriangle className="size-4 text-amber-500" />}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Agotados</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
              {outOfStockCount > 0 && <AlertTriangle className="size-4 text-red-500" />}
            </div>
          </div>
        </div>

        {/* Search + filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-300"
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="size-4 text-zinc-400 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-cyan-600 text-white"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                <th className="px-4 py-3">
                  <button onClick={() => toggleSort("sku")} className="flex items-center gap-1 hover:text-zinc-700">
                    SKU <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-zinc-700">
                    Producto <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button onClick={() => toggleSort("category")} className="flex items-center gap-1 hover:text-zinc-700">
                    Categoría <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button onClick={() => toggleSort("quantity")} className="flex items-center gap-1 hover:text-zinc-700 ml-auto">
                    Cantidad <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button onClick={() => toggleSort("price")} className="flex items-center gap-1 hover:text-zinc-700 ml-auto">
                    Precio <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-400">
                    <Package className="mx-auto mb-2 size-8" />
                    <p>No se encontraron productos</p>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const status = getStockStatus(product);
                  return (
                    <tr key={product.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500">{product.sku}</td>
                      <td className="px-4 py-3 font-medium text-zinc-700">{product.name}</td>
                      <td className="px-4 py-3 text-zinc-500">{product.category}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={product.quantity <= product.minStock ? "font-semibold text-amber-600" : "text-zinc-700"}>
                          {product.quantity}
                        </span>
                        <span className="text-zinc-400 ml-1 text-xs">{product.unit}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-zinc-700">${product.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
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
