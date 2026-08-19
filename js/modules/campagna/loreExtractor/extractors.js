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
 * Pulisce un nome rimuovendo preposizioni iniziali e spazi.
 */
function cleanName(name) {
    if (!name) return '';
    let cleaned = name.trim();
    // Rimuovi preposizioni iniziali (del, della, dei, ecc.)
    const firstWord = cleaned.split(/\s+/)[0]?.toLowerCase();
    if (ARTICLE_PREPOSITIONS.includes(firstWord)) {
        cleaned = cleaned.substring(cleaned.indexOf(' ') + 1);
    }
    return cleaned.trim();
}

/**
 * Estrae PNG dal testo.
 * Cerca pattern "ruolo + nome proprio" e "nome proprio + razza".
 */
export function extractNpcs(text) {
    const npcs = [];
    const seen = new Set();
    
    // Pattern 1: ruolo + nome proprio (es. "re Aldric", "mago Elaria")
    const roleNamePattern = NAME_PATTERNS.ROLE_NAME;
    let match;
    while ((match = roleNamePattern.exec(text)) !== null) {
        const role = match[1].toLowerCase();
        const name = cleanName(match[2]);
        if (name && !seen.has(name.toLowerCase())) {
            seen.add(name.toLowerCase());
            npcs.push({
                type: 'npc',
                name: name,
                role: ROLES[role] || role.charAt(0).toUpperCase() + role.slice(1),
                race: null,
                faction: null,
                location: null,
                description: extractContext(text, match.index, 100),
                confidence: 0.9,
            });
        }
    }
    
    // Pattern 2: nome proprio + razza nota (es. "Aldric, un umano", "Elaria è un'elfa")
    for (const [raceKey, raceValue] of Object.entries(RACES)) {
        // Pattern: Nome, un/una <razza>
        const racePattern = new RegExp(`\\b([A-ZÀ-Ý][a-zà-ÿ]+(?:\\s+[A-ZÀ-Ý][a-zà-ÿ]+)?)\\s*,?\\s*(?:è\\s+)?(?:un|una|uno|un')\\s+${raceKey}\\b`, 'gi');
        let raceMatch;
        while ((raceMatch = racePattern.exec(text)) !== null) {
            const name = cleanName(raceMatch[1]);
            if (name && !seen.has(name.toLowerCase())) {
                seen.add(name.toLowerCase());
                npcs.push({
                    type: 'npc',
                    name: name,
                    role: null,
                    race: raceValue,
                    faction: null,
                    location: null,
                    description: extractContext(text, raceMatch.index, 100),
                    confidence: 0.8,
                });
            } else if (name) {
                // Aggiorna la razza se già trovato
                const existing = npcs.find(n => n.name.toLowerCase() === name.toLowerCase());
                if (existing && !existing.race) {
                    existing.race = raceValue;
                }
            }
        }
    }
    
    // Pattern 3: nomi propri isolati con maiuscola (solo se menzionati 2+ volte)
    // per ridurre i falsi positivi
    const capitalizedMatches = text.matchAll(NAME_PATTERNS.CAPITALIZED_WORD);
    const nameCounts = {};
    for (const m of capitalizedMatches) {
        const word = m[1];
        if (word && !NAME_PATTERNS.STOPWORDS.has(word.toLowerCase()) && word.length >= 3) {
            nameCounts[word] = (nameCounts[word] || 0) + 1;
        }
    }
    
    // Aggiungi nomi menzionati 2+ volte che non sono già stati estratti
    for (const [name, count] of Object.entries(nameCounts)) {
        if (count >= 2 && !seen.has(name.toLowerCase())) {
            // Verifica che non sia un tipo di luogo/fazione/item
            const lower = name.toLowerCase();
            if (!LOCATION_TYPES[lower] && !FACTION_TYPES[lower] && !ITEM_TYPES[lower] && !ROLES[lower]) {
                seen.add(name.toLowerCase());
                npcs.push({
                    type: 'npc',
                    name: name,
                    role: null,
                    race: null,
                    faction: null,
                    location: null,
                    description: extractContext(text, text.indexOf(name), 100),
                    confidence: 0.5, // Più basso perché è un'euristica
                });
            }
        }
    }
    
    return npcs;
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
