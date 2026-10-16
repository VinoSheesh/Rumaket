"use client";

import Link from "next/link";
import { aboutContent } from "@/app/(main)/about/content";
import { ArrowUpRight, HeartHandshake } from "lucide-react";

export function AboutCTA() {
  const cta = aboutContent?.ctaSection || {
    badge: "Mulai Sekarang",
    title: "Siap membuat koordinasi keluarga lebih erat?",
    description:
      "Bergabunglah dengan ribuan keluarga Indonesia yang telah merasakan kemudahan merawat dan menjaga komunikasi bersama Rumaket.",
    primaryBtnText: "Mulai Ngrumat Gratis",
    primaryBtnLink: "/register",
    secondaryBtnText: "Pelajari Fitur",
    secondaryBtnLink: "#features",
  };

  return (
    <section className="relative w-full bg-white overflow-hidden">
      <div className="relative md:py-32 my-8 mx-6 bg-slate-950 text-white py-20 px-6 lg:px-8 overflow-hidden rounded-3xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-800 bg-slate-900/80 text-xs font-medium text-cyan-300 backdrop-blur-md">
            <HeartHandshake className="w-3.5 h-3.5 text-cyan-300" />
            <span>{cta.badge}</span>
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight max-w-2xl mx-auto">
            {cta.title}
          </h2>

          <p className="text-base md:text-lg text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
            {cta.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href={cta.primaryBtnLink}>
              <button className="flex items-center gap-3 bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm px-8 py-3.5 rounded-full shadow-xl transition-all group cursor-pointer">
                <span>{cta.primaryBtnText}</span>
                <span className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center transition-transform group-hover:scale-105">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </button>
            </Link>

            <Link href={cta.secondaryBtnLink}>
              <button className="px-7 py-3.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer">
                {cta.secondaryBtnText}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
