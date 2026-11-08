const CACHE_NAME = 'mathe-trainer-v1';
const assetsToCache = [
  './index.html',
  './manifest.json'
];

// Installation & Caching
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(assetsToCache))
      .then(() => self.skipWaiting())
  );
});

// Aktivierung
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch-Anfragen abfangen (Offline-Support)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});