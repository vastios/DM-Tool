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
    resetActionsForTurn,
    // Editing round manuale
    setRound
} from '../../../stateManager.js';
import { monsterDatabase } from '../../../database/monsterDatabase.js';
import { spellDatabase } from '../../../database/spells.js';
import { conditionsDatabase } from '../../../database/conditions.js';
import { rollDice } from '../../../utils/dice.js';
import { showToast } from '../../../utils/toast.js';
import { getCurrentCampaignId } from '../../../js/services/campaignManager.js';
import { escapeHtml } from '../../../utils/htmlHelpers.js';

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

function generateMonstersPopupContent(searchTerm = '', typeFilter = 'Tutti', limit = 30) {
    const types = ['Tutti', ...new Set(monsterDatabase.map(m => m.type))].sort();
    
    let filtered = monsterDatabase;
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(m => m.name.toLowerCase().includes(term));
    }
    if (typeFilter !== 'Tutti') {
        filtered = filtered.filter(m => m.type === typeFilter);
    }
    
    const totalCount = filtered.length;
    const visibleCount = Math.min(limit, totalCount);
    const visible = filtered.slice(0, visibleCount);
    const hasMore = totalCount > visibleCount;
    
    return `
        <div class="popup-header">
            <span>👹 Mostri dal Compendio (${totalCount})</span>
        </div>
        <div class="popup-search">
            <input type="text" class="popup-search-input" placeholder="Cerca mostro..." value="${searchTerm}">
        </div>
        <div class="popup-filters">
            ${types.map(t => `<button class="popup-filter-btn ${t === typeFilter ? 'active' : ''}" data-type="${t}">${t}</button>`).join('')}
        </div>
        <div class="popup-list">
            ${visible.map(monster => `
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
            ${visible.length === 0 ? '<p class="popup-no-results">Nessun mostro trovato</p>' : ''}
            ${hasMore ? `
                <button class="popup-show-more-btn" data-current-limit="${visibleCount}" style="
                    display: block;
                    width: 100%;
                    padding: 8px;
                    margin-top: 8px;
                    background: rgba(33, 150, 243, 0.2);
                    color: #64b5f6;
                    border: 1px solid #2196f3;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.85rem;
                ">
                    📥 Mostra altri (${totalCount - visibleCount} rimanenti)
                </button>
            ` : ''}
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
    activeTab: 'attacks', // Tab attivo: 'attacks' o 'spells'
    tabPreferences: {}, // Preferenze tab per combattente { combatantId: 'attacks'|'spells' }
    monsterPopupLimit: 30, // Limite dinamico per paginazione mostri nel popup
    
    // Combat Log System
    combatLog: [],
    combatStats: {
        startTime: null,
        endTime: null,
        roundsPlayed: 0,
        damageDealt: {}, // { combatantId: { total, byType: {} } }
        attacksHit: {},  // { combatantId: count }
        attacksMiss: {}, // { combatantId: count }
        criticalHits: {}, // { combatantId: count }
        spellsCasted: {}, // { combatantId: count }
        damageTaken: {}, // { combatantId: total }
        conditionsApplied: {} // { combatantId: { conditionName: count } }
    },
    actedThisTurn: new Set(), // Combattenti che hanno usato la loro azione questo turno

    render(containerElement, itemToLoad = null, itemData = null) {
        this.container = containerElement;
        this.targetCombatant = null; // Bersaglio selezionato per attacchi
        
        loadAllSources();

        // Se arrivano mostri da TravelManager o altre fonti, importali
        if (itemData && itemData.monsters && itemData.monsters.length > 0) {
            console.log('👹 [CombatTracker] Ricevuti mostri da importare:', itemData);
            setTimeout(() => this.importMonstersFromTravel(itemData), 100);
        }

        containerElement.innerHTML = `
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
            <button id="combat-log-btn" class="log-btn" title="Log Combattimento">📜 Log</button>
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
    
    <!-- Combat Log Popup Overlay -->
    <div id="combat-log-overlay" class="popup-overlay hidden">
        <div class="combat-log-popup-container">
            <button class="popup-close" title="Chiudi">×</button>
            <div class="combat-log-content">
                <div class="log-header">
                    <h3>📜 Log Combattimento</h3>
                    <div class="log-actions">
                        <button id="export-log-txt-btn" class="log-action-btn">📄 Esporta TXT</button>
                        <button id="export-log-md-btn" class="log-action-btn">📝 Esporta MD</button>
                        <button id="export-log-json-btn" class="log-action-btn">💾 Esporta JSON</button>
                        <button id="clear-log-btn" class="log-action-btn danger">🗑️ Cancella Log</button>
                    </div>
                </div>
                <div id="combat-log-entries" class="log-entries"></div>
            </div>
        </div>
    </div>
    
    <!-- Saving Throw Popup Overlay -->
    <div id="saving-throw-overlay" class="popup-overlay hidden">
        <div class="saving-throw-popup-container">
            <button class="popup-close" title="Chiudi">×</button>
            <div id="saving-throw-content" class="popup-content"></div>
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

    bindEvents() {
        const container = this.container;
        
        // Header buttons
        container.querySelector('#start-combat-btn')?.addEventListener('click', () => {
            startCombat();
            selectedCombatantId = null; // Reset per seguire il turno corrente
            this.startCombatLog(); // Avvia il log del combattimento
            this.actedThisTurn.clear(); // Reset azioni questo turno
            showToast('Combattimento iniziato!', 'success');
        });

        container.querySelector('#next-turn-btn')?.addEventListener('click', () => {
            // Reset selezione PRIMA di nextTurn per seguire automaticamente il turno corrente
            selectedCombatantId = null;
            this.actedThisTurn.clear(); // Reset azioni per il prossimo turno
            nextTurn();
        });

        // Round input editing manuale
        container.querySelector('#round-input')?.addEventListener('change', (e) => {
            const newRound = parseInt(e.target.value, 10);
            if (isNaN(newRound) || newRound < 0) {
                showToast('Valore round non valido', 'warning');
                e.target.value = this.currentRound;
                return;
            }
            if (newRound === this.currentRound) return;
            setRound(newRound);
            showToast(`Round impostato a ${newRound}`, 'info');
        });

        container.querySelector('#end-combat-btn')?.addEventListener('click', () => {
            if (confirm('Terminare il combattimento?\n\nI combattenti rimarranno nella lista con le condizioni azzerate. Potrai ricominciare ritirando l\'iniziativa.')) {
                endCombat();
                selectedCombatantId = null;
                this.endCombatLog(); // Finalizza log e mostra riepilogo
            }
        });

        container.querySelector('#clear-combat-btn')?.addEventListener('click', () => {
            if (confirm('Svuotare il combattimento?')) {
                clearCombat();
                selectedCombatantId = null;
                this.clearLog(); // Cancella anche il log
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
        
        // Combat Log events
        const logBtn = container.querySelector('#combat-log-btn');
        logBtn?.addEventListener('click', () => this.openCombatLog());
        
        const logOverlay = container.querySelector('#combat-log-overlay');
        logOverlay?.addEventListener('click', (e) => {
            if (e.target.id === 'combat-log-overlay') {
                this.closeCombatLog();
            }
        });
        
        const logCloseBtn = logOverlay?.querySelector('.popup-close');
        logCloseBtn?.addEventListener('click', () => this.closeCombatLog());
        
        // Log export buttons
        container.querySelector('#export-log-txt-btn')?.addEventListener('click', () => this.exportLog('txt'));
        container.querySelector('#export-log-md-btn')?.addEventListener('click', () => this.exportLog('md'));
        container.querySelector('#export-log-json-btn')?.addEventListener('click', () => this.exportLog('json'));
        container.querySelector('#clear-log-btn')?.addEventListener('click', () => this.clearLog());
        
        // Order list hover for condition tooltips
        const orderList = container.querySelector('#combatants-order-list');
        orderList?.addEventListener('mouseover', (e) => this.handleOrderListHover(e));
        orderList?.addEventListener('mouseout', (e) => this.handleOrderListOut(e));
        
        // Saving Throw popup events
        const savingThrowOverlay = container.querySelector('#saving-throw-overlay');
        savingThrowOverlay?.addEventListener('click', (e) => {
            if (e.target.id === 'saving-throw-overlay') {
                this.closeSavingThrowPopup();
            }
        });
        
        const savingThrowCloseBtn = savingThrowOverlay?.querySelector('.popup-close');
        savingThrowCloseBtn?.addEventListener('click', () => this.closeSavingThrowPopup());
        
        const savingThrowContent = container.querySelector('#saving-throw-content');
        savingThrowContent?.addEventListener('click', (e) => this.handleSavingThrowPopupClick(e));
    },

    // --- POPUP MANAGEMENT ---
    
    openPopup(source) {
        this.currentPopup = source;
        this.popupSearchTerm = '';
        this.popupTypeFilter = 'Tutti';
        this.monsterPopupLimit = 30; // Reset paginazione mostri quando si apre il popup
        
        // Ricarica le fonti per avere dati aggiornati (NPC, incontri creati dopo l'apertura del modulo)
        loadAllSources();
        
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
            <div class="popup-header" style="padding: 8px 0; margin-bottom: 8px;">
                <span style="font-size: 0.9rem;">🩹 ${combatant?.customName || combatant?.name || 'Combattente'}</span>
            </div>
            <p style="color: var(--text-muted, #888); font-size: 0.75rem; margin-bottom: 6px;">
                Clicca per selezionare nuove condizioni. Durata: 0 = permanente.<br>
                Per rimuovere una condizione attiva, clicca il pulsante "✕" in rosso.
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
                            ${alreadyHas ? `
                                <small style="color: #4caf50; font-size: 0.6rem;">✓ Attiva</small>
                                <button class="remove-condition-btn" 
                                        data-condition="${condName}"
                                        style="background: rgba(244, 67, 54, 0.2); color: #e57373; border: 1px solid #f44336; padding: 2px 8px; border-radius: 3px; cursor: pointer; font-size: 0.65rem; margin-top: 4px;">
                                    ✕ Rimuovi
                                </button>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="condition-duration-selector">
                <label style="font-size: 0.75rem;">Durata:</label>
                <input type="number" id="condition-duration-input" value="0" min="0" max="100" style="width: 40px; padding: 3px 6px; font-size: 0.8rem;">
                <span style="font-size: 0.7rem;">turni</span>
            </div>
            <button class="apply-conditions-btn" id="apply-conditions-btn" disabled>
                ✓ Applica Selezionate
            </button>
        `;
    },
    
    handleConditionsPopupClick(e) {
        // Rimuovi condizione esistente
        const removeBtn = e.target.closest('.remove-condition-btn');
        if (removeBtn) {
            const condName = removeBtn.dataset.condition;
            const combatantId = this.conditionsPopupCombatantId;
            if (condName && combatantId) {
                removeConditionFromCombatant(combatantId, condName);
                // Log evento condition_removed
                this.logEvent('condition_removed', {
                    targetId: combatantId,
                    conditionName: condName
                });
                showToast(`${condName} rimossa`, 'info');
                // Aggiorna il popup
                const content = this.container.querySelector('#conditions-popup-content');
                if (content) {
                    content.innerHTML = this.getConditionsPopupContent(combatantId);
                }
            }
            return;
        }
        
        const card = e.target.closest('.condition-card');
        // Solo le card NON già attive possono essere selezionate per l'aggiunta
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
    
    // --- SAVING THROW POPUP ---
    
    /**
     * Apre il popup per il tiro salvezza.
     * @param {Object} data - { targetId, attackerId, attackName, effect }
     */
    openSavingThrowPopup(data) {
        const overlay = this.container.querySelector('#saving-throw-overlay');
        const content = this.container.querySelector('#saving-throw-content');
        if (!overlay || !content) return;
        
        this.savingThrowData = data;
        
        const combatants = getCombatState();
        const target = combatants.find(c => c.id === data.targetId);
        const attacker = combatants.find(c => c.id === data.attackerId);
        
        const targetName = target?.customName || target?.name || 'Bersaglio';
        const attackerName = attacker?.customName || attacker?.name || 'Attaccante';
        
        content.innerHTML = `
            <div class="saving-throw-popup">
                <h3>🛡️ Tiro Salvezza</h3>
                <div class="save-info">
                    <p><strong>${targetName}</strong> deve superare un tiro salvezza!</p>
                    <div class="save-details">
                        <span class="save-type">${data.effect.saveType || 'Costituzione'}</span>
                        <span class="save-dc">CD ${data.effect.dc || 10}</span>
                    </div>
                    <p class="save-effect">${data.effect.description || ''}</p>
                </div>
                <div class="save-roll-section">
                    <label>Tiro effettuato dal DM:</label>
                    <div class="save-input-row">
                        <input type="number" id="save-roll-input" value="" placeholder="Tiro" min="1" max="20" style="width: 60px;">
                        <span>+</span>
                        <input type="number" id="save-bonus-input" value="${this.getSaveBonus(target, data.effect.saveType)}" placeholder="Bonus" style="width: 50px;">
                        <span>=</span>
                        <span id="save-total">?</span>
                    </div>
                    <button id="roll-save-btn" class="roll-save-btn">🎲 Tira d20</button>
                </div>
                <div class="save-buttons">
                    <button id="save-success-btn" class="save-btn success">✅ Successo</button>
                    <button id="save-fail-btn" class="save-btn fail">❌ Fallimento</button>
                </div>
                <input type="hidden" id="save-effect-data" value='${JSON.stringify(data.effect)}'>
            </div>
        `;
        
        overlay.classList.remove('hidden');
        
        // Bind roll button
        const rollBtn = content.querySelector('#roll-save-btn');
        rollBtn?.addEventListener('click', () => {
            const rollResult = rollDice('1d20');
            const roll = rollResult.rolls?.[0] || rollResult;
            const rollInput = content.querySelector('#save-roll-input');
            if (rollInput) rollInput.value = roll;
            this.updateSaveTotal();
        });
        
        // Bind input changes
        content.querySelector('#save-roll-input')?.addEventListener('input', () => this.updateSaveTotal());
        content.querySelector('#save-bonus-input')?.addEventListener('input', () => this.updateSaveTotal());
    },
    
    updateSaveTotal() {
        const roll = parseInt(this.container.querySelector('#save-roll-input')?.value, 10) || 0;
        const bonus = parseInt(this.container.querySelector('#save-bonus-input')?.value, 10) || 0;
        const totalSpan = this.container.querySelector('#save-total');
        if (totalSpan) {
            totalSpan.textContent = roll + bonus;
        }
    },
    
    getSaveBonus(combatant, saveType) {
        if (!combatant || !saveType) return 0;
        
        const saveMap = {
            'Forza': 'strength_save',
            'Destrezza': 'dexterity_save',
            'Costituzione': 'constitution_save',
            'Intelligenza': 'intelligence_save',
            'Saggezza': 'wisdom_save',
            'Carisma': 'charisma_save'
        };
        
        const saveKey = saveMap[saveType];
        if (saveKey && combatant[saveKey]) {
            return combatant[saveKey];
        }
        
        // Fallback: calcola dalla caratteristica
        const abilityMap = {
            'Forza': 'strength',
            'Destrezza': 'dexterity',
            'Costituzione': 'constitution',
            'Intelligenza': 'intelligence',
            'Saggezza': 'wisdom',
            'Carisma': 'charisma'
        };
        
        const abilityKey = abilityMap[saveType];
        if (abilityKey && combatant[abilityKey]) {
            const abilityMod = Math.floor((combatant[abilityKey] - 10) / 2);
            return abilityMod;
        }
        
        return 0;
    },
    
    closeSavingThrowPopup() {
        const overlay = this.container.querySelector('#saving-throw-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
        this.savingThrowData = null;
    },
    
    handleSavingThrowPopupClick(e) {
        const data = this.savingThrowData;
        if (!data) return;
        
        if (e.target.id === 'save-success-btn') {
            // Salvezza riuscita
            this.logSavingThrow(data, true);
            // Applica comunque effetti parziali (es. danno dimezzato per success_type 'half')
            this.applySpecialEffect({ ...data, success: true });
            showToast(`Tiro salvezza riuscito!`, 'success');
            this.closeSavingThrowPopup();
        } else if (e.target.id === 'save-fail-btn') {
            // Salvezza fallita - applica condizione e danno completo
            this.logSavingThrow(data, false);
            this.applySpecialEffect({ ...data, success: false });
            this.closeSavingThrowPopup();
        }
    },
    
    logSavingThrow(data, success) {
        const combatants = getCombatState();
        const target = combatants.find(c => c.id === data.targetId);
        const attacker = combatants.find(c => c.id === data.attackerId);
        
        const targetName = target?.customName || target?.name || 'Bersaglio';
        const attackerName = attacker?.customName || attacker?.name || 'Attaccante';
        const effectDesc = data.effect.description || 'effetto speciale';
        
        const resultText = success ? '✅ Riuscito' : '❌ Fallito';
        
        this.logEvent('saving_throw', {
            attackerId: data.attackerId,
            targetId: data.targetId,
            attackName: data.attackName,
            saveType: data.effect.saveType,
            dc: data.effect.dc,
            success: success
        });
        
        // Log nel results box
        const resultsBox = this.container.querySelector('.results-box-mini');
        if (resultsBox) {
            const logHtml = `
                <div class="save-result ${success ? 'success' : 'fail'}" style="
                    padding: 6px 10px;
                    margin: 4px 0;
                    background: ${success ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)'};
                    border-left: 3px solid ${success ? '#4caf50' : '#f44336'};
                    border-radius: 4px;
                ">
                    🛡️ <strong>${targetName}</strong>: Tiro Salvezza ${data.effect.saveType} CD ${data.effect.dc}
                    <br>${resultText}
                    ${!success ? `<br><small style="color: #f44336;">${data.effect.condition || 'Effetto applicato!'}</small>` : ''}
                </div>
            `;
            resultsBox.innerHTML = logHtml + resultsBox.innerHTML;
        }
    },
    
    applySpecialEffect(data) {
        if (!data.targetId || !data.effect) return;
        
        const effect = data.effect;
        
        // Applica il danno se specificato (con gestione success_type)
        // Il popup tiro salvezza ha già determinato se successo o fallimento
        // Qui applichiamo il danno in base al risultato passato in data.success
        if (effect.damage && effect.damage.length > 0) {
            let totalDamage = 0;
            let damageTypes = [];
            effect.damage.forEach(d => {
                if (d.dice) {
                    const dmgResult = rollDice(d.dice);
                    const dmgValue = dmgResult.total || dmgResult;
                    totalDamage += dmgValue;
                    damageTypes.push(`${dmgValue} ${d.type}`);
                }
            });
            
            // Se la salvezza è riuscita e success_type è 'half', dimezza il danno
            if (data.success === true && effect.successType === 'half') {
                totalDamage = Math.floor(totalDamage / 2);
                damageTypes = damageTypes.map(d => `(metà) ${d}`);
            }
            
            // Se la salvezza è riuscita e success_type è 'none', nessun danno
            if (data.success === true && effect.successType === 'none') {
                totalDamage = 0;
            }
            
            if (totalDamage > 0) {
                // Applica il danno al bersaglio
                const combatants = getCombatState();
                const target = combatants.find(c => c.id === data.targetId);
                if (target) {
                    const oldHp = target.currentHp || 0;
                    const newHp = Math.max(0, oldHp - totalDamage);
                    updateMonsterProperty(data.targetId, 'currentHp', newHp);
                    this.logEvent('damage', {
                        attackerId: data.attackerId,
                        targetId: data.targetId,
                        damage: totalDamage,
                        damageType: damageTypes[0]?.split(' ')[1] || 'physical'
                    });
                    
                    // Mostra nel results box
                    const resultsBox = this.container.querySelector('.results-box-mini');
                    if (resultsBox) {
                        const targetName = target.customName || target.name;
                        const dmgHtml = `
                            <div class="spell-damage-result" style="
                                padding: 6px 10px;
                                margin: 4px 0;
                                background: rgba(244, 67, 54, 0.15);
                                border-left: 3px solid #f44336;
                                border-radius: 4px;
                            ">
                                💥 <strong>${data.attackName}</strong> → ${targetName}: ${totalDamage} danni (${damageTypes.join(' + ')})
                            </div>
                        `;
                        resultsBox.innerHTML = dmgHtml + resultsBox.innerHTML;
                    }
                }
            }
        }
        
        // Applica la condizione se specificata (solo se salvezza fallita)
        if (effect.condition && data.success !== true) {
            const duration = effect.duration || 0;
            addConditionToCombatant(data.targetId, effect.condition, duration);
            showToast(`${effect.condition} applicato!`, 'warning');
            
            // Log
            this.logEvent('condition_applied', {
                targetId: data.targetId,
                conditionName: effect.condition
            });
        }
        
        // Gestisci effetti speciali multi-step (come la Cockatrice)
        if (effect.followUpSave && data.success !== true) {
            // Memorizza che il bersaglio deve fare un altro tiro salvezza
            const combatants = getCombatState();
            const target = combatants.find(c => c.id === data.targetId);
            if (target) {
                const pendingSaves = target.pendingSaves || [];
                pendingSaves.push({
                    source: data.attackerId,
                    attackName: data.attackName,
                    effect: effect.followUpSave,
                    turn: this.currentRound + 1 // Prossimo turno
                });
                updateMonsterProperty(data.targetId, 'pendingSaves', pendingSaves);
                showToast(`${target.customName || target.name} deve ripetere il tiro salvezza al prossimo turno!`, 'info');
            }
        }
        
        // Gestisci concentrazione per incantesimi
        if (effect.concentration && data.attackerId) {
            // Imposta la concentrazione sul combatant che ha lanciato l'incantesimo
            setConcentration(data.attackerId, {
                spellName: data.attackName,
                duration: effect.duration || 10,
                targetId: data.targetId
            });
        }
    },
    
    // --- SPECIAL EFFECTS PARSER ---
    
    /**
     * Analizza la descrizione di un attacco per estrarre effetti speciali.
     * @param {Object} attack - L'oggetto attacco con name, desc, ecc.
     * @returns {Object|null} Oggetto con dc, saveType, condition, description, duration, followUp
     */
    /**
     * Funzione UNIFICATA per estrarre effetti speciali da qualsiasi tipo di azione.
     * Privilegia i dati strutturati (dc, damage) quando presenti, fallback al parser testuale.
     * Supporta: attacchi, azioni speciali, azioni leggendarie, incantesimi.
     * 
     * @param {Object} actionData - L'oggetto azione con name, desc, dc, damage, ecc.
     * @param {Object} attacker - Il combatant che esegue l'azione (per calcolare CD dinamica incantesimi)
     * @returns {Object|null} Effetto { dc, saveType, condition, description, duration, followUpSave, damage, successType }
     */
    extractEffectFromAction(actionData, attacker = null) {
        if (!actionData) return null;
        
        const effect = {
            dc: null,
            saveType: null,
            condition: null,
            description: null,
            duration: 0,
            followUpSave: null,
            damage: null,
            successType: null,
            area: null,
            targetType: null,
            targetCount: 1,
            concentration: false
        };
        
        // --- 0. PRIORITÀ MASSIMA: metadati strutturati di spells.js ---
        // Se actionData è un incantesimo con metadati strutturati (arricchito Fase B), usali direttamente
        if (actionData.save) {
            effect.saveType = this.normalizeSaveType(actionData.save.type) || actionData.save.type;
            effect.successType = actionData.save.success_type || 'other';
            // CD dinamica dal combatant (per incantesimi, CD = 8 + PB + abilityMod)
            if (attacker?.spellState?.dc) {
                effect.dc = attacker.spellState.dc;
            }
        }
        if (actionData.damage && Array.isArray(actionData.damage)) {
            effect.damage = actionData.damage.map(d => ({
                dice: d.dice || d.damage_dice || null,
                type: d.type || d.damage_type?.name || 'danni'
            }));
        }
        if (actionData.condition) {
            effect.condition = actionData.condition.name;
            effect.duration = actionData.condition.duration || 0;
            if (actionData.condition.repeat_save === 'end_of_turn') {
                // Imposta followUpSave per ripetere il tiro al turno successivo
                effect.followUpSave = {
                    dc: effect.dc,
                    saveType: effect.saveType,
                    condition: effect.condition,
                    duration: effect.duration || 24,
                    description: 'Deve ripetere il tiro salvezza alla fine del turno'
                };
            }
        }
        if (actionData.target) {
            effect.targetType = actionData.target.type;
            effect.targetCount = actionData.target.count || 1;
        }
        if (actionData.area) {
            effect.area = actionData.area;
        }
        if (actionData.concentration) {
            effect.concentration = true;
        }
        
        // --- 1. Dati strutturati del mostro (dc.dc_type, dc.dc_value, success_type) ---
        if (actionData.dc) {
            if (actionData.dc.dc_value) {
                effect.dc = actionData.dc.dc_value;
            }
            if (actionData.dc.dc_type?.name) {
                effect.saveType = this.normalizeSaveType(actionData.dc.dc_type.name);
            }
            if (actionData.dc.success_type) {
                effect.successType = actionData.dc.success_type; // 'half', 'none', 'other'
            }
        }
        
        // --- 2. Calcolo CD dinamica per incantesimi (CD = 8 + bonus competenza + mod caratteristica) ---
        // Solo se non abbiamo già una CD strutturata e l'azione sembra un incantesimo
        if (!effect.dc && attacker?.spellState) {
            const spellState = attacker.spellState;
            if (spellState.dc) {
                effect.dc = spellState.dc;
                if (spellState.ability) {
                    effect.saveType = this.abilityToSaveType(spellState.ability);
                }
            }
        }
        
        // --- 3. Estrai danno strutturato (per applica danno automatico) ---
        if (actionData.damage && Array.isArray(actionData.damage)) {
            effect.damage = actionData.damage.map(d => ({
                dice: d.damage_dice || null,
                type: d.damage_type?.name || 'danni'
            }));
        }
        
        // --- 4. FALLBACK: parser testuale per CD, saveType, condizione (se mancano) ---
        const desc = actionData.desc || '';
        if (desc) {
            // CD dal testo (solo se non già estratta)
            if (!effect.dc) {
                const dcMatch = desc.match(/CD\s*(\d+)|tiro salvezza[^.]*CD\s*(\d+)/i);
                if (dcMatch) {
                    effect.dc = parseInt(dcMatch[1] || dcMatch[2], 10);
                }
            }
            
            // SaveType dal testo (solo se non già estratto)
            if (!effect.saveType) {
                const saveTypeMap = [
                    { keywords: ['costituzione', 'cos', 'con'], type: 'Costituzione' },
                    { keywords: ['destrezza', 'des', 'dex'], type: 'Destrezza' },
                    { keywords: ['forza', 'for', 'str'], type: 'Forza' },
                    { keywords: ['saggezza', 'sag', 'wis'], type: 'Saggezza' },
                    { keywords: ['intelligenza', 'int'], type: 'Intelligenza' },
                    { keywords: ['carisma', 'car', 'cha'], type: 'Carisma' }
                ];
                const descLower = desc.toLowerCase();
                for (const sm of saveTypeMap) {
                    if (sm.keywords.some(k => descLower.includes(k))) {
                        effect.saveType = sm.type;
                        break;
                    }
                }
            }
            
            // Condizioni dal testo (con sinonimi)
            const conditionPatterns = [
                // Condizioni standard
                { pattern: /pietrificato/i, condition: 'Pietrificato' },
                { pattern: /avvelenato/i, condition: 'Avvelenato' },
                { pattern: /stordito/i, condition: 'Stordito' },
                { pattern: /paralizzato/i, condition: 'Paralizzato' },
                { pattern: /trattenuto/i, condition: 'Trattenuto' },
                { pattern: /afferrato|afferrata/i, condition: 'Afferrato' },
                { pattern: /prono/i, condition: 'Prono' },
                { pattern: /accecato|accecata/i, condition: 'Accecato' },
                { pattern: /assordato|assordata/i, condition: 'Assordato' },
                { pattern: /spaventato|spaventata/i, condition: 'Spaventato' },
                { pattern: /inabile|incapacitata|incapacitato/i, condition: 'Inabile' },
                { pattern: /svenuto|priva di sensi|privo di sensi/i, condition: 'Svenuto' },
                // Sinonimi comuni
                { pattern: /\baffascinato\b|incantato|incantata/i, condition: 'Affascinato' },
                { pattern: /intralciato|intralciata/i, condition: 'Intralciato' },
                { pattern: /invisibile|diventa invisibile/i, condition: 'Invisibile' },
                // Indebolimento è un caso a parte (livelli), lo rileviamo ma è raro negli effetti
                { pattern: /indebolimento|livelli di indebolimento/i, condition: 'Indebolimento' }
            ];
            
            for (const cp of conditionPatterns) {
                if (cp.pattern.test(desc)) {
                    effect.condition = cp.condition;
                    break;
                }
            }
            
            // Durata dal testo
            const durationMatch = desc.match(/(\d+)\s*(?:turni?|ore?|minuti?|round)/i);
            if (durationMatch) {
                effect.duration = parseInt(durationMatch[1], 10);
            }
            
            // Effetti multi-step (generalizzato, non solo Cockatrice)
            // Pattern: "ripetere il tiro salvezza" + condizione finale
            if (desc.includes('ripetere') || desc.includes('fine del suo turno successivo')) {
                // Cerca la condizione finale (es. "è pietrificato", "è paralizzato")
                const finalCondMatch = desc.match(/se lo fallisce[^.]*è\s+(\w+)/i);
                if (finalCondMatch && effect.condition) {
                    // La condizione attuale è quella "iniziale" (es. Trattenuto)
                    // La condizione finale sarà quella grave dopo il 2° fallimento
                    effect.followUpSave = {
                        dc: effect.dc,
                        saveType: effect.saveType,
                        condition: effect.condition, // Stessa condizione, ma "definitiva"
                        duration: effect.duration || 24,
                        description: 'Deve ripetere il tiro salvezza'
                    };
                    effect.description = `Inizia: ${effect.condition} (effetto progressivo)`;
                }
            }
        }
        
        // --- 5. Se abbiamo CD e saveType, ritorna l'effetto ---
        if (effect.dc && effect.saveType) {
            if (!effect.description) {
                const parts = [];
                if (effect.condition) parts.push(`Se fallisce: ${effect.condition}`);
                if (effect.damage) parts.push(`Danno: ${effect.damage.map(d => `${d.dice} ${d.type}`).join(' + ')}`);
                if (effect.area) parts.push(`Area: ${effect.area.shape} ${effect.area.radius || effect.area.length}m`);
                effect.description = parts.join(' | ') || 'Effetto speciale';
            }
            return effect;
        }
        
        // --- 6. Se abbiamo solo danno strutturato (nessun TS), ritorna comunque per applicazione danno ---
        if (effect.damage && effect.damage.length > 0) {
            effect.description = `Danno: ${effect.damage.map(d => `${d.dice} ${d.type}`).join(' + ')}`;
            return effect;
        }
        
        // --- 7. Se abbiamo solo condizione (incantesimi di solo condition senza CD strutturata) ---
        // Ad esempio: incantesimi con condition estratta dal testo ma CD dinamica non ancora calcolata
        if (effect.condition && !effect.dc && attacker?.spellState?.dc) {
            effect.dc = attacker.spellState.dc;
            if (!effect.saveType && attacker.spellState.ability) {
                effect.saveType = this.abilityToSaveType(attacker.spellState.ability);
            }
            if (effect.saveType) {
                effect.description = `Se fallisce: ${effect.condition}`;
                return effect;
            }
        }
        
        return null;
    },
    
    /**
     * Normalizza il tipo di salvezza dal formato del database (es. "CON", "cos", "COS") 
     * al formato italiano completo ("Costituzione").
     */
    normalizeSaveType(raw) {
        if (!raw) return null;
        const normalized = raw.toLowerCase().trim();
        const map = {
            'con': 'Costituzione', 'cos': 'Costituzione', 'costituzione': 'Costituzione',
            'des': 'Destrezza', 'dex': 'Destrezza', 'destrezza': 'Destrezza',
            'for': 'Forza', 'str': 'Forza', 'forza': 'Forza',
            'sag': 'Saggezza', 'wis': 'Saggezza', 'saggezza': 'Saggezza',
            'int': 'Intelligenza', 'intelligenza': 'Intelligenza',
            'car': 'Carisma', 'cha': 'Carisma', 'carisma': 'Carisma'
        };
        return map[normalized] || null;
    },
    
    /**
     * Converte il tipo di caratteristica (INT, WIS, ecc.) nel tipo di tiro salvezza corrispondente.
     */
    abilityToSaveType(ability) {
        if (!ability) return null;
        const normalized = ability.toLowerCase().trim();
        const map = {
            'int': 'Intelligenza', 'intelligence': 'Intelligenza',
            'wis': 'Saggezza', 'wisdom': 'Saggezza',
            'cha': 'Carisma', 'charisma': 'Carisma',
            'con': 'Costituzione', 'constitution': 'Costituzione',
            'dex': 'Destrezza', 'dexterity': 'Destrezza',
            'str': 'Forza', 'strength': 'Forza'
        };
        return map[normalized] || null;
    },

    parseSpecialEffect(attack) {
        if (!attack || !attack.desc) return null;
        
        const desc = attack.desc;
        const effect = {
            dc: null,
            saveType: null,
            condition: null,
            description: null,
            duration: 0,
            followUpSave: null
        };
        
        // Pattern per estrarre CD
        const dcPattern = /CD\s*(\d+)|tiro salvezza[^.]*CD\s*(\d+)|CD\s*(\d+)\s*(?:per|a)/i;
        const dcMatch = desc.match(dcPattern);
        if (dcMatch) {
            effect.dc = parseInt(dcMatch[1] || dcMatch[2] || dcMatch[3], 10);
        }
        
        // Pattern per estrarre tipo di tiro salvezza
        const saveTypes = ['Costituzione', 'Destrezza', 'Forza', 'Saggezza', 'Intelligenza', 'Carisma',
                          'costituzione', 'destrezza', 'forza', 'saggezza', 'intelligenza', 'carisma'];
        for (const save of saveTypes) {
            if (desc.toLowerCase().includes(save.toLowerCase())) {
                effect.saveType = save.charAt(0).toUpperCase() + save.slice(1).toLowerCase();
                break;
            }
        }
        
        // Pattern per estrarre condizioni
        const conditionPatterns = [
            { pattern: /pietrificato/i, condition: 'Pietrificato' },
            { pattern: /avvelenato/i, condition: 'Avvelenato' },
            { pattern: /stordito/i, condition: 'Stordito' },
            { pattern: /paralizzato/i, condition: 'Paralizzato' },
            { pattern: /trattenuto/i, condition: 'Trattenuto' },
            { pattern: /afferrato/i, condition: 'Afferrato' },
            { pattern: /prono/i, condition: 'Prono' },
            { pattern: /accecato/i, condition: 'Accecato' },
            { pattern: /assordato/i, condition: 'Assordato' },
            { pattern: /spaventato/i, condition: 'Spaventato' },
            { pattern: /affascinato/i, condition: 'Affascinato' },
            { pattern: /inabile/i, condition: 'Inabile' },
            { pattern: /svenuto/i, condition: 'Svenuto' }
        ];
        
        for (const cp of conditionPatterns) {
            if (cp.pattern.test(desc)) {
                effect.condition = cp.condition;
                break;
            }
        }
        
        // Pattern per estrarre durata
        const durationPattern = /(\d+)\s*(?:turni?|ore?|minuti?|round)/i;
        const durationMatch = desc.match(durationPattern);
        if (durationMatch) {
            effect.duration = parseInt(durationMatch[1], 10);
        }
        
        // Pattern per effetti multi-step (es. Cockatrice: "trattenuta" poi "pietrificato")
        if (desc.includes('ripetere') || desc.includes('fine del suo turno successivo')) {
            // Questo attacco ha un effetto progressivo
            const nextConditionMatch = desc.match(/se lo fallisce[^.]*è\s+(\w+)/i);
            if (nextConditionMatch) {
                effect.followUpSave = {
                    dc: effect.dc,
                    saveType: effect.saveType,
                    condition: 'Pietrificato', // La condizione finale
                    duration: effect.duration || 24, // Default 24 ore per pietrificazione
                    description: 'Deve ripetere il tiro salvezza'
                };
                // La condizione iniziale è "Trattenuto" per la Cockatrice
                if (desc.includes('trasformarsi in pietra') || desc.includes('inizia a')) {
                    effect.condition = 'Trattenuto';
                    effect.description = 'Inizia a trasformarsi in pietra';
                }
            }
        }
        
        // Se abbiamo trovato CD e tipo salvezza, ritorna l'effetto
        if (effect.dc && effect.saveType) {
            effect.description = effect.description || `Se fallisce: ${effect.condition || 'effetto speciale'}`;
            return effect;
        }
        
        return null;
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
            case 'monsters': return generateMonstersPopupContent(this.popupSearchTerm, this.popupTypeFilter, this.monsterPopupLimit);
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
                const wasFocused = document.activeElement === activeInput;
                const cursorPos = activeInput?.selectionStart || 0;
                
                // Aggiorna il contenuto
                content.innerHTML = this.getPopupContent(this.currentPopup);
                
                // Ripristina il focus e la posizione del cursore (anche se l'input è vuoto)
                const newInput = content.querySelector('.popup-search-input');
                if (newInput && wasFocused) {
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
                const pc = availablePcs.find(p => String(p.id) === String(addBtn.dataset.id));
                if (pc) addPcToCombat(pc);
            } else if (type === 'npc') {
                const npc = availableNpcs.find(n => String(n.id) === String(addBtn.dataset.id));
                if (npc) addNpcToCombat(npc);
            } else if (type === 'monster') {
                const monster = monsterDatabase.find(m => String(m.index) === String(addBtn.dataset.index));
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
            this.monsterPopupLimit = 30; // Reset paginazione quando si cambia filtro
            this.refreshPopup();
            return;
        }
        
        // Show more button (paginazione mostri)
        if (target.classList.contains('popup-show-more-btn')) {
            this.monsterPopupLimit += 30;
            this.refreshPopup();
            return;
        }
    },

    handlePopupInput(e) {
        if (e.target.classList.contains('popup-search-input')) {
            const newValue = e.target.value;
            // Reset paginazione quando il search term cambia significativamente
            if (this.popupSearchTerm && newValue.length < this.popupSearchTerm.length) {
                this.monsterPopupLimit = 30;
            } else if (!this.popupSearchTerm && newValue) {
                this.monsterPopupLimit = 30;
            }
            this.popupSearchTerm = newValue;
            // Debounce 250ms per evitare re-render eccessivi durante la digitazione
            clearTimeout(this._popupSearchDebounce);
            this._popupSearchDebounce = setTimeout(() => {
                this.refreshPopup();
            }, 250);
        }
    },

    /**
     * Importa mostri dal TravelManager o altre fonti esterne.
     * @param {Object} data - Dati contenenti { monsters: [], encounterTitle: string, source: string }
     */
    importMonstersFromTravel(data) {
        const { monsters, encounterTitle, source } = data;
        
        if (!monsters || monsters.length === 0) {
            showToast('Nessun mostro da importare.', 'warning');
            return;
        }

        let totalAdded = 0;
        
        monsters.forEach(monsterData => {
            // Il mostro potrebbe avere un campo 'count' che indica quanti esemplari aggiungere
            const count = monsterData.count || 1;
            
            // Cerca il mostro completo nel database per avere tutti i dati
            let fullMonster = monsterDatabase.find(m => m.index === monsterData.index || m.name === monsterData.name);
            
            if (!fullMonster) {
                // Se non trovato nel database, usa i dati parziali dal TravelManager
                console.warn(`⚠️ [CombatTracker] Mostro non trovato nel database: ${monsterData.name}, uso dati parziali`);
                fullMonster = monsterData;
            }
            
            // Aggiungi 'count' esemplari di questo mostro
            for (let i = 0; i < count; i++) {
                addMonsterToCombat(fullMonster);
                totalAdded++;
            }
        });

        const sourceLabel = source === 'travelManager' ? 'Travel Manager' : source;
        showToast(`${totalAdded} mostri importati da ${sourceLabel}${encounterTitle ? ` (${encounterTitle})` : ''}`, 'success');
        console.log(`✅ [CombatTracker] Importati ${totalAdded} mostri da ${source}`);
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
        const conditionsHtml = this.renderActiveConditionsCompact(combatant);
        
        // Concentrazione attiva
        const concentrationHtml = this.renderConcentration(combatant);
        
        // Incantesimi attivi (buff/debuff)
        const activeSpellsHtml = this.renderActiveSpellsUI(combatant);
        
        // Death Saves per PG a 0 HP
        const deathSavesHtml = this.renderDeathSaves(combatant);
        
        // Determina il tab attivo per questo combattente
        const activeTab = this.tabPreferences[combatant.id] || this.activeTab;
        
        // Conta incantesimi per il badge
        const spellCount = this.countAvailableSpells(combatant);
        
        detailView.innerHTML = `
            <div class="combatant-card ${isDead ? 'unconscious' : ''}" data-id="${combatant.id}">
                <!-- HEADER FISSO -->
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
                
                <!-- LAYOUT 2 COLONNE CON TAB -->
                <div class="combatant-two-column-layout">
                    <!-- COLONNA SINISTRA (1/3) - HP, Condizioni, Note -->
                    <div class="combatant-left-column">
                        <!-- HP Section -->
                        <div class="column-cell hp-section">
                            <h6 class="column-cell-title">❤️ Punti Ferita</h6>
                            
                            <!-- HP Display compatto -->
                            <div class="hp-display-compact">
                                <span class="hp-current-compact" style="color: ${hpBarColor}">${combatant.currentHp}</span>
                                <span class="hp-max-compact">/ ${combatant.maxHp}</span>
                            </div>
                            
                            <!-- HP Bar -->
                            <div class="hp-bar-compact">
                                <div class="hp-bar-fill" style="width: ${hpPercent}%; background: ${hpBarColor};"></div>
                            </div>
                            
                            <!-- HP Controls -->
                            <div class="hp-controls">
                                <button class="hp-btn hp-minus" data-id="${combatant.id}" title="-5 PF">−</button>
                                <input type="number" class="stat-input hp-current" value="${combatant.currentHp}" data-id="${combatant.id}" style="width: 50px;">
                                <button class="hp-btn hp-plus" data-id="${combatant.id}" title="+5 PF">+</button>
                            </div>
                            
                            <!-- Stats compatte -->
                            <div class="stat-column">
                                <div class="stat-row-inline">
                                    <span class="stat-label">Classe Armatura:</span>
                                    <input type="number" class="ac-mini-input" value="${combatant.armor_class?.[0]?.value || combatant.armor_class || 10}" data-id="${combatant.id}" style="width: 45px; padding: 2px 4px; font-size: 0.85rem;">
                                </div>
                                <div class="stat-row-inline">
                                    <span class="stat-label">Iniziativa:</span>
                                    <input type="number" class="init-mini-input" value="${combatant.initiative || 0}" data-id="${combatant.id}" style="width: 45px; padding: 2px 4px;">
                                </div>
                            </div>
                            
                            <!-- Damage/Heal Input -->
                            <div class="damage-row-compact">
                                <input type="text" class="damage-input-compact" placeholder="Danno/Cura" data-id="${combatant.id}">
                                <button class="damage-btn-compact apply-damage-btn" data-id="${combatant.id}" title="Danno" style="background: #c62828; color: white;">⚔️</button>
                                <button class="damage-btn-compact apply-heal-btn" data-id="${combatant.id}" title="Cura" style="background: #2e7d32; color: white;">💚</button>
                            </div>
                            
                            ${deathSavesHtml}
                        </div>
                        
                        <!-- Condizioni Section -->
                        <div class="column-cell conditions-section">
                            <h6 class="column-cell-title">⚠️ Condizioni</h6>
                            <div class="conditions-compact">
                                ${conditionsHtml}
                            </div>
                            <button class="open-conditions-popup-btn-mini" data-id="${combatant.id}" style="margin-top: 6px; width: 100%; padding: 4px 8px; font-size: 0.7rem;">➕ Aggiungi</button>
                        </div>
                        
                        <!-- Note Section -->
                        <div class="column-cell notes-section" style="flex: 1;">
                            <h6 class="column-cell-title">📝 Note</h6>
                            <textarea class="notes-compact" placeholder="Note..." data-id="${combatant.id}">${combatant.notes || ''}</textarea>
                        </div>
                    </div>
                    
                    <!-- COLONNA DESTRA (2/3) - Tab Attacchi/Incantesimi -->
                    <div class="combatant-right-column">
                        <!-- Tab Header -->
                        <div class="tab-header">
                            <button class="tab-btn ${activeTab === 'attacks' ? 'active' : ''}" data-tab="attacks" data-combatant="${combatant.id}">
                                ⚔️ Attacchi
                            </button>
                            <button class="tab-btn ${activeTab === 'spells' ? 'active' : ''}" data-tab="spells" data-combatant="${combatant.id}">
                                🔮 Incantesimi ${spellCount > 0 ? `<span class="tab-badge">${spellCount}</span>` : ''}
                            </button>
                        </div>
                        
                        <!-- Tab Content: Attacchi -->
                        <div class="tab-content ${activeTab === 'attacks' ? 'active' : ''}" data-tab-content="attacks">
                            <div class="actions-tab-content">
                                ${multiattackMode ? this.renderMultiattackIndicator(combatant, multiattackMode) : ''}
                                
                                <!-- Target Selector (Multi-mode: Singolo/AoE) -->
                                <div class="target-selector-multi" data-attacker-id="${combatant.id}">
                                    <div class="target-mode-tabs">
                                        <button class="target-mode-btn active" data-mode="single" data-attacker-id="${combatant.id}">🎯 Singolo</button>
                                        <button class="target-mode-btn" data-mode="aoe" data-attacker-id="${combatant.id}">💥 AoE</button>
                                    </div>
                                    <div class="target-single-mode">
                                        <select class="target-select" data-attacker-id="${combatant.id}">
                                            <option value="free">🆓 Libero</option>
                                            ${targetOptions}
                                        </select>
                                    </div>
                                    <div class="target-aoe-mode hidden">
                                        <div class="aoe-controls">
                                            <button class="aoe-select-all-btn" data-attacker-id="${combatant.id}" title="Seleziona tutti">☑️ Tutti</button>
                                            <button class="aoe-select-none-btn" data-attacker-id="${combatant.id}" title="Deseleziona tutti">🔲 Nessuno</button>
                                            <button class="aoe-select-enemies-btn" data-attacker-id="${combatant.id}" title="Solo nemici">⚔️ Nemici</button>
                                            <button class="aoe-select-allies-btn" data-attacker-id="${combatant.id}" title="Solo alleati">🛡️ Alleati</button>
                                        </div>
                                        <div class="aoe-targets-list">
                                            ${this.combatants
                                                .filter(c => c.id !== combatant.id)
                                                .map(c => {
                                                    const ac = c.armor_class?.[0]?.value || c.armor_class || 10;
                                                    const isEnemy = c.sourceType === 'monster' || c.sourceType === 'npc_enemy';
                                                    const tag = isEnemy ? '🔴' : '🟢';
                                                    return `
                                                        <label class="aoe-target-item ${isEnemy ? 'enemy' : 'ally'}">
                                                            <input type="checkbox" class="aoe-target-checkbox" data-target-id="${c.id}" data-attacker-id="${combatant.id}">
                                                            <span class="aoe-target-name">${tag} ${c.customName || c.name}</span>
                                                            <span class="aoe-target-ac">CA ${ac}</span>
                                                        </label>
                                                    `;
                                                }).join('')}
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Actions Counter -->
                                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">
                                    ${this.renderActionsCounter(combatant)}
                                </div>
                                
                                <!-- Actions List -->
                                ${this.renderActionsList(combatant)}
                                ${this.renderLegendaryActions(combatant)}
                                
                                <!-- Results Box -->
                                <div class="results-box-tab"></div>
                            </div>
                        </div>
                        
                        <!-- Tab Content: Incantesimi -->
                        <div class="tab-content ${activeTab === 'spells' ? 'active' : ''}" data-tab-content="spells">
                            <div class="spells-tab-content">
                                ${concentrationHtml}
                                ${activeSpellsHtml}
                                <div class="spells-mini-list">
                                    ${this.renderSpellsMini(combatant)}
                                </div>
                                <button class="open-spells-popup-btn-mini" data-id="${combatant.id}" style="margin-top: 8px;">➕ Gestisci Incantesimi</button>
                                
                                <!-- Results Box per incantesimi -->
                                <div class="results-box-tab" id="spells-results-${combatant.id}"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * Renderizza le condizioni in formato compatto per la colonna sinistra.
     */
    renderActiveConditionsCompact(combatant) {
        if (!combatant.conditions || combatant.conditions.length === 0) {
            return '<span style="color: var(--text-muted); font-size: 0.75rem; font-style: italic;">Nessuna</span>';
        }
        
        return combatant.conditions.map(cond => {
            const condName = typeof cond === 'string' ? cond : cond.name;
            const duration = typeof cond === 'object' ? cond.duration : 0;
            const isExpiring = duration > 0 && duration <= 1;
            
            return `
                <span class="condition-tag-compact ${isExpiring ? 'expiring' : ''}" data-condition="${condName}" data-combatant="${combatant.id}">
                    ${condName}${duration > 0 ? ` (${duration})` : ''}
                    <span class="remove-btn" data-condition="${condName}">×</span>
                </span>
            `;
        }).join('');
    },
    
    /**
     * Conta gli incantesimi disponibili per il badge.
     */
    countAvailableSpells(combatant) {
        if (!combatant.spellState) return 0;
        
        const { preparedSpells = [], cantrips = [], atWillSpells = [], perDaySpells = [] } = combatant.spellState;
        let count = 0;
        
        // Conta slot disponibili
        if (combatant.spellState.remainingSlots) {
            Object.values(combatant.spellState.remainingSlots).forEach(c => {
                if (c > 0) count++;
            });
        }
        
        // Aggiungi trucchetti e incantesimi a volontà
        count += cantrips.length + atWillSpells.length;
        
        // Conta per-day disponibili
        perDaySpells.forEach(s => {
            if (s.usesRemaining > 0) count++;
        });
        
        return count;
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
        
        // Azione standard - con classe separata per lo stile
        const actionClass = actionAvailable ? 'action-available' : 'action-consumed';
        parts.push(`<span class="${actionClass}">${actionAvailable ? '✅' : '❌'} Azione</span>`);
        
        // Reazione - con classe separata per lo stile
        const reactionClass = !tracker.reactionUsed ? 'reaction-available' : 'reaction-consumed';
        parts.push(`<span class="${reactionClass}">${!tracker.reactionUsed ? '🔄' : '⏳'} Reazione</span>`);
        
        // Azioni leggendarie (solo se ne ha)
        if (tracker.legendaryActionsMax > 0) {
            const legRemaining = tracker.legendaryActionsMax - tracker.legendaryActionsUsed;
            parts.push(`<span class="legendary-counter">👑 ${legRemaining}/${tracker.legendaryActionsMax}</span>`);
        }
        
        return `<span class="actions-counter">${parts.join(' <span class="separator">|</span> ')}</span>`;
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
        
        // NOTA: rimosso il corto-circuito isPcCaster che mostrava SOLO gli slot.
        // Ora i PG vedono anche i bottoni dei loro incantesimi (cantrips + prepared)
        // come PNG e mostri, permettendo di lanciarli con gli effetti speciali.
        
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
        
        // Gestione Tab Switch
        if (e.target.classList.contains('tab-btn')) {
            const tabName = e.target.dataset.tab;
            const combatantIdForTab = e.target.dataset.combatant;
            
            // Salva preferenza tab per questo combattente
            this.tabPreferences[combatantIdForTab] = tabName;
            
            // Aggiorna UI
            const tabHeader = e.target.closest('.tab-header');
            const rightColumn = e.target.closest('.combatant-right-column');
            
            // Rimuovi active da tutti i tab
            tabHeader.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // Mostra il contenuto corretto
            rightColumn.querySelectorAll('.tab-content').forEach(content => {
                content.classList.toggle('active', content.dataset.tabContent === tabName);
            });
            
            return;
        }
        
        // Gestione target mode switch (Single / AoE)
        if (e.target.classList.contains('target-mode-btn')) {
            const mode = e.target.dataset.mode;
            const attackerId = e.target.dataset.attackerId;
            const selector = e.target.closest('.target-selector-multi');
            if (!selector) return;
            
            // Aggiorna pulsanti attivi
            selector.querySelectorAll('.target-mode-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // Mostra/nascondi i pannelli
            selector.querySelector('.target-single-mode')?.classList.toggle('hidden', mode !== 'single');
            selector.querySelector('.target-aoe-mode')?.classList.toggle('hidden', mode !== 'aoe');
            return;
        }
        
        // Gestione pulsanti AoE (Tutti/Nessuno/Nemici/Alleati)
        if (e.target.classList.contains('aoe-select-all-btn')) {
            const selector = e.target.closest('.target-selector-multi');
            selector?.querySelectorAll('.aoe-target-checkbox').forEach(cb => cb.checked = true);
            return;
        }
        if (e.target.classList.contains('aoe-select-none-btn')) {
            const selector = e.target.closest('.target-selector-multi');
            selector?.querySelectorAll('.aoe-target-checkbox').forEach(cb => cb.checked = false);
            return;
        }
        if (e.target.classList.contains('aoe-select-enemies-btn')) {
            const selector = e.target.closest('.target-selector-multi');
            selector?.querySelectorAll('.aoe-target-item').forEach(item => {
                const cb = item.querySelector('.aoe-target-checkbox');
                if (cb) cb.checked = item.classList.contains('enemy');
            });
            return;
        }
        if (e.target.classList.contains('aoe-select-allies-btn')) {
            const selector = e.target.closest('.target-selector-multi');
            selector?.querySelectorAll('.aoe-target-item').forEach(item => {
                const cb = item.querySelector('.aoe-target-checkbox');
                if (cb) cb.checked = item.classList.contains('ally');
            });
            return;
        }

        if (e.target.classList.contains('remove-combatant-btn')) {
            // Conferma rimozione
            if (confirm(`Rimuovere ${combatant?.customName || combatant?.name} dal combattimento?`)) {
                removeMonsterFromCombat(combatantId);
                selectedCombatantId = null;
            }
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
                // Log evento condition_removed
                this.logEvent('condition_removed', {
                    targetId: combatantId,
                    conditionName: condName
                });
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
            const damageType = e.target.dataset.damageType || 'physical';
            this.applyDamageToTarget(targetId, damage, damageType);
        } else if (e.target.classList.contains('trigger-saving-throw-btn')) {
            // Apri popup per il tiro salvezza
            const effectData = JSON.parse(e.target.dataset.effectData.replace(/&quot;/g, '"'));
            this.openSavingThrowPopup(effectData);
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
        // Verifica se il combattente ha un'azione disponibile
        const combatants = getCombatState();
        const combatant = combatants.find(c => c.id === combatantId);
        
        if (!combatant) {
            showToast('Combattente non trovato', 'error');
            return;
        }
        
        // Controlla se l'azione è già stata usata
        const tracker = combatant.actionTracker || {};
        
        if (tracker.actionUsed) {
            showToast('Azione già usata questo turno!', 'warning');
            return;
        }
        
        const result = useSpell(combatantId, spellData);
        
        if (result.success) {
            // Consuma l'azione
            useAction(combatantId, 'action', spellData.name);
            
            // Log evento spell_cast
            this.logEvent('spell_cast', {
                casterId: combatantId,
                spellName: spellData.name,
                spellType: spellType,
                level: spellData.level
            });
            
            showToast(`✨ ${result.message}`, 'success');
            
            // Cerca i metadati completi dell'incantesimo nel database
            const fullSpell = spellDatabase[spellData.name] || spellData;
            
            // Estrai effetto speciale usando la funzione unificata
            const specialEffect = this.extractEffectFromAction(fullSpell, combatant);
            
            // Trova la card e usa il selettore multi-mode
            const card = this.container.querySelector(`.combatant-card[data-id="${combatantId}"]`);
            
            // Gestione self-cast: se l'incantesimo è self, il bersaglio è il caster stesso
            let targets = [];
            if (fullSpell.target?.type === 'self') {
                targets = [combatant];
            } else {
                targets = this.getSelectedTargets(card);
            }
            
            // Log nel results box
            if (combatant) {
                const resultsBox = this.container.querySelector('.results-box-mini');
                if (resultsBox) {
                    // Genera label per bersagli multipli
                    let targetLabel = '';
                    if (targets.length === 1) {
                        targetLabel = ` → <strong>${targets[0].customName || targets[0].name}</strong>`;
                    } else if (targets.length > 1) {
                        targetLabel = ` → <strong>${targets.length} bersagli</strong>`;
                    }
                    
                    // Genera pulsanti tiro salvezza per ogni bersaglio (se AoE)
                    let specialEffectBtns = '';
                    if (specialEffect && targets.length > 0) {
                        if (targets.length === 1) {
                            specialEffectBtns = this.renderSpecialEffectButton(specialEffect, targets[0], combatant, spellData.name);
                        } else {
                            specialEffectBtns = '<div style="margin-top: 6px;"><small style="color: var(--text-muted);">Tiri salvezza per bersaglio:</small><br>';
                            targets.forEach(t => {
                                specialEffectBtns += this.renderSpecialEffectButton(specialEffect, t, combatant, spellData.name);
                            });
                            specialEffectBtns += '</div>';
                        }
                    }
                    
                    // Mostra info area/concentrazione se presenti
                    let extraInfo = '';
                    if (fullSpell.area) {
                        const dim = fullSpell.area.radius || fullSpell.area.length;
                        extraInfo += `<br><small style="color: var(--text-muted);">📍 Area: ${fullSpell.area.shape} ${dim}m</small>`;
                    }
                    if (fullSpell.concentration) {
                        extraInfo += `<br><small style="color: var(--text-muted);">🔮 Richiede concentrazione</small>`;
                    }
                    if (fullSpell.target?.type === 'self') {
                        extraInfo += `<br><small style="color: var(--text-muted);">🎯 Bersaglio: sé stesso</small>`;
                    }
                    
                    const spellHtml = `
                        <div class="spell-cast-result" style="
                            padding: 6px 10px;
                            margin: 4px 0;
                            background: rgba(156, 39, 176, 0.15);
                            border-left: 3px solid #9c27b0;
                            border-radius: 4px;
                        ">
                            🔮 <strong>${spellData.name}</strong> lanciato!${targetLabel}
                            <small style="color: var(--text-muted);">${result.message.includes('rimanenti') ? result.message.split('(')[1]?.replace(')', '') : ''}</small>
                            ${extraInfo}
                            ${specialEffectBtns}
                        </div>
                    `;
                    resultsBox.innerHTML = spellHtml + resultsBox.innerHTML;
                }
            }
        } else {
            showToast(`❌ ${result.message}`, 'error');
        }
    },
    
    applyDamageToTarget(targetId, damage, damageType = 'physical') {
        const combatants = getCombatState();
        const target = combatants.find(c => c.id === targetId);
        if (!target) {
            showToast('Bersaglio non trovato', 'error');
            return;
        }
        
        // Calcola danno modificato per resistenze/immunità
        const { modifiedDamage, modifier } = this.calculateDamageWithResistances(target, damage, damageType);
        
        const oldHp = target.currentHp || 0;
        const newHp = Math.max(0, oldHp - modifiedDamage);
        updateMonsterProperty(targetId, 'currentHp', newHp);
        
        // Log event
        this.logEvent('damage', {
            targetId: targetId,
            damage: modifiedDamage,
            originalDamage: damage,
            damageType: damageType,
            modifier: modifier
        });
        
        // Messaggio con indicatore resistenza se applicabile
        let message = `${modifiedDamage} danni applicati a ${target.customName || target.name}!`;
        if (modifier === 'immune') {
            message = `${target.customName || target.name} è immune a questo tipo di danno!`;
        } else if (modifier === 'resistant') {
            message = `${modifiedDamage} danni (${damage / 2} resistenza) a ${target.customName || target.name}!`;
        } else if (modifier === 'vulnerable') {
            message = `${modifiedDamage} danni (${damage} ×2 vulnerabilità) a ${target.customName || target.name}!`;
        }
        showToast(message, modifier === 'immune' ? 'warning' : 'success');
        
        // Check concentration if target has active concentration
        if (target.concentration?.spellName && modifiedDamage > 0) {
            const result = this.handleConcentrationCheck(targetId, modifiedDamage);
            this.showConcentrationResult(target, result);
        }
        
        // Death tooltip - mostra quando un combattente muore (HP raggiunge 0)
        if (oldHp > 0 && newHp === 0) {
            this.showDeathTooltip(target);
            this.logEvent('death', { combatantId: targetId });
        }
    },
    
    /**
     * Calcola il danno modificato per resistenze, immunità e vulnerabilità.
     * @returns {Object} { modifiedDamage, modifier }
     */
    calculateDamageWithResistances(target, damage, damageType = 'physical') {
        // Normalizza il tipo di danno
        const normalizedType = damageType?.toLowerCase() || 'physical';
        
        // Estrae array di resistenze/immunità/vulnerabilità
        const resistances = target.damage_resistances || target.resistances || [];
        const immunities = target.damage_immunities || target.immunities || [];
        const vulnerabilities = target.damage_vulnerabilities || target.vulnerabilities || [];
        
        // Controlla immunità
        const isImmune = immunities.some(imm => {
            if (typeof imm === 'string') {
                return imm.toLowerCase().includes(normalizedType);
            }
            return false;
        });
        
        if (isImmune) {
            return { modifiedDamage: 0, modifier: 'immune' };
        }
        
        // Controlla vulnerabilità
        const isVulnerable = vulnerabilities.some(vul => {
            if (typeof vul === 'string') {
                return vul.toLowerCase().includes(normalizedType);
            }
            return false;
        });
        
        if (isVulnerable) {
            return { modifiedDamage: damage * 2, modifier: 'vulnerable' };
        }
        
        // Controlla resistenza
        const isResistant = resistances.some(res => {
            if (typeof res === 'string') {
                return res.toLowerCase().includes(normalizedType);
            }
            return false;
        });
        
        if (isResistant) {
            return { modifiedDamage: Math.floor(damage / 2), modifier: 'resistant' };
        }
        
        // Danno normale
        return { modifiedDamage: damage, modifier: 'normal' };
    },
    
    /**
     * Mostra un tooltip di morte quando un combattente raggiunge 0 HP.
     */
    showDeathTooltip(combatant) {
        const name = combatant.customName || combatant.name;
        const isPc = combatant.sourceType === 'pc';
        
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
        const input = this.container.querySelector(`.damage-input-compact[data-id="${combatantId}"]`);
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
            // Log evento cura
            this.logEvent('heal', {
                targetId: combatantId,
                amount: amount,
                newHp: newHp
            });
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
     * Estrae i bersagli selezionati dal selettore multi-mode di un combatant.
     * Ritorna un array di oggetti combatant (vuoto se nessuno selezionato).
     * 
     * @param {HTMLElement} card - La card del combatant attaccante
     * @returns {Array} Array di combatant bersagli
     */
    getSelectedTargets(card) {
        if (!card) return [];
        
        const selector = card.querySelector('.target-selector-multi');
        if (!selector) {
            // Fallback: vecchio selettore singolo
            const targetSelect = card.querySelector('.target-select');
            const targetId = targetSelect?.value;
            if (!targetId || targetId === 'free') return [];
            const combatants = getCombatState();
            const target = combatants.find(c => c.id === parseFloat(targetId));
            return target ? [target] : [];
        }
        
        // Verifica quale mode è attivo
        const activeModeBtn = selector.querySelector('.target-mode-btn.active');
        const mode = activeModeBtn?.dataset.mode || 'single';
        
        const combatants = getCombatState();
        
        if (mode === 'single') {
            const targetSelect = selector.querySelector('.target-select');
            const targetId = targetSelect?.value;
            if (!targetId || targetId === 'free') return [];
            const target = combatants.find(c => c.id === parseFloat(targetId));
            return target ? [target] : [];
        }
        
        if (mode === 'aoe') {
            // Raccogli tutti i checkbox selezionati
            const checkboxes = selector.querySelectorAll('.aoe-target-checkbox:checked');
            const targets = [];
            checkboxes.forEach(cb => {
                const targetId = parseFloat(cb.dataset.targetId);
                const target = combatants.find(c => c.id === targetId);
                if (target) targets.push(target);
            });
            return targets;
        }
        
        return [];
    },
    
    /**
     * Gestisce il click su un attacco (singolo o parte di multiattacco).
     */
    handleAttackClick(btn, attacker) {
        const tracker = attacker.actionTracker || {};
        const multiattackMode = tracker.multiattackMode;
        
        // Trova la card partendo dal bottone (più affidabile del selettore globale)
        const card = btn.closest('.combatant-card');
        
        // Usa la nuova funzione helper che supporta single + AoE
        const targets = this.getSelectedTargets(card);
        
        if (targets.length === 0) {
            showToast('⚠️ Seleziona almeno un bersaglio prima di attaccare!', 'warning');
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
        
        // Esegui il tiro attacco per ogni bersaglio (supporta AoE)
        targets.forEach(target => {
            this.handleAttackWithAC(btn, attacker, target.id, multiattackMode);
        });
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
            hitStatus = `❌ FALLIMENTO CRITICO! ${toHit} ${rollBreakdown}`;
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
        let primaryDamageType = 'physical'; // Per resistenze
        if (attackData.damage && (isHit || !target)) {
            attackData.damage.forEach((d, idx) => {
                let dice = d.damage_dice || '1d6';
                if (isCritical) {
                    dice = this.doubleDice(dice);
                }
                const dmgResult = rollDice(dice);
                const dmgValue = dmgResult.total || dmgResult;
                damageTotal += dmgValue;
                damage += `${dmgValue} ${d.damage_type?.name || 'danni'}`;
                if (attackData.damage.indexOf(d) < attackData.damage.length - 1) damage += ' + ';
                // Prendi il primo tipo di danno per le resistenze
                if (idx === 0) {
                    primaryDamageType = d.damage_type?.name?.toLowerCase() || 'physical';
                }
            });
        }
        
        // Prepara le label per la visualizzazione
        const damageLabel = damageTotal > 0 ? ` | 💥 ${damage}` : '';
        const targetLabel = target ? ` → ${target.customName || target.name}` : 
            (targetId === 'free' ? ' → Bersaglio Libero' : '');
        
        // Mostra risultato - cerca il results-box nel tab attivo o globalmente
        const card = this.container.querySelector(`.combatant-card[data-id="${attacker.id}"]`);
        let cardResultsBox = card?.querySelector('.tab-content.active .results-box-tab') || 
                            card?.querySelector('.results-box-tab') ||
                            card?.querySelector('.results-box-mini') || 
                            this.container.querySelector('.results-box-mini') ||
                            this.container.querySelector('.results-box');
        
        if (cardResultsBox) {
            const multiattackLabel = multiattackMode ? 
                `<small style="color: #ffd700;">⚔️ Multiattacco (${multiattackMode.attacksUsed}/${multiattackMode.totalAttacks})</small><br>` : '';
            const targetLabelHtml = target ? ` → <strong>${target.customName || target.name}</strong>` : 
                (targetId === 'free' ? ' → Bersaglio Libero' : '');
            
            // Analizza se l'attacco ha un effetto speciale
            const specialEffect = this.parseSpecialEffect(attackData);
            let specialEffectBtn = '';
            if (specialEffect && target && isHit && !isFumble) {
                const effectData = JSON.stringify({
                    targetId: target.id,
                    attackerId: attacker.id,
                    attackName: attackData.name,
                    effect: specialEffect
                }).replace(/"/g, '&quot;');
                specialEffectBtn = `
                    <button class="trigger-saving-throw-btn" 
                            data-effect-data="${effectData}"
                            style="
                                margin-top: 6px;
                                margin-left: 4px;
                                padding: 4px 10px;
                                background: #9c27b0;
                                border: none;
                                border-radius: 4px;
                                color: white;
                                cursor: pointer;
                                font-size: 0.8rem;
                            ">
                        🛡️ Tiro Salvezza (CD ${specialEffect.dc})
                    </button>
                `;
            }
            
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
                                data-damage-type="${primaryDamageType}"
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
                    ${specialEffectBtn}
                </div>
            `;
            
            cardResultsBox.innerHTML = resultHtml + cardResultsBox.innerHTML;
        }
        
        // Log event
        if (isCritical) {
            this.logEvent('critical_hit', {
                attackerId: attacker.id,
                targetId: target?.id,
                attackName: attackData.name,
                damage: damageTotal
            });
        } else if (isHit) {
            this.logEvent('attack_hit', {
                attackerId: attacker.id,
                targetId: target?.id,
                attackName: attackData.name,
                damage: damageTotal,
                toHit: toHit
            });
        } else {
            this.logEvent('attack_miss', {
                attackerId: attacker.id,
                targetId: target?.id,
                attackName: attackData.name,
                toHit: toHit
            });
        }
        
        // Registra che questo combattente ha agito
        this.actedThisTurn.add(attacker.id);
        
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
        
        // Trova la card e usa il selettore multi-mode
        const card = this.container.querySelector(`.combatant-card[data-id="${attacker.id}"]`);
        const targets = this.getSelectedTargets(card);
        
        // Consuma l'azione
        const tracker = attacker.actionTracker || {};
        if (tracker.actionUsed) {
            showToast('Azione già usata questo turno!', 'warning');
            return;
        }
        tracker.actionUsed = true;
        updateMonsterProperty(attacker.id, 'actionTracker', tracker);
        
        // Estrai effetto speciale con la funzione unificata
        const specialEffect = this.extractEffectFromAction(actionData, attacker);
        
        // Mostra risultato
        const resultsBox = this.container.querySelector('.results-box-mini') || this.container.querySelector('.results-box');
        if (resultsBox) {
            const cardResultsBox = card?.querySelector('.results-box-mini') || resultsBox;
            
            // Genera label per bersagli multipli
            let targetLabel = '';
            if (targets.length === 1) {
                targetLabel = ` → <strong>${targets[0].customName || targets[0].name}</strong>`;
            } else if (targets.length > 1) {
                targetLabel = ` → <strong>${targets.length} bersagli</strong>`;
            }
            
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
            
            // Genera pulsanti tiro salvezza per ogni bersaglio (se AoE)
            let specialEffectBtns = '';
            if (specialEffect && targets.length > 0) {
                if (targets.length === 1) {
                    specialEffectBtns = this.renderSpecialEffectButton(specialEffect, targets[0], attacker, actionData.name);
                } else {
                    // AoE: genera un pulsante per ogni bersaglio
                    specialEffectBtns = '<div style="margin-top: 6px;"><small style="color: var(--text-muted);">Tiri salvezza per bersaglio:</small><br>';
                    targets.forEach(t => {
                        specialEffectBtns += this.renderSpecialEffectButton(specialEffect, t, attacker, actionData.name);
                    });
                    specialEffectBtns += '</div>';
                }
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
                    ${specialEffectBtns}
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
        
        // Estrai effetto speciale con la funzione unificata
        const specialEffect = this.extractEffectFromAction(actionData, attacker);
        
        // Trova la card e usa il selettore multi-mode
        const card = this.container.querySelector(`.combatant-card[data-id="${attacker.id}"]`);
        const targets = this.getSelectedTargets(card);
        
        // Mostra risultato
        const resultsBox = this.container.querySelector('.results-box-mini') || this.container.querySelector('.results-box');
        if (resultsBox) {
            const cardResultsBox = card?.querySelector('.results-box-mini') || resultsBox;
            
            const newRemaining = tracker.legendaryActionsMax - tracker.legendaryActionsUsed;
            
            // Genera label per bersagli multipli
            let targetLabel = '';
            if (targets.length === 1) {
                targetLabel = ` → <strong>${targets[0].customName || targets[0].name}</strong>`;
            } else if (targets.length > 1) {
                targetLabel = ` → <strong>${targets.length} bersagli</strong>`;
            }
            
            // Genera pulsanti tiro salvezza per ogni bersaglio (se AoE)
            let specialEffectBtns = '';
            if (specialEffect && targets.length > 0) {
                if (targets.length === 1) {
                    specialEffectBtns = this.renderSpecialEffectButton(specialEffect, targets[0], attacker, actionData.name);
                } else {
                    specialEffectBtns = '<div style="margin-top: 6px;"><small style="color: var(--text-muted);">Tiri salvezza per bersaglio:</small><br>';
                    targets.forEach(t => {
                        specialEffectBtns += this.renderSpecialEffectButton(specialEffect, t, attacker, actionData.name);
                    });
                    specialEffectBtns += '</div>';
                }
            }
            
            // Mostra CD/danno se presenti
            let effectInfo = '';
            if (actionData.dc) {
                const dcType = actionData.dc.dc_type?.name || 'CD';
                const dcValue = actionData.dc.dc_value || 15;
                effectInfo = `<br><span style="color: var(--accent-color);">${dcType} ${dcValue}</span>`;
            }
            
            cardResultsBox.innerHTML = `
                <div class="legendary-action-result" style="
                    padding: 8px 12px;
                    margin: 4px 0;
                    border-radius: 6px;
                    border-left: 3px solid #ffd700;
                    background: rgba(255, 215, 0, 0.1);
                ">
                    <strong>👑 ${actionData.name}</strong>${targetLabel}
                    <small style="color: #ffd700;">(${newRemaining}/${tracker.legendaryActionsMax} azioni leggendarie rimanenti)</small>
                    ${effectInfo}
                    ${specialEffectBtns}
                </div>
            ` + cardResultsBox.innerHTML;
        }
        
        showToast(`👑 ${attacker.customName} usa azione leggendaria: ${actionData.name}`, 'info');
    },
    
    /**
     * Renderizza il pulsante "🛡️ Tiro Salvezza" se l'effetto speciale è applicabile.
     * Funzione helper unificata usata da handleAttackWithAC, handleSpecialAction, handleLegendaryAction.
     * 
     * @param {Object|null} specialEffect - Effetto estratto da extractEffectFromAction
     * @param {Object|null} target - Bersaglio selezionato
     * @param {Object} attacker - Chi esegue l'azione
     * @param {string} actionName - Nome dell'azione
     * @returns {string} HTML del pulsante, o stringa vuota se non applicabile
     */
    renderSpecialEffectButton(specialEffect, target, attacker, actionName) {
        if (!specialEffect || !target) return '';
        
        const effectData = JSON.stringify({
            targetId: target.id,
            attackerId: attacker.id,
            attackName: actionName,
            effect: specialEffect
        }).replace(/"/g, '&quot;');
        
        const dcLabel = specialEffect.dc ? ` (CD ${specialEffect.dc})` : '';
        const damageLabel = specialEffect.damage ? ` 💥${specialEffect.damage.map(d => d.dice).join('+')}` : '';
        
        return `
            <button class="trigger-saving-throw-btn" 
                    data-effect-data="${effectData}"
                    style="
                        margin-top: 6px;
                        margin-left: 4px;
                        padding: 4px 10px;
                        background: #9c27b0;
                        border: none;
                        border-radius: 4px;
                        color: white;
                        cursor: pointer;
                        font-size: 0.8rem;
                    ">
                🛡️ Tiro Salvezza${dcLabel}${damageLabel}
            </button>
        `;
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
        
        // Log evento revive
        this.logEvent('revive', {
            targetId: combatantId
        });
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
        } else if (e.target.classList.contains('ac-mini-input')) {
            // Aggiorna la CA del combatant
            updateMonsterProperty(combatantId, 'armor_class', parseInt(e.target.value, 10));
        } else if (e.target.classList.contains('notes-compact')) {
            // Salva le note del combatant (su change, non su input, per evitare re-render eccessivi)
            updateMonsterProperty(combatantId, 'notes', e.target.value);
        }
    },

    handleDetailInput(e) {
        const id = e.target.dataset.id;
        if (!id) return;
        
        // Name input - debounce 300ms per evitare re-render eccessivi durante la digitazione
        if (e.target.classList.contains('combatant-name-input')) {
            const combatantId = parseFloat(id);
            const newName = e.target.value;
            const cursorPos = e.target.selectionStart;
            
            // Salva la posizione del cursore per il ripristino dopo re-render
            this._nameInputCursorPos = cursorPos;
            this._nameInputFocused = true;
            
            // Debounce: aggiorna lo stato solo dopo 300ms di inattività
            clearTimeout(this._nameDebounce);
            this._nameDebounce = setTimeout(() => {
                updateMonsterProperty(combatantId, 'customName', newName);
            }, 300);
        }
    },

    handleDetailHover(e) {
        if (e.target.classList.contains('special-action-link')) {
            const { name, desc } = e.target.dataset;
            const tip = document.createElement('div');
            tip.className = 'ability-tooltip';
            tip.innerHTML = `<h4>${escapeHtml(name)}</h4><p>${escapeHtml(desc)}</p>`;
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

    /**
     * Controlla se il combatant il cui turno è iniziato ha pendingSaves da triggerare.
     * Usato per effetti progressivi come il Morso della Cockatrice (2° tiro salvezza).
     */
    checkPendingSaves(combatantId) {
        const combatants = getCombatState();
        const combatant = combatants.find(c => c.id === combatantId);
        if (!combatant) return;
        
        const pendingSaves = combatant.pendingSaves;
        if (!Array.isArray(pendingSaves) || pendingSaves.length === 0) return;
        
        // Trova il primo pending save da triggerare (turno <= round corrente)
        const toTrigger = pendingSaves.find(ps => (ps.turn || 0) <= this.currentRound);
        if (!toTrigger) return;
        
        // Rimuovi il pending save dalla lista (lo stiamo per gestire)
        const remainingSaves = pendingSaves.filter(ps => ps !== toTrigger);
        updateMonsterProperty(combatantId, 'pendingSaves', remainingSaves);
        
        // Notifica il DM e apri il popup del tiro salvezza
        const targetName = combatant.customName || combatant.name || 'Bersaglio';
        showToast(`⚠️ ${targetName} deve ripetere il tiro salvezza!`, 'warning');
        
        // Apri il popup (usa lo stesso meccanismo del trigger manuale)
        this.openSavingThrowPopup({
            targetId: combatantId,
            attackerId: toTrigger.source || combatantId,
            attackName: toTrigger.attackName || 'Effetto progressivo',
            effect: toTrigger.effect
        });
    },

    // --- STATE CHANGE HANDLER ---

    onStateChange(combatants, currentRound, currentTurnMonsterId, initiativeOrder) {
        // NOTA: loadAllSources() NON viene chiamato qui per evitare letture
        // sincrone da localStorage ad ogni state change (HP, nome, condizioni, ecc.).
        // Le fonti vengono caricate all'apertura del modulo e ad ogni apertura del popup.
        
        // Log round_start quando il round cambia (escluso round 0 = non iniziato)
        if (currentRound > previousRound && currentRound > 0) {
            this.logEvent('round_start', { round: currentRound });
        }
        
        // Log turn_start quando il turno cambia (escluso null = combattimento non attivo)
        if (currentTurnMonsterId && currentTurnMonsterId !== this._lastLoggedTurnId) {
            this._lastLoggedTurnId = currentTurnMonsterId;
            if (currentRound > 0) {
                this.logEvent('turn_start', {
                    combatantId: currentTurnMonsterId,
                    round: currentRound
                });
            }
        }
        
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

        // Check pendingSaves: se il combatant attivo ha tiri salvezza pendenti (es. Cockatrice 2° tiro),
        // apri automaticamente il popup del tiro salvezza
        if (currentRound > 0 && currentTurnMonsterId && currentTurnMonsterId !== this._lastCheckedTurnId) {
            this._lastCheckedTurnId = currentTurnMonsterId;
            this.checkPendingSaves(currentTurnMonsterId);
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
        } else {
            // Empty state: nessun combattente presente
            const detailView = this.container?.querySelector('#combatant-detail-view');
            if (detailView) {
                detailView.innerHTML = '<p class="empty-state">Seleziona un combattente o aggiungi creature al combattimento.</p>';
            }
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
            
            // Indicatore "non ha agito" - solo se combattimento in corso
            const hasActed = this.actedThisTurn.has(c.id) || (c.actionTracker?.actionUsed);
            const hasStunned = c.conditions?.some(cond => {
                const condName = typeof cond === 'string' ? cond : cond.name;
                return condName.toLowerCase() === 'stunned' || condName.toLowerCase() === 'stordito';
            });
            const showNotActed = currentRound > 0 && !isActive && !hasActed && !isDead && !hasStunned;
            const showHasActed = currentRound > 0 && hasActed && !isActive && !isDead;
            
            // Render condition tags
            const conditionTags = this.renderConditionTags(c);
            
            return `
                <div class="combatant-order-item ${isActive ? 'active-turn' : ''} ${isSelected ? 'selected' : ''} ${isTargeted ? 'targeted' : ''} ${isDead ? 'dead' : ''} ${showNotActed ? 'not-acted' : ''} ${showHasActed ? 'has-acted' : ''} ${hasStunned ? 'stunned' : ''}" data-id="${c.id}">
                    <div class="order-item-header">
                        <span class="order-item-name">
                            ${c.customName || c.name}
                            ${getSourceBadge(c)}
                            ${isDead ? '💀' : ''}
                            ${showNotActed ? '⚠️' : ''}
                        </span>
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
    },
    
    // --- COMBAT LOG SYSTEM ---
    
    /**
     * Registra un evento nel log del combattimento.
     */
    logEvent(eventType, data = {}) {
        const timestamp = new Date().toISOString();
        const round = this.currentRound || 0;
        const turn = this.currentTurnId;
        
        const entry = {
            id: Date.now(),
            timestamp,
            round,
            turn,
            eventType,
            ...data
        };
        
        this.combatLog.push(entry);
        
        // Aggiorna statistiche
        this.updateStats(eventType, data);
        
        return entry;
    },
    
    /**
     * Aggiorna le statistiche del combattimento.
     */
    updateStats(eventType, data) {
        const combatantId = data.attackerId || data.casterId || data.combatantId;
        const targetId = data.targetId;
        const damage = data.damage || 0;
        const damageType = data.damageType || 'physical';
        
        switch (eventType) {
            case 'attack_hit':
                this.combatStats.attacksHit[combatantId] = (this.combatStats.attacksHit[combatantId] || 0) + 1;
                if (damage > 0) {
                    if (!this.combatStats.damageDealt[combatantId]) {
                        this.combatStats.damageDealt[combatantId] = { total: 0, byType: {} };
                    }
                    this.combatStats.damageDealt[combatantId].total += damage;
                    this.combatStats.damageDealt[combatantId].byType[damageType] = 
                        (this.combatStats.damageDealt[combatantId].byType[damageType] || 0) + damage;
                    this.combatStats.damageTaken[targetId] = (this.combatStats.damageTaken[targetId] || 0) + damage;
                }
                break;
            case 'attack_miss':
                this.combatStats.attacksMiss[combatantId] = (this.combatStats.attacksMiss[combatantId] || 0) + 1;
                break;
            case 'critical_hit':
                this.combatStats.criticalHits[combatantId] = (this.combatStats.criticalHits[combatantId] || 0) + 1;
                break;
            case 'spell_cast':
                this.combatStats.spellsCasted[combatantId] = (this.combatStats.spellsCasted[combatantId] || 0) + 1;
                break;
            case 'condition_applied':
                if (!this.combatStats.conditionsApplied[combatantId]) {
                    this.combatStats.conditionsApplied[combatantId] = {};
                }
                this.combatStats.conditionsApplied[combatantId][data.conditionName] = 
                    (this.combatStats.conditionsApplied[combatantId][data.conditionName] || 0) + 1;
                break;
        }
    },
    
    /**
     * Apre il popup del combat log.
     */
    openCombatLog() {
        const overlay = this.container.querySelector('#combat-log-overlay');
        const entries = this.container.querySelector('#combat-log-entries');
        if (!overlay || !entries) return;
        
        entries.innerHTML = this.renderLogEntries();
        overlay.classList.remove('hidden');
    },
    
    /**
     * Chiude il popup del combat log.
     */
    closeCombatLog() {
        const overlay = this.container.querySelector('#combat-log-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    },
    
    /**
     * Renderizza le entries del log.
     */
    renderLogEntries() {
        if (this.combatLog.length === 0) {
            return '<div class="log-empty"><p> Nessun evento registrato.</p><p class="hint">Gli eventi verranno registrati durante il combattimento.</p></div>';
        }
        
        const combatants = getCombatState();
        const getCombatantName = (id) => {
            const c = combatants.find(c => c.id === id);
            return c?.customName || c?.name || 'Sconosciuto';
        };
        
        return this.combatLog.map(entry => {
            const time = new Date(entry.timestamp).toLocaleTimeString('it-IT');
            let icon = '📝';
            let content = '';
            let cssClass = '';
            
            switch (entry.eventType) {
                case 'combat_start':
                    icon = '⚔️';
                    content = 'Combattimento iniziato!';
                    cssClass = 'log-combat-start';
                    break;
                case 'combat_end':
                    icon = '🏁';
                    content = 'Combattimento terminato!';
                    cssClass = 'log-combat-end';
                    break;
                case 'round_start':
                    icon = '🔄';
                    content = `Round ${entry.round}`;
                    cssClass = 'log-round';
                    break;
                case 'turn_start':
                    icon = '🎯';
                    content = `Turno di ${getCombatantName(entry.combatantId)}`;
                    cssClass = 'log-turn';
                    break;
                case 'attack_hit':
                    icon = '⚔️';
                    content = `${getCombatantName(entry.attackerId)} colpisce ${getCombatantName(entry.targetId)} con ${entry.attackName}`;
                    if (entry.damage > 0) content += ` (${entry.damage} danni)`;
                    cssClass = 'log-hit';
                    break;
                case 'attack_miss':
                    icon = '❌';
                    content = `${getCombatantName(entry.attackerId)} manca ${getCombatantName(entry.targetId)} con ${entry.attackName}`;
                    cssClass = 'log-miss';
                    break;
                case 'critical_hit':
                    icon = '💥';
                    content = `CRITICO! ${getCombatantName(entry.attackerId)} colpisce ${getCombatantName(entry.targetId)} (${entry.damage} danni)`;
                    cssClass = 'log-critical';
                    break;
                case 'spell_cast':
                    icon = '🔮';
                    content = `${getCombatantName(entry.casterId)} lancia ${entry.spellName}`;
                    cssClass = 'log-spell';
                    break;
                case 'damage':
                    icon = '💔';
                    content = `${getCombatantName(entry.targetId)} subisce ${entry.damage} danni`;
                    cssClass = 'log-damage';
                    break;
                case 'heal':
                    icon = '💚';
                    content = `${getCombatantName(entry.targetId)} recupera ${entry.healAmount} PF`;
                    cssClass = 'log-heal';
                    break;
                case 'condition_applied':
                    icon = '⚠️';
                    content = `${getCombatantName(entry.targetId)} → ${entry.conditionName}`;
                    if (entry.duration > 0) content += ` (${entry.duration} turni)`;
                    cssClass = 'log-condition';
                    break;
                case 'condition_removed':
                    icon = '✅';
                    content = `${getCombatantName(entry.targetId)} non è più ${entry.conditionName}`;
                    cssClass = 'log-condition-removed';
                    break;
                case 'death':
                    icon = '💀';
                    content = `${getCombatantName(entry.combatantId)} è morto!`;
                    cssClass = 'log-death';
                    break;
                case 'revive':
                    icon = '✨';
                    content = `${getCombatantName(entry.combatantId)} è tornato in vita!`;
                    cssClass = 'log-revive';
                    break;
                default:
                    content = entry.message || entry.eventType;
            }
            
            return `
                <div class="log-entry ${cssClass}">
                    <span class="log-time">${time}</span>
                    <span class="log-round-badge">R${entry.round || 0}</span>
                    <span class="log-icon">${icon}</span>
                    <span class="log-content">${content}</span>
                </div>
            `;
        }).join('');
    },
    
    /**
     * Esporta il log in vari formati.
     */
    exportLog(format = 'txt') {
        const combatants = getCombatState();
        const getCombatantName = (id) => {
            const c = combatants.find(c => c.id === id);
            return c?.customName || c?.name || 'Sconosciuto';
        };
        
        let content = '';
        const date = new Date().toLocaleDateString('it-IT');
        const time = new Date().toLocaleTimeString('it-IT');
        
        if (format === 'json') {
            content = JSON.stringify({
                exportDate: new Date().toISOString(),
                stats: this.combatStats,
                log: this.combatLog
            }, null, 2);
            this.downloadFile(content, `combat-log-${date}.json`, 'application/json');
            return;
        }
        
        // Header
        if (format === 'md') {
            content = `# Combat Log\n\n`;
            content += `**Data:** ${date} ${time}\n`;
            content += `**Round totali:** ${this.currentRound}\n\n`;
            content += `---\n\n`;
            content += `## Log Eventi\n\n`;
        } else {
            content = `COMBAT LOG\n`;
            content += `Data: ${date} ${time}\n`;
            content += `Round totali: ${this.currentRound}\n`;
            content += `${'='.repeat(50)}\n\n`;
        }
        
        // Entries
        this.combatLog.forEach(entry => {
            const time = new Date(entry.timestamp).toLocaleTimeString('it-IT');
            let line = '';
            
            switch (entry.eventType) {
                case 'attack_hit':
                    line = `[${time}] R${entry.round} - ${getCombatantName(entry.attackerId)} colpisce ${getCombatantName(entry.targetId)} con ${entry.attackName} (${entry.damage} danni)`;
                    break;
                case 'attack_miss':
                    line = `[${time}] R${entry.round} - ${getCombatantName(entry.attackerId)} manca ${getCombatantName(entry.targetId)}`;
                    break;
                case 'critical_hit':
                    line = `[${time}] R${entry.round} - CRITICO! ${getCombatantName(entry.attackerId)} → ${getCombatantName(entry.targetId)} (${entry.damage} danni)`;
                    break;
                case 'spell_cast':
                    line = `[${time}] R${entry.round} - ${getCombatantName(entry.casterId)} lancia ${entry.spellName}`;
                    break;
                case 'condition_applied':
                    line = `[${time}] R${entry.round} - ${getCombatantName(entry.targetId)} → ${entry.conditionName}`;
                    break;
                case 'death':
                    line = `[${time}] R${entry.round} - ${getCombatantName(entry.combatantId)} muore`;
                    break;
                default:
                    line = `[${time}] R${entry.round} - ${entry.eventType}`;
            }
            
            if (format === 'md') {
                content += `- ${line}\n`;
            } else {
                content += `${line}\n`;
            }
        });
        
        // Statistiche
        if (format === 'md') {
            content += `\n---\n\n## Statistiche\n\n`;
            Object.entries(this.combatStats.damageDealt).forEach(([id, data]) => {
                if (data.total > 0) {
                    content += `- **${getCombatantName(parseFloat(id))}**: ${data.total} danni totali\n`;
                }
            });
        }
        
        const extension = format === 'md' ? 'md' : 'txt';
        const mimeType = format === 'md' ? 'text/markdown' : 'text/plain';
        this.downloadFile(content, `combat-log-${date}.${extension}`, mimeType);
    },
    
    /**
     * Scarica un file.
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(`Log esportato: ${filename}`, 'success');
    },
    
    /**
     * Cancella il log.
     */
    clearLog() {
        if (!confirm('Sei sicuro di voler cancellare il log del combattimento?')) return;
        
        this.combatLog = [];
        this.combatStats = {
            startTime: null,
            endTime: null,
            roundsPlayed: 0,
            damageDealt: {},
            attacksHit: {},
            attacksMiss: {},
            criticalHits: {},
            spellsCasted: {},
            damageTaken: {},
            conditionsApplied: {}
        };
        this.actedThisTurn.clear();
        
        showToast('Log cancellato', 'info');
        
        // Aggiorna UI se il popup è aperto
        const entries = this.container.querySelector('#combat-log-entries');
        if (entries) {
            entries.innerHTML = this.renderLogEntries();
        }
    },
    
    /**
     * Reset del log all'inizio del combattimento.
     */
    startCombatLog() {
        this.combatLog = [];
        this.combatStats = {
            startTime: new Date().toISOString(),
            endTime: null,
            roundsPlayed: 0,
            damageDealt: {},
            attacksHit: {},
            attacksMiss: {},
            criticalHits: {},
            spellsCasted: {},
            damageTaken: {},
            conditionsApplied: {}
        };
        this.actedThisTurn.clear();
        
        this.logEvent('combat_start');
    },
    
    /**
     * Finalizza il log alla fine del combattimento.
     */
    endCombatLog() {
        this.combatStats.endTime = new Date().toISOString();
        this.combatStats.roundsPlayed = this.currentRound;
        
        this.logEvent('combat_end');
        
        // Mostra statistiche riepilogative
        this.showCombatSummary();
    },
    
    /**
     * Mostra un riepilogo delle statistiche di fine combattimento.
     */
    showCombatSummary() {
        const combatants = getCombatState();
        const getCombatantName = (id) => {
            const c = combatants.find(c => c.id === parseFloat(id));
            return c?.customName || c?.name || 'Sconosciuto';
        };
        
        // Calcola statistiche
        const topDamagers = Object.entries(this.combatStats.damageDealt)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 5);
        
        const totalDamage = Object.values(this.combatStats.damageDealt)
            .reduce((sum, d) => sum + d.total, 0);
        
        const totalHits = Object.values(this.combatStats.attacksHit).reduce((a, b) => a + b, 0);
        const totalMisses = Object.values(this.combatStats.attacksMiss).reduce((a, b) => a + b, 0);
        const totalCrits = Object.values(this.combatStats.criticalHits).reduce((a, b) => a + b, 0);
        const totalSpells = Object.values(this.combatStats.spellsCasted).reduce((a, b) => a + b, 0);
        
        // Crea contenuto popup
        let summaryHtml = `
            <div class="combat-summary">
                <h3>📊 Riepilogo Combattimento</h3>
                <div class="summary-stats">
                    <div class="summary-stat">
                        <span class="stat-value">${this.combatStats.roundsPlayed}</span>
                        <span class="stat-label">Round</span>
                    </div>
                    <div class="summary-stat">
                        <span class="stat-value">${totalDamage}</span>
                        <span class="stat-label">Danni Totali</span>
                    </div>
                    <div class="summary-stat">
                        <span class="stat-value">${totalHits}</span>
                        <span class="stat-label">Colpi</span>
                    </div>
                    <div class="summary-stat">
                        <span class="stat-value">${totalMisses}</span>
                        <span class="stat-label">Mancati</span>
                    </div>
                    <div class="summary-stat">
                        <span class="stat-value">${totalCrits}</span>
                        <span class="stat-label">Critici</span>
                    </div>
                    <div class="summary-stat">
                        <span class="stat-value">${totalSpells}</span>
                        <span class="stat-label">Incantesimi</span>
                    </div>
                </div>
                ${topDamagers.length > 0 ? `
                    <div class="top-damagers">
                        <h4>Top Damager</h4>
                        ${topDamagers.map(([id, data], i) => `
                            <div class="damager-row">
                                <span class="damager-rank">#${i + 1}</span>
                                <span class="damager-name">${getCombatantName(id)}</span>
                                <span class="damager-damage">${data.total} danni</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="summary-actions">
                    <button id="view-full-log-btn" class="log-action-btn">📜 Vedi Log Completo</button>
                    <button id="export-summary-btn" class="log-action-btn">📄 Esporta Riepilogo</button>
                </div>
            </div>
        `;
        
        // Mostra popup riepilogo
        const overlay = this.container.querySelector('#combat-log-overlay');
        const entries = this.container.querySelector('#combat-log-entries');
        if (overlay && entries) {
            entries.innerHTML = summaryHtml;
            overlay.classList.remove('hidden');
            
            // Aggiungi handler per il pulsante "Vedi Log Completo"
            entries.querySelector('#view-full-log-btn')?.addEventListener('click', () => {
                entries.innerHTML = this.renderLogEntries();
            });
            
            // Aggiungi handler per esportare
            entries.querySelector('#export-summary-btn')?.addEventListener('click', () => {
                this.exportLog('md');
            });
        }
    }
};

export default CombatTracker;
