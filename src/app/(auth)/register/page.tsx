import Link from "next/link";
import { signUp } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; join_code?: string }>;
}) {
  const { error, join_code } = await searchParams;

  return (
    <div className="rounded-md border border-slate-200 bg-white p-6">
      <h1 className="font-display text-xl font-bold text-slate-900">Daftar</h1>
      <p className="mt-1 text-sm text-slate-500">
        {join_code
          ? "Daftar dahulu, lalu masukkan kode undangan untuk bergabung."
          : "Buat akun untuk mengelola room lansia atau bergabung sebagai caretaker."}
      </p>

      {error && (
        <p className="mt-4 rounded-sm border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <form action={signUp} className="mt-6 space-y-4">
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
        <Button type="submit" className="w-full">
          Daftar
        </Button>
      </form>

      {join_code && (
        <p className="mt-4 text-center text-xs text-slate-500">
          Setelah daftar, masukkan kode{" "}
          <span className="font-mono font-semibold text-brand-700">
            {join_code}
          </span>{" "}
          di halaman{" "}
          <Link href="/join" className="font-medium text-brand-700">
            Join Room
          </Link>
          .
        </p>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-brand-700">
          Masuk
        </Link>
      </p>
    </div>
  );
}
