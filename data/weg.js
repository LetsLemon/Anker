/* Anker · „Dein Weg" – mehrwöchiges Selbsthilfe-Programm (ersetzt den alten Pfad).
   Aufbau je Tag: Ziel · Dauer · Material · Aufgabe(n) · Reflexion · Festhalten.
   Block-Typen: intro · read · write · goals · microgoals · who5 · reflect · done.
   read.body und write.example dürfen ein Array (mehrere Absätze/Zeilen) sein.
   KEINE geraden Anführungszeichen (") im Text. */
window.ANKER_WEG = {
  weeksTotal: 12,

  who5: {
    intro: "Wie ging es dir in den letzten zwei Wochen? Tippe pro Zeile an, was am ehesten stimmt. Es gibt keine richtigen Antworten – nur deinen ehrlichen Startwert.",
    items: [
      "war ich froh und guter Laune",
      "habe ich mich ruhig und entspannt gefühlt",
      "habe ich mich energisch und aktiv gefühlt",
      "habe ich mich beim Aufwachen frisch und ausgeruht gefühlt",
      "war mein Alltag voller Dinge, die mich interessieren"
    ],
    scale: ["zu keiner Zeit", "ab und zu", "etwas weniger als die Hälfte der Zeit", "etwas mehr als die Hälfte der Zeit", "meistens", "die ganze Zeit"]
  },

  weeks: [
    {
      num: 1,
      title: "Verstehen, entlasten, ankommen",
      goal: "Ein gemeinsames Vokabular schaffen, von Selbstabwertung zu Selbstverständnis kommen – und anfangen, dich zu beobachten.",
      days: [
        {
          n: 1, title: "Startpunkt & Ausgangslage",
          ziel: "Eine ehrliche Standortbestimmung – ganz ohne Wertung.",
          dauer: "~10 Min", material: "Wohlbefinden-Check · Profil · Journal",
          blocks: [
            { t:"intro", body:"Heute legen wir nur den Startpunkt fest. Es gibt nichts zu schaffen und nichts richtig zu machen – nur einen ehrlichen Blick: Wo stehst du gerade? In ein paar Wochen schaust du genau hierauf zurück, und das wird dir mehr zeigen als jeder Ratschlag." },
            { t:"who5", lead:"Kurzer Wohlbefinden-Check" },
            { t:"write", lead:"Wo drückt es gerade?",
              body:"Schreib es ruhig roh und ehrlich – das liest niemand außer dir, es geht nicht um schöne Sätze, sondern um einen klaren Startpunkt.",
              example:"Am meisten zieht mich gerade die Reizüberlastung im Büro runter – nach der Arbeit bin ich oft so leer, dass ich nichts mehr schaffe. Besser wäre, abends schneller runterzukommen, ohne zwei Stunden dafür zu brauchen.",
              fields:[
                { key:"belastung", ph:"Wo schränkt mich mein Alltag aktuell am meisten ein?", rows:3 },
                { key:"besser", ph:"Was soll sich in den nächsten Wochen ein bisschen besser anfühlen?", rows:2 }
              ]},
            { t:"goals", lead:"Wähl drei Bereiche",
              body:"Nicht zehn, nur drei – sonst verzettelst du dich. Diese drei begleiten dich durch den ganzen Weg. Zum Beispiel: Reizüberlastung, Energie, soziale Erschöpfung, Schlaf, Aufgaben-Start oder Reizbarkeit." },
            { t:"reflect", q:"Was überrascht dich an deinem Ausgangspunkt?" },
            { t:"done", text:"Startpunkt gesetzt. Dein Wert und deine drei Bereiche sind gespeichert – du siehst sie ab jetzt auf deinem Weg.",
              tool:{ go:"me", action:"profile", label:"Profil ergänzen (optional)" } }
          ]
        },
        {
          n: 2, title: "Dein eigenes Muster-Modell",
          ziel: "Verstehen, wie Schwierigkeiten entstehen – als Muster, nicht als Makel.",
          dauer: "~8 Min", material: "Journal",
          blocks: [
            { t:"intro", body:"Statt mit-mir-stimmt-was-nicht schauen wir heute genau hin. Was wie ein Makel aussieht, ist meistens ein Muster – und Muster kann man verstehen und an kleinen Stellen verändern." },
            { t:"read", lead:"Das Muster hat drei Teile", body:[
              "Jede schwierige Situation läuft in drei Schritten ab: ein Auslöser (was passiert), deine Reaktion (was in dir und mit dir passiert) und die Folgen (was danach kommt).",
              "Warum das hilft: Solange alles ein einziger Klumpen ist, bleibt nur Selbstkritik. Sobald du die drei Teile trennst, siehst du Stellschrauben – und die liegen fast immer beim Auslöser oder bei den Bedingungen, nicht bei dir als Person.",
              "Und fast in jedem Muster steckt auch eine Stärke: Wer schnell überreizt ist, nimmt oft auch besonders viel und besonders fein wahr."
            ]},
            { t:"write", lead:"Drei Situationen",
              body:"Füll das Muster für drei echte Alltagssituationen aus – zum Beispiel ein voller Supermarkt, ein unerwarteter Anruf, ein durchgetakteter Tag. Schreib pro Situation kurz: Auslöser, deine Reaktion, die Folgen – und eine Stärke, die auch drinsteckt.",
              example:"Supermarkt am Samstag → Auslöser: grelles Licht, viele Menschen, Geräusche → Reaktion: ich werde hektisch und gereizt, vergesse die Hälfte → Folge: ich gehe erschöpft raus und schiebe den Rest auf. Stärke: ich merke Reize früh und genau – mit Kopfhörern und Einkaufsliste wird es viel leichter.",
              fields:[
                { key:"s1", ph:"Situation 1: Auslöser → Reaktion → Folgen → Stärke", rows:2 },
                { key:"s2", ph:"Situation 2: …", rows:2 },
                { key:"s3", ph:"Situation 3: …", rows:2 }
              ]},
            { t:"reflect", q:"Was kommt eher von Überforderung – und was von der Umgebung, der fehlenden Passung?" },
            { t:"done", text:"Du hast deine ersten Muster sichtbar gemacht. Das ist die Grundlage für alles Weitere." }
          ]
        },
        {
          n: 3, title: "Entlasten: Sprache, die nicht abwertet",
          ziel: "Selbstkritik in genaue, entlastende Sprache übersetzen.",
          dauer: "~8 Min", material: "Journal",
          blocks: [
            { t:"intro", body:"Heute geht es ums Entlasten. Worte, die du jahrelang über dich gehört oder gedacht hast, werden zum Selbstbild. Wir tauschen abwertende Sprache gegen genaue." },
            { t:"read", lead:"Passung statt Defekt", body:[
              "Viele vermeintliche Fehler sind keine. Sie sind eine andere Art zu verarbeiten, die in einer unpassenden Umgebung auffällt – wie ein Linkshänder mit einer Rechtshänder-Schere.",
              "Defizit-Sprache (faul, zu empfindlich, zu viel) erzeugt Scham, und Scham lähmt. Genaue Sprache beschreibt, was wirklich passiert. Das entlastet, ohne dass du die Verantwortung abgibst: Du sagst nicht, es ist egal – sondern, es ist erklärbar.",
              "Mehr Hintergrund dazu findest du jederzeit im Bereich Verstehen."
            ], quelle:"Neurodiversität · soziales Modell von Behinderung" },
            { t:"write", lead:"Schreib drei Sätze um",
              body:"Nimm drei harte Selbstkritik-Sätze und übersetze sie in genaue, faire Sprache. Behalt das Konkrete, lass die Abwertung weg.",
              example:[
                "aus: Ich bin zu empfindlich → wird: Ich nehme mehr wahr, weil mein Gehirn Reize weniger vorfiltert.",
                "aus: Ich bin faul → wird: Mir fällt der Start schwer, wenn die Belohnung weit weg ist.",
                "aus: Ich bin unzuverlässig → wird: Ohne äußere Struktur verliere ich leicht den Faden – mit Erinnerungen klappt es."
              ],
              fields:[
                { key:"r1", ph:"1. aus … wird …", rows:2 },
                { key:"r2", ph:"2. aus … wird …", rows:2 },
                { key:"r3", ph:"3. aus … wird …", rows:2 }
              ]},
            { t:"reflect", q:"Welche Sprache entlastet dich – ohne dass du die Verantwortung abgibst?" },
            { t:"done", text:"Drei Sätze umgeschrieben. Sprache verändert, wie du dich siehst – langsam, aber echt." }
          ]
        },
        {
          n: 4, title: "Ziele winzig & machbar machen",
          ziel: "Aus vagen Wünschen kleine, startbare Mikroziele machen.",
          dauer: "~8 Min", material: "Journal",
          blocks: [
            { t:"intro", body:"Große Ziele kann man nicht anfangen – winzige schon. Heute machen wir aus deinen drei Bereichen konkrete, kleine Schritte." },
            { t:"read", lead:"Klein, sichtbar, startbar", body:[
              "Ein Ziel wie weniger überlastet sein ist nicht machbar – du kannst es nicht anfangen und nicht sehen, ob es klappt. Ein Mikroziel schon: jeden Abend 10 Minuten Reizpause mit Kopfhörern.",
              "Faustregel für jedes Mikroziel, drei Fragen: Ist es klein genug? Ist es sichtbar – kann man sehen, ob du es getan hast? Kannst du in 10 Minuten damit anfangen?",
              "Warum so klein: Dein Startsystem springt bei winzigen, klaren Schritten viel eher an als bei großen, vagen Vorsätzen. Du baust Vertrauen auf, statt dich zu überfordern."
            ]},
            { t:"microgoals", lead:"Ein Mikroziel pro Bereich",
              body:"Nimm deine drei Bereiche von Tag 1 und mach aus jedem ein winziges, konkretes Verhalten. Beispiele: Reizüberlastung → abends 10 Min Kopfhörer und Licht dimmen. Energie → fester Mittags-Block ohne Reize. Soziales → nach Treffen 30 Min Stille einplanen." },
            { t:"reflect", q:"Wo war dein Ziel bisher zu vage?" },
            { t:"done", text:"Drei Mikroziele stehen. Du siehst sie ab jetzt auf deinem Weg – als sanfte Erinnerung, nicht als Pflicht." }
          ]
        },
        {
          n: 5, title: "Dein Tages-Protokoll einrichten",
          ziel: "Eine leichte tägliche Selbstbeobachtung etablieren.",
          dauer: "~5 Min", material: "Energie-Tab · Tages-Check",
          blocks: [
            { t:"intro", body:"Du musst nichts Neues anlegen – dein Protokoll ist schon in der App eingebaut." },
            { t:"read", lead:"Der Tages-Check ist dein Protokoll", body:[
              "Im Energie-Tab gibt es genau das, was ein gutes Tagebuch braucht: Energie, Akku, Schlaf, Stress – und was dir geholfen hat. Ab heute trägst du es einmal am Tag ein, am besten abends.",
              "Das ist mehr als ein Tagebuch: Aus diesen Zeilen baut die App nach ein paar Tagen deinen Burnout-Radar und erkennt Muster, die im Alltag untergehen – zum Beispiel, dass bestimmte Wochentage dich besonders kosten.",
              "Wichtig: Kontinuität schlägt Vollständigkeit. Eine kurze Zeile jeden Tag bringt mehr als eine perfekte einmal pro Woche."
            ]},
            { t:"reflect", q:"Welche Felder fallen dir leicht – welche schwer zu spüren? (Das ist Interozeption, dazu mehr in einer späteren Woche.)" },
            { t:"done", text:"Trag den Tages-Check heute einmal vollständig ein – und ab jetzt täglich. Kontinuität, nicht Perfektion.",
              tool:{ go:"energy", action:"mehr", label:"Zum Tages-Check öffnen" } }
          ]
        },
        {
          n: 6, title: "Deine Belastungs-Ampel",
          ziel: "Früher merken, wann es kippt.",
          dauer: "~8 Min", material: "Energie-Tab · Ampel & Frühwarnzeichen",
          blocks: [
            { t:"intro", body:"Eine Ampel hilft, früher gegenzusteuern – bevor du ganz unten ankommst." },
            { t:"read", lead:"Grün · Gelb · Rot", body:[
              "Grün heißt: belastbar, Reserven da. Gelb heißt: erste Risse – mehr Fehler, innere Unruhe, schneller gereizt, Geräusche nerven mehr als sonst. Rot heißt: Überlauf – Meltdown, Shutdown, Rückzug, Tränen, Übererregung.",
              "Der ganze Trick liegt im Gelb. Im Roten kannst du nur noch schützen. Im Gelben kannst du noch steuern – aber nur, wenn du es früh erkennst.",
              "Deine Gelb-Zeichen sind andere als die von anderen Menschen. Darum schreibst du sie selbst auf – je genauer, desto früher fängst du dich."
            ]},
            { t:"write", lead:"Deine Zeichen & Reaktionen",
              body:"Schreib pro Zone drei frühe Warnzeichen und zwei Reaktionen, die dir helfen, wieder runterzukommen.",
              example:[
                "GELB bei mir: Kiefer angespannt, ich lese Sätze doppelt, jedes Geräusch nervt. Reaktion: Kopfhörer auf und 10 Min raus.",
                "ROT bei mir: Worte fallen weg, ich will nur noch weg. Reaktion: Reize ganz runter, sicherer Ort, niemandem etwas erklären müssen."
              ],
              fields:[
                { key:"gelb", ph:"GELB – 3 Warnzeichen + 2 Reaktionen", rows:3 },
                { key:"rot", ph:"ROT – 3 Warnzeichen + 2 Reaktionen", rows:3 }
              ]},
            { t:"reflect", q:"Woran merkst du Gelb früher als bisher?" },
            { t:"done", text:"Deine Ampel steht. Trag deine Gelb- und Rot-Warnzeichen gleich bei den Frühwarnzeichen ein – dann erkennt der Radar sie mit.",
              tool:{ go:"energy", action:"warn", label:"Zu Ampel & Frühwarnzeichen" } }
          ]
        },
        {
          n: 7, title: "Wochenrückblick",
          ziel: "Die Woche festigen – nicht bewerten.",
          dauer: "~8 Min", material: "Rückschau · Journal",
          blocks: [
            { t:"intro", body:"Du hast eine ganze Woche begonnen – egal, wie viele Tage du wirklich gemacht hast. Heute schauen wir sanft zurück, ohne zu bewerten." },
            { t:"read", lead:"Erst lesen, dann antworten", body:[
              "Schau dir kurz an, was du diese Woche notiert hast: deine Journal-Einträge unter Rückschau und deinen Tages-Check-Verlauf im Energie-Tab.",
              "Es geht nicht darum, eine perfekte Woche gehabt zu haben. Es geht darum zu sehen, was sich für dich echt angefühlt hat – und was du nächste Woche leichter machen kannst."
            ]},
            { t:"write", lead:"Dein Review",
              example:"Am hilfreichsten war der Tages-Check abends. Zu schwer war, jeden Tag zu schreiben – nächste Woche reicht mir oft ein Stichwort.",
              fields:[
                { key:"hilf", ph:"Was war am hilfreichsten?", rows:2 },
                { key:"schwer", ph:"Was war zu schwer?", rows:2 },
                { key:"einfacher", ph:"Was machst du nächste Woche einfacher?", rows:2 }
              ]},
            { t:"write", lead:"Zwei kleine Anker",
              body:"Leg eine winzige feste Sache für morgens und eine für abends fest – etwas, das du auch an schweren Tagen schaffst.",
              example:"Morgens: ein Glas Wasser, bevor ich aufs Handy schaue. Abends: Tages-Check und Licht dimmen.",
              fields:[
                { key:"morgen", ph:"Morgens immer: …", rows:1 },
                { key:"abend", ph:"Abends immer: …", rows:1 }
              ]},
            { t:"reflect", q:"Was willst du nicht perfektionieren – sondern nur stabil üben?" },
            { t:"done", text:"Woche 1 ist gefestigt. Stark gemacht. Als Nächstes: Bedürfnisse, Sensorik und wie du deine Umgebung gestaltest." }
          ]
        }
      ]
    }
  ]
};
