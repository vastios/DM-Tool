// js/modules/campagna/chapterPlanner.js

import { showToast } from '../../../utils/toast.js';
import { initAutocomplete } from '../../../utils/autocomplete.js';
import { 
    loadEntries, 
    saveEntries, 
    getSessionNotes 
} from './chapterPlanner/chapterStorage.js';
import { 
    getMainLayout, 
    getSidebarItemHTML, 
    getViewerHTML, 
    getEditorHTML, 
    getObjectiveRowHTML,
    getCheckpointRowHTML
} from './chapterPlanner/chapterTemplates.js';
import { ENTRY_STATUS, OBJECTIVE_PRIORITY } from './chapterPlanner/chapterConstants.js';

// --- STATO A LIVELLO DI MODULO ---
// Per evitare problemi di scope con i parser di alcuni browser
let entries = [];
let containerElement = null;
let currentObjs = [];
let currentCheckpoints = [];

// --- FUNZIONI HELPER ---
const calculateProgress = (objectives) => {
    if (!objectives || objectives.length === 0) return 0;
    const mainObjectives = objectives.filter(o => o.priority === OBJECTIVE_PRIORITY.MAIN);
    if (mainObjectives.length === 0) return 0;
    const completed = mainObjectives.filter(o => o.completed).length;
    return Math.round((completed / mainObjectives.length) * 100);
};

const getNextChapterNumber = () => {
    const chapters = entries.filter(e => e.type === 'chapter');
    if (chapters.length === 0) return 1;
    const maxNum = Math.max(...chapters.map(c => c.chapterNumber || 0));
    return maxNum + 1;
};

const renumberAllChapters = () => {
    const chapters = entries.filter(e => e.type === 'chapter').sort((a, b) => (a.lastModified || 0) - (b.lastModified || 0));
    if (chapters.length === 0) return false;
    
    if (confirm("Sei sicuro? Questo assegnerà un numero progressivo a tutti i capitoli esistenti.")) {
        chapters.forEach((chapter, index) => {
            chapter.chapterNumber = index + 1;
            chapter.lastModified = Date.now();
        });
        saveEntries(entries);
        showToast("Capitoli rinumerati con successo.", 'success');
        return true;
    }
    return false;
};

// --- FUNZIONI DI RENDERING E GESTIONE STATO ---
function refreshEntries() {
    entries = loadEntries();
    console.log(`🔄 [ChapterPlanner] refreshEntries - Caricate ${entries.length} voci`);
    console.log(`🔄 [ChapterPlanner] Tipo voci:`, entries.map(e => e.type));
    renderEntriesList();
}

function renderEntriesList() {
    const listContainer = containerElement.querySelector('#saved-entries-list');
    if (!listContainer) {
        console.error('❌ [ChapterPlanner] Container lista non trovato!');
        return;
    }
    
    console.log(`📋 [ChapterPlanner] renderEntriesList - Entries totali: ${entries.length}`);
    
    const chapters = entries.filter(e => e.type === 'chapter');
    const sideQuests = entries.filter(e => e.type === 'side-quest');
    
    console.log(`📋 [ChapterPlanner] Capitoli trovati: ${chapters.length}`);
    console.log(`📋 [ChapterPlanner] Side Quest trovate: ${sideQuests.length}`);
    
    let listHTML = '';
    const activeOrphanSideQuests = sideQuests.filter(sq => !sq.parentChapterId || !chapters.find(c => c.id === sq.parentChapterId)).filter(sq => sq.status === ENTRY_STATUS.ACTIVE);
    if (activeOrphanSideQuests.length > 0) {
        listHTML += `<li class="list-separator"><h4>Side Quest Attive</h4></li>`;
        listHTML += activeOrphanSideQuests.map(sq => getSidebarItemHTML(sq, false)).join('');
    }
    const sortedChapters = chapters.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
    sortedChapters.forEach(chapter => {
        listHTML += getSidebarItemHTML(chapter, false);
        const childSideQuests = sideQuests.filter(sq => sq.parentChapterId === chapter.id).sort((a,b) => b.lastModified - a.lastModified);
        if (childSideQuests.length > 0) {
            listHTML += '<ul class="nested-list">';
            listHTML += childSideQuests.map(sq => getSidebarItemHTML(sq, true)).join('');
            listHTML += '</ul>';
        }
    });
    const otherOrphanSideQuests = sideQuests.filter(sq => !sq.parentChapterId || !chapters.find(c => c.id === sq.parentChapterId)).filter(sq => sq.status !== ENTRY_STATUS.ACTIVE);
    if (otherOrphanSideQuests.length > 0) {
        listHTML += `<li class="list-separator"><h4>Altre Side Quest</h4></li>`;
        listHTML += otherOrphanSideQuests.map(sq => getSidebarItemHTML(sq, false)).join('');
    }

    listContainer.innerHTML = listHTML || '<li class="empty-list">Nessun capitolo o side quest salvato.</li>';
}

function renderEntryViewer(entry) {
    const viewer = containerElement.querySelector('#editor-content');
    const linkedSessions = getSessionNotes().filter(s => s.linkedChapterId === entry.id)
        .sort((a, b) => a.sessionNumber - b.sessionNumber);
    const allChapters = entries.filter(e => e.type === 'chapter');

    viewer.innerHTML = getViewerHTML(entry, linkedSessions, allChapters);

    viewer.querySelector('.edit-btn')?.addEventListener('click', () => renderEntryEditor(entry));
    viewer.querySelector('.delete-btn')?.addEventListener('click', () => {
        if (confirm(`Eliminare "${entry.title}"?`)) {
            entries = entries.filter(e => e.id !== entry.id);
            saveEntries(entries);
            refreshEntries();
            viewer.innerHTML = '<div class="empty-state-msg">Seleziona un capitolo dalla lista.</div>';
        }
    });
    viewer.querySelector('#start-new-session-btn')?.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('openModuleWithItem', {
            detail: { moduleId: 'session-notes', itemId: entry.id }
        }));
    });
    
    // Listener per i pulsanti di cambio stato
    viewer.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newStatus = btn.dataset.status;
            const entryIndex = entries.findIndex(e => e.id === entry.id);
            if (entryIndex > -1) {
                entries[entryIndex].status = newStatus;
                entries[entryIndex].lastModified = Date.now();
                saveEntries(entries);
                refreshEntries();
                renderEntryViewer(entries[entryIndex]); // Ri-renderizza con il nuovo stato
                showToast(`Stato cambiato in "${newStatus}".`, 'success');
            }
        });
    });
    
    // Listener per le checkbox degli obiettivi
    viewer.querySelectorAll('.objective-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const objId = checkbox.dataset.index;
            const entryIndex = entries.findIndex(e => e.id === entry.id);
            if (entryIndex > -1) {
                const obj = entries[entryIndex].objectives?.find(o => o.id == objId);
                if (obj) {
                    obj.completed = checkbox.checked;
                    entries[entryIndex].lastModified = Date.now();
                    // Ricalcola il progresso
                    entries[entryIndex].progress = calculateProgress(entries[entryIndex].objectives);
                    saveEntries(entries);
                    refreshEntries();
                    renderEntryViewer(entries[entryIndex]);
                }
            }
        });
    });
    
    // Listener per le checkbox dei checkpoint
    viewer.querySelectorAll('.checkpoint-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const cpId = checkbox.dataset.checkpointId;
            const entryIndex = entries.findIndex(e => e.id === entry.id);
            if (entryIndex > -1) {
                const cp = entries[entryIndex].checkpoints?.find(c => c.id == cpId);
                if (cp) {
                    cp.completed = checkbox.checked;
                    entries[entryIndex].lastModified = Date.now();
                    saveEntries(entries);
                    refreshEntries();
                    renderEntryViewer(entries[entryIndex]);
                }
            }
        });
    });
}

function renderEntryEditor(entry = null) {
    // Fix: isEditing deve essere true solo se entry ha un ID valido (esiste già)
    const isEditing = !!(entry && entry.id);
    const viewer = containerElement.querySelector('#editor-content');
    const allChapters = entries.filter(e => e.type === 'chapter');
    const nextChapterNum = getNextChapterNumber();

    viewer.innerHTML = getEditorHTML(entry, isEditing, allChapters, nextChapterNum);

    currentObjs = entry ? [...(entry.objectives || [])] : [];
    currentCheckpoints = entry ? [...(entry.checkpoints || [])] : [];
    
    const type = entry?.type || (entry?.typeFromButton || 'chapter');
    if (type === 'chapter') {
        setupObjectiveListeners();
        setupCheckpointListeners();
    }
    
    viewer.querySelector('.cancel-btn')?.addEventListener('click', () => {
        // Fix: Usa isEditing per determinare se mostrare il viewer o il messaggio vuoto
        if (isEditing && entry) renderEntryViewer(entry);
        else viewer.innerHTML = '<div class="empty-state-msg">Seleziona un capitolo dalla lista o creane uno nuovo.</div>';
    });

    // Fix: Usa il click sul pulsante "Salva Voce" invece del form submit
    const saveBtn = viewer.querySelector('#save-entry-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const formType = viewer.querySelector('input[name="entry-type"]:checked')?.value || type;
            
            // Validazione titolo
            const titleInput = viewer.querySelector('#entry-title-input');
            if (!titleInput.value.trim()) {
                showToast("Il titolo è obbligatorio.", 'warning');
                titleInput.focus();
                return;
            }
            
            const chapterData = {
                id: isEditing ? entry.id : `cap-${Date.now()}`,
                type: formType,
                title: titleInput.value.trim(),
                chapterNumber: formType === 'chapter' ? (entry?.chapterNumber || nextChapterNum) : undefined,
                status: viewer.querySelector('#entry-status').value,
                parentChapterId: viewer.querySelector('#entry-parent')?.value || null,
                playerNotes: viewer.querySelector('#entry-player-summary').value,
                npcs: viewer.querySelector('#entry-npcs').value,
                locations: viewer.querySelector('#entry-locations').value,
                loot: viewer.querySelector('#entry-loot').value,
                dmNotes: viewer.querySelector('#entry-dm-notes').value,
                objectives: formType === 'chapter' ? currentObjs : undefined,
                checkpoints: formType === 'chapter' ? currentCheckpoints : undefined,
                lastModified: Date.now()
            };

            console.log(`📝 [ChapterPlanner] isEditing: ${isEditing}, entry?.id: ${entry?.id}`);
            
            if (isEditing) {
                const index = entries.findIndex(e => e.id === entry.id);
                console.log(`✏️ [ChapterPlanner] Modalità edit, index: ${index}`);
                if (index > -1) entries[index] = chapterData;
            } else {
                console.log(`➕ [ChapterPlanner] Modalità nuovo - push capitolo`);
                entries.push(chapterData);
                console.log(`➕ [ChapterPlanner] Entries dopo push: ${entries.length}`);
            }

            console.log(`💾 [ChapterPlanner] Chiamo saveEntries con ${entries.length} entries`);
            saveEntries(entries);
            refreshEntries();
            renderEntryViewer(chapterData);
            showToast("Voce salvata.", 'success');
        });
    }
    
    viewer.querySelector('#renumber-chapters-btn')?.addEventListener('click', () => {
        if(renumberAllChapters()) {
            refreshEntries();
            renderEntryEditor(entry);
        }
    });

    // Inizializza autocomplete sui campi di testo
    initAutocomplete(viewer.querySelector('#entry-player-summary'), 'campaign');
    initAutocomplete(viewer.querySelector('#entry-npcs'), 'campaign');
    initAutocomplete(viewer.querySelector('#entry-locations'), 'campaign');
    initAutocomplete(viewer.querySelector('#entry-loot'), 'campaign');
    initAutocomplete(viewer.querySelector('#entry-dm-notes'), 'campaign');
}

// --- FUNZIONI DI SETUP LISTENER ---
function setupObjectiveListeners() {
    const objContainer = containerElement.querySelector('#objectives-list');
    if (!objContainer) return;
    
    const renderObjInputs = () => {
        objContainer.innerHTML = currentObjs.map((obj, i) => getObjectiveRowHTML(obj, i)).join('');
        
        objContainer.querySelectorAll('.objective-item.editor-item').forEach(row => {
            const idx = parseInt(row.dataset.index);
            row.querySelector('.objective-text').oninput = (e) => currentObjs[idx].text = e.target.value;
            row.querySelector('.objective-description').oninput = (e) => currentObjs[idx].description = e.target.value;
            row.querySelector('.priority-select').onchange = (e) => currentObjs[idx].priority = e.target.value;
            row.querySelector('.remove-objective-btn').onclick = () => { 
                currentObjs.splice(idx, 1); 
                renderObjInputs(); 
            };
        });
    };

    renderObjInputs();
    containerElement.querySelector('#add-objective-btn').onclick = () => {
        currentObjs.push({ text: '', description: '', completed: false, priority: OBJECTIVE_PRIORITY.MAIN, id: Date.now() });
        renderObjInputs();
    };
}

function setupCheckpointListeners() {
    const cpContainer = containerElement.querySelector('#checkpoints-list');
    if (!cpContainer) return;

    const renderCpInputs = () => {
        cpContainer.innerHTML = currentCheckpoints.map((cp, i) => getCheckpointRowHTML(cp, i)).join('');
        
        cpContainer.querySelectorAll('.checkpoint-item.editor-item').forEach(row => {
            const idx = parseInt(row.dataset.index);
            row.querySelector('.checkpoint-title').oninput = (e) => currentCheckpoints[idx].title = e.target.value;
            row.querySelector('.checkpoint-description').oninput = (e) => currentCheckpoints[idx].description = e.target.value;
            row.querySelector('.remove-checkpoint-btn').onclick = () => { 
                currentCheckpoints.splice(idx, 1); 
                renderCpInputs(); 
            };
        });
    };

    renderCpInputs();
    containerElement.querySelector('#add-checkpoint-btn').onclick = () => {
        currentCheckpoints.push({ title: '', description: '', completed: false, id: Date.now() });
        renderCpInputs();
    };
}

function setupMainListeners() {
    const addChapterBtn = containerElement.querySelector('#new-chapter-btn');
    const addSideQuestBtn = containerElement.querySelector('#new-sidequest-btn');
    const savedList = containerElement.querySelector('#saved-entries-list');

    addChapterBtn?.addEventListener('click', () => renderEntryEditor({ typeFromButton: 'chapter' }));
    addSideQuestBtn?.addEventListener('click', () => renderEntryEditor({ typeFromButton: 'side-quest' }));

    savedList.addEventListener('click', (e) => {
        const li = e.target.closest('.note-list-item');
        if (!li) return;

        const id = li.dataset.id;
        const entry = entries.find(e => e.id === id);

        if (e.target.closest('.edit-entry-btn')) {
            renderEntryEditor(entry);
        } else if (e.target.closest('.delete-entry-btn')) {
            if (confirm(`Eliminare "${entry.title}"?`)) {
                entries = entries.filter(e => e.id !== entry.id);
                saveEntries(entries);
                refreshEntries();
                containerElement.querySelector('#editor-content').innerHTML = '<div class="empty-state-msg">Seleziona un capitolo dalla lista.</div>';
            }
        } else { // Se il clic è sull'elemento stesso
            renderEntryViewer(entry);
        }
    });

    containerElement.addEventListener('click', (e) => {
        const sessionLink = e.target.closest('.view-session-link');
        if (sessionLink) {
            e.preventDefault();
            const sessionId = sessionLink.dataset.sessionId;
            document.dispatchEvent(new CustomEvent('openModuleWithItem', {
                detail: { moduleId: 'session-notes', itemId: sessionId }
            }));
        }
    });
}

function initializeUI() {
    containerElement.innerHTML = getMainLayout();
    setupMainListeners();
    
    if (entries.length > 0) {
        const mostRecent = [...entries].sort((a, b) => b.lastModified - a.lastModified)[0];
        renderEntryViewer(mostRecent);
    }
    renderEntriesList();
}

const handleUIUpdate = (event) => {
    const { chapterId } = event.detail;
    refreshEntries(); // Ricarica sempre la lista per aggiornare il progresso
    const updatedChapter = entries.find(e => e.id === chapterId);

    if (updatedChapter) {
        const currentViewerTitle = containerElement.querySelector('.note-viewer h2')?.textContent;
        if (currentViewerTitle && currentViewerTitle.includes(updatedChapter.title)) {
            renderEntryViewer(updatedChapter);
        }
    }
};

// --- ESPORTAZIONE DEL MODULO ---
const ChapterPlanner = {
    render(cEl, itemToLoad = null) {
        containerElement = cEl;
        entries = loadEntries();
        initializeUI();
        document.addEventListener('chapterDataUpdated', handleUIUpdate);
    }
};

export default ChapterPlanner;