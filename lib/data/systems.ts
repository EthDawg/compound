import { EMPLOYEES } from "./employees";

export interface App {
  id: string; name: string; category: string; seats: number; assigned: number;
  cost: number; provisioning: "SCIM" | "SAML" | "API" | "Manual"; owner: string; risk: "Low" | "Medium" | "High";
}

export const APPS: App[] = [
  { id: "a-01", name: "Google Workspace", category: "Productivity", seats: 360, assigned: 344, cost: 18, provisioning: "SCIM", owner: "e-013", risk: "High" },
  { id: "a-02", name: "Slack", category: "Communication", seats: 360, assigned: 341, cost: 12.5, provisioning: "SCIM", owner: "e-013", risk: "Medium" },
  { id: "a-03", name: "Notion", category: "Productivity", seats: 340, assigned: 312, cost: 10, provisioning: "SCIM", owner: "e-013", risk: "Medium" },
  { id: "a-04", name: "Greenhouse", category: "HR", seats: 40, assigned: 22, cost: 88, provisioning: "SAML", owner: "e-005", risk: "High" },
  { id: "a-05", name: "NetSuite", category: "Finance", seats: 45, assigned: 31, cost: 129, provisioning: "SAML", owner: "e-003", risk: "High" },
  { id: "a-06", name: "GitHub Enterprise", category: "Engineering", seats: 180, assigned: 151, cost: 21, provisioning: "SCIM", owner: "e-004", risk: "High" },
  { id: "a-07", name: "Ramp", category: "Finance", seats: 120, assigned: 96, cost: 0, provisioning: "API", owner: "e-003", risk: "High" },
  { id: "a-08", name: "Linear", category: "Engineering", seats: 200, assigned: 164, cost: 14, provisioning: "SCIM", owner: "e-007", risk: "Low" },
  { id: "a-09", name: "Carta", category: "Finance", seats: 20, assigned: 11, cost: 0, provisioning: "Manual", owner: "e-003", risk: "High" },
  { id: "a-10", name: "AWS", category: "Engineering", seats: 140, assigned: 118, cost: 0, provisioning: "SAML", owner: "e-004", risk: "High" },
  { id: "a-11", name: "DocuSign", category: "Legal", seats: 60, assigned: 34, cost: 40, provisioning: "SAML", owner: "e-014", risk: "Medium" },
  { id: "a-12", name: "Anaplan", category: "Finance", seats: 25, assigned: 14, cost: 210, provisioning: "SAML", owner: "e-003", risk: "Medium" },
  { id: "a-13", name: "Lattice", category: "HR", seats: 360, assigned: 328, cost: 11, provisioning: "SCIM", owner: "e-005", risk: "Medium" },
  { id: "a-14", name: "Salesforce", category: "GTM", seats: 110, assigned: 82, cost: 165, provisioning: "SCIM", owner: "e-006", risk: "High" },
  { id: "a-15", name: "Outreach", category: "GTM", seats: 80, assigned: 47, cost: 100, provisioning: "SAML", owner: "e-006", risk: "Medium" },
  { id: "a-16", name: "SAP Ariba", category: "Operations", seats: 40, assigned: 26, cost: 145, provisioning: "Manual", owner: "e-008", risk: "Medium" },
  { id: "a-17", name: "Altium 365", category: "Hardware", seats: 70, assigned: 58, cost: 340, provisioning: "Manual", owner: "e-011", risk: "Medium" },
  { id: "a-18", name: "Zemax OpticStudio", category: "Hardware", seats: 30, assigned: 24, cost: 780, provisioning: "Manual", owner: "e-011", risk: "Low" },
  { id: "a-19", name: "1Password", category: "Security", seats: 360, assigned: 344, cost: 8, provisioning: "SCIM", owner: "e-013", risk: "High" },
  { id: "a-20", name: "Datadog", category: "Engineering", seats: 90, assigned: 61, cost: 31, provisioning: "SAML", owner: "e-004", risk: "Medium" },
  { id: "a-21", name: "Ironclad", category: "Legal", seats: 20, assigned: 9, cost: 190, provisioning: "SAML", owner: "e-014", risk: "Medium" },
  { id: "a-22", name: "Figma", category: "Design", seats: 90, assigned: 63, cost: 45, provisioning: "SCIM", owner: "e-007", risk: "Low" },
  { id: "a-23", name: "MasterControl QMS", category: "Operations", seats: 45, assigned: 33, cost: 260, provisioning: "Manual", owner: "e-008", risk: "High" },
  { id: "a-24", name: "Zendesk", category: "GTM", seats: 40, assigned: 21, cost: 55, provisioning: "SCIM", owner: "e-006", risk: "Low" },
  { id: "a-25", name: "Snowflake", category: "Data", seats: 60, assigned: 38, cost: 0, provisioning: "SAML", owner: "e-004", risk: "High" },
  { id: "a-26", name: "HubSpot", category: "GTM", seats: 30, assigned: 17, cost: 90, provisioning: "SAML", owner: "e-006", risk: "Low" },
  { id: "a-27", name: "SolidWorks", category: "Hardware", seats: 35, assigned: 27, cost: 420, provisioning: "Manual", owner: "e-011", risk: "Low" },
];

export interface Device {
  id: string; model: string; serial: string; assignedTo: string | null; os: string;
  status: "Healthy" | "Needs attention" | "Unassigned" | "In transit" | "Recovery pending";
  encrypted: boolean; lastCheckIn: string; compliance: number;
}

const models = [
  ["MacBook Pro 16\" M4 Pro", "macOS 15.4"], ["MacBook Air 15\" M4", "macOS 15.4"],
  ["MacBook Pro 14\" M3", "macOS 15.3"], ["Dell Precision 7680", "Windows 11 Pro"],
  ["ThinkPad P1 Gen 7", "Ubuntu 24.04"],
] as const;

// Which employee holds which machine. Everything else about the fleet derives from this.
const DEVICE_OWNER: Record<string, string> = Object.fromEntries(
  EMPLOYEES.flatMap((e) => e.devices.map((d) => [d, e.id]))
);

// 48 machines. Exactly three assigned devices fail compliance — the number the
// home queue and the device page both quote. Keep them in sync by construction.
const NON_COMPLIANT = new Set(["d-006", "d-023", "d-044"]);
const IN_TRANSIT = new Set(["d-047"]);
const RECOVERY = new Set(["d-048"]);

export const DEVICES: Device[] = Array.from({ length: 48 }, (_, i) => {
  const n = i + 1;
  const id = `d-${String(n).padStart(3, "0")}`;
  const [model, os] = models[n % 5];
  const owner = DEVICE_OWNER[id] ?? null;
  const bad = NON_COMPLIANT.has(id);
  const status: Device["status"] = !owner
    ? "Unassigned"
    : RECOVERY.has(id) ? "Recovery pending"
    : IN_TRANSIT.has(id) ? "In transit"
    : bad ? "Needs attention"
    : "Healthy";
  return {
    id,
    model,
    serial: `MO${(748213 + n * 977).toString(36).toUpperCase().padStart(8, "0")}`,
    assignedTo: owner,
    os,
    status,
    encrypted: !bad,
    lastCheckIn: IN_TRANSIT.has(id) ? "—" : bad ? "3 days ago" : n % 3 === 0 ? "4 hours ago" : "22 minutes ago",
    compliance: bad ? (n % 2 ? 72 : 88) : 100,
  };
});

export const appById = (id: string) => APPS.find((a) => a.id === id);
export const deviceById = (id: string) => DEVICES.find((d) => d.id === id);
