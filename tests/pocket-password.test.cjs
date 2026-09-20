const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { PASSWORD_APPS, DEMO_PASSWORD, passwordApp, passwordModeEnabled, pocketAppHref, acceptsDemoCredentials, demoSessionKey } = require('../lib/pocket-password.ts');

test('password mode is opt-in and malformed app bookmarks fall back safely', () => {
  for (const value of [null, '', '0', 'true', 'yes']) assert.equal(passwordModeEnabled(value), false);
  assert.equal(passwordModeEnabled('1'), true);
  for (const value of [null, '', 'https://example.com', 'javascript:alert(1)']) assert.equal(passwordApp(value).id, 'rippling');
});
test('each bookmark retains app and flag without including any credentials', () => {
  for (const app of PASSWORD_APPS) {
    const url = new URL(pocketAppHref(app.id, true), 'https://compound.example');
    assert.equal(url.pathname, '/pocket');
    assert.equal(url.searchParams.get('app'), app.id);
    assert.equal(url.searchParams.get('passwordMode'), '1');
    assert.equal(url.searchParams.size, 2);
    assert.ok(!url.href.includes(DEMO_PASSWORD));
    assert.ok(!url.href.includes(app.username));
    assert.equal(new URL(pocketAppHref(app.id, false), url).searchParams.has('passwordMode'), false);
  }
});
test('mock login accepts only the selected app fixture, and sessions have separate keys', () => {
  assert.equal(new Set(PASSWORD_APPS.map(app => demoSessionKey(app.id))).size, PASSWORD_APPS.length);
  for (const app of PASSWORD_APPS) {
    assert.equal(acceptsDemoCredentials(app.id, ` ${app.username.toUpperCase()} `, DEMO_PASSWORD), true);
    assert.equal(acceptsDemoCredentials(app.id, app.username, 'wrong'), false);
    assert.equal(acceptsDemoCredentials(app.id, '', ''), false);
    for (const other of PASSWORD_APPS.filter(other => other.id !== app.id)) assert.equal(acceptsDemoCredentials(app.id, other.username, DEMO_PASSWORD), false);
  }
});
test('mock workspace links resolve to existing company apps in production', () => {
  const routes = JSON.parse(fs.readFileSync('.next/prerender-manifest.json', 'utf8')).routes;
  for (const app of PASSWORD_APPS) assert.ok(routes[`/companies/${app.id}/app`]);
});
