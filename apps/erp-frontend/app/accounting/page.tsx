"use client";

import { useState, useEffect } from "react";
import {
  Calculator,
  Search,
  Plus,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Scale,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { formatCurrency } from "@/lib/format";

interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  status: "posted" | "draft" | "void";
  lines: { accountId: string; accountName: string; debit: number; credit: number }[];
}

interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  balance: number;
}

const statusConfig = {
  posted: { label: "Contabilizado", color: "bg-sage/15 text-sage", icon: CheckCircle },
  draft: { label: "Borrador", color: "bg-indigo-600/15 text-indigo-600", icon: Clock },
  void: { label: "Anulado", color: "bg-red-100 text-red-700", icon: XCircle },
};

function getDebitTotal(lines: JournalEntry["lines"]) {
  return lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
}

function getCreditTotal(lines: JournalEntry["lines"]) {
  return lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
}

export default function AccountingPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "posted" | "draft" | "void">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/accounting/journal").then((r) => r.json()),
      fetch("/api/accounting/accounts").then((r) => r.json()),
    ]).then(([journalData, accountsData]) => {
      setEntries(Array.isArray(journalData) ? journalData.map((e: any) => ({
        ...e,
        date: new Date(e.date).toISOString().split("T")[0],
        lines: Array.isArray(e.lines) ? e.lines : [],
      })) : []);
      setAccounts(Array.isArray(accountsData) ? accountsData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = entries.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.reference.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate summary from accounts
  const totalAssets = accounts.filter((a) => a.type === "asset").reduce((sum, a) => sum + Number(a.balance), 0);
  const totalLiabilities = accounts.filter((a) => a.type === "liability").reduce((sum, a) => sum + Number(a.balance), 0);
  const totalEquity = accounts.filter((a) => a.type === "equity").reduce((sum, a) => sum + Number(a.balance), 0);
  const totalRevenue = accounts.filter((a) => a.type === "revenue").reduce((sum, a) => sum + Number(a.balance), 0);
  const totalExpenses = accounts.filter((a) => a.type === "expense").reduce((sum, a) => sum + Number(a.balance), 0);
  const netIncome = totalRevenue - totalExpenses;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando contabilidad...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <Calculator className="size-5 text-indigo-600" />
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Contabilidad" }]} />
        </div>
        <button onClick={() => alert("Próximamente")} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
          <Plus className="size-4" />
          Nuevo asiento
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Balance equation */}
        <div className="mb-6 rounded-xl border border-sand bg-white p-6">
          <h2 className="mb-4 text-xs font-semibold text-espresso-light uppercase tracking-wider">
            Balance General
          </h2>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <div className="flex flex-col items-center rounded-xl bg-indigo-600/5 px-6 py-4">
              <ArrowUpRight className="mb-1 size-4 text-indigo-600" />
              <p className="text-[10px] text-espresso-light uppercase">Activos</p>
              <p className="text-2xl font-bold text-espresso">
                {formatCurrency(totalAssets)}
              </p>
            </div>
            <span className="text-2xl font-light text-sand">=</span>
            <div className="flex flex-col items-center rounded-xl bg-indigo-600/5 px-6 py-4">
              <ArrowDownRight className="mb-1 size-4 text-indigo-600" />
              <p className="text-[10px] text-espresso-light uppercase">Pasivos</p>
              <p className="text-2xl font-bold text-espresso">
                {formatCurrency(totalLiabilities)}
              </p>
            </div>
            <span className="text-2xl font-light text-sand">+</span>
            <div className="flex flex-col items-center rounded-xl bg-indigo-600/5 px-6 py-4">
              <Scale className="mb-1 size-4 text-indigo-600" />
              <p className="text-[10px] text-espresso-light uppercase">Patrimonio</p>
              <p className="text-2xl font-bold text-espresso">
                {formatCurrency(totalEquity)}
              </p>
            </div>
            {Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01 && (
              <span className="rounded-full bg-sage/15 px-3 py-1 text-xs font-medium text-sage">
                ✓ Balanceado
              </span>
            )}
          </div>
        </div>

        {/* Income summary */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-sage" />
              <p className="text-xs text-espresso-light">Ingresos</p>
            </div>
            <p className="mt-1 text-xl font-bold text-sage">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="size-4 text-indigo-600" />
              <p className="text-xs text-espresso-light">Gastos</p>
            </div>
            <p className="mt-1 text-xl font-bold text-indigo-600">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="size-4 text-indigo-600" />
              <p className="text-xs text-espresso-light">Resultado Neto</p>
            </div>
            <p className={`mt-1 text-xl font-bold ${netIncome >= 0 ? "text-sage" : "text-indigo-600"}`}>
              {formatCurrency(netIncome)}
            </p>
          </div>
        </div>

        {/* Search + filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso-light" />
            <input
              type="text"
              placeholder="Buscar por descripción, ID o referencia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-sand bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "posted", "draft", "void"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-espresso-light hover:bg-cream border border-sand"
                }`}
              >
                {status === "all" ? "Todos" : statusConfig[status].label}
              </button>
            ))}
          </div>
        </div>

        {/* Journal entries table */}
        <div className="overflow-hidden rounded-xl border border-sand bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand bg-cream/50 text-left text-xs font-medium text-espresso-light uppercase tracking-wider">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Referencia</th>
                <th className="px-4 py-3 text-right">Debe</th>
                <th className="px-4 py-3 text-right">Haber</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-espresso-light">
                    <Calculator className="mx-auto mb-2 size-8" />
                    <p>No se encontraron asientos</p>
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => {
                  const status = statusConfig[entry.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={entry.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-indigo-600">
                        {entry.id}
                      </td>
                      <td className="px-4 py-3 text-espresso-light">{entry.date}</td>
                      <td className="px-4 py-3 font-medium text-espresso">
                        {entry.description}
                      </td>
                      <td className="px-4 py-3 text-espresso-light font-mono text-xs">
                        {entry.reference}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-espresso">
                        {formatCurrency(getDebitTotal(entry.lines))}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-espresso">
                        {formatCurrency(getCreditTotal(entry.lines))}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                          <StatusIcon className="size-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/accounting/journal/${entry.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-cream px-2 py-1 text-xs text-espresso-light hover:bg-sand transition-colors"
                        >
                          <Eye className="size-3" />
                          Ver
                        </Link>
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
