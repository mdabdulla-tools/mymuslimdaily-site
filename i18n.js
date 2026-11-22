/* Muslim Daily — UI language strings: English, Bangla, Arabic.
   Applies to interface chrome (tabs, headings, prayer names, buttons).
   Religious content (Quran, duas) keeps its Arabic + English translation. */
'use strict';

const I18N = {
  en: {
    tagline: 'Prayer times · Qibla · Duas · Tasbih · 99 Names',
    tab_prayer: '🕌 Prayer', tab_calendar: '📅 Calendar', tab_qibla: '🧭 Qibla',
    tab_learn: '📖 Learn', tab_names: '✨ Names', tab_duas: '🤲 Duas',
    tab_quran: '📖 Quran', tab_hadith: '📚 Hadith',
    quran_h: '📖 Al-Quran — read & listen', hadith_h: '📚 Hadith library',
    tab_tasbih: '📿 Tasbih', tab_zakat: '💰 Zakat',
    location: '📍 Location & settings', gps: '📍 Use my location (GPS)',
    method: 'Calculation method', asr: 'Asr school',
    asr_hanafi: 'Hanafi', asr_shafi: "Shafi'i / Maliki / Hanbali",
    today: "🕋 Today's prayer times",
    fasting_note: 'Fasting: Sehri ends at Fajr · Iftar at Maghrib. Times are astronomical calculations — your local mosque may differ by a few minutes.',
    verse: '📖 Verse of the day', hadith: '🕊️ Hadith of the day',
    next: 'Next prayer', tomorrow: 'tomorrow',
    Fajr: '🌅 Fajr', Sunrise: '☀️ Sunrise', Dhuhr: '🌞 Dhuhr', Asr: '🌤️ Asr', Maghrib: '🌇 Maghrib', Isha: '🌙 Isha',
    reminders: '🔔 Prayer reminders', reminders_note: 'Notifications work while the app is open or installed. For permanent phone alarms, download the Ramadan ICS file from the Calendar tab and import it into your calendar app.',
    enable_notif: 'Enable notifications',
    hijri_cal: '📅 Hijri calendar', ramadan: '🌙 Ramadan timetable',
    ramadan_note: 'Sehri ends at Fajr · Iftar at Maghrib. Dates follow the calculated Hijri calendar; the actual start of Ramadan depends on moon sighting in your country.',
    download_csv: '⬇️ Download CSV', download_ics: '⬇️ Download ICS (calendar reminders)', print: '🖨️ Print / Save PDF',
    day: 'Day', date: 'Date', sehri: 'Sehri ends (Fajr)', iftar: 'Iftar (Maghrib)',
    qibla_h: '🧭 Qibla direction', qibla_from: '° from North',
    names_h: '✨ 99 Names of Allah', search_names: 'Search a name or meaning…',
    duas_h: '🤲 Daily duas',
    tasbih_h: '📿 Tasbih counter', tap: 'Tap to count', target: 'Target', rounds: 'Rounds', total: 'Total', reset: 'Reset',
    zakat_h: '💰 Zakat calculator', fitra_h: '🌾 Fitra (Zakat al-Fitr) calculator',
    learn_h: '📖 Learn the basics', alphabet: 'Arabic alphabet', wudu: 'How to make wudu', pray: 'How to pray (2 rak\'ah)', surahs: 'Short surahs for prayer'
  },
  bn: {
    tagline: 'নামাজের সময় · কিবলা · দোয়া · তসবিহ · ৯৯ নাম',
    tab_prayer: '🕌 নামাজ', tab_calendar: '📅 ক্যালেন্ডার', tab_qibla: '🧭 কিবলা',
    tab_learn: '📖 শিক্ষা', tab_names: '✨ নামসমূহ', tab_duas: '🤲 দোয়া',
    tab_quran: '📖 কুরআন', tab_hadith: '📚 হাদিস',
    quran_h: '📖 আল-কুরআন — পড়ুন ও শুনুন', hadith_h: '📚 হাদিস লাইব্রেরি',
    tab_tasbih: '📿 তসবিহ', tab_zakat: '💰 যাকাত',
    location: '📍 লোকেশন ও সেটিংস', gps: '📍 আমার লোকেশন ব্যবহার করুন (GPS)',
    method: 'হিসাবের পদ্ধতি', asr: 'আসরের মাযহাব',
    asr_hanafi: 'হানাফি', asr_shafi: 'শাফেয়ী / মালিকী / হাম্বলী',
    today: '🕋 আজকের নামাজের সময়',
    fasting_note: 'রোজা: সাহরি শেষ ফজরে · ইফতার মাগরিবে। সময়গুলো জ্যোতির্বিজ্ঞানের হিসাবে — স্থানীয় মসজিদের সাথে কয়েক মিনিট পার্থক্য হতে পারে।',
    verse: '📖 আজকের আয়াত', hadith: '🕊️ আজকের হাদিস',
    next: 'পরবর্তী নামাজ', tomorrow: 'আগামীকাল',
    Fajr: '🌅 ফজর', Sunrise: '☀️ সূর্যোদয়', Dhuhr: '🌞 যোহর', Asr: '🌤️ আসর', Maghrib: '🌇 মাগরিব', Isha: '🌙 এশা',
    reminders: '🔔 নামাজের রিমাইন্ডার', reminders_note: 'অ্যাপ খোলা বা ইনস্টল থাকলে নোটিফিকেশন কাজ করবে। স্থায়ী অ্যালার্মের জন্য ক্যালেন্ডার ট্যাব থেকে রমজানের ICS ফাইল ডাউনলোড করে ফোনের ক্যালেন্ডারে ইম্পোর্ট করুন।',
    enable_notif: 'নোটিফিকেশন চালু করুন',
    hijri_cal: '📅 হিজরি ক্যালেন্ডার', ramadan: '🌙 রমজানের সময়সূচি',
    ramadan_note: 'সাহরি শেষ ফজরে · ইফতার মাগরিবে। তারিখ হিসাবকৃত হিজরি ক্যালেন্ডার অনুযায়ী; রমজান শুরুর প্রকৃত তারিখ আপনার দেশের চাঁদ দেখার উপর নির্ভর করে।',
    download_csv: '⬇️ CSV ডাউনলোড', download_ics: '⬇️ ICS ডাউনলোড (ক্যালেন্ডার রিমাইন্ডার)', print: '🖨️ প্রিন্ট / PDF সেভ',
    day: 'রোজা', date: 'তারিখ', sehri: 'সাহরি শেষ (ফজর)', iftar: 'ইফতার (মাগরিব)',
    qibla_h: '🧭 কিবলার দিক', qibla_from: '° উত্তর থেকে',
    names_h: '✨ আল্লাহর ৯৯ নাম', search_names: 'নাম বা অর্থ খুঁজুন…',
    duas_h: '🤲 দৈনন্দিন দোয়া',
    tasbih_h: '📿 তসবিহ কাউন্টার', tap: 'গণনার জন্য চাপ দিন', target: 'লক্ষ্য', rounds: 'রাউন্ড', total: 'মোট', reset: 'রিসেট',
    zakat_h: '💰 যাকাত ক্যালকুলেটর', fitra_h: '🌾 ফিতরা ক্যালকুলেটর',
    learn_h: '📖 ইসলামের মৌলিক শিক্ষা', alphabet: 'আরবি বর্ণমালা', wudu: 'ওজু করার নিয়ম', pray: 'নামাজ পড়ার নিয়ম (২ রাকাত)', surahs: 'নামাজের ছোট সূরা'
  },
  ar: {
    tagline: 'مواقيت الصلاة · القبلة · الأدعية · التسبيح · الأسماء الحسنى',
    tab_prayer: '🕌 الصلاة', tab_calendar: '📅 التقويم', tab_qibla: '🧭 القبلة',
    tab_learn: '📖 تعلّم', tab_names: '✨ الأسماء', tab_duas: '🤲 الأدعية',
    tab_quran: '📖 القرآن', tab_hadith: '📚 الحديث',
    quran_h: '📖 القرآن الكريم — قراءة واستماع', hadith_h: '📚 مكتبة الحديث',
    tab_tasbih: '📿 التسبيح', tab_zakat: '💰 الزكاة',
    location: '📍 الموقع والإعدادات', gps: '📍 استخدم موقعي (GPS)',
    method: 'طريقة الحساب', asr: 'مذهب العصر',
    asr_hanafi: 'حنفي', asr_shafi: 'شافعي / مالكي / حنبلي',
    today: '🕋 مواقيت صلاة اليوم',
    fasting_note: 'الصيام: ينتهي السحور عند الفجر · والإفطار عند المغرب. المواقيت محسوبة فلكيًا — قد تختلف عن مسجدك المحلي بضع دقائق.',
    verse: '📖 آية اليوم', hadith: '🕊️ حديث اليوم',
    next: 'الصلاة القادمة', tomorrow: 'غدًا',
    Fajr: '🌅 الفجر', Sunrise: '☀️ الشروق', Dhuhr: '🌞 الظهر', Asr: '🌤️ العصر', Maghrib: '🌇 المغرب', Isha: '🌙 العشاء',
    reminders: '🔔 تذكير بالصلاة', reminders_note: 'تعمل الإشعارات أثناء فتح التطبيق أو تثبيته. للتنبيهات الدائمة، نزّل ملف ICS الخاص برمضان من تبويب التقويم واستورده إلى تطبيق التقويم.',
    enable_notif: 'تفعيل الإشعارات',
    hijri_cal: '📅 التقويم الهجري', ramadan: '🌙 جدول رمضان',
    ramadan_note: 'ينتهي السحور عند الفجر · والإفطار عند المغرب. التواريخ وفق التقويم الهجري المحسوب؛ وبداية رمضان الفعلية تعتمد على رؤية الهلال في بلدك.',
    download_csv: '⬇️ تنزيل CSV', download_ics: '⬇️ تنزيل ICS (تذكير التقويم)', print: '🖨️ طباعة / حفظ PDF',
    day: 'اليوم', date: 'التاريخ', sehri: 'نهاية السحور (الفجر)', iftar: 'الإفطار (المغرب)',
    qibla_h: '🧭 اتجاه القبلة', qibla_from: '° من الشمال',
    names_h: '✨ أسماء الله الحسنى', search_names: 'ابحث باسم أو معنى…',
    duas_h: '🤲 أدعية يومية',
    tasbih_h: '📿 عدّاد التسبيح', tap: 'اضغط للعدّ', target: 'الهدف', rounds: 'الجولات', total: 'المجموع', reset: 'إعادة',
    zakat_h: '💰 حاسبة الزكاة', fitra_h: '🌾 حاسبة زكاة الفطر',
    learn_h: '📖 تعلّم الأساسيات', alphabet: 'الحروف العربية', wudu: 'كيفية الوضوء', pray: 'كيفية الصلاة (ركعتان)', surahs: 'سور قصيرة للصلاة'
  }
};

let LANG = 'en';
function t(key) { return (I18N[LANG] && I18N[LANG][key]) || I18N.en[key] || key; }
function applyLang(lang) {
  LANG = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  const ns = document.getElementById('nameSearch');
  if (ns) ns.placeholder = t('search_names');
  if (typeof renderAll === 'function') renderAll();
  if (typeof renderCalendar === 'function') renderCalendar();
}
