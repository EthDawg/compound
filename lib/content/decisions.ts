export interface Decision {
  id: string;
  date: string;
  year: number;
  title: string;
  status: "Standing" | "Superseded" | "Under review";
  area: "Architecture" | "Product" | "Org" | "Go-to-market" | "Capital" | "Compliance";
  stake: "Company-defining" | "Significant" | "Reversible";
  context: string;
  decision: string;
  rejected: { option: string; why: string }[];
  cost: string;
  revisit: string;
  aftermath?: string;
}

export const DECISIONS: Decision[] = [
  {
    id: "D-001", date: "Mar 2017", year: 2017, title: "One employee table. No product may keep a copy.",
    status: "Standing", area: "Architecture", stake: "Company-defining",
    context: "Two engineers wanted to denormalize employee fields into the payroll service for query performance. The argument was correct on the local facts: the join was expensive, the deadline was real, and the copy would only carry four fields.",
    decision: "No product owns a copy of the employee record. Products read the record; they never store it. This is not a guideline, it is the constraint the rest of the company is built on.",
    rejected: [
      { option: "Denormalize with a sync job", why: "A sync job is a second source of truth with a delay. It always drifts, and the drift is silent until an audit or an incident finds it." },
      { option: "Denormalize now, migrate after launch", why: "In every company any of us had worked at, the migration never happened. The temporary copy is the permanent architecture." },
    ],
    cost: "Payroll shipped roughly five weeks late and the platform team took on the caching work instead. We ate the date rather than the architecture.",
    revisit: "Never on performance grounds. Performance is a platform problem, and if reads are slow that is a signal to fund the platform, not to fork the record.",
    aftermath: "Nine years on, this is the single decision that most of the product surface depends on. Every ripple you can see in the app exists because of it.",
  },
  {
    id: "D-002", date: "Aug 2017", year: 2017, title: "Effective dating on every fact, before we needed it",
    status: "Standing", area: "Architecture", stake: "Company-defining",
    context: "Nobody was asking for it. We had one product and a handful of customers, none of whom had ever needed to know what was true on a past date. It looked like textbook premature generalization.",
    decision: "Every fact about a person is stored with a validity window. Every read can specify an as-of date. Corrections and changes are distinct operations with different history semantics.",
    rejected: [
      { option: "Add it when a customer asks", why: "By then the read paths are written. Retrofitting temporality into an existing system is close to a rewrite — we had all seen it attempted and not seen it finished." },
      { option: "Audit log only", why: "A log tells you what changed. It does not let you reconstruct state as of a date without replaying the whole log, which is not a query anyone will actually run at 4pm during an audit." },
    ],
    cost: "Roughly four engineer-months up front and a meaningfully more complex data model that every new engineer has to learn in week one.",
    revisit: "Closed. This is load-bearing for payroll amendments, benefits reconciliation, equity, and every compliance conversation we have.",
    aftermath: "The first customer to need it was in year two, on an amended filing. It took eleven minutes. Their previous vendor had quoted three weeks.",
  },
  {
    id: "D-003", date: "Feb 2018", year: 2018, title: "Build product two before product one is finished",
    status: "Standing", area: "Product", stake: "Company-defining",
    context: "Payroll was live and growing but visibly incomplete. Conventional advice, and the honest instinct of most of the team, was to finish it. Starting benefits looked like the classic unfocused-startup mistake.",
    decision: "Start the second product at roughly seventy percent completeness on the first, and use the second product to discover which parts of product one were actually platform.",
    rejected: [
      { option: "Finish payroll first", why: "Products are never finished. 'Finished' is a moving line and waiting for it means the platform is never discovered, because you only find the shared abstractions by needing them twice." },
      { option: "Design the platform up front instead", why: "We would have guessed wrong. You cannot know what to abstract until you have built the same thing twice and felt where they differ." },
    ],
    cost: "Payroll's roadmap slowed for two quarters and we lost at least three deals to a competitor with a deeper feature set. Internal morale dipped hard — it genuinely looked like a mistake from inside.",
    revisit: "The rule now is: start product N+1 when product N is selling on its own merits, not when it is complete.",
    aftermath: "Benefits took fourteen months. Product four took seven. The gap between those two numbers is the whole thesis, and we did not have it as evidence until year four.",
  },
  {
    id: "D-004", date: "Sep 2018", year: 2018, title: "Fund the platform off the top, not from product budgets",
    status: "Standing", area: "Org", stake: "Significant",
    context: "Platform work was being funded by product teams donating headcount. Predictably, nobody donated. Every team had a locally correct reason why this quarter was the wrong quarter, and every team was right.",
    decision: "A fixed fraction of engineering headcount is allocated to platform before product budgets are set. The fraction is defended at the same level as a product line's headcount.",
    rejected: [
      { option: "Rotate engineers through platform", why: "Platform work needs continuity and deep context. A rotating cast produces shallow abstractions and no ownership of the consequences." },
      { option: "Let product teams build shared things opportunistically", why: "Shared things built by a product team optimize for that team's case and become a burden the moment a second team adopts them." },
    ],
    cost: "Product teams are permanently smaller than their leads want. This produces a recurring argument roughly every planning cycle, and it should.",
    revisit: "Adjust the fraction if platform lead time exceeds four weeks sustained, or falls below one week sustained — the second is as much a signal as the first.",
  },
  {
    id: "D-005", date: "Jan 2019", year: 2019, title: "Compliance encoded in the system, not enforced by review",
    status: "Standing", area: "Compliance", stake: "Company-defining",
    context: "We were about to hire a compliance team whose job would be reviewing transactions before they went out. That is the standard shape and it was the obvious next hire.",
    decision: "Compliance rules are encoded as system constraints. Non-compliant actions are not expressible in the interface. The compliance team builds constraints; it does not sit in an approval path.",
    rejected: [
      { option: "A review team in the approval path", why: "Review has a hit rate below one, forever, and the misses are silent. It also becomes a velocity tax that the org will eventually route around under deadline pressure." },
      { option: "Policy documents plus training", why: "This is review with extra steps and worse coverage. It relies on humans remembering jurisdictional rules that no human should be expected to hold." },
    ],
    cost: "Features involving regulated surfaces take substantially longer to build. We have declined customer-specific exceptions that would have closed deals.",
    revisit: "Never as a whole. Individual constraints are revisited when they block a legitimate case — and the fix is a documented exception path that leaves a record, never removing the constraint.",
  },
  {
    id: "D-006", date: "Jun 2019", year: 2019, title: "Publish revenue by product line internally",
    status: "Standing", area: "Org", stake: "Significant",
    context: "Product two was losing money and the team knew something was wrong but not what. Leadership was managing the anxiety by managing the information, which is the normal instinct and the wrong one.",
    decision: "Revenue, retention, and margin by product line are visible to every employee, updated monthly, with written commentary attached to each number.",
    rejected: [
      { option: "Share with managers only", why: "Creates an information hierarchy that makes every manager a bottleneck and every IC a guesser. People fill information vacuums with worse stories than the truth." },
      { option: "Share aggregates only", why: "Aggregates hide exactly the thing a compound startup needs people to see — that some lines subsidize others on purpose, and which ones." },
    ],
    cost: "Two leaks we know of. Recurring anxiety in weak quarters that requires real leadership attention rather than a memo.",
    revisit: "Standing. The commentary requirement is the part that makes it work, and it is the part most likely to erode under time pressure.",
  },
  {
    id: "D-007", date: "Nov 2019", year: 2019, title: "Country differences are data, never code",
    status: "Standing", area: "Architecture", stake: "Company-defining",
    context: "Our second country was going to ship faster with a forked payroll module. The fork was estimated at six weeks; the abstraction at four months.",
    decision: "Jurisdictional variation is expressed as configuration read by one engine — required fields, tax treatment, termination sequencing, leave accrual. No conditional in a product may branch on country.",
    rejected: [
      { option: "Fork per country", why: "Twelve countries becomes twelve codebases and a combinatorial testing problem. Every product feature then has to be built N times, which destroys the compounding." },
      { option: "Abstract after three countries", why: "Three forks is already too much to unwind. The right moment to abstract is at the second instance, which is also the moment it is hardest to justify." },
    ],
    cost: "Roughly ten weeks of additional work on country two, taken directly out of a launch date we had already communicated.",
    revisit: "Closed. Country twelve took under three weeks, almost entirely configuration and local counsel review.",
  },
  {
    id: "D-008", date: "Apr 2020", year: 2020, title: "Killed the analytics product. Kept the data layer.",
    status: "Superseded", area: "Product", stake: "Significant",
    context: "We shipped a standalone analytics product. It had a high attach rate — nearly every customer had it enabled. Usage after week two was close to zero.",
    decision: "Kill it as a product. Attach rate was bundle-driven, not demand-driven. The underlying cross-domain query layer was kept and moved into platform.",
    rejected: [
      { option: "Keep it, the attach rate is good", why: "Attach rate on a free bundled product measures our packaging, not their demand. It was flattering us and teaching sales that the bundle does the work." },
      { option: "Invest more and fix it", why: "The standalone-willingness survey came back clearly negative. Customers did not want an analytics product from us — they wanted answers inside the products they were already using." },
    ],
    cost: "Eleven months of engineering written off. A public deprecation, which was uncomfortable and correct. Two people left over it.",
    revisit: "Superseded by the reporting surface embedded in each product, which is where the demand actually was.",
    aftermath: "This is the decision I point at when someone argues an attach rate justifies a product. It is also the origin of the standalone-willingness question we now ask before any product ships.",
  },
  {
    id: "D-009", date: "Oct 2020", year: 2020, title: "Raise more than the plan requires, two years early",
    status: "Standing", area: "Capital", stake: "Company-defining",
    context: "We had twenty-six months of runway and no need to raise. The platform investment ahead of us was large and mostly unmonetizable for another two years.",
    decision: "Raise a round substantially larger than the operating plan requires, explicitly to fund the trough of the J-curve, and say that plainly to investors rather than framing it as growth capital.",
    rejected: [
      { option: "Raise when we need it", why: "The moment we would need it is precisely the moment the numbers look worst — mid-trough, multiple products immature. That is the worst possible time to be asking." },
      { option: "Raise a smaller round at better terms", why: "Optimizing dilution against a strategy that requires surviving three thin years is optimizing the wrong variable." },
    ],
    cost: "More dilution than a conventional plan needed. Higher expectations attached to the price.",
    revisit: "Standing principle: raise for the trough before you enter it, not during.",
  },
  {
    id: "D-010", date: "Mar 2021", year: 2021, title: "Cap product teams at eight. Fork the UI, never the primitives.",
    status: "Standing", area: "Org", stake: "Significant",
    context: "Product teams were growing past twelve and slowing down. Simultaneously, larger teams were building their own versions of shared capabilities because they finally had the headcount to do it.",
    decision: "Product teams cap at eight. Above that, split the product rather than growing the team. Teams may fork anything above the primitive layer freely; they may never fork the employee record, permissions, workflow, or the country layer.",
    rejected: [
      { option: "Let teams grow with scope", why: "Past about ten people the team can no longer hold the whole product, and the loop from customer pain to shipped fix lengthens with every layer added." },
      { option: "Allow platform forks with a migration plan", why: "We tried this twice. Neither migrated. A fork with a migration plan is a fork." },
    ],
    cost: "More teams means more coordination surface and more managers. Splitting a product is genuinely disruptive and people dislike it.",
    revisit: "The cap is a heuristic, not physics. The fork rule is not negotiable.",
  },
  {
    id: "D-011", date: "Aug 2022", year: 2022, title: "Publish the platform queue to the whole company",
    status: "Standing", area: "Org", stake: "Reversible",
    context: "Product teams believed platform work was prioritized by politics. Some of them were partly right, and all of them assumed they were last in line.",
    decision: "The platform request queue, its ordering, and each request's stated customer problem are visible company-wide. Reordering requires a written reason attached to the item.",
    rejected: [
      { option: "Communicate priorities in planning", why: "Quarterly communication of a queue that changes weekly is not transparency, it is a snapshot people then treat as a commitment." },
      { option: "Let leadership arbitrate case by case", why: "Escalation-driven prioritization rewards volume and seniority. It also does not scale past about fifteen teams." },
    ],
    cost: "Uncomfortable visibility when something sits at the bottom for a quarter, and some genuinely hard conversations with the teams it belongs to.",
    revisit: "Standing. The written-reason requirement on reordering is the load-bearing half.",
  },
  {
    id: "D-012", date: "Feb 2023", year: 2023, title: "Time-to-first-customer is the platform's report card",
    status: "Standing", area: "Product", stake: "Significant",
    context: "We had no falsifiable measure of whether the platform was actually producing leverage, only the belief that it was. Belief is what every unfocused company also has.",
    decision: "Track engineering months to first paying customer for every product line, in launch order, published internally. A flattening curve is treated as a platform failure, not a product failure.",
    rejected: [
      { option: "Measure platform adoption instead", why: "Adoption measures compliance with a mandate, not leverage. Teams can adopt the platform fully and still ship slowly." },
      { option: "Measure engineer satisfaction with the platform", why: "Useful, but it is a lagging and noisy proxy. Satisfaction is high right after a big platform release and low right before one." },
    ],
    cost: "Occasionally embarrassing. Two product lines showed no improvement and we had to say so publicly, internally, with our names on it.",
    revisit: "This is the falsifier for the entire strategy. If it is ever quietly retired, assume the strategy has stopped being tested.",
  },
  {
    id: "D-013", date: "Jul 2024", year: 2024, title: "Declined the enterprise segment. Twice.",
    status: "Standing", area: "Go-to-market", stake: "Significant",
    context: "Two very large prospects would have been our biggest contracts. Both required a different implementation motion, a dedicated services organization, and per-customer configuration of the core record.",
    decision: "No. The revenue was real; the customer was different. Per-customer configuration of the employee record is a fork with a purchase order attached.",
    rejected: [
      { option: "Take it and generalize later", why: "The generalization never happens under contractual obligation to a single large customer. Their edge case becomes a permanent branch with an SLA." },
      { option: "Serve them through a services arm", why: "A services organization changes the company's gross margin, hiring profile, and roadmap incentives. That is a different business, not a segment." },
    ],
    cost: "Two eight-figure opportunities declined. The sales organization did not enjoy this and said so.",
    revisit: "When the platform can express their requirements as configuration rather than as code. That is a real bar, and we are not close.",
  },
  {
    id: "D-014", date: "Mar 2026", year: 2026, title: "AI features must read the graph, not a vector copy of it",
    status: "Under review", area: "Architecture", stake: "Significant",
    context: "Several teams proposed embedding employee and policy data into per-product vector stores to power assistants. Each proposal was individually reasonable and each created a second copy of the record with different staleness.",
    decision: "Assistants query the live graph through the same permission model as any other read. Retrieval indexes may exist over documents, never over the employee record itself. An answer must be as-of-now and permission-correct by construction.",
    rejected: [
      { option: "Per-product vector stores over employee data", why: "This is D-001 with a new name. A stale, permission-blind copy of the record is the exact failure the company was built to avoid, and embeddings make the staleness invisible." },
      { option: "One central embedding of everything", why: "Centralizing it fixes the fragmentation and not the staleness or the permissions. An embedding cannot express 'as of March' or 'only this manager's reports'." },
    ],
    cost: "Slower assistant features and worse latency than competitors who will happily embed everything. We will lose some demos on responsiveness.",
    revisit: "Open question: whether a permission-scoped, effective-dated index is achievable without becoming a second source of truth. Being worked now.",
  },
];

export const DECISION_AREAS = ["Architecture", "Product", "Org", "Go-to-market", "Capital", "Compliance"] as const;
