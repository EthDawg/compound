/** A fictional process configuration, not a Workday default or an authorisation system. */
export const WORKDAY_ROLES = {
  manager: "Manager",
  partner: "Compensation Partner",
  hr: "HR Partner",
  payroll: "Payroll Integration Owner",
} as const;
export type WorkdayRole = keyof typeof WORKDAY_ROLES;
export const WORKDAY_CASE = {
  id: "MO-COMP-204", worker: "Fatima Al-Rashid", workerId: "e-017",
  title: "Staff Firmware Engineer", organisation: "Hardware · Firmware · Austin",
  salary: 241000, currency: "USD", today: "2026-09-11", effective: "2026-10-01",
  limit: 5,
} as const;
const ACTION_ROLES = {
  "manager-approve": "manager", "manager-return": "manager",
  "partner-approve": "partner", "partner-return": "partner",
  "revise-standard": "hr", "revise-exception": "hr", submit: "hr",
  "send-payroll": "payroll", "fix-mapping": "payroll", "confirm-receipt": "payroll",
} as const satisfies Record<string, WorkdayRole>;
export type WorkdayAction = keyof typeof ACTION_ROLES;
export type WorkdayState = {
  increase: 4 | 8;
  stage: "manager" | "partner" | "returned" | "complete";
  mapping: boolean;
  payroll: "waiting" | "failed" | "sent" | "accepted";
  events: { action: WorkdayAction; role: WorkdayRole; detail: string }[];
};
export type WorkdayChoice = { role: WorkdayRole; asOf: "today" | "effective"; actions: WorkdayAction[] };
export const initialWorkdayState = (): WorkdayState => ({increase:8, stage:"manager", mapping:false, payroll:"waiting", events:[]});

export function canActWorkday(state: WorkdayState, role: WorkdayRole, action: WorkdayAction) {
  if (ACTION_ROLES[action] !== role || state.events.length >= 40) return false;
  switch (action) {
    case "manager-approve": case "manager-return": return state.stage === "manager";
    case "partner-approve": case "partner-return": return state.stage === "partner";
    case "revise-standard": return state.stage === "returned" && state.increase !== 4;
    case "revise-exception": return state.stage === "returned" && state.increase !== 8;
    case "submit": return state.stage === "returned";
    case "send-payroll": return state.stage === "complete" && (state.payroll === "waiting" || state.payroll === "failed" && state.mapping);
    case "fix-mapping": return state.payroll === "failed" && !state.mapping;
    case "confirm-receipt": return state.payroll === "sent" && state.mapping;
  }
}
export function applyWorkdayAction(state: WorkdayState, role: WorkdayRole, action: WorkdayAction): WorkdayState {
  if (!canActWorkday(state, role, action)) return state;
  const next = {...state}; let detail = "";
  switch (action) {
    case "manager-approve":
      next.stage = state.increase > WORKDAY_CASE.limit ? "partner" : "complete";
      detail = next.stage === "partner" ? "Manager approved 8%; the configured >5% condition requires Compensation Partner review." : "Manager approved 4%; the extra review condition did not apply. Core process completed.";
      break;
    case "partner-approve": next.stage = "complete"; detail = "Compensation Partner approved the 8% exception. Core process completed."; break;
    case "manager-return": case "partner-return":
      next.stage = "returned"; detail = "Sent back to HR Partner: reconsider the increase against the 5% delegated limit. Existing pay is unchanged."; break;
    case "revise-standard": next.increase = 4; detail = "HR Partner revised the proposal to 4%. It still needs resubmission and a fresh review."; break;
    case "revise-exception": next.increase = 8; detail = "HR Partner retained an 8% exception. It still needs resubmission and both review roles."; break;
    case "submit": next.stage = "manager"; detail = `HR Partner resubmitted ${state.increase}%. Review restarts with the Manager.`; break;
    case "send-payroll":
      next.payroll = state.mapping ? "sent" : "failed";
      detail = state.mapping ? "Corrected payload sent to the fictional payroll provider. A receipt is still outstanding." : "Payroll handoff rejected: cost centre US-204 has no provider mapping. Core approval remains complete.";
      break;
    case "fix-mapping": next.mapping = true; detail = "Integration Owner mapped US-204 to provider department FW-US. The failed handoff still needs retrying."; break;
    case "confirm-receipt": next.payroll = "accepted"; detail = "Provider receipt MO-ACK-204 confirms the salary and 1 October effective date were accepted. This is not a payment receipt."; break;
  }
  next.events = [...state.events, {action, role, detail}]; return next;
}
export function replayWorkday(actions: readonly WorkdayAction[]) {
  return actions.slice(0,40).reduce((state, action) => applyWorkdayAction(state, ACTION_ROLES[action], action), initialWorkdayState());
}
export function readWorkdayChoice(params: Pick<URLSearchParams,"get">): WorkdayChoice {
  const role = params.get("role");
  const raw = (params.get("steps") ?? "").split(",").filter((a): a is WorkdayAction => Object.hasOwn(ACTION_ROLES,a));
  // Replay rejects out-of-order approvals and receipts; URLs only restore possible demo states.
  const actions = replayWorkday(raw).events.map(e => e.action);
  return {role:role && Object.hasOwn(WORKDAY_ROLES,role) ? role as WorkdayRole : "manager", asOf:params.get("asof") === "effective" ? "effective" : "today", actions};
}
export function workdayQuery(choice: WorkdayChoice) {
  const q = new URLSearchParams();
  if (choice.role !== "manager") q.set("role",choice.role);
  if (choice.asOf !== "today") q.set("asof",choice.asOf);
  if (choice.actions.length) q.set("steps",choice.actions.join(","));
  return q.size ? `?${q}` : "";
}
export function workdayContextHref(href:string, currentPath:string, params:Pick<URLSearchParams,"get">) {
  const base="/companies/workday/";
  if(!currentPath.startsWith(base) || !href.startsWith(base) || href.includes("?"))return href;
  const [path,...fragment]=href.split("#");
  return `${path}${workdayQuery(readWorkdayChoice(params))}${fragment.length?`#${fragment.join("#")}`:""}`;
}
export function workdayResult(state: WorkdayState, asOf: WorkdayChoice["asOf"]) {
  const proposed = Math.round(WORKDAY_CASE.salary * (1 + state.increase / 100));
  const effective = state.stage === "complete" && asOf === "effective";
  return {
    proposed, current:effective ? proposed : WORKDAY_CASE.salary,
    provider:state.payroll === "accepted" && effective ? proposed : WORKDAY_CASE.salary,
    nextRole:state.stage === "manager" ? "manager" : state.stage === "partner" ? "partner" : state.stage === "returned" ? "hr" : "payroll",
    status:state.stage === "returned" ? "Returned for revision" : state.stage === "manager" ? "Manager review" : state.stage === "partner" ? "Compensation Partner review" : state.payroll === "accepted" ? "Approved · provider acknowledged" : "Approved · payroll handoff open",
  } as const;
}
