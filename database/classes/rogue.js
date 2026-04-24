/** Database classe Ladro */

export const rogue = {
  "classe": "Ladro",
  "descrizione_breve": "Un maestro del furtivo, specializzato nell'agilità, nell'astuzia e nelle abilità di sopravvivenza.",
  "dado_vita": "d8",
  "caratteristica_primaria": "Destrezza",
  "competenze": {
    "armature": [
      "Armature leggere"
    ],
    "armi": [
      "Armi semplici",
      "Balestre a mano",
      "Spade lunghe",
      "Stocchi",
      "Spade corte"
    ],
    "strumenti": "Attrezzi da scasso",
    "tiri_salvezza": [
      "Destrezza",
      "Intelligenza"
    ],
    "abilita": "Scegli quattro abilità tra Acrobazia, Atletica, Furtività, Indagare, Inganno, Intimidire, Intrattenere, Intuizione, Percezione, Persuasione, Rapidità di Mano"
  },
  "punti_ferita": {
    "dado_vita": "d8",
    "pf_livello_1": "8 + il tuo modificatore di Costituzione",
    "pf_livelli_successivi": "1d8 (o 5) + il tuo modificatore di Costituzione per livello da ladro oltre il 1°"
  },
  "equipaggiamento": [
    "(a) uno stocco o (b) una spada corta",
    "(a) un arco corto e una faretra con 20 frecce o (b) una spada corta",
    "(a) uno zaino da rapinatore, (b) uno zaino da speleologo o (c) uno zaino da esploratore",
    "Armatura di cuoio, due pugnali, e attrezzi da ladro"
  ],
  "tabella_progressione": [
    {
      "livello": 1,
      "bonus_competenza": 2,
      "attacco_furtivo": "1d6",
      "privilegi": [
        "Attacco Furtivo",
        "Gergo Ladresco",
        "Maestria"
      ]
    },
    {
      "livello": 2,
      "bonus_competenza": 2,
      "attacco_furtivo": "1d6",
      "privilegi": [
        "Azione Scaltra"
      ]
    },
    {
      "livello": 3,
      "bonus_competenza": 2,
      "attacco_furtivo": "2d6",
      "privilegi": [
        "Archetipo Ladresco"
      ]
    },
    {
      "livello": 4,
      "bonus_competenza": 2,
      "attacco_furtivo": "2d6",
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 5,
      "bonus_competenza": 3,
      "attacco_furtivo": "3d6",
      "privilegi": [
        "Schivata Prodigiosa"
      ]
    },
    {
      "livello": 6,
      "bonus_competenza": 3,
      "attacco_furtivo": "3d6",
      "privilegi": [
        "Maestria"
      ]
    },
    {
      "livello": 7,
      "bonus_competenza": 3,
      "attacco_furtivo": "4d6",
      "privilegi": [
        "Elusione"
      ]
    },
    {
      "livello": 8,
      "bonus_competenza": 3,
      "attacco_furtivo": "4d6",
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 9,
      "bonus_competenza": 4,
      "attacco_furtivo": "5d6",
      "privilegi": [
        "Privilegio di Archetipo Ladresco"
      ]
    },
    {
      "livello": 10,
      "bonus_competenza": 4,
      "attacco_furtivo": "5d6",
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 11,
      "bonus_competenza": 4,
      "attacco_furtivo": "6d6",
      "privilegi": [
        "Dote Affidabile"
      ]
    },
    {
      "livello": 12,
      "bonus_competenza": 4,
      "attacco_furtivo": "6d6",
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 13,
      "bonus_competenza": 5,
      "attacco_furtivo": "7d6",
      "privilegi": [
        "Privilegio di Archetipo Ladresco"
      ]
    },
    {
      "livello": 14,
      "bonus_competenza": 5,
      "attacco_furtivo": "7d6",
      "privilegi": [
        "Percezione Cieca"
      ]
    },
    {
      "livello": 15,
      "bonus_competenza": 5,
      "attacco_furtivo": "8d6",
      "privilegi": [
        "Mente Sfuggente"
      ]
    },
    {
      "livello": 16,
      "bonus_competenza": 5,
      "attacco_furtivo": "8d6",
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 17,
      "bonus_competenza": 6,
      "attacco_furtivo": "9d6",
      "privilegi": [
        "Privilegio di Archetipo Ladresco"
      ]
    },
    {
      "livello": 18,
      "bonus_competenza": 6,
      "attacco_furtivo": "9d6",
      "privilegi": [
        "Inafferrabile"
      ]
    },
    {
      "livello": 19,
      "bonus_competenza": 6,
      "attacco_furtivo": "10d6",
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 20,
      "bonus_competenza": 6,
      "attacco_furtivo": "10d6",
      "privilegi": [
        "Colpo di Fortuna"
      ]
    }
  ],
  "descrizione_privilegi": {
    "Attacco Furtivo": {
      "riassunto": "Infliggi danni extra quando hai vantaggio sul tiro per colpire o un altro nemico è vicino al bersaglio",
      "descrizione_completa": "Una volta per turno, puoi infliggere 1d6 danni extra a una creatura che colpisci con un attacco se godi di vantaggio sul tiro per colpire. L'attacco deve impiegare un'arma di precisione o a distanza. Non hai bisogno di vantaggio sul tiro per colpire se un altro nemico del bersaglio si trova entro 1,5 metri da esso, quel nemico non è inabile, e non hai svantaggio sul tiro per colpire. L'ammontare di danno aggiuntivo aumenta con i tuoi livelli in questa classe."
    },
    "Gergo Ladresco": {
      "riassunto": "Conosci un linguaggio segreto per comunicare in modo nascosto",
      "descrizione_completa": "Durante il tuo addestramento da ladro hai appreso il gergo dei ladri, una miscela segreta di dialetti, gergo e codici che ti permettono di nascondere dei messaggi in conversazioni apparentemente normali. Solo un'altra creatura che conosca il gergo dei ladri può comprendere questi messaggi. Ci vuole il quadruplo del tempo per trasmettere un simile messaggio rispetto alla normale conversazione. Inoltre, comprendi una serie di segni e simboli segreti impiegati per inviare messaggi semplici e brevi, per identificare un'area come pericolosa o territorio della gilda dei ladri, se c'è del bottino nelle vicinanze, o se le persone del luogo sono facili prede o possano fornire un rifugio ad un ladro in fuga."
    },
    "Maestria": {
      "riassunto": "Il tuo bonus di competenza è raddoppiato per competenze selezionate",
      "descrizione_completa": "Al 1° livello, scegli due tue competenze nelle abilità, o una delle tue competenze nelle abilità e la tua competenza con gli attrezzi da scasso. Il tuo bonus di competenza è raddoppiato per qualsiasi prova di caratteristica che usi una delle competenze scelte. Al 6° livello, puoi scegliere altre due competenze (in abilità o attrezzi da scasso) su cui applicare questo beneficio."
    },
    "Azione Scaltra": {
      "riassunto": "Puoi effettuare un'azione bonus per Disimpegnarsi, Nascondersi o Scattare",
      "descrizione_completa": "A partire dal 2° livello, pensiero rapido e grande coordinazione ti permettono di muoverti e agire velocemente. Puoi effettuare un'azione bonus durante ciascun tuo turno in combattimento. Quest'azione può essere usata solo per effettuare le azioni Disimpegnarsi, Nascondersi o Scattare."
    },
    "Archetipo Ladresco": {
      "riassunto": "Scegli un archetipo che definisce il tuo stile di ladro",
      "descrizione_completa": "Al 3° livello, puoi scegliere un archetipo da emulare nell'esercizio delle tue capacità ladresche, come quello del furfante. Il tuo archetipo conferisce privilegi al 3° livello e ancora al 9°, 13° e 17° livello."
    },
    "Aumento dei Punteggi di Caratteristica": {
      "riassunto": "Aumenta i tuoi punteggi di caratteristica",
      "descrizione_completa": "Quando raggiungi il 4° livello, e poi ancora all'8°, 10°, 12°, 16° e 19° livello, puoi incrementare un tuo punteggio di caratteristica di 2, o incrementare due punteggi di caratteristica di 1. Di norma, utilizzando questo privilegio non puoi accrescere un punteggio di caratteristica oltre il 20."
    },
    "Schivata Prodigiosa": {
      "riassunto": "Usa la tua reazione per dimezzare il danno di un attacco",
      "descrizione_completa": "A partire dal 5° livello, quando un attaccante che sei in grado di vedere ti colpisce con un attacco, puoi usare la tua reazione per dimezzare il danno dell'attacco effettuato contro di te."
    },
    "Elusione": {
      "riassunto": "Eviti completamente gli effetti che richiedono un tiro salvezza su Destrezza",
      "descrizione_completa": "A partire dal 7° livello, puoi tirarti fuori rapidamente da certe aree di effetto, come quella del soffio infuocato di un drago rosso o l'incantesimo tempesta di ghiaccio. Quando sei vittima di un effetto che ti permette di compiere un tiro salvezza su Destrezza per dimezzare i danni, non subisci danni se superi il tiro salvezza, e solo metà danni se lo fallisci."
    },
    "Dote Affidabile": {
      "riassunto": "Trattai i risultati di 9 o meno su un d20 come 10 per prove di competenza",
      "descrizione_completa": "Dall'11° livello, hai affinato le tue abilità prescelte quasi alla perfezione. Ogni volta che devi compiere una prova di caratteristica che ti permette di sommare il tuo bonus di competenza, puoi trattare il risultato di 9 o meno su un d20 come fosse 10."
    },
    "Percezione Cieca": {
      "riassunto": "Sei consapevole della posizione di creature invisibili o nascoste entro 3 metri",
      "descrizione_completa": "A partire dal 14° livello, se sei in grado di udirla, sei consapevole della posizione di qualsiasi creatura invisibile o nascosta entro 3 metri da te."
    },
    "Mente Sfuggente": {
      "riassunto": "Ottieni la competenza nei tiri salvezza su Saggezza",
      "descrizione_completa": "Per il 15° livello, la tua mente ha acquisito una grande forza. Ottieni la competenza nei tiri salvezza su Saggezza."
    },
    "Inafferrabile": {
      "riassunto": "Nessun tiro per colpite gode di vantaggio contro di te",
      "descrizione_completa": "A partire dal 18° livello, sei così evasivo che è difficile che gli avversari riescano a prenderti in fallo. Nessun tiro per colpire gode di vantaggio contro di te, a meno che tu non sia inabile."
    },
    "Colpo di Fortuna": {
      "riassunto": "Trasforma un attacco mancato in uno riuscito o un tiro fallito in uno riuscito",
      "descrizione_completa": "Al 20° livello, hai una prodigiosa predisposizione per riuscire nel momento del bisogno. Se il tuo attacco manca un bersaglio che si trovi nella tua gittata, puoi trasformarlo in un attacco riuscito. In alternativa, se fallisci una prova di caratteristica, puoi trattare il risultato del d20 come se fosse 20. Una volta usato questo privilegio, non lo puoi riusare fino a quando non termini un riposo breve o lungo."
    }
  },
  "incantazione": {
    "caratteristica_da_incantatore": "Nessuna",
    "cd_tiro_salvezza": "N/A",
    "modificatore_attacco": "N/A"
  },
  "sottoclassi": [
    {
      "nome": "Furfante",
      "descrizione": "Applichi le tue capacità all'arte del furto. Rapinatori, banditi, tagliaborse e altri criminali di solito seguono questo archetipo, ma lo fanno anche ladri che preferiscono considerarsi cercatori di tesori professionisti, esploratori, speleologi e investigatori.",
      "privilegi": {
        "3": {
          "nome": "Lavoro al Secondo Piano",
          "descrizione": "Ottieni la capacità di arrampicarti più rapidamente del normale; arrampicarsi non ti costa movimento aggiuntivo. Inoltre, quando effettui un salto con rincorsa, la distanza che puoi coprire aumenta di 30 cm moltiplicati il tuo modificatore di Destrezza."
        },
        "9": {
          "nome": "Furtività Suprema",
          "descrizione": "Se in un turno non ti sei mosso di più di metà della tua velocità, hai vantaggio su di una prova di Destrezza (Furtività)."
        },
        "13": {
          "nome": "Usare Oggetto Magico",
          "descrizione": "Hai appreso abbastanza nozioni sul funzionamento della magia che puoi improvvisare l'uso anche di oggetti magici che non sono stati pensati per te. Puoi ignorare tutti i requisiti di classe, razza e livello nell'uso degli oggetti magici."
        },
        "17": {
          "nome": "Riflessi del Furfante",
          "descrizione": "Sei diventato un maestro nel tendere imboscate e sfuggire rapidamente dai pericoli. Durante il primo round di combattimento, puoi effettuare due turni. Effettui il tuo primo turno alla tua normale iniziativa e il tuo secondo turno alla tua iniziativa meno 10. Non puoi far uso di questo privilegio quando sei sorpreso."
        }
      }
    }
  ],
  "index": "rogue",
  "name": "Ladro",
  "hit_die": 8,
  "saving_throws": [
    {
      "name": "Destrezza",
      "index": "dex"
    },
    {
      "name": "Intelligenza",
      "index": "int"
    }
  ]
};
