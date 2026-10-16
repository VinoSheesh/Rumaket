"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useRoomContext } from "@/lib/firebase/room-context";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import type { Attendance } from "@/lib/types";
import {
  History,
  Clock,
  Calendar,
  Timer,
  User,
  Radio,
  Loader2,
  CheckCircle2,
} from "lucide-react";

type AttendanceRow = Attendance & { full_name: string | null };

function formatDuration(checkIn: string, checkOut: string | null) {
  const start = new Date(checkIn).getTime();
  const end = checkOut ? new Date(checkOut).getTime() : Date.now();
  const minutes = Math.max(0, Math.round((end - start) / 60000));
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours} jam ${mins} mnt` : `${mins} mnt`;
}

export default function AttendancePage() {
  const { room } = useRoomContext();
  const [logs, setLogs] = useState<AttendanceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(
          query(
            collection(db, "patient_rooms", room.id, "attendances"),
            orderBy("check_in_at", "desc"),
          ),
        );

        const profileCache = new Map<string, string | null>();

        const rows = await Promise.all(
          snap.docs.map(async (d) => {
            const data = d.data();
            const caretakerId = data.caretaker_id as string;
            if (!profileCache.has(caretakerId)) {
              const profileSnap = await getDoc(
                doc(db, "profiles", caretakerId),
              );
              profileCache.set(
                caretakerId,
                (profileSnap.data()?.full_name as string | undefined) ?? null,
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
          }),
        );

        setLogs(rows);
      } catch (err) {
        console.error("Gagal memuat log kehadiran:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [room.id]);

  const activeShiftCount = logs.filter((l) => l.status === "on_duty").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white p-5 sm:p-7 border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
            <History className="h-3.5 w-3.5 text-blue-600" />
            <span>Rekap Kehadiran CareTaker</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
            Riwayat Kehadiran CareTaker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pencatatan waktu check-in dan check-out otomatis untuk seluruh
            perawat di room ini.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <div className="rounded-2xl bg-slate-50 px-3.5 py-2 border border-slate-200/60 text-right">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Shift Aktif Saat Ini
            </p>
            <p className="text-xs font-bold text-slate-800 flex items-center justify-end gap-1.5 mt-0.5">
              <span
                className={`h-2 w-2 rounded-full ${activeShiftCount > 0 ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}
              />
              <span>{activeShiftCount} Perawat Sedang Bertugas</span>
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          <p className="text-xs font-medium text-slate-500">
            Memuat rekapan kehadiran...
          </p>
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm text-center">
          <EmptyState
            icon={
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-2">
                <Clock className="h-6 w-6" />
              </div>
            }
            title="Belum Ada Riwayat Kehadiran"
            description="Log kehadiran akan tercatat secara otomatis setelah perawat/caretaker menekan tombol Mulai Shift (Check-In)."
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="hidden md:block overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">CareTaker</th>
                  <th className="px-6 py-4">Waktu Check-In</th>
                  <th className="px-6 py-4">Waktu Check-Out</th>
                  <th className="px-6 py-4">Durasi Shift</th>
                  <th className="px-6 py-4 text-right">Status Shift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs border border-slate-200/60">
                          {log.full_name
                            ? log.full_name.charAt(0).toUpperCase()
                            : "C"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">
                            {log.full_name ?? "CareTaker Rumaket"}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Terverifikasi
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(log.check_in_at).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {log.check_out_at ? (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {new Date(log.check_out_at).toLocaleString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">
                          Sedang Bertugas
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        <Timer className="w-3 h-3 text-slate-400" />
                        {formatDuration(log.check_in_at, log.check_out_at)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Badge
                        className={
                          log.status === "on_duty"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold px-3 py-1 text-[11px] rounded-full inline-flex items-center gap-1.5"
                            : "bg-slate-100 text-slate-600 border-slate-200/80 font-semibold px-3 py-1 text-[11px] rounded-full inline-flex items-center gap-1.5"
                        }
                      >
                        {log.status === "on_duty" ? (
                          <>
                            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                            <span>On-Duty</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-slate-400" />
                            <span>Selesai</span>
                          </>
                        )}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 grid-cols-1 md:hidden">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs">
                      {log.full_name
                        ? log.full_name.charAt(0).toUpperCase()
                        : "C"}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">
                        {log.full_name ?? "CareTaker Rumaket"}
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        Petugas Shift
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={
                      log.status === "on_duty"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold px-2.5 py-0.5 text-[10px] rounded-full flex items-center gap-1"
                        : "bg-slate-100 text-slate-600 border-slate-200/80 font-semibold px-2.5 py-0.5 text-[10px] rounded-full flex items-center gap-1"
                    }
                  >
                    {log.status === "on_duty" ? "On-Duty" : "Selesai"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                      Check-In
                    </span>
                    <span className="font-bold text-slate-800 text-[11px] block">
                      {new Date(log.check_in_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(log.check_in_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                      Check-Out
                    </span>
                    <span className="font-bold text-slate-800 text-[11px] block">
                      {log.check_out_at
                        ? new Date(log.check_out_at).toLocaleTimeString(
                            "id-ID",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : "— (Aktif)"}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {log.check_out_at
                        ? new Date(log.check_out_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                            },
                          )
                        : "Masih Bertugas"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                  <span>Total Durasi Shift:</span>
                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
                    {formatDuration(log.check_in_at, log.check_out_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
