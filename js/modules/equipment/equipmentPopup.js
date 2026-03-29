/**
 * equipmentPopup.js
 * ─────────────────────────────────────────────────────────────
 * Popup semplificato per la gestione dell'equipaggiamento.
 * 
 * @version 1.1.0
 */

import { showToast } from '../../../utils/toast.js';

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
        
        // Carica inventario (prova equipment, poi inventory)
        this.inventory = [...(owner.equipment || owner.inventory || [])];
        this.equippedSlots = { ...(owner.equippedSlots || {}) };
        
        console.log('🎒 [EquipmentPopup] Inventario caricato:', this.inventory);
        console.log('🎒 [EquipmentPopup] Oggetti:', this.inventory.length);
        
        this._createContainer();
        this._bindEvents();
        
        document.body.appendChild(this.container);
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
                    ${this._renderContent()}
                </div>
            </div>
        `;
    }
    
    /**
     * Renderizza il contenuto
     */
    _renderContent() {
        const items = this.inventory;
        const hasItems = items && items.length > 0;
        
        let itemsHtml = '';
        if (hasItems) {
            itemsHtml = items.map((item, idx) => {
                const name = item.customName || item.name || 'Oggetto senza nome';
                const qty = item.quantity > 1 ? ` (×${item.quantity})` : '';
                const equipped = item.equipped ? ' ✓ Equipaggiato' : '';
                
                return `
                    <div class="inventory-item" data-index="${idx}">
                        <span class="item-name">${name}${qty}</span>
                        <span class="item-status">${equipped}</span>
                        <div class="item-actions">
                            ${!item.equipped ? 
                                `<button class="item-btn equip-btn" data-action="equip" data-index="${idx}">Equipaggia</button>` : 
                                `<button class="item-btn unequip-btn" data-action="unequip" data-index="${idx}">Rimuovi</button>`
                            }
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            itemsHtml = '<div class="inventory-empty"><div class="empty-icon">📦</div><div class="empty-text">Inventario vuoto</div><div class="empty-hint">Aggiungi oggetti dal wizard del personaggio</div></div>';
        }
        
        return `
            <div class="equipment-content">
                <div class="inventory-section">
                    <h4>📦 Inventario (${items.length} oggetti)</h4>
                    <div class="inventory-list">
                        ${itemsHtml}
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Collega gli event handler
     */
    _bindEvents() {
        console.log('🎒 [EquipmentPopup] Binding events...');
        
        // Click su overlay per chiudere
        this.container.addEventListener('click', (e) => {
            console.log('🎒 [EquipmentPopup] Click detected on:', e.target);
            
            if (e.target === this.container) {
                console.log('🎒 [EquipmentPopup] Click on overlay, closing...');
                this.close();
                return;
            }
            
            const target = e.target.closest('[data-action]');
            if (!target) {
                console.log('🎒 [EquipmentPopup] No data-action target found');
                return;
            }
            
            const action = target.dataset.action;
            console.log('🎒 [EquipmentPopup] Action:', action);
            
            switch (action) {
                case 'close':
                    this.close();
                    break;
                case 'save':
                    this._save();
                    break;
                case 'equip':
                    this._equipItem(parseInt(target.dataset.index));
                    break;
                case 'unequip':
                    this._unequipItem(parseInt(target.dataset.index));
                    break;
            }
        });
        
        // Keyboard
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }
    
    /**
     * Equipaggia un oggetto
     */
    _equipItem(index) {
        const item = this.inventory[index];
        if (!item) return;
        
        item.equipped = true;
        showToast(`${item.name || 'Oggetto'} equipaggiato`, 'success');
        this._refresh();
    }
    
    /**
     * Disequipaggia un oggetto
     */
    _unequipItem(index) {
        const item = this.inventory[index];
        if (!item) return;
        
        item.equipped = false;
        showToast(`${item.name || 'Oggetto'} rimosso`, 'success');
        this._refresh();
    }
    
    /**
     * Refresh del contenuto
     */
    _refresh() {
        const content = this.container.querySelector('.popup-content');
        if (content) {
            content.innerHTML = this._renderContent();
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
        this.character.equipment = this.inventory;
        this.character.equippedSlots = this.equippedSlots;
        
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
