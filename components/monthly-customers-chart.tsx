"use client";

import { useState } from "react";

type MonthlyDatum = {
  label: string;
  fullLabel: string;
  count: number;
};

const WIDTH = 600;
const HEIGHT = 220;
const PAD_X = 12;
const PAD_TOP = 20;
const PAD_BOTTOM = 28;

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
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

  const linePath = smoothPath(points);
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x},${PAD_TOP + plotHeight} L ${points[0].x},${PAD_TOP + plotHeight} Z`
      : "";

  return (
    <div className="rounded-xl border border-warm-200 bg-white p-6 shadow-sm">
      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full overflow-visible"
          style={{ height: 220 }}
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
            className="min-w-0 flex-1 text-center font-mono text-[10px] uppercase tracking-wide text-warm-500"
          >
            {d.label}
          </p>
        ))}
      </div>
    </div>
  );
}
