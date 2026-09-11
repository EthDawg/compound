const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
const { COMPANY_CONNECTIONS, connectionsFor, connectionOther } = require('../lib/data/company-connections.ts');
const { COMPANY_INDEX, companyDestination, companyConnectionsHref, recentCompanyVisits, searchCompanies } = require('../lib/company-index.ts');

test('each relationship has canonical companies and individually dated source evidence', () => {
  const companies = new Set(COMPANY_INDEX.map(c => c.id));
  assert.equal(new Set(COMPANY_CONNECTIONS.map(e => e.id)).size, COMPANY_CONNECTIONS.length);
  for (const edge of COMPANY_CONNECTIONS) {
    assert.ok(companies.has(edge.from), edge.from);
    assert.ok(companies.has(edge.to), edge.to);
    assert.notEqual(edge.from, edge.to);
    assert.ok(edge.verb && edge.status && edge.date && edge.detail && edge.limit, edge.id);
    assert.ok(edge.sources.length, edge.id);
    for (const source of edge.sources) {
      assert.equal(new URL(source.url).protocol, 'https:');
      assert.match(source.checked, /^\d{4}-\d{2}-\d{2}$/);
    }
  }
});

test('a connection is traceable from both companies without reversing its factual direction', () => {
  for (const edge of COMPANY_CONNECTIONS) {
    for (const [selected, other] of [[edge.from, edge.to], [edge.to, edge.from]]) {
      const found = connectionsFor(selected).find(e => e.id === edge.id);
      assert.equal(found, edge);
      assert.equal(connectionOther(found, selected), other);
    }
  }
  assert.deepEqual(connectionsFor('company-not-in-the-catalogue'), []);
  assert.deepEqual(connectionsFor('salesforce'), []); // Recognised is distinct from mapped.
});

test('acquisition context does not invent a deal for a later employer or founding team', () => {
  const tom = COMPANY_CONNECTIONS.find(e => e.id === 'tom-acquisition');
  assert.deepEqual([tom.from, tom.to, tom.status], ['collaborative', 'theory-of-mind', 'Acquisition announced']);
  const versor = COMPANY_CONNECTIONS.find(e => e.id === 'versor-sale');
  assert.deepEqual([versor.from, versor.to], ['fujitsu', 'versor']);
  const lineage = connectionsFor('kliqtek');
  assert.ok(lineage.length);
  assert.ok(lineage.every(e => e.kind === 'People lineage'));
  assert.ok(connectionsFor('synergy').every(e => e.kind === 'People lineage'));
  assert.ok(COMPANY_CONNECTIONS.filter(e => e.kind === 'People lineage').every(e => new URL(e.context.href, 'https://compound.example').searchParams.get('person')));
  assert.match(COMPANY_CONNECTIONS.find(e => e.id === 'hynix-tsmc').status, /Announced/);
  assert.match(COMPANY_CONNECTIONS.find(e => e.id === 'infosys-optimum').limit, /does not establish.*ANZ/);
});

test('company finder stays in connections across every company including unplotted history', () => {
  for (const company of COMPANY_INDEX) {
    assert.equal(companyDestination(company, '/', '?connections=fireworks'), companyConnectionsHref(company.id));
  }
  const historical = COMPANY_INDEX.find(c => c.id === 'theory-of-mind');
  assert.equal(historical.atlasListed, false);
  assert.equal(companyDestination(historical, '/', '?connections=collaborative'), '/?connections=theory-of-mind');
  const person = searchCompanies('Mitch Collins').find(m => m.context?.kind === 'Person');
  assert.ok(person.context.href.includes('person=mitch-collins')); // Explicit evidence matches remain available.
});

test('recents accept graph visits only for the exact selected identity', () => {
  assert.deepEqual(recentCompanyVisits([], { id: 'theory-of-mind', href: '/?connections=theory-of-mind' }), [{ id: 'theory-of-mind', href: '/?connections=theory-of-mind' }]);
  for (const href of ['/?connections=nvidia', '/?company=fireworks&connections=nvidia', '//outside.example/?connections=fireworks', '/?connections=unknown']) {
    assert.deepEqual(recentCompanyVisits([], { id: 'fireworks', href }), [], href);
  }
});
