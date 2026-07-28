/* Service Worker：app 文件缓存到手机，断网也能开。
   策略（v104）：stale-while-revalidate
   - 有缓存时「先秒开返回缓存」，同时后台静默拉最新更新缓存（下次打开即新版本）；
   - 无缓存时才等网络；离线时回退缓存。
   - 字体请求直连网络，避开 iOS 把 SW 缓存的 206 字体拒绝应用的坑（见 v103）。
   健壮性：
   - install 逐个缓存，单个失败不影响整体；
   - 只缓存「同源 + 200」响应，绝不把错误页 / HTML 当 JS/CSS 存。 */
const CACHE = 'lifeapp-v106';
const ASSETS = ['./', './index.html', './style.css', './app.js', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './SentyDonut.woff2'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
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

  // 字体直连网络：避开 iOS SW 缓存 206 导致甜甜圈体不生效的坑
  if (req.destination === 'font') {
    e.respondWith(fetch(req));
    return;
  }

  e.respondWith((async () => {
    const sameOrigin = new URL(req.url).origin === self.location.origin;
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req) || await cache.match(stripSearch(req.url));

    // 后台静默拉取并更新缓存（不阻塞首屏）
    const netPromise = fetch(req).then(resp => {
      if (resp && resp.ok && sameOrigin) {
        try {
          cache.put(req, resp.clone());
          cache.put(stripSearch(req.url), resp.clone());
        } catch (_) {}
      }
      return resp;
    }).catch(() => null);

    if (cached) {
      // 秒开：先返回缓存，后台刷新
      netPromise;
      return cached;
    }

    // 无缓存时只能等网络
    const net = await netPromise;
    if (net) return net;
    // 离线兜底：导航请求回退首页，资源请求 404（避免把 HTML 当脚本执行）
    if (req.mode === 'navigate') {
      const idx = await cache.match('./index.html') || await cache.match('./');
      if (idx) return idx;
    }
    return new Response('', { status: 404, statusText: 'Not Found' });
  })());
});
