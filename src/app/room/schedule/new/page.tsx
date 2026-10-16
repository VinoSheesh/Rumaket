"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRoomContext } from "@/lib/firebase/room-context";
import {
  createSchedule,
  createScheduleTemplate,
} from "@/app/room/schedule/actions";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { SCHEDULE_CATEGORIES, TIME_SLOTS } from "@/lib/constants";
import {
  ArrowLeft,
  Loader2,
  CalendarPlus,
  ClipboardList,
  Clock,
  Repeat,
} from "lucide-react";

export default function NewSchedulePage() {
  const { room, userId } = useRoomContext();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isRecurring, setIsRecurring] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = isRecurring
        ? await createScheduleTemplate(room.id, userId, formData)
        : await createSchedule(room.id, userId, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/room/schedule?id=${room.id}`);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/room/schedule?id=${room.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Kelola Jadwal</span>
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-5 space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
            <CalendarPlus className="h-3.5 w-3.5 text-blue-600" />
            <span>Penjadwalan Instruktif CareTaker</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 pt-1">
            Tambah Tugas Perawatan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Buat instruksi jadwal pengobatan, makan, higiene, atau tanda vital
            untuk lansia{" "}
            <strong className="font-semibold text-slate-700">
              {room.patient_name}
            </strong>
            .
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
              htmlFor="title"
              className="text-xs font-semibold text-slate-700"
            >
              Judul Tugas / Instruksi
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Contoh: Obat Tekanan Darah (Amlodipine 5mg)"
              required
              className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          <label
            htmlFor="is_recurring"
            className="flex items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <Repeat className="h-4 w-4 text-blue-600 shrink-0" />
              <span className="space-y-0.5">
                <span className="block text-xs font-semibold text-slate-800">
                  Jadikan Aktivitas Rutin (berulang)
                </span>
                <span className="block text-[11px] text-slate-500">
                  Contoh: minum obat tiap 5 jam sekali — dibuat otomatis
                  setiap hari.
                </span>
              </span>
            </span>
            <input
              id="is_recurring"
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-5 w-5 shrink-0 rounded-md border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
            />
          </label>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="category"
                className="text-xs font-semibold text-slate-700"
              >
                Kategori Tugas
              </Label>
              <Select
                id="category"
                name="category"
                required
                defaultValue="medication"
                className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all cursor-pointer"
              >
                {Object.entries(SCHEDULE_CATEGORIES).map(([key, v]) => (
                  <option key={key} value={key}>
                    {v.label}
                  </option>
                ))}
              </Select>
            </div>

            {!isRecurring && (
              <div className="space-y-1.5">
                <Label
                  htmlFor="time_slot"
                  className="text-xs font-semibold text-slate-700"
                >
                  Slot Waktu Shift
                </Label>
                <Select
                  id="time_slot"
                  name="time_slot"
                  required
                  defaultValue="morning"
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all cursor-pointer"
                >
                  {Object.entries(TIME_SLOTS).map(([key, v]) => (
                    <option key={key} value={key}>
                      {v.label} ({v.range})
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </div>

          {isRecurring ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="start_time"
                  className="text-xs font-semibold text-slate-700"
                >
                  Jam Mulai
                </Label>
                <Input
                  id="start_time"
                  name="start_time"
                  type="time"
                  required
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="interval_hours"
                  className="text-xs font-semibold text-slate-700"
                >
                  Ulangi Setiap (jam)
                </Label>
                <Input
                  id="interval_hours"
                  name="interval_hours"
                  type="number"
                  min={1}
                  max={24}
                  defaultValue={5}
                  required
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="start_date"
                  className="text-xs font-semibold text-slate-700"
                >
                  Tanggal Mulai
                </Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  defaultValue={today}
                  required
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="end_date"
                  className="text-xs font-semibold text-slate-700"
                >
                  Tanggal Berakhir{" "}
                  <span className="text-slate-400 font-normal">
                    (Opsional, kosongkan jika tanpa batas)
                  </span>
                </Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="specific_time"
                  className="text-xs font-semibold text-slate-700"
                >
                  Jam Spesifik{" "}
                  <span className="text-slate-400 font-normal">(Opsional)</span>
                </Label>
                <Input
                  id="specific_time"
                  name="specific_time"
                  type="time"
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="scheduled_date"
                  className="text-xs font-semibold text-slate-700"
                >
                  Tanggal Pelaksanaan
                </Label>
                <Input
                  id="scheduled_date"
                  name="scheduled_date"
                  type="date"
                  defaultValue={today}
                  required
                  className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className="text-xs font-semibold text-slate-700"
            >
              Catatan Instruksi Khusus{" "}
              <span className="text-slate-400 font-normal">(Opsional)</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Contoh: Diminum sesudah makan siang, pastikan minum air hangat."
              className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link
              href={`/room/schedule?id=${room.id}`}
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
                  <span>Menyimpan Tugas…</span>
                </>
              ) : (
                <span>Simpan Tugas Baru</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
