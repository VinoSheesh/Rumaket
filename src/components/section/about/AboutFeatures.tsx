"use client";

import { aboutContent } from "@/app/(main)/about/content";
import {
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

export function AboutFeatures() {
  const { featuresSection, features, featuresGuarantees } = aboutContent;

  return (
    <section
      id="features"
      className="w-full bg-white text-slate-900 border-t border-slate-100"
    >
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-14 lg:px-8">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-3 block">
              {featuresSection.label}
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
              {featuresSection.headingMain} <br />
              <span className="text-slate-500 font-bold">
                {featuresSection.headingHighlight}
              </span>
            </h2>
          </div>
          <div className="md:col-span-5 md:pb-1">
            <p className="text-base leading-relaxed text-slate-600 md:text-lg font-normal">
              {featuresSection.subheading}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-b border-slate-200">
            {features.map((item, index) => {
              return (
                <div
                  key={item.title}
                  className="group flex flex-col justify-between p-8 lg:p-9 transition-all hover:bg-slate-50/80"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-cyan-100/80 transition-transform group-hover:scale-105">
                        {/* <Icon className="w-6 h-6" /> */}
                        <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-cyan-600 transition-colors">
                          {item.id || `0${index + 1}`}
                        </span>
                      </div>
                      {/* <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-cyan-600 transition-colors">
                        {item.id || `0${index + 1}`}
                      </span> */}
                    </div>

                    <h3 className="font-display text-lg font-bold text-slate-950 mb-3 group-hover:text-cyan-950 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 font-normal">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                      {item.tag}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-6 text-xs md:text-sm text-slate-600 font-medium">
          {featuresGuarantees.map((guarantee, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>{guarantee}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
