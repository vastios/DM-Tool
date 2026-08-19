// mapTemplates.js
// ─────────────────────────────────────────────────────────────
// Registry delle 56 mappe template pre-generate con AI.
// Sempre disponibili offline in assets/maps/ai-templates/.

export const MAP_TEMPLATES = [
    // === MAPPE MONDIALI (7) ===
    { id: 'world', name: 'Mondo Fantasy', description: 'Mappa continentale stile pergamena', type: 'world', category: 'Mondiali', image: 'assets/maps/ai-templates/world_map.png' },
    { id: 'world_polar', name: 'Regione Polare', description: 'Continente ghiacciato e mare gelato', type: 'world', category: 'Mondiali', image: 'assets/maps/ai-templates/world_polar_map.png' },
    { id: 'world_archipelago', name: 'Arcipelago', description: 'Isole tropicali e mare turchese', type: 'world', category: 'Mondiali', image: 'assets/maps/ai-templates/world_archipelago_map.png' },
    { id: 'world_dark', name: 'Mondo Oscuro', description: 'Continenti minacciosi, mare nero', type: 'world', category: 'Mondiali', image: 'assets/maps/ai-templates/world_dark_map.png' },
    { id: 'world_island', name: 'Isola', description: 'Singola isola con spiagge e montagne', type: 'world', category: 'Mondiali', image: 'assets/maps/ai-templates/world_island_map.png' },
    { id: 'world_continent', name: 'Continente', description: 'Grande continente con deserti e foreste', type: 'world', category: 'Mondiali', image: 'assets/maps/ai-templates/world_continent_map.png' },
    { id: 'world_underground', name: 'Mondo Sotterraneo', description: 'Caverne, mare sotterraneo, foresta di funghi', type: 'world', category: 'Mondiali', image: 'assets/maps/ai-templates/world_underground_map.png' },
    
    // === REGIONI (1) ===
    { id: 'region', name: 'Regione', description: 'Foreste, montagne, fiumi e strade', type: 'region', category: 'Mondiali', image: 'assets/maps/ai-templates/region_map.png' },
    
    // === CITTÀ (7) ===
    { id: 'city', name: 'Città Medievale', description: 'Strade, edifici e distretti', type: 'city', category: 'Città', image: 'assets/maps/ai-templates/city_map.png' },
    { id: 'city_walled', name: 'Città Murata', description: 'Mura, torri di guardia e cancelli', type: 'city', category: 'Città', image: 'assets/maps/ai-templates/city_walled_map.png' },
    { id: 'city_village', name: 'Villaggio', description: 'Case, strade sterrate, fattorie', type: 'city', category: 'Città', image: 'assets/maps/ai-templates/city_village_map.png' },
    { id: 'city_port', name: 'Porto', description: 'Moli, navi, magazzini, harbour', type: 'city', category: 'Città', image: 'assets/maps/ai-templates/city_port_map.png' },
    { id: 'city_camp', name: 'Accampamento', description: 'Tende, fuochi, torri di guardia', type: 'city', category: 'Città', image: 'assets/maps/ai-templates/city_camp_map.png' },
    { id: 'city_market', name: 'Piazza Mercato', description: 'Bancarelle, mercanti, fontana', type: 'city', category: 'Città', image: 'assets/maps/ai-templates/city_market_map.png' },
    { id: 'city_fortress', name: 'Fortezza', description: 'Rocca, bastioni, cortile, caserme', type: 'city', category: 'Città', image: 'assets/maps/ai-templates/city_fortress_map.png' },
    
    // === EDIFICI (10) ===
    { id: 'tavern', name: 'Taverna', description: 'Tavoli, bancone, camino', type: 'building', category: 'Edifici', image: 'assets/maps/ai-templates/tavern_map.png' },
    { id: 'castle_hall', name: 'Sala del Castello', description: 'Sala grande con trono', type: 'building', category: 'Edifici', image: 'assets/maps/ai-templates/castle_hall_map.png' },
    { id: 'building_manor', name: 'Magione', description: 'Mobili eleganti, camino, tappeto', type: 'building', category: 'Edifici', image: 'assets/maps/ai-templates/building_manor_map.png' },
    { id: 'building_church', name: 'Chiesa', description: 'Banchi, altare, vetrate', type: 'building', category: 'Edifici', image: 'assets/maps/ai-templates/building_church_map.png' },
    { id: 'building_tower', name: 'Torre del Mago', description: 'Scale a spirale, libreria, scrivania', type: 'building', category: 'Edifici', image: 'assets/maps/ai-templates/building_tower_map.png' },
    { id: 'building_shop', name: 'Bottega', description: 'Scaffali, bancone, botti', type: 'building', category: 'Edifici', image: 'assets/maps/ai-templates/building_shop_map.png' },
    { id: 'building_blacksmith', name: 'Fucina', description: 'Incudine, fornace, armi', type: 'building', category: 'Edifici', image: 'assets/maps/ai-templates/building_blacksmith_map.png' },
    { id: 'building_inn', name: 'Stanza Locanda', description: 'Letti, mobili, finestra', type: 'building', category: 'Edifici', image: 'assets/maps/ai-templates/building_inn_map.png' },
    { id: 'building_warehouse', name: 'Magazzino', description: 'Casse, botti, scaffali', type: 'building', category: 'Edifici', image: 'assets/maps/ai-templates/building_warehouse_map.png' },
    { id: 'building_throne', name: 'Sala del Trono', description: 'Trono d\'oro, tappeto rosso, pilastri', type: 'building', category: 'Edifici', image: 'assets/maps/ai-templates/building_throne_map.png' },
    
    // === DUNGEON (12) ===
    { id: 'dungeon', name: 'Dungeon', description: 'Corridoi di pietra, stanze, porte', type: 'dungeon', category: 'Dungeon', image: 'assets/maps/ai-templates/dungeon_map.png' },
    { id: 'crypt', name: 'Cripta', description: 'Sarcofagi, atmosfera oscura, teschi', type: 'dungeon', category: 'Dungeon', image: 'assets/maps/ai-templates/crypt_map.png' },
    { id: 'cave', name: 'Caverna', description: 'Stalattiti, pool sotterraneo, rocce', type: 'dungeon', category: 'Dungeon', image: 'assets/maps/ai-templates/cave_map.png' },
    { id: 'dungeon_mine', name: 'Miniera', description: 'Binari, travi di legno, rocce', type: 'dungeon', category: 'Dungeon', image: 'assets/maps/ai-templates/dungeon_mine_map.png' },
    { id: 'dungeon_ruins', name: 'Rovine Sotterranee', description: 'Pilastri, muri crollati, muschio', type: 'dungeon', category: 'Dungeon', image: 'assets/maps/ai-templates/dungeon_ruins_map.png' },
    { id: 'dungeon_temple', name: 'Tempio Sotterraneo', description: 'Altare, statue, rune mistiche', type: 'dungeon', category: 'Dungeon', image: 'assets/maps/ai-templates/dungeon_temple_map.png' },
    { id: 'dungeon_sewer', name: 'Fogne', description: 'Canali di pietra, acqua sporca, grate', type: 'dungeon', category: 'Dungeon', image: 'assets/maps/ai-templates/dungeon_sewer_map.png' },
    { id: 'dungeon_library', name: 'Biblioteca Antica', description: 'Scaffali alti, tavoli, tomi polverosi', type: 'dungeon', category: 'Dungeon', image: 'assets/maps/ai-templates/dungeon_library_map.png' },
    { id: 'dungeon_laboratory', name: 'Laboratorio Alchemico', description: 'Pozioni, calderone, ingredienti', type: 'dungeon', category: 'Dungeon', image: 'assets/maps/ai-templates/dungeon_laboratory_map.png' },
    { id: 'dungeon_tomb', name: 'Tomba Antica', description: 'Sarcofago, tesori, geroglifici', type: 'dungeon', category: 'Dungeon', image: 'assets/maps/ai-templates/dungeon_tomb_map.png' },
    { id: 'dungeon_prison', name: 'Prigione Sotterranea', description: 'Gabbie di ferro, catene, muri', type: 'dungeon', category: 'Dungeon', image: 'assets/maps/ai-templates/dungeon_prison_map.png' },
    { id: 'dungeon_vault', name: 'Camera del Tesoro', description: 'Oro, forzieri, gemme, pilastri', type: 'dungeon', category: 'Dungeon', image: 'assets/maps/ai-templates/dungeon_vault_map.png' },
    { id: 'dungeon_cave', name: 'Caverna Cristallina', description: 'Cristalli, laghetto, formazioni', type: 'dungeon', category: 'Dungeon', image: 'assets/maps/ai-templates/dungeon_cave_map.png' },
    
    // === BIOMI / BATTAGLIA (19) ===
    { id: 'forest', name: 'Foresta', description: 'Alberi, sentiero, erba', type: 'other', category: 'Biomi', image: 'assets/maps/ai-templates/forest_map.png' },
    { id: 'forest_autumn', name: 'Foresta Autunnale', description: 'Foglie rosse e arancioni', type: 'other', category: 'Biomi', image: 'assets/maps/ai-templates/forest_autumn_map.png' },
    { id: 'forest_night', name: 'Foresta Notturna', description: 'Luna, nebbia, funghi bioluminescenti', type: 'other', category: 'Biomi', image: 'assets/maps/ai-templates/forest_night_map.png' },
    { id: 'swamp', name: 'Palude', description: 'Acque torbide, alberi morti', type: 'other', category: 'Biomi', image: 'assets/maps/ai-templates/swamp_map.png' },
    { id: 'swamp_misty', name: 'Palude Nebbiosa', description: 'Fitta nebbia, alberi morti', type: 'other', category: 'Biomi', image: 'assets/maps/ai-templates/swamp_misty_map.png' },
    { id: 'desert', name: 'Deserto', description: 'Dune di sabbia, rocce, ossa', type: 'other', category: 'Biomi', image: 'assets/maps/ai-templates/desert_map.png' },
    { id: 'desert_oasis', name: 'Oasi', description: 'Palme, pozza d\'acqua, rocce', type: 'other', category: 'Biomi', image: 'assets/maps/ai-templates/desert_oasis_map.png' },
    { id: 'mountain', name: 'Passo Montano', description: 'Rocce, dirupi, massi', type: 'other', category: 'Biomi', image: 'assets/maps/ai-templates/mountain_map.png' },
    { id: 'mountain_snow', name: 'Montagna Innevata', description: 'Picchi nevosi, dirupi di ghiaccio', type: 'other', category: 'Biomi', image: 'assets/maps/ai-templates/mountain_snow_map.png' },
    { id: 'tundra', name: 'Tundra', description: 'Pianure nevose, alberi morti, ghiaccio', type: 'other', category: 'Biomi', image: 'assets/maps/ai-templates/tundra_map.png' },
    
    { id: 'battle_arena', name: 'Arena', description: 'Pavimento di sabbia, gradinate', type: 'other', category: 'Battaglia', image: 'assets/maps/ai-templates/battle_arena_map.png' },
    { id: 'battle_field', name: 'Campo Aperto', description: 'Erba, fiori, alberi, colline', type: 'other', category: 'Battaglia', image: 'assets/maps/ai-templates/battle_field_map.png' },
    { id: 'battle_bridge', name: 'Ponte', description: 'Ponte di pietra su fiume, dirupi', type: 'other', category: 'Battaglia', image: 'assets/maps/ai-templates/battle_bridge_map.png' },
    { id: 'battle_pass', name: 'Passo Stretto', description: 'Sentiero tra dirupi, rocce', type: 'other', category: 'Battaglia', image: 'assets/maps/ai-templates/battle_pass_map.png' },
    { id: 'battle_river', name: 'Guado Fiume', description: 'Guado poco profondo, rocce, rive', type: 'other', category: 'Battaglia', image: 'assets/maps/ai-templates/battle_river_map.png' },
    { id: 'battle_cliff', name: 'Dirupo', description: 'Strapiombo, massi, vegetazione', type: 'other', category: 'Battaglia', image: 'assets/maps/ai-templates/battle_cliff_map.png' },
    { id: 'battle_ruins', name: 'Rovine All\'Aperto', description: 'Colonne crollate, statue, erba', type: 'other', category: 'Battaglia', image: 'assets/maps/ai-templates/battle_ruins_map.png' },
    { id: 'battle_clearing', name: 'Radura', description: 'Area aperta tra alberi, ruscello', type: 'other', category: 'Battaglia', image: 'assets/maps/ai-templates/battle_clearing_map.png' },
];

/**
 * Ottiene le categorie uniche dei template.
 * @returns {Array} Array di stringhe categoria
 */
export function getTemplateCategories() {
    return [...new Set(MAP_TEMPLATES.map(t => t.category))];
}

/**
 * Filtra i template per categoria.
 * @param {string} category - Categoria da filtrare (null = tutti)
 * @returns {Array} Template filtrati
 */
export function getTemplatesByCategory(category) {
    if (!category || category === 'Tutti') return MAP_TEMPLATES;
    return MAP_TEMPLATES.filter(t => t.category === category);
}

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

console.log('🗺️ [MapTemplates] Registry caricato:', MAP_TEMPLATES.length, 'template in', getTemplateCategories().length, 'categorie');
