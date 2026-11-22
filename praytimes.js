/* Muslim Daily — prayer time calculation (standard solar method, as used by
   PrayTimes-style algorithms). All computation is local; no API calls. */
'use strict';

const PT_METHODS = {
  MWL:     { name: 'Muslim World League',        fajr: 18,   isha: 17 },
  ISNA:    { name: 'ISNA (North America)',       fajr: 15,   isha: 15 },
  Egypt:   { name: 'Egyptian General Authority', fajr: 19.5, isha: 17.5 },
  Makkah:  { name: 'Umm al-Qura (Makkah)',       fajr: 18.5, isha: 90 }, /* isha = minutes after Maghrib */
  Karachi: { name: 'Univ. of Islamic Sciences, Karachi', fajr: 18, isha: 18 }
};

const PrayTimes = (() => {
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const sin = d => Math.sin(d * D2R), cos = d => Math.cos(d * D2R), tan = d => Math.tan(d * D2R);
  const asin = x => Math.asin(x) * R2D, acos = x => Math.acos(x) * R2D, atan2 = (y, x) => Math.atan2(y, x) * R2D;
  const fix = (a, b) => { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; };
  const fixangle = a => fix(a, 360), fixhour = a => fix(a, 24);

  function julian(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }

  /* Sun declination (deg) + equation of time (hours) for a Julian date. */
  function sunPosition(jd) {
    const dd = jd - 2451545.0;
    const g = fixangle(357.529 + 0.98560028 * dd);
    const q = fixangle(280.459 + 0.98564736 * dd);
    const L = fixangle(q + 1.915 * sin(g) + 0.020 * sin(2 * g));
    const e = 23.439 - 0.00000036 * dd;
    const RA = fixhour(atan2(cos(e) * sin(L), cos(L)) / 15);
    const decl = asin(sin(e) * sin(L));
    return { decl, eqt: q / 15 - RA };
  }

  function midDay(jd) { return fixhour(12 - sunPosition(jd).eqt); }

  /* Time at which the sun reaches angle `angle` below/above horizon. */
  function sunAngleTime(jd, lat, angle, dir) {
    const decl = sunPosition(jd).decl;
    const noon = midDay(jd);
    const x = (-sin(angle) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat));
    if (x < -1 || x > 1) return null; /* sun never reaches this angle */
    const t = acos(x) / 15;
    return dir === 'ccw' ? noon - t : noon + t;
  }

  function asrTime(jd, lat, factor) {
    const decl = sunPosition(jd).decl;
    const angle = -Math.atan(1 / (factor + tan(Math.abs(lat - decl)))) * R2D;
    return sunAngleTime(jd, lat, angle, 'cw');
  }

  function fmt(h) {
    if (h === null || isNaN(h)) return '--:--';
    h = fixhour(h + 0.5 / 60); /* round to nearest minute */
    const H = Math.floor(h), M = Math.floor((h - H) * 60);
    const ap = H >= 12 ? 'PM' : 'AM';
    const h12 = H % 12 === 0 ? 12 : H % 12;
    return h12 + ':' + String(M).padStart(2, '0') + ' ' + ap;
  }

  /**
   * getTimes(date, lat, lng, tzHours, methodKey, asrFactor)
   * tzHours: UTC offset of the place (hours). asrFactor: 1 Shafi'i, 2 Hanafi.
   * Returns {Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha} as formatted strings,
   * plus *_mins fields (minutes since midnight) for countdown logic.
   */
  function getTimes(date, lat, lng, tz, methodKey, asrFactor) {
    const m = PT_METHODS[methodKey] || PT_METHODS.MWL;
    const jd = julian(date.getFullYear(), date.getMonth() + 1, date.getDate()) - lng / (15 * 24);
    const adj = t => (t === null ? null : t + tz - lng / 15);
    const fajr = adj(sunAngleTime(jd, lat, m.fajr, 'ccw'));
    const sunrise = adj(sunAngleTime(jd, lat, 0.833, 'ccw'));
    const dhuhr = adj(midDay(jd));
    const asr = adj(asrTime(jd, lat, asrFactor));
    const maghrib = adj(sunAngleTime(jd, lat, 0.833, 'cw'));
    let isha;
    if (m.isha > 40) { /* minutes after Maghrib (Makkah) */
      isha = maghrib === null ? null : maghrib + m.isha / 60;
    } else {
      isha = adj(sunAngleTime(jd, lat, m.isha, 'cw'));
    }
    const out = {};
    const raw = { Fajr: fajr, Sunrise: sunrise, Dhuhr: dhuhr, Asr: asr, Maghrib: maghrib, Isha: isha };
    for (const k in raw) {
      out[k] = fmt(raw[k]);
      out[k + '_mins'] = raw[k] === null ? null : Math.round(fixhour(raw[k]) * 60);
    }
    return out;
  }

  /* Qibla bearing (degrees from true north) from a location to the Kaaba. */
  function qibla(lat, lng) {
    const kLat = 21.4225, kLng = 39.8262;
    const dLng = (kLng - lng) * D2R;
    const y = Math.sin(dLng);
    const x = Math.cos(lat * D2R) * Math.tan(kLat * D2R) - Math.sin(lat * D2R) * Math.cos(dLng);
    return fixangle(Math.atan2(y, x) * R2D);
  }

  return { getTimes, qibla, fmt };
})();
