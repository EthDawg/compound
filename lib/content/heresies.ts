export interface Heresy {
  id: string;
  orthodoxy: string;
  practice: string;
  why: string;
  whenOrthodoxyWins: string;
  confidence: "Held hard" | "Held loosely" | "Still arguing";
}

export const HERESIES: Heresy[] = [
  {
    id: "h-01",
    orthodoxy: "Do one thing exceptionally well before you do anything else.",
    practice: "Start the second product before the first is finished — around seventy percent, once it sells on its own merits.",
    why: "You cannot discover which parts of product one are actually platform until you need them twice. Waiting for 'finished' means waiting forever, because finished is a moving line.",
    whenOrthodoxyWins: "Before product-market fit. If nothing is working yet, a second product is not strategy, it is avoidance — and it costs you the only thing that could have saved you.",
    confidence: "Held hard",
  },
  {
    id: "h-02",
    orthodoxy: "Buy best-of-breed for each category and integrate.",
    practice: "Accept less depth per tool in exchange for the seams between them disappearing.",
    why: "The customer's pain is almost never inside a tool. It is at the boundaries, and no vendor can fix a boundary from one side of it.",
    whenOrthodoxyWins: "When a company lives inside one function all day. A two-hundred-person recruiting agency should buy the best applicant tracking system that exists and accept the seams.",
    confidence: "Held hard",
  },
  {
    id: "h-03",
    orthodoxy: "Small, autonomous teams should choose their own tools and abstractions.",
    practice: "Teams own their product, never their primitives. Fork the interface freely; never fork the employee record.",
    why: "Autonomy over primitives produces N incompatible versions of the same thing, and the reconciliation logic outlives everyone who wrote it.",
    whenOrthodoxyWins: "When your products genuinely do not share a core object. Then forced commonality is overhead with no payoff, and you should let teams run.",
    confidence: "Held hard",
  },
  {
    id: "h-04",
    orthodoxy: "Compliance is a function that reviews what the business produces.",
    practice: "Compliance is encoded as system constraints. The non-compliant action is not expressible.",
    why: "Review has a hit rate below one, forever, and the misses are silent. Constraints have a hit rate of one and cost nothing per transaction.",
    whenOrthodoxyWins: "Where the rules are genuinely ambiguous or negotiated case by case. Encoding a judgement call as a hard constraint just pushes people into spreadsheets.",
    confidence: "Held hard",
  },
  {
    id: "h-05",
    orthodoxy: "Raise only what you need, when you need it. Dilution is the enemy.",
    practice: "Raise for the trough before you enter it, larger than the plan requires.",
    why: "The moment you need capital is the moment your numbers look worst. A strategy that requires three thin years cannot be financed reactively.",
    whenOrthodoxyWins: "If your strategy does not have a trough. A capital-efficient single-product business raising defensively is destroying value for no reason.",
    confidence: "Held hard",
  },
  {
    id: "h-06",
    orthodoxy: "A high attach rate proves a product is working.",
    practice: "Attach rate on a bundled product measures your packaging. Ask instead whether they would buy it standalone.",
    why: "We shipped a product with near-universal attach and near-zero week-three usage. It cost eleven months and taught the sales team the bundle does the work.",
    whenOrthodoxyWins: "When the product is genuinely priced and chosen separately. Then attach rate is demand, and it is one of the best signals you have.",
    confidence: "Held hard",
  },
  {
    id: "h-07",
    orthodoxy: "Move fast; you can refactor the data model later.",
    practice: "The data model is the one thing you cannot refactor later. Everything else, yes. Not that.",
    why: "Effective dating, permissions, and the identity of the core record touch every read path ever written. Retrofitting them is a rewrite that no company ever completes.",
    whenOrthodoxyWins: "For anything above the primitive layer. Product surfaces, workflows, pricing logic — move fast, break them, rewrite them yearly. That is fine and healthy.",
    confidence: "Held hard",
  },
  {
    id: "h-08",
    orthodoxy: "Take the big customer. Revenue is validation.",
    practice: "Decline customers whose requirements need per-customer configuration of the core record, regardless of contract size.",
    why: "Their edge case becomes a permanent branch with an SLA attached, and the promised generalization never happens under contractual obligation to one account.",
    whenOrthodoxyWins: "When you are pre-fit and the big customer is telling you something true about the market. Early on, the customer who pulls hardest is often the signal.",
    confidence: "Held loosely",
  },
  {
    id: "h-09",
    orthodoxy: "Protect the team from bad numbers so they can focus.",
    practice: "Publish revenue, retention and margin by product line to everyone, monthly, with written commentary.",
    why: "People fill information vacuums with worse stories than the truth, and local decisions made without global context are systematically wrong in expensive ways.",
    whenOrthodoxyWins: "In a genuine crisis with a live legal or transactional constraint, where partial information does real harm. Those situations exist and pretending otherwise is naive.",
    confidence: "Held loosely",
  },
  {
    id: "h-10",
    orthodoxy: "Hire the strongest individual engineer available.",
    practice: "Hire for willingness to accept constraints they did not set, even at some cost to raw individual strength.",
    why: "A strong engineer who cannot accept a platform decision will spend two years routing around it and will be locally right the whole time. That is more expensive than a slightly less strong engineer who builds on it.",
    whenOrthodoxyWins: "On the platform team itself, where the job is to set the constraints. There, you want the strongest and most opinionated person you can find.",
    confidence: "Still arguing",
  },
  {
    id: "h-11",
    orthodoxy: "Ship AI features fast; retrieval over your data is table stakes.",
    practice: "Assistants query the live graph under the real permission model. No vector copy of the employee record.",
    why: "A stale, permission-blind copy is the exact failure mode the company exists to eliminate — and embeddings make the staleness invisible rather than merely present.",
    whenOrthodoxyWins: "Over documents, where staleness is tolerable and permissions are coarse. There, index everything and move fast.",
    confidence: "Still arguing",
  },
];
