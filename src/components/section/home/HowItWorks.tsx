import { STEPS } from "@/data/home";

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h2 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">
          Cara kerja
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n}>
              <span className="font-display text-3xl font-extrabold text-brand-200">
                {s.n}
              </span>
              <p className="mt-2 font-display text-sm font-semibold text-slate-900">
                {s.title}
              </p>
              <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
