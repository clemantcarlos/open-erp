"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  Star,
  UserPlus,
  ChevronRight,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  segment: string;
  createdAt: string;
}

const avatarColors = [
  "bg-teal-100 text-teal-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
];

const segmentConfig: Record<string, { label: string; color: string }> = {
  vip: { label: "VIP", color: "bg-amber-100 text-amber-700" },
  regular: { label: "Regular", color: "bg-teal-100 text-teal-700" },
  new: { label: "Nuevo", color: "bg-sky-100 text-sky-700" },
  inactive: { label: "Inactivo", color: "bg-zinc-100 text-zinc-500" },
};

function getAvatarColor(id: string) {
  const index = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % avatarColors.length;
  return avatarColors[index];
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export default function CRMPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.data ?? []);
        setCustomers(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const total = customers.length;
  const active = customers.filter((c) => c.segment !== "inactive").length;
  const vip = customers.filter((c) => c.segment === "vip").length;
  const newCount = customers.filter((c) => c.segment === "new").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando CRM...</p>
      </div>
    );
  }

  const modules = [
    {
      name: "Clientes",
      description: `${total} clientes registrados`,
      href: "/crm/customers",
      icon: Users,
    },
    {
      name: "Visitas",
      description: "Gestión de visitas",
      href: "/crm/visits",
      icon: MapPin,
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 px-6 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Users className="size-5 text-teal-600" />
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "CRM" }]} />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-teal-600" />
              <p className="text-xs text-espresso-light">Total clientes</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-espresso">{total}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="size-4 text-sage" />
              <p className="text-xs text-espresso-light">Activos</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-sage">{active}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <Star className="size-4 text-amber-500" />
              <p className="text-xs text-espresso-light">VIP</p>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-bold text-amber-600">{vip}</p>
              {vip > 0 && <Star className="size-4 text-amber-500" />}
            </div>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <UserPlus className="size-4 text-teal-600" />
              <p className="text-xs text-espresso-light">Nuevos</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-teal-600">{newCount}</p>
          </div>
        </div>

        {/* Module cards */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {modules.map((mod) => (
            <Link
              key={mod.name}
              href={mod.href}
              className="group flex items-center gap-4 rounded-xl border border-sand bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-teal-400/30"
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-teal-600/10">
                <mod.icon className="size-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-espresso group-hover:text-teal-600 transition-colors">
                  {mod.name}
                </h3>
                <p className="text-sm text-espresso-light">{mod.description}</p>
              </div>
              <ChevronRight className="size-4 text-sand group-hover:text-teal-600 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Customer list */}
        <div className="rounded-xl border border-sand bg-white">
          <div className="border-b border-sand px-4 py-3">
            <h2 className="text-sm font-semibold text-espresso">Clientes Recientes</h2>
          </div>
          <div className="divide-y divide-sand">
            {customers.slice(0, 10).map((customer) => {
              const segment = segmentConfig[customer.segment] || segmentConfig.regular;
              return (
                <Link
                  key={customer.id}
                  href={`/crm/customers/${customer.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-cream/50 transition-colors"
                >
                  <div
                    className={`flex size-9 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(customer.id)}`}
                  >
                    {getInitials(customer.name)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-espresso">{customer.name}</p>
                    <p className="text-xs text-espresso-light">{customer.email || customer.phone || "Sin contacto"}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${segment.color}`}>
                    {segment.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
