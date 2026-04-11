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

// ─── Android / Chrome install button (used inside nav menu) ───────────────────
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }
    if (savedPrompt) setDeferredPrompt(savedPrompt);

    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      savedPrompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    savedPrompt = null;
    setDeferredPrompt(null);
  }

  if (isInstalled || !deferredPrompt) return null;

  return (
    <button
      type="button"
      onClick={handleInstallClick}
      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-100"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
        <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
      </svg>
      Add to Home Screen
    </button>
  );
}

// ─── iOS bottom banner (rendered at root layout level) ────────────────────────
const DISMISSED_KEY = "aurora-ios-install-dismissed";

export function IOSInstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on iOS Safari, not already installed, not previously dismissed
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const dismissed = localStorage.getItem(DISMISSED_KEY);

    if (isIOS && !isStandalone && !dismissed) {
      // Small delay so it doesn't flash in instantly on page load
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up px-4 pb-4">
      <div className="mx-auto max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-warm-200">
        {/* Arrow pointing down toward Safari toolbar */}
        <div className="flex justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-warm-200" />
        </div>

        <div className="px-5 pb-5 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* App icon */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/apple-touch-icon.png" alt="" className="h-12 w-12 rounded-xl shadow-sm" />
              <div>
                <p className="text-sm font-semibold text-warm-900">Aurora Community</p>
                <p className="text-xs text-warm-500">Add to your Home Screen</p>
              </div>
            </div>
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warm-100 text-warm-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>

          <ol className="mt-4 space-y-2.5">
            <li className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warm-100 text-xs font-semibold text-warm-700">1</span>
              <span className="text-sm text-warm-700">
                Tap the{" "}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="inline h-4 w-4 align-text-bottom text-blue-500">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                {" "}<strong>Share</strong> button at the bottom of Safari
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warm-100 text-xs font-semibold text-warm-700">2</span>
              <span className="text-sm text-warm-700">Scroll down and tap <strong>Add to Home Screen</strong></span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warm-100 text-xs font-semibold text-warm-700">3</span>
              <span className="text-sm text-warm-700">Tap <strong>Add</strong> in the top right</span>
            </li>
          </ol>
        </div>

        {/* Bottom arrow pointing toward Safari share button */}
        <div className="flex items-center justify-center gap-2 border-t border-warm-100 bg-warm-50 px-5 py-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-warm-400">
            <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-warm-400">Share button is in your Safari toolbar below</p>
        </div>
      </div>
    </div>
  );
}
