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
import {
  UserCheck,
  LogIn,
  LogOut,
  Clock,
  Radio,
  Loader2,
  AlertCircle,
  Users,
} from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "patient_rooms", roomId, "attendances"),
      where("status", "==", "on_duty")
    );

    const profileCache = new Map<string, string | null>();

    const unsubscribe = onSnapshot(q, async (snap) => {
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
      setIsLoading(false);
    });

    return () => unsubscribe();
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
    setError(null);
    startTransition(async () => {
      await checkOut(mine.id, roomId);
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 rounded-3xl bg-slate-50/80 border border-slate-200/60">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span className="ml-2.5 text-xs font-medium text-slate-500">
          Memuat status kehadiran perawat…
        </span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${
              onDuty.length > 0
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <UserCheck className="w-5 h-5" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  onDuty.length > 0
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                    : "bg-slate-100 text-slate-600 border border-slate-200/60"
                }`}
              >
                <Radio
                  className={`w-3 h-3 ${
                    onDuty.length > 0
                      ? "text-emerald-600 animate-pulse"
                      : "text-slate-400"
                  }`}
                />
                <span>
                  {onDuty.length > 0
                    ? `${onDuty.length} CareTaker Shift Aktif`
                    : "Tidak Ada CareTaker Aktif"}
                </span>
              </span>
            </div>

            <h3 className="font-display text-base font-bold text-slate-900">
              Absensi & Status Shift
            </h3>
          </div>
        </div>

        <div className="shrink-0">
          {mine ? (
            <Button
              variant="ghost"
              onClick={handleCheckOut}
              disabled={isPending}
              className="w-full sm:w-auto min-h-[44px] justify-center rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 px-5 py-2.5 font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  <span>Proses Check-Out…</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-1.5 text-rose-600" />
                  <span>Selesai Shift (Check-Out)</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleCheckIn}
              disabled={isPending}
              className="w-full sm:w-auto min-h-[44px] justify-center rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 shadow-md shadow-blue-600/20 border-none transition-all cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  <span>Proses Check-In…</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-1.5" />
                  <span>Mulai Shift (Check-In)</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200/80 bg-rose-50/80 p-3 text-xs font-semibold text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Perawat Bertugas</span>
          </span>
        </div>

        {onDuty.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-dashed border-slate-200 text-center text-xs text-slate-500">
            Belum ada yang sedang bertugas di room ini.
          </div>
        ) : (
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
            {onDuty.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-800 truncate">
                    {o.caretaker_id === userId
                      ? `${o.full_name ?? "Anda"} (Anda)`
                      : o.full_name ?? "CareTaker Rumaket"}
                  </span>
                </div>

                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200/60 shrink-0">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>
                    {new Date(o.check_in_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}