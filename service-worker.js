// Service Worker for Rhythm Desai's Portfolio
const CACHE_NAME = 'portfolio-v1.0';
const urlsToCache = [
  '/Portfolio/',
  '/Portfolio/manifest.json',
  '/Portfolio/index.html',
  '/Portfolio/Financier.html',
  '/Portfolio/SmartShuttle.html',
  '/Portfolio/Twine.html',
  '/Portfolio/Clash%20Royale%20Wireframe.html',
  '/Portfolio/About.html',
  '/Portfolio/header.html',
  '/Portfolio/footer.html',
  '/Portfolio/css/styles.css',
  '/Portfolio/css/index.css',
  '/Portfolio/css/work.css',
  '/Portfolio/css/about.css',
  '/Portfolio/css/financier.css',
  '/Portfolio/css/smartshuttle.css',
  '/Portfolio/css/smartshuttle-charts.css',
  '/Portfolio/css/clashroyale.css',
  '/Portfolio/css/twine.css',
  '/Portfolio/js/index.js',
  '/Portfolio/js/work.js',
  '/Portfolio/js/financier.js',
  '/Portfolio/js/smartshuttle.js',
  '/Portfolio/js/smartshuttle-charts.js',
  '/Portfolio/js/clashroyale.js',
  '/Portfolio/js/dark-mode.js',
  '/Portfolio/js/templates.js',
  '/Portfolio/js/navigation.js',
  '/Portfolio/js/scroll.js',
  '/Portfolio/js/service-worker-register.js',
  '/Portfolio/favicon.ico',
  '/Portfolio/portfolio-light.png',
  '/Portfolio/portfolio-dark.png',
  '/Portfolio/apple-touch-icon.png',
  '/Portfolio/dark-apple-touch-icon.png',
  '/Portfolio/android-chrome-192x192.png',
  '/Portfolio/dark-android-chrome-192x192.png',
  '/Portfolio/android-chrome-512x512.png',
  '/Portfolio/dark-android-chrome-512x512.png',
  '/Portfolio/images/Archibald%20and%20the%20Steel%20Monolith.png',
  '/Portfolio/images/Blue%20Crown%20Animated.gif',
  '/Portfolio/images/BoP%201.png',
  '/Portfolio/images/BoP%202.png',
  '/Portfolio/images/BoP%203.png',
  '/Portfolio/images/BoP%204.png',
  '/Portfolio/images/Clash%20Royale%20Comparisons%20cont..png',
  '/Portfolio/images/Clash%20Royale%20Comparisons.png',
  '/Portfolio/images/Clash%20Royale%20Redesign.png',
  '/Portfolio/images/Clash%20Royale%20Screens%20Diagram.png',
  '/Portfolio/images/Clash%20Royale%20User%20Flows.png',
  '/Portfolio/images/Clash%20Royale.png',
  '/Portfolio/images/Criticisms.png',
  '/Portfolio/images/FC%201.png',
  '/Portfolio/images/FC%202.png',
  '/Portfolio/images/FC%203.png',
  '/Portfolio/images/FC%204.png',
  '/Portfolio/images/Financier%20Homepage.png',
  '/Portfolio/images/Financier%20Mockup.png',
  '/Portfolio/images/Financier%20Site.png',
  '/Portfolio/images/iGrad.png',
  '/Portfolio/images/Me.png',
  '/Portfolio/images/Outline%201.png',
  '/Portfolio/images/Outline%202.png',
  '/Portfolio/images/Outline%203.png',
  '/Portfolio/images/Profile.lottie',
  '/Portfolio/images/Phase%201.png',
  '/Portfolio/images/Phase%201-2.png',
  '/Portfolio/images/Phase%202.png',
  '/Portfolio/images/Phase%202-2.png',
  '/Portfolio/images/Phase%203.png',
  '/Portfolio/images/Phase%203-2.png',
  '/Portfolio/images/Red%20Crown%20Animated.gif',
  '/Portfolio/images/SmartShuttle%20Preview%201.png',
  '/Portfolio/images/SmartShuttle%20Preview%202.png',
  '/Portfolio/images/The%20Guardian\'s%20Legacy.png',
  '/Portfolio/images/Twine.png',
  '/Portfolio/images/Chests/1%20-%20Wooden%20Chest.png',
  '/Portfolio/images/Chests/2%20-%20Silver%20Chest.png',
  '/Portfolio/images/Chests/3%20-%20Golden%20Chest.png',
  '/Portfolio/images/Chests/3.1%20-%20Gold%20Crate.png',
  '/Portfolio/images/Chests/3.2%20-%20Overflowing%20Gold%20Crate.png',
  '/Portfolio/images/Chests/3.3 %20-%20Plentiful%20Gold%20Crate.png',
  '/Portfolio/images/Chests/4%20-%20Magical%20Chest.png',
  '/Portfolio/images/Chests/5%20-%20Giant%20Chest.png',
  '/Portfolio/images/Chests/6%20-%20Legendary%20Chest.png',
  '/Portfolio/images/Chests/7%20-%20Champion%20Chest.png',
  '/Portfolio/images/Chests/8%20-%20Lightning%20Chest.png',
  '/Portfolio/images/Chests/9%20-%20Mega%20Lightning%20Chest.png',
  '/Portfolio/images/Chests/10%20-%20Fortune%20Chest.png',
  '/Portfolio/images/Chests/11%20-%20Legendary%20King%20Chest.png',
  '/Portfolio/images/Chests/12%20-%20Level%20Up%20Chest.jpg',
  '/Portfolio/images/SmartShuttle%20Homescreen.mp4',
  '/Portfolio/Twine/Archibald%20and%20the%20Steel%20Monolith.html',
  '/Portfolio/Twine/The%20Guardian\'s%20Legacy.html',
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