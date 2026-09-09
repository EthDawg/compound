export interface NavItem { href: string; label: string; icon: string; badge?: string; live?: boolean }
export interface NavGroup { label: string; note: string; items: NavItem[] }

export const NAV: NavGroup[] = [
  {
    label: "HR", note: "Everything downstream of the employment relationship",
    items: [
      { href: "/app/people", label: "People", icon: "people", live: true },
      { href: "/app/hire", label: "Hiring & onboarding", icon: "hire", badge: "2", live: true },
      { href: "/app/payroll", label: "Payroll", icon: "payroll", badge: "4", live: true },
      { href: "/app/benefits", label: "Benefits", icon: "benefits" },
      { href: "/app/time", label: "Time & attendance", icon: "time" },
      { href: "/app/learning", label: "Learning", icon: "book" },
    ],
  },
  {
    label: "IT", note: "Same record. Different consequences.",
    items: [
      { href: "/app/devices", label: "Devices", icon: "device", badge: "3", live: true },
      { href: "/app/apps", label: "App management", icon: "apps", live: true },
      { href: "/app/identity", label: "Identity & access", icon: "lock" },
      { href: "/app/security", label: "Security posture", icon: "shield" },
    ],
  },
  {
    label: "Finance", note: "Spending authority is an attribute of a person",
    items: [
      { href: "/app/spend", label: "Spend", icon: "card", badge: "4", live: true },
      { href: "/app/expenses", label: "Expenses", icon: "expense" },
      { href: "/app/bills", label: "Bill pay", icon: "bill" },
      { href: "/app/planning", label: "Headcount planning", icon: "report" },
    ],
  },
  {
    label: "Platform", note: "The layer that makes the rest cheap",
    items: [
      { href: "/app/workflows", label: "Workflows", icon: "flow", live: true },
      { href: "/app/graph", label: "Graph explorer", icon: "graph", live: true },
      { href: "/app/reports", label: "Reports", icon: "list" },
      { href: "/app/entities", label: "Entities & countries", icon: "globe" },
    ],
  },
];

export const LIVE_ROUTES = new Set(
  NAV.flatMap((g) => g.items.filter((i) => i.live).map((i) => i.href)).concat(["/app"])
);
