"use client";

import { useState, useEffect, type ReactNode } from "react";

export default function DismissibleNote({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const storageKey = `aurora-dismissed-${id}`;
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDismissed(!!localStorage.getItem(storageKey));
    setReady(true);
  }, [storageKey]);

  function dismiss() {
    localStorage.setItem(storageKey, "1");
    setDismissed(true);
  }

  if (!ready) return null;

  return (
    <div className={`relative ${dismissed ? "hidden md:block" : ""} ${className}`}>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute -right-1 -top-1 rounded-full p-1 text-warm-400 transition-colors hover:bg-warm-100 hover:text-warm-600 md:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
      {children}
    </div>
  );
}
