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
  '/Portfolio/images/Clash%20Royale/Banner%203.png',
  '/Portfolio/images/Clash%20Royale/Blue%20Crown%20Animated.gif',
  '/Portfolio/images/Clash%20Royale/Clash%20Royale%20Comparisons%20cont..png',
  '/Portfolio/images/Clash%20Royale/Clash%20Royale%20Comparisons.png',
  '/Portfolio/images/Clash%20Royale/Clash%20Royale%20Redesign.png',
  '/Portfolio/images/Clash%20Royale/Clash%20Royale%20Screens%20Diagram.png',
  '/Portfolio/images/Clash%20Royale/Clash%20Royale%20User%20Flows.png',
  '/Portfolio/images/Clash%20Royale/Criticisms.png',
  '/Portfolio/images/Clash%20Royale/Red%20Crown%20Animated.gif',
  '/Portfolio/images/Clash%20Royale/Clash%20Royale.mp4',
  '/Portfolio/images/Clash%20Royale/Clash%20Royale.png',
  '/Portfolio/images/Clash%20Royale/Chests/1%20-%20Wooden%20Chest.png',
  '/Portfolio/images/Clash%20Royale/Chests/2%20-%20Silver%20Chest.png',
  '/Portfolio/images/Clash%20Royale/Chests/3%20-%20Golden%20Chest.png',
  '/Portfolio/images/Clash%20Royale/Chests/3.1%20-%20Gold%20Crate.png',
  '/Portfolio/images/Clash%20Royale/Chests/3.2%20-%20Overflowing%20Gold%20Crate.png',
  '/Portfolio/images/Clash%20Royale/Chests/3.3%20-%20Plentiful%20Gold%20Crate.png',
  '/Portfolio/images/Clash%20Royale/Chests/4%20-%20Magical%20Chest.png',
  '/Portfolio/images/Clash%20Royale/Chests/5%20-%20Giant%20Chest.png',
  '/Portfolio/images/Clash%20Royale/Chests/6%20-%20Legendary%20Chest.png',
  '/Portfolio/images/Clash%20Royale/Chests/7%20-%20Champion%20Chest.png',
  '/Portfolio/images/Clash%20Royale/Chests/8%20-%20Lightning%20Chest.png',
  '/Portfolio/images/Clash%20Royale/Chests/9%20-%20Mega%20Lightning%20Chest.png',
  '/Portfolio/images/Clash%20Royale/Chests/10%20-%20Fortune%20Chest.png',
  '/Portfolio/images/Clash%20Royale/Chests/11%20-%20Legendary%20King%20Chest.png',
  '/Portfolio/images/Clash%20Royale/Chests/12%20-%20Level%20Up%20Chest.jpg',
  '/Portfolio/images/Financier/Financier.mp4',
  '/Portfolio/images/Financier/Financier.png',
  '/Portfolio/images/Financier/Analytics.mov',
  '/Portfolio/images/Financier/Banner%201.png',
  '/Portfolio/images/Financier/Financier%20Mockup.png',
  '/Portfolio/images/Financier/Financier%20Site.png',
  '/Portfolio/images/Financier/Goals.mov',
  '/Portfolio/images/Financier/iGrad%20Logo.png',
  '/Portfolio/images/Financier/iGrad.png',
  '/Portfolio/images/Financier/MoneyHelper%20Logo.png',
  '/Portfolio/images/Financier/MoneyHelper.png',
  '/Portfolio/images/Financier/Outline%201.png',
  '/Portfolio/images/Financier/Outline%202.png',
  '/Portfolio/images/Financier/Outline%203.png',
  '/Portfolio/images/Financier/Transactions.mov',
  '/Portfolio/images/Financier/Voya%20Logo.png',
  '/Portfolio/images/Financier/Voya.png',
  '/Portfolio/images/SmartShuttle/SmartShuttle.svg',
  '/Portfolio/images/SmartShuttle/Banner%202.png',
  '/Portfolio/images/SmartShuttle/Phase%201.png',
  '/Portfolio/images/SmartShuttle/Phase%201-2.png',
  '/Portfolio/images/SmartShuttle/Phase%202.png',
  '/Portfolio/images/SmartShuttle/Phase%202-2.png',
  '/Portfolio/images/SmartShuttle/Phase%203.png',
  '/Portfolio/images/SmartShuttle/Phase%203-2.png',
  '/Portfolio/images/SmartShuttle/SmartShuttle%20Homescreen.mp4',
  '/Portfolio/images/SmartShuttle/SmartShuttle%20Poster.png',
  '/Portfolio/images/SmartShuttle/undraw_create.png',
  '/Portfolio/images/SmartShuttle/undraw_interview.png',
  '/Portfolio/images/SmartShuttle/undraw_sorting-thoughts.png',
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
