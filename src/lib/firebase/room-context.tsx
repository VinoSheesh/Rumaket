"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/lib/firebase/auth-context";
import type { PatientRoom, RoomMember } from "@/lib/types";

type RoomContextValue = {
  room: PatientRoom;
  membership: RoomMember;
  userId: string;
};

const RoomContext = createContext<RoomContextValue | null>(null);

export function RoomProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<{
    status: "loading" | "ready" | "error";
    room?: PatientRoom;
    membership?: RoomMember;
  }>({ status: "loading" });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!roomId) {
      router.replace("/dashboard");
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    (async () => {
      try {
        const memberSnap = await getDoc(
          doc(db, "patient_rooms", roomId, "members", user.uid)
        );
        const roomSnap = await getDoc(doc(db, "patient_rooms", roomId));

        if (!memberSnap.exists() || !roomSnap.exists()) {
          if (!cancelled) setState({ status: "error" });
          return;
        }

        if (!cancelled) {
          setState({
            status: "ready",
            room: { id: roomSnap.id, ...(roomSnap.data() as Omit<PatientRoom, "id">) },
            membership: {
              id: memberSnap.id,
              ...(memberSnap.data() as Omit<RoomMember, "id">),
            },
          });
        }
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roomId, user, authLoading, router]);

  if (state.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Memuat room…</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50">
        <p className="text-sm text-slate-600">
          Room tidak ditemukan atau Anda bukan anggota.
        </p>
        <a href="/dashboard" className="text-sm font-medium text-brand-700">
          ← Kembali ke Dashboard
        </a>
      </div>
    );
  }

  return (
    <RoomContext.Provider
      value={{
        room: state.room!,
        membership: state.membership!,
        userId: user!.uid,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoomContext() {
  const ctx = useContext(RoomContext);
  if (!ctx) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return ctx;
}
