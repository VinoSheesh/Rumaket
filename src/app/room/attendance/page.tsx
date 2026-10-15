"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useRoomContext } from "@/lib/firebase/room-context";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import type { Attendance } from "@/lib/types";

type AttendanceRow = Attendance & { full_name: string | null };

function formatDuration(checkIn: string, checkOut: string | null) {
  const start = new Date(checkIn).getTime();
  const end = checkOut ? new Date(checkOut).getTime() : Date.now();
  const minutes = Math.max(0, Math.round((end - start) / 60000));
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}j ${mins}m` : `${mins}m`;
}

export default function AttendancePage() {
  const { room } = useRoomContext();
  const [logs, setLogs] = useState<AttendanceRow[]>([]);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(
        query(
          collection(db, "patient_rooms", room.id, "attendances"),
          orderBy("check_in_at", "desc")
        )
      );

      const profileCache = new Map<string, string | null>();

      const rows = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();
          const caretakerId = data.caretaker_id as string;
          if (!profileCache.has(caretakerId)) {
            const profileSnap = await getDoc(doc(db, "profiles", caretakerId));
            profileCache.set(
              caretakerId,
              (profileSnap.data()?.full_name as string | undefined) ?? null
            );
          }
          return {
            id: d.id,
            room_id: room.id,
            caretaker_id: caretakerId,
            check_in_at: data.check_in_at as string,
            check_out_at: (data.check_out_at as string | null) ?? null,
            status: data.status as Attendance["status"],
            full_name: profileCache.get(caretakerId) ?? null,
          };
        })
      );

      setLogs(rows);
    })();
  }, [room.id]);

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
                  <th className="px-4 py-2.5">Rumaket</th>
                  <th className="px-4 py-2.5">Check-In</th>
                  <th className="px-4 py-2.5">Check-Out</th>
                  <th className="px-4 py-2.5">Durasi</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {log.full_name ?? "Rumaket"}
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
