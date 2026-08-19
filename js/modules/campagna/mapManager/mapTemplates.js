// mapTemplates.js
// ─────────────────────────────────────────────────────────────
// Registry delle mappe template pre-generate con AI.
// Sempre disponibili offline in assets/maps/ai-templates/.

export const MAP_TEMPLATES = [
    {
        id: 'world',
        name: 'Mondo Fantasy',
        description: 'Mappa continentale stile pergamena',
        type: 'world',
        image: 'assets/maps/ai-templates/world_map.png',
    },
    {
        id: 'region',
        name: 'Regione',
        description: 'Mappa regionale con foreste, montagne, fiumi',
        type: 'region',
        image: 'assets/maps/ai-templates/region_map.png',
    },
    {
        id: 'city',
        name: 'Città Medievale',
        description: 'Pianta cittadina con strade e distretti',
        type: 'city',
        image: 'assets/maps/ai-templates/city_map.png',
    },
    {
        id: 'dungeon',
        name: 'Dungeon',
        description: 'Corridoi di pietra, stanze, porte',
        type: 'dungeon',
        image: 'assets/maps/ai-templates/dungeon_map.png',
    },
    {
        id: 'forest',
        name: 'Foresta',
        description: 'Battlemappa foresta con sentiero',
        type: 'other',
        image: 'assets/maps/ai-templates/forest_map.png',
    },
    {
        id: 'swamp',
        name: 'Palude',
        description: 'Battlemappa palude con acque torbide',
        type: 'other',
        image: 'assets/maps/ai-templates/swamp_map.png',
    },
    {
        id: 'mountain',
        name: 'Passo Montano',
        description: 'Battlemappa montagna con rocce e dirupi',
        type: 'other',
        image: 'assets/maps/ai-templates/mountain_map.png',
    },
    {
        id: 'desert',
        name: 'Deserto',
        description: 'Battlemappa deserto con dune di sabbia',
        type: 'other',
        image: 'assets/maps/ai-templates/desert_map.png',
    },
    {
        id: 'tavern',
        name: 'Interno Taverna',
        description: 'Battlemappa taverna con tavoli e bancone',
        type: 'building',
        image: 'assets/maps/ai-templates/tavern_map.png',
    },
    {
        id: 'castle_hall',
        name: 'Sala del Castello',
        description: 'Battlemappa sala grande con trono',
        type: 'building',
        image: 'assets/maps/ai-templates/castle_hall_map.png',
    },
    {
        id: 'crypt',
        name: 'Cripta',
        description: 'Battlemappa cripta con sarcofagi',
        type: 'dungeon',
        image: 'assets/maps/ai-templates/crypt_map.png',
    },
    {
        id: 'cave',
        name: 'Caverna',
        description: 'Battlemappa caverna con stalattiti',
        type: 'dungeon',
        image: 'assets/maps/ai-templates/cave_map.png',
    },
];

/**
 * Carica un'immagine template e la converte in base64 data URL.
 * @param {string} imagePath - Path relativo dell'immagine
 * @returns {Promise<string>} Base64 data URL
 */
export async function loadTemplateAsBase64(imagePath) {
    try {
        const response = await fetch(imagePath);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error('Errore caricamento template:', e);
        throw new Error(`Impossibile caricare il template: ${imagePath}`);
    }
}

console.log('🗺️ [MapTemplates] Registry caricato:', MAP_TEMPLATES.length, 'template');
