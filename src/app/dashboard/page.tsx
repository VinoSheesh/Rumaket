import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { RoomCard } from "@/components/rooms/RoomCard";
import type { RoomRole } from "@/lib/types";

interface MembershipRow {
  role: RoomRole;
  patient_rooms: {
    id: string;
    name: string;
    patient_name: string;
    invite_code: string;
  } | null;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const { data: memberships } = await supabase
    .from("room_members")
    .select("role, patient_rooms(id, name, patient_name, invite_code)")
    .eq("user_id", userData.user!.id)
    .returns<MembershipRow[]>();

  const rooms = (memberships ?? []).filter((m) => m.patient_rooms);

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
        {rooms.length === 0 ? (
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
            {rooms.map((m) => (
              <RoomCard
                key={m.patient_rooms!.id}
                id={m.patient_rooms!.id}
                name={m.patient_rooms!.name}
                patientName={m.patient_rooms!.patient_name}
                inviteCode={m.patient_rooms!.invite_code}
                role={m.role}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
