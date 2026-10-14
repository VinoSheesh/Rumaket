import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="bg-brand-700">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-14 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            Siap mengatur perawatan dengan lebih tertata?
          </h2>
          <p className="mt-2 text-sm text-brand-100">
            Gratis untuk mulai. Tidak perlu kartu kredit.
          </p>
        </div>
        <Link href="/register">
          <Button variant="secondary" size="lg" className="border-transparent">
            Buat Room Pasien
          </Button>
        </Link>
      </div>
    </section>
  );
}
