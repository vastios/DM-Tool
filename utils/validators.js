/**
 * validators.js
 * ─────────────────────────────────────────────────────────────
 * Sistema di validazione dati centralizzato per D&D 5e.
 * 
 * Include validatori per:
 * - Nomi personaggi/entità
 * - Livelli e statistiche
 * - Classi e razze
 * - Valori numerici (HP, AC, stats)
 * - URL e dati input
 * 
 * @version 1.0.0
 */

// ═══════════════════════════════════════════════════════════════
// COSTANTI D&D 5e
// ═══════════════════════════════════════════════════════════════

export const DND_CONSTANTS = {
    MIN_LEVEL: 1,
    MAX_LEVEL: 20,
    
    MIN_ABILITY_SCORE: 1,
    MAX_ABILITY_SCORE: 30,
    
    MIN_HP: 1,
    MAX_HP: 999,
    
    MIN_AC: 1,
    MAX_AC: 30,
    
    MIN_SPEED: 0,
    MAX_SPEED: 120,
    
    VALID_CLASSES: [
        'barbarian', 'bard', 'cleric', 'druid', 'fighter',
        'monk', 'paladin', 'ranger', 'rogue', 'sorcerer',
        'warlock', 'wizard', 'artificer'
    ],
    
    VALID_ALIGNMENTS: [
        'lawful-good', 'neutral-good', 'chaotic-good',
        'lawful-neutral', 'true-neutral', 'chaotic-neutral',
        'lawful-evil', 'neutral-evil', 'chaotic-evil'
    ],
    
    VALID_SIZES: ['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'],
    
    ABILITY_SCORES: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
};

// ═══════════════════════════════════════════════════════════════
// RESULT TYPE
// ═══════════════════════════════════════════════════════════════

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Se la validazione è passata
 * @property {string} [error] - Messaggio di errore
 * @property {string} [warning] - Messaggio di warning
 * @property {any} [sanitized] - Valore sanitizzato
 */

/**
 * Crea un risultato di validazione valido
 */
function valid(sanitized = null) {
    return { valid: true, sanitized };
}

/**
 * Crea un risultato di validazione non valido
 */
function invalid(error, warning = null) {
    return { valid: false, error, warning };
}

// ═══════════════════════════════════════════════════════════════
// VALIDATORI BASE
// ═══════════════════════════════════════════════════════════════

export const validators = {
    /**
     * Valida un nome di personaggio/entità
     * @param {string} name - Nome da validare
     * @param {Object} options - Opzioni
     * @returns {ValidationResult}
     */
    characterName(name, options = {}) {
        const {
            minLength = 2,
            maxLength = 50,
            allowNumbers = false,
            allowSpecialChars = false,
            required = true
        } = options;
        
        if (!name || name.trim() === '') {
            if (required) return invalid('Il nome è obbligatorio');
            return valid('');
        }
        
        const trimmed = name.trim();
        
        if (trimmed.length < minLength) {
            return invalid(`Il nome deve avere almeno ${minLength} caratteri`);
        }
        
        if (trimmed.length > maxLength) {
            return invalid(`Il nome non può superare ${maxLength} caratteri`);
        }
        
        // Controlla caratteri non validi
        const pattern = allowSpecialChars ? 
            /[<>"'`\\]/ : 
            (allowNumbers ? /[^a-zA-Z0-9\s\-'\u00C0-\u017F]/ : /[^a-zA-Z\s\-'\u00C0-\u017F]/);
        
        if (pattern.test(trimmed)) {
            return invalid('Il nome contiene caratteri non validi');
        }
        
        return valid(trimmed);
    },
    
    /**
     * Valida un livello personaggio
     * @param {number|string} level - Livello da validare
     * @returns {ValidationResult}
     */
    level(level) {
        const num = parseInt(level);
        
        if (isNaN(num)) {
            return invalid('Il livello deve essere un numero');
        }
        
        if (num < DND_CONSTANTS.MIN_LEVEL) {
            return invalid(`Il livello minimo è ${DND_CONSTANTS.MIN_LEVEL}`);
        }
        
        if (num > DND_CONSTANTS.MAX_LEVEL) {
            return invalid(`Il livello massimo è ${DND_CONSTANTS.MAX_LEVEL}`);
        }
        
        return valid(num);
    },
    
    /**
     * Valida uno ability score
     * @param {number|string} score - Valore da validare
     * @param {string} ability - Nome dell'abilità (opzionale)
     * @returns {ValidationResult}
     */
    abilityScore(score, ability = null) {
        const num = parseInt(score);
        
        if (isNaN(num)) {
            return invalid('Il valore deve essere un numero');
        }
        
        if (num < DND_CONSTANTS.MIN_ABILITY_SCORE) {
            return invalid(`Il valore minimo è ${DND_CONSTANTS.MIN_ABILITY_SCORE}`);
        }
        
        if (num > DND_CONSTANTS.MAX_ABILITY_SCORE) {
            return invalid(`Il valore massimo è ${DND_CONSTANTS.MAX_ABILITY_SCORE}`);
        }
        
        // Warning per valori estremi
        let warning = null;
        if (num < 3 && ability) {
            warning = `${ability} molto basso (${num})`;
        } else if (num > 20 && ability) {
            warning = `${ability} molto alto (${num})`;
        }
        
        return { valid: true, sanitized: num, warning };
    },
    
    /**
     * Valida HP massimi
     * @param {number|string} hp - HP da validare
     * @returns {ValidationResult}
     */
    hitPoints(hp) {
        const num = parseInt(hp);
        
        if (isNaN(num)) {
            return invalid('Gli HP devono essere un numero');
        }
        
        if (num < DND_CONSTANTS.MIN_HP) {
            return invalid(`HP minimi: ${DND_CONSTANTS.MIN_HP}`);
        }
        
        if (num > DND_CONSTANTS.MAX_HP) {
            return invalid(`HP massimi: ${DND_CONSTANTS.MAX_HP}`);
        }
        
        return valid(num);
    },
    
    /**
     * Valida Armor Class
     * @param {number|string} ac - AC da validare
     * @returns {ValidationResult}
     */
    armorClass(ac) {
        const num = parseInt(ac);
        
        if (isNaN(num)) {
            return invalid('L\'AC deve essere un numero');
        }
        
        if (num < DND_CONSTANTS.MIN_AC) {
            return invalid(`AC minima: ${DND_CONSTANTS.MIN_AC}`);
        }
        
        if (num > DND_CONSTANTS.MAX_AC) {
            return invalid(`AC massima: ${DND_CONSTANTS.MAX_AC}`);
        }
        
        let warning = null;
        if (num < 8) warning = 'AC molto bassa';
        if (num > 25) warning = 'AC molto alta';
        
        return { valid: true, sanitized: num, warning };
    },
    
    /**
     * Valida una classe D&D
     * @param {string} className - Nome della classe
     * @returns {ValidationResult}
     */
    characterClass(className) {
        if (!className || typeof className !== 'string') {
            return invalid('Classe non specificata');
        }
        
        const normalized = className.toLowerCase().trim();
        
        if (!DND_CONSTANTS.VALID_CLASSES.includes(normalized)) {
            return invalid(`Classe non valida: ${className}`);
        }
        
        return valid(normalized);
    },
    
    /**
     * Valida un allineamento
     * @param {string} alignment - Allineamento
     * @returns {ValidationResult}
     */
    alignment(alignment) {
        if (!alignment) return valid(null);
        
        const normalized = alignment.toLowerCase().trim().replace(/\s+/g, '-');
        
        if (!DND_CONSTANTS.VALID_ALIGNMENTS.includes(normalized)) {
            return invalid(`Allineamento non valido: ${alignment}`);
        }
        
        return valid(normalized);
    },
    
    /**
     * Valida velocità
     * @param {number|string} speed - Velocità in ft
     * @returns {ValidationResult}
     */
    speed(speed) {
        const num = parseInt(speed);
        
        if (isNaN(num)) {
            return invalid('La velocità deve essere un numero');
        }
        
        if (num < DND_CONSTANTS.MIN_SPEED) {
            return invalid(`Velocità minima: ${DND_CONSTANTS.MIN_SPEED}`);
        }
        
        if (num > DND_CONSTANTS.MAX_SPEED) {
            return invalid(`Velocità massima: ${DND_CONSTANTS.MAX_SPEED}`);
        }
        
        return valid(num);
    },
    
    /**
     * Valida un URL (per immagini, link)
     * @param {string} url - URL da validare
     * @param {Object} options - Opzioni
     * @returns {ValidationResult}
     */
    url(url, options = {}) {
        const {
            allowRelative = true,
            allowDataUri = true,
            requireHttps = false,
            allowedProtocols = ['http', 'https', 'data']
        } = options;
        
        if (!url || url.trim() === '') {
            return valid(''); // URL vuoto è valido (opzionale)
        }
        
        const trimmed = url.trim();
        
        // URL relativo
        if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
            if (!allowRelative) {
                return invalid('URL relativi non permessi');
            }
            return valid(trimmed);
        }
        
        // Data URI
        if (trimmed.startsWith('data:')) {
            if (!allowDataUri) {
                return invalid('Data URI non permessi');
            }
            if (!trimmed.startsWith('data:image/')) {
                return invalid('Solo data URI immagine permessi');
            }
            return valid(trimmed);
        }
        
        // URL assoluto
        try {
            const parsed = new URL(trimmed);
            
            if (!allowedProtocols.includes(parsed.protocol.replace(':', ''))) {
                return invalid(`Protocollo non permesso: ${parsed.protocol}`);
            }
            
            if (requireHttps && parsed.protocol !== 'https:') {
                return invalid('Solo URL HTTPS permessi');
            }
            
            return valid(trimmed);
        } catch (e) {
            return invalid('URL non valido');
        }
    },
    
    /**
     * Valida testo lungo (descrizioni, note)
     * @param {string} text - Testo da validare
     * @param {Object} options - Opzioni
     * @returns {ValidationResult}
     */
    longText(text, options = {}) {
        const { maxLength = 5000, allowHtml = false } = options;
        
        if (!text) return valid('');
        
        if (text.length > maxLength) {
            return invalid(`Il testo non può superare ${maxLength} caratteri`);
        }
        
        if (!allowHtml) {
            const dangerousPatterns = [
                /<script\b/i,
                /javascript:/i,
                /on\w+\s*=/i,
                /<iframe\b/i
            ];
            
            for (const pattern of dangerousPatterns) {
                if (pattern.test(text)) {
                    return invalid('Il testo contiene contenuti non permessi');
                }
            }
        }
        
        return valid(text.trim());
    },
    
    /**
     * Valida un numero intero in range
     * @param {number|string} value - Valore
     * @param {Object} options - Opzioni
     * @returns {ValidationResult}
     */
    integer(value, options = {}) {
        const { min = -Infinity, max = Infinity, required = true } = options;
        
        if (value === '' || value === null || value === undefined) {
            if (required) return invalid('Valore obbligatorio');
            return valid(null);
        }
        
        const num = parseInt(value);
        
        if (isNaN(num)) {
            return invalid('Deve essere un numero intero');
        }
        
        if (num < min) return invalid(`Valore minimo: ${min}`);
        if (num > max) return invalid(`Valore massimo: ${max}`);
        
        return valid(num);
    },
    
    /**
     * Valida un colore esadecimale
     * @param {string} color - Colore da validare
     * @returns {ValidationResult}
     */
    hexColor(color) {
        if (!color) return valid(null);
        
        const pattern = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
        
        if (!pattern.test(color)) {
            return invalid('Formato colore non valido (es. #FF0000 o #F00)');
        }
        
        const normalized = color.startsWith('#') ? color : `#${color}`;
        return valid(normalized);
    },
    
    /**
     * Valida dimensione creatura
     * @param {string} size - Dimensione
     * @returns {ValidationResult}
     */
    creatureSize(size) {
        if (!size) return valid('medium');
        
        const normalized = size.toLowerCase().trim();
        
        if (!DND_CONSTANTS.VALID_SIZES.includes(normalized)) {
            return invalid(`Dimensione non valida. Valide: ${DND_CONSTANTS.VALID_SIZES.join(', ')}`);
        }
        
        return valid(normalized);
    }
};

// ═══════════════════════════════════════════════════════════════
// VALIDATORE COMPOSITO
// ═══════════════════════════════════════════════════════════════

/**
 * Valida un oggetto con regole multiple
 * @param {Object} data - Dati da validare
 * @param {Object} rules - Regole di validazione
 * @returns {{valid: boolean, errors: Object, sanitized: Object, warnings: Object}}
 * 
 * @example
 * const result = validateObject(character, {
 *     name: { validator: 'characterName', required: true },
 *     level: { validator: 'level', required: true },
 *     hp: { validator: 'hitPoints' }
 * });
 */
export function validateObject(data, rules) {
    const errors = {};
    const warnings = {};
    const sanitized = {};
    
    for (const [field, config] of Object.entries(rules)) {
        const value = data[field];
        const { validator, required = false, ...options } = config;
        
        // Skip se non richiesto e vuoto
        if (!required && (value === undefined || value === null || value === '')) {
            continue;
        }
        
        // Validazione
        if (typeof validator === 'string' && validators[validator]) {
            const result = validators[validator](value, options);
            
            if (!result.valid) {
                errors[field] = result.error;
            } else {
                sanitized[field] = result.sanitized;
                if (result.warning) {
                    warnings[field] = result.warning;
                }
            }
        } else if (typeof validator === 'function') {
            const result = validator(value, options);
            if (!result.valid) {
                errors[field] = result.error;
            } else {
                sanitized[field] = result.sanitized;
                if (result.warning) {
                    warnings[field] = result.warning;
                }
            }
        }
    }
    
    return {
        valid: Object.keys(errors).length === 0,
        errors,
        warnings,
        sanitized
    };
}

/**
 * Validatore per form in tempo reale
 * @param {HTMLFormElement} form - Form da validare
 * @param {Object} rules - Regole di validazione
 * @returns {Function} Funzione per validare singolo campo
 */
export function createFormValidator(form, rules) {
    const validateField = (fieldName) => {
        const input = form.elements[fieldName];
        if (!input) return { valid: true };
        
        const config = rules[fieldName];
        if (!config) return { valid: true };
        
        const value = input.value;
        const { validator, ...options } = config;
        
        const result = validators[validator] ? 
            validators[validator](value, options) : 
            { valid: true };
        
        // Aggiorna UI
        if (result.valid) {
            input.classList.remove('invalid');
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
        }
        
        // Mostra/nascondi messaggio errore
        let errorEl = input.parentElement.querySelector('.error-message');
        if (!result.valid) {
            if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.className = 'error-message';
                input.parentElement.appendChild(errorEl);
            }
            errorEl.textContent = result.error;
        } else if (errorEl) {
            errorEl.remove();
        }
        
        return result;
    };
    
    // Valida tutto il form
    const validateAll = () => {
        const errors = {};
        for (const fieldName of Object.keys(rules)) {
            const result = validateField(fieldName);
            if (!result.valid) {
                errors[fieldName] = result.error;
            }
        }
        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    };
    
    return { validateField, validateAll };
}

// ═══════════════════════════════════════════════════════════════
// HELPER
// ═══════════════════════════════════════════════════════════════

/**
 * Calcola il modifier da ability score
 */
export function getModifier(score) {
    return Math.floor((score - 10) / 2);
}

/**
 * Formatta il modifier con segno
 */
export function formatModifier(modifier) {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

/**
 * Valida e calcola modifier
 */
export function validateAndGetModifier(score) {
    const result = validators.abilityScore(score);
    if (!result.valid) return result;
    
    const modifier = getModifier(result.sanitized);
    return { ...result, modifier };
}

console.log('✅ [validators] Sistema validazione caricato.');
