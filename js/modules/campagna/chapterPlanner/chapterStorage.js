// js/modules/campagna/chapterPlanner/chapterStorage.js

import { getCurrentCampaignId } from '../../../../stateManager.js';
import { showToast } from '../../../../utils/toast.js';

/**
 * Genera la chiave per il localStorage basata sull'ID della campagna corrente.
 * @returns {string|null} La chiave di storage o null se nessuna campagna è selezionata.
 */
export const getStorageKey = () => {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) {
        console.warn("⚠️ [ChapterPlanner] Nessuna campagna selezionata. Impossibile accedere ai dati.");
        return null;
    }
    return `dungeonMasterToolChapters_${campaignId}`;
};

/**
 * Carica le voci (capitoli e side quest) dal localStorage.
 * @returns {Array} Un array di voci. Restituisce un array vuoto in caso di errore o se non ci sono dati.
 */
export const loadEntries = () => {
    const key = getStorageKey();
    console.log(`📂 [ChapterStorage] loadEntries - Key: ${key}`);
    
    if (!key) {
        console.error("❌ [ChapterStorage] Nessuna chiave storage! getCurrentCampaignId() = null");
        return [];
    }
    
    try {
        const savedEntriesJSON = localStorage.getItem(key);
        console.log(`📂 [ChapterStorage] Dati grezzi dal localStorage:`, savedEntriesJSON ? `${savedEntriesJSON.substring(0, 100)}...` : 'null');
        
        const parsed = savedEntriesJSON ? JSON.parse(savedEntriesJSON) : [];
        console.log(`📂 [ChapterStorage] Parsed entries: ${parsed.length} voci`);
        console.log(`📂 [ChapterStorage] Tipi:`, parsed.map(e => e.type));
        
        return parsed;
    } catch (error) {
        console.error("❌ [ChapterStorage] Errore parsing:", error);
        return [];
    }
};

/**
 * Salva le voci (capitoli e side quest) nel localStorage.
 * @param {Array} entries L'array di voci da salvare.
 */
export const saveEntries = (entries) => {
    const key = getStorageKey();
    console.log(`💾 [ChapterStorage] saveEntries - Key: ${key}`);
    console.log(`💾 [ChapterStorage] saveEntries - Entries da salvare: ${entries?.length || 0}`);
    console.log(`💾 [ChapterStorage] saveEntries - Tipi:`, entries?.map(e => e.type));
    
    if (!key) {
        console.error("❌ [ChapterStorage] Impossibile salvare: nessuna campagna selezionata!");
        showToast("Errore: nessuna campagna selezionata.", 'error');
        return false;
    }
    
    if (!entries || !Array.isArray(entries)) {
        console.error("❌ [ChapterStorage] Entries non valido:", entries);
        return false;
    }
    
    try {
        const jsonStr = JSON.stringify(entries);
        localStorage.setItem(key, jsonStr);
        console.log(`✅ [ChapterStorage] Salvataggio riuscito! ${entries.length} voci salvate.`);
        
        // Verifica immediata
        const verification = localStorage.getItem(key);
        console.log(`✅ [ChapterStorage] Verifica - Dati scritti: ${verification ? 'OK' : 'ERRORE'}`);
        
        return true;
    } catch (error) {
        console.error("❌ [ChapterStorage] Errore salvataggio:", error);
        showToast("Errore: impossibile salvare i dati.", 'error');
        return false;
    }
};

/**
 * Carica le note di sessione per la campagna corrente.
 * @returns {Array} Un array di note di sessione.
 */
export const getSessionNotes = () => {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return [];
    try {
        const sessionKey = `dungeonMasterToolSessionNotes_${campaignId}`;
        const allSessionsJSON = localStorage.getItem(sessionKey);
        return allSessionsJSON ? JSON.parse(allSessionsJSON) : [];
    } catch (error) {
        console.error("❌ [ChapterPlanner] Impossibile caricare le note di sessione.", error);
        return [];
    }
};