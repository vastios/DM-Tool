/** Database classe Guerriero */

export const fighter = {
  "classe": "Guerriero",
  "descrizione_breve": "Un combattente versatile e resistente che eccelle nel combattimento fisico.",
  "dado_vita": "d10",
  "caratteristica_primaria": "Forza",
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
      "Forza",
      "Costituzione"
    ],
    "abilita": "Scegli due abilità tra Acrobazia, Addestrare Animali, Atletica, Intimidire, Intuizione, Percezione, Sopravvivenza e Storia"
  },
  "punti_ferita": {
    "dado_vita": "d10",
    "pf_livello_1": "10 + il tuo modificatore di Costituzione",
    "pf_livelli_successivi": "1d10 (o 6) + il tuo modificatore di Costituzione per livello da guerriero oltre il 1°"
  },
  "equipaggiamento": [
    "(a) cotta di maglia o (b) armatura di cuoio, arco lungo e 20 frecce",
    "(a) un'arma da guerra e uno scudo o (b) due armi da guerra",
    "(a) una balestra leggera e 20 quadrelli o (b) due asce",
    "(a) uno zaino da speleologo o (b) uno zaino da esploratore"
  ],
  "tabella_progressione": [
    {
      "livello": 1,
      "bonus_competenza": 2,
      "privilegi": [
        "Recuperare Energie",
        "Stile di Combattimento"
      ]
    },
    {
      "livello": 2,
      "bonus_competenza": 2,
      "privilegi": [
        "Azione Impetuosa (un utilizzo)"
      ]
    },
    {
      "livello": 3,
      "bonus_competenza": 2,
      "privilegi": [
        "Archetipo Marziale"
      ]
    },
    {
      "livello": 4,
      "bonus_competenza": 2,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 5,
      "bonus_competenza": 3,
      "privilegi": [
        "Attacco Extra"
      ]
    },
    {
      "livello": 6,
      "bonus_competenza": 3,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 7,
      "bonus_competenza": 3,
      "privilegi": [
        "Privilegio dell'Archetipo Marziale"
      ]
    },
    {
      "livello": 8,
      "bonus_competenza": 3,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 9,
      "bonus_competenza": 4,
      "privilegi": [
        "Indomabile (un utilizzo)"
      ]
    },
    {
      "livello": 10,
      "bonus_competenza": 4,
      "privilegi": [
        "Privilegio dell'Archetipo Marziale"
      ]
    },
    {
      "livello": 11,
      "bonus_competenza": 4,
      "privilegi": [
        "Attacco Extra (2)"
      ]
    },
    {
      "livello": 12,
      "bonus_competenza": 4,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 13,
      "bonus_competenza": 5,
      "privilegi": [
        "Indomabile (due utilizzi)"
      ]
    },
    {
      "livello": 14,
      "bonus_competenza": 5,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 15,
      "bonus_competenza": 5,
      "privilegi": [
        "Privilegio dell'Archetipo Marziale"
      ]
    },
    {
      "livello": 16,
      "bonus_competenza": 5,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 17,
      "bonus_competenza": 6,
      "privilegi": [
        "Azione Impetuosa (due utilizzi), Indomabile (tre utilizzi)"
      ]
    },
    {
      "livello": 18,
      "bonus_competenza": 6,
      "privilegi": [
        "Privilegio dell'Archetipo Marziale"
      ]
    },
    {
      "livello": 19,
      "bonus_competenza": 6,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ]
    },
    {
      "livello": 20,
      "bonus_competenza": 6,
      "privilegi": [
        "Attacco Extra (3)"
      ]
    }
  ],
  "descrizione_privilegi": {
    "Recuperare Energie": {
      "riassunto": "Recupera punti ferita usando un'azione bonus",
      "descrizione_completa": "Hai una fonte limitata di energia a cui puoi attingere per rimetterti dalle ferite. Durante il tuo turno, puoi usare un'azione bonus per recuperare punti ferita pari a 1d10 + il tuo livello da guerriero. Una volta impiegato questo privilegio, devi terminare un riposo breve o lungo prima di riutilizzarlo."
    },
    "Stile di Combattimento": {
      "riassunto": "Scegli uno stile di combattimento",
      "descrizione_completa": "Come tua specializzazione adotti un particolare stile di combattimento. Scegli una delle seguenti opzioni: Combattere con Armi Possenti, Combattere con Due Armi, Difesa, Duellare, Protezione, Tiro. Non puoi acquisire più di una volta lo stesso Stile di Combattimento, anche se in seguito ottieni una nuova scelta."
    },
    "Azione Impetuosa": {
      "riassunto": "Esegui un'azione aggiuntiva",
      "descrizione_completa": "Durante il tuo turno, puoi eseguire un'azione aggiuntiva oltre alla tua normale azione e una possibile azione bonus. Una volta impiegato questo privilegio, devi terminare un riposo breve o lungo prima di riutilizzarlo. A partire dal 17° livello, puoi utilizzarlo due volte prima di riposare, ma solo una volta durante lo stesso turno."
    },
    "Archetipo Marziale": {
      "riassunto": "Scegli un archetipo marziale",
      "descrizione_completa": "Puoi scegliere un archetipo da emulare con il tuo stile e le tue tecniche di combattimento, come quello del Campione. Il tuo archetipo ti conferisce privilegi al 3° livello e ancora al 7°, 10°, 15° e 18° livello."
    },
    "Attacco Extra": {
      "riassunto": "Effettua più attacchi",
      "descrizione_completa": "Puoi attaccare due volte, invece che una volta, ogni volta che effettui l'azione Attaccare durante il tuo turno. Il numero di attacchi incrementa a tre quando raggiungi l'11° livello in questa classe e a quattro quando raggiungi il 20° livello in questa classe."
    },
    "Indomabile": {
      "riassunto": "Ritira un tiro salvezza fallito",
      "descrizione_completa": "Puoi ritirare un tiro salvezza che hai fallito. Se lo fai, devi usare il nuovo tiro, e non puoi più usare questo privilegio fino a quando non terminerai un riposo lungo. Puoi usare questo privilegio due volte tra ogni riposo lungo a partire dal 13° livello e tre volte tra ogni riposo lungo a partire dal 17° livello."
    },
    "Aumento dei Punteggi di Caratteristica": {
      "riassunto": "Aumenta i tuoi punteggi di caratteristica",
      "descrizione_completa": "Quando raggiungi il 4° livello, e poi ancora al 6°, 8°, 12°, 14°, 16° e 19° livello, puoi incrementare un tuo punteggio di caratteristica di 2, o incrementare due punteggi di caratteristica di 1. Di norma, utilizzando questo privilegio non puoi accrescere un punteggio di caratteristica oltre il 20."
    }
  },
  "incantazione": {
    "caratteristica_da_incantatore": "Nessuna",
    "cd_tiro_salvezza": "N/A",
    "modificatore_attacco": "N/A"
  },
  "sottoclassi": [
    {
      "nome": "Campione",
      "descrizione": "L'archetipo del Campione si concentra sullo sviluppo della pura forza bruta assieme ad una precisione letale. Coloro che perseguono questo modello uniscono un rigoroso addestramento all'eccellenza fisica, per infliggere colpi devastanti.",
      "privilegi": {
        "3": {
          "nome": "Critico Migliorato",
          "descrizione": "La tua arma ottiene un colpo critico su di un tiro per colpire di 19 o 20."
        },
        "7": {
          "nome": "Atleta Straordinario",
          "descrizione": "Puoi sommare metà del tuo bonus di competenza (arrotondato per eccesso), a qualsiasi prova di Forza, Destrezza o Costituzione effettuata e che non faccia già uso del tuo bonus di competenza. Inoltre, quando effettui un salto in lungo con rincorsa, la distanza che puoi coprire aumenta di 30 cm moltiplicati il tuo modificatore di Forza."
        },
        "10": {
          "nome": "Stile di Combattimento Aggiuntivo",
          "descrizione": "Puoi scegliere una seconda opzione dal privilegio di classe Stile di Combattimento."
        },
        "15": {
          "nome": "Critico Superiore",
          "descrizione": "La tua arma ottiene un colpo critico su di un tiro per colpire con un risultato naturale da 18-20."
        },
        "18": {
          "nome": "Sopravvissuto",
          "descrizione": "All'inizio di ciascun tuo turno, se ti rimangono meno della metà dei tuoi punti ferita massimi, recuperi un numero di punti ferita uguale a 5 + il tuo modificatore di Costituzione. Se hai 0 punti ferita non ottieni questo beneficio."
        }
      }
    }
  ],
  "index": "fighter",
  "name": "Guerriero",
  "hit_die": 10,
  "saving_throws": [
    {
      "name": "Forza",
      "index": "str"
    },
    {
      "name": "Costituzione",
      "index": "con"
    }
  ]
};
