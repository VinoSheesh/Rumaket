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

  let lastError: string | null = null;

  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateInviteCode();

    // Diagnostic: INSERT without returning the row.
    const { error } = await supabase
      .from("patient_rooms")
      .insert({
        name,
        patient_name: patientName,
        invite_code: code,
        created_by: userData.user.id,
      });

    if (!error) {
      console.log("Plain patient_rooms INSERT succeeded");
      break;
    }

    console.error("Plain patient_rooms INSERT failed:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    if (error.code === "23505") {
      continue;
    }

    lastError = error.message;
    break;
  }

  if (lastError) {
    redirect(
      `/dashboard/rooms/new?error=${encodeURIComponent(lastError)}`,
    );
  }

  // Temporary diagnostic endpoint: don't redirect to a room yet,
  // because this test intentionally doesn't retrieve its ID.
  redirect(
    `/dashboard/rooms/new?error=${encodeURIComponent(
      "Tes INSERT selesai. Periksa terminal server untuk hasilnya.",
    )}`,
  );
}