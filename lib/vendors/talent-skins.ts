import type { VendorSkin } from "./types";

function skin(id: string, name: string, accent: string, ink: string, soft: string, bg: string): VendorSkin {
  return {
    id, name, studyOf: `${name}'s publicly documented product model`, bet: "Three company-specific workflows", ethos: "An independent interpretation of the product's organising ideas.",
    href: `/companies/${id}/app`, depth: "Full study",
    theme: { bg, surface: "#FFFFFF", surfaceAlt: bg, border: "#DCE2EA", ink, inkMuted: "#536176", inkFaint: "#667085", accent, accentInk: "#FFFFFF", accentSoft: soft, radius: "10px", radiusSm: "6px", font: 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif', chrome: id === "pageup" ? "topbar" : "sidebar", density: "normal" },
    nav: [], greeting: { eyebrow: "Meridian Optics", title: name, sub: "Fictional scenario" }, home: [], xray: [],
  };
}
export const PAGEUP = skin("pageup", "PageUp", "#315ED3", "#14244B", "#EAF0FF", "#F3F6FC");
export const ELMO = skin("elmo", "ELMO Software", "#0069A5", "#092E48", "#E4F3FC", "#F4F7FA");
export const EMPLOYMENT_HERO = skin("employment-hero", "Employment Hero", "#6131AD", "#281448", "#F0E9FA", "#F7F5FA");
