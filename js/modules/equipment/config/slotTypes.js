/**
 * slotTypes.js
 * ─────────────────────────────────────────────────────────────
 * Definizione degli slot equipaggiamento per il body system.
 * Ogni slot rappresenta una parte del corpo dove equipaggiare oggetti.
 * 
 * @version 1.0.0
 */

/**
 * Definizione completa degli slot del corpo.
 * Ogni slot ha:
 * - id: identificatore univoco
 * - name: nome visualizzato
 * - position: coordinate per il render SVG/visuale
 * - icon: emoji/icona rappresentativa
 * - acceptedCategories: categorie di oggetti accettate
 * - acceptedTypes: tipi specifici (opzionale, per filtro ulteriore)
 * - maxItems: numero massimo di oggetti nello slot (default 1)
 * - description: descrizione breve
 */
export const SLOT_TYPES = {
    // === TESTA ===
    head: {
        id: 'head',
        name: 'Testa',
        icon: '🎩',
        position: { x: 50, y: 5 },  // Percentuali relative al contenitore
        acceptedCategories: ['armor'],  // Armature (elmi)
        acceptedTypes: ['Helmet', 'Hat', 'Crown', 'Circlet', 'Helm'],
        description: 'Elmi, corone, cappelli e copricapi',
        maxItems: 1
    },
    
    // === COLLO ===
    neck: {
        id: 'neck',
        name: 'Collo',
        icon: '📿',
        position: { x: 50, y: 18 },
        acceptedCategories: ['armor', 'magic-item'],
        acceptedTypes: ['Amulet', 'Necklace', 'Pendant', 'Cloak', 'Cape', 'Mantle'],
        description: 'Amuleti, collane e mantelli',
        maxItems: 1
    },
    
    // === CORPO ===
    body: {
        id: 'body',
        name: 'Corpo',
        icon: '👕',
        position: { x: 50, y: 35 },
        acceptedCategories: ['armor'],
        acceptedTypes: ['Light Armor', 'Medium Armor', 'Heavy Armor', 'Clothing', 'Robe', 'Vestment'],
        acceptedArmorCategories: ['Leggera', 'Media', 'Pesante'],
        description: 'Armature e vesti',
        maxItems: 1
    },
    
    // === MANO PRIMARIA ===
    mainHand: {
        id: 'mainHand',
        name: 'Mano Primaria',
        icon: '🗡️',
        position: { x: 25, y: 50 },
        acceptedCategories: ['weapon', 'armor'],
        acceptedTypes: ['Melee', 'Ranged', 'Shield'],
        acceptedWeaponCategories: ['Semplice', 'Marziale'],
        description: 'Armi e scudi',
        maxItems: 1
    },
    
    // === MANO SECONDARIA ===
    offHand: {
        id: 'offHand',
        name: 'Mano Secondaria',
        icon: '🛡️',
        position: { x: 75, y: 50 },
        acceptedCategories: ['weapon', 'armor'],
        acceptedTypes: ['Melee', 'Shield', 'Light'],
        acceptedWeaponCategories: ['Semplice'],
        description: 'Armi leggere e scudi',
        maxItems: 1
    },
    
    // === ANELLO SINISTRO ===
    ringLeft: {
        id: 'ringLeft',
        name: 'Anello Sinistro',
        icon: '💍',
        position: { x: 20, y: 65 },
        acceptedCategories: ['magic-item'],
        acceptedTypes: ['Ring'],
        description: 'Anelli magici',
        maxItems: 1
    },
    
    // === ANELLO DESTRO ===
    ringRight: {
        id: 'ringRight',
        name: 'Anello Destro',
        icon: '💍',
        position: { x: 80, y: 65 },
        acceptedCategories: ['magic-item'],
        acceptedTypes: ['Ring'],
        description: 'Anelli magici',
        maxItems: 1
    },
    
    // === STIVALI ===
    feet: {
        id: 'feet',
        name: 'Piedi',
        icon: '👢',
        position: { x: 50, y: 80 },
        acceptedCategories: ['armor', 'magic-item'],
        acceptedTypes: ['Boots', 'Shoes', 'Greaves', 'Sabatons'],
        description: 'Stivali e calzature',
        maxItems: 1
    },
    
    // === CINTURA ===
    belt: {
        id: 'belt',
        name: 'Cintura',
        icon: '🔗',
        position: { x: 50, y: 52 },
        acceptedCategories: ['magic-item'],
        acceptedTypes: ['Belt', 'Girdle', 'Sash'],
        description: 'Cinture e cinturoni',
        maxItems: 1
    },
    
    // === MANI (guanti) ===
    hands: {
        id: 'hands',
        name: 'Mani',
        icon: '🧤',
        position: { x: 50, y: 48 },
        acceptedCategories: ['armor', 'magic-item'],
        acceptedTypes: ['Gloves', 'Gauntlets', 'Bracers'],
        description: 'Guanti e bracciali',
        maxItems: 1
    },
    
    // === MANTELLO (separato dal collo) ===
    cloak: {
        id: 'cloak',
        name: 'Mantello',
        icon: '🧥',
        position: { x: 85, y: 35 },
        acceptedCategories: ['armor', 'magic-item'],
        acceptedTypes: ['Cloak', 'Cape', 'Mantle', 'Wings'],
        description: 'Mantelli e cappe',
        maxItems: 1
    }
};

/**
 * Slot che richiedono attunement speciale
 */
export const ATTUNEMENT_SLOTS = ['ringLeft', 'ringRight', 'neck', 'head', 'belt', 'cloak', 'hands', 'feet'];

/**
 * Slot per armi (per calcoli combat)
 */
export const WEAPON_SLOTS = ['mainHand', 'offHand'];

/**
 * Slot per armature (per calcolo CA)
 */
export const ARMOR_SLOTS = ['body', 'mainHand', 'offHand'];  // offHand per scudi

/**
 * Mappatura categorie equipment dal database ai nostri slot
 */
export const EQUIPMENT_CATEGORY_TO_SLOT = {
    // Armature
    'armor': ['body', 'head', 'hands', 'feet'],
    'Armor': ['body'],
    
    // Armi
    'weapon': ['mainHand', 'offHand'],
    'Weapon': ['mainHand', 'offHand'],
    
    // Scudi
    'shield': ['mainHand', 'offHand'],
    'Shield': ['mainHand', 'offHand'],
    
    // Oggetti magici - dipende dal tipo
    'magic-item': ['head', 'neck', 'ringLeft', 'ringRight', 'belt', 'hands', 'feet', 'cloak'],
    'Wondrous Item': ['head', 'neck', 'ringLeft', 'ringRight', 'belt', 'hands', 'feet', 'cloak']
};

/**
 * Raggruppamento visuale degli slot per il render
 */
export const SLOT_GROUPS = {
    head: {
        name: 'Testa',
        slots: ['head'],
        region: { x: 35, y: 0, width: 30, height: 15 }
    },
    neck: {
        name: 'Collo',
        slots: ['neck'],
        region: { x: 35, y: 15, width: 30, height: 10 }
    },
    torso: {
        name: 'Torso',
        slots: ['body', 'belt', 'cloak'],
        region: { x: 25, y: 25, width: 50, height: 30 }
    },
    hands: {
        name: 'Mani',
        slots: ['mainHand', 'offHand', 'hands'],
        region: { x: 15, y: 40, width: 70, height: 25 }
    },
    rings: {
        name: 'Anelli',
        slots: ['ringLeft', 'ringRight'],
        region: { x: 10, y: 60, width: 80, height: 15 }
    },
    feet: {
        name: 'Piedi',
        slots: ['feet'],
        region: { x: 35, y: 75, width: 30, height: 20 }
    }
};

/**
 * Ottiene la definizione di uno slot dal suo ID
 * @param {string} slotId - ID dello slot
 * @returns {Object|null} Definizione dello slot
 */
export function getSlotDefinition(slotId) {
    return SLOT_TYPES[slotId] || null;
}

/**
 * Ottiene tutti gli slot che accettano una certa categoria
 * @param {string} category - Categoria dell'oggetto
 * @returns {Array} Lista di ID slot compatibili
 */
export function getCompatibleSlots(category) {
    return EQUIPMENT_CATEGORY_TO_SLOT[category] || [];
}

/**
 * Verifica se uno slot accetta un certo tipo di oggetto
 * @param {string} slotId - ID dello slot
 * @param {Object} item - Oggetto da verificare
 * @returns {boolean} True se compatibile
 */
export function isItemCompatibleWithSlot(slotId, item) {
    const slot = getSlotDefinition(slotId);
    if (!slot) return false;
    
    // Controlla categoria
    const itemCategory = item.equipment_category?.name || item.equipment_category?.index || item.category;
    const categoryMatch = slot.acceptedCategories.some(cat => 
        cat.toLowerCase() === (itemCategory || '').toLowerCase()
    );
    
    if (!categoryMatch) return false;
    
    // Controlla tipo se definito
    if (slot.acceptedTypes && slot.acceptedTypes.length > 0) {
        const itemType = item.type || item.weapon_category || item.armor_category;
        const typeMatch = slot.acceptedTypes.some(t => 
            t.toLowerCase() === (itemType || '').toLowerCase()
        );
        if (!typeMatch) {
            // Fallback: accetta se categoria matcha e tipo non è restrittivo
            return false;
        }
    }
    
    return true;
}

export default SLOT_TYPES;
