/** Scripted, fictional ServiceNow study. These transitions are not production integrations. */
export type IncidentPhase = "investigating" | "approved" | "executed" | "recovered" | "resolved";
export interface IncidentState { phase: IncidentPhase; inspected: boolean; health: "unknown" | "failed" | "healthy"; healthChecks: boolean[]; rationale: string }
export const INITIAL_INCIDENT: IncidentState = { phase: "investigating", inspected: false, health: "unknown", healthChecks: [], rationale: "" };
type IncidentAction = { type: "inspect" | "execute" | "resolve" | "reset" } | { type: "approve"; reason: string } | { type: "health"; healthy: boolean };
export function incidentReducer(state: IncidentState, action: IncidentAction): IncidentState {
  if (action.type === "reset") return INITIAL_INCIDENT;
  if (action.type === "inspect") return { ...state, inspected: true };
  if (action.type === "approve" && state.inspected && state.phase === "investigating" && action.reason.trim().length >= 10) return { ...state, phase: "approved", rationale: action.reason.trim() };
  if (action.type === "execute" && state.phase === "approved") return { ...state, phase: "executed" };
  if (action.type === "health" && state.phase === "executed") return { ...state, phase: action.healthy ? "recovered" : "executed", health: action.healthy ? "healthy" : "failed", healthChecks: [...state.healthChecks, action.healthy] };
  if (action.type === "resolve" && state.phase === "recovered" && state.health === "healthy") return { ...state, phase: "resolved" };
  return state;
}

export interface JourneyState { approved: boolean; dispatched: boolean; accessReceipt: "pending" | "failed" | "complete"; workplaceReady: boolean }
export const INITIAL_JOURNEY: JourneyState = { approved: false, dispatched: false, accessReceipt: "pending", workplaceReady: false };
type JourneyAction = { type: "approve" | "dispatch" | "workplace" | "reset" } | { type: "receipt"; success: boolean };
export function journeyReducer(state: JourneyState, action: JourneyAction): JourneyState {
  if (action.type === "reset") return INITIAL_JOURNEY;
  if (action.type === "approve") return { ...state, approved: true };
  if (action.type === "dispatch" && state.approved && state.accessReceipt !== "complete") return { ...state, dispatched: true, accessReceipt: "pending" };
  if (action.type === "receipt" && state.dispatched && state.accessReceipt === "pending") return { ...state, accessReceipt: action.success ? "complete" : "failed" };
  if (action.type === "workplace") return { ...state, workplaceReady: true };
  return state;
}
export const journeyComplete = (state: JourneyState) => state.approved && state.accessReceipt === "complete" && state.workplaceReady;

export type GovernanceState = { assessed: boolean; phase: "open" | "returned" | "approved" | "deployed"; decisionNote: string };
export const INITIAL_GOVERNANCE: GovernanceState = { assessed: false, phase: "open", decisionNote: "" };
type GovernanceAction = { type: "assess" | "receipt" | "reset" } | { type: "approve" | "return"; note: string };
export function governanceReducer(state: GovernanceState, action: GovernanceAction): GovernanceState {
  if (action.type === "reset") return INITIAL_GOVERNANCE;
  if (action.type === "assess" && state.phase === "open") return { ...state, assessed: true };
  if (action.type === "return" && state.phase === "open" && action.note.trim().length >= 10) return { ...state, phase: "returned", decisionNote: action.note.trim() };
  if (action.type === "approve" && state.phase === "open" && state.assessed && action.note.trim().length >= 10) return { ...state, phase: "approved", decisionNote: action.note.trim() };
  if (action.type === "receipt" && state.phase === "approved") return { ...state, phase: "deployed" };
  return state;
}
