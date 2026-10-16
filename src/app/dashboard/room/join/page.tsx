"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { joinRoomByCode } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { KeyRound, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

export default function JoinPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = String(formData.get("code") ?? "")
      .trim()
      .toUpperCase();

    if (!user) {
      router.push(`/register?join_code=${encodeURIComponent(code)}`);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    const result = await joinRoomByCode(user.uid, formData);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.push(`/room/${result.roomId}`);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-5 space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
            <KeyRound className="h-3.5 w-3.5 text-blue-600" />
            <span>Akses Perawat & CareTaker</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 pt-1">
            Gabung Room Perawatan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Masukkan kode undangan 8 karakter yang diberikan oleh pemilik room
            atau keluarga lansia untuk mulai bertugas.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200/80 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label
              htmlFor="code"
              className="text-xs font-semibold text-slate-700"
            >
              Kode Undangan
            </Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="CONTOH: 7YHC552Q"
              className="w-full uppercase tracking-widest text-center text-lg font-mono font-bold rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-sans placeholder:text-sm placeholder:tracking-normal"
              maxLength={8}
              minLength={8}
              required
            />
            <p className="text-[11px] text-slate-400 text-center">
              Kode terdiri dari 8 kombinasi huruf kapital dan angka
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 font-semibold text-xs text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50 border-none cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses Kode…</span>
              </>
            ) : (
              <span>Gabung Room Sekarang</span>
            )}
          </Button>
        </form>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sistem Verifikasi Otomatis</span>
          </span>
          {!user && (
            <Link
              href="/register"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Belum punya akun? Daftar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
