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
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
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

  const { data, error } = await supabase.rpc("join_room_by_code", { code });

  if (error || !data) {
    redirect(
      `/join?error=${encodeURIComponent(
        error?.message ?? "Kode undangan tidak valid"
      )}`
    );
  }

  redirect(`/rooms/${data}`);
}
