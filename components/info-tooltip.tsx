"use client";

import { useEffect, useRef, useState } from "react";

export default function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="About this page"
        aria-expanded={open}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
          open ? "bg-warm-100 text-warm-600" : "text-warm-400 hover:bg-warm-100 hover:text-warm-600"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
          <path
            fillRule="evenodd"
            d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a1 1 0 0 0 0 2h.25v3H9a1 1 0 1 0 0 2h2.5a1 1 0 1 0 0-2h-.25v-4A1 1 0 0 0 10.25 9H9Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 w-64 max-w-[calc(100vw-2.5rem)] rounded-lg border border-warm-200 bg-white p-3 text-xs leading-relaxed text-warm-600 shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
}
