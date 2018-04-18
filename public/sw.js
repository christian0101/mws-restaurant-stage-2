const staticCacheName = 'mws-static-v1';

const allCaches = [
  staticCacheName
];

/**
* Install service worker.
*/
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      cache.addAll([
        './index.html',
        './restaurant.html',
        './css/styles.css',
        './js/main.js',
        './js/restaurant_info.js',
        './js/private.js',
        './js/dbhelper.js',
        './data/restaurants.json',
        './favicon.ico',
        './imgs/1-800_small_1x.jpg',
        './imgs/1-1600_large_2x.jpg',
        './imgs/1.jpg',
        './imgs/2-800_small_1x.jpg',
        './imgs/2-1600_large_2x.jpg',
        './imgs/2.jpg',
        './imgs/3-800_small_1x.jpg',
        './imgs/3-1600_large_2x.jpg',
        './imgs/3.jpg',
        './imgs/4-800_small_1x.jpg',
        './imgs/4-1600_large_2x.jpg',
        './imgs/4.jpg',
        './imgs/5-800_small_1x.jpg',
        './imgs/5-1600_large_2x.jpg',
        './imgs/5.jpg',
        './imgs/6-800_small_1x.jpg',
        './imgs/6-1600_large_2x.jpg',
        './imgs/6.jpg',
        './imgs/7-800_small_1x.jpg',
        './imgs/7-1600_large_2x.jpg',
        './imgs/7.jpg',
        './imgs/8-800_small_1x.jpg',
        './imgs/8-1600_large_2x.jpg',
        './imgs/8.jpg',
        './imgs/9-800_small_1x.jpg',
        './imgs/9-1600_large_2x.jpg',
        './imgs/9.jpg',
        './imgs/10-800_small_1x.jpg',
        './imgs/10-1600_large_2x.jpg',
        './imgs/10.jpg',
        './imgs/logo.svg',
        'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
        'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.css'
      ]);
    })
  );
});

/**
* Clean unwanted cache.
*/
self.addEventListener('activate', function(event) {
event.waitUntil(
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.filter(function(cacheName) {
        return cacheName.startsWith('mws-') &&
               !allCaches.includes(cacheName);
      }).map(function(cacheName) {
        return caches.delete(cacheName);
      })
    );
  })
);
});

/**
 * Intercept requests and respond with cache or make a request to the server.
 */
self.addEventListener('fetch', function(event) {
  /*
    DevTools opening will trigger these o-i-c requests,
    which this SW can't handle.
    https://github.com/paulirish/caltrainschedule.io/pull/51
  */
  if ((event.request.cache === 'only-if-cached')
      && (event.request.mode !== 'same-origin')) {
    return;
  }

  var requestUrl = new URL(event.request.url);
  const index = event.request.url + "index.html";

  if (requestUrl.origin === location.origin) {
   if (requestUrl.pathname === './') {
     event.respondWith(servePage(event.request, index));
     return;
   }
   if (requestUrl.pathname.endsWith("restaurant.html")) {
     event.respondWith(serveRestuarantPage(event.request));
     return;
   }

   // if cache was removed update it
   event.respondWith(servePage(event.request, requestUrl.href));
   return;
}

 event.respondWith(
   caches.match(event.request).then(function(response) {
     return response || fetch(event.request);
   })
 );
});

/**
* Return the retuarant html template, ignoring id
*/
function serveRestuarantPage(request, url) {
  var storageUrl = request.url.replace(/\?id=\d/, '');
  return servePage(request, storageUrl);
}

/**
* Serve a page with custom url that should match an existing cache url, fetch
* from network oherwise.
*/
function servePage(request, customUrl) {
 return caches.open(staticCacheName).then(function(cache) {
   return cache.match(customUrl).then(function(response) {
     var networkFetch = fetch(request).then(function(networkResponse) {
       cache.put(customUrl, networkResponse.clone());
       return networkResponse;
     });
     return response || networkFetch;
   });
 });
}

/**
*  Respond to messages.
*/
self.addEventListener('message', function(event) {
 if (event.data.action === 'skipWaiting') {
   self.skipWaiting();
 }
});
