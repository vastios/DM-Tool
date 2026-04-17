import { getCurrentCampaignId } from '../../../stateManager.js';
import { showToast } from '../../../utils/toast.js';
import { escapeHtml } from '../../../utils/htmlHelpers.js';
import { linkifyCampaignReferences } from '../../../utils/campaignLinker.js';
import { initAutocomplete } from '../../../utils/autocomplete.js';

// --- FUNZIONI PER LA GESTIONE DEL LOCAL STORAGE ---
function getStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) {
        console.warn("⚠️ [LocationManager] Tentativo di accedere al localStorage senza una campagna selezionata.");
        return null;
    }
    return `dungeonMasterToolLocations_${campaignId}`;
}

function saveLocations(locations) {
    const storageKey = getStorageKey();
    if (!storageKey) return;
    try {
        localStorage.setItem(storageKey, JSON.stringify(locations));
        console.log(`💾 [LocationManager] Luoghi salvati per la campagna ${getCurrentCampaignId()}.`);
    } catch (error) {
        console.error("❌ [LocationManager] Impossibile salvare i luoghi:", error);
    }
}

function loadLocations() {
    const storageKey = getStorageKey();
    if (!storageKey) return [];
    try {
        const savedLocationsJSON = localStorage.getItem(storageKey);
        return savedLocationsJSON ? JSON.parse(savedLocationsJSON) : [];
    } catch (error) {
        console.error("❌ [LocationManager] Impossibile caricare i luoghi:", error);
        return [];
    }
}

const LocationManager = {
    render(containerElement, itemIdToLoad = null) {
        containerElement.innerHTML = `
            <div class="session-notes-container">
                <!-- Pannello di Sinistra: Lista dei Luoghi -->
                <div class="notes-list-panel">
                    <div class="panel-header">
                        <h2>Luoghi della Campagna</h2>
                        <button id="new-location-btn" class="action-btn">Nuovo Luogo</button>
                    </div>
                    <input type="text" id="location-search" class="list-search" placeholder="Cerca un luogo...">
                    <ul id="saved-locations-list" class="saved-notes-list"></ul>
                </div>

                <!-- Pannello di Destra: Visualizzatore/Editor del Luogo -->
                <div class="note-editor-panel">
                    <div id="editor-content">
                        <p style="text-align: center; color: #888; margin-top: 3rem;">Seleziona un luogo esistente o creane uno nuovo per iniziare.</p>
                    </div>
                </div>
            </div>
        `;

        const savedList = containerElement.querySelector('#saved-locations-list');
        const editorContent = containerElement.querySelector('#editor-content');
        const newLocationBtn = containerElement.querySelector('#new-location-btn');
        const searchInput = containerElement.querySelector('#location-search');

        let locations = loadLocations();
        let currentEditingId = null;

        // --- FUNZIONI DI RENDERING ---
        const renderLocationsList = () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredLocations = locations.filter(loc => 
                loc.name.toLowerCase().includes(searchTerm) ||
                loc.type.toLowerCase().includes(searchTerm) ||
                (loc.position && loc.position.toLowerCase().includes(searchTerm)) ||
                loc.description.toLowerCase().includes(searchTerm)
            );

            savedList.innerHTML = '';
            if (filteredLocations.length === 0) {
                savedList.innerHTML = '<li class="empty-list">Nessun luogo salvato per questa campagna.</li>';
                return;
            }

            const sortedLocations = [...filteredLocations].sort((a, b) => b.lastModified - a.lastModified);

            sortedLocations.forEach(location => {
                const li = document.createElement('li');
                li.className = 'binder-list-item';
                li.dataset.id = location.id;
                li.dataset.tag = location.type || 'Altro';
                li.dataset.tagLabel = location.type || 'Altro';

                const date = new Date(location.lastModified).toLocaleString('it-IT');
                
                li.innerHTML = `
                    <div class="binder-content">
                        <div class="note-item-info">
                            <h3>${escapeHtml(location.name)}</h3>
                            <p><em>Posizione: ${escapeHtml(location.position || 'Sconosciuta')}</em></p>
                            <p>${escapeHtml(location.description.substring(0, 100))}${location.description.length > 100 ? '...' : ''}</p>
                            <small>Ultima modifica: ${date}</small>
                        </div>
                        <div class="note-item-actions">
                            <button class="edit-location-btn">Modifica</button>
                            <button class="delete-location-btn">Elimina</button>
                        </div>
                    </div>
                `;
                savedList.appendChild(li);
            });
        };

        const renderLocationViewer = (location) => {
            const date = new Date(location.lastModified).toLocaleString('it-IT');
            
            const linkedDescription = linkifyCampaignReferences(location.description || 'Nessuna descrizione presente.');
            const linkedInhabitants = linkifyCampaignReferences(location.inhabitants || 'Nessuno specificato');
            const linkedPointsofinterest = linkifyCampaignReferences(location.pointsofinterest || 'Nessuno specificato');
            const linkedSecrets = linkifyCampaignReferences(location.secrets || 'Nessun segreto noto');
            const linkedPosition = linkifyCampaignReferences(location.position || 'Sconosciuta');

            editorContent.innerHTML = `
                <div class="note-viewer">
                    <div class="note-viewer-header">
                        <h2 style="color: #f0ad4e;">${escapeHtml(location.name)}</h2>
                    </div>
                    <p><strong style="color: #f0ad4e;">Tipo:</strong> <span style="color: #ffffff;">${escapeHtml(location.type)}</span></p>
                    <p><strong style="color: #f0ad4e;">Posizione:</strong> <span style="color: #ffffff;">${linkedPosition}</span></p>
                    <p><strong style="color: #f0ad4e;">Descrizione:</strong></p>
                    <p class="note-viewer-content" style="color: #ffffff;">${linkedDescription.replace(/\n/g, '<br>')}</p>
                    <p><strong style="color: #f0ad4e;">Abitanti:</strong> <span style="color: #ffffff;">${linkedInhabitants}</span></p>
                    <p><strong style="color: #f0ad4e;">Punti di Interesse:</strong> <span style="color: #ffffff;">${linkedPointsofinterest}</span></p>
                    <p><strong style="color: #f0ad4e;">Segreti:</strong></p>
                    <p class="note-viewer-content secret-note" style="color: #ffffff;">${linkedSecrets.replace(/\n/g, '<br>')}</p>
                    <small class="note-viewer-date" style="color: #aaaaaa;">Ultima modifica: ${date}</small>
                </div>
            `;
        };

        const renderLocationEditor = (location = null) => {
            const isNew = !location;
            const name = isNew ? '' : (location.name || '');
            const type = isNew ? 'Città' : (location.type || 'Città');
            const position = isNew ? '' : (location.position || '');
            const description = isNew ? '' : (location.description || '');
            const inhabitants = isNew ? '' : (location.inhabitants || '');
            const pointsofinterest = isNew ? '' : (location.pointsofinterest || '');
            const secrets = isNew ? '' : (location.secrets || '');

            editorContent.innerHTML = `
                <div class="editor-form">
                    <div class="form-group">
                        <label for="location-name">Nome del Luogo:</label>
                        <input type="text" id="location-name" value="${escapeHtml(name)}" placeholder="Es. Città di Waterdeep, Foresta Sussurrante">
                    </div>
                    <div class="form-group">
                        <label for="location-type">Tipo di Luogo:</label>
                        <select id="location-type">
                            <option value="Città" ${type === 'Città' ? 'selected' : ''}>Città</option>
                            <option value="Villaggio" ${type === 'Villaggio' ? 'selected' : ''}>Villaggio</option>
                            <option value="Dungeon" ${type === 'Dungeon' ? 'selected' : ''}>Dungeon</option>
                            <option value="Regione" ${type === 'Regione' ? 'selected' : ''}>Regione</option>
                            <option value="Edificio" ${type === 'Edificio' ? 'selected' : ''}>Edificio (Taverna, Tempio, etc.)</option>
                            <option value="Foresta" ${type === 'Foresta' ? 'selected' : ''}>Foresta</option>
                            <option value="Montagna" ${type === 'Montagna' ? 'selected' : ''}>Montagna</option>
                            <option value="Altro" ${type === 'Altro' ? 'selected' : ''}>Altro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="location-position">Posizione:</label>
                        <input type="text" id="location-position" value="${escapeHtml(position)}" placeholder="Es. Marche Occidentali, Sotto Waterdeep">
                    </div>
                    <div class="form-group">
                        <label for="location-description">Descrizione:</label>
                        <textarea id="location-description" rows="8" placeholder="Descrivi la storia, l'aspetto e l'atmosfera del luogo...">${escapeHtml(description)}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="location-inhabitants">Abitanti:</label>
                        <input type="text" id="location-inhabitants" value="${escapeHtml(inhabitants)}" placeholder="Es. Umani, Elfi, un Drago anziano...">
                    </div>
                    <div class="form-group">
                        <label for="location-pointsofinterest">Punti di Interesse:</label>
                        <input type="text" id="location-pointsofinterest" value="${escapeHtml(pointsofinterest)}" placeholder="Es. La taverna "Al Brado Coniglio", il pozzo del villaggio, la statua del fondatore...">
                    </div>
                    <div class="form-group">
                        <label for="location-secrets">Segreti del DM:</label>
                        <textarea id="location-secrets" rows="4" placeholder="Informazioni nascoste che solo il DM conosce...">${escapeHtml(secrets)}</textarea>
                    </div>
                </div>
                <div class="editor-actions">
                    <button id="save-location-btn" class="action-btn">Salva Luogo</button>
                </div>
            `;

            setupEditorListeners();
        };

        // --- SETUP DEGLI EVENT LISTENER ---
        const setupMainListeners = () => {
            newLocationBtn.addEventListener('click', () => {
                currentEditingId = null;
                renderLocationEditor();
            });

            searchInput.addEventListener('input', () => renderLocationsList());

            savedList.addEventListener('click', (e) => {
                const li = e.target.closest('.note-list-item');
                if (!li) return;
                const id = li.dataset.id;

                if (e.target.classList.contains('edit-location-btn')) {
                    const locationToEdit = locations.find(l => l.id === id);
                    currentEditingId = id;
                    renderLocationEditor(locationToEdit);
                }
                if (e.target.classList.contains('delete-location-btn')) {
                    const locationToDelete = locations.find(l => l.id === id);
                    if (confirm(`Sei sicuro di voler eliminare il luogo "${locationToDelete.name}"?`)) {
                        locations = locations.filter(l => l.id !== id);
                        saveLocations(locations);
                        renderLocationsList();
                        if (currentEditingId === id) {
                            currentEditingId = null;
                            editorContent.innerHTML = `<p style="text-align: center; color: #888; margin-top: 3rem;">Luogo eliminato.</p>`;
                        }
                        showToast(`Luogo "${locationToDelete.name}" eliminato.`, 'warning');
                    }
                }
                if (!e.target.classList.contains('edit-location-btn') && !e.target.classList.contains('delete-location-btn')) {
                    const locationToView = locations.find(l => l.id === id);
                    renderLocationViewer(locationToView);
                }
            });
        };

        const setupEditorListeners = () => {
            const nameInput = containerElement.querySelector('#location-name');
            const typeInput = containerElement.querySelector('#location-type');
            const positionInput = containerElement.querySelector('#location-position');
            const descriptionInput = containerElement.querySelector('#location-description');
            const inhabitantsInput = containerElement.querySelector('#location-inhabitants');
            const pointsofinterestInput = containerElement.querySelector('#location-pointsofinterest');
            const secretsInput = containerElement.querySelector('#location-secrets');
            const saveBtn = containerElement.querySelector('#save-location-btn');

            if (nameInput) initAutocomplete(nameInput);
            if (positionInput) initAutocomplete(positionInput);
            if (descriptionInput) initAutocomplete(descriptionInput);
            if (inhabitantsInput) initAutocomplete(inhabitantsInput);
            if (pointsofinterestInput) initAutocomplete(pointsofinterestInput);
            if (secretsInput) initAutocomplete(secretsInput);

            saveBtn.addEventListener('click', () => {
                const name = nameInput.value.trim();
                const description = descriptionInput.value.trim();

                if (!name) {
                    showToast('Il nome del luogo è obbligatorio.', 'error');
                    return;
                }
                if (!description) {
                    showToast('La descrizione del luogo non può essere vuota.', 'error');
                    return;
                }

                const now = Date.now();
                const locationData = {
                    name: name,
                    type: typeInput.value,
                    position: positionInput.value.trim(),
                    description: description,
                    inhabitants: inhabitantsInput.value.trim(),
                    pointsofinterest: pointsofinterestInput.value.trim(),
                    secrets: secretsInput.value.trim(),
                    lastModified: now,
                };

                let savedLocation;
                if (currentEditingId) {
                    const locationIndex = locations.findIndex(l => l.id === currentEditingId);
                    locations[locationIndex] = { ...locations[locationIndex], ...locationData };
                    savedLocation = locations[locationIndex];
                    showToast(`Luogo "${name}" aggiornato.`, 'success');
                } else {
                    const newLocation = {
                        id: now.toString(),
                        ...locationData,
                    };
                    locations.push(newLocation);
                    savedLocation = newLocation;
                    showToast(`Luogo "${name}" creato.`, 'success');
                }

                saveLocations(locations);
                renderLocationsList();
                renderLocationViewer(savedLocation);
            });
        };

        if (itemIdToLoad) {
            const locationToLoad = locations.find(l => l.id === itemIdToLoad);
            if (locationToLoad) {
                currentEditingId = itemIdToLoad;
                renderLocationEditor(locationToLoad);
            }
        } else {
            if (locations.length > 0) {
                const mostRecentLocation = [...locations].sort((a, b) => b.lastModified - a.lastModified)[0];
                renderLocationViewer(mostRecentLocation);
            }
        }

        renderLocationsList();
        setupMainListeners();
    }
};

export default LocationManager;