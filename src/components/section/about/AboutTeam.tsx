"use client";

import Image from "next/image";
import { aboutContent } from "@/app/(main)/about/content";
import { Users } from "lucide-react";

export function AboutTeam() {
  const team = aboutContent?.teamSection || {
    label: "Dibalik Layar",
    title: "Tim pencipta, desainer, & pemecah masalah",
    subheading:
      "Kami adalah sekelompok individu yang berdedikasi menciptakan ruang digital yang aman dan hangat bagi seluruh keluarga Indonesia.",
    imageSrc: "/images/team-full.jpg",
    imageAlt: "Tim Pengembang Rumaket",
    badgeText: "Tim Pengembang & Kreator Rumaket",
  };

  return (
    <section className="w-full bg-white text-slate-900 py-20 px-6 lg:px-8 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              <Users className="w-3.5 h-3.5 text-cyan-600" />
              <span>{team.label}</span>
            </div>

            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
              {team.title}
            </h2>

            <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed">
              {team.subheading}
            </p>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                <p className="text-sm font-semibold text-slate-800">
                  {team.badgeText}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-100">
              <Image
                src={team.imageSrc}
                alt={team.imageAlt}
                fill
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}