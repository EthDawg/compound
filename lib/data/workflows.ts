export interface Workflow {
  id: string; name: string; trigger: string; scope: string; owner: string;
  actions: { system: string; verb: string; detail: string }[];
  runs30d: number; enabled: boolean; category: "HR" | "IT" | "Finance" | "Compliance";
}

export const WORKFLOWS: Workflow[] = [
  {
    id: "w-01", name: "New hire — full provisioning", trigger: "Employee.status → Onboarding", scope: "All entities", owner: "e-005", category: "HR", runs30d: 11, enabled: true,
    actions: [
      { system: "Payroll", verb: "Enroll", detail: "Assign pay group + cost center from department × entity" },
      { system: "Benefits", verb: "Open", detail: "30-day election window, plans filtered by country" },
      { system: "Devices", verb: "Ship", detail: "Laptop per role template, pre-enrolled in MDM" },
      { system: "Apps", verb: "Grant", detail: "Baseline + department bundle via SCIM" },
      { system: "Spend", verb: "Issue", detail: "Virtual card with policy limit from level" },
      { system: "Identity", verb: "Create", detail: "SSO account, group membership, manager in directory" },
      { system: "Compliance", verb: "Assign", detail: "Country-specific training + I-9 / right-to-work" },
    ],
  },
  {
    id: "w-02", name: "Termination — same-minute revoke", trigger: "Employee.status → Offboarding", scope: "All entities", owner: "e-013", category: "IT", runs30d: 4, enabled: true,
    actions: [
      { system: "Apps", verb: "Revoke", detail: "All SCIM + SAML sessions killed, tokens invalidated" },
      { system: "Devices", verb: "Lock", detail: "Remote lock + wipe scheduled, return label issued" },
      { system: "Spend", verb: "Freeze", detail: "Card frozen, open expenses routed to manager" },
      { system: "Payroll", verb: "Compute", detail: "Final pay incl. accrued PTO per jurisdiction rules" },
      { system: "Benefits", verb: "Trigger", detail: "COBRA / statutory continuation notice" },
      { system: "Identity", verb: "Suspend", detail: "Mail delegated to manager for 30 days, then archived" },
    ],
  },
  {
    id: "w-03", name: "Department change — permission recompute", trigger: "Employee.dept changed", scope: "All entities", owner: "e-013", category: "IT", runs30d: 7, enabled: true,
    actions: [
      { system: "Apps", verb: "Diff", detail: "Remove old dept bundle, add new, keep individual grants" },
      { system: "Payroll", verb: "Reclass", detail: "Cost center change effective next period" },
      { system: "Spend", verb: "Repoint", detail: "New approval chain + policy from new department" },
      { system: "Identity", verb: "Move", detail: "Groups, org chart, directory metadata" },
    ],
  },
  {
    id: "w-04", name: "Comp change over threshold — approval chain", trigger: "Employee.salary Δ > 8%", scope: "All entities", owner: "e-005", category: "HR", runs30d: 9, enabled: true,
    actions: [
      { system: "Approvals", verb: "Route", detail: "Manager → dept head → Finance → CEO if > 15%" },
      { system: "Payroll", verb: "Stage", detail: "Effective-dated, holds until all approvals clear" },
      { system: "Equity", verb: "Flag", detail: "Refresh grant review if level also changed" },
    ],
  },
  {
    id: "w-05", name: "Device out of compliance > 72h", trigger: "Device.compliance < 100 for 72h", scope: "All entities", owner: "e-032", category: "Compliance", runs30d: 6, enabled: true,
    actions: [
      { system: "Apps", verb: "Restrict", detail: "Conditional access blocks high-risk apps from that device" },
      { system: "Slack", verb: "Notify", detail: "DM to employee + manager with the specific failing check" },
      { system: "Ticketing", verb: "Open", detail: "IT ticket auto-assigned with device + user context" },
    ],
  },
  {
    id: "w-06", name: "Contractor → employee conversion", trigger: "Employee.type Contractor → Full-time", scope: "All entities", owner: "e-005", category: "Compliance", runs30d: 2, enabled: true,
    actions: [
      { system: "Legal", verb: "Generate", detail: "Country-correct employment agreement, IP assignment" },
      { system: "Payroll", verb: "Migrate", detail: "Invoice-based → payroll, withholding registered" },
      { system: "Benefits", verb: "Open", detail: "Newly eligible, election window opens" },
      { system: "Equity", verb: "Convert", detail: "Advisor grant → employee grant, vesting recalculated" },
      { system: "Spend", verb: "Upgrade", detail: "Contractor policy → standard policy" },
    ],
  },
  {
    id: "w-07", name: "Unused seat reclaim", trigger: "App access unused 45 days", scope: "Paid apps only", owner: "e-013", category: "Finance", runs30d: 23, enabled: true,
    actions: [
      { system: "Apps", verb: "Propose", detail: "Manager gets one-click confirm to release seat" },
      { system: "Spend", verb: "Forecast", detail: "Projected savings written to the software budget line" },
    ],
  },
  {
    id: "w-08", name: "Multi-state tax registration check", trigger: "Employee.location changed → new state", scope: "US entity", owner: "e-012", category: "Compliance", runs30d: 3, enabled: true,
    actions: [
      { system: "Payroll", verb: "Check", detail: "Is the entity registered in the new state? If not, open registration" },
      { system: "Compliance", verb: "Assign", detail: "State-specific policy acknowledgements" },
      { system: "Benefits", verb: "Validate", detail: "Plan network coverage in new state" },
    ],
  },
];

// ── The downstream model: change one field, watch N systems move ──────────────
export interface Ripple { system: string; effect: string; latency: string; kind: "hr" | "it" | "fin" | "legal"; }
export interface FieldChange { field: string; label: string; example: string; ripples: Ripple[]; }

export const FIELD_CHANGES: FieldChange[] = [
  {
    field: "dept", label: "Department", example: "Hardware → Engineering",
    ripples: [
      { system: "App access", effect: "Altium + Zemax revoked; GitHub, Linear, Datadog granted", latency: "~40s", kind: "it" },
      { system: "Cost center", effect: "HW-US → ENG-US on the next payroll run", latency: "next run", kind: "fin" },
      { system: "Approval chain", effect: "Expenses now route to VP Engineering", latency: "instant", kind: "fin" },
      { system: "Spend policy", effect: "Engineering policy limits replace Hardware limits", latency: "instant", kind: "fin" },
      { system: "Org chart", effect: "Reporting line and directory metadata rewritten", latency: "instant", kind: "hr" },
      { system: "Review cycle", effect: "Moved into the Engineering calibration group", latency: "instant", kind: "hr" },
    ],
  },
  {
    field: "location", label: "Work location", example: "Austin, TX → Denver, CO",
    ripples: [
      { system: "Tax withholding", effect: "CO income tax + local jurisdictions applied", latency: "next run", kind: "fin" },
      { system: "Entity registration", effect: "Checks CO registration; opens filing if absent", latency: "~2 days", kind: "legal" },
      { system: "Benefits network", effect: "Validates plan coverage in the new state", latency: "instant", kind: "hr" },
      { system: "Leave policy", effect: "CO paid family leave accrual begins", latency: "instant", kind: "hr" },
      { system: "Compliance training", effect: "CO-specific harassment training assigned", latency: "instant", kind: "legal" },
      { system: "Comp band", effect: "Geo differential flagged for review, not auto-applied", latency: "manual", kind: "hr" },
    ],
  },
  {
    field: "status", label: "Employment status", example: "Active → Offboarding",
    ripples: [
      { system: "SSO sessions", effect: "All active sessions terminated across 27 apps", latency: "~8s", kind: "it" },
      { system: "Device", effect: "Remote lock, wipe scheduled, return label mailed", latency: "~30s", kind: "it" },
      { system: "Corporate card", effect: "Frozen; open transactions routed to manager", latency: "instant", kind: "fin" },
      { system: "Final pay", effect: "Accrued PTO paid out per jurisdiction rule", latency: "next run", kind: "fin" },
      { system: "Benefits", effect: "COBRA or statutory continuation notice generated", latency: "~1 day", kind: "hr" },
      { system: "Equity", effect: "Post-termination exercise window starts, cap table updated", latency: "instant", kind: "legal" },
    ],
  },
  {
    field: "managerId", label: "Manager", example: "Dana Whitfield → Ravi Sundaram",
    ripples: [
      { system: "Approvals", effect: "PTO, expense and access requests re-route", latency: "instant", kind: "hr" },
      { system: "Org chart", effect: "Subtree moves with them, including their reports", latency: "instant", kind: "hr" },
      { system: "Review cycle", effect: "In-flight review reassigned, prior feedback retained", latency: "instant", kind: "hr" },
      { system: "Access reviews", effect: "New manager inherits the quarterly attestation queue", latency: "next cycle", kind: "it" },
    ],
  },
  {
    field: "salary", label: "Compensation", example: "$218,000 → $241,000",
    ripples: [
      { system: "Approval chain", effect: "10.6% — routes manager → VP → Finance", latency: "instant", kind: "fin" },
      { system: "Payroll", effect: "Effective-dated, staged until approvals clear", latency: "on approval", kind: "fin" },
      { system: "Benefits", effect: "Life & disability coverage recalculated on new base", latency: "next cycle", kind: "hr" },
      { system: "Budget", effect: "Department run-rate and forecast updated", latency: "instant", kind: "fin" },
      { system: "Comp band", effect: "Position in band recomputed; flags if above range", latency: "instant", kind: "hr" },
    ],
  },
];
