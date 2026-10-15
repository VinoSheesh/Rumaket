"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Select, Textarea } from "@/components/ui/Field";
import { NOTE_CATEGORIES } from "@/lib/constants";
import { createNote } from "@/app/room/notes/actions";

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
      className="rounded-md border border-slate-200 bg-slate-50 p-4"
    >
      {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select name="category" required defaultValue="health_condition" className="sm:w-56">
          {Object.entries(NOTE_CATEGORIES).map(([key, v]) => (
            <option key={key} value={key}>
              {v.label}
            </option>
          ))}
        </Select>
        <Textarea
          name="content"
          rows={2}
          placeholder="Tulis catatan perawatan…"
          required
          className="flex-1"
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <input
          type="file"
          name="photo"
          accept="image/*"
          className="text-xs text-slate-600"
        />
        <Button type="submit" size="sm" disabled={isPending}>
          Simpan Catatan
        </Button>
      </div>
    </form>
  );
}
