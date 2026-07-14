const V='hsp-test-v3',U=['./', './index.html','./css/style.css','./js/app.js','./js/data.js','./manifest.json','./icon-192.svg','./icon-512.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(U)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(cache=>cache.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});
