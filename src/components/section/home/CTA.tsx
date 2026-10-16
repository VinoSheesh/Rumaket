import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative w-full bg-white overflow-hidden">
      <div className="relative py-24 md:py-32 my-8 mx-6 bg-slate-900 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-section.jpg"
            alt="Keluarga Merawat Lansia"
            fill
            className="object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/30" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white md:text-6xl leading-[1.1]">
              Mulai langkah kecil <br />
              <span className="bg-gradient-to-r from-blue-300 via-blue-200 to-cyan-400 bg-clip-text text-transparent">
                untuk orang tersayang.
              </span>
            </h2>

            <p className="mt-6 text-sm sm:text-base md:text-lg leading-relaxed text-slate-300 font-normal">
              Merawat orang tua bukan beban, tapi bentuk bakti yang bisa dibagi
              bersama saudara. Buat ruang hangat untuk keluargamu sekarang.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link href="/register">
                <button className="flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm px-8 py-4 rounded-full shadow-xl transition-all group cursor-pointer">
                  <span>Mulai Ngrumat Bersama</span>
                  <span className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center transition-transform group-hover:scale-105">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </button>
              </Link>

              <Link href="/login">
                <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-sm px-7 py-4 rounded-full border border-white/20 backdrop-blur-md transition-all cursor-pointer">
                  <span>Sudah Punya Akun? Masuk</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-16 ">
          <div className="md:col-span-1">
            <span className="font-display text-2xl font-black tracking-tighter text-slate-900">
              RUMA<span className="text-blue-600">KET</span>
            </span>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Menghadirkan solusi kekeluargaan untuk mendekatkan jarak dan
              merawat orang tua dengan penuh cinta.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
              Eksplorasi
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link
                  href="#fitur"
                  className="hover:text-blue-600 transition-colors"
                >
                  Fitur Utama
                </Link>
              </li>
              <li>
                <Link
                  href="#cara-kerja"
                  className="hover:text-blue-600 transition-colors"
                >
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link
                  href="#tentang"
                  className="hover:text-blue-600 transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/rooms/join"
                  className="hover:text-blue-600 transition-colors"
                >
                  Gabung Room
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
              Dukungan
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-600 transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-600 transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-600 transition-colors"
                >
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">
              Keluarga Rumaket
            </h3>
            <p className="text-sm text-slate-600 mb-2">halo@rumaket.id</p>
            <p className="text-sm text-slate-600 mb-4">
              Dampingi orang tua dengan hati, kapan pun dan di mana pun.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Rumaket. Hak cipta dilindungi.</p>
          <p className="mt-2 sm:mt-0 font-medium text-slate-600">
            Dibuat dengan ❤️ untuk keluarga Indonesia.
          </p>
        </div>
      </div> */}
    </section>
  );
}
