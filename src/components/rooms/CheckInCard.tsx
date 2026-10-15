"use client";

import { useEffect, useState, useTransition } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Button } from "@/components/ui/Button";
import { checkIn, checkOut } from "@/app/room/actions";

export interface OnDutyEntry {
  id: string;
  caretaker_id: string;
  check_in_at: string;
  full_name: string | null;
}

export function CheckInCard({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [onDuty, setOnDuty] = useState<OnDutyEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "patient_rooms", roomId, "attendances"),
      where("status", "==", "on_duty")
    );

    const profileCache = new Map<string, string | null>();

    return onSnapshot(q, async (snap) => {
      const entries = await Promise.all(
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
            caretaker_id: caretakerId,
            check_in_at: data.check_in_at as string,
            full_name: profileCache.get(caretakerId) ?? null,
          };
        })
      );
      setOnDuty(entries);
    });
  }, [roomId]);

  const mine = onDuty.find((o) => o.caretaker_id === userId);

  function handleCheckIn() {
    setError(null);
    startTransition(async () => {
      const result = await checkIn(roomId, userId);
      if (!result.ok) setError(result.error);
    });
  }

  function handleCheckOut() {
    if (!mine) return;
    startTransition(async () => {
      await checkOut(mine.id, roomId);
    });
  }

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-sm font-semibold text-slate-900">
          Status Kehadiran
        </p>
        {mine ? (
          <Button
            variant="danger"
            size="sm"
            onClick={handleCheckOut}
            disabled={isPending}
          >
            Selesai Shift / Check-Out
          </Button>
        ) : (
          <Button size="sm" onClick={handleCheckIn} disabled={isPending}>
            Mulai Shift / Check-In
          </Button>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}

      <ul className="mt-4 space-y-2">
        {onDuty.length === 0 && (
          <li className="text-sm text-slate-400">
            Belum ada caretaker yang sedang bertugas.
          </li>
        )}
        {onDuty.map((o) => (
          <li
            key={o.id}
            className="flex items-center gap-2 text-sm text-slate-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-medium">{o.full_name ?? "Rumaket"}</span>
            <span className="text-slate-400">
              sejak{" "}
              {new Date(o.check_in_at).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
