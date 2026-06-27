/* Anker · Burnout-Prädiktor (lokal, kein Server, kein Tracking)

   Modell-Übersicht:
   - Signale: Akku (Ampel), Energie, Schlaf (Dauer + Qualität), Reizlast,
              Soziale Last, Masking-Stunden, Stress, Frühwarnzeichen-Anzahl.
   - Baseline: rollierende Mittelwert/Streuung (Welford-Algorithmus).
              Nur Nicht-Crash-Tage fließen ein (letzte 120 Tage).
   - Allostatic Load: kumulativer Akkumulator mit exponentiellem Abfall.
              Faktor 0.84/Tag → Halbwertszeit ≈ 4 Tage.
   - Trend: lineare Regression über die letzten 14 Tage.
   - Risiko-Score 0–100: Load (max 70 Punkte) + Trend-Bonus (max 30).
   - Projektion: "in ~X Tagen Rot", wenn Trend anhält.
   - Online-Lernen: Logistisches Gradient-Update der Signal-Gewichte bei
              Crash-Tag-Labels → Modell lernt, welche Signale bei DIESER
              Person Vorboten sind.

   Garmin-Integration (Datei-Import):
   CSV/JSON aus Garmin Connect Bulk-Export: Body Battery → akku-Mapping,
   Schlaf → sleepH/sleepQ, Stress 0–100 → stress 1–5, HRV + Ruhepuls gespeichert.

   Live-Sync-Hinweis: Eine Echtzeit-Anbindung an die Garmin Health API
   erfordert eine Partnergenehmigung, Backend-Server und OAuth-Handshake –
   nicht implementiert. Alle Daten im log-Objekt sind quellen-agnostisch;
   manuelle und importierte Werte verwenden dieselben Felder.
   Einstiegspunkt für künftige Live-Sync: _applyGarminEntry() befüllen,
   Daten direkt in state.log[date] schreiben, dann renderEnergyTab() aufrufen.
*/
window.ANKER_PRED = (function(){
"use strict";

const SIG = [
  "akku","energy","sleepH","sleepQ",
  "irritation","socialLoad","maskingH","stress","warnCount"
];

/* Normierung: alle Signale → 0 (entspannt) bis 1 (maximal belastet) */
function norm(name, val){
  if(val == null || val === "") return null;
  switch(name){
    case "akku":       return { g:0, y:0.45, r:1 }[val] ?? null;
    case "energy":     return { voll:0, mittel:0.28, wenig:0.65, leer:1 }[val] ?? null;
    case "sleepH":     return Math.max(0, Math.min(1, (9 - Math.max(0, +val)) / 7));
    case "sleepQ":     return (5 - Math.max(1, Math.min(5, +val))) / 4;
    case "irritation": return (Math.max(1, Math.min(5, +val)) - 1) / 4;
    case "socialLoad": return (Math.max(1, Math.min(5, +val)) - 1) / 4;
    case "maskingH":   return Math.min(1, Math.max(0, +val) / 10);
    case "stress":     return (Math.max(1, Math.min(5, +val)) - 1) / 4;
    case "warnCount":  return Math.min(1, Math.max(0, +val) / 5);
    default: return null;
  }
}

function sigFromRec(rec){
  if(!rec) return null;
  const warnCount = Array.isArray(rec.warn) ? rec.warn.length : 0;
  const s = {};
  SIG.forEach(k => {
    s[k] = k === "warnCount" ? norm(k, warnCount) : norm(k, rec[k]);
  });
  return s;
}

/* Welford-Online-Algorithmus: rollierender Mittelwert + Varianz */
function welfordUpdate(s, x){
  if(!s) s = { n:0, mean:0, M2:0 };
  const n1   = s.n + 1;
  const d    = x - s.mean;
  const mean = s.mean + d / n1;
  return { n: n1, mean, M2: s.M2 + d * (x - mean) };
}
function welfordSD(s){ return (s && s.n > 1) ? Math.sqrt(s.M2 / (s.n - 1)) : 0.33; }

/* Baseline aus Log (ohne Crash-Tage, letzte 120 Tage) */
function rebuildBaseline(log){
  const bl = {};
  Object.keys(log).sort().slice(-120).forEach(date => {
    const rec = log[date];
    if(!rec || rec.isCrash) return;
    const s = sigFromRec(rec);
    if(!s) return;
    SIG.forEach(k => { if(s[k] != null) bl[k] = welfordUpdate(bl[k], s[k]); });
  });
  return bl;
}

/* Tages-Belastungs-Score (0–1) relativ zur persönlichen Baseline */
function dayStrain(sig, bl, W){
  let sum = 0, wsum = 0;
  SIG.forEach(k => {
    const v = sig[k]; if(v == null) return;
    const mu     = bl[k] ? bl[k].mean : 0.38;
    const sd     = Math.max(0.08, welfordSD(bl[k]));
    const z      = Math.max(0, (v - mu) / sd);
    const strain = Math.min(1, z / 2.5);
    const w      = (W && W[k] != null) ? Math.max(0.1, W[k]) : 1;
    sum  += strain * w;
    wsum += w;
  });
  return wsum > 0 ? sum / wsum : 0;
}

/* Allostatic Load: exponentiell abbauende Kumulation */
function computeLoad(log, bl, W){
  const DECAY = 0.84;
  let load = 0;
  Object.keys(log).sort().slice(-60).forEach(date => {
    load *= DECAY;
    const s = sigFromRec(log[date]);
    if(s) load += dayStrain(s, bl, W);
  });
  return Math.max(0, load);
}

/* Lineare Regression für Trend-Steigung */
function linRegSlope(arr){
  const n = arr.length;
  if(n < 3) return 0;
  let sx=0, sy=0, sxy=0, sx2=0;
  arr.forEach((y, i) => { sx += i; sy += y; sxy += i*y; sx2 += i*i; });
  return (n*sxy - sx*sy) / (n*sx2 - sx*sx + 1e-9);
}

/* Haupt-Risiko-Score (0–100) + Metadaten */
function computeRisk(log, predState){
  const bl = predState.baseline || {};
  const W  = predState.weights  || {};
  const LOAD_MAX = 7;

  const load      = computeLoad(log, bl, W);
  const loadScore = Math.min(100, (load / LOAD_MAX) * 70);

  const last14   = Object.keys(log).sort().slice(-14);
  const trendArr = last14.map(d => {
    const s = sigFromRec(log[d]);
    return s ? dayStrain(s, bl, W) * 100 : null;
  }).filter(x => x != null);

  const slope      = linRegSlope(trendArr);
  const trendBonus = Math.min(30, Math.max(-20, slope * 2.5));
  const score      = Math.max(0, Math.min(100, Math.round(loadScore + trendBonus)));

  let projDays = null;
  if(slope > 0.7 && score < 78){
    const d = Math.round((78 - score) / slope);
    if(d >= 1 && d <= 28) projDays = d;
  }

  const todayDate = new Date().toISOString().slice(0,10);
  const todaySig  = sigFromRec(log[todayDate]);
  const drivers   = [];
  if(todaySig){
    SIG.forEach(k => {
      const v = todaySig[k]; if(v == null) return;
      const mu = bl[k] ? bl[k].mean : 0.38;
      const sd = Math.max(0.08, welfordSD(bl[k]));
      const z  = (v - mu) / sd;
      if(z > 0.65) drivers.push({ k, z });
    });
    drivers.sort((a,b) => b.z - a.z);
  }

  const level = score < 30 ? "ok"
              : score < 52 ? "low"
              : score < 70 ? "medium"
              : score < 86 ? "high"
              : "critical";

  return { score, level, drivers: drivers.slice(0,4), projDays, slope, load };
}

/* Online-Lernen: Gradient-Update der Gewichte bei Crash-Label */
function learnFromCrash(log, predState, crashDate){
  const LR = 0.1;
  const bl = predState.baseline || {};
  const W  = Object.assign({}, predState.weights || {});

  const posKeys = [crashDate];
  const prev = new Date(crashDate);
  prev.setDate(prev.getDate() - 1);
  posKeys.push(prev.toISOString().slice(0,10));

  const negKeys = Object.keys(log)
    .filter(k => !log[k].isCrash && !posKeys.includes(k))
    .slice(-18);

  function gradStep(rec, target){
    const s = sigFromRec(rec); if(!s) return;
    SIG.forEach(k => {
      const v = s[k]; if(v == null) return;
      const mu   = bl[k] ? bl[k].mean : 0.38;
      const sd   = Math.max(0.08, welfordSD(bl[k]));
      const z    = Math.max(0, (v - mu) / sd) / 2.5;
      const w    = W[k] != null ? W[k] : 1;
      const pred = 1 / (1 + Math.exp(-w * z * 3));
      W[k] = Math.max(0.1, Math.min(6, w + LR * (target - pred) * z));
    });
  }

  posKeys.forEach(k => { if(log[k]) gradStep(log[k], 1); });
  negKeys.forEach(k => { if(log[k]) gradStep(log[k], 0); });
  return W;
}

/* Garmin Connect Bulk-Export importieren (CSV oder JSON) */
function importGarmin(text, filename, log){
  const isJson = /\.json$/i.test(filename);
  let imported = 0;
  const errors = [];

  function applyEntry(e, date){
    if(!log[date]) log[date] = { energy:null, akku:null, warn:[], isCrash:false };
    const r   = log[date];
    const flt = v => { const n = parseFloat(v); return isNaN(n) ? null : n; };
    const get = (...keys) => {
      for(const k of keys){
        const raw = e[k] != null ? e[k] : e[k.toLowerCase()] != null ? e[k.toLowerCase()] : null;
        const v   = flt(raw);
        if(v != null) return v;
      }
      return null;
    };

    const mark = f => { if(!r.garminFields) r.garminFields = []; if(r.garminFields.indexOf(f) < 0) r.garminFields.push(f); };

    const bb = get("bodyBattery","body battery (end of day)","body battery","bodybattery");
    if(bb != null){ r.garminBodyBattery = bb; if(!r.akku){ r.akku = bb >= 65 ? "g" : bb >= 40 ? "y" : "r"; mark("akku"); } }

    const sl = get("sleepTimeSeconds","sleep time (seconds)","sleep (seconds)");
    if(sl != null && !r.sleepH){ r.sleepH = Math.round(sl / 360) / 10; mark("sleepH"); }

    const ss = get("sleepScore","sleep score","sleep quality score");
    if(ss != null && !r.sleepQ){ r.sleepQ = Math.max(1, Math.min(5, Math.round(ss / 20))); mark("sleepQ"); }

    const hr = get("restingHeartRate","resting heart rate (bpm)","resting heart rate");
    if(hr != null) r.garminHR = hr;

    const st = get("averageStressLevel","average stress level","stress avg");
    if(st != null){ r.garminStress = st; if(!r.stress){ r.stress = Math.min(5, Math.max(1, Math.round(1 + st / 25))); mark("stress"); } }

    const hrv = get("avgOvernightHrv","avg overnight hrv","hrv");
    if(hrv != null) r.garminHRV = hrv;

    imported++;
  }

  if(isJson){
    let arr;
    try{ arr = JSON.parse(text); }
    catch(e){ errors.push("JSON-Fehler: " + e.message); return { imported, errors }; }
    if(!Array.isArray(arr)) arr = [arr];
    arr.forEach(e => {
      const date = (e.calendarDate || e.date || e.startTimeLocal || "").slice(0,10);
      if(/^\d{4}-\d{2}-\d{2}$/.test(date)) applyEntry(e, date);
    });
  } else {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if(lines.length < 2){ errors.push("Datei leer oder kein gültiges CSV"); return { imported, errors }; }
    const hdr = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g,"").toLowerCase());
    lines.slice(1).forEach(line => {
      const cols  = line.split(",").map(c => c.trim().replace(/^"|"$/g,""));
      const raw   = cols[hdr.indexOf("date")] || cols[hdr.indexOf("calendardate")] || cols[0] || "";
      const date  = raw.slice(0,10);
      if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
      const entry = {};
      hdr.forEach((h,i) => { entry[h] = cols[i]; });
      applyEntry(entry, date);
    });
  }
  return { imported, errors };
}

/* Verlauf-Daten für Chart (letzte N Tage) */
function getHistory(log, days, bl, W){
  const out = [];
  for(let k = days - 1; k >= 0; k--){
    const d = new Date(); d.setDate(d.getDate() - k);
    const date  = d.toISOString().slice(0,10);
    const rec   = log[date] || null;
    const s     = rec ? sigFromRec(rec) : null;
    const strain = s ? dayStrain(s, bl, W) : null;
    out.push({
      date,
      score:   strain != null ? Math.round(strain * 100) : null,
      isCrash: !!(rec && rec.isCrash),
      akku:    rec ? rec.akku : null,
    });
  }
  return out;
}

/* Langzeit-Muster erkennen (lesbare Einsichten, nur wenn genug Daten) */
function detectPatterns(log, predState){
  const bl = (predState && predState.baseline) || {};
  const W  = (predState && predState.weights)  || {};
  const out = [];

  const rows = Object.keys(log).sort().map(d => {
    const s = sigFromRec(log[d]);
    return { date:d, rec:log[d], strain: s ? dayStrain(s, bl, W) : null, sig:s };
  }).filter(r => r.strain != null);
  if(rows.length < 7) return out;

  const overall = rows.reduce((a,r)=>a+r.strain,0) / rows.length;

  // 1) Wochentags-Muster (höchste Durchschnittsbelastung)
  const wd = [[],[],[],[],[],[],[]];
  rows.forEach(r => wd[new Date(r.date).getDay()].push(r.strain));
  const DAYNAMES = ["sonntags","montags","dienstags","mittwochs","donnerstags","freitags","samstags"];
  let hiDay = -1, hiVal = -1;
  wd.forEach((a,i) => {
    if(a.length < 2) return;
    const avg = a.reduce((x,y)=>x+y,0)/a.length;
    if(avg > hiVal){ hiVal = avg; hiDay = i; }
  });
  if(hiDay >= 0 && hiVal > overall + 0.12){
    out.push({ icon:"📅", tone:"info",
      text:"Deine Belastung ist "+DAYNAMES[hiDay]+" im Schnitt am höchsten – plane dort bewusst weniger ein." });
  }

  // 2) Häufigste Vorboten (über die letzten Wochen erhöht)
  const counts = {};
  rows.slice(-42).forEach(r => {
    SIG.forEach(k => {
      const v = r.sig[k]; if(v == null) return;
      const mu = bl[k] ? bl[k].mean : 0.38;
      const sd = Math.max(0.08, welfordSD(bl[k]));
      if((v - mu) / sd > 0.65) counts[k] = (counts[k]||0) + 1;
    });
  });
  const top = Object.keys(counts).sort((a,b)=>counts[b]-counts[a]).slice(0,3);
  if(top.length >= 2){
    out.push({ icon:"🔁", tone:"info",
      text:"Deine häufigsten Vorboten zuletzt: "+top.map(driverLabel).join(", ")+"." });
  }

  // 3) Crash-Muster: durchschnittliche Erholungszeit
  const crashes = rows.filter(r => r.rec && r.rec.isCrash);
  if(crashes.length >= 2){
    const recos = [];
    crashes.forEach(c => {
      const idx = rows.findIndex(r => r.date === c.date);
      for(let j = idx+1; j < rows.length; j++){
        if(rows[j].strain <= overall){ recos.push(j - idx); break; }
      }
    });
    if(recos.length){
      const avg = Math.round(recos.reduce((a,b)=>a+b,0)/recos.length);
      out.push({ icon:"🌱", tone:"info",
        text:"Nach einem Crash-Tag dauert es bei dir im Schnitt etwa "+avg+" Tag"+(avg===1?"":"e")+", bis sich dein Wert wieder beruhigt." });
    }
  }

  // 4) Stärkster persönlich gelernter Vorbote
  let bestK = null, bestV = 1.3;
  Object.keys(W).forEach(k => { if(W[k] > bestV){ bestV = W[k]; bestK = k; } });
  if(bestK){
    out.push({ icon:"🧠", tone:"learn",
      text:"Dein stärkster persönlicher Vorbote ist: "+driverLabel(bestK)+". Darauf lohnt es sich besonders zu achten." });
  }

  return out;
}

/* Tages-Aufschlüsselung: was wurde eingetragen, woher, wie belastend */
const SIG_META = {
  akku:       { label:"Akku",           fmt:v=>({g:"Grün",y:"Gelb",r:"Rot"}[v]||v) },
  energy:     { label:"Energie",        fmt:v=>({voll:"Viel",mittel:"Mittel",wenig:"Wenig",leer:"Leer"}[v]||v) },
  sleepH:     { label:"Schlaf",         fmt:v=>String(v).replace(".",",")+" h" },
  sleepQ:     { label:"Schlafqualität", fmt:v=>["–","Schlecht","Eher schwach","Ok","Gut","Sehr gut"][Math.round(v)]||v },
  irritation: { label:"Reizlast",       fmt:v=>["–","Gering","Leicht","Mittel","Hoch","Extrem"][Math.round(v)]||v },
  socialLoad: { label:"Soziale Last",   fmt:v=>["–","Kaum","Etwas","Mittel","Viel","Erschöpft"][Math.round(v)]||v },
  maskingH:   { label:"Masking",        fmt:v=>(+v)+" h" },
  stress:     { label:"Stress",         fmt:v=>["–","Gering","Leicht","Mittel","Hoch","Extrem"][Math.round(v)]||v }
};

function explainDay(date, log, predState){
  const rec = log ? log[date] : null;
  if(!rec) return { date, has:false };
  const bl = (predState && predState.baseline) || {};
  const W  = (predState && predState.weights)  || {};
  const sig = sigFromRec(rec);
  const strain = sig ? Math.round(dayStrain(sig, bl, W) * 100) : null;
  const level  = strain == null ? null : strain < 34 ? "ruhig" : strain < 64 ? "mittel" : "hoch";

  const gf = Array.isArray(rec.garminFields) ? rec.garminFields : [];
  function relOf(k){
    const v = sig ? sig[k] : null; if(v == null) return null;
    const mu = bl[k] ? bl[k].mean : 0.38, sd = Math.max(0.08, welfordSD(bl[k]));
    const z = (v - mu) / sd; return z > 0.65 ? "hoch" : z < -0.65 ? "niedrig" : "normal";
  }

  const rows = [];
  let anyGarmin = false, anyManual = false;
  Object.keys(SIG_META).forEach(k => {
    const raw = rec[k]; if(raw == null || raw === "") return;
    const src = gf.indexOf(k) >= 0 ? "garmin" : "manuell";
    if(src === "garmin") anyGarmin = true; else anyManual = true;
    let note = "";
    if(k === "akku"   && rec.garminBodyBattery != null) note = "Body Battery " + rec.garminBodyBattery;
    if(k === "stress" && rec.garminStress      != null) note = "Garmin " + rec.garminStress + "/100";
    rows.push({ k, label:SIG_META[k].label, value:SIG_META[k].fmt(raw), rel:relOf(k), src, note });
  });
  const warns = Array.isArray(rec.warn) ? rec.warn : [];
  if(warns.length){ anyManual = true; rows.push({ k:"warnCount", label:"Frühwarnzeichen", value:warns.join(", "), rel:relOf("warnCount"), src:"manuell", note:"" }); }

  const source  = (anyGarmin && anyManual) ? "gemischt" : anyGarmin ? "garmin" : anyManual ? "manuell" : null;
  const drivers = rows.filter(r => r.rel === "hoch").map(r => r.label);
  return { date, has:true, strain, level, source, rows, drivers, isCrash: !!rec.isCrash };
}

const DRIVER_LABELS = {
  akku:       "niedriger Akku",
  energy:     "wenig Energie",
  sleepH:     "wenig Schlaf",
  sleepQ:     "schlechter Schlaf",
  irritation: "hohe Reizlast",
  socialLoad: "hohe soz. Last",
  maskingH:   "viel Masking",
  stress:     "hoher Stress",
  warnCount:  "Frühwarnzeichen",
};
function driverLabel(k){ return DRIVER_LABELS[k] || k; }

return { computeRisk, rebuildBaseline, learnFromCrash, importGarmin, getHistory, detectPatterns, explainDay, driverLabel, SIG };
})();
