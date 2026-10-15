import Link from "next/link";
import { signUp } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { Sparkles } from "lucide-react";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; join_code?: string }>;
}) {
  const { error, join_code } = await searchParams;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-2xl shadow-slate-900/5 backdrop-blur-sm md:p-10">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-accent-50/20 to-warmth-50/30" />
      
      <div className="relative">
        {join_code && (
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-warmth-200 bg-gradient-to-r from-warmth-50 to-accent-50 px-3 py-1.5 text-xs font-medium text-warmth-800 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Ada kode undangan menunggu!
          </div>
        )}

        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
          Daftar
        </h1>
        <p className="mt-2 text-base leading-relaxed text-slate-600">
          {join_code
            ? "Daftar dahulu, lalu masukkan kode undangan untuk bergabung."
            : "Buat akun untuk mengelola room lansia atau bergabung sebagai caretaker."}
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100/50 px-4 py-3 shadow-sm">
            <p className="text-sm font-medium text-rose-700">{error}</p>
          </div>
        )}

        <form action={signUp} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="full_name">Nama Lengkap</Label>
            <Input id="full_name" name="full_name" type="text" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Daftar
          </Button>
        </form>

        {join_code && (
          <p className="mt-6 text-center text-sm text-slate-600 bg-warmth-50/50 rounded-lg px-4 py-2.5 border border-warmth-100">
            Setelah daftar, masukkan kode{" "}
            <span className="font-mono font-semibold text-brand-700">
              {join_code}
            </span>{" "}
            di halaman{" "}
            <Link href="/join" className="font-semibold text-brand-700 hover:text-brand-800">
              Join Room
            </Link>
            .
          </p>
        )}

        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-slate-500">atau</span>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-700 transition-colors hover:text-brand-800"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
