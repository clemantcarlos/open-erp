export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-4 border-sand border-t-rose-600" />
        <p className="text-sm text-espresso-light">Cargando...</p>
      </div>
    </div>
  );
}
