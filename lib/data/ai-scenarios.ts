/** Fictional, deterministic demonstrations. No model or external business system is connected. */
export const RENEWAL_SOURCES = {
  notes: { title: "Account notes.md", text: "Working assumption: renewal on 1 November. Confirm against the signed agreement before sending the brief." },
  contract: { title: "Signed agreement.txt", text: "Clause 4. Renewal date: 1 October 2026. Any commercial concession requires the account owner's approval." },
  usage: { title: "Usage summary.csv", text: "Active seats: 84 of 100. Two teams account for 70% of usage. These fictional figures describe adoption, not intent to renew." },
} as const;
export const renewalReady = (shared: boolean, inspected: string[], date: string) => shared && inspected.includes("contract") && inspected.includes("usage") && date === "1 October 2026";

export const LAUNCH_SOURCES = {
  brief: { title: "Launch brief.md", text: "Working brief: launch to all five regions on 1 October. This note predates the signed scope." },
  scope: { title: "Signed scope.txt", text: "Approved scope: Australia and New Zealand only. Target launch: 15 October 2026. Release still requires the launch owner's sign-off." },
  support: { title: "Support readiness.md", text: "Australia and New Zealand coverage is staffed. Coverage for other regions is unconfirmed." },
} as const;
export const launchReady = (inspected: string[], scope: string) => inspected.includes("scope") && inspected.includes("support") && scope === "anz";

export interface PatchState { revision: 1 | 2; inspected: number; tested: number; permission: boolean; manual: boolean; accepted: boolean }
export const patchInitial = (permission = false, manual = false): PatchState => ({ revision: 1, inspected: 0, tested: 0, permission, manual, accepted: false });
type PatchAction = { type: "inspect" | "permission" | "test" | "revise" | "accept" };
export function patchReducer(state: PatchState, action: PatchAction): PatchState {
  if (state.accepted) return state;
  if (action.type === "inspect") return { ...state, inspected: state.revision };
  if (action.type === "permission") return { ...state, permission: true };
  if (action.type === "test" && state.permission && (!state.manual || state.inspected === state.revision)) return { ...state, tested: state.revision };
  if (action.type === "revise" && state.revision === 1) return { ...state, revision: 2, inspected: 0, tested: 0 };
  if (action.type === "accept" && state.inspected === state.revision && state.tested === 2) return { ...state, accepted: true };
  return state;
}
export const PATCH_TESTS = ["Successful request preserves result", "Transient timeout retries once", "Second timeout stops after the retry"];
export const patchResults = (revision: number) => [true, true, revision === 2];
export const patchBefore = (revision: number, scope: string) => revision === 2 && scope === "last"
  ? 'while (true) {\n  try { return await sendRequest(); }\n  catch (e) { if (!isTimeout(e)) throw e; }\n}'
  : 'return await sendRequest();';

export interface ToolState { phase: "proposal" | "approved" | "denied" | "failed" | "complete"; inspected: boolean; receipt: string | null }
export const INITIAL_TOOL: ToolState = { phase: "proposal", inspected: false, receipt: null };
type ToolAction = { type: "inspect" | "approve" | "deny" | "retry" | "reset" } | { type: "result"; success: boolean };
export function toolReducer(state: ToolState, action: ToolAction): ToolState {
  if (action.type === "reset") return INITIAL_TOOL;
  if (action.type === "inspect" && state.phase === "proposal") return { ...state, inspected: true };
  if (action.type === "approve" && state.phase === "proposal" && state.inspected) return { ...state, phase: "approved" };
  if (action.type === "deny" && state.phase === "proposal") return { ...state, phase: "denied" };
  if (action.type === "result" && state.phase === "approved") return { ...state, phase: action.success ? "complete" : "failed", receipt: action.success ? "DRAFT-204" : null };
  if (action.type === "retry" && state.phase === "failed") return { ...INITIAL_TOOL };
  return state;
}

export const AUDIO_SCRIPTS = {
  original: "Welcome to Meridian. Your team can now review every request in one place. Open the workspace to see what needs your attention.",
  revised: "Welcome to Meridian. Your team can now review every request in one place. Start with the requests assigned to you, then check what is waiting on another team.",
} as const;
export type Take = { script: keyof typeof AUDIO_SCRIPTS; pace: "measured" | "brisk" };
export const takeKey = (take: Take) => `${take.script}-${take.pace}`;
export const takeCurrent = (settings: Take, rendered: string | null) => rendered === takeKey(settings);

export type DubReview = { language: "es" | "pl"; generated: boolean; sourceReviewed: boolean; targetReviewed: boolean; verdict: "pending" | "issue" | "accepted" };
export const dubInitial = (language: "es" | "pl" = "es"): DubReview => ({ language, generated: false, sourceReviewed: false, targetReviewed: false, verdict: "pending" });
export const dubCanAccept = (state: DubReview) => state.generated && state.sourceReviewed && state.targetReviewed && state.verdict === "pending";

export const AGENT_TESTS = ["Corrected arrival date reaches the tool", "Missing booking reference asks a question", "Provider error transfers to a person"];
export const agentTestResults = (repair: boolean) => [repair, true, true];
export const canReleaseAgent = (repair: boolean, testedRepair: boolean | null, reviewed: boolean) => repair && testedRepair === repair && reviewed;
