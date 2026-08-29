const CACHE_NAME = 'hsp-test-v7';
const STATIC_ASSETS = [
    './',
    './index.html',
    './reset.html',
    './map.html',
    './css/style.css',
    './css/reset.css',
    './css/map.css',
    './js/app.js',
    './js/i18n.js',
    './js/reset.js',
    './js/map.js',
    './js/locales/de.json',
    './js/locales/en.json',
    './js/locales/es.json',
    './js/locales/fr.json',
    './js/locales/hi.json',
    './js/locales/id.json',
    './js/locales/ja.json',
    './js/locales/ko.json',
    './js/locales/pt.json',
    './js/locales/ru.json',
    './js/locales/tr.json',
    './js/locales/zh.json',
    './manifest.json',
    './icon-192.svg',
    './icon-512.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    )));
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    const scopePath = new URL(self.registration.scope).pathname;
    if (request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(scopePath)) return;

    event.respondWith(fetch(request).then((response) => {
        if (response.ok) {
            const copy = response.clone();
            event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)));
        }
        return response;
    }).catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
    }));
});
