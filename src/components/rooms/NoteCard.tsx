import { getNotePhotoUrl } from "@/lib/storage";
import { Badge } from "@/components/ui/Badge";
import { NOTE_CATEGORIES } from "@/lib/constants";
import type { Note } from "@/lib/types";

export function NoteCard({
  note,
}: {
  note: Note & { full_name?: string | null };
}) {
  const photoUrl = note.photo_url ? getNotePhotoUrl(note.photo_url) : null;

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <Badge variant="default">
          {NOTE_CATEGORIES[note.category].label}
        </Badge>
        <span className="text-xs text-slate-600">
          {new Date(note.created_at).toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-800">
        {note.full_name ?? "Rumaket"}
      </p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
        {note.content}
      </p>
      {photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt="Lampiran catatan"
          className="mt-3 max-h-64 rounded-md border border-slate-200 object-cover"
        />
      )}
    </div>
  );
}
