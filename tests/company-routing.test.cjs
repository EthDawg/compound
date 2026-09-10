const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
// Load the pure TypeScript registry without adding another test dependency.
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
const {COMPANIES, BACKSTAGE_SECTIONS, switchCompanyHref, companyHref}=require('../lib/companies.ts');

test('company switching preserves each shared Backstage topic in both directions',()=>{
  for(const from of COMPANIES)for(const to of COMPANIES)for(const section of BACKSTAGE_SECTIONS){
    assert.equal(switchCompanyHref(to.id,companyHref(from.id,'backstage',section.id)),companyHref(to.id,'backstage',section.id));
  }
});
test('switching from a company-specific essay stays Backstage and lands at the other overview',()=>{
  assert.equal(switchCompanyHref('workday','/companies/rippling/backstage/manual/focus-is-a-market-discipline'),'/companies/workday/backstage');
});
test('shared app screen is retained, unsupported screen and record detail return to the target app',()=>{
  assert.equal(switchCompanyHref('workday','/companies/rippling/app/people'),'/companies/workday/app/people');
  assert.equal(switchCompanyHref('rippling','/companies/workday/app/people'),'/companies/rippling/app/people');
  assert.equal(switchCompanyHref('workday','/companies/rippling/app/people/e-046'),'/companies/workday/app');
  assert.equal(switchCompanyHref('rippling','/companies/workday/app/processes'),'/companies/rippling/app');
});
test('every registered screen and core Backstage topic is included in the production build',()=>{
  const routes=JSON.parse(fs.readFileSync('.next/prerender-manifest.json','utf8')).routes;
  for(const company of COMPANIES){
    for(const screen of company.appScreens)assert.ok(routes[companyHref(company.id,'app',screen)],`Missing ${company.id} app ${screen}`);
    for(const section of BACKSTAGE_SECTIONS)assert.ok(routes[companyHref(company.id,'backstage',section.id)],`Missing ${company.id} Backstage ${section.id}`);
  }
});
test('company deep reads link to their own Backstage',()=>{
  for(const company of COMPANIES){
    const html=fs.readFileSync(`.next/server/app/ecosystem/${company.id}.html`,'utf8');
    const links=[...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match=>match[1]);
    assert.ok(links.includes(companyHref(company.id,'backstage')));
    assert.ok(!links.some(href=>href.includes('/backstage')&&!href.startsWith(`/companies/${company.id}/`)));
  }
});
