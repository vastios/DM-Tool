/**
 * storageHelper.js
 * ─────────────────────────────────────────────────────────────
 * Modulo per la gestione sicura del localStorage.
 * Centralizza la logica di lettura/scrittura con gestione errori.
 * 
 * @version 1.0.0 - Estratto da stateManager.js
 * 
 * Posizione nel progetto: js/services/storageHelper.js
 */

import { showToast } from '../../utils/toast.js';

// --- COSTANTI PER IL LOCAL STORAGE ---
export const STORAGE_KEY_PREFIX = 'dungeonMasterToolState_';
export const CAMPAIGNS_LIST_KEY = 'dungeonMasterToolCampaignsList';
export const APP_VERSION = '1.1';

/**
 * Scrive in modo sicuro un valore in localStorage.
 * Gestisce errori come QuotaExceededError e dati non serializzabili.
 * 
 * @param {string} key - La chiave dove salvare il dato.
 * @param {any} value - Il dato da salvare (verrà convertito in JSON).
 * @returns {boolean} True se il salvataggio è riuscito, false altrimenti.
 */
export function safeLocalStorageSet(key, value) {
    try {
        const valueToStore = JSON.stringify(value);
        localStorage.setItem(key, valueToStore);
        console.log(`💾 [StorageHelper] Salvataggio riuscito per chiave: ${key}`);
        return true;
    } catch (error) {
        console.error(`❌ [StorageHelper] Errore durante il salvataggio su localStorage (chiave: ${key}):`, error);
        
        if (error.name === 'QuotaExceededError') {
            showToast('Spazio di archiviazione esaurito. Impossibile salvare i dati.', 'error');
        } else {
            showToast('Errore critico durante il salvataggio. I dati potrebbero non essere stati salvati.', 'error');
        }
        
        return false;
    }
}

/**
 * Legge in modo sicuro un valore da localStorage.
 * Gestisce dati corrotti e restituisce un valore di default se necessario.
 * 
 * @param {string} key - La chiave del dato da leggere.
 * @param {any} [defaultValue=null] - Il valore da restituire se la chiave non esiste o se il dato è corrotto.
 * @returns {any} Il dato parsato o il valore di default.
 */
export function safeLocalStorageGet(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        
        if (item === null) {
            console.log(`📂 [StorageHelper] Nessun dato trovato per chiave: ${key}`);
            return defaultValue;
        }
        
        const parsedData = JSON.parse(item);
        console.log(`📂 [StorageHelper] Dato caricato per chiave: ${key}`);
        return parsedData;
        
    } catch (error) {
        console.error(`❌ [StorageHelper] Errore durante la lettura da localStorage (chiave: ${key}). Dati corrotti?`, error);
        showToast(`Errore durante il caricamento dei dati per "${key}". I dati potrebbero essere corrotti e sono stati resettati.`, 'error');
        
        // Rimuoviamo i dati corrotti per permettere all'app di funzionare correttamente al prossimo salvataggio.
        try {
            localStorage.removeItem(key);
            console.log(`🗑️ [StorageHelper] Dati corrotti rimossi per chiave: ${key}`);
        } catch (removeError) {
            console.error(`❌ [StorageHelper] Errore fatale: impossibile rimuovere i dati corrotti per la chiave ${key}.`, removeError);
        }
        
        return defaultValue;
    }
}

/**
 * Rimuove in modo sicuro una chiave da localStorage.
 * 
 * @param {string} key - La chiave da rimuovere.
 * @returns {boolean} True se la rimozione è riuscita, false altrimenti.
 */
export function safeLocalStorageRemove(key) {
    try {
        localStorage.removeItem(key);
        console.log(`🗑️ [StorageHelper] Chiave rimossa: ${key}`);
        return true;
    } catch (error) {
        console.error(`❌ [StorageHelper] Errore durante la rimozione della chiave ${key}:`, error);
        return false;
    }
}

/**
 * Genera la chiave di storage per una campagna specifica.
 * 
 * @param {string} campaignId - L'ID della campagna.
 * @returns {string} La chiave di storage formattata.
 */
export function getCampaignStorageKey(campaignId) {
    return `${STORAGE_KEY_PREFIX}${campaignId}`;
}

console.log('📦 [StorageHelper] Modulo caricato.');
