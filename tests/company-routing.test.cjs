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
    if(company.strategy){
      assert.ok(html.includes(companyHref(company.id,'backstage')),`Missing canonical study redirect for ${company.id}`);
      continue;
    }
    const links=[...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match=>match[1]);
    assert.ok(links.includes(companyHref(company.id,'backstage')));
    assert.ok(!links.some(href=>href.includes('/backstage')&&!href.startsWith(`/companies/${company.id}/`)));
  }
});
test('new studies retain their shared chapters and send unsupported app screens to the right overview',()=>{
  for(const id of ['pageup','elmo','employment-hero','servicenow']){
    for(const chapter of ['history','essays','leadership'])
      assert.equal(switchCompanyHref(id,`/companies/pageup/backstage/${chapter}`),companyHref(id,'backstage',chapter));
    assert.equal(switchCompanyHref(id,'/companies/rippling/app/devices'),companyHref(id,'app'));
  }
  assert.equal(switchCompanyHref('rippling','/companies/elmo/backstage/history'),'/companies/rippling/backstage');
  assert.equal(switchCompanyHref('employment-hero','/companies/pageup/app/talent'),'/companies/employment-hero/app/talent');
});
test('each new thesis connects three arguments to three implemented product journeys',()=>{
  for(const company of COMPANIES.filter(c=>c.strategy)){
    assert.equal(company.backstage.premises.length,3);
    assert.equal(company.strategy.essays.length,3);
    for(const premise of company.backstage.premises)assert.ok(company.appScreens.includes(premise.screen));
    const html=fs.readFileSync(`.next/server/app/companies/${company.id}/backstage.html`,'utf8');
    for(const premise of company.backstage.premises)assert.ok(html.includes(companyHref(company.id,'app',premise.screen)));
    for(const section of ['history','leadership','essays'])assert.ok(html.includes(companyHref(company.id,'backstage',section)));
    const known=new Set(company.backstage.sources.map(s=>s.url));
    const used=[...company.strategy.moments.flatMap(m=>[m.source,...(m.sources||[])]),...company.strategy.essays.flatMap(e=>e.sources),...company.strategy.leadership.sources,company.strategy.watch.source];
    for(const url of used)assert.ok(known.has(url),`Unregistered supporting source ${company.id}: ${url}`);
  }
});
test('Rippling Backstage opens the compound-company study with direct access to its core arguments',()=>{
  const root='.next/server/app/companies/rippling/backstage';
  const html=fs.readFileSync(`${root}.html`,'utf8');
  assert.match(html,/<h1\b[^>]*>The company that compounds\.<\/h1>/);
  assert.match(html,/Compounding is arithmetic/);
  assert.doesNotMatch(html,/Extended Rippling study/);
  const links=[...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match=>match[1]);
  for(const section of ['manual/the-second-product','manual/the-platform-tax','manual/the-j-curve','ask']){
    assert.ok(links.includes(companyHref('rippling','backstage',section)),`Missing direct entry to ${section}`);
  }
  assert.match(fs.readFileSync(`${root}/manual/the-second-product.html`,'utf8'),/Full customer acquisition cost/);
  assert.match(fs.readFileSync(`${root}/manual/the-platform-tax.html`,'utf8'),/Does product N ship faster/);
  assert.match(fs.readFileSync(`${root}/ask.html`,'utf8'),/Fourteen questions, including the ones that sting/);
});
test('each company exposes its own complete Backstage navigation with working destinations',()=>{
  const routes=JSON.parse(fs.readFileSync('.next/prerender-manifest.json','utf8')).routes;
  for(const company of COMPANIES){
    const html=fs.readFileSync(`.next/server/app/companies/${company.id}/backstage.html`,'utf8');
    const nav=html.match(/<nav aria-label="Backstage sections"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(nav,`Missing ${company.id} navigation`);
    const links=[...nav.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match=>match[1]);
    for(const group of company.backstage.navigation)for(const section of group.sections){
      const href=companyHref(company.id,'backstage',section.id);
      assert.ok(links.includes(href),`Missing navigation entry ${href}`);
      assert.ok(routes[href],`Missing navigation destination ${href}`);
    }
    assert.ok(links.every(href=>href.startsWith(`/companies/${company.id}/backstage`)||href===company.ecosystem?.href));
    if(company.ecosystem){assert.ok(links.includes(company.ecosystem.href));assert.ok(routes[company.ecosystem.href]);}
  }
});
