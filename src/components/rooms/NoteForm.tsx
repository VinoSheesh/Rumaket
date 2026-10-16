"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Select, Textarea, Label } from "@/components/ui/Field";
import { NOTE_CATEGORIES } from "@/lib/constants";
import { createNote } from "@/app/room/notes/actions";
import {
  FileText,
  Upload,
  Loader2,
  Send,
  AlertCircle,
  Pill,
  Activity,
  HeartPulse,
  HelpCircle,
} from "lucide-react";

export function NoteForm({
  roomId,
  userId,
  onCreated,
}: {
  roomId: string;
  userId: string;
  onCreated: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      const result = await createNote(roomId, userId, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      formRef.current?.reset();
      onCreated();
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <FileText className="w-4 h-4" />
        </div>
        <h3 className="font-display text-sm font-bold text-slate-900">
          Tulis Catatan Perawatan
        </h3>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200/80 bg-rose-50/80 p-3 text-xs font-semibold text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-1">
          <Label
            htmlFor="category"
            className="text-xs font-semibold text-slate-700"
          >
            Kategori
          </Label>
          <Select
            id="category"
            name="category"
            required
            defaultValue="health_condition"
            className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all cursor-pointer"
          >
            {Object.entries(NOTE_CATEGORIES).map(([key, v]) => (
              <option key={key} value={key}>
                {v.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label
            htmlFor="content"
            className="text-xs font-semibold text-slate-700"
          >
            Detail Catatan
          </Label>
          <Textarea
            id="content"
            name="content"
            rows={2}
            placeholder="Tulis catatan perkembangan lansia atau serah-terima shift…"
            required
            className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all leading-relaxed"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-center w-full sm:w-auto">
          <label className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-4 py-2.5 rounded-xl transition-all">
            <Upload className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Unggah Lampiran Foto</span>
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto min-h-[42px] justify-center rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 shadow-md shadow-blue-600/20 border-none transition-all cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              <span>Menyimpan…</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5 mr-1.5" />
              <span>Simpan Catatan</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
