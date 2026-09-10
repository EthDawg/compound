export type Actor = "agent" | "human";

export interface CascadeStep {
  sys: string;
  icon: string;
  detail: string;
  atMs: number;
  actor: Actor;
  reversible: "yes" | "costly" | "no";
}

export interface Variant {
  id: string;
  label: string;
  sub: string;
  steps: CascadeStep[];
  legacy: { days: string; people: string; systems: string };
  note: string;
}

// ── Flow 1 · Onboard ─────────────────────────────────────────────────────────
export const ONBOARD: Variant[] = [
  {
    id: "de",
    label: "Berlin",
    sub: "Own entity · GmbH · Senior engineer",
    legacy: { days: "9–14 days", people: "5 people", systems: "7 systems" },
    note: "Germany is the hard one. Statutory notice is computed from tenure, the contract must be in German and countersigned, and social insurance registration gates the start date. None of that is a conditional inside a product — it is configuration in the country layer.",
    steps: [
      { sys: "Employment record", icon: "people", detail: "Created in Meridian Optics GmbH, effective 1 Oct", atMs: 250, actor: "agent", reversible: "yes" },
      { sys: "Contract", icon: "book", detail: "Arbeitsvertrag generated in German, routed for countersignature", atMs: 1350, actor: "agent", reversible: "yes" },
      { sys: "Payroll", icon: "payroll", detail: "DE Monthly, cost center ENG-DE, Sozialversicherung registered", atMs: 2550, actor: "agent", reversible: "yes" },
      { sys: "Benefits", icon: "benefits", detail: "Statutory plus supplemental, election window opens on start", atMs: 3450, actor: "agent", reversible: "yes" },
      { sys: "Device", icon: "device", detail: "MacBook Pro 16\" shipped to Berlin, pre-enrolled in MDM", atMs: 4550, actor: "agent", reversible: "yes" },
      { sys: "App access", icon: "apps", detail: "10 entitlements from baseline + Engineering bundle, staged to 00:00 on day one", atMs: 6100, actor: "agent", reversible: "yes" },
      { sys: "Spend", icon: "card", detail: "Virtual card issued, €5,000 limit derived from level", atMs: 7050, actor: "agent", reversible: "yes" },
      { sys: "Compliance", icon: "shield", detail: "Works council notification, DE-specific training assigned", atMs: 8200, actor: "agent", reversible: "yes" },
    ],
  },
  {
    id: "in",
    label: "Bengaluru",
    sub: "EOR · No entity · Senior engineer",
    legacy: { days: "3–6 weeks", people: "6 people", systems: "8 systems" },
    note: "No entity in India, so the employment relationship sits with an EOR partner. The interesting part is what does not change: the record, the permissions, the approval chains and every downstream product behave identically. Worker type is a capability on the record, not a fork in the product.",
    steps: [
      { sys: "Employment record", icon: "people", detail: "Created as EOR India, partner assigned, effective 1 Oct", atMs: 250, actor: "agent", reversible: "yes" },
      { sys: "EOR partner", icon: "globe", detail: "Onboarding packet transmitted, Karnataka registration confirmed", atMs: 1600, actor: "agent", reversible: "yes" },
      { sys: "Payroll", icon: "payroll", detail: "Global Monthly, INR, PF and ESI registration opened", atMs: 3000, actor: "agent", reversible: "yes" },
      { sys: "Benefits", icon: "benefits", detail: "Statutory plus group medical, gratuity accrual from day one", atMs: 3950, actor: "agent", reversible: "yes" },
      { sys: "Device", icon: "device", detail: "Shipped from the Bengaluru stock pool, MDM pre-enrolled", atMs: 5000, actor: "agent", reversible: "yes" },
      { sys: "App access", icon: "apps", detail: "10 entitlements, identical bundle to a Berlin hire at the same level", atMs: 6400, actor: "agent", reversible: "yes" },
      { sys: "Spend", icon: "card", detail: "Card issued at the INR equivalent of the level limit", atMs: 7450, actor: "agent", reversible: "yes" },
      { sys: "Compliance", icon: "shield", detail: "Professional tax by state, IN-specific training assigned", atMs: 8450, actor: "agent", reversible: "yes" },
    ],
  },
  {
    id: "us",
    label: "Denver",
    sub: "Own entity · Unregistered state · Senior engineer",
    legacy: { days: "Blocked, discovered later", people: "3 people", systems: "5 systems" },
    note: "This is the one worth showing. The entity is not registered in Colorado, so the hire does not proceed — and this is not a warning somebody can click past. The registration opens and the record stays blocked until it clears. Compliance as a constraint, not a review step.",
    steps: [
      { sys: "Jurisdiction check", icon: "shield", detail: "Colorado — entity not registered. Hire blocked.", atMs: 350, actor: "agent", reversible: "yes" },
      { sys: "Registration", icon: "globe", detail: "CO withholding account opened automatically, ~2 business days", atMs: 1500, actor: "agent", reversible: "yes" },
      { sys: "Employment record", icon: "people", detail: "Staged, not created. Start date holds until registration clears.", atMs: 2600, actor: "agent", reversible: "yes" },
      { sys: "Everything downstream", icon: "apps", detail: "Payroll, benefits, device, access and card all wait on the gate", atMs: 3600, actor: "agent", reversible: "yes" },
      { sys: "Notification", icon: "bolt", detail: "Hiring manager and People told what is blocking and for how long", atMs: 4400, actor: "agent", reversible: "yes" },
    ],
  },
];

// ── Flow 2 · Offboard ────────────────────────────────────────────────────────
export const OFFBOARD: Variant[] = [
  {
    id: "resign",
    label: "Resignation",
    sub: "Hugo Lindgren · Berlin · 4 yrs tenure",
    legacy: { days: "5–9 days", people: "4 people", systems: "9 systems" },
    note: "The gap between the first action and the last is where every access incident lives. In a stack of point solutions, revocation is a checklist owned by a person who is also doing four other things — and the item that gets missed is found by an auditor months later.",
    steps: [
      { sys: "SSO sessions", icon: "lock", detail: "All active sessions terminated across 27 applications", atMs: 600, actor: "agent", reversible: "yes" },
      { sys: "App entitlements", icon: "apps", detail: "22 SCIM and SAML grants revoked, tokens invalidated", atMs: 1600, actor: "agent", reversible: "yes" },
      { sys: "Corporate card", icon: "card", detail: "Frozen. Two open transactions routed to the manager.", atMs: 2250, actor: "agent", reversible: "yes" },
      { sys: "Device", icon: "device", detail: "Remote lock issued, wipe scheduled, return label mailed", atMs: 3300, actor: "agent", reversible: "costly" },
      { sys: "Notice period", icon: "clock", detail: "German statutory notice computed from tenure — 3 months, last day 31 Dec", atMs: 4650, actor: "agent", reversible: "yes" },
      { sys: "Mail delegation", icon: "book", detail: "Delegated to manager for 30 days, then archived under retention policy", atMs: 5700, actor: "agent", reversible: "yes" },
      { sys: "Equity", icon: "report", detail: "Post-termination exercise window calculated, cap table updated", atMs: 6800, actor: "agent", reversible: "costly" },
      { sys: "Final pay", icon: "payroll", detail: "Computed with accrued leave per DE rules — staged, awaiting a human", atMs: 8100, actor: "human", reversible: "no" },
    ],
  },
  {
    id: "urgent",
    label: "Immediate, for cause",
    sub: "Access risk · same-minute revoke",
    legacy: { days: "Hours, at best", people: "3 people paged", systems: "9 systems" },
    note: "The scenario the CISO asks about. Everything reversible happens in under half a minute without waiting for a human, because the cost of a false positive is that somebody is locked out for ten minutes. Everything irreversible still waits, because the cost of a false positive there is a payroll error you cannot take back.",
    steps: [
      { sys: "SSO sessions", icon: "lock", detail: "Terminated across all 27 applications", atMs: 300, actor: "agent", reversible: "yes" },
      { sys: "App entitlements", icon: "apps", detail: "All grants revoked, refresh tokens invalidated", atMs: 800, actor: "agent", reversible: "yes" },
      { sys: "Corporate card", icon: "card", detail: "Frozen instantly", atMs: 1100, actor: "agent", reversible: "yes" },
      { sys: "Device", icon: "device", detail: "Remote lock, full wipe queued", atMs: 1700, actor: "agent", reversible: "costly" },
      { sys: "Physical access", icon: "shield", detail: "Badge deactivated at all three sites", atMs: 2300, actor: "agent", reversible: "yes" },
      { sys: "Data export audit", icon: "graph", detail: "Last 30 days of downloads and shares compiled for review", atMs: 3450, actor: "agent", reversible: "yes" },
      { sys: "Legal hold", icon: "book", detail: "Mailbox and files placed on hold — requires counsel to release", atMs: 4500, actor: "human", reversible: "no" },
      { sys: "Final pay", icon: "payroll", detail: "Computed per jurisdiction — staged, awaiting a human", atMs: 5550, actor: "human", reversible: "no" },
    ],
  },
];

export const WHY_THESE_THREE = [
  {
    id: "onboard",
    title: "Onboard",
    line: "One write, seven systems, three countries.",
    why: "It is the fastest demonstration that the record is shared rather than synced, and the only one that lands in four seconds with someone who has lived the alternative. Every buyer has personally waited nine days for a laptop and an email account.",
    buyer: "COO · Head of People · the person who owns the seams",
  },
  {
    id: "offboard",
    title: "Offboard",
    line: "Everything reversible in thirty seconds. Everything irreversible still waits.",
    why: "The risk story, and the one that gets a security review scheduled. It also shows the action-classification model, which is the part of the agentic argument that is hardest to fake and easiest to verify.",
    buyer: "CISO · CFO · General Counsel",
  },
  {
    id: "ask",
    title: "Ask",
    line: "Including a question it refuses to answer.",
    why: "Any vendor can ship a chat box this quarter. Almost none can produce a permission-correct refusal, because that requires evaluating the boundary against the live record on the way in rather than flattening it into an index. The refusal is the proof.",
    buyer: "CEO · CFO · anyone evaluating an AI claim",
  },
];
