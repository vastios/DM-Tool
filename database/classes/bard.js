/** Database classe Bardo */

export const bard = {
  "classe": "Bardo",
  "descrizione_breve": "Un incantatore carismatico che usa la musica, la poesia e la magia per ispirare gli alleati e confondere i nemici.",
  "dado_vita": "d8",
  "caratteristica_primaria": "Carisma",
  "competenze": {
    "armature": [
      "Armature leggere"
    ],
    "armi": [
      "Armi semplici",
      "Balestre a mano",
      "Spade corte",
      "Spade lunghe",
      "Stocchi"
    ],
    "strumenti": "Tre strumenti musicali di tua scelta",
    "tiri_salvezza": [
      "Destrezza",
      "Carisma"
    ],
    "abilita": "Scegli tre abilità qualsiasi"
  },
  "punti_ferita": {
    "dado_vita": "d8",
    "pf_livello_1": "8 + il tuo modificatore di Costituzione",
    "pf_livelli_successivi": "1d8 (o 5) + il tuo modificatore di Costituzione per livello da bardo oltre il 1°"
  },
  "equipaggiamento": [
    "(a) uno stocco, (b) una spada lunga o (c) una qualsiasi arma semplice",
    "(a) uno zaino da diplomatico o (b) uno zaino da intrattenitore",
    "(a) un liuto o (b) qualsiasi altro strumento musicale",
    "Armatura di cuoio e un pugnale"
  ],
  "tabella_progressione": [
    {
      "livello": 1,
      "bonus_competenza": 2,
      "privilegi": [
        "Incantesimi",
        "Ispirazione Bardica (d6)"
      ],
      "trucchetti_conosciuti": 2,
      "incantesimi_conosciuti": 4,
      "slot_1": 2, "slot_2": 0, "slot_3": 0, "slot_4": 0, "slot_5": 0, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0
    },
    {
      "livello": 2,
      "bonus_competenza": 2,
      "privilegi": [
        "Canto di Riposo (d6)",
        "Factotum"
      ],
      "trucchetti_conosciuti": 2,
      "incantesimi_conosciuti": 5,
      "slot_1": 3, "slot_2": 0, "slot_3": 0, "slot_4": 0, "slot_5": 0, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0
    },
    {
      "livello": 3,
      "bonus_competenza": 2,
      "privilegi": [
        "Collegio Bardico",
        "Maestria"
      ],
      "trucchetti_conosciuti": 2,
      "incantesimi_conosciuti": 6,
      "slot_1": 4, "slot_2": 2, "slot_3": 0, "slot_4": 0, "slot_5": 0, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0
    },
    {
      "livello": 4,
      "bonus_competenza": 2,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ],
      "trucchetti_conosciuti": 3,
      "incantesimi_conosciuti": 7,
      "slot_1": 4, "slot_2": 3, "slot_3": 0, "slot_4": 0, "slot_5": 0, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0
    },
    {
      "livello": 5,
      "bonus_competenza": 3,
      "privilegi": [
        "Ispirazione Bardica (d8)",
        "Fonte di Ispirazione"
      ],
      "trucchetti_conosciuti": 3,
      "incantesimi_conosciuti": 8,
      "slot_1": 4, "slot_2": 3, "slot_3": 2, "slot_4": 0, "slot_5": 0, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0
    },
    {
      "livello": 6,
      "bonus_competenza": 3,
      "privilegi": [
        "Controfascino",
        "privilegio di Collegio Bardico"
      ],
      "trucchetti_conosciuti": 3,
      "incantesimi_conosciuti": 9,
      "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 0, "slot_5": 0, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0
    },
    {
      "livello": 7,
      "bonus_competenza": 3,
      "privilegi": [],
      "trucchetti_conosciuti": 3,
      "incantesimi_conosciuti": 10,
      "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 1, "slot_5": 0, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0
    },
    {
      "livello": 8,
      "bonus_competenza": 3,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ],
      "trucchetti_conosciuti": 3,
      "incantesimi_conosciuti": 11,
      "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 2, "slot_5": 0, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0
    },
    {
      "livello": 9,
      "bonus_competenza": 4,
      "privilegi": [
        "Canto di Riposo (d8)"
      ],
      "trucchetti_conosciuti": 3,
      "incantesimi_conosciuti": 12,
      "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 1, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0
    },
    {
      "livello": 10,
      "bonus_competenza": 4,
      "privilegi": [
        "Ispirazione Bardica (d10)",
        "Maestria",
        "Segreti Magici"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 14,
      "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2, "slot_6": 0, "slot_7": 0, "slot_8": 0, "slot_9": 0
    },
    {
      "livello": 11,
      "bonus_competenza": 4,
      "privilegi": [],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 15,
      "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2, "slot_6": 1, "slot_7": 0, "slot_8": 0, "slot_9": 0
    },
    {
      "livello": 12,
      "bonus_competenza": 4,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 15,
      "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2, "slot_6": 1, "slot_7": 0, "slot_8": 0, "slot_9": 0
    },
    {
      "livello": 13,
      "bonus_competenza": 5,
      "privilegi": [
        "Canto di Riposo (d10)"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 16,
      "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2, "slot_6": 1, "slot_7": 1, "slot_8": 0, "slot_9": 0
    },
    {
      "livello": 14,
      "bonus_competenza": 5,
      "privilegi": [
        "Privilegio di Collegio Bardico",
        "Segreti Magici"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 18,
      "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2, "slot_6": 1, "slot_7": 1, "slot_8": 0, "slot_9": 0
    },
    {
      "livello": 15,
      "bonus_competenza": 5,
      "privilegi": [
        "Ispirazione Bardica (d12)"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 19,
      "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2, "slot_6": 1, "slot_7": 1, "slot_8": 1, "slot_9": 0
    },
    {
      "livello": 16,
      "bonus_competenza": 5,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 19,
      "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2, "slot_6": 1, "slot_7": 1, "slot_8": 1, "slot_9": 0
    },
    {
      "livello": 17,
      "bonus_competenza": 6,
      "privilegi": [
        "Canto di Riposo (d12)"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 20,
      "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 2, "slot_6": 1, "slot_7": 1, "slot_8": 1, "slot_9": 1
    },
    {
      "livello": 18,
      "bonus_competenza": 6,
      "privilegi": [
        "Segreti Magici"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 22,
      "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 3, "slot_6": 1, "slot_7": 1, "slot_8": 1, "slot_9": 1
    },
    {
      "livello": 19,
      "bonus_competenza": 6,
      "privilegi": [
        "Aumento dei Punteggi di Caratteristica"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 22,
      "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 3, "slot_6": 2, "slot_7": 1, "slot_8": 1, "slot_9": 1
    },
    {
      "livello": 20,
      "bonus_competenza": 6,
      "privilegi": [
        "Ispirazione Superiore"
      ],
      "trucchetti_conosciuti": 4,
      "incantesimi_conosciuti": 22,
      "slot_1": 4, "slot_2": 3, "slot_3": 3, "slot_4": 3, "slot_5": 3, "slot_6": 2, "slot_7": 2, "slot_8": 1, "slot_9": 1
    }
  ],
  "descrizione_privilegi": {
    "Ispirazione Bardica": {
      "riassunto": "Puoi ispirare una creatura con un dado speciale da usare in prove o tiri.",
      "descrizione_completa": "Puoi ispirare il tuo prossimo tramite parole o una musica incoraggiante. Per farlo, usi un'azione bonus durante il tuo turno per scegliere una creatura, diversa da te, entro 18 metri da te e che possa udirti. Quella creatura ottiene un dado di Ispirazione Bardica, un d6. Per una volta nei successivi 10 minuti, la creatura può tirare questo dado e sommarlo al numero tirato per una prova di caratteristica, tiro per colpire o tiro salvezza. La creatura può attendere fino a dopo aver tirato il d20, prima di decidere se usare il dado di Ispirazione Bardica, ma deve decidere prima che il GM decreti se il tiro è riuscito o fallito. Una volta che il dado di Ispirazione Bardica è stato tirato, è perso. Una creatura può possedere solo un dado di Ispirazione Bardica alla volta. Puoi usare questo privilegio un numero di volte pari al tuo modificatore di Carisma (minimo una volta). Recuperi qualsiasi uso speso quando termini un riposo lungo. Il tuo dado di Ispirazione Bardica cambia quando raggiungi determinati livelli in questa classe. Il dado diventa un d8 al 5° livello, un d10 al 10° livello, e un d12 al 15° livello."
    },
    "Factotum": {
      "riassunto": "Puoi sommare metà del tuo bonus di competenza a prove che non lo includono già.",
      "descrizione_completa": "A partire dal 2° livello, puoi sommare metà del tuo bonus di competenza, arrotondato per difetto, a qualsiasi prova di caratteristica che effettui e che non includa già il tuo bonus di competenza."
    },
    "Canto di Riposo": {
      "riassunto": "Puoi usare la musica per aiutare i tuoi alleati a recuperare più punti ferita durante un riposo breve.",
      "descrizione_completa": "A partire dal 2° livello, puoi usare una dolce musica o l'oratoria per aiutare i tuoi alleati feriti a riprendersi durante un riposo breve. Se tu o qualsiasi creatura amica che possa udire la tua esibizione spendono uno più Dadi Vita al termine di un riposo breve, ciascuno di voi recupera 1d6 punti ferita aggiuntivi. I punti ferita recuperati aumentano quando raggiungi determinati livelli di questa classe: a 1d8 al 9° livello, a 1d10 al 13° livello, a 1d12 al 17° livello."
    },
    "Collegio Bardico": {
      "riassunto": "Approfondisci le tecniche avanzate di un collegio bardico di tua scelta.",
      "descrizione_completa": "Al 3° livello, approfondisci le tecniche avanzate di un collegio bardico di tua scelta, come il Collegio della Sapienza, dettagliato al termine della descrizione della classe. Questa scelta ti conferisce dei privilegi al 3° livello e poi al 6° e al 14° livello."
    },
    "Maestria": {
      "riassunto": "Il tuo bonus di competenza è raddoppiato per competenze specifiche.",
      "descrizione_completa": "Al 3° livello, scegli due tue competenze nelle abilità. Il tuo bonus di competenza è raddoppiato per qualsiasi prova di caratteristica che usi una delle competenze scelte. Al 10° livello, puoi scegliere altre due competenze su cui applicare questo beneficio."
    },
    "Aumento dei Punteggi di Caratteristica": {
      "riassunto": "Puoi aumentare i tuoi punteggi di caratteristica.",
      "descrizione_completa": "Quando raggiungi il 4° livello, e poi ancora all'8°, 12°, 16° e 19° livello, puoi incrementare un tuo punteggio di caratteristica di 2, o incrementare due punteggi di caratteristica di 1. Di norma, utilizzando questo privilegio non puoi accrescere un punteggio di caratteristica oltre il 20."
    },
    "Fonte di Ispirazione": {
      "riassunto": "Recuperi tutti gli usi di Ispirazione Bardica dopo un riposo breve o lungo.",
      "descrizione_completa": "A partire da quando raggiungi il 5° livello, recuperi tutti i tuoi usi di Ispirazione Bardica quando termini un riposo breve o lungo."
    },
    "Controfascino": {
      "riassunto": "Puoi proteggere te e i tuoi alleati da effetti mentali.",
      "descrizione_completa": "Al 6° livello, ottieni la capacità di usare le note musicali o le parole di potere per distruggere gli effetti di influenza mentale. Con un'azione, puoi iniziare un'esibizione che dura fino al termine del tuo prossimo turno. In questo periodo, tu, e qualsiasi creatura amica entro 9 metri da te, avete vantaggio sui tiri salvezza contro l'essere spaventato o affascinato. Per ottenere questo beneficio, una creatura ti deve poter udire. L'esibizione termina prima qualora tu fossi reso inabile o silenziato o se gli poni fine volontariamente (non c'è bisogno di alcuna azione)."
    },
    "Segreti Magici": {
      "riassunto": "Puoi imparare incantesimi da altre classi.",
      "descrizione_completa": "Per il 10° livello, avrai ormai saccheggiato il sapere magico da un ampio spettro di discipline. Scegli due incantesimi di qualsiasi classe, compresa questa. Gli incantesimi scelti devono essere di un livello di cui possiedi slot incantesimo, come mostrato sulla tabella Il Bardo, o un trucchetto. Gli incantesimi scelti sono considerati, per te, incantesimi da bardo e sono inclusi nel valore della colonna Incantesimi Conosciuti sulla tabella Il Bardo. Apprendi due ulteriori incantesimi di qualsiasi classe al 14° livello, e di nuovo al 18° livello."
    },
    "Ispirazione Superiore": {
      "riassunto": "Recuperi automaticamente un uso di Ispirazione Bardica quando tiri l'iniziativa senza averne.",
      "descrizione_completa": "Al 20° livello, quando tiri l'iniziativa e non ti rimangono usi di Ispirazione Bardica, ne recuperi uno."
    }
  },
  "incantazione": {
    "caratteristica_da_incantatore": "Carisma",
    "cd_tiro_salvezza": "8 + bonus di competenza + modificatore di Carisma",
    "modificatore_attacco": "bonus di competenza + modificatore di Carisma",
    "focus_incantamento": "Strumento musicale",
    "rituali": true
  },
  "sottoclassi": [
    {
      "nome": "Collegio della Sapienza",
      "descrizione": "I bardi del Collegio della Sapienza sanno qualcosa di qualsiasi argomento, raccogliendo pezzi di informazioni dalle fonti più disparate, che siano tomi di studio o racconti popolari. Che cantino ballate popolari in taverne o elaborate composizioni alla corte del re, questi bardi usano i loro doni per incantare il proprio pubblico.",
      "privilegi": {
        "3": {
          "nome": "Parole Taglienti",
          "descrizione": "Inoltre, al 3° livello, apprendi come usare la tua astuzia per distrarre, confondere o altrimenti diminuire la sicurezza e la competenza altrui. Quando una creatura entro 18 metri da te e che puoi vedere effettua un tiro per colpire, una prova di caratteristica o un tiro di danno, puoi usare la tua reazione per spendere uno dei tuoi usi di Ispirazione Bardica, tirando un dado di Ispirazione Bardica e sottraendo il numero ottenuto dal tiro della creatura. Puoi scegliere di usare questo privilegio dopo che la creatura ha effettuato il tiro, ma prima che il GM determini se il tiro per colpire o la prova di caratteristica sia superata o fallita, oppure prima che la creatura infligga il suo danno. La creatura è immune a questa capacità se non può udirti o se è immune all'essere affascinata."
        },
        "6": {
          "nome": "Segreti Magici Aggiuntivi",
          "descrizione": "Al 6° livello, apprendi due incantesimi di tua scelta appartenenti a qualsiasi classe. Gli incantesimi devono essere di un livello di cui possiedi slot incantesimo, come mostrato sulla tabella Il Bardo, o trucchetti. Gli incantesimi scelti sono considerati incantesimi da bardo ma non sono conteggiati nel numero di incantesimi da bardo che conosci."
        },
        "14": {
          "nome": "Abilità Impareggiabile",
          "descrizione": "Al 14° livello, quando effettui una prova di caratteristica, puoi spendere un uso di Ispirazione Bardica. Tira un dado di Ispirazione Bardica e somma il numero ottenuto alla tua prova di caratteristica. Puoi scegliere di farlo dopo aver tirato il dado per la prova di caratteristica, ma prima che il GM determini se questa sia riuscita o fallita."
        }
      }
    }
  ],
  "index": "bard",
  "name": "Bardo",
  "hit_die": 8,
  "saving_throws": [
    {
      "name": "Destrezza",
      "index": "dex"
    },
    {
      "name": "Carisma",
      "index": "cha"
    }
  ]
};
