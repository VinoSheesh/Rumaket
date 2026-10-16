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
import {
  Plus,
  KeyRound,
  Sparkles,
  Users,
  Activity,
  Loader2,
  Home,
  FileSpreadsheet,
  Clock,
  ShieldCheck,
} from "lucide-react";
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
        query(collectionGroup(db, "members"), where("user_id", "==", user.uid)),
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
        }),
      );

      setRooms(items.filter((r): r is RoomListItem => r !== null));
    })();
  }, [user]);

  const ownerCount = rooms?.filter((r) => r.role === "owner").length ?? 0;
  const caretakerCount =
    rooms?.filter((r) => r.role === "caretaker").length ?? 0;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 pt-16 px-4 sm:px-6 lg:px-10 xl:px-12">
      <div className="mx-auto max-w-[1400px] space-y-8">
        <div className="grid gap-5 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 text-white md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col justify-between border border-slate-800 shadow-xl shadow-slate-900/10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span>Pusat Kendali Perawatan</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                Manajemen Room Lansia & CareTaker
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed">
                Pantau jadwal obat, absensi shift perawat, dan perkembangan
                kesehatan harian lansia dalam satu sistem terintegrasi.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/dashboard/room/new">
                <Button className="h-11 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 font-semibold text-xs sm:text-sm px-5 border-none shadow-md shadow-blue-600/30">
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Room Baru
                </Button>
              </Link>
              <Link href="/dashboard/room/join">
                <Button
                  variant="secondary"
                  className="h-11 rounded-2xl bg-white/10 text-white hover:bg-white/20 border-white/15 font-semibold text-xs sm:text-sm px-5"
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Gabung Room
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between md:col-span-1 lg:col-span-1 xl:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Total Room
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Users className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-4xl font-black text-slate-900 font-display">
                  {rooms ? rooms.length : "—"}
                </div>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                  Ruang perawatan terhubung aktif dengan akun Anda.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100/80">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-xs font-semibold text-slate-700">
                    Milik Anda
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-xl border border-slate-200/60 shadow-2xs">
                  {ownerCount}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100/80">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700">
                    Anda Bergabung
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-xl border border-slate-200/60 shadow-2xs">
                  {caretakerCount}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm md:col-span-3 lg:col-span-4 xl:col-span-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Alur Kerja Sistem Rumaket</span>
              </h2>
              <span className="text-xs font-medium text-slate-400">
                Panduan Penggunaan
              </span>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50/80 border border-slate-100/80">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-xs">
                  01
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Registrasi & Akses</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Keluarga membuat room lansia baru atau perawat bergabung
                    menggunakan kode undangan unik.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50/80 border border-slate-100/80">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs">
                  02
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Jadwal & Shift CareTaker</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Atur instruksi obat dan pemeriksaan harian. Perawat bertugas
                    melakukan One-Tap Check-In.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50/80 border border-slate-100/80">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold text-xs">
                  03
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                    <span>Evaluasi & Catatan Medis</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Keluarga menerima laporan harian mengenai kondisi fisik,
                    vital sign, dan catatan perawat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2.5">
              <span>Daftar Room Lansia</span>
              <span className="rounded-full bg-slate-200/80 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                {rooms ? rooms.length : 0}
              </span>
            </h2>
          </div>

          {rooms === null ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
              <p className="text-xs font-medium text-slate-500">
                Memuat daftar room lansia…
              </p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm text-center">
              <EmptyState
                icon={
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-2">
                    <Home className="h-6 w-6" />
                  </div>
                }
                title="Belum Ada Room Lansia"
                description="Buat room lansia baru untuk mulai mencatat jadwal perawatan, atau bergabung ke room yang ada menggunakan kode undangan."
                action={
                  <Link href="/dashboard/room/new">
                    <Button className="h-11 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 px-6 font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/20 border-none">
                      Buat Room Pertama
                    </Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        </section>
      </div>
    </div>
  );
}
