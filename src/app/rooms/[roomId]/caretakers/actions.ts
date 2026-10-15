"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function removeCaretaker(memberId: string, roomId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  // Verify caller is owner of the room
  const { data: membership } = await supabase
    .from("room_members")
    .select("role")
    .eq("room_id", roomId)
    .eq("user_id", userData.user.id)
    .single();

  if (!membership || membership.role !== "owner") {
    redirect("/dashboard"); // Not authorized
  }

  // Prevent removing the last owner
  const { count: remainingOwners } = await supabase
    .from("room_members")
    .select("id", { count: "exact" })
    .eq("room_id", roomId)
    .eq("role", "owner")
    .neq("id", memberId);

  const { data: memberToDelete } = await supabase
    .from("room_members")
    .select("role")
    .eq("id", memberId)
    .single();

  if (memberToDelete?.role === "owner" && (remainingOwners ?? 0) === 0) {
    redirect(`/rooms/${roomId}/caretakers?error=${encodeURIComponent("Tidak dapat menghapus owner terakhir")}`);
  }

  await supabase.from("room_members").delete().eq("id", memberId);
  revalidatePath(`/rooms/${roomId}/caretakers`);
}
