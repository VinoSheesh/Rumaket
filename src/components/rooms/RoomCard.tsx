"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { User, KeyRound, ArrowUpRight, ShieldCheck, HeartHandshake } from "lucide-react";
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
  const patientInitial = patientName ? patientName.charAt(0).toUpperCase() : "L";

  return (
    <Link
      href={`/room?id=${id}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5"
    >
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2">
            <Badge
              variant={role === "owner" ? "default" : undefined}
              className={
                role === "owner"
                  ? "bg-blue-50 text-blue-700 border-blue-200/80 font-semibold px-2.5 py-1 text-[11px] rounded-full flex items-center gap-1.5"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold px-2.5 py-1 text-[11px] rounded-full flex items-center gap-1.5"
              }
            >
              {role === "owner" ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pemilik Room</span>
                </>
              ) : (
                <>
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CareTaker Bertugas</span>
                </>
              )}
            </Badge>
          </div>

          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-4 flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 font-display text-base font-bold text-slate-800 shadow-inner">
            {patientInitial}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-display text-base font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 flex items-center gap-1.5 truncate">
              <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>Lansia: <strong className="font-semibold text-slate-700">{patientName}</strong></span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {role === "owner" ? (
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-1.5 border border-slate-200/60 w-full justify-between">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              Kode Undangan
            </span>
            <span className="font-mono font-bold tracking-wider text-slate-800 bg-white px-2 py-0.5 rounded-lg border border-slate-200/80">
              {inviteCode}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full text-[11px] text-slate-500">
            <span>Akses Perawat Terverifikasi</span>
            <span className="font-semibold text-emerald-600">Aktif</span>
          </div>
        )}
      </div>
    </Link>
  );
}