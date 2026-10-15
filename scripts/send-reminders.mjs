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

async function main() {
  const { today, nowTime } = jakartaParts(new Date());

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
