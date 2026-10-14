"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function checkIn(roomId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  await supabase.from("attendances").insert({
    room_id: roomId,
    caretaker_id: userData.user.id,
  });

  revalidatePath(`/rooms/${roomId}`);
}

export async function checkOut(attendanceId: string, roomId: string) {
  const supabase = await createClient();

  await supabase
    .from("attendances")
    .update({ check_out_at: new Date().toISOString(), status: "completed" })
    .eq("id", attendanceId);

  revalidatePath(`/rooms/${roomId}`);
}
