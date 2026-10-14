import { ROLES } from "@/data/home";

export function Roles() {
  return (
    <section id="peran" className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h2 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">
          Dua peran, satu tujuan
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {ROLES.map((role) => (
            <div key={role.label} className="rounded-md border border-slate-200 bg-white p-6">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                {role.label}
              </span>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {role.items.map((item) => (
                  <li key={item}>— {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
