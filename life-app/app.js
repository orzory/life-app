'use strict';

// 当前前端版本（显示在侧边栏底部，用于确认手机是否加载到最新版）
const APP_VERSION = 'v157';

// ---------- 手绘风 SVG 图标（替代原 emoji，单色线条、继承文字色） ----------
const ICON_PATHS = {
  home:'<path d="M4 11 L12 4 L20 11"/><path d="M6 10 V20 H18 V10"/><path d="M10.5 20 V14 H13.5 V20"/>',
  speech:'<path d="M4 5 H20 V15 H13 L9 19 V15 H4 Z"/><path d="M8 9 H16"/><path d="M8 12 H13"/>',
  book:'<path d="M12 6 C9 4.5 5.5 4.5 4.5 5.5 V18 C5.5 17 9 17 12 19 C15 17 18.5 17 19.5 18 V5.5 C18.5 4.5 15 4.5 12 6 Z"/><path d="M12 6 V19"/>',
  run:'<circle cx="14" cy="5.5" r="1.6"/><path d="M12 9 C14 8 15 10 14 12 L12 16"/><path d="M14 12 L18 11"/><path d="M12 16 L10 21"/><path d="M14 12 L17 16"/>',
  meal:'<path d="M4 10 H20 C20 15 16.5 18.5 12 18.5 C7.5 18.5 4 15 4 10 Z"/><path d="M3.5 10 H20.5"/><path d="M9 3.5 C8.5 5.5 9.5 6.5 9 8.5"/><path d="M13 2.5 C12.5 4.5 13.5 5.5 13 7.5"/>',
  rainbow:'<path d="M4 19 A9 9 0 0 1 20 19"/><path d="M7.5 19 A5.5 5.5 0 0 1 16.5 19"/><path d="M11 19 A1 1 0 0 1 13 19"/>',
  star:'<path d="M12 3.5 L14.2 9 L20 9.3 L15.5 13.2 L17 19 L12 15.6 L7 19 L8.5 13.2 L4 9.3 L9.8 9 Z"/>',
  spark:'<path d="M12 4 L13 11 L20 12 L13 13 L12 20 L11 13 L4 12 L11 11 Z"/>',
  flower:'<circle cx="12" cy="12" r="2"/><path d="M12 10 C10 6 14 6 12 10 Z"/><path d="M14 12 C18 10 18 14 14 12 Z"/><path d="M12 14 C10 18 14 18 12 14 Z"/><path d="M10 12 C6 10 6 14 10 12 Z"/>',
  link:'<path d="M10 14 L14 10"/><path d="M8.5 16.5 A3 3 0 1 1 8.5 10.5 L11 13"/><path d="M15.5 13.5 A3 3 0 1 1 15.5 7.5 L13 10"/>',
  heart:'<path d="M12 20 C12 20 4.5 14.5 4.5 9.2 A3.7 3.7 0 0 1 12 8 A3.7 3.7 0 0 1 19.5 9.2 C19.5 14.5 12 20 12 20 Z"/>',
  pencil:'<path d="M4 20 L5 16 L15.5 5.5 L18.5 8.5 L8 19 Z"/><path d="M14 6.5 L17 9.5"/>',
  broom:'<path d="M7 4 L13 10"/><path d="M13 10 L19 16"/><path d="M11 12 L19 15"/><path d="M12 14 L20 17"/>',
  chart:'<path d="M4 20 V4"/><path d="M4 20 H20"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="14" width="3" height="4"/>',
  camera:'<rect x="4" y="7" width="16" height="12" rx="2"/><path d="M9 7 L10.5 5 H13.5 L15 7"/><circle cx="12" cy="13" r="3"/>',
  search:'<circle cx="11" cy="11" r="5"/><path d="M15 15 L20 20"/>',
  cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 9.5 H20"/><path d="M8.5 3 V6"/><path d="M15.5 3 V6"/>',
  disk:'<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 5 V10 H15 V5"/><rect x="9" y="14" width="6" height="4"/>',
  trash:'<path d="M5 7 H19"/><path d="M9 7 V5 H15 V7"/><path d="M7 7 L8 20 H16 L17 7"/><path d="M10 10.5 V16.5"/><path d="M14 10.5 V16.5"/>',
  pin:'<path d="M12 21 C12 21 5 14 5 9.5 A7 7 0 0 1 19 9.5 C19 14 12 21 12 21 Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  drop:'<path d="M12 3.5 C12 3.5 6 10.5 6 14.5 A6 6 0 0 0 18 14.5 C18 10.5 12 3.5 12 3.5 Z"/>',
  menu:'<path d="M4 7 H20"/><path d="M4 12 H20"/><path d="M4 17 H20"/>',
  warn:'<path d="M12 4 L22 20 H2 Z"/><path d="M12 10 V15"/><circle cx="12" cy="17.5" r="0.7"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11 V8 A4 4 0 0 1 16 8 V11"/><circle cx="12" cy="15" r="1.1"/>',
  ok:'<circle cx="12" cy="12" r="8"/><path d="M8 12 L11 15 L16 9"/>',
  no:'<circle cx="12" cy="12" r="8"/><path d="M9 9 L15 15"/><path d="M15 9 L9 15"/>',
  hourglass:'<path d="M7 4 H17"/><path d="M7 20 H17"/><path d="M8 4 C8 9 16 9 16 12 C16 15 8 15 8 20"/><path d="M8 4 H16"/>',
  sun:'<circle cx="12" cy="12" r="3.6"/><path d="M12 3 V6"/><path d="M12 18 V21"/><path d="M3 12 H6"/><path d="M18 12 H21"/><path d="M5.5 5.5 L7.5 7.5"/><path d="M16.5 16.5 L18.5 18.5"/><path d="M5.5 18.5 L7.5 16.5"/><path d="M16.5 7.5 L18.5 5.5"/>',
  suncloud:'<circle cx="8" cy="7.5" r="2.4"/><path d="M8 2.5 V4.3"/><path d="M3 7 H4.8"/><path d="M9 13 A3.2 3.2 0 0 1 9 7.5 A4 4 0 0 1 17.5 9 A3 3 0 0 1 17.5 15 H10 A3.2 3.2 0 0 1 9 13 Z"/>',
  cloud:'<path d="M8 17 A4 4 0 0 1 8 9 A5 5 0 0 1 18 10.5 A3.5 3.5 0 0 1 18 17 Z"/>',
  fog:'<path d="M8 14 A3.6 3.6 0 0 1 8 8 A4.6 4.6 0 0 1 17 9.5 A3.2 3.2 0 0 1 17 14 Z"/><path d="M5 18 H19"/><path d="M6.5 20.5 H17.5"/>',
  rain:'<path d="M8 13 A3.6 3.6 0 0 1 8 7 A4.6 4.6 0 0 1 17 8.5 A3.2 3.2 0 0 1 17 13 Z"/><path d="M9 16 L8 19"/><path d="M13 16 L12 19"/><path d="M17 16 L16 19"/>',
  snow:'<path d="M8 13 A3.6 3.6 0 0 1 8 7 A4.6 4.6 0 0 1 17 8.5 A3.2 3.2 0 0 1 17 13 Z"/><path d="M9 17 L9 19"/><path d="M13 17 L13 19"/><path d="M17 17 L17 19"/>',
  thunder:'<path d="M8 12 A3.6 3.6 0 0 1 8 6 A4.6 4.6 0 0 1 17 7.5 A3.2 3.2 0 0 1 17 12 Z"/><path d="M12 13 L9.5 18 H12 L10.5 21"/>',
  cat:'<path d="M12 6.5 C16 6.5 18.5 9.5 18.5 14 C18.5 18 16 21 12 21 C8 21 5.5 18 5.5 14 C5.5 9.5 8 6.5 12 6.5 Z"/><path d="M7 8 L5.5 4 L9.5 6.5"/><path d="M17 8 L18.5 4 L14.5 6.5"/><circle cx="9.5" cy="13" r="0.8"/><circle cx="14.5" cy="13" r="0.8"/><path d="M11.5 16 C11.5 16 12 16.5 12.5 16"/>',
  vocab:'<path d="M3 9 L12 5 L21 9 L12 13 Z"/><path d="M7 11 V17 C7 17 9 19 12 19 C15 19 17 17 17 17 V11"/><path d="M21 9 V15"/>'
};
function ic(name){
  const p = ICON_PATHS[name];
  if (!p) return '';
  return '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
}
// 天气代码 → 图标
function wxIcon(code){
  if (code === 0) return 'sun';
  if (code === 1 || code === 2) return 'suncloud';
  if (code === 3) return 'cloud';
  if (code === 45 || code === 48) return 'fog';
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return 'rain';
  if ([71,73,75,77,85,86].includes(code)) return 'snow';
  if ([95,96,99].includes(code)) return 'thunder';
  return 'cloud';
}
// 填充 index.html 里静态的 data-ic 占位（运行一次）
function fillStaticIcons(){
  document.querySelectorAll('[data-ic]').forEach(el => { el.innerHTML = ic(el.dataset.ic); });
}

/* =========================================================================
   我的小日子 —— 核心逻辑（纯前端）
   数据全部存在手机本地 localStorage，不上传任何服务器。
   想加模块 / 加字段？只改下面的 MODULES 配置即可，不用碰别的代码。
   ========================================================================= */

// ---------- 小工具 ----------
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
// 本地日期（东八区等场景必须按本地时区算「今天」，不能用 toISOString 的 UTC 日期，
// 否则本地 0 点已过、UTC 还没过 0 点时会把「昨天」误判成「今天」，导致前一天内容不消失）
const today = () => {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
const uid   = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// 读 / 写 localStorage
function load(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}
function save(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}
// 数据备份 / 恢复：把所有 lifeapp_* 数据导出成 JSON 文件，也可从文件还原。
// 用途：① iOS 长期不开会清理 PWA 缓存导致数据丢失时的兜底；
//      ② 浏览器 ↔ 桌面（主屏）PWA 存储互相隔离，用备份文件手动搬运数据。
function collectBackup() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('lifeapp_')) data[k] = localStorage.getItem(k);
  }
  return { app: 'my-daily-routine', version: APP_VERSION, exportedAt: new Date().toISOString(), data };
}
function exportBackup() {
  const payload = collectBackup();
  const keys = Object.keys(payload.data);
  if (!keys.length) { toast('当前没有可备份的数据'); return; }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const ts = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
  a.href = url;
  a.download = `my-daily-routine-backup-${ts}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(`已导出备份（${keys.length} 项），建议存到文件 App / 云盘`);
}
function importBackup(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);
      const data = payload && payload.data ? payload.data : payload;
      if (!data || typeof data !== 'object') throw new Error('文件格式不对');
      const keys = Object.keys(data).filter(k => k.startsWith('lifeapp_'));
      if (!keys.length) throw new Error('备份里没有 My Daily Routine 数据');
      const go = () => {
        keys.forEach(k => { try { localStorage.setItem(k, data[k]); } catch (e) {} });
        toast('备份已恢复，正在刷新…');
        setTimeout(() => location.reload(), 600);
      };
      const hasExisting = keys.some(k => localStorage.getItem(k) !== null);
      if (hasExisting) {
        if (confirm('导入会用备份内容覆盖当前同名数据（每个模块以备份为准），确定继续？')) go();
      } else {
        go();
      }
    } catch (e) {
      toast('导入失败：' + e.message);
    }
  };
  reader.readAsText(file);
}
// 防注入：用户输入转义后再显示
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]
  ));
}
// 判断某「每日」模块今天是否已打卡
function isCheckedToday(m) {
  if (!m.daily) return null;
  return load(m.storageKey).some(r => r.date === today());
}

// ---------- 运动数据解析小工具 ----------
// 把时长字符串转成分钟（支持 01:23:11 / 23:11 / 40）
function parseDurationToMin(v) {
  if (!v) return 0;
  const s = String(v).trim();
  const m = s.match(/^(?:(\d+):)?(\d+):(\d+)$/);
  if (m) {
    const h = parseInt(m[1] || 0, 10);
    const min = parseInt(m[2] || 0, 10);
    return h * 60 + min + Math.round(parseInt(m[3], 10) / 60);
  }
  return Math.round(Number(s)) || 0;
}
// 把配速字符串转成秒/公里（7'30" → 450）
function parsePaceToSec(v) {
  if (!v) return 0;
  const m = String(v).match(/(\d+)['′](\d+)["″]?/);
  if (m) return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  return 0;
}
function formatPace(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}'${String(s).padStart(2, '0')}"`;
}
// 从 OCR 文本中解析华为健康/Keep 等运动详情页数据
function parseWorkoutText(text) {
  const d = {};
  // 1. 标准化空白
  let t = text.replace(/\s+/g, ' ');
  // 2. 合并被 OCR 拆开的中文字词："运 动 时 间" → "运动时间"
  t = t.replace(/([\u4e00-\u9fa5])\s+([\u4e00-\u9fa5])/g, '$1$2');
  // 3. 合并中文与斜杠之间的空格："次 /分 钟" → "次/分钟"
  t = t.replace(/([\u4e00-\u9fa5])\s*\/\s*([\u4e00-\u9fa5])/g, '$1/$2');
  // 4. OCR 纠错："二卡/二上/干卡" → "千卡"（OCR 常把"千"认成"二"或"干"，把"卡"认成"上"）
  t = t.replace(/二卡/g, '千卡').replace(/二上/g, '千卡').replace(/干卡/g, '千卡');

  // 日期时间：2026年7月25日 06:58 / 2026-07-25
  const dm = t.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日\s*(\d{1,2})[:：](\d{2})/)
        || t.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})\s*(\d{1,2})[:：](\d{2})/);
  if (dm) d.date = `${dm[1]}-${String(dm[2]).padStart(2,'0')}-${String(dm[3]).padStart(2,'0')}`;

  // 距离：华为详情页主距离在「运动时间」之前，且常为 x.xx 公里（单位常被 OCR 漏掉）。
  // 后面的 8.01 公里/小时 是平均速度，不是距离，所以优先在 beforeDur 里找。
  const beforeDur = (t.split(/运动时间|运动时长|用时|总消耗热量|总消耗/)[0] || t);
  let dist = null;
  const decimals = beforeDur.match(/(\d+\.\d+)/g) || [];
  const bigDec = decimals.find(n => { const f = parseFloat(n); return f >= 1 && f < 100; });
  if (bigDec) dist = { 1: bigDec };
  else {
    const nums = beforeDur.match(/(\d+)/g) || [];
    const big = nums.find(n => {
      const f = parseFloat(n);
      return f >= 1 && f < 100 && n.length < 4;
    });
    if (big) dist = { 1: big };
  }
  // 如果 beforeDur 里实在没有，再全文匹配带单位的距离，但严格排除"小时/km/h"
  if (!dist) {
    const full = t.match(/(\d+(?:\.\d+)?)\s*(?:公里|km|千米)(?!\s*小时|\/小时|h)/i);
    if (full) dist = full;
  }
  if (dist) d.distance = dist[1];

  // 运动时间：01:23:11 / 1:23:11 / 运动时长 01:23:11
  const dur = t.match(/(?:运动时间|运动时长|用时)\s*[:：]?\s*(\d{1,2}:\d{2}:\d{2})/)
        || t.match(/(\d{1,2}:\d{2}:\d{2})/);
  if (dur) d.duration = String(parseDurationToMin(dur[1]));

  // 热量：分别识别「活动热量」和「总消耗热量」
  function findCalAfterKeyword(keyword) {
    const idx = t.indexOf(keyword);
    if (idx >= 0) {
      const after = t.slice(idx + keyword.length);
      const m = after.match(/(\d+(?:\.\d+)?)\s*(?:千卡|kcal|大卡)/i);
      if (m) return m[1];
    }
    return null;
  }
  const activeCal = findCalAfterKeyword('活动热量');
  const totalCal  = findCalAfterKeyword('总消耗热量') || findCalAfterKeyword('总消耗') || findCalAfterKeyword('消耗热量');
  if (activeCal) d.activeCalories = String(parseInt(activeCal, 10));
  if (totalCal)  d.totalCalories  = String(parseInt(totalCal, 10));
  // 兜底：旧截图或关键字没识别到时，按老规则填到总消耗里
  if (!activeCal && !totalCal) {
    const calWithUnit = t.match(/(\d+(?:\.\d+)?)\s*(?:千卡|kcal|大卡)/i);
    const cal = calWithUnit || t.match(/(?:热量)\s*[:：]?\s*(\d+(?:\.\d+)?)/i);
    if (cal) d.totalCalories = String(parseInt(cal[1], 10));
  }

  // 配速：必须以 /公里 /里 /km 结尾，避免抓到状态栏时间 22:54
  const pace = t.match(/(?:平均配速|配速)?\s*[:：]?\s*(\d{1,2})\s*['′:\s]\s*(\d{1,2})\s*["″]?\s*\/\s*(?!小时)(?:公里|里|km)/i)
        || t.match(/(?:平均配速|配速)\s*[:：]?\s*(\d{1,2})\s*['′]\s*(\d{1,2})\s*["″]?/);
  if (pace) {
    const min = pace[1];
    const sec = pace[2];
    d.pace = `${min}'${sec.padStart(2, '0')}`;
  }

  // 心率：支持「次/分钟」「bpm」及空格拆分（不用 \b）
  const hr = t.match(/(?:平均心率|心率)?\s*(\d{2,3})\s*次?\/分钟/i)
        || t.match(/(?:平均心率|心率)\s*[:：]?\s*(\d{2,3})(?:\s|$)/i);
  if (hr) d.avgHr = hr[1];

  // 步频：支持「步/分钟」及数字被空格拆开（如 17 5 步/分钟）
  const cad = t.match(/(\d[\d\s]*\d)\s*步\/分钟/i)
        || t.match(/(?:平均步频|步频)\s*[:：]?\s*(\d+)(?:\s|$)/i);
  if (cad) d.cadence = cad[1].replace(/\s/g, '');

  // 步数：OCR 常把"步数""步"识别成"频""上""止"等，这里匹配"四位/五位带逗号数字 + 步/上/止/频"
  // 华为截图步数在底部，取最后一个符合条件的匹配更稳
  const stepsMatches = [...t.matchAll(/([\d,]{3,6})\s*(?:步|上|止|频)/g)];
  if (stepsMatches.length) {
    d.steps = stepsMatches[stepsMatches.length - 1][1].replace(/,/g, '');
  } else {
    // 备选：至少看到"步数"或"步"字样
    const steps = t.match(/步数?\s*[:：]?\s*([\d,]+)\s*(?:步|上|止|频)?/);
    if (steps) d.steps = steps[1].replace(/,/g, '');
  }

  // 类型：支持 OCR 空格拆分，如 "户外 跑步"
  if (/户外跑步|跑步|跑走结合/.test(t)) d.type = '跑步';
  else if (/户外步行|步行|走路/.test(t)) d.type = '步行';
  else if (/骑行|骑车|自行车/.test(t)) d.type = '骑行';
  return d;
}

/* =========================================================================
   模块配置（核心！）
   daily:true  → 按天打卡，记录自动带日期，概览会显示「今日是否打卡」
   daily:false → 长期累积（如年度计划），不参与每日打卡
   字段 type: text / number / date / textarea / checkbox
   ========================================================================= */
const MODULES = {
  reading: {
    title:'读点书吧', icon:'book', daily:true, storageKey:'lifeapp_reading',
    // 一键跳转到「微信读书」：手机装了 App 会直接唤起（weread://），没装则打开网页版
    launch:{ label:'打开微信读书', url:'https://weread.qq.com/', scheme:'weread://' },
    // 今日阅读概览：把今天各条记录的时长字段求和
    dailySummary:[ { key:'minutes', label:'阅读时长', unit:'分' } ],
    fields:[
      { key:'title',   label:'书名',     type:'text',    ph:'今天读了什么' },
      { key:'minutes', label:'时长(分)', type:'number',  ph:'30' },
      { key:'note',    label:'笔记/感想', type:'textarea' }
    ]
  },
  sport: {
    title:'嘿哈运动', icon:'run', daily:true, storageKey:'lifeapp_sport', modalForm:true,
    // 一键跳转到「华为运动健康」：手机装了 App 会直接唤起，没装则打开官网
    launch:{ label:'打开华为运动健康', url:'https://consumer.huawei.com/cn/mobileservices/health/', scheme:'huaweischeme://healthapp' },
    // 今日运动概览：把今天各条记录的运动时长求和
    dailySummary:[ { key:'duration', label:'运动时长', unit:'分' } ],
    // 周计划：7 天可编辑，覆盖式保存（不计入每日打卡）
    // 默认空白，想用时从「套用模板」下拉选模板一即可
    weeklyPlan:{
      storageKey:'lifeapp_sport_weekplan',
      templates:[
        {
          name:'模板一',
          plan:{
            '周一':'休息（拉伸/散步）',
            '周二':'间歇或节奏跑 | 8×400m(休90s)或20min节奏跑；仅卵泡期，黄体/经期改轻松',
            '周三':'轻松跑5-8km+上肢&核心 | 俯身划船+飞鸟+山羊挺身+臂屈伸',
            '周四':'臀腿力量 | 保加利亚蹲+哑铃臀推+罗马尼亚硬拉',
            '周五':'休息（瑜伽/泡沫轴）',
            '周六':'轻松恢复跑/帕梅拉HIIT | 跑6-8km或HIIT20min；半马专项期以轻松跑为主、HIIT每2周1次',
            '周日':'长距离LSR | 第1月13km→第4月20km→第5月21.1km；黄体期放慢15-30s'
          }
        }
      ]
    },
    fields:[
      { key:'date',           label:'日期',         type:'date', defaultToday:true },
      { key:'type',           label:'类型',         type:'select',  options:['跑步','力量','HIIT','有氧','其他'] },
      { key:'duration',       label:'时长(分)',     type:'number',  ph:'如 40' },
      { key:'note',           label:'备注',         type:'textarea' }
    ]
  },
  meal: {
    title:'好好吃饭', icon:'meal', daily:true, storageKey:'lifeapp_meal', groupMeals:true,
    fields:[
      { key:'date',     label:'日期',   type:'date', defaultToday:true },
      { key:'meal',     label:'餐次',   type:'text',  ph:'如 早餐/午餐/加餐/夜宵' },
      { key:'food',     label:'吃了什么', type:'textarea', ph:'菜品…' },
      { key:'image',    label:'配图(可多选)', type:'image', multiple:true }
    ]
  },
  daily: {
    title:'每日计划', icon:'rainbow', daily:true, storageKey:'lifeapp_daily', notepad:true,
    fields:[
      { key:'text', label:'计划内容', type:'text',     ph:'今天要做的事' },
      { key:'done', label:'已完成',   type:'checkbox' }
    ]
  },
  year: {
    title:'年度计划', icon:'star', daily:false, storageKey:'lifeapp_year', notepad:true,
    fields:[
      { key:'text', label:'年度目标', type:'text',     ph:'今年想完成的事' },
      { key:'done', label:'已完成',   type:'checkbox' }
    ]
  },
  idea: {
    title:'絮絮叨叨', icon:'spark', daily:true, storageKey:'lifeapp_idea',
    template:'diary',
    fields:[
      { key:'weather', label:'日期 / 天气', type:'text',     ph:'2026年7月28日 周二 · 晴' },
      { key:'event',   label:'【今日要事】', type:'textarea', ph:'去了哪、见了谁、做了什么' },
      { key:'book',    label:'【今日书账】', type:'textarea', ph:'阅读页码、知识点、金句摘抄' },
      { key:'life',    label:'【生活记录】', type:'textarea', ph:'饮食、见闻、影音' },
      { key:'idea',    label:'【絮絮叨叨】', type:'textarea', ph:'突然闪现的脑洞、段子或观察' },
      { key:'learn',   label:'【今日新知】', type:'textarea', ph:'今天学到了什么' },
      { key:'sleep',   label:'【睡眠评分】', type:'textarea', ph:'记录睡眠时间与质量、做的梦' }
    ]
  },
  word: {
    title:'对话单词', icon:'vocab', daily:true, storageKey:'lifeapp_word', checkin:true,
  }
};

// 左侧导航项：今日概览 + 所有模块
const NAV = [{ key:'home', icon:'home', title:'今日概览' }].concat(
  Object.entries(MODULES).map(([key, m]) => ({ key, icon:m.icon, title:m.title }))
);

let clockTimer = null;   // 时钟定时器，离开概览页时清除

// ---------- 路由 ----------
function currentHash() {
  return location.hash.replace('#/', '') || 'home';
}
function render() {
  clearInterval(clockTimer);          // 切换页面先停掉旧时钟
  const hash = currentHash();
  // 进入每日计划模块时把查看日期重置为今天（从月历跳转走 _dpPendingDate 分支，不会走到这里）
  if (hash === 'daily' && _dpLastHash !== 'daily') dailyPlanViewDate = today();
  _dpLastHash = hash;
  const main = $('#view');
  if (hash === 'home') {
    main.innerHTML = renderHome();
    bindHome();
  } else if (MODULES[hash]) {
    main.innerHTML = renderModule(hash);
    bindModule(hash);
  }
  renderNav();
  closeDrawer();                      // 手机端选中后收起抽屉
  window.scrollTo(0, 0);
}

// 左侧导航高亮当前项；checkin 模块点击直接切换打卡，不跳页
function renderNav() {
  const cur = currentHash();
  $('#nav').innerHTML = NAV.map(n => {
    const isCheckin = n.key !== 'home' && MODULES[n.key] && MODULES[n.key].checkin;
    return `
    <a href="#/${n.key}" class="nav-item ${cur === n.key ? 'active' : ''}" data-key="${n.key}" ${isCheckin ? 'data-checkin="1"' : ''}>
      <span class="nav-icon">${ic(n.icon)}</span>
      <span class="nav-text">${n.title}</span>
    </a>`;
  }).join('');
}

// 切换 checkin 模块的今日打卡状态，返回是否已完成
function toggleCheckinToday(key) {
  const m = MODULES[key];
  if (!m || !m.checkin) return null;
  const arr = load(m.storageKey);
  const t = today();
  const done = arr.some(r => r.date === t);
  if (done) {
    save(m.storageKey, arr.filter(r => r.date !== t));
  } else {
    arr.unshift({ id: uid(), date: t });
    save(m.storageKey, arr);
  }
  return !done;
}

// ---------- 天气卡片（定位 + Open-Meteo 免费接口，无需密钥） ----------
// 定位总开关：false = 固定显示广州（开发/预览阶段，不弹定位）；
// 装到手机上当真·App 后改成 true，即自动改用手机定位的城市。
const USE_PHONE_LOCATION = false;
const FALLBACK_LOC = { lat:23.1291, lon:113.2644, city:'广州' }; // 定位失败回退广州
const WMO = {
  0:'晴',1:'大致晴朗',2:'局部多云',3:'阴',45:'雾',48:'雾凇',
  51:'毛毛雨',53:'毛毛雨',55:'毛毛雨',56:'冻毛雨',57:'冻毛雨',
  61:'小雨',63:'中雨',65:'大雨',66:'冻雨',67:'冻雨',
  71:'小雪',73:'中雪',75:'大雪',77:'雪粒',
  80:'阵雨',81:'阵雨',82:'强阵雨',85:'阵雪',86:'强阵雪',
  95:'雷阵雨',96:'雷阵雨',99:'雷阵雨'
};
let geoCoords = null;     // 定位结果缓存（只问一次）
let weatherCache = null;  // 天气结果缓存（按天）

const pad2 = n => String(n).padStart(2,'0');
const fmtH = h => pad2(h) + ':00';

async function getCoords() {
  if (geoCoords) return geoCoords;
  if (!USE_PHONE_LOCATION) return FALLBACK_LOC;          // 先看广州效果，不弹定位
  if (!('geolocation' in navigator)) return FALLBACK_LOC;
  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat:pos.coords.latitude, lon:pos.coords.longitude, city:null, fromGeo:true }),
      () => resolve(FALLBACK_LOC),
      { timeout:8000, maximumAge:600000 }
    );
  });
}

// 20:00 后自动切到「分析明天」模式
const isEveningMode = () => new Date().getHours() >= 20;

async function fetchWeather() {
  const c = await getCoords();
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}`
    + `&current=temperature_2m,relative_humidity_2m,weather_code`
    + `&hourly=temperature_2m,relative_humidity_2m,precipitation_probability`
    + `&daily=temperature_2m_max,temperature_2m_min`
    + `&timezone=auto&forecast_days=2`;
  const [wx, geo] = await Promise.all([
    fetch(url).then(r => r.json()),
    c.fromGeo
      ? fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${c.lat}&longitude=${c.lon}&localityLanguage=zh`).then(r => r.json()).catch(() => null)
      : null
  ]);
  const city = (c.fromGeo && geo && (geo.city || geo.locality))
    ? (geo.city || geo.locality) : (c.city || '广州');
  return analyzeWeather(wx, city, isEveningMode());
}

// 根据逐小时温/湿/降水，挑最适合户外跑的时段
// forTomorrow=true（每天 20:00 后）→ 分析明天 5–21 点；否则分析今天剩余时段
function analyzeWeather(wx, city, forTomorrow) {
  const cur = wx.current || {};
  const temp = cur.temperature_2m;
  const humidity = cur.relative_humidity_2m;
  const code = cur.weather_code ?? 0;
  const condition = WMO[code] || '未知';
  const dayLabel = forTomorrow ? '明日' : '今日';

  const times = (wx.hourly && wx.hourly.time) || [];
  const temps = (wx.hourly && wx.hourly.temperature_2m) || [];
  const hums  = (wx.hourly && wx.hourly.relative_humidity_2m) || [];
  const pops  = (wx.hourly && wx.hourly.precipitation_probability) || [];
  if (temp === undefined || temp === null) {
    return { city, temp:null, humidity:null, condition, code, dayLabel, bestWindow:'—', note:'天气数据暂不可用', dailyMin:null, dailyMax:null, dailyAvgHum:null };
  }

  // 目标日期：今天 or 明天（本地时区 YYYY-MM-DD）
  const target = new Date();
  if (forTomorrow) target.setDate(target.getDate() + 1);
  const targetDate = `${target.getFullYear()}-${pad2(target.getMonth()+1)}-${pad2(target.getDate())}`;

  const nowH = new Date().getHours();
  const minH = forTomorrow ? 5 : Math.max(5, nowH);  // 明天从早5点起；今天从当前小时起
  const rows = [], dayAll = [];
  for (let i = 0; i < times.length; i++) {
    if (times[i].slice(0,10) !== targetDate) continue;
    const hh = parseInt(times[i].slice(11,13), 10);
    const item = { hh, temp:temps[i], hum:hums[i], pop:pops[i] ?? 0 };
    dayAll.push(item);
    if (hh >= minH && hh <= 21) rows.push(item);      // 只看 5–21 点
  }

  // 每日实际最高/最低温 + 全天平均湿度（用于天气摘要，避免和「最佳跑步窗口」混淆）
  const dailyTimes = (wx.daily && wx.daily.time) || [];
  const dayIdx = dailyTimes.indexOf(targetDate);
  const dailyMin = dayIdx >= 0 ? wx.daily.temperature_2m_min[dayIdx] : null;
  const dailyMax = dayIdx >= 0 ? wx.daily.temperature_2m_max[dayIdx] : null;
  const dailyAvgHum = dayAll.length ? dayAll.reduce((a, r) => a + r.hum, 0) / dayAll.length : null;

  const good = r => r.temp >= 15 && r.temp <= 27 && r.hum <= 85 && r.pop < 40;
  let runStart = null, runEnd = null; const runs = [];
  for (const r of rows) {
    if (good(r)) { if (runStart === null) runStart = r.hh; runEnd = r.hh; }
    else if (runStart !== null) { runs.push([runStart, runEnd]); runStart = null; }
  }
  if (runStart !== null) runs.push([runStart, runEnd]);

  if (!rows.length) {
    // 今天已没有可跑时段 → 直接改为分析明天（标题/时间/说明保持一致，不再出现「今日…明早」的矛盾）
    if (!forTomorrow) return analyzeWeather(wx, city, true);
    return { city, temp, humidity, condition, code, dayLabel, bestWindow:'—', note:'明日预报数据暂不可用，稍后再看', dailyMin, dailyMax, dailyAvgHum };
  }
  if (runs.length) {
    runs.sort((a,b) => (b[1]-b[0]) - (a[1]-a[0]));   // 最长舒适窗口优先
    const [s,e] = runs[0];
    const win = rows.filter(r => r.hh >= s && r.hh <= e);
    const avgT = win.reduce((a,r)=>a+r.temp,0) / win.length;
    const avgH = win.reduce((a,r)=>a+r.hum,0) / win.length;
    const minT = Math.min(...win.map(r => r.temp));
    const maxT = Math.max(...win.map(r => r.temp));
    return { city, temp, humidity, condition, code, dayLabel,
      bestWindow: `${fmtH(s)}–${fmtH(e)}`,
      bestTemp: avgT, bestHum: avgH, bestTempMin: minT, bestTempMax: maxT,
      dailyMin, dailyMax, dailyAvgHum };
  }
  // 无理想窗口：挑综合最佳单小时
  let best = rows[0];
  for (const r of rows) {
    const sc = Math.abs(r.temp-20) + r.hum/20 + r.pop/10;
    const bs = Math.abs(best.temp-20) + best.hum/20 + best.pop/10;
    if (sc < bs) best = r;
  }
  return { city, temp, humidity, condition, code, dayLabel,
    bestWindow: fmtH(best.hh),
    bestTemp: best.temp, bestHum: best.hum, bestTempMin: best.temp, bestTempMax: best.temp,
    dailyMin, dailyMax, dailyAvgHum };
}

function renderWeatherInner(d) {
  if (!d) return `<div class="wx-loading">${ic('suncloud')} 正在获取当地天气…</div>`;
  if (d.error) return `<div class="wx-error">${ic('warn')} 天气获取失败，请检查网络</div>`;
  const t = (d.temp === null || d.temp === undefined) ? '—' : Math.round(d.temp) + '°';
  const h = (d.humidity === null || d.humidity === undefined) ? '—' : Math.round(d.humidity) + '%';
  const dMin = (d.dailyMin === undefined || d.dailyMin === null) ? '—' : Math.round(d.dailyMin);
  const dMax = (d.dailyMax === undefined || d.dailyMax === null) ? '—' : Math.round(d.dailyMax);
  const avgH = (d.dailyAvgHum === undefined || d.dailyAvgHum === null) ? '—' : Math.round(d.dailyAvgHum);
  const runMeta = `${d.dayLabel || '今日'} ${dMin}°C–${dMax}°C / 平均湿度 ${avgH}%`;

  return `
    <div class="wx-topline">
      <span class="wx-ic">${ic(wxIcon(d.code))}</span>
      <span class="wx-city">${ic('pin')} ${escapeHtml(d.city || '当地')}</span>
      <span class="wx-temp">${t}</span>
      <span class="wx-cond">${d.condition}</span>
      <span class="wx-hum">${ic('drop')} 湿度 ${h}</span>
    </div>
    <div class="wx-run">
      <div class="wx-run-meta">${runMeta}</div>
      <div class="wx-run-line">
        <span class="wx-run-title">${ic('run')} 最佳户外跑步时段</span>
        <span class="wx-run-time">${d.bestWindow}</span>
      </div>
    </div>`;
}

async function refreshWeather() {
  const card = $('#weatherCard');
  if (!card) return;
  // 缓存按「天 + 早晚模式」双重判断：20:00 一过自动失效，重新分析明天
  if (weatherCache && weatherCache.date === today() && weatherCache.evening === isEveningMode()) {
    card.innerHTML = renderWeatherInner(weatherCache);
    return;
  }
  card.innerHTML = renderWeatherInner(null);
  try {
    const data = await fetchWeather();
    data.date = today();
    data.evening = isEveningMode();
    weatherCache = data;
    const c2 = $('#weatherCard');
    if (c2) c2.innerHTML = renderWeatherInner(data);
    autoFillDiaryWeather();   // 天气到位后，若日记页已打开且「日期/天气」还空着，自动补当天实况
  } catch (e) {
    const c2 = $('#weatherCard');
    if (c2) c2.innerHTML = `<div class="wx-error">${ic('warn')} 天气获取失败，请检查网络</div>`;
  }
}

// ---------- 每日箴言（一言 API + 本地兜底，按天缓存） ----------
const QUOTE_KEY = 'lifeapp_quote';
// 断网/接口失败时用的「生活治愈系」本地箴言，按年内天数轮换，保证每天一句
const QUOTE_FALLBACK = [
  '把寻常的日子，过出一点欢喜。',
  '慢慢来，比较快。',
  '今天也要好好吃饭、好好生活。',
  '你所经历的一切，都会变成光。',
  '心若安顿，处处是归处。',
  '微小的进步，也是进步。',
  '愿你被这世界温柔以待。',
  '生活明朗，万物可爱。',
  '不必借光而行，你亦是星辰。',
  '保持热爱，奔赴山海。',
  '万物皆有裂痕，那是光照进来的地方。',
  '认真生活的人，自带光芒。',
  '日子清清淡淡，心头温温热热。',
  '好好爱自己，是终身浪漫的开始。'
];
function dayOfYear() {
  const n = new Date();
  const start = new Date(n.getFullYear(), 0, 0);
  return Math.floor((n - start) / 86400000);
}
function getDailyQuoteCache() {
  try { return JSON.parse(localStorage.getItem(QUOTE_KEY) || 'null'); } catch (e) { return null; }
}
function setDailyQuoteCache(obj) {
  try { localStorage.setItem(QUOTE_KEY, JSON.stringify(obj)); } catch (e) {}
}
async function refreshDailyQuote() {
  const el = document.getElementById('dailyQuote');
  const fromEl = document.getElementById('dailyQuoteFrom');
  if (!el) return;
  const t = today();
  // 箴言署名格式升级时，清掉旧缓存，让当天也立即用新格式（仅作者名）
  if (localStorage.getItem('lifeapp_quote_fmt') !== '2') {
    localStorage.removeItem(QUOTE_KEY);
    localStorage.setItem('lifeapp_quote_fmt', '2');
  }
  const cached = getDailyQuoteCache();
  // 当天已取过：直接复用，保证同日不变
  if (cached && cached.date === t) {
    el.textContent = cached.text;
    if (fromEl) fromEl.textContent = cached.from || '';
    return;
  }
  try {
    // 一言 API：文学(d) + 原创(e) + 哲学(k)，偏治愈/生活感
    const r = await fetch('https://v1.hitokoto.cn/?c=d&c=e&c=k');
    if (!r.ok) throw new Error('bad status');
    const j = await r.json();
    const text = (j.hitokoto || '').trim() || QUOTE_FALLBACK[dayOfYear() % QUOTE_FALLBACK.length];
    const who = (j.from_who || '').trim();
    const src = (j.from || '').trim();
    // 箴言下方只显示作者名字（有作者优先，其次作品名），不再带《书名》
    const from = who ? ('—— ' + who) : (src ? ('—— ' + src) : '');
    setDailyQuoteCache({ date: t, text, from });
    el.textContent = text;
    if (fromEl) fromEl.textContent = from;
  } catch (e) {
    // 离线兜底：用本地库按天取一句
    const pick = QUOTE_FALLBACK[dayOfYear() % QUOTE_FALLBACK.length];
    setDailyQuoteCache({ date: t, text: pick, from: '' });
    el.textContent = pick;
    if (fromEl) fromEl.textContent = '';
  }
}

// ---------- 概览（桌面/首页）：时间 + 天气 + 今日打卡 ----------
function renderHome() {
  // 今日打卡只统计部分每日模块（灵感不计入打卡；每日计划单独做成首页卡片）
  const EXCLUDE_FROM_CHECKIN = ['idea', 'daily'];
  const dailyMods = Object.entries(MODULES)
    .filter(([, m]) => m.daily)
    .filter(([key]) => !EXCLUDE_FROM_CHECKIN.includes(key));
  const total = dailyMods.length;
  const done  = dailyMods.filter(([, m]) => isCheckedToday(m)).length;
  const pct   = total ? Math.round(done / total * 100) : 0;

  // 完成度圆环（SVG 描边）
  const R = 52, C = 2 * Math.PI * R;
  const offset = C * (1 - pct / 100);

  const rows = dailyMods.map(([key, m]) => {
    const ok = isCheckedToday(m);
    return `<a href="#/${key}" class="check-row ${ok ? 'done' : ''}" data-key="${key}"${m.checkin ? ' data-checkin="1"' : ''}>
      <span class="box ${ok ? 'checked' : ''}">${ok ? '✓' : ''}</span>
      <span class="row-title">${m.title}</span>
    </a>`;
  }).join('');

  return `
    <div class="hero">
      <div class="hero-greet"><span class="ic hero-ic">${ic('heart')}</span><span id="dailyQuote" class="hero-quote">今天也要加油呀</span></div>
      <div id="dailyQuoteFrom" class="hero-quote-from"></div>
      <div id="clock" class="clock"></div>
      <div id="clockDate" class="clock-date">${todayLabel()}</div>
    </div>

    <div class="weather-card" id="weatherCard">${renderWeatherInner(weatherCache)}</div>

    <div class="checkin-card">
      <div class="ring-wrap">
        <svg class="ring" viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
          <circle class="ring-track" cx="60" cy="60" r="${R}"></circle>
          <circle class="ring-fill" cx="60" cy="60" r="${R}"
            stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}"
            transform="rotate(-90 60 60)"></circle>
        </svg>
        <div class="ring-label">${pct}<span class="ring-pct">%</span></div>
      </div>
      <div class="checkin-list">${rows}</div>
    </div>

    ${renderDailyPlanCard()}

    <div id="homeCalendarWrap" class="home-cal-wrap">${renderCalendar(buildDateModuleMap())}</div>

    ${renderIdeaCard()}`;
}

// 首页「每日灵感」便签卡片
function renderIdeaCard() {
  const rec = diaryTodayRecord('lifeapp_idea');
  const filled = diaryFilledCount(rec);
  const hint = filled
    ? '今日日记已填 ' + filled + '/7，点击查看或继续写…'
    : '该写流水账啦';
  return `
    <a class="idea-card" id="ideaCard" href="#/idea" role="button">
      <div class="idea-head"><span>${ic('spark')} 絮絮叨叨</span><span class="idea-count">${filled}/7</span></div>
      <div class="idea-body"><div class="idea-empty">${ic('cat')} ${hint}</div></div>
      <span class="idea-write">${ic('pencil')} 写日记</span>
    </a>`;
}

// 首页「每日计划」小卡片：从打卡环里抽出来单独展示，点开去模块编辑
function renderDailyPlanCard() {
  const list = load('lifeapp_daily').filter(r => r.date === today());
  const total = list.length;
  const done = list.filter(r => r.done).length;
  let body;
  if (!total) {
    body = `<div class="dp-empty">${ic('cat')} 今天还没定计划</div>`;
  } else {
    const items = list
      .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))
      .map(it => `<div class="dp-item ${it.done ? 'done' : ''}">
        <span class="dp-check">${it.done ? '✓' : ''}</span>
        <span class="dp-text">${it.fromWeekPlan ? '<span class="np-wp-tag">周</span>' : ''}${escapeHtml(it.text || '')}</span>
      </div>`).join('');
    body = `<div class="dp-list">${items}</div>`;
  }
  return `
    <a class="dp-card" id="dpCard" href="#/daily" role="button">
      <div class="dp-head"><span>${ic('rainbow')} 每日计划</span><span class="dp-count">${done}/${total}</span></div>
      ${body}
      <span class="dp-write">${ic('pencil')} 去安排</span>
    </a>`;
}

// 文件 → 压缩后的 base64（限制尺寸，避免撑爆 localStorage）
function fileToDataURL(file, maxW = 1000, quality = 0.72) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith('image/')) { reject(new Error('not image')); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxW) { height = Math.round(height * maxW / width); width = maxW; }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const keepPng = file.type === 'image/png';
        resolve(canvas.toDataURL(keepPng ? 'image/png' : 'image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('decode fail'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('read fail'));
    reader.readAsDataURL(file);
  });
}

// ---------- 灵感便签弹窗 ----------
function openIdeaModal() {
  $('#noteText').value = '';
  $('#noteImg').value = '';
  $('#noteImgPrev').innerHTML = '';
  $('#ideaModal').classList.add('show');
  setTimeout(() => $('#noteText').focus(), 50);
}
function closeIdeaModal() { $('#ideaModal').classList.remove('show'); }

function onNoteImgChange(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  fileToDataURL(file).then(url => {
    $('#noteImgPrev').innerHTML = `<img src="${url}" alt="预览">`;
  }).catch(() => {
    $('#noteImgPrev').innerHTML = '<span class="note-err">图片读取失败</span>';
  });
}

async function saveIdeaNote() {
  const text = $('#noteText').value.trim();
  const file = $('#noteImg').files && $('#noteImg').files[0];
  if (!text && !file) { alert('写点什么，或加张图吧～'); return; }
  let image = '';
  if (file) {
    try { image = await fileToDataURL(file); }
    catch { image = ''; }
  }
  const arr = load('lifeapp_idea');
  arr.unshift({ id: uid(), date: today(), text, image });
  save('lifeapp_idea', arr);
  closeIdeaModal();
  if (currentHash() === 'home') {       // 刷新首页卡片预览 + 计数
    $('#view').innerHTML = renderHome();
    bindHome();
  }
}

// 启动实时时钟
function bindHome() {
  tickClock();
  clockTimer = setInterval(tickClock, 1000);
  refreshWeather();   // 加载天气卡片
  refreshDailyQuote(); // 加载每日箴言（一言 API + 本地兜底）
  bindHomeCalendar();
  // 每日灵感卡片现在是链接到 #/idea，无需 JS 绑定
}

// 首页月历：翻月 + 点带记录的日期看当天哪些模块有记录
function bindHomeCalendar() {
  const wrap = document.getElementById('homeCalendarWrap');
  if (!wrap) return;
  wrap.addEventListener('click', e => {
    const nav = e.target.closest('.cal-nav');
    if (nav) { navigateMonth(parseInt(nav.dataset.delta, 10) || 0); return; }
    const cell = e.target.closest('.cal-cell');
    if (!cell) return;
    if (cell.dataset.delta) { navigateMonth(parseInt(cell.dataset.delta, 10)); return; }
    openDayModal(cell.dataset.date);
  });
}
function todayLabel() {
  const d = new Date();
  const week = ['周日','周一','周二','周三','周四','周五','周六'][d.getDay()];
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 ${week}`;
}
// 日记「日期/天气」自动预填文案：当天日期 + 当前实况（天气卡片加载完成后才有温度/天气）
function currentWeatherText() {
  if (weatherCache && weatherCache.temp != null && weatherCache.condition) {
    return `${todayLabel()} · ${weatherCache.condition} ${Math.round(weatherCache.temp)}°`;
  }
  return todayLabel();
}
// 天气卡片加载完、且日记页已打开时，若「日期/天气」还空着，自动补上当天实况
function autoFillDiaryWeather() {
  const el = document.querySelector('.diary-page [name="weather"]');
  if (el && !el.value.trim()) el.value = currentWeatherText();
}
function tickClock() {
  const tEl = $('#clock');
  const dEl = $('#clockDate');
  if (!tEl && !dEl) return;
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  if (tEl) tEl.innerHTML = `<div class="clock-time">${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}</div>`;
  if (dEl) dEl.textContent = todayLabel();
}

// ---------- 日记模板（每日灵感） ----------
function diaryTodayRecord(key){
  return load(key).find(r => r.date === today()) || {};
}
function diaryRecordByDate(key, dateStr){
  return load(key).find(r => r.date === dateStr) || {};
}
function diaryFilledCount(data){
  const fields = ['weather','event','book','life','idea','learn','sleep'];
  return fields.filter(k => String(data[k] || '').trim()).length;
}
function renderDiaryTemplate(m){
  const d = new Date();
  const week = ['周日','周一','周二','周三','周四','周五','周六'][d.getDay()];
  const dateLabel = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 ${week}`;
  const rec = diaryTodayRecord(m.storageKey);
  const val = k => escapeHtml(rec[k] || '');
  const ph = k => escapeHtml(m.fields.find(f => f.key === k).ph || '');
  // 「日期/天气」没手填过时，自动预填当天日期+当前天气；已填过则保留用户原文
  const weatherVal = rec.weather ? val('weather') : escapeHtml(currentWeatherText());
  const row = (k, label) => `
    <label class="diary-field">
      <span class="diary-label">${label}</span>
      <textarea name="${k}" rows="3" placeholder="${ph(k)}">${val(k)}</textarea>
    </label>`;
  return `
    <div class="diary-page">
      <div class="diary-top">
        <div class="diary-clip">${ic('cat')}</div>
        <div class="diary-date">${dateLabel}</div>
        <h2 class="diary-title">今日份哗啦啦</h2>
      </div>
      <div class="diary-weather-row">
        <label>
          <span class="diary-label">日期 / 天气</span>
          <input type="text" name="weather" value="${weatherVal}" placeholder="${ph('weather')}">
        </label>
      </div>
      <div class="diary-fields">
        ${row('event', '【今日要事】')}
        ${row('book',  '【今日书账】')}
        ${row('life',  '【生活记录】')}
        ${row('idea',  '【絮絮叨叨】')}
        ${row('learn', '【今日新知】')}
        ${row('sleep', '【睡眠评分】')}
      </div>
      <div class="diary-actions">
        <button type="button" id="diarySave" class="btn-primary">${ic('disk')} 保存日记</button>
        <span class="diary-count">已填 ${diaryFilledCount(rec)}/7</span>
      </div>
    </div>`;
}
function saveDiaryTemplate(m){
  const data = { id: diaryTodayRecord(m.storageKey).id || uid(), date: today() };
  for (const f of m.fields) {
    const el = $(`.diary-page [name="${f.key}"]`);
    data[f.key] = el ? el.value.trim() : '';
  }
  const arr = load(m.storageKey).filter(r => r.date !== today());
  arr.unshift(data);
  save(m.storageKey, arr);
}

// 从月历点「絮絮叨叨」时：只读弹出该日日记内容（今日份哗啦啦：一段汇总的流水，不分小框）
function renderDiaryViewModal(dateStr){
  const m = MODULES.idea;
  const rec = diaryRecordByDate(m.storageKey, dateStr);
  const dateLabel = formatZhDate(dateStr);
  const val = k => (rec[k] || '').trim();
  const fields = [
    ['event', '【今日要事】'],
    ['book',  '【今日书账】'],
    ['life',  '【生活记录】'],
    ['idea',  '【絮絮叨叨】'],
    ['learn', '【今日新知】'],
    ['sleep', '【睡眠评分】'],
  ];
  // 只汇集「填了内容」的字段，按原顺序流成一段，不再分小框
  const rows = fields.filter(([k]) => val(k)).map(([k, label]) =>
      `<div class="dv-row"><span class="dv-label">${label}</span><span class="dv-text">${escapeHtml(val(k))}</span></div>`).join('');
  const body = rows || `<div class="dv-empty">这一天还没写流水账～</div>`;
  return `
    <div class="diary-view">
      <div class="diary-view-top">
        <div class="diary-view-clip">${ic('cat')}</div>
        <div class="diary-view-date">${dateLabel}</div>
        <h2 class="diary-view-title">今日份哗啦啦</h2>
      </div>
      <div class="diary-view-flow">
        ${body}
      </div>
    </div>`;
}
function openDiaryViewModal(dateStr){
  $('#diaryViewDate').textContent = dateStr;
  $('#diaryViewBody').innerHTML = renderDiaryViewModal(dateStr);
  $('#diaryViewModal').classList.add('show');
}
function closeDiaryViewModal(){ $('#diaryViewModal').classList.remove('show'); }

// ---------- 模块页：表单 + 列表 ----------
function renderModule(key) {
  const m = MODULES[key];
  if (m.template === 'diary') return renderDiaryTemplate(m);

  // 极简打卡模块：点一下=今天完成，不弹表单、不记任何字段
  if (m.checkin) {
    const done = isCheckedToday(m);
    return `
      <h2 class="sec-title">${ic(m.icon)} ${m.title}</h2>
      <div class="checkin-box">
        <button id="checkinBtn" class="checkin-btn ${done ? 'done' : ''}" type="button">
          ${done ? ic('ok') + ' 今天已完成 ✓' : ic(m.icon) + ' 点击打卡'}
        </button>
        <p class="checkin-tip">${done ? '再点一下可取消今日打卡' : '背完今天的单词，点一下就好～'}</p>
      </div>`;
  }
  let list = load(m.storageKey);
  if (m.groupMeals) {                       // 好好吃饭：旧结构→新结构，规范化后回写
    list = normalizeMealList(list);
    const raw = load(m.storageKey);
    if (JSON.stringify(raw) !== JSON.stringify(list)) save(m.storageKey, list);
  }
  const formHtml  = m.fields.map(f => fieldHTML(f)).join('');
  // 每日模块只展示「今天」的记录：0 点过后自动回到空白状态，历史仍保留在首页月历的打卡足迹里
  const showList = m.daily
    ? list.filter(r => r.date && r.date.slice(0, 10) === today())
    : list;
  const itemsHtml = showList.map(item => m.groupMeals ? mealItemHTML(item) : itemHTML(m, item)).join('')
                   || `<p class="empty">${m.daily ? '今天还没有记录，添加第一条吧～' : '还没有记录，添加第一条吧～'}</p>`;
  // 每日模块提供「清空本日」按钮（每日计划按查看日清空，其他每日模块按今天清空）
  const resetBtn = m.daily
    ? `<button id="reset-today" class="btn-reset">${ic('broom')} 清空本日</button>` : '';
  // 模块附加上方：跳转到外部 App 的按钮 + 今日汇总
  let extra = '';
  if (m.launch) {
    if (m.launch.scheme) {
      // 优先用 scheme 唤起 App，失败（未安装）则在 1.8s 后回退到网页
      extra += `<button class="btn-launch" type="button" data-scheme="${m.launch.scheme}" data-fallback="${m.launch.url}">${ic('link')} ${m.launch.label}</button>`;
    } else {
      extra += `<a class="btn-launch" href="${m.launch.url}" target="_blank" rel="noopener">${ic('link')} ${m.launch.label}</a>`;
    }
  }
  if (m.dailySummary) {
    const todayList = list.filter(r => r.date === today());
    const parts = m.dailySummary.map(s => {
      const sum = todayList.reduce((a, r) => a + (Number(r[s.key]) || 0), 0);
      return `${s.label} <b>${sum}</b>${s.unit || ''}`;
    }).join(' · ');
    extra += `<div class="mod-summary">${ic('chart')} 今日：${parts || '还没有记录'}</div>`;
  }
  // 运动模块顶部「+ 添加运动记录」入口（弹窗式录入；OCR 截图识别已移除）
  const addEntry = m.modalForm
    ? `<button type="button" id="openSportForm" class="btn-primary btn-add-record">+ 添加运动记录</button>`
    : '';
  // 周计划（仅配置了 weeklyPlan 的模块，如嘿哈运动）
  let planHtml = '';
  if (m.weeklyPlan) {
    const wk = m.weeklyPlan;
    let plan = load(wk.storageKey);   // 本地已保存到计划；没有则空对象
    if (!plan || typeof plan !== 'object' || Array.isArray(plan)) plan = {};
    const days = ['周一','周二','周三','周四','周五','周六','周日'];
    // 模板下拉：默认空白，用户按需选择「模板一」套用
    const tplOpts = (wk.templates || []).map((t, i) => `<option value="${i}">${escapeHtml(t.name)}</option>`).join('');
    planHtml = `
      <div class="wp-box">
        <div class="wp-head">${ic('cal')} 本周计划</div>
        <div class="wp-toolbar">
          <span class="wp-tpl-label">套用模板：</span>
          <select id="wpTemplate" class="wp-select">
            <option value="">（不套用 / 自定义）</option>
            ${tplOpts}
          </select>
        </div>
        <div class="wp-grid">
          ${days.map(d => `<label class="wp-item">${d}<input name="wp-${d}" value="${escapeHtml(plan[d]||'')}" placeholder="休息/训练…"></label>`).join('')}
        </div>
        <div class="wp-actions">
          <button id="saveWeekPlan" class="btn-primary" type="button">${ic('disk')} 保存周计划</button>
          <button id="clearWeekPlan" class="btn-reset" type="button">${ic('trash')} 清空</button>
        </div>
      </div>`;
  }
  // 便签纸视图（每日计划 / 年度计划共用：
  //   daily=true  → 日期显示「当前查看日」（默认今天，可前后翻），只列出该天的计划；
  //   daily=false → 日期显示当前年份，列出全部年度目标）
  if (m.notepad) {
    if (_dpPendingDate) { dailyPlanViewDate = _dpPendingDate; _dpPendingDate = null; }
    const isDaily = !!m.daily;
    const viewDate = isDaily ? dailyPlanViewDate : null;
    const dateLabel = isDaily ? formatZhDate(viewDate) : (new Date().getFullYear() + ' 年');
    const items = (isDaily ? list.filter(r => r.date === viewDate) : list.slice())
      .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
    const npItems = items.map(it => `
      <div class="np-item ${it.done ? 'done' : ''} ${it.fromWeekPlan ? 'np-wp' : ''}" data-id="${it.id}">
        <span class="np-check">${it.done ? '✓' : ''}</span>
        <span class="np-text">${it.fromWeekPlan ? '<span class="np-wp-tag">周</span>' : ''}${escapeHtml(it.text || '')}</span>
        <button class="np-del" data-id="${it.id}">×</button>
      </div>
    `).join('') || `<div class="np-empty">还没有${isDaily ? formatZhDate(viewDate) : '今年'}的计划，添加一条吧～</div>`;
    const dateNav = isDaily ? `
      <div class="np-date-nav">
        <button type="button" class="np-nav-btn" data-dp-delta="-1" aria-label="前一天">‹</button>
        <span class="np-nav-date">${dateLabel}</span>
        <button type="button" class="np-nav-btn" data-dp-delta="1" aria-label="后一天">›</button>
        ${viewDate !== today() ? '<button type="button" class="np-nav-today" data-dp-today>今天</button>' : ''}
      </div>` : `<div class="np-date">${dateLabel}</div>`;
    return `
      <h2 class="sec-title">${ic(m.icon)} ${m.title}</h2>
      ${extra}
      <div class="notepad">
        ${dateNav}
        <div class="np-meta">
          <div class="np-line"><span>FROM:</span><em>ME</em></div>
          <div class="np-line"><span>TO:</span><em>MYSELF</em></div>
        </div>
        <div class="np-list" id="np-list">${npItems}</div>
        <form id="np-add" class="np-add">
          <input type="text" name="text" placeholder="+ 添加${isDaily && viewDate !== today() ? formatZhDate(viewDate) : (isDaily ? '今日' : '年度')}计划" autocomplete="off">
          <button type="submit">添加</button>
        </form>
        <div class="np-tags">${isDaily ? '#我的一天 #工作日' : '#我的' + new Date().getFullYear() + ' #flag'}</div>
        ${resetBtn}
      </div>`;
  }

  // 运动模块（modalForm）：顶部只放「+ 添加运动记录」按钮，点击弹出录入弹窗
  const formSection = m.modalForm
    ? `${addEntry}`
    : `${addEntry}
      <form id="add-form" class="add-form">
        ${formHtml}
        <button type="submit" class="btn-primary">+ 添加</button>
        ${resetBtn}
      </form>`;

  return `
    <h2 class="sec-title">${ic(m.icon)} ${m.title}</h2>
    ${extra}
    ${formSection}
    <div class="list" id="list">${itemsHtml}</div>
    ${planHtml}`;
}

function fieldHTML(f, val = '') {
  if (f.hidden) return `<input type="hidden" name="${f.key}" value="${escapeHtml(String(val))}">`;
  if (f.type === 'textarea')
    return `<label>${f.label}<textarea name="${f.key}" placeholder="${f.ph||''}">${escapeHtml(String(val))}</textarea></label>`;
  if (f.type === 'checkbox')
    return `<label class="cb"><input type="checkbox" name="${f.key}" ${val ? 'checked' : ''}> ${f.label}</label>`;
  if (f.type === 'image')
    return `<label>${f.label}<input type="file" name="${f.key}" accept="image/*"${f.multiple ? ' multiple' : ''}></label>`;
  if (f.type === 'date') {
    const v = val || (f.defaultToday ? today() : '');
    return `<label>${f.label}<input name="${f.key}" type="date" value="${escapeHtml(String(v))}"></label>`;
  }
  if (f.type === 'number')
    return `<label>${f.label}<input name="${f.key}" type="number" step="any" placeholder="${f.ph||''}" value="${escapeHtml(String(val))}"></label>`;
  if (f.type === 'select') {
    const optsList = f.options || [];
    const hasOther = optsList.includes('其他');
    const isPreset = val !== '' && optsList.includes(val);
    const showOther = hasOther && !isPreset && val !== '';   // 已有值是自定义内容（非预设）
    const selVal = isPreset ? val : (showOther ? '其他' : '');
    const emptyOpt = `<option value=""${selVal === '' ? ' selected' : ''}></option>`;
    const opts = optsList.map(o =>
      `<option value="${escapeHtml(o)}"${String(selVal) === String(o) ? ' selected' : ''}>${escapeHtml(o)}</option>`
    ).join('');
    const otherInput = hasOther
      ? `<input class="field-other" name="${f.key}_other" placeholder="请填写具体运动内容"${showOther ? '' : ' style="display:none"'} value="${escapeHtml(showOther ? val : '')}">`
      : '';
    return `<label>${f.label}<select name="${f.key}">${emptyOpt}${opts}</select>${otherInput}</label>`;
  }
  return `<label>${f.label}<input name="${f.key}" type="${f.type}" placeholder="${f.ph||''}" value="${escapeHtml(String(val))}"></label>`;
}

// 含「其他」选项的 select：若选了「其他」且填了自定义内容，则把自定义内容写回主字段
function mergeOtherSelects(m, data, formEl) {
  if (!formEl) return;
  for (const f of m.fields) {
    if (f.type === 'select' && (f.options || []).includes('其他')) {
      if (data[f.key] === '其他') {
        const otherEl = formEl[f.key + '_other'];
        const otherVal = otherEl && otherEl.value ? otherEl.value.trim() : '';
        if (otherVal) data[f.key] = otherVal;
      }
    }
  }
}

// 运动截图 OCR 用的 Tesseract.js 改为按需动态加载，避免外部脚本阻塞首屏
let tesseractLoading = null;
function loadTesseract() {
  if (typeof Tesseract !== 'undefined') return Promise.resolve(true);
  if (tesseractLoading) return tesseractLoading;
  tesseractLoading = new Promise(resolve => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    s.onload = () => resolve(true);
    s.onerror = () => { tesseractLoading = null; resolve(false); };
    document.head.appendChild(s);
  });
  return tesseractLoading;
}

// 把「好好吃饭」记录规范化：兼容旧版「每条=一餐」扁平结构，统一为「每天一条、meals 数组」结构
function normalizeMealList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(r => {
    if (r && Array.isArray(r.meals)) return r;            // 已是新结构
    return {                                             // 旧结构：单条记录直接带 meal/food/image
      id: r.id || uid(),
      date: r.date || today(),
      meals: [ { id: uid(), meal: r.meal || '', food: r.food || '', image: r.image ? [r.image] : [] } ]
    };
  });
}

// 渲染「好好吃饭」某天的记录：一天一个折叠项，里面按餐次列出
function mealItemHTML(item) {
  const meals = item.meals || [];
  const blocks = meals.map(me => {
    const food = (me.food || '').trim();
    const imgs = Array.isArray(me.image) ? me.image : (me.image ? [me.image] : []);
    const imgHtml = imgs.filter(src => src && src.startsWith('data:image'))
      .map(src => `<img class="item-img" src="${src}" alt="">`).join('');
    const img = imgHtml ? `<div><b>配图:</b><br><div class="item-imgs">${imgHtml}</div></div>` : '';
    return `<div class="meal-block" style="border-top:1px dashed rgba(0,0,0,.12); padding-top:8px; margin-top:8px;">
      <div style="font-weight:600; margin-bottom:4px;">🍽️ ${escapeHtml(me.meal || '餐次')}</div>
      ${food ? `<div style="white-space:pre-wrap; word-break:break-word;">${escapeHtml(food)}</div>` : ''}
      ${img}
      <button class="btn-del-meal" data-rid="${item.id}" data-mid="${me.id}"
        style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:13px;padding:4px 0;">删除</button>
    </div>`;
  }).join('');
  const openAttr = (item.date === today()) ? ' open' : '';
  return `<details class="item"${openAttr}>
    <summary class="item-summary">${ic('cal')} ${escapeHtml(item.date || '记录')} · ${meals.length} 餐</summary>
    <div class="item-body">${blocks}</div>
  </details>`;
}

function itemHTML(m, item) {
  const dateTag = item.date || '记录';
  const vals = m.fields.map(f => {
    let v = item[f.key];
    // 兼容旧字段：旧记录只有 calories，没有 activeCalories/totalCalories
    if (f.key === 'totalCalories' && !v && item.calories) v = item.calories;
    if (f.key === 'date') return '';   // 日期已在 summary 显示，避免重复
    if (f.type === 'checkbox')
      return `<span class="tag ${v?'on':''}">${f.label}${v?' ✓':''}</span>`;
    if (f.type === 'image') {
      const arr = Array.isArray(v) ? v : (v ? [v] : []);
      const html = arr.filter(s => s && s.startsWith('data:image')).map(s => `<img class="item-img" src="${s}" alt="">`).join('');
      return html ? `<div><b>${f.label}:</b><br>${html}</div>` : '';
    }
    return (v !== undefined && v !== '') ? `<div><b>${f.label}:</b> ${escapeHtml(v)}</div>` : '';
  }).join('');
  // 折叠显示：默认收起，只显示日期；点开看详情，避免长列表撑太长
  return `<details class="item">
    <summary class="item-summary">${ic('cal')} ${escapeHtml(dateTag)}</summary>
    <div class="item-body">${vals}
      <button class="btn-del" data-id="${item.id}">删除</button>
    </div>
  </details>`;
}

/* =========================================================================
   运动月历：带星标的日期 = 当天上传过运动数据，点日期弹出当天详情
   ========================================================================= */
let calView = null;   // 全局月历当前查看的年月 {y, m}（1-based）
// 每日计划当前查看的日期（默认今天，可前后翻天；从月历跳转时由 _dpPendingDate 携带目标日期）
let dailyPlanViewDate = today();
let _dpPendingDate = null;
let _dpLastHash = null;

function currentMonthView() {
  const n = new Date();
  return { y: n.getFullYear(), m: n.getMonth() + 1 };
}

function calDateStr(y, mo, d) {
  return `${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

// 汇总所有模块：日期 → 当天有记录的模块列表（同模块当天去重）
function buildDateModuleMap() {
  const map = {};
  Object.entries(MODULES).forEach(([key, m]) => {
    if (!m.storageKey) return;
    load(m.storageKey).forEach(r => {
      const ds = r.date;
      if (!ds) return;
      (map[ds] = map[ds] || []).push({ key, icon: m.icon, title: m.title });
    });
  });
  // 同一天同一个模块只显示一个图标
  Object.keys(map).forEach(ds => {
    const seen = new Set();
    map[ds] = map[ds].filter(x => (seen.has(x.key) ? false : (seen.add(x.key), true)));
  });
  return map;
}

function renderCalendar(byDateIcon) {
  const view = calView || (calView = currentMonthView());
  const { y, m: mo } = view;
  const startW = new Date(y, mo - 1, 1).getDay();   // 0=周日
  const days = new Date(y, mo, 0).getDate();
  const prevDays = new Date(y, mo - 1, 0).getDate();

  let cells = '';
  // 上月末尾日期补齐，保持每行 7 格，间隔一致
  for (let i = 0; i < startW; i++) {
    const d = prevDays - startW + 1 + i;
    const ds = calDateStr(y, mo - 1, d);
    cells += `<button type="button" class="cal-cell prev-month" data-date="${ds}" data-delta="-1" aria-label="${ds}">${d}</button>`;
  }
  for (let d = 1; d <= days; d++) {
    const ds = calDateStr(y, mo, d);
    const mods = byDateIcon[ds] || [];
    const isToday = ds === today();
    let iconsHtml = '';
    if (mods.length) {
      const max = 2, shown = mods.slice(0, max), more = mods.length - shown.length;
      iconsHtml = '<span class="cal-icons">' +
        shown.map(mo2 => `<span class="cal-ic" title="${escapeHtml(mo2.title)}">${ic(mo2.icon)}</span>`).join('') +
        (more > 0 ? `<span class="cal-more">+${more}</span>` : '') + '</span>';
    }
    cells += `<button type="button" class="cal-cell ${mods.length ? 'has-data' : ''} ${isToday ? 'today' : ''}" data-date="${ds}">`
           + `<span class="cal-num">${d}</span>${iconsHtml}</button>`;
  }
  const tail = (7 - ((startW + days) % 7)) % 7;
  for (let i = 0; i < tail; i++) {
    const d = i + 1;
    const ds = calDateStr(y, mo + 1, d);
    cells += `<button type="button" class="cal-cell next-month" data-date="${ds}" data-delta="1" aria-label="${ds}">${d}</button>`;
  }

  return `
    <div class="cal-box">
      <div class="cal-head">
        <button type="button" class="cal-nav" data-delta="-1" aria-label="上个月">‹</button>
        <span class="cal-title">${y}年${mo}月 · 打卡足迹</span>
        <button type="button" class="cal-nav" data-delta="1" aria-label="下个月">›</button>
      </div>
      <div class="cal-week">${['日','一','二','三','四','五','六'].map(w => `<span>${w}</span>`).join('')}</div>
      <div class="cal-grid">${cells}</div>
    </div>`;
}

function navigateMonth(delta) {
  const v = calView || currentMonthView();
  let y = v.y, m = v.m + delta;
  if (m < 1) { m = 12; y--; } else if (m > 12) { m = 1; y++; }
  calView = { y, m };
  const wrap = document.getElementById('homeCalendarWrap');
  if (wrap) wrap.innerHTML = renderCalendar(buildDateModuleMap());
}

// 月历日期 → 当日弹窗：上部分列出有记录的模块；下部分「待办事项」可在该日期增删/勾选待办
function openDayModal(dateStr) {
  const map = buildDateModuleMap();
  const mods = map[dateStr] || [];
  const recsHtml = mods.length ? mods.map(mo => {
    const m = MODULES[mo.key];
    const recs = load(m.storageKey).filter(r => r.date === dateStr);
    const count = m.groupMeals
      ? recs.reduce((s, r) => s + (r.meals ? r.meals.length : 0), 0)
      : recs.length;
    return `<a class="day-mod" href="#/${mo.key}">
        <span class="day-mod-ic">${ic(mo.icon)}</span>
        <span class="day-mod-title">${escapeHtml(mo.title)}</span>
        <span class="day-mod-count">${count} 条 ›</span>
      </a>`;
  }).join('') : '<p class="empty">这一天还没有记录</p>';

  $('#dayModalDate').textContent = dateStr;
  $('#dayModalBody').innerHTML = `
    <div class="dm-section">
      <div class="dm-section-title">${ic('cal')} 当日记录</div>
      ${recsHtml}
    </div>
    ${renderDayModalTodos(dateStr)}`;
  $('#dayModal').classList.add('show');

  // 点模块记录 → 跳进该模块（链接触发 hashchange → render 后会自动关弹窗）
  // 若点的是「每日计划」链接，先把目标日期带上；若点的是「絮絮叨叨」，只读弹出日记弹窗
  $$('#dayModalBody .day-mod').forEach(a => a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#/daily') {
      _dpPendingDate = dateStr;
    } else if (href === '#/idea') {
      e.preventDefault();
      openDiaryViewModal(dateStr);
      return;
    }
    closeDayModal();
  }));
  // 待办：勾选/删除
  const todoList = $('#dmTodoList');
  if (todoList) todoList.addEventListener('click', e => {
    const del = e.target.closest('.dm-todo-del');
    if (del) { delDailyTodo(del.dataset.id); refreshAfterTodoChange(dateStr); return; }
    const item = e.target.closest('.dm-todo');
    if (item) { toggleDailyTodo(item.dataset.id); refreshAfterTodoChange(dateStr); }
  });
  // 待办：新增
  const addForm = $('#dmTodoAdd');
  if (addForm) addForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = addForm.querySelector('input[name="todo"]');
    const text = (input ? input.value : '').trim();
    if (!text) return;
    addDailyTodo(dateStr, text);
    refreshAfterTodoChange(dateStr);
  });
  // 跳到每日计划查看该日期
  const jump = $('#dmJumpDaily');
  if (jump) jump.addEventListener('click', () => {
    _dpPendingDate = dateStr;
    closeDayModal();
    location.hash = '#/daily';
  });
}
function closeDayModal() { $('#dayModal').classList.remove('show'); }

// 渲染当日弹窗里的「待办事项」区块（数据来自 lifeapp_daily，按日期过滤）
function renderDayModalTodos(dateStr) {
  const arr = load('lifeapp_daily').filter(r => r.date === dateStr);
  const items = arr.map(it => `
    <div class="dm-todo ${it.done ? 'done' : ''}" data-id="${it.id}">
      <span class="dm-todo-check">${it.done ? '✓' : ''}</span>
      <span class="dm-todo-text">${escapeHtml(it.text || '')}</span>
      <button class="dm-todo-del" data-id="${it.id}" type="button">×</button>
    </div>`).join('') || '<p class="empty">这一天还没有待办</p>';
  return `
    <div class="dm-section">
      <div class="dm-section-title">${ic('rainbow')} 待办事项</div>
      <div class="dm-todos" id="dmTodoList">${items}</div>
      <form class="dm-todo-add" id="dmTodoAdd">
        <input type="text" name="todo" placeholder="给这一天加个待办…" autocomplete="off">
        <button type="submit">添加</button>
      </form>
      <button type="button" class="dm-jump" id="dmJumpDaily">在每日计划中查看 ›</button>
    </div>`;
}
function addDailyTodo(dateStr, text) {
  const arr = load('lifeapp_daily');
  arr.unshift({ id: uid(), text, done: false, date: dateStr });
  save('lifeapp_daily', arr);
}
function toggleDailyTodo(id) {
  const arr = load('lifeapp_daily').map(x => x.id === id ? { ...x, done: !x.done } : x);
  save('lifeapp_daily', arr);
}
function delDailyTodo(id) {
  save('lifeapp_daily', load('lifeapp_daily').filter(x => x.id !== id));
}
// 改完待办后：弹窗重渲染 + 月历重新计标 + 若正在看每日计划则刷新
function refreshAfterTodoChange(dateStr) {
  if (document.getElementById('dayModal').classList.contains('show')) openDayModal(dateStr);
  const wrap = document.getElementById('homeCalendarWrap');
  if (wrap) wrap.innerHTML = renderCalendar(buildDateModuleMap());
  if (currentHash() === 'daily') render();
}
// 日期 ±n 天（输入/输出 YYYY-MM-DD）
function shiftDate(ds, n) {
  const [y, mo, d] = ds.split('-').map(Number);
  const dt = new Date(y, mo - 1, d);
  dt.setDate(dt.getDate() + n);
  return calDateStr(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
}
// 把 YYYY-MM-DD 格式化成「M月D日 周X」
function formatZhDate(ds) {
  const [y, mo, d] = ds.split('-').map(Number);
  const wd = ['周日','周一','周二','周三','周四','周五','周六'][new Date(y, mo - 1, d).getDay()];
  return `${mo}月${d}日 ${wd}`;
}

// 轻提示：操作后不弹窗，只在底部短暂显示一行文字
function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.style.cssText = 'position:fixed; left:50%; bottom:calc(28px + env(safe-area-inset-bottom)); transform:translateX(-50%) scaleX(var(--sx)); background:var(--ink); color:#fff; padding:10px 18px; border-radius:var(--r-sm); font-size:calc(14px * var(--fs)); z-index:100; opacity:0; transition:opacity .25s ease; pointer-events:none; box-shadow:3px 4px 0 rgba(0,0,0,.15);';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  requestAnimationFrame(() => { el.style.opacity = '1'; });
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.style.opacity = '0'; }, 1800);
}

function openSportFormModal(prefill = {}) {
  const m = MODULES.sport;
  const formHtml = m.fields.map(f => fieldHTML(f, prefill[f.key] !== undefined ? prefill[f.key] : '')).join('');
  const form = $('#sport-form');
  if (!form) return;
  form.innerHTML = formHtml;
  $('#sportFormModal').classList.add('show');
  // 聚焦第一个可见输入框
  const firstInput = form.querySelector('input:not([type=hidden]), textarea, select');
  if (firstInput) setTimeout(() => firstInput.focus(), 50);
}
function closeSportFormModal() { $('#sportFormModal').classList.remove('show'); }

// 绑定某容器内记录的「删除」按钮（按 storageKey 过滤）
function bindDeletes(scope, storageKey) {
  $$(scope + ' .btn-del').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const arr = load(storageKey).filter(x => x.id !== id);
      save(storageKey, arr);
      render();
    });
  });
}

  // 绑定「添加 / 删除 / 清空今日」事件
function bindModule(key) {
  const m = MODULES[key];

  // 日记模板（每日灵感）保存
  if (m.template === 'diary') {
    const saveBtn = $('#diarySave');
    if (saveBtn) saveBtn.addEventListener('click', () => {
      saveDiaryTemplate(m);
      // 刷新计数显示
      const rec = diaryTodayRecord(m.storageKey);
      const countEl = $('.diary-count');
      if (countEl) countEl.textContent = `已填 ${diaryFilledCount(rec)}/7`;
      saveBtn.textContent = '已保存';
      setTimeout(() => { saveBtn.innerHTML = `${ic('disk')} 保存日记`; }, 1200);
    });
    return;
  }

  // 极简打卡模块：点击切换「今日打卡」
  if (m.checkin) {
    const btn = $('#checkinBtn');
    if (btn) btn.addEventListener('click', () => {
      toggleCheckinToday(key);
      render();
    });
    return;
  }

  const addForm = $('#add-form');
  if (addForm) addForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = {};
    let userDate = null;                    // 用户手动选的日期（用于补记过去）
    for (const f of m.fields) {
      const el = e.target[f.key];
      if (!el) continue;
      if (f.type === 'image') {
        if (f.hidden) {
          data[f.key] = el.value || '';       // 隐藏图片（如 OCR 回填的截图）直接取值，避免被清空
        } else {
          const files = el.files ? Array.from(el.files) : [];
          if (f.multiple) {
            const arr = [];
            for (const file of files) {
              try { arr.push(await fileToDataURL(file)); } catch (_) {}
            }
            data[f.key] = arr;
          } else {
            const file = files[0];
            data[f.key] = file ? await fileToDataURL(file) : '';
          }
        }
      } else if (f.type === 'checkbox') {
        data[f.key] = el.checked;
      } else {
        data[f.key] = el.value.trim();
        if (f.key === 'date') userDate = data[f.key];
      }
    }
    mergeOtherSelects(m, data, e.target);
    if (m.daily) data.date = userDate || today();   // 填了日期用填的（补记），否则今天

    // 好好吃饭：同一天多次上传的餐次合并进同一天记录（而不是每条单独占一行）
    if (m.groupMeals) {
      const date = data.date;
      const entryImgs = Array.isArray(data.image) ? data.image : (data.image ? [data.image] : []);
      const entry = { id: uid(), meal: data.meal || '', food: data.food || '', image: entryImgs };
      const arr = load(m.storageKey);
      const rec = arr.find(r => r.date === date);
      if (rec) {
        rec.meals = rec.meals || [];
        rec.meals.push(entry);
      } else {
        arr.unshift({ id: uid(), date, meals: [entry] });
      }
      save(m.storageKey, arr);
      render();
      return;
    }

    const arr = load(m.storageKey);
    arr.unshift(data);
    save(m.storageKey, arr);
    render();
  });

  // 运动模块：弹窗表单提交
  if (m.modalForm) {
    const sportForm = $('#sport-form');
    if (sportForm) sportForm.addEventListener('submit', async e => {
      e.preventDefault();
      const data = {};
      let userDate = null;
      for (const f of m.fields) {
        const el = e.target[f.key];
        if (!el) continue;
        if (f.type === 'image') {
          if (f.hidden) {
            data[f.key] = el.value || '';
          } else {
            const file = el.files && el.files[0];
            data[f.key] = file ? await fileToDataURL(file) : '';
          }
        } else if (f.type === 'checkbox') {
          data[f.key] = el.checked;
        } else {
          data[f.key] = el.value.trim();
          if (f.key === 'date') userDate = data[f.key];
        }
      }
      mergeOtherSelects(m, data, e.target);
      data.id = uid();
      data.date = userDate || today();
      const arr = load(m.storageKey);
      arr.unshift(data);
      save(m.storageKey, arr);
      closeSportFormModal();
      render();
    });

    const openBtn = $('#openSportForm');
    if (openBtn) openBtn.addEventListener('click', () => openSportFormModal());
  }

  bindDeletes('#list', m.storageKey);

  // 好好吃饭：删除某天里的「某一餐」（同一天合并记录，不能整条删，要按餐次删）
  if (m.groupMeals) {
    const listEl = $('#list');
    if (listEl) listEl.addEventListener('click', e => {
      const btn = e.target.closest('.btn-del-meal');
      if (!btn) return;
      const rid = btn.dataset.rid, mid = btn.dataset.mid;
      const arr = load(m.storageKey);
      const rec = arr.find(r => r.id === rid);
      if (!rec) return;
      rec.meals = (rec.meals || []).filter(x => x.id !== mid);
      // 当天所有餐次都删光了，就连当天记录一起清掉，保持列表整洁
      const next = arr.filter(r => r.id !== rid || (rec.meals && rec.meals.length));
      save(m.storageKey, next);
      render();
    });
  }

  const rb = $('#reset-today');
  if (rb) rb.addEventListener('click', () => {
    // 每日计划按查看日期清空；其他每日模块仍按今天清空
    const target = (m.daily && m.notepad) ? dailyPlanViewDate : today();
    const whenTxt = (m.daily && m.notepad) ? formatZhDate(target) : '今天';
    if (!confirm(`确定清空${whenTxt}在「${m.title}」的所有记录吗？`)) return;
    const arr = load(m.storageKey).filter(x => x.date !== target);
    save(m.storageKey, arr);
    render();
  });

  // 每日计划便签纸：点击行/复选框切换完成，点击 × 删除
  if (m.notepad) {
    // 日期前后翻（仅每日计划）
    const dpNav = $('.np-date-nav');
    if (dpNav) dpNav.addEventListener('click', e => {
      const delta = e.target.closest('[data-dp-delta]');
      if (delta) { dailyPlanViewDate = shiftDate(dailyPlanViewDate, parseInt(delta.dataset.dpDelta, 10)); render(); return; }
      if (e.target.closest('[data-dp-today]')) { dailyPlanViewDate = today(); render(); }
    });
    const npList = $('#np-list');
    if (npList) npList.addEventListener('click', e => {
      const delBtn = e.target.closest('.np-del');
      if (delBtn) {
        const id = delBtn.dataset.id;
        const arr = load(m.storageKey).filter(x => x.id !== id);
        save(m.storageKey, arr);
        render();
        return;
      }
      const item = e.target.closest('.np-item');
      if (item) {
        const id = item.dataset.id;
        const arr = load(m.storageKey).map(x => x.id === id ? { ...x, done: !x.done } : x);
        save(m.storageKey, arr);
        render();
      }
    });
    const npAdd = $('#np-add');
    if (npAdd) npAdd.addEventListener('submit', e => {
      e.preventDefault();
      const input = npAdd.querySelector('input[name="text"]');
      const text = (input ? input.value : '').trim();
      if (!text) return;
      const arr = load(m.storageKey);
      arr.unshift({ id: uid(), text, done: false, date: m.daily ? dailyPlanViewDate : today() });
      save(m.storageKey, arr);
      // 在每日计划里翻看非今日日期时添加，月历也要同步出标记
      const wrap = document.getElementById('homeCalendarWrap');
      if (wrap) wrap.innerHTML = renderCalendar(buildDateModuleMap());
      render();
    });
  }

  // 周计划保存（覆盖式）
  if (m.weeklyPlan) {
    const sp = $('#saveWeekPlan');
    if (sp) sp.addEventListener('click', () => {
      const days = ['周一','周二','周三','周四','周五','周六','周日'];
      const plan = {};
      days.forEach(d => {
        const el = document.querySelector(`[name="wp-${d}"]`);
        const v = el ? el.value.trim() : '';
        if (v) plan[d] = v;
      });
      save(m.weeklyPlan.storageKey, plan);
      syncTodayWeekPlanToDaily();
      sp.textContent = '已保存';
      setTimeout(() => { sp.textContent = '保存周计划'; }, 1200);
    });
    // 套用模板：从下拉选模板一，自动填进 7 个格子（不自动保存，用户看过后点「保存周计划」）
    const tpl = $('#wpTemplate');
    if (tpl) tpl.addEventListener('change', () => {
      const t = m.weeklyPlan.templates[Number(tpl.value)];
      if (!t) return;
      const days = ['周一','周二','周三','周四','周五','周六','周日'];
      days.forEach(d => {
        const el = document.querySelector(`[name="wp-${d}"]`);
        if (el) el.value = t.plan[d] || '';
      });
    });
    // 清空：把 7 格清空并删除本地存储
    const cp = $('#clearWeekPlan');
    if (cp) cp.addEventListener('click', () => {
      if (!confirm('确定清空本周计划的所有内容吗？')) return;
      const days = ['周一','周二','周三','周四','周五','周六','周日'];
      days.forEach(d => {
        const el = document.querySelector(`[name="wp-${d}"]`);
        if (el) el.value = '';
      });
      localStorage.removeItem(m.weeklyPlan.storageKey);
      cp.textContent = '已清空';
      setTimeout(() => { cp.textContent = '清空'; }, 1200);
    });
  }

}

// 把周计划里「今天」的内容同步进「每日计划」便签纸（标记 fromWeekPlan，便于去重/更新）
function syncTodayWeekPlanToDaily() {
  const wpMod = Object.values(MODULES).find(x => x.weeklyPlan);
  if (!wpMod) return;
  const plan = load(wpMod.weeklyPlan.storageKey) || {};
  if (!plan || Object.keys(plan).length === 0) return;   // 没设周计划就不动
  const map = { 0:'周日', 1:'周一', 2:'周二', 3:'周三', 4:'周四', 5:'周五', 6:'周六' };
  const dayKey = map[new Date().getDay()];
  const content = ((plan[dayKey] || '').split('|')[0] || '').trim();   // 每日计划只显示「|」前的内容
  const dailyMod = Object.values(MODULES).find(x => x.notepad);
  if (!dailyMod) return;
  const arr = load(dailyMod.storageKey);
  const idx = arr.findIndex(x => x.fromWeekPlan);
  if (!content) {                                   // 今天没安排则移除旧的同步条目
    if (idx >= 0) { arr.splice(idx, 1); save(dailyMod.storageKey, arr); }
    return;
  }
  if (idx >= 0) {                                   // 已有同步条目：内容/日期变了才更新（保留勾选状态）
    if (arr[idx].text !== content || arr[idx].date !== today()) {
      arr[idx] = { ...arr[idx], text: content, date: today(), done: false };
      save(dailyMod.storageKey, arr);
    }
  } else {                                          // 首次同步：新增一条
    arr.unshift({ id: uid(), text: content, done: false, date: today(), fromWeekPlan: true });
    save(dailyMod.storageKey, arr);
  }
}

// ---------- 抽屉（手机端） ----------
function openDrawer()  { $('.sidebar').classList.add('open');  $('#overlay').classList.add('show'); }
function closeDrawer() { $('.sidebar').classList.remove('open'); $('#overlay').classList.remove('show'); }

// ---------- 启动 ----------
// 一键唤起外部 App（如华为运动健康）：点击带 data-scheme 的按钮时，
// 先尝试用 scheme 唤起；若手机没装 App（页面未离开），1.8s 后回退到网页
document.addEventListener('click', e => {
  const btn = e.target.closest && e.target.closest('.btn-launch[data-scheme]');
  if (!btn) return;
  e.preventDefault();
  const scheme = btn.getAttribute('data-scheme');
  const fallback = btn.getAttribute('data-fallback') || '';
  let left = false;
  const onHide = () => { left = true; clearTimeout(timer); };
  document.addEventListener('visibilitychange', onHide, { once: true });
  const timer = setTimeout(() => {
    if (!left && fallback) window.location.href = fallback;
  }, 1800);
  // 尝试唤起 App（iOS 会弹「是否打开？」确认框；安卓直接唤起）
  window.location.href = scheme;
});

// 含「其他」选项的 select：选中「其他」时显示自定义输入框，选别的则隐藏并清空
document.addEventListener('change', e => {
  const sel = e.target;
  if (!sel || sel.tagName !== 'SELECT') return;
  const wrap = sel.closest('label');
  if (!wrap) return;
  const other = wrap.querySelector('.field-other');
  if (!other) return;
  if (sel.value === '其他') {
    other.style.display = '';
    if (other.value === '') setTimeout(() => other.focus(), 30);
  } else {
    other.style.display = 'none';
    other.value = '';
  }
});

window.addEventListener('hashchange', render);
window.addEventListener('load', () => {
  $('#menuBtn').addEventListener('click', openDrawer);
  $('#overlay').addEventListener('click', closeDrawer);
  // 侧边栏底部显示当前版本号，方便确认是否加载到最新版
  const foot = document.querySelector('.sidebar-foot');
  if (foot) foot.innerHTML = ic('lock') + ' · ' + APP_VERSION +
    ' · <a href="javascript:void(0)" id="checkUpdate" style="color:inherit;text-decoration:underline">检查更新</a>' +
    ' <span class="backup-btns">' +
    '<button id="btnExport" class="mini-btn" type="button">导出备份</button>' +
    '<button id="btnImport" class="mini-btn" type="button">导入</button>' +
    '<input id="fileImport" type="file" accept="application/json,.json" hidden>' +
    '</span>';
  const btnExport = document.getElementById('btnExport');
  if (btnExport) btnExport.addEventListener('click', exportBackup);
  const btnImport = document.getElementById('btnImport');
  const fileImport = document.getElementById('fileImport');
  if (btnImport && fileImport) {
    btnImport.addEventListener('click', () => fileImport.click());
    fileImport.addEventListener('change', e => {
      const f = e.target.files && e.target.files[0];
      if (f) importBackup(f);
      e.target.value = '';
    });
  }
  // 左侧导航：checkin 模块点一下就打卡/取消，不跳页；其它模块正常路由
  $('#nav').addEventListener('click', e => {
    const a = e.target.closest('.nav-item');
    if (!a) return;
    const key = a.dataset.key;
    if (!key || key === 'home') return;
    const m = MODULES[key];
    if (!m || !m.checkin) return;
    e.preventDefault();
    const done = toggleCheckinToday(key);
    toast(done ? `今日「${m.title}」已打卡 ✓` : `已取消「${m.title}」今日打卡`);
    render();            // 刷新首页打卡圆环、月历和导航高亮
    closeDrawer();       // 手机端收起抽屉
  });

  // 首页「打卡项目」列表里的 checkin 模块（如对话单词）：点一下直接打卡/取消，不跳页
  document.addEventListener('click', e => {
    const a = e.target.closest('.check-row[data-checkin="1"]');
    if (!a) return;
    e.preventDefault();
    const key = a.dataset.key;
    const m = MODULES[key];
    if (!m || !m.checkin) return;
    const done = toggleCheckinToday(key);
    toast(done ? `今日「${m.title}」已打卡 ✓` : `已取消「${m.title}」今日打卡`);
    render();            // 刷新打卡圆环、列表勾选与月历足迹
  });

  // 灵感便签弹窗事件（弹窗是静态的，只绑一次）
  $('#ideaModal').addEventListener('click', e => { if (e.target.id === 'ideaModal') closeIdeaModal(); });
  $('#noteCancel').addEventListener('click', closeIdeaModal);
  $('#noteSave').addEventListener('click', saveIdeaNote);
  $('#noteImg').addEventListener('change', onNoteImgChange);
  // 模块页面右滑返回主页面（今日概览）。#view 容器常驻，只绑一次。
  (function bindSwipeBack(){
    const view = document.getElementById('view');
    if (!view) return;
    let sx = 0, sy = 0, tracking = false;
    view.addEventListener('touchstart', e => {
      if (currentHash() === 'home') return;          // 主页面不处理
      if (e.touches.length !== 1) { tracking = false; return; }
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; tracking = true;
    }, { passive: true });
    view.addEventListener('touchend', e => {
      if (!tracking) return; tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx, dy = t.clientY - sy;
      // 右滑：水平位移足够大且明显大于垂直位移，避免误触竖向滚动
      if (dx > 60 && dx > Math.abs(dy) * 1.5) location.hash = '#/home';
    }, { passive: true });
  })();
  // 月历「当日记录」弹窗（静态常驻，不被 #view 重渲染影响）
  const dm = document.getElementById('dayModal');
  if (dm) {
    dm.addEventListener('click', e => { if (e.target.id === 'dayModal') closeDayModal(); });
    const dmc = document.getElementById('dayModalCancel');
    if (dmc) dmc.addEventListener('click', closeDayModal);
  }
  // 运动记录录入弹窗（静态常驻）
  const sfm = document.getElementById('sportFormModal');
  if (sfm) {
    sfm.addEventListener('click', e => { if (e.target.id === 'sportFormModal') closeSportFormModal(); });
    const sfc = document.getElementById('sportFormCancel');
    if (sfc) sfc.addEventListener('click', closeSportFormModal);
  }
  // 日记查看弹窗（静态常驻）
  const dvm = document.getElementById('diaryViewModal');
  if (dvm) {
    dvm.addEventListener('click', e => { if (e.target.id === 'diaryViewModal') closeDiaryViewModal(); });
    const dvc = document.getElementById('diaryViewCancel');
    if (dvc) dvc.addEventListener('click', closeDiaryViewModal);
  }
  // 0 点自动刷新：跨日时把当前视图重渲染为空白的新一天（历史仍保留在月历）
  function scheduleMidnightRefresh() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 3); // 次日凌晨 00:00:03
    const ms = next - now;
    setTimeout(() => {
      try { render(); } catch (e) { /* 跨日渲染失败不应中断后续 */ }
      scheduleMidnightRefresh();   // 排下一天
    }, ms);
  }

  fillStaticIcons();
  syncTodayWeekPlanToDaily();
  render();
  scheduleMidnightRefresh();
  // 注册 Service Worker：断网也能用（需 https 或 localhost）
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      // iOS PWA 从主屏幕打开时不会主动检查更新，这里手动触发
      const doUpdate = () => { try { reg.update(); } catch (e) {} };
      // 页面可见时（从后台切回/重新打开）检查更新
      document.addEventListener('visibilitychange', () => { if (!document.hidden) doUpdate(); });
      // 每隔 60 秒也检查一次，确保新版本能及时生效
      setInterval(doUpdate, 60000);
      // 「检查更新」按钮：手动强制检查并刷新
      const btn = document.getElementById('checkUpdate');
      if (btn) btn.addEventListener('click', () => {
        btn.textContent = '更新中…';
        doUpdate();
        setTimeout(() => location.reload(), 1500);
      });
    }).catch(() => {});
    // 当新 Service Worker 接管控制时，自动刷新页面加载最新版
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloading) return;
      reloading = true;
      location.reload();
    });
  }
});
