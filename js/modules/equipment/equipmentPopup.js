/**
 * equipmentPopup.js
 * ─────────────────────────────────────────────────────────────
 * Popup principale per la gestione dell'equipaggiamento.
 * 
 * @version 1.0.0
 */

import { renderBodySVG, renderCompactSlotGrid } from './components/bodySlotRenderer.js';
import { renderInventoryPanel, renderItemDetail, renderAddItemPopup } from './components/inventoryPanel.js';
import { EquipmentService } from './services/equipmentService.js';
import { searchItems, getItemByIndex } from './services/itemLoader.js';
import { SLOT_TYPES } from './config/slotTypes.js';
import { showToast } from '../../../utils/toast.js';

/**
 * Popup per la gestione dell'equipaggiamento
 */
export class EquipmentPopup {
    constructor() {
        this.container = null;
        this.service = null;
        this.character = null;
        this.characterType = null;
        this.selectedSlot = null;
        this.selectedItem = null;
        this.onSave = null;
        this.searchTerm = '';
    }
    
    /**
     * Apre il popup per un personaggio
     * @param {Object} options - Opzioni { owner, ownerType, onSave }
     */
    open(options = {}) {
        const { owner, ownerType, onSave } = options;
        
        if (!owner) {
            showToast('Nessun personaggio selezionato', 'error');
            return;
        }
        
        this.character = owner;
        this.characterType = ownerType || 'pc';
        this.onSave = onSave;
        this.service = new EquipmentService(owner, this.characterType);
        
        // Crea il container del popup
        this._createContainer();
        this._bindEvents();
        this._render();
        
        // Mostra il popup
        document.body.appendChild(this.container);
        
        // Focus sulla search
        setTimeout(() => {
            this.container.querySelector('.inventory-search-input')?.focus();
        }, 100);
    }
    
    /**
     * Chiude il popup
     */
    close() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        this.service = null;
        this.character = null;
        this.selectedSlot = null;
        this.selectedItem = null;
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
                    <!-- Renderizzato dinamicamente -->
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
            if (e.target === this.container) {
                this.close();
            }
        });
        
        // Event delegation per azioni
        this.container.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;
            
            const action = target.dataset.action;
            this._handleAction(action, target);
        });
        
        // Ricerca
        this.container.addEventListener('input', (e) => {
            if (e.target.matches('.inventory-search-input')) {
                this.searchTerm = e.target.value;
                this._renderInventory();
            }
            if (e.target.matches('.item-search-input')) {
                this._searchAndRenderResults(e.target.value);
            }
        });
        
        // Drag & drop
        this._setupDragDrop();
        
        // Click su slot
        this.container.addEventListener('click', (e) => {
            const slot = e.target.closest('[data-slot]');
            if (slot && !slot.closest('.item-actions')) {
                this._selectSlot(slot.dataset.slot);
            }
        });
        
        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }
    
    /**
     * Gestisce le azioni
     */
    _handleAction(action, target) {
        switch (action) {
            case 'close':
                this.close();
                break;
            case 'save':
                this._save();
                break;
            case 'equip':
                this._equipItem(parseInt(target.dataset.itemIndex));
                break;
            case 'unequip':
                this._unequipItem(parseInt(target.dataset.itemIndex));
                break;
            case 'info':
                this._showItemInfo(parseInt(target.dataset.itemIndex));
                break;
            case 'add-item':
                this._showAddItemPopup();
                break;
            case 'add-to-inventory':
                this._addToInventory(target);
                break;
            case 'create-custom':
                this._createCustomItem();
                break;
            case 'toggle-attunement':
                this._toggleAttunement(parseInt(target.dataset.itemIndex));
                break;
            case 'remove-item':
                this._removeItem(parseInt(target.dataset.itemIndex));
                break;
        }
    }
    
    /**
     * Renderizza il contenuto del popup
     */
    _render() {
        const content = this.container.querySelector('.popup-content');
        if (!content) return;
        
        const equipped = this.service.getAllEquipped();
        const inventory = this.service.inventory;
        const stats = this.service.calculateStats();
        
        content.innerHTML = `
            <div class="popup-main-layout">
                <!-- Colonna sinistra: Body slots -->
                <div class="popup-column left-column">
                    <div class="body-slots-container">
                        ${renderBodySVG(equipped, {
                            showLabels: true,
                            interactive: true,
                            selectedSlot: this.selectedSlot
                        })}
                    </div>
                    
                    <!-- Stats riepilogo -->
                    <div class="stats-summary">
                        <h4>📊 Riepilogo</h4>
                        <div class="stat-row">
                            <span class="stat-label">CA:</span>
                            <span class="stat-value">${stats.armorClass.total}</span>
                            <span class="stat-breakdown">
                                (${stats.armorClass.base} + ${stats.armorClass.armor} arm + ${stats.armorClass.shield} scudo + ${stats.armorClass.dexBonus} DES)
                            </span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Iniziativa:</span>
                            <span class="stat-value">${stats.initiative.total >= 0 ? '+' : ''}${stats.initiative.total}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Peso:</span>
                            <span class="stat-value">${this.service.getTotalWeight().toFixed(1)} lb</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Attunement:</span>
                            <span class="stat-value">${this.service.countAttunedItems()}/3</span>
                        </div>
                    </div>
                </div>
                
                <!-- Colonna centrale: Inventario -->
                <div class="popup-column center-column">
                    ${renderInventoryPanel(inventory, {
                        showSearch: true,
                        showFilters: true,
                        showAddButton: true,
                        editable: true,
                        selectedItem: this.selectedItem
                    })}
                </div>
                
                <!-- Colonna destra: Dettaglio -->
                <div class="popup-column right-column">
                    <div class="item-detail-container">
                        ${renderItemDetail(this.selectedItem)}
                    </div>
                    
                    <!-- Quick actions -->
                    <div class="quick-actions">
                        <button class="quick-action-btn" data-action="export-text" title="Esporta come testo">
                            📄 Esporta
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderizza solo l'inventario (per refresh parziale)
     */
    _renderInventory() {
        const listContainer = this.container.querySelector('.inventory-list');
        if (!listContainer) return;
        
        // Filtra in base alla ricerca
        let inventory = this.service.inventory;
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            inventory = inventory.filter(item => 
                item.name?.toLowerCase().includes(term) ||
                item.customName?.toLowerCase().includes(term)
            );
        }
        
        // TODO: implementare render parziale
    }
    
    /**
     * Setup drag and drop
     */
    _setupDragDrop() {
        this.container.addEventListener('dragstart', (e) => {
            const item = e.target.closest('.inventory-item');
            if (!item) return;
            
            e.dataTransfer.setData('text/plain', item.dataset.itemIndex);
            e.dataTransfer.effectAllowed = 'move';
            item.classList.add('dragging');
        });
        
        this.container.addEventListener('dragend', (e) => {
            const item = e.target.closest('.inventory-item');
            if (item) item.classList.remove('dragging');
        });
        
        this.container.addEventListener('dragover', (e) => {
            const slot = e.target.closest('[data-slot]');
            if (slot) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                slot.classList.add('drag-over');
            }
        });
        
        this.container.addEventListener('dragleave', (e) => {
            const slot = e.target.closest('[data-slot]');
            if (slot) slot.classList.remove('drag-over');
        });
        
        this.container.addEventListener('drop', (e) => {
            const slot = e.target.closest('[data-slot]');
            if (!slot) return;
            
            e.preventDefault();
            slot.classList.remove('drag-over');
            
            const itemIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const slotId = slot.dataset.slot;
            
            this._equipItem(itemIndex, slotId);
        });
    }
    
    /**
     * Seleziona uno slot
     */
    _selectSlot(slotId) {
        this.selectedSlot = slotId;
        const item = this.service.getEquippedItem(slotId);
        this.selectedItem = item;
        this._render();
    }
    
    /**
     * Equipaggia un oggetto
     */
    _equipItem(itemIndex, targetSlot = null) {
        const result = this.service.equipItem(itemIndex, targetSlot);
        
        if (result.success) {
            showToast(result.message, 'success');
            if (result.warnings.length) {
                result.warnings.forEach(w => showToast(w, 'warning'));
            }
            this._render();
        } else {
            showToast(result.message, 'error');
        }
    }
    
    /**
     * Disequipaggia un oggetto
     */
    _unequipItem(itemIndex) {
        const item = this.service.inventory[itemIndex];
        if (!item || !item.slot) return;
        
        const result = this.service.unequipFromSlot(item.slot);
        
        if (result.success) {
            showToast(result.message, 'success');
            this._render();
        } else {
            showToast(result.message, 'error');
        }
    }
    
    /**
     * Mostra info oggetto
     */
    _showItemInfo(itemIndex) {
        const item = this.service.inventory[itemIndex];
        if (item) {
            this.selectedItem = item;
            const detailContainer = this.container.querySelector('.item-detail-container');
            if (detailContainer) {
                detailContainer.innerHTML = renderItemDetail(item);
            }
        }
    }
    
    /**
     * Mostra popup per aggiungere oggetti
     */
    _showAddItemPopup() {
        const popup = document.createElement('div');
        popup.className = 'add-item-popup-overlay';
        popup.innerHTML = `
            <div class="add-item-popup-container">
                ${renderAddItemPopup('')}
                <button class="popup-close-btn" data-action="close-popup">✕</button>
            </div>
        `;
        
        popup.addEventListener('click', (e) => {
            if (e.target === popup || e.target.dataset.action === 'close-popup') {
                popup.remove();
            }
        });
        
        // Search handler
        popup.addEventListener('input', (e) => {
            if (e.target.matches('.item-search-input')) {
                const results = searchItems(e.target.value, { limit: 20 });
                const resultsContainer = popup.querySelector('.add-item-results');
                if (resultsContainer) {
                    resultsContainer.innerHTML = results.length > 0
                        ? results.map(item => `
                            <div class="search-result-item" data-item-index="${item.index}" data-item-source="${item.source}">
                                <span class="result-icon">${this._getItemIcon(item)}</span>
                                <div class="result-info">
                                    <span class="result-name">${item.name}</span>
                                    <span class="result-meta">${item.equipment_category?.name || ''}</span>
                                </div>
                                <button class="add-result-btn" data-action="add-to-inventory">+</button>
                            </div>
                        `).join('')
                        : '<div class="no-results">Nessun risultato</div>';
                }
            }
        });
        
        // Add to inventory handler
        popup.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action="add-to-inventory"]');
            if (btn) {
                const resultItem = btn.closest('.search-result-item');
                const itemIndex = resultItem?.dataset.itemIndex;
                if (itemIndex) {
                    const result = this.service.addToInventory(itemIndex, 1);
                    if (result.success) {
                        showToast(result.message, 'success');
                        popup.remove();
                        this._render();
                    } else {
                        showToast(result.message, 'error');
                    }
                }
            }
        });
        
        document.body.appendChild(popup);
    }
    
    /**
     * Aggiungi all'inventario da risultato ricerca
     */
    _addToInventory(target) {
        const resultItem = target.closest('.search-result-item');
        if (!resultItem) return;
        
        const itemIndex = resultItem.dataset.itemIndex;
        const itemSource = resultItem.dataset.itemSource;
        
        const result = this.service.addToInventory(itemIndex, 1);
        
        if (result.success) {
            showToast(result.message, 'success');
            this._render();
        } else {
            showToast(result.message, 'error');
        }
    }
    
    /**
     * Crea oggetto personalizzato
     */
    _createCustomItem() {
        // TODO: Aprire editor oggetto personalizzato
        showToast('Editor oggetti personalizzati in arrivo!', 'info');
    }
    
    /**
     * Toggle attunement
     */
    _toggleAttunement(itemIndex) {
        const result = this.service.toggleAttunement(itemIndex);
        
        if (result.success) {
            showToast(result.message, 'success');
            this._render();
        } else {
            showToast(result.message, 'error');
        }
    }
    
    /**
     * Rimuovi oggetto
     */
    _removeItem(itemIndex) {
        if (confirm('Rimuovere questo oggetto dall\'inventario?')) {
            const result = this.service.removeFromInventory(itemIndex);
            
            if (result.success) {
                showToast(result.message, 'success');
                this.selectedItem = null;
                this._render();
            } else {
                showToast(result.message, 'error');
            }
        }
    }
    
    /**
     * Salva le modifiche
     */
    _save() {
        const state = this.service.getState();
        
        // Aggiorna il personaggio
        this.character.equipment = state.inventory;
        this.character.equippedSlots = state.equippedSlots;
        
        // Callback
        if (this.onSave) {
            this.onSave(state);
        }
        
        showToast('Equipaggiamento salvato!', 'success');
        this.close();
    }
    
    /**
     * Ottiene icona per oggetto
     */
    _getItemIcon(item) {
        const category = item.equipment_category?.index || '';
        const name = item.name?.toLowerCase() || '';
        
        if (category === 'weapon') return '⚔️';
        if (category === 'armor') return name.includes('scudo') ? '🛡️' : '🦺';
        if (item.rarity) return '✨';
        return '📦';
    }
}

// Istanza singleton
let popupInstance = null;

/**
 * Apre il popup dell'equipaggiamento
 * @param {Object} options - Opzioni
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
