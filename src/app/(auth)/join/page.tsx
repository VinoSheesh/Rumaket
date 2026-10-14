import Link from "next/link";
import { joinRoomByCode } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="rounded-md border border-slate-200 bg-white p-6">
      <h1 className="font-display text-xl font-bold text-slate-900">
        Gabung Room
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Masukkan kode undangan yang diberikan oleh keluarga/admin lansia.
      </p>

      {error && (
        <p className="mt-4 rounded-sm border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <form action={joinRoomByCode} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="code">Kode Undangan</Label>
          <Input
            id="code"
            name="code"
            type="text"
            placeholder="MISALNYA: 7K3PQR"
            className="uppercase tracking-widest"
            maxLength={6}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Gabung
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link href="/register" className="font-medium text-brand-700">
          Daftar dahulu
        </Link>
      </p>
    </div>
  );
}
