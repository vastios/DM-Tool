/**
 * magicEquipmentCreator.js
 * ─────────────────────────────────────────────────────────────
 * Servizio per creare oggetti magici potenziati.
 * Permette di selezionare un'arma/armatura/scudo base e applicare
 * un bonus magico (+1, +2, +3) con dati strutturati.
 * 
 * @version 1.0.0
 */

import { getWeapons, getArmor, getItemByIndex } from './itemLoader.js';

/**
 * Mappa bonus -> rarita (D&D 5e SRD)
 */
const BONUS_RARITY = {
    1: 'Non Comune',
    2: 'Rara',
    3: 'Molto Rara'
};

/**
 * Categorie di equipaggiamento potenziabile
 */
export const ENHANCEABLE_CATEGORIES = {
    weapon: {
        id: 'weapon',
        name: 'Arma',
        icon: '⚔️',
        bonusType: 'attack+damage',
        description: 'Bonus al tiro per colpire e al danno'
    },
    armor: {
        id: 'armor',
        name: 'Armatura',
        icon: '🦺',
        bonusType: 'armorClass',
        description: 'Bonus alla Classe Armatura'
    },
    shield: {
        id: 'shield',
        name: 'Scudo',
        icon: '🛡️',
        bonusType: 'armorClass',
        description: 'Bonus alla Classe Armatura'
    }
};

/**
 * Ottiene la lista di armi base disponibili per il potenziamento
 * @returns {Array} Lista armi filtrate (solo armi vere, non balestre/munizioni)
 */
export function getEnhanceableWeapons() {
    const allWeapons = getWeapons();
    // Filtra per armi vere (esclude munizioni, balestre leggere/a mano/pesanti se voluto)
    return allWeapons.filter(w => {
        const range = w.weapon_range || w.category_range || '';
        const name = (w.name || '').toLowerCase();
        // Escludi rete (ha danni particolari)
        if (name.includes('rete') || name.includes('net')) return false;
        return true;
    }).map(w => ({
        index: w.index,
        name: w.name,
        category: w.weapon_category || 'Semplice',
        range: w.weapon_range || 'Mischia',
        damage: w.damage?.damage_dice || '-',
        damageType: w.damage?.damage_type?.name || '-',
        properties: (w.properties || []).map(p => p.name || p).filter(Boolean)
    }));
}

/**
 * Ottiene la lista di armature base disponibili per il potenziamento
 * @returns {Array} Lista armature (esclude scudi)
 */
export function getEnhanceableArmor() {
    const allArmor = getArmor();
    return allArmor.filter(a => {
        const name = (a.name || '').toLowerCase();
        const cat = (a.armor_category || '').toLowerCase();
        // Escludi scudi
        if (cat.includes('scudo') || name.includes('scudo') || name.includes('shield')) return false;
        return true;
    }).map(a => ({
        index: a.index,
        name: a.name,
        category: a.armor_category || 'Leggera',
        ac: a.armor_class?.base || 10,
        maxDex: a.armor_class?.max_bonus,
        strMin: a.str_minimum || 0,
        stealthDisadv: a.stealth_disadvantage || false
    }));
}

/**
 * Ottiene lo scudo base per il potenziamento
 * @returns {Array} Array con il singolo scudo
 */
export function getEnhanceableShields() {
    const allArmor = getArmor();
    return allArmor.filter(a => {
        const name = (a.name || '').toLowerCase();
        const cat = (a.armor_category || '').toLowerCase();
        return cat.includes('scudo') || name.includes('scudo') || name.includes('shield');
    }).map(a => ({
        index: a.index,
        name: a.name,
        category: 'Scudo',
        ac: a.armor_class?.base || 2
    }));
}

/**
 * Crea un oggetto magico potenziato
 * 
 * @param {Object} options
 * @param {string} options.category - 'weapon', 'armor', o 'shield'
 * @param {string} options.baseItemIndex - Index dell'oggetto base nel database
 * @param {number} options.bonus - Bonus magico (1, 2, o 3)
 * @returns {Object} L'oggetto magico creato con dati strutturati
 */
export function createMagicEquipment(options) {
    const { category, baseItemIndex, bonus } = options;
    
    if (!category || !baseItemIndex || !bonus || bonus < 1 || bonus > 3) {
        throw new Error('Parametri non validi per la creazione dell\'oggetto magico');
    }
    
    // Ottieni l'oggetto base dal database
    const baseItem = getItemByIndex(baseItemIndex);
    if (!baseItem) {
        throw new Error(`Oggetto base "${baseItemIndex}" non trovato nel database`);
    }
    
    const rarity = BONUS_RARITY[bonus] || 'Non Comune';
    
    // Genera un index univoco per l'oggetto magico
    const magicIndex = `magic-${baseItem.index}-+${bonus}`;
    
    // Nome dell'oggetto magico
    const magicName = `${baseItem.name} +${bonus}`;
    
    // Crea l'oggetto magico con tutti i dati del base + bonus strutturato
    const magicItem = {
        ...baseItem,
        index: magicIndex,
        name: magicName,
        customName: magicName,
        // Metadati magici
        rarity: { name: rarity },
        isMagical: true,
        source: 'magic',
        sourceType: 'magic-created',
        // Bonus magico strutturato (DATO CHIAVE)
        magicBonus: {},
        // Descrizione generata
        desc: generateDescription(baseItem, category, bonus, rarity),
        // Override dell'equipment category per armi/scudi magici
        equipment_category: {
            ...baseItem.equipment_category,
            name: category === 'weapon' ? 'Arma Magica' : 
                  category === 'armor' ? 'Armatura Magica' : 'Scudo Magico'
        }
    };
    
    // Imposta il bonus strutturato in base alla categoria
    switch (category) {
        case 'weapon':
            magicItem.magicBonus = {
                attack: bonus,
                damage: bonus
            };
            break;
        case 'armor':
            magicItem.magicBonus = {
                armorClass: bonus
            };
            break;
        case 'shield':
            magicItem.magicBonus = {
                armorClass: bonus
            };
            break;
    }
    
    return magicItem;
}

/**
 * Genera la descrizione italiana per l'oggetto magico
 */
function generateDescription(baseItem, category, bonus, rarity) {
    const rarityLabel = rarity.toLowerCase();
    
    switch (category) {
        case 'weapon':
            return [
                `${baseItem.name} magica +${bonus}, ${rarityLabel}`,
                `Arma con potenziamento magico +${bonus}.`,
                `Il bonus magico si aggiunge a tiri per colpire e tiri danni.`
            ];
        case 'armor':
            return [
                `${baseItem.name} magica +${bonus}, ${rarityLabel}`,
                `Armatura con potenziamento magico +${bonus}.`,
                `Il bonus magico si aggiunge alla Classe Armatura.`
            ];
        case 'shield':
            return [
                `${baseItem.name} magico +${bonus}, ${rarityLabel}`,
                `Scudo con potenziamento magico +${bonus}.`,
                `Il bonus magico si aggiunge alla Classe Armatura (in aggiunta al bonus base dello scudo).`
            ];
        default:
            return [`Oggetto magico +${bonus}, ${rarityLabel}`];
    }
}

/**
 * Verifica se un oggetto è un equipaggiamento magico potenziato creato con questo sistema
 * @param {Object} item 
 * @returns {boolean}
 */
export function isCreatedMagicEquipment(item) {
    return item && item.magicBonus && 
           typeof item.magicBonus === 'object' && 
           Object.keys(item.magicBonus).length > 0;
}

export default {
    ENHANCEABLE_CATEGORIES,
    getEnhanceableWeapons,
    getEnhanceableArmor,
    getEnhanceableShields,
    createMagicEquipment,
    isCreatedMagicEquipment,
    BONUS_RARITY
};
