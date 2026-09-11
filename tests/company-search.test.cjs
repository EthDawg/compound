const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
const { COMPANY_INDEX, searchCompanies, companyDestination, atlasCompanyHref, recentCompanies } = require('../lib/company-index.ts');
const { ALL_VENDORS } = require('../lib/data/atlas-nodes.ts');
const { COMPANIES } = require('../lib/companies.ts');
const first = (q) => searchCompanies(q)[0]?.company.id;

test('one catalogue includes every Atlas company and every full study exactly once', () => {
  assert.equal(COMPANY_INDEX.length, ALL_VENDORS.length);
  assert.equal(new Set(COMPANY_INDEX.map((c) => c.id)).size, COMPANY_INDEX.length);
  assert.deepEqual(COMPANY_INDEX.filter((c) => c.studyId).map((c) => c.id).sort(), COMPANIES.map((c) => c.id).sort());
});

test('recognises partial names, product names, spacing, case and modest spelling errors', () => {
  for (const [query, id] of [['anth', 'anthropic'], [' CLAUDE ', 'anthropic'], ['chatg', 'openai'], ['codex', 'openai'], ['page up', 'pageup'], ['eleven labs', 'elevenlabs'], ['ellevenlabs', 'elevenlabs'], ['service now', 'servicenow'], ['KeyPay', 'employment-hero'], ['workdy', 'workday']]) assert.equal(first(query), id, query);
  assert.equal(searchCompanies('Claude')[0].reason, 'Claude');
  assert.equal(searchCompanies('ellevenlabs')[0].reason, 'Close spelling');
});

test('an unavailable exact or prefix match remains visible ahead of available alternatives', () => {
  for (const query of ['sales', 'salesforce']) {
    const result = searchCompanies(query)[0].company;
    assert.equal(result.id, 'salesforce');
    assert.equal(result.availability, 'Atlas only');
    assert.equal(result.appHref, undefined);
    assert.equal(result.backstageHref, undefined);
  }
  assert.ok(searchCompanies('CRM').some((m) => m.company.id === 'hubspot'));
  assert.ok(searchCompanies('payroll').length > 1);
  assert.deepEqual(searchCompanies('company-that-isnt-in-this-catalogue'), []);
  assert.deepEqual(searchCompanies('  '), []);
});

test('result links preserve supported study context and locate index-only companies in the Atlas', () => {
  const anthropic = COMPANY_INDEX.find((c) => c.id === 'anthropic');
  assert.equal(companyDestination(anthropic, '/companies/openai/backstage/sources'), '/companies/anthropic/backstage/sources');
  assert.equal(companyDestination(anthropic, '/companies/openai/app/tools'), '/companies/anthropic/app');
  const salesforce = COMPANY_INDEX.find((c) => c.id === 'salesforce');
  assert.equal(companyDestination(salesforce, '/companies/anthropic/app/code'), '/?company=salesforce');
  assert.equal(companyDestination(salesforce, '/companies/anthropic/backstage'), '/?company=salesforce');
  for (const company of COMPANY_INDEX) assert.equal(new URL(atlasCompanyHref(company.id), 'https://compound.example').searchParams.get('company'), company.id);
});

test('recent history is bounded, deduplicated and rejects stale or malformed entries', () => {
  assert.deepEqual(recentCompanies(['openai', 'anthropic', 'openai', 'missing', 12], 'anthropic'), ['anthropic', 'openai']);
  assert.deepEqual(recentCompanies({ id: 'openai' }, 'anthropic'), ['anthropic']);
  assert.equal(recentCompanies(COMPANY_INDEX.map((c) => c.id)).length, 6);
});
