import { getRoomContext } from "@/lib/rooms";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import type { Attendance } from "@/lib/types";

type AttendanceRow = Attendance & {
  profiles: { full_name: string | null } | null;
};

function formatDuration(checkIn: string, checkOut: string | null) {
  const start = new Date(checkIn).getTime();
  const end = checkOut ? new Date(checkOut).getTime() : Date.now();
  const minutes = Math.max(0, Math.round((end - start) / 60000));
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}j ${mins}m` : `${mins}m`;
}

export default async function AttendancePage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const { supabase } = await getRoomContext(roomId);

  const { data: logsRaw } = await supabase
    .from("attendances")
    .select("*, profiles(full_name)")
    .eq("room_id", roomId)
    .order("check_in_at", { ascending: false })
    .returns<AttendanceRow[]>();

  const logs = logsRaw ?? [];

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-slate-900">
        Riwayat Kehadiran
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Log check-in dan check-out seluruh caretaker di room ini.
      </p>

      <div className="mt-6">
        {logs.length === 0 ? (
          <EmptyState
            icon="🕒"
            title="Belum ada riwayat kehadiran"
            description="Riwayat akan muncul setelah caretaker melakukan check-in."
          />
        ) : (
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2.5">Caretaker</th>
                  <th className="px-4 py-2.5">Check-In</th>
                  <th className="px-4 py-2.5">Check-Out</th>
                  <th className="px-4 py-2.5">Durasi</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {log.profiles?.full_name ?? "Caretaker"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(log.check_in_at).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {log.check_out_at
                        ? new Date(log.check_out_at).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDuration(log.check_in_at, log.check_out_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          log.status === "on_duty"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-50 text-slate-600"
                        }
                      >
                        {log.status === "on_duty" ? "On-Duty" : "Selesai"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
