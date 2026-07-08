"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Heart,
  AlertCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  address: string;
  birthDate: string;
  bloodType: string;
  emergencyContact: string;
  emergencyPhone: string;
  status: "active" | "on_leave" | "terminated";
}

const statusConfig = {
  active: { label: "Activo", color: "bg-sage/10 text-sage" },
  on_leave: { label: "En Permiso", color: "bg-amber-100 text-amber-700" },
  terminated: { label: "Inactivo", color: "bg-rose-600/10 text-rose-600" },
};

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    params.then(({ id }) => {
      setEmployeeId(id);
      fetch(`/api/payroll/employees/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setEmployee(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [params]);

  async function handleDelete() {
    if (!confirm("¿Eliminar este empleado?")) return;
    await fetch(`/api/payroll/employees/${employeeId}`, { method: "DELETE" });
    router.push("/payroll/employees");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando empleado...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Empleado no encontrado</p>
      </div>
    );
  }

  const status = statusConfig[employee.status];

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Empleados", href: "/payroll" },
              { label: "Directorio", href: "/payroll/employees" },
              { label: employee.name },
            ]}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
          <button
            onClick={() => router.push("/payroll/employees")}
            className="rounded-lg bg-sand/50 p-1.5 text-espresso-light hover:bg-sand transition-colors"
          >
            <Pencil className="size-4" />
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg bg-rose-600/10 p-1.5 text-rose-600 hover:bg-rose-600/20 transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* Quick info */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Departamento</p>
            <p className="mt-1 text-sm font-semibold text-espresso">{employee.department}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Salario</p>
            <p className="mt-1 text-sm font-bold font-mono text-rose-600">${employee.salary?.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Fecha de ingreso</p>
            <p className="mt-1 text-sm font-semibold text-espresso">{employee.hireDate}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Posición</p>
            <p className="mt-1 text-sm font-semibold text-espresso">{employee.position}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Contact info */}
          <div className="rounded-xl border border-sand bg-white">
            <div className="flex items-center gap-2 border-b border-sand px-4 py-3">
              <Mail className="size-4 text-rose-600" />
              <h2 className="text-sm font-semibold text-espresso">Información de Contacto</h2>
            </div>
            <div className="divide-y divide-sand">
              <div className="flex items-center gap-3 px-4 py-3">
                <Mail className="size-4 text-espresso-light" />
                <div>
                  <p className="text-xs text-espresso-light">Email</p>
                  <p className="text-sm text-espresso">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Phone className="size-4 text-espresso-light" />
                <div>
                  <p className="text-xs text-espresso-light">Teléfono</p>
                  <p className="text-sm text-espresso">{employee.phone}</p>
                </div>
              </div>
              {employee.address && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <MapPin className="size-4 text-espresso-light" />
                  <div>
                    <p className="text-xs text-espresso-light">Dirección</p>
                    <p className="text-sm text-espresso">{employee.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Emergency contact */}
          <div className="rounded-xl border border-sand bg-white">
            <div className="flex items-center gap-2 border-b border-sand px-4 py-3">
              <AlertCircle className="size-4 text-rose-600" />
              <h2 className="text-sm font-semibold text-espresso">Contacto de Emergencia</h2>
            </div>
            <div className="divide-y divide-sand">
              {employee.emergencyContact && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <Heart className="size-4 text-espresso-light" />
                  <div>
                    <p className="text-xs text-espresso-light">Nombre</p>
                    <p className="text-sm text-espresso">{employee.emergencyContact}</p>
                  </div>
                </div>
              )}
              {employee.emergencyPhone && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <Phone className="size-4 text-espresso-light" />
                  <div>
                    <p className="text-xs text-espresso-light">Teléfono</p>
                    <p className="text-sm text-espresso">{employee.emergencyPhone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
