/* Anker · Inhalte für Säule 3 „Verstehen" (Psychoedukation).
   Frei durchstöberbare Karten – kein Schloss, keine Reihenfolge, kein Test.
   WICHTIG: keine geraden Anführungszeichen (Zeichen ") INNERHALB der Texte,
   sie beenden sonst den Text-String. Umlaute (ä ö ü ß) sind in Ordnung.
   Aufbau: groups[] -> cards[] -> pages[] ({ lead, body, list?, note? }) + takeaway. */
window.ANKER_VERSTEHEN = {
  intro: "Kurze Einheiten zum Verstehen – kein Schulstoff, kein Test. Lies in deinem Tempo, überspring, was nicht passt, komm wieder, wann du magst.",

  groups: [

    /* ===== Energie & Erschöpfung ===== */
    {
      title: "Energie & Erschöpfung",
      cards: [
        {
          id: "energie-kosten", icon: "🔋", title: "Was kostet eigentlich Energie?",
          teaser: "Warum du oft müder bist, als es von außen aussieht.", minutes: 3,
          pages: [
            { lead: "Dein Akku ist real",
              body: "Viele Dinge, die für andere nebenbei laufen, kosten dich aktiv Kraft. Das ist keine Schwäche und keine Einbildung. Dein Gehirn verarbeitet die Welt gründlicher und weniger gefiltert – das ist anstrengender." },
            { lead: "Drei große Stromfresser",
              body: "Jedes davon läuft bei dir mit Aufwand, nicht automatisch:",
              list: ["Maskieren: dich anpassen, Blickkontakt steuern, natürlich wirken", "Soziales Verarbeiten: Tonfall, Mimik, Untertöne mitlesen", "Sensorik: Licht, Geräusche, Gerüche, Stoffe filtern"] },
            { lead: "Warum es unsichtbar bleibt",
              body: "Der Aufwand passiert innen. Außen sieht man nur das Ergebnis, nicht die Arbeit dahinter. Darum verstehen andere oft nicht, warum du nach einem scheinbar normalen Tag leer bist." }
          ],
          takeaway: "Müde nach einem normalen Tag heißt nicht, dass du zu wenig kannst. Es heißt, dass du mehr getragen hast, als man sieht."
        },
        {
          id: "autistischer-burnout", icon: "🌫️", title: "Autistischer Burnout vs. normale Erschöpfung",
          teaser: "Mehr als müde – und warum der Unterschied zählt.", minutes: 4,
          pages: [
            { lead: "Nicht einfach erschöpft",
              body: "Normale Erschöpfung geht mit Schlaf und einem freien Wochenende zurück. Autistischer Burnout nicht. Er entsteht aus langer Überforderung und Dauer-Maskieren – und braucht viel länger." },
            { lead: "Woran du ihn erkennst",
              list: ["Fähigkeiten, die sonst gehen, fallen weg (sprechen, planen, Alltägliches)", "Reize, die du sonst aushältst, werden unerträglich", "Tiefe Erschöpfung, die Schlaf nicht repariert", "Mehr Meltdowns oder Shutdowns als sonst"] },
            { lead: "Warum der Unterschied wichtig ist",
              body: "Wenn du Burnout wie normale Müdigkeit behandelst – einmal ausschlafen, dann weiter wie bisher – wird es schlimmer. Burnout braucht echte, längere Entlastung und weniger Anforderungen, nicht mehr Disziplin.",
              note: "Wenn du dich hier wiedererkennst: Das ist kein Versagen. Es ist ein Signal, dass du zu lange über deiner Grenze gelaufen bist." }
          ],
          takeaway: "Burnout ist kein Charakterproblem. Es ist die Rechnung für zu lange zu viel – und sie wird durch Schutz beglichen, nicht durch Anstrengung."
        },
        {
          id: "pausen", icon: "🌿", title: "Warum Pausen keine Faulheit sind",
          teaser: "Erholung ist Teil der Arbeit, nicht ihr Gegenteil.", minutes: 3,
          pages: [
            { lead: "Pausen sind Wartung",
              body: "Dein Nervensystem arbeitet im Alltag auf hoher Last. Pausen sind kein Luxus, mit dem du dich belohnst – sie sind die Wartung, die dich überhaupt funktionieren lässt." },
            { lead: "Warum es sich falsch anfühlt",
              body: "Viele haben gelernt, dass Ruhe verdient werden muss. Bei dir kostet aber schon das Dabeisein Kraft. Du musst Erholung nicht verdienen – du brauchst sie, um nicht in den Burnout zu rutschen." },
            { lead: "Echte Pause heißt reizarm",
              body: "Am Handy scrollen ist oft keine Erholung, weil es weiter Reize liefert. Echte Pause ist weniger Input: Augen zu, Stille, etwas Vertrautes, Bewegung, Stimming." }
          ],
          takeaway: "Pausieren ist Regulation, kein Versagen. Du ruhst nicht, weil du schwach bist, sondern weil du klug mit dir umgehst."
        }
      ]
    },

    /* ===== Körper & Wahrnehmung ===== */
    {
      title: "Körper & Wahrnehmung",
      cards: [
        {
          id: "interozeption", icon: "🌡️", title: "Wenn der Körper leise spricht",
          teaser: "Hunger, Durst, Müdigkeit, Überlastung – erst spät bemerkt.", minutes: 3,
          pages: [
            { lead: "Was Interozeption ist",
              body: "Interozeption ist der Sinn für das, was in dir passiert: Hunger, Durst, volle Blase, Müdigkeit, Anspannung. Bei vielen autistischen Menschen sind diese Signale leiser oder kommen erst spät – oft erst, wenn sie schon laut sind." },
            { lead: "Wie sich das zeigt",
              list: ["Du merkst Hunger erst, wenn dir schon schlecht ist", "Du trinkst zu wenig, ohne es zu spüren", "Überlastung bemerkst du erst beim Meltdown", "Gefühle sind schwer zu benennen (das nennt man Alexithymie)"] },
            { lead: "Was hilft",
              body: "Nicht auf das Gefühl warten, sondern von außen takten: feste Zeiten für Essen und Trinken, Wecker und Erinnerungen, regelmäßige kleine Körper-Fragen wie Habe ich getrunken oder Bin ich verspannt. Die Energie- und Akku-Checks der App machen das Hinhören leichter." }
          ],
          takeaway: "Wenn du Signale spät spürst, bist du nicht achtlos. Dein Körper sendet leiser – also darfst du ihm von außen nachhelfen."
        },
        {
          id: "sensorik", icon: "🎧", title: "Sensorik: zu viel und zu wenig",
          teaser: "Warum ein normaler Raum für dich laut sein kann.", minutes: 3,
          pages: [
            { lead: "Ungefilterte Welt",
              body: "Viele autistische Gehirne filtern Reize weniger stark vor. Das Brummen der Lampe, das Etikett im Shirt, mehrere Stimmen gleichzeitig – was andere ausblenden, kommt bei dir voll an." },
            { lead: "Überempfindlich und unterempfindlich",
              body: "Du kannst bei manchen Reizen überempfindlich sein (Licht, Geräusch) und bei anderen unterempfindlich (Schmerz, Temperatur, Körperlage). Beides kann sich je nach Tag und Akku ändern." },
            { lead: "Das ist Verarbeitung, kein Drama",
              body: "Reizüberlastung ist eine körperliche Reaktion, keine Übertreibung. Reize zu reduzieren ist kein Rückzug aus der Welt, sondern Schutz, damit du überhaupt teilnehmen kannst." }
          ],
          takeaway: "Du bist nicht empfindlich im Sinne von schwach. Du nimmst mehr auf – und darfst die Lautstärke der Welt für dich runterdrehen."
        },
        {
          id: "stimming", icon: "✋", title: "Stimming: warum es hilft und gut ist",
          teaser: "Wiederholte Bewegungen sind Selbstregulation.", minutes: 2,
          pages: [
            { lead: "Was Stimming tut",
              body: "Wippen, Hände bewegen, summen, ein Wort wiederholen, mit etwas spielen – Stimming hilft deinem Nervensystem, sich zu regulieren. Es baut Anspannung ab, ordnet Reize und kann Freude ausdrücken." },
            { lead: "Warum es unterdrückt wird",
              body: "Vielen wird beigebracht, stillzuhalten, weil es anders aussieht. Stimming zu unterdrücken kostet aber Energie und nimmt dir ein wichtiges Werkzeug. Das Verstecken ist Teil des Maskierens." },
            { lead: "Es ist erlaubt",
              body: "Stimming ist nicht schädlich, solange du dich nicht verletzt. Du darfst Wege finden, die für dich gut sind – sichtbar oder diskret, laut oder leise. Es gehört dir." }
          ],
          takeaway: "Stimming ist kein Tic, den du abstellen musst. Es ist deine Art, dich zu beruhigen und auszudrücken – und sie ist okay."
        }
      ]
    },

    /* ===== Denken & Handeln ===== */
    {
      title: "Denken & Handeln",
      cards: [
        {
          id: "executive-function", icon: "▶️", title: "Wieso Aufgaben nicht starten, obwohl du willst",
          teaser: "Wollen und Können sind zwei verschiedene Schalter.", minutes: 3,
          pages: [
            { lead: "Die Lücke zwischen Wollen und Tun",
              body: "Du weißt, was zu tun ist. Du willst es sogar. Und trotzdem kommst du nicht los. Das ist keine Faulheit und kein Motivationsproblem – es sind die exekutiven Funktionen, die gerade nicht greifen." },
            { lead: "Was exekutive Funktionen sind",
              body: "Sie sind das Startsystem im Kopf: anfangen, Schritte ordnen, umschalten, dranbleiben. Bei Autismus und ADHS arbeiten sie oft unzuverlässig – besonders bei wenig Energie." },
            { lead: "Warum Druck nicht hilft",
              body: "Sich anzutreiben oder zu beschimpfen startet das System nicht, es überlastet es weiter. Was hilft: die Aufgabe winzig machen, den ersten Schritt sichtbar legen, Reize senken, jemanden danebensetzen (das nennt man Body-Doubling).",
              note: "Der Bereich Mini-Schritte im Alltag-Tab ist genau dafür gebaut." }
          ],
          takeaway: "Nicht anfangen können trotz Wollen ist eine echte neurologische Hürde, kein Willensmangel. Kleiner machen schlägt härter wollen."
        },
        {
          id: "monotropismus", icon: "🎯", title: "Warum Wechsel so anstrengen",
          teaser: "Dein Fokus ist tief – und Umschalten kostet.", minutes: 3,
          pages: [
            { lead: "Ein Kanal, dafür tief",
              body: "Viele autistische Menschen sind monotrop: Die Aufmerksamkeit fließt stark in eine Sache und geht dort in die Tiefe. Das ist eine Stärke – Konzentration, Detailtiefe, Hingabe." },
            { lead: "Warum Übergänge wehtun",
              body: "Wenn du tief in etwas drin bist, ist Herausgerissen-werden anstrengend, fast körperlich. Nicht weil du stur bist, sondern weil Umschalten echten Aufwand kostet und der angefangene Faden reißt." },
            { lead: "Was hilft",
              body: "Übergänge ankündigen, auch dir selbst. Saubere Schlusspunkte setzen. Pufferzeiten lassen. Ein Wechsel darf dauern.",
              note: "Die Übergänge-Hilfen im Alltag-Tab nehmen dich da an die Hand." }
          ],
          takeaway: "Schwer umzuschalten heißt nicht stur. Es heißt, dass dein Fokus tief war – und das ist auch eine Gabe."
        },
        {
          id: "routinen", icon: "🔁", title: "Routinen: Schutz, nicht Einschränkung",
          teaser: "Warum Gleichbleibendes dich entlastet.", minutes: 3,
          pages: [
            { lead: "Routine spart Akku",
              body: "Jede Entscheidung und jede Unbekannte kostet Energie. Routinen nehmen dir diese Last ab: Was gleich bleibt, musst du nicht neu aushandeln. Das ist kein Zwang, sondern Effizienz für ein Gehirn, das viel verarbeitet." },
            { lead: "Warum Veränderung stresst",
              body: "Wenn eine Routine bricht, fällt der Schutz weg und alles kostet wieder Aufwand. Deshalb fühlt sich eine kleine Planänderung manchmal viel größer an, als sie von außen aussieht." },
            { lead: "Gut mit Routinen leben",
              body: "Bau dir verlässliche Anker in den Tag. Bei nötigen Änderungen hilft Vorbereitung: vorher wissen, was kommt. Vorhersehbarkeit ist dein Verbündeter, kein Defizit." }
          ],
          takeaway: "An Routinen zu hängen ist kein Starrsinn. Es ist eine kluge Art, Energie zu sparen und dir Sicherheit zu geben."
        }
      ]
    },

    /* ===== Überlastung & Schutz ===== */
    {
      title: "Überlastung & Schutz",
      cards: [
        {
          id: "meltdown-shutdown", icon: "⚡", title: "Meltdown und Shutdown – für dich unterschieden",
          teaser: "Zwei Reaktionen auf dieselbe Überlastung.", minutes: 4,
          pages: [
            { lead: "Gleiche Ursache, zwei Richtungen",
              body: "Meltdown und Shutdown sind beides Reaktionen auf zu viel – zu viele Reize, zu viel Anforderung, zu lange über der Grenze. Es ist keine Wut und keine Absicht. Das System ist voll." },
            { lead: "Meltdown – nach außen",
              body: "Energie entlädt sich nach außen: Weinen, Schreien, Bewegung, der Drang wegzukommen. Es fühlt sich an wie Kontrollverlust. Danach bist du oft leer und beschämt – obwohl du nichts falsch gemacht hast." },
            { lead: "Shutdown – nach innen",
              body: "Hier zieht sich alles zusammen: Worte fallen weg, der Körper wird langsam oder still, du funktionierst nur noch minimal. Von außen wirkt es ruhig, innen ist es genauso überlastet." },
            { lead: "Was beide brauchen",
              body: "Nicht analysieren, nicht reden müssen, keine Fragen. Erst Schutz: Reize runter, sicherer Ort, Zeit. Verstehen kommt später." }
          ],
          takeaway: "Meltdown und Shutdown sind keine Charakterfehler. Es sind Notbremsen eines überlasteten Systems – und du verdienst dabei Sanftheit, keine Scham."
        },
        {
          id: "nach-ueberlastung", icon: "🌱", title: "Nach der Überlastung",
          teaser: "Warum du danach Tage brauchst, nicht Minuten.", minutes: 3,
          pages: [
            { lead: "Der Kater danach",
              body: "Nach Meltdown, Shutdown oder einem zu vollen Tag kommt oft eine Phase tiefer Erschöpfung – manchmal Stunden, manchmal Tage. Das ist normal. Dein System fährt nur langsam wieder hoch." },
            { lead: "Was jetzt nicht dran ist",
              body: "Jetzt ist nicht die Zeit für Aufarbeiten, Entschuldigungen oder Leistung. Druck verlängert die Erholung. Du musst nichts erklären und nichts gutmachen." },
            { lead: "Sanft regenerieren",
              list: ["Reize niedrig halten", "Vertrautes und Vorhersehbares", "Grundbedürfnisse: trinken, essen, Wärme", "Keine neuen Anforderungen annehmen"] }
          ],
          takeaway: "Lange Erholung ist kein Drama machen. Eine Überlastung hat dein System echt getroffen – Heilung darf Zeit brauchen."
        }
      ]
    },

    /* ===== Soziales & Selbstbild ===== */
    {
      title: "Soziales & Selbstbild",
      cards: [
        {
          id: "masking", icon: "🎭", title: "Masking: warum es schützt und was es kostet",
          teaser: "Sich anpassen, um durchzukommen – und der Preis dafür.", minutes: 4,
          pages: [
            { lead: "Was Masking ist",
              body: "Masking ist das Verbergen autistischer Züge, um normal zu wirken: Blickkontakt erzwingen, Stimming unterdrücken, Mimik nachahmen, Erschöpfung verstecken. Oft hast du es früh und unbewusst gelernt, um dazuzugehören und sicher zu sein." },
            { lead: "Warum es nachvollziehbar ist",
              body: "Masking schützt – vor Ablehnung, vor Mobbing, vor unangenehmen Fragen. Es ist eine kluge Überlebensstrategie, kein Lügen. Du hast dich nicht verstellt, um zu täuschen, sondern um zu bestehen." },
            { lead: "Was es kostet",
              body: "Dauerhaftes Maskieren ist einer der größten Stromfresser und ein Hauptweg in den autistischen Burnout. Es kann auch den Kontakt zu dir selbst verwischen: Wer bin ich, wenn ich nicht ständig performe?" },
            { lead: "Unmasking in Schritten",
              body: "Du musst die Maske nicht überall ablegen – Sicherheit zuerst. Aber such dir Orte und Menschen, bei denen du echt sein darfst. Jedes kleine Stück weniger Maske gibt Energie zurück." }
          ],
          takeaway: "Maskieren war Schutz, kein Makel. Und du darfst Stück für Stück Räume suchen, in denen du dich nicht verstecken musst."
        },
        {
          id: "doppelte-empathie", icon: "👥", title: "Missverständnisse gehen in beide Richtungen",
          teaser: "Warum soziale Reibung keine Einbahnstraße ist.", minutes: 3,
          pages: [
            { lead: "Die alte Erzählung",
              body: "Lange hieß es, autistische Menschen hätten ein Empathie- oder Sozialdefizit. Diese Sicht legt das ganze Problem auf eine Seite – deine." },
            { lead: "Was wirklich passiert",
              body: "Die Idee der doppelten Empathie zeigt: Missverständnisse entstehen zwischen zwei verschiedenen Stilen. Autistische Menschen verstehen einander oft gut. Und nicht-autistische Menschen lesen autistische Signale ebenso schlecht. Die Lücke liegt dazwischen, nicht in dir." },
            { lead: "Warum das entlastet",
              body: "Du bist nicht kaputt im Sozialen. Du sprichst eine andere Variante derselben Sprache. Das nimmt Schuld von dir und macht Verständigung zu einer gemeinsamen Aufgabe – nicht zu deinem Mangel." }
          ],
          takeaway: "Soziale Missverständnisse sind keine Einbahnstraße. Es liegt nicht nur an dir – und das war es nie."
        },
        {
          id: "audhd", icon: "🎢", title: "AuDHD: wenn Reizsuche und Reizschutz sich streiten",
          teaser: "Wenn Autismus und ADHS zusammenkommen.", minutes: 3,
          pages: [
            { lead: "Zwei Systeme, ein Kopf",
              body: "Bei AuDHD treffen zwei Profile aufeinander. ADHS sucht oft Reiz, Neues, Tempo. Autismus sucht oft Ruhe, Gleichbleibendes, Schutz. Beides gleichzeitig zu spüren ist anstrengend und verwirrend." },
            { lead: "Der innere Widerspruch",
              list: ["Du langweilst dich – und bist gleichzeitig überreizt", "Du sehnst dich nach Routine – und brichst sie aus Unruhe", "Du willst Nähe – und brauchst dringend Rückzug"] },
            { lead: "Kein Widerspruch in dir",
              body: "Du bist nicht inkonsequent oder schwierig. Zwei reale Bedürfnisse ziehen an dir. Hilfreich ist, beide gelten zu lassen: Reiz in sicherem Rahmen, etwa Bewegung und Interessen, und dazu verlässliche Ruheinseln." }
          ],
          takeaway: "Das Hin und Her ist kein Chaos, das du verschuldest. Es sind zwei echte Bedürfnisse – und beide dürfen Platz haben."
        },
        {
          id: "selbstakzeptanz", icon: "🌻", title: "Sich neu verstehen lernen",
          teaser: "Vom Reparieren zum Verstehen.", minutes: 3,
          pages: [
            { lead: "Eine neue Linse",
              body: "Vielleicht hast du lange gedacht, mit dir stimme etwas nicht. Dich zu verstehen heißt, dieselben Dinge neu zu lesen: nicht zu empfindlich, sondern feiner wahrnehmend. Nicht faul, sondern anders getaktet." },
            { lead: "Trauer darf dabei sein",
              body: "Sich spät zu verstehen bringt oft auch Schmerz – über Jahre des Anstrengens, der Missverständnisse, der falschen Etiketten. Diese Trauer ist berechtigt. Sie gehört zum Ankommen dazu." },
            { lead: "Bedürfnisse statt Normen",
              body: "Selbstakzeptanz heißt nicht aufgeben, sondern aufhören, gegen dich zu arbeiten. Du fragst nicht mehr nur, wie du normal wirkst, sondern was du wirklich brauchst – und nimmst es ernst." }
          ],
          takeaway: "Du bist kein fehlerhafter normaler Mensch. Du bist ein stimmiger autistischer Mensch – und je besser du dich verstehst, desto sanfter wird der Alltag."
        }
      ]
    }

  ]
};
