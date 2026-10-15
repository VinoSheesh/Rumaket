import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { uploadNotePhoto } from "@/lib/storage";
import type { NoteCategory } from "@/lib/types";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

export async function createNote(
  roomId: string,
  userId: string,
  formData: FormData
) {
  const category = String(formData.get("category")) as NoteCategory;
  const content = String(formData.get("content") ?? "").trim();
  const photo = formData.get("photo") as File | null;

  if (!content) {
    return { ok: false as const, error: "Catatan tidak boleh kosong" };
  }

  let photoPath: string | null = null;

  if (photo && photo.size > 0) {
    if (photo.size > MAX_PHOTO_SIZE) {
      return { ok: false as const, error: "Foto tidak boleh lebih dari 5MB" };
    }
    if (!photo.type.startsWith("image/")) {
      return { ok: false as const, error: "Hanya file gambar yang diizinkan" };
    }

    const ext = photo.name.split(".").pop() ?? "jpg";
    const path = `${roomId}/${crypto.randomUUID()}.${ext}`;

    try {
      await uploadNotePhoto(path, photo);
      photoPath = path;
    } catch {
      // Keep the note without a photo rather than failing the whole submit.
    }
  }

  await addDoc(collection(db, "patient_rooms", roomId, "notes"), {
    room_id: roomId,
    caretaker_id: userId,
    category,
    content,
    photo_url: photoPath,
    created_at: new Date().toISOString(),
  });

  return { ok: true as const };
}
