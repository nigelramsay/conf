
var APP_PREFIX = 'kiwi-ruby_';   // Identifier for this app (this needs to be consistent across every cache update)
var FINGERPRINT = '74babd330491669ae6ae3dbfe64513e899960ce71604c7cf72f84d60f4fb3173e64bb7cd'; // Generated hash for the URL list
var CACHE_NAME = APP_PREFIX + FINGERPRINT;
var URLS = [                            // Add URL you want to cache in this list.
  '/workshops/',
  '/images/workshop-avatars/eiara-a2ed389b.png',
  '/images/workshop-avatars/jon-b4feb89a.jpeg',
  '/images/workshop-avatars/mai-716da365.jpeg',
  '/images/workshop-avatars/sarrah-1a7ea1b4.jpeg',
  '/images/workshop-avatars/tim-6ade37bb.jpeg',
  '/',
  '/location/',
  '/manifest.json',
  '/scholarships/',
  '/speakers/',
  '/sponsors/',
  '/talks/',
  '/assets/public/fonts/fontawesome-webfont-d980c2ce.eot',
  '/assets/public/fonts/fontawesome-webfont-13b1eab6.ttf',
  '/assets/public/fonts/fontawesome-webfont-28b78224.woff',
  '/assets/public/fonts/fontawesome-webfont-d6f48cba.woff2',
  '/assets/public/fonts/OleoScriptSwashCaps-Regular-d134947d.woff2',
  '/assets/public/fonts/YoungSerif-Regular-a14de476.woff2',
  '/about/',
  '/browserconfig.xml',
  '/childcare/',
  '/events/',
  '/images/speaker-avatars/amanda-3354d176.jpeg',
  '/images/speaker-avatars/caitlin-47f8c723.jpeg',
  '/images/speaker-avatars/daniel-67c45806.jpeg',
  '/images/speaker-avatars/eleanor-71f1558f.jpeg',
  '/images/speaker-avatars/eoin-6bdb5e00.jpeg',
  '/images/speaker-avatars/graham-19cef6a6.jpeg',
  '/images/speaker-avatars/jeremy-fecfb4ce.jpeg',
  '/images/speaker-avatars/jojo-d617ac27.jpeg',
  '/images/speaker-avatars/lena-932a1a92.jpeg',
  '/images/speaker-avatars/mark-fd921aba.jpeg',
  '/images/sponsor-logos/addressfinder-0a6a7a11.png',
  '/images/sponsor-logos/eiara-3e182088.png',
  '/images/sponsor-logos/flux-1d7b332d.png',
  '/images/sponsor-logos/icelab-b583e975.png',
  '/images/sponsor-logos/sponsor_addressfinder_500-c0210c8d.png',
  '/images/sponsor-logos/sponsor_boost_tall_500-bef6bb78.png',
  '/images/sponsor-logos/sponsor_loyalty_770-eb0352be.png',
  '/images/sponsor-logos/sponsor_optimal_workshop_500-a8c509d6.png',
  '/images/sponsor-logos/sponsor_rabid_500-ffc6ed3a.png',
  '/images/sponsor-logos/sponsor_storypark_500-dac96544.png',
  '/images/sponsor-logos/sponsor_the-last-pickle_500-e0bab128.png',
  '/images/sponsor-logos/sponsor_trineo_770-6c504936.png',
  '/images/sponsor-logos/sponsor_youdo_500-6b542b92.png',
  '/images/sponsor-logos/travis-ci-09a2c199.png',
  '/images/workshop-avatars/andrew-6008414b.jpeg',
  '/images/workshop-avatars/aurynn-7257593c.jpeg',
  '/images/kiwiruby-6b01da09.svg',
  '/images/gembirb-up-5f6627a3.svg',
  '/assets/public/images/bg_menu-f8462848.svg',
  '/assets/public/images/logotype-horizontal-1f366411.svg',
  '/assets/public/fonts/fontawesome-webfont-98a8aa5c.svg',
  '/assets/public-b525d774.css',
  '/assets/public-ffdf47d5.js'
];

// Respond with cached resources
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(e.request).then(function(response) {
        if (response) { // if cache is available, respond with cache
          return response;
        }
        // if there are no cache, try fetching request
        return fetch(e.request.clone()).then(function(response) {
          var matchesDomain = e.request.url.indexOf('https://kiwi.ruby.nz') > -1;
          if (response.status < 400 && matchesDomain) {
            cache.put(e.request, response.clone());
          }
          return response;
        });
      });
    })
  );
});

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      
      return cache.addAll(URLS);
    })
    .then(function() {
      // `skipWaiting()` forces the waiting ServiceWorker to become the
      // active ServiceWorker, triggering the `onactivate` event.
      // Together with `Clients.claim()` this allows a worker to take effect
      // immediately in the client(s).
      return self.skipWaiting();
    })
  );
});

// Delete outdated caches
self.addEventListener('activate', function (e) {
  
  e.waitUntil(
    caches
      /* This method returns a promise which will resolve to an array of available
         cache keys.
      */
      .keys()
      .then(function (keyList) {
        
        // We return a promise that settles when all outdated caches are deleted.
        return Promise.all(
          keyList
            .filter(function (key) {
              // Filter by keys that don't start with the latest version prefix.
              return !key.startsWith(CACHE_NAME);
            })
            .map(function (key) {
              /* Return a promise that's fulfilled
                 when each outdated cache is deleted.
              */
              return caches.delete(key);
            })
        );
      })
      .then(function(){
        
        return self.clients.claim();
      })
      
  );
});
