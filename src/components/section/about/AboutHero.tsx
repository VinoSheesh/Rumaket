import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Heart, Shield, Users } from "lucide-react";

export function AboutHero() {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden bg-slate-950 flex flex-col justify-end">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/about-hero.jpg"
          alt="Tentang Rumaket"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 pb-16 pt-36 md:pb-20 md:pt-44 lg:px-8 lg:pt-52">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 items-end">
          <div className="flex flex-col justify-end lg:col-span-7">
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-800 bg-slate-900/80 text-xs font-medium text-cyan-300 backdrop-blur-md">
                <span>Tentang Rumaket</span>
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-[1.08] tracking-tight text-white md:text-6xl">
              Lahir dari kasih, <br />
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                tumbuh untuk merawat bersama.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-sm sm:text-base md:text-lg leading-relaxed text-slate-300 font-normal">
              Rumaket hadir dari kerinduan akan ruang aman bagi setiap keluarga
              dalam mendampingi anggota keluarga tercinta dengan lebih ringan,
              teratur, dan penuh kehangatan.
            </p>
          </div>

          <div className="flex flex-col lg:col-span-5 justify-start">
            <div className="max-w-sm flex flex-col items-start text-left">
              <p className="text-xs sm:text-sm md:text-base leading-relaxed text-slate-300 mb-6 font-normal">
                Kami percaya bahwa tugas merawat tak seharusnya dipikul
                sendirian. Satu ikatan erat dimulai dari kemudahan saling
                koordinasi.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
                <Link href="#journey">
                  <button className="flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm px-7 py-3.5 rounded-full shadow-xl transition-all group cursor-pointer w-full sm:w-auto">
                    <span>Lihat Perjalanan Kami</span>
                    <span className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center transition-transform group-hover:scale-105">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
