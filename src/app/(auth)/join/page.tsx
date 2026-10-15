"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { joinRoomByCode } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { KeyRound } from "lucide-react";

export default function JoinPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = String(formData.get("code") ?? "").trim().toUpperCase();

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

    router.push(`/room?id=${result.roomId}`);
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-2xl shadow-slate-900/5 backdrop-blur-sm md:p-10">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-warmth-50/20 to-accent-50/30" />

      <div className="relative">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-warmth-200 bg-gradient-to-r from-warmth-50 to-accent-50 px-3 py-1.5 text-xs font-medium text-warmth-800 shadow-sm">
          <KeyRound className="h-3.5 w-3.5" />
          Bergabung dengan Room
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
          Gabung Room
        </h1>
        <p className="mt-2 text-base leading-relaxed text-slate-600">
          Masukkan kode undangan yang diberikan oleh keluarga/admin lansia.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100/50 px-4 py-3 shadow-sm">
            <p className="text-sm font-medium text-rose-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="code">Kode Undangan</Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="MISALNYA: 7YHC552Q"
              className="uppercase tracking-widest text-center text-lg font-semibold"
              maxLength={8}
              minLength={8}
              required
            />
            <p className="mt-2 text-xs text-slate-500">
              Kode terdiri dari 8 karakter huruf/angka
            </p>
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            Gabung
          </Button>
        </form>

        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-slate-500">atau</span>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-semibold text-brand-700 transition-colors hover:text-brand-800"
          >
            Daftar dahulu
          </Link>
        </p>
      </div>
    </div>
  );
}
