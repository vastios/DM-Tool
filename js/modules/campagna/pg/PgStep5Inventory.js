/**
 * PgStep5Inventory.js
 * ─────────────────────────────────────────────────────────────
 * Renderizza lo Step 5 del wizard: Inventario ed Equipaggiamento.
 * 
 * Funzionalità:
 * - Mostra equipaggiamento suggerito da classe e background
 * - Gestisce scelte esclusive (a) o (b)
 * - Espande automaticamente le dotazioni nei loro contenuti
 * - Permette di aggiungere/rimuovere oggetti dal database
 * - Mostra peso totale e costo totale
 * 
 * @author DM Tool
 * @version 2.1.0 - escapeHtml importata da PgConstants
 */

import { escapeHtml } from './PgConstants.js';

/**
 * Categorie di equipaggiamento per il filtro
 */
const EQUIPMENT_CATEGORIES = {
    'weapon': { name: 'Armi', icon: '⚔️' },
    'armor': { name: 'Armature', icon: '🛡️' },
    'adventuring-gear': { name: 'Equipaggiamento', icon: '🎒' },
    'tools': { name: 'Strumenti', icon: '🔧' },
    'mounts-and-vehicles': { name: 'Veicoli', icon: '🐴' }
};

/**
 * Formatta il costo in monete
 */
function formatCost(cost) {
    if (!cost) return '-';
    const units = { 'mo': 'mo', 'ma': 'ma', 'mr': 'mr', 'mp': 'mp' };
    return `${cost.quantity || 0} ${units[cost.unit] || cost.unit}`;
}

/**
 * Converte il costo in monete di rame per il calcolo
 */
function costToCopper(cost) {
    if (!cost) return 0;
    const conversions = { 'mp': 1000, 'mo': 100, 'ma': 10, 'mr': 1 };
    return (cost.quantity || 0) * (conversions[cost.unit] || 1);
}

/**
 * Formatta le monete di rame in formato leggibile
 */
function copperToFormatted(copper) {
    if (copper >= 100) return `${Math.floor(copper / 100)} mo`;
    if (copper >= 10) return `${Math.floor(copper / 10)} ma`;
    return `${copper} mr`;
}

/**
 * Calcola il peso totale dell'inventario
 */
function calculateTotalWeight(inventory) {
    if (!inventory || !Array.isArray(inventory)) return 0;
    return inventory.reduce((total, item) => {
        const weight = item.weight || 0;
        const qty = item.quantity || 1;
        return total + (weight * qty);
    }, 0);
}

/**
 * Calcola il costo totale dell'inventario
 */
function calculateTotalCost(inventory) {
    if (!inventory || !Array.isArray(inventory)) return 0;
    return inventory.reduce((total, item) => {
        const cost = costToCopper(item.cost);
        const qty = item.quantity || 1;
        return total + (cost * qty);
    }, 0);
}

/**
 * Ottiene l'icona per la categoria dell'oggetto
 */
function getItemIcon(item) {
    const cat = item.equipment_category?.index;
    if (cat === 'weapon') return '⚔️';
    if (cat === 'armor') return '🛡️';
    if (cat === 'tools') return '🔧';
    if (cat === 'mounts-and-vehicles') return '🐴';
    return '🎒';
}

/**
 * Parse una riga di equipaggiamento con scelte
 * Supporta:
 * - Scelte multiple: "(a) x, (b) y o (c) z" -> choice con 3 opzioni
 * - Scelte semplici: "(a) x o (b) y" -> choice con 2 opzioni
 * - Oggetti fissi: "Armatura di cuoio e un pugnale" -> fixed con più oggetti
 * 
 * @param {string} line - La riga di equipaggiamento
 * @returns {Object} - { type: 'choice'|'fixed', options?: [...], items?: [...] }
 */
function parseEquipmentChoices(line) {
    if (!line || typeof line !== 'string') {
        return { type: 'fixed', items: [] };
    }
    
    line = line.trim();
    
    // Cerca pattern tipo "(a)", "(b)", "(c)"...
    const letterPattern = /\(([a-z])\)/gi;
    const letterMatches = [...line.matchAll(letterPattern)];
    
    // Se abbiamo almeno 2 lettere, è una scelta multipla
    if (letterMatches.length >= 2) {
        const options = [];
        const letters = letterMatches.map(m => m[1].toLowerCase());
        
        for (let i = 0; i < letterMatches.length; i++) {
            const currentMatch = letterMatches[i];
            const nextMatch = letterMatches[i + 1];
            
            // Il testo tra (x) e il prossimo (y) o la fine
            const startIndex = currentMatch.index + currentMatch[0].length;
            const endIndex = nextMatch ? nextMatch.index : line.length;
            
            let text = line.substring(startIndex, endIndex).trim();
            
            // Rimuovi separatori finali ("o", "or", virgole)
            text = text.replace(/\s*(?:o|or)\s*$/i, '').trim();
            text = text.replace(/,\s*$/, '').trim();
            
            if (text) {
                options.push({
                    key: letters[i],
                    text: text
                });
            }
        }
        
        if (options.length >= 2) {
            return {
                type: 'choice',
                options: options
            };
        }
    }
    
    // Se non ci sono scelte con lettere, è un oggetto fisso
    // Può contenere più oggetti separati da "e" o ","
    // Es: "Armatura di cuoio e un pugnale" o "Spada, scudo e arco"
    
    // Dividi per " e " principale (non all'interno di parentesi)
    const items = parseFixedItems(line);
    
    return {
        type: 'fixed',
        items: items
    };
}

/**
 * Funzione helper per processare un singolo componente estratto dal testo.
 * Rimuove articoli iniziali, estrae quantità e aggiunge l'item all'array.
 */
function _processParsedItem(part, items, placeholders) {
    // Ripristina placeholder parentetici
    placeholders.forEach((ph, i) => {
        part = part.replace(`__PH${i}__`, ph);
    });

    part = part.trim();
    if (!part) return;

    // Rimuovi articoli determinativi/indeterminativi all'inizio, ma solo se
    // la parola che segue ha >= 3 caratteri (evita di troncare nomi corti come "Stendardo")
    part = part.replace(/^(un['a]?|una|uno|il|la|lo|le|i|gli)\s+(?=\w{3,})/i, '');

    // Controlla se c'è una quantità all'inizio (es. "20 frecce")
    const qtyMatch = part.match(/^(\d+)\s+(.+)$/);
    if (qtyMatch) {
        items.push({
            name: qtyMatch[2].trim(),
            quantity: parseInt(qtyMatch[1])
        });
    } else {
        items.push({
            name: part,
            quantity: 1
        });
    }
}

/**
 * Parse oggetti fissi da una stringa di equipaggiamento.
 * Gestisce articoli, quantità, parentesi descrittive e sub-item "con N Y".
 *
 * Es: "arco lungo e faretra con 20 frecce" -> [
 *   {name: "arco lungo", quantity: 1},
 *   {name: "faretra", quantity: 1},
 *   {name: "frecce", quantity: 20}
 * ]
 * Es: "una balestra leggera e 20 dardi" -> [
 *   {name: "balestra leggera", quantity: 1},
 *   {name: "dardi", quantity: 20}
 * ]
 * Es: "5 bastoncini di incenso" -> [{name: "bastoncini di incenso", quantity: 5}]
 *
 * Nota: la rimozione articoli è selettiva per evitare di troncare nomi di oggetti
 * che iniziano con parole simili ad articoli italiani (es. "Stendardo").
 *
 * @param {string} text - Il testo da parsare
 * @returns {Array<{name: string, quantity: number}>} - Array di oggetti
 */
function parseFixedItems(text) {
    const items = [];

    // Step 1: Proteggi il contenuto tra parentesi dalla suddivisione
    // Es. "Un simbolo sacro (un dono ricevuto...)" → il testo tra parentesi
    // non deve causare split su " e " o articoli interni
    const placeholders = [];
    let processed = text.replace(/\(([^)]+)\)/g, (match) => {
        const idx = placeholders.length;
        placeholders.push(match);
        return `__PH${idx}__`;
    });

    // Step 2: Dividi per virgola (con eventuale "e" dopo) e per " e "
    // Non c'è più il lookahead restrictivo: ogni " e " separa item distinti
    const parts = processed.split(/,\s*(?:e\s+)?|\s+e\s+/i);

    // Step 3: Processa ogni parte
    parts.forEach(part => {
        // Gestisci il pattern "X con N Y" (es. "faretra con 20 frecce")
        // → item principale X + sub-item Y con quantità N
        const conMatch = part.match(/^(.+?)\s+con\s+(\d+)\s+(.+)$/);
        if (conMatch) {
            // Processa l'item principale (prima di "con"), qty rimane 1
            _processParsedItem(conMatch[1], items, placeholders);
            // Aggiungi il sub-item (dopo "con") con quantità specificata
            let subName = conMatch[3];
            placeholders.forEach((ph, i) => {
                subName = subName.replace(`__PH${i}__`, ph);
            });
            subName = subName.trim();
            // Rimuovi eventuali articoli dal sub-item
            subName = subName.replace(/^(un['a]?|una|uno|il|la|lo|le|i|gli)\s+(?=\w{3,})/i, '');
            items.push({
                name: subName,
                quantity: parseInt(conMatch[2])
            });
        } else {
            _processParsedItem(part, items, placeholders);
        }
    });

    return items;
}

/**
 * Mapping delle categorie testuali italiane ai filtri del database
 * Include sia forme singolari che plurali
 */
const DYNAMIC_CATEGORY_MAP = {
    // Armi (singolare e plurale)
    'arma semplice': { filter: { type: 'weapon', weapon_category: 'Semplice' }, icon: '⚔️' },
    'armi semplici': { filter: { type: 'weapon', weapon_category: 'Semplice' }, icon: '⚔️' },
    'arma da guerra': { filter: { type: 'weapon', weapon_category: 'Marziale' }, icon: '⚔️' },
    'armi da guerra': { filter: { type: 'weapon', weapon_category: 'Marziale' }, icon: '⚔️' },
    'arma marziale': { filter: { type: 'weapon', weapon_category: 'Marziale' }, icon: '⚔️' },
    'armi marziali': { filter: { type: 'weapon', weapon_category: 'Marziale' }, icon: '⚔️' },
    'arma da mischia': { filter: { type: 'weapon', weapon_range: 'Mischia' }, icon: '🗡️' },
    'armi da mischia': { filter: { type: 'weapon', weapon_range: 'Mischia' }, icon: '🗡️' },
    'arma a distanza': { filter: { type: 'weapon', weapon_range: 'A Distanza' }, icon: '🏹' },
    'armi a distanza': { filter: { type: 'weapon', weapon_range: 'A Distanza' }, icon: '🏹' },
    'arma': { filter: { type: 'weapon' }, icon: '⚔️' },
    'armi': { filter: { type: 'weapon' }, icon: '⚔️' },
    
    // Armature
    'armatura leggera': { filter: { type: 'armor', armor_category: 'Leggera' }, icon: '🛡️' },
    'armature leggere': { filter: { type: 'armor', armor_category: 'Leggera' }, icon: '🛡️' },
    'armatura media': { filter: { type: 'armor', armor_category: 'Media' }, icon: '🛡️' },
    'armature medie': { filter: { type: 'armor', armor_category: 'Media' }, icon: '🛡️' },
    'armatura pesante': { filter: { type: 'armor', armor_category: 'Pesante' }, icon: '🛡️' },
    'armature pesanti': { filter: { type: 'armor', armor_category: 'Pesante' }, icon: '🛡️' },
    'armatura': { filter: { type: 'armor' }, icon: '🛡️' },
    
    // Strumenti (singolare e plurale)
    'strumento musicale': { filter: { type: 'tool', tool_category: 'Strumento Musicale' }, icon: '🎵' },
    'strumenti musicali': { filter: { type: 'tool', tool_category: 'Strumento Musicale' }, icon: '🎵' },
    'strumento da artigiano': { filter: { type: 'tool', tool_category: 'Strumenti da Artigiano' }, icon: '🔧' },
    'strumenti da artigiano': { filter: { type: 'tool', tool_category: 'Strumenti da Artigiano' }, icon: '🔧' },
    'strumento': { filter: { type: 'tool' }, icon: '🔧' },
    'strumenti': { filter: { type: 'tool' }, icon: '🔧' },
    
    // NOTA: Le dotazioni/zaini NON sono incluse qui perché sono oggetti specifici
    // con contenuti predefiniti, non categorie da cui scegliere liberamente.
    // Es: "zaino da diplomatico", "zaino da intrattenitore" sono oggetti specifici.
};

/**
 * Mapping numeri in lettere -> cifre
 */
const NUMBER_WORDS = {
    'un': 1, 'uno': 1, 'una': 1,
    'due': 2, 'tre': 3, 'quattro': 4,
    'cinque': 5, 'sei': 6, 'sette': 7,
    'otto': 8, 'nove': 9, 'dieci': 10
};

/**
 * Converte un testo numero in cifra
 */
function parseQuantityWord(text) {
    // Se è già un numero
    if (/^\d+$/.test(text)) return parseInt(text);
    // Se è una parola
    return NUMBER_WORDS[text.toLowerCase()] || null;
}

/**
 * Riconosce se un testo contiene una "scelta dinamica"
 * Es: "una qualsiasi arma semplice", "tre strumenti musicali di tua scelta"
 * 
 * @param {string} text - Il testo da analizzare
 * @returns {Object|null} - {category: string, quantity: number, filter: Object, icon: string} o null
 */
function parseDynamicChoice(text) {
    if (!text || typeof text !== 'string') return null;
    
    const lowerText = text.toLowerCase().trim();
    
    // Pattern per riconoscere scelte dinamiche
    // Es: "una qualsiasi arma semplice", "qualsiasi arma semplice", "tre strumenti musicali"
    const patterns = [
        // "una qualsiasi arma semplice", "un qualsiasi strumento musicale"
        /(?:una?|un)\s+(?:qualsiasi|altra?|altro)\s+(.+)/i,
        // "qualsiasi arma semplice", "qualsiasi altro strumento musicale"
        /qualsiasi\s+(?:altro|altra)?\s*(.+)/i,
        // "tre strumenti musicali di tua scelta", "due armi da guerra" (numeri in lettere o cifre)
        /^(un|uno|una|due|tre|quattro|cinque|sei|sette|otto|nove|dieci|\d+)\s+(.+?)(?:\s+di\s+tua\s+scelta)?$/i,
        // "arma semplice a tua scelta"
        /(.+?)\s+(?:a|di)\s+tua\s+scelta$/i,
    ];
    
    for (const pattern of patterns) {
        const match = lowerText.match(pattern);
        if (match) {
            let quantity = 1;
            let categoryText;
            
            // Pattern con numero (posizione 1 e 2)
            if (match.length >= 3 && match[2]) {
                const qtyWord = parseQuantityWord(match[1]);
                if (qtyWord !== null) {
                    quantity = qtyWord;
                    categoryText = match[2].trim();
                } else {
                    categoryText = match[1].trim();
                }
            } else {
                categoryText = match[1].trim();
            }
            
            // Rimuovi parti extra dal categoryText
            categoryText = categoryText
                .replace(/\s+di\s+tua\s+scelta$/i, '')
                .replace(/^(altra?|altro)\s+/i, '')
                .trim();
            
            // Cerca la categoria nel mapping
            for (const [key, value] of Object.entries(DYNAMIC_CATEGORY_MAP)) {
                if (categoryText.includes(key)) {
                    return {
                        category: key,
                        quantity: quantity,
                        filter: value.filter,
                        icon: value.icon,
                        displayText: text
                    };
                }
            }
        }
    }
    
    // Prova con ricerca diretta nel mapping
    for (const [key, value] of Object.entries(DYNAMIC_CATEGORY_MAP)) {
        if (lowerText.includes(key)) {
            // Cerca un numero all'inizio (lettere o cifre)
            const numMatch = lowerText.match(/^(un|uno|una|due|tre|quattro|cinque|sei|sette|otto|nove|dieci|\d+)\s+/i);
            const quantity = numMatch ? (parseQuantityWord(numMatch[1]) || 1) : 1;
            
            return {
                category: key,
                quantity: quantity,
                filter: value.filter,
                icon: value.icon,
                displayText: text
            };
        }
    }
    
    return null;
}

/**
 * Filtra gli oggetti dal database in base al filtro categoria
 * @param {Array} items - Database degli oggetti
 * @param {Object} filter - Filtro da applicare
 * @returns {Array} - Oggetti filtrati
 */
function filterItemsByCategory(items, filter) {
    if (!items || !filter) return [];
    
    return items.filter(item => {
        // Filtro per tipo (weapon, armor, tool, etc.)
        if (filter.type) {
            const catIndex = item.equipment_category?.index || '';
            const isType = catIndex.includes(filter.type) || 
                          (filter.type === 'weapon' && catIndex === 'weapon') ||
                          (filter.type === 'armor' && catIndex === 'armor') ||
                          (filter.type === 'tool' && catIndex === 'tools') ||
                          (filter.type === 'pack' && catIndex === 'adventuring-gear' && 
                           item.gear_category?.index === 'equipment-packs');
            
            if (!isType) return false;
        }
        
        // Filtro per weapon_category
        if (filter.weapon_category) {
            const wc = (item.weapon_category || '').toLowerCase();
            if (!wc.includes(filter.weapon_category.toLowerCase())) return false;
        }
        
        // Filtro per weapon_range
        if (filter.weapon_range) {
            const wr = (item.weapon_range || '').toLowerCase();
            if (!wr.includes(filter.weapon_range.toLowerCase())) return false;
        }
        
        // Filtro per armor_category
        if (filter.armor_category) {
            const ac = (item.armor_category || '').toLowerCase();
            if (!ac.includes(filter.armor_category.toLowerCase())) return false;
        }
        
        // Filtro per tool_category
        if (filter.tool_category) {
            const tc = (item.tool_category || '').toLowerCase();
            if (!tc.includes(filter.tool_category.toLowerCase())) return false;
        }
        
        return true;
    });
}

/**
 * Renderizza il box riepilogo inventario
 */
function renderInventorySummary(inventory) {
    const totalWeight = calculateTotalWeight(inventory);
    const totalCost = calculateTotalCost(inventory);
    const itemCount = inventory?.length || 0;
    
    return `
        <div class="inventory-summary-box">
            <div class="summary-stat">
                <span class="stat-label">Oggetti</span>
                <span class="stat-value">${itemCount}</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">Peso Totale</span>
                <span class="stat-value">${totalWeight.toFixed(1)} kg</span>
            </div>
            <div class="summary-stat">
                <span class="stat-label">Valore Totale</span>
                <span class="stat-value">${copperToFormatted(totalCost)}</span>
            </div>
        </div>
    `;
}

/**
 * Renderizza l'equipaggiamento suggerito con gestione scelte
 */
function renderSuggestedEquipment(pgData, databases) {
    const selectedClass = databases.selectedClass;
    const selectedBackground = databases.selectedBackground;
    
    // Recupera lo stato delle scelte accettate
    const acceptedSuggestions = pgData._acceptedSuggestions || [];
    const selectedChoices = pgData._selectedChoices || {}; // es: { "0": "a", "1": "b" }
    
    let html = '';
    
    // Equipaggiamento della classe
    if (selectedClass?.equipaggiamento && selectedClass.equipaggiamento.length > 0) {
        html += `
            <div class="suggested-equipment-section">
                <h4>📦 Equipaggiamento ${selectedClass.classe || selectedClass.name}</h4>
                <ul class="suggested-equipment-list">
                    ${selectedClass.equipaggiamento.map((eq, idx) => {
                        return renderEquipmentLine(eq, idx, 'class', acceptedSuggestions, selectedChoices);
                    }).join('')}
                </ul>
            </div>
        `;
    }
    
    // Equipaggiamento del background
    if (selectedBackground?.equipaggiamento && selectedBackground.equipaggiamento.length > 0) {
        html += `
            <div class="suggested-equipment-section">
                <h4>🎭 Equipaggiamento ${selectedBackground.nome}</h4>
                <ul class="suggested-equipment-list">
                    ${selectedBackground.equipaggiamento.map((eq, idx) => {
                        return renderEquipmentLine(eq, idx, 'background', acceptedSuggestions, selectedChoices);
                    }).join('')}
                </ul>
            </div>
        `;
    }
    
    return html;
}

/**
 * Renderizza una singola riga di equipaggiamento
 * Gestisce due formati di input:
 * - OGGETTO STRUTTURATO: { nome, quantita } o { tipo: "scelta", opzioni: [...] }
 * - STRINGA (legacy per classi): "testo libero con (a) e (b)"
 */
function renderEquipmentLine(eq, idx, source, acceptedSuggestions, selectedChoices) {
    const lineKey = `${source}-${idx}`;

    // ── FORMATO STRUTTURATO (background ristrutturati) ──
    if (typeof eq === 'object' && eq !== null) {
        // Controlla se questa riga è già stata accettata
        if (acceptedSuggestions.includes(lineKey)) {
            return '';
        }

        // Tipo SCELTA: { tipo: "scelta", opzioni: [...] }
        if (eq.tipo === 'scelta' && Array.isArray(eq.opzioni)) {
            const selectedOption = selectedChoices[lineKey];
            if (selectedOption !== undefined) {
                // L'utente ha già scelto un'opzione — mostra solo quella
                const selIdx = parseInt(selectedOption);
                const selected = eq.opzioni[selIdx];
                if (!selected) return '';

                const displayText = selected.quantita > 1
                    ? `${selected.quantita} ${selected.nome}`
                    : selected.nome;
                const itemsJson = encodeURIComponent(JSON.stringify([{
                    name: selected.nome,
                    quantity: selected.quantita
                }]));

                return `
                    <li class="suggested-item choice-selected">
                        <span class="suggested-text">${escapeHtml(displayText)}</span>
                        <div class="choice-actions">
                            <button type="button" class="btn btn-sm btn-add-suggested"
                                    data-suggestion-key="${lineKey}"
                                    data-suggestion-text="${escapeHtml(displayText)}"
                                    data-suggestion-items="${itemsJson}"
                                    data-source="${source}"
                                    title="Aggiungi">✓</button>
                            <button type="button" class="btn btn-sm btn-reset-choice"
                                    data-choice-key="${lineKey}"
                                    title="Cambia scelta">↩</button>
                        </div>
                    </li>`;
            }

            // Mostra tutte le opzioni disponibili
            return `
                <li class="suggested-item choice-item">
                    <div class="choice-label">Scegli una opzione:</div>
                    ${eq.opzioni.map((opt, i) => {
                        const displayText = opt.quantita > 1
                            ? `${opt.quantita} ${opt.nome}`
                            : opt.nome;
                        return `
                            <div class="choice-option">
                                <span class="choice-key">(${i + 1})</span>
                                <span class="choice-text">${escapeHtml(displayText)}</span>
                                <button type="button" class="btn btn-sm btn-select-choice"
                                        data-choice-key="${lineKey}"
                                        data-choice-option="${i}"
                                        data-choice-text="${escapeHtml(displayText)}"
                                        data-source="${source}"
                                        title="Seleziona">${i + 1}</button>
                            </div>`;
                    }).join('')}
                </li>`;
        }

        // Tipo OGGETTO SINGOLO: { nome, quantita }
        if (eq.nome) {
            const displayText = eq.quantita > 1
                ? `${eq.quantita} ${eq.nome}`
                : eq.nome;
            const itemsJson = encodeURIComponent(JSON.stringify([{
                name: eq.nome,
                quantity: eq.quantita || 1
            }]));

            return `
                <li class="suggested-item fixed-item">
                    <span class="suggested-text">${escapeHtml(displayText)}</span>
                    <button type="button" class="btn btn-sm btn-add-suggested"
                            data-suggestion-key="${lineKey}"
                            data-suggestion-text="${escapeHtml(displayText)}"
                            data-suggestion-items="${itemsJson}"
                            data-source="${source}"
                            title="Aggiungi">+</button>
                </li>`;
        }

        return '';
    }

    // ── FORMATO STRINGA (legacy per classi) ──
    const parsed = parseEquipmentChoices(eq);
    
    // Controlla se questa riga è già stata accettata
    if (acceptedSuggestions.includes(lineKey)) {
        return ''; // Non mostrare se già accettato
    }
    
    if (parsed.type === 'choice') {
        // È una scelta multipla (a), (b), (c)...
        const selectedOption = selectedChoices[lineKey];
        
        if (selectedOption) {
            // Una scelta è stata fatta, mostra solo quella come confermabile
            const selected = parsed.options.find(o => o.key === selectedOption);
            if (!selected) return '';
            
            // Controlla se è una scelta dinamica (es. "una qualsiasi arma semplice")
            const dynamicChoice = parseDynamicChoice(selected.text);
            
            if (dynamicChoice) {
                // È una scelta dinamica - mostra pulsante per aprire il selettore
                const filterJson = encodeURIComponent(JSON.stringify(dynamicChoice.filter));
                return `
                    <li class="suggested-item choice-selected dynamic-choice">
                        <span class="suggested-text">
                            <span class="dynamic-icon">${dynamicChoice.icon}</span>
                            ${escapeHtml(selected.text)}
                        </span>
                        <div class="choice-actions">
                            <button type="button" class="btn btn-sm btn-open-dynamic-selector" 
                                    data-suggestion-key="${lineKey}"
                                    data-suggestion-text="${escapeHtml(selected.text)}"
                                    data-filter="${filterJson}"
                                    data-quantity="${dynamicChoice.quantity}"
                                    data-category="${dynamicChoice.category}"
                                    data-source="${source}"
                                    title="Scegli dal database">🎯 Scegli</button>
                            <button type="button" class="btn btn-sm btn-reset-choice" 
                                    data-choice-key="${lineKey}"
                                    title="Cambia scelta">↩</button>
                        </div>
                    </li>
                `;
            }
            
            // Scelta normale - mostra pulsante conferma
            return `
                <li class="suggested-item choice-selected">
                    <span class="suggested-text">${escapeHtml(selected.text)}</span>
                    <div class="choice-actions">
                        <button type="button" class="btn btn-sm btn-add-suggested" 
                                data-suggestion-key="${lineKey}"
                                data-suggestion-text="${escapeHtml(selected.text)}"
                                data-source="${source}"
                                title="Conferma">✓</button>
                        <button type="button" class="btn btn-sm btn-reset-choice" 
                                data-choice-key="${lineKey}"
                                title="Cambia scelta">↩</button>
                    </div>
                </li>
            `;
        }
        
        // Mostra tutte le opzioni disponibili
        return `
            <li class="suggested-item choice-item">
                <div class="choice-label">Scegli una opzione:</div>
                ${parsed.options.map(opt => {
                    // Controlla se questa opzione è una scelta dinamica
                    const isDynamic = parseDynamicChoice(opt.text);
                    const dynamicClass = isDynamic ? 'has-dynamic-choice' : '';
                    const dynamicIcon = isDynamic ? `<span class="dynamic-hint" title="Scelta dal database">🎯</span>` : '';
                    
                    return `
                        <div class="choice-option ${dynamicClass}">
                            <span class="choice-key">(${opt.key})</span>
                            <span class="choice-text">${escapeHtml(opt.text)} ${dynamicIcon}</span>
                            <button type="button" class="btn btn-sm btn-select-choice" 
                                    data-choice-key="${lineKey}"
                                    data-choice-option="${opt.key}"
                                    data-choice-text="${escapeHtml(opt.text)}"
                                    data-source="${source}"
                                    title="Seleziona">${opt.key.toUpperCase()}</button>
                        </div>
                    `;
                }).join('')}
            </li>
        `;
    }
    
    // Tipo 'fixed': oggetti fissi (possono essere multipli)
    if (parsed.type === 'fixed' && parsed.items && parsed.items.length > 0) {
        // Controlla se uno degli oggetti è una scelta dinamica
        if (parsed.items.length === 1) {
            const dynamicChoice = parseDynamicChoice(parsed.items[0].name);
            if (dynamicChoice) {
                const filterJson = encodeURIComponent(JSON.stringify(dynamicChoice.filter));
                const displayText = dynamicChoice.displayText;
                return `
                    <li class="suggested-item fixed-item dynamic-choice">
                        <span class="suggested-text">
                            <span class="dynamic-icon">${dynamicChoice.icon}</span>
                            ${escapeHtml(displayText)}
                        </span>
                        <button type="button" class="btn btn-sm btn-open-dynamic-selector" 
                                data-suggestion-key="${lineKey}"
                                data-suggestion-text="${escapeHtml(displayText)}"
                                data-filter="${filterJson}"
                                data-quantity="${dynamicChoice.quantity}"
                                data-category="${dynamicChoice.category}"
                                data-source="${source}"
                                title="Scegli dal database">🎯 Scegli</button>
                    </li>
                `;
            }
        }
        
        // Se c'è un solo oggetto, mostra come singolo
        if (parsed.items.length === 1) {
            const item = parsed.items[0];
            const displayText = item.quantity > 1 ? `${item.quantity} ${item.name}` : item.name;
            return `
                <li class="suggested-item fixed-item">
                    <span class="suggested-text">${escapeHtml(displayText)}</span>
                    <button type="button" class="btn btn-sm btn-add-suggested" 
                            data-suggestion-key="${lineKey}"
                            data-suggestion-text="${escapeHtml(displayText)}"
                            data-source="${source}"
                            title="Aggiungi">+</button>
                </li>
            `;
        }
        
        // Più oggetti: mostra lista con pulsante per aggiungerli tutti
        const displayText = parsed.items.map(item => {
            return item.quantity > 1 ? `${item.quantity} ${item.name}` : item.name;
        }).join(', ');
        
        // Passa gli oggetti come JSON per il parsing lato controller
        const itemsJson = encodeURIComponent(JSON.stringify(parsed.items));
        
        return `
            <li class="suggested-item fixed-item multiple-items">
                <div class="fixed-items-list">
                    ${parsed.items.map(item => {
                        const itemText = item.quantity > 1 ? `${item.quantity} ${item.name}` : item.name;
                        return `<span class="fixed-item-name">${escapeHtml(itemText)}</span>`;
                    }).join('')}
                </div>
                <button type="button" class="btn btn-sm btn-add-suggested btn-add-all" 
                        data-suggestion-key="${lineKey}"
                        data-suggestion-text="${escapeHtml(displayText)}"
                        data-suggestion-items="${itemsJson}"
                        data-source="${source}"
                        title="Aggiungi tutto">+ tutto</button>
            </li>
        `;
    }
    
    // Fallback: mostra il testo originale
    return `
        <li class="suggested-item">
            <span class="suggested-text">${escapeHtml(eq)}</span>
            <button type="button" class="btn btn-sm btn-add-suggested" 
                    data-suggestion-key="${lineKey}"
                    data-suggestion-text="${escapeHtml(eq)}"
                    data-source="${source}"
                    title="Aggiungi">+</button>
        </li>
    `;
}

/**
 * Renderizza il modal per la selezione dinamica di oggetti
 * @param {Object} options - Opzioni per il modal
 * @param {string} options.suggestionKey - Chiave del suggerimento
 * @param {string} options.suggestionText - Testo del suggerimento
 * @param {Object} options.filter - Filtro per gli oggetti
 * @param {number} options.quantity - Numero di oggetti da selezionare
 * @param {string} options.category - Nome della categoria
 * @param {Array} options.items - Database degli oggetti
 * @param {string} options.source - Fonte (class/background)
 * @returns {string} - HTML del modal
 */
function renderDynamicSelectorModal(options) {
    const { suggestionKey, suggestionText, filter, quantity, category, items, source } = options;
    
    // Filtra gli oggetti dal database
    const filteredItems = filterItemsByCategory(items, filter);
    
    return `
        <div class="dynamic-selector-overlay" id="dynamic-selector-overlay">
            <div class="dynamic-selector-modal">
                <div class="dynamic-selector-header">
                    <h3>🎯 Seleziona ${quantity > 1 ? quantity + ' oggetti' : 'un oggetto'}</h3>
                    <p class="dynamic-selector-subtitle">${escapeHtml(suggestionText)}</p>
                    <span class="dynamic-selector-category">${escapeHtml(category)}</span>
                </div>
                
                <div class="dynamic-selector-search">
                    <input type="text" id="dynamic-search-input" placeholder="Cerca...">
                </div>
                
                <div class="dynamic-selector-info">
                    <span class="selected-count">Selezionati: <strong id="dynamic-selected-count">0</strong> / ${quantity}</span>
                </div>
                
                <div class="dynamic-selector-list" id="dynamic-items-list">
                    ${filteredItems.length === 0 
                        ? '<p class="no-items-found">Nessun oggetto trovato per questa categoria</p>'
                        : filteredItems.map(item => `
                            <div class="dynamic-item" 
                                 data-item-index="${item.index}"
                                 data-item-name="${escapeHtml(item.name)}">
                                <div class="dynamic-item-info">
                                    <span class="dynamic-item-icon">${getItemIcon(item)}</span>
                                    <span class="dynamic-item-name">${escapeHtml(item.name)}</span>
                                </div>
                                <div class="dynamic-item-details">
                                    <span class="dynamic-item-weight">${item.weight || 0} kg</span>
                                    <span class="dynamic-item-cost">${formatCost(item.cost)}</span>
                                </div>
                                <button type="button" class="btn btn-sm btn-toggle-dynamic-item"
                                        data-item-index="${item.index}"
                                        data-item-name="${escapeHtml(item.name)}"
                                        data-item-weight="${item.weight || 0}"
                                        data-item-cost='${JSON.stringify(item.cost || {quantity: 0, unit: 'mo'})}'>
                                    ☐
                                </button>
                            </div>
                        `).join('')
                    }
                </div>
                
                <div class="dynamic-selector-actions">
                    <button type="button" class="btn btn-secondary" id="btn-cancel-dynamic-selector">Annulla</button>
                    <button type="button" class="btn btn-primary" id="btn-confirm-dynamic-selection"
                            data-suggestion-key="${suggestionKey}"
                            data-suggestion-text="${escapeHtml(suggestionText)}"
                            data-quantity="${quantity}"
                            data-source="${source}"
                            disabled>
                        Conferma selezione
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderizza la lista dell'inventario corrente
 */
function renderInventoryList(inventory) {
    if (!inventory || inventory.length === 0) {
        return `
            <div class="inventory-empty">
                <p>🎒 L'inventario è vuoto</p>
                <p class="hint">Aggiungi oggetti dai suggerimenti o dal database</p>
            </div>
        `;
    }
    
    return `
        <table class="inventory-table">
            <thead>
                <tr>
                    <th>Oggetto</th>
                    <th>Q.tà</th>
                    <th>Peso</th>
                    <th>Costo</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${inventory.map((item, idx) => `
                    <tr class="inventory-row ${item.fromPack ? 'from-pack' : ''} ${item.custom ? 'custom-item' : ''}" data-index="${idx}">
                        <td class="item-name">
                            <span class="item-icon">${getItemIcon(item)}</span>
                            ${escapeHtml(item.name)}
                            ${item.fromPack ? '<span class="pack-badge">📦</span>' : ''}
                            ${item.custom ? '<span class="custom-badge">custom</span>' : ''}
                        </td>
                        <td class="item-qty">
                            <input type="number" class="qty-input" data-index="${idx}" 
                                   value="${item.quantity || 1}" min="1" max="999">
                        </td>
                        <td class="item-weight">${((item.weight || 0) * (item.quantity || 1)).toFixed(1)} kg</td>
                        <td class="item-cost">${formatCost(item.cost)}</td>
                        <td class="item-actions">
                            <button type="button" class="btn-icon-sm btn-remove-item" 
                                    data-index="${idx}" title="Rimuovi">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

/**
 * Renderizza i filtri e la ricerca oggetti
 */
function renderItemSearch(itemDatabase, activeCategory = 'all', searchTerm = '') {
    let filteredItems = [...itemDatabase];
    
    if (activeCategory !== 'all') {
        filteredItems = filteredItems.filter(item => 
            item.equipment_category?.index === activeCategory
        );
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredItems = filteredItems.filter(item => 
            item.name?.toLowerCase().includes(term)
        );
    }
    
    filteredItems = filteredItems.slice(0, 50);
    
    return `
        <div class="item-search-section">
            <div class="item-filters">
                <button type="button" class="filter-btn ${activeCategory === 'all' ? 'active' : ''}" 
                        data-category="all">Tutti</button>
                ${Object.entries(EQUIPMENT_CATEGORIES).map(([key, cat]) => `
                    <button type="button" class="filter-btn ${activeCategory === key ? 'active' : ''}" 
                            data-category="${key}">
                        ${cat.icon} ${cat.name}
                    </button>
                `).join('')}
            </div>
            
            <div class="item-search-box">
                <input type="text" id="item-search-input" placeholder="Cerca oggetto..." 
                       value="${escapeHtml(searchTerm)}">
            </div>
            
            <div class="item-results">
                ${filteredItems.length === 0 
                    ? '<p class="no-results">Nessun oggetto trovato</p>'
                    : filteredItems.map(item => `
                        <div class="item-result-row" data-item-index="${item.index}">
                            <span class="item-icon">${getItemIcon(item)}</span>
                            <span class="item-name">${escapeHtml(item.name)}</span>
                            <span class="item-weight">${item.weight || 0} kg</span>
                            <span class="item-cost">${formatCost(item.cost)}</span>
                            <button type="button" class="btn btn-sm btn-add-item" 
                                    data-item-index="${item.index}" title="Aggiungi">+</button>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;
}

/**
 * Renderizza il form per aggiungere oggetti personalizzati
 */
function renderCustomItemForm() {
    return `
        <div class="custom-item-section">
            <h4>✏️ Aggiungi Oggetto Personalizzato</h4>
            <div class="custom-item-form">
                <input type="text" id="custom-item-name" placeholder="Nome oggetto" class="form-control">
                <input type="number" id="custom-item-qty" placeholder="Q.tà" value="1" min="1" class="form-control qty-input">
                <input type="number" id="custom-item-weight" placeholder="Peso (kg)" value="0" min="0" step="0.5" class="form-control">
                <input type="text" id="custom-item-cost" placeholder="Costo (es. 10 mo)" class="form-control">
                <button type="button" id="btn-add-custom-item" class="btn btn-primary btn-sm">Aggiungi</button>
            </div>
        </div>
    `;
}

/**
 * Renderizza lo Step 5: Inventario
 * @param {Object} pgData - Dati del personaggio
 * @param {Object} databases - Database con items, classe, background, etc.
 * @returns {string} HTML dello step
 */
export function renderStep5Inventory(pgData, databases) {
    const inventory = pgData.inventory || [];
    const itemDatabase = databases.items || [];
    const activeCategory = pgData._itemCategory || 'all';
    const searchTerm = pgData._itemSearch || '';
    
    return `
        <div class="wizard-form inventory-step">
            <div class="inventory-layout">
                <!-- Colonna sinistra: Inventario corrente -->
                <div class="inventory-current">
                    <h3>🎒 Il Tuo Inventario</h3>
                    
                    ${renderInventorySummary(inventory)}
                    ${renderInventoryList(inventory)}
                    ${renderCustomItemForm()}
                </div>
                
                <!-- Colonna destra: Suggerimenti e Database -->
                <div class="inventory-add">
                    <h3>➕ Aggiungi Oggetti</h3>
                    
                    <!-- Suggerimenti da classe e background -->
                    ${renderSuggestedEquipment(pgData, databases)}
                    
                    <!-- Ricerca nel database -->
                    <div class="database-search-section">
                        <h4>📚 Database Oggetti</h4>
                        ${renderItemSearch(itemDatabase, activeCategory, searchTerm)}
                    </div>
                </div>
            </div>
            
            <!-- Monete -->
            <div class="coins-section">
                <h4>💰 Monete</h4>
                <div class="coins-inputs">
                    <label>
                        <span>mo</span>
                        <input type="number" id="coins-gold" value="${pgData.treasure?.gp || 0}" min="0">
                    </label>
                    <label>
                        <span>ma</span>
                        <input type="number" id="coins-silver" value="${pgData.treasure?.sp || 0}" min="0">
                    </label>
                    <label>
                        <span>mr</span>
                        <input type="number" id="coins-copper" value="${pgData.treasure?.cp || 0}" min="0">
                    </label>
                </div>
            </div>
        </div>
    `;
}

console.log('🎒 [PgStep5Inventory] Modulo caricato v2.0');
