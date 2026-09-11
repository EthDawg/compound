const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
const { ANZ_COMPANIES, ANZ_ACTIVE, ANZ_PEOPLE, ANZ_EVENTS, ANZ_CUSTOMERS, ANZ_LINEAGES, CAPABILITIES, searchAnz, companyMovement, movementEvents, peopleInLineage, ecosystemHref, directoryRequested } = require('../lib/data/workday-anz.ts');
const { WORKDAY_PARTNERS } = require('../lib/data/workday-partners.ts');

test('all intelligence links resolve to real companies, people, capabilities, customers and directory entries', () => {
  const companies = new Set(ANZ_COMPANIES.map((c) => c.id));
  assert.equal(companies.size, ANZ_COMPANIES.length);
  for (const c of ANZ_COMPANIES) {
    if (c.directorySlug) assert.ok(WORKDAY_PARTNERS.some((p) => p.slug === c.directorySlug), c.id);
    for (const f of c.capabilities) assert.ok(CAPABILITIES.includes(f.capability));
  }
  for (const p of ANZ_PEOPLE) { assert.ok(companies.has(p.companyId)); for (const step of p.career) assert.ok(companies.has(step.companyId)); }
  for (const e of ANZ_EVENTS) {
    for (const id of e.companyIds) assert.ok(companies.has(id));
    for (const id of e.personIds) assert.ok(ANZ_PEOPLE.some((p) => p.id === id));
    for (const id of e.targetIds ?? []) assert.ok(e.companyIds.includes(id));
  }
  for (const x of ANZ_CUSTOMERS) { assert.ok(companies.has(x.companyId)); assert.ok(x.capabilities.every((c) => CAPABILITIES.includes(c))); }
  for (const l of ANZ_LINEAGES) { assert.ok(l.companyIds.every((id) => companies.has(id))); assert.ok(l.eventIds.every((id) => ANZ_EVENTS.some((e) => e.id === id))); }
});

test('facts and career steps retain public evidence and local size is never borrowed from the parent', () => {
  const facts = [...ANZ_COMPANIES.flatMap((c) => [c.owner, c.presence, c.founded, c.go, c.size, ...c.capabilities].filter(Boolean)), ...ANZ_PEOPLE.flatMap((p) => [p.current, ...p.career]), ...ANZ_EVENTS, ...ANZ_CUSTOMERS.map((x) => x.fact)];
  for (const f of facts) { assert.ok(f.text && f.source); const url = new URL(f.url); assert.equal(url.protocol, 'https:'); assert.ok(!url.username && !url.password); }
  assert.ok(ANZ_ACTIVE.every((c) => c.size === undefined));
  const elephant = ANZ_ACTIVE.find((c) => c.id === 'group-elephant');
  assert.ok(elephant.capabilities.every((f) => f.scope === 'Global'));
  assert.ok(!searchAnz('', 'Implementation').some((c) => c.id === 'group-elephant'));
  const federation = ANZ_CUSTOMERS.find((x) => x.id === 'federation-university');
  assert.ok(federation.capabilities.includes('Payroll'));
  assert.ok(!federation.capabilities.includes('Finance') && !federation.capabilities.includes('Student'));
});

test('people search follows former firms and career navigation keeps alumni beside current leaders', () => {
  assert.ok(searchAnz('Mitch Collins').some((c) => c.id === 'cognizant'));
  assert.ok(searchAnz('Mitch Collins').some((c) => c.id === 'kainos'));
  assert.ok(searchAnz('Versor').some((c) => c.id === 'kliqtek'));
  assert.ok(peopleInLineage('deloitte').some((p) => p.id === 'andrew-hill'));
  assert.ok(peopleInLineage('deloitte').some((p) => p.id === 'kurt-proctor-parker'));
  assert.ok(peopleInLineage('cognizant').some((p) => p.id === 'mitch-collins'));
  assert.equal(searchAnz('a person absent from this research').length, 0);
});

test('movement uses dated evidence, expires and labels the acquired target rather than the buyer', () => {
  assert.equal(companyMovement('intecrowd').label, 'Acquired');
  assert.equal(companyMovement('ust').label, 'No recent signal');
  assert.equal(companyMovement('kainos').label, 'Growing');
  assert.equal(companyMovement('synergy').label, 'Building');
  assert.equal(companyMovement('cognizant').label, 'No recent signal');
  assert.equal(companyMovement('bosley').label, 'No recent signal');
  assert.equal(companyMovement('kainos', '2030-01-01').label, 'No recent signal');
  const event = ANZ_EVENTS.find((e) => e.id === 'kainos-growth');
  assert.equal(companyMovement('kainos', '2026-01-01', [event]).label, 'No recent signal');
  assert.equal(companyMovement('kainos', undefined, [{ ...event, scope: 'Global' }]).label, 'No recent signal');
  assert.equal(companyMovement('kainos', undefined, [{ ...event, date: null }]).label, 'No recent signal');
  assert.equal(companyMovement('kainos', undefined, [{ ...event, movement: 'Contracting' }]).label, 'Contracting');
});

test('movement filters and firm counts refer to the same recent signals, with history retained in lineage', () => {
  const acquired = movementEvents('', '', 'Acquired');
  assert.deepEqual(acquired.map((e) => e.id), ['intecrowd-ust']);
  for (const state of ['Building', 'Growing', 'Acquired', 'Contracting']) {
    const expected = new Set(searchAnz('', '', state).map((c) => companyMovement(c.id).event.id));
    assert.deepEqual(new Set(movementEvents('', '', state).map((e) => e.id)), expected);
  }
  assert.ok(!movementEvents().some((e) => e.id === 'tom-acquisition'));
  assert.ok(ANZ_LINEAGES.some((l) => l.eventIds.includes('tom-acquisition')));
  assert.ok(movementEvents().some((e) => e.id === 'bosley-go' && e.date === null));
});

test('new views preserve deep-link state while old directory URLs retain their original destination', () => {
  assert.equal(directoryRequested(new URLSearchParams()), false);
  for (const q of ['partner=cognizant', 'region=APAC&product=Payroll', 'view=list', 'q=Kainos', 'scope=global']) assert.equal(directoryRequested(new URLSearchParams(q)), true, q);
  assert.equal(directoryRequested(new URLSearchParams('scope=anz&view=list')), false);
  const url = new URL(ecosystemHref({ firm: 'deloitte', person: 'andrew-hill' }, 'lens=people&find=Andrew'), 'https://compound.example');
  assert.equal(url.searchParams.get('lens'), 'people');
  assert.equal(url.searchParams.get('find'), 'Andrew');
  assert.equal(url.searchParams.get('person'), 'andrew-hill');
  assert.equal(url.searchParams.get('scope'), 'anz');
});

test('company ownership lineage never invents individual career links', () => {
  for (const company of ANZ_COMPANIES) {
    for (const person of peopleInLineage(company.id)) {
      assert.ok(person.companyId === company.id || person.career.some(s => s.companyId === company.id), `${person.name} / ${company.name}`);
    }
  }
});
