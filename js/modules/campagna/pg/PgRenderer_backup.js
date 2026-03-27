// js/modules/campagna/pg/pg/PgRenderer.js

import { PgEventHandler } from './PgEventHandler.js';
import { showToast } from '../../../../utils/toast.js';

/**
 * Classe responsabile per il rendering di tutti gli elementi visivi del modulo PG.
 * Utilizza un approccio data-driven per generare l'HTML dinamicamente.
 * Tutti i metodi sono statici per poter essere chiamati direttamente sulla classe.
 */
class PgRenderer {
    /**
     * Metodo principale di rendering.
     * @param {HTMLElement} container - Il contenitore principale.
     * @param {Object} data - L'oggetto contenente tutti i dati della campagna.
     */
    static render(container, data) {
        if (!container) {
            console.error("PgRenderer.render: Il container fornito è nullo.");
            return;
        }

        container.innerHTML = `
            <div class="pg-manager-container">
                <aside class="pg-sidebar">
                    <div class="sidebar-header">
                        <h2>Personaggi</h2>
                        <button id="new-pc-btn" class="btn btn-primary">Nuovo PG</button>
                    </div>
                    <input type="text" id="pc-search" class="list-search" placeholder="Cerca personaggio...">
                    <ul id="pc-list" class="note-list"></ul>
                </aside>
                <main class="pg-main-content">
                    <div id="pc-viewer-area" class="content-area">
                        <p>Seleziona un personaggio dalla lista per visualizzarlo o crearne uno nuovo.</p>
                    </div>
                </main>
            </div>
        `;

        // Utilizziamo requestAnimationFrame per assicurarci che il DOM sia pronto
        requestAnimationFrame(() => {
            // >>> MODIFICA 1: Usiamo 'data.pcs' invece di 'data.characters' <<<
            this.renderCharactersList(container, data.pcs);
            this.attachMainListeners(container, data);
        });
    }

    /**
     * Renderizza la lista dei personaggi nella sidebar.
     * @param {HTMLElement} container - Il contenitore principale.
     * @param {Array} characters - L'array dei personaggi da visualizzare.
     */
    static renderCharactersList(container, characters = []) {
        const list = container.querySelector('#pc-list');
        if (!list) return;

        // Se characters è undefined o null, usa un array vuoto (grazie al parametro di default)
        const safeCharacters = characters || [];

        const searchInput = container.querySelector('#pc-search');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        list.innerHTML = '';

        const filteredCharacters = safeCharacters.filter(pc => {
            const displayName = (pc.characterName || pc.playerName || 'Personaggio Senza Nome');
            return displayName.toLowerCase().includes(searchTerm);
        });

        if (filteredCharacters.length === 0) {
            list.innerHTML = '<li class="no-results">Nessun personaggio trovato.</li>';
            return;
        }

        filteredCharacters.forEach(pc => {
            const li = document.createElement('li');
            li.className = 'note-list-item';
            li.dataset.id = pc.id;
            
            const displayName = (pc.characterName || pc.playerName || 'Personaggio Senza Nome');
            const raceInfo = pc.race ? ` - ${pc.race}` : '';
            const classInfo = pc.classes && pc.classes.length > 0 ? ` (${pc.classes.map(c => c.class).join('/')})` : '';

            li.innerHTML = `
                <div class="note-item-header">
                    <span class="note-item-title"><strong>${displayName}</strong>${raceInfo}${classInfo}</span>
                </div>
                <div class="note-item-actions">
                    <button class="edit-pc-btn" title="Modifica">✏️</button>
                    <button class="add-to-combat-list-btn" title="Aggiungi al Combattimento">⚔️</button>
                    <button class="delete-pc-btn" title="Elimina">🗑️</button>
                </div>
            `;
            list.appendChild(li);
        });
    }

    /**
     * Renderizza l'editor (Creazione/Modifica).
     */
    static renderPcEditor(container, data, character = null) {
        const viewerArea = container.querySelector('#pc-viewer-area');
        const isEditing = !!character;
        const title = isEditing ? 'Modifica Personaggio' : 'Crea Nuovo Personaggio';

        viewerArea.innerHTML = `
            <div class="pc-editor-container">
                <div class="editor-header">
                    <h2>${title}</h2>
                </div>
                <form id="pc-editor-form" class="editor-form">
                    </form>
                <div class="editor-actions">
                    <button type="button" id="save-pc-btn" class="btn btn-success">Salva Personaggio</button>
                    <button type="button" id="cancel-pc-btn" class="btn btn-secondary">Annulla</button>
                </div>
            </div>
        `;

        const form = viewerArea.querySelector('#pc-editor-form');
        const { editorConfig } = data;

        for (const [sectionKey, sectionConfig] of Object.entries(editorConfig)) {
            const section = document.createElement('div');
            section.className = 'form-section';
            section.dataset.section = sectionKey;
            section.innerHTML = `<h3>${sectionConfig.label}</h3>`;

            if (sectionConfig.type === 'dynamic-list') {
                this.renderDynamicList(section, sectionKey, sectionConfig, data, character);
            } else if (sectionConfig.type === 'grid') {
                this.renderGrid(section, sectionKey, sectionConfig, character);
            } else if (sectionConfig.type === 'checkbox-group') {
                this.renderCheckboxGroup(section, sectionKey, sectionConfig, character);
            } else if (sectionConfig.type === 'dynamic-spell-list') {
                this.renderSpellList(section, sectionKey, sectionConfig, data, character);
            } else {
                this.renderStandardFields(section, sectionKey, sectionConfig, character, data);
            }
            form.appendChild(section);
        }

        PgEventHandler.setupFormListeners(viewerArea, data, character);
    }

    /** Helper per campi standard */
    static renderStandardFields(section, sectionKey, sectionConfig, character, data) {
        for (const [fieldKey, fieldConfig] of Object.entries(sectionConfig.fields)) {
            const value = character ? character[fieldKey] : (fieldConfig.default || '');
            const required = fieldConfig.required ? 'required' : '';
            const fieldId = `pc-${fieldKey}`;
            
            let fieldHtml = '';
            if (fieldConfig.type === 'textarea') {
                fieldHtml = `<textarea id="${fieldId}" ${required} placeholder="${fieldConfig.label}...">${value}</textarea>`;
            } else if (fieldConfig.type === 'select') {
                const options = fieldConfig.options(data).map(opt => 
                    `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>${opt.text}</option>`
                ).join('');
                fieldHtml = `<select id="${fieldId}" ${required}>${options}</select>`;
            } else {
                fieldHtml = `<input type="${fieldConfig.type}" id="${fieldId}" value="${value}" ${required}>`;
            }

            section.innerHTML += `
                <div class="form-group">
                    <label for="${fieldId}">${fieldConfig.label}</label>
                    ${fieldHtml}
                </div>
            `;
        }
    }

    /** Helper per liste dinamiche (es. Classi) */
    static renderDynamicList(section, sectionKey, sectionConfig, data, character) {
        const addButtonLabel = sectionConfig.addButtonLabel || `+ Aggiungi`;
        section.innerHTML += `<button type="button" class="add-item-btn" data-target="${sectionKey}">${addButtonLabel}</button>`;
        const listContainer = document.createElement('div');
        listContainer.className = 'dynamic-list-container';
        section.appendChild(listContainer);

        const items = character ? character[sectionKey] || [] : [];
        items.forEach((item, index) => {
            this.addDynamicListItem(listContainer, sectionKey, sectionConfig, data, item, index);
        });
    }

    static addDynamicListItem(container, sectionKey, sectionConfig, data, itemData = {}, index = 0) {
        const block = document.createElement('div');
        block.className = 'dynamic-item-block class-block';
        block.dataset.index = index;

        for (const [fieldKey, fieldConfig] of Object.entries(sectionConfig.itemTemplate)) {
            const value = itemData[fieldKey] || (fieldConfig.default || '');
            const fieldId = `pc-${sectionKey}-${index}-${fieldKey}`;
            
            let fieldHtml = '';
            if (fieldConfig.type === 'select') {
                const options = fieldConfig.options(data).map(opt => 
                    `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>${opt.text}</option>`
                ).join('');
                fieldHtml = `<select id="${fieldId}">${options}</select>`;
            } else {
                fieldHtml = `<input type="${fieldConfig.type}" id="${fieldId}" value="${value}" min="${fieldConfig.min || ''}" max="${fieldConfig.max || ''}">`;
            }

            block.innerHTML += `
                <div class="form-group">
                    <label for="${fieldId}">${fieldConfig.label}</label>
                    ${fieldHtml}
                </div>
            `;
        }
        block.innerHTML += `<button type="button" class="remove-item-btn remove-class-btn" data-index="${index}">✕</button>`;
        container.appendChild(block);
    }

    /** Helper per caratteristiche (Griglia) */
    static renderGrid(section, sectionKey, sectionConfig, character) {
        const grid = document.createElement('div');
        grid.className = 'abilities-grid';
        sectionConfig.fields.forEach(field => {
            const value = (character && character.abilities) ? character.abilities[field.id] : (field.default || 10);
            grid.innerHTML += `
                <div class="form-group">
                    <label for="pc-${field.id}">${field.label}</label>
                    <input type="number" id="pc-${field.id}" value="${value}" min="${field.min}" max="${field.max}">
                </div>
            `;
        });
        section.appendChild(grid);
    }

    /** Helper per competenze */
    static renderCheckboxGroup(section, sectionKey, sectionConfig, character) {
        const container = document.createElement('div');
        container.className = 'checkbox-group';
        const selectedSkills = character ? character[sectionKey] || [] : [];
        sectionConfig.options().forEach(option => {
            const isChecked = selectedSkills.includes(option.value) ? 'checked' : '';
            container.innerHTML += `
                <label class="checkbox-label">
                    <input type="checkbox" name="pc-${sectionKey}" value="${option.value}" ${isChecked}>
                    ${option.text}
                </label>
            `;
        });
        section.appendChild(container);
    }

    /** Helper per Incantesimi */
    static renderSpellList(section, sectionKey, sectionConfig, data, character) {
        section.innerHTML += `<button type="button" id="add-spell-btn" class="btn btn-secondary">${sectionConfig.addButtonLabel}</button>`;
        const listContainer = document.createElement('div');
        listContainer.id = 'selected-spells-list';
        listContainer.className = 'selected-spells-list';
        section.appendChild(listContainer);

        const selectedSpells = character ? character.spells || [] : [];
        selectedSpells.forEach(spellData => {
            const spell = data.spells.find(s => s.index === spellData.index);
            if (spell) {
                this.addSpellItem(listContainer, spell.index, spell.name);
            }
        });
    }
    
    static addSpellItem(container, spellIndex, spellName) {
        if (container.querySelector(`[data-spell-index="${spellIndex}"]`)) return;
        
        const spellItem = document.createElement('div');
        spellItem.className = 'selected-spell-item';
        spellItem.dataset.spellIndex = spellIndex;
        spellItem.innerHTML = `
            <span>${spellName}</span>
            <button type="button" class="remove-spell-btn">✕</button>
        `;
        container.appendChild(spellItem);
    }

    /** Vista Sola Lettura */
    static renderPcViewer(container, character, data) {
        const viewerArea = container.querySelector('#pc-viewer-area');
        const displayName = character.characterName || 'Personaggio Senza Nome';
        
        const createSection = (title, content) => `
            <div class="viewer-section">
                <h3>${title}</h3>
                ${content}
            </div>
        `;

        const abilitiesHtml = Object.entries(character.abilities || {})
            .map(([key, val]) => `<span><strong>${key.substring(0,3).toUpperCase()}:</strong> ${val}</span>`)
            .join(' | ');

        const classesHtml = (character.classes || [])
            .map(c => `${c.class} Liv. ${c.level}`)
            .join(', ') || 'Nessuna';

        viewerArea.innerHTML = `
            <div class="pc-viewer-container">
                <div class="viewer-header">
                    <h2>${displayName}</h2>
                    <div class="viewer-actions">
                        <button class="edit-pc-btn btn btn-primary" data-id="${character.id}">✏️ Modifica</button>
                    </div>
                </div>
                <div class="viewer-content">
                    ${createSection('Identità', `
                        <p><strong>Razza:</strong> ${character.race || 'N/D'} | <strong>Allineamento:</strong> ${character.alignment || 'N/D'}</p>
                        <p><strong>Background:</strong> ${character.backgroundMechanical || 'N/D'}</p>
                    `)}
                    ${createSection('Classi', `<p>${classesHtml}</p>`)}
                    ${createSection('Caratteristiche', `<div class="stats-line">${abilitiesHtml}</div>`)}
                    ${createSection('Combattimento', `
                        <p><strong>CA:</strong> ${character.armorClass || 10} | <strong>PF:</strong> ${character.currentHp || 0}/${character.maxHp || 0}</p>
                        <p><strong>Velocità:</strong> ${character.speed || 9}m | <strong>Dadi Vita:</strong> ${character.hitDice || 'N/D'}</p>
                    `)}
                    ${createSection('Note', `<p>${character.notes || 'Nessuna nota presente.'}</p>`)}
                </div>
            </div>
        `;

        // Listener per il tasto modifica nella view
        viewerArea.querySelector('.edit-pc-btn').addEventListener('click', () => {
            this.renderPcEditor(container, data, character);
        });
    }

    /** Listener Principali */
    static attachMainListeners(container, data) {
        const searchInput = container.querySelector('#pc-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.renderCharactersList(container, data.pcs);
            });
        }

        const list = container.querySelector('#pc-list');
        if (list) {
            list.addEventListener('click', (e) => {
                const listItem = e.target.closest('.note-list-item');
                if (!listItem || !listItem.dataset.id) return;

                const pcId = listItem.dataset.id;
                // >>> MODIFICA 1: Usiamo 'data.pcs' invece di 'data.characters' <<<
                const character = data.pcs.find(c => c.id === pcId);

                if (e.target.closest('.edit-pc-btn')) {
                    this.renderPcEditor(container, data, character);
                } else if (e.target.closest('.delete-pc-btn')) {
                    PgEventHandler.handleDelete(pcId, container, data);
                } else {
                    this.renderPcViewer(container, character, data);
                }
            });
        }

        const newPcBtn = container.querySelector('#new-pc-btn');
        if (newPcBtn) {
            newPcBtn.addEventListener('click', () => this.renderPcEditor(container, data));
        }
    }
}

// >>> MODIFICA 2: Esportazione predefinita per compatibilità con main.js <<<
export default PgRenderer;