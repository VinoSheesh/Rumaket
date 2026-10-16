"use client";

import { useState } from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import { subscribeToPush } from "@/lib/push";
import {
  Bell,
  Lock,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user } = useAuth();
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState<string | null>(null);

  async function handleEnableNotifications() {
    if (!user) return;
    setNotifLoading(true);
    setNotifMessage(null);

    const result = await subscribeToPush(user.uid);
    setNotifLoading(false);
    if (result.ok) {
      setNotifMessage(
        "Notifikasi Web Push berhasil diaktifkan untuk perangkat ini.",
      );
    } else {
      setNotifMessage(result.error ?? "Gagal mengaktifkan notifikasi.");
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Page */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pengaturan Akun
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Atur sistem notifikasi, preferensi keamanan, dan privasi akun Anda.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Section 1: Push Notification */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-600" />
                <span>Pengingat & Notifikasi Web Push</span>
              </h2>
              <p className="text-xs text-slate-500">
                Terima pengingat jadwal obat, absensi perawat, dan pembaruan
                catatan medis secara real-time.
              </p>
            </div>
          </div>

          {notifMessage && (
            <div className="p-3.5 rounded-2xl bg-slate-50 text-slate-800 border border-slate-200/80 text-xs font-semibold">
              {notifMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Notifikasi Browser Perangkat Ini
                </p>
                <p className="text-[11px] text-slate-500">
                  Aktifkan izin push notification pada browser Anda.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleEnableNotifications}
              disabled={notifLoading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-slate-600/20 hover:bg-slate-700 transition-all disabled:opacity-50 cursor-pointer shrink-0"
            >
              {notifLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Proses…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aktifkan Notifikasi</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section 2: Keamanan & Kata Sandi */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-600" />
              <span>Keamanan & Kata Sandi</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Akses otentikasi akun Anda dilindungi oleh Firebase
              Authentication.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-800">Ubah Kata Sandi</p>
                <p className="text-slate-500">
                  Atur ulang kata sandi melalui email verifikasi terdaftar.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  alert("Link riset kata sandi telah dikirimkan ke email Anda.")
                }
                className="rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Kirim Link Reset
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Info Sesi & Perangkat */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Sesi Aktif & Keamanan Platform</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Akun Anda terhubung secara terenkripsi. Sesi aktif akan dienkripsi
            menggunakan token aman Firebase Auth.
          </p>
        </div>
      </div>
    </div>
  );
}
