import {
  Factory,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  Package,
  Wrench,
} from "lucide-react";
import Link from "next/link";
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
  planned: { label: "Planificada", color: "bg-blue-100 text-blue-700", icon: Clock },
  in_progress: { label: "En Progreso", color: "bg-amber-100 text-amber-700", icon: PlayCircle },
  completed: { label: "Completada", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  cancelled: { label: "Cancelada", color: "bg-red-100 text-red-700", icon: XCircle },
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
    <div className="min-h-screen bg-zinc-100">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/manufacturing/orders"
            className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <Factory className="size-5 text-indigo-600" />
          <div>
            <h1 className="text-lg font-semibold">{order.id}</h1>
            <p className="text-xs text-zinc-400">{order.compositeProductName}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}>
          <StatusIcon className="size-3" />
          {status.label}
        </span>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* Order info */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Producto</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg">{product.emoji}</span>
              <p className="text-sm font-semibold text-zinc-700">{product.name}</p>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Planificada</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">{order.quantityPlanned}</p>
            <p className="text-[10px] text-zinc-400">{product.unit}</p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Producida</p>
            <p className="mt-1 text-2xl font-bold text-indigo-600">{order.quantityProduced}</p>
            <p className="text-[10px] text-zinc-400">{product.unit}</p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Fecha programada</p>
            <p className="mt-1 text-sm font-semibold text-zinc-700">{order.scheduledDate}</p>
            {order.completedDate && (
              <p className="text-[10px] text-emerald-500">Completada: {order.completedDate}</p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {order.status !== "cancelled" && (
          <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-zinc-500">Progreso de producción</span>
              <span className="font-semibold text-zinc-700">{progress.toFixed(0)}%</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-zinc-100">
              <div
                className={`h-full rounded-full transition-all ${
                  order.status === "completed" ? "bg-emerald-500" : "bg-indigo-500"
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-zinc-400">
              <span>0 {product.unit}</span>
              <span>{order.quantityPlanned} {product.unit}</span>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Cost breakdown */}
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <Package className="size-4 text-indigo-500" />
              <h2 className="text-sm font-semibold">Desglose de Costos</h2>
            </div>
            <div className="divide-y">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Costo material/unit</span>
                  <span className="text-sm font-medium text-zinc-700">
                    ${getMaterialCost(product.bom).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Costo proceso/unit</span>
                  <span className="text-sm font-medium text-zinc-700">
                    ${getProcessCost(product.routing).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-700">Costo unitario</span>
                  <span className="text-sm font-bold text-indigo-600">
                    ${unitCost.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="bg-zinc-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Cantidad</span>
                  <span className="text-sm text-zinc-700">
                    {order.status === "completed" ? order.quantityProduced : order.quantityPlanned} {product.unit}
                  </span>
                </div>
              </div>
              <div className="bg-zinc-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-700">Costo total</span>
                  <span className="text-lg font-bold text-indigo-600">
                    ${totalCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Routing timeline */}
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <Wrench className="size-4 text-indigo-500" />
              <h2 className="text-sm font-semibold">Routing de Producción</h2>
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
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-zinc-100 text-zinc-400"
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
                              stepCompleted ? "bg-emerald-200" : "bg-zinc-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-4 flex-1">
                        <p className={`text-sm font-medium ${stepCompleted ? "text-zinc-700" : "text-zinc-400"}`}>
                          {step.processName}
                        </p>
                        <p className="text-xs text-zinc-400">
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
          <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
              Notas
            </h2>
            <p className="text-sm text-zinc-600">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
