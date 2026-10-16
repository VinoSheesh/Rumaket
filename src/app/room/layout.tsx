"use client";

import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { RequireAuth } from "@/lib/firebase/guard";
import { RoomProvider, useRoomContext } from "@/lib/firebase/room-context";
import { RoomHeader } from "@/components/room/Header";
import { DashboardFooter } from "@/components/dashboard/Footer";
import { Loader2 } from "lucide-react";

function RoomShell({ children }: { children: ReactNode }) {
  const { room, membership } = useRoomContext();
  const isOwner = membership.role === "owner";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60">
      <RoomHeader
        roomId={room.id}
        roomName={room.name}
        patientName={room.patient_name}
        inviteCode={room.invite_code}
        isOwner={isOwner}
      />

      <main className="flex-1 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 xl:px-12 py-6 sm:py-8">
        {children}
      </main>

      <DashboardFooter />
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50/60 space-y-3">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <p className="text-xs font-medium text-slate-500">Memuat ruangan perawatan…</p>
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