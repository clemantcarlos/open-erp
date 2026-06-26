"use client";

import {
  Users,
  UserCheck,
  Star,
  UserPlus,
  ChevronRight,
  TrendingUp,
  Phone,
  Mail,
  ShoppingBag,
  StickyNote,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  customers,
  getTotalCustomers,
  getActiveCustomers,
  getVipCustomers,
  getNewCustomers,
  getRecentActivity,
  getInitials,
  getAvatarColor,
  segmentConfig,
} from "@/lib/data/crm";
import { getThisWeekVisits } from "@/lib/data/visits";

const activityIcons = {
  purchase: ShoppingBag,
  call: Phone,
  email: Mail,
  visit: UserCheck,
  note: StickyNote,
};

const activityColors = {
  purchase: "bg-sage/20 text-sage",
  call: "bg-teal-600/10 text-teal-600",
  email: "bg-teal-600/10 text-teal-600",
  visit: "bg-sage/20 text-sage",
  note: "bg-sand text-espresso-light",
};

export default function CRMPage() {
  const total = getTotalCustomers();
  const active = getActiveCustomers();
  const vip = getVipCustomers();
  const newCount = getNewCustomers();
  const recentActivity = getRecentActivity();

  const modules = [
    {
      name: "Clientes",
      description: `${total} clientes registrados`,
      href: "/crm/customers",
      icon: Users,
    },
    {
      name: "Visitas",
      description: `${getThisWeekVisits()} esta semana`,
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

        {/* Top customers */}
        <div className="mb-6 rounded-xl border border-sand bg-white">
          <div className="border-b border-sand px-4 py-3">
            <h2 className="text-sm font-semibold text-espresso">Mayor gasto</h2>
          </div>
          <div className="divide-y divide-sand">
            {[...customers]
              .sort((a, b) => b.totalSpent - a.totalSpent)
              .slice(0, 5)
              .map((customer) => {
                const segment = segmentConfig[customer.segment];
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
                      <p className="text-xs text-espresso-light">{customer.visits} visitas</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${segment.color}`}>
                      {segment.label}
                    </span>
                    <span className="text-sm font-semibold text-espresso font-mono">
                      ${customer.totalSpent.toLocaleString()}
                    </span>
                  </Link>
                );
              })}
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-xl border border-sand bg-white">
          <div className="border-b border-sand px-4 py-3">
            <h2 className="text-sm font-semibold text-espresso">Actividad Reciente</h2>
          </div>
          <div className="divide-y divide-sand">
            {recentActivity.map((activity) => {
              const ActivityIcon = activityIcons[activity.type];
              const colorClass = activityColors[activity.type];
              const customer = customers.find((c) => c.id === activity.customerId);
              return (
                <div key={activity.id} className="flex items-center gap-3 px-4 py-3">
                  <div className={`flex size-8 items-center justify-center rounded-full ${colorClass}`}>
                    <ActivityIcon className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-espresso">
                      {customer && (
                        <span className="font-medium">{customer.name}</span>
                      )}{" "}
                      {activity.description}
                    </p>
                    <p className="text-xs text-espresso-light">{activity.date}</p>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-semibold text-sage font-mono">
                      ${activity.amount.toFixed(2)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
