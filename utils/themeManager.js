/**
 * themeManager.js
 * ─────────────────────────────────────────────────────────────
 * Sistema di gestione temi (chiaro/scuro).
 * 
 * Features:
 * - Toggle tema chiaro/scuro
 * - Persistenza preferenze
 * - Rispetto preferenze sistema
 * - Transizioni fluide
 * - CSS custom properties
 * 
 * @version 1.0.0
 */

// ═══════════════════════════════════════════════════════════════
// CONFIGURAZIONE
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = 'dm-tool-theme';
const TRANSITION_DURATION = 300;

// Temi disponibili
export const THEMES = {
    dark: 'dark',
    light: 'light',
    system: 'system'
};

// ═══════════════════════════════════════════════════════════════
// VARIABILI CSS PER TEMI
// ═══════════════════════════════════════════════════════════════

const THEME_VARIABLES = {
    dark: {
        // Backgrounds
        '--bg-primary': '#0d0d0d',
        '--bg-secondary': '#1a1a1a',
        '--bg-tertiary': '#252525',
        '--card-bg': '#1a1a1a',
        '--hover-bg': '#333333',
        
        // Text
        '--text-primary': '#ffffff',
        '--text-secondary': '#cccccc',
        '--text-muted': '#888888',
        
        // Borders
        '--border-color': '#333333',
        '--border-light': '#444444',
        
        // Accent
        '--accent-color': '#0891b2',
        '--accent-hover': '#0e7490',
        
        // Status
        '--success-color': '#22c55e',
        '--error-color': '#ef4444',
        '--warning-color': '#f59e0b',
        '--info-color': '#3b82f6',
        
        // Shadows
        '--shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.3)',
        '--shadow-md': '0 4px 6px rgba(0, 0, 0, 0.4)',
        '--shadow-lg': '0 10px 15px rgba(0, 0, 0, 0.5)',
        
        // Input
        '--input-bg': '#252525',
        '--input-border': '#444444',
        '--input-focus': '#0891b2',
        
        // Scrollbar
        '--scrollbar-bg': '#1a1a1a',
        '--scrollbar-thumb': '#444444',
        
        // Tooltip
        '--tooltip-bg': '#333333',
        
        // Misc
        '--overlay-bg': 'rgba(0, 0, 0, 0.85)',
        '--dropdown-bg': '#1a1a1a'
    },
    
    light: {
        // Backgrounds
        '--bg-primary': '#ffffff',
        '--bg-secondary': '#f5f5f5',
        '--bg-tertiary': '#e5e5e5',
        '--card-bg': '#ffffff',
        '--hover-bg': '#e0e0e0',
        
        // Text
        '--text-primary': '#1a1a1a',
        '--text-secondary': '#333333',
        '--text-muted': '#666666',
        
        // Borders
        '--border-color': '#dddddd',
        '--border-light': '#eeeeee',
        
        // Accent
        '--accent-color': '#0891b2',
        '--accent-hover': '#0e7490',
        
        // Status
        '--success-color': '#16a34a',
        '--error-color': '#dc2626',
        '--warning-color': '#d97706',
        '--info-color': '#2563eb',
        
        // Shadows
        '--shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.1)',
        '--shadow-md': '0 4px 6px rgba(0, 0, 0, 0.15)',
        '--shadow-lg': '0 10px 15px rgba(0, 0, 0, 0.2)',
        
        // Input
        '--input-bg': '#ffffff',
        '--input-border': '#cccccc',
        '--input-focus': '#0891b2',
        
        // Scrollbar
        '--scrollbar-bg': '#f5f5f5',
        '--scrollbar-thumb': '#cccccc',
        
        // Tooltip
        '--tooltip-bg': '#333333',
        
        // Misc
        '--overlay-bg': 'rgba(0, 0, 0, 0.5)',
        '--dropdown-bg': '#ffffff'
    }
};

// ═══════════════════════════════════════════════════════════════
// THEME MANAGER CLASS
// ═══════════════════════════════════════════════════════════════

class ThemeManager {
    constructor() {
        this.currentTheme = THEMES.dark;
        this.resolvedTheme = THEMES.dark;
        this.listeners = new Set();
        this.transitioning = false;
        
        this.init();
    }
    
    /**
     * Inizializza il gestore temi
     */
    init() {
        // Carica tema salvato
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        
        if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
            this.currentTheme = savedTheme;
        } else {
            // Default: sistema
            this.currentTheme = THEMES.dark; // DM-Tool default è dark
        }
        
        // Risolvi tema effettivo
        this.resolveTheme();
        
        // Applica tema
        this.applyTheme(this.resolvedTheme, false);
        
        // Listener per preferenze sistema
        this.watchSystemPreference();
        
        // Inietta stili transizione
        this.injectTransitionStyles();
        
        console.log(`🎨 [ThemeManager] Inizializzato: ${this.currentTheme} (risolto: ${this.resolvedTheme})`);
    }
    
    /**
     * Risolve il tema effettivo
     */
    resolveTheme() {
        if (this.currentTheme === THEMES.system) {
            this.resolvedTheme = this.getSystemPreference();
        } else {
            this.resolvedTheme = this.currentTheme;
        }
    }
    
    /**
     * Ottiene preferenza sistema
     */
    getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return THEMES.light;
        }
        return THEMES.dark;
    }
    
    /**
     * Ascolta cambiamenti preferenze sistema
     */
    watchSystemPreference() {
        if (!window.matchMedia) return;
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            if (this.currentTheme === THEMES.system) {
                this.resolveTheme();
                this.applyTheme(this.resolvedTheme, true);
                this.notifyListeners();
            }
        });
    }
    
    /**
     * Applica il tema
     */
    applyTheme(theme, animate = true) {
        const variables = THEME_VARIABLES[theme];
        if (!variables) return;
        
        const root = document.documentElement;
        
        // Abilita transizioni
        if (animate) {
            this.transitioning = true;
            root.style.setProperty('--theme-transition', `all ${TRANSITION_DURATION}ms ease`);
        }
        
        // Applica variabili
        for (const [key, value] of Object.entries(variables)) {
            root.style.setProperty(key, value);
        }
        
        // Data attribute per CSS
        root.setAttribute('data-theme', theme);
        
        // Meta theme-color per mobile
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = theme === THEMES.light ? '#ffffff' : '#0d0d0d';
        }
        
        // Rimuovi transizioni dopo animazione
        if (animate) {
            setTimeout(() => {
                this.transitioning = false;
                root.style.removeProperty('--theme-transition');
            }, TRANSITION_DURATION);
        }
    }
    
    /**
     * Imposta il tema
     */
    setTheme(theme) {
        if (!Object.values(THEMES).includes(theme)) {
            console.error('❌ [ThemeManager] Tema non valido:', theme);
            return;
        }
        
        const previousTheme = this.resolvedTheme;
        this.currentTheme = theme;
        this.resolveTheme();
        
        // Salva preferenza
        localStorage.setItem(STORAGE_KEY, theme);
        
        // Applica se cambiato
        if (this.resolvedTheme !== previousTheme) {
            this.applyTheme(this.resolvedTheme, true);
        }
        
        this.notifyListeners();
        
        console.log(`🎨 [ThemeManager] Tema cambiato: ${theme} (risolto: ${this.resolvedTheme})`);
    }
    
    /**
     * Toggle tema
     */
    toggle() {
        const newTheme = this.resolvedTheme === THEMES.dark ? THEMES.light : THEMES.dark;
        this.setTheme(newTheme);
    }
    
    /**
     * Ottiene il tema corrente
     */
    getTheme() {
        return this.currentTheme;
    }
    
    /**
     * Ottiene il tema risolto
     */
    getResolvedTheme() {
        return this.resolvedTheme;
    }
    
    /**
     * Verifica se tema scuro
     */
    isDark() {
        return this.resolvedTheme === THEMES.dark;
    }
    
    /**
     * Registra listener per cambiamenti
     */
    onChange(callback) {
        this.listeners.add(callback);
        
        // Ritorna funzione per rimuovere listener
        return () => this.listeners.delete(callback);
    }
    
    /**
     * Notifica listeners
     */
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.currentTheme, this.resolvedTheme);
            } catch (e) {
                console.error('❌ [ThemeManager] Errore listener:', e);
            }
        });
    }
    
    /**
     * Inietta stili per transizioni
     */
    injectTransitionStyles() {
        if (document.getElementById('theme-transition-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'theme-transition-styles';
        style.textContent = `
:root {
    --theme-transition: none;
}

[data-theme] * {
    transition: var(--theme-transition, none);
}

/* Scrollbar styling */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: var(--scrollbar-bg);
}

::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted);
}

/* Focus styles */
:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
}

/* Selection */
::selection {
    background: var(--accent-color);
    color: white;
}
        `;
        document.head.appendChild(style);
    }
}

// ═══════════════════════════════════════════════════════════════
// TOGGLE BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════

/**
 * Crea un pulsante per toggle tema
 * @param {Object} options - Opzioni
 * @returns {HTMLButtonElement}
 */
export function createThemeToggle(options = {}) {
    const {
        showLabel = false,
        size = 'medium',
        position = 'default'
    } = options;
    
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Cambia tema');
    button.setAttribute('title', 'Cambia tema (chiaro/scuro)');
    
    // Stili
    const sizes = {
        small: { width: '28px', height: '28px', fontSize: '14px' },
        medium: { width: '36px', height: '36px', fontSize: '18px' },
        large: { width: '44px', height: '44px', fontSize: '22px' }
    };
    
    const sizeStyle = sizes[size] || sizes.medium;
    
    button.style.cssText = `
        background: var(--bg-tertiary);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-primary);
        transition: all 0.2s ease;
        width: ${sizeStyle.width};
        height: ${sizeStyle.height};
        font-size: ${sizeStyle.fontSize};
    `;
    
    // Icona iniziale
    updateToggleButtonIcon(button);
    
    // Event
    button.addEventListener('click', () => {
        themeManager.toggle();
    });
    
    // Aggiorna icona su cambio tema
    themeManager.onChange(() => {
        updateToggleButtonIcon(button);
    });
    
    // Hover effect
    button.addEventListener('mouseenter', () => {
        button.style.background = 'var(--hover-bg)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.background = 'var(--bg-tertiary)';
    });
    
    return button;
}

/**
 * Aggiorna l'icona del pulsante
 */
function updateToggleButtonIcon(button) {
    const isDark = themeManager.isDark();
    button.innerHTML = isDark ? '☀️' : '🌙';
    button.setAttribute('aria-label', isDark ? 'Passa al tema chiaro' : 'Passa al tema scuro');
}

// ═══════════════════════════════════════════════════════════════
// SINGLETON E API PUBBLICA
// ═══════════════════════════════════════════════════════════════

const themeManager = new ThemeManager();

export { themeManager };

export function setTheme(theme) {
    themeManager.setTheme(theme);
}

export function toggleTheme() {
    themeManager.toggle();
}

export function getTheme() {
    return themeManager.getTheme();
}

export function isDarkTheme() {
    return themeManager.isDark();
}

export function onThemeChange(callback) {
    return themeManager.onChange(callback);
}

export default themeManager;

console.log('🎨 [ThemeManager] Sistema temi caricato.');
