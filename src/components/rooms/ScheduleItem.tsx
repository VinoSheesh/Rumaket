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
import {
  Pill,
  Utensils,
  Bath,
  Activity,
  Dumbbell,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  AlertCircle,
  Loader2,
  HelpCircle,
  Repeat,
} from "lucide-react";

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

  // Helper pemetaan Icon Lucide berdasarkan kunci kategori
  const renderCategoryIcon = (key: string) => {
    switch (key) {
      case "medication":
        return <Pill className="w-4 h-4 text-blue-900" />;
      case "meal":
        return <Utensils className="w-4 h-4 text-blue-900" />;
      case "hygiene":
        return <Bath className="w-4 h-4 text-blue-900" />;
      case "vitals":
        return <Activity className="w-4 h-4 text-rblue-900" />;
      case "therapy":
        return <Dumbbell className="w-4 h-4 text-blue-900" />;
      default:
        return <HelpCircle className="w-4 h-4 text-blue-900" />;
    }
  };

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
    if (!reason.trim()) return;
    startTransition(async () => {
      await skipSchedule(roomId, schedule.id, reason);
      setShowSkipForm(false);
    });
  }

  return (
    <div className="flex flex-col gap-3 p-4 border-b border-slate-100/80 last:border-b-0 hover:bg-slate-50/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100/80 border border-slate-200/60 mt-0.5">
            {renderCategoryIcon(schedule.category)}
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              {schedule.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                {category.label}
              </span>
              {schedule.specific_time && (
                <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold text-slate-700">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {schedule.specific_time}
                </span>
              )}
              {schedule.recurrence_template_id && (
                <span className="flex items-center gap-1 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md text-[11px] font-bold text-blue-700">
                  <Repeat className="w-3 h-3 text-blue-500" />
                  Rutin
                </span>
              )}
            </div>

            {schedule.description && (
              <p className="mt-1 text-xs text-slate-600 leading-relaxed ">
                {schedule.description}
              </p>
            )}

            {schedule.status === "skipped" && schedule.skip_reason && (
              <div className="mt-1.5 flex items-start gap-1.5 text-xs text-rose-700 bg-rose-50 p-2 rounded-xl border border-rose-100">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                <span>
                  <strong>Alasan dilewati:</strong> {schedule.skip_reason}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0">
          <Badge className={statusMeta.className}>{statusMeta.label}</Badge>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        {schedule.status === "pending" && !showSkipForm && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSkipForm(true)}
              disabled={isPending}
              className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200/60"
            >
              <XCircle className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Lewati
            </Button>

            <Button
              size="sm"
              onClick={handleComplete}
              disabled={isPending}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 text-xs shadow-sm shadow-blue-600/20 border-none"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Selesai
                </>
              )}
            </Button>
          </div>
        )}

        {schedule.status !== "pending" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            disabled={isPending}
            className="rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200/60"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Reset Status
              </>
            )}
          </Button>
        )}
      </div>

      {showSkipForm && (
        <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 animate-in fade-in duration-150">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Tulis alasan dilewati (misal: lansia menolak/tidur)…"
            className="w-full flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
            required
          />
          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowSkipForm(false)}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60"
            >
              Batal
            </button>
            <Button
              size="sm"
              variant="danger"
              onClick={handleSkip}
              disabled={isPending || !reason.trim()}
              className="rounded-xl px-4 py-2 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-600/20 border-none"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
