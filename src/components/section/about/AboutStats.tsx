"use client";

import { aboutContent } from "@/app/(main)/about/content";

export function AboutStats() {
  const { statsSection, stats } = aboutContent;

  return (
    <section className="w-full bg-slate-50/70 border-y border-slate-200/80 py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-2 block">
            {statsSection.label}
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
            {statsSection.title}
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-600">
            {statsSection.subheading}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center ${
                index > 0 ? "pt-6 md:pt-0 md:pl-8 lg:pl-12" : ""
              }`}
            >
              <div className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base font-bold text-slate-900 mb-1">
                {stat.label}
              </div>
              {stat.description && (
                <p className="text-xs md:text-sm text-slate-500 font-normal leading-relaxed max-w-[200px]">
                  {stat.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
