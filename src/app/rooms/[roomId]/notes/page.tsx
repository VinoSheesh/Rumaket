import { getRoomContext } from "@/lib/rooms";
import { EmptyState } from "@/components/ui/EmptyState";
import { NoteForm } from "@/components/rooms/NoteForm";
import { NoteCard } from "@/components/rooms/NoteCard";
import type { Note } from "@/lib/types";

type NoteRow = Note & { profiles: { full_name: string | null } | null };

export default async function NotesPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { roomId } = await params;
  const { error } = await searchParams;
  const { supabase } = await getRoomContext(roomId);

  const { data: notesRaw } = await supabase
    .from("notes")
    .select("*, profiles(full_name)")
    .eq("room_id", roomId)
    .order("created_at", { ascending: false })
    .returns<NoteRow[]>();

  const notes = await Promise.all(
    (notesRaw ?? []).map(async (n) => {
      let signedUrl: string | null = null;
      if (n.photo_url) {
        const { data } = await supabase.storage
          .from("note-photos")
          .createSignedUrl(n.photo_url, 3600);
        signedUrl = data?.signedUrl ?? null;
      }
      return { ...n, signedUrl };
    })
  );

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-slate-900">
        Catatan Perawatan
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Kondisi kesehatan, perubahan perilaku, hasil pengukuran, dan
        serah-terima shift.
      </p>

      {error && (
        <p className="mt-4 rounded-sm border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="mt-5">
        <NoteForm roomId={roomId} />
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
