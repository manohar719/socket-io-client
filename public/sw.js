let cacheData = "appV1";
this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheData).then((cache) => {
            cache.addAll([
                '/static/js/bundle.js',
                '/static/js/0.chunk.js',
                '/static/js/main.chunk.js',
                '/index.html',
                '/main.efcd1670cfaf51523469.hot-update.js',
                '/'
            ])
        })
    )
})
self.addEventListener('fetch', function (event) {
    if (!navigator.onLine) {
        event.waitUntil(
            self.registration.showNotification(
                'Network', {
                body: 'Internet not working'
            }));
        event.respondWith(
            caches.match(event.request).then((resp) => {
                if (resp) {
                    return resp
                }
                let requestUrl = event.request.clone();
                fetch(requestUrl);
            })
        )
    }
});

self.addEventListener('push', function (event) {
    event.waitUntil(self.registration.showNotification('Push Api', {
        body: 'notification is send'
    }));
});

