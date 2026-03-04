//modules/pgManager.js

import { getCurrentCampaignId } from '../../../stateManager.js';
import { showToast } from '../../../utils/toast.js';
import { rollDice } from '../../../utils/dice.js';
import { spellDatabase } from '../../../database/spells.js';
import { addMonsterToCombat } from '../../../stateManager.js';

// --- FUNZIONI PER LA GESTIONE DEL LOCAL STORAGE ---
function getStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) {
        console.warn("⚠️ [PgManager] Tentativo di accedere al localStorage senza una campagna selezionata.");
        return null;
    }
    return `dungeonMasterToolPgs_${campaignId}`;
}

function savePgs(pgs) {
    const storageKey = getStorageKey();
    if (!storageKey) return;
    try {
        localStorage.setItem(storageKey, JSON.stringify(pgs));
        console.log(`💾 [PgManager] PG salvati per la campagna ${getCurrentCampaignId()}.`);
    } catch (error) {
        console.error("❌ [PgManager] Impossibile salvare i PG:", error);
    }
}

function loadPgs() {
    const storageKey = getStorageKey();
    if (!storageKey) return [];
    try {
        const savedPgsJSON = localStorage.getItem(storageKey);
        return savedPgsJSON ? JSON.parse(savedPgsJSON) : [];
    } catch (error) {
        console.error("❌ [PgManager] Impossibile caricare i PG:", error);
        return [];
    }
}

// --- NUOVA FUNZIONE: Crea un oggetto "mostro" da un PG ---
function createMonsterFromPg(pg) {
    const stats = {
        strength: pg.strength || 10, dexterity: pg.dexterity || 10, constitution: pg.constitution || 10,
        intelligence: pg.intelligence || 10, wisdom: pg.wisdom || 10, charisma: pg.charisma || 10,
    };
    const dexMod = Math.floor((stats.dexterity - 10) / 2);
    const conMod = Math.floor((stats.constitution - 10) / 2);
    const level = parseInt(pg.level) || 1;
    const hp = Math.max(1, rollDice(`${level}d10+${level * conMod}`)); // Media d10 per i PG

    return {
        name: pg.name, size: "Medio", type: "Umanoide", subtype: pg.race || "Umano", alignment: pg.alignment || "Neutrale",
        armor_class: [{ type: "armatura", value: pg.armorClass || (10 + dexMod) }], hit_points: hp, hit_dice: `${level}d10+${level * conMod}`,
        speed: { camminare: "9 m." }, strength: stats.strength, dexterity: stats.dexterity, constitution: stats.constitution,
        intelligence: stats.intelligence, wisdom: stats.wisdom, charisma: stats.charisma, proficiencies: [], damage_vulnerabilities: [],
        damage_resistances: [], damage_immunities: [], condition_immunities: [], senses: { "Percezione passiva": 10 },
        languages: "Comune", challenge_rating: level, xp: (level * level) * 10, // Stima XP
        special_abilities: [], actions: [], reactions: [], legendary_actions: [], source: "Gestore PG", isPlayer: true
    };
}

const PgManager = {
    render(containerElement) {
        // --- STILE SPECIFICO DEL MODULO (COPIATO DA NPC MANAGER) ---
        const moduleStyles = `
        <style>
        /* Stili comuni per PgManager e NpcManager */
        .pg-manager-container, .npc-manager-container {
            display: flex; height: 100%; background-color: #2a2a2a; color: #e0e0e0; font-family: 'Lato', sans-serif;
        }
        .pg-manager-container .pg-list-panel, .npc-manager-container .npc-list-panel {
            flex: 0 0 280px; background-color: #333; border-right: 1px solid #444; padding: 20px; overflow-y: auto;
        }
        .pg-manager-container .pg-editor-panel, .npc-manager-container .npc-editor-panel {
            flex: 1; padding: 20px; background-color: #3a3a3a; overflow-y: auto;
        }
        .pg-manager-container .panel-header, .npc-manager-container .panel-header {
            margin-bottom: 10px;
        }
        .pg-manager-container .panel-header h2, .npc-manager-container .panel-header h2 {
            font-family: 'Cinzel', serif; color: #d4af37; margin: 0; font-size: 1.5rem;
        }
        .pg-manager-container .saved-pgs-list, .npc-manager-container .saved-npcs-list {
            list-style: none; padding: 0; margin: 0;
        }
        .pg-manager-container .pg-list-item, .npc-manager-container .npc-list-item {
            background-color: #404040; border-radius: 8px; margin-bottom: 10px; padding: 12px; cursor: pointer;
            transition: background-color 0.2s, transform 0.2s; display: flex; justify-content: space-between; align-items: center;
        }
        .pg-manager-container .pg-list-item:hover, .npc-manager-container .npc-list-item:hover {
            background-color: #4a4a4a; transform: translateX(5px);
        }
        .pg-manager-container .pg-item-info, .npc-manager-container .npc-item-info {
            flex-grow: 1;
        }
        .pg-manager-container .pg-item-info h3, .npc-manager-container .npc-item-info h3 {
            margin: 0 0 5px 0; color: #f0f0f0; font-size: 1.1rem;
        }
        .pg-manager-container .pg-item-info p, .npc-manager-container .npc-item-info p {
            margin: 0; font-size: 0.8rem; color: #aaa;
        }
        .pg-manager-container .pg-item-info small, .npc-manager-container .npc-item-info small {
            font-size: 0.7rem; color: #888;
        }
        .pg-manager-container .pg-item-actions, .npc-manager-container .npc-item-actions {
            display: flex; flex-direction: column; gap: 5px;
        }
        .pg-manager-container .action-btn, .npc-manager-container .action-btn {
            background-color: #d4af37; color: #1a1a1a; border: none; padding: 8px 12px; border-radius: 4px;
            cursor: pointer; font-weight: bold; transition: background-color 0.2s;
        }
        .pg-manager-container .action-btn:hover, .npc-manager-container .action-btn:hover {
            background-color: #e6c657;
        }
        .pg-manager-container .action-btn.small, .npc-manager-container .action-btn.small {
            padding: 4px 6px; font-size: 0.7rem; line-height: 1;
        }
        .pg-manager-container .action-btn.danger, .npc-manager-container .action-btn.danger {
            background-color: #c0392b; color: white;
        }
        .pg-manager-container .action-btn.danger:hover, .npc-manager-container .action-btn.danger:hover {
            background-color: #e74c3c;
        }
        .pg-manager-container .list-search, .npc-manager-container .list-search {
            width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #555; background-color: #4a4a4a; color: #e0e0e0;
            margin-bottom: 10px; box-sizing: border-box;
        }
        .pg-manager-container .empty-list, .npc-manager-container .empty-list {
            text-align: center; color: #888; padding: 20px;
        }

        /* Stili per le carte voltabili */
        .pg-viewer-cards-container, .npc-viewer-cards-container {
            display: flex; height: 100%; gap: 20px;
        }
        .flip-card-container { flex: 1; perspective: 1000px; }
        .flip-card {
            width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.6s;
        }
        .flip-card.flipped { transform: rotateY(180deg); }
        .flip-card-front, .flip-card-back {
            position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden;
            overflow-y: auto; box-sizing: border-box;
        }
        .flip-card-back { transform: rotateY(180deg); }
        .flip-button {
            position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); color: #fff; border: none;
            border-radius: 50%; width: 30px; height: 30px; font-size: 16px; cursor: pointer; z-index: 10;
            display: flex; align-items: center; justify-content: center;
        }
        .flip-button:hover { background: rgba(0,0,0,0.8); }
        
        /* Stili per l'editor form (riutilizzati) */
        .editor-form { display: flex; flex-direction: column; gap: 15px; }
        .editor-form .form-group { display: flex; flex-direction: column; }
        .editor-form label { margin-bottom: 5px; color: #d4af37; font-weight: bold; }
        .editor-form input, .editor-form textarea {
            padding: 10px; border-radius: 4px; border: 1px solid #555; background-color: #4a4a4a; color: #e0e0e0;
            font-size: 1rem; box-sizing: border-box;
        }
        .editor-form input:focus, .editor-form textarea:focus { outline: none; border-color: #d4af37; }
        .form-row { display: flex; gap: 20px; }
        .form-row .form-group { flex: 1; }
        .form-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .form-section-header h4 { color: #d4af37; margin: 0; }
        .stats-editor-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .editor-actions { margin-top: 20px; text-align: right; }
        </style>
        `;

        containerElement.innerHTML = `
        ${moduleStyles}
        <div class="pg-manager-container">
            <div class="pg-list-panel">
                <div class="panel-header"><h2>Gestore PG</h2></div>
                <div style="display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; align-items: center;">
                    <input type="text" id="pg-search" class="list-search" placeholder="Cerca un PG..." style="width: 100%;">
                    <button id="new-pg-btn" class="action-btn" style="width: 50%; padding: 4px 6px; font-size: 0.7rem; line-height: 1;">NUOVO</button>
                </div>
                <ul id="saved-pgs-list" class="saved-pgs-list"></ul>
            </div>
            <div class="pg-editor-panel">
                <div id="editor-content" style="height: 100%;">
                    <p style="text-align: center; color: #888; margin-top: 3rem;">Seleziona un PG esistente o creane uno nuovo per iniziare.</p>
                </div>
            </div>
        </div>
        `;

        const savedList = containerElement.querySelector('#saved-pgs-list');
        const editorContent = containerElement.querySelector('#editor-content');
        const newPgBtn = containerElement.querySelector('#new-pg-btn');
        const searchInput = containerElement.querySelector('#pg-search');

        let pgs = loadPgs();
        let currentEditingId = null;
        let selectedSpells = [];
        let selectedInventory = [];
        let selectedFeatures = [];

        // --- FUNZIONI DI RENDERING ---
        const renderPgList = (searchTerm = '') => {
            savedList.innerHTML = '';
            const filteredPgs = pgs.filter(pg =>
                (pg.name && pg.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (pg.class && pg.class.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (pg.race && pg.race.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            if (filteredPgs.length === 0) { savedList.innerHTML = '<li class="empty-list">Nessun PG trovato.</li>'; return; }
            const sortedPgs = [...filteredPgs].sort((a, b) => a.name.localeCompare(b.name));
            sortedPgs.forEach(pg => {
                const li = document.createElement('li'); li.className = 'pg-list-item'; li.dataset.id = pg.id;
                li.innerHTML = `
                <div class="pg-item-info">
                    <h3>${pg.name}</h3><p><em>${pg.race}</em> - ${pg.class} ${pg.level ? `Lv. ${pg.level}` : ''}</p>
                    ${pg.player ? `<small><strong>Giocatore:</strong> ${pg.player}</small>` : ''}
                </div>
                <div class="pg-item-actions">
                    <button class="action-btn small edit-list-btn" data-pg-id="${pg.id}" title="Modifica">✏️</button>
                    <button class="action-btn small danger delete-list-btn" data-pg-id="${pg.id}" title="Elimina">🗑️</button>
                    <button class="action-btn small add-to-combat-list-btn" data-pg-id="${pg.id}" title="Aggiungi al Combattimento">⚔️</button>
                </div>
                `;
                savedList.appendChild(li);
            });
        };

        const renderPgViewer = (pg) => {
            const stats = { strength: pg.strength || 10, dexterity: pg.dexterity || 10, constitution: pg.constitution || 10, intelligence: pg.intelligence || 10, wisdom: pg.wisdom || 10, charisma: pg.charisma || 10 };
            const getMod = (score) => (score >= 10 ? '+' : '') + Math.floor((score - 10) / 2);
            const createList = (items) => items.length > 0 ? `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>` : '<p>Nessuno</p>';
            const createDescList = (items) => items.length > 0 ? `<ul>${items.map(item => `<li><strong>${item.name}:</strong> ${item.description}</li>`).join('')}</ul>` : '<p>Nessuna.</p>';

            editorContent.innerHTML = `
            <div class="pg-viewer-cards-container">
                <div class="flip-card-container">
                    <div class="flip-card" id="pg-card-1">
                        <button class="flip-button">↻</button>
                        <div class="flip-card-front npc-stat-block">
                            <div class="npc-stat-block-header">
                                <h3>${pg.name}</h3>
                                <p><em>${pg.race}, ${pg.class} ${pg.level ? `Lv. ${pg.level}` : ''}</em></p>
                            </div>
                            <hr>
                            <div class="npc-section">
                                <p><strong>Giocatore:</strong> ${pg.player || 'NPC'}</p>
                                <p><strong>Allineamento:</strong> ${pg.alignment || 'Non specificato'}</p>
                            </div>
                            <div class="npc-section">
                                <h4>Personalità</h4>
                                <p>${pg.personality || 'Nessuna descrizione disponibile.'}</p>
                            </div>
                        </div>
                        <div class="flip-card-back npc-stat-block">
                            <div class="npc-stat-block-header">
                                <h3>${pg.name} (Statistiche)</h3>
                            </div>
                            <hr>
                            <div class="npc-stats-grid">
                                <div><strong>FOR</strong> ${stats.strength} (${getMod(stats.strength)})</div>
                                <div><strong>DES</strong> ${stats.dexterity} (${getMod(stats.dexterity)})</div>
                                <div><strong>COS</strong> ${stats.constitution} (${getMod(stats.constitution)})</div>
                                <div><strong>INT</strong> ${stats.intelligence} (${getMod(stats.intelligence)})</div>
                                <div><strong>SAG</strong> ${stats.wisdom} (${getMod(stats.wisdom)})</div>
                                <div><strong>CAR</strong> ${stats.charisma} (${getMod(stats.charisma)})</div>
                            </div>
                            <hr>
                            <div class="npc-section">
                                <p><strong>CA:</strong> ${pg.armorClass || 'N/A'}</p>
                                <p><strong>PF:</strong> ${pg.hitPoints || 'N/A'}</p>
                                <p><strong>Iniziativa:</strong> ${getMod(stats.dexterity)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flip-card-container">
                    <div class="flip-card" id="pg-card-2">
                        <button class="flip-button">↻</button>
                        <div class="flip-card-front npc-stat-block">
                            <div class="npc-stat-block-header">
                                <h3>${pg.name} (Background)</h3>
                            </div>
                            <hr>
                            <div class="npc-section">
                                <h4>Ideali</h4>
                                <p>${pg.ideals || 'Nessuno.'}</p>
                            </div>
                            <div class="npc-section">
                                <h4>Legami</h4>
                                <p>${pg.bonds || 'Nessuno.'}</p>
                            </div>
                            <div class="npc-section">
                                <h4>Difetti</h4>
                                <p>${pg.flaws || 'Nessuno.'}</p>
                            </div>
                        </div>
                        <div class="flip-card-back npc-stat-block">
                            <div class="npc-stat-block-header">
                                <h3>${pg.name} (Equipaggiamento)</h3>
                            </div>
                            <hr>
                            <div class="npc-section">
                                <h4>Inventario</h4>
                                ${createList(pg.inventory || [])}
                            </div>
                            <div class="npc-section">
                                <h4>Caratteristiche Speciali</h4>
                                ${createDescList(pg.features || [])}
                            </div>
                            <div class="npc-section">
                                <h4>Incantesimi</h4>
                                ${createList(pg.spells || [])}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        };

        const renderPgEditor = (pg = null) => {
            const isNew = !pg;
            currentEditingId = isNew ? null : pg.id;
            selectedSpells = isNew ? [] : (pg.spells || []);
            selectedInventory = isNew ? [] : (pg.inventory || []);
            selectedFeatures = isNew ? [] : (pg.features || []);

            editorContent.innerHTML = `
            <div class="editor-form">
                <div class="form-group"><label for="pg-name">Nome del PG:</label><input type="text" id="pg-name" value="${isNew ? '' : pg.name}" placeholder="Es. Drizzt Do'Urden"></div>
                <div class="form-row">
                    <div class="form-group"><label for="pg-player">Giocatore:</label><input type="text" id="pg-player" value="${isNew ? '' : pg.player}" placeholder="Es. Marco"></div>
                    <div class="form-group"><label for="pg-class">Classe:</label><input type="text" id="pg-class" value="${isNew ? '' : pg.class}" placeholder="Es. Ranger"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label for="pg-race">Razza:</label><input type="text" id="pg-race" value="${isNew ? '' : pg.race}" placeholder="Es. Elfo Scuro"></div>
                    <div class="form-group"><label for="pg-level">Livello:</label><input type="number" id="pg-level" value="${isNew ? 1 : pg.level}" min="1" max="20"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label for="pg-alignment">Allineamento:</label><input type="text" id="pg-alignment" value="${isNew ? '' : pg.alignment}" placeholder="Es. Caotico Buono"></div>
                    <div class="form-group"><label for="pg-ac">Classe Armatura:</label><input type="number" id="pg-ac" value="${isNew ? 10 : pg.armorClass}" min="10"></div>
                </div>
                <div class="form-group">
                    <div class="form-section-header"><h4>Caratteristiche</h4></div>
                    <div class="stats-editor-grid">
                        <div class="form-group"><label for="pg-strength">FOR:</label><input type="number" id="pg-strength" value="${pg?.strength || 10}" min="1" max="20"></div>
                        <div class="form-group"><label for="pg-dexterity">DES:</label><input type="number" id="pg-dexterity" value="${pg?.dexterity || 10}" min="1" max="20"></div>
                        <div class="form-group"><label for="pg-constitution">COS:</label><input type="number" id="pg-constitution" value="${pg?.constitution || 10}" min="1" max="20"></div>
                        <div class="form-group"><label for="pg-intelligence">INT:</label><input type="number" id="pg-intelligence" value="${pg?.intelligence || 10}" min="1" max="20"></div>
                        <div class="form-group"><label for="pg-wisdom">SAG:</label><input type="number" id="pg-wisdom" value="${pg?.wisdom || 10}" min="1" max="20"></div>
                        <div class="form-group"><label for="pg-charisma">CAR:</label><input type="number" id="pg-charisma" value="${pg?.charisma || 10}" min="1" max="20"></div>
                    </div>
                </div>
                <div class="form-group"><label for="pg-personality">Personalità:</label><textarea id="pg-personality" rows="3" placeholder="Descrivi il carattere...">${isNew ? '' : pg.personality}</textarea></div>
                <div class="form-group"><label for="pg-ideals">Ideali:</label><textarea id="pg-ideals" rows="2" placeholder="Cosa crede...">${isNew ? '' : pg.ideals}</textarea></div>
                <div class="form-group"><label for="pg-bonds">Legami:</label><textarea id="pg-bonds" rows="2" placeholder="A chi è legato...">${isNew ? '' : pg.bonds}</textarea></div>
                <div class="form-group"><label for="pg-flaws">Difetti:</label><textarea id="pg-flaws" rows="2" placeholder="Quali sono i suoi difetti...">${isNew ? '' : pg.flaws}</textarea></div>
                <div class="form-group"><label for="pg-hp">Punti Ferita Max:</label><input type="number" id="pg-hp" value="${isNew ? '' : pg.hitPoints}" placeholder="Es. 35"></div>
                
                <div class="form-group"><div class="form-section-header"><h4>Inventario</h4><button id="add-inventory-btn" class="action-btn small">Aggiungi</button></div><ul id="pg-inventory-list" class="npc-inventory-list"></ul></div>
                <div class="form-group"><div class="form-section-header"><h4>Caratteristiche Speciali</h4><button id="add-feature-btn" class="action-btn small">Aggiungi</button></div><ul id="features-list" class="special-items-list"></ul></div>
                <div class="form-group"><div class="form-section-header"><h4>Incantesimi</h4></div><div class="spell-search"><input type="text" id="spell-search" class="list-search" placeholder="Cerca un incantesimo..."></div><ul id="pg-spell-list" class="npc-spell-list"></ul></div>
                
                <div class="editor-actions"><button id="save-pg-btn" class="action-btn">Salva PG</button></div>
            </div>
            `;
            setupEditorListeners();
            updateSpellList();
            updateInventoryList();
            updateFeaturesList();
        };

        const updateSpellList = () => { const list = containerElement.querySelector('#pg-spell-list'); if (!list) return; list.innerHTML = selectedSpells.map(spellName => `<li>${spellName} <button class="remove-item-btn" data-type="spell" data-name="${spellName}">✕</button></li>`).join(''); };
        const updateInventoryList = () => { const list = containerElement.querySelector('#pg-inventory-list'); if (!list) return; list.innerHTML = selectedInventory.map(item => `<li>${item} <button class="remove-item-btn" data-type="inventory" data-name="${item}">✕</button></li>`).join(''); };
        const updateFeaturesList = () => { const list = containerElement.querySelector('#features-list'); if (!list) return; list.innerHTML = selectedFeatures.map(item => `<li><strong>${item.name}:</strong> ${item.description} <button class="remove-item-btn" data-type="feature" data-name="${item.name}">✕</button></li>`).join(''); };

        // --- SETUP DEGLI EVENT LISTENER ---
        savedList.addEventListener('click', (e) => {
            const li = e.target.closest('.pg-list-item'); if (!li) return;
            const pgId = li.dataset.id; const pg = pgs.find(p => p.id === pgId);
            if (e.target.closest('.pg-item-actions')) { e.stopPropagation();
                if (e.target.classList.contains('edit-list-btn')) { if (pg) renderPgEditor(pg); }
                else if (e.target.classList.contains('delete-list-btn')) { if (pg && confirm(`Eliminare "${pg.name}"?`)) { pgs = pgs.filter(p => p.id !== pgId); savePgs(pgs); renderPgList(); if (editorContent.querySelector('.npc-stat-block')?.dataset.pgId === pgId) { editorContent.innerHTML = `<p style="text-align: center; color: #888; margin-top: 3rem;">PG eliminato.</p>`; } showToast(`PG "${pg.name}" eliminato.`, 'warning'); } }
                else if (e.target.classList.contains('add-to-combat-list-btn')) { if (pg) { addMonsterToCombat(createMonsterFromPg(pg)); showToast(`${pg.name} aggiunto al combattimento!`, 'success'); } }
            } else { if (pg) renderPgViewer(pg); }
        });

        editorContent.addEventListener('click', (e) => {
            if (e.target.classList.contains('flip-button')) {
                e.target.closest('.flip-card').classList.toggle('flipped');
            }
        });

        const setupEditorListeners = () => {
            const saveBtn = containerElement.querySelector('#save-pg-btn');
            const addInvBtn = containerElement.querySelector('#add-inventory-btn');
            const addFeatBtn = containerElement.querySelector('#add-feature-btn');
            const spellSearchInput = containerElement.querySelector('#spell-search');

            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    const name = editorContent.querySelector('#pg-name').value.trim();
                    if (!name) { showToast('Il nome del PG è obbligatorio.', 'error'); return; }
                    const now = Date.now();
                    const pgData = {
                        name, player: editorContent.querySelector('#pg-player').value.trim(), class: editorContent.querySelector('#pg-class').value.trim(),
                        race: editorContent.querySelector('#pg-race').value.trim(), level: parseInt(editorContent.querySelector('#pg-level').value) || 1,
                        alignment: editorContent.querySelector('#pg-alignment').value.trim(), armorClass: parseInt(editorContent.querySelector('#pg-ac').value) || 10,
                        hitPoints: editorContent.querySelector('#pg-hp').value.trim(), personality: editorContent.querySelector('#pg-personality').value.trim(),
                        ideals: editorContent.querySelector('#pg-ideals').value.trim(), bonds: editorContent.querySelector('#pg-bonds').value.trim(),
                        flaws: editorContent.querySelector('#pg-flaws').value.trim(), lastModified: now,
                        strength: parseInt(editorContent.querySelector('#pg-strength').value) || 10, dexterity: parseInt(editorContent.querySelector('#pg-dexterity').value) || 10,
                        constitution: parseInt(editorContent.querySelector('#pg-constitution').value) || 10, intelligence: parseInt(editorContent.querySelector('#pg-intelligence').value) || 10,
                        wisdom: parseInt(editorContent.querySelector('#pg-wisdom').value) || 10, charisma: parseInt(editorContent.querySelector('#pg-charisma').value) || 10,
                        spells: selectedSpells, inventory: selectedInventory, features: selectedFeatures,
                    };
                    if (currentEditingId) {
                        const index = pgs.findIndex(p => p.id === currentEditingId);
                        pgs[index] = { ...pgs[index], ...pgData };
                        savePgs(pgs);
                        renderPgViewer(pgs[index]);
                    } else {
                        const newPg = { id: now.toString(), ...pgData };
                        pgs.push(newPg);
                        savePgs(pgs);
                        renderPgViewer(newPg);
                    }
                    renderPgList();
                    showToast('PG salvato con successo!', 'success');
                });
            }
            if (addInvBtn) {
                addInvBtn.addEventListener('click', () => {
                    const itemName = prompt("Nome dell'oggetto:");
                    if (itemName && itemName.trim()) {
                        selectedInventory.push(itemName.trim());
                        updateInventoryList();
                    }
                });
            }
            if (addFeatBtn) {
                addFeatBtn.addEventListener('click', () => {
                    const featName = prompt("Nome della caratteristica:");
                    const featDesc = prompt("Descrizione:");
                    if (featName && featName.trim() && featDesc && featDesc.trim()) {
                        selectedFeatures.push({ name: featName.trim(), description: featDesc.trim() });
                        updateFeaturesList();
                    }
                });
            }
            if (spellSearchInput) {
                spellSearchInput.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const list = containerElement.querySelector('#pg-spell-list');
                    if (!list) return;
                    if (searchTerm.length < 2) { list.innerHTML = ''; return; }
                    const matchingSpells = Object.keys(spellDatabase).filter(spellName => spellName.toLowerCase().includes(searchTerm) && !selectedSpells.includes(spellName));
                    list.innerHTML = matchingSpells.map(spellName => `<li class="add-spell-item" data-spell="${spellName}">${spellName}</li>`).join('');
                });
            }
        };

        editorContent.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item-btn')) {
                const type = e.target.dataset.type;
                const name = e.target.dataset.name;
                if (type === 'spell') { selectedSpells = selectedSpells.filter(s => s !== name); updateSpellList(); }
                else if (type === 'inventory') { selectedInventory = selectedInventory.filter(i => i !== name); updateInventoryList(); }
                else if (type === 'feature') { selectedFeatures = selectedFeatures.filter(i => i.name !== name); updateFeaturesList(); }
            }
            if (e.target.classList.contains('add-spell-item')) {
                const spellName = e.target.dataset.spell;
                if (!selectedSpells.includes(spellName)) {
                    selectedSpells.push(spellName);
                    updateSpellList();
                    e.target.style.display = 'none';
                }
            }
        });

        newPgBtn.addEventListener('click', () => renderPgEditor());
        searchInput.addEventListener('input', (e) => renderPgList(e.target.value));

        // --- INIZIALIZZAZIONE ---
        if (pgs.length > 0) {
            const mostRecentPg = [...pgs].sort((a, b) => b.lastModified - a.lastModified)[0];
            renderPgViewer(mostRecentPg);
        }
        renderPgList();
    }
};

export default PgManager;