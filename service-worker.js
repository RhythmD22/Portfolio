const CACHE_NAME = 'portfolio-v2.0';
const urlsToCache = [
  '/Portfolio/',
  '/Portfolio/manifest.json',
  '/Portfolio/index.html',
  '/Portfolio/Financier.html',
  '/Portfolio/SmartShuttle.html',
  '/Portfolio/Clash%20Royale%20Redesign.html',
  '/Portfolio/header.html',
  '/Portfolio/footer.html',
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
  '/Portfolio/images/Apps/The%20Guardian\'s%20Legacy%20App.png',
  '/Portfolio/images/Apps/right_arrow.svg',
  '/Portfolio/images/Clash%20Royale/Clash%20Royale.png',
  '/Portfolio/images/Financier/Financier.png',
  '/Portfolio/images/SmartShuttle/SmartShuttle.png',
  '/Portfolio/Twine/Archibald%20and%20the%20Steel%20Monolith.html',
  '/Portfolio/Twine/The%20Guardian\'s%20Legacy.html',
  '/Portfolio/Pokemon%20GB.ttf',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        urlsToCache.map(url =>
          fetch(url, { credentials: 'same-origin' }).then(response => {
            if (response.ok) return cache.put(url, response);
          })
        )
      );
    })
  );
});

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) return;

  if (event.request.url.match(/\.(mp4|mov|webm|ogg|mp3|wav|flac|aac|gif)$/i) || event.request.headers.get('range')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/Portfolio/index.html');
        }
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      );
    })
  );
});