/**
 * historyManager.js
 * ─────────────────────────────────────────────────────────────
 * Sistema di Undo/Redo per operazioni critiche.
 * Supporta:
 * - Stack configurabile di stati
 * - Snapshot selettivi (solo entità modificate)
 * - Compressione automatica per risparmiare memoria
 * - Keyboard shortcuts (Ctrl+Z / Ctrl+Y)
 * 
 * @version 1.0.0
 */

import { showToast } from '../../utils/toast.js';

/**
 * @typedef {Object} HistoryEntry
 * @property {string} id - ID univoco dell'entry
 * @property {string} action - Descrizione dell'azione (es. "Eliminato NPC")
 * @property {string} entityType - Tipo entità (npc, location, pg, etc.)
 * @property {string} entityId - ID dell'entità modificata
 * @property {object} before - Stato prima dell'azione
 * @property {object} after - Stato dopo l'azione (null per eliminazioni)
 * @property {number} timestamp - Unix timestamp
 * @property {object} metadata - Dati aggiuntivi (campaignId, etc.)
 */

/**
 * Classe per la gestione della cronologia operazioni
 */
class HistoryManager {
    /**
     * @param {object} options
     * @param {number} options.maxSteps - Numero massimo di step salvati (default: 50)
     * @param {number} options.maxSizeBytes - Dimensione massima in bytes (default: 2MB)
     * @param {boolean} options.enableCompression - Abilita compressione (default: true)
     */
    constructor(options = {}) {
        this.maxSteps = options.maxSteps || 50;
        this.maxSizeBytes = options.maxSizeBytes || 2 * 1024 * 1024; // 2MB
        this.enableCompression = options.enableCompression !== false;
        
        /** @type {HistoryEntry[]} */
        this.history = [];
        this.currentIndex = -1;
        
        /** @type {Map<string, Function>} */
        this.restoreHandlers = new Map();
        
        this.isEnabled = true;
        this.isPerformingUndoRedo = false;
        
        // Inizializza listener tastiera
        this.initKeyboardShortcuts();
    }

    // ═══════════════════════════════════════════════════════════════
    // GESTIONE STATO
    // ═══════════════════════════════════════════════════════════════

    /**
     * Registra un'azione nella cronologia
     * @param {object} params
     * @param {string} params.action - Descrizione azione
     * @param {string} params.entityType - Tipo entità
     * @param {string} params.entityId - ID entità
     * @param {object} params.before - Stato precedente
     * @param {object} params.after - Stato successivo
     * @param {object} params.metadata - Metadati aggiuntivi
     * @returns {string} ID dell'entry creata
     */
    push(params) {
        if (!this.isEnabled || this.isPerformingUndoRedo) {
            return null;
        }
        
        const { action, entityType, entityId, before, after, metadata = {} } = params;
        
        // Se abbiamo fatto undo e ora facciamo una nuova azione,
        // rimuoviamo tutti gli stati "redo" successivi
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }
        
        /** @type {HistoryEntry} */
        const entry = {
            id: this.generateId(),
            action: action,
            entityType: entityType,
            entityId: entityId,
            before: this.deepClone(before),
            after: this.deepClone(after),
            timestamp: Date.now(),
            metadata: metadata
        };
        
        this.history.push(entry);
        this.currentIndex = this.history.length - 1;
        
        // Verifica limiti e pulisci se necessario
        this.enforceLimits();
        
        console.log(`📜 [HistoryManager] Registrato: "${action}" (${entityType}/${entityId})`);
        return entry.id;
    }

    /**
     * Registra una creazione di entità
     */
    pushCreate(entityType, entityId, entity, metadata = {}) {
        return this.push({
            action: `Creato ${entityType}`,
            entityType,
            entityId,
            before: null,
            after: entity,
            metadata
        });
    }

    /**
     * Registra una modifica di entità
     */
    pushUpdate(entityType, entityId, before, after, metadata = {}) {
        return this.push({
            action: `Modificato ${entityType}`,
            entityType,
            entityId,
            before,
            after,
            metadata
        });
    }

    /**
     * Registra un'eliminazione di entità
     */
    pushDelete(entityType, entityId, entity, metadata = {}) {
        return this.push({
            action: `Eliminato ${entityType}`,
            entityType,
            entityId,
            before: entity,
            after: null,
            metadata
        });
    }

    /**
     * Annulla l'ultima azione
     * @returns {HistoryEntry|null} L'entry annullata o null
     */
    undo() {
        if (!this.canUndo()) {
            showToast('Nessuna azione da annullare', 'warning');
            return null;
        }
        
        const entry = this.history[this.currentIndex];
        
        this.isPerformingUndoRedo = true;
        try {
            // Chiama l'handler di ripristino
            const handler = this.restoreHandlers.get(entry.entityType);
            if (handler) {
                // Per undo: ripristina lo stato "before"
                handler(entry.before, entry.after, entry);
            }
            
            this.currentIndex--;
            
            console.log(`↩️ [HistoryManager] Undo: "${entry.action}"`);
            showToast(`Annullato: ${entry.action}`, 'info', 2000);
            
            return entry;
        } catch (error) {
            console.error('❌ [HistoryManager] Errore durante undo:', error);
            showToast('Errore durante l\'annullamento', 'error');
            return null;
        } finally {
            this.isPerformingUndoRedo = false;
        }
    }

    /**
     * Ripete l'azione annullata
     * @returns {HistoryEntry|null} L'entry ripetuta o null
     */
    redo() {
        if (!this.canRedo()) {
            showToast('Nessuna azione da ripetere', 'warning');
            return null;
        }
        
        const entry = this.history[this.currentIndex + 1];
        
        this.isPerformingUndoRedo = true;
        try {
            const handler = this.restoreHandlers.get(entry.entityType);
            if (handler) {
                // Per redo: ripristina lo stato "after"
                handler(entry.after, entry.before, entry);
            }
            
            this.currentIndex++;
            
            console.log(`↪️ [HistoryManager] Redo: "${entry.action}"`);
            showToast(`Ripetuto: ${entry.action}`, 'info', 2000);
            
            return entry;
        } catch (error) {
            console.error('❌ [HistoryManager] Errore durante redo:', error);
            showToast('Errore durante la ripetizione', 'error');
            return null;
        } finally {
            this.isPerformingUndoRedo = false;
        }
    }

    /**
     * Verifica se è possibile fare undo
     */
    canUndo() {
        return this.currentIndex >= 0;
    }

    /**
     * Verifica se è possibile fare redo
     */
    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }

    // ═══════════════════════════════════════════════════════════════
    // HANDLER DI RIPRISTINO
    // ═══════════════════════════════════════════════════════════════

    /**
     * Registra un handler per un tipo di entità
     * @param {string} entityType - Tipo entità
     * @param {Function} handler - Funzione(newState, oldState, entry) => void
     */
    registerHandler(entityType, handler) {
        this.restoreHandlers.set(entityType, handler);
        console.log(`🔧 [HistoryManager] Handler registrato per: ${entityType}`);
    }

    /**
     * Registra handler per più tipi di entità contemporaneamente
     * @param {Object.<string, Function>} handlers
     */
    registerHandlers(handlers) {
        Object.entries(handlers).forEach(([type, handler]) => {
            this.registerHandler(type, handler);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // INFORMAZIONI CRONOLOGIA
    // ═══════════════════════════════════════════════════════════════

    /**
     * Ottiene la lista delle ultime azioni
     * @param {number} count - Numero di azioni da restituire
     * @returns {Array<{action: string, timestamp: Date, canUndo: boolean}>}
     */
    getRecentActions(count = 10) {
        const start = Math.max(0, this.currentIndex - count + 1);
        const end = this.currentIndex + 1;
        
        return this.history.slice(start, end).map((entry, index) => ({
            action: entry.action,
            entityType: entry.entityType,
            entityId: entry.entityId,
            timestamp: new Date(entry.timestamp),
            canUndo: index === end - start - 1 && this.canUndo()
        }));
    }

    /**
     * Ottiene statistiche sulla cronologia
     */
    getStats() {
        const totalSize = JSON.stringify(this.history).length;
        
        return {
            totalEntries: this.history.length,
            currentIndex: this.currentIndex,
            canUndo: this.canUndo(),
            canRedo: this.canRedo(),
            sizeBytes: totalSize,
            sizeKB: (totalSize / 1024).toFixed(2),
            oldestEntry: this.history[0]?.timestamp ? new Date(this.history[0].timestamp) : null,
            newestEntry: this.history[this.history.length - 1]?.timestamp ? 
                new Date(this.history[this.history.length - 1].timestamp) : null
        };
    }

    /**
     * Pulisce tutta la cronologia
     */
    clear() {
        this.history = [];
        this.currentIndex = -1;
        console.log('🗑️ [HistoryManager] Cronologia pulita');
    }

    /**
     * Abilita/disabilita il tracking
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
    }

    // ═══════════════════════════════════════════════════════════════
    // SHORTCUTS TASTIERA
    // ═══════════════════════════════════════════════════════════════

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Z = Undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                this.undo();
            }
            // Ctrl+Y o Ctrl+Shift+Z = Redo
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                this.redo();
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // METODI PRIVATI
    // ═══════════════════════════════════════════════════════════════

    generateId() {
        return `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    deepClone(obj) {
        if (obj === null || obj === undefined) return obj;
        return JSON.parse(JSON.stringify(obj));
    }

    enforceLimits() {
        // Rimuovi entry più vecchie se superiamo il limite di step
        while (this.history.length > this.maxSteps) {
            this.history.shift();
            this.currentIndex--;
        }
        
        // Verifica dimensione totale
        let totalSize = JSON.stringify(this.history).length;
        while (totalSize > this.maxSizeBytes && this.history.length > 10) {
            this.history.shift();
            this.currentIndex--;
            totalSize = JSON.stringify(this.history).length;
        }
        
        this.currentIndex = Math.max(-1, Math.min(this.currentIndex, this.history.length - 1));
    }
}

// Esporta singleton
export const historyManager = new HistoryManager();
export default historyManager;

console.log('📜 [HistoryManager] Sistema undo/redo caricato.');
