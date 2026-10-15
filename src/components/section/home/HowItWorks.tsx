import { STEPS } from "@/data/home";
import { UserPlus, Users, CalendarCheck, HeartPulse } from "lucide-react";

const STEP_ICONS = [UserPlus, Users, CalendarCheck, HeartPulse];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative  bg-white overflow-hidden">
      {/* Dekorasi Background Halus */}
      <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-brand-50 blur-3xl opacity-60" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-accent-50 blur-3xl opacity-60" />

      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Cara kerja Rumaket
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Empat langkah sederhana untuk memulai kolaborasi keluarga. Tidak
            perlu pelatihan teknis yang rumit.
          </p>
        </div>

        {/* Grid Horizontal */}
        <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Garis Penghubung Horizontal (Desktop only) */}
          <div
            className="absolute top-8 left-[12.5%] right-[12.5%] hidden h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent lg:block"
            aria-hidden="true"
          />

          {STEPS.map((s, idx) => {
            const Icon = STEP_ICONS[idx] || UserPlus;
            return (
              <div
                key={s.n}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Icon + Badge Nomor */}
                <div className="relative z-10 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border-2 border-brand-100 shadow-sm transition-all duration-300 group-hover:border-brand-300 group-hover:shadow-md group-hover:-translate-y-0.5">
                    <Icon className="h-7 w-7 text-brand-700" />
                  </div>

                  {/* Badge Nomor */}
                  <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-700 text-[10px] font-bold text-white shadow-md">
                    {s.n}
                  </span>
                </div>

                {/* Konten */}
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-1">
                  Langkah {s.n}
                </span>
                <h3 className="font-display text-base font-bold text-slate-900 md:text-lg">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 max-w-[240px]">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
