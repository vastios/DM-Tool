// --- CORREZIONE 1: L'import era errato ---
import { getCurrentCampaignId } from '../../../stateManager.js';
import { showToast } from '../../../utils/toast.js';
import { linkifyCampaignReferences } from '../../../utils/campaignLinker.js'; // Corretto da 'classLinker.js'
import { initAutocomplete } from '../../../utils/autocomplete.js';

// --- FUNZIONI PER LA GESTIONE DEL LOCAL STORAGE ---

function getPlansStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) {
        console.warn("⚠️ [SessionPlanner] Nessuna campagna selezionata.");
        return null;
    }
    return `dungeonMasterToolSessionPlans_${campaignId}`;
}

function savePlans(plans) {
    const storageKey = getPlansStorageKey();
    if (!storageKey) return;
    try {
        localStorage.setItem(storageKey, JSON.stringify(plans));
        console.log(`💾 [SessionPlanner] Piani salvati per la campagna ${getCurrentCampaignId()}.`);
    } catch (error) {
        console.error("❌ [SessionPlanner] Impossibile salvare i piani:", error);
    }
}

function loadPlans() {
    const storageKey = getPlansStorageKey();
    if (!storageKey) return [];
    try {
        const savedPlansJSON = localStorage.getItem(storageKey);
        return savedPlansJSON ? JSON.parse(savedPlansJSON) : [];
    } catch (error) {
        console.error("❌ [SessionPlanner] Impossibile caricare i piani:", error);
        return [];
    }
}

// --- FUNZIONI HELPER PER LA GESTIONE DELLE NOTE DI SESSIONE ---

// Funzione per creare una nuova nota di sessione basata su un piano
function createNoteFromPlan(plan) {
    const newNoteData = {
        title: `Parte 1: ${plan.name}`, // --- CORREZIONE 2: Uso di 'plan.name' per coerenza ---
        summary: plan.objectives || '',
        npcs: plan.npcs || '',
        locations: plan.locations || '',
        loot: plan.loot || '',
        playerNotes: `Inizio dell'avventura: ${plan.playerNotes || ''}`,
        dmNotes: `Obiettivi: ${plan.objectives || ''}`,
        linkedPlanId: plan.id,
        lastModified: Date.now()
    };

    // Lancia un evento globale per dire a main.js di aprire sessionNotes con i dati pre-compilati
    const event = new CustomEvent('openModuleWithItem', {
        detail: {
            moduleId: 'session-notes',
            itemData: newNoteData
        }
    });
    document.dispatchEvent(event);
    
    showToast(`Nota di sessione creata da "${plan.name}".`, 'success');
}

// Funzione per continuare l'ultima nota di sessione di un piano
function continueLastSession(plan) {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return;

    const notesStorageKey = `dungeonMasterToolSessionNotes_${campaignId}`;
    let allNotes = [];
    try {
        allNotes = JSON.parse(localStorage.getItem(notesStorageKey) || '[]');
    } catch (error) {
        console.error("❌ [SessionPlanner] Impossibile caricare le note per continuare la sessione.", error);
        showToast("Impossibile caricare le note della sessione.", 'error');
        return;
    }

    // Filtra le note collegate a questo piano e trova la più recente
    const linkedNotes = allNotes.filter(note => note.linkedPlanId === plan.id);
    if (linkedNotes.length === 0) {
        showToast("Nessuna sessione trovata per questo piano. Creane una nuova nota prima.", 'warning');
        return;
    }

    const lastNote = linkedNotes.sort((a, b) => b.lastModified - a.lastModified)[0];

    // Lancia un evento per aprire sessionNotes in modalità modifica sull'ultima nota
    const event = new CustomEvent('openModuleWithItem', {
        detail: {
            moduleId: 'session-notes',
            itemId: lastNote.id
        }
    });
    document.dispatchEvent(event);

    showToast(`Aperta l'ultima nota per "${plan.name}"`, 'info');
}

// Funzione per finalizzare un capitolo (creare una nota riassuntiva)
function finalizeChapter(plan) {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return;

    const notesStorageKey = `dungeonMasterToolSessionNotes_${campaignId}`;
    let allNotes = [];
    try {
        allNotes = JSON.parse(localStorage.getItem(notesStorageKey) || '[]');
    } catch (error) {
        console.error("❌ [SessionPlanner] Impossibile caricare le note per finalizzare il capitolo.", error);
        showToast("Impossibile caricare le note della sessione.", 'error');
        return;
    }

    const linkedNotes = allNotes.filter(note => note.linkedPlanId === plan.id);
    if (linkedNotes.length === 0) {
        showToast("Nessuna sessione da finalizzare per questo piano.", 'warning');
        return;
    }

    // Aggrega i contenuti di tutte le note collegate
    const aggregatedContent = linkedNotes.map(note => {
        return `
            ---
            **Sessione del ${new Date(note.lastModified).toLocaleDateString('it-IT')}**
            ${note.summary}
            ${note.playerNotes ? `\n\n**Note per i Giocatori:**\n${note.playerNotes}` : ''}
            ${note.dmNotes ? `\n\n**Note del DM:**\n${note.dmNotes}` : ''}
        `;
    }).join('\n');

    const chapterNoteData = {
        title: `Capitolo: ${plan.name}`,
        summary: `Resoconto completo dell'avventura "${plan.name}", basato su ${linkedNotes.length} sessioni di gioco.\n\n${aggregatedContent}`,
        linkedPlanId: plan.id,
        lastModified: Date.now()
    };
    
    // Lancia un evento per creare la nuova nota riassuntiva
    const event = new CustomEvent('openModuleWithItem', {
        detail: {
            moduleId: 'session-notes',
            itemData: chapterNoteData
        }
    });
    document.dispatchEvent(event);

    showToast(`Capitolo "${plan.name}" finalizzato e archiviato.`, 'success');
}


// --- FUNZIONE HELPER PER CONTARE LE NOTE COLLEGATE ---
function getLinkedNotesCount(planId) {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return 0;
    const notesStorageKey = `dungeonMasterToolSessionNotes_${campaignId}`;
    try {
        const allNotes = JSON.parse(localStorage.getItem(notesStorageKey) || '[]');
        return allNotes.filter(note => note.linkedPlanId === planId).length;
    } catch (error) {
        return 0;
    }
}


// --- OGGETTO PRINCIPALE ---
const SessionPlanner = {
    render(containerElement) {
        containerElement.innerHTML = `
            <div class="session-notes-container">
                <!-- Pannello di Sinistra: Lista dei Piani -->
                <div class="notes-list-panel">
                    <div class="panel-header">
                        <h2>Piani di Sessione</h2>
                        <button id="new-plan-btn" class="action-btn">Nuovo Piano</button>
                    </div>
                    <ul id="saved-plans-list" class="saved-notes-list"></ul>
                </div>

                <!-- Pannello di Destra: Visualizzatore/Editor del Piano -->
                <div class="note-editor-panel">
                    <div id="editor-content">
                        <!-- CORREZIONE 3: Sintassi HTML corretta -->
                        <p style="text-align: center; color: #888; margin-top: 3rem;">Seleziona un piano per visualizzarlo o creane uno nuovo.</p>
                    </div>
                </div>
            </div>
        `;

        const savedList = containerElement.querySelector('#saved-plans-list');
        const editorContent = containerElement.querySelector('#editor-content');
        const newPlanBtn = containerElement.querySelector('#new-plan-btn');

        let plans = loadPlans();
        let currentEditingId = null;

        // --- FUNZIONI DI RENDERING ---
        // --- CORREZIONE 4: Implementata la funzione renderPlansList ---
        const renderPlansList = () => {
            savedList.innerHTML = '';
            if (plans.length === 0) {
                savedList.innerHTML = '<li class="empty-list">Nessun piano salvato per questa campagna.</li>';
                return;
            }

            const sortedPlans = [...plans].sort((a, b) => b.lastModified - a.lastModified);
            sortedPlans.forEach(plan => {
                const li = document.createElement('li');
                li.className = 'note-list-item';
                li.dataset.id = plan.id;
                
                const linkedNotesCount = getLinkedNotesCount(plan.id);

                li.innerHTML = `
                    <div class="note-item-info">
                        <h3>${escapeHtml(plan.name)}</h3>
                        <p><em>${linkedNotesCount} sessioni collegate</em></p>
                        <p>${escapeHtml(plan.objectives?.substring(0, 100))}${plan.objectives?.length > 100 ? '...' : ''}</p>
                        <small>Ultima modifica: ${new Date(plan.lastModified).toLocaleString('it-IT')}</small>
                    </div>
                    <div class="note-item-actions">
                        <button class="edit-plan-btn">Modifica</button>
                        <button class="delete-plan-btn">Elimina</button>
                    </div>
                `;
                savedList.appendChild(li);
            });
        };

        const renderPlanViewer = (plan) => {
            // --- CORREZIONE 5: Rimosso 'const' duplicato e corretto 'linkedPathId' ---
            const date = new Date(plan.lastModified).toLocaleString('it-IT');
            let linkedNotes = [];
            
            const campaignId = getCurrentCampaignId();
            if (campaignId) {
                const notesStorageKey = `dungeonMasterToolSessionNotes_${campaignId}`;
                try {
                    const allNotes = JSON.parse(localStorage.getItem(notesStorageKey) || '[]');
                    linkedNotes.push(...allNotes.filter(note => note.linkedPlanId === plan.id)); // Corretto da linkedPathId
                } catch (error) {
                    console.error("Impossibile caricare le note collegate per la visualizzazione.");
                }
            }

            const linkedName = linkifyCampaignReferences(plan.name);
            const linkedObjectives = linkifyCampaignReferences(plan.objectives || 'Nessun obiettivo specifico.');
            const linkedPlayerNotes = linkifyCampaignReferences(plan.playerNotes || 'Nessuna nota per i giocatori.');
            const linkedNpcs = linkifyCampaignReferences(plan.npcs || 'Nessun PNG pianificato.');
            const linkedLocations = linkifyCampaignReferences(plan.locations || 'Nessun luogo pianificato.');
            const linkedLoot = linkifyCampaignReferences(plan.loot || 'Nessun tesoro pianificato.');
            const linkedDmNotes = linkifyCampaignReferences(plan.dmNotes || 'Nessuna nota segreta.');

            editorContent.innerHTML = `
                <div class="note-viewer">
                    <div class="note-viewer-header">
                        <h2 style="color: #f0ad4e;">${linkedName}</h2>
                    </div>
                    
                    <p><strong class="wiki-label" style="color: #f0ad4e;">Obiettivi Principali:</strong></p>
                    <p class="note-viewer-content" style="color: #ffffff;">${linkedObjectives.replace(/\n/g, '<br>')}</p>

                    <p><strong class="wiki-label" style="color: #f0ad4e;">Riepilogo per i Giocatori:</strong></p>
                    <p class="note-viewer-content" style="color: #ffffff;">${linkedPlayerNotes.replace(/\n/g, '<br>')}</p>

                    <hr style="border-color: #444; margin: 20px 0;">
                    
                    <p><strong class="wiki-label" style="color: #f0ad4e;">Pianificazione Incontri:</strong></p>
                    <p class="note-viewer-content" style="color: #ffffff;">${plan.encounters ? plan.encounters.map(e => `- ${e.name}`).join('<br>') : 'Nessun incontro pianificato.'}</p>

                    <p><strong class="wiki-label" style="color: #f0ad4e;">PNG da usare:</strong></p>
                    <p class="note-viewer-content" style="color: #ffffff;">${linkedNpcs.replace(/\n/g, '<br>')}</p>
                    
                    <p><strong class="wiki-label" style="color: #f0ad4e;">Luoghi da esplorare:</strong></p>
                    <p class="note-viewer-content" style="color: #ffffff;">${linkedLocations.replace(/\n/g, '<br>')}</p>
                    
                    <p><strong class="wiki-label" style="color: #f0ad4e;">Tesoro Ottenuto:</strong></p>
                    <p class="note-viewer-content" style="color: #ffffff;">${linkedLoot.replace(/\n/g, '<br>')}</p>

                    <div class="unrevealed-status" style="margin-top: 20px; padding: 1.5rem; border: 1px dashed #742307; background: #fffcf5;">
                        <p><strong class="wiki-label" style="color: #f0ad4e;">Note Segrete del DM:</strong></p>
                        <p class="note-viewer-content" style="color: #000000 !important;">${linkedDmNotes.replace(/\n/g, '<br>')}</p>
                    </div>

                    <hr style="border-color: #444; margin: 20px 0;">
                    
                    <div class="plan-actions">
                        <button id="create-note-btn" class="action-btn">Crea Nota da questo Piano</button>
                        <button id="continue-session-btn" class="action-btn secondary">Continua Sessione Esistente</button>
                        <button id="finalize-chapter-btn" class="action-btn success">Finalizza Capitolo</button>
                    </div>

                    <div class="linked-sessions-section">
                        <h4 style="color: #f0ad4e;">Sessioni Collegate:</h4>
                        <ul class="linked-sessions-list">
                            ${linkedNotes.length > 0 ? linkedNotes.map(note => `
                                <li>
                                    <a href="#" class="wiki-link linked-session-link" data-note-id="${note.id}">
                                        ${note.title}
                                    </a>
                                </li>
                            `).join('') : '<li class="empty-list">Nessuna sessione ancora creata per questo piano.</li>'}
                        </ul>
                    </div>
                    
                    <small class="note-viewer-date" style="color: #aaaaaa;">Ultima modifica: ${date}</small>
                </div>
            `;

            // Aggiungi i listener per i link alle sessioni collegate
            editorContent.querySelectorAll('.linked-session-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const noteId = e.target.dataset.noteId;
                    // --- CORREZIONE 6: Evento CustomEvent corretto ---
                    const event = new CustomEvent('openModuleWithItem', {
                        detail: { moduleId: 'session-notes', itemId: noteId }
                    });
                    document.dispatchEvent(event);
                });
            });
        };

        const renderPlanEditor = (plan = null) => {
            const isNew = !plan;
            // --- CORREZIONE 7: Uso di 'plan.name' per coerenza e valori di fallback ---
            const name = isNew ? '' : (plan.name || '');
            const objectives = isNew ? '' : (plan.objectives || '');
            const playerNotes = isNew ? '' : (plan.playerNotes || '');
            const npcs = isNew ? '' : (plan.npcs || '');
            const locations = isNew ? '' : (plan.locations || '');
            const loot = isNew ? '' : (plan.loot || '');
            const dmNotes = isNew ? '' : (plan.dmNotes || '');

            editorContent.innerHTML = `
                <div class="editor-form">
                    <div class="form-group">
                        <label for="plan-name">Titolo del Piano:</label>
                        <input type="text" id="plan-name" value="${escapeHtml(name)}" placeholder="Es. L'Assedio di Ponte BIANCA">
                    </div>
                    <div class="form-group">
                        <label for="plan-objectives">Obiettivi Principali:</label>
                        <textarea id="plan-objectives" rows="4" placeholder="Cosa dovrebbe accadere in questa avventura? Esempio: 1. Raggiungere la fortezza. 2. Sconfigurare la trappola del Drago.">${escapeHtml(objectives)}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="plan-player-summary">Riepilogo per i Giocatori:</label>
                        <textarea id="plan-player-summary" rows="3" placeholder="Una breve sintesi da poter leggere all'inizio della sessione per metterli in atmosfera...">${escapeHtml(playerNotes)}</textarea>
                    </div>

                    <div class="form-group">
                        <h4 style="color: #f0ad4e;">Pianificazione Incontri:</h4>
                        <button id="import-encounter-btn" class="action-btn small">Importa Incontro</button>
                        <div id="encounter-display" class="elementi in modo di testo, non textarea
                            <p>Nessun incontro pianificato.</p>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="plan-npcs">PNG da usare:</label>
                        <textarea id="plan-npcs" rows="2" placeholder="Elenca i PNG che faranno la loro comparsa...">${escapeHtml(npcs)}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="plan-locations">Luoghi da esplorare:</label>
                        <textarea id="plan-locations" rows="2" placeholder="Elenca i luoghi principali dell'avventura...">${escapeHtml(locations)}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="plan-loot">Tesoro Ottenuto:</label>
                        <textarea id="plan-loot" rows="2" placeholder="Oggetti, monete o equipaggiamento speciale...">${escapeHtml(loot)}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="plan-dm-notes">Note Segrete del DM:</label>
                        <textarea id="plan-dm-notes" rows="4" placeholder="I tuoi piani, trame future, idee non sviluppate...">${escapeHtml(dmNotes)}</textarea>
                    </div>
                </div>
                <div class="editor-actions">
                    <button id="save-plan-btn" class="action-btn">Salva Piano</button>
                </div>
            `;

            setupEditorListeners(plan);
        };

        // --- SETUP DEGLI EVENT LISTENER ---
        const setupMainListeners = () => {
            newPlanBtn.addEventListener('click', () => {
                currentEditingId = null;
                renderPlanEditor();
            });

            savedList.addEventListener('click', (e) => {
                const li = e.target.closest('.note-list-item');
                if (!li) return;
                const id = li.dataset.id;

                if (e.target.classList.contains('edit-plan-btn')) {
                    const planToEdit = plans.find(p => p.id === id);
                    currentEditingId = id;
                    renderPlanEditor(planToEdit);
                }
                if (e.target.classList.contains('delete-plan-btn')) {
                    const planToDelete = plans.find(p => p.id === id);
                    if (confirm(`Sei sicuro di voler eliminare il piano "${planToDelete.name}"?`)) {
                        plans = plans.filter(p => p.id !== id);
                        savePlans(plans);
                        renderPlansList();
                        if (currentEditingId === id) {
                            currentEditingId = null;
                            editorContent.innerHTML = `<p style="text-align: center; color: #888; margin-top: 3rem;">Piano eliminato.</p>`;
                        }
                        showToast(`Piano "${planToDelete.name}" eliminato.`, 'warning');
                    }
                }
                if (!e.target.classList.contains('edit-plan-btn') && !e.target.classList.contains('delete-plan-btn')) {
                    const planToView = plans.find(p => p.id === id);
                    renderPlanViewer(planToView);
                }
            });
        };

        const setupEditorListeners = (plan) => {
            const titleInput = containerElement.querySelector('#plan-name');
            const objectivesInput = containerElement.querySelector('#plan-objectives');
            const playerSummaryInput = containerElement.querySelector('#plan-player-summary');
            const npcsInput = containerElement.querySelector('#plan-npcs');
            const locationsInput = containerElement.querySelector('#plan-locations');
            const lootInput = containerElement.querySelector('#plan-loot');
            const dmNotesInput = containerElement.querySelector('#plan-dm-notes');
            const saveBtn = containerElement.querySelector('#save-plan-btn');
            const importEncounterBtn = containerElement.querySelector('#import-encounter-btn');

            // Inizializza l'autocompletamento sui campi testuali
            initAutocomplete(npcsInput);
            initAutocomplete(locationsInput);
            initAutocomplete(lootInput);
            initAutocomplete(dmNotesInput);
            initAutocomplete(playerSummaryInput);

            importEncounterBtn.addEventListener('click', () => {
                showToast("Funzionalità di importazione incontri in sviluppo.", 'info');
            });

            saveBtn.addEventListener('click', () => {
                const title = titleInput.value.trim();
                if (!title) {
                    showToast('Il titolo del piano è obbligatorio.', 'error');
                    return;
                }

                const now = Date.now();
                // --- CORREZIONE 8: Oggetto planData corretto e coerente ---
                const planData = {
                    name: title,
                    objectives: objectivesInput.value.trim(),
                    playerNotes: playerSummaryInput.value.trim(),
                    npcs: npcsInput.value.trim(),
                    locations: locationsInput.value.trim(), // Corretto da locationsInput
                    loot: lootInput.value.trim(),
                    dmNotes: dmNotesInput.value.trim(),
                    encounters: plan ? plan.encounters : [],
                    lastModified: now,
                };

                if (currentEditingId) {
                    const planIndex = plans.findIndex(p => p.id === currentEditingId);
                    plans[planIndex] = { ...plans[planIndex], ...planData };
                    showToast(`Piano "${title}" aggiornato.`, 'success');
                } else {
                    const newPlan = {
                        id: Date.now().toString(),
                        ...planData,
                    };
                    plans.push(newPlan);
                    showToast(`Piano "${title}" creato.`, 'success');
                }

                savePlans();
                renderPlansList();
                renderPlanViewer(plans.find(p => p.id === (currentEditingId || plans[plans.length - 1].id)));
            });
        };

        // --- Listener per i pulsanti azione del visualizzatore ---
        containerElement.addEventListener('click', (e) => {
            // --- CORREZIONE 9: ID dei pulsanti corretti ---
            if (e.target.id === 'create-note-btn' || e.target.id === 'continue-session-btn' || e.target.id === 'finalize-chapter-btn') {
                const plan = plans.find(p => p.id === currentEditingId);
                if (!plan) {
                    showToast("Nessun piano selezionato.", 'warning');
                    return;
                }

                if (e.target.id === 'create-note-btn') {
                    createNoteFromPlan(plan);
                } else if (e.target.id === 'continue-session-btn') {
                    continueLastSession(plan);
                } else if (e.target.id === 'finalize-chapter-btn') {
                    finalizeChapter(plan);
                }
            }
        });

        // --- INIZIALIZZAZIONE ---
        if (plans.length > 0) {
            const mostRecentPlan = [...plans].sort((a, b) => b.lastModified - a.lastModified)[0];
            renderPlanViewer(mostRecentPlan);
        }

        renderPlansList();
        setupMainListeners();
    }
};

export default SessionPlanner;