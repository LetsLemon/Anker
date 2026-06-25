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
  profile: null
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
  if(!state.log[d]) state.log[d] = { energy:null, akku:null, warn:[] };
  return state.log[d];
}
function markActive(){
  const d = todayKey();
  if(!state.activeDays.includes(d)) state.activeDays.push(d);
}

/* ---------- Navigation ---------- */
const VIEWS = { pfad:"v-pfad", calm:"v-calm", alltag:"v-alltag", verstehen:"v-verstehen", energy:"v-energy", me:"v-me" };
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
  paintEnergy(); renderStreak(); renderBars();
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
      (s.multi ? '<p class="muted" style="margin-top:10px">Mehrere möglich – tippe alles an, was passt.</p>' : '');
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
  paintAmp(); renderStreak(); renderBars();
}));

/* ---------- 7-Tage-Verlauf ---------- */
function renderBars(){
  const bars = $("#bars"); bars.innerHTML = "";
  const days = ["So","Mo","Di","Mi","Do","Fr","Sa"];
  const ampH = { g:85, y:55, r:28 };
  const enH  = { voll:90, mittel:60, wenig:35, leer:18 };
  let any = false;
  for(let k=6; k>=0; k--){
    const d = new Date(); d.setDate(d.getDate()-k);
    const key = d.toISOString().slice(0,10);
    const rec = state.log[key];
    let h = 0;
    if(rec){
      if(rec.akku) h = ampH[rec.akku];
      else if(rec.energy) h = enH[rec.energy];
      if(h) any = true;
    }
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.innerHTML = '<i style="height:'+h+'%"></i><small>'+days[d.getDay()]+'</small>';
    bars.appendChild(bar);
  }
  $("#barsNote").style.display = any ? "none" : "block";
}

/* ---------- Frühwarnzeichen ---------- */
function renderWarn(){
  const wEl = $("#warn"); wEl.innerHTML = "";
  const sel = todayLog().warn || [];
  DATA.warnSigns.forEach(w=>{
    const b = document.createElement("button");
    b.className = "wc" + (sel.includes(w) ? " on" : "");
    b.textContent = w;
    b.addEventListener("click", ()=>{
      const arr = todayLog().warn;
      const i = arr.indexOf(w);
      if(i>=0) arr.splice(i,1); else arr.push(w);
      b.classList.toggle("on");
      markActive(); save();
    });
    wEl.appendChild(b);
  });
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
function chips(arr, cls){ return arr.map(t=>'<span class="tag '+(cls||"")+'">'+t+'</span>').join(''); }
function renderProfile(){
  const p = state.profile || DATA.profile;
  $("#meName").textContent = p.name;
  $("#meSub").textContent  = p.subtitle + " · " + state.activeDays.length + " Tage dabei";
  $("#greetName").textContent = "Hi " + p.name;
  $("#profStrengths").innerHTML = chips(p.strengths);
  $("#profTriggers").innerHTML  = chips(p.triggers, "coral");
  $("#profHelps").innerHTML     = chips(p.helps, "lav");
}
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
function esc(s){ return String(s==null?"":s).replace(/[&<>]/g, c=> ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c])); }
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
    paintEnergy(); renderBars(); renderStreak();
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
  paintAmp(); renderBars(); renderWarn(); paintLowDemand();
  renderProfile(); renderAchievements();
  save();
}
initAll();

/* ---------- Service Worker (offline) ---------- */
if("serviceWorker" in navigator && location.protocol!=="file:"){
  window.addEventListener("load", ()=> navigator.serviceWorker.register("service-worker.js").catch(()=>{}));
}

})();
