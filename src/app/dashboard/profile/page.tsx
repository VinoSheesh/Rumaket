"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/lib/firebase/auth-context";
import { Button } from "@/components/ui/Button";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Loader2,
  Save,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const snap = await getDoc(doc(db, "profiles", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setFullName((data.full_name as string) ?? "");
          setPhone((data.phone as string) ?? "");
        }
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage(null);

    try {
      await updateDoc(doc(db, "profiles", user.uid), {
        full_name: fullName,
        phone: phone,
        updated_at: new Date().toISOString(),
      });
      setMessage({ type: "success", text: "Profil berhasil diperbarui." });
    } catch (err) {
      console.error("Gagal memperbarui profil:", err);
      setMessage({ type: "error", text: "Terjadi kesalahan saat menyimpan perubahan." });
    } finally {
      setIsSaving(false);
    }
  }

  const initial = fullName
    ? fullName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? "U";

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
            Profil Saya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola informasi data diri dan peran Anda di platform Rumaket.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
          <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          <p className="text-xs font-medium text-slate-500">Memuat profil Anda…</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {/* Card Avatar & Status */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900 text-2xl font-black text-white shadow-lg shadow-slate-900/10 font-display">
                {initial}
              </div>
              <span className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                {fullName || "Pengguna Rumaket"}
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-[200px]">
                {user?.email}
              </p>
            </div>

            <div className="w-full pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Status Akun</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
                </span>
              </div>
              <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Peran Utama</span>
                <span className="font-semibold text-blue-600">Caregiver / Admin</span>
              </div>
            </div>
          </div>

          {/* Form Detail Profil */}
          <div className="md:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Informasi Data Diri</span>
              </h2>
            </div>

            {message && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-semibold ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                    : "bg-rose-50 text-rose-700 border border-rose-200/80"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    required
                    className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 pl-10 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                  />
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Alamat Email (Akun)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email ?? ""}
                    disabled
                    className="w-full rounded-2xl border border-slate-200/80 bg-slate-100 px-4 py-2.5 pl-10 text-xs text-slate-500 cursor-not-allowed"
                  />
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Email digunakan untuk otentikasi login dan tidak dapat diubah langsung.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan…</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}