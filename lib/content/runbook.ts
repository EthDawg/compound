// The remote, not the control panel. Phrases to run ad hoc, in a fresh session,
// when you want the map to move. Nothing here runs on a schedule by design —
// the discipline is that a human decides when this project changes.

export interface Intent {
  id: string;
  q: string;
  answer: string;
  route: string;
  start: string;
}

export const INTENTS: Intent[] = [
  {
    id: "work",
    q: "Who should I go and work for?",
    answer:
      "Start at company altitude on the strategic-bet lens, then read the crank layer — the skills a bet demands tell you what you would actually be doing all day, which is a better predictor of fit than the mission statement. The trajectory block tells you whether the interesting work is ahead or behind.",
    route: "/ecosystem",
    start: "Company altitude · Strategic bet",
  },
  {
    id: "buy",
    q: "Who should I buy software from?",
    answer:
      "Durability lens, category altitude. The question is not who is best today — it is who will still be here, still investing, and still incentivised to care about you in seven years. Then drop into companies and read the loss column, because where a vendor loses on purpose tells you whether you are the customer they want.",
    route: "/ecosystem",
    start: "Category altitude · Durability",
  },
  {
    id: "ma",
    q: "Who acquires whom — and how do I dispose of something?",
    answer:
      "Ecosystem altitude, durability lens, then open Capital and consolidation. That ecosystem is the exit layer for everything else on the map. Constellation is the useful read: the only participant that never disposes of anything, which makes it the cleanest statement of what an asset is worth when growth stops.",
    route: "/ecosystem",
    start: "Ecosystem altitude · Durability",
  },
  {
    id: "informed",
    q: "How do I stay genuinely informed rather than merely current?",
    answer:
      "Architecture altitude first, always. Knowing that the integration layer returns every eight years under a new name is worth more than knowing this cycle's vendor names — it lets you price the next announcement correctly on the day it is made. Then track the single observable on each deep read rather than reading news.",
    route: "/ecosystem",
    start: "Architecture altitude",
  },
];

export interface Prompt {
  id: string;
  label: string;
  when: string;
  cost: "small" | "medium" | "large";
  text: string;
}

export const PROMPTS: Prompt[] = [
  {
    id: "refresh-one",
    label: "Refresh one company",
    when: "A node is overdue, or something happened you want reflected.",
    cost: "small",
    text: `In ~/Developer/compound, refresh the reading for <COMPANY> on the ecosystem map.

Search for what has materially changed since its "checked" date in lib/data/ecosystem.ts. Only three things count as material: a change to the bet itself, a change to where it wins or loses, or a change to its agentic position. Funding rounds and product launches are usually neither.

Update the lens positions only if the change actually moves them, and say plainly if it does not — an unchanged reading that has been verified is a real result. Update "checked" either way. If lib/content/ecosystem-deep.ts or ecosystem-crank.ts contain a claim that is now wrong, fix the prose too, and tell me which sentence changed and why.`,
  },
  {
    id: "challenge-score",
    label: "Challenge a score",
    when: "A position on the map looks wrong to you.",
    cost: "small",
    text: `In ~/Developer/compound, I think <COMPANY>'s position on the <LENS> lens is wrong.

Argue the opposite of whatever the current score says. Find the strongest case against the placement, then tell me whether it survives. If it does, change the number and update any prose in lib/content/ecosystem-deep.ts that depended on the old reading — the data and the argument must agree, and last time they drifted apart it was the data that was wrong.`,
  },
  {
    id: "add-company",
    label: "Add a company",
    when: "Something genuinely missing, not merely absent.",
    cost: "medium",
    text: `In ~/Developer/compound, consider adding <COMPANY> to the ecosystem map.

First argue whether it earns a place. The bar is that it represents a bet no company already on the map represents — not that it is large, funded, or in the news. If it is a duplicate of an existing position, say so and stop; do not add it.

If it passes, add it to lib/data/ecosystem.ts with all four lens positions, a one-line bet, freshness metadata, and per-lens notes where it says something the others do not. Only write a deep read if it changes the argument.`,
  },
  {
    id: "falsifier",
    label: "Test a falsifier",
    when: "Quarterly, or when a thesis feels too comfortable.",
    cost: "medium",
    text: `In ~/Developer/compound, every deep read in lib/content/ecosystem-deep.ts states a falsifier — the specific evidence that would prove that company's bet wrong.

Pick the three most checkable ones and actually check them against current public evidence. Report which have moved toward triggering and which have not. If any has effectively triggered, say so directly and rewrite that company's read rather than softening the falsifier. A falsifier that gets quietly loosened is worse than not having one.`,
  },
  {
    id: "emergence",
    label: "Check an emerging category",
    when: "Twice a year. Emergence is slow and easy to imagine.",
    cost: "medium",
    text: `In ~/Developer/compound, lib/data/altitude.ts contains speculative categories marked emergent — currently agent operations and compliance as code.

For each, look for evidence it is actually forming: companies funded specifically for it, buyers with a budget line for it, or an incumbent breaking it out as a product. Absence of evidence is the expected result and a useful one — report it plainly.

If one has formed, populate its members and remove the speculative flag. If one now looks wrong, delete it. Do not add new speculative categories unless you can name who would buy it and from what budget.`,
  },
  {
    id: "crank",
    label: "Turn the crank on a company",
    when: "A company on the map deserves the full treatment.",
    cost: "large",
    text: `In ~/Developer/compound, turn the crank on <COMPANY>.

That means bringing it to the same depth as the existing deep reads: the bet, the premise, what has to be true, the agentic position with a tell, where it wins and loses, a falsifier, and — in lib/content/ecosystem-crank.ts — the skills the bet demands, where the next increment comes from, and the one observable worth tracking.

Keep the honesty line: real companies get interpretation of public positioning with scores labelled as judgements. Never invented decisions, quotes or internals. That line is what separates this from the fictional tenant in /app.`,
  },
  {
    id: "prune",
    label: "Prune",
    when: "Whenever the map feels crowded. Run this more than you want to.",
    cost: "medium",
    text: `In ~/Developer/compound, the ecosystem map has grown. Argue for removing things.

Find every company that does not represent a distinct bet, every lens note that restates the blurb, every deep read section carrying no information, and any speculative category with no evidence behind it. Propose specific deletions with reasons.

Bias hard toward removal. This project is worth more small and sharp than large and complete, and the failure mode is breadth without intent. Then make the cuts I approve.`,
  },
  {
    id: "era-check",
    label: "Re-examine the architecture layer",
    when: "Rarely. Eras move on a decade scale, not a quarterly one.",
    cost: "large",
    text: `In ~/Developer/compound, lib/content/eras.ts argues that each computing era's winners owned that era's scarce resource, and that the integration layer recurs roughly every eight years under a new name.

Stress-test both claims. Find the strongest counter-example to the scarcity frame and tell me whether it breaks it. Then check whether the agentic era's stated scarce resource — a live, permission-aware record an agent may change — still looks right, or whether something else has become the binding constraint.

If the frame is holding, say so briefly and do not pad it. If it is not, rewrite it.`,
  },
];

export const OPERATING_RULES = [
  {
    rule: "Nothing runs on a schedule",
    why: "A cron job would keep this current and make it nobody's judgement. The value here is a point of view, and a point of view that updates itself without anyone deciding is just a feed.",
  },
  {
    rule: "An unchanged reading is a result",
    why: "Most refreshes should conclude that nothing material moved. Recording that is what makes the freshness dates mean anything, and it is the main defence against churning the map to feel productive.",
  },
  {
    rule: "Removal is a first-class operation",
    why: "Every map like this dies of accumulation. The prune prompt exists so that shrinking is as normal an action as adding, and it should be run more often than it feels necessary.",
  },
  {
    rule: "The data and the argument must agree",
    why: "The scores exist to support a claim. When they drift apart, one of them is wrong — and it has already once been the data. Any score change must carry a check of the prose that depended on it.",
  },
];
