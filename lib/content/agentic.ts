export interface Requirement {
  id: string; n: string; name: string; what: string;
  pointSolution: string; compound: string; status: "Shipped" | "Partial" | "Open problem";
}

export const AGENT_REQUIREMENTS: Requirement[] = [
  {
    id: "r-01", n: "01", name: "A live model of what is true now",
    what: "The agent must reason about the same object the action will be applied to. Not a snapshot, not a nightly export, not an index computed on Tuesday.",
    pointSolution: "Owns one domain accurately and everything else through a sync with a delay. Confidently answers questions about data it does not own.",
    compound: "Reads the record directly. There is no second copy to be stale, because there was never a second copy.",
    status: "Shipped",
  },
  {
    id: "r-02", n: "02", name: "Permission enforced at the read",
    what: "Not 'can this user see this document' but 'can this user see this field, of this person, as of this date, given their span of control and entity'. That is a query, not metadata on a chunk.",
    pointSolution: "Typically flattens permissions into the index at write time, which means the boundary is only as current as the last reindex — and is invisible when wrong.",
    compound: "The agent runs through the same permission model as a human read. A question it is not entitled to answer returns a refusal, not a redacted guess.",
    status: "Shipped",
  },
  {
    id: "r-03", n: "03", name: "Writes through the front door",
    what: "An agent write must carry the same approval chain, effective dating, actor attribution and audit trail as a human write. Anything else creates changes nobody can reconstruct.",
    pointSolution: "Usually an API call with a service account, which appears in the audit log as the integration rather than as the decision.",
    compound: "The agent is an actor in the same system. Its writes route through the same chains and appear in the same history, attributed to it and to the human who asked.",
    status: "Shipped",
  },
  {
    id: "r-04", n: "04", name: "Reversibility classified in the system",
    what: "Revoking access is annoying and reversible. Running payroll is not. An agent that treats those identically is a hazard, and the classification cannot live in a prompt.",
    pointSolution: "Rarely modelled at all, because a single-domain product has a narrow enough action space to hand-wave it.",
    compound: "Every action type carries a reversibility class. Irreversible actions require a human in the loop by construction, not by policy.",
    status: "Shipped",
  },
  {
    id: "r-05", n: "05", name: "Effective-dated retrieval",
    what: "An agent asked about March must resolve against March. Retrieval systems are built around similarity, not validity windows, and the two do not compose cleanly.",
    pointSolution: "Not attempted. Most systems have no concept of what was true on a past date, so the question cannot be posed.",
    compound: "Solved for direct queries. Not yet solved for retrieval over unstructured content, which is the open problem.",
    status: "Open problem",
  },
  {
    id: "r-06", n: "06", name: "Record accuracy as an SLO",
    what: "When humans read the record, a stale field is an annoyance. When it is the substrate for autonomous action, it is an incident whose blast radius scales with how much you have automated.",
    pointSolution: "Data quality is an operations concern, owned by the customer, surfaced as a report nobody reads.",
    compound: "Measured, alerted and owned by a named team, the way uptime is. This is new, and it is a direct consequence of agents.",
    status: "Partial",
  },
];

export interface ActionClass {
  klass: string; tone: "good" | "warn" | "bad"; rule: string; examples: string[];
}

export const ACTION_CLASSES: ActionClass[] = [
  {
    klass: "Reversible — agent acts",
    tone: "good",
    rule: "The agent completes the action and reports it. A human can undo it in one step with no external consequence.",
    examples: ["Grant or revoke an app entitlement", "Reassign a device", "Update a directory field", "Open a compliance task", "Reclassify a transaction's GL code"],
  },
  {
    klass: "Reversible with cost — agent proposes",
    tone: "warn",
    rule: "The agent stages the full change with its downstream effects listed, and a human approves. Undo is possible but visible to someone outside the company.",
    examples: ["Change a department or manager", "Adjust a spend limit", "Alter a benefits election inside the window", "Modify an approval chain"],
  },
  {
    klass: "Irreversible — human decides, agent prepares",
    tone: "bad",
    rule: "The agent may assemble everything and explain it. It may not execute. This is enforced by the system, not by a prompt or a policy document.",
    examples: ["Run payroll", "Terminate employment", "File a tax registration or amendment", "Execute an equity transaction", "Send a legally operative notice"],
  },
];

export interface AgentDemo {
  q: string; allowed: boolean; asker: string; reasoning: string[]; answer: string; domains: string[];
}

export const AGENT_DEMOS: AgentDemo[] = [
  {
    q: "Who has access to systems holding customer data but hasn't completed the security training?",
    asker: "Iris Kowalski · Head of IT",
    allowed: true,
    domains: ["Apps", "Learning", "People"],
    reasoning: [
      "Resolve apps classified High data risk → 9 applications",
      "Resolve current entitlements to those apps → 118 people",
      "Join to training completion, filtered to the current cycle",
      "Check asker's permission: IT owner, company-wide scope on access data → allowed",
    ],
    answer: "Seven people. Four are in Engineering and three joined in the last thirty days — their training window is still open, so only four are genuinely out of policy. I can assign the training and restrict their access to those apps until it clears. Both actions are reversible, so say the word.",
  },
  {
    q: "What does it cost us, fully loaded, to add a senior engineer in Berlin versus Toronto?",
    asker: "Yuki Tanabe · CFO",
    allowed: true,
    domains: ["People", "Payroll", "Benefits", "Entities"],
    reasoning: [
      "Resolve comp bands for IC5 Engineering in DE and CA entities",
      "Apply statutory employer loading from the country layer → DE 1.42, CA 1.24",
      "Add benefits cost at the plan actually available in each jurisdiction",
      "Check asker's permission: CFO, comp visibility across all entities → allowed",
    ],
    answer: "Berlin is roughly 14% more expensive fully loaded, almost entirely statutory contribution rather than base. Toronto is cheaper on paper and slower to hire — median time to fill has been 41 days against 28 in Berlin. I can show the working, and I have not applied any geo differential because that is flagged for review rather than automatic.",
  },
  {
    q: "Show me the compensation for everyone in the Hardware org.",
    asker: "Grigor Petrov · VP Operations",
    allowed: false,
    domains: ["People", "Payroll"],
    reasoning: [
      "Resolve requested scope → Hardware department, 62 people",
      "Resolve asker's span of control → Operations, 38 people, no overlap with Hardware",
      "Check field-level permission on compensation → visible only within own reporting line",
      "Permission check fails → refuse, do not partially answer",
    ],
    answer: "I can't see compensation outside your reporting line, so I can't answer this — and I'd rather say that than give you a partial answer that looks complete. I can show you Hardware headcount, open roles and budget consumption, which are in your scope. If you need the comp view, Sofia Marchetti can grant it and the request takes about a minute.",
  },
];

export const AGENT_INVERSION = {
  before: {
    label: "The argument for nine years",
    body: "Having everything in one place saves your team time. It is a convenience argument, and it competes against a customer's willingness to tolerate friction — which is high, because they have tolerated it for a decade.",
  },
  after: {
    label: "The argument now",
    body: "Having everything in one place is what makes autonomous action possible at all. It is a capability argument, and it competes against nothing, because the alternative does not do the thing.",
  },
};
