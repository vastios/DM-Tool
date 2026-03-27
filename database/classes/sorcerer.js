/**
 * Database della classe Stregone
 * Estratto da dungeonedraghi.it
 */

export const sorcerer = {
    index: 'sorcerer',
    classe: "Stregone",
    descrizione_breve: "Un portatore di magia innata che manipola la trama della realtà con la forza della personalità.",
    dado_vita: "d6",
    caratteristica_primaria: "Carisma",
    
    competenze: {
        armature: [],
        armi: ["Balestre leggere", "Bastoni", "Dardi", "Fionde", "Pugnali"],
        strumenti: "Nessuno",
        tiri_salvezza: ["Costituzione", "Carisma"],
        abilita: "Scegli due abilità tra: Arcana, Furtività, Intimidire, Intuizione, Persuasione, Religione"
    },
    
    punti_ferita: {
        dado_vita: "d6",
        pf_livello_1: "6 + il tuo modificatore di Costituzione",
        pf_livelli_successivi: "1d6 (o 4) + il tuo modificatore di Costituzione per livello oltre il 1°"
    },
    
    equipaggiamento: [
        "(a) una balestra leggera e 20 dardi o (b) un bastone",
        "(a) una borsa da incantatore o (b) un focus arcano",
        "(a) un pugnale o (b) due pugnali",
        "Una tunica da studioso",
        "Uno zaino da esploratore"
    ],
    
    tabella_progressione: [
        {livello: 1, bonus_competenza: 2, privilegi: ["Incantesimi", "Origine Stregonesca", "Punti Stregoneria"], trucchetti_conosciuti: 4, incantesimi_conosciuti: 2, punti_stregoneria: 1, slot_1: 2, slot_2: 0, slot_3: 0, slot_4: 0, slot_5: 0},
        {livello: 2, bonus_competenza: 2, privilegi: ["Incantesimi Flessibili"], trucchetti_conosciuti: 4, incantesimi_conosciuti: 3, punti_stregoneria: 2, slot_1: 3, slot_2: 0, slot_3: 0, slot_4: 0, slot_5: 0},
        {livello: 3, bonus_competenza: 2, privilegi: ["Metamagia"], trucchetti_conosciuti: 4, incantesimi_conosciuti: 4, punti_stregoneria: 3, slot_1: 4, slot_2: 2, slot_3: 0, slot_4: 0, slot_5: 0},
        {livello: 4, bonus_competenza: 2, privilegi: ["Aumento dei Punteggi di Caratteristica"], trucchetti_conosciuti: 5, incantesimi_conosciuti: 5, punti_stregoneria: 4, slot_1: 4, slot_2: 3, slot_3: 0, slot_4: 0, slot_5: 0},
        {livello: 5, bonus_competenza: 3, privilegi: [], trucchetti_conosciuti: 5, incantesimi_conosciuti: 6, punti_stregoneria: 5, slot_1: 4, slot_2: 3, slot_3: 2, slot_4: 0, slot_5: 0},
        {livello: 6, bonus_competenza: 3, privilegi: ["Privilegio dell'Origine Stregonesca"], trucchetti_conosciuti: 5, incantesimi_conosciuti: 7, punti_stregoneria: 6, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 0, slot_5: 0},
        {livello: 7, bonus_competenza: 3, privilegi: [], trucchetti_conosciuti: 5, incantesimi_conosciuti: 8, punti_stregoneria: 7, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 1, slot_5: 0},
        {livello: 8, bonus_competenza: 3, privilegi: ["Aumento dei Punteggi di Caratteristica"], trucchetti_conosciuti: 5, incantesimi_conosciuti: 9, punti_stregoneria: 8, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 2, slot_5: 0},
        {livello: 9, bonus_competenza: 4, privilegi: [], trucchetti_conosciuti: 5, incantesimi_conosciuti: 10, punti_stregoneria: 9, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 1},
        {livello: 10, bonus_competenza: 4, privilegi: ["Metamagia (aggiuntiva)"], trucchetti_conosciuti: 6, incantesimi_conosciuti: 11, punti_stregoneria: 10, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2},
        {livello: 11, bonus_competenza: 4, privilegi: [], trucchetti_conosciuti: 6, incantesimi_conosciuti: 11, punti_stregoneria: 11, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2},
        {livello: 12, bonus_competenza: 4, privilegi: ["Aumento dei Punteggi di Caratteristica"], trucchetti_conosciuti: 6, incantesimi_conosciuti: 12, punti_stregoneria: 12, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2},
        {livello: 13, bonus_competenza: 5, privilegi: [], trucchetti_conosciuti: 6, incantesimi_conosciuti: 13, punti_stregoneria: 13, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2},
        {livello: 14, bonus_competenza: 5, privilegi: ["Privilegio dell'Origine Stregonesca"], trucchetti_conosciuti: 6, incantesimi_conosciuti: 14, punti_stregoneria: 14, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2},
        {livello: 15, bonus_competenza: 5, privilegi: [], trucchetti_conosciuti: 6, incantesimi_conosciuti: 15, punti_stregoneria: 15, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2},
        {livello: 16, bonus_competenza: 5, privilegi: ["Aumento dei Punteggi di Caratteristica"], trucchetti_conosciuti: 6, incantesimi_conosciuti: 15, punti_stregoneria: 16, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2},
        {livello: 17, bonus_competenza: 6, privilegi: ["Metamagia (aggiuntiva)"], trucchetti_conosciuti: 6, incantesimi_conosciuti: 16, punti_stregoneria: 17, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2},
        {livello: 18, bonus_competenza: 6, privilegi: [], trucchetti_conosciuti: 6, incantesimi_conosciuti: 16, punti_stregoneria: 18, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 3},
        {livello: 19, bonus_competenza: 6, privilegi: ["Aumento dei Punteggi di Caratteristica"], trucchetti_conosciuti: 6, incantesimi_conosciuti: 17, punti_stregoneria: 19, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 3},
        {livello: 20, bonus_competenza: 6, privilegi: ["Recupero Stregonesco"], trucchetti_conosciuti: 6, incantesimi_conosciuti: 17, punti_stregoneria: 20, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 3}
    ],
    
    descrizione_privilegi: {
        "Incantesimi": {
            riassunto: "Conosci e lanci incantesimi innati basati sul tuo Carisma.",
            descrizione_completa: "Al 1° livello, conosci due trucchetti a tua scelta dalla lista degli incantesimi da stregone e un numero di incantesimi di 1° livello pari a 2. Conosci sempre più incantesimi man mano che sali di livello, come mostrato nella tabella. La tua caratteristica da incantatore è il Carisma. Puoi usare un focus arcano come focus di incantamento."
        },
        "Origine Stregonesca": {
            riassunto: "Scegli un'origine che spiega la fonte del tuo potere magico.",
            descrizione_completa: "Al 1° livello, scegli un'origine stregonesca che spiega la fonte del tuo potere magico: Lineaggio Drago o Magia Selvaggia. La tua scelta ti conferisce privilegi al 1° livello, e poi ancora al 6° e 14° livello."
        },
        "Punti Stregoneria": {
            riassunto: "Hai punti stregoneria da spendere per alimentare vari privilegi.",
            descrizione_completa: "Al 1° livello, hai 1 punto stregoneria. Il numero massimo di punti stregoneria che puoi avere è pari al tuo livello da stregone. Puoi recuperare tutti i punti stregoneria spesi dopo un riposo lungo."
        },
        "Incantesimi Flessibili": {
            riassunto: "Puoi convertire punti stregoneria in slot di incantesimo.",
            descrizione_completa: "Al 2° livello, puoi usare i tuoi punti stregoneria per creare slot di incantesimo aggiuntivi. Creare uno slot di 1° livello costa 2 punti, uno di 2° livello costa 3 punti, uno di 3° livello costa 5 punti, uno di 4° livello costa 6 punti, uno di 5° livello costa 7 punti. Puoi anche convertire uno slot di incantesimo in punti stregoneria: 1° livello = 1 punto, 2° = 2 punti, 3° = 3 punti, 4° = 4 punti, 5° = 5 punti."
        },
        "Metamagia": {
            riassunto: "Puoi modificare i tuoi incantesimi spendendo punti stregoneria.",
            descrizione_completa: "Al 3° livello, guadagni la capacità di modificare i tuoi incantesimi. Scegli due opzioni di Metamagia dalla lista: Incantesimo Gemello, Incantesimo Rapido, Incantesimo Esteso, Incantesimo Potente, Incantesimo Accurato. Puoi applicare solo un'opzione di Metamagia per incantesimo."
        },
        "Aumento dei Punteggi di Caratteristica": {
            riassunto: "Puoi aumentare i tuoi punteggi di caratteristica.",
            descrizione_completa: "Quando raggiungi il 4° livello, e poi ancora all'8°, 12°, 16° e 19° livello, puoi incrementare un tuo punteggio di caratteristica di 2, o incrementare due punteggi di caratteristica di 1. Di norma, utilizzando questo privilegio non puoi accrescere un punteggio di caratteristica oltre il 20."
        },
        "Recupero Stregonesco": {
            riassunto: "Puoi recuperare punti stregoneria durante un riposo breve.",
            descrizione_completa: "Al 20° livello, puoi recuperare 4 punti stregoneria spesi quando finisci un riposo breve. Una volta usato questo privilegio, non puoi usarlo di nuovo finché non completi un riposo lungo."
        }
    },
    
    incantazione: {
        caratteristica_da_incantatore: "Carisma",
        cd_tiro_salvezza: "8 + bonus competenza + modificatore Carisma",
        modificatore_attacco: "bonus competenza + modificatore Carisma",
        focus_incantamento: "Focus arcano",
        rituali: false
    },
    
    sottoclassi: [
        {
            nome: "Lineaggio Drago",
            descrizione: "Il tuo sangue porta il potere di un drago, conferendoti resistenze e abilità draconiche.",
            privilegi: {
                "1": {
                    nome: "Ascendenza Draconica",
                    descrizione: "Scegli un tipo di drago come antenato: Nero (acido), Blu (fulmine), Blu (fulmine), Rosso (fuoco), Bianco (freddo), Oro (fuoco), Argento (freddo), Ottone (fuoco), Bronzo (fulmine), Rame (acido). Parli draconico e hai vantaggio sui tiri di Carisma quando interagisci con draghi."
                },
                "1_b": {
                    nome: "Resistenza Draconica",
                    descrizione: "Hai resistenza al tipo di danno associato al tuo antenato drago. Inoltre, quando lanci un incantesimo che infligge quel tipo di danno, puoi aggiungere il tuo bonus di competenza a un tiro di danno dell'incantesimo."
                },
                "6": {
                    nome: "Presenza Draconica",
                    descrizione: "Puoi usare la tua azione per emanare un'aura di presenza draconica. Per 1 minuto, le creature ostili entro 18 metri hanno svantaggio sui tiri salvezza contro i tuoi incantesimi di fascino o paura. Puoi usare questo privilegio un numero di volte pari al tuo bonus di competenza."
                },
                "14": {
                    nome: "Ali Draconiche",
                    descrizione: "Puoi far spuntare ali di energia draconica dalla tua schiena. Come azione bonus, ottieni velocità di volo di 18 metri per 1 minuto. Puoi usare questo privilegio un numero di volte pari al tuo bonus di competenza."
                }
            }
        },
        {
            nome: "Magia Selvaggia",
            descrizione: "Il tuo potere magico è caotico e imprevedibile, causando effetti selvaggi.",
            privilegi: {
                "1": {
                    nome: "Magia Selvaggia",
                    descrizione: "Quando lanci un incantesimo da stregone di 1° livello o superiore, il DM può chiederti di tirare un d20. Se ottieni 1, subisci un effetto della Tabella del Caos Selvaggio. Puoi anche scegliere di usare la Magia Selvaggia per rirollare un tiro di d20 dopo aver visto il risultato."
                },
                "1_b": {
                    nome: "Marea di Magia",
                    descrizione: "Puoi usare la tua reazione quando lanci un incantesimo da stregone per incanalare la magia selvaggia. Dopo aver lanciato l'incantesimo, puoi usare un'azione bonus per tirare sulla Tabella del Caos Selvaggio."
                },
                "6": {
                    nome: "Fortuna Bendata",
                    descrizione: "Quando tu o una creatura entro 9 metri tiri un d20 per un tiro di attacco, prova di caratteristica o tiro salvezza, puoi usare la tua reazione per spendere 1 punto stregoneria e far tirare due d20, usando il risultato più alto."
                },
                "14": {
                    nome: "Magia Controllata",
                    descrizione: "Quando tiri sulla Tabella del Caos Selvaggio, puoi tirare due volte e scegliere quale risultato usare. Inoltre, puoi spendere 1 punto stregoneria per rirollare sulla tabella."
                }
            }
        }
    ],
    
    // Metamagia Options
    metamagia: {
        "Incantesimo Gemello": {
            costo: "Punti pari al livello dell'incantesimo",
            descrizione: "Quando lanci un incantesimo che ha come bersaglio una sola creatura e non ha portata 'self', puoi spendere punti stregoneria per lanciarne una seconda copia su un altro bersaglio entro portata."
        },
        "Incantesimo Rapido": {
            costo: "2 punti",
            descrizione: "Quando lanci un incantesimo con tempo di lancio di 1 azione, puoi spender 2 punti stregoneria per cambiarlo in 1 azione bonus."
        },
        "Incantesimo Esteso": {
            costo: "1 punto",
            descrizione: "Quando lanci un incantesimo con durata di 1 minuto o più, puoi spender 1 punto stregoneria per raddoppiare la durata (max 24 ore)."
        },
        "Incantesimo Potente": {
            costo: "3 punti",
            descrizione: "Quando lanci un incantesimo che costringe una creatura a effettuare un tiro salvezza, puoi spender 3 punti stregoneria per dare svantaggio al primo tiro salvezza effettuato."
        },
        "Incantesimo Accurato": {
            costo: "2 punti",
            descrizione: "Quando lanci un incantesimo che ti permette di tirare un d20 per colpire una CA, puoi spender 2 punti stregoneria per tirare due d20 e usare il risultato più alto."
        }
    },
    
    // Compatibilità
    name: "Stregone",
    hit_die: 6,
    saving_throws: [
        { name: "Costituzione", index: "con" },
        { name: "Carisma", index: "cha" }
    ]
};
