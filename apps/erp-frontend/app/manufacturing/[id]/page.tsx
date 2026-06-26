import {
  Factory,
  Package,
  Wrench,
  DollarSign,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
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
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{product.emoji}</span>
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Fabricación", href: "/manufacturing" },
              { label: product.name },
            ]}
          />
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            product.category === "Restaurante"
              ? "bg-sage/10 text-sage"
              : "bg-violet-600/10 text-violet-600"
          }`}
        >
          {product.category}
        </span>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* Cost summary card */}
        <div className="mb-6 rounded-xl border border-sand bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-espresso-light uppercase tracking-wider">
            Resumen de Costos
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div>
              <p className="text-xs text-espresso-light">Materiales</p>
              <p className="text-xl font-bold text-espresso font-mono">
                ${materialCost.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-espresso-light">Procesos</p>
              <p className="text-xl font-bold text-espresso font-mono">
                ${processCost.toFixed(2)}
              </p>
            </div>
            <div className="border-l border-sand pl-4">
              <p className="text-xs text-espresso-light">Costo Unitario</p>
              <p className="text-xl font-bold text-violet-600 font-mono">
                ${unitCost.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-espresso-light">Precio Venta</p>
              <p className="text-xl font-bold text-espresso font-mono">
                ${product.salePrice.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-espresso-light">Margen</p>
              <p
                className={`text-xl font-bold font-mono ${
                  margin > 0 ? "text-sage" : "text-violet-600"
                }`}
              >
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
                {product.bom.length} ingredientes
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
                {product.bom.map((entry, i) => (
                  <tr key={i} className="hover:bg-cream transition-colors">
                    <td className="px-4 py-2 font-medium text-espresso">
                      {entry.ingredientName}
                    </td>
                    <td className="px-4 py-2 text-right text-espresso-light">
                      {entry.quantity} {entry.unit}
                    </td>
                    <td className="px-4 py-2 text-right text-espresso-light font-mono">
                      ${entry.unitCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-espresso font-mono">
                      ${(entry.quantity * entry.unitCost).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-sand bg-cream font-semibold">
                  <td className="px-4 py-2" colSpan={3}>
                    Total Materiales
                  </td>
                  <td className="px-4 py-2 text-right text-violet-600 font-mono">
                    ${materialCost.toFixed(2)}
                  </td>
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
              {product.routing.map((step, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-cream transition-colors">
                  <div className="flex size-8 items-center justify-center rounded-full bg-violet-600/10 text-xs font-bold text-violet-600">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-espresso">{step.processName}</p>
                    <p className="text-xs text-espresso-light">{step.timeMinutes} minutos</p>
                  </div>
                  <p className="font-semibold text-espresso font-mono">
                    ${step.costPerUnit.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-sand bg-cream px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-espresso">Total Procesos</span>
                <span className="text-sm font-bold text-violet-600 font-mono">
                  ${processCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cost breakdown visual */}
        <div className="mt-6 rounded-xl border border-sand bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-espresso-light uppercase tracking-wider">
            Desglose de Costo Unitario
          </h2>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-espresso">Materiales</span>
                <span className="font-medium text-espresso font-mono">
                  ${materialCost.toFixed(2)} ({((materialCost / unitCost) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-cream">
                <div
                  className="h-full rounded-full bg-violet-600"
                  style={{ width: `${(materialCost / unitCost) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-espresso">Procesos</span>
                <span className="font-medium text-espresso font-mono">
                  ${processCost.toFixed(2)} ({((processCost / unitCost) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-cream">
                <div
                  className="h-full rounded-full bg-sage"
                  style={{ width: `${(processCost / unitCost) * 100}%` }}
                />
              </div>
            </div>
            <div className="border-t border-sand pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-espresso">Costo Total</span>
                <span className="text-lg font-bold text-violet-600 font-mono">
                  ${unitCost.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-espresso-light">Precio de venta</span>
                <span className="text-sm font-medium text-espresso font-mono">
                  ${product.salePrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-espresso-light">Margen</span>
                <span
                  className={`text-sm font-bold font-mono ${
                    margin > 0 ? "text-sage" : "text-violet-600"
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
