// modules/encounterBuilder.js

import { monsterDatabase } from '../../../database/monsterDatabase.js';
import { importEncounter, getCurrentCampaignId } from '../../../stateManager.js';
import { showToast } from '../../../utils/toast.js';

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

const EncounterBuilder = {
    render(containerElement) {
        let encounters = loadEncounters();
        let currentEditingId = null;
        let selectionMode = 'monster'; // 'monster' o 'npc'
        let activeTypeFilter = 'Tutti';
        let selectedMonsters = []; // Stato temporaneo dell'editor

        containerElement.innerHTML = `
            <div class="encounter-builder-container">
                <div class="encounter-list-panel">
                    <div class="panel-header">
                        <h2>I Tuoi Incontri</h2>
                        <button id="new-encounter-btn" class="action-btn">Nuovo Incontro</button>
                    </div>
                    <ul id="saved-encounters-list" class="saved-encounters-list"></ul>
                </div>
                <div class="encounter-editor-panel">
                    <div id="editor-content">
                        <p style="text-align: center; color: #888; margin-top: 3rem;">Seleziona un incontro o creane uno nuovo.</p>
                    </div>
                </div>
            </div>
        `;

        const savedList = containerElement.querySelector('#saved-encounters-list');
        const editorContent = containerElement.querySelector('#editor-content');
        const newEncounterBtn = containerElement.querySelector('#new-encounter-btn');

        // --- LOGICA DI RENDERING ---

        const renderEncounterList = () => {
            encounters = loadEncounters();
            savedList.innerHTML = encounters.length === 0 
                ? '<li class="empty-list">Nessun incontro salvato.</li>'
                : encounters.map(enc => `
                    <li class="encounter-list-item" data-id="${enc.id}">
                        <div class="encounter-item-info">
                            <h3>${enc.name}</h3>
                            <small>${enc.monsters.length} tipi di creature</small>
                        </div>
                        <div class="encounter-item-actions">
                            <button class="edit-encounter-btn small">Modifica</button>
                            <button class="import-encounter-btn small primary">Importa</button>
                            <button class="delete-encounter-btn small danger">Elimina</button>
                        </div>
                    </li>
                `).join('');
        };

        const renderEditor = (encounter = null) => {
            currentEditingId = encounter ? encounter.id : null;
            selectedMonsters = encounter ? [...encounter.monsters] : [];
            
            editorContent.innerHTML = `
                <div class="editor-form">
                    <div class="form-group">
                        <label>Nome Incontro:</label>
                        <input type="text" id="encounter-name-input" value="${encounter ? encounter.name : ''}">
                    </div>
                    <div class="form-group">
                        <label>Descrizione:</label>
                        <textarea id="encounter-desc-input">${encounter ? encounter.description : ''}</textarea>
                    </div>
                </div>

                <div class="monster-selector-panel">
                    <h3>Aggiungi Creature</h3>
                    <div class="selection-mode-toggle">
                        <button class="mode-btn ${selectionMode === 'monster' ? 'active' : ''}" data-mode="monster">Mostri</button>
                        <button class="mode-btn ${selectionMode === 'npc' ? 'active' : ''}" data-mode="npc">PNG</button>
                    </div>
                    <input type="text" id="monster-search" placeholder="Cerca...">
                    <div id="type-filters" class="compact-filters"></div>
                    <ul id="monster-selection-list" class="monster-selection-list"></ul>
                </div>

                <div class="selected-monsters-panel">
                    <h3>Creature Selezionate</h3>
                    <ul id="selected-monsters-list" class="selected-monsters-list"></ul>
                </div>

                <div class="editor-actions">
                    <button id="save-encounter-btn" class="action-btn success">Salva Incontro</button>
                </div>
            `;

            renderTypeFilters();
            updateSelectionList();
            updateSelectedUI();
        };

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

        const updateSelectionList = () => {
            const list = containerElement.querySelector('#monster-selection-list');
            const search = containerElement.querySelector('#monster-search').value.toLowerCase();
            if (!list) return;

            if (selectionMode === 'monster') {
                const filtered = monsterDatabase.filter(m => 
                    m.name.toLowerCase().includes(search) && (activeTypeFilter === 'Tutti' || m.type === activeTypeFilter)
                ).slice(0, 20); // Limite per performance

                list.innerHTML = filtered.map(m => `
                    <li class="add-creature" data-index="${m.index}" data-is-npc="false">
                        ${m.name} <small>(CR ${m.challenge_rating})</small>
                    </li>
                `).join('');
            } else {
                const npcs = loadNpcs().filter(n => n.name.toLowerCase().includes(search));
                list.innerHTML = npcs.map(n => `
                    <li class="add-creature" data-index="${n.id}" data-is-npc="true">
                        ${n.name} <small>(PNG)</small>
                    </li>
                `).join('');
            }
        };

        const updateSelectedUI = () => {
            const list = containerElement.querySelector('#selected-monsters-list');
            if (!list) return;

            if (selectedMonsters.length === 0) {
                list.innerHTML = '<li class="empty-list">Nessuna creatura.</li>';
                return;
            }

            const allNpcs = loadNpcs();
            list.innerHTML = selectedMonsters.map(sel => {
                const data = sel.isNpc 
                    ? allNpcs.find(n => n.id === sel.index)
                    : monsterDatabase.find(m => m.index === sel.index);
                const name = data ? data.name : "Sconosciuto";
                
                return `
                    <li data-index="${sel.index}" data-is-npc="${sel.isNpc}">
                        <span>${name} ${sel.isNpc ? '(PNG)' : ''}</span>
                        <div class="quantity-controls">
                            <button class="qty-btn minus">-</button>
                            <span class="qty-val">${sel.quantity}</span>
                            <button class="qty-btn plus">+</button>
                            <button class="remove-btn danger">×</button>
                        </div>
                    </li>
                `;
            }).join('');
        };

        // --- EVENT LISTENERS (DELEGATI) ---

        containerElement.addEventListener('click', (e) => {
            // Cambio modalità Mostri/PNG
            if (e.target.classList.contains('mode-btn')) {
                selectionMode = e.target.dataset.mode;
                renderEditor(currentEditingId ? encounters.find(enc => enc.id === currentEditingId) : null);
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
                    monsters: [...selectedMonsters]
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

                if (e.target.classList.contains('edit-encounter-btn')) renderEditor(enc);
                if (e.target.classList.contains('import-encounter-btn')) {
                    importEncounter(enc);
                    showToast("Inviato al Combat Tracker!", "success");
                }
                if (e.target.classList.contains('delete-encounter-btn')) {
                    if (confirm("Eliminare l'incontro?")) {
                        encounters = encounters.filter(e => e.id !== id);
                        saveEncounters(encounters);
                        renderEncounterList();
                    }
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