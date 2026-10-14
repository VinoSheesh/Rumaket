// Phase 2 — Schedule reminder dispatcher.
//
// Trigger: a pg_cron job calls this function every minute via pg_net, e.g.
//   select cron.schedule(
//     'send-reminders-every-minute',
//     '* * * * *',
//     $$
//     select net.http_post(
//       url := 'https://<project-ref>.functions.supabase.co/send-reminders',
//       headers := jsonb_build_object('Authorization', 'Bearer <anon-or-service-key>')
//     );
//     $$
//   );
//
// Deploy with: supabase functions deploy send-reminders
// Required secrets (supabase secrets set ...):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT

import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT") ?? "mailto:admin@example.com",
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!
);

Deno.serve(async () => {
  const now = new Date();
  const windowStart = new Date(now.getTime() - 60_000).toTimeString().slice(0, 8);
  const windowEnd = now.toTimeString().slice(0, 8);
  const today = now.toISOString().slice(0, 10);

  const { data: dueSchedules, error } = await supabase
    .from("schedules")
    .select("id, room_id, title, specific_time")
    .eq("scheduled_date", today)
    .eq("status", "pending")
    .not("specific_time", "is", null)
    .gte("specific_time", windowStart)
    .lte("specific_time", windowEnd);

  if (error || !dueSchedules?.length) {
    return Response.json({ sent: 0, error: error?.message ?? null });
  }

  let sent = 0;

  for (const schedule of dueSchedules) {
    const { data: members } = await supabase
      .from("room_members")
      .select("user_id")
      .eq("room_id", schedule.room_id);

    const userIds = (members ?? []).map((m) => m.user_id);
    if (userIds.length === 0) continue;

    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .in("user_id", userIds);

    const payload = JSON.stringify({
      title: "Pengingat Tugas",
      body: schedule.title,
      url: `/rooms/${schedule.room_id}/schedule`,
    });

    for (const sub of subs ?? []) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload
        );
        sent++;
      } catch {
        // Expired/invalid subscription — ignore for this MVP pass.
      }
    }
  }

  return Response.json({ sent });
});
