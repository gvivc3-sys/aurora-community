"use client";

import { useState } from "react";

type MonthlyDatum = {
  label: string;
  fullLabel: string;
  count: number;
};

export default function MonthlyCustomersChart({
  data,
}: {
  data: MonthlyDatum[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
      <div className="flex items-end justify-between gap-1 sm:gap-2" style={{ height: 160 }}>
        {data.map((d, i) => {
          const heightPct = (d.count / max) * 100;
          const isHovered = hovered === i;
          return (
            <div
              key={d.fullLabel}
              className="relative flex h-full min-w-0 flex-1 flex-col items-center justify-end"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
            >
              {isHovered && (
                <div className="absolute -top-8 z-10 whitespace-nowrap rounded-lg bg-warm-900 px-2 py-1 text-xs text-warm-50 shadow-sm">
                  {d.count} in {d.fullLabel}
                </div>
              )}
              <div
                className="w-full rounded-t-[4px] transition-colors duration-150"
                style={{
                  height: `${Math.max(heightPct, d.count > 0 ? 4 : 0)}%`,
                  minHeight: d.count > 0 ? 4 : 0,
                  backgroundColor: isHovered ? "var(--warm-600)" : "var(--warm-400)",
                }}
                title={`${d.count} in ${d.fullLabel}`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex justify-between gap-1 sm:gap-2">
        {data.map((d) => (
          <p
            key={d.fullLabel}
            className="min-w-0 flex-1 text-center font-mono text-[10px] uppercase tracking-wide text-warm-500"
          >
            {d.label}
          </p>
        ))}
      </div>
    </div>
  );
}
