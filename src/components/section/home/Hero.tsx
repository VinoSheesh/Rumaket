import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-brand-950">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-section.jpg"
          alt="Keluarga merawat orang tercinta bersama"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/95 via-brand-950/80 to-brand-900/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-brand-950/20 to-brand-950/60" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center px-6 py-32 md:min-h-screen md:py-40 lg:px-8">
        {/* ... konten Hero sama seperti sebelumnya ... */}
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col justify-center lg:col-span-7">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-brand-950 bg-brand-800 overflow-hidden shadow-lg"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="Keluarga"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-950 bg-brand-800 text-xs font-bold text-white shadow-lg">
                  +
                </div>
              </div>
              <div className="text-sm font-medium text-brand-100">
                <p className="text-white font-semibold">Sudah bergabung</p>
                <p className="text-brand-200">10,000+ keluarga Indonesia</p>
              </div>
            </div>

            <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Rawat orang tercinta, <br />
              <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
                biar hubungan tetap rekat.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-100/90 md:text-xl">
              Satu ruang sederhana untuk keluarga saling bantu, bagi tugas jaga,
              ingat jadwal obat, dan titip pesan buat yang sedang menemani.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  variant="inverse"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Mulai Ngrumat Bareng
                </Button>
              </Link>
              <Link href="/join">
                <Button
                  variant="inverseOutline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Punya Kode dari Keluarga?
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden items-end justify-end lg:col-span-5 lg:flex">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-brand-900/40 p-8 backdrop-blur-xl shadow-2xl">
              <div className="mb-6 h-1 w-12 rounded-full bg-accent-400"></div>
              <p className="text-base font-medium leading-relaxed text-brand-50">
                Sekarang, semua kabar tentang orang tua bisa dilihat dari satu
                tempat. Nggak perlu tanya-tanya lagi di grup WA.
              </p>
              <div className="mt-8">
                <Link href="/register">
                  <Button variant="warmth" size="md" className="w-full">
                    Coba Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
