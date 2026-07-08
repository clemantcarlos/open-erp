"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: "active" | "on_leave" | "terminated";
}

const statusConfig = {
  active: { label: "Activo", color: "bg-sage/10 text-sage" },
  on_leave: { label: "Permiso", color: "bg-amber-100 text-amber-700" },
  terminated: { label: "Inactivo", color: "bg-rose-600/10 text-rose-600" },
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", position: "", department: "", salary: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/payroll/employees")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.data ?? []);
        setEmployees(items.map((e: any) => ({
          id: e.id,
          name: e.name,
          email: e.email || "",
          phone: e.phone || "",
          position: e.position || "",
          department: e.department || "",
          status: e.status || "active",
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const departments = ["Todos", ...new Set(employees.map(e => e.department).filter(Boolean))];

  const filtered = employees.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === "Todos" || e.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <Users className="size-5 text-rose-600" />
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Empleados", href: "/payroll" }, { label: "Directorio" }]} />
        </div>
        <button onClick={() => alert("Próximamente")} className="flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors">
          <Plus className="size-4" />
          Nuevo empleado
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Search + filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso-light" />
            <input
              type="text"
              placeholder="Buscar por nombre, ID o puesto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-sand bg-white py-2 pl-9 pr-3 text-sm text-espresso outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/30"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDepartmentFilter(dept)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  departmentFilter === dept
                    ? "bg-rose-600 text-white"
                    : "bg-white text-espresso-light border border-sand hover:bg-cream"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Employee grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((employee) => {
            const status = statusConfig[employee.status];
            return (
              <Link
                key={employee.id}
                href={`/payroll/employees/${employee.id}`}
                className="group rounded-xl border border-sand bg-white p-4 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-600">
                      {employee.name.charAt(0)}
                    </span>
                    <div>
                      <h3 className="font-semibold text-espresso group-hover:text-rose-600 transition-colors">
                        {employee.name}
                      </h3>
                      <p className="text-xs text-espresso-light">{employee.position}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-espresso-light">
                    <Briefcase className="size-3" />
                    {employee.department}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-espresso-light">
                    <Mail className="size-3" />
                    {employee.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-espresso-light">
                    <Phone className="size-3" />
                    {employee.phone}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-sand pt-3">
                  <span className="text-xs text-espresso-light">
                    {employee.department}
                  </span>
                  <ChevronRight className="size-4 text-espresso-light/50 group-hover:text-rose-600 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
