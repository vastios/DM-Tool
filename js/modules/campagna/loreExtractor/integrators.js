// integrators.js
// ─────────────────────────────────────────────────────────────
// Salvataggio delle entità estratte nei moduli esistenti:
// - npcManager (PNG)
// - factionManager (Fazioni)
// - locationManager (Luoghi)
// - uniqueItemManager (Oggetti)
// - sessionPlanner (Eventi → Sessioni)

import { getCurrentCampaignId } from '../../../../stateManager.js';

// --- STORAGE KEYS (replicano il pattern dei moduli esistenti) ---

function getNpcStorageKey() {
    const campaignId = getCurrentCampaignId();
    return campaignId ? `dungeonMasterToolNpcs_${campaignId}` : null;
}

function getFactionStorageKey() {
    const campaignId = getCurrentCampaignId();
    return campaignId ? `dungeonMasterToolFactions_${campaignId}` : null;
}

function getLocationStorageKey() {
    const campaignId = getCurrentCampaignId();
    return campaignId ? `dungeonMasterToolLocations_${campaignId}` : null;
}

function getUniqueItemStorageKey() {
    const campaignId = getCurrentCampaignId();
    return campaignId ? `dungeonMasterToolUniqueItems_${campaignId}` : null;
}

function getSessionPlanStorageKey() {
    const campaignId = getCurrentCampaignId();
    return campaignId ? `dungeonMasterToolSessionPlans_${campaignId}` : null;
}

// --- HELPERS GENERICI ---

function loadEntities(key) {
    if (!key) return [];
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Errore caricamento entità:', e);
        return [];
    }
}

function saveEntities(key, entities) {
    if (!key) return false;
    try {
        localStorage.setItem(key, JSON.stringify(entities));
        return true;
    } catch (e) {
        console.error('Errore salvataggio entità:', e);
        return false;
    }
}

// --- INTEGRATORI ---

/**
 * Salva i PNG nel npcManager.
 * @param {Array} npcs - Array di PNG estratti (dal parser)
 * @returns {Object} { saved: number, skipped: number, errors: string[] }
 */
export function integrateNpcs(npcs) {
    const result = { saved: 0, skipped: 0, errors: [] };
    if (!npcs || npcs.length === 0) return result;
    
    const key = getNpcStorageKey();
    if (!key) {
        result.errors.push('Nessuna campagna attiva');
        return result;
    }
    
    const existing = loadEntities(key);
    const existingNames = new Set(existing.map(n => (n.name || '').toLowerCase()));
    
    npcs.forEach(npc => {
        if (!npc.name) {
            result.skipped++;
            return;
        }
        if (existingNames.has(npc.name.toLowerCase())) {
            result.skipped++;
            return;
        }
        
        const now = Date.now();
        const newNpc = {
            id: `npc_${now}_${Math.random().toString(36).substr(2, 9)}`,
            name: npc.name,
            tag: 'neutrale',
            race: npc.race || '',
            className: '',
            classLevel: 1,
            role: npc.role || '',
            alignment: '',
            abilities: { for: 10, des: 10, cos: 10, int: 10, sag: 10, car: 10 },
            profBonus: 2,
            hp: 10,
            ac: 10,
            speed: 9,
            savingThrows: [],
            hitDie: 8,
            appearance: '',
            personality: '',
            location: npc.location || '',
            faction: npc.faction || '',
            relazioni: '',
            secretNote: '',
            inventory: [],
            specialItems: [],
            spells: {
                cantrips: [], spells: [], byLevel: {},
                dc: 10, attackBonus: 2, ability: 'int'
            },
            features: [],
            racialTraits: [],
            personalityTraits: [],
            notes: `Estratto da Lore Extractor.\n\n${npc.description || ''}`,
            createdAt: now,
            lastModified: now,
        };
        
        existing.push(newNpc);
        existingNames.add(npc.name.toLowerCase());
        result.saved++;
    });
    
    if (!saveEntities(key, existing)) {
        result.errors.push('Errore salvataggio');
    }
    
    return result;
}

/**
 * Salva le fazioni nel factionManager.
 */
export function integrateFactions(factions) {
    const result = { saved: 0, skipped: 0, errors: [] };
    if (!factions || factions.length === 0) return result;
    
    const key = getFactionStorageKey();
    if (!key) {
        result.errors.push('Nessuna campagna attiva');
        return result;
    }
    
    const existing = loadEntities(key);
    const existingNames = new Set(existing.map(f => (f.name || '').toLowerCase()));
    
    factions.forEach(faction => {
        if (!faction.name) {
            result.skipped++;
            return;
        }
        if (existingNames.has(faction.name.toLowerCase())) {
            result.skipped++;
            return;
        }
        
        const now = Date.now();
        const newFaction = {
            id: now.toString() + Math.random().toString(36).substr(2, 5),
            name: faction.name,
            status: 'Active',
            description: faction.description || '',
            members: '',
            allies: '',
            enemies: '',
            secrets: '',
            leader: faction.leader || '',
            headquarters: faction.headquarters || '',
            lastModified: now,
        };
        
        existing.push(newFaction);
        existingNames.add(faction.name.toLowerCase());
        result.saved++;
    });
    
    if (!saveEntities(key, existing)) {
        result.errors.push('Errore salvataggio');
    }
    
    return result;
}

/**
 * Salva i luoghi nel locationManager.
 */
export function integrateLocations(locations) {
    const result = { saved: 0, skipped: 0, errors: [] };
    if (!locations || locations.length === 0) return result;
    
    const key = getLocationStorageKey();
    if (!key) {
        result.errors.push('Nessuna campagna attiva');
        return result;
    }
    
    const existing = loadEntities(key);
    const existingNames = new Set(existing.map(l => (l.name || '').toLowerCase()));
    
    locations.forEach(location => {
        if (!location.name) {
            result.skipped++;
            return;
        }
        if (existingNames.has(location.name.toLowerCase())) {
            result.skipped++;
            return;
        }
        
        const now = Date.now();
        const newLocation = {
            id: now.toString() + Math.random().toString(36).substr(2, 5),
            name: location.name,
            type: location.locationType || 'Luogo',
            parentId: null,
            description: location.description || '',
            imageUrl: '',
            inhabitants: '',
            pointsofinterest: '',
            secrets: '',
            tags: [],
            linkedNpcs: [],
            linkedFactions: [],
            lastModified: now,
        };
        
        existing.push(newLocation);
        existingNames.add(location.name.toLowerCase());
        result.saved++;
    });
    
    if (!saveEntities(key, existing)) {
        result.errors.push('Errore salvataggio');
    }
    
    return result;
}

/**
 * Salva gli item nel uniqueItemManager.
 */
export function integrateItems(items) {
    const result = { saved: 0, skipped: 0, errors: [] };
    if (!items || items.length === 0) return result;
    
    const key = getUniqueItemStorageKey();
    if (!key) {
        result.errors.push('Nessuna campagna attiva');
        return result;
    }
    
    const existing = loadEntities(key);
    const existingNames = new Set(existing.map(i => (i.name || '').toLowerCase()));
    
    items.forEach(item => {
        if (!item.name) {
            result.skipped++;
            return;
        }
        if (existingNames.has(item.name.toLowerCase())) {
            result.skipped++;
            return;
        }
        
        const now = Date.now();
        const newItem = {
            id: now.toString() + Math.random().toString(36).substr(2, 5),
            name: item.name,
            category: 'Oggetto di Scena',
            type: item.itemType || '',
            lastModified: now,
            currentOwner: '',
            location: '',
            requiresAttunement: false,
            isAttuned: false,
            description: item.description || '',
            properties: '',
            history: '',
            rarity: item.rarity || 'Non Comune',
            isMagical: item.rarity !== 'Comune',
            magicalEffects: '',
            enchantments: '',
        };
        
        existing.push(newItem);
        existingNames.add(item.name.toLowerCase());
        result.saved++;
    });
    
    if (!saveEntities(key, existing)) {
        result.errors.push('Errore salvataggio');
    }
    
    return result;
}

/**
 * Salva gli eventi come sessioni nel sessionPlanner.
 */
export function integrateEvents(events) {
    const result = { saved: 0, skipped: 0, errors: [] };
    if (!events || events.length === 0) return result;
    
    const key = getSessionPlanStorageKey();
    if (!key) {
        result.errors.push('Nessuna campagna attiva');
        return result;
    }
    
    const existing = loadEntities(key);
    const existingNames = new Set(existing.map(s => (s.name || '').toLowerCase()));
    
    events.forEach(event => {
        if (!event.name) {
            result.skipped++;
            return;
        }
        if (existingNames.has(event.name.toLowerCase())) {
            result.skipped++;
            return;
        }
        
        const now = Date.now();
        const newSession = {
            id: now.toString() + Math.random().toString(36).substr(2, 5),
            name: event.name,
            objectives: event.description || '',
            playerNotes: '',
            npcs: '',
            locations: '',
            loot: '',
            dmNotes: `Evento storico estratto da Lore Extractor.\nTipo: ${event.eventType}`,
            encounters: [],
            lastModified: now,
        };
        
        existing.push(newSession);
        existingNames.add(event.name.toLowerCase());
        result.saved++;
    });
    
    if (!saveEntities(key, existing)) {
        result.errors.push('Errore salvataggio');
    }
    
    return result;
}

console.log('💾 [LoreExtractor] Integrators caricati.');
