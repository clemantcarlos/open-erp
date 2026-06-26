import {
  Calculator,
  CheckCircle,
  Clock,
  XCircle,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  journalEntries,
  getJournalTotalDebit,
  getJournalTotalCredit,
} from "@/lib/data/accounting";
import { notFound } from "next/navigation";

const statusConfig = {
  posted: { label: "Contabilizado", color: "bg-sage/15 text-sage", icon: CheckCircle },
  draft: { label: "Borrador", color: "bg-indigo-600/15 text-indigo-600", icon: Clock },
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
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <BookOpen className="size-5 text-indigo-600" />
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Contabilidad", href: "/accounting" },
              { label: entry.id },
            ]}
          />
        </div>
        <div className="ml-auto">
          <p className="text-xs text-espresso-light">{entry.reference}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}>
          <StatusIcon className="size-3" />
          {status.label}
        </span>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* Entry info */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Fecha</p>
            <p className="mt-1 text-sm font-semibold text-espresso">{entry.date}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Descripción</p>
            <p className="mt-1 text-sm font-semibold text-espresso">{entry.description}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Referencia</p>
            <p className="mt-1 text-sm font-semibold text-espresso font-mono">{entry.reference}</p>
          </div>
          <div className="rounded-xl border border-sand bg-white p-4">
            <p className="text-xs text-espresso-light">Total</p>
            <p className="mt-1 text-sm font-bold text-indigo-600">${totalDebit.toFixed(2)}</p>
          </div>
        </div>

        {/* Journal lines */}
        <div className="rounded-xl border border-sand bg-white">
          <div className="flex items-center gap-2 border-b border-sand px-4 py-3">
            <BookOpen className="size-4 text-indigo-600" />
            <h2 className="text-sm font-semibold text-espresso">Partidas del Asiento</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand bg-cream/50 text-left text-xs font-medium text-espresso-light uppercase tracking-wider">
                <th className="px-4 py-3">Cuenta</th>
                <th className="px-4 py-3 text-right">Debe</th>
                <th className="px-4 py-3 text-right">Haber</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {entry.lines.map((line, i) => (
                <tr key={i} className="hover:bg-cream/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-espresso">{line.accountName}</p>
                    <p className="text-xs text-espresso-light font-mono">{line.accountId}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {line.debit > 0 ? (
                      <span className="font-mono font-semibold text-espresso">
                        ${line.debit.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-sand">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {line.credit > 0 ? (
                      <span className="font-mono font-semibold text-espresso">
                        ${line.credit.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-sand">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-sand bg-cream/50 font-semibold">
                <td className="px-4 py-3 text-espresso">Totales</td>
                <td className="px-4 py-3 text-right font-mono text-indigo-600">
                  ${totalDebit.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-indigo-600">
                  ${totalCredit.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Balance check */}
          <div className="border-t border-sand px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-espresso-light">¿Está balanceado?</span>
              {totalDebit === totalCredit ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-sage/15 px-3 py-1 text-xs font-medium text-sage">
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
