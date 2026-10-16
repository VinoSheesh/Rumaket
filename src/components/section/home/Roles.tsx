import Image from "next/image";
import { Users, HeartHandshake, Home, Shield, Activity } from "lucide-react";

export function Roles() {
  return (
    <section id="roles" className="w-full bg-white text-slate-900 ">
      <div className="w-full border-t ">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200">
          <div className="flex items-center justify-center gap-2 py-6 px-4 text-slate-700 font-semibold text-sm">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Anak & Cucu</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-6 px-4 text-slate-700 font-semibold text-sm">
            <HeartHandshake className="w-5 h-5 text-blue-600" />
            <span>Pasangan</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-6 px-4 text-slate-700 font-semibold text-sm">
            <Home className="w-5 h-5 text-blue-600" />
            <span>Saudara & Kerabat</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-6 px-4 text-slate-700 font-semibold text-sm">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>Caretaker</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <h2 className="text-sm sm:text-base md:text-xl lg:text-3xl font-bold leading-relaxed text-slate-900 tracking-tight">
              <span className="text-blue-900 font-extrabold">Rumaket</span>{" "}
              membantu setiap anggota keluarga ikut merawat orang tua tercinta.
              Semua saling melengkapi dengan perannya masing-masing.
            </h2>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md h-64 md:h-80 overflow-hidden rounded-2xl shadow-lg border border-slate-200">
              <Image
                src="/images/hero-section.jpg"
                alt="Merawat Lansia Bersama"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        <div className="my-12 md:my-16 w-full " />

        <div className="grid gap-8 md:grid-cols-12 items-center">
          <div className="md:col-span-5 flex items-center gap-3">
            <span className="w-3 h-3 bg-blue-950 inline-block" />
            <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Dampak Layanan Kami
            </span>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 gap-8">
            <div className="border-t-2 border-slate-200 pt-4">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-950 tracking-tight">
                10,000+
              </span>
              <p className="mt-2 text-xs sm:text-sm md:text-base font-medium text-slate-600">
                Keluarga Terhubung di Seluruh Indonesia
              </p>
            </div>

            <div className="border-t-2 border-slate-200 pt-4">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-950 tracking-tight">
                98%
              </span>
              <p className="mt-2 text-xs sm:text-sm md:text-base font-medium text-slate-600">
                Keluarga Merasa Lebih Tenang & Terkoordinasi
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
