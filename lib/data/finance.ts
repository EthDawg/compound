export interface PayrollRun {
  id: string; period: string; payDate: string; entity: string; status: "Draft" | "Needs review" | "Approved" | "Paid";
  employees: number; gross: number; taxes: number; benefits: number; net: number; currency: string;
}

export const PAYROLL_RUNS: PayrollRun[] = [
  { id: "pr-2026-17", period: "Sep 1 – Sep 15, 2026", payDate: "2026-09-15", entity: "Meridian Optics, Inc.", status: "Needs review", employees: 208, gross: 3184200, taxes: 742600, benefits: 388100, net: 2053500, currency: "USD" },
  { id: "pr-2026-17-ca", period: "Sep 1 – Sep 15, 2026", payDate: "2026-09-15", entity: "Meridian Optics Canada ULC", status: "Needs review", employees: 46, gross: 402800, taxes: 118400, benefits: 41200, net: 243200, currency: "CAD" },
  { id: "pr-2026-09-de", period: "September 2026", payDate: "2026-09-28", entity: "Meridian Optics GmbH", status: "Draft", employees: 31, gross: 366400, taxes: 154900, benefits: 63800, net: 147700, currency: "EUR" },
  { id: "pr-2026-09-eor", period: "September 2026", payDate: "2026-09-28", entity: "EOR — UK & India", status: "Draft", employees: 43, gross: 289100, taxes: 71200, benefits: 24900, net: 193000, currency: "USD" },
  { id: "pr-2026-16", period: "Aug 16 – Aug 31, 2026", payDate: "2026-08-31", entity: "Meridian Optics, Inc.", status: "Paid", employees: 206, gross: 3141900, taxes: 733100, benefits: 385400, net: 2023400, currency: "USD" },
  { id: "pr-2026-15", period: "Aug 1 – Aug 15, 2026", payDate: "2026-08-14", entity: "Meridian Optics, Inc.", status: "Paid", employees: 206, gross: 3138200, taxes: 731900, benefits: 385400, net: 2020900, currency: "USD" },
];

export interface SpendItem {
  id: string; merchant: string; employee: string; amount: number; currency: string; date: string;
  category: string; status: "Auto-approved" | "Needs receipt" | "Pending approval" | "Flagged" | "Reconciled";
  policy: string; glCode: string;
}

export const SPEND: SpendItem[] = [
  { id: "s-01", merchant: "Zemax LLC", employee: "e-023", amount: 9360, currency: "USD", date: "2026-09-08", category: "Software", status: "Pending approval", policy: "Engineering", glCode: "6120 · Software" },
  { id: "s-02", merchant: "Delta Air Lines", employee: "e-016", amount: 1842.4, currency: "GBP", date: "2026-09-08", category: "Travel", status: "Auto-approved", policy: "Sales", glCode: "6400 · Travel" },
  { id: "s-03", merchant: "AWS", employee: "e-009", amount: 41280, currency: "USD", date: "2026-09-07", category: "Cloud", status: "Reconciled", policy: "Engineering", glCode: "6110 · Hosting" },
  { id: "s-04", merchant: "Thorlabs", employee: "e-010", amount: 12430, currency: "EUR", date: "2026-09-07", category: "Lab equipment", status: "Flagged", policy: "Engineering", glCode: "6210 · R&D materials" },
  { id: "s-05", merchant: "WeWork Austin", employee: "e-002", amount: 8400, currency: "USD", date: "2026-09-06", category: "Facilities", status: "Reconciled", policy: "Executive", glCode: "6300 · Rent" },
  { id: "s-06", merchant: "Salesforce", employee: "e-006", amount: 13530, currency: "USD", date: "2026-09-05", category: "Software", status: "Auto-approved", policy: "Sales", glCode: "6120 · Software" },
  { id: "s-07", merchant: "Uber", employee: "e-033", amount: 94.2, currency: "USD", date: "2026-09-05", category: "Travel", status: "Needs receipt", policy: "Marketing", glCode: "6400 · Travel" },
  { id: "s-08", merchant: "Apple Store", employee: "e-013", amount: 4798, currency: "USD", date: "2026-09-04", category: "Hardware", status: "Auto-approved", policy: "IT", glCode: "1500 · Equipment" },
  { id: "s-09", merchant: "Edmund Optics", employee: "e-011", amount: 22140, currency: "USD", date: "2026-09-04", category: "Lab equipment", status: "Pending approval", policy: "Engineering", glCode: "6210 · R&D materials" },
  { id: "s-10", merchant: "Notion Labs", employee: "e-013", amount: 3120, currency: "USD", date: "2026-09-03", category: "Software", status: "Reconciled", policy: "IT", glCode: "6120 · Software" },
  { id: "s-11", merchant: "Lufthansa", employee: "e-031", amount: 1140, currency: "EUR", date: "2026-09-03", category: "Travel", status: "Auto-approved", policy: "Sales", glCode: "6400 · Travel" },
  { id: "s-12", merchant: "Grubhub", employee: "e-040", amount: 218.4, currency: "USD", date: "2026-09-02", category: "Meals", status: "Needs receipt", policy: "Engineering", glCode: "6410 · Meals" },
  { id: "s-13", merchant: "Datadog", employee: "e-004", amount: 5890, currency: "USD", date: "2026-09-02", category: "Software", status: "Reconciled", policy: "Engineering", glCode: "6120 · Software" },
  { id: "s-14", merchant: "Shenzhen Precision Ltd", employee: "e-030", amount: 68400, currency: "USD", date: "2026-09-01", category: "COGS", status: "Pending approval", policy: "Operations", glCode: "5100 · Direct materials" },
];

export const CARD_STATS = {
  monthToDate: 287420,
  budget: 412000,
  activeCards: 96,
  pendingApprovals: 4,
  missingReceipts: 11,
  autoCategorized: 0.94,
};

export const fmt = (n: number, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: n % 1 === 0 ? 0 : 2 }).format(n);
export const fmtCompact = (n: number, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, notation: "compact", maximumFractionDigits: 1 }).format(n);
