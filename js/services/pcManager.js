/**
 * pcManager.js
 * ─────────────────────────────────────────────────────────────
 * Modulo per la gestione dei Personaggi Giocanti (PG).
 * Gestisce il salvataggio e il recupero dei PG della campagna.
 * 
 * @version 1.0.0 - Estratto da stateManager.js
 * 
 * Posizione nel progetto: js/services/pcManager.js
 */

import { 
    safeLocalStorageSet, 
    safeLocalStorageGet, 
    getCampaignStorageKey 
} from './storageHelper.js';
import { getCurrentCampaignId } from './campaignManager.js';

// --- STATO INTERNO ---
let campaignPcs = [];

// --- STORAGE KEY PER PG ---
const PCS_STORAGE_SUBKEY = 'pcs';

/**
 * Salva lo stato dei PG nel localStorage.
 */
function savePcs() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) {
        console.warn("⚠️ [PcManager] Nessuna campagna selezionata. Impossibile salvare i PG.");
        return;
    }
    
    // Leggiamo lo stato esistente per preservare altri dati (combattimento, ecc.)
    const existingState = safeLocalStorageGet(getCampaignStorageKey(campaignId), {});
    existingState.pcs = campaignPcs;
    
    safeLocalStorageSet(getCampaignStorageKey(campaignId), existingState);
    console.log(`💾 [PcManager] ${campaignPcs.length} PG salvati per campagna ${campaignId}.`);
}

/**
 * Carica i PG dal localStorage.
 */
export function loadPcs() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) {
        console.warn("⚠️ [PcManager] Nessuna campagna selezionata.");
        campaignPcs = [];
        return;
    }
    
    const savedState = safeLocalStorageGet(getCampaignStorageKey(campaignId), {});
    campaignPcs = savedState.pcs || [];
    
    console.log(`📂 [PcManager] Caricati ${campaignPcs.length} PG per campagna ${campaignId}.`);
}

/**
 * Aggiorna la lista dei PG della campagna.
 * @param {Array} pcs - La nuova lista di PG
 */
export function updateCampaignPcs(pcs) {
    campaignPcs = Array.isArray(pcs) ? [...pcs] : [];
    console.log("👥 [PcManager] PG aggiornati in memoria:", campaignPcs.length);
    savePcs();
}

/**
 * Ottiene la lista dei PG della campagna.
 * @returns {Array} Copia dell'array dei PG
 */
export function getCampaignPcs() {
    return [...campaignPcs];
}

/**
 * Aggiunge un singolo PG alla campagna.
 * @param {Object} pc - Il PG da aggiungere
 * @returns {Object} Il PG aggiunto (con ID generato se non presente)
 */
export function addPc(pc) {
    const newPc = {
        ...pc,
        id: pc.id || `pc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    campaignPcs.push(newPc);
    savePcs();
    
    console.log(`👥 [PcManager] PG aggiunto: ${newPc.name || 'Senza nome'}`);
    return newPc;
}

/**
 * Rimuove un PG dalla campagna.
 * @param {string} pcId - L'ID del PG da rimuovere
 * @returns {boolean} True se rimosso, false altrimenti
 */
export function removePc(pcId) {
    const index = campaignPcs.findIndex(pc => pc.id === pcId);
    
    if (index > -1) {
        const removed = campaignPcs.splice(index, 1)[0];
        savePcs();
        console.log(`👥 [PcManager] PG rimosso: ${removed.name || pcId}`);
        return true;
    }
    
    return false;
}

/**
 * Aggiorna un PG esistente.
 * @param {string} pcId - L'ID del PG da aggiornare
 * @param {Object} updates - Le proprietà da aggiornare
 * @returns {Object|null} Il PG aggiornato o null se non trovato
 */
export function updatePc(pcId, updates) {
    const pc = campaignPcs.find(pc => pc.id === pcId);
    
    if (pc) {
        Object.assign(pc, updates);
        savePcs();
        console.log(`👥 [PcManager] PG aggiornato: ${pc.name || pcId}`);
        return pc;
    }
    
    return null;
}

/**
 * Ottiene un singolo PG per ID.
 * @param {string} pcId - L'ID del PG
 * @returns {Object|null} Il PG trovato o null
 */
export function getPcById(pcId) {
    return campaignPcs.find(pc => pc.id === pcId) || null;
}

/**
 * Verifica se ci sono PG nella campagna.
 * @returns {boolean} True se ci sono PG
 */
export function hasPcs() {
    return campaignPcs.length > 0;
}

/**
 * Ottiene il numero di PG nella campagna.
 * @returns {number} Il numero di PG
 */
export function getPcCount() {
    return campaignPcs.length;
}

/**
 * Resetta i PG (svuota la lista).
 */
export function clearPcs() {
    campaignPcs = [];
    savePcs();
    console.log("👥 [PcManager] Lista PG svuotata.");
}

console.log('👥 [PcManager] Modulo caricato.');
