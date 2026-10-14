import { FEATURES } from "@/data/home";
import { SCHEDULE_CATEGORIES } from "@/lib/constants";

export function Features() {
  return (
    <section id="fitur" className="border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h2 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">
          Fitur inti
        </h2>
        <div className="mt-8 grid gap-px overflow-hidden rounded-md border border-slate-200 bg-slate-200 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white p-6">
              <p className="font-display text-sm font-semibold text-slate-900">
                {f.title}
              </p>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {Object.values(SCHEDULE_CATEGORIES).map((c) => (
            <span
              key={c.label}
              className="inline-flex items-center gap-2 rounded-sm border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
            >
              <span>{c.icon}</span>
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
