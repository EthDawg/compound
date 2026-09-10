export interface Skill {
  id: string;
  n: string;
  name: string;
  oneLine: string;
  who: string;
  rarity: "Rare" | "Very rare" | "Teachable";
  present: string;
  absent: string;
  practised: string;
  tell: string;
}

export const SKILLS: Skill[] = [
  {
    id: "s-01", n: "01", name: "Holding a locally-wrong decision",
    oneLine: "Saying no to an argument that is correct on its own facts, absorbing the resentment, and not relitigating it next quarter.",
    who: "Anyone who owns a constraint. Platform leads, most acutely.",
    rarity: "Very rare",
    present: "The person can restate the other side's argument better than the other side did, agree with every fact in it, and still hold. They do not reach for a bad counter-argument to make the no feel more comfortable, and they do not soften it into a maybe that costs everyone another month.",
    absent: "Two failure modes, and the second is worse. Either the constraint erodes one reasonable exception at a time, or it is defended with manufactured reasons — which teaches everyone that the real reason is unspeakable and the constraint is arbitrary.",
    practised: "Every no on a platform fork is written down with the local argument stated fairly and the global cost named. If the write-up cannot make the other side feel understood, the decision goes back. The rule that makes it survivable is the counterweight: platform lead time is a leadership metric, so the person saying no owns the queue that made the ask reasonable.",
    tell: "Ask them about a decision they held that made someone good at their job angry. The ones who have this skill remember the person's name and still think they were right to be angry.",
  },
  {
    id: "s-02", n: "02", name: "Writing to think, not to inform",
    oneLine: "Using the memo as the instrument that finds the answer, rather than the packaging you put around an answer you already had.",
    who: "Everyone above about the third month. Non-negotiable for anyone proposing platform work.",
    rarity: "Teachable",
    present: "The document changes the author's mind at least once during writing. It states the strongest version of the position it argues against. It names the condition under which it would be wrong, and that condition is checkable by someone else.",
    absent: "Documents that are transcripts of a decision already made, written to create the appearance of process. You can spot them because the rejected alternatives are all straw, and nothing in the document could have come out differently.",
    practised: "Platform requests are written before they are discussed — not as ceremony, but because roughly half dissolve on contact with a written problem statement. That yield is the entire justification. A ritual that only produced better-organised meetings would not be worth the afternoon it costs.",
    tell: "Ask what they changed their mind about while writing something. No answer means the writing was decoration.",
  },
  {
    id: "s-03", n: "03", name: "Pre-committing the falsifier",
    oneLine: "Naming the specific evidence that would prove you wrong, while it is still abstract, and then actually looking at it when it is not.",
    who: "Anyone making a bet with a long feedback loop. Which, here, is most people.",
    rarity: "Very rare",
    present: "A stated number, a stated threshold, and a stated duration — 'if the curve flattens across three product lines with no scope explanation' — chosen before the outcome is in doubt. Then the number is looked at on schedule, including in the quarters when looking is uncomfortable.",
    absent: "Conviction with no exit condition, which is indistinguishable from conviction that happens to be right, until suddenly it is very distinguishable. The quiet version is worse: the metric exists, and is simply stopped being mentioned.",
    practised: "Every decision-log entry carries a revisit trigger that is a condition rather than a date. The company-level falsifier — time to first customer per product line — is published, and there is a standing rule that if it is ever quietly retired, that is itself the signal that the strategy has stopped being tested.",
    tell: "Ask what would change their mind. Then ask when they last checked. The second question is the real one.",
  },
  {
    id: "s-04", n: "04", name: "Reversibility triage",
    oneLine: "Sorting decisions by how expensive they are to undo, then matching your speed to that — and being accurate about which is which.",
    who: "Everyone. It is the single highest-leverage habit for individual throughput.",
    rarity: "Teachable",
    present: "Reversible calls made in minutes, alone, without a meeting. Irreversible ones slowed deliberately, written down, and widened to more people. Crucially: the classification is examined rather than assumed, because the expensive mistake is not being slow — it is calling something reversible when it is not.",
    absent: "Uniform speed. Either everything gets a meeting, which is a slow company, or nothing does, which is a company that keeps discovering it has permanently done something.",
    practised: "The data model, the permission model and anything touching the employee record are treated as irreversible by default, because retrofitting them is a rewrite nobody finishes. Everything above the primitive layer is treated as reversible and moved on fast — product surfaces here get rewritten roughly yearly and that is considered healthy.",
    tell: "Watch how long they take on a decision that does not matter. Fast on the trivial is the cheapest available signal.",
  },
  {
    id: "s-05", n: "05", name: "Domain absorption",
    oneLine: "Getting to genuine working competence in an unfamiliar regulated domain in weeks, without either drowning in it or faking it.",
    who: "Product and engineering on any new line. The rate-limiting skill for adding products.",
    rarity: "Rare",
    present: "Within about three weeks they can name the five things that actually matter in the domain, the three places where practitioners disagree, and the one thing everyone gets wrong. They know which questions to take to counsel and which to answer themselves — that boundary is the skill.",
    absent: "Either paralysis — six months of research before shipping — or confident shallowness, which in a regulated category produces software that is subtly illegal in a way nobody notices for two years.",
    practised: "New product lines start with a written domain brief before any code: what the rules are, where they vary by jurisdiction, what is genuinely ambiguous, and what the exception path has to look like. It is reviewed by someone who has shipped in that domain and by external counsel. The brief is the artefact that makes the first engineering decision survivable.",
    tell: "Hand them a domain they do not know and ask what they would need to learn first. Strong answers start by asking who is harmed when it goes wrong.",
  },
  {
    id: "s-06", n: "06", name: "Constraint acceptance",
    oneLine: "Building well on primitives you did not choose and would not have chosen, without spending two years litigating them.",
    who: "Every engineer outside the platform team. The most common reason a strong hire does not work out here.",
    rarity: "Rare",
    present: "They understand the constraint well enough to argue for it, treat the queue as a trade rather than an insult, and put their energy into the eighty percent that is genuinely theirs. When they do push back, it is once, in writing, with a customer problem attached.",
    absent: "Two years of quiet routing-around. Local caches, shadow tables, a helper library that is a second permission model wearing a modest name. Every step is defensible and the destination is the architecture we exist to avoid.",
    practised: "The boundary is made explicit and generous — teams may fork anything above the primitive layer without asking, which turns out to be most of what they wanted. Most disputes evaporate the moment someone realises how much is actually theirs. The interview screens for this directly, and it is better for everyone to fail there than in month nine.",
    tell: "Ask about a technical decision they disagreed with and had to build on anyway. Listen for whether they can still make the case for it.",
  },
  {
    id: "s-07", n: "07", name: "Reading the seam",
    oneLine: "Finding the specific administrative pain in a customer's week, rather than the feature gap in their stack.",
    who: "Sales, solutions, support, and every product manager who talks to customers.",
    rarity: "Teachable",
    present: "They ask what the customer did last Tuesday, not what they need. They find the person whose real job is being middleware, and they can name the exact sequence — export this, clean it, import there, reconcile on Friday. The demo is then one specific thing that stops happening.",
    absent: "Feature-gap selling. Comparing checklists, which is the specialist's home ground, and losing there. Or worse, pitching consolidation as a procurement benefit — which sounds like a discount and gets treated as one.",
    practised: "Nobody demos features. The standard motion is to change one field and let the room watch six systems move, because everyone in that room has personally lived the nine-day version. The pitch lands in about four seconds and there is nothing left to explain.",
    tell: "Listen for whether they ask about process or about requirements. Requirements questions get you a feature list. Process questions get you the seam.",
  },
  {
    id: "s-08", n: "08", name: "Expansion selling",
    oneLine: "Selling the second product into an account you already own — which is a different motion from net-new, not an easier version of it.",
    who: "The whole go-to-market organisation. Structurally, it is where the economics of the company live.",
    rarity: "Rare",
    present: "They know the account well enough to time it — that expansion follows a win, never a support escalation. They can say 'not yet' to a product the customer is not ready for, and they treat the existing relationship as the asset being protected rather than the leverage being spent.",
    absent: "Treating the installed base as a list to work. Bundling to hit a number, which produces attach rate without demand and quietly teaches the organisation that the bundle does the work so the product does not have to.",
    practised: "Expansion is measured on second-year retention of the expanded product, not on the quarter it closed. That single change in the compensation clock removes most of the incentive to push something a customer does not want, because a product that gets switched off in month four shows up in the number that pays.",
    tell: "Ask about an expansion they slowed down deliberately. If every expansion was a good idea at the time, they are working a list.",
  },
  {
    id: "s-09", n: "09", name: "Narrating the trough",
    oneLine: "Keeping a long-horizon bet legible to people who can only see the part of it that currently looks like failure.",
    who: "Anyone leading through the middle of a compound bet. Executives most, but not only.",
    rarity: "Very rare",
    present: "They show the model rather than the mood. They name what has to be true and by when, they say plainly which parts are claims and which are evidence, and they do not pretend the current numbers look good. Confidence lives in the specificity, not in the tone.",
    absent: "Reassurance. 'Trust me' is a resignation letter with a delay fuse, and your best engineer is the one who notices first — because the question they asked was correct and the answer was not.",
    practised: "Revenue, retention and margin by product line go to everyone monthly, with written commentary on each line. The commentary is the load-bearing half and it is the first thing to erode under time pressure. Numbers without context produce worse stories than no numbers at all.",
    tell: "Ask them to explain a period where the numbers looked bad. Strong answers include what they got wrong, in specifics, without being asked.",
  },
];

export const SKILL_NOTE =
  "These are skills, not values. A value is a statement about what a company admires; a skill is something a person can be observed doing, taught to do better, and hired for. The list is short because it is meant to be true rather than complete — a longer one would be a culture deck, and culture decks are where this kind of thinking goes to stop being useful.";
