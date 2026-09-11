import { RIPPLING, WORKDAY } from "./vendors/skins";
import type { VendorSkin } from "./vendors/types";
import { TALENT_COMPANIES } from "./content/talent-companies";
import { SERVICENOW_STUDY } from "./content/servicenow-study";
import { AI_COMPANIES } from "./content/ai-companies";
import type { CompanyStrategy } from "./content/strategy-types";

export type CompanyId = "rippling" | "workday" | "pageup" | "elmo" | "employment-hero" | "servicenow" | "anthropic" | "openai" | "elevenlabs";
export type StudySurface = "app" | "backstage";
export const BACKSTAGE_SECTIONS = [
  { id: "", label: "Overview" },
  { id: "model", label: "Operating model" },
  { id: "tradeoffs", label: "Choices & trade-offs" },
  { id: "proof", label: "What would prove it" },
  { id: "sources", label: "Sources & framing" },
] as const;

export interface CompanyStudy {
  id: CompanyId;
  name: string;
  archetype: string;
  skin: VendorSkin;
  brand: { chrome: string; ink: string; highlight: string };
  appScreens: readonly string[];
  ecosystem?: { href: string; label: string };
  workflowScreen?: string;
  strategy?: CompanyStrategy;
  backstage: {
    navigation: { label: string; sections: readonly { id: string; label: string }[] }[];
    headline: string;
    thesis: string;
    object: string;
    question: string;
    sequence: string[];
    premises: { title: string; body: string; screen?: string }[];
    choices: { choice: string; gain: string; cost: string }[];
    proof: { metric: string; test: string; failure: string }[];
    sourcesChecked?: string;
    changes?: { date: string; title: string; fact: string; implication: string; url: string }[];
    sources: { title: string; url: string; supports: string }[];
  };
}

export const COMPANIES: CompanyStudy[] = [
  {
    id: "rippling", name: "Rippling", archetype: "Compound platform", skin: RIPPLING,
    brand: { chrome: "#40212D", ink: "#FFFFFF", highlight: "#F9D34F" },
    appScreens: ["", "people", "hire", "payroll", "devices", "apps", "spend", "workflows", "graph", "benefits", "time", "learning", "identity", "security", "expenses", "bills", "planning", "reports", "entities"],
    backstage: {
      navigation: [
        { label: "The compound company", sections: [
          { id: "", label: "The company thesis" },
          { id: "manual", label: "The operating manual" },
          { id: "ask", label: "Ask the founder" },
          { id: "skills", label: "How it out-executes" },
          { id: "metrics", label: "What we measure" },
          { id: "org", label: "How it's organised" },
          { id: "trajectory", label: "Growth from here" },
          { id: "agentic", label: "The agentic turn" },
          { id: "decisions", label: "Decision log" },
          { id: "heresies", label: "Heresies" },
          { id: "timeline", label: "Nine years" },
        ] },
        { label: "Compare the model", sections: BACKSTAGE_SECTIONS.filter(s => s.id !== "") },
      ],
      headline: "One change. Every consequence.",
      thesis: "The Rippling study starts with the employee and follows the consequences across HR, IT and Finance. Its wager: owning the connections between products can be more valuable than optimising each product separately.",
      object: "Employee + relationships",
      question: "What else must change when this person changes?",
      sequence: ["Change the employee record", "Re-evaluate shared policies", "Route exceptions to a person", "Apply changes across products"],
      premises: [
        { title: "The shared record is the foundation", body: "Rippling describes products built around a common source of employee-related business data. In this study, one employee identity joins payroll, devices, application access and spending." },
        { title: "Policies travel with the person", body: "Rippling's permission profiles can use attributes such as department and level. The demo makes that idea visible: moving a person changes the rules that apply to them." },
        { title: "The queue crosses departments", body: "Our interface interpretation puts pay, devices and hiring in one queue. The same person can create work in several functions; the screen keeps those consequences together." },
      ],
      choices: [
        { choice: "Share primitives across products", gain: "A new product can reuse identity, permissions and workflow concepts.", cost: "A change to a shared primitive can affect many products. Platform coordination becomes a product responsibility." },
        { choice: "Automate from employee attributes", gain: "Routine changes can propagate with fewer manual handoffs.", cost: "A wrong source attribute can spread its consequences. Effective dates, exception handling and reversibility need explicit design." },
        { choice: "Expand across the customer's functions", gain: "There are more opportunities to remove work between tools.", cost: "Breadth creates a depth obligation. A specialised team may still prefer a dedicated product." },
      ],
      proof: [
        { metric: "Time from change to completion", test: "Run the same department transfer through HR, access and spend. Count elapsed time and human touches.", failure: "The shared platform still needs a reconciliation spreadsheet." },
        { metric: "Marginal effort for the next product", test: "Track how much identity, permission and reporting work a new product reuses.", failure: "Every product rebuilds the same foundations behind a common login." },
        { metric: "Exception containment", test: "Introduce a wrong effective date in a safe test and trace detection, approval and recovery.", failure: "An error propagates faster than anyone can understand or reverse it." },
      ],
      sources: [
        { title: "Rippling · permissions and approvals", url: "https://www.rippling.com/platform/permissions", supports: "Attribute-based permission profiles, approval routing and the shared-data platform premise." },
      ],
    },
  },
  {
    id: "workday", name: "Workday", archetype: "Enterprise suite", skin: WORKDAY,
    ecosystem: { href: "/atlas/workday", label: "Partner network" },
    brand: { chrome: "#0755A5", ink: "#FFFFFF", highlight: "#FFB23F" },
    appScreens: ["", "processes", "people", "reporting", "talent", "compensation", "planning", "financials", "absence", "learning"],
    backstage: {
      navigation: [{ label: "The company", sections: BACKSTAGE_SECTIONS }],
      headline: "Every change has a process.",
      thesis: "Workday’s advantage is the business context around a transaction: the person, organisation, authorised role and effective date. Sana changes how someone enters that system. The harder promise is that a simpler request can still produce a governed, explainable result across the systems that finish the work.",
      object: "Business process + organisation",
      question: "Who is authorised to move this change forward?",
      sequence: ["Inspect the request and its effective date", "Resolve the review roles and conditions", "Approve or return the proposed change", "Track the effective record and downstream receipt"],
      premises: [
        { title: "Context decides who can act", body: "Workday’s process framework joins definitions, security and organisation. In the scene, an 8% proposal needs another review role; a revised 4% proposal does not. The configurable condition matters more than the number of approval buttons.", screen: "processes" },
        { title: "Approved is not yet effective", body: "The proposed change, its approval and the worker’s effective record are different facts. Move the scenario date forward: an unapproved request still changes nothing, while an approved future change becomes effective. An external payroll receipt remains separate.", screen: "compensation" },
        { title: "The new front door still needs the core", body: "Sana from Workday launched in March 2026 with conversational access and agents grounded in Workday’s controls. Our interpretation: the strategic asset is less the familiar menu than the trusted context behind an action. The scripted home screen leads back to that process.", screen: "" },
      ],
      choices: [
        { choice: "Make governance configurable", gain: "Different organisations can express their roles, conditions and approval sequences.", cost: "Someone must own the configuration. Unnecessary steps can turn control into delay." },
        { choice: "Route work through accountable roles", gain: "A pending change has an explicit reviewer and a reason for waiting.", cost: "An incorrect role assignment or unavailable reviewer can strand work. Escalation needs the same care as the happy path." },
        { choice: "Put a conversational interface over the governed core", gain: "People can start with an intent rather than knowing the correct menu and business process.", cost: "A confident answer can conceal the wrong record, date or authority. The interface must expose its basis and the outstanding action; a successful core process does not prove every external action completed." },
      ],
      proof: [
        { metric: "Process age by step", test: "Measure where compensation and hiring requests wait, split by review role and exception type.", failure: "The organisation cannot explain why a request is stuck." },
        { metric: "Configuration maintainability", test: "Change a review rule, test affected cases and identify its accountable owner.", failure: "Routine changes depend on undocumented configuration knowledge." },
        { metric: "End-to-end completion", test: "Follow one compensation change through approval, its effective date and the external payroll acknowledgement. Introduce a mapping failure and inspect recovery.", failure: "A summary reports success while the provider still has the old value." },
      ],
      sourcesChecked: "11 September 2026",
      changes: [
        { date: "August 2018", title: "Adaptive brought the planning engine", fact: "Workday completed the Adaptive Insights acquisition on 1 August 2018, adding its business planning platform.", implication: "Planning has its own product lineage. A plan, an approved position and an effective worker transaction remain different objects to connect.", url: "https://newsroom.workday.com/2018-08-01-Workday-Completes-Acquisition-of-Adaptive-Insights" },
        { date: "November 2025", title: "Sana brought a different interface and team", fact: "Workday completed the Sana acquisition on 4 November 2025. The announced combination covered enterprise search, agents and learning.", implication: "This broadens the ambition beyond making existing forms easier. The question is whether work can start in Workday even when the knowledge and actions span other applications.", url: "https://newsroom.workday.com/2025-11-04-Workday-Completes-Acquisition-of-Sana" },
        { date: "February 2026", title: "The founder returned for the AI chapter", fact: "Workday announced Aneel Bhusri’s return as CEO on 9 February; Carl Eschenbach stepped down after its expansion and operating-scale phase.", implication: "The leadership change makes product reinvention explicit. It is a direction signal, not evidence that customers’ configuration and integration work has disappeared.", url: "https://newsroom.workday.com/2026-02-09-Workday-Announces-CEO-Transition-as-Co-Founder-Aneel-Bhusri-Returns-to-Lead-the-Companys-Next-Chapter" },
        { date: "March 2026", title: "Sana moved from acquisition thesis to available product", fact: "On 17 March, Workday announced availability of Sana for Workday, the Sana Self-Service Agent and Sana Enterprise. Its launch positioned Joel Hellermark as SVP and general manager of AI.", implication: "The acquired team now sits inside the product direction. Test a real workflow’s permissions, effective dates and receipts; a conversational front end is not proof of end-to-end completion.", url: "https://newsroom.workday.com/2026-03-17-Introducing-Sana-from-Workday-Superintelligence-for-Work-That-Finds-Answers,-Takes-Action,-and-Automates-Workflows" },
      ],
      sources: [
        { title: "Workday · request compensation change", url: "https://doc.workday.com/workday-education/en-us/course-manuals/compensation-for-administrators/request-compensation-change.html?toc=11", supports: "Compensation events, current versus edited compensation, business-process security and effective dates. The scenario does not claim to calculate eligibility, tax or a pay run." },
        { title: "Workday · business process framework", url: "https://www.workday.com/content/dam/web/en-us/documents/datasheets/workday-business-process-framework.pdf", supports: "How process definitions, condition rules, security and organisational context work together. The study’s salary threshold, roles and provider failure are fictional configuration." },
        { title: "Workday · Sana launch, 17 March 2026", url: "https://newsroom.workday.com/2026-03-17-Introducing-Sana-from-Workday-Superintelligence-for-Work-That-Finds-Answers,-Takes-Action,-and-Automates-Workflows", supports: "Announced availability, product distinctions, existing permission and audit framework, and Joel Hellermark’s role. The home-screen exchange is our scripted interpretation, not a replica or live assistant." },
        { title: "Workday · business process overview", url: "https://doc.workday.com/workday-education/en-us/course-manuals/financial-management-for-administrators/business-process-overview.html", supports: "Process definitions, steps, condition rules, notifications and administrative ownership." },
        { title: "Workday · configurable security framework", url: "https://doc.workday.com/workday-education/en-us/course-manuals/hcm-core-for-administrators/configurable-security-framework.html?toc=8", supports: "The distinction between domain security and business process security policies." },
        { title: "Workday · platform and product extensions", url: "https://www.workday.com/en-us/products/platform-product-extensions/overview.html", supports: "Extensions and integrations on Workday's platform." },
      ],
    },
  },
  ...TALENT_COMPANIES,
  SERVICENOW_STUDY,
  ...AI_COMPANIES,
];

export const companyStudy = (id: string) => COMPANIES.find((c) => c.id === id);
export const companyHref = (id: string, surface: StudySurface, section = "") =>
  `/companies/${id}/${surface}${section ? `/${section}` : ""}`;

/** Keep the comparison topic when both companies have it; otherwise land at that view's overview. */
export function switchCompanyHref(id: CompanyId, pathname: string) {
  const company = companyStudy(id)!;
  const [, , , surface, ...segments] = pathname.split("/");
  const section = segments.join("/");
  if (surface === "backstage") {
    const shared = company.backstage.navigation.some(g => g.sections.some(s => s.id === section));
    return companyHref(id, "backstage", shared ? section : "");
  }
  return companyHref(id, "app", company.appScreens.includes(section) ? section : "");
}
