"use client";

import { useEffect, useState, useTransition } from "react";
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
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { removeCaretaker } from "@/app/room/caretakers/actions";
import type { RoomMember } from "@/lib/types";

type MemberRow = RoomMember & {
  full_name: string | null;
  phone: string | null;
};

export default function CaretakersPage() {
  const { room, membership } = useRoomContext();
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function loadMembers() {
    const snap = await getDocs(
      query(
        collection(db, "patient_rooms", room.id, "members"),
        orderBy("created_at", "asc")
      )
    );

    const rows = await Promise.all(
      snap.docs.map(async (d) => {
        const data = d.data();
        const profileSnap = await getDoc(doc(db, "profiles", data.user_id as string));
        const profile = profileSnap.data();
        return {
          id: d.id,
          room_id: room.id,
          user_id: data.user_id as string,
          role: data.role as RoomMember["role"],
          created_at: data.created_at as string,
          full_name: (profile?.full_name as string | undefined) ?? null,
          phone: (profile?.phone as string | undefined) ?? null,
        };
      })
    );

    setMembers(rows);
  }

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id]);

  if (membership.role !== "owner") {
    return (
      <p className="text-sm text-slate-500">
        Hanya owner yang dapat mengelola caretaker.
      </p>
    );
  }

  function handleRemove(memberId: string) {
    setError(null);
    startTransition(async () => {
      const result = await removeCaretaker(room.id, memberId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      await loadMembers();
    });
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-slate-900">
        Kelola CareTaker
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Bagikan kode undangan ke caretaker agar bisa bergabung ke room ini.
      </p>

      <div className="mt-5 flex items-center justify-between rounded-md border border-brand-200 bg-brand-50 px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand-700">
            Kode Undangan
          </p>
          <p className="font-mono text-2xl font-bold tracking-widest text-brand-700">
            {room.invite_code}
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-sm border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-md border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2.5">Nama</th>
              <th className="px-4 py-2.5">Peran</th>
              <th className="px-4 py-2.5">Bergabung</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-slate-100 last:border-b-0">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {m.full_name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    className={
                      m.role === "owner"
                        ? "border-brand-200 bg-brand-50 text-brand-700"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }
                  >
                    {m.role === "owner" ? "Owner" : "CareTaker"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {new Date(m.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  {m.role !== "owner" && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleRemove(m.id)}
                    >
                      Hapus
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
