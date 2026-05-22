// =========================
// IBADAH NO-CACHE SERVICE WORKER (TEST APP)
// File: test-ibadah-tracker/sw.js
//
// Purpose:
// Stop cache for now while testing cloud sync and folder pages.
// This file deletes old test caches and always loads fresh files.
// =========================

const IBADAH_NO_CACHE_VERSION = "ibadah-test-no-cache-v1";

// =========================
// INSTALL
// Full listener name: install
// =========================
self.addEventListener("install", function(event){

  self.skipWaiting();

});

// =========================
// ACTIVATE
// Full listener name: activate
// =========================
self.addEventListener("activate", function(event){

  event.waitUntil(
    caches.keys().then(function(keys){

      return Promise.all(
        keys.map(function(key){

          /*
            Delete only Ibadah test caches.
            This keeps browser localStorage safe.
          */
          if(key.startsWith("ibadah-test")){
            return caches.delete(key);
          }

        })
      );

    }).then(function(){

      return self.clients.claim();

    })
  );

});

// =========================
// FETCH
// Full listener name: fetch
// =========================
self.addEventListener("fetch", function(event){

  const request = event.request;

  /*
    Do not handle non-GET requests.
  */
  if(request.method !== "GET"){
    return;
  }

  const url = new URL(request.url);

  /*
    Only handle same-origin app files.
    External files like Firebase/CDN should load normally.
  */
  if(url.origin !== self.location.origin){
    return;
  }

  /*
    No-cache rule:
    Always try network first.
    Do not put anything into cache.
  */
  event.respondWith(
    fetch(request, {
      cache:"no-store"
    }).catch(function(){

      /*
        If offline, try browser/cache fallback only.
        This does not create new cache.
      */
      return caches.match(request).then(function(cachedResponse){

        if(cachedResponse){
          return cachedResponse;
        }

        return new Response("Offline and no cached file available.", {
          status:503,
          headers:{
            "Content-Type":"text/plain"
          }
        });

      });

    })
  );

});
