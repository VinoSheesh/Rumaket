"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { NoteCategory } from "@/lib/types";

export async function createNote(roomId: string, formData: FormData) {
  const category = String(formData.get("category")) as NoteCategory;
  const content = String(formData.get("content") ?? "").trim();
  const photo = formData.get("photo") as File | null;

  if (!content) {
    redirect(
      `/rooms/${roomId}/notes?error=${encodeURIComponent(
        "Catatan tidak boleh kosong"
      )}`
    );
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  let photoPath: string | null = null;

  if (photo && photo.size > 0) {
    const ext = photo.name.split(".").pop() ?? "jpg";
    const path = `${roomId}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("note-photos")
      .upload(path, photo, { contentType: photo.type || "image/jpeg" });

    if (!uploadError) {
      photoPath = path;
    }
  }

  const { error } = await supabase.from("notes").insert({
    room_id: roomId,
    caretaker_id: userData.user.id,
    category,
    content,
    photo_url: photoPath,
  });

  if (error) {
    redirect(
      `/rooms/${roomId}/notes?error=${encodeURIComponent(error.message)}`
    );
  }

  redirect(`/rooms/${roomId}/notes`);
}
