const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {initialAtlas,readAtlasLocation,atlasLocationHref,transitionAtlas,atlasLevel}=require('../lib/atlas-navigation.ts');
const {ALL_VENDORS,SECTOR_NODES,CATEGORY_NODES}=require('../lib/data/atlas-nodes.ts');
const {COMPANY_INDEX,recentCompanyVisits,searchCompanies}=require('../lib/company-index.ts');
const node=id=>[...ALL_VENDORS,...SECTOR_NODES,...CATEGORY_NODES].find(n=>n.id===id);

test('landscape drilling, lens and selection survive a copied URL and history restoration',()=>{
 let state=initialAtlas;const urls=['/'];
 for(const action of [{type:'open',node:node('work')},{type:'open',node:node('hr-compound')},{type:'open',node:node('rippling')},{type:'lens',id:'agentic'},{type:'clear-company'},{type:'up'}]){
  state=transitionAtlas(state,action);urls.push(atlasLocationHref(state));
 }
 assert.deepEqual(urls,['/','/?sector=work','/?category=hr-compound','/?company=rippling','/?company=rippling&lens=agentic','/?category=hr-compound&lens=agentic','/?sector=work&lens=agentic']);
 const back=readAtlasLocation(new URL(urls[4],'https://compound.example').search);
 assert.equal(back.company,'rippling');assert.equal(back.category,'hr-compound');assert.equal(back.sector,'work');assert.equal(back.lens,'agentic');
 for(const href of urls){const s=readAtlasLocation(new URL(href,'https://compound.example').search);assert.equal(atlasLocationHref(s),href);}
});
test('invalid and conflicting map parameters cannot place a vendor in the wrong category',()=>{
 const s=readAtlasLocation('?company=anthropic&category=hr-compound&sector=work&lens=invalid&highlight=unsupported');
 assert.equal(s.sector,'ai');assert.equal(s.category,'frontier-ai');assert.equal(s.lens,'strategic');assert.equal(s.highlight,undefined);
 assert.equal(atlasLevel(readAtlasLocation('?sector=unknown&category=unknown&company=unknown')),'sector');
 for(const c of ALL_VENDORS){const s=readAtlasLocation(`?company=${c.id}`);assert.equal(s.company,c.id);assert.equal(s.category,c.category);}
});
test('changing a legend filter never leaves a selected company dimmed outside that filter',()=>{
 const selected=ALL_VENDORS.find(c=>ALL_VENDORS.some(other=>other.category===c.category&&other.archetype!==c.archetype));
 assert.ok(selected,'fixture needs a category with distinct company archetypes');
 const other=ALL_VENDORS.find(c=>c.category===selected.category&&c.archetype!==selected.archetype);
 const current=readAtlasLocation(`?company=${selected.id}`);
 const next=transitionAtlas(current,{type:'highlight',id:other.archetype});
 assert.equal(next.highlight,other.archetype);assert.equal(next.company,undefined);
 assert.equal(transitionAtlas(current,{type:'up'}).lens,current.lens);
 assert.equal(transitionAtlas(current,{type:'clear-company'}).category,current.category);
});
test('recent visits preserve the exact practice, person and capability; ID-only history migrates',()=>{
 const visit={id:'cognizant',href:'/atlas/servicenow?scope=anz&firm=cognizant&lens=capability&proof=IT'};
 const entries=recentCompanyVisits(['cognizant','anthropic','missing'],visit);
 assert.equal(entries[0].href,visit.href);assert.equal(entries.filter(v=>v.id==='cognizant').length,1);assert.ok(entries.some(v=>v.id==='anthropic'));
 const person={id:'kainos',href:'/atlas/workday?scope=anz&firm=kainos&person=mitch-collins&lens=people'};
 assert.deepEqual(recentCompanyVisits({version:2,entries},person)[0],person);
 assert.equal(recentCompanyVisits(COMPANY_INDEX.map(c=>c.id)).length,6);
 assert.deepEqual(recentCompanyVisits([{id:'anthropic',href:'https://evil.example/'},{id:'anthropic',href:'//evil.example/'},{id:'anthropic',href:'/companies/openai/app'},{id:'cognizant',href:'/atlas/workday?firm=kainos'}]),[]);
});
test('platform and short capability terms select the intended practice, not a substring in a person name',()=>{
 const practice=searchCompanies('Cognizant ServiceNow')[0];assert.equal(practice.company.id,'cognizant');assert.equal(practice.context.kind,'Ecosystem practice');assert.ok(practice.context.href.startsWith('/atlas/servicenow'));
 const capability=searchCompanies('Cognizant IT')[0];assert.equal(capability.company.id,'cognizant');assert.equal(capability.context.kind,'Capability');assert.equal(new URL(capability.context.href,'https://compound.example').searchParams.get('proof'),'IT');
 const scoped=searchCompanies('Cognizant ServiceNow IT')[0];assert.ok(scoped.context.href.startsWith('/atlas/servicenow'));assert.equal(scoped.context.kind,'Capability');
 assert.equal(searchCompanies('Mitch')[0].context.kind,'Person');assert.equal(searchCompanies('AFL')[0].context.kind,'Customer reference');
});
