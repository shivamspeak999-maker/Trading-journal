// TradeJournal Pro — Service Worker
// Cache version — bump this string whenever you update the app
const CACHE_NAME = 'tradejournal-v1';

// Files to cache for offline use
const STATIC_ASSETS = [
  './trading_journal.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@300;400;500&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// ===== INSTALL — cache all static assets =====
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching static assets');
      // Cache local files strictly; external CDN files best-effort
      return cache.addAll(['./trading_journal.html', './manifest.json'])
        .then(() => {
          // Try to cache CDN assets, don't fail if unavailable
          return Promise.allSettled(
            ['https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@300;400;500&display=swap',
             'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js']
            .map(url => cache.add(url).catch(() => console.log('[SW] Could not cache:', url)))
          );
        });
    }).then(() => self.skipWaiting())
  );
});

// ===== ACTIVATE — clean up old caches =====
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => {
              console.log('[SW] Deleting old cache:', key);
              return caches.delete(key);
            })
      )
    ).then(() => self.clients.claim())
  );
});

// ===== FETCH — Cache-first for app shell, Network-first for everything else =====
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Always serve the main HTML from cache when offline
  if (url.pathname.endsWith('trading_journal.html') || url.pathname === '/') {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) {
          // Return cached, then update in background
          fetch(event.request).then(response => {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, response));
            }
          }).catch(() => {});
          return cached;
        }
        return fetch(event.request);
      })
    );
    return;
  }

  // For fonts and CDN scripts — cache first
  if (url.hostname.includes('googleapis.com') ||
      url.hostname.includes('gstatic.com') ||
      url.hostname.includes('cdnjs.cloudflare.com')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => new Response('', { status: 503 }));
      })
    );
    return;
  }

  // Default — network with cache fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// ===== BACKGROUND SYNC (future: sync trades to cloud) =====
self.addEventListener('sync', event => {
  if (event.tag === 'sync-trades') {
    console.log('[SW] Background sync triggered');
    // Placeholder for future cloud sync
  }
});

// ===== PUSH NOTIFICATIONS (future: trade reminders) =====
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(data.title || 'TradeJournal', {
    body: data.body || 'You have a new notification',
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || './trading_journal.html' }
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
