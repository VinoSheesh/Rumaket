import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function CTA() {
  return (
    <section className="relative border-b border-slate-200 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 px-8 py-14 shadow-2xl shadow-brand-900/20 md:px-16 md:py-20">
          
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
          
          <div 
            className="absolute inset-0 opacity-[0.03]" 
            style={{
              backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />

          <div className="relative z-10 grid items-center gap-10 md:grid-cols-12">
            
            <div className="md:col-span-7">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-brand-100 backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-accent-300" />
                Gratis untuk keluarga pertama
              </div>

              <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
                Siap mengatur perawatan <br className="hidden md:block" />
                dengan lebih tertata?
              </h2>
              
              <p className="mt-5 max-w-lg text-base leading-relaxed text-brand-100/80 md:text-lg">
                Mulai dalam hitungan menit. Ajak seluruh anggota keluarga 
                untuk berkolaborasi merawat orang tercinta.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:col-span-5 md:items-end">
              <Link href="/register" className="w-full md:w-auto">
                <Button 
                  variant="inverse" 
                  size="lg" 
                  className="w-full md:w-auto group shadow-lg shadow-black/20"
                >
                  Buat Room Lansia
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Link href="/login" className="w-full md:w-auto">
                <Button 
                  variant="inverseOutline" 
                  size="lg" 
                  className="w-full md:w-auto"
                >
                  Sudah Punya Akun? Masuk
                </Button>
              </Link>

              <p className="mt-2 text-xs text-brand-200/60 md:text-right">
                Tidak perlu ribet. Rawat keluarga dengan senang hati.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}