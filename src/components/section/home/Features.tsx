"use client";

import { FEATURES } from "@/data/home";
import { Calendar, FileText, Users, Bell, ArrowUpRight } from "lucide-react";

const FEATURE_ICONS = [Calendar, FileText, Users, Bell];

export function Features() {
  return (
    <section
      id="fitur"
      className="w-full bg-white text-slate-90"
    >
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3 block">
              Fitur Utama
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Biar nggak ada <br />
              <span className="text-slate-800/65">yang kelupaan.</span>
            </h2>
          </div>
          <div className="md:col-span-5 md:pb-1">
            <p className="text-base leading-relaxed text-slate-600 md:text-lg">
              Hal-hal kecil yang sering bikin keluarga ribet, sekarang bisa
              beres dalam satu tempat. Tinggal geser, semua kelihatan.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-b border-slate-200">
            {FEATURES.map((f, index) => {
              const Icon = FEATURE_ICONS[index] || Calendar;

              return (
                <div
                  key={f.title}
                  className="group flex flex-col justify-between p-8 md:p-10 transition-colors hover:bg-slate-50/80"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/80 transition-transform group-hover:scale-105">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-400">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-900 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {f.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                    <span>Terintegrasi</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-y-4 text-xs md:text-sm text-slate-500 font-medium">
          <div className="flex items-center gap-2.5">
            Data keluarga dijaga aman & privat
          </div>
          <div className="flex items-center gap-2.5">
            Dapat dibuka dari HP, tablet, atau laptop
          </div>
          <div className="flex items-center gap-2.5">
            Sistem stabil, keluarga tenang
          </div>
        </div>
      </div>
    </section>
  );
}
