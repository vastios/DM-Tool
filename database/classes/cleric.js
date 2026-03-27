/** Database classe Chierico */

export const cleric = {
  "classe": "Chierico",
  "descrizione_breve": "Un condotto del potere divino che lancia incantesimi e canalizza l'energia della sua divinità.",
  "dado_vita": "d8",
  "caratteristica_primaria": "Saggezza",
  "competenze": {
    "armature": [
      "Armature leggere",
      "Armature medie",
      "Scudi"
    ],
    "armi": [
      "Tutte le armi semplici"
    ],
    "strumenti": "Nessuno",
    "tiri_salvezza": [
      "Saggezza",
      "Carisma"
    ],
    "abilita": [
      "Scegli due tra Intuizione, Medicina, Persuasione, Religione e Storia"
    ]
  },
  "punti_ferita": {
    "dado_vita": "d8",
    "pf_livello_1": "8 + modificatore di Costituzione",
    "pf_livelli_successivi": "1d8 (o 5) + modificatore di Costituzione per livello oltre il 1°"
  },
  "equipaggiamento": [
    "(a) una mazza o (b) un martello da guerra (se competente)",
    "(a) armatura a scaglie, (b) armatura di cuoio o (c) cotta di maglia (se competente)",
    "(a) una balestra leggera e 20 quadrelli o (b) qualsiasi arma semplice",
    "(a) uno zaino da sacerdote o (b) uno zaino da esploratore",
    "Uno scudo e un simbolo sacro"
  ],
  "tabella_progressione": [
    { "livello": 1, "bonus_competenza": 2, "privilegi": ["Dominio Divino", "Incantesimi"], "trucchetti_conosciuti": 3, "slot_1": 2, "slot_2": 0, "slot_3": 0, "slot_4": 0, "slot_5": 0, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0 },
    { "livello": 2, "bonus_competenza": 2, "privilegi": ["Incanalare Divinità (1/riposo)", "privilegio di Dominio Divino"], "trucchetti_conosciuti": 3, "slot_1": 3, "slot_2": 0, "slot_3": 0, "slot_4": 0, "slot_5": 0, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0 },
    { "livello": 3, "bonus_competenza": 2, "privilegi": [], "trucchetti_conosciuti": 3, "slot_1": 4, "slot_2": 2, "slot_3": 0, "slot_4": 0, "slot_5": 0, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0 },
    { "livello": 4, "bonus_competenza": 2, "privilegi": ["Aumento dei Punteggi di Caratteristica"], "trucchetti_conosciuti": 4, "slot_1": 4, "slot_2": 3, "slot_3": 0, "slot_4": 0, "slot_5": 0, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0 },
    { "livello": 5, "bonus_competenza": 3, "privilegi": ["Distruggere Non Morti (GS 1/2)"], "trucchetti_conosciuti": 4, "slot_1": 4, "slot_2": 3, "slot_3": 2, "slot_4": 0, "slot_5": 0, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0 },
    { "livello": 6, "bonus_competenza": 3, "privilegi": ["Incanalare Divinità (2/riposo)", "privilegio di Dominio Divino"], "trucchetti_conosciuti": 4, "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 0, "slot_5": 0, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0 },
    { "livello": 7, "bonus_competenza": 3, "privilegi": [], "trucchetti_conosciuti": 4, "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 1, "slot_5": 0, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0 },
    { "livello": 8, "bonus_competenza": 3, "privilegi": ["Aumento dei Punteggi di Caratteristica", "Distruggere Non Morti (GS 1)", "privilegio di Dominio Divino"], "trucchetti_conosciuti": 4, "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 2, "slot_5": 0, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0 },
    { "livello": 9, "bonus_competenza": 4, "privilegi": [], "trucchetti_conosciuti": 4, "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 1, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0 },
    { "livello": 10, "bonus_competenza": 4, "privilegi": ["Intervento Divino"], "trucchetti_conosciuti": 5, "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0 },
    { "livello": 11, "bonus_competenza": 4, "privilegi": ["Distruggere Non Morti (GS 2)"], "trucchetti_conosciuti": 5, "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2, "slot_6": 1, "slot_7": 0, "slot_8": 0, "slot_9": 0 },
    { "livello": 12, "bonus_competenza": 4, "privilegi": ["Aumento dei Punteggi di Caratteristica"], "trucchetti_conosciuti": 5, "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2, "slot_6": 1, "slot_7": 0, "slot_8": 0, "slot_9": 0 },
    { "livello": 13, "bonus_competenza": 5, "privilegi": [], "trucchetti_conosciuti": 5, "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2, "slot_6": 1, "slot_7": 1, "slot_8": 0, "slot_9": 0 },
    { "livello": 14, "bonus_competenza": 5, "privilegi": ["Distruggere Non Morti (GS 3)"], "trucchetti_conosciuti": 5, "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2, "slot_6": 1, "slot_7": 1, "slot_8": 0, "slot_9": 0 },
    { "livello": 15, "bonus_competenza": 5, "privilegi": [], "trucchetti_conosciuti": 5, "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2, "slot_6": 1, "slot_7": 1, "slot_8": 1, "slot_9": 0 },
    { "livello": 16, "bonus_competenza": 5, "privilegi": ["Aumento dei Punteggi di Caratteristica"], "trucchetti_conosciuti": 5, "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2, "slot_6": 1, "slot_7": 1, "slot_8": 1, "slot_9": 0 },
    { "livello": 17, "bonus_competenza": 6, "privilegi": ["Distruggere Non Morti (GS 4)", "privilegio di Dominio Divino"], "trucchetti_conosciuti": 5, "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2, "slot_6": 1, "slot_7": 1, "slot_8": 1, "slot_9": 1 },
    { "livello": 18, "bonus_competenza": 6, "privilegi": ["Incanalare Divinità (3/riposo)"], "trucchetti_conosciuti": 5, "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 3, "slot_6": 1, "slot_7": 1, "slot_8": 1, "slot_9": 1 },
    { "livello": 19, "bonus_competenza": 6, "privilegi": ["Aumento dei Punteggi di Caratteristica"], "trucchetti_conosciuti": 5, "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 3, "slot_6": 2, "slot_7": 1, "slot_8": 1, "slot_9": 1 },
    { "livello": 20, "bonus_competenza": 6, "privilegi": ["Intervento Divino Migliorato"], "trucchetti_conosciuti": 5, "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 3, "slot_6": 2, "slot_7": 2, "slot_8": 1, "slot_9": 1 }
  ],
  "descrizione_privilegi": {
    "Dominio Divino": {
      "riassunto": "Scegli un dominio divino che conferisce incantesimi e capacità speciali.",
      "descrizione_completa": "Al 1° livello, scegli un dominio divino che definisce la natura della tua connessione con la divinità. Ogni dominio fornisce incantesimi di dominio che sono sempre preparati e non contano nel limite di incantesimi preparati, e conferisce capacità speciali."
    },
    "Incanalare Divinità": {
      "riassunto": "Canalizza l'energia divina per effetti speciali.",
      "descrizione_completa": "Al 2° livello, puoi usare un'azione per presentare il tuo simbolo sacro e canalizzare l'energia divina. Puoi scegliere tra Scacciare Non Morti e un effetto specifico del tuo dominio. Al 6° livello puoi usarlo due volte per riposo, al 18° livello tre volte."
    },
    "Scacciare Non Morti": {
      "riassunto": "Scaccia i non morti con un'azione.",
      "descrizione_completa": "Con un'azione, presenti il tuo simbolo sacro e pronunci una preghiera. Ogni non morto entro 9 metri deve fare un tiro salvezza su Saggezza. Se fallisce, viene scacciato per 1 minuto o finché non subisce danni."
    },
    "Aumento dei Punteggi di Caratteristica": {
      "riassunto": "Aumenta le tue caratteristiche.",
      "descrizione_completa": "Al 4°, 8°, 12°, 16° e 19° livello, puoi aumentare un punteggio di caratteristica di 2 o due punteggi di 1. Non puoi superare 20 con nessun punteggio."
    },
    "Distruggere Non Morti": {
      "riassunto": "Distruggi automaticamente i non morti deboli.",
      "descrizione_completa": "Dal 5° livello, quando un non morto fallisce il tiro salvezza contro Scacciare Non Morti, viene distruttto immediatamente se il suo Grado di Sfida è uguale o inferiore alla soglia indicata nella tabella."
    },
    "Intervento Divino": {
      "riassunto": "Chiedi aiuto divino in caso di necessità.",
      "descrizione_completa": "Dal 10° livello, puoi usare un'azione per chiedere intervento divino. Tiri un dado percentuale: se il risultato è ≤ al tuo livello, la divinità interviene (effetto simile a un incantesimo). Non puoi riutilizzarlo per 7 giorni. Al 20° livello, l'intervento ha successo automaticamente."
    }
  },
  "incantazione": {
    "caratteristica_da_incantatore": "Saggezza",
    "cd_tiro_salvezza": "8 + bonus di competenza + modificatore di Saggezza",
    "modificatore_attacco": "bonus di competenza + modificatore di Saggezza",
    "focus_incantamento": "Simbolo sacro",
    "preparazione_incantesimi": "Puoi preparare un numero di incantesimi uguale a modificatore di Saggezza + livello chierico (minimo 1)."
  },
  "sottoclassi": [
    {
      "nome": "Dominio della Vita",
      "descrizione": "Si concentra sulla energia positiva che sostiene la vita, promuovendo salute e guarigione.",
      "privilegi": {
        "Competenza Bonus": {
          "livello": 1,
          "descrizione": "Ottieni competenza con le armature pesanti."
        },
        "Discepolo della Vita": {
          "livello": 1,
          "descrizione": "I tuoi incantesimi di guarigione ripristinano punti ferita aggiuntivi (2 + livello incantesimo)."
        },
        "Incanalare Divinità: Preservare Vita": {
          "livello": 2,
          "descrizione": "Come azione, puoi guarire creature entro 9 metri per 5 × livello chierico PF."
        },
        "Guaritore Benedetto": {
          "livello": 6,
          "descrizione": "Quando guarisci un'altra creatura, guarisci anche te stesso (2 + livello incantesimo PF)."
        },
        "Colpo Divino": {
          "livello": 8,
          "descrizione": "Una volta per turno, i tuoi attacco con arma infliggono 1d8 danni radianti aggiuntivi (2d8 al 14° livello)."
        },
        "Guarigione Suprema": {
          "livello": 17,
          "descrizione": "Quando lanci un incantesimo che ripristina PF, usi il massimo possibile per ogni dado."
        }
      },
      "incantesimi_di_dominio": {
        "1° livello": [
          "Benedizione",
          "Cura ferite"
        ],
        "3° livello": [
          "Arma spirituale",
          "Ristorare inferiore"
        ],
        "5° livello": [
          "Faro di speranza",
          "Rinascita"
        ],
        "7° livello": [
          "Guardiano della fede",
          "Interdizione alla morte"
        ],
        "9° livello": [
          "Cura ferite di massa",
          "Rianimare morti"
        ]
      }
    }
  ],
  "index": "cleric",
  "name": "Chierico",
  "hit_die": 8,
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
