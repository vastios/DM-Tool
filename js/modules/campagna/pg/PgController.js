/**
 * PgController.js
 * ─────────────────────────────────────────────────────────────
 * Controller principale per il modulo PG Manager.
 * 
 * Layout a due colonne:
 * - Sinistra: Lista PG cliccabili
 * - Destra: Dettaglio PG o Wizard
 * 
 * @author DM Tool
 * @version 2.0.0 - Layout due colonne
 */

import { PgDataManager } from './PgDataManager.js';
import { PgViewManager } from './PgViewManager.js';
import { 
    EMPTY_PG, 
    calculateModifier, 
    calculateProficiencyBonus, 
    calculateMaxHp,
    ABILITY_KEY_TO_PROPERTY,
    PROPERTY_TO_ABILITY_KEY,
    SKILL_ABILITY_MAP,
    ALL_SPELLCASTERS
} from './PgConstants.js';
import { addMonsterToCombat } from '../../../../stateManager.js';
import { showToast } from '../../../../utils/toast.js';
import { getAutocompleteSuggestions } from '../../../../utils/campaignLinker.js';
import { backgroundDatabase } from '../../../../database/backgroundDatabase.js';

export class PgController {
    
    // ========================================================================
    // COSTRUTTORE E INIZIALIZZAZIONE
    // ========================================================================
    
    constructor(container, initialState) {
        this.container = container;
        this.initialState = initialState;
        this.dataManager = new PgDataManager();
        this.viewManager = new PgViewManager(container);
        
        this.databases = {
            races: [],
            classes: [],
            backgrounds: [],
            alignments: {},
            spells: {},
            selectedRace: null,
            selectedClass: null,
            selectedBackground: null
        };
        
        /**
         * ID del PG attualmente selezionato.
         * @type {string|null}
         */
        this.selectedPgId = null;
        
        /**
         * Modalità corrente: 'view' | 'wizard'
         * @type {string}
         */
        this.mode = 'view';
        
        /**
         * Step corrente del wizard (1-6).
         * @type {number}
         */
        this.currentStep = 1;
        
        /**
         * Dati del PG in creazione/modifica.
         * @type {Object}
         */
        this.wizardData = { ...EMPTY_PG };
        
        /**
         * Flag modalità editazione.
         * @type {boolean}
         */
        this.isEditMode = false;
        
        console.log('🎮 [PgController] Inizializzato.');
    }
    
    /**
     * Avvia il modulo.
     */
    async init() {
        console.log('🎮 [PgController] Avvio modulo...');
        
        // Mostra loading
        this.renderMainPanel(this.viewManager.showLoading());
        
        await this.loadDatabases();
        this.dataManager.loadFromState();
        this.render();
        
        console.log('🎮 [PgController] Modulo avviato.');
    }
    
    /**
     * Carica i database.
     */
    async loadDatabases() {
        console.log('🎮 [PgController] Caricamento database...');
        
        try {
            // Razze
            try {
                const raceModule = await import('../../../../database/races.js');
                this.databases.races = raceModule.raceDatabase || [];
                console.log(`🎮 [PgController] Caricate ${this.databases.races.length} razze.`);
            } catch (e) {
                console.warn('🎮 [PgController] Database razze non trovato.');
                this.databases.races = [];
            }
            
            // Classi
            try {
                const classModule = await import('../../../../database/classDatabase.js');
                this.databases.classes = classModule.classDatabase || [];
                console.log(`🎮 [PgController] Caricate ${this.databases.classes.length} classi.`);
            } catch (e) {
                console.warn('🎮 [PgController] Database classi non trovato.');
                this.databases.classes = [];
            }
            
            // Allineamenti
            try {
                const alignmentModule = await import('../../compendio/alignmentGuide.js');
                this.databases.alignments = alignmentModule.AlignmentGuide?.alignmentData || {};
                console.log(`🎮 [PgController] Caricati ${Object.keys(this.databases.alignments).length} allineamenti.`);
            } catch (e) {
                console.warn('🎮 [PgController] Database allineamenti non trovato.');
                this.databases.alignments = {};
            }
            
            // Incantesimi
            try {
                const spellModule = await import('../../../../database/spells.js');
                // Supporta sia export default che spellDatabase come named export
                if (spellModule.spellDatabase) {
                    this.databases.spells = spellModule.spellDatabase;
                } else if (spellModule.default && typeof spellModule.default === 'object') {
                    this.databases.spells = spellModule.default;
                } else if (typeof spellModule === 'object' && !Array.isArray(spellModule)) {
                    this.databases.spells = spellModule;
                } else {
                    this.databases.spells = {};
                }
                console.log(`🎮 [PgController] Caricati ${Object.keys(this.databases.spells).length} incantesimi.`);
            } catch (e) {
                console.warn('🎮 [PgController] Database incantesimi non trovato:', e.message);
                this.databases.spells = {};
            }
            
            // Incantesimi per classe
            try {
                const classSpellsModule = await import('../../../../database/classSpells.js');
                this.databases.classSpellList = classSpellsModule.classSpellList || {};
                console.log(`🎮 [PgController] Caricate liste incantesimi per ${Object.keys(this.databases.classSpellList).length} classi.`);
            } catch (e) {
                console.warn('🎮 [PgController] Database incantesimi per classe non trovato:', e.message);
                this.databases.classSpellList = {};
            }
            
            // Backgrounds (usando il database importato)
            this.databases.backgrounds = backgroundDatabase || [];
            console.log(`🎮 [PgController] Caricati ${this.databases.backgrounds.length} backgrounds.`);
            
        } catch (error) {
            console.error('🎮 [PgController] Errore caricamento database:', error);
            showToast('Errore nel caricamento dei database.', 'error');
        }
    }
    
    extractArrayFromModule(module) {
        if (Array.isArray(module)) return module;
        if (Array.isArray(module.default)) return module.default;
        if (module.default && typeof module.default === 'object') {
            const values = Object.values(module.default);
            if (values.length > 0 && values[0].index) return values;
        }
        return [];
    }
    
    extractObjectFromModule(module) {
        if (module.default && typeof module.default === 'object') return module.default;
        if (typeof module === 'object' && !Array.isArray(module)) return module;
        return {};
    }
    
    // ========================================================================
    // RENDERING
    // ========================================================================
    
    /**
     * Renderizza la vista principale.
     */
    render() {
        const pcs = this.dataManager.getAll();
        
        // Determina contenuto pannello destro
        let rightContent = null;
        
        if (this.mode === 'wizard') {
            // Modalità wizard
            const errors = [];
            rightContent = this.viewManager.renderWizard(
                this.currentStep, 
                this.wizardData, 
                this.databases, 
                errors
            );
        } else if (this.selectedPgId) {
            // Modalità visualizzazione PG
            const pg = this.dataManager.getById(this.selectedPgId);
            if (pg) {
                rightContent = this.viewManager.renderCharacterSheet(pg, this.databases);
            }
        }
        // Se nessun PG selezionato e non in wizard, rightContent = null (messaggio vuoto)
        
        // Renderizza layout principale
        this.viewManager.renderMainLayout(pcs, this.selectedPgId, rightContent);
        this.bindEvents();
    }
    
    /**
     * Aggiorna solo il pannello destro.
     */
    renderMainPanel(content) {
        const mainPanel = this.container.querySelector('.pg-content');
        if (mainPanel) {
            mainPanel.innerHTML = content;
            this.bindEvents();
        }
    }
    
    // ========================================================================
    // GESTIONE EVENTI
    // ========================================================================
    
    /**
     * Collega gli event listener.
     */
    bindEvents() {
        // Click
        this.container.onclick = (e) => this.handleClick(e);
        
        // Change (select, checkbox)
        this.container.onchange = (e) => this.handleChange(e);
        
        // Input (text, number, textarea)
        this.container.oninput = (e) => this.handleInput(e);
    }
    
    /**
     * Gestisce i click.
     */
    handleClick(e) {
        const target = e.target;
        const button = target.closest('button');
        const card = target.closest('.pg-sidebar-card');
        
        // Click su card PG (selezione)
        if (card && !button) {
            this.selectPg(card.dataset.pgId);
            return;
        }
        
        if (!button) return;
        
        // Pulsante Nuovo PG
        if (button.id === 'btn-new-pg') {
            this.startWizard();
            return;
        }
        
        // Navigazione wizard
        if (button.id === 'btn-prev') { this.prevStep(); return; }
        if (button.id === 'btn-next') { this.nextStep(); return; }
        if (button.id === 'btn-cancel') { this.cancelWizard(); return; }
        
        // Generazione caratteristiche
        if (button.id === 'btn-roll-abilities') { this.rollAbilities(); return; }
        if (button.id === 'btn-standard-array') { this.applyStandardArray(); return; }
        
        // Modifica caratteristiche +/-
        if (button.dataset.ability && button.dataset.action) {
            this.modifyAbility(button.dataset.ability, button.dataset.action);
            return;
        }
        
        // Azioni PG (da card o da scheda)
        const action = button.dataset.action;
        const pgId = button.dataset.pgId || this.selectedPgId;
        
        if (action === 'edit') {
            // Usa SEMPRE il pgId dal bottone, non il selectedPgId
            if (button.dataset.pgId) {
                this.editPg(button.dataset.pgId);
            } else if (this.selectedPgId) {
                this.editPg(this.selectedPgId);
            }
            return;
        }
        if (action === 'delete') {
            if (pgId) this.deletePg(pgId);
            return;
        }
        if (action === 'combat') {
            if (pgId) this.addToCombat(pgId);
            return;
        }
        
        // Aggiungi condizione
        if (button.id === 'btn-add-condition') {
            this.promptAddCondition();
            return;
        }
        
        // Rimuovi condizione
        if (button.classList.contains('remove-cond')) {
            this.removeCondition(button.dataset.cond);
            return;
        }
    }
    
    /**
     * Gestisce i change.
     */
    handleChange(e) {
        const target = e.target;
        
        // Step 1
        if (target.id === 'pg-race') this.updateRace(target.value);
        if (target.id === 'pg-class') this.updateClass(target.value);
        if (target.id === 'pg-subclass') this.wizardData.subclass = target.value;
        if (target.id === 'pg-alignment') this.wizardData.alignment = target.value;
        if (target.id === 'pg-background') this.updateBackground(target.value);
        
        // Step 2
        if (target.id?.startsWith('ability-')) {
            const key = target.id.replace('ability-', '');
            this.updateAbility(key, parseInt(target.value) || 10);
        }
        
        // Step 3
        if (target.dataset.skill) {
            this.toggleSkill(target.dataset.skill, target.checked);
        }
        
        // Step 4
        if (target.dataset.spell) {
            this.toggleSpell(target.dataset.spell, target.checked);
        }
        
        // Scheda - HP correnti
        if (target.id === 'hp-current') {
            this.updateCurrentHp(parseInt(target.value) || 0);
        }
    }
    
    /**
     * Gestisce gli input.
     */
    handleInput(e) {
        const target = e.target;
        
        if (target.id === 'pg-name') this.wizardData.name = target.value;
        if (target.id === 'pg-level') {
            const newLevel = parseInt(target.value) || 1;
            this.wizardData.level = newLevel;
            // Se il livello cambia, potrebbe cambiare la disponibilità della sottoclasse
            // Ricalcola HP e re-render per aggiornare l'UI
            this.recalculateHp();
            this.render();
            return; // Il render è già stato chiamato
        }
        if (target.id === 'pg-background') this.wizardData.background = target.value;
        if (target.id === 'pg-player') this.wizardData.playerName = target.value;
        if (target.id === 'pg-backstory') this.wizardData.backstory = target.value;
        if (target.id === 'pg-notes') this.wizardData.notes = target.value;
        if (target.id === 'pg-extra-languages') this.wizardData.extraLanguages = target.value;
        
        // HP massimi modificabili
        if (target.id === 'pg-max-hp') {
            const maxHp = parseInt(target.value) || 1;
            target.dataset.manuallyChanged = 'true';
            this.wizardData.hp = {
                ...this.wizardData.hp,
                max: maxHp,
                current: this.wizardData.hp?.current || maxHp
            };
        }
        
        // Autocomplete per i tag @ nei textarea
        if (target.classList.contains('tag-autocomplete')) {
            this.handleAutocompleteInput(target);
        }
    }
    
    /**
     * Gestisce l'autocomplete per i tag @
     */
    handleAutocompleteInput(textarea) {
        const value = textarea.value;
        const cursorPos = textarea.selectionStart;
        
        // Trova l'ultimo @ prima del cursore
        const lastAtIndex = value.lastIndexOf('@', cursorPos - 1);
        
        console.log('🎮 [PgController] Autocomplete input:', { value, cursorPos, lastAtIndex });
        
        if (lastAtIndex === -1) {
            this.hideAutocomplete(textarea);
            return;
        }
        
        // Estrae il termine di ricerca dopo @
        const searchTerm = value.substring(lastAtIndex + 1, cursorPos);
        
        // Se c'è uno spazio dopo @, nascondi il dropdown
        if (searchTerm.includes(' ') || searchTerm.includes('\n')) {
            this.hideAutocomplete(textarea);
            return;
        }
        
        // Ottieni suggerimenti
        const suggestions = getAutocompleteSuggestions(searchTerm);
        console.log('🎮 [PgController] Suggerimenti autocomplete:', suggestions.length, suggestions.slice(0, 3));
        
        // Mostra il dropdown
        this.showAutocomplete(textarea, suggestions, lastAtIndex);
    }
    
    /**
     * Mostra il dropdown dell'autocomplete
     */
    showAutocomplete(textarea, suggestions, insertPosition) {
        const dropdownId = `autocomplete-${textarea.id}`;
        let dropdown = document.getElementById(dropdownId);
        
        console.log('🎮 [PgController] showAutocomplete - dropdownId:', dropdownId, 'dropdown found:', !!dropdown);
        
        if (!dropdown) {
            console.warn('🎮 [PgController] Dropdown non trovato:', dropdownId);
            return;
        }
        
        if (suggestions.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        dropdown.innerHTML = suggestions.slice(0, 8).map(s => `
            <div class="autocomplete-item" data-name="${this.escapeHtml(s.name)}" data-section="${s.section}" data-id="${s.id}">
                <span class="autocomplete-icon">${this.getCategoryIcon(s.section)}</span>
                <span class="autocomplete-name">${this.escapeHtml(s.name)}</span>
                <span class="autocomplete-type">${s.categoryLabel}</span>
            </div>
        `).join('');
        
        dropdown.style.display = 'block';
        dropdown.dataset.insertPosition = insertPosition;
        
        console.log('🎮 [PgController] Dropdown mostrato con', suggestions.length, 'elementi');
        
        // Aggiungi event listener per i click
        dropdown.onclick = (e) => {
            const item = e.target.closest('.autocomplete-item');
            if (item) {
                this.insertTag(textarea, item.dataset.name, insertPosition);
            }
        };
    }
    
    /**
     * Nasconde il dropdown dell'autocomplete
     */
    hideAutocomplete(textarea) {
        const dropdownId = `autocomplete-${textarea.id}`;
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }
    
    /**
     * Inserisce il tag selezionato
     */
    insertTag(textarea, name, insertPosition) {
        const value = textarea.value;
        const cursorPos = textarea.selectionStart;
        
        // Sostituisci il testo dopo @ con il nome completo
        const newValue = value.substring(0, insertPosition + 1) + name + value.substring(cursorPos);
        textarea.value = newValue;
        
        // Aggiorna il wizardData
        if (textarea.id === 'pg-backstory') {
            this.wizardData.backstory = newValue;
        } else if (textarea.id === 'pg-notes') {
            this.wizardData.notes = newValue;
        }
        
        // Nascondi il dropdown
        this.hideAutocomplete(textarea);
        
        // Posiziona il cursore dopo il nome inserito
        const newCursorPos = insertPosition + 1 + name.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
    }
    
    /**
     * Ottiene l'icona per la categoria
     */
    getCategoryIcon(section) {
        const icons = {
            'npcs': '👤',
            'locations': '📍',
            'factions': '⚔️',
            'uniqueItems': '💎',
            'secrets': '🔒'
        };
        return icons[section] || '📄';
    }
    
    /**
     * Escape HTML per sicurezza
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ========================================================================
    // SELEZIONE PG
    // ========================================================================
    
    /**
     * Seleziona un PG per visualizzarlo.
     */
    selectPg(pgId) {
        console.log('🎮 [PgController] Selezione PG:', pgId);
        
        this.selectedPgId = pgId;
        this.mode = 'view';
        this.render();
    }
    
    /**
     * Deseleziona il PG corrente.
     */
    deselectPg() {
        this.selectedPgId = null;
        this.mode = 'view';
        this.render();
    }
    
    // ========================================================================
    // WIZARD
    // ========================================================================
    
    /**
     * Avvia il wizard per nuovo PG.
     */
    startWizard() {
        console.log('🎮 [PgController] Avvio wizard');
        
        this.mode = 'wizard';
        this.currentStep = 1;
        this.wizardData = { ...EMPTY_PG };
        this.isEditMode = false;
        this.databases.selectedRace = null;
        this.databases.selectedClass = null;
        
        this.render();
    }
    
    /**
     * Avvia il wizard in modalità modifica.
     */
    editPg(pgId) {
        console.log('🎮 [PgController] Modifica PG:', pgId);
        
        const pg = this.dataManager.getById(pgId);
        if (!pg) {
            showToast('PG non trovato.', 'error');
            return;
        }
        
        this.wizardData = { ...pg };
        this.isEditMode = true;
        this.selectedPgId = pgId; // Mantieni selezionato
        this.mode = 'wizard';
        this.currentStep = 1;
        
        this.databases.selectedRace = this.databases.races.find(r => r.index === pg.race);
        this.databases.selectedClass = this.databases.classes.find(c => c.index === pg.class);
        
        if (this.databases.selectedClass) {
            // Fix: usa 'sottoclassi' (italiano) invece di 'subclasses'
            this.wizardData.subclassOptions = this.databases.selectedClass.sottoclassi || this.databases.selectedClass.subclasses || [];
            this.wizardData.subclassMinLevel = this.getSubclassMinLevel(this.databases.selectedClass);
        }
        
        this.render();
    }
    
    /**
     * Step precedente.
     */
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.render();
        }
    }
    
    /**
     * Step successivo o salva.
     */
    nextStep() {
        const validation = this.dataManager.validate(this.wizardData, this.currentStep);
        
        if (!validation.isValid) {
            showToast(validation.errors[0], 'warning');
            this.render();
            return;
        }
        
        if (this.currentStep === 6) {
            this.savePg();
            return;
        }
        
        this.currentStep++;
        
        if (this.currentStep === 6) {
            this.calculateFinalStats();
        }
        
        this.render();
    }
    
    /**
     * Annulla il wizard.
     */
    cancelWizard() {
        if (confirm('Annullare? Le modifiche andranno perse.')) {
            this.mode = 'view';
            this.currentStep = 1;
            this.wizardData = { ...EMPTY_PG };
            this.render();
        }
    }
    
    // ========================================================================
    // AGGIORNAMENTO DATI WIZARD
    // ========================================================================
    
    updateRace(raceIndex) {
        this.wizardData.race = raceIndex;
        this.databases.selectedRace = this.databases.races.find(r => r.index === raceIndex);
        
        if (this.databases.selectedRace) {
            this.wizardData.raceName = this.databases.selectedRace.name;
            this.wizardData.speed = this.databases.selectedRace.speed;
            this.wizardData.racialTraits = this.databases.selectedRace.traits?.map(t => t.name) || [];
            this.wizardData.proficiencies = {
                ...this.wizardData.proficiencies,
                languages: this.databases.selectedRace.languages?.map(l => l.name) || ['Comune']
            };
        }
        
        this.render();
    }
    
    updateClass(classIndex) {
        this.wizardData.class = classIndex;
        this.databases.selectedClass = this.databases.classes.find(c => c.index === classIndex);
        
        if (this.databases.selectedClass) {
            this.wizardData.className = this.databases.selectedClass.classe || this.databases.selectedClass.name;
            this.wizardData.hitDice = {
                total: this.wizardData.level,
                current: this.wizardData.level,
                size: `d${this.databases.selectedClass.hit_die}`
            };
            this.wizardData.savingThrows = this.databases.selectedClass.saving_throws?.map(st => st.name) || [];
            // Fix: usa 'sottoclassi' (italiano) invece di 'subclasses'
            this.wizardData.subclassOptions = this.databases.selectedClass.sottoclassi || this.databases.selectedClass.subclasses || [];
            this.wizardData.subclass = '';
            // Calcola il livello minimo per la sottoclasse
            this.wizardData.subclassMinLevel = this.getSubclassMinLevel(this.databases.selectedClass);
            this.recalculateHp();
        }
        
        this.render();
    }
    
    /**
     * Determina il livello minimo per scegliere la sottoclasse
     * basandosi sulla tabella progressione
     */
    getSubclassMinLevel(selectedClass) {
        if (!selectedClass) return 1;
        
        // Nomi comuni dei privilegi che introducono la sottoclasse
        const subclassKeywords = [
            'Cammino', 'Tradizione', 'College', 'Dominio', 'Cerchio', 
            'Archetipo', 'Monachesimo', 'Giuramento', 'Conclave', 
            'Origine', 'Patrono', 'Sottoclasse'
        ];
        
        // Cerca nella tabella progressione
        const table = selectedClass.tabella_progressione || [];
        for (const row of table) {
            if (row.privilegi) {
                for (const priv of row.privilegi) {
                    if (subclassKeywords.some(k => priv.includes(k))) {
                        return row.livello || 1;
                    }
                }
            }
        }
        
        // Default: livello 1 per Stregoni e Warlock, livello 3 per altri
        const index = selectedClass.index;
        if (['sorcerer', 'warlock', 'cleric'].includes(index)) {
            return 1;
        }
        return 3;
    }
    
    updateBackground(bgIndex) {
        this.wizardData.background = bgIndex;
        this.databases.selectedBackground = this.databases.backgrounds.find(b => b.index === bgIndex);
        
        if (this.databases.selectedBackground) {
            this.wizardData.backgroundName = this.databases.selectedBackground.nome;
            // Aggiungi le abilità del background alle skills
            const bgSkills = this.databases.selectedBackground.competenze?.abilita || [];
            if (!this.wizardData.skills) this.wizardData.skills = [];
            bgSkills.forEach(skill => {
                if (!this.wizardData.skills.includes(skill)) {
                    this.wizardData.skills.push(skill);
                }
            });
        }
        
        this.render();
    }
    
    updateAbility(abilityKey, value) {
        const property = ABILITY_KEY_TO_PROPERTY[abilityKey];
        if (!property) return;
        
        this.wizardData.abilities[property] = Math.max(1, Math.min(20, value));
        this.recalculateHp();
        
        // Aggiorna solo il display senza re-render
        this.updateAbilityDisplay(abilityKey);
    }
    
    modifyAbility(abilityKey, action) {
        const property = ABILITY_KEY_TO_PROPERTY[abilityKey];
        if (!property) return;
        
        const current = this.wizardData.abilities[property] || 10;
        const newValue = action === 'increase' 
            ? Math.min(20, current + 1) 
            : Math.max(1, current - 1);
        
        this.wizardData.abilities[property] = newValue;
        this.recalculateHp();
        this.updateAbilityDisplay(abilityKey);
    }
    
    updateAbilityDisplay(abilityKey) {
        const property = ABILITY_KEY_TO_PROPERTY[abilityKey];
        const input = this.container.querySelector(`#ability-${abilityKey}`);
        const bonuses = this.databases.selectedRace?.ability_bonuses || [];
        const bonus = bonuses.find(b => b.ability_score?.index === abilityKey)?.bonus || 0;
        
        if (input) {
            input.value = this.wizardData.abilities[property];
            
            const box = input.closest('.ability-box');
            if (box) {
                const totalEl = box.querySelector('.total');
                const modEl = box.querySelector('.mod');
                
                const totalScore = this.wizardData.abilities[property] + bonus;
                const modifier = calculateModifier(totalScore);
                
                if (totalEl) totalEl.textContent = `Tot: ${totalScore}`;
                if (modEl) {
                    modEl.textContent = `${modifier >= 0 ? '+' : ''}${modifier}`;
                    modEl.className = `mod ${modifier >= 0 ? 'pos' : 'neg'}`;
                }
            }
        }
        
        this.updateHpPreview();
    }
    
    updateHpPreview() {
        const hpPreview = this.container.querySelector('.hp-preview');
        if (!hpPreview || !this.databases.selectedClass) return;
        
        const hitDieSize = this.databases.selectedClass.hit_die;
        const conMod = calculateModifier(this.wizardData.abilities.constitution);
        const level = this.wizardData.level;
        const avgPerLevel = Math.floor(hitDieSize / 2) + 1;
        const calculatedHp = hitDieSize + (avgPerLevel * (level - 1)) + (conMod * level);
        
        const formulaEl = hpPreview.querySelector('.hp-formula');
        const inputEl = hpPreview.querySelector('#pg-max-hp');
        
        if (formulaEl) {
            formulaEl.textContent = `Calcolati: ${calculatedHp} PF (d${hitDieSize} + ${conMod >= 0 ? '+' : ''}${conMod} COS × ${level})`;
        }
        
        // Aggiorna l'input solo se l'utente non ha modificato manualmente
        // o se è il primo caricamento
        if (inputEl && !inputEl.dataset.manuallyChanged) {
            inputEl.value = this.wizardData.hp?.max || calculatedHp;
        }
    }
    
    recalculateHp() {
        if (!this.databases.selectedClass) return;
        
        const hitDieSize = this.databases.selectedClass.hit_die;
        const level = this.wizardData.level;
        const conMod = calculateModifier(this.wizardData.abilities.constitution);
        const avgPerLevel = Math.floor(hitDieSize / 2) + 1;
        
        this.wizardData.hp = {
            current: hitDieSize + (avgPerLevel * (level - 1)) + (conMod * level),
            max: hitDieSize + (avgPerLevel * (level - 1)) + (conMod * level),
            temp: 0
        };
    }
    
    toggleSkill(skillName, isChecked) {
        if (!this.wizardData.skills) this.wizardData.skills = [];
        
        const numChoices = this.databases.selectedClass?.proficiency_choices?.[0]?.choose || 2;
        
        if (isChecked) {
            if (!this.wizardData.skills.includes(skillName)) {
                this.wizardData.skills.push(skillName);
            }
        } else {
            this.wizardData.skills = this.wizardData.skills.filter(s => s !== skillName);
        }
        
        // Aggiorna il contatore visivo
        const counterBox = this.container.querySelector('.skill-counter-box');
        if (counterBox) {
            const selectedCount = this.wizardData.skills.length;
            const isOverLimit = selectedCount > numChoices;
            
            counterBox.className = `skill-counter-box ${isOverLimit ? 'over-limit' : ''}`;
            
            const selectedNum = counterBox.querySelector('.selected-num');
            if (selectedNum) selectedNum.textContent = selectedCount;
            
            // Aggiorna il warning
            let warningEl = counterBox.querySelector('.counter-warning');
            if (isOverLimit) {
                if (!warningEl) {
                    warningEl = document.createElement('span');
                    warningEl.className = 'counter-warning';
                    counterBox.appendChild(warningEl);
                }
                warningEl.textContent = `⚠️ ${selectedCount - numChoices} abilità oltre il limite`;
            } else if (warningEl) {
                warningEl.remove();
            }
        }
        
        // Aggiorna TUTTE le skill labels per riflettere lo stato corretto
        this.updateAllSkillLabels(numChoices);
    }
    
    /**
     * Aggiorna tutte le etichette delle skill per riflettere lo stato corrente
     */
    updateAllSkillLabels(numChoices) {
        const allCheckboxes = this.container.querySelectorAll('input[data-skill]');
        
        allCheckboxes.forEach(checkbox => {
            const skill = checkbox.dataset.skill;
            const skillLabel = checkbox.closest('label.skill-cb');
            if (!skillLabel) return;
            
            // Verifica se la skill è selezionata
            const isSelected = this.wizardData.skills.includes(skill);
            const selectedIndex = this.wizardData.skills.indexOf(skill);
            
            // Rimuovi tutte le classi di stato
            skillLabel.classList.remove('selected', 'over-limit');
            
            // Aggiorna lo stato del checkbox
            checkbox.checked = isSelected;
            
            // Aggiungi la classe appropriata
            if (isSelected) {
                if (selectedIndex >= numChoices) {
                    skillLabel.classList.add('over-limit');
                } else {
                    skillLabel.classList.add('selected');
                }
            }
        });
    }
    
    toggleSpell(spellKey, isChecked) {
        if (!this.wizardData.spellcasting) {
            this.wizardData.spellcasting = {
                ability: null, spellSaveDC: 0, spellAttackBonus: 0,
                slots: {}, slotsMax: {}, spellsKnown: [], spellsPrepared: []
            };
        }
        
        if (isChecked) {
            if (!this.wizardData.spellcasting.spellsKnown.includes(spellKey)) {
                this.wizardData.spellcasting.spellsKnown.push(spellKey);
            }
        } else {
            this.wizardData.spellcasting.spellsKnown = 
                this.wizardData.spellcasting.spellsKnown.filter(s => s !== spellKey);
        }
        
        // Aggiorna tutte le label degli incantesimi
        this.updateAllSpellLabels();
    }
    
    /**
     * Aggiorna tutte le etichette degli incantesimi
     */
    updateAllSpellLabels() {
        const allCheckboxes = this.container.querySelectorAll('input[data-spell]');
        const knownSpells = this.wizardData.spellcasting?.spellsKnown || [];
        
        // Conta per livello
        const countByLevel = {};
        knownSpells.forEach(spell => {
            const cb = this.container.querySelector(`input[data-spell="${spell}"]`);
            if (cb) {
                const level = cb.dataset.level;
                countByLevel[level] = (countByLevel[level] || 0) + 1;
            }
        });
        
        // Aggiorna tutte le label
        allCheckboxes.forEach(checkbox => {
            const spell = checkbox.dataset.spell;
            const spellLabel = checkbox.closest('label.spell-cb');
            if (!spellLabel) return;
            
            const isSelected = knownSpells.includes(spell);
            checkbox.checked = isSelected;
            
            if (isSelected) {
                spellLabel.classList.add('selected');
            } else {
                spellLabel.classList.remove('selected');
            }
        });
        
        // Aggiorna i contatori per ogni livello
        for (let level = 0; level <= 9; level++) {
            const counter = this.container.querySelector(`.spells-level-section:nth-child(${level + 1}) .spells-counter strong`);
            if (counter) {
                counter.textContent = countByLevel[level] || 0;
            }
        }
    }
    
    rollAbilities() {
        const abilities = {};
        const keys = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        
        keys.forEach(key => {
            abilities[key] = this.roll4d6DropLowest();
        });
        
        this.wizardData.abilities = abilities;
        this.recalculateHp();
        this.render();
        
        showToast('Caratteristiche generate!', 'success');
    }
    
    roll4d6DropLowest() {
        const rolls = [];
        for (let i = 0; i < 4; i++) rolls.push(Math.floor(Math.random() * 6) + 1);
        rolls.sort((a, b) => a - b);
        rolls.shift();
        return rolls.reduce((a, b) => a + b, 0);
    }
    
    applyStandardArray() {
        const standardArray = [15, 14, 13, 12, 10, 8];
        const keys = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        
        keys.forEach((key, i) => {
            this.wizardData.abilities[key] = standardArray[i];
        });
        
        this.recalculateHp();
        this.render();
        
        showToast('Standard Array applicato.', 'info');
    }
    
    // ========================================================================
    // CALCOLO STATISTICHE FINALI
    // ========================================================================
    
    calculateFinalStats() {
        this.wizardData.proficiencyBonus = calculateProficiencyBonus(this.wizardData.level);
        this.recalculateHp();
        
        this.wizardData.initiative = calculateModifier(this.wizardData.abilities.dexterity);
        this.wizardData.armorClass = 10 + calculateModifier(this.wizardData.abilities.dexterity);
        
        // Aggiungi lingue extra
        if (this.wizardData.extraLanguages) {
            const extra = this.wizardData.extraLanguages.split(',').map(l => l.trim()).filter(l => l);
            this.wizardData.proficiencies.languages = [
                ...this.wizardData.proficiencies.languages,
                ...extra
            ];
        }
        
        // Aggiungi abilità del background alle skills se non già presenti
        const bgSkills = this.databases.selectedBackground?.competenze?.abilita || [];
        if (bgSkills.length > 0) {
            if (!this.wizardData.skills) this.wizardData.skills = [];
            bgSkills.forEach(skill => {
                if (!this.wizardData.skills.includes(skill)) {
                    this.wizardData.skills.push(skill);
                }
            });
        }
        
        // Setup spellcasting
        if (this.databases.selectedClass && ALL_SPELLCASTERS.includes(this.databases.selectedClass.index)) {
            const spellAbility = this.getSpellcastingAbility(this.databases.selectedClass.index);
            const abilityScore = this.wizardData.abilities[spellAbility];
            
            this.wizardData.spellcasting = {
                ability: spellAbility,
                spellSaveDC: 8 + this.wizardData.proficiencyBonus + calculateModifier(abilityScore),
                spellAttackBonus: this.wizardData.proficiencyBonus + calculateModifier(abilityScore),
                slots: {}, slotsMax: {},
                spellsKnown: this.wizardData.spellcasting?.spellsKnown || [],
                spellsPrepared: this.wizardData.spellcasting?.spellsPrepared || []
            };
        }
    }
    
    getSpellcastingAbility(classIndex) {
        const mapping = {
            'bard': 'charisma', 'cleric': 'wisdom', 'druid': 'wisdom',
            'paladin': 'charisma', 'ranger': 'wisdom',
            'sorcerer': 'charisma', 'warlock': 'charisma', 'wizard': 'intelligence'
        };
        return mapping[classIndex] || 'intelligence';
    }
    
    // ========================================================================
    // SALVATAGGIO E CRUD
    // ========================================================================
    
    savePg() {
        console.log('🎮 [PgController] Salvataggio PG');
        
        const validation = this.dataManager.validate(this.wizardData);
        if (!validation.isValid) {
            showToast(validation.errors[0], 'error');
            return;
        }
        
        this.calculateFinalStats();
        
        if (this.isEditMode && this.selectedPgId) {
            this.dataManager.update(this.selectedPgId, this.wizardData);
            showToast('PG aggiornato!', 'success');
        } else {
            const newPg = this.dataManager.create(this.wizardData);
            this.selectedPgId = newPg.id;
            showToast('PG creato!', 'success');
        }
        
        this.mode = 'view';
        this.currentStep = 1;
        this.wizardData = { ...EMPTY_PG };
        this.isEditMode = false;
        
        this.render();
    }
    
    deletePg(pgId) {
        const pg = this.dataManager.getById(pgId);
        if (!pg) return;
        
        if (confirm(`Eliminare "${pg.name}"?`)) {
            this.dataManager.delete(pgId);
            
            if (this.selectedPgId === pgId) {
                this.selectedPgId = null;
            }
            
            showToast('PG eliminato.', 'warning');
            this.render();
        }
    }
    
    // ========================================================================
    // INTEGRAZIONE COMBAT TRACKER
    // ========================================================================
    
    addToCombat(pgId) {
        const pg = this.dataManager.getById(pgId);
        if (!pg) {
            showToast('PG non trovato.', 'error');
            return;
        }
        
        const combatant = {
            ...pg,
            index: `pc-${pg.id}`,
            name: pg.name,
            customName: pg.name,
            hit_points: pg.hp?.max || 0,
            currentHp: pg.hp?.current || 0,
            maxHp: pg.hp?.max || 0,
            dexterity: pg.abilities?.dexterity || 10,
            initiative: null,
            conditions: pg.conditions || [],
            tempHp: pg.hp?.temp || 0,
            type: 'pc', cr: null, xp: 0
        };
        
        addMonsterToCombat(combatant);
        showToast(`${pg.name} aggiunto al Combat Tracker!`, 'success');
    }
    
    // ========================================================================
    // HP E CONDIZIONI (SCHEDA)
    // ========================================================================
    
    updateCurrentHp(newHp) {
        if (!this.selectedPgId) return;
        
        const pg = this.dataManager.getById(this.selectedPgId);
        if (!pg) return;
        
        const hp = pg.hp || { current: 0, max: 0, temp: 0 };
        const clampedHp = Math.max(0, Math.min(newHp, hp.max));
        
        this.dataManager.update(this.selectedPgId, {
            hp: { ...hp, current: clampedHp }
        });
    }
    
    promptAddCondition() {
        if (!this.selectedPgId) return;
        
        const condition = prompt(`Condizione:\n\n${[
            'Accecato', 'Affascinato', 'Afferrato', 'Assordato',
            'Avvelenato', 'Inabile', 'Intralciato', 'Invisibile',
            'Paralizzato', 'Pietrificato', 'Prono', 'Spaventato',
            'Stordito', 'Svenuto'
        ].join(', ')}`);
        
        if (condition && condition.trim()) {
            this.addCondition(condition.trim());
        }
    }
    
    addCondition(condition) {
        if (!this.selectedPgId) return;
        
        const pg = this.dataManager.getById(this.selectedPgId);
        if (!pg) return;
        
        const conditions = pg.conditions || [];
        if (conditions.includes(condition)) {
            showToast('Condizione già presente.', 'warning');
            return;
        }
        
        this.dataManager.update(this.selectedPgId, {
            conditions: [...conditions, condition]
        });
        
        showToast(`Aggiunta: ${condition}`, 'success');
        this.render();
    }
    
    removeCondition(condition) {
        if (!this.selectedPgId) return;
        
        const pg = this.dataManager.getById(this.selectedPgId);
        if (!pg) return;
        
        this.dataManager.update(this.selectedPgId, {
            conditions: (pg.conditions || []).filter(c => c !== condition)
        });
        
        showToast(`Rimossa: ${condition}`, 'info');
        this.render();
    }
    
    // ========================================================================
    // DISTRUZIONE
    // ========================================================================
    
    destroy() {
        console.log('🎮 [PgController] Distruzione modulo');
        
        this.container.onclick = null;
        this.container.onchange = null;
        this.container.oninput = null;
        this.container.innerHTML = '';
        
        this.selectedPgId = null;
        this.mode = 'view';
        this.currentStep = 1;
        this.wizardData = { ...EMPTY_PG };
    }
}

console.log('🎮 [PgController] Modulo caricato.');
