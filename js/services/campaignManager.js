/**
 * campaignManager.js
 * ─────────────────────────────────────────────────────────────
 * Modulo per la gestione delle campagne.
 * Gestisce creazione, eliminazione, selezione e lista delle campagne.
 * 
 * @version 1.1.0 - Aggiunto persistenza campagna selezionata
 * 
 * Posizione nel progetto: js/services/campaignManager.js
 */

import { 
    safeLocalStorageSet, 
    safeLocalStorageGet, 
    safeLocalStorageRemove,
    CAMPAIGNS_LIST_KEY,
    getCampaignStorageKey
} from './storageHelper.js';
import { showToast } from '../../utils/toast.js';

// --- CHIAVE PER LA CAMPAGNA SELEZIONATA ---
const SELECTED_CAMPAIGN_KEY = 'dungeonMasterToolSelectedCampaign';

// --- STATO INTERNO ---
let currentCampaignId = null;

// --- INIZIALIZZAZIONE: Ripristina l'ultima campagna selezionata ---
function initializeCurrentCampaign() {
    const savedId = localStorage.getItem(SELECTED_CAMPAIGN_KEY);
    if (savedId) {
        const campaignsList = getCampaignsList();
        const campaign = campaignsList.find(c => c.id === savedId);
        if (campaign) {
            currentCampaignId = savedId;
            console.log(`📖 [CampaignManager] Campagna ripristinata: ${campaign.name} (${savedId})`);
        } else {
            // La campagna salvata non esiste più
            localStorage.removeItem(SELECTED_CAMPAIGN_KEY);
        }
    }
}

// Esegui all'avvio del modulo
initializeCurrentCampaign();

// --- LISTENER PER CAMBIAMENTI CAMPAGNA ---
const campaignChangeListeners = [];

/**
 * Registra un listener per i cambiamenti di campagna.
 * @param {Function} callback - Funzione chiamata quando la campagna cambia
 */
export function onCampaignChange(callback) {
    campaignChangeListeners.push(callback);
}

/**
 * Notifica tutti i listener del cambio campagna.
 * @param {string} campaignId - ID della nuova campagna selezionata
 */
function notifyCampaignChange(campaignId) {
    campaignChangeListeners.forEach(callback => callback(campaignId));
}

// --- FUNZIONI DI GESTIONE CAMPAGNE ---

/**
 * Ottiene la lista di tutte le campagne salvate.
 * @returns {Array<{id: string, name: string, createdAt: string}>} Lista delle campagne
 */
export function getCampaignsList() {
    return safeLocalStorageGet(CAMPAIGNS_LIST_KEY, []);
}

/**
 * Salva la lista delle campagne nel localStorage.
 * @param {Array} campaignsList - La lista delle campagne da salvare
 */
function saveCampaignsList(campaignsList) {
    safeLocalStorageSet(CAMPAIGNS_LIST_KEY, campaignsList);
}

/**
 * Crea una nuova campagna.
 * @param {string} name - Il nome della nuova campagna
 * @returns {Object|null} La campagna creata o null se fallita
 */
export function createCampaign(name) {
    if (!name || name.trim() === '') {
        showToast('Il nome della campagna non può essere vuoto.', 'error');
        return null;
    }
    
    const campaignsList = getCampaignsList();
    const newCampaign = {
        id: Date.now().toString(),
        name: name.trim(),
        createdAt: new Date().toISOString()
    };
    
    campaignsList.push(newCampaign);
    saveCampaignsList(campaignsList);
    
    // Seleziona automaticamente la nuova campagna
    selectCampaign(newCampaign.id);
    
    showToast(`Campagna "${name}" creata e selezionata.`, 'success');
    console.log(`✅ [CampaignManager] Campagna creata: ${name} (${newCampaign.id})`);
    
    return newCampaign;
}

/**
 * Elimina una campagna e tutti i suoi dati associati.
 * @param {string} campaignId - L'ID della campagna da eliminare
 * @returns {boolean} True se eliminata, false altrimenti
 */
export function deleteCampaign(campaignId) {
    if (!campaignId) return false;
    
    const campaignsList = getCampaignsList();
    const campaignToDelete = campaignsList.find(c => c.id === campaignId);
    
    if (!campaignToDelete) {
        showToast('Campagna non trovata.', 'error');
        return false;
    }

    // Conferma eliminazione
    if (!confirm(`Sei sicuro di voler eliminare la campagna "${campaignToDelete.name}" e tutti i suoi dati associati?`)) {
        return false;
    }

    // Rimuovi dalla lista
    const updatedList = campaignsList.filter(c => c.id !== campaignId);
    saveCampaignsList(updatedList);

    // Rimuovi i dati specifici della campagna
    safeLocalStorageRemove(getCampaignStorageKey(campaignId));
    safeLocalStorageRemove(`dungeonMasterToolEncounters_${campaignId}`);

    // Se era la campagna corrente, deseleziona
    if (currentCampaignId === campaignId) {
        deselectCampaign();
    }
    
    showToast(`Campagna "${campaignToDelete.name}" eliminata.`, 'warning');
    console.log(`🗑️ [CampaignManager] Campagna eliminata: ${campaignToDelete.name} (${campaignId})`);
    
    return true;
}

/**
 * Seleziona una campagna come attiva.
 * @param {string} campaignId - L'ID della campagna da selezionare
 * @returns {boolean} True se selezionata, false altrimenti
 */
export function selectCampaign(campaignId) {
    if (!campaignId) {
        console.warn('⚠️ [CampaignManager] ID campagna non valido.');
        return false;
    }
    
    const campaignsList = getCampaignsList();
    const campaign = campaignsList.find(c => c.id === campaignId);
    
    if (!campaign) {
        showToast('Campagna non trovata.', 'error');
        return false;
    }
    
    currentCampaignId = campaignId;
    
    // Persisti la selezione nel localStorage
    localStorage.setItem(SELECTED_CAMPAIGN_KEY, campaignId);
    
    notifyCampaignChange(campaignId);
    
    console.log(`📖 [CampaignManager] Campagna selezionata: ${campaign.name} (${campaignId})`);
    return true;
}

/**
 * Ottiene l'ID della campagna correntemente selezionata.
 * @returns {string|null} L'ID della campagna o null se nessuna selezionata
 */
export function getCurrentCampaignId() {
    return currentCampaignId;
}

/**
 * Ottiene i dati della campagna corrente.
 * @returns {Object|null} I dati della campagna o null se nessuna selezionata
 */
export function getCurrentCampaign() {
    if (!currentCampaignId) return null;
    
    const campaignsList = getCampaignsList();
    return campaignsList.find(c => c.id === currentCampaignId) || null;
}

/**
 * Verifica se c'è una campagna selezionata.
 * @returns {boolean} True se una campagna è selezionata
 */
export function hasSelectedCampaign() {
    return currentCampaignId !== null;
}

/**
 * Deseleziona la campagna corrente.
 */
export function deselectCampaign() {
    currentCampaignId = null;
    localStorage.removeItem(SELECTED_CAMPAIGN_KEY);
    notifyCampaignChange(null);
    console.log('📖 [CampaignManager] Campagna deselezionata.');
}

console.log('📖 [CampaignManager] Modulo caricato.');
