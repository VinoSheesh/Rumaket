"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { NoteCategory } from "@/lib/types";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

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

  // Verify user is a member of the room
  const { data: membership } = await supabase
    .from("room_members")
    .select("id")
    .eq("room_id", roomId)
    .eq("user_id", userData.user.id)
    .single();

  if (!membership) redirect("/login");

  let photoPath: string | null = null;

  if (photo && photo.size > 0) {
    // Validate photo size
    if (photo.size > MAX_PHOTO_SIZE) {
      redirect(
        `/rooms/${roomId}/notes?error=${encodeURIComponent(
          "Foto tidak boleh lebih dari 5MB"
        )}`
      );
    }

    // Validate photo type
    if (!photo.type.startsWith("image/")) {
      redirect(
        `/rooms/${roomId}/notes?error=${encodeURIComponent(
          "Hanya file gambar yang diizinkan"
        )}`
      );
    }

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
