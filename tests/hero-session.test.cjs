const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,filename);
const {heroInitial,heroReduce,heroState,heroPay,heroCounts,readHeroSession,recordHeroAction,HERO_CANDIDATES,HERO_EVENT_LIMIT}=require('../lib/data/hero-session.ts');
const actions=(state,...events)=>events.reduce(heroReduce,state);
const payroll=(...types)=>types.map(type=>({type:`payroll-${type}`}));
const candidate=(id,type,note)=>({type:`candidate-${type}`,id,note});

test('payroll review, finalisation and publication require the current corrected version',()=>{
  let state=heroInitial();
  for(const event of payroll('correct','review','finalise','publish'))assert.equal(heroReduce(state,event),state);
  assert.equal(heroPay(state).gross,9840);
  state=actions(state,...payroll('inspect','correct'));
  assert.equal(heroPay(state).gross,9720);
  assert.equal(heroReduce(state,{type:'payroll-finalise'}),state);
  state=actions(state,...payroll('review','restore'));
  assert.equal(state.payroll.phase,'prepared');
  assert.equal(state.payroll.inspected,false);
  assert.equal(heroPay(state).gross,9840);
  state=actions(state,...payroll('inspect','correct'));
  assert.equal(heroReduce(state,{type:'payroll-finalise'}),state,'previous review must not carry forward');
  state=actions(state,...payroll('review','finalise'));
  assert.equal(state.payroll.phase,'finalised');
  assert.equal(heroReduce(state,{type:'payroll-restore'}),state,'finalised values stay locked');
  state=heroReduce(state,{type:'payroll-publish'});
  assert.equal(state.payroll.phase,'published');
  assert.equal(heroPay(state).overtimeHours,2);
  assert.equal(heroPay(state).gross,9720);
});

test('saving is not contact; invitations need reviewed evidence and specific context',()=>{
  let state=heroReduce(heroInitial(),candidate('harper','save'));
  assert.equal(heroCounts(state).saved,1);
  assert.equal(heroCounts(state).invited,0);
  assert.equal(heroReduce(state,candidate('harper','invite','A sufficiently detailed message')),state);
  assert.equal(heroReduce(state,candidate('harper','reply')),state);
  state=heroReduce(state,candidate('harper','review'));
  for(const note of [undefined,'short','          ','x'.repeat(1001),{}])assert.equal(heroReduce(state,candidate('harper','invite',note)),state);
  state=heroReduce(state,candidate('harper','invite','Please discuss the Melbourne validation role.'));
  assert.equal(heroCounts(state).pending,1);
  assert.equal(heroCounts(state).interested,0);
  assert.equal(heroReduce(state,candidate('harper','follow-up','Explain the validation leadership experience.')),state);
});

test('interested, declined and unanswered keep the invitation denominator and independent evidence gaps',()=>{
  let state=heroInitial();
  for(const p of HERO_CANDIDATES){
    state=actions(state,candidate(p.id,'review'),candidate(p.id,'invite','Discuss the optical engineering role in Melbourne.'),candidate(p.id,'reply'));
    assert.equal(heroReduce(state,candidate(p.id,'reply')),state);
    assert.equal(heroReduce(state,candidate(p.id,'invite','Repeated contact after the original response.')),state);
  }
  assert.deepEqual(heroCounts(state),{saved:0,invited:3,pending:0,interested:1,declined:1,unanswered:1,followUps:0});
  for(const id of ['oscar','sienna'])assert.equal(heroReduce(state,candidate(id,'follow-up','Please provide more evidence.')),state);
  state=heroReduce(state,candidate('harper','follow-up','Which validation programme have you led end to end?'));
  assert.equal(heroCounts(state).followUps,1);
  assert.equal(state.people.saved,null);
  assert.equal(state.payroll.phase,'prepared');
  assert.match(HERO_CANDIDATES[0].gap,/not evidenced/);
  assert.ok(HERO_CANDIDATES.every(p=>!['ava','leo','mina'].includes(p.id)));
});

test('changing an employment model invalidates review without overwriting the saved comparison',()=>{
  let state=heroInitial();
  assert.equal(heroReduce(state,{type:'people-save'}),state);
  state=actions(state,{type:'people-review'},{type:'people-save'});
  assert.equal(state.people.saved,'direct');
  state=heroReduce(state,{type:'people-model',model:'heroforce'});
  assert.equal(state.people.model,'heroforce');
  assert.equal(state.people.saved,'direct');
  assert.equal(state.people.reviewed,false);
  assert.equal(heroReduce(state,{type:'people-save'}),state);
  state=actions(state,{type:'people-review'},{type:'people-save'});
  assert.equal(state.people.saved,'heroforce');
  assert.equal(heroReduce(state,{type:'people-model',model:'unknown'}),state);
});

test('journal replay preserves outcomes and drafts; reset affects only its scenario',()=>{
  let session=readHeroSession(null);
  for(const event of [...payroll('inspect','correct','review','finalise','publish'),candidate('harper','review'),candidate('harper','invite','Discuss the validation programme.'),candidate('harper','reply'),{type:'people-review'},{type:'people-save'}])session=recordHeroAction(session,event);
  session.drafts={selected:'oscar',scope:'saved',invitations:{oscar:'Keep this unsent draft.'},followUps:{harper:'Clarify the programme leadership.'}};
  const restored=readHeroSession(JSON.stringify(session));
  assert.deepEqual(heroState(restored),heroState(session));
  assert.deepEqual(restored.drafts,session.drafts);
  const reset=recordHeroAction(restored,{type:'reset',scene:'payroll'});
  assert.equal(heroState(reset).payroll.phase,'prepared');
  assert.equal(heroCounts(heroState(reset)).interested,1);
  assert.equal(heroState(reset).people.saved,'direct');
  assert.deepEqual(reset.drafts,session.drafts);
  const talentReset=recordHeroAction(reset,{type:'reset',scene:'candidate'});
  assert.equal(heroCounts(heroState(talentReset)).invited,0);
  assert.equal(heroState(talentReset).people.saved,'direct');
  assert.deepEqual(talentReset.drafts.invitations,{});
});

test('untrusted saved data cannot inject publication, candidate consent or a model directly',()=>{
  for(const raw of [null,'{','null','[]',JSON.stringify({version:2,events:[]})])assert.deepEqual(heroState(readHeroSession(raw)),heroInitial());
  const session=readHeroSession(JSON.stringify({version:1,payroll:{phase:'published'},candidates:{harper:{response:'interested'}},events:[null,{},'publish',{type:'payroll-publish'},candidate('harper','reply'),candidate('__proto__','invite','Fake invitation'),{type:'people-save'},{type:'people-model',model:'unknown'}],drafts:{selected:'ava',scope:'invalid',invitations:{harper:'x'.repeat(1100)}}}));
  assert.deepEqual(heroState(session),heroInitial());
  assert.equal(session.events.length,0);
  assert.equal(session.drafts.selected,'harper');
  assert.equal(session.drafts.scope,'all');
  assert.equal(session.drafts.invitations.harper.length,1000);
  assert.equal(recordHeroAction(session,{type:'payroll-publish'}),session);
});

test('a full record preserves earliest evidence and offers scene reset',()=>{
  let session=readHeroSession(null);
  for(let i=0;i<HERO_EVENT_LIMIT;i++)session=recordHeroAction(session,{type:'people-model',model:i%2===0?'heroforce':'direct'});
  assert.equal(session.events.length,HERO_EVENT_LIMIT);
  assert.equal(recordHeroAction(session,{type:'people-review'}),session);
  const reset=recordHeroAction(session,{type:'reset',scene:'people'});
  assert.equal(reset.events.length,0);
  assert.notEqual(recordHeroAction(reset,{type:'people-review'}),reset);
});

const {studyContextHref}=require('../lib/data/study-context.ts');
test('App and Backstage return to the registered company screen and preserve explicit destinations',()=>{
  const empty=new URLSearchParams();
  assert.equal(studyContextHref('/companies/employment-hero/backstage','/companies/employment-hero/app/talent',empty),'/companies/employment-hero/backstage?appScreen=talent');
  const q=new URLSearchParams('appScreen=talent');
  assert.equal(studyContextHref('/companies/employment-hero/backstage/sources#sources','/companies/employment-hero/backstage',q),'/companies/employment-hero/backstage/sources?appScreen=talent#sources');
  assert.equal(studyContextHref('/companies/employment-hero/app','/companies/employment-hero/backstage/sources',q),'/companies/employment-hero/app/talent');
  for(const href of ['/companies/elmo/app','/companies/employment-hero/app/payroll','/companies/employment-hero/app?explicit=1'])assert.equal(studyContextHref(href,'/companies/employment-hero/backstage',q),href);
  for(const screen of ['../../elsewhere','https://example.com','constructor','missing'])assert.equal(studyContextHref('/companies/employment-hero/app','/companies/employment-hero/backstage',new URLSearchParams({appScreen:screen})),'/companies/employment-hero/app');
  assert.equal(studyContextHref('/companies/servicenow/app','/companies/servicenow/backstage',new URLSearchParams('appScreen=control-tower')),'/companies/servicenow/app/control-tower');
});
test('Workday keeps scenario answers alongside the workspace return path',()=>{
  const q=new URLSearchParams('role=partner&steps=manager-approve');
  const backstage=studyContextHref('/companies/workday/backstage','/companies/workday/app/processes',q);
  assert.equal(backstage,'/companies/workday/backstage?role=partner&steps=manager-approve&appScreen=processes');
  assert.equal(studyContextHref('/companies/workday/app','/companies/workday/backstage',new URLSearchParams(backstage.split('?')[1])),'/companies/workday/app/processes?role=partner&steps=manager-approve');
});

test('every company workspace and known Rippling worker can return through Backstage without crossing company context',()=>{
  const {COMPANIES}=require('../lib/companies.ts');
  const {EMPLOYEES}=require('../lib/data/employees.ts');
  for(const company of COMPANIES){
    const screens=[...company.appScreens,...(company.id==='rippling'?EMPLOYEES.map(person=>`people/${person.id}`):[])];
    for(const screen of screens){
      const app=`/companies/${company.id}/app${screen?`/${screen}`:''}`;
      const backstage=studyContextHref(`/companies/${company.id}/backstage`,app,new URLSearchParams());
      const q=new URLSearchParams(backstage.split('?')[1]);
      assert.equal(studyContextHref(`/companies/${company.id}/app`,`/companies/${company.id}/backstage`,q),app);
      for(const other of COMPANIES.filter(c=>c.id!==company.id)){
        const href=`/companies/${other.id}/app`;
        assert.equal(studyContextHref(href,`/companies/${company.id}/backstage`,q),href);
      }
    }
  }
  assert.equal(studyContextHref('/companies/rippling/app','/companies/rippling/backstage',new URLSearchParams('appScreen=people/not-a-worker')),'/companies/rippling/app');
});
