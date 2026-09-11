const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const {initialWorkdayState,applyWorkdayAction,canActWorkday,replayWorkday,readWorkdayChoice,workdayQuery,workdayResult,workdayContextHref,WORKDAY_CASE}=require('../lib/data/workday-scenario.ts');
const {readPageUpReview}=require('../lib/data/pageup-review.ts');

test('viewing a request cannot approve it: only the assigned role can advance each step',()=>{
  let state=initialWorkdayState();
  for(const role of ['hr','partner','payroll'])assert.equal(applyWorkdayAction(state,role,'manager-approve'),state);
  state=applyWorkdayAction(state,'manager','manager-approve');
  assert.equal(state.stage,'partner');
  assert.equal(applyWorkdayAction(state,'manager','partner-approve'),state);
  assert.equal(canActWorkday(state,'payroll','send-payroll'),false);
  assert.equal(workdayResult(state,'effective').current,WORKDAY_CASE.salary);
});
test('send-back preserves history and a 4 percent revision requires a fresh manager review but skips partner approval',()=>{
  let state=replayWorkday(['manager-approve','partner-return','revise-standard']);
  assert.equal(state.stage,'returned');
  assert.equal(workdayResult(state,'effective').current,241000);
  state=applyWorkdayAction(state,'hr','submit');
  assert.equal(state.stage,'manager');
  assert.equal(canActWorkday(state,'partner','partner-approve'),false);
  state=applyWorkdayAction(state,'manager','manager-approve');
  assert.equal(state.stage,'complete');
  assert.equal(workdayResult(state,'effective').current,250640);
  assert.equal(state.events.length,5);
  assert.equal(state.events[1].action,'partner-return');
});
test('approval, effective date and accepted provider data remain distinct through failure and retry',()=>{
  let state=replayWorkday(['manager-approve','partner-approve']);
  assert.equal(workdayResult(state,'today').current,241000);
  assert.equal(workdayResult(state,'effective').current,260280);
  assert.equal(workdayResult(state,'effective').provider,241000);
  state=applyWorkdayAction(state,'payroll','send-payroll');
  assert.equal(state.stage,'complete');assert.equal(state.payroll,'failed');
  assert.equal(applyWorkdayAction(state,'payroll','confirm-receipt'),state);
  assert.equal(applyWorkdayAction(state,'payroll','send-payroll'),state);
  state=applyWorkdayAction(state,'payroll','fix-mapping');
  assert.equal(state.payroll,'failed');
  state=applyWorkdayAction(state,'payroll','send-payroll');
  assert.equal(state.payroll,'sent');assert.equal(workdayResult(state,'effective').provider,241000);
  state=applyWorkdayAction(state,'payroll','confirm-receipt');
  assert.equal(workdayResult(state,'effective').provider,260280);
  assert.equal(workdayResult(state,'today').provider,241000);
  assert.equal(canActWorkday(state,'payroll','send-payroll'),false);
});
test('shareable state round-trips the revision and role, dropping impossible actions and unknown input',()=>{
  const choice={role:'payroll',asOf:'effective',actions:['manager-return','revise-standard','submit','manager-approve','send-payroll','fix-mapping','send-payroll','confirm-receipt']};
  assert.deepEqual(readWorkdayChoice(new URLSearchParams(workdayQuery(choice))),choice);
  const bad=readWorkdayChoice(new URLSearchParams('role=constructor&asof=tomorrow&steps=confirm-receipt,bogus,partner-approve,manager-approve,send-payroll'));
  assert.deepEqual(bad,{role:'manager',asOf:'today',actions:['manager-approve']});
  assert.equal(replayWorkday(bad.actions).stage,'partner');
});
test('the PageUp review record cannot restore completion without a valid note, and retains only known applicant IDs',()=>{
  assert.deepEqual(readPageUpReview('broken'),{reviewed:false,note:'',saved:[]});
  assert.equal(readPageUpReview(JSON.stringify({reviewed:true,note:'Short'})).reviewed,false);
  const review=readPageUpReview(JSON.stringify({reviewed:true,note:'Calibration evidence checked; leadership still to verify.',saved:['ava','ava','someone-else',null,'leo']}));
  assert.equal(review.reviewed,true);assert.deepEqual(review.saved,['ava','leo']);
  assert.deepEqual(readPageUpReview(JSON.stringify(review)),review);
  assert.equal(readPageUpReview(JSON.stringify({...review,reviewed:false,note:''})).reviewed,false);
});
test('App and Backstage links retain the worked example without leaking it to another company or overriding explicit URLs',()=>{
  const path='/companies/workday/app/processes';
  const q=new URLSearchParams('role=partner&steps=manager-approve');
  assert.equal(workdayContextHref('/companies/workday/backstage#company-direction-title',path,q),'/companies/workday/backstage?role=partner&steps=manager-approve#company-direction-title');
  assert.equal(workdayContextHref('/companies/workday/app', '/companies/workday/backstage/model',q),'/companies/workday/app?role=partner&steps=manager-approve');
  for(const href of ['/companies/rippling/app','/atlas/workday','/companies/workday/app?steps=manager-return'])assert.equal(workdayContextHref(href,path,q),href);
  assert.equal(workdayContextHref('/companies/workday/app','/companies/rippling/app',q),'/companies/workday/app');
});
