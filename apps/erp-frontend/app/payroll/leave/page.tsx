"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface LeaveRequest {
  id: string;
  employeeName: string;
  type: "vacation" | "sick" | "personal" | "maternity" | "unpaid";
  startDate: string;
  endDate: string;
  reason: string;
  status: "approved" | "pending" | "rejected";
}

const statusConfig = {
  approved: { label: "Aprobado", color: "bg-sage/10 text-sage", icon: CheckCircle },
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: Clock },
  rejected: { label: "Rechazado", color: "bg-rose-600/10 text-rose-600", icon: XCircle },
};

const typeConfig = {
  vacation: { label: "Vacaciones", color: "bg-sage/10 text-sage" },
  sick: { label: "Permiso médico", color: "bg-amber-100 text-amber-700" },
  personal: { label: "Personal", color: "bg-rose-600/10 text-rose-600" },
  maternity: { label: "Maternidad", color: "bg-rose-600/10 text-rose-600" },
  unpaid: { label: "No remunerado", color: "bg-cream text-espresso-light" },
};

export default function LeavePage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payroll/leave")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.data ?? []);
        setLeaveRequests(items.map((r: any) => ({
          id: r.id,
          employeeName: r.employeeName || r.employee?.name || "",
          type: r.type || "personal",
          startDate: r.startDate ? new Date(r.startDate).toISOString().split("T")[0] : "",
          endDate: r.endDate ? new Date(r.endDate).toISOString().split("T")[0] : "",
          reason: r.reason || "",
          status: r.status || "pending",
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = leaveRequests.filter((r) => {
    const matchesSearch = r.employeeName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = leaveRequests.filter((r) => r.status === "pending").length;
  const approvedCount = leaveRequests.filter((r) => r.status === "approved").length;
  const totalDays = leaveRequests.filter((r) => r.status === "approved").reduce((sum, r) => {
    if (!r.startDate || !r.endDate) return sum;
    const diff = (new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / 86400000;
    return sum + (diff > 0 ? diff + 1 : 1);
  }, 0);

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <Calendar className="size-5 text-rose-600" />
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Empleados", href: "/payroll" }, { label: "Permisos" }]} />
        </div>
        <button onClick={() => alert("Próximamente")} className="flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors">
          <Plus className="size-4" />
          Solicitar permiso
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-amber-600" />
              <p className="text-xs text-espresso-light">Pendientes</p>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
              {pendingCount > 0 && <AlertCircle className="size-4 text-amber-500" />}
            </div>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="size-4 text-sage" />
              <p className="text-xs text-espresso-light">Aprobados</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-sage">{approvedCount}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-rose-600" />
              <p className="text-xs text-espresso-light">Días tomados</p>
            </div>
            <p className="mt-1 text-2xl font-bold font-mono text-rose-600">{totalDays}</p>
          </div>
        </div>

        {/* Search + filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso-light" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-sand bg-white py-2 pl-9 pr-3 text-sm text-espresso outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/30"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "pending", "approved", "rejected"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-rose-600 text-white"
                    : "bg-white text-espresso-light border border-sand hover:bg-cream"
                }`}
              >
                {status === "all" ? "Todos" : statusConfig[status].label}
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
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Período</th>
                <th className="px-4 py-3 text-center">Días</th>
                <th className="px-4 py-3">Motivo</th>
                <th className="px-4 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-espresso-light">
                    <Calendar className="mx-auto mb-2 size-8" />
                    <p>No se encontraron permisos</p>
                  </td>
                </tr>
              ) : (
                filtered.map((request) => {
                  const status = statusConfig[request.status];
                  const StatusIcon = status.icon;
                  const type = typeConfig[request.type];
                  return (
                    <tr key={request.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-rose-600">
                        {request.id}
                      </td>
                      <td className="px-4 py-3 font-medium text-espresso">
                        {request.employeeName}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${type.color}`}>
                          {type.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-espresso-light">
                        {request.startDate}
                        {request.startDate !== request.endDate && ` — ${request.endDate}`}
                      </td>
                      <td className="px-4 py-3 text-center font-medium font-mono text-xs text-espresso">
                        {(() => {
                          if (!request.startDate || !request.endDate) return "—";
                          const diff = (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / 86400000;
                          return diff > 0 ? diff + 1 : 1;
                        })()}
                      </td>
                      <td className="px-4 py-3 text-espresso-light max-w-[200px] truncate">
                        {request.reason}
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
