/**
 * index.js - Facade per stateManager
 * ─────────────────────────────────────────────────────────────
 * Punto di ingresso unificato per tutti i moduli di gestione stato.
 * Re-esporta tutte le funzioni dai moduli separati per mantenere
 * la compatibilità con il codice esistente.
 * 
 * @version 1.0.0 - Refactoring modulare
 * 
 * Posizione nel progetto: js/services/index.js
 * 
 * STRUTTURA MODULI:
 * ├── storageHelper.js     → Persistenza localStorage
 * ├── campaignManager.js   → Gestione campagne
 * ├── combatStateManager.js → Combattimento
 * ├── pcManager.js         → Personaggi Giocanti
 * └── index.js             → Questo file (Facade)
 */

// ═══════════════════════════════════════════════════════════════
// IMPORTAZIONI DA CAMPAIGN MANAGER
// ═══════════════════════════════════════════════════════════════
export {
    getCampaignsList,
    createCampaign,
    deleteCampaign,
    selectCampaign,
    getCurrentCampaignId,
    getCurrentCampaign,
    hasSelectedCampaign,
    deselectCampaign,
    onCampaignChange
} from './campaignManager.js';

// ═══════════════════════════════════════════════════════════════
// IMPORTAZIONI DA COMBAT STATE MANAGER
// ═══════════════════════════════════════════════════════════════
export {
    subscribe,
    loadState,
    addMonsterToCombat,
    removeMonsterFromCombat,
    updateMonsterProperty,
    startCombat,
    nextTurn,
    clearCombat,
    useSpellSlot,
    importEncounter,
    getCombatState,
    getState,
    getInitiativeOrder,
    getCurrentRound,
    getCurrentTurnMonsterId,
    getDebugConditionSummaries
} from './combatStateManager.js';

// ═══════════════════════════════════════════════════════════════
// IMPORTAZIONI DA PC MANAGER
// ═══════════════════════════════════════════════════════════════
export {
    loadPcs,
    updateCampaignPcs,
    getCampaignPcs,
    addPc,
    removePc,
    updatePc,
    getPcById,
    hasPcs,
    getPcCount,
    clearPcs
} from './pcManager.js';

// ═══════════════════════════════════════════════════════════════
// IMPORTAZIONI DA STORAGE HELPER (utility pubbliche)
// ═══════════════════════════════════════════════════════════════
export {
    safeLocalStorageSet,
    safeLocalStorageGet,
    safeLocalStorageRemove,
    getCampaignStorageKey,
    STORAGE_KEY_PREFIX,
    CAMPAIGNS_LIST_KEY,
    APP_VERSION
} from './storageHelper.js';

// ═══════════════════════════════════════════════════════════════
// UTILITY WIKI (mantenute per compatibilità)
// ═══════════════════════════════════════════════════════════════

// Stato per l'elemento wiki visualizzato per ultimo
let lastViewedWikiElement = null;

/**
 * Imposta l'ultimo elemento wiki visualizzato.
 * @param {any} element - L'elemento wiki
 */
export function setLastViewedWikiElement(element) { 
    lastViewedWikiElement = element; 
}

/**
 * Ottiene l'ultimo elemento wiki visualizzato.
 * @returns {any} L'elemento wiki
 */
export function getLastViewedWikiElement() { 
    return lastViewedWikiElement; 
}

// ═══════════════════════════════════════════════════════════════
// INIZIALIZZAZIONE
// ═══════════════════════════════════════════════════════════════

import { loadState } from './combatStateManager.js';
import { loadPcs } from './pcManager.js';
import { onCampaignChange } from './campaignManager.js';

// Registra listener per ricaricare lo stato quando cambia la campagna
onCampaignChange((campaignId) => {
    if (campaignId) {
        console.log('🔄 [StateManagerFacade] Cambio campagna, ricaricamento stato...');
        loadState();
        loadPcs();
    }
});

console.log('🔗 [StateManagerFacade] Modulo facade caricato. Tutte le esportazioni pronte.');
