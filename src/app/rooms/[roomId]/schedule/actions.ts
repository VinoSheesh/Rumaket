"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ScheduleCategory, TimeSlot } from "@/lib/types";

export async function createSchedule(roomId: string, formData: FormData) {
  const category = String(formData.get("category")) as ScheduleCategory;
  const timeSlot = String(formData.get("time_slot")) as TimeSlot;
  const specificTime = String(formData.get("specific_time") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const scheduledDate = String(formData.get("scheduled_date") ?? "").trim();

  if (!title) {
    redirect(
      `/rooms/${roomId}/schedule/new?error=${encodeURIComponent(
        "Judul tugas wajib diisi"
      )}`
    );
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  // Verify user is a member of the room
  const { data: membership } = await supabase
    .from("room_members")
    .select("role")
    .eq("room_id", roomId)
    .eq("user_id", userData.user.id)
    .single();

  if (!membership) redirect("/login");

  const { error } = await supabase.from("schedules").insert({
    room_id: roomId,
    category,
    time_slot: timeSlot,
    specific_time: timeSlot === "custom" && specificTime ? specificTime : null,
    title,
    description: description || null,
    scheduled_date: scheduledDate || new Date().toISOString().slice(0, 10),
    created_by: userData.user.id,
  });

  if (error) {
    redirect(
      `/rooms/${roomId}/schedule/new?error=${encodeURIComponent(
        error.message
      )}`
    );
  }

  redirect(`/rooms/${roomId}/schedule`);
}

export async function completeSchedule(scheduleId: string, roomId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  // Verify schedule belongs to room and user is a member
  const { data: schedule } = await supabase
    .from("schedules")
    .select("id, room_id")
    .eq("id", scheduleId)
    .eq("room_id", roomId)
    .single();

  if (!schedule) {
    redirect(`/rooms/${roomId}/schedule?error=${encodeURIComponent("Jadwal tidak ditemukan")}`);
  }

  await supabase
    .from("schedules")
    .update({ status: "completed", skip_reason: null })
    .eq("id", scheduleId);
  revalidatePath(`/rooms/${roomId}/schedule`);
}

export async function skipSchedule(
  scheduleId: string,
  roomId: string,
  reason: string
) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  // Verify schedule belongs to room and user is a member
  const { data: schedule } = await supabase
    .from("schedules")
    .select("id, room_id")
    .eq("id", scheduleId)
    .eq("room_id", roomId)
    .single();

  if (!schedule) {
    redirect(`/rooms/${roomId}/schedule?error=${encodeURIComponent("Jadwal tidak ditemukan")}`);
  }

  await supabase
    .from("schedules")
    .update({ status: "skipped", skip_reason: reason || null })
    .eq("id", scheduleId);
  revalidatePath(`/rooms/${roomId}/schedule`);
}

export async function resetSchedule(scheduleId: string, roomId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  // Verify schedule belongs to room and user is owner
  const { data: membership } = await supabase
    .from("room_members")
    .select("role")
    .eq("room_id", roomId)
    .eq("user_id", userData.user.id)
    .single();

  if (!membership || membership.role !== "owner") {
    redirect(`/rooms/${roomId}/schedule?error=${encodeURIComponent("Hanya owner yang dapat reset jadwal")}`);
  }

  // Verify schedule belongs to room
  const { data: schedule } = await supabase
    .from("schedules")
    .select("id, room_id")
    .eq("id", scheduleId)
    .eq("room_id", roomId)
    .single();

  if (!schedule) {
    redirect(`/rooms/${roomId}/schedule?error=${encodeURIComponent("Jadwal tidak ditemukan")}`);
  }

  await supabase
    .from("schedules")
    .update({ status: "pending", skip_reason: null })
    .eq("id", scheduleId);
  revalidatePath(`/rooms/${roomId}/schedule`);
}
