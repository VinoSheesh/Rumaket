"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out ${
        isScrolled ? "px-4 pt-4 md:px-6 md:pt-6" : "px-0 pt-0"
      }`}
    >
      <header
        className={`w-full transition-all duration-500 ease-in-out ${
          isScrolled
            ? "max-w-6xl rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-2xl shadow-2xl shadow-slate-950/50 py-3"
            : "max-w-full rounded-none border-b border-transparent bg-transparent py-5"
        }`}
      >
        <div
          className={`mx-auto flex items-center justify-between transition-all duration-500 ${
            isScrolled ? "px-5 md:px-8" : "px-6 md:px-12 lg:px-16"
          }`}
        >
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="font-display text-2xl font-black tracking-tighter text-white">
              RUMA<span className="text-blue-500">KET</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <a
              href="#feature"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-200/80 transition-all hover:underline hover:decoration-2 underline-offset-2 hover:font-semibold hover:text-white cursor-pointer"
            >
              Fitur
            </a>
            <a
              href="#how-it-works"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-200/80 transition-all hover:underline hover:decoration-2 underline-offset-2 hover:font-semibold hover:text-white cursor-pointer"
            >
              Cara Kerja
            </a>
            <a
              href="/about"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-200/80 transition-all hover:underline hover:decoration-2 underline-offset-2 hover:font-semibold hover:text-white cursor-pointer"
            >
              Tentang Rumaket
            </a>
          </nav>

          <div>
            <Link href="/register">
              <button className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-medium text-sm px-5 py-2.5 rounded-full border border-white-500/40 backdrop-blur-md shadow-lg transition-all group cursor-pointer">
                <span>Daftar Sekarang</span>
                <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center transition-transform group-hover:scale-105">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
