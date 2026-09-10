// The altitude above ecosystems: architecture patterns and what happened to their footprints.
//
// The claim this layer makes is that these are not a march of progress. They are
// footprints — some still expanding, some holding, some decaying for forty years
// without ever disappearing. And the integration pattern in particular recurs
// about every eight years under a new name, which is the single most useful thing
// to know when a new one is announced.

export type Footprint = "Emerging" | "Expanding" | "Holding" | "Decaying" | "Residual";

export interface Era {
  id: string;
  name: string;
  span: string;
  footprint: Footprint;
  scarce: string;          // what was scarce, and therefore what the winners owned
  winners: string;
  whatItDidToCost: string;
  residue: string;         // what is still here, decades later
  hrExamples: string[];
  x: number;               // timeline position 0..100
  y: number;               // current footprint weight 0..100
}

export const ERAS: Era[] = [
  {
    id: "mainframe", name: "Centralised compute", span: "1960s–1980s",
    footprint: "Residual",
    scarce: "Compute itself. Whoever owned the machine owned the process that ran on it.",
    winners: "Service bureaux — companies that ran your payroll on their hardware because you could not afford your own.",
    whatItDidToCost: "Made batch processing possible at all, at a price only large employers could carry.",
    residue:
      "Payroll never fully left. The largest payroll businesses today are direct descendants of the service-bureau model — you still send them your data and they still run it and file it. The interface modernised; the relationship did not.",
    hrExamples: ["ADP", "Paychex"],
    x: 6, y: 34,
  },
  {
    id: "client-server", name: "Client/server", span: "1985–2000",
    footprint: "Decaying",
    scarce: "The installation. Winning meant getting your software onto the customer's own hardware, once, expensively.",
    winners: "Enterprise licence vendors with implementation partners attached.",
    whatItDidToCost: "Moved cost from per-transaction to a large upfront capital event plus maintenance — and created the systems-integrator economy as a permanent side effect.",
    residue:
      "The buying process. Enterprise HR software is still bought the way client/server software was bought: committee, RFP, integrator, multi-year programme. The delivery model changed decades ago. The procurement ritual did not.",
    hrExamples: ["SAP SuccessFactors", "Oracle HCM"],
    x: 20, y: 30,
  },
  {
    id: "saas", name: "Multi-tenant SaaS", span: "1999–present",
    footprint: "Holding",
    scarce: "The tenant. One codebase, many customers, and the winner is whoever the customer's record lives inside.",
    winners: "Vendors who could run everyone on one version and upgrade continuously.",
    whatItDidToCost: "Collapsed the upfront capital event into a subscription and made the vendor, not the customer, responsible for the upgrade.",
    residue:
      "Everything. This is still the dominant commercial form and will be for a long time. Its maturity is why the interesting arguments have moved up a layer to what the tenant contains rather than where it runs.",
    hrExamples: ["Workday", "Gusto", "HiBob"],
    x: 38, y: 88,
  },
  {
    id: "mobile", name: "Mobile and deskless", span: "2008–present",
    footprint: "Holding",
    scarce: "Attention at the edge. The worker who never sits at a desk and had been invisible to enterprise software.",
    winners: "Whoever reached the frontline worker directly rather than through their manager's screen.",
    whatItDidToCost: "Expanded the addressable workforce enormously and made scheduling and time the real system of record for a huge share of employment.",
    residue:
      "A permanent split in the category between desk-based HR and frontline workforce management, which are still sold, priced and built differently.",
    hrExamples: ["UKG", "Paradox"],
    x: 52, y: 72,
  },
  {
    id: "open-source", name: "Open source and commodity infrastructure", span: "1998–present",
    footprint: "Holding",
    scarce: "Nothing, which was the point. It removed scarcity from the layers below the product.",
    winners: "Companies that could now start without buying a database, a web server or an operating system.",
    whatItDidToCost:
      "Dropped the floor. The cost of the tenth product line falls when none of the ten needs a licence underneath it — which is a quiet precondition for the whole compound-platform pattern.",
    residue:
      "The reason a six-person team can now own a product line that once needed sixty. Rarely credited in strategy discussions and load-bearing in all of them.",
    hrExamples: ["Every company on this map, whether they say so or not"],
    x: 44, y: 78,
  },
  {
    id: "integration", name: "The integration layer", span: "1975 – recurring",
    footprint: "Expanding",
    scarce: "Connection between systems that were never designed to talk.",
    winners: "Whoever names the pattern this cycle. EDI, then EAI middleware, then SOA and the ESB, then iPaaS, then the unified API, and now MCP.",
    whatItDidToCost:
      "Each generation lowers the cost of one connection and raises the total number of connections, which is why the problem never resolves and the category never dies.",
    residue:
      "This is the recurring footprint, and knowing that is worth more than knowing any single instance of it. Roughly every eight years the industry rediscovers that systems do not talk, gives it a new three-letter name, funds it heavily, and is surprised when consolidation does not eliminate it. It never does — because every consolidation creates a new boundary at its own edge.",
    hrExamples: ["Finch", "Merge", "Check"],
    x: 30, y: 92,
  },
  {
    id: "vertical-compound", name: "Vertical compound platforms", span: "2012–present",
    footprint: "Expanding",
    scarce: "The customer relationship, and the right to sell the next thing into it cheaply.",
    winners: "Companies that own one industry's core record and compound products on top of it.",
    whatItDidToCost:
      "Made the second and third product structurally cheaper than a standalone competitor's first — the only durable cost advantage in software that does not depend on scale.",
    residue:
      "Too early to call residue. The pattern is roughly a decade old and has produced several very large companies, which is evidence but not proof.",
    hrExamples: ["Rippling", "Deel", "Employment Hero"],
    x: 66, y: 84,
  },
  {
    id: "agentic", name: "Model-native and agentic", span: "2023–present",
    footprint: "Emerging",
    scarce:
      "Not the model — those are converging and commoditising fast. What is scarce is a live, permission-aware record an agent is allowed to change.",
    winners: "Unknown. That is what makes it interesting rather than what makes it hype.",
    whatItDidToCost:
      "Not yet clear. The plausible answer is that it collapses the cost of the interface and raises the cost of being wrong — which favours whoever already owns correct data and punishes whoever owns a stale copy.",
    residue:
      "The honest position is that nobody knows yet whether this is a new era or a very good interface layer on the last one. Both readings have serious people behind them. Watch whether anyone ships an agent that takes an irreversible action unsupervised and survives it.",
    hrExamples: ["Rippling", "Workday", "Mercor"],
    x: 86, y: 56,
  },
];

export const ERA_THESIS = {
  headline: "Every era's winners owned that era's scarce resource",
  body:
    "That is the whole pattern, and it is more useful than any individual era. Compute was scarce, so the service bureaux won. The installation was scarce, so the licence vendors and their integrators won. The tenant was scarce, so multi-tenant SaaS won. Connection was scarce — repeatedly — so the integration layer keeps returning under new names. Right now models are becoming abundant and a permissioned, live record is becoming scarce. If that reading is right, it tells you where value accrues next without needing a single prediction about any specific company.",
  caution:
    "The failure mode of this frame is treating it as a march of progress. It is not. These are overlapping footprints, and old ones decay for decades without disappearing — payroll is still a service-bureau relationship wearing a modern interface, and enterprise software is still bought the way client/server software was bought. Anyone who assumes the old footprint is gone will misprice how long the incumbent has.",
};

export const RECURRENCE = {
  headline: "The integration layer returns roughly every eight years",
  instances: [
    { years: "1975", name: "EDI", claim: "Standardised documents between trading partners" },
    { years: "1995", name: "EAI middleware", claim: "A hub that connects every enterprise application" },
    { years: "2003", name: "SOA / the ESB", claim: "Services, loosely coupled, on a bus" },
    { years: "2012", name: "iPaaS", claim: "Integration itself as a cloud service" },
    { years: "2019", name: "Unified API", claim: "One API across every vendor in a category" },
    { years: "2025", name: "MCP", claim: "One protocol so agents can reach any system" },
  ],
  note:
    "Each instance was sold as the thing that finally ends the integration problem. None did, and none will, because consolidation does not remove boundaries — it moves them. The practical use of noticing this is not cynicism. It is that you can price the next one correctly on the day it is announced, and you can tell the difference between a company riding the pattern and a company claiming to end it.",
};
