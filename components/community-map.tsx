import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, Polygon } from "geojson";
import landTopology from "world-atlas/land-110m.json";

const locations = [
  // USA — West Coast cluster
  { label: "Los Angeles", lat: 34.05, lng: -118.24 },
  { label: "San Diego", lat: 32.72, lng: -117.16 },
  { label: "Orange County", lat: 33.68, lng: -117.83 },
  { label: "Santa Barbara", lat: 34.42, lng: -119.7 },
  { label: "San Francisco", lat: 37.77, lng: -122.42 },
  { label: "Sacramento", lat: 38.58, lng: -121.49 },
  { label: "Seattle", lat: 47.61, lng: -122.33 },
  { label: "Denver", lat: 39.74, lng: -104.99 },
  { label: "Austin", lat: 30.27, lng: -97.74 },
  { label: "Chicago", lat: 41.88, lng: -87.63 },
  // USA — East Coast cluster
  { label: "New York", lat: 40.71, lng: -74.01 },
  { label: "Brooklyn", lat: 40.68, lng: -73.94 },
  { label: "Boston", lat: 42.36, lng: -71.06 },
  { label: "Philadelphia", lat: 39.95, lng: -75.17 },
  { label: "Miami", lat: 25.76, lng: -80.19 },
  // Canada
  { label: "Toronto", lat: 43.65, lng: -79.38 },
  { label: "Vancouver", lat: 49.28, lng: -123.12 },
  { label: "Montreal", lat: 45.5, lng: -73.57 },
  // Western Europe
  { label: "London", lat: 51.51, lng: -0.13 },
  { label: "Dublin", lat: 53.35, lng: -6.26 },
  { label: "Paris", lat: 48.86, lng: 2.35 },
  { label: "Amsterdam", lat: 52.37, lng: 4.9 },
  { label: "Berlin", lat: 52.52, lng: 13.4 },
  { label: "Madrid", lat: 40.42, lng: -3.7 },
  { label: "Lisbon", lat: 38.72, lng: -9.14 },
  { label: "Rome", lat: 41.9, lng: 12.5 },
  // Australia — East Coast cluster
  { label: "Brisbane", lat: -27.47, lng: 153.03 },
  { label: "Gold Coast", lat: -28.02, lng: 153.43 },
  { label: "Newcastle", lat: -32.93, lng: 151.78 },
  { label: "Sydney", lat: -33.87, lng: 151.21 },
  { label: "Canberra", lat: -35.28, lng: 149.13 },
  { label: "Melbourne", lat: -37.81, lng: 144.96 },
  { label: "Byron Bay", lat: -28.65, lng: 153.62 },
  { label: "Perth", lat: -31.95, lng: 115.86 },
  // New Zealand
  { label: "Auckland", lat: -36.85, lng: 174.76 },
  { label: "Wellington", lat: -41.29, lng: 174.78 },
  // South America
  { label: "São Paulo", lat: -23.55, lng: -46.63 },
  { label: "Rio de Janeiro", lat: -22.91, lng: -43.17 },
  { label: "Buenos Aires", lat: -34.6, lng: -58.38 },
  { label: "Bogotá", lat: 4.71, lng: -74.07 },
  { label: "Lima", lat: -12.05, lng: -77.04 },
  // South Africa
  { label: "Cape Town", lat: -33.92, lng: 18.42 },
  { label: "Johannesburg", lat: -26.2, lng: 28.05 },
  // Bali & Costa Rica
  { label: "Bali", lat: -8.65, lng: 115.22 },
  { label: "San José, Costa Rica", lat: 9.93, lng: -84.08 },
  { label: "Nosara, Costa Rica", lat: 9.98, lng: -85.65 },
];

const WIDTH = 960;
const HEIGHT = 500;
// Fit the projection to just this latitude band so there's no dead ocean
// space above the Arctic or below Antarctica - every marker sits well
// inside these bounds with room to spare.
const NORTH_CUTOFF_LAT = 65;
const SOUTH_CUTOFF_LAT = -58;

const VISIBLE_BOUNDS: Feature<Polygon> = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-180, SOUTH_CUTOFF_LAT],
        [180, SOUTH_CUTOFF_LAT],
        [180, NORTH_CUTOFF_LAT],
        [-180, NORTH_CUTOFF_LAT],
        [-180, SOUTH_CUTOFF_LAT],
      ],
    ],
  },
};

function MapDot({ label, x, y, delay }: { label: string; x: number; y: number; delay: number }) {
  return (
    <span
      className="group absolute z-0 -translate-x-1/2 -translate-y-1/2 hover:z-50"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span
        className="absolute inset-0 h-1.5 w-1.5 animate-ping rounded-full bg-fuchsia-400 opacity-60"
        style={{ animationDelay: `${delay}ms` }}
      />
      <span className="relative block h-1.5 w-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_5px_1.5px_rgba(217,70,239,0.55)]" />
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-warm-900 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-warm-50 opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
}

export default function CommunityMap() {
  const topology = landTopology as unknown as Topology;
  const land = feature(topology, topology.objects.land as GeometryCollection);

  // Fit to the visible latitude band directly (not the full globe) so the
  // canvas has no dead ocean margin above the Arctic or below Antarctica.
  const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], VISIBLE_BOUNDS);
  const pathGenerator = geoPath(projection);
  const landPath = pathGenerator(land) ?? "";

  const markers = locations
    .map((loc) => {
      const point = projection([loc.lng, loc.lat]);
      return point ? { label: loc.label, x: point[0], y: point[1] } : null;
    })
    .filter((m): m is { label: string; x: number; y: number } => m !== null);

  return (
    <div className="relative mx-auto w-full">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-auto w-full overflow-visible">
        <path d={landPath} className="fill-warm-300/70" />
      </svg>
      <div className="absolute inset-0">
        {markers.map((m, i) => (
          <MapDot
            key={m.label}
            label={m.label}
            x={(m.x / WIDTH) * 100}
            y={(m.y / HEIGHT) * 100}
            delay={(i * 173) % 2000}
          />
        ))}
      </div>
    </div>
  );
}
