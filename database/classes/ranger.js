/**
 * Database della classe Ranger
 * Estratto da dungeonedraghi.it
 */

export const ranger = {
    index: 'ranger',
    classe: "Ranger",
    descrizione_breve: "Un guerriero delle terre selvagge che combina abilità marziali con la magia della natura.",
    dado_vita: "d10",
    caratteristica_primaria: "Destrezza e Saggezza",
    
    competenze: {
        armature: ["Armature leggere", "Armature medie", "Scudi"],
        armi: ["Armi semplici", "Armi da guerra"],
        strumenti: "Nessuno",
        tiri_salvezza: ["Forza", "Destrezza"],
        abilita: "Scegli tre abilità tra: Addestrare Animali, Atletica, Furtività, Intuizione, Natura, Percezione, Sopravvivenza"
    },
    
    punti_ferita: {
        dado_vita: "d10",
        pf_livello_1: "10 + il tuo modificatore di Costituzione",
        pf_livelli_successivi: "1d10 (o 6) + il tuo modificatore di Costituzione per livello oltre il 1°"
    },
    
    equipaggiamento: [
        "(a) armatura di scaglie o (b) armatura di cuoio",
        "(a) due spade corte o (b) due armi semplici da mischia",
        "(a) arco lungo e faretra con 20 frecce o (b) qualsiasi arma semplice",
        "Uno zaino da esploratore",
        "Un bastone da passeggio"
    ],
    
    tabella_progressione: [
        {livello: 1, bonus_competenza: 2, privilegi: ["Nemico Prescelto", "Esploratore Nato"], incantesimi_conosciuti: 0, slot_1: 0, slot_2: 0, slot_3: 0, slot_4: 0},
        {livello: 2, bonus_competenza: 2, privilegi: ["Stile di Combattimento", "Incantesimi"], incantesimi_conosciuti: 2, slot_1: 2, slot_2: 0, slot_3: 0, slot_4: 0},
        {livello: 3, bonus_competenza: 2, privilegi: ["Archetipo del Ranger", "Consapevolezza Primordiale"], incantesimi_conosciuti: 3, slot_1: 3, slot_2: 0, slot_3: 0, slot_4: 0},
        {livello: 4, bonus_competenza: 2, privilegi: ["Aumento dei Punteggi di Caratteristica"], incantesimi_conosciuti: 3, slot_1: 3, slot_2: 0, slot_3: 0, slot_4: 0},
        {livello: 5, bonus_competenza: 3, privilegi: ["Attacco Extra"], incantesimi_conosciuti: 4, slot_1: 4, slot_2: 2, slot_3: 0, slot_4: 0},
        {livello: 6, bonus_competenza: 3, privilegi: ["Nemico Prescelto (miglioramento)", "Terreno Prescelto (miglioramento)"], incantesimi_conosciuti: 4, slot_1: 4, slot_2: 2, slot_3: 0, slot_4: 0},
        {livello: 7, bonus_competenza: 3, privilegi: ["Andatura sul Terreno"], incantesimi_conosciuti: 5, slot_1: 4, slot_2: 3, slot_3: 0, slot_4: 0},
        {livello: 8, bonus_competenza: 3, privilegi: ["Aumento dei Punteggi di Caratteristica"], incantesimi_conosciuti: 5, slot_1: 4, slot_2: 3, slot_3: 0, slot_4: 0},
        {livello: 9, bonus_competenza: 4, privilegi: [], incantesimi_conosciuti: 6, slot_1: 4, slot_2: 3, slot_3: 2, slot_4: 0},
        {livello: 10, bonus_competenza: 4, privilegi: ["Nascondersi in Piena Vista"], incantesimi_conosciuti: 6, slot_1: 4, slot_2: 3, slot_3: 2, slot_4: 0},
        {livello: 11, bonus_competenza: 4, privilegi: ["Attacco Furioso"], incantesimi_conosciuti: 7, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 0},
        {livello: 12, bonus_competenza: 4, privilegi: ["Aumento dei Punteggi di Caratteristica"], incantesimi_conosciuti: 7, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 0},
        {livello: 13, bonus_competenza: 5, privilegi: [], incantesimi_conosciuti: 8, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 1},
        {livello: 14, bonus_competenza: 5, privilegi: ["Sensi Ferini"], incantesimi_conosciuti: 8, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 1},
        {livello: 15, bonus_competenza: 5, privilegi: ["Predatore Silenzioso"], incantesimi_conosciuti: 9, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 1},
        {livello: 16, bonus_competenza: 5, privilegi: ["Aumento dei Punteggi di Caratteristica"], incantesimi_conosciuti: 9, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 1},
        {livello: 17, bonus_competenza: 6, privilegi: [], incantesimi_conosciuti: 10, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 2},
        {livello: 18, bonus_competenza: 6, privilegi: ["Sensi Ferini (miglioramento)"], incantesimi_conosciuti: 10, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 2},
        {livello: 19, bonus_competenza: 6, privilegi: ["Aumento dei Punteggi di Caratteristica"], incantesimi_conosciuti: 11, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 2},
        {livello: 20, bonus_competenza: 6, privilegi: ["Cacciatore Supremo"], incantesimi_conosciuti: 11, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 2}
    ],
    
    descrizione_privilegi: {
        "Nemico Prescelto": {
            riassunto: "Hai vantaggio sui tiri di Sopravvivenza per seguire le tracce e su Intuizione per determinare le intenzioni.",
            descrizione_completa: "Al 1° livello, hai studiato approfonditamente i nemici che più frequentemente incontri. Scegli un tipo di nemico prescelto: bestie, folletti, orchi, ecc. Hai vantaggio sui tiri di Sopravvivenza per seguire le loro tracce e su Intuizione per determinare le loro intenzioni. Inoltre, impari una lingua a tua scelta parlata dal tuo nemico prescelto. Al 6° e 14° livello, puoi scegliere un altro nemico prescelto."
        },
        "Terreno Prescelto": {
            riassunto: "Sei particolarmente familiare con un tipo di ambiente naturale.",
            descrizione_completa: "Al 1° livello, sei particolarmente familiare con un tipo di ambiente naturale e sei esperto nel viaggiare e sopravvivere in questa regione. Scegli un terreno prescelto: foresta, palude, montagna, ecc. Quando effettui una prova di Intelligenza o Saggezza relativa al tuo terreno prescelto, il tuo bonus di competenza viene raddoppiato. Al 6° e 10° livello, puoi scegliere un altro terreno prescelto."
        },
        "Stile di Combattimento": {
            riassunto: "Scegli uno stile di combattimento specializzato.",
            descrizione_completa: "Al 2° livello, adotti uno stile di combattimento specializzato. Scegli una delle seguenti opzioni: Tiro con Arco (bonus +2 ai tiri per colpire con attacchi a distanza), Difesa (bonus +1 alla CA mentre indossi armatura), Duello (bonus +2 ai danni con arma da mischia in una mano), Combattimento con Due Armi (puoi estrarre o riporre due armi nello stesso turno)."
        },
        "Incantesimi": {
            riassunto: "Puoi lanciare incantesimi da ranger attingendo alla magia della natura.",
            descrizione_completa: "Al 2° livello, hai imparato a sfruttare la magia della natura per lanciare incantesimi. La tua caratteristica da incantatore è la Saggezza. Puoi preparare un numero di incantesimi pari al tuo bonus di competenza + il tuo livello di ranger. Devi scegliere gli incantesimi dalla lista degli incantesimi da ranger."
        },
        "Archetipo del Ranger": {
            riassunto: "Scegli un archetipo che modella il tuo stile di ranger.",
            descrizione_completa: "Al 3° livello, scegli un archetipo che tenti di emulare: Cacciatore o Dominatore delle Bestie. Entrambi ti conferiscono privilegi al 3° livello, e poi ancora al 7°, 11° e 15° livello."
        },
        "Consapevolezza Primordiale": {
            riassunto: "Puoi percepire la presenza di certi tipi di creature.",
            descrizione_completa: "Al 3° livello, puoi concentrarti per percepire la presenza di creature specifiche. Come azione, puoi percepire se ci sono bestie, folletti o non morti entro 1,5 km da te. Questa abilità non rivela la posizione o il numero delle creature."
        },
        "Attacco Extra": {
            riassunto: "Puoi attaccare due volte invece di una volta con l'azione Attaccare.",
            descrizione_completa: "A partire dal 5° livello, puoi attaccare due volte, invece che una volta, ogni volta che effettui l'azione Attaccare durante il tuo turno."
        },
        "Andatura sul Terreno": {
            riassunto: "Il terreno difficile non riduce la tua velocità nel tuo terreno prescelto.",
            descrizione_completa: "A partire dal 7° livello, il terreno difficile nel tuo terreno prescelto non riduce la tua velocità. Non puoi usare questo privilegio se stai indossando armature pesanti."
        },
        "Nascondersi in Piena Vista": {
            riassunto: "Puoi tentare di nasconderti anche quando sei solo leggermente coperto.",
            descrizione_completa: "A partire dal 10° livello, puoi spendere 1 minuto per creare una mimetizzazione nel tuo terreno prescelto. Successivamente, puoi tentare di nasconderti quando sei solo leggermente coperto da quel terreno. Il bonus ai tiri di Furtività è di +10."
        },
        "Attacco Furioso": {
            riassunto: "Puoi fare un attacco aggiuntivo quando colpisci con un attacco.",
            descrizione_completa: "A partire dall'11° livello, puoi fare un attacco aggiuntivo con un'arma quando colpisci una creatura con un attacco con arma. Puoi usare questa abilità una volta per turno."
        },
        "Sensi Ferini": {
            riassunto: "I tuoi sensi sono affinati contro i nemici nascosti.",
            descrizione_completa: "A partire dal 14° livello, i tuoi sensi sono così affinati che non hai svantaggio sui tiri per colpire contro creature invisibili o nascoste. Inoltre, non hai svantaggio sui tiri di Percezione passiva."
        },
        "Predatore Silenzioso": {
            riassunto: "Puoi muoverti silenziosamente e rapidamente quando cacci.",
            descrizione_completa: "A partire dal 15° livello, puoi usare Nascondersi in Piena Vista come azione bonus invece che come azione."
        },
        "Cacciatore Supremo": {
            riassunto: "Diventi il predatore supremo.",
            descrizione_completa: "Al 20° livello, diventi un cacciatore impareggiabile. Una volta per turno, quando colpisci una creatura con un attacco con arma, puoi aggiungere il tuo bonus di competenza al tiro di danno. Inoltre, hai vantaggio sui tiri salvezza contro incantesimi e altri effetti magici."
        },
        "Aumento dei Punteggi di Caratteristica": {
            riassunto: "Puoi aumentare i tuoi punteggi di caratteristica.",
            descrizione_completa: "Quando raggiungi il 4° livello, e poi ancora all'8°, 12°, 16° e 19° livello, puoi incrementare un tuo punteggio di caratteristica di 2, o incrementare due punteggi di caratteristica di 1. Di norma, utilizzando questo privilegio non puoi accrescere un punteggio di caratteristica oltre il 20."
        }
    },
    
    incantazione: {
        caratteristica_da_incantatore: "Saggezza",
        cd_tiro_salvezza: "8 + bonus competenza + modificatore Saggezza",
        modificatore_attacco: "bonus competenza + modificatore Saggezza",
        focus_incantamento: "Bastone da druido o simile",
        rituali: false
    },
    
    sottoclassi: [
        {
            nome: "Cacciatore",
            descrizione: "Un ranger che si concentra sulla capacità di trovare e abbattere i nemici.",
            privilegi: {
                "3": {
                    nome: "Preda del Cacciatore",
                    descrizione: "Scegli una delle seguenti opzioni: Caccia al Colosso (una volta per turno, un danno aggiuntivo d8 contro creature di taglia G o superiore), Distruttore di Orde (quando riduci a 0 PF una creatura con un attacco, puoi fare un attacco aggiuntivo), Presa del Cacciatore (vantaggio ai tiri di Percezione passiva)."
                },
                "7": {
                    nome: "Difesa del Cacciatore",
                    descrizione: "Scegli una delle seguenti opzioni: Evasione (vantaggio ai TS di Destrezza e nessun danno se superi, dimezzo se fallisci), Resistenza (vantaggio ai TS contro trappole), Volontà di Ferro (vantaggio ai TS contro essere affascinato o spaventato)."
                },
                "11": {
                    nome: "Attacco di Sciame",
                    descrizione: "Una volta per turno quando effettui un attacco con arma, puoi fare un attacco aggiuntivo con la stessa arma contro una creatura diversa entro 3 metri dal bersaglio originale."
                },
                "15": {
                    nome: "Cacciatore Supremo",
                    descrizione: "Scegli una delle seguenti opzioni: Elusione (quando un attacco ti manca, puoi usare la reazione per muoverti di metà velocità senza provocare attacchi d'opportunità), Opporsi alla Marea (quando una creatura ti manca con un attacco in mischia, puoi usare la reazione per attaccarla), Schivata Prodigiosa (quando subisci danni, puoi usare la reazione per ridurli di 1d10 + modificatore Destrezza)."
                }
            }
        },
        {
            nome: "Dominatore delle Bestie",
            descrizione: "Un ranger che forma un legame profondo con un compagno animale.",
            privilegi: {
                "3": {
                    nome: "Compagno Bestia",
                    descrizione: "Ottieni un compagno bestia che ti accompagna nei tuoi viaggi. Scegli una bestia di taglia Piccola o Media con grado di sfida 1/4 o inferiore. La bestia obbedisce ai tuoi comandi e agisce nel tuo turno. Puoi usare un'azione bonus per comandarla di attaccare, o un'azione per comandarla di Dash, Disengage, Dodge o Help."
                },
                "7": {
                    nome: "Addestramento Eccezionale",
                    descrizione: "La velocità della tua bestia aumenta di 4,5 metri se è Piccola o 3 metri se è Media. Inoltre, quando ti muovi, la tua bestia non provoca attacchi d'opportunità."
                },
                "11": {
                    nome: "Furia Bestiale",
                    descrizione: "Quando la tua bestia colpisce con un attacco, infligge danni aggiuntivi pari al tuo bonus di competenza. Può anche fare un attacco aggiuntivo quando attacca."
                },
                "15": {
                    nome: "Condivisione Incantesimi",
                    descrizione: "Quando lanci un incantesimo su te stesso, puoi anche far sì che abbia effetto sulla tua bestia se questa è entro 9 metri da te."
                }
            }
        }
    ],
    
    // Compatibilità
    name: "Ranger",
    hit_die: 10,
    saving_throws: [
        { name: "Forza", index: "str" },
        { name: "Destrezza", index: "dex" }
    ]
};
