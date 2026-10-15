"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { createRoom } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";

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
    <div className="max-w-md">
      <Link href="/dashboard" className="text-sm text-slate-600 hover:text-brand-700">
        ← Kembali
      </Link>
      <h1 className="mt-3 font-display text-2xl font-bold text-slate-900">
        Buat Room Lansia
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Setelah dibuat, Anda otomatis menjadi Owner dan mendapat kode undangan
        untuk caretaker.
      </p>

      {error && (
        <p className="mt-4 rounded-sm border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-md border border-slate-200 bg-slate-50 p-6"
      >
        <div>
          <Label htmlFor="name">Nama Room</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Ruang Melati"
            required
          />
        </div>
        <div>
          <Label htmlFor="patient_name">Nama Lansia</Label>
          <Input
            id="patient_name"
            name="patient_name"
            type="text"
            placeholder="Opa Budi"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          Buat Room
        </Button>
      </form>
    </div>
  );
}
