/**
 * toast.js
 * ─────────────────────────────────────────────────────────────
 * Sistema di notifiche toast avanzato.
 * 
 * Features:
 * - 4 tipi: success, error, warning, info
 * - Azioni con pulsanti (es. "Annulla")
 * - Progress bar per durata
 * - Coda per toast multiple
 * - Persistenza opzionale
 * - API fluente
 * 
 * @version 2.0.0
 */

import { escapeHtml } from './htmlHelpers.js';

// ═══════════════════════════════════════════════════════════════
// CONFIGURAZIONE
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
    defaultDuration: 3000,
    maxVisible: 5,
    position: 'top-right', // top-right, top-left, bottom-right, bottom-left, top-center
    animate: true
};

// Icone per tipo
const ICONS = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
};

// ═══════════════════════════════════════════════════════════════
// TOAST QUEUE MANAGER
// ═══════════════════════════════════════════════════════════════

class ToastManager {
    constructor() {
        this.queue = [];
        this.container = null;
        this.activeToasts = [];
        this.idCounter = 0;
    }
    
    getContainer() {
        if (!this.container) {
            this.container = document.getElementById('toast-container');
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.id = 'toast-container';
                this.container.className = `toast-container toast-${CONFIG.position}`;
                document.body.appendChild(this.container);
                this.injectStyles();
            }
        }
        return this.container;
    }
    
    injectStyles() {
        if (document.getElementById('toast-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
.toast-container {
    position: fixed;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    pointer-events: none;
}

.toast-top-right { top: 0; right: 0; }
.toast-top-left { top: 0; left: 0; }
.toast-bottom-right { bottom: 0; right: 0; }
.toast-bottom-left { bottom: 0; left: 0; }
.toast-top-center { top: 0; left: 50%; transform: translateX(-50%); }

.toast {
    min-width: 280px;
    max-width: 400px;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    background: var(--card-bg, #252525);
    border: 1px solid var(--border-color, #333);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    pointer-events: auto;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
}

.toast-show {
    opacity: 1;
    transform: translateX(0);
}

.toast-hide {
    opacity: 0;
    transform: translateX(100%);
}

.toast-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
}

.toast-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.toast-message {
    color: var(--text-primary, #fff);
    font-size: 0.9rem;
    font-family: 'Lora', serif;
}

.toast-description {
    color: var(--text-muted, #888);
    font-size: 0.8rem;
}

.toast-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.toast-btn {
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Lora', serif;
    transition: all 0.2s;
}

.toast-btn-primary {
    background: #0891b2;
    color: #fff;
}

.toast-btn-primary:hover {
    background: #0e7490;
}

.toast-btn-secondary {
    background: var(--bg-tertiary, #333);
    color: var(--text-primary, #fff);
    border: 1px solid var(--border-color, #444);
}

.toast-btn-secondary:hover {
    background: var(--hover-bg, #444);
}

.toast-close {
    background: none;
    border: none;
    color: var(--text-muted, #888);
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.toast-close:hover {
    opacity: 1;
    color: var(--text-primary, #fff);
}

.toast-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: currentColor;
    opacity: 0.5;
    border-radius: 0 0 8px 8px;
    transition: width linear;
}

.toast-success { border-left: 3px solid #22c55e; color: #22c55e; }
.toast-error { border-left: 3px solid #ef4444; color: #ef4444; }
.toast-warning { border-left: 3px solid #f59e0b; color: #f59e0b; }
.toast-info { border-left: 3px solid #3b82f6; color: #3b82f6; }

.toast-persistent {
    border-left-color: #8b5cf6;
}
        `;
        document.head.appendChild(style);
    }
    
    show(options) {
        const id = ++this.idCounter;
        const toast = this.createToast(id, options);
        
        this.getContainer().appendChild(toast);
        this.activeToasts.push({ id, element: toast, options });
        
        // Limita numero toast visibili
        while (this.activeToasts.length > CONFIG.maxVisible) {
            const oldest = this.activeToasts.shift();
            this.removeToast(oldest.element);
        }
        
        // Anima entrata
        requestAnimationFrame(() => {
            toast.classList.add('toast-show');
        });
        
        // Auto-dismiss se non persistente
        if (!options.persistent && options.duration > 0) {
            this.scheduleRemoval(id, toast, options.duration);
        }
        
        return id;
    }
    
    createToast(id, options) {
        const {
            message,
            description = '',
            type = 'info',
            duration = CONFIG.defaultDuration,
            actions = [],
            persistent = false,
            showProgress = true,
            onClose = null
        } = options;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}${persistent ? ' toast-persistent' : ''}`;
        toast.dataset.toastId = id;
        toast.style.position = 'relative';
        
        // Contenuto
        let content = `
            <span class="toast-icon">${ICONS[type] || ICONS.info}</span>
            <div class="toast-content">
                <span class="toast-message">${escapeHtml(message)}</span>
        `;
        
        if (description) {
            content += `<span class="toast-description">${escapeHtml(description)}</span>`;
        }
        
        // Azioni
        if (actions.length > 0) {
            content += '<div class="toast-actions">';
            actions.forEach((action, index) => {
                const btnClass = action.primary ? 'toast-btn-primary' : 'toast-btn-secondary';
                content += `<button class="toast-btn ${btnClass}" data-action-index="${index}">${escapeHtml(action.label)}</button>`;
            });
            content += '</div>';
        }
        
        content += '</div>';
        
        // Pulsante chiudi
        if (persistent || actions.length > 0) {
            content += '<button class="toast-close" title="Chiudi">✕</button>';
        }
        
        toast.innerHTML = content;
        
        // Progress bar
        if (showProgress && !persistent && duration > 0) {
            const progress = document.createElement('div');
            progress.className = 'toast-progress';
            progress.style.width = '100%';
            toast.appendChild(progress);
            
            // Anima progress
            requestAnimationFrame(() => {
                progress.style.transition = `width ${duration}ms linear`;
                progress.style.width = '0%';
            });
        }
        
        // Event handlers
        this.attachHandlers(toast, options, id);
        
        return toast;
    }
    
    attachHandlers(toast, options, id) {
        // Chiudi button
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.dismiss(id);
            });
        }
        
        // Action buttons
        const actionBtns = toast.querySelectorAll('.toast-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.actionIndex);
                const action = options.actions[index];
                
                if (action && action.callback) {
                    action.callback();
                }
                
                // Chiudi se l'azione lo richiede
                if (!action || action.closeOnClick !== false) {
                    this.dismiss(id);
                }
            });
        });
        
        // Salva callback onClose
        toast._onClose = options.onClose;
    }
    
    scheduleRemoval(id, toast, duration) {
        const timeoutId = setTimeout(() => {
            this.dismiss(id);
        }, duration);
        
        toast._timeoutId = timeoutId;
    }
    
    dismiss(id) {
        const index = this.activeToasts.findIndex(t => t.id === id);
        if (index === -1) return;
        
        const { element } = this.activeToasts[index];
        this.activeToasts.splice(index, 1);
        
        this.removeToast(element);
    }
    
    removeToast(toast) {
        // Anima uscita
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');
        
        // Chiama callback
        if (toast._onClose) {
            toast._onClose();
        }
        
        // Cancella timeout
        if (toast._timeoutId) {
            clearTimeout(toast._timeoutId);
        }
        
        // Rimuovi dal DOM
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
    
    dismissAll() {
        this.activeToasts.forEach(({ element }) => {
            this.removeToast(element);
        });
        this.activeToasts = [];
    }
}

// Singleton
const toastManager = new ToastManager();

// ═══════════════════════════════════════════════════════════════
// API PUBBLICA
// ═══════════════════════════════════════════════════════════════

/**
 * Mostra una notifica toast.
 * 
 * @param {string} message - Messaggio principale
 * @param {'success'|'error'|'warning'|'info'} type - Tipo di notifica
 * @param {number} duration - Durata in millisecondi
 * @param {Object} options - Opzioni aggiuntive
 * @param {string} options.description - Descrizione secondaria
 * @param {Array} options.actions - Azioni [{label, callback, primary, closeOnClick}]
 * @param {boolean} options.persistent - Non chiudere automaticamente
 * @returns {number} ID del toast
 * 
 * @example
 * // Toast semplice
 * showToast('Salvato!', 'success');
 * 
 * // Toast con azione
 * showToast('PG eliminato', 'warning', 5000, {
 *     description: 'Aragorn è stato rimosso',
 *     actions: [{
 *         label: 'Annulla',
 *         callback: () => restoreCharacter(id),
 *         primary: true
 *     }]
 * });
 */
export function showToast(message, type = 'info', duration = CONFIG.defaultDuration, options = {}) {
    // Supporto per vecchia API: showToast(message, type, duration)
    if (typeof options !== 'object' || options === null) {
        options = {};
    }
    
    return toastManager.show({
        message,
        type,
        duration,
        ...options
    });
}

/**
 * Toast di successo
 */
export function showSuccess(message, options = {}) {
    return showToast(message, 'success', options.duration || CONFIG.defaultDuration, options);
}

/**
 * Toast di errore
 */
export function showError(message, options = {}) {
    return showToast(message, 'error', options.duration || 5000, options);
}

/**
 * Toast di warning
 */
export function showWarning(message, options = {}) {
    return showToast(message, 'warning', options.duration || 4000, options);
}

/**
 * Toast informativo
 */
export function showInfo(message, options = {}) {
    return showToast(message, 'info', options.duration || CONFIG.defaultDuration, options);
}

/**
 * Toast con conferma (sì/no)
 * @returns {Promise<boolean>}
 */
export function showConfirm(message, options = {}) {
    return new Promise((resolve) => {
        showToast(message, 'warning', 0, {
            ...options,
            persistent: true,
            showProgress: false,
            actions: [
                {
                    label: options.confirmLabel || 'Conferma',
                    primary: true,
                    callback: () => resolve(true)
                },
                {
                    label: options.cancelLabel || 'Annulla',
                    callback: () => resolve(false)
                }
            ]
        });
    });
}

/**
 * Toast con azione "Annulla"
 * Utile per operazioni reversibili
 */
export function showWithUndo(message, undoCallback, options = {}) {
    return showToast(message, 'info', options.duration || 5000, {
        ...options,
        actions: [{
            label: 'Annulla',
            callback: undoCallback,
            primary: true
        }]
    });
}

/**
 * Chiude tutti i toast
 */
export function dismissAllToasts() {
    toastManager.dismissAll();
}

/**
 * Chiude un toast specifico
 */
export function dismissToast(id) {
    toastManager.dismiss(id);
}

/**
 * Configura il sistema toast
 */
export function configureToast(config) {
    Object.assign(CONFIG, config);
}

// Esporta il manager per uso avanzato
export { toastManager };

console.log('🔔 [toast] Sistema notifiche v2.0 caricato.');
