import { getNotePhotoUrl } from "@/lib/storage";
import { Badge } from "@/components/ui/Badge";
import { NOTE_CATEGORIES } from "@/lib/constants";
import type { Note } from "@/lib/types";
import {
  Clock,
  Pill,
  Activity,
  HeartPulse,
  FileText,
  HelpCircle,
} from "lucide-react";

export function NoteCard({
  note,
}: {
  note: Note & { full_name?: string | null };
}) {
  const photoUrl = note.photo_url ? getNotePhotoUrl(note.photo_url) : null;
  const categoryMeta = NOTE_CATEGORIES[note.category] ?? {
    label: "Umum",
  };

  const initial = note.full_name ? note.full_name.charAt(0).toUpperCase() : "R";

  const renderCategoryIcon = (key: string) => {
    switch (key) {
      case "vitals":
        return <Activity className="w-3.5 h-3.5 text-rose-600" />;
      case "medication":
        return <Pill className="w-3.5 h-3.5 text-blue-600" />;
      case "behavior":
        return <HeartPulse className="w-3.5 h-3.5 text-amber-600" />;
      case "handover":
        return <FileText className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const formattedDate = new Date(note.created_at).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3 hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 text-xs border border-slate-200/60">
            {initial}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs">
              {note.full_name ?? "Rumaket CareTaker"}
            </h4>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formattedDate}</span>
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-50 border border-slate-200/60 text-slate-700 shrink-0">
          {renderCategoryIcon(note.category)}
          <span>{categoryMeta.label}</span>
        </span>
      </div>

      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
        {note.content}
      </p>

      {photoUrl && (
        <div className="pt-2">
          <img
            src={photoUrl}
            alt="Lampiran catatan"
            className="max-h-64 rounded-2xl border border-slate-200/80 object-cover"
          />
        </div>
      )}
    </div>
  );
}
