"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

interface HeaderProps {
  isLoggedIn?: boolean;
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            ? "max-w-6xl rounded-4xl border border-white/10 bg-slate-950/80 backdrop-blur-2xl shadow-2xl shadow-slate-950/50 py-3"
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
            <Link
              href="/#feature"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-200/80 transition-all hover:underline hover:decoration-2 underline-offset-2 hover:font-semibold hover:text-white cursor-pointer"
            >
              Fitur
            </Link>
            <Link
              href="/#how-it-works"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-200/80 transition-all hover:underline hover:decoration-2 underline-offset-2 hover:font-semibold hover:text-white cursor-pointer"
            >
              Cara Kerja
            </Link>
            <a
              href="/about"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-200/80 transition-all hover:underline hover:decoration-2 underline-offset-2 hover:font-semibold hover:text-white cursor-pointer"
            >
              Tentang Rumaket
            </a>
          </nav>

          <div className="hidden md:block">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <button className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-medium text-sm px-5 py-2.5 rounded-full backdrop-blur-md shadow-lg transition-all group cursor-pointer">
                  <span>Area Keluarga</span>
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center transition-transform group-hover:scale-105">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-medium text-sm px-5 py-2.5 rounded-full backdrop-blur-md shadow-lg transition-all group cursor-pointer">
                  <span>Mulai Sekarang</span>
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center transition-transform group-hover:scale-105">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-4 right-4 mt-2 rounded-3xl border border-white/15 bg-slate-900/95 backdrop-blur-2xl p-6 shadow-2xl shadow-slate-950/80 flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-200">
            <nav className="flex flex-col gap-2">
              <Link
                href="/#feature"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-slate-200 hover:bg-white/10 transition-colors"
              >
                Fitur
              </Link>
              <Link
                href="/#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-slate-200 hover:bg-white/10 transition-colors"
              >
                Cara Kerja
              </Link>
              <a
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-slate-200 hover:bg-white/10 transition-colors"
              >
                Tentang Rumaket
              </a>
            </nav>

            <div className="pt-2 border-t border-white/10">
              {isLoggedIn ? (
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm px-5 py-3 rounded-full shadow-lg transition-all group cursor-pointer">
                    <span>Area Keluarga</span>
                    <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </Link>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm px-5 py-3 rounded-full shadow-lg transition-all group cursor-pointer">
                    <span>Mulai Sekarang</span>
                    <span className="w-6 h-6 rounded-full bg-slate-950 text-white flex items-center justify-center">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
