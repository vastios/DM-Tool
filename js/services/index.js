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
    addPcToCombat,
    addNpcToCombat,
    removeMonsterFromCombat,
    updateMonsterProperty,
    startCombat,
    nextTurn,
    clearCombat,
    endCombat,
    rerollAllInitiative,
    useSpellSlot,
    usePerDaySpell,
    useSpell,
    resetPerDaySpells,
    importEncounter,
    getCombatState,
    getState,
    getInitiativeOrder,
    getCurrentRound,
    getCurrentTurnMonsterId,
    getDebugConditionSummaries,
    addConditionToCombatant,
    removeConditionFromCombatant,
    // Concentrazione
    setConcentration,
    breakConcentration,
    rollConcentrationSave,
    getConcentration,
    // Incantesimi attivi
    addActiveSpell,
    removeActiveSpell,
    getActiveSpells,
    // Tracciamento azioni
    useAction,
    resetActionsForTurn
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
// IMPORTAZIONI SERVIZI AVANZATI (v2.0)
// ═══════════════════════════════════════════════════════════════
export { advancedStorage } from './advancedStorage.js';
export { historyManager } from './historyManager.js';
export { searchIndex } from './searchIndex.js';

// ═══════════════════════════════════════════════════════════════
// RE-EXPORT UTILITIES (v2.1)
// ═══════════════════════════════════════════════════════════════
export { BaseModule } from '../utils/BaseModule.js';
export { debounce, throttle, rafThrottle, memoize, createBatcher, lazy, once, createRateLimiter } from '../utils/performance.js';
export { showToast, showSuccess, showError, showWarning, showInfo, showConfirm, showWithUndo, dismissAllToasts } from '../utils/toast.js';
export { validators, validateObject, createFormValidator, getModifier, formatModifier, DND_CONSTANTS } from '../utils/validators.js';

// ═══════════════════════════════════════════════════════════════
// RE-EXPORT UTILITIES (v2.2 - Priority Improvements)
// ═══════════════════════════════════════════════════════════════
// Lazy Loading
export { lazyLoader, createLazyImage, createPlaceholder, loadModule, preloadModules, initializeLazyLoading } from '../utils/lazyLoader.js';

// Keyboard Shortcuts
export { keyboardManager, registerShortcut, unregisterShortcut, setKeyboardScope, resetKeyboardScope, showShortcutsHelp, hideShortcutsHelp, registerDefaultShortcuts } from '../utils/keyboardShortcuts.js';

// Theme Manager
export { themeManager, setTheme, toggleTheme, getTheme, isDarkTheme, onThemeChange, createThemeToggle, THEMES } from '../utils/themeManager.js';

// Accessibility
export { createFocusTrap, announce, setAria, createAccessibleElement, createScreenReaderText, saveFocus, restoreFocus, moveFocus, focusFirst, createSkipLinks, createAccessibleModal, enableKeyboardNavigation } from '../utils/accessibility.js';

// Performance Monitor
export { perfMonitor, perfMark, perfMeasure, perfTime, perfTimeEnd, perfWrap, getPerfReport, showPerfDebug } from '../utils/performanceMonitor.js';

// ═══════════════════════════════════════════════════════════════
// INIZIALIZZAZIONE
// ═══════════════════════════════════════════════════════════════

import { loadState } from './combatStateManager.js';
import { loadPcs } from './pcManager.js';
import { onCampaignChange } from './campaignManager.js';
import { advancedStorage } from './advancedStorage.js';
import { historyManager } from './historyManager.js';
import { searchIndex } from './searchIndex.js';
import { safeLocalStorageGet, CAMPAIGNS_LIST_KEY } from './storageHelper.js';

// Registra listener per ricaricare lo stato quando cambia la campagna
onCampaignChange((campaignId) => {
    if (campaignId) {
        console.log('🔄 [StateManagerFacade] Cambio campagna, ricaricamento stato...');
        loadState();
        loadPcs();
        
        // Ricostruisci indice di ricerca per la nuova campagna
        rebuildSearchIndex(campaignId);
    }
});

/**
 * Ricostruisce l'indice di ricerca per una campagna
 */
function rebuildSearchIndex(campaignId) {
    searchIndex.clear();
    
    // Indicizza NPC
    const npcs = safeLocalStorageGet(`dungeonMasterToolNpcs_${campaignId}`, []);
    npcs.forEach(npc => {
        if (npc.id && npc.name) {
            searchIndex.indexDocument({
                id: npc.id,
                type: 'npc',
                name: npc.name,
                content: `${npc.description || ''} ${npc.background || ''} ${npc.role || ''}`.trim(),
                metadata: { campaignId }
            });
        }
    });
    
    // Indicizza PG
    const pgs = safeLocalStorageGet(`dungeonMasterToolPgs_${campaignId}`, []);
    pgs.forEach(pg => {
        if (pg.id && (pg.name || pg.nome)) {
            searchIndex.indexDocument({
                id: pg.id,
                type: 'pg',
                name: pg.name || pg.nome,
                content: `${pg.class || pg.classe || ''} ${pg.race || pg.razza || ''} ${pg.background || ''}`.trim(),
                metadata: { campaignId }
            });
        }
    });
    
    // Indicizza Luoghi
    const locations = safeLocalStorageGet(`dungeonMasterToolLocations_${campaignId}`, []);
    locations.forEach(loc => {
        if (loc.id && loc.name) {
            searchIndex.indexDocument({
                id: loc.id,
                type: 'location',
                name: loc.name,
                content: `${loc.description || ''} ${loc.inhabitants || ''} ${loc.type || ''}`.trim(),
                metadata: { campaignId, parentId: loc.parentId }
            });
        }
    });
    
    // Indicizza Fazioni
    const factions = safeLocalStorageGet(`dungeonMasterToolFactions_${campaignId}`, []);
    factions.forEach(faction => {
        if (faction.id && faction.name) {
            searchIndex.indexDocument({
                id: faction.id,
                type: 'faction',
                name: faction.name,
                content: `${faction.description || ''} ${faction.goals || ''}`.trim(),
                metadata: { campaignId }
            });
        }
    });
    
    // Indicizza Segreti
    const secrets = safeLocalStorageGet(`dungeonMasterToolSecrets_${campaignId}`, []);
    secrets.forEach(secret => {
        if (secret.id && (secret.name || secret.title)) {
            searchIndex.indexDocument({
                id: secret.id,
                type: 'secret',
                name: secret.name || secret.title,
                content: secret.description || '',
                metadata: { campaignId }
            });
        }
    });
    
    // Indicizza Oggetti Unici
    const items = safeLocalStorageGet(`dungeonMasterToolUniqueItems_${campaignId}`, []);
    items.forEach(item => {
        if (item.id && (item.name || item.title)) {
            searchIndex.indexDocument({
                id: item.id,
                type: 'uniqueItem',
                name: item.name || item.title,
                content: `${item.description || ''} ${item.type || ''}`.trim(),
                metadata: { campaignId }
            });
        }
    });
    
    console.log(`🔍 [StateManagerFacade] Indice ricerca ricostruito: ${searchIndex.getStats().totalDocuments} documenti`);
}

/**
 * Inizializza tutti i servizi avanzati
 */
export function initializeAdvancedServices() {
    const campaignId = safeLocalStorageGet('dungeonMasterToolSelectedCampaign', null);
    
    if (campaignId) {
        rebuildSearchIndex(campaignId);
    }
    
    // Verifica se suggerire backup
    if (advancedStorage.shouldSuggestBackup(7)) {
        console.log('💡 [StateManagerFacade] Backup consigliato: più di 7 giorni dall\'ultimo backup');
    }
    
    // Verifica spazio storage
    const usage = advancedStorage.getStorageUsage();
    if (usage.percentage > 80) {
        console.warn(`⚠️ [StateManagerFacade] Storage quasi pieno: ${usage.percentage.toFixed(1)}%`);
    }
    
    console.log('✅ [StateManagerFacade] Servizi avanzati inizializzati');
}

console.log('🔗 [StateManagerFacade] Modulo facade caricato. Tutte le esportazioni pronte.');
