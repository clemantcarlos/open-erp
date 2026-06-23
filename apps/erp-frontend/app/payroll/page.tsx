"use client";

import { useState } from "react";
import {
  Receipt,
  Search,
  ArrowLeft,
  Plus,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  Banknote,
} from "lucide-react";
import Link from "next/link";
import {
  payrollRecords,
  employees,
  getTotalPayroll,
  getTotalBonuses,
  getTotalDeductions,
} from "@/lib/data/payroll";

const statusConfig = {
  paid: { label: "Pagado", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: Clock },
  held: { label: "Retenido", color: "bg-red-100 text-red-700", icon: Banknote },
};

export default function PayrollPage() {
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
    <div className="min-h-screen bg-zinc-100">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <Receipt className="size-5 text-rose-500" />
          <h1 className="text-lg font-semibold">Nómina</h1>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-rose-500 px-3 py-2 text-sm font-medium text-white hover:bg-rose-600 transition-colors">
          <Plus className="size-4" />
          Generar nómina
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-rose-500" />
              <p className="text-xs text-zinc-500">Empleados</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-zinc-900">{employees.length}</p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="size-4 text-emerald-500" />
              <p className="text-xs text-zinc-500">Total nómina</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              ${totalPayroll.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Banknote className="size-4 text-amber-500" />
              <p className="text-xs text-zinc-500">Bonificaciones</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-amber-600">
              ${totalBonuses.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-rose-500" />
              <p className="text-xs text-zinc-500">Pendientes</p>
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-300"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "paid", "pending", "held"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-rose-500 text-white"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 border"
                }`}
              >
                {status === "all" ? "Todas" : statusConfig[status].label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
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
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-zinc-400">
                    <Receipt className="mx-auto mb-2 size-8" />
                    <p>No se encontraron registros</p>
                  </td>
                </tr>
              ) : (
                filtered.map((record) => {
                  const status = statusConfig[record.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={record.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-rose-500">
                        {record.id}
                      </td>
                      <td className="px-4 py-3 font-medium text-zinc-700">
                        {record.employeeName}
                      </td>
                      <td className="px-4 py-3 text-zinc-500">{record.period}</td>
                      <td className="px-4 py-3 text-right text-zinc-500">
                        ${record.baseSalary.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-600">
                        {record.bonuses > 0 ? `+$${record.bonuses.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-red-500">
                        -${(record.deductions + record.tax).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-zinc-900">
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
