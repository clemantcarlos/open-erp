import {
  Factory,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  Package,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  productionOrders,
  compositeProducts,
  getUnitCost,
  getMaterialCost,
  getProcessCost,
  getOrderTotalCost,
} from "@/lib/data/manufacturing";
import { notFound } from "next/navigation";

const statusConfig = {
  planned: { label: "Planificada", color: "bg-violet-600/10 text-violet-600", icon: Clock },
  in_progress: { label: "En Progreso", color: "bg-amber-100 text-amber-700", icon: PlayCircle },
  completed: { label: "Completada", color: "bg-sage/10 text-sage", icon: CheckCircle },
  cancelled: { label: "Cancelada", color: "bg-violet-600/10 text-violet-600", icon: XCircle },
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = productionOrders.find((o) => o.id === id);

  if (!order) {
    notFound();
  }

  const product = compositeProducts.find((p) => p.id === order.compositeProductId);
  if (!product) {
    notFound();
  }

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  const unitCost = getUnitCost(product);
  const totalCost = getOrderTotalCost(order, product);
  const progress =
    order.quantityPlanned > 0
      ? (order.quantityProduced / order.quantityPlanned) * 100
      : 0;

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <Factory className="size-5 text-violet-600" />
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Fabricación", href: "/manufacturing" },
              { label: "Órdenes", href: "/manufacturing/orders" },
              { label: order.id },
            ]}
          />
        </div>
        <div className="ml-auto">
          <p className="text-xs text-espresso-light">{order.compositeProductName}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}>
          <StatusIcon className="size-3" />
          {status.label}
        </span>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* Order info */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Producto</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg">{product.emoji}</span>
              <p className="text-sm font-semibold text-espresso">{product.name}</p>
            </div>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Planificada</p>
            <p className="mt-1 text-2xl font-bold text-espresso font-mono">{order.quantityPlanned}</p>
            <p className="text-[10px] text-espresso-light">{product.unit}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Producida</p>
            <p className="mt-1 text-2xl font-bold text-violet-600 font-mono">{order.quantityProduced}</p>
            <p className="text-[10px] text-espresso-light">{product.unit}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Fecha programada</p>
            <p className="mt-1 text-sm font-semibold text-espresso">{order.scheduledDate}</p>
            {order.completedDate && (
              <p className="text-[10px] text-sage">Completada: {order.completedDate}</p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {order.status !== "cancelled" && (
          <div className="mb-6 rounded-xl border border-sand bg-white p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-espresso-light">Progreso de producción</span>
              <span className="font-semibold text-espresso font-mono">{progress.toFixed(0)}%</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-cream">
              <div
                className={`h-full rounded-full transition-all ${
                  order.status === "completed" ? "bg-sage" : "bg-violet-600"
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-espresso-light font-mono">
              <span>0 {product.unit}</span>
              <span>{order.quantityPlanned} {product.unit}</span>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Cost breakdown */}
          <div className="rounded-xl border border-sand bg-white">
            <div className="flex items-center gap-2 border-b border-sand px-4 py-3">
              <Package className="size-4 text-violet-600" />
              <h2 className="text-sm font-semibold text-espresso">Desglose de Costos</h2>
            </div>
            <div className="divide-y divide-sand">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-espresso">Costo material/unit</span>
                  <span className="text-sm font-medium text-espresso font-mono">
                    ${getMaterialCost(product.bom).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-espresso">Costo proceso/unit</span>
                  <span className="text-sm font-medium text-espresso font-mono">
                    ${getProcessCost(product.routing).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-espresso">Costo unitario</span>
                  <span className="text-sm font-bold text-violet-600 font-mono">
                    ${unitCost.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="bg-cream px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-espresso">Cantidad</span>
                  <span className="text-sm text-espresso font-mono">
                    {order.status === "completed" ? order.quantityProduced : order.quantityPlanned} {product.unit}
                  </span>
                </div>
              </div>
              <div className="bg-cream px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-espresso">Costo total</span>
                  <span className="text-lg font-bold text-violet-600 font-mono">
                    ${totalCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Routing timeline */}
          <div className="rounded-xl border border-sand bg-white">
            <div className="flex items-center gap-2 border-b border-sand px-4 py-3">
              <Wrench className="size-4 text-violet-600" />
              <h2 className="text-sm font-semibold text-espresso">Routing de Producción</h2>
            </div>
            <div className="p-4">
              <div className="space-y-0">
                {product.routing.map((step, i) => {
                  const isLast = i === product.routing.length - 1;
                  const stepCompleted =
                    order.status === "completed" ||
                    (order.status === "in_progress" &&
                      i < Math.floor((order.quantityProduced / order.quantityPlanned) * product.routing.length));
                  return (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ${
                            stepCompleted
                              ? "bg-sage/10 text-sage"
                              : "bg-cream text-espresso-light"
                          }`}
                        >
                          {stepCompleted ? (
                            <CheckCircle className="size-4" />
                          ) : (
                            i + 1
                          )}
                        </div>
                        {!isLast && (
                          <div
                            className={`w-0.5 flex-1 my-1 ${
                              stepCompleted ? "bg-sage/20" : "bg-sand"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-4 flex-1">
                        <p className={`text-sm font-medium ${stepCompleted ? "text-espresso" : "text-espresso-light"}`}>
                          {step.processName}
                        </p>
                        <p className="text-xs text-espresso-light font-mono">
                          {step.timeMinutes} min · ${step.costPerUnit.toFixed(2)}/unit
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="mt-6 rounded-xl border border-sand bg-white p-4">
            <h2 className="mb-2 text-sm font-semibold text-espresso-light uppercase tracking-wider">
              Notas
            </h2>
            <p className="text-sm text-espresso">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
