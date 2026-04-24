/** Database classe Paladino */

export const paladin = {
  "classe": "Paladino",
  "descrizione_breve": "Un guerriero sacro che combina abilità di combattimento con poteri divini per combattere il male e proteggere gli innocenti.",
  "dado_vita": "d10",
  "caratteristica_primaria": "Carisma",
  "competenze": {
    "armature": [
      "Tutte le armature",
      "Scudi"
    ],
    "armi": [
      "Armi semplici",
      "Armi da guerra"
    ],
    "strumenti": [
      "Nessuno"
    ],
    "tiri_salvezza": [
      "Saggezza",
      "Carisma"
    ],
    "abilita": [
      "Atletica",
      "Intimidire",
      "Intuizione",
      "Medicina",
      "Persuasione",
      "Religione"
    ]
  },
  "punti_ferita": {
    "dado_vita": "d10",
    "pf_livello_1": "10 + modificatore di Costituzione",
    "pf_livelli_successivi": "1d10 (o 6) + modificatore di Costituzione"
  },
  "equipaggiamento": [
    "(a) un'arma da guerra e uno scudo o (b) due armi da guerra",
    "(a) cinque giavellotti o (b) qualsiasi arma semplice da mischia",
    "(a) uno zaino da sacerdote o (b) uno zaino da esploratore",
    "Cotta di maglia e un simbolo sacro"
  ],
  "tabella_progressione": [
    { "livello": 1, "bonus_competenza": 2, "privilegi": ["Imposizione delle Mani", "Percezione del Divino"], "slot_1": 0, "slot_2": 0, "slot_3": 0, "slot_4": 0, "slot_5": 0 },
    { "livello": 2, "bonus_competenza": 2, "privilegi": ["Incantesimi", "Punizione Divina", "Stile di Combattimento"], "slot_1": 0, "slot_2": 0, "slot_3": 0, "slot_4": 0, "slot_5": 0 },
    { "livello": 3, "bonus_competenza": 2, "privilegi": ["Giuramento Sacro", "Salute Divina"], "slot_1": 3, "slot_2": 0, "slot_3": 0, "slot_4": 0, "slot_5": 0 },
    { "livello": 4, "bonus_competenza": 2, "privilegi": ["Aumento dei Punteggi di Caratteristica"], "slot_1": 3, "slot_2": 0, "slot_3": 0, "slot_4": 0, "slot_5": 0 },
    { "livello": 5, "bonus_competenza": 3, "privilegi": ["Attacco Extra"], "slot_1": 4, "slot_2": 2, "slot_3": 0, "slot_4": 0, "slot_5": 0 },
    { "livello": 6, "bonus_competenza": 3, "privilegi": ["Aura di Protezione"], "slot_1": 4, "slot_2": 2, "slot_3": 0, "slot_4": 0, "slot_5": 0 },
    { "livello": 7, "bonus_competenza": 3, "privilegi": ["Privilegio del Giuramento Sacro"], "slot_1": 4, "slot_2": 3, "slot_3": 0, "slot_4": 0, "slot_5": 0 },
    { "livello": 8, "bonus_competenza": 3, "privilegi": ["Aumento dei Punteggi di Caratteristica"], "slot_1": 4, "slot_2": 3, "slot_3": 0, "slot_4": 0, "slot_5": 0 },
    { "livello": 9, "bonus_competenza": 4, "privilegi": [], "slot_1": 4, "slot_2": 3, "slot_3": 2, "slot_4": 0, "slot_5": 0 },
    { "livello": 10, "bonus_competenza": 4, "privilegi": ["Aura di Coraggio"], "slot_1": 4, "slot_2": 3, "slot_3": 2, "slot_4": 0, "slot_5": 0 },
    { "livello": 11, "bonus_competenza": 4, "privilegi": ["Punizione Divina Migliorata"], "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 0, "slot_5": 0 },
    { "livello": 12, "bonus_competenza": 4, "privilegi": ["Aumento dei Punteggi di Caratteristica"], "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 0, "slot_5": 0 },
    { "livello": 13, "bonus_competenza": 5, "privilegi": [], "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 1, "slot_5": 0 },
    { "livello": 14, "bonus_competenza": 5, "privilegi": ["Tocco Purificante"], "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 1, "slot_5": 0 },
    { "livello": 15, "bonus_competenza": 5, "privilegi": ["Privilegio del Giuramento Sacro"], "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 2, "slot_5": 0 },
    { "livello": 16, "bonus_competenza": 5, "privilegi": ["Aumento dei Punteggi di Caratteristica"], "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 2, "slot_5": 0 },
    { "livello": 17, "bonus_competenza": 6, "privilegi": [], "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 1 },
    { "livello": 18, "bonus_competenza": 6, "privilegi": ["Aure Migliorate"], "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 1 },
    { "livello": 19, "bonus_competenza": 6, "privilegi": ["Aumento dei Punteggi di Caratteristica"], "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2 },
    { "livello": 20, "bonus_competenza": 6, "privilegi": ["Privilegio del Giuramento Sacro"], "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2 }
  ],
  "descrizione_privilegi": {
    "Imposizione delle Mani": {
      "riassunto": "Tocco benedetto che guarisce le ferite",
      "descrizione_completa": "Hai una riserva di potere curativa che si ripristina al termine di un riposo lungo. Con questa riserva, puoi curare un numero totale di punti ferita pari al tuo livello da paladino x 5. Con un'azione, puoi attingere al potere della riserva per ripristinare i punti ferita di una creatura con cui sei in contatto, fino al massimo rimanente nella tua riserva. In alternativa, puoi spendere 5 punti ferita dalla tua riserva di guarigione per curare il bersaglio di una malattia o neutralizzare un veleno che lo affligge."
    },
    "Percezione del Divino": {
      "riassunto": "Individua creature celestiali, immorali o non morte",
      "descrizione_completa": "Con un'azione puoi espandere la tua consapevolezza per individuare queste forze. Fino al termine del tuo prossimo turno, conosci la posizione di qualsiasi celestiale, immondo o non morto che si trovi entro 18 metri da te e che non sia dietro copertura totale. Riconosci il tipo (celestiale, immondo o non morto) di qualsiasi creatura di cui avverti la presenza, ma non la sua esatta identità. All'interno dello stesso raggio, puoi anche individuare la presenza di qualsiasi luogo o oggetto che sia stato consacrato o dissacrato. Puoi usare questo privilegio un numero di volte pari ad 1 + il tuo modificatore di Carisma. Quando termini un riposo lungo, recuperi tutti gli usi consumati."
    },
    "Incantesimi": {
      "riassunto": "Lancia incantesimi divini",
      "descrizione_completa": "Al 2° livello, impari ad attingere alla magia divina tramite la meditazione e la preghiera per lanciare incantesimi. Prepari la lista degli incantesimi da paladino da lanciare a tua disposizione, scegliendoli dalla lista degli incantesimi da paladino. Quando lo fai, scegli un numero di incantesimi da paladino uguale al tuo modificatore di Carisma + la metà del tuo livello da paladino (minimo 1 incantesimo). Gli incantesimi devono essere di un livello per cui disponi slot incantesimo. Puoi cambiare la tua lista di incantesimi preparati al termine di un riposo lungo."
    },
    "Punizione Divina": {
      "riassunto": "Infliggi danno radiante extra con attacco",
      "descrizione_completa": "Quando colpisci una creatura con un attacco con arma da mischia, puoi spendere uno slot incantesimo per infliggere danno radiante al bersaglio, oltre al danno dell'arma. Il danno aggiuntivo è 2d8 per uno slot incantesimo di 1° livello, più 1d8 per ogni livello dell'incantesimo sopra al 1°, massimo 5d8. Il danno aumenta di 1d8 se il bersaglio è un non morto o un immondo."
    },
    "Stile di Combattimento": {
      "riassunto": "Scegli uno stile di combattimento speciale",
      "descrizione_completa": "Al 2° livello, adotti un particolare stile di combattimento come tua specialità. Scegli una delle seguenti opzioni: Combattere con Armi Possenti, Difesa, Duellare, Protezione. Non puoi acquisire più di una volta lo stesso Stile di Combattimento, anche se in seguito ottieni una nuova scelta."
    },
    "Giuramento Sacro": {
      "riassunto": "Pronunci un giuramento che ti vincola",
      "descrizione_completa": "Quando raggiungi il 3° livello, pronunci un giuramento che ti vincola come paladino per l'eternità. Scegli un giuramento, come il Giuramento di Devozione. La tua scelta ti conferisce dei privilegi al 3° livello e poi al 7°, 15° e 20° livello. Questi privilegi includono gli incantesimi del giuramento e il privilegio Incanalare Divinità."
    },
    "Salute Divina": {
      "riassunto": "Immunità alle malattie",
      "descrizione_completa": "Dal 3° livello in poi, la magia divina che ti fluisce attraverso ti rende immune alle malattie."
    },
    "Aumento dei Punteggi di Caratteristica": {
      "riassunto": "Aumenta le tue caratteristiche",
      "descrizione_completa": "Quando raggiungi il 4° livello, e poi ancora all'8°, 12°, 16° e 19° livello, puoi incrementare un tuo punteggio di caratteristica di 2, o incrementare due punteggi di caratteristica di 1. Di norma, utilizzando questo privilegio non puoi accrescere un punteggio di caratteristica oltre il 20."
    },
    "Attacco Extra": {
      "riassunto": "Attacca due volte per turno",
      "descrizione_completa": "A partire dal 5° livello, puoi attaccare due volte, invece che una volta, ogni volta che effettui l'azione Attaccare durante il tuo turno."
    },
    "Aura di Protezione": {
      "riassunto": "Bonus ai tiri salvezza per te e alleati",
      "descrizione_completa": "A partire dal 6° livello, ogniqualvolta tu o una creatura amica entro 3 metri da te dovete effettuare un tiro salvezza, quella creatura ottiene un bonus al tiro salvezza pari al tuo modificatore di Carisma (con un bonus minimo +1). Al 18° livello, la gittata di quest'aura aumenta a 9 metri."
    },
    "Aura di Coraggio": {
      "riassunto": "Immunità al terrore per te e alleati",
      "descrizione_completa": "A partire dal 10° livello, tu e le creature tue amiche entro 3 metri da te non potete essere spaventati finché sei cosciente. Al 18° livello, la gittata di quest'aura aumenta a 9 metri."
    },
    "Punizione Divina Migliorata": {
      "riassunto": "Danno radiante extra automatico",
      "descrizione_completa": "Per l'11° livello, sei così infuso di giusta potenza che tutti i tuoi colpi con arma da mischia convogliano potere divino. Ogni qualvolta colpisci una creatura con un'arma da mischia, la creatura subisce 1d8 danni radianti aggiuntivi."
    },
    "Tocco Purificante": {
      "riassunto": "Termina incantesimi su te o alleati",
      "descrizione_completa": "A partire dal 14° livello, puoi usare la tua azione per porre termine a un incantesimo su di te o una creatura consenziente che puoi toccare. Puoi usare questo privilegio un numero di volte pari al tuo modificatore di Carisma (minimo di una volta). Recuperi gli usi spesi al termine di un riposo lungo."
    }
  },
  "incantazione": {
    "caratteristica_da_incantatore": "Carisma",
    "cd_tiro_salvezza": "8 + bonus di competenza + modificatore di Carisma",
    "modificatore_attacco": "bonus di competenza + modificatore di Carisma",
    "focus_incantamento": "Simbolo sacro",
    "preparazione_incantesimi": "Puoi preparare un numero di incantesimi uguale a metà del tuo livello da paladino + modificatore di Carisma (minimo 1)."
  },
  "sottoclassi": [
    {
      "nome": "Giuramento di Devozione",
      "descrizione": "Il Giuramento di Devozione lega il paladino ai nobili ideali di giustizia, virtù e ordine. A volte detti anche cavalieri, cavalieri bianchi o guerrieri sacri, questi paladini si riconoscono nell'ideale del cavaliere dall'armatura splendente, che agisce con onore perseguendo la giustizia e un bene superiore.",
      "privilegi": {
        "3": {
          "nome": "Scacciare i Sacrileghi",
          "descrizione": "Come azione, presenti il tuo simbolo sacro e pronunci una preghiera di censura verso immondi e non morti, usando Incanalare Divinità. Ogni immondo e non morto che puoi vedere, e si trovi entro 9 metri da te, deve effettuare un tiro salvezza su Saggezza. Una creatura che fallisce il tiro salvezza è scacciata per 1 minuto o finché non subisce danni."
        },
        "7": {
          "nome": "Aura di Devozione",
          "descrizione": "Tu e le creature amiche entro 3 metri da te non potete essere affascinate mentre sei cosciente. Al 18° livello, la gittata di questa aura aumenta a 9 metri."
        },
        "15": {
          "nome": "Purezza di Spirito",
          "descrizione": "Sei sempre sotto gli effetti dell'incantesimo protezione dal bene e dal male."
        },
        "20": {
          "nome": "Nube Sacra",
          "descrizione": "Con un'azione, puoi emanare un'aura di luce solare. Per 1 minuto, da te promana luce intensa in un raggio di 9 metri, e luce fioca per altri 9 metri oltre questi. Ogni qualvolta una creatura nemica inizi il suo turno all'interno della luce intensa, la creatura subisce 10 danni radianti. Inoltre, per la durata, hai vantaggio sui tiri salvezza contro incantesimi lanciati da immondi e non morti."
        }
      }
    }
  ],
  "index": "paladin",
  "name": "Paladino",
  "hit_die": 10,
  "saving_throws": [
    {
      "name": "Saggezza",
      "index": "wis"
    },
    {
      "name": "Carisma",
      "index": "cha"
    }
  ]
};
