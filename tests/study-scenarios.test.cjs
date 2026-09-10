const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const {remunerationSummary,canSubmitRemuneration,payrollScenario}=require('../lib/data/study-scenarios.ts');

test('reviewing the overtime discrepancy reduces gross by the source difference and unlocks finalisation',()=>{
  const before=payrollScenario(false),after=payrollScenario(true);
  assert.equal(before.gross,9840);
  assert.equal(before.canFinalise,false);
  assert.equal(before.warnings,1);
  assert.equal(after.gross,9720);
  assert.equal(before.gross-after.gross,120);
  assert.equal(after.warnings,0);
  assert.equal(after.canFinalise,true);
});
test('remuneration totals account for every worker and isolate a band exception from the pool',()=>{
  const baseline=remunerationSummary([3,3,3]);
  assert.equal(baseline.cost,9450);
  assert.equal(baseline.remaining,4550);
  assert.equal(canSubmitRemuneration([3,3,3],''),true);
  const band=remunerationSummary([0,8,0]);
  assert.equal(band.cost,9600);
  assert.deepEqual(band.overBand,['leo']);
  assert.equal(band.overBudget,false);
  assert.equal(canSubmitRemuneration([0,8,0],''),false);
  assert.equal(canSubmitRemuneration([0,8,0],'Reviewed against role scope'),true);
});
test('an over-budget proposal cannot be routed without an explanation even when bands are valid',()=>{
  const budget=remunerationSummary([8,5,6]);
  assert.equal(budget.overBudget,true);
  assert.deepEqual(budget.overBand,[]);
  assert.equal(budget.remaining,-5700);
  assert.equal(canSubmitRemuneration([8,5,6],''),false);
});
test('empty, invalid, negative and excessive inputs cannot be submitted as pay proposals',()=>{
  for(const values of [[NaN,3,3],[-1,3,3],[21,3,3],[Infinity,3,3],[4.4445,4.4445,4.4445],[8,4.9999,0.00023],[]]){
    assert.equal(remunerationSummary(values).valid,false);
    assert.equal(canSubmitRemuneration(values,'An explanation cannot legitimise invalid input'),false);
  }
});
