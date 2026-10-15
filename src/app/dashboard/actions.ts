
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateInviteCode } from "@/lib/invite-code";

export async function createRoom(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const patientName = String(
    formData.get("patient_name") ?? "",
  ).trim();

  // Validate input
  if (!name || !patientName) {
    redirect(
      `/dashboard/rooms/new?error=${encodeURIComponent(
        "Nama room dan nama lansia wajib diisi.",
      )}`,
    );
  }

  // Verify authenticated user
  const supabase = await createClient();
  const { data: userData, error: authError } =
    await supabase.auth.getUser();

  if (authError || !userData.user) {
    redirect("/login");
  }

  let roomId: string | null = null;
  let lastError = "Gagal membuat room. Silakan coba lagi.";

  // Retry if the generated invite code already exists
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateInviteCode(8);

    const { data: room, error: insertError } = await supabase
      .from("patient_rooms")
      .insert({
        name,
        patient_name: patientName,
        invite_code: code,
        created_by: userData.user.id,
      })
      .select("id")
      .single();

    if (insertError) {
      // PostgreSQL unique constraint violation
      if (
        insertError.code === "23505" &&
        insertError.message.includes(
          "patient_rooms_invite_code_key",
        )
      ) {
        continue;
      }

      console.error("Failed to create room:", {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
      });

      lastError =
        "Gagal membuat room. Periksa koneksi atau izin database.";
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
