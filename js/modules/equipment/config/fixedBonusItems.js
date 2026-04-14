/**
 * fixedBonusItems.js
 * ─────────────────────────────────────────────────────────────
 * Registry degli oggetti magici con bonus meccanici fissi.
 * Mappa l'indice di un oggetto ai suoi effetti strutturati,
 * per il calcolo automatico delle statistiche nella scheda PG.
 *
 * Il sistema copre:
 * - Impostazione di un punteggio di caratteristica (Cintura dei Giganti)
 * - Bonus additivo a una caratteristica (Cintura Nanica +2 COS)
 * - Bonus piatto alla CA da oggetti non-armatura (Bracciali della Difesa)
 * - Bonus ai Tiri Salvezza e Tiri di Abilità (Pietrafortuna, Mantello Protezione)
 * - Vantaggio su abilità specifiche (Stivali Elfici → Furtività)
 * - Vantaggio su tiri salvezza (Mantello Resistenza Incantesimi)
 * - Vantaggio su iniziativa (Verga dell'Allerta)
 *
 * @version 2.0.0
 */

// ============================================================================
// REGISTRY
// ============================================================================

/**
 * Struttura di ogni voce:
 * {
 *   setAbility: { <ability>: <value> },        // Imposta il punteggio a questo valore
 *   bonusAbility: { <ability>: <value> },      // Aggiunge questo bonus al punteggio
 *   bonusMax: { <ability>: <value> },          // Max raggiungibile con il bonus
 *   armorClassBonus: <number>,                  // Bonus piatto alla CA
 *   acCondition: 'no-armor-no-shield' | null,  // Condizione per il bonus CA
 *   saveBonus: <number>,                        // Bonus a TUTTI i Tiri Salvezza
 *   checkBonus: <number>,                       // Bonus a TUTTI i Tiri di Abilità
 *   advantageSkills: [<skillName>, ...],        // Vantaggio su abilità specifiche (nomi IT)
 *   advantageAllSaves: true,                    // Vantaggio su TUTTI i tiri salvezza
 *   advantageSpellSaves: true,                  // Vantaggio su TS vs incantesimi
 *   advantageInitiative: true,                  // Vantaggio su iniziativa
 *   requiresAttunement: <boolean>               // Il bonus si applica solo se sintonizzato
 * }
 */
export const FIXED_BONUS_REGISTRY = {

    // ========================================================================
    // IMPOSTA PUNTEGGIO CARATTERISTICA A VALORE FISSO
    // ========================================================================

    'gauntlets-of-ogre-power': {
        setAbility: { strength: 19 },
        requiresAttunement: true
    },
    'guanti-del-potere-orchesco': {
        setAbility: { strength: 19 },
        requiresAttunement: true
    },

    // Cinture dei Giganti (varianti)
    'belt-of-giant-strength-hill': {
        setAbility: { strength: 21 },
        requiresAttunement: true
    },
    'belt-of-giant-strength-stone': {
        setAbility: { strength: 23 },
        requiresAttunement: true
    },
    'belt-of-giant-strength-frost': {
        setAbility: { strength: 23 },
        requiresAttunement: true
    },
    'belt-of-giant-strength-fire': {
        setAbility: { strength: 25 },
        requiresAttunement: true
    },
    'belt-of-giant-strength-cloud': {
        setAbility: { strength: 27 },
        requiresAttunement: true
    },
    'belt-of-giant-strength-storm': {
        setAbility: { strength: 29 },
        requiresAttunement: true
    },

    // Amuleto della Salute
    'amulet-of-health': {
        setAbility: { constitution: 19 },
        requiresAttunement: true
    },

    // Fascia dell'Intelletto (Headband of Intellect)
    'fascia-dellintelletto': {
        setAbility: { intelligence: 19 },
        requiresAttunement: true
    },
    'headband-of-intellect': {
        setAbility: { intelligence: 19 },
        requiresAttunement: true
    },

    // Periapto della Saggezza (Periapt of Wisdom)
    'periapto-della-saggezza': {
        setAbility: { wisdom: 19 },
        requiresAttunement: true
    },
    'periapt-of-wisdom': {
        setAbility: { wisdom: 19 },
        requiresAttunement: true
    },

    // ========================================================================
    // BONUS ADDITIVO A CARATTERISTICA
    // ========================================================================

    // Cintura della Stirpe Nanica
    'belt-of-dwarvenkind': {
        bonusAbility: { constitution: 2 },
        bonusMax: { constitution: 20 },
        requiresAttunement: true
    },
    'cintura-nanica': {
        bonusAbility: { constitution: 2 },
        bonusMax: { constitution: 20 },
        requiresAttunement: true
    },

    // ========================================================================
    // BONUS PIATTO ALLA CA (da oggetti non-armatura)
    // ========================================================================

    // Bracciali della Difesa: +2 CA (solo senza armatura e senza scudo)
    'bracers-of-defense': {
        armorClassBonus: 2,
        acCondition: 'no-armor-no-shield',
        requiresAttunement: true
    },

    // Mantello della Protezione: +1 CA e +1 TS
    'cloak-of-protection': {
        armorClassBonus: 1,
        saveBonus: 1,
        requiresAttunement: true
    },

    // Anello della Protezione: +1 CA e +1 TS
    'anello-di-protezione': {
        armorClassBonus: 1,
        saveBonus: 1,
        requiresAttunement: true
    },

    // ========================================================================
    // BONUS AI TIRI SALVEZZA / TIRI DI ABILITÀ
    // ========================================================================

    // Pietrafortuna: +1 a tutti i tiri di abilità e tiri salvezza
    'pietra-della-buona-fortuna-pietrafortuna': {
        saveBonus: 1,
        checkBonus: 1,
        requiresAttunement: true
    },

    // Lama della Fortuna: +1 a tutti i TS (se addosso)
    'lama-della-fortuna': {
        saveBonus: 1,
        requiresAttunement: true
    },

    // Tunica delle Stelle: +1 a tutti i TS
    'tunica-delle-stelle': {
        saveBonus: 1,
        requiresAttunement: true
    },

    // Bastone del Potere: +2 CA, +2 TS, +2 attacco incantesimi
    'bastone-del-potere': {
        armorClassBonus: 2,
        saveBonus: 2,
        requiresAttunement: true
    },

    // ========================================================================
    // VANTAGGIO SU ABILITÀ SPECIFICHE
    // ========================================================================

    // Stivali Elfici: vantaggio su Furtività (muoversi silenziosamente)
    'boots-of-elvenkind': {
        advantageSkills: ['Furtività'],
        requiresAttunement: false
    },

    // Guanti del Nuotare e Scalare: vantaggio su Atletica (nuoto/arrampicata)
    'guanti-del-nuotare-e-scalare': {
        advantageSkills: ['Atletica'],
        requiresAttunement: true
    },

    // Lenti dell'Aquila: vantaggio su Percezione (basata sulla vista)
    'lenti-dellaquila': {
        advantageSkills: ['Percezione'],
        requiresAttunement: true
    },

    // Lenti della Visione Dettagliata: vantaggio su Indagare (basata sulla vista)
    'lenti-della-visione-dettagliata': {
        advantageSkills: ['Indagare'],
        requiresAttunement: true
    },

    // Mantello Elfico: vantaggio su Furtività (nascondersi, cappuccio su)
    'mantello-elfico': {
        advantageSkills: ['Furtività'],
        requiresAttunement: true
    },

    // Verga dell'Allerta: vantaggio su Percezione
    'verga-dellallerta': {
        advantageSkills: ['Percezione'],
        requiresAttunement: true
    },

    // ========================================================================
    // VANTAGGIO SU TIRI SALVEZZA
    // ========================================================================

    // Mantello della Resistenza agli Incantesimi: vantaggio TS vs incantesimi
    'mantello-della-resistenza-agli-incantesimi': {
        advantageSpellSaves: true,
        requiresAttunement: true
    },

    // Scarabeo di Protezione: vantaggio TS vs incantesimi
    'scarabeo-di-protezione': {
        advantageSpellSaves: true,
        requiresAttunement: true
    },

    // Tunica dell'Arcimago: vantaggio TS vs incantesimi/magia
    'tunica-dellarcimago': {
        advantageSpellSaves: true,
        requiresAttunement: true
    },

    // ========================================================================
    // VANTAGGIO SU INIZIATIVA
    // ========================================================================

    // Verga dell'Allerta: vantaggio su iniziativa
    'verga-dellallerta': {
        advantageInitiative: true,
        requiresAttunement: true
    },

    // ========================================================================
    // PIETRE DI IOUN (bonus +2 a caratteristica, max 20)
    // ========================================================================

    // Pietra di Ioun - Agilità (DEX +2, max 20)
    'pietra-di-ioun-agilita': {
        bonusAbility: { dexterity: 2 },
        bonusMax: { dexterity: 20 },
        requiresAttunement: true
    },
    // Pietra di Ioun - Forza (STR +2, max 20)
    'pietra-di-ioun-forza': {
        bonusAbility: { strength: 2 },
        bonusMax: { strength: 20 },
        requiresAttunement: true
    },
    // Pietra di Ioun - Intelletto (INT +2, max 20)
    'pietra-di-ioun-intelletto': {
        bonusAbility: { intelligence: 2 },
        bonusMax: { intelligence: 20 },
        requiresAttunement: true
    },
    // Pietra di Ioun - Intuizione (WIS +2, max 20)
    'pietra-di-ioun-intuizione': {
        bonusAbility: { wisdom: 2 },
        bonusMax: { wisdom: 20 },
        requiresAttunement: true
    },
    // Pietra di Ioun - Autorità (CHA +2, max 20)
    'pietra-di-ioun-autorita': {
        bonusAbility: { charisma: 2 },
        bonusMax: { charisma: 20 },
        requiresAttunement: true
    },
    // Pietra di Ioun - Tempra (CON +2, max 20)
    'pietra-di-ioun-tempra': {
        bonusAbility: { constitution: 2 },
        bonusMax: { constitution: 20 },
        requiresAttunement: true
    },
    // Pietra di Ioun - Protezione (CA +1)
    'pietra-di-ioun-protezione': {
        armorClassBonus: 1,
        requiresAttunement: true
    },
};

// ============================================================================
// FUNZIONI DI CALCOLO
// ============================================================================

/**
 * Verifica se un oggetto è uno scudo.
 * Usato per le condizioni AC (es. Bracciali della Difesa richiedono no-shield).
 * @param {Object} item
 * @returns {boolean}
 */
function _isShieldItem(item) {
    if (!item) return false;
    const nameLower = (item.name || '').toLowerCase();
    const category = (item.armor_category || '').toLowerCase();
    const equipCategory = (item.equipment_category?.index || '').toLowerCase();
    return nameLower.includes('scudo') ||
           nameLower.includes('shield') ||
           category.includes('scudo') ||
           equipCategory === 'shield';
}

/**
 * Verifica se un oggetto è un'armatura (non scudo).
 * @param {Object} item
 * @returns {boolean}
 */
function _isArmorItem(item) {
    if (!item) return false;
    const cat = (item.equipment_category?.index || '').toLowerCase();
    const armorCat = (item.armor_category || '').toLowerCase();
    return (cat === 'armor' && !_isShieldItem(item)) ||
           (armorCat && armorCat !== '' && !_isShieldItem(item) &&
            (item.armor_class?.base));
}

/**
 * Traduce il nome inglese di una caratteristica in abbreviazione italiana.
 * @param {string} ability - 'strength', 'dexterity', etc.
 * @returns {string} 'FOR', 'DES', etc.
 */
function _abilityToAbbr(ability) {
    const map = {
        strength: 'FOR', dexterity: 'DES', constitution: 'COS',
        intelligence: 'INT', wisdom: 'SAG', charisma: 'CAR'
    };
    return map[ability] || ability;
}

/**
 * Colleziona tutti gli oggetti equipaggiati di un personaggio.
 * Controlla sia equippedSlots (nuovo sistema) sia inventory con equipped:true (fallback).
 * @param {Object} pg - Dati del personaggio
 * @returns {Array} Array di oggetti equipaggiati
 */
export function getAllEquippedItems(pg) {
    const items = [];
    const seen = new Set();

    // Nuovo sistema: equippedSlots
    const slots = pg.equippedSlots || {};
    for (const [slotId, item] of Object.entries(slots)) {
        if (!item) continue;
        const key = item.index || item.name || slotId;
        if (!seen.has(key)) {
            items.push(item);
            seen.add(key);
        }
    }

    // Fallback vecchio sistema: inventory con equipped: true
    const inventory = pg.inventory || [];
    for (const item of inventory) {
        if (!item.equipped) continue;
        const key = item.index || item.name;
        if (!seen.has(key)) {
            items.push(item);
            seen.add(key);
        }
    }

    return items;
}

/**
 * Calcola tutti i bonus derivanti dagli oggetti equipaggiati.
 *
 * @param {Object} pg - Dati del personaggio
 * @returns {Object} {
 *   effectiveAbilities: { strength, dexterity, ... },   // Punteggi finali
 *   abilityOverrides: { strength: { type, value, source }, ... },
 *   flatACBonus: number,                                 // Bonus CA piatto da oggetti
 *   totalSaveBonus: number,                              // Bonus totale a tutti i TS
 *   totalCheckBonus: number,                             // Bonus totale a tutti i tiri abilità
 *   advantageSkills: Set<string>,                        // Abilità con vantaggio
 *   advantageAllSaves: boolean,                          // Vantaggio su TUTTI i TS
 *   advantageSpellSaves: boolean,                        // Vantaggio su TS vs incantesimi
 *   advantageInitiative: boolean,                        // Vantaggio su iniziativa
 *   bonusSources: Array<{ item, effect }>               // Lista leggibile dei bonus attivi
 * }
 */
export function calculateEquippedItemBonuses(pg) {
    const result = {
        effectiveAbilities: {
            strength: (pg.abilities?.strength) || 10,
            dexterity: (pg.abilities?.dexterity) || 10,
            constitution: (pg.abilities?.constitution) || 10,
            intelligence: (pg.abilities?.intelligence) || 10,
            wisdom: (pg.abilities?.wisdom) || 10,
            charisma: (pg.abilities?.charisma) || 10
        },
        abilityOverrides: {},
        flatACBonus: 0,
        totalSaveBonus: 0,
        totalCheckBonus: 0,
        advantageSkills: new Set(),
        advantageAllSaves: false,
        advantageSpellSaves: false,
        advantageInitiative: false,
        bonusSources: []
    };

    const equippedItems = getAllEquippedItems(pg);

    for (const item of equippedItems) {
        const itemIndex = item.index || '';
        const bonusDef = FIXED_BONUS_REGISTRY[itemIndex];
        if (!bonusDef) continue;

        // Se richiede sintonizzazione e non è sintonizzato, salta
        if (bonusDef.requiresAttunement && item.isAttuned !== true) continue;

        // === IMPOSTA PUNTEGGIO CARATTERISTICA ===
        if (bonusDef.setAbility) {
            for (const [ability, value] of Object.entries(bonusDef.setAbility)) {
                result.effectiveAbilities[ability] = value;
                result.abilityOverrides[ability] = {
                    type: 'set',
                    baseValue: pg.abilities?.[ability] || 10,
                    finalValue: value,
                    source: item.name
                };
                result.bonusSources.push({
                    item: item.name,
                    effect: `${_abilityToAbbr(ability)} → ${value}`
                });
            }
        }

        // === BONUS ADDITIVO A CARATTERISTICA ===
        if (bonusDef.bonusAbility) {
            for (const [ability, value] of Object.entries(bonusDef.bonusAbility)) {
                const max = bonusDef.bonusMax?.[ability] || 20;
                const current = result.effectiveAbilities[ability] || 10;
                const newScore = Math.min(current + value, max);

                result.effectiveAbilities[ability] = newScore;
                result.abilityOverrides[ability] = {
                    type: 'bonus',
                    baseValue: pg.abilities?.[ability] || 10,
                    bonusValue: value,
                    finalValue: newScore,
                    max,
                    source: item.name
                };
                result.bonusSources.push({
                    item: item.name,
                    effect: `+${value} ${_abilityToAbbr(ability)}${max < 20 ? ` (max ${max})` : ''}`
                });
            }
        }

        // === BONUS PIATTO ALLA CA ===
        if (bonusDef.armorClassBonus) {
            let conditionMet = true;

            if (bonusDef.acCondition === 'no-armor-no-shield') {
                const hasArmor = equippedItems.some(i => _isArmorItem(i));
                const hasShield = equippedItems.some(i => _isShieldItem(i));
                if (hasArmor || hasShield) conditionMet = false;
            } else if (bonusDef.acCondition === 'no-armor') {
                const hasArmor = equippedItems.some(i => _isArmorItem(i));
                if (hasArmor) conditionMet = false;
            }

            if (conditionMet) {
                result.flatACBonus += bonusDef.armorClassBonus;
                result.bonusSources.push({
                    item: item.name,
                    effect: `CA +${bonusDef.armorClassBonus}`
                });
            }
        }

        // === BONUS AI TIRI SALVEZZA ===
        if (bonusDef.saveBonus) {
            result.totalSaveBonus += bonusDef.saveBonus;
            result.bonusSources.push({
                item: item.name,
                effect: `TS +${bonusDef.saveBonus}`
            });
        }

        // === BONUS AI TIRI DI ABILITÀ ===
        if (bonusDef.checkBonus) {
            result.totalCheckBonus += bonusDef.checkBonus;
            result.bonusSources.push({
                item: item.name,
                effect: `Tiri abilità +${bonusDef.checkBonus}`
            });
        }

        // === VANTAGGIO SU ABILITÀ SPECIFICHE ===
        if (bonusDef.advantageSkills) {
            for (const skill of bonusDef.advantageSkills) {
                result.advantageSkills.add(skill);
            }
            result.bonusSources.push({
                item: item.name,
                effect: `Vantaggio: ${bonusDef.advantageSkills.join(', ')}`
            });
        }

        // === VANTAGGIO SU TUTTI I TIRI SALVEZZA ===
        if (bonusDef.advantageAllSaves) {
            result.advantageAllSaves = true;
            result.bonusSources.push({
                item: item.name,
                effect: 'Vantaggio su tutti i TS'
            });
        }

        // === VANTAGGIO SU TS VS INCANTESIMI ===
        if (bonusDef.advantageSpellSaves) {
            result.advantageSpellSaves = true;
            result.bonusSources.push({
                item: item.name,
                effect: 'Vantaggio TS vs incantesimi'
            });
        }

        // === VANTAGGIO SU INIZIATIVA ===
        if (bonusDef.advantageInitiative) {
            result.advantageInitiative = true;
            result.bonusSources.push({
                item: item.name,
                effect: 'Vantaggio su Iniziativa'
            });
        }
    }

    return result;
}
