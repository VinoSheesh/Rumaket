"use client";

import Image from "next/image";
import { aboutContent } from "@/app/(main)/about/content";

export function AboutJourney() {
  return (
    <section className="py-20 px-6 lg:px-12 bg-white text-slate-900" id="journey">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
          <Image
            src="/images/about-journey.jpg"
            alt="Perjalanan Rumaket"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-slate-900" />
              <span>{aboutContent.journey.label}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
              {aboutContent.journey.title}
            </h2>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed font-normal">
              {aboutContent.journey.description}
            </p>
          </div>

          <div className="space-y-6 pt-6 border-t border-slate-200/80">
            <div className="flex items-start gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  {aboutContent.vision.title}
                </h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {aboutContent.vision.description}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  {aboutContent.mission.title}
                </h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {aboutContent.mission.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
