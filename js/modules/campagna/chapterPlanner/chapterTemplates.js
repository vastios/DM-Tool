// js/modules/campagna/chapterPlanner/chapterTemplates.js (VERSIONE CORRETTA)

import { toRoman, ENTRY_STATUS, OBJECTIVE_PRIORITY } from './chapterConstants.js';
import { escapeHtml } from '../../../../utils/htmlHelpers.js';
import { linkifyCampaignReferences } from '../../../../utils/campaignLinker.js';

// --- HELPER PER GLI INDICATORI DI STATO ---
const getStatusLabel = (status) => {
    const labels = {
        [ENTRY_STATUS.PLANNING]: 'In Pianificazione',
        [ENTRY_STATUS.ACTIVE]: 'Attiva',
        [ENTRY_STATUS.COMPLETED]: 'Completata',
        [ENTRY_STATUS.ON_HOLD]: 'In Sospeso'
    };
    return labels[status] || status;
};

const getStatusIcon = (status) => {
    const icons = {
        [ENTRY_STATUS.PLANNING]: '📝',
        [ENTRY_STATUS.ACTIVE]: '▶️',
        [ENTRY_STATUS.COMPLETED]: '✅',
        [ENTRY_STATUS.ON_HOLD]: '⏸️'
    };
    return icons[status] || '📝';
};

// --- TEMPLATES PRINCIPALI ---

export const getMainLayout = () => `
    <div class="session-notes-container">
        <div class="notes-list-panel">
            <div class="panel-header">
                <h2>Capitoli e Side Quest</h2>
                <div class="header-actions">
                    <button id="new-chapter-btn" class="event-btn" title="Nuovo Capitolo">+ Capitolo</button>
                    <button id="new-sidequest-btn" class="event-btn secondary" title="Nuova Side Quest">+ Side Quest</button>
                </div>
            </div>
            <ul id="saved-entries-list" class="saved-notes-list"></ul>
        </div>
        <div class="note-editor-panel">
            <div id="editor-content">
                <p style="text-align: center; color: #888; margin-top: 3rem;">Seleziona un capitolo o una side quest per visualizzarla o crearne una nuova.</p>
            </div>
        </div>
    </div>
`;

export const getSidebarItemHTML = (entry, isNested = false) => {
    const statusIndicator = getStatusIcon(entry.status);
    const romanNumeral = entry.type === 'chapter' ? `${toRoman(entry.chapterNumber || 0)}. ` : '';
    const type = entry.type === 'chapter' ? 'Capitolo Principale' : 'Side Quest';
    const progress = entry.progress || 0;

    return `
        <li class="note-list-item status-${entry.status} ${isNested ? 'nested-item' : ''}" data-id="${entry.id}">
            <div class="note-item-info">
                <h3>${entry.type === 'chapter' ? '📖' : '🗺️'} ${romanNumeral}${escapeHtml(entry.title)} ${statusIndicator}</h3>
                <p><em>${type}</em></p>
                <p>Progresso: ${progress}%</p>
                <small>Ultima modifica: ${new Date(entry.lastModified).toLocaleString('it-IT')}</small>
            </div>
            <div class="note-item-actions">
                <button class="edit-entry-btn">Modifica</button>
                <button class="delete-entry-btn">Elimina</button>
            </div>
        </li>
    `;
};

export const getViewerHTML = (entry, linkedSessions, allChapters) => {
    const isChapter = entry.type === 'chapter';
    const romanValue = isChapter ? toRoman(entry.chapterNumber) : '';
    const chapterPrefix = (isChapter && romanValue) ? `CAPITOLO ${romanValue} - ` : '';
    const parentChapter = isChapter ? null : allChapters.find(c => c.id === entry.parentChapterId);

    return `
        <div class="note-viewer" style="background-color: #f5f5f5; color: #333;">
            <div class="note-viewer-header">
                <h2 style="color: #333;">${chapterPrefix}${escapeHtml(entry.title)}</h2>
                <div class="viewer-status-controls">
                    <span class="status-badge status-${entry.status}">${getStatusLabel(entry.status)}</span>
                    <div class="status-controls-group">
                        ${Object.values(ENTRY_STATUS).map(status => `
                            <button class="status-btn ${entry.status === status ? 'active' : ''}" data-status="${status}" title="${getStatusLabel(status)}">${getStatusIcon(status)}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
            ${isChapter ? renderChapterProgress(entry) : ''}
            ${isChapter ? renderChapterCheckpoints(entry) : ''}
            <p><strong class="wiki-label" style="color: #333;">Riepilogo per i Giocatori:</strong></p>
            <p class="note-viewer-content" style="color: #333;">${linkifyCampaignReferences(entry.playerNotes || '').replace(/\n/g, '<br>')}</p>
            
            <div class="related-sessions-box" style="margin: 20px 0; padding: 15px; background: #fff; border-radius: 8px; border-left: 4px solid #007bff; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <h4 style="margin: 0 0 10px 0; color: #007bff;">📅 Sessioni di questo capitolo:</h4>
                <button id="start-new-session-btn" class="action-btn small" data-chapter-id="${entry.id}" style="margin-bottom: 10px;">+ Avvia Nuova Sessione</button>
                ${linkedSessions.length > 0 ? `
                    <ul style="margin: 0; padding-left: 20px; color: #333;">
                        ${linkedSessions.map(s => `
                            <li>
                                <a href="#" class="view-session-link" data-session-id="${s.id}" style="color: #007bff; text-decoration: underline; cursor: pointer;">
                                    <strong>${escapeHtml(s.title)}</strong>
                                </a> (${new Date(s.lastModified).toLocaleDateString()})
                            </li>
                        `).join('')}
                    </ul>
                ` : '<p style="color: #666; font-style: italic;">Nessuna sessione ancora registrata per questo capitolo.</p>'}
            </div>

            <hr>
            ${!isChapter && parentChapter ? `<p><strong>Capitolo Padre:</strong> ${toRoman(parentChapter.chapterNumber)} ${parentChapter.title}</p><hr>` : ''}
            <p><strong class="wiki-label" style="color: #333;">PNG da usare:</strong></p>
            <p class="note-viewer-content" style="color: #333;">${linkifyCampaignReferences(entry.npcs || '').replace(/\n/g, '<br>')}</p>
            <p><strong class="wiki-label" style="color: #333;">Luoghi da esplorare:</strong></p>
            <p class="note-viewer-content" style="color: #333;">${linkifyCampaignReferences(entry.locations || '').replace(/\n/g, '<br>')}</p>
            <p><strong class="wiki-label" style="color: #333;">Tesoro Ottenuto:</strong></p>
            <p class="note-viewer-content" style="color: #333;">${linkifyCampaignReferences(entry.loot || '').replace(/\n/g, '<br>')}</p>
            <div class="unrevealed-status" style="background-color: #333; border-color: #000;">
                <p><strong class="wiki-label" style="color: #fff;">🕵️ Note Segrete del DM:</strong></p>
                <p class="note-viewer-content" style="color: #fff;">${linkifyCampaignReferences(entry.dmNotes || '').replace(/\n/g, '<br>')}</p>
            </div>
        </div>
    `;
};

export const getEditorHTML = (entry, isEditing, allChapters, nextChapterNumber) => {
    const type = isEditing ? entry.type : (entry?.typeFromButton || 'chapter');
    const isNew = !isEditing;

    return `
        <div class="editor-form">
            ${!entry?.typeFromButton ? `
                <div class="form-group">
                    <label>Tipo di Voce:</label>
                    <div style="display: flex; gap: 15px;">
                        <label><input type="radio" name="entry-type" value="chapter" ${type === 'chapter' ? 'checked' : ''}> Capitolo Principale</label>
                        <label><input type="radio" name="entry-type" value="side-quest" ${type === 'side-quest' ? 'checked' : ''}> Side Quest</label>
                    </div>
                </div>
            ` : ''}
            
            <div class="form-group">
                <label for="entry-title-input">Titolo:</label>
                <input type="text" id="entry-title-input" value="${escapeHtml(entry?.title || '')}" placeholder="Inserisci il titolo qui...">
            </div>

            <div id="chapter-fields" style="${type === 'chapter' ? '' : 'display: none;'}">
                ${isNew ? `<p><em>Il capitolo verrà numerato automaticamente come "${toRoman(nextChapterNumber)}".</em></p>` : `<p><em>Modifica del Capitolo ${toRoman(entry.chapterNumber)}.</em></p>`}
            </div>
            <div id="sidequest-fields" style="${type === 'side-quest' ? '' : 'display: none;'}">
                <div class="form-group">
                    <label for="entry-parent">Capitolo Padre:</label>
                    <select id="entry-parent">
                        <option value="">Nessuno (è una Side Quest indipendente)</option>
                        ${allChapters.map(chapter => `
                            <option value="${chapter.id}" ${entry?.parentChapterId === chapter.id ? 'selected' : ''}>${toRoman(chapter.chapterNumber || 0)} ${chapter.title}</option>
                        `).join('')}
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="entry-status">Stato:</label>
                <select id="entry-status">
                    ${Object.entries(ENTRY_STATUS).map(([key, value]) => `
                        <option value="${value}" ${entry?.status === value ? 'selected' : ''}>${getStatusLabel(value)}</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="entry-player-summary">Riepilogo per i Giocatori:</label>
                <textarea id="entry-player-summary" rows="3" placeholder="Una breve sintesi...">${escapeHtml(entry?.playerNotes || '')}</textarea>
            </div>
            <div class="form-group">
                <label for="entry-npcs">PNG da usare:</label>
                <textarea id="entry-npcs" rows="2" placeholder="Elenca i PNG...">${escapeHtml(entry?.npcs || '')}</textarea>
            </div>
            <div class="form-group">
                <label for="entry-locations">Luoghi da esplorare:</label>
                <textarea id="entry-locations" rows="2" placeholder="Elenca i luoghi...">${escapeHtml(entry?.locations || '')}</textarea>
            </div>
            <div class="form-group">
                <label for="entry-loot">Tesoro Ottenuto:</label>
                <textarea id="entry-loot" rows="2" placeholder="Oggetti, monete...">${escapeHtml(entry?.loot || '')}</textarea>
            </div>
            <div class="form-group">
                <label for="entry-dm-notes">Note Segrete del DM:</label>
                <textarea id="entry-dm-notes" rows="4" placeholder="I tuoi piani, trame future...">${escapeHtml(entry?.dmNotes || '')}</textarea>
            </div>
            
            ${type === 'chapter' ? createChapterSpecificFieldsHTML(entry) : ''}
            
            <div class="editor-actions">
                <button id="save-entry-btn" class="action-btn">Salva Voce</button>
                ${type === 'chapter' ? `<button id="renumber-chapters-btn" class="action-btn secondary">🔢 Rinumera</button>` : ''}
            </div>
        </div>
    `;
};


// --- TEMPLATES PER SOTTOMODULI ---

const renderChapterProgress = (entry) => {
    const progress = entry.progress || 0;
    return `
        <p><strong class="wiki-label" style="color: #333;">Progresso del Capitolo:</strong></p>
        <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${progress}%">
                <span class="progress-text">${progress}%</span>
            </div>
        </div>
        <p><strong class="wiki-label" style="color: #333;">Obiettivi del Capitolo:</strong></p>
        <ul class="objectives-list">
            ${(entry.objectives || []).map(obj => `
                <li class="objective-item ${obj.completed ? 'completed' : ''}">
                    <input type="checkbox" data-index="${obj.id}" ${obj.completed ? 'checked' : ''}>
                    <span class="priority-${obj.priority}" style="${obj.completed ? 'text-decoration: line-through;' : ''}">${escapeHtml(obj.text)}</span>
                    ${obj.description ? `<p class="objective-description">${escapeHtml(obj.description)}</p>` : ''}
                </li>
            `).join('') || '<li class="empty-list">Nessun obiettivo impostato.</li>'}
        </ul>
    `;
};

const renderChapterCheckpoints = (entry) => {
    const checkpoints = entry.checkpoints || [];
    return `
        <hr>
        <p><strong class="wiki-label" style="color: #333;">Checkpoint del Capitolo:</strong></p>
        <ul class="checkpoints-list">
            ${checkpoints.map(cp => `
                <li class="checkpoint-item ${cp.completed ? 'completed' : ''}">
                    <input type="checkbox" data-checkpoint-id="${cp.id}" ${cp.completed ? 'checked' : ''}>
                    <span>${escapeHtml(cp.title)}</span>
                    ${cp.description ? `<p class="checkpoint-description">${escapeHtml(cp.description)}</p>` : ''}
                </li>
            `).join('') || '<li class="empty-list">Nessun checkpoint definito.</li>'}
        </ul>
    `;
};

const createChapterSpecificFieldsHTML = (entry) => {
    const progress = entry?.objectives ? Math.round((entry.objectives.filter(o => o.priority === 'main' && o.completed).length / entry.objectives.filter(o => o.priority === 'main').length) * 100) : 0;
    return `
        <div class="form-group">
            <label>Progresso del Capitolo (calcolato automaticamente):</label>
            <div class="progress-input-group">
                <input type="number" id="entry-progress" min="0" max="100" value="${progress}" readonly>
                <span class="progress-perc">%</span>
            </div>
        </div>
        <div class="form-group">
            <label>Obiettivi del Capitolo (trascina per riordinare):</label>
            <div id="objectives-container">
                <button id="add-objective-btn" class="action-btn small">+ Aggiungi Obiettivo</button>
                <ul id="objectives-list" class="sortable-list"></ul>
            </div>
        </div>
        <div class="form-group">
            <label>Checkpoint del Capitolo (trascina per riordinare):</label>
            <div id="checkpoints-container">
                <button id="add-checkpoint-btn" class="action-btn small">+ Aggiungi Checkpoint</button>
                <ul id="checkpoints-list" class="sortable-list"></ul>
            </div>
        </div>
    `;
};

// --- CORREZIONE QUI ---
export const getObjectiveRowHTML = (obj, index) => `
    <li class="objective-item editor-item" draggable="true" data-index="${index}">
        <span class="drag-handle">⋮⋮</span>
        <select class="priority-select">
            <option value="${OBJECTIVE_PRIORITY.MAIN}" ${obj.priority === OBJECTIVE_PRIORITY.MAIN ? 'selected' : ''}>Principale</option>
            <option value="${OBJECTIVE_PRIORITY.SECONDARY}" ${obj.priority === OBJECTIVE_PRIORITY.SECONDARY ? 'selected' : ''}>Secondario</option>
            <option value="${OBJECTIVE_PRIORITY.OPTIONAL}" ${obj.priority === OBJECTIVE_PRIORITY.OPTIONAL ? 'selected' : ''}>Opzionale</option>
        </select>
        <input type="text" class="objective-text" value="${escapeHtml(obj.text)}" placeholder="Titolo obiettivo">
        <textarea class="objective-description" placeholder="Descrizione dettagliata...">${escapeHtml(obj.description)}</textarea>
        <button class="remove-objective-btn" data-index="${index}">✕</button>
    </li>
`;

export const getCheckpointRowHTML = (cp, index) => `
    <li class="checkpoint-item editor-item" draggable="true" data-index="${index}">
        <span class="drag-handle">⋮⋮</span>
        <input type="text" class="checkpoint-title" value="${escapeHtml(cp.title)}" placeholder="Titolo del checkpoint">
        <textarea class="checkpoint-description" placeholder="Descrizione del checkpoint...">${escapeHtml(cp.description)}</textarea>
        <button class="remove-checkpoint-btn" data-index="${index}">✕</button>
    </li>
`;