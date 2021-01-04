import { registerRoute } from 'workbox-routing';
import { precacheAndRoute } from 'workbox-precaching';
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst
} from 'workbox-strategies';

import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

self.version = '20201217123456';
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    new Promise(resolve => {
      resolve('service worker success!');
      console.log('service worker success!');
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    self.clients.claim().then(() => {
      console.log('service worker update!');
    })
  );
});

//precache
precacheAndRoute(
  self.__WB_MANIFEST.map(item => {
    item.url = item.url.replace('auto', '');
    return item;
  })
);

// Cache page navigations (html) with a Network First strategy
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'assets',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200]
      })
    ]
  })
);

// Cache images with a Cache First strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200]
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
      })
    ]
  })
);
registerRoute(
  new RegExp(APP_RESOURCE_URL + '/resource/.+'),
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200]
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
      })
    ]
  })
);

//Cache Api
registerRoute(
  VUE_APP_BASE_URL + '/category/one/level',
  new NetworkFirst({
    cacheName: 'api',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);
registerRoute(
  VUE_APP_BASE_URL + '/area/countries',
  new NetworkFirst({
    cacheName: 'api',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);
registerRoute(
  new RegExp(VUE_APP_BASE_URL + '/product/query/recommend/cache/.+'),
  new NetworkFirst({
    cacheName: 'api',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);
