/**
 * BaseModule.js
 * ─────────────────────────────────────────────────────────────
 * Classe base per tutti i moduli dell'applicazione.
 * Fornisce:
 * - Gestione automatica del ciclo di vita
 * - Cleanup degli event listeners
 * - Metodi helper standardizzati
 * - Tracciamento delle risorse
 * 
 * @version 1.0.0
 * 
 * UTILIZZO:
 * class MyModule extends BaseModule {
 *     constructor(container, data) {
 *         super(container, data);
 *         this.myProperty = data.something;
 *     }
 *     
 *     render() {
 *         this.container.innerHTML = `<button id="my-btn">Click</button>`;
 *         this.addClickHandler('#my-btn', this.handleClick.bind(this));
 *     }
 *     
 *     handleClick(e) {
 *         console.log('Clicked!');
 *     }
 * }
 */

import { showToast } from './toast.js';

/**
 * Classe base astratta per i moduli
 */
export class BaseModule {
    /**
     * @param {HTMLElement} container - Il contenitore DOM del modulo
     * @param {Object} data - Dati passati al modulo
     */
    constructor(container, data = {}) {
        this.container = container;
        this.data = data;
        this.isDestroyed = false;
        this.isRendered = false;
        
        /** @type {Array<{element: EventTarget, event: string, handler: Function, options?: Object}>} */
        this._eventListeners = [];
        
        /** @type {Array<HTMLElement>} */
        this._dynamicElements = [];
        
        /** @type {Array<number>} */
        this._timeouts = [];
        
        /** @type {Array<number>} */
        this._intervals = [];
        
        /** @type {Map<string, any>} */
        this._state = new Map();
        
        // Binding automatico dei metodi comuni
        this._bindMethods();
    }
    
    // ═══════════════════════════════════════════════════════════════
    // METODI ASTRATTI (da implementare nelle sottoclassi)
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Metodo principale di rendering. DEVE essere implementato.
     * @abstract
     */
    render() {
        throw new Error(`${this.constructor.name} deve implementare il metodo render()`);
    }
    
    // ═══════════════════════════════════════════════════════════════
    // GESTIONE EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Aggiunge un event listener tracciato (verrà rimosso automaticamente)
     * @param {EventTarget} element - Elemento o selettore CSS
     * @param {string} event - Nome dell'evento
     * @param {Function} handler - Handler dell'evento
     * @param {Object} options - Opzioni addEventListener
     * @returns {Function} Handler (per rimozione manuale)
     */
    addTrackedListener(element, event, handler, options = {}) {
        // Supporta selettori CSS
        if (typeof element === 'string') {
            element = this.container.querySelector(element);
        }
        
        if (!element) {
            console.warn(`⚠️ [${this.constructor.name}] Elemento non trovato per evento ${event}`);
            return handler;
        }
        
        element.addEventListener(event, handler, options);
        
        this._eventListeners.push({
            element,
            event,
            handler,
            options
        });
        
        return handler;
    }
    
    /**
     * Shortcut per click handler
     * @param {string|HTMLElement} selector - Selettore o elemento
     * @param {Function} handler - Handler
     */
    addClickHandler(selector, handler) {
        return this.addTrackedListener(selector, 'click', handler);
    }
    
    /**
     * Shortcut per input/change handler
     * @param {string|HTMLElement} selector - Selettore o elemento
     * @param {Function} handler - Handler
     * @param {string} event - Tipo evento (default: 'input')
     */
    addInputHandler(selector, handler, event = 'input') {
        return this.addTrackedListener(selector, event, handler);
    }
    
    /**
     * Shortcut per keyboard handler
     * @param {string|HTMLElement} selector - Selettore o elemento
     * @param {Function} handler - Handler
     */
    addKeyHandler(selector, handler) {
        return this.addTrackedListener(selector, 'keydown', handler);
    }
    
    /**
     * Aggiunge event listener delegato (per elementi dinamici)
     * @param {string} selector - Selettore CSS per delega
     * @param {string} event - Nome evento
     * @param {Function} handler - Handler
     */
    addDelegatedHandler(selector, event, handler) {
        const delegatedHandler = (e) => {
            const target = e.target.closest(selector);
            if (target && this.container.contains(target)) {
                handler.call(target, e, target);
            }
        };
        
        return this.addTrackedListener(this.container, event, delegatedHandler);
    }
    
    // ═══════════════════════════════════════════════════════════════
    // GESTIONE TIMERS
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * setTimeout tracciato (verrà cancellato automaticamente)
     * @param {Function} callback - Callback
     * @param {number} delay - Ritardo in ms
     * @returns {number} ID del timeout
     */
    setTimeout(callback, delay) {
        const id = setTimeout(() => {
            this._timeouts = this._timeouts.filter(t => t !== id);
            if (!this.isDestroyed) {
                callback();
            }
        }, delay);
        
        this._timeouts.push(id);
        return id;
    }
    
    /**
     * setInterval tracciato (verrà cancellato automaticamente)
     * @param {Function} callback - Callback
     * @param {number} interval - Intervallo in ms
     * @returns {number} ID dell'intervallo
     */
    setInterval(callback, interval) {
        const id = setInterval(() => {
            if (!this.isDestroyed) {
                callback();
            }
        }, interval);
        
        this._intervals.push(id);
        return id;
    }
    
    /**
     * Cancella un timeout specifico
     * @param {number} id - ID del timeout
     */
    clearTimeout(id) {
        clearTimeout(id);
        this._timeouts = this._timeouts.filter(t => t !== id);
    }
    
    /**
     * Cancella un interval specifico
     * @param {number} id - ID dell'interval
     */
    clearInterval(id) {
        clearInterval(id);
        this._intervals = this._intervals.filter(i => i !== id);
    }
    
    // ═══════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Imposta un valore nello stato interno
     * @param {string} key - Chiave
     * @param {any} value - Valore
     */
    setState(key, value) {
        this._state.set(key, value);
    }
    
    /**
     * Ottiene un valore dallo stato interno
     * @param {string} key - Chiave
     * @param {any} defaultValue - Valore di default
     * @returns {any}
     */
    getState(key, defaultValue = null) {
        return this._state.has(key) ? this._state.get(key) : defaultValue;
    }
    
    // ═══════════════════════════════════════════════════════════════
    // HELPER DOM
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Query shorthand nel container
     * @param {string} selector - Selettore CSS
     * @returns {HTMLElement|null}
     */
    $(selector) {
        return this.container.querySelector(selector);
    }
    
    /**
     * QueryAll shorthand nel container
     * @param {string} selector - Selettore CSS
     * @returns {NodeList}
     */
    $$(selector) {
        return this.container.querySelectorAll(selector);
    }
    
    /**
     * Crea un elemento con attributi
     * @param {string} tag - Tag HTML
     * @param {Object} attrs - Attributi
     * @param {string|HTMLElement} content - Contenuto
     * @returns {HTMLElement}
     */
    createElement(tag, attrs = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key.startsWith('on') && typeof value === 'function') {
                element.addEventListener(key.substring(2).toLowerCase(), value);
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([k, v]) => {
                    element.dataset[k] = v;
                });
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (typeof content === 'string') {
            element.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            element.appendChild(content);
        }
        
        this._dynamicElements.push(element);
        return element;
    }
    
    /**
     * Mostra un elemento
     * @param {string|HTMLElement} selector - Selettore o elemento
     */
    show(selector) {
        const el = typeof selector === 'string' ? this.$(selector) : selector;
        if (el) el.classList.remove('hidden');
    }
    
    /**
     * Nasconde un elemento
     * @param {string|HTMLElement} selector - Selettore o elemento
     */
    hide(selector) {
        const el = typeof selector === 'string' ? this.$(selector) : selector;
        if (el) el.classList.add('hidden');
    }
    
    /**
     * Toggle visibilità
     * @param {string|HTMLElement} selector - Selettore o elemento
     */
    toggle(selector) {
        const el = typeof selector === 'string' ? this.$(selector) : selector;
        if (el) el.classList.toggle('hidden');
    }
    
    // ═══════════════════════════════════════════════════════════════
    // NOTIFICHE
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Mostra toast di successo
     * @param {string} message - Messaggio
     * @param {number} duration - Durata in ms
     */
    showSuccess(message, duration = 3000) {
        showToast(message, 'success', duration);
    }
    
    /**
     * Mostra toast di errore
     * @param {string} message - Messaggio
     * @param {number} duration - Durata in ms
     */
    showError(message, duration = 4000) {
        showToast(message, 'error', duration);
    }
    
    /**
     * Mostra toast di warning
     * @param {string} message - Messaggio
     * @param {number} duration - Durata in ms
     */
    showWarning(message, duration = 3500) {
        showToast(message, 'warning', duration);
    }
    
    /**
     * Mostra toast informativo
     * @param {string} message - Messaggio
     * @param {number} duration - Durata in ms
     */
    showInfo(message, duration = 3000) {
        showToast(message, 'info', duration);
    }
    
    // ═══════════════════════════════════════════════════════════════
    // CICLO DI VITA
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Pulisce tutte le risorse del modulo
     * Chiamato automaticamente quando il modulo viene distrutto
     */
    destroy() {
        if (this.isDestroyed) {
            console.warn(`⚠️ [${this.constructor.name}] Modulo già distrutto`);
            return;
        }
        
        this.isDestroyed = true;
        
        // Rimuovi tutti gli event listeners
        this._eventListeners.forEach(({ element, event, handler, options }) => {
            try {
                element.removeEventListener(event, handler, options);
            } catch (e) {
                // Ignora errori
            }
        });
        this._eventListeners = [];
        
        // Cancella tutti i timeout
        this._timeouts.forEach(id => clearTimeout(id));
        this._timeouts = [];
        
        // Cancella tutti gli interval
        this._intervals.forEach(id => clearInterval(id));
        this._intervals = [];
        
        // Rimuovi elementi dinamici
        this._dynamicElements.forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        this._dynamicElements = [];
        
        // Pulisci stato
        this._state.clear();
        
        // Callback personalizzata
        if (typeof this.onDestroy === 'function') {
            this.onDestroy();
        }
        
        console.log(`🧹 [${this.constructor.name}] Modulo distrutto`);
    }
    
    // ═══════════════════════════════════════════════════════════════
    // METODI PRIVATI
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Binding automatico dei metodi comuni
     * @private
     */
    _bindMethods() {
        // Metodi che tipicamente necessitano di binding
        const methodsToBind = [
            'handleClick',
            'handleChange',
            'handleInput',
            'handleKeydown',
            'handleSubmit',
            'handleScroll',
            'handleResize'
        ];
        
        methodsToBind.forEach(method => {
            if (typeof this[method] === 'function') {
                this[method] = this[method].bind(this);
            }
        });
    }
}

export default BaseModule;
