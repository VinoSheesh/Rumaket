import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        
        <div className="grid gap-10 md:grid-cols-12">
          
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400 to-brand-600 text-sm font-bold text-white shadow-md transition-transform group-hover:scale-105">
                R
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-slate-900">
                Rumaket
              </span>
            </Link>
            
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
              <span className="font-semibold text-slate-900">Ngrumat lan Raket.</span>{" "}
              Satu ruang sederhana untuk keluarga saling bantu merawat 
              orang tercinta — dari mana saja.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Jelajahi
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#peran" className="text-slate-600 transition-colors hover:text-brand-700">
                  Siapa yang Bisa Ikut
                </a>
              </li>
              <li>
                <a href="#fitur" className="text-slate-600 transition-colors hover:text-brand-700">
                  Apa Saja Fiturnya
                </a>
              </li>
              <li>
                <a href="#cara-kerja" className="text-slate-600 transition-colors hover:text-brand-700">
                  Cara Mulai
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Keluarga
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/register" className="text-slate-600 transition-colors hover:text-brand-700">
                  Buat Ruang Keluarga
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-slate-600 transition-colors hover:text-brand-700">
                  Masuk dengan Kode Undangan
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-600 transition-colors hover:text-brand-700">
                  Sudah Punya Akun? Masuk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Rumaket. Dibuat dengan{" "}
            <Heart className="inline-block h-3 w-3 -translate-y-px fill-warmth-500 text-warmth-500" />{" "}
            untuk keluarga Indonesia.
          </p>
          
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <Link href="/privacy" className="transition-colors hover:text-slate-900">
              Privasi
            </Link>
            <Link href="/terms" className="transition-colors hover:text-slate-900">
              Ketentuan
            </Link>
            <Link href="/contact" className="transition-colors hover:text-slate-900">
              Hubungi Kami
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}