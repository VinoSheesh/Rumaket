import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm"; // Sesuaikan path impor ini
import Image from "next/image";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const resolvedParams = await searchParams;
  const error = resolvedParams?.error;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex overflow-hidden">
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/"
            className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/30 transition-all text-white"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        <div className="absolute inset-0">
          <Image
            src="/images/login-banner.jpg"
            alt="Room Lansia Brand Asset"
            fill
            priority
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />

        <div className="absolute bottom-10 left-10 right-10 z-10 text-white">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium uppercase tracking-wider">
            Portal Keeratan Keluarga
          </span>
          <h2 className="text-2xl font-bold mt-3">
            Menghadirkan solusi perawatan untuk mendekatkan
          </h2>
          <p className="text-sm text-slate-200 mt-1">
            Kelola dan pantau aktivitas harian dengan mudah dan aman.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md p-2 md:p-4">
          <div className="lg:hidden mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Masuk
            </h1>
            <p className="text-base leading-relaxed text-slate-600">
              Masuk untuk mengakses room lansia Anda.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100/50 px-4 py-3 shadow-sm">
              <p className="text-sm font-medium text-rose-700">{error}</p>
            </div>
          )}

          <LoginForm />

          <div className="relative mt-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-500 font-medium">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Daftar sekarang
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
