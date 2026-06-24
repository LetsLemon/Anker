/* Anker · Service Worker – macht die App offline-fähig.
   Cache-Version bei Änderungen hochzählen (v1 -> v2 ...), damit Updates greifen. */
const CACHE = "anker-v1";
const ASSETS = [
  "index.html",
  "styles.css",
  "app.js",
  "data/lessons.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=> c.addAll(ASSETS)).then(()=> self.skipWaiting()));
});

self.addEventListener("activate", (e)=>{
  e.waitUntil(
    caches.keys().then(keys=> Promise.all(keys.filter(k=> k!==CACHE).map(k=> caches.delete(k))))
      .then(()=> self.clients.claim())
  );
});

self.addEventListener("fetch", (e)=>{
  const req = e.request;
  if(req.method !== "GET") return;
  // Navigationsanfragen: zur App-Hülle zurückfallen (Offline-Start)
  if(req.mode === "navigate"){
    e.respondWith(
      fetch(req).catch(()=> caches.match("index.html"))
    );
    return;
  }
  // Sonst: erst Cache, dann Netz (und nachladen)
  e.respondWith(
    caches.match(req).then(hit=>{
      if(hit) return hit;
      return fetch(req).then(res=>{
        const copy = res.clone();
        caches.open(CACHE).then(c=> c.put(req, copy)).catch(()=>{});
        return res;
      }).catch(()=> hit);
    })
  );
});
