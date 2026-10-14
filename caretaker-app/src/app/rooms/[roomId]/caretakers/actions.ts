"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function removeCaretaker(memberId: string, roomId: string) {
  const supabase = await createClient();
  await supabase.from("room_members").delete().eq("id", memberId);
  revalidatePath(`/rooms/${roomId}/caretakers`);
}
