import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { ScheduleCategory, TimeSlot } from "@/lib/types";

export async function createSchedule(
  roomId: string,
  userId: string,
  formData: FormData
) {
  const category = String(formData.get("category")) as ScheduleCategory;
  const timeSlot = String(formData.get("time_slot")) as TimeSlot;
  const specificTime = String(formData.get("specific_time") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const scheduledDate = String(formData.get("scheduled_date") ?? "").trim();

  if (!title) {
    return { ok: false as const, error: "Judul tugas wajib diisi" };
  }

  await addDoc(collection(db, "patient_rooms", roomId, "schedules"), {
    room_id: roomId,
    category,
    time_slot: timeSlot,
    specific_time: timeSlot === "custom" && specificTime ? specificTime : null,
    title,
    description: description || null,
    scheduled_date: scheduledDate || new Date().toISOString().slice(0, 10),
    status: "pending",
    skip_reason: null,
    notified: false,
    created_by: userId,
    created_at: new Date().toISOString(),
  });

  return { ok: true as const };
}

export async function completeSchedule(roomId: string, scheduleId: string) {
  await updateDoc(doc(db, "patient_rooms", roomId, "schedules", scheduleId), {
    status: "completed",
    skip_reason: null,
  });
}

export async function skipSchedule(
  roomId: string,
  scheduleId: string,
  reason: string
) {
  await updateDoc(doc(db, "patient_rooms", roomId, "schedules", scheduleId), {
    status: "skipped",
    skip_reason: reason || null,
  });
}

export async function resetSchedule(roomId: string, scheduleId: string) {
  await updateDoc(doc(db, "patient_rooms", roomId, "schedules", scheduleId), {
    status: "pending",
    skip_reason: null,
    notified: false,
  });
}
