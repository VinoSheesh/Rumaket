import { Users, HeartHandshake, Home } from "lucide-react";

export function Roles() {
  return (
    <section
      id="peran"
      className="relative overflow-hidden border-b border-slate-200 bg-white"
    >
      {/* Dekorasi Background */}
      <div className="absolute -top-20 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-brand-50 blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full bg-accent-50 blur-3xl opacity-60" />
      <div className="absolute top-1/2 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-warmth-50 blur-3xl opacity-40" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mb-16 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Siapa saja bisa <br />
              <span className="bg-gradient-to-r from-brand-700 to-accent-600 bg-clip-text text-transparent">
                ikut ngrumat.
              </span>
            </h2>
          </div>
          <div className="md:col-span-5 md:pb-2">
            <p className="text-base leading-relaxed text-slate-600 md:text-lg">
              Nggak harus tinggal serumah. Nggak harus jadi yang paling kuat.
              Semua anggota keluarga punya perannya masing-masing.
            </p>
          </div>
        </div>

        {/* ... grid Bento Roles sama seperti sebelumnya ... */}
        <div className="grid gap-5 md:grid-cols-12 md:grid-rows-2">
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-accent-100 bg-gradient-to-br from-accent-50 to-white p-8 transition-all hover:shadow-2xl hover:-translate-y-1 md:col-span-7 md:row-span-2 md:p-10">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-accent-200/30 blur-2xl" />
            <div className="relative">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md">
                <Users className="h-7 w-7 text-accent-700" />
              </div>
              <div className="mt-8">
                <span className="text-[11px] font-bold uppercase tracking-widest text-accent-600">
                  Peran Utama
                </span>
                <h3 className="mt-2 font-display text-2xl font-extrabold text-slate-900 md:text-3xl">
                  Anak & Cucu
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-slate-700">
                  Yang jadi{" "}
                  <span className="font-semibold text-slate-900">
                    koordinator keluarga
                  </span>
                  , atur jadwal, pantau kabar, dan pastikan semua berjalan
                  lancar. Kamu yang pegang kendali, tapi nggak sendirian.
                </p>
              </div>
            </div>
          </div>

          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-warmth-100 bg-gradient-to-br from-warmth-50 to-white p-7 transition-all hover:shadow-2xl hover:-translate-y-1 md:col-span-5 md:row-span-1">
            <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-warmth-200/40 blur-2xl" />
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md">
                <HeartHandshake className="h-6 w-6 text-warmth-600" />
              </div>
              <div className="mt-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-warmth-600">
                  Pendamping Setia
                </span>
                <h3 className="mt-1.5 font-display text-lg font-bold text-slate-900">
                  Pasangan
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Yang paling tahu kebiasaan sehari-hari. Bisa titip catatan
                  kecil buat keluarga lain yang lagi jaga.
                </p>
              </div>
            </div>
          </div>

          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-7 transition-all hover:shadow-2xl hover:-translate-y-1 md:col-span-5 md:row-span-1">
            <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-brand-200/30 blur-2xl" />
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md">
                <Home className="h-6 w-6 text-brand-700" />
              </div>
              <div className="mt-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
                  Bantuan Bergilir
                </span>
                <h3 className="mt-1.5 font-display text-lg font-bold text-slate-900">
                  Saudara / Kerabat
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Yang siap bantu bergantian jaga atau menemani di waktu luang.
                  Sekecil apa pun bantuannya, berarti.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
