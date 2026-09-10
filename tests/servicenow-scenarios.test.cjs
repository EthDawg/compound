const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const {INITIAL_INCIDENT,incidentReducer,INITIAL_JOURNEY,journeyReducer,journeyComplete,INITIAL_GOVERNANCE,governanceReducer}=require('../lib/data/servicenow-scenarios.ts');

test('an incident cannot skip investigation, approval, execution or observed recovery',()=>{
  for(const action of [{type:'approve',reason:'Controlled recovery'},{type:'execute'},{type:'health',healthy:true},{type:'resolve'}])
    assert.strictEqual(incidentReducer(INITIAL_INCIDENT,action),INITIAL_INCIDENT);
  const reviewed=incidentReducer(INITIAL_INCIDENT,{type:'inspect'});
  assert.strictEqual(incidentReducer(reviewed,{type:'approve',reason:'   short   '}),reviewed);
  const approved=incidentReducer(reviewed,{type:'approve',reason:'  Restore reviewed configuration  '});
  assert.equal(approved.phase,'approved');
  assert.equal(approved.rationale,'Restore reviewed configuration');
  assert.strictEqual(incidentReducer(approved,{type:'health',healthy:true}),approved);
  const executed=incidentReducer(approved,{type:'execute'});
  assert.equal(executed.phase,'executed');
  assert.equal(executed.health,'unknown');
  assert.strictEqual(incidentReducer(executed,{type:'resolve'}),executed);
});

test('failed recovery remains in the evidence trail after a later successful check and explicit resolution',()=>{
  let state=incidentReducer(INITIAL_INCIDENT,{type:'inspect'});
  state=incidentReducer(state,{type:'approve',reason:'Restore reviewed configuration'});
  state=incidentReducer(state,{type:'execute'});
  state=incidentReducer(state,{type:'health',healthy:false});
  assert.equal(state.phase,'executed');
  assert.equal(state.health,'failed');
  assert.strictEqual(incidentReducer(state,{type:'resolve'}),state);
  state=incidentReducer(state,{type:'health',healthy:true});
  assert.equal(state.phase,'recovered');
  assert.deepEqual(state.healthChecks,[false,true]);
  state=incidentReducer(state,{type:'resolve'});
  assert.equal(state.phase,'resolved');
  assert.deepEqual(state.healthChecks,[false,true]);
  assert.equal(state.rationale,'Restore reviewed configuration');
  assert.strictEqual(incidentReducer(state,{type:'reset'}),INITIAL_INCIDENT);
  assert.deepEqual(INITIAL_INCIDENT.healthChecks,[]);
});

test('an employee journey needs approval, returned identity success and a separate workplace confirmation',()=>{
  assert.strictEqual(journeyReducer(INITIAL_JOURNEY,{type:'dispatch'}),INITIAL_JOURNEY);
  assert.strictEqual(journeyReducer(INITIAL_JOURNEY,{type:'receipt',success:true}),INITIAL_JOURNEY);
  let state=journeyReducer(INITIAL_JOURNEY,{type:'workplace'});
  assert.equal(journeyComplete(state),false);
  state=journeyReducer(state,{type:'approve'});
  state=journeyReducer(state,{type:'dispatch'});
  assert.equal(journeyComplete(state),false);
  state=journeyReducer(state,{type:'receipt',success:false});
  assert.equal(journeyComplete(state),false);
  assert.equal(state.accessReceipt,'failed');
  assert.strictEqual(journeyReducer(state,{type:'receipt',success:true}),state);
  state=journeyReducer(state,{type:'dispatch'});
  assert.equal(state.accessReceipt,'pending');
  state=journeyReducer(state,{type:'receipt',success:true});
  assert.equal(journeyComplete(state),true);
  assert.strictEqual(journeyReducer(state,{type:'dispatch'}),state);
  assert.strictEqual(journeyReducer(state,{type:'reset'}),INITIAL_JOURNEY);
  let withoutWorkplace=journeyReducer(INITIAL_JOURNEY,{type:'approve'});
  withoutWorkplace=journeyReducer(withoutWorkplace,{type:'dispatch'});
  withoutWorkplace=journeyReducer(withoutWorkplace,{type:'receipt',success:true});
  assert.equal(journeyComplete(withoutWorkplace),false);
});

test('AI governance retains a reasoned decision while keeping approval and deployment separate',()=>{
  assert.strictEqual(governanceReducer(INITIAL_GOVERNANCE,{type:'approve',note:'A sufficient reason'}),INITIAL_GOVERNANCE);
  assert.strictEqual(governanceReducer(INITIAL_GOVERNANCE,{type:'receipt'}),INITIAL_GOVERNANCE);
  let state=governanceReducer(INITIAL_GOVERNANCE,{type:'assess'});
  assert.strictEqual(governanceReducer(state,{type:'approve',note:'  short  '}),state);
  state=governanceReducer(state,{type:'approve',note:'  Scope remains draft only; rollback reviewed  '});
  assert.equal(state.phase,'approved');
  assert.equal(state.decisionNote,'Scope remains draft only; rollback reviewed');
  state=governanceReducer(state,{type:'receipt'});
  assert.equal(state.phase,'deployed');
  assert.equal(state.decisionNote,'Scope remains draft only; rollback reviewed');
  assert.strictEqual(governanceReducer(state,{type:'reset'}),INITIAL_GOVERNANCE);
});

test('returning a model change prevents approval or deployment until a fresh request is reviewed',()=>{
  assert.strictEqual(governanceReducer(INITIAL_GOVERNANCE,{type:'return',note:' '}),INITIAL_GOVERNANCE);
  const returned=governanceReducer(INITIAL_GOVERNANCE,{type:'return',note:'Need a named rollback owner'});
  assert.equal(returned.phase,'returned');
  assert.equal(returned.decisionNote,'Need a named rollback owner');
  for(const action of [{type:'assess'},{type:'approve',note:'Now approve this request'},{type:'receipt'}])
    assert.strictEqual(governanceReducer(returned,action),returned);
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
