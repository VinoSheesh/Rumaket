"use client";

import { useEffect, useState } from "react";
import { Download, CheckCircle2, Share, SquarePlus } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallAppCard() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;
    setIsInstalled(standalone);
    setIsIOS(/iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()));
    setChecked(true);

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    function onAppInstalled() {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  // Avoid a flash of the wrong state during hydration, and hide entirely
  // once the app is already installed/running standalone.
  if (!checked || isInstalled) return null;

  // Browsers without `beforeinstallprompt` support (notably iOS Safari)
  // can't trigger an install programmatically — show manual instructions
  // instead of a dead button.
  if (!deferredPrompt && !isIOS) return null;

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-slate-600" />
            <span>Pasang Aplikasi di Perangkat</span>
          </h2>
          <p className="text-xs text-slate-500">
            Tambahkan Rumaket ke layar utama agar bisa dibuka langsung seperti
            aplikasi, tanpa membuka browser.
          </p>
        </div>
      </div>

      {deferredPrompt ? (
        <button
          type="button"
          onClick={handleInstall}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Pasang Aplikasi Sekarang</span>
        </button>
      ) : (
        <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-600 leading-relaxed">
          <Share className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
          <p>
            Di Safari, ketuk tombol <strong>Bagikan</strong>, lalu pilih{" "}
            <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
              <SquarePlus className="w-3.5 h-3.5" />
              &quot;Tambah ke Layar Utama&quot;
            </span>
            .
          </p>
        </div>
      )}
    </div>
  );
}
