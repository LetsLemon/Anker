/* Anker · Inhalte für Säule 2 „Alltag erleichtern".
   Reiner Inhalt, getrennt vom Code – du (oder eine KI) darfst alles frei bearbeiten.
   WICHTIG: keine geraden Anführungszeichen (Zeichen ") INNERHALB der Texte verwenden,
   sie beenden sonst den Text-String. Umlaute (ä ö ü ß) sind in Ordnung. */
window.ANKER_ALLTAG = {

  /* 1) Tag nach Energie -------------------------------------------------- */
  energy: {
    intro: "Wie viel hast du heute? Tippe an, was am ehesten stimmt. Es darf sich im Lauf des Tages ändern.",
    levels: {
      voll: {
        label: "Viel", emoji: "☀️",
        head: "Heute ist Raum.",
        okay: ["Etwas Neues anfangen, wenn du magst", "Eine größere Aufgabe angehen", "Soziales, das dir gut tut", "Etwas tun, das dir Freude macht"],
        wait: ["Trotzdem Pausen einplanen", "Nicht den ganzen Akku auf einmal verbrauchen"],
        anchor: "Auch an vollen Tagen ist eine Pause kein verlorener Schritt."
      },
      mittel: {
        label: "Mittel", emoji: "🌤️",
        head: "Such dir eine Sache aus.",
        okay: ["Eine wichtige Aufgabe, nicht zehn", "Kurze, planbare Wege", "Etwas Ruhiges für zwischendurch"],
        wait: ["Alles, was warten kann, darf warten", "Spontane Extra-Termine"],
        anchor: "Eine Sache reicht völlig. Das ist kein kleiner Tag, das ist ein kluger Tag."
      },
      wenig: {
        label: "Wenig", emoji: "🌥️",
        head: "Nur das Nötige.",
        okay: ["Essen und trinken", "Eine Mini-Aufgabe, wenn überhaupt", "Reize klein halten"],
        wait: ["Aufschiebbares aufschieben", "Soziales, das anstrengt"],
        anchor: "Heute zählt schon: für dich sorgen. Mehr musst du nicht."
      },
      leer: {
        label: "Leer", emoji: "🌧️",
        head: "Schutzmodus.",
        okay: ["Liegen und atmen", "Etwas Vertrautes ohne Anstrengung", "Die Beruhigen-Tools nutzen"],
        wait: ["Alle Forderungen an dich", "Erklärungen – du schuldest niemandem eine"],
        anchor: "Ein leerer Akku ist kein Versagen. Da sein ist heute genug."
      }
    }
  },

  /* 2) Übergänge (Transitionshilfe) -------------------------------------- */
  transitions: [
    {
      id: "losgehen", icon: "🚪", title: "Ich muss gleich los",
      lead: "Ein Wechsel nach draußen. Wir machen ihn in kleinen Stücken.",
      steps: [
        "Atme einmal langsam aus. Du hast Zeit für diesen Moment.",
        "Sag dir, wann du wirklich los musst – und dass jetzt noch nicht ist.",
        "Leg bereit, was mitkommt: Schlüssel, Handy, Karte, Kopfhörer.",
        "Zieh dich Schritt für Schritt an. Erst Schuhe, dann Jacke.",
        "Wenn draußen die Reize zu viel werden: Kopfhörer auf, Blick nach unten."
      ],
      closer: "Du musst nicht in einer Sekunde umschalten. Ein Schritt nach dem anderen."
    },
    {
      id: "heimkommen", icon: "🏠", title: "Ich komme nach Hause",
      lead: "Der Tag war voll. Jetzt darf dein Nervensystem runterfahren.",
      steps: [
        "Tür zu. Du bist jetzt in deinem sicheren Raum.",
        "Erst nichts. Steh oder sitz einfach einen Moment.",
        "Zieh enge oder kratzige Kleidung aus, etwas Weiches an.",
        "Mach es dunkler und leiser, wenn das gut tut.",
        "Trink etwas. Dein Körper hat den ganzen Tag mitgetragen."
      ],
      closer: "Du musst nach dem Heimkommen nichts leisten. Ankommen darf dauern."
    },
    {
      id: "bildschirm-schlaf", icon: "🌙", title: "Vom Bildschirm zum Schlaf",
      lead: "Vom hellen, wachen Zustand in den Schlaf ist ein großer Sprung. Wir bauen eine Brücke.",
      steps: [
        "Setz dir einen letzten Punkt: speichern, pausieren, abschließen.",
        "Bildschirm dunkler stellen oder weglegen.",
        "Eine kleine Sache zum Runterkommen: Wasser, Zähne, Licht dimmen.",
        "Etwas Gleichmäßiges für die Ohren oder die Hände, wenn das hilft.",
        "Hinlegen ist genug. Du musst nicht sofort einschlafen."
      ],
      closer: "Der Kopf braucht Zeit, vom Wachsein loszulassen. Das ist normal, kein Fehler."
    },
    {
      id: "aufstehen", icon: "☀️", title: "Vom Bett in den Tag",
      lead: "Der erste Wechsel des Tages ist oft der schwerste. Klein anfangen.",
      steps: [
        "Augen auf reicht für den Anfang. Noch nichts müssen.",
        "Streck dich, beweg Finger und Füße.",
        "Setz dich an die Bettkante. Nur das.",
        "Trink einen Schluck Wasser.",
        "Eine erste winzige Sache: Vorhang auf oder Füße auf den Boden."
      ],
      closer: "Du musst nicht ausgeruht sein, um anzufangen. Ein Schritt zählt schon."
    },
    {
      id: "aufhoeren", icon: "🎮", title: "Etwas Schönes beenden",
      lead: "Von etwas wegzugehen, das gut tut, kann sich fast schmerzhaft anfühlen. Das ist echt.",
      steps: [
        "Sag dir: Ich höre nicht für immer auf, nur für jetzt.",
        "Setz einen sauberen Schlusspunkt – Ende der Folge, Speicherpunkt, Kapitelende.",
        "Sag dir innerlich, wann du weitermachen darfst.",
        "Steh auf und beweg dich kurz, das hilft beim Umschalten."
      ],
      closer: "Schwer aufzuhören heißt nicht, dass du etwas falsch machst. Es heißt, es war dir wichtig."
    }
  ],

  /* 3) Aufgabe in Mini-Schritte ------------------------------------------ */
  tasks: [
    {
      id: "duschen", icon: "🚿", title: "Duschen",
      steps: [
        { t: "Handtuch bereitlegen", n: "Nur das. Mehr noch nicht." },
        { t: "Wasser anstellen und warm werden lassen" },
        { t: "Reingehen – 5 Minuten reichen völlig" },
        { t: "Danach direkt ins Handtuch, warm einpacken" }
      ],
      closer: "Auch kurz zählt voll. Geschafft ist geschafft."
    },
    {
      id: "zaehne", icon: "😁", title: "Zähne putzen",
      steps: [
        { t: "Zur Bürste gehen, mehr nicht" },
        { t: "Wasser und Paste bereit" },
        { t: "Putzen – auch 30 Sekunden sind besser als nichts", n: "Kein perfekt nötig." },
        { t: "Ausspülen, fertig" }
      ],
      closer: "Niedrige Hürde, echter Schritt. Gut gemacht."
    },
    {
      id: "essen", icon: "🍝", title: "Etwas essen machen",
      steps: [
        { t: "Entscheide: warm oder kalt, egal was", n: "Das Einfachste ist erlaubt." },
        { t: "Hol die Zutaten oder die Packung" },
        { t: "Zubereiten oder aufwärmen" },
        { t: "Hinsetzen und essen, in deinem Tempo" }
      ],
      closer: "Essen ist Selbstfürsorge, kein Luxus. Dein Körper dankt es dir."
    },
    {
      id: "einkaufen", icon: "🛒", title: "Einkaufen",
      steps: [
        { t: "Kurze Liste machen, nur das Wichtigste", n: "Drei Dinge reichen für den Anfang." },
        { t: "Kopfhörer und Tasche bereitlegen" },
        { t: "Hingehen, Liste abarbeiten, nicht umsehen müssen" },
        { t: "Zahlen und raus. Selbstbedienungskasse ist okay." }
      ],
      closer: "Du musst nicht den Wocheneinkauf schaffen. Das Nötige reicht."
    },
    {
      id: "waesche", icon: "🧺", title: "Wäsche",
      steps: [
        { t: "Wäsche grob einsammeln, nicht sortieren müssen" },
        { t: "In die Maschine, Mittel rein, anstellen" },
        { t: "Timer im Kopf oder am Handy setzen" },
        { t: "Später aufhängen – auch morgen ist okay" }
      ],
      closer: "In Etappen ist völlig in Ordnung. Niemand schaut zu."
    },
    {
      id: "abwasch", icon: "🍽️", title: "Abwasch",
      steps: [
        { t: "Nur fünf Teile vornehmen, nicht alles" },
        { t: "Wasser anstellen oder Spülmaschine öffnen" },
        { t: "Die fünf Teile schaffen" },
        { t: "Noch Kraft? Fünf weitere. Wenn nicht: auch gut." }
      ],
      closer: "Ein Teil ist mehr als null. Du machst das."
    },
    {
      id: "nachricht", icon: "📱", title: "Eine Nachricht beantworten",
      steps: [
        { t: "Nachricht einmal lesen, ohne sofort antworten zu müssen" },
        { t: "Stichworte: Was ist der Kern der Antwort?" },
        { t: "Kurz reicht. Ein Satz ist eine vollständige Antwort.", n: "Du schuldest keinen langen Text." },
        { t: "Abschicken. Fertig ist besser als perfekt." }
      ],
      closer: "Spät geantwortet ist beantwortet. Das zählt."
    }
  ],

  /* 4) Termin vorbereiten ------------------------------------------------ */
  appointment: {
    intro: "Ein Termin steht an. Wir gehen ihn einmal vorher durch, dann ist weniger Unbekanntes dabei. Stichworte reichen.",
    fields: [
      { key: "ort",      label: "Wo ist es?",                hint: "Adresse, Raum, Stockwerk" },
      { key: "weg",      label: "Wie komme ich hin?",        hint: "Bus, Bahn, zu Fuß – und wann ich losgehe" },
      { key: "sagen",    label: "Was will ich sagen?",       hint: "Stichworte. Du darfst sie vor Ort ablesen." },
      { key: "ablehnen", label: "Was darf ich ablehnen?",    hint: "Du musst nicht alles mitmachen oder beantworten." },
      { key: "danach",   label: "Was brauche ich danach?",   hint: "Ruhe, Reizpause, etwas Schönes" }
    ],
    closer: "Du darfst diese Karte beim Termin offen haben – auch auf dem Handy. Vorbereitung ist kein Schummeln."
  },

  /* 5) Soziale Skripte --------------------------------------------------- */
  scripts: [
    {
      id: "absagen", icon: "🙏", title: "Absagen",
      text: "Danke für die Einladung, das freut mich wirklich. Ich schaffe es diesmal nicht und brauche den Tag für mich, um aufzutanken. Lass uns gern einen ruhigeren Zeitpunkt finden."
    },
    {
      id: "grenze", icon: "✋", title: "Grenze setzen",
      text: "Ich merke, dass mir das gerade zu viel wird. Ich brauche eine Pause und kann jetzt nicht weiterreden. Das hat nichts mit dir zu tun. Ich melde mich, wenn es mir besser geht."
    },
    {
      id: "arzt", icon: "🩺", title: "Termin per Mail vereinbaren",
      text: "Guten Tag, ich möchte gern einen Termin vereinbaren. Telefonieren fällt mir schwer, deshalb schreibe ich. Bitte teilen Sie mir mögliche Termine per Mail mit. Vielen Dank."
    },
    {
      id: "krank", icon: "🤒", title: "Krankmeldung",
      text: "Guten Morgen, ich bin heute krank und kann nicht kommen. Ich melde mich, sobald ich wieder einsatzfähig bin. Danke für Ihr Verständnis."
    },
    {
      id: "ueberlastung", icon: "🌫️", title: "Überforderung erklären",
      text: "Mir wird es gerade zu viel, zu viele Reize auf einmal. Das heißt nicht, dass etwas falsch ist. Ich brauche kurz Ruhe und weniger Fragen. Mit etwas Zeit geht es wieder."
    },
    {
      id: "smalltalk", icon: "💬", title: "Smalltalk beenden",
      text: "Es war schön, mit dir zu reden. Ich muss jetzt weiter und verabschiede mich. Bis bald."
    },
    {
      id: "bedenkzeit", icon: "⏳", title: "Um Bedenkzeit bitten",
      text: "Ich möchte da nichts Falsches sagen und brauche kurz Zeit zum Nachdenken. Ich melde mich bis morgen mit einer Antwort. Ist das okay für dich?"
    }
  ]
};
