"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let savedPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    savedPrompt = e as BeforeInstallPromptEvent;
  });
}

/** Permanent "get the app" card — mobile browser only, hidden once installed. */
export default function InstallCard() {
  const [platform, setPlatform] = useState<"none" | "ios" | "android">("none");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isAndroid = /Android/.test(ua);

    if (isIOS) {
      setPlatform("ios");
      return;
    }
    if (isAndroid) {
      setPlatform("android");
      if (savedPrompt) setDeferredPrompt(savedPrompt);

      function handleBeforeInstall(e: Event) {
        e.preventDefault();
        savedPrompt = e as BeforeInstallPromptEvent;
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      }
      window.addEventListener("beforeinstallprompt", handleBeforeInstall);
      return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    }
  }, []);

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    savedPrompt = null;
    setDeferredPrompt(null);
  }

  if (platform === "none") return null;

  return (
    <div className="rounded-xl border border-warm-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/apple-touch-icon.png" alt="" className="h-11 w-11 shrink-0 rounded-lg shadow-sm" />
        <div>
          <p className="text-sm font-medium text-warm-900">Get the Aurora app</p>
          <p className="text-xs text-warm-500">Faster access, right from your home screen.</p>
        </div>
      </div>

      {platform === "ios" ? (
        <ol className="mt-4 space-y-2">
          <li className="flex items-center gap-2.5 text-sm text-warm-700">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-warm-100 text-[11px] font-semibold text-warm-700">1</span>
            Tap the Share button in Safari
          </li>
          <li className="flex items-center gap-2.5 text-sm text-warm-700">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-warm-100 text-[11px] font-semibold text-warm-700">2</span>
            Scroll down and tap &ldquo;Add to Home Screen&rdquo;
          </li>
        </ol>
      ) : deferredPrompt ? (
        <button
          type="button"
          onClick={handleInstallClick}
          className="mt-4 rounded-full bg-warm-800 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-warm-700 active:scale-[0.98]"
        >
          Add to Home Screen
        </button>
      ) : (
        <p className="mt-4 text-xs text-warm-400">
          Open your browser menu and choose &ldquo;Add to Home Screen&rdquo; or &ldquo;Install app&rdquo;.
        </p>
      )}
    </div>
  );
}
