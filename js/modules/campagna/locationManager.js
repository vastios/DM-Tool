/**
 * locationManager.js
 * ─────────────────────────────────────────────────────────────
 * Modulo per la gestione dei Luoghi della campagna.
 * 
 * Layout: 2 Pannelli (Lista + Editor/Viewer)
 * 
 * Features:
 * - Gerarchia a 7 livelli (Mondo → Regione → Dominio → Insediamento → Area → Edificio → Stanza)
 * - Popup con accordion per selezione tipo
 * - Luoghi padre filtrati per livello compatibile
 * - Tipi personalizzabili per ogni livello
 * - Sistema tag con colori personalizzati
 * - URL immagine con preview
 * - Collegamenti NPC e Fazioni
 * - Toast notifications
 * 
 * @version 3.0.0 - Sistema gerarchico completo
 */

import { getCurrentCampaignId } from '../../../stateManager.js';
import { showToast } from '../../../utils/toast.js';
import { escapeHtml } from '../../../utils/htmlHelpers.js';
import { linkifyCampaignReferences } from '../../../utils/campaignLinker.js';
import { initAutocomplete } from '../../../utils/autocomplete.js';

// ═══════════════════════════════════════════════════════════════
// GERARCHIA DEI LUOGHI - 7 LIVELLI
// ═══════════════════════════════════════════════════════════════

const LOCATION_HIERARCHY = {
    // LIVELLO 1 - MONDO (padre: nessuno)
    1: {
        name: 'Mondo',
        icon: '🌍',
        description: 'Continenti e Piani Dimensionali',
        allowedParentLevels: [],
        types: [
            { value: 'continente', label: 'Continente', description: 'Grande massa terrestre' },
            { value: 'piano_materiale', label: 'Piano Materiale', description: 'Il piano primario dell\'esistenza' },
            { value: 'piano_etereo', label: 'Piano Etereo', description: 'Dimensione eterea' },
            { value: 'piano_ombre', label: 'Piano delle Ombre', description: 'Dimensione oscura speculare' },
            { value: 'piano_elementale', label: 'Piano Elementale', description: 'Piano degli elementi' },
            { value: 'piano_feywild', label: 'Feywild', description: 'Regno delle Fate' },
            { value: 'piano_inferi', label: 'Inferi', description: 'Regno dei demoni' },
            { value: 'piano_celestiale', label: 'Piano Celestiale', description: 'Regno degli dei buoni' },
        ]
    },
    // LIVELLO 2 - REGIONE (padre: L1)
    2: {
        name: 'Regione',
        icon: '🗺️',
        description: 'Macro-aree geografiche',
        allowedParentLevels: [1],
        types: [
            { value: 'regione', label: 'Regione', description: 'Area geografica definita' },
            { value: 'mare', label: 'Mare / Oceano', description: 'Grande specchio d\'acqua' },
            { value: 'arcipelago', label: 'Arcipelago', description: 'Gruppo di isole' },
            { value: 'catena_montuosa', label: 'Catena Montuosa', description: 'Sistema montuoso esteso' },
            { value: 'grande_foresta', label: 'Grande Foresta', description: 'Foresta primordiale vasta' },
            { value: 'deserto', label: 'Deserto', description: 'Area desertica estesa' },
        ]
    },
    // LIVELLO 3 - DOMINIO (padre: L1-L2)
    3: {
        name: 'Dominio',
        icon: '👑',
        description: 'Entità politico-territoriali',
        allowedParentLevels: [1, 2],
        types: [
            { value: 'regno', label: 'Regno', description: 'Dominio monarchico' },
            { value: 'nazione', label: 'Nazione', description: 'Entità politica' },
            { value: 'provincia', label: 'Provincia', description: 'Suddivisione amministrativa' },
            { value: 'territorio', label: 'Territorio', description: 'Area sotto controllo' },
            { value: 'marchesato', label: 'Marchesato', description: 'Dominio di un marchese' },
            { value: 'ducato', label: 'Ducato', description: 'Dominio di un duca' },
            { value: 'confederazione', label: 'Confederazione', description: 'Alleanza di stati' },
        ]
    },
    // LIVELLO 4 - INSEDIAMENTO (padre: L2-L3)
    4: {
        name: 'Insediamento',
        icon: '🏘️',
        description: 'Centri abitati e costruzioni isolate',
        allowedParentLevels: [2, 3],
        types: [
            { value: 'capitale', label: 'Capitale', description: 'Città principale di un regno' },
            { value: 'citta', label: 'Città', description: 'Centro urbano importante' },
            { value: 'villaggio', label: 'Villaggio', description: 'Piccolo centro abitato' },
            { value: 'borgo', label: 'Borgo', description: 'Frazione o piccolo insediamento' },
            { value: 'fortezza', label: 'Fortezza', description: 'Costruzione militare' },
            { value: 'porto', label: 'Porto', description: 'Approdo navale' },
            { value: 'accampamento', label: 'Accampamento', description: 'Insediamento temporaneo' },
            { value: 'avamposto', label: 'Avamposto', description: 'Posizione avanzata' },
            { value: 'dungeon', label: 'Dungeon', description: 'Complesso sotterraneo o struttura isolata' },
            { value: 'rovine', label: 'Rovine', description: 'Resti di un insediamento' },
        ]
    },
    // LIVELLO 5 - AREA (padre: L2-L4)
    5: {
        name: 'Area',
        icon: '🏞️',
        description: 'Zone geografiche e luoghi di interesse',
        allowedParentLevels: [2, 3, 4],
        types: [
            { value: 'foresta', label: 'Foresta', description: 'Area boschiva' },
            { value: 'lago', label: 'Lago', description: 'Specchio d\'acqua interno' },
            { value: 'fiume', label: 'Fiume', description: 'Corso d\'acqua' },
            { value: 'montagna', label: 'Montagna', description: 'Elevazione rocciosa' },
            { value: 'palude', label: 'Palude', description: 'Area paludosa' },
            { value: 'valle', label: 'Valle', description: 'Depressione tra montagne' },
            { value: 'pianura', label: 'Pianura', description: 'Area pianeggiante' },
            { value: 'grotta', label: 'Grotta', description: 'Cavità naturale' },
            { value: 'canyon', label: 'Canyon', description: 'Profonda gola' },
            { value: 'isola', label: 'Isola', description: 'Territorio circondato dall\'acqua' },
            { value: 'tempio_isolato', label: 'Tempio Isolato', description: 'Luogo di culto isolato' },
            { value: 'torre', label: 'Torre', description: 'Costruzione alta e isolata' },
            { value: 'nascondiglio', label: 'Nascondiglio', description: 'Luogo segreto' },
        ]
    },
    // LIVELLO 6 - EDIFICIO (padre: L4-L5)
    6: {
        name: 'Edificio',
        icon: '🏠',
        description: 'Costruzioni specifiche',
        allowedParentLevels: [4, 5],
        types: [
            { value: 'locanda', label: 'Locanda', description: 'Luogo di ristoro e pernottamento' },
            { value: 'taverna', label: 'Taverna', description: 'Luogo di ritrovo' },
            { value: 'negozio', label: 'Negozio', description: 'Bottega commerciale' },
            { value: 'tempio', label: 'Tempio', description: 'Luogo di culto' },
            { value: 'castello', label: 'Castello', description: 'Residenza fortificata' },
            { value: 'palazzo', label: 'Palazzo', description: 'Residenza nobiliare' },
            { value: 'magazzino', label: 'Magazzino', description: 'Deposito merci' },
            { value: 'casa', label: 'Casa', description: 'Abitazione privata' },
            { value: 'cripta', label: 'Cripta', description: 'Camera sepolcrale' },
            { value: 'gilda', label: 'Sede di Gilda', description: 'Quartiere generale' },
            { value: 'prigione', label: 'Prigione', description: 'Luogo di detenzione' },
            { value: 'biblioteca', label: 'Biblioteca', description: 'Raccolta di testi' },
            { value: 'forgia', label: 'Forgia', description: 'Laboratorio di fabbro' },
            { value: 'laboratorio', label: 'Laboratorio', description: 'Spazio di lavoro' },
            { value: 'caserma', label: 'Caserma', description: 'Alloggio militare' },
        ]
    },
    // LIVELLO 7 - STANZA (padre: L6)
    7: {
        name: 'Stanza',
        icon: '🚪',
        description: 'Ambienti interni',
        allowedParentLevels: [6],
        types: [
            { value: 'sala', label: 'Sala', description: 'Ampio ambiente' },
            { value: 'camera', label: 'Camera', description: 'Stanza privata' },
            { value: 'corridoio', label: 'Corridoio', description: 'Passaggio di collegamento' },
            { value: 'cantina', label: 'Cantina', description: 'Ambiente sotterraneo' },
            { value: 'sotterraneo', label: 'Sotterraneo', description: 'Livello interrato' },
            { value: 'passaggio', label: 'Passaggio Segreto', description: 'Collegamento nascosto' },
            { value: 'atrio', label: 'Atrio', description: 'Ingresso' },
            { value: 'cucina', label: 'Cucina', description: 'Ambiente di preparazione cibo' },
            { value: 'scriptorium', label: 'Scriptorium', description: 'Stanza per copiare testi' },
            { value: 'armeria', label: 'Armeria', description: 'Deposito armi' },
            { value: 'tesoreria', label: 'Tesoreria', description: 'Stanza del tesoro' },
        ]
    }
};

// Colori predefiniti per i tag
const PREDEFINED_TAG_COLORS = [
    '#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d', 
    '#16a34a', '#059669', '#0d9488', '#0891b2', '#0284c7',
    '#2563eb', '#4f46e5', '#7c3aed', '#9333ea', '#c026d3',
    '#db2777', '#e11d48', '#78716c', '#57534e', '#1f2937'
];

// Tag predefiniti per i luoghi
const DEFAULT_LOCATION_TAGS = [
    { id: 'visitato', name: 'Visitato', color: '#16a34a' },
    { id: 'segreto', name: 'Segreto', color: '#7c3aed' },
    { id: 'pericoloso', name: 'Pericoloso', color: '#dc2626' },
    { id: 'sicuro', name: 'Zona Sicura', color: '#059669' },
    { id: 'merce', name: 'Mercanzia', color: '#ca8a04' },
];

// ═══════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════

function getStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) {
        console.warn("⚠️ [LocationManager] Nessuna campagna selezionata.");
        return null;
    }
    return `dungeonMasterToolLocations_${campaignId}`;
}

function getTagsStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return null;
    return `dungeonMasterToolLocationTags_${campaignId}`;
}

function getCustomTypesStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return null;
    return `dungeonMasterToolLocationCustomTypes_${campaignId}`;
}

function saveLocations(locations) {
    const storageKey = getStorageKey();
    if (!storageKey) return;
    try {
        localStorage.setItem(storageKey, JSON.stringify(locations));
        console.log(`💾 [LocationManager] Luoghi salvati.`);
    } catch (error) {
        console.error("❌ [LocationManager] Errore salvataggio:", error);
    }
}

function loadLocations() {
    const storageKey = getStorageKey();
    if (!storageKey) return [];
    try {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error("❌ [LocationManager] Errore caricamento:", error);
        return [];
    }
}

function saveTags(tags) {
    const storageKey = getTagsStorageKey();
    if (!storageKey) return;
    try {
        localStorage.setItem(storageKey, JSON.stringify(tags));
    } catch (error) {
        console.error("❌ [LocationManager] Errore salvataggio tag:", error);
    }
}

function loadTags() {
    const storageKey = getTagsStorageKey();
    if (!storageKey) return [...DEFAULT_LOCATION_TAGS];
    try {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : [...DEFAULT_LOCATION_TAGS];
    } catch {
        return [...DEFAULT_LOCATION_TAGS];
    }
}

function saveCustomTypes(customTypes) {
    const storageKey = getCustomTypesStorageKey();
    if (!storageKey) return;
    try {
        localStorage.setItem(storageKey, JSON.stringify(customTypes));
    } catch (error) {
        console.error("❌ [LocationManager] Errore salvataggio tipi custom:", error);
    }
}

function loadCustomTypes() {
    const storageKey = getCustomTypesStorageKey();
    if (!storageKey) return {};
    try {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : {};
    } catch {
        return {};
    }
}

function loadNpcs() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return [];
    try {
        const data = localStorage.getItem(`dungeonMasterToolNpcs_${campaignId}`);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function loadFactions() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return [];
    try {
        const data = localStorage.getItem(`dungeonMasterToolFactions_${campaignId}`);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

// ═══════════════════════════════════════════════════════════════
// UTILITÀ
// ═══════════════════════════════════════════════════════════════

function getTypeInfo(typeValue, customTypes = {}) {
    // Cerca nei tipi standard
    for (const [level, data] of Object.entries(LOCATION_HIERARCHY)) {
        const type = data.types.find(t => t.value === typeValue);
        if (type) {
            return { ...type, level: parseInt(level), levelData: data };
        }
    }
    // Cerca nei tipi custom
    for (const [level, types] of Object.entries(customTypes)) {
        const type = types.find(t => t.value === typeValue);
        if (type) {
            return { ...type, level: parseInt(level), levelData: LOCATION_HIERARCHY[level] };
        }
    }
    return null;
}

function getLevelForType(typeValue, customTypes = {}) {
    const info = getTypeInfo(typeValue, customTypes);
    return info ? info.level : null;
}

function getCompatibleParentLevels(typeValue, customTypes = {}) {
    const level = getLevelForType(typeValue, customTypes);
    if (!level) return [];
    return LOCATION_HIERARCHY[level]?.allowedParentLevels || [];
}

// ═══════════════════════════════════════════════════════════════
// MODULO PRINCIPALE
// ═══════════════════════════════════════════════════════════════

const LocationManager = {
    render(containerElement, itemIdToLoad = null) {
        this.container = containerElement;
        this.locations = loadLocations();
        this.tags = loadTags();
        this.customTypes = loadCustomTypes();
        this.npcs = loadNpcs();
        this.factions = loadFactions();
        this.currentEditingId = null;
        this.selectedTags = [];
        this.linkedNpcs = [];
        this.linkedFactions = [];
        this.selectedTypeLevel = null;
        this.typePopupOpen = false;
        
        this.container.innerHTML = this.getMainLayout();
        this.bindEvents();
        this.renderLocationsList();
        
        if (itemIdToLoad) {
            const location = this.locations.find(l => l.id === itemIdToLoad);
            if (location) {
                this.currentEditingId = itemIdToLoad;
                this.renderLocationEditor(location);
            }
        } else if (this.locations.length > 0) {
            const recent = [...this.locations].sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0))[0];
            this.renderLocationViewer(recent);
        }
        
        console.log('📍 [LocationManager] Modulo inizializzato v3.0 - Sistema Gerarchico');
    },
    
    getMainLayout() {
        return `
<style>
${this.getStyles()}
</style>
<div class="location-manager-layout">
    <div class="location-sidebar">
        <div class="location-sidebar-header">
            <h2>📍 Luoghi della Campagna</h2>
            <button class="location-new-btn" id="new-location-btn">+ Nuovo</button>
        </div>
        
        <div class="location-search-box">
            <input type="text" id="location-search" class="location-search-input" placeholder="Cerca un luogo...">
        </div>
        
        <div class="location-filter-tags" id="location-filter-tags">
            ${this.tags.map(tag => `
                <span class="location-filter-tag" data-tag-id="${tag.id}" style="border-color: ${tag.color}; color: ${tag.color}">
                    ${escapeHtml(tag.name)}
                </span>
            `).join('')}
        </div>
        
        <div class="location-list" id="saved-locations-list"></div>
    </div>

    <div class="location-main" id="location-main">
        <div class="location-empty-state">
            <div class="location-empty-icon">📍</div>
            <p>Seleziona un luogo esistente o creane uno nuovo</p>
        </div>
    </div>
    
    <!-- Type Selection Popup -->
    <div class="location-type-popup-overlay" id="type-popup-overlay"></div>
    <div class="location-type-popup" id="type-popup">
        <div class="location-type-popup-header">
            <h3>📍 Seleziona il tipo di luogo</h3>
            <button class="location-type-popup-close" id="close-type-popup">✕</button>
        </div>
        <div class="location-type-popup-content" id="type-popup-content">
            ${this.renderTypePopupContent()}
        </div>
    </div>
</div>
        `;
    },
    
    getStyles() {
        return `
/* Layout principale */
.location-manager-layout {
    display: flex;
    height: 100%;
    gap: 0;
    background: var(--bg-secondary, #1a1a1a);
    overflow: hidden;
}

/* Sidebar */
.location-sidebar {
    flex: 0 0 300px;
    background: var(--card-bg, #252525);
    border-right: 1px solid var(--border-color, #333);
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
}

.location-sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.location-sidebar-header h2 {
    margin: 0;
    font-family: 'Cinzel', serif;
    font-size: 1rem;
    color: var(--text-primary, #fff);
}

.location-new-btn {
    padding: 0.35rem 0.8rem;
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    border: none;
    border-radius: 4px;
    color: #fff;
    font-family: 'Cinzel', serif;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
}

.location-new-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(8, 145, 178, 0.3);
}

.location-search-box { margin-bottom: 0.5rem; }

.location-search-input {
    width: 100%;
    padding: 0.5rem;
    background: var(--input-bg, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-family: 'Lora', serif;
    font-size: 0.85rem;
}

.location-filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin-bottom: 0.5rem;
}

.location-filter-tag {
    padding: 0.15rem 0.4rem;
    border: 1px solid;
    border-radius: 3px;
    font-size: 0.65rem;
    cursor: pointer;
    transition: all 0.2s;
    opacity: 0.7;
}

.location-filter-tag:hover,
.location-filter-tag.active {
    opacity: 1;
    background: currentColor;
    color: #fff !important;
}

.location-list { flex: 1; overflow-y: auto; }

.location-list-item {
    background: var(--bg-tertiary, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 6px;
    padding: 0.6rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
}

.location-list-item:hover {
    background: var(--hover-bg, #3a3a3a);
    border-color: #0891b2;
}

.location-list-item.selected {
    border-color: #0891b2;
    background: rgba(8, 145, 178, 0.15);
}

.location-list-item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.3rem;
}

.location-list-item-name {
    font-family: 'Cinzel', serif;
    font-size: 0.95rem;
    color: var(--text-primary, #fff);
}

.location-list-item-type {
    font-size: 0.65rem;
    padding: 0.15rem 0.4rem;
    background: rgba(8, 145, 178, 0.2);
    border-radius: 3px;
    color: #0891b2;
    white-space: nowrap;
}

.location-list-item-level {
    font-size: 0.6rem;
    padding: 0.1rem 0.3rem;
    background: rgba(124, 58, 237, 0.2);
    border-radius: 3px;
    color: #a78bfa;
}

.location-list-item-parent {
    font-size: 0.75rem;
    color: var(--text-muted, #888);
    margin-bottom: 0.2rem;
}

.location-list-item-desc {
    font-size: 0.75rem;
    color: var(--text-muted, #aaa);
    line-height: 1.3;
    margin-bottom: 0.3rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.location-list-item-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
    margin-bottom: 0.4rem;
}

.location-list-item-tag {
    font-size: 0.6rem;
    padding: 0.1rem 0.3rem;
    border-radius: 2px;
}

.location-list-item-actions {
    display: flex;
    gap: 0.3rem;
}

.location-list-item-actions button {
    flex: 1;
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
    border-radius: 3px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
}

/* Main area */
.location-main {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    background: var(--bg-secondary, #1a1a1a);
}

.location-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-muted, #666);
}

.location-empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

/* Viewer */
.location-viewer {
    background: var(--card-bg, #252525);
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid var(--border-color, #333);
}

.location-viewer-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #0891b2;
}

.location-viewer-title {
    font-family: 'Cinzel Decorative', serif;
    font-size: 1.5rem;
    color: #0891b2;
    margin: 0;
}

.location-viewer-subtitle {
    font-size: 0.85rem;
    color: var(--text-muted, #888);
    margin-top: 0.25rem;
}

.location-viewer-actions {
    display: flex;
    gap: 0.5rem;
}

.location-viewer-image {
    width: 100%;
    max-height: 250px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 1rem;
}

.location-viewer-section { margin-bottom: 1rem; }

.location-viewer-section h4 {
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    color: #0891b2;
    margin: 0 0 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.location-viewer-section p {
    margin: 0;
    color: var(--text-primary, #fff);
    line-height: 1.5;
}

.location-secret {
    background: rgba(124, 58, 237, 0.1);
    border-left: 3px solid #7c3aed;
    padding: 0.75rem;
    border-radius: 0 4px 4px 0;
}

.location-links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.5rem;
}

.location-link-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.6rem;
    background: var(--bg-tertiary, #333);
    border-radius: 4px;
    font-size: 0.85rem;
    cursor: pointer;
}

.location-link-item:hover { background: var(--hover-bg, #444); }

.location-link-item .role {
    font-size: 0.7rem;
    color: var(--text-muted, #888);
}

/* Editor */
.location-editor {
    background: var(--card-bg, #252525);
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid var(--border-color, #333);
}

.location-editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #0891b2;
}

.location-editor-title {
    font-family: 'Cinzel', serif;
    font-size: 1.2rem;
    color: var(--text-primary, #fff);
}

/* Tabs */
.location-editor-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--border-color, #444);
    padding-bottom: 0.5rem;
}

.location-tab {
    padding: 0.5rem 1rem;
    background: transparent;
    border: none;
    color: var(--text-muted, #888);
    font-family: 'Cinzel', serif;
    font-size: 0.85rem;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
}

.location-tab:hover { color: var(--text-primary, #fff); }

.location-tab.active {
    color: #0891b2;
    border-bottom-color: #0891b2;
}

.location-tab-content { display: none; }

.location-tab-content.active { display: block; }

/* Form */
.location-form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.location-form-group {
    flex: 1;
    margin-bottom: 1rem;
}

.location-form-group label {
    display: block;
    font-size: 0.8rem;
    color: var(--text-muted, #888);
    margin-bottom: 0.25rem;
    text-transform: uppercase;
}

.location-form-group input,
.location-form-group select,
.location-form-group textarea {
    width: 100%;
    padding: 0.6rem;
    background: var(--input-bg, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-family: 'Lora', serif;
    font-size: 0.9rem;
}

.location-form-group textarea {
    min-height: 100px;
    resize: vertical;
}

/* Type selector button */
.location-type-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem;
    background: var(--input-bg, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.location-type-selector:hover {
    border-color: #0891b2;
}

.location-type-selector-icon {
    font-size: 1.2rem;
}

.location-type-selector-text {
    flex: 1;
    color: var(--text-primary, #fff);
}

.location-type-selector-placeholder {
    color: var(--text-muted, #666);
}

.location-type-selector-arrow {
    color: var(--text-muted, #888);
}

/* Type Popup */
.location-type-popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
    display: none;
}

.location-type-popup-overlay.active { display: block; }

.location-type-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    background: var(--card-bg, #252525);
    border-radius: 12px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: none;
    flex-direction: column;
    overflow: hidden;
}

.location-type-popup.active { display: flex; }

.location-type-popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color, #333);
}

.location-type-popup-header h3 {
    margin: 0;
    font-family: 'Cinzel', serif;
    color: var(--text-primary, #fff);
}

.location-type-popup-close {
    background: none;
    border: none;
    color: var(--text-muted, #888);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    line-height: 1;
}

.location-type-popup-close:hover { color: var(--text-primary, #fff); }

.location-type-popup-content {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
}

/* Accordion levels */
.location-level-accordion {
    margin-bottom: 0.5rem;
    border: 1px solid var(--border-color, #333);
    border-radius: 8px;
    overflow: hidden;
}

.location-level-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--bg-tertiary, #2a2a2a);
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
}

.location-level-header:hover {
    background: var(--hover-bg, #333);
}

.location-level-header.active {
    background: rgba(8, 145, 178, 0.1);
    border-bottom: 1px solid var(--border-color, #333);
}

.location-level-icon {
    font-size: 1.25rem;
}

.location-level-info { flex: 1; }

.location-level-name {
    font-family: 'Cinzel', serif;
    font-size: 0.95rem;
    color: var(--text-primary, #fff);
}

.location-level-desc {
    font-size: 0.7rem;
    color: var(--text-muted, #888);
}

.location-level-chevron {
    color: var(--text-muted, #888);
    transition: transform 0.2s;
}

.location-level-header.active .location-level-chevron {
    transform: rotate(180deg);
}

.location-level-content {
    display: none;
    padding: 0.5rem;
    background: var(--bg-secondary, #1a1a1a);
}

.location-level-content.active { display: block; }

.location-type-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.5rem;
}

.location-type-option {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    background: var(--bg-tertiary, #2a2a2a);
    border: 1px solid var(--border-color, #444);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.location-type-option:hover {
    border-color: #0891b2;
    background: rgba(8, 145, 178, 0.1);
}

.location-type-option.selected {
    border-color: #0891b2;
    background: rgba(8, 145, 178, 0.2);
}

.location-type-option-name {
    font-size: 0.85rem;
    color: var(--text-primary, #fff);
    margin-bottom: 0.15rem;
}

.location-type-option-desc {
    font-size: 0.65rem;
    color: var(--text-muted, #888);
}

/* Add custom type */
.location-add-custom-type {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: transparent;
    border: 1px dashed var(--border-color, #555);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--text-muted, #888);
    font-size: 0.8rem;
}

.location-add-custom-type:hover {
    border-color: #0891b2;
    color: #0891b2;
}

/* Custom type input */
.location-custom-type-input {
    display: none;
    padding: 0.5rem;
    background: var(--bg-tertiary, #2a2a2a);
    border-radius: 6px;
    margin-top: 0.5rem;
}

.location-custom-type-input.active { display: flex; }

.location-custom-type-input input {
    flex: 1;
    padding: 0.4rem;
    background: var(--input-bg, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-size: 0.85rem;
    margin-right: 0.5rem;
}

/* Buttons */
.location-btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-family: 'Cinzel', serif;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.location-btn-primary {
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    color: #fff;
}

.location-btn-secondary {
    background: var(--bg-tertiary, #333);
    border: 1px solid var(--border-color, #444);
    color: var(--text-primary, #fff);
}

.location-btn-danger {
    background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
    color: #fff;
}

.location-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.location-btn-sm {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
}

/* Status badge */
.location-status {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-size: 0.75rem;
}

.location-status.visited {
    background: rgba(22, 163, 74, 0.2);
    color: #16a34a;
}

.location-status.not-visited {
    background: rgba(107, 114, 128, 0.2);
    color: #6b7280;
}

/* Tags editor */
.location-tags-editor {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.location-tag-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
}

.location-tag-badge.selected { color: #fff; }

.location-tag-badge:not(.selected) {
    background: transparent !important;
    border: 1px solid;
}

/* Links editor */
.location-links-editor {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.location-link-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--bg-tertiary, #333);
    border-radius: 4px;
}

.location-link-row select,
.location-link-row input {
    flex: 1;
    padding: 0.4rem;
    background: var(--input-bg, #444);
    border: 1px solid var(--border-color, #555);
    border-radius: 4px;
    color: var(--text-primary, #fff);
}

/* Tree toggle */
.tree-toggle {
    display: inline-block;
    width: 14px;
    font-size: 0.6rem;
    color: var(--text-muted, #888);
    cursor: pointer;
    transition: transform 0.2s;
    margin-right: 0.25rem;
}

.tree-toggle:hover {
    color: var(--text-primary, #fff);
}

.tree-toggle:not(.expanded) {
    transform: rotate(-90deg);
}

.tree-spacer {
    display: inline-block;
    width: 14px;
    margin-right: 0.25rem;
}

/* Tree node */
.location-tree-node {
    position: relative;
}

.location-tree-node .location-list-item {
    border-left: 2px solid transparent;
    transition: border-color 0.2s;
}

.location-tree-node .location-list-item:hover {
    border-left-color: #0891b2;
}

/* Campaign links */
.campaign-link {
    color: #0891b2;
    cursor: pointer;
    text-decoration: underline;
    text-decoration-style: dotted;
    transition: all 0.2s;
}

.campaign-link:hover {
    color: #22d3ee;
    text-decoration-style: solid;
}

/* Link hint */
.link-hint {
    display: block;
    font-size: 0.7rem;
    color: var(--text-muted, #888);
    margin-top: 0.25rem;
    font-family: 'Lora', serif;
}

.link-hint code {
    background: var(--bg-tertiary, #333);
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    color: #0891b2;
    font-family: monospace;
}

/* Responsive */
@media (max-width: 768px) {
    .location-manager-layout { flex-direction: column; }
    .location-sidebar { flex: 0 0 auto; max-height: 250px; }
}
        `;
    },
    
    renderTypePopupContent() {
        return Object.entries(LOCATION_HIERARCHY).map(([level, data]) => {
            const customTypes = this.customTypes[level] || [];
            const allTypes = [...data.types, ...customTypes];
            
            return `
                <div class="location-level-accordion" data-level="${level}">
                    <div class="location-level-header" data-level="${level}">
                        <span class="location-level-icon">${data.icon}</span>
                        <div class="location-level-info">
                            <div class="location-level-name">LIVELLO ${level} - ${data.name}</div>
                            <div class="location-level-desc">${data.description}</div>
                        </div>
                        <span class="location-level-chevron">▼</span>
                    </div>
                    <div class="location-level-content" data-level="${level}">
                        <div class="location-type-grid">
                            ${allTypes.map(type => `
                                <div class="location-type-option" data-value="${type.value}" data-level="${level}">
                                    <span class="location-type-option-name">${escapeHtml(type.label)}</span>
                                    <span class="location-type-option-desc">${escapeHtml(type.description || '')}</span>
                                </div>
                            `).join('')}
                            <div class="location-add-custom-type" data-level="${level}">
                                + Aggiungi tipo personalizzato
                            </div>
                        </div>
                        <div class="location-custom-type-input" data-level="${level}">
                            <input type="text" placeholder="Nome nuovo tipo..." class="custom-type-name">
                            <button class="location-btn location-btn-primary location-btn-sm btn-add-custom">Aggiungi</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    renderLocationsList(searchTerm = '', filterTagId = null) {
        const list = this.container.querySelector('#saved-locations-list');
        if (!list) return;
        
        let filtered = this.locations;
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(loc => 
                (loc.name || '').toLowerCase().includes(term) ||
                (loc.type || '').toLowerCase().includes(term) ||
                (loc.description || '').toLowerCase().includes(term)
            );
        }
        
        if (filterTagId) {
            filtered = filtered.filter(loc => (loc.tags || []).includes(filterTagId));
        }
        
        if (filtered.length === 0) {
            list.innerHTML = '<p class="location-empty">Nessun luogo trovato</p>';
            return;
        }
        
        // Costruisci struttura gerarchica
        const tree = this.buildLocationTree(filtered);
        list.innerHTML = this.renderLocationTree(tree, 0);
    },
    
    // Costruisce l'albero dei luoghi
    buildLocationTree(locations, parentId = null) {
        const children = locations.filter(loc => 
            (parentId === null && !loc.parentId) || 
            loc.parentId === parentId
        );
        
        return children.map(loc => {
            const typeInfo = getTypeInfo(loc.type, this.customTypes);
            const childLocations = this.buildLocationTree(locations, loc.id);
            
            return {
                ...loc,
                typeInfo,
                children: childLocations
            };
        }).sort((a, b) => {
            // Ordina per livello prima, poi per nome
            const levelA = a.typeInfo?.level || 99;
            const levelB = b.typeInfo?.level || 99;
            if (levelA !== levelB) return levelA - levelB;
            return (a.name || '').localeCompare(b.name || '');
        });
    },
    
    // Renderizza l'albero con indentazione
    renderLocationTree(nodes, depth = 0) {
        if (nodes.length === 0) return '';
        
        return nodes.map(node => {
            const tags = (node.tags || []).map(tagId => this.tags.find(t => t.id === tagId)).filter(Boolean);
            const isSelected = node.id === this.currentEditingId;
            const indent = depth * 16; // 16px per livello
            const hasChildren = node.children && node.children.length > 0;
            
            return `
                <div class="location-tree-node" data-level="${node.typeInfo?.level || 0}" data-node-id="${node.id}">
                    <div class="location-list-item ${isSelected ? 'selected' : ''}" data-location-id="${node.id}" style="margin-left: ${indent}px;">
                        <div class="location-list-item-header">
                            <span class="location-list-item-name">
                                ${hasChildren ? '<span class="tree-toggle expanded" data-location-id="' + node.id + '">▼</span>' : '<span class="tree-spacer"></span>'}
                                ${escapeHtml(node.name || 'Senza Nome')}
                            </span>
                            <div style="display: flex; gap: 0.3rem;">
                                ${node.typeInfo ? `<span class="location-list-item-level">L${node.typeInfo.level}</span>` : ''}
                                ${node.type ? `<span class="location-list-item-type">${escapeHtml(node.typeInfo?.label || node.type)}</span>` : ''}
                            </div>
                        </div>
                        ${node.description ? `
                            <div class="location-list-item-desc">${escapeHtml(node.description.substring(0, 60))}${node.description.length > 60 ? '...' : ''}</div>
                        ` : ''}
                        ${tags.length > 0 ? `
                            <div class="location-list-item-tags">
                                ${tags.slice(0, 3).map(tag => `
                                    <span class="location-list-item-tag" style="background: ${tag.color}; color: #fff;">
                                        ${escapeHtml(tag.name)}
                                    </span>
                                `).join('')}${tags.length > 3 ? `<span class="location-list-item-tag">+${tags.length - 3}</span>` : ''}
                            </div>
                        ` : ''}
                        <div class="location-list-item-actions">
                            <button class="location-btn location-btn-secondary location-btn-sm btn-view" data-location-id="${node.id}">👁️</button>
                            <button class="location-btn location-btn-secondary location-btn-sm btn-edit" data-location-id="${node.id}">✏️</button>
                            <button class="location-btn location-btn-danger location-btn-sm btn-delete" data-location-id="${node.id}">🗑️</button>
                        </div>
                    </div>
                    ${hasChildren ? this.renderLocationTree(node.children, depth + 1) : ''}
                </div>
            `;
        }).join('');
    },
    
    getAvailableParents(selectedTypeId) {
        if (!selectedTypeId) return this.locations.filter(l => !this.currentEditingId || l.id !== this.currentEditingId);
        
        const level = getLevelForType(selectedTypeId, this.customTypes);
        if (!level) return [];
        
        const allowedParentLevels = LOCATION_HIERARCHY[level]?.allowedParentLevels || [];
        
        return this.locations.filter(loc => {
            if (this.currentEditingId && loc.id === this.currentEditingId) return false;
            const locLevel = getLevelForType(loc.type, this.customTypes);
            return allowedParentLevels.includes(locLevel);
        });
    },
    
    renderLocationViewer(location) {
        const main = this.container.querySelector('#location-main');
        if (!main) return;
        
        const parentLocation = location.parentId ? this.locations.find(l => l.id === location.parentId) : null;
        const typeInfo = getTypeInfo(location.type, this.customTypes);
        const tags = (location.tags || []).map(tagId => this.tags.find(t => t.id === tagId)).filter(Boolean);
        const linkedNpcs = (location.linkedNpcs || []).map(link => ({
            ...link,
            npc: this.npcs.find(n => n.id === link.npcId)
        })).filter(l => l.npc);
        const linkedFactions = (location.linkedFactions || []).map(link => ({
            ...link,
            faction: this.factions.find(f => f.id === link.factionId)
        })).filter(l => l.faction);
        
        const date = new Date(location.lastModified).toLocaleString('it-IT');
        
        main.innerHTML = `
            <div class="location-viewer">
                <div class="location-viewer-header">
                    <div>
                        <h3 class="location-viewer-title">${escapeHtml(location.name)}</h3>
                        <div class="location-viewer-subtitle">
                            ${typeInfo ? `<span style="color: #a78bfa;">L${typeInfo.level}</span> ${typeInfo.levelData.icon} ${escapeHtml(typeInfo.label)}` : ''}
                            ${parentLocation ? ` → 📍 ${escapeHtml(parentLocation.name)}` : ''}
                        </div>
                    </div>
                    <div class="location-viewer-actions">
                        <button class="location-btn location-btn-secondary btn-edit-viewer" data-location-id="${location.id}">✏️ Modifica</button>
                        <button class="location-btn location-btn-danger btn-delete-viewer" data-location-id="${location.id}">🗑️ Elimina</button>
                    </div>
                </div>
                
                ${location.imageUrl ? `
                    <img src="${escapeHtml(location.imageUrl)}" alt="${escapeHtml(location.name)}" class="location-viewer-image" onerror="this.style.display='none'">
                ` : ''}
                
                <div class="location-status ${location.isVisited ? 'visited' : 'not-visited'}">
                    ${location.isVisited ? '✅ Visitato' : '❓ Non ancora visitato'}
                </div>
                
                ${tags.length > 0 ? `
                    <div class="location-viewer-section">
                        <h4>🏷️ Tag</h4>
                        <div class="location-tags-editor">
                            ${tags.map(tag => `
                                <span class="location-tag-badge selected" style="background: ${tag.color};">
                                    ${escapeHtml(tag.name)}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${location.description ? `
                    <div class="location-viewer-section">
                        <h4>📝 Descrizione</h4>
                        <p>${linkifyCampaignReferences(escapeHtml(location.description)).replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}
                
                ${location.inhabitants ? `
                    <div class="location-viewer-section">
                        <h4>👥 Abitanti</h4>
                        <p>${linkifyCampaignReferences(escapeHtml(location.inhabitants))}</p>
                    </div>
                ` : ''}
                
                ${location.pointsofinterest ? `
                    <div class="location-viewer-section">
                        <h4>🎯 Punti di Interesse</h4>
                        <p>${linkifyCampaignReferences(escapeHtml(location.pointsofinterest))}</p>
                    </div>
                ` : ''}
                
                ${linkedNpcs.length > 0 ? `
                    <div class="location-viewer-section">
                        <h4>👤 PNG Presenti</h4>
                        <div class="location-links-grid">
                            ${linkedNpcs.map(link => `
                                <div class="location-link-item campaign-link" data-link-type="npc" data-link-id="${link.npcId}">
                                    👤 ${escapeHtml(link.npc.name)}
                                    ${link.role ? `<span class="role">(${escapeHtml(link.role)})</span>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${linkedFactions.length > 0 ? `
                    <div class="location-viewer-section">
                        <h4>🚩 Fazioni</h4>
                        <div class="location-links-grid">
                            ${linkedFactions.map(link => `
                                <div class="location-link-item campaign-link" data-link-type="faction" data-link-id="${link.factionId}">
                                    🚩 ${escapeHtml(link.faction.name)}
                                    ${link.description ? `<span class="role">(${escapeHtml(link.description)})</span>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${location.secrets ? `
                    <div class="location-viewer-section">
                        <h4>🔒 Segreti del DM</h4>
                        <div class="location-secret">
                            <p>${linkifyCampaignReferences(escapeHtml(location.secrets)).replace(/\n/g, '<br>')}</p>
                        </div>
                    </div>
                ` : ''}
                
                <small style="color: var(--text-muted, #888); display: block; margin-top: 1rem;">
                    Ultima modifica: ${date}
                </small>
            </div>
        `;
        
        this.currentEditingId = location.id;
        this.renderLocationsList();
    },
    
    renderLocationEditor(location = null) {
        const main = this.container.querySelector('#location-main');
        if (!main) return;
        
        const isNew = !location;
        
        this.selectedTags = location ? [...(location.tags || [])] : [];
        this.linkedNpcs = location ? [...(location.linkedNpcs || [])] : [];
        this.linkedFactions = location ? [...(location.linkedFactions || [])] : [];
        this.selectedTypeLevel = location?.type ? getLevelForType(location.type, this.customTypes) : null;
        
        const typeInfo = location?.type ? getTypeInfo(location.type, this.customTypes) : null;
        const availableParents = this.getAvailableParents(location?.type);
        
        main.innerHTML = `
            <div class="location-editor">
                <div class="location-editor-header">
                    <h3 class="location-editor-title">${isNew ? '➕ Nuovo Luogo' : '✏️ Modifica Luogo'}</h3>
                </div>
                
                <div class="location-editor-tabs">
                    <button class="location-tab active" data-tab="basic">Base</button>
                    <button class="location-tab" data-tab="details">Dettagli</button>
                    <button class="location-tab" data-tab="links">Collegamenti</button>
                    <button class="location-tab" data-tab="tags">Tag</button>
                </div>
                
                <!-- TAB BASE -->
                <div class="location-tab-content active" id="tab-basic">
                    <div class="location-form-group">
                        <label for="loc-name">Nome *</label>
                        <input type="text" id="loc-name" value="${escapeHtml(location?.name || '')}" placeholder="Nome del luogo">
                    </div>
                    
                    <div class="location-form-row">
                        <div class="location-form-group">
                            <label>Tipo</label>
                            <div class="location-type-selector" id="open-type-popup">
                                <span class="location-type-selector-icon">${typeInfo?.levelData?.icon || '📍'}</span>
                                <span class="location-type-selector-text ${typeInfo ? '' : 'location-type-selector-placeholder'}">
                                    ${typeInfo ? escapeHtml(typeInfo.label) : 'Seleziona tipo...'}
                                </span>
                                <input type="hidden" id="loc-type" value="${escapeHtml(location?.type || '')}">
                                <span class="location-type-selector-arrow">▼</span>
                            </div>
                        </div>
                        
                        <div class="location-form-group">
                            <label for="loc-parent">Luogo Padre</label>
                            <select id="loc-parent">
                                <option value="">Nessun padre</option>
                                ${availableParents.map(loc => {
                                    const locInfo = getTypeInfo(loc.type, this.customTypes);
                                    return `
                                        <option value="${loc.id}" ${location?.parentId === loc.id ? 'selected' : ''}>
                                            ${locInfo ? `L${locInfo.level} ` : ''}${escapeHtml(loc.name)}
                                        </option>
                                    `;
                                }).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="location-form-group">
                        <label for="loc-description">Descrizione</label>
                        <textarea id="loc-description" rows="5" placeholder="Descrivi il luogo...">${escapeHtml(location?.description || '')}</textarea>
                        <small class="link-hint">💡 Scrivi <code>@Nome</code> per linkare PNG, luoghi, fazioni, ecc.</small>
                    </div>
                </div>
                
                <!-- TAB DETTAGLI -->
                <div class="location-tab-content" id="tab-details">
                    <div class="location-form-group">
                        <label for="loc-image">🖼️ URL Immagine</label>
                        <input type="url" id="loc-image" value="${escapeHtml(location?.imageUrl || '')}" placeholder="https://esempio.com/immagine.jpg">
                        ${location?.imageUrl ? `
                            <div class="location-image-preview" style="margin-top: 0.5rem; border-radius: 6px; overflow: hidden; max-height: 200px;">
                                <img src="${escapeHtml(location.imageUrl)}" alt="Preview" style="width: 100%; object-fit: cover;" onerror="this.parentElement.style.display='none'">
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="location-form-group">
                        <label for="loc-inhabitants">👥 Abitanti</label>
                        <input type="text" id="loc-inhabitants" value="${escapeHtml(location?.inhabitants || '')}" placeholder="Chi vive qui?">
                    </div>
                    
                    <div class="location-form-group">
                        <label for="loc-poi">🎯 Punti di Interesse</label>
                        <input type="text" id="loc-poi" value="${escapeHtml(location?.pointsofinterest || '')}" placeholder="Luoghi notevoli...">
                    </div>
                    
                    <div class="location-form-group">
                        <label for="loc-secrets">🔒 Segreti del DM</label>
                        <textarea id="loc-secrets" rows="4" placeholder="Informazioni nascoste...">${escapeHtml(location?.secrets || '')}</textarea>
                        <small class="link-hint">💡 Scrivi <code>@Nome</code> per linkare PNG, luoghi, fazioni, ecc.</small>
                    </div>
                    
                    <div class="location-form-group">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" id="loc-visited" ${location?.isVisited ? 'checked' : ''}>
                            Già visitato dal party
                        </label>
                    </div>
                </div>
                
                <!-- TAB COLLEGAMENTI -->
                <div class="location-tab-content" id="tab-links">
                    <div class="location-form-group">
                        <label>👤 PNG Collegati</label>
                        <div class="location-links-editor" id="npc-links-editor">
                            ${this.linkedNpcs.map((link, idx) => `
                                <div class="location-link-row" data-link-idx="${idx}">
                                    <select class="npc-select">
                                        ${this.npcs.map(npc => `
                                            <option value="${npc.id}" ${link.npcId === npc.id ? 'selected' : ''}>
                                                ${escapeHtml(npc.name)}
                                            </option>
                                        `).join('')}
                                    </select>
                                    <input type="text" class="npc-role" placeholder="Ruolo" value="${escapeHtml(link.role || '')}">
                                    <button class="location-btn location-btn-danger location-btn-sm btn-remove-npc">✕</button>
                                </div>
                            `).join('')}
                        </div>
                        <button class="location-btn location-btn-secondary location-btn-sm" id="add-npc-link">+ Aggiungi PNG</button>
                    </div>
                    
                    <div class="location-form-group">
                        <label>🚩 Fazioni Collegate</label>
                        <div class="location-links-editor" id="faction-links-editor">
                            ${this.linkedFactions.map((link, idx) => `
                                <div class="location-link-row" data-link-idx="${idx}">
                                    <select class="faction-select">
                                        ${this.factions.map(faction => `
                                            <option value="${faction.id}" ${link.factionId === faction.id ? 'selected' : ''}>
                                                ${escapeHtml(faction.name)}
                                            </option>
                                        `).join('')}
                                    </select>
                                    <input type="text" class="faction-desc" placeholder="Descrizione" value="${escapeHtml(link.description || '')}">
                                    <button class="location-btn location-btn-danger location-btn-sm btn-remove-faction">✕</button>
                                </div>
                            `).join('')}
                        </div>
                        <button class="location-btn location-btn-secondary location-btn-sm" id="add-faction-link">+ Aggiungi Fazione</button>
                    </div>
                </div>
                
                <!-- TAB TAG -->
                <div class="location-tab-content" id="tab-tags">
                    <div class="location-form-group">
                        <label>🏷️ Tag Esistenti</label>
                        <div class="location-tags-editor" id="tags-editor">
                            ${this.tags.map(tag => `
                                <span class="location-tag-badge ${this.selectedTags.includes(tag.id) ? 'selected' : ''}" 
                                      data-tag-id="${tag.id}"
                                      style="background: ${this.selectedTags.includes(tag.id) ? tag.color : 'transparent'}; border-color: ${tag.color}; color: ${this.selectedTags.includes(tag.id) ? '#fff' : tag.color};">
                                    ${escapeHtml(tag.name)}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="location-form-group">
                        <label>➕ Nuovo Tag</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="new-tag-name" placeholder="Nome tag" style="flex: 1; padding: 0.4rem; background: var(--input-bg, #333); border: 1px solid var(--border-color, #444); border-radius: 4px; color: var(--text-primary, #fff);">
                            <input type="color" id="new-tag-color" value="#0891b2" style="width: 40px; height: 32px; padding: 2px; cursor: pointer;">
                            <button class="location-btn location-btn-primary location-btn-sm" id="create-tag-btn">Crea</button>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem; justify-content: flex-end;">
                    <button class="location-btn location-btn-secondary" id="cancel-edit-btn">Annulla</button>
                    <button class="location-btn location-btn-primary" id="save-location-btn">${isNew ? 'Crea Luogo' : 'Salva Modifiche'}</button>
                </div>
            </div>
        `;
        
        this.bindEditorEvents();
    },
    
    // ─────────────────────────────────────────────────────────────
    // EVENT BINDING
    // ─────────────────────────────────────────────────────────────
    
    bindEvents() {
        // New location button
        this.container.querySelector('#new-location-btn')?.addEventListener('click', () => {
            this.currentEditingId = null;
            this.renderLocationEditor();
        });
        
        // Search
        this.container.querySelector('#location-search')?.addEventListener('input', (e) => {
            this.renderLocationsList(e.target.value);
        });
        
        // Filter tags
        this.container.querySelector('#location-filter-tags')?.addEventListener('click', (e) => {
            const tag = e.target.closest('.location-filter-tag');
            if (!tag) return;
            
            document.querySelectorAll('.location-filter-tag').forEach(t => t.classList.remove('active'));
            tag.classList.toggle('active');
            
            const tagId = tag.classList.contains('active') ? tag.dataset.tagId : null;
            const searchTerm = this.container.querySelector('#location-search')?.value || '';
            this.renderLocationsList(searchTerm, tagId);
        });
        
        // List actions
        this.container.querySelector('#saved-locations-list')?.addEventListener('click', (e) => {
            // Tree toggle - collapse/expand children
            const treeToggle = e.target.closest('.tree-toggle');
            if (treeToggle && !e.target.closest('button')) {
                e.stopPropagation();
                
                const treeNode = treeToggle.closest('.location-tree-node');
                if (!treeNode) return;
                
                const isExpanded = treeToggle.classList.contains('expanded');
                treeToggle.classList.toggle('expanded', !isExpanded);
                treeToggle.textContent = isExpanded ? '▶' : '▼';
                
                // Trova tutti i nodi figli diretti
                const childTreeNodes = [];
                const allChildren = treeNode.querySelectorAll('.location-tree-node');
                allChildren.forEach(child => {
                    if (child.parentElement === treeNode) {
                        childTreeNodes.push(child);
                    }
                });
                
                // Toggle visibility
                function toggleNodeVisibility(node, hide) {
                    const item = node.querySelector(':scope > .location-list-item');
                    if (item) {
                        item.style.display = hide ? 'none' : '';
                    }
                    // Ricorsivamente nascondi tutti i discendenti
                    const descendants = node.querySelectorAll('.location-tree-node');
                    descendants.forEach(desc => {
                        const descItem = desc.querySelector(':scope > .location-list-item');
                        if (descItem) {
                            descItem.style.display = hide ? 'none' : '';
                        }
                    });
                }
                
                childTreeNodes.forEach(child => {
                    toggleNodeVisibility(child, isExpanded);
                });
                
                return;
            }
            
            const btn = e.target.closest('button');
            const item = e.target.closest('.location-list-item');
            if (!item) return;
            
            const locationId = item.dataset.locationId;
            const location = this.locations.find(l => l.id === locationId);
            
            if (btn?.classList.contains('btn-view') || (!btn && item)) {
                this.renderLocationViewer(location);
            } else if (btn?.classList.contains('btn-edit')) {
                this.currentEditingId = locationId;
                this.renderLocationEditor(location);
            } else if (btn?.classList.contains('btn-delete')) {
                this.deleteLocation(locationId);
            }
        });
        
        // Main area actions
        this.container.querySelector('#location-main')?.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            
            if (btn.classList.contains('btn-edit-viewer')) {
                const location = this.locations.find(l => l.id === btn.dataset.locationId);
                if (location) {
                    this.currentEditingId = location.id;
                    this.renderLocationEditor(location);
                }
            } else if (btn.classList.contains('btn-delete-viewer')) {
                this.deleteLocation(btn.dataset.locationId);
            }
        });
        
        // Type popup
        this.container.querySelector('#type-popup-overlay')?.addEventListener('click', () => this.closeTypePopup());
        this.container.querySelector('#close-type-popup')?.addEventListener('click', () => this.closeTypePopup());
        
        // Type popup content - using event delegation for all popup interactions
        this.container.querySelector('#type-popup-content')?.addEventListener('click', (e) => {
            // Accordion header click - toggle level expand/collapse
            const accordionHeader = e.target.closest('.location-level-header');
            if (accordionHeader) {
                e.stopPropagation();
                const level = accordionHeader.dataset.level;
                const isActive = accordionHeader.classList.contains('active');
                
                // Close all
                this.container.querySelectorAll('.location-level-header').forEach(h => h.classList.remove('active'));
                this.container.querySelectorAll('.location-level-content').forEach(c => c.classList.remove('active'));
                
                // Open clicked (if wasn't already open)
                if (!isActive) {
                    accordionHeader.classList.add('active');
                    this.container.querySelector(`.location-level-content[data-level="${level}"]`)?.classList.add('active');
                }
                return;
            }
            
            // Type option selection
            const typeOption = e.target.closest('.location-type-option');
            if (typeOption) {
                this.selectType(typeOption.dataset.value, parseInt(typeOption.dataset.level));
                return;
            }
            
            // Add custom type button
            const addBtn = e.target.closest('.location-add-custom-type');
            if (addBtn) {
                const level = addBtn.dataset.level;
                const inputDiv = this.container.querySelector(`.location-custom-type-input[data-level="${level}"]`);
                if (inputDiv) {
                    inputDiv.classList.add('active');
                    inputDiv.querySelector('input')?.focus();
                }
                return;
            }
            
            // Confirm add custom type
            const confirmBtn = e.target.closest('.btn-add-custom');
            if (confirmBtn) {
                const inputDiv = confirmBtn.closest('.location-custom-type-input');
                const level = inputDiv?.dataset.level;
                const input = inputDiv?.querySelector('input');
                const value = input?.value.trim();
                
                if (value && level) {
                    this.addCustomType(level, value);
                    input.value = '';
                    inputDiv.classList.remove('active');
                }
                return;
            }
        });
    },
    
    bindEditorEvents() {
        // Tabs
        this.container.querySelectorAll('.location-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.container.querySelectorAll('.location-tab').forEach(t => t.classList.remove('active'));
                this.container.querySelectorAll('.location-tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                this.container.querySelector(`#tab-${tab.dataset.tab}`)?.classList.add('active');
            });
        });
        
        // Open type popup
        this.container.querySelector('#open-type-popup')?.addEventListener('click', () => this.openTypePopup());
        
        // Tags
        this.container.querySelector('#tags-editor')?.addEventListener('click', (e) => {
            const badge = e.target.closest('.location-tag-badge');
            if (!badge) return;
            
            const tagId = badge.dataset.tagId;
            if (this.selectedTags.includes(tagId)) {
                this.selectedTags = this.selectedTags.filter(id => id !== tagId);
            } else {
                this.selectedTags.push(tagId);
            }
            
            const tag = this.tags.find(t => t.id === tagId);
            if (tag) {
                badge.classList.toggle('selected');
                badge.style.background = this.selectedTags.includes(tagId) ? tag.color : 'transparent';
                badge.style.color = this.selectedTags.includes(tagId) ? '#fff' : tag.color;
            }
        });
        
        // Create tag
        this.container.querySelector('#create-tag-btn')?.addEventListener('click', () => {
            const nameInput = this.container.querySelector('#new-tag-name');
            const colorInput = this.container.querySelector('#new-tag-color');
            
            const name = nameInput?.value.trim();
            const color = colorInput?.value || '#0891b2';
            
            if (!name) {
                showToast('Inserisci un nome per il tag', 'error');
                return;
            }
            
            const newTag = {
                id: Date.now().toString(),
                name,
                color
            };
            
            this.tags.push(newTag);
            saveTags(this.tags);
            this.selectedTags.push(newTag.id);
            
            this.renderLocationEditor(this.locations.find(l => l.id === this.currentEditingId));
            showToast(`Tag "${name}" creato`, 'success');
        });
        
        // Add NPC/Faction links
        this.container.querySelector('#add-npc-link')?.addEventListener('click', () => {
            if (this.npcs.length === 0) {
                showToast('Nessun PNG disponibile', 'warning');
                return;
            }
            this.linkedNpcs.push({ npcId: this.npcs[0].id, role: '' });
            this.renderLinksEditor();
        });
        
        this.container.querySelector('#add-faction-link')?.addEventListener('click', () => {
            if (this.factions.length === 0) {
                showToast('Nessuna fazione disponibile', 'warning');
                return;
            }
            this.linkedFactions.push({ factionId: this.factions[0].id, description: '' });
            this.renderLinksEditor();
        });
        
        // Remove links
        this.container.querySelector('#npc-links-editor')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-remove-npc')) {
                const row = e.target.closest('.location-link-row');
                const idx = parseInt(row?.dataset.linkIdx);
                if (!isNaN(idx)) {
                    this.linkedNpcs.splice(idx, 1);
                    this.renderLinksEditor();
                }
            }
        });
        
        this.container.querySelector('#faction-links-editor')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-remove-faction')) {
                const row = e.target.closest('.location-link-row');
                const idx = parseInt(row?.dataset.linkIdx);
                if (!isNaN(idx)) {
                    this.linkedFactions.splice(idx, 1);
                    this.renderLinksEditor();
                }
            }
        });
        
        // Cancel
        this.container.querySelector('#cancel-edit-btn')?.addEventListener('click', () => {
            if (this.currentEditingId) {
                const location = this.locations.find(l => l.id === this.currentEditingId);
                if (location) {
                    this.renderLocationViewer(location);
                    return;
                }
            }
            this.currentEditingId = null;
            this.container.querySelector('#location-main').innerHTML = `
                <div class="location-empty-state">
                    <div class="location-empty-icon">📍</div>
                    <p>Seleziona un luogo esistente o creane uno nuovo</p>
                </div>
            `;
        });
        
        // Save
        this.container.querySelector('#save-location-btn')?.addEventListener('click', () => this.saveLocation());
        
        // Image preview
        this.container.querySelector('#loc-image')?.addEventListener('input', (e) => {
            const url = e.target.value;
            let preview = this.container.querySelector('.location-image-preview');
            
            if (url) {
                if (!preview) {
                    preview = document.createElement('div');
                    preview.className = 'location-image-preview';
                    preview.style.cssText = 'margin-top: 0.5rem; border-radius: 6px; overflow: hidden; max-height: 200px;';
                    e.target.parentElement.appendChild(preview);
                }
                preview.innerHTML = `<img src="${escapeHtml(url)}" alt="Preview" style="width: 100%; object-fit: cover;" onerror="this.parentElement.style.display='none'">`;
            } else if (preview) {
                preview.remove();
            }
        });
        
        // Update links from UI
        this.container.querySelector('#npc-links-editor')?.addEventListener('change', (e) => {
            if (e.target.classList.contains('npc-select') || e.target.classList.contains('npc-role')) {
                this.updateLinkedNpcsFromUI();
            }
        });
        
        this.container.querySelector('#faction-links-editor')?.addEventListener('change', (e) => {
            if (e.target.classList.contains('faction-select') || e.target.classList.contains('faction-desc')) {
                this.updateLinkedFactionsFromUI();
            }
        });
        
        // Initialize autocomplete on text fields
        const textFields = [
            '#loc-description',
            '#loc-inhabitants', 
            '#loc-poi',
            '#loc-secrets'
        ];
        
        textFields.forEach(selector => {
            const field = this.container.querySelector(selector);
            if (field) {
                initAutocomplete(field);
            }
        });
    },
    
    renderLinksEditor() {
        const npcEditor = this.container.querySelector('#npc-links-editor');
        const factionEditor = this.container.querySelector('#faction-links-editor');
        
        if (npcEditor) {
            npcEditor.innerHTML = this.linkedNpcs.map((link, idx) => `
                <div class="location-link-row" data-link-idx="${idx}">
                    <select class="npc-select">
                        ${this.npcs.map(npc => `
                            <option value="${npc.id}" ${link.npcId === npc.id ? 'selected' : ''}>
                                ${escapeHtml(npc.name)}
                            </option>
                        `).join('')}
                    </select>
                    <input type="text" class="npc-role" placeholder="Ruolo" value="${escapeHtml(link.role || '')}">
                    <button class="location-btn location-btn-danger location-btn-sm btn-remove-npc">✕</button>
                </div>
            `).join('');
        }
        
        if (factionEditor) {
            factionEditor.innerHTML = this.linkedFactions.map((link, idx) => `
                <div class="location-link-row" data-link-idx="${idx}">
                    <select class="faction-select">
                        ${this.factions.map(faction => `
                            <option value="${faction.id}" ${link.factionId === faction.id ? 'selected' : ''}>
                                ${escapeHtml(faction.name)}
                            </option>
                        `).join('')}
                    </select>
                    <input type="text" class="faction-desc" placeholder="Descrizione" value="${escapeHtml(link.description || '')}">
                    <button class="location-btn location-btn-danger location-btn-sm btn-remove-faction">✕</button>
                </div>
            `).join('');
        }
    },
    
    updateLinkedNpcsFromUI() {
        const rows = this.container.querySelectorAll('#npc-links-editor .location-link-row');
        this.linkedNpcs = Array.from(rows).map(row => ({
            npcId: row.querySelector('.npc-select')?.value,
            role: row.querySelector('.npc-role')?.value || ''
        })).filter(link => link.npcId);
    },
    
    updateLinkedFactionsFromUI() {
        const rows = this.container.querySelectorAll('#faction-links-editor .location-link-row');
        this.linkedFactions = Array.from(rows).map(row => ({
            factionId: row.querySelector('.faction-select')?.value,
            description: row.querySelector('.faction-desc')?.value || ''
        })).filter(link => link.factionId);
    },
    
    openTypePopup() {
        const overlay = this.container.querySelector('#type-popup-overlay');
        const popup = this.container.querySelector('#type-popup');
        
        if (overlay && popup) {
            overlay.classList.add('active');
            popup.classList.add('active');
            
            // Re-render popup content to have fresh state
            const content = this.container.querySelector('#type-popup-content');
            if (content) {
                content.innerHTML = this.renderTypePopupContent();
            }
            
            // If there's a selected type, open that accordion
            const hiddenInput = this.container.querySelector('#loc-type');
            if (hiddenInput?.value) {
                const level = getLevelForType(hiddenInput.value, this.customTypes);
                if (level) {
                    const header = this.container.querySelector(`.location-level-header[data-level="${level}"]`);
                    const contentDiv = this.container.querySelector(`.location-level-content[data-level="${level}"]`);
                    if (header && contentDiv) {
                        header.classList.add('active');
                        contentDiv.classList.add('active');
                    }
                    
                    // Mark selected type
                    const option = this.container.querySelector(`.location-type-option[data-value="${hiddenInput.value}"]`);
                    if (option) option.classList.add('selected');
                }
            }
        }
    },
    
    closeTypePopup() {
        const overlay = this.container.querySelector('#type-popup-overlay');
        const popup = this.container.querySelector('#type-popup');
        
        if (overlay) overlay.classList.remove('active');
        if (popup) popup.classList.remove('active');
    },
    
    selectType(typeValue, level) {
        const typeInfo = getTypeInfo(typeValue, this.customTypes);
        if (!typeInfo) return;
        
        // Update hidden input
        const hiddenInput = this.container.querySelector('#loc-type');
        if (hiddenInput) hiddenInput.value = typeValue;
        
        // Update selector display
        const selector = this.container.querySelector('#open-type-popup');
        if (selector) {
            const icon = selector.querySelector('.location-type-selector-icon');
            const text = selector.querySelector('.location-type-selector-text');
            
            if (icon) icon.textContent = typeInfo.levelData.icon;
            if (text) {
                text.textContent = `L${level} - ${typeInfo.label}`;
                text.classList.remove('location-type-selector-placeholder');
            }
        }
        
        this.selectedTypeLevel = level;
        
        // Update parent dropdown with compatible parents
        this.updateParentDropdown(typeValue);
        
        this.closeTypePopup();
        showToast(`Tipo selezionato: ${typeInfo.label} (Livello ${level})`, 'success');
    },
    
    updateParentDropdown(typeValue) {
        const parentSelect = this.container.querySelector('#loc-parent');
        if (!parentSelect) return;
        
        const availableParents = this.getAvailableParents(typeValue);
        const currentParentId = parentSelect.value;
        
        parentSelect.innerHTML = `
            <option value="">Nessun padre</option>
            ${availableParents.map(loc => {
                const locInfo = getTypeInfo(loc.type, this.customTypes);
                return `
                    <option value="${loc.id}" ${loc.id === currentParentId ? 'selected' : ''}>
                        ${locInfo ? `L${locInfo.level} ` : ''}${escapeHtml(loc.name)}
                    </option>
                `;
            }).join('')}
        `;
    },
    
    addCustomType(level, name) {
        if (!this.customTypes[level]) {
            this.customTypes[level] = [];
        }
        
        const value = `custom_${level}_${Date.now()}`;
        const newType = {
            value,
            label: name,
            description: 'Tipo personalizzato'
        };
        
        this.customTypes[level].push(newType);
        saveCustomTypes(this.customTypes);
        
        // Re-render popup content
        const content = this.container.querySelector('#type-popup-content');
        if (content) {
            content.innerHTML = this.renderTypePopupContent();
            
            // Open the accordion for this level
            const header = content.querySelector(`.location-level-header[data-level="${level}"]`);
            const contentDiv = content.querySelector(`.location-level-content[data-level="${level}"]`);
            if (header && contentDiv) {
                header.classList.add('active');
                contentDiv.classList.add('active');
            }
        }
        
        showToast(`Tipo "${name}" aggiunto al Livello ${level}`, 'success');
    },
    
    saveLocation() {
        const name = this.container.querySelector('#loc-name')?.value.trim();
        const type = this.container.querySelector('#loc-type')?.value;
        const parentId = this.container.querySelector('#loc-parent')?.value || null;
        const description = this.container.querySelector('#loc-description')?.value.trim();
        const imageUrl = this.container.querySelector('#loc-image')?.value.trim();
        const inhabitants = this.container.querySelector('#loc-inhabitants')?.value.trim();
        const poi = this.container.querySelector('#loc-poi')?.value.trim();
        const secrets = this.container.querySelector('#loc-secrets')?.value.trim();
        const isVisited = this.container.querySelector('#loc-visited')?.checked || false;
        
        if (!name) {
            showToast('Il nome del luogo è obbligatorio', 'error');
            return;
        }
        
        this.updateLinkedNpcsFromUI();
        this.updateLinkedFactionsFromUI();
        
        const now = Date.now();
        const locationData = {
            name,
            type,
            parentId,
            description,
            imageUrl,
            inhabitants,
            pointsofinterest: poi,
            secrets,
            isVisited,
            tags: [...this.selectedTags],
            linkedNpcs: [...this.linkedNpcs],
            linkedFactions: [...this.linkedFactions],
            lastModified: now,
        };
        
        if (this.currentEditingId) {
            const idx = this.locations.findIndex(l => l.id === this.currentEditingId);
            if (idx >= 0) {
                this.locations[idx] = { ...this.locations[idx], ...locationData };
                showToast(`Luogo "${name}" aggiornato`, 'success');
            }
        } else {
            const newLocation = {
                id: now.toString(),
                ...locationData
            };
            this.locations.push(newLocation);
            this.currentEditingId = newLocation.id;
            showToast(`Luogo "${name}" creato`, 'success');
        }
        
        saveLocations(this.locations);
        this.renderLocationsList();
        
        const savedLocation = this.locations.find(l => l.id === this.currentEditingId);
        if (savedLocation) {
            this.renderLocationViewer(savedLocation);
        }
    },
    
    deleteLocation(locationId) {
        const location = this.locations.find(l => l.id === locationId);
        if (!location) return;
        
        if (!confirm(`Sei sicuro di voler eliminare "${location.name}"?`)) return;
        
        this.locations = this.locations.filter(l => l.id !== locationId);
        
        // Update children to have no parent
        this.locations.forEach(loc => {
            if (loc.parentId === locationId) {
                loc.parentId = null;
            }
        });
        
        saveLocations(this.locations);
        
        if (this.currentEditingId === locationId) {
            this.currentEditingId = null;
        }
        
        this.renderLocationsList();
        
        this.container.querySelector('#location-main').innerHTML = `
            <div class="location-empty-state">
                <div class="location-empty-icon">📍</div>
                <p>Luogo eliminato</p>
            </div>
        `;
        
        showToast(`Luogo "${location.name}" eliminato`, 'warning');
    }
};

export default LocationManager;
