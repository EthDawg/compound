const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function worker({ cached, network = new Response('current'), keys = [] } = {}) {
  const handlers = {}, writes = [], deleted = [];
  let requests = 0;
  vm.runInNewContext(fs.readFileSync('public/sw.js', 'utf8'), {
    URL, Set,
    self: { location: { origin: 'https://compound.example' }, addEventListener: (name, handler) => { handlers[name] = handler; }, clients: { claim: async () => {} } },
    caches: {
      match: async () => cached,
      keys: async () => keys,
      delete: async key => { deleted.push(key); },
      open: async () => ({ put: async (request, response) => { writes.push(await response.text()); } }),
    },
    fetch: async () => { requests++; return network; },
  });
  return {
    writes, deleted, requests: () => requests,
    async fetch(path, mode = 'cors') {
      let response;
      const pending = [];
      handlers.fetch({ request: { method: 'GET', url: `https://compound.example${path}`, mode }, respondWith: value => { response = value; }, waitUntil: value => { pending.push(value); } });
      const result = await response;
      await Promise.all(pending);
      return result;
    },
    async activate() { let promise; handlers.activate({ waitUntil: p => { promise = p; } }); await promise; },
  };
}

test('an old development script cannot override the current build at an unchanged URL', async () => {
  const instance = worker({ cached: new Response('old app', { headers: { 'cache-control': 'no-store' } }) });
  const response = await instance.fetch('/_next/static/chunks/app/page.js');
  assert.equal(await response.text(), 'current');
  assert.equal(instance.requests(), 1);
  assert.deepEqual(instance.writes, []);
});

test('only successful immutable build assets are kept for offline use', async () => {
  const headers = { 'cache-control': 'public, max-age=31536000, immutable' };
  const cached = worker({ cached: new Response('hashed build', { headers }) });
  assert.equal(await (await cached.fetch('/_next/static/chunks/abc12345.js')).text(), 'hashed build');
  assert.equal(cached.requests(), 0);
  const fresh = worker({ network: new Response('new build', { headers }) });
  await fresh.fetch('/_next/static/chunks/def67890.js');
  assert.deepEqual(fresh.writes, ['new build']);
  const failed = worker({ network: new Response('not found', { status: 404, headers }) });
  await failed.fetch('/_next/static/chunks/missing.js');
  assert.deepEqual(failed.writes, []);
});

test('research and company journeys never fall back to an unrelated Pocket scene', async () => {
  const instance = worker({ cached: new Response('Pocket') });
  for (const path of ['/research/cognition', '/companies/workday/app', '/?category=enterprise-ai']) {
    assert.equal(await instance.fetch(path, 'navigate'), undefined);
  }
  assert.equal(instance.requests(), 0, 'normal browser navigation owns non-Pocket requests');
  const pocket = worker();
  assert.equal(await (await pocket.fetch('/pocket/onboard', 'navigate')).text(), 'current');
  assert.deepEqual(pocket.writes, ['current']);
});

test('worker upgrades remove only Compound-owned caches', async () => {
  const instance = worker({ keys: ['compound-v3', 'compound-v4', 'another-app'] });
  await instance.activate();
  assert.deepEqual(instance.deleted, ['compound-v3']);
});
