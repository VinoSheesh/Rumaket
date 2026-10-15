"use client";

import { useCallback, useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useRoomContext } from "@/lib/firebase/room-context";
import { EmptyState } from "@/components/ui/EmptyState";
import { NoteForm } from "@/components/rooms/NoteForm";
import { NoteCard } from "@/components/rooms/NoteCard";
import type { Note } from "@/lib/types";

type NoteRow = Note & { full_name: string | null };

export default function NotesPage() {
  const { room, userId } = useRoomContext();
  const [notes, setNotes] = useState<NoteRow[]>([]);

  const loadNotes = useCallback(async () => {
    const snap = await getDocs(
      query(
        collection(db, "patient_rooms", room.id, "notes"),
        orderBy("created_at", "desc")
      )
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
            (profileSnap.data()?.full_name as string | undefined) ?? null
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
      })
    );

    setNotes(rows);
  }, [room.id]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-slate-900">
        Catatan Perawatan
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Kondisi kesehatan, perubahan perilaku, hasil pengukuran, dan
        serah-terima shift.
      </p>

      <div className="mt-5">
        <NoteForm roomId={room.id} userId={userId} onCreated={loadNotes} />
      </div>

      <div className="mt-6 space-y-3">
        {notes.length === 0 ? (
          <EmptyState
            icon="📝"
            title="Belum ada catatan"
            description="Catatan pertama akan muncul di sini setelah ditulis oleh caretaker."
          />
        ) : (
          notes.map((n) => <NoteCard key={n.id} note={n} />)
        )}
      </div>
    </div>
  );
}
