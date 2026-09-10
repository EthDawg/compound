import { ALL_COMPANIES, type Company, type LensId, type Pos, type Archetype } from "./ecosystem";

export type Altitude = "eras" | "ecosystems" | "categories" | "companies";

export const ALTITUDES: { id: Altitude; label: string; sub: string }[] = [
  { id: "eras", label: "Architecture", sub: "Patterns and their footprints" },
  { id: "ecosystems", label: "Ecosystems", sub: "Terrain around the record" },
  { id: "categories", label: "Categories", sub: "Ways of making the bet" },
  { id: "companies", label: "Companies", sub: "Individual positions" },
];

/** One shape the map can render at any altitude. Positions are derived, never duplicated. */
export interface MapNode {
  id: string;
  name: string;
  kind: Exclude<Altitude, "eras">;
  group: string;
  blurb: string;
  lens: Record<LensId, Pos>;
  members?: string[];
  emergent?: boolean;
  href?: string;
  deep?: boolean;
}

export interface Ecosystem {
  id: string;
  name: string;
  blurb: string;
  relation: string;
  members: string[];
  emergent?: boolean;
  /** Hand-placed only for emergent ecosystems, which have no members to average. */
  seed?: Record<LensId, Pos>;
}

export const ECOSYSTEMS: Ecosystem[] = [
  {
    id: "employment",
    name: "Employment platforms",
    blurb: "The core of the map: who owns the employee record and what they build on top of it.",
    relation: "This is the terrain the rest of the study is about.",
    members: ["rippling", "deel", "workday", "adp", "gusto", "hibob", "employment-hero", "personio", "darwinbox",
      "sap-successfactors", "oracle-hcm", "ukg", "dayforce", "paychex", "paycom", "paylocity", "justworks", "trinet"],
  },
  {
    id: "integration",
    name: "Connective tissue",
    blurb: "The layer that exists because the record did not consolidate — and keeps returning under new names.",
    relation: "Its size is an inverse measure of how well consolidation is going.",
    members: ["finch", "merge", "check", "okta"],
  },
  {
    id: "global",
    name: "Cross-border employment",
    blurb: "Entities, compliance and payment rails for employing people where you have no legal presence.",
    relation: "The hardest compliance surface in the category, and the one most likely to stay specialist.",
    members: ["deel", "remote", "velocity-global", "papaya-global", "oyster"],
  },
  {
    id: "service",
    name: "Service and workflow platforms",
    blurb: "Companies entering HR from above — owning the work that happens around the record rather than the record itself.",
    relation: "The most underrated competitive vector. They do not need to win the system of record to take the surface where decisions get made.",
    members: ["servicenow", "atlassian"],
  },
  {
    id: "channel",
    name: "The integrator channel",
    blurb: "The firms that make enterprise software actually land, and often decide which product wins the evaluation.",
    relation: "Invisible on every product map and decisive in a large share of enterprise deals. Also the group most directly exposed to agents.",
    members: ["accenture", "deloitte", "infosys"],
  },
  {
    id: "capital",
    name: "Capital and consolidation",
    blurb: "Where companies on this map go when they stop growing — and who decides the terms.",
    relation: "The exit layer. If you are asking who acquires whom, or what happens to a category after its growth phase, this is the ecosystem that answers it.",
    members: ["vista", "thoma-bravo", "constellation"],
  },
  {
    id: "marketplace",
    name: "Work marketplaces",
    blurb: "Matching work to people outside the employment relationship entirely.",
    relation: "The only group here that questions whether the employee is the right unit rather than fighting over who owns it.",
    members: ["mercor", "upwork"],
  },
  {
    id: "specialists",
    name: "Category specialists",
    blurb: "Depth in one function, sold to the team that lives in it all day.",
    relation: "The standing counter-argument to consolidation, and the source of the one loss the compound platforms cannot dismiss.",
    members: ["greenhouse", "ashby", "lattice", "culture-amp", "checkr", "paradox"],
  },
  {
    id: "regional",
    name: "Regionally entrenched",
    blurb: "Contract-fed, accredited, locally dominant, and invisible to technology discourse.",
    relation: "The control case for the whole map. If your definition of relevance cannot account for these, it is doing less work than you think.",
    members: ["nga-net", "elmo", "technology-one"],
  },
  // ── Likely to emerge ──────────────────────────────────────────────────────
  {
    id: "agent-ops",
    name: "Agent operations",
    blurb: "Governance, audit, attribution and rollback for autonomous systems acting on company records. Barely a category yet.",
    relation:
      "If agents genuinely start changing employment records, someone has to answer who did what, under whose authority, and how it gets reversed. Today that is a feature inside platforms. Categories usually form when a feature becomes a liability somebody wants to buy separately.",
    members: [],
    emergent: true,
    seed: {
      strategic: { x: 62, y: 12, r: 44 },
      installed: { x: 8, y: 30, r: 12 },
      agentic: { x: 54, y: 96, r: 52 },
      durability: { x: 14, y: 74, r: 30 },
    },
  },
  {
    id: "compliance-code",
    name: "Compliance as code",
    blurb: "Jurisdictional rules published and consumed as machine-readable constraint rather than as text a team interprets.",
    relation:
      "Every platform on this map currently re-implements the same employment rules privately, at enormous duplicated cost. That is the shape of a problem that eventually gets solved once, by someone, for everyone.",
    members: [],
    emergent: true,
    seed: {
      strategic: { x: 70, y: 16, r: 38 },
      installed: { x: 10, y: 44, r: 10 },
      agentic: { x: 46, y: 66, r: 34 },
      durability: { x: 18, y: 62, r: 26 },
    },
  },
];

const LENSES_ALL: LensId[] = ["strategic", "installed", "agentic", "durability"];

/** Weighted centroid of a set of companies — so a group's position follows its members. */
function centroid(members: Company[]): Record<LensId, Pos> {
  const out = {} as Record<LensId, Pos>;
  for (const l of LENSES_ALL) {
    const w = members.reduce((s, m) => s + m.lens[l].r, 0) || 1;
    out[l] = {
      x: members.reduce((s, m) => s + m.lens[l].x * m.lens[l].r, 0) / w,
      y: members.reduce((s, m) => s + m.lens[l].y * m.lens[l].r, 0) / w,
      r: Math.min(100, 26 + Math.sqrt(members.reduce((s, m) => s + m.lens[l].r, 0)) * 3.4),
    };
  }
  return out;
}

export function ecosystemNodes(): MapNode[] {
  return ECOSYSTEMS.map((e) => {
    const members = ALL_COMPANIES.filter((c) => e.members.includes(c.slug));
    return {
      id: e.id, name: e.name, kind: "ecosystems" as const, group: e.emergent ? "Likely to emerge" : "Ecosystem",
      blurb: e.blurb, members: e.members, emergent: e.emergent,
      lens: e.seed ?? centroid(members),
    };
  });
}

export function categoryNodes(): MapNode[] {
  const seen = new Map<Archetype, Company[]>();
  ALL_COMPANIES.forEach((c) => seen.set(c.archetype, [...(seen.get(c.archetype) ?? []), c]));
  return [...seen.entries()].map(([arch, members]) => ({
    id: arch, name: arch, kind: "categories" as const, group: arch,
    blurb: `${members.length} companies making this bet: ${members.slice(0, 4).map((m) => m.name).join(", ")}${members.length > 4 ? "…" : ""}`,
    members: members.map((m) => m.slug),
    lens: centroid(members),
  }));
}

export function companyNodes(filter?: { ecosystem?: string; category?: string }): MapNode[] {
  let pool = ALL_COMPANIES;
  if (filter?.ecosystem) {
    const e = ECOSYSTEMS.find((x) => x.id === filter.ecosystem);
    pool = e ? ALL_COMPANIES.filter((c) => e.members.includes(c.slug)) : pool;
  }
  if (filter?.category) pool = pool.filter((c) => c.archetype === filter.category);
  return pool.map((c) => ({
    id: c.slug, name: c.name, kind: "companies" as const, group: c.archetype,
    blurb: c.bet, lens: c.lens, deep: c.deep,
    href: c.deep ? `/ecosystem/${c.slug}` : undefined,
  }));
}

export const ecosystemById = (id: string) => ECOSYSTEMS.find((e) => e.id === id);
