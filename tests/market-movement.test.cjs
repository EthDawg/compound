const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, f);
const { eventPeriod, eventTiming, movementWindow, readMovement, matchesMovement, careerContext } = require('../lib/data/market-movement.ts');
const { createEcosystem } = require('../lib/data/anz-ecosystem.ts');
const { WORKDAY_ECOSYSTEM: wd } = require('../lib/data/workday-anz.ts');
const { SERVICENOW_ECOSYSTEM: sn } = require('../lib/data/servicenow-anz.ts');
const asOf = '2026-09-11';
const signal = (changes = {}) => ({ id: 'build', date: '2026-06-01', dateLabel: 'June 2026', companyIds: ['firm'], personIds: [], type: 'Expansion', movement: 'Building', scope: 'ANZ', title: 'Practice build', text: 'Fixture', implication: 'Fixture', source: 'Fixture', url: 'https://example.com/evidence', ...changes });

test('event timing preserves source precision and handles the 18-month boundary', () => {
  assert.equal(eventPeriod('2024-02').end.toISOString(), '2024-02-29T23:59:59.999Z');
  assert.equal(eventPeriod('2025').end.toISOString(), '2025-12-31T23:59:59.999Z');
  for (const invalid of ['2026-02-30', '2026-13', '2026-2', 'n/a', '']) assert.equal(eventPeriod(invalid), null);
  assert.equal(movementWindow('2026-08-31').start.toISOString().slice(0, 10), '2025-02-28');
  assert.equal(eventTiming('2025-03-10', asOf), 'historical');
  assert.equal(eventTiming('2025-03-11', asOf), 'recent');
  assert.equal(eventTiming('2025-03', asOf), 'uncertain');
  assert.equal(eventTiming('2025', asOf), 'uncertain');
  assert.equal(eventTiming('2026', asOf), 'recent');
  assert.equal(eventTiming('2026-09-11', asOf), 'recent');
  assert.equal(eventTiming('2026-09-12', asOf), 'future');
  assert.equal(eventTiming(null, asOf), 'undated');
  assert.equal(eventTiming('2026-02-30', asOf), 'invalid');
});

test('local direction, regional context and acquired ownership cannot overwrite each other', () => {
  const local = signal({ movement: 'Growing' });
  const acquired = signal({ id: 'sale', date: '2026-08-01', movement: 'Acquired', scope: 'Global', companyIds: ['firm', 'buyer'], targetIds: ['firm'] });
  const regional = signal({ id: 'regional', date: '2026-09-01', scope: 'APAC' });
  const reading = readMovement('firm', asOf, [local, acquired, regional]);
  assert.equal(reading.direction, 'Growing');
  assert.equal(reading.event.id, local.id);
  assert.deepEqual(reading.ownershipSignals.map(e => e.id), ['sale']);
  assert.deepEqual(reading.regionalSignals.map(e => e.id), ['regional']);
  assert.equal(matchesMovement(reading, 'Growing'), true);
  assert.equal(matchesMovement(reading, 'Acquired'), true);
  assert.equal(readMovement('buyer', asOf, [acquired]).label, 'No recent signal');
  assert.equal(readMovement('firm', asOf, [regional]).direction, null);
  assert.equal(readMovement('firm', asOf, [signal({ scope: 'Global' })]).direction, null);
});

test('opposing local evidence remains mixed; a single newest event cannot erase it', () => {
  const events = [signal({ id: 'loss', movement: 'Contracting', date: '2025-04-01' }), signal({ id: 'growth', movement: 'Growing' })];
  const reading = readMovement('firm', asOf, events);
  assert.equal(reading.direction, 'Mixed signals');
  assert.equal(reading.localSignals.length, 2);
  assert.equal(matchesMovement(reading, 'Growing'), false);
  assert.equal(matchesMovement(reading, 'Mixed signals'), true);
  assert.equal(readMovement('firm', '2027-04-01', events).direction, 'Growing', 'expired negative evidence is no longer recent');
  for (const date of [null, '2025', '2025-03', '2026-09-12', 'invalid']) {
    assert.equal(readMovement('firm', asOf, [signal({ date })]).direction, null);
  }
  assert.equal(readMovement('firm', asOf, [signal({ type: 'Senior hire', movement: undefined })]).direction, null);
  assert.equal(readMovement('firm', asOf, [signal({ type: 'Acquisition', movement: undefined, targetIds: ['firm'] })]).ownershipSignals.length, 0, 'an announcement type alone cannot establish completed ownership');
});

test('filtered history retains explicit lineage without pulling in unrelated buyer activity', () => {
  const timeline = wd.movementTimeline('', '', 'Building', true, 'synergy');
  assert.ok(timeline.dated.some(e => e.id === 'tom-acquisition'));
  assert.ok(timeline.dated.some(e => e.id === 'synergy-hires'));
  const x = sn.movementTimeline('', '', 'Building', true, 'xamplify');
  assert.ok(x.dated.some(e => e.id === 'epicon-telstra'));
  assert.ok(!x.dated.some(e => e.id === 'cloudgo-rgp'));
  const filtered = sn.movementTimeline('', '', 'Building', true);
  assert.ok(filtered.dated.length > sn.movementTimeline('', '', 'Building').dated.length);
});

test('recent, historic and unplaced evidence remain separate, with no duplicate or future events', () => {
  const fixture = createEcosystem({ ...wd, research: { ...wd.research, events: [
    signal({ id: 'recent' }), signal({ id: 'old', date: '2024' }), signal({ id: 'boundary', date: '2025' }),
    signal({ id: 'undated', date: null }), signal({ id: 'invalid', date: '2025-02-30' }), signal({ id: 'future', date: '2027' }),
  ] } });
  const recent = fixture.movementTimeline(), history = fixture.movementTimeline('', '', '', true);
  assert.deepEqual(recent.dated.map(e => e.id), ['recent']);
  assert.deepEqual(new Set(recent.unplaced.map(e => e.id)), new Set(['boundary', 'undated', 'invalid']));
  assert.deepEqual(history.dated.map(e => e.id), ['recent', 'boundary', 'old']);
  assert.deepEqual(new Set(history.unplaced.map(e => e.id)), new Set(['undated', 'invalid']));
  for (const ecosystem of [wd, sn]) {
    const result = ecosystem.movementTimeline();
    assert.ok(result.dated.every(e => eventTiming(e.date, ecosystem.asOf) === 'recent'));
    assert.equal(new Set([...result.dated, ...result.unplaced].map(e => e.id)).size, result.dated.length + result.unplaced.length);
  }
});

test('career context opens the recorded person and firm without incompatible timeline filters', () => {
  for (const ecosystem of [wd, sn]) {
    for (const person of ecosystem.ANZ_PEOPLE) {
      const url = new URL(ecosystem.ecosystemHref(careerContext(person), 'lens=movement&find=elsewhere&cap=Payroll&signal=Acquired&evidence=named&proof=Finance&customer=old&period=all'), 'https://compound.example');
      assert.equal(url.searchParams.get('lens'), 'people');
      assert.equal(url.searchParams.get('firm'), person.companyId);
      assert.equal(url.searchParams.get('person'), person.id);
      assert.ok(ecosystem.peopleInLineage(person.companyId).some(p => p.id === person.id));
      for (const key of ['find', 'cap', 'signal', 'evidence', 'proof', 'customer']) assert.equal(url.searchParams.has(key), false, key);
      assert.equal(url.searchParams.get('period'), 'all');
    }
  }
});
