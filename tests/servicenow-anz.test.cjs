const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
const { SERVICENOW_ECOSYSTEM: sn } = require('../lib/data/servicenow-anz.ts');
const { WORKDAY_ECOSYSTEM: wd } = require('../lib/data/workday-anz.ts');
const { COMPANY_INDEX, searchCompanies, companyDestination } = require('../lib/company-index.ts');
const { practiceLinks } = require('../lib/ecosystem-index.ts');

test('ServiceNow facts have sources and all career, event, customer and lineage links resolve', () => {
  const ids = new Set(sn.ANZ_COMPANIES.map((c) => c.id));
  assert.equal(ids.size, sn.ANZ_COMPANIES.length);
  assert.equal(sn.ANZ_ACTIVE.length, 30);
  const facts = sn.ANZ_COMPANIES.flatMap((c) => [c.owner,c.presence,c.partnerStatus,c.founded,...c.capabilities].filter(Boolean));
  for (const c of sn.ANZ_COMPANIES) {
    assert.ok(c.capabilities.every((f) => sn.CAPABILITIES.includes(f.capability)));
    assert.equal(c.size, undefined);
  }
  for (const p of sn.ANZ_PEOPLE) {
    assert.ok(ids.has(p.companyId));
    for (const step of p.career) assert.ok(ids.has(step.companyId));
    facts.push(p.current,...p.career);
  }
  for (const e of sn.ANZ_EVENTS) {
    assert.ok(e.companyIds.every((id) => ids.has(id)));
    assert.ok((e.targetIds ?? []).every((id) => e.companyIds.includes(id)));
    assert.ok(e.date === null || /^\d{4}(-\d{2}){0,2}$/.test(e.date));
    facts.push(e);
  }
  for (const c of sn.ANZ_CUSTOMERS) { assert.ok(ids.has(c.companyId)); assert.ok(c.capabilities.every((cap) => sn.CAPABILITIES.includes(cap))); facts.push(c.fact); }
  for (const l of sn.ANZ_LINEAGES) { assert.ok(l.companyIds.every((id) => ids.has(id))); assert.ok(l.eventIds.every((id) => sn.ANZ_EVENTS.some((e) => e.id === id))); }
  for (const f of facts) { assert.ok(f.text && f.source); assert.equal(new URL(f.url).protocol,'https:'); }
});

test('ServiceNow uses its own workflow vocabulary and keeps credentials separate from local work', () => {
  assert.ok(sn.CAPABILITIES.includes('IT') && sn.CAPABILITIES.includes('Employee'));
  assert.ok(!sn.CAPABILITIES.includes('Payroll'));
  assert.ok(wd.CAPABILITIES.includes('Payroll') && !wd.CAPABILITIES.includes('IT'));
  assert.ok(!sn.searchAnz('', 'Employee').some((c) => c.id === 'ikc'));
  assert.ok(sn.searchAnz('', 'Employee').some((c) => c.id === 'coforge'));
  assert.ok(sn.searchAnz('', 'IT').some((c) => c.id === 'novabridge'), 'named work survives the capability filter');
  assert.ok(sn.searchAnz('', 'Implementation').some((c) => c.id === 'deloitte'), 'documented DISER co-delivery establishes local scope');
  assert.ok(!sn.searchAnz('', 'Employee').some((c) => c.id === 'ibm'), 'global offer is not local proof');
});

test('career search connects people to current practices and acquired predecessors without inventing current roles', () => {
  assert.ok(sn.searchAnz('Tobias Schwartz').some((c) => c.id === 'tmlabs'));
  assert.ok(sn.searchAnz('Enable').some((c) => c.id === 'fujitsu'));
  assert.ok(sn.searchAnz('Service Potential').some((c) => c.id === 'novabridge'));
  assert.ok(sn.searchAnz('ND&Co').some((c) => c.id === 'nd-and-co'));
  assert.ok(sn.peopleInLineage('enable').some((p) => p.id === 'bruce-hara' && p.roleStatus === 'historical'));
  assert.ok(sn.peopleInLineage('tmlabs').some((p) => p.id === 'tobias-schwartz' && p.roleStatus === 'source snapshot'));
  assert.ok(!sn.peopleInLineage('coforge').some((p) => p.id === 'tobias-schwartz'), 'an acquisition is not evidence of an individual Coforge role');
  assert.ok(sn.ANZ_ACTIVE.every((c) => !c.historical));
});

test('awards and undated talent stories do not manufacture growth; historical deals remain discoverable', () => {
  for (const id of ['kinetic-it', 'datacom', 'cognizant']) assert.equal(sn.companyMovement(id).label, 'No recent signal');
  assert.equal(sn.companyMovement('nexon').label, 'Acquired', 'December 2025 investment changes ownership, not local growth');
  assert.equal(sn.companyMovement('xamplify').label, 'Building');
  assert.equal(sn.companyMovement('xamplify', '2030-01-01').label, 'No recent signal');
  assert.ok(!sn.movementEvents().some((e) => e.id === 'epicon-telstra'));
  const history = sn.movementEvents('', '', '', true);
  assert.equal(history.length, sn.ANZ_EVENTS.length);
  assert.ok(history.some((e) => e.id === 'cloudgo-rgp'));
  assert.ok(sn.movementEvents('xAmplify', '', '', true).some((e) => e.id === 'epicon-telstra'));
  assert.equal(sn.ANZ_EVENTS.find((e) => e.id === 'tcloud-xamplify').date, null);
});

test('company finder merges shared firms and links to the selected platform without inventing App studies', () => {
  const cognizant = COMPANY_INDEX.filter((c) => c.id === 'cognizant');
  assert.equal(cognizant.length, 1);
  assert.deepEqual(practiceLinks('cognizant').map((p) => p.ecosystemName).sort(), ['ServiceNow','Workday']);
  for (const platform of ['workday','servicenow']) assert.ok(companyDestination(cognizant[0], `/atlas/${platform}`).startsWith(`/atlas/${platform}?`));
  const x = searchCompanies('xamp')[0].company;
  assert.equal(x.id, 'xamplify'); assert.equal(x.appHref, undefined); assert.equal(x.atlasListed, false);
  assert.ok(companyDestination(x, '/companies/anthropic/app').startsWith('/atlas/servicenow?'));
  assert.ok(searchCompanies('Glen Watson').some((r) => r.company.id === 'novabridge'));
  const service = COMPANY_INDEX.find((c) => c.id === 'servicenow');
  assert.equal(companyDestination(service, '/atlas/workday'), '/atlas/servicenow');
  assert.equal(companyDestination(service, '/companies/rippling/backstage'), '/companies/servicenow/backstage');
});

test('each ecosystem preserves its own URL state and the new route is built', () => {
  const href = sn.ecosystemHref({ firm: 'coforge', person: 'tobias-schwartz' }, 'lens=movement&period=all&find=TMLabs');
  const url = new URL(href,'https://compound.example');
  assert.equal(url.pathname,'/atlas/servicenow');
  assert.equal(url.searchParams.get('period'),'all');
  assert.equal(url.searchParams.get('find'),'TMLabs');
  assert.equal(url.searchParams.get('scope'),'anz');
  const routes = JSON.parse(fs.readFileSync('.next/server/app-paths-manifest.json','utf8'));
  for (const path of ['/atlas/workday/page','/atlas/servicenow/page']) assert.ok(routes[path], path);
});
