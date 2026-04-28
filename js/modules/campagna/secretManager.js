import { getCurrentCampaignId } from '../../../stateManager.js';
import { showToast } from '../../../utils/toast.js';
import { escapeHtml } from '../../../utils/htmlHelpers.js';
import { linkifyCampaignReferences } from '../../../utils/campaignLinker.js';
import { initAutocomplete } from '../../../utils/autocomplete.js';

// --- FUNZIONI PER LA GESTIONE DEL LOCAL STORAGE ---
function getStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) {
        console.warn("⚠️ [SecretManager] Tentativo di accedere al localStorage senza una campagna selezionata.");
        return null;
    }
    return `dungeonMasterToolSecrets_${campaignId}`;
}

function saveSecrets(secrets) {
    const storageKey = getStorageKey();
    if (!storageKey) return;
    try {
        localStorage.setItem(storageKey, JSON.stringify(secrets));
        console.log(`💾 [SecretManager] Segreti salvati per la campagna ${getCurrentCampaignId()}.`);
    } catch (error) {
        console.error("❌ [SecretManager] Impossibile salvare i segreti:", error);
    }
}

function loadSecrets() {
    const storageKey = getStorageKey();
    if (!storageKey) return [];
    try {
        const savedSecretsJSON = localStorage.getItem(storageKey);
        return savedSecretsJSON ? JSON.parse(savedSecretsJSON) : [];
    } catch (error) {
        console.error("❌ [SecretManager] Impossibile caricare i segreti:", error);
        return [];
    }
}

const SecretManager = {
    render(containerElement, itemIdToLoad = null) {
        containerElement.innerHTML = `
            <div class="world-module-container">
                <aside class="world-sidebar">
                    <div class="world-sidebar-header">
                        <h2>🔒 Segreti</h2>
                        <button id="new-secret-btn" class="world-btn world-btn-primary">+ Nuovo</button>
                    </div>
                    <div class="world-search-box">
                        <input type="text" id="secret-search" class="world-search-input" placeholder="Cerca un segreto...">
                    </div>
                    <ul id="saved-secrets-list" class="world-list"></ul>
                </aside>

                <main class="world-main" id="secret-main">
                    <div class="world-empty-state">
                        <div class="world-empty-icon">🔒</div>
                        <p>Seleziona un segreto per visualizzarlo o creane uno nuovo.</p>
                    </div>
                </main>
            </div>
        `;

        const savedList = containerElement.querySelector('#saved-secrets-list');
        const mainContent = containerElement.querySelector('#secret-main');
        const newSecretBtn = containerElement.querySelector('#new-secret-btn');
        const searchInput = containerElement.querySelector('#secret-search');

        let secrets = loadSecrets();
        let currentEditingId = null;

        // --- FUNZIONI DI RENDERING ---
        const renderSecretsList = () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredSecrets = secrets.filter(sec => 
                sec.title.toLowerCase().includes(searchTerm) ||
                sec.description.toLowerCase().includes(searchTerm) ||
                (sec.linkedTo && sec.linkedTo.toLowerCase().includes(searchTerm))
            );

            savedList.innerHTML = '';
            if (filteredSecrets.length === 0) {
                savedList.innerHTML = '<li class="world-empty-list">Nessun segreto salvato per questa campagna.</li>';
                return;
            }

            const sortedSecrets = [...filteredSecrets].sort((a, b) => {
                if (a.isRevealed !== b.isRevealed) {
                    return a.isRevealed ? 1 : -1;
                }
                return b.lastModified - a.lastModified;
            });

            sortedSecrets.forEach(secret => {
                const li = document.createElement('li');
                const statusClass = secret.isRevealed ? 'revealed' : 'unrevealed';
                li.className = `world-list-item ${statusClass}`;
                li.dataset.id = secret.id;
                
                const statusIcon = secret.isRevealed ? '👁️' : '🔒';
                const statusText = secret.isRevealed ? 'Rivelato' : 'Nascosto';
                
                li.innerHTML = `
                    <div class="world-item-header">
                        <span class="world-item-name">${statusIcon} ${escapeHtml(secret.title)}</span>
                        <span class="world-tag ${secret.isRevealed ? 'world-tag-inactive' : 'world-tag-warning'}">${statusText}</span>
                    </div>
                    <div class="world-item-info">
                        <p><em>${escapeHtml(secret.linkedTo || 'Nessun collegamento')}</em></p>
                        <p>${escapeHtml(secret.description.substring(0, 80))}${secret.description.length > 80 ? '...' : ''}</p>
                    </div>
                    <div class="world-item-actions">
                        <button class="world-action-btn edit-secret-btn">Modifica</button>
                        <button class="world-action-btn danger delete-secret-btn">Elimina</button>
                    </div>
                `;
                savedList.appendChild(li);
            });
        };

        const renderSecretViewer = (secret) => {
            const date = new Date(secret.lastModified).toLocaleString('it-IT');
            const statusText = secret.isRevealed ? 'Questo segreto è stato rivelato ai giocatori.' : 'Questo segreto è ancora sconosciuto ai giocatori.';
            const statusIcon = secret.isRevealed ? '👁️' : '🔒';
            
            // Applica linkifyCampaignReferences a tutti i campi di testo
            const linkedTitle = linkifyCampaignReferences(secret.title);
            const linkedLinkedTo = linkifyCampaignReferences(secret.linkedTo || 'Nessun collegamento');
            const linkedDescription = linkifyCampaignReferences(secret.description);

            mainContent.innerHTML = `
                <div class="world-viewer">
                    <div class="world-viewer-header">
                        <div>
                            <h2 class="world-viewer-title">${statusIcon} ${linkedTitle}</h2>
                        </div>
                    </div>
                    
                    <div class="world-info-grid">
                        <div class="world-info-item">
                            <div class="world-info-label">Stato</div>
                            <div class="world-info-value ${secret.isRevealed ? 'world-status-revealed' : 'world-status-unrevealed'}">
                                ${statusText}
                            </div>
                        </div>
                        <div class="world-info-item">
                            <div class="world-info-label">Collegato a</div>
                            <div class="world-info-value">${linkedLinkedTo}</div>
                        </div>
                    </div>

                    <div class="world-viewer-section">
                        <h4>Descrizione</h4>
                        <p>${linkedDescription.replace(/\n/g, '<br>')}</p>
                    </div>
                    
                    ${!secret.isRevealed ? `
                        <div class="world-editor-actions">
                            <button id="reveal-secret-btn" class="world-btn world-btn-primary">👁️ Rivela Segreto</button>
                        </div>
                    ` : ''}
                    
                    <div class="world-timestamp">
                        Ultima modifica: ${date}
                    </div>
                </div>
            `;
            
            // Listener per il pulsante "Rivela Segreto"
            const revealBtn = mainContent.querySelector('#reveal-secret-btn');
            if (revealBtn) {
                revealBtn.addEventListener('click', () => {
                    if (confirm('Sei sicuro di voler segnare questo segreto come "rivelato"?')) {
                        const secretIndex = secrets.findIndex(s => s.id === secret.id);
                        secrets[secretIndex].isRevealed = true;
                        secrets[secretIndex].lastModified = Date.now();
                        saveSecrets(secrets);
                        showToast(`Segreto "${secret.title}" rivelato!`, 'success');
                        renderSecretsList();
                        renderSecretViewer(secrets[secretIndex]);
                    }
                });
            }
        };

        const renderSecretEditor = (secret = null) => {
            const isNew = !secret;
            const title = isNew ? '' : (secret.title || '');
            const description = isNew ? '' : (secret.description || '');
            const linkedTo = isNew ? '' : (secret.linkedTo || '');
            const isRevealed = isNew ? false : secret.isRevealed;

            mainContent.innerHTML = `
                <div class="world-editor">
                    <div class="world-editor-header">
                        <h3 class="world-editor-title">${isNew ? '✨ Nuovo Segreto' : '✏️ Modifica Segreto'}</h3>
                    </div>
                    
                    <div class="world-form">
                        <div class="world-form-row">
                            <div class="world-form-group">
                                <label for="secret-title">Titolo del Segreto</label>
                                <input type="text" id="secret-title" value="${escapeHtml(title)}" placeholder="Es. La vera identità del Re, il traditore nel consiglio...">
                            </div>
                            <div class="world-form-group">
                                <label for="secret-linked-to">Collegato a (opzionale)</label>
                                <input type="text" id="secret-linked-to" value="${escapeHtml(linkedTo)}" placeholder="Es. Re Theron, la Gilda dei Ladri...">
                            </div>
                        </div>
                        
                        <div class="world-form-group">
                            <label for="secret-description">Descrizione del Segreto</label>
                            <textarea id="secret-description" rows="10" placeholder="Descrivi il segreto in dettaglio...">${escapeHtml(description)}</textarea>
                        </div>
                        
                        <div class="world-form-group">
                            <label class="world-checkbox-label">
                                <input type="checkbox" id="secret-is-revealed" ${isRevealed ? 'checked' : ''}>
                                Questo segreto è già stato rivelato ai giocatori
                            </label>
                        </div>
                    </div>
                    
                    <div class="world-editor-actions">
                        <button id="save-secret-btn" class="world-btn world-btn-primary">💾 Salva Segreto</button>
                        <button id="cancel-edit-btn" class="world-btn world-btn-secondary">Annulla</button>
                    </div>
                </div>
            `;

            setupEditorListeners();
        };

        // --- SETUP DEGLI EVENT LISTENER ---
        const setupMainListeners = () => {
            newSecretBtn.addEventListener('click', () => {
                currentEditingId = null;
                renderSecretEditor();
            });

            searchInput.addEventListener('input', () => renderSecretsList());

            savedList.addEventListener('click', (e) => {
                const li = e.target.closest('.world-list-item');
                if (!li) return;
                const id = li.dataset.id;

                if (e.target.classList.contains('edit-secret-btn')) {
                    const secretToEdit = secrets.find(s => s.id === id);
                    currentEditingId = id;
                    renderSecretEditor(secretToEdit);
                }
                if (e.target.classList.contains('delete-secret-btn')) {
                    const secretToDelete = secrets.find(s => s.id === id);
                    if (confirm(`Sei sicuro di voler eliminare il segreto "${secretToDelete.title}"?`)) {
                        secrets = secrets.filter(s => s.id !== id);
                        saveSecrets(secrets);
                        renderSecretsList();
                        if (currentEditingId === id) {
                            currentEditingId = null;
                            mainContent.innerHTML = `
                                <div class="world-empty-state">
                                    <div class="world-empty-icon">🔒</div>
                                    <p>Segreto eliminato.</p>
                                </div>
                            `;
                        }
                        showToast(`Segreto "${secretToDelete.title}" eliminato.`, 'warning');
                    }
                }
                if (!e.target.classList.contains('edit-secret-btn') && !e.target.classList.contains('delete-secret-btn')) {
                    const secretToView = secrets.find(s => s.id === id);
                    renderSecretViewer(secretToView);
                }
            });
        };

        const setupEditorListeners = () => {
            const titleInput = containerElement.querySelector('#secret-title');
            const linkedToInput = containerElement.querySelector('#secret-linked-to');
            const descriptionInput = containerElement.querySelector('#secret-description');
            const isRevealedInput = containerElement.querySelector('#secret-is-revealed');
            const saveBtn = containerElement.querySelector('#save-secret-btn');
            const cancelBtn = containerElement.querySelector('#cancel-edit-btn');

            // Inizializza l'autocompletamento su tutti i campi testuali
            if (titleInput) initAutocomplete(titleInput);
            if (linkedToInput) initAutocomplete(linkedToInput);
            if (descriptionInput) initAutocomplete(descriptionInput);

            cancelBtn.addEventListener('click', () => {
                const secret = secrets.find(s => s.id === currentEditingId);
                if (secret) renderSecretViewer(secret);
                else mainContent.innerHTML = `
                    <div class="world-empty-state">
                        <div class="world-empty-icon">🔒</div>
                        <p>Operazione annullata.</p>
                    </div>
                `;
            });

            saveBtn.addEventListener('click', () => {
                const title = titleInput.value.trim();
                const description = descriptionInput.value.trim();

                if (!title) {
                    showToast('Il titolo del segreto è obbligatorio.', 'error');
                    return;
                }
                if (!description) {
                    showToast('La descrizione del segreto non può essere vuota.', 'error');
                    return;
                }

                const now = Date.now();
                const secretData = {
                    title: title,
                    linkedTo: linkedToInput.value.trim(),
                    description: description,
                    isRevealed: isRevealedInput.checked,
                    lastModified: now,
                };

                let savedSecret;
                if (currentEditingId) {
                    const secretIndex = secrets.findIndex(s => s.id === currentEditingId);
                    secrets[secretIndex] = { ...secrets[secretIndex], ...secretData };
                    savedSecret = secrets[secretIndex];
                    showToast(`Segreto "${title}" aggiornato.`, 'success');
                } else {
                    const newSecret = {
                        id: now.toString(),
                        ...secretData,
                    };
                    secrets.push(newSecret);
                    savedSecret = newSecret;
                    showToast(`Segreto "${title}" creato.`, 'success');
                }

                saveSecrets(secrets);
                renderSecretsList();
                renderSecretViewer(savedSecret);
            });
        };

        if (itemIdToLoad) {
            const secretToLoad = secrets.find(s => s.id === itemIdToLoad);
            if (secretToLoad) {
                currentEditingId = itemIdToLoad;
                renderSecretEditor(secretToLoad);
            }
        } else {
            if (secrets.length > 0) {
                const unrevealedSecrets = secrets.filter(s => !s.isRevealed);
                const secretToShow = unrevealedSecrets.length > 0 
                    ? unrevealedSecrets.sort((a, b) => b.lastModified - a.lastModified)[0]
                    : secrets.sort((a, b) => b.lastModified - a.lastModified)[0];
                renderSecretViewer(secretToShow);
            }
        }

        renderSecretsList();
        setupMainListeners();
    }
};

export default SecretManager;
