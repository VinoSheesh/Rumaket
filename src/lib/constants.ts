import type {
  NoteCategory,
  ScheduleCategory,
  ScheduleStatus,
  TimeSlot,
} from "@/lib/types";

export const SCHEDULE_CATEGORIES: Record<
  ScheduleCategory,
  { label: string; icon: string }
> = {
  medication: { label: "Pengobatan", icon: "💊" },
  meal: { label: "Nutrisi & Makanan", icon: "🥗" },
  hygiene: { label: "Higiene & Perawatan Diri", icon: "🧼" },
  vitals: { label: "Pemeriksaan Tanda Vital", icon: "🩺" },
  therapy: { label: "Terapi & Aktivitas", icon: "🏃" },
};

export const TIME_SLOTS: Record<
  TimeSlot,
  { label: string; range: string }
> = {
  morning: { label: "Pagi", range: "06:00 - 11:59" },
  afternoon: { label: "Siang", range: "12:00 - 16:59" },
  evening: { label: "Sore / Malam", range: "17:00 - 21:59" },
  custom: { label: "Jam Spesifik", range: "HH:mm" },
};

export const SCHEDULE_STATUS: Record<
  ScheduleStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  completed: {
    label: "Selesai",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  skipped: {
    label: "Dilewati",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export const NOTE_CATEGORIES: Record<NoteCategory, { label: string }> = {
  health_condition: { label: "Kondisi Kesehatan" },
  behavior_change: { label: "Perubahan Perilaku" },
  vitals_result: { label: "Hasil Tensi/Gula Darah" },
  shift_handover: { label: "Pesan Serah-Terima Shift" },
};
