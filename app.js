/* Muslim Daily — app logic */
'use strict';

const $ = id => document.getElementById(id);
const store = {
  get(k, d) { try { const v = localStorage.getItem('md_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('md_' + k, JSON.stringify(v)); } catch (e) {} }
};

let loc = store.get('loc', { name: CITIES[0][0], lat: CITIES[0][1], lng: CITIES[0][2], tz: CITIES[0][3] });
let method = store.get('method', 'Karachi');
let asrFactor = store.get('asr', 2);

/* ---------- Tabs ---------- */
document.querySelectorAll('nav.tabs button').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('nav.tabs button').forEach(x => x.classList.toggle('on', x === b));
    document.querySelectorAll('.tab').forEach(s => s.classList.toggle('on', s.id === 'tab-' + b.dataset.tab));
  };
});

/* ---------- Settings UI ---------- */
const citySel = $('citySel');
CITIES.forEach((c, i) => { const o = document.createElement('option'); o.value = i; o.textContent = c[0]; citySel.appendChild(o); });
const customOpt = document.createElement('option'); customOpt.value = 'custom'; customOpt.textContent = '📍 My GPS location'; citySel.appendChild(customOpt);
citySel.value = store.get('cityIdx', 0);
if (store.get('cityIdx', 0) === 'custom') citySel.value = 'custom';
citySel.onchange = () => {
  if (citySel.value === 'custom') { store.set('cityIdx', 'custom'); return; }
  const c = CITIES[+citySel.value];
  loc = { name: c[0], lat: c[1], lng: c[2], tz: c[3] };
  store.set('loc', loc); store.set('cityIdx', +citySel.value);
  renderAll();
};
const methodSel = $('methodSel');
Object.keys(PT_METHODS).forEach(k => { const o = document.createElement('option'); o.value = k; o.textContent = PT_METHODS[k].name; methodSel.appendChild(o); });
methodSel.value = method;
methodSel.onchange = () => { method = methodSel.value; store.set('method', method); renderAll(); };
$('asrSel').value = String(asrFactor);
$('asrSel').onchange = e => { asrFactor = +e.target.value; store.set('asr', asrFactor); renderAll(); };

$('geoBtn').onclick = () => {
  if (!navigator.geolocation) { $('locLabel').textContent = 'GPS is not available on this device.'; return; }
  $('locLabel').textContent = 'Locating…';
  navigator.geolocation.getCurrentPosition(p => {
    loc = { name: 'My GPS location', lat: p.coords.latitude, lng: p.coords.longitude, tz: -new Date().getTimezoneOffset() / 60 };
    store.set('loc', loc); store.set('cityIdx', 'custom'); citySel.value = 'custom';
    renderAll();
  }, () => { $('locLabel').textContent = 'Location permission was not granted. Pick a city instead.'; },
  { timeout: 10000 });
};

/* ---------- Hijri helpers (arithmetic names — some phones render Intl islamic month names wrongly) ---------- */
const _hf = new Intl.DateTimeFormat('en-u-ca-islamic', { day: 'numeric', month: 'numeric', year: 'numeric' });
function hijriParts(date) {
  const p = {};
  for (const part of _hf.formatToParts(date)) p[part.type] = +part.value;
  return { d: p.day, m: p.month, y: p.year };
}
const HIJRI_MONTHS = {
  en: ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Ula', 'Jumada al-Akhirah', 'Rajab', 'Shaban', 'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah'],
  bn: ['মহররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জুমাদাল উলা', 'জুমাদাল আখিরা', 'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ'],
  ar: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة']
};
function hijriMonthName(m) { return (HIJRI_MONTHS[LANG] || HIJRI_MONTHS.en)[m - 1] || ''; }
function hijriLong(date) { const p = hijriParts(date); return p.d + ' ' + hijriMonthName(p.m) + ' ' + p.y + ' AH'; }

/* ---------- Dates ---------- */
function renderDates() {
  const now = new Date();
  $('gregDate').textContent = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  try { $('hijriDate').textContent = hijriLong(now); } catch (e) { $('hijriDate').textContent = ''; }
}

/* ---------- Prayer times ---------- */
const ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
let todayTimes = null;

function renderPrayer() {
  const now = new Date();
  todayTimes = PrayTimes.getTimes(now, loc.lat, loc.lng, loc.tz, method, asrFactor);
  $('locLabel').textContent = 'Showing times for: ' + loc.name + ' (' + loc.lat.toFixed(3) + ', ' + loc.lng.toFixed(3) + ')';
  const nowMins = now.getHours() * 60 + now.getMinutes();
  let nextName = null;
  for (const k of ORDER) {
    if (k === 'Sunrise') continue;
    if (todayTimes[k + '_mins'] !== null && todayTimes[k + '_mins'] > nowMins) { nextName = k; break; }
  }
  if (!nextName) nextName = 'Fajr'; /* tomorrow */
  $('ptList').innerHTML = ORDER.map(k =>
    `<div class="pt-row${k === nextName && todayTimes[k + '_mins'] > nowMins ? ' next' : ''}"><span>${t(k)}</span><span>${todayTimes[k]}</span></div>`
  ).join('');
  updateCountdown();
}

function updateCountdown() {
  if (!todayTimes) return;
  const now = new Date();
  const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  let target = null, name = null;
  for (const k of ORDER) {
    if (k === 'Sunrise') continue;
    const m = todayTimes[k + '_mins'];
    if (m !== null && m * 60 > nowSec) { target = m * 60; name = k; break; }
  }
  if (target === null) {
    const tmr = PrayTimes.getTimes(new Date(now.getTime() + 864e5), loc.lat, loc.lng, loc.tz, method, asrFactor);
    target = 86400 + (tmr.Fajr_mins || 0) * 60; name = 'Fajr (' + t('tomorrow') + ')';
  } else {
    name = t(name).replace(/^\S+\s/, '');
  }
  const diff = target - nowSec;
  const h = Math.floor(diff / 3600), m = Math.floor((diff % 3600) / 60), s = diff % 60;
  $('nextPrayer').innerHTML = t('next') + ': <b>' + name + '</b> — <b>' +
    h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '</b>';
}

/* ---------- Qibla ---------- */
function renderQibla() {
  const b = PrayTimes.qibla(loc.lat, loc.lng);
  $('qiblaDeg').textContent = b.toFixed(1) + t('qibla_from');
  $('needle').style.transform = 'rotate(' + b + 'deg)';
  window._qiblaBearing = b;
}
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientationabsolute', e => {
    if (e.alpha === null || window._qiblaBearing === undefined) return;
    $('needle').style.transform = 'rotate(' + (window._qiblaBearing - (360 - e.alpha)) + 'deg)';
  }, true);
}

/* ---------- Daily verse & hadith ---------- */
function dayIndex(n) {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 864e5) % n;
}
function renderDaily() {
  const v = VERSES[dayIndex(VERSES.length)];
  $('verseText').textContent = '\u201C' + v.t + '\u201D';
  $('verseRef').textContent = '— ' + v.r;
  const h = HADITH[dayIndex(HADITH.length)];
  $('hadithText').textContent = '\u201C' + h.t + '\u201D';
  $('hadithRef').textContent = '— ' + h.r;
}

/* ---------- Names ---------- */
function renderNames(filter) {
  const f = (filter || '').toLowerCase();
  $('namesList').innerHTML = NAMES_99.map((n, i) =>
    (f && !(n[0].toLowerCase().includes(f) || n[1].toLowerCase().includes(f))) ? '' :
    `<div class="name-item"><b>${i + 1}. ${n[0]}</b> — ${n[1]}</div>`
  ).join('') || '<p class="small">No name matches your search.</p>';
}
$('nameSearch').oninput = e => renderNames(e.target.value);

/* ---------- Duas ---------- */
function renderDuas() {
  $('duasList').innerHTML = DUAS.map(d =>
    `<div class="dua-item"><h3>${d.t}</h3><div class="arabic">${d.ar}</div><div class="trans">${d.tr}</div><div class="mean">${d.en}</div></div>`
  ).join('');
}

/* ---------- Tasbih ---------- */
let tCount = 0, tRounds = 0, tTotal = 0, tTarget = 33;
function renderTasbih() {
  $('tCount').textContent = tCount;
  $('tRounds').textContent = tRounds;
  $('tTotal').textContent = tTotal;
  $('tTargetLabel').textContent = tTarget;
}
$('tasbihBtn').onclick = () => {
  tCount++; tTotal++;
  if (tCount >= tTarget) {
    tCount = 0; tRounds++;
    if (navigator.vibrate) navigator.vibrate(120);
  }
  renderTasbih();
};
document.querySelectorAll('[data-target]').forEach(b => b.onclick = () => { tTarget = +b.dataset.target; renderTasbih(); });
$('tReset').onclick = () => { tCount = 0; tRounds = 0; tTotal = 0; renderTasbih(); };

/* ---------- Zakat ---------- */
$('zCalc').onclick = () => {
  const v = id => Math.max(0, +$(id).value || 0);
  const net = v('zCash') + v('zGold') + v('zSilver') + v('zBiz') + v('zOwed') - v('zDebt');
  const nisab = v('zNisab');
  const zakat = net * 0.025;
  let html = 'Net zakatable wealth: <b>' + net.toLocaleString() + '</b><br>';
  if (net <= 0) html += 'No zakat is due.';
  else if (nisab > 0 && net < nisab) html += 'Below the nisab (' + nisab.toLocaleString() + ') — <b>no zakat is due</b>.';
  else html += 'Zakat due (2.5%): <b style="color:#085a40;font-size:20px">' + zakat.toLocaleString(undefined, { maximumFractionDigits: 2 }) + '</b>' +
    (nisab === 0 ? '<br><span class="small">Note: set the nisab above to check whether zakat is obligatory for you.</span>' : '');
  $('zResult').innerHTML = html;
};

/* ---------- Language ---------- */
const langSel = $('langSel');
LANG = store.get('lang', 'en');
langSel.value = LANG;
langSel.onchange = () => { store.set('lang', langSel.value); applyLang(langSel.value); };

/* ---------- Init ---------- */
function renderAll() { renderDates(); renderPrayer(); renderQibla(); }
renderAll(); renderDaily(); renderNames(''); renderDuas(); renderTasbih();
applyLang(LANG);
setInterval(updateCountdown, 1000);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
