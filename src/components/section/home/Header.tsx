"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";

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
        isScrolled 
          ? "px-4 pt-4 md:px-6 md:pt-6" 
          : "px-0 pt-0"                 
      }`}
    >
      <header
        className={`w-full transition-all duration-500 ease-in-out ${
          isScrolled
            ? 
              "max-w-6xl rounded-2xl border border-white/10 bg-brand-950/60 backdrop-blur-2xl shadow-2xl shadow-brand-950/50 py-3"
            : 
              "max-w-full rounded-none border-b border-transparent bg-transparent py-5"
        }`}
      >
        <div 
          className={`mx-auto flex items-center justify-between transition-all duration-500 ${
            isScrolled ? "px-5 md:px-8" : "px-6 md:px-12 lg:px-16"
          }`}
        >
          
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400 to-brand-600 text-sm font-bold text-white shadow-lg transition-transform group-hover:scale-105">
              R
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              Rumaket
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <a 
              href="#fitur" 
              className="rounded-lg px-4 py-2 text-sm font-medium text-brand-100/80 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
            >
              Fitur
            </a>
            <a 
              href="#cara-kerja" 
              className="rounded-lg px-4 py-2 text-sm font-medium text-brand-100/80 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
            >
              Cara Kerja
            </a>
            <a 
              href="#tentang" 
              className="rounded-lg px-4 py-2 text-sm font-medium text-brand-100/80 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
            >
              Tentang Rumaket
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/10 hover:text-white cursor-pointer"
              >
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button 
                variant="inverse" 
                size="sm" 
                className="shadow-lg shadow-white/10 cursor-pointer"
              >
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}