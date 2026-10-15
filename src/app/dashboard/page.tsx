"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/lib/firebase/auth-context";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { RoomCard } from "@/components/rooms/RoomCard";
import type { RoomRole } from "@/lib/types";

type RoomListItem = {
  id: string;
  name: string;
  patient_name: string;
  invite_code: string;
  role: RoomRole;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<RoomListItem[] | null>(null);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const memberSnap = await getDocs(
        query(collectionGroup(db, "members"), where("user_id", "==", user.uid))
      );

      const items = await Promise.all(
        memberSnap.docs.map(async (memberDoc) => {
          const roomId = memberDoc.data().room_id as string;
          const roomSnap = await getDoc(doc(db, "patient_rooms", roomId));
          if (!roomSnap.exists()) return null;
          const roomData = roomSnap.data();
          return {
            id: roomSnap.id,
            name: roomData.name as string,
            patient_name: roomData.patient_name as string,
            invite_code: roomData.invite_code as string,
            role: memberDoc.data().role as RoomRole,
          };
        })
      );

      setRooms(items.filter((r): r is RoomListItem => r !== null));
    })();
  }, [user]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Room Lansia
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Room yang Anda kelola atau tempat Anda bertugas.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/join">
            <Button variant="secondary">Gabung dengan Kode</Button>
          </Link>
          <Link href="/dashboard/rooms/new">
            <Button>+ Buat Room</Button>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {rooms === null ? (
          <p className="text-sm text-slate-500">Memuat…</p>
        ) : rooms.length === 0 ? (
          <EmptyState
            icon="🏠"
            title="Belum ada room lansia"
            description="Buat room lansia baru, atau gabung ke room yang sudah ada menggunakan kode undangan."
            action={
              <Link href="/dashboard/rooms/new">
                <Button>Buat Room Pertama</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {rooms.map((r) => (
              <RoomCard
                key={r.id}
                id={r.id}
                name={r.name}
                patientName={r.patient_name}
                inviteCode={r.invite_code}
                role={r.role}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
