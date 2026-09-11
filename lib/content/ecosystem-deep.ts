export interface DeepRead {
  slug: string;
  title: string;
  headline: string;
  bet: string;
  premise: string;
  mustBeTrue: string[];
  agentic: { position: string; tell: string };
  wins: string[];
  loses: string[];
  falsifier: string;
  paradox?: string;
  vsCompound: string;
}

export const DEEP: DeepRead[] = [
  {
    slug: "rippling",
    title: "Rippling",
    headline: "Own the record, compound outward, and let the seams disappear",
    bet: "Every administrative system is downstream of one object — the employee. Own that object rather than syncing it, and every product built on top gets cheaper than the last.",
    premise:
      "The customer's pain is not inside any tool. It is between them. A company of three hundred people runs eleven vendors and employs at least one person whose real job is being middleware. Nobody sells against that person's job description because nobody owns the space they work in.",
    mustBeTrue: [
      "Marginal cost per product line keeps falling. If product nine did not ship faster than product four, this is a portfolio wearing a platform's clothes.",
      "Customers value the disappearance of seams more than they value depth in any single category. That trade gets better with headcount and worse with specialisation.",
      "Multi-product customers churn materially less than single-product ones — the quiet half of the thesis, and usually the reason the economics work.",
      "The company can hold the no. Every locally-correct argument to fork the record is an exception that ends the strategy one reasonable decision at a time.",
    ],
    agentic: {
      position:
        "The strongest architectural position on the board. Agents act on the same live, permission-scoped record a human write would touch — which means the hard part is already paid for.",
      tell: "Ask any vendor's agent a question outside the asker's span of control. If it returns a confident partial answer instead of a refusal, permissions were flattened into an index somewhere, and the boundary is decorative.",
    },
    wins: [
      "Mid-market companies with eleven vendors and no HRIS administrator",
      "Anyone whose real problem is a person moving, joining or leaving rather than a feature gap",
      "Deals where a live department-change demo can be run in the room",
      "Security reviews, increasingly — one permission model beats eleven",
    ],
    loses: [
      "Single-function companies whose whole day lives inside one category",
      "Enterprises needing per-customer configuration of the core record — a fork with a purchase order attached",
      "Any category where the daily user, not the buyer, decides and the specialist is a generation ahead",
    ],
    falsifier:
      "Time-to-first-customer per product line flattening across three consecutive launches with no scope explanation. That would mean the platform is a story rather than leverage.",
    vsCompound:
      "This is the base case the rest of the map is measured against — and the one already built out in full inside this study.",
  },
  {
    slug: "deel",
    title: "Deel",
    headline: "Own the border first, then compound inward",
    bet: "The hardest part of employing someone is doing it legally in a country where you have no entity. Own that, and the rest of the record follows the relationship you already hold.",
    premise:
      "Rippling entered through the domestic stack and expanded outward into borders. Deel entered through borders and is expanding inward into the stack. Same destination, opposite direction of travel — which makes the pair the cleanest natural experiment in the category.",
    mustBeTrue: [
      "Global employment is a durable wedge rather than a commoditising one. Entity networks are expensive to build and, so far, expensive to copy.",
      "Customers who arrive for EOR will consolidate domestic HR onto the same vendor rather than treating it as a specialist bolt-on.",
      "Compliance depth across 150+ jurisdictions stays a moat as competitors and partners narrow the coverage gap.",
      "The HRIS layer reaches genuine parity rather than remaining a bundled accompaniment to the global product.",
    ],
    agentic: {
      position:
        "Strong where Deel owns the employment relationship — its agents act on records it holds. Weaker where it sits beside an incumbent HRIS and must read someone else's truth.",
      tell: "The interesting question is not what the agent can answer, but whether it can act in a country where Deel is the employer of record versus one where it is a bystander.",
    },
    wins: [
      "Companies hiring across many countries with no entities and no appetite to build them",
      "Contractor-heavy and distributed workforces",
      "Buyers who want one vendor for global, and are content to keep their domestic HRIS",
    ],
    loses: [
      "US-only companies wanting maximum domestic depth",
      "Buyers who want IT and Finance in the same system as HR",
    ],
    falsifier:
      "Domestic HRIS attach failing to convert into standalone-worthy usage. If the core HR product only sells alongside EOR, it is a bundle rather than a second product.",
    paradox:
      "Deel and Rippling have been in open litigation with each other. It is unusual for two companies this early in a category to be this entangled — a signal of how much both believe the same prize is at stake.",
    vsCompound:
      "The compound thesis with the entry point moved. It tests whether the sequence matters or only the destination does.",
  },
  {
    slug: "workday",
    title: "Workday",
    headline: "The incumbent that already consolidated, defending from above",
    bet: "Large enterprises will not run their workforce on a mid-market platform. Own the enterprise system of record, add finance and planning around it, and let scale and switching cost do the rest.",
    premise:
      "Workday is not the enemy of the compound thesis — it is an earlier, larger instance of it. It consolidated HR and finance for the enterprise a decade before anyone said 'compound startup'. The difference is the segment and the implementation cost.",
    mustBeTrue: [
      "Enterprise buyers keep valuing configurability and governance over speed and price.",
      "The agent layer stays permission-correct as the surrounding data architecture opens up — a lake-style layer is exactly where field-level boundaries get quietly lost.",
      "Mid-market challengers cannot climb fast enough to reach enterprise before enterprise finishes its own agent transition.",
      "Implementation cost stays a moat rather than becoming the reason a CFO takes the challenger's call.",
    ],
    agentic: {
      position:
        "Owns the record at enormous scale and shipped a broad agent wave in 2026 — payroll, performance, job architecture — alongside a data cloud and live-query layer.",
      tell: "Watch whether the data-cloud expansion preserves field-level permission at query time. Opening the data for analytics and keeping the boundary intact for agents pull in opposite directions.",
    },
    wins: [
      "Organisations above roughly a thousand people with dedicated HRIS administrators",
      "Anyone needing deep workforce planning, analytics and finance in one place",
      "Regulated, complex, multi-entity enterprises where governance is the purchase",
    ],
    loses: [
      "Companies without the headcount to absorb implementation and administration",
      "Buyers who want IT device and app management in the same system — not the frame Workday is built in",
    ],
    falsifier:
      "Mid-market challengers winning enterprise logos on the strength of the agent story rather than on price. That would mean architecture beat scale.",
    vsCompound:
      "Proof the compound structure works — and a warning that winning it once buys a position that is very hard to defend cheaply.",
  },
  {
    slug: "adp",
    title: "ADP",
    headline: "Be the rail. Whatever wins above it still settles through here.",
    bet: "Payroll is not software, it is infrastructure with a regulatory surface. Own the filing relationships, the tax jurisdictions and the money movement, and the application layer above becomes somebody else's argument.",
    premise:
      "ADP is the single largest fact in this map and the one least discussed. It pays a share of the US workforce no venture-backed company approaches. On the installed-reality lens it is not a competitor — it is the terrain.",
    mustBeTrue: [
      "Regulatory and filing depth stays a moat rather than becoming an API somebody else wraps.",
      "Being the rail beneath challengers is more durable than competing with them for the interface.",
      "Scale continues to buy compliance coverage faster than insurgents can build it.",
      "Quiet is a position rather than a lag — that the transition can be made without the narrative.",
    ],
    agentic: {
      position:
        "Sits on more employment truth than anyone here and is the quietest company on the board about agents. That is either the most underrated position in the category or the most exposed one, and it will not stay ambiguous for long.",
      tell: "The asset is unmatched; the question is whether the interface can change fast enough to use it. Infrastructure companies rarely lose the data — they lose the surface where decisions get made.",
    },
    wins: [
      "Large and complex US employers where filing accuracy is the entire purchase",
      "Anyone for whom a payroll error is a regulatory event rather than an inconvenience",
      "Buyers who never appear in technology discourse and never will",
    ],
    loses: [
      "Companies buying an experience rather than a rail",
      "Mid-market buyers consolidating HR, IT and Finance in one place",
    ],
    falsifier:
      "Challengers taking over the filing relationship itself, not just the interface above it. Everything else is surface.",
    paradox:
      "ADP ranks near the bottom of this map on strategic discourse and at the very top on installed reality. That gap is the single strongest argument that relevance is not one quantity.",
    vsCompound:
      "The reminder that a category can be reshaped in public while the money keeps moving through infrastructure nobody is writing about.",
  },
  {
    slug: "finch",
    title: "Finch",
    headline: "The record never consolidates. Sell the connective tissue instead.",
    bet: "There are roughly six thousand HRIS and payroll systems in the US alone, and the overwhelming majority have gated APIs or none at all. That fragmentation is permanent. Sell the layer that spans it.",
    premise:
      "This is the precise antithesis of the compound thesis, and it is a serious one. Rippling says: own the record and the integration problem stops existing. Finch says: the record will never be owned by one system, so the integration problem is the market. Both cannot be right at scale.",
    mustBeTrue: [
      "Fragmentation persists. Every consolidation win subtracts directly from the premise, one employer at a time.",
      "Being a neutral third party stays more valuable than being aligned with a winner.",
      "Products built on employment data — earned wage access, 401(k), verification, benefits — keep needing breadth more than they need freshness.",
      "The sync-and-store architecture remains acceptable to buyers as data-residency scrutiny rises.",
    ],
    agentic: {
      position:
        "Shipped an MCP server so agents can reach employment data across hundreds of providers. But it serves a stored copy — synced daily for automated connections, weekly for assisted ones.",
      tell: "This is the sharpest fact on the map. Finch and Rippling both ship 'AI agents for HR' and mean opposite things: one acts on the live record, the other reads a copy that can be a week old. Whether that distinction matters is the whole argument, and it will be settled by an incident rather than by a comparison grid.",
    },
    wins: [
      "Fintech and benefits products that must reach every employer, whatever they run",
      "Long-tail payroll systems no consolidator will ever integrate directly",
      "Buyers whose product is the data, not the workflow",
    ],
    loses: [
      "Any use case needing real-time truth or write-back at speed",
      "Compliance-strict buyers who object to employment records at rest with a third party",
      "The moment a customer's employers do consolidate",
    ],
    falsifier:
      "Consolidation share rising fast enough that the addressable fragmentation shrinks. Finch's market is literally the mess; the bet is that the mess is permanent.",
    paradox:
      "Finch's existence is the best available evidence that the compound thesis has a ceiling — and its architecture is the best available evidence for why owning the record matters once agents start acting.",
    vsCompound:
      "The strongest structural objection in the category, held by a company betting real money on the opposite answer.",
  },
  {
    slug: "remote",
    title: "Remote",
    headline: "Be the infrastructure inside the platforms you would otherwise fight",
    bet: "You do not have to win the front end. Power global payroll underneath other people's HR platforms and arrive through their distribution instead of buying your own.",
    premise:
      "The least-discussed strategic position here. Where Deel competes for the customer relationship, Remote has increasingly sold infrastructure to the platforms that hold it — including ones with their own global ambitions.",
    mustBeTrue: [
      "Partners keep choosing to embed rather than build, which holds only while global payroll stays genuinely hard.",
      "Embedded margin plus partner distribution beats owning the customer at higher acquisition cost.",
      "Being inside a partner's product is stickier than being a tab in a buyer's stack — early evidence says it is.",
      "Partners do not eventually acquire or replace the capability once it becomes strategic to them.",
    ],
    agentic: {
      position:
        "Infrastructure rarely needs an agent narrative. It needs to be the thing other companies' agents call — which is a quieter and possibly better place to stand.",
      tell: "If the partners' agents can execute a global hire end to end, the infrastructure underneath becomes more valuable, not less. Being invisible is the product.",
    },
    wins: [
      "Platforms wanting global payroll without building entities",
      "Buyers already committed to an HCM who need international coverage added",
    ],
    loses: [
      "Direct competition for the front-end relationship against better-funded rivals",
      "Any negotiation where the partner realises how strategic the dependency has become",
    ],
    falsifier:
      "A major partner building or buying the capability in-house. That is the standing risk of every embedded strategy and it usually arrives without warning.",
    vsCompound:
      "The counter-move to compounding: if you cannot own the whole record, be the part of it everyone else must rent.",
  },
  {
    slug: "employment-hero",
    title: "Employment Hero",
    headline: "The compound playbook, run on a different continent",
    bet: "The same logic — one record, compounding products — applied to ANZ and adjacent markets, with local payroll compliance as the wedge the US platforms cannot easily copy.",
    premise:
      "Useful precisely because it is not American. If the compound thesis is a structural truth rather than a Silicon Valley artefact, it should reappear independently wherever the same conditions hold. It has.",
    mustBeTrue: [
      "Local payroll and award compliance is deep enough to keep global platforms out, but not so deep it caps expansion.",
      "SME customers consolidate onto one vendor rather than assembling cheap point tools.",
      "Geographic expansion works without forking the product per market — the country-abstraction problem, in a smaller company.",
      "The moat holds if a global platform decides ANZ is worth genuine investment.",
    ],
    agentic: {
      position:
        "Owns the record and the payroll engine in its markets, which is the precondition. Less exposed to the global agent arms race, and less pressured by it.",
      tell: "Regional compound platforms may reach agentic capability more cheaply than global ones — a smaller jurisdictional surface is a smaller permission problem.",
    },
    wins: [
      "ANZ small and mid-sized businesses, where it is closer to infrastructure than to a challenger",
      "Markets where local compliance depth beats global brand",
    ],
    loses: [
      "Multinationals needing coverage far beyond its footprint",
      "Any market where it has to build the compliance depth from scratch against an incumbent",
    ],
    falsifier:
      "Expansion markets failing to reach the density of the home market. Regional compound platforms can be excellent and still be capped by geography.",
    vsCompound:
      "Evidence the thesis travels — and a reminder that the most relevant company in a given market is often the one the US press does not cover.",
  },
  {
    slug: "mercor",
    title: "Mercor and the AI-native wave",
    headline: "The unit of work changes before the record does",
    bet: "The fight over who owns the employee record assumes the employee is the durable unit. If work becomes task-shaped and AI-mediated, that assumption is the thing that breaks first.",
    premise:
      "Every other company here is arguing about who owns a row representing a full-time person. This wager is that the row itself is a legacy artefact of how work was organised, and that matching capability to tasks matters more than administering headcount.",
    mustBeTrue: [
      "A meaningful share of work genuinely shifts to task-shaped, dynamically-matched arrangements rather than remaining employment with better tooling.",
      "The matching layer captures the value, rather than the payment rail or the compliance layer underneath it.",
      "Regulation permits it at scale — worker classification is where most of these models actually get tested.",
      "It survives long enough to matter. Most companies with a bet this large do not.",
    ],
    agentic: {
      position:
        "Native to the frame rather than retrofitted into it — but note the asymmetry: matching people to work is a far easier agentic problem than changing a person's department across nine systems. Different problem, different bar.",
      tell: "Watch whether this ever needs to touch an employer's system of record. If it does, it inherits every problem the rest of the map is arguing about.",
    },
    wins: [
      "Task-shaped, project-shaped and AI-training work where speed of match is the product",
      "Buyers who need capability rather than headcount",
    ],
    loses: [
      "Anything requiring durable employment, benefits, or a compliance relationship",
      "Employers whose actual problem is administering the people they already have",
    ],
    falsifier:
      "Work stubbornly staying employment-shaped. Predictions that the employment relationship is about to dissolve have a long and unbroken record of being early.",
    paradox:
      "Ranks near the top of this map on strategic bet and near the bottom on installed reality — the inverse of ADP. Both facts are true at once, which is exactly the point of using more than one lens.",
    vsCompound:
      "The only wager here that attacks the primitive rather than fighting over who owns it.",
  },
  {
    slug: "nga-net",
    title: "nga.net",
    headline: "The case for irrelevance — and why the map needs it",
    bet: "Win and hold public-sector recruitment contracts. Strategy is procurement, accreditation and renewal, not product velocity.",
    premise:
      "This company was named as an example of what to leave out — commercially real, strategically inert, invisible to technology discourse. Leaving it out would have been the easy call. Including it is the more honest one, because it exposes what the other three lenses quietly assume.",
    mustBeTrue: [
      "Public-sector procurement keeps rewarding incumbency, accreditation and risk-aversion over product quality.",
      "Migration risk in government stays high enough that 'good enough and already approved' beats 'better and unfamiliar'.",
      "Compliance and records obligations continue to favour vendors who have already passed the reviews.",
    ],
    agentic: {
      position:
        "Structurally outside the conversation. Nothing in a multi-year government contract cycle rewards moving quickly on agents, and the procurement process would not know how to evaluate it.",
      tell: "Being outside the frame is not the same as being at risk. Irrelevance to discourse and vulnerability to disruption are different variables that get confused constantly.",
    },
    wins: [
      "Government agencies with tender processes, accreditation requirements and genuine migration risk",
      "Any buyer for whom 'nobody was fired for renewing' is a rational position",
    ],
    loses: [
      "Every conversation about where the category is going",
      "Any buyer with a real choice and no procurement constraint",
    ],
    falsifier:
      "A procurement reform or platform mandate that resets incumbency. In government, the disruption usually arrives as policy rather than as a competitor.",
    paradox:
      "Near the top of the board on durability and at the very bottom on strategic relevance — the widest gap between those two of any company here. To an agency running its hiring on it, this is the most relevant HR technology in existence. To a venture investor, it does not exist. Both readings are correct, and no single ranking can hold them at once — which is precisely why this map has four.",
    vsCompound:
      "The control case. If your definition of relevance cannot account for this company, your definition is doing less work than you think.",
  },
  {
  slug: "accenture",
  title: "Accenture and the integrator channel",
  headline: "Who owns the outcome when the work takes fewer hours?",
  bet: "Connect advice, technology and operations around a business change, with the client buying delivery capability and continuing accountability.",
  premise: "Accenture's consulting and managed-services businesses give it several relationships with the same client. The relevant AI question is how each service and contract changes, rather than whether every engagement depends on implementation hours.",
  mustBeTrue: [
    "Clients continue to need integration, domain knowledge and accountable delivery as the tools improve.",
    "The firm turns automation into reliable outcomes rather than shifting unresolved work to the client.",
    "Pricing, scope and delivery costs allow productivity gains to support viable economics for both parties.",
    "The operating model can bring specialised teams together without losing responsibility at handoffs.",
  ],
  agentic: {
    position: "Automation can compress routine effort while creating work in integration, evaluation, process redesign and managed operations. The balance depends on the engagement; a category-wide collapse or expansion is not established.",
    tell: "Read the contract and the measured outcome together. Time-and-materials, fixed-price, usage and outcome-linked arrangements distribute productivity gains and delivery risk differently.",
  },
  wins: [
    "Complex programmes where the client needs accountable delivery across organisational boundaries",
    "Business processes that require continuing operational support as well as a technology change",
    "Work requiring specialised capability the client cannot readily assemble internally",
  ],
  loses: [
    "Bounded changes where internal teams or a focused specialist can deliver the required outcome economically",
    "Engagements where coordination and transition costs exceed the benefit of a broad service scope",
  ],
  falsifier: "Track cost per correct outcome, quality, demand and contract economics together. Falling effort accompanied by sustained outcomes and viable economics supports adaptation; shrinking demand and deteriorating economics challenge it.",
  paradox: "The same automation can reduce delivery effort and increase the importance of whoever integrates, governs and supports the result.",
  vsCompound: "A more integrated product can remove some implementation work. Migration, exceptions, organisational change and ongoing operations still need an owner; compare the whole outcome and cost.",
},
  {
    slug: "constellation",
    title: "Constellation Software",
    headline: "Buy small, never sell, hold forever — durability as the entire strategy",
    bet: "Small vertical software businesses with entrenched customers are permanently valuable. Acquire them at a disciplined return threshold, run them decentrally, and never dispose of anything.",
    premise:
      "Every other company on this map is playing a growth game. This one is playing a duration game, and it is the only strategy here that explicitly optimises for the lens the others treat as an afterthought. If durability is a real form of relevance, this is its purest expression.",
    mustBeTrue: [
      "Small entrenched software keeps generating cash long after growth stops — the observation the whole model rests on.",
      "Acquisition discipline holds under capital pressure. The threshold not moving is the strategy; the moment it moves, this becomes an ordinary roll-up.",
      "Decentralisation continues to scale. Very many small businesses without a flattening central function is unusual and is the reason it works.",
      "Feature commoditisation from AI raises rather than lowers the value of entrenched niche positions.",
    ],
    agentic: {
      position:
        "Almost entirely outside the frame, deliberately. The portfolio is full of exactly the software that technology discourse assumes is about to be swept away and that has instead been quietly compounding for decades.",
      tell: "If AI genuinely commoditises features, the differentiator becomes the customer relationship and the switching cost — which is the only thing this model has ever bought.",
    },
    wins: [
      "Niches too small for venture-backed competition and too entrenched to displace",
      "Founders who want a permanent home rather than an exit and a reset",
      "Any market where being unglamorous and unkillable beats being excellent and funded",
    ],
    loses: [
      "Every conversation about the future of software",
      "Assets that require growth investment rather than disciplined operation",
    ],
    falsifier:
      "Acquisition discipline drifting — paying more for growth, or being forced to sell something. Either would mean the duration bet had become a growth bet wearing its clothes.",
    paradox:
      "On the strategic lens this barely registers. On durability it is close to the top of the board. It is the answer to the disposal question the rest of this map never asks: where do these companies actually go, and who is content to hold them forever?",
    vsCompound:
      "The inverse of compounding through product expansion — compounding through acquisition and time instead. Both are bets that the second thing is cheaper than the first. Only one of them requires being right about the future.",
  },
];

export const deepBySlug = (s: string) => DEEP.find((d) => d.slug === s);

export const MAP_NOTE =
  "Every position on this map is a judgement, not a measurement. The scores exist to make an argument visible and arguable — they are not research, not a ranking, and not advice. Company facts referenced here are public and approximate as of late 2026; the strategic readings are interpretations of public positioning, not accounts of anyone's internal decisions.";
