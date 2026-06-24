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

*Anker · v1.0 · mit Sorgfalt gebaut 🌱*
