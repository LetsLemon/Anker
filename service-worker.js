/* Anker · Service Worker.
   Strategie: NETWORK-FIRST – wenn online, immer die neueste Version laden;
   nur wenn offline, aus dem Cache. So zeigt die App nach einem Upload sofort
   die aktuelle Fassung und bleibt trotzdem offline nutzbar.
   Cache-Version bei Änderungen hochzählen (v3 -> v4 ...). */
const CACHE = "anker-v8";
const ASSETS = [
  "index.html",
  "styles.css",
  "app.js",
  "data/predictor.js",
  "data/praxis.js",
  "data/lessons.js",
  "data/alltag.js",
  "data/verstehen.js",
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
  let url;
  try { url = new URL(req.url); } catch(_) { return; }
  if(url.origin !== self.location.origin) return; // nur eigene Dateien behandeln

  // Network-first: frische Version holen, im Cache aktualisieren;
  // bei Fehler (offline) aus dem Cache, sonst zurück zur App-Hülle.
  e.respondWith(
    fetch(req).then(res=>{
      const copy = res.clone();
      caches.open(CACHE).then(c=> c.put(req, copy)).catch(()=>{});
      return res;
    }).catch(()=> caches.match(req).then(hit=> hit || caches.match("index.html")))
  );
});
