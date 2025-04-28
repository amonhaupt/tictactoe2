var GHPATH = '/tictactoe2';
var APP_PREFIX = 'app_';
var VERSION = 'v1_';
var URLS = [
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/styles.css`,
  `${GHPATH}/script.js`
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(APP_PREFIX + VERSION).then(cache => cache.addAll(URLS)))
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
