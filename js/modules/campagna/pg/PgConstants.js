/**
 * PgConstants.js
 * ─────────────────────────────────────────────────────────────
 * Costanti, mappature e modello dati per il modulo PG Manager.
 * Centralizza tutta la configurazione per facilitare manutenzione e modifiche.
 * 
 * @author DM Tool
 * @version 1.0.0
 */

// ============================================================================
// MAPPATURA ABILITÀ → CARATTERISTICA
// ============================================================================

export const SKILL_ABILITY_MAP = {
    'Acrobazia': 'dexterity',
    'Addestrare Animali': 'wisdom',
    'Arcano': 'intelligence',
    'Atletica': 'strength',
    'Inganno': 'charisma',
    'Storia': 'intelligence',
    'Intuizione': 'wisdom',
    'Intimidire': 'charisma',
    'Indagare': 'intelligence',
    'Medicina': 'wisdom',
    'Natura': 'intelligence',
    'Percezione': 'wisdom',
    'Esibizione': 'charisma',
    'Persuasione': 'charisma',
    'Religione': 'intelligence',
    'Rapidità di Mano': 'dexterity',
    'Furtività': 'dexterity',
    'Sopravvivenza': 'wisdom'
};

// ============================================================================
// NOMI CARATTERISTICHE (traduzione IT)
// ============================================================================

export const ABILITY_NAMES = {
    'str': 'Forza',
    'dex': 'Destrezza',
    'con': 'Costituzione',
    'int': 'Intelligenza',
    'wis': 'Saggezza',
    'cha': 'Carisma'
};

// ============================================================================
// MAPPATURA CODICE API → PROPRIETÀ OGGETTO
// ============================================================================

export const ABILITY_KEY_TO_PROPERTY = {
    'str': 'strength',
    'dex': 'dexterity',
    'con': 'constitution',
    'int': 'intelligence',
    'wis': 'wisdom',
    'cha': 'charisma'
};

export const PROPERTY_TO_ABILITY_KEY = {
    'strength': 'str',
    'dexterity': 'dex',
    'constitution': 'con',
    'intelligence': 'int',
    'wisdom': 'wis',
    'charisma': 'cha'
};

export const ABILITY_ABBREVIATIONS = {
    'strength': 'FOR',
    'dexterity': 'DES',
    'constitution': 'COS',
    'intelligence': 'INT',
    'wisdom': 'SAG',
    'charisma': 'CAR'
};

export const ALL_SKILLS = Object.keys(SKILL_ABILITY_MAP);

// ============================================================================
// CLASSI INCANTATRICI
// ============================================================================

export const FULL_SPELLCASTERS = ['bard', 'cleric', 'druid', 'sorcerer', 'warlock', 'wizard'];
export const HALF_SPELLCASTERS = ['paladin', 'ranger'];
export const ALL_SPELLCASTERS = [...FULL_SPELLCASTERS, ...HALF_SPELLCASTERS];

// ============================================================================
// DADI VITA PER CLASSE
// ============================================================================

export const CLASS_HIT_DICE = {
    'barbarian': 12,
    'bard': 8,
    'cleric': 8,
    'druid': 8,
    'fighter': 10,
    'monk': 8,
    'paladin': 10,
    'ranger': 10,
    'rogue': 8,
    'sorcerer': 6,
    'warlock': 8,
    'wizard': 6
};

// ============================================================================
// SLOT INCANTESIMI PER LIVELLO
// ============================================================================

export const SPELL_SLOTS_BY_LEVEL = {
    1:  { 1: 2, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    2:  { 1: 3, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    3:  { 1: 4, 2: 2, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    4:  { 1: 4, 2: 3, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    5:  { 1: 4, 2: 3, 3: 2, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    6:  { 1: 4, 2: 3, 3: 3, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    7:  { 1: 4, 2: 3, 3: 3, 4: 1, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    8:  { 1: 4, 2: 3, 3: 3, 4: 2, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    9:  { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1, 6: 0, 7: 0, 8: 0, 9: 0 },
    10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 0, 7: 0, 8: 0, 9: 0 },
    11: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 0, 8: 0, 9: 0 },
    12: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 0, 8: 0, 9: 0 },
    13: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 0, 9: 0 },
    14: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 0, 9: 0 },
    15: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 0 },
    16: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 0 },
    17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
    18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
    19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
    20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 }
};

// ============================================================================
// CONDIZIONI D&D 5E
// ============================================================================

export const CONDITIONS = [
    'Accecato', 'Affascinato', 'Afferrato', 'Assordato',
    'Avvelenato', 'Inabile', 'Intralciato', 'Invisibile',
    'Paralizzato', 'Pietrificato', 'Prono', 'Spaventato',
    'Stordito', 'Svenuto'
];

// ============================================================================
// MODELLO DATI PG VUOTO
// ============================================================================

export const EMPTY_PG = {
    id: null,
    name: '',
    race: '',
    raceName: '',
    class: '',
    className: '',
    subclass: '',
    subclassName: '',
    level: 1,
    background: '',
    backgroundName: '',
    alignment: '',
    playerName: '',
    
    abilities: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
    },
    
    hp: {
        current: 0,
        max: 0,
        temp: 0
    },
    
    hitDice: {
        total: 1,
        current: 1,
        size: 'd8'
    },
    
    armorClass: 10,
    speed: 9,
    initiative: null,
    proficiencyBonus: 2,
    savingThrows: [],
    skills: [],
    
    proficiencies: {
        armor: [],
        weapons: [],
        tools: [],
        languages: []
    },
    
    racialTraits: [],
    classFeatures: [],
    feats: [],
    spellcasting: null,
    equipment: [],
    magicItems: [],
    
    treasure: {
        cp: 0, sp: 0, ep: 0, gp: 0, pp: 0,
        items: []
    },
    
    weight: 0,
    notes: '',
    backstory: '',
    wikiLinks: [],
    conditions: [],
    isInCombat: false,
    combatId: null,
    createdAt: null,
    updatedAt: null
};

// ============================================================================
// FUNZIONI DI UTILITÀ
// ============================================================================

export function calculateModifier(score) {
    return Math.floor((score - 10) / 2);
}

export function calculateProficiencyBonus(level) {
    return Math.ceil(level / 4) + 1;
}

export function calculateMaxHp(hitDieSize, constitution, level) {
    const conMod = calculateModifier(constitution);
    const avgHpPerLevel = Math.floor(hitDieSize / 2) + 1;
    
    if (level === 1) {
        return hitDieSize + conMod;
    }
    
    return hitDieSize + (avgHpPerLevel * (level - 1)) + (conMod * level);
}

export function calculateBaseAc(dexterity) {
    return 10 + calculateModifier(dexterity);
}

export function calculateSpellSaveDc(proficiencyBonus, spellcastingAbility) {
    return 8 + proficiencyBonus + calculateModifier(spellcastingAbility);
}

export function calculateSpellAttackBonus(proficiencyBonus, spellcastingAbility) {
    return proficiencyBonus + calculateModifier(spellcastingAbility);
}

console.log('📋 [PgConstants] Modulo costanti caricato.');