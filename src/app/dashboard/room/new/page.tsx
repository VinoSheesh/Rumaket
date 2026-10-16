"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { createRoom } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

export default function NewRoomPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await createRoom(user.uid, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/room?id=${result.roomId}`);
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
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
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Buat Room Lansia Baru
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Daftarkan ruang perawatan untuk mulai mengatur jadwal harian obat, nutrisi, dan mengundang perawat (CareTaker).
          </p>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100/80">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Sebagai pembuat room, Anda otomatis menjadi <strong className="font-semibold text-slate-800">Owner</strong> dan akan menerima kode undangan khusus untuk dibagikan kepada tim perawat.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200/80 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
              Nama Room / Ruangan
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Contoh: Ruang Melati / Kamar Utama"
              required
              className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="patient_name" className="text-xs font-semibold text-slate-700">
              Nama Lansia
            </Label>
            <Input
              id="patient_name"
              name="patient_name"
              type="text"
              placeholder="Contoh: Opa Budi / Ibu Siti"
              required
              className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-200/80 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </Link>

            <Button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50 border-none cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Membuat Room…</span>
                </>
              ) : (
                <span>Buat Room Sekarang</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}