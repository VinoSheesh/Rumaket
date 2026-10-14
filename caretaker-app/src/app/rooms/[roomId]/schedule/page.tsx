import Link from "next/link";
import { getRoomContext } from "@/lib/rooms";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScheduleItem } from "@/components/rooms/ScheduleItem";
import { SCHEDULE_CATEGORIES, TIME_SLOTS } from "@/lib/constants";
import type { Schedule, ScheduleCategory, TimeSlot } from "@/lib/types";

export default async function SchedulePage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ time_slot?: string; category?: string }>;
}) {
  const { roomId } = await params;
  const { time_slot, category } = await searchParams;
  const { supabase } = await getRoomContext(roomId);

  const today = new Date().toISOString().slice(0, 10);

  let query = supabase
    .from("schedules")
    .select("*")
    .eq("room_id", roomId)
    .eq("scheduled_date", today)
    .order("specific_time", { ascending: true, nullsFirst: true });

  if (time_slot) query = query.eq("time_slot", time_slot as TimeSlot);
  if (category) query = query.eq("category", category as ScheduleCategory);

  const { data: schedules } = await query.returns<Schedule[]>();

  const slotOrder: TimeSlot[] = ["morning", "afternoon", "evening", "custom"];
  const grouped = slotOrder
    .map((slot) => ({
      slot,
      items: (schedules ?? []).filter((s) => s.time_slot === slot),
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
        <Link href={`/rooms/${roomId}/schedule/new`}>
          <Button>+ Tambah Tugas</Button>
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <FilterChip
          href={`/rooms/${roomId}/schedule`}
          active={!time_slot}
          label="Semua Waktu"
        />
        {Object.entries(TIME_SLOTS).map(([key, v]) => (
          <FilterChip
            key={key}
            href={`/rooms/${roomId}/schedule?time_slot=${key}${
              category ? `&category=${category}` : ""
            }`}
            active={time_slot === key}
            label={v.label}
          />
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <FilterChip
          href={`/rooms/${roomId}/schedule${
            time_slot ? `?time_slot=${time_slot}` : ""
          }`}
          active={!category}
          label="Semua Kategori"
        />
        {Object.entries(SCHEDULE_CATEGORIES).map(([key, v]) => (
          <FilterChip
            key={key}
            href={`/rooms/${roomId}/schedule?category=${key}${
              time_slot ? `&time_slot=${time_slot}` : ""
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
              <Link href={`/rooms/${roomId}/schedule/new`}>
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
