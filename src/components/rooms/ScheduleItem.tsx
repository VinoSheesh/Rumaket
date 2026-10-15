"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  completeSchedule,
  resetSchedule,
  skipSchedule,
} from "@/app/room/schedule/actions";
import { SCHEDULE_CATEGORIES, SCHEDULE_STATUS } from "@/lib/constants";
import type { Schedule } from "@/lib/types";

export function ScheduleItem({
  schedule,
  roomId,
}: {
  schedule: Schedule;
  roomId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [showSkipForm, setShowSkipForm] = useState(false);
  const [reason, setReason] = useState("");

  const category = SCHEDULE_CATEGORIES[schedule.category];
  const statusMeta = SCHEDULE_STATUS[schedule.status];

  function handleComplete() {
    startTransition(async () => {
      await completeSchedule(roomId, schedule.id);
    });
  }

  function handleReset() {
    startTransition(async () => {
      await resetSchedule(roomId, schedule.id);
    });
  }

  function handleSkip() {
    startTransition(async () => {
      await skipSchedule(roomId, schedule.id, reason);
      setShowSkipForm(false);
    });
  }

  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="text-base">{category.icon}</span>
        <div>
          <p className="text-sm font-medium text-slate-900">
            {schedule.title}
          </p>
          <p className="text-xs text-slate-500">
            {category.label}
            {schedule.specific_time ? ` · ${schedule.specific_time}` : ""}
          </p>
          {schedule.description && (
            <p className="mt-1 text-xs text-slate-500">
              {schedule.description}
            </p>
          )}
          {schedule.status === "skipped" && schedule.skip_reason && (
            <p className="mt-1 text-xs text-rose-600">
              Alasan dilewati: {schedule.skip_reason}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge className={statusMeta.className}>{statusMeta.label}</Badge>
        {schedule.status === "pending" && !showSkipForm && (
          <>
            <Button size="sm" onClick={handleComplete} disabled={isPending}>
              Selesai
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSkipForm(true)}
              disabled={isPending}
            >
              Lewati
            </Button>
          </>
        )}
        {schedule.status !== "pending" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            disabled={isPending}
          >
            Reset
          </Button>
        )}
      </div>

      {showSkipForm && (
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Alasan dilewati"
            className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm sm:w-48"
          />
          <Button size="sm" variant="danger" onClick={handleSkip}>
            Simpan
          </Button>
        </div>
      )}
    </div>
  );
}
