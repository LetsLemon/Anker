# ⚓ Anker

Eine sanfte App für **Selbstregulation, Alltag und Burnout-Prävention** – gebaut *für* autistische Nutzung, nicht nur *über* Autismus. Grounding statt Punktejagd.

Das hier ist eine **PWA** (Progressive Web App): eine echte, installierbare Handy-App, die komplett **offline** läuft. **Alle Daten bleiben auf dem Gerät** – kein Server, kein Konto, kein Tracking.

---

## 1) Schnell am PC ansehen

Einfachster Weg: Doppelklick auf **`index.html`** – läuft sofort im Browser.
(Für die volle PWA-Erfahrung mit „App installieren" und Offline-Cache braucht es einen Mini-Server, siehe unten.)

**Mit lokalem Server (empfohlen zum Testen):**
- Rechtsklick auf **`serve.ps1`** → *Mit PowerShell ausführen*
- Öffnet automatisch `http://localhost:8080`
- Beenden mit **Strg + C**

> Falls PowerShell die Ausführung blockiert: PowerShell öffnen, in den Ordner wechseln und einmalig
> `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` eingeben, dann `.\serve.ps1`.

---

## 2) Aufs Handy bringen & installieren

Damit das Handy die App per HTTPS laden und **installieren** kann, lädst du den Ordner einmalig zu einem kostenlosen Hoster hoch. Empfehlung, weil ohne Konto-Stress:

### Weg A — Netlify Drop (am einfachsten, ~1 Minute)
1. Auf dem PC **[app.netlify.com/drop](https://app.netlify.com/drop)** öffnen.
2. Den **ganzen Ordner `anker`** ins Browserfenster ziehen.
3. Du bekommst eine HTTPS-Adresse (z. B. `https://dein-name.netlify.app`).
4. Diese Adresse auf dem **Handy** öffnen.

### Weg B — GitHub Pages (gut, wenn du es versionieren willst)
Git ist bei dir installiert. Repo anlegen, pushen, in den Repo-Einstellungen *Pages* aktivieren – fertig ist deine HTTPS-Adresse.

### Dann installieren
- **iPhone (Safari):** Teilen-Symbol → **Zum Home-Bildschirm**.
- **Android (Chrome):** Menü (⋮) → **App installieren** / **Zum Startbildschirm hinzufügen**.

Danach hat Anker ein eigenes Icon, startet im Vollbild und läuft offline. 🎉

---

## 3) Eigene Lektionen schreiben

Alle Inhalte stehen **getrennt vom Code** in **`data/lessons.js`** – du (oder eine KI) kannst sie frei bearbeiten. Eine Lektion sieht so aus:

```js
{
  id: "meine-lektion",          // eindeutig, keine Leerzeichen
  title: "Titel der Lektion",
  label: "Kurz-Label am Knoten",
  icon: "🌿",
  steps: [
    { type:"intro",  emoji:"🌿", lead:"Überschrift", body:"Sanfter Einstieg." },
    { type:"info",   emoji:"💡", lead:"Warum das hilft", body:"Psychoedukation." },
    { type:"quiz",   q:"Eine Reflexionsfrage?", opts:["A","B","C"], multi:false },
    { type:"plan",   lead:"Mini-Plan", body:"Wenn …, dann …." },
    { type:"reward", note:"Abschlusssatz." }
  ]
}
```

Es gibt auch Spezial-Schritte `{ type:"breath" }` (Atem-Übung) und `{ type:"ground" }` (5-4-3-2-1) – einfach an passender Stelle einfügen.

> Tipp: Lass dir aus deinem Autismus-Dokument neue Lektionen als solche Blöcke generieren und füge sie in die passende Einheit ein. Die App lädt sie automatisch und schaltet sie der Reihe nach frei.

---

## 4) Dateien

```
anker/
├─ index.html              App-Hülle (4 Tabs)
├─ styles.css              Design (Dunkelmodus, weiche Farben, Reduce-Motion)
├─ app.js                  Logik: Fortschritt, Energie, Akku, Speichern
├─ data/lessons.js         👉 Inhalte – hier neue Lektionen ergänzen
├─ manifest.webmanifest    macht es zur installierbaren App
├─ service-worker.js       Offline-Funktion
├─ icons/                  App-Icons
├─ serve.ps1               lokaler Test-Server
└─ README.md               diese Datei
```

---

## 5) Designprinzipien (warum es so ist, wie es ist)

- **Sanfte Streaks mit Schutz-Schild** – eine Pause zerstört nichts. Pausieren ist Regulation, kein Versagen.
- **Kein Vergleich, keine Ligen, kein XP-Druck** – Motivation aus Autonomie & Kompetenz statt Dopamin-Tricks.
- **Vorhersehbarkeit** – feste Tabs, immer am gleichen Ort. Die Sofort-Hilfe ist im Überlastungsmoment einen Tipp entfernt.
- **Energie steuert den Tag** – die App passt sich dir an, nicht umgekehrt.
- **Neurodivergente UX** – Dunkelmodus, Animationen reduzierbar, weiche Farben, klare Button-Texte.

---

## 6) Später eine „echte" Store-App?

Diese PWA ist auf dem Handy praktisch wie eine native App. Wenn du irgendwann in den App Store / Play Store willst, ist der nächste Schritt **React Native + Expo** – dafür müsste Node.js installiert und die Oberfläche in native Komponenten überführt werden. Die Inhalte (`data/lessons.js`) und die ganze Logik lassen sich dabei größtenteils übernehmen.

---

## 7) Burnout-Prädiktor · wie das Modell funktioniert

Der Prädiktor läuft vollständig lokal im Browser – kein Server, keine Cloud.

### Signale
Jeden Tag erfasst die App bis zu 9 Signale (alles optional außer dem Akku-Check):

| Signal | Eingabe | Bedeutung |
|---|---|---|
| Akku (Ampel) | Grün / Gelb / Rot | Subjektives Energieniveau |
| Energie | Viel / Mittel / Wenig / Leer | Aus dem Pfad-Tab |
| Schlaf · Dauer | ≤4h … ≥9h | Schlafdauer in Stunden |
| Schlaf · Qualität | 1–5 | Erholungswert |
| Reizlast | 1–5 | Sensorische + kognitive Überstimulation |
| Soziale Last | 1–5 | Erschöpfung durch sozialen Aufwand |
| Masking-Zeit | 0–8h+ | Stunden aktiven Maskings |
| Stress | 1–5 | Allgemeines Stresslevel |
| Frühwarnzeichen | Chips | Anzahl aktiver Warnzeichen |

### Berechnungsschritte

1. **Baseline** – Welford-Online-Algorithmus berechnet für jedes Signal rollierenden Mittelwert + Standardabweichung aus den letzten 120 Nicht-Crash-Tagen.

2. **Tages-Belastungs-Score** – Jedes Signal wird in z-Scores umgerechnet (Abweichung von der persönlichen Baseline). Alle Scores werden gewichtet gemittelt → Belastung 0–1 pro Tag.

3. **Allostatic Load** – Kumulierter Akkumulator: `load = load × 0.84 + tagesBelastung`. Der Faktor 0.84 entspricht einer Halbwertszeit von ~4 Tagen. Erholung baut automatisch ab.

4. **Trend** – Lineare Regression der letzten 14 Tages-Scores. Positive Steigung = Belastung wächst.

5. **Risiko-Score 0–100** – Load (max 70 Punkte) + Trend-Bonus/Malus (max ±30 Punkte).

6. **Projektion** – „Risiko steigt in ~X Tagen ins Rote": Wenn Steigung > 0.7 Punkte/Tag und aktueller Score < 78, wird extrapoliert.

7. **Treiber** – Die 4 Signale mit der größten positiven z-Score-Abweichung heute werden als Haupttreiber angezeigt.

### Online-Lernen (Personalisierung)

Wenn du einen Tag als „Crash-/Burnout-Tag" markierst, führt die App einen Gradient-Update-Schritt durch:

- **Positive Beispiele**: der Crash-Tag + Vortag (Vorzeichen-Tage).
- **Negative Beispiele**: 18 zufällige normale Tage.
- **Formel**: `w_k += 0.1 × (target − sigmoid(w_k × z_k)) × z_k`

Mit der Zeit lernt das Modell, welche Signalkombinationen bei *dieser Person* Vorboten eines Crashs sind. Das „🧠 Personalisiert"-Badge erscheint, sobald ≥ 3 Gewichte angepasst wurden.

---

## 8) Garmin Connect · Import

### So exportierst du

1. Auf **connect.garmin.com** einloggen → **Konto** → **Daten exportieren**.
2. Bulk-Export als ZIP herunterladen. Die relevanten Dateien sind z. B.:
   - `DailyStressDetails_*.json` → Stress + Body Battery
   - `SleepData_*.json` → Schlaf
   - `WellnessActivities_*.csv` → kombinierte Tageswerte
3. Einzelne CSV- oder JSON-Datei im Energie-Tab über **📂 Garmin-Datei importieren** einlesen.

### Was gemappt wird

| Garmin-Feld | Anker-Feld | Logik |
|---|---|---|
| Body Battery (End of Day) | akku | ≥65 → Grün, ≥40 → Gelb, <40 → Rot |
| Sleep Time (Sekunden) | sleepH | geteilt durch 3600 |
| Sleep Score | sleepQ | geteilt durch 20, gerundet auf 1–5 |
| Average Stress Level (0–100) | stress | `1 + wert/25`, gerundet auf 1–5 |
| Avg Overnight HRV | garminHRV | nur gespeichert, noch nicht direkt gewertet |
| Resting Heart Rate (bpm) | garminHR | nur gespeichert |

Manuell eingegebene Werte haben Vorrang – bereits eingetragene Felder werden durch den Import **nicht** überschrieben.

### Live-Sync (nicht implementiert)

Eine Echtzeit-Anbindung erfordert:
- Registrierung als Garmin Health API Partner (kostenlos, aber Formular-Genehmigung)
- Backend-Server für OAuth-Handshake + Webhook-Empfang
- Regelmäßiger Pull oder Push-Notification von Garmin

Einstiegspunkt im Code: `ANKER_PRED.importGarmin()` in `data/predictor.js` – die gleiche Funktion verarbeitet dann die API-Antwort statt einer Datei. Das `state.log`-Format ist quellen-agnostisch.

---

```
anker/
├─ index.html              App-Hülle (5 Tabs)
├─ styles.css              Design (Dunkelmodus, weiche Farben, Reduce-Motion)
├─ app.js                  Logik: Prädiktor, Fortschritt, Energie, Speichern
├─ data/predictor.js       👉 Burnout-Prädiktor-Modell (neu)
├─ data/lessons.js         Inhalte – hier neue Lektionen ergänzen
├─ data/alltag.js          Alltags-Hilfen
├─ data/verstehen.js       Psychoedukation
├─ manifest.webmanifest    macht es zur installierbaren App
├─ service-worker.js       Offline-Funktion
├─ icons/                  App-Icons
├─ serve.ps1               lokaler Test-Server
└─ README.md               diese Datei
```

*Anker · v2.0 · mit Sorgfalt gebaut 🌱*
