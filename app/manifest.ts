import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Compound — the founder's view",
    short_name: "Compound",
    description:
      "Three flagship flows on one employee graph: onboard, offboard, and ask. Plus the reasoning underneath.",
    id: "/pocket",
    start_url: "/pocket",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0B0D0E",
    theme_color: "#0B0D0E",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Onboard", short_name: "Onboard", url: "/pocket/onboard", description: "One write, seven systems" },
      { name: "Offboard", short_name: "Offboard", url: "/pocket/offboard", description: "Same-minute revoke" },
      { name: "Ask", short_name: "Ask", url: "/pocket/ask", description: "Ask the graph" },
    ],
  };
}
