/**
 * combatStateManager.js
 * ─────────────────────────────────────────────────────────────
 * Modulo per la gestione dello stato di combattimento.
 * Gestisce mostri, iniziativa, turni, round e condizioni.
 * 
 * @version 1.0.0 - Estratto da stateManager.js
 * 
 * Posizione nel progetto: js/services/combatStateManager.js
 */

import { monsterDatabase } from '../../database/monsterDatabase.js';
import { classDatabase } from '../../database/classDatabase.js';
import { rollDice } from '../../utils/dice.js';
import { getConditionSummaries } from '../../database/conditions.js';
import { showToast } from '../../utils/toast.js';
import { 
    safeLocalStorageSet, 
    safeLocalStorageGet, 
    getCampaignStorageKey,
    APP_VERSION 
} from './storageHelper.js';
import { getCurrentCampaignId } from './campaignManager.js';

// --- STATO INTERNO ---
let combatState = [];           // Array dei combattenti
let initiativeOrder = [];       // Ordine di iniziativa
let currentRound = 0;           // Round corrente (0 = non iniziato)
let currentTurnMonsterId = null; // ID del mostro nel turno corrente
let subscribers = [];           // Callback per notifiche stato

// --- CONDITION SUMMARIES (caricati dal database centralizzato) ---
let conditionSummaries = {};

/**
 * Inizializza i summary delle condizioni dal database.
 */
function initializeConditionSummaries() {
    conditionSummaries = getConditionSummaries();
    console.log('📋 [CombatStateManager] Condition summaries caricati:', Object.keys(conditionSummaries).length);
}

// Inizializzazione all'avvio del modulo
initializeConditionSummaries();

// --- FUNZIONI HELPER ---

/**
 * Calcola il modificatore di una caratteristica.
 * @param {number} score - Il punteggio della caratteristica
 * @returns {number} Il modificatore
 */
function getAbilityModifier(score) {
    return Math.floor((score - 10) / 2);
}

/**
 * Inizializza lo stato degli incantesimi per un mostro incantatore.
 * @param {Object} monster - Il mostro da inizializzare
 */
/**
 * Inizializza il tracciamento degli usi delle abilità con limiti.
 * @param {Array} actions - Le azioni del mostro
 * @param {Array} specialAbilities - Le abilità speciali
 * @returns {Object} Oggetto con il tracciamento usi
 */
function initializeAbilityUses(actions, specialAbilities) {
    const uses = {};
    
    // Controlla le azioni con usage limitato
    actions.forEach(action => {
        if (action.usage) {
            const key = `action_${action.name}`;
            uses[key] = {
                name: action.name,
                max: action.usage.times || 1,
                current: action.usage.times || 1,
                resetType: action.usage.type || 'per day'
            };
        }
    });
    
    // Controlla le abilità speciali con usage limitato
    specialAbilities.forEach(ability => {
        if (ability.usage) {
            const key = `ability_${ability.name}`;
            uses[key] = {
                name: ability.name,
                max: ability.usage.times || 1,
                current: ability.usage.times || 1,
                resetType: ability.usage.type || 'per day'
            };
        }
    });
    
    return uses;
}

function initializeMonsterSpells(monster) {
    // Cerca l'abilità di spellcasting con vari nomi possibili
    const spellcastingAbility = monster.special_abilities?.find(
        a => a.name === 'Incantamento' || 
             a.name === 'Spellcasting' || 
             a.name === 'Incantesimi' ||
             a.name === 'Lancio degli Incantesimi' ||
             a.name === 'Lancio degli Incantesimi Innato' ||
             a.spellcasting !== undefined
    );
    
    if (!spellcastingAbility || !spellcastingAbility.spellcasting) return;
    
    console.log(`🧙‍♂️ [CombatStateManager] Inizializzazione incantesimi per ${monster.name}`);
    
    const spellcasting = spellcastingAbility.spellcasting;
    const allSpells = spellcasting.spells || [];
    const remainingSlots = { ...spellcasting.slots };
    const spellsByLevel = {};
    const atWillSpells = [];      // A volontà
    const perDaySpells = [];      // X al giorno
    const normalSpells = [];      // Con slot
    
    // Raggruppa incantesimi per tipo e livello
    allSpells.forEach(spell => {
        const level = spell.level || 0;
        if (!spellsByLevel[level]) spellsByLevel[level] = [];
        spellsByLevel[level].push(spell);
        
        // Classifica per tipo di utilizzo
        if (spell.usage?.type === 'a volontà' || spell.usage?.type === 'at will') {
            atWillSpells.push(spell);
        } else if (spell.usage?.type === 'per day' || spell.usage?.times) {
            perDaySpells.push({
                ...spell,
                usesRemaining: spell.usage.times || 1,
                maxUses: spell.usage.times || 1
            });
        } else {
            normalSpells.push(spell);
        }
    });
    
    // Per gli incantesimi con slot, prepariamo tutti quelli che hanno slot disponibili
    const preparedSpells = [];
    for (const level in spellsByLevel) {
        const spellLevel = parseInt(level, 10);
        if (spellLevel > 0 && (remainingSlots[spellLevel] > 0 || remainingSlots[spellLevel] === undefined)) {
            // Se non ci sono slot definiti ma ci sono incantesimi di quel livello, li aggiungiamo comunque
            const spellsOfThisLevel = spellsByLevel[level].filter(s => !s.usage);
            preparedSpells.push(...spellsOfThisLevel);
        }
    }
    
    // Calcola CD e attack bonus se non presenti
    const ability = spellcasting.ability?.name || 'INT';
    const abilityScore = monster[ability.toLowerCase()] || 10;
    const abilityMod = getAbilityModifier(abilityScore);
    const profBonus = monster.proficiency_bonus || 2;
    
    const dc = spellcasting.dc || (8 + profBonus + abilityMod);
    const attackBonus = spellcasting.modifier !== undefined ? spellcasting.modifier : (profBonus + abilityMod);
    
    monster.spellState = {
        preparedSpells: preparedSpells,
        remainingSlots: remainingSlots,
        cantrips: spellsByLevel[0] || [],
        atWillSpells: atWillSpells,       // Incantesimi a volontà
        perDaySpells: perDaySpells,       // Incantesimi X/giorno
        allSpells: allSpells,             // Tutti gli incantesimi
        dc: dc,
        attackBonus: attackBonus,
        ability: ability,
        level: spellcasting.level || 0,
        school: spellcasting.school || ''
    };
    
    console.log(`🧙‍♂️ [CombatStateManager] ${monster.name}: ${allSpells.length} incantesimi, CD ${dc}, +${attackBonus} per colpire`);
}

// --- SISTEMA DI SOTTOSCRIZIONE ---

/**
 * Sottoscrive una callback per ricevere notifiche sui cambiamenti di stato.
 * @param {Function} callback - La funzione da chiamare quando lo stato cambia
 */
export function subscribe(callback) {
    console.log("🟢 [CombatStateManager] Nuovo sottoscrittore registrato.");
    subscribers.push(callback);
    // Chiama immediatamente la callback con lo stato corrente
    callback(combatState, currentRound, currentTurnMonsterId, initiativeOrder);
}

/**
 * Notifica tutti i sottoscrittori di un cambiamento di stato.
 */
function notifySubscribers() {
    console.log("📢 [CombatStateManager] Notifica sottoscrittori.", {
        combatants: combatState.length,
        round: currentRound,
        turn: currentTurnMonsterId
    });
    subscribers.forEach(callback => {
        try {
            callback(combatState, currentRound, currentTurnMonsterId, initiativeOrder);
        } catch (error) {
            console.error('❌ [CombatStateManager] Errore nel sottoscrittore:', error);
        }
    });
    saveState();
}

// --- PERSISTENZA STATO ---

/**
 * Salva lo stato corrente nel localStorage.
 */
function saveState() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) {
        console.warn("⚠️ [CombatStateManager] Nessuna campagna selezionata. Impossibile salvare.");
        return;
    }
    
    // NOTA: campaignPcs viene gestito da pcManager.js, qui salviamo solo il combattimento
    const stateToSave = {
        version: APP_VERSION,
        combatants: combatState,
        initiativeOrder: initiativeOrder,
        round: currentRound,
        turn: currentTurnMonsterId
    };
    
    // Leggiamo lo stato esistente per preservare i PG
    const existingState = safeLocalStorageGet(getCampaignStorageKey(campaignId), {});
    stateToSave.pcs = existingState.pcs || [];
    
    safeLocalStorageSet(getCampaignStorageKey(campaignId), stateToSave);
    console.log(`💾 [CombatStateManager] Stato salvato per campagna ${campaignId}.`);
}

/**
 * Carica lo stato dal localStorage.
 */
export function loadState() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) {
        console.warn("⚠️ [CombatStateManager] Nessuna campagna selezionata.");
        clearCombat(false); // Non notificare, stiamo solo resettando
        return;
    }
    
    const savedState = safeLocalStorageGet(getCampaignStorageKey(campaignId), null);

    if (savedState) {
        combatState = savedState.combatants || [];
        initiativeOrder = savedState.initiativeOrder || [];
        currentRound = savedState.round || 0;
        currentTurnMonsterId = savedState.turn || null;
        
        console.log(`📂 [CombatStateManager] Stato caricato per campagna ${campaignId}. Combattenti: ${combatState.length}`);
        notifySubscribers();
    } else {
        console.log(`📂 [CombatStateManager] Nessuno stato trovato per campagna ${campaignId}. Inizializzazione vuota.`);
        clearCombat(false);
    }
}

// --- FUNZIONI DI GESTIONE COMBATTIMENTO ---

/**
 * Aggiunge un mostro al combattimento.
 * @param {Object} monsterData - I dati del mostro da aggiungere
 * @returns {Object|null} Il combattente creato o null se fallito
 */
export function addMonsterToCombat(monsterData) {
    console.log("➕ [CombatStateManager] Aggiunta mostro:", monsterData.name);
    
    const existingCount = combatState.filter(m => m.index === monsterData.index).length;
    const defaultCustomName = `${monsterData.name} #${existingCount + 1}`;
    const dexModifier = getAbilityModifier(monsterData.dexterity);
    const initiativeRoll = rollDice('1d20'); 
    const initialInitiative = initiativeRoll + dexModifier;
    
    // Conta le azioni leggendarie disponibili
    const legendaryActionsCount = (monsterData.legendary_actions || []).length;
    
    const newCombatant = {
        ...monsterData,
        id: Date.now() + Math.random(),
        customName: defaultCustomName,
        currentHp: monsterData.hit_points,
        maxHp: monsterData.hit_points,
        initiative: initialInitiative,
        conditions: [],
        tempHp: 0,
        // Tracciamento azioni per round
        actionTracker: {
            actionUsed: false,           // Azione standard usata
            bonusActionUsed: false,       // Azione bonus usata
            reactionUsed: false,          // Reazione usata
            legendaryActionsUsed: 0,      // Azioni leggendarie usate
            legendaryActionsMax: legendaryActionsCount > 0 ? 3 : 0, // Max 3 legendary actions per round
            // Tracciamento usi abilità (es. Asservire 3/giorno)
            abilityUses: initializeAbilityUses(monsterData.actions || [], monsterData.special_abilities || [])
        }
    };
    
    initializeMonsterSpells(newCombatant);
    combatState.push(newCombatant);
    
    // Se il combattimento è già iniziato, riordina l'iniziativa
    if (currentRound > 0) {
        initiativeOrder = [...combatState].sort((a, b) => {
            if (a.initiative === null) return 1;
            if (b.initiative === null) return -1;
            return b.initiative - a.initiative;
        });
    }
    
    console.log(`🧾 [CombatStateManager] ${newCombatant.customName} aggiunto. Iniziativa: ${initialInitiative} (${initiativeRoll}+${dexModifier})`);
    notifySubscribers();
    
    return newCombatant;
}

/**
 * Aggiunge un Personaggio Giocante (PG) al combattimento.
 * @param {Object} pcData - I dati del PG da aggiungere
 * @returns {Object|null} Il combattente creato o null se fallito
 */
export function addPcToCombat(pcData) {
    console.log("➕ [CombatStateManager] Aggiunta PG:", pcData.name);
    
    const dexModifier = getAbilityModifier(pcData.abilities?.dexterity || 10);
    const initiativeRoll = rollDice('1d20');
    const initialInitiative = initiativeRoll + dexModifier;
    
    // Calcola HP e CA dai dati PG
    const maxHp = pcData.hp?.max || pcData.hp || 10;
    const currentHp = pcData.hp?.current || maxHp;
    const ac = pcData.ac || 10;
    
    // Costruisci l'oggetto combattente dal PG
    const newCombatant = {
        id: Date.now() + Math.random(),
        // Identificazione
        index: pcData.id || pcData.index,
        name: pcData.name,
        customName: pcData.name, // PG mantiene il proprio nome
        sourceType: 'pc', // Flag per identificare il tipo
        
        // Statistiche base
        strength: pcData.abilities?.strength || 10,
        dexterity: pcData.abilities?.dexterity || 10,
        constitution: pcData.abilities?.constitution || 10,
        intelligence: pcData.abilities?.intelligence || 10,
        wisdom: pcData.abilities?.wisdom || 10,
        charisma: pcData.abilities?.charisma || 10,
        
        // Combat stats
        currentHp: currentHp,
        maxHp: maxHp,
        armor_class: [{ value: ac, type: 'calculated' }],
        hit_points: maxHp,
        speed: { walk: pcData.speed || 9 },
        
        // Iniziativa
        initiative: initialInitiative,
        
        // Condizioni
        conditions: [...(pcData.conditions || [])],
        tempHp: pcData.tempHp || 0,
        
        // Classe e livello
        className: pcData.className || pcData.class?.name || 'Unknown',
        classLevel: pcData.level || 1,
        challenge_rating: null, // PG non ha CR
        
        // Size e type per display
        size: 'Medium',
        type: 'Humanoid',
        alignment: pcData.alignment || 'Neutral',
        
        // Proficiency
        proficiencyBonus: pcData.proficiencyBonus || Math.ceil(pcData.level / 4) + 1,
        savingThrows: pcData.savingThrows || [],
        
        // Skills
        skills: pcData.skills || [],
        
        // Spell state per incantatori
        spellState: initializePcSpellState(pcData),
        
        // Riferimento al PG originale
        originalPcId: pcData.id,
        
        // Azioni di base (attacco arma principale)
        actions: generatePcActions(pcData),
        
        // Sensi base
        senses: {
            'Percezione passiva': 10 + getAbilityModifier(pcData.abilities?.wisdom || 10) + 
                (pcData.skills?.includes('Perception') ? (pcData.proficiencyBonus || 2) : 0)
        }
    };
    
    combatState.push(newCombatant);
    
    // Se il combattimento è già iniziato, riordina l'iniziativa
    if (currentRound > 0) {
        initiativeOrder = [...combatState].sort((a, b) => {
            if (a.initiative === null) return 1;
            if (b.initiative === null) return -1;
            return b.initiative - a.initiative;
        });
    }
    
    console.log(`🧾 [CombatStateManager] ${newCombatant.customName} (PG) aggiunto. Iniziativa: ${initialInitiative}`);
    showToast(`${pcData.name} aggiunto al combattimento!`, 'success');
    notifySubscribers();
    
    return newCombatant;
}

/**
 * Aggiunge un Personaggio Non Giocante (PNG) al combattimento.
 * @param {Object} npcData - I dati del PNG da aggiungere
 * @returns {Object|null} Il combattente creato o null se fallito
 */
export function addNpcToCombat(npcData) {
    console.log("➕ [CombatStateManager] Aggiunta PNG:", npcData.name);
    
    const dexModifier = getAbilityModifier(npcData.abilities?.des || npcData.abilities?.dexterity || 10);
    const initiativeRoll = rollDice('1d20');
    const initialInitiative = initiativeRoll + dexModifier;
    
    // HP e CA
    const maxHp = npcData.hp || 10;
    const ac = npcData.ac || 10;
    
    // Determina tag (alleato/nemico/neutrale)
    const tag = npcData.tag || 'neutrale';
    
    // Costruisci l'oggetto combattente dal PNG
    const newCombatant = {
        id: Date.now() + Math.random(),
        // Identificazione
        index: npcData.id,
        name: npcData.name,
        customName: npcData.name,
        sourceType: 'npc', // Flag per identificare il tipo
        tag: tag, // alleato, nemico, neutrale, etc.
        
        // Statistiche base (supporta sia formato IT che EN)
        strength: npcData.abilities?.for || npcData.abilities?.strength || 10,
        dexterity: npcData.abilities?.des || npcData.abilities?.dexterity || 10,
        constitution: npcData.abilities?.cos || npcData.abilities?.constitution || 10,
        intelligence: npcData.abilities?.int || npcData.abilities?.intelligence || 10,
        wisdom: npcData.abilities?.sag || npcData.abilities?.wisdom || 10,
        charisma: npcData.abilities?.car || npcData.abilities?.charisma || 10,
        
        // Combat stats
        currentHp: maxHp,
        maxHp: maxHp,
        armor_class: [{ value: ac, type: 'calculated' }],
        hit_points: maxHp,
        speed: { walk: npcData.speed || 9 },
        
        // Iniziativa
        initiative: initialInitiative,
        
        // Condizioni
        conditions: [],
        tempHp: 0,
        
        // Classe e livello
        className: npcData.className || 'NPC',
        classLevel: npcData.classLevel || npcData.level || 1,
        challenge_rating: null,
        
        // Size e type
        size: 'Medium',
        type: 'Humanoid',
        alignment: npcData.alignment || 'Neutral',
        
        // Proficiency
        proficiencyBonus: npcData.profBonus || 2,
        savingThrows: npcData.savingThrows || [],
        
        // Spell state
        spellState: initializeNpcSpellState(npcData),
        
        // Riferimento al PNG originale
        originalNpcId: npcData.id,
        
        // Azioni base
        actions: generateNpcActions(npcData),
        
        // Sensi
        senses: {
            'Percezione passiva': 10 + getAbilityModifier(npcData.abilities?.sag || npcData.abilities?.wisdom || 10)
        }
    };
    
    combatState.push(newCombatant);
    
    // Se il combattimento è già iniziato, riordina l'iniziativa
    if (currentRound > 0) {
        initiativeOrder = [...combatState].sort((a, b) => {
            if (a.initiative === null) return 1;
            if (b.initiative === null) return -1;
            return b.initiative - a.initiative;
        });
    }
    
    const tagLabel = tag === 'alleato' ? '(Alleato)' : tag === 'nemico' ? '(Nemico)' : '';
    console.log(`🧾 [CombatStateManager] ${newCombatant.customName} (PNG) ${tagLabel} aggiunto. Iniziativa: ${initialInitiative}`);
    showToast(`${npcData.name} ${tagLabel} aggiunto al combattimento!`, 'success');
    notifySubscribers();
    
    return newCombatant;
}

/**
 * Inizializza lo stato degli incantesimi per un PG.
 * Legge gli slot dal database delle classi in base al livello.
 * @param {Object} pcData - I dati del PG
 * @returns {Object|null} Lo stato degli incantesimi o null
 */
function initializePcSpellState(pcData) {
    // Verifica se la classe è un incantatore
    const className = pcData.className || pcData.class?.name || '';
    const pgLevel = pcData.level || pcData.classLevel || 1;
    
    // Trova la classe nel database
    const classData = findClassInDatabase(className);
    if (!classData || !classData.tabella_progressione) {
        return null; // Non è un incantatore
    }
    
    // Ottieni i dati di progressione per il livello
    const progression = classData.tabella_progressione.find(p => p.livello === pgLevel);
    if (!progression) {
        return null;
    }
    
    // Estrai gli slot dalla progressione
    const maxSlots = {};
    const remainingSlots = {};
    
    for (let level = 1; level <= 9; level++) {
        const slotKey = `slot_${level}`;
        const slots = progression[slotKey];
        if (slots && slots > 0) {
            maxSlots[level] = slots;
            remainingSlots[level] = slots;
        }
    }
    
    // Se non ci sono slot, non è un incantatore attivo
    if (Object.keys(maxSlots).length === 0) {
        return null;
    }
    
    // Calcola CD e attack bonus
    const spellAbility = getSpellcastingAbility(className);
    const abilityMod = getAbilityModifier(pcData.abilities?.[spellAbility] || 10);
    const profBonus = pcData.proficiencyBonus || Math.ceil(pgLevel / 4) + 1;
    
    return {
        remainingSlots: remainingSlots,
        maxSlots: maxSlots,
        cantrips: [], // I PG non mostrano nomi incantesimi, solo slot
        preparedSpells: [],
        dc: 8 + profBonus + abilityMod,
        attackBonus: profBonus + abilityMod,
        ability: spellAbility,
        isPcCaster: true // Flag per identificare che è un PG incantatore
    };
}

/**
 * Trova una classe nel database per nome (italiano o inglese).
 * @param {string} className - Nome della classe
 * @returns {Object|null} Dati della classe o null
 */
function findClassInDatabase(className) {
    if (!className || !classDatabase) return null;
    
    const normalized = className.toLowerCase().trim();
    
    return classDatabase.find(c => {
        const index = (c.index || '').toLowerCase();
        const name = (c.classe || c.name || '').toLowerCase();
        return index === normalized || name === normalized ||
               index.includes(normalized) || name.includes(normalized);
    });
}

/**
 * Calcola gli slot incantesimi per classe e livello.
 * @param {string} className - Nome della classe
 * @param {number} level - Livello del personaggio
 * @returns {Object} Slot per livello { 1: 4, 2: 3, ... }
 */
function calculateSpellSlotsForClass(className, level) {
    // Tabella slot per full casters
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
        17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
        18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
        19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
        20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 }
    };
    
    // Tabella slot per half-casters
    const halfCasterSlots = {
        1: {}, 2: { 1: 2 }, 3: { 1: 3 }, 4: { 1: 3 }, 5: { 1: 4, 2: 2 },
        6: { 1: 4, 2: 2 }, 7: { 1: 4, 2: 3 }, 8: { 1: 4, 2: 3 },
        9: { 1: 4, 2: 3, 3: 2 }, 10: { 1: 4, 2: 3, 3: 2 },
        11: { 1: 4, 2: 3, 3: 2 }, 12: { 1: 4, 2: 3, 3: 2 },
        13: { 1: 4, 2: 3, 3: 3 }, 14: { 1: 4, 2: 3, 3: 3 },
        15: { 1: 4, 2: 3, 3: 3 }, 16: { 1: 4, 2: 3, 3: 3 },
        17: { 1: 4, 2: 3, 3: 3, 4: 1 }, 18: { 1: 4, 2: 3, 3: 3, 4: 1 },
        19: { 1: 4, 2: 3, 3: 3, 4: 2 }, 20: { 1: 4, 2: 3, 3: 3, 4: 2 }
    };
    
    const normalizedClass = (className || '').toLowerCase();
    const fullCasters = ['bard', 'cleric', 'druid', 'sorcerer', 'wizard', 'bardo', 'chierico', 'druido', 'stregone', 'mago'];
    const halfCasters = ['paladin', 'ranger', 'paladino', 'ranger'];
    
    let tableToUse;
    if (fullCasters.includes(normalizedClass)) {
        tableToUse = fullCasterSlots;
    } else if (halfCasters.includes(normalizedClass)) {
        tableToUse = halfCasterSlots;
    } else {
        return {};
    }
    
    return tableToUse[Math.min(level, 20)] || {};
}

/**
 * Inizializza lo stato degli incantesimi per un PNG.
 * @param {Object} npcData - I dati del PNG
 * @returns {Object|null} Lo stato degli incantesimi o null
 */
function initializeNpcSpellState(npcData) {
    const spells = npcData.spells;
    if (!spells || !spells.byLevel) return null;
    
    // Costruisci gli slot dagli incantesimi del PNG
    const remainingSlots = {};
    const preparedSpells = [];
    
    for (let level = 1; level <= 9; level++) {
        const spellsAtLevel = spells.byLevel[level] || [];
        if (spellsAtLevel.length > 0) {
            // PNG ha tipicamente 1-2 slot per livello
            remainingSlots[level] = Math.min(2, spellsAtLevel.length);
            preparedSpells.push(...spellsAtLevel.map(s => ({ name: s, level: level })));
        }
    }
    
    return {
        preparedSpells: preparedSpells,
        remainingSlots: remainingSlots,
        cantrips: spells.byLevel[0] || [],
        dc: spells.dc || 12,
        attackBonus: spells.attackBonus || 4,
        ability: spells.ability || 'int'
    };
}

/**
 * Genera le azioni base per un PG (attacchi con arma).
 * Considera gli equippedSlots per le armi equipaggiate.
 * @param {Object} pcData - I dati del PG
 * @returns {Array} Array di azioni
 */
function generatePcActions(pcData) {
    const actions = [];
    
    const strMod = getAbilityModifier(pcData.abilities?.strength || 10);
    const dexMod = getAbilityModifier(pcData.abilities?.dexterity || 10);
    const profBonus = pcData.proficiencyBonus || 2;
    
    // Raccogli armi equipaggiate
    const weapons = [];
    
    // 1. Controlla equippedSlots (nuovo sistema)
    const equippedSlots = pcData.equippedSlots || {};
    
    if (equippedSlots.mainHand && _isWeapon(equippedSlots.mainHand)) {
        weapons.push(equippedSlots.mainHand);
    }
    if (equippedSlots.offHand && _isWeapon(equippedSlots.offHand)) {
        weapons.push(equippedSlots.offHand);
    }
    
    // 2. Fallback: cerca nell'inventario oggetti con equipped: true (vecchio sistema)
    if (weapons.length === 0) {
        const inventory = pcData.inventory || [];
        const equippedWeapons = inventory.filter(item => 
            item.equipped && _isWeapon(item)
        );
        weapons.push(...equippedWeapons.slice(0, 2));
    }
    
    // 3. Ultimo fallback: cerca nel vecchio equipment array
    if (weapons.length === 0 && pcData.equipment) {
        const equipWeapons = pcData.equipment.filter(e => 
            e.type === 'weapon' || e.category?.includes('arma') || 
            e.equipment_category?.index === 'weapon'
        );
        weapons.push(...equipWeapons.slice(0, 2));
    }
    
    // Genera azioni per ogni arma
    if (weapons.length > 0) {
        weapons.forEach(weapon => {
            const action = _createWeaponAction(weapon, strMod, dexMod, profBonus);
            if (action) actions.push(action);
        });
    }
    
    // Se nessuna arma, aggiungi attacco senz'armi
    if (actions.length === 0) {
        actions.push({
            name: 'Attacco Senza Armi',
            desc: 'Attacco con pugni',
            attack_bonus: profBonus + strMod,
            damage: [{
                damage_dice: '1d1',
                damage_type: { name: 'Bludgeoning' }
            }]
        });
    }
    
    return actions;
}

/**
 * Verifica se un oggetto è un'arma
 */
function _isWeapon(item) {
    if (!item) return false;
    const category = (item.equipment_category?.index || '').toLowerCase();
    return category === 'weapon';
}

/**
 * Crea un'azione di attacco da un'arma
 */
function _createWeaponAction(weapon, strMod, dexMod, profBonus) {
    if (!weapon) return null;
    
    // Determina il modificatore di attacco
    let attackMod = strMod;
    
    // Controlla se è un'arma Finesse o a distanza
    const isFinesse = (weapon.properties || []).some(p => {
        const propName = (p.name || p.index || p || '').toLowerCase();
        return propName === 'finesse' || propName === 'agile';
    });
    
    const isRanged = (weapon.weapon_range || weapon.category_range || '').toLowerCase().includes('distanza');
    
    if (isFinesse) {
        attackMod = Math.max(strMod, dexMod);
    } else if (isRanged) {
        attackMod = dexMod;
    }
    
    // Estrai danno
    let damageDice = '1d8';
    let damageType = 'Slashing';
    
    if (weapon.damage) {
        damageDice = weapon.damage.damage_dice || '1d8';
        damageType = weapon.damage.damage_type?.name || 'Slashing';
    } else if (weapon.damage_dice) {
        damageDice = weapon.damage_dice;
    }
    
    // Traduci tipo danno in inglese se necessario
    const damageTypeMap = {
        'tagliente': 'Slashing',
        'perforante': 'Piercing',
        'contundente': 'Bludgeoning',
        'slashing': 'Slashing',
        'piercing': 'Piercing',
        'bludgeoning': 'Bludgeoning'
    };
    damageType = damageTypeMap[damageType.toLowerCase()] || damageType;
    
    return {
        name: weapon.name || 'Attacco',
        desc: `Attacco con ${weapon.name || 'arma'}`,
        attack_bonus: profBonus + attackMod,
        damage: [{
            damage_dice: damageDice,
            damage_type: { name: damageType }
        }],
        _weaponData: {
            name: weapon.name,
            range: weapon.weapon_range,
            properties: weapon.properties
        }
    };
}

/**
 * Genera le azioni base per un PNG.
 * @param {Object} npcData - I dati del PNG
 * @returns {Array} Array di azioni
 */
function generateNpcActions(npcData) {
    const actions = [];
    
    const strMod = getAbilityModifier(npcData.abilities?.for || npcData.abilities?.strength || 10);
    const dexMod = getAbilityModifier(npcData.abilities?.des || npcData.abilities?.dexterity || 10);
    const profBonus = npcData.profBonus || 2;
    
    // Attacco base
    const attackMod = Math.max(strMod, dexMod);
    
    actions.push({
        name: 'Attacco',
        desc: 'Attacco base',
        attack_bonus: profBonus + attackMod,
        damage: [{
            damage_dice: '1d6',
            damage_type: { name: 'Slashing' }
        }]
    });
    
    return actions;
}

/**
 * Ottiene l'abilità di incantamento per una classe.
 * @param {string} className - Nome della classe
 * @returns {string} Chiave abilità
 */
function getSpellcastingAbility(className) {
    const mapping = {
        'Mago': 'intelligence', 'Wizard': 'intelligence',
        'Chierico': 'wisdom', 'Cleric': 'wisdom',
        'Druido': 'wisdom', 'Druid': 'wisdom',
        'Bardo': 'charisma', 'Bard': 'charisma',
        'Stregone': 'charisma', 'Sorcerer': 'charisma',
        'Warlock': 'charisma', 'Paladino': 'charisma', 'Paladin': 'charisma',
        'Ranger': 'wisdom'
    };
    return mapping[className] || 'intelligence';
}

/**
 * Stima il livello di un incantesimo dal nome.
 * @param {string} spellName - Nome dell'incantesimo
 * @param {Object} pcData - Dati del PG per riferimento
 * @returns {number} Livello stimato
 */
function getSpellLevel(spellName, pcData) {
    // Questa è una stima - in una implementazione reale cercheremmo nel database
    const cantripNames = ['light', 'mage hand', 'prestidigitation', 'fire bolt', 'ray of frost', 'illuminazione', 'luce', 'mano magica'];
    if (cantripNames.some(c => spellName.toLowerCase().includes(c))) return 0;
    return 1; // Default a livello 1
}

/**
 * Rimuove un mostro dal combattimento.
 * @param {string} monsterId - L'ID del mostro da rimuovere
 */
export function removeMonsterFromCombat(monsterId) {
    console.log("➖ [CombatStateManager] Rimozione mostro ID:", monsterId);
    
    const monsterIndex = combatState.findIndex(m => m.id === monsterId);
    
    if (monsterIndex > -1) {
        const removedMonster = combatState[monsterIndex];
        combatState.splice(monsterIndex, 1);
        
        // Rimuovi dall'ordine di iniziativa
        initiativeOrder = initiativeOrder.filter(m => m.id !== monsterId);
        
        // Se era il turno di questo combattente, passa al prossimo
        if (currentTurnMonsterId === monsterId) {
            if (initiativeOrder.length > 0) {
                // Trova l'indice del combattente rimosso nell'ordine
                const removedIndex = combatState.length > 0 
                    ? combatState.findIndex(m => m.id === monsterId)
                    : -1;
                
                // Passa al prossimo combattente
                if (removedIndex >= 0 && removedIndex < initiativeOrder.length) {
                    currentTurnMonsterId = initiativeOrder[removedIndex]?.id || initiativeOrder[0]?.id;
                } else {
                    currentTurnMonsterId = initiativeOrder[0]?.id;
                }
                
                console.log(`🎯 [CombatStateManager] Turno passato a: ${initiativeOrder.find(m => m.id === currentTurnMonsterId)?.customName}`);
            } else {
                currentTurnMonsterId = null;
            }
        }
        
        console.log(`🧾 [CombatStateManager] ${removedMonster.customName} rimosso.`);
        notifySubscribers();
    }
}

/**
 * Aggiorna una proprietà di un mostro.
 * @param {string} monsterId - L'ID del mostro
 * @param {string} property - La proprietà da aggiornare
 * @param {any} value - Il nuovo valore
 */
export function updateMonsterProperty(monsterId, property, value) {
    console.log(`✏️ [CombatStateManager] Aggiornamento proprietà '${property}' per ID ${monsterId}:`, value);
    
    const monster = combatState.find(m => m.id === monsterId);
    
    if (monster) {
        monster[property] = value;
        
        // Riordina iniziativa se è stata modificata durante il combattimento
        if (property === 'initiative' && currentRound > 0) {
            initiativeOrder = [...combatState].sort((a, b) => {
                if (a.initiative === null) return 1;
                if (b.initiative === null) return -1;
                return b.initiative - a.initiative;
            });
        }
        
        console.log(`🧾 [CombatStateManager] Proprietà aggiornata.`);
        notifySubscribers();
    }
}

/**
 * Avvia il combattimento.
 */
export function startCombat() {
    if (combatState.length === 0) {
        showToast('Nessun combattente nella lista.', 'warning');
        return;
    }
    
    currentRound = 1;
    
    // Ordina per iniziativa decrescente
    initiativeOrder = [...combatState].sort((a, b) => {
        if (a.initiative === null) return 1;
        if (b.initiative === null) return -1;
        return b.initiative - a.initiative;
    });
    
    currentTurnMonsterId = initiativeOrder[0]?.id || null;
    
    // Resetta le azioni per TUTTI i combattenti all'inizio del combattimento
    // Questo assicura che nessuno inizi con azioni già usate (es. da stato salvato)
    combatState.forEach(combatant => {
        if (!combatant.actionTracker) {
            combatant.actionTracker = {
                actionUsed: false,
                bonusActionUsed: false,
                reactionUsed: false,
                legendaryActionsUsed: 0,
                legendaryActionsMax: (combatant.legendary_actions || []).length > 0 ? 3 : 0,
                abilityUses: initializeAbilityUses(combatant.actions || [], combatant.special_abilities || [])
            };
        } else {
            // Reset completo per nuovo combattimento
            combatant.actionTracker.actionUsed = false;
            combatant.actionTracker.bonusActionUsed = false;
            combatant.actionTracker.reactionUsed = false;
            combatant.actionTracker.legendaryActionsUsed = 0;
        }
    });
    
    console.log(`⚔️ [CombatStateManager] Combattimento avviato. Round ${currentRound}. Primo turno: ${initiativeOrder[0]?.customName}`);
    notifySubscribers();
}

/**
 * Passa al turno successivo.
 */
export function nextTurn() {
    if (combatState.length === 0 || !currentTurnMonsterId || initiativeOrder.length === 0) {
        console.warn("⚠️ [CombatStateManager] Impossibile avanzare turno.");
        return;
    }
    
    // Decrementa durata condizioni del combattente corrente (alla fine del suo turno)
    const currentCombatant = combatState.find(m => m.id === currentTurnMonsterId);
    if (currentCombatant) {
        const expiredConditions = [];
        const expiredSpells = [];
        
        // Gestisci condizioni
        if (currentCombatant.conditions) {
            currentCombatant.conditions = currentCombatant.conditions.filter(cond => {
                // cond può essere stringa (vecchio formato) o oggetto {name, duration}
                if (typeof cond === 'string') return true; // mantieni condizioni vecchio formato
                if (cond.duration > 0) {
                    cond.duration--;
                    if (cond.duration === 0) {
                        expiredConditions.push(cond.name);
                        return false; // rimuovi condizione scaduta
                    }
                }
                return true;
            });
        }
        
        // Gestisci durata concentrazione (alla fine del turno di chi sta concentrando)
        if (currentCombatant.concentration && currentCombatant.concentration.duration > 0) {
            currentCombatant.concentration.duration--;
            if (currentCombatant.concentration.duration === 0) {
                // Concentrazione terminata naturalmente
                breakConcentration(currentCombatant.id, false);
            }
        }
        
        // Gestisci incantesimi attivi con durata
        if (currentCombatant.activeSpells) {
            currentCombatant.activeSpells = currentCombatant.activeSpells.filter(spell => {
                if (spell.duration > 0) {
                    spell.duration--;
                    if (spell.duration === 0) {
                        expiredSpells.push(spell.name);
                        // Se era un incantesimo di concentrazione, rimuovi anche quella
                        if (spell.concentration && currentCombatant.concentration?.spellName === spell.name) {
                            currentCombatant.concentration = null;
                        }
                        return false; // rimuovi incantesimo scaduto
                    }
                }
                return true;
            });
        }
        
        if (expiredConditions.length > 0) {
            showToast(`Condizioni scadute per ${currentCombatant.customName}: ${expiredConditions.join(', ')}`, 'info', 5000);
        }
        
        if (expiredSpells.length > 0) {
            showToast(`Incantesimi terminati per ${currentCombatant.customName}: ${expiredSpells.join(', ')}`, 'info', 5000);
        }
    }
    
    const currentIndex = initiativeOrder.findIndex(m => m.id === currentTurnMonsterId);
    let nextIndex = (currentIndex + 1) % initiativeOrder.length;
    
    // Salta combattenti senza iniziativa
    let attempts = 0;
    while (initiativeOrder[nextIndex].initiative === null && attempts < initiativeOrder.length) {
        nextIndex = (nextIndex + 1) % initiativeOrder.length;
        attempts++;
    }
    
    // Nuovo round
    if (nextIndex <= currentIndex) {
        currentRound++;
        console.log(`🔄 [CombatStateManager] Nuovo round: ${currentRound}`);
    }
    
    currentTurnMonsterId = initiativeOrder[nextIndex].id;
    
    // Reset azioni per il nuovo turno
    resetActionsForTurn(currentTurnMonsterId);
    
    // Mostra notifica se ci sono condizioni attive
    const nextCombatant = initiativeOrder[nextIndex];
    if (nextCombatant?.conditions?.length > 0) {
        const conditionSummariesText = nextCombatant.conditions.map(cond => {
            const condName = typeof cond === 'string' ? cond : cond.name;
            const summary = conditionSummaries[condName];
            return summary ? `${condName}: ${summary}` : condName;
        }).join(' | ');
        
        const message = `Turno di ${nextCombatant.customName}. Condizioni attive: ${conditionSummariesText}`;
        showToast(message, 'info', 7000);
    }
    
    // Avviso se sta concentrando
    if (nextCombatant?.concentration?.spellName) {
        const concDuration = nextCombatant.concentration.duration;
        const durationText = concDuration > 0 ? ` (${concDuration} turni rimanenti)` : '';
        showToast(`${nextCombatant.customName} sta concentrandosi su "${nextCombatant.concentration.spellName}"${durationText}`, 'info', 5000);
    }
    
    console.log(`🎯 [CombatStateManager] Turno di: ${nextCombatant.customName}`);
    notifySubscribers();
}

/**
 * Pulisce lo stato del combattimento.
 * @param {boolean} notify - Se notificare i sottoscrittori (default: true)
 */
export function clearCombat(notify = true) {
    console.log("🗑️ [CombatStateManager] Reset combattimento.");
    
    combatState = [];
    currentRound = 0;
    currentTurnMonsterId = null;
    initiativeOrder = [];
    
    if (notify) {
        notifySubscribers();
    }
}

/**
 * Termina il combattimento mantenendo i combattenti.
 * Resetta round, rimuove condizioni e prepara per nuovo combattimento.
 * @returns {number} Numero di combattenti rimasti
 */
export function endCombat() {
    console.log("🏁 [CombatStateManager] Combattimento terminato.");
    
    // Reset round e turno
    currentRound = 0;
    currentTurnMonsterId = null;
    initiativeOrder = [];
    
    // Rimuovi tutte le condizioni dai combattenti
    let conditionsRemoved = 0;
    combatState.forEach(combatant => {
        if (combatant.conditions && combatant.conditions.length > 0) {
            conditionsRemoved += combatant.conditions.length;
            combatant.conditions = [];
        }
        // Rimuovi anche concentrazione e incantesimi attivi
        if (combatant.concentration) {
            combatant.concentration = null;
        }
        if (combatant.activeSpells) {
            combatant.activeSpells = [];
        }
        // Reset temp HP
        combatant.tempHp = 0;
    });
    
    console.log(`🧹 [CombatStateManager] Rimosse ${conditionsRemoved} condizioni. ${combatState.length} combattenti pronti per nuovo combattimento.`);
    showToast(`Combattimento terminato! ${combatState.length} combattenti pronti.`, 'success');
    
    notifySubscribers();
    
    return combatState.length;
}

/**
 * Ricalcola l'iniziativa per tutti i combattenti.
 * Da chiamare quando si vuole ricominciare il combattimento.
 */
export function rerollAllInitiative() {
    console.log("🎲 [CombatStateManager] Ricalcolo iniziativa per tutti.");
    
    combatState.forEach(combatant => {
        const dexModifier = getAbilityModifier(combatant.dexterity || 10);
        const initiativeRoll = rollDice('1d20');
        combatant.initiative = initiativeRoll + dexModifier;
        console.log(`  → ${combatant.customName}: ${initiativeRoll}+${dexModifier} = ${combatant.initiative}`);
    });
    
    notifySubscribers();
}

/**
 * Usa un'azione per un combattente.
 * @param {string} combatantId - L'ID del combattente
 * @param {string} actionType - Tipo: 'action', 'bonusAction', 'reaction', 'legendary'
 * @param {string} actionName - Nome dell'azione (opzionale, per tracciamento usi)
 * @returns {boolean} True se l'azione è stata usata, false se non disponibile
 */
export function useAction(combatantId, actionType = 'action', actionName = null) {
    const combatant = combatState.find(c => c.id === combatantId);
    if (!combatant) return false;
    
    // Inizializza actionTracker se non esiste
    if (!combatant.actionTracker) {
        combatant.actionTracker = {
            actionUsed: false,
            bonusActionUsed: false,
            reactionUsed: false,
            legendaryActionsUsed: 0,
            legendaryActionsMax: (combatant.legendary_actions || []).length > 0 ? 3 : 0,
            abilityUses: {}
        };
    }
    
    const tracker = combatant.actionTracker;
    
    switch (actionType) {
        case 'action':
            if (tracker.actionUsed) {
                showToast(`${combatant.customName} ha già usato la sua azione!`, 'warning');
                return false;
            }
            tracker.actionUsed = true;
            console.log(`⚔️ [CombatStateManager] ${combatant.customName} usa azione standard`);
            break;
            
        case 'bonusAction':
            if (tracker.bonusActionUsed) {
                showToast(`${combatant.customName} ha già usato la sua azione bonus!`, 'warning');
                return false;
            }
            tracker.bonusActionUsed = true;
            console.log(`⚡ [CombatStateManager] ${combatant.customName} usa azione bonus`);
            break;
            
        case 'reaction':
            if (tracker.reactionUsed) {
                showToast(`${combatant.customName} ha già usato la sua reazione!`, 'warning');
                return false;
            }
            tracker.reactionUsed = true;
            console.log(`🔄 [CombatStateManager] ${combatant.customName} usa reazione`);
            break;
            
        case 'legendary':
            if (tracker.legendaryActionsUsed >= tracker.legendaryActionsMax) {
                showToast(`${combatant.customName} non ha più azioni leggendarie!`, 'warning');
                return false;
            }
            tracker.legendaryActionsUsed++;
            console.log(`👑 [CombatStateManager] ${combatant.customName} usa azione leggendaria (${tracker.legendaryActionsUsed}/${tracker.legendaryActionsMax})`);
            break;
    }
    
    // Traccia uso abilità con limiti
    if (actionName && tracker.abilityUses) {
        const key = `action_${actionName}`;
        if (tracker.abilityUses[key] && tracker.abilityUses[key].current > 0) {
            tracker.abilityUses[key].current--;
            const remaining = tracker.abilityUses[key].current;
            showToast(`${actionName}: ${remaining}/${tracker.abilityUses[key].max} usi rimanenti`, 'info');
        }
    }
    
    notifySubscribers();
    return true;
}

/**
 * Resetta le azioni per un combattente all'inizio del suo turno.
 * @param {string} combatantId - L'ID del combattente
 */
export function resetActionsForTurn(combatantId) {
    const combatant = combatState.find(c => c.id === combatantId);
    if (!combatant) return;
    
    // Inizializza o reset actionTracker
    if (!combatant.actionTracker) {
        combatant.actionTracker = {
            actionUsed: false,
            bonusActionUsed: false,
            reactionUsed: false,
            legendaryActionsUsed: 0,
            legendaryActionsMax: (combatant.legendary_actions || []).length > 0 ? 3 : 0,
            abilityUses: initializeAbilityUses(combatant.actions || [], combatant.special_abilities || [])
        };
    } else {
        // Reset per nuovo turno
        combatant.actionTracker.actionUsed = false;
        combatant.actionTracker.bonusActionUsed = false;
        // Reaction si resetta all'inizio del PROSSIVO turno del combattente
        combatant.actionTracker.legendaryActionsUsed = 0;
    }
    
    // Reset reazione dal turno precedente
    combatant.actionTracker.reactionUsed = false;
    
    console.log(`🔄 [CombatStateManager] Azioni resettate per ${combatant.customName}`);
}

/**
 * Usa uno slot incantesimo per un mostro incantatore.
 * @param {string} monsterId - L'ID del mostro
 * @param {number} spellLevel - Il livello dello slot usato
 */
export function useSpellSlot(monsterId, spellLevel) {
    const monster = combatState.find(m => m.id === monsterId);
    
    if (monster?.spellState?.remainingSlots[spellLevel] > 0) {
        monster.spellState.remainingSlots[spellLevel]--;
        console.log(`📜 [CombatStateManager] ${monster.name} usa slot livello ${spellLevel}. Rimanenti:`, monster.spellState.remainingSlots);
        notifySubscribers();
    }
}

/**
 * Usa un incantesimo "X al giorno" per un mostro incantatore.
 * @param {string} monsterId - L'ID del mostro
 * @param {string} spellName - Il nome dell'incantesimo
 * @returns {boolean} True se l'incantesimo è stato usato, false altrimenti
 */
export function usePerDaySpell(monsterId, spellName) {
    const monster = combatState.find(m => m.id === monsterId);
    
    if (!monster?.spellState?.perDaySpells) return false;
    
    const spell = monster.spellState.perDaySpells.find(s => 
        (typeof s === 'string' ? s : s.name) === spellName
    );
    
    if (spell && spell.usesRemaining > 0) {
        spell.usesRemaining--;
        console.log(`📜 [CombatStateManager] ${monster.name} usa ${spellName}. Utilizzi rimanenti: ${spell.usesRemaining}/${spell.maxUses}`);
        notifySubscribers();
        return true;
    }
    
    return false;
}

/**
 * Usa un incantesimo (generico - gestisce slot, per-day, at-will).
 * @param {string} monsterId - L'ID del mostro
 * @param {Object|string} spell - L'incantesimo da usare
 * @returns {Object} Risultato dell'operazione {success, message, type}
 */
export function useSpell(monsterId, spell) {
    const monster = combatState.find(m => m.id === monsterId);
    if (!monster) return { success: false, message: 'Mostro non trovato', type: 'error' };
    
    const spellData = typeof spell === 'string' ? { name: spell } : spell;
    const spellName = spellData.name;
    
    // Controlla se è un incantesimo a volontà
    const atWillSpell = monster.spellState?.atWillSpells?.find(s => 
        (typeof s === 'string' ? s : s.name) === spellName
    );
    if (atWillSpell) {
        console.log(`📜 [CombatStateManager] ${monster.name} lancia ${spellName} (a volontà)`);
        return { success: true, message: `${spellName} lanciato (a volontà)`, type: 'atwill' };
    }
    
    // Controlla se è un incantesimo X al giorno
    const perDaySpell = monster.spellState?.perDaySpells?.find(s => 
        (typeof s === 'string' ? s : s.name) === spellName
    );
    if (perDaySpell) {
        if (perDaySpell.usesRemaining > 0) {
            perDaySpell.usesRemaining--;
            console.log(`📜 [CombatStateManager] ${monster.name} lancia ${spellName}. Utilizzi rimanenti: ${perDaySpell.usesRemaining}/${perDaySpell.maxUses}`);
            notifySubscribers();
            return { success: true, message: `${spellName} lanciato (${perDaySpell.usesRemaining}/${perDaySpell.maxUses} rimanenti)`, type: 'perday' };
        } else {
            return { success: false, message: `${spellName} esaurito per oggi!`, type: 'error' };
        }
    }
    
    // Controlla se è un trucco (cantrip)
    const cantrip = monster.spellState?.cantrips?.find(s => 
        (typeof s === 'string' ? s : s.name) === spellName
    );
    if (cantrip) {
        console.log(`📜 [CombatStateManager] ${monster.name} lancia ${spellName} (trucco)`);
        return { success: true, message: `${spellName} lanciato (trucco)`, type: 'cantrip' };
    }
    
    // Controlla se è un incantesimo con slot
    const preparedSpell = monster.spellState?.preparedSpells?.find(s => 
        (typeof s === 'string' ? s : s.name) === spellName
    );
    if (preparedSpell) {
        const level = preparedSpell.level || 1;
        if (monster.spellState.remainingSlots[level] > 0) {
            monster.spellState.remainingSlots[level]--;
            console.log(`📜 [CombatStateManager] ${monster.name} lancia ${spellName} (L${level}). Slot rimanenti:`, monster.spellState.remainingSlots);
            notifySubscribers();
            return { success: true, message: `${spellName} lanciato (L${level})`, type: 'slot' };
        } else {
            return { success: false, message: `Nessuno slot L${level} disponibile!`, type: 'error' };
        }
    }
    
    return { success: false, message: `${spellName} non trovato tra gli incantesimi`, type: 'error' };
}

/**
 * Resetta gli utilizzi degli incantesimi per-day (es. dopo un riposo lungo).
 * @param {string} monsterId - L'ID del mostro (opzionale, se non fornito resetta tutti)
 */
export function resetPerDaySpells(monsterId = null) {
    if (monsterId) {
        const monster = combatState.find(m => m.id === monsterId);
        if (monster?.spellState?.perDaySpells) {
            monster.spellState.perDaySpells.forEach(spell => {
                spell.usesRemaining = spell.maxUses;
            });
            console.log(`🔄 [CombatStateManager] Incantesimi per-day resettati per ${monster.name}`);
        }
    } else {
        combatState.forEach(monster => {
            if (monster.spellState?.perDaySpells) {
                monster.spellState.perDaySpells.forEach(spell => {
                    spell.usesRemaining = spell.maxUses;
                });
            }
        });
        console.log(`🔄 [CombatStateManager] Incantesimi per-day resettati per tutti`);
    }
    notifySubscribers();
}

/**
 * Importa un incontro predefinito (supporta mostri e PNG).
 * @param {Object} encounterData - I dati dell'incontro da importare
 * @param {Array} npcsData - Array opzionale di PNG della campagna per risolvere riferimenti
 */
export function importEncounter(encounterData, npcsData = []) {
    if (!encounterData?.monsters) {
        console.error("❌ [CombatStateManager] Dati incontro non validi.");
        showToast('Dati incontro non validi.', 'error');
        return;
    }
    
    console.log(`📥 [CombatStateManager] Importazione incontro: "${encounterData.name}"`);
    
    let monsterCount = 0;
    let npcCount = 0;
    
    encounterData.monsters.forEach(creatureInEncounter => {
        // Controlla se è un PNG
        if (creatureInEncounter.isNpc) {
            // Cerca il PNG nei dati forniti
            const npcData = npcsData.find(n => n.id === creatureInEncounter.index);
            if (npcData) {
                for (let i = 0; i < creatureInEncounter.quantity; i++) {
                    addNpcToCombat(npcData);
                    npcCount++;
                }
            } else {
                console.warn(`⚠️ [CombatStateManager] PNG non trovato: ${creatureInEncounter.index}`);
            }
        } else {
            // È un mostro dal database
            const monsterData = monsterDatabase.find(m => m.index === creatureInEncounter.index);
            if (monsterData) {
                for (let i = 0; i < creatureInEncounter.quantity; i++) {
                    addMonsterToCombat(monsterData);
                    monsterCount++;
                }
            } else {
                console.error(`❌ [CombatStateManager] Mostro non trovato: ${creatureInEncounter.index}`);
            }
        }
    });
    
    const total = monsterCount + npcCount;
    let message = `${total} creature importate`;
    if (monsterCount > 0 && npcCount > 0) {
        message += ` (${monsterCount} mostri, ${npcCount} PNG)`;
    } else if (monsterCount > 0) {
        message = `${monsterCount} mostri importati`;
    } else if (npcCount > 0) {
        message = `${npcCount} PNG importati`;
    }
    
    console.log(`📥 [CombatStateManager] Importazione completata. ${message}`);
    showToast(message, 'success');
}

/**
 * Aggiunge una condizione a un combattente.
 * @param {number} combatantId - L'ID del combattente
 * @param {string} conditionName - Il nome della condizione
 * @param {number} duration - La durata in turni (0 = permanente)
 */
export function addConditionToCombatant(combatantId, conditionName, duration = 0) {
    const combatant = combatState.find(c => c.id === combatantId);
    if (!combatant) {
        console.warn(`⚠️ [CombatStateManager] Combattente non trovato: ${combatantId}`);
        return;
    }
    
    // Inizializza conditions se non esiste
    if (!combatant.conditions) {
        combatant.conditions = [];
    }
    
    // Converti vecchio formato (stringhe) in nuovo formato se necessario
    combatant.conditions = combatant.conditions.map(cond => {
        if (typeof cond === 'string') {
            return { name: cond, duration: 0 }; // permanente
        }
        return cond;
    });
    
    // Controlla se la condizione esiste già
    const existingIndex = combatant.conditions.findIndex(c => c.name === conditionName);
    if (existingIndex >= 0) {
        // Aggiorna la durata
        combatant.conditions[existingIndex].duration = duration;
        console.log(`🔄 [CombatStateManager] Condizione "${conditionName}" aggiornata per ${combatant.customName}. Durata: ${duration === 0 ? 'permanente' : duration + ' turni'}`);
    } else {
        // Aggiungi nuova condizione
        combatant.conditions.push({ name: conditionName, duration: duration });
        console.log(`➕ [CombatStateManager] Condizione "${conditionName}" aggiunta a ${combatant.customName}. Durata: ${duration === 0 ? 'permanente' : duration + ' turni'}`);
    }
    
    notifySubscribers();
}

/**
 * Rimuove una condizione da un combattente.
 * @param {number} combatantId - L'ID del combattente
 * @param {string} conditionName - Il nome della condizione da rimuovere
 */
export function removeConditionFromCombatant(combatantId, conditionName) {
    const combatant = combatState.find(c => c.id === combatantId);
    if (!combatant || !combatant.conditions) return;
    
    const prevLength = combatant.conditions.length;
    combatant.conditions = combatant.conditions.filter(cond => {
        const condName = typeof cond === 'string' ? cond : cond.name;
        return condName !== conditionName;
    });
    
    if (combatant.conditions.length < prevLength) {
        console.log(`➖ [CombatStateManager] Condizione "${conditionName}" rimossa da ${combatant.customName}`);
        notifySubscribers();
    }
}

// --- SISTEMA CONCENTRAZIONE ---

/**
 * Imposta un incantesimo di concentrazione per un combattente.
 * Se esiste già una concentrazione attiva, la sovrascrive con warning.
 * @param {number} combatantId - L'ID del combattente
 * @param {string} spellName - Nome dell'incantesimo
 * @param {number} duration - Durata in turni (0 = fino a quando non interrotto)
 * @returns {Object|null} Info sulla vecchia concentrazione se sovrascritta, null altrimenti
 */
export function setConcentration(combatantId, spellName, duration = 0) {
    const combatant = combatState.find(c => c.id === combatantId);
    if (!combatant) {
        console.warn(`⚠️ [CombatStateManager] Combattente non trovato: ${combatantId}`);
        return null;
    }
    
    let previousConcentration = null;
    
    // Se ha già una concentrazione attiva, la sovrascriviamo
    if (combatant.concentration?.spellName) {
        previousConcentration = { ...combatant.concentration };
        console.log(`⚠️ [CombatStateManager] ${combatant.customName} stava concentrando su "${previousConcentration.spellName}" - sarà sovrascritto!`);
    }
    
    // Imposta la nuova concentrazione
    combatant.concentration = {
        spellName: spellName,
        duration: duration, // 0 = indefinita
        startRound: currentRound
    };
    
    console.log(`🔮 [CombatStateManager] ${combatant.customName} sta concentrando su "${spellName}"${duration > 0 ? ` per ${duration} turni` : ''}`);
    notifySubscribers();
    
    return previousConcentration;
}

/**
 * Rimuove la concentrazione da un combattente.
 * @param {number} combatantId - L'ID del combattente
 * @param {boolean} broken - Se la concentrazione è stata interrotta (per notifica)
 */
export function breakConcentration(combatantId, broken = true) {
    const combatant = combatState.find(c => c.id === combatantId);
    if (!combatant || !combatant.concentration) return;
    
    const spellName = combatant.concentration.spellName;
    combatant.concentration = null;
    
    if (broken) {
        console.log(`💔 [CombatStateManager] Concentrazione di ${combatant.customName} su "${spellName}" interrotta!`);
        showToast(`Concentrazione su "${spellName}" interrotta per ${combatant.customName}!`, 'warning');
    } else {
        console.log(`✨ [CombatStateManager] Concentrazione di ${combatant.customName} su "${spellName}" terminata naturalmente.`);
    }
    
    notifySubscribers();
}

/**
 * Esegue un tiro salvezza Costituzione per mantenere la concentrazione.
 * CD = max(10, danno/2 arrotondato giù)
 * @param {number} combatantId - L'ID del combattente
 * @param {number} damage - Il danno subito
 * @returns {Object} Risultato del tiro {success, roll, dc, conMod}
 */
export function rollConcentrationSave(combatantId, damage) {
    const combatant = combatState.find(c => c.id === combatantId);
    if (!combatant) {
        return { success: true, roll: 0, dc: 0, conMod: 0, error: 'Combatant not found' };
    }
    
    // Calcola CD (minimo 10)
    const dc = Math.max(10, Math.floor(damage / 2));
    
    // Calcola modificatore Costituzione
    const conScore = combatant.constitution || 10;
    const conMod = Math.floor((conScore - 10) / 2);
    
    // Tiro salvezza
    const roll = rollDice('1d20');
    const total = roll + conMod;
    const success = total >= dc;
    
    console.log(`🎲 [CombatStateManager] Tiro concentrazione per ${combatant.customName}: ${roll}+${conMod}=${total} vs CD ${dc} → ${success ? 'SUCCESSO' : 'FALLIMENTO'}`);
    
    if (!success) {
        breakConcentration(combatantId, true);
    }
    
    return {
        success: success,
        roll: roll,
        conMod: conMod,
        total: total,
        dc: dc,
        spellName: combatant.concentration?.spellName
    };
}

/**
 * Verifica se un combattente ha concentrazione attiva.
 * @param {number} combatantId - L'ID del combattente
 * @returns {Object|null} Info sulla concentrazione o null
 */
export function getConcentration(combatantId) {
    const combatant = combatState.find(c => c.id === combatantId);
    return combatant?.concentration || null;
}

// --- SISTEMA INCANTESIMI ATTIVI (DURATA) ---

/**
 * Aggiunge un incantesimo attivo con durata a un combattente.
 * @param {number} combatantId - L'ID del combattente
 * @param {Object} spellData - Dati dell'incantesimo {name, duration, type, description}
 * @param {string} spellData.name - Nome dell'incantesimo
 * @param {number} spellData.duration - Durata in turni
 * @param {string} spellData.type - Tipo: 'buff', 'debuff', 'effect'
 * @param {boolean} spellData.concentration - Se richiede concentrazione
 * @param {string} spellData.description - Descrizione effetto
 */
export function addActiveSpell(combatantId, spellData) {
    const combatant = combatState.find(c => c.id === combatantId);
    if (!combatant) {
        console.warn(`⚠️ [CombatStateManager] Combattente non trovato: ${combatantId}`);
        return;
    }
    
    // Inizializza activeSpells se non esiste
    if (!combatant.activeSpells) {
        combatant.activeSpells = [];
    }
    
    // Controlla se esiste già un incantesimo con lo stesso nome
    const existingIndex = combatant.activeSpells.findIndex(s => s.name === spellData.name);
    
    const spell = {
        name: spellData.name,
        duration: spellData.duration || 0,
        type: spellData.type || 'effect',
        concentration: spellData.concentration || false,
        description: spellData.description || '',
        startRound: currentRound
    };
    
    if (existingIndex >= 0) {
        // Aggiorna durata se già presente
        combatant.activeSpells[existingIndex] = spell;
        console.log(`🔄 [CombatStateManager] Incantesimo "${spell.name}" aggiornato per ${combatant.customName}`);
    } else {
        combatant.activeSpells.push(spell);
        console.log(`✨ [CombatStateManager] Incantesimo "${spell.name}" aggiunto a ${combatant.customName}. Durata: ${spell.duration === 0 ? 'permanente' : spell.duration + ' turni'}`);
    }
    
    // Se richiede concentrazione, impostala
    if (spell.concentration) {
        setConcentration(combatantId, spell.name, spell.duration);
    }
    
    notifySubscribers();
}

/**
 * Rimuove un incantesimo attivo da un combattente.
 * @param {number} combatantId - L'ID del combattente
 * @param {string} spellName - Nome dell'incantesimo
 */
export function removeActiveSpell(combatantId, spellName) {
    const combatant = combatState.find(c => c.id === combatantId);
    if (!combatant || !combatant.activeSpells) return;
    
    const prevLength = combatant.activeSpells.length;
    combatant.activeSpells = combatant.activeSpells.filter(s => s.name !== spellName);
    
    if (combatant.activeSpells.length < prevLength) {
        console.log(`➖ [CombatStateManager] Incantesimo "${spellName}" rimosso da ${combatant.customName}`);
        
        // Se era un incantesimo di concentrazione, rimuovi anche quella
        if (combatant.concentration?.spellName === spellName) {
            combatant.concentration = null;
        }
        
        notifySubscribers();
    }
}

/**
 * Ottiene gli incantesimi attivi di un combattente.
 * @param {number} combatantId - L'ID del combattente
 * @returns {Array} Array di incantesimi attivi
 */
export function getActiveSpells(combatantId) {
    const combatant = combatState.find(c => c.id === combatantId);
    return combatant?.activeSpells || [];
}

// --- GETTER ---

/**
 * Ottiene lo stato corrente del combattimento.
 * @returns {Array} Copia dell'array dei combattenti
 */
export function getCombatState() {
    return [...combatState];
}

/**
 * Ottiene lo stato completo del sistema.
 * @returns {Object} Oggetto con tutto lo stato
 */
export function getState() {
    return {
        campaignId: getCurrentCampaignId(),
        combatants: [...combatState],
        round: currentRound,
        turn: currentTurnMonsterId,
        initiativeOrder: [...initiativeOrder],
    };
}

/**
 * Ottiene l'ordine di iniziativa.
 * @returns {Array} Copia dell'array dell'ordine di iniziativa
 */
export function getInitiativeOrder() {
    return [...initiativeOrder];
}

/**
 * Ottiene il round corrente.
 * @returns {number} Il round corrente
 */
export function getCurrentRound() {
    return currentRound;
}

/**
 * Ottiene l'ID del mostro nel turno corrente.
 * @returns {string|null} L'ID del mostro o null
 */
export function getCurrentTurnMonsterId() {
    return currentTurnMonsterId;
}

// --- DEBUG ---

/**
 * Ottiene i summaries delle condizioni (per debug).
 * @returns {Object} Copia dei summaries
 */
export function getDebugConditionSummaries() {
    return { ...conditionSummaries };
}

console.log('⚔️ [CombatStateManager] Modulo caricato.');
