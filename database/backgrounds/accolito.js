/**
 * Database del background Accolito
 * Estratto da SRD 5.1 Italiano
 */

export const accolito = {
    index: 'accolito',
    nome: "Accolito",
    descrizione: "Hai trascorso la tua vita al servizio di un tempio dedicato a una divinità specifica o a un intero pantheon. Operi come intermediario tra il regno del sacro e il mondo dei mortali, celebrando riti sacri e offrendo sacrifici per condurre i fedeli al cospetto del divino. Non sei necessariamente un chierico: celebrare riti sacri non equivale a incanalare il potere divino. Scegli una divinità, un pantheon o un'altra entità quasi-divina e collabora con il tuo DM per dettagliare la natura del tuo servizio religioso. La sezione 'Le Divinità del Multiverso' contiene un esempio di pantheon tratto dall'ambientazione di Forgotten Realms. Eri un funzionario minore in un tempio, cresciuto fin dall'infanzia per assistere i sacerdoti nei riti sacri? O eri un alto sacerdote che ha improvvisamente avvertito la chiamata a servire il proprio dio in modo diverso? Forse eri a capo di un piccolo culto al di fuori di qualsiasi struttura templare stabilita, o persino di un gruppo occulto al servizio di un padrone immondo che ora rinneghi.",
    
    competenze: {
        abilita: ["Intuizione", "Religione"],
        linguaggi: "Due a tua scelta"
    },
    
    equipaggiamento: [
        "Un simbolo sacro (un dono ricevuto all'ingresso nel sacerdozio)",
        "Un libro di preghiere o una ruota delle preghiere",
        "5 bastoncini di incenso",
        "Paramenti sacri",
        "Un abito comune",
        "Una scarsella contenente 15 mo"
    ],
    
    privilegio: {
        nome: "Rifugio dei Fedeli",
        descrizione: "In quanto accolito, godi del rispetto di coloro che condividono la tua fede e puoi celebrare le cerimonie religiose della tua divinità. Tu e i tuoi compagni d'avventura potete aspettarvi di ricevere cure e assistenza gratuite presso un tempio, un santuario o un'altra presenza stabilita della tua fede, sebbene tu debba fornire qualsiasi componente materiale necessaria per gli incantesimi. Coloro che condividono la tua religione sosterranno te (e solo te) con uno stile di vita modesto. Potresti anche avere legami con uno specifico tempio dedicato alla tua divinità o al tuo pantheon, presso il quale possiedi una residenza. Potrebbe trattarsi del tempio in cui prestavi servizio, se sei rimasto in buoni rapporti, o di un tempio in cui hai trovato una nuova casa. Mentre ti trovi vicino al tuo tempio, puoi richiedere l'assistenza dei sacerdoti, a patto che l'aiuto richiesto non sia pericoloso e che tu rimanga in buoni rapporti con il tempio stesso."
    },
    
    caratteristiche_suggerite: {
        descrizione: "Gli accoliti sono plasmati dalle loro esperienze nei templi o in altre comunità religiose. Lo studio della storia e dei dogmi della loro fede e i loro rapporti con templi, santuari o gerarchie influenzano i loro modi di fare e i loro ideali. I loro difetti potrebbero risiedere in qualche ipocrisia nascosta o idea eretica, oppure in un ideale o un legame spinto all'estremo.",
        tratti_caratteriali: [
            { d8: 1, tratto: "Idolatro un particolare eroe della mia fede e faccio costantemente riferimento alle sue gesta e al suo esempio." },
            { d8: 2, tratto: "Riesco a trovare un terreno comune anche tra i nemici più feroci, entrando in empatia con loro e lavorando sempre per la pace." },
            { d8: 3, tratto: "Vedo presagi in ogni evento e azione. Gli dei cercano di parlarci, dobbiamo solo ascoltare." },
            { d8: 4, tratto: "Nulla può scuotere il mio atteggiamento ottimista." },
            { d8: 5, tratto: "Cito (o cito a sproposito) testi sacri e proverbi in quasi ogni situazione." },
            { d8: 6, tratto: "Sono tollerante (o intollerante) verso le altre fedi e rispetto (o condanno) l'adorazione di altri dei." },
            { d8: 7, tratto: "Ho goduto di cibo raffinato, bevande e dell'alta società tra l'élite del mio tempio. La vita di stenti mi irrita." },
            { d8: 8, tratto: "Ho trascorso così tanto tempo nel tempio che ho poca esperienza pratica nel trattare con le persone nel mondo esterno." }
        ],
        ideali: [
            { d6: 1, nome: "Tradizione", descrizione: "Le antiche tradizioni di culto e sacrificio devono essere preservate e sostenute.", allineamento: "Legale" },
            { d6: 2, nome: "Carità", descrizione: "Cerco sempre di aiutare chi è nel bisogno, a prescindere dal costo personale.", allineamento: "Buono" },
            { d6: 3, nome: "Cambiamento", descrizione: "Dobbiamo aiutare a realizzare i cambiamenti che gli dei operano costantemente nel mondo.", allineamento: "Caotico" },
            { d6: 4, nome: "Potenza", descrizione: "Spero di scalare un giorno i vertici della gerarchia religiosa della mia fede.", allineamento: "Legale" },
            { d6: 5, nome: "Fede", descrizione: "Confido che la mia divinità guiderà le mie azioni. Ho fede che se lavorerò sodo, le cose andranno bene.", allineamento: "Legale" },
            { d6: 6, nome: "Aspirazione", descrizione: "Cerco di dimostrarmi degno del favore del mio dio agendo in conformità con i suoi insegnamenti.", allineamento: "Qualsiasi" }
        ],
        legami: [
            { d6: 1, legame: "Morirei pur di recuperare un'antica reliquia della mia fede andata perduta molto tempo fa." },
            { d6: 2, legame: "Un giorno otterrò vendetta sulla gerarchia corrotta del tempio che mi ha marchiato come eretico." },
            { d6: 3, legame: "Devo la vita al sacerdote che mi accolse quando i miei genitori morirono." },
            { d6: 4, legame: "Tutto ciò che faccio è per la gente comune." },
            { d6: 5, legame: "Farò di tutto per proteggere il tempio in cui ho servito." },
            { d6: 6, legame: "Cerco di preservare un testo sacro che i miei nemici considerano eretico e cercano di distruggere." }
        ],
        difetti: [
            { d6: 1, difetto: "Giudico gli altri duramente, e me stesso ancora di più." },
            { d6: 2, difetto: "Ripongo troppa fiducia in coloro che detengono il potere all'interno della gerarchia del mio tempio." },
            { d6: 3, difetto: "La mia pietà a volte mi porta a fidarmi ciecamente di chiunque professi fede nel mio dio." },
            { d6: 4, difetto: "Sono inflessibile nel mio modo di pensare." },
            { d6: 5, difetto: "Diffido degli estranei e mi aspetto il peggio da loro." },
            { d6: 6, difetto: "Una volta scelto un obiettivo, ne divento ossessionato a scapito di tutto il resto nella mia vita." }
        ]
    }
};
