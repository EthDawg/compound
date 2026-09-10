export interface Vector {
  id: string; name: string; kicker: string; thesis: string;
  test: { q: string; a: string; pass: boolean }[];
  size: string; horizon: string; risk: string;
}

export const VECTORS: Vector[] = [
  {
    id: "v-01", name: "Depth in the categories customers live in",
    kicker: "Defensive, and the highest-priority thing on this list",
    thesis: "The one loss that is not by design is to a specialist in a category where the customer spends hours a day and we are a generation behind. That is a product problem, not a positioning problem, and it does not get solved by explaining the seam better.",
    test: [
      { q: "Same record?", a: "Yes — these are categories we already own", pass: true },
      { q: "Same buyer?", a: "Yes, though the daily user is often not the buyer, which is exactly the difficulty", pass: true },
      { q: "Same pipe?", a: "Yes", pass: true },
      { q: "Makes existing products better?", a: "Neutral at best. This is closing a gap rather than compounding — which is why it has to be argued for on different grounds", pass: false },
    ],
    size: "No new revenue. Protects existing.",
    horizon: "Continuous",
    risk: "Depth work is unglamorous and never finishes, so it loses every planning argument to a new product line unless it is protected the way platform headcount is.",
  },
  {
    id: "v-02", name: "Agentic surfaces across every product",
    kicker: "The compounding story with the stakes raised",
    thesis: "Not a product line — a property that every existing line acquires. The graph is the scarce input and we already have it. The work is permission-scoped retrieval, action classification, and treating record accuracy as an SLO rather than an operations concern.",
    test: [
      { q: "Same record?", a: "It is the record. This is the most literal pass the test has had", pass: true },
      { q: "Same buyer?", a: "Yes, and it moves the conversation up a level — from an operations budget to a capability decision", pass: true },
      { q: "Same pipe?", a: "Yes", pass: true },
      { q: "Makes existing products better?", a: "Every one of them, which is the definition of a platform capability rather than a product", pass: true },
    ],
    size: "Expansion within the base plus a genuine change in what we are competing on.",
    horizon: "Now through 2028",
    risk: "We are slower than competitors treating this as a retrieval problem, and will be for several quarters. The comparison grids will not be kind. The real risk is not competitive though — it is that automation raises the cost of a stale field from annoyance to incident.",
  },
  {
    id: "v-03", name: "More countries, as configuration",
    kicker: "The cheapest compounding available",
    thesis: "Country twelve took under three weeks and was almost entirely configuration plus local counsel review. Every additional jurisdiction widens the set of companies for whom consolidation is possible at all, and the marginal cost keeps falling.",
    test: [
      { q: "Same record?", a: "Yes — jurisdictional variation is data in the country layer", pass: true },
      { q: "Same buyer?", a: "Yes, and it often unlocks an account that was previously unservable", pass: true },
      { q: "Same pipe?", a: "Yes", pass: true },
      { q: "Makes existing products better?", a: "Yes. Every product inherits the jurisdiction without doing any work", pass: true },
    ],
    size: "Large. It is the dimension where the platform investment pays back most directly.",
    horizon: "Continuous",
    risk: "Regulatory surface grows faster than headcount. The mitigation is that rules are configuration and counsel relationships are the constraint — which means the bottleneck is legal capacity, not engineering.",
  },
  {
    id: "v-04", name: "The segment we declined, once it is expressible",
    kicker: "Deferred on purpose, with a specific unlock condition",
    thesis: "Two eight-figure opportunities were declined because they required per-customer configuration of the core record. That was correct. The condition that changes it is not commercial appetite — it is whether the platform can express their requirements as configuration rather than as code.",
    test: [
      { q: "Same record?", a: "Only if configurable without forking. That is the entire question and we are not close", pass: false },
      { q: "Same buyer?", a: "Larger, with procurement and a security review that is a different animal", pass: false },
      { q: "Same pipe?", a: "No — it needs an implementation motion we do not have and would change our margin structure", pass: false },
      { q: "Makes existing products better?", a: "Possibly. Configurability built properly benefits everyone below them", pass: true },
    ],
    size: "Very large, and the wrong reason to do it.",
    horizon: "Not before the platform can express it. No date.",
    risk: "The failure mode is taking it early because the number is compelling. Their edge case becomes a permanent branch with an SLA, and the promised generalisation never happens under contractual obligation to one account.",
  },
];

export interface Phase { years: string; label: string; competingOn: string; ceiling: string }

export const PHASES: Phase[] = [
  { years: "2017–2019", label: "Prove the record", competingOn: "Being adequate in one category while owning the record underneath it.", ceiling: "One product's market." },
  { years: "2020–2021", label: "Pay for the platform", competingOn: "Nothing visible. This is the trough, and by conventional measures it is the worst-looking period in the company's life.", ceiling: "Survival, honestly." },
  { years: "2022–2024", label: "Consolidation as a cost story", competingOn: "Fewer vendors, less double entry, one bill. A procurement argument that lands with a CFO in a tightening market.", ceiling: "The customer's tolerance for friction — which is high, because they have tolerated it for a decade." },
  { years: "2025–", label: "Consolidation as a capability story", competingOn: "Whether autonomous systems can be trusted to act on your company at all. The graph stops being a convenience and becomes the precondition.", ceiling: "Unclear, and that is the interesting part. The argument no longer competes against friction tolerance — it competes against nothing, because the alternative does not do the thing." },
];

export const TRAJECTORY_NOTE =
  "Growth from here is not a list of products. It is one product-selection rule applied repeatedly, plus one property — agentic capability — that every existing line acquires rather than a new line anyone buys separately. The interesting change is not the roadmap. It is that the sentence we have been saying for nine years now means something different.";
