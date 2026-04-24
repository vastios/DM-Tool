import { getCurrentCampaignId } from '../../../stateManager.js';
import { showToast } from '../../../utils/toast.js';
import { escapeHtml } from '../../../utils/htmlHelpers.js';
import { linkifyCampaignReferences } from '../../../utils/campaignLinker.js';
import { initAutocomplete } from '../../../utils/autocomplete.js'; // <<< MODIFICA 1: Import aggiunto

// Mappa per la traduzione degli stati
const statusLabels = {
    'Active': 'Attiva',
    'Defunct': 'Sciolta',
    'Hidden': 'Segreta'
};

// --- FUNZIONI PER LA GESTIONE DEL LOCAL STORAGE ---
function getStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return null;
    return `dungeonMasterToolFactions_${campaignId}`;
}

function saveFactions(factions) {
    const storageKey = getStorageKey();
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(factions));
}

function loadFactions() {
    const storageKey = getStorageKey();
    if (!storageKey) return [];
    const savedFactionsJSON = localStorage.getItem(storageKey);
    return savedFactionsJSON ? JSON.parse(savedFactionsJSON) : [];
}

const FactionManager = {
    render(containerElement) {
        containerElement.innerHTML = `
            <div class="session-notes-container">
                <div class="notes-list-panel">
                    <div class="panel-header">
                        <h2>Fazioni della Campagna</h2>
                        <button id="new-faction-btn" class="action-btn">Nuova Fazione</button>
                    </div>
                    <input type="text" id="faction-search" class="list-search" placeholder="Cerca una fazione...">
                    <ul id="saved-factions-list" class="saved-notes-list"></ul>
                </div>

                <div class="note-editor-panel">
                    <div id="editor-content">
                        <p style="text-align: center; color: #888; margin-top: 3rem;">Seleziona una fazione per visualizzarla o creane una nuova.</p>
                    </div>
                </div>
            </div>
        `;

        const savedList = containerElement.querySelector('#saved-factions-list');
        const editorContent = containerElement.querySelector('#editor-content');
        const newFactionBtn = containerElement.querySelector('#new-faction-btn');
        const searchInput = containerElement.querySelector('#faction-search');

        let factions = loadFactions();
        let currentEditingId = null;

        const renderFactionsList = () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredFactions = factions.filter(faction => 
                faction.name.toLowerCase().includes(searchTerm)
            );

            savedList.innerHTML = '';
            if (filteredFactions.length === 0) {
                savedList.innerHTML = '<li class="empty-list">Nessuna fazione trovata.</li>';
                return;
            }

            [...filteredFactions].sort((a, b) => b.lastModified - a.lastModified).forEach(faction => {
                const li = document.createElement('li');
                li.className = `note-list-item ${faction.status === 'Defunct' ? 'defunct-faction' : ''}`;
                li.dataset.id = faction.id;
                
                li.innerHTML = `
                    <div class="note-item-info">
                        <h3>${escapeHtml(faction.name)} ${faction.status === 'Hidden' ? '🕵️' : ''}</h3>
                        <p><em>Leader: ${escapeHtml(faction.leader || 'Sconosciuto')}</em></p>
                    </div>
                    <div class="note-item-actions">
                        <button class="edit-faction-btn">Modifica</button>
                        <button class="delete-faction-btn">Elimina</button>
                    </div>
                `;
                savedList.appendChild(li);
            });
        };

        const renderFactionViewer = (faction) => {
            const date = new Date(faction.lastModified).toLocaleString('it-IT');
            const displayStatus = statusLabels[faction.status] || faction.status;

            // Applica linkifyCampaignReferences a tutti i campi di testo
            const linkedName = linkifyCampaignReferences(faction.name);
            const linkedLeader = linkifyCampaignReferences(faction.leader || '---');
            const linkedHeadquarters = linkifyCampaignReferences(faction.headquarters || '---');
            const linkedDescription = linkifyCampaignReferences(faction.description || 'Nessuna descrizione.');
            const linkedMembers = linkifyCampaignReferences(faction.members || '---');
            const linkedAllies = linkifyCampaignReferences(faction.allies || '---');
            const linkedEnemies = linkifyCampaignReferences(faction.enemies || '---');
            const linkedSecrets = linkifyCampaignReferences(faction.secrets || 'Nessun segreto.');

            editorContent.innerHTML = `
                <div class="note-viewer wiki-detail-panel" style="color: #000;">
                    <div class="note-viewer-header" style="border-bottom: 2px solid #742307; margin-bottom: 20px; padding-bottom: 10px;">
                        <h2 style="margin: 0; color: #401101;">${linkedName} ${faction.status === 'Hidden' ? '🕵️' : ''}</h2>
                    </div>
                    
                    <div class="faction-details-grid" style="display: grid; gap: 10px;">
                        <p><strong class="wiki-label" style="color: #f0ad4e;">Stato:</strong> <span style="color: #000000 !important; font-weight: 500;">${displayStatus}</span></p>
                        <p><strong class="wiki-label" style="color: #f0ad4e;">Leader:</strong> <span style="color: #000000 !important; font-weight: 500;">${linkedLeader}</span></p>
                        <p><strong class="wiki-label" style="color: #f0ad4e;">Sede Operativa:</strong> <span style="color: #000000 !important; font-weight: 500;">${linkedHeadquarters}</span></p>
                    </div>

                    <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;">

                    <div class="content-section">
                        <p><strong class="wiki-label" style="color: #f0ad4e;">Descrizione e Filosofia:</strong></p>
                        <div class="npc-narrative-content" style="color: #000000 !important;">
                            ${linkedDescription.replace(/\n/g, '<br>')}
                        </div>
                    </div>

                    <div class="content-section" style="margin-top: 15px;">
                        <p><strong class="wiki-label" style="color: #f0ad4e;">Membri Noti:</strong></p>
                        <div style="color: #000000 !important;">${linkedMembers.replace(/\n/g, '<br>')}</div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                        <div>
                            <p><strong class="wiki-label" style="color: #f0ad4e;">Alleati:</strong></p>
                            <div style="color: #000000 !important;">${linkedAllies.replace(/\n/g, '<br>')}</div>
                        </div>
                        <div>
                            <p><strong class="wiki-label" style="color: #f0ad4e;">Nemici:</strong></p>
                            <div style="color: #000000 !important;">${linkedEnemies.replace(/\n/g, '<br>')}</div>
                        </div>
                    </div>

                    <div class="unrevealed-status" style="margin-top: 30px; padding: 15px; border: 1px dashed #742307; background: rgba(116, 35, 7, 0.05);">
                        <p><strong class="wiki-label" style="color: #f0ad4e;">Segreti del DM:</strong></p>
                        <div style="color: #000000 !important;">
                            ${linkedSecrets.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    
                    <small style="display: block; margin-top: 20px; color: #666; font-style: italic;">
                        Ultima modifica: ${date}
                    </small>
                </div>
            `;
        };

        const renderFactionEditor = (faction = null) => {
            const isNew = !faction;
            // --- MODIFICA 2: Aggiunto fallback a stringa vuota e nuovi campi ---
            const name = isNew ? '' : (faction.name || '');
            const status = isNew ? 'Active' : (faction.status || 'Active');
            const description = isNew ? '' : (faction.description || '');
            const members = isNew ? '' : (faction.members || '');
            const allies = isNew ? '' : (faction.allies || '');
            const enemies = isNew ? '' : (faction.enemies || '');
            const secrets = isNew ? '' : (faction.secrets || '');
            const leader = isNew ? '' : (faction.leader || ''); // Nuovo campo
            const headquarters = isNew ? '' : (faction.headquarters || ''); // Nuovo campo

            editorContent.innerHTML = `
                <div class="editor-form">
                    <div class="form-group">
                        <label for="faction-name">Nome della Fazione:</label>
                        <input type="text" id="faction-name" value="${escapeHtml(name)}">
                    </div>
                    <div class="form-group">
                        <label for="faction-status">Stato:</label>
                        <select id="faction-status">
                            <option value="Active" ${(isNew || faction.status === 'Active') ? 'selected' : ''}>Attiva</option>
                            <option value="Defunct" ${(!isNew && faction.status === 'Defunct') ? 'selected' : ''}>Sciolta</option>
                            <option value="Hidden" ${(!isNew && faction.status === 'Hidden') ? 'selected' : ''}>Segreta</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="faction-leader">Leader:</label> <!-- Nuovo campo -->
                        <input type="text" id="faction-leader" value="${escapeHtml(leader)}" placeholder="Es. Re Theron, il Mago Supremo">
                    </div>
                    <div class="form-group">
                        <label for="faction-headquarters">Sede Operativa:</label> <!-- Nuovo campo -->
                        <input type="text" id="faction-headquarters" value="${escapeHtml(headquarters)}" placeholder="Es. Torre Grigia, la città segreta di Luskan">
                    </div>
                    <div class="form-group">
                        <label for="faction-description">Descrizione:</label>
                        <textarea id="faction-description" rows="5">${escapeHtml(description)}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="faction-members">Membri Noti:</label>
                        <textarea id="faction-members" rows="3">${escapeHtml(members)}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="faction-allies">Alleati:</label>
                        <textarea id="faction-allies" rows="2">${escapeHtml(allies)}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="faction-enemies">Nemici:</label>
                        <textarea id="faction-enemies" rows="2">${escapeHtml(enemies)}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="faction-secrets">Segreti DM:</label>
                        <textarea id="faction-secrets" rows="3">${escapeHtml(secrets)}</textarea>
                    </div>
                </div>
                <div class="editor-actions">
                    <button id="save-faction-btn" class="action-btn">Salva Fazione</button>
                    <button id="cancel-edit-btn" class="action-btn secondary">Annulla</button>
                </div>
            `;

            setupEditorListeners();
        };

        const setupMainListeners = () => {
            newFactionBtn.addEventListener('click', () => {
                currentEditingId = null;
                renderFactionEditor();
            });

            searchInput.addEventListener('input', () => renderFactionsList());

            savedList.addEventListener('click', (e) => {
                const li = e.target.closest('.note-list-item');
                if (!li) return;
                const id = li.dataset.id;
                const faction = factions.find(f => f.id === id);

                if (e.target.classList.contains('edit-faction-btn')) {
                    currentEditingId = id;
                    renderFactionEditor(faction);
                } else if (e.target.classList.contains('delete-faction-btn')) {
                    if (confirm(`Eliminare "${faction.name}"?`)) {
                        factions = factions.filter(f => f.id !== id);
                        saveFactions(factions);
                        renderFactionsList();
                        editorContent.innerHTML = '<p style="text-align: center; color: #888; margin-top: 3rem;">Seleziona una fazione.</p>';
                    }
                } else {
                    renderFactionViewer(faction);
                }
            });
        };

        const setupEditorListeners = () => {
            const saveBtn = containerElement.querySelector('#save-faction-btn');
            const cancelBtn = containerElement.querySelector('#cancel-edit-btn');

            // --- NUOVO: Inizializza l'autocompletamento su tutti i campi testuali ---
            initAutocomplete(containerElement.querySelector('#faction-name'));
            initAutocomplete(containerElement.querySelector('#faction-leader'));
            initAutocomplete(containerElement.querySelector('#faction-headquarters'));
            initAutocomplete(containerElement.querySelector('#faction-description'));
            initAutocomplete(containerElement.querySelector('#faction-members'));
            initAutocomplete(containerElement.querySelector('#faction-allies'));
            initAutocomplete(containerElement.querySelector('#faction-enemies'));
            initAutocomplete(containerElement.querySelector('#faction-secrets'));
            
            containerElement.querySelector('#cancel-edit-btn').onclick = () => {
                const faction = factions.find(f => f.id === currentEditingId);
                if(faction) renderFactionViewer(faction);
                else editorContent.innerHTML = `<p style="text-align: center; color: #888; margin-top: 3rem;">Operazione annullata.</p>`;
            };

            saveBtn.addEventListener('click', () => {
                const name = containerElement.querySelector('#faction-name').value.trim();
                if (!name) return showToast('Nome obbligatorio', 'error');

                const factionData = {
                    name,
                    status: containerElement.querySelector('#faction-status').value,
                    description: containerElement.querySelector('#faction-description').value.trim(),
                    members: containerElement.querySelector('#faction-members').value.trim(),
                    allies: containerElement.querySelector('#faction-allies').value.trim(),
                    enemies: containerElement.querySelector('#faction-enemies').value.trim(),
                    secrets: containerElement.querySelector('#faction-secrets').value.trim(),
                    leader: containerElement.querySelector('#faction-leader').value.trim(), // Nuovo campo
                    headquarters: containerElement.querySelector('#faction-headquarters').value.trim(), // Nuovo campo
                    lastModified: Date.now()
                };

                if (currentEditingId) {
                    const idx = factions.findIndex(f => f.id === currentEditingId);
                    factions[idx] = { ...factions[idx], ...factionData };
                } else {
                    factions.push({ id: Date.now().toString(), ...factionData });
                }

                saveFactions(factions);
                renderFactionsList();
                renderFactionViewer(factions.find(f => f.name === name));
                showToast('Fazione salvata!', 'success');
            });
        };

        if (factions.length > 0) renderFactionViewer([...factions].sort((a,b) => b.lastModified - a.lastModified)[0]);
        renderFactionsList();
        setupMainListeners();
    }
};

export default FactionManager;