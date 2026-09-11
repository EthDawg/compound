// Conservative service worker. Its jobs, in order of importance:
//   1. Make the app installable (Chrome requires a fetch handler).
//   2. Keep the three pocket flows usable on a bad conference-centre network.
// It deliberately does NOT cache-first any navigation — a stale shell in a
// Next.js app produces chunk mismatches that look like the app is broken.

const VERSION = "compound-v4";
const POCKET = new Set(['/pocket', '/pocket/onboard', '/pocket/offboard', '/pocket/ask']);
const SHELL = [
  "/pocket",
  "/pocket/onboard",
  "/pocket/offboard",
  "/pocket/ask",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((c) => c.addAll(SHELL).catch(() => undefined))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('compound-') && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Only the Pocket scenarios have an offline fallback. Other destinations must
  // never turn into an unrelated Pocket scene when their network request fails.
  if (request.mode === "navigate") {
    if (!POCKET.has(url.pathname)) return;
    event.respondWith(
      fetch(request)
        .then(async (res) => {
          if (res.ok) {
            const copy = res.clone();
            await caches.open(VERSION).then((c) => c.put(request, copy)).catch(() => undefined);
          }
          return res;
        })
        .catch(() =>
          caches.match(request).then((hit) => hit || caches.match("/pocket"))
        )
    );
    return;
  }

  // Development files also use /_next/static, but their names are not hashed.
  // Cache build assets only when the server explicitly marks them immutable.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.endsWith(".png")) {
    const cacheable = (response) => response?.ok && (url.pathname.endsWith('.png') || /(?:^|,)\s*immutable\s*(?:,|$)/i.test(response.headers.get('cache-control') || ''));
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          (cacheable(hit) ? hit : undefined) ||
          fetch(request).then(async (res) => {
            if (cacheable(res)) {
              const copy = res.clone();
              await caches.open(VERSION).then((c) => c.put(request, copy)).catch(() => undefined);
            }
            return res;
          })
      )
    );
  }
});
