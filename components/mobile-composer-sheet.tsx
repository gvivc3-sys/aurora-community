"use client";

import { useState, type ReactNode } from "react";
import LockBodyScroll from "@/components/lock-body-scroll";

export default function MobileComposerSheet({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop — inline card */}
      <div className="hidden rounded-xl border border-warm-200 bg-white p-5 shadow-sm sm:p-6 md:block">
        {children}
      </div>

      {/* Mobile — collapsed sticky footer that expands into a bottom sheet */}
      <div className="md:hidden">
        {!open && (
          <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex w-full max-w-sm items-center justify-center gap-2 rounded-full bg-warm-800 px-6 py-4 text-base font-semibold text-white shadow-xl transition-all hover:bg-warm-700 active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {label}
            </button>
          </div>
        )}

        {open && (
          <>
            <LockBodyScroll />
            <div
              className="fixed inset-0 z-40 bg-black/30"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-50 max-h-[80vh] overflow-y-auto rounded-2xl border border-warm-200 bg-white shadow-xl">
              <div className="sticky top-0 flex items-center justify-between rounded-t-2xl border-b border-warm-100 bg-white px-4 py-3">
                <p className="text-sm font-medium text-warm-900">{label}</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-warm-500 transition-colors hover:bg-warm-50 hover:text-warm-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 pb-6">{children}</div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
