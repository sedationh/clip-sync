const CACHE_NAME = "clipsync-cache-v2";

// 监听 install 事件，预缓存静态资源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/", "/manifest.json", "/favicon.ico"]);
    })
  );
});

// 监听 fetch 事件，区分不同的资源类型
self.addEventListener("fetch", (event) => {
  const { request } = event;
  
  // 对 HTML 文件使用 "Network First" 策略
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(request)) // 如果离线，则返回缓存
    );
    return;
  }

  // 对其他资源（CSS、JS、图片）使用 "Stale-While-Revalidate" 策略
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => cachedResponse); // 如果离线，返回缓存
      return cachedResponse || fetchPromise;
    })
  );
});

// 监听 activate 事件，清理旧缓存
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});
