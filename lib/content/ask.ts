export interface QA {
  id: string; q: string; a: string[]; tag: string; heat: 1 | 2 | 3;
}

export const QA_ITEMS: QA[] = [
  {
    id: "q-01", tag: "Strategy", heat: 3,
    q: "Isn't this just the conglomerate strategy that failed everywhere else?",
    a: [
      "It is a fair comparison and it fails on one specific point. A conglomerate owns businesses that share a balance sheet and nothing else. There is no operating leverage between an airline and a cereal brand — the only synergy is financial, which is why the market eventually prices them at a discount and breaks them up.",
      "Our products share a database row. Not a theme, not a sector — the literal same record. When you change someone's department, six products change because they were reading the same object, not because a sync job told them to. That is operating leverage in the only form that actually exists in software.",
      "The test I would apply to anyone claiming this, including us: does product N ship faster than product N-1? A conglomerate's fifth acquisition is not cheaper than its fourth. Our ninth product took eleven weeks against nineteen months for our first. If that curve ever flattens, the comparison becomes fair and you should make it loudly.",
    ],
  },
  {
    id: "q-02", tag: "Strategy", heat: 3,
    q: "How do you know you're not just unfocused and telling yourself a story?",
    a: [
      "I do not know it with certainty, and anyone who claims certainty here is telling you about their personality rather than their evidence. From the outside, for about three years, the two are indistinguishable.",
      "What I have instead is a metric I committed to before I needed it — time to first customer per product line — and a promise that I will not quietly retire it when it is inconvenient. If that curve flattens for eighteen months, we are not compounding, and I have said in writing that I will say so.",
      "That is a weaker answer than you wanted. It is the honest one. Conviction is not evidence, and I have been completely certain and completely wrong before. The feeling was identical.",
    ],
  },
  {
    id: "q-03", tag: "Product", heat: 2,
    q: "Your individual products are worse than the specialists. Doesn't that catch up with you?",
    a: [
      "Some of them are worse, yes. I will say that in a sales call and I would rather say it than have a customer discover it in month three.",
      "The bet is that the customer is trading depth for the disappearance of the space between tools, and that the trade gets better every year — seam cost grows with headcount while depth advantage stays roughly flat once a category is mature. A competitor's forty-first reporting dimension is not worth the afternoon you spend reconciling two systems that disagree about who someone's manager is.",
      "Where it catches up with us is customers who live inside one function all day. A recruiting agency should buy the best applicant tracking system in the world. We lose those and we should. A strategy without edges is not a strategy.",
    ],
  },
  {
    id: "q-04", tag: "Org", heat: 2,
    q: "My team is blocked on platform. Why can't we just build it ourselves and migrate later?",
    a: [
      "Because it has never once been migrated later. Not here, not at any company any of us came from. I have approved that exact request twice and neither one migrated — both became permanent second sources of truth with reconciliation logic that outlived the people who wrote it.",
      "Your local argument is correct. The date is real, the platform queue is real, and building it yourself is genuinely the faster path for your team this quarter. I am not disputing any of that. I am saying the sum of locally correct decisions is how we become the thing we were built to replace, except our seams would be internal, which is worse — at least the customer could see the old ones.",
      "What I owe you in exchange: platform lead time is my metric, not yours. If you are blocked for more than a month, that is a staffing failure on my side and it goes on my list. Escalate it as mine.",
    ],
  },
  {
    id: "q-05", tag: "Capital", heat: 2,
    q: "Why raise so much? Doesn't that just set an expectation you have to grow into?",
    a: [
      "It does, and that is a real cost I am choosing to pay.",
      "The alternative is worse. This strategy has a trough — several years where you are funding a platform whose value is that it makes products five through twenty cheap, while you only have two products. If you plan to raise during that, you are planning to raise at the exact moment your numbers look their worst. Nobody funds the bottom of a J-curve on a story.",
      "So you raise before you enter it, larger than the plan needs, and you say out loud what it funds rather than dressing it up as growth capital. Investors who cannot hold that model are not the wrong people, they are the wrong people for this. Find that out early.",
    ],
  },
  {
    id: "q-06", tag: "Culture", heat: 1,
    q: "Why so much writing? It slows everything down.",
    a: [
      "It does slow things down, on any given day. The conversation is genuinely the better local choice almost every time, which is exactly why the requirement has to be structural rather than left to judgement.",
      "With twenty product teams on shared infrastructure, the number of pairs who need to stay aligned grows with the square of the team count. There is no meeting schedule that fixes a quadratic. Writing is the only mechanism that scales, because a written decision is discoverable by anyone, at any time, without the author present.",
      "The part that actually matters is the rejected alternative. Anyone can see what we chose by reading the code. Only the log says what we chose against and why, and that is what stops the same argument recurring every nine months when someone new arrives with a good idea we already tried.",
    ],
  },
  {
    id: "q-07", tag: "Product", heat: 3,
    q: "You killed a product with a ninety percent attach rate. Wasn't that an overreaction?",
    a: [
      "No, and it is the decision I am most confident about, which is unusual for a write-off of eleven months.",
      "Attach rate on a bundled product measures our packaging. Week-three usage was close to zero. It consumed engineering, carried support load, polluted our usage data, and — worst — it taught the sales team that the bundle does the work so the product does not have to. That last one was the real cost and it would have compounded.",
      "Two people left over it and I understood why. What came out of it is the question we now ask before any product ships: would this customer pay for it standalone, from us, at this price? If the honest answer is no, we fix it or we kill it. We do not report the attach rate and call it a win.",
    ],
  },
  {
    id: "q-08", tag: "Compliance", heat: 2,
    q: "Doesn't encoding compliance in the system make you rigid and slow?",
    a: [
      "Yes. It is measurably slower to build a regulated feature this way and I am not going to pretend otherwise.",
      "The alternative is a review function, which is a group of people catching things at volume, forever, under deadline pressure, in a system generating new opportunities to be wrong faster than anyone can review. That has a hit rate below one and the misses are silent until something forces an accounting.",
      "The rigidity criticism has a real version though, and I take it seriously. If you encode rules so hard that the product cannot express a legitimate edge case, people leave your system entirely and go to a spreadsheet — and then you have neither compliance nor data. So the rule is narrower than it sounds: encode the constraint, always provide a documented exception path, and make that path leave a record. The goal is not that nothing unusual can happen. It is that nothing unusual happens invisibly.",
    ],
  },
  {
    id: "q-09", tag: "Strategy", heat: 3,
    q: "What would make you abandon this?",
    a: [
      "Time to first customer flattening across three consecutive product lines with no explanation in scope. That would mean the platform is not producing leverage and we are simply spending more than a focused company for the same output.",
      "Or: multi-product customers churning at the same rate as single-product ones. The retention gap is the quiet half of the thesis and if it closed, the model would be a much thinner version of itself.",
      "Or the one I think about most — if I found that we were winning deals primarily on consolidation and price rather than on the products being wanted. That would mean we had built a procurement convenience, and procurement conveniences get unbundled by the next generation.",
    ],
  },
  {
    id: "q-10", tag: "Org", heat: 1,
    q: "Why cap teams at eight? We could move faster with more people.",
    a: [
      "A team of six that owns a whole product outperforms a team of twenty that owns a slice of one, and it is not a cost argument. It is latency. Six people can hold the entire product in their heads — every complaint, every edge case, every ugly compromise. Nobody has to be told what matters.",
      "Past about ten you get specialization, then coordination overhead, then someone whose job is translation, and the loop from customer pain to shipped fix gets a week longer with every layer.",
      "The cap is a heuristic and I will argue about the exact number. The response when a team outgrows it is to split the product, not to grow the team — and splitting is genuinely disruptive, so people resist it. Fair enough. It is still right.",
    ],
  },
  {
    id: "q-11", tag: "Product", heat: 2,
    q: "Why not just acquire your way to the product surface?",
    a: [
      "Because you cannot acquire your way into one employee table.",
      "You can buy five companies, put a single login in front and a shared nav bar on top, and it will demo beautifully. The customer finds out within a quarter — they change someone's department and it still takes five clicks in five places, because underneath there are still five employee tables and a sync job between them.",
      "The unification has to be structural. And once you have decided that, the acquisition math changes completely: you are not buying a product, you are buying a team and a customer list and then rewriting the product onto your primitives. Sometimes that is worth it. It is rarely worth what the seller thinks it is.",
    ],
  },
  {
    id: "q-12", tag: "Personal", heat: 3,
    q: "What did the last company teach you?",
    a: [
      "That if a system makes a violation possible, the violation eventually occurs, and the interval is a function of volume rather than of anyone's intent. It is a matter of public record and I am not going to relitigate the details here.",
      "The lesson people expect me to give is 'be more careful.' That is not a lesson, it is a wish. Careful degrades under pressure, at scale, at six in the evening on the last day of a quarter, when the person with the context is on leave.",
      "The real lesson is architectural and it is why compliance sits where it does here. You do not want a team that catches it. You want a form that will not let you type it. Everything else is hoping, and hoping has a failure rate you can calculate.",
    ],
  },
  {
    id: "q-13", tag: "Culture", heat: 2,
    q: "Isn't publishing revenue by product line just going to make people anxious in bad quarters?",
    a: [
      "Yes. It does, reliably, and telling people not to be anxious has never worked in the history of management.",
      "What works is that context arrives with the data rather than a week later. Every number carries written commentary explaining what we are doing about it. The anxiety in an opaque company is not lower, it is just less specific — and unspecific anxiety is worse because people fill the vacuum with stories that are consistently worse than the truth.",
      "There is a genuine exception and I do not want to be glib about it. In a live legal or transactional situation, partial information does real harm. Those moments exist. But they are rare, and the instinct to classify an ordinary bad quarter as one of them is very strong and almost always wrong.",
    ],
  },
  {
    id: "q-14", tag: "Strategy", heat: 2,
    q: "Should my company do this?",
    a: [
      "Probably not, and I say that to most people who ask.",
      "Four preconditions, all required. A literally shared record, not a shared theme. The same human buyer with the same budget and signature. The same go-to-market pipe. And a market big enough that a large fixed platform investment amortizes. Miss one and the model does not partially work — it inverts. You carry all the cost and get none of the leverage, which is strictly worse than having built one good thing.",
      "And the sequencing point, which is the one people skip: do not start compound. You cannot know what to abstract before you have built something twice. Get one product genuinely working, then build the second and extract what you find yourself rebuilding. The platform is discovered, not designed. Anyone who says they designed theirs up front is remembering it with hindsight.",
    ],
  },
];
