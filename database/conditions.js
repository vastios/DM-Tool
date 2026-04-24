// database/conditions.js
/**
 * Database delle condizioni di D&D 5e (SRD 5.1 Italiano)
 * 
 * Ogni condizione contiene:
 * - description: La descrizione completa della condizione (per tooltip, wiki, ecc.)
 * - summary: Una sintesi rapida degli effetti meccanici principali (per UI combat tracker, toast, ecc.)
 * 
 * @version 2.0.0 - Ristrutturato per eliminare duplicazioni con stateManager.js
 */

export const conditionsDatabase = {
    "Accecato": {
        description: "Una creatura accecata non può vedere e fallisce automaticamente tutte le prove di caratteristica che richiedono l'uso della vista. I tiri per colpire contro la creatura hanno vantaggio, mentre i tiri per colpire della creatura hanno svantaggio.",
        summary: "Svantaggio sui tiri per colpire"
    },
    "Affascinato": {
        description: "Una creatura affascinata non può attaccare o prendere a bersaglio chi l'ha affascinata con capacità speciali o effetti magici dannosi. L'affascinatore ha vantaggio su qualsiasi prova di caratteristica per interagire socialmente con la creatura.",
        summary: "Non può attaccare il suo affascinatore"
    },
    "Afferrato": {
        description: "La velocità di una creatura afferrata diventa 0, e non può beneficiare di alcun bonus alla sua velocità. La condizione termina se chi l'ha afferrata è inabile (vedi quella condizione). La condizione termina anche se un effetto allontana la creatura afferrata dalla portata di chi l'ha iniziato l'attacco o l'effetto di lottare, come quando una creatura viene scagliata via dall'incantesimo onda di tuono.",
        summary: "Velocità 0. I tiri per colpire contro di esso hanno vantaggio"
    },
    "Assordato": {
        description: "Una creatura assordata non può udire e fallisce automaticamente tutte le prove di caratteristica basate sull'udito.",
        summary: "Fallisce prove basate sull'udito"
    },
    "Avvelenato": {
        description: "Una creatura avvelenata ha svantaggio sui tiri per colpire e sulle prove di caratteristica.",
        summary: "Svantaggio su tiri per colpire e su Destrezza"
    },
    "Inabile": {
        description: "Una creatura inabile non può effettuare azioni o reazioni.",
        summary: "Non può effettuare azioni o reazioni"
    },
    "Intralciato": {
        description: "La velocità di una creatura intralciata diventa 0, e non può beneficiare di alcun bonus alla sua velocità. I tiri per colpire contro la creatura hanno vantaggio, e i tiri per colpire della creatura hanno svantaggio. La creatura ha svantaggio sui tiri salvezza su Destrezza.",
        summary: "Velocità 0. Svantaggio su tiri per colpire e su Destrezza"
    },
    "Invisibile": {
        description: "Una creatura invisibile è impossibile da vedere senza l'aiuto della magia o di un senso speciale. Al fine di nascondersi, la creatura è oscurata pesantemente. La posizione della creatura può essere individuata da qualsiasi rumore prodotto da essa o dalle impronte. I tiri per colpire contro la creatura hanno svantaggio, mentre i tiri per colpire della creatura hanno vantaggio.",
        summary: "I tiri per colpire contro di esso hanno svantaggio"
    },
    "Paralizzato": {
        description: "Una creatura paralizzata è inabile (vedi quella condizione) e non può muoversi né parlare. La creatura fallisce automaticamente i tiri salvezza su Forza e Destrezza. I tiri per colpire contro la creatura hanno vantaggio. Qualsiasi attacco che colpisce la creatura è automaticamente un colpo critico, se l'attaccante si trova entro 1,5 metri da essa.",
        summary: "Inabile. Attacchi a contatto sono critici automatici"
    },
    "Pietrificato": {
        description: "Una creatura pietrificata è trasformata, insieme a qualsiasi oggetto non magico che indossa o trasporta, in una sostanza solida inanimata (di solito pietra). Il suo peso aumenta di dieci volte tanto e smette di invecchiare. La creatura è inabile (vedi quella condizione), non può muoversi o parlare, ed è inconsapevole di ciò che accade nei dintorni. I tiri per colpire contro la creatura hanno vantaggio. La creatura fallisce automaticamente i tiri salvezza su Forza e Destrezza. La creatura è resistente a tutti i danni. La creatura è immune ai veleni e alle malattie, sebbene i veleni e le malattie già presenti nel suo sistema vengano sospesi, non neutralizzati.",
        summary: "Inabile. Resistente a tutti i danni"
    },
    "Prono": {
        description: "L'unica opzione di movimento per una creatura prona è di strisciare, a meno che non si rialzi e ponga fine alla sua condizione. La creatura ha svantaggio sui tiri per colpire. Un tiro per colpire contro la creatura ha vantaggio, se l'attaccante si trova entro 1,5 metri dalla creatura. Altrimenti, il tiro per colpire ha svantaggio.",
        summary: "Velocità 0. Svantaggio sui tiri per colpire"
    },
    "Spaventato": {
        description: "Una creatura spaventata ha svantaggio sulle prove di caratteristica e i tiri per colpire mentre la fonte della sua paura è nella linea di visuale. La creatura non può avvicinarsi volontariamente alla fonte della sua paura.",
        summary: "Svantaggio sui tiri per colpire"
    },
    "Stordito": {
        description: "Una creatura stordita è inabile (vedi quella condizione), non può muoversi e può parlare a fatica. La creatura fallisce automaticamente i tiri salvezza su Forza e Destrezza. I tiri per colpire contro la creatura hanno vantaggio.",
        summary: "Inabile. Non può muoversi"
    },
    "Indebolimento": {
        description: "Alcune capacità speciali e ambienti pericolosi, come la fame e gli effetti a lungo termine delle temperature gelide o torride, possono portare a una condizione speciale detta indebolimento. L'indebolimento viene misurato in sei livelli. Un effetto può imporre a una creatura uno o più livelli di indebolimento, come specificato nella descrizione dell'effetto.\n\nLivello\tEffetto\n1\tSvantaggio sulle prove di caratteristica\n2\tVelocità dimezzata\n3\tSvantaggio sui tiri per colpire e sui tiri salvezza\n4\tPunti ferita massimi dimezzati\n5\tVelocità ridotta a 0\n6\tMorte\n\nSe una creatura già indebolita subisce un altro effetto che provoca indebolimento, il suo livello attuale di indebolimento aumenta dell'ammontare specificato nella descrizione dell'effetto.\n\nUna creatura subisce l'effetto del suo attuale livello di indebolimento oltre a quelli di tutti i livelli inferiori. Ad esempio, una creatura che soffre indebolimento di livello 2 ha la velocità dimezzata e svantaggio alle prove di caratteristica.\n\nUn effetto che rimuove l'indebitamento riduce il suo livello come specificato nella descrizione dell'effetto, e gli effetti dell'indebitamento hanno termine se il livello di indebitamento della creatura viene ridotto sotto l'1.\n\nTerminare un riposo lungo riduce il livello di indebitamento di una creatura di 1, purché quella creatura abbia potuto mangiare e bere.",
        summary: "Penalità cumulative su 6 livelli fino alla morte"
    },
    "Svenuto": {
        description: "Una creatura svenuta è inabile (vedi quella condizione), non può muoversi o parlare, ed è inconsapevole di ciò che accade nei dintorni. La creatura lascia cadere qualsiasi cosa impugni e cade prona. La creatura fallisce automaticamente i tiri salvezza su Forza e Destrezza. I tiri per colpire contro la creatura hanno vantaggio. Qualsiasi attacco che colpisce la creatura è automaticamente un colpo critico se l'attaccante si trova entro 1,5 metri da essa.",
        summary: "Inabile, caduto prono. Attacchi a contatto sono critici automatici"
    }
};

/**
 * Helper per ottenere solo i nomi delle condizioni (per regex, autocomplete, ecc.)
 * @returns {string[]} Array dei nomi delle condizioni
 */
export function getConditionNames() {
    return Object.keys(conditionsDatabase);
}

/**
 * Helper per ottenere la descrizione di una condizione
 * @param {string} conditionName - Il nome della condizione
 * @returns {string|null} La descrizione o null se non trovata
 */
export function getConditionDescription(conditionName) {
    const condition = conditionsDatabase[conditionName];
    return condition ? condition.description : null;
}

/**
 * Helper per ottenere il summary di una condizione
 * @param {string} conditionName - Il nome della condizione
 * @returns {string|null} Il summary o null se non trovata
 */
export function getConditionSummary(conditionName) {
    const condition = conditionsDatabase[conditionName];
    return condition ? condition.summary : null;
}

/**
 * Helper per ottenere tutti i summary in formato {nome: summary}
 * Utile per il combat tracker e i toast
 * @returns {Object} Oggetto mappa nome -> summary
 */
export function getConditionSummaries() {
    const summaries = {};
    for (const [name, data] of Object.entries(conditionsDatabase)) {
        summaries[name] = data.summary;
    }
    return summaries;
}

console.log('📋 [ConditionsDatabase] Modulo caricato. Condizioni disponibili:', Object.keys(conditionsDatabase).length);
