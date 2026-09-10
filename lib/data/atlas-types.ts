import type { LensId, Pos, Archetype } from "./ecosystem";

/**
 * The wider board.
 *
 * The organising claim is that the same handful of archetypes recur in every
 * sector. Legal has its compound platform, its incumbent suites, its connective
 * layer and its AI-native insurgents, and so does security, and so does finance.
 * The archetype is the invariant; the sector is the variable. That is what makes
 * a hundred vendors legible rather than a logo wall.
 *
 * Depth is honest about itself. Vendors carried over from the employment study
 * have hand-read positions. Breadth vendors are placed by archetype plus three
 * declared attributes, which is a coarser instrument and is labelled as one.
 */

export interface Attrs {
  /** 1 tiny → 5 enormous. Reach, not revenue. */
  scale: number;
  /** 1 founded recently → 5 decades old. */
  age: number;
  /** 1 outside the frame → 5 betting the positioning on agents. */
  agentic: number;
}

export interface Vendor {
  slug: string;
  name: string;
  sector: string;
  category: string;
  archetype: Archetype;
  geo: string;
  bet: string;
  attrs: Attrs;
  /** Set when this vendor's position was read individually rather than derived. */
  handRead?: boolean;
  /** Deep essay at /ecosystem/[slug]. */
  deep?: boolean;
  /** A playable design study at this route. */
  instance?: string;
}

export interface Category {
  id: string;
  sector: string;
  name: string;
  blurb: string;
  /** The archetype that currently dominates this category. */
  shape: Archetype;
}

export interface Sector {
  id: string;
  name: string;
  blurb: string;
  /** What this sector is actually a fight about. */
  thesis: string;
  accent: string;
}

// ── Placement ───────────────────────────────────────────────────────────────
// Archetype sets the base position on each lens; attributes move it. Keeping the
// derivation in one readable table is the point — it can be argued with.

const BASE: Record<Archetype, { frag: number; record: number; depend: number; entrench: number; live: number }> = {
  "Compound platform":        { frag: 12, record: 90, depend: 74, entrench: 52, live: 92 },
  "Enterprise suite":         { frag: 18, record: 82, depend: 90, entrench: 86, live: 74 },
  "Payroll rail":             { frag: 44, record: 74, depend: 94, entrench: 94, live: 40 },
  "Global employment":        { frag: 58, record: 60, depend: 66, entrench: 56, live: 62 },
  "Connective layer":         { frag: 90, record: 24, depend: 50, entrench: 34, live: 80 },
  "Point specialist":         { frag: 64, record: 36, depend: 50, entrench: 40, live: 58 },
  "AI-native":                { frag: 78, record: 30, depend: 28, entrench: 16, live: 94 },
  "Regional entrenched":      { frag: 62, record: 40, depend: 84, entrench: 86, live: 16 },
  "Service platform":         { frag: 38, record: 70, depend: 84, entrench: 80, live: 84 },
  "Integrator channel":       { frag: 54, record: 40, depend: 78, entrench: 84, live: 56 },
  "Capital and consolidation":{ frag: 64, record: 22, depend: 66, entrench: 82, live: 34 },
  "Work marketplace":         { frag: 74, record: 34, depend: 40, entrench: 44, live: 66 },
};

const clamp = (n: number) => Math.max(4, Math.min(96, Math.round(n)));

export function derive(v: Vendor): Record<LensId, Pos> {
  const b = BASE[v.archetype];
  const { scale, age, agentic } = v.attrs;
  const weight = 22 + scale * 13;          // node size follows reach
  return {
    // Consolidation ← → fragmentation, against insurgent ← → incumbent
    strategic: {
      x: clamp(b.frag + (age - 3) * 3),
      y: clamp(18 + age * 13 + (scale - 3) * 5),
      r: clamp(weight + (agentic - 3) * 6),
    },
    // Reach against dependency
    installed: {
      x: clamp(6 + scale * 19),
      y: clamp(b.depend + (age - 3) * 4),
      r: clamp(8 + scale * 18),
    },
    // Proximity to the live record against how loudly agents are being bet on
    agentic: {
      x: clamp(b.record + (scale - 3) * 3),
      y: clamp(6 + agentic * 18),
      r: clamp(16 + agentic * 12 + scale * 4),
    },
    // Entrenchment against strategic relevance
    durability: {
      x: clamp(b.entrench + (age - 3) * 6 + (scale - 3) * 4),
      y: clamp(b.live + (agentic - 3) * 4),
      r: clamp(14 + (age + scale) * 8),
    },
  };
}
