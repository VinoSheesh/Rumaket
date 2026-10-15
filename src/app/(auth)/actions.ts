"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (password.length < 6) {
    redirect(
      `/register?error=${encodeURIComponent(
        "Password minimal 6 karakter"
      )}`
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  // Redirect to check-email page if email confirmation is required
  if (!data.session) {
    redirect("/check-email?email=" + encodeURIComponent(email));
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function joinRoomByCode(formData: FormData) {
  const code = String(formData.get("code") ?? "")
    .trim()
    .toUpperCase();

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect(
      `/register?error=${encodeURIComponent(
        "Daftar atau masuk dahulu sebelum bergabung ke room"
      )}&join_code=${encodeURIComponent(code)}`
    );
  }

  // Find room by code
  const { data: room } = await supabase
    .from("patient_rooms")
    .select("id")
    .eq("invite_code", code)
    .single();

  if (!room) {
    redirect(
      `/join?error=${encodeURIComponent("Kode undangan tidak valid")}`
    );
  }

  // Check if already a member (handles race condition from double-click)
  const { data: existingMembership } = await supabase
    .from("room_members")
    .select("id")
    .eq("room_id", room.id)
    .eq("user_id", userData.user.id)
    .single();

  if (existingMembership) {
    redirect(`/rooms/${room.id}`);
  }

  // Add as new member
  const { error } = await supabase
    .from("room_members")
    .insert({
      room_id: room.id,
      user_id: userData.user.id,
      role: "caretaker",
    });

  if (error) {
    redirect(
      `/join?error=${encodeURIComponent(error.message)}`
    );
  }

  redirect(`/rooms/${room.id}`);
}
