"use client";

import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useRoomContext } from "@/lib/firebase/room-context";
import { EmptyState } from "@/components/ui/EmptyState";
import { NoteForm } from "@/components/rooms/NoteForm";
import { NoteCard } from "@/components/rooms/NoteCard";
import type { Note } from "@/lib/types";
import { ClipboardList, FileText, Loader2 } from "lucide-react";

type NoteRow = Note & { full_name: string | null };

export default function NotesPage() {
  const { room, userId } = useRoomContext();
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    try {
      const snap = await getDocs(
        query(
          collection(db, "patient_rooms", room.id, "notes"),
          orderBy("created_at", "desc"),
        ),
      );

      const profileCache = new Map<string, string | null>();

      const rows = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();
          const caretakerId = data.caretaker_id as string;
          if (!profileCache.has(caretakerId)) {
            const profileSnap = await getDoc(doc(db, "profiles", caretakerId));
            profileCache.set(
              caretakerId,
              (profileSnap.data()?.full_name as string | undefined) ?? null,
            );
          }
          return {
            id: d.id,
            room_id: room.id,
            caretaker_id: caretakerId,
            category: data.category as Note["category"],
            content: data.content as string,
            photo_url: (data.photo_url as string | null) ?? null,
            created_at: data.created_at as string,
            full_name: profileCache.get(caretakerId) ?? null,
          };
        }),
      );

      setNotes(rows);
    } catch (err) {
      console.error("Gagal memuat catatan:", err);
    } finally {
      setIsLoading(false);
    }
  }, [room.id]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white p-5 sm:p-7 border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
            <ClipboardList className="h-3.5 w-3.5 text-blue-600" />
            <span>Catatan Penting</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
            Catatan Perawatan Harian
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Kondisi kesehatan, perubahan perilaku, hasil pengukuran, dan
            serah-terima shift.
          </p>
        </div>
      </div>

      <section>
        <NoteForm roomId={room.id} userId={userId} onCreated={loadNotes} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Riwayat Catatan ({notes.length})</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
            <p className="text-xs font-medium text-slate-500">
              Memuat catatan perawatan…
            </p>
          </div>
        ) : notes.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm text-center">
            <EmptyState
              icon={<ClipboardList className="h-6 w-6 text-slate-500" />}
              title="Belum Ada Catatan"
              description="Catatan pertama akan muncul di sini setelah ditulis oleh CareTaker."
            />
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
