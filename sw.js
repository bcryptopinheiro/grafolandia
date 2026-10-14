/* Service worker da Grafolândia: guarda o jogo no telemóvel para funcionar sem internet.
   PARA PUBLICAR UMA ATUALIZAÇÃO: muda o número da versão abaixo (v1 → v2 → v3...). */
const VERSION = 'v4';
const CACHE = `grafolandia-${VERSION}`;
const FONTS = 'grafolandia-fonts'; // fontes do Google (guardadas à parte, não mudam)

// Ficheiros do próprio jogo, guardados logo na instalação
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

// Apaga as caches de versões antigas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== FONTS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: usa a cópia guardada; se não houver e estiver offline,
  // o navegador usa as fontes de recurso (Trebuchet MS / system-ui).
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(FONTS).then((c) =>
        c.match(req).then((hit) => {
          const net = fetch(req)
            .then((res) => { if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; })
            .catch(() => hit || Response.error());
          return hit || net;
        })
      )
    );
    return;
  }

  if (url.origin !== location.origin) return;

  // Página principal: tenta a internet primeiro (para apanhar atualizações),
  // e se falhar usa a cópia guardada.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html', { ignoreSearch: true }))
    );
    return;
  }

  // Restantes ficheiros (ícones, manifest): cache primeiro, internet se faltar
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)));
});
