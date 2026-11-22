/* Muslim Daily — Phase A features: Hijri calendar, Ramadan timetable +
   downloads (CSV / ICS / print), prayer reminders, fitra, learn tab. */
'use strict';

/* ---------- Hijri helpers (shared: hijriParts / hijriMonthName live in app.js) ---------- */
function hijriMonthTitle(date) {
  const p = hijriParts(date);
  return hijriMonthName(p.m) + ' ' + p.y + ' AH';
}
function firstOfHijriMonth(date) {
  const p = hijriParts(date);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - (p.d - 1));
}

/* ---------- Hijri month calendar ---------- */
let calFirst = firstOfHijriMonth(new Date());
function renderCalendar() {
  /* Hijri grid */
  const startParts = hijriParts(calFirst);
  const startWeekday = calFirst.getDay();
  let cells = '', d = new Date(calFirst), guard = 0;
  const todayStr = new Date().toDateString();
  while (hijriParts(d).m === startParts.m && guard++ < 31) {
    const hp = hijriParts(d);
    const isToday = d.toDateString() === todayStr;
    cells += `<div class="hcell${isToday ? ' today' : ''}"><b>${hp.d}</b><span>${d.getDate()}</span></div>`;
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  }
  const blanks = '<div class="hcell empty"></div>'.repeat(startWeekday);
  $('hijriGrid').innerHTML = blanks + cells;
  $('hijriTitle').textContent = hijriMonthTitle(calFirst);
  renderRamadan();
}
$('calPrev').onclick = () => {
  const dayBefore = new Date(calFirst.getFullYear(), calFirst.getMonth(), calFirst.getDate() - 1);
  calFirst = firstOfHijriMonth(dayBefore); renderCalendar();
};
$('calNext').onclick = () => {
  let d = new Date(calFirst), guard = 0;
  while (hijriParts(d).m === hijriParts(calFirst).m && guard++ < 32) d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  calFirst = d; renderCalendar();
};

/* ---------- Ramadan timetable ---------- */
let ramadanRows = [];
function findRamadan() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const runs = []; let cur = null;
  for (let i = -35; i < 400; i++) {
    const d = new Date(today.getTime() + i * 864e5);
    const p = hijriParts(d);
    if (p.m === 9) { if (!cur) cur = []; cur.push({ date: d, hday: p.d }); }
    else if (cur) { runs.push(cur); cur = null; }
  }
  if (cur) runs.push(cur);
  const tStr = today.toDateString();
  const run = runs.find(r => r.some(x => x.date.toDateString() === tStr)) ||
              runs.find(r => r[r.length - 1].date >= today) || runs[runs.length - 1] || [];
  return run.map(x => {
    const tt = PrayTimes.getTimes(x.date, loc.lat, loc.lng, loc.tz, method, asrFactor);
    return { date: x.date, day: x.hday, fajr: tt.Fajr, maghrib: tt.Maghrib, fajrMins: tt.Fajr_mins, maghribMins: tt.Maghrib_mins };
  });
}
function renderRamadan() {
  ramadanRows = findRamadan();
  const body = ramadanRows.map(r =>
    `<tr><td>${r.day}</td><td>${r.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', weekday: 'short' })}</td><td>${r.fajr}</td><td>${r.maghrib}</td></tr>`
  ).join('');
  $('ramadanBody').innerHTML = body;
  $('ramadanLoc').textContent = loc.name;
}
function downloadFile(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
$('dlCsv').onclick = () => {
  const rows = [['Day', 'Date', 'Sehri Ends (Fajr)', 'Iftar (Maghrib)']]
    .concat(ramadanRows.map(r => [r.day, r.date.toISOString().slice(0, 10), r.fajr, r.maghrib]));
  downloadFile('ramadan-timetable-' + loc.name.split(',')[0].replace(/\s+/g, '-') + '.csv',
    rows.map(r => r.join(',')).join('\n'), 'text/csv');
};
$('dlIcs').onclick = () => {
  const stamp = (date, mins) => {
    const dt = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, mins || 0);
    const p = n => String(n).padStart(2, '0');
    return dt.getFullYear() + p(dt.getMonth() + 1) + p(dt.getDate()) + 'T' + p(dt.getHours()) + p(dt.getMinutes()) + '00';
  };
  let ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Muslim Daily//Ramadan//EN\r\n';
  ramadanRows.forEach((r, i) => {
    [['Sehri ends (Fajr)', r.fajrMins, 10], ['Iftar (Maghrib)', r.maghribMins, 30]].forEach(([label, mins, dur], j) => {
      ics += 'BEGIN:VEVENT\r\nUID:md-' + i + '-' + j + '@muslimdaily\r\nDTSTART:' + stamp(r.date, mins) +
             '\r\nDTEND:' + stamp(r.date, (mins || 0) + dur) + '\r\nSUMMARY:' + label + ' — Ramadan day ' + r.day +
             '\r\nBEGIN:VALARM\r\nTRIGGER:-PT15M\r\nACTION:DISPLAY\r\nEND:VALARM\r\nEND:VEVENT\r\n';
    });
  });
  ics += 'END:VCALENDAR\r\n';
  downloadFile('ramadan-reminders.ics', ics, 'text/calendar');
};
$('printRamadan').onclick = () => window.print();

/* ---------- Prayer reminders (while app is open/installed) ---------- */
let remindSet = store.get('remind', { Fajr: true, Dhuhr: false, Asr: false, Maghrib: true, Isha: false });
document.querySelectorAll('.remindChk').forEach(chk => {
  chk.checked = !!remindSet[chk.dataset.prayer];
  chk.onchange = () => { remindSet[chk.dataset.prayer] = chk.checked; store.set('remind', remindSet); };
});
$('notifBtn').onclick = async () => {
  if (!('Notification' in window)) { $('notifState').textContent = 'Notifications are not supported in this browser.'; return; }
  const res = await Notification.requestPermission();
  $('notifState').textContent = res === 'granted' ? '✅ Notifications enabled.' : 'Permission was not granted.';
};
setInterval(() => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const now = new Date();
  const tt = PrayTimes.getTimes(now, loc.lat, loc.lng, loc.tz, method, asrFactor);
  const key = now.toDateString();
  for (const k of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
    if (!remindSet[k] || tt[k + '_mins'] === null) continue;
    if (now.getHours() * 60 + now.getMinutes() === tt[k + '_mins'] && store.get('notified_' + k, '') !== key) {
      store.set('notified_' + k, key);
      new Notification('🕌 ' + k + ' — Muslim Daily', { body: 'It is time for ' + k + ' prayer (' + tt[k] + ').', icon: 'icon-192.png' });
    }
  }
}, 20000);

/* ---------- Fitra ---------- */
$('fCalc').onclick = () => {
  const qty = +$('fStaple').value, price = Math.max(0, +$('fPrice').value || 0);
  const persons = Math.max(1, +$('fPersons').value || 1);
  const fixed = Math.max(0, +$('fFixed').value || 0);
  let html = '';
  if (price > 0) html += 'By staple measure: <b>' + (qty * price * persons).toLocaleString(undefined, { maximumFractionDigits: 2 }) + '</b> for ' + persons + ' person(s).<br>';
  if (fixed > 0) html += 'By official per-person rate: <b>' + (fixed * persons).toLocaleString(undefined, { maximumFractionDigits: 2 }) + '</b> for ' + persons + ' person(s).';
  $('fResult').innerHTML = html || 'Enter a price or an official per-person rate.';
};

/* ---------- Learn tab ---------- */
function renderLearn() {
  $('alphaGrid').innerHTML = ALPHABET.map(a =>
    `<div class="alpha"><div class="alpha-l">${a[0]}</div><div class="alpha-n">${a[1]}</div><div class="small">${a[2]}</div></div>`).join('');
  $('wuduList').innerHTML = WUDU_STEPS.map(s => `<li>${s}</li>`).join('');
  $('prayList').innerHTML = PRAY_STEPS.map(s => `<li>${s}</li>`).join('');
  $('surahList').innerHTML = SHORT_SURAHS.map(s =>
    `<div class="dua-item"><h3>${s.n}</h3><div class="arabic">${s.ar}</div><div class="mean" style="font-size:15px;color:#333">${s.en}</div></div>`).join('');
}
renderLearn();
renderCalendar();
