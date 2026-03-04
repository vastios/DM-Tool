/**
 * Database della classe Barbaro
 * D&D 5e (SRD 5.1 in Italiano)
 * Estratto da: https://dungeonedraghi.it/compendio/classi/barbaro/
 */

export const barbarian = {
    index: "barbarian",
    classe: "Barbaro",
    descrizione_breve: "In battaglia, combatti animato da ferocia primordiale. Durante il tuo turno, puoi entrare in ira con un'azione bonus.",
    dado_vita: "d12",
    caratteristica_primaria: "Forza",

    competenze: {
        armature: [
            "Armature leggere",
            "Armature medie",
            "Scudi"
        ],
        armi: [
            "Armi semplici",
            "Armi da guerra"
        ],
        strumenti: "Nessuno",
        tiri_salvezza: [
            "Forza",
            "Costituzione"
        ],
        abilita: "Scegli due abilità tra: Addestrare Animali, Atletica, Intimidire, Natura, Percezione, Sopravvivenza"
    },

    punti_ferita: {
        dado_vita: "d12",
        pf_livello_1: "12 + il tuo modificatore di Costituzione",
        pf_livelli_successivi: "1d12 (o 7) + il tuo modificatore di Costituzione per livello oltre il 1°"
    },

    equipaggiamento: [
        "(a) un'ascia bipenne o (b) qualsiasi arma da guerra da mischia",
        "(a) due asce o (b) qualsiasi arma semplice",
        "(a) uno zaino da esploratore o (b) uno zaino da speleologo",
        "Quattro giavellotti"
    ],

    tabella_progressione: [
        { livello: 1, bonus_competenza: 2, privilegi: ["Difesa Senza Armatura", "Ira"], ire: 2, danno_ira: 2 },
        { livello: 2, bonus_competenza: 2, privilegi: ["Attacco Irruento", "Percezione del Pericolo"], ire: 2, danno_ira: 2 },
        { livello: 3, bonus_competenza: 2, privilegi: ["Cammino Primordiale"], ire: 3, danno_ira: 2 },
        { livello: 4, bonus_competenza: 2, privilegi: ["Aumento dei Punteggi di Caratteristica"], ire: 3, danno_ira: 2 },
        { livello: 5, bonus_competenza: 3, privilegi: ["Attacco Extra", "Movimento Veloce"], ire: 3, danno_ira: 2 },
        { livello: 6, bonus_competenza: 3, privilegi: ["Privilegio del Cammino"], ire: 4, danno_ira: 2 },
        { livello: 7, bonus_competenza: 3, privilegi: ["Istinto Ferino"], ire: 4, danno_ira: 2 },
        { livello: 8, bonus_competenza: 3, privilegi: ["Aumento dei Punteggi di Caratteristica"], ire: 4, danno_ira: 2 },
        { livello: 9, bonus_competenza: 4, privilegi: ["Critico Brutale (1 dado)"], ire: 4, danno_ira: 3 },
        { livello: 10, bonus_competenza: 4, privilegi: ["Privilegio del Cammino"], ire: 4, danno_ira: 3 },
        { livello: 11, bonus_competenza: 4, privilegi: ["Ira Implacabile"], ire: 4, danno_ira: 3 },
        { livello: 12, bonus_competenza: 4, privilegi: ["Aumento dei Punteggi di Caratteristica"], ire: 5, danno_ira: 3 },
        { livello: 13, bonus_competenza: 5, privilegi: ["Critico Brutale (2 dadi)"], ire: 5, danno_ira: 3 },
        { livello: 14, bonus_competenza: 5, privilegi: ["Privilegio del Cammino"], ire: 5, danno_ira: 3 },
        { livello: 15, bonus_competenza: 5, privilegi: ["Ira Persistente"], ire: 5, danno_ira: 3 },
        { livello: 16, bonus_competenza: 5, privilegi: ["Aumento dei Punteggi di Caratteristica"], ire: 5, danno_ira: 4 },
        { livello: 17, bonus_competenza: 6, privilegi: ["Critico Brutale (3 dadi)"], ire: 6, danno_ira: 4 },
        { livello: 18, bonus_competenza: 6, privilegi: ["Potenza Indomabile"], ire: 6, danno_ira: 4 },
        { livello: 19, bonus_competenza: 6, privilegi: ["Aumento dei Punteggi di Caratteristica"], ire: 6, danno_ira: 4 },
        { livello: 20, bonus_competenza: 6, privilegi: ["Campione Primordiale"], ire: "Illimitata", danno_ira: 4 }
    ],

    descrizione_privilegi: {
        "Ira": {
            riassunto: "Entri in uno stato di furia primordiale ottenendo bonus al danno e resistenza ai danni.",
            descrizione_completa: "In battaglia, combatti animato da ferocia primordiale. Durante il tuo turno, puoi entrare in ira con un'azione bonus. Mentre sei in ira, se non stai indossando armature pesanti, ottieni i seguenti benefici: hai vantaggio sulle prove di Forza e sui tiri salvezza su Forza; quando effettui un attacco con arma da mischia usando la Forza, ottieni un bonus al tiro di danno che aumenta con l'aumentare del tuo livello da barbaro; hai resistenza ai danni contundenti, perforanti e taglienti. Se sei capace di lanciare incantesimi, mentre sei in ira non puoi lanciarli né concentrarti su di essi. La tua ira dura 1 minuto. Termina prima se cadi privo di sensi o se il tuo turno termina e non hai attaccato alcuna creatura ostile né hai preso danni dal tuo ultimo turno. Puoi anche decidere di terminare l'ira durante il tuo turno, impiegando un'azione bonus. Il numero di volte che puoi entrare in ira è indicato nella tabella."
        },
        "Difesa Senza Armatura": {
            riassunto: "La tua CA è 10 + DES + COS quando non indossi armatura.",
            descrizione_completa: "Mentre non indossi nessuna armatura, la tua Classe Armatura è pari a 10 + il tuo modificatore di Destrezza + il tuo modificatore di Costituzione. Puoi comunque usare lo scudo e trarre il beneficio di questo privilegio."
        },
        "Attacco Irruento": {
            riassunto: "Puoi attaccare con vantaggio ma i nemici hanno vantaggio contro di te.",
            descrizione_completa: "Puoi gettare al vento ogni premura di difenderti, per attaccare spinto da una ferocia inaudita. Quando effettui il tuo primo attacco nel tuo turno, puoi decidere se effettuarlo incautamente. Farlo ti dà vantaggio sui tiri per colpire con arma da mischia che usano la Forza durante questo turno, ma i tiri per colpire contro di te hanno vantaggio fino al tuo prossimo turno."
        },
        "Percezione del Pericolo": {
            riassunto: "Hai vantaggio sui tiri salvezza di Destrezza contro effetti visibili.",
            descrizione_completa: "Guadagni uno straordinario senso che ti permettere di percepire quando c'è qualcosa che non va intorno a te, dandoti un aiuto quando ti allontani dal pericolo. Hai vantaggio sui tiri salvezza di Destrezza contro effetti che puoi vedere, come trappole e incantesimi. Per ottenere questo beneficio, non devi essere accecato, assordato né inabile."
        },
        "Cammino Primordiale": {
            riassunto: "Scegli un cammino che modella la natura della tua ira.",
            descrizione_completa: "Scegli un cammino che modella la natura della tua ira. Scegli il Cammino del Berserker o un altro cammino disponibile. Il cammino ti conferisce privilegi al 3° livello, e poi ancora al 6°, 10° e 14° livello."
        },
        "Attacco Extra": {
            riassunto: "Puoi attaccare due volte con l'azione Attaccare.",
            descrizione_completa: "Puoi attaccare due volte, invece che una volta, ogni volta che effettui l'azione Attaccare durante il tuo turno."
        },
        "Movimento Veloce": {
            riassunto: "La tua velocità aumenta di 3 metri senza armature pesanti.",
            descrizione_completa: "La tua velocità aumenta di 3 metri quando non stai indossando armature pesanti."
        },
        "Istinto Ferino": {
            riassunto: "Vantaggio sui tiri di iniziativa e puoi agire quando sorpreso.",
            descrizione_completa: "I tuoi istinti sono così affinati che hai vantaggio sui tiri di iniziativa. Inoltre, se sei sorpreso all'inizio del combattimento e non sei inabile, puoi agire normalmente durante il tuo primo turno, ma solo se entri in ira prima di fare qualsiasi altra cosa in quel turno."
        },
        "Critico Brutale": {
            riassunto: "Tiri dadi danni aggiuntivi sui colpi critici.",
            descrizione_completa: "Puoi tirare un dado di danno aggiuntivo per l'arma quando determini il danno aggiuntivo di un colpo critico con un attacco da mischia. Critico Brutale dà un solo dado di danno aggiuntivo, anche se l'arma ha un danno base di due o più dadi. Questo beneficio aumenta a due dadi aggiuntivi al 13° livello e tre dadi aggiuntivi al 17° livello."
        },
        "Ira Implacabile": {
            riassunto: "Puoi sopravvivere a colpi che ti porterebbero a 0 PF.",
            descrizione_completa: "La tua ira può farti continuare a combattere nonostante le ferite più gravi. Se scendi a 0 punti ferita mentre sei in ira, e non muori sul colpo, puoi effettuare un tiro salvezza di Costituzione con CD 10. Se lo superi, scendi invece a 1 punto ferita. Ogni volta che usi questo privilegio dopo la prima volta, la CD aumenta di 5. Al termine di un riposo breve o lungo, la CD riparte da 10."
        },
        "Ira Persistente": {
            riassunto: "La tua irra non termina finché non svieni o la termini volontariamente.",
            descrizione_completa: "La tua ira è così feroce che termina prima solo se cadi privo di sensi o decidi di terminarla in anticipo."
        },
        "Potenza Indomabile": {
            riassunto: "Il risultato minimo di una prova di Forza è il tuo punteggio di Forza.",
            descrizione_completa: "Se il totale di una tua prova di Forza è inferiore del tuo punteggio di Forza, puoi usare il tuo punteggio di Forza al posto del risultato della prova."
        },
        "Campione Primordiale": {
            riassunto: "FOR e COS aumentano di 4, massimo 24. Ira illimitata.",
            descrizione_completa: "Incorpori il potere delle terre selvagge. I tuoi punteggi di Forza e Costituzione aumentano di 4. Il tuo massimo per questi punteggi diventa 24. Inoltre, la tua irra è illimitata."
        },
        "Aumento dei Punteggi di Caratteristica": {
            riassunto: "Puoi aumentare i tuoi punteggi di caratteristica.",
            descrizione_completa: "Quando raggiungi il 4° livello, e poi ancora all'8°, 12°, 16° e 19° livello, puoi incrementare un tuo punteggio di caratteristica di 2, o incrementare due punteggi di caratteristica di 1. Di norma, utilizzando questo privilegio non puoi accrescere un punteggio di caratteristica oltre il 20."
        },
        "Privilegio del Cammino": {
            riassunto: "Ottieni un privilegio dal tuo Cammino Primordiale.",
            descrizione_completa: "Ottieni un privilegio speciale dal Cammino Primordiale che hai scelto al 3° livello. Consulta la sezione Sottoclassi per i dettagli."
        }
    },

    incantazione: {
        caratteristica_da_incantatore: "Nessuna",
        cd_tiro_salvezza: "N/A",
        modificatore_attacco: "N/A"
    },

    sottoclassi: [
        {
            nome: "Cammino del Berserker",
            descrizione: "Per alcuni barbari, l'ira è un mezzo verso un fine: e quel fine è la violenza. Il Cammino del Berserker è un percorso di furia scatenata, intrisa di sangue. Mentre sei preda dell'ira del berserker, godi del caos della battaglia, incurante della tua salute o benessere.",
            privilegi: {
                "3": {
                    nome: "Frenesia",
                    descrizione: "Quando vai in ira puoi entrare in frenesia. Se lo fai, per la durata della tua ira puoi effettuare un singolo attacco con arma da mischia come azione bonus durante ciascun tuo turno oltre quello iniziale. Quando l'ira termina, subisci un livello di sfinimento."
                },
                "6": {
                    nome: "Ira Incontenibile",
                    descrizione: "Non puoi essere affascinato o spaventato mentre sei in ira. Se sei già affascinato o spaventato mentre entri in ira, l'effetto è sospeso per la durata dell'ira."
                },
                "10": {
                    nome: "Presenza Intimidatoria",
                    descrizione: "Puoi usare la tua azione per spaventare qualcuno con la tua presenza minacciosa. Quando lo fai, scegli una creatura che puoi vedere entro 9 metri da te. Se la creatura può vederti o udirti, deve superare un tiro salvezza su Saggezza (CD 8 + il tuo bonus di competenza + il tuo modificatore di Carisma) o restare spaventata fino al termine del tuo prossimo turno. Nei turni successivi, puoi usare la tua azione per estendere la durata dell'effetto sulla creatura spaventata fino al termine del tuo prossimo turno."
                },
                "14": {
                    nome: "Ritorsione",
                    descrizione: "Quando subisci danno da una creatura che si trova entro 1,5 metri da te, puoi usare la tua reazione per effettuare un attacco con arma da mischia contro quella creatura."
                }
            }
        }
    ],

    // Compatibilità
    name: "Barbaro",
    hit_die: 12,
    saving_throws: [
        { name: "Forza", index: "str" },
        { name: "Costituzione", index: "con" }
    ]
};

export default barbarian;
