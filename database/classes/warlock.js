/** Database classe Warlock — D&D 5e (PHB)
 *
 * FIX APPLICATI:
 *  - Separati PATRONI (sottoclassi scelte al liv. 1) dai DONI DEL PATTO
 *    (privilegi di classe scelti al liv. 3 — NON sono sottoclassi).
 *  - Aggiunti i 3 patroni del PHB (Fey Selvatico, Immondo, Grande Antico)
 *    con privilegi corretti a liv. 1/6/10/14 e lista incantesimi ampliati.
 *  - Rimossa "Magia del Patto" dai privilegi del patrono (è spellcasting di classe).
 *  - Aggiunto array `doni_del_patto` (Catena, Lama, Tomo).
 *  - Aggiunto array `suppliche_occulte` (Eldritch Invocations) con prerequisiti.
 *  - Aggiunto campo `patron_spells` per ciascun patrono.
 */

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
      "descrizione_completa": "Le tue ricerche arcane e la magia conferitami dal tuo patrono ti forniscono una certa predisposizione per gli incantesimi. Vedi La Magia per le regole generali sul lancio degli incantesimi e Le Liste degli Incantesimi per la lista degli incantesimi da warlock. La tua caratteristica da incantatore è il Carisma. Puoi usare un focus arcano come focus di incantamento. Gli slot incantesimo del warlock sono tutti dello stesso livello (indicato dalla colonna 'Livello Slot' nella tabella) e vengono recuperati con un riposo breve (o lungo)."
    },
    "Patrono Ultraterreno": {
      "riassunto": "Hai stretto un accordo con una creatura ultraterrena di tua scelta.",
      "descrizione_completa": "Al 1° livello, hai stretto un accordo con una creatura ultraterrena di tua scelta. Le opzioni del Player's Handbook sono tre: Il Fey Selvatico, L'Immondo, Il Grande Antico. La tua scelta ti conferisce un privilegio al 1° livello e poi ancora al 6°, 10° e 14° livello. La scelta del patrono determina inoltre una lista di Incantesimi Ampliati che vengono aggiunti alla lista incantesimi del warlock e sono sempre preparati (non conteggiati nel numero di incantesimi conosciuti)."
    },
    "Suppliche Occulte": {
      "riassunto": "Hai scoperto delle facoltà mistiche perpetue.",
      "descrizione_completa": "Nel tuo studio del sapere occulto, hai scoperto delle facoltà mistiche, frammenti di conoscenze proibite che ti infondono di una capacità magica perpetua. Al 2° livello, ottieni due suppliche occulte di tua scelta. La tua scelta di suppliche è limitata dai prerequisiti indicati in ciascuna supplica (vedi l'array `suppliche_occulte`). Quando sali di livello, puoi sostituire una supplica che già conosci con un'altra. Al 5°, 7°, 9°, 12° e 15° livello impari una supplica aggiuntiva, come indicato dalla colonna 'Suppliche' della tabella di progressione."
    },
    "Dono del Patto": {
      "riassunto": "Al 3° livello, il tuo patrono ti conferisce un dono per il tuo leale servizio.",
      "descrizione_completa": "Al 3° livello, il tuo patrono ultraterreno ti conferisce un dono per il tuo leale servizio. Scegli UNO dei seguenti doni: Patto della Catena, Patto della Lama, Patto del Tomo (vedi l'array `doni_del_patto`). Questa è una scelta di classe (NON una sottoclasse) e non può essere modificata in seguito salvo permessi speciali del DM."
    },
    "Aumento dei Punteggi di Caratteristica": {
      "riassunto": "Incrementi i tuoi punteggi di caratteristica.",
      "descrizione_completa": "Quando raggiungi il 4° livello, e poi ancora all'8°, 12°, 16° e 19° livello, puoi incrementare un tuo punteggio di caratteristica di 2, o incrementare due punteggi di caratteristica di 1. Di norma, utilizzando questo privilegio non puoi accrescere un punteggio di caratteristica oltre il 20."
    },
    "Privilegio di Patrono Ultraterreno": {
      "riassunto": "Ottieni un nuovo privilegio legato al tuo patrono.",
      "descrizione_completa": "Al 6°, 10° e 14° livello, ottieni un nuovo privilegio legato al tuo patrono ultraterreno. Consulta la descrizione del patrono specifico scelto al 1° livello per i dettagli."
    },
    "Arcanum Mistico": {
      "riassunto": "Il tuo patrono ti rivela un segreto magico.",
      "descrizione_completa": "All'11° livello, il tuo patrono ti rivela un segreto magico detto arcanum. Scegli un incantesimo di 6° livello dalla lista degli incantesimi del warlock come arcanum. Puoi lanciare il tuo incantesimo arcanum una volta senza spendere slot incantesimo. Devi terminare un riposo lungo prima di poterlo usare di nuovo. Al 13° livello impari un arcanum di 7° livello, al 15° di 8° livello e al 17° di 9° livello."
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
    "focus_incantamento": "Focus arcano",
    "rituali": false,
    "tipo_slot": "pact_magic",
    "recupero_slot": "riposo_breve"
  },
  // === PATRONI (sottoclassi — scelti al liv. 1) ===
  "sottoclassi": [
    {
      "nome": "Il Fey Selvatico",
      "descrizione": "Il tuo patrono è un signore o una signora delle fate, una creatura di leggenda che governa un reame incantato al di là del velo sottilissimo che separa il mondo reale dal Feywild. Esempi: il Principe delle Roncole, la Regina dell'Aria e delle Tenebre, l'Anziano Titania, l'Estate Bianca o l'Inverno Nero. Il tuo patrono ti concede di attingere alla magia incantatrice del Feywild.",
      "patron_spells": {
        "1": ["Incantare persona", "Passo veloce"],
        "2": ["Calmare emozioni", "Immagine speculare"],
        "3": ["Farlo impazzire", "Schianto"],
        "4": ["Dominare bestie", "Invisibilità superiore"],
        "5": ["Dominare persona", "Modificare memoria"]
      },
      "privilegi": {
        "1": {
          "nome": "Fascino del Fey Selvatico",
          "descrizione": "Come azione, puoi incantare una creatura umanoide che puoi vedere entro 9 metri. Devi poterla vedere e deve poterti sentire. Se la creatura non può essere incantata, sei immune al suo fascino per 24 ore. La creatura è incantata per 1 minuto o finché non subisce danni o non attacchi. Una volta usato questo privilegio, non puoi usarlo di nuovo finché non completi un riposo breve o lungo."
        },
        "6": {
          "nome": "Fuga Nebbiosa",
          "descrizione": "Puoi scomparire in una nuvola di nebbia quando subisci danni. Quando subisci danni, puoi usare la tua reazione per diventare invisibile e teletrasportarti in uno spazio non occupato entro 18 metri che puoi vedere. Resti invisibile fino all'inizio del tuo prossimo turno o finché non attacchi o lanci un incantesimo. Una volta usato questo privilegio, non puoi usarlo di nuovo finché non completi un riposo breve o lungo."
        },
        "10": {
          "nome": "Mantello del Fey Selvatico",
          "descrizione": "Il tuo patrono ti protegge dai danni magici. Quando una creatura ti lancia un incantesimo che ti bersaglia, puoi usare la tua reazione per vantaggio sui tiri salvezza contro quell'incantesimo. Inoltre, non subisci alcun danno se l'incantesimo ti bersaglia e il tiro salvezza ha successo."
        },
        "14": {
          "nome": "Realtà Oscura",
          "descrizione": "Puoi far scivolare una creatura in un reame crepuscolare. Come azione, scegli una creatura che puoi vedere entro 18 metri. Devi superare un tiro salvezza di Carisma del bersaglio (la CD è 8 + il tuo bonus di competenza + il tuo modificatore di Carisma) o la creatura viene trascinata in un reame crepuscolare. Mentre è lì, la creatura è stordita e incapace di percepire ciò che la circonda. All'inizio del tuo prossimo turno, la creatura riappare nello spazio che ha lasciato o nello spazio non occupato più vicino. La creatura ricorda solo di essere caduta in trance. Una volta usato questo privilegio, non puoi usarlo di nuovo finché non completi un riposo lungo."
        }
      }
    },
    {
      "nome": "L'Immondo",
      "descrizione": "Il tuo patrono è un essere infernale, un signore dei Nove Inferi che ricerca la corruzione delle anime e il dominio. Esempi: Bel, Dispater, Mefistofele, Asmodeo. I diavoli infernali sono soddisfatti di patti che includano un prezzo oscuro, e ti concedono poteri di fuoco e inganno.",
      "patron_spells": {
        "1": ["Bruciare le mani", "Sogghigno di Tasha"],
        "2": ["Paura", "Raggio di affaticamento"],
        "3": ["Palla di fuoco", "Stregone"],
        "4": ["Muro di fuoco", "Sguardo penitenziario"],
        "5": ["Dito della morte", "Onda infuocata"]
      },
      "privilegi": {
        "1": {
          "nome": "Benedizione dell'Immondo",
          "descrizione": "Quando riduci a 0 punti ferita una creatura ostile, ottieni punti ferita temporanei pari al tuo modificatore di Carisma + il tuo livello da warlock (minimo 1)."
        },
        "6": {
          "nome": "Sorte dell'Immondo",
          "descrizione": "Puoi decidere di tirare due d20 aggiuntivi quando effettui un tiro di attacco, prova di caratteristica o tiro salvezza, e usare il risultato più alto. Una volta usato questo privilegio, non puoi usarlo di nuovo finché non completi un riposo breve o lungo."
        },
        "10": {
          "nome": "Scudo dell'Immondo",
          "descrizione": "Puoi scegliere di avere resistenza al danno da fuoco o al danno psichico (tua scelta quando ottieni questo privilegio). Inoltre, quando una creatura ti colpisce con un attacco, puoi usare la tua reazione per infliggere 1d10 danni da fuoco o psichici (lo stesso tipo di quello della tua resistenza) all'attaccante."
        },
        "14": {
          "nome": "Salto nell'Inferno",
          "descrizione": "Puoi precipitarti attraverso l'inferno per colpire i tuoi nemici. Come azione, scegli una creatura che puoi vedere entro 9 metri. Ti teletrasporti istantaneamente in uno spazio non occupato entro 1,5 metri dalla creatura e hai vantaggio al primo attacco che effettui contro di essa in questo turno. Subito dopo aver effettuato l'attacco (o se non effettui alcun attacco), ti teletrasporti in uno spazio non occupato a tua scelta entro 9 metri dalla posizione in cui eri prima di teletrasportarti la prima volta. Una volta usato questo privilegio, non puoi usarlo di nuovo finché non completi un riposo lungo."
        }
      }
    },
    {
      "nome": "Il Grande Antico",
      "descrizione": "Il tuo patrono è un essere misterioso, una stranezza aliena proveniente dal Regno Lontano o dagli abissi dello spazio. Esempi: il Dio-Brain dei illithid, l'entità Tharizdun, la voce di Cthulhu, o altre entità cosmiche. Il contatto con tale entità ti conferisce poteri legati alla mente, alla follia e al cosmo.",
      "patron_spells": {
        "1": ["Individuazione dei pensieri", "Risata incontenibile di Tasha"],
        "2": ["Immagine speculare", "Rilevare pensieri"],
        "3": ["Clairvoyance", "Immagine maggiore"],
        "4": ["Confusione", "Sguardo penetrante"],
        "5": ["Modificare memoria", "Sogno"]
      },
      "privilegi": {
        "1": {
          "nome": "Sussurro Risvegliato",
          "descrizione": "Puoi comunicare telepaticamente con qualsiasi creatura entro 36 metri che tu possa vedere. Non è necessario che la creatura conosca una lingua per comunicare con te in questo modo, ma deve essere in grado di comprendere almeno una lingua."
        },
        "6": {
          "nome": "Entropia Protettiva",
          "descrizione": "Hai resistenza al danno psichico. Inoltre, quando una creatura ti infligge danno psichico, quella creatura subisce lo stesso ammontare di danno psichico. Non sogni più, ma non puoi più essere spaventato."
        },
        "10": {
          "nome": "Schermo del Pensiero",
          "descrizione": "La tua mente non può essere letta da telepatia o altri mezzi senza tuo consenso. Una creatura che tenti di leggere i tuoi pensieri deve superare un tiro salvezza di Carisma contro la CD dei tuoi incantesimi o subire 1d10 danni psichici ed essere incapace di leggere i tuoi pensieri per 24 ore."
        },
        "14": {
          "nome": "Creare Servo",
          "descrizione": "Puoi toccare una creatura umanoide incapace che puoi vedere e che sia impressionabile (a discrezione del DM). La creatura diventa incantata da te e obbedisce ai tuoi comandi come un famiglio, ma rimane cosciente e può agire normalmente salvo ordini. La creatura rimane incantata per 1 ora, o finché non subisce danni o non attacchi. Una volta usato questo privilegio, non puoi usarlo di nuovo finché non completi un riposo lungo."
        }
      }
    }
  ],
  // === DONI DEL PATTO (privilegi di classe — scelti al liv. 3, NON sottoclassi) ===
  "doni_del_patto": [
    {
      "nome": "Patto della Catena",
      "descrizione": "Apprendi l'incantesimo trovare famiglio e lo puoi lanciare come rituale. L'incantesimo non è conteggiato tra i tuoi incantesimi conosciuti. Quando lanci l'incantesimo, puoi scegliere una qualsiasi delle normali forme per il tuo famiglio o una delle seguenti forme speciali: imp, quasit, pseudodrago, sprite. Inoltre, quando effettui l'azione Attaccare, puoi rinunciare a uno dei tuoi attacchi per permettere al tuo famiglio di effettuare un attacco per conto proprio, usando la sua reazione.",
      "livello": 3
    },
    {
      "nome": "Patto della Lama",
      "descrizione": "Puoi usare la tua azione per creare un'arma del patto nella tua mano. Puoi scegliere la forma che assumerà quest'arma da mischia ogni volta che la crei. Mentre la impugni, vieni considerato competente con essa. Quest'arma è considerata magica al fine di superare la resistenza e l'immunità agli attacchi e i danni non magici. L'arma scompare se lascia la tua mano per più di 5 minuti o se usi la tua azione per congedarla. Puoi trasformare un'arma magica nella tua arma del patto (questa trasformazione non altera le proprietà magiche dell'arma).",
      "livello": 3
    },
    {
      "nome": "Patto del Tomo",
      "descrizione": "Quando ottieni questo privilegio, il tuo patrono ti dona un grimorio chiamato Libro delle Ombre. Scegli tre trucchetti dalla lista degli incantesimi di qualsiasi classe (questi trucchetti possono appartenere a liste diverse). Finché il libro è con te, puoi lanciare questi trucchetti a volontà come se per te fossero incantesimi da warlock. Non sono conteggiati nel numero di trucchetti da te conosciuti. Se perdi il Libro delle Ombre, puoi eseguire una cerimonia di 1 ora per riceverne uno nuovo dal tuo patrono. Questa cerimonia può essere eseguita durante un riposo breve o lungo e distrugge il libro precedente.",
      "livello": 3
    }
  ],
  // === SUPPLICHE OCCULTE (Eldritch Invocations) ===
  // Si scelgono al liv. 2 (2 suppliche), poi crescono come da tabella progressione.
  // Le suppliche con prerequisiti possono essere prese solo se soddisfatti.
  "suppliche_occulte": [
    {
      "nome": "Patto della Catena (Amico Familiare)",
      "descrizione": "Quando lanci trovare famiglio, puoi scegliere una delle forme speciali del Patto della Catena (imp, quasit, pseudodrago, sprite) anche senza avere il Dono del Patto della Catena. PREREQUISITO: liv. 2 da warlock.",
      "prerequisito": "Warlock liv. 2",
      "livello_minimo": 2
    },
    {
      "nome": "Benedizione del Millefacce",
      "descrizione": "Ogni volta che completi un riposo breve o lungo, puoi sostituire una supplica che conosci con un'altra supplica per cui soddisfi i prerequisiti.",
      "prerequisito": "Warlock liv. 2",
      "livello_minimo": 2
    },
    {
      "nome": "Bramosia di Conoscenza",
      "descrizione": "Hai competenza in due abilità a tua scelta tra le seguenti: Arcano, Storia, Indagare, Natura, Religione.",
      "prerequisito": "Warlock liv. 2",
      "livello_minimo": 2
    },
    {
      "nome": "Maledizione della Paura",
      "descrizione": "Puoi lanciare sogghigno di Tasha a volontà senza spendere slot incantesimo. Non è conteggiato nei tuoi incantesimi conosciuti.",
      "prerequisito": "Warlock liv. 2",
      "livello_minimo": 2
    },
    {
      "nome": "Sguardo del Diavolo",
      "descrizione": "Puoi vedere normalmente nell'oscurità, sia normale che magica, fino a 36 metri.",
      "prerequisito": "Warlock liv. 2",
      "livello_minimo": 2
    },
    {
      "nome": "Maledizione della Rabbia",
      "descrizione": "Puoi lanciare a volontà bruciare le mani come incantesimo, senza spendere slot incantesimo. Non è conteggiato nei tuoi incantesimi conosciuti.",
      "prerequisito": "Warlock liv. 2",
      "livello_minimo": 2
    },
    {
      "nome": "Schermo contro le Invocation",
      "descrizione": "Hai vantaggio sui tiri salvezza contro incantesimi e altri effetti magici.",
      "prerequisito": "Warlock liv. 2",
      "livello_minimo": 2
    },
    {
      "nome": "Maledizione del Cacciatore",
      "descrizione": "Scegli una creatura che puoi vedere entro 9 metri. Il bersaglio non ha alcun vantaggio sui tiri salvezza contro i tuoi incantesimi. Una volta usato, non puoi usarlo di nuovo per 1 minuto o finché il bersaglio muore.",
      "prerequisito": "Warlock liv. 2",
      "livello_minimo": 2
    },
    {
      "nome": "Trucco Affilato",
      "descrizione": "Quando ottieni un colpo critico con un attacco di arma, puoi tirare un danno addizionale pari al tuo livello da warlock.",
      "prerequisito": "Patto della Lama",
      "livello_minimo": 3,
      "richiede_dono": "Patto della Lama"
    },
    {
      "nome": "Voce dell'Encatatore",
      "descrizione": "Puoi lanciare incantesimi verbalmente senza che il suono sia udibile a più di 1,5 metri da te.",
      "prerequisito": "Warlock liv. 2",
      "livello_minimo": 2
    },
    {
      "nome": "Occhi del Runecarver",
      "descrizione": "Hai vantaggio nelle prove di Indagare e Percezione basate sulla vista.",
      "prerequisito": "Warlock liv. 2",
      "livello_minimo": 2
    },
    {
      "nome": "Invasione dei Sogni",
      "descrizione": "Puoi lanciare a volontà muta forma come incantesimo, con effetto limitato alle creature addormentate.",
      "prerequisito": "Warlock liv. 2",
      "livello_minimo": 2
    },
    {
      "nome": "Tocco Maledetto",
      "descrizione": "Quando colpisci una creatura con un attacco di arma, puoi infliggere 1d6 danni psichici addizionali.",
      "prerequisito": "Warlock liv. 2",
      "livello_minimo": 2
    },
    {
      "nome": "Arma Leggendaria del Patto",
      "descrizione": "Puoi usare un'arma del patto come focus arcano per i tuoi incantesimi da warlock. Inoltre, la tua arma del patto ha un bonus +1 ai tiri per colpire e al danno. Questo bonus aumenta a +2 al liv. 9 e +3 al liv. 13.",
      "prerequisito": "Patto della Lama, Warlock liv. 5",
      "livello_minimo": 5,
      "richiede_dono": "Patto della Lama"
    },
    {
      "nome": "Sete di Lama Vitale",
      "descrizione": "Una volta per turno, quando colpisci una creatura con la tua arma del patto, puoi infliggere 1d8 danni necrotici addizionali. Al liv. 14, il danno addizionale aumenta a 2d8.",
      "prerequisito": "Patto della Lama, Warlock liv. 5",
      "livello_minimo": 5,
      "richiede_dono": "Patto della Lama"
    },
    {
      "nome": "Eco della Maledizione",
      "descrizione": "Quando usi la Maledizione dell'Immondo (sorte dell'Immondo), puoi rirollare uno dei d20 aggiuntivi una volta.",
      "prerequisito": "L'Immondo",
      "livello_minimo": 2,
      "richiede_patrono": "L'Immondo"
    },
    {
      "nome": "Anima della Maledizione",
      "descrizione": "Quando riduci a 0 punti ferita una creatura ostile, ottieni punti ferita temporanei pari al doppio del tuo modificatore di Carisma + il tuo livello da warlock.",
      "prerequisito": "L'Immondo, Warlock liv. 9",
      "livello_minimo": 9,
      "richiede_patrono": "L'Immondo"
    },
    {
      "nome": "Schianto della Maledizione",
      "descrizione": "Quando colpisci una creatura con un attacco, puoi infliggere 1d6 danni psichici addizionali. La creatura deve superare un tiro salvezza di Saggezza o essere spaventata per 1 minuto.",
      "prerequisito": "Il Grande Antico, Warlock liv. 5",
      "livello_minimo": 5,
      "richiede_patrono": "Il Grande Antico"
    },
    {
      "nome": "Patto della Catena Profondo",
      "descrizione": "Il tuo famiglio guadagna un bonus +2 alla CA e +5 punti ferita per ciascun livello da warlock che hai oltre il 3°.",
      "prerequisito": "Patto della Catena, Warlock liv. 5",
      "livello_minimo": 5,
      "richiede_dono": "Patto della Catena"
    },
    {
      "nome": "Cadenza della Bestia",
      "descrizione": "Puoi lanciare metamorfosi una volta senza spendere slot incantesimo. Devi completare un riposo lungo prima di poterlo usare di nuovo.",
      "prerequisito": "Warlock liv. 7",
      "livello_minimo": 7
    },
    {
      "nome": "Divenire Colui che Respira",
      "descrizione": "Non hai bisogno di respirare, e sei immune agli effetti di gas e veleni inalati.",
      "prerequisito": "Warlock liv. 7",
      "livello_minimo": 7
    },
    {
      "nome": "Patto del Vuoto",
      "descrizione": "Quando lanci un incantesimo da warlock di 1°-5° livello, puoi decidere di lanciarlo a un livello superiore senza spendere slot aggiuntivi. L'incantesimo viene lanciato a un livello pari al tuo livello_slot massimo.",
      "prerequisito": "Warlock liv. 9",
      "livello_minimo": 9
    },
    {
      "nome": "Lama Sanguinaria del Patto",
      "descrizione": "Quando lanci un incantesimo da warlock, puoi far flusso di energia necrotica dalla tua arma del patto. La prossima volta che colpisci una creatura con la tua arma del patto prima della fine del tuo prossimo turno, le infliggi danni necrotici addizionali pari al livello dell'incantesimo lanciato.",
      "prerequisito": "Patto della Lama, Warlock liv. 9",
      "livello_minimo": 9,
      "richiede_dono": "Patto della Lama"
    },
    {
      "nome": "Anima Rinata",
      "descrizione": "Quando scendi a 0 punti ferita ma non muori, recuperi 1 punto ferita e poi un numero di punti ferita pari al tuo livello da warlock.",
      "prerequisito": "Warlock liv. 9",
      "livello_minimo": 9
    },
    {
      "nome": "Sguardo di Maledizione",
      "descrizione": "Come azione, scegli una creatura che puoi vedere entro 9 metri. La creatura deve superare un tiro salvezza di Costituzione contro la CD dei tuoi incantesimi o subire 1d10 danni necrotici per ciascun tuo livello da warlock. Una volta usato, non puoi usarlo di nuovo finché non completi un riposo lungo.",
      "prerequisito": "Warlock liv. 12",
      "livello_minimo": 12
    },
    {
      "nome": "Risveglio dei Morti",
      "descrizione": "Puoi lanciare creare non morti una volta senza spendere slot incantesimo. Devi completare un riposo lungo prima di poterlo usare di nuovo.",
      "prerequisito": "Warlock liv. 12",
      "livello_minimo": 12
    },
    {
      "nome": "Benedizione Corazzata",
      "descrizione": "Hai un bonus +1 alla CA finché non indossi armature medie o pesanti.",
      "prerequisito": "Warlock liv. 2",
      "livello_minimo": 2
    },
    {
      "nome": "Lance delle Bugie",
      "descrizione": "Puoi lanciare rilevare pensieri a volontà senza spendere slot incantesimo. Non è conteggiato nei tuoi incantesimi conosciuti.",
      "prerequisito": "Warlock liv. 5",
      "livello_minimo": 5
    },
    {
      "nome": "Mille Voci",
      "descrizione": "Puoi imitare i suoni di qualsiasi creatura che hai sentito in passato. Hai vantaggio nelle prove di Inganno per ingannare creature che imitano la voce di un'altra persona.",
      "prerequisito": "Warlock liv. 2",
      "livello_minimo": 2
    },
    {
      "nome": "Occhi del Maledetto",
      "descrizione": "Puoi vedere creature invisibili e oggetti invisibili entro 36 metri.",
      "prerequisito": "Warlock liv. 5",
      "livello_minimo": 5
    },
    {
      "nome": "Saltatore del Vuoto",
      "descrizione": "Puoi lanciare porta dimensionale una volta senza spendere slot incantesimo. Devi completare un riposo lungo prima di poterlo usare di nuovo.",
      "prerequisito": "Warlock liv. 12",
      "livello_minimo": 12
    },
    {
      "nome": "Studio del Libro delle Ombre",
      "descrizione": "Quando ottieni questo privilegio, scegli tre trucchetti aggiuntivi dalla lista di qualsiasi classe. Finché possiedi il Libro delle Ombre, puoi lanciare questi trucchetti a volontà.",
      "prerequisito": "Patto del Tomo",
      "livello_minimo": 3,
      "richiede_dono": "Patto del Tomo"
    },
    {
      "nome": "Patto del Vuoto Superiore",
      "descrizione": "Quando lanci un incantesimo da warlock, puoi decidere di infliggere 1d10 danni necrotici a una creatura entro 9 metri che puoi vedere.",
      "prerequisito": "Warlock liv. 15",
      "livello_minimo": 15
    },
    {
      "nome": "Vortice del Vuoto",
      "descrizione": "Quando riduci a 0 punti ferita una creatura ostile, puoi decidere di recuperare immediatamente un uso di una supplica che hai usato nelle ultime 24 ore.",
      "prerequisito": "Warlock liv. 15",
      "livello_minimo": 15
    },
    {
      "nome": "Catena del Patto Antico",
      "descrizione": "Quando lanci un incantesimo da warlock di 1°-5° livello che ha una durata di 1 minuto o più, puoi estenderne la durata a 8 ore.",
      "prerequisito": "Warlock liv. 15",
      "livello_minimo": 15
    },
    {
      "nome": "Anima di Fuoco",
      "descrizione": "Hai resistenza al danno da fuoco. Inoltre, quando lanci un incantesimo che infligge danno da fuoco, puoi aggiungere il tuo bonus di competenza al danno.",
      "prerequisito": "L'Immondo, Warlock liv. 6",
      "livello_minimo": 6,
      "richiede_patrono": "L'Immondo"
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
