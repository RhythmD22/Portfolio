// Service Worker for Rhythm Desai's Portfolio
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
  '/Portfolio/css/index.css',
  '/Portfolio/css/work.css',
  '/Portfolio/css/about.css',
  '/Portfolio/css/financier.css',
  '/Portfolio/css/smartshuttle.css',
  '/Portfolio/css/clashroyale.css',
  '/Portfolio/css/resume.css',
  '/Portfolio/css/apps.css',
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
  '/Portfolio/images/Profile.lottie',
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
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caches opened');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to cache assets', err);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Otherwise, fetch from network
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response to store in cache
            const responseToCache = response.clone();

            return caches.open(CACHE_NAME)
              .then(cache => {
                return cache.put(event.request, responseToCache);
              })
              .then(() => response);
          }
        ).catch(() => {
          // Serve cached index.html for navigation requests when offline
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
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
