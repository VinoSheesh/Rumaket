"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import Image from "next/image";

function RegisterContent() {
  const searchParams = useSearchParams();
  const joinCode = searchParams.get("join_code");

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
            src="/images/register-banner.jpg"
            fill
            priority
            alt="Room Lansia Brand Asset"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />

        <div className="absolute bottom-10 left-10 right-10 z-10 text-white">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium uppercase tracking-wider">
            Portal Keeratan Keluarga
          </span>
          <h2 className="text-2xl font-bold mt-3">
            Bergabung dan mulai berikan perawatan terbaik
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

          {joinCode && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 text-xs font-medium text-amber-800 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Ada kode undangan menunggu!
            </div>
          )}

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Daftar
            </h1>
            <p className="text-base leading-relaxed text-slate-600">
              {joinCode
                ? "Daftar dahulu, lalu masukkan kode undangan untuk bergabung."
                : "Buat akun untuk mengelola room lansia atau bergabung sebagai caretaker."}
            </p>
          </div>

          <RegisterForm />

          {joinCode && (
            <p className="mt-6 text-center text-sm text-slate-600 bg-amber-50/50 rounded-xl px-4 py-3 border border-amber-100">
              Setelah daftar, masukkan kode{" "}
              <span className="font-mono font-semibold text-blue-600">
                {joinCode}
              </span>{" "}
              di halaman{" "}
              <Link
                href="/dashboard/room/join"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Join Room
              </Link>
              .
            </p>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-500 font-medium">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Masuk
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  );
}
