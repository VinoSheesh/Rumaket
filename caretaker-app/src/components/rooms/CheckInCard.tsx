"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { checkIn, checkOut } from "@/app/rooms/[roomId]/actions";

export interface OnDutyEntry {
  id: string;
  caretaker_id: string;
  check_in_at: string;
  full_name: string | null;
}

export function CheckInCard({
  roomId,
  userId,
  onDuty,
}: {
  roomId: string;
  userId: string;
  onDuty: OnDutyEntry[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const mine = onDuty.find((o) => o.caretaker_id === userId);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`attendances-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendances",
          filter: `room_id=eq.${roomId}`,
        },
        () => router.refresh()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, router]);

  function handleCheckIn() {
    startTransition(async () => {
      await checkIn(roomId);
      router.refresh();
    });
  }

  function handleCheckOut() {
    if (!mine) return;
    startTransition(async () => {
      await checkOut(mine.id, roomId);
      router.refresh();
    });
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5">
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
            <span className="font-medium">
              {o.full_name ?? "Caretaker"}
            </span>
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
