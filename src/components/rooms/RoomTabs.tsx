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

  const tabs = [
    { path: "/room", label: "Overview" },
    { path: "/room/schedule", label: "Schedule" },
    { path: "/room/notes", label: "Notes" },
    { path: "/room/attendance", label: "Attendance" },
    ...(isOwner ? [{ path: "/room/caretakers", label: "CareTakers" }] : []),
  ];

  return (
    <nav className="-mb-px mt-4 flex gap-1 overflow-x-auto border-b border-slate-200">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <Link
            key={tab.path}
            href={`${tab.path}?id=${roomId}`}
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
