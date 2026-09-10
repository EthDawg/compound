import { ALL_COMPANIES, type LensId, type Pos, type Archetype } from "./ecosystem";
import { SECTORS, CATEGORIES, VENDORS, WORK_CATEGORY, CROSS_SECTOR, categoriesIn } from "./atlas";
import { derive, type Vendor } from "./atlas-types";

export type Level = "sector" | "category" | "vendor";

export interface Node {
  id: string;
  name: string;
  level: Level;
  sector: string;
  category?: string;
  archetype?: Archetype;
  geo?: string;
  blurb: string;
  lens: Record<LensId, Pos>;
  count?: number;
  handRead?: boolean;
  deep?: boolean;
  instance?: string;
  /** Deep essays and playable studies live on these. */
  href?: string;
}

const LENSES: LensId[] = ["strategic", "installed", "agentic", "durability"];

/** Every vendor on the board, hand-read and derived together. */
export const ALL_VENDORS: Node[] = [
  ...ALL_COMPANIES.map((c): Node => {
    const cross = CROSS_SECTOR[c.slug];
    return {
      id: c.slug, name: c.name, level: "vendor",
      sector: cross?.sector ?? "work",
      category: cross?.category ?? WORK_CATEGORY[c.slug] ?? "hr-compound",
      archetype: c.archetype, geo: c.geo, blurb: c.bet,
      lens: c.lens, handRead: true, deep: c.deep,
      instance: c.slug === "rippling" ? "/app"
        : ["workday", "deel", "finch", "adp"].includes(c.slug) ? `/instance/${c.slug}` : undefined,
      href: c.deep ? `/ecosystem/${c.slug}` : undefined,
    };
  }),
  ...VENDORS.map((v: Vendor): Node => ({
    id: v.slug, name: v.name, level: "vendor",
    sector: v.sector, category: v.category, archetype: v.archetype, geo: v.geo,
    blurb: v.bet, lens: derive(v), handRead: false,
  })),
];

/** Weighted centroid — a group sits where its members sit. */
function roll(members: Node[], sizeFloor: number): Record<LensId, Pos> {
  const out = {} as Record<LensId, Pos>;
  for (const l of LENSES) {
    const w = members.reduce((s, m) => s + m.lens[l].r, 0) || 1;
    out[l] = {
      x: members.reduce((s, m) => s + m.lens[l].x * m.lens[l].r, 0) / w,
      y: members.reduce((s, m) => s + m.lens[l].y * m.lens[l].r, 0) / w,
      r: Math.min(100, sizeFloor + Math.sqrt(w) * 2.6),
    };
  }
  return out;
}

export const vendorsInCategory = (cat: string) => ALL_VENDORS.filter((v) => v.category === cat);
export const vendorsInSector = (sec: string) => ALL_VENDORS.filter((v) => v.sector === sec);

export const CATEGORY_NODES: Node[] = CATEGORIES.map((c) => {
  const members = vendorsInCategory(c.id);
  return {
    id: c.id, name: c.name, level: "category" as const, sector: c.sector,
    archetype: c.shape, blurb: c.blurb, count: members.length,
    lens: roll(members, 20),
  };
}).filter((c) => (c.count ?? 0) > 0);

export const SECTOR_NODES: Node[] = SECTORS.map((s) => {
  const members = vendorsInSector(s.id);
  return {
    id: s.id, name: s.name, level: "sector" as const, sector: s.id,
    blurb: s.blurb, count: members.length,
    lens: roll(members, 26),
  };
});

/**
 * Centroids of overlapping groups land on top of each other, which is accurate and
 * unreadable. Push them apart just enough to label, preserving relative order.
 */
function relax(nodes: Node[], minGap = 13): Node[] {
  const out = nodes.map((n) => ({ ...n, lens: { ...n.lens } }));
  for (const l of LENSES) {
    const pts = out.map((n) => ({ n, p: { ...n.lens[l] } }));
    for (let pass = 0; pass < 60; pass++) {
      let moved = false;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i].p, b = pts[j].p;
          let dx = b.x - a.x, dy = b.y - a.y;
          let d = Math.hypot(dx, dy);
          if (d < 0.001) { dx = (i - j) * 0.5 || 0.5; dy = 0.4; d = Math.hypot(dx, dy); }
          if (d < minGap) {
            const push = (minGap - d) / 2 / d;
            a.x -= dx * push; a.y -= dy * push;
            b.x += dx * push; b.y += dy * push;
            moved = true;
          }
        }
      }
      if (!moved) break;
    }
    pts.forEach(({ n, p }) => {
      n.lens[l] = { ...p, x: Math.max(6, Math.min(94, p.x)), y: Math.max(8, Math.min(92, p.y)) };
    });
  }
  return out;
}

const RELAXED_SECTORS = relax(SECTOR_NODES, 21);
const RELAXED_CATEGORIES = relax(CATEGORY_NODES, 14);

export function nodesAt(level: Level, focus?: { sector?: string; category?: string }): Node[] {
  if (level === "sector") return RELAXED_SECTORS;
  if (level === "category") return focus?.sector ? RELAXED_CATEGORIES.filter((c) => c.sector === focus.sector) : RELAXED_CATEGORIES;
  // Derived vendors sharing an archetype and attributes land on the same point.
  // Relax within the current view so every one of them stays selectable.
  if (focus?.category) return relax(vendorsInCategory(focus.category), 11);
  if (focus?.sector) return relax(vendorsInSector(focus.sector), 8);
  return relax(ALL_VENDORS, 5);
}

export const nodeById = (id: string) => [...SECTOR_NODES, ...CATEGORY_NODES, ...ALL_VENDORS].find((n) => n.id === id);

export const BOARD_STATS = {
  sectors: SECTORS.length,
  categories: CATEGORY_NODES.length,
  vendors: ALL_VENDORS.length,
  handRead: ALL_VENDORS.filter((v) => v.handRead).length,
  deep: ALL_VENDORS.filter((v) => v.deep).length,
  instances: ALL_VENDORS.filter((v) => v.instance).length,
};

/** The recurrence claim, made checkable: which archetypes appear in which sectors. */
export function archetypeSpread() {
  const m = new Map<Archetype, Set<string>>();
  ALL_VENDORS.forEach((v) => {
    if (!v.archetype) return;
    m.set(v.archetype, (m.get(v.archetype) ?? new Set()).add(v.sector));
  });
  return [...m.entries()]
    .map(([a, s]) => ({ archetype: a, sectors: [...s], n: s.size }))
    .sort((a, b) => b.n - a.n);
}

export { categoriesIn };
