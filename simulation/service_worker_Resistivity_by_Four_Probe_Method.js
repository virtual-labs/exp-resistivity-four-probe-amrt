var dataCacheName ='Vlab_Resistivity_by_Four_Probe_Method';
var cacheName = 'Cache_Resistivity_by_Four_Probe_Method';
var filesToCache = [
  './',	
	'index.html',
	'manifest.json',
	'css/experiment.css',
	'images/background.svg',
	'images/big_switch_off.svg',
	'images/big_switch_on.svg',
	'images/constant_Current_Source.svg',
	'images/cross_section.svg',
	'images/cylinder_top.svg',
	'images/digital_Micro_Voltmeter.svg',
	'images/digital_microvoltmeter_top.svg',
	'images/digital_microvoltmeter_turner.svg',
	'images/pid_controlled_Oven.svg',
	'images/small_switch_off.svg',
	'images/small_switch_on.svg',
	'images/top_object.svg',
	'images/wires.svg'
	
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
}); 

// ServiceWorker Active
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        // if (key !== cacheName && key !== dataCacheName) {
        //   console.log('[ServiceWorker] Removing old cache', key);
        //   return caches.delete(key);
        // }
      }));
    })
  );
  return self.clients.claim();
});


// The page has made a request
self.addEventListener("fetch", function (event) {
  var requestURL = new URL(event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {

        // we have a copy of the response in our cache, so return it
        if (response) {
          return response;  //no network request necessary
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(  //
          function (response) {

  var shouldCache = false;

  if (response.type === "basic" && response.status === 200) {
    shouldCache = cacheName;
  } else if (response.type === "opaque") {
    // if response isn't from our origin / doesn't support CORS

    if (requestURL.hostname.indexOf(".wikipedia.org") > -1) {
      shouldCache = cacheNameWikipedia;
    } else if (requestURL.hostname.indexOf(".typekit.net") > -1) {
      shouldCache = cacheNameTypekit;
    } else {
      // just let response pass through, don't cache
    }

  }

  if (shouldCache) {
    var responseToCache = response.clone();

    caches.open(shouldCache)
      .then(function (cache) {
        var cacheRequest = event.request.clone();
        cache.put(cacheRequest, responseToCache);
      });
  }

  return response;
}
        );

      })
  );
});