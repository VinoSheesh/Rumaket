"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRoomContext } from "@/lib/firebase/room-context";
import { createSchedule } from "@/app/room/schedule/actions";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { SCHEDULE_CATEGORIES, TIME_SLOTS } from "@/lib/constants";

export default function NewSchedulePage() {
  const { room, userId } = useRoomContext();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const today = new Date().toISOString().slice(0, 10);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await createSchedule(room.id, userId, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/room/schedule?id=${room.id}`);
    });
  }

  return (
    <div className="max-w-md">
      <Link href={`/room/schedule?id=${room.id}`} className="text-sm text-slate-500">
        ← Kembali
      </Link>
      <h1 className="mt-3 font-display text-xl font-bold text-slate-900">
        Tambah Tugas
      </h1>

      {error && (
        <p className="mt-4 rounded-sm border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-md border border-slate-200 bg-white p-6"
      >
        <div>
          <Label htmlFor="title">Judul Tugas</Label>
          <Input
            id="title"
            name="title"
            placeholder="Obat Tekanan Darah"
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Kategori</Label>
          <Select id="category" name="category" required defaultValue="medication">
            {Object.entries(SCHEDULE_CATEGORIES).map(([key, v]) => (
              <option key={key} value={key}>
                {v.icon} {v.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="time_slot">Slot Waktu</Label>
          <Select id="time_slot" name="time_slot" required defaultValue="morning">
            {Object.entries(TIME_SLOTS).map(([key, v]) => (
              <option key={key} value={key}>
                {v.label} ({v.range})
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="specific_time">
            Jam Spesifik (isi jika pilih &quot;Jam Spesifik&quot;)
          </Label>
          <Input id="specific_time" name="specific_time" type="time" />
        </div>
        <div>
          <Label htmlFor="scheduled_date">Tanggal</Label>
          <Input
            id="scheduled_date"
            name="scheduled_date"
            type="date"
            defaultValue={today}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Catatan (opsional)</Label>
          <Textarea id="description" name="description" rows={3} />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          Simpan Tugas
        </Button>
      </form>
    </div>
  );
}
