import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aurora",
    short_name: "Aurora",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f8f8fb",
    theme_color: "#262244",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
