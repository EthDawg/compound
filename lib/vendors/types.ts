export interface Theme {
  bg: string; surface: string; surfaceAlt: string; border: string;
  ink: string; inkMuted: string; inkFaint: string;
  accent: string; accentInk: string; accentSoft: string;
  radius: string; radiusSm: string;
  font: string; mono?: boolean;
  chrome: "sidebar" | "topbar";
  density: "tight" | "normal" | "roomy";
}

export type Block =
  | { t: "stats"; items: { label: string; value: string; sub?: string; tone?: "good" | "warn" | "bad" }[] }
  | { t: "queue"; title: string; sub?: string; items: { tag: string; title: string; detail: string; meta: string; tone?: "good" | "warn" | "bad" }[] }
  | { t: "worklets"; title: string; items: { label: string; count?: string }[] }
  | { t: "countries"; title: string; sub?: string; items: { code: string; name: string; kind: string; people: number; status: string }[] }
  | { t: "connections"; title: string; sub?: string; items: { provider: string; kind: string; synced: string; stale: boolean; records: string }[] }
  | { t: "runs"; title: string; sub?: string; items: { period: string; entity: string; people: string; status: string; filed: string }[] }
  | { t: "ripple" }
  | { t: "table"; title: string; sub?: string; cols: string[]; rows: string[][] }
  | { t: "callout"; label: string; body: string };

export interface VendorSkin {
  id: string;
  name: string;
  studyOf: string;
  bet: string;
  /** What the interface itself is arguing, which is the point of rendering it at all. */
  ethos: string;
  href: string;
  depth: "Full study" | "Home screen";
  theme: Theme;
  nav: { group?: string; items: { label: string; badge?: string; on?: boolean }[] }[];
  greeting: { eyebrow: string; title: string; sub: string };
  home: Block[];
  xray: { title: string; body: string }[];
}
