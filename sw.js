const cacheName = 'ttt2-cache-v1.0';
const appShellFiles = [
  './',
  './index.html',
  './style.css',
  './script.js',
];

// Install event: cache app shell
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(appShellFiles);
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch event: serve cached content when offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      if (response) {
        return response; // Serve from cache
      }
      // Fetch from network and cache it
      return fetch(e.request).then((res) => {
        return caches.open(cacheName).then((cache) => {
          cache.put(e.request, res.clone());
          return res;
        });
      });
    }).catch(() => {
      // Optionally, return a fallback file (like offline.html) here
    })
  );
});
