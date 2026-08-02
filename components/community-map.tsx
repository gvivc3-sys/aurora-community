const locations = [
  // USA — West Coast cluster
  { label: "Los Angeles", x: 16, y: 37.4 },
  { label: "San Diego", x: 16.5, y: 39.1 },
  { label: "Orange County", x: 16.3, y: 38.0 },
  { label: "Santa Barbara", x: 15.5, y: 36.6 },
  { label: "San Francisco", x: 14.5, y: 35.6 },
  { label: "Sacramento", x: 15, y: 34.5 },
  { label: "Seattle", x: 15.5, y: 30.4 },
  { label: "Denver", x: 19, y: 35.0 },
  { label: "Austin", x: 20, y: 40.9 },
  { label: "Chicago", x: 23, y: 32.7 },
  // USA — East Coast cluster
  { label: "New York", x: 26, y: 31.5 },
  { label: "Brooklyn", x: 26.3, y: 32.0 },
  { label: "Boston", x: 27, y: 29.8 },
  { label: "Philadelphia", x: 25.6, y: 32.6 },
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
  // Australia — East Coast cluster
  { label: "Brisbane", x: 86.2, y: 70.1 },
  { label: "Gold Coast", x: 86.4, y: 71.2 },
  { label: "Newcastle", x: 85.4, y: 73.6 },
  { label: "Sydney", x: 85, y: 74.8 },
  { label: "Canberra", x: 82.5, y: 76 },
  { label: "Melbourne", x: 80.5, y: 77 },
  { label: "Byron Bay", x: 85.5, y: 71.8 },
  { label: "Perth", x: 78, y: 73.6 },
  // New Zealand
  { label: "Auckland", x: 93, y: 84.5 },
  { label: "Wellington", x: 95, y: 87 },
  // South America
  { label: "São Paulo", x: 30, y: 66.6 },
  { label: "Rio de Janeiro", x: 30.7, y: 65.4 },
  { label: "Buenos Aires", x: 28, y: 72.4 },
  { label: "Bogotá", x: 27.5, y: 55.5 },
  { label: "Lima", x: 27.5, y: 61.5 },
  // South Africa
  { label: "Cape Town", x: 57, y: 73.6 },
  { label: "Johannesburg", x: 59, y: 66.0 },
  // Bali & Costa Rica
  { label: "Bali", x: 81, y: 58.2 },
  { label: "San José, Costa Rica", x: 20.5, y: 47.9 },
  { label: "Nosara, Costa Rica", x: 20, y: 49.6 },
];

function MapDot({ label, x, y, delay }: { label: string; x: number; y: number; delay: number }) {
  return (
    <span
      className="group absolute z-0 -translate-x-1/2 -translate-y-1/2 hover:z-50"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span
        className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-fuchsia-400 opacity-60"
        style={{ animationDelay: `${delay}ms` }}
      />
      <span className="relative block h-2 w-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_2px_rgba(217,70,239,0.55)]" />
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-warm-900 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-warm-50 opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
}

export default function CommunityMap() {
  return (
    <div className="relative mx-auto aspect-[2.1] w-full max-w-3xl">
      <div className="absolute inset-0 overflow-hidden">
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
      </div>
      {locations.map((loc, i) => (
        <MapDot key={loc.label} {...loc} delay={(i * 173) % 2000} />
      ))}
    </div>
  );
}
