import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aurora",
    short_name: "Aurora",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#faf8f6",
    theme_color: "#2a241b",
    icons: [
      { src: "/icon-192.png?v=2", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
  };
}
