/**
 * storage.js
 * ─────────────────────────────────────────────────────────────
 * Funzioni per il salvataggio e caricamento dati
 */

import { getCurrentCampaignId } from '../../../services/campaignManager.js';
import { getCampaignPcs } from '../../../stateManager.js';
import { 
    setAvailablePcs, 
    setAvailableNpcs, 
    setSavedEncounters 
} from './config.js';

/**
 * Genera la chiave di storage per i PNG della campagna
 */
export function getNpcStorageKey() {
    const campaignId = getCurrentCampaignId();
    return campaignId ? `dungeonMasterToolNpcs_${campaignId}` : null;
}

/**
 * Genera la chiave di storage per gli incontri salvati
 */
export function getEncounterStorageKey() {
    const campaignId = getCurrentCampaignId();
    return campaignId ? `dungeonMasterToolEncounters_${campaignId}` : null;
}

/**
 * Carica i PNG dal localStorage
 */
export function loadNpcs() {
    const key = getNpcStorageKey();
    if (!key) return [];
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Errore caricamento PNG:', e);
        return [];
    }
}

/**
 * Carica gli incontri salvati dal localStorage
 */
export function loadEncounters() {
    const key = getEncounterStorageKey();
    if (!key) return [];
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Errore caricamento incontri:', e);
        return [];
    }
}

/**
 * Carica tutte le fonti dati (PG, PNG, Incontri)
 */
export function loadAllSources() {
    setAvailablePcs(getCampaignPcs() || []);
    setAvailableNpcs(loadNpcs());
    setSavedEncounters(loadEncounters());
}
