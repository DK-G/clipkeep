// Intentionally no-op.
// Keep this file to avoid 404s from stale service worker requests.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
