import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { ScheduleCategory, TimeSlot } from "@/lib/types";

// Stepping rule for recurring activities: start_time, +interval, +interval, …
// while still before midnight. `nowTime` (HH:mm, optional) filters out
// occurrences already in the past so creating a template mid-day doesn't
// spawn fake already-missed doses. The cron script (scripts/send-reminders.mjs,
// a plain .mjs with no build step) re-implements this same stepping rule —
// it can't import this TS module, so it's intentionally duplicated there.
function occurrenceTimesForToday(
  startTime: string,
  intervalHours: number,
  nowTime?: string
): string[] {
  const [startH, startM] = startTime.split(":").map(Number);
  const times: string[] = [];
  for (let minutes = startH * 60 + startM; minutes < 24 * 60; minutes += intervalHours * 60) {
    const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mm = String(minutes % 60).padStart(2, "0");
    const time = `${hh}:${mm}`;
    if (!nowTime || time >= nowTime) times.push(time);
  }
  return times;
}

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

export async function createScheduleTemplate(
  roomId: string,
  userId: string,
  formData: FormData
) {
  const category = String(formData.get("category")) as ScheduleCategory;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const startTime = String(formData.get("start_time") ?? "").trim();
  const intervalHours = Number(formData.get("interval_hours"));
  const startDate = String(formData.get("start_date") ?? "").trim();
  const endDate = String(formData.get("end_date") ?? "").trim();

  if (!title) {
    return { ok: false as const, error: "Judul tugas wajib diisi" };
  }
  if (!startTime) {
    return { ok: false as const, error: "Jam mulai wajib diisi" };
  }
  if (!Number.isFinite(intervalHours) || intervalHours < 1 || intervalHours > 24) {
    return { ok: false as const, error: "Interval pengulangan harus 1-24 jam" };
  }

  const today = new Date().toISOString().slice(0, 10);
  const effectiveStartDate = startDate || today;

  const templateRef = await addDoc(
    collection(db, "patient_rooms", roomId, "schedule_templates"),
    {
      room_id: roomId,
      category,
      title,
      description: description || null,
      interval_hours: intervalHours,
      start_time: startTime,
      start_date: effectiveStartDate,
      end_date: endDate || null,
      active: true,
      created_by: userId,
      created_at: new Date().toISOString(),
    }
  );

  // Materialize today's remaining occurrences immediately so the caretaker
  // sees the task right away instead of waiting for the next cron tick.
  if (effectiveStartDate <= today && (!endDate || endDate >= today)) {
    const nowTime = new Date().toTimeString().slice(0, 5);
    const times = occurrenceTimesForToday(startTime, intervalHours, nowTime);

    for (const time of times) {
      const instanceId = `${templateRef.id}_${today}_${time.replace(":", "")}`;
      await setDoc(
        doc(db, "patient_rooms", roomId, "schedules", instanceId),
        {
          room_id: roomId,
          category,
          time_slot: "custom",
          specific_time: time,
          title,
          description: description || null,
          scheduled_date: today,
          status: "pending",
          skip_reason: null,
          notified: false,
          created_by: userId,
          created_at: new Date().toISOString(),
          recurrence_template_id: templateRef.id,
        },
        { merge: true }
      );
    }
  }

  return { ok: true as const };
}

export async function stopScheduleTemplate(roomId: string, templateId: string) {
  await updateDoc(
    doc(db, "patient_rooms", roomId, "schedule_templates", templateId),
    { active: false }
  );
}
