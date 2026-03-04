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
function initializeMonsterSpells(monster) {
    const spellcastingAbility = monster.special_abilities?.find(
        a => a.name === 'Incantamento' || a.name === 'Spellcasting'
    );
    
    if (!spellcastingAbility || !spellcastingAbility.spellcasting) return;
    
    console.log(`🧙‍♂️ [CombatStateManager] Inizializzazione incantesimi per ${monster.name}`);
    
    const spellcasting = spellcastingAbility.spellcasting;
    const preparedSpells = [];
    const remainingSlots = { ...spellcasting.slots };
    const spellsByLevel = {};
    
    // Raggruppa incantesimi per livello
    spellcasting.spells.forEach(spell => {
        const level = spell.level;
        if (!spellsByLevel[level]) spellsByLevel[level] = [];
        spellsByLevel[level].push(spell);
    });
    
    // Prepara incantesimi casuali per ogni livello con slot disponibili
    for (const level in spellsByLevel) {
        const spellLevel = parseInt(level, 10);
        if (spellLevel > 0 && remainingSlots[spellLevel] > 0) {
            const spellsOfThisLevel = spellsByLevel[level];
            const numToPrepare = Math.min(remainingSlots[spellLevel], spellsOfThisLevel.length);
            const shuffled = [...spellsOfThisLevel].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, numToPrepare);
            preparedSpells.push(...selected);
        }
    }
    
    monster.spellState = {
        preparedSpells: preparedSpells,
        remainingSlots: remainingSlots,
        cantrips: spellsByLevel[0] || []
    };
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
    
    const newCombatant = {
        ...monsterData,
        id: Date.now() + Math.random(),
        customName: defaultCustomName,
        currentHp: monsterData.hit_points,
        maxHp: monsterData.hit_points,
        initiative: initialInitiative,
        conditions: [],
        tempHp: 0
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
 * Rimuove un mostro dal combattimento.
 * @param {string} monsterId - L'ID del mostro da rimuovere
 */
export function removeMonsterFromCombat(monsterId) {
    console.log("➖ [CombatStateManager] Rimozione mostro ID:", monsterId);
    
    const monsterIndex = combatState.findIndex(m => m.id === monsterId);
    
    if (monsterIndex > -1) {
        const removedMonster = combatState[monsterIndex];
        combatState.splice(monsterIndex, 1);
        initiativeOrder = initiativeOrder.filter(m => m.id !== monsterId);
        
        if (currentTurnMonsterId === monsterId) {
            currentTurnMonsterId = null;
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
    
    // Mostra notifica se ci sono condizioni attive
    const currentCombatant = initiativeOrder[nextIndex];
    if (currentCombatant?.conditions?.length > 0) {
        const conditionSummariesText = currentCombatant.conditions.map(cond => {
            const summary = conditionSummaries[cond];
            return summary ? `${cond}: ${summary}` : cond;
        }).join(' | ');
        
        const message = `Turno di ${currentCombatant.customName}. Condizioni attive: ${conditionSummariesText}`;
        showToast(message, 'info', 7000);
    }
    
    console.log(`🎯 [CombatStateManager] Turno di: ${currentCombatant.customName}`);
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
 * Importa un incontro predefinito.
 * @param {Object} encounterData - I dati dell'incontro da importare
 */
export function importEncounter(encounterData) {
    if (!encounterData?.monsters) {
        console.error("❌ [CombatStateManager] Dati incontro non validi.");
        showToast('Dati incontro non validi.', 'error');
        return;
    }
    
    console.log(`📥 [CombatStateManager] Importazione incontro: "${encounterData.name}"`);
    
    let importedCount = 0;
    encounterData.monsters.forEach(monsterInEncounter => {
        const monsterData = monsterDatabase.find(m => m.index === monsterInEncounter.index);
        if (monsterData) {
            for (let i = 0; i < monsterInEncounter.quantity; i++) {
                addMonsterToCombat(monsterData);
                importedCount++;
            }
        } else {
            console.error(`❌ [CombatStateManager] Mostro non trovato: ${monsterInEncounter.index}`);
        }
    });
    
    console.log(`📥 [CombatStateManager] Importazione completata. ${importedCount} mostri aggiunti.`);
    showToast(`${importedCount} mostri importati nell'incontro.`, 'success');
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
