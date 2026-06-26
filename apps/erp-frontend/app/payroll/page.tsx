"use client";

import {
  Users,
  UserCheck,
  Clock,
  Calendar,
  DollarSign,
  AlertCircle,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  employees,
  getActiveEmployees,
  getTodayAttendance,
  getPendingLeaveRequests,
  payrollRecords,
  getTotalPayroll,
  getDepartments,
} from "@/lib/data/payroll";

export default function HRDashboardPage() {
  const activeEmployees = getActiveEmployees();
  const todayAttendance = getTodayAttendance();
  const pendingLeave = getPendingLeaveRequests();
  const totalPayroll = getTotalPayroll(payrollRecords);
  const departments = getDepartments();

  const presentToday = todayAttendance.filter((a) => a.status === "present" || a.status === "late").length;
  const absentToday = todayAttendance.filter((a) => a.status === "absent").length;

  const modules = [
    {
      name: "Empleados",
      description: `${activeEmployees.length} empleados activos`,
      href: "/payroll/employees",
      icon: Users,
      color: "text-sage",
      bg: "bg-sage/10",
    },
    {
      name: "Asistencia",
      description: `${presentToday} presentes hoy`,
      href: "/payroll/attendance",
      icon: Clock,
      color: "text-rose-600",
      bg: "bg-rose-100",
    },
    {
      name: "Permisos",
      description: `${pendingLeave.length} pendientes`,
      href: "/payroll/leave",
      icon: Calendar,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      name: "Nómina",
      description: `$${totalPayroll.toLocaleString()} este período`,
      href: "/payroll/payroll",
      icon: DollarSign,
      color: "text-rose-600",
      bg: "bg-rose-100",
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <Users className="size-5 text-rose-600" />
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Empleados" }]} />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-rose-600" />
              <p className="text-xs text-espresso-light">Total empleados</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-espresso">{employees.length}</p>
            <p className="text-[10px] text-sage">{activeEmployees.length} activos</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="size-4 text-sage" />
              <p className="text-xs text-espresso-light">Asistencia hoy</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-sage">{presentToday}</p>
            <p className="text-[10px] text-rose-600">{absentToday} ausentes</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-amber-600" />
              <p className="text-xs text-espresso-light">Permisos pendientes</p>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-bold text-amber-600">{pendingLeave.length}</p>
              {pendingLeave.length > 0 && <AlertCircle className="size-4 text-amber-500" />}
            </div>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="size-4 text-rose-600" />
              <p className="text-xs text-espresso-light">Departamentos</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-espresso">{departments.length}</p>
          </div>
        </div>

        {/* Module cards */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {modules.map((mod) => (
            <Link
              key={mod.name}
              href={mod.href}
              className="group flex items-center gap-4 rounded-xl border border-sand bg-white p-4 transition-all hover:-translate-y-0.5"
            >
              <div className={`flex size-12 items-center justify-center rounded-xl ${mod.bg}`}>
                <mod.icon className={`size-6 ${mod.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-espresso group-hover:text-rose-600 transition-colors">
                  {mod.name}
                </h3>
                <p className="text-sm text-espresso-light">{mod.description}</p>
              </div>
              <ChevronRight className="size-4 text-espresso-light/50 group-hover:text-rose-600 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Recent activity */}
        <div className="rounded-xl border border-sand bg-white">
          <div className="border-b border-sand px-4 py-3">
            <h2 className="text-sm font-semibold text-espresso">Actividad Reciente</h2>
          </div>
          <div className="divide-y divide-sand">
            {pendingLeave.map((leave) => (
              <div key={leave.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-amber-100">
                  <Calendar className="size-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-espresso">
                    <span className="font-medium">{leave.employeeName}</span> solicitó{" "}
                    {leave.type === "vacation" ? "vacaciones" : leave.type === "sick" ? "permiso médico" : "permiso personal"}
                  </p>
                  <p className="text-xs text-espresso-light">
                    {leave.startDate} — {leave.days} día{leave.days > 1 ? "s" : ""}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    leave.status === "approved"
                      ? "bg-sage/10 text-sage"
                      : leave.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-rose-100 text-rose-600"
                  }`}
                >
                  {leave.status === "approved" ? "Aprobado" : leave.status === "pending" ? "Pendiente" : "Rechazado"}
                </span>
              </div>
            ))}
            {todayAttendance
              .filter((a) => a.status === "late")
              .map((att) => (
                <div key={att.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-amber-100">
                    <Clock className="size-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-espresso">
                      <span className="font-medium">{att.employeeName}</span> llegó tarde
                    </p>
                    <p className="text-xs text-espresso-light">
                      Entrada: {att.clockIn} — {att.hoursWorked}h trabajadas
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    Tarde
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
