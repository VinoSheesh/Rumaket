import Link from "next/link";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Cek Email Anda
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Kami telah mengirimkan tautan konfirmasi ke email Anda. Silakan cek inbox dan klik tautan untuk mengaktifkan akun.
          </p>
          {email && (
            <p className="mt-2 text-sm text-slate-500">
              Email: <span className="font-medium text-slate-800">{email}</span>
            </p>
          )}
        </div>

        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
          >
            Masuk
          </Link>
        </div>

        <div className="mt-4 text-center text-sm text-slate-500">
          <p>
            Tidak menerima email?{" "}
            <Link
              href="/register"
              className="font-medium text-brand-700 hover:text-brand-800"
            >
              Coba lagi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}