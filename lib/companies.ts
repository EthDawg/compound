import { RIPPLING, WORKDAY } from "./vendors/skins";
import type { VendorSkin } from "./vendors/types";
import { TALENT_COMPANIES } from "./content/talent-companies";
import { SERVICENOW_STUDY } from "./content/servicenow-study";
import type { CompanyStrategy } from "./content/strategy-types";

export type CompanyId = "rippling" | "workday" | "pageup" | "elmo" | "employment-hero" | "servicenow";
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
      thesis: "The Workday study starts with a business process: who initiates a change, who can approve it, when it takes effect and what is recorded. Its wager: a configurable operating system can make complex organisations governable.",
      object: "Business process + organisation",
      question: "Who is authorised to move this change forward?",
      sequence: ["Initiate a business process", "Resolve roles and conditions", "Review the authorised steps", "Complete and retain the history"],
      premises: [
        { title: "The process is a first-class object", body: "Workday documents configurable process definitions, steps, conditions and notifications. Our demo organises attention around work awaiting a named review step." },
        { title: "Data access and action are distinct", body: "Workday distinguishes domain security from business process security. The study asks both what someone may see and what they may do with a change." },
        { title: "The platform extends outward", body: "Workday describes extensions and integrations built on its platform. The interpretation here treats connections to other systems as part of the design, with ownership that must remain visible." },
      ],
      choices: [
        { choice: "Make governance configurable", gain: "Different organisations can express their roles, conditions and approval sequences.", cost: "Someone must own the configuration. Unnecessary steps can turn control into delay." },
        { choice: "Route work through accountable roles", gain: "A pending change has an explicit reviewer and a reason for waiting.", cost: "An incorrect role assignment or unavailable reviewer can strand work. Escalation needs the same care as the happy path." },
        { choice: "Extend a governed core", gain: "Customers can adapt workflows and connect adjacent systems.", cost: "A successful core process does not prove every external action completed. Integration status needs separate evidence." },
      ],
      proof: [
        { metric: "Process age by step", test: "Measure where compensation and hiring requests wait, split by review role and exception type.", failure: "The organisation cannot explain why a request is stuck." },
        { metric: "Configuration maintainability", test: "Change a review rule, test affected cases and identify its accountable owner.", failure: "Routine changes depend on undocumented configuration knowledge." },
        { metric: "End-to-end completion", test: "Follow one approved hire through the core record and a connected provisioning system.", failure: "The process is marked complete while a downstream system is still waiting." },
      ],
      sources: [
        { title: "Workday · business process overview", url: "https://doc.workday.com/workday-education/en-us/course-manuals/financial-management-for-administrators/business-process-overview.html", supports: "Process definitions, steps, condition rules, notifications and administrative ownership." },
        { title: "Workday · configurable security framework", url: "https://doc.workday.com/workday-education/en-us/course-manuals/hcm-core-for-administrators/configurable-security-framework.html?toc=8", supports: "The distinction between domain security and business process security policies." },
        { title: "Workday · platform and product extensions", url: "https://www.workday.com/en-us/products/platform-product-extensions/overview.html", supports: "Extensions and integrations on Workday's platform." },
      ],
    },
  },
  ...TALENT_COMPANIES,
  SERVICENOW_STUDY,
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
