const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {INITIAL_INCIDENT,incidentReducer,INITIAL_JOURNEY,journeyReducer,journeyComplete,INITIAL_GOVERNANCE,governanceReducer}=require('../lib/data/servicenow-scenarios.ts');
const {emptyServiceNowSession,readServiceNowSession,recordServiceNowAction,serviceNowState,SCENE_LIMIT}=require('../lib/data/servicenow-session.ts');
const gov=(state,type,actor='reviewer',extra={})=>governanceReducer(state,{type,actor,...extra});
const journey=(state,type,actor,extra={})=>journeyReducer(state,{type,actor,...extra});
function executedIncident(){
 let state=incidentReducer(INITIAL_INCIDENT,{type:'inspect'});
 state=incidentReducer(state,{type:'impact'});
 state=incidentReducer(state,{type:'approve',reason:'Restore v17 with both service owners present'});
 return incidentReducer(state,{type:'execute'});
}
function approvedAI(){
 let state=gov(INITIAL_GOVERNANCE,'assess');
 return gov(state,'approve','reviewer',{note:'Draft-only scope and rollback plan reviewed'});
}
test('a shared dependency changes both approval and recovery requirements',()=>{
 for(const action of [{type:'approve',reason:'Controlled recovery'},{type:'execute'},{type:'health',service:'checkout',healthy:true},{type:'resolve'}])assert.strictEqual(incidentReducer(INITIAL_INCIDENT,action),INITIAL_INCIDENT);
 const oneReview=incidentReducer(INITIAL_INCIDENT,{type:'inspect'});
 assert.strictEqual(incidentReducer(oneReview,{type:'approve',reason:'Restore previous database settings'}),oneReview,'impact review is still missing');
 const both=incidentReducer(oneReview,{type:'impact'});
 assert.strictEqual(incidentReducer(both,{type:'approve',reason:'short'}),both);
 const executed=executedIncident();
 assert.equal(executed.phase,'executed');assert.equal(executed.fulfilmentHealth,'unknown','pre-change health is stale');
 const checkout=incidentReducer(executed,{type:'health',service:'checkout',healthy:true});
 assert.equal(checkout.phase,'executed');assert.strictEqual(incidentReducer(checkout,{type:'resolve'}),checkout);
});
test('a failed second service check survives later recovery and blocks early incident closure',()=>{
 let state=executedIncident();
 state=incidentReducer(state,{type:'health',service:'checkout',healthy:true});
 state=incidentReducer(state,{type:'health',service:'fulfilment',healthy:false});
 assert.equal(state.health,'healthy');assert.equal(state.fulfilmentHealth,'failed');assert.equal(state.phase,'executed');
 state=incidentReducer(state,{type:'health',service:'fulfilment',healthy:true});
 assert.equal(state.phase,'recovered');assert.equal(state.healthChecks.length,3);assert.equal(state.healthChecks[1].healthy,false);
 state=incidentReducer(state,{type:'resolve'});assert.equal(state.phase,'resolved');assert.equal(state.healthChecks.length,3);
 assert.strictEqual(incidentReducer(state,{type:'reset'}),INITIAL_INCIDENT);
});
test('employee status cannot perform owner actions and a failed identity task needs repair before retry',()=>{
 for(const action of [{type:'approve'},{type:'dispatch'},{type:'workplace'},{type:'receipt',success:true}])assert.strictEqual(journeyReducer(INITIAL_JOURNEY,{...action,actor:'employee'}),INITIAL_JOURNEY);
 assert.strictEqual(journey(INITIAL_JOURNEY,'dispatch','it'),INITIAL_JOURNEY);
 let state=journey(INITIAL_JOURNEY,'workplace','workplace');
 assert.equal(state.workplaceReady,true,'HR transfer is already approved; workplace work can proceed separately');assert.equal(journeyComplete(state),false);
 state=journey(state,'approve','manager');state=journey(state,'dispatch','it');state=journey(state,'receipt','it',{success:false});
 assert.strictEqual(journey(state,'dispatch','it'),state,'retry without repairing the mapping is blocked');
 assert.strictEqual(journey(state,'repair','employee'),state);
 state=journey(state,'repair','it');state=journey(state,'dispatch','it');assert.equal(journeyComplete(state),false);
 state=journey(state,'receipt','it',{success:true});assert.equal(journeyComplete(state),true);assert.deepEqual(state.receipts,[false,true]);assert.equal(state.attempts,2);
 assert.strictEqual(journey(state,'dispatch','it'),state);
});
test('return and owner resubmission retain decisions but invalidate the previous assessment',()=>{
 let state=gov(INITIAL_GOVERNANCE,'assess');
 state=gov(state,'return','reviewer',{note:'Please add evidence for the canary response boundary'});
 assert.equal(state.phase,'returned');
 assert.strictEqual(gov(state,'resubmit','reviewer',{note:'The owner has revised this request'}),state);
 assert.strictEqual(gov(state,'resubmit','owner',{note:'short'}),state);
 state=gov(state,'resubmit','owner',{note:'Added an account-update rejection case to the canary evidence'});
 assert.equal(state.revision,2);assert.equal(state.assessed,false);assert.equal(state.decisionNote,'');assert.equal(state.history.length,3);
 assert.match(state.history[1].note,/canary/);
 assert.strictEqual(gov(state,'approve','reviewer',{note:'A fresh review has not happened yet'}),state);
 assert.strictEqual(gov(state,'assess','owner'),state);
 state=gov(state,'assess');state=gov(state,'approve','reviewer',{note:'Revised evidence and rollback owner reviewed'});
 assert.equal(state.phase,'approved');assert.equal(state.activeModel,'v2');assert.equal(state.history[4].revision,2);
});
test('insufficient information can be returned without claiming an assessment was completed',()=>{
 const state=gov(INITIAL_GOVERNANCE,'return','reviewer',{note:'A named accountable owner is missing'});
 assert.equal(state.phase,'returned');assert.equal(state.assessed,false);
 assert.strictEqual(gov(INITIAL_GOVERNANCE,'return','owner',{note:'I approve my own review request'}),INITIAL_GOVERNANCE);
});
test('approval, dispatch, runtime receipt and canary evidence are separate events',()=>{
 let state=approvedAI();
 assert.strictEqual(gov(state,'receipt','operator'),state);assert.strictEqual(gov(state,'deploy','reviewer'),state);
 state=gov(state,'deploy','operator');assert.equal(state.activeModel,'v2');
 state=gov(state,'receipt','operator');assert.equal(state.activeModel,'v3');assert.equal(state.phase,'deployed');
 state=gov(state,'observe','operator',{passed:true});assert.equal(state.phase,'complete');assert.match(state.history.at(-1).note,/limited fictional evidence/);
});
test('a failed canary leaves v3 deployed until rollback returns and requires a new review before retry',()=>{
 let state=approvedAI();state=gov(state,'deploy','operator');state=gov(state,'receipt','operator');
 state=gov(state,'observe','operator',{passed:false});assert.equal(state.phase,'rollback-required');assert.equal(state.activeModel,'v3');
 assert.strictEqual(gov(state,'observe','operator',{passed:true}),state,'a later favourable click cannot erase the rollback obligation');
 assert.strictEqual(gov(state,'rollback','owner'),state);
 state=gov(state,'rollback','operator');assert.equal(state.activeModel,'v2');assert.equal(state.phase,'rolled-back');
 state=gov(state,'resubmit','owner',{note:'Revised the instruction and retained the failed canary as a regression case'});
 assert.equal(state.phase,'open');assert.equal(state.assessed,false);assert.ok(state.history.some(e=>e.kind==='Canary failed'));assert.ok(state.history.some(e=>e.kind==='Rollback receipt'));
});
test('session restoration replays permitted actions and isolates each scene reset',()=>{
 let session=emptyServiceNowSession();
 session=recordServiceNowAction(session,{scene:'incident',action:{type:'inspect'}});
 session=recordServiceNowAction(session,{scene:'journey',action:{type:'approve',actor:'manager'}});
 session=recordServiceNowAction(session,{scene:'governance',action:{type:'return',actor:'reviewer',note:'Please provide a complete assessment'}});
 session.drafts.incidentReason='Unsaved change rationale survives navigation';
 assert.deepEqual(readServiceNowSession(JSON.stringify(session)),session);
 const reset=recordServiceNowAction(session,{scene:'governance',action:{type:'reset',actor:'reviewer'}});
 assert.equal(serviceNowState(reset).governance.phase,'open');assert.equal(serviceNowState(reset).journey.approved,true);assert.equal(reset.drafts.incidentReason,session.drafts.incidentReason);
 const polluted=readServiceNowSession(JSON.stringify({...session,governance:[null,{type:'receipt',actor:'operator'},{type:'approve',actor:'owner',note:'I can approve my own model'},...session.governance],activeModel:'v3'}));
 assert.equal(serviceNowState(polluted).governance.phase,'returned');assert.equal(serviceNowState(polluted).governance.activeModel,'v2');assert.equal(polluted.governance.length,1);
 assert.deepEqual(readServiceNowSession('bad json'),emptyServiceNowSession());
 assert.deepEqual(readServiceNowSession('{"version":2}'),emptyServiceNowSession());
});

test('a full scene retains its earliest evidence and can still be reset independently',()=>{
 let session=emptyServiceNowSession();
 for(const action of [{type:'inspect'},{type:'impact'},{type:'approve',reason:'Both dependent services are included in the change'},{type:'execute'}])session=recordServiceNowAction(session,{scene:'incident',action});
 while(session.incident.length<SCENE_LIMIT)session=recordServiceNowAction(session,{scene:'incident',action:{type:'health',service:'checkout',healthy:false}});
 const next=recordServiceNowAction(session,{scene:'incident',action:{type:'health',service:'checkout',healthy:true}});
 assert.strictEqual(next,session);assert.equal(serviceNowState(readServiceNowSession(JSON.stringify(session))).incident.inspected,true);
 const reset=recordServiceNowAction(session,{scene:'incident',action:{type:'reset'}});
 assert.equal(reset.incident.length,0);assert.equal(serviceNowState(reset).incident.phase,'investigating');
});

test('ServiceNow routes render their own workspace and expose the employee view without fulfiller permissions',()=>{
  const root='.next/server/app/companies/servicenow/app';
  for(const [route,title] of [['','Customer checkout is timing out.'],['/operations','Customer checkout is timing out.'],['/employees','One team move. Several things to finish.'],['/control-tower','A model change is an operating decision.']]){
    const html=fs.readFileSync(`${root}${route}.html`,'utf8');
    assert.match(html,/data-company="servicenow"/);
    assert.ok(html.includes(title));
    assert.ok(html.includes('/companies/servicenow/backstage'));
    assert.ok(html.includes('Sources &amp; product boundaries'));
  }
  const employee=fs.readFileSync(`${root}/employees.html`,'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
  assert.match(employee,/View as/);
  assert.doesNotMatch(employee,/>Approve demo role access<|>Send demo identity task<|>Confirm demo workplace readiness</);
});
