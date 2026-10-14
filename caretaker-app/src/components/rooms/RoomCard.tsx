import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { RoomRole } from "@/lib/types";

export function RoomCard({
  id,
  name,
  patientName,
  inviteCode,
  role,
}: {
  id: string;
  name: string;
  patientName: string;
  inviteCode: string;
  role: RoomRole;
}) {
  return (
    <Link
      href={`/rooms/${id}`}
      className="block rounded-md border border-slate-200 bg-white p-5 transition-colors hover:border-brand-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-base font-semibold text-slate-900">
            {name}
          </p>
          <p className="mt-0.5 text-sm text-slate-500">
            Pasien: {patientName}
          </p>
        </div>
        <Badge
          className={
            role === "owner"
              ? "border-brand-200 bg-brand-50 text-brand-700"
              : "border-slate-200 bg-slate-50 text-slate-600"
          }
        >
          {role === "owner" ? "Owner" : "CareTaker"}
        </Badge>
      </div>
      {role === "owner" && (
        <p className="mt-4 text-xs text-slate-400">
          Kode undangan:{" "}
          <span className="font-mono font-semibold text-slate-600">
            {inviteCode}
          </span>
        </p>
      )}
    </Link>
  );
}
