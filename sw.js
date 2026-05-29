// =========================
// IBADAH SMART CACHE SERVICE WORKER (TEST APP)
// File: test-ibadah-tracker/sw.js
//
// Purpose:
// Online  = load fresh files from GitHub first, then save them into cache.
// Offline = load the last saved cached files.
// Safe: keeps Quran offline download cache and localStorage safe.
// =========================

const IBADAH_APP_CACHE = "ibadah-test-smart-app-v1";
const IBADAH_RUNTIME_CACHE = "ibadah-runtime-v1";

/*
  IMPORTANT:
  Keep Quran downloaded pages safe.
  Do NOT delete IBADAH_RUNTIME_CACHE in activate.
*/

const IBADAH_APP_SHELL_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.png",

  "./home/",
  "./home/index.html",

  "./salah/",
  "./salah/index.html",

  "./tracker/",
  "./tracker/index.html",

  "./more/",
  "./more/index.html",

  "./quran/",
  "./quran/index.html",

  "./appsettings/",
  "./appsettings/index.html",

  "./offline-manager/",
  "./offline-manager/index.html",

  "./shared/bottom-nav.js",
  "./shared/menu-handle.js",
  "./shared/cloud-sync.js"
];

// =========================
// INSTALL
// Full listener name: install
// =========================
self.addEventListener("install", function(event){

  self.skipWaiting();

  event.waitUntil(
    caches.open(IBADAH_APP_CACHE).then(function(cache){

      return Promise.all(
        IBADAH_APP_SHELL_FILES.map(function(file){

          return cache.add(file).catch(function(error){
            /*
              Some files may not exist yet while testing.
              Do not fail the whole service worker.
            */
            console.log("Precache skipped:", file, error);
          });

        })
      );

    })
  );

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
            Delete old test app caches only.
            Keep Quran runtime/offline downloads safe.
          */
          if(
            key.startsWith("ibadah-test") &&
            key !== IBADAH_APP_CACHE
          ){
            return caches.delete(key);
          }

          return Promise.resolve();

        })
      );

    }).then(function(){

      return self.clients.claim();

    })
  );

});

// =========================
// CHECK IF REQUEST SHOULD BE HANDLED
// Full function name: shouldHandleIbadahRequest(request)
// =========================
function shouldHandleIbadahRequest(request){

  if(request.method !== "GET"){
    return false;
  }

  let url = new URL(request.url);

  /*
    Only handle same-origin app files.
    External files like Firebase, Google Fonts, CDN should load normally.
  */
  if(url.origin !== self.location.origin){
    return false;
  }

  /*
    Do not cache browser extension or special requests.
  */
  if(url.protocol !== "http:" && url.protocol !== "https:"){
    return false;
  }

  return true;

}

// =========================
// CHECK IF REQUEST IS QURAN/OFFLINE ASSET
// Full function name: isQuranRuntimeAsset(url)
// =========================
function isQuranRuntimeAsset(url){

  let path = url.pathname.toLowerCase();

  return (
    path.includes("/quranpages/") ||
    path.includes("/16linequranpages/") ||
    path.includes("/9linequran/") ||
    path.includes("/arabic-quran/") ||
    path.endsWith(".png") ||
    path.endsWith(".jpg") ||
    path.endsWith(".jpeg") ||
    path.endsWith(".webp") ||
    path.endsWith(".pdf") ||
    path.endsWith(".mp3")
  );

}

// =========================
// NETWORK FIRST THEN CACHE
// Full function name: networkFirstThenCache(request)
// =========================
async function networkFirstThenCache(request){

  let url = new URL(request.url);
  let cacheName = isQuranRuntimeAsset(url) ? IBADAH_RUNTIME_CACHE : IBADAH_APP_CACHE;

  try{

    /*
      Online:
      Always try fresh network first.
      This helps while testing changes.
    */
    let freshResponse = await fetch(request, {
      cache:"no-store"
    });

    /*
      Save good responses into cache for offline.
    */
    if(freshResponse && freshResponse.ok){
      let cache = await caches.open(cacheName);
      await cache.put(request, freshResponse.clone());
    }

    return freshResponse;

  }catch(error){

    /*
      Offline:
      Try exact cache match first.
    */
    let cachedResponse = await caches.match(request);

    if(cachedResponse){
      return cachedResponse;
    }

    /*
      Offline:
      Try same URL but ignore query string.
      This helps with ?v=Date.now() cache-buster links.
    */
    cachedResponse = await caches.match(request, {
      ignoreSearch:true
    });

    if(cachedResponse){
      return cachedResponse;
    }

    /*
      Offline folder fallback:
      If user opens /salah/, try /salah/index.html.
    */
    if(url.pathname.endsWith("/")){
      let indexUrl = url.href + "index.html";
      cachedResponse = await caches.match(indexUrl, {
        ignoreSearch:true
      });

      if(cachedResponse){
        return cachedResponse;
      }
    }

    /*
      Offline navigation fallback:
      If a page route is not cached, try main index.
    */
    if(request.mode === "navigate"){
      cachedResponse =
        await caches.match("./index.html", {ignoreSearch:true}) ||
        await caches.match("./", {ignoreSearch:true});

      if(cachedResponse){
        return cachedResponse;
      }
    }

    return new Response("Offline and no cached file available.", {
      status:503,
      headers:{
        "Content-Type":"text/plain"
      }
    });

  }

}

// =========================
// FETCH
// Full listener name: fetch
// =========================
self.addEventListener("fetch", function(event){

  const request = event.request;

  if(!shouldHandleIbadahRequest(request)){
    return;
  }

  event.respondWith(
    networkFirstThenCache(request)
  );

});

// =========================
// MESSAGE FROM APP
// Full listener name: message
//
// Supported actions:
// - REFRESH_APP_CACHE
// - CLEAR_APP_CACHE_KEEP_QURAN
// =========================
self.addEventListener("message", function(event){

  let data = event.data || {};

  if(data.action === "REFRESH_APP_CACHE" || data.action === "CLEAR_APP_CACHE_KEEP_QURAN"){

    event.waitUntil(
      caches.keys().then(function(keys){

        return Promise.all(
          keys.map(function(key){

            /*
              Clear only app shell caches.
              Keep Quran runtime cache safe.
            */
            if(
              key.startsWith("ibadah-test") &&
              key !== IBADAH_RUNTIME_CACHE
            ){
              return caches.delete(key);
            }

            return Promise.resolve();

          })
        );

      }).then(function(){

        return caches.open(IBADAH_APP_CACHE).then(function(cache){

          return Promise.all(
            IBADAH_APP_SHELL_FILES.map(function(file){

              return cache.add(file).catch(function(error){
                console.log("Refresh precache skipped:", file, error);
              });

            })
          );

        });

      })
    );

  }

});
