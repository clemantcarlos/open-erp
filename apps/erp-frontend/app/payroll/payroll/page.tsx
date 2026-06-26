"use client";

import { useState } from "react";
import {
  Receipt,
  Search,
  Plus,
  DollarSign,
  Clock,
  CheckCircle,
  Banknote,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  payrollRecords,
  getTotalPayroll,
  getTotalBonuses,
  getTotalDeductions,
} from "@/lib/data/payroll";

const statusConfig = {
  paid: { label: "Pagado", color: "bg-sage/10 text-sage", icon: CheckCircle },
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: Clock },
  held: { label: "Retenido", color: "bg-rose-600/10 text-rose-600", icon: Banknote },
};

export default function PayrollRecordsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending" | "held">("all");

  const filtered = payrollRecords.filter((r) => {
    const matchesSearch =
      r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPayroll = getTotalPayroll(payrollRecords);
  const totalBonuses = getTotalBonuses(payrollRecords);
  const totalDeductions = getTotalDeductions(payrollRecords);
  const pendingCount = payrollRecords.filter((r) => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <Receipt className="size-5 text-rose-600" />
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Empleados", href: "/payroll" }, { label: "Nómina" }]} />
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors">
          <Plus className="size-4" />
          Generar nómina
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="size-4 text-sage" />
              <p className="text-xs text-espresso-light">Total nómina</p>
            </div>
            <p className="mt-1 text-2xl font-bold font-mono text-sage">
              ${totalPayroll.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <Banknote className="size-4 text-amber-600" />
              <p className="text-xs text-espresso-light">Bonificaciones</p>
            </div>
            <p className="mt-1 text-2xl font-bold font-mono text-amber-600">
              ${totalBonuses.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <Receipt className="size-4 text-rose-600" />
              <p className="text-xs text-espresso-light">Deducciones</p>
            </div>
            <p className="mt-1 text-2xl font-bold font-mono text-rose-600">
              ${totalDeductions.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-amber-600" />
              <p className="text-xs text-espresso-light">Pendientes</p>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
              {pendingCount > 0 && <Clock className="size-4 text-amber-500" />}
            </div>
          </div>
        </div>

        {/* Search + filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso-light" />
            <input
              type="text"
              placeholder="Buscar por nombre o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-sand bg-white py-2 pl-9 pr-3 text-sm text-espresso outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/30"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "paid", "pending", "held"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-rose-600 text-white"
                    : "bg-white text-espresso-light border border-sand hover:bg-cream"
                }`}
              >
                {status === "all" ? "Todas" : statusConfig[status].label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-sand bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand bg-cream/50 text-left text-xs font-medium text-espresso-light uppercase tracking-wider">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Empleado</th>
                <th className="px-4 py-3">Período</th>
                <th className="px-4 py-3 text-right">Salario</th>
                <th className="px-4 py-3 text-right">Bonos</th>
                <th className="px-4 py-3 text-right">Deducciones</th>
                <th className="px-4 py-3 text-right">Neto</th>
                <th className="px-4 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-espresso-light">
                    <Receipt className="mx-auto mb-2 size-8" />
                    <p>No se encontraron registros</p>
                  </td>
                </tr>
              ) : (
                filtered.map((record) => {
                  const status = statusConfig[record.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={record.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-rose-600">
                        {record.id}
                      </td>
                      <td className="px-4 py-3 font-medium text-espresso">
                        {record.employeeName}
                      </td>
                      <td className="px-4 py-3 text-espresso-light">{record.period}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-espresso-light">
                        ${record.baseSalary.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-sage">
                        {record.bonuses > 0 ? `+$${record.bonuses.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-rose-600">
                        -${(record.deductions + record.tax).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-espresso">
                        ${record.netPay.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                          <StatusIcon className="size-3" />
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
