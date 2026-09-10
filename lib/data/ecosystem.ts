// A map of the HR-tech ecosystem, drawn four different ways.
//
// Every position here is an editorial judgement, not a measurement. The scores
// exist to make an argument legible and arguable — not to rank anyone. Figures
// referenced in the prose are public and approximate as of late 2026.

export type LensId = "strategic" | "installed" | "agentic" | "durability";

export interface Lens {
  id: LensId;
  pill: string;
  question: string;
  blurb: string;
  x: { label: string; low: string; high: string };
  y: { label: string; low: string; high: string };
  quadrants: { at: "tl" | "tr" | "bl" | "br"; label: string; tone: "signal" | "moss" | "clay" | "ink" }[];
}

export const LENSES: Lens[] = [
  {
    id: "strategic",
    pill: "Strategic bet",
    question: "Relevant to the argument about where this category is going?",
    blurb:
      "The axis nobody agrees on: does the employee record consolidate into one system, or stay scattered across thousands and get connected by a layer above? Almost every company here is a wager on one answer. They cannot both be right at scale.",
    x: { label: "What they bet the record does", low: "Consolidates into one system", high: "Stays fragmented forever" },
    y: { label: "Position", low: "Insurgent", high: "Incumbent" },
    quadrants: [
      { at: "bl", label: "Consolidation insurgents", tone: "signal" },
      { at: "tl", label: "Consolidation incumbents", tone: "ink" },
      { at: "br", label: "Fragmentation insurgents", tone: "moss" },
      { at: "tr", label: "Fragmentation incumbents", tone: "clay" },
    ],
  },
  {
    id: "installed",
    pill: "Installed reality",
    question: "Relevant to the number of people whose pay actually depends on it?",
    blurb:
      "The corrective. Discourse relevance and payroll relevance are different quantities, and the gap between them is enormous. Several companies that dominate the conversation administer a rounding error of the workforce. Several that nobody writes about pay one in six Americans.",
    x: { label: "Reach", low: "Narrow", high: "Enormous" },
    y: { label: "Dependency", low: "Swappable in a quarter", high: "Load-bearing; ripping it out is a project" },
    quadrants: [
      { at: "tr", label: "Infrastructure of employment", tone: "ink" },
      { at: "tl", label: "Deep but narrow", tone: "moss" },
      { at: "br", label: "Broad but shallow", tone: "clay" },
      { at: "bl", label: "Not yet material", tone: "signal" },
    ],
  },
  {
    id: "agentic",
    pill: "Agentic readiness",
    question: "Relevant to whether an agent can safely change something?",
    blurb:
      "Everyone in this map shipped AI agents in 2026. The word means completely different things depending on whether the company owns a live, permission-aware record or reads a stored copy of one. This lens separates the claim from the architecture underneath it.",
    x: { label: "Proximity to the live record", low: "Reads a copy, or calls someone else's API", high: "Owns the record it acts on" },
    y: { label: "How loudly they are betting on agents", low: "Quiet", high: "Betting the positioning on it" },
    quadrants: [
      { at: "tr", label: "Can actually act", tone: "moss" },
      { at: "tl", label: "Claiming past the architecture", tone: "clay" },
      { at: "br", label: "Could act, isn't saying so", tone: "ink" },
      { at: "bl", label: "Outside the frame", tone: "signal" },
    ],
  },
  {
    id: "durability",
    pill: "Durability",
    question: "Relevant to whoever has to keep using it on Monday?",
    blurb:
      "The lens that dissolves the premise of the other three. Entrenchment is not quality and it is not strategy — it is contracts, regulation, migration cost and institutional inertia. It is also the single best predictor of whether something still exists in ten years.",
    x: { label: "Entrenchment", low: "Displaceable", high: "Effectively locked in" },
    y: { label: "Strategic relevance", low: "Nobody writes about it", high: "Central to the argument" },
    quadrants: [
      { at: "br", label: "Load-bearing and ignored", tone: "clay" },
      { at: "tr", label: "Entrenched and live", tone: "ink" },
      { at: "tl", label: "Live but structurally fragile", tone: "signal" },
      { at: "bl", label: "Exposed", tone: "moss" },
    ],
  },
];

export type Archetype =
  | "Compound platform"
  | "Enterprise suite"
  | "Payroll rail"
  | "Global employment"
  | "Connective layer"
  | "Point specialist"
  | "AI-native"
  | "Regional entrenched";

export interface Pos { x: number; y: number; r: number }

export interface Company {
  slug: string;
  name: string;
  archetype: Archetype;
  geo: string;
  bet: string;
  lens: Record<LensId, Pos>;
  note: Partial<Record<LensId, string>>;
  deep?: boolean;
}

const C = (
  slug: string, name: string, archetype: Archetype, geo: string, bet: string,
  s: [number, number, number], i: [number, number, number],
  a: [number, number, number], d: [number, number, number],
  note: Partial<Record<LensId, string>> = {}, deep = false
): Company => ({
  slug, name, archetype, geo, bet, deep, note,
  lens: {
    strategic: { x: s[0], y: s[1], r: s[2] },
    installed: { x: i[0], y: i[1], r: i[2] },
    agentic: { x: a[0], y: a[1], r: a[2] },
    durability: { x: d[0], y: d[1], r: d[2] },
  },
});

export const COMPANIES: Company[] = [
  // ── Compound platforms ────────────────────────────────────────────────────
  C("rippling", "Rippling", "Compound platform", "US · global",
    "One employee record; compound outward across HR, IT and Finance until nothing is entered twice.",
    [8, 22, 95], [34, 74, 42], [93, 96, 95], [52, 97, 90],
    {
      strategic: "The purest consolidation wager in the category, and the one everything else gets measured against.",
      installed: "Roughly a billion in ARR and real mid-market density — but a fraction of ADP's footprint. Discourse share far exceeds payroll share.",
      agentic: "Owns the record its agents act on. That is the whole differentiation, and it is architectural rather than model-driven.",
      durability: "Switching cost rises with every module adopted — which is the compounding thesis restated as a moat.",
    }, true),

  C("deel", "Deel", "Compound platform", "US · 150+ countries",
    "Own the cross-border employment relationship first, then compound inward toward the full record.",
    [17, 26, 88], [40, 71, 44], [66, 92, 76], [58, 90, 80],
    {
      strategic: "Same destination as Rippling, opposite entry point: compliance and borders first, core HR second.",
      installed: "Enormous country coverage, thinner per-customer depth in any single domestic market.",
      agentic: "Shipped an agent layer in 2026. Strongest where it owns the employment relationship, weaker where it reads someone else's HRIS.",
      durability: "Entity and compliance infrastructure is genuinely hard to rebuild — that is the durable part, not the HRIS.",
    }, true),

  C("employment-hero", "Employment Hero", "Compound platform", "Australia · NZ · UK · SEA",
    "Run the compound playbook in markets the US platforms treat as an afterthought, with payroll as the wedge.",
    [14, 30, 62], [28, 72, 30], [58, 72, 48], [62, 74, 56],
    {
      strategic: "Proof the compound bet is a structure rather than a Silicon Valley accident — same logic, different continent.",
      installed: "Dominant where it is dominant. In ANZ SME it is closer to infrastructure than to a challenger.",
      agentic: "Owns record and payroll in its markets, which is the precondition. Less exposed to the global agent arms race.",
      durability: "Local payroll compliance depth is a real moat and a real ceiling at the same time.",
    }, true),

  C("gusto", "Gusto", "Compound platform", "US",
    "Own the small-business relationship and refuse most of the expansion the compound logic invites.",
    [22, 34, 58], [46, 62, 34], [55, 48, 40], [50, 62, 46],
    {
      strategic: "The disciplined counter-case: expands, but visibly declines to become an everything-platform.",
      installed: "Very broad in US SMB. Small businesses churn, which caps dependency even at scale.",
      agentic: "Owns payroll truth for its segment. Notably quieter on agents than its peers, which may be judgement rather than lag.",
    }),

  C("hibob", "HiBob", "Compound platform", "UK · US · Israel",
    "Win the mid-market HRIS on experience and culture, then extend into payroll adjacency.",
    [26, 33, 46], [24, 58, 24], [50, 55, 32], [40, 55, 34], {}),

  C("justworks", "Justworks", "Compound platform", "US",
    "Absorb the employer-of-record burden for small companies through the PEO model.",
    [30, 40, 36], [22, 70, 22], [38, 34, 24], [58, 44, 30], {}),

  C("trinet", "TriNet", "Compound platform", "US",
    "PEO at scale: co-employment as the product, compliance as the moat.",
    [34, 62, 40], [34, 78, 30], [34, 30, 24], [70, 40, 36], {}),

  // ── Enterprise suites ─────────────────────────────────────────────────────
  C("workday", "Workday", "Enterprise suite", "US · global",
    "Own the enterprise system of record and defend it from above as agents arrive.",
    [12, 88, 92], [72, 94, 78], [86, 94, 88], [88, 92, 92],
    {
      strategic: "The incumbent that consolidated first, at a size the insurgents cannot yet reach.",
      installed: "The default at large-enterprise scale. Implementations are measured in quarters and hundreds of thousands of dollars.",
      agentic: "Shipped a large agent wave in 2026 alongside a data-cloud and lake-style architecture. Owns the record; the open question is whether the surrounding data layer stays permission-correct.",
      durability: "Displacing Workday is a multi-year board-level programme. That is the moat, and it is enormous.",
    }, true),

  C("sap-successfactors", "SAP SuccessFactors", "Enterprise suite", "Global",
    "Keep HCM inside the ERP gravity well.",
    [16, 92, 66], [76, 90, 62], [46, 62, 44], [92, 58, 62], {}),

  C("oracle-hcm", "Oracle HCM", "Enterprise suite", "Global",
    "Same ERP gravity, different vendor.",
    [18, 90, 58], [70, 88, 56], [48, 60, 40], [90, 52, 56], {}),

  C("ukg", "UKG", "Enterprise suite", "US · global",
    "Own the hourly and frontline workforce, where time and scheduling are the real system of record.",
    [24, 78, 54], [78, 86, 60], [52, 58, 42], [82, 54, 54], {}),

  C("dayforce", "Dayforce", "Enterprise suite", "US · Canada",
    "One continuous calculation from time to pay for large complex employers.",
    [22, 76, 46], [66, 84, 48], [50, 52, 36], [78, 48, 44], {}),

  // ── Payroll rails ─────────────────────────────────────────────────────────
  C("adp", "ADP", "Payroll rail", "US · global",
    "Be the rail. Whatever wins above it still settles through here.",
    [44, 96, 32], [98, 96, 100], [76, 26, 56], [96, 66, 96],
    {
      strategic: "Rarely discussed as a strategic actor, which is itself the interesting fact. It is closer to infrastructure than to software.",
      installed: "Pays a share of the US workforce no venture-backed company approaches. On this lens it is the map.",
      agentic: "Sits on more employment truth than anyone and is the quietest company here about agents. Read that as position, not absence.",
      durability: "Regulatory depth, filing relationships and switching cost compound into something close to permanence.",
    }, true),

  C("paychex", "Paychex", "Payroll rail", "US",
    "The same rail, one segment down.",
    [46, 90, 52], [84, 88, 66], [56, 30, 40], [88, 44, 60], {}),

  C("paycom", "Paycom", "Payroll rail", "US",
    "Single database, employee-driven payroll for the mid-market.",
    [28, 74, 44], [64, 82, 48], [58, 52, 36], [74, 48, 44], {}),

  C("paylocity", "Paylocity", "Payroll rail", "US",
    "Mid-market payroll plus an engagement layer on top.",
    [30, 72, 42], [62, 78, 46], [54, 50, 34], [70, 46, 42], {}),

  // ── Global employment ─────────────────────────────────────────────────────
  C("remote", "Remote", "Global employment", "Global",
    "Be the global-payroll infrastructure inside the platforms you would otherwise compete with.",
    [72, 34, 60], [44, 66, 34], [40, 44, 38], [56, 80, 52],
    {
      strategic: "The most underrated position on the board: powering competitors' global payroll rather than fighting them for the front end.",
      installed: "Reach is partly borrowed — it arrives through the platforms that embed it, which is the point.",
      agentic: "Infrastructure rarely needs an agent story. It needs to be the thing other agents call.",
      durability: "Embedded inside a partner's product is stickier than being a tab in a buyer's stack.",
    }, true),

  C("velocity-global", "Velocity Global", "Global employment", "Global",
    "EOR and global entity coverage as a managed service.",
    [56, 46, 34], [26, 64, 22], [30, 32, 20], [50, 44, 26], {}),

  C("papaya-global", "Papaya Global", "Global employment", "Global",
    "Global payroll plus the payments rail underneath it.",
    [58, 40, 34], [28, 62, 22], [38, 46, 24], [46, 46, 26], {}),

  C("oyster", "Oyster", "Global employment", "Global",
    "Distributed hiring for companies without entities.",
    [54, 34, 28], [20, 58, 18], [30, 36, 18], [38, 38, 22], {}),

  // ── Connective layer — the bet against consolidation ──────────────────────
  C("finch", "Finch", "Connective layer", "US",
    "The record never consolidates. Sell the connective tissue across the ~6,000 systems that will always exist.",
    [94, 28, 74], [30, 52, 30], [22, 84, 66], [34, 92, 62],
    {
      strategic: "The precise antithesis of Rippling. If Finch is right about fragmentation, the compound thesis has a ceiling.",
      installed: "Reach is indirect — it arrives through the fintech and benefits products built on top of it.",
      agentic: "Shipped an MCP server so agents can reach employment data. It serves a stored copy synced daily, or weekly for assisted connections. That is the exact architecture the consolidation camp says makes agents unsafe.",
      durability: "Depends on fragmentation persisting. Every consolidation win is a small subtraction from the premise.",
    }, true),

  C("merge", "Merge", "Connective layer", "US",
    "Same fragmentation bet, wider than HR — one API across many categories.",
    [90, 30, 52], [26, 46, 24], [26, 70, 40], [30, 74, 40], {}),

  C("check", "Check", "Connective layer", "US",
    "Payroll as infrastructure other software builds on rather than a product it sells.",
    [78, 24, 48], [22, 60, 22], [44, 40, 28], [40, 66, 32], {}),

  // ── Point specialists ─────────────────────────────────────────────────────
  C("greenhouse", "Greenhouse", "Point specialist", "US",
    "Depth in hiring beats breadth around it.",
    [62, 56, 44], [34, 56, 26], [34, 60, 30], [44, 50, 30], {}),

  C("ashby", "Ashby", "Point specialist", "US",
    "Recruiting with real analytics for companies that live in the tool all day.",
    [66, 26, 34], [16, 54, 16], [36, 62, 24], [26, 54, 22], {}),

  C("lattice", "Lattice", "Point specialist", "US",
    "Own performance and development as a discipline, not a module.",
    [64, 40, 38], [26, 44, 20], [32, 66, 26], [30, 44, 24], {}),

  C("culture-amp", "Culture Amp", "Point specialist", "Australia · US",
    "Employee feedback as its own category with its own science.",
    [66, 44, 34], [28, 42, 20], [28, 58, 22], [32, 42, 22], {}),

  C("checkr", "Checkr", "Point specialist", "US",
    "Background screening as regulated infrastructure.",
    [70, 48, 34], [42, 62, 26], [40, 44, 22], [58, 40, 28], {}),

  // ── AI-native ─────────────────────────────────────────────────────────────
  C("mercor", "Mercor", "AI-native", "US",
    "The unit of work changes before the record does. Match people to tasks, not roles to headcount.",
    [82, 8, 66], [14, 26, 16], [30, 98, 58], [16, 88, 52],
    {
      strategic: "The only wager here that questions the primitive itself. If work becomes task-shaped, 'the employee record' is the wrong atom to fight over.",
      installed: "Materially small today. Included because the bet is large, not because the footprint is.",
      agentic: "Native to the frame — but it is not acting on an employer's system of record, which is a different and easier problem.",
      durability: "Almost none yet. That is what an early insurgent looks like, and most of them do not make it.",
    }, true),

  C("paradox", "Paradox", "AI-native", "US",
    "Conversational hiring for high-volume frontline recruiting.",
    [72, 30, 36], [38, 44, 22], [36, 82, 30], [30, 50, 24], {}),

  // ── Regional entrenched — the relevance paradox ───────────────────────────
  C("nga-net", "nga.net", "Regional entrenched", "Australia",
    "Win and hold public-sector recruitment contracts. Strategy is procurement, not product.",
    [74, 70, 26], [12, 92, 20], [14, 8, 14], [88, 8, 78],
    {
      strategic: "Close to zero by the standards of this map — and that is a statement about the map, not about the company.",
      installed: "Narrow reach, extreme dependency. For the agencies running on it, it is not a vendor, it is the process.",
      agentic: "Structurally outside the conversation. Nothing about a government procurement cycle rewards moving quickly here.",
      durability: "Near the top of the board, and by far the highest relative to its strategic score. Multi-year contracts, accreditation and public-sector migration risk beat product quality every time.",
    }, true),

  C("elmo", "ELMO Software", "Regional entrenched", "Australia · NZ",
    "A broad ANZ HR suite sold on local compliance and local support.",
    [46, 62, 30], [20, 74, 20], [26, 34, 18], [72, 22, 34], {}),

  C("technology-one", "TechnologyOne", "Regional entrenched", "Australia",
    "ERP and HR for councils, universities and government, on very long cycles.",
    [40, 78, 34], [22, 94, 24], [22, 24, 18], [94, 16, 48], {}),
];

export interface Edge { from: string; to: string; kind: "competes" | "powers" | "antithesis" | "absorbs" | "depends"; note: string }

export const EDGES: Edge[] = [
  { from: "rippling", to: "deel", kind: "competes", note: "Same destination, opposite entry point — and open litigation between them." },
  { from: "rippling", to: "workday", kind: "competes", note: "Rippling pushing up from mid-market; Workday defending from enterprise." },
  { from: "rippling", to: "finch", kind: "antithesis", note: "Consolidation versus fragmentation. Both cannot be right at scale." },
  { from: "rippling", to: "gusto", kind: "competes", note: "Overlapping SMB and lower mid-market, opposite expansion discipline." },
  { from: "rippling", to: "adp", kind: "competes", note: "Rippling wants the relationship; ADP already has the rail." },
  { from: "deel", to: "remote", kind: "competes", note: "The two poles of global employment: own the front end, or be the infrastructure." },
  { from: "remote", to: "workday", kind: "powers", note: "Remote's infrastructure sits inside global payroll for platforms it might otherwise fight." },
  { from: "finch", to: "adp", kind: "depends", note: "Finch's value depends on ADP and its peers staying separate systems." },
  { from: "finch", to: "merge", kind: "competes", note: "Depth in payroll versus breadth across categories." },
  { from: "check", to: "finch", kind: "competes", note: "Two different answers to 'payroll should be infrastructure'." },
  { from: "workday", to: "sap-successfactors", kind: "competes", note: "The enterprise suite war that predates all of this." },
  { from: "mercor", to: "rippling", kind: "antithesis", note: "One fights over the employee record; the other doubts the employee is the unit." },
  { from: "employment-hero", to: "elmo", kind: "competes", note: "The compound challenger against the incumbent ANZ suite." },
  { from: "employment-hero", to: "rippling", kind: "competes", note: "Same playbook, different continent — and largely non-overlapping customers." },
  { from: "nga-net", to: "technology-one", kind: "competes", note: "Public-sector procurement, where the buyer is a tender document." },
  { from: "greenhouse", to: "rippling", kind: "competes", note: "The depth-versus-seams trade, fought one category at a time." },
  { from: "adp", to: "paychex", kind: "competes", note: "The rail, split by segment." },
];

export const byArchetype = (a: Archetype) => COMPANIES.filter((c) => c.archetype === a);
export const companyBySlug = (s: string) => COMPANIES.find((c) => c.slug === s);

/** How much a company's standing moves depending on which lens you use. */
export function volatility(c: Company) {
  const ranks = (["strategic", "installed", "agentic", "durability"] as LensId[]).map((l) => {
    const sorted = [...COMPANIES].sort((a, b) => b.lens[l].r - a.lens[l].r);
    return sorted.findIndex((x) => x.slug === c.slug) + 1;
  });
  return { ranks, spread: Math.max(...ranks) - Math.min(...ranks) };
}
