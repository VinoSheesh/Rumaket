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

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);

    (async () => {
      const schedSnap = await getDocs(
        query(
          collection(db, "patient_rooms", room.id, "schedules"),
          where("scheduled_date", "==", today)
        )
      );
      const total = schedSnap.size;
      const completed = schedSnap.docs.filter(
        (d) => d.data().status === "completed"
      ).length;
      setProgress({ total, completed });

      const notesSnap = await getDocs(
        query(
          collection(db, "patient_rooms", room.id, "notes"),
          orderBy("created_at", "desc"),
          limit(3)
        )
      );

      const profileCache = new Map<string, string | null>();

      const notes = await Promise.all(
        notesSnap.docs.map(async (d) => {
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
            category: data.category as string,
            content: data.content as string,
            created_at: data.created_at as string,
            full_name: profileCache.get(caretakerId) ?? null,
          };
        })
      );
      setRecentNotes(notes);
    })();
  }, [room.id]);

  return (
    <div className="space-y-6">
      <CheckInCard roomId={room.id} userId={userId} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-md border border-slate-200 bg-white p-5">
          <p className="font-display text-sm font-semibold text-slate-900">
            Progres Jadwal Hari Ini
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-brand-700">
            {progress.completed}/{progress.total}
          </p>
          <p className="text-sm text-slate-500">tugas selesai</p>
          <Link
            href={`/room/schedule?id=${room.id}`}
            className="mt-3 inline-block text-sm font-medium text-brand-700"
          >
            Lihat jadwal →
          </Link>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5">
          <p className="font-display text-sm font-semibold text-slate-900">
            Catatan Terbaru
          </p>
          {recentNotes.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {recentNotes.map((n) => (
                <li key={n.id} className="text-sm text-slate-600">
                  <span className="font-medium text-slate-800">
                    {n.full_name ?? "Rumaket"}:
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
            href={`/room/notes?id=${room.id}`}
            className="mt-3 inline-block text-sm font-medium text-brand-700"
          >
            Lihat semua catatan →
          </Link>
        </div>
      </div>
    </div>
  );
}
