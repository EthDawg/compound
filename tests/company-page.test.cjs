const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const next = require('next');

// Metadata depends on the selected company, so the homepage is rendered on
// request. Exercise its actual production response instead of a static HTML file.
test('built company pages preserve discovery links and distinguish graph tabs', { timeout: 60000 }, async () => {
  const app = next({ dev: false, dir: process.cwd(), hostname: '127.0.0.1' });
  await app.prepare();
  const server = http.createServer(app.getRequestHandler());
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
    const origin = `http://127.0.0.1:${server.address().port}`;
    const page = async path => {
      const response = await fetch(origin + path);
      assert.equal(response.status, 200, path);
      return response.text();
    };
    const home = await page('/');
    for (const route of ['/earth', '/technology', '/decisions', '/atlas/workday']) assert.ok(home.includes(`href="${route}"`), route);
    assert.match(home, /<title>Compound — the technology field guide<\/title>/);
    assert.match(await page('/?connections=nvidia'), /<title>NVIDIA connections · Compound<\/title>/);
    assert.match(await page('/?connections=theory-of-mind'), /<title>Theory of Mind connections · Compound<\/title>/);
    assert.match(await page('/?connections=unknown-company'), /<title>Company connections · Compound<\/title>/);
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await app.close();
  }
});
