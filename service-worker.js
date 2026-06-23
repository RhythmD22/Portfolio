const CACHE_VERSION = 'v2.1';
const STATIC_CACHE = `portfolio-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `portfolio-images-${CACHE_VERSION}`;
const RUNTIME_CACHE = `portfolio-runtime-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/Portfolio/',
  '/Portfolio/index.html',
  '/Portfolio/header.html',
  '/Portfolio/footer.html',
  '/Portfolio/manifest-light.json',
  '/Portfolio/manifest-dark.json',
  '/Portfolio/css/styles.css',
  '/Portfolio/css/project.css',
  '/Portfolio/css/index.css',
  '/Portfolio/css/work.css',
  '/Portfolio/css/about.css',
  '/Portfolio/css/financier.css',
  '/Portfolio/css/smartshuttle.css',
  '/Portfolio/css/clashroyale.css',
  '/Portfolio/css/resume.css',
  '/Portfolio/css/apps.css',
  '/Portfolio/js/chart-utils.js',
  '/Portfolio/js/apps.js',
  '/Portfolio/js/index.js',
  '/Portfolio/js/financier.js',
  '/Portfolio/js/smartshuttle.js',
  '/Portfolio/js/clashroyale.js',
  '/Portfolio/js/dark-mode.js',
  '/Portfolio/js/templates.js',
  '/Portfolio/js/navigation.js',
  '/Portfolio/js/nav-bubble.js',
  '/Portfolio/js/scroll.js',
  '/Portfolio/js/clock.js',
  '/Portfolio/images/favicon.ico',
  '/Portfolio/images/portfolio-light.png',
  '/Portfolio/images/portfolio-dark.png',
  '/Portfolio/images/apple-touch-icon.png',
  '/Portfolio/images/dark-apple-touch-icon.png',
  '/Portfolio/images/android-chrome-192x192.png',
  '/Portfolio/images/dark-android-chrome-192x192.png',
  '/Portfolio/images/android-chrome-512x512.png',
  '/Portfolio/images/dark-android-chrome-512x512.png',
  '/Portfolio/images/About.png',
  '/Portfolio/images/Apps/AI%20Debate%20Club%20App.png',
  '/Portfolio/images/Apps/Archibald%20and%20the%20Steel%20Monolith%20App.png',
  '/Portfolio/images/Apps/Financier%20App.png',
  '/Portfolio/images/Apps/Magnate%20App.png',
  '/Portfolio/images/Apps/SmartShuttle%20App.png',
  "/Portfolio/images/Apps/The%20Guardian's%20Legacy%20App.png",
  '/Portfolio/images/Apps/right_arrow.svg',
  '/Portfolio/images/Clash%20Royale/Clash%20Royale.png',
  '/Portfolio/images/Financier/Financier.png',
  '/Portfolio/images/SmartShuttle/SmartShuttle.png',
  '/Portfolio/Pokemon%20GB.ttf',
];

self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return Promise.allSettled(
        PRECACHE_URLS.map(url =>
          fetch(url, { credentials: 'same-origin' }).then(response => {
            if (response.ok) return cache.put(url, response);
            console.warn(`SW: failed to cache ${url}`);
          }).catch(() => {
            console.warn(`SW: failed to fetch ${url}`);
          })
        )
      );
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      await clients.claim();

      const validCaches = [STATIC_CACHE, IMAGE_CACHE, RUNTIME_CACHE];
      const keys = await caches.keys();
      await Promise.all(
        keys.map(key => {
          if (!validCaches.includes(key)) return caches.delete(key);
        })
      );
    })()
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (!url.origin.startsWith(self.location.origin)) return;
  if (request.method !== 'GET') return;
  if (request.headers.get('range')) return;

  const path = url.pathname;

  // Network-first for navigations (HTML) — always serve latest
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first with network update for CSS & JS
  if (/\.(css|js)$/i.test(path)) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // Cache-first for images — long-lived
  if (/\.(png|jpg|jpeg|gif|svg|ico|webp|avif)$/i.test(path)) {
    event.respondWith(cacheFirstWithUpdate(request, IMAGE_CACHE));
    return;
  }

  // Runtime cache for everything else (fonts, JSON, etc.)
  event.respondWith(cacheFirstWithUpdate(request, RUNTIME_CACHE));
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    const fallback = await caches.match('/Portfolio/index.html');
    return fallback || new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  });

  return cached || networkPromise;
}

async function cacheFirstWithUpdate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);

  if (cached) {
    // Background update
    networkPromise;
    return cached;
  }

  return networkPromise;
}