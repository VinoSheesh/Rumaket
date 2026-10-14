import Link from "next/link";
import { getRoomContext } from "@/lib/rooms";
import { CheckInCard, type OnDutyEntry } from "@/components/rooms/CheckInCard";

interface AttendanceRow {
  id: string;
  caretaker_id: string;
  check_in_at: string;
  profiles: { full_name: string | null } | null;
}

export default async function RoomOverviewPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const { supabase, user } = await getRoomContext(roomId);

  const { data: onDutyRaw } = await supabase
    .from("attendances")
    .select("id, caretaker_id, check_in_at, profiles(full_name)")
    .eq("room_id", roomId)
    .eq("status", "on_duty")
    .returns<AttendanceRow[]>();

  const onDuty: OnDutyEntry[] = (onDutyRaw ?? []).map((o) => ({
    id: o.id,
    caretaker_id: o.caretaker_id,
    check_in_at: o.check_in_at,
    full_name: o.profiles?.full_name ?? null,
  }));

  const today = new Date().toISOString().slice(0, 10);
  const { data: todaySchedules } = await supabase
    .from("schedules")
    .select("id, status")
    .eq("room_id", roomId)
    .eq("scheduled_date", today);

  const total = todaySchedules?.length ?? 0;
  const completed =
    todaySchedules?.filter((s) => s.status === "completed").length ?? 0;

  const { data: recentNotes } = await supabase
    .from("notes")
    .select("id, category, content, created_at, profiles(full_name)")
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })
    .limit(3)
    .returns<
      {
        id: string;
        category: string;
        content: string;
        created_at: string;
        profiles: { full_name: string | null } | null;
      }[]
    >();

  return (
    <div className="space-y-6">
      <CheckInCard roomId={roomId} userId={user.id} onDuty={onDuty} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-md border border-slate-200 bg-white p-5">
          <p className="font-display text-sm font-semibold text-slate-900">
            Progres Jadwal Hari Ini
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-brand-700">
            {completed}/{total}
          </p>
          <p className="text-sm text-slate-500">tugas selesai</p>
          <Link
            href={`/rooms/${roomId}/schedule`}
            className="mt-3 inline-block text-sm font-medium text-brand-700"
          >
            Lihat jadwal →
          </Link>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5">
          <p className="font-display text-sm font-semibold text-slate-900">
            Catatan Terbaru
          </p>
          {recentNotes && recentNotes.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {recentNotes.map((n) => (
                <li key={n.id} className="text-sm text-slate-600">
                  <span className="font-medium text-slate-800">
                    {n.profiles?.full_name ?? "Caretaker"}:
                  </span>{" "}
                  {n.content.slice(0, 60)}
                  {n.content.length > 60 ? "…" : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-400">Belum ada catatan.</p>
          )}
          <Link
            href={`/rooms/${roomId}/notes`}
            className="mt-3 inline-block text-sm font-medium text-brand-700"
          >
            Lihat semua catatan →
          </Link>
        </div>
      </div>
    </div>
  );
}
