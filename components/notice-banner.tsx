"use client";

import { useState, useEffect } from "react";

type NoticeBg = "default" | "amber" | "rose" | "fuchsia" | "green";

interface Notice {
  id: string;
  body: string;
  bg: NoticeBg;
}

const bgStyles: Record<NoticeBg, { wrapper: string; bar: string }> = {
  default:  { wrapper: "border-warm-200 bg-white",         bar: "bg-warm-100" },
  amber:    { wrapper: "border-amber-200 bg-amber-50",     bar: "bg-amber-100" },
  rose:     { wrapper: "border-rose-200 bg-rose-50",       bar: "bg-rose-100" },
  fuchsia:  { wrapper: "border-fuchsia-200 bg-fuchsia-50", bar: "bg-fuchsia-100" },
  green:    { wrapper: "border-green-200 bg-green-50",     bar: "bg-green-100" },
};

const highlightStyles: Record<NoticeBg, string> = {
  default:  "bg-yellow-200/80 text-yellow-900",
  amber:    "bg-amber-300/60 text-amber-900",
  rose:     "bg-rose-300/60 text-rose-900",
  fuchsia:  "bg-fuchsia-300/60 text-fuchsia-900",
  green:    "bg-green-300/60 text-green-900",
};

/** Parses ==highlighted== syntax into React spans safely (no dangerouslySetInnerHTML) */
function renderBody(body: string, highlightCls: string) {
  return body.split(/(==.+?==)/g).map((chunk, i) => {
    if (chunk.startsWith("==") && chunk.endsWith("==")) {
      return (
        <mark key={i} className={`rounded px-0.5 not-italic ${highlightCls}`}>
          {chunk.slice(2, -2)}
        </mark>
      );
    }
    return <span key={i}>{chunk}</span>;
  });
}

export default function NoticeBanner({ notice }: { notice: Notice }) {
  const storageKey = `aurora-notice-min-${notice.id}`;
  const [minimized, setMinimized] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMinimized(localStorage.getItem(storageKey) === "1");
    setReady(true);
  }, [storageKey]);

  function toggle() {
    const next = !minimized;
    setMinimized(next);
    if (next) {
      localStorage.setItem(storageKey, "1");
    } else {
      localStorage.removeItem(storageKey);
    }
  }

  if (!ready) return null;

  const bg = bgStyles[notice.bg] ?? bgStyles.default;
  const hl = highlightStyles[notice.bg] ?? highlightStyles.default;

  return (
    <div className={`overflow-hidden rounded-2xl border shadow-sm ${bg.wrapper}`}>
      {/* Header bar */}
      <button
        type="button"
        onClick={toggle}
        className={`flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:brightness-95 ${bg.bar}`}
        aria-expanded={!minimized}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-warm-600">
          Notice
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 text-warm-500 transition-transform duration-200 ${minimized ? "rotate-180" : ""}`}
        >
          <path fillRule="evenodd" d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Body */}
      {!minimized && (
        <p className="px-4 py-3 text-sm leading-relaxed text-warm-700">
          {renderBody(notice.body, hl)}
        </p>
      )}
    </div>
  );
}
