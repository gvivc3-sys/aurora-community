const locations = [
  { label: "West Coast, USA", x: 16, y: 37.4 },
  { label: "East Coast, USA", x: 26, y: 31.5 },
  { label: "Canada", x: 24, y: 25.7 },
  { label: "United Kingdom", x: 47, y: 23.4 },
  { label: "Western Europe", x: 50, y: 25.7 },
  { label: "Costa Rica", x: 20.5, y: 47.9 },
  { label: "Bali", x: 74, y: 57.2 },
  { label: "Australia", x: 85, y: 74.8 },
];

function MapDot({ label, x, y }: { label: string; x: number; y: number }) {
  return (
    <span
      className="group absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span className="absolute inset-0 h-2.5 w-2.5 animate-ping rounded-full bg-fuchsia-400 opacity-60" />
      <span className="relative block h-2.5 w-2.5 rounded-full bg-fuchsia-500 shadow-[0_0_10px_2px_rgba(217,70,239,0.55)]" />
      <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-warm-900 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-warm-50 opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
}

export default function CommunityMap() {
  return (
    <div className="relative mx-auto aspect-[2.1] w-full max-w-3xl overflow-hidden">
      <div
        className="absolute inset-0 bg-warm-300/70"
        style={{
          WebkitMaskImage: "url(/images/world-map.svg)",
          maskImage: "url(/images/world-map.svg)",
          WebkitMaskSize: "100% auto",
          maskSize: "100% auto",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "top",
          maskPosition: "top",
        }}
      />
      {locations.map((loc) => (
        <MapDot key={loc.label} {...loc} />
      ))}
    </div>
  );
}
