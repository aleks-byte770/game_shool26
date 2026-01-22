const CACHE_NAME = 'finans-game-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/styles/main.css',
  '/src/app.js',
  '/src/game/game.js',
  '/src/game/levels.js',
  '/manifest.json'
];

// Установка Service Worker и кэширование файлов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Кэш создан');
      return cache.addAll(urlsToCache).catch(err => {
        console.log('⚠️ Некоторые файлы не закэшированы:', err);
      });
    })
  );
  self.skipWaiting();
});

// Активация и удаление старых кэшей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Удален старый кэш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Стратегия: Cache First (с network fallback)
self.addEventListener('fetch', (event) => {
  // Пропускаем non-GET запросы
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // Не кэшируем если ошибка
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Кэшируем успешные запросы
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Offline fallback
        return new Response('Офлайн режим. Проверьте интернет соединение.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain; charset=UTF-8'
          })
        });
      });
    })
  );
});
