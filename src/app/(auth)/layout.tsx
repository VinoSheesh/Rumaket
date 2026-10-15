import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50">
      <main>
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
