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
    
    const itemCategory = (item.equipment_category?.index || item.equipment_category?.name || item.category || '').toLowerCase();
    const itemName = (item.name || '').toLowerCase();
    
    // === ARMI ===
    if (itemCategory === 'weapon' || item.weapon_category) {
        // Slot che accettano armi
        if (!slot.acceptedCategories.includes('weapon')) {
            return false;
        }
        
        // mainHand accetta tutte le armi
        if (slotId === 'mainHand') {
            return true;
        }
        
        // offHand accetta solo armi leggere/semplici o scudi
        if (slotId === 'offHand') {
            // Scudi
            if (itemName.includes('scudo') || itemName.includes('shield')) {
                return true;
            }
            // Armi semplici (considerate leggere)
            if (item.weapon_category === 'Semplice') {
                return true;
            }
            // Armi con proprietà "light" o "leggera"
            const hasLightProperty = (item.properties || []).some(p => {
                const propName = (p.name || p || '').toLowerCase();
                return propName === 'light' || propName === 'leggera';
            });
            if (hasLightProperty) {
                return true;
            }
            return false;
        }
        
        return false;
    }
    
    // === ARMATURE ===
    if (itemCategory === 'armor' || item.armor_category) {
        if (!slot.acceptedCategories.includes('armor')) {
            return false;
        }
        
        // Scudi vanno in mainHand o offHand
        if (itemName.includes('scudo') || itemName.includes('shield') || 
            item.armor_category?.toLowerCase().includes('scudo')) {
            return slotId === 'mainHand' || slotId === 'offHand';
        }
        
        // Armature corpo
        if (item.armor_class && !itemName.includes('scudo') && !itemName.includes('shield')) {
            return slotId === 'body';
        }
        
        // Altri tipi di armatura per slot specifici
        const armorType = (item.armor_category || '').toLowerCase();
        if (armorType.includes('elmo') || armorType.includes('helm') || itemName.includes('elmo') || itemName.includes('helm')) {
            return slotId === 'head';
        }
        if (armorType.includes('guanto') || armorType.includes('gauntlet') || itemName.includes('guanto') || itemName.includes('gauntlet')) {
            return slotId === 'hands';
        }
        if (armorType.includes('stivali') || armorType.includes('boots') || itemName.includes('stivali') || itemName.includes('boots')) {
            return slotId === 'feet';
        }
        
        // Default per armature non specificate: body
        return slotId === 'body';
    }
    
    // === OGGETTI MAGICI / MERAVIGLIOSI ===
    if (itemCategory === 'wondrous-item' || itemCategory === 'wondrous items' || item.rarity || item.isMagical) {
        if (!slot.acceptedCategories.includes('magic-item') && !slot.acceptedCategories.includes('armor')) {
            return false;
        }
        
        // Anelli
        if (itemName.includes('anello') || itemName.includes('ring')) {
            return slotId === 'ringLeft' || slotId === 'ringRight';
        }
        
        // Amuleti/Collane
        if (itemName.includes('amuleto') || itemName.includes('amulet') || 
            itemName.includes('collana') || itemName.includes('necklace') ||
            itemName.includes('pendant') || itemName.includes('ciondolo')) {
            return slotId === 'neck';
        }
        
        // Cinture
        if (itemName.includes('cintura') || itemName.includes('cinturone') || 
            itemName.includes('belt') || itemName.includes('girdle')) {
            return slotId === 'belt';
        }
        
        // Mantelli
        if (itemName.includes('mantello') || itemName.includes('mantellina') || 
            itemName.includes('cappa') || itemName.includes('cloak') || 
            itemName.includes('cape') || itemName.includes('mantle')) {
            return slotId === 'cloak';
        }
        
        // Stivali
        if (itemName.includes('stivali') || itemName.includes('stivale') || 
            itemName.includes('boots') || itemName.includes('boot') ||
            itemName.includes('shoes') || itemName.includes('sandali')) {
            return slotId === 'feet';
        }
        
        // Guanti
        if (itemName.includes('guanto') || itemName.includes('guanti') || 
            itemName.includes('glove') || itemName.includes('gauntlet') ||
            itemName.includes('bracers') || itemName.includes('bracciali')) {
            return slotId === 'hands';
        }
        
        // Elmi/Corone
        if (itemName.includes('elmo') || itemName.includes('elmetto') || 
            itemName.includes('corona') || itemName.includes('helm') || 
            itemName.includes('helmet') || itemName.includes('crown') ||
            itemName.includes('circlet') || itemName.includes('diadem')) {
            return slotId === 'head';
        }
        
        // Maschere
        if (itemName.includes('maschera') || itemName.includes('mask')) {
            return slotId === 'head';
        }
        
        // Bracciali
        if (itemName.includes('bracciale') || itemName.includes('braccialetto') ||
            itemName.includes('bracelet') || itemName.includes('armband')) {
            return slotId === 'hands';
        }
        
        // Occhiali/Lenti
        if (itemName.includes('occhiali') || itemName.includes('lenti') ||
            itemName.includes('goggles') || itemName.includes('glasses')) {
            return slotId === 'head';
        }
        
        // Default per oggetti magici non identificati: controlla se la descrizione menziona "indossi"
        const desc = Array.isArray(item.desc) ? item.desc.join(' ').toLowerCase() : (item.desc || '').toLowerCase();
        if (desc.includes('indossi') || desc.includes('mentre indoss') || desc.includes('while wearing')) {
            // Prova a dedurre dal tipo di oggetto
            return false; // Non possiamo determinare lo slot
        }
        
        return false;
    }
    
    // Categoria non riconosciuta
    return false;
}

export default SLOT_TYPES;
