/**
 * quickBuilder.js
 * ─────────────────────────────────────────────────────────────
 * Modulo per la creazione rapida di PG/NPC con statistiche complete.
 * Genera automaticamente: statistiche, PF, CA, attacchi, incantesimi.
 */

import { classDatabase } from '../../../database/classes/index.js';
import { raceDatabase } from '../../../database/races.js';
import { getSpellsByLevel, getMaxSpellLevel, spellsKnownByLevel, getMaxCantripsKnown } from '../../../database/classSpells.js';
import { itemDatabase } from '../../../database/items.js';
import { magicItemsDatabase } from '../../../database/magicItems.js';
import { escapeHtml } from '../../../utils/htmlHelpers.js';

// ─────────────────────────────────────────────────────────────
// CONFIGURAZIONE
// ─────────────────────────────────────────────────────────────

// Nomi italiani per le caratteristiche (chiavi abbreviate usate nel quickBuilder)
const ABILITY_NAMES_IT = {
    'for': 'Forza',
    'des': 'Destrezza',
    'cos': 'Costituzione',
    'int': 'Intelligenza',
    'sag': 'Saggezza',
    'car': 'Carisma'
};

// Standard Array per distribuzione statistiche
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

// Priorità statistiche per classe (ordine di importanza)
const CLASS_ABILITY_PRIORITY = {
    'Guerriero': ['for', 'cos', 'des', 'sag', 'car', 'int'],
    'Mago': ['int', 'cos', 'des', 'sag', 'car', 'for'],
    'Chierico': ['sag', 'cos', 'for', 'des', 'car', 'int'],
    'Ladro': ['des', 'cos', 'int', 'sag', 'car', 'for'],
    'Ranger': ['des', 'cos', 'sag', 'for', 'int', 'car'],
    'Paladino': ['for', 'car', 'cos', 'sag', 'des', 'int'],
    'Barbaro': ['for', 'cos', 'des', 'sag', 'car', 'int'],
    'Bardo': ['car', 'des', 'cos', 'int', 'sag', 'for'],
    'Druido': ['sag', 'cos', 'des', 'int', 'for', 'car'],
    'Monaco': ['des', 'sag', 'cos', 'for', 'int', 'car'],
    'Stregone': ['car', 'cos', 'des', 'sag', 'int', 'for'],
    'Warlock': ['car', 'cos', 'des', 'sag', 'int', 'for']
};

// Nomi casuali per NPC
const NAMES_MALE = ['Goran', 'Theron', 'Kael', 'Bran', 'Darius', 'Marcus', 'Eldric', 'Roland', 'Gareth', 'Aldric', 'Torin', 'Viktor', 'Stefan', 'Nikolai', 'Henrik'];
const NAMES_FEMALE = ['Lyra', 'Kira', 'Elara', 'Mira', 'Thalia', 'Seraphina', 'Isolde', 'Brynn', 'Freya', 'Astrid', 'Helena', 'Natasha', 'Katya', 'Ingrid', 'Sigrid'];
const SURNAMES = ['Stoneheart', 'Nightshade', 'Ironforge', 'Stormwind', 'Shadowmere', 'Brightblade', 'Ashford', 'Blackwood', 'Silvermoon', 'Fireborn', 'Winterfell', 'Ravencrest', 'Dawnbringer', 'Thornwood', 'Greymane'];

// ─────────────────────────────────────────────────────────────
// FUNZIONI DI UTILITÀ
// ─────────────────────────────────────────────────────────────

function getModifier(score) {
    return Math.floor((score - 10) / 2);
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(arr) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function getClassByName(name) {
    return classDatabase.find(c => c.classe === name || c.name === name);
}

function getRaceByName(name) {
    return raceDatabase.find(r => r.name === name);
}

function getProficiencyBonus(level) {
    if (level < 5) return 2;
    if (level < 9) return 3;
    if (level < 13) return 4;
    if (level < 17) return 5;
    return 6;
}

function isCasterClass(className) {
    const casters = ['Mago', 'Chierico', 'Druido', 'Bardo', 'Stregone', 'Warlock'];
    return casters.includes(className);
}

function isHalfCasterClass(className) {
    const halfCasters = ['Paladino', 'Ranger'];
    return halfCasters.includes(className);
}

// ─────────────────────────────────────────────────────────────
// GENERAZIONE STATISTICHE
// ─────────────────────────────────────────────────────────────

function generateAbilityScores(className, focus = 'balanced', variability = 'medium') {
    const priority = CLASS_ABILITY_PRIORITY[className] || CLASS_ABILITY_PRIORITY['Guerriero'];
    
    // M3 FIX: Implementa focus 'random' con variazione reale sulle priorità
    let actualPriority = [...priority];
    if (focus === 'random') {
        for (let i = actualPriority.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [actualPriority[i], actualPriority[j]] = [actualPriority[j], actualPriority[i]];
        }
    }
    
    // Copia e ordina lo standard array
    let scores = [...STANDARD_ARRAY];
    
    // Aggiungi variazione in base al livello di variabilità
    if (variability !== 'fixed') {
        const varianceMap = { 'low': 1, 'medium': 2, 'high': 3 };
        const variance = varianceMap[variability] || 1;
        
        scores = scores.map(score => {
            const mod = Math.floor(Math.random() * (variance * 2 + 1)) - variance;
            return Math.max(6, Math.min(18, score + mod));
        });
    }
    
    // Ordina discendente per assegnare alle priorità
    scores.sort((a, b) => b - a);
    
    // Applica modificatori focus (solo offensive/defensive)
    if (focus === 'offensive' || focus === 'defensive') {
        if (focus === 'offensive') {
            scores[0] = Math.min(18, scores[0] + 1);
            scores[2] = Math.max(6, scores[2] - 1);
        } else {
            scores[1] = Math.min(18, scores[1] + 1);
            scores[0] = Math.max(6, scores[0] - 1);
        }
    }
    
    // Assegna in base alla priorità della classe (o mescolata se random)
    const abilities = {};
    actualPriority.forEach((abil, index) => {
        abilities[abil] = scores[index];
    });
    
    return abilities;
}

// FIX Q1: Mappatura indici EN → IT per bonus razziali
const ABILITY_INDEX_MAP = {
    'str': 'for', 'dex': 'des', 'con': 'cos',
    'int': 'int', 'wis': 'sag', 'cha': 'car'
};

function applyRacialBonuses(abilities, race) {
    const result = { ...abilities };
    
    if (race.ability_bonuses) {
        race.ability_bonuses.forEach(bonus => {
            const enIndex = bonus.ability_score?.index?.toLowerCase();
            const abilityIndex = ABILITY_INDEX_MAP[enIndex];
            if (abilityIndex && result[abilityIndex] !== undefined) {
                // FIX Q17: Cap a 20 anche nei bonus razziali
                result[abilityIndex] = Math.min(20, result[abilityIndex] + bonus.bonus);
            }
        });
    }
    
    return result;
}

function applyASI(abilities, level, className) {
    const result = { ...abilities };
    const classData = getClassByName(className);
    
    // FIX Q3: Livelli ASI — il Guerriero ha extra a livello 6 e 14
    const standardASI = [4, 8, 12, 16, 19];
    const fighterASI = [4, 6, 8, 12, 14, 16, 19];
    const asiLevels = className === 'Guerriero' ? fighterASI : standardASI;
    const asiCount = asiLevels.filter(l => l <= level).length;
    
    // Applica ASI alle statistiche principali
    const priority = CLASS_ABILITY_PRIORITY[className] || CLASS_ABILITY_PRIORITY['Guerriero'];
    
    for (let i = 0; i < asiCount; i++) {
        // Aumenta le due statistiche principali (o una di 2)
        if (result[priority[0]] < 20) {
            result[priority[0]] += 1;
        }
        if (result[priority[1]] < 20) {
            result[priority[1]] += 1;
        }
    }
    
    return result;
}

// ─────────────────────────────────────────────────────────────
// CALCOLI DERIVATI
// ─────────────────────────────────────────────────────────────

function calculateHP(classData, level, conMod) {
    const hitDie = classData.hit_die || 10;
    
    // Livello 1: dado max
    let hp = hitDie + conMod;
    
    // Livelli successivi: media o random (usiamo media per NPC)
    const avgRoll = Math.floor(hitDie / 2) + 1;
    for (let i = 2; i <= level; i++) {
        hp += avgRoll + conMod;
    }
    
    return Math.max(1, hp);
}

function calculateAC(abilities, classData, equipment = null) {
    const dexMod = getModifier(abilities['des']);
    const className = classData.classe;
    
    // FIX Q2: Case-insensitive match per competenze armature
    const armorProf = (classData.competenze?.armature || []).map(a => a.toLowerCase());
    
    // Determina il tipo di armatura in base alla classe
    let armorAC = null;
    const hasAllArmor = armorProf.includes('tutte le armature');
    const hasMedium = armorProf.some(a => a.includes('armature medie'));
    const hasLight = armorProf.some(a => a.includes('armature leggere'));
    
    if (hasAllArmor) {
        // Classe con armatura pesante (Guerriero, Paladino)
        if (['Guerriero', 'Paladino'].includes(className)) {
            armorAC = 18; // Armatura a piastre
        } else if (className === 'Chierico') {
            armorAC = 16; // Cotta di maglia (no dex)
        }
    } else if (hasMedium) {
        // Barbaro, Druido, Ranger — usano armatura media
        if (className === 'Barbaro') {
            armorAC = 14 + Math.min(dexMod, 2); // Armatura di pelli
        } else if (className === 'Druido') {
            armorAC = 14 + Math.min(dexMod, 2); // Armatura di pelli (non metallica)
        } else if (className === 'Ranger') {
            armorAC = 14 + Math.min(dexMod, 2); // Armatura di pelli
        }
    } else if (hasLight) {
        // Ladro, Bardo, Warlock — armatura leggera
        armorAC = 12 + dexMod; // Cuoio borchiato
    }
    
    // FIX Q8: Calcola anche difese senza armatura (Barbaro, Monaco)
    let unarmoredAC = null;
    if (className === 'Barbaro') {
        unarmoredAC = 10 + dexMod + getModifier(abilities['cos']);
    } else if (className === 'Monaco') {
        unarmoredAC = 10 + dexMod + getModifier(abilities['sag']);
    } else if (!armorAC) {
        unarmoredAC = 10 + dexMod;
    }
    
    // FIX Q8: Usa la migliore tra armatura e difesa senza armatura
    let ac = armorAC !== null ? armorAC : unarmoredAC;
    if (armorAC !== null && unarmoredAC !== null) {
        ac = Math.max(armorAC, unarmoredAC);
    }
    
    // FIX Q15: Aggiungi +2 se la classe ha scudo
    const hasShield = armorProf.includes('scudi') || armorProf.some(a => a.includes('scudi'));
    if (hasShield && className !== 'Monaco') {
        // Il Druido ha scudi non metallici — lo gestiamo dal prof
        ac += 2;
    }
    
    return ac;
}

function calculateAttackBonus(abilities, classData, profBonus, weaponType = 'melee') {
    const strMod = getModifier(abilities['for']);
    const dexMod = getModifier(abilities['des']);
    
    // Determina se usa Forza o Destrezza
    let attackMod;
    if (weaponType === 'ranged') {
        attackMod = dexMod;
    } else if (classData.classe === 'Ladro' || classData.classe === 'Monaco' || classData.classe === 'Ranger') {
        // Queste classi preferiscono DES per i weapon finesse
        attackMod = Math.max(strMod, dexMod);
    } else {
        attackMod = strMod;
    }
    
    return profBonus + attackMod;
}

function calculateSpellDC(abilities, classData, profBonus) {
    const spellAbility = getSpellAbility(classData.classe);
    if (!spellAbility) return null;
    
    const abilityMod = getModifier(abilities[spellAbility]);
    return 8 + profBonus + abilityMod;
}

function getSpellAbility(className) {
    const spellAbilities = {
        'Mago': 'int',
        'Chierico': 'sag',
        'Druido': 'sag',
        'Bardo': 'car',
        'Stregone': 'car',
        'Warlock': 'car',
        'Paladino': 'car',
        'Ranger': 'sag'
    };
    return spellAbilities[className] || null;
}

// ─────────────────────────────────────────────────────────────
// GENERAZIONE INCANTESIMI
// ─────────────────────────────────────────────────────────────

function generateSpells(className, level, abilities) {
    if (!isCasterClass(className) && !isHalfCasterClass(className)) {
        return { cantrips: [], spells: [], slots: {} };
    }
    
    const maxSpellLevel = getMaxSpellLevel(className, level);
    const spellAbility = getSpellAbility(className);
    const spellAttackMod = getModifier(abilities[spellAbility]) + getProficiencyBonus(level);
    const spellDC = 8 + getProficiencyBonus(level) + getModifier(abilities[spellAbility]);
    
    const result = {
        cantrips: [],
        spells: [],
        slots: {},
        attackBonus: spellAttackMod,
        dc: spellDC,
        ability: spellAbility
    };
    
    // Genera trucchetti (cantrip)
    const cantripCount = getCantripCount(className, level);
    const cantripsAvailable = getSpellsByLevel(className, 0);
    result.cantrips = pickRandomSpells(cantripsAvailable, cantripCount);
    
    // Genera incantesimi per livello
    for (let spellLevel = 1; spellLevel <= maxSpellLevel; spellLevel++) {
        const spellsAvailable = getSpellsByLevel(className, spellLevel);
        const spellsForLevel = getSpellsCountForLevel(className, level, spellLevel);
        
        const selectedSpells = pickRandomSpells(spellsAvailable, spellsForLevel);
        // FIX: s è una stringa, non un oggetto. Creiamo l'oggetto correttamente
        result.spells.push(...selectedSpells.map(s => ({ name: s, level: spellLevel })));
    }
    
    // Calcola slot
    result.slots = calculateSpellSlots(className, level);
    
    return result;
}

// H5/H6 FIX: Delega a getMaxCantripsKnown da classSpells.js (SRD-accurate)
function getCantripCount(className, level) {
    return getMaxCantripsKnown(className, level) || 0;
}

function getSpellsCountForLevel(className, pgLevel, spellLevel) {
    // Per incantatori che preparano (Mago, Chierico, Druido)
    // Preparano un numero di incantesimi = mod caratteristica + livello
    // Per il Quick Builder, distribuiamo gli incantesimi tra i vari livelli disponibili
    const preparers = ['Mago', 'Chierico', 'Druido', 'Paladino', 'Ranger'];
    
    if (preparers.includes(className)) {
        // Per preparatori: più incantesimi per livelli bassi, meno per livelli alti
        // Questo simula una distribuzione realistica
        const maxSpellLvl = getMaxSpellLevel(className, pgLevel);
        const baseCount = Math.max(2, Math.ceil(pgLevel / 2));
        // Più incantesimi di basso livello, meno di alto livello
        return Math.max(2, baseCount - spellLevel + 2);
    }
    
    // Per Bardo e Stregone (hanno limite)
    const known = spellsKnownByLevel[className];
    if (known) {
        // Distribuisci gli incantesimi conosciuti tra i livelli disponibili
        const totalKnown = known[pgLevel] || 4;
        const maxSpellLvl = getMaxSpellLevel(className, pgLevel);
        return Math.max(1, Math.ceil(totalKnown / (maxSpellLvl + 1)));
    }
    
    return 2;
}

function pickRandomSpells(spells, count) {
    if (!spells || spells.length === 0) return [];
    const shuffled = shuffleArray(spells);
    return shuffled.slice(0, Math.min(count, spells.length));
}

function calculateSpellSlots(className, level) {
    // Slot per incantatori completi
    const fullCasterSlots = {
        1: { 1: 2 },
        2: { 1: 3 },
        3: { 1: 4, 2: 2 },
        4: { 1: 4, 2: 3 },
        5: { 1: 4, 2: 3, 3: 2 },
        6: { 1: 4, 2: 3, 3: 3 },
        7: { 1: 4, 2: 3, 3: 3, 4: 1 },
        8: { 1: 4, 2: 3, 3: 3, 4: 2 },
        9: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
        10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
        11: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
        12: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
        13: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
        14: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
        15: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
        16: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
        17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
        18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
        19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
        20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 }
    };
    
    // Slot per half-caster
    const halfCasterSlots = {
        1: {},
        2: { 1: 2 },
        3: { 1: 3 },
        4: { 1: 3 },
        5: { 1: 4, 2: 2 },
        6: { 1: 4, 2: 2 },
        7: { 1: 4, 2: 3 },
        8: { 1: 4, 2: 3 },
        9: { 1: 4, 2: 3, 3: 2 },
        10: { 1: 4, 2: 3, 3: 2 },
        11: { 1: 4, 2: 3, 3: 2 },
        12: { 1: 4, 2: 3, 3: 2 },
        13: { 1: 4, 2: 3, 3: 3, 4: 1 },
        14: { 1: 4, 2: 3, 3: 3, 4: 1 },
        15: { 1: 4, 2: 3, 3: 3, 4: 1 },
        16: { 1: 4, 2: 3, 3: 3, 4: 1 },
        17: { 1: 4, 2: 3, 3: 3, 4: 2, 5: 1 },
        18: { 1: 4, 2: 3, 3: 3, 4: 2, 5: 1 },
        19: { 1: 4, 2: 3, 3: 3, 4: 2, 5: 1 },
        20: { 1: 4, 2: 3, 3: 3, 4: 2, 5: 1 }
    };
    
    // FIX Q6: Slot Pact Magic per Warlock
    const warlockSlots = {
        1: { 1: 1 }, 2: { 1: 2 }, 3: { 1: 2 }, 4: { 1: 2 },
        5: { 2: 2 }, 6: { 2: 2 }, 7: { 2: 2 }, 8: { 2: 2 },
        9: { 3: 2 }, 10: { 3: 2 }, 11: { 3: 2 }, 12: { 3: 2 },
        13: { 4: 2 }, 14: { 4: 2 }, 15: { 4: 2 }, 16: { 4: 2 },
        17: { 5: 2 }, 18: { 5: 2 }, 19: { 5: 2 }, 20: { 5: 2 }
    };
    
    if (className === 'Warlock') {
        return warlockSlots[level] || {};
    }
    if (isHalfCasterClass(className)) {
        return halfCasterSlots[level] || {};
    }
    return fullCasterSlots[level] || {};
}

// ─────────────────────────────────────────────────────────────
// GENERAZIONE EQUIPAGGIAMENTO
// ─────────────────────────────────────────────────────────────

// Funzioni helper per le dotazioni
function getEquipmentPacks() {
    return itemDatabase.filter(item => 
        item.gear_category?.index === 'equipment-packs' || 
        item.gear_category?.name?.includes('Zaini')
    );
}

function getEquipmentPackByIndex(index) {
    return itemDatabase.find(item => item.index === index);
}

function expandPackContents(pack) {
    if (!pack || !pack.contents || pack.contents.length === 0) {
        return [];
    }
    
    const expandedItems = [];
    pack.contents.forEach(content => {
        const itemData = itemDatabase.find(i => i.index === content.item?.index);
        if (itemData) {
            expandedItems.push({
                ...itemData,
                quantity: content.quantity || 1,
                displayName: content.quantity > 1 
                    ? `${itemData.name} (x${content.quantity})` 
                    : itemData.name
            });
        } else {
            // Fallback se l'oggetto non è trovato nel database
            expandedItems.push({
                name: content.item?.name || 'Oggetto sconosciuto',
                quantity: content.quantity || 1,
                displayName: content.quantity > 1 
                    ? `${content.item?.name || 'Oggetto'} (x${content.quantity})` 
                    : content.item?.name || 'Oggetto sconosciuto'
            });
        }
    });
    
    return expandedItems;
}

// Dotazioni suggerite per classe
const CLASS_PACK_SUGGESTIONS = {
    'Guerriero': 'dungeoneers-pack',
    'Paladino': 'explorers-pack',
    'Barbaro': 'explorers-pack',
    'Ladro': 'burglars-pack',
    'Ranger': 'explorers-pack',
    'Monaco': 'explorers-pack',
    'Mago': 'scholars-pack',
    'Chierico': 'priests-pack',
    'Druido': 'explorers-pack',
    'Bardo': 'entertainers-pack',
    'Stregone': 'scholars-pack',
    'Warlock': 'scholars-pack'
};

// Equipaggiamento base per classe
const CLASS_EQUIPMENT = {
    'Guerriero': {
        weapons: [{ name: 'Spadone', damage: '2d6', type: 'melee', twoHanded: true }],
        backupWeapons: [{ name: 'Spada lunga', damage: '1d8', type: 'melee' }, { name: 'Ascia da Battaglia', damage: '1d8', type: 'melee' }],
        armor: 'Armatura a piastre',
        shield: false,
        other: ['Zaino da Esploratore', 'Torcia (5)', 'Corda (15m)']
    },
    'Paladino': {
        weapons: [{ name: 'Spada lunga', damage: '1d8', type: 'melee' }],
        backupWeapons: [{ name: 'Lancia', damage: '1d6', type: 'melee' }],
        armor: 'Armatura a piastre',
        shield: true,
        other: ['Simbolo Sacro', 'Zaino da Esploratore']
    },
    'Barbaro': {
        weapons: [{ name: 'Ascia bipenne', damage: '1d12', type: 'melee', twoHanded: true }],
        backupWeapons: [{ name: 'Ascia da Battaglia', damage: '1d8', type: 'melee' }, { name: 'Giavellotto', damage: '1d6', type: 'melee', thrown: true }],
        armor: 'Armatura di pelli',
        shield: false,
        other: ['Zaino da Esploratore', 'Caccia (5 giorni)']
    },
    'Ladro': {
        weapons: [{ name: 'Spada corta', damage: '1d6', type: 'melee', finesse: true }],
        backupWeapons: [{ name: 'Pugnale', damage: '1d4', type: 'melee', finesse: true }],
        ranged: { name: 'Arco corto', damage: '1d6', type: 'ranged', ammo: 20 },
        armor: 'Armatura di cuoio',
        shield: false,
        other: ['Grimorio del Ladro', 'Corda (15m)', 'Torcia (5)']
    },
    'Ranger': {
        weapons: [{ name: 'Spada corta', damage: '1d6', type: 'melee', finesse: true }],
        backupWeapons: [{ name: 'Pugnale', damage: '1d4', type: 'melee', finesse: true }],
        ranged: { name: 'Arco lungo', damage: '1d8', type: 'ranged', ammo: 20 },
        armor: 'Armatura di cuoio',
        shield: false,
        other: ['Zaino da Esploratore', 'Caccia (5 giorni)', 'Corda (15m)']
    },
    'Monaco': {
        weapons: [{ name: 'Bastone', damage: '1d6', type: 'melee', versatile: '1d8' }],
        backupWeapons: [{ name: 'Pugnale', damage: '1d4', type: 'melee', finesse: true }],
        armor: null,
        shield: false,
        other: ['Zaino da Esploratore', 'Corda (3m)']
    },
    'Mago': {
        weapons: [{ name: 'Bastone', damage: '1d6', type: 'melee', versatile: '1d8' }],
        backupWeapons: [{ name: 'Pugnale', damage: '1d4', type: 'melee', finesse: true }],
        armor: null,
        shield: false,
        other: ['Libro di Incantesimi', 'Focus Arcano', 'Zaino da Studioso', 'Pergamene (5)']
    },
    'Chierico': {
        weapons: [{ name: 'Mazza', damage: '1d6', type: 'melee' }],
        backupWeapons: [{ name: 'Pugnale', damage: '1d4', type: 'melee', finesse: true }],
        armor: 'Cotta di Maglia',
        shield: true,
        other: ['Simbolo Sacro', 'Zaino da Sacerdote', 'Acqua Santa', 'Pergamene (3)']
    },
    'Druido': {
        weapons: [{ name: 'Bastone', damage: '1d6', type: 'melee', versatile: '1d8' }],
        backupWeapons: [{ name: 'Falce', damage: '1d4', type: 'melee' }],
        armor: 'Armatura di pelli',
        shield: true,
        other: ['Focus Druidico', 'Zaino da Esploratore', 'Erbe Mediche']
    },
    'Bardo': {
        weapons: [{ name: 'Spada corta', damage: '1d6', type: 'melee', finesse: true }],
        backupWeapons: [{ name: 'Pugnale', damage: '1d4', type: 'melee', finesse: true }],
        armor: 'Armatura di cuoio',
        shield: false,
        other: ['Strumento Musicale', 'Zaino da Intrattenitore', 'Costume']
    },
    'Stregone': {
        weapons: [{ name: 'Pugnale', damage: '1d4', type: 'melee', finesse: true }],
        backupWeapons: [],
        armor: null,
        shield: false,
        other: ['Focus Arcano', 'Zaino da Studioso', 'Componenti']
    },
    'Warlock': {
        weapons: [{ name: 'Pugnale', damage: '1d4', type: 'melee', finesse: true }],
        backupWeapons: [],
        armor: null,
        shield: false,
        other: ['Focus Arcano', 'Libro delle Ombre', 'Zaino da Speleologo']
    }
};

// Oggetti magici per rarità e livello appropriato
// Nomi corrispondenti al database magicItems.js (SRD + varianti +N)
const MAGIC_ITEMS_BY_RARITY = {
    common: [
        'Pozione Di Scalare',
        'Armatura Di Cuoio Borchiato Incantata',
        'Anello Della Vista Ai Raggi X'
    ],
    uncommon: [
        'Borsa Conservante',
        'Mantello Elfico',
        'Stivali Elfici',
        'Armatura in Adamantio',
        'Armatura In Mithral',
        'Mantello della Protezione',
        'Stivali Molleggiati',
        'Stivali delle Terre Invernali',
        'Stivali Alati',
        'Spilla di Protezione',
        'Cappello Del Camuffamento',
        'Unguento Di Keoghtom',
        'Perla Del Potere',
        'Pantofole Del Ragno',
        'Corda Per Scalare',
        'Lanterna Della Rivelazione',
        'Fascia Dellintelletto',
        'Pozione Di Resistenza',
        'Pozione Del Respirare Sottacqua',
        'Pozione Di Crescita',
        'Guanti Catturaproiettili',
        'Faretra Di Ehlonna',
        'Scopa Volante',
        'Munizioni, +1'
    ],
    rare: [
        'Armatura della Resistenza',
        'Armatura, +1',
        'Scudo Acchiappa-Frecce',
        'Amuleto della Salute',
        'Cintura della Forza dei Giganti delle Colline',
        'Stivali della Velocità',
        'Stivali della Levitazione',
        'Cintura della Stirpe Nanica',
        'Grano di Forza',
        'Mantello dello Spostamento',
        'Cotta Elfica',
        'Barca Pieghevole',
        'Ascia del Berserker',
        'Pugnale del Veleno',
        'Sacco dei Fagioli',
        'Munizioni, +2'
    ],
    veryRare: [
        'Armatura, +2',
        'Spada Danzante',
        'Munizioni, +3',
        'Cintura della Forza dei Giganti del Fuoco',
        'Cintura della Forza dei Giganti del Gelo',
        'Cintura della Forza dei Giganti delle Pietre',
        'Amuleto dei Piani',
        'Freccia dell\'Uccisione',
        'Sacco del Divoratore',
        'Scudo Animato',
        'Tappeto Volante',
        'Armatura di Scaglie di Drago'
    ],
    legendary: [
        'Armatura, +3',
        'Armatura dell\'Invulnerabilità',
        'Martello dei Fulmini',
        'Cintura della Forza dei Giganti delle Tempeste',
        'Cintura della Forza dei Giganti delle Nuvole',
        'Spada Vorpal',
        'Mazzo Delle Meraviglie',
        'Apparato del Granchio',
        'Cubo dei Portali'
    ]
};

function getRarityForLevel(level) {
    if (level >= 17) return ['legendary', 'veryRare', 'rare'];
    if (level >= 11) return ['veryRare', 'rare', 'uncommon'];
    if (level >= 5) return ['rare', 'uncommon', 'common'];
    if (level >= 3) return ['uncommon', 'common'];
    return ['common'];
}

function generateEquipment(classData, abilities, level, selectedPackIndex = null) {
    const equipment = {
        weapons: [],
        armor: null,
        shield: false,
        other: [],
        magicItems: [],
        consumables: [],
        pack: null,           // Info sulla dotazione selezionata
        packItems: []         // Oggetti espansi dalla dotazione
    };
    
    const className = classData.classe;
    const classEquip = CLASS_EQUIPMENT[className] || CLASS_EQUIPMENT['Guerriero'];
    
    // Armi principali
    equipment.weapons = [...classEquip.weapons];
    
    // Arma secondaria
    if (classEquip.backupWeapons && classEquip.backupWeapons.length > 0) {
        equipment.weapons.push(pickRandom(classEquip.backupWeapons));
    }
    
    // Arma a distanza
    if (classEquip.ranged) {
        equipment.weapons.push({ ...classEquip.ranged });
    }
    
    // Armatura
    equipment.armor = classEquip.armor;
    equipment.shield = classEquip.shield;
    
    // Gestione dotazione
    if (selectedPackIndex) {
        const pack = getEquipmentPackByIndex(selectedPackIndex);
        if (pack) {
            equipment.pack = {
                index: pack.index,
                name: pack.name,
                cost: pack.cost
            };
            equipment.packItems = expandPackContents(pack);
        }
    } else {
        // Se nessuna dotazione selezionata, usa equipaggiamento base
        equipment.other = [...classEquip.other];
    }
    
    // Aggiungi equipaggiamento in base al livello
    if (level >= 1) {
        // Pozioni base per tutti
        const healingPotions = Math.min(3, Math.ceil(level / 2));
        for (let i = 0; i < healingPotions; i++) {
            equipment.consumables.push('Pozione di Guarigione');
        }
    }
    
    if (level >= 2 && !selectedPackIndex) {
        equipment.other.push('Borsa da Viaggiatore');
    }
    
    if (level >= 3 && !selectedPackIndex) {
        // Aggiungi funi e strumenti utili
        equipment.other.push('Corda (15m)');
        equipment.other.push('Acciarino');
        
        // Pozioni aggiuntive
        equipment.consumables.push('Antitossina');
    }
    
    // Per classi che usano munizioni
    if (['Ladro', 'Ranger', 'Guerriero'].includes(className)) {
        equipment.other.push('Faretra (20 frecce)');
        if (level >= 5) {
            equipment.other.push('Faretra aggiuntiva');
        }
    }
    
    // Oggetti magici per livelli più alti
    if (level >= 5) {
        const rarities = getRarityForLevel(level);
        const numMagicItems = Math.min(2, Math.floor(level / 4));
        
        for (let i = 0; i < numMagicItems; i++) {
            const rarity = pickRandom(rarities);
            const items = MAGIC_ITEMS_BY_RARITY[rarity] || MAGIC_ITEMS_BY_RARITY['common'];
            const item = pickRandom(items);
            if (!equipment.magicItems.includes(item)) {
                equipment.magicItems.push(item);
            }
        }
        
        // Pozioni migliori per livelli alti
        if (level >= 7) {
            equipment.consumables.push('Pozione di Guarigione Maggiore');
        }
        if (level >= 11) {
            equipment.consumables.push('Pozione di Guarigione Superiore');
        }
    }
    
    // Equipaggiamento specifico per classe
    if (className === 'Guerriero' || className === 'Paladino') {
        if (level >= 3) {
            equipment.other.push('Kit da Riparazione');
        }
        if (level >= 5) {
            equipment.weapons.push({ name: pickRandom(['Spada lunga', 'Ascia da Battaglia', 'Martello da guerra']), damage: '1d8', type: 'melee' });
        }
    }
    
    if (className === 'Mago' && level >= 5) {
        equipment.other.push('Pergamena di Incantesimo (casuale)');
    }
    
    if (className === 'Chierico' && level >= 5) {
        equipment.other.push('Acqua Santa (2 fiale)');
    }
    
    if (className === 'Ladro' && level >= 3) {
        equipment.other.push('Veleno (1 dose)');
    }
    
    // Rimuovi duplicati
    equipment.other = [...new Set(equipment.other)];
    equipment.consumables = [...new Set(equipment.consumables)];
    
    return equipment;
}

// ─────────────────────────────────────────────────────────────
// GENERAZIONE PRIVILEGI
// ─────────────────────────────────────────────────────────────

function getFeaturesForLevel(classData, level) {
    const features = [];
    
    if (classData.tabella_progressione) {
        classData.tabella_progressione.forEach(row => {
            if (row.livello <= level && row.privilegi) {
                row.privilegi.forEach(p => {
                    if (!features.includes(p)) {
                        features.push(p);
                    }
                });
            }
        });
    }
    
    return features;
}

function getRacialTraits(race) {
    return race.traits?.map(t => t.name) || [];
}

// ─────────────────────────────────────────────────────────────
// GENERAZIONE PRINCIPALE
// ─────────────────────────────────────────────────────────────

function generateNPC(className, raceName, level, options = {}) {
    const {
        focus = 'balanced',
        variability = 'medium',
        customName = null,
        gender = 'random',
        selectedPack = null  // Index della dotazione selezionata
    } = options;
    
    const classData = getClassByName(className);
    const raceData = getRaceByName(raceName);
    
    if (!classData || !raceData) {
        console.error('Classe o razza non trovata:', className, raceName);
        return null;
    }
    
    // Genera statistiche
    let abilities = generateAbilityScores(className, focus, variability);
    abilities = applyRacialBonuses(abilities, raceData);
    abilities = applyASI(abilities, level, className);
    
    // Calcoli derivati
    const profBonus = getProficiencyBonus(level);
    const conMod = getModifier(abilities['cos']);
    const hp = calculateHP(classData, level, conMod);
    const ac = calculateAC(abilities, classData);
    const attackBonus = calculateAttackBonus(abilities, classData, profBonus);
    const spellDC = calculateSpellDC(abilities, classData, profBonus);
    
    // Genera nome
    const actualGender = gender === 'random' ? pickRandom(['male', 'female']) : gender;
    const name = customName || generateName(actualGender);
    
    // Genera incantesimi se caster
    const spells = generateSpells(className, level, abilities);
    
    // Genera equipaggiamento (passa il livello e la dotazione selezionata)
    const equipment = generateEquipment(classData, abilities, level, selectedPack);
    
    // Ottieni privilegi
    const features = getFeaturesForLevel(classData, level);
    const racialTraits = getRacialTraits(raceData);
    
    return {
        name,
        gender: actualGender,
        className,
        raceName,
        level,
        abilities,
        profBonus,
        hp,
        ac,
        attackBonus,
        spellDC,
        speed: raceData.speed || 9,
        size: raceData.size || 'Media',
        features,
        racialTraits,
        spells,
        equipment,
        hitDie: classData.hit_die || 8,
        savingThrows: classData.saving_throws || [],
        spellAbility: getSpellAbility(className)
    };
}

function generateName(gender) {
    const names = gender === 'female' ? NAMES_FEMALE : NAMES_MALE;
    return `${pickRandom(names)} ${pickRandom(SURNAMES)}`;
}

// ─────────────────────────────────────────────────────────────
// INTERFACCIA UTENTE
// ─────────────────────────────────────────────────────────────

const QuickBuilder = {
    render(containerElement) {
        // Ottieni le dotazioni disponibili
        const equipmentPacks = getEquipmentPacks();
        
        containerElement.innerHTML = `
            <div class="quick-builder-layout">
                <!-- Colonna Sinistra: Controlli e Input -->
                <div class="qb-sidebar">
                    <div class="qb-sidebar-content">
                        <div class="qb-header">
                            <h2>⚔️ Creazione Rapida</h2>
                            <p class="qb-subtitle">Genera PNG completi con statistiche, incantesimi ed equipaggiamento</p>
                        </div>
                        
                        <div class="qb-controls-container">
                            <div class="qb-controls">
                                <div class="qb-control-group">
                                    <label>Classe</label>
                                    <select id="qb-class">
                                        ${classDatabase.map(c => `<option value="${c.classe}">${c.classe}</option>`).join('')}
                                    </select>
                                </div>
                                
                                <div class="qb-control-group">
                                    <label>Razza</label>
                                    <select id="qb-race">
                                        ${raceDatabase.map(r => `<option value="${r.name}">${r.name}</option>`).join('')}
                                    </select>
                                </div>
                                
                                <div class="qb-control-group">
                                    <label>Livello</label>
                                    <select id="qb-level">
                                        ${Array.from({length: 20}, (_, i) => `<option value="${i+1}" ${i===2 ? 'selected' : ''}>${i+1}</option>`).join('')}
                                    </select>
                                </div>
                                
                                <div class="qb-control-group">
                                    <label>Dotazione</label>
                                    <select id="qb-pack">
                                        <option value="">-- Nessuna (default) --</option>
                                        ${equipmentPacks.map(pack => {
                                            const cost = pack.cost ? `${pack.cost.quantity} ${pack.cost.unit}` : '';
                                            return `<option value="${pack.index}">${pack.name} (${cost})</option>`;
                                        }).join('')}
                                    </select>
                                    <span class="qb-hint" id="qb-pack-hint"></span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="qb-options-section">
                            <div class="qb-options-title">⚙️ Opzioni Avanzate</div>
                            <div class="qb-options-grid">
                                <div class="qb-control-group">
                                    <label>Focus</label>
                                    <select id="qb-focus">
                                        <option value="balanced">Bilanciato</option>
                                        <option value="offensive">Offensivo</option>
                                        <option value="defensive">Difensivo</option>
                                        <option value="random">Casuale</option>
                                    </select>
                                </div>
                                
                                <div class="qb-control-group">
                                    <label>Variabilità</label>
                                    <select id="qb-variability">
                                        <option value="fixed">Fissa</option>
                                        <option value="low">Bassa</option>
                                        <option value="medium" selected>Media</option>
                                        <option value="high">Alta</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="qb-buttons-container">
                            <button class="qb-btn qb-btn-primary" id="qb-generate">
                                🎲 Genera Personaggio
                            </button>
                            <button class="qb-btn qb-btn-secondary" id="qb-generate-5">
                                🎲 Genera x5 PNG
                            </button>
                            <button class="qb-btn qb-btn-tertiary" id="qb-clear">
                                🗑️ Cancella Risultati
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Colonna Destra: Risultati con Scroll Verticale -->
                <div class="qb-content">
                    <div class="qb-results" id="qb-results">
                        <div class="qb-placeholder">
                            <div class="qb-placeholder-icon">📜</div>
                            <p>Seleziona le opzioni e clicca "Genera" per creare un personaggio</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Event listeners
        containerElement.querySelector('#qb-generate').addEventListener('click', () => this.generateSingle(containerElement));
        containerElement.querySelector('#qb-generate-5').addEventListener('click', () => this.generateMultiple(containerElement, 5));
        containerElement.querySelector('#qb-clear').addEventListener('click', () => this.clearResults(containerElement));
        
        // Aggiorna dotazione suggerita quando cambia la classe
        const classSelect = containerElement.querySelector('#qb-class');
        const packSelect = containerElement.querySelector('#qb-pack');
        
        const updatePackSuggestion = () => {
            const className = classSelect.value;
            const suggestedPack = CLASS_PACK_SUGGESTIONS[className];
            if (suggestedPack) {
                packSelect.value = suggestedPack;
            }
        };
        
        classSelect.addEventListener('change', updatePackSuggestion);
        
        // Imposta la dotazione suggerita iniziale
        updatePackSuggestion();
    },
    
    clearResults(containerElement) {
        const resultsContainer = containerElement.querySelector('#qb-results');
        resultsContainer.innerHTML = `
            <div class="qb-placeholder">
                <div class="qb-placeholder-icon">📜</div>
                <p>Seleziona le opzioni e clicca "Genera" per creare un personaggio</p>
            </div>
        `;
    },
    
    generateSingle(containerElement) {
        const className = containerElement.querySelector('#qb-class').value;
        const raceName = containerElement.querySelector('#qb-race').value;
        const level = parseInt(containerElement.querySelector('#qb-level').value);
        const focus = containerElement.querySelector('#qb-focus').value;
        const variability = containerElement.querySelector('#qb-variability').value;
        const selectedPack = containerElement.querySelector('#qb-pack').value || null;
        
        const npc = generateNPC(className, raceName, level, { focus, variability, selectedPack });
        
        const resultsContainer = containerElement.querySelector('#qb-results');
        resultsContainer.innerHTML = this.renderNPCCard(npc);
        
        // Add event listener for copy button
        const copyBtn = resultsContainer.querySelector('.qb-copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyNPC(npc));
        }
    },
    
    generateMultiple(containerElement, count) {
        const className = containerElement.querySelector('#qb-class').value;
        const raceName = containerElement.querySelector('#qb-race').value;
        const level = parseInt(containerElement.querySelector('#qb-level').value);
        const focus = containerElement.querySelector('#qb-focus').value;
        const variability = containerElement.querySelector('#qb-variability').value;
        const selectedPack = containerElement.querySelector('#qb-pack').value || null;
        
        const npcs = [];
        for (let i = 0; i < count; i++) {
            npcs.push(generateNPC(className, raceName, level, { focus, variability, selectedPack }));
        }
        
        const resultsContainer = containerElement.querySelector('#qb-results');
        resultsContainer.innerHTML = `
            <div class="qb-multiple-results">
                ${npcs.map(npc => this.renderNPCCard(npc, true)).join('')}
            </div>
        `;
    },
    
    renderNPCCard(npc, compact = false) {
        const abilityLabels = ['for', 'des', 'cos', 'int', 'sag', 'car'];
        
        let attacksHTML = '';
        if (npc.equipment.weapons.length > 0) {
            attacksHTML = npc.equipment.weapons.map(w => {
                if (!w.damage) return '';
                const usesDex = w.finesse || w.type === 'ranged';
                const mod = usesDex ? getModifier(npc.abilities['des']) : getModifier(npc.abilities['for']);
                const totalMod = npc.profBonus + mod;
                const damageMod = mod >= 0 ? `+${mod}` : mod;
                return `<span class="qb-attack"><strong>${w.name}</strong> ${totalMod >= 0 ? '+' : ''}${totalMod} (${w.damage}${damageMod})</span>`;
            }).join('');
        }
        
        let spellsHTML = '';
        if (npc.spells && npc.spells.cantrips.length > 0) {
            spellsHTML = `
                <div class="qb-spells-section">
                    <strong>Trucchetti:</strong> ${npc.spells.cantrips.join(', ')}<br>
                    <strong>Incantesimi:</strong> ${npc.spells.spells.map(s => s.name).join(', ')}
                    ${npc.spells.dc ? `<br><strong>CD Incantesimi:</strong> ${npc.spells.dc}` : ''}
                </div>
            `;
        }
        
        return `
            <div class="qb-npc-card ${compact ? 'qb-compact' : ''}">
                <div class="qb-npc-header">
                    <h3>${escapeHtml(npc.name)}</h3>
                    <span class="qb-npc-subtitle">${npc.raceName} ${npc.className} ${npc.level}° Liv.</span>
                    <button class="qb-copy-btn" title="Copia negli appunti">📋</button>
                </div>
                
                <div class="qb-npc-body">
                    <div class="qb-abilities">
                        ${abilityLabels.map(ab => {
                            const score = npc.abilities[ab];
                            const mod = getModifier(score);
                            return `
                                <div class="qb-ability">
                                    <span class="qb-abil-name">${ABILITY_NAMES_IT[ab]}</span>
                                    <span class="qb-abil-score">${score}</span>
                                    <span class="qb-abil-mod">(${mod >= 0 ? '+' : ''}${mod})</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    
                    <div class="qb-stats-row">
                        <div class="qb-stat"><strong>PF</strong> ${npc.hp}</div>
                        <div class="qb-stat"><strong>CA</strong> ${npc.ac}</div>
                        <div class="qb-stat"><strong>Velocità</strong> ${npc.speed}m</div>
                        <div class="qb-stat"><strong>Bonus Prof.</strong> +${npc.profBonus}</div>
                    </div>
                    
                    ${attacksHTML ? `<div class="qb-attacks">${attacksHTML}</div>` : ''}
                    
                    ${spellsHTML}
                    
                    ${npc.racialTraits.length > 0 ? `
                        <div class="qb-traits">
                            <strong>Tratti Razziali:</strong> ${npc.racialTraits.join(', ')}
                        </div>
                    ` : ''}
                    
                    ${npc.features.length > 0 ? `
                        <div class="qb-features">
                            <strong>Privilegi:</strong> ${npc.features.slice(0, 5).join(', ')}${npc.features.length > 5 ? '...' : ''}
                        </div>
                    ` : ''}
                    
                    ${npc.equipment.armor || npc.equipment.other.length > 0 || npc.equipment.magicItems?.length > 0 || npc.equipment.consumables?.length > 0 || npc.equipment.packItems?.length > 0 ? `
                        <div class="qb-equipment">
                            <strong>Equipaggiamento:</strong> 
                            ${npc.equipment.armor ? npc.equipment.armor : ''}
                            ${npc.equipment.shield ? ', Scudo' : ''}
                            ${npc.equipment.other.length > 0 ? ', ' + npc.equipment.other.join(', ') : ''}
                        </div>
                        ${npc.equipment.pack && npc.equipment.packItems.length > 0 ? `
                            <div class="qb-pack-items">
                                <strong>📦 ${npc.equipment.pack.name}:</strong> 
                                <span class="qb-pack-contents">${npc.equipment.packItems.map(item => item.displayName || item.name).join(', ')}</span>
                            </div>
                        ` : ''}
                        ${npc.equipment.magicItems && npc.equipment.magicItems.length > 0 ? `
                            <div class="qb-magic-items">
                                <strong>Oggetti Magici:</strong> ${npc.equipment.magicItems.join(', ')}
                            </div>
                        ` : ''}
                        ${npc.equipment.consumables && npc.equipment.consumables.length > 0 ? `
                            <div class="qb-consumables">
                                <strong>Consumabili:</strong> ${npc.equipment.consumables.join(', ')}
                            </div>
                        ` : ''}
                    ` : ''}
                </div>
            </div>
        `;
    },
    
    copyNPC(npc) {
        const text = this.formatNPCAsText(npc);
        navigator.clipboard.writeText(text).then(() => {
            // Show brief feedback
            const btn = document.querySelector('.qb-copy-btn');
            if (btn) {
                btn.textContent = '✓';
                setTimeout(() => btn.textContent = '📋', 1000);
            }
        });
    },
    
    formatNPCAsText(npc) {
        const abilityLabels = ['for', 'des', 'cos', 'int', 'sag', 'car'];
        
        let text = `${npc.name} - ${npc.raceName} ${npc.className} ${npc.level}° Livello\n`;
        text += '─'.repeat(50) + '\n\n';
        
        text += 'CARATTERISTICHE:\n';
        abilityLabels.forEach(ab => {
            const score = npc.abilities[ab];
            const mod = getModifier(score);
            text += `  ${ABILITY_NAMES_IT[ab]}: ${score} (${mod >= 0 ? '+' : ''}${mod})\n`;
        });
        
        text += `\nSTATISTICHE:\n`;
        text += `  Punti Ferita: ${npc.hp}\n`;
        text += `  Classe Armatura: ${npc.ac}\n`;
        text += `  Velocità: ${npc.speed}m\n`;
        text += `  Bonus Competenza: +${npc.profBonus}\n`;
        
        if (npc.equipment.weapons.length > 0) {
            text += `\nATTACCHI:\n`;
            npc.equipment.weapons.forEach(w => {
                if (!w.damage) return;
                const usesDex = w.finesse || w.type === 'ranged';
                const mod = usesDex ? getModifier(npc.abilities['des']) : getModifier(npc.abilities['for']);
                const totalMod = npc.profBonus + mod;
                text += `  ${w.name}: ${totalMod >= 0 ? '+' : ''}${totalMod} per colpire, ${w.damage}${mod >= 0 ? '+' : ''}${mod} danni\n`;
            });
        }
        
        if (npc.spells && npc.spells.cantrips.length > 0) {
            text += `\nINCANTESIMI:\n`;
            text += `  CD: ${npc.spells.dc}\n`;
            text += `  Trucchetti: ${npc.spells.cantrips.join(', ')}\n`;
            text += `  Incantesimi: ${npc.spells.spells.map(s => s.name).join(', ')}\n`;
        }
        
        if (npc.racialTraits.length > 0) {
            text += `\nTRATTI RAZZIALI:\n  ${npc.racialTraits.join(', ')}\n`;
        }
        
        if (npc.features.length > 0) {
            text += `\nPRIVILEGI:\n  ${npc.features.join(', ')}\n`;
        }
        
        if (npc.equipment.armor || npc.equipment.other.length > 0 || (npc.equipment.packItems && npc.equipment.packItems.length > 0)) {
            text += `\nEQUIPAGGIAMENTO:\n`;
            if (npc.equipment.armor) text += `  ${npc.equipment.armor}`;
            if (npc.equipment.shield) text += `, Scudo`;
            if (npc.equipment.other.length > 0) text += `, ${npc.equipment.other.join(', ')}`;
            text += '\n';
            
            // Aggiungi contenuti della dotazione
            if (npc.equipment.pack && npc.equipment.packItems.length > 0) {
                text += `\nDOTAZIONE (${npc.equipment.pack.name}):\n`;
                npc.equipment.packItems.forEach(item => {
                    text += `  • ${item.displayName || item.name}\n`;
                });
            }
        }
        
        if (npc.equipment.magicItems && npc.equipment.magicItems.length > 0) {
            text += `\nOGGETTI MAGICI:\n  ${npc.equipment.magicItems.join(', ')}\n`;
        }
        
        if (npc.equipment.consumables && npc.equipment.consumables.length > 0) {
            text += `\nCONSUMABILI:\n  ${npc.equipment.consumables.join(', ')}\n`;
        }
        
        return text;
    }
};

export default QuickBuilder;
