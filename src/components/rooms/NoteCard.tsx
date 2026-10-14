import { Badge } from "@/components/ui/Badge";
import { NOTE_CATEGORIES } from "@/lib/constants";
import type { Note } from "@/lib/types";

export function NoteCard({
  note,
}: {
  note: Note & {
    profiles?: { full_name: string | null } | null;
    signedUrl?: string | null;
  };
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <Badge className="border-brand-200 bg-brand-50 text-brand-700">
          {NOTE_CATEGORIES[note.category].label}
        </Badge>
        <span className="text-xs text-slate-400">
          {new Date(note.created_at).toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-800">
        {note.profiles?.full_name ?? "Rumaket"}
      </p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
        {note.content}
      </p>
      {note.signedUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={note.signedUrl}
          alt="Lampiran catatan"
          className="mt-3 max-h-64 rounded-md border border-slate-200 object-cover"
        />
      )}
    </div>
  );
}
