/*
  Anker · Inhalte (getrennt vom Code)
  --------------------------------------------------
  Hier stehen alle Lektionen, Tools und Texte.
  Du kannst diese Datei frei bearbeiten oder mit KI neue Lektionen
  generieren lassen – die App laedt sie automatisch.

  Tipp fuers Bearbeiten:
  Die geraden Anfuehrungszeichen ( " ) begrenzen jeden Text und duerfen
  NICHT mitten im Satz vorkommen. Wenn du im Text ein Zitat brauchst,
  nimm einfache Zeichen wie ' ' – nie doppelte.

  Schritt-Typen pro Lektion:
    intro   { emoji, lead, body }            – sanfter Einstieg
    info    { emoji, lead, body }            – Psychoedukation (warum)
    quiz    { q, opts:[...], multi:true? }   – Selbstreflexion, kein richtig/falsch
    plan    { lead, body }                   – Wenn-dann-Plan
    reflect { emoji, lead, body }            – kurze Reflexion
    reward  { note? }                        – Abschluss, Serie bleibt geschuetzt
    breath  { }                              – Atem-Uebung einblenden
    ground  { }                              – 5-4-3-2-1-Erdung einblenden
*/
window.ANKER_DATA = {
  units: [
    {
      id: "u1",
      title: "Einheit 1 · Grundlagen",
      color: "lav",
      lessons: [
        {
          id: "sensorik-profil",
          title: "Mein sensorisches Profil",
          label: "Sensorisches Profil",
          icon: "🧩",
          steps: [
            { type:"intro", emoji:"🧩", lead:"Mein sensorisches Profil", body:"Kurz und in deinem Tempo. Du lernst, welche Reize dich stärken und welche dich auslaugen. Jederzeit pausierbar – dein Fortschritt bleibt." },
            { type:"info", emoji:"💡", lead:"Warum das hilft", body:"Autistische Wahrnehmung ist oft hyper- oder hyposensibel – mal zu viel, mal zu wenig. Wer sein Profil kennt, kann Umgebungen vorab anpassen, statt erst im Überlastungsmoment zu reagieren." },
            { type:"quiz", q:"Welcher Reiz ist für dich am ehesten zu viel?", opts:["Geräusche / Stimmengewirr","Grelles oder flackerndes Licht","Berührung / enge Kleidung","Gerüche","Mehrere gleichzeitig"] },
            { type:"quiz", q:"Was tut dir sensorisch gut? (mehrere möglich)", multi:true, opts:["Fester Druck / Gewicht","Gedämpftes Licht","Wiederkehrende Geräusche / Musik","Bewegung (Wippen, Schaukeln)","Ruhe & Dunkelheit"] },
            { type:"plan", lead:"Mini-Plan", body:"Wenn ich in eine neue Umgebung komme, dann prüfe ich zuerst Licht und Geräusch – und nehme mein wichtigstes Hilfsmittel (z. B. Kopfhörer) mit." },
            { type:"reward", note:"Du kennst deine Reize jetzt besser – das ist die Basis für alles Weitere." }
          ]
        },
        {
          id: "warnzeichen",
          title: "Meine Warnzeichen",
          label: "Meine Warnzeichen",
          icon: "⚠️",
          steps: [
            { type:"intro", emoji:"⚠️", lead:"Meine Warnzeichen", body:"Überlastung kommt selten aus dem Nichts. Dein Körper sendet Frühsignale – wir machen sie sichtbar, bevor es kippt." },
            { type:"info", emoji:"💡", lead:"Warum das hilft", body:"Zwischen scheinbar okay und einem Meltdown oder Shutdown liegt eine Frühwarnphase. Wer seine eigenen Signale früh erkennt, kann gegensteuern, solange Regulation noch leicht ist." },
            { type:"quiz", q:"Woran merkst du zuerst, dass es zu viel wird? (mehrere möglich)", multi:true, opts:["Reizbarkeit / dünne Haut","Tunnelblick, Gedanken werden eng","Worte fallen schwerer","Körper: Anspannung, Herzklopfen","Rückzugswunsch, Lärm dröhnt"] },
            { type:"plan", lead:"Mini-Plan", body:"Wenn ich zwei meiner Frühzeichen gleichzeitig bemerke, dann werte ich das als Stopp-Signal und reduziere sofort einen Reiz – nicht erst später." },
            { type:"reflect", emoji:"📝", lead:"Kurz festhalten", body:"Welches Zeichen kommt bei dir am frühesten? Genau das ist dein persönlicher Frühwarnknopf." },
            { type:"reward", note:"Deine Frühzeichen sind jetzt benannt – du wirst sie ab jetzt eher bemerken." }
          ]
        },
        {
          id: "loeffel",
          title: "Energie & Löffel",
          label: "Energie & Löffel",
          icon: "🥄",
          steps: [
            { type:"intro", emoji:"🥄", lead:"Was sind Löffel?", body:"Die Löffel-Theorie ist ein einfaches Bild für begrenzte Tagesenergie. Jede Aufgabe kostet Löffel – und sie sind nicht unbegrenzt." },
            { type:"info", emoji:"💡", lead:"Warum das hilft", body:"Maskieren, soziale Situationen und Reizfilterung kosten autistische Menschen oft unsichtbar viel Energie. Das Löffel-Bild macht diese Kosten planbar – statt sich zu wundern, warum man so früh erschöpft ist." },
            { type:"quiz", q:"Was kostet dich die meisten Löffel?", opts:["Soziale Termine / Smalltalk","Unerwartete Planänderungen","Laute, volle Orte","Maskieren / normal wirken","Viele kleine Entscheidungen"] },
            { type:"plan", lead:"Mini-Plan", body:"Wenn ich morgens meine Löffel einschätze, dann plane ich höchstens eine löffel-teure Sache pro Tag – und lasse danach bewusst Puffer." },
            { type:"reward", note:"Du planst ab jetzt mit deiner echten Energie, nicht gegen sie." }
          ]
        },
        {
          id: "reizueberflutung",
          title: "Reizüberflutung verstehen",
          label: "Reizüberflutung",
          icon: "🌊",
          steps: [
            { type:"intro", emoji:"🌊", lead:"Reizüberflutung verstehen", body:"Wenn zu viele Reize gleichzeitig kommen, kann das Nervensystem sie nicht mehr sortieren. Das ist kein Versagen – das ist Biologie." },
            { type:"info", emoji:"💡", lead:"Warum das hilft", body:"Bei Überflutung schaltet das Gehirn vom Denk- in den Schutzmodus. Zu wissen, dass das ein körperlicher Zustand ist (kein Charakterfehler), nimmt Scham – und macht Gegenmaßnahmen leichter." },
            { type:"quiz", q:"Was hilft dir am schnellsten, Reize zu senken?", opts:["Geräusche weg (Kopfhörer/Ohrstöpsel)","Licht runter / Augen schließen","Raum wechseln","Fester Druck / etwas Schweres","Bewegung / Stimming"] },
            { type:"plan", lead:"Mini-Plan", body:"Wenn ich Überflutung spüre, dann nehme ich genau einen Reiz weg, bevor ich irgendetwas anderes versuche – ein Reiz weniger ist schon Entlastung." },
            { type:"reward", note:"Du verstehst jetzt, was in dir passiert – und hast einen ersten Hebel." }
          ]
        },
        {
          id: "rueckzugsplan",
          title: "Dein Rückzugsplan",
          label: "Rückzugsplan",
          icon: "🏠",
          steps: [
            { type:"intro", emoji:"🏠", lead:"Dein Rückzugsplan", body:"Ein fester, im Voraus gewählter Rückzugsort. Damit du im Stress nicht erst suchen musst – die Entscheidung ist schon getroffen." },
            { type:"info", emoji:"💡", lead:"Warum das hilft", body:"Ein verlässlicher Rückzugsort senkt die Reizlast, bevor sie kippt. Dein Nervensystem lernt: Hier ist sicher. Das beugt Meltdowns und Shutdowns vor." },
            { type:"quiz", q:"Was ist gerade dein realistischster Rückzugsort?", opts:["Mein Bett / Zimmer","Auto","Toilette (auch bei der Arbeit)","Kopfhörer auf = mein Ort","Draußen / frische Luft"] },
            { type:"plan", lead:"Mini-Plan", body:"Wenn ich merke, dass es zu viel wird, dann gehe ich an meinen Rückzugsort und bleibe, bis mein Körper ruhiger ist." },
            { type:"reward", note:"Dein Rückzugsplan steht – ein sicherer Ort, schon vorab entschieden." }
          ]
        }
      ]
    },
    {
      id: "u2",
      title: "Einheit 2 · Selbstregulation",
      color: "amber",
      lessons: [
        {
          id: "box-atmung",
          title: "Box-Atmung",
          label: "Box-Atmung",
          icon: "🌬️",
          steps: [
            { type:"intro", emoji:"🌬️", lead:"Box-Atmung", body:"Eine ruhige Atemtechnik in vier gleichen Phasen. Sie wirkt direkt auf dein Nervensystem – ganz ohne Nachdenken." },
            { type:"info", emoji:"💡", lead:"Warum das hilft", body:"Langsames Ausatmen aktiviert den Parasympathikus, deinen Beruhigungsnerv. Vier gleich lange Phasen geben dem Kopf zusätzlich eine vorhersehbare Struktur." },
            { type:"breath" },
            { type:"plan", lead:"Mini-Plan", body:"Wenn ich Anspannung im Körper merke, dann mache ich vier Runden Box-Atmung, bevor ich weitermache." },
            { type:"reward", note:"Du hast ein Werkzeug, das immer dabei ist – deine Atmung." }
          ]
        },
        {
          id: "stimming",
          title: "Stimming bewusst nutzen",
          label: "Stimming nutzen",
          icon: "✋",
          steps: [
            { type:"intro", emoji:"✋", lead:"Stimming bewusst nutzen", body:"Wippen, Hände bewegen, summen, etwas drehen – Stimming ist Selbstregulation. Es ist Hilfe, nicht Störung." },
            { type:"info", emoji:"💡", lead:"Warum das hilft", body:"Stimming reguliert Anspannung und hilft, Reize zu verarbeiten. Es zu unterdrücken kostet Energie und kann Überlastung verstärken. Bewusst eingesetzt ist es ein verlässliches Werkzeug." },
            { type:"quiz", q:"Welches Stimming tut dir gut? (mehrere möglich)", multi:true, opts:["Wippen / Schaukeln","Kneten / Fidget","Summen / Geräusche","Hand-Flapping","Etwas Weiches berühren"] },
            { type:"plan", lead:"Mini-Plan", body:"Wenn ich Anspannung spüre, dann erlaube ich mir bewusst mein Stimming – statt es zu unterdrücken." },
            { type:"reward", note:"Stimming ist ab jetzt ein Werkzeug in deinem Koffer, kein Makel." }
          ]
        },
        {
          id: "erdung-54321",
          title: "5-4-3-2-1 Erdung",
          label: "5-4-3-2-1 Erdung",
          icon: "🖐️",
          steps: [
            { type:"intro", emoji:"🖐️", lead:"5-4-3-2-1 Erdung", body:"Eine kurze Übung, die dich über die Sinne zurück ins Hier und Jetzt holt – gut bei Gedankenkreisen oder beginnender Überflutung." },
            { type:"info", emoji:"💡", lead:"Warum das hilft", body:"Die Aufmerksamkeit auf konkrete Sinneswahrnehmungen zu lenken, unterbricht Grübelschleifen und holt das Nervensystem aus dem Alarm zurück in die Gegenwart." },
            { type:"ground" },
            { type:"plan", lead:"Mini-Plan", body:"Wenn meine Gedanken kreisen oder es zu viel wird, dann mache ich 5-4-3-2-1, in meinem Tempo." },
            { type:"reward", note:"Du kannst dich jederzeit über deine Sinne erden." }
          ]
        },
        {
          id: "koerpersignale",
          title: "Körpersignale lesen",
          label: "Körpersignale (Interozeption)",
          icon: "🫀",
          steps: [
            { type:"intro", emoji:"🫀", lead:"Körpersignale lesen", body:"Interozeption ist die Wahrnehmung von Hunger, Durst, Müdigkeit, Anspannung. Bei vielen autistischen Menschen ist sie gedämpft – das lässt sich üben." },
            { type:"info", emoji:"💡", lead:"Warum das hilft", body:"Wer Körpersignale früh bemerkt, kann gegensteuern, bevor aus Hunger Gereiztheit oder aus Anspannung Überlastung wird. Regelmäßige kleine Check-ins schärfen die Wahrnehmung." },
            { type:"quiz", q:"Welches Körpersignal übersiehst du am ehesten?", opts:["Hunger / Durst","Müdigkeit","Toilettendrang","Anspannung / Stress","Schmerz"] },
            { type:"plan", lead:"Mini-Plan", body:"Wenn die App mich erinnert, dann halte ich kurz inne und frage: Hunger? Durst? Spannung? – und versorge das Signal." },
            { type:"reward", note:"Du hörst deinem Körper ab jetzt bewusster zu." }
          ]
        },
        {
          id: "uebergaenge",
          title: "Übergänge & Wechsel",
          label: "Übergänge meistern",
          icon: "🔄",
          steps: [
            { type:"intro", emoji:"🔄", lead:"Übergänge & Wechsel", body:"Von einer Tätigkeit zur nächsten zu wechseln kann anstrengend sein. Mit etwas Struktur werden Übergänge leichter." },
            { type:"info", emoji:"💡", lead:"Warum das hilft", body:"Wechsel verlangen vom Gehirn Umschalten – das kostet bei autistischen Menschen oft mehr Energie. Vorwarnung und feste Rituale machen Übergänge vorhersehbar und damit leichter." },
            { type:"quiz", q:"Was macht dir Übergänge schwer?", opts:["Abrupt aufhören müssen","Unklar, was als Nächstes kommt","Zu viele Wechsel hintereinander","Etwas Schönes verlassen müssen"] },
            { type:"plan", lead:"Mini-Plan", body:"Wenn ein Wechsel ansteht, dann gebe ich mir eine Vorwarnung (z. B. Timer) und ein kleines Abschlussritual, bevor ich umschalte." },
            { type:"reward", note:"Übergänge sind ab jetzt planbarer – Schritt für Schritt." }
          ]
        }
      ]
    },
    {
      id: "u3",
      title: "Einheit 3 · Burnout-Prävention",
      color: "coral",
      lessons: [
        {
          id: "pacing",
          title: "Pacing lernen",
          label: "Pacing",
          icon: "⚖️",
          steps: [
            { type:"intro", emoji:"⚖️", lead:"Pacing lernen", body:"Pacing heißt: Energie gleichmäßig einteilen, statt in guten Phasen zu überziehen und dann zu kollabieren." },
            { type:"info", emoji:"💡", lead:"Warum das hilft", body:"Der Boom-and-Bust-Zyklus – an guten Tagen alles geben, danach tagelang ausfallen – ist ein Hauptweg in den autistischen Burnout. Gleichmäßiges Tempo schützt deine Reserven." },
            { type:"quiz", q:"Wann überziehst du am ehesten?", opts:["An guten Tagen mache ich alles auf einmal","Ich höre erst auf, wenn ich nicht mehr kann","Ich plane keine Pausen ein","Ich sage zu viel zu"] },
            { type:"plan", lead:"Mini-Plan", body:"Wenn ich einen guten Tag habe, dann mache ich trotzdem eine Pause – gerade dann, weil ich mich gut fühle." },
            { type:"reward", note:"Du lernst, mit deiner Energie zu haushalten statt sie zu verheizen." }
          ]
        },
        {
          id: "low-demand",
          title: "Low-Demand-Tag",
          label: "Low-Demand-Tag",
          icon: "🌙",
          steps: [
            { type:"intro", emoji:"🌙", lead:"Low-Demand-Tag", body:"Ein bewusst anspruchsarmer Tag: weniger Anforderungen, weniger Entscheidungen, mehr Erholung. Kein Luxus – Wartung." },
            { type:"info", emoji:"💡", lead:"Warum das hilft", body:"Geplante Tage mit niedriger Anforderung füllen Reserven auf, bevor sie leer sind. Vorbeugende Erholung verhindert Zusammenbrüche besser als nachträgliche." },
            { type:"quiz", q:"Was gehört für dich auf einen Low-Demand-Tag?", multi:true, opts:["Keine sozialen Termine","Vertrautes Essen, keine Experimente","Lieblings-Routine / Spezialinteresse","Viel Ruhe & Reizarmut","Nichts müssen"] },
            { type:"plan", lead:"Mini-Plan", body:"Wenn meine Energie mehrere Tage niedrig ist, dann plane ich aktiv einen Low-Demand-Tag ein – bevor mein Körper ihn erzwingt." },
            { type:"reward", note:"Erholung ist ab jetzt Teil deines Plans, nicht erst die Notbremse." }
          ]
        },
        {
          id: "masking",
          title: "Masking & Energiekosten",
          label: "Masking verstehen",
          icon: "🎭",
          steps: [
            { type:"intro", emoji:"🎭", lead:"Masking & Energiekosten", body:"Masking ist das ständige Anpassen, um normal zu wirken – Blickkontakt erzwingen, Stimming unterdrücken, Reaktionen kontrollieren. Es kostet enorm viel." },
            { type:"info", emoji:"💡", lead:"Warum das hilft", body:"Dauerhaftes Masking ist eng mit autistischem Burnout und Erschöpfung verknüpft. Sichere Räume, in denen du nicht maskieren musst, sind echte Erholung – kein bloßes Gehenlassen." },
            { type:"quiz", q:"Wo könntest du etwas weniger maskieren?", opts:["Zu Hause / allein","Bei wenigen vertrauten Menschen","In Pausen bei der Arbeit","Online / schriftlich","Noch nirgends – das ist okay"] },
            { type:"plan", lead:"Mini-Plan", body:"Wenn ich in einem sicheren Raum bin, dann erlaube ich mir bewusst, weniger zu maskieren – als aktive Erholung." },
            { type:"reward", note:"Du siehst die unsichtbaren Kosten jetzt klarer – und darfst sie senken." }
          ]
        },
        {
          id: "grenzen",
          title: "Grenzen setzen",
          label: "Nein sagen lernen",
          icon: "🚧",
          steps: [
            { type:"intro", emoji:"🚧", lead:"Grenzen setzen", body:"Nein sagen, ohne dich zu erklären oder zu entschuldigen. Eine Fähigkeit, die man üben kann – und die Löffel spart." },
            { type:"info", emoji:"💡", lead:"Warum das hilft", body:"Jedes Ja, das eigentlich ein Nein ist, kostet Energie und füllt deinen Tag mit löffel-teuren Dingen. Klare Grenzen sind direkter Burnout-Schutz." },
            { type:"quiz", q:"Welcher Satz fühlt sich für dich machbar an?", opts:["Das passt gerade nicht für mich.","Ich melde mich, wenn ich Kapazität habe.","Nein, danke.","Ich brauche das schriftlich, um zu antworten."] },
            { type:"plan", lead:"Mini-Plan", body:"Wenn mich etwas überfordert, dann sage ich einen meiner vorbereiteten Sätze – ohne lange Rechtfertigung." },
            { type:"reward", note:"Du hast Sätze in der Tasche, die deine Energie schützen." }
          ]
        }
      ]
    }
  ],

  // Sofort-Hilfe Tools (Tab Beruhigen)
  tools: {
    breath: { title:"Box-Atmung" },
    ground: { title:"5-4-3-2-1 Erdung" },
    sensory: {
      title:"Reize runter",
      intro:"Schnell-Set gegen Überflutung – tipp ab, was du machst:",
      items:["Kopfhörer auf / Ohrstöpsel","Licht dimmen oder Sonnenbrille","An einen ruhigeren Ort","Etwas Schweres / fester Druck","Schluck Wasser","Augen 30 Sek. schließen"]
    },
    stim: {
      title:"Stimming",
      lead:"Stimming ist erlaubt.",
      body:"Wippen, Hände bewegen, etwas drehen – das reguliert dein Nervensystem. Es ist Hilfe, nicht Störung. Wähle, was dir guttut.",
      items:["Wippen","Kneten / Fidget","Summen","Hand-Flapping","Etwas Weiches"]
    },
    sos: {
      title:"Notfallkarte",
      cards:[
        { h:"Frühzeichen", p:"Reizbarkeit, Tunnelblick, Worte fehlen." },
        { h:"Sofort", p:"Reize weg · nichts entscheiden müssen · Wasser · fester Druck · Satz ans Umfeld: Ich brauche kurz Pause, das liegt nicht an dir." },
        { h:"Danach", p:"Keine großen Aufgaben. Erholung braucht Zeit – das ist okay." }
      ]
    }
  },

  // Frühwarnzeichen (Tab Energie)
  warnSigns: ["Reizbarkeit","Tunnelblick","Schlaf schlecht","Worte fehlen","Sozial überlastet","Kopf dröhnt"],

  // Profil (Tab Ich) – Startwerte, in der App editierbar
  profile: {
    name: "Lea",
    subtitle: "AuDHD · Level 1–2",
    strengths: ["Tiefe Fokussierung","Mustererkennung","Ehrlichkeit"],
    triggers: ["Grelles Licht","Spontane Pläne","Stimmengewirr"],
    helps: ["Noise-Cancelling","Feste Routine","Rückzugsort"]
  }
};
