const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {RESEARCH_CATEGORIES,RESEARCH_COMPANIES,researchHref,companiesInResearch}=require('../lib/data/category-research.ts');
const {COMPANY_INDEX,searchCompanies,companyDestination,recentCompanyVisits}=require('../lib/company-index.ts');
const {ALL_VENDORS}=require('../lib/data/atlas-nodes.ts');
const {readServingChoice,servingResult}=require('../lib/fireworks-serving.ts');

test('research adds depth to existing identities without duplicating the company catalogue',()=>{
 for(const company of RESEARCH_COMPANIES){
  assert.equal(COMPANY_INDEX.filter(c=>c.id===company.id).length,1,company.id);
  assert.equal(ALL_VENDORS.filter(c=>c.id===company.id).length,1,company.id);
  const indexed=COMPANY_INDEX.find(c=>c.id===company.id);
  assert.equal(indexed.availability,'Research brief');
  assert.equal(indexed.appHref,undefined,'a research brief must not promise a full app study');
  assert.equal(companyDestination(indexed,'/companies/anthropic/app/code'),researchHref(company.id));
 }
 assert.equal(COMPANY_INDEX.filter(c=>c.name==='Google').length,1);
 assert.ok(COMPANY_INDEX.find(c=>c.id==='google').marketLinks.length,'existing global context survives');
 assert.equal(COMPANY_INDEX.find(c=>c.id==='snowflake').category,'warehouse','a second research lens does not rewrite a company primary category');
});
test('product and former names resolve to a current company with a usable research destination',()=>{
 for(const [query,id] of [['Fireworks','fireworks'],['Anysphere','cursor'],['Windsurf','cognition'],['Devin Desktop','cognition'],['Vertex AI','google'],['Azure AI Studio','microsoft'],['MosaicML','databricks'],['Neeva','snowflake'],['LangSmith','langchain'],['Weights & Biases','coreweave']]){
  const hit=searchCompanies(query)[0];assert.equal(hit?.company.id,id,query);assert.equal(companyDestination(hit.company,'/'),researchHref(id));
 }
 const fire=COMPANY_INDEX.find(c=>c.id==='fireworks');
 const href='/research/fireworks?model=custom&mode=dedicated&warm=1';
 assert.deepEqual(recentCompanyVisits([], {id:fire.id,href}),[{id:fire.id,href}]);
 assert.deepEqual(recentCompanyVisits([], {id:'fireworks',href:'/research/cursor'}),[]);
});
test('each category has supported company roles and no orphaned decision links',()=>{
 for(const category of RESEARCH_CATEGORIES){
  const companies=companiesInResearch(category.id);
  for(const company of companies.filter(c=>c.categories[0]===category.id)) assert.ok(category.groups.some(g=>g.id===company.group));
  for(const situation of category.situations){
   assert.equal(situation.steps.length,3);
   assert.ok(situation.companies.every(id=>companies.some(c=>c.id===id)));
  }
 }
 for(const company of RESEARCH_COMPANIES){
  assert.equal(company.strengths.length,3);
  for(const fact of [company.origin,company.movement]){
   assert.ok(fact.sources.length);
   for(const source of fact.sources) assert.equal(new URL(source.url).protocol,'https:');
  }
 }
});
test('serving walkthrough exposes invalid model routes and the idle-capacity tradeoff',()=>{
 assert.match(servingResult({model:'custom',mode:'shared',warm:false}).state,/Needs a deployment/);
 assert.match(servingResult({model:'base',mode:'shared',warm:false}).cost,/tokens/);
 for(const model of ['base','custom']){
  const zero=servingResult({model,mode:'dedicated',warm:false});
  const warm=servingResult({model,mode:'dedicated',warm:true});
  assert.match(zero.detail,/503/);assert.match(warm.detail,/idle/);
  assert.notEqual(zero.next,warm.next);assert.match(zero.cost,/GPU time/);
 }
 assert.deepEqual(readServingChoice(new URLSearchParams('model=invalid&mode=invalid&warm=no')),{model:'base',mode:'shared',warm:false});
 assert.deepEqual(readServingChoice(new URLSearchParams('model=custom&mode=dedicated&warm=1')),{model:'custom',mode:'dedicated',warm:true});
});
