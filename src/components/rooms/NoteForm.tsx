import { createNote } from "@/app/rooms/[roomId]/notes/actions";
import { Button } from "@/components/ui/Button";
import { Select, Textarea } from "@/components/ui/Field";
import { NOTE_CATEGORIES } from "@/lib/constants";

export function NoteForm({ roomId }: { roomId: string }) {
  return (
    <form
      action={createNote.bind(null, roomId)}
      encType="multipart/form-data"
      className="rounded-md border border-slate-200 bg-slate-50 p-4"
    >
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
        <Button type="submit" size="sm">
          Simpan Catatan
        </Button>
      </div>
    </form>
  );
}
