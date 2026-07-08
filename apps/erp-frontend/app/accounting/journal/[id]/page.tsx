"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface JournalLine {
  accountName: string;
  accountId: string;
  debit: number;
  credit: number;
}

interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  status: "posted" | "draft" | "void";
  lines: JournalLine[];
}

const statusConfig = {
  posted: { label: "Contabilizado", color: "bg-sage/15 text-sage", icon: CheckCircle },
  draft: { label: "Borrador", color: "bg-indigo-600/15 text-indigo-600", icon: Clock },
  void: { label: "Anulado", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function JournalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/accounting/journal/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setEntry(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Cargando asiento...</p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-espresso-light">Asiento no encontrado</p>
      </div>
    );
  }

  const status = statusConfig[entry.status];
  const StatusIcon = status.icon;
  const totalDebit = (entry.lines || []).reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = (entry.lines || []).reduce((sum, l) => sum + (Number(l.credit) || 0), 0);

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center gap-3">
          <BookOpen className="size-5 text-indigo-600" />
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Contabilidad", href: "/accounting" },
              { label: entry.id.slice(0, 8) },
            ]}
          />
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
              {(entry.lines || []).map((line, i) => (
                <tr key={i} className="hover:bg-cream/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-espresso">{line.accountName}</p>
                    <p className="text-xs text-espresso-light font-mono">{line.accountId}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {line.debit > 0 ? (
                      <span className="font-mono font-semibold text-espresso">${Number(line.debit).toFixed(2)}</span>
                    ) : (
                      <span className="text-sand">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {line.credit > 0 ? (
                      <span className="font-mono font-semibold text-espresso">${Number(line.credit).toFixed(2)}</span>
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
                <td className="px-4 py-3 text-right font-mono text-indigo-600">${totalDebit.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-mono text-indigo-600">${totalCredit.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          {/* Balance check */}
          <div className="border-t border-sand px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-espresso-light">¿Está balanceado?</span>
              {Math.abs(totalDebit - totalCredit) < 0.01 ? (
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
