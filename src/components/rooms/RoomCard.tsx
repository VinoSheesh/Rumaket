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
      href={`/room?id=${id}`}
      className="block rounded-md border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-brand-400 hover:bg-white"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-base font-semibold text-slate-900">
            {name}
          </p>
          <p className="mt-0.5 text-sm text-slate-700">Lansia: {patientName}</p>
        </div>
        <Badge
          variant={role === "owner" ? "default" : undefined}
          className={
            role !== "owner"
              ? "border-slate-200 bg-slate-100 text-slate-700"
              : ""
          }
        >
          {role === "owner" ? "Owner" : "CareTaker"}
        </Badge>
      </div>
      {role === "owner" && (
        <p className="mt-4 text-xs text-slate-600">
          Kode undangan:{" "}
          <span className="font-mono font-semibold text-slate-800">
            {inviteCode}
          </span>
        </p>
      )}
    </Link>
  );
}
