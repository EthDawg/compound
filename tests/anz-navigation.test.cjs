const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {capabilityColumns}=require('../lib/data/anz-ecosystem.ts');
const {WORKDAY_ECOSYSTEM:wd}=require('../lib/data/workday-anz.ts');
const {SERVICENOW_ECOSYSTEM:sn}=require('../lib/data/servicenow-anz.ts');

test('a capability filter remains visible when comparing the other column group',()=>{
 for(const ecosystem of [wd,sn]){
  const groups=ecosystem.capabilityGroups;
  for(const mode of ['services','domains','all']){
   for(const cap of ecosystem.CAPABILITIES){
    const result=capabilityColumns(groups,mode,cap);
    assert.ok(result.capabilities.includes(cap),`${ecosystem.id}: ${mode} / ${cap}`);
    assert.equal(result.capabilities.filter(c=>c===cap).length,1);
    const original=mode==='all'?groups.flatMap(g=>g.values):groups[mode==='services'?0:1].values;
    assert.ok(original.every(c=>result.capabilities.includes(c)),'manual comparison survives');
    if(!original.includes(cap))assert.equal(result.capabilities[0],cap,'extra column is visible beside the practice');
   }
  }
  assert.equal(capabilityColumns(groups,'services','invented').extra,null);
  assert.deepEqual(capabilityColumns(groups,'domains').capabilities,groups[1].values);
 }
});
