"use client";

import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RequireAuth } from "@/lib/firebase/guard";
import { RoomProvider, useRoomContext } from "@/lib/firebase/room-context";
import { Badge } from "@/components/ui/Badge";
import { RoomTabs } from "@/components/rooms/RoomTabs";

function RoomShell({ children }: { children: ReactNode }) {
  const { room, membership } = useRoomContext();
  const isOwner = membership.role === "owner";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 pt-4">
          <Link href="/dashboard" className="text-sm text-slate-500">
            ← Semua Room
          </Link>
          <div className="mt-2 flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-xl font-bold text-slate-900">
                {room.name}
              </h1>
              <p className="text-sm text-slate-500">
                Lansia: {room.patient_name}
              </p>
            </div>
            <Badge
              className={
                isOwner
                  ? "border-brand-200 bg-brand-50 text-brand-700"
                  : "border-slate-200 bg-slate-50 text-slate-600"
              }
            >
              {isOwner ? "Owner" : "CareTaker"}
            </Badge>
          </div>
          <RoomTabs roomId={room.id} isOwner={isOwner} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}

function RoomLayoutInner({ children }: { children: ReactNode }) {
  const roomId = useSearchParams().get("id") ?? "";

  return (
    <RoomProvider roomId={roomId}>
      <RoomShell>{children}</RoomShell>
    </RoomProvider>
  );
}

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-sm text-slate-500">Memuat…</p>
    </div>
  );
}

export default function RoomLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <Suspense fallback={<LoadingFallback />}>
        <RoomLayoutInner>{children}</RoomLayoutInner>
      </Suspense>
    </RequireAuth>
  );
}
