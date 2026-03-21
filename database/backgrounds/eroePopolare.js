/**
 * Database del background Eroe Popolare
 * Estratto da SRD 5.1 Italiano
 */

export const eroePopolare = {
    index: 'eroe-popolare',
    nome: "Eroe Popolare",
    descrizione: "Provieni da un umile ceto sociale, ma il tuo destino ti riserva molto di più. La gente del tuo villaggio natale ti considera già il loro campione e il tuo destino ti chiama a opporti ai tiranni e ai mostri che minacciano il popolino ovunque.",
    
    competenze: {
        abilita: ["Addestrare Animali", "Sopravvivenza"],
        strumenti: ["Un tipo di strumenti da artigiano", "Veicoli (terrestri)"]
    },
    
    equipaggiamento: [
        "Un set di strumenti da artigiano (uno a tua scelta)",
        "Una vanga",
        "Un calderone di ferro",
        "Un abito comune",
        "Una scarsella contenente 10 mo"
    ],
    
    evento_cruciale: {
        descrizione: "In precedenza esercitavi una professione semplice tra i contadini, forse come agricoltore, minatore, servo, pastore, taglialegna o becchino. Ma accadde qualcosa che ti spinse su una strada diversa e ti segnò per grandi imprese. Scegli o determina casualmente un evento cruciale che ti ha consacrato come eroe del popolo.",
        tabella: [
            { d10: 1, evento: "Mi sono opposto agli agenti di un tiranno." },
            { d10: 2, evento: "Ho salvato delle persone durante un disastro naturale." },
            { d10: 3, evento: "Ho affrontato da solo un terribile mostro." },
            { d10: 4, evento: "Ho rubato a un mercante corrotto per aiutare i poveri." },
            { d10: 5, evento: "Ho guidato una milizia per respingere un esercito invasore." },
            { d10: 6, evento: "Mi sono intrufolato nel castello di un tiranno e ho rubato delle armi per armare il popolo." },
            { d10: 7, evento: "Ho addestrato i contadini a usare gli attrezzi agricoli come armi contro i soldati di un tiranno." },
            { d10: 8, evento: "Un signore ha revocato un editto impopolare dopo che ho guidato un atto di protesta simbolico contro di esso." },
            { d10: 9, evento: "Un celestiale, un folletto o una creatura simile mi ha concesso una benedizione o ha rivelato la mia origine segreta." },
            { d10: 10, evento: "Reclutato nell'esercito di un signore, ho scalato i vertici del comando e sono stato lodato per il mio eroismo." }
        ]
    },
    
    privilegio: {
        nome: "Ospitalità Rustica",
        descrizione: "Poiché provieni dai ranghi del popolino, ti mescoli a loro con facilità. Puoi trovare un posto dove nasconderti, riposare o riprenderti tra gli altri popolani, a meno che tu non ti sia dimostrato un pericolo per loro. Ti proteggeranno dalla legge o da chiunque altro ti stia cercando, sebbene non arriveranno a rischiare la vita per te."
    },
    
    caratteristiche_suggerite: {
        descrizione: "Un eroe popolare è uno della gente comune, nel bene e nel male. La maggior parte degli eroi popolari considera le proprie umili origini come una virtù, non come un difetto, e le loro comunità d'origine rimangono molto importanti per loro.",
        tratti_caratteriali: [
            { d8: 1, tratto: "Giudico le persone dalle loro azioni, non dalle loro parole." },
            { d8: 2, tratto: "Se qualcuno è in difficoltà, sono sempre pronto a dare una mano." },
            { d8: 3, tratto: "Quando mi metto in testa qualcosa, la porto a termine a prescindere da cosa mi ostacoli." },
            { d8: 4, tratto: "Ho un forte senso del gioco pulito e cerco sempre di trovare la soluzione più equa ai litigi." },
            { d8: 5, tratto: "Ho fiducia nelle mie capacità e faccio il possibile per infondere fiducia negli altri." },
            { d8: 6, tratto: "Pensare è un compito per gli altri. Io preferisco l'azione." },
            { d8: 7, tratto: "Uso parole lunghe in modo errato nel tentativo di sembrare più intelligente." },
            { d8: 8, tratto: "Mi annoio facilmente. Quando potrò finalmente compiere il mio destino?" }
        ],
        ideali: [
            { d6: 1, nome: "Rispetto", descrizione: "Le persone meritano di essere trattate con dignità e rispetto.", allineamento: "Buono" },
            { d6: 2, nome: "Equità", descrizione: "Nessuno dovrebbe ricevere un trattamento preferenziale davanti alla legge, e nessuno è al di sopra della legge.", allineamento: "Legale" },
            { d6: 3, nome: "Libertà", descrizione: "Ai tiranni non deve essere permesso di opprimere il popolo.", allineamento: "Caotico" },
            { d6: 4, nome: "Potenza", descrizione: "Se divento forte, posso prendermi ciò che voglio... ciò che mi spetta.", allineamento: "Malvagio" },
            { d6: 5, nome: "Sincerità", descrizione: "Non c'è nulla di buono nel fingere di essere qualcosa che non sono.", allineamento: "Neutrale" },
            { d6: 6, nome: "Destino", descrizione: "Niente e nessuno può allontanarmi dalla mia chiamata superiore.", allineamento: "Qualsiasi" }
        ],
        legami: [
            { d6: 1, legame: "Ho una famiglia, ma non ho idea di dove sia. Un giorno spero di rivederla." },
            { d6: 2, legame: "Ho lavorato la terra, amo la terra e proteggerò la terra." },
            { d6: 3, legame: "Un nobile arrogante un tempo mi picchiò selvaggiamente; mi vendicherò su ogni prepotente che incontrerò." },
            { d6: 4, legame: "I miei strumenti sono simboli della mia vita passata e li porto con me per non dimenticare mai le mie radici." },
            { d6: 5, legame: "Proteggo coloro che non possono proteggersi da soli." },
            { d6: 6, legame: "Vorrei che il mio amore d'infanzia fosse venuto con me per seguire il mio destino." }
        ],
        difetti: [
            { d6: 1, difetto: "Il tiranno che governa la mia terra non si fermerà davanti a nulla pur di vedermi morto." },
            { d6: 2, difetto: "Sono convinto dell'importanza del mio destino e sono cieco di fronte alle mie mancanze e al rischio di fallire." },
            { d6: 3, difetto: "Le persone che mi conoscevano da giovane conoscono il mio vergognoso segreto, quindi non potrò mai più tornare a casa." },
            { d6: 4, difetto: "Ho un debole per i vizi della città, specialmente per i superalcolici." },
            { d6: 5, difetto: "Segretamente credo che le cose andrebbero meglio se fossi io il tiranno a governare la terra." },
            { d6: 6, difetto: "Ho difficoltà a fidarmi dei miei alleati." }
        ]
    }
};
