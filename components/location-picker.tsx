"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export type LocationValue = { city: string; lat: number; lng: number } | null;

export default function LocationPicker({
  initialCity,
  initialLat,
  initialLng,
  onChange,
}: {
  initialCity?: string;
  initialLat?: number;
  initialLng?: number;
  onChange: (value: LocationValue) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [city, setCity] = useState(initialCity ?? "");
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const hasInitial = initialLat != null && initialLng != null;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: hasInitial ? [initialLng!, initialLat!] : [0, 20],
      zoom: hasInitial ? 8 : 1.2,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    if (hasInitial) {
      markerRef.current = new mapboxgl.Marker({ color: "#9b3aed" })
        .setLngLat([initialLng!, initialLat!])
        .addTo(map);
    }

    map.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      } else {
        markerRef.current = new mapboxgl.Marker({ color: "#9b3aed" })
          .setLngLat([lng, lat])
          .addTo(map);
      }

      setResolving(true);
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place&access_token=${MAPBOX_TOKEN}`,
        );
        const data = await res.json();
        const placeName: string | undefined = data.features?.[0]?.place_name;
        if (placeName) {
          setCity(placeName);
          onChange({ city: placeName, lat, lng });
        } else {
          setCity("Unrecognized location, try clicking nearer a city");
        }
      } catch {
        setCity("Couldn't resolve that location, try again");
      } finally {
        setResolving(false);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClear() {
    setCity("");
    markerRef.current?.remove();
    markerRef.current = null;
    onChange(null);
  }

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-md border border-dashed border-warm-300 bg-warm-50 px-4 text-center text-sm text-warm-400">
        Map unavailable: missing Mapbox configuration.
      </div>
    );
  }

  return (
    <div>
      <div
        ref={containerRef}
        className="h-[280px] w-full overflow-hidden rounded-md border border-warm-300"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-sm text-warm-600">
          {resolving ? "Locating..." : city || "Click the map to drop a pin"}
        </p>
        {city && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 text-xs font-medium text-warm-500 underline hover:text-warm-700"
          >
            Clear location
          </button>
        )}
      </div>
    </div>
  );
}
