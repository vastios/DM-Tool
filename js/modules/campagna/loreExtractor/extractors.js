// extractors.js
// ─────────────────────────────────────────────────────────────
// 5 estrattori per il Lore Extractor.
// Ognuno ritorna un array di entità estratte dal testo.

import {
    RACES, ROLES, FACTION_TYPES, LOCATION_TYPES,
    ITEM_TYPES, ITEM_RARITIES, EVENT_KEYWORDS,
    NAME_PATTERNS, FACTION_PATTERNS, LOCATION_PATTERNS, ITEM_PATTERNS,
    ARTICLE_PREPOSITIONS
} from './dictionaries.js';

/**
 * Verbo/aggettivo stopwords da escludere dai nomi propri.
 * Queste parole non dovrebbero mai essere parte di un nome proprio.
 */
const NAME_STOPWORDS_EXTRA = new Set([
    'governa', 'governo', 'guida', 'guida', 'comanda', 'comandò',
    'vive', 'viveva', 'abita', 'abitava', 'risiede', 'risiedeva',
    'impugnò', 'impugna', 'brandì', 'brandisce',
    'indossava', 'indossa', 'porta', 'portava',
    'è', 'era', 'fu', 'sarà', 'stato', 'stata',
    'ha', 'aveva', 'ebbe', 'avrà',
    'dice', 'disse', 'parla', 'parlò',
    'morte', 'morta', 'morto',
    'potente', 'forte', 'saggio', 'saggia', 'giovane', 'vecchio', 'vecchia',
    'grande', 'piccolo', 'piccola',
    'buono', 'buona', 'cattivo', 'cattiva',
    'nero', 'nera', 'bianco', 'bianca', 'rosso', 'rossa',
    'primo', 'prima', 'ultimo', 'ultima',
    'magica', 'magico', 'leggendario', 'leggendaria',
    'antico', 'antica', 'sacro', 'sacra',
    'reale', 'regale', 'nobile',
    'segreto', 'segreta',
    'nuovo', 'nuova',
    'bel', 'bella', 'bello',
    'brutto', 'brutta',
    'felice', 'triste', 'arrabbiato', 'arrabbiata',
    'stanco', 'stanca',
    'malato', 'malata',
    'ferito', 'ferita',
    'morto', 'morta',
    'vivo', 'viva',
    'solo', 'sola',
    'insieme',
    'poi', 'quindi', 'dopo', 'prima',
    'mentre', 'quando',
    'perché', 'poiché', 'dato',
    'anche', 'ancora',
    'sì', 'no',
    'questo', 'questa', 'quello', 'quella',
    'suo', 'sua', 'loro', 'mio', 'mia', 'tuo', 'tua',
    'tutti', 'tutte', 'tutto', 'tutta',
    'ogni', 'alcuni', 'alcune',
    'molto', 'molta', 'poco', 'poca',
    'tanto', 'tanta',
    'altro', 'altra',
    'stesso', 'stessa',
    'così', 'comunque',
    'forse', 'certo',
    'oggi', 'domani', 'ieri',
    'adesso', 'ora', 'allora',
]);

/**
 * Pulisce un nome rimuovendo preposizioni iniziali.
 * NON rimuove parole maiuscole finali perché potrebbero fare parte di nomi
 * composti (es. "Fango Nero", "Castello Veliero", "Acque Rosse").
 * @param {string} name - Il nome grezzo estratto
 * @returns {string} Il nome pulito
 */
function cleanName(name) {
    if (!name) return '';
    let cleaned = name.trim();
    
    // Rimuovi preposizioni iniziali (del, della, dei, ecc.)
    const firstWord = cleaned.split(/\s+/)[0]?.toLowerCase();
    if (ARTICLE_PREPOSITIONS.includes(firstWord)) {
        cleaned = cleaned.substring(cleaned.indexOf(' ') + 1);
    }
    
    // Rimuovi solo parole finali che NON iniziano con maiuscola
    // (verbi, aggettivi lowercase, ecc.)
    // Le parole maiuscole vengono mantenute (potrebbero essere nomi composti)
    const words = cleaned.split(/\s+/);
    while (words.length > 1) {
        const lastWord = words[words.length - 1];
        const lastWordLower = lastWord.toLowerCase();
        // Se l'ultima parola non inizia con maiuscola, è probabilmente un verbo/aggettivo
        if (!/^[A-ZÀ-Ý]/.test(lastWord)) {
            words.pop();
        } else {
            break;
        }
    }
    
    return words.join(' ').trim();
}

/**
 * Verifica se una parola è probabilmente un nome proprio valido.
 * @param {string} word - La parola da verificare
 * @returns {boolean} true se è un nome proprio valido
 */
function isValidName(word) {
    if (!word || word.length < 2) return false;
    const lower = word.toLowerCase();
    
    // Non deve essere una stopword
    if (NAME_PATTERNS.STOPWORDS.has(lower)) return false;
    if (NAME_STOPWORDS_EXTRA.has(lower)) return false;
    
    // Non deve essere un ruolo
    if (ROLES[lower]) return false;
    
    // Non deve essere una razza
    if (RACES[lower]) return false;
    
    // Non deve essere un tipo di luogo/fazione/item
    if (LOCATION_TYPES[lower]) return false;
    if (FACTION_TYPES[lower]) return false;
    if (ITEM_TYPES[lower]) return false;
    
    // Deve iniziare con maiuscola
    if (!/^[A-ZÀ-Ý]/.test(word)) return false;
    
    return true;
}

/**
 * Estrae PNG dal testo.
 * Cerca pattern "ruolo + nome proprio", "nome proprio + razza", "razza + nome proprio".
 */
export function extractNpcs(text) {
    const npcs = [];
    const seen = new Map(); // key: lowercase name, value: npc object
    
    /**
     * Aggiunge o aggiorna un NPC.
     * Se esiste già con lo stesso nome (case-insensitive), fa merge dei dati.
     */
    function addOrUpdateNpc(name, data) {
        const cleanedName = cleanName(name);
        if (!cleanedName || !isValidName(cleanedName)) return;
        
        const key = cleanedName.toLowerCase();
        
        if (seen.has(key)) {
            // Merge: aggiorna campi mancanti
            const existing = seen.get(key);
            // Se il nuovo nome è più pulito (più corto o senza parole extra), usa quello
            if (cleanedName.length < existing.name.length) {
                existing.name = cleanedName;
            }
            if (data.role && !existing.role) existing.role = data.role;
            if (data.race && !existing.race) existing.race = data.race;
            if (data.confidence > existing.confidence) existing.confidence = data.confidence;
            // Mantieni la descrizione più lunga
            if (data.description && (!existing.description || data.description.length > existing.description.length)) {
                existing.description = data.description;
            }
        } else {
            seen.set(key, {
                type: 'npc',
                name: cleanedName,
                role: data.role || null,
                race: data.race || null,
                faction: null,
                location: null,
                description: data.description || null,
                confidence: data.confidence || 0.5,
            });
        }
    }
    
    // --- Pattern 1: ruolo + nome proprio (es. "re Aldric", "mago Elaria") ---
    // Costruiamo il pattern dinamicamente dai ruoli noti.
    // Usiamo flag 'i' per il ruolo (può essere a inizio frase maiuscolo),
    // ma validiamo il nome separatamente con isValidName() per assicurarci
    // che inizi con maiuscola e non sia una stopword/ruolo/razza/tipo.
    const roleNames = Object.keys(ROLES);
    const rolePatternStr = roleNames.map(r => r.replace(/\s+/g, '\\s+')).join('|');
    const combinedPattern = new RegExp(
        `\\b(${rolePatternStr})\\s+([A-ZÀ-Ý][a-zà-ÿ]+(?:\\s+[A-ZÀ-Ý][a-zà-ÿ]+)?)`,
        'gi' // flag 'i' ok perché il nome viene validato da isValidName()
    );
    
    let match;
    while ((match = combinedPattern.exec(text)) !== null) {
        const role = match[1].toLowerCase();
        const rawName = match[2];
        // Verifica che la prima parola del nome sia valida (non sia un ruolo/razza/tipo)
        const firstNameWord = rawName.split(/\s+/)[0];
        if (isValidName(firstNameWord)) {
            addOrUpdateNpc(rawName, {
                role: ROLES[role] || role.charAt(0).toUpperCase() + role.slice(1),
                description: extractContext(text, match.index, 100),
                confidence: 0.9,
            });
        }
    }
    
    // --- Pattern 1b: ruolo + preposizione/articolo + nome proprio ---
    // es. "capo dei goblin Grishnak" → ruolo=capo, nome=Grishnak
    // (il pattern 1 non matcha perché tra "capo" e "Grishnak" ci sono "dei goblin")
    const combinedPatternWithGap = new RegExp(
        `\\b(${rolePatternStr})\\s+(?:dei|delle|degli|del|della|di|da|de|dei|degli|delle|del|della|di)\\s+(?:[a-zà-ÿ]+\\s+)?([A-ZÀ-Ý][a-zà-ÿ]+)`,
        'gi'
    );
    
    let matchGap;
    while ((matchGap = combinedPatternWithGap.exec(text)) !== null) {
        const role = matchGap[1].toLowerCase();
        const rawName = matchGap[2];
        if (isValidName(rawName)) {
            // Cerca di estrarre la razza dalla parola tra preposizione e nome
            const middleWord = matchGap[0].match(/(?:dei|delle|degli|del|della|di|da)\s+([a-zà-ÿ]+)\s+/i);
            let race = null;
            if (middleWord) {
                const potentialRace = middleWord[1].toLowerCase();
                if (RACES[potentialRace]) {
                    race = RACES[potentialRace];
                }
            }
            addOrUpdateNpc(rawName, {
                role: ROLES[role] || role.charAt(0).toUpperCase() + role.slice(1),
                race: race,
                description: extractContext(text, matchGap.index, 100),
                confidence: 0.88,
            });
        }
    }
    
    // --- Pattern 2: nome proprio + razza nota (es. "Aldric, un umano", "Elaria è un'elfa") ---
    for (const [raceKey, raceValue] of Object.entries(RACES)) {
        const racePattern = new RegExp(
            `\\b([A-ZÀ-Ý][a-zà-ÿ]+)\\s*,?\\s*(?:è\\s+)?(?:un|una|uno|un')\\s+${raceKey}\\b`,
            'gi'
        );
        let raceMatch;
        while ((raceMatch = racePattern.exec(text)) !== null) {
            const name = raceMatch[1];
            if (isValidName(name)) {
                addOrUpdateNpc(name, {
                    race: raceValue,
                    description: extractContext(text, raceMatch.index, 100),
                    confidence: 0.85,
                });
            }
        }
    }
    
    // --- Pattern 3: razza + nome proprio (es. "l'orco Grom", "il nano Thordin") ---
    for (const [raceKey, raceValue] of Object.entries(RACES)) {
        // Pattern: (l'|il|la|lo|un|una) <razza> <Nome>
        const raceBeforePattern = new RegExp(
            `\\b(?:l'|il|la|lo|un|una|uno|un')\\s*${raceKey}\\s+([A-ZÀ-Ý][a-zà-ÿ]+)`,
            'gi'
        );
        let raceBeforeMatch;
        while ((raceBeforeMatch = raceBeforePattern.exec(text)) !== null) {
            const name = raceBeforeMatch[1];
            if (isValidName(name)) {
                addOrUpdateNpc(name, {
                    race: raceValue,
                    description: extractContext(text, raceBeforeMatch.index, 100),
                    confidence: 0.85,
                });
            }
        }
    }
    
    // --- Pattern 4: nomi propri isolati con maiuscola (solo se menzionati 2+ volte) ---
    const capitalizedMatches = text.matchAll(NAME_PATTERNS.CAPITALIZED_WORD);
    const nameCounts = {};
    for (const m of capitalizedMatches) {
        const word = m[1];
        if (isValidName(word) && word.length >= 3) {
            nameCounts[word] = (nameCounts[word] || 0) + 1;
        }
    }
    
    // Aggiungi nomi menzionati 2+ volte che non sono già stati estratti
    for (const [name, count] of Object.entries(nameCounts)) {
        if (count >= 2 && !seen.has(name.toLowerCase())) {
            addOrUpdateNpc(name, {
                description: extractContext(text, text.indexOf(name), 100),
                confidence: 0.5,
            });
        }
    }
    
    return Array.from(seen.values());
}

/**
 * Estrae fazioni dal testo.
 */
export function extractFactions(text) {
    const factions = [];
    const seen = new Set();
    
    for (const pattern of FACTION_PATTERNS) {
        const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
        let match;
        while ((match = regex.exec(text)) !== null) {
            const typeRaw = match[pattern.typeGroup].toLowerCase();
            const name = cleanName(match[pattern.nameGroup]);
            const type = FACTION_TYPES[typeRaw] || typeRaw.charAt(0).toUpperCase() + typeRaw.slice(1);
            
            if (name && !seen.has(name.toLowerCase())) {
                seen.add(name.toLowerCase());
                factions.push({
                    type: 'faction',
                    name: name,
                    factionType: type,
                    description: extractContext(text, match.index, 100),
                    leader: null,
                    headquarters: null,
                    confidence: 0.85,
                });
            }
        }
    }
    
    return factions;
}

/**
 * Estrae luoghi dal testo.
 */
export function extractLocations(text) {
    const locations = [];
    const seen = new Set();
    
    for (const pattern of LOCATION_PATTERNS) {
        const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
        let match;
        while ((match = regex.exec(text)) !== null) {
            const typeRaw = match[pattern.typeGroup].toLowerCase();
            const name = cleanName(match[pattern.nameGroup]);
            const type = LOCATION_TYPES[typeRaw] || typeRaw.charAt(0).toUpperCase() + typeRaw.slice(1);
            
            if (name && !seen.has(name.toLowerCase())) {
                seen.add(name.toLowerCase());
                locations.push({
                    type: 'location',
                    name: name,
                    locationType: type,
                    description: extractContext(text, match.index, 100),
                    parentLocation: null,
                    confidence: 0.85,
                });
            }
        }
    }
    
    return locations;
}

/**
 * Estrae item dal testo.
 */
export function extractItems(text) {
    const items = [];
    const seen = new Set();
    
    for (const pattern of ITEM_PATTERNS) {
        const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
        let match;
        while ((match = regex.exec(text)) !== null) {
            const typeRaw = match[pattern.typeGroup].toLowerCase();
            const name = cleanName(match[pattern.nameGroup]);
            const itemType = ITEM_TYPES[typeRaw] || 'Oggetto';
            
            if (name && !seen.has(name.toLowerCase())) {
                seen.add(name.toLowerCase());
                
                // Cerca rarità nel contesto vicino
                const context = extractContext(text, match.index, 200);
                let rarity = 'Non Comune';
                for (const [rarityKey, rarityValue] of Object.entries(ITEM_RARITIES)) {
                    if (context.toLowerCase().includes(rarityKey)) {
                        rarity = rarityValue;
                        break;
                    }
                }
                
                items.push({
                    type: 'item',
                    name: name,
                    itemType: itemType,
                    rarity: rarity,
                    description: extractContext(text, match.index, 100),
                    confidence: 0.8,
                });
            }
        }
    }
    
    return items;
}

/**
 * Estrae eventi narrativi dal testo.
 */
export function extractEvents(text) {
    const events = [];
    const seen = new Set();
    
    // Pattern: parola chiave evento + nome proprio
    for (const keyword of EVENT_KEYWORDS) {
        const pattern = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\s+(?:dei|delle|degli|del|della|di|da)?\\s*([A-ZÀ-Ý][a-zà-ÿ]+(?:\\s+[A-ZÀ-Ý][a-zà-ÿ]+)?)`, 'gi');
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const name = cleanName(match[1]);
            const eventTitle = `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} di ${name}`;
            
            if (name && !seen.has(eventTitle.toLowerCase())) {
                seen.add(eventTitle.toLowerCase());
                events.push({
                    type: 'event',
                    name: eventTitle,
                    eventType: keyword,
                    target: name,
                    description: extractContext(text, match.index, 150),
                    confidence: 0.7,
                });
            }
        }
    }
    
    // Pattern: "durante la/il X" dove X è un nome proprio
    const duringPattern = /\bdurante\s+(?:la|il|lo|l')\s+([A-ZÀ-Ý][a-zà-ÿ]+(?:\s+[A-ZÀ-Ý][a-zà-ÿ]+)?)/g;
    let duringMatch;
    while ((duringMatch = duringPattern.exec(text)) !== null) {
        const name = cleanName(duringMatch[1]);
        const eventTitle = name;
        if (name && !seen.has(eventTitle.toLowerCase())) {
            seen.add(eventTitle.toLowerCase());
            events.push({
                type: 'event',
                name: eventTitle,
                eventType: 'evento storico',
                target: null,
                description: extractContext(text, duringMatch.index, 150),
                confidence: 0.6,
            });
        }
    }
    
    return events;
}

/**
 * Estrae il contesto attorno a una posizione nel testo.
 * @param {string} text - Il testo completo
 * @param {number} index - L'indice del match
 * @param {number} radius - Numero di caratteri prima e dopo
 * @returns {string} Contesto estratto con "..." se troncato
 */
function extractContext(text, index, radius = 100) {
    if (!text || index < 0) return '';
    const start = Math.max(0, index - radius);
    const end = Math.min(text.length, index + radius);
    let context = text.substring(start, end);
    if (start > 0) context = '...' + context;
    if (end < text.length) context = context + '...';
    // Pulisci whitespace
    return context.replace(/\s+/g, ' ').trim();
}

export { extractContext };
