"use client";

import { useState } from "react";
import {
  Factory,
  Search,
  ArrowLeft,
  Plus,
  ChevronRight,
  DollarSign,
  Package,
  Clock,
} from "lucide-react";
import Link from "next/link";
import {
  compositeProducts,
  productionOrders,
  getUnitCost,
  getMargin,
  getMaterialCost,
  getProcessCost,
} from "@/lib/data/manufacturing";

const categories = ["Todas", "Restaurante", "Industrial"];

export default function ManufacturingPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");

  const filtered = compositeProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "Todas" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const pendingOrders = productionOrders.filter(
    (o) => o.status === "planned" || o.status === "in_progress"
  ).length;
  const avgCost =
    compositeProducts.reduce((sum, p) => sum + getUnitCost(p), 0) /
    compositeProducts.length;

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <Factory className="size-5 text-indigo-600" />
          <h1 className="text-lg font-semibold">Fabricación</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/manufacturing/orders"
            className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            <Clock className="size-4" />
            Órdenes
            {pendingOrders > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                {pendingOrders}
              </span>
            )}
          </Link>
          <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
            <Plus className="size-4" />
            Nuevo producto
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Productos compuestos</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">
              {compositeProducts.length}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Costo promedio unitario</p>
            <p className="mt-1 text-2xl font-bold text-indigo-600">
              ${avgCost.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Órdenes activas</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-bold text-amber-600">{pendingOrders}</p>
              {pendingOrders > 0 && (
                <Clock className="size-4 text-amber-500" />
              )}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Categorías</p>
            <div className="mt-1 flex gap-1">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Restaurante
              </span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                Industrial
              </span>
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
              className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300"
            />
          </div>
          <div className="flex gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 border"
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
                className="group rounded-xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{product.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-zinc-800 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-zinc-400 font-mono">
                        {product.sku}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-zinc-300 group-hover:text-indigo-400 transition-colors" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase">Materiales</p>
                    <p className="text-sm font-semibold text-zinc-700">
                      ${getMaterialCost(product.bom).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase">Procesos</p>
                    <p className="text-sm font-semibold text-zinc-700">
                      ${getProcessCost(product.routing).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase">Total</p>
                    <p className="text-sm font-bold text-indigo-600">
                      ${unitCost.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t pt-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      product.category === "Restaurante"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {product.category}
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-400">Venta ${product.salePrice.toFixed(2)}</p>
                    <p
                      className={`text-xs font-semibold ${
                        margin > 0 ? "text-emerald-600" : "text-red-600"
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
      </div>
    </div>
  );
}
