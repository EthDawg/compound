import type { Sector, Category, Vendor, Attrs } from "./atlas-types";
import type { Archetype } from "./ecosystem";

export const SECTORS: Sector[] = [
  { id: "work", name: "Work & employment", accent: "#D9A900",
    blurb: "HR, workforce management and pay — the systems that know who works here.",
    thesis: "A fight about whether the employee record consolidates into one system or stays scattered across thousands. Every other question in the sector is downstream of that one." },
  { id: "legal", name: "Legal & contract", accent: "#7C5BD9",
    blurb: "Research, drafting, contract lifecycle, matter management and e-discovery.",
    thesis: "A fight about whether legal work is knowledge retrieval or workflow execution. The incumbents sold access to the corpus; the insurgents are betting the corpus is now cheap and the work is the product." },
  { id: "security", name: "Security & trust", accent: "#B4441F",
    blurb: "Identity, endpoint, cloud posture and the compliance evidence that follows.",
    thesis: "A fight about whether security is a product you buy or a property of the platform you already run. Consolidation pressure here is the strongest of any sector on this board." },
  { id: "finops", name: "Financial operations", accent: "#0E7C5A",
    blurb: "Spend, cards, payables, procurement, the ledger and the close.",
    thesis: "A fight about whether the ledger owns the truth or the moment of spend does. Card-led insurgents captured the transaction and are walking backwards into accounting; the ERPs are walking forwards to meet them." },
  { id: "data", name: "Data & integration", accent: "#1F5FCC",
    blurb: "Warehouses, pipelines, unified APIs and the protocols agents reach through.",
    thesis: "The recurring pattern of the whole board. Roughly every eight years the industry rediscovers that systems do not talk, renames the fix, and funds it heavily. Consolidation never removes the boundary; it moves it." },
  { id: "service", name: "Service & workflow", accent: "#C9863B",
    blurb: "ITSM, enterprise workflow, customer service and work management.",
    thesis: "A fight to own the work that happens around every system of record without having to win any of them. The most underrated competitive vector in enterprise software." },
  { id: "revenue", name: "Revenue & customer", accent: "#D4586F",
    blurb: "CRM, revenue intelligence, billing and the customer record.",
    thesis: "A fight about whether the CRM survives as a system of record or degrades into a database that agents write to. The oldest enterprise category, facing the sharpest question." },
  { id: "vertical", name: "Vertical software", accent: "#3E8E7E",
    blurb: "Industry-specific platforms — hospitality, construction, life sciences, public sector, health.",
    thesis: "The compound pattern applied to one industry instead of one function. Owning a vertical's core record produces the same expansion economics and much stronger entrenchment." },
  { id: "delivery", name: "Delivery & advisory", accent: "#8A939B",
    blurb: "The integrators, advisories and platform specialists who make software land.",
    thesis: "Invisible on every product map and decisive in a large share of enterprise deals — and the group most directly exposed to the thing it is currently selling." },
  { id: "capital", name: "Capital & consolidation", accent: "#5B646C",
    blurb: "Private equity, perpetual holders and the strategic acquirers.",
    thesis: "Where everything else on this board goes when growth stops. If you are asking who acquires whom, or how to dispose of something, this is the layer that answers it." },
];

const cat = (id: string, sector: string, name: string, shape: Archetype, blurb: string): Category =>
  ({ id, sector, name, shape, blurb });

export const CATEGORIES: Category[] = [
  // Work & employment
  cat("hr-compound", "work", "Compound HR platforms", "Compound platform", "One employee record, many products stacked on it."),
  cat("hcm-suite", "work", "Enterprise HCM suites", "Enterprise suite", "Configurable systems of record for large, complex employers."),
  cat("payroll-rail", "work", "Payroll rails", "Payroll rail", "Filing, withholding and money movement as infrastructure."),
  cat("eor", "work", "Global employment & EOR", "Global employment", "Employing people where you have no legal entity."),
  cat("talent", "work", "Talent & hiring", "Point specialist", "Sourcing, assessment, hiring and performance."),
  cat("wfm", "work", "Workforce management", "Enterprise suite", "Time, scheduling and the frontline worker."),
  cat("hr-regional", "work", "Regionally entrenched HR", "Regional entrenched", "Contract-fed, accredited, locally dominant."),

  // Legal & contract
  cat("legal-ai", "legal", "AI legal copilots", "AI-native", "Drafting, review and research inside the firm's own work."),
  cat("clm", "legal", "Contract lifecycle", "Compound platform", "Authoring, negotiation, execution and obligation tracking."),
  cat("legal-research", "legal", "Legal research incumbents", "Enterprise suite", "The corpus, the citator and a century of editorial."),
  cat("practice-mgmt", "legal", "Practice management", "Compound platform", "Matters, time, billing and trust accounting for firms."),
  cat("ediscovery", "legal", "e-Discovery & review", "Point specialist", "Collection, processing and review at litigation scale."),
  cat("legal-ops", "legal", "Legal operations", "Point specialist", "Spend, panel management and in-house workflow."),

  // Security & trust
  cat("identity", "security", "Identity & access", "Connective layer", "Who is allowed into what, as a neutral layer."),
  cat("cloud-sec", "security", "Cloud & endpoint security", "Enterprise suite", "Posture, detection and response across the estate."),
  cat("grc", "security", "Compliance automation", "Point specialist", "Continuous evidence for frameworks and auditors."),
  cat("data-sec", "security", "Network & data security", "Enterprise suite", "Traffic, access and exfiltration control."),

  // Financial operations
  cat("spend", "finops", "Spend & corporate cards", "Compound platform", "Capture the transaction, then walk backwards into accounting."),
  cat("ap-ar", "finops", "Payables & receivables", "Point specialist", "Invoices, approvals and payment execution."),
  cat("erp", "finops", "ERP & the ledger", "Enterprise suite", "The book of record everything else reconciles to."),
  cat("procure", "finops", "Procurement & vendor", "Enterprise suite", "Sourcing, contracts and third-party risk."),
  cat("close", "finops", "Close & reporting", "Point specialist", "Reconciliation, controls and the month-end."),

  // Data & integration
  cat("unified-api", "data", "Unified APIs", "Connective layer", "One interface across every vendor in a category."),
  cat("warehouse", "data", "Warehouse & lakehouse", "Enterprise suite", "Where the copies land and get queried."),
  cat("pipelines", "data", "Pipelines & transformation", "Point specialist", "Moving and reshaping data between systems."),
  cat("embedded", "data", "Embedded infrastructure", "Connective layer", "Payroll, payments and banking as primitives inside other products."),

  // Service & workflow
  cat("itsm", "service", "ITSM & enterprise workflow", "Service platform", "Routing work across every department."),
  cat("cx", "service", "Customer service", "Service platform", "The support surface and its automation."),
  cat("work-mgmt", "service", "Work management", "Point specialist", "Projects, docs and tasks, usually bought bottom-up."),

  // Revenue & customer
  cat("crm", "revenue", "CRM & the customer record", "Enterprise suite", "The oldest system of record in enterprise software."),
  cat("rev-intel", "revenue", "Revenue intelligence", "AI-native", "Reading the conversation rather than the pipeline field."),
  cat("billing", "revenue", "Billing & monetisation", "Point specialist", "Turning usage and contracts into invoices."),

  // Vertical
  cat("hospitality", "vertical", "Hospitality & retail", "Compound platform", "Point of sale outward into payroll, lending and inventory."),
  cat("construction", "vertical", "Construction & projects", "Compound platform", "The project as the core record."),
  cat("lifesci", "vertical", "Life sciences", "Enterprise suite", "Regulated commercial and clinical operations."),
  cat("publicsec", "vertical", "Public sector & education", "Regional entrenched", "Long cycles, procurement panels and migration risk."),
  cat("health", "vertical", "Health systems", "Enterprise suite", "The patient record and everything around it."),

  // Delivery
  cat("global-si", "delivery", "Global integrators", "Integrator channel", "Scale delivery across every platform and geography."),
  cat("platform-si", "delivery", "Platform specialists", "Integrator channel", "Deep practice in one vendor's ecosystem."),

  // Capital
  cat("pe", "capital", "Private equity", "Capital and consolidation", "Buy, improve margin, exit."),
  cat("perpetual", "capital", "Perpetual holders", "Capital and consolidation", "Buy small, never sell."),
];

const V = (
  slug: string, name: string, sector: string, category: string, archetype: Archetype,
  geo: string, attrs: Attrs, bet: string, extra: Partial<Vendor> = {}
): Vendor => ({ slug, name, sector, category, archetype, geo, attrs, bet, ...extra });

/** Breadth vendors — placed by archetype and attributes, not individually read. */
export const VENDORS: Vendor[] = [
  // ── Legal & contract ──────────────────────────────────────────────────────
  V("legora", "Legora", "legal", "legal-ai", "AI-native", "Sweden · EU", { scale: 2, age: 1, agentic: 5 },
    "AI as a collaborative workspace inside the firm's own work, rather than a research tool bolted onto the side of it."),
  V("harvey", "Harvey", "legal", "legal-ai", "AI-native", "US · global", { scale: 3, age: 1, agentic: 5 },
    "Domain-trained assistance sold to the largest firms first, on the theory that credibility flows downward."),
  V("robin-ai", "Robin AI", "legal", "legal-ai", "AI-native", "UK", { scale: 2, age: 2, agentic: 5 },
    "Contract review as the wedge, with humans in the loop where the model is not trusted yet."),
  V("spellbook", "Spellbook", "legal", "legal-ai", "AI-native", "Canada", { scale: 2, age: 1, agentic: 5 },
    "Drafting assistance where lawyers already work, inside the word processor."),
  V("ironclad", "Ironclad", "legal", "clm", "Compound platform", "US", { scale: 3, age: 3, agentic: 4 },
    "Own the contract as a data object, then compound outward into every workflow that touches it."),
  V("icertis", "Icertis", "legal", "clm", "Enterprise suite", "US · global", { scale: 3, age: 4, agentic: 3 },
    "Enterprise contract management as governance infrastructure for the largest organisations."),
  V("agiloft", "Agiloft", "legal", "clm", "Point specialist", "US", { scale: 2, age: 4, agentic: 3 },
    "Configurability as the differentiator in a category where every customer's process differs."),
  V("linksquares", "LinkSquares", "legal", "clm", "Point specialist", "US", { scale: 2, age: 2, agentic: 4 },
    "Extract obligations from the contracts a company already signed, before improving how it signs new ones."),
  V("lexisnexis", "LexisNexis", "legal", "legal-research", "Enterprise suite", "Global", { scale: 4, age: 5, agentic: 4 },
    "Own the corpus and the citator, and let a century of editorial judgement be the moat."),
  V("westlaw", "Thomson Reuters Westlaw", "legal", "legal-research", "Enterprise suite", "Global", { scale: 4, age: 5, agentic: 4 },
    "The same bet, with the research relationship embedded in how lawyers were trained."),
  V("clio", "Clio", "legal", "practice-mgmt", "Compound platform", "Canada · global", { scale: 3, age: 4, agentic: 3 },
    "Own the small firm's operations end to end — matters, time, billing, payments — the compound pattern in legal."),
  V("actionstep", "Actionstep", "legal", "practice-mgmt", "Regional entrenched", "New Zealand · ANZ", { scale: 2, age: 4, agentic: 2 },
    "Practice management built around ANZ trust accounting and local compliance."),
  V("smokeball", "Smokeball", "legal", "practice-mgmt", "Regional entrenched", "Australia · US", { scale: 2, age: 3, agentic: 3 },
    "Automatic time capture as the wedge into small-firm practice management."),
  V("relativity", "Relativity", "legal", "ediscovery", "Enterprise suite", "US · global", { scale: 3, age: 4, agentic: 3 },
    "The platform litigation support teams were trained on, sold through a partner channel."),
  V("everlaw", "Everlaw", "legal", "ediscovery", "Point specialist", "US", { scale: 2, age: 3, agentic: 4 },
    "Modern review tooling aimed at the analyst rather than the administrator."),
  V("disco", "DISCO", "legal", "ediscovery", "Point specialist", "US", { scale: 2, age: 3, agentic: 4 },
    "Cloud-native e-discovery priced to be predictable rather than per-gigabyte."),
  V("brightflag", "Brightflag", "legal", "legal-ops", "Point specialist", "Ireland · US", { scale: 2, age: 3, agentic: 4 },
    "Read the invoice to understand what outside counsel actually did."),

  // ── Security & trust ──────────────────────────────────────────────────────
  V("entra", "Microsoft Entra", "security", "identity", "Enterprise suite", "Global", { scale: 5, age: 4, agentic: 3 },
    "Identity bundled into the estate the customer already licenses, which is a pricing argument before it is a product one."),
  V("jumpcloud", "JumpCloud", "security", "identity", "Compound platform", "US", { scale: 2, age: 3, agentic: 3 },
    "Directory, device and access for companies too small to run three vendors."),
  V("onepassword", "1Password", "security", "identity", "Point specialist", "Canada", { scale: 3, age: 4, agentic: 3 },
    "Own the credential, then extend into access for the humans around it."),
  V("wiz", "Wiz", "security", "cloud-sec", "Point specialist", "US · Israel", { scale: 3, age: 2, agentic: 4 },
    "Agentless posture across the whole cloud estate, deployed in an afternoon."),
  V("crowdstrike", "CrowdStrike", "security", "cloud-sec", "Enterprise suite", "US · global", { scale: 4, age: 4, agentic: 4 },
    "Own the endpoint agent, then compound every other security product onto it."),
  V("palo-alto", "Palo Alto Networks", "security", "cloud-sec", "Enterprise suite", "US · global", { scale: 5, age: 5, agentic: 4 },
    "Platformisation as explicit strategy — consolidate the customer's security spend into one vendor."),
  V("sentinelone", "SentinelOne", "security", "cloud-sec", "Point specialist", "US", { scale: 3, age: 3, agentic: 4 },
    "Autonomous endpoint response as the differentiator against the incumbent agent."),
  V("vanta", "Vanta", "security", "grc", "Compound platform", "US", { scale: 3, age: 2, agentic: 4 },
    "Continuous evidence collection for frameworks, then compound into the wider trust surface."),
  V("drata", "Drata", "security", "grc", "Point specialist", "US", { scale: 2, age: 2, agentic: 4 },
    "The same wedge, competing on automation depth and auditor relationships."),
  V("zscaler", "Zscaler", "security", "data-sec", "Enterprise suite", "US · global", { scale: 4, age: 4, agentic: 3 },
    "Route all traffic through the vendor's cloud and make the perimeter a service."),

  // ── Financial operations ──────────────────────────────────────────────────
  V("ramp", "Ramp", "finops", "spend", "Compound platform", "US", { scale: 3, age: 2, agentic: 5 },
    "Own the transaction at the moment of spend, then compound backwards through AP, procurement and the close."),
  V("brex", "Brex", "finops", "spend", "Compound platform", "US", { scale: 3, age: 2, agentic: 4 },
    "The same wedge aimed at venture-backed companies, with banking attached."),
  V("navan", "Navan", "finops", "spend", "Compound platform", "US · global", { scale: 3, age: 3, agentic: 4 },
    "Travel booking and expense as one object rather than two systems reconciled after the trip."),
  V("pleo", "Pleo", "finops", "spend", "Compound platform", "Denmark · EU", { scale: 2, age: 3, agentic: 3 },
    "European spend management where local banking and VAT rules keep the US platforms out."),
  V("bill", "BILL", "finops", "ap-ar", "Point specialist", "US", { scale: 3, age: 4, agentic: 3 },
    "Own accounts payable for small business and the accountants who serve them."),
  V("tipalti", "Tipalti", "finops", "ap-ar", "Point specialist", "US · Israel", { scale: 2, age: 3, agentic: 3 },
    "Global payables where the hard part is mass payout across jurisdictions."),
  V("netsuite", "NetSuite", "finops", "erp", "Enterprise suite", "Global", { scale: 4, age: 5, agentic: 3 },
    "The mid-market ledger, sold as the system everything else reconciles to."),
  V("sage-intacct", "Sage Intacct", "finops", "erp", "Enterprise suite", "US · UK", { scale: 3, age: 4, agentic: 3 },
    "Financial depth for services businesses that outgrew small-business accounting."),
  V("xero", "Xero", "finops", "erp", "Compound platform", "New Zealand · ANZ · UK", { scale: 4, age: 4, agentic: 3 },
    "Own the small business ledger through the accountant, then compound the ecosystem on top."),
  V("myob", "MYOB", "finops", "erp", "Regional entrenched", "Australia · NZ", { scale: 3, age: 5, agentic: 2 },
    "Incumbency in ANZ small business accounting and payroll, defended on local compliance."),
  V("coupa", "Coupa", "finops", "procure", "Enterprise suite", "US · global", { scale: 3, age: 4, agentic: 3 },
    "Business spend management as a single enterprise surface, now under private ownership."),
  V("zip", "Zip", "finops", "procure", "Point specialist", "US", { scale: 2, age: 2, agentic: 4 },
    "Intake and orchestration in front of whatever procurement stack already exists."),
  V("blackline", "BlackLine", "finops", "close", "Point specialist", "US · global", { scale: 3, age: 4, agentic: 3 },
    "Own the reconciliation and controls layer that ERPs never made good enough."),
  V("floqast", "FloQast", "finops", "close", "Point specialist", "US", { scale: 2, age: 3, agentic: 4 },
    "The close checklist, built by accountants for the team actually doing it."),

  // ── Data & integration ────────────────────────────────────────────────────
  V("kombo", "Kombo", "data", "unified-api", "Connective layer", "Germany · EU", { scale: 1, age: 2, agentic: 4 },
    "European HR and ATS coverage where the US unified APIs are thin."),
  V("apideck", "Apideck", "data", "unified-api", "Connective layer", "Belgium · EU", { scale: 1, age: 2, agentic: 4 },
    "Pass-through rather than sync-and-store, so no customer records sit at rest with the vendor."),
  V("snowflake", "Snowflake", "data", "warehouse", "Enterprise suite", "US · global", { scale: 4, age: 4, agentic: 4 },
    "Separate storage from compute and become the place every copy of the business lands."),
  V("databricks", "Databricks", "data", "warehouse", "Enterprise suite", "US · global", { scale: 4, age: 4, agentic: 5 },
    "The lakehouse plus the model training loop, sold to the data team rather than the analyst."),
  V("fivetran", "Fivetran", "data", "pipelines", "Connective layer", "US", { scale: 3, age: 3, agentic: 3 },
    "Managed pipelines so nobody maintains a connector again — the integration pattern, current instance."),
  V("dbt", "dbt Labs", "data", "pipelines", "Point specialist", "US", { scale: 2, age: 3, agentic: 3 },
    "Transformation as version-controlled code, which made analytics engineering a job title."),
  V("airbyte", "Airbyte", "data", "pipelines", "Connective layer", "US", { scale: 2, age: 2, agentic: 3 },
    "Open-source connectors as the answer to per-connection pricing."),
  V("stripe", "Stripe", "data", "embedded", "Connective layer", "US · global", { scale: 5, age: 4, agentic: 4 },
    "Payments as a primitive other products build on, and the template every embedded-infrastructure company copies."),
  V("unit", "Unit", "data", "embedded", "Connective layer", "US", { scale: 1, age: 2, agentic: 3 },
    "Banking as infrastructure inside somebody else's product."),

  // ── Service & workflow ────────────────────────────────────────────────────
  V("freshworks", "Freshworks", "service", "itsm", "Service platform", "India · US", { scale: 3, age: 4, agentic: 3 },
    "The service platform pattern at a price point the enterprise incumbents do not defend."),
  V("zendesk", "Zendesk", "service", "cx", "Service platform", "US · global", { scale: 4, age: 5, agentic: 4 },
    "Own the support conversation, now under pressure from agents that resolve rather than route."),
  V("intercom", "Intercom", "service", "cx", "AI-native", "Ireland · US", { scale: 3, age: 4, agentic: 5 },
    "Repositioned the whole company around AI resolution rather than ticket deflection."),
  V("asana", "Asana", "service", "work-mgmt", "Point specialist", "US", { scale: 3, age: 4, agentic: 4 },
    "Structured work management sold top-down against bottom-up adoption."),
  V("monday", "monday.com", "service", "work-mgmt", "Compound platform", "Israel · global", { scale: 4, age: 4, agentic: 4 },
    "A work platform that compounds into CRM, service and dev — the compound pattern outside HR."),
  V("notion", "Notion", "service", "work-mgmt", "Compound platform", "US", { scale: 4, age: 3, agentic: 5 },
    "Own the document, then compound into database, wiki and now agentic surfaces."),
  V("linear", "Linear", "service", "work-mgmt", "Point specialist", "US", { scale: 2, age: 3, agentic: 4 },
    "Opinionated speed for software teams, deliberately refusing configurability."),

  // ── Revenue & customer ────────────────────────────────────────────────────
  V("salesforce", "Salesforce", "revenue", "crm", "Enterprise suite", "US · global", { scale: 5, age: 5, agentic: 5 },
    "Own the customer record, then compound relentlessly — the original compound platform, and the template for the pattern."),
  V("hubspot", "HubSpot", "revenue", "crm", "Compound platform", "US · global", { scale: 4, age: 4, agentic: 4 },
    "Start where the incumbent is too expensive, compound upward through the same suite logic."),
  V("dynamics", "Microsoft Dynamics", "revenue", "crm", "Enterprise suite", "Global", { scale: 4, age: 5, agentic: 4 },
    "CRM as an entitlement inside a licence the customer already holds."),
  V("gong", "Gong", "revenue", "rev-intel", "AI-native", "US · Israel", { scale: 3, age: 3, agentic: 5 },
    "Read what was actually said rather than what a rep typed into a field."),
  V("clari", "Clari", "revenue", "rev-intel", "Point specialist", "US", { scale: 2, age: 3, agentic: 4 },
    "Forecast accuracy as the product, sold to the revenue leader rather than the rep."),
  V("zuora", "Zuora", "revenue", "billing", "Point specialist", "US", { scale: 2, age: 4, agentic: 3 },
    "Subscription billing complexity as a defensible niche the ERPs never absorbed."),

  // ── Vertical software ─────────────────────────────────────────────────────
  V("toast", "Toast", "vertical", "hospitality", "Compound platform", "US", { scale: 4, age: 4, agentic: 3 },
    "Own the restaurant's point of sale, then compound into payroll, lending, inventory and delivery."),
  V("lightspeed", "Lightspeed", "vertical", "hospitality", "Compound platform", "Canada · global", { scale: 3, age: 4, agentic: 3 },
    "The same pattern across retail and hospitality, assembled partly through acquisition."),
  V("procore", "Procore", "vertical", "construction", "Compound platform", "US · global", { scale: 3, age: 4, agentic: 3 },
    "The construction project as the core record, with every trade reading from it."),
  V("veeva", "Veeva", "vertical", "lifesci", "Enterprise suite", "US · global", { scale: 4, age: 4, agentic: 3 },
    "Regulated life-sciences commercial and clinical operations, where general-purpose software cannot follow."),
  V("tyler", "Tyler Technologies", "vertical", "publicsec", "Regional entrenched", "US", { scale: 4, age: 5, agentic: 2 },
    "Courts, permitting and public records — decades-long contracts and migration risk that beats product quality."),
  V("epic", "Epic Systems", "vertical", "health", "Enterprise suite", "US", { scale: 5, age: 5, agentic: 3 },
    "The patient record as the most entrenched system in enterprise software, sold without a channel."),

  // ── Delivery & advisory ───────────────────────────────────────────────────
  V("capgemini", "Capgemini", "delivery", "global-si", "Integrator channel", "France · global", { scale: 4, age: 5, agentic: 3 },
    "European-anchored global delivery across every major platform."),
  V("cognizant", "Cognizant", "delivery", "global-si", "Integrator channel", "US · India", { scale: 4, age: 5, agentic: 3 },
    "Offshore-anchored delivery scale at a cost base the onshore firms cannot match."),
  V("kainos", "Kainos", "delivery", "platform-si", "Integrator channel", "UK", { scale: 2, age: 4, agentic: 3 },
    "Deep practice in a single platform's ecosystem plus public-sector digital delivery."),

  // ── Capital ───────────────────────────────────────────────────────────────
  V("francisco", "Francisco Partners", "capital", "pe", "Capital and consolidation", "US", { scale: 3, age: 4, agentic: 1 },
    "Carve-outs and take-privates in software, often where a larger owner lost interest."),
];

// Which existing employment-study companies belong to which category.
export const WORK_CATEGORY: Record<string, string> = {
  rippling: "hr-compound", deel: "hr-compound", "employment-hero": "hr-compound", gusto: "hr-compound",
  hibob: "hr-compound", personio: "hr-compound", darwinbox: "hr-compound", justworks: "hr-compound", trinet: "hr-compound",
  workday: "hcm-suite", "sap-successfactors": "hcm-suite", "oracle-hcm": "hcm-suite",
  ukg: "wfm", dayforce: "wfm",
  adp: "payroll-rail", paychex: "payroll-rail", paycom: "payroll-rail", paylocity: "payroll-rail",
  remote: "eor", "velocity-global": "eor", "papaya-global": "eor", oyster: "eor",
  greenhouse: "talent", ashby: "talent", lattice: "talent", "culture-amp": "talent", pageup: "talent",
  checkr: "talent", paradox: "talent", mercor: "talent", upwork: "talent",
  "nga-net": "hr-regional", elmo: "hr-regional",
};

/** Existing companies that live outside the employment sector. */
export const CROSS_SECTOR: Record<string, { sector: string; category: string }> = {
  finch: { sector: "data", category: "unified-api" },
  merge: { sector: "data", category: "unified-api" },
  check: { sector: "data", category: "embedded" },
  okta: { sector: "security", category: "identity" },
  servicenow: { sector: "service", category: "itsm" },
  atlassian: { sector: "service", category: "work-mgmt" },
  accenture: { sector: "delivery", category: "global-si" },
  deloitte: { sector: "delivery", category: "global-si" },
  infosys: { sector: "delivery", category: "global-si" },
  vista: { sector: "capital", category: "pe" },
  "thoma-bravo": { sector: "capital", category: "pe" },
  constellation: { sector: "capital", category: "perpetual" },
  "technology-one": { sector: "vertical", category: "publicsec" },
};

export const sectorById = (id: string) => SECTORS.find((s) => s.id === id);
export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id);
export const categoriesIn = (sector: string) => CATEGORIES.filter((c) => c.sector === sector);
