/**
 * equipmentPopup.js
 * ─────────────────────────────────────────────────────────────
 * Popup completo per la gestione dell'equipaggiamento.
 * Include figura umana con slot e pannello inventario.
 * 
 * @version 2.0.0 - Figura umana + slot visivi
 */

import { showToast } from '../../../utils/toast.js';
import { renderBodySVG } from './components/bodySlotRenderer.js';
import { renderInventoryPanel, renderItemDetail } from './components/inventoryPanel.js';
import { SLOT_TYPES, isItemCompatibleWithSlot } from './config/slotTypes.js';
import { searchItems, getItemByIndex, isItemEquippable, getEquipmentCategories, formatCost, formatWeight } from './services/itemLoader.js';

/**
 * Popup per la gestione dell'equipaggiamento
 */
export class EquipmentPopup {
    constructor() {
        this.container = null;
        this.character = null;
        this.characterType = null;
        this.inventory = [];
        this.equippedSlots = {};
        this.onSave = null;
        this.selectedItem = null;
        this.selectedSlot = null;
        this.filter = 'all';
        this.searchTerm = '';
        this.draggedItem = null;
        this.draggedIndex = null;
        // Stato pannello aggiunta oggetti
        this.showAddPanel = false;
        this.addSearchTerm = '';
        this.addCategory = 'all';
    }
    
    /**
     * Apre il popup per un personaggio
     */
    open(options = {}) {
        const { owner, ownerType, onSave } = options;
        
        console.log('🎒 [EquipmentPopup] Apertura popup:', { owner, ownerType });
        
        if (!owner) {
            showToast('Nessun personaggio selezionato', 'error');
            return;
        }
        
        this.character = owner;
        this.characterType = ownerType || 'pc';
        this.onSave = onSave;
        
        // Carica inventario - priorità a inventory (usato dalla scheda PG), fallback a equipment
        const sourceInventory = (owner.inventory && owner.inventory.length > 0) 
            ? owner.inventory 
            : (owner.equipment && owner.equipment.length > 0)
                ? owner.equipment
                : [];
        
        this.inventory = [...sourceInventory];
        this.equippedSlots = { ...(owner.equippedSlots || {}) };
        
        // Costruisci mappa slot equipaggiati dallo stato degli oggetti
        this._buildEquippedSlotsFromInventory();
        
        console.log('🎒 [EquipmentPopup] Inventario caricato:', this.inventory.length, 'oggetti');
        console.log('🎒 [EquipmentPopup] Slot equipaggiati:', this.equippedSlots);
        
        this._createContainer();
        this._bindEvents();
        
        document.body.appendChild(this.container);
    }
    
    /**
     * Costruisce la mappa degli slot equipaggiati dall'inventario
     */
    _buildEquippedSlotsFromInventory() {
        // Reset mappa slot
        this.equippedSlots = {};
        
        // Trova oggetti equipaggiati e mappali agli slot
        this.inventory.forEach((item, index) => {
            if (item.equipped && item.equippedSlot) {
                this.equippedSlots[item.equippedSlot] = { ...item, inventoryIndex: index };
            }
        });
        
        // Se non ci sono slot espliciti, prova a dedurre dalla categoria
        if (Object.keys(this.equippedSlots).length === 0) {
            this.inventory.forEach((item, index) => {
                if (item.equipped) {
                    const slotId = this._findBestSlotForItem(item);
                    if (slotId && !this.equippedSlots[slotId]) {
                        this.equippedSlots[slotId] = { ...item, inventoryIndex: index };
                    }
                }
            });
        }
    }
    
    /**
     * Trova lo slot migliore per un oggetto
     */
    _findBestSlotForItem(item) {
        const category = item.equipment_category?.index || item.equipment_category?.name?.toLowerCase();
        const name = item.name?.toLowerCase() || '';
        
        // Armi
        if (category === 'weapon') {
            // Se è a due mani
            if (item.two_handed || name.includes('due mani') || name.includes('two-handed')) {
                return 'mainHand';
            }
            // Se c'è già un'arma in mainHand, usa offHand
            if (this.equippedSlots.mainHand && !this.equippedSlots.offHand) {
                return 'offHand';
            }
            return 'mainHand';
        }
        
        // Scudi
        if (category === 'armor' && (name.includes('scudo') || name.includes('shield'))) {
            return 'offHand';
        }
        
        // Armature
        if (category === 'armor') {
            if (name.includes('elmo') || name.includes('helm')) return 'head';
            if (name.includes('guanto') || name.includes('gauntlet')) return 'hands';
            if (name.includes('stivali') || name.includes('boots')) return 'feet';
            return 'body';
        }
        
        // Oggetti magici
        if (item.rarity || item.isMagical) {
            if (name.includes('anello') || name.includes('ring')) {
                return this.equippedSlots.ringLeft ? 'ringRight' : 'ringLeft';
            }
            if (name.includes('amuleto') || name.includes('amulet') || name.includes('collana')) return 'neck';
            if (name.includes('cintura') || name.includes('belt')) return 'belt';
            if (name.includes('mantello') || name.includes('cloak') || name.includes('cappa')) return 'cloak';
            if (name.includes('guanto') || name.includes('gauntlet')) return 'hands';
            if (name.includes('stivali') || name.includes('boots')) return 'feet';
            if (name.includes('elmo') || name.includes('helm') || name.includes('corona')) return 'head';
        }
        
        return null;
    }
    
    /**
     * Chiude il popup
     */
    close() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }
    
    /**
     * Crea il container del popup
     */
    _createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'equipment-popup-overlay';
        this.container.innerHTML = `
            <div class="equipment-popup">
                <div class="popup-header">
                    <h3>🎒 Equipaggiamento - ${this.character.name || 'Personaggio'}</h3>
                    <div class="popup-actions">
                        <button class="popup-btn save-btn" data-action="save">💾 Salva</button>
                        <button class="popup-btn close-btn" data-action="close">✕</button>
                    </div>
                </div>
                <div class="popup-content">
                    ${this._renderMainLayout()}
                </div>
            </div>
        `;
    }
    
    /**
     * Renderizza il layout principale
     */
    _renderMainLayout() {
        return `
            <div class="popup-main-layout">
                <!-- Colonna sinistra: Figura umana + Stats -->
                <div class="popup-column left-column">
                    <div class="body-slots-container">
                        ${renderBodySVG(this.equippedSlots, { showLabels: false, interactive: true })}
                    </div>
                    ${this._renderStatsSummary()}
                </div>
                
                <!-- Colonna centrale: Inventario o Aggiungi -->
                <div class="popup-column center-column">
                    ${this.showAddPanel ? this._renderAddItemPanel() : this._renderInventoryColumn()}
                </div>
                
                <!-- Colonna destra: Dettagli oggetto -->
                <div class="popup-column right-column">
                    <div class="item-detail-container">
                        ${renderItemDetail(this.selectedItem)}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderizza la colonna inventario con toggle aggiunta
     */
    _renderInventoryColumn() {
        return `
            <div class="inventory-column-header">
                <button class="popup-btn add-toggle-btn ${this.showAddPanel ? 'active' : ''}" data-action="toggle-add-panel">
                    ${this.showAddPanel ? '📦 Inventario' : '➕ Aggiungi Oggetto'}
                </button>
            </div>
            ${renderInventoryPanel(this.inventory, {
                showSearch: true,
                showFilters: true,
                showAddButton: false,
                editable: true,
                selectedItem: this.selectedItem,
                filter: this.filter
            })}
        `;
    }

    /**
     * Renderizza il pannello per aggiungere oggetti dal database
     */
    _renderAddItemPanel() {
        const categories = getEquipmentCategories();
        const results = this.addSearchTerm 
            ? searchItems(this.addSearchTerm, { category: this.addCategory !== 'all' ? this.addCategory : null, limit: 40 }) 
            : (this.addCategory !== 'all' 
                ? searchItems('', { category: this.addCategory, limit: 40 }) 
                : []);

        // Nomi già in inventario (per evitare duplicati visivi)
        const ownedNames = new Set(
            this.inventory.map(i => (i.name || i.index || '').toLowerCase())
        );

        return `
            <div class="add-item-panel">
                <div class="add-panel-header">
                    <button class="popup-btn add-toggle-btn" data-action="toggle-add-panel">
                        📦 Torna all'Inventario
                    </button>
                </div>

                <!-- Ricerca -->
                <div class="add-search-box">
                    <input type="text" 
                           class="popup-search-input" 
                           placeholder="🔍 Cerca nel database..." 
                           value="${this.addSearchTerm.replace(/"/g, '&quot;')}"
                           data-action="add-search">
                </div>

                <!-- Filtri categoria -->
                <div class="add-category-filters">
                    <button class="filter-tab ${this.addCategory === 'all' ? 'active' : ''}" data-action="add-filter" data-category="all">Tutti</button>
                    ${categories.map(cat => `
                        <button class="filter-tab ${this.addCategory === cat.index ? 'active' : ''}" 
                                data-action="add-filter" data-category="${cat.index}">
                            ${cat.name}
                        </button>
                    `).join('')}
                </div>

                <!-- Risultati -->
                <div class="add-item-results">
                    ${results.length === 0 && !this.addSearchTerm && this.addCategory === 'all'
                        ? '<p class="add-hint">Digita un nome o seleziona una categoria per cercare oggetti.</p>'
                        : results.length === 0
                            ? '<p class="add-hint">Nessun oggetto trovato.</p>'
                            : results.map(item => {
                                const owned = ownedNames.has((item.name || '').toLowerCase());
                                return `
                                    <div class="add-item-row ${owned ? 'already-owned' : ''}" data-item-index="${item.index}">
                                        <div class="add-item-info">
                                            <span class="add-item-icon">${getItemIconForAdd(item)}</span>
                                            <div class="add-item-text">
                                                <span class="add-item-name">${escapeHtmlPopup(item.name)}</span>
                                                <span class="add-item-meta">
                                                    ${item.equipment_category?.name || ''}
                                                    ${item.cost ? ' • ' + formatCost(item.cost) : ''}
                                                    ${item.weight ? ' • ' + formatWeight(item.weight) : ''}
                                                </span>
                                            </div>
                                        </div>
                                        <button class="popup-btn add-btn-sm" 
                                                data-action="add-to-inventory" 
                                                data-item-index="${item.index}"
                                                ${owned ? 'disabled title="Già in inventario"' : 'title="Aggiungi"'}>
                                            ${owned ? '✓' : '+'}
                                        </button>
                                    </div>
                                `;
                            }).join('')
                    }
                </div>

                <!-- Oggetto personalizzato -->
                <div class="add-custom-section">
                    <h5>✏️ Oggetto Personalizzato</h5>
                    <div class="add-custom-form">
                        <input type="text" class="popup-form-input" id="popup-custom-name" placeholder="Nome">
                        <input type="number" class="popup-form-input" id="popup-custom-qty" placeholder="Q.tà" value="1" min="1" style="width:60px">
                        <input type="number" class="popup-form-input" id="popup-custom-weight" placeholder="Peso" value="0" min="0" step="0.1" style="width:70px">
                        <button class="popup-btn save-btn" data-action="create-custom" style="white-space:nowrap">+ Aggiungi</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderizza il riepilogo statistiche
     */
    _renderStatsSummary() {
        const equippedCount = Object.keys(this.equippedSlots).length;
        const totalWeight = this.inventory.reduce((sum, item) => {
            return sum + ((item.weight || 0) * (item.quantity || 1));
        }, 0);
        
        // Calcola CA equipaggiata
        let baseAC = 10 + Math.floor((this.character.abilities?.dexterity || 10) / 2) - 5;
        let armorBonus = 0;
        let shieldBonus = 0;
        
        if (this.equippedSlots.body) {
            const bodyItem = this.equippedSlots.body;
            if (bodyItem.armor_class) {
                baseAC = bodyItem.armor_class.base || baseAC;
            }
        }
        if (this.equippedSlots.offHand) {
            const offItem = this.equippedSlots.offHand;
            if (offItem.name?.toLowerCase().includes('scudo') || offItem.name?.toLowerCase().includes('shield')) {
                shieldBonus = 2;
            }
        }
        
        const totalAC = baseAC + armorBonus + shieldBonus;
        
        return `
            <div class="stats-summary">
                <h4>📊 Riepilogo</h4>
                <div class="stat-row">
                    <span class="stat-label">Equipaggiati:</span>
                    <span class="stat-value">${equippedCount}/11 slot</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">CA Totale:</span>
                    <span class="stat-value">${totalAC}</span>
                    <span class="stat-breakdown">(base ${baseAC}${shieldBonus ? ` + ${shieldBonus} scudo` : ''})</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Peso:</span>
                    <span class="stat-value">${totalWeight.toFixed(1)} kg</span>
                </div>
            </div>
        `;
    }
    
    /**
     * Collega gli event handler
     */
    _bindEvents() {
        // Click su overlay per chiudere
        this.container.addEventListener('click', (e) => {
            // Chiudi se click su overlay
            if (e.target === this.container) {
                this.close();
                return;
            }
            
            // Gestisci azioni
            const actionTarget = e.target.closest('[data-action]');
            if (actionTarget) {
                const action = actionTarget.dataset.action;
                this._handleAction(action, actionTarget, e);
                return;
            }
            
            // Click su slot della figura
            const slotTarget = e.target.closest('[data-slot]');
            if (slotTarget && !actionTarget) {
                const slotId = slotTarget.dataset.slot;
                this._handleSlotClick(slotId);
                return;
            }
            
            // Click su oggetto inventario
            const itemTarget = e.target.closest('.inventory-item');
            if (itemTarget && !actionTarget) {
                const index = parseInt(itemTarget.dataset.itemIndex);
                this._handleItemClick(index);
                return;
            }
        });
        
        // Filtro inventario
        this.container.addEventListener('click', (e) => {
            const filterBtn = e.target.closest('.filter-tab');
            if (filterBtn) {
                this.filter = filterBtn.dataset.filter;
                this._refresh();
            }
        });
        
        // Ricerca inventario
        this.container.addEventListener('input', (e) => {
            if (e.target.matches('[data-action="search-inventory"]')) {
                this.searchTerm = e.target.value.toLowerCase();
                this._filterInventoryItems();
            }
            // Ricerca nel pannello aggiunta
            if (e.target.matches('[data-action="add-search"]')) {
                this.addSearchTerm = e.target.value;
                this._refreshAddResults();
            }
        });
        
        // Drag & Drop
        this._bindDragDrop();
        
        // Keyboard
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }
    
    /**
     * Gestisce le azioni
     */
    _handleAction(action, target, event) {
        switch (action) {
            case 'close':
                this.close();
                break;
            case 'save':
                this._save();
                break;
            case 'equip':
                const equipIndex = parseInt(target.dataset.itemIndex);
                this._equipItemByIndex(equipIndex);
                break;
            case 'unequip':
                const unequipIndex = parseInt(target.dataset.itemIndex);
                this._unequipItemByIndex(unequipIndex);
                break;
            case 'info':
                const infoIndex = parseInt(target.dataset.itemIndex);
                this._selectItem(infoIndex);
                break;
            case 'unequip-slot':
                const unequipSlotId = target.dataset.slot;
                this._unequipSlot(unequipSlotId);
                break;
            case 'toggle-add-panel':
                this.showAddPanel = !this.showAddPanel;
                this._refresh();
                break;
            case 'add-to-inventory':
                this._addFromDatabase(target.dataset.itemIndex);
                break;
            case 'create-custom':
                this._addCustomItem();
                break;
            case 'add-filter':
                this.addCategory = target.dataset.category || 'all';
                this._refresh();
                break;
        }
    }

    /**
     * Aggiunge un oggetto dal database all'inventario
     */
    _addFromDatabase(itemIndex) {
        const item = getItemByIndex(itemIndex);
        if (!item) {
            showToast('Oggetto non trovato nel database.', 'error');
            return;
        }

        // Verifica se già presente (merge quantità)
        const existingIdx = this.inventory.findIndex(
            i => (i.index || i.name || '').toLowerCase() === (item.index || item.name || '').toLowerCase()
        );

        if (existingIdx >= 0) {
            this.inventory[existingIdx].quantity = (this.inventory[existingIdx].quantity || 1) + 1;
            showToast(`${item.name} — quantità aumentata a ${this.inventory[existingIdx].quantity}`, 'success');
        } else {
            this.inventory.push({
                ...item,
                quantity: 1,
                equipped: false,
                equippedSlot: null
            });
            showToast(`${item.name} aggiunto all'inventario!`, 'success');
        }

        this._refresh();
    }

    /**
     * Aggiunge un oggetto personalizzato
     */
    _addCustomItem() {
        const nameInput = this.container.querySelector('#popup-custom-name');
        const qtyInput = this.container.querySelector('#popup-custom-qty');
        const weightInput = this.container.querySelector('#popup-custom-weight');

        const name = nameInput?.value?.trim();
        if (!name) {
            showToast('Inserisci un nome per l\'oggetto.', 'warning');
            nameInput?.focus();
            return;
        }

        const qty = Math.max(1, parseInt(qtyInput?.value) || 1);
        const weight = Math.max(0, parseFloat(weightInput?.value) || 0);

        this.inventory.push({
            name: name,
            custom: true,
            quantity: qty,
            weight: weight,
            cost: null,
            equipped: false,
            equippedSlot: null
        });

        showToast(`${name} aggiunto all'inventario!`, 'success');

        // Reset form
        if (nameInput) nameInput.value = '';
        if (qtyInput) qtyInput.value = '1';
        if (weightInput) weightInput.value = '0';

        this._refresh();
    }
    
    /**
     * Gestisce click su slot
     */
    _handleSlotClick(slotId) {
        console.log('🎒 [EquipmentPopup] Click su slot:', slotId);
        
        // Se c'è un oggetto nello slot, selezionalo
        if (this.equippedSlots[slotId]) {
            const item = this.equippedSlots[slotId];
            if (item.inventoryIndex !== undefined) {
                this._selectItem(item.inventoryIndex);
            }
            this.selectedSlot = slotId;
            this._refresh();
        } else {
            // Slot vuoto - mostra oggetti compatibili
            this.selectedSlot = slotId;
            this._highlightCompatibleItems(slotId);
            this._refresh();
        }
    }
    
    /**
     * Gestisce click su oggetto inventario
     */
    _handleItemClick(index) {
        this._selectItem(index);
    }
    
    /**
     * Seleziona un oggetto
     */
    _selectItem(index) {
        if (index >= 0 && index < this.inventory.length) {
            this.selectedItem = this.inventory[index];
            this._refreshDetailPanel();
        }
    }
    
    /**
     * Evidenzia oggetti compatibili con uno slot
     */
    _highlightCompatibleItems(slotId) {
        const items = this.container.querySelectorAll('.inventory-item');
        items.forEach(item => {
            const compatibleSlots = (item.dataset.compatibleSlots || '').split(',');
            if (compatibleSlots.includes(slotId)) {
                item.classList.add('compatible');
            } else {
                item.classList.remove('compatible');
            }
        });
    }
    
    /**
     * Collega eventi drag & drop
     */
    _bindDragDrop() {
        // Drag start su oggetto inventario
        this.container.addEventListener('dragstart', (e) => {
            const item = e.target.closest('.inventory-item');
            if (item) {
                this.draggedIndex = parseInt(item.dataset.itemIndex);
                this.draggedItem = this.inventory[this.draggedIndex];
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', this.draggedIndex);
                
                // Evidenzia slot compatibili
                this._highlightCompatibleSlots(this.draggedItem);
            }
        });
        
        // Drag end
        this.container.addEventListener('dragend', (e) => {
            const item = e.target.closest('.inventory-item');
            if (item) {
                item.classList.remove('dragging');
            }
            this.draggedItem = null;
            this.draggedIndex = null;
            this._clearSlotHighlights();
        });
        
        // Drag over slot
        this.container.addEventListener('dragover', (e) => {
            const slot = e.target.closest('[data-slot]');
            if (slot) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                slot.classList.add('drag-over');
            }
        });
        
        // Drag leave slot
        this.container.addEventListener('dragleave', (e) => {
            const slot = e.target.closest('[data-slot]');
            if (slot) {
                slot.classList.remove('drag-over');
            }
        });
        
        // Drop su slot
        this.container.addEventListener('drop', (e) => {
            const slot = e.target.closest('[data-slot]');
            if (slot && this.draggedItem) {
                e.preventDefault();
                const slotId = slot.dataset.slot;
                this._equipItemToSlot(this.draggedIndex, slotId);
                slot.classList.remove('drag-over');
            }
        });
    }
    
    /**
     * Evidenzia slot compatibili con un oggetto
     */
    _highlightCompatibleSlots(item) {
        // Se l'oggetto non è equipaggiabile, non evidenziare nulla
        if (!isItemEquippable(item)) {
            return;
        }
        
        const slots = this.container.querySelectorAll('[data-slot]');
        slots.forEach(slot => {
            const slotId = slot.dataset.slot;
            if (isItemCompatibleWithSlot(slotId, item)) {
                slot.classList.add('highlighted');
            }
        });
    }
    
    /**
     * Rimuove evidenziazione slot
     */
    _clearSlotHighlights() {
        const slots = this.container.querySelectorAll('[data-slot]');
        slots.forEach(slot => {
            slot.classList.remove('highlighted', 'drag-over');
        });
    }
    
    /**
     * Equipaggia un oggetto per indice
     */
    _equipItemByIndex(index) {
        const item = this.inventory[index];
        if (!item) return;
        
        // Verifica che l'oggetto sia equipaggiabile
        if (!isItemEquippable(item)) {
            showToast('Questo oggetto non può essere equipaggiato', 'warning');
            return;
        }
        
        // Trova lo slot migliore
        const slotId = this._findBestSlotForItem(item);
        if (!slotId) {
            showToast('Impossibile determinare lo slot per questo oggetto', 'warning');
            return;
        }
        
        this._equipItemToSlot(index, slotId);
    }
    
    /**
     * Equipaggia un oggetto in uno slot specifico
     */
    _equipItemToSlot(index, slotId) {
        const item = this.inventory[index];
        if (!item) return;
        
        // Verifica che l'oggetto sia equipaggiabile
        if (!isItemEquippable(item)) {
            showToast('Questo oggetto non può essere equipaggiato', 'error');
            return;
        }
        
        // Verifica compatibilità
        if (!isItemCompatibleWithSlot(slotId, item)) {
            showToast('Questo oggetto non è compatibile con lo slot selezionato', 'error');
            return;
        }
        
        // Se lo slot è occupato, disequipaggia l'oggetto precedente
        if (this.equippedSlots[slotId]) {
            const prevItem = this.equippedSlots[slotId];
            if (prevItem.inventoryIndex !== undefined) {
                this.inventory[prevItem.inventoryIndex].equipped = false;
                this.inventory[prevItem.inventoryIndex].equippedSlot = null;
            }
        }
        
        // Equipaggia il nuovo oggetto
        item.equipped = true;
        item.equippedSlot = slotId;
        this.equippedSlots[slotId] = { ...item, inventoryIndex: index };
        
        showToast(`${item.name || 'Oggetto'} equipaggiato in ${SLOT_TYPES[slotId]?.name || slotId}`, 'success');
        this._refresh();
    }
    
    /**
     * Disequipaggia un oggetto per indice
     */
    _unequipItemByIndex(index) {
        const item = this.inventory[index];
        if (!item || !item.equipped) return;
        
        const slotId = item.equippedSlot;
        item.equipped = false;
        item.equippedSlot = null;
        
        if (slotId && this.equippedSlots[slotId]) {
            delete this.equippedSlots[slotId];
        }
        
        showToast(`${item.name || 'Oggetto'} rimosso`, 'success');
        this._refresh();
    }
    
    /**
     * Disequipaggia uno slot
     */
    _unequipSlot(slotId) {
        const equipped = this.equippedSlots[slotId];
        if (!equipped) return;
        
        if (equipped.inventoryIndex !== undefined) {
            this.inventory[equipped.inventoryIndex].equipped = false;
            this.inventory[equipped.inventoryIndex].equippedSlot = null;
        }
        
        delete this.equippedSlots[slotId];
        showToast(`${equipped.name || 'Oggetto'} rimosso da ${SLOT_TYPES[slotId]?.name || slotId}`, 'success');
        this._refresh();
    }
    
    /**
     * Filtra gli elementi dell'inventario
     */
    _filterInventoryItems() {
        const items = this.container.querySelectorAll('.inventory-item');
        items.forEach(item => {
            const name = item.querySelector('.item-name')?.textContent?.toLowerCase() || '';
            const matches = name.includes(this.searchTerm);
            item.style.display = matches ? '' : 'none';
        });
    }
    
    /**
     * Aggiorna solo i risultati del pannello aggiunta (senza rifare tutto)
     */
    _refreshAddResults() {
        const resultsContainer = this.container.querySelector('.add-item-results');
        if (!resultsContainer) return;

        const results = this.addSearchTerm 
            ? searchItems(this.addSearchTerm, { category: this.addCategory !== 'all' ? this.addCategory : null, limit: 40 }) 
            : (this.addCategory !== 'all' 
                ? searchItems('', { category: this.addCategory, limit: 40 }) 
                : []);

        const ownedNames = new Set(
            this.inventory.map(i => (i.name || i.index || '').toLowerCase())
        );

        resultsContainer.innerHTML = results.length === 0 && !this.addSearchTerm && this.addCategory === 'all'
            ? '<p class="add-hint">Digita un nome o seleziona una categoria per cercare oggetti.</p>'
            : results.length === 0
                ? '<p class="add-hint">Nessun oggetto trovato.</p>'
                : results.map(item => {
                    const owned = ownedNames.has((item.name || '').toLowerCase());
                    return `
                        <div class="add-item-row ${owned ? 'already-owned' : ''}" data-item-index="${item.index}">
                            <div class="add-item-info">
                                <span class="add-item-icon">${getItemIconForAdd(item)}</span>
                                <div class="add-item-text">
                                    <span class="add-item-name">${escapeHtmlPopup(item.name)}</span>
                                    <span class="add-item-meta">
                                        ${item.equipment_category?.name || ''}
                                        ${item.cost ? ' • ' + formatCost(item.cost) : ''}
                                        ${item.weight ? ' • ' + formatWeight(item.weight) : ''}
                                    </span>
                                </div>
                            </div>
                            <button class="popup-btn add-btn-sm" 
                                    data-action="add-to-inventory" 
                                    data-item-index="${item.index}"
                                    ${owned ? 'disabled title="Già in inventario"' : 'title="Aggiungi"'}>
                                ${owned ? '✓' : '+'}
                            </button>
                        </div>
                    `;
                }).join('');
    }

    /**
     * Aggiorna solo il pannello dettagli
     */
    _refreshDetailPanel() {
        const detailContainer = this.container.querySelector('.item-detail-container');
        if (detailContainer) {
            detailContainer.innerHTML = renderItemDetail(this.selectedItem);
        }
    }
    
    /**
     * Refresh completo del popup
     */
    _refresh() {
        const content = this.container.querySelector('.popup-content');
        if (content) {
            content.innerHTML = this._renderMainLayout();
        }
    }
    
    /**
     * Salva le modifiche
     */
    _save() {
        console.log('🎒 [EquipmentPopup] Salvataggio...', {
            inventory: this.inventory,
            equippedSlots: this.equippedSlots
        });
        
        // Aggiorna il personaggio
        this.character.inventory = this.inventory;
        this.character.equippedSlots = this.equippedSlots;
        this.character.equipment = this.inventory.filter(item => item.equipped);
        
        // Callback
        if (this.onSave) {
            console.log('🎒 [EquipmentPopup] Chiamata onSave callback');
            this.onSave({
                inventory: this.inventory,
                equippedSlots: this.equippedSlots
            });
        } else {
            console.warn('🎒 [EquipmentPopup] Nessun callback onSave definito');
        }
        
        showToast('Equipaggiamento salvato!', 'success');
        this.close();
    }
}

// =========================================================================
// HELPER FUNCTIONS
// =========================================================================

/**
 * Escape HTML per prevenire XSS nel popup
 */
function escapeHtmlPopup(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Icona per un oggetto nel pannello aggiunta
 */
function getItemIconForAdd(item) {
    if (!item) return '❓';
    const cat = item.equipment_category?.index || '';
    const name = (item.name || '').toLowerCase();
    
    if (cat === 'weapon') {
        if (name.includes('spada') || name.includes('sword')) return '🗡️';
        if (name.includes('ascia') || name.includes('axe')) return '🪓';
        if (name.includes('arco') || name.includes('bow')) return '🏹';
        return '⚔️';
    }
    if (cat === 'armor') {
        if (name.includes('scudo')) return '🛡️';
        return '🦺';
    }
    if (cat === 'tools') return '🔧';
    if (cat === 'mounts-and-vehicles') return '🐴';
    if (item.rarity || item.isMagical) return '✨';
    return '📦';
}

// Singleton
let popupInstance = null;

/**
 * Apre il popup dell'equipaggiamento
 */
export function openEquipmentPopup(options) {
    if (!popupInstance) {
        popupInstance = new EquipmentPopup();
    }
    popupInstance.open(options);
}

/**
 * Chiude il popup dell'equipaggiamento
 */
export function closeEquipmentPopup() {
    if (popupInstance) {
        popupInstance.close();
    }
}

export default {
    EquipmentPopup,
    openEquipmentPopup,
    closeEquipmentPopup
};
