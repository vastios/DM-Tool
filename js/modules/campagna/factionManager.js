import { getCurrentCampaignId } from '../../../stateManager.js';
import { showToast } from '../../../utils/toast.js';
import { escapeHtml } from '../../../utils/htmlHelpers.js';
import { linkifyCampaignReferences } from '../../../utils/campaignLinker.js';
import { initAutocomplete } from '../../../utils/autocomplete.js';

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
            <div class="world-module-container">
                <aside class="world-sidebar">
                    <div class="world-sidebar-header">
                        <h2>⚔️ Fazioni</h2>
                        <button id="new-faction-btn" class="world-btn world-btn-primary">+ Nuova</button>
                    </div>
                    <div class="world-search-box">
                        <input type="text" id="faction-search" class="world-search-input" placeholder="Cerca una fazione...">
                    </div>
                    <ul id="saved-factions-list" class="world-list"></ul>
                </aside>

                <main class="world-main" id="faction-main">
                    <div class="world-empty-state">
                        <div class="world-empty-icon">⚔️</div>
                        <p>Seleziona una fazione per visualizzarla o creane una nuova.</p>
                    </div>
                </main>
            </div>
        `;

        const savedList = containerElement.querySelector('#saved-factions-list');
        const mainContent = containerElement.querySelector('#faction-main');
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
                savedList.innerHTML = '<li class="world-empty-list">Nessuna fazione trovata.</li>';
                return;
            }

            [...filteredFactions].sort((a, b) => b.lastModified - a.lastModified).forEach(faction => {
                const li = document.createElement('li');
                const statusClass = faction.status === 'Defunct' ? 'faction-defunct' : 
                                   faction.status === 'Hidden' ? 'faction-hidden' : '';
                li.className = `world-list-item ${statusClass}`;
                li.dataset.id = faction.id;
                
                const statusIcon = faction.status === 'Hidden' ? '🕵️' : '';
                
                li.innerHTML = `
                    <div class="world-item-header">
                        <span class="world-item-name">${escapeHtml(faction.name)} ${statusIcon}</span>
                        <span class="world-tag world-tag-${faction.status === 'Active' ? 'active' : faction.status === 'Hidden' ? 'hidden' : 'inactive'}">
                            ${statusLabels[faction.status] || faction.status}
                        </span>
                    </div>
                    <div class="world-item-info">
                        <p><em>Leader: ${escapeHtml(faction.leader || 'Sconosciuto')}</em></p>
                    </div>
                    <div class="world-item-actions">
                        <button class="world-action-btn edit-faction-btn">Modifica</button>
                        <button class="world-action-btn danger delete-faction-btn">Elimina</button>
                    </div>
                `;
                savedList.appendChild(li);
            });
        };

        const renderFactionViewer = (faction) => {
            const date = new Date(faction.lastModified).toLocaleString('it-IT');
            const displayStatus = statusLabels[faction.status] || faction.status;
            const statusIcon = faction.status === 'Hidden' ? '🕵️' : '';

            // Applica linkifyCampaignReferences a tutti i campi di testo
            const linkedName = linkifyCampaignReferences(faction.name);
            const linkedLeader = linkifyCampaignReferences(faction.leader || '---');
            const linkedHeadquarters = linkifyCampaignReferences(faction.headquarters || '---');
            const linkedDescription = linkifyCampaignReferences(faction.description || 'Nessuna descrizione.');
            const linkedMembers = linkifyCampaignReferences(faction.members || '---');
            const linkedAllies = linkifyCampaignReferences(faction.allies || '---');
            const linkedEnemies = linkifyCampaignReferences(faction.enemies || '---');
            const linkedSecrets = linkifyCampaignReferences(faction.secrets || 'Nessun segreto.');

            mainContent.innerHTML = `
                <div class="faction-viewer">
                    <div class="faction-viewer-header">
                        <div>
                            <h2 class="faction-viewer-title">${linkedName} ${statusIcon}</h2>
                        </div>
                        <div class="world-viewer-actions">
                            <button class="world-btn world-btn-secondary edit-faction-btn" data-id="${faction.id}">✏️ Modifica</button>
                        </div>
                    </div>
                    
                    <div class="faction-details-grid">
                        <p><strong class="wiki-label">Stato:</strong> <span>${displayStatus}</span></p>
                        <p><strong class="wiki-label">Leader:</strong> <span>${linkedLeader}</span></p>
                        <p><strong class="wiki-label">Sede Operativa:</strong> <span>${linkedHeadquarters}</span></p>
                    </div>

                    <hr style="border: 0; border-top: 1px solid var(--world-border); margin: 16px 0;">

                    <div class="faction-content-section">
                        <p><strong class="wiki-label">Descrizione e Filosofia:</strong></p>
                        <p>${linkedDescription.replace(/\n/g, '<br>')}</p>
                    </div>

                    <div class="faction-content-section">
                        <p><strong class="wiki-label">Membri Noti:</strong></p>
                        <p>${linkedMembers.replace(/\n/g, '<br>')}</p>
                    </div>

                    <div class="faction-relations-grid">
                        <div class="faction-relation-column">
                            <h4>🤝 Alleati</h4>
                            <p>${linkedAllies.replace(/\n/g, '<br>')}</p>
                        </div>
                        <div class="faction-relation-column">
                            <h4>⚔️ Nemici</h4>
                            <p>${linkedEnemies.replace(/\n/g, '<br>')}</p>
                        </div>
                    </div>

                    <div class="faction-secrets-box">
                        <p><strong class="wiki-label">Segreti del DM:</strong></p>
                        <p>${linkedSecrets.replace(/\n/g, '<br>')}</p>
                    </div>
                    
                    <div class="world-timestamp">
                        Ultima modifica: ${date}
                    </div>
                </div>
            `;
        };

        const renderFactionEditor = (faction = null) => {
            const isNew = !faction;
            const name = isNew ? '' : (faction.name || '');
            const status = isNew ? 'Active' : (faction.status || 'Active');
            const description = isNew ? '' : (faction.description || '');
            const members = isNew ? '' : (faction.members || '');
            const allies = isNew ? '' : (faction.allies || '');
            const enemies = isNew ? '' : (faction.enemies || '');
            const secrets = isNew ? '' : (faction.secrets || '');
            const leader = isNew ? '' : (faction.leader || '');
            const headquarters = isNew ? '' : (faction.headquarters || '');

            mainContent.innerHTML = `
                <div class="faction-editor">
                    <div class="world-editor-header">
                        <h3 class="world-editor-title">${isNew ? '✨ Nuova Fazione' : '✏️ Modifica Fazione'}</h3>
                    </div>
                    
                    <div class="world-form">
                        <div class="world-form-row">
                            <div class="world-form-group">
                                <label for="faction-name">Nome della Fazione</label>
                                <input type="text" id="faction-name" value="${escapeHtml(name)}" placeholder="Es. Gilda dei Ladri, Ordine del Dragone...">
                            </div>
                            <div class="world-form-group">
                                <label for="faction-status">Stato</label>
                                <select id="faction-status">
                                    <option value="Active" ${status === 'Active' ? 'selected' : ''}>Attiva</option>
                                    <option value="Defunct" ${status === 'Defunct' ? 'selected' : ''}>Sciolta</option>
                                    <option value="Hidden" ${status === 'Hidden' ? 'selected' : ''}>Segreta</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="world-form-row">
                            <div class="world-form-group">
                                <label for="faction-leader">Leader</label>
                                <input type="text" id="faction-leader" value="${escapeHtml(leader)}" placeholder="Es. Re Theron, il Mago Supremo">
                            </div>
                            <div class="world-form-group">
                                <label for="faction-headquarters">Sede Operativa</label>
                                <input type="text" id="faction-headquarters" value="${escapeHtml(headquarters)}" placeholder="Es. Torre Grigia, città di Luskan">
                            </div>
                        </div>
                        
                        <div class="world-form-group">
                            <label for="faction-description">Descrizione e Filosofia</label>
                            <textarea id="faction-description" rows="5" placeholder="Descrivi la fazione, i suoi obiettivi, la sua filosofia...">${escapeHtml(description)}</textarea>
                        </div>
                        
                        <div class="world-form-group">
                            <label for="faction-members">Membri Noti</label>
                            <textarea id="faction-members" rows="3" placeholder="Elenca i membri noti della fazione...">${escapeHtml(members)}</textarea>
                        </div>
                        
                        <div class="world-form-row">
                            <div class="world-form-group">
                                <label for="faction-allies">Alleati</label>
                                <textarea id="faction-allies" rows="2" placeholder="Fazioni alleate...">${escapeHtml(allies)}</textarea>
                            </div>
                            <div class="world-form-group">
                                <label for="faction-enemies">Nemici</label>
                                <textarea id="faction-enemies" rows="2" placeholder="Fazioni nemiche...">${escapeHtml(enemies)}</textarea>
                            </div>
                        </div>
                        
                        <div class="world-form-group">
                            <label for="faction-secrets">Segreti DM</label>
                            <textarea id="faction-secrets" rows="3" placeholder="Informazioni segrete note solo al DM...">${escapeHtml(secrets)}</textarea>
                        </div>
                    </div>
                    
                    <div class="world-editor-actions">
                        <button id="save-faction-btn" class="world-btn world-btn-primary">💾 Salva Fazione</button>
                        <button id="cancel-edit-btn" class="world-btn world-btn-secondary">Annulla</button>
                    </div>
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
                const li = e.target.closest('.world-list-item');
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
                        mainContent.innerHTML = `
                            <div class="world-empty-state">
                                <div class="world-empty-icon">⚔️</div>
                                <p>Fazione eliminata.</p>
                            </div>
                        `;
                    }
                } else {
                    renderFactionViewer(faction);
                }
            });
            
            // Edit button in viewer
            mainContent.addEventListener('click', (e) => {
                if (e.target.classList.contains('edit-faction-btn')) {
                    const id = e.target.dataset.id;
                    const faction = factions.find(f => f.id === id);
                    if (faction) {
                        currentEditingId = id;
                        renderFactionEditor(faction);
                    }
                }
            });
        };

        const setupEditorListeners = () => {
            const saveBtn = containerElement.querySelector('#save-faction-btn');
            const cancelBtn = containerElement.querySelector('#cancel-edit-btn');

            // Inizializza l'autocompletamento su tutti i campi testuali
            initAutocomplete(containerElement.querySelector('#faction-name'));
            initAutocomplete(containerElement.querySelector('#faction-leader'));
            initAutocomplete(containerElement.querySelector('#faction-headquarters'));
            initAutocomplete(containerElement.querySelector('#faction-description'));
            initAutocomplete(containerElement.querySelector('#faction-members'));
            initAutocomplete(containerElement.querySelector('#faction-allies'));
            initAutocomplete(containerElement.querySelector('#faction-enemies'));
            initAutocomplete(containerElement.querySelector('#faction-secrets'));
            
            cancelBtn.addEventListener('click', () => {
                const faction = factions.find(f => f.id === currentEditingId);
                if(faction) renderFactionViewer(faction);
                else mainContent.innerHTML = `
                    <div class="world-empty-state">
                        <div class="world-empty-icon">⚔️</div>
                        <p>Operazione annullata.</p>
                    </div>
                `;
            });

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
                    leader: containerElement.querySelector('#faction-leader').value.trim(),
                    headquarters: containerElement.querySelector('#faction-headquarters').value.trim(),
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
