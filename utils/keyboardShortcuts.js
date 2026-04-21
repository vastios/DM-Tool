/**
 * keyboardShortcuts.js
 * ─────────────────────────────────────────────────────────────
 * Sistema di scorciatoie tastiera globali.
 * 
 * Features:
 * - Registrazione shortcuts con combinazioni
 * - Scope contestuali (global, modal, combat)
 * - Help overlay con lista shortcuts
 * - Conflicti detection
 * - Mac/Windows key normalization
 * 
 * @version 1.0.0
 */

// ═══════════════════════════════════════════════════════════════
// CONFIGURAZIONE
// ═══════════════════════════════════════════════════════════════

const CONFIG = {
    helpKey: '?',           // Tasto per mostrare help
    helpModifiers: ['shift'], // Modificatori per help
    preventDefault: true,
    ignoreInputFields: true,
    debug: false
};

// Normalizzazione tasti speciali
const KEY_ALIASES = {
    'ctrl': 'ctrl',
    'control': 'ctrl',
    'cmd': 'meta',
    'command': 'meta',
    'meta': 'meta',
    'shift': 'shift',
    'alt': 'alt',
    'option': 'alt',
    'enter': 'enter',
    'return': 'enter',
    'esc': 'escape',
    'escape': 'escape',
    'space': ' ',
    'spacebar': ' ',
    'up': 'arrowup',
    'down': 'arrowdown',
    'left': 'arrowleft',
    'right': 'arrowright',
    'del': 'delete',
    'backspace': 'backspace'
};

// ═══════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS MANAGER
// ═══════════════════════════════════════════════════════════════

class KeyboardShortcutsManager {
    constructor() {
        this.shortcuts = new Map();
        this.scopes = new Map();
        this.activeScope = 'global';
        this.enabled = true;
        this.helpOverlay = null;
        
        this.init();
    }
    
    /**
     * Inizializza il gestore
     */
    init() {
        // Listener globale
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Scope predefiniti
        this.createScope('global');
        this.createScope('modal', { priority: 100 });
        this.createScope('combat', { priority: 50 });
        this.createScope('editor', { priority: 75 });
        
        // Shortcut help di default
        this.register({
            id: 'show-help',
            key: CONFIG.helpKey,
            modifiers: CONFIG.helpModifiers,
            description: 'Mostra scorciatoie tastiera',
            action: () => this.toggleHelp(),
            scope: 'global'
        });
        
        console.log('⌨️ [KeyboardShortcuts] Manager inizializzato');
    }
    
    /**
     * Gestisce l'evento keydown
     */
    handleKeyDown(e) {
        if (!this.enabled) return;
        
        // Ignora se in campo input (se configurato)
        if (CONFIG.ignoreInputFields && this.isInputFocused()) {
            // Permetti solo Escape
            if (e.key !== 'Escape') return;
        }
        
        // Costruisci combinazione
        const combo = this.buildCombo(e);
        
        if (CONFIG.debug) {
            console.log('⌨️ [KeyboardShortcuts]', combo);
        }
        
        // Cerca shortcut
        const shortcut = this.findShortcut(combo);
        
        if (shortcut) {
            if (CONFIG.preventDefault) {
                e.preventDefault();
            }
            
            shortcut.action(e);
            
            if (CONFIG.debug) {
                console.log(`✅ [KeyboardShortcuts] Eseguito: ${shortcut.id}`);
            }
        }
    }
    
    /**
     * Costruisce la stringa combinazione
     */
    buildCombo(e) {
        const parts = [];
        
        if (e.ctrlKey) parts.push('ctrl');
        if (e.metaKey) parts.push('meta');
        if (e.altKey) parts.push('alt');
        if (e.shiftKey) parts.push('shift');
        
        // Normalizza il tasto
        let key = e.key.toLowerCase();
        key = KEY_ALIASES[key] || key;
        
        // Non aggiungere modificatori come tasti
        if (!['ctrl', 'meta', 'alt', 'shift'].includes(key)) {
            parts.push(key);
        }
        
        return parts.join('+');
    }
    
    /**
     * Trova lo shortcut per la combinazione
     */
    findShortcut(combo) {
        // Prima cerca nello scope attivo
        const scopeShortcuts = this.scopes.get(this.activeScope);
        if (scopeShortcuts) {
            for (const [id, shortcut] of this.shortcuts) {
                if (shortcut.combo === combo && 
                    (shortcut.scope === this.activeScope || shortcut.scope === 'global')) {
                    return shortcut;
                }
            }
        }
        
        // Poi cerca in globale
        for (const [id, shortcut] of this.shortcuts) {
            if (shortcut.combo === combo && shortcut.scope === 'global') {
                return shortcut;
            }
        }
        
        return null;
    }
    
    /**
     * Verifica se un campo input è focalizzato
     */
    isInputFocused() {
        const active = document.activeElement;
        const inputTypes = ['INPUT', 'TEXTAREA', 'SELECT'];
        
        if (inputTypes.includes(active.tagName)) {
            return true;
        }
        
        if (active.isContentEditable) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Registra un nuovo shortcut
     * @param {Object} options - Opzioni shortcut
     */
    register(options) {
        const {
            id,
            key,
            modifiers = [],
            description = '',
            action,
            scope = 'global',
            allowInInput = false
        } = options;
        
        if (!id || !key || !action) {
            console.error('❌ [KeyboardShortcuts] Shortcut non valido:', options);
            return false;
        }
        
        // Normalizza
        const normalizedKey = KEY_ALIASES[key.toLowerCase()] || key.toLowerCase();
        const normalizedModifiers = modifiers.map(m => KEY_ALIASES[m.toLowerCase()] || m.toLowerCase());
        
        // Costruisci combo
        const combo = [...normalizedModifiers.sort(), normalizedKey].join('+');
        
        // Verifica conflitti
        if (this.shortcuts.has(id)) {
            console.warn(`⚠️ [KeyboardShortcuts] Shortcut "${id}" già registrato, sovrascritto`);
        }
        
        const shortcut = {
            id,
            key: normalizedKey,
            modifiers: normalizedModifiers,
            combo,
            description,
            action,
            scope,
            allowInInput
        };
        
        this.shortcuts.set(id, shortcut);
        
        if (CONFIG.debug) {
            console.log(`⌨️ [KeyboardShortcuts] Registrato: ${id} → ${combo}`);
        }
        
        return true;
    }
    
    /**
     * Deregistra uno shortcut
     */
    unregister(id) {
        return this.shortcuts.delete(id);
    }
    
    /**
     * Crea un nuovo scope
     */
    createScope(name, options = {}) {
        this.scopes.set(name, {
            name,
            priority: options.priority || 0,
            ...options
        });
    }
    
    /**
     * Imposta lo scope attivo
     */
    setScope(scope) {
        if (this.scopes.has(scope)) {
            this.activeScope = scope;
            if (CONFIG.debug) {
                console.log(`⌨️ [KeyboardShortcuts] Scope attivo: ${scope}`);
            }
        }
    }
    
    /**
     * Resetta allo scope globale
     */
    resetScope() {
        this.activeScope = 'global';
    }
    
    /**
     * Abilita/disabilita shortcuts
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    
    /**
     * Toggle help overlay
     */
    toggleHelp() {
        if (this.helpOverlay) {
            this.hideHelp();
        } else {
            this.showHelp();
        }
    }
    
    /**
     * Mostra help overlay
     */
    showHelp() {
        if (this.helpOverlay) return;
        
        const overlay = document.createElement('div');
        overlay.id = 'keyboard-shortcuts-help';
        overlay.innerHTML = this.buildHelpContent();
        
        // Stili inline
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        `;
        
        // Click per chiudere
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hideHelp();
            }
        });
        
        // Escape per chiudere
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.hideHelp();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        document.body.appendChild(overlay);
        this.helpOverlay = overlay;
    }
    
    /**
     * Nasconde help overlay
     */
    hideHelp() {
        if (this.helpOverlay) {
            this.helpOverlay.remove();
            this.helpOverlay = null;
        }
    }
    
    /**
     * Costruisce il contenuto dell'help
     */
    buildHelpContent() {
        const groups = {};
        
        // Raggruppa per scope
        for (const [id, shortcut] of this.shortcuts) {
            const scope = shortcut.scope || 'global';
            if (!groups[scope]) {
                groups[scope] = [];
            }
            groups[scope].push(shortcut);
        }
        
        let html = `
            <div style="
                background: var(--card-bg, #1a1a1a);
                border: 1px solid var(--border-color, #333);
                border-radius: 12px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                padding: 1.5rem;
                font-family: 'Lora', serif;
            ">
                <h2 style="
                    margin: 0 0 1rem 0;
                    color: var(--text-primary, #fff);
                    font-size: 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                ">⌨️ Scorciatoie Tastiera</h2>
        `;
        
        for (const [scope, shortcuts] of Object.entries(groups)) {
            html += `
                <div style="margin-bottom: 1rem;">
                    <h3 style="
                        color: var(--accent-color, #0891b2);
                        font-size: 0.9rem;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        margin: 0 0 0.5rem 0;
                    ">${scope}</h3>
            `;
            
            for (const shortcut of shortcuts) {
                if (!shortcut.description) continue;
                
                html += `
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0.35rem 0;
                        border-bottom: 1px solid var(--border-color, #222);
                    ">
                        <span style="color: var(--text-muted, #888); font-size: 0.85rem;">
                            ${shortcut.description}
                        </span>
                        <kbd style="
                            background: var(--bg-tertiary, #333);
                            color: var(--text-primary, #fff);
                            padding: 0.2rem 0.5rem;
                            border-radius: 4px;
                            font-size: 0.75rem;
                            font-family: monospace;
                        ">${shortcut.combo}</kbd>
                    </div>
                `;
            }
            
            html += '</div>';
        }
        
        html += `
                <p style="
                    color: var(--text-muted, #666);
                    font-size: 0.75rem;
                    text-align: center;
                    margin: 1rem 0 0 0;
                ">Premi <kbd style="
                    background: var(--bg-tertiary, #333);
                    padding: 0.1rem 0.3rem;
                    border-radius: 3px;
                ">Shift+?</kbd> o <kbd style="
                    background: var(--bg-tertiary, #333);
                    padding: 0.1rem 0.3rem;
                    border-radius: 3px;
                ">Esc</kbd> per chiudere</p>
            </div>
        `;
        
        return html;
    }
    
    /**
     * Ottiene tutti gli shortcuts
     */
    getAll() {
        return Array.from(this.shortcuts.values());
    }
    
    /**
     * Ottiene shortcuts per scope
     */
    getByScope(scope) {
        return this.getAll().filter(s => s.scope === scope);
    }
}

// ═══════════════════════════════════════════════════════════════
// SHORTCUTS PREDEFINITI DM-TOOL
// ═══════════════════════════════════════════════════════════════

/**
 * Registra shortcuts predefiniti per DM-Tool
 * @param {Object} callbacks - Callback per le azioni
 */
export function registerDefaultShortcuts(callbacks = {}) {
    const {
        onSave,
        onUndo,
        onRedo,
        onSearch,
        onToggleSidebar,
        onNewCombat,
        onNextTurn,
        onRollDice,
        onNewNPC,
        onNewLocation
    } = callbacks;
    
    // Salvataggio
    if (onSave) {
        keyboardManager.register({
            id: 'save',
            key: 's',
            modifiers: ['ctrl'],
            description: 'Salva',
            action: onSave
        });
    }
    
    // Undo/Redo
    if (onUndo) {
        keyboardManager.register({
            id: 'undo',
            key: 'z',
            modifiers: ['ctrl'],
            description: 'Annulla',
            action: onUndo
        });
    }
    
    if (onRedo) {
        keyboardManager.register({
            id: 'redo',
            key: 'y',
            modifiers: ['ctrl'],
            description: 'Ripeti',
            action: onRedo
        });
    }
    
    // Ricerca
    if (onSearch) {
        keyboardManager.register({
            id: 'search',
            key: 'k',
            modifiers: ['ctrl'],
            description: 'Cerca',
            action: onSearch
        });
    }
    
    // Sidebar
    if (onToggleSidebar) {
        keyboardManager.register({
            id: 'toggle-sidebar',
            key: 'b',
            modifiers: ['ctrl'],
            description: 'Toggle sidebar',
            action: onToggleSidebar
        });
    }
    
    // Combattimento
    if (onNextTurn) {
        keyboardManager.register({
            id: 'next-turn',
            key: 'n',
            description: 'Prossimo turno (combat)',
            action: onNextTurn,
            scope: 'combat'
        });
    }
    
    if (onNewCombat) {
        keyboardManager.register({
            id: 'new-combat',
            key: 'c',
            modifiers: ['ctrl', 'shift'],
            description: 'Nuovo combattimento',
            action: onNewCombat
        });
    }
    
    // Dadi
    if (onRollDice) {
        keyboardManager.register({
            id: 'roll-dice',
            key: 'r',
            description: 'Lancia dadi',
            action: onRollDice
        });
    }
    
    // Entità
    if (onNewNPC) {
        keyboardManager.register({
            id: 'new-npc',
            key: 'n',
            modifiers: ['ctrl'],
            description: 'Nuovo NPC',
            action: onNewNPC
        });
    }
    
    if (onNewLocation) {
        keyboardManager.register({
            id: 'new-location',
            key: 'l',
            modifiers: ['ctrl'],
            description: 'Nuovo luogo',
            action: onNewLocation
        });
    }
    
    console.log('⌨️ [KeyboardShortcuts] Shortcuts predefiniti registrati');
}

// ═══════════════════════════════════════════════════════════════
// SINGLETON E API PUBBLICA
// ═══════════════════════════════════════════════════════════════

const keyboardManager = new KeyboardShortcutsManager();

export { keyboardManager };

export function registerShortcut(options) {
    return keyboardManager.register(options);
}

export function unregisterShortcut(id) {
    return keyboardManager.unregister(id);
}

export function setKeyboardScope(scope) {
    keyboardManager.setScope(scope);
}

export function resetKeyboardScope() {
    keyboardManager.resetScope();
}

export function showShortcutsHelp() {
    keyboardManager.showHelp();
}

export function hideShortcutsHelp() {
    keyboardManager.hideHelp();
}

export default keyboardManager;

console.log('⌨️ [KeyboardShortcuts] Sistema scorciatoie caricato.');
