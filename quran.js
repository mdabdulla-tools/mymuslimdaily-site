/* Muslim Daily — Quran reader + audio (Phase B).
   Source: AlQuran Cloud API (free, no key) — Uthmani Arabic text,
   Saheeh International (EN), Muhiuddin Khan (BN), Alafasy audio per ayah.
   Loaded surahs are cached in localStorage for offline re-reading. */
'use strict';

const Q_API = 'https://api.alquran.cloud/v1';
let qSurahs = null, qAudio = null, qPlaying = -1, qAyahsCache = null;

async function quranInit() {
  const sel = $('surahSel');
  try {
    const cached = store.get('quran_meta', null);
    if (cached) { qSurahs = cached; }
    else {
      const r = await fetch(Q_API + '/surah');
      const j = await r.json();
      qSurahs = j.data;
      store.set('quran_meta', qSurahs);
    }
    sel.innerHTML = qSurahs.map(s =>
      `<option value="${s.number}">${s.number}. ${s.englishName} — ${s.englishNameTranslation} (${s.numberOfAyahs} ayahs)</option>`).join('');
    $('quranState').textContent = '';
    loadSurah(1);
  } catch (e) {
    $('quranState').textContent = 'Quran needs an internet connection for the first load. Please connect and reopen the app.';
  }
}

async function loadSurah(num) {
  const box = $('ayahList');
  box.innerHTML = '<p class="small">Loading…</p>';
  stopAudio();
  const cacheKey = 'surah_' + num;
  let data = store.get(cacheKey, null);
  if (!data) {
    try {
      const r = await fetch(Q_API + '/surah/' + num + '/editions/quran-uthmani,en.sahih,bn.bengali,ar.alafasy');
      const j = await r.json();
      data = j.data;
      store.set(cacheKey, data);
    } catch (e) {
      box.innerHTML = '<p class="small">Could not load this surah. Check your internet connection and try again.</p>';
      return;
    }
  }
  qAyahsCache = data;
  renderAyahs();
}

function renderAyahs() {
  if (!qAyahsCache) return;
  const [uth, en, bn, audio] = qAyahsCache;
  const showTr = $('trChk').checked;
  $('ayahList').innerHTML = uth.ayahs.map((a, i) => {
    const tr = LANG === 'bn' ? bn.ayahs[i].text : en.ayahs[i].text;
    return `<div class="ayah" id="ayah-${i}">
      <div class="arabic">${a.text} <span class="ayah-num">﴿${a.numberInSurah}﴾</span></div>
      ${showTr && LANG !== 'ar' ? `<div class="mean" style="font-size:15px;color:#333">${tr}</div>` : ''}
      <button class="ghost ayah-play" data-i="${i}">▶ Play ayah ${a.numberInSurah}</button>
    </div>`;
  }).join('');
  document.querySelectorAll('.ayah-play').forEach(b => b.onclick = () => playAyah(+b.dataset.i));
}

function stopAudio() {
  if (qAudio) { qAudio.pause(); qAudio = null; }
  qPlaying = -1;
  document.querySelectorAll('.ayah').forEach(el => el.classList.remove('playing'));
}
function playAyah(i) {
  if (!qAyahsCache) return;
  const audioEd = qAyahsCache[3];
  if (i >= audioEd.ayahs.length) { stopAudio(); return; }
  stopAudio();
  qPlaying = i;
  const el = $('ayah-' + i);
  if (el) { el.classList.add('playing'); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  qAudio = new Audio(audioEd.ayahs[i].audio);
  qAudio.onended = () => { if ($('autoChk').checked) playAyah(i + 1); else stopAudio(); };
  qAudio.onerror = () => stopAudio();
  qAudio.play().catch(() => stopAudio());
}
$('surahSel').onchange = e => loadSurah(+e.target.value);
$('trChk').onchange = renderAyahs;
$('playAllBtn').onclick = () => playAyah(0);
$('stopBtn').onclick = stopAudio;
quranInit();
