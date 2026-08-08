"use client";

import { useState } from "react";

type ChartDatum = {
  label: string;
  fullLabel: string;
  count: number;
  showLabel?: boolean;
};

const WIDTH = 600;
const HEIGHT = 160;
const PAD_TOP = 16;
const PAD_BOTTOM = 20;

function linearPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
}

export default function MonthlyCustomersChart({
  data,
}: {
  data: ChartDatum[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const max = Math.max(1, ...data.map((d) => d.count));
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const points = data.map((d, i) => ({
    x: data.length > 1 ? (i / (data.length - 1)) * WIDTH : WIDTH / 2,
    y: PAD_TOP + (1 - d.count / max) * plotHeight,
  }));

  const linePath = linearPath(points);
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x},${PAD_TOP + plotHeight} L ${points[0].x},${PAD_TOP + plotHeight} Z`
      : "";

  // Dot markers are plain HTML circles positioned by percentage, not SVG
  // <circle> elements — the SVG is stretched non-uniformly (preserveAspectRatio
  // "none") to fill the card width, which would otherwise squash circles into
  // ovals. Only show them when there are few enough points to not overlap.
  const showDots = data.length <= 60;

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
            x1={0}
            y1={PAD_TOP + plotHeight}
            x2={WIDTH}
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
        </svg>

        <div className="absolute inset-0">
          {points.map((p, i) => (
            <div
              key={data[i].fullLabel}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{
                left: `${(p.x / WIDTH) * 100}%`,
                top: `${(p.y / HEIGHT) * 100}%`,
                width: 20,
                height: 20,
                cursor: "pointer",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
            >
              {(showDots || hovered === i) && (
                <span
                  className={`rounded-full border-2 border-warm-600 bg-white transition-all duration-150 ${
                    hovered === i ? "h-[10px] w-[10px]" : "h-[7px] w-[7px]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

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

      <div className="mt-2 flex">
        {data.map((d) => (
          <p
            key={d.fullLabel}
            className="min-w-0 flex-1 text-center text-[10px] text-warm-400"
          >
            {d.showLabel !== false ? d.label : " "}
          </p>
        ))}
      </div>
    </div>
  );
}
