import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <span className="font-display text-2xl font-black tracking-tighter text-slate-900">
                RUMA<span className="text-blue-600">KET</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
              <span className="font-semibold text-slate-900">
                Ngrumat lan Kraket.
              </span>{" "}
              Satu ruang sederhana untuk keluarga saling bantu merawat orang
              tercinta — dari mana saja.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Jelajahi
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/#roles"
                  className="text-slate-600 transition-colors hover:text-brand-700"
                >
                  Siapa yang Bisa Ikut
                </Link>
              </li>
              <li>
                <Link
                  href="/#feature"
                  className="text-slate-600 transition-colors hover:text-brand-700"
                >
                  Apa Saja Fiturnya
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-slate-600 transition-colors hover:text-brand-700"
                >
                  Cara Mulai
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Keluarga
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/register"
                  className="text-slate-600 transition-colors hover:text-brand-700"
                >
                  Buat Ruang Keluarga
                </Link>
              </li>
              <li>
                <Link
                  href="/join"
                  className="text-slate-600 transition-colors hover:text-brand-700"
                >
                  Masuk dengan Kode Undangan
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-slate-600 transition-colors hover:text-brand-700"
                >
                  Sudah Punya Akun? Masuk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Rumaket.
          </p>

          <div className="flex items-center gap-5 text-xs text-slate-500">
            <Link
              href="/privacy"
              className="transition-colors hover:text-slate-900"
            >
              Privasi
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-slate-900"
            >
              Ketentuan
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-slate-900"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
