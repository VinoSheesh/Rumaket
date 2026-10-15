
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateInviteCode } from "@/lib/invite-code";

export async function createRoom(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const patientName = String(
    formData.get("patient_name") ?? "",
  ).trim();

  if (!name || !patientName) {
    redirect(
      `/dashboard/rooms/new?error=${encodeURIComponent(
        "Nama room dan nama lansia wajib diisi",
      )}`,
    );
  }

  const supabase = await createClient();
  const { data: userData, error: authError } =
    await supabase.auth.getUser();

  if (authError || !userData.user) {
    redirect("/login");
  }

  let roomId: string | null = null;
  let lastError = "Gagal membuat room, coba lagi.";

  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateInviteCode();

    const { error: insertError } = await supabase
      .from("patient_rooms")
      .insert({
        name,
        patient_name: patientName,
        invite_code: code,
        created_by: userData.user.id,
      });

    if (insertError) {
      if (
        insertError.code === "23505" &&
        insertError.message.includes(
          "patient_rooms_invite_code_key",
        )
      ) {
        continue;
      }

      lastError = insertError.message;
      break;
    }

    const { data: room, error: selectError } = await supabase
      .from("patient_rooms")
      .select("id")
      .eq("invite_code", code)
      .single();

    if (selectError || !room) {
      console.error("Failed to retrieve created room:", selectError);

      lastError =
        "Room berhasil dibuat, tetapi gagal mengambil ID room.";
      break;
    }

    roomId = room.id;
    break;
  }

  if (!roomId) {
    redirect(
      `/dashboard/rooms/new?error=${encodeURIComponent(lastError)}`,
    );
  }

  redirect(`/rooms/${roomId}`);
}
