"use client";

import { useState, useEffect } from "react";
import { Factory, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface CompositeProduct {
  id: string;
  name: string;
}

export default function NewOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preProductId = searchParams.get("productId");
  const preProductName = searchParams.get("productName");

  const [products, setProducts] = useState<CompositeProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState(preProductId || "");
  const [selectedProductName, setSelectedProductName] = useState(preProductName || "");
  const [quantityPlanned, setQuantityPlanned] = useState(1);
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!preProductId) {
      fetch("/api/manufacturing/composite-products")
        .then((res) => res.json())
        .then((data) => {
          const items = Array.isArray(data) ? data : (data?.data ?? []);
          setProducts(items.map((p: any) => ({ id: p.id, name: p.name })));
        })
        .catch(() => {});
    }
  }, [preProductId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || quantityPlanned < 1) {
      setError("Selecciona un producto y cantidad válida");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/manufacturing/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compositeProductId: selectedProductId,
          compositeProductName: selectedProductName,
          quantityPlanned,
          scheduledDate,
          notes: notes || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Error al crear la orden");
      }
      const order = await res.json();
      router.push(`/manufacturing/orders/${order.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <Link href="/manufacturing/orders" className="rounded-lg p-1.5 hover:bg-sand/50 transition-colors">
          <ArrowLeft className="size-5 text-espresso" />
        </Link>
        <Factory className="size-5 text-violet-600" />
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Fabricación", href: "/manufacturing" },
            { label: "Órdenes", href: "/manufacturing/orders" },
            { label: "Nueva" },
          ]}
        />
      </header>

      <div className="mx-auto max-w-2xl px-6 py-6">
        <h1 className="mb-6 text-xl font-bold text-espresso">Nueva orden de producción</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl border border-sand bg-white p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-espresso mb-1">
                Producto compuesto *
              </label>
              {preProductId ? (
                <input type="hidden" value={selectedProductId} />
              ) : (
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    const opt = e.target.selectedOptions[0];
                    setSelectedProductId(e.target.value);
                    setSelectedProductName(opt?.textContent || "");
                  }}
                  className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30"
                  required
                >
                  <option value="">Seleccionar producto...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
              {preProductId && (
                <p className="mt-1 text-sm text-espresso">{selectedProductName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-espresso mb-1">
                Cantidad planificada *
              </label>
              <input
                type="number"
                min={1}
                value={quantityPlanned}
                onChange={(e) => setQuantityPlanned(parseInt(e.target.value) || 1)}
                className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-espresso mb-1">
                Fecha programada *
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-espresso mb-1">
                Notas
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-sand bg-white px-3 py-2 text-sm text-espresso outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30 resize-none"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3">
            <Link
              href="/manufacturing/orders"
              className="rounded-lg border border-sand bg-white px-4 py-2 text-sm font-medium text-espresso hover:bg-cream transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear orden"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
