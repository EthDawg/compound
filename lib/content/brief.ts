export interface Step {
  n: number; title: string; mins: number; href: string; cta: string;
  why: string; takeaway: string;
}

export interface Lens {
  id: string; label: string; who: string; opener: string; total: number;
  closing: string; steps: Step[];
}

export const LENSES: Lens[] = [
  {
    id: "prospect",
    label: "Prospect",
    who: "You run operations, people, IT or finance at a company between fifty and five thousand people.",
    opener:
      "You are not evaluating a philosophy. You want to know whether this removes work from your week, and whether the parts you would depend on are real. Start with the thing that actually happens on a Tuesday.",
    total: 11,
    closing:
      "If nothing here matched a Tuesday you have actually had, this is probably not for you and the specialist is the right call. The trade only pays if the seams are where your pain is.",
    steps: [
      { n: 1, title: "Change one field, watch six systems move", mins: 2, href: "/app", cta: "Open the app",
        why: "This is the entire pitch, and it takes four seconds to land if you have lived the alternative. Pick Department and hit Apply.",
        takeaway: "Nine days, four people and five systems collapses into one write and a forty-second wait." },
      { n: 2, title: "Hire someone in a jurisdiction you are not registered in", mins: 2, href: "/app/hire", cta: "Try the hire flow",
        why: "Set the work state to Colorado. The hire blocks — not a warning you can click past. This is what compliance looks like when it is a constraint rather than a review step.",
        takeaway: "The goal is not a team that catches the mistake. It is a form that will not let you make it." },
      { n: 3, title: "The employee record everything hangs off", mins: 2, href: "/app/people/e-009", cta: "Open a record",
        why: "Nine products read this row and none of them keeps a copy. Look at the history: a change and a correction are different operations, which matters the first time an auditor asks what was true in March.",
        takeaway: "No product owns a copy of the employee. That single constraint produces everything else." },
      { n: 4, title: "Ask a question no single vendor can answer", mins: 2, href: "/app/graph", cta: "Run a query",
        why: "Employment joined to device posture joined to app entitlements joined to spend. Across four vendors this is a quarterly CSV. Here it is a read.",
        takeaway: "The reports you cannot currently run are the shape of the seam you are paying for." },
      { n: 5, title: "The three deals we lose on purpose", mins: 3, href: "/backstage/manual/where-we-lose-on-purpose", cta: "Read where it fails",
        why: "Worth two minutes before you spend two months. If you are a single-function company, or you need the core record configured for you, this is the wrong purchase and it is better to know now.",
        takeaway: "A strategy without a loss column is a pitch." },
    ],
  },
  {
    id: "investor",
    label: "Investor",
    who: "You are underwriting a compound bet and you have seen a lot of decks that sound like this one.",
    opener:
      "The strategic story is easy and mostly unfalsifiable. Skip it. Go to the arithmetic, the falsifier, and the honest account of the trough — because from the outside, for about three years, this strategy and simple lack of focus are indistinguishable.",
    total: 14,
    closing:
      "The question to press on is not whether the thesis is coherent. It is whether the time-to-first-customer curve is scope-normalised, and whether NRR is carried by expansion or by price. Both are decomposable and both are where the story would break.",
    steps: [
      { n: 1, title: "The falsifier, stated before it was needed", mins: 3, href: "/backstage/metrics", cta: "See the scorecard",
        why: "Time to first customer per product line, in launch order. It is the only claim here that cannot be told as a story. Every metric also carries how it flatters you, which is the part usually missing.",
        takeaway: "Nineteen months to eleven weeks, with smaller teams each time. If that flattens, there is no thesis." },
      { n: 2, title: "The arithmetic of the second product", mins: 3, href: "/backstage/manual/the-second-product", cta: "Read the economics",
        why: "Product one buys the account at full acquisition cost. Every product after arrives at a structurally better contribution margin that a standalone competitor cannot reach at any scale.",
        takeaway: "If the second product only sells because it is bundled, it is a discount with extra steps." },
      { n: 3, title: "The trough, described honestly", mins: 3, href: "/backstage/manual/the-j-curve", cta: "Read the J-curve",
        why: "Three years where burn is high, each product looks thin, and the story requires the listener to hold a model. Includes the admission that some companies that look exactly like this are simply unfocused.",
        takeaway: "Raise for the trough before you enter it. The moment you need capital is the moment the numbers look worst." },
      { n: 4, title: "Fourteen decisions with their price tags", mins: 3, href: "/backstage/decisions", cta: "Read the log",
        why: "Each carries the rejected alternative, what it cost, and the condition that reopens it. Including an eleven-month product write-off at a ninety-percent attach rate.",
        takeaway: "The rejected alternative is the valuable half. It is what stops the same argument recurring annually." },
      { n: 5, title: "Where the next decade of growth comes from", mins: 2, href: "/backstage/trajectory", cta: "See the vectors",
        why: "Four vectors, each run through the same four-question test, including the one that fails it and the very large one being deliberately deferred.",
        takeaway: "Growth here is one selection rule applied repeatedly, not a roadmap." },
    ],
  },
  {
    id: "joiner",
    label: "New joiner",
    who: "You start on Monday and you would like to skip the eighteen months of absorbing this by osmosis.",
    opener:
      "Most of what will confuse you in your first quarter comes from three constraints that are not negotiable and one metric that decides most arguments. Learn those and the rest of the company becomes predictable.",
    total: 13,
    closing:
      "The thing nobody tells you directly: you will be told no on something you are right about. That is the system working. What you are owed in exchange is a platform that is not the bottleneck, and a written reason.",
    steps: [
      { n: 1, title: "The one rule everything else follows from", mins: 3, href: "/backstage/manual/the-employee-is-the-schema", cta: "Read the constraint",
        why: "No product keeps a copy of the employee. You will want to break this in your first six months, for good reasons, and the answer will be no.",
        takeaway: "Fork the interface freely. Never fork the employee, permissions, or the workflow engine." },
      { n: 2, title: "Why you will sometimes be blocked", mins: 2, href: "/backstage/org", cta: "See the structure",
        why: "Small pods on a thick platform. This is slower for your team than the alternative and faster for the company, and that trade is the company.",
        takeaway: "Teams own their product, never their primitives. The queue is a trade, not an insult." },
      { n: 3, title: "The nine skills that actually get people promoted here", mins: 4, href: "/backstage/skills", cta: "Read the skills",
        why: "Not values — observable, teachable skills, with what each looks like when it is missing and how to spot it in yourself.",
        takeaway: "The rarest one is holding a decision that is locally wrong and globally right, without relitigating it." },
      { n: 4, title: "What we argue about and how it gets settled", mins: 2, href: "/backstage/heresies", cta: "Read the heresies",
        why: "Eleven positions against standard advice, each with the case where the standard advice wins. If someone quotes one at you without its limit, they have skipped half of it.",
        takeaway: "A contrarian position without stated limits is a personality, not a strategy." },
      { n: 5, title: "The nine years you missed", mins: 2, href: "/backstage/timeline", cta: "Speed-run the history",
        why: "Five eras, what each cost, and the two years where this genuinely looked like a mistake from the inside.",
        takeaway: "Compound is a second act. Product one has to actually work first." },
    ],
  },
  {
    id: "skeptic",
    label: "Skeptic",
    who: "You think this is a conglomerate with better branding and you would like to test that.",
    opener:
      "Good. The friendly version of this argument is not worth your time. Go straight at the structural objection, the place the strategy is most plausibly wrong, and the loss column.",
    total: 12,
    closing:
      "The strongest remaining objection is not the conglomerate one — it is that good-enough-everywhere is a ceiling rather than a floor, and the market will pay for depth in more categories than assumed. That is unresolved and it is worth more attention than any competitor's roadmap.",
    steps: [
      { n: 1, title: "Isn't this just a conglomerate?", mins: 2, href: "/backstage/ask", cta: "Start at question one",
        why: "Fourteen questions sorted by how uncomfortable they are, including this one, 'how do you know you are not just unfocused', and 'what would make you abandon this'.",
        takeaway: "A conglomerate's fifth acquisition is not cheaper than its fourth. That is the whole difference, and it is measurable." },
      { n: 2, title: "The conditions under which this fails", mins: 3, href: "/backstage/manual/when-not-to-do-this", cta: "Read the counter-case",
        why: "Four preconditions, the categories where it reliably fails, and the sequencing mistake that kills most attempts.",
        takeaway: "Miss one precondition and the model does not partially work. It inverts." },
      { n: 3, title: "Where it loses, and which loss is not fine", mins: 3, href: "/backstage/manual/where-we-lose-on-purpose", cta: "Read the loss column",
        why: "Three designed losses and one accidental one. The accidental one is the most honest thing in the whole study.",
        takeaway: "When you lose to depth, the answer is depth — not a better explanation of why depth should not have mattered." },
      { n: 4, title: "The metrics that would prove it wrong", mins: 2, href: "/backstage/metrics", cta: "Check the falsifiers",
        why: "Each with the specific way it can flatter you, plus five metrics deliberately ignored and why.",
        takeaway: "If the falsifier is ever quietly retired, assume the strategy has stopped being tested." },
      { n: 5, title: "The AI claim, stated narrowly enough to be wrong", mins: 2, href: "/backstage/agentic", cta: "Test the agentic case",
        why: "Every company is currently explaining why its existing strategy was secretly an AI strategy. This one includes what it currently costs, what is still an open problem, and the risk that actually matters.",
        takeaway: "Everyone will have the same models. The claim is about the graph, and it is checkable." },
    ],
  },
];
