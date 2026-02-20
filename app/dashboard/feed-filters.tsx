"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

const topics = [
  { key: "all", label: "All Topics" },
  { key: "love", label: "Love" },
  { key: "health", label: "Health" },
  { key: "magic", label: "Magic" },
  { key: "ask", label: "Whisper" },
] as const;

const types = [
  { key: "all", label: "All Types" },
  { key: "video", label: "Video" },
  { key: "text", label: "Text" },
  { key: "article", label: "Article" },
  { key: "voice", label: "Voice" },
] as const;

function Dropdown({
  options,
  value,
  onChange,
}: {
  options: readonly { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(-1);
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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
        setFocused(options.findIndex((o) => o.key === value));
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocused((f) => (f + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocused((f) => (f - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (focused >= 0) {
        onChange(options[focused].key);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const selected = options.find((o) => o.key === value) ?? options[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) setFocused(options.findIndex((o) => o.key === value));
        }}
        onKeyDown={handleKeyDown}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 rounded-full border border-warm-200 bg-white px-3 py-1.5 text-xs font-medium text-warm-700 transition-colors hover:border-warm-300"
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
        <div role="listbox" className="absolute left-0 z-50 mt-1 min-w-[140px] rounded-xl border border-warm-200 bg-white py-1 shadow-lg">
          {options.map((o, i) => (
            <button
              key={o.key}
              type="button"
              role="option"
              aria-selected={value === o.key}
              onClick={() => {
                onChange(o.key);
                setOpen(false);
              }}
              className={`block w-full px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                value === o.key
                  ? "bg-warm-100 text-warm-900"
                  : i === focused
                    ? "bg-warm-50 text-warm-800"
                    : "text-warm-600 hover:bg-warm-50"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FeedFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentTag = searchParams.get("tag") ?? "all";
  const currentType = searchParams.get("type") ?? "all";
  const currentSort = searchParams.get("sort") ?? "newest";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (
        (key === "tag" && value === "all") ||
        (key === "type" && value === "all") ||
        (key === "sort" && value === "newest")
      ) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      // Reset to page 1 when changing filters
      params.delete("page");
      const qs = params.toString();
      startTransition(() => {
        router.replace(`/dashboard${qs ? `?${qs}` : ""}`, { scroll: false });
      });
    },
    [router, searchParams, startTransition],
  );

  return (
    <div
      className={`flex items-center gap-3 transition-opacity ${isPending ? "opacity-60" : ""}`}
    >
      <Dropdown
        options={topics}
        value={currentTag}
        onChange={(v) => update("tag", v)}
      />
      <Dropdown
        options={types}
        value={currentType}
        onChange={(v) => update("type", v)}
      />

      <button
        type="button"
        onClick={() =>
          update("sort", currentSort === "newest" ? "oldest" : "newest")
        }
        className="ml-auto flex items-center gap-1 rounded-full bg-warm-100 px-3 py-1.5 text-xs font-medium text-warm-600 transition-colors hover:bg-warm-200"
      >
        {currentSort === "newest" ? "Newest first" : "Oldest first"}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`h-3 w-3 transition-transform ${
            currentSort === "oldest" ? "rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
          />
        </svg>
      </button>
    </div>
  );
}
