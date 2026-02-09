"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const tags = [
  { key: "all", label: "All" },
  { key: "love", label: "Love" },
  { key: "health", label: "Health" },
  { key: "magic", label: "Magic" },
] as const;

export default function FeedFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTag = searchParams.get("tag") ?? "all";
  const currentSort = searchParams.get("sort") ?? "newest";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (
        (key === "tag" && value === "all") ||
        (key === "sort" && value === "newest")
      ) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      // Reset to page 1 when changing filters
      params.delete("page");
      router.push(`/dashboard?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-2">
        {tags.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => update("tag", t.key)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              currentTag === t.key
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          update("sort", currentSort === "newest" ? "oldest" : "newest")
        }
        className="flex items-center gap-1 rounded-md bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200"
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
