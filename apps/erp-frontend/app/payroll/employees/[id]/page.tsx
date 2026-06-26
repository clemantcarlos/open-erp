import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { employees, payrollRecords } from "@/lib/data/payroll";
import { notFound } from "next/navigation";

const statusConfig = {
  active: { label: "Activo", color: "bg-sage/10 text-sage" },
  on_leave: { label: "En Permiso", color: "bg-amber-100 text-amber-700" },
  terminated: { label: "Inactivo", color: "bg-rose-600/10 text-rose-600" },
};

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employee = employees.find((e) => e.id === id);

  if (!employee) {
    notFound();
  }

  const status = statusConfig[employee.status];
  const employeePayroll = payrollRecords.filter((r) => r.employeeId === employee.id);
  const lastPayroll = employeePayroll[0];

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
        <div className="ml-auto flex items-center gap-3">
          <span className="text-3xl">{employee.avatar}</span>
          <div>
            <p className="text-xs text-espresso-light">{employee.position}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.color}`}>
          {status.label}
        </span>
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
            <p className="mt-1 text-sm font-bold font-mono text-rose-600">${employee.salary.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Fecha de ingreso</p>
            <p className="mt-1 text-sm font-semibold text-espresso">{employee.hireDate}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Tipo de sangre</p>
            <p className="mt-1 text-sm font-semibold text-espresso">{employee.bloodType}</p>
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
              <div className="flex items-center gap-3 px-4 py-3">
                <MapPin className="size-4 text-espresso-light" />
                <div>
                  <p className="text-xs text-espresso-light">Dirección</p>
                  <p className="text-sm text-espresso">{employee.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Calendar className="size-4 text-espresso-light" />
                <div>
                  <p className="text-xs text-espresso-light">Fecha de nacimiento</p>
                  <p className="text-sm text-espresso">{employee.birthDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency contact */}
          <div className="rounded-xl border border-sand bg-white">
            <div className="flex items-center gap-2 border-b border-sand px-4 py-3">
              <AlertCircle className="size-4 text-rose-600" />
              <h2 className="text-sm font-semibold text-espresso">Contacto de Emergencia</h2>
            </div>
            <div className="divide-y divide-sand">
              <div className="flex items-center gap-3 px-4 py-3">
                <Heart className="size-4 text-espresso-light" />
                <div>
                  <p className="text-xs text-espresso-light">Nombre</p>
                  <p className="text-sm text-espresso">{employee.emergencyContact}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Phone className="size-4 text-espresso-light" />
                <div>
                  <p className="text-xs text-espresso-light">Teléfono</p>
                  <p className="text-sm text-espresso">{employee.emergencyPhone}</p>
                </div>
              </div>
            </div>

            {/* Last payroll */}
            {lastPayroll && (
              <div className="border-t border-sand px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="size-4 text-rose-600" />
                  <h3 className="text-sm font-semibold text-espresso">Última Nómina</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-espresso-light">Período</p>
                    <p className="font-medium text-espresso">{lastPayroll.period}</p>
                  </div>
                  <div>
                    <p className="text-xs text-espresso-light">Neto</p>
                    <p className="font-bold font-mono text-rose-600">${lastPayroll.netPay.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
