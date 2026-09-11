const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
const {execFileSync}=require('node:child_process');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,filename);
const {circularOrbit,networkBudget,adoptionCurve,formatDuration}=require('../lib/data/technology-math.ts');
const {WORKDAY_ECOSYSTEM:wd}=require('../lib/data/workday-anz.ts');
const {SERVICENOW_ECOSYSTEM:sn}=require('../lib/data/servicenow-anz.ts');
const {MARKETS}=require('../lib/data/earth.ts');
const {TURNING_POINTS,EXPLORERS,FUTURES}=require('../lib/data/technology.ts');
const {COMPANY_INDEX,searchCompanies}=require('../lib/company-index.ts');

test('circular orbit examples reproduce published order of magnitude and physical direction',()=>{
 const leo=circularOrbit(550),meo=circularOrbit(8000),geo=circularOrbit(35786);
 assert.ok(Math.abs(leo.speedKmS-7.59)<.01);
 assert.ok(Math.abs(leo.periodMin-95.6)<.2);
 assert.ok(Math.abs(geo.periodMin-1436)<1);
 assert.ok(Math.abs(geo.propagationRttMs-477.5)<.2);
 assert.ok(leo.speedKmS>meo.speedKmS&&meo.speedKmS>geo.speedKmS);
 assert.ok(leo.propagationRttMs<meo.propagationRttMs&&meo.propagationRttMs<geo.propagationRttMs);
 for(const invalid of [NaN,Infinity,-1,0])assert.throws(()=>circularOrbit(invalid),RangeError);
});
test('bandwidth cannot erase propagation, including a payload with no extra coordination trips',()=>{
 const low=networkBudget(10000,1000,1000,0),high=networkBudget(10000,1000,10000,0);
 assert.equal(low.transferMs,8000);
 assert.equal(low.rttMs,high.rttMs);
 assert.ok(high.totalMs<low.totalMs&&high.totalMs>high.oneWayMs);
 assert.ok(networkBudget(20000,1,10000,0).totalMs>98);
 assert.equal(networkBudget(10000,10,1000,10).waitMs,low.rttMs*10);
 for(const args of [[-1,1,1,1],[1,-1,1,1],[1,1,0,1],[1,1,Infinity,1],[1,1,1,-1],[1,1,1,.5]])assert.throws(()=>networkBudget(...args),RangeError);
});
test('readiness and friction controls never create earlier adoption and delay has literal model-time units',()=>{
 for(let t=0;t<=16;t+=.25){
   const a=adoptionCurve(t,0,1),b=adoptionCurve(t,4,1),c=adoptionCurve(t,4,3);
   assert.ok(a.technical>=0&&a.technical<=1);
   assert.equal(a.technical,a.deployed);
   assert.ok(a.deployed>=b.deployed&&b.deployed>=c.deployed);
   assert.equal(c.deployed,adoptionCurve(Math.max(0,t-4),0,3).deployed);
 }
 assert.equal(adoptionCurve(0,0,1).deployed,0);
 assert.match(formatDuration(2**36/1e9),/minutes/);
 assert.match(formatDuration(2**47/1e9),/days/);
 assert.match(formatDuration(2**60/1e9),/years/);
});
test('evidence differentiates anonymous cases, local scope and regional credentials',()=>{
 assert.equal(wd.capabilityEvidence('synergy','Payroll').key,'credentials');
 assert.equal(wd.capabilityEvidence('fusion5','Adaptive').key,'named');
 assert.equal(wd.capabilityEvidence('fusion5','Finance').key,'unknown');
 assert.equal(wd.capabilityEvidence('capgemini','HCM').key,'global');
 assert.equal(sn.capabilityEvidence('gqi','IT').key,'anonymous');
 assert.equal(sn.capabilityEvidence('datacom','IT').key,'named');
 assert.equal(sn.capabilityEvidence('kpmg','Employee').key,'local');
 assert.equal(sn.capabilityEvidence('ibm','Employee').key,'global');
 for(const eco of [wd,sn]){
  for(const insight of eco.insights)for(const id of insight.companyIds)assert.ok(eco.anzCompany(id),`${eco.id} insight: ${id}`);
  assert.deepEqual(eco.capabilityGroups.flatMap(g=>g.values),eco.CAPABILITIES);
  for(const c of eco.ANZ_COMPANIES)for(const f of c.capabilities)if(f.customerId)assert.ok(eco.ANZ_CUSTOMERS.some(x=>x.id===f.customerId&&x.companyId===c.id),`${c.id}/${f.customerId}`);
 }
});
test('new local firms are discoverable without duplicate canonical identities or invented App studies',()=>{
 for(const id of ['cloudrock','strada','evoke','fusion5','dxc','ey','sysintegra','valueflow','rgp']){
  const entries=COMPANY_INDEX.filter(c=>c.id===id);assert.equal(entries.length,1,id);assert.equal(entries[0].appHref,undefined);
 }
 assert.ok(searchCompanies('CloudGo').some(r=>r.company.id==='rgp'));
 assert.ok(searchCompanies('Bosley AI').some(r=>r.company.id==='bosley'));
});
test('Squires staffing text does not become deployment accreditation; explicit directory declarations survive',()=>{
 const output=execFileSync('python3',['-c',`
import importlib.util,json
s=importlib.util.spec_from_file_location('imp','scripts/import-workday-partners.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
p={'uuid':'fad08259-14b3-4a3e-a10b-9e58b45d74f9','name':'The Squires Group, Inc.','customAttributes':[{'name':'partner_full_description','value':'Staffing and consulting for implementation programmes and ongoing support.'},{'name':'partner_short_description','value':'Workday HCM and Financials talent'}]}
r={'raw':{},'clickUri':'https://marketplace.workday.com/'}
a=m.normalize(r,p);p['customAttributes'].append({'name':'service_type','value':['Deployment']});b=m.normalize(r,p)
print(json.dumps([a,b]))
`],{encoding:'utf8'});
 const [inferred,declared]=JSON.parse(output);
 assert.ok(!inferred.services.some(s=>['Deployment','Application Management Services'].includes(s.name)));
 assert.ok(inferred.products.some(p=>p.name==='Human Capital Management'&&p.basis==='profile'));
 assert.deepEqual(inferred.scope,[]);
 assert.ok(declared.services.some(s=>s.name==='Deployment'&&s.basis==='directory'));
});
test('new destinations, navigation and source-linked learning records are present in the production build',()=>{
 const routes=JSON.parse(fs.readFileSync('.next/server/app-paths-manifest.json','utf8'));
 for(const route of ['/earth','/technology','/decisions'])assert.ok(routes[`${route}/page`]);
 const home=fs.readFileSync('.next/server/app/index.html','utf8');
 for(const route of ['/earth','/technology','/decisions'])assert.ok(home.includes(`href="${route}"`));
 assert.equal(new Set(MARKETS.map(m=>m.id)).size,MARKETS.length);
 for(const m of MARKETS){assert.ok(Math.abs(m.lat)<=90&&Math.abs(m.lon)<=180);assert.ok(m.fact&&m.reading&&m.date);}
 for(const x of [...TURNING_POINTS,...EXPLORERS,...FUTURES])assert.equal(new URL(x.url).protocol,'https:');
});
