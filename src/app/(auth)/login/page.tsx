import Link from "next/link";
import { signIn } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-2xl shadow-slate-900/5 backdrop-blur-sm md:p-10">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-slate-50/30 to-accent-50/20" />
      
      <div className="relative">
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
          Masuk
        </h1>
        <p className="mt-2 text-base leading-relaxed text-slate-600">
          Masuk untuk mengakses room lansia Anda.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100/50 px-4 py-3 shadow-sm">
            <p className="text-sm font-medium text-rose-700">{error}</p>
          </div>
        )}

        <form action={signIn} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Masuk
          </Button>
        </form>

        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-slate-500">atau</span>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link 
            href="/register" 
            className="font-semibold text-brand-700 transition-colors hover:text-brand-800"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
