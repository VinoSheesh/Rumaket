"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function checkIn(roomId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  // Prevent check-in if already on duty in any room
  const { data: existingShift } = await supabase
    .from("attendances")
    .select("id")
    .eq("caretaker_id", userData.user.id)
    .eq("status", "on_duty")
    .single();

  if (existingShift) {
    redirect(`/rooms/${roomId}?error=${encodeURIComponent("Anda masih bertugas di room lain")}`);
  }

  await supabase.from("attendances").insert({
    room_id: roomId,
    caretaker_id: userData.user.id,
  });

  revalidatePath(`/rooms/${roomId}`);
}

export async function checkOut(attendanceId: string, roomId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  // Verify the attendance belongs to this user and room
  const { data: attendance } = await supabase
    .from("attendances")
    .select("id")
    .eq("id", attendanceId)
    .eq("caretaker_id", userData.user.id)
    .eq("room_id", roomId)
    .eq("status", "on_duty")
    .single();

  if (!attendance) {
    redirect(`/rooms/${roomId}?error=${encodeURIComponent("Shift tidak ditemukan atau sudah selesai")}`);
  }

  await supabase
    .from("attendances")
    .update({ check_out_at: new Date().toISOString(), status: "completed" })
    .eq("id", attendanceId);

  revalidatePath(`/rooms/${roomId}`);
}
