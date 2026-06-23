import {
  Calculator,
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import {
  journalEntries,
  getJournalTotalDebit,
  getJournalTotalCredit,
} from "@/lib/data/accounting";
import { notFound } from "next/navigation";

const statusConfig = {
  posted: { label: "Contabilizado", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  draft: { label: "Borrador", color: "bg-amber-100 text-amber-700", icon: Clock },
  void: { label: "Anulado", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = journalEntries.find((e) => e.id === id);

  if (!entry) {
    notFound();
  }

  const status = statusConfig[entry.status];
  const StatusIcon = status.icon;
  const totalDebit = getJournalTotalDebit(entry);
  const totalCredit = getJournalTotalCredit(entry);

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/accounting"
            className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <BookOpen className="size-5 text-indigo-500" />
          <div>
            <h1 className="text-lg font-semibold">{entry.id}</h1>
            <p className="text-xs text-zinc-400">{entry.reference}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}>
          <StatusIcon className="size-3" />
          {status.label}
        </span>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* Entry info */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Fecha</p>
            <p className="mt-1 text-sm font-semibold text-zinc-700">{entry.date}</p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Descripción</p>
            <p className="mt-1 text-sm font-semibold text-zinc-700">{entry.description}</p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Referencia</p>
            <p className="mt-1 text-sm font-semibold text-zinc-700 font-mono">{entry.reference}</p>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-zinc-500">Total</p>
            <p className="mt-1 text-sm font-bold text-indigo-600">${totalDebit.toFixed(2)}</p>
          </div>
        </div>

        {/* Journal lines */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <BookOpen className="size-4 text-indigo-500" />
            <h2 className="text-sm font-semibold">Partidas del Asiento</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                <th className="px-4 py-3">Cuenta</th>
                <th className="px-4 py-3 text-right">Debe</th>
                <th className="px-4 py-3 text-right">Haber</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entry.lines.map((line, i) => (
                <tr key={i} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-700">{line.accountName}</p>
                    <p className="text-xs text-zinc-400 font-mono">{line.accountId}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {line.debit > 0 ? (
                      <span className="font-semibold text-zinc-700">
                        ${line.debit.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {line.credit > 0 ? (
                      <span className="font-semibold text-zinc-700">
                        ${line.credit.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 bg-zinc-50 font-semibold">
                <td className="px-4 py-3">Totales</td>
                <td className="px-4 py-3 text-right text-indigo-600">
                  ${totalDebit.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right text-indigo-600">
                  ${totalCredit.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Balance check */}
          <div className="border-t px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">¿Está balanceado?</span>
              {totalDebit === totalCredit ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  <CheckCircle className="size-3" />
                  Sí — Debe = Haber
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                  <XCircle className="size-3" />
                  No — Diferencia: ${Math.abs(totalDebit - totalCredit).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
