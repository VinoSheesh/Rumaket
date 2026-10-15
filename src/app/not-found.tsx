import Link from "next/link";
import { ArrowLeft, HeartHandshake, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-screen w-screen bg-gray-50 flex items-center justify-center px-6 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neutral-100/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center">
        <span className="font-mono text-xs font-bold uppercase tracking-widest justify-center align-middle text-blue-950/60">
          404 — Halaman Tidak Ditemukan
        </span>

        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Sepertinya Anda salah langkah, tapi tidak apa-apa.
        </h1>

        <p className="mt-3 text-base leading-relaxed text-gray-600 font-normal">
          Halaman yang Anda cari mungkin sudah dipindahkan atau kodenya tidak
          sesuai. Mari kembali ke ruang hangat kita bersama.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm px-6 py-3.5 rounded-full shadow-lg transition-all cursor-pointer">
              <Home className="w-4 h-4" />
              <span>Ke Dashboard</span>
            </button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-medium text-sm px-6 py-3.5 rounded-full border border-white/10 backdrop-blur-md transition-all cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </button>
          </Link>
        </div>

        <p className="mt-12 text-xs text-slate-500 font-medium">
          RUMAKET — Mendekatkan yang jauh, merawat yang tersayang.
        </p>
      </div>
    </div>
  );
}
