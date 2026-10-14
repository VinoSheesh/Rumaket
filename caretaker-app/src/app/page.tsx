import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MockSchedule } from "@/components/landing/MockSchedule";
import { SCHEDULE_CATEGORIES } from "@/lib/constants";

const FEATURES = [
  {
    title: "Room Pasien Terisolasi",
    desc: "Satu dasbor khusus per pasien — jadwal, absensi, dan catatan tidak tercampur antar keluarga lain.",
  },
  {
    title: "Absensi Satu Ketuk",
    desc: "Check-in / check-out langsung tanpa verifikasi GPS atau foto selfie yang merepotkan caretaker.",
  },
  {
    title: "Jadwal Berkategori",
    desc: "Obat, nutrisi, higiene, tanda vital, dan terapi — dikelompokkan per slot waktu, bukan daftar panjang membingungkan.",
  },
  {
    title: "Catatan Serah-Terima",
    desc: "Kondisi kesehatan, perubahan perilaku, dan hasil pengukuran tercatat rapi antar shift, lengkap foto pendukung.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Buat Room Pasien",
    desc: "Keluarga/admin membuat room khusus untuk satu pasien.",
  },
  {
    n: "02",
    title: "Undang CareTaker",
    desc: "Bagikan kode undangan — caretaker tinggal masukkan kode untuk bergabung.",
  },
  {
    n: "03",
    title: "Susun Jadwal",
    desc: "Atur tugas harian per kategori dan slot waktu.",
  },
  {
    n: "04",
    title: "Pantau Real-time",
    desc: "Lihat siapa sedang bertugas, progres jadwal, dan catatan terbaru.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-700 text-sm font-bold text-white">
              C
            </span>
            <span className="font-display text-lg font-bold text-slate-900">
              Caretaker
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#fitur" className="hover:text-brand-700">
              Fitur
            </a>
            <a href="#cara-kerja" className="hover:text-brand-700">
              Cara Kerja
            </a>
            <a href="#peran" className="hover:text-brand-700">
              Peran
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Daftar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center rounded-sm border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
              Manajemen Perawatan Pasien
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
              Satu room, satu pasien,{" "}
              <span className="text-brand-700">perawatan yang tertata.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-slate-600 md:text-lg">
              Kelola caretaker, jadwal pengobatan, absensi shift, dan catatan
              harian pasien dalam satu tempat — dirancang untuk keluarga dan
              perawat, bukan untuk admin rumah sakit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg">Mulai — Buat Room Pasien</Button>
              </Link>
              <Link href="/join">
                <Button variant="secondary" size="lg">
                  Punya Kode Undangan?
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <MockSchedule />
          </div>
        </div>
      </section>

      {/* Role split */}
      <section id="peran" className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <h2 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">
            Dua peran, satu tujuan
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-md border border-slate-200 bg-white p-6">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                Room Owner / Keluarga
              </span>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li>— Membuat dan mengelola room pasien</li>
                <li>— Mengundang satu atau beberapa caretaker</li>
                <li>— Mengatur jadwal harian pasien</li>
                <li>— Memantau log absensi &amp; catatan harian</li>
              </ul>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-6">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                CareTaker / Perawat
              </span>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li>— Mengakses room pasien tempat ditugaskan</li>
                <li>— Check-in / check-out satu ketuk</li>
                <li>— Menandai tugas selesai atau dilewati</li>
                <li>— Menulis catatan perawatan harian</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
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

      {/* How it works */}
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

      {/* CTA */}
      <section className="bg-brand-700">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              Siap mengatur perawatan dengan lebih tertata?
            </h2>
            <p className="mt-2 text-sm text-brand-100">
              Gratis untuk mulai. Tidak perlu kartu kredit.
            </p>
          </div>
          <Link href="/register">
            <Button variant="secondary" size="lg" className="border-transparent">
              Buat Room Pasien
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} Caretaker.</span>
          <span>Dibangun untuk keluarga &amp; perawat.</span>
        </div>
      </footer>
    </div>
  );
}
