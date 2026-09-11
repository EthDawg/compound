// The second turn: what each bet demands of the people running it, where growth
// comes from next, and the one observable worth tracking.
//
// Kept as a separate additive layer so the base reads stay legible and this can be
// revised on its own cadence.

export interface Crank {
  /** Capabilities the bet requires. Not values — things an organisation can be observed doing well or badly. */
  skills: { name: string; why: string }[];
  /** Where the next increment comes from, and what it costs. */
  trajectory: { vector: string; note: string }[];
  /** One concrete, checkable signal. The point of tracking a company rather than reading about it. */
  watch: string;
}

export const CRANK: Record<string, Crank> = {
  rippling: {
    skills: [
      { name: "Holding a locally-wrong decision", why: "The fork rule survives only if someone can refuse an argument that is correct on its own facts, absorb the resentment, and not relitigate it next quarter." },
      { name: "Sequencing product starts", why: "Beginning product N+1 at the right moment — when N sells on its own merits, not when it is finished — is the judgement the whole compounding curve rests on." },
      { name: "Narrating a trough", why: "Several years where the numbers look mediocre and the story requires the listener to hold a model. Reassurance does not work; showing the instrument does." },
      { name: "Domain absorption at speed", why: "Each new product line is a new regulated domain. Getting to working competence in weeks without either drowning or faking it is the rate limiter on adding products." },
    ],
    trajectory: [
      { vector: "Depth where customers live all day", note: "Defensive and unglamorous. Closes the one loss that is not by design, and loses every planning argument unless protected." },
      { vector: "Agentic capability across every line", note: "Not a product — a property each existing line acquires. The graph is the scarce input and it is already owned." },
      { vector: "More jurisdictions as configuration", note: "The cheapest compounding available, bounded by legal capacity rather than engineering." },
    ],
    watch: "Time from launch to first paying customer on each new product line. If that stops falling, the platform is a story rather than leverage.",
  },

  deel: {
    skills: [
      { name: "Standing up compliant employment fast", why: "Entering a new jurisdiction correctly — entity, payroll registration, local counsel, statutory obligations — is an operational competency, not a software one, and it is the actual product." },
      { name: "Running an entity network as operations", why: "Software margins with an operations business underneath. Managing that hybrid without letting either side dictate the other is genuinely hard and rarely discussed." },
      { name: "Converting a wedge into a relationship", why: "Turning a compliance purchase into the system of record requires a different motion from the one that won the account, and most companies never make the switch." },
    ],
    trajectory: [
      { vector: "HRIS reaching standalone quality", note: "The test is whether the core HR product would be bought alone. Until then it is an accompaniment." },
      { vector: "Payroll depth in major markets", note: "Coverage breadth is largely won. Depth in the countries where customers have real headcount is the next increment." },
      { vector: "Upmarket into enterprise", note: "Where the entity network is worth most and where procurement is hardest." },
    ],
    watch: "Whether domestic HR modules retain usage in accounts that did not arrive for global employment. That is the standalone test, and it is observable in reviews and case studies.",
  },

  workday: {
    skills: [
      { name: "Maintaining enterprise trust at scale", why: "The purchase is governance. One high-profile correctness failure costs more than a decade of feature velocity would earn." },
      { name: "Absorbing acquisitions into one data model", why: "Buying capability is easy; landing it inside a single tenant model without creating a second source of truth is the discipline that separates a platform from a suite." },
      { name: "Opening data without losing the boundary", why: "Analytics wants the data flat and accessible; agents need field-level permission enforced at read time. Those pull in opposite directions and the tension is now live." },
    ],
    trajectory: [
      { vector: "Agent depth across HR and finance", note: "Already shipping broadly. The question is whether the agents can act, not answer." },
      { vector: "The data layer as a product", note: "A live-query, lake-style architecture is a real expansion — and the place permission-correctness is most at risk." },
      { vector: "Defending the mid-market floor", note: "Implementation cost is a moat in both directions. It keeps challengers out and keeps Workday from coming down." },
    ],
    watch: "Whether the data-cloud expansion preserves field-level permission at query time. That single technical fact decides whether the agent story is real at enterprise scale.",
  },

  adp: {
    skills: [
      { name: "Regulatory operations as core competency", why: "Filing correctly across thousands of jurisdictions, every period, without error. This is the product, and almost nobody else in the map has attempted it at this scale." },
      { name: "Reliability at a scale that removes options", why: "At this volume, the interesting engineering constraint is that nothing can be turned off, migrated quickly, or experimented on in production." },
      { name: "Modernising the surface without disturbing the rail", why: "The hardest thing on this list. Every interface change risks the one property customers actually buy, which is that pay is correct and on time." },
    ],
    trajectory: [
      { vector: "Distribution through embedding", note: "Being the rail underneath other people's products is a growth vector that does not require winning the interface argument." },
      { vector: "Data products on unmatched coverage", note: "Sits on more employment truth than anyone. Whether that becomes a product is a choice, not a capability question." },
      { vector: "Whether it uses the agentic moment at all", note: "The quietest company here on agents. That is either the most underrated position in the category or the most exposed, and it will not stay ambiguous much longer." },
    ],
    watch: "Any move to expose the filing relationship itself through an API. That would be the rail choosing to become infrastructure deliberately rather than by default.",
  },

  finch: {
    skills: [
      { name: "Maintaining hostile integrations at volume", why: "Hundreds of connections to systems that did not ask to be connected and change without notice. This is a permanent operational treadmill, not a build." },
      { name: "Running human-assisted data operations", why: "Reaching providers with no API at all means people and scripts, not just engineering. Operating that reliably and compliantly is the unglamorous core of the business." },
      { name: "Defending a data-at-rest posture", why: "Storing employment records including compensation and tax data on your own servers is an increasingly expensive position to hold in enterprise security review." },
    ],
    trajectory: [
      { vector: "Agent distribution through MCP", note: "Being the way agents reach employment data is a genuinely large vector — and it puts the staleness question directly in front of buyers." },
      { vector: "Write coverage beyond deductions", note: "Read is broad, write is narrow. Widening write is where the value is and where the provider relationships get hardest." },
      { vector: "Beyond the US", note: "The fragmentation premise holds even more strongly internationally, and the coverage problem is correspondingly worse." },
    ],
    watch: "Whether write coverage widens materially, and whether sync latency shortens. Both are direct answers to the objection that agents cannot safely act on a stored copy.",
  },

  remote: {
    skills: [
      { name: "Partner management as go-to-market", why: "When distribution arrives through other companies' products, the commercial skill is managing a small number of high-stakes relationships rather than a funnel." },
      { name: "Entity and payments operations", why: "The same operational core as any global employment business, but with less tolerance for error because a partner's customers are exposed to it." },
      { name: "Staying hard to replace", why: "Every embedded strategy faces the day the partner considers building or buying it. Remaining more expensive to replicate than to renew is the entire long game." },
    ],
    trajectory: [
      { vector: "More embedded partners", note: "Each one adds reach without acquisition cost — and adds concentration risk." },
      { vector: "Deeper infrastructure primitives", note: "The more of the stack partners rent, the higher the replacement cost." },
    ],
    watch: "Whether any major partner announces its own entity network. That is the standing risk of this model and it usually arrives without warning.",
  },

  "employment-hero": {
    skills: [
      { name: "Local award and compliance depth", why: "Australian payroll is genuinely difficult — modern awards, interpretation, penalty rates. That difficulty is the moat and it must be maintained continuously as instruments change." },
      { name: "SME distribution economics", why: "Selling to small businesses profitably is a different discipline from mid-market. Acquisition cost and churn dominate every other consideration." },
      { name: "Expanding without forking", why: "The country-abstraction problem, faced by a smaller company with less margin for a wrong architectural call." },
    ],
    trajectory: [
      { vector: "Geographic expansion", note: "The test is whether new markets reach home-market density, or whether the compliance depth that protects ANZ has to be rebuilt each time." },
      { vector: "Upmarket within existing markets", note: "Where the compound argument gets stronger because the seams get more expensive." },
    ],
    watch: "Whether expansion markets show the same product attach as ANZ. If not, this is an excellent regional platform rather than a travelling thesis.",
  },

  mercor: {
    skills: [
      { name: "Supply acquisition at quality", why: "Marketplaces live or die on the side that is harder to get. Acquiring capable people quickly, repeatedly, without quality collapse is the whole operational problem." },
      { name: "Matching that is actually better", why: "The claim is that matching capability to tasks beats hiring roles. That has to be demonstrably true, not merely faster." },
      { name: "Navigating classification", why: "Every model that routes work outside employment eventually meets worker-classification law. This is where most of them are tested and where several have failed." },
    ],
    trajectory: [
      { vector: "Enterprise contracts rather than task volume", note: "Where durable revenue would come from, and where the model gets scrutinised hardest." },
      { vector: "From marketplace to infrastructure", note: "If it becomes the layer others build on rather than a destination, the position changes completely." },
    ],
    watch: "Whether the work becomes repeat and contractual rather than transactional. Marketplaces that never convert to durable relationships stay fragile regardless of growth.",
  },

  "nga-net": {
    skills: [
      { name: "Tender and accreditation management", why: "The buying process is the market. Writing winning responses and maintaining accreditation is the commercial competency, and it is a real one." },
      { name: "Long-cycle relationship retention", why: "Contracts measured in years, with renewal decided by people who value predictability over capability. Retention here is relationship work, not product work." },
      { name: "Regulatory and records obligation depth", why: "Public-sector recruitment carries record-keeping and fairness obligations that a general-purpose product does not attempt." },
    ],
    trajectory: [
      { vector: "Renewal", note: "Stated plainly because it is the honest answer. The strategy is to keep the contracts, and that is a legitimate strategy." },
      { vector: "Whatever procurement reform does", note: "In government the disruption arrives as policy rather than as a competitor. Watch the mandate, not the market." },
    ],
    watch: "Whole-of-government platform mandates or panel refreshes. Those reset incumbency in a way no product launch can.",
  },

  accenture: {
  skills: [
    { name: "Ecosystem and domain integration", why: "Make platform capabilities work with a client's data, processes and obligations; keep responsibility clear across partners." },
    { name: "Delivery economics", why: "Allocate people and automation to the engagement, and understand how its contract shares productivity gains and risk." },
    { name: "Operating-model change", why: "Bring specialist capabilities into repeatable delivery without weakening quality, handoffs or client accountability." },
  ],
  trajectory: [
    { vector: "Integrated services", note: "Accenture's 2026 Reinvention Services redesign is a concrete organisational move. Test whether delivery becomes more coherent for the client." },
    { vector: "AI-enabled delivery", note: "Lower effort can support margin, lower client cost or more output. None follows automatically without appropriate scope and commercial terms." },
    { vector: "Reusable products and assets", note: "Look for repeat use and lower delivery cost, while checking maintenance responsibility and client portability." },
  ],
  watch: "Cost and quality per completed outcome, the contract's allocation of risk, and whether clients renew or expand the resulting service.",
},

  constellation: {
    skills: [
      { name: "Disciplined small acquisition, repeatedly", why: "Hundreds of small purchases with a return threshold that does not move. The skill is saying no at scale, thousands of times, without drifting." },
      { name: "Decentralised operating capability", why: "Running very many small businesses without a central function that flattens them is genuinely unusual and is the reason the model scales." },
      { name: "Capital allocation as the product", why: "The actual competency is not software. It is deciding where the next dollar goes, forever, and never being forced to sell." },
    ],
    trajectory: [
      { vector: "More of exactly the same", note: "Stated without irony. Perpetual hold means the strategy has no next phase by design, which is its whole advantage." },
      { vector: "Vertical software as agents commoditise features", note: "If AI compresses feature differentiation, entrenched niche positions become relatively more valuable, not less." },
    ],
    watch: "Acquisition pace and return thresholds. Discipline drifting under capital pressure would be the first real signal of change in a model built to have none.",
  },
};

export const crankFor = (slug: string) => CRANK[slug];
