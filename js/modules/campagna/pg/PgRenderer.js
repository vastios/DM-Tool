// js/modules/campagna/pg/pg/PgRenderer.js

// CORREZIONE 1: Importa come oggetto tutte le funzioni esportate
import * as StateManager from '../../../../stateManager.js';

class PgRenderer {
    /**
     * Renderizza il modulo PG nel contenitore specificato.
     * @param {HTMLElement} container - L'elemento in cui renderizzare.
     * @param {object} data - L'oggetto dati completo della campagna.
     * @param {object} [character] - Il personaggio da visualizzare/modificare (opzionale).
     */
    static render(container, data, character = null) {
        container.innerHTML = `
            <div class="pg-manager-container">
                <aside class="pg-list-panel">
                    <h3>Gestione PG</h3>
                    <input type="search" id="pc-search" placeholder="Cerca un personaggio...">
                    <div class="pc-list" id="pc-list">
                        <!-- La lista dei PG verrà renderizzata qui -->
                    </div>
                    <button id="new-pc-btn" class="btn btn-primary">Nuovo PG</button>
                </aside>
                <main class="pg-editor-panel">
                    <div id="editor-content">
                        <!-- Il contenuto dell'editor o visualizzatore verrà renderizzato qui -->
                    </div>
                </main>
            </div>
        `;

        // Renderizza la lista dei PG
        this.renderCharactersList(container, data.pcs);

        // LOGICA CORRETTA: decide cosa mostrare nel pannello destro
        const editorContent = container.querySelector('#editor-content');
        if (character) {
            // Se è stato passato un personaggio, mostra il visualizzatore per quel personaggio
            this.renderPcViewer(container, character, data);
        } else {
            // Altrimenti, mostra lo stato vuoto iniziale
            editorContent.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 3rem; color: #aaa;">
                    <h2>Seleziona un Personaggio</h2>
                    <p>Scegli un personaggio dalla lista a sinistra per visualizzarne i dettagli, oppure clicca su "Nuovo PG" per crearne uno.</p>
                </div>
            `;
        }

        // Allega i listener principali
        this.attachMainListeners(container, data);
    }

    /**
     * Renderizza la lista dei personaggi.
     * @param {HTMLElement} container - Il contenitore principale.
     * @param {Array<object>} pcs - L'array dei personaggi.
     */
    static renderCharactersList(container, pcs = []) { // CORREZIONE 3: Default array vuoto per sicurezza
        const listContainer = container.querySelector('#pc-list');
        const searchInput = container.querySelector('#pc-search');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        // Assicurati che pcs sia un array
        const safePcs = Array.isArray(pcs) ? pcs : [];

        const filteredPcs = safePcs.filter(pc => 
            pc.characterName && pc.characterName.toLowerCase().includes(searchTerm)
        );

        listContainer.innerHTML = filteredPcs.map(pc => `
            <div class="note-list-item" data-id="${pc.id}">
                <div class="note-item-info">
                    <h3>${pc.characterName || 'Senza Nome'}</h3>
                    <p>${pc.race || 'N/D'} ${pc.classes ? ' - ' + pc.classes.map(c => `${c.class} Liv.${c.level}`).join(', ') : ''}</p>
                </div>
                <div class="note-item-actions">
                    <button class="edit-pc-btn">✏️</button>
                    <button class="delete-pc-btn">🗑️</button>
                </div>
            </div>
        `).join('');

        if (filteredPcs.length === 0) {
            listContainer.innerHTML = '<p style="text-align:center; color:#888;">Nessun personaggio trovato.</p>';
        }
    }

    /**
     * Renderizza l'editor di un personaggio.
     * @param {HTMLElement} container - Il contenitore principale.
     * @param {object} data - L'oggetto dati della campagna.
     * @param {object} [character] - Il personaggio da modificare.
     */
    static renderPcEditor(container, data, character = null) {
        const editorContent = container.querySelector('#editor-content');
        const isEditing = !!character;
        const title = isEditing ? `Modifica: ${character.characterName}` : 'Crea Nuovo Personaggio';
        const submitText = isEditing ? 'Aggiorna Personaggio' : 'Salva Personaggio';

        editorContent.innerHTML = `
            <div class="editor-form">
                <h2>${title}</h2>
                <form id="pc-form">
                    <div class="form-section" data-section="identity">
                        <div class="form-section-header"><h4>Identità</h4></div>
                        <div class="form-section-content">
                            <div class="form-group">
                                <label for="pc-characterName">Nome Personaggio</label>
                                <input type="text" id="pc-characterName" value="${character?.characterName || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="pc-race">Razza</label>
                                <input type="text" id="pc-race" value="${character?.race || ''}">
                            </div>
                            <div class="form-group">
                                <label for="pc-alignment">Allineamento</label>
                                <input type="text" id="pc-alignment" value="${character?.alignment || ''}">
                            </div>
                        </div>
                    </div>

                    <div class="form-section" data-section="classes">
                        <div class="form-section-header"><h4>Classi</h4></div>
                        <div class="form-section-content">
                            <div id="classes-list">
                                ${(character?.classes || []).map((cls, index) => this.createClassBlock(cls, index)).join('')}
                            </div>
                            <button type="button" id="add-class-btn" class="btn btn-secondary">Aggiungi Classe</button>
                        </div>
                    </div>

                    <div class="form-section" data-section="abilities">
                        <div class="form-section-header"><h4>Caratteristiche</h4></div>
                        <div class="form-section-content">
                            <div class="stats-editor-grid">
                                ${['forza', 'destrezza', 'costituzione', 'intelligenza', 'saggezza', 'carisma'].map(stat => `
                                    <div class="form-group">
                                        <label for="pc-${stat}">${stat.charAt(0).toUpperCase() + stat.slice(1)}</label>
                                        <input type="number" id="pc-${stat}" value="${character?.abilities?.[stat] || 10}" min="1" max="20">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="form-section full-width-field" data-section="background">
                        <div class="form-section-header"><h4>Background</h4></div>
                        <div class="form-section-content">
                            <div class="form-group">
                                <label for="pc-backgroundMechanical">Background (Meccanico)</label>
                                <textarea id="pc-backgroundMechanical" class="large-textarea">${character?.backgroundMechanical || ''}</textarea>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section full-width-field" data-section="combat">
                        <div class="form-section-header"><h4>Combattimento</h4></div>
                        <div class="form-section-content">
                            <div class="stats-editor-grid">
                                <div class="form-group">
                                    <label for="pc-armorClass">Classe Armatura (CA)</label>
                                    <input type="number" id="pc-armorClass" value="${character?.armorClass || 10}">
                                </div>
                                <div class="form-group">
                                    <label for="pc-currentHp">PF Attuali</label>
                                    <input type="number" id="pc-currentHp" value="${character?.currentHp || 0}">
                                </div>
                                <div class="form-group">
                                    <label for="pc-maxHp">PF Massimi</label>
                                    <input type="number" id="pc-maxHp" value="${character?.maxHp || 0}">
                                </div>
                                <div class="form-group">
                                    <label for="pc-speed">Velocità (m)</label>
                                    <input type="number" id="pc-speed" value="${character?.speed || 9}">
                                </div>
                                <div class="form-group">
                                    <label for="pc-hitDice">Dadi Vita</label>
                                    <input type="text" id="pc-hitDice" value="${character?.hitDice || ''}">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-section full-width-field" data-section="notes">
                        <div class="form-section-header"><h4>Note</h4></div>
                        <div class="form-section-content">
                            <div class="form-group">
                                <label for="pc-notes">Note Generali</label>
                                <textarea id="pc-notes" class="large-textarea">${character?.notes || ''}</textarea>
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">${submitText}</button>
                        <button type="button" id="cancel-btn" class="btn btn-secondary">Annulla</button>
                    </div>
                </form>
            </div>
        `;

        this.attachEditorListeners(container, data, character);
        this.attachCollapsibleListeners(container);
    }

    /** Listener per le sezioni collassabili */
    static attachCollapsibleListeners(container) {
        container.querySelectorAll('.form-section-header').forEach(header => {
            header.addEventListener('click', () => {
                const section = header.closest('.form-section');
                section.classList.toggle('collapsed');
            });
        });
    }

    /** Helper per creare un blocco classe */
    static createClassBlock(cls, index) {
        const classOptions = ['Barbaro', 'Bardo', 'Chierico', 'Druido', 'Guerriero', 'Monaco', 'Paladino', 'Ranger', 'Ladro', 'Mago', 'Stregone', 'Warlock'].map(opt => 
            `<option value="${opt}" ${cls.class === opt ? 'selected' : ''}>${opt}</option>`
        ).join('');

        return `
            <div class="class-block" data-index="${index}">
                <button type="button" class="remove-item-btn remove-class-btn" data-index="${index}">✕</button>
                <div class="form-group">
                    <label>Classe</label>
                    <select name="pc-class">${classOptions}</select>
                </div>
                <div class="form-group">
                    <label>Livello</label>
                    <input type="number" name="pc-level" value="${cls.level}" min="1" max="20">
                </div>
            </div>
        `;
    }

    /** Allega listener specifici dell'editor */
    static attachEditorListeners(container, data, character) {
        const form = container.querySelector('#pc-form');
        const addClassBtn = container.querySelector('#add-class-btn');
        const classesList = container.querySelector('#classes-list');
        const cancelBtn = container.querySelector('#cancel-btn');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSave(container, data, character);
            });
        }

        if (addClassBtn) {
            addClassBtn.addEventListener('click', () => {
                const newIndex = classesList.children.length;
                const newBlock = this.createClassBlock({ class: '', level: 1 }, newIndex);
                classesList.insertAdjacentHTML('beforeend', newBlock);
            });
        }

        if (classesList) {
            classesList.addEventListener('click', (e) => {
                if (e.target.closest('.remove-class-btn')) {
                    e.target.closest('.class-block').remove();
                }
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.render(container, data); // Torna alla vista principale
            });
        }
    }
    
    /** Vista Sola Lettura */
    static renderPcViewer(container, character, data) {
        const editorContent = container.querySelector('#editor-content');
        const displayName = character.characterName || 'Personaggio Senza Nome';
        
        const createSection = (title, content) => `
            <div class="pc-section">
                <h4>${title}</h4>
                ${content}
            </div>
        `;

        const abilitiesHtml = Object.entries(character.abilities || {})
            .map(([key, val]) => `<div><strong>${key.substring(0,3).toUpperCase()}:</strong> ${val}</div>`)
            .join('');

        const classesHtml = (character.classes || [])
            .map(c => `${c.class} Liv. ${c.level}`)
            .join(', ') || 'Nessuna';

        editorContent.innerHTML = `
            <div class="pc-viewer-cards-container">
                <div class="flip-card-container">
                    <div class="card-page active">
                        <div class="pc-stat-block-header">
                            <div>
                                <h2>${displayName}</h2>
                                <p>${character.race || 'N/D'} ${character.classes ? ' - ' + classesHtml : ''}</p>
                            </div>
                        </div>
                        <hr>
                        <div class="pc-abilities-grid">
                            ${abilitiesHtml}
                        </div>
                        <hr>
                        ${createSection('Identità e Background', `<p>${character.backgroundMechanical || 'Nessun background specificato.'}</p>`)}
                        ${createSection('Combattimento', `
                            <p><strong>CA:</strong> ${character.armorClass || 10} | <strong>PF:</strong> ${character.currentHp || 0}/${character.maxHp || 0}</p>
                            <p><strong>Velocità:</strong> ${character.speed || 9}m | <strong>Dadi Vita:</strong> ${character.hitDice || 'N/D'}</p>
                        `)}
                        ${character.notes ? createSection('Note', `<p>${character.notes}</p>`) : ''}
                    </div>
                </div>
            </div>
            <div class="viewer-actions" style="margin-top: 1rem; text-align: right;">
                <button class="edit-pc-btn btn btn-primary" data-id="${character.id}">✏️ Modifica</button>
            </div>
        `;

        editorContent.querySelector('.edit-pc-btn').addEventListener('click', () => {
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
                const character = data.pcs.find(c => c.id === pcId);

                if (e.target.closest('.edit-pc-btn')) {
                    this.renderPcEditor(container, data, character);
                } else if (e.target.closest('.delete-pc-btn')) {
                    this.handleDelete(pcId, container, data);
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

    // --- FUNZIONI DI GESTIONE EVENTI CORRETTE ---

    /**
     * Gestisce il salvataggio (creazione o aggiornamento) di un personaggio.
     * @param {HTMLElement} container - Il contenitore per il re-render.
     * @param {object} data - I dati della campagna.
     * @param {object|null} character - Il personaggio da aggiornare (null se è nuovo).
     */
    static handleSave(container, data, character) {
        const form = container.querySelector('#pc-form');
        if (!form) return;

        const updatedCharacter = {
            ...character, // Mantiene i dati vecchi (come l'ID) se esistono
            characterName: form.querySelector('#pc-characterName').value,
            race: form.querySelector('#pc-race').value,
            alignment: form.querySelector('#pc-alignment').value,
            abilities: {
                forza: parseInt(form.querySelector('#pc-forza').value),
                destrezza: parseInt(form.querySelector('#pc-destrezza').value),
                costituzione: parseInt(form.querySelector('#pc-costituzione').value),
                intelligenza: parseInt(form.querySelector('#pc-intelligenza').value),
                saggezza: parseInt(form.querySelector('#pc-saggezza').value),
                carisma: parseInt(form.querySelector('#pc-carisma').value),
            },
            backgroundMechanical: form.querySelector('#pc-backgroundMechanical').value,
            armorClass: parseInt(form.querySelector('#pc-armorClass').value),
            currentHp: parseInt(form.querySelector('#pc-currentHp').value),
            maxHp: parseInt(form.querySelector('#pc-maxHp').value),
            speed: parseInt(form.querySelector('#pc-speed').value),
            hitDice: form.querySelector('#pc-hitDice').value,
            notes: form.querySelector('#pc-notes').value,
            classes: [] // Raccoglie le classi dinamiche
        };

        // Logica per raccogliere le classi
        const classBlocks = form.querySelectorAll('.class-block');
        classBlocks.forEach(block => {
            const className = block.querySelector('select[name="pc-class"]').value;
            const level = parseInt(block.querySelector('input[name="pc-level"]').value);
            if (className && level) {
                updatedCharacter.classes.push({ class: className, level: level });
            }
        });

        if (!character) {
            // È un nuovo personaggio
            updatedCharacter.id = 'pc_' + Date.now(); // ID univoco semplice
            data.pcs.push(updatedCharacter);
        } else {
            // È un aggiornamento
            const index = data.pcs.findIndex(c => c.id === character.id);
            if (index > -1) {
                data.pcs[index] = updatedCharacter;
            }
        }

        // CORREZIONE 2: Usa la funzione corretta dello StateManager
        StateManager.updateCampaignPcs(data.pcs);
        console.log('✅ Personaggio salvato:', updatedCharacter);
        
        // Re-renderizza l'intero modulo per mostrare la lista aggiornata
        this.render(container, data);
    }

    /**
     * Gestisce l'eliminazione di un personaggio.
     * @param {string} pcId - L'ID del personaggio da eliminare.
     * @param {HTMLElement} container - Il contenitore per il re-render.
     * @param {object} data - I dati della campagna.
     */
    static handleDelete(pcId, container, data) {
        if (confirm('Sei sicuro di voler eliminare questo personaggio?')) {
            data.pcs = data.pcs.filter(c => c.id !== pcId);
            
            // CORREZIONE 2: Usa la funzione corretta dello StateManager
            StateManager.updateCampaignPcs(data.pcs);
            console.log('🗑️ Personaggio eliminato:', pcId);
            
            // Dopo l'eliminazione, renderizza di nuovo il modulo per aggiornare la lista
            this.render(container, data);
        }
    }
}

export default PgRenderer;