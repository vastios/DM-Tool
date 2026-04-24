/**
 * autocomplete.js
 * ─────────────────────────────────────────────────────────────
 * Modulo per l'autocomplete dei riferimenti alla campagna (@Tag).
 * 
 * Ristrutturato v2.0 - Pattern a classe per eliminare variabili globali
 * e supportare multiple istanze con stato separato.
 * 
 * @version 2.0.0 - Refactoring modulare
 * 
 * Posizione nel progetto: utils/autocomplete.js
 */

import { getAllCampaignElements, getCategoryIcon } from './campaignLinker.js';

// ═══════════════════════════════════════════════════════════════
// CLASSE AUTOCOMPLETE
// ═══════════════════════════════════════════════════════════════

/**
 * Gestisce l'autocomplete per una textarea.
 * Ogni istanza mantiene il proprio stato separato.
 */
class Autocomplete {
    
    // --- STATO STATICO CONDIVISO (singolo suggestion box per tutto il DOM) ---
    static suggestionBox = null;
    static activeInstance = null;
    
    /**
     * Ottiene o crea il suggestion box globale.
     * @returns {HTMLElement} L'elemento suggestion box
     */
    static getSuggestionBox() {
        if (!Autocomplete.suggestionBox) {
            Autocomplete.suggestionBox = document.createElement('ul');
            Autocomplete.suggestionBox.className = 'autocomplete-box';
            Autocomplete.suggestionBox.setAttribute('role', 'listbox');
            Autocomplete.suggestionBox.setAttribute('aria-label', 'Suggerimenti');
            document.body.appendChild(Autocomplete.suggestionBox);
            console.log('🔍 [Autocomplete] Suggestion box globale creato.');
        }
        return Autocomplete.suggestionBox;
    }
    
    /**
     * Nasconde il suggestion box.
     */
    static hideSuggestionBox() {
        if (Autocomplete.suggestionBox) {
            Autocomplete.suggestionBox.style.display = 'none';
        }
        Autocomplete.activeInstance = null;
    }
    
    // --- STATO ISTANZA ---
    
    /** @type {HTMLTextAreaElement} La textarea associata */
    textarea;
    
    /** @type {Array} Elementi filtrati correnti */
    filteredMatches = [];
    
    /** @type {number} Indice dell'elemento selezionato */
    selectedIndex = 0;
    
    /** @type {Function} Callback bound per input */
    boundHandleInput;
    
    /** @type {Function} Callback bound per keydown */
    boundHandleKeyDown;
    
    /** @type {Function} Callback bound per blur */
    boundHandleBlur;
    
    /** @type {boolean} Se l'istanza è attiva */
    isActive = false;
    
    /**
     * Crea una nuova istanza Autocomplete.
     * @param {HTMLTextAreaElement} textarea - La textarea a cui collegare l'autocomplete
     */
    constructor(textarea) {
        this.textarea = textarea;
        
        // Bind dei metodi per poterli rimuovere correttamente
        this.boundHandleInput = (e) => this.handleInput(e);
        this.boundHandleKeyDown = (e) => this.handleKeyDown(e);
        this.boundHandleBlur = (e) => this.handleBlur(e);
        
        console.log('🔍 [Autocomplete] Nuova istanza creata per textarea.');
    }
    
    /**
     * Attiva l'autocomplete sulla textarea.
     */
    attach() {
        if (this.isActive) {
            console.warn('⚠️ [Autocomplete] Istanza già attiva.');
            return;
        }
        
        this.textarea.addEventListener('input', this.boundHandleInput);
        this.textarea.addEventListener('keydown', this.boundHandleKeyDown);
        this.textarea.addEventListener('blur', this.boundHandleBlur);
        
        this.isActive = true;
        console.log('🔍 [Autocomplete] Istanza attivata.');
    }
    
    /**
     * Disattiva l'autocomplete dalla textarea.
     */
    detach() {
        if (!this.isActive) return;
        
        this.textarea.removeEventListener('input', this.boundHandleInput);
        this.textarea.removeEventListener('keydown', this.boundHandleKeyDown);
        this.textarea.removeEventListener('blur', this.boundHandleBlur);
        
        // Nascondi suggestion box se questa è l'istanza attiva
        if (Autocomplete.activeInstance === this) {
            Autocomplete.hideSuggestionBox();
        }
        
        this.isActive = false;
        console.log('🔍 [Autocomplete] Istanza disattivata.');
    }
    
    /**
     * Gestisce l'evento di input sulla textarea.
     * @param {InputEvent} e - L'evento di input
     */
    handleInput(e) {
        const text = this.textarea.value;
        const cursorPos = this.textarea.selectionStart;
        const lastAt = text.lastIndexOf('@', cursorPos - 1);

        // Mostra tendina solo se c'è una @ seguita da caratteri (senza spazi intermedi)
        if (lastAt !== -1 && !text.substring(lastAt, cursorPos).includes(' ')) {
            const query = text.substring(lastAt + 1, cursorPos).toLowerCase();
            const allElements = getAllCampaignElements();
            
            this.filteredMatches = allElements.filter(el => 
                el.name.toLowerCase().includes(query)
            ).slice(0, 8); // Limitiamo a 8 suggerimenti

            if (this.filteredMatches.length > 0) {
                Autocomplete.activeInstance = this;
                this.showSuggestions(lastAt);
            } else {
                Autocomplete.hideSuggestionBox();
            }
        } else {
            Autocomplete.hideSuggestionBox();
        }
    }
    
    /**
     * Mostra i suggerimenti nella posizione corretta.
     * @param {number} lastAt - La posizione dell'ultima @
     */
    showSuggestions(lastAt) {
        const suggestionBox = Autocomplete.getSuggestionBox();
        const coords = this.getCaretCoordinates(lastAt);
        
        suggestionBox.style.display = 'block';
        suggestionBox.style.left = `${coords.left}px`;
        suggestionBox.style.top = `${coords.top}px`;

        this.renderMatches();
    }
    
    /**
     * Renderizza i match nel suggestion box.
     */
    renderMatches() {
        const suggestionBox = Autocomplete.suggestionBox;
        
        suggestionBox.innerHTML = this.filteredMatches.map((match, i) => `
            <li class="${i === this.selectedIndex ? 'selected' : ''}" 
                data-index="${i}" 
                role="option"
                aria-selected="${i === this.selectedIndex}">
                <span class="type-icon">${this.getTypeIcon(match.section)}</span>
                <strong>${this.highlightMatch(match.name)}</strong>
                <span class="category-label">${match.categoryLabel}</span>
            </li>
        `).join('');

        // Click sul suggerimento
        suggestionBox.querySelectorAll('li').forEach(li => {
            li.onmousedown = (e) => {
                e.preventDefault(); // Previene perdita focus textarea
                this.selectMatch(parseInt(li.dataset.index));
            };
        });
    }
    
    /**
     * Evidenzia la parte del nome che corrisponde alla ricerca.
     * @param {string} name - Il nome completo
     * @returns {string} Il nome con evidenziazione
     */
    highlightMatch(name) {
        const text = this.textarea.value;
        const cursorPos = this.textarea.selectionStart;
        const lastAt = text.lastIndexOf('@', cursorPos - 1);
        const query = text.substring(lastAt + 1, cursorPos).toLowerCase();
        
        if (!query) return name;
        
        const lowerName = name.toLowerCase();
        const matchIndex = lowerName.indexOf(query);
        
        if (matchIndex === -1) return name;
        
        const before = name.substring(0, matchIndex);
        const match = name.substring(matchIndex, matchIndex + query.length);
        const after = name.substring(matchIndex + query.length);
        
        return `${before}<mark>${match}</mark>${after}`;
    }
    
    /**
     * Seleziona un match e lo inserisce nella textarea.
     * @param {number} index - L'indice del match da selezionare
     */
    selectMatch(index) {
        const match = this.filteredMatches[index];
        if (!match) return;
        
        const text = this.textarea.value;
        const cursorPos = this.textarea.selectionStart;
        const lastAt = text.lastIndexOf('@', cursorPos - 1);

        const beforeAt = text.substring(0, lastAt);
        const afterAt = text.substring(cursorPos);
        
        // Inserisce il nome
        this.textarea.value = beforeAt + '@' + match.name + afterAt;
        
        // Riposiziona il cursore dopo il nome inserito
        const newPos = lastAt + match.name.length + 1;
        this.textarea.setSelectionRange(newPos, newPos);
        
        // Reset stato
        this.filteredMatches = [];
        this.selectedIndex = 0;
        
        Autocomplete.hideSuggestionBox();
        
        console.log(`🔍 [Autocomplete] Selezionato: ${match.name}`);
    }
    
    /**
     * Gestisce gli eventi tastiera.
     * @param {KeyboardEvent} e - L'evento tastiera
     */
    handleKeyDown(e) {
        const suggestionBox = Autocomplete.suggestionBox;
        
        if (!suggestionBox || suggestionBox.style.display !== 'block') return;
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = (this.selectedIndex + 1) % this.filteredMatches.length;
                this.renderMatches();
                this.scrollToSelected();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = (this.selectedIndex - 1 + this.filteredMatches.length) % this.filteredMatches.length;
                this.renderMatches();
                this.scrollToSelected();
                break;
                
            case 'Enter':
            case 'Tab':
                e.preventDefault();
                this.selectMatch(this.selectedIndex);
                break;
                
            case 'Escape':
                Autocomplete.hideSuggestionBox();
                break;
        }
    }
    
    /**
     * Gestisce l'evento di blur dalla textarea.
     * @param {FocusEvent} e - L'evento di blur
     */
    handleBlur(e) {
        // Piccolo delay per permettere il click sui suggerimenti
        setTimeout(() => {
            if (Autocomplete.activeInstance === this) {
                Autocomplete.hideSuggestionBox();
            }
        }, 150);
    }
    
    /**
     * Scrolla per mostrare l'elemento selezionato.
     */
    scrollToSelected() {
        const suggestionBox = Autocomplete.suggestionBox;
        const selected = suggestionBox.querySelector('li.selected');
        if (selected) {
            selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }
    
    /**
     * Calcola la posizione del cursore in pixel.
     * @param {number} position - La posizione del cursore nel testo
     * @returns {{left: number, top: number}} Le coordinate in pixel
     */
    getCaretCoordinates(position) {
        const { offsetLeft, offsetTop } = this.textarea;
        const div = document.createElement('div');
        const style = window.getComputedStyle(this.textarea);
        
        // Copia tutti gli stili rilevanti
        const propertiesToCopy = [
            'fontFamily', 'fontSize', 'fontWeight', 'fontStyle',
            'letterSpacing', 'textTransform', 'wordSpacing',
            'textIndent', 'whiteSpace', 'wordBreak', 'wordWrap',
            'lineHeight', 'padding', 'paddingTop', 'paddingRight',
            'paddingBottom', 'paddingLeft', 'border', 'borderWidth',
            'boxSizing', 'width'
        ];
        
        propertiesToCopy.forEach(prop => {
            div.style[prop] = style[prop];
        });
        
        div.style.position = 'absolute';
        div.style.visibility = 'hidden';
        div.style.whiteSpace = 'pre-wrap';
        div.style.overflow = 'hidden';
        
        const textBeforeCaret = this.textarea.value.substring(0, position);
        div.textContent = textBeforeCaret;
        
        const span = document.createElement('span');
        span.textContent = this.textarea.value.substring(position) || '.';
        div.appendChild(span);
        
        document.body.appendChild(div);
        const rect = span.getBoundingClientRect();
        document.body.removeChild(div);
        
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY + 22 // 22px sotto la riga
        };
    }
    
    /**
     * Ottiene l'icona per una categoria.
     * @param {string} section - La categoria
     * @returns {string} L'emoji icona
     */
    getTypeIcon(section) {
        return getCategoryIcon(section);
    }
    
    /**
     * Distrugge l'istanza e pulisce le risorse.
     */
    destroy() {
        this.detach();
        this.filteredMatches = [];
        this.selectedIndex = 0;
        console.log('🔍 [Autocomplete] Istanza distrutta.');
    }
}

// ═══════════════════════════════════════════════════════════════
// REGISTRO ISTANZE E API COMPATIBILITA'
// ═══════════════════════════════════════════════════════════════

/** @type {Map<HTMLTextAreaElement, Autocomplete>} Registro delle istanze */
const instances = new Map();

/**
 * Inizializza l'autocomplete su una textarea.
 * Funzione di compatibilità con il codice esistente.
 * 
 * @param {HTMLTextAreaElement} textarea - La textarea su cui attivare l'autocomplete
 * @returns {Autocomplete} L'istanza creata
 */
export function initAutocomplete(textarea) {
    // Se esiste già un'istanza per questa textarea, la riutilizziamo
    if (instances.has(textarea)) {
        console.log('🔍 [Autocomplete] Riutilizzo istanza esistente.');
        return instances.get(textarea);
    }
    
    const instance = new Autocomplete(textarea);
    instance.attach();
    instances.set(textarea, instance);
    
    return instance;
}

/**
 * Rimuove l'autocomplete da una textarea.
 * @param {HTMLTextAreaElement} textarea - La textarea da cui rimuovere l'autocomplete
 */
export function destroyAutocomplete(textarea) {
    const instance = instances.get(textarea);
    if (instance) {
        instance.destroy();
        instances.delete(textarea);
    }
}

/**
 * Ottiene l'istanza Autocomplete per una textarea.
 * @param {HTMLTextAreaElement} textarea - La textarea
 * @returns {Autocomplete|undefined} L'istanza o undefined
 */
export function getAutocompleteInstance(textarea) {
    return instances.get(textarea);
}

/**
 * Distrugge tutte le istanze e pulisce il suggestion box globale.
 */
export function destroyAllAutocomplete() {
    instances.forEach((instance, textarea) => {
        instance.destroy();
    });
    instances.clear();
    
    // Rimuovi il suggestion box globale
    if (Autocomplete.suggestionBox) {
        Autocomplete.suggestionBox.remove();
        Autocomplete.suggestionBox = null;
    }
    
    console.log('🔍 [Autocomplete] Tutte le istanze distrutte.');
}

// Esporta la classe per uso avanzato
export { Autocomplete };

console.log('🔍 [Autocomplete] Modulo caricato (v2.0 - Pattern Classe).');
