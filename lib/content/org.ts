export interface Layer {
  id: string; name: string; teams: string; headcount: string; owns: string[];
  rule: string; tension: string;
}

export const ORG_LAYERS: Layer[] = [
  {
    id: "l-01", name: "Product pods", teams: "19 pods", headcount: "~6–8 each",
    owns: ["The product surface", "Its own interface and interactions", "Domain logic specific to the product", "Triggers and actions contributed to the workflow engine", "Its own roadmap and customer relationships"],
    rule: "Own your product. Never own your primitives. Fork anything above the primitive layer without asking.",
    tension: "A pod will regularly be blocked on a platform capability and will have a locally correct argument for building it themselves. The answer is no, and the person saying no owes them a platform that is not the bottleneck.",
  },
  {
    id: "l-02", name: "Platform", teams: "6 teams", headcount: "~31% of engineering",
    owns: ["The employee record and its effective-dated history", "The permissions model", "The workflow engine", "The country abstraction", "Identity, audit log, notifications"],
    rule: "Funded off the top before product budgets are set. Never funded by product teams donating headcount, because they never do and they are always locally right not to.",
    tension: "Platform builds nothing a customer names, so its value is invisible in every demo and every board deck. It has to be defended constantly by someone with the authority to end the argument.",
  },
  {
    id: "l-03", name: "Compliance engineering", teams: "3 teams", headcount: "~40",
    owns: ["Jurisdictional rules as configuration", "Constraint design for regulated flows", "The exception path and its audit trail", "Relationships with local counsel in 31 countries"],
    rule: "Build constraints, never sit in an approval path. If compliance is a queue that reviews things, the org will route around it under deadline pressure.",
    tension: "Encoding a rule is much slower than writing a policy document. There is permanent pressure to trade this away in a tight quarter — which is exactly the quarter it matters.",
  },
  {
    id: "l-04", name: "Go-to-market", teams: "One motion", headcount: "~640",
    owns: ["A single sales motion across all product lines", "Expansion into the installed base", "The consolidation narrative"],
    rule: "One pipe. A product that needs a different motion is not an extension of the bet — it is a second company, and it fails question three of the four-question test.",
    tension: "Reps carry an enormous product surface and cannot be deep in all of it. Solved with configuration and specialists on call, never by splitting the motion.",
  },
];

export interface Ritual { name: string; cadence: string; what: string; why: string }
export const RITUALS: Ritual[] = [
  { name: "Decision log entry", cadence: "Per decision", what: "Context, decision, rejected alternatives with reasons, cost paid, revisit trigger.", why: "The rejected alternative is the valuable half. Code shows what we chose; only the log shows what we chose against — which is what stops the same debate recurring every nine months." },
  { name: "Numbers post", cadence: "Monthly", what: "Revenue, retention and margin by product line, to everyone, with written commentary on each line.", why: "The commentary is the load-bearing part. Numbers without context produce worse stories than no numbers at all." },
  { name: "Platform queue review", cadence: "Weekly, public", what: "Every request, its stated customer problem, its position, and a written reason for any reordering.", why: "An invisible queue makes every team assume it is last. Publishing it costs some uncomfortable conversations and buys back the trust that makes the fork rule survivable." },
  { name: "Four-question review", cadence: "Per proposed product", what: "Same record? Same buyer? Same pipe? Makes existing products better? All four, or no.", why: "It is a filter with teeth, and the failure mode at scale is it becoming a formality that everything passes because nobody is genuinely asking any more." },
  { name: "Standalone-willingness survey", cadence: "Per product, quarterly", what: "Would you pay for this alone, from us, at this price? Weighted by whether they used it in the last fortnight.", why: "The earliest signal that a product is riding the bundle. Came directly out of killing a product with a ninety-percent attach rate." },
  { name: "Curve review", cadence: "Quarterly", what: "Time to first customer per product line, in launch order, scope-normalized.", why: "The falsifier for the whole strategy. If it is ever quietly retired, assume the strategy has stopped being tested." },
];
