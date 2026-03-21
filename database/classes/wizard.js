/**
 * Database della classe Mago
 * Estratto da dungeonedraghi.it
 */

export const wizard = {
    index: 'wizard',
    classe: "Mago",
    descrizione_breve: "Un maestro degli arcani che studia la magia attraverso libri e ricerca approfondita.",
    dado_vita: "d6",
    caratteristica_primaria: "Intelligenza",
    
    competenze: {
        armature: [],
        armi: ["Bastoni", "Pugnali", "Archi corti", "Balestre leggere", "Fionde"],
        strumenti: "Nessuno",
        tiri_salvezza: ["Intelligenza", "Saggezza"],
        abilita: "Scegli due abilità tra: Arcana, Intuizione, Indagine, Medicina, Religione, Storia"
    },
    
    punti_ferita: {
        dado_vita: "d6",
        pf_livello_1: "6 + il tuo modificatore di Costituzione",
        pf_livelli_successivi: "1d6 (o 4) + il tuo modificatore di Costituzione per livello oltre il 1°"
    },
    
    equipaggiamento: [
        "(a) un bastone o (b) una balestra leggera e 20 dardi",
        "(a) una borsa da incantatore o (b) un focus arcano",
        "Un libro di incantesimi",
        "Un pugnale",
        "(a) una tunica da studioso o (b) abiti da viaggio",
        "(a) uno zaino da esploratore o (b) una borsa da viaggiatore",
        "Una bottiglia d'inchiostro, una penna d'inchiostro e pergamena"
    ],
    
    tabella_progressione: [
        {livello: 1, bonus_competenza: 2, privilegi: ["Incantesimi", "Recupero Arcano"], trucchetti_conosciuti: 3, incantesimi_conosciuti: 6, slot_1: 2, slot_2: 0, slot_3: 0, slot_4: 0, slot_5: 0, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 2, bonus_competenza: 2, privilegi: ["Tradizione Arcana"], trucchetti_conosciuti: 3, incantesimi_conosciuti: 9, slot_1: 3, slot_2: 0, slot_3: 0, slot_4: 0, slot_5: 0, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 3, bonus_competenza: 2, privilegi: [], trucchetti_conosciuti: 3, incantesimi_conosciuti: 12, slot_1: 4, slot_2: 2, slot_3: 0, slot_4: 0, slot_5: 0, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 4, bonus_competenza: 2, privilegi: ["Aumento dei Punteggi di Caratteristica"], trucchetti_conosciuti: 4, incantesimi_conosciuti: 15, slot_1: 4, slot_2: 3, slot_3: 0, slot_4: 0, slot_5: 0, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 5, bonus_competenza: 3, privilegi: [], trucchetti_conosciuti: 4, incantesimi_conosciuti: 18, slot_1: 4, slot_2: 3, slot_3: 2, slot_4: 0, slot_5: 0, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 6, bonus_competenza: 3, privilegi: ["Privilegio della Tradizione Arcana"], trucchetti_conosciuti: 4, incantesimi_conosciuti: 21, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 0, slot_5: 0, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 7, bonus_competenza: 3, privilegi: [], trucchetti_conosciuti: 4, incantesimi_conosciuti: 24, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 1, slot_5: 0, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 8, bonus_competenza: 3, privilegi: ["Aumento dei Punteggi di Caratteristica"], trucchetti_conosciuti: 4, incantesimi_conosciuti: 27, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 2, slot_5: 0, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 9, bonus_competenza: 4, privilegi: [], trucchetti_conosciuti: 4, incantesimi_conosciuti: 30, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 1, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 10, bonus_competenza: 4, privilegi: ["Privilegio della Tradizione Arcana"], trucchetti_conosciuti: 5, incantesimi_conosciuti: 33, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2, slot_6: 0, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 11, bonus_competenza: 4, privilegi: [], trucchetti_conosciuti: 5, incantesimi_conosciuti: 36, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2, slot_6: 1, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 12, bonus_competenza: 4, privilegi: ["Aumento dei Punteggi di Caratteristica"], trucchetti_conosciuti: 5, incantesimi_conosciuti: 39, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2, slot_6: 1, slot_7: 0, slot_8: 0, slot_9: 0},
        {livello: 13, bonus_competenza: 5, privilegi: [], trucchetti_conosciuti: 5, incantesimi_conosciuti: 42, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2, slot_6: 1, slot_7: 1, slot_8: 0, slot_9: 0},
        {livello: 14, bonus_competenza: 5, privilegi: ["Privilegio della Tradizione Arcana"], trucchetti_conosciuti: 5, incantesimi_conosciuti: 45, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2, slot_6: 1, slot_7: 1, slot_8: 0, slot_9: 0},
        {livello: 15, bonus_competenza: 5, privilegi: [], trucchetti_conosciuti: 5, incantesimi_conosciuti: 48, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2, slot_6: 1, slot_7: 1, slot_8: 1, slot_9: 0},
        {livello: 16, bonus_competenza: 5, privilegi: ["Aumento dei Punteggi di Caratteristica"], trucchetti_conosciuti: 5, incantesimi_conosciuti: 51, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2, slot_6: 1, slot_7: 1, slot_8: 1, slot_9: 0},
        {livello: 17, bonus_competenza: 6, privilegi: [], trucchetti_conosciuti: 5, incantesimi_conosciuti: 54, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 2, slot_6: 1, slot_7: 1, slot_8: 1, slot_9: 1},
        {livello: 18, bonus_competenza: 6, privilegi: ["Maestria degli Incantesimi"], trucchetti_conosciuti: 5, incantesimi_conosciuti: 57, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 3, slot_6: 1, slot_7: 1, slot_8: 1, slot_9: 1},
        {livello: 19, bonus_competenza: 6, privilegi: ["Aumento dei Punteggi di Caratteristica"], trucchetti_conosciuti: 5, incantesimi_conosciuti: 60, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 3, slot_6: 2, slot_7: 1, slot_8: 1, slot_9: 1},
        {livello: 20, bonus_competenza: 6, privilegi: ["Maestria della Tradizione Arcana"], trucchetti_conosciuti: 5, incantesimi_conosciuti: 63, slot_1: 4, slot_2: 3, slot_3: 3, slot_4: 3, slot_5: 3, slot_6: 2, slot_7: 2, slot_8: 1, slot_9: 1}
    ],
    
    descrizione_privilegi: {
        "Incantesimi": {
            riassunto: "Hai un libro di incantesimi che contiene i tuoi incantesimi conosciuti.",
            descrizione_completa: "Al 1° livello, hai un libro di incantesimi che contiene sei incantesimi da mago di 1° livello a tua scelta. La tua caratteristica da incantatore è l'Intelligenza. Ogni volta che guadagni un livello da mago, puoi aggiungere due incantesimi da mago al tuo libro di incantesimi. Questi incantesimi devono essere di un livello per cui hai slot di incantesimo."
        },
        "Recupero Arcano": {
            riassunto: "Puoi recuperare slot di incantesimo durante un riposo breve.",
            descrizione_completa: "Al 1° livello, hai imparato a recuperare parte della tua energia magica studiando il tuo libro di incantesimi. Una volta al giorno, durante un riposo breve, puoi scegliere di recuperare slot di incantesimi spenti. Il totale dei livelli degli slot recuperati non può superare la metà del tuo livello da mago (arrotondato per difetto), e nessuno slot può essere superiore al 6° livello."
        },
        "Tradizione Arcana": {
            riassunto: "Scegli una tradizione arcana che modella il tuo approccio alla magia.",
            descrizione_completa: "Al 2° livello, scegli una tradizione arcana che modella il tuo approccio alla magia: Scuola di Abiurazione, Scuola di Adivinazione, Scuola di Evocazione, Scuola di Illusione, Scuola di Incantazione, Scuola di Necromanzia, Scuola di Trasmutazione, o Scuola di Evocazione. La tua scelta ti conferisce privilegi al 2° livello, e poi ancora al 6°, 10° e 14° livello."
        },
        "Aumento dei Punteggi di Caratteristica": {
            riassunto: "Puoi aumentare i tuoi punteggi di caratteristica.",
            descrizione_completa: "Quando raggiungi il 4° livello, e poi ancora all'8°, 12°, 16° e 19° livello, puoi incrementare un tuo punteggio di caratteristica di 2, o incrementare due punteggi di caratteristica di 1. Di norma, utilizzando questo privilegio non puoi accrescere un punteggio di caratteristica oltre il 20."
        },
        "Maestria degli Incantesimi": {
            riassunto: "Puoi lanciare un incantesimo a scelta senza usare slot.",
            descrizione_completa: "Al 18° livello, hai raggiunto una tale maestria in certi incantesimi che puoi lanciarli a volontà. Scegli un incantesimo da mago di 1° livello e uno di 2° livello dal tuo libro di incantesimi. Puoi lanciare questi incantesimi al loro livello più basso senza spendere slot di incantesimo quando li hai preparati."
        },
        "Maestria della Tradizione Arcana": {
            riassunto: "Ottieni un potente privilegio della tua tradizione arcana.",
            descrizione_completa: "Al 20° livello, ottieni un privilegio supremo concesso dalla tua tradizione arcana. Ogni tradizione ha un privilegio unico che rappresenta il culmine del tuo studio e maestria magica."
        }
    },
    
    incantazione: {
        caratteristica_da_incantatore: "Intelligenza",
        cd_tiro_salvezza: "8 + bonus competenza + modificatore Intelligenza",
        modificatore_attacco: "bonus competenza + modificatore Intelligenza",
        focus_incantamento: "Focus arcano (bastone, bacchetta, cristallo, sfera, ecc.)",
        rituali: true
    },
    
    sottoclassi: [
        {
            nome: "Scuola di Evocazione",
            descrizione: "Ti concentri sugli incantesimi che creano effetti elementali ed energetici.",
            privilegi: {
                "2": {
                    nome: "Evocatore",
                    descrizione: "Quando lanci un incantesimo di evocazione che infligge danni, puoi aggiungere il tuo bonus di competenza a un tiro di danno dell'incantesimo."
                },
                "2_b": {
                    nome: "Trucchetti Minorì",
                    descrizione: "Impari il truccetto 'Presa Magica' se non lo conosci già. Quando lanci un incantesimo di evocazione che infligge danni, puoi creare un effetto minore innocuo."
                },
                "6": {
                    nome: "Incantesimi Sovraccarichi",
                    descrizione: "Quando lanci un incantesimo di evocazione che infligge danni, puoi creare un effetto sovraccarico. Aumenta il danno di metà del tuo livello da mago."
                },
                "10": {
                    nome: "Evocazione Potenziata",
                    descrizione: "Quando lanci un incantesimo di evocazione che ha una durata istantanea o fino a 1 minuto, puoi estendere la durata a 10 minuti."
                },
                "14": {
                    nome: "Maestro dell'Evocazione",
                    descrizione: "Quando lanci un incantesimo di evocazione di 1°-5° livello, puoi lanciarlo al suo livello più basso senza spendere uno slot di incantesimo. Puoi usare questo privilegio un numero di volte pari al tuo bonus di competenza."
                }
            }
        },
        {
            nome: "Scuola di Abiurazione",
            descrizione: "Ti concentri sugli incantesimi che bloccano, annullano o proteggono.",
            privilegi: {
                "2": {
                    nome: "Abjuratore",
                    descrizione: "Quando lanci un incantesimo di abiurazione di 1° livello o superiore, puoi creare un effetto protettivo su una creatura entro 9 metri. La creatura ottiene punti ferita temporanei pari al doppio del livello dell'incantesimo + il tuo bonus di competenza."
                },
                "6": {
                    nome: "Controincantesimo Arcano",
                    descrizione: "Quando una creatura lancia un incantesimo che ti bersaglia o che ti include nella sua area, puoi usare la tua reazione per tentare di annullarlo. Effettua una prova di Intelligenza (Arcana) con CD 10 + livello dell'incantesimo. Se superi, l'incantesimo è annullato."
                },
                "10": {
                    nome: "Resistenza Magica Migliorata",
                    descrizione: "Quando lanci un incantesimo di abiurazione che fornisce resistenza ai danni, la resistenza è applicata anche ai danni di tipo forza, fulmine e tuono."
                },
                "14": {
                    nome: "Maestro dell'Abiurazione",
                    descrizione: "Hai vantaggio sui tiri salvezza contro incantesimi e altri effetti magici. Inoltre, hai resistenza ai danni inflitti da incantesimi."
                }
            }
        },
        {
            nome: "Scuola di Divinazione",
            descrizione: "Ti concentri sugli incantesimi che rivelano informazioni nascoste e predicono il futuro.",
            privilegi: {
                "2": {
                    nome: "Presagi",
                    descrizione: "Quando finisci un riposo lungo, ottieni due presagi che puoi usare durante il giorno. Quando tu o una creatura che puoi vedere effettua un tiro d20, puoi usare un presagio per sostituire il risultato con un numero tra 1 e 20."
                },
                "6": {
                    nome: "Occhio del Mago",
                    descrizione: "Puoi lanciare 'Occhio del Mago' come rituale senza averlo preparato. Quando lo lanci, puoi vedere attraverso l'occhio magico anche attraverso il buio magico."
                },
                "10": {
                    nome: "Terzo Occhio",
                    descrizione: "Puoi usare un'azione per aumentare i tuoi sensi. Per 1 minuto, ottieni uno dei seguenti benefici: Vista Profonda (18 metri), Vista Magica (vedi creature invisibili e oggetti magici entro 3 metri), Vista da Lontano (vedi fino a 1,5 km come se fosse 30 metri)."
                },
                "14": {
                    nome: "Maestro della Divinazione",
                    descrizione: "I tuoi presagi aumentano a tre per riposo lungo. Inoltre, quando usi un presagio, puoi usare una reazione per cambiare un tiro d20 che hai appena effettuato."
                }
            }
        },
        {
            nome: "Scuola di Necromanzia",
            descrizione: "Ti concentri sugli incantesimi che manipolano la vita, la morte e la non-morte.",
            privilegi: {
                "2": {
                    nome: "Mietitore",
                    descrizione: "Quando lanci un incantesimo di necromanzia di 1° livello o superiore che uccide una creatura umanoide, questa risorge come zombie o scheletro sotto il tuo controllo se hai uno slot di incantesimo disponibile."
                },
                "6": {
                    nome: "Non Morto Obbediente",
                    descrizione: "I non morti che crei con incantesimi di necromanzia hanno punti ferita massimi aumentati del tuo livello da mago. Inoltre, puoi usare un'azione bonus per comandare loro di attaccare."
                },
                "10": {
                    nome: "Resistenza alla Non-Morte",
                    descrizione: "Hai resistenza ai danni necrotici. Inoltre, i tuoi tiri salvezza contro gli incantesimi di non morti sono effettuati con vantaggio."
                },
                "14": {
                    nome: "Maestro della Necromanzia",
                    descrizione: "Puoi lanciare 'Resurrezione' una volta senza usare slot di incantesimo. Dopo averlo fatto, non puoi usarlo di nuovo finché non completi un riposo lungo. Inoltre, i non morti che crei hanno anche i benefici del privilegio Non Morto Obbediente."
                }
            }
        },
        {
            nome: "Scuola di Illusione",
            descrizione: "Ti concentri sugli incantesimi che ingannano i sensi e la mente.",
            privilegi: {
                "2": {
                    nome: "Illusionista Migliorato",
                    descrizione: "Quando lanci un incantesimo di illusione di 1° livello o superiore che ha una durata di 1 minuto o più, puoi estendere la durata a 10 minuti. Inoltre, puoi usare la tua azione bonus per cambiare la natura dell'illusione (colore, suono, odore)."
                },
                "6": {
                    nome: "Illusione Tangibile",
                    descrizione: "Quando lanci un incantesimo di illusione che crea un'immagine, puoi usare la tua azione bonus per rendere l'immagine tangibile per 1 minuto. Le creature possono interagire fisicamente con essa, e essa ha CA 10 e punti ferita pari al tuo livello da mago."
                },
                "10": {
                    nome: "Illusione Incoronata",
                    descrizione: "Puoi creare un'illusione che copre te stesso. Come azione, puoi apparire come un'altra creatura di taglia simile per 1 minuto. Questa è un'illusione fisica e le creature possono interagire con te."
                },
                "14": {
                    nome: "Maestro dell'Illusione",
                    descrizione: "Puoi lanciare 'Immagine Maggiore' a volontà senza usare slot di incantesimo. Inoltre, le tue illusioni possono diventare reali per 1 minuto una volta al giorno."
                }
            }
        },
        {
            nome: "Scuola di Trasmutazione",
            descrizione: "Ti concentri sugli incantesimi che alterano la materia e l'energia.",
            privilegi: {
                "2": {
                    nome: "Pietra dell'Alchimista",
                    descrizione: "Puoi creare una piccola pietra magica che può trasformare una sostanza in un'altra. La pietra può essere usata per: trasformare acqua in vino o veleno, trasformare pietra in fango, trasformare metallo in legno. La pietra dura 24 ore."
                },
                "6": {
                    nome: "Trasmutatore",
                    descrizione: "Quando lanci un incantesimo di trasmutazione di 1° livello o superiore che ha una durata di 1 minuto o più, puoi estendere la durata a 1 ora. Inoltre, puoi concentrarti su due incantesimi di trasmutazione contemporaneamente."
                },
                "10": {
                    nome: "Cambio di Forma",
                    descrizione: "Puoi usare la tua azione per assumere la forma di una bestia di grado di sfida 1 o inferiore che hai visto prima. Questa trasformazione dura 1 ora o finché non la annulli."
                },
                "14": {
                    nome: "Maestro della Trasmutazione",
                    descrizione: "Puoi usare la tua pietra dell'alchimista per creare effetti più potenti: trasformare un oggetto non magico in un oggetto magico per 1 ora, trasformare una creatura in un'altra per 1 ora, o creare una pozione curativa. Puoi usare questi effetti un numero di volte pari al tuo bonus di competenza."
                }
            }
        }
    ],
    
    // Compatibilità
    name: "Mago",
    hit_die: 6,
    saving_throws: [
        { name: "Intelligenza", index: "int" },
        { name: "Saggezza", index: "wis" }
    ]
};
