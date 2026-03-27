/**
 * campaignLinker.js
 * ─────────────────────────────────────────────────────────────
 * Utility per il linking dei riferimenti alla campagna.
 * Trasforma i @Tag in link HTML cliccabili.
 * 
 * @version 2.0.0 - Supporto completo per tutte le entità
 */

/**
 * Recupera l'ID della campagna corrente.
 * Tenta di usare stateManager se disponibile, altrimenti localStorage.
 * @returns {string|null}
 */
function getCurrentCampaignId() {
    // Prova prima con lo stateManager (se caricato)
    if (typeof window !== 'undefined' && window.stateManagerGetCurrentCampaignId) {
        return window.stateManagerGetCurrentCampaignId();
    }
    
    // Fallback: cerca nel localStorage
    const keys = ['dungeonMasterToolSelectedCampaign', 'dungeonMasterToolCurrentCampaign', 'currentCampaignId', 'activeCampaign'];
    for (const key of keys) {
        const value = localStorage.getItem(key);
        if (value) return value;
    }
    return null;
}

/**
 * Recupera TUTTI gli elementi linkabili dalla campagna corrente.
 * Include: PNG, PG, Luoghi, Fazioni, Oggetti Unici, Segreti, Sessioni, Capitoli
 * @returns {Array<{id: string, name: string, section: string, categoryLabel: string}>}
 */
export function getAllCampaignElements() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) {
        return [];
    }

    const allElements = [];

    // ═══════════════════════════════════════════════════════════
    // ENTITÀ CON STORAGE DEDICATO
    // ═══════════════════════════════════════════════════════════
    
    // PNG (Personaggi Non Giocanti)
    const npcsData = JSON.parse(localStorage.getItem(`dungeonMasterToolNpcs_${campaignId}`) || '[]');
    if (Array.isArray(npcsData)) {
        npcsData.filter(item => item.id && (item.name || item.title)).forEach(item => {
            allElements.push({
                id: item.id,
                name: item.name || item.title,
                section: 'npcs',
                categoryLabel: 'PNG'
            });
        });
    }

    // PG (Personaggi Giocanti) - da storage dedicato
    const pgsData = JSON.parse(localStorage.getItem(`dungeonMasterToolPgs_${campaignId}`) || '[]');
    if (Array.isArray(pgsData)) {
        pgsData.filter(item => item.id && (item.name || item.nome)).forEach(item => {
            allElements.push({
                id: item.id,
                name: item.name || item.nome,
                section: 'pgs',
                categoryLabel: 'PG'
            });
        });
    }

    // PG anche dallo stato della campagna (alternative storage)
    const campaignState = JSON.parse(localStorage.getItem(`dungeonMasterToolState_${campaignId}`) || '{}');
    if (campaignState.pcs && Array.isArray(campaignState.pcs)) {
        campaignState.pcs.filter(item => item.id && (item.name || item.nome)).forEach(item => {
            // Evita duplicati
            if (!allElements.find(el => el.section === 'pgs' && el.id === item.id)) {
                allElements.push({
                    id: item.id,
                    name: item.name || item.nome,
                    section: 'pgs',
                    categoryLabel: 'PG'
                });
            }
        });
    }

    // Luoghi
    const locationsData = JSON.parse(localStorage.getItem(`dungeonMasterToolLocations_${campaignId}`) || '[]');
    if (Array.isArray(locationsData)) {
        locationsData.filter(item => item.id && (item.name || item.title)).forEach(item => {
            allElements.push({
                id: item.id,
                name: item.name || item.title,
                section: 'locations',
                categoryLabel: 'Luogo'
            });
        });
    }

    // Fazioni
    const factionsData = JSON.parse(localStorage.getItem(`dungeonMasterToolFactions_${campaignId}`) || '[]');
    if (Array.isArray(factionsData)) {
        factionsData.filter(item => item.id && (item.name || item.title)).forEach(item => {
            allElements.push({
                id: item.id,
                name: item.name || item.title,
                section: 'factions',
                categoryLabel: 'Fazione'
            });
        });
    }

    // Oggetti Unici
    const uniqueItemsData = JSON.parse(localStorage.getItem(`dungeonMasterToolUniqueItems_${campaignId}`) || '[]');
    if (Array.isArray(uniqueItemsData)) {
        uniqueItemsData.filter(item => item.id && (item.name || item.title)).forEach(item => {
            allElements.push({
                id: item.id,
                name: item.name || item.title,
                section: 'uniqueItems',
                categoryLabel: 'Oggetto'
            });
        });
    }

    // Segreti
    const secretsData = JSON.parse(localStorage.getItem(`dungeonMasterToolSecrets_${campaignId}`) || '[]');
    if (Array.isArray(secretsData)) {
        secretsData.filter(item => item.id && (item.name || item.title)).forEach(item => {
            allElements.push({
                id: item.id,
                name: item.name || item.title,
                section: 'secrets',
                categoryLabel: 'Segreto'
            });
        });
    }

    // ═══════════════════════════════════════════════════════════
    // ENTITÀ AGGIUNTIVE (SESSIONI, CAPITOLI)
    // ═══════════════════════════════════════════════════════════

    // Sessioni
    const sessionsData = JSON.parse(localStorage.getItem(`dungeonMasterToolSessionNotes_${campaignId}`) || '[]');
    if (Array.isArray(sessionsData)) {
        sessionsData.filter(item => item.id && (item.name || item.title)).forEach(item => {
            allElements.push({
                id: item.id,
                name: item.name || item.title,
                section: 'sessions',
                categoryLabel: 'Sessione'
            });
        });
    }

    // Capitoli e Side Quest
    const chaptersData = JSON.parse(localStorage.getItem(`dungeonMasterToolChapters_${campaignId}`) || '[]');
    if (Array.isArray(chaptersData)) {
        chaptersData.filter(item => item.id && (item.name || item.title)).forEach(item => {
            allElements.push({
                id: item.id,
                name: item.name || item.title,
                section: item.type === 'side-quest' ? 'sidequests' : 'chapters',
                categoryLabel: item.type === 'side-quest' ? 'Side Quest' : 'Capitolo'
            });
        });
    }

    // Encounter (opzionale)
    const encountersData = JSON.parse(localStorage.getItem(`dungeonMasterToolEncounters_${campaignId}`) || '[]');
    if (Array.isArray(encountersData)) {
        encountersData.filter(item => item.id && (item.name || item.title)).forEach(item => {
            allElements.push({
                id: item.id,
                name: item.name || item.title,
                section: 'encounters',
                categoryLabel: 'Encounter'
            });
        });
    }

    return allElements;
}

/**
 * Trasforma i @Tag in link HTML cliccabili.
 * @param {string} text - Il testo da processare
 * @returns {string} - Il testo con i tag trasformati in span cliccabili
 */
export function linkifyCampaignReferences(text) {
    if (!text || typeof text !== 'string') return '';
    const elements = getAllCampaignElements();
    
    let linkedText = text;
    
    // Ordina per lunghezza decrescente per evitare match parziali
    elements.sort((a, b) => (b.name?.length || 0) - (a.name?.length || 0));
    
    elements.forEach(el => {
        if (!el.name) return;

        const escapedName = el.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`@${escapedName}`, 'gi');
        
        linkedText = linkedText.replace(regex, (match) => {
            return `<span class="campaign-link" data-section="${el.section}" data-id="${el.id}" title="${el.categoryLabel}">${match.substring(1)}</span>`;
        });
    });
    
    return linkedText;
}

/**
 * Ottiene tutti gli elementi linkabili per l'autocomplete.
 * @param {string} searchTerm - Termine di ricerca (opzionale)
 * @returns {Array} - Lista di elementi che corrispondono alla ricerca
 */
export function getAutocompleteSuggestions(searchTerm = '') {
    const elements = getAllCampaignElements();
    
    if (!searchTerm) return elements;
    
    const term = searchTerm.toLowerCase();
    return elements.filter(el => 
        el.name && el.name.toLowerCase().includes(term)
    );
}

// ═══════════════════════════════════════════════════════════════
// GESTIONE CLICK SUI LINK
// ═══════════════════════════════════════════════════════════════

/**
 * Mappa sezioni -> moduli corrispondenti
 */
const SECTION_TO_MODULE = {
    npcs: 'npc-manager',
    pgs: 'pg-manager',
    locations: 'location-manager',
    factions: 'faction-manager',
    uniqueItems: 'unique-items',
    secrets: 'secrets',
    sessions: 'session-notes',
    chapters: 'chapter-planner',
    sidequests: 'chapter-planner',
    encounters: 'encounter-builder'
};

/**
 * Gestisce il click su un link campagna.
 * Emette un evento custom per aprire il modulo corrispondente.
 * @param {Event} e - L'evento di click
 */
function handleCampaignLinkClick(e) {
    const link = e.target.closest('.campaign-link');
    if (!link) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const section = link.dataset.section;
    const id = link.dataset.id;
    const name = link.textContent;
    
    console.log(`🔗 [CampaignLinker] Click su link: ${name} (${section}/${id})`);
    
    // Emetti evento custom per aprire il modulo
    document.dispatchEvent(new CustomEvent('openModuleWithItem', {
        detail: { 
            moduleId: SECTION_TO_MODULE[section] || section, 
            itemId: id,
            section: section
        }
    }));
}

/**
 * Inizializza il listener globale per i click sui link campagna.
 * Da chiamare una volta all'avvio dell'applicazione.
 */
export function initCampaignLinker() {
    // Rimuovi listener esistente se presente
    document.removeEventListener('click', handleCampaignLinkClick);
    
    // Aggiungi nuovo listener
    document.addEventListener('click', handleCampaignLinkClick);
    
    console.log('🔗 [CampaignLinker] Listener globale inizializzato.');
}

/**
 * Ottiene le icone per le categorie (usato dall'autocomplete).
 * @param {string} section - La categoria
 * @returns {string} L'emoji icona
 */
export function getCategoryIcon(section) {
    const icons = {
        npcs: '👤',
        pgs: '🧙',
        locations: '📍',
        factions: '🚩',
        uniqueItems: '⚔️',
        secrets: '🤫',
        sessions: '📜',
        chapters: '📖',
        sidequests: '🗺️',
        encounters: '⚔️'
    };
    return icons[section] || '📝';
}

console.log('🔗 [CampaignLinker] Modulo caricato (v2.0 - Supporto completo entità).');
