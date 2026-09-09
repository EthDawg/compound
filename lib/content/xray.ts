export type NoteKind = "premise" | "tradeoff" | "mechanism" | "heresy" | "cost";

export interface XNote {
  id: string;
  kind: NoteKind;
  title: string;
  body: string;
  aside?: string;
  ref?: { label: string; href: string };
}

export const KIND_META: Record<NoteKind, { label: string; hue: string }> = {
  premise: { label: "Design premise", hue: "signal" },
  mechanism: { label: "How it works", hue: "sky" },
  tradeoff: { label: "The trade", hue: "clay" },
  heresy: { label: "Against orthodoxy", hue: "moss" },
  cost: { label: "What it costs us", hue: "ink" },
};

export const XNOTES: Record<string, XNote> = {
  "nav-surface": {
    id: "nav-surface", kind: "heresy",
    title: "Yes, this navigation is absurd. That's the strategy.",
    body: "Every piece of conventional advice says pick one of these and be the best at it. We run all of them because a company does not experience HR, IT and Finance as separate problems — it experiences one person joining, moving, or leaving, and eleven vendors that each need to be told about it separately.",
    aside: "The nav is the most common objection in a first sales call and the most common relief in the second.",
    ref: { label: "Focus is a market discipline", href: "/backstage/manual/focus-is-a-market-discipline" },
  },
  "nav-divisions": {
    id: "nav-divisions", kind: "premise",
    title: "The groupings are for you, not for us",
    body: "HR, IT and Finance are labels on a menu. Underneath there is no separation — Devices reads the same employee record that Payroll writes to. The categories exist because that is how buyers' org charts are shaped, not because the software is shaped that way.",
    ref: { label: "The employee is the schema", href: "/backstage/manual/the-employee-is-the-schema" },
  },
  "topbar-search": {
    id: "topbar-search", kind: "mechanism",
    title: "One search across every domain",
    body: "Search returns people, devices, apps, transactions and workflows from one index, because they are all edges on one graph. In a best-of-breed stack this feature is not hard to build — it is impossible, because no single vendor can see the whole picture.",
  },
  "home-tasks": {
    id: "home-tasks", kind: "premise",
    title: "One queue, not five inboxes",
    body: "A payroll approval, a device compliance failure, an expense over policy and a new hire's access grant all land in the same list. They are unrelated in a conventional stack. Here they are the same kind of object — an action waiting on a human — so they queue together and get resolved in one sitting.",
    aside: "The measurable claim: administrative context-switching is the tax nobody puts on the invoice.",
  },
  "home-ripple": {
    id: "home-ripple", kind: "mechanism",
    title: "This is the whole demo",
    body: "Change one field on one person and watch what moves. We do not demo features. We change a dropdown and let the room watch six systems react, because everyone in that room has personally lived the nine-day version of this.",
    ref: { label: "The seams are the product", href: "/backstage/manual/the-seams-are-the-product" },
  },
  "people-table": {
    id: "people-table", kind: "premise",
    title: "Not a directory. The primary key of the company.",
    body: "This looks like an employee list because that is the honest interface for it. Structurally it is the object every other product in the nav reads from. Payroll has no employee table. Devices has no employee table. There is one, and this is it.",
    aside: "No product may keep a copy. That rule has cost us launch dates and it is the thing the company is built on.",
    ref: { label: "Decision D-001", href: "/backstage/decisions#D-001" },
  },
  "people-filters": {
    id: "people-filters", kind: "mechanism",
    title: "Filters cross domains because the data does",
    body: "You can filter by entity, worker type and country in the same query as device compliance and app access — not because we built a reporting integration, but because those are all attributes hanging off the same record.",
  },
  "emp-record": {
    id: "emp-record", kind: "premise",
    title: "Every field here is effective-dated",
    body: "Not just stored — stored with a validity window. You can ask what this person's department was on any past date, and payroll amendments, benefits reconciliation and audit responses all depend on that answer being cheap to get.",
    aside: "Nobody asked for this in 2017. Retrofitting it later is a rewrite, which is why we built it before there was a customer who needed it.",
    ref: { label: "Decision D-002", href: "/backstage/decisions#D-002" },
  },
  "emp-ripple": {
    id: "emp-ripple", kind: "mechanism",
    title: "Consequences, not follow-up tasks",
    body: "These are not automations we configured. They are what it means for the record to change. In a conventional stack each line here is a ticket, a person, and a few days of latency — and the one that gets missed is found by an auditor eight months later.",
    aside: "Count the systems. Then count the days it takes at your current company.",
    ref: { label: "The seams are the product", href: "/backstage/manual/the-seams-are-the-product" },
  },
  "emp-comp": {
    id: "emp-comp", kind: "tradeoff",
    title: "Compensation is a permissions problem before it is a data problem",
    body: "Who can see this depends on the viewer's relationship to this person, their entity, and their level — not on a role called Manager. Every product needs a model that can express that, and no product should invent its own. It lives in platform, and it is one of the reasons product pods can be six people.",
  },
  "emp-history": {
    id: "emp-history", kind: "mechanism",
    title: "Change and correction are different operations",
    body: "A promotion is a change: the old value was true, then stopped being true. A typo in a start date is a correction: the old value was never true. Treating them the same corrupts the audit trail, and you find out three years later when the answer to 'what was true in March' matters to somebody official.",
  },
  "hire-flow": {
    id: "hire-flow", kind: "premise",
    title: "One form, because there is one write",
    body: "Payroll enrollment, benefits eligibility, device shipping, app provisioning, card issuance, identity creation and jurisdiction-specific compliance all come from this single form. They are not seven integrations firing. They are seven products reading a row that now exists.",
    aside: "The competitor version of this screen is seven screens in seven products, owned by four people, over nine days.",
  },
  "hire-jurisdiction": {
    id: "hire-jurisdiction", kind: "premise",
    title: "The form will not let you create a violation",
    body: "Hiring into a state or country where the entity is not registered does not produce a warning that a person can click past. It opens the registration and blocks the hire until it clears. Compliance here is a constraint in the system, not a review step downstream of it.",
    ref: { label: "Compliance is infrastructure", href: "/backstage/manual/compliance-is-infrastructure" },
  },
  "payroll-entities": {
    id: "payroll-entities", kind: "mechanism",
    title: "Four entities, one engine",
    body: "US semi-monthly, Canadian, German and EOR runs are the same code path with different configuration. The moment 'what is different in Germany' becomes a conditional inside the product, you have started forking the company — twelve countries becomes twelve codebases and a combinatorial testing problem.",
    ref: { label: "Decision D-007", href: "/backstage/decisions#D-007" },
  },
  "payroll-variance": {
    id: "payroll-variance", kind: "mechanism",
    title: "Variance explained by the graph, not by a person",
    body: "The run knows why it differs from last period because it can see the hires, the terminations, the comp changes and their effective dates. A standalone payroll system can only tell you the number moved. Explaining it is a job somebody does in a spreadsheet on a Tuesday.",
  },
  "devices-fleet": {
    id: "devices-fleet", kind: "premise",
    title: "IT is not a different company from HR",
    body: "A laptop is an attribute of an employment relationship. Putting device management in the same system as the employment record means a termination locks the machine in the same transaction that computes the final paycheck — not in a checklist item that someone might reach on Thursday.",
  },
  "devices-compliance": {
    id: "devices-compliance", kind: "mechanism",
    title: "Conditional access needs both halves",
    body: "Blocking a non-compliant device from sensitive apps requires knowing device posture and app sensitivity and this person's role, all at once. Three vendors can each hold one third of that and none of them can act on it.",
  },
  "apps-provisioning": {
    id: "apps-provisioning", kind: "mechanism",
    title: "Access is derived, not granted",
    body: "Nobody maintains a list of who should have what. Access is a function of department, level, entity and employment status — so it is correct by construction and it changes the moment the inputs change. The exceptions are explicit, attributed, and reviewed.",
    aside: "The alternative is a quarterly access review where a manager approves 140 rows in four minutes, which is a compliance artifact rather than a control.",
  },
  "apps-waste": {
    id: "apps-waste", kind: "cost",
    title: "We can see the waste because we can see both sides",
    body: "Unused seats are visible because license assignment and actual employment status live in the same place. That is a finance outcome produced entirely by an IT-and-HR data decision, which is roughly the whole argument for the company in one row of a table.",
  },
  "spend-policy": {
    id: "spend-policy", kind: "mechanism",
    title: "Policy is read from the person, not attached to the card",
    body: "Limits, approval chains and category rules derive from level, department and entity. Move someone between departments and their spending authority changes in the same instant as their app access, because both are reading the same row.",
  },
  "spend-approval": {
    id: "spend-approval", kind: "premise",
    title: "The approval chain is not configured. It is computed.",
    body: "There is no maintained list of approvers. The chain is generated from the org graph at the moment of the request, so it is never stale — the classic failure of an expense tool that does not own the org chart is routing to someone who left in March.",
  },
  "workflows-engine": {
    id: "workflows-engine", kind: "premise",
    title: "Products contribute triggers and actions. They never own orchestration.",
    body: "One engine handles triggers, conditions, approvals, effective dates, retries and the audit trail. Every product plugs into it. If each product built its own automation layer, we would have nineteen half-good workflow engines and no way to write a rule that spans two of them.",
    ref: { label: "The platform tax", href: "/backstage/manual/the-platform-tax" },
  },
  "workflows-cross": {
    id: "workflows-cross", kind: "heresy",
    title: "The rules customers actually want are cross-domain",
    body: "Look at what these do: HR events firing IT actions firing Finance consequences. Every genuinely useful rule crosses a domain boundary — which is precisely the set of rules that is impossible to write in a best-of-breed stack, no matter how good each tool is.",
  },
  "graph-query": {
    id: "graph-query", kind: "premise",
    title: "This query is the thesis, executable",
    body: "Employment data joined to device posture joined to app entitlements joined to spend, filtered by entity, as of a date. Answering this across four vendors is a data-warehouse project with a quarter's lead time and a staleness problem. Here it is a read.",
    aside: "When someone asks what the platform is actually for, this screen is the answer.",
  },
  "graph-asof": {
    id: "graph-asof", kind: "mechanism",
    title: "As-of is the field that costs the most and shows the least",
    body: "Every fact carries a validity window, so any query can be asked about any past date. Four engineer-months in 2017 for a feature with no customer demand. It is now load-bearing for payroll amendments, benefits reconciliation, equity and every audit conversation we have.",
    ref: { label: "Decision D-002", href: "/backstage/decisions#D-002" },
  },
};

export const NOTE_IDS = Object.keys(XNOTES);
