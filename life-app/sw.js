/* Service Worker：app 文件缓存到手机，断网也能开。
   策略：在线时 network-first（拉最新，改完刷新即生效）；离线时回退缓存。
   健壮性改进（v101）：
   - install 时逐个缓存，单个资源失败不影响整体安装，避免 SW 卡死导致 PWA 白屏。
   - 只缓存「同源 + 响应 200」的内容，绝不把错误页 / HTML 当成 JS/CSS 存起来。
   - 网络失败时按「原 URL → 去掉 ?v 查询参数的 URL → 导航兜底首页」回退；
     资源请求若都拿不到，返回 404 而非 HTML，避免把 HTML 当脚本执行。 */
const CACHE = 'lifeapp-v102';
const ASSETS = ['./', './index.html', './style.css', './app.js', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './SentyDonut.woff2'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // 逐个缓存，单个失败也不影响整体安装
    await Promise.allSettled(ASSETS.map(u => c.add(u).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function stripSearch(url) {
  const u = new URL(url);
  u.search = '';
  return u.href;
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const req = e.request;
  e.respondWith((async () => {
    try {
      const resp = await fetch(req);
      // 仅缓存同源且成功的响应，避免污染缓存
      if (resp && resp.ok && new URL(req.url).origin === self.location.origin) {
        const c = await caches.open(CACHE);
        try {
          await c.put(req, resp.clone());
          await c.put(stripSearch(req.url), resp.clone());
        } catch (_) {}
      }
      return resp;
    } catch (err) {
      const c = await caches.open(CACHE);
      const hit = await c.match(req) || await c.match(stripSearch(req.url));
      if (hit) return hit;
      // 只有页面导航请求才回退首页；资源请求返回 404，避免白屏
      if (req.mode === 'navigate') {
        const idx = await c.match('./index.html') || await c.match('./');
        if (idx) return idx;
      }
      return new Response('', { status: 404, statusText: 'Not Found' });
    }
  })());
});
