"use client";

import Link from "next/link";
import { ShieldCheck, HelpCircle, FileText } from "lucide-react";

export function DashboardFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200/60 bg-white/60 backdrop-blur-md py-6 sm:py-8">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="font-display font-black text-slate-900 text-sm tracking-tighter"
              >
                RUMA<span className="text-blue-600">KET</span>
              </Link>
              <div className="flex sm:hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 border border-emerald-200/60 text-[10px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sistem Normal</span>
              </div>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <p className="text-slate-500 text-[11px] sm:text-xs">
              Sistem Manajemen Perawatan & CareTakers Lansia
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-y-2 gap-x-4 sm:gap-6 font-medium text-[11px] sm:text-xs">
            <Link
              href="/#feature"
              className="hover:text-slate-900 transition-colors flex items-center gap-1 py-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Pusat Bantuan</span>
            </Link>
            <Link
              href="/privacy"
              className="hover:text-slate-900 transition-colors flex items-center gap-1 py-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Privasi & Keamanan</span>
            </Link>
            <Link
              href="/terms"
              className="hover:text-slate-900 transition-colors flex items-center gap-1 py-1"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Syarat & Ketentuan</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-400">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 border border-emerald-200/60 text-[11px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sistem Normal</span>
            </div>
            <p>© {new Date().getFullYear()} Rumaket. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
