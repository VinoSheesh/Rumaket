"use client";

import { useEffect, useState, useTransition } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { stopScheduleTemplate } from "@/app/room/schedule/actions";
import { Button } from "@/components/ui/Button";
import { SCHEDULE_CATEGORIES } from "@/lib/constants";
import type { ScheduleTemplate } from "@/lib/types";
import { Repeat, Loader2, Square } from "lucide-react";

export function RecurringTemplateList({ roomId }: { roomId: string }) {
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "patient_rooms", roomId, "schedule_templates"),
      where("active", "==", true),
    );
    return onSnapshot(q, (snap) => {
      setTemplates(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ScheduleTemplate, "id">),
        })),
      );
    });
  }, [roomId]);

  if (templates.length === 0) return null;

  return (
    <div className="space-y-3 rounded-3xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider pb-1">
        <Repeat className="w-3.5 h-3.5 text-blue-600" />
        <span>Aktivitas Rutin Aktif</span>
      </div>

      <div className="space-y-2">
        {templates.map((template) => (
          <TemplateRow key={template.id} roomId={roomId} template={template} />
        ))}
      </div>
    </div>
  );
}

function TemplateRow({
  roomId,
  template,
}: {
  roomId: string;
  template: ScheduleTemplate;
}) {
  const [isPending, startTransition] = useTransition();
  const category = SCHEDULE_CATEGORIES[template.category];

  function handleStop() {
    startTransition(async () => {
      await stopScheduleTemplate(roomId, template.id);
    });
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
      <div className="min-w-0 space-y-0.5">
        <p className="text-xs font-bold text-slate-800 truncate">
          {template.title}
        </p>
        <p className="text-[11px] text-slate-500">
          {category.label} · Setiap {template.interval_hours} jam mulai{" "}
          {template.start_time}
          {template.end_date
            ? ` · sampai ${template.end_date}`
            : " · tanpa batas"}
        </p>
      </div>

      <Button
        size="sm"
        variant="ghost"
        onClick={handleStop}
        disabled={isPending}
        className="shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200/60"
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <>
            <Square className="w-3.5 h-3.5 mr-1" />
            Hentikan
          </>
        )}
      </Button>
    </div>
  );
}
