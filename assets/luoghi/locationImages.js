/**
 * locationImages.js
 * ─────────────────────────────────────────────────────────────
 * Indice delle immagini disponibili per i luoghi.
 * 
 * Per aggiungere nuove immagini:
 * 1. Aggiungi il file .png nella cartella assets/luoghi/
 * 2. Aggiungi una voce in questo file nella categoria appropriata
 * 
 * @version 1.0.0
 */

export const LOCATION_IMAGES = {
    // ═══════════════════════════════════════════════════════════════
    // MONDO E REGIONI (Livelli 1-2)
    // ═══════════════════════════════════════════════════════════════
    mondo: [
        { file: 'continente.png', name: 'Continente', type: 'continente' },
        { file: 'piano_dimensionale.png', name: 'Piano Dimensionale', type: 'piano_materiale' },
    ],
    regione: [
        { file: 'arcipelago.png', name: 'Arcipelago', type: 'arcipelago' },
        { file: 'deserto.png', name: 'Deserto', type: 'deserto' },
        { file: 'mare.png', name: 'Mare/Oceano', type: 'mare' },
        { file: 'catena_montuosa.png', name: 'Catena Montuosa', type: 'catena_montuosa' },
    ],

    // ═══════════════════════════════════════════════════════════════
    // AREE (Livello 4)
    // ═══════════════════════════════════════════════════════════════
    area: [
        { file: 'foresta.png', name: 'Foresta', type: 'foresta' },
        { file: 'lago.png', name: 'Lago', type: 'lago' },
        { file: 'fiume.png', name: 'Fiume', type: 'fiume' },
        { file: 'montagna.png', name: 'Montagna', type: 'montagna' },
        { file: 'palude.png', name: 'Palude', type: 'palude' },
        { file: 'valle.png', name: 'Valle', type: 'valle' },
        { file: 'pianura.png', name: 'Pianura', type: 'pianura' },
        { file: 'grotta.png', name: 'Grotta', type: 'grotta' },
        { file: 'canyon.png', name: 'Canyon', type: 'canyon' },
        { file: 'isola.png', name: 'Isola', type: 'isola' },
    ],

    // ═══════════════════════════════════════════════════════════════
    // INSEDIAMENTI (Livello 5)
    // ═══════════════════════════════════════════════════════════════
    insediamento: [
        { file: 'citta.png', name: 'Città', type: 'citta' },
        { file: 'villaggio.png', name: 'Villaggio', type: 'villaggio' },
        { file: 'fortezza.png', name: 'Fortezza', type: 'fortezza' },
        { file: 'porto.png', name: 'Porto', type: 'porto' },
        { file: 'dungeon.png', name: 'Dungeon', type: 'dungeon' },
        { file: 'rovine.png', name: 'Rovine', type: 'rovine' },
        { file: 'torre.png', name: 'Torre', type: 'torre' },
        { file: 'accampamento.png', name: 'Accampamento', type: 'accampamento' },
    ],

    // ═══════════════════════════════════════════════════════════════
    // EDIFICI (Livello 6)
    // ═══════════════════════════════════════════════════════════════
    edificio: [
        { file: 'taverna.png', name: 'Taverna/Locanda', type: 'taverna' },
        { file: 'tempio.png', name: 'Tempio', type: 'tempio' },
        { file: 'castello.png', name: 'Castello', type: 'castello' },
        { file: 'biblioteca.png', name: 'Biblioteca', type: 'biblioteca' },
        { file: 'mercato.png', name: 'Mercato', type: 'negozio' },
        { file: 'cripta.png', name: 'Cripta', type: 'cripta' },
    ],
};

/**
 * Ottiene tutte le immagini come lista piatta
 * @returns {Array} Lista di tutte le immagini con percorso
 */
export function getAllImages() {
    const all = [];
    for (const [category, images] of Object.entries(LOCATION_IMAGES)) {
        images.forEach(img => {
            all.push({
                ...img,
                category,
                path: `assets/luoghi/${img.file}`
            });
        });
    }
    return all;
}

/**
 * Ottiene le immagini suggerite per un tipo di luogo
 * @param {string} typeValue - Il tipo di luogo (es. 'foresta', 'citta')
 * @returns {Array} Lista di immagini suggerite
 */
export function getSuggestedImages(typeValue) {
    const all = getAllImages();
    // Cerca immagini che matchano il tipo
    const exactMatch = all.filter(img => img.type === typeValue);
    if (exactMatch.length > 0) return exactMatch;
    
    // Se non c'è match esatto, restituisce immagini della categoria appropriata
    return all;
}

/**
 * Ottiene le immagini per una categoria
 * @param {string} category - La categoria (mondo, regione, area, insediamento, edificio)
 * @returns {Array} Lista di immagini della categoria
 */
export function getImagesByCategory(category) {
    return LOCATION_IMAGES[category] || [];
}

export default LOCATION_IMAGES;
