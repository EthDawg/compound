const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,filename);
const snapshot=require('../lib/data/workday-partners.json');
const {WORKDAY_PARTNERS:partners,WORKDAY_PARTNER_META:meta,filterPartners,partnerGroup,relatedPartners,partnerCsv}=require('../lib/data/workday-partners.ts');

test('the complete directory roster survives enrichment without duplicate firms',()=>{
  assert.equal(snapshot.partners.length,snapshot.directoryTotal);
  assert.equal(partners.filter(p=>p.listed).length,snapshot.directoryTotal);
  assert.equal(partners.length,snapshot.directoryTotal+meta.supplemental);
  assert.equal(new Set(partners.map(p=>p.id)).size,partners.length);
  assert.equal(new Set(partners.map(p=>p.slug)).size,partners.length);
  for(const original of snapshot.partners)assert.ok(partners.some(p=>p.id===original.id&&p.listed));
});
test('every firm has source provenance and public, safe links; marketing excerpts stay short',()=>{
  for(const p of partners){
    assert.ok(p.sources.length,`${p.name} sources`);
    for(const link of [p.sourceUrl,p.website,p.dataUrl,...p.sources.map(s=>s.url)].filter(Boolean)){
      const url=new URL(link);assert.ok(['http:','https:'].includes(url.protocol));assert.ok(!url.username&&!url.password);assert.ok(!url.searchParams.has('Signature'));
    }
    if(p.listed){assert.ok(p.partnerTypes.includes('Services'));assert.equal(new URL(p.sourceUrl).searchParams.get('vendor'),p.id);}
    for(const t of [...p.services,...p.products])assert.ok(['directory','profile','firm'].includes(t.basis));
    assert.ok(p.excerpt.split(/\s+/).length<=20);
    for(const s of p.scope)assert.ok(p.products.some(t=>t.name===s.product&&t.basis==='directory'),`${p.name} ${s.product}`);
  }
});
test('a missing directory entry and historical names remain accurately distinguishable',()=>{
  const cognizant=filterPartners({q:'Collaborative Solutions'});
  assert.equal(cognizant.length,1);assert.equal(cognizant[0].slug,'cognizant');assert.equal(cognizant[0].listed,false);
  assert.ok(!filterPartners({evidence:'listed'}).some(p=>p.slug==='cognizant'));
  assert.equal(filterPartners({q:'TopBloc'}).length,1);
  assert.ok(partners.some(p=>p.slug==='onesource-virtual-inc'));
});
test('service and product filters use evidence while unknown regions stay unknown',()=>{
  const result=filterPartners({service:'Deployment',product:'Human Capital Management',region:'APAC'});
  assert.ok(result.some(p=>p.slug==='deloitte'));
  assert.ok(result.every(p=>p.services.some(t=>t.name==='Deployment')&&p.products.some(t=>t.name==='Human Capital Management')&&(p.regions.includes('APAC')||p.regions.includes('Global'))));
  const ntt=partners.find(p=>p.slug==='ntt-data');
  assert.ok(filterPartners({region:'unspecified'}).includes(ntt));
  assert.ok(!filterPartners({region:'APAC'}).includes(ntt));
  assert.equal(filterPartners({q:'a firm that does not exist'}).length,0);
  assert.equal(partnerGroup(partners.find(p=>p.slug==='alexander-mann-solutions-limited-ams')),'staffing');
  assert.ok(!partners.find(p=>p.slug==='teambuilder-llc').services.some(t=>t.name==='Staffing'));
});
test('similar firms have a real shared product tag and never point to themselves',()=>{
  for(const p of partners){for(const r of relatedPartners(p)){
    assert.notEqual(r.partner.id,p.id);assert.ok(r.shared.length);
    assert.ok(r.shared.every(name=>p.products.some(t=>t.name===name)&&r.partner.products.some(t=>t.name===name)));
  }}
});
test('CSV exports the visible set and preserves provenance, escaping spreadsheet formulas',()=>{
  const visible=filterPartners({q:'TopBloc'});
  const csv=partnerCsv(visible);
  assert.equal(csv.split('\r\n').length,2);assert.match(csv,/Everforth TopBloc/);assert.match(csv,/Directory field/);assert.match(csv,/https:\/\/marketplace.workday.com/);
  assert.match(partnerCsv([{...visible[0],name:'=1+1'}]),/"'=1\+1"/);
});
test('the network is built and discoverable from Workday Backstage',()=>{
  const routes=JSON.parse(fs.readFileSync('.next/prerender-manifest.json','utf8')).routes;
  assert.ok(routes['/atlas/workday']);
  assert.match(fs.readFileSync('.next/server/app/companies/workday/backstage.html','utf8'),/href="\/atlas\/workday"/);
});
