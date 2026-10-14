import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getRoomContext(roomId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: room } = await supabase
    .from("patient_rooms")
    .select("id, name, patient_name, invite_code, created_by")
    .eq("id", roomId)
    .single();

  if (!room) {
    notFound();
  }

  const { data: membership } = await supabase
    .from("room_members")
    .select("role")
    .eq("room_id", roomId)
    .eq("user_id", userData.user.id)
    .single();

  if (!membership) {
    notFound();
  }

  return { supabase, user: userData.user, room, membership };
}
