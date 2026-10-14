import { notFound } from "next/navigation";
import { getRoomContext } from "@/lib/rooms";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { removeCaretaker } from "@/app/rooms/[roomId]/caretakers/actions";
import type { RoomMember } from "@/lib/types";

type MemberRow = RoomMember & {
  profiles: { full_name: string | null; phone: string | null } | null;
};

export default async function CaretakersPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const { supabase, room, membership } = await getRoomContext(roomId);

  if (membership.role !== "owner") {
    notFound();
  }

  const { data: membersRaw } = await supabase
    .from("room_members")
    .select("*, profiles(full_name, phone)")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true })
    .returns<MemberRow[]>();

  const members = membersRaw ?? [];

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
                  {m.profiles?.full_name ?? "—"}
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
                    <form action={removeCaretaker.bind(null, m.id, roomId)}>
                      <Button type="submit" variant="danger" size="sm">
                        Hapus
                      </Button>
                    </form>
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
