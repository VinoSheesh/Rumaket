import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50">
      {/* Ambient blur decorations */}
      <div className="absolute -top-20 right-1/4 -z-10 h-96 w-96 rounded-full bg-accent-100 blur-3xl opacity-40" />
      <div className="absolute top-1/2 left-0 -z-10 h-80 w-80 rounded-full bg-warmth-100 blur-3xl opacity-30" />
      <div className="absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-brand-100 blur-3xl opacity-25" />

      <header className="relative z-10 px-6 py-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400 to-brand-600 text-sm font-bold text-white shadow-lg transition-transform group-hover:scale-105">
            R
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-slate-900">
            Rumaket
          </span>
        </Link>
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
