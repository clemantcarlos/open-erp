"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Package, Save, Trash2, ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import Link from "next/link";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  minStock: number;
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProduct({ ...data, price: Number(data.price) });
        setLoading(false);
      })
      .catch(() => {
        window.alert("No se encontró el producto");
        router.push("/inventory");
      });
  }, [id, router]);

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    if (!product) return;
    setProduct({ ...product, [key]: value });
  }

  async function handleSave() {
    if (!product) return;
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product }),
      });
      if (!res.ok) throw new Error("Save failed");
      window.alert("Producto guardado");
    } catch {
      window.alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/inventory");
    } catch {
      window.alert("Error al eliminar");
    }
  }

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando producto...</p>
      </div>
    );
  }

  const fields: { key: keyof Product; label: string; type?: string; readonly?: boolean }[] = [
    { key: "sku", label: "SKU", readonly: true },
    { key: "name", label: "Nombre" },
    { key: "category", label: "Categoría" },
    { key: "price", label: "Precio", type: "number" },
    { key: "quantity", label: "Cantidad", type: "number" },
    { key: "unit", label: "Unidad" },
    { key: "minStock", label: "Stock mínimo", type: "number" },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <Package className="size-5 text-sky-600" />
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Inventario", href: "/inventory" },
              { label: product.name || "Producto" },
            ]}
          />
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-6">
        <div className="rounded-xl border border-sand bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-bold text-espresso">Detalle del producto</h1>
            <Link
              href="/inventory"
              className="flex items-center gap-1 text-sm text-espresso-light hover:text-sky-600 transition-colors"
            >
              <ArrowLeft className="size-4" />
              Volver
            </Link>
          </div>

          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-espresso-light mb-1">{f.label}</label>
                <input
                  type={f.type ?? "text"}
                  value={product[f.key] ?? ""}
                  readOnly={f.readonly}
                  onChange={(e) => {
                    const val = f.type === "number" ? Number(e.target.value) : e.target.value;
                    update(f.key, val as any);
                  }}
                  className={`w-full rounded-lg border border-sand px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30 ${
                    f.readonly ? "font-mono text-espresso-light cursor-not-allowed" : "text-espresso"
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-sand">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 transition-colors disabled:opacity-50"
            >
              <Save className="size-4" />
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-lg border border-terracotta/20 bg-white px-4 py-2 text-sm font-medium text-terracotta hover:bg-terracotta/5 transition-colors"
            >
              <Trash2 className="size-4" />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
