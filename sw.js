// Service worker IT Spedimar — v7.1
// App (HTML) e KB cifrata: prima la rete, così prendi sempre l'ultima versione; cache solo se sei offline.
// Caratteri, icona, lettore PDF: dalla cache (non cambiano).
// Chiamate a Gemini: mai in cache.
const CACHE = 'spedimar-kb-v7.1';
const CORE = ['./', 'index.html', 'icon.svg', 'fonts/archivo.woff2', 'fonts/jbmono-400.woff2', 'fonts/jbmono-600.woff2'];
const OPTIONAL = ['kb.enc.json'];   // se manca non blocca l'installazione

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).then(() => Promise.all(OPTIONAL.map(u => c.add(u).catch(() => {}))))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;          // Gemini e qualsiasi altro sito: mai in cache
  const fresh = req.mode === 'navigate' || /\/(index\.html|kb\.enc\.json)?$/.test(url.pathname);
  const put = r => { if (r && r.ok) { const cl = r.clone(); caches.open(CACHE).then(c => c.put(req, cl)); } return r; };
  if (fresh) {
    e.respondWith(fetch(req).then(put).catch(() => caches.match(req, {ignoreSearch: true}).then(c => c || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
  } else {
    e.respondWith(caches.match(req).then(c => c || fetch(req).then(put)));
  }
});
