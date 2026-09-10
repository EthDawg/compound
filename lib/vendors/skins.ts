import type { VendorSkin } from "./types";

// Design studies, not reproductions. Each skin expresses the interface argument a
// position makes — density, colour, hierarchy, what gets a whole screen — without
// using anyone's logo, wordmark or actual product design.

export const WORKDAY: VendorSkin = {
  id: "workday",
  name: "Enterprise suite",
  studyOf: "the enterprise-suite pattern, as most publicly associated with Workday",
  bet: "Own the enterprise system of record and defend it from above.",
  ethos:
    "The interface argues that the company is an org chart with reporting on top. You start at a dashboard of tiles rather than a task, because the assumption is an administrator who came here to run something, not an employee who came here to do one thing. Squarer corners, cooler palette, more chrome — the visual language of governance.",
  href: "/instance/workday",
  depth: "Home screen",
  theme: {
    bg: "#EEF2F6", surface: "#FFFFFF", surfaceAlt: "#F7F9FB", border: "#D3DCE4",
    ink: "#1F2D3D", inkMuted: "#5A6B7C", inkFaint: "#8FA0B0",
    accent: "#0A63C9", accentInk: "#FFFFFF", accentSoft: "#E3EEFB",
    radius: "4px", radiusSm: "3px",
    font: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    chrome: "topbar", density: "roomy",
  },
  nav: [
    { items: [{ label: "Home", on: true }, { label: "Reporting" }, { label: "Talent" }, { label: "Compensation" }, { label: "Workforce Planning" }, { label: "Financials" }] },
  ],
  greeting: { eyebrow: "Meridian Optics · Global", title: "Good morning", sub: "6 items require your attention across 4 business processes." },
  home: [
    { t: "worklets", title: "Your worklets", items: [
      { label: "Business Processes", count: "6" }, { label: "My Team" , count: "12" }, { label: "Reporting", count: "" },
      { label: "Compensation", count: "3" }, { label: "Requisitions", count: "8" }, { label: "Org Studio", count: "" },
      { label: "Absence", count: "" }, { label: "Learning", count: "2" },
    ]},
    { t: "stats", items: [
      { label: "Headcount", value: "344", sub: "+11 this period" },
      { label: "Open requisitions", value: "8", sub: "3 past target date", tone: "warn" },
      { label: "Span of control", value: "6.4", sub: "org average" },
      { label: "Annualised cost", value: "$61.2M", sub: "fully loaded" },
    ]},
    { t: "table", title: "Awaiting your approval", sub: "Business processes routed to you", cols: ["Process", "Subject", "Step", "Days"], rows: [
      ["Request Compensation Change", "Fatima Al-Rashid", "Manager Review", "2"],
      ["Create Position", "Engineering · Platform", "Compensation Partner", "4"],
      ["Terminate Employee", "Hugo Lindgren", "HR Partner", "1"],
      ["Request Absence", "Juliette Moreau", "Manager Review", "6"],
    ]},
    { t: "callout", label: "What this interface assumes",
      body: "That you are an administrator with a configured workspace, and that the unit of work is a business process moving through named approval steps. It is extremely powerful and it presumes somebody was trained. That presumption is the moat and the ceiling at the same time." },
  ],
  xray: [
    { title: "The dashboard is the thesis", body: "Starting on a grid of tiles rather than a task says the product expects a specialist. Everything follows from that: configurability over defaults, governance over speed, and an implementation project rather than a signup." },
    { title: "Squarer corners are not an accident", body: "Enterprise software signals seriousness through restraint. The visual language is deliberately closer to a records system than to a consumer app, because the buyer is purchasing auditability." },
  ],
};

export const DEEL: VendorSkin = {
  id: "deel",
  name: "Global employment",
  studyOf: "the cross-border employment pattern, as most publicly associated with Deel",
  bet: "Own the employment relationship across borders first, then compound inward.",
  ethos:
    "The interface argues that the primary object is a country, not a person. You land on a map of where you employ people and under what legal structure, because that is the thing the buyer came here unable to do. Warmer, rounder, more approachable than the enterprise suites — it is sold to a founder or a people lead, not to an HRIS administrator.",
  href: "/instance/deel",
  depth: "Home screen",
  theme: {
    bg: "#FAF9F6", surface: "#FFFFFF", surfaceAlt: "#F5F3EE", border: "#E4E0D8",
    ink: "#1A1A1A", inkMuted: "#6B6862", inkFaint: "#9A968E",
    accent: "#12A87A", accentInk: "#FFFFFF", accentSoft: "#E6F6F0",
    radius: "12px", radiusSm: "8px",
    font: 'ui-sans-serif, -apple-system, "Segoe UI", sans-serif',
    chrome: "sidebar", density: "roomy",
  },
  nav: [
    { group: "Workforce", items: [{ label: "People", on: true }, { label: "Hiring" }, { label: "Contracts" }] },
    { group: "Global", items: [{ label: "Entities", badge: "6" }, { label: "EOR" }, { label: "Contractors", badge: "16" }, { label: "Immigration" }] },
    { group: "Money", items: [{ label: "Payroll" }, { label: "Invoices" }, { label: "Payments" }] },
  ],
  greeting: { eyebrow: "Meridian Optics", title: "You employ people in 6 countries", sub: "Two through your own entities, two through EOR, and contractors in twelve more." },
  home: [
    { t: "countries", title: "Where your people are", sub: "Employment structure by country", items: [
      { code: "US", name: "United States", kind: "Own entity", people: 208, status: "Compliant" },
      { code: "CA", name: "Canada", kind: "Own entity", people: 46, status: "Compliant" },
      { code: "DE", name: "Germany", kind: "Own entity", people: 31, status: "Works council due" },
      { code: "UK", name: "United Kingdom", kind: "EOR", people: 19, status: "Compliant" },
      { code: "IN", name: "India", kind: "EOR", people: 24, status: "Compliant" },
      { code: "GL", name: "12 countries", kind: "Contractors", people: 16, status: "2 classification reviews" },
    ]},
    { t: "stats", items: [
      { label: "Countries", value: "18", sub: "6 with employees" },
      { label: "EOR employees", value: "43", sub: "UK and India" },
      { label: "Contractors", value: "16", sub: "2 under review", tone: "warn" },
      { label: "Next payment run", value: "28 Sep", sub: "3 currencies" },
    ]},
    { t: "callout", label: "What this interface assumes",
      body: "That your hardest problem is legal presence, not administration. The first screen is a map because the customer arrived unable to hire someone in Berlin — everything else is downstream of solving that, which is exactly the reverse of how the domestic platforms sequence it." },
  ],
  xray: [
    { title: "Country as the primary object", body: "The same data as any HR platform, organised around jurisdiction rather than person. That reordering is the entire strategic difference made visible in a layout." },
    { title: "Warm, round, founder-facing", body: "The visual register tells you who signs. Enterprise suites look like governance; this looks like a product bought by someone who has never run an RFP." },
  ],
};

export const FINCH: VendorSkin = {
  id: "finch",
  name: "Connective layer",
  studyOf: "the unified-API pattern, as most publicly associated with Finch",
  bet: "The record never consolidates. Sell the connective tissue instead.",
  ethos:
    "Not an HR product at all — a developer console. The user is an engineer at another company, and the object is a connection to somebody else's payroll system. It is dark, monospaced and instrumented, and every row carries a last-synced time. That timestamp is the whole argument on this map, rendered as a UI element rather than an essay.",
  href: "/instance/finch",
  depth: "Home screen",
  theme: {
    bg: "#0B0F14", surface: "#131A22", surfaceAlt: "#0F151C", border: "#233040",
    ink: "#E4ECF4", inkMuted: "#8CA0B4", inkFaint: "#5A6B7E",
    accent: "#3FD07E", accentInk: "#06210F", accentSoft: "#12291C",
    radius: "6px", radiusSm: "4px",
    font: 'ui-monospace, "SF Mono", Menlo, monospace', mono: true,
    chrome: "sidebar", density: "tight",
  },
  nav: [
    { group: "Data", items: [{ label: "Connections", on: true }, { label: "Providers" }, { label: "Webhooks" }] },
    { group: "API", items: [{ label: "Keys" }, { label: "Logs" }, { label: "Sandbox" }, { label: "MCP server" }] },
  ],
  greeting: { eyebrow: "acct_meridian_prod", title: "Connections", sub: "6 employer connections across 5 providers. Automated integrations sync every 24h; assisted every 7 days." },
  home: [
    { t: "connections", title: "Employer connections", sub: "Read coverage across providers", items: [
      { provider: "adp_workforce_now", kind: "assisted", synced: "6 days ago", stale: true, records: "1,204" },
      { provider: "gusto", kind: "automated", synced: "22 hours ago", stale: false, records: "88" },
      { provider: "paychex_flex", kind: "assisted", synced: "5 days ago", stale: true, records: "342" },
      { provider: "rippling", kind: "automated", synced: "19 hours ago", stale: false, records: "344" },
      { provider: "bamboohr", kind: "automated", synced: "23 hours ago", stale: false, records: "156" },
      { provider: "quickbooks_payroll", kind: "assisted", synced: "7 days ago", stale: true, records: "41" },
    ]},
    { t: "stats", items: [
      { label: "connections", value: "6", sub: "across 5 providers" },
      { label: "read coverage", value: "100%", sub: "org, pay, deductions" },
      { label: "write coverage", value: "2/6", sub: "deductions only", tone: "warn" },
      { label: "median staleness", value: "5d", sub: "assisted skews this", tone: "warn" },
    ]},
    { t: "callout", label: "The timestamp is the argument",
      body: "Every row on this screen is truthful and every row is a copy. An agent reading through this layer is reasoning about a company as it stood somewhere between 19 hours and 7 days ago. For a benefits calculation that is entirely fine. For an agent about to revoke someone's access it is the whole problem — and no amount of model quality fixes a stale read." },
  ],
  xray: [
    { title: "A console, not an app", body: "The customer is an engineer at another company. Rendering this beside the HR platforms is the clearest way to see that the connective layer is not competing for the same screen — it is selling the absence of one." },
    { title: "Staleness rendered honestly", body: "Most integration products hide sync age. Showing it makes the trade explicit: breadth across every employer, at the cost of a read that is hours or days behind. That is a real trade, not a flaw, and it decides which use cases are safe." },
  ],
};

export const ADP: VendorSkin = {
  id: "adp",
  name: "Payroll rail",
  studyOf: "the payroll-rail pattern, as most publicly associated with ADP",
  bet: "Be the rail. Whatever wins above it still settles through here.",
  ethos:
    "The interface argues that the unit of work is a cycle, not a person. You land on runs and filings with dates and statuses, because the customer's actual question is whether pay went out correctly and whether the returns were lodged. Square, plain, information-dense, visually unfashionable — and descended directly from the service-bureau relationship, where you send your data and someone else runs it.",
  href: "/instance/adp",
  depth: "Home screen",
  theme: {
    bg: "#FFFFFF", surface: "#FFFFFF", surfaceAlt: "#F2F4F6", border: "#C9D0D8",
    ink: "#22282E", inkMuted: "#5C666F", inkFaint: "#8A939B",
    accent: "#C8102E", accentInk: "#FFFFFF", accentSoft: "#FBE9EC",
    radius: "2px", radiusSm: "2px",
    font: 'system-ui, "Segoe UI", Arial, sans-serif',
    chrome: "topbar", density: "tight",
  },
  nav: [
    { items: [{ label: "Payroll", on: true }, { label: "Taxes & Filings" }, { label: "Reports" }, { label: "Company" }, { label: "Employees" }] },
  ],
  greeting: { eyebrow: "Meridian Optics, Inc. · Co 0042871", title: "Payroll cycles", sub: "Next transmission closes 13 Sep at 5:00 PM ET. Two cycles require review." },
  home: [
    { t: "runs", title: "Cycles", sub: "Current quarter", items: [
      { period: "Sep 1 – Sep 15", entity: "Meridian Optics, Inc.", people: "208", status: "Needs review", filed: "—" },
      { period: "Sep 1 – Sep 15", entity: "Meridian Optics Canada", people: "46", status: "Needs review", filed: "—" },
      { period: "Aug 16 – Aug 31", entity: "Meridian Optics, Inc.", people: "206", status: "Paid", filed: "941 lodged" },
      { period: "Aug 1 – Aug 15", entity: "Meridian Optics, Inc.", people: "206", status: "Paid", filed: "941 lodged" },
      { period: "Jul 16 – Jul 31", entity: "Meridian Optics, Inc.", people: "203", status: "Paid", filed: "941 lodged" },
    ]},
    { t: "table", title: "Tax jurisdictions", sub: "Registrations and deposit schedules", cols: ["Jurisdiction", "Type", "Schedule", "Status"], rows: [
      ["Federal", "941 / 940", "Semi-weekly", "Current"],
      ["California", "Withholding / UI", "Semi-weekly", "Current"],
      ["Texas", "UI", "Quarterly", "Current"],
      ["New York", "Withholding / UI", "Semi-weekly", "Current"],
      ["Colorado", "Withholding", "Monthly", "Registration pending"],
    ]},
    { t: "callout", label: "What this interface assumes",
      body: "That correctness and timeliness are the entire product, and that nobody logs in for pleasure. It is the oldest pattern on the map still doing the most work — a service-bureau relationship with a browser in front of it, paying a share of the workforce no venture-backed company approaches." },
  ],
  xray: [
    { title: "The cycle is the object", body: "Not the employee, not the org — the pay period and its filings. Everything about the layout follows from a customer whose real question is whether the return was lodged on time." },
    { title: "Deliberately unfashionable", body: "This is what software looks like when the buyer has never once chosen it for the interface. Reading that as backwardness is the standard mistake; it is a system optimised for a property other than delight." },
  ],
};

export const RIPPLING: VendorSkin = {
  id: "rippling",
  name: "Compound platform",
  studyOf: "the compound-platform pattern, as most publicly associated with Rippling",
  bet: "One employee record; compound outward across HR, IT and Finance.",
  ethos:
    "The interface argues that HR, IT and Finance are one problem wearing three org charts. The navigation is deliberately, almost absurdly long, and the home screen is a single queue mixing a payroll approval with a device compliance failure — because to the underlying system they are the same kind of object.",
  href: "/app",
  depth: "Full study",
  theme: {
    bg: "#F6F8F9", surface: "#FFFFFF", surfaceAlt: "#F9FAFB", border: "#DCE1E5",
    ink: "#0B0D0E", inkMuted: "#5B646C", inkFaint: "#8A939B",
    accent: "#F5C518", accentInk: "#0B0D0E", accentSoft: "#FFF6D1",
    radius: "8px", radiusSm: "6px",
    font: 'ui-sans-serif, -apple-system, "Segoe UI", sans-serif',
    chrome: "sidebar", density: "normal",
  },
  nav: [{ group: "HR", items: [{ label: "People", on: true }, { label: "Payroll", badge: "4" }] }],
  greeting: { eyebrow: "Meridian Optics", title: "Wednesday, 9 September", sub: "Six things need a person today, from four different domains, in one list." },
  home: [{ t: "ripple" }],
  xray: [],
};

export const SKINS: VendorSkin[] = [RIPPLING, WORKDAY, DEEL, FINCH, ADP];
export const skinById = (id: string) => SKINS.find((s) => s.id === id);
export const INSTANCE_SKINS = SKINS.filter((s) => s.id !== "rippling");
