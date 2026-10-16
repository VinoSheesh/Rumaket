"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Plus,
  KeyRound,
  Menu,
  X,
  Home,
  AlertTriangle,
  Loader2,
} from "lucide-react";
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifStatus, setNotifStatus] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  async function handleEnableNotifications() {
    if (!user) return;
    setNotifStatus("Mengaktifkan…");
    const result = await subscribeToPush(user.uid);
    setNotifStatus(result.ok ? "Notifikasi aktif ✓" : result.error);
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = userName ? userName.charAt(0).toUpperCase() : "U";

  const triggerLogoutModal = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    setIsLogoutModalOpen(true);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out ${
          isScrolled ? "px-4 pt-4 md:px-6 md:pt-6" : "px-0 pt-0"
        }`}
      >
        <header
          className={`w-full transition-all duration-500 ease-in-out ${
            isScrolled
              ? "max-w-[1400px] rounded-4xl border border-slate-200/80 bg-white/85 backdrop-blur-2xl shadow-xl shadow-slate-900/5 py-3"
              : "max-w-full rounded-none border-b border-slate-200/60 bg-white/90 backdrop-blur-md py-4"
          }`}
        >
          <div
            className={`mx-auto flex items-center justify-between transition-all duration-500 ${
              isScrolled ? "px-5 md:px-8" : "px-6 md:px-12 lg:px-16"
            }`}
          >
            {/* Logo Brand */}
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <span className="font-display text-2xl font-black tracking-tighter text-slate-900">
                RUMA<span className="text-blue-600">KET</span>
              </span>
            </Link>

            {/* Desktop Navigation & Actions */}
            <div className="hidden md:flex items-center gap-3" ref={menuRef}>
              <Link href="/dashboard/room/join">
                <button className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  <span>Gabung Room</span>
                </button>
              </Link>

              <Link href="/dashboard/rooms/new">
                <button className="flex items-center gap-1.5 rounded-full bg-blue-900 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-900/20 hover:bg-slate-700 transition-all cursor-pointer">
                  <Plus className="w-4 h-4" />
                  <span>Buat Room</span>
                </button>
              </Link>

              {/* Profile Dropdown Trigger */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-sm">
                    {initial}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                    {userName}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-3xl border border-slate-200/80 bg-white/95 p-2.5 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2.5 border-b border-slate-100 mb-1.5 bg-slate-50/80 rounded-2xl">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {userName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {userEmail}
                      </p>
                    </div>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>Lihat Akun</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleEnableNotifications}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                    >
                      <Bell className="w-4 h-4 text-slate-500" />
                      <span>{notifStatus ?? "Aktifkan Notifikasi"}</span>
                    </button>

                    <Link
                      href="/dashboard/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>Pengaturan Akun</span>
                    </Link>

                    <div className="my-1.5 border-t border-slate-100" />

                    <button
                      type="button"
                      onClick={triggerLogoutModal}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                aria-label="Toggle Navigation"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-4 right-4 mt-2 rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-2xl p-5 shadow-2xl shadow-slate-950/10 flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-sm">
                  {initial}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {userName}
                  </span>
                  <span className="text-xs text-slate-500 truncate">
                    {userEmail}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/dashboard/rooms/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-blue-900 px-4 py-3 text-xs font-bold text-white shadow-md shadow-blue-900/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Room</span>
                </Link>
                <Link
                  href="/dashboard/room/join"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-800"
                >
                  <KeyRound className="w-4 h-4 text-blue-900" />
                  <span>Gabung Room</span>
                </Link>
              </div>

              <hr className="border-slate-100" />

              <nav className="flex flex-col gap-1">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <Home className="w-4 h-4 text-slate-500" />
                  <span>Dashboard Utama</span>
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Lihat Akun</span>
                </Link>

                <button
                  type="button"
                  onClick={handleEnableNotifications}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-slate-500" />
                  <span>{notifStatus ?? "Aktifkan Notifikasi"}</span>
                </button>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Pengaturan Akun</span>
                </Link>
              </nav>

              <hr className="border-slate-100" />

              <button
                type="button"
                onClick={triggerLogoutModal}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-50 py-3 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          )}
        </header>
      </div>

      {/* ================= MODAL KONFIRMASI LOGOUT ================= */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">
                  Konfirmasi Keluar
                </h3>
                <p className="text-xs text-slate-500">
                  Apakah Anda yakin ingin keluar dari akun ini?
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
              <p className="text-xs text-blue-900 leading-relaxed">
                Anda perlu masuk kembali untuk mengakses room perawatan lansia
                dan menerima pembaruan jadwal.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => setIsLogoutModalOpen(false)}
                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>

              <form
                action={async () => {
                  setIsLoggingOut(true);
                  await signOut();
                }}
              >
                <button
                  type="submit"
                  disabled={isLoggingOut}
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Keluar dari akun...</span>
                    </>
                  ) : (
                    <span>Ya, Keluar</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
