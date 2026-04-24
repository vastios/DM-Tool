/**
 * Database del background Nobile
 * Estratto da SRD 5.1 Italiano
 */

export const nobile = {
    index: 'nobile',
    nome: "Nobile",
    descrizione: "Comprendi il significato di ricchezza, potere e privilegio. Porti un titolo nobiliare e la tua famiglia possiede terre, riscuote tasse ed esercita una significativa influenza politica. Potresti essere un aristocratico viziato estraneo al lavoro o al disagio, un ex mercante appena elevato alla nobiltà o un ribaldo diseredato con un senso di superiorità sproporzionato. Oppure potresti essere un proprietario terriero onesto e laborioso che si prende cura profondamente delle persone che vivono e lavorano sulle sue terre, pienamente consapevole della propria responsabilità nei loro confronti. Collabora con il tuo DM per stabilire un titolo appropriato e determinare quanta autorità esso comporti. Un titolo nobiliare non è fine a se stesso: è legato a un'intera famiglia e, qualunque titolo tu possieda, lo trasmetterai ai tuoi figli. Non devi solo determinare il tuo titolo nobiliare, ma dovresti anche collaborare con il DM per descrivere la tua famiglia e l'influenza che ha avuto su di te. La tua famiglia è antica e consolidata, o il tuo titolo è stato concesso di recente? Quanta influenza esercita e su quale area? Che tipo di reputazione ha la tua famiglia tra gli altri aristocratici della regione? Come la considera il popolino? Qual è la tua posizione nella famiglia? Sei l'erede del capofamiglia? Hai già ereditato il titolo? Cosa ne pensi di questa responsabilità? O sei così lontano nella linea di successione che a nessuno importa cosa fai, purché tu non metta in imbarazzo la famiglia? Cosa pensa il capofamiglia della tua carriera di avventuriero? Sei nelle grazie della tua famiglia o sei evitato dal resto dei tuoi parenti? La tua famiglia ha uno stemma? Un'insegna che potresti indossare su un anello sigillo? Colori particolari che indossi sempre? Un animale che consideri simbolo della tua stirpe o addirittura un membro spirituale della famiglia? Questi dettagli aiutano a stabilire la tua famiglia e il tuo titolo come elementi del mondo della campagna.",
    
    competenze: {
        abilita: ["Persuasione", "Storia"],
        strumenti: ["Un tipo di set da gioco"],
        linguaggi: "Uno a tua scelta"
    },
    
    equipaggiamento: [
        { nome: "Abito pregiato", quantita: 1 },
        { nome: "Anello sigillo", quantita: 1 },
        { nome: "Certificato di nobiltà", quantita: 1 },
        { nome: "Scarsella con 25 mo", quantita: 1 }
    ],
    
    privilegio: {
        nome: "Posizione Privilegiata",
        descrizione: "Grazie alla tua nobile nascita, la gente è incline a pensare il meglio di te. Sei il benvenuto nell'alta società e le persone presumono che tu abbia il diritto di essere ovunque ti trovi. Il popolino fa ogni sforzo per venirti incontro ed evitare il tuo scontento, e le altre persone di nobile estrazione ti trattano come un membro della loro stessa cerchia sociale. Se ne hai bisogno, puoi ottenere un'udienza presso un nobile locale."
    },
    
    variante_cavaliere: {
        nome: "Cavaliere",
        descrizione: "Il cavalierato è tra i titoli nobiliari più bassi nella maggior parte delle società, ma può essere una via per uno status superiore. Se desideri essere un cavaliere, scegli il privilegio Seguaci invece del privilegio Posizione Privilegiata. Uno dei tuoi seguaci popolani è sostituito da un nobile che funge da tuo scudiero, assistendoti in cambio di addestramento nel suo percorso verso il cavalierato. I tuoi due seguaci rimanenti potrebbero includere un palafreniere per prendersi cura del tuo cavallo e un servitore che lucida la tua armatura (e ti aiuta persino a indossarla). Come emblema della cavalleria e degli ideali dell'amor cortese, potresti includere tra il tuo equipaggiamento uno stendardo o un altro pegno di un nobile signore o di una dama a cui hai donato il tuo cuore — in una sorta di casta devozione (questa persona potrebbe essere il tuo legame)."
    },
    
    privilegio_variante: {
        nome: "Seguaci",
        descrizione: "Se il tuo personaggio ha un background da nobile, puoi selezionare questo privilegio invece di Posizione Privilegiata. Hai al tuo servizio tre seguaci fedeli alla tua famiglia. Questi seguaci possono essere assistenti o messaggeri, e uno potrebbe essere un maggiordomo. I tuoi seguaci sono popolani che possono svolgere compiti mondani per te, ma non combattono per te, non ti seguiranno in aree palesemente pericolose (come i dungeon) e se ne andranno se sono spesso messi in pericolo o maltrattati."
    },
    
    caratteristiche_suggerite: {
        descrizione: "I nobili nascono e crescono con uno stile di vita molto diverso da quello della maggior parte delle persone, e le loro personalità riflettono tale educazione. Un titolo nobiliare porta con sé una pletora di legami: responsabilità verso la famiglia, verso gli altri nobili (incluso il sovrano), verso le persone affidate alle cure della famiglia o persino verso il titolo stesso. Ma questa responsabilità è spesso un ottimo modo per ostacolare un nobile.",
        tratti_caratteriali: [
            { d8: 1, tratto: "Le mie lusinghe eloquenti fanno sentire chiunque io parli come la persona più meravigliosa e importante del mondo." },
            { d8: 2, tratto: "Il popolino mi ama per la mia gentilezza e generosità." },
            { d8: 3, tratto: "Nessuno potrebbe dubitare, guardando il mio portamento regale, che io sia un gradino sopra le masse incolte." },
            { d8: 4, tratto: "Faccio di tutto per apparire sempre al meglio e seguire le ultime mode." },
            { d8: 5, tratto: "Non mi piace sporcarmi le mani e non mi farò mai trovare in alloggi inadeguati." },
            { d8: 6, tratto: "Nonostante la mia nobile nascita, non mi pongo al di sopra degli altri. Abbiamo tutti lo stesso sangue." },
            { d8: 7, tratto: "Il mio favore, una volta perso, è perso per sempre." },
            { d8: 8, tratto: "Se mi fai un torto, ti schiaccerò, rovinerò il tuo nome e salerò i tuoi campi." }
        ],
        ideali: [
            { d6: 1, nome: "Rispetto", descrizione: "Il rispetto mi è dovuto a causa della mia posizione, ma tutte le persone, a prescindere dal rango, meritano di essere trattate con dignità.", allineamento: "Buono" },
            { d6: 2, nome: "Responsabilità", descrizione: "È mio dovere rispettare l'autorità di chi sta sopra di me, proprio come chi sta sotto di me deve rispettare la mia.", allineamento: "Legale" },
            { d6: 3, nome: "Indipendenza", descrizione: "Devo dimostrare di sapercela fare da solo senza le eccessive premure della mia famiglia.", allineamento: "Caotico" },
            { d6: 4, nome: "Potenza", descrizione: "Se riuscirò a ottenere più potere, nessuno mi dirà cosa devo fare.", allineamento: "Malvagio" },
            { d6: 5, nome: "Famiglia", descrizione: "Il sangue è più denso dell'acqua.", allineamento: "Qualsiasi" },
            { d6: 6, nome: "Obbligo Nobiliare", descrizione: "È mio dovere proteggere e prendermi cura delle persone che sono sotto di me.", allineamento: "Buono" }
        ],
        legami: [
            { d6: 1, legame: "Affronterò qualsiasi sfida per ottenere l'approvazione della mia famiglia." },
            { d6: 2, legame: "L'alleanza del mio casato con un'altra famiglia nobile deve essere mantenuta a tutti i costi." },
            { d6: 3, legame: "Nulla è più importante degli altri membri della mia famiglia." },
            { d6: 4, legame: "Sono innamorato dell'erede di una famiglia che la mia disprezza." },
            { d6: 5, legame: "La mia lealtà verso il mio sovrano è incrollabile." },
            { d6: 6, legame: "Il popolino deve vedermi come un eroe del popolo." }
        ],
        difetti: [
            { d6: 1, difetto: "Segretamente credo che tutti siano inferiori a me." },
            { d6: 2, difetto: "Nascondo un segreto davvero scandaloso che potrebbe rovinare la mia famiglia per sempre." },
            { d6: 3, difetto: "Troppo spesso colgo insulti e minacce velate in ogni parola che mi viene rivolta, e mi adiro facilmente." },
            { d6: 4, difetto: "Ho un desiderio insaziabile di piaceri decadenti." },
            { d6: 5, difetto: "In effetti, il mondo ruota intorno a me." },
            { d6: 6, difetto: "Con le mie parole e le mie azioni, porto spesso vergogna alla mia famiglia." }
        ]
    }
};
