"use client";

import { useState } from "react";

type MonthlyDatum = {
  label: string;
  fullLabel: string;
  count: number;
};

const WIDTH = 600;
const HEIGHT = 160;
const PAD_X = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 20;

function linearPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
}

export default function MonthlyCustomersChart({
  data,
}: {
  data: MonthlyDatum[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const max = Math.max(1, ...data.map((d) => d.count));
  const plotWidth = WIDTH - PAD_X * 2;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const points = data.map((d, i) => ({
    x: PAD_X + (data.length > 1 ? (i / (data.length - 1)) * plotWidth : plotWidth / 2),
    y: PAD_TOP + (1 - d.count / max) * plotHeight,
  }));

  const linePath = linearPath(points);
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x},${PAD_TOP + plotHeight} L ${points[0].x},${PAD_TOP + plotHeight} Z`
      : "";

  return (
    <div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full overflow-visible"
          style={{ height: HEIGHT }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--warm-400)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--warm-400)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line
            x1={PAD_X}
            y1={PAD_TOP + plotHeight}
            x2={WIDTH - PAD_X}
            y2={PAD_TOP + plotHeight}
            stroke="var(--warm-200)"
            strokeWidth={1}
          />

          <path d={areaPath} fill="url(#growth-fill)" />
          <path
            d={linePath}
            fill="none"
            stroke="var(--warm-600)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((p, i) => (
            <g key={data[i].fullLabel}>
              <circle
                cx={p.x}
                cy={p.y}
                r={14}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                style={{ cursor: "pointer" }}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={hovered === i ? 5 : 3.5}
                fill="white"
                stroke="var(--warm-600)"
                strokeWidth={2}
                className="transition-all duration-150"
                style={{ pointerEvents: "none" }}
              />
            </g>
          ))}
        </svg>

        {hovered !== null && (
          <div
            className="pointer-events-none absolute -top-1 z-10 whitespace-nowrap rounded-md bg-warm-900 px-2 py-1 text-xs text-warm-50 shadow-sm"
            style={{
              left: `${(points[hovered].x / WIDTH) * 100}%`,
              top: `${(points[hovered].y / HEIGHT) * 100}%`,
              transform: `translate(${hovered === 0 ? "0%" : hovered === data.length - 1 ? "-100%" : "-50%"}, -130%)`,
            }}
          >
            {data[hovered].count} in {data[hovered].fullLabel}
          </div>
        )}
      </div>

      <div className="mt-2 flex justify-between gap-1">
        {data.map((d) => (
          <p
            key={d.fullLabel}
            className="min-w-0 flex-1 text-center text-[10px] text-warm-400"
          >
            {d.label}
          </p>
        ))}
      </div>
    </div>
  );
}
