"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

const ranges = [
  { key: "30d", label: "Last 30 Days" },
  { key: "60d", label: "Last 60 Days" },
  { key: "120d", label: "Last 120 Days" },
  { key: "year", label: "This Year" },
] as const;

export default function GrowthRangeSelect({ current }: { current: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = ranges.find((r) => r.key === current) ?? ranges[0];

  function select(key: string) {
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (key === "30d") {
      params.delete("range");
    } else {
      params.set("range", key);
    }
    const qs = params.toString();
    startTransition(() => {
      router.replace(`/admin${qs ? `?${qs}` : ""}`, { scroll: false });
    });
  }

  return (
    <div
      ref={ref}
      className={`relative transition-opacity ${isPending ? "opacity-60" : ""}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 rounded-lg border border-warm-200 bg-white px-3 py-1.5 text-xs font-medium text-warm-700 transition-colors hover:border-warm-300"
      >
        {selected.label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className={`h-3 w-3 text-warm-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-1 min-w-[150px] rounded-lg border border-warm-200 bg-white py-1 shadow-lg"
        >
          {ranges.map((r) => (
            <button
              key={r.key}
              type="button"
              role="option"
              aria-selected={current === r.key}
              onClick={() => select(r.key)}
              className={`block w-full px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                current === r.key
                  ? "bg-warm-100 text-warm-900"
                  : "text-warm-600 hover:bg-warm-100"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
