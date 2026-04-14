/**
 * Database del background Soldato
 * Estratto da SRD 5.1 Italiano
 */

export const soldato = {
    index: 'soldato',
    nome: "Soldato",
    descrizione: "La guerra è stata la tua vita per tutto il tempo che riesci a ricordare. Ti sei addestrato da giovane, hai studiato l'uso delle armi e delle armature, hai appreso le tecniche base di sopravvivenza, incluso come restare in vita sul campo di battaglia. Potresti aver fatto parte di un esercito nazionale permanente o di una compagnia di ventura, o forse sei stato un membro di una milizia locale distintosi durante una guerra recente. Quando scegli questo background, collabora con il tuo DM per determinare di quale organizzazione militare facevi parte, quanto hai progredito nei suoi ranghi e che tipo di esperienze hai vissuto durante la tua carriera militare. Era un esercito permanente, una guardia cittadina o una milizia di villaggio? O forse era l'esercito privato di un nobile o di un mercante, o una compagnia mercenaria.",
    
    competenze: {
        abilita: ["Atletica", "Intimidire"],
        strumenti: ["Un tipo di set da gioco", "Veicoli (terrestri)"]
    },
    
    equipaggiamento: [
        { nome: "Insegna del grado", quantita: 1 },
        {
            tipo: "scelta",
            opzioni: [
                { nome: "Pugnale (trofeo nemico)", quantita: 1 },
                { nome: "Lama spezzata (trofeo nemico)", quantita: 1 },
                { nome: "Frammento di stendardo (trofeo nemico)", quantita: 1 }
            ]
        },
        {
            tipo: "scelta",
            opzioni: [
                { nome: "Set di dadi d'osso", quantita: 1 },
                { nome: "Mazzo di carte", quantita: 1 }
            ]
        },
        { nome: "Abito comune", quantita: 1 },
        { nome: "Scarsella con 10 mo", quantita: 1 }
    ],
    
    specializzazione: {
        descrizione: "Durante il tuo periodo come soldato, avevi un ruolo specifico nella tua unità o nel tuo esercito. Tira un d8 o scegli tra le opzioni nella tabella sottostante per determinare il tuo ruolo:",
        tabella: [
            { d8: 1, specializzazione: "Ufficiale" },
            { d8: 2, specializzazione: "Esploratore" },
            { d8: 3, specializzazione: "Fanteria" },
            { d8: 4, specializzazione: "Cavalleria" },
            { d8: 5, specializzazione: "Guaritore" },
            { d8: 6, specializzazione: "Quartiermastro" },
            { d8: 7, specializzazione: "Alfiere" },
            { d8: 8, specializzazione: "Personale di supporto (cuoco, fabbro o simili)" }
        ]
    },
    
    privilegio: {
        nome: "Grado Militare",
        descrizione: "Possiedi un grado militare derivante dalla tua carriera di soldato. I soldati leali alla tua ex organizzazione militare riconoscono ancora la tua autorità e influenza, e ti mostrano deferenza se sono di grado inferiore. Puoi invocare il tuo grado per esercitare influenza su altri soldati e richiedere equipaggiamento semplice o cavalli per un uso temporaneo. Di solito puoi anche ottenere l'accesso ad accampamenti militari amici e fortezze dove il tuo grado viene riconosciuto."
    },
    
    caratteristiche_suggerite: {
        descrizione: "Gli orrori della guerra, uniti alla rigida disciplina del servizio militare, lasciano il segno su tutti i soldati, plasmandone gli ideali, creando forti legami e spesso lasciandoli segnati e vulnerabili alla paura, alla vergogna e all'odio.",
        tratti_caratteriali: [
            { d8: 1, tratto: "Sono sempre educato e rispettoso." },
            { d8: 2, tratto: "Sono tormentato dai ricordi della guerra. Non riesco a togliermi dalla mente le immagini della violenza." },
            { d8: 3, tratto: "Ho perso troppi amici e sono lento a farne di nuovi." },
            { d8: 4, tratto: "Sono pieno di racconti ispiratori e ammonitori tratti dalla mia esperienza militare, pertinenti a quasi ogni situazione di combattimento." },
            { d8: 5, tratto: "Posso fissare negli occhi un segugio infernale senza battere ciglio." },
            { d8: 6, tratto: "Mi piace essere forte e mi piace rompere le cose." },
            { d8: 7, tratto: "Ho un senso dell'umorismo volgare." },
            { d8: 8, tratto: "Affronto i problemi di petto. Una soluzione semplice e diretta è la via migliore per il successo." }
        ],
        ideali: [
            { d6: 1, nome: "Bene Superiore", descrizione: "Il nostro compito è dare la vita in difesa degli altri.", allineamento: "Buono" },
            { d6: 2, nome: "Responsabilità", descrizione: "Faccio ciò che devo e obbedisco a una giusta autorità.", allineamento: "Legale" },
            { d6: 3, nome: "Indipendenza", descrizione: "Quando le persone seguono gli ordini ciecamente, abbracciano una sorta di tirannia.", allineamento: "Caotico" },
            { d6: 4, nome: "Potenza", descrizione: "Nella vita come in guerra, la forza più grande vince.", allineamento: "Malvagio" },
            { d6: 5, nome: "Vivi e Lascia Vivere", descrizione: "Non vale la pena uccidere o andare in guerra per degli ideali.", allineamento: "Neutrale" },
            { d6: 6, nome: "Nazione", descrizione: "La mia città, nazione o popolo sono tutto ciò che conta.", allineamento: "Qualsiasi" }
        ],
        legami: [
            { d6: 1, legame: "Darei ancora la vita per le persone con cui ho servito." },
            { d6: 2, legame: "Qualcuno mi ha salvato la vita sul campo di battaglia. Ancora oggi, non abbandonerei mai un amico." },
            { d6: 3, legame: "Il mio onore è la mia vita." },
            { d6: 4, legame: "Non dimenticherò mai la schiacciante sconfitta subita dalla mia compagnia o i nemici che l'hanno inflitta." },
            { d6: 5, legame: "Coloro che combattono al mio fianco sono le persone per cui vale la pena morire." },
            { d6: 6, legame: "Combatte per coloro che non possono combattere da soli." }
        ],
        difetti: [
            { d6: 1, difetto: "Il mostruoso nemico che abbiamo affrontato in battaglia mi fa ancora tremare dalla paura." },
            { d6: 2, difetto: "Ho poco rispetto per chiunque non sia un guerriero provato." },
            { d6: 3, difetto: "Ho commesso un terribile errore in battaglia che è costato molte vite, e farei di tutto per mantenere segreto quell'errore." },
            { d6: 4, difetto: "Il mio odio verso i nemici è cieco e irragionevole." },
            { d6: 5, difetto: "Obbedisco alla legge, anche se la legge causa miseria." },
            { d6: 6, difetto: "Preferirei mangiarmi l'armatura piuttosto che ammettere di avere torto." }
        ]
    }
};
