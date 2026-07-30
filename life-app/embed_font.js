// 把 SentyDonut.woff2 以 base64 data URI 内联进 style.css 的 @font-face，
// 彻底规避 iOS PWA 中「字体经 SW 缓存/直连/独立文件」导致的回退系统字体问题。
// 关键：@font-face 必须写在主 style.css 里（被主样式表引用），iOS standalone 才会可靠应用。
// 同时把 style.css 中除 @font-face 外的所有规则自动注入 index.html 的 <head> inline <style>，
// 让首屏在字体文件下载前就有完整样式，杜绝「图标爆大 / 链接变蓝」等中间态。
// 幂等：每次运行先清掉已有的 Donut @font-face 块与注释，再重新前置写入。
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const fontPath = path.join(dir, 'SentyDonut.woff2');
const cssPath = path.join(dir, 'style.css');
const htmlPath = path.join(dir, 'index.html');

const b64 = fs.readFileSync(fontPath).toString('base64');
let css = fs.readFileSync(cssPath, 'utf8');

// 清掉已有的 Donut @font-face 注释与规则块（幂等）
css = css.replace(/\/\* 新蒂甜甜圈体[\s\S]*?\*\/\s*/g, '');
css = css.replace(/@font-face\s*\{[^}]*font-family:\s*['"]?Donut['"]?[^}]*\}\s*/g, '');

const dataUri = `url(data:font/woff2;base64,${b64}) format('woff2')`;
const block =
  `/* 新蒂甜甜圈体（SentyDonut）：数据内联进主样式表，规避 iOS PWA 字体回退系统字体。\n` +
  `   用户本地上传字库，自托管部署，不依赖外部 CDN。已子集化（约 2.8MB / 6393 字形）。\n` +
  `   注意：不设 font-display:swap —— iOS 上 3.7MB 内联字体易被内存回收，swap 会回退系统字体；\n` +
  `   用默认行为（≈block，data URI 即时可用）一旦加载即锁定甜甜圈体，不再回退。 */\n` +
  `@font-face{\n` +
  `  font-family:'Donut';\n` +
  `  src:${dataUri};\n` +
  `}\n`;

fs.writeFileSync(cssPath, block + css, 'utf8');
console.log('font inlined into style.css, base64 length =', b64.length);

// ---- 把除 @font-face 外的规则注入 index.html 的 inline critical CSS ----
const updatedCss = fs.readFileSync(cssPath, 'utf8');
const criticalCss = updatedCss.substring(block.length);

let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(
  /(<style>)[\s\S]*?(<\/style>)/,
  `$1\n${criticalCss.trim()}\n  $2`
);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('critical CSS (non-font rules) inlined into index.html, length =', criticalCss.length);
