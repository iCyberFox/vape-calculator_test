<<<<<<< HEAD
const CACHE_NAME = 'flavor-calculator-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json',
  '/favicon.svg',
  '/service-worker.js',
  '/Flavor Calculator/FlavorCalculator.html',
  '/Flavor Calculator/FlavorCalculator.css',
  '/Flavor Calculator/FlavorCalculator.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return networkResponse;
        })
        .catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
=======
const CACHE_NAME = 'flavor-calculator-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './favicon.svg',
  './service-worker.js',
  './Flavor Calculator/FlavorCalculator.html',
  './Flavor Calculator/FlavorCalculator.css',
  './Flavor Calculator/FlavorCalculator.js',
  './Coil Calculator/CoilCalculator.html',
  './Coil Calculator/CoilCalculator.css',
  './Coil Calculator/CoilCalculator.js',
  './Flavor Boost Calculator/FlavorBoostCalculator.html',
  './Flavor Boost Calculator/FlavorBoostCalculator.css',
  './Flavor Boost Calculator/FlavorBoostCalculator.js',
  './Flavor Shot Calculator/FlavorShotCalculator.html',
  './Flavor Shot Calculator/FlavorShotCalculator.css',
  './Flavor Shot Calculator/FlavorShotCalculator.js',
  './General Flavor Shot Calculator/GeneralFlavorShotCalculator.html',
  './General Flavor Shot Calculator/GeneralFlavorShotCalculator.css',
  './General Flavor Shot Calculator/GeneralFlavorShotCalculator.js',
  './Vape Calculator Slider/VapeCalculatorSlider.html',
  './Vape Calculator Slider/VapeCalculatorSlider.css',
  './Vape Calculator Slider/VapeCalculatorSlider.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return networkResponse;
        })
        .catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
>>>>>>> 8193261 (Оновив FlavorCalculator: додав PWA та модальне вікно)
