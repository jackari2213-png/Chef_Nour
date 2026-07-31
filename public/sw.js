/* Chef Nour — Service Worker v1 */
const CACHE_NAME = 'chef-nour-v1';
const OFFLINE_URL = '/offline';
const PRECACHE_URLS = ['/', '/offline'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

function cacheFirst(cache, request) {
    return caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
            if (response && response.status === 200 && response.type === 'basic') {
                const copy = response.clone();
                cache.put(request, copy);
            }
            return response;
        });
    });
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    // Hashed build assets: cache-first (immutable by design)
    if (url.pathname.startsWith('/_next/static/')) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => cacheFirst(cache, request))
        );
        return;
    }

    // Static images/icons/fonts: cache-first
    if (/\.(png|jpe?g|gif|svg|webp|ico|woff2?)$/.test(url.pathname)) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => cacheFirst(cache, request))
        );
        return;
    }

    // Page navigations: network-first, fall back to cache, then offline page
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return response;
                })
                .catch(() =>
                    caches.match(request).then((cached) =>
                        cached || caches.match(OFFLINE_URL)
                    )
                )
        );
        return;
    }

    // Everything else same-origin: network-first with cache fallback
    event.respondWith(
        fetch(request).catch(() => caches.match(request))
    );
});
