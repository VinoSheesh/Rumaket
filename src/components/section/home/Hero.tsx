import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex flex-col justify-end">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-section.jpg"
          alt="Rumaket Hero Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-200/20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 pb-16 pt-36 md:pb-20 md:pt-44 lg:px-8 lg:pt-52">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-end">
          <div className="flex flex-col justify-end lg:col-span-7">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-slate-950 bg-slate-800 overflow-hidden shadow-md"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="Keluarga"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-950 bg-white text-xs font-bold text-slate-900 shadow-md">
                  +
                </div>
              </div>
              <div className="text-xs md:text-sm text-slate-300 font-medium leading-tight">
                <p className="text-white font-semibold">Sudah bergabung</p>
                <p className="text-slate-400">10,000+ keluarga Indonesia</p>
              </div>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-[1.08] tracking-tight text-white md:text-6xl">
              Rawat orang tercinta, <br />
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                biar hubungan tetap rekat.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-sm sm:text-base md:text-lg leading-relaxed text-slate-300 font-normal">
              Satu ruang sederhana untuk keluarga saling bantu, bagi tugas jaga,
              ingat jadwal obat, dan titip pesan buat yang sedang menemani.
            </p>
          </div>

          <div className="flex flex-col lg:col-span-5 justify-start">
            <div className="max-w-sm flex flex-col items-start text-left">
              <p className="text-xs sm:text-sm md:text-base leading-relaxed text-slate-300 mb-6 font-normal">
                Sekarang, semua kabar tentang orang tua bisa dilihat dari satu
                tempat. Nggak perlu tanya-tanya lagi di grup WA.
              </p>

              <Link href="/register">
                <button className="flex items-center gap-3 bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm px-7 py-3.5 rounded-full shadow-xl transition-all group cursor-pointer">
                  <span>Mulai Ngrumat</span>
                  <span className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center transition-transform group-hover:scale-105">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
