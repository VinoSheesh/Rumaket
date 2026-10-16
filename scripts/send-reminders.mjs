// Runs on a GitHub Actions cron (see .github/workflows/send-reminders.yml)
// instead of a Firebase Cloud Function, since Cloud Functions require the
// paid Blaze plan. Reads schedules directly from Firestore with the Admin
// SDK (bypasses security rules) and sends Web Push notifications — no
// Firebase product involved beyond Firestore itself.
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import webpush from "web-push";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || "mailto:admin@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

function jakartaParts(date) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(date).map((p) => [p.type, p.value])
  );
  return {
    today: `${parts.year}-${parts.month}-${parts.day}`,
    nowTime: `${parts.hour}:${parts.minute}:00`,
  };
}

// Stepping rule for recurring activities: start_time, +interval, +interval,
// … while still before midnight. Mirrors occurrenceTimesForToday() in
// src/app/room/schedule/actions.ts — duplicated here since this is a plain
// .mjs script with no build step to share a TS module with the Next.js app.
// Unlike the client-side version, this always returns the full day's times
// (no "already past" filter): the cron runs every ~15 min, so a run that
// lands a few minutes after an occurrence's time should still create it —
// the reminder pass below is what decides whether it's still due.
function occurrenceTimesForToday(startTime, intervalHours) {
  const [startH, startM] = startTime.split(":").map(Number);
  const times = [];
  for (let minutes = startH * 60 + startM; minutes < 24 * 60; minutes += intervalHours * 60) {
    const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mm = String(minutes % 60).padStart(2, "0");
    times.push(`${hh}:${mm}`);
  }
  return times;
}

async function generateRecurringInstances(today) {
  const templatesSnap = await db
    .collectionGroup("schedule_templates")
    .where("active", "==", true)
    .get();

  let generated = 0;

  for (const templateDoc of templatesSnap.docs) {
    const template = templateDoc.data();
    if (template.start_date > today) continue;
    if (template.end_date && template.end_date < today) continue;

    const roomRef = templateDoc.ref.parent.parent;
    const times = occurrenceTimesForToday(
      template.start_time,
      template.interval_hours
    );

    for (const time of times) {
      const instanceId = `${templateDoc.id}_${today}_${time.replace(":", "")}`;
      const instanceRef = roomRef.collection("schedules").doc(instanceId);
      const existing = await instanceRef.get();
      if (existing.exists) continue;

      await instanceRef.set({
        room_id: roomRef.id,
        category: template.category,
        time_slot: "custom",
        specific_time: time,
        title: template.title,
        description: template.description ?? null,
        scheduled_date: today,
        status: "pending",
        skip_reason: null,
        notified: false,
        created_by: template.created_by,
        created_at: new Date().toISOString(),
        recurrence_template_id: templateDoc.id,
      });
      generated++;
    }
  }

  console.log(`Generated ${generated} recurring schedule instance(s).`);
}

async function main() {
  const { today, nowTime } = jakartaParts(new Date());

  await generateRecurringInstances(today);

  const dueSnap = await db
    .collectionGroup("schedules")
    .where("scheduled_date", "==", today)
    .where("status", "==", "pending")
    .get();

  const due = dueSnap.docs.filter((d) => {
    const data = d.data();
    return (
      data.specific_time &&
      data.specific_time <= nowTime &&
      data.notified !== true
    );
  });

  console.log(`Found ${due.length} due schedule(s) for ${today} ${nowTime} WIB`);

  let sent = 0;

  for (const scheduleDoc of due) {
    const roomRef = scheduleDoc.ref.parent.parent;
    const schedule = scheduleDoc.data();

    const membersSnap = await roomRef.collection("members").get();
    const userIds = membersSnap.docs.map((m) => m.data().user_id);
    if (userIds.length === 0) {
      await scheduleDoc.ref.update({ notified: true });
      continue;
    }

    const subsSnap = await db
      .collection("push_subscriptions")
      .where("user_id", "in", userIds.slice(0, 30))
      .get();

    const payload = JSON.stringify({
      title: "Pengingat Tugas",
      body: schedule.title,
      url: `/room/schedule?id=${roomRef.id}`,
    });

    for (const subDoc of subsSnap.docs) {
      const sub = subDoc.data();
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sent++;
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          await subDoc.ref.delete();
        } else {
          console.error("Push failed:", err.message);
        }
      }
    }

    await scheduleDoc.ref.update({ notified: true });
  }

  console.log(`Sent ${sent} notification(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
