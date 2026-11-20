const VERSION = 'busog-v1';
const SHELL = '/busog/app/';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(VERSION);
      await cache.add(SHELL);
      const response = await fetch('/busog/offline-assets.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Offline asset list is unavailable.');
      const assets = await response.json();
      await cache.addAll(
        assets.filter((url) => url.startsWith('/busog/images/') || /\/busog\/_astro\/[^/]+\.[\w-]{8,}\./.test(url)),
      );
    })(),
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      await Promise.all(
        keys.filter((key) => key.startsWith('busog-') && key !== VERSION).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    }),
  );
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(VERSION);
            await cache.put(request, response.clone());
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match(SHELL)) || Response.error()),
    );
  } else if (url.pathname.startsWith('/busog/images/')) {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) (await caches.open(VERSION)).put(request, response.clone());
          return response;
        })
        .catch(async () => (await caches.match(request)) || Response.error()),
    );
  } else if (/\/busog\/_astro\/[^/]+\.[\w-]{8,}\./.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then(async (response) => {
            if (response.ok) (await caches.open(VERSION)).put(request, response.clone());
            return response;
          }),
      ),
    );
  }
});
