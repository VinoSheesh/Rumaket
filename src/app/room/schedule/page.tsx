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
import { SCHEDULE_CATEGORIES, TIME_SLOTS } from "@/lib/constants";
import type { Schedule, ScheduleCategory, TimeSlot } from "@/lib/types";

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
    if (category) clauses.push(where("category", "==", category as ScheduleCategory));

    const q = query(
      collection(db, "patient_rooms", roomId, "schedules"),
      ...clauses,
      orderBy("specific_time", "asc")
    );

    return onSnapshot(q, (snap) => {
      setSchedules(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Schedule, "id">),
        }))
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

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            Jadwal Hari Ini
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Link href={`/room/schedule/new?id=${roomId}`}>
          <Button>+ Tambah Tugas</Button>
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
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

      <div className="mt-2 flex flex-wrap gap-2">
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
            label={`${v.icon} ${v.label}`}
          />
        ))}
      </div>

      <div className="mt-6 space-y-6">
        {grouped.length === 0 ? (
          <EmptyState
            icon="📋"
            title="Belum ada tugas untuk hari ini"
            description="Tambahkan tugas pertama — pengobatan, makan, kebersihan, tanda vital, atau terapi."
            action={
              <Link href={`/room/schedule/new?id=${roomId}`}>
                <Button>Tambah Tugas</Button>
              </Link>
            }
          />
        ) : (
          grouped.map((g) => (
            <div key={g.slot}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {TIME_SLOTS[g.slot].label} · {TIME_SLOTS[g.slot].range}
              </p>
              <div className="rounded-md border border-slate-200 bg-white">
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
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-sm border px-2.5 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-brand-700 bg-brand-700 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
      }`}
    >
      {label}
    </Link>
  );
}
