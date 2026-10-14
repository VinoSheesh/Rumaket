import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MockSchedule } from "@/components/landing/MockSchedule";

export function Hero() {
  return (
    <section className="border-b border-slate-200">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="inline-flex items-center rounded-sm border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
            Manajemen Perawatan Lansia
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
              <Button size="lg">Mulai — Buat Room Lansia</Button>
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
  );
}
