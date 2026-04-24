// js/modules/campagna/sessionNotes.js

import { getCurrentCampaignId } from '../../../stateManager.js';
import { showToast } from '../../../utils/toast.js';
import { linkifyCampaignReferences } from '../../../utils/campaignLinker.js';
import { initAutocomplete } from '../../../utils/autocomplete.js';
import { escapeHtml } from '../../../utils/htmlHelpers.js';

// --- FUNZIONI PER LA GESTIONE DEL LOCAL STORAGE DELLE NOTE ---

function getStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) {
        console.warn("⚠️ [SessionNotes] Tentativo di accedere al localStorage senza una campagna selezionata.");
        return null;
    }
    return `dungeonMasterToolSessionNotes_${campaignId}`;
}

// RECUPERO CAPITOLI PER IL COLLEGAMENTO
function getChapters() {
    const campaignId = getCurrentCampaignId();
    return JSON.parse(localStorage.getItem(`dungeonMasterToolChapters_${campaignId}`) || '[]');
}

function saveNotes(notes) {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    try {
        localStorage.setItem(storageKey, JSON.stringify(notes));
        console.log(`💾 [SessionNotes] Note salvate per la campagna ${getCurrentCampaignId()}.`);
        // Lancia un evento per notificare gli altri moduli che i dati sono cambiati
        document.dispatchEvent(new CustomEvent('sessionDataChanged', { detail: { campaignId: getCurrentCampaignId() } }));
    } catch (error) {
        console.error("❌ [SessionNotes] Impossibile salvare le note:", error);
    }
}

function loadNotes() {
    const storageKey = getStorageKey();
    if (!storageKey) return [];

    try {
        const savedNotesJSON = localStorage.getItem(storageKey);
        return savedNotesJSON ? JSON.parse(savedNotesJSON) : [];
    } catch (error) {
        console.error("❌ [SessionNotes] Impossibile caricare le note:", error);
        return [];
    }
}

// Funzione per calcolare il prossimo numero di sessione
const getNextSessionNumber = (notes) => {
    if (notes.length === 0) return 1;
    const sessionNumbers = notes
        .map(n => parseInt(n.sessionNumber))
        .filter(n => !isNaN(n));
    if (sessionNumbers.length === 0) return 1;
    return Math.max(...sessionNumbers) + 1;
};


const SessionNotes = {
     render(containerElement, itemToLoad = null) {
        containerElement.innerHTML = `
            <div class="session-notes-container">
                <div class="notes-list-panel">
                    <div class="panel-header">
                        <h2>Note di Sessione</h2>
                        <button id="new-note-btn" class="action-btn">Nuova Nota</button>
                    </div>
                    <ul id="saved-notes-list" class="saved-notes-list"></ul>
                </div>

                <div class="note-editor-panel">
                    <div id="editor-content">
                        <p style="text-align: center; color: #888; margin-top: 3rem;">Seleziona una nota esistente o creane una nuova per iniziare.</p>
                    </div>
                </div>
            </div>
        `;

        const savedList = containerElement.querySelector('#saved-notes-list');
        const editorContent = containerElement.querySelector('#editor-content');
        const newNoteBtn = containerElement.querySelector('#new-note-btn');

        let notes = loadNotes();
        let currentEditingId = null;

        // --- FUNZIONI DI RENDERING ---
        const renderNotesList = () => {
            savedList.innerHTML = '';
            if (notes.length === 0) {
                savedList.innerHTML = '<li class="empty-list">Nessuna nota salvata per questa campagna.</li>';
                return;
            }

            // Ordina le note per numero di sessione crescente
            const sortedNotes = [...notes].sort((a, b) => (parseInt(a.sessionNumber) || 0) - (parseInt(b.sessionNumber) || 0));

            sortedNotes.forEach(note => {
                const li = document.createElement('li');
                li.className = 'note-list-item';
                li.dataset.id = note.id;

                const date = new Date(note.lastModified).toLocaleString('it-IT');
                // Se il titolo è vuoto, usa un titolo temporaneo basato sul numero di sessione
                const displayTitle = note.title || `Sessione ${note.sessionNumber || 'N/D'}`;
                
                li.innerHTML = `
                    <div class="note-item-info">
                        <h3>${displayTitle}</h3>
                        <p>${note.summary ? note.summary.substring(0, 100) + (note.summary.length > 100 ? '...' : '') : 'Nessun riepilogo.'}</p>
                        <small>Ultima modifica: ${date}</small>
                    </div>
                    <div class="note-item-actions">
                        <button class="edit-note-btn">Modifica</button>
                        <button class="delete-note-btn">Elimina</button>
                    </div>
                `;
                savedList.appendChild(li);
            });
        };

        // --- NUOVA FUNZIONE: Renderizza la nota in modalità di sola lettura ---
        const renderNoteViewer = (note) => {
            const date = new Date(note.lastModified).toLocaleString('it-IT');

            // VISUALIZZAZIONE CAPITOLO COLLEGATO NEL VIEWER
            const chapters = getChapters();
            const linkedChapter = chapters.find(c => c.id === note.linkedChapterId);
            
            // Applica linkifyCampaignReferences al titolo e al contenuto
            const linkedTitle = linkifyCampaignReferences(note.title || `Nota del ${new Date(note.lastModified).toLocaleDateString('it-IT')}`);
            const linkedSummary = linkifyCampaignReferences(note.summary || 'Nessun riepilogo.');
            const linkedKeyEvents = linkifyCampaignReferences((note.keyEvents || []).map(e => `- ${e}`).join('\n') || 'Nessun evento chiave.');
            const linkedNpcs = linkifyCampaignReferences(note.npcs || 'Nessun PNG incontrato.');
            const linkedLocations = linkifyCampaignReferences(note.locations || 'Nessun luogo visitato.');
            const linkedLoot = linkifyCampaignReferences(note.loot || 'Nessun tesoro ottenuto.');
            const linkedPlayerNotes = linkifyCampaignReferences(note.playerNotes || 'Nessuna nota per i giocatori.');
            const linkedDmNotes = linkifyCampaignReferences(note.dmNotes || 'Nessuna nota segreta.');

            editorContent.innerHTML = `
                <div class="note-viewer">
                    <div class="note-viewer-header">
                        <h2 style="color: #f0ad4e;">${linkedTitle}</h2>
                        ${linkedChapter ? `<p><span class="status-badge" style="background:#e0f0ff; color:#0056b3; border: 1px solid #b3d7ff;">📖 Collegata a: ${linkedChapter.title}</span></p>` : ''}
                        <p><strong class="wiki-label" style="color: #f0ad4e;">Sessione N°:</strong> <span style="color: #ffffff;">${note.sessionNumber || 'N/D'}</span></p>
                        <p><strong class="wiki-label" style="color: #f0ad4e;">Data di Gioco:</strong> <span style="color: #ffffff;">${note.gameDate || 'N/D'}</span></p>
                    </div>
                    <p><strong class="wiki-label" style="color: #f0ad4e;">Riepilogo:</strong></p>
                    <p class="note-viewer-content" style="color: #ffffff;">${linkedSummary.replace(/\n/g, '<br>')}</p>
                    
                    <p><strong class="wiki-label" style="color: #f0ad4e;">Eventi Chiave:</strong></p>
                    <p class="note-viewer-content" style="color: #ffffff; white-space: pre-line;">${linkedKeyEvents}</p>
                    
                    <p><strong class="wiki-label" style="color: #f0ad4e;">PNG Incontrati:</strong></p>
                    <p class="note-viewer-content" style="color: #ffffff;">${linkedNpcs.replace(/\n/g, '<br>')}</p>
                    
                    <p><strong class="wiki-label" style="color: #f0ad4e;">Luoghi Visitati:</strong></p>
                    <p class="note-viewer-content" style="color: #ffffff;">${linkedLocations.replace(/\n/g, '<br>')}</p>
                    
                    <p><strong class="wiki-label" style="color: #f0ad4e;">Tesoro Ottenuto:</strong></p>
                    <p class="note-viewer-content" style="color: #ffffff;">${linkedLoot.replace(/\n/g, '<br>')}</p>
                    
                    <p><strong class="wiki-label" style="color: #f0ad4e;">Note per i Giocatori:</strong></p>
                    <p class="note-viewer-content" style="color: #ffffff;">${linkedPlayerNotes.replace(/\n/g, '<br>')}</p>
                    
                    <div class="unrevealed-status" style="margin-top: 20px; padding: 15px; border: 1px dashed #742307; background: #fffcf5;">
                        <p><strong class="wiki-label" style="color: #f0ad4e;">Note Segrete del DM:</strong></p>
                        <p class="note-viewer-content" style="color: #eee !important;">${linkedDmNotes.replace(/\n/g, '<br>')}</p>
                    </div>
                    
                    <small class="note-viewer-date" style="color: #aaaaaa;">Ultima modifica: ${date}</small>
                </div>
            `;
        };

        const renderNoteEditor = (note = null, preselectedChapterId = null) => {
            const isNew = !note;
            const chapters = getChapters(); // RECUPERO CAPITOLI PER EDITOR
            
            const title = isNew ? '' : (note.title || '');
            const sessionNumber = isNew ? getNextSessionNumber(notes) : (note.sessionNumber || '');
            const gameDate = isNew ? new Date().toISOString().split('T')[0] : (note.gameDate || '');
            const summary = isNew ? '' : (note.summary || '');
            const keyEvents = isNew ? [] : (note.keyEvents || []);
            const npcs = isNew ? '' : (note.npcs || '');
            const locations = isNew ? '' : (note.locations || '');
            const loot = isNew ? '' : (note.loot || '');
            const playerNotes = isNew ? '' : (note.playerNotes || '');
            const dmNotes = isNew ? '' : (note.dmNotes || '');

            editorContent.innerHTML = `
                <div class="editor-form">
                    <div class="form-group">
                        <label for="linked-chapter-id">Appartiene al Capitolo/Side Quest:</label>
                        <select id="linked-chapter-id">
                            <option value="">-- Nessun collegamento --</option>
                            ${chapters.map(c => `<option value="${c.id}" ${(note?.linkedChapterId || preselectedChapterId) === c.id ? 'selected' : ''}>${c.title}</option>`).join('')}
                        </select>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="note-title">Titolo della Nota:</label>
                            <input type="text" id="note-title" value="${title.replace(/"/g, "&quot;")}" placeholder="Es. L'Assedio di Ponte Bianca">
                        </div>
                        <div class="form-group">
                            <label for="note-session-number">N° Sessione:</label>
                            <input type="number" id="note-session-number" value="${sessionNumber}" min="1" placeholder="Es. 15">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="note-game-date">Data di Gioco:</label>
                        <input type="date" id="note-game-date" value="${gameDate}">
                    </div>

                    <div class="form-group" id="chapter-objectives-group">
                        <label>Obiettivi del Capitolo:</label>
                        <div id="chapter-objectives-list"></div>
                    </div>

                    <div class="form-group">
                        <label for="note-summary">Riepilogo della Sessione:</label>
                        <textarea id="note-summary" rows="4" placeholder="Una breve sintesi degli eventi principali...">${summary.replace(/"/g, "&quot;")}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Eventi Chiave:</label>
                        <div id="key-events-container" class="key-events-container">
                            <ul id="key-events-list" class="key-events-list"></ul>
                            <button id="add-key-event-btn" class="action-btn small" type="button">Aggiungi Evento</button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="note-npcs">PNG Incontrati:</label>
                        <textarea id="note-npcs" rows="2" placeholder="Elenco i PNG con cui avete interagito...">${npcs.replace(/"/g, "&quot;")}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="note-locations">Luoghi Visitati:</label>
                        <textarea id="note-locations" rows="2" placeholder="Elenca i luoghi esplorati...">${locations.replace(/"/g, "&quot;")}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="note-loot">Tesoro Ottenuto:</label>
                        <textarea id="note-loot" rows="2" placeholder="Oggetti, monete o equipaggiamento speciale...">${loot.replace(/"/g, "&quot;")}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="note-player-notes">Note per i Giocatori:</label>
                        <textarea id="note-player-notes" rows="4" placeholder="Informazioni da condividere con il gruppo...">${playerNotes.replace(/"/g, "&quot;")}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="note-dm-notes">Note Segrete del DM:</label>
                        <textarea id="note-dm-notes" rows="4" placeholder="I tuoi piani, trame future, idee non sviluppate...">${dmNotes.replace(/"/g, "&quot;")}</textarea>
                    </div>
                </div>
                <div class="editor-actions">
                    <button id="save-note-btn" class="action-btn">Salva Nota</button>
                </div>
            `;

            setupEditorListeners(keyEvents, preselectedChapterId);
        };

        // --- NUOVA FUNZIONE: Renderizza la lista dinamica degli eventi chiave ---
        const renderKeyEventsList = (keyEvents) => {
            const list = containerElement.querySelector('#key-events-list');
            if (!list) return;
            list.innerHTML = '';
            if (keyEvents.length === 0) {
                list.innerHTML = '<li class="empty-list">Nessun evento chiave aggiunto.</li>';
                return;
            }
            keyEvents.forEach((event, index) => {
                const li = document.createElement('li');
                li.className = 'key-event-item';
                li.innerHTML = `
                    <span class="key-event-text">${event.replace(/"/g, "&quot;")}</span>
                    <button class="remove-key-event-btn" data-index="${index}">&times;</button>
                `;
                list.appendChild(li);
            });
        };

        // --- SETUP DEGLI EVENT LISTENER ---
        const setupMainListeners = () => {
            newNoteBtn.addEventListener('click', () => {
                currentEditingId = null;
                renderNoteEditor(); // Apre l'editor vuoto per una nuova nota
            });

            savedList.addEventListener('click', (e) => {
                const li = e.target.closest('.note-list-item');
                if (!li) return;
                const id = li.dataset.id;

                if (e.target.classList.contains('edit-note-btn')) {
                    const noteToEdit = notes.find(n => n.id === id);
                    currentEditingId = id;
                    renderNoteEditor(noteToEdit); // Apre l'editor con i dati della nota
                }
                if (e.target.classList.contains('delete-note-btn')) {
                    const noteToDelete = notes.find(n => n.id === id);
                    if (confirm(`Sei sicuro di voler eliminare la nota "${noteToDelete.title || 'Sessione ' + noteToDelete.sessionNumber}"?`)) {
                        notes = notes.filter(n => n.id !== id);
                        saveNotes(notes);
                        renderNotesList();
                        if (currentEditingId === id) {
                            currentEditingId = null;
                            editorContent.innerHTML = `<p style="text-align: center; color: #888; margin-top: 3rem;">Nota eliminata.</p>`;
                        }
                        showToast(`Nota eliminata.`, 'warning');
                    }
                }
                // Se si clicca sulla card stessa (non sui bottoni)
                if (!e.target.classList.contains('edit-note-btn') && !e.target.classList.contains('delete-note-btn')) {
                    const noteToView = notes.find(n => n.id === id);
                    renderNoteViewer(noteToView);
                }
            });
        };

        const setupEditorListeners = (initialKeyEvents, preselectedChapterId) => {
            let keyEvents = [...initialKeyEvents]; // Crea una copia locale per manipolarla

            const renderList = () => renderKeyEventsList(keyEvents);

            const titleInput = containerElement.querySelector('#note-title');
            const sessionNumberInput = containerElement.querySelector('#note-session-number');
            const gameDateInput = containerElement.querySelector('#note-game-date');
            const summaryInput = containerElement.querySelector('#note-summary');
            const npcsInput = containerElement.querySelector('#note-npcs');
            const locationsInput = containerElement.querySelector('#note-locations');
            const lootInput = containerElement.querySelector('#note-loot');
            const playerNotesInput = containerElement.querySelector('#note-player-notes');
            const dmNotesInput = containerElement.querySelector('#note-dm-notes');
            const saveBtn = containerElement.querySelector('#save-note-btn');
            const addEventBtn = containerElement.querySelector('#add-key-event-btn');
            const linkedChapterSelect = containerElement.querySelector('#linked-chapter-id');
            const objectivesContainer = containerElement.querySelector('#chapter-objectives-group');
            const objectivesList = containerElement.querySelector('#chapter-objectives-list');

            // Inizializza l'autocompletamento sui campi testuali
            initAutocomplete(npcsInput);
            initAutocomplete(locationsInput);
            initAutocomplete(lootInput);
            initAutocomplete(playerNotesInput);
            initAutocomplete(dmNotesInput);

            // Funzione per renderizzare gli obiettivi del capitolo selezionato
            const renderChapterObjectives = (chapterId) => {
                objectivesList.innerHTML = ''; // Svuota la lista
                if (!chapterId) {
                    objectivesContainer.style.display = 'none'; // Nascondi il gruppo se non c'è capitolo
                    return;
                }
                objectivesContainer.style.display = 'block'; // Mostra il gruppo

                const chapters = getChapters();
                const linkedChapter = chapters.find(c => c.id === chapterId);
                
                if (linkedChapter && linkedChapter.objectives) {
                    const mainObjectives = linkedChapter.objectives.filter(o => o.priority === 'main');
                    if (mainObjectives.length === 0) {
                        objectivesList.innerHTML = '<p style="color: #888; font-style: italic;">Nessun obiettivo principale definito per questo capitolo.</p>';
                    } else {
                        objectivesList.innerHTML = mainObjectives.map(obj => `
                            <div class="objective-item-session">
                                <input type="checkbox" id="obj-${obj.id}" data-objective-id="${obj.id}" ${obj.completed ? 'checked' : ''}>
                                <label for="obj-${obj.id}">${escapeHtml(obj.text)}</label>
                            </div>
                        `).join('');
                    }
                } else {
                    objectivesList.innerHTML = '<p style="color: #888; font-style: italic;">Impossibile caricare gli obiettivi del capitolo.</p>';
                }
            };

            // Listener per aggiornare gli obiettivi quando si cambia il capitolo
            linkedChapterSelect.addEventListener('change', () => {
                renderChapterObjectives(linkedChapterSelect.value);
            });

            // Renderizza iniziale
            renderChapterObjectives(linkedChapterSelect.value);

            // Listener per aggiungere un evento chiave
            addEventBtn.addEventListener('click', () => {
                const eventText = prompt("Descrivi l'evento chiave:");
                if (eventText && eventText.trim()) {
                    keyEvents.push(eventText.trim());
                    renderList();
                }
            });

            // Listener per rimuovere un evento chiave (delegato)
            containerElement.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-key-event-btn')) {
                    const index = parseInt(e.target.dataset.index, 10);
                    keyEvents.splice(index, 1);
                    renderList();
                }
            });

            saveBtn.addEventListener('click', () => {
                const title = titleInput.value.trim();
                const summary = summaryInput.value.trim();

                // Il titolo non è più obbligatorio, ma il riassunto sì
                if (!summary) {
                    showToast('Il riepilogo della nota non può essere vuoto.', 'error');
                    return;
                }

                // Raccogli gli obiettivi spuntati
                const completedObjectives = [];
                containerElement.querySelectorAll('#chapter-objectives-list input[type="checkbox"]:checked').forEach(checkbox => {
                    completedObjectives.push(checkbox.dataset.objectiveId);
                });

                const now = Date.now();
                const noteData = {
                    title: title, // Può essere vuoto
                    linkedChapterId: linkedChapterSelect.value,
                    sessionNumber: sessionNumberInput.value,
                    gameDate: gameDateInput.value,
                    summary: summary,
                    keyEvents: keyEvents,
                    npcs: npcsInput.value.trim(),
                    locations: locationsInput.value.trim(),
                    loot: lootInput.value.trim(),
                    playerNotes: playerNotesInput.value.trim(),
                    dmNotes: dmNotesInput.value.trim(),
                    lastModified: now,
                };

                let savedNote;
                if (currentEditingId) {
                    // Modifica di una nota esistente
                    const noteIndex = notes.findIndex(n => n.id === currentEditingId);
                    notes[noteIndex] = { ...notes[noteIndex], ...noteData };
                    savedNote = notes[noteIndex];
                    showToast(`Nota "${title || 'Sessione ' + noteData.sessionNumber}" aggiornata.`, 'success');
                } else {
                    // Creazione di una nuova nota
                    const newNote = {
                        id: now.toString(),
                        ...noteData,
                    };
                    notes.push(newNote);
                    savedNote = newNote;
                    showToast(`Nota "${title || 'Sessione ' + noteData.sessionNumber}" creata.`, 'success');
                }

                // Lancia l'evento per aggiornare gli obiettivi nel chapter planner
                if (completedObjectives.length > 0) {
                    document.dispatchEvent(new CustomEvent('objectivesCompletedInSession', {
                        detail: { chapterId: noteData.linkedChapterId, objectiveIds: completedObjectives }
                    }));
                }

                saveNotes(notes);
                renderNotesList();
                // Dopo il salvataggio, mostra il visualizzatore invece dell'editor
                renderNoteViewer(savedNote);
            });

            renderList(); // Renderizza la lista iniziale
        };

        // --- INIZIALIZZAZIONE ---
        // --- LOGICA MIGLIORATA: CONTROLLA SE È UN ID SESSIONE O CAPITOLO ---
        if (itemToLoad) {
            const existingNote = notes.find(n => n.id === itemToLoad);

            if (existingNote) {
                // Caso A: La nota esiste, la visualizziamo
                renderNoteViewer(existingNote);
            } else {
                // Caso B: Non è una nota, lo trattiamo come ID capitolo per nuova sessione
                renderNoteEditor(null, itemToLoad);
            }
        } else if (notes.length > 0) {
            const mostRecentNote = [...notes].sort((a, b) => b.lastModified - a.lastModified)[0];
            renderNoteViewer(mostRecentNote);
        }

        renderNotesList();
        setupMainListeners();
    }
};

export default SessionNotes;