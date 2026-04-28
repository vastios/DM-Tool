// modules/encounterBuilder.js

import { monsterDatabase } from '../../../database/monsterDatabase.js';
import { importEncounter, getCurrentCampaignId, getCampaignPcs } from '../../../stateManager.js';
import { showToast } from '../../../utils/toast.js';

// --- TABELLA XP PER CR (D&D 5e SRD) ---
const CR_TO_XP = {
    0: 10, 0.125: 25, 0.25: 50, 0.5: 100,
    1: 200, 2: 450, 3: 700, 4: 1100,
    5: 1800, 6: 2300, 7: 2900, 8: 3900,
    9: 5000, 10: 5900, 11: 7200, 12: 8400,
    13: 10000, 14: 11500, 15: 13000, 16: 15000,
    17: 18000, 18: 20000, 19: 22000, 20: 25000,
    21: 33000, 22: 41000, 23: 50000, 24: 62000,
    25: 75000, 26: 90000, 27: 105000, 28: 120000,
    29: 135000, 30: 155000
};

// --- SOGLIE DIFFICOLTÀ PER LIVELLO (D&D 5e) ---
const DIFFICULTY_THRESHOLDS = {
    1:  { easy: 25, medium: 50, hard: 75, deadly: 100 },
    2:  { easy: 50, medium: 100, hard: 150, deadly: 200 },
    3:  { easy: 75, medium: 150, hard: 225, deadly: 400 },
    4:  { easy: 125, medium: 250, hard: 375, deadly: 500 },
    5:  { easy: 250, medium: 500, hard: 750, deadly: 1100 },
    6:  { easy: 300, medium: 600, hard: 900, deadly: 1400 },
    7:  { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
    8:  { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
    9:  { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
    10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
    11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
    12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
    13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
    14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
    15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
    16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
    17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
    18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
    19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
    20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 }
};

// --- GESTIONE STORAGE ---
function getCampaignSpecificStorageKey() {
    const campaignId = getCurrentCampaignId();
    return campaignId ? `dungeonMasterToolEncounters_${campaignId}` : null;
}

function saveEncounters(encounters) {
    const storageKey = getCampaignSpecificStorageKey();
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(encounters));
}

function loadEncounters() {
    const storageKey = getCampaignSpecificStorageKey();
    if (!storageKey) return [];
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
}

function loadNpcs() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return [];
    const saved = localStorage.getItem(`dungeonMasterToolNpcs_${campaignId}`);
    return saved ? JSON.parse(saved) : [];
}

// --- FUNZIONI CALCOLO DIFFICOLTÀ ---
function getXpForCr(cr) {
    return CR_TO_XP[cr] || 0;
}

function getMonsterXp(monsterIndex) {
    const monster = monsterDatabase.find(m => m.index === monsterIndex);
    if (!monster) return 0;
    return monster.xp || getXpForCr(monster.challenge_rating);
}

function calculateEncounterXp(creatures) {
    let totalXp = 0;
    creatures.forEach(creature => {
        if (!creature.isNpc) {
            const xp = getMonsterXp(creature.index);
            totalXp += xp * creature.quantity;
        }
    });
    return totalXp;
}

function getPartyInfo() {
    const pcs = getCampaignPcs();
    if (!pcs || pcs.length === 0) {
        return { count: 0, avgLevel: 0, levels: [] };
    }
    const levels = pcs.map(pc => pc.level || 1);
    const avgLevel = Math.round(levels.reduce((a, b) => a + b, 0) / levels.length);
    return { count: pcs.length, avgLevel, levels };
}

function getDifficultyThresholds(partySize, partyLevel) {
    if (partySize === 0 || partyLevel === 0) return null;
    
    const baseThresholds = DIFFICULTY_THRESHOLDS[partyLevel] || DIFFICULTY_THRESHOLDS[1];
    return {
        easy: baseThresholds.easy * partySize,
        medium: baseThresholds.medium * partySize,
        hard: baseThresholds.hard * partySize,
        deadly: baseThresholds.deadly * partySize
    };
}

function determineDifficulty(totalXp, thresholds) {
    if (!thresholds) return { level: 'sconosciuta', color: '#888', icon: '❓' };
    
    if (totalXp >= thresholds.deadly) return { level: 'mortale', color: '#dc2626', icon: '💀' };
    if (totalXp >= thresholds.hard) return { level: 'difficile', color: '#f97316', icon: '⚔️' };
    if (totalXp >= thresholds.medium) return { level: 'media', color: '#eab308', icon: '⚡' };
    if (totalXp >= thresholds.easy) return { level: 'facile', color: '#22c55e', icon: '🛡️' };
    return { level: 'banale', color: '#6b7280', icon: '🪶' };
}

// --- MULTIOSTATORE XP ---
function calculateAdjustedXp(creatures) {
    let totalXp = calculateEncounterXp(creatures);
    const creatureCount = creatures.reduce((sum, c) => sum + c.quantity, 0);
    
    let multiplier = 1;
    if (creatureCount === 2) multiplier = 1.5;
    else if (creatureCount >= 3 && creatureCount <= 6) multiplier = 2;
    else if (creatureCount >= 7 && creatureCount <= 10) multiplier = 2.5;
    else if (creatureCount >= 11 && creatureCount <= 14) multiplier = 3;
    else if (creatureCount >= 15) multiplier = 4;
    
    return Math.floor(totalXp * multiplier);
}

// --- FUNZIONE PER OTTENERE TIPO MOSTRO IN ITALIANO ---
function getMonsterTypeItalian(type) {
    const translations = {
        'aberrazione': 'Aberrazione',
        'bestia': 'Bestia',
        'celeste': 'Celeste',
        'costrutto': 'Costrutto',
        'drago': 'Drago',
        'elementale': 'Elementale',
        'fata': 'Fata',
        'fiend': 'Diavolo',
        'gigante': 'Gigante',
        'umanoide': 'Umanoide',
        'mostruosità': 'Mostruosità',
        'ooze': 'Ooze',
        'pianta': 'Pianta',
        'non-morto': 'Non-morto',
        'vegetale': 'Vegetale'
    };
    return translations[type?.toLowerCase()] || type || 'Sconosciuto';
}

const EncounterBuilder = {
    render(containerElement) {
        let encounters = loadEncounters();
        let currentEditingId = null;
        let selectionMode = 'monster';
        let activeTypeFilter = 'Tutti';
        let selectedMonsters = [];
        let draggedItem = null;
        let pendingDeleteId = null;

        // --- RENDERING STRUTTURA PRINCIPALE ---
        containerElement.innerHTML = `
            <div class="encounter-builder-container">
                <div class="encounter-list-panel">
                    <div class="panel-header">
                        <h2>⚔️ Incontri</h2>
                        <button id="new-encounter-btn" class="action-btn">+ Nuovo</button>
                    </div>
                    <div class="encounter-list-content">
                        <ul id="saved-encounters-list" class="saved-encounters-list"></ul>
                    </div>
                </div>
                <div class="encounter-editor-panel">
                    <div id="editor-content" class="editor-content-wrapper">
                        <div class="empty-state">
                            <div class="empty-icon">⚔️</div>
                            <h3>Nessun Incontro Selezionato</h3>
                            <p>Seleziona un incontro dalla lista o creane uno nuovo per iniziare.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal di conferma eliminazione -->
            <div id="delete-modal" class="modal-overlay" style="display: none;">
                <div class="modal-content">
                    <div class="modal-icon">⚠️</div>
                    <h3>Conferma Eliminazione</h3>
                    <p id="delete-modal-text">Sei sicuro di voler eliminare questo incontro?</p>
                    <div class="modal-actions">
                        <button id="modal-cancel-btn" class="modal-btn cancel">Annulla</button>
                        <button id="modal-confirm-btn" class="modal-btn danger">Elimina</button>
                    </div>
                </div>
            </div>
        `;

        const savedList = containerElement.querySelector('#saved-encounters-list');
        const editorContent = containerElement.querySelector('#editor-content');
        const newEncounterBtn = containerElement.querySelector('#new-encounter-btn');
        const deleteModal = containerElement.querySelector('#delete-modal');
        const modalCancelBtn = containerElement.querySelector('#modal-cancel-btn');
        const modalConfirmBtn = containerElement.querySelector('#modal-confirm-btn');
        const modalText = containerElement.querySelector('#delete-modal-text');

        // --- RENDERING LISTA INCONTRI ---
        const renderEncounterList = () => {
            encounters = loadEncounters();
            savedList.innerHTML = encounters.length === 0 
                ? '<li class="empty-list">Nessun incontro salvato.</li>'
                : encounters.map(enc => `
                    <li class="encounter-list-item" data-id="${enc.id}">
                        <div class="encounter-item-info">
                            <h3>${enc.name}</h3>
                            <small>${enc.monsters.reduce((sum, m) => sum + m.quantity, 0)} creature • ${enc.totalXp ? enc.totalXp.toLocaleString() + ' XP' : '—'}</small>
                        </div>
                        <div class="encounter-item-actions">
                            <button class="edit-encounter-btn small" title="Modifica">✏️</button>
                            <button class="duplicate-encounter-btn small" title="Duplica">📋</button>
                            <button class="import-encounter-btn small primary" title="Importa nel Combat Tracker">▶️</button>
                            <button class="delete-encounter-btn small danger" title="Elimina">🗑️</button>
                        </div>
                    </li>
                `).join('');
        };

        // --- RENDERING PREVIEW READ-ONLY ---
        const renderPreview = (encounter) => {
            if (!encounter) return;
            
            const allNpcs = loadNpcs();
            const totalXp = encounter.totalXp || calculateEncounterXp(encounter.monsters);
            const adjustedXp = encounter.adjustedXp || calculateAdjustedXp(encounter.monsters);
            const partyInfo = getPartyInfo();
            const thresholds = getDifficultyThresholds(partyInfo.count, partyInfo.avgLevel);
            const difficulty = determineDifficulty(adjustedXp, thresholds);
            const totalCreatures = encounter.monsters.reduce((sum, m) => sum + m.quantity, 0);
            
            editorContent.innerHTML = `
                <div class="preview-layout">
                    <!-- Header Preview -->
                    <div class="preview-header">
                        <div class="preview-title-row">
                            <h2 class="preview-name">${encounter.name}</h2>
                            <span class="difficulty-badge difficulty-large" style="background-color: ${difficulty.color}20; border-color: ${difficulty.color}; color: ${difficulty.color}">
                                <span class="difficulty-icon">${difficulty.icon}</span>
                                <span class="difficulty-text">${difficulty.level}</span>
                            </span>
                        </div>
                        ${encounter.description ? `
                            <div class="preview-description">
                                <p>${encounter.description}</p>
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Statistiche XP -->
                    <div class="preview-stats-row">
                        <div class="preview-stat">
                            <span class="stat-icon">👾</span>
                            <span class="stat-number">${totalCreatures}</span>
                            <span class="stat-label">Creature</span>
                        </div>
                        <div class="preview-stat">
                            <span class="stat-icon">⭐</span>
                            <span class="stat-number">${totalXp.toLocaleString()}</span>
                            <span class="stat-label">XP Base</span>
                        </div>
                        <div class="preview-stat highlight">
                            <span class="stat-icon">📊</span>
                            <span class="stat-number">${adjustedXp.toLocaleString()}</span>
                            <span class="stat-label">XP Agg.</span>
                        </div>
                    </div>
                    
                    <!-- Lista Creature -->
                    <div class="preview-creatures-section">
                        <h3 class="section-title">👹 Creature nell'Incontro</h3>
                        <ul class="preview-creatures-list">
                            ${encounter.monsters.map(m => {
                                const data = m.isNpc 
                                    ? allNpcs.find(n => n.id === m.index)
                                    : monsterDatabase.find(mon => mon.index === m.index);
                                const name = data ? data.name : "Sconosciuto";
                                const cr = data && !m.isNpc ? data.challenge_rating : null;
                                const crDisplay = cr ? (typeof cr === 'number' && cr < 1 ? (cr === 0.125 ? '1/8' : cr === 0.25 ? '1/4' : cr === 0.5 ? '1/2' : cr) : cr) : null;
                                const xp = m.isNpc ? 0 : (data?.xp || getXpForCr(cr));
                                
                                return `
                                    <li class="preview-creature-item ${m.isNpc ? 'is-npc' : ''}">
                                        <div class="creature-qty-badge">${m.quantity}</div>
                                        <div class="creature-details">
                                            <span class="creature-name">${name} ${m.isNpc ? '<small class="npc-tag">PNG</small>' : ''}</span>
                                            <span class="creature-meta">
                                                ${crDisplay ? `CR ${crDisplay}` : ''} 
                                                ${xp > 0 ? `• ${xp.toLocaleString()} XP` : ''}
                                            </span>
                                        </div>
                                    </li>
                                `;
                            }).join('')}
                        </ul>
                    </div>
                    
                    <!-- Azioni Preview -->
                    <div class="preview-actions">
                        <button id="preview-edit-btn" class="action-btn primary">
                            <span>✏️</span> Modifica
                        </button>
                        <button id="preview-import-btn" class="action-btn success">
                            <span>▶️</span> Importa nel Combat Tracker
                        </button>
                    </div>
                </div>
            `;
            
            // Event listeners per i pulsanti della preview
            const editBtn = editorContent.querySelector('#preview-edit-btn');
            const importBtn = editorContent.querySelector('#preview-import-btn');
            
            if (editBtn) {
                editBtn.addEventListener('click', () => renderEditor(encounter));
            }
            
            if (importBtn) {
                importBtn.addEventListener('click', () => {
                    importEncounter(encounter);
                    showToast("Inviato al Combat Tracker!", "success");
                });
            }
        };

        // --- RENDERING EDITOR ---
        const renderEditor = (encounter = null, preserveMonsters = false) => {
            currentEditingId = encounter ? encounter.id : null;
            
            // Solo se non stiamo preservando i mostri (es. cambio modalità), aggiorniamo la lista
            if (!preserveMonsters) {
                selectedMonsters = encounter ? [...encounter.monsters] : [];
            }
            
            const partyInfo = getPartyInfo();
            const thresholds = getDifficultyThresholds(partyInfo.count, partyInfo.avgLevel);
            
            editorContent.innerHTML = `
                <div class="editor-layout">
                    <!-- Header con nome e descrizione -->
                    <div class="editor-header">
                        <div class="form-row">
                            <div class="form-group flex-2">
                                <label>🏷️ Nome Incontro</label>
                                <input type="text" id="encounter-name-input" value="${encounter ? encounter.name : ''}" placeholder="Es. Ambascata dei Goblin">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>📝 Descrizione</label>
                            <textarea id="encounter-desc-input" placeholder="Descrizione opzionale dell'incontro..." rows="2">${encounter ? encounter.description : ''}</textarea>
                        </div>
                    </div>

                    <!-- Pannello Difficoltà Party -->
                    <div class="party-difficulty-panel">
                        <div class="party-info">
                            <span class="party-icon">👥</span>
                            <span class="party-stats">
                                ${partyInfo.count > 0 
                                    ? `<strong>${partyInfo.count} PG</strong> • Livello medio <strong>${partyInfo.avgLevel}</strong>` 
                                    : '<em>Nessun PG nella campagna</em>'}
                            </span>
                        </div>
                        ${thresholds ? `
                            <div class="thresholds-bar">
                                <div class="threshold-segment easy" title="Facile: ${thresholds.easy} XP">
                                    <span>Facile</span>
                                </div>
                                <div class="threshold-segment medium" title="Media: ${thresholds.medium} XP">
                                    <span>Media</span>
                                </div>
                                <div class="threshold-segment hard" title="Difficile: ${thresholds.hard} XP">
                                    <span>Difficile</span>
                                </div>
                                <div class="threshold-segment deadly" title="Mortale: ${thresholds.deadly} XP">
                                    <span>Mortale</span>
                                </div>
                            </div>
                            <div class="threshold-values">
                                <span>${thresholds.easy}</span>
                                <span>${thresholds.medium}</span>
                                <span>${thresholds.hard}</span>
                                <span>${thresholds.deadly} XP</span>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Layout a due colonne per selettore e lista -->
                    <div class="editor-columns">
                        <!-- Colonna Selettore Creature -->
                        <div class="creature-selector-column">
                            <div class="selector-header">
                                <h3>🔍 Aggiungi Creature</h3>
                            </div>
                            
                            <div class="selection-mode-toggle">
                                <button class="mode-btn ${selectionMode === 'monster' ? 'active' : ''}" data-mode="monster">
                                    <span class="mode-icon">👹</span> Mostri
                                </button>
                                <button class="mode-btn ${selectionMode === 'npc' ? 'active' : ''}" data-mode="npc">
                                    <span class="mode-icon">👤</span> PNG
                                </button>
                            </div>
                            
                            <div class="search-container">
                                <input type="text" id="monster-search" placeholder="Cerca per nome...">
                            </div>
                            
                            <div id="type-filters" class="type-filters-scrollable"></div>
                            
                            <div class="selection-list-container">
                                <ul id="monster-selection-list" class="monster-selection-list"></ul>
                            </div>
                        </div>

                        <!-- Colonna Creature Selezionate -->
                        <div class="selected-creatures-column">
                            <div class="panel-header-row">
                                <h3>⚔️ Creature Selezionate</h3>
                                <div id="encounter-stats" class="encounter-stats"></div>
                            </div>
                            <div class="selected-list-container">
                                <ul id="selected-monsters-list" class="selected-monsters-list"></ul>
                            </div>
                        </div>
                    </div>

                    <!-- Footer con azioni -->
                    <div class="editor-actions">
                        <div class="action-hint">
                            <span>💡 Trascina le creature per riordinarle</span>
                        </div>
                        <button id="save-encounter-btn" class="action-btn success">
                            <span class="btn-icon">💾</span> Salva Incontro
                        </button>
                    </div>
                </div>
            `;

            renderTypeFilters();
            updateSelectionList();
            updateSelectedUI();
        };

        // --- RENDERING FILTRI TIPO ---
        const renderTypeFilters = () => {
            const filterContainer = containerElement.querySelector('#type-filters');
            if (!filterContainer || selectionMode === 'npc') {
                if (filterContainer) filterContainer.innerHTML = '';
                return;
            }
            const types = ['Tutti', ...new Set(monsterDatabase.map(m => m.type))].sort();
            filterContainer.innerHTML = types.map(t => `
                <button class="filter-btn ${t === activeTypeFilter ? 'active' : ''}">${t}</button>
            `).join('');
        };

        // --- AGGIORNAMENTO LISTA SELEZIONE ---
        const updateSelectionList = () => {
            const list = containerElement.querySelector('#monster-selection-list');
            const searchInput = containerElement.querySelector('#monster-search');
            const search = searchInput ? searchInput.value.toLowerCase() : '';
            if (!list) return;

            if (selectionMode === 'monster') {
                const filtered = monsterDatabase.filter(m => 
                    m.name.toLowerCase().includes(search) && (activeTypeFilter === 'Tutti' || m.type === activeTypeFilter)
                ).slice(0, 30);

                list.innerHTML = filtered.length === 0 
                    ? '<li class="empty-result">Nessun mostro trovato</li>'
                    : filtered.map(m => {
                        const cr = m.challenge_rating;
                        const crDisplay = typeof cr === 'number' && cr < 1 ? (cr === 0.125 ? '1/8' : cr === 0.25 ? '1/4' : cr === 0.5 ? '1/2' : cr) : cr;
                        return `
                            <li class="add-creature creature-card" data-index="${m.index}" data-is-npc="false">
                                <div class="creature-card-main">
                                    <span class="creature-name">${m.name}</span>
                                    <span class="creature-type">${getMonsterTypeItalian(m.type)}</span>
                                </div>
                                <div class="creature-card-stats">
                                    <span class="creature-cr-badge">CR ${crDisplay}</span>
                                    <span class="creature-xp">${(m.xp || getXpForCr(cr)).toLocaleString()} XP</span>
                                </div>
                            </li>
                        `;
                    }).join('');
            } else {
                const npcs = loadNpcs().filter(n => n.name.toLowerCase().includes(search));
                list.innerHTML = npcs.length === 0 
                    ? '<li class="empty-result">Nessun PNG trovato</li>'
                    : npcs.map(n => `
                        <li class="add-creature creature-card npc-card" data-index="${n.id}" data-is-npc="true">
                            <div class="creature-card-main">
                                <span class="creature-name">${n.name}</span>
                                <span class="creature-type">PNG Campagna</span>
                            </div>
                            <div class="creature-card-stats">
                                <span class="creature-cr-badge npc">👤</span>
                            </div>
                        </li>
                    `).join('');
            }
        };

        // --- AGGIORNAMENTO LISTA SELEZIONATI ---
        const updateSelectedUI = () => {
            const list = containerElement.querySelector('#selected-monsters-list');
            const statsContainer = containerElement.querySelector('#encounter-stats');
            if (!list) return;

            if (selectedMonsters.length === 0) {
                list.innerHTML = `
                    <li class="empty-selection">
                        <div class="empty-selection-icon">👆</div>
                        <p>Clicca sulle creature per aggiungerle</p>
                    </li>`;
                if (statsContainer) statsContainer.innerHTML = '';
                return;
            }

            const allNpcs = loadNpcs();
            
            list.innerHTML = selectedMonsters.map((sel, idx) => {
                const data = sel.isNpc 
                    ? allNpcs.find(n => n.id === sel.index)
                    : monsterDatabase.find(m => m.index === sel.index);
                const name = data ? data.name : "Sconosciuto";
                const cr = data && !sel.isNpc ? data.challenge_rating : '-';
                const xp = sel.isNpc ? 0 : (data?.xp || getXpForCr(cr));
                const crDisplay = typeof cr === 'number' && cr < 1 ? (cr === 0.125 ? '1/8' : cr === 0.25 ? '1/4' : cr === 0.5 ? '1/2' : cr) : cr;
                
                return `
                    <li data-index="${sel.index}" data-is-npc="${sel.isNpc}" data-order="${idx}" draggable="true" class="draggable-creature">
                        <span class="drag-handle" title="Trascina per riordinare">⋮⋮</span>
                        <div class="selected-creature-info">
                            <span class="creature-name">${name} ${sel.isNpc ? '<small class="npc-tag">PNG</small>' : ''}</span>
                            <span class="creature-cr">${cr !== '-' ? 'CR ' + crDisplay : ''}</span>
                        </div>
                        <div class="quantity-controls">
                            <button class="qty-btn minus" title="Riduci">−</button>
                            <span class="qty-val">${sel.quantity}</span>
                            <button class="qty-btn plus" title="Aumenta">+</button>
                            <button class="remove-btn danger" title="Rimuovi">×</button>
                        </div>
                    </li>
                `;
            }).join('');

            // Aggiorna statistiche incontro
            if (statsContainer) {
                const totalXp = calculateEncounterXp(selectedMonsters);
                const adjustedXp = calculateAdjustedXp(selectedMonsters);
                const partyInfo = getPartyInfo();
                const thresholds = getDifficultyThresholds(partyInfo.count, partyInfo.avgLevel);
                const difficulty = determineDifficulty(adjustedXp, thresholds);
                
                statsContainer.innerHTML = `
                    <div class="stat-item">
                        <span class="stat-label">XP:</span>
                        <span class="stat-value">${totalXp.toLocaleString()}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Agg:</span>
                        <span class="stat-value">${adjustedXp.toLocaleString()}</span>
                    </div>
                    <div class="difficulty-badge" style="background-color: ${difficulty.color}20; border-color: ${difficulty.color}; color: ${difficulty.color}">
                        <span class="difficulty-icon">${difficulty.icon}</span>
                        <span class="difficulty-text">${difficulty.level}</span>
                    </div>
                `;
            }

            initDragAndDrop();
        };

        // --- DRAG & DROP ---
        const initDragAndDrop = () => {
            const items = list.querySelectorAll('.draggable-creature');
            
            items.forEach(item => {
                item.addEventListener('dragstart', handleDragStart);
                item.addEventListener('dragend', handleDragEnd);
                item.addEventListener('dragover', handleDragOver);
                item.addEventListener('drop', handleDrop);
                item.addEventListener('dragenter', handleDragEnter);
                item.addEventListener('dragleave', handleDragLeave);
            });
        };

        const handleDragStart = (e) => {
            draggedItem = e.target;
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', e.target.dataset.order);
        };

        const handleDragEnd = (e) => {
            e.target.classList.remove('dragging');
            document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
            draggedItem = null;
        };

        const handleDragOver = (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        };

        const handleDragEnter = (e) => {
            e.preventDefault();
            const target = e.target.closest('.draggable-creature');
            if (target && target !== draggedItem) {
                target.classList.add('drag-over');
            }
        };

        const handleDragLeave = (e) => {
            const target = e.target.closest('.draggable-creature');
            if (target) {
                target.classList.remove('drag-over');
            }
        };

        const handleDrop = (e) => {
            e.preventDefault();
            const target = e.target.closest('.draggable-creature');
            if (!target || target === draggedItem) return;

            const fromIndex = parseInt(draggedItem.dataset.order);
            const toIndex = parseInt(target.dataset.order);

            const [moved] = selectedMonsters.splice(fromIndex, 1);
            selectedMonsters.splice(toIndex, 0, moved);

            updateSelectedUI();
            showToast("Creature riordinate", "info");
        };

        // --- MODAL DI CONFERMA ---
        const showDeleteModal = (encounterName) => {
            modalText.textContent = `Sei sicuro di voler eliminare "${encounterName}"?`;
            deleteModal.style.display = 'flex';
        };

        const hideDeleteModal = () => {
            deleteModal.style.display = 'none';
            pendingDeleteId = null;
        };

        modalCancelBtn.addEventListener('click', hideDeleteModal);
        
        modalConfirmBtn.addEventListener('click', () => {
            if (pendingDeleteId) {
                encounters = encounters.filter(e => e.id !== pendingDeleteId);
                saveEncounters(encounters);
                renderEncounterList();
                hideDeleteModal();
                showToast("Incontro eliminato", "success");
            }
        });

        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) hideDeleteModal();
        });

        // --- EVENT LISTENERS (DELEGATI) ---
        containerElement.addEventListener('click', (e) => {
            // Cambio modalità Mostri/PNG - FIX: non chiamare renderEditor completo
            if (e.target.classList.contains('mode-btn') || e.target.closest('.mode-btn')) {
                const btn = e.target.classList.contains('mode-btn') ? e.target : e.target.closest('.mode-btn');
                selectionMode = btn.dataset.mode;
                
                // Aggiorna solo i pulsanti e la lista, NON resettare selectedMonsters
                containerElement.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                activeTypeFilter = 'Tutti';
                renderTypeFilters();
                updateSelectionList();
                return; // Importante: non proseguire con altri handler
            }

            // Filtri tipo
            if (e.target.classList.contains('filter-btn')) {
                activeTypeFilter = e.target.textContent;
                renderTypeFilters();
                updateSelectionList();
            }

            // Aggiunta creatura
            const addLi = e.target.closest('.add-creature');
            if (addLi) {
                const index = addLi.dataset.index;
                const isNpc = addLi.dataset.isNpc === 'true';
                const existing = selectedMonsters.find(m => m.index === index && m.isNpc === isNpc);
                
                if (existing) existing.quantity++;
                else selectedMonsters.push({ index, quantity: 1, isNpc });
                
                updateSelectedUI();
                
                // Feedback visivo
                addLi.classList.add('added');
                setTimeout(() => addLi.classList.remove('added'), 300);
            }

            // Controlli quantità
            if (e.target.classList.contains('qty-btn')) {
                const li = e.target.closest('li');
                const isNpc = li.dataset.isNpc === 'true';
                const item = selectedMonsters.find(m => m.index === li.dataset.index && m.isNpc === isNpc);
                if (e.target.classList.contains('plus')) item.quantity++;
                else item.quantity = Math.max(1, item.quantity - 1);
                updateSelectedUI();
            }

            // Rimozione
            if (e.target.classList.contains('remove-btn')) {
                const li = e.target.closest('li');
                const isNpc = li.dataset.isNpc === 'true';
                selectedMonsters = selectedMonsters.filter(m => !(m.index === li.dataset.index && m.isNpc === isNpc));
                updateSelectedUI();
            }

            // Salva Incontro
            if (e.target.id === 'save-encounter-btn') {
                const name = containerElement.querySelector('#encounter-name-input').value.trim();
                if (!name) return showToast("Inserisci un nome!", "error");

                const newEnc = {
                    id: currentEditingId || Date.now().toString(),
                    name,
                    description: containerElement.querySelector('#encounter-desc-input').value,
                    monsters: [...selectedMonsters],
                    totalXp: calculateEncounterXp(selectedMonsters),
                    adjustedXp: calculateAdjustedXp(selectedMonsters)
                };

                const idx = encounters.findIndex(en => en.id === newEnc.id);
                if (idx > -1) encounters[idx] = newEnc;
                else encounters.push(newEnc);

                saveEncounters(encounters);
                renderEncounterList();
                showToast("Incontro salvato!", "success");
            }

            // Bottoni Lista Incontri
            const listLi = e.target.closest('.encounter-list-item');
            if (listLi) {
                const id = listLi.dataset.id;
                const enc = encounters.find(e => e.id === id);

                // Click sul corpo dell'item → Preview
                if (e.target.closest('.encounter-item-info')) {
                    if (enc) renderPreview(enc);
                    return;
                }

                // Click sui pulsanti → Azioni specifiche
                if (e.target.classList.contains('edit-encounter-btn')) renderEditor(enc);
                
                if (e.target.classList.contains('duplicate-encounter-btn') && enc) {
                    const duplicated = {
                        ...enc,
                        id: Date.now().toString(),
                        name: `${enc.name} (copia)`,
                        monsters: [...enc.monsters]
                    };
                    encounters.push(duplicated);
                    saveEncounters(encounters);
                    renderEncounterList();
                    showToast("Incontro duplicato!", "success");
                }
                
                if (e.target.classList.contains('import-encounter-btn') && enc) {
                    importEncounter(enc);
                    showToast("Inviato al Combat Tracker!", "success");
                }
                
                if (e.target.classList.contains('delete-encounter-btn') && enc) {
                    pendingDeleteId = id;
                    showDeleteModal(enc.name);
                }
            }
        });

        // Search listener
        containerElement.addEventListener('input', (e) => {
            if (e.target.id === 'monster-search') updateSelectionList();
        });

        newEncounterBtn.addEventListener('click', () => renderEditor());

        // Inizializzazione
        renderEncounterList();
    }
};

export default EncounterBuilder;
