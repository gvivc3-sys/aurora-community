const locations = [
  // USA
  { label: "Los Angeles", x: 16, y: 37.4 },
  { label: "San Francisco", x: 14.5, y: 35.6 },
  { label: "Seattle", x: 15.5, y: 30.4 },
  { label: "Denver", x: 19, y: 35.0 },
  { label: "Austin", x: 20, y: 40.9 },
  { label: "Chicago", x: 23, y: 32.7 },
  { label: "New York", x: 26, y: 31.5 },
  { label: "Miami", x: 25, y: 46.7 },
  // Canada
  { label: "Toronto", x: 24, y: 25.7 },
  { label: "Vancouver", x: 14.5, y: 28.0 },
  { label: "Montreal", x: 25.5, y: 24.5 },
  // Western Europe
  { label: "London", x: 47, y: 23.4 },
  { label: "Dublin", x: 45, y: 22.2 },
  { label: "Paris", x: 48, y: 25.7 },
  { label: "Amsterdam", x: 48.5, y: 23.4 },
  { label: "Berlin", x: 50.5, y: 23.4 },
  { label: "Madrid", x: 46, y: 29.2 },
  { label: "Lisbon", x: 44, y: 29.8 },
  { label: "Rome", x: 50, y: 30.4 },
  // Australia
  { label: "Sydney", x: 85, y: 74.8 },
  { label: "Melbourne", x: 84, y: 77.7 },
  { label: "Byron Bay", x: 85.5, y: 71.8 },
  { label: "Perth", x: 78, y: 73.6 },
  // Bali & Costa Rica
  { label: "Bali", x: 74, y: 57.2 },
  { label: "San José, Costa Rica", x: 20.5, y: 47.9 },
  { label: "Nosara, Costa Rica", x: 20, y: 49.6 },
];

function MapDot({ label, x, y, delay }: { label: string; x: number; y: number; delay: number }) {
  return (
    <span
      className="group absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span
        className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-fuchsia-400 opacity-60"
        style={{ animationDelay: `${delay}ms` }}
      />
      <span className="relative block h-2 w-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_2px_rgba(217,70,239,0.55)]" />
      <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-warm-900 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-warm-50 opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 z-10">
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
      {locations.map((loc, i) => (
        <MapDot key={loc.label} {...loc} delay={(i * 233) % 2000} />
      ))}
    </div>
  );
}
