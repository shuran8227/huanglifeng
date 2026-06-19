/**
 * Service Worker - 离线缓存 + 安装到主屏
 * 部署到 HTTPS 后自动生效
 */

// 需要缓存的页面
self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(clients.claim());
});

// 简单的网络优先策略
self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    })
  );
});
