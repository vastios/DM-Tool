/**
 * accessibility.js
 * ─────────────────────────────────────────────────────────────
 * Utility per accessibilità (a11y).
 * 
 * Features:
 * - Focus trap per modali
 * - Focus management
 * - ARIA helpers
 * - Announce per screen reader
 * - Skip links
 * - Keyboard navigation
 * 
 * @version 1.0.0
 */

// ═══════════════════════════════════════════════════════════════
// FOCUS TRAP
// ═══════════════════════════════════════════════════════════════

/**
 * Crea un focus trap per modali/dialog
 * @param {HTMLElement} container - Elemento contenitore
 * @param {Object} options - Opzioni
 * @returns {Object} Controller focus trap
 */
export function createFocusTrap(container, options = {}) {
    const {
        initialFocus = null,
        escapeDeactivates = true,
        onActivate = null,
        onDeactivate = null,
        returnFocus = true
    } = options;
    
    let active = false;
    let lastFocusedElement = null;
    
    // Selettori per elementi focalizzabili
    const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    /**
     * Ottiene elementi focalizzabili
     */
    function getFocusableElements() {
        return Array.from(container.querySelectorAll(focusableSelectors))
            .filter(el => el.offsetParent !== null); // Visibili
    }
    
    /**
     * Attiva il focus trap
     */
    function activate() {
        if (active) return;
        
        active = true;
        lastFocusedElement = document.activeElement;
        
        // Event listeners
        document.addEventListener('keydown', handleKeyDown);
        
        // Focus iniziale
        if (initialFocus) {
            initialFocus.focus();
        } else {
            const focusable = getFocusableElements();
            if (focusable.length > 0) {
                focusable[0].focus();
            }
        }
        
        // Callback
        if (onActivate) onActivate();
        
        // Marca il container
        container.setAttribute('data-focus-trap', 'active');
    }
    
    /**
     * Disattiva il focus trap
     */
    function deactivate() {
        if (!active) return;
        
        active = false;
        document.removeEventListener('keydown', handleKeyDown);
        
        // Ripristina focus precedente
        if (returnFocus && lastFocusedElement) {
            lastFocusedElement.focus();
        }
        
        // Callback
        if (onDeactivate) onDeactivate();
        
        // Rimuovi marca
        container.removeAttribute('data-focus-trap');
    }
    
    /**
     * Gestisce keydown
     */
    function handleKeyDown(e) {
        if (!active) return;
        
        // Escape
        if (escapeDeactivates && e.key === 'Escape') {
            e.preventDefault();
            deactivate();
            return;
        }
        
        // Tab
        if (e.key === 'Tab') {
            handleTab(e);
        }
    }
    
    /**
     * Gestisce Tab
     */
    function handleTab(e) {
        const focusable = getFocusableElements();
        if (focusable.length === 0) {
            e.preventDefault();
            return;
        }
        
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const current = document.activeElement;
        
        if (e.shiftKey) {
            // Shift+Tab: se sul primo, vai all'ultimo
            if (current === first || !container.contains(current)) {
                e.preventDefault();
                last.focus();
            }
        } else {
            // Tab: se sull'ultimo, vai al primo
            if (current === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }
    
    return {
        activate,
        deactivate,
        isActive: () => active,
        getFocusableElements
    };
}

// ═══════════════════════════════════════════════════════════════
// SCREEN READER ANNOUNCEMENTS
// ═══════════════════════════════════════════════════════════════

let announcerElement = null;

/**
 * Annuncia un messaggio agli screen reader
 * @param {string} message - Messaggio da annunciare
 * @param {'polite'|'assertive'} priority - Priorità
 */
export function announce(message, priority = 'polite') {
    if (!announcerElement) {
        createAnnouncer();
    }
    
    // Imposta priorità
    announcerElement.setAttribute('aria-live', priority);
    
    // Pulisci e poi imposta messaggio (forza re-announce)
    announcerElement.textContent = '';
    
    setTimeout(() => {
        announcerElement.textContent = message;
    }, 50);
}

/**
 * Crea l'elemento announcer
 */
function createAnnouncer() {
    announcerElement = document.createElement('div');
    announcerElement.id = 'sr-announcer';
    announcerElement.setAttribute('aria-live', 'polite');
    announcerElement.setAttribute('aria-atomic', 'true');
    announcerElement.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    `;
    document.body.appendChild(announcerElement);
}

// ═══════════════════════════════════════════════════════════════
// ARIA HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Imposta attributi ARIA su un elemento
 * @param {HTMLElement} element - Elemento
 * @param {Object} attrs - Attributi ARIA
 */
export function setAria(element, attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
        const attrName = key.startsWith('aria-') ? key : `aria-${key}`;
        if (value === null || value === undefined) {
            element.removeAttribute(attrName);
        } else {
            element.setAttribute(attrName, value);
        }
    });
}

/**
 * Crea un elemento con attributi accessibilità
 * @param {string} tag - Tag HTML
 * @param {Object} options - Opzioni
 * @returns {HTMLElement}
 */
export function createAccessibleElement(tag, options = {}) {
    const {
        role,
        label,
        describedBy,
        expanded,
        hidden,
        disabled,
        checked,
        ...otherAttrs
    } = options;
    
    const element = document.createElement(tag);
    
    if (role) element.setAttribute('role', role);
    if (label) element.setAttribute('aria-label', label);
    if (describedBy) element.setAttribute('aria-describedby', describedBy);
    if (expanded !== undefined) element.setAttribute('aria-expanded', expanded);
    if (hidden !== undefined) element.setAttribute('aria-hidden', hidden);
    if (disabled !== undefined) element.setAttribute('aria-disabled', disabled);
    if (checked !== undefined) element.setAttribute('aria-checked', checked);
    
    Object.entries(otherAttrs).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
    
    return element;
}

/**
 * Crea una descrizione nascosta per screen reader
 * @param {string} id - ID dell'elemento
 * @param {string} text - Testo della descrizione
 * @returns {HTMLElement}
 */
export function createScreenReaderText(id, text) {
    const span = document.createElement('span');
    span.id = id;
    span.className = 'sr-only';
    span.textContent = text;
    span.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    `;
    return span;
}

// ═══════════════════════════════════════════════════════════════
// FOCUS MANAGEMENT
// ═══════════════════════════════════════════════════════════════

/**
 * Salva il focus corrente
 */
let savedFocus = null;

export function saveFocus() {
    savedFocus = document.activeElement;
}

/**
 * Ripristina il focus salvato
 */
export function restoreFocus() {
    if (savedFocus && typeof savedFocus.focus === 'function') {
        savedFocus.focus();
    }
}

/**
 * Sposta il focus su un elemento
 * @param {HTMLElement|string} target - Elemento o selettore
 * @param {Object} options - Opzioni focus
 */
export function moveFocus(target, options = {}) {
    const element = typeof target === 'string' 
        ? document.querySelector(target) 
        : target;
    
    if (!element) return false;
    
    const { preventScroll = false, focusVisible = true } = options;
    
    if (focusVisible) {
        element.classList.add('focus-visible');
    }
    
    element.focus({ preventScroll });
    
    return true;
}

/**
 * Focus primo elemento in un contenitore
 * @param {HTMLElement|string} container - Contenitore
 */
export function focusFirst(container) {
    const root = typeof container === 'string'
        ? document.querySelector(container)
        : container;
    
    if (!root) return false;
    
    const focusable = root.querySelector(
        'a[href], button:not([disabled]), input:not([disabled]), ' +
        'textarea:not([disabled]), select:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"])'
    );
    
    if (focusable) {
        focusable.focus();
        return true;
    }
    
    return false;
}

// ═══════════════════════════════════════════════════════════════
// SKIP LINKS
// ═══════════════════════════════════════════════════════════════

/**
 * Crea skip link per navigazione
 * @param {Object} links - Array di link {target, label}
 */
export function createSkipLinks(links) {
    const container = document.createElement('nav');
    container.className = 'skip-links';
    container.setAttribute('aria-label', 'Link di navigazione veloce');
    
    container.style.cssText = `
        position: fixed;
        top: -100%;
        left: 50%;
        transform: translateX(-50%);
        z-index: 99999;
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem;
    `;
    
    links.forEach(({ target, label }) => {
        const link = document.createElement('a');
        link.href = target;
        link.textContent = label;
        
        link.style.cssText = `
            background: var(--accent-color, #0891b2);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            text-decoration: none;
            font-family: 'Lora', serif;
        `;
        
        link.addEventListener('focus', () => {
            container.style.top = '0.5rem';
        });
        
        link.addEventListener('blur', () => {
            container.style.top = '-100%';
        });
        
        container.appendChild(link);
    });
    
    document.body.insertBefore(container, document.body.firstChild);
    
    return container;
}

// ═══════════════════════════════════════════════════════════════
// MODAL DIALOG
// ═══════════════════════════════════════════════════════════════

/**
 * Crea una modale accessibile
 * @param {Object} options - Opzioni modale
 * @returns {Object} Controller modale
 */
export function createAccessibleModal(options = {}) {
    const {
        title,
        content,
        onClose,
        closeOnEscape = true,
        closeOnBackdrop = true
    } = options;
    
    // Crea struttura
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.setAttribute('role', 'presentation');
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--overlay-bg, rgba(0,0,0,0.85));
        z-index: 99998;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const dialog = document.createElement('div');
    dialog.className = 'modal-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'modal-title');
    
    dialog.style.cssText = `
        background: var(--card-bg, #1a1a1a);
        border: 1px solid var(--border-color, #333);
        border-radius: 12px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        padding: 1.5rem;
    `;
    
    dialog.innerHTML = `
        <h2 id="modal-title" style="margin: 0 0 1rem 0; color: var(--text-primary);">
            ${title}
        </h2>
        <div class="modal-content"></div>
        <button class="modal-close" aria-label="Chiudi">✕</button>
    `;
    
    // Contenuto
    const contentContainer = dialog.querySelector('.modal-content');
    if (typeof content === 'string') {
        contentContainer.innerHTML = content;
    } else if (content instanceof HTMLElement) {
        contentContainer.appendChild(content);
    }
    
    backdrop.appendChild(dialog);
    
    // Focus trap
    const trap = createFocusTrap(dialog, {
        escapeDeactivates: closeOnEscape,
        onDeactivate: close
    });
    
    // Eventi
    const closeBtn = dialog.querySelector('.modal-close');
    closeBtn.addEventListener('click', close);
    
    if (closeOnBackdrop) {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) close();
        });
    }
    
    function open() {
        saveFocus();
        document.body.appendChild(backdrop);
        document.body.style.overflow = 'hidden';
        trap.activate();
        announce(`Modal: ${title}`);
    }
    
    function close() {
        trap.deactivate();
        document.body.style.overflow = '';
        backdrop.remove();
        restoreFocus();
        if (onClose) onClose();
    }
    
    return {
        open,
        close,
        getElement: () => dialog
    };
}

// ═══════════════════════════════════════════════════════════════
// KEYBOARD NAVIGATION
// ═══════════════════════════════════════════════════════════════

/**
 * Abilita navigazione tastiera per lista/menu
 * @param {HTMLElement} container - Contenitore
 * @param {Object} options - Opzioni
 */
export function enableKeyboardNavigation(container, options = {}) {
    const {
        itemSelector = '[role="menuitem"], [role="option"], button, a',
        orientation = 'vertical',
        onSelect,
        onEscape
    } = options;
    
    let currentIndex = -1;
    
    container.addEventListener('keydown', (e) => {
        const items = Array.from(container.querySelectorAll(itemSelector));
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = Math.min(currentIndex + 1, items.length - 1);
                items[currentIndex]?.focus();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                currentIndex = Math.max(currentIndex - 1, 0);
                items[currentIndex]?.focus();
                break;
                
            case 'ArrowRight':
                if (orientation === 'horizontal') {
                    e.preventDefault();
                    currentIndex = Math.min(currentIndex + 1, items.length - 1);
                    items[currentIndex]?.focus();
                }
                break;
                
            case 'ArrowLeft':
                if (orientation === 'horizontal') {
                    e.preventDefault();
                    currentIndex = Math.max(currentIndex - 1, 0);
                    items[currentIndex]?.focus();
                }
                break;
                
            case 'Home':
                e.preventDefault();
                currentIndex = 0;
                items[currentIndex]?.focus();
                break;
                
            case 'End':
                e.preventDefault();
                currentIndex = items.length - 1;
                items[currentIndex]?.focus();
                break;
                
            case 'Enter':
            case ' ':
                if (onSelect) {
                    e.preventDefault();
                    onSelect(items[currentIndex], currentIndex);
                }
                break;
                
            case 'Escape':
                if (onEscape) {
                    e.preventDefault();
                    onEscape();
                }
                break;
        }
    });
}

console.log('♿ [Accessibility] Utility accessibilità caricate.');
