"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  MinusCircle,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface AttendanceRecord {
  id: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  hours: number;
  status: "present" | "absent" | "late" | "half_day";
}

const statusConfig = {
  present: { label: "Presente", color: "bg-sage/10 text-sage", icon: CheckCircle },
  absent: { label: "Ausente", color: "bg-rose-600/10 text-rose-600", icon: XCircle },
  late: { label: "Tarde", color: "bg-amber-100 text-amber-700", icon: AlertCircle },
  half_day: { label: "Medio día", color: "bg-sage/10 text-sage", icon: MinusCircle },
};

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payroll/attendance")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.data ?? []);
        setRecords(items.map((r: any) => ({
          id: r.id,
          employeeName: r.employeeName || r.employee?.name || "",
          date: r.date ? new Date(r.date).toISOString().split("T")[0] : "",
          checkIn: r.clockIn || "",
          checkOut: r.clockOut || null,
          hours: Number(r.hoursWorked) || 0,
          status: r.status || "present",
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const dates = [...new Set(records.map(r => r.date))].sort().reverse();

  const filtered = records.filter((r) => {
    const matchesSearch = r.employeeName.toLowerCase().includes(search.toLowerCase());
    const matchesDate = r.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  const dateRecords = records.filter((r) => r.date === selectedDate);
  const present = dateRecords.filter((r) => r.status === "present").length;
  const late = dateRecords.filter((r) => r.status === "late").length;
  const absent = dateRecords.filter((r) => r.status === "absent").length;
  const halfDay = dateRecords.filter((r) => r.status === "half_day").length;

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <Clock className="size-5 text-rose-600" />
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Empleados", href: "/payroll" }, { label: "Asistencia" }]} />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="size-4 text-sage" />
              <p className="text-xs text-espresso-light">Presentes</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-sage">{present}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-600" />
              <p className="text-xs text-espresso-light">Tardanzas</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-amber-600">{late}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <XCircle className="size-4 text-rose-600" />
              <p className="text-xs text-espresso-light">Ausentes</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-rose-600">{absent}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <MinusCircle className="size-4 text-sage" />
              <p className="text-xs text-espresso-light">Medio día</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-sage">{halfDay}</p>
          </div>
        </div>

        {/* Date selector + search */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1">
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedDate === date
                    ? "bg-rose-600 text-white"
                    : "bg-white text-espresso-light border border-sand hover:bg-cream"
                }`}
              >
                {date}
              </button>
            ))}
          </div>
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
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-sand bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand bg-cream/50 text-left text-xs font-medium text-espresso-light uppercase tracking-wider">
                <th className="px-4 py-3">Empleado</th>
                <th className="px-4 py-3 text-center">Entrada</th>
                <th className="px-4 py-3 text-center">Salida</th>
                <th className="px-4 py-3 text-right">Horas</th>
                <th className="px-4 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-espresso-light">
                    <Clock className="mx-auto mb-2 size-8" />
                    <p>No se encontraron registros</p>
                  </td>
                </tr>
              ) : (
                filtered.map((record) => {
                  const status = statusConfig[record.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={record.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-espresso">
                        {record.employeeName}
                      </td>
                      <td className="px-4 py-3 text-center text-espresso-light font-mono text-xs">
                        {record.checkIn || "—"}
                      </td>
                      <td className="px-4 py-3 text-center text-espresso-light font-mono text-xs">
                        {record.checkOut || "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium font-mono text-xs text-espresso">
                        {record.hours > 0 ? `${record.hours}h` : "—"}
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
