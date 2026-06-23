import {
  Factory,
  ArrowLeft,
  Package,
  Wrench,
  DollarSign,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";
import {
  compositeProducts,
  getMaterialCost,
  getProcessCost,
  getUnitCost,
  getMargin,
} from "@/lib/data/manufacturing";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = compositeProducts.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const materialCost = getMaterialCost(product.bom);
  const processCost = getProcessCost(product.routing);
  const unitCost = getUnitCost(product);
  const margin = getMargin(product);
  const marginPercent = ((margin / product.salePrice) * 100).toFixed(0);
  const totalTime = product.routing.reduce((sum, s) => sum + s.timeMinutes, 0);

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/manufacturing"
            className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <span className="text-2xl">{product.emoji}</span>
          <div>
            <h1 className="text-lg font-semibold">{product.name}</h1>
            <p className="text-xs text-zinc-400 font-mono">{product.sku}</p>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            product.category === "Restaurante"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {product.category}
        </span>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* Cost summary card */}
        <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
            Resumen de Costos
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div>
              <p className="text-xs text-zinc-400">Materiales</p>
              <p className="text-xl font-bold text-zinc-700">
                ${materialCost.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">Procesos</p>
              <p className="text-xl font-bold text-zinc-700">
                ${processCost.toFixed(2)}
              </p>
            </div>
            <div className="border-l pl-4">
              <p className="text-xs text-zinc-400">Costo Unitario</p>
              <p className="text-xl font-bold text-indigo-600">
                ${unitCost.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">Precio Venta</p>
              <p className="text-xl font-bold text-zinc-900">
                ${product.salePrice.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">Margen</p>
              <p
                className={`text-xl font-bold ${
                  margin > 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                ${margin.toFixed(2)}
              </p>
              <p className="text-[10px] text-zinc-400">{marginPercent}%</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* BOM */}
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <Package className="size-4 text-indigo-500" />
              <h2 className="text-sm font-semibold">Lista de Materiales (BOM)</h2>
              <span className="ml-auto text-xs text-zinc-400">
                {product.bom.length} ingredientes
              </span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50 text-left text-xs text-zinc-500">
                  <th className="px-4 py-2">Ingrediente</th>
                  <th className="px-4 py-2 text-right">Cant.</th>
                  <th className="px-4 py-2 text-right">Costo/U</th>
                  <th className="px-4 py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {product.bom.map((entry, i) => (
                  <tr key={i} className="hover:bg-zinc-50">
                    <td className="px-4 py-2 font-medium text-zinc-700">
                      {entry.ingredientName}
                    </td>
                    <td className="px-4 py-2 text-right text-zinc-500">
                      {entry.quantity} {entry.unit}
                    </td>
                    <td className="px-4 py-2 text-right text-zinc-500">
                      ${entry.unitCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-zinc-700">
                      ${(entry.quantity * entry.unitCost).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t bg-zinc-50 font-semibold">
                  <td className="px-4 py-2" colSpan={3}>
                    Total Materiales
                  </td>
                  <td className="px-4 py-2 text-right text-indigo-600">
                    ${materialCost.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Routing */}
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <Wrench className="size-4 text-indigo-500" />
              <h2 className="text-sm font-semibold">Routing de Producción</h2>
              <span className="ml-auto flex items-center gap-1 text-xs text-zinc-400">
                <Clock className="size-3" />
                {totalTime} min total
              </span>
            </div>
            <div className="divide-y">
              {product.routing.map((step, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-50">
                  <div className="flex size-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-zinc-700">{step.processName}</p>
                    <p className="text-xs text-zinc-400">{step.timeMinutes} minutos</p>
                  </div>
                  <p className="font-semibold text-zinc-700">
                    ${step.costPerUnit.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t bg-zinc-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Total Procesos</span>
                <span className="text-sm font-bold text-indigo-600">
                  ${processCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cost breakdown visual */}
        <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
            Desglose de Costo Unitario
          </h2>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-zinc-600">Materiales</span>
                <span className="font-medium">
                  ${materialCost.toFixed(2)} ({((materialCost / unitCost) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-indigo-400"
                  style={{ width: `${(materialCost / unitCost) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-zinc-600">Procesos</span>
                <span className="font-medium">
                  ${processCost.toFixed(2)} ({((processCost / unitCost) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-purple-400"
                  style={{ width: `${(processCost / unitCost) * 100}%` }}
                />
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-700">Costo Total</span>
                <span className="text-lg font-bold text-indigo-600">
                  ${unitCost.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Precio de venta</span>
                <span className="text-sm font-medium text-zinc-700">
                  ${product.salePrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Margen</span>
                <span
                  className={`text-sm font-bold ${
                    margin > 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  ${margin.toFixed(2)} ({marginPercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
