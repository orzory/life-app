'use strict';

// 当前前端版本（显示在侧边栏底部，用于确认手机是否加载到最新版）
const APP_VERSION = 'v26';

/* =========================================================================
   我的小日子 —— 核心逻辑（纯前端）
   数据全部存在手机本地 localStorage，不上传任何服务器。
   想加模块 / 加字段？只改下面的 MODULES 配置即可，不用碰别的代码。
   ========================================================================= */

// ---------- 小工具 ----------
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const today = () => new Date().toISOString().slice(0, 10);
const uid   = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// 读 / 写 localStorage
function load(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}
function save(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
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
  // 4. OCR 纠错："二卡" → "千卡"（OCR 常把"千"认成"二"）
  t = t.replace(/二卡/g, '千卡');

  // 日期时间：2026年7月25日 06:58 / 2026-07-25
  const dm = t.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日\s*(\d{1,2})[:：](\d{2})/)
        || t.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})\s*(\d{1,2})[:：](\d{2})/);
  if (dm) d.date = `${dm[1]}-${String(dm[2]).padStart(2,'0')}-${String(dm[3]).padStart(2,'0')}`;

  // 距离：优先匹配「数字+公里/km/千米」且排除"小时/公里小时"
  let dist = t.match(/(\d+(?:\.\d+)?)\s*(?:公里|km|千米)(?!\s*小时|\/小时)/i);
  if (!dist) {
    // 退而求其次：在运动时间/总消耗之前找主距离（华为详情页距离在最上面，单位常被 OCR 漏掉）
    const beforeDur = (t.split(/运动时间|运动时长|用时|总消耗热量|总消耗/)[0] || t);
    // 优先取小数（华为距离都是 x.xx 公里），避免抓到状态栏时间 22:54
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
  }
  if (dist) d.distance = dist[1];

  // 运动时间：01:23:11 / 1:23:11 / 运动时长 01:23:11
  const dur = t.match(/(?:运动时间|运动时长|用时)\s*[:：]?\s*(\d{1,2}:\d{2}:\d{2})/)
        || t.match(/(\d{1,2}:\d{2}:\d{2})/);
  if (dur) d.duration = String(parseDurationToMin(dur[1]));

  // 热量：优先匹配「数字+千卡/kcal/大卡」（不用 \b，中文词边界无效）
  const calWithUnit = t.match(/(\d+(?:\.\d+)?)\s*(?:千卡|kcal|大卡)/i);
  const cal = calWithUnit
        || t.match(/(?:总消耗热量|总消耗|消耗热量|消耗|热量)\s*[:：]?\s*(\d+(?:\.\d+)?)/i);
  if (cal) d.calories = String(parseInt(cal[1], 10));

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

  // 步数 14,582 步 / 14,582 上（"上"是"步"的 OCR 误识别）
  const steps = t.match(/步数\s*[:：]?\s*([\d,]+)\s*(?:步|上)/);
  if (steps) d.steps = steps[1].replace(/,/g, '');

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
  english: {
    title:'英语学习', icon:'🗣️', daily:true, storageKey:'lifeapp_english',
    // 一键跳转到「不背单词」：装了 App 会直接唤起，没装则打开官网（如需改跳转，把 url 换成 bubei:// 之类 scheme）
    launch:{ label:'🔗 打开不背单词背词', url:'https://www.bbdc.cn/' },
    // 今日学习概览：把今天各条记录的这些数字字段求和展示
    dailySummary:[ { key:'words', label:'已背单词', unit:'个' }, { key:'minutes', label:'学习时长', unit:'分' } ],
    fields:[
      { key:'words',    label:'今日单词数',  type:'number',  ph:'如 30' },
      { key:'minutes',  label:'学习时长(分)', type:'number',  ph:'如 20' },
      { key:'word',     label:'生词/句子',    type:'text',     ph:'今天记住的一个词' },
      { key:'meaning',  label:'释义',        type:'text',     ph:'中文意思' },
      { key:'sentence', label:'例句',        type:'textarea' },
      { key:'mastered', label:'已掌握',      type:'checkbox' }
    ]
  },
  reading: {
    title:'每日阅读', icon:'📚', daily:true, storageKey:'lifeapp_reading',
    // 一键跳转到「微信读书」：手机装了 App 会直接唤起，没装则打开网页版（如需改 scheme 直接唤起，把 url 换成 weread:// 之类）
    launch:{ label:'🔗 打开微信读书', url:'https://weread.qq.com/' },
    // 今日阅读概览：把今天各条记录的时长字段求和
    dailySummary:[ { key:'minutes', label:'阅读时长', unit:'分' } ],
    fields:[
      { key:'title',   label:'书名',     type:'text',    ph:'今天读了什么' },
      { key:'minutes', label:'时长(分)', type:'number',  ph:'30' },
      { key:'note',    label:'笔记/感想', type:'textarea' }
    ]
  },
  sport: {
    title:'锻炼身体', icon:'🏃‍♀️', daily:true, storageKey:'lifeapp_sport',
    // 一键跳转到「华为运动健康」：手机装了 App 会直接唤起，没装则打开官网
    launch:{ label:'🔗 打开华为运动健康', url:'https://consumer.huawei.com/cn/mobileservices/health/' },
    // 今日运动概览：把今天各条记录的运动时长/距离求和
    dailySummary:[ { key:'duration', label:'运动时长', unit:'分' }, { key:'distance', label:'距离', unit:'km' } ],
    // 上传运动截图做 OCR，自动识别华为健康等 App 的详情页数据
    ocr:{ hint:'上传华为健康/Keep 等运动详情页截图，自动读取距离、时长、配速、心率等' },
    // 月底看当月运动数据总结
    monthlySummary:true,
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
    // 身体数据：体重/体脂/腰围等按日期记录成小日志（不计入每日打卡）
    bodyData:{
      storageKey:'lifeapp_sport_body',
      head:'📊 身体数据',
      addLabel:'+ 记录身体数据',
      fields:[
        { key:'date',   label:'日期', type:'date', defaultToday:true },
        { key:'weight', label:'体重(kg)', type:'number', ph:'如 58.5' },
        { key:'fat',    label:'体脂率(%)', type:'number', ph:'可选' },
        { key:'waist',  label:'腰围(cm)', type:'number', ph:'可选' },
        { key:'note',   label:'备注', type:'textarea' }
      ]
    },
    fields:[
      { key:'date',       label:'日期',       type:'date', defaultToday:true },
      { key:'type',       label:'类型',       type:'text',    ph:'跑步 / 力量 / 瑜伽 / 户外跑' },
      { key:'distance',   label:'距离(km)',   type:'number',  ph:'如 5' },
      { key:'duration',   label:'时长(分)',   type:'number',  ph:'如 40' },
      { key:'calories',   label:'热量(kcal)', type:'number',  ph:'总消耗' },
      { key:'pace',       label:'配速',       type:'text',    ph:"如 7'30\"" },
      { key:'avgHr',      label:'平均心率',   type:'number',  ph:'如 147' },
      { key:'cadence',    label:'步频(步/分)', type:'number',  ph:'如 175' },
      { key:'steps',      label:'步数',       type:'number',  ph:'如 14582' },
      { key:'screenshot', label:'运动截图',   type:'image', hidden:true },   // 由上方 OCR 区上传并回填
      { key:'note',       label:'备注',       type:'textarea' }
    ]
  },
  meal: {
    title:'好好吃饭', icon:'🍱', daily:true, storageKey:'lifeapp_meal',
    fields:[
      { key:'date',     label:'日期',   type:'date', defaultToday:true },
      { key:'meal',     label:'餐次',   type:'text',     ph:'早餐 / 午餐 / 晚餐' },
      { key:'food',     label:'吃了什么', type:'textarea', ph:'菜品…' },
      { key:'image',    label:'配图',     type:'image' }
    ]
  },
  account: {
    title:'每日记账', icon:'🐷', daily:true, storageKey:'lifeapp_account',
    fields:[
      { key:'category', label:'类别', type:'text',     ph:'餐饮 / 交通 / 购物' },
      { key:'amount',   label:'金额', type:'number',   ph:'金额' },
      { key:'note',     label:'备注', type:'textarea' }
    ]
  },
  daily: {
    title:'每日计划', icon:'🌈', daily:true, storageKey:'lifeapp_daily', notepad:true,
    fields:[
      { key:'text', label:'计划内容', type:'text',     ph:'今天要做的事' },
      { key:'done', label:'已完成',   type:'checkbox' }
    ]
  },
  year: {
    title:'年度计划', icon:'🌟', daily:false, storageKey:'lifeapp_year',
    fields:[
      { key:'text', label:'年度目标', type:'text',     ph:'今年想完成的事' },
      { key:'done', label:'已完成',   type:'checkbox' }
    ]
  },
  idea: {
    title:'今日灵感', icon:'✨', daily:true, storageKey:'lifeapp_idea',
    fields:[
      { key:'text',  label:'灵感文字', type:'textarea', ph:'突然想到的点子…' },
      { key:'image', label:'配图',     type:'image' }
    ]
  },
  review: {
    title:'每日复盘', icon:'🌜', daily:true, storageKey:'lifeapp_review',
    fields:[
      { key:'mood',     label:'今日心情', type:'text',     ph:'开心 / 一般 / 累' },
      { key:'summary',  label:'今日总结', type:'textarea', ph:'今天怎么样' },
      { key:'tomorrow', label:'明天打算', type:'textarea', ph:'明天做点啥' }
    ]
  }
};

// 左侧导航项：今日概览 + 所有模块
const NAV = [{ key:'home', icon:'🏡', title:'今日概览' }].concat(
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

// 左侧导航高亮当前项
function renderNav() {
  const cur = currentHash();
  $('#nav').innerHTML = NAV.map(n => `
    <a href="#/${n.key}" class="nav-item ${cur === n.key ? 'active' : ''}">
      <span class="nav-icon">${n.icon}</span>
      <span class="nav-text">${n.title}</span>
    </a>`).join('');
}

// ---------- 天气卡片（定位 + Open-Meteo 免费接口，无需密钥） ----------
// 定位总开关：false = 固定显示广州（开发/预览阶段，不弹定位）；
// 装到手机上当真·App 后改成 true，即自动改用手机定位的城市。
const USE_PHONE_LOCATION = false;
const FALLBACK_LOC = { lat:23.1291, lon:113.2644, city:'广州' }; // 定位失败回退广州
const WMO = {
  0:'晴 ☀️',1:'大致晴朗 🌤️',2:'局部多云 ⛅',3:'阴 ☁️',45:'雾 🌫️',48:'雾凇 🌫️',
  51:'毛毛雨 🌦️',53:'毛毛雨 🌦️',55:'毛毛雨 🌦️',56:'冻毛雨 🌧️',57:'冻毛雨 🌧️',
  61:'小雨 🌧️',63:'中雨 🌧️',65:'大雨 🌧️',66:'冻雨 🌧️',67:'冻雨 🌧️',
  71:'小雪 🌨️',73:'中雪 🌨️',75:'大雪 🌨️',77:'雪粒 🌨️',
  80:'阵雨 🌦️',81:'阵雨 🌧️',82:'强阵雨 🌧️',85:'阵雪 🌨️',86:'强阵雪 🌨️',
  95:'雷阵雨 ⛈️',96:'雷阵雨 ⛈️',99:'雷阵雨 ⛈️'
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
    return { city, temp:null, humidity:null, condition, dayLabel, bestWindow:'—', note:'天气数据暂不可用' };
  }

  // 目标日期：今天 or 明天（本地时区 YYYY-MM-DD）
  const target = new Date();
  if (forTomorrow) target.setDate(target.getDate() + 1);
  const targetDate = `${target.getFullYear()}-${pad2(target.getMonth()+1)}-${pad2(target.getDate())}`;

  const nowH = new Date().getHours();
  const minH = forTomorrow ? 5 : Math.max(5, nowH);  // 明天从早5点起；今天从当前小时起
  const rows = [];
  for (let i = 0; i < times.length; i++) {
    if (times[i].slice(0,10) !== targetDate) continue;
    const hh = parseInt(times[i].slice(11,13), 10);
    if (hh < minH || hh > 21) continue;               // 只看 5–21 点
    rows.push({ hh, temp:temps[i], hum:hums[i], pop:pops[i] ?? 0 });
  }

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
    return { city, temp, humidity, condition, dayLabel, bestWindow:'—', note:'明日预报数据暂不可用，稍后再看' };
  }
  if (runs.length) {
    runs.sort((a,b) => (b[1]-b[0]) - (a[1]-a[0]));   // 最长舒适窗口优先
    const [s,e] = runs[0];
    const win = rows.filter(r => r.hh >= s && r.hh <= e);
    const avgT = win.reduce((a,r)=>a+r.temp,0) / win.length;
    const avgH = win.reduce((a,r)=>a+r.hum,0) / win.length;
    return { city, temp, humidity, condition, dayLabel,
      bestWindow: `${fmtH(s)}–${fmtH(e)}`,
      note: `气温约 ${Math.round(avgT)}℃、湿度 ${Math.round(avgH)}%，体感舒适，适合户外跑` };
  }
  // 无理想窗口：挑综合最佳单小时
  let best = rows[0];
  for (const r of rows) {
    const sc = Math.abs(r.temp-20) + r.hum/20 + r.pop/10;
    const bs = Math.abs(best.temp-20) + best.hum/20 + best.pop/10;
    if (sc < bs) best = r;
  }
  return { city, temp, humidity, condition, dayLabel,
    bestWindow: fmtH(best.hh),
    note: `${dayLabel}条件一般（${Math.round(best.temp)}℃ / 湿度${Math.round(best.hum)}%），这是相对最适宜的时段` };
}

function renderWeatherInner(d) {
  if (!d) return `<div class="wx-loading">🌤️ 正在获取当地天气…</div>`;
  if (d.error) return `<div class="wx-error">⚠️ 天气获取失败，请检查网络</div>`;
  const t = (d.temp === null || d.temp === undefined) ? '—' : Math.round(d.temp) + '°';
  const h = (d.humidity === null || d.humidity === undefined) ? '—' : Math.round(d.humidity) + '%';
  return `
    <div class="wx-topline">
      <span class="wx-city">📍 ${escapeHtml(d.city || '当地')}</span>
      <span class="wx-temp">${t}</span>
      <span class="wx-cond">${d.condition}</span>
      <span class="wx-hum">💧 湿度 ${h}</span>
    </div>
    <div class="wx-run">
      <div class="wx-run-line">
        <span class="wx-run-title">🏃 ${d.dayLabel || '今日'}最佳户外跑步时段</span>
        <span class="wx-run-time">${d.bestWindow}</span>
      </div>
      <div class="wx-run-note">${d.note}</div>
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
  } catch (e) {
    const c2 = $('#weatherCard');
    if (c2) c2.innerHTML = `<div class="wx-error">⚠️ 天气获取失败，请检查网络</div>`;
  }
}

// ---------- 概览（桌面/首页）：时间 + 天气 + 今日打卡 ----------
function renderHome() {
  // 今日打卡只统计部分每日模块（灵感/复盘不计入打卡）
  const EXCLUDE_FROM_CHECKIN = ['idea', 'review'];
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
    return `<a href="#/${key}" class="check-row ${ok ? 'done' : ''}">
      <span class="box ${ok ? 'checked' : ''}">${ok ? '✓' : ''}</span>
      <span class="row-title">${m.title}</span>
    </a>`;
  }).join('');

  return `
    <div class="hero">
      <div class="hero-greet">👋 今天也要加油呀</div>
      <div id="clock" class="clock"></div>
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

    ${renderIdeaCard()}`;
}

// 首页「每日灵感」便签卡片
function renderIdeaCard() {
  const list = load('lifeapp_idea');
  const todayList = list.filter(r => r.date === today());
  const n = todayList.length;
  const latest = todayList[0];   // 最新一条排在最前
  let body;
  if (latest) {
    const txt = (latest.text || '').slice(0, 60) || '（只有一张图）';
    body = `<div class="idea-text">${escapeHtml(txt)}</div>`
         + (latest.image ? `<div class="idea-thumb"><img src="${latest.image}" alt="灵感配图"></div>` : '');
  } else {
    body = `<div class="idea-empty">✏️ 点此随手记一条灵感…</div>`;
  }
  return `
    <div class="idea-card" id="ideaCard" role="button" tabindex="0">
      <div class="idea-head"><span>✨ 每日灵感</span><span class="idea-count">今日 ${n} 条</span></div>
      <div class="idea-body">${body}</div>
      <button class="idea-write" id="ideaWriteBtn" type="button">✏️ 写灵感</button>
    </div>`;
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
  const wb = $('#ideaWriteBtn');
  if (wb) wb.addEventListener('click', e => { e.stopPropagation(); openIdeaModal(); });
  // 点卡片主体也能打开便签
  const card = $('#ideaCard');
  if (card) card.addEventListener('click', () => openIdeaModal());
}
function tickClock() {
  const el = $('#clock');
  if (!el) return;
  const d = new Date();
  const week = ['周日','周一','周二','周三','周四','周五','周六'][d.getDay()];
  const pad = n => String(n).padStart(2, '0');
  el.innerHTML = `
    <div class="clock-time">${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}</div>
    <div class="clock-date">${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 ${week}</div>`;
}

// ---------- 模块页：表单 + 列表 ----------
function renderModule(key) {
  const m = MODULES[key];
  const list = load(m.storageKey);
  const formHtml  = m.fields.map(fieldHTML).join('');
  const itemsHtml = list.map(item => itemHTML(m, item)).join('')
                   || '<p class="empty">还没有记录，添加第一条吧～</p>';
  // 每日模块提供「清空今日」按钮，实现每日重置
  const resetBtn = m.daily
    ? `<button id="reset-today" class="btn-reset">🧹 清空今日</button>` : '';
  // 模块附加上方：跳转到外部 App 的按钮 + 今日汇总
  let extra = '';
  if (m.launch) {
    extra += `<a class="btn-launch" href="${m.launch.url}" target="_blank" rel="noopener">${m.launch.label}</a>`;
  }
  if (m.dailySummary) {
    const todayList = list.filter(r => r.date === today());
    const parts = m.dailySummary.map(s => {
      const sum = todayList.reduce((a, r) => a + (Number(r[s.key]) || 0), 0);
      return `${s.label} <b>${sum}</b>${s.unit || ''}`;
    }).join(' · ');
    extra += `<div class="mod-summary">📊 今日：${parts || '还没有记录'}</div>`;
  }
  // 运动截图 OCR（仅配置了 ocr 的模块，如锻炼身体）
  let ocrHtml = '';
  if (m.ocr) {
    ocrHtml = `
      <div class="ocr-box">
        <div class="ocr-head">📷 上传运动截图自动识别</div>
        <p class="ocr-hint">${escapeHtml(m.ocr.hint || '')}</p>
        <div class="ocr-bar">
          <input type="file" id="workoutImg" class="ocr-input" accept="image/*">
          <button id="ocrBtn" class="btn-primary" type="button">🔍 识别截图</button>
        </div>
        <div id="ocrStatus" class="ocr-status"></div>
      </div>`;
  }
  // 周计划（仅配置了 weeklyPlan 的模块，如锻炼身体）
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
        <div class="wp-head">📅 本周计划</div>
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
          <button id="saveWeekPlan" class="btn-primary" type="button">💾 保存周计划</button>
          <button id="clearWeekPlan" class="btn-reset" type="button">🗑 清空</button>
        </div>
      </div>`;
  }
  // 身体数据（仅配置了 bodyData 的模块，如锻炼身体）—— 独立小日志
  let bodyHtml = '';
  if (m.bodyData) {
    const bd = m.bodyData;
    const blist = load(bd.storageKey);
    const bForm = bd.fields.map(fieldHTML).join('');
    const bItems = blist.map(it => itemHTML({ fields: bd.fields }, it)).join('')
                  || '<p class="empty">还没有身体数据记录</p>';
    bodyHtml = `
      <div class="bd-box">
        <div class="bd-head">${bd.head}</div>
        <form id="bd-form" class="add-form">
          ${bForm}
          <button type="submit" class="btn-primary">${bd.addLabel}</button>
        </form>
        <div class="list" id="bd-list">${bItems}</div>
      </div>`;
  }
  // 月度运动总结（仅配置了 monthlySummary 的模块，如锻炼身体）
  let monthHtml = '';
  if (m.monthlySummary) {
    const y = new Date().getFullYear();
    const mo = String(new Date().getMonth() + 1).padStart(2, '0');
    const prefix = `${y}-${mo}`;
    const monthList = list.filter(r => (r.date || '').startsWith(prefix));
    const count = monthList.length;
    const totalDist = monthList.reduce((a, r) => a + (Number(r.distance) || 0), 0);
    const totalMin = monthList.reduce((a, r) => a + parseDurationToMin(r.duration), 0);
    const totalCal = monthList.reduce((a, r) => a + (Number(r.calories) || 0), 0);
    const avgHr = monthList.filter(r => r.avgHr).length
      ? Math.round(monthList.reduce((a, r) => a + (Number(r.avgHr) || 0), 0) / monthList.filter(r => r.avgHr).length)
      : 0;
    const paces = monthList.map(r => parsePaceToSec(r.pace)).filter(s => s > 0);
    const avgPaceSec = paces.length ? Math.round(paces.reduce((a, b) => a + b, 0) / paces.length) : 0;
    const avgPace = avgPaceSec ? formatPace(avgPaceSec) : '—';
    const h = Math.floor(totalMin / 60), mn = totalMin % 60;
    const byDay = monthList.slice().sort((a, b) => (a.date > b.date ? 1 : -1)).map(r => {
      const d = r.date ? r.date.slice(8) : '--';
      return `<div class="ms-row"><span>${d}日</span><span>${r.type || '运动'}</span><span>${r.distance || 0}km</span><span>${r.duration || 0}min</span></div>`;
    }).join('') || '<p class="empty">本月还没有运动记录</p>';
    monthHtml = `
      <div class="month-box">
        <div class="month-head">📅 ${y}年${mo}月 运动总结</div>
        <div class="month-grid">
          <div class="month-cell"><b>${count}</b><span>运动次数</span></div>
          <div class="month-cell"><b>${totalDist.toFixed(1)}</b><span>总距离(km)</span></div>
          <div class="month-cell"><b>${h}h${mn}m</b><span>总时长</span></div>
          <div class="month-cell"><b>${Math.round(totalCal)}</b><span>总消耗(kcal)</span></div>
          <div class="month-cell"><b>${avgPace}</b><span>平均配速</span></div>
          <div class="month-cell"><b>${avgHr || '—'}</b><span>平均心率</span></div>
        </div>
        <div class="month-list">${byDay}</div>
      </div>`;
  }

  // 每日计划便签纸视图
  if (m.notepad) {
    const todayStr = today();
    const todayList = list.filter(r => r.date === todayStr)
      .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
    const npItems = todayList.map(it => `
      <div class="np-item ${it.done ? 'done' : ''}" data-id="${it.id}">
        <span class="np-check">${it.done ? '✓' : ''}</span>
        <span class="np-text">${escapeHtml(it.text || '')}</span>
        <button class="np-del" data-id="${it.id}">×</button>
      </div>
    `).join('') || '<div class="np-empty">今天还没有计划，添加一条吧～</div>';
    return `
      <h2 class="sec-title">${m.icon} ${m.title}</h2>
      ${extra}
      <div class="notepad">
        <div class="np-date">${todayStr}</div>
        <div class="np-meta">
          <div class="np-line"><span>FROM:</span><em>me</em></div>
          <div class="np-line"><span>TO:</span><em>myself</em></div>
        </div>
        <div class="np-list" id="np-list">${npItems}</div>
        <form id="np-add" class="np-add">
          <input type="text" name="text" placeholder="+ 添加今日计划" autocomplete="off">
          <button type="submit">添加</button>
        </form>
        <div class="np-tags">#我的一天 #工作日</div>
        ${resetBtn}
      </div>`;
  }

  return `
    <h2 class="sec-title">${m.icon} ${m.title}</h2>
    ${extra}
    ${ocrHtml}
    <form id="add-form" class="add-form">
      ${formHtml}
      <button type="submit" class="btn-primary">+ 添加</button>
      ${resetBtn}
    </form>
    <div class="list" id="list">${itemsHtml}</div>
    ${monthHtml}
    ${planHtml}
    ${bodyHtml}`;
}

function fieldHTML(f) {
  if (f.hidden) return `<input type="hidden" name="${f.key}" value="">`;
  if (f.type === 'textarea')
    return `<label>${f.label}<textarea name="${f.key}" placeholder="${f.ph||''}"></textarea></label>`;
  if (f.type === 'checkbox')
    return `<label class="cb"><input type="checkbox" name="${f.key}"> ${f.label}</label>`;
  if (f.type === 'image')
    return `<label>${f.label}<input type="file" name="${f.key}" accept="image/*"></label>`;
  if (f.type === 'date')
    return `<label>${f.label}<input name="${f.key}" type="date" value="${f.defaultToday ? today() : ''}"></label>`;
  return `<label>${f.label}<input name="${f.key}" type="${f.type}" placeholder="${f.ph||''}"></label>`;
}

function itemHTML(m, item) {
  const dateTag = item.date ? `<div class="item-date">📅 ${item.date}</div>` : '';
  const vals = m.fields.map(f => {
    const v = item[f.key];
    if (f.key === 'date') return '';   // 日期已在顶部 📅 行显示，避免重复
    if (f.type === 'checkbox')
      return `<span class="tag ${v?'on':''}">${f.label}${v?' ✓':''}</span>`;
    if (f.type === 'image')
      return (v && v.startsWith('data:image')) ? `<div><b>${f.label}:</b><br><img class="item-img" src="${v}" alt=""></div>` : '';
    return (v !== undefined && v !== '') ? `<div><b>${f.label}:</b> ${escapeHtml(v)}</div>` : '';
  }).join('');
  return `<div class="item">
    <div class="item-body">${dateTag}${vals}</div>
    <button class="btn-del" data-id="${item.id}">删除</button>
  </div>`;
}

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

  const addForm = $('#add-form');
  if (addForm) addForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = {};
    let userDate = null;                    // 用户手动选的日期（用于补记过去）
    for (const f of m.fields) {
      const el = e.target[f.key];
      if (!el) continue;
      if (f.type === 'image') {
        const file = el.files && el.files[0];
        data[f.key] = file ? await fileToDataURL(file) : '';
      } else if (f.type === 'checkbox') {
        data[f.key] = el.checked;
      } else {
        data[f.key] = el.value.trim();
        if (f.key === 'date') userDate = data[f.key];
      }
    }
    data.id = uid();
    if (m.daily) data.date = userDate || today();   // 填了日期用填的（补记），否则今天
    const arr = load(m.storageKey);
    arr.unshift(data);
    save(m.storageKey, arr);
    render();
  });

  bindDeletes('#list', m.storageKey);

  // 运动截图 OCR（仅配置了 ocr 的模块）
  if (m.ocr) {
    const ocrBtn = $('#ocrBtn');
    const ocrInput = $('#workoutImg');
    const ocrStatus = $('#ocrStatus');
    if (ocrBtn) ocrBtn.addEventListener('click', async () => {
      const file = ocrInput && ocrInput.files && ocrInput.files[0];
      if (!file) { if (ocrStatus) ocrStatus.textContent = '请先选择一张截图'; return; }
      if (typeof Tesseract === 'undefined') { if (ocrStatus) ocrStatus.textContent = 'OCR 脚本未加载，请检查网络后刷新'; return; }
      try {
        if (ocrStatus) ocrStatus.textContent = '⏳ 正在压缩图片…';
        const dataURL = await fileToDataURL(file);   // 压缩后的 base64

        if (ocrStatus) ocrStatus.textContent = '⏳ 正在初始化 OCR，首次需下载中文包（约 10MB）…';
        const worker = await Tesseract.createWorker('chi_sim', 1, {
          logger: m => {
            console.log('[tesseract]', m);
            if (!ocrStatus) return;
            const pct = m.progress ? `${(m.progress * 100).toFixed(0)}%` : '';
            if (m.status === 'loading language traineddata') ocrStatus.textContent = `⏳ 下载中文语言包 ${pct}`;
            else if (m.status === 'initializing api') ocrStatus.textContent = `⏳ 初始化识别引擎 ${pct}`;
            else if (m.status === 'recognizing text') ocrStatus.textContent = `⏳ 识别文字中 ${pct}`;
          }
        });

        if (ocrStatus) ocrStatus.textContent = '⏳ 正在识别文字…';
        const ret = await worker.recognize(dataURL);
        await worker.terminate();
        const parsed = parseWorkoutText(ret.data.text);
        // 回填表单
        Object.keys(parsed).forEach(k => {
          const el = document.querySelector(`[name="${k}"]`);
          if (el) el.value = parsed[k];
        });
        // 把截图本身也存到隐藏字段，和运动记录一起保存
        const shotEl = document.querySelector('[name="screenshot"]');
        if (shotEl) shotEl.value = dataURL;
        const filled = Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join('； ');
        if (ocrStatus) {
          const rawOneLine = ret.data.text.replace(/\n/g, ' | ');
          const rawPreview = rawOneLine.slice(0, 800);
          ocrStatus.innerHTML = '✅ 识别完成：' + (filled || '未解析到关键数据，请手动填写') +
            '<br><small style="opacity:.7;display:block;word-break:break-all;">原始：' + rawPreview + (rawOneLine.length > 800 ? '…' : '') + '</small>' +
            '<br><small><a href="javascript:void(0)" id="copyRawOcr" style="color:inherit;text-decoration:underline">复制完整原始文本</a></small>';
          const copyBtn = document.getElementById('copyRawOcr');
          if (copyBtn && navigator.clipboard) {
            copyBtn.addEventListener('click', () => {
              navigator.clipboard.writeText(ret.data.text).then(() => { copyBtn.textContent = '已复制'; });
            });
          }
        }
      } catch (err) {
        console.error('OCR error:', err);
        let detail = '未知错误';
        try {
          if (err === undefined) detail = 'undefined';
          else if (err === null) detail = 'null';
          else if (typeof err === 'string') detail = err;
          else detail = err.message || err.stack || (err.toString && err.toString()) || JSON.stringify(err) || '未知错误';
        } catch (e) {}
        const msg = '❌ 识别失败：' + detail;
        if (ocrStatus) ocrStatus.textContent = msg;
        alert(msg);
      }
    });
  }

  const rb = $('#reset-today');
  if (rb) rb.addEventListener('click', () => {
    if (!confirm(`确定清空今天在「${m.title}」的所有记录吗？`)) return;
    const arr = load(m.storageKey).filter(x => x.date !== today());
    save(m.storageKey, arr);
    render();
  });

  // 每日计划便签纸：点击行/复选框切换完成，点击 × 删除
  if (m.notepad) {
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
      arr.unshift({ id: uid(), text, done: false, date: today() });
      save(m.storageKey, arr);
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
      sp.textContent = '✅ 已保存';
      setTimeout(() => { sp.textContent = '💾 保存周计划'; }, 1200);
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
      cp.textContent = '✅ 已清空';
      setTimeout(() => { cp.textContent = '🗑 清空'; }, 1200);
    });
  }

  // 身体数据子日志（独立表单 + 独立删除）
  if (m.bodyData) {
    const bd = m.bodyData;
    const form = $('#bd-form');
    if (form) form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = {};
      let userDate = null;
      for (const f of bd.fields) {
        const el = e.target[f.key];
        if (!el) continue;
        if (f.type === 'image') {
          const file = el.files && el.files[0];
          data[f.key] = file ? await fileToDataURL(file) : '';
        } else if (f.type === 'checkbox') {
          data[f.key] = el.checked;
        } else {
          data[f.key] = el.value.trim();
          if (f.key === 'date') userDate = data[f.key];
        }
      }
      data.id = uid();
      data.date = userDate || today();
      const arr = load(bd.storageKey);
      arr.unshift(data);
      save(bd.storageKey, arr);
      render();
    });
    bindDeletes('#bd-list', bd.storageKey);
  }

}

// ---------- 抽屉（手机端） ----------
function openDrawer()  { $('.sidebar').classList.add('open');  $('#overlay').classList.add('show'); }
function closeDrawer() { $('.sidebar').classList.remove('open'); $('#overlay').classList.remove('show'); }

// ---------- 启动 ----------
window.addEventListener('hashchange', render);
window.addEventListener('load', () => {
  $('#menuBtn').addEventListener('click', openDrawer);
  $('#overlay').addEventListener('click', closeDrawer);
  // 侧边栏底部显示当前版本号，方便确认是否加载到最新版
  const foot = document.querySelector('.sidebar-foot');
  if (foot) foot.innerHTML = '数据仅存于本机 🔒 · ' + APP_VERSION +
    ' · <a href="javascript:void(0)" id="checkUpdate" style="color:inherit;text-decoration:underline">检查更新</a>';
  // 灵感便签弹窗事件（弹窗是静态的，只绑一次）
  $('#ideaModal').addEventListener('click', e => { if (e.target.id === 'ideaModal') closeIdeaModal(); });
  $('#noteCancel').addEventListener('click', closeIdeaModal);
  $('#noteSave').addEventListener('click', saveIdeaNote);
  $('#noteImg').addEventListener('change', onNoteImgChange);
  render();
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
