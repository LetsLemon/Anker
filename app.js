/* Anker · App-Logik (local-first, kein Server, kein Tracking) */
(function(){
"use strict";

const DATA = window.ANKER_DATA;
const root = document.body;
const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

/* ---------- Speicher (nur auf diesem Gerät) ---------- */
const KEY = "anker_state_v1";
const todayKey = () => new Date().toISOString().slice(0,10);
const defaultState = () => ({
  settings: { dark:null, reduceMotion:null, sound:false, softStreak:true },
  done: {},            // lessonId -> true
  log: {},             // "YYYY-MM-DD" -> { energy, akku, warn:[] }
  activeDays: [],      // Liste der Tage mit Aktivität (sanfte Serie)
  lowDemand: { date:null },
  alltag: {},          // gespeicherte Alltags-Daten (z. B. Termin-Vorbereitung)
  read: {},            // Verstehen: cardId -> true (rein informativ, kein Streak/Zwang)
  customWarns: [],     // selbst hinzugefügte Frühwarnzeichen
  practice: [],        // [{id, date, ts, helped}] – welche Übung wann, wie hilfreich
  journal: [],         // [{ts, date, text, mood, prompt, energy}]
  profile: null,       // wird beim ersten Bearbeiten zu { name, subtitle, strengths, triggers, helps }
  predictor: null      // { baseline, weights, lastUpdated } – Burnout-Prädiktor-Zustand
});
let state = load();

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(raw){ return Object.assign(defaultState(), JSON.parse(raw)); }
  }catch(e){}
  return defaultState();
}
function save(){
  try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){}
}
function todayLog(){
  const d = todayKey();
  if(!state.log[d]) state.log[d] = {
    energy:null, akku:null, warn:[],
    sleepH:null, sleepQ:null, irritation:null,
    socialLoad:null, maskingH:null, stress:null, isCrash:false
  };
  return state.log[d];
}
function markActive(){
  const d = todayKey();
  if(!state.activeDays.includes(d)) state.activeDays.push(d);
}

/* ---------- Navigation ---------- */
const VIEWS = { pfad:"v-pfad", calm:"v-calm", alltag:"v-alltag", praxis:"v-praxis", energy:"v-energy", me:"v-me" };
function go(v, btn){
  $$(".view").forEach(e=>e.classList.remove("active"));
  $("#"+VIEWS[v]).classList.add("active");
  $$(".nav button").forEach(b=>b.classList.remove("on"));
  (btn || $('.nav button[data-go="'+v+'"]')).classList.add("on");
  $(".content").scrollTop = 0;
}
$$(".nav button").forEach(b=> b.addEventListener("click", ()=> go(b.dataset.go, b)));

/* ---------- Energie (heute) ---------- */
const eMap = { voll:"Viel 🔋", mittel:"Mittel", wenig:"Wenig", leer:"Leer" };
const eSub = {
  voll:"Heute ist Raum für etwas Neues – wenn du magst.",
  mittel:"Such dir eine kleine Sache aus. Reicht völlig.",
  wenig:"Nur das Nötige. Die Beruhigen-Tools sind da.",
  leer:"Schutzmodus. Heute zählt schon: da sein."
};
function setEnergy(k){
  todayLog().energy = k;
  markActive(); save();
  paintEnergy(); renderStreak(); renderEnergyTab();
}
function paintEnergy(){
  const k = todayLog().energy;
  $$(".epill").forEach(b=> b.classList.toggle("sel", b.dataset.energy===k));
  $("#energyVal").textContent = k ? eMap[k] : "Tippen →";
  $("#subgreet").textContent  = k ? eSub[k] : "Schön, dass du da bist. Kein Druck heute.";
}
$$(".epill").forEach(b=> b.addEventListener("click", ()=> setEnergy(b.dataset.energy)));

/* ---------- Sanfte Serie ---------- */
function renderStreak(){
  $("#streakVal").textContent = state.activeDays.length;
}

/* ---------- Pfad ---------- */
function lessonState(unitIdx, lessonIdx, unitUnlocked){
  const lesson = DATA.units[unitIdx].lessons[lessonIdx];
  if(state.done[lesson.id]) return "done";
  if(!unitUnlocked) return "lock";
  // erste noch offene Lektion dieser Einheit = "now"
  const firstOpen = DATA.units[unitIdx].lessons.findIndex(l=>!state.done[l.id]);
  return lessonIdx===firstOpen ? "now" : "open";
}
function unitDone(unitIdx){
  return DATA.units[unitIdx].lessons.every(l=> state.done[l.id]);
}
function renderPath(){
  const wrap = $("#pathContainer");
  wrap.innerHTML = "";
  DATA.units.forEach((unit, ui)=>{
    const unlocked = ui===0 || unitDone(ui-1);
    const doneCount = unit.lessons.filter(l=> state.done[l.id]).length;

    const u = document.createElement("div");
    u.className = "unit";
    const bar = document.createElement("div");
    bar.className = "unit-bar" + (unit.color==="amber"?" amber":unit.color==="coral"?" coral":"");
    bar.innerHTML = "<b>"+unit.title+"</b><span>"+doneCount+" / "+unit.lessons.length+"</span>";
    u.appendChild(bar);

    const pw = document.createElement("div");
    pw.className = "path-wrap";
    unit.lessons.forEach((lesson, li)=>{
      const st = lessonState(ui, li, unlocked);
      const row = document.createElement("div");
      row.className = "row";
      const node = document.createElement("button");
      node.className = "node "+st+(li%2 ? " r":"");
      node.innerHTML = lesson.icon + '<span class="lbl">'+lesson.label+(st==="now"?" · jetzt":"")+'</span>';
      if(st!=="lock"){ node.addEventListener("click", ()=> openLesson(ui, li)); }
      row.appendChild(node);
      pw.appendChild(row);
    });
    u.appendChild(pw);
    wrap.appendChild(u);
  });
}

/* ---------- Overlay-Grundgerüst ---------- */
const ov   = $("#overlay");
const ovBody = $("#ovBody");
const ovFoot = $("#ovFoot");
function openOverlay(title, showProgress){
  $("#ovTitle").textContent = title;
  $("#progWrap").style.display = showProgress ? "block" : "none";
  ov.classList.add("open");
}
function closeOverlay(){
  ov.classList.remove("open");
  stopBreath();
  pxStopBreath();
}
$("#ovClose").addEventListener("click", closeOverlay);

/* ---------- Lektions-Ablauf ---------- */
let steps = [], si = 0, curLesson = null;
function openLesson(ui, li){
  curLesson = DATA.units[ui].lessons[li];
  steps = curLesson.steps; si = 0;
  openOverlay(curLesson.title, true);
  renderStep();
}
function renderStep(){
  const s = steps[si];
  $("#prog").style.width = ((si+1)/steps.length*100)+"%";
  let html = "", next = "Weiter";

  if(s.type==="intro" || s.type==="info" || s.type==="reflect"){
    html = '<div class="big-emoji">'+(s.emoji||"💡")+'</div><div class="lead">'+s.lead+'</div><p class="muted">'+s.body+'</p>';
  }
  else if(s.type==="quiz"){
    html = '<div class="lead">'+s.q+'</div>'+
      s.opts.map(o=>'<button class="qopt" data-opt>'+o+'</button>').join('') +
      (s.multi ? '<p class="muted" style="margin-top:10px">Mehrere möglich – tippe alles an, was passt.</p>' : '')+
      '<textarea class="qfree" rows="2" placeholder="Oder in deinen eigenen Worten – ganz frei …"></textarea>';
  }
  else if(s.type==="plan"){
    html = '<div class="lead">'+s.lead+'</div><p class="muted">Dein „Wenn–dann"-Plan:</p>'+
      '<div class="card" style="margin-top:8px"><p style="color:var(--text);font-size:14px">'+s.body+'</p></div>'+
      '<p class="muted" style="margin-top:10px">Wenn–dann-Pläne machen Vornahmen viel wahrscheinlicher umsetzbar.</p>';
  }
  else if(s.type==="breath"){
    html = breathHTML();
  }
  else if(s.type==="ground"){
    html = groundHTML();
  }
  else if(s.type==="reward"){
    html = '<div class="reward"><div class="ring">🌱</div><div class="lead">Stark gemacht.</div>'+
      '<p class="muted">'+(s.note||"+1 Erkenntnis · deine Serie ist sicher.")+'<br>Kein Vergleich, kein Druck – nur du, ein Schritt weiter.</p></div>';
    next = "Fertig";
  }

  ovBody.innerHTML = html;
  ovFoot.innerHTML = '<button class="btn" data-next>'+next+'</button>'+
    (s.type!=="reward" ? '<button class="btn ghost" data-later style="margin-top:8px">Später</button>' : '');

  // Interaktionen verdrahten
  $$("[data-opt]", ovBody).forEach(b=> b.addEventListener("click", ()=>{
    if(s.multi){ b.classList.toggle("sel"); }
    else { $$("[data-opt]", ovBody).forEach(o=>o.classList.remove("sel")); b.classList.add("sel"); }
  }));
  if(s.type==="breath") wireBreath();
  $("[data-next]", ovFoot).addEventListener("click", nextStep);
  const later = $("[data-later]", ovFoot);
  if(later) later.addEventListener("click", closeOverlay);
}
function nextStep(){
  if(si < steps.length-1){ si++; stopBreath(); renderStep(); }
  else { completeLesson(); }
}
function completeLesson(){
  if(curLesson){ state.done[curLesson.id] = true; markActive(); save(); }
  closeOverlay();
  renderPath(); renderStreak(); renderAchievements();
}

/* ---------- Tools (Beruhigen) ---------- */
function breathHTML(){
  return '<div class="breath"><div class="bcircle" id="bc">Tipp auf Start</div>'+
         '<p class="note" id="bnote">4 ein · 4 halten · 4 aus · 4 halten</p></div>';
}
function groundHTML(){
  const rows = [["5","Dinge, die du siehst"],["4","Dinge, die du hörst"],["3","Dinge, die du fühlst"],["2","Dinge, die du riechst"],["1","Sache, die du schmeckst"]];
  return '<p class="muted">Benenne langsam, in deinem Tempo:</p>'+
    rows.map(x=>'<div class="card" style="margin-top:8px;display:flex;align-items:center;gap:12px"><b style="font-size:24px;color:var(--teal)">'+x[0]+'</b><span style="font-size:14px">'+x[1]+'</span></div>').join('');
}
function openTool(t){
  const T = DATA.tools[t];
  openOverlay(T.title, false);
  let html="", foot='<button class="btn ghost" data-close>Schließen</button>';

  if(t==="breath"){
    html = breathHTML();
    foot = '<button class="btn lav" data-start>Atmung starten</button><button class="btn ghost" data-close style="margin-top:8px">Schließen</button>';
  }
  else if(t==="ground"){
    html = groundHTML();
    foot = '<button class="btn" data-close>Fertig</button>';
  }
  else if(t==="sensory"){
    html = '<p class="muted">'+T.intro+'</p>'+ T.items.map(x=>'<button class="qopt" data-opt>'+x+'</button>').join('');
    foot = '<button class="btn" data-close>Fertig</button>';
  }
  else if(t==="stim"){
    html = '<div class="big-emoji">✋</div><div class="lead">'+T.lead+'</div><p class="muted">'+T.body+'</p>'+
      '<div style="margin-top:10px">'+T.items.map(x=>'<span class="tag lav">'+x+'</span>').join('')+'</div>';
  }
  else if(t==="sos"){
    html = T.cards.map((c,i)=>'<div class="card"'+(i===0?' style="border-color:var(--coral)"':'')+'><h3>'+c.h+'</h3><p>'+c.p+'</p></div>').join('');
  }

  ovBody.innerHTML = html;
  ovFoot.innerHTML = foot;
  $$("[data-opt]", ovBody).forEach(b=> b.addEventListener("click", ()=> b.classList.toggle("sel")));
  const cl = $("[data-close]", ovFoot); if(cl) cl.addEventListener("click", closeOverlay);
  const st = $("[data-start]", ovFoot); if(st){ wireBreath(); st.addEventListener("click", startBreath); }
}
$$("[data-tool]").forEach(b=> b.addEventListener("click", ()=> openTool(b.dataset.tool)));

/* ---------- Atmung ---------- */
let bTimer = null;
function wireBreath(){
  const bc = $("#bc"); if(bc) bc.addEventListener("click", startBreath);
}
function startBreath(){
  const bc = $("#bc"), note = $("#bnote"); if(!bc) return;
  const ph = ["Einatmen","Halten","Ausatmen","Halten"]; let i=0;
  clearInterval(bTimer);
  if(root.dataset.motion==="off"){
    bc.textContent = ph[0];
    if(note) note.textContent = "Ohne Animation · folge dem Wort";
  }else{
    bc.classList.add("run");
    bc.textContent = ph[0];
  }
  bTimer = setInterval(()=>{ i=(i+1)%4; bc.textContent = ph[i]; }, 4000);
}
function stopBreath(){
  clearInterval(bTimer);
  const bc = $("#bc"); if(bc) bc.classList.remove("run");
}

/* ---------- Energie-Tab: Ampel ---------- */
function paintAmp(){
  const a = todayLog().akku;
  $$(".amp").forEach(el=> el.classList.toggle("sel", el.dataset.amp===a));
  const sel = a ? $('.amp[data-amp="'+a+'"]') : null;
  $("#ampMsg").textContent = sel ? sel.dataset.msg : "";
}
$$(".amp").forEach(el=> el.addEventListener("click", ()=>{
  todayLog().akku = el.dataset.amp;
  markActive(); save();
  paintAmp(); renderStreak(); renderEnergyTab();
}));

/* ---------- Burnout-Prädiktor · Energie-Tab ---------- */
let _chartDays = 7;
let _mehrOpen  = false;

function ensurePredictor(){
  if(!state.predictor || typeof state.predictor !== "object")
    state.predictor = { baseline:{}, weights:{}, lastUpdated:null };
}

function rebuildPredBaseline(){
  ensurePredictor();
  const PRED = window.ANKER_PRED;
  if(!PRED) return;
  state.predictor.baseline = PRED.rebuildBaseline(state.log);
}

function renderEnergyTab(){
  rebuildPredBaseline();
  renderPredCard();
  renderPredChart(_chartDays);
  renderPredPatterns();
  _updateMehrHint();
}

function renderPredPatterns(){
  const el = $("#predPatterns"); if(!el) return;
  const PRED = window.ANKER_PRED; if(!PRED){ el.innerHTML = ""; return; }
  ensurePredictor();
  const pats = PRED.detectPatterns(state.log, state.predictor);
  if(!pats.length){
    el.innerHTML = '<p class="pred-empty">Wenn du ein paar Wochen Daten gesammelt hast, erkenne ich hier wiederkehrende Muster – z. B. schwierige Wochentage oder deine typischen Vorboten.</p>';
    return;
  }
  el.innerHTML = pats.map(p =>
    '<div class="pred-pattern '+(p.tone||"")+'"><span class="pp-ic">'+p.icon+'</span><p>'+esc(p.text)+'</p></div>'
  ).join('');
}

/* ---------- Daten einsehen: was zählt rein, woher kommt es ---------- */
const _WD = ["So","Mo","Di","Mi","Do","Fr","Sa"];
const _MON = ["Jan.","Feb.","März","Apr.","Mai","Juni","Juli","Aug.","Sep.","Okt.","Nov.","Dez."];
function fmtDay(d){ const x = new Date(d+"T00:00:00"); return _WD[x.getDay()]+", "+x.getDate()+". "+_MON[x.getMonth()]; }
function srcLabel(s){ return s==="garmin" ? "Garmin" : s==="gemischt" ? "Garmin + manuell" : "manuell"; }
const _LVLCOL = { ruhig:"var(--good)", mittel:"var(--warn)", hoch:"var(--bad)" };

function hasEntry(r){ return r && (r.akku || r.energy || r.sleepH!=null || r.sleepQ!=null || r.irritation!=null || r.socialLoad!=null || r.maskingH!=null || r.stress!=null || (Array.isArray(r.warn)&&r.warn.length)); }

function openDataOverview(){
  const PRED = window.ANKER_PRED; if(!PRED) return;
  ensurePredictor();
  openOverlay("Eingetragene Tage", false);
  const dates = Object.keys(state.log).filter(d => hasEntry(state.log[d])).sort().reverse().slice(0, 60);
  if(!dates.length){
    ovBody.innerHTML = '<p class="muted">Noch keine Einträge. Fülle den Tages-Check aus oder importiere Garmin-Daten – dann siehst du hier jeden Tag und seine Wirkung.</p>';
    alFootClose(); return;
  }
  ovBody.innerHTML = '<p class="muted" style="margin-bottom:8px">Tippe einen Tag an: Du siehst, was zählt – und woher die Werte kommen.</p>'+
    dates.map(d => {
      const e = PRED.explainDay(d, state.log, state.predictor);
      const col = _LVLCOL[e.level] || "var(--line)";
      return '<button class="dd-listrow" data-day="'+d+'">'+
        '<span class="dd-dot" style="background:'+col+'"></span>'+
        '<span class="dd-ld-date">'+fmtDay(d)+(e.isCrash?' ⚡':'')+'</span>'+
        '<span class="dd-ld-strain">'+(e.strain!=null?e.strain:'–')+'</span>'+
        (e.source ? '<span class="dd-src '+e.source+'">'+srcLabel(e.source)+'</span>' : '')+
        '<span class="dd-chev">›</span></button>';
    }).join('');
  $$("[data-day]", ovBody).forEach(b => b.addEventListener("click", () => openDayDetail(b.dataset.day)));
  alFootClose();
}

function openDayDetail(date){
  const PRED = window.ANKER_PRED; if(!PRED) return;
  ensurePredictor();
  const d = PRED.explainDay(date, state.log, state.predictor);
  openOverlay(fmtDay(date), false);
  if(!d.has){
    ovBody.innerHTML = '<p class="muted">Für diesen Tag ist nichts eingetragen.</p>';
    ovFoot.innerHTML = '<button class="btn ghost" data-ovback>‹ Zurück</button>';
    $("[data-ovback]", ovFoot).addEventListener("click", openDataOverview);
    return;
  }
  const col = _LVLCOL[d.level] || "var(--muted)";
  let html = '<div class="dd-head"><span class="dd-dot" style="width:13px;height:13px;background:'+col+'"></span>'+
    '<div><b>'+(d.strain!=null ? ('Belastung '+d.strain+' / 100') : '—')+'</b>'+
    '<div class="muted" style="font-size:12px">'+(d.level||'')+(d.source ? ' · '+srcLabel(d.source) : '')+(d.isCrash?' · ⚡ Crash-Tag':'')+'</div></div></div>';
  html += d.rows.map(r => {
    const relTag = (r.rel && r.rel!=="normal") ? '<span class="dd-rel '+r.rel+'">'+r.rel+'</span>' : '';
    const srcTag = '<span class="dd-src '+r.src+'">'+(r.src==="garmin"?"Garmin":"manuell")+'</span>';
    const note   = r.note ? '<span class="dd-note">'+esc(r.note)+'</span>' : '';
    return '<div class="dd-row"><span class="dd-lab">'+r.label+'</span>'+
      '<span class="dd-val">'+esc(String(r.value))+note+'</span>'+
      '<span class="dd-tags">'+relTag+srcTag+'</span></div>';
  }).join('');
  if(d.drivers.length) html += '<p class="muted" style="margin-top:12px">An diesem Tag erhöht: '+esc(d.drivers.join(", "))+'.</p>';
  html += '<p class="muted" style="margin-top:6px;font-size:12px">„hoch / niedrig" ist immer im Vergleich zu deinem eigenen Durchschnitt.</p>';
  ovBody.innerHTML = html;
  ovFoot.innerHTML = '<button class="btn ghost" data-ovback>‹ Zurück zur Liste</button>';
  $("[data-ovback]", ovFoot).addEventListener("click", openDataOverview);
}

$("#dataOverviewBtn").addEventListener("click", openDataOverview);

function _updateMehrHint(){
  const hint = $("#mehrHint"); if(!hint) return;
  const energy = todayLog().energy;
  if(energy === "voll" || energy === "mittel")
    hint.textContent = "– du hast heute mehr Energie";
  else
    hint.textContent = "";
}

/* Mehr-eintragen-Toggle */
$("#mehrBtn").addEventListener("click", ()=>{
  _mehrOpen = !_mehrOpen;
  const btn  = $("#mehrBtn");
  const form = $("#mehrForm");
  btn.classList.toggle("open", _mehrOpen);
  btn.firstChild.textContent = (_mehrOpen ? "▲" : "▼") + " Mehr eintragen ";
  if(_mehrOpen){ renderMehrForm(); form.style.maxHeight = "none"; }
  else { form.innerHTML = ""; form.style.maxHeight = "0"; }
});

function renderMehrForm(){
  const form = $("#mehrForm"); if(!form) return;
  const rec  = todayLog();

  function sigRow(label, field, opts){
    const cur  = rec[field];
    const btns = opts.map(([v,l]) =>
      `<button class="sigb${+v===+cur||v===cur?" sel":""}" data-sig="${field}" data-val="${v}">${l}</button>`
    ).join("");
    return `<div class="sig-row"><div class="sig-label">${label}</div><div class="sig-btns">${btns}</div></div>`;
  }

  let html = sigRow("Schlaf · Dauer", "sleepH",
    [[3.5,"≤4h"],[5,"5h"],[6,"6h"],[7,"7h"],[8,"8h"],[9.5,"≥9h"]]);
  html += sigRow("Schlaf · Qualität", "sleepQ",
    [[1,"😴 Schlecht"],[2,"😕"],[3,"😐 Ok"],[4,"🙂"],[5,"😊 Gut"]]);
  html += sigRow("Reizlast heute", "irritation",
    [[1,"Gering"],[2,"Leicht"],[3,"Mittel"],[4,"Hoch"],[5,"Extrem"]]);
  html += sigRow("Soziale Last", "socialLoad",
    [[1,"Kaum"],[2,"Etwas"],[3,"Mittel"],[4,"Viel"],[5,"Erschöpft"]]);
  html += sigRow("Masking-Zeit", "maskingH",
    [[0,"0h"],[2,"~2h"],[4,"~4h"],[6,"~6h"],[9,"8h+"]]);
  html += sigRow("Stress heute", "stress",
    [[1,"Gering"],[2,"Leicht"],[3,"Mittel"],[4,"Hoch"],[5,"Extrem"]]);

  // Frühwarnzeichen
  const allWarns = DATA.warnSigns.concat(Array.isArray(state.customWarns) ? state.customWarns : []);
  const selWarns = rec.warn || [];
  const chips = allWarns.map(w =>
    `<button class="wc${selWarns.includes(w)?" on":""}" data-warn="${encodeURIComponent(w)}">${esc(w)}</button>`
  ).join("");
  html += `<div class="warn-section">
    <div class="sig-label">Frühwarnzeichen</div>
    <div class="warnchips">
      ${chips}
      <div class="warn-add">
        <input type="text" id="warnAddInput" placeholder="Eigenes …" aria-label="Eigenes Frühwarnzeichen">
        <button id="warnAddBtn" type="button" aria-label="hinzufügen">+</button>
      </div>
    </div>
  </div>`;

  // Crash-Tag-Markierung
  const isCrash = !!rec.isCrash;
  html += `<button class="crash-btn${isCrash?" on":""}" id="crashBtn">
    ⚡ ${isCrash?"Crash-/Burnout-Tag markiert · tippen zum Aufheben":"Heute war ein Crash- / Burnout-Tag"}
  </button>`;

  form.innerHTML = html;

  // Signal-Buttons verdrahten (form bleibt offen, nur predCard + chart neu)
  $$("[data-sig]", form).forEach(b => b.addEventListener("click", ()=>{
    const field = b.dataset.sig;
    const raw   = b.dataset.val;
    todayLog()[field] = isNaN(parseFloat(raw)) ? raw : parseFloat(raw);
    markActive(); save();
    $$(`[data-sig="${field}"]`, form).forEach(x => x.classList.toggle("sel", x === b));
    rebuildPredBaseline(); renderPredCard(); renderPredChart(_chartDays);
  }));

  // Warn-Chips
  $$("[data-warn]", form).forEach(b => b.addEventListener("click", ()=>{
    const w   = decodeURIComponent(b.dataset.warn);
    const arr = todayLog().warn;
    const i   = arr.indexOf(w); if(i >= 0) arr.splice(i,1); else arr.push(w);
    b.classList.toggle("on");
    markActive(); save();
    rebuildPredBaseline(); renderPredCard(); renderPredChart(_chartDays);
  }));

  // Custom Warn hinzufügen
  const doAdd = ()=>{
    const inp = $("#warnAddInput", form); const v = inp.value.trim(); if(!v) return;
    if(!Array.isArray(state.customWarns)) state.customWarns = [];
    if(!state.customWarns.includes(v) && !DATA.warnSigns.includes(v)) state.customWarns.push(v);
    const arr = todayLog().warn; if(!arr.includes(v)) arr.push(v);
    markActive(); save(); renderMehrForm();
  };
  const wab = $("#warnAddBtn", form); if(wab) wab.addEventListener("click", doAdd);
  const wai = $("#warnAddInput", form);
  if(wai) wai.addEventListener("keydown", e=>{ if(e.key==="Enter"){ e.preventDefault(); doAdd(); } });

  // Crash-Btn
  const cb = $("#crashBtn", form);
  if(cb) cb.addEventListener("click", ()=>{
    const rec2   = todayLog();
    rec2.isCrash = !rec2.isCrash;
    if(rec2.isCrash){
      const PRED = window.ANKER_PRED;
      if(PRED){
        ensurePredictor();
        state.predictor.weights = PRED.learnFromCrash(state.log, state.predictor, todayKey());
      }
    }
    markActive(); save();
    cb.className = "crash-btn" + (rec2.isCrash ? " on" : "");
    cb.innerHTML = `⚡ ${rec2.isCrash?"Crash-/Burnout-Tag markiert · tippen zum Aufheben":"Heute war ein Crash- / Burnout-Tag"}`;
    rebuildPredBaseline(); renderPredCard(); renderPredChart(_chartDays);
  });
}

/* Risiko-Karte rendern */
function renderPredCard(){
  const el = $("#predCard"); if(!el) return;
  ensurePredictor();
  const PRED = window.ANKER_PRED;
  if(!PRED){ el.innerHTML = ""; return; }

  const dateCount = Object.values(state.log).filter(r => r && (r.akku || r.energy)).length;
  if(dateCount < 2){
    el.innerHTML = '<p class="pred-empty">Fülle den Tages-Check einige Tage aus – dann berechnet sich dein persönliches Risikoprofil automatisch. 📊</p>';
    return;
  }

  const risk = PRED.computeRisk(state.log, state.predictor);
  const { score, level, drivers, projDays, slope } = risk;

  const LVNAME  = { ok:"Entspannt", low:"Leicht erhöht", medium:"Mittelhoch", high:"Hoch", critical:"Kritisch" };
  const RECS    = {
    ok:       "Dein Akku erholt sich. Nutze diese Phase – aber überlade nicht.",
    low:      "Belastung leicht über deiner Baseline. Auf Signale achten.",
    medium:   "Zurückfahren empfohlen. Low-Demand-Tag erwägen.",
    high:     "Schutzmodus. Nicht-Essenzielles streichen, Erholung priorisieren.",
    critical: "Klares Stopp-Signal. Nur das Nötigste – alles andere warten lassen."
  };
  const noticeClass = { ok:"good", low:"good", medium:"warn", high:"danger", critical:"danger" };

  const drHtml = drivers.length
    ? '<div class="pred-drivers">'
      + drivers.map(d => `<span class="pred-driver">${PRED.driverLabel(d.k)}</span>`).join("")
      + "</div>"
    : "";

  const learnedCount = Object.keys(state.predictor.weights || {}).length;
  const learnBadge   = learnedCount >= 3
    ? `<span class="pred-learn-badge">🧠 Personalisiert</span>` : "";

  let projHtml = "";
  if(projDays != null && projDays >= 1){
    projHtml = `<div class="pred-notice warn">⚠️ Risiko steigt – bei gleichem Trend in etwa <b>${projDays} Tag${projDays===1?"":"en"}</b> im roten Bereich.</div>`;
  } else if(slope < -0.6){
    projHtml = `<div class="pred-notice good">📉 Erholung erkennbar – Risiko sinkt.</div>`;
  }

  el.innerHTML = `
    <div class="pred-score-wrap">
      <div class="pred-badge ${level}">${score}</div>
      <div>
        <div class="pred-level-label">${LVNAME[level]}${learnBadge}</div>
        <div class="pred-sub">Risiko-Score · 0 = entspannt · 100 = kritisch</div>
      </div>
    </div>
    <div class="pred-progbar"><div class="pred-progfill ${level}" style="width:${score}%"></div></div>
    ${drHtml}
    <div class="pred-notice ${noticeClass[level]}">${RECS[level]}</div>
    ${projHtml}`;
}

/* Verlauf-Chart rendern */
function renderPredChart(days){
  _chartDays = days;
  $$(".ctab").forEach(t => t.classList.toggle("on", +t.dataset.days === days));
  const el = $("#predChart"); const noteEl = $("#chartNote");
  if(!el) return;
  ensurePredictor();
  const PRED = window.ANKER_PRED;
  if(!PRED){ el.innerHTML = ""; return; }

  const hist    = PRED.getHistory(state.log, days, state.predictor.baseline||{}, state.predictor.weights||{});
  const hasData = hist.filter(h => h.score != null).length >= 2;
  if(noteEl) noteEl.style.display = hasData ? "none" : "block";

  const DAY_ABBR = ["So","Mo","Di","Mi","Do","Fr","Sa"];

  el.innerHTML = hist.map((h, i) => {
    const score   = h.score ?? 0;
    const lvl     = score < 30 ? "ok" : score < 52 ? "low" : score < 70 ? "medium" : score < 86 ? "high" : "critical";
    const cls     = h.score == null ? "nodata" : lvl;
    const barH    = h.score != null ? Math.max(4, Math.round(h.score * 0.68)) : 4;
    const d       = new Date(h.date);
    const showLbl = days <= 7 || (days === 30 && i % 6 === 0) || (days === 90 && i % 15 === 0);
    const lbl     = showLbl ? DAY_ABBR[d.getDay()] : "";
    const crash   = h.isCrash ? `<span class="pc-crash">⚡</span>` : "";
    const tap     = h.score != null ? " tap" : "";
    const dattr   = h.score != null ? ` data-date="${h.date}"` : "";
    return `<div class="pc-bar${tap}"${dattr}>
      ${crash}
      <div class="pc-fill ${cls}" style="height:${barH}px"></div>
      ${lbl ? `<div class="pc-label">${lbl}</div>` : ""}
    </div>`;
  }).join("");
  $$("#predChart .pc-bar.tap").forEach(b => b.addEventListener("click", () => openDayDetail(b.dataset.date)));
}

/* ---------- Low-Demand-Tag ---------- */
$("#lowDemandBtn").addEventListener("click", ()=>{
  const on = state.lowDemand.date !== todayKey();
  state.lowDemand.date = on ? todayKey() : null;
  markActive(); save();
  paintLowDemand();
});
function paintLowDemand(){
  const on = state.lowDemand.date === todayKey();
  const btn = $("#lowDemandBtn");
  btn.textContent = on ? "🌙 Low-Demand-Tag ist an – tippen zum Beenden" : "🌙 Low-Demand-Tag aktivieren";
  btn.classList.toggle("ghost", on);
}

/* ---------- Profil & Erfolge ---------- */
function chips(arr, cls){ return arr.map(t=>'<span class="tag '+(cls||"")+'">'+esc(t)+'</span>').join(''); }

// Vorschläge zum Antippen – nichts davon ist vorausgewählt, alles frei änderbar.
const SUGG = {
  strengths: ["Detailgenau","Ehrlich","Loyal","Kreativ","Tiefes Fachwissen","Muster erkennen","Gerechtigkeitssinn","Fokussiert","Empathisch","Verlässlich"],
  triggers:  ["Grelles Licht","Laute Geräusche","Unerwartete Änderungen","Smalltalk","Zeitdruck","Menschenmengen","Kratzige Stoffe","Starke Gerüche","Unterbrechungen","Vieles gleichzeitig"],
  helps:     ["Rückzug","Kopfhörer","Reizarme Umgebung","Feste Routine","Stimming","Klare Pläne","Pausen","Bewegung","Vertraute Menschen","Vorhersehbarkeit"]
};
function profileData(){
  if(!state.profile || typeof state.profile!=="object") state.profile = { name:"", subtitle:"", strengths:[], triggers:[], helps:[] };
  const p = state.profile;
  if(typeof p.name!=="string") p.name = "";
  if(typeof p.subtitle!=="string") p.subtitle = "";
  p.strengths = Array.isArray(p.strengths) ? p.strengths : [];
  p.triggers  = Array.isArray(p.triggers)  ? p.triggers  : [];
  p.helps     = Array.isArray(p.helps)     ? p.helps     : [];
  return p;
}
function profEmpty(){ return '<span class="prof-empty">Noch leer – tippe auf „Profil bearbeiten".</span>'; }
function renderProfile(){
  const p = profileData();
  $("#meName").textContent = p.name || "Dein Name";
  $("#meSub").textContent  = (p.subtitle ? p.subtitle+" · " : "") + state.activeDays.length + " Tage dabei";
  $("#greetName").textContent = p.name ? ("Hi "+p.name) : "Hi";
  $("#profStrengths").innerHTML = p.strengths.length ? chips(p.strengths)          : profEmpty();
  $("#profTriggers").innerHTML  = p.triggers.length  ? chips(p.triggers, "coral")  : profEmpty();
  $("#profHelps").innerHTML     = p.helps.length     ? chips(p.helps, "lav")       : profEmpty();
}

/* Profil bearbeiten – alles frei wählbar */
let pfDraft = null;
function pfField(label, id, val, ph){
  return '<div class="al-field"><label>'+label+'</label>'+
    '<input class="pf-input" id="'+id+'" type="text" value="'+esc(val)+'" placeholder="'+esc(ph)+'"></div>';
}
function pfListBlock(title, key){
  return '<div class="pf-block"><div class="al-h">'+title+'</div>'+
    '<div class="pf-chips" id="pf-'+key+'"></div>'+
    '<div class="pf-add"><input type="text" class="pf-input" data-pf-add="'+key+'" placeholder="Eigenes hinzufügen …">'+
    '<button class="pf-addbtn" type="button" data-pf-addbtn="'+key+'">Hinzufügen</button></div>'+
    '<div class="pf-sugg" id="pf-sugg-'+key+'"></div></div>';
}
function openProfileEditor(){
  const p = profileData();
  pfDraft = { name:p.name, subtitle:p.subtitle, strengths:p.strengths.slice(), triggers:p.triggers.slice(), helps:p.helps.slice() };
  openOverlay("Profil bearbeiten", false);
  ovBody.innerHTML =
    '<p class="muted" style="margin-bottom:6px">Alles hier ist frei wählbar – nichts ist vorgegeben. Tippe Vorschläge an oder schreib Eigenes.</p>'+
    pfField("Name","pf-name", pfDraft.name, "Wie möchtest du genannt werden?")+
    pfField("Untertitel · ganz frei","pf-sub", pfDraft.subtitle, "z. B. AuDHD – oder leer lassen")+
    pfListBlock("Stärken","strengths")+
    pfListBlock("Trigger","triggers")+
    pfListBlock("Was mir hilft","helps");
  ovFoot.innerHTML = '<button class="btn" data-pf-save>Speichern</button>'+
    '<button class="btn ghost" data-close style="margin-top:8px">Abbrechen</button>';
  ["strengths","triggers","helps"].forEach(renderPfList);
  $$("[data-pf-addbtn]", ovBody).forEach(b=> b.addEventListener("click", ()=> pfAdd(b.dataset.pfAddbtn)));
  $$("[data-pf-add]", ovBody).forEach(inp=> inp.addEventListener("keydown", e=>{
    if(e.key==="Enter"){ e.preventDefault(); pfAdd(inp.dataset.pfAdd); }
  }));
  $("[data-pf-save]", ovFoot).addEventListener("click", ()=>{
    pfDraft.name = $("#pf-name").value.trim();
    pfDraft.subtitle = $("#pf-sub").value.trim();
    state.profile = { name:pfDraft.name, subtitle:pfDraft.subtitle,
      strengths:pfDraft.strengths.slice(), triggers:pfDraft.triggers.slice(), helps:pfDraft.helps.slice() };
    save(); renderProfile(); closeOverlay();
  });
  $("[data-close]", ovFoot).addEventListener("click", closeOverlay);
}
function pfAdd(key){
  const inp = $('[data-pf-add="'+key+'"]', ovBody);
  const v = inp.value.trim();
  if(v && !pfDraft[key].includes(v)) pfDraft[key].push(v);
  inp.value = ""; renderPfList(key); inp.focus();
}
function renderPfList(key){
  const wrap = $("#pf-"+key); if(!wrap) return;
  wrap.innerHTML = pfDraft[key].length
    ? pfDraft[key].map((t,i)=>'<span class="pf-chip" data-key="'+key+'" data-i="'+i+'">'+esc(t)+' <i>✕</i></span>').join('')
    : '<span class="pf-empty">Noch nichts ausgewählt</span>';
  $$(".pf-chip", wrap).forEach(c=> c.addEventListener("click", ()=>{
    pfDraft[c.dataset.key].splice(+c.dataset.i, 1); renderPfList(c.dataset.key);
  }));
  const sg = $("#pf-sugg-"+key);
  if(sg){
    const items = (SUGG[key]||[]).map((s,idx)=>({s,idx})).filter(o=> !pfDraft[key].includes(o.s));
    sg.innerHTML = items.map(o=>'<span class="pf-sugg-chip" data-key="'+key+'" data-i="'+o.idx+'">+ '+esc(o.s)+'</span>').join('');
    $$(".pf-sugg-chip", sg).forEach(c=> c.addEventListener("click", ()=>{
      const k=c.dataset.key, val=SUGG[k][+c.dataset.i];
      if(val && !pfDraft[k].includes(val)) pfDraft[k].push(val);
      renderPfList(k);
    }));
  }
}
$("#editProfileBtn").addEventListener("click", openProfileEditor);
function renderAchievements(){
  const el = $("#achievements");
  const lessonsDone = Object.keys(state.done).length;
  const aUnitDone = DATA.units.some((_,i)=> unitDone(i));
  const list = [
    { ic:"🌱", t:"Erster Schritt", s:"erste Lektion", on: lessonsDone>=1 },
    { ic:"🧩", t:"Einheit geschafft", s:"eine ganze Einheit", on: aUnitDone },
    { ic:"🛡️", t:"Eine Woche dabei", s:"7 Tage aufgetaucht", on: state.activeDays.length>=7 },
    { ic:"🌙", t:"Auf dich geachtet", s:"Low-Demand genutzt", on: !!state.lowDemand.date || state.activeDays.length>=3 }
  ];
  el.innerHTML = list.map(a=>{
    const cls = a.on ? "" : ' style="opacity:.45"';
    return '<div class="tool t-teal"'+cls+'><span class="ti">'+(a.on?a.ic:"🔒")+'</span><b>'+a.t+'</b><span>'+a.s+'</span></div>';
  }).join('');
}

/* ---------- Einstellungen ---------- */
function applyTheme(){ root.dataset.theme = state.settings.dark ? "dark" : "light"; }
function applyMotion(){ root.dataset.motion = state.settings.reduceMotion ? "off" : "on"; }
function paintSwitches(){
  $("#sw-dark").classList.toggle("on", !!state.settings.dark);
  $("#sw-motion").classList.toggle("on", !!state.settings.reduceMotion);
  $("#sw-sound").classList.toggle("on", !!state.settings.sound);
  $("#sw-streak").classList.toggle("on", state.settings.softStreak!==false);
}
$("#sw-dark").addEventListener("click", ()=>{ state.settings.dark = !state.settings.dark; applyTheme(); paintSwitches(); save(); });
$("#sw-motion").addEventListener("click", ()=>{ state.settings.reduceMotion = !state.settings.reduceMotion; applyMotion(); paintSwitches(); save(); });
$("#sw-sound").addEventListener("click", ()=>{ state.settings.sound = !state.settings.sound; paintSwitches(); save(); });
$("#sw-streak").addEventListener("click", ()=>{ state.settings.softStreak = !(state.settings.softStreak!==false); paintSwitches(); save(); });

$("#resetBtn").addEventListener("click", ()=>{
  if(confirm("Wirklich allen Fortschritt löschen? Das lässt sich nicht rückgängig machen.")){
    state = defaultState(); save(); initAll();
  }
});

/* ---------- Alltag erleichtern (Säule 2) ---------- */
const AL = window.ANKER_ALLTAG || {};
function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g, c=> ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function alFootClose(){
  ovFoot.innerHTML = '<button class="btn ghost" data-close>Schließen</button>';
  $("[data-close]", ovFoot).addEventListener("click", closeOverlay);
}

/* 1) Tag nach Energie */
function alEnergy(){
  openOverlay("Tag nach Energie", false);
  renderAlEnergy(todayLog().energy);
}
function renderAlEnergy(sel){
  const E = AL.energy;
  let html = '<p class="muted">'+E.intro+'</p><div class="al-pills">'+
    Object.keys(E.levels).map(k=>{
      const L = E.levels[k];
      return '<button class="al-pill'+(k===sel?" sel":"")+'" data-al-e="'+k+'">'+L.emoji+' '+L.label+'</button>';
    }).join('')+'</div>';
  if(sel && E.levels[sel]){
    const L = E.levels[sel];
    html += '<div class="lead" style="margin-top:18px">'+L.head+'</div>'+
      alList("Heute ist okay", L.okay, "teal")+
      alList("Darf warten", L.wait, "muted")+
      '<div class="card"><p style="color:var(--text)">⚓ '+L.anchor+'</p></div>';
  }
  ovBody.innerHTML = html;
  $$("[data-al-e]", ovBody).forEach(b=> b.addEventListener("click", ()=>{
    const k = b.dataset.alE;
    todayLog().energy = k; markActive(); save();
    paintEnergy(); renderEnergyTab(); renderStreak();
    renderAlEnergy(k);
  }));
  alFootClose();
}
function alList(title, arr, tone){
  if(!arr || !arr.length) return "";
  return '<div class="al-block"><div class="al-h">'+title+'</div>'+
    arr.map(x=>'<div class="al-item '+(tone||"")+'">'+x+'</div>').join('')+'</div>';
}

/* 2) Übergänge */
function alTransitions(){ openOverlay("Übergänge", false); alTransitionsList(); }
function alTransitionsList(){
  ovBody.innerHTML = '<p class="muted">Ein Wechsel ist anstrengend. Wähle einen – wir gehen ihn in kleinen Stücken.</p>'+
    AL.transitions.map((t,i)=>'<button class="qopt" data-al-t="'+i+'">'+t.icon+'  '+t.title+'</button>').join('');
  $$("[data-al-t]", ovBody).forEach(b=> b.addEventListener("click", ()=> alTransitionDetail(+b.dataset.alT)));
  alFootClose();
}
function alTransitionDetail(i){
  const t = AL.transitions[i];
  ovBody.innerHTML = '<div class="big-emoji">'+t.icon+'</div>'+
    '<div class="lead" style="text-align:center">'+t.title+'</div>'+
    '<p class="muted">'+t.lead+'</p>'+
    '<ol class="al-steps">'+t.steps.map(s=>'<li>'+s+'</li>').join('')+'</ol>'+
    '<div class="card"><p style="color:var(--text)">'+t.closer+'</p></div>';
  ovFoot.innerHTML = '<button class="btn ghost" data-back>‹ Andere wählen</button>';
  $("[data-back]", ovFoot).addEventListener("click", alTransitionsList);
}

/* 3) Aufgabe in Mini-Schritte */
function alTasks(){ openOverlay("Mini-Schritte", false); alTasksList(); }
function alTasksList(){
  ovBody.innerHTML = '<p class="muted">Große Aufgaben fühlen sich oft unmöglich an. Wähle eine – ich zerlege sie in winzige Schritte.</p>'+
    AL.tasks.map((t,i)=>'<button class="qopt" data-al-k="'+i+'">'+t.icon+'  '+t.title+'</button>').join('');
  $$("[data-al-k]", ovBody).forEach(b=> b.addEventListener("click", ()=> alTaskDetail(+b.dataset.alK)));
  alFootClose();
}
function alTaskDetail(i){
  const t = AL.tasks[i];
  ovBody.innerHTML = '<div class="lead">'+t.icon+' '+t.title+'</div>'+
    '<p class="muted">Tippe jeden Schritt an, wenn du ihn hast. Kein Zeitdruck.</p>'+
    '<div class="al-checks">'+t.steps.map((s,j)=>
      '<button class="al-check" data-al-step="'+j+'"><span class="box">○</span><span><b>'+s.t+'</b>'+(s.n?'<small>'+s.n+'</small>':"")+'</span></button>'
    ).join('')+'</div>'+
    '<div class="card"><p style="color:var(--text)">'+t.closer+'</p></div>';
  ovFoot.innerHTML = '<button class="btn ghost" data-back>‹ Andere wählen</button>';
  $$("[data-al-step]", ovBody).forEach(b=> b.addEventListener("click", ()=>{
    b.classList.toggle("done");
    $(".box", b).textContent = b.classList.contains("done") ? "●" : "○";
  }));
  $("[data-back]", ovFoot).addEventListener("click", alTasksList);
}

/* 4) Termin vorbereiten */
function alAppointment(){
  openOverlay("Termin vorbereiten", false);
  const A = AL.appointment;
  const saved = (state.alltag && state.alltag.appointment) || {};
  ovBody.innerHTML = '<p class="muted">'+A.intro+'</p>'+
    A.fields.map(f=>
      '<div class="al-field"><label>'+f.label+'</label>'+
      '<textarea data-al-f="'+f.key+'" rows="2" placeholder="'+esc(f.hint)+'">'+esc(saved[f.key])+'</textarea></div>'
    ).join('')+
    '<div class="card"><p style="color:var(--text)">'+A.closer+'</p></div>';
  ovFoot.innerHTML = '<button class="btn" data-save>Speichern</button>'+
    '<button class="btn ghost" data-close style="margin-top:8px">Schließen</button>';
  $("[data-save]", ovFoot).addEventListener("click", ()=>{
    if(!state.alltag) state.alltag = {};
    const obj = {};
    $$("[data-al-f]", ovBody).forEach(t=> obj[t.dataset.alF] = t.value);
    state.alltag.appointment = obj;
    markActive(); save();
    const btn = $("[data-save]", ovFoot);
    btn.textContent = "Gespeichert ✓";
    setTimeout(()=>{ const b=$("[data-save]", ovFoot); if(b) b.textContent = "Speichern"; }, 1500);
  });
  $("[data-close]", ovFoot).addEventListener("click", closeOverlay);
}

/* 5) Soziale Skripte */
function alScripts(){ openOverlay("Soziale Skripte", false); alScriptsList(); }
function alScriptsList(){
  ovBody.innerHTML = '<p class="muted">Fertige Texte zum Kopieren. Du darfst sie anpassen, bevor du sie verschickst.</p>'+
    AL.scripts.map((s,i)=>'<button class="qopt" data-al-s="'+i+'">'+s.icon+'  '+s.title+'</button>').join('');
  $$("[data-al-s]", ovBody).forEach(b=> b.addEventListener("click", ()=> alScriptDetail(+b.dataset.alS)));
  alFootClose();
}
function alScriptDetail(i){
  const s = AL.scripts[i];
  ovBody.innerHTML = '<div class="lead">'+s.icon+' '+s.title+'</div>'+
    '<p class="muted">Anpassen, was du brauchst – dann kopieren.</p>'+
    '<textarea class="al-script" id="alScriptText" rows="6">'+esc(s.text)+'</textarea>';
  ovFoot.innerHTML = '<button class="btn" data-copy>Text kopieren</button>'+
    '<button class="btn ghost" data-back style="margin-top:8px">‹ Andere wählen</button>';
  $("[data-copy]", ovFoot).addEventListener("click", ()=>{
    copyText($("#alScriptText").value).then(ok=>{
      const btn = $("[data-copy]", ovFoot); if(!btn) return;
      btn.textContent = ok ? "Kopiert ✓" : "Markiert · mit Strg+C kopieren";
      setTimeout(()=>{ const b=$("[data-copy]", ovFoot); if(b) b.textContent = "Text kopieren"; }, 1800);
    });
  });
  $("[data-back]", ovFoot).addEventListener("click", alScriptsList);
}
function copyText(txt){
  if(navigator.clipboard && navigator.clipboard.writeText){
    return navigator.clipboard.writeText(txt).then(()=>true).catch(()=> fallbackCopy());
  }
  return Promise.resolve(fallbackCopy());
}
function fallbackCopy(){
  try{
    const ta = $("#alScriptText");
    if(ta){ ta.focus(); ta.select(); return document.execCommand("copy"); }
  }catch(e){}
  return false;
}

$$("[data-alltag]").forEach(b=> b.addEventListener("click", ()=>{
  const m = b.dataset.alltag;
  if(m==="energy") alEnergy();
  else if(m==="transitions") alTransitions();
  else if(m==="tasks") alTasks();
  else if(m==="appointment") alAppointment();
  else if(m==="scripts") alScripts();
}));

/* ---------- Verstehen (Säule 3 · Psychoedukation) ---------- */
const VER = window.ANKER_VERSTEHEN || { intro:"", groups:[] };
function isRead(id){ return !!(state.read && state.read[id]); }
function markRead(id){ if(!state.read) state.read = {}; state.read[id] = true; save(); }

function renderVerstehen(){
  const wrap = $("#verContainer");
  if(!wrap) return;
  wrap.innerHTML = '<div class="sec-title">Verstehen</div>'+
    '<p class="muted" style="margin:2px 4px 0">'+VER.intro+'</p>';
  VER.groups.forEach((g, gi)=>{
    const t = document.createElement("div");
    t.className = "sec-title"; t.textContent = g.title;
    wrap.appendChild(t);
    g.cards.forEach((c, ci)=>{
      const b = document.createElement("button");
      b.className = "ver-card" + (isRead(c.id) ? " read" : "");
      b.innerHTML =
        '<span class="vi">'+c.icon+'</span>'+
        '<span class="vc-main"><b>'+c.title+'</b>'+
        '<span class="teaser">'+c.teaser+'</span>'+
        '<span class="meta">'+c.minutes+' Min · in deinem Tempo'+(isRead(c.id)?' · gelesen ✓':'')+'</span></span>';
      b.addEventListener("click", ()=> openVerCard(gi, ci));
      wrap.appendChild(b);
    });
  });
}

let verCard = null, vPages = [], vi = 0;
function openVerCard(gi, ci){
  verCard = VER.groups[gi].cards[ci];
  vPages = verCard.pages; vi = 0;
  openOverlay(verCard.title, false);
  renderVerPage();
}
function renderVerPage(){
  const p = vPages[vi];
  const last = vi === vPages.length-1;
  let html = '<div class="ver-dots">'+vPages.map((_,k)=>'<span class="ver-dot'+(k<=vi?" on":"")+'"></span>').join('')+'</div>';
  if(vi===0) html += '<div class="big-emoji">'+verCard.icon+'</div>';
  html += '<div class="lead">'+p.lead+'</div>';
  if(p.body) html += '<p class="muted">'+p.body+'</p>';
  if(p.list) html += '<ul class="ver-list">'+p.list.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
  if(p.note) html += '<div class="ver-note">'+p.note+'</div>';
  if(last && verCard.takeaway) html += '<div class="ver-take"><span>⚓</span><p>'+verCard.takeaway+'</p></div>';
  ovBody.innerHTML = html;
  ovBody.scrollTop = 0;

  let foot = '<button class="btn" data-vnext>'+(last?"Fertig":"Weiter")+'</button>';
  if(vi>0) foot += '<button class="btn ghost" data-vback style="margin-top:8px">Zurück</button>';
  ovFoot.innerHTML = foot;
  $("[data-vnext]", ovFoot).addEventListener("click", ()=>{
    if(last){ markRead(verCard.id); closeOverlay(); renderVerstehen(); }
    else { vi++; renderVerPage(); }
  });
  const vb = $("[data-vback]", ovFoot);
  if(vb) vb.addEventListener("click", ()=>{ vi--; renderVerPage(); });
}

/* ---------- Verlauf-Tabs ---------- */
$$(".ctab").forEach(t => t.addEventListener("click", () => renderPredChart(+t.dataset.days)));

/* ---------- Garmin-Import ---------- */
$("#garminImportBtn").addEventListener("click", () => $("#garminFile").click());
$("#garminFile").addEventListener("change", e => {
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const PRED = window.ANKER_PRED;
    if(!PRED) return;
    ensurePredictor();
    const result = PRED.importGarmin(ev.target.result, file.name, state.log);
    const statusEl = $("#garminStatus");
    if(statusEl){
      statusEl.style.display = "block";
      statusEl.textContent = result.errors.length
        ? "Fehler: " + result.errors.join("; ")
        : `✓ ${result.imported} Tage übernommen – sichtbar im Verlauf und unter „Eingetragene Tage ansehen".`;
      setTimeout(() => { if(statusEl) statusEl.style.display = "none"; }, 5000);
    }
    markActive(); save();
    rebuildPredBaseline(); renderPredCard(); renderPredChart(_chartDays);
  };
  reader.readAsText(file);
  e.target.value = "";
});

/* ---------- Praxis: Übungen + Journal ---------- */
const PX = window.ANKER_PRAXIS || { exercises:[], journal:{ moods:[], prompts:[], promptsLow:[] } };
let curPx = null, pxData = {};

function renderPraxis(){ renderPraxisGrid(); renderPraxisHelps(); renderJournalToday(); renderJournalHistory(); }

function practiceHelpCount(id){ return (state.practice||[]).filter(p => p.id===id && p.helped==="ja").length; }
function renderPraxisGrid(){
  const g = $("#praxisGrid"); if(!g) return;
  g.innerHTML = PX.exercises.map(e => {
    const badge = practiceHelpCount(e.id) > 0 ? '<span class="px-help">hilft dir</span>' : '';
    return '<button class="tool px-card" data-px="'+e.id+'"><span class="ti">'+e.icon+'</span><b>'+e.title+'</b><span>'+e.sub+'</span>'+badge+'</button>';
  }).join('');
  $$("[data-px]", g).forEach(b => b.addEventListener("click", () => openPractice(b.dataset.px)));
}
function renderPraxisHelps(){
  const el = $("#praxisHelps"); if(!el) return;
  const counts = {};
  (state.practice||[]).forEach(p => { if(p.helped==="ja") counts[p.id] = (counts[p.id]||0)+1; });
  const top = Object.keys(counts).sort((a,b)=>counts[b]-counts[a]).slice(0,3);
  if(!top.length){ el.innerHTML = ""; return; }
  el.innerHTML = '<div class="sec-title">Was dir bisher hilft</div><div class="card">'+
    top.map(id => { const e = PX.exercises.find(x=>x.id===id); return e ? '<div class="px-helprow"><span>'+e.icon+'</span><b>'+e.title+'</b><span class="muted">'+counts[id]+'×</span></div>' : ''; }).join('')+'</div>';
}

function openPractice(id){
  curPx = PX.exercises.find(e=>e.id===id); if(!curPx) return;
  pxData = {};
  openOverlay(curPx.title, false);
  const t = curPx.type;
  if(t==="bodyscan") pxBodyscan();
  else if(t==="check") pxCheck();
  else if(t==="breath") pxBreathChoice();
  else if(t==="grounding") pxGrounding();
  else if(t==="defusion") pxDefusion();
  else if(t==="compassion") pxCompassion();
}
function pxRating(){
  pxStopBreath();
  ovBody.innerHTML = '<div class="big-emoji">🌿</div><div class="lead" style="text-align:center">Wie war das für dich?</div>'+
    '<p class="muted" style="text-align:center">Ich merke mir, was dir hilft – ganz ohne Wertung.</p>';
  ovFoot.innerHTML = '<button class="btn" data-rate="ja">Hat geholfen</button>'+
    '<button class="btn ghost" data-rate="etwas" style="margin-top:8px">Ein bisschen</button>'+
    '<button class="btn ghost" data-rate="nein" style="margin-top:8px">Eher nicht</button>';
  $$("[data-rate]", ovFoot).forEach(b => b.addEventListener("click", () => { logPractice(curPx.id, b.dataset.rate); closeOverlay(); renderPraxis(); }));
}
function logPractice(id, helped){
  if(!Array.isArray(state.practice)) state.practice = [];
  state.practice.push({ id, date:todayKey(), ts:Date.now(), helped });
  markActive(); save();
}

/* Bodyscan */
function pxBodyscan(){
  const ex = curPx;
  const seq = [{lead:ex.title, body:ex.intro, emoji:ex.icon}]
    .concat(ex.regions.map(r=>({lead:r.part, body:r.text})))
    .concat([{lead:"Angekommen", body:ex.closer, emoji:"🌿"}]);
  let i = 0;
  (function render(){
    const s = seq[i], last = i===seq.length-1;
    ovBody.innerHTML = (s.emoji ? '<div class="big-emoji">'+s.emoji+'</div>' : '')+'<div class="lead">'+s.lead+'</div><p class="muted">'+s.body+'</p>';
    ovFoot.innerHTML = '<button class="btn" data-n>'+(last?"Wie war's?":"Weiter")+'</button>'+(i>0?'<button class="btn ghost" data-b style="margin-top:8px">Zurück</button>':'');
    $("[data-n]", ovFoot).addEventListener("click", ()=>{ if(last) pxRating(); else { i++; render(); } });
    const b=$("[data-b]",ovFoot); if(b) b.addEventListener("click", ()=>{ i--; render(); });
  })();
}

/* Nervensystem-Check */
function pxCheck(){
  const ex = curPx;
  ovBody.innerHTML = '<p class="muted">'+ex.intro+'</p>'+
    '<input type="range" id="pxRange" class="px-range" min="0" max="100" value="50" aria-label="Nervensystem-Zustand">'+
    '<div class="px-scale"><span>runtergefahren</span><span>ausgeglichen</span><span>überreizt</span></div>';
  ovFoot.innerHTML = '<button class="btn" data-n>Weiter</button><button class="btn ghost" data-close style="margin-top:8px">Schließen</button>';
  $("[data-close]", ovFoot).addEventListener("click", closeOverlay);
  $("[data-n]", ovFoot).addEventListener("click", ()=>{
    const v = +$("#pxRange").value;
    const z = v<34 ? ex.zones.low : v<67 ? ex.zones.mid : ex.zones.high;
    let html = '<div class="lead">'+z.word+'</div><p class="muted">'+z.text+'</p>';
    if(z.suggest && z.suggest.length){
      html += '<p class="muted" style="margin-top:10px">Magst du gleich etwas davon?</p>'+
        z.suggest.map(sid => { const se = PX.exercises.find(x=>x.id===sid); return se ? '<button class="qopt" data-sg="'+sid+'">'+se.icon+'  '+se.title+'</button>' : ''; }).join('');
    }
    ovBody.innerHTML = html;
    ovFoot.innerHTML = '<button class="btn ghost" data-fin>Fertig</button>';
    $$("[data-sg]", ovBody).forEach(b => b.addEventListener("click", ()=> openPractice(b.dataset.sg)));
    $("[data-fin]", ovFoot).addEventListener("click", pxRating);
  });
}

/* Atem-Muster */
function pxBreathChoice(){
  const ex = curPx;
  ovBody.innerHTML = '<p class="muted">Wähle ein Muster. Du kannst jederzeit aufhören.</p>'+
    ex.patterns.map((p,i)=>'<button class="qopt" data-bp="'+i+'"><b>'+p.name+'</b><br><span class="muted">'+p.sub+'</span></button>').join('');
  ovFoot.innerHTML = '<button class="btn ghost" data-close>Schließen</button>';
  $$("[data-bp]", ovBody).forEach(b => b.addEventListener("click", ()=> pxBreathPlay(ex.patterns[+b.dataset.bp])));
  $("[data-close]", ovFoot).addEventListener("click", closeOverlay);
}
function pxBreathPlay(pattern){
  ovBody.innerHTML = '<div class="px-breath"><div class="pb-circle" id="pbCircle"><span id="pbLabel">Bereit</span></div><p class="note" id="pbSub">'+pattern.name+'</p></div>';
  ovFoot.innerHTML = '<button class="btn" data-fin>Fertig</button><button class="btn ghost" data-bpback style="margin-top:8px">Anderes Muster</button>';
  $("[data-fin]", ovFoot).addEventListener("click", ()=>{ pxStopBreath(); pxRating(); });
  $("[data-bpback]", ovFoot).addEventListener("click", ()=>{ pxStopBreath(); pxBreathChoice(); });
  setTimeout(()=> pxStartBreath(pattern), 350);
}
let pxBTimer = null, pxBPhase = null;
function pxStartBreath(pattern){
  pxStopBreath();
  const motion = root.dataset.motion !== "off";
  const circle = $("#pbCircle"), label = $("#pbLabel"), sub = $("#pbSub");
  let pi = 0, round = 1;
  (function phase(){
    const ph = pattern.phases[pi];
    if(label) label.textContent = ph.l;
    if(circle && motion){ circle.style.transition = "transform "+ph.s+"s ease-in-out"; circle.style.transform = "scale("+ph.sc+")"; }
    let rem = ph.s;
    if(sub) sub.textContent = motion ? ("Runde "+round) : (ph.l+" · "+rem);
    clearInterval(pxBPhase);
    if(!motion) pxBPhase = setInterval(()=>{ rem--; if(sub) sub.textContent = ph.l+" · "+Math.max(0,rem); }, 1000);
    pxBTimer = setTimeout(()=>{ pi=(pi+1)%pattern.phases.length; if(pi===0) round++; phase(); }, ph.s*1000);
  })();
}
function pxStopBreath(){ clearTimeout(pxBTimer); clearInterval(pxBPhase); }

/* Erdung mit Eingabe */
function pxGrounding(){
  const ex = curPx;
  const seq = [{intro:true}].concat(ex.senses).concat([{closer:true}]);
  let i = 0;
  (function render(){
    const s = seq[i];
    if(s.intro){
      ovBody.innerHTML = '<div class="big-emoji">'+ex.icon+'</div><div class="lead">Erdung</div><p class="muted">'+ex.intro+'</p>';
      ovFoot.innerHTML = '<button class="btn" data-n>Los</button>';
    } else if(s.closer){
      ovBody.innerHTML = '<div class="big-emoji">🌿</div><div class="lead">Angekommen</div><p class="muted">'+ex.closer+'</p>';
      ovFoot.innerHTML = '<button class="btn" data-n>Wie war\'s?</button>';
    } else {
      ovBody.innerHTML = '<div class="lead">'+s.n+' '+s.label+'</div><p class="muted">Benenne sie – tippen oder nur denken.</p><textarea class="qfree" rows="2" placeholder="z. B. …"></textarea>';
      ovFoot.innerHTML = '<button class="btn" data-n>Weiter</button>'+(i>1?'<button class="btn ghost" data-b style="margin-top:8px">Zurück</button>':'');
    }
    $("[data-n]", ovFoot).addEventListener("click", ()=>{ if(s.closer) pxRating(); else { i++; render(); } });
    const b=$("[data-b]",ovFoot); if(b) b.addEventListener("click", ()=>{ i--; render(); });
  })();
}

/* Gedanken-Enthakung (ACT) */
function pxDefusion(){
  const ex = curPx; pxData.thought = "";
  let i = 0;
  (function render(){
    if(i===0){
      ovBody.innerHTML = '<div class="big-emoji">'+ex.icon+'</div><div class="lead">'+ex.s1lead+'</div><p class="muted">'+ex.s1+'</p><textarea class="qfree" id="pxThought" rows="3" placeholder="z. B. Ich bin zu viel."></textarea>';
      ovFoot.innerHTML = '<button class="btn" data-n>Weiter</button><button class="btn ghost" data-close style="margin-top:8px">Schließen</button>';
      $("[data-close]", ovFoot).addEventListener("click", closeOverlay);
    } else if(i===1){
      ovBody.innerHTML = '<p class="muted">'+ex.s2+'</p><div class="px-quote">Ich habe gerade den Gedanken, dass '+esc(pxData.thought||"…")+'.</div>';
      ovFoot.innerHTML = '<button class="btn" data-n>Weiter</button><button class="btn ghost" data-b style="margin-top:8px">Zurück</button>';
    } else if(i===2){
      ovBody.innerHTML = '<p class="muted">'+ex.s3+'</p><div class="px-quote">Ich bemerke, dass ich den Gedanken habe, dass '+esc(pxData.thought||"…")+'.</div>';
      ovFoot.innerHTML = '<button class="btn" data-n>Weiter</button><button class="btn ghost" data-b style="margin-top:8px">Zurück</button>';
    } else {
      ovBody.innerHTML = '<div class="lead">'+ex.s4lead+'</div><p class="muted">'+ex.s4+'</p>';
      ovFoot.innerHTML = '<button class="btn" data-n>Wie war\'s?</button><button class="btn ghost" data-b style="margin-top:8px">Zurück</button>';
    }
    $("[data-n]", ovFoot).addEventListener("click", ()=>{
      if(i===0){ const t=$("#pxThought"); pxData.thought = (t&&t.value.trim())||""; }
      if(i>=3) pxRating(); else { i++; render(); }
    });
    const b=$("[data-b]",ovFoot); if(b) b.addEventListener("click", ()=>{ i--; render(); });
  })();
}

/* Selbstmitgefühl */
function pxCompassion(){
  const ex = curPx; pxData = {};
  let i = 0;
  (function render(){
    if(i===0){
      ovBody.innerHTML = '<div class="big-emoji">'+ex.icon+'</div><div class="lead">'+ex.s1lead+'</div><p class="muted">'+ex.s1+'</p><textarea class="qfree" id="pxC1" rows="2" placeholder="…"></textarea>';
      ovFoot.innerHTML = '<button class="btn" data-n>Weiter</button><button class="btn ghost" data-close style="margin-top:8px">Schließen</button>';
      $("[data-close]", ovFoot).addEventListener("click", closeOverlay);
    } else if(i===1){
      ovBody.innerHTML = '<p class="muted">'+ex.s2+'</p>';
      ovFoot.innerHTML = '<button class="btn" data-n>Weiter</button><button class="btn ghost" data-b style="margin-top:8px">Zurück</button>';
    } else if(i===2){
      ovBody.innerHTML = '<div class="lead">'+ex.s3lead+'</div><p class="muted">'+ex.s3+'</p><textarea class="qfree" id="pxC3" rows="3" placeholder="Schreib es dir – wie zu einem guten Freund."></textarea>';
      ovFoot.innerHTML = '<button class="btn" data-n>Weiter</button><button class="btn ghost" data-b style="margin-top:8px">Zurück</button>';
    } else {
      const note = (pxData.kind||"").trim();
      ovBody.innerHTML = '<div class="lead">'+ex.s4lead+'</div><p class="muted">'+ex.s4+'</p>'+(note ? '<div class="px-quote">'+esc(note)+'</div>' : '');
      ovFoot.innerHTML = (note ? '<button class="btn" data-jrnl>Diese Worte ins Journal</button><button class="btn ghost" data-n style="margin-top:8px">Wie war\'s?</button>' : '<button class="btn" data-n>Wie war\'s?</button>');
      const jr = $("[data-jrnl]", ovFoot);
      if(jr) jr.addEventListener("click", ()=>{
        if(!Array.isArray(state.journal)) state.journal = [];
        state.journal.push({ ts:Date.now(), date:todayKey(), text:note, mood:null, prompt:"Selbstmitgefühl", energy: todayLog().energy||null });
        markActive(); save(); renderJournalHistory();
        jr.textContent = "Im Journal ✓"; jr.disabled = true;
      });
    }
    $("[data-n]", ovFoot).addEventListener("click", ()=>{
      if(i===2){ const t=$("#pxC3"); pxData.kind = (t&&t.value)||""; }
      if(i>=3) pxRating(); else { i++; render(); }
    });
    const b=$("[data-b]",ovFoot); if(b) b.addEventListener("click", ()=>{ i--; render(); });
  })();
}

/* ---------- Journal ---------- */
function moodColor(v){ return { 1:"var(--bad)", 2:"var(--coral)", 3:"var(--warn)", 4:"var(--teal)", 5:"var(--good)" }[v] || "var(--line)"; }
function moodLabel(v){ const m = (PX.journal.moods||[]).find(x=>x.v===v); return m ? m.label : ""; }
function journalPromptToday(){
  const J = PX.journal, e = todayLog().energy, low = (e==="leer"||e==="wenig");
  const pool = low ? (J.promptsLow||[]) : (J.prompts||[]);
  if(!pool.length) return "";
  return pool[Math.floor(Date.now()/86400000) % pool.length];
}
let jMood = null;
function renderJournalToday(){
  const p = $("#jPrompt"); if(!p) return;
  p.textContent = journalPromptToday();
  jMood = null;
  const mr = $("#jMoods");
  mr.innerHTML = (PX.journal.moods||[]).map(m => '<button class="jp-mood" data-mood="'+m.v+'" title="'+esc(m.label)+'" aria-label="'+esc(m.label)+'"><span class="jp-dot" style="background:'+moodColor(m.v)+'"></span></button>').join('');
  $$("[data-mood]", mr).forEach(b => b.addEventListener("click", ()=>{ jMood = +b.dataset.mood; $$("[data-mood]", mr).forEach(x=>x.classList.toggle("sel", x===b)); }));
}
function renderJournalHistory(){
  const el = $("#jHistory"); if(!el) return;
  const entries = (state.journal||[]).slice().sort((a,b)=>b.ts-a.ts);
  if(!entries.length){
    el.innerHTML = '<p class="muted" style="margin-top:14px;padding:0 4px">Noch keine Einträge. Auch ein einziges Wort zählt – und in ein paar Wochen liest du hier deine eigene Entwicklung.</p>';
    return;
  }
  el.innerHTML = '<div class="sec-title">Rückschau · '+entries.length+' Eintr'+(entries.length===1?"ag":"äge")+'</div>'+
    entries.slice(0,40).map(e => {
      const snip = e.text ? esc(e.text.slice(0,70))+(e.text.length>70?"…":"") : "(nur Stimmung)";
      return '<button class="j-entry" data-j="'+e.ts+'">'+(e.mood?'<span class="jp-dot" style="background:'+moodColor(e.mood)+'"></span>':'<span class="jp-dot" style="background:var(--line)"></span>')+'<span class="j-meta"><b>'+fmtDay(e.date)+'</b><span class="muted">'+snip+'</span></span></button>';
    }).join('');
  $$("[data-j]", el).forEach(b => b.addEventListener("click", ()=> openJournalEntry(+b.dataset.j)));
}
function openJournalEntry(ts){
  const e = (state.journal||[]).find(x=>x.ts===ts); if(!e) return;
  openOverlay(fmtDay(e.date), false);
  ovBody.innerHTML =
    (e.prompt ? '<p class="muted" style="margin-bottom:8px">'+esc(e.prompt)+'</p>' : '')+
    (e.mood ? '<p style="margin-bottom:10px"><span class="jp-dot" style="display:inline-block;vertical-align:middle;background:'+moodColor(e.mood)+'"></span> <span class="muted">'+esc(moodLabel(e.mood))+'</span></p>' : '')+
    '<p style="font-size:15px;line-height:1.6;white-space:pre-wrap">'+esc(e.text||"(nur Stimmung festgehalten)")+'</p>';
  ovFoot.innerHTML = '<button class="btn ghost" data-jdel>Eintrag löschen</button><button class="btn ghost" data-close style="margin-top:8px">Schließen</button>';
  $("[data-close]", ovFoot).addEventListener("click", closeOverlay);
  $("[data-jdel]", ovFoot).addEventListener("click", ()=>{
    if(confirm("Diesen Eintrag löschen? Das lässt sich nicht rückgängig machen.")){
      state.journal = (state.journal||[]).filter(x=>x.ts!==ts); save(); closeOverlay(); renderJournalHistory();
    }
  });
}
const _jSaveBtn = $("#jSave");
if(_jSaveBtn) _jSaveBtn.addEventListener("click", ()=>{
  const t = $("#jText").value.trim();
  if(!t && !jMood) return;
  if(!Array.isArray(state.journal)) state.journal = [];
  state.journal.push({ ts:Date.now(), date:todayKey(), text:t, mood:jMood, prompt:journalPromptToday(), energy: todayLog().energy||null });
  markActive(); save();
  $("#jText").value = "";
  const btn = $("#jSave"); btn.textContent = "Gespeichert ✓";
  setTimeout(()=>{ const b=$("#jSave"); if(b) b.textContent = "Eintrag speichern"; }, 1500);
  renderJournalToday(); renderJournalHistory();
});

/* ---------- Start ---------- */
function initSettingsDefaults(){
  // Beim ersten Start System-Einstellungen respektieren
  if(state.settings.dark === null){
    state.settings.dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  if(state.settings.reduceMotion === null){
    state.settings.reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
}
function initAll(){
  initSettingsDefaults();
  applyTheme(); applyMotion(); paintSwitches();
  paintEnergy(); renderStreak();
  renderPath();
  renderVerstehen();
  renderPraxis();
  paintAmp(); renderEnergyTab(); paintLowDemand();
  renderProfile(); renderAchievements();
  save();
}
initAll();

/* ---------- Service Worker (offline + Auto-Update) ---------- */
if("serviceWorker" in navigator && location.protocol!=="file:"){
  // Lädt eine neue Version sich automatisch nach, sobald sie da ist.
  const hadController = !!navigator.serviceWorker.controller;
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", ()=>{
    if(refreshing || !hadController) return; // beim allerersten Install kein Reload
    refreshing = true; window.location.reload();
  });
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("service-worker.js").then(reg=>{
      reg.update && reg.update();
      // regelmäßig auf Updates prüfen, wenn die App offen bleibt
      setInterval(()=>{ try{ reg.update(); }catch(e){} }, 60*60*1000);
    }).catch(()=>{});
  });
}

})();
