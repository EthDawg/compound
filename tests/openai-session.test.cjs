const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, f);
const { openAIInitial, openAIReduce, workCanRevise, workCurrent, launchArtifact, workSources, codeCanCommit, codeFiles, codeDiff, codeResults, currentAttempt, attemptIds, apiItems, refundArguments, canRetryAttempt, openAIState, openAIStatus, readOpenAISession, recordOpenAIAction, OPENAI_EVENT_LIMIT } = require('../lib/data/openai-session.ts');
const act = (state, ...actions) => actions.reduce(openAIReduce, state);
const action = type => ({ type });
const revisedWork = () => act(openAIInitial(), { type: 'work-source', source: 'scope' }, { type: 'work-source', source: 'support' }, { type: 'work-scope', scope: 'anz' }, action('work-revise'));
const corrected = () => act(openAIInitial(), action('responses-inspect'), action('responses-correct'));
const approved = () => act(corrected(), action('responses-inspect'), action('responses-approve'));
const fixedCode = () => act(openAIInitial(), action('codex-test'), action('codex-revise'), action('codex-test'));

test('a changed source invalidates the artifact without silently changing signed scope', () => {
  const initial = openAIInitial();
  assert.equal(openAIReduce(initial, action('work-revise')), initial);
  let state = revisedWork();
  assert.equal(workCurrent(state.work), true);
  const original = launchArtifact(state.work);
  assert.match(original, /Australia and New Zealand support coverage is staffed/);
  state = openAIReduce(state, action('work-update'));
  assert.equal(workCurrent(state.work), false);
  assert.equal(state.work.scope, 'anz');
  assert.equal(state.work.inspected.support, 1);
  assert.equal(workCanRevise(state.work), false);
  assert.equal(launchArtifact(state.work), original, 'old artifact remains inspectable');
  assert.equal(openAIReduce(state, action('work-revise')), state);
  assert.match(workSources(state.work).support.text, /New Zealand coverage is now unconfirmed/);
  state = act(state, { type: 'work-source', source: 'support' }, action('work-revise'));
  assert.equal(workCurrent(state.work), true);
  assert.equal(state.work.artifactVersion, 2);
  assert.match(launchArtifact(state.work), /Hold release pending restored New Zealand coverage/);
  assert.match(launchArtifact(state.work), /signed ANZ scope remains unchanged/);
  assert.match(launchArtifact(state.work), /Support readiness.md v2/);
  assert.equal(openAIStatus(state).work, 'Release blocker recorded');
  state = openAIReduce(state, { type: 'work-scope', scope: 'all' });
  assert.equal(workCurrent(state.work), false);
  assert.equal(workCanRevise(state.work), false);
});

test('source viewing and scope selection cannot bypass the other evidence', () => {
  for (const sources of [[], ['brief'], ['scope'], ['support']]) {
    const state = act(openAIInitial(), ...sources.map(source => ({ type: 'work-source', source })), { type: 'work-scope', scope: 'anz' });
    assert.equal(workCanRevise(state.work), false);
    assert.equal(openAIReduce(state, action('work-revise')), state);
  }
  const both = act(openAIInitial(), { type: 'work-source', source: 'scope' }, { type: 'work-source', source: 'support' });
  assert.equal(workCanRevise(both.work), false, 'the old scope still needs correction');
});

test('a Codex revision clears stale checks and file review; the complete change needs both files', () => {
  let state = act(openAIInitial(), { type: 'codex-review', file: 'request.ts' }, action('codex-test'));
  assert.deepEqual(codeResults(state.codex), [true, true, false, true]);
  assert.equal(openAIReduce(state, { type: 'codex-stage', file: 'request.ts' }), state);
  state = openAIReduce(state, action('codex-revise'));
  assert.deepEqual(state.codex.reviewed, []);
  assert.equal(state.codex.tested, 0);
  state = act(state, action('codex-test'), { type: 'codex-review', file: 'request.ts' }, { type: 'codex-stage', file: 'request.ts' });
  assert.equal(codeCanCommit(state.codex), false);
  assert.equal(openAIStatus(state).codex, '1/2 files staged');
  assert.equal(openAIReduce(state, { type: 'codex-review', file: 'request.test.ts' }), state, 'a different file must be opened to review it');
  state = act(state, { type: 'codex-file', file: 'request.test.ts' }, { type: 'codex-review', file: 'request.test.ts' }, { type: 'codex-stage', file: 'request.test.ts' });
  assert.equal(codeCanCommit(state.codex), true);
  const unstaged = openAIReduce(state, { type: 'codex-unstage', file: 'request.ts' });
  assert.equal(codeCanCommit(unstaged.codex), false);
  assert.equal(unstaged.codex.tested, 2, 'unstaging does not change the tested working tree');
  state = openAIReduce(state, action('codex-commit'));
  assert.equal(state.codex.committed, true);
  assert.deepEqual(state.codex.staged, []);
  assert.deepEqual(codeFiles({ ...state.codex, view: 'staged' }), []);
  assert.deepEqual(codeFiles({ ...state.codex, view: 'unstaged' }), []);
  assert.equal(codeFiles({ ...state.codex, view: 'branch' }).length, 2);
  assert.equal(openAIReduce(state, action('codex-revise')), state);
});

test('review scopes describe the index, base and actual latest turn', () => {
  let state = fixedCode();
  assert.deepEqual(codeFiles({ ...state.codex, view: 'last' }), ['request.ts'], 'the unchanged test file is not in the second turn');
  assert.match(codeDiff({ ...state.codex, view: 'last' }, 'request.ts').before, /while \(true\)/);
  assert.equal(codeDiff({ ...state.codex, view: 'branch' }, 'request.ts').before, 'return await sendRequest();');
  state = act(state, { type: 'codex-review', file: 'request.ts' }, { type: 'codex-stage', file: 'request.ts' });
  assert.deepEqual(codeFiles({ ...state.codex, view: 'staged' }), ['request.ts']);
  assert.deepEqual(codeFiles({ ...state.codex, view: 'unstaged' }), ['request.test.ts']);
});

test('approval applies to a new exact proposal, never an overwritten amount or stale inspection', () => {
  let state = openAIInitial();
  assert.equal(openAIReduce(state, action('responses-approve')), state);
  assert.equal(openAIReduce(state, action('responses-correct')), state);
  state = openAIReduce(state, action('responses-inspect'));
  assert.equal(openAIReduce(state, action('responses-approve')), state, 'invoice establishes only the duplicate amount');
  const old = attemptIds(currentAttempt(state));
  state = openAIReduce(state, action('responses-correct'));
  assert.equal(state.responses.attempts[0].phase, 'superseded');
  assert.notEqual(attemptIds(currentAttempt(state)).approval, old.approval);
  assert.equal(currentAttempt(state).amount, 2400);
  assert.equal(currentAttempt(state).inspected, false);
  assert.equal(openAIReduce(state, action('responses-approve')), state);
  state = act(state, action('responses-inspect'), action('responses-approve'));
  const items = apiItems(currentAttempt(state)), ids = attemptIds(currentAttempt(state));
  assert.equal(items.continuationInput.previous_response_id, ids.response);
  assert.equal(items.continuationInput.input[0].approval_request_id, ids.approval);
  assert.equal(items.continuationInput.input[0].approve, true);
  assert.equal(items.callOutput, null);
  assert.equal(openAIReduce(state, action('responses-correct')), state, 'cannot edit an approved dispatch');
});

test('denial, provider rejection and a lost reply establish different facts', () => {
  let denied = openAIReduce(corrected(), action('responses-deny'));
  assert.equal(openAIReduce(denied, { type: 'responses-result', result: 'success' }), denied);
  assert.equal(apiItems(currentAttempt(denied)).continuationInput.input[0].approve, false);
  assert.equal(apiItems(currentAttempt(denied)).callOutput, null);
  const rejected = openAIReduce(approved(), { type: 'responses-result', result: 'rejection' });
  assert.equal(canRetryAttempt(currentAttempt(rejected)), true);
  assert.equal(apiItems(currentAttempt(rejected)).callOutput.output, null);
  const uncertain = openAIReduce(approved(), { type: 'responses-result', result: 'timeout' });
  assert.equal(canRetryAttempt(currentAttempt(uncertain)), false);
  assert.equal(openAIReduce(uncertain, action('responses-retry')), uncertain);
  assert.equal(openAIReduce(uncertain, { type: 'responses-result', result: 'success' }), uncertain);
});

test('reconciliation can find the original draft without rewriting the failed call or duplicating it', () => {
  let state = openAIReduce(approved(), { type: 'responses-result', result: 'timeout' });
  const count = state.responses.attempts.length;
  for (const result of ['unavailable', 'conflict']) {
    state = openAIReduce(state, { type: 'responses-lookup', result });
    assert.equal(currentAttempt(state).phase, 'uncertain');
    assert.equal(canRetryAttempt(currentAttempt(state)), false);
  }
  state = openAIReduce(state, { type: 'responses-lookup', result: 'found' });
  assert.equal(currentAttempt(state).phase, 'complete');
  assert.equal(state.responses.attempts.length, count);
  assert.equal(apiItems(currentAttempt(state)).callOutput.output, null, 'recovery evidence is separate from the timed-out API result');
  assert.match(apiItems(currentAttempt(state)).callOutput.error, /unknown/);
  assert.equal(openAIReduce(state, action('responses-retry')), state);
  assert.equal(openAIReduce(state, { type: 'responses-lookup', result: 'absent' }), state);
});

test('only confirmed non-creation permits a fresh approved attempt after timeout', () => {
  let state = act(approved(), { type: 'responses-result', result: 'timeout' }, { type: 'responses-lookup', result: 'absent' });
  const prior = currentAttempt(state);
  state = openAIReduce(state, action('responses-retry'));
  assert.notEqual(attemptIds(currentAttempt(state)).approval, attemptIds(prior).approval);
  assert.deepEqual(refundArguments(currentAttempt(state)), refundArguments(prior), 'same operation and amount remain identifiable');
  assert.equal(currentAttempt(state).inspected, false);
  assert.equal(openAIReduce(state, { type: 'responses-result', result: 'success' }), state);
  state = act(state, action('responses-inspect'), action('responses-approve'), { type: 'responses-result', result: 'success' });
  const receipt = JSON.parse(apiItems(currentAttempt(state)).callOutput.output);
  assert.equal(receipt.refunded, false);
  assert.equal(receipt.amount_minor, 2400);
  assert.equal(receipt.status, 'awaiting_review');
});

test('session replay rejects impossible progress and scene resets do not erase other work', () => {
  let session = readOpenAISession(null);
  assert.equal(recordOpenAIAction(session, { type: 'reset', scene: 'work' }), session, 'empty reset is a no-op');
  for (const event of [{ type: 'work-source', source: 'scope' }, { type: 'codex-test' }, { type: 'responses-inspect' }, { type: 'responses-correct' }]) session = recordOpenAIAction(session, event);
  const restored = readOpenAISession(JSON.stringify(session));
  assert.deepEqual(openAIState(restored), openAIState(session));
  const reset = openAIState(recordOpenAIAction(session, { type: 'reset', scene: 'codex' }));
  assert.deepEqual(reset.codex, openAIInitial().codex);
  assert.deepEqual(reset.work, openAIState(session).work);
  assert.deepEqual(reset.responses, openAIState(session).responses);
  const invalid = readOpenAISession(JSON.stringify({ version: 1, events: [null, {}, { type: 'codex-commit' }, { type: 'responses-result', result: 'success' }, { type: 'work-source', source: '__proto__' }] }));
  assert.deepEqual(invalid.events, []);
  for (const raw of ['{', 'null', '{"version":2,"events":[]}', 'x'.repeat(150001)]) assert.deepEqual(readOpenAISession(raw), { version: 1, events: [] });
  const full = { version: 1, events: Array.from({ length: OPENAI_EVENT_LIMIT }, (_, i) => ({ type: 'work-source', source: i % 2 ? 'scope' : 'support' })) };
  assert.equal(recordOpenAIAction(full, { type: 'codex-test' }), full);
  assert.ok(recordOpenAIAction(full, { type: 'reset', scene: 'work' }).events.length < OPENAI_EVENT_LIMIT);
});
