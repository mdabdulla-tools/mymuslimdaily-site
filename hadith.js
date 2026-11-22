/* Muslim Daily — Hadith library (Phase B).
   Source: fawazahmed0/hadith-api via jsDelivr CDN (free, no key).
   Books: Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasai, Ibn Majah.
   Languages follow the app language: Arabic / English / Bengali editions.
   Fetched sections are cached in localStorage for offline re-reading. */
'use strict';

const H_BOOKS = [
  ['bukhari', 'Sahih al-Bukhari'], ['muslim', 'Sahih Muslim'],
  ['abudawud', 'Sunan Abu Dawud'], ['tirmidhi', "Jami' at-Tirmidhi"],
  ['nasai', "Sunan an-Nasa'i"], ['ibnmajah', 'Sunan Ibn Majah']
];
const H_CDN = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/';
let hSections = null;

function hEdition(book) {
  const prefix = LANG === 'bn' ? 'ben' : LANG === 'ar' ? 'ara' : 'eng';
  return prefix + '-' + book;
}
async function hFetch(url, cacheKey) {
  const cached = store.get(cacheKey, null);
  if (cached) return cached;
  const r = await fetch(url);
  if (!r.ok) throw new Error('fetch failed');
  const j = await r.json();
  store.set(cacheKey, j);
  return j;
}
async function loadHadithSections() {
  const book = $('bookSel').value;
  const ed = hEdition(book);
  $('hadithState').textContent = 'Loading sections…';
  $('sectionSel').innerHTML = '';
  $('hadithList').innerHTML = '';
  try {
    const j = await hFetch(H_CDN + ed + '/1.json', 'hadith_' + ed + '_1');
    hSections = j.metadata.section;
    $('sectionSel').innerHTML = Object.keys(hSections).map(n =>
      `<option value="${n}">${n}. ${hSections[n]}</option>`).join('');
    $('hadithState').textContent = '';
    loadHadithSection();
  } catch (e) {
    $('hadithState').textContent = 'Hadith library needs an internet connection for the first load of each book.';
  }
}
async function loadHadithSection() {
  const book = $('bookSel').value;
  const ed = hEdition(book);
  const sec = $('sectionSel').value || '1';
  $('hadithList').innerHTML = '<p class="small">Loading…</p>';
  try {
    const j = await hFetch(H_CDN + ed + '/' + sec + '.json', 'hadith_' + ed + '_' + sec);
    $('hadithList').innerHTML = j.hadiths.map(h =>
      `<div class="dua-item"><h3>Hadith ${h.hadithnumber}</h3><div style="line-height:1.65;${LANG === 'ar' ? 'direction:rtl;text-align:right;font-size:18px' : ''}">${h.text}</div>` +
      (h.grades && h.grades.length ? `<div class="small">${h.grades.map(g => (g.name || '') + ': ' + (g.grade || '')).join(' · ')}</div>` : '') +
      '</div>').join('') || '<p class="small">No hadiths found in this section.</p>';
  } catch (e) {
    $('hadithList').innerHTML = '<p class="small">Could not load this section. Check your connection and try again.</p>';
  }
}
$('bookSel').innerHTML = H_BOOKS.map(b => `<option value="${b[0]}">${b[1]}</option>`).join('');
$('bookSel').onchange = loadHadithSections;
$('sectionSel').onchange = loadHadithSection;
loadHadithSections();
