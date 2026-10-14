"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function RoomTabs({
  roomId,
  isOwner,
}: {
  roomId: string;
  isOwner: boolean;
}) {
  const pathname = usePathname();
  const base = `/rooms/${roomId}`;

  const tabs = [
    { href: base, label: "Overview" },
    { href: `${base}/schedule`, label: "Schedule" },
    { href: `${base}/notes`, label: "Notes" },
    { href: `${base}/attendance`, label: "Attendance" },
    ...(isOwner ? [{ href: `${base}/caretakers`, label: "CareTakers" }] : []),
  ];

  return (
    <nav className="-mb-px mt-4 flex gap-1 overflow-x-auto border-b border-slate-200">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-brand-700 text-brand-700"
                : "border-transparent text-slate-600 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
