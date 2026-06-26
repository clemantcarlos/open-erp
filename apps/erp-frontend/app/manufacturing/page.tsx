"use client";

import { useState } from "react";
import {
  Factory,
  Search,
  Plus,
  Clock,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
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
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <Factory className="size-5 text-violet-600" />
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Fabricación" }]} />
        </div>
        <div className="flex items-center gap-2">
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
          <button className="flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors">
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
      </div>
    </div>
  );
}
