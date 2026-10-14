"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateInviteCode } from "@/lib/invite-code";

export async function createRoom(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const patientName = String(formData.get("patient_name") ?? "").trim();

  if (!name || !patientName) {
    redirect(
      `/dashboard/rooms/new?error=${encodeURIComponent(
        "Nama room dan nama pasien wajib diisi"
      )}`
    );
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  let roomId: string | null = null;
  let lastError: string | null = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateInviteCode();
    const { data, error } = await supabase
      .from("patient_rooms")
      .insert({
        name,
        patient_name: patientName,
        invite_code: code,
        created_by: userData.user.id,
      })
      .select("id")
      .single();

    if (!error && data) {
      roomId = data.id;
      break;
    }

    if (error?.code === "23505") continue; // invite_code collision, retry
    lastError = error?.message ?? "Gagal membuat room";
    break;
  }

  if (!roomId) {
    redirect(
      `/dashboard/rooms/new?error=${encodeURIComponent(
        lastError ?? "Gagal membuat room, coba lagi"
      )}`
    );
  }

  redirect(`/rooms/${roomId}`);
}
