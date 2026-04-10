/**
 * Database del background Criminale / Spia
 * Estratto da SRD 5.1 Italiano
 */

export const criminale = {
    index: 'criminale',
    nome: "Criminale / Spia",
    descrizione: "Sei un criminale esperto con una storia di violazioni della legge alle spalle. Hai trascorso molto tempo tra altri criminali e conservi tuttora dei contatti nel mondo della malavita. Sei molto più vicino di molti altri al mondo dell'omicidio, del furto e della violenza che pervade i bassifondi della civiltà, e sei sopravvissuto fino a questo momento facendoti beffa delle regole e dei regolamenti della società.",
    
    competenze: {
        abilita: ["Furtività", "Inganno"],
        strumenti: ["Un tipo di set da gioco", "Arnesi da scasso"]
    },
    
    equipaggiamento: [
        { nome: "Piede di porco", quantita: 1 },
        { nome: "Abito comune scuro con cappuccio", quantita: 1 },
        { nome: "Scarsella con 15 mo", quantita: 1 }
    ],
    
    specialita_criminale: {
        descrizione: "Esistono molti tipi di criminali e, all'interno di una gilda di ladri o di un'organizzazione criminale simile, i singoli membri hanno specialità particolari. Anche i criminali che operano al di fuori di tali organizzazioni hanno forti preferenze per certi tipi di crimini rispetto ad altri. Scegli il ruolo che hai interpretato nella tua vita criminale o tira sulla tabella sottostante.",
        tabella: [
            { d8: 1, specialita: "Ricattatore" },
            { d8: 2, specialita: "Scassinatore" },
            { d8: 3, specialita: "Braccio destro" },
            { d8: 4, specialita: "Ricettatore" },
            { d8: 5, specialita: "Bandito di strada" },
            { d8: 6, specialita: "Assassino prezzolato" },
            { d8: 7, specialita: "Borseggiatore" },
            { d8: 8, specialita: "Contrabbandiere" }
        ]
    },
    
    privilegio: {
        nome: "Contatto Criminale",
        descrizione: "Disponi di un contatto fidato e affidabile che funge da tuo collegamento con una rete di altri criminali. Sai come inviare e ricevere messaggi dal tuo contatto, anche a grandi distanze; nello specifico, conosci i messaggeri locali, i capicarovana corrotti e i marinai loschi che possono consegnare messaggi per tuo conto."
    },
    
    variante: {
        nome: "Spia",
        descrizione: "Sebbene le tue capacità non siano molto diverse da quelle di uno scassinatore o di un contrabbandiere, le hai apprese e messe in pratica in un contesto molto diverso: come agente di spionaggio. Potresti essere stato un agente ufficialmente autorizzato dalla corona, o forse hai venduto i segreti che hai scoperto al miglior offerente."
    },
    
    caratteristiche_suggerite: {
        descrizione: "In apparenza i criminali potrebbero sembrare dei malvagi, e molti di loro lo sono fino al midollo. Alcuni però possiedono un'abbondanza di caratteristiche amabili, se non addirittura di riscatto. Potrebbe esserci dell'onore tra i ladri, ma i criminali raramente mostrano rispetto per la legge o l'autorità.",
        tratti_caratteriali: [
            { d8: 1, tratto: "Ho sempre un piano pronto per quando le cose vanno storte." },
            { d8: 2, tratto: "Mantengo sempre la calma, a prescindere dalla situazione. Non alzo mai la voce e non lascio mai che le emozioni mi controllino." },
            { d8: 3, tratto: "La prima cosa che faccio in un posto nuovo è annotare la posizione di tutto ciò che ha valore (o dove tali cose potrebbero essere nascoste)." },
            { d8: 4, tratto: "Preferirei farmi un nuovo amico piuttosto che un nuovo nemico." },
            { d8: 5, tratto: "Sono incredibilmente lento nel dare fiducia. Coloro che sembrano più onesti spesso sono quelli che hanno più da nascondere." },
            { d8: 6, tratto: "Non presto attenzione ai rischi di una situazione. Non dirmi mai le probabilità." },
            { d8: 7, tratto: "Il modo migliore per convincermi a fare qualcosa è dirmi che non posso farlo." },
            { d8: 8, tratto: "Esplodo di rabbia al minimo insulto." }
        ],
        ideali: [
            { d6: 1, nome: "Onore", descrizione: "Non rubo ai colleghi del mestiere.", allineamento: "Legale" },
            { d6: 2, nome: "Libertà", descrizione: "Le catene sono fatte per essere spezzate, così come coloro che le forgiano.", allineamento: "Caotico" },
            { d6: 3, nome: "Carità", descrizione: "Rubo ai ricchi per aiutare chi è nel bisogno.", allineamento: "Buono" },
            { d6: 4, nome: "Avidità", descrizione: "Farò tutto il necessario per diventare ricco.", allineamento: "Malvagio" },
            { d6: 5, nome: "Persone", descrizione: "Sono fedele ai miei amici, non agli ideali, e per quanto mi riguarda, tutti gli altri possono farsi un viaggio giù per lo Stige.", allineamento: "Neutrale" },
            { d6: 6, nome: "Redenzione", descrizione: "C'è una scintilla di bene in chiunque.", allineamento: "Buono" }
        ],
        legami: [
            { d6: 1, legame: "Sto cercando di estinguere un vecchio debito che ho nei confronti di un generoso benefattore." },
            { d6: 2, legame: "I miei guadagni illeciti servono a sostenere la mia famiglia." },
            { d6: 3, legame: "Mi è stato portato via qualcosa di importante e intendo rubarlo per riaverlo." },
            { d6: 4, legame: "Diventerò il più grande ladro mai esistito." },
            { d6: 5, legame: "Sono colpevole di un crimine terribile. Spero di potermi riscattare." },
            { d6: 6, legame: "Qualcuno che amavo è morto a causa di un errore che ho commesso. Non accadrà mai più." }
        ],
        difetti: [
            { d6: 1, difetto: "Quando vedo qualcosa di valore, non riesco a pensare ad altro che a come rubarlo." },
            { d6: 2, difetto: "Davanti a una scelta tra il denaro e i miei amici, di solito scelgo il denaro." },
            { d6: 3, difetto: "Se c'è un piano, me lo dimenticherò. Se non lo dimentico, lo ignorerò." },
            { d6: 4, difetto: "Ho un tic che rivela quando sto mentendo." },
            { d6: 5, difetto: "Giro i tacchi e scappo quando le cose si mettono male." },
            { d6: 6, difetto: "Una persona innocente è in prigione per un crimine che ho commesso io. La cosa non mi disturba." }
        ]
    }
};
