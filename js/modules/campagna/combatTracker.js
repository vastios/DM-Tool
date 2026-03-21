/**
 * combatTracker.js
 * ─────────────────────────────────────────────────────────────
 * Combat Tracker con integrazione multi-fonte.
 * 
 * Fonti dati accessibili da popup:
 * - PG (Personaggi Giocanti) dal party
 * - PNG (Personaggi Non Giocanti) della campagna
 * - Mostri dal Compendio
 * - Incontri salvati dall'Encounter Builder
 * 
 * @version 3.1.0 - UI migliorata con popup fonti e nomi editabili
 */

import { 
    getCombatState, 
    clearCombat, 
    updateMonsterProperty, 
    removeMonsterFromCombat, 
    subscribe, 
    startCombat, 
    nextTurn, 
    useSpellSlot,
    useSpell,
    usePerDaySpell,
    resetPerDaySpells,
    addMonsterToCombat,
    addPcToCombat,
    addNpcToCombat,
    importEncounter,
    getCampaignPcs,
    addConditionToCombatant,
    removeConditionFromCombatant,
    // Fine combattimento
    endCombat,
    rerollAllInitiative,
    // Concentrazione e incantesimi attivi
    setConcentration,
    breakConcentration,
    rollConcentrationSave,
    getConcentration,
    addActiveSpell,
    removeActiveSpell,
    getActiveSpells,
    // Tracciamento azioni
    useAction,
    resetActionsForTurn
} from '../../../stateManager.js';
import { monsterDatabase } from '../../../database/monsterDatabase.js';
import { spellDatabase } from '../../../database/spells.js';
import { conditionsDatabase, getConditionDescription } from '../../../database/conditions.js';
import { rollDice } from '../../../utils/dice.js';
import { showToast } from '../../../utils/toast.js';
import { getCurrentCampaignId } from '../../../js/services/campaignManager.js';

// --- COSTANTI ---
const SOURCE_COLORS = {
    pc: '#4caf50',
    npc: '#2196f3',
    npc_enemy: '#f44336',
    monster: '#ff9800'
};

const TAG_COLORS = {
    alleato: '#4caf50',
    nemico: '#f44336',
    neutrale: '#9e9e9e',
    contatto: '#2196f3',
    mentore: '#9c27b0',
    rivale: '#ff9800'
};

// --- CACHE E STATO LOCALE ---
const resistancesCache = {};
const savesCache = {};
const speedCache = {};
let previousRound = 0;

// Dati locali per le fonti
let availablePcs = [];
let availableNpcs = [];
let savedEncounters = [];
let selectedCombatantId = null;

// --- FUNZIONI HELPER STORAGE ---

function getNpcStorageKey() {
    const campaignId = getCurrentCampaignId();
    return campaignId ? `dungeonMasterToolNpcs_${campaignId}` : null;
}

function getEncounterStorageKey() {
    const campaignId = getCurrentCampaignId();
    return campaignId ? `dungeonMasterToolEncounters_${campaignId}` : null;
}

function loadNpcs() {
    const key = getNpcStorageKey();
    if (!key) return [];
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Errore caricamento PNG:', e);
        return [];
    }
}

function loadEncounters() {
    const key = getEncounterStorageKey();
    if (!key) return [];
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Errore caricamento incontri:', e);
        return [];
    }
}

function loadAllSources() {
    availablePcs = getCampaignPcs() || [];
    availableNpcs = loadNpcs();
    savedEncounters = loadEncounters();
}

// --- FUNZIONI HELPER FORMATTAZIONE ---

function getSourceBadge(combatant) {
    const sourceType = combatant.sourceType || 'monster';
    
    if (sourceType === 'pc') {
        return `<span class="source-badge pc" style="background: ${SOURCE_COLORS.pc}">PG</span>`;
    }
    if (sourceType === 'npc') {
        const tag = combatant.tag || 'neutrale';
        const color = TAG_COLORS[tag] || SOURCE_COLORS.npc;
        const label = tag.charAt(0).toUpperCase() + tag.slice(1);
        return `<span class="source-badge npc" style="background: ${color}">${label}</span>`;
    }
    return `<span class="source-badge monster" style="background: ${SOURCE_COLORS.monster}">Mostro</span>`;
}

function formatSpellsForCombat(combatant) {
    if (!combatant.spellState) return '';
    const { cantrips, preparedSpells, remainingSlots } = combatant.spellState;
    let html = '<div class="combatant-spells"><h5>Incantesimi</h5>';

    const findSpell = (name) => {
        const key = name.trim().toLowerCase();
        return Object.values(spellDatabase).find(s => s.name?.toLowerCase() === key || s.name?.toLowerCase().includes(key));
    };

    if (cantrips?.length > 0) {
        html += '<div class="spell-section"><h6>Trucchetti</h6>';
        html += cantrips.map(c => {
            const spellName = typeof c === 'string' ? c : c.name;
            const s = findSpell(spellName);
            if (!s) return `<span class="spell-tag">${spellName}</span>`;
            const cleanDesc = (s.description || s.desc || '').replace(/'/g, "&apos;");
            return `<span class="special-action-link" data-name="${s.name}" data-desc="${cleanDesc}">${s.name}</span>`;
        }).filter(Boolean).join(', ');
        html += '</div>';
    }

    if (preparedSpells?.length > 0) {
        html += '<div class="spell-section"><h6>Preparati</h6>';
        if (remainingSlots && Object.keys(remainingSlots).length > 0) {
            html += `<div class="spell-slots-info">Slots: ${Object.entries(remainingSlots).filter(([l, c]) => l > 0).map(([l, c]) => `L${l}: ${c}`).join(' | ')}</div>`;
        }
        html += '<div class="spell-buttons">';
        preparedSpells.forEach(p => {
            const spellName = typeof p === 'string' ? p : p.name;
            const spellLevel = typeof p === 'object' ? p.level : 1;
            const isDisabled = remainingSlots && remainingSlots[spellLevel] <= 0;
            html += `<button class="spell-btn ${isDisabled ? 'disabled' : ''}" data-monster-id="${combatant.id}" data-spell-level="${spellLevel}" title="${spellName}">${spellName}</button>`;
        });
        html += '</div></div>';
    }
    return html + '</div>';
}

// --- GENERAZIONE CONTENUTO POPUP ---

function generatePcsPopupContent() {
    if (availablePcs.length === 0) {
        return `<div class="popup-empty"><p>Nessun PG nella campagna.</p><p class="hint">Crea i PG dal modulo Personaggi.</p></div>`;
    }
    
    return `
        <div class="popup-header">
            <span>👥 Personaggi Giocanti (${availablePcs.length})</span>
            <button class="btn-add-all-pcs" title="Aggiungi tutto il party">⚔️ Carica Tutti</button>
        </div>
        <div class="popup-list">
            ${availablePcs.map(pc => `
                <div class="popup-item" data-type="pc" data-id="${pc.id}">
                    <div class="popup-item-info">
                        <span class="popup-item-name">${pc.name}</span>
                        <span class="popup-item-detail">${pc.className || ''} Lv.${pc.level || 1}</span>
                    </div>
                    <div class="popup-item-stats">
                        <span>PF: ${pc.hp?.max || pc.hp || '?'}</span>
                        <span>CA: ${pc.ac || '?'}</span>
                    </div>
                    <button class="btn-add-source" data-type="pc" data-id="${pc.id}">➕</button>
                </div>
            `).join('')}
        </div>
    `;
}

function generateNpcsPopupContent(searchTerm = '') {
    let filtered = availableNpcs;
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = availableNpcs.filter(n => 
            (n.name || '').toLowerCase().includes(term) ||
            (n.role || '').toLowerCase().includes(term)
        );
    }
    
    if (filtered.length === 0) {
        return `<div class="popup-empty"><p>Nessun PNG trovato.</p></div>`;
    }
    
    return `
        <div class="popup-header">
            <span>👥 PNG della Campagna (${filtered.length})</span>
        </div>
        <div class="popup-search">
            <input type="text" class="popup-search-input" placeholder="Cerca PNG..." value="${searchTerm}">
        </div>
        <div class="popup-list">
            ${filtered.map(npc => {
                const tag = npc.tag || 'neutrale';
                const tagColor = TAG_COLORS[tag] || '#888';
                return `
                    <div class="popup-item" data-type="npc" data-id="${npc.id}">
                        <div class="popup-item-info">
                            <span class="popup-item-name">${npc.name}</span>
                            <span class="popup-item-tag" style="background: ${tagColor}">${tag}</span>
                        </div>
                        <div class="popup-item-stats">
                            <span>PF: ${npc.hp || '?'}</span>
                            <span>CA: ${npc.ac || '?'}</span>
                        </div>
                        <button class="btn-add-source" data-type="npc" data-id="${npc.id}">➕</button>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function generateMonstersPopupContent(searchTerm = '', typeFilter = 'Tutti') {
    const types = ['Tutti', ...new Set(monsterDatabase.map(m => m.type))].sort();
    
    let filtered = monsterDatabase;
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(m => m.name.toLowerCase().includes(term));
    }
    if (typeFilter !== 'Tutti') {
        filtered = filtered.filter(m => m.type === typeFilter);
    }
    
    filtered = filtered.slice(0, 30);
    
    return `
        <div class="popup-header">
            <span>👹 Mostri dal Compendio</span>
        </div>
        <div class="popup-search">
            <input type="text" class="popup-search-input" placeholder="Cerca mostro..." value="${searchTerm}">
        </div>
        <div class="popup-filters">
            ${types.map(t => `<button class="popup-filter-btn ${t === typeFilter ? 'active' : ''}" data-type="${t}">${t}</button>`).join('')}
        </div>
        <div class="popup-list">
            ${filtered.map(monster => `
                <div class="popup-item" data-type="monster" data-index="${monster.index}">
                    <div class="popup-item-info">
                        <span class="popup-item-name">${monster.name}</span>
                        <span class="popup-item-detail">${monster.size} ${monster.type}, CR ${monster.challenge_rating}</span>
                    </div>
                    <div class="popup-item-stats">
                        <span>PF: ${monster.hit_points}</span>
                        <span>CA: ${monster.armor_class[0]?.value || '?'}</span>
                    </div>
                    <button class="btn-add-source" data-type="monster" data-index="${monster.index}">➕</button>
                </div>
            `).join('')}
            ${filtered.length === 0 ? '<p class="popup-no-results">Nessun mostro trovato</p>' : ''}
            ${filtered.length === 30 ? '<p class="popup-limited">Mostrati primi 30 risultati</p>' : ''}
        </div>
    `;
}

function generateEncountersPopupContent() {
    if (savedEncounters.length === 0) {
        return `<div class="popup-empty"><p>Nessun incontro salvato.</p><p class="hint">Crea incontri dal modulo Encounter Builder.</p></div>`;
    }
    
    return `
        <div class="popup-header">
            <span>💾 Incontri Salvati (${savedEncounters.length})</span>
        </div>
        <div class="popup-list">
            ${savedEncounters.map(enc => `
                <div class="popup-item encounter-item" data-encounter-id="${enc.id}">
                    <div class="popup-item-info">
                        <span class="popup-item-name">${enc.name}</span>
                        <span class="popup-item-detail">${enc.monsters?.length || 0} tipi di creature</span>
                    </div>
                    <button class="btn-import-encounter-popup" data-id="${enc.id}">📥 Importa</button>
                </div>
            `).join('')}
        </div>
    `;
}

// --- OGGETTO PRINCIPALE ---
const CombatTracker = {
    container: null,
    currentPopup: null,
    popupSearchTerm: '',
    popupTypeFilter: 'Tutti',
    combatants: [],
    currentRound: 0,
    currentTurnId: null,
    initiativeOrder: [],

    render(containerElement) {
        this.container = containerElement;
        this.targetCombatant = null; // Bersaglio selezionato per attacchi
        
        loadAllSources();

        containerElement.innerHTML = `
<style>
${this.getStyles()}
</style>
<div class="combat-tracker-container">
    <!-- Header con controlli e pulsanti fonti -->
    <div class="tracker-header">
        <div class="header-left">
            <h2>⚔️ Combat Tracker</h2>
            <div class="round-counter">
                <label>Round:</label>
                <input type="number" id="round-input" value="${this.currentRound}" min="0">
                <button id="next-turn-btn" class="action-btn next-turn-btn">Prossimo Turno</button>
            </div>
        </div>
        <div class="header-center">
            <button id="start-combat-btn" class="action-btn">Inizia</button>
            <button id="end-combat-btn" class="end-btn">Termina</button>
            <button id="clear-combat-btn" class="reset-btn">Svuota</button>
        </div>
        <div class="header-right">
            <button class="source-btn" data-source="pcs" title="Aggiungi Personaggi Giocanti">
                👤 PG
            </button>
            <button class="source-btn" data-source="npcs" title="Aggiungi PNG">
                👥 PNG
            </button>
            <button class="source-btn" data-source="monsters" title="Aggiungi Mostri">
                👹 Mostri
            </button>
            <button class="source-btn" data-source="encounters" title="Importa Incontro">
                💾 Incontri
            </button>
        </div>
    </div>
    
    <!-- Layout principale -->
    <div class="combat-main-layout">
        <div class="combatant-order-column">
            <h3>📊 Ordine di Iniziativa</h3>
            <div id="combatants-order-list" class="combatant-order-list"></div>
        </div>
        <div class="combatant-detail-column">
            <div id="combatant-detail-view">
                <p class="empty-state">Seleziona un combattente o aggiungi creature al combattimento.</p>
            </div>
        </div>
    </div>
    
    <!-- Popup Overlay -->
    <div id="source-popup-overlay" class="popup-overlay hidden">
        <div class="popup-container">
            <button class="popup-close" title="Chiudi">×</button>
            <div id="popup-content" class="popup-content"></div>
        </div>
    </div>
    
    <!-- Conditions Popup Overlay -->
    <div id="conditions-popup-overlay" class="popup-overlay hidden">
        <div class="conditions-popup-container">
            <button class="popup-close" title="Chiudi">×</button>
            <div id="conditions-popup-content" class="popup-content"></div>
        </div>
    </div>
    
    <!-- Spells Popup Overlay -->
    <div id="spells-popup-overlay" class="popup-overlay hidden">
        <div class="spells-popup-container">
            <button class="popup-close" title="Chiudi">×</button>
            <div id="spells-popup-content" class="popup-content"></div>
        </div>
    </div>
</div>
        `;

        // Salva riferimento al div interno combat-tracker-container
        this.trackerContainer = this.container.querySelector('.combat-tracker-container');

        this.bindEvents();
        
        // Sottoscrizione allo stato
        subscribe((combatants, currentRound, currentTurnMonsterId, initiativeOrder) => {
            this.onStateChange(combatants, currentRound, currentTurnMonsterId, initiativeOrder);
        });
    },

    getStyles() {
        return `
/* Combat Tracker v3.1 Styles */
.combat-tracker-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bg-primary, #1a1a1a);
    color: var(--text-primary, #fff);
    gap: 8px;
    transition: background 0.5s ease, box-shadow 0.5s ease;
}

/* Combat Active - Effetto Rosso Sangue */
.combat-tracker-container.combat-active {
    background: linear-gradient(180deg, 
        rgba(60, 10, 10, 0.95) 0%, 
        rgba(40, 5, 5, 0.98) 50%,
        rgba(30, 0, 0, 1) 100%
    );
    box-shadow: 
        inset 0 0 100px rgba(139, 0, 0, 0.3),
        inset 0 0 50px rgba(180, 0, 0, 0.15),
        0 0 30px rgba(139, 0, 0, 0.2);
    animation: bloodPulse 4s ease-in-out infinite;
}

@keyframes bloodPulse {
    0%, 100% { 
        box-shadow: 
            inset 0 0 100px rgba(139, 0, 0, 0.3),
            inset 0 0 50px rgba(180, 0, 0, 0.15),
            0 0 30px rgba(139, 0, 0, 0.2);
    }
    50% { 
        box-shadow: 
            inset 0 0 120px rgba(139, 0, 0, 0.4),
            inset 0 0 60px rgba(180, 0, 0, 0.2),
            0 0 40px rgba(139, 0, 0, 0.3);
    }
}

/* Card interne rimangono leggibili */
.combat-active .tracker-header,
.combat-active .combatant-order-column,
.combat-active .combatant-detail-column,
.combat-active .combatant-card {
    background: var(--card-bg, #252525) !important;
}

.combat-active .combatant-order-item {
    background: var(--bg-tertiary, #333) !important;
}

.combat-active .dropdown-container .dropdown-menu,
.combat-active .popup-container,
.combat-active .conditions-popup-container,
.combat-active .spells-popup-container {
    background: var(--card-bg, #252525) !important;
}

/* Bordo rosso acceso per elementi attivi in combattimento */
.combat-active .combatant-order-item.active-turn {
    border-left-color: #ff4444 !important;
    background: rgba(255, 68, 68, 0.15) !important;
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.3);
}

.combat-active .combatant-order-item.active-turn .order-item-name {
    text-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
}

/* Round counter evidenziato in combattimento */
.combat-active .round-counter input {
    background: rgba(139, 0, 0, 0.4);
    border-color: #8b0000;
    color: #ff6b6b;
    font-weight: bold;
}

/* Titolo con effetto in combattimento */
.combat-active .header-left h2 {
    color: #ff6b6b;
    text-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
}

/* Pulsanti con tonalità rosse in combattimento */
.combat-active .action-btn {
    background: linear-gradient(135deg, #8b0000 0%, #5a0000 100%);
    box-shadow: 0 0 10px rgba(139, 0, 0, 0.5);
}

.combat-active .action-btn:hover {
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.6);
}

/* Header - compatto */
.tracker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    background: var(--card-bg, #252525);
    border-radius: 6px;
    gap: 10px;
    flex-wrap: wrap;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.header-left h2 {
    margin: 0;
    font-family: 'Cinzel', serif;
    font-size: 1rem;
    color: var(--accent-color, #d4af37);
}

.round-counter {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.8rem;
}

.round-counter input {
    width: 40px;
    padding: 3px 4px;
    background: var(--input-bg, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 3px;
    color: var(--text-primary, #fff);
    text-align: center;
    font-size: 0.85rem;
    height: 28px;
    box-sizing: border-box;
}

/* Prossimo Turno: nascosto di default, visibile solo in combattimento */
.next-turn-btn {
    display: none !important;
}

.combat-active .next-turn-btn {
    display: inline-flex !important;
}

.header-center {
    display: flex;
    align-items: center;
    gap: 5px;
}

.action-btn, .reset-btn, .end-btn {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 0.15s;
    white-space: nowrap;
    height: 28px;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    line-height: 1;
}

.action-btn {
    background: linear-gradient(135deg, var(--accent-color, #d4af37) 0%, #8b6914 100%);
    color: #fff;
}

.action-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(212, 175, 55, 0.3);
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.reset-btn {
    background: linear-gradient(135deg, #8b0000 0%, #5a0000 100%);
    color: #fff;
}

.end-btn {
    background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
    color: #fff;
}

.end-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(46, 125, 50, 0.4);
}

.end-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 4px;
}

.source-btn {
    padding: 5px 8px;
    background: var(--bg-tertiary, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 0.15s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    height: 28px;
    box-sizing: border-box;
}

.source-btn:hover {
    background: var(--accent-color, #d4af37);
    color: #000;
    border-color: var(--accent-color, #d4af37);
}

/* Main Layout */
.combat-main-layout {
    display: flex;
    gap: 12px;
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

.combatant-order-column {
    flex: 0 0 220px;
    background: var(--card-bg, #252525);
    border-radius: 8px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.combatant-order-column h3 {
    margin: 0 0 10px;
    font-size: 0.85rem;
    color: var(--text-muted, #888);
    flex-shrink: 0;
}

.combatant-order-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.combatant-order-item {
    padding: 8px 10px;
    background: var(--bg-tertiary, #333);
    border-radius: 6px;
    cursor: pointer;
    border-left: 3px solid transparent;
    transition: all 0.15s;
}

.combatant-order-item:hover {
    background: var(--hover-bg, #3a3a3a);
}

.combatant-order-item.active-turn {
    border-left-color: var(--accent-color, #d4af37);
    background: rgba(212, 175, 55, 0.15);
}

.combatant-order-item.selected {
    border-left-color: #2196f3;
    background: rgba(33, 150, 243, 0.1);
}

.order-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.order-item-name {
    font-weight: 500;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 6px;
}

.source-badge {
    font-size: 0.6rem;
    padding: 1px 5px;
    border-radius: 3px;
    color: #fff;
}

.order-item-stats {
    display: flex;
    gap: 10px;
    font-size: 0.75rem;
    color: var(--text-muted, #888);
}

.order-init-input {
    width: 40px;
    padding: 2px 4px;
    background: var(--input-bg, #222);
    border: 1px solid var(--border-color, #444);
    border-radius: 3px;
    color: var(--text-primary, #fff);
    text-align: center;
    font-size: 0.8rem;
}

.order-init-input:focus {
    outline: none;
    border-color: var(--accent-color, #d4af37);
}

/* Detail Column */
.combatant-detail-column {
    flex: 1;
    background: var(--card-bg, #252525);
    border-radius: 8px;
    padding: 15px;
    overflow-y: auto;
}

.empty-state {
    text-align: center;
    color: var(--text-muted, #666);
    margin-top: 3rem;
}

.combatant-card {
    background: var(--bg-tertiary, #333);
    border-radius: 8px;
    padding: 15px;
}

.combatant-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color, #444);
}

.combatant-name-input {
    font-family: 'Cinzel', serif;
    font-size: 1.1rem;
    font-weight: bold;
    background: transparent;
    border: none;
    color: var(--text-primary, #fff);
    flex: 1;
    padding: 4px;
    border-radius: 4px;
}

.combatant-name-input:focus {
    outline: none;
    background: var(--input-bg, #222);
}

.combatant-name-input:hover {
    background: var(--input-bg, #222);
}

.stat-row {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 12px;
    flex-wrap: wrap;
}

.stat-group {
    display: flex;
    align-items: center;
    gap: 5px;
}

.stat-group label {
    font-size: 0.8rem;
    color: var(--text-muted, #888);
}

.stat-input {
    width: 60px;
    padding: 4px 8px;
    background: var(--input-bg, #222);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    text-align: center;
    font-size: 0.9rem;
}

.stat-input:focus {
    outline: none;
    border-color: var(--accent-color, #d4af37);
}

.conditions-area {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 12px;
}

.condition-badge {
    background: rgba(255, 152, 0, 0.2);
    border: 1px solid #ff9800;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 5px;
}

.remove-condition {
    cursor: pointer;
    opacity: 0.7;
    font-weight: bold;
}

.remove-condition:hover {
    opacity: 1;
}

.actions-area {
    margin-top: 15px;
}

.actions-area h5 {
    margin: 0 0 8px;
    font-size: 0.85rem;
    color: var(--text-muted, #888);
}

.attack-btn {
    padding: 5px 12px;
    margin: 3px;
    background: var(--bg-secondary, #444);
    border: 1px solid var(--border-color, #555);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.15s;
}

.attack-btn:hover {
    background: var(--accent-color, #d4af37);
    color: #000;
}

.results-box {
    margin-top: 12px;
    padding: 10px;
    background: rgba(0,0,0,0.2);
    border-radius: 4px;
    font-size: 0.85rem;
    max-height: 120px;
    overflow-y: auto;
}

.results-box p {
    margin: 4px 0;
    padding: 4px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.dropdown-container {
    position: relative;
    margin-top: 15px;
    display: inline-block;
}

.condition-dropdown-toggle {
    padding: 6px 12px;
    background: var(--bg-tertiary, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    cursor: pointer;
    font-size: 0.8rem;
}

.condition-dropdown-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--card-bg, #252525);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    min-width: 150px;
    margin-top: 2px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}

.condition-dropdown-menu.show {
    display: block;
}

.condition-item {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background 0.15s;
}

.condition-item:hover {
    background: var(--hover-bg, #3a3a3a);
}

.remove-combatant-btn {
    margin-top: 15px;
    padding: 8px 15px;
    background: linear-gradient(135deg, #8b0000 0%, #5a0000 100%);
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    font-size: 0.85rem;
}

/* Popup Overlay */
.popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.popup-overlay.hidden {
    display: none;
}

.popup-container {
    background: var(--card-bg, #252525);
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    position: relative;
}

.popup-close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    background: var(--bg-tertiary, #333);
    border: none;
    border-radius: 50%;
    color: var(--text-primary, #fff);
    cursor: pointer;
    font-size: 1.2rem;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
}

.popup-close:hover {
    background: #f44336;
}

.popup-content {
    padding: 15px;
    overflow-y: auto;
    flex: 1;
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color, #444);
    font-weight: bold;
}

.btn-add-all-pcs {
    padding: 6px 12px;
    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    font-size: 0.8rem;
}

.popup-search {
    margin-bottom: 10px;
}

.popup-search-input {
    width: 100%;
    padding: 8px 12px;
    background: var(--input-bg, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 6px;
    color: var(--text-primary, #fff);
    font-size: 0.9rem;
}

.popup-search-input:focus {
    outline: none;
    border-color: var(--accent-color, #d4af37);
}

.popup-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 10px;
}

.popup-filter-btn {
    padding: 4px 10px;
    background: var(--bg-tertiary, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-muted, #888);
    cursor: pointer;
    font-size: 0.7rem;
}

.popup-filter-btn.active {
    background: var(--accent-color, #d4af37);
    color: #000;
    border-color: var(--accent-color, #d4af37);
}

.popup-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.popup-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: var(--bg-tertiary, #333);
    border-radius: 6px;
    transition: all 0.15s;
}

.popup-item:hover {
    background: var(--hover-bg, #3a3a3a);
}

.popup-item-info {
    flex: 1;
    min-width: 0;
}

.popup-item-name {
    font-weight: 500;
    font-size: 0.9rem;
}

.popup-item-detail {
    display: block;
    font-size: 0.75rem;
    color: var(--text-muted, #888);
}

.popup-item-tag {
    font-size: 0.65rem;
    padding: 2px 8px;
    border-radius: 3px;
    color: #fff;
    margin-left: 8px;
}

.popup-item-stats {
    display: flex;
    gap: 12px;
    font-size: 0.75rem;
    color: var(--text-muted, #888);
}

.btn-add-source {
    padding: 6px 10px;
    background: var(--accent-color, #d4af37);
    border: none;
    border-radius: 4px;
    color: #000;
    cursor: pointer;
    font-size: 1rem;
}

.btn-add-source:hover {
    transform: scale(1.1);
}

.btn-import-encounter-popup {
    padding: 6px 12px;
    background: linear-gradient(135deg, #2196f3 0%, #1565c0 100%);
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    font-size: 0.8rem;
}

.popup-empty {
    text-align: center;
    padding: 30px;
    color: var(--text-muted, #666);
}

.popup-empty .hint {
    font-size: 0.85rem;
    margin-top: 8px;
}

.popup-no-results, .popup-limited {
    text-align: center;
    color: var(--text-muted, #666);
    padding: 15px;
    font-size: 0.85rem;
}

/* Spell and ability styling */
.special-action-link {
    color: var(--accent-color, #d4af37);
    cursor: pointer;
    text-decoration: underline;
}

.spell-tag {
    background: rgba(33, 150, 243, 0.2);
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.8rem;
}

.ability-tooltip {
    position: absolute;
    background: var(--card-bg, #252525);
    border: 1px solid var(--border-color, #444);
    border-radius: 6px;
    padding: 10px;
    max-width: 300px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.ability-tooltip h4 {
    margin: 0 0 5px;
    color: var(--accent-color, #d4af37);
}

.ability-tooltip p {
    margin: 0;
    font-size: 0.85rem;
}

.spell-section {
    margin-top: 10px;
}

.spell-section h6 {
    margin: 0 0 5px;
    font-size: 0.8rem;
    color: var(--text-muted, #888);
}

.spell-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 5px;
}

.spell-btn {
    padding: 4px 8px;
    background: var(--bg-secondary, #444);
    border: 1px solid var(--border-color, #555);
    border-radius: 3px;
    color: var(--text-primary, #fff);
    cursor: pointer;
    font-size: 0.75rem;
}

.spell-btn.disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.spell-slots-info {
    font-size: 0.75rem;
    color: var(--text-muted, #888);
    margin-bottom: 5px;
}

/* Condition tags in order list */
.condition-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    margin-top: 4px;
}

.condition-tag {
    font-size: 0.6rem;
    padding: 1px 5px;
    border-radius: 3px;
    background: rgba(255, 152, 0, 0.3);
    border: 1px solid #ff9800;
    color: #fff;
    cursor: help;
    position: relative;
}

.condition-tag.expiring {
    background: rgba(244, 67, 54, 0.3);
    border-color: #f44336;
    animation: pulse-warning 1s infinite;
}

@keyframes pulse-warning {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
}

/* Condition tooltip */
.condition-tooltip {
    position: fixed;
    background: var(--card-bg, #252525);
    border: 1px solid var(--accent-color, #d4af37);
    border-radius: 8px;
    padding: 12px;
    max-width: 300px;
    z-index: 2000;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    font-size: 0.85rem;
    line-height: 1.4;
    pointer-events: none;
}

.condition-tooltip h4 {
    margin: 0 0 8px;
    color: var(--accent-color, #d4af37);
    font-size: 0.95rem;
}

.condition-tooltip p {
    margin: 0;
    color: var(--text-muted, #ccc);
}

.condition-tooltip .duration-info {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--border-color, #444);
    color: var(--accent-color, #d4af37);
    font-weight: 500;
}

/* Conditions popup */
.conditions-popup-container {
    background: var(--card-bg, #252525);
    border-radius: 12px;
    width: 95%;
    max-width: 600px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    position: relative;
}

.conditions-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 8px;
    margin-top: 10px;
}

.condition-card {
    background: var(--bg-tertiary, #333);
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.15s;
}

.condition-card:hover {
    background: var(--hover-bg, #3a3a3a);
    border-color: var(--accent-color, #d4af37);
}

.condition-card.selected {
    border-color: #4caf50;
    background: rgba(76, 175, 80, 0.1);
}

.condition-card.already-has {
    opacity: 0.5;
    cursor: not-allowed;
}

.condition-card h4 {
    margin: 0 0 5px;
    font-size: 0.9rem;
    color: var(--text-primary, #fff);
}

.condition-card p {
    margin: 0;
    font-size: 0.75rem;
    color: var(--text-muted, #888);
    line-height: 1.3;
}

.condition-duration-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--border-color, #444);
}

.condition-duration-selector label {
    font-size: 0.8rem;
    color: var(--text-muted, #888);
}

.condition-duration-selector input {
    width: 50px;
    padding: 4px 8px;
    background: var(--input-bg, #222);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    text-align: center;
}

.condition-duration-selector span {
    font-size: 0.75rem;
    color: var(--text-muted, #888);
}

.apply-conditions-btn {
    margin-top: 15px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
    border: none;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    font-size: 0.9rem;
    width: 100%;
}

.apply-conditions-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
}

.apply-conditions-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

/* Active conditions in detail */
.active-conditions-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
}

.active-condition-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 152, 0, 0.2);
    border: 1px solid #ff9800;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
}

.active-condition-badge .duration {
    background: rgba(0,0,0,0.3);
    padding: 1px 5px;
    border-radius: 8px;
    font-size: 0.7rem;
}

.active-condition-badge .remove-btn {
    cursor: pointer;
    opacity: 0.6;
    font-weight: bold;
    margin-left: 2px;
}

.active-condition-badge .remove-btn:hover {
    opacity: 1;
}

/* HP Controls */
.hp-group {
    flex: 1;
    min-width: 200px;
}

.hp-controls {
    display: flex;
    align-items: center;
    gap: 4px;
}

.hp-btn {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
}

.hp-minus {
    background: linear-gradient(135deg, #f44336 0%, #c62828 100%);
    color: #fff;
}

.hp-minus:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(244, 67, 54, 0.4);
}

.hp-plus {
    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
    color: #fff;
}

.hp-plus:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
}

.hp-max {
    color: var(--text-muted, #888);
    font-size: 0.85rem;
}

.hp-bar-container {
    width: 100%;
    height: 6px;
    background: rgba(0,0,0,0.3);
    border-radius: 3px;
    margin-top: 6px;
    overflow: hidden;
}

.hp-bar {
    height: 100%;
    transition: width 0.3s ease, background 0.3s ease;
    border-radius: 3px;
}

/* Damage/Heal Input Row */
.damage-heal-row {
    display: flex;
    gap: 6px;
    margin: 12px 0;
    align-items: center;
}

.damage-input {
    flex: 1;
    padding: 8px 12px;
    background: var(--input-bg, #222);
    border: 1px solid var(--border-color, #444);
    border-radius: 6px;
    color: var(--text-primary, #fff);
    font-size: 0.9rem;
}

.damage-input:focus {
    outline: none;
    border-color: var(--accent-color, #d4af37);
}

.apply-damage-btn, .apply-heal-btn {
    padding: 8px 14px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.15s;
    white-space: nowrap;
}

.apply-damage-btn {
    background: linear-gradient(135deg, #f44336 0%, #c62828 100%);
    color: #fff;
}

.apply-damage-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(244, 67, 54, 0.4);
}

.apply-heal-btn {
    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
    color: #fff;
}

.apply-heal-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
}

/* Death Saves */
.death-saves-container {
    background: rgba(139, 0, 0, 0.2);
    border: 1px solid #8b0000;
    border-radius: 8px;
    padding: 12px;
    margin: 12px 0;
}

.death-saves-container.stabilized {
    background: rgba(76, 175, 80, 0.2);
    border-color: #4caf50;
}

.death-saves-container.dead {
    background: rgba(33, 33, 33, 0.8);
    border-color: #333;
}

.death-saves-label {
    font-weight: bold;
    font-size: 0.9rem;
    color: #ff6b6b;
}

.death-saves-container.stabilized .death-saves-label {
    color: #4caf50;
}

.death-saves-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.death-saves-trackers {
    display: flex;
    gap: 20px;
    margin-top: 8px;
}

.death-saves-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.death-saves-sublabel {
    font-size: 0.8rem;
    color: var(--text-muted, #888);
}

.death-saves-icons {
    display: flex;
    gap: 2px;
}

.death-save-indicator {
    font-size: 1rem;
}

.death-save-btn {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: bold;
}

.death-save-btn.success-btn {
    background: #4caf50;
    color: #fff;
}

.death-save-btn.failure-btn {
    background: #f44336;
    color: #fff;
}

.death-save-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.roll-death-save-btn {
    margin-top: 10px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%);
    border: none;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    font-size: 0.85rem;
    width: 100%;
}

.roll-death-save-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(156, 39, 176, 0.4);
}

.revive-btn {
    margin-top: 8px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
    border: none;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    font-size: 0.85rem;
}

/* Death Tooltip */
.death-tooltip-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes pulseDeath {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.death-tooltip {
    background: linear-gradient(135deg, #1a0a0a 0%, #2d0a0a 100%);
    border: 2px solid #8b0000;
    border-radius: 12px;
    padding: 30px 40px;
    text-align: center;
    box-shadow: 0 0 30px rgba(139, 0, 0, 0.6);
    animation: pulseDeath 1s ease-in-out infinite;
}

.death-icon {
    font-size: 4rem;
    margin-bottom: 15px;
    animation: pulseDeath 1s ease-in-out infinite;
}

.death-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 10px;
}

.death-message {
    color: #ff6b6b;
    font-size: 1rem;
    margin-bottom: 20px;
}

.death-close-btn {
    padding: 8px 24px;
    background: #8b0000;
    border: none;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s;
}

.death-close-btn:hover {
    background: #a00;
}

/* Combatant Card States */
.combatant-card.unconscious {
    opacity: 0.7;
    border: 2px solid #8b0000;
}

/* Attack Results */
.results-box p.critical {
    color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
    padding: 8px;
    border-radius: 4px;
    border-left: 3px solid #ffd700;
}

.results-box p.fumble {
    color: #f44336;
    background: rgba(244, 67, 54, 0.1);
    padding: 8px;
    border-radius: 4px;
    border-left: 3px solid #f44336;
}

.apply-attack-damage-btn {
    margin-left: 8px;
    padding: 4px 10px;
    background: var(--accent-color, #d4af37);
    border: none;
    border-radius: 4px;
    color: #000;
    cursor: pointer;
    font-size: 0.75rem;
}

.apply-attack-damage-btn:hover {
    background: #e6c455;
}

/* Target selection in order list */
.combatant-order-item.targeted {
    border-left-color: #e91e63;
    background: rgba(233, 30, 99, 0.15);
}

.set-target-btn {
    padding: 2px 6px;
    background: transparent;
    border: 1px solid var(--border-color, #444);
    border-radius: 3px;
    color: var(--text-muted, #888);
    cursor: pointer;
    font-size: 0.7rem;
    margin-left: auto;
}

.set-target-btn:hover {
    background: #e91e63;
    border-color: #e91e63;
    color: #fff;
}

/* New Initiative Button */
.new-initiative-btn {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 10px 16px;
    background: linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%);
    border: none;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    text-align: center;
    transition: all 0.2s;
}

.new-initiative-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(156, 39, 176, 0.4);
}

.attack-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
}

.clear-target-btn {
    padding: 4px 10px;
    background: transparent;
    border: 1px solid #e91e63;
    border-radius: 4px;
    color: #e91e63;
    cursor: pointer;
    font-size: 0.75rem;
    margin-top: 6px;
}

.clear-target-btn:hover {
    background: #e91e63;
    color: #fff;
}

/* Concentration Status */
.concentration-container {
    background: rgba(156, 39, 176, 0.2);
    border: 1px solid #9c27b0;
    border-radius: 8px;
    padding: 10px 12px;
    margin: 10px 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.concentration-icon {
    font-size: 1.2rem;
}

.concentration-info {
    flex: 1;
}

.concentration-spell {
    font-weight: 500;
    color: #ce93d8;
}

.concentration-duration {
    font-size: 0.75rem;
    color: var(--text-muted, #888);
}

.concentration-actions {
    display: flex;
    gap: 5px;
}

.concentration-btn {
    padding: 4px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 0.15s;
}

.concentration-btn.break-btn {
    background: rgba(244, 67, 54, 0.3);
    border: 1px solid #f44336;
    color: #f44336;
}

.concentration-btn.break-btn:hover {
    background: #f44336;
    color: #fff;
}

/* Active Spells Container */
.active-spells-container {
    margin: 12px 0;
}

.active-spells-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.active-spells-header h5 {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-muted, #888);
}

.active-spells-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.active-spell-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
}

.active-spell-badge.buff {
    background: rgba(76, 175, 80, 0.2);
    border: 1px solid #4caf50;
    color: #81c784;
}

.active-spell-badge.debuff {
    background: rgba(244, 67, 54, 0.2);
    border: 1px solid #f44336;
    color: #e57373;
}

.active-spell-badge.effect {
    background: rgba(33, 150, 243, 0.2);
    border: 1px solid #2196f3;
    color: #64b5f6;
}

.active-spell-badge.concentration {
    position: relative;
}

.active-spell-badge.concentration::before {
    content: '🔮';
    font-size: 0.65rem;
    margin-right: 2px;
}

.active-spell-badge .duration {
    background: rgba(0,0,0,0.3);
    padding: 1px 5px;
    border-radius: 8px;
    font-size: 0.7rem;
}

.active-spell-badge .remove-btn {
    cursor: pointer;
    opacity: 0.6;
    font-weight: bold;
    margin-left: 2px;
}

.active-spell-badge .remove-btn:hover {
    opacity: 1;
}

.add-spell-btn {
    padding: 4px 10px;
    background: var(--bg-tertiary, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 12px;
    color: var(--text-muted, #888);
    cursor: pointer;
    font-size: 0.75rem;
}

.add-spell-btn:hover {
    background: var(--accent-color, #d4af37);
    color: #000;
}

/* Concentration Check Result */
.concentration-check-result {
    margin-top: 8px;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
}

.concentration-check-result.success {
    background: rgba(76, 175, 80, 0.2);
    border-left: 3px solid #4caf50;
    color: #81c784;
}

.concentration-check-result.failure {
    background: rgba(244, 67, 54, 0.2);
    border-left: 3px solid #f44336;
    color: #e57373;
}

/* Spells Popup */
.spells-popup-container {
    background: var(--card-bg, #252525);
    border-radius: 12px;
    width: 95%;
    max-width: 550px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    position: relative;
}

.spell-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 12px;
}

.spell-form-row {
    display: flex;
    gap: 10px;
    align-items: center;
}

.spell-form-row label {
    min-width: 80px;
    font-size: 0.85rem;
    color: var(--text-muted, #888);
}

.spell-form-row input,
.spell-form-row select {
    flex: 1;
    padding: 8px 12px;
    background: var(--input-bg, #222);
    border: 1px solid var(--border-color, #444);
    border-radius: 6px;
    color: var(--text-primary, #fff);
    font-size: 0.9rem;
}

.spell-form-row input:focus,
.spell-form-row select:focus {
    outline: none;
    border-color: var(--accent-color, #d4af37);
}

.spell-form-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
}

.spell-form-checkbox input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--accent-color, #d4af37);
}

.apply-spell-btn {
    margin-top: 15px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%);
    border: none;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    font-size: 0.9rem;
    width: 100%;
}

.apply-spell-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(156, 39, 176, 0.4);
}

/* Spell Form Styles */
.spell-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.spell-form-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.spell-form-row label {
    min-width: 80px;
    font-size: 0.85rem;
    color: var(--text-muted, #888);
}

.spell-form-row input,
.spell-form-row select {
    flex: 1;
    padding: 8px 12px;
    background: var(--input-bg, #222);
    border: 1px solid var(--border-color, #444);
    border-radius: 6px;
    color: var(--text-primary, #fff);
    font-size: 0.9rem;
}

.spell-form-row input:focus,
.spell-form-row select:focus {
    outline: none;
    border-color: var(--accent-color, #d4af37);
}

.spell-form-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
}

.spell-form-checkbox input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #9c27b0;
}

/* Spells Popup Container */
.spells-popup-container {
    background: var(--card-bg, #252525);
    border-radius: 12px;
    width: 95%;
    max-width: 500px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    position: relative;
    padding: 20px;
}

/* ========== COMBATANT CARD NEW LAYOUT ========== */

/* Header Fisso - Singola riga compatta */
.combatant-card-header-fixed {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: linear-gradient(135deg, var(--card-bg, #252525) 0%, #1a1a1a 100%);
    border-bottom: 2px solid var(--accent-color, #d4af37);
    padding: 6px 12px;
    margin: -15px -15px 12px -15px;
    z-index: 10;
    border-radius: 8px 8px 0 0;
}

.header-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    min-width: 0;
}

.combatant-name-input {
    flex: 1;
    min-width: 80px;
    max-width: 180px;
    font-size: 0.95rem;
    padding: 2px 4px;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.type-info {
    background: rgba(212, 175, 55, 0.15);
    padding: 1px 6px;
    border-radius: 3px;
    font-weight: 500;
    font-size: 0.75rem;
}

.remove-combatant-btn {
    padding: 4px 8px;
    background: linear-gradient(135deg, #8b0000 0%, #5a0000 100%);
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    font-size: 0.75rem;
    opacity: 0.8;
    transition: opacity 0.2s;
}

.remove-combatant-btn:hover {
    opacity: 1;
}

/* Griglia 2x2 */
.combatant-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 12px;
    margin-top: 10px;
}

.grid-cell {
    background: var(--bg-tertiary, #2a2a2a);
    border-radius: 8px;
    padding: 12px;
    border: 1px solid var(--border-color, #3a3a3a);
}

.cell-title {
    margin: 0 0 10px 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--accent-color, #d4af37);
    padding-bottom: 6px;
    border-bottom: 1px solid var(--border-color, #3a3a3a);
}

/* HP Section */
.hp-section .hp-controls {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
}

.hp-section .hp-bar-container {
    width: 100%;
    height: 8px;
    background: rgba(0,0,0,0.3);
    border-radius: 4px;
    margin: 8px 0;
    overflow: hidden;
}

.hp-section .hp-bar {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease, background 0.3s ease;
}

.stat-row-mini {
    display: flex;
    gap: 15px;
    font-size: 0.85rem;
    margin: 8px 0;
}

.stat-mini {
    display: flex;
    align-items: center;
    gap: 4px;
}

.init-mini-input {
    width: 45px;
    padding: 3px 5px;
    background: var(--input-bg, #1a1a1a);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-size: 0.85rem;
    text-align: center;
}

.hp-section .damage-heal-row {
    display: flex;
    gap: 6px;
    margin-top: 10px;
}

.hp-section .damage-input {
    flex: 1;
    padding: 6px 10px;
    background: var(--input-bg, #1a1a1a);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-size: 0.85rem;
}

.hp-section .apply-damage-btn,
.hp-section .apply-heal-btn {
    padding: 6px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: transform 0.15s;
}

.hp-section .apply-damage-btn:hover,
.hp-section .apply-heal-btn:hover {
    transform: scale(1.1);
}

.conditions-mini {
    margin-top: 10px;
    min-height: 30px;
}

.open-conditions-popup-btn-mini {
    margin-top: 8px;
    padding: 5px 10px;
    background: var(--bg-secondary, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    cursor: pointer;
    font-size: 0.75rem;
    width: 100%;
}

/* Actions Section */
.target-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

.target-selector label {
    font-size: 0.8rem;
    color: var(--text-muted, #888);
}

.target-select {
    flex: 1;
    padding: 6px 10px;
    background: var(--input-bg, #1a1a1a);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-size: 0.85rem;
}

.attack-buttons-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.attack-buttons-grid .attack-btn {
    padding: 6px 12px;
    background: var(--bg-secondary, #3a3a3a);
    border: 1px solid var(--border-color, #555);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.15s;
}

.attack-buttons-grid .attack-btn:hover {
    background: var(--accent-color, #d4af37);
    color: #000;
}

.no-actions {
    color: var(--text-muted, #666);
    font-size: 0.85rem;
    font-style: italic;
}

.results-box-mini {
    margin-top: 10px;
    padding: 8px;
    background: rgba(0,0,0,0.2);
    border-radius: 4px;
    font-size: 0.8rem;
    min-height: 40px;
}

/* Actions Counter */
.actions-counter {
    font-size: 0.75rem;
    padding: 2px 8px;
    background: rgba(76, 175, 80, 0.2);
    border-radius: 4px;
    margin-left: 8px;
}

.actions-counter.action-used {
    background: rgba(244, 67, 54, 0.2);
    color: #e57373;
}

/* Actions List */
.actions-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.action-category {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.category-label {
    color: var(--text-muted, #888);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.attack-buttons-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.attack-buttons-grid .attack-btn,
.attack-buttons-grid .action-btn {
    padding: 6px 12px;
    background: var(--bg-secondary, #3a3a3a);
    border: 1px solid var(--border-color, #555);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.15s;
}

.attack-buttons-grid .attack-btn:hover,
.attack-buttons-grid .action-btn:hover {
    background: var(--accent-color, #d4af37);
    color: #000;
}

.attack-buttons-grid .attack-btn:disabled,
.attack-buttons-grid .action-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: var(--bg-tertiary, #333);
    color: var(--text-muted, #666);
}

/* Special Actions */
.special-action-btn {
    padding: 6px 12px;
    background: rgba(156, 39, 176, 0.2);
    border: 1px solid #9c27b0;
    border-radius: 4px;
    color: #ce93d8;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.15s;
}

.special-action-btn:hover {
    background: rgba(156, 39, 176, 0.4);
}

.special-action-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* Legendary Actions */
.legendary-actions-section {
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px dashed var(--border-color, #444);
}

.legendary-title {
    margin: 0 0 8px;
    font-size: 0.85rem;
    color: #ffd700;
}

.legendary-buttons-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.legendary-btn {
    padding: 6px 12px;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 193, 7, 0.1) 100%);
    border: 1px solid #ffd700;
    border-radius: 4px;
    color: #ffd700;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.15s;
}

.legendary-btn:hover {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.4) 0%, rgba(255, 193, 7, 0.2) 100%);
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
}

.legendary-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-color: #888;
    color: #888;
}

/* Action Used Result */
.action-used {
    padding: 8px;
    background: rgba(212, 175, 55, 0.1);
    border-left: 3px solid var(--accent-color, #d4af37);
    border-radius: 4px;
    margin: 4px 0;
}

/* Multiattack Mode Indicator */
.multiattack-active-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 152, 0, 0.15) 100%);
    border: 1px solid #ffd700;
    border-radius: 6px;
    margin-bottom: 8px;
    animation: multiattackPulse 2s ease-in-out infinite;
}

@keyframes multiattackPulse {
    0%, 100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
    50% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.5); }
}

.multiattack-icon {
    font-size: 1.2rem;
}

.multiattack-text {
    font-weight: bold;
    color: #ffd700;
    font-size: 0.85rem;
}

.multiattack-count {
    color: var(--text-muted, #888);
    font-size: 0.8rem;
    margin-left: auto;
}

.cancel-multiattack-btn {
    padding: 2px 8px;
    background: rgba(244, 67, 54, 0.3);
    border: 1px solid #f44336;
    border-radius: 4px;
    color: #f44336;
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 0.15s;
}

.cancel-multiattack-btn:hover {
    background: #f44336;
    color: white;
}

/* Attack enabled in multiattack mode */
.attack-btn.multiattack-enabled {
    border-color: #ffd700 !important;
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
    animation: attackGlow 1.5s ease-in-out infinite;
}

@keyframes attackGlow {
    0%, 100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
    50% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
}

/* Target Selector */
.target-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
}

.target-selector label {
    font-size: 0.85rem;
    color: var(--text-muted, #888);
    white-space: nowrap;
}

.target-select {
    flex: 1;
    padding: 6px 10px;
    background: var(--input-bg, #1a1a1a);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-size: 0.85rem;
    cursor: pointer;
}

.target-select:focus {
    outline: none;
    border-color: var(--accent-color, #d4af37);
}

/* Spells Section */
.spells-section .concentration-container {
    margin-bottom: 8px;
}

.spells-mini-list {
    margin-top: 8px;
}

.spell-slots-mini {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
}

.slot-badge {
    background: rgba(156, 39, 176, 0.2);
    border: 1px solid #9c27b0;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    color: #ce93d8;
}

.prepared-mini {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.spell-mini-tag {
    background: rgba(33, 150, 243, 0.15);
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.7rem;
    color: #64b5f6;
}

.spell-btn-mini {
    background: rgba(33, 150, 243, 0.15);
    border: 1px solid rgba(33, 150, 243, 0.3);
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    color: #64b5f6;
    cursor: pointer;
    transition: all 0.15s;
    margin: 2px;
}

.spell-btn-mini:hover:not(:disabled) {
    background: rgba(33, 150, 243, 0.3);
    transform: translateY(-1px);
}

.spell-btn-mini:disabled,
.spell-btn-mini.depleted {
    opacity: 0.4;
    cursor: not-allowed;
    text-decoration: line-through;
}

.spell-btn-mini.cantrip {
    background: rgba(76, 175, 80, 0.15);
    border-color: rgba(76, 175, 80, 0.3);
    color: #81c784;
}

.spell-btn-mini.cantrip:hover:not(:disabled) {
    background: rgba(76, 175, 80, 0.3);
}

.spell-btn-mini.atwill {
    background: rgba(156, 39, 176, 0.15);
    border-color: rgba(156, 39, 176, 0.3);
    color: #ce93d8;
}

.spell-btn-mini.atwill:hover:not(:disabled) {
    background: rgba(156, 39, 176, 0.3);
}

.spell-btn-mini.perday {
    background: rgba(255, 152, 0, 0.15);
    border-color: rgba(255, 152, 0, 0.3);
    color: #ffb74d;
}

.spell-btn-mini.perday:hover:not(:disabled) {
    background: rgba(255, 152, 0, 0.3);
}

.slot-badge-btn {
    background: rgba(156, 39, 176, 0.2);
    border: 1px solid #9c27b0;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.75rem;
    color: #ce93d8;
    cursor: pointer;
    transition: all 0.15s;
    margin: 2px;
}

.slot-badge-btn:hover:not(:disabled) {
    background: rgba(156, 39, 176, 0.4);
    transform: translateY(-1px);
}

.slot-badge-btn:disabled,
.slot-badge-btn.depleted {
    opacity: 0.3;
    cursor: not-allowed;
    text-decoration: line-through;
}

.spell-mini-tag.cantrip {
    background: rgba(76, 175, 80, 0.15);
    color: #81c784;
}

.spell-mini-tag.atwill {
    background: rgba(156, 39, 176, 0.15);
    color: #ce93d8;
}

.spell-mini-tag.perday {
    background: rgba(255, 152, 0, 0.15);
    color: #ffb74d;
}

.spell-stats-mini {
    display: flex;
    gap: 8px;
    margin-bottom: 6px;
}

.spell-stat {
    background: rgba(156, 39, 176, 0.2);
    border: 1px solid #9c27b0;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    color: #ce93d8;
    font-weight: 500;
}

.spell-category-label {
    color: var(--text-muted, #888);
    font-size: 0.7rem;
    margin-right: 4px;
}

.cantrips-mini,
.atwill-mini,
.perday-mini,
.prepared-level-group {
    margin: 4px 0;
}

.more-spells {
    color: var(--text-muted, #888);
    font-size: 0.75rem;
    font-style: italic;
}

.no-spells {
    color: var(--text-muted, #666);
    font-size: 0.8rem;
    font-style: italic;
}

.open-spells-popup-btn-mini {
    margin-top: 8px;
    padding: 5px 10px;
    background: rgba(156, 39, 176, 0.2);
    border: 1px solid #9c27b0;
    border-radius: 4px;
    color: #ce93d8;
    cursor: pointer;
    font-size: 0.75rem;
    width: 100%;
}

/* Reserved Section (Notes) */
.reserved-section .combatant-notes {
    width: 100%;
    min-height: 80px;
    padding: 8px;
    background: var(--input-bg, #1a1a1a);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-size: 0.85rem;
    resize: vertical;
}

.reserved-section .combatant-notes:focus {
    outline: none;
    border-color: var(--accent-color, #d4af37);
}

/* Footer */
.combatant-card-footer {
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px solid var(--border-color, #3a3a3a);
    text-align: right;
}

.remove-combatant-btn {
    padding: 6px 12px;
    background: linear-gradient(135deg, #8b0000 0%, #5a0000 100%);
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    font-size: 0.8rem;
}

.remove-combatant-btn:hover {
    opacity: 0.9;
}
        `;
    },

    bindEvents() {
        const container = this.container;
        
        // Header buttons
        container.querySelector('#start-combat-btn')?.addEventListener('click', () => {
            startCombat();
            selectedCombatantId = null; // Reset per seguire il turno corrente
            showToast('Combattimento iniziato!', 'success');
        });

        container.querySelector('#next-turn-btn')?.addEventListener('click', () => {
            // Reset selezione PRIMA di nextTurn per seguire automaticamente il turno corrente
            selectedCombatantId = null;
            nextTurn();
        });

        container.querySelector('#end-combat-btn')?.addEventListener('click', () => {
            if (confirm('Terminare il combattimento?\n\nI combattenti rimarranno nella lista con le condizioni azzerate. Potrai ricominciare ritirando l\'iniziativa.')) {
                endCombat();
                selectedCombatantId = null;
                showToast('Combattimento terminato! Pronti per un nuovo scontro.', 'success');
            }
        });

        container.querySelector('#clear-combat-btn')?.addEventListener('click', () => {
            if (confirm('Svuotare il combattimento?')) {
                clearCombat();
                selectedCombatantId = null;
                showToast('Tracker svuotato.', 'info');
            }
        });

        // Source buttons - open popup
        container.querySelectorAll('.source-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const source = e.currentTarget.dataset.source;
                this.openPopup(source);
            });
        });

        // Popup close
        container.querySelector('.popup-close')?.addEventListener('click', () => {
            this.closePopup();
        });

        // Click outside popup to close
        container.querySelector('#source-popup-overlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'source-popup-overlay') {
                this.closePopup();
            }
        });

        // Popup content events (delegated)
        container.querySelector('#popup-content')?.addEventListener('click', (e) => {
            this.handlePopupClick(e);
        });

        container.querySelector('#popup-content')?.addEventListener('input', (e) => {
            this.handlePopupInput(e);
        });

        // Order list click
        container.querySelector('#combatants-order-list')?.addEventListener('click', (e) => {
            // Handle new initiative button
            if (e.target.classList.contains('new-initiative-btn')) {
                this.handleNewInitiative();
                return;
            }
            
            // Handle set target button
            if (e.target.classList.contains('set-target-btn')) {
                const combatantId = parseFloat(e.target.dataset.id);
                this.setTarget(combatantId);
                return;
            }
            
            const item = e.target.closest('.combatant-order-item');
            if (item && !e.target.classList.contains('order-init-input')) {
                const combatantId = parseFloat(item.dataset.id);
                this.selectCombatant(combatantId);
            }
        });

        // Order list initiative change (no jump)
        container.querySelector('#combatants-order-list')?.addEventListener('change', (e) => {
            if (e.target.classList.contains('order-init-input')) {
                const item = e.target.closest('.combatant-order-item');
                const combatantId = parseFloat(item.dataset.id);
                const newInit = parseInt(e.target.value, 10) || 0;
                updateMonsterProperty(combatantId, 'initiative', newInit);
            }
        });

        // Detail column events
        const detailColumn = container.querySelector('.combatant-detail-column');
        detailColumn?.addEventListener('click', (e) => this.handleDetailClick(e));
        detailColumn?.addEventListener('change', (e) => this.handleDetailChange(e));
        detailColumn?.addEventListener('input', (e) => this.handleDetailInput(e));
        detailColumn?.addEventListener('mouseover', (e) => this.handleDetailHover(e));
        detailColumn?.addEventListener('mouseout', (e) => this.handleDetailOut(e));
        
        // Conditions popup events
        const conditionsOverlay = container.querySelector('#conditions-popup-overlay');
        conditionsOverlay?.addEventListener('click', (e) => {
            if (e.target.id === 'conditions-popup-overlay') {
                this.closeConditionsPopup();
            }
        });
        
        const conditionsCloseBtn = conditionsOverlay?.querySelector('.popup-close');
        conditionsCloseBtn?.addEventListener('click', () => this.closeConditionsPopup());
        
        const conditionsContent = container.querySelector('#conditions-popup-content');
        conditionsContent?.addEventListener('click', (e) => this.handleConditionsPopupClick(e));
        
        // Spells popup events
        const spellsOverlay = container.querySelector('#spells-popup-overlay');
        spellsOverlay?.addEventListener('click', (e) => {
            if (e.target.id === 'spells-popup-overlay') {
                this.closeSpellsPopup();
            }
        });
        
        const spellsCloseBtn = spellsOverlay?.querySelector('.popup-close');
        spellsCloseBtn?.addEventListener('click', () => this.closeSpellsPopup());
        
        const spellsContent = container.querySelector('#spells-popup-content');
        spellsContent?.addEventListener('click', (e) => this.handleSpellsPopupClick(e));
        
        // Order list hover for condition tooltips
        const orderList = container.querySelector('#combatants-order-list');
        orderList?.addEventListener('mouseover', (e) => this.handleOrderListHover(e));
        orderList?.addEventListener('mouseout', (e) => this.handleOrderListOut(e));
    },

    // --- POPUP MANAGEMENT ---
    
    openPopup(source) {
        this.currentPopup = source;
        this.popupSearchTerm = '';
        this.popupTypeFilter = 'Tutti';
        
        const overlay = this.container.querySelector('#source-popup-overlay');
        const content = this.container.querySelector('#popup-content');
        
        if (!overlay || !content) return;
        
        content.innerHTML = this.getPopupContent(source);
        overlay.classList.remove('hidden');
        
        // Focus search input if present
        setTimeout(() => {
            content.querySelector('.popup-search-input')?.focus();
        }, 100);
    },

    closePopup() {
        const overlay = this.container.querySelector('#source-popup-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
        this.currentPopup = null;
    },
    
    // --- CONDITIONS POPUP ---
    
    openConditionsPopup(combatantId) {
        const overlay = this.container.querySelector('#conditions-popup-overlay');
        const content = this.container.querySelector('#conditions-popup-content');
        if (!overlay || !content) return;
        
        this.conditionsPopupCombatantId = combatantId;
        this.selectedConditions = {};
        
        content.innerHTML = this.getConditionsPopupContent(combatantId);
        overlay.classList.remove('hidden');
    },
    
    closeConditionsPopup() {
        const overlay = this.container.querySelector('#conditions-popup-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
        this.conditionsPopupCombatantId = null;
        this.selectedConditions = {};
    },
    
    getConditionsPopupContent(combatantId) {
        const combatants = getCombatState();
        const combatant = combatants.find(c => c.id === combatantId);
        const existingConditions = (combatant?.conditions || []).map(c => typeof c === 'string' ? c : c.name);
        
        const allConditions = Object.keys(conditionsDatabase);
        
        return `
            <div class="popup-header">
                <span>🩹 Gestisci Condizioni per ${combatant?.customName || combatant?.name || 'Combattente'}</span>
            </div>
            <p style="color: var(--text-muted, #888); font-size: 0.85rem; margin-bottom: 10px;">
                Seleziona le condizioni da aggiungere. Imposta la durata in turni (0 = permanente).
            </p>
            <div class="conditions-list">
                ${allConditions.map(condName => {
                    const cond = conditionsDatabase[condName];
                    const alreadyHas = existingConditions.includes(condName);
                    return `
                        <div class="condition-card ${alreadyHas ? 'already-has' : ''}" 
                             data-condition="${condName}" 
                             data-has="${alreadyHas}">
                            <h4>${condName}</h4>
                            <p>${cond?.summary || ''}</p>
                            ${alreadyHas ? '<small style="color: #4caf50;">✓ Già attiva</small>' : ''}
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="condition-duration-selector">
                <label>Durata:</label>
                <input type="number" id="condition-duration-input" value="0" min="0" max="100">
                <span>turni (0 = permanente)</span>
            </div>
            <button class="apply-conditions-btn" id="apply-conditions-btn" disabled>
                Applica Condizioni Selezionate
            </button>
        `;
    },
    
    handleConditionsPopupClick(e) {
        const card = e.target.closest('.condition-card');
        if (card && card.dataset.has !== 'true') {
            const condName = card.dataset.condition;
            
            // Toggle selection
            if (this.selectedConditions[condName]) {
                delete this.selectedConditions[condName];
                card.classList.remove('selected');
            } else {
                this.selectedConditions[condName] = true;
                card.classList.add('selected');
            }
            
            // Update button state
            const applyBtn = this.container.querySelector('#apply-conditions-btn');
            if (applyBtn) {
                applyBtn.disabled = Object.keys(this.selectedConditions).length === 0;
            }
        }
        
        // Apply conditions button
        if (e.target.id === 'apply-conditions-btn') {
            this.applySelectedConditions();
        }
    },
    
    applySelectedConditions() {
        const durationInput = this.container.querySelector('#condition-duration-input');
        const duration = durationInput ? parseInt(durationInput.value, 10) || 0 : 0;
        
        const combatantId = this.conditionsPopupCombatantId;
        if (!combatantId) return;
        
        // Add all selected conditions
        Object.keys(this.selectedConditions).forEach(condName => {
            addConditionToCombatant(combatantId, condName, duration);
        });
        
        showToast(`${Object.keys(this.selectedConditions).length} condizioni applicate!`, 'success');
        this.closeConditionsPopup();
    },
    
    // --- SPELLS POPUP ---
    
    handleSpellsPopupClick(e) {
        // Apply spell button
        if (e.target.id === 'apply-spell-btn') {
            this.applyActiveSpell();
            return;
        }
        
        // Break concentration button
        if (e.target.classList.contains('break-btn') && e.target.classList.contains('concentration-btn')) {
            const combatantId = parseFloat(e.target.dataset.id);
            if (combatantId) {
                breakConcentration(combatantId, true);
                // Refresh popup content
                const content = this.container.querySelector('#spells-popup-content');
                if (content) {
                    content.innerHTML = this.getSpellsPopupContent(combatantId);
                }
            }
            return;
        }
    },
    
    applyActiveSpell() {
        const combatantId = this.spellsPopupCombatantId;
        if (!combatantId) return;
        
        const nameInput = this.container.querySelector('#spell-name-input');
        const durationInput = this.container.querySelector('#spell-duration-input');
        const typeInput = this.container.querySelector('#spell-type-input');
        const concentrationInput = this.container.querySelector('#spell-concentration-input');
        
        const name = nameInput?.value?.trim();
        if (!name) {
            showToast('Inserisci il nome dell\'incantesimo', 'warning');
            return;
        }
        
        const duration = parseInt(durationInput?.value || '0', 10);
        const type = typeInput?.value || 'effect';
        const requiresConcentration = concentrationInput?.checked || false;
        
        // Check for existing concentration if this spell requires it
        if (requiresConcentration) {
            const existingConc = getConcentration(combatantId);
            if (existingConc) {
                if (!confirm(`${existingConc.spellName} è già attivo come concentrazione. Vuoi sostituirlo con ${name}?`)) {
                    return;
                }
            }
        }
        
        // Add the active spell
        addActiveSpell(combatantId, {
            name: name,
            duration: duration,
            type: type,
            concentration: requiresConcentration,
            description: ''
        });
        
        showToast(`${name} aggiunto come effetto attivo!`, 'success');
        this.closeSpellsPopup();
    },
    
    // --- CONDITION TAGS & TOOLTIPS ---
    
    renderConditionTags(combatant) {
        if (!combatant.conditions || combatant.conditions.length === 0) {
            return '';
        }
        
        const tags = combatant.conditions.map(cond => {
            const condName = typeof cond === 'string' ? cond : cond.name;
            const duration = typeof cond === 'object' ? cond.duration : 0;
            const isExpiring = duration > 0 && duration <= 1;
            const durationText = duration > 0 ? `${duration}` : '∞';
            
            return `
                <span class="condition-tag ${isExpiring ? 'expiring' : ''}" 
                      data-condition="${condName}"
                      data-duration="${duration}"
                      title="${condName}${duration > 0 ? ` (${duration} turni)` : ' (permanente)'}">
                    ${condName}${duration > 0 ? ` (${durationText})` : ''}
                </span>
            `;
        }).join('');
        
        return `<div class="condition-tags">${tags}</div>`;
    },
    
    handleOrderListHover(e) {
        const tag = e.target.closest('.condition-tag');
        if (!tag) return;
        
        const condName = tag.dataset.condition;
        if (!condName) return;
        
        // Get condition info
        const condInfo = conditionsDatabase[condName];
        if (!condInfo) return;
        
        // Remove any existing tooltip
        this.removeConditionTooltip();
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'condition-tooltip';
        tooltip.id = 'condition-tooltip';
        
        const duration = tag.dataset.duration;
        const durationText = duration === '0' ? 'Permanente' : `${duration} turni rimanenti`;
        
        tooltip.innerHTML = `
            <h4>${condName}</h4>
            <p>${condInfo.description || condInfo.summary || ''}</p>
            <div class="duration-info">⏱️ ${durationText}</div>
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = tag.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        let top = rect.bottom + 8;
        
        // Keep in viewport
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top + tooltipRect.height > window.innerHeight - 10) {
            top = rect.top - tooltipRect.height - 8;
        }
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    },
    
    handleOrderListOut(e) {
        const tag = e.target.closest('.condition-tag');
        if (!tag) return;
        
        // Small delay to allow moving to tooltip
        setTimeout(() => {
            if (!document.querySelector('.condition-tag:hover')) {
                this.removeConditionTooltip();
            }
        }, 100);
    },
    
    removeConditionTooltip() {
        const tooltip = document.getElementById('condition-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    },

    getPopupContent(source) {
        switch (source) {
            case 'pcs': return generatePcsPopupContent();
            case 'npcs': return generateNpcsPopupContent(this.popupSearchTerm);
            case 'monsters': return generateMonstersPopupContent(this.popupSearchTerm, this.popupTypeFilter);
            case 'encounters': return generateEncountersPopupContent();
            default: return '';
        }
    },

    refreshPopup() {
        if (this.currentPopup) {
            const content = this.container.querySelector('#popup-content');
            if (content) {
                // Salva il focus corrente e la posizione del cursore
                const activeInput = content.querySelector('.popup-search-input');
                const searchTerm = activeInput?.value || '';
                const cursorPos = activeInput?.selectionStart || 0;
                
                // Aggiorna il contenuto
                content.innerHTML = this.getPopupContent(this.currentPopup);
                
                // Ripristina il focus e la posizione del cursore
                const newInput = content.querySelector('.popup-search-input');
                if (newInput && searchTerm) {
                    newInput.focus();
                    newInput.setSelectionRange(cursorPos, cursorPos);
                }
            }
        }
    },

    handlePopupClick(e) {
        const target = e.target;
        
        // Add all PCs
        if (target.classList.contains('btn-add-all-pcs')) {
            this.addAllPcsToCombat();
            return;
        }
        
        // Add single source
        const addBtn = target.closest('.btn-add-source');
        if (addBtn) {
            const type = addBtn.dataset.type;
            if (type === 'pc') {
                const pc = availablePcs.find(p => p.id === addBtn.dataset.id);
                if (pc) addPcToCombat(pc);
            } else if (type === 'npc') {
                const npc = availableNpcs.find(n => n.id === addBtn.dataset.id);
                if (npc) addNpcToCombat(npc);
            } else if (type === 'monster') {
                const monster = monsterDatabase.find(m => m.index === addBtn.dataset.index);
                if (monster) addMonsterToCombat(monster);
            }
            return;
        }
        
        // Import encounter
        if (target.classList.contains('btn-import-encounter-popup')) {
            const encId = target.dataset.id;
            const enc = savedEncounters.find(e => e.id === encId);
            if (enc) {
                importEncounter(enc, availableNpcs);
                this.closePopup();
            }
            return;
        }
        
        // Type filter
        if (target.classList.contains('popup-filter-btn')) {
            this.popupTypeFilter = target.dataset.type;
            this.refreshPopup();
            return;
        }
    },

    handlePopupInput(e) {
        if (e.target.classList.contains('popup-search-input')) {
            this.popupSearchTerm = e.target.value;
            this.refreshPopup();
        }
    },

    addAllPcsToCombat() {
        if (availablePcs.length === 0) {
            showToast('Nessun PG da aggiungere.', 'warning');
            return;
        }
        
        const combatants = getCombatState();
        let added = 0;
        
        availablePcs.forEach(pc => {
            const alreadyThere = combatants.some(c => c.originalPcId === pc.id);
            if (!alreadyThere) {
                addPcToCombat(pc);
                added++;
            }
        });
        
        if (added > 0) {
            showToast(`${added} PG aggiunti al combattimento!`, 'success');
        } else {
            showToast('Tutti i PG sono già nel combattimento.', 'info');
        }
        
        this.closePopup();
    },

    // --- COMBATANT MANAGEMENT ---

    selectCombatant(combatantId) {
        selectedCombatantId = combatantId;
        
        const combatants = getCombatState();
        const combatant = combatants.find(c => c.id === combatantId);
        if (combatant) {
            this.renderCombatantDetail(combatant);
        }
        
        // Update selection in order list
        this.container.querySelectorAll('.combatant-order-item').forEach(item => {
            item.classList.toggle('selected', parseFloat(item.dataset.id) === combatantId);
        });
    },

    renderCombatantDetail(combatant) {
        const detailView = this.container.querySelector('#combatant-detail-view');
        if (!detailView) return;
        
        // Determina info da mostrare
        const crDisplay = combatant.challenge_rating ? `CR ${combatant.challenge_rating}` : '';
        const classDisplay = combatant.className ? `${combatant.className} Lv.${combatant.classLevel || 1}` : '';
        const typeInfo = crDisplay || classDisplay || '';
        
        // HP bar visual
        const hpPercent = Math.max(0, Math.min(100, (combatant.currentHp / combatant.maxHp) * 100));
        const hpBarColor = hpPercent > 50 ? '#4caf50' : hpPercent > 25 ? '#ff9800' : '#f44336';
        const isDead = combatant.currentHp <= 0;
        
        // Bersaglio selezionato (persistente)
        const selectedTargetId = combatant.selectedTarget || null;
        
        // Lista combattenti per il selettore bersagli (con CA)
        const targetOptions = this.combatants
            .filter(c => c.id !== combatant.id)
            .map(c => {
                const ac = c.armor_class?.[0]?.value || c.armor_class || 10;
                const isSelected = selectedTargetId && parseFloat(selectedTargetId) === parseFloat(c.id) ? 'selected' : '';
                return `<option value="${c.id}" ${isSelected}>${c.customName || c.name} (CA ${ac})</option>`;
            })
            .join('');
        
        // Multiattack mode indicator
        const multiattackMode = combatant.actionTracker?.multiattackMode || null;
        
        // Formatta le condizioni attive con durata
        const conditionsHtml = this.renderActiveConditions(combatant);
        
        // Concentrazione attiva
        const concentrationHtml = this.renderConcentration(combatant);
        
        // Incantesimi attivi (buff/debuff)
        const activeSpellsHtml = this.renderActiveSpellsUI(combatant);
        
        // Death Saves per PG a 0 HP
        const deathSavesHtml = this.renderDeathSaves(combatant);
        
        detailView.innerHTML = `
            <div class="combatant-card ${isDead ? 'unconscious' : ''}" data-id="${combatant.id}">
                <!-- HEADER FISSO - UNICA Riga: sinistra nome/tag/CR, destra pulsante rimuovi -->
                <div class="combatant-card-header-fixed">
                    <div class="header-left">
                        <input type="text" class="combatant-name-input" value="${combatant.customName || combatant.name}" 
                               data-id="${combatant.id}" placeholder="Nome combattente">
                        ${getSourceBadge(combatant)}
                        <span class="type-info">${typeInfo}</span>
                    </div>
                    <div class="header-right">
                        <button class="remove-combatant-btn" data-id="${combatant.id}" title="Rimuovi dal combattimento">🗑️</button>
                    </div>
                </div>
                
                <!-- GRIGLIA 2x2 -->
                <div class="combatant-grid">
                    <!-- 1. ALTO SINISTRA: HP, Danni, Effetti -->
                    <div class="grid-cell hp-section">
                        <h6 class="cell-title">❤️ Punti Ferita</h6>
                        <div class="hp-controls">
                            <button class="hp-btn hp-minus" data-id="${combatant.id}" title="-5 PF">−</button>
                            <input type="number" class="stat-input hp-current" value="${combatant.currentHp}" data-id="${combatant.id}">
                            <button class="hp-btn hp-plus" data-id="${combatant.id}" title="+5 PF">+</button>
                            <span class="hp-max">/ ${combatant.maxHp}</span>
                        </div>
                        <div class="hp-bar-container">
                            <div class="hp-bar" style="width: ${hpPercent}%; background: ${hpBarColor};"></div>
                        </div>
                        <div class="stat-row-mini">
                            <span class="stat-mini"><strong>CA:</strong> ${combatant.armor_class?.[0]?.value || combatant.armor_class || 10}</span>
                            <span class="stat-mini"><strong>Init:</strong> <input type="number" class="init-mini-input" value="${combatant.initiative || 0}" data-id="${combatant.id}"></span>
                        </div>
                        
                        <!-- Damage/Healing Input -->
                        <div class="damage-heal-row">
                            <input type="text" class="damage-input" placeholder="Danno (es. 2d6+3)" data-id="${combatant.id}">
                            <button class="apply-damage-btn" data-id="${combatant.id}" title="Applica danno">⚔️</button>
                            <button class="apply-heal-btn" data-id="${combatant.id}" title="Applica cura">💚</button>
                        </div>
                        
                        ${deathSavesHtml}
                        
                        <!-- Condizioni attive -->
                        <div class="conditions-mini">
                            ${conditionsHtml}
                        </div>
                        <button class="open-conditions-popup-btn-mini" data-id="${combatant.id}">➕ Condizioni</button>
                    </div>
                    
                    <!-- 2. ALTO DESTRA: Azioni/Attacchi con selettore bersaglio -->
                    <div class="grid-cell actions-section">
                        <h6 class="cell-title">⚔️ Azioni ${this.renderActionsCounter(combatant)}</h6>
                        ${multiattackMode ? this.renderMultiattackIndicator(combatant, multiattackMode) : ''}
                        <div class="target-selector">
                            <label>🎯 Bersaglio:</label>
                            <select class="target-select" data-attacker-id="${combatant.id}">
                                <option value="free">🆓 Bersaglio Libero</option>
                                ${targetOptions}
                            </select>
                        </div>
                        ${this.renderActionsList(combatant)}
                        ${this.renderLegendaryActions(combatant)}
                        <div class="results-box-mini"></div>
                    </div>
                    
                    <!-- 3. BASSO SINISTRA: Incantesimi -->
                    <div class="grid-cell spells-section">
                        <h6 class="cell-title">🔮 Incantesimi</h6>
                        ${concentrationHtml}
                        ${activeSpellsHtml}
                        <div class="spells-mini-list">
                            ${this.renderSpellsMini(combatant)}
                        </div>
                        <button class="open-spells-popup-btn-mini" data-id="${combatant.id}">➕ Gestisci Incantesimi</button>
                    </div>
                    
                    <!-- 4. BASSO DESTRA: Riservato -->
                    <div class="grid-cell reserved-section">
                        <h6 class="cell-title">📋 Note</h6>
                        <textarea class="combatant-notes" placeholder="Note per questo combattente..." data-id="${combatant.id}">${combatant.notes || ''}</textarea>
                    </div>
                </div>
            </div>
        `;
    },
    
    getSourceTag(combatant) {
        const sourceType = combatant.sourceType || 'monster';
        if (sourceType === 'pc') return 'PG';
        if (sourceType === 'npc') return combatant.tag || 'PNG';
        return 'Mostro';
    },
    
    /**
     * Renderizza il contatore azioni disponibili.
     */
    renderActionsCounter(combatant) {
        const tracker = combatant.actionTracker;
        if (!tracker) {
            return '<span class="actions-available">1 azione</span>';
        }
        
        const actionAvailable = !tracker.actionUsed;
        const parts = [];
        
        // Azione standard
        parts.push(actionAvailable ? '✅ Azione' : '❌ Azione');
        
        // Reazione
        parts.push(!tracker.reactionUsed ? '🔄 Reazione' : '⏳ Reazione');
        
        // Azioni leggendarie (solo se ne ha)
        if (tracker.legendaryActionsMax > 0) {
            const legRemaining = tracker.legendaryActionsMax - tracker.legendaryActionsUsed;
            parts.push(`👑 ${legRemaining}/${tracker.legendaryActionsMax}`);
        }
        
        return `<span class="actions-counter ${actionAvailable ? '' : 'action-used'}">${parts.join(' | ')}</span>`;
    },
    
    /**
     * Renderizza l'indicatore di modalità multiattacco.
     */
    renderMultiattackIndicator(combatant, mode) {
        if (!mode) return '';
        
        const remaining = mode.attacksRemaining || 0;
        const total = mode.totalAttacks || 0;
        
        return `
            <div class="multiattack-active-indicator">
                <span class="multiattack-icon">⚔️⚔️⚔️</span>
                <span class="multiattack-text">MULTIATTACCO ATTIVO</span>
                <span class="multiattack-count">${remaining}/${total} attacchi rimanenti</span>
                <button class="cancel-multiattack-btn" data-id="${combatant.id}">✕ Annulla</button>
            </div>
        `;
    },
    
    /**
     * Renderizza la lista di TUTTE le azioni standard.
     */
    renderActionsList(combatant) {
        const actions = combatant.actions || [];
        if (actions.length === 0) {
            return '<p class="no-actions">Nessuna azione</p>';
        }
        
        const tracker = combatant.actionTracker || {};
        const actionUsed = tracker.actionUsed || false;
        const multiattackMode = tracker.multiattackMode || null;
        
        // Separa azioni in categorie
        const attacks = actions.filter(a => a.attack_bonus !== undefined);
        const multiattacks = actions.filter(a => 
            a.multiattack_type || 
            a.name?.toLowerCase().includes('multiattacco') || 
            a.name?.toLowerCase().includes('multiattack')
        );
        const specialActions = actions.filter(a => 
            a.attack_bonus === undefined && 
            !a.multiattack_type && 
            !a.name?.toLowerCase().includes('multiattacco') && 
            !a.name?.toLowerCase().includes('multiattack')
        );
        
        let html = '<div class="actions-list">';
        
        // Multiattacchi (mostrati per primi) - SEMPRE ABILITATI se non in modalità multiattacco
        if (multiattacks.length > 0) {
            html += '<div class="action-category"><small class="category-label">⚡ Multiattacco</small><div class="attack-buttons-grid">';
            multiattacks.forEach(a => {
                // Multiattacco disabilitato solo se siamo GIÀ in modalità multiattacco o azione usata
                const disabled = (multiattackMode || actionUsed) ? 'disabled' : '';
                const attackCount = this.parseMultiattackCount(a, attacks);
                html += `<button class="multiattack-btn ${disabled}" data-action='${JSON.stringify(a).replace(/'/g, "&apos;")}' data-attacker-id="${combatant.id}" data-attack-count="${attackCount}" ${disabled}>${a.name} (${attackCount} attacchi)</button>`;
            });
            html += '</div></div>';
        }
        
        // Attacchi - Abilitati se: azione non usata OPPURE siamo in modalità multiattacco con attacchi rimanenti
        if (attacks.length > 0) {
            html += '<div class="action-category"><small class="category-label">⚔️ Attacchi</small><div class="attack-buttons-grid">';
            attacks.forEach(a => {
                let disabled = '';
                let extraClass = '';
                
                if (multiattackMode) {
                    // In modalità multiattacco: attacchi abilitati
                    extraClass = 'multiattack-enabled';
                } else if (actionUsed) {
                    // Azione già usata: disabilitato
                    disabled = 'disabled';
                }
                
                const usesInfo = this.getUsesInfo(tracker, a.name);
                html += `<button class="attack-btn ${extraClass} ${disabled}" data-attack='${JSON.stringify(a).replace(/'/g, "&apos;")}' data-attacker-id="${combatant.id}" data-action-type="action" ${disabled}>${a.name}${usesInfo}</button>`;
            });
            html += '</div></div>';
        }
        
        // Azioni speciali - SOLO se azione non usata e NON in modalità multiattacco
        if (specialActions.length > 0) {
            html += '<div class="action-category"><small class="category-label">✨ Azioni Speciali</small><div class="attack-buttons-grid">';
            specialActions.forEach(a => {
                const disabled = (actionUsed || multiattackMode) ? 'disabled' : '';
                const usesInfo = this.getUsesInfo(tracker, a.name);
                const hasTooltip = a.desc ? `title="${a.desc.substring(0, 100)}..."` : '';
                html += `<button class="special-action-btn ${disabled}" data-action='${JSON.stringify(a).replace(/'/g, "&apos;")}' data-attacker-id="${combatant.id}" data-action-type="action" ${disabled} ${hasTooltip}>✨ ${a.name}${usesInfo}</button>`;
            });
            html += '</div></div>';
        }
        
        html += '</div>';
        return html;
    },
    
    /**
     * Parse il numero di attacchi dal multiattacco.
     */
    parseMultiattackCount(multiattack, attacks) {
        // Cerca nel campo actions[] del multiattacco
        if (multiattack.actions && Array.isArray(multiattack.actions)) {
            return multiattack.actions.reduce((total, action) => {
                const count = parseInt(action.count, 10) || 1;
                return total + count;
            }, 0);
        }
        
        // Cerca nella descrizione (es. "effettua tre attacchi")
        if (multiattack.desc) {
            const match = multiattack.desc.match(/(\d+)/);
            if (match) return parseInt(match[1], 10);
        }
        
        // Default: numero di attacchi disponibili
        return attacks.length || 1;
    },
    
    /**
     * Renderizza le azioni leggendarie.
     */
    renderLegendaryActions(combatant) {
        const legendary = combatant.legendary_actions || [];
        if (legendary.length === 0) return '';
        
        const tracker = combatant.actionTracker || { legendaryActionsUsed: 0, legendaryActionsMax: 3 };
        const remaining = tracker.legendaryActionsMax - tracker.legendaryActionsUsed;
        
        let html = `
            <div class="legendary-actions-section">
                <h6 class="legendary-title">👑 Azioni Leggendarie (${remaining}/${tracker.legendaryActionsMax})</h6>
                <div class="legendary-buttons-grid">
        `;
        
        legendary.forEach(a => {
            const disabled = remaining <= 0 ? 'disabled' : '';
            // Alcune azioni leggendarie costano più di 1 azione
            const cost = a.desc?.includes('Costo: 2') ? 2 : a.desc?.includes('Costo: 3') ? 3 : 1;
            const costLabel = cost > 1 ? ` (${cost})` : '';
            
            html += `<button class="legendary-btn ${disabled}" data-action='${JSON.stringify(a).replace(/'/g, "&apos;")}' data-attacker-id="${combatant.id}" data-action-type="legendary" data-cost="${cost}" ${disabled}>${a.name}${costLabel}</button>`;
        });
        
        html += '</div></div>';
        return html;
    },
    
    /**
     * Ottiene info sugli usi rimanenti di un'abilità.
     */
    getUsesInfo(tracker, actionName) {
        if (!tracker.abilityUses) return '';
        const key = `action_${actionName}`;
        const use = tracker.abilityUses[key];
        if (use) {
            return ` <small>(${use.current}/${use.max})</small>`;
        }
        return '';
    },
    
    renderSpellsMini(combatant) {
        if (!combatant.spellState) return '<p class="no-spells">Nessun incantesimo</p>';
        
        const { 
            preparedSpells = [], 
            remainingSlots = {}, 
            maxSlots = {},
            cantrips = [],
            atWillSpells = [],
            perDaySpells = [],
            allSpells = [],
            dc,
            attackBonus,
            ability,
            isPcCaster = false
        } = combatant.spellState;
        
        let html = '';
        
        // Mostra CD e attack bonus se disponibili
        if (dc || attackBonus) {
            html += `<div class="spell-stats-mini">`;
            if (dc) html += `<span class="spell-stat" title="CD Incantesimi">CD ${dc}</span>`;
            if (attackBonus) html += `<span class="spell-stat" title="Bonus per colpire">+${attackBonus}</span>`;
            html += `</div>`;
        }
        
        // Mostra slot disponibili (cliccabili per usarli)
        // Per i PG mostra formato "L1: 4/4" (rimanenti/massimi)
        if (remainingSlots && Object.keys(remainingSlots).length > 0) {
            const slotsHtml = Object.entries(remainingSlots)
                .filter(([l, c]) => parseInt(l) > 0)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([l, c]) => {
                    const max = maxSlots[l] || c;
                    const depleted = c <= 0 ? 'depleted' : '';
                    const display = isPcCaster ? `${c}/${max}` : `${c}`;
                    return `<button class="slot-badge-btn ${depleted}" data-combatant-id="${combatant.id}" data-slot-level="${l}" ${c <= 0 ? 'disabled' : ''}>L${l}: ${display}</button>`;
                })
                .join(' ');
            if (slotsHtml) {
                html += `<div class="spell-slots-mini">${slotsHtml}</div>`;
            }
        }
        
        // Per i PG incantatori, mostriamo SOLO gli slot (non i nomi degli incantesimi)
        if (isPcCaster) {
            return html || '<p class="no-spells">Nessuno slot disponibile</p>';
        }
        
        // Mostra trucchetti (cliccabili) - TUTTI visibili
        if (cantrips && cantrips.length > 0) {
            html += `<div class="cantrips-mini">`;
            html += `<span class="spell-category-label">Trucchetti:</span> `;
            html += cantrips.map(s => {
                const name = typeof s === 'string' ? s : s.name;
                const spellData = typeof s === 'object' ? JSON.stringify(s).replace(/"/g, '&quot;') : `"${name}"`;
                return `<button class="spell-btn-mini cantrip" data-combatant-id="${combatant.id}" data-spell='${spellData}' data-spell-type="cantrip" title="Lancia ${name}">${name}</button>`;
            }).join(' ');
            html += '</div>';
        }
        
        // Mostra incantesimi a volontà (cliccabili) - TUTTI visibili
        if (atWillSpells && atWillSpells.length > 0) {
            html += `<div class="atwill-mini">`;
            html += `<span class="spell-category-label">A volontà:</span> `;
            html += atWillSpells.map(s => {
                const name = typeof s === 'string' ? s : s.name;
                const spellData = typeof s === 'object' ? JSON.stringify(s).replace(/"/g, '&quot;') : `"${name}"`;
                return `<button class="spell-btn-mini atwill" data-combatant-id="${combatant.id}" data-spell='${spellData}' data-spell-type="atwill" title="Lancia ${name} (a volontà)">∞ ${name}</button>`;
            }).join(' ');
            html += '</div>';
        }
        
        // Mostra incantesimi X al giorno (cliccabili con contatore) - TUTTI visibili
        if (perDaySpells && perDaySpells.length > 0) {
            html += `<div class="perday-mini">`;
            html += `<span class="spell-category-label">Al giorno:</span> `;
            html += perDaySpells.map(s => {
                const name = typeof s === 'string' ? s : s.name;
                const remaining = s.usesRemaining ?? s.usage?.times ?? 1;
                const maxUses = s.maxUses || s.usage?.times || 1;
                const depleted = remaining <= 0 ? 'depleted' : '';
                const spellData = JSON.stringify(s).replace(/"/g, '&quot;');
                return `<button class="spell-btn-mini perday ${depleted}" data-combatant-id="${combatant.id}" data-spell='${spellData}' data-spell-type="perday" ${remaining <= 0 ? 'disabled' : ''} title="Lancia ${name} (${remaining}/${maxUses} rimanenti)">${remaining}/${maxUses} ${name}</button>`;
            }).join(' ');
            html += '</div>';
        }
        
        // Mostra incantesimi preparati organizzati PER LIVELLO
        if (preparedSpells && preparedSpells.length > 0) {
            // Raggruppa per livello
            const spellsByLevel = {};
            preparedSpells.forEach(p => {
                const name = typeof p === 'string' ? p : p.name;
                const level = typeof p === 'object' && p.level ? p.level : 1;
                if (!spellsByLevel[level]) spellsByLevel[level] = [];
                spellsByLevel[level].push({ name, level, original: p });
            });
            
            // Ordina i livelli
            const sortedLevels = Object.keys(spellsByLevel).sort((a, b) => parseInt(a) - parseInt(b));
            
            sortedLevels.forEach(level => {
                const levelNum = parseInt(level);
                const levelLabel = levelNum === 0 ? 'Trucchetti' : `Livello ${levelNum}`;
                const hasSlot = remainingSlots[levelNum] > 0;
                
                html += `<div class="prepared-level-group">`;
                html += `<span class="spell-category-label">${levelLabel}:</span> `;
                html += spellsByLevel[level].map(p => {
                    const depleted = !hasSlot && levelNum > 0 ? 'depleted' : '';
                    const spellData = JSON.stringify(typeof p.original === 'object' ? p.original : { name: p.name, level: p.level }).replace(/"/g, '&quot;');
                    return `<button class="spell-btn-mini ${depleted}" data-combatant-id="${combatant.id}" data-spell='${spellData}' data-spell-type="prepared" data-spell-level="${p.level}" ${!hasSlot && levelNum > 0 ? 'disabled' : ''} title="Lancia ${p.name} (L${p.level})">${p.name}</button>`;
                }).join(' ');
                html += '</div>';
            });
        }
        
        return html || '<p class="no-spells">Nessun incantesimo preparato</p>';
    },

    
    renderDeathSaves(combatant) {
        // Solo per PG (sourceType === 'pc') e solo se a 0 HP
        if (combatant.sourceType !== 'pc' || combatant.currentHp > 0) {
            return '';
        }
        
        const successes = combatant.deathSaves?.successes || 0;
        const failures = combatant.deathSaves?.failures || 0;
        const isStabilized = combatant.deathSaves?.stabilized || false;
        
        if (isStabilized) {
            return `
                <div class="death-saves-container stabilized">
                    <span class="death-saves-label">💀 Stabilizzato</span>
                    <button class="revive-btn" data-id="${combatant.id}" title="Riporta in vita (1 HP)">❤️ Riporta in vita</button>
                </div>
            `;
        }
        
        const isDead = failures >= 3;
        
        if (isDead) {
            return `
                <div class="death-saves-container dead">
                    <span class="death-saves-label">💀 Morto</span>
                </div>
            `;
        }
        
        const successesHtml = [0, 1, 2].map(i => 
            `<span class="death-save-indicator ${i < successes ? 'success' : ''}">${i < successes ? '🟢' : '⚪'}</span>`
        ).join('');
        
        const failuresHtml = [0, 1, 2].map(i => 
            `<span class="death-save-indicator ${i < failures ? 'failure' : ''}">${i < failures ? '🔴' : '⚪'}</span>`
        ).join('');
        
        return `
            <div class="death-saves-container">
                <div class="death-saves-row">
                    <span class="death-saves-label">💀 Tiri Salvezza Morte</span>
                </div>
                <div class="death-saves-trackers">
                    <div class="death-saves-group">
                        <span class="death-saves-sublabel">Successi:</span>
                        <div class="death-saves-icons">${successesHtml}</div>
                        <button class="death-save-btn success-btn" data-id="${combatant.id}" data-type="success" ${successes >= 3 ? 'disabled' : ''}>+1</button>
                    </div>
                    <div class="death-saves-group">
                        <span class="death-saves-sublabel">Fallimenti:</span>
                        <div class="death-saves-icons">${failuresHtml}</div>
                        <button class="death-save-btn failure-btn" data-id="${combatant.id}" data-type="failure" ${failures >= 3 ? 'disabled' : ''}>+1</button>
                    </div>
                </div>
                <button class="roll-death-save-btn" data-id="${combatant.id}">🎲 Tira Salvezza Morte</button>
            </div>
        `;
    },
    
    getTargetName() {
        if (!this.targetCombatant) return '';
        const combatants = getCombatState();
        const target = combatants.find(c => c.id === this.targetCombatant);
        return target?.customName || target?.name || 'Sconosciuto';
    },
    
    renderActiveConditions(combatant) {
        if (!combatant.conditions || combatant.conditions.length === 0) {
            return '';
        }
        
        return combatant.conditions.map(cond => {
            const condName = typeof cond === 'string' ? cond : cond.name;
            const duration = typeof cond === 'object' ? cond.duration : 0;
            const durationText = duration > 0 ? `${duration} turni` : '∞';
            const isExpiring = duration > 0 && duration <= 1;
            
            return `
                <span class="active-condition-badge ${isExpiring ? 'expiring' : ''}" 
                      data-condition="${condName}" data-combatant="${combatant.id}">
                    ${condName}
                    <span class="duration" title="Durata rimanente">${durationText}</span>
                    <span class="remove-btn" data-condition="${condName}">×</span>
                </span>
            `;
        }).join('');
    },
    
    renderConcentration(combatant) {
        if (!combatant.concentration?.spellName) {
            return '';
        }
        
        const conc = combatant.concentration;
        const durationText = conc.duration > 0 ? `${conc.duration} turni rimanenti` : 'Fino a quando interrotto';
        
        return `
            <div class="concentration-container">
                <span class="concentration-icon">🔮</span>
                <div class="concentration-info">
                    <div class="concentration-spell">${conc.spellName}</div>
                    <div class="concentration-duration">${durationText}</div>
                </div>
                <div class="concentration-actions">
                    <button class="concentration-btn break-btn" data-id="${combatant.id}" 
                            title="Interrompi concentrazione (fallimento tiro o volontariamente)">
                        💔 Interrompi
                    </button>
                </div>
            </div>
        `;
    },
    
    renderActiveSpellsUI(combatant) {
        const activeSpells = combatant.activeSpells || [];
        const concentrationSpell = combatant.concentration?.spellName;
        
        // Filtra gli incantesimi che non sono di concentrazione (quelli sono mostrati separatamente)
        const otherSpells = activeSpells.filter(s => !s.concentration || s.name !== concentrationSpell);
        
        const spellsHtml = otherSpells.map(spell => {
            const durationText = spell.duration > 0 ? `${spell.duration}` : '∞';
            const typeClass = spell.type || 'effect';
            
            return `
                <span class="active-spell-badge ${typeClass}" data-spell="${spell.name}" data-combatant="${combatant.id}">
                    ${spell.name}
                    <span class="duration" title="Durata rimanente">${durationText}</span>
                    <span class="remove-btn" data-spell="${spell.name}">×</span>
                </span>
            `;
        }).join('');
        
        return `
            <div class="active-spells-container">
                <div class="active-spells-header">
                    <h5>✨ Effetti Attivi</h5>
                </div>
                <div class="active-spells-list">
                    ${spellsHtml || '<span style="color: var(--text-muted); font-size: 0.8rem;">Nessun effetto attivo</span>'}
                </div>
            </div>
        `;
    },
    
    openSpellsPopup(combatantId) {
        const overlay = this.container.querySelector('#spells-popup-overlay');
        const content = this.container.querySelector('#spells-popup-content');
        if (!overlay || !content) return;
        
        this.spellsPopupCombatantId = combatantId;
        
        content.innerHTML = this.getSpellsPopupContent(combatantId);
        overlay.classList.remove('hidden');
    },
    
    closeSpellsPopup() {
        const overlay = this.container.querySelector('#spells-popup-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
        this.spellsPopupCombatantId = null;
    },
    
    getSpellsPopupContent(combatantId) {
        const combatants = getCombatState();
        const combatant = combatants.find(c => c.id === combatantId);
        
        return `
            <div class="popup-header">
                <span>🔮 Gestione Incantesimi Attivi</span>
                <span style="color: var(--text-muted); font-size: 0.85rem;">${combatant?.customName || 'Combattente'}</span>
            </div>
            <p style="color: var(--text-muted, #888); font-size: 0.85rem; margin-bottom: 10px;">
                Aggiungi un incantesimo o effetto attivo con durata. Se richiede concentrazione, sarà tracciato automaticamente.
            </p>
            
            <div class="spell-form">
                <div class="spell-form-row">
                    <label>Nome:</label>
                    <input type="text" id="spell-name-input" placeholder="Es. Benedizione, Scudo della Fede...">
                </div>
                <div class="spell-form-row">
                    <label>Durata:</label>
                    <input type="number" id="spell-duration-input" value="10" min="0" max="1000">
                    <span style="color: var(--text-muted); font-size: 0.8rem;">turni (0 = permanente)</span>
                </div>
                <div class="spell-form-row">
                    <label>Tipo:</label>
                    <select id="spell-type-input">
                        <option value="buff">🟢 Buff (positivo)</option>
                        <option value="debuff">🔴 Debuff (negativo)</option>
                        <option value="effect">🔵 Effetto (neutro)</option>
                    </select>
                </div>
                <div class="spell-form-row spell-form-checkbox">
                    <input type="checkbox" id="spell-concentration-input" checked>
                    <label for="spell-concentration-input">Richiede Concentrazione</label>
                </div>
            </div>
            
            <button class="apply-spell-btn" id="apply-spell-btn">✨ Aggiungi Incantesimo</button>
            
            ${combatant?.concentration?.spellName ? `
                <div style="margin-top: 15px; padding: 10px; background: rgba(156, 39, 176, 0.2); border-radius: 6px;">
                    <h5 style="margin: 0 0 8px; color: #ce93d8;">🔮 Concentrazione Attiva</h5>
                    <p style="margin: 0; color: var(--text-primary);">
                        <strong>${combatant.concentration.spellName}</strong>
                        ${combatant.concentration.duration > 0 ? `(${combatant.concentration.duration} turni)` : ''}
                    </p>
                    <button class="concentration-btn break-btn" data-id="${combatantId}" style="margin-top: 8px;">
                        💔 Interrompi Concentrazione
                    </button>
                </div>
            ` : ''}
        `;
    },

    handleDetailClick(e) {
        const card = e.target.closest('.combatant-card');
        if (!card) return;
        const combatantId = parseFloat(card.dataset.id);
        const combatants = getCombatState();
        const combatant = combatants.find(c => c.id === combatantId);

        if (e.target.classList.contains('remove-combatant-btn')) {
            removeMonsterFromCombat(combatantId);
            selectedCombatantId = null;
        } else if (e.target.classList.contains('hp-minus')) {
            // -5 HP
            const oldHp = combatant.currentHp || 0;
            const newHp = Math.max(0, oldHp - 5);
            updateMonsterProperty(combatantId, 'currentHp', newHp);
            this.logHpChange(combatant, -5, newHp);
            // Death tooltip
            if (oldHp > 0 && newHp === 0) {
                this.showDeathTooltip(combatant);
            }
        } else if (e.target.classList.contains('hp-plus')) {
            // +5 HP
            const newHp = Math.min(combatant.maxHp, combatant.currentHp + 5);
            updateMonsterProperty(combatantId, 'currentHp', newHp);
            this.logHpChange(combatant, +5, newHp);
        } else if (e.target.classList.contains('apply-damage-btn')) {
            // Applica danno
            this.applyDamageOrHeal(combatantId, 'damage');
        } else if (e.target.classList.contains('apply-heal-btn')) {
            // Applica cura
            this.applyDamageOrHeal(combatantId, 'heal');
        } else if (e.target.classList.contains('multiattack-btn')) {
            // Attiva modalità multiattacco
            this.activateMultiattackMode(e.target, combatant);
        } else if (e.target.classList.contains('cancel-multiattack-btn')) {
            // Annulla multiattacco
            this.cancelMultiattackMode(combatantId);
        } else if (e.target.classList.contains('attack-btn')) {
            // Tiro attacco (gestisce sia attacchi singoli che in multiattacco)
            this.handleAttackClick(e.target, combatant);
        } else if (e.target.classList.contains('special-action-btn')) {
            // Azione speciale (es. Asservire, Soffio)
            this.handleSpecialAction(e.target, combatant);
        } else if (e.target.classList.contains('legendary-btn')) {
            // Azione leggendaria
            const cost = parseInt(e.target.dataset.cost, 10) || 1;
            this.handleLegendaryAction(e.target, combatant, cost);
        } else if (e.target.classList.contains('clear-target-btn')) {
            this.targetCombatant = null;
            this.renderCombatantDetail(combatant);
        } else if (e.target.classList.contains('death-save-btn')) {
            // Incremento manuale death save
            this.handleDeathSaveManual(combatantId, e.target.dataset.type);
        } else if (e.target.classList.contains('roll-death-save-btn')) {
            // Tiro death save automatico
            this.handleDeathSaveRoll(combatantId);
        } else if (e.target.classList.contains('revive-btn')) {
            // Riporta in vita
            this.handleRevive(combatantId);
        } else if (e.target.classList.contains('spell-btn') && !e.target.classList.contains('disabled')) {
            const spellLevel = parseInt(e.target.dataset.spellLevel, 10);
            useSpellSlot(combatantId, spellLevel);
        } else if (e.target.classList.contains('open-conditions-popup-btn') || e.target.classList.contains('open-conditions-popup-btn-mini')) {
            this.openConditionsPopup(combatantId);
        } else if (e.target.classList.contains('open-spells-popup-btn') || e.target.classList.contains('open-spells-popup-btn-mini')) {
            this.openSpellsPopup(combatantId);
        } else if (e.target.classList.contains('break-btn') && e.target.closest('.concentration-container')) {
            // Break concentration button in detail view
            if (confirm('Interrompere la concentrazione? Questo farà terminare l\'incantesimo.')) {
                breakConcentration(combatantId, true);
            }
        } else if (e.target.classList.contains('remove-btn') && e.target.closest('.active-condition-badge')) {
            const condName = e.target.dataset.condition;
            if (condName) {
                removeConditionFromCombatant(combatantId, condName);
            }
        } else if (e.target.classList.contains('remove-btn') && e.target.closest('.active-spell-badge')) {
            // Remove active spell
            const spellName = e.target.dataset.spell;
            if (spellName) {
                removeActiveSpell(combatantId, spellName);
                showToast(`${spellName} rimosso.`, 'info');
            }
        } else if (e.target.classList.contains('apply-attack-damage-btn')) {
            // Applica danno dal risultato dell'attacco al bersaglio
            const targetId = parseFloat(e.target.dataset.target);
            const damage = parseInt(e.target.dataset.damage, 10);
            this.applyDamageToTarget(targetId, damage);
        } else if (e.target.classList.contains('spell-btn-mini')) {
            // Click su un incantesimo per lanciarlo
            const spellData = JSON.parse(e.target.dataset.spell.replace(/&quot;/g, '"'));
            const spellType = e.target.dataset.spellType;
            this.handleSpellClick(combatantId, spellData, spellType);
        } else if (e.target.classList.contains('slot-badge-btn')) {
            // Click su uno slot per consumarlo
            const slotLevel = parseInt(e.target.dataset.slotLevel, 10);
            useSpellSlot(combatantId, slotLevel);
            showToast(`Slot L${slotLevel} consumato!`, 'info');
        }
    },
    
    /**
     * Gestisce il click su un incantesimo.
     */
    handleSpellClick(combatantId, spellData, spellType) {
        const result = useSpell(combatantId, spellData);
        
        if (result.success) {
            showToast(`✨ ${result.message}`, 'success');
            // Log nel results box
            const combatants = getCombatState();
            const combatant = combatants.find(c => c.id === combatantId);
            if (combatant) {
                const resultsBox = this.container.querySelector('.results-box-mini');
                if (resultsBox) {
                    const spellHtml = `
                        <div class="spell-cast-result" style="
                            padding: 6px 10px;
                            margin: 4px 0;
                            background: rgba(156, 39, 176, 0.15);
                            border-left: 3px solid #9c27b0;
                            border-radius: 4px;
                        ">
                            🔮 <strong>${spellData.name}</strong> lanciato!
                            <small style="color: var(--text-muted);">${result.message.includes('rimanenti') ? result.message.split('(')[1]?.replace(')', '') : ''}</small>
                        </div>
                    `;
                    resultsBox.innerHTML = spellHtml + resultsBox.innerHTML;
                }
            }
        } else {
            showToast(`❌ ${result.message}`, 'error');
        }
    },
    
    setTarget(combatantId) {
        const combatants = getCombatState();
        const target = combatants.find(c => c.id === combatantId);
        
        // Toggle: se già selezionato, deseleziona
        if (this.targetCombatant === combatantId) {
            this.targetCombatant = null;
            showToast('Bersaglio rimosso', 'info');
        } else {
            this.targetCombatant = combatantId;
            showToast(`${target?.customName || target?.name} impostato come bersaglio`, 'success');
        }
        
        // Re-render per aggiornare l'indicatore
        const currentCombatant = combatants.find(c => c.id === selectedCombatantId);
        if (currentCombatant) {
            this.renderCombatantDetail(currentCombatant);
        }
    },
    
    applyDamageToTarget(targetId, damage) {
        const combatants = getCombatState();
        const target = combatants.find(c => c.id === targetId);
        if (!target) {
            showToast('Bersaglio non trovato', 'error');
            return;
        }
        
        const oldHp = target.currentHp || 0;
        const newHp = Math.max(0, oldHp - damage);
        updateMonsterProperty(targetId, 'currentHp', newHp);
        showToast(`${damage} danni applicati a ${target.customName || target.name}!`, 'success');
        
        // Check concentration if target has active concentration
        if (target.concentration?.spellName && damage > 0) {
            const result = this.handleConcentrationCheck(targetId, damage);
            this.showConcentrationResult(target, result);
        }
        
        // Death tooltip - mostra quando un combattente muore (HP raggiunge 0)
        if (oldHp > 0 && newHp === 0) {
            this.showDeathTooltip(target);
        }
        
        // Il bersaglio rimane selezionato per attacchi successivi
        // (non resettiamo this.targetCombatant)
    },
    
    /**
     * Mostra un tooltip di morte quando un combattente raggiunge 0 HP.
     */
    showDeathTooltip(combatant) {
        const name = combatant.customName || combatant.name;
        const isPc = combatant.isPc;
        
        // Crea il tooltip di morte
        const deathOverlay = document.createElement('div');
        deathOverlay.className = 'death-tooltip-overlay';
        deathOverlay.innerHTML = `
            <div class="death-tooltip">
                <div class="death-icon">💀</div>
                <div class="death-title">${name}</div>
                <div class="death-message">${isPc ? 
                    'È caduto! Tiri Salvezza contro Morte necessari.' : 
                    'È morto!'}</div>
                <button class="death-close-btn">Chiudi</button>
            </div>
        `;
        
        document.body.appendChild(deathOverlay);
        
        // Event per chiudere
        deathOverlay.querySelector('.death-close-btn').addEventListener('click', () => {
            deathOverlay.remove();
        });
        
        deathOverlay.addEventListener('click', (e) => {
            if (e.target === deathOverlay) {
                deathOverlay.remove();
            }
        });
        
        // Auto-close dopo 5 secondi
        setTimeout(() => {
            deathOverlay?.remove();
        }, 5000);
    },
    
    handleConcentrationCheck(combatantId, damage) {
        const result = rollConcentrationSave(combatantId, damage);
        return result;
    },
    
    showConcentrationResult(combatant, result) {
        if (!result) return;
        
        const resultsBox = this.container.querySelector('.results-box');
        if (!resultsBox) return;
        
        const successClass = result.success ? 'success' : 'failure';
        const statusIcon = result.success ? '✅' : '💔';
        const statusText = result.success 
            ? `Concentrazione mantenuta! (${result.total} vs CD ${result.dc})`
            : `Concentrazione persa su "${result.spellName}"! (${result.total} vs CD ${result.dc})`;
        
        const resultHtml = `
            <div class="concentration-check-result ${successClass}">
                ${statusIcon} ${statusText}
            </div>
        `;
        
        resultsBox.innerHTML = resultHtml + resultsBox.innerHTML;
    },
    
    applyDamageOrHeal(combatantId, type) {
        const input = this.container.querySelector(`.damage-input[data-id="${combatantId}"]`);
        if (!input) return;
        
        const value = input.value.trim();
        if (!value) {
            showToast('Inserisci un valore o una formula (es. 2d6+3)', 'warning');
            return;
        }
        
        const combatants = getCombatState();
        const combatant = combatants.find(c => c.id === combatantId);
        if (!combatant) return;
        
        let amount;
        
        // Parse dice notation or number
        if (value.includes('d')) {
            const result = rollDice(value);
            amount = result.total || result;
        } else {
            amount = parseInt(value, 10);
        }
        
        if (isNaN(amount) || amount < 0) {
            showToast('Valore non valido', 'error');
            return;
        }
        
        const oldHp = combatant.currentHp || 0;
        let newHp;
        if (type === 'damage') {
            newHp = Math.max(0, oldHp - amount);
            this.logHpChange(combatant, -amount, newHp);
            
            // Check concentration if damage was applied
            if (combatant.concentration?.spellName && amount > 0) {
                const result = this.handleConcentrationCheck(combatantId, amount);
                this.showConcentrationResult(combatant, result);
            }
            
            // Death tooltip - mostra quando un combattente muore (HP raggiunge 0)
            if (oldHp > 0 && newHp === 0) {
                this.showDeathTooltip(combatant);
            }
        } else {
            newHp = Math.min(combatant.maxHp, oldHp + amount);
            this.logHpChange(combatant, +amount, newHp);
        }
        
        updateMonsterProperty(combatantId, 'currentHp', newHp);
        input.value = '';
    },
    
    logHpChange(combatant, change, newHp) {
        const sign = change >= 0 ? '+' : '';
        const type = change >= 0 ? 'cura' : 'danno';
        console.log(`💕 [CombatTracker] ${combatant.customName}: ${sign}${change} PF (${type}). Nuovi PF: ${newHp}`);
    },
    
    // === GESTIONE MULTIATTACCO ===
    
    /**
     * Attiva la modalità multiattacco.
     */
    activateMultiattackMode(btn, attacker) {
        const attackCount = parseInt(btn.dataset.attackCount, 10) || 2;
        
        // Imposta la modalità multiattacco nel tracker
        const tracker = attacker.actionTracker || {};
        tracker.multiattackMode = {
            totalAttacks: attackCount,
            attacksRemaining: attackCount,
            attacksUsed: 0
        };
        tracker.actionUsed = true; // L'azione è stata "usata" per attivare il multiattacco
        
        updateMonsterProperty(attacker.id, 'actionTracker', tracker);
        
        showToast(`⚔️ Multiattacco attivato! ${attackCount} attacchi disponibili. Seleziona i bersagli.`, 'info');
        
        // Re-render per mostrare l'indicatore
        this.renderCombatantDetail(attacker);
    },
    
    /**
     * Annulla la modalità multiattacco.
     */
    cancelMultiattackMode(combatantId) {
        const combatants = getCombatState();
        const combatant = combatants.find(c => c.id === combatantId);
        if (!combatant) return;
        
        const tracker = combatant.actionTracker || {};
        if (tracker.multiattackMode) {
            // Riattiva l'azione se annulliamo il multiattacco
            tracker.actionUsed = false;
            tracker.multiattackMode = null;
            updateMonsterProperty(combatantId, 'actionTracker', tracker);
            showToast('Multiattacco annullato.', 'info');
            this.renderCombatantDetail(combatant);
        }
    },
    
    /**
     * Gestisce il click su un attacco (singolo o parte di multiattacco).
     */
    handleAttackClick(btn, attacker) {
        const tracker = attacker.actionTracker || {};
        const multiattackMode = tracker.multiattackMode;
        
        // Verifica se abbiamo un bersaglio selezionato
        const card = this.container.querySelector(`.combatant-card[data-id="${attacker.id}"]`);
        const targetSelect = card?.querySelector('.target-select');
        const targetId = targetSelect?.value;
        
        if (!targetId) {
            showToast('⚠️ Seleziona un bersaglio prima di attaccare!', 'warning');
            return;
        }
        
        // Se siamo in modalità multiattacco, decrementa il contatore
        if (multiattackMode) {
            if (multiattackMode.attacksRemaining <= 0) {
                showToast('Nessun attacco rimanente nel multiattacco!', 'warning');
                return;
            }
            multiattackMode.attacksRemaining--;
            multiattackMode.attacksUsed++;
            
            // Se abbiamo finito gli attacchi, disattiva la modalità
            if (multiattackMode.attacksRemaining <= 0) {
                tracker.multiattackMode = null;
            }
            
            updateMonsterProperty(attacker.id, 'actionTracker', tracker);
        } else {
            // Attacco singolo: consuma l'azione
            if (tracker.actionUsed) {
                showToast('Azione già usata questo turno!', 'warning');
                return;
            }
            tracker.actionUsed = true;
            updateMonsterProperty(attacker.id, 'actionTracker', tracker);
        }
        
        // Esegui il tiro attacco con confronto CA
        this.handleAttackWithAC(btn, attacker, targetId, multiattackMode);
    },
    
    /**
     * Esegue un tiro attacco con confronto alla CA del bersaglio.
     */
    handleAttackWithAC(btn, attacker, targetId, multiattackMode) {
        const attackData = JSON.parse(btn.dataset.attack.replace(/&apos;/g, "'"));
        const combatants = getCombatState();
        
        // Trova il bersaglio
        let target = null;
        let targetAC = 10;
        
        if (targetId && targetId !== 'free') {
            target = combatants.find(c => c.id === parseFloat(targetId));
            if (target) {
                targetAC = target.armor_class?.[0]?.value || target.armor_class || 10;
            }
        }
        
        // Tiro per colpire
        const rollResult = rollDice('1d20');
        const d20Roll = rollResult.rolls?.[0] || rollResult;
        const attackBonus = attackData.attack_bonus || 0;
        const toHit = d20Roll + attackBonus;
        const isCritical = d20Roll === 20;
        const isFumble = d20Roll === 1;
        
        // Formatta il breakdown del tiro (dado + modificatore)
        const bonusText = attackBonus >= 0 ? `+ ${attackBonus}` : `- ${Math.abs(attackBonus)}`;
        const rollBreakdown = `(${d20Roll} ${bonusText})`;
        
        // Determina hit/miss
        let isHit = false;
        let hitStatus = '';
        
        if (isCritical) {
            isHit = true;
            hitStatus = `🎯 CRITICO! ${toHit} ${rollBreakdown}`;
        } else if (isFumble) {
            isHit = false;
            hitStatus = `❌ FUMO! ${toHit} ${rollBreakdown}`;
        } else if (targetId === 'free') {
            // Bersaglio libero: non confrontiamo con CA ma mostriamo il risultato
            isHit = true;
            hitStatus = `🎯 Tiro: ${toHit} ${rollBreakdown}`;
        } else if (toHit >= targetAC) {
            isHit = true;
            hitStatus = `✅ COLPISCE! ${toHit} vs CA ${targetAC} ${rollBreakdown}`;
        } else {
            isHit = false;
            hitStatus = `❌ MANCA! ${toHit} vs CA ${targetAC} ${rollBreakdown}`;
        }
        
        // Calcola danni (solo se colpisce o per visualizzazione)
        let damage = '';
        let damageTotal = 0;
        if (attackData.damage && (isHit || !target)) {
            attackData.damage.forEach(d => {
                let dice = d.damage_dice || '1d6';
                if (isCritical) {
                    dice = this.doubleDice(dice);
                }
                const dmgResult = rollDice(dice);
                const dmgValue = dmgResult.total || dmgResult;
                damageTotal += dmgValue;
                damage += `${dmgValue} ${d.damage_type?.name || 'danni'}`;
                if (attackData.damage.indexOf(d) < attackData.damage.length - 1) damage += ' + ';
            });
        }
        
        // Prepara le label per la visualizzazione
        const damageLabel = damageTotal > 0 ? ` | 💥 ${damage}` : '';
        const targetLabel = target ? ` → ${target.customName || target.name}` : 
            (targetId === 'free' ? ' → Bersaglio Libero' : '');
        
        // Mostra risultato
        const resultsBox = this.container.querySelector('.results-box-mini') || this.container.querySelector('.results-box');
        if (resultsBox) {
            const card = this.container.querySelector(`.combatant-card[data-id="${attacker.id}"]`);
            const cardResultsBox = card?.querySelector('.results-box-mini') || resultsBox;
            
            const multiattackLabel = multiattackMode ? 
                `<small style="color: #ffd700;">⚔️ Multiattacco (${multiattackMode.attacksUsed}/${multiattackMode.totalAttacks})</small><br>` : '';
            const targetLabelHtml = target ? ` → <strong>${target.customName || target.name}</strong>` : 
                (targetId === 'free' ? ' → Bersaglio Libero' : '');
            
            let resultHtml = `
                <div class="attack-result ${isHit ? 'hit' : 'miss'}" style="
                    padding: 8px 12px;
                    margin: 4px 0;
                    border-radius: 6px;
                    border-left: 3px solid ${isHit ? '#4caf50' : '#f44336'};
                    background: ${isHit ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
                ">
                    ${multiattackLabel}
                    <strong>${attackData.name}</strong>${targetLabelHtml}<br>
                    <span style="font-size: 0.9rem;">${hitStatus}</span>
                    ${isHit && damageTotal > 0 ? `<br>💥 <strong>${damage}</strong>` : ''}
                    ${isHit && target && damageTotal > 0 ? `
                        <button class="apply-attack-damage-btn" 
                                data-target="${target.id}" 
                                data-damage="${damageTotal}"
                                style="
                                    margin-top: 6px;
                                    padding: 4px 10px;
                                    background: #f44336;
                                    border: none;
                                    border-radius: 4px;
                                    color: white;
                                    cursor: pointer;
                                    font-size: 0.8rem;
                                ">
                            💾 Applica ${damageTotal} danni
                        </button>
                    ` : ''}
                </div>
            `;
            
            cardResultsBox.innerHTML = resultHtml + cardResultsBox.innerHTML;
        }
        
        // Log in console
        console.log(`⚔️ [CombatTracker] ${attacker.customName} attacca con ${attackData.name}: ${hitStatus}${damageLabel}`);
    },
    
    /**
     * Gestisce il tiro di nuova iniziativa per tutti i combattenti.
     * Visibile solo quando il combattimento è sospeso.
     */
    handleNewInitiative() {
        const combatants = getCombatState();
        if (combatants.length === 0) {
            showToast('Nessun combattente presente!', 'warning');
            return;
        }
        
        // Chiama la funzione dal combatStateManager per ritirare l'iniziativa
        rerollAllInitiative();
        
        showToast(`🔄 Nuova iniziativa tirata per ${combatants.length} combattenti!`, 'success');
    },
    
    /**
     * Gestisce un'azione speciale.
     */
    handleSpecialAction(btn, attacker) {
        const actionData = JSON.parse(btn.dataset.action.replace(/&apos;/g, "'"));
        
        // Verifica se abbiamo un bersaglio (per alcune azioni è richiesto)
        const card = this.container.querySelector(`.combatant-card[data-id="${attacker.id}"]`);
        const targetSelect = card?.querySelector('.target-select');
        const targetId = targetSelect?.value;
        
        // Consuma l'azione
        const tracker = attacker.actionTracker || {};
        if (tracker.actionUsed) {
            showToast('Azione già usata questo turno!', 'warning');
            return;
        }
        tracker.actionUsed = true;
        updateMonsterProperty(attacker.id, 'actionTracker', tracker);
        
        // Mostra risultato
        const resultsBox = this.container.querySelector('.results-box-mini') || this.container.querySelector('.results-box');
        if (resultsBox) {
            const card = this.container.querySelector(`.combatant-card[data-id="${attacker.id}"]`);
            const cardResultsBox = card?.querySelector('.results-box-mini') || resultsBox;
            
            const combatants = getCombatState();
            const target = targetId && targetId !== 'free' ? 
                combatants.find(c => c.id === parseFloat(targetId)) : null;
            const targetLabel = target ? ` → <strong>${target.customName || target.name}</strong>` : '';
            
            let effectHtml = '';
            if (actionData.dc) {
                const dcType = actionData.dc.dc_type?.name || 'CD';
                const dcValue = actionData.dc.dc_value || 15;
                effectHtml = `<br><span style="color: var(--accent-color);">${dcType} ${dcValue}</span>`;
            }
            if (actionData.desc) {
                const shortDesc = actionData.desc.substring(0, 200);
                effectHtml += `<br><small style="color: var(--text-muted);">${shortDesc}${actionData.desc.length > 200 ? '...' : ''}</small>`;
            }
            
            cardResultsBox.innerHTML = `
                <div class="special-action-result" style="
                    padding: 8px 12px;
                    margin: 4px 0;
                    border-radius: 6px;
                    border-left: 3px solid #9c27b0;
                    background: rgba(156, 39, 176, 0.1);
                ">
                    <strong>✨ ${actionData.name}</strong>${targetLabel}
                    ${effectHtml}
                </div>
            ` + cardResultsBox.innerHTML;
        }
        
        showToast(`${attacker.customName} usa: ${actionData.name}`, 'info');
    },
    
    /**
     * Gestisce un'azione leggendaria.
     */
    handleLegendaryAction(btn, attacker, cost) {
        const actionData = JSON.parse(btn.dataset.action.replace(/&apos;/g, "'"));
        const tracker = attacker.actionTracker || { legendaryActionsUsed: 0, legendaryActionsMax: 3 };
        
        const remaining = tracker.legendaryActionsMax - tracker.legendaryActionsUsed;
        if (remaining < cost) {
            showToast(`Non hai abbastanza azioni leggendarie! (Serve: ${cost}, Disponibili: ${remaining})`, 'warning');
            return;
        }
        
        // Usa le azioni leggendarie
        tracker.legendaryActionsUsed += cost;
        updateMonsterProperty(attacker.id, 'actionTracker', tracker);
        
        // Mostra risultato
        const resultsBox = this.container.querySelector('.results-box-mini') || this.container.querySelector('.results-box');
        if (resultsBox) {
            const card = this.container.querySelector(`.combatant-card[data-id="${attacker.id}"]`);
            const cardResultsBox = card?.querySelector('.results-box-mini') || resultsBox;
            
            const newRemaining = tracker.legendaryActionsMax - tracker.legendaryActionsUsed;
            
            cardResultsBox.innerHTML = `
                <div class="legendary-action-result" style="
                    padding: 8px 12px;
                    margin: 4px 0;
                    border-radius: 6px;
                    border-left: 3px solid #ffd700;
                    background: rgba(255, 215, 0, 0.1);
                ">
                    <strong>👑 ${actionData.name}</strong>
                    <small style="color: #ffd700;">(${newRemaining}/${tracker.legendaryActionsMax} azioni leggendarie rimanenti)</small>
                </div>
            ` + cardResultsBox.innerHTML;
        }
        
        showToast(`👑 ${attacker.customName} usa azione leggendaria: ${actionData.name}`, 'info');
    },
    
    /**
     * Gestisce l'uso di un'azione generica (non attacco).
     */
    handleActionUse(btn, attacker, isLegendary = false) {
        const actionData = JSON.parse(btn.dataset.action.replace(/&apos;/g, "'"));
        
        // Mostra risultato
        const resultsBox = this.container.querySelector('.results-box-mini') || this.container.querySelector('.results-box');
        if (resultsBox) {
            const legendaryLabel = isLegendary ? '👑 ' : '';
            const targetLabel = this.targetCombatant ? ` → ${this.getTargetName()}` : '';
            
            // Se ha un DC o effetto, mostra info
            let effectHtml = '';
            if (actionData.dc) {
                const dcType = actionData.dc.dc_type?.name || 'CD';
                const dcValue = actionData.dc.dc_value || 15;
                effectHtml = `<br><small style="color: var(--text-muted);">${dcType} ${dcValue}</small>`;
            }
            if (actionData.desc) {
                const shortDesc = actionData.desc.substring(0, 150);
                effectHtml += `<br><small style="color: var(--accent-color);">${shortDesc}${actionData.desc.length > 150 ? '...' : ''}</small>`;
            }
            
            const card = this.container.querySelector(`.combatant-card[data-id="${attacker.id}"]`);
            const cardResultsBox = card?.querySelector('.results-box-mini') || resultsBox;
            
            cardResultsBox.innerHTML = `
                <p class="action-used">
                    ${legendaryLabel}<strong>${actionData.name}</strong>${targetLabel}
                    ${effectHtml}
                </p>
            ` + cardResultsBox.innerHTML;
        }
        
        showToast(`${attacker.customName} usa: ${actionData.name}`, 'info');
    },
    
    handleAttackRoll(btn, attacker) {
        const attackData = JSON.parse(btn.dataset.attack.replace(/&apos;/g, "'"));
        
        // Roll to hit
        const rollResult = rollDice('1d20');
        const d20Roll = rollResult.rolls?.[0] || rollResult;
        const attackBonus = attackData.attack_bonus || 0;
        const toHit = d20Roll + attackBonus;
        const isCritical = d20Roll === 20;
        const isFumble = d20Roll === 1;
        
        // Roll damage
        let damage = '';
        let damageTotal = 0;
        if (attackData.damage) {
            attackData.damage.forEach(d => {
                let dice = d.damage_dice || '1d6';
                if (isCritical) {
                    // Double dice on crit
                    dice = this.doubleDice(dice);
                }
                const dmgResult = rollDice(dice);
                const dmgValue = dmgResult.total || dmgResult;
                damageTotal += dmgValue;
                damage += `${dmgValue} ${d.damage_type?.name || 'danni'}`;
                if (attackData.damage.indexOf(d) < attackData.damage.length - 1) damage += ' + ';
            });
        }
        
        // Show result - cerca sia .results-box che .results-box-mini
        const resultsBox = this.container.querySelector('.results-box-mini') || this.container.querySelector('.results-box');
        if (resultsBox) {
            const critLabel = isCritical ? '🎯 **CRITICO!** ' : isFumble ? '❌ **FALLIMENTO!** ' : '';
            const targetLabel = this.targetCombatant ? ` → ${this.getTargetName()}` : '';
            const damageLabel = damageTotal > 0 ? ` | 💥 ${damage}` : '';
            
            const card = this.container.querySelector(`.combatant-card[data-id="${attacker.id}"]`);
            const cardResultsBox = card?.querySelector('.results-box-mini') || resultsBox;
            
            cardResultsBox.innerHTML = `
                <p class="${isCritical ? 'critical' : isFumble ? 'fumble' : ''}">
                    ${critLabel}<strong>${attackData.name}</strong>${targetLabel}: 
                    🎯 ${toHit} (${d20Roll}${attackBonus >= 0 ? '+' : ''}${attackBonus})${damageLabel}
                    ${this.targetCombatant && damageTotal > 0 ? `
                        <button class="apply-attack-damage-btn" 
                                data-target="${this.targetCombatant}" 
                                data-damage="${damageTotal}">
                            💾 Applica Danno
                        </button>
                    ` : ''}
                </p>
            ` + cardResultsBox.innerHTML;
        }
    },
    
    doubleDice(dice) {
        // Convert "2d6+3" to "4d6+3" (double only dice, not modifiers)
        const match = dice.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
        if (match) {
            const count = parseInt(match[1] || '1', 10);
            const die = match[2];
            const mod = match[3] || '';
            return `${count * 2}d${die}${mod}`;
        }
        return dice;
    },
    
    handleDeathSaveManual(combatantId, type) {
        const combatants = getCombatState();
        const combatant = combatants.find(c => c.id === combatantId);
        if (!combatant) return;
        
        // Initialize deathSaves if needed
        if (!combatant.deathSaves) {
            combatant.deathSaves = { successes: 0, failures: 0, stabilized: false };
        }
        
        if (type === 'success') {
            combatant.deathSaves.successes++;
            if (combatant.deathSaves.successes >= 3) {
                combatant.deathSaves.stabilized = true;
                showToast(`${combatant.customName} si è stabilizzato!`, 'success');
            }
        } else if (type === 'failure') {
            combatant.deathSaves.failures++;
            if (combatant.deathSaves.failures >= 3) {
                showToast(`${combatant.customName} è morto!`, 'error');
            }
        }
        
        updateMonsterProperty(combatantId, 'deathSaves', combatant.deathSaves);
    },
    
    handleDeathSaveRoll(combatantId) {
        const combatants = getCombatState();
        const combatant = combatants.find(c => c.id === combatantId);
        if (!combatant) return;
        
        // Roll d20
        const result = rollDice('1d20');
        const roll = result.rolls?.[0] || result;
        
        // Initialize deathSaves if needed
        if (!combatant.deathSaves) {
            combatant.deathSaves = { successes: 0, failures: 0, stabilized: false };
        }
        
        let message = `${combatant.customName} - Tiro Salvezza Morte: ${roll}`;
        
        if (roll === 20) {
            // Critical success - regain 1 HP
            combatant.currentHp = 1;
            combatant.deathSaves = { successes: 0, failures: 0, stabilized: false };
            message += ' - CRITICO! Riprende conoscenza con 1 PF!';
            showToast(message, 'success');
        } else if (roll === 1) {
            // Critical failure - 2 failures
            combatant.deathSaves.failures += 2;
            message += ' - Fallimento critico! +2 fallimenti';
            if (combatant.deathSaves.failures >= 3) {
                message += ` - ${combatant.customName} è morto!`;
                showToast(message, 'error');
            } else {
                showToast(message, 'warning');
            }
        } else if (roll >= 10) {
            // Success
            combatant.deathSaves.successes++;
            message += ' - Successo!';
            if (combatant.deathSaves.successes >= 3) {
                combatant.deathSaves.stabilized = true;
                message += ` - ${combatant.customName} si è stabilizzato!`;
            }
            showToast(message, 'success');
        } else {
            // Failure
            combatant.deathSaves.failures++;
            message += ' - Fallimento!';
            if (combatant.deathSaves.failures >= 3) {
                message += ` - ${combatant.customName} è morto!`;
                showToast(message, 'error');
            } else {
                showToast(message, 'warning');
            }
        }
        
        // Save changes
        updateMonsterProperty(combatantId, 'deathSaves', combatant.deathSaves);
        if (combatant.currentHp > 0) {
            updateMonsterProperty(combatantId, 'currentHp', combatant.currentHp);
        }
    },
    
    handleRevive(combatantId) {
        const combatants = getCombatState();
        const combatant = combatants.find(c => c.id === combatantId);
        if (!combatant) return;
        
        updateMonsterProperty(combatantId, 'currentHp', 1);
        updateMonsterProperty(combatantId, 'deathSaves', { successes: 0, failures: 0, stabilized: false });
        showToast(`${combatant.customName} è tornato in vita con 1 PF!`, 'success');
    },

    handleDetailChange(e) {
        const id = e.target.dataset.id;
        const attackerId = e.target.dataset.attackerId;
        
        // Target selector change - salva nel combatant (persistente)
        if (e.target.classList.contains('target-select') && attackerId) {
            const targetId = e.target.value && e.target.value !== 'free' ? parseFloat(e.target.value) : null;
            this.targetCombatant = targetId;
            // Salva nel combatant per persistenza
            updateMonsterProperty(parseFloat(attackerId), 'selectedTarget', targetId);
            if (targetId) {
                const combatants = getCombatState();
                const target = combatants.find(c => c.id === targetId);
                showToast(`${target?.customName || target?.name} selezionato come bersaglio`, 'info');
            } else {
                showToast('Bersaglio libero selezionato', 'info');
            }
            return;
        }
        
        if (!id) return;
        const combatantId = parseFloat(id);

        if (e.target.classList.contains('hp-current')) {
            const combatants = getCombatState();
            const combatant = combatants.find(c => c.id === combatantId);
            const oldHp = combatant?.currentHp || 0;
            const newHp = parseInt(e.target.value, 10);
            
            updateMonsterProperty(combatantId, 'currentHp', newHp);
            
            // Death tooltip - mostra quando un combattente muore (HP raggiunge 0)
            if (oldHp > 0 && newHp === 0 && combatant) {
                this.showDeathTooltip(combatant);
            }
        } else if (e.target.classList.contains('init-input') || e.target.classList.contains('init-mini-input')) {
            updateMonsterProperty(combatantId, 'initiative', parseInt(e.target.value, 10));
        }
    },

    handleDetailInput(e) {
        const id = e.target.dataset.id;
        if (!id) return;
        
        // Name input - update on every keystroke for responsiveness
        if (e.target.classList.contains('combatant-name-input')) {
            const combatantId = parseFloat(id);
            const newName = e.target.value;
            // Salva la posizione del cursore prima dell'aggiornamento
            this._nameInputCursorPos = e.target.selectionStart;
            this._nameInputFocused = true;
            updateMonsterProperty(combatantId, 'customName', newName);
        }
    },

    handleDetailHover(e) {
        if (e.target.classList.contains('special-action-link')) {
            const { name, desc } = e.target.dataset;
            const tip = document.createElement('div');
            tip.className = 'ability-tooltip';
            tip.innerHTML = `<h4>${name}</h4><p>${desc}</p>`;
            document.body.appendChild(tip);
            const rect = e.target.getBoundingClientRect();
            tip.style.left = `${rect.left + window.scrollX}px`;
            tip.style.top = `${rect.bottom + window.scrollY + 5}px`;
        }
    },

    handleDetailOut(e) {
        if (e.target.classList.contains('special-action-link')) {
            document.querySelectorAll('.ability-tooltip').forEach(t => t.remove());
        }
    },

    // --- STATE CHANGE HANDLER ---

    onStateChange(combatants, currentRound, currentTurnMonsterId, initiativeOrder) {
        loadAllSources();
        
        // Round notification
        if (currentRound > previousRound && currentRound > 1) {
            showToast(`Round ${currentRound}`, 'info');
        }
        previousRound = currentRound;
        
        // Store state
        this.combatants = combatants;
        this.currentRound = currentRound;
        this.currentTurnId = currentTurnMonsterId;
        this.initiativeOrder = initiativeOrder;
        
        // Update combat-active class on tracker container for blood effect
        if (this.trackerContainer) {
            if (currentRound > 0) {
                this.trackerContainer.classList.add('combat-active');
            } else {
                this.trackerContainer.classList.remove('combat-active');
            }
        }
        
        // Update round input
        const roundInput = this.container?.querySelector('#round-input');
        if (roundInput && document.activeElement !== roundInput) {
            roundInput.value = currentRound;
        }

        // Render order list
        this.renderOrderList(combatants, currentRound, currentTurnMonsterId, initiativeOrder);
        
        // Render detail for selected or active combatant
        // Salva lo stato del focus sul name input prima di re-renderizzare
        const shouldRestoreNameFocus = this._nameInputFocused;
        const cursorPos = this._nameInputCursorPos;
        this._nameInputFocused = false;
        this._nameInputCursorPos = null;
        
        if (selectedCombatantId) {
            const selected = combatants.find(c => c.id === selectedCombatantId);
            if (selected) {
                this.renderCombatantDetail(selected);
                // Ripristina il focus sul name input se necessario
                if (shouldRestoreNameFocus) {
                    setTimeout(() => {
                        const nameInput = this.container?.querySelector('.combatant-name-input');
                        if (nameInput) {
                            nameInput.focus();
                            nameInput.setSelectionRange(cursorPos || 0, cursorPos || 0);
                        }
                    }, 0);
                }
            } else {
                selectedCombatantId = null;
            }
        } else if (currentRound > 0 && currentTurnMonsterId) {
            const active = combatants.find(c => c.id === currentTurnMonsterId);
            if (active) {
                this.renderCombatantDetail(active);
            }
        } else if (combatants.length > 0 && !selectedCombatantId) {
            // Show first combatant sorted by initiative
            const sorted = [...combatants].sort((a, b) => (b.initiative || 0) - (a.initiative || 0));
            selectedCombatantId = sorted[0].id;
            this.renderCombatantDetail(sorted[0]);
        }
    },

    renderOrderList(combatants, currentRound, currentTurnMonsterId, initiativeOrder) {
        const orderList = this.container?.querySelector('#combatants-order-list');
        if (!orderList) return;

        if (combatants.length === 0) {
            orderList.innerHTML = '<p class="empty-state">Nessun combattente.</p>';
            return;
        }

        // Pulsante Nuova Iniziativa (solo se combattimento non iniziato)
        const newInitiativeBtn = currentRound === 0 ? 
            `<button class="new-initiative-btn" title="Tira nuova iniziativa per tutti">🎲 Nuova Iniziativa</button>` : '';

        // Usa sempre combatants come fonte di verità per avere dati aggiornati (condizioni, HP, etc.)
        // Se il combattimento è iniziato, ordina per iniziativa mantenendo l'ordine esistente
        let sorted;
        if (currentRound === 0) {
            sorted = [...combatants].sort((a, b) => (b.initiative || 0) - (a.initiative || 0));
        } else {
            // Combattimento iniziato: usa l'ordine di initiativeOrder come guida per l'ordinamento
            // ma prende i dati aggiornati da combatants
            if (initiativeOrder && initiativeOrder.length > 0) {
                // Crea una mappa per accesso rapido ai combatants aggiornati
                const combatantsMap = new Map(combatants.map(c => [c.id, c]));
                // Usa l'ordine di initiativeOrder ma con i dati aggiornati
                sorted = initiativeOrder
                    .map(c => combatantsMap.get(c.id))
                    .filter(c => c !== undefined);
                
                // Aggiungi eventuali nuovi combatants non in initiativeOrder
                const sortedIds = new Set(sorted.map(c => c.id));
                combatants.forEach(c => {
                    if (!sortedIds.has(c.id)) {
                        sorted.push(c);
                    }
                });
            } else {
                sorted = [...combatants].sort((a, b) => (b.initiative || 0) - (a.initiative || 0));
            }
        }

        orderList.innerHTML = newInitiativeBtn + sorted.map(c => {
            const isActive = c.id === currentTurnMonsterId;
            const isSelected = c.id === selectedCombatantId;
            const isTargeted = this.targetCombatant === c.id;
            const hpPercent = (c.currentHp / c.maxHp) * 100;
            const hpColor = hpPercent > 50 ? '#4caf50' : hpPercent > 25 ? '#ff9800' : '#f44336';
            const isDead = c.currentHp <= 0;
            
            // Render condition tags
            const conditionTags = this.renderConditionTags(c);
            
            return `
                <div class="combatant-order-item ${isActive ? 'active-turn' : ''} ${isSelected ? 'selected' : ''} ${isTargeted ? 'targeted' : ''} ${isDead ? 'dead' : ''}" data-id="${c.id}">
                    <div class="order-item-header">
                        <span class="order-item-name">
                            ${c.customName || c.name}
                            ${getSourceBadge(c)}
                            ${isDead ? '💀' : ''}
                        </span>
                        <button class="set-target-btn" data-id="${c.id}" title="Imposta come bersaglio">🎯</button>
                    </div>
                    <div class="order-item-stats">
                        <span style="color: ${hpColor}">PF: ${c.currentHp}/${c.maxHp}</span>
                        <span>Init: <input type="number" class="order-init-input" value="${c.initiative || 0}" data-id="${c.id}"></span>
                    </div>
                    ${conditionTags}
                </div>
            `;
        }).join('');
        
        // Scroll automatico verso il combattente attivo
        if (currentRound > 0 && currentTurnMonsterId) {
            // Usiamo setTimeout per assicurarci che il DOM sia aggiornato
            setTimeout(() => {
                const activeItem = orderList.querySelector('.combatant-order-item.active-turn');
                if (activeItem) {
                    activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 10);
        }
    }
};

export default CombatTracker;
