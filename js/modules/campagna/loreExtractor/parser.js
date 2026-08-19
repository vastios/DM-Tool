// parser.js
// ─────────────────────────────────────────────────────────────
// Orchestratore del parsing: coordina i 5 estrattori e ritorna
// un risultato unificato con tutte le entità trovate.

import { extractNpcs, extractFactions, extractLocations, extractItems, extractEvents } from './extractors.js';

/**
 * Esegue il parsing completo del testo e ritorna tutte le entità trovate.
 * 
 * @param {string} text - Il testo libero da analizzare
 * @returns {Object} Risultato con 5 array: npcs, factions, locations, items, events
 */
export function parseLore(text) {
    if (!text || text.trim().length === 0) {
        return {
            npcs: [],
            factions: [],
            locations: [],
            items: [],
            events: [],
            stats: {
                totalEntities: 0,
                textLength: 0,
                parseTime: 0,
            }
        };
    }
    
    const startTime = performance.now();
    
    // Esegui i 5 estrattori
    const npcs = extractNpcs(text);
    const factions = extractFactions(text);
    const locations = extractLocations(text);
    const items = extractItems(text);
    const events = extractEvents(text);
    
    const endTime = performance.now();
    
    // --- Cross-linking: cerca collegamenti tra entità ---
    crossLinkEntities({ npcs, factions, locations });
    
    const totalEntities = npcs.length + factions.length + locations.length + items.length + events.length;
    
    return {
        npcs,
        factions,
        locations,
        items,
        events,
        stats: {
            totalEntities,
            textLength: text.length,
            parseTime: Math.round(endTime - startTime),
        }
    };
}

/**
 * Cross-linking: cerca collegamenti tra entità.
 * - Se un PNG menziona una fazione nota, collega
 * - Se un PNG menziona un luogo noto, collega
 * - Se una fazione menziona un luogo, collega come headquarters
 */
function crossLinkEntities({ npcs, factions, locations }) {
    // Crea mappe per lookup veloce
    const factionMap = new Map();
    factions.forEach(f => {
        factionMap.set(f.name.toLowerCase(), f);
    });
    
    const locationMap = new Map();
    locations.forEach(l => {
        locationMap.set(l.name.toLowerCase(), l);
    });
    
    // Per ogni PNG, cerca menzioni di fazioni/luoghi nella sua descrizione
    npcs.forEach(npc => {
        if (!npc.description) return;
        const descLower = npc.description.toLowerCase();
        
        // Cerca fazione
        for (const [factionName, faction] of factionMap) {
            if (descLower.includes(factionName)) {
                npc.faction = faction.name;
                break;
            }
        }
        
        // Cerca luogo
        for (const [locationName, location] of locationMap) {
            if (descLower.includes(locationName)) {
                npc.location = location.name;
                break;
            }
        }
    });
    
    // Per ogni fazione, cerca menzioni di luoghi (potenziale HQ)
    factions.forEach(faction => {
        if (!faction.description) return;
        const descLower = faction.description.toLowerCase();
        
        for (const [locationName, location] of locationMap) {
            if (descLower.includes(locationName)) {
                faction.headquarters = location.name;
                break;
            }
        }
    });
}

console.log('🔍 [LoreExtractor] Parser caricato.');
