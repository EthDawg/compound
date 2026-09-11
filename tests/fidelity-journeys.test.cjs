const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {DECISIONS,evaluateDecision,readAnswers}=require('../lib/decision-engine.ts');
const {CLUSTERS,CONNECTIONS,CONTEXT_NODES,WORLD_SOURCES,MARKET_COMPANIES}=require('../lib/data/earth.ts');
const {COMPANY_INDEX,searchCompanies}=require('../lib/company-index.ts');
const wd=require('../lib/data/workday-anz.ts').WORKDAY_ECOSYSTEM;
const sn=require('../lib/data/servicenow-anz.ts').SERVICENOW_ECOSYSTEM;
const briefs=require('../lib/data/practice-briefs.json');

test('all decisions reject missing or invalid answers and every valid combination resolves once',()=>{
 for(const d of DECISIONS){
  assert.equal(evaluateDecision(d.id,{}).id,'incomplete');
  assert.deepEqual(readAnswers(d,new URLSearchParams('task=unrestricted&team=guaranteed'),['Payroll']),{});
  const choices=d.questions.map(q=>q.id==='domain'?['Payroll']:q.options.map(o=>o.id));
  const walk=(i,a)=>{if(i===choices.length){const r=evaluateDecision(d.id,a);assert.notEqual(r.id,'incomplete');assert.ok(r.title&&r.proof&&r.nextWhen);return;}for(const v of choices[i])walk(i+1,{...a,[d.questions[i].id]:v});};walk(0,{});
 }
});
test('failed work and material consequences never earn autonomous writes',()=>{
 const a={task:'fixed',consequence:'contained',access:'tested',proof:'representative',benefit:'observed'};
 assert.equal(evaluateDecision('ai',a).id,'workflow');
 assert.equal(evaluateDecision('ai',{...a,task:'adaptive'}).id,'agent');
 assert.equal(evaluateDecision('ai',{...a,consequence:'material'}).id,'prepare');
 assert.equal(evaluateDecision('ai',{...a,proof:'failed'}).id,'redesign');
 assert.equal(evaluateDecision('ai',{...a,benefit:'negative'}).id,'redesign');
 assert.equal(evaluateDecision('ai',{...a,proof:'demo'}).id,'shadow');
});
test('proven specialist value changes architecture; a target does not establish migration readiness',()=>{
 const a={reason:'handoffs',coreFit:'proven',specialistEdge:'optional',boundary:'unproven',transition:'untested'};
 assert.equal(evaluateDecision('platform',a).id,'rehearse');
 assert.equal(evaluateDecision('platform',{...a,coreFit:'gap',specialistEdge:'essential'}).id,'specialist-boundary');
 assert.equal(evaluateDecision('platform',{...a,coreFit:'unknown',transition:'ready'}).id,'compare');
 assert.equal(evaluateDecision('platform',{...a,reason:'renewal',transition:'costOnly'}).id,'economics');
});
test('a public case and named practice leader do not prove the proposed team or operating agreement',()=>{
 const a={service:'implementation',domain:'Payroll',localProof:'published',team:'practice',ownership:'partial'};
 assert.equal(evaluateDecision('si',a).id,'reference');
 assert.equal(evaluateDecision('si',{...a,localProof:'verified'}).id,'team');
 assert.equal(evaluateDecision('si',{...a,localProof:'verified',team:'confirmed'}).id,'boundary');
 assert.equal(evaluateDecision('si',{...a,localProof:'verified',team:'confirmed',ownership:'agreed'}).id,'phase');
 assert.notEqual(evaluateDecision('si',a).proof,evaluateDecision('si',{...a,service:'ams'}).proof);
});
test('world connections retain endpoints, evidence and announced status; foundational companies are discoverable',()=>{
 const ids=new Set([...CLUSTERS,...CONTEXT_NODES].map(c=>c.id));
 for(const e of CONNECTIONS){assert.ok(ids.has(e.fromId)&&ids.has(e.toId),e.id);assert.ok(e.sourceIds.every(id=>WORLD_SOURCES.some(s=>s.id===id)));assert.ok(e.evidenceKind&&e.status);}
 assert.equal(CONNECTIONS.find(e=>e.id==='compute-to-uae').status,'planned');
 for(const c of CLUSTERS)for(const f of c.facts)assert.ok(f.sourceIds.every(id=>WORLD_SOURCES.some(s=>s.id===id)));
 for(const name of ['NVIDIA','TSMC','ASML','SK hynix','ZEISS SMT']){const c=searchCompanies(name)[0]?.company;assert.equal(c?.name,name);assert.ok(c.marketLinks.length);assert.equal(c.appHref,undefined);}
 assert.ok(MARKET_COMPANIES.every(c=>COMPANY_INDEX.some(i=>i.id===c.id)));
});
test('practice briefs and paired engagement claims resolve to exact scope and source records',()=>{
 for(const b of briefs.briefs){const e=b.ecosystemId==='workday'?wd:sn;assert.ok(e.anzCompany(b.companyId));assert.equal(b.points.length,3);for(const p of b.points)assert.ok(p.sourceRefs.every(id=>briefs.sources[id]?.url));}
 for(const c of briefs.engagementClaims){const e=c.ecosystemId==='workday'?wd:sn;const customer=e.ANZ_CUSTOMERS.find(x=>x.id===c.customerId);assert.equal(customer?.companyId,c.companyId);assert.ok(customer.capabilities.includes(c.domain));assert.ok(e.CAPABILITIES.includes(c.service));assert.ok(briefs.sources[c.sourceRef]);}
 assert.equal(wd.capabilityEvidence('kainos','Payroll').key,'people');
 for(const e of [wd,sn])for(const c of e.ANZ_COMPANIES)for(const p of e.peopleInLineage(c.id))assert.ok(p.companyId===c.id||p.career.some(s=>s.companyId===c.id));
});
