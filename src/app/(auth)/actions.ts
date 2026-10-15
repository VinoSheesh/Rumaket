
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateInviteCode } from "@/lib/invite-code";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const fullName = String(
    formData.get("full_name") ?? "",
  ).trim();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (password.length < 6) {
    redirect(
      `/register?error=${encodeURIComponent(
        "Password minimal 6 karakter",
      )}`,
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirect(
      `/register?error=${encodeURIComponent(error.message)}`,
    );
  }

  // Email confirmation is required.
  if (!data.session) {
    redirect(
      `/check-email?email=${encodeURIComponent(email)}`,
    );
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login");
}

export async function createRoom(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();

  const patientName = String(
    formData.get("patient_name") ?? "",
  ).trim();

  if (!name || !patientName) {
    redirect(
      `/dashboard/rooms/new?error=${encodeURIComponent(
        "Nama room dan nama lansia wajib diisi.",
      )}`,
    );
  }

  const supabase = await createClient();

  const {
    data: userData,
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !userData.user) {
    redirect("/login");
  }

  let roomId: string | null = null;
  let lastError = "Gagal membuat room. Silakan coba lagi.";

  // Retry if an invitation code collides with an existing code.
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
      if (
        insertError.code === "23505" &&
        insertError.message.includes(
          "patient_rooms_invite_code_key",
        )
      ) {
        continue;
      }

      console.error("Failed to create room:", insertError);

      lastError =
        "Gagal membuat room. Periksa izin database dan coba lagi.";

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

export async function joinRoomByCode(formData: FormData) {
  const code = String(formData.get("code") ?? "")
    .trim()
    .toUpperCase();

  // Validate the invitation code.
  if (!/^[A-HJ-NP-Z2-9]{8}$/.test(code)) {
    redirect(
      `/join?error=${encodeURIComponent(
        "Kode undangan tidak valid. Periksa kembali 8 karakter kode.",
      )}`,
    );
  }

  const supabase = await createClient();

  const {
    data: userData,
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !userData.user) {
    redirect(
      `/register?error=${encodeURIComponent(
        "Daftar atau masuk dahulu sebelum bergabung ke room.",
      )}&join_code=${encodeURIComponent(code)}`,
    );
  }

  // Validate the invitation and add membership inside PostgreSQL.
  const { data: roomId, error: joinError } = await supabase.rpc(
    "join_room_by_invite_code",
    {
      p_code: code,
    },
  );

  if (joinError) {
    console.error("Failed to join room:", {
      code: joinError.code,
      message: joinError.message,
      details: joinError.details,
      hint: joinError.hint,
    });

    const message = joinError.message.includes(
      "Invalid invite code",
    )
      ? "Kode undangan tidak valid."
      : "Gagal bergabung ke room. Silakan coba lagi.";

    redirect(
      `/join?error=${encodeURIComponent(message)}`,
    );
  }

  if (!roomId) {
    redirect(
      `/join?error=${encodeURIComponent(
        "Room tidak ditemukan.",
      )}`,
    );
  }

  redirect(`/rooms/${roomId}`);
}
