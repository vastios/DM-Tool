/**
 * compatibilityRules.js
 * ─────────────────────────────────────────────────────────────
 * Regole di compatibilità per l'equipaggiamento.
 * Definisce restrizioni, conflitti e prerequisiti.
 * 
 * @version 1.0.0
 */

import { SLOT_TYPES, WEAPON_SLOTS } from './slotTypes.js';
import { FIXED_BONUS_REGISTRY } from './fixedBonusItems.js';

/**
 * Regole di conflitto tra slot.
 * Quando un oggetto viene equipaggiato in uno slot,
 * può bloccare altri slot o richiedere azioni speciali.
 * 
 * Formato:
 * {
 *   slotId: {
 *     blocks: ['slotIds...'],      // Slot bloccati
 *     requires: ['slotIds...'],    // Slot richiesti (es. munizioni)
 *     message: 'Messaggio avviso'
 *   }
 * }
 */
export const SLOT_CONFLICTS = {
    // Arma a due mani blocca la mano secondaria
    mainHand: {
        twoHanded: {
            blocks: ['offHand'],
            message: 'Arma a due mani: mano secondaria non disponibile'
        }
    },
    
    // Scudo in mano secondaria
    offHand: {
        shield: {
            blocks: ['mainHand'],  // Se mainHand ha arma 2H
            conditions: {
                mainHand: { twoHanded: false }
            },
            message: 'Scudo equipaggiato'
        }
    },
    
    // Armi pesanti per creature Small
    heavyWeapon: {
        forSize: 'Small',
        effect: 'disadvantage',
        message: 'Arma pesante per taglia Piccola: svantaggio ai tiri'
    }
};

/**
 * Prerequisiti per equipaggiare oggetti.
 * @param {Object} item - L'oggetto da verificare
 * @param {Object} character - Il personaggio (PG o PNG)
 * @returns {Object} { canEquip: boolean, warnings: [], errors: [] }
 */
export function checkEquipPrerequisites(item, character) {
    const result = {
        canEquip: true,
        warnings: [],
        errors: []
    };
    
    if (!item || !character) return result;
    
    // === CONTROLLO FORZA PER ARMATURE ===
    if (item.armor_category === 'Pesante' && item.str_minimum) {
        const charStr = character.abilities?.strength || character.abilities?.for || 10;
        if (charStr < item.str_minimum) {
            result.warnings.push(
                `FOR ${item.str_minimum} richiesta (hai ${charStr}): svantaggio ai tiri per colpire`
            );
        }
    }
    
    // === CONTROLLO PROFICIENZA ===
    // Per ora solo warning, non blocca l'equipaggiamento
    if (item.weapon_category && !hasWeaponProficiency(item, character)) {
        result.warnings.push(
            `Non proficiente con armi ${item.weapon_category}: nessun bonus di competenza ai tiri`
        );
    }
    
    if (item.armor_category && !hasArmorProficiency(item, character)) {
        result.warnings.push(
            `Non proficiente con armature ${item.armor_category}: penalità ai tiri per colpire`
        );
    }
    
    // === CONTROLLO CLASSE ===
    // Alcune classi hanno restrizioni (es. Druidi non usano armature metalliche)
    // Implementazione futura se necessaria
    
    // === CONTROLLO ATTUNEMENT ===
    if (item.requires_attunement) {
        const currentAttunement = countAttunedItems(character);
        const maxAttunement = 3;
        
        if (!item.isAttuned && currentAttunement >= maxAttunement) {
            result.errors.push(
                `Raggiunto limite attunement (${maxAttunement}/3). Rimuovi un oggetto sintonizzato.`
            );
            result.canEquip = false;
        }
    }
    
    return result;
}

/**
 * Verifica se il personaggio ha proficiency con un'arma
 */
function hasWeaponProficiency(item, character) {
    const proficiencies = character.proficiencies || character.proficiency || [];
    const weaponCategory = item.weapon_category?.toLowerCase();
    
    return proficiencies.some(p => {
        const pLower = p.toLowerCase();
        // Match per categoria (semplice/marziale)
        if (pLower.includes('armi semplici') && weaponCategory === 'semplice') return true;
        if (pLower.includes('armi marziali') && weaponCategory === 'marziale') return true;
        // Match per nome specifico
        if (pLower.includes(item.name?.toLowerCase())) return true;
        return false;
    });
}

/**
 * Verifica se il personaggio ha proficiency con un'armatura
 */
function hasArmorProficiency(item, character) {
    const proficiencies = character.proficiencies || character.proficiency || [];
    const armorCategory = item.armor_category?.toLowerCase();
    
    return proficiencies.some(p => {
        const pLower = p.toLowerCase();
        // Match per categoria
        if (pLower.includes('armature leggere') && armorCategory === 'leggera') return true;
        if (pLower.includes('armature medie') && armorCategory === 'media') return true;
        if (pLower.includes('armature pesanti') && armorCategory === 'pesante') return true;
        if (pLower.includes('scudi') && item.equipment_category?.index === 'shield') return true;
        return false;
    });
}

/**
 * Conta gli oggetti attunati del personaggio
 */
function countAttunedItems(character) {
    const equipment = character.equipment || character.inventory || [];
    return equipment.filter(item => item.isAttuned === true).length;
}

/**
 * Verifica se equipaggiare un oggetto causa conflitti con l'equipaggiamento attuale
 * @param {Object} item - L'oggetto da equipaggiare
 * @param {string} targetSlot - Lo slot target
 * @param {Object} currentEquipment - Equipaggiamento attuale { slotId: item }
 * @returns {Object} { hasConflict: boolean, affectedSlots: [], message: string }
 */
export function checkSlotConflicts(item, targetSlot, currentEquipment) {
    const result = {
        hasConflict: false,
        affectedSlots: [],
        message: ''
    };
    
    // Arma a due mani
    if (item.properties?.some(p => 
        (p.name || p).toLowerCase() === 'two-handed' || 
        (p.name || p).toLowerCase() === 'a due mani'
    )) {
        if (targetSlot === 'mainHand' && currentEquipment.offHand) {
            result.hasConflict = true;
            result.affectedSlots.push('offHand');
            result.message = 'Arma a due mani: rimuovere oggetto dalla mano secondaria';
        }
    }
    
    // Scudo richiede mano libera
    const isShield = item.equipment_category?.index === 'shield' || 
                     item.type?.toLowerCase() === 'shield' ||
                     item.name?.toLowerCase().includes('scudo');
    
    if (isShield) {
        const mainHandItem = currentEquipment.mainHand;
        if (mainHandItem?.properties?.some(p => 
            (p.name || p).toLowerCase() === 'two-handed'
        )) {
            result.hasConflict = true;
            result.affectedSlots.push('mainHand');
            result.message = 'Scudo: rimuovere arma a due mani dalla mano primaria';
        }
    }
    
    return result;
}

/**
 * Calcola il massimo attunement disponibile
 */
export const MAX_ATTUNEMENT = 3;

/**
 * Calcola l'effetto di un oggetto sulle statistiche del personaggio
 * @param {Object} item - L'oggetto
 * @param {Object} character - Il personaggio
 * @returns {Object} Effetti calcolati
 */
export function calculateItemEffects(item, character) {
    const effects = {
        armorClass: 0,
        armorClassBonus: 0,
        attackBonus: 0,
        damageBonus: 0,
        saveBonus: {},
        abilityBonus: {},
        speed: 0,
        special: []
    };
    
    if (!item) return effects;
    
    // === BONUS FISSI DA REGISTRY (oggetti magici con bonus strutturati) ===
    const fixedBonus = FIXED_BONUS_REGISTRY[item.index];
    if (fixedBonus) {
        if (fixedBonus.armorClassBonus) {
            effects.armorClassBonus = (effects.armorClassBonus || 0) + fixedBonus.armorClassBonus;
        }
        if (fixedBonus.saveBonus) {
            effects.saveBonus.all = (effects.saveBonus.all || 0) + fixedBonus.saveBonus;
        }
        if (fixedBonus.checkBonus) {
            effects.checkBonus = (effects.checkBonus || 0) + fixedBonus.checkBonus;
        }
        if (fixedBonus.setAbility) {
            effects.setAbility = { ...(effects.setAbility || {}), ...fixedBonus.setAbility };
        }
        if (fixedBonus.bonusAbility) {
            effects.abilityBonus = { ...(effects.abilityBonus || {}), ...fixedBonus.bonusAbility };
        }
    }
    
    // === BONUS MAGICI STRUTTURATI (priorita alta) ===
    // Se l'oggetto ha un magicBonus strutturato, usalo direttamente
    // senza dipendere dal parsing della descrizione
    if (item.magicBonus && typeof item.magicBonus === 'object') {
        // Bonus alla Classe Armatura (armature e scudi magici +N)
        if (item.magicBonus.armorClass) {
            effects.armorClassBonus = item.magicBonus.armorClass;
        }
        // Bonus al tiro per colpire (armi magiche +N)
        if (item.magicBonus.attack) {
            effects.attackBonus = item.magicBonus.attack;
        }
        // Bonus al danno (armi magiche +N)
        if (item.magicBonus.damage) {
            effects.damageBonus = item.magicBonus.damage;
        }
    }
    
    // === ARMATURE ===
    if (item.armor_class) {
        if (item.armor_category === 'Leggera') {
            // Armatura leggera: base + DEX completo
            effects.armorClass = item.armor_class.base || 10;
            effects.armorClassDexBonus = true;
            effects.armorClassDexMax = null;
        } else if (item.armor_category === 'Media') {
            // Armatura media: base + DEX (max 2)
            effects.armorClass = item.armor_class.base || 10;
            effects.armorClassDexBonus = true;
            effects.armorClassDexMax = item.armor_class.max_bonus || 2;
        } else if (item.armor_category === 'Pesante') {
            // Armatura pesante: base, no DEX
            effects.armorClass = item.armor_class.base || 10;
            effects.armorClassDexBonus = false;
        } else if (item.armor_category?.toLowerCase().includes('scudo') ||
                   item.name?.toLowerCase().includes('scudo') ||
                   item.equipment_category?.index === 'shield') {
            // Scudo: +2 AC base (il bonus magico verra aggiunto sopra)
            effects.armorClassBonus = (effects.armorClassBonus || 0) + 2;
        }
    }
    
    // === OGGETTI MAGICI (fallback regex per oggetti senza magicBonus strutturato) ===
    if (item.rarity && !item.magicBonus) {
        const desc = (item.desc || []).join(' ').toLowerCase();
        
        // Cerca bonus AC nella descrizione
        const acBonusMatch = desc.match(/(\+\d+).*ca|ca.*(\+\d+)/);
        if (acBonusMatch) {
            effects.armorClassBonus = parseInt(acBonusMatch[1] || acBonusMatch[2]);
        }
        
        // Cerca bonus attacco
        const atkBonusMatch = desc.match(/(\+\d+).*tiri per colpire|tiri per colpire.*(\+\d+)/);
        if (atkBonusMatch) {
            effects.attackBonus = parseInt(atkBonusMatch[1] || atkBonusMatch[2]);
        }
        
        // Cerca bonus danno
        const dmgBonusMatch = desc.match(/(\+\d+).*tiri danni|tiri danni.*(\+\d+)/);
        if (dmgBonusMatch) {
            effects.damageBonus = parseInt(dmgBonusMatch[1] || dmgBonusMatch[2]);
        }
        
        // Salvataggi
        const saveBonusMatch = desc.match(/(\+\d+).*tiri salvezza|tiri salvezza.*(\+\d+)/);
        if (saveBonusMatch) {
            effects.saveBonus.all = parseInt(saveBonusMatch[1] || saveBonusMatch[2]);
        }
    }
    
    // === ARMI ===
    if (item.damage) {
        effects.damageDice = item.damage.damage_dice;
        effects.damageType = item.damage.damage_type?.name;
    }
    
    // === PROPRIETÀ SPECIALI ===
    if (item.stealth_disadvantage) {
        effects.special.push('Svantaggio ai tiri Occultamento (Stealth)');
    }
    
    return effects;
}

/**
 * Verifica se un oggetto richiede attunement
 * @param {Object} item 
 * @returns {boolean}
 */
export function requiresAttunement(item) {
    return item.requires_attunement === true || 
           item.requires_attunement === 'true' ||
           item.attunement === true;
}

/**
 * Verifica se un oggetto può essere attunato
 * @param {Object} item 
 * @param {Object} character 
 * @returns {Object} { canAttune: boolean, reason: string }
 */
export function canAttuneItem(item, character) {
    if (!requiresAttunement(item)) {
        return { canAttune: true, reason: 'Non richiede attunement' };
    }
    
    const currentAttuned = countAttunedItems(character);
    
    if (currentAttuned >= MAX_ATTUNEMENT) {
        return { 
            canAttune: false, 
            reason: `Limite attunement raggiunto (${currentAttuned}/${MAX_ATTUNEMENT})` 
        };
    }
    
    // Controlla se ci sono requisiti di classe/razza (da implementare)
    // Es. "requires attunement by a wizard"
    
    return { canAttune: true, reason: '' };
}

export default {
    SLOT_CONFLICTS,
    MAX_ATTUNEMENT,
    checkEquipPrerequisites,
    checkSlotConflicts,
    calculateItemEffects,
    requiresAttunement,
    canAttuneItem
};
