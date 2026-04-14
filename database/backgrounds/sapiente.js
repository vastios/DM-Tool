/**
 * Database del background Sapiente
 * Estratto da SRD 5.1 Italiano
 */

export const sapiente = {
    index: 'sapiente',
    nome: "Sapiente",
    descrizione: "Hai trascorso anni ad apprendere le nozioni del multiverso. Hai setacciato manoscritti, studiato pergamene e ascoltato i più grandi esperti nelle materie che ti interessano. I tuoi sforzi ti hanno reso un maestro nei tuoi campi di studio.",
    
    competenze: {
        abilita: ["Arcano", "Storia"],
        linguaggi: "Due a tua scelta"
    },
    
    equipaggiamento: [
        { nome: "Boccetta di inchiostro nero", quantita: 1 },
        { nome: "Pennino", quantita: 1 },
        { nome: "Coltellino", quantita: 1 },
        { nome: "Lettera di un collega defunto che pone un quesito", quantita: 1 },
        { nome: "Abito comune", quantita: 1 },
        { nome: "Scarsella con 10 mo", quantita: 1 }
    ],
    
    specializzazione: {
        descrizione: "Per determinare la natura del tuo addestramento accademico, tira un d8 o scegli tra le opzioni nella tabella sottostante.",
        tabella: [
            { d8: 1, specializzazione: "Alchimista" },
            { d8: 2, specializzazione: "Astronomo" },
            { d8: 3, specializzazione: "Accademico screditato" },
            { d8: 4, specializzazione: "Bibliotecario" },
            { d8: 5, specializzazione: "Professore" },
            { d8: 6, specializzazione: "Ricercatore" },
            { d8: 7, specializzazione: "Apprendista mago" },
            { d8: 8, specializzazione: "Scriba" }
        ]
    },
    
    privilegio: {
        nome: "Ricercatore",
        descrizione: "Quando tenti di apprendere o ricordare una nozione, se non conosci quell'informazione, spesso sai dove e da chi puoi ottenerla. Di solito, queste informazioni provengono da una biblioteca, uno scriptorium, un'università o da un sapiente o altra persona o creatura istruita. Il tuo DM potrebbe stabilire che la conoscenza che cerchi sia celata in un luogo quasi inaccessibile, o che semplicemente non possa essere trovata. Portare alla luce i segreti più profondi del multiverso può richiedere un'avventura o persino un'intera campagna."
    },
    
    caratteristiche_suggerite: {
        descrizione: "I sapienti sono definiti dai loro ampi studi e le loro caratteristiche riflettono questa vita di apprendimento. Dedito alle attività accademiche, un sapiente attribuisce grande valore alla conoscenza, a volte fine a se stessa, a volte come mezzo per raggiungere altri ideali.",
        tratti_caratteriali: [
            { d8: 1, tratto: "Uso parole polisillabiche che danno l'impressione di una grande erudizione." },
            { d8: 2, tratto: "Ho letto ogni libro nelle più grandi biblioteche del mondo, o almeno mi piace vantarmi di averlo fatto." },
            { d8: 3, tratto: "Sono abituato ad aiutare coloro che non sono intelligenti quanto me, e spiego pazientemente qualsiasi cosa a chiunque." },
            { d8: 4, tratto: "Non c'è niente che mi piaccia più di un bel mistero." },
            { d8: 5, tratto: "Sono disposto ad ascoltare ogni lato di una discussione prima di emettere il mio giudizio." },
            { d8: 6, tratto: "Io... parlo... lentamente... quando mi rivolgo... agli idioti... cioè... quasi... chiunque... rispetto a me." },
            { d8: 7, tratto: "Sono terribilmente, terribilmente goffo nelle situazioni sociali." },
            { d8: 8, tratto: "Sono convinto che le persone cerchino sempre di rubare i miei segreti." }
        ],
        ideali: [
            { d6: 1, nome: "Conoscenza", descrizione: "La via per il potere e il miglioramento di sé passa attraverso la conoscenza.", allineamento: "Neutrale" },
            { d6: 2, nome: "Bellezza", descrizione: "Ciò che è bello ci indica ciò che è vero al di là di se stesso.", allineamento: "Buono" },
            { d6: 3, nome: "Logica", descrizione: "Le emozioni non devono offuscare il nostro pensiero logico.", allineamento: "Legale" },
            { d6: 4, nome: "Nessun Limite", descrizione: "Nulla deve ostacolare le infinite possibilità insite in tutta l'esistenza.", allineamento: "Caotico" },
            { d6: 5, nome: "Potenza", descrizione: "La conoscenza è la via verso il potere e il dominio.", allineamento: "Malvagio" },
            { d6: 6, nome: "Miglioramento di Sé", descrizione: "L'obiettivo di una vita di studio è il miglioramento di se stessi.", allineamento: "Qualsiasi" }
        ],
        legami: [
            { d6: 1, legame: "È mio dovere proteggere i miei studenti." },
            { d6: 2, legame: "Possiedo un testo antico che racchiude terribili segreti che non devono cadere nelle mani sbagliate." },
            { d6: 3, legame: "Lavoro per preservare una biblioteca, un'università, uno scriptorium o un monastero." },
            { d6: 4, legame: "Il lavoro della mia vita è una serie di tomi relativi a uno specifico campo del sapere." },
            { d6: 5, legame: "Ho cercato per tutta la vita la risposta a una certa domanda." },
            { d6: 6, legame: "Ho venduto la mia anima per la conoscenza. Spero di compiere grandi imprese e riscattarla." }
        ],
        difetti: [
            { d6: 1, difetto: "Mi lascio distrarre facilmente dalla promessa di informazioni." },
            { d6: 2, difetto: "La maggior parte della gente urla e scappa quando vede un demone. Io mi fermo e prendo appunti sulla sua anatomia." },
            { d6: 3, difetto: "Svelare un antico mistero vale il prezzo di una civiltà." },
            { d6: 4, difetto: "Tralascio soluzioni ovvie in favore di quelle complicate." },
            { d6: 5, difetto: "Parlo senza riflettere davvero sulle mie parole, insultando invariabilmente gli altri." },
            { d6: 6, difetto: "Non riesco a mantenere un segreto nemmeno a costo della vita, mia o di chiunque altro." }
        ]
    }
};
