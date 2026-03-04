/** Database classe Warlock */

export const warlock = {
  "classe": "Warlock",
  "descrizione_breve": "Un incantatore che ottiene poteri magici attraverso un patto con una creatura ultraterrena.",
  "dado_vita": "d8",
  "caratteristica_primaria": "Carisma",
  "competenze": {
    "armature": [
      "Armature leggere"
    ],
    "armi": [
      "Armi semplici"
    ],
    "strumenti": "Nessuno",
    "tiri_salvezza": [
      "Saggezza",
      "Carisma"
    ],
    "abilita": "Scegli due abilità tra Arcano, Inganno, Intimidire, Indagare, Natura, Religione e Storia"
  },
  "punti_ferita": {
    "dado_vita": "d8",
    "pf_livello_1": "8 + il tuo modificatore di Costituzione",
    "pf_livelli_successivi": "1d8 (o 5) + il tuo modificatore di Costituzione per livello da warlock oltre il 1°"
  },
  "equipaggiamento": [
    "(a) una balestra leggera e 20 quadrelli o (b) una qualsiasi arma semplice",
    "(a) una borsa dei componenti o (b) un focus arcano",
    "(a) uno zaino da studioso o (b) uno zaino da speleologo",
    "Armatura di cuoio, una qualsiasi arma semplice e due pugnali"
  ],
  "tabella_progressione": [
    {
      "livello": 1,
      "bonus_competenza": 2,
      "privilegi": [
        "Magia del Patto",
        "Patrono Ultraterreno"
      ],
      "trucchetti_conosciuti": 2,
      "incantesimi_conosciuti": 2,
      "slot_incantesimo": 1,
      "livello_slot": 1,
      "suppliche_conosciute": 0
    },
    {
      "livello": 2,
      "bonus_competenza": 2,
      "privilegi": [
        "Suppliche Occulte"
      ],
      "trucchetti_conosciuti": 2,
      "incantesimi_conosciuti": 3,
      "slot_incantesimo": 2,
      "livello_slot": 1,
      "suppliche_conosciute": 2
    },
    {
      "livello": 3,
      "bonus_competenza": 2,
      "privilegi": [
        "Dono del Patto"
      ],
      "trucchetti_conosciuti": 2,
      "incantesimi_conosciuti": 4,
      "slot_incantesimo": 2,
      "livello_slot": 2,
      "suppliche_conosciute": 2
    },
    {
      "livello": 4,
      "bonus_competenza": 2,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ],
      "trucchetti_conosciuti": 3,
      "incantesimi_conosciuti": 5,
      "slot_incantesimo": 2,
      "livello_slot": 2,
      "suppliche_conosciute": 2
    },
    {
      "livello": 5,
      "bonus_competenza": 3,
      "privilegi": [],
      "trucchetti_conosciuti": 3,
      "incantesimi_conosciuti": 6,
      "slot_incantesimo": 2,
      "livello_slot": 3,
      "suppliche_conosciute": 3
    },
    {
      "livello": 6,
      "bonus_competenza": 3,
      "privilegi": [
        "Privilegio di Patrono Ultraterreno"
      ],
      "trucchetti_conosciuti": 3,
      "incantesimi_conosciuti": 7,
      "slot_incantesimo": 2,
      "livello_slot": 3,
      "suppliche_conosciute": 3
    },
    {
      "livello": 7,
      "bonus_competenza": 3,
      "privilegi": [],
      "trucchetti_conosciuti": 3,
      "incantesimi_conosciuti": 8,
      "slot_incantesimo": 2,
      "livello_slot": 4,
      "suppliche_conosciute": 4
    },
    {
      "livello": 8,
      "bonus_competenza": 3,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ],
      "trucchetti_conosciuti": 3,
      "incantesimi_conosciuti": 9,
      "slot_incantesimo": 2,
      "livello_slot": 4,
      "suppliche_conosciute": 4
    },
    {
      "livello": 9,
      "bonus_competenza": 4,
      "privilegi": [],
      "trucchetti_conosciuti": 3,
      "incantesimi_conosciuti": 10,
      "slot_incantesimo": 2,
      "livello_slot": 5,
      "suppliche_conosciute": 4
    },
    {
      "livello": 10,
      "bonus_competenza": 4,
      "privilegi": [
        "Privilegio di Patrono Ultraterreno"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 11,
      "slot_incantesimo": 2,
      "livello_slot": 5,
      "suppliche_conosciute": 5
    },
    {
      "livello": 11,
      "bonus_competenza": 4,
      "privilegi": [
        "Arcanum Mistico (6° livello)"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 12,
      "slot_incantesimo": 3,
      "livello_slot": 5,
      "suppliche_conosciute": 5
    },
    {
      "livello": 12,
      "bonus_competenza": 4,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 12,
      "slot_incantesimo": 3,
      "livello_slot": 5,
      "suppliche_conosciute": 6
    },
    {
      "livello": 13,
      "bonus_competenza": 5,
      "privilegi": [
        "Arcanum Mistico (7° livello)"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 13,
      "slot_incantesimo": 3,
      "livello_slot": 5,
      "suppliche_conosciute": 6
    },
    {
      "livello": 14,
      "bonus_competenza": 5,
      "privilegi": [
        "Privilegio di Patrono Ultraterreno"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 13,
      "slot_incantesimo": 3,
      "livello_slot": 5,
      "suppliche_conosciute": 6
    },
    {
      "livello": 15,
      "bonus_competenza": 5,
      "privilegi": [
        "Arcanum Mistico (8° livello)"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 14,
      "slot_incantesimo": 3,
      "livello_slot": 5,
      "suppliche_conosciute": 7
    },
    {
      "livello": 16,
      "bonus_competenza": 5,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 14,
      "slot_incantesimo": 3,
      "livello_slot": 5,
      "suppliche_conosciute": 7
    },
    {
      "livello": 17,
      "bonus_competenza": 6,
      "privilegi": [
        "Arcanum Mistico (9° livello)"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 15,
      "slot_incantesimo": 4,
      "livello_slot": 5,
      "suppliche_conosciute": 7
    },
    {
      "livello": 18,
      "bonus_competenza": 6,
      "privilegi": [],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 15,
      "slot_incantesimo": 4,
      "livello_slot": 5,
      "suppliche_conosciute": 8
    },
    {
      "livello": 19,
      "bonus_competenza": 6,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 15,
      "slot_incantesimo": 4,
      "livello_slot": 5,
      "suppliche_conosciute": 8
    },
    {
      "livello": 20,
      "bonus_competenza": 6,
      "privilegi": [
        "Maestro dell'Occulto"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 15,
      "slot_incantesimo": 4,
      "livello_slot": 5,
      "suppliche_conosciute": 8
    }
  ],
  "descrizione_privilegi": {
    "Magia del Patto": {
      "riassunto": "Ti fornisce una predisposizione per gli incantesimi.",
      "descrizione_completa": "Le tue ricerche arcane e la magia conferitati dal tuo patrono ti forniscono una certa predisposizione per gli incantesimi. Vedi La Magia per le regole generali sul lancio degli incantesimi e Le Liste degli Incantesimi per la lista degli incantesimi da warlock."
    },
    "Patrono Ultraterreno": {
      "riassunto": "Hai stretto un accordo con una creatura ultraterrena.",
      "descrizione_completa": "Al 1° livello, hai stretto un accordo con una creatura ultraterrena di tua scelta, come l'Immondo. Questa scelta ti conferisce un privilegio al 1° livello e poi ancora al 6°, 10° e 14° livello."
    },
    "Suppliche Occulte": {
      "riassunto": "Hai scoperto delle facoltà mistiche.",
      "descrizione_completa": "Nel tuo studio del sapere occulto, hai scoperto delle facoltà mistiche, frammenti di conoscenze proibite che ti infondono di una capacità magica perpetua. Al 2° livello, ottieni due suppliche occulte di tua scelta. Le varie suppliche sono dettagliate al termine della descrizione della classe."
    },
    "Dono del Patto": {
      "riassunto": "Il tuo patrono ti conferisce un dono per il tuo servizio.",
      "descrizione_completa": "Al 3° livello, il tuo patrono ultraterreno ti conferisce un dono per il tuo leale servizio. Ottieni uno dei seguenti privilegi a tua scelta: Patto della Catena, Patto della Lama, Patto del Tomo."
    },
    "Aumento dei Punteggi di Caratteristica": {
      "riassunto": "Incrementi i tuoi punteggi di caratteristica.",
      "descrizione_completa": "Quando raggiungi il 4° livello, e poi ancora all'8°, 12°, 16° e 19° livello, puoi incrementare un tuo punteggio di caratteristica di 2, o incrementare due punteggi di caratteristica di 1. Di norma, utilizzando questo privilegio non puoi accrescere un punteggio di caratteristica oltre il 20."
    },
    "Privilegio di Patrono Ultraterreno": {
      "riassunto": "Ottieni un nuovo privilegio dal tuo patrono.",
      "descrizione_completa": "Al 6°, 10° e 14° livello, ottieni un nuovo privilegio legato al tuo patrono ultraterreno."
    },
    "Arcanum Mistico": {
      "riassunto": "Il tuo patrono ti rivela un segreto magico.",
      "descrizione_completa": "All'11° livello, il tuo patrono ti rivela un segreto magico detto arcanum. Scegli un incantesimo di 6° livello dalla lista degli incantesimi del warlock come arcanum. Puoi lanciare il tuo incantesimo arcanum una volta senza spendere slot incantesimo. Devi terminare un riposo lungo prima di poterlo usare di nuovo."
    },
    "Maestro dell'Occulto": {
      "riassunto": "Puoi recuperare gli slot incantesimo spesi.",
      "descrizione_completa": "Al 20° livello, puoi attingere alla tua riserva interiore di potere mistico mentre supplichi il tuo patrono per recuperare gli slot incantesimo spesi. Puoi spendere 1 minuto a supplicare l'aiuto del tuo patrono per recuperare tutti gli slot incantesimo spesi tramite il tuo privilegio Magia del Patto."
    }
  },
  "incantazione": {
    "caratteristica_da_incantatore": "Carisma",
    "cd_tiro_salvezza": "8 + bonus di competenza + modificatore di Carisma",
    "modificatore_attacco": "bonus di competenza + modificatore di Carisma",
    "focus_incantamento": "Focus arcano"
  },
  "sottoclassi": [
    {
      "nome": "Patrono Ultraterreno",
      "descrizione": "Hai stretto un accordo con una creatura ultraterrena di tua scelta.",
      "privilegi": {
        "1": {
          "nome": "Magia del Patto",
          "descrizione": "Ti fornisce una predisposizione per gli incantesimi."
        },
        "6": {
          "nome": "Privilegio di Patrono Ultraterreno",
          "descrizione": "Ottieni un nuovo privilegio legato al tuo patrono ultraterreno."
        },
        "10": {
          "nome": "Privilegio di Patrono Ultraterreno",
          "descrizione": "Ottieni un nuovo privilegio legato al tuo patrono ultraterreno."
        },
        "14": {
          "nome": "Privilegio di Patrono Ultraterreno",
          "descrizione": "Ottieni un nuovo privilegio legato al tuo patrono ultraterreno."
        }
      }
    },
    {
      "nome": "Patto della Catena",
      "descrizione": "Il tuo famiglio è più astuto di un normale famiglio.",
      "privilegi": {
        "3": {
          "nome": "Famiglio del Patto",
          "descrizione": "Apprendi l'incantesimo trovare famiglio e lo puoi lanciare come rituale. L'incantesimo non è conteggiato tra i tuoi incantesimi conosciuti. Quando lanci l'incantesimo, puoi scegliere una qualsiasi delle normali forme per il tuo famiglio o una delle seguenti forme speciali: imp, quasit, pseudodrago, sprite. Inoltre, quando effettui l'azione Attaccare, puoi rinunciare a uno dei tuoi attacchi per permettere al tuo famiglio di effettuare un attacco per conto proprio, usando la sua reazione."
        }
      }
    },
    {
      "nome": "Patto della Lama",
      "descrizione": "Puoi creare un'arma magica con il tuo patto.",
      "privilegi": {
        "3": {
          "nome": "Arma del Patto",
          "descrizione": "Puoi usare la tua azione per creare un'arma del patto nella tua mano. Puoi scegliere la forma che assumerà quest'arma da mischia ogni volta che la crei. Mentre la impugni, vieni considerato competente con essa. Quest'arma è considerata magica al fine di superare la resistenza e l'immunità agli attacchi e i danni non magici."
        }
      }
    },
    {
      "nome": "Patto del Tomo",
      "descrizione": "Il tuo patrono ti dona un grimorio detto Libro delle Ombre.",
      "privilegi": {
        "3": {
          "nome": "Libro delle Ombre",
          "descrizione": "Quando ottieni questo privilegio, scegli tre trucchetti dalla lista degli incantesimi di qualsiasi classe (questi trucchetti possono appartenere a liste diverse). Finché il libro è con te, puoi lanciare questi trucchetti a volontà come se per te fossero incantesimi da warlock. Non sono conteggiati nel numero di trucchetti da te conosciuti."
        }
      }
    }
  ],
  "index": "warlock",
  "name": "Warlock",
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
