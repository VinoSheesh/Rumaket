"use client";
import { FEATURES } from "@/data/home";
import { Calendar, FileText, Users, Bell, ArrowRight } from "lucide-react";

const FEATURE_ICONS = [Calendar, FileText, Users, Bell];

const ACCENTS = [
  {
    bg: "bg-accent-50",
    border: "border-accent-100",
    icon: "text-accent-700",
    dot: "bg-accent-400",
    hover: "hover:border-accent-300",
  },
  {
    bg: "bg-warmth-50",
    border: "border-warmth-100",
    icon: "text-warmth-600",
    dot: "bg-warmth-500",
    hover: "hover:border-warmth-300",
  },
  {
    bg: "bg-brand-50",
    border: "border-brand-100",
    icon: "text-brand-700",
    dot: "bg-brand-400",
    hover: "hover:border-brand-300",
  },
  {
    bg: "bg-slate-50",
    border: "border-slate-200",
    icon: "text-slate-700",
    dot: "bg-slate-400",
    hover: "hover:border-slate-300",
  },
];

export function Features() {
  return (
    <section
      id="fitur"
      className="relative overflow-hidden border-b border-slate-200 bg-slate-50"
    >
      <div className="absolute -top-20 left-1/4 -z-10 h-96 w-96 rounded-full bg-accent-50 blur-3xl opacity-60" />
      <div className="absolute bottom-0 right-0 -z-10 h-80 w-80 rounded-full bg-warmth-50 blur-3xl opacity-50" />

      <div className="mx-auto max-w-6xl px-6 pt-20 md:pt-28">
        <div className="mb-12 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Biar nggak ada <br />
              <span className="bg-gradient-to-r from-brand-700 to-accent-600 bg-clip-text text-transparent">
                yang kelupaan.
              </span>
            </h2>
          </div>
          <div className="md:col-span-5 md:pb-2">
            <p className="text-base leading-relaxed text-slate-600 md:text-lg">
              Hal-hal kecil yang sering bikin keluarga ribet, sekarang bisa
              beres dalam satu tempat. Tinggal geser, semua kelihatan.
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-8 pl-6 md:pl-[max(1.5rem,calc((100vw-72rem)/2))] pr-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {FEATURES.map((f, index) => {
            const Icon = FEATURE_ICONS[index] || Calendar;
            const accent = ACCENTS[index % ACCENTS.length];
            const isHighlight = index === 0;

            return (
              <div
                key={f.title}
                className={`group relative flex flex-shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl border bg-gradient-to-br p-7 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 md:p-8 ${
                  isHighlight
                    ? "w-[300px] md:w-[420px] from-white to-accent-50/40 border-accent-100"
                    : `w-[260px] md:w-[320px] from-white to-slate-50 ${accent.border} ${accent.hover}`
                }`}
              >
                <div
                  className={`absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl ${accent.dot} opacity-20`}
                />

                <div className="relative">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ${accent.icon}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="mt-6">
                    <h3
                      className={`font-display font-bold text-slate-900 ${
                        isHighlight ? "text-xl md:text-2xl" : "text-lg"
                      }`}
                    >
                      {f.title}
                    </h3>
                    <p
                      className={`mt-3 leading-relaxed text-slate-600 ${
                        isHighlight ? "text-sm md:text-base" : "text-sm"
                      }`}
                    >
                      {f.desc}
                    </p>
                  </div>
                </div>

                <div className="relative mt-8 flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    0{index + 1} / 0{FEATURES.length}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="w-2 flex-shrink-0 md:w-8" aria-hidden="true" />
        </div>

        <div className="pointer-events-none absolute right-0 top-0 bottom-8 hidden w-24 bg-gradient-to-l from-slate-50 to-transparent md:block" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
            Data keluarga dijaga aman
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            Bisa dibuka dari HP, tablet, atau laptop
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-warmth-500" />
            Sistem stabil, keluarga tenang
          </div>
        </div>
      </div>
    </section>
  );
}
