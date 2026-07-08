"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="rounded-xl border border-sand bg-white p-8 text-center shadow-sm max-w-md">
        <p className="text-4xl mb-4">⚠️</p>
        <h1 className="text-xl font-bold text-espresso mb-2">Algo salió mal</h1>
        <p className="text-sm text-espresso-light mb-6">
          {error.message || "Ocurrió un error inesperado."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="rounded-lg border border-sand bg-white px-4 py-2 text-sm font-medium text-espresso hover:bg-cream transition-colors"
          >
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
