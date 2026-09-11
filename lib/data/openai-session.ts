import { LAUNCH_SOURCES, PATCH_TESTS, patchBefore, patchResults } from './ai-scenarios';

export type OpenAIScene = 'work' | 'codex' | 'responses';
export type WorkSource = keyof typeof LAUNCH_SOURCES;
export type CodeFile = 'request.ts' | 'request.test.ts';
export type CodeView = 'branch' | 'last' | 'staged' | 'unstaged';
export const CODE_FILES: CodeFile[] = ['request.ts', 'request.test.ts'];
export const CODE_TESTS = [...PATCH_TESTS, 'A non-timeout error is returned without a retry'];
export type Lookup = 'found' | 'absent' | 'unavailable' | 'conflict';
export type Attempt = {
  number: number; amount: 2400 | 4800; inspected: boolean;
  phase: 'proposal' | 'approved' | 'denied' | 'rejected' | 'uncertain' | 'complete' | 'superseded';
  result: null | 'success' | 'rejection' | 'timeout'; lookup: Lookup | null;
};
export type OpenAIState = {
  work: { source: WorkSource; supportVersion: 1 | 2; inspected: Record<WorkSource, number>; scope: 'all' | 'anz'; artifactVersion: 0 | 1 | 2 };
  codex: { revision: 1 | 2; tested: number; reviewed: CodeFile[]; staged: CodeFile[]; committed: boolean; file: CodeFile; view: CodeView };
  responses: { attempts: Attempt[] };
};
export type OpenAIAction =
  | { type: 'work-source'; source: WorkSource }
  | { type: 'work-scope'; scope: 'all' | 'anz' }
  | { type: 'work-revise' | 'work-update' }
  | { type: 'codex-test' | 'codex-revise' | 'codex-commit' }
  | { type: 'codex-review' | 'codex-stage' | 'codex-unstage' | 'codex-file'; file: CodeFile }
  | { type: 'codex-view'; view: CodeView }
  | { type: 'responses-inspect' | 'responses-approve' | 'responses-deny' | 'responses-correct' | 'responses-retry' }
  | { type: 'responses-result'; result: 'success' | 'rejection' | 'timeout' }
  | { type: 'responses-lookup'; result: Lookup };
export type OpenAISession = { version: 1; events: OpenAIAction[] };
export const OPENAI_EVENT_LIMIT = 150;
const proposal = (number = 1, amount: 2400 | 4800 = 4800): Attempt => ({ number, amount, inspected: false, phase: 'proposal', result: null, lookup: null });
export function openAIInitial(): OpenAIState {
  return {
    work: { source: 'brief', supportVersion: 1, inspected: { brief: 1, scope: 0, support: 0 }, scope: 'all', artifactVersion: 0 },
    codex: { revision: 1, tested: 0, reviewed: [], staged: [], committed: false, file: 'request.ts', view: 'branch' },
    responses: { attempts: [proposal()] },
  };
}
export const currentAttempt = (state: OpenAIState) => state.responses.attempts[state.responses.attempts.length - 1];
export const workCanRevise = (work: OpenAIState['work']) => work.scope === 'anz' && work.inspected.scope === 1 && work.inspected.support === work.supportVersion && work.artifactVersion !== work.supportVersion;
export const workCurrent = (work: OpenAIState['work']) => work.artifactVersion > 0 && work.artifactVersion === work.supportVersion && work.scope === 'anz';
export const codeCanCommit = (code: OpenAIState['codex']) => code.tested === 2 && code.revision === 2 && CODE_FILES.every(file => code.reviewed.includes(file) && code.staged.includes(file)) && !code.committed;
export const canRetryAttempt = (attempt: Attempt) => attempt.phase === 'denied' || attempt.phase === 'rejected' || (attempt.phase === 'uncertain' && attempt.lookup === 'absent');

export function openAIReduce(state: OpenAIState, action: OpenAIAction): OpenAIState {
  if (!action || typeof action !== 'object' || typeof action.type !== 'string') return state;
  const work = state.work, code = state.codex, attempt = currentAttempt(state);
  if (action.type === 'work-source' && ['brief', 'scope', 'support'].includes(action.source)) {
    const version = action.source === 'support' ? work.supportVersion : 1;
    if (work.source === action.source && work.inspected[action.source] === version) return state;
    return { ...state, work: { ...work, source: action.source, inspected: { ...work.inspected, [action.source]: version } } };
  }
  if (action.type === 'work-scope' && ['all', 'anz'].includes(action.scope) && work.scope !== action.scope) return { ...state, work: { ...work, scope: action.scope, artifactVersion: 0 } };
  if (action.type === 'work-revise' && workCanRevise(work)) return { ...state, work: { ...work, artifactVersion: work.supportVersion } };
  if (action.type === 'work-update' && work.artifactVersion === 1 && work.supportVersion === 1) return { ...state, work: { ...work, supportVersion: 2 } };
  if (action.type === 'codex-view' && ['branch', 'last', 'staged', 'unstaged'].includes(action.view) && code.view !== action.view) return { ...state, codex: { ...code, view: action.view } };
  if (action.type === 'codex-file' && CODE_FILES.includes(action.file) && code.file !== action.file) return { ...state, codex: { ...code, file: action.file } };
  if (action.type.startsWith('codex-') && !code.committed) {
    if (action.type === 'codex-test' && code.tested !== code.revision) return { ...state, codex: { ...code, tested: code.revision } };
    if (action.type === 'codex-revise' && code.revision === 1 && code.tested === 1) return { ...state, codex: { ...code, revision: 2, tested: 0, reviewed: [], staged: [] } };
    if (action.type === 'codex-review' && CODE_FILES.includes(action.file) && !code.reviewed.includes(action.file) && code.file === action.file && codeFiles(code).includes(action.file)) return { ...state, codex: { ...code, reviewed: [...code.reviewed, action.file] } };
    if (action.type === 'codex-stage' && CODE_FILES.includes(action.file) && code.reviewed.includes(action.file) && code.tested === 2 && !code.staged.includes(action.file)) return { ...state, codex: { ...code, staged: [...code.staged, action.file] } };
    if (action.type === 'codex-unstage' && code.staged.includes(action.file)) return { ...state, codex: { ...code, staged: code.staged.filter(file => file !== action.file) } };
    if (action.type === 'codex-commit' && codeCanCommit(code)) return { ...state, codex: { ...code, committed: true, staged: [], view: 'branch' } };
  }
  let next = attempt;
  if (action.type === 'responses-inspect' && attempt.phase === 'proposal' && !attempt.inspected) next = { ...attempt, inspected: true };
  if (action.type === 'responses-approve' && attempt.phase === 'proposal' && attempt.inspected && attempt.amount === 2400) next = { ...attempt, phase: 'approved' };
  if (action.type === 'responses-deny' && attempt.phase === 'proposal') next = { ...attempt, phase: 'denied' };
  if (action.type === 'responses-correct' && attempt.phase === 'proposal' && attempt.inspected && attempt.amount === 4800 && state.responses.attempts.length < 8) {
    return { ...state, responses: { attempts: [...state.responses.attempts.slice(0, -1), { ...attempt, phase: 'superseded' }, proposal(attempt.number + 1, 2400)] } };
  }
  if (action.type === 'responses-result' && attempt.phase === 'approved' && ['success', 'rejection', 'timeout'].includes(action.result)) next = { ...attempt, phase: action.result === 'success' ? 'complete' : action.result === 'rejection' ? 'rejected' : 'uncertain', result: action.result };
  if (action.type === 'responses-lookup' && attempt.phase === 'uncertain' && ['found', 'absent', 'unavailable', 'conflict'].includes(action.result) && attempt.lookup !== action.result) next = { ...attempt, lookup: action.result, phase: action.result === 'found' ? 'complete' : 'uncertain' };
  if (action.type === 'responses-retry' && canRetryAttempt(attempt) && state.responses.attempts.length < 8) return { ...state, responses: { attempts: [...state.responses.attempts, proposal(attempt.number + 1, attempt.amount)] } };
  return next === attempt ? state : { ...state, responses: { attempts: [...state.responses.attempts.slice(0, -1), next] } };
}
export function workSources(work: OpenAIState['work']) {
  return { ...LAUNCH_SOURCES, support: { title: LAUNCH_SOURCES.support.title, text: work.supportVersion === 1 ? LAUNCH_SOURCES.support.text : 'Updated support roster: Australia remains staffed. New Zealand coverage is now unconfirmed after a roster change. No change to the signed scope has been approved. Resolve coverage or obtain a revised launch decision before release.' } };
}
export function launchArtifact(work: OpenAIState['work']) {
  if (!work.artifactVersion) return '# Harbour launch decision — unreviewed draft\n\nProposed launch: five regions, 1 October 2026.\nBasis: the old working brief; signed scope and support readiness are not reconciled in this artifact.';
  const changed = work.artifactVersion === 2;
  return `# Harbour launch decision — revision ${changed ? 3 : 2}\n\nApproved scope: Australia and New Zealand.\nTarget date: 15 October 2026.\n\nReadiness: ${changed ? 'Australia staffed; New Zealand coverage unconfirmed in the updated support roster. The signed ANZ scope remains unchanged.' : 'Australia and New Zealand support coverage is staffed.'}\n\nNext decision: ${changed ? 'Hold release pending restored New Zealand coverage or an owner-approved change to the launch plan. This document does not silently narrow the signed scope to Australia.' : 'Obtain launch-owner sign-off before release.'}\n\nSources: Signed scope.txt v1; Support readiness.md v${work.artifactVersion}. Launch brief.md is superseded.\n\nFictional planning artifact. No launch is authorised or performed.`;
}
export function codeFiles(code: OpenAIState['codex']) {
  if (code.committed && ['staged', 'unstaged'].includes(code.view)) return [];
  if (code.view === 'last' && code.revision === 2) return ['request.ts'] as CodeFile[];
  return CODE_FILES.filter(file => code.view === 'staged' ? code.staged.includes(file) : code.view === 'unstaged' ? !code.staged.includes(file) : true);
}
export function codeDiff(code: OpenAIState['codex'], file: CodeFile) {
  if (file === 'request.test.ts') return { before: '// no retry coverage', after: "it('preserves success', preserveResult);\nit('retries one transient timeout', recoverOnce);\nit('stops on a second timeout', boundAttempts);\nit('returns non-timeout errors', doNotRetry);", note: 'Illustrative test outline. The four results are fixed fixtures; this browser does not execute a repository test suite.' };
  return { before: patchBefore(code.revision, code.view), after: code.revision === 1 ? 'while (true) {\n  try { return await sendRequest(); }\n  catch (e) { if (!isTimeout(e)) throw e; }\n}' : 'for (let attempt = 0; attempt < 2; attempt++) {\n  try { return await sendRequest(); }\n  catch (e) {\n    if (!isTimeout(e) || attempt === 1) throw e;\n  }\n}', note: 'This scenario retries a read-only availability lookup. A timed-out write needs a separate recovery contract.' };
}
export const codeResults = (code: OpenAIState['codex']) => [...patchResults(code.revision), true];
export const attemptIds = (attempt: Attempt) => ({ response: `resp_demo_${attempt.number}`, approval: `mcpr_demo_${attempt.number}`, call: `mcp_demo_${attempt.number}` });
export const refundArguments = (attempt: Attempt) => ({ account_id: 'MER-104', amount_minor: attempt.amount, currency: 'AUD', reason: 'Duplicate service charge', idempotency_key: 'demo-refund-104' });
export const refundReceipt = (attempt: Attempt) => ({ draft_id: 'DRAFT-204', account_id: 'MER-104', amount_minor: attempt.amount, currency: 'AUD', idempotency_key: 'demo-refund-104', status: 'awaiting_review', refunded: false });
export function apiItems(attempt: Attempt) {
  const ids = attemptIds(attempt);
  return {
    proposalOutput: { id: ids.approval, type: 'mcp_approval_request', name: 'create_refund_draft', server_label: 'meridian_support', arguments: JSON.stringify(refundArguments(attempt)) },
    continuationInput: ['approved', 'complete', 'denied', 'rejected', 'uncertain'].includes(attempt.phase) ? { previous_response_id: ids.response, input: [{ type: 'mcp_approval_response', approval_request_id: ids.approval, approve: attempt.phase !== 'denied' }] } : null,
    callOutput: attempt.result ? { id: ids.call, type: 'mcp_call', name: 'create_refund_draft', server_label: 'meridian_support', approval_request_id: ids.approval, arguments: JSON.stringify(refundArguments(attempt)), output: attempt.result === 'success' ? JSON.stringify(refundReceipt(attempt)) : null, error: attempt.result === 'timeout' ? 'Transport timeout; completion unknown' : attempt.result === 'rejection' ? 'Request rejected before execution' : null } : null,
  };
}
export function openAIStatus(state: OpenAIState): Record<OpenAIScene, string> {
  const work = state.work, code = state.codex, attempt = currentAttempt(state);
  return {
    work: work.artifactVersion && !workCurrent(work) ? 'Source changed' : work.artifactVersion === 2 ? 'Release blocker recorded' : work.artifactVersion === 1 ? 'Draft reconciled' : 'Draft needs review',
    codex: code.committed ? 'Committed locally' : code.staged.length ? `${code.staged.length}/2 files staged` : code.tested === 2 ? 'Checks pass · review open' : code.tested === 1 ? 'Retry check failed' : `Revision ${code.revision} · untested`,
    responses: ({ proposal: 'Proposal needs review', approved: 'Awaiting result', denied: 'Call denied', rejected: 'Rejected before execution', uncertain: attempt.lookup === 'absent' ? 'No draft confirmed' : 'Outcome uncertain', complete: 'Draft returned', superseded: 'Proposal superseded' })[attempt.phase],
  };
}
export const openAIState = (session: OpenAISession) => session.events.reduce(openAIReduce, openAIInitial());
export function readOpenAISession(raw: string | null): OpenAISession {
  const empty: OpenAISession = { version: 1, events: [] };
  if (!raw || raw.length > 150000) return empty;
  try {
    const input = JSON.parse(raw);
    if (!input || input.version !== 1 || !Array.isArray(input.events)) return empty;
    let state = openAIInitial();
    for (const action of input.events.slice(0, OPENAI_EVENT_LIMIT)) {
      const next = openAIReduce(state, action);
      if (next !== state) { empty.events.push(action); state = next; }
    }
    return empty;
  } catch { return empty; }
}
export function recordOpenAIAction(session: OpenAISession, action: OpenAIAction | { type: 'reset'; scene: OpenAIScene }): OpenAISession {
  if (action.type === 'reset') {
    if (!['work', 'codex', 'responses'].includes(action.scene)) return session;
    const events = session.events.filter(event => !event.type.startsWith(`${action.scene}-`));
    return events.length === session.events.length ? session : { ...session, events };
  }
  if (session.events.length >= OPENAI_EVENT_LIMIT) return session;
  const state = openAIState(session);
  return openAIReduce(state, action) === state ? session : { ...session, events: [...session.events, action] };
}
