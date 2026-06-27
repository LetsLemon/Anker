/* Anker · Inhalte für „Praxis" – wiederholbare Übungen + Journal.
   Reiner Inhalt, frei bearbeitbar. KEINE geraden Anführungszeichen (") im Text. */
window.ANKER_PRAXIS = {

  exercises: [
    {
      id:"bodyscan", icon:"💆", title:"Bodyscan", sub:"Den Körper langsam durchgehen", type:"bodyscan",
      intro:"Wir gehen den Körper Stück für Stück durch – ohne etwas richtig machen zu müssen. Tippe dich in deinem Tempo weiter.",
      regions:[
        { part:"Füße", text:"Spüre deine Füße. Den Druck auf dem Boden oder der Unterlage. Du musst nichts ändern." },
        { part:"Beine", text:"Wandere zu den Beinen. Vielleicht sind sie schwer, vielleicht leicht – beides ist okay." },
        { part:"Bauch", text:"Leg die Aufmerksamkeit auf den Bauch. Wie hebt und senkt er sich beim Atmen?" },
        { part:"Brust und Schultern", text:"Brust und Schultern. Darfst du sie ein kleines Stück sinken lassen?" },
        { part:"Arme und Hände", text:"Die Arme bis in die Fingerspitzen. Spannung darf bleiben oder gehen." },
        { part:"Kiefer und Gesicht", text:"Kiefer, Stirn, Augen. Viele halten hier fest. Ein winziges Lösen reicht schon." }
      ],
      closer:"Du warst eine Weile ganz bei dir. Das war es schon."
    },
    {
      id:"nervencheck", icon:"⚖️", title:"Nervensystem-Check", sub:"Wo bist du gerade?", type:"check",
      intro:"Wo ist dein Nervensystem gerade? Zieh den Regler dahin, was am ehesten stimmt – es gibt kein falsch.",
      zones:{
        low:  { word:"eher runtergefahren", text:"Dein System ist im Sparmodus. Kein Antreiben jetzt – sanftes Andocken hilft mehr: etwas Vertrautes, Wärme, ganz leichte Bewegung oder Erden.", suggest:["erdung","bodyscan"] },
        mid:  { word:"ziemlich ausgeglichen", text:"Schön. Vielleicht magst du es einfach halten – ein paar ruhige Atemzüge reichen.", suggest:["atem"] },
        high: { word:"eher hochgefahren", text:"Viel Aktivierung im System. Reize runter und ein langes Ausatmen bringen dich am schnellsten herunter.", suggest:["atem","bodyscan"] }
      }
    },
    {
      id:"atem", icon:"🌬️", title:"Atem-Muster", sub:"Wähle, was gerade passt", type:"breath",
      patterns:[
        { name:"Box-Atmung", sub:"4 ein · 4 halten · 4 aus · 4 halten", phases:[{l:"Einatmen",s:4,sc:1.15},{l:"Halten",s:4,sc:1.15},{l:"Ausatmen",s:4,sc:0.7},{l:"Halten",s:4,sc:0.7}] },
        { name:"Beruhigend", sub:"4 ein · 7 halten · 8 aus", phases:[{l:"Einatmen",s:4,sc:1.15},{l:"Halten",s:7,sc:1.15},{l:"Ausatmen",s:8,sc:0.7}] },
        { name:"Langes Ausatmen", sub:"4 ein · 6 aus – schnell beruhigend", phases:[{l:"Einatmen",s:4,sc:1.15},{l:"Ausatmen",s:6,sc:0.7}] },
        { name:"Gleichmaß", sub:"5 ein · 5 aus – sanft ausbalancieren", phases:[{l:"Einatmen",s:5,sc:1.15},{l:"Ausatmen",s:5,sc:0.7}] }
      ]
    },
    {
      id:"erdung", icon:"🖐️", title:"Erdung 5-4-3-2-1", sub:"Mit deinen eigenen Worten", type:"grounding",
      intro:"Zurück ins Hier und Jetzt – in deinem Tempo. Benenne, was du wahrnimmst. Es muss nichts Besonderes sein.",
      senses:[
        { n:5, label:"Dinge, die du siehst" },
        { n:4, label:"Dinge, die du hörst" },
        { n:3, label:"Dinge, die du fühlst" },
        { n:2, label:"Dinge, die du riechst" },
        { n:1, label:"Sache, die du schmeckst" }
      ],
      closer:"Du bist wieder mehr hier. Das hast du gerade selbst gemacht."
    },
    {
      id:"enthaken", icon:"🍃", title:"Gedanken-Enthakung", sub:"Abstand zu einem Gedanken", type:"defusion",
      s1lead:"Welcher Gedanke hakt gerade?",
      s1:"Schreib ihn so auf, wie er in deinem Kopf klingt. Niemand außer dir liest das, und es wird nicht gespeichert.",
      s2:"Lies ihn jetzt noch einmal – aber mit diesem Anfang davor. Ganz langsam.",
      s3:"Und nun mit noch ein bisschen mehr Abstand. Merkst du den feinen Unterschied? Du bist die Person, die den Gedanken bemerkt – nicht der Gedanke selbst.",
      s4lead:"Ein Gedanke ist nur ein Gedanke",
      s4:"Kein Befehl, keine Tatsache. Er darf da sein und vorbeiziehen, ohne dass du ihm folgen musst – wie ein Blatt, das auf einem Bach davontreibt."
    },
    {
      id:"mitgefuehl", icon:"💗", title:"Selbstmitgefühl", sub:"Freundlich zu dir selbst", type:"compassion",
      s1lead:"Was ist gerade schwer?",
      s1:"Nur ein Stichwort reicht. Was drückt gerade?",
      s2:"Das ist ein Moment von Schwere. Und Schwere gehört zum Menschsein – du bist damit nicht allein, auch wenn es sich einsam anfühlt.",
      s3lead:"Was würdest du einem lieben Menschen sagen?",
      s3:"Stell dir jemanden vor, den du magst und dem es genau so geht wie dir gerade. Was würdest du ihm sagen? Schreib es – an dich gerichtet.",
      s4lead:"Für dich",
      s4:"Du darfst zu dir genauso freundlich sein wie zu anderen. Das ist nicht weich – das ist klug und stark."
    }
  ],

  journal:{
    moods:[
      { v:1, label:"sehr schwer" },
      { v:2, label:"schwer" },
      { v:3, label:"okay" },
      { v:4, label:"gut" },
      { v:5, label:"leicht" }
    ],
    prompts:[
      "Was hat dir heute gutgetan – und sei es winzig?",
      "Wo hast du heute auf dich geachtet?",
      "Was hat heute Kraft gekostet? Und was hat welche zurückgegeben?",
      "Gab es einen Moment, in dem du ganz du selbst sein konntest?",
      "Was würde dir gerade guttun – wenn du es dir erlauben würdest?",
      "Welcher Reiz war heute zu viel? Wie bist du damit umgegangen?",
      "Wofür bist du heute ein kleines bisschen dankbar?",
      "Was hast du heute gut gemacht? Auch das Kleine zählt.",
      "Wie fühlt sich dein Körper gerade an?",
      "Was möchtest du dir selbst heute sagen?",
      "Was darf morgen warten?",
      "Wann hast du dich heute am sichersten gefühlt?"
    ],
    promptsLow:[
      "Ein Wort für heute.",
      "Was war ein kleiner Lichtblick?",
      "Wie geht es dir – in drei Worten?",
      "Was brauchst du gerade?",
      "Nur da sein zählt auch. Magst du ein Wort dalassen?",
      "Ein Gefühl, das gerade da ist."
    ]
  }
};
