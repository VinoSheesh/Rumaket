"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useRoomContext } from "@/lib/firebase/room-context";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScheduleItem } from "@/components/rooms/ScheduleItem";
import { RecurringTemplateList } from "@/components/rooms/RecurringTemplateList";
import { SCHEDULE_CATEGORIES, TIME_SLOTS } from "@/lib/constants";
import type { Schedule, ScheduleCategory, TimeSlot } from "@/lib/types";
import {
  Plus,
  CalendarCheck2,
  Clock,
  Filter,
  ClipboardList,
  Pill,
  Utensils,
  Bath,
  Activity,
  Dumbbell,
  Calendar,
} from "lucide-react";

export default function SchedulePage() {
  const { room } = useRoomContext();
  const searchParams = useSearchParams();
  const timeSlot = searchParams.get("time_slot") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const roomId = room.id;

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const clauses = [where("scheduled_date", "==", today)];
    if (timeSlot) clauses.push(where("time_slot", "==", timeSlot as TimeSlot));
    if (category)
      clauses.push(where("category", "==", category as ScheduleCategory));

    const q = query(
      collection(db, "patient_rooms", roomId, "schedules"),
      ...clauses,
      orderBy("specific_time", "asc"),
    );

    return onSnapshot(q, (snap) => {
      setSchedules(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Schedule, "id">),
        })),
      );
    });
  }, [roomId, today, timeSlot, category]);

  const slotOrder: TimeSlot[] = ["morning", "afternoon", "evening", "custom"];
  const grouped = slotOrder
    .map((slot) => ({
      slot,
      items: schedules.filter((s) => s.time_slot === slot),
    }))
    .filter((g) => g.items.length > 0);

  const formattedDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white p-5 sm:p-7 border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
            <CalendarCheck2 className="h-3.5 w-3.5 text-blue-600" />
            <span>Manajemen Tugas CareTaker</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
            Jadwal Harian Lansia
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </p>
        </div>

        <Link
          href={`/room/schedule/new?id=${roomId}`}
          className="w-full sm:w-auto"
        >
          <Button className="w-full sm:w-auto h-11 justify-center rounded-2xl bg-blue-600 text-white hover:bg-blue-700 font-semibold text-xs sm:text-sm px-5 border-none shadow-md shadow-blue-600/20">
            <Plus className="mr-1.5 h-4 w-4" />
            <span>Tambah Tugas Baru</span>
          </Button>
        </Link>
      </div>

      <RecurringTemplateList roomId={roomId} />

      <div className="space-y-3 rounded-3xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider pb-1">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span>Filter Tampilan Tugas</span>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Slot Waktu
          </span>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <FilterChip
              href={`/room/schedule?id=${roomId}`}
              active={!timeSlot}
              label="Semua Waktu"
            />
            {Object.entries(TIME_SLOTS).map(([key, v]) => (
              <FilterChip
                key={key}
                href={`/room/schedule?id=${roomId}&time_slot=${key}${
                  category ? `&category=${category}` : ""
                }`}
                active={timeSlot === key}
                label={v.label}
              />
            ))}
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Kategori Tugas
          </span>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <FilterChip
              href={`/room/schedule?id=${roomId}${
                timeSlot ? `&time_slot=${timeSlot}` : ""
              }`}
              active={!category}
              label="Semua Kategori"
            />
            {Object.entries(SCHEDULE_CATEGORIES).map(([key, v]) => (
              <FilterChip
                key={key}
                href={`/room/schedule?id=${roomId}&category=${key}${
                  timeSlot ? `&time_slot=${timeSlot}` : ""
                }`}
                active={category === key}
                label={v.label}
                categoryKey={key}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {grouped.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm text-center">
            <EmptyState
              icon={
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-2">
                  <ClipboardList className="h-6 w-6" />
                </div>
              }
              title="Belum Ada Tugas Hari Ini"
              description="Tambahkan tugas pertama — pengobatan, makan, kebersihan diri, pemeriksaan tanda vital, atau terapi."
              action={
                <Link href={`/room/schedule/new?id=${roomId}`}>
                  <Button className="h-11 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 px-6 font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/20 border-none">
                    Tambah Tugas Sekarang
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          grouped.map((g) => (
            <div key={g.slot} className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{TIME_SLOTS[g.slot].label}</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {TIME_SLOTS[g.slot].range}
                </span>
              </div>

              <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm divide-y divide-slate-100">
                {g.items.map((schedule) => (
                  <ScheduleItem
                    key={schedule.id}
                    schedule={schedule}
                    roomId={roomId}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function FilterChip({
  href,
  active,
  label,
  categoryKey,
}: {
  href: string;
  active: boolean;
  label: string;
  categoryKey?: string;
}) {
  const getCategoryIcon = (key?: string) => {
    switch (key) {
      case "medication":
        return <Pill className="w-3.5 h-3.5" />;
      case "meal":
        return <Utensils className="w-3.5 h-3.5" />;
      case "hygiene":
        return <Bath className="w-3.5 h-3.5" />;
      case "vitals":
        return <Activity className="w-3.5 h-3.5" />;
      case "therapy":
        return <Dumbbell className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const icon = getCategoryIcon(categoryKey);

  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
        active
          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
          : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/60"
      }`}
    >
      {icon && (
        <span className={active ? "text-white" : "text-slate-500"}>{icon}</span>
      )}
      <span>{label}</span>
    </Link>
  );
}
