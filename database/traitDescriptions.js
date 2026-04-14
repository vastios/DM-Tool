/**
 * Descrizioni dei tratti razziali per i tooltip
 * Utilizzato dal PG Manager per mostrare i dettagli al passaggio del mouse
 */

export const traitDescriptions = {
    // =========================================================================
    // TRATTI COMUNI
    // =========================================================================
    
    "darkvision": {
        nome: "Scurovisione",
        descrizione: "Hai una visione superiore nell'oscurità e in condizioni di luce debole. Entro 18 metri puoi vedere come se fosse piena luce, ma non puoi distinguere i colori, solo sfumature di grigio."
    },
    
    "keen-senses": {
        nome: "Sensi Acuti",
        descrizione: "Hai competenza nell'abilità Percezione. I tuoi sensi affinati ti permettono di notare dettagli che altri sfuggirebbero."
    },
    
    "fey-ancestry": {
        nome: "Discendenza Fatata",
        descrizione: "Hai vantaggio nei tiri salvezza contro l'essere affascinato e la magia non può metterti a dormire. Il tuo legame con il regno fatato ti protegge da questi effetti."
    },
    
    "trance": {
        nome: "Trance",
        descrizione: "Non dormi. Invece mediti in uno stato di trance profonda per 4 ore al giorno, ottenendo lo stesso beneficio di 8 ore di sonno umano."
    },
    
    // =========================================================================
    // TRATTI NANO
    // =========================================================================
    
    "dwarven-resilience": {
        nome: "Resilienza Nanica",
        descrizione: "Hai vantaggio sui tiri salvezza contro il veleno e hai resistenza ai danni da veleno. La tua fisiologia è abituata a resistere alle tossine presenti nelle miniere."
    },
    
    "stonecunning": {
        nome: "Esperto Minerario",
        descrizione: "Ogni volta che fai una prova di Intelligenza (Storia) relativa all'origine della muratura, sei considerato competente nell'abilità e aggiungi il doppio del tuo bonus di competenza."
    },
    
    "dwarven-combat-training": {
        nome: "Addestramento al Combattimento Nanico",
        descrizione: "Hai competenza con l'ascia da guerra, la scure da lancio, il martello leggero e il martello da guerra."
    },
    
    "tool-proficiency": {
        nome: "Competenza negli Strumenti",
        descrizione: "Hai competenza in uno dei seguenti strumenti artigianali a tua scelta: strumenti da fabbro, strumenti da birraio o strumenti da muratore."
    },
    
    // =========================================================================
    // TRATTI HALFLING
    // =========================================================================
    
    "lucky": {
        nome: "Fortunato",
        descrizione: "Quando tiri un 1 naturale su un d20 per un tiro per colpire, una prova di caratteristica o un tiro salvezza, puoi ritirare il dado e usare il nuovo risultato."
    },
    
    "brave": {
        nome: "Coraggioso",
        descrizione: "Hai vantaggio sui tiri salvezza contro l'essere spaventato. La tua natura tranquilla ti rende difficile da turbare."
    },
    
    "halfling-nimbleness": {
        nome: "Agilità Halfling",
        descrizione: "Puoi muoverti attraverso lo spazio di una creatura di taglia Media o superiore che sia ostile verso di te."
    },
    
    // =========================================================================
    // TRATTI DRAGONIDE
    // =========================================================================
    
    "draconic-ancestry": {
        nome: "Discendenza Draconica",
        descrizione: "Hai un legame ancestrale con un tipo di drago specifico. Questa discendenza determina il tipo di danno del tuo soffio e la tua resistenza ai danni."
    },
    
    "breath-weapon": {
        nome: "Arma a Soffio",
        descrizione: "Puoi usare la tua azione per esalare un'energia distruttiva. Le creature nell'area devono effettuare un tiro salvezza (CD 8 + bonus comp. + mod COS). I danni sono 2d6 (aumentano con i livelli). Dopo l'uso, non puoi riutilizzarlo fino a un riposo breve o lungo."
    },
    
    "damage-resistance": {
        nome: "Resistenza ai Danni",
        descrizione: "Hai resistenza al tipo di danno associato al tuo drago ancestrale. Questa resistenza riduce della metà i danni di quel tipo che subisci."
    },
    
    // =========================================================================
    // TRATTI GNOME
    // =========================================================================
    
    "gnome-cunning": {
        nome: "Astuzia Gnomesca",
        descrizione: "Hai vantaggio su tutti i tiri salvezza di Intelligenza, Saggezza o Carisma contro magia. La tua mente vivace resiste naturalmente agli effetti magici."
    },
    
    // =========================================================================
    // TRATTI MEZZELFO
    // =========================================================================
    
    "skill-versatility": {
        nome: "Versatilità nelle Abilità",
        descrizione: "Hai competenza in due abilità a tua scelta. La tua natura ibrida ti permette di eccellere in diverse aree."
    },
    
    // =========================================================================
    // TRATTI MEZZORCO
    // =========================================================================
    
    "savage-attacks": {
        nome: "Attacchi Selvaggi",
        descrizione: "Quando ottieni un colpo critico con un attacco con arma, puoi tirare uno dei dadi di danno dell'arma due volte e aggiungerlo ai danni extra."
    },
    
    "relentless-endurance": {
        nome: "Resistenza Inesausta",
        descrizione: "Quando scendi a 0 punti ferita ma non vieni ucciso, puoi scendere invece a 1 punto ferita. Non puoi usare questa capacità finché non completi un riposo lungo."
    },
    
    "menacing": {
        nome: "Minaccioso",
        descrizione: "Hai competenza nell'abilità Intimidire. Il tuo aspetto e la tua presenza sono naturalmente intimidatori."
    },
    
    // =========================================================================
    // TRATTI TIEFLING
    // =========================================================================
    
    "hellish-resistance": {
        nome: "Resistenza Infernale",
        descrizione: "Hai resistenza ai danni da fuoco. Il tuo sangue infernale ti protegge dalle fiamme."
    },
    
    "infernal-legacy": {
        nome: "Eredità Infernale",
        descrizione: "Conosci il trucco Taumaturgia. Al 3° livello puoi lanciare Fuoco Infernale come incantesimo di 2° livello una volta al giorno. Al 5° livello puoi lanciare Tenebre una volta al giorno. Carisma è la tua caratteristica da incantatore."
    }
};

/**
 * Tratti specifici delle sottorazze
 */
export const subraceTraits = {
    // Nano delle Colline
    "dwarven-toughness": {
        nome: "Durevolezza Nanica",
        descrizione: "Il tuo punto ferita massimo aumenta di 1, e aumenta di 1 ogni volta che guadagni un livello."
    },
    
    // Alto Elfo
    "elf-weapon-training": {
        nome: "Addestramento con Armi Elfiche",
        descrizione: "Hai competenza con le spade lunghe, le spade corte, gli archi lunghi e gli archi corti."
    },
    "high-elf-cantrip": {
        nome: "Trucco Elfico",
        descrizione: "Conosci un trucco a tua scelta dell'elenco dell'incantatore. Intelligenza è la tua caratteristica da incantatore per esso."
    },
    
    // Elfo dei Boschi
    "mask-of-the-wild": {
        nome: "Mascheramento",
        descrizione: "Puoi tentare di nasconderti anche quando sei solo leggermente oscurato da fogliame, pioggia pesante, neve cadente o nebbia."
    },
    "fleet-of-foot": {
        nome: "Velocità dei Boschi",
        descrizione: "La tua velocità base aumenta a 10,5 metri (35 piedi)."
    },
    
    // Drow
    "superior-darkvision": {
        nome: "Visione Superiore al Buio",
        descrizione: "La tua visione crepuscolare ha un raggio di 36 metri invece di 18."
    },
    "sunlight-sensitivity": {
        nome: "Sensibilità alla Luce Solare",
        descrizione: "Hai svantaggio ai tiri per colpire e alle prove di Percezione quando tu o il tuo bersaglio siete alla luce diretta del sole."
    },
    "drow-magic": {
        nome: "Magia Drow",
        descrizione: "Conosci il trucco Luce. Al 3° livello puoi lanciare Fosforescenza una volta al giorno. Al 5° livello puoi lanciare Tenebre una volta al giorno. Carisma è la tua caratteristica da incantatore."
    },
    
    // Halfling Piedelesto
    "naturally-stealthy": {
        nome: "Naturalmente Furtivo",
        descrizione: "Puoi tentare di nasconderti anche quando sei oscurato solo da una creatura di taglia superiore alla tua."
    },
    
    // Halfling Robusto
    "stout-resilience": {
        nome: "Resilienza Halfling",
        descrizione: "Hai vantaggio sui tiri salvezza contro il veleno e hai resistenza ai danni da veleno."
    },
    
    // Gnomo delle Rocce
    "artificers-lore": {
        nome: "Conoscenza Artigiana",
        descrizione: "Hai competenza negli strumenti da artigiano. Hai doppio bonus di competenza nelle prove di Storia relative a oggetti magici o dispositivi tecnologici."
    },
    "tinker": {
        nome: "Riparazione",
        descrizione: "Puoi usare il tuo tempo di riposo breve per riparare un oggetto meccanico danneggiato o creare piccoli congegni."
    },
    
    // Gnomo delle Foreste
    "speak-with-small-beasts": {
        nome: "Parlare con le Bestie",
        descrizione: "Puoi comunicare semplicemente con bestie di taglia Piccola o inferiore attraverso suoni e gesti."
    },
    "natural-illusionist": {
        nome: "Illusionista Naturale",
        descrizione: "Conosci il trucco Illusione Minore. Intelligenza è la tua caratteristica da incantatore."
    }
};

/**
 * Ottiene la descrizione di un tratto per index
 */
export function getTraitDescription(traitIndex) {
    return traitDescriptions[traitIndex] || subraceTraits[traitIndex] || null;
}

/**
 * Ottiene tutti i tratti con descrizioni per una razza
 */
export function getRaceTraitsWithDescriptions(race) {
    if (!race || !race.traits) return [];
    
    return race.traits.map(trait => {
        const desc = getTraitDescription(trait.index);
        return {
            index: trait.index,
            nome: trait.name,
            descrizione: desc?.descrizione || "Descrizione non disponibile."
        };
    });
}

console.log('📋 [TraitDescriptions] Database descrizioni tratti caricato.');