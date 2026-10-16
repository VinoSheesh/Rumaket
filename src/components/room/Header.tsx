"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  ShieldCheck,
  HeartHandshake,
  User,
  KeyRound,
  Menu,
  X,
  Calendar,
  ClipboardList,
  Users,
  Clock,
  Home,
  Copy,
  Check,
} from "lucide-react";

interface RoomHeaderProps {
  roomId: string;
  roomName: string;
  patientName: string;
  inviteCode: string;
  isOwner: boolean;
}

export function RoomHeader({
  roomId,
  roomName,
  patientName,
  inviteCode,
  isOwner,
}: RoomHeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navTabs = [
    {
      label: "Ringkasan",
      href: `/room?id=${roomId}`,
      active: pathname === "/room" || pathname === "/room/",
      icon: Home,
      ownerOnly: false,
    },
    {
      label: "Jadwal",
      href: `/room/schedule?id=${roomId}`,
      active: pathname.startsWith("/room/schedule"),
      icon: Calendar,
      ownerOnly: false,
    },
    {
      label: "Absensi Shift",
      href: `/room/attendance?id=${roomId}`,
      active: pathname.startsWith("/room/attendance"),
      icon: Clock,
      ownerOnly: false,
    },
    {
      label: "Catatan Medis",
      href: `/room/notes?id=${roomId}`,
      active: pathname.startsWith("/room/notes"),
      icon: ClipboardList,
      ownerOnly: false,
    },
    {
      label: "CareTakers",
      href: `/room/caretakers?id=${roomId}`,
      active: pathname.startsWith("/room/caretakers"),
      icon: Users,
      ownerOnly: true, // Hanya untuk owner
    },
  ].filter((tab) => !tab.ownerOnly || isOwner); // Filter tab berdasarkan hak akses

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xs transition-all">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 xl:px-12 pt-3 pb-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-base sm:text-xl font-bold tracking-tight text-slate-900 truncate max-w-[160px] sm:max-w-md">
                    {roomName}
                  </h1>
                  <Badge
                    variant={isOwner ? "default" : undefined}
                    className={
                      isOwner
                        ? "bg-blue-50 text-blue-700 border-blue-200/80 font-semibold px-2 py-0.5 text-[10px] sm:text-[11px] rounded-full hidden sm:flex items-center gap-1 shrink-0"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold px-2 py-0.5 text-[10px] sm:text-[11px] rounded-full hidden sm:flex items-center gap-1 shrink-0"
                    }
                  >
                    {isOwner ? "Owner" : "CareTaker"}
                  </Badge>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1 truncate">
                  <User className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="truncate">
                    Lansia:{" "}
                    <strong className="font-semibold text-slate-700">
                      {patientName}
                    </strong>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwner && (
              <div className="hidden lg:flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-1.5 border border-slate-200/70 text-xs">
                <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  Kode Undangan:
                </span>
                <span className="font-mono font-bold text-slate-800 tracking-wider">
                  {inviteCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="ml-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                  title="Salin Kode"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden items-center justify-center h-9 w-9 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <nav className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-1.5 shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  tab.active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${tab.active ? "text-white" : "text-slate-500"}`}
                />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-2xl px-5 py-4 shadow-xl space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <Badge
                variant={isOwner ? "default" : undefined}
                className={
                  isOwner
                    ? "bg-blue-50 text-blue-700 border-blue-200/80 font-semibold px-2.5 py-1 text-[11px] rounded-full flex items-center gap-1"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold px-2.5 py-1 text-[11px] rounded-full flex items-center gap-1"
                }
              >
                {isOwner ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Pemilik Room</span>
                  </>
                ) : (
                  <>
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CareTaker Bertugas</span>
                  </>
                )}
              </Badge>
            </div>

            {isOwner && (
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded-xl border border-slate-200"
              >
                <KeyRound className="w-3 h-3 text-slate-400" />
                <span>{inviteCode}</span>
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400" />
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 font-semibold text-slate-700 hover:bg-slate-200"
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>Dashboard Utama</span>
            </Link>
            <Link
              href={`/room/schedule/new?id=${roomId}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-600 font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Calendar className="w-4 h-4" />
              <span>+ Tambah Jadwal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
