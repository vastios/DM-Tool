/**
 * Database della classe Druido
 * Estratto da dungeonedraghi.it
 */

export const druid = {
    index: 'druid',
    classe: "Druido",
    descrizione_breve: "Un custode della natura che manipola il potere primordiale per trasformarsi e proteggere il mondo naturale.",
    dado_vita: "d8",
    caratteristica_primaria: "Saggezza",
    
    competenze: {
        armature: ["Armature leggere", "Armature medie", "Scudi (non metallici)"],
        armi: ["Bastoni", "Mazze", "Fionde", "Spiedi", "Asce", "Giavellotti", "Lance", "Picche", "Armi da guerra"],
        strumenti: "Strumenti da erborista",
        tiri_salvezza: ["Intelligenza", "Saggezza"],
        abilita: "Scegli due abilità tra: Arcana, Addestrare Animali, Intuizione, Medicina, Natura, Percezione, Religione, Sopravvivenza"
    },
    
    punti_ferita: {
        dado_vita: "d8",
        pf_livello_1: "8 + il tuo modificatore di Costituzione",
        pf_livelli_successivi: "1d8 (o 5) + il tuo modificatore di Costituzione per livello oltre il 1°"
    },
    
    equipaggiamento: [
        "(a) uno scudo di legno o (b) qualsiasi arma semplice",
        "(a) una mazza o (b) un bastone o (c) una lancia o (d) un giavellotto",
        "Armatura di cuoio, attrezzi da erborista e un focus druidico",
        "(a) uno zaino da esploratore o (b) una borsa da viaggiatore",
        "Un simbolo sacro (un amuleto o un totem)"
    ],
    
    tabella_progressione: [
        {livello: 1, bonus_competenza: 2, privilegi: ["Druidico", "Incantesimi"], trucchetti: 2, slot_1: 2, slot_2: 0, slot_3: 0, slot_4: 0, slot_5: 0, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 2, bonus_competenza: 2, privilegi: ["Forma Selvatica", "Circolo Druidico"], trucchetti: 2, slot_1: 3, slot_2: 0, slot_3: 0, slot_4: 0, slot_5: 0, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 3, bonus_competenza: 2, privilegi: [], trucchetti: 2, slot_1: 4, slot_2: 2, slot_3: 0, slot_4: 0, slot_5: 0, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 4, bonus_competenza: 2, privilegi: ["Forma Selvatica Migliorata", "Aumento dei Punteggi di Caratteristica"], trucchetti: 3, slot_1: 4, slot_2: 3, slot_3: 0, slot_4: 0, slot_5: 0, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 5, bonus_competenza: 3, privilegi: [], trucchetti: 3, slot_1: 4, slot_2: 3, slot_3: 2, slot_4: 0, slot_5: 0, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 6, bonus_competenza: 3, privilegi: ["Privilegio del Circolo Druidico"], trucchetti: 3, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 0, slot_5: 0, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 7, bonus_competenza: 3, privilegi: [], trucchetti: 3, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 1, slot_5: 0, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 8, bonus_competenza: 3, privilegi: ["Forma Selvatica Migliorata", "Aumento dei Punteggi di Caratteristica"], trucchetti: 3, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 2, slot_5: 0, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 9, bonus_competenza: 4, privilegi: [], trucchetti: 3, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 1, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 10, bonus_competenza: 4, privilegi: ["Privilegio del Circolo Druidico"], trucchetti: 4, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 11, bonus_competenza: 4, privilegi: [], trucchetti: 4, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2, slot_6: 1, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 12, bonus_competenza: 4, privilegi: ["Aumento dei Punteggi di Caratteristica"], trucchetti: 4, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2, slot_6: 1, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 13, bonus_competenza: 5, privilegi: [], trucchetti: 4, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2, slot_6: 1, slot_7: 1, slot_8: 0, slot_9: 0},
        {livello: 14, bonus_competenza: 5, privilegi: ["Privilegio del Circolo Druidico"], trucchetti: 4, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2, slot_6: 1, slot_7: 1, slot_8: 0, slot_9: 0},
        {livello: 15, bonus_competenza: 5, privilegi: [], trucchetti: 4, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2, slot_6: 1, slot_7: 1, slot_8: 1, slot_9: 0},
        {livello: 16, bonus_competenza: 5, privilegi: ["Aumento dei Punteggi di Caratteristica"], trucchetti: 4, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2, slot_6: 1, slot_7: 1, slot_8: 1, slot_9: 0},
        {livello: 17, bonus_competenza: 6, privilegi: [], trucchetti: 4, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2, slot_6: 1, slot_7: 1, slot_8: 1, slot_9: 1},
        {livello: 18, bonus_competenza: 6, privilegi: ["Corpo Senza Tempo", "Incantesimi Bestiali"], trucchetti: 4, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 3, slot_6: 1, slot_7: 1, slot_8: 1, slot_9: 1},
        {livello: 19, bonus_competenza: 6, privilegi: ["Aumento dei Punteggi di Caratteristica"], trucchetti: 4, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 3, slot_6: 2, slot_7: 1, slot_8: 1, slot_9: 1},
        {livello: 20, bonus_competenza: 6, privilegi: ["Arcidruido"], trucchetti: 4, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 3, slot_6: 2, slot_7: 2, slot_8: 1, slot_9: 1}
    ],
    
    descrizione_privilegi: {
        "Druidico": {
            riassunto: "Conosci la lingua segreta dei druidi.",
            descrizione_completa: "Al 1° livello, conosci il Druidico, la lingua segreta del suo ordine. Puoi parlarla e usarla per lasciare messaggi segreti. Tu e coloro che conoscono questa lingua sono in grado di individuare tali messaggi automaticamente. Altri possono notare la presenza di un messaggio in Druidico superando una prova di Saggezza (Percezione) con CD 15, ma non possono decifrarlo senza l'aiuto della magia."
        },
        "Incantesimi": {
            riassunto: "Lanci incantesimi druidici attingendo al potere della natura.",
            descrizione_completa: "Al 1° livello, conosci due trucchetti a tua scelta dalla lista degli incantesimi da druido. La tua caratteristica da incantatore è la Saggezza. Puoi preparare un numero di incantesimi pari al tuo modificatore di Saggezza + il tuo livello da druido. Gli incantesimi scelti devono essere di un livello per cui hai slot di incantesimo."
        },
        "Forma Selvatica": {
            riassunto: "Puoi trasformarti in una bestia che hai visto prima.",
            descrizione_completa: "Al 2° livello, puoi usare la tua azione per assumere magicamente la forma di una bestia che hai visto prima. Puoi usare questo privilegio due volte, e recuperi tutti gli usi dopo un riposo breve o lungo. Al 2° livello, puoi trasformarti in bestie con GS 1/4. Al 4° livello (Forma Selvatica Migliorata), GS 1/2. Al 8° livello (Forma Selvatica Migliorata), GS 1 e puoi trasformarti in bestie che nuotano o volano."
        },
        "Forma Selvatica Migliorata": {
            riassunto: "La tua Forma Selvatica migliora.",
            descrizione_completa: "Al 4° livello, puoi trasformarti in bestie con GS 1/2. Al 8° livello, puoi trasformarti in bestie con GS 1 e puoi assumere la forma di bestie che nuotano o volano."
        },
        "Circolo Druidico": {
            riassunto: "Scegli un circolo druidico che modella la tua connessione con la natura.",
            descrizione_completa: "Al 2° livello, scegli un circolo druidico: Circolo della Terra o Circolo della Luna. Il tuo circolo ti conferisce privilegi al 2° livello, e poi ancora al 6°, 10° e 14° livello."
        },
        "Privilegio del Circolo Druidico": {
            riassunto: "Ottieni un privilegio dal tuo Circolo Druidico.",
            descrizione_completa: "Ottieni un privilegio speciale dal Circolo Druidico che hai scelto al 2° livello. Consulta la sezione Sottoclassi per i dettagli."
        },
        "Aumento dei Punteggi di Caratteristica": {
            riassunto: "Puoi aumentare i tuoi punteggi di caratteristica.",
            descrizione_completa: "Quando raggiungi il 4° livello, e poi ancora all'8°, 12°, 16° e 19° livello, puoi incrementare un tuo punteggio di caratteristica di 2, o incrementare due punteggi di caratteristica di 1. Di norma, utilizzando questo privilegio non puoi accrescere un punteggio di caratteristica oltre il 20."
        },
        "Corpo Senza Tempo": {
            riassunto: "Il tuo corpo invecchia più lentamente.",
            descrizione_completa: "Al 18° livello, la magia primordiale ti causa di invecchiare più lentamente. Per ogni 10 anni che passano, il tuo corpo invecchia solo 1 anno."
        },
        "Incantesimi Bestiali": {
            riassunto: "Puoi lanciare incantesimi mentre sei in Forma Selvaggia.",
            descrizione_completa: "Al 18° livello, puoi lanciare molti dei tuoi incantesimi da druido in qualsiasi forma che assumi con Forma Selvaggia. Puoi eseguire i componenti somatici e verbali degli incantesimi mentre sei nella forma bestiale, ma non puoi usare componenti materiali."
        },
        "Arcidruido": {
            riassunto: "Puoi usare Forma Selvatica un numero illimitato di volte.",
            descrizione_completa: "Al 20° livello, puoi usare Forma Selvatica un numero illimitato di volte. Inoltre, puoi ignorare i componenti verbali e somatici dei tuoi incantesimi da druido e puoi ignorare i componenti materiali che non hanno costo."
        }
    },
    
    incantazione: {
        caratteristica_da_incantatore: "Saggezza",
        cd_tiro_salvezza: "8 + bonus competenza + modificatore Saggezza",
        modificatore_attacco: "bonus competenza + modificatore Saggezza",
        focus_incantamento: "Focus druidico (muschio, vischio, totem, ecc.)",
        rituali: true
    },
    
    sottoclassi: [
        {
            nome: "Cerchio della Terra",
            descrizione: "Il Cerchio della Terra comprende mistici e saggi che custodiscono la saggezza antica e proteggono la natura attraverso incantesimi e rituali.",
            privilegi: {
                "2": {
                    nome: "Recupero Naturale",
                    descrizione: "Durante un riposo breve, puoi recuperare slot di incantesimo spenditi. Il totale dei livelli recuperati non può superare la metà del tuo livello da druido."
                },
                "6": {
                    nome: "Percorso Naturale",
                    descrizione: "Scegli un terreno: Artico, Costa, Deserto, Foresta, Prateria, Montagna, Palude, Sottosuolo. Hai vantaggio sulle prove di Intelligenza e Saggezza relative al tuo terreno."
                },
                "10": {
                    nome: "Protezione della Natura",
                    descrizione: "Le piante e gli animali non ti attaccano a meno che tu non li minacci. Puoi comunicare con bestie e piante semplici."
                },
                "14": {
                    nome: "Purificazione della Natura",
                    descrizione: "Puoi usare la tua azione per rimuovere maledizioni, malattie e veleni da una creatura che tocchi. Puoi anche neutralizzare un oggetto magico che emana aura maligna."
                }
            }
        },
        {
            nome: "Cerchio della Luna",
            descrizione: "Il Cerchio della Luna comprende druidi che si trasformano in bestie feroci e combattono in prima linea.",
            privilegi: {
                "2": {
                    nome: "Combattente in Forma Selvaggia",
                    descrizione: "La tua Forma Selvaggia può assumere forme più potenti (GS fino al tuo livello da druido, massimo GS 6). Quando ti trasformi, ottieni punti ferita temporanei pari al tuo livello da druido."
                },
                "6": {
                    nome: "Forma Elementare",
                    descrizione: "Puoi trasformarti in un elementale (aria, terra, fuoco o acqua) due volte per riposo lungo. Quando ti trasformi, recuperi tutti i punti ferita."
                },
                "10": {
                    nome: "Forma Selvaggia Elementare",
                    descrizione: "Puoi usare due usi di Forma Selvaggia per trasformarti in un elementale di GS 5 o inferiore."
                },
                "14": {
                    nome: "Forma Selvaggia Illimitata (Migliorata)",
                    descrizione: "Puoi ignorare i componenti verbali e somatici degli incantesimi mentre sei in Forma Selvaggia. Inoltre, ottieni resistenza ai danni non magici mentre sei trasformato."
                }
            }
        }
    ],
    
    // Compatibilità
    name: "Druido",
    hit_die: 8,
    saving_throws: [
        { name: "Intelligenza", index: "int" },
        { name: "Saggezza", index: "wis" }
    ]
};
