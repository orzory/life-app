/* Service Worker：app 文件缓存到手机，断网也能开。
   策略：在线时 network-first（拉最新，改完刷新即生效）；离线时回退缓存。
   对 JS/CSS 等资源，失败时按“原 URL → 去掉 ?v 查询参数的 URL → 导航兜底”回退，
   避免网络失败时把 index.html 当成 JS 执行导致白屏。 */
const CACHE = 'lifeapp-v100';
const ASSETS = ['./', './index.html', './style.css', './app.js', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// 去掉查询参数，用于缓存兜底匹配（例如 app.js?v99 → app.js）
function stripSearch(url) {
  const u = new URL(url);
  u.search = '';
  return u.href;
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => {
          c.put(e.request, copy);                 // 按原 URL 缓存（带 ?v100）
          c.put(stripSearch(e.request.url), copy.clone()); // 同时存一份无 query 版本
        });
        return resp;
      })
      .catch(() => {
        return caches.match(e.request).then(c => {
          if (c) return c;
          return caches.match(stripSearch(e.request.url)).then(c2 => {
            if (c2) return c2;
            // 只有页面导航请求才回退到首页；资源请求不回退 index.html，避免白屏
            if (e.request.mode === 'navigate') return caches.match('./');
            return new Response('', { status: 404, statusText: 'Not Found' });
          });
        });
      })
  );
});
