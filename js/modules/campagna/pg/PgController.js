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
import { PgLevelUpManager } from './PgLevelUpManager.js';
import { 
    EMPTY_PG, 
    calculateModifier, 
    calculateProficiencyBonus, 
    calculateArmorClass,
    calculateSpellSlots,
    calculateAvailableASI,
    ABILITY_KEY_TO_PROPERTY,
    ALL_SPELLCASTERS,
    CONDITIONS,
    MAX_AC,
    DEFAULT_AC,
    MAX_AUTOCOMPLETE_SUGGESTIONS,
    TOOLTIP_DISMISS_DELAY_MS,
    SPELL_LIMIT_POPUP_TIMEOUT_MS,
    INPUT_DEBOUNCE_MS,
    debounce,
    getSubclassMinLevel,
    escapeHtml
} from './PgConstants.js';
import { addMonsterToCombat } from '../../../../stateManager.js';
import { showToast } from '../../../../utils/toast.js';
import { getAutocompleteSuggestions } from '../../../../utils/campaignLinker.js';
import { backgroundDatabase } from '../../../../database/backgroundDatabase.js';

export class PgController {
    
    // ========================================================================
    // COSTRUTTORE E INIZIALIZZAZIONE
    // ========================================================================
    
    constructor(container) {
        this.container = container;
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
         * Step corrente del wizard (1-7).
         * @type {number}
         */
        this.currentStep = 1;
        
        /**
         * Dati del PG in creazione/modifica.
         * @type {Object}
         */
        this.wizardData = this.createEmptyPg();
        
        /**
         * Flag modalità editazione.
         * @type {boolean}
         */
        this.isEditMode = false;
        
        /**
         * Gestore dedicato per il level-up wizard.
         * Inizializzato dopo loadDatabases().
         * @type {PgLevelUpManager|null}
         */
        this.levelUpManager = null;
        
        console.log('🎮 [PgController] Inizializzato.');
    }
    
    /**
     * Crea un oggetto PG vuoto con deep copy degli array/oggetti nidificati
     */
    createEmptyPg() {
        return {
            ...EMPTY_PG,
            abilities: { ...EMPTY_PG.abilities },
            hp: { ...EMPTY_PG.hp },
            hitDice: { ...EMPTY_PG.hitDice },
            proficiencies: {
                armor: [...(EMPTY_PG.proficiencies?.armor || [])],
                weapons: [...(EMPTY_PG.proficiencies?.weapons || [])],
                tools: [...(EMPTY_PG.proficiencies?.tools || [])],
                languages: [...(EMPTY_PG.proficiencies?.languages || [])]
            },
            racialTraits: [...(EMPTY_PG.racialTraits || [])],
            classFeatures: [...(EMPTY_PG.classFeatures || [])],
            feats: [...(EMPTY_PG.feats || [])],
            equipment: [...(EMPTY_PG.equipment || [])],
            magicItems: [...(EMPTY_PG.magicItems || [])],
            inventory: [],
            equippedSlots: {},
            _acceptedSuggestions: [],
            _selectedChoices: {},
            _racialBonuses: [],
            _asiBonuses: {
                strength: 0, dexterity: 0, constitution: 0,
                intelligence: 0, wisdom: 0, charisma: 0
            },
            treasure: { ...EMPTY_PG.treasure },
            conditions: [...(EMPTY_PG.conditions || [])],
            wikiLinks: [...(EMPTY_PG.wikiLinks || [])]
        };
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
            
            // Incantesimi per classe + helper functions
            try {
                const classSpellsModule = await import('../../../../database/classSpells.js');
                this.databases.classSpellList = classSpellsModule.classSpellList || {};
                this.databases.spellLevelsByClass = classSpellsModule.spellLevelsByClass || {};
                // Salva le funzioni helper
                this.spellHelpers = {
                    getMaxCantripsKnown: classSpellsModule.getMaxCantripsKnown,
                    getMaxSpellsKnown: classSpellsModule.getMaxSpellsKnown,
                    isKnownCaster: classSpellsModule.isKnownCaster,
                    isPreparedCaster: classSpellsModule.isPreparedCaster,
                    getCasterType: classSpellsModule.getCasterType,
                    getCasterTypeDescription: classSpellsModule.getCasterTypeDescription,
                    spellLevelsByClass: classSpellsModule.spellLevelsByClass
                };
                console.log(`🎮 [PgController] Caricate liste incantesimi per ${Object.keys(this.databases.classSpellList).length} classi.`);
            } catch (e) {
                console.warn('🎮 [PgController] Database incantesimi per classe non trovato:', e.message);
                this.databases.classSpellList = {};
            }
            
            // Backgrounds (usando il database importato)
            this.databases.backgrounds = backgroundDatabase || [];
            console.log(`🎮 [PgController] Caricati ${this.databases.backgrounds.length} backgrounds.`);
            
            // Items database
            try {
                const itemModule = await import('../../../../database/items.js');
                this.databases.items = itemModule.itemDatabase || [];
                console.log(`🎮 [PgController] Caricati ${this.databases.items.length} oggetti.`);
            } catch (e) {
                console.warn('🎮 [PgController] Database oggetti non trovato:', e.message);
                this.databases.items = [];
            }
            
            // Inizializza il gestore dedicato del level-up wizard
            this.levelUpManager = new PgLevelUpManager({
                container: this.container,
                dataManager: this.dataManager,
                databases: this.databases,
                spellHelpers: this.spellHelpers
            }, {
                setSelectedPgId: (id) => { this.selectedPgId = id; }
            });
            this.levelUpManager.setRenderCallback(() => this.render());
            console.log('🎮 [PgController] PgLevelUpManager inizializzato.');
            
        } catch (error) {
            console.error('🎮 [PgController] Errore caricamento database:', error);
            showToast('Errore nel caricamento dei database.', 'error');
        }
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
        } else if (this.levelUpManager && this.levelUpManager.isActive) {
            // Modalità level-up wizard (delegata a PgLevelUpManager)
            rightContent = this.viewManager.renderLevelUpWizard(
                this.levelUpManager.step,
                this.levelUpManager.data
            );
        } else if (this.selectedPgId) {
            // Modalità visualizzazione PG
            const pg = this.dataManager.getById(this.selectedPgId);
            if (pg) {
                rightContent = this.viewManager.renderCharacterSheet(pg, this.databases);
            }
        }
        // Se nessun PG selezionato e non in wizard, rightContent = null (messaggio vuoto)
        
        // Salva la posizione di scroll del pannello contenuti (per non far saltare la vista)
        const contentPanel = this.container.querySelector('.pg-content');
        const savedScroll = contentPanel ? contentPanel.scrollTop : 0;

        // Renderizza layout principale
        this.viewManager.renderMainLayout(pcs, this.selectedPgId, rightContent);
        this.bindEvents();

        // Ripristina scroll position (utile nel level-up wizard per non tornare in cima)
        if (savedScroll > 0 && ((this.levelUpManager?.isActive) || this.mode === 'wizard')) {
            const newPanel = this.container.querySelector('.pg-content');
            if (newPanel) {
                newPanel.scrollTop = savedScroll;
            }
        }
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
        
        // Hover sui trait-tag per mostrare tooltip nella sidebar
        // NOTA: usiamo onmouseover/onmouseout (property) invece di addEventListener
        // per evitare memory leak — le property sovrascrivono il listener precedente
        // invece di accumularlo ad ogni render().
        this.container.onmouseover = (e) => this.handleTraitHover(e);
        this.container.onmouseout = (e) => this.handleTraitLeave(e);
        
        // Timeout IDs per cleanup in destroy()
        this._tooltipTimeout = null;
        this._popupTimeout = null;
        
        // Handler debounced per input testuali frequenti
        this._debouncedAutocomplete = debounce((textarea) => this.handleAutocompleteInput(textarea), INPUT_DEBOUNCE_MS);
        this._debouncedSearch = debounce((term) => this.searchItems(term), INPUT_DEBOUNCE_MS);
    }
    
    /**
     * Gestisce l'hover sui trait-tag
     */
    handleTraitHover(e) {
        const traitTag = e.target.closest('.trait-tag');
        if (!traitTag) return;
        
        const name = traitTag.textContent.trim();
        const description = traitTag.dataset.tooltip || 'Nessuna descrizione disponibile';
        const type = traitTag.classList.contains('racial') ? 'racial' :
                     traitTag.classList.contains('class') ? 'class' :
                     traitTag.classList.contains('subclass') ? 'subclass' :
                     traitTag.classList.contains('background') ? 'background' : 'trait';
        
        this.showTooltipOverlay(name, description, type);
    }
    
    /**
     * Gestisce quando il mouse esce dai trait-tag
     */
    handleTraitLeave(e) {
        const traitTag = e.target.closest('.trait-tag');
        if (!traitTag) return;
        
        // Nascondi con un piccolo delay (traccia il timeout per cleanup)
        this._tooltipTimeout = setTimeout(() => {
            const hoveredTag = this.container.querySelector('.trait-tag:hover');
            if (!hoveredTag) {
                this.hideTooltipOverlay();
            }
            }, TOOLTIP_DISMISS_DELAY_MS);
    }
    
    /**
     * Mostra il tooltip overlay nella sidebar
     */
    showTooltipOverlay(name, description, type) {
        const overlay = document.getElementById('trait-tooltip-overlay');
        const nameEl = document.getElementById('tooltip-name');
        const typeEl = document.getElementById('tooltip-type');
        const bodyEl = document.getElementById('tooltip-body');
        
        if (!overlay || !nameEl || !typeEl || !bodyEl) return;
        
        // Determina il tipo
        const typeLabels = {
            racial: 'Razziale',
            class: 'Classe',
            subclass: 'Sottoclasse',
            background: 'Background',
            trait: 'Tratto'
        };
        
        nameEl.textContent = name;
        typeEl.textContent = typeLabels[type] || type;
        typeEl.className = 'tooltip-type ' + type;
        bodyEl.textContent = description;
        
        overlay.classList.add('visible');
    }
    
    /**
     * Nasconde il tooltip overlay
     */
    hideTooltipOverlay() {
        const overlay = document.getElementById('trait-tooltip-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
        }
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
        
        // Click su flip-card per girare la scheda
        const flipCard = target.closest('.flip-card');
        if (flipCard && !button) {
            // Non flippare se si sta cliccando su un input o modal
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
                return;
            }
            // Non flippare se siamo nel modal AC
            if (target.closest('.ac-modal')) {
                return;
            }
            flipCard.classList.toggle('flipped');
            return;
        }
        
        // Modifica CA
        if (button && button.id === 'btn-edit-ac') {
            this.showAcModal(button);
            return;
        }
        
        // Salva CA dal modal
        if (button && button.classList.contains('btn-save-ac')) {
            this.saveAcFromModal(button);
            return;
        }
        
        // Annulla modifica CA
        if (button && button.classList.contains('btn-cancel-ac')) {
            this.hideAcModal();
            return;
        }
        
        // === LEVEL-UP WIZARD: click su elementi non-button (label, span) ===
        if (this.levelUpManager?.isActive && !button) {
            // Spell toggle (label con checkbox)
            const spellLabel = target.closest('[data-lu-spell]');
            if (spellLabel) {
                e.preventDefault();
                this.levelUpManager._handleWizardSpellToggle(spellLabel);
                return;
            }
            // Spell swap out (span)
            const swapOutItem = target.closest('[data-swap-out]');
            if (swapOutItem && !swapOutItem.classList.contains('already-known')) {
                this.levelUpManager._handleWizardSwapOut(swapOutItem);
                return;
            }
            // Spell swap in (span)
            const swapInItem = target.closest('[data-swap-in]');
            if (swapInItem && !swapInItem.classList.contains('already-known')) {
                this.levelUpManager._handleWizardSwapIn(swapInItem);
                return;
            }
        }

        if (!button) return;
        
        // Pulsante Nuovo PG
        if (button.id === 'btn-new-pg') {
            this.startWizard();
            return;
        }
        
        // Navigazione wizard
        if (button.id === 'btn-prev') { 
            if (this.levelUpManager?.isActive) { this.levelUpManager.levelUpPrevStep(); }
            else { this.prevStep(); }
            return; 
        }
        if (button.id === 'btn-next') { 
            if (this.levelUpManager?.isActive) { this.levelUpManager.levelUpNextStep(); }
            else { this.nextStep(); }
            return; 
        }
        if (button.id === 'btn-cancel') { 
            if (this.levelUpManager?.isActive) { this.levelUpManager.cancelLevelUp(); }
            else { this.cancelWizard(); }
            return; 
        }
        
        // Generazione caratteristiche
        if (button.id === 'btn-roll-abilities') { this.rollAbilities(); return; }
        if (button.id === 'btn-standard-array') { this.applyStandardArray(); return; }
        
        // === LEVEL-UP WIZARD ACTIONS ===
        if (this.levelUpManager?.isActive) {
            // ASI buttons
            if (button.dataset.asiAbility && button.dataset.asiAction) {
                this.levelUpManager._handleWizardASI(button);
                return;
            }
            // HP choice
            if (button.dataset.hpChoice) {
                this.levelUpManager._handleWizardHpChoice(button);
                return;
            }
            // Clear swap
            if (button.dataset.luAction === 'clear-swap') {
                this.levelUpManager._handleWizardClearSwap();
                return;
            }
        }
        
        // Modifica caratteristiche +/-
        if (button.dataset.ability && button.dataset.action) {
            this.modifyAbility(button.dataset.ability, button.dataset.action);
            return;
        }
        
        // Modifica ASI (bonus da livello)
        if (button.dataset.asiAbility && button.dataset.asiAction) {
            this.modifyASI(button.dataset.asiAbility, button.dataset.asiAction);
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
        if (action === 'open-equipment') {
            if (pgId) this.openEquipmentPopup(pgId);
            return;
        }
        if (action === 'level-up') {
            if (pgId) this.levelUpManager.startLevelUp(pgId);
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
        
        // === INVENTORY ACTIONS ===
        // Aggiungi oggetto dal database
        if (button.classList.contains('btn-add-item')) {
            const itemIndex = button.dataset.itemIndex;
            if (itemIndex) this.addItemToInventory(itemIndex);
            return;
        }
        
        // Rimuovi oggetto dall'inventario
        if (button.classList.contains('btn-remove-item')) {
            const idx = parseInt(button.dataset.index);
            if (!isNaN(idx)) this.removeItemFromInventory(idx);
            return;
        }
        
        // Aggiungi oggetto personalizzato
        if (button.id === 'btn-add-custom-item') {
            this.addCustomItem();
            return;
        }
        
        // Aggiungi equipaggiamento suggerito (conferma scelta)
        if (button.classList.contains('btn-add-suggested')) {
            const key = button.dataset.suggestionKey;
            const text = button.dataset.suggestionText;
            const source = button.dataset.source;
            const itemsJson = button.dataset.suggestionItems;
            if (key && text) this.acceptSuggestion(key, text, source, itemsJson);
            return;
        }
        
        // Seleziona opzione (a) o (b)
        if (button.classList.contains('btn-select-choice')) {
            const choiceKey = button.dataset.choiceKey;
            const option = button.dataset.choiceOption;
            if (choiceKey && option) this.selectEquipmentChoice(choiceKey, option);
            return;
        }
        
        // Reset scelta
        if (button.classList.contains('btn-reset-choice')) {
            const choiceKey = button.dataset.choiceKey;
            if (choiceKey) this.resetEquipmentChoice(choiceKey);
            return;
        }
        
        // Apri modal selezione dinamica
        if (button.classList.contains('btn-open-dynamic-selector')) {
            const suggestionKey = button.dataset.suggestionKey;
            const suggestionText = button.dataset.suggestionText;
            const filterJson = button.dataset.filter;
            const quantity = parseInt(button.dataset.quantity) || 1;
            const category = button.dataset.category;
            const source = button.dataset.source;
            if (suggestionKey && filterJson) {
                this.openDynamicSelector(suggestionKey, suggestionText, filterJson, quantity, category, source);
            }
            return;
        }
        
        // Toggle selezione oggetto dinamico
        if (button.classList.contains('btn-toggle-dynamic-item')) {
            const itemIndex = button.dataset.itemIndex;
            const itemName = button.dataset.itemName;
            const itemWeight = parseFloat(button.dataset.itemWeight) || 0;
            const itemCost = button.dataset.itemCost;
            if (itemIndex) this.toggleDynamicItemSelection(button, itemIndex, itemName, itemWeight, itemCost);
            return;
        }
        
        // Conferma selezione dinamica
        if (button.id === 'btn-confirm-dynamic-selection') {
            const suggestionKey = button.dataset.suggestionKey;
            const source = button.dataset.source;
            this.confirmDynamicSelection(suggestionKey, source);
            return;
        }
        
        // Annulla selezione dinamica
        if (button.id === 'btn-cancel-dynamic-selector') {
            this.closeDynamicSelector();
            return;
        }
        
        // Filtro categoria oggetti
        if (button.classList.contains('filter-btn')) {
            const category = button.dataset.category;
            if (category) this.filterItemsByCategory(category);
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
        
        // NOTA: ac-input è gestito in handleInput() per aggiornamento realtime
        
        // Step 5 - Inventario: quantità oggetto
        if (target.classList.contains('qty-input') && target.dataset.index !== undefined) {
            const idx = parseInt(target.dataset.index);
            const qty = parseInt(target.value) || 1;
            this.updateItemQuantity(idx, qty);
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
        // NOTA: pg-background è gestito in handleChange() tramite updateBackground()
        // che esegue logiche aggiuntive (nome, competenze, render)
        if (target.id === 'pg-player') this.wizardData.playerName = target.value;
        if (target.id === 'pg-backstory') this.wizardData.backstory = target.value;
        if (target.id === 'pg-notes') this.wizardData.notes = target.value;
        if (target.id === 'pg-dm-secrets') this.wizardData.dmSecrets = target.value;
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
            this._debouncedAutocomplete(target);
        }
        
        // Scheda - CA aggiornamento in tempo reale
        if (target.id === 'ac-input') {
            this.updateArmorClass(parseInt(target.value) || 10);
        }
        
        // Step 5 - Inventario: ricerca oggetti
        if (target.id === 'item-search-input') {
            this._debouncedSearch(target.value);
        }
        
        // Step 5 - Inventario: monete
        if (target.id === 'coins-gold' || target.id === 'coins-silver' || target.id === 'coins-copper') {
            this.updateCoins();
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
        
        dropdown.innerHTML = suggestions.slice(0, MAX_AUTOCOMPLETE_SUGGESTIONS).map(s => `
            <div class="autocomplete-item" data-name="${escapeHtml(s.name)}" data-section="${s.section}" data-id="${s.id}">
                <span class="autocomplete-icon">${this.getCategoryIcon(s.section)}</span>
                <span class="autocomplete-name">${escapeHtml(s.name)}</span>
                <span class="autocomplete-type">${escapeHtml(s.categoryLabel)}</span>
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
        } else if (textarea.id === 'pg-dm-secrets') {
            this.wizardData.dmSecrets = newValue;
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
        this.wizardData = this.createEmptyPg();
        this.isEditMode = false;
        this.databases.selectedRace = null;
        this.databases.selectedClass = null;
        this.databases.selectedBackground = null;
        
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
        
        // Deep clone del PG per evitare di modificare l'originale
        this.wizardData = this.clonePg(pg);
        this.isEditMode = true;
        this.selectedPgId = pgId; // Mantieni selezionato
        this.mode = 'wizard';
        this.currentStep = 1;
        
        this.databases.selectedRace = this.databases.races.find(r => r.index === pg.race);
        this.databases.selectedClass = this.databases.classes.find(c => c.index === pg.class);
        
        if (this.databases.selectedClass) {
            // Fix: usa 'sottoclassi' (italiano) invece di 'subclasses'
            this.wizardData.subclassOptions = this.databases.selectedClass.sottoclassi || this.databases.selectedClass.subclasses || [];
            this.wizardData.subclassMinLevel = getSubclassMinLevel(this.databases.selectedClass);
        }
        
        // IMPORTANTISSIMO: Sottrai bonus razziali e ASI dalle abilità
        // così il wizard mostra solo i valori base (come in creazione)
        this._stripBonusesFromAbilities();
        
        this.render();
    }
    
    /**
     * Rimuove bonus razziali e ASI dalle abilità del wizardData
     * per mostrare solo i valori base nell'editor
     */
    _stripBonusesFromAbilities() {
        const race = this.databases.selectedRace;
        const racialBonuses = this.wizardData._racialBonuses || race?.ability_bonuses || [];
        const asiBonuses = this.wizardData._asiBonuses || {};
        
        // Salva i bonus razziali per riferimento
        if (race?.ability_bonuses) {
            this.wizardData._racialBonuses = race.ability_bonuses;
        }
        
        // Sottrai bonus razziali
        for (const bonus of racialBonuses) {
            const abilityKey = bonus.ability_score?.index;
            if (abilityKey && ABILITY_KEY_TO_PROPERTY[abilityKey]) {
                const property = ABILITY_KEY_TO_PROPERTY[abilityKey];
                if (this.wizardData.abilities[property] !== undefined) {
                    this.wizardData.abilities[property] -= bonus.bonus;
                }
            }
        }
        
        // Sottrai bonus ASI
        for (const [property, bonus] of Object.entries(asiBonuses)) {
            if (bonus && this.wizardData.abilities[property] !== undefined) {
                this.wizardData.abilities[property] -= bonus;
            }
        }
        
        // Assicurati che i valori base non scendano sotto 1
        for (const key of Object.keys(this.wizardData.abilities)) {
            this.wizardData.abilities[key] = Math.max(1, this.wizardData.abilities[key]);
        }
    }
    
    /**
     * Clona un PG con deep copy completa.
     * Usa structuredClone() per garantire che tutti gli oggetti/array
     * nidificati (inclusi gli elementi dentro gli array) siano clonati
     * e non condividano riferimenti con l'originale.
     */
    clonePg(pg) {
        try {
            return structuredClone(pg);
        } catch (e) {
            // Fallback per ambienti molto vecchi senza structuredClone
            console.warn('🎮 [PgController] structuredClone non disponibile, uso fallback manuale');
            return JSON.parse(JSON.stringify(pg));
        }
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
        // Passa i dati di contesto per la validazione prima di validare
        if (this.currentStep === 3) {
            this.wizardData._classNumSkillChoices = this.databases.selectedClass?.proficiency_choices?.[0]?.choose || 2;
        }
        if (this.currentStep === 4) {
            this.wizardData._maxCantrips = this.getMaxCantrips();
        }
        
        const validation = this.dataManager.validate(this.wizardData, this.currentStep);
        
        if (!validation.isValid) {
            showToast(validation.errors[0], 'warning');
            this.render();
            return;
        }
        
        if (this.currentStep === 7) {
            this.savePg();
            return;
        }
        
        this.currentStep++;
        
        if (this.currentStep === 7) {
            // Strip eventuali bonus residui (navigazione avanti-indietro) prima di ricalcolare
            this._stripBonusesFromAbilities();
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
            this.wizardData = this.createEmptyPg();
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
            // Salva i TS come index in maiuscolo (es. "STR", "CON") per compatibilità con il render
            this.wizardData.savingThrows = this.databases.selectedClass.saving_throws?.map(st => st.index?.toUpperCase() || st.name?.toUpperCase()) || [];
            // Fix: usa 'sottoclassi' (italiano) invece di 'subclasses'
            this.wizardData.subclassOptions = this.databases.selectedClass.sottoclassi || this.databases.selectedClass.subclasses || [];
            this.wizardData.subclass = '';
            // Calcola il livello minimo per la sottoclasse
            this.wizardData.subclassMinLevel = getSubclassMinLevel(this.databases.selectedClass);
            this.recalculateHp();
        }
        
        this.render();
    }
    
    updateBackground(bgIndex) {
        this.wizardData.background = bgIndex;
        this.databases.selectedBackground = this.databases.backgrounds.find(b => b.index === bgIndex);
        
        if (this.databases.selectedBackground) {
            this.wizardData.backgroundName = this.databases.selectedBackground.nome;
            // Salva le abilità del background separatamente per escluderle dal conteggio classe
            const bgSkills = this.databases.selectedBackground.competenze?.abilita || [];
            // Rimuovi vecchie abilità del background prima di aggiungere le nuove
            const oldBgSkills = this.wizardData._bgSkills || [];
            if (this.wizardData.skills && oldBgSkills.length > 0) {
                this.wizardData.skills = this.wizardData.skills.filter(s => !oldBgSkills.includes(s));
            }
            this.wizardData._bgSkills = bgSkills;
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
    
    /**
     * Modifica i bonus ASI per una caratteristica
     */
    modifyASI(abilityKey, action) {
        const property = ABILITY_KEY_TO_PROPERTY[abilityKey];
        if (!property) return;
        
        const remaining = this.getRemainingASIPoints();
        const currentBonus = this.wizardData._asiBonuses?.[property] || 0;
        
        if (action === 'increase') {
            if (remaining <= 0) {
                showToast('Non hai più punti ASI disponibili', 'warning');
                return;
            }
            this.wizardData._asiBonuses[property] = currentBonus + 1;
        } else {
            if (currentBonus <= 0) return;
            this.wizardData._asiBonuses[property] = currentBonus - 1;
        }
        
        this.updateAbilityDisplay(abilityKey);
        this._updateASIDisplay();
    }
    
    /**
     * Aggiorna il display dei punti ASI rimanenti
     */
    _updateASIDisplay() {
        const remaining = this.getRemainingASIPoints();
        const totalASI = calculateAvailableASI(this.databases.selectedClass, this.wizardData.level || 1);
        const usedASI = totalASI - remaining;
        
        const remainingEl = this.container.querySelector('.asi-remaining');
        if (remainingEl) {
            remainingEl.textContent = `${remaining}/${totalASI}`;
        }
    }
    
    updateAbilityDisplay(abilityKey) {
        const property = ABILITY_KEY_TO_PROPERTY[abilityKey];
        const input = this.container.querySelector(`#ability-${abilityKey}`);
        const bonuses = this.databases.selectedRace?.ability_bonuses || [];
        const racialBonus = bonuses.find(b => b.ability_score?.index === abilityKey)?.bonus || 0;
        const asiBonus = this.wizardData._asiBonuses?.[property] || 0;
        
        if (input) {
            input.value = this.wizardData.abilities[property];
            
            const box = input.closest('.ability-box');
            if (box) {
                const totalEl = box.querySelector('.total');
                const modEl = box.querySelector('.mod');
                
                const totalScore = this.wizardData.abilities[property] + racialBonus + asiBonus;
                const modifier = calculateModifier(totalScore);
                
                if (totalEl) totalEl.textContent = `Tot: ${totalScore}`;
                if (modEl) {
                    modEl.textContent = `${modifier >= 0 ? '+' : ''}${modifier}`;
                    modEl.className = `mod ${modifier >= 0 ? 'pos' : 'neg'}`;
                }
                
                // Aggiorna il display ASI
                const asiDisplay = box.querySelector('.asi-bonus-value');
                if (asiDisplay) {
                    asiDisplay.textContent = asiBonus > 0 ? `+${asiBonus}` : '0';
                }
            }
        }
        
        this.updateHpPreview();
    }
    
    updateHpPreview() {
        const hpPreview = this.container.querySelector('.hp-preview');
        if (!hpPreview || !this.databases.selectedClass) return;
        
        const hitDieSize = this.databases.selectedClass.hit_die;
        const level = this.wizardData.level;
        
        // Usa il valore TOTALE della costituzione (base + razziale + ASI)
        const conBase = this.wizardData.abilities.constitution;
        const racialBonuses = this.databases.selectedRace?.ability_bonuses || [];
        const racialCon = racialBonuses.find(b => b.ability_score?.index === 'con')?.bonus || 0;
        const asiCon = this.wizardData._asiBonuses?.constitution || 0;
        const totalCon = conBase + racialCon + asiCon;
        const conMod = calculateModifier(totalCon);
        
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
    
    /**
     * Applica i bonus razziali alle capacità del personaggio.
     * Le capacità nel wizard sono valori base; questo metodo aggiunge i bonus
     * razziali prima del salvataggio finale.
     */
    applyRacialBonusesToWizardData() {
        const race = this.databases.selectedRace;
        if (!race || !race.ability_bonuses) return;
        
        this.wizardData._racialBonuses = race.ability_bonuses;
        
        for (const bonus of race.ability_bonuses) {
            const abilityKey = bonus.ability_score?.index;
            if (abilityKey && ABILITY_KEY_TO_PROPERTY[abilityKey]) {
                const property = ABILITY_KEY_TO_PROPERTY[abilityKey];
                if (this.wizardData.abilities[property] !== undefined) {
                    this.wizardData.abilities[property] += bonus.bonus;
                }
            }
        }
    }
    
    /**
     * Applica i bonus ASI (Ability Score Improvement) alle capacità.
     * Ogni ASI concede +2 punti da distribuire.
     */
    applyASIToWizardData() {
        const asiBonuses = this.wizardData._asiBonuses;
        if (!asiBonuses) return;
        
        for (const [property, bonus] of Object.entries(asiBonuses)) {
            if (bonus && this.wizardData.abilities[property] !== undefined) {
                this.wizardData.abilities[property] += bonus;
            }
        }
    }
    
    /**
     * Calcola i punti ASI rimanenti da distribuire
     */
    getRemainingASIPoints() {
        const classData = this.databases.selectedClass;
        const level = this.wizardData.level || 1;
        const totalASI = calculateAvailableASI(classData, level);
        const usedASI = Object.values(this.wizardData._asiBonuses || {}).reduce((sum, v) => sum + (v || 0), 0);
        return totalASI - usedASI;
    }
    
    recalculateHp() {
        if (!this.databases.selectedClass) return;
        
        const hitDieSize = this.databases.selectedClass.hit_die;
        const level = this.wizardData.level;
        
        // Usa il valore TOTALE della costituzione (base + razziale + ASI)
        // poiché nel wizard le abilities sono base, aggiungiamo i bonus qui
        const conBase = this.wizardData.abilities.constitution;
        const racialBonuses = this.databases.selectedRace?.ability_bonuses || [];
        const racialCon = racialBonuses.find(b => b.ability_score?.index === 'con')?.bonus || 0;
        const asiCon = this.wizardData._asiBonuses?.constitution || 0;
        const totalCon = conBase + racialCon + asiCon;
        const conMod = calculateModifier(totalCon);
        
        const avgPerLevel = Math.floor(hitDieSize / 2) + 1;
        
        this.wizardData.hp = {
            current: hitDieSize + (avgPerLevel * (level - 1)) + (conMod * level),
            max: hitDieSize + (avgPerLevel * (level - 1)) + (conMod * level),
            temp: 0
        };
        
        // Aggiorna anche i dadi vita in base al livello
        this.wizardData.hitDice = {
            total: level,
            current: level, // Tutti i dadi vita disponibili all'inizio
            size: `d${hitDieSize}`
        };
    }
    
    toggleSkill(skillName, isChecked) {
        if (!this.wizardData.skills) this.wizardData.skills = [];
        
        const numChoices = this.databases.selectedClass?.proficiency_choices?.[0]?.choose || 2;
        const bgSkills = this.wizardData._bgSkills || [];
        
        if (isChecked) {
            if (!this.wizardData.skills.includes(skillName)) {
                this.wizardData.skills.push(skillName);
            }
        } else {
            this.wizardData.skills = this.wizardData.skills.filter(s => s !== skillName);
        }
        
        // Aggiorna il contatore visivo (escludi le skill del background dal conteggio)
        const counterBox = this.container.querySelector('.skill-counter-box');
        if (counterBox) {
            const userSelectedCount = this.wizardData.skills.filter(s => !bgSkills.includes(s)).length;
            const isOverLimit = userSelectedCount > numChoices;
            
            counterBox.className = `skill-counter-box ${isOverLimit ? 'over-limit' : ''}`;
            
            const selectedNum = counterBox.querySelector('.selected-num');
            if (selectedNum) selectedNum.textContent = userSelectedCount;
            
            // Aggiorna il warning
            let warningEl = counterBox.querySelector('.counter-warning');
            if (isOverLimit) {
                if (!warningEl) {
                    warningEl = document.createElement('span');
                    warningEl.className = 'counter-warning';
                    counterBox.appendChild(warningEl);
                }
                warningEl.textContent = `⚠️ ${userSelectedCount - numChoices} abilità oltre il limite`;
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
    
    /**
     * Ottiene il nome italiano della classe
     */
    getClassNameIt() {
        const classIndex = this.wizardData.class?.index || 
                          this.databases.selectedClass?.index;
        const classMap = {
            'bard': 'Bardo', 'cleric': 'Chierico', 'druid': 'Druido',
            'paladin': 'Paladino', 'ranger': 'Ranger', 'sorcerer': 'Stregone',
            'warlock': 'Warlock', 'wizard': 'Mago'
        };
        return classMap[classIndex] || null;
    }
    
    /**
     * Ottiene il numero massimo di trucchetti per la classe
     */
    getMaxCantrips() {
        const classNameIt = this.getClassNameIt();
        const pgLevel = this.wizardData.level || 1;
        if (!classNameIt || !this.spellHelpers?.getMaxCantripsKnown) return null;
        return this.spellHelpers.getMaxCantripsKnown(classNameIt, pgLevel);
    }
    
    /**
     * Ottiene il numero massimo di incantesimi conosciuti/grimorio
     */
    getMaxSpells() {
        const classNameIt = this.getClassNameIt();
        const pgLevel = this.wizardData.level || 1;
        if (!classNameIt) return null;
        
        // Mago: 6 + 2 per livello
        if (classNameIt === 'Mago') {
            return 6 + (pgLevel - 1) * 2;
        }
        
        // Known casters
        if (this.spellHelpers?.getMaxSpellsKnown) {
            return this.spellHelpers.getMaxSpellsKnown(classNameIt, pgLevel);
        }
        
        return null;
    }
    
    /**
     * Verifica se la classe deve selezionare incantesimi (non solo trucchetti)
     */
    shouldSelectSpells() {
        const classNameIt = this.getClassNameIt();
        if (!classNameIt) return false;
        
        // Known casters e Mago selezionano incantesimi
        if (classNameIt === 'Mago') return true;
        if (this.spellHelpers?.isKnownCaster) {
            return this.spellHelpers.isKnownCaster(classNameIt);
        }
        return false;
    }
    
    toggleSpell(spellKey, isChecked) {
        if (!this.wizardData.spellcasting) {
            this.wizardData.spellcasting = {
                ability: null, spellSaveDC: 0, spellAttackBonus: 0,
                slots: {}, slotsMax: {}, spellsKnown: [], spellsPrepared: []
            };
        }
        
        // Trova il checkbox per ottenere il livello dell'incantesimo
        const checkbox = this.container.querySelector(`input[data-spell="${spellKey}"]`);
        const spellLevel = checkbox ? parseInt(checkbox.dataset.level) || 0 : 0;
        
        // Helper per normalizzare il nome dello spell (supporta sia string che object)
        const getSpellName = (s) => typeof s === 'string' ? s : s.name;
        
        if (isChecked) {
            // Controlla se esiste già (sia come stringa che come oggetto)
            const exists = this.wizardData.spellcasting.spellsKnown.some(s => getSpellName(s) === spellKey);
            if (!exists) {
                // Salva come oggetto con nome E livello
                this.wizardData.spellcasting.spellsKnown.push({ 
                    name: spellKey, 
                    level: spellLevel 
                });
            }
        } else {
            this.wizardData.spellcasting.spellsKnown = 
                this.wizardData.spellcasting.spellsKnown.filter(s => getSpellName(s) !== spellKey);
        }
        
        // Aggiorna contatori e labels
        this.updateSpellCounters();
    }
    
    /**
     * Aggiorna tutti i contatori e le label degli incantesimi
     */
    updateSpellCounters() {
        const knownSpells = this.wizardData.spellcasting?.spellsKnown || [];
        const allCheckboxes = this.container.querySelectorAll('input[data-spell]');
        
        // Helper per ottenere il nome dello spell (supporta sia string che object)
        const getSpellName = (s) => typeof s === 'string' ? s : s.name;
        // Helper per ottenere il livello dello spell (supporta sia string che object)
        const getSpellLevel = (s, checkbox) => {
            if (typeof s === 'object' && s.level !== undefined) return s.level;
            return checkbox ? parseInt(checkbox.dataset.level) || 0 : 0;
        };
        
        // Conta per livello
        const countByLevel = {};
        knownSpells.forEach(spell => {
            const spellName = getSpellName(spell);
            const cb = this.container.querySelector(`input[data-spell="${spellName}"]`);
            if (cb) {
                const level = getSpellLevel(spell, cb);
                countByLevel[level] = (countByLevel[level] || 0) + 1;
            }
        });
        
        // Calcola totali
        const totalCantrips = countByLevel[0] || 0;
        let totalSpells = 0;
        for (let level = 1; level <= 9; level++) {
            totalSpells += countByLevel[level] || 0;
        }
        
        // Ottieni limiti
        const maxCantrips = this.getMaxCantrips();
        const maxSpells = this.getMaxSpells();
        const selectSpells = this.shouldSelectSpells();
        
        // === AGGIORNA CONTATORE TRUCCHETTI ===
        const cantripsBox = this.container.querySelector('#cantrips-counter');
        if (cantripsBox && maxCantrips !== null) {
            const isOver = totalCantrips > maxCantrips;
            const isAtLimit = totalCantrips === maxCantrips;
            
            cantripsBox.className = `spell-counter-box ${isOver ? 'over-limit' : isAtLimit ? 'at-limit' : ''}`;
            
            const currentEl = cantripsBox.querySelector('.counter-current');
            if (currentEl) currentEl.textContent = totalCantrips;
            
            // Aggiorna hint
            let hintEl = cantripsBox.querySelector('.counter-hint');
            let warningEl = cantripsBox.querySelector('.counter-warning');
            let okEl = cantripsBox.querySelector('.counter-ok');
            
            // Rimuovi elementi esistenti
            if (hintEl) hintEl.remove();
            if (warningEl) warningEl.remove();
            if (okEl) okEl.remove();
            
            // Crea nuovo elemento
            const valuesDiv = cantripsBox.querySelector('.counter-values');
            if (valuesDiv) {
                const newEl = document.createElement('div');
                if (isOver) {
                    newEl.className = 'counter-warning';
                    newEl.textContent = `⚠️ Superato di ${totalCantrips - maxCantrips}!`;
                } else if (isAtLimit) {
                    newEl.className = 'counter-ok';
                    newEl.textContent = '✓ Limite raggiunto';
                } else {
                    newEl.className = 'counter-hint';
                    newEl.textContent = `Puoi sceglierne altri ${maxCantrips - totalCantrips}`;
                }
                valuesDiv.after(newEl);
            }
        }
        
        // === AGGIORNA CONTATORE INCANTESIMI ===
        const spellsBox = this.container.querySelector('#spells-counter');
        if (spellsBox && maxSpells !== null && selectSpells) {
            const isOver = totalSpells > maxSpells;
            const isAtLimit = totalSpells === maxSpells;
            
            spellsBox.className = `spell-counter-box ${isOver ? 'over-limit' : isAtLimit ? 'at-limit' : ''}`;
            
            const currentEl = spellsBox.querySelector('.counter-current');
            if (currentEl) currentEl.textContent = totalSpells;
            
            // Aggiorna hint
            let hintEl = spellsBox.querySelector('.counter-hint');
            let warningEl = spellsBox.querySelector('.counter-warning');
            let okEl = spellsBox.querySelector('.counter-ok');
            
            if (hintEl) hintEl.remove();
            if (warningEl) warningEl.remove();
            if (okEl) okEl.remove();
            
            const valuesDiv = spellsBox.querySelector('.counter-values');
            if (valuesDiv) {
                const newEl = document.createElement('div');
                if (isOver) {
                    newEl.className = 'counter-warning';
                    newEl.textContent = `⚠️ Superato di ${totalSpells - maxSpells}!`;
                } else if (isAtLimit) {
                    newEl.className = 'counter-ok';
                    newEl.textContent = '✓ Limite raggiunto';
                } else {
                    newEl.className = 'counter-hint';
                    newEl.textContent = `Puoi sceglierne altri ${maxSpells - totalSpells}`;
                }
                valuesDiv.after(newEl);
            }
        }
        
        // === AGGIORNA RIEPILOGO ===
        const summary = this.container.querySelector('#spells-summary');
        if (summary) {
            const totalEl = summary.querySelector('.total-count');
            const cantripsTotalEl = summary.querySelector('.cantrips-total');
            const spellsTotalEl = summary.querySelector('.spells-total');
            
            if (totalEl) totalEl.textContent = knownSpells.length;
            if (cantripsTotalEl) cantripsTotalEl.textContent = totalCantrips;
            if (spellsTotalEl) spellsTotalEl.textContent = totalSpells;
        }
        
        // === AGGIORNA SEZIONI PER LIVELLO ===
        for (let level = 0; level <= 9; level++) {
            const section = this.container.querySelector(`.spells-level-section[data-level="${level}"]`);
            if (!section) continue;
            
            const count = countByLevel[level] || 0;
            const levelCountEl = section.querySelector('.level-count');
            if (levelCountEl) levelCountEl.textContent = count;
            
            // Aggiorna classe sezione per trucchetti
            if (level === 0 && maxCantrips !== null) {
                const counterEl = section.querySelector('.level-counter');
                if (counterEl) {
                    counterEl.className = `level-counter ${count > maxCantrips ? 'over-limit' : count === maxCantrips ? 'at-limit' : ''}`;
                }
                
                // Warning per livello
                let warningEl = section.querySelector('.level-warning');
                if (count > maxCantrips) {
                    if (!warningEl) {
                        warningEl = document.createElement('div');
                        warningEl.className = 'level-warning';
                        const header = section.querySelector('.spells-level-header');
                        if (header) header.after(warningEl);
                    }
                    warningEl.textContent = `⚠️ Superato il limite di ${maxCantrips} trucchetti!`;
                } else if (warningEl) {
                    warningEl.remove();
                }
            }
        }
        
        // === AGGIORNA LABELS CHECKBOX ===
        let wasOverLimit = this._previousSpellOverLimit || false;
        let isNowOverLimit = false;
        
        // Controlla se siamo over limit
        const isCantripsOver = maxCantrips !== null && totalCantrips > maxCantrips;
        const isSpellsOver = maxSpells !== null && selectSpells && totalSpells > maxSpells;
        isNowOverLimit = isCantripsOver || isSpellsOver;
        
        allCheckboxes.forEach(checkbox => {
            const spell = checkbox.dataset.spell;
            const label = checkbox.closest('label.spell-cb');
            if (!label) return;
            
            // Supporta sia string che object nel check
            const isSelected = knownSpells.some(s => (typeof s === 'string' ? s : s.name) === spell);
            checkbox.checked = isSelected;
            
            // Rimuovi classi
            label.classList.remove('selected', 'over-limit');
            
            if (isSelected) {
                label.classList.add('selected');
                
                // Verifica se over-limit - TUTTI gli incantesimi selezionati diventano rossi
                const level = parseInt(checkbox.dataset.level) || 0;
                if (level === 0 && isCantripsOver) {
                    label.classList.add('over-limit');
                } else if (level > 0 && isSpellsOver) {
                    // ANCHE gli incantesimi di livello superiore diventano rossi!
                    label.classList.add('over-limit');
                }
            }
        });
        
        // === AGGIUNGI CLASSE OVER-LIMIT ALLE SEZIONI ===
        for (let level = 0; level <= 9; level++) {
            const section = this.container.querySelector(`.spells-level-section[data-level="${level}"]`);
            if (!section) continue;
            
            if (level === 0 && isCantripsOver) {
                section.classList.add('over-limit');
            } else if (level > 0 && isSpellsOver) {
                section.classList.add('over-limit');
            } else {
                section.classList.remove('over-limit');
            }
        }
        
        // === MOSTRA POPUP WARNING ===
        if (isNowOverLimit && !wasOverLimit) {
            this.showSpellLimitPopup(isCantripsOver, isSpellsOver, totalCantrips, maxCantrips, totalSpells, maxSpells);
        }
        
        // Salva stato per prossimo confronto
        this._previousSpellOverLimit = isNowOverLimit;
    }
    
    /**
     * Mostra un popup temporaneo per warning limite incantesimi
     */
    showSpellLimitPopup(isCantripsOver, isSpellsOver, totalCantrips, maxCantrips, totalSpells, maxSpells) {
        // Rimuovi popup esistente
        const existing = document.querySelector('.spell-limit-popup');
        if (existing) existing.remove();
        
        let message = '';
        if (isCantripsOver && isSpellsOver) {
            message = `⚠️ ATTENZIONE!\nTrucchetti: ${totalCantrips}/${maxCantrips} (+${totalCantrips - maxCantrips})\nIncantesimi: ${totalSpells}/${maxSpells} (+${totalSpells - maxSpells})`;
        } else if (isCantripsOver) {
            message = `⚠️ ATTENZIONE!\nTrucchetti superati: ${totalCantrips}/${maxCantrips} (+${totalCantrips - maxCantrips})`;
        } else if (isSpellsOver) {
            message = `⚠️ ATTENZIONE!\nIncantesimi superati: ${totalSpells}/${maxSpells} (+${totalSpells - maxSpells})`;
        }
        
        const popup = document.createElement('div');
        popup.className = 'spell-limit-popup';
        popup.innerHTML = message.replace(/\n/g, '<br>');
        document.body.appendChild(popup);
        
        // Rimuovi dopo 3 secondi (traccia il timeout per cleanup)
        this._popupTimeout = setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
            }, SPELL_LIMIT_POPUP_TIMEOUT_MS);
    }
    
    /**
     * Aggiorna tutte le etichette degli incantesimi (legacy, redirect)
     */
    updateAllSpellLabels() {
        this.updateSpellCounters();
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
    // GESTIONE CA (CLASSE ARMATURA)
    // ========================================================================
    
    /**
     * Mostra il modal per modificare la CA
     */
    showAcModal(button) {
        // Rimuovi modal esistente
        this.hideAcModal();
        
        const pg = this.dataManager.getById(this.selectedPgId);
        const currentAc = pg?.armorClass || DEFAULT_AC;
        
        // Crea modal inline
        const modal = document.createElement('div');
        modal.className = 'ac-modal';
        modal.id = 'ac-modal';
        modal.innerHTML = `
            <input type="number" id="ac-input" value="${currentAc}" min="1" max="${MAX_AC}">
            <button class="btn-save-ac" title="Salva">✓</button>
            <button class="btn-cancel-ac" title="Annulla">✕</button>
        `;
        
        // Posiziona vicino al pulsante
        const acDisplay = button.closest('.ac-display') || button.parentElement;
        acDisplay.style.position = 'relative';
        acDisplay.appendChild(modal);
        
        // Focus sull'input
        modal.querySelector('#ac-input').focus();
        modal.querySelector('#ac-input').select();
    }
    
    /**
     * Nasconde il modal CA
     */
    hideAcModal() {
        const existing = document.getElementById('ac-modal');
        if (existing) existing.remove();
    }
    
    /**
     * Salva la CA dal modal
     */
    saveAcFromModal(button) {
        const modal = button.closest('.ac-modal');
        const input = modal?.querySelector('#ac-input');
        if (!input) return;
        
        const newAc = parseInt(input.value) || 10;
        if (!this.selectedPgId) return;
        
        // Update mirato — non passare l'intero oggetto pg per evitare merge di dati stale
        this.dataManager.update(this.selectedPgId, {
            armorClass: newAc,
            armorClassOverride: true
        });
        
        showToast(`CA aggiornata a ${newAc}`, 'success');
        this.hideAcModal();
    }
    
    // ========================================================================
    // GESTIONE INVENTARIO
    // ========================================================================
    
    /**
     * Aggiunge un oggetto dal database all'inventario
     */
    addItemToInventory(itemIndex) {
        const item = this.databases.items.find(i => i.index === itemIndex);
        if (!item) {
            showToast('Oggetto non trovato.', 'error');
            return;
        }
        
        if (!this.wizardData.inventory) this.wizardData.inventory = [];
        
        // Controlla se l'oggetto è già nell'inventario
        const existingIdx = this.wizardData.inventory.findIndex(i => i.index === itemIndex);
        if (existingIdx >= 0) {
            // Incrementa quantità
            this.wizardData.inventory[existingIdx].quantity = 
                (this.wizardData.inventory[existingIdx].quantity || 1) + 1;
        } else {
            // Aggiungi nuovo oggetto
            this.wizardData.inventory.push({
                ...item,
                quantity: 1
                });
            }
        
        this.updateInventoryDisplay();
        showToast(`${item.name} aggiunto!`, 'success');
    }
    
    /**
     * Rimuove un oggetto dall'inventario
     */
    removeItemFromInventory(index) {
        if (!this.wizardData.inventory) return;
        
        const item = this.wizardData.inventory[index];
        if (!item) return;
        
        this.wizardData.inventory.splice(index, 1);
        this.updateInventoryDisplay();
        showToast(`${item.name} rimosso.`, 'info');
    }
    
    /**
     * Aggiorna la quantità di un oggetto
     */
    updateItemQuantity(index, quantity) {
        if (!this.wizardData.inventory) return;
        
        if (this.wizardData.inventory[index]) {
            this.wizardData.inventory[index].quantity = Math.max(1, quantity);
            this.updateInventoryDisplay();
        }
    }
    
    /**
     * Aggiunge un oggetto personalizzato
     */
    addCustomItem() {
        const nameInput = this.container.querySelector('#custom-item-name');
        const qtyInput = this.container.querySelector('#custom-item-qty');
        const weightInput = this.container.querySelector('#custom-item-weight');
        const costInput = this.container.querySelector('#custom-item-cost');
        
        const name = nameInput?.value?.trim();
        if (!name) {
            showToast('Inserisci un nome per l\'oggetto.', 'warning');
            return;
        }
        
        const qty = parseInt(qtyInput?.value) || 1;
        const weight = parseFloat(weightInput?.value) || 0;
        const costStr = costInput?.value || '0';
        
        // Parse costo (es. "10 mo" -> {quantity: 10, unit: 'mo'})
        const costMatch = costStr.match(/^(\d+)\s*(mo|ma|mr|mp)?$/i);
        const cost = costMatch ? {
            quantity: parseInt(costMatch[1]),
            unit: (costMatch[2] || 'mo').toLowerCase()
        } : { quantity: 0, unit: 'mo' };
        
        if (!this.wizardData.inventory) this.wizardData.inventory = [];
        
        this.wizardData.inventory.push({
            index: `custom-${Date.now()}`,
            name: name,
            quantity: qty,
            weight: weight,
            cost: cost,
            custom: true,
            equipment_category: { name: 'Custom', index: 'custom' }
        });
        
        // Pulisci i campi
        if (nameInput) nameInput.value = '';
        if (qtyInput) qtyInput.value = '1';
        if (weightInput) weightInput.value = '0';
        if (costInput) costInput.value = '';
        
        this.updateInventoryDisplay();
        showToast(`${name} aggiunto!`, 'success');
    }
    
    /**
     * Aggiunge equipaggiamento suggerito (come testo)
     */
    addSuggestedEquipment(text) {
        if (!this.wizardData.inventory) this.wizardData.inventory = [];
        
        this.wizardData.inventory.push({
            index: `suggested-${Date.now()}`,
            name: text,
            quantity: 1,
            weight: 0,
            cost: { quantity: 0, unit: 'mo' },
            custom: true,
            suggested: true,
            equipment_category: { name: 'Suggerito', index: 'suggested' }
        });
        
        this.updateInventoryDisplay();
        showToast('Equipaggiamento aggiunto!', 'success');
    }
    
    /**
     * Seleziona un'opzione di scelta (a) o (b)
     */
    selectEquipmentChoice(choiceKey, option) {
        if (!this.wizardData._selectedChoices) {
            this.wizardData._selectedChoices = {};
        }
        this.wizardData._selectedChoices[choiceKey] = option;
        this.render();
    }
    
    /**
     * Reset di una scelta
     */
    resetEquipmentChoice(choiceKey) {
        if (this.wizardData._selectedChoices) {
            delete this.wizardData._selectedChoices[choiceKey];
        }
        this.render();
    }
    
    /**
     * Accetta un suggerimento e lo espande nel contenuto
     * @param {string} key - Chiave del suggerimento
     * @param {string} text - Testo del suggerimento (fallback)
     * @param {string} source - Fonte (class/background)
     * @param {string} itemsJson - JSON con gli oggetti parsati (opzionale)
     */
    acceptSuggestion(key, text, source, itemsJson = null) {
        if (!this.wizardData.inventory) this.wizardData.inventory = [];
        if (!this.wizardData._acceptedSuggestions) this.wizardData._acceptedSuggestions = [];
        
        // Marca come accettato
        if (!this.wizardData._acceptedSuggestions.includes(key)) {
            this.wizardData._acceptedSuggestions.push(key);
        }
        
        // Se abbiamo il JSON con gli oggetti, usalo direttamente
        let items;
        if (itemsJson) {
            try {
                items = JSON.parse(decodeURIComponent(itemsJson));
            } catch (e) {
                console.warn('Errore parsing items JSON:', e);
                items = this.parseEquipmentText(text);
            }
        } else {
            // Parsing del testo per trovare oggetti e dotazioni
            items = this.parseEquipmentText(text);
        }
        
        // Aggiungi tutti gli oggetti trovati
        items.forEach(itemData => {
            // Cerca nel database per oggetti conosciuti
            const dbItem = this.findItemInDatabase(itemData.name);
            
            if (dbItem) {
                // Se è una dotazione, espandila
                if (dbItem.contents && dbItem.contents.length > 0) {
                    this.expandPackContents(dbItem, itemData.quantity);
                } else {
                    // Oggetto normale
                    this.addItemToInventoryDirect(dbItem, itemData.quantity, true);
                }
            } else {
                // Oggetto non trovato nel database, aggiungi come testo
                this.wizardData.inventory.push({
                    index: `text-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                    name: itemData.name,
                    quantity: itemData.quantity,
                    weight: 0,
                    cost: { quantity: 0, unit: 'mo' },
                    custom: true,
                    fromSuggestion: true,
                    equipment_category: { name: 'Testo', index: 'text' }
                });
            }
        });
        
        this.render();
        showToast('Equipaggiamento aggiunto!', 'success');
    }
    
    /**
     * Parsing del testo dell'equipaggiamento per estrarre oggetti
     */
    parseEquipmentText(text) {
        const items = [];

        // Step 1: Proteggi il contenuto tra parentesi dalla suddivisione
        const placeholders = [];
        let processed = text.replace(/\(([^)]+)\)/g, (match) => {
            const idx = placeholders.length;
            placeholders.push(match);
            return `__PH${idx}__`;
        });

        // Step 2: Dividi per virgola (con eventuale "e" dopo) e per " e "
        const parts = processed.split(/,\s*(?:e\s+)?|\s+e\s+/i);

        // Mapping numeri in lettere italiane
        const numberWords = {
            'un': 1, 'uno': 1, 'una': 1,
            'due': 2, 'tre': 3, 'quattro': 4,
            'cinque': 5, 'sei': 6, 'sette': 7,
            'otto': 8, 'nove': 9, 'dieci': 10
        };

        // Helper locale per processare un singolo componente
        const processPart = (part) => {
            // Ripristina placeholder parentetici
            placeholders.forEach((ph, i) => {
                part = part.replace(`__PH${i}__`, ph);
            });
            part = part.trim();
            if (!part) return;

            // Rimuovi articoli iniziali, inclusa elisione (un', l', d')
            // ma solo se la parola seguente >= 3 caratteri
            part = part.replace(/^(l'|un['a]?|una|uno|il|la|lo|le|i|gli|d')\s+(?=\w{3,})/i, '');
            // Gestisci elisione senza spazio: "un'arma" → "arma"
            part = part.replace(/^(un|uno|il|lo|la)'(?=\w{3,})/i, '');

            // Estrai quantità all'inizio: prima cifre, poi parole italiane
            const digitQtyMatch = part.match(/^(\d+)\s+(.+)$/);
            if (digitQtyMatch) {
                items.push({
                    name: digitQtyMatch[2].trim(),
                    quantity: parseInt(digitQtyMatch[1])
                });
                return;
            }

            const wordQtyMatch = part.match(/^(due|tre|quattro|cinque|sei|sette|otto|nove|dieci)\s+(.+)$/i);
            if (wordQtyMatch) {
                const qty = numberWords[wordQtyMatch[1].toLowerCase()];
                if (qty !== undefined) {
                    items.push({
                        name: wordQtyMatch[2].trim(),
                        quantity: qty
                    });
                    return;
                }
            }

            items.push({
                name: part,
                quantity: 1
            });
        };

        // Step 3: Processa ogni parte
        parts.forEach(part => {
            // Gestisci il pattern "X con N Y" (es. "faretra con 20 frecce")
            const conMatch = part.match(/^(.+?)\s+con\s+(\d+)\s+(.+)$/);
            if (conMatch) {
                // Processa l'item principale (prima di "con")
                processPart(conMatch[1]);
                // Aggiungi il sub-item (dopo "con") con quantità specificata
                let subName = conMatch[3];
                placeholders.forEach((ph, i) => {
                    subName = subName.replace(`__PH${i}__`, ph);
                });
                subName = subName.trim();
                // Rimuovi articoli dal sub-item (inclusa elisione)
                subName = subName.replace(/^(l'|un['a]?|una|uno|il|la|lo|le|i|gli|d')\s+(?=\w{3,})/i, '');
                subName = subName.replace(/^(un|uno|il|lo|la)'(?=\w{3,})/i, '');
                items.push({
                    name: subName,
                    quantity: parseInt(conMatch[2])
                });
            } else {
                processPart(part);
            }
        });

        return items;
    }
    
    /**
     * Cerca un oggetto nel database per nome (case insensitive, match parziale)
     */
    findItemInDatabase(name) {
        const nameLower = name.toLowerCase().trim();
        
        // Alias per le dotazioni (zaini) - mappa nomi comuni ai nomi del database
        const packAliases = {
            'zaino da diplomatico': 'dotazione da diplomatico',
            'zaino da intrattenitore': 'dotazione da intrattenitore',
            'zaino da esploratore': 'dotazione da esploratore',
            'zaino del chierico': 'dotazione del chierico',
            'zaino del druido': 'dotazione del druido',
            'zaino del ladro': 'dotazione del ladro',
            'zaino del mago': 'dotazione del mago',
            'zaino del monaco': 'dotazione del monaco',
            'zaino del paladino': 'dotazione del paladino',
            'zaino del ranger': 'dotazione del ranger',
            'zaino dello stregone': 'dotazione dello stregone',
            'zaino del guerriero': 'dotazione del guerriero',
            'zaino del barbaro': 'dotazione del barbaro',
            'zaino del bardo': 'dotazione del bardo'
        };
        
        // Alias per oggetti con nomi italiani diversi tra equipaggiamento e database
        // Copre: plurali → singolari, terminologia D&D italiana, varianti comuni
        const itemAliases = {
            // Armi - plurali → singolari / nomi alternativi
            'asce': 'accetta',                  // handaxe in SRD italiano = accetta
            'ascia': 'accetta',                 // ascia generica → accetta (handaxe)
            'accette': 'accetta',               // plurale di accetta
            'frecce': 'freccia',
            'pugnali': 'pugnale',
            'giavellotti': 'giavellotto',
            'dardi': 'dardo',
            'quadrelli': 'quadrelli da balestra',
            'scudi': 'scudo',
            'martelli da guerra': 'martello da guerra',
            'mazze': 'mazza',
            
            // Equipaggiamento - nomi diversi nel DB
            'attrezzi da ladro': 'arnesi da scasso',
            'faretra': 'farcastra',
            'simbolo sacro': 'amuleto',         // default holy symbol
            
            // Armature - varianti di denominazione
            'armatura a scaglie': 'corazza di scaglie',
            
            // Componenti e focus
            'borsa dei componenti': 'borsa delle componenti',
        };
        
        // Controlla se è un alias di oggetto (prima delle dotazioni)
        const itemAlias = itemAliases[nameLower];
        const searchName = itemAlias || packAliases[nameLower] || nameLower;
        
        // Prima prova match esatto
        let found = this.databases.items?.find(item => 
            item.name?.toLowerCase() === searchName
        );
        
        if (found) return found;
        
        // Poi prova match parziale (il nome dell'utente è contenuto nel nome del db)
        found = this.databases.items?.find(item => 
            item.name?.toLowerCase().includes(searchName) ||
            searchName.includes(item.name?.toLowerCase())
        );
        
        if (found) return found;
        
        // Gestisci casi speciali
        // Arco lungo -> arco-lungo
        const normalized = searchName.replace(/\s+/g, '-');
        found = this.databases.items?.find(item => 
            item.index === normalized || item.index?.includes(normalized)
        );
        
        if (found) return found;
        
        // Se ancora non trovato e contiene parole chiave di dotazioni, cerca per tipo
        if (searchName.includes('zaino') || searchName.includes('dotazione')) {
            // Estrai la parola chiave (es. "diplomatico" da "zaino da diplomatico")
            const keywords = searchName.replace(/zaino|dotazione|da|del|dello/gi, '').trim();
            if (keywords) {
                found = this.databases.items?.find(item => {
                    if (item.gear_category?.index !== 'equipment-packs') return false;
                    return item.name?.toLowerCase().includes(keywords);
                });
            }
        }
        
        return found;
    }
    
    /**
     * Espande il contenuto di una dotazione nell'inventario
     */
    expandPackContents(pack, multiplier = 1) {
        if (!pack.contents || pack.contents.length === 0) return;
        
        pack.contents.forEach(content => {
            const itemData = content.item;
            const qty = (content.quantity || 1) * multiplier;
            
            // Cerca l'oggetto nel database
            const dbItem = this.findItemInDatabase(itemData.name);
            
            if (dbItem) {
                this.addItemToInventoryDirect(dbItem, qty, true);
            } else {
                // Aggiungi con i dati minimi
                this.wizardData.inventory.push({
                    index: itemData.index || `pack-item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                    name: itemData.name,
                    quantity: qty,
                    weight: 0,
                    cost: { quantity: 0, unit: 'mo' },
                    custom: false,
                    fromPack: pack.name,
                    equipment_category: { name: 'Da Dotazione', index: 'pack-content' }
                });
            }
        });
    }
    
    /**
     * Aggiunge direttamente un oggetto all'inventario
     */
    addItemToInventoryDirect(item, quantity = 1, mergeExisting = true) {
        if (!this.wizardData.inventory) this.wizardData.inventory = [];
        
        // Se mergeExisting, cerca se esiste già
        if (mergeExisting) {
            const existingIdx = this.wizardData.inventory.findIndex(i => 
                i.index === item.index || i.name?.toLowerCase() === item.name?.toLowerCase()
            );
            
            if (existingIdx >= 0) {
                this.wizardData.inventory[existingIdx].quantity = 
                    (this.wizardData.inventory[existingIdx].quantity || 1) + quantity;
                return;
            }
        }
        
        // Aggiungi come nuovo oggetto
        this.wizardData.inventory.push({
            ...item,
            quantity: quantity,
            custom: false
            // fromPack viene ereditato da item se presente, altrimenti non imposto
        });
    }
    
    /**
     * Filtra gli oggetti per categoria
     */
    filterItemsByCategory(category) {
        this.wizardData._itemCategory = category;
        this.wizardData._itemSearch = '';
        this.render();
    }
    
    /**
     * Cerca oggetti nel database
     */
    searchItems(term) {
        this.wizardData._itemSearch = term;
        // Non re-renderizzare, aggiorna solo i risultati
        this.updateItemResults(term, this.wizardData._itemCategory || 'all');
    }
    
    /**
     * Aggiorna i risultati della ricerca oggetti
     */
    updateItemResults(searchTerm, category) {
        const resultsContainer = this.container.querySelector('.item-results');
        if (!resultsContainer) return;
        
        let items = [...this.databases.items];
        
        if (category !== 'all') {
            items = items.filter(i => i.equipment_category?.index === category);
        }
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            items = items.filter(i => i.name?.toLowerCase().includes(term));
        }
        
        items = items.slice(0, 50);
        
        const getItemIcon = (item) => {
            const cat = item.equipment_category?.index;
            if (cat === 'weapon') return '⚔️';
            if (cat === 'armor') return '🛡️';
            if (cat === 'tools') return '🔧';
            if (cat === 'mounts-and-vehicles') return '🐴';
            return '🎒';
        };
        
        const formatCost = (cost) => {
            if (!cost) return '-';
            return `${cost.quantity || 0} ${cost.unit || 'mo'}`;
        };
        
        resultsContainer.innerHTML = items.length === 0 
            ? '<p class="no-results">Nessun oggetto trovato</p>'
            : items.map(item => `
                <div class="item-result-row" data-item-index="${item.index}">
                    <span class="item-icon">${getItemIcon(item)}</span>
                    <span class="item-name">${escapeHtml(item.name)}</span>
                    <span class="item-weight">${item.weight || 0} kg</span>
                    <span class="item-cost">${formatCost(item.cost)}</span>
                    <button type="button" class="btn btn-sm btn-add-item" 
                            data-item-index="${item.index}" title="Aggiungi">+</button>
                </div>
            `).join('');
    }
    
    /**
     * Aggiorna le monete
     */
    updateCoins() {
        const gold = parseInt(this.container.querySelector('#coins-gold')?.value) || 0;
        const silver = parseInt(this.container.querySelector('#coins-silver')?.value) || 0;
        const copper = parseInt(this.container.querySelector('#coins-copper')?.value) || 0;
        
        // Converti nel sistema di monete D&D (1 mo = 10 ma = 100 mr = 1000 mc)
        this.wizardData.treasure = {
            cp: copper,
            sp: silver,
            ep: 0,
            gp: gold,
            pp: 0,
            items: []
        };
    }
    
    /**
     * Aggiorna il display dell'inventario senza re-render
     */
    updateInventoryDisplay() {
        const inventory = this.wizardData.inventory || [];
        
        // Aggiorna riepilogo
        const summaryBox = this.container.querySelector('.inventory-summary-box');
        if (summaryBox) {
            const itemCount = inventory.length;
            const totalWeight = inventory.reduce((t, i) => t + ((i.weight || 0) * (i.quantity || 1)), 0);
            const totalCost = inventory.reduce((t, i) => {
                const cost = (i.cost?.quantity || 0) * ({ mo: 100, ma: 10, mr: 1 }[i.cost?.unit] || 1);
                return t + (cost * (i.quantity || 1));
            }, 0);
            
            const stats = summaryBox.querySelectorAll('.stat-value');
            if (stats.length >= 3) {
                stats[0].textContent = itemCount;
                stats[1].textContent = `${totalWeight.toFixed(1)} kg`;
                stats[2].textContent = totalCost >= 100 
                    ? `${Math.floor(totalCost / 100)} mo` 
                    : `${totalCost} mr`;
            }
        }
        
        // Aggiorna tabella
        const tbody = this.container.querySelector('.inventory-table tbody');
        if (tbody) {
            const getItemIcon = (item) => {
                const cat = item.equipment_category?.index;
                if (cat === 'weapon') return '⚔️';
                if (cat === 'armor') return '🛡️';
                if (cat === 'tools') return '🔧';
                if (cat === 'mounts-and-vehicles') return '🐴';
                return '🎒';
            };
            
            const formatCost = (cost) => {
                if (!cost) return '-';
                return `${cost.quantity || 0} ${cost.unit || 'mo'}`;
            };
            
            tbody.innerHTML = inventory.map((item, idx) => `
                <tr class="inventory-row ${item.custom ? 'custom-item' : ''}" data-index="${idx}">
                    <td class="item-name">
                        <span class="item-icon">${getItemIcon(item)}</span>
                        ${escapeHtml(item.name)}
                        ${item.custom ? '<span class="custom-badge">custom</span>' : ''}
                    </td>
                    <td class="item-qty">
                        <input type="number" class="qty-input" data-index="${idx}" 
                               value="${item.quantity || 1}" min="1" max="999">
                    </td>
                    <td class="item-weight">${(item.weight || 0) * (item.quantity || 1)} kg</td>
                    <td class="item-cost">${formatCost(item.cost)}</td>
                    <td class="item-actions">
                        <button type="button" class="btn-icon-sm btn-remove-item" 
                                data-index="${idx}" title="Rimuovi">🗑️</button>
                    </td>
                </tr>
            `).join('');
        }
    }
    
    // ========================================================================
    // CALCOLO STATISTICHE FINALI
    // ========================================================================
    
    calculateFinalStats() {
        this.wizardData.proficiencyBonus = calculateProficiencyBonus(this.wizardData.level);
        
        // Applica bonus razziali e ASI alle capacità prima di calcolare il resto
        // Le abilità nel wizard sono valori base; questi metodi aggiungono i bonus
        this.applyRacialBonusesToWizardData();
        this.applyASIToWizardData();
        
        this.recalculateHp();
        
        this.wizardData.initiative = calculateModifier(this.wizardData.abilities.dexterity);
        
        // Calcola CA basata su armatura equipaggiata e DES
        const acResult = calculateArmorClass(this.wizardData, this.databases.items);
        this.wizardData.armorClass = acResult.ac;
        this.wizardData.armorInfo = {
            name: acResult.armorName,
            hasShield: acResult.hasShield,
            shieldBonus: acResult.shieldBonus
        };
        
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
            
            // Calcola slot incantesimi per livello
            const spellSlots = calculateSpellSlots(this.databases.selectedClass.index, this.wizardData.level);
            
            this.wizardData.spellcasting = {
                ability: spellAbility,
                spellSaveDC: 8 + this.wizardData.proficiencyBonus + calculateModifier(abilityScore),
                spellAttackBonus: this.wizardData.proficiencyBonus + calculateModifier(abilityScore),
                slots: spellSlots,
                spellsKnown: this.wizardData.spellcasting?.spellsKnown || [],
                spellsPrepared: this.wizardData.spellcasting?.spellsPrepared || [],
                isWarlock: this.databases.selectedClass.index === 'warlock'
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
    // DYNAMIC SELECTOR - Selezione oggetti dal database
    // ========================================================================
    
    /**
     * Stato temporaneo per il selettore dinamico
     */
    _dynamicSelection = {
        selectedItems: [],
        maxQuantity: 1,
        suggestionKey: null,
        source: null
    };
    
    /**
     * Apre il modal per selezionare oggetti dal database
     */
    openDynamicSelector(suggestionKey, suggestionText, filterJson, quantity, category, source) {
        let filter;
        try {
            filter = JSON.parse(decodeURIComponent(filterJson));
        } catch (e) {
            console.error('Errore parsing filter:', e);
            return;
        }
        
        // Reset stato
        this._dynamicSelection = {
            selectedItems: [],
            maxQuantity: quantity,
            suggestionKey: suggestionKey,
            source: source
        };
        
        // Filtra oggetti dal database
        const filteredItems = this.filterItemsFromDatabase(filter);
        
        // Renderizza modal
        const modalHtml = this.renderDynamicSelectorModal({
            suggestionKey,
            suggestionText,
            filter,
            quantity,
            category,
            items: filteredItems,
            source
        });
        
        // Aggiungi modal al DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer.firstElementChild);
        
        // Bind eventi specifici del modal
        this.bindDynamicSelectorEvents();
    }
    
    /**
     * Filtra oggetti dal database in base al filtro
     */
    filterItemsFromDatabase(filter) {
        if (!this.databases.items) return [];
        
        return this.databases.items.filter(item => {
            // Filtro per tipo
            if (filter.type) {
                const catIndex = item.equipment_category?.index || '';
                const isType = catIndex.includes(filter.type) || 
                              (filter.type === 'weapon' && catIndex === 'weapon') ||
                              (filter.type === 'armor' && catIndex === 'armor') ||
                              (filter.type === 'tool' && catIndex === 'tools') ||
                              (filter.type === 'pack' && item.gear_category?.index === 'equipment-packs');
                if (!isType) return false;
            }
            
            // Filtro per weapon_category
            if (filter.weapon_category) {
                const wc = (item.weapon_category || '').toLowerCase();
                if (!wc.includes(filter.weapon_category.toLowerCase())) return false;
            }
            
            // Filtro per weapon_range
            if (filter.weapon_range) {
                const wr = (item.weapon_range || '').toLowerCase();
                if (!wr.includes(filter.weapon_range.toLowerCase())) return false;
            }
            
            // Filtro per armor_category
            if (filter.armor_category) {
                const ac = (item.armor_category || '').toLowerCase();
                if (!ac.includes(filter.armor_category.toLowerCase())) return false;
            }
            
            // Filtro per tool_category
            if (filter.tool_category) {
                const tc = (item.tool_category || '').toLowerCase();
                if (!tc.includes(filter.tool_category.toLowerCase())) return false;
            }
            
            return true;
        });
    }
    
    /**
     * Renderizza il modal del selettore dinamico
     */
    renderDynamicSelectorModal(options) {
        const { suggestionKey, suggestionText, quantity, category, items, source } = options;
        
        const getItemIcon = (item) => {
            const cat = item.equipment_category?.index;
            if (cat === 'weapon') return '⚔️';
            if (cat === 'armor') return '🛡️';
            if (cat === 'tools') return '🔧';
            return '🎒';
        };
        
        const formatCost = (cost) => {
            if (!cost) return '-';
            return `${cost.quantity || 0} ${cost.unit || 'mo'}`;
        };
        
        return `
            <div class="dynamic-selector-overlay" id="dynamic-selector-overlay">
                <div class="dynamic-selector-modal">
                    <div class="dynamic-selector-header">
                        <h3>🎯 Seleziona ${quantity > 1 ? quantity + ' oggetti' : 'un oggetto'}</h3>
                        <p class="dynamic-selector-subtitle">${escapeHtml(suggestionText)}</p>
                        <span class="dynamic-selector-category">${escapeHtml(category)}</span>
                    </div>
                    
                    <div class="dynamic-selector-search">
                        <input type="text" id="dynamic-search-input" placeholder="Cerca...">
                    </div>
                    
                    <div class="dynamic-selector-info">
                        <span>Selezionati: <strong id="dynamic-selected-count">0</strong> / ${quantity}</span>
                    </div>
                    
                    <div class="dynamic-selector-list" id="dynamic-items-list">
                        ${items.length === 0 
                            ? '<p class="no-items-found">Nessun oggetto trovato per questa categoria</p>'
                            : items.map((item, idx) => `
                                <div class="dynamic-item" data-item-index="${item.index}">
                                    <div class="dynamic-item-info">
                                        <span class="dynamic-item-icon">${getItemIcon(item)}</span>
                                        <span class="dynamic-item-name">${escapeHtml(item.name)}</span>
                                    </div>
                                    <div class="dynamic-item-details">
                                        <span class="dynamic-item-weight">${item.weight || 0} kg</span>
                                        <span class="dynamic-item-cost">${formatCost(item.cost)}</span>
                                    </div>
                                    <button type="button" class="btn btn-sm btn-toggle-dynamic-item" 
                                            data-item-index="${item.index}"
                                            data-item-name="${escapeHtml(item.name)}"
                                            data-item-weight="${item.weight || 0}"
                                            title="Seleziona">☐</button>
                                </div>
                            `).join('')
                        }
                    </div>
                    
                    <div class="dynamic-selector-actions">
                        <button type="button" class="btn btn-secondary" id="btn-cancel-dynamic-selector">Annulla</button>
                        <button type="button" class="btn btn-primary" id="btn-confirm-dynamic-selection"
                                data-suggestion-key="${suggestionKey}"
                                data-quantity="${quantity}"
                                data-source="${source}"
                                disabled>
                            Conferma selezione
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Bind eventi specifici del modal dinamico
     */
    bindDynamicSelectorEvents() {
        const overlay = document.getElementById('dynamic-selector-overlay');
        if (!overlay) return;
        
        // Search input
        const searchInput = document.getElementById('dynamic-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterDynamicItems(e.target.value);
            });
        }
        
        // Toggle item buttons
        overlay.querySelectorAll('.btn-toggle-dynamic-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.target.closest('.btn-toggle-dynamic-item');
                const itemIndex = button.dataset.itemIndex;
                const itemName = button.dataset.itemName;
                const itemWeight = parseFloat(button.dataset.itemWeight) || 0;
                this.toggleDynamicItemSelection(button, itemIndex, itemName, itemWeight);
            });
        });
        
        // Pulsante Conferma
        const confirmBtn = document.getElementById('btn-confirm-dynamic-selection');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', (e) => {
                const button = e.target;
                const suggestionKey = button.dataset.suggestionKey;
                const source = button.dataset.source;
                this.confirmDynamicSelection(suggestionKey, source);
            });
        }
        
        // Pulsante Annulla
        const cancelBtn = document.getElementById('btn-cancel-dynamic-selector');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeDynamicSelector();
            });
        }
        
        // Chiudi cliccando fuori dal modal
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeDynamicSelector();
            }
        });
    }
    
    /**
     * Filtra gli oggetti nel modal dinamico
     */
    filterDynamicItems(searchTerm) {
        const list = document.getElementById('dynamic-items-list');
        if (!list) return;
        
        const items = list.querySelectorAll('.dynamic-item');
        const term = searchTerm.toLowerCase();
        
        items.forEach(item => {
            const name = item.querySelector('.dynamic-item-name')?.textContent.toLowerCase() || '';
            item.style.display = name.includes(term) ? '' : 'none';
        });
    }
    
    /**
     * Toggle selezione di un oggetto nel modal
     */
    toggleDynamicItemSelection(button, itemIndex, itemName, itemWeight) {
        const { selectedItems, maxQuantity } = this._dynamicSelection;
        const existingIdx = selectedItems.findIndex(i => i.index === itemIndex);
        
        if (existingIdx >= 0) {
            // Deseleziona
            selectedItems.splice(existingIdx, 1);
            button.textContent = '☐';
            button.closest('.dynamic-item').classList.remove('selected');
        } else {
            // Verifica limite
            if (selectedItems.length >= maxQuantity) {
                showToast(`Puoi selezionare al massimo ${maxQuantity} oggetti`, 'warning');
                return;
            }
            // Seleziona
            selectedItems.push({ index: itemIndex, name: itemName, weight: itemWeight, quantity: 1 });
            button.textContent = '☑';
            button.closest('.dynamic-item').classList.add('selected');
        }
        
        // Aggiorna contatore
        const countEl = document.getElementById('dynamic-selected-count');
        if (countEl) {
            countEl.textContent = selectedItems.length;
        }
        
        // Abilita/disabilita pulsante conferma
        const confirmBtn = document.getElementById('btn-confirm-dynamic-selection');
        if (confirmBtn) {
            confirmBtn.disabled = selectedItems.length === 0;
        }
    }
    
    /**
     * Conferma la selezione dinamica
     */
    confirmDynamicSelection(suggestionKey, source) {
        const { selectedItems } = this._dynamicSelection;
        
        if (selectedItems.length === 0) {
            showToast('Seleziona almeno un oggetto', 'warning');
            return;
        }
        
        // Aggiungi gli oggetti all'inventario
        selectedItems.forEach(item => {
            // Cerca nel database per ottenere dati completi
            const dbItem = this.findItemInDatabase(item.name);
            if (dbItem) {
                this.addItemToInventoryDirect(dbItem, 1, true);
            } else {
                // Aggiungi come oggetto base
                if (!this.wizardData.inventory) this.wizardData.inventory = [];
                this.wizardData.inventory.push({
                    index: item.index || `dynamic-${Date.now()}`,
                    name: item.name,
                    quantity: 1,
                    weight: item.weight || 0,
                    cost: { quantity: 0, unit: 'mo' },
                    custom: true,
                    fromDynamicSelection: true,
                    equipment_category: { name: 'Selezione', index: 'dynamic' }
                });
            }
        });
        
        // Marca il suggerimento come accettato
        if (!this.wizardData._acceptedSuggestions) this.wizardData._acceptedSuggestions = [];
        if (!this.wizardData._acceptedSuggestions.includes(suggestionKey)) {
            this.wizardData._acceptedSuggestions.push(suggestionKey);
        }
        
        // Chiudi modal
        this.closeDynamicSelector();
        
        // Re-render
        this.render();
        showToast(`${selectedItems.length} oggetto/i aggiunto/i all'inventario!`, 'success');
    }
    
    /**
     * Chiude il modal dinamico
     */
    closeDynamicSelector() {
        const overlay = document.getElementById('dynamic-selector-overlay');
        if (overlay) {
            overlay.remove();
        }
        this._dynamicSelection = {
            selectedItems: [],
            maxQuantity: 1,
            suggestionKey: null,
            source: null
        };
    }
    
    // ========================================================================
    // SALVATAGGIO E CRUD
    // ========================================================================
    
    savePg() {
        console.log('🎮 [PgController] Salvataggio PG');
        console.log('🎮 [PgController] wizardData.inventory:', this.wizardData.inventory);
        
        const validation = this.dataManager.validate(this.wizardData);
        if (!validation.isValid) {
            showToast(validation.errors[0], 'error');
            return;
        }
        
        // calculateFinalStats() viene chiamato in nextStep() quando si arriva allo step 7.
        // Non va richiamato qui per evitare double-apply dei bonus razziali/ASI.
        
        // Assicurati che l'inventario sia un array
        if (!this.wizardData.inventory) {
            this.wizardData.inventory = [];
        }
        
        console.log('🎮 [PgController] Salvataggio con inventario:', this.wizardData.inventory.length, 'oggetti');
        
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
        this.wizardData = this.createEmptyPg();
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
    
    /**
     * Apre il popup per gestire l'equipaggiamento del PG.
     */
    async openEquipmentPopup(pgId) {
        const pg = this.dataManager.getById(pgId);
        if (!pg) {
            showToast('PG non trovato.', 'error');
            return;
        }
        
        try {
            // Import dinamico per evitare dipendenze circolari
            const equipmentModule = await import('../../equipment/index.js');
            
            equipmentModule.openEquipmentPopup({
                owner: pg,
                ownerType: 'pc',
                onSave: (state) => {
                    // Aggiorna i dati del PG
                    const updatedData = {
                        inventory: state.inventory,
                        equippedSlots: state.equippedSlots,
                        // Sincronizza equipment con gli oggetti equipaggiati
                        equipment: state.inventory.filter(item => item.equipped)
                    };
                    
                    this.dataManager.update(pgId, updatedData);
                    
                    // Ricalcola statistiche derivate (CA, peso, etc.)
                    this.recalculateDerivedStats(pgId);
                    
                    // Aggiorna la vista
                    this.render();
                    
                    console.log('🎮 [PgController] Equipaggiamento salvato per:', pg.name);
                }
            });
        } catch (error) {
            console.error('🎮 [PgController] Errore apertura popup equipaggiamento:', error);
            showToast('Errore durante l\'apertura del popup equipaggiamento.', 'error');
        }
    }
    
    // NOTE: Il livello-up wizard è gestito da PgLevelUpManager (modules/campagna/pg/PgLevelUpManager.js)
    // I metodi sono: startLevelUp, levelUpNextStep, levelUpPrevStep, cancelLevelUp, confirmLevelUp,
    // _renderLevelUpStep, _calculateLevelUpChanges, _getMaxSpellLevelForClass,
    // _renderLevelUpStep1HP, _renderLevelUpStep2Spells, _isCantrip, _findSpellLevel,
    // _handleWizardSpellToggle, _handleWizardSwapOut, _handleWizardSwapIn,
    // _handleWizardClearSwap, _handleWizardHpChoice, _handleWizardASI, getSpellcastingAbility
    
    /**
     * Ricalcola le statistiche derivate dopo modifiche all'equipaggiamento.
     */
    recalculateDerivedStats(pgId) {
        const pg = this.dataManager.getById(pgId);
        if (!pg) return;
        
        // Ricalcola CA dall'equipaggiamento
        const acResult = calculateArmorClass(pg, this.databases.items);
        
        // Ricalcola peso
        const inventory = pg.inventory || [];
        const totalWeight = inventory.reduce((total, item) => {
            const weight = item.weight || 0;
            const qty = item.quantity || 1;
            return total + (weight * qty);
        }, 0);
        
        // Aggiorna solo i campi calcolati
        this.dataManager.update(pgId, {
            armorClass: acResult.ac,
            weight: totalWeight
        });
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
        
        // Aggiorna la sidebar
        this.updateSidebarHp();
    }
    
    /**
     * Aggiorna la Classe Armatura in tempo reale
     */
    updateArmorClass(newAc) {
        if (!this.selectedPgId) return;
        
        const pg = this.dataManager.getById(this.selectedPgId);
        if (!pg) return;
        
        const clampedAc = Math.max(1, Math.min(MAX_AC, newAc));
        
        this.dataManager.update(this.selectedPgId, {
            armorClass: clampedAc
        });
    }
    
    /**
     * Aggiorna la visualizzazione HP nella sidebar
     */
    updateSidebarHp() {
        if (!this.selectedPgId) return;
        
        const pg = this.dataManager.getById(this.selectedPgId);
        if (!pg) return;
        
        const sidebarCard = this.container.querySelector(`.pg-sidebar-card[data-pg-id="${this.selectedPgId}"]`);
        if (sidebarCard) {
            const hp = pg.hp || { current: 0, max: 0 };
            const hpPercent = hp.max > 0 ? (hp.current / hp.max) * 100 : 0;
            
            const hpFill = sidebarCard.querySelector('.hp-fill');
            if (hpFill) {
                hpFill.style.width = `${hpPercent}%`;
                hpFill.className = `hp-fill ${hpPercent > 50 ? 'healthy' : hpPercent > 25 ? 'wounded' : 'critical'}`;
            }
        }
    }
    
    promptAddCondition() {
        if (!this.selectedPgId) return;
        
        const condition = prompt(`Condizione:\n\n${CONDITIONS.join(', ')}`);
        
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
        
        // Pulisci tutti gli event handler per prevenire memory leak
        this.container.onclick = null;
        this.container.onchange = null;
        this.container.oninput = null;
        this.container.onmouseover = null;
        this.container.onmouseout = null;
        this.container.innerHTML = '';
        
        // Cancella timeout pendenti per evitare callback su componente distrutto
        if (this._tooltipTimeout) { clearTimeout(this._tooltipTimeout); this._tooltipTimeout = null; }
        if (this._popupTimeout) { clearTimeout(this._popupTimeout); this._popupTimeout = null; }
        
        // Reset stato
        this.selectedPgId = null;
        this.mode = 'view';
        this.currentStep = 1;
        this.wizardData = this.createEmptyPg();
        this.databases = null;
    }
}

console.log('🎮 [PgController] Modulo caricato.');
