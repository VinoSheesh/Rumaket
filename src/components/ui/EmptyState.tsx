import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-xs border border-slate-100 mb-1">
          {icon}
        </div>
      )}
      <p className="font-display text-sm font-bold text-slate-900">{title}</p>
      {description && (
        <p className="max-w-sm text-xs text-slate-500 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
