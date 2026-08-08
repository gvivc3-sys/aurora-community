"use client";

import { useState, type ReactNode } from "react";
import LockBodyScroll from "@/components/lock-body-scroll";
import StickyMobileButton from "@/components/sticky-mobile-button";

const PlusIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export default function MobileComposerSheet({
  label,
  children,
  fullScreen = false,
}: {
  label: string;
  children: ReactNode;
  fullScreen?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop — inline card */}
      <div className="hidden rounded-xl border border-warm-200 bg-white p-5 shadow-sm sm:p-6 md:block">
        {children}
      </div>

      {/* Mobile — collapsed sticky footer that expands into a bottom sheet (or full-screen) */}
      <div className="md:hidden">
        {!open && (
          <StickyMobileButton label={label} icon={PlusIcon} onClick={() => setOpen(true)} />
        )}

        {open && (
          <>
            <LockBodyScroll />
            {!fullScreen && (
              <div
                className="fixed inset-0 z-40 bg-black/30"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
            )}
            <div
              className={
                fullScreen
                  ? "fixed inset-0 z-50 flex flex-col bg-white"
                  : "fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border border-warm-200 bg-white shadow-xl"
              }
            >
              <div
                className={`sticky top-0 flex shrink-0 items-center justify-between border-b border-warm-100 bg-white px-4 py-3 ${fullScreen ? "" : "rounded-t-2xl"}`}
                style={fullScreen ? { paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" } : undefined}
              >
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
              <div
                className={
                  fullScreen
                    ? "flex-1 overflow-y-auto p-4 pb-[calc(env(safe-area-inset-bottom)+2rem)]"
                    : "p-4 pb-[calc(env(safe-area-inset-bottom)+2rem)]"
                }
              >
                {children}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
