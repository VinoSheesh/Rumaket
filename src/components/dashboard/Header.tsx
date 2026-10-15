"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { User, Settings, LogOut, ChevronDown, Bell } from "lucide-react";
import { signOut } from "@/app/(auth)/actions";
import { useAuth } from "@/lib/firebase/auth-context";
import { subscribeToPush } from "@/lib/push";

interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
}

export function DashboardHeader({ userName, userEmail }: DashboardHeaderProps) {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifStatus, setNotifStatus] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  async function handleEnableNotifications() {
    if (!user) return;
    setNotifStatus("Mengaktifkan…");
    const result = await subscribeToPush(user.uid);
    setNotifStatus(result.ok ? "Notifikasi aktif ✓" : result.error);
  }

  // Efek scroll untuk mengubah style header melayang
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menutup dropdown saat klik di luar area menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
            ? "max-w-6xl rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-2xl shadow-xl shadow-slate-900/5 py-2.5"
            : "max-w-full rounded-none border-b border-slate-200/80 bg-white py-4"
        }`}
      >
        <div
          className={`mx-auto flex items-center justify-between transition-all duration-500 ${
            isScrolled ? "px-5 md:px-8" : "px-6 md:px-12 lg:px-16"
          }`}
        >
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <span className="font-display text-2xl font-black tracking-tighter text-slate-900">
              RUMA<span className="text-blue-600">KET</span>
            </span>
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-slate-200/80 bg-slate-50 hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-sm">
                {userName.charAt(0).toUpperCase()}
              </div>

              <span className="hidden sm:inline text-xs font-semibold text-slate-800 max-w-[140px] truncate">
                {userName}
              </span>

              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl shadow-slate-900/10 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {userName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {userEmail}
                  </p>
                </div>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Lihat Akun</span>
                </Link>

                <button
                  type="button"
                  onClick={handleEnableNotifications}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Bell className="w-4 h-4 text-slate-500" />
                  <span>{notifStatus ?? "Aktifkan Notifikasi"}</span>
                </button>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Pengaturan Akun</span>
                </Link>

                <div className="my-1 border-t border-slate-100" />

                <form action={signOut}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Keluar</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}