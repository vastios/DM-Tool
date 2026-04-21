/**
 * advancedStorage.js
 * ─────────────────────────────────────────────────────────────
 * Servizio avanzato per la persistenza dati con:
 * - Export/Import campagne (backup JSON)
 * - Gestione quota con cleanup automatico
 * - Compressione dati per ottimizzare spazio
 * - Verifica integrità dati
 * 
 * @version 1.0.0
 */

import { showToast } from '../../utils/toast.js';
import { safeLocalStorageGet, safeLocalStorageSet, getCampaignStorageKey, CAMPAIGNS_LIST_KEY } from './storageHelper.js';
import { getCurrentCampaignId } from './campaignManager.js';

// Chiavi per i metadati
const STORAGE_META_KEY = 'dungeonMasterToolStorageMeta';
const BACKUP_TIMESTAMP_KEY = 'dungeonMasterToolLastBackup';

/**
 * Classe per la gestione avanzata dello storage
 */
class AdvancedStorageService {
    constructor() {
        this.memoryFallback = new Map();
        this.quotaWarningThreshold = 0.8; // 80% della quota
        this.lastSizeCheck = 0;
        this.checkInterval = 60000; // 1 minuto
    }

    // ═══════════════════════════════════════════════════════════════
    // UTILITÀ QUOTA E SPAZIO
    // ═══════════════════════════════════════════════════════════════

    /**
     * Calcola lo spazio utilizzato in localStorage
     * @returns {object} { used: bytes, total: bytes, percentage: number }
     */
    getStorageUsage() {
        let totalSize = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            totalSize += (key.length + value.length) * 2; // UTF-16 = 2 bytes per char
        }
        
        // localStorage tipicamente ha 5-10MB
        const estimatedLimit = 5 * 1024 * 1024; // 5MB
        
        return {
            used: totalSize,
            usedMB: (totalSize / (1024 * 1024)).toFixed(2),
            total: estimatedLimit,
            totalMB: (estimatedLimit / (1024 * 1024)).toFixed(2),
            percentage: (totalSize / estimatedLimit) * 100
        };
    }

    /**
     * Verifica se lo storage è quasi pieno
     * @returns {boolean}
     */
    isStorageNearLimit() {
        const usage = this.getStorageUsage();
        return usage.percentage > (this.quotaWarningThreshold * 100);
    }

    /**
     * Cleanup automatico dei dati vecchi/non necessari
     * @returns {number} Bytes liberati
     */
    cleanupOldData() {
        let freedBytes = 0;
        const now = Date.now();
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
        
        // Trova campagne orfane (non nella lista campagne ma con dati)
        const campaignsList = safeLocalStorageGet(CAMPAIGNS_LIST_KEY, []);
        const validCampaignIds = new Set(campaignsList.map(c => c.id));
        
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            // Cerca chiavi di campagne
            const campaignMatch = key.match(/dungeonMasterTool\w+_(.+)$/);
            if (campaignMatch) {
                const campaignId = campaignMatch[1];
                if (!validCampaignIds.has(campaignId)) {
                    keysToRemove.push(key);
                }
            }
        }
        
        // Rimuovi chiavi orfane
        keysToRemove.forEach(key => {
            const value = localStorage.getItem(key);
            freedBytes += (key.length + value.length) * 2;
            localStorage.removeItem(key);
            console.log(`🧹 [AdvancedStorage] Rimossa chiave orfana: ${key}`);
        });
        
        if (freedBytes > 0) {
            showToast(`Pulizia completata: ${(freedBytes / 1024).toFixed(1)}KB liberati`, 'success');
        }
        
        return freedBytes;
    }

    // ═══════════════════════════════════════════════════════════════
    // EXPORT / IMPORT CAMPAGNE
    // ═══════════════════════════════════════════════════════════════

    /**
     * Esporta una campagna completa in JSON
     * @param {string} campaignId - ID della campagna da esportare
     * @returns {object} Dati della campagna serializzati
     */
    exportCampaign(campaignId) {
        if (!campaignId) {
            campaignId = getCurrentCampaignId();
        }
        
        if (!campaignId) {
            showToast('Nessuna campagna selezionata', 'error');
            return null;
        }
        
        const campaignData = {
            version: '2.0',
            exportDate: new Date().toISOString(),
            campaignId: campaignId,
            data: {}
        };
        
        // Raccolta di tutti i dati relativi alla campagna
        const dataKeys = [
            { key: `dungeonMasterToolState_${campaignId}`, name: 'state' },
            { key: `dungeonMasterToolNpcs_${campaignId}`, name: 'npcs' },
            { key: `dungeonMasterToolPgs_${campaignId}`, name: 'pgs' },
            { key: `dungeonMasterToolLocations_${campaignId}`, name: 'locations' },
            { key: `dungeonMasterToolFactions_${campaignId}`, name: 'factions' },
            { key: `dungeonMasterToolSecrets_${campaignId}`, name: 'secrets' },
            { key: `dungeonMasterToolUniqueItems_${campaignId}`, name: 'uniqueItems' },
            { key: `dungeonMasterToolSessionNotes_${campaignId}`, name: 'sessionNotes' },
            { key: `dungeonMasterToolChapters_${campaignId}`, name: 'chapters' },
            { key: `dungeonMasterToolEncounters_${campaignId}`, name: 'encounters' },
            { key: `dungeonMasterToolLocationTags_${campaignId}`, name: 'locationTags' },
            { key: `dungeonMasterToolLocationCustomTypes_${campaignId}`, name: 'locationCustomTypes' }
        ];
        
        dataKeys.forEach(({ key, name }) => {
            const data = safeLocalStorageGet(key, null);
            if (data !== null) {
                campaignData.data[name] = data;
            }
        });
        
        // Aggiungi info campagna
        const campaignsList = safeLocalStorageGet(CAMPAIGNS_LIST_KEY, []);
        const campaignInfo = campaignsList.find(c => c.id === campaignId);
        if (campaignInfo) {
            campaignData.campaignName = campaignInfo.name;
            campaignData.campaignCreatedAt = campaignInfo.createdAt;
        }
        
        console.log(`📦 [AdvancedStorage] Campagna esportata: ${campaignId}`);
        return campaignData;
    }

    /**
     * Esporta TUTTE le campagne in un unico file
     * @returns {object} Tutti i dati esportati
     */
    exportAllCampaigns() {
        const campaignsList = safeLocalStorageGet(CAMPAIGNS_LIST_KEY, []);
        
        const fullExport = {
            version: '2.0',
            exportDate: new Date().toISOString(),
            type: 'fullBackup',
            campaigns: [],
            globalData: {}
        };
        
        // Esporta ogni campagna
        campaignsList.forEach(campaign => {
            const campaignExport = this.exportCampaign(campaign.id);
            if (campaignExport) {
                fullExport.campaigns.push(campaignExport);
            }
        });
        
        // Dati globali (non legati a campagne specifiche)
        const globalKeys = [
            'dungeonMasterToolSettings',
            'dungeonMasterToolLastViewedWiki'
        ];
        
        globalKeys.forEach(key => {
            const data = safeLocalStorageGet(key, null);
            if (data !== null) {
                fullExport.globalData[key] = data;
            }
        });
        
        return fullExport;
    }

    /**
     * Importa una campagna da JSON
     * @param {object} importData - Dati della campagna da importare
     * @param {object} options - { overwrite: boolean, newId: string }
     * @returns {object} { success: boolean, campaignId: string, message: string }
     */
    importCampaign(importData, options = {}) {
        try {
            // Verifica versione
            if (!importData.version) {
                return { success: false, message: 'Formato file non valido: versione mancante' };
            }
            
            // Genera nuovo ID se richiesto o se campagna già esistente
            let campaignId = options.newId || importData.campaignId;
            const campaignsList = safeLocalStorageGet(CAMPAIGNS_LIST_KEY, []);
            const existingCampaign = campaignsList.find(c => c.id === campaignId);
            
            if (existingCampaign && !options.overwrite) {
                // Genera nuovo ID univoco
                campaignId = `${campaignId}_${Date.now()}`;
            }
            
            // Aggiorna la lista campagne
            if (!existingCampaign || options.overwrite) {
                const campaignInfo = {
                    id: campaignId,
                    name: importData.campaignName || `Campagna Importata ${new Date().toLocaleDateString()}`,
                    createdAt: importData.campaignCreatedAt || new Date().toISOString()
                };
                
                // Rimuovi vecchia entry se sovrascrittura
                const updatedList = campaignsList.filter(c => c.id !== campaignId);
                updatedList.push(campaignInfo);
                safeLocalStorageSet(CAMPAIGNS_LIST_KEY, updatedList);
            }
            
            // Ripristina i dati
            const dataMappings = {
                'state': `dungeonMasterToolState_${campaignId}`,
                'npcs': `dungeonMasterToolNpcs_${campaignId}`,
                'pgs': `dungeonMasterToolPgs_${campaignId}`,
                'locations': `dungeonMasterToolLocations_${campaignId}`,
                'factions': `dungeonMasterToolFactions_${campaignId}`,
                'secrets': `dungeonMasterToolSecrets_${campaignId}`,
                'uniqueItems': `dungeonMasterToolUniqueItems_${campaignId}`,
                'sessionNotes': `dungeonMasterToolSessionNotes_${campaignId}`,
                'chapters': `dungeonMasterToolChapters_${campaignId}`,
                'encounters': `dungeonMasterToolEncounters_${campaignId}`,
                'locationTags': `dungeonMasterToolLocationTags_${campaignId}`,
                'locationCustomTypes': `dungeonMasterToolLocationCustomTypes_${campaignId}`
            };
            
            let restoredCount = 0;
            Object.entries(importData.data || {}).forEach(([key, value]) => {
                const storageKey = dataMappings[key];
                if (storageKey && value !== undefined) {
                    safeLocalStorageSet(storageKey, value);
                    restoredCount++;
                }
            });
            
            console.log(`✅ [AdvancedStorage] Campagna importata: ${campaignId} (${restoredCount} entità ripristinate)`);
            
            return {
                success: true,
                campaignId: campaignId,
                message: `Campagna "${importData.campaignName || campaignId}" importata con successo (${restoredCount} entità)`
            };
            
        } catch (error) {
            console.error('❌ [AdvancedStorage] Errore importazione:', error);
            return { success: false, message: `Errore durante l'importazione: ${error.message}` };
        }
    }

    /**
     * Genera un file JSON per download
     * @param {object} data - Dati da scaricare
     * @param {string} filename - Nome del file
     */
    downloadAsJson(data, filename = 'campaign_backup.json') {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Salva timestamp ultimo backup
        localStorage.setItem(BACKUP_TIMESTAMP_KEY, new Date().toISOString());
        
        showToast(`Backup salvato: ${filename}`, 'success');
    }

    /**
     * Legge un file JSON da input file
     * @param {File} file - File da leggere
     * @returns {Promise<object>} Dati parsati
     */
    async readJsonFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(new Error('File JSON non valido'));
                }
            };
            reader.onerror = () => reject(new Error('Errore lettura file'));
            reader.readAsText(file);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // INTEGRITÀ E BACKUP
    // ═══════════════════════════════════════════════════════════════

    /**
     * Verifica l'integrità dei dati di una campagna
     * @param {string} campaignId
     * @returns {object} { valid: boolean, issues: string[] }
     */
    verifyDataIntegrity(campaignId) {
        const issues = [];
        
        // Verifica che i riferimenti incrociati siano validi
        const locations = safeLocalStorageGet(`dungeonMasterToolLocations_${campaignId}`, []);
        const npcs = safeLocalStorageGet(`dungeonMasterToolNpcs_${campaignId}`, []);
        const factions = safeLocalStorageGet(`dungeonMasterToolFactions_${campaignId}`, []);
        
        // Verifica parentId nei luoghi
        const locationIds = new Set(locations.map(l => l.id));
        locations.forEach(loc => {
            if (loc.parentId && !locationIds.has(loc.parentId)) {
                issues.push(`Luogo "${loc.name}": riferimento a padre inesistente`);
            }
        });
        
        // Verifica riferimenti NPC → Luoghi
        const npcIds = new Set(npcs.map(n => n.id));
        npcs.forEach(npc => {
            if (npc.locationId && !locationIds.has(npc.locationId)) {
                issues.push(`NPC "${npc.name}": riferimento a luogo inesistente`);
            }
        });
        
        return {
            valid: issues.length === 0,
            issues: issues,
            stats: {
                locations: locations.length,
                npcs: npcs.length,
                factions: factions.length
            }
        };
    }

    /**
     * Ottiene la data dell'ultimo backup
     * @returns {string|null} Data formattata o null
     */
    getLastBackupDate() {
        const timestamp = localStorage.getItem(BACKUP_TIMESTAMP_KEY);
        if (timestamp) {
            return new Date(timestamp).toLocaleDateString('it-IT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        return null;
    }

    /**
     * Suggerisce backup se passati troppi giorni dall'ultimo
     * @param {number} days - Giorni massimi senza backup
     * @returns {boolean} True se è consigliato un backup
     */
    shouldSuggestBackup(days = 7) {
        const timestamp = localStorage.getItem(BACKUP_TIMESTAMP_KEY);
        if (!timestamp) return true;
        
        const lastBackup = new Date(timestamp);
        const now = new Date();
        const diffDays = (now - lastBackup) / (1000 * 60 * 60 * 24);
        
        return diffDays > days;
    }
}

// Esporta singleton
export const advancedStorage = new AdvancedStorageService();
export default advancedStorage;

console.log('💾 [AdvancedStorage] Servizio storage avanzato caricato.');
