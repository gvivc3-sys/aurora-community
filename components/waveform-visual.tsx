"use client";

import { useState, useEffect } from "react";

const barHeights = [
  28, 52, 78, 40, 90, 55, 80, 30, 65, 48,
  88, 38, 60, 95, 33, 58, 75, 88, 42, 68,
  82, 50, 33, 72, 92, 60, 40, 80, 55, 75,
  30, 88, 62, 45, 85, 72, 50, 35, 62, 92,
];

export default function WaveformVisual() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= barHeights.length ? 0 : p + 1));
    }, 110);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-1 items-center gap-[2px]" style={{ height: 40 }}>
      {barHeights.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full transition-colors duration-300"
          style={{
            height: `${h}%`,
            backgroundColor:
              i < progress ? "var(--warm-700)" : "var(--warm-300)",
          }}
        />
      ))}
    </div>
  );
}
