const ITEMS = [
  {
    time: "07:00",
    icon: "💊",
    title: "Obat Tekanan Darah",
    status: "Selesai",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    time: "09:30",
    icon: "🩺",
    title: "Cek Tensi & Gula Darah",
    status: "Selesai",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    time: "12:00",
    icon: "🥗",
    title: "Makan Siang + Obat Siang",
    status: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    time: "15:00",
    icon: "🏃",
    title: "Terapi Fisik Ringan",
    status: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
];

export function MockSchedule() {
  return (
    <div className="w-full max-w-sm rounded-md border border-slate-200 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <p className="font-display text-sm font-semibold text-slate-900">
            Ruang Melati — Opa Budi
          </p>
          <p className="text-xs text-slate-500">Jadwal hari ini</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          On-duty
        </span>
      </div>
      <ul className="divide-y divide-slate-100">
        {ITEMS.map((item) => (
          <li key={item.time} className="flex items-center gap-3 px-4 py-3">
            <span className="w-11 shrink-0 text-xs font-medium text-slate-400">
              {item.time}
            </span>
            <span className="text-base">{item.icon}</span>
            <span className="flex-1 text-sm text-slate-800">
              {item.title}
            </span>
            <span
              className={`shrink-0 rounded-sm border px-1.5 py-0.5 text-[10px] font-medium ${item.color}`}
            >
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
