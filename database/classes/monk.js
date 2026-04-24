/** Database classe Monaco */

export const monk = {
  "classe": "Monaco",
  "descrizione_breve": "Un guerriero che usa l'energia mistica del ki per compiere imprese sovrumane.",
  "dado_vita": "d8",
  "caratteristica_primaria": "Saggezza",
  "competenze": {
    "armature": [
      "Nessuna"
    ],
    "armi": [
      "Armi semplici",
      "spade corte"
    ],
    "strumenti": "Scegli un tipo di attrezzo da artigiano o uno strumento musicale",
    "tiri_salvezza": [
      "Forza",
      "Destrezza"
    ],
    "abilita": "Scegli due abilità tra Acrobazia, Atletica, Furtività, Intuizione, Religione e Storia"
  },
  "punti_ferita": {
    "dado_vita": "d8",
    "pf_livello_1": "8 + il tuo modificatore di Costituzione",
    "pf_livelli_successivi": "1d8 (o 5) + il tuo modificatore di Costituzione per livello da monaco oltre il 1°"
  },
  "equipaggiamento": [
    "(a) una spada corta o (b) qualsiasi arma semplice",
    "(a) uno zaino da speleologo o (b) uno zaino da esploratore",
    "10 dardi"
  ],
  "tabella_progressione": [
    {
      "livello": 1,
      "bonus_competenza": 2,
      "arti_marziali": "1d4",
      "ki": 1,
      "movimento_senza_armatura": "—",
      "privilegi": [
        "Arti Marziali",
        "Difesa Senza Armatura"
      ]
    },
    {
      "livello": 2,
      "bonus_competenza": 2,
      "arti_marziali": "1d4",
      "ki": 2,
      "movimento_senza_armatura": "+3 m",
      "privilegi": [
        "Ki",
        "Movimento Senza Armatura"
      ]
    },
    {
      "livello": 3,
      "bonus_competenza": 2,
      "arti_marziali": "1d4",
      "ki": 3,
      "movimento_senza_armatura": "+3 m",
      "privilegi": [
        "Deviare Proiettili",
        "Tradizione Monastica"
      ]
    },
    {
      "livello": 4,
      "bonus_competenza": 2,
      "arti_marziali": "1d4",
      "ki": 4,
      "movimento_senza_armatura": "+3 m",
      "privilegi": [
        "Caduta Lenta",
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 5,
      "bonus_competenza": 3,
      "arti_marziali": "1d6",
      "ki": 5,
      "movimento_senza_armatura": "+3 m",
      "privilegi": [
        "Attacco Extra",
        "Colpo Stordente"
      ]
    },
    {
      "livello": 6,
      "bonus_competenza": 3,
      "arti_marziali": "1d6",
      "ki": 6,
      "movimento_senza_armatura": "+4,5 m",
      "privilegi": [
        "Colpi Ki Potenziati",
        "Privilegio della Tradizione Monastica"
      ]
    },
    {
      "livello": 7,
      "bonus_competenza": 3,
      "arti_marziali": "1d6",
      "ki": 7,
      "movimento_senza_armatura": "+4,5 m",
      "privilegi": [
        "Elusione",
        "Mente Lucida"
      ]
    },
    {
      "livello": 8,
      "bonus_competenza": 3,
      "arti_marziali": "1d6",
      "ki": 8,
      "movimento_senza_armatura": "+4,5 m",
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 9,
      "bonus_competenza": 4,
      "arti_marziali": "1d6",
      "ki": 9,
      "movimento_senza_armatura": "+4,5 m",
      "privilegi": [
        "Movimento Senza Armatura Migliorato"
      ]
    },
    {
      "livello": 10,
      "bonus_competenza": 4,
      "arti_marziali": "1d6",
      "ki": 10,
      "movimento_senza_armatura": "+6 m",
      "privilegi": [
        "Purezza del Corpo"
      ]
    },
    {
      "livello": 11,
      "bonus_competenza": 4,
      "arti_marziali": "1d8",
      "ki": 11,
      "movimento_senza_armatura": "+6 m",
      "privilegi": [
        "Privilegio della Tradizione Monastica"
      ]
    },
    {
      "livello": 12,
      "bonus_competenza": 4,
      "arti_marziali": "1d8",
      "ki": 12,
      "movimento_senza_armatura": "+6 m",
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 13,
      "bonus_competenza": 5,
      "arti_marziali": "1d8",
      "ki": 13,
      "movimento_senza_armatura": "+6 m",
      "privilegi": [
        "Lingua del Sole e della Luna"
      ]
    },
    {
      "livello": 14,
      "bonus_competenza": 5,
      "arti_marziali": "1d8",
      "ki": 14,
      "movimento_senza_armatura": "+7,5 m",
      "privilegi": [
        "Anima Adamantina"
      ]
    },
    {
      "livello": 15,
      "bonus_competenza": 5,
      "arti_marziali": "1d8",
      "ki": 15,
      "movimento_senza_armatura": "+7,5 m",
      "privilegi": [
        "Corpo Senza Tempo"
      ]
    },
    {
      "livello": 16,
      "bonus_competenza": 5,
      "arti_marziali": "1d8",
      "ki": 16,
      "movimento_senza_armatura": "+7,5 m",
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 17,
      "bonus_competenza": 6,
      "arti_marziali": "1d10",
      "ki": 17,
      "movimento_senza_armatura": "+7,5 m",
      "privilegi": [
        "Privilegio della Tradizione Monastica"
      ]
    },
    {
      "livello": 18,
      "bonus_competenza": 6,
      "arti_marziali": "1d10",
      "ki": 18,
      "movimento_senza_armatura": "+9 m",
      "privilegi": [
        "Corpo Vuoto"
      ]
    },
    {
      "livello": 19,
      "bonus_competenza": 6,
      "arti_marziali": "1d10",
      "ki": 19,
      "movimento_senza_armatura": "+9 m",
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 20,
      "bonus_competenza": 6,
      "arti_marziali": "1d10",
      "ki": 20,
      "movimento_senza_armatura": "+9 m",
      "privilegi": [
        "Perfezione Interiore"
      ]
    }
  ],
  "descrizione_privilegi": {
    "Arti Marziali": {
      "riassunto": "Maestria nel combattimento senz'armi e con armi da monaco",
      "descrizione_completa": "Quando sei senz'armi o impugni solo armi da monaco, e non stai indossando armature o impugnando scudi, puoi usare la Destrezza invece della Forza per i tiri per colpire e di danno, e puoi tirare un d4 invece del normale danno. Quando usi l'azione Attaccare, puoi effettuare un colpo senz'armi come azione bonus."
    },
    "Difesa Senza Armatura": {
      "riassunto": "Calcolo della Classe Armatura senza armatura",
      "descrizione_completa": "Mentre non indossi nessuna armatura e non impugni nessuno scudo, la tua Classe Armatura è pari a 10 + il tuo modificatore di Destrezza + il tuo modificatore di Saggezza."
    },
    "Ki": {
      "riassunto": "Punti energia per potenziare le abilità",
      "descrizione_completa": "Il tuo livello da monaco determina il numero di punti ki di cui disponi. Puoi spendere questi punti per alimentare vari privilegi derivati dal ki. Quando spendi un punto ki, esso resterà inutilizzabile fino al termine di un riposo breve o lungo."
    },
    "Movimento Senza Armatura": {
      "riassunto": "Aumento della velocità senza armatura",
      "descrizione_completa": "La tua velocità aumenta di 3 metri quando non indossi nessuna armatura né impugni scudi. Questo bonus aumenta con i livelli. Al 9° livello, puoi spostarti lungo superfici verticali e attraverso i liquidi senza cadere."
    },
    "Tradizione Monastica": {
      "riassunto": "Scelta di una tradizione monastica",
      "descrizione_completa": "Ti dedichi interamente a una tradizione monastica, come la Via della Mano Aperta. La tua tradizione ti conferisce privilegi al 3° livello, e poi ancora al 6°, 11° e 17° livello."
    },
    "Deviare Proiettili": {
      "riassunto": "Deviare o afferrare proiettili",
      "descrizione_completa": "Puoi usare la tua reazione per deviare o afferrare i proiettili quando vieni colpito da un attacco con arma a distanza. Il danno viene ridotto di 1d10 + il tuo modificatore di Destrezza + il tuo livello da monaco."
    },
    "Aumento dei Punteggi di Caratteristica": {
      "riassunto": "Aumento dei punteggi di caratteristica",
      "descrizione_completa": "Puoi incrementare un tuo punteggio di caratteristica di 2, o incrementare due punteggi di caratteristica di 1. Non puoi accrescere un punteggio di caratteristica oltre il 20."
    },
    "Caduta Lenta": {
      "riassunto": "Ridurre il danno da caduta",
      "descrizione_completa": "Puoi usare la tua reazione quando cadi per ridurre qualsiasi danno da caduta subito di un ammontare pari a cinque volte il tuo livello da monaco."
    },
    "Attacco Extra": {
      "riassunto": "Attacchi aggiuntivi",
      "descrizione_completa": "Puoi attaccare due volte, invece che una volta, ogni volta che effettui l'azione Attaccare durante il tuo turno."
    },
    "Colpo Stordente": {
      "riassunto": "Stordire un avversario con il ki",
      "descrizione_completa": "Quando colpisci un'altra creatura con un attacco con arma da mischia, puoi spendere 1 punto ki per tentare un colpo stordente. Il bersaglio deve superare un tiro salvezza su Costituzione o restare stordito."
    },
    "Colpi Ki Potenziati": {
      "riassunto": "Colpi considerati magici",
      "descrizione_completa": "I tuoi colpi senz'armi sono considerati magici al fine di superare la resistenza e le immunità agli attacchi non magici e al danno."
    },
    "Elusione": {
      "riassunto": "Evitare completamente alcuni danni",
      "descrizione_completa": "Quando sei vittima di un effetto che ti permette di compiere un tiro salvezza su Destrezza per dimezzare i danni, non subisci danni se superi il tiro salvezza, e solo metà danni se lo fallisci."
    },
    "Mente Lucida": {
      "riassunto": "Resistere a effetti mentali",
      "descrizione_completa": "Puoi usare la tua azione per terminare un effetto su di te che ti stia rendendo affascinato o spaventato."
    },
    "Purezza del Corpo": {
      "riassunto": "Immunità a malattie e veleni",
      "descrizione_completa": "Sei immune alle malattie e ai veleni, compresi i danni da veleno e la condizione avvelenato."
    },
    "Lingua del Sole e della Luna": {
      "riassunto": "Comprendere tutti i linguaggi",
      "descrizione_completa": "Apprendi come entrare in contatto col ki di altre menti per comprendere tutti i linguaggi parlati. Inoltre, qualsiasi creatura che possa comprendere un linguaggio, è in grado di capire quello che dici."
    },
    "Anima Adamantina": {
      "riassunto": "Competenza in tutti i tiri salvezza",
      "descrizione_completa": "Ottieni la competenza in tutti i tiri salvezza. Inoltre, ogni qualvolta effettui un tiro salvezza e fallisci, puoi spendere 1 punto ki per ritirarlo e tenere il secondo risultato."
    },
    "Corpo Senza Tempo": {
      "riassunto": "Resistenza all'invecchiamento",
      "descrizione_completa": "Non soffri nessuna delle debolezze dell'età avanzata, e non puoi più venir invecchiato dalla magia. Non hai più bisogno di bere o di mangiare."
    },
    "Corpo Vuoto": {
      "riassunto": "Invisibilità e proiezione astrale",
      "descrizione_completa": "Puoi spendere 4 punti ki per diventare invisibile per 1 minuto con resistenza a tutti i danni salvo i danni da forza. Puoi spendere 8 punti ki per lanciare l'incantesimo proiezione astrale."
    },
    "Perfezione Interiore": {
      "riassunto": "Recupero ki all'iniziativa",
      "descrizione_completa": "Quando tiri per l'iniziativa e non ti rimangono punti ki, recuperi 4 punti ki."
    }
  },
  "incantazione": {
    "caratteristica_da_incantatore": "Nessuna",
    "cd_tiro_salvezza": "8 + bonus di competenza + modificatore di Saggezza",
    "modificatore_attacco": "Nessuna"
  },
  "sottoclassi": [
    {
      "nome": "Via della Mano Aperta",
      "descrizione": "Maestri del combattimento con le arti marziali, capaci di manipolare il ki del nemico e guarire i danni subiti.",
      "privilegi": {
        "3": {
          "nome": "Tecnica della Mano Aperta",
          "descrizione": "Mentre controlli il tuo ki puoi manipolare anche il ki del nemico. Ogniqualvolta colpisci una creatura con uno degli attacchi conferiti da Raffica di Colpi, puoi imporre al bersaglio uno degli effetti: cadere prono, essere spinto di 4,5 metri, o non poter effettuare reazioni."
        },
        "6": {
          "nome": "Integrità del Corpo",
          "descrizione": "Con un'azione, puoi recuperare un numero di punti ferita pari a tre volte il tuo livello da monaco. Devi terminare un riposo lungo prima di poter usare di nuovo questo privilegio."
        },
        "11": {
          "nome": "Tranquillità",
          "descrizione": "Al termine di un riposo lungo, ottieni gli effetti di un incantesimo santuario che dura fino all'inizio del tuo prossimo riposo lungo."
        },
        "17": {
          "nome": "Palmo Tremante",
          "descrizione": "Quando colpisci una creatura con un colpo senz'armi, puoi spendere 3 punti ki per dare vita a delle vibrazioni impercettibili che durano per un numero di giorni pari al tuo livello da monaco. Con un'azione, puoi terminare le vibrazioni, causando al bersaglio un tiro salvezza su Costituzione o subire 10d10 danni necrotici."
        }
      }
    }
  ],
  "index": "monk",
  "name": "Monaco",
  "hit_die": 8,
  "saving_throws": [
    {
      "name": "Forza",
      "index": "str"
    },
    {
      "name": "Destrezza",
      "index": "dex"
    }
  ]
};
