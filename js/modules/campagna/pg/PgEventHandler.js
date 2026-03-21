// js/modules/campagna/pg/PgEventHandler.js

import  PgRenderer  from './PgRenderer.js';
import { savePlayerCharacters } from './PgDataManager.js';
import { showToast } from '../../../../utils/toast.js';

/**
 * Classe che gestisce tutti gli eventi e le logiche di interazione per il modulo PG.
 */
class PgEventHandler {
    /**
     * Gestisce l'eliminazione di un personaggio.
     * @param {string} pcId - L'ID del personaggio da eliminare.
     * @param {HTMLElement} container - Il contenitore principale.
     * @param {Object} data - L'oggetto con tutti i dati.
     */
    static handleDelete(pcId, container, data) {
        const character = data.characters.find(c => c.id === pcId);
        if (!character) return;

        const confirmDelete = confirm(`Sei sicuro di voler eliminare "${character.characterName || 'il personaggio'}"? Questa azione non può essere annullata.`);
        if (!confirmDelete) return;

        const updatedCharacters = data.characters.filter(c => c.id !== pcId);
        savePlayerCharacters(updatedCharacters);

        // Re-renderizza la vista
        PgRenderer.renderCharactersList(container, updatedCharacters);
        container.querySelector('#pc-viewer-area').innerHTML = '<p>Seleziona un personaggio dalla lista per visualizzarlo o crearne uno nuovo.</p>';
        
        showToast(`Personaggio eliminato.`, 'success');
    }

    /**
     * Imposta tutti i listener necessari all'interno del form di creazione/modifica.
     * @param {HTMLElement} editorContainer - Il contenitore dell'editor.
     * @param {Object} data - L'oggetto con tutti i dati.
     * @param {Object} [character=null] - Il personaggio in fase di modifica.
     */
    static setupFormListeners(editorContainer, data, character = null) {
        const saveBtn = editorContainer.querySelector('#save-pc-btn');
        const cancelBtn = editorContainer.querySelector('#cancel-pc-btn');
        const form = editorContainer.querySelector('#pc-editor-form');
        const mainContainer = editorContainer.closest('.pg-manager-container');
        const { characters } = data;

        // Listener per il pulsante Annulla
        cancelBtn.addEventListener('click', () => {
            if (character) {
                PgRenderer.renderPcViewer(mainContainer, character, data);
            } else {
                PgRenderer.render(mainContainer, data);
            }
        });

        // Listener per i pulsanti "Aggiungi" nelle liste dinamiche
        editorContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-item-btn')) {
                const targetSection = e.target.dataset.target;
                const sectionConfig = data.editorConfig[targetSection];
                const listContainer = e.target.nextElementSibling;
                const newIndex = listContainer.children.length;
                this.addDynamicListItem(listContainer, targetSection, sectionConfig, data, {}, newIndex);
            }
        });

        // Listener per i pulsanti "Rimuovi" nelle liste dinamiche
        editorContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item-btn')) {
                e.target.closest('.dynamic-item-block').remove();
            }
        });

        // Listener per il pulsante "Aggiungi Incantesimo"
        const addSpellBtn = editorContainer.querySelector('#add-spell-btn');
        if (addSpellBtn) {
            addSpellBtn.addEventListener('click', () => this.showSpellSelectionModal(editorContainer, data));
        }

        // Listener per la rimozione degli incantesimi
        editorContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-spell-btn')) {
                e.target.closest('.selected-spell-item').remove();
            }
        });

        // Listener principale per il salvataggio
        saveBtn.addEventListener('click', () => this.handleSave(form, mainContainer, data, character), { once: true });
    }

    /**
     * Gestisce la logica di salvataggio del personaggio.
     * @param {HTMLFormElement} form - Il form dell'editor.
     * @param {HTMLElement} mainContainer - Il contenitore principale del modulo.
     * @param {Object} data - L'oggetto con tutti i dati.
     * @param {Object} [character=null] - Il personaggio in fase di modifica.
     */
    static handleSave(form, mainContainer, data, character = null) {
        const characterData = { abilities: {}, skills: [], spells: [] };
        const { editorConfig, characters } = data;

        // Raccolta dati dal form
        for (const [sectionKey, sectionConfig] of Object.entries(editorConfig)) {
            if (sectionConfig.type === 'dynamic-list') {
                characterData[sectionKey] = [];
                form.querySelectorAll(`.dynamic-item-block[data-section="${sectionKey}"]`).forEach(block => {
                    const item = {};
                    for (const fieldKey of Object.keys(sectionConfig.itemTemplate)) {
                        const element = block.querySelector(`#pc-${sectionKey}-${block.dataset.index}-${fieldKey}`);
                        if (element) {
                            const value = element.type === 'number' ? parseInt(element.value, 10) : element.value.trim();
                            item[fieldKey] = value;
                        }
                    }
                    characterData[sectionKey].push(item);
                });
            } else if (sectionConfig.type === 'grid') {
                sectionConfig.fields.forEach(field => {
                    const value = parseInt(form.querySelector(`#pc-${field.id}`).value, 10);
                    if (!isNaN(value)) {
                        characterData.abilities[field.id] = value;
                    }
                });
            } else if (sectionConfig.type === 'checkbox-group') {
                const checkedBoxes = form.querySelectorAll(`input[name="pc-${sectionKey}"]:checked`);
                checkedBoxes.forEach(cb => characterData[sectionKey].push(cb.value));
            } else if (sectionConfig.type === 'dynamic-spell-list') {
                const spellItems = form.querySelectorAll('.selected-spell-item');
                spellItems.forEach(item => {
                    const index = item.dataset.spellIndex;
                    if (index) {
                        characterData[sectionKey].push({ index });
                    }
                });
            } else if (sectionConfig.fields) {
                for (const [fieldKey, fieldConfig] of Object.entries(sectionConfig.fields)) {
                    const element = form.querySelector(`#pc-${fieldKey}`);
                    if (element) {
                        const value = element.type === 'number' ? parseInt(element.value, 10) : element.value.trim();
                        // Salva se il valore non è vuoto OPPURE se il campo è obbligatorio.
                        if (value !== '' || fieldConfig.required) {
                            if (element.type === 'number' && isNaN(value) && !fieldConfig.required) {
                                continue; // Salta al prossimo campo
                            }
                            characterData[fieldKey] = value;
                        }
                    }
                }
            }
        }
        
        // Creazione dell'oggetto finale
        const now = Date.now();
        const finalCharacterData = {
            ...characterData,
            id: character ? character.id : `pc-${now}`,
            currentHp: character ? character.currentHp : characterData.maxHp || 0,
            tempHp: character ? character.tempHp : 0,
            savingThrows: character ? character.savingThrows : [],
            attacks: character ? character.attacks : [],
            inventory: character ? character.inventory : [],
            lastModified: now
        };
        
        // Pulizia campi obsoleti
        delete finalCharacterData.background;
        delete finalCharacterData.class;
        delete finalCharacterData.level;

        // Aggiornamento dell'array dei personaggi
        const updatedCharacters = (character && character.id)
            ? characters.map(c => c.id === character.id ? finalCharacterData : c)
            : [...characters, finalCharacterData];
        
        // Salvataggio e re-render
        savePlayerCharacters(updatedCharacters);
        PgRenderer.renderCharactersList(mainContainer, updatedCharacters);
        PgRenderer.renderPcViewer(mainContainer, finalCharacterData, data);
        
        const actionLabel = (character && character.id) ? 'aggiornato' : 'creato';
        showToast(`Personaggio "${finalCharacterData.characterName || 'Senza Nome'}" ${actionLabel}.`, 'success');
    }

    /**
     * Mostra una modale per la selezione degli incantesimi.
     * @param {HTMLElement} editorContainer - Il contenitore dell'editor.
     * @param {Object} data - L'oggetto con tutti i dati.
     */
    static showSpellSelectionModal(editorContainer, data) {
        const modal = document.createElement('div');
        modal.className = 'spell-selection-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Seleziona un Incantesimo</h3>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body">
                    <input type="text" id="spell-search-input" class="list-search" placeholder="Cerca incantesimo...">
                    <ul id="spell-selection-list"></ul>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.modal-close');
        const searchInput = modal.querySelector('#spell-search-input');
        const list = modal.querySelector('#spell-selection-list');
        
        const renderSpellList = (searchTerm = '') => {
            list.innerHTML = '';
            const filteredSpells = data.spells.filter(spell => 
                spell.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (filteredSpells.length === 0) {
                list.innerHTML = '<li>Nessun incantesimo trovato.</li>';
                return;
            }
            filteredSpells.forEach(spell => {
                const li = document.createElement('li');
                li.textContent = spell.name;
                li.dataset.spellIndex = spell.index;
                list.appendChild(li);
            });
        };

        searchInput.addEventListener('input', () => renderSpellList(searchInput.value));
        renderSpellList();

        const closeModal = () => modal.remove();
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

        list.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (li && li.dataset.spellIndex) {
                const spellIndex = li.dataset.spellIndex;
                const spell = data.spells.find(s => s.index === spellIndex);
                if (spell) {
                    const spellListContainer = editorContainer.querySelector('#selected-spells-list');
                    if (spellListContainer) {
                        if (!spellListContainer.querySelector(`[data-spell-index="${spellIndex}"]`)) {
                            const spellItem = document.createElement('div');
                            spellItem.className = 'selected-spell-item';
                            spellItem.dataset.spellIndex = spellIndex;
                            spellItem.innerHTML = `
                                <span>${spell.name}</span>
                                <button type="button" class="remove-spell-btn">✕</button>
                            `;
                            spellListContainer.appendChild(spellItem);
                        }
                    }
                }
                closeModal();
            }
        });
    }
}

export { PgEventHandler };