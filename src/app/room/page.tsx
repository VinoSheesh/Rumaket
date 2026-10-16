"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useRoomContext } from "@/lib/firebase/room-context";
import { CheckInCard } from "@/components/rooms/CheckInCard";
import {
  CalendarCheck2,
  FileText,
  ArrowRight,
  Clock,
  Activity,
  Loader2,
  FileSpreadsheet,
} from "lucide-react";

type RecentNote = {
  id: string;
  category: string;
  content: string;
  created_at: string;
  full_name: string | null;
};

export default function RoomOverviewPage() {
  const { room, userId } = useRoomContext();
  const [progress, setProgress] = useState({ total: 0, completed: 0 });
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);

    (async () => {
      try {
        const schedSnap = await getDocs(
          query(
            collection(db, "patient_rooms", room.id, "schedules"),
            where("scheduled_date", "==", today),
          ),
        );
        const total = schedSnap.size;
        const completed = schedSnap.docs.filter(
          (d) => d.data().status === "completed",
        ).length;
        setProgress({ total, completed });

        const notesSnap = await getDocs(
          query(
            collection(db, "patient_rooms", room.id, "notes"),
            orderBy("created_at", "desc"),
            limit(3),
          ),
        );

        const profileCache = new Map<string, string | null>();

        const notes = await Promise.all(
          notesSnap.docs.map(async (d) => {
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
              category: (data.category as string) ?? "Umum",
              content: data.content as string,
              created_at: data.created_at as string,
              full_name: profileCache.get(caretakerId) ?? null,
            };
          }),
        );
        setRecentNotes(notes);
      } catch (err) {
        console.error("Gagal memuat overview room:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [room.id]);

  const percentage =
    progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <section>
        <CheckInCard roomId={room.id} userId={userId} />
      </section>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display text-sm font-bold text-slate-900">
                    Progres Tugas Hari Ini
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Pemantauan jadwal obat & aktivitas lansia
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                {percentage}% Selesai
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-slate-900 font-display">
                  {progress.completed}
                  <span className="text-base font-semibold text-slate-400">
                    /{progress.total}
                  </span>
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Tugas telah diselesaikan
                </span>
              </div>

              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Diperbarui secara real-time
            </span>

            <Link
              href={`/room/schedule?id=${room.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>Kelola Jadwal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display text-sm font-bold text-slate-900">
                    Catatan & Log Kesehatan Terbaru
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Laporan kondisi harian lansia dari CareTaker
                  </p>
                </div>
              </div>
            </div>

            {recentNotes.length > 0 ? (
              <div className="space-y-2.5">
                {recentNotes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-3 text-xs"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700 text-[10px]">
                      {n.full_name ? n.full_name.charAt(0).toUpperCase() : "R"}
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate">
                          {n.full_name ?? "Rumaket CareTaker"}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200/60">
                          {n.category}
                        </span>
                      </div>
                      <p className="text-slate-600 line-clamp-2 leading-relaxed">
                        {n.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-1">
                <FileSpreadsheet className="w-6 h-6 text-slate-400 mb-1" />
                <p className="text-xs font-semibold text-slate-600">
                  Belum Ada Catatan Terbaru
                </p>
                <p className="text-[11px] text-slate-400">
                  Catatan perkembangan lansia akan tampil setelah ditambahkan
                  perawat.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Menampilkan 3 catatan terakhir
            </span>

            <Link
              href={`/room/notes?id=${room.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>Lihat Semua Catatan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
