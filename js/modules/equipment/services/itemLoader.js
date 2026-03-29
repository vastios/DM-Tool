/**
 * itemLoader.js
 * ─────────────────────────────────────────────────────────────
 * Servizio per caricare e unificare oggetti da tutte le fonti:
 * - Database oggetti standard (items.js)
 * - Database oggetti magici (magicItems.js)
 * - Oggetti unici creati dall'utente
 * 
 * @version 1.0.0
 */

import { itemDatabase } from '../../../../database/items.js';
import { magicItemsDatabase } from '../../../../database/magicItems.js';

// Cache per performance
let cachedAllItems = null;
let cachedWeapons = null;
let cachedArmor = null;
let cachedMagicItems = null;
let cachedUniqueItems = null;

/**
 * Fonti dati disponibili
 */
export const DATA_SOURCES = {
    STANDARD: 'standard',      // Database SRD
    MAGIC: 'magic',           // Oggetti magici SRD
    UNIQUE: 'unique'          // Oggetti personalizzati
};

/**
 * Carica tutti gli oggetti unici della campagna corrente
 * @returns {Array} Lista oggetti unici
 */
function loadUniqueItems() {
    if (cachedUniqueItems !== null) {
        return cachedUniqueItems;
    }
    
    try {
        // La chiave di storage dipende dalla campagna
        const campaignId = localStorage.getItem('currentCampaignId');
        if (!campaignId) {
            return [];
        }
        
        const storageKey = `dungeonMasterToolUniqueItems_${campaignId}`;
        const data = localStorage.getItem(storageKey);
        
        cachedUniqueItems = data ? JSON.parse(data) : [];
        return cachedUniqueItems;
    } catch (e) {
        console.error('Errore caricamento oggetti unici:', e);
        return [];
    }
}

/**
 * Invalida la cache (chiamare quando cambiano i dati)
 */
export function invalidateCache() {
    cachedAllItems = null;
    cachedWeapons = null;
    cachedArmor = null;
    cachedMagicItems = null;
    cachedUniqueItems = null;
}

/**
 * Ottiene tutti gli oggetti da tutte le fonti
 * @param {boolean} forceRefresh - Forza refresh della cache
 * @returns {Array} Tutti gli oggetti
 */
export function getAllItems(forceRefresh = false) {
    if (!forceRefresh && cachedAllItems !== null) {
        return cachedAllItems;
    }
    
    const items = [];
    
    // Aggiungi oggetti standard
    if (itemDatabase && Array.isArray(itemDatabase)) {
        itemDatabase.forEach(item => {
            items.push({
                ...item,
                source: DATA_SOURCES.STANDARD,
                sourceType: 'standard'
            });
        });
    }
    
    // Aggiungi oggetti magici
    if (magicItemsDatabase && Array.isArray(magicItemsDatabase)) {
        magicItemsDatabase.forEach(item => {
            items.push({
                ...item,
                source: DATA_SOURCES.MAGIC,
                sourceType: 'magic',
                isMagical: true
            });
        });
    }
    
    // Aggiungi oggetti unici
    const uniqueItems = loadUniqueItems();
    uniqueItems.forEach(item => {
        items.push({
            ...item,
            source: DATA_SOURCES.UNIQUE,
            sourceType: 'unique'
        });
    });
    
    cachedAllItems = items;
    return items;
}

/**
 * Ottiene tutte le armi
 * @returns {Array} Lista armi
 */
export function getWeapons() {
    if (cachedWeapons !== null) {
        return cachedWeapons;
    }
    
    const allItems = getAllItems();
    cachedWeapons = allItems.filter(item => 
        item.equipment_category?.index === 'weapon' ||
        item.equipment_category?.name === 'Arma' ||
        item.type === 'Arma'
    );
    
    return cachedWeapons;
}

/**
 * Ottiene tutte le armature
 * @returns {Array} Lista armature
 */
export function getArmor() {
    if (cachedArmor !== null) {
        return cachedArmor;
    }
    
    const allItems = getAllItems();
    cachedArmor = allItems.filter(item => 
        item.equipment_category?.index === 'armor' ||
        item.equipment_category?.name === 'Armatura' ||
        item.type === 'Armatura' ||
        item.type === 'Scudo'
    );
    
    return cachedArmor;
}

/**
 * Ottiene tutti gli oggetti magici
 * @returns {Array} Lista oggetti magici
 */
export function getMagicItems() {
    if (cachedMagicItems !== null) {
        return cachedMagicItems;
    }
    
    const allItems = getAllItems();
    cachedMagicItems = allItems.filter(item => 
        item.source === DATA_SOURCES.MAGIC ||
        item.isMagical === true ||
        item.rarity !== undefined
    );
    
    return cachedMagicItems;
}

/**
 * Cerca un oggetto per index o ID
 * @param {string} index - L'index dell'oggetto
 * @returns {Object|null} L'oggetto trovato o null
 */
export function getItemByIndex(index) {
    const allItems = getAllItems();
    return allItems.find(item => 
        item.index === index || 
        item.id === index ||
        item.name?.toLowerCase() === index?.toLowerCase()
    ) || null;
}

/**
 * Cerca oggetti per nome (ricerca parziale)
 * @param {string} query - Query di ricerca
 * @param {Object} options - Opzioni di ricerca
 * @returns {Array} Oggetti trovati
 */
export function searchItems(query, options = {}) {
    const {
        category = null,        // Filtra per categoria
        type = null,            // Filtra per tipo
        rarity = null,          // Filtra per rarità
        source = null,          // Filtra per fonte
        limit = 50              // Limite risultati
    } = options;
    
    const allItems = getAllItems();
    const queryLower = query?.toLowerCase() || '';
    
    let results = allItems.filter(item => {
        // Filtro per nome
        const nameMatch = !query || 
            item.name?.toLowerCase().includes(queryLower);
        
        // Filtro per categoria
        const categoryMatch = !category || 
            item.equipment_category?.index === category ||
            item.equipment_category?.name === category ||
            item.category === category;
        
        // Filtro per tipo
        const typeMatch = !type ||
            item.weapon_category === type ||
            item.armor_category === type ||
            item.type === type;
        
        // Filtro per rarità
        const rarityMatch = !rarity ||
            item.rarity?.name === rarity;
        
        // Filtro per fonte
        const sourceMatch = !source ||
            item.source === source;
        
        return nameMatch && categoryMatch && typeMatch && rarityMatch && sourceMatch;
    });
    
    return results.slice(0, limit);
}

/**
 * Ottiene le categorie di equipaggiamento disponibili
 * @returns {Array} Lista categorie
 */
export function getEquipmentCategories() {
    return [
        { index: 'weapon', name: 'Armi' },
        { index: 'armor', name: 'Armature' },
        { index: 'adventuring-gear', name: 'Equipaggiamento da Avventura' },
        { index: 'tools', name: 'Strumenti' },
        { index: 'mounts-and-vehicles', name: 'Cavalcature e Veicoli' },
        { index: 'wondrous-item', name: 'Oggetti Meravigliosi' }
    ];
}

/**
 * Ottiene le rarità degli oggetti magici
 * @returns {Array} Lista rarità
 */
export function getRarities() {
    return [
        'Comune',
        'Non Comune',
        'Rara',
        'Molto Rara',
        'Leggendaria',
        'Artefatto'
    ];
}

/**
 * Determina il tipo di slot per un oggetto
 * @param {Object} item - L'oggetto
 * @returns {Array} Lista di slot compatibili
 */
export function getCompatibleSlotsForItem(item) {
    const slots = [];
    
    const category = item.equipment_category?.index || item.equipment_category?.name?.toLowerCase();
    
    // Armi
    if (category === 'weapon' || item.weapon_category) {
        slots.push('mainHand');
        
        // Armi leggere possono andare in offHand
        const isLight = item.properties?.some(p => 
            (p.name || p).toLowerCase() === 'light' ||
            (p.name || p).toLowerCase() === 'leggera'
        );
        if (isLight || item.weapon_category === 'Semplice') {
            slots.push('offHand');
        }
    }
    
    // Armature
    if (category === 'armor' || item.armor_category) {
        // Scudi
        if (item.armor_category?.toLowerCase().includes('scudo') ||
            item.name?.toLowerCase().includes('scudo') ||
            item.equipment_category?.index === 'shield') {
            slots.push('mainHand', 'offHand');
        } else {
            // Armature vere e proprie
            slots.push('body');
        }
    }
    
    // Oggetti meravigliosi - dipende dal tipo
    if (category === 'wondrous-item' || category === 'wondrous items' || item.rarity) {
        const nameLower = item.name?.toLowerCase() || '';
        
        if (nameLower.includes('anello') || nameLower.includes('ring')) {
            slots.push('ringLeft', 'ringRight');
        } else if (nameLower.includes('amuleto') || nameLower.includes('collana') || 
                   nameLower.includes('amulet') || nameLower.includes('necklace')) {
            slots.push('neck');
        } else if (nameLower.includes('stivali') || nameLower.includes('stivale') ||
                   nameLower.includes('boots') || nameLower.includes('boot')) {
            slots.push('feet');
        } else if (nameLower.includes('cintura') || nameLower.includes('cinturone') ||
                   nameLower.includes('belt') || nameLower.includes('girdle')) {
            slots.push('belt');
        } else if (nameLower.includes('guanto') || nameLower.includes('guanti') ||
                   nameLower.includes('glove') || nameLower.includes('gauntlet')) {
            slots.push('hands');
        } else if (nameLower.includes('mantello') || nameLower.includes('cappa') ||
                   nameLower.includes('cloak') || nameLower.includes('cape')) {
            slots.push('cloak');
        } else if (nameLower.includes('elmo') || nameLower.includes('corona') ||
                   nameLower.includes('helm') || nameLower.includes('crown')) {
            slots.push('head');
        } else {
            // Default per oggetti meravigliosi non identificati
            slots.push('neck', 'belt', 'hands');
        }
    }
    
    return [...new Set(slots)]; // Rimuovi duplicati
}

/**
 * Verifica se un oggetto richiede attunement
 * @param {Object} item - L'oggetto
 * @returns {boolean}
 */
export function itemRequiresAttunement(item) {
    if (item.requires_attunement) return true;
    
    const desc = (item.desc || []).join(' ').toLowerCase();
    return desc.includes('richiede sintonizzazione') || 
           desc.includes('requires attunement');
}

/**
 * Ottiene il peso totale di una lista di oggetti
 * @param {Array} items - Lista oggetti con quantità
 * @returns {number} Peso totale
 */
export function calculateTotalWeight(items) {
    if (!Array.isArray(items)) return 0;
    
    return items.reduce((total, invItem) => {
        const itemData = typeof invItem === 'string' 
            ? getItemByIndex(invItem) 
            : invItem;
        
        if (!itemData) return total;
        
        const weight = itemData.weight || 0;
        const quantity = invItem.quantity || 1;
        
        return total + (weight * quantity);
    }, 0);
}

/**
 * Formatta il peso per la visualizzazione
 * @param {number} weight - Peso in libbre
 * @returns {string} Peso formattato
 */
export function formatWeight(weight) {
    if (!weight || weight === 0) return '0 lb';
    if (weight < 1) return `${(weight * 16).toFixed(0)} oz`;
    return `${weight.toFixed(1)} lb`;
}

/**
 * Formatta il costo per la visualizzazione
 * @param {Object} cost - Oggetto costo { quantity, unit }
 * @returns {string} Costo formattato
 */
export function formatCost(cost) {
    if (!cost) return 'N/D';
    
    const { quantity, unit } = cost;
    const unitLabels = {
        'mo': 'mo',
        'ma': 'ma', 
        'mr': 'mr'
    };
    
    return `${quantity} ${unitLabels[unit] || unit}`;
}

/**
 * ==========================================================================
 * FUNZIONI PER DETERMINARE SE UN OGGETTO È EQUIPAGGIABILE
 * ==========================================================================
 */

/**
 * Categorie di oggetti che sono SEMPRE equipaggiabili
 */
const EQUIPPABLE_CATEGORIES = ['weapon', 'armor'];

/**
 * Categorie di oggetti che NON sono MAI equipaggiabili
 */
const NON_EQUIPPABLE_CATEGORIES = [
    'adventuring-gear',
    'tools',
    'mounts-and-vehicles',
    'ammunition',
    'equipment-packs'
];

/**
 * Parole chiave per oggetti meravigliosi INDOSSABILI
 * Questi oggetti possono essere equipaggiati in uno slot del corpo
 */
const WONDROUS_WEARABLE_KEYWORDS = [
    // Anelli
    'anello', 'ring',
    // Amuleti/Collane
    'amuleto', 'amulet', 'collana', 'necklace', 'pendant', 'ciondolo',
    // Cinture
    'cintura', 'cinturone', 'belt', 'girdle', 'sash',
    // Mantelli/Cappe
    'mantello', 'mantellina', 'cappa', 'cloak', 'cape', 'mantle',
    // Stivali/Calzature
    'stivali', 'stivale', 'stiv', 'boots', 'boot', 'shoes', 'sandals', 'sandali',
    // Guanti
    'guanto', 'guanti', 'glove', 'gauntlet', 'bracers', 'bracciali',
    // Elmi/Corone
    'elmo', 'elmetto', 'corona', 'coroncina', 'helm', 'helmet', 'crown', 'circlet', 'diadem',
    // Bracciali (per slot hands)
    'bracciale', 'braccialetto', 'bracelet', 'armband',
    // Maschere (per slot head)
    'maschera', 'mask',
    // Occhiali/Lenti (per slot head o neck)
    'occhiali', 'lenti', 'goggles', 'glasses', 'spectacles'
];

/**
 * Parole chiave per oggetti meravigliosi NON indossabili
 * Questi oggetti non possono essere equipaggiati in uno slot del corpo
 */
const WONDROUS_NON_WEARABLE_KEYWORDS = [
    // Contenitori
    'borsa', 'sacco', 'zaino', 'bag', 'sack', 'pouch', 'pack', 'holding',
    // Libri/Documenti
    'libro', 'tomo', 'pergamena', 'scroll', 'book', 'tome', 'manual', 'grimorie',
    // Pozioni/Fluidi
    'pozione', 'fiala', 'ampolla', 'flask', 'potion', 'vial', 'philter', 'elixir',
    // Sfere/Oggetti tenuti in mano ma non indossati
    'sfera', 'orb', 'sphere', 'crystal', 'cristallo',
    // Bacchette/Verghe
    'bacchetta', 'verga', 'wand', 'rod', 'staff', 'bastone',
    // Pietre/Gemme (non montate)
    'pietra', 'gemma', 'stone', 'gem', 'jewel', 'iol', 'perla', 'pearl',
    // Strumenti (non indossati)
    'strumento', 'lente', 'strument', 'tool', 'compass',
    // Oggetti vari non indossabili
    'tappeto', 'carpet', 'nave', 'ship', 'botta', 'tent', 'tenda',
    'fagioli', 'beans', 'cubo', 'cube', 'scatola', 'box',
    'clessidra', 'hourglass', 'moneta', 'coin', 'token', 'gettone',
    'fischietto', 'whistle', 'campana', 'bell', 'corno', 'horn',
    'balestra', 'ballista', 'macchina', 'machine', 'apparatus'
];

/**
 * Verifica se un oggetto è equipaggiabile
 * Un oggetto è equipaggiabile se:
 * 1. È un'arma (weapon)
 * 2. È un'armatura (armor)
 * 3. È un oggetto meraviglioso INDOS ABILE (anelli, amuleti, cinture, ecc.)
 * 
 * @param {Object} item - L'oggetto da verificare
 * @returns {boolean} True se l'oggetto può essere equipaggiato
 */
export function isItemEquippable(item) {
    if (!item) return false;
    
    const category = item.equipment_category?.index || item.equipment_category?.name?.toLowerCase() || '';
    const name = item.name?.toLowerCase() || '';
    
    // 1. Armi e armature sono sempre equipaggiabili
    if (EQUIPPABLE_CATEGORIES.includes(category)) {
        return true;
    }
    
    // 2. Categorie non equipaggiabili
    if (NON_EQUIPPABLE_CATEGORIES.some(cat => category.includes(cat))) {
        return false;
    }
    
    // 3. Oggetti meravigliosi - verifica se indossabili
    if (category === 'wondrous-item' || category === 'wondrous items' || item.rarity || item.isMagical) {
        // Prima controlla se è esplicitamente NON indossabile
        for (const keyword of WONDROUS_NON_WEARABLE_KEYWORDS) {
            if (name.includes(keyword)) {
                return false;
            }
        }
        
        // Poi controlla se è esplicitamente indossabile
        for (const keyword of WONDROUS_WEARABLE_KEYWORDS) {
            if (name.includes(keyword)) {
                return true;
            }
        }
        
        // Se ha la proprietà "desc" che menziona "indossi" o "while wearing", è equipaggiabile
        const desc = Array.isArray(item.desc) ? item.desc.join(' ').toLowerCase() : (item.desc || '').toLowerCase();
        if (desc.includes('indossi') || desc.includes('indossando') || 
            desc.includes('while wearing') || desc.includes('worn') ||
            desc.includes('mentre indoss') || desc.includes('quando indoss')) {
            return true;
        }
        
        // Default per oggetti magici senza chiare indicazioni: NON equipaggiabile
        return false;
    }
    
    // Default: non equipaggiabile
    return false;
}

/**
 * Ottiene gli slot compatibili per un oggetto equipaggiabile
 * Restituisce un array di ID slot compatibili
 * 
 * @param {Object} item - L'oggetto
 * @returns {Array} Array di ID slot compatibili (vuoto se non equipaggiabile)
 */
export function getEquippableSlots(item) {
    if (!isItemEquippable(item)) {
        return [];
    }
    
    return getCompatibleSlotsForItem(item);
}

export default {
    getAllItems,
    getWeapons,
    getArmor,
    getMagicItems,
    getItemByIndex,
    searchItems,
    getEquipmentCategories,
    getRarities,
    getCompatibleSlotsForItem,
    itemRequiresAttunement,
    calculateTotalWeight,
    formatWeight,
    formatCost,
    isItemEquippable,
    getEquippableSlots,
    invalidateCache,
    DATA_SOURCES
};
