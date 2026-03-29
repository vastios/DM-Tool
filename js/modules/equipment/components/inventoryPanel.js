/**
 * inventoryPanel.js
 * ─────────────────────────────────────────────────────────────
 * Pannello inventario per visualizzare e gestire gli oggetti.
 * 
 * @version 1.1.0 - Aggiunto controllo oggetti equipaggiabili
 */

import { searchItems, getItemByIndex, formatWeight, formatCost, getEquipmentCategories } from '../services/itemLoader.js';
import { getCompatibleSlotsForItem, itemRequiresAttunement, isItemEquippable } from '../services/itemLoader.js';
import { SLOT_TYPES } from '../config/slotTypes.js';

/**
 * Renderizza il pannello inventario completo
 * @param {Array} inventory - Lista oggetti nell'inventario
 * @param {Object} options - Opzioni di render
 * @returns {string} HTML
 */
export function renderInventoryPanel(inventory = [], options = {}) {
    const {
        showSearch = true,
        showFilters = true,
        showAddButton = true,
        editable = true,
        selectedItem = null,
        filter = 'all'  // all, equippable, equipped, unequipped
    } = options;
    
    // Filtra l'inventario
    let filteredInventory = [...inventory];
    if (filter === 'equippable') {
        filteredInventory = inventory.filter(item => isItemEquippable(item));
    } else if (filter === 'equipped') {
        filteredInventory = inventory.filter(item => item.equipped === true);
    } else if (filter === 'unequipped') {
        filteredInventory = inventory.filter(item => !item.equipped);
    }
    
    // Calcola peso totale
    const totalWeight = inventory.reduce((sum, item) => {
        const weight = item.weight || 0;
        const qty = item.quantity || 1;
        return sum + (weight * qty);
    }, 0);
    
    return `
        <div class="inventory-panel">
            ${showSearch ? renderSearchBar() : ''}
            ${showFilters ? renderFilterTabs(filter) : ''}
            
            <div class="inventory-list">
                ${filteredInventory.length === 0 
                    ? renderEmptyInventory() 
                    : filteredInventory.map((item, index) => 
                        renderInventoryItem(item, index, selectedItem, editable)
                    ).join('')
                }
            </div>
            
            <div class="inventory-footer">
                <div class="inventory-weight">
                    <span class="weight-icon">⚖️</span>
                    <span class="weight-label">Peso:</span>
                    <span class="weight-value">${formatWeight(totalWeight)}</span>
                </div>
                ${showAddButton && editable ? renderAddItemButton() : ''}
            </div>
        </div>
    `;
}

/**
 * Renderizza la barra di ricerca
 * @returns {string} HTML
 */
function renderSearchBar() {
    return `
        <div class="inventory-search">
            <input type="text" 
                   class="inventory-search-input" 
                   placeholder="🔍 Cerca oggetto..."
                   data-action="search-inventory">
        </div>
    `;
}

/**
 * Renderizza i tab di filtro
 * @param {string} activeFilter - Filtro attivo
 * @returns {string} HTML
 */
function renderFilterTabs(activeFilter) {
    const tabs = [
        { id: 'all', label: 'Tutti', icon: '📦' },
        { id: 'equippable', label: 'Equipaggiabili', icon: '⚔️' },
        { id: 'equipped', label: 'Indossati', icon: '🛡️' },
        { id: 'unequipped', label: 'Zaino', icon: '🎒' }
    ];
    
    return `
        <div class="inventory-filters">
            ${tabs.map(tab => `
                <button class="filter-tab ${tab.id === activeFilter ? 'active' : ''}"
                        data-filter="${tab.id}">
                    ${tab.icon} ${tab.label}
                </button>
            `).join('')}
        </div>
    `;
}

/**
 * Renderizza un singolo oggetto dell'inventario
 * @param {Object} item - L'oggetto
 * @param {number} index - Indice nell'array
 * @param {Object} selectedItem - Oggetto selezionato
 * @param {boolean} editable - Se è modificabile
 * @returns {string} HTML
 */
function renderInventoryItem(item, index, selectedItem, editable) {
    const isSelected = selectedItem?.index === index || selectedItem?.id === item.id;
    const isEquipped = item.equipped === true;
    const isMagical = item.rarity || item.isMagical;
    const needsAttunement = itemRequiresAttunement(item);
    const isAttuned = item.isAttuned === true;
    
    // Verifica se l'oggetto è equipaggiabile
    const equippable = isItemEquippable(item);
    
    // Ottieni icona
    const icon = getItemIcon(item);
    
    // Rarità
    const rarityClass = item.rarity ? `rarity-${item.rarity?.name?.toLowerCase().replace(' ', '-')}` : '';
    
    // Slot compatibili (solo se equipaggiabile)
    const compatibleSlots = equippable ? getCompatibleSlotsForItem(item) : [];
    
    return `
        <div class="inventory-item ${isSelected ? 'selected' : ''} ${isEquipped ? 'equipped' : ''} ${rarityClass} ${!equippable ? 'not-equippable' : ''}"
             data-item-index="${index}"
             data-item-id="${item.id || item.index}"
             draggable="${editable && equippable}"
             data-compatible-slots="${compatibleSlots.join(',')}"
             data-equippable="${equippable}">
            
            <div class="item-main">
                <span class="item-icon">${icon}</span>
                <div class="item-info">
                    <span class="item-name">${item.customName || item.name}</span>
                    <span class="item-details">
                        ${item.quantity > 1 ? `×${item.quantity}` : ''}
                        ${item.weight ? `${formatWeight(item.weight)}` : ''}
                        ${item.rarity ? `<span class="item-rarity">${item.rarity.name}</span>` : ''}
                        ${!equippable ? '<span class="item-tag">non equipaggiabile</span>' : ''}
                    </span>
                </div>
            </div>
            
            <div class="item-badges">
                ${isEquipped ? `<span class="badge equipped-badge" title="Equipaggiato">⚔️</span>` : ''}
                ${needsAttunement ? `<span class="badge attunement-badge ${isAttuned ? 'attuned' : ''}" title="${isAttuned ? 'Sintonizzato' : 'Richiede sintonizzazione'}">${isAttuned ? '🔗' : '🔮'}</span>` : ''}
                ${isMagical ? `<span class="badge magic-badge" title="Oggetto magico">✨</span>` : ''}
            </div>
            
            <div class="item-actions">
                ${!isEquipped && editable && equippable ? `
                    <button class="item-action-btn equip-btn" 
                            data-action="equip" 
                            data-item-index="${index}"
                            title="Equipaggia">
                        ⚔️
                    </button>
                ` : ''}
                ${isEquipped && editable ? `
                    <button class="item-action-btn unequip-btn" 
                            data-action="unequip" 
                            data-item-index="${index}"
                            title="Disequipaggia">
                        📦
                    </button>
                ` : ''}
                ${editable ? `
                    <button class="item-action-btn info-btn" 
                            data-action="info" 
                            data-item-index="${index}"
                            title="Dettagli">
                        ℹ️
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Renderizza lo stato vuoto dell'inventario
 * @returns {string} HTML
 */
function renderEmptyInventory() {
    return `
        <div class="inventory-empty">
            <span class="empty-icon">🎒</span>
            <span class="empty-text">Inventario vuoto</span>
            <span class="empty-hint">Aggiungi oggetti usando il pulsante +</span>
        </div>
    `;
}

/**
 * Renderizza il pulsante per aggiungere oggetti
 * @returns {string} HTML
 */
function renderAddItemButton() {
    return `
        <button class="add-item-btn" data-action="add-item" title="Aggiungi oggetto">
            ➕ Aggiungi
        </button>
    `;
}

/**
 * Renderizza il popup per aggiungere un oggetto
 * @param {string} searchTerm - Termine di ricerca iniziale
 * @returns {string} HTML
 */
export function renderAddItemPopup(searchTerm = '') {
    const categories = getEquipmentCategories();
    
    // Cerca nel database se c'è un termine di ricerca
    let searchResults = [];
    if (searchTerm) {
        searchResults = searchItems(searchTerm, { limit: 20 });
    }
    
    return `
        <div class="add-item-popup">
            <div class="add-item-header">
                <h3>➕ Aggiungi Oggetto</h3>
            </div>
            
            <div class="add-item-search">
                <input type="text" 
                       class="item-search-input" 
                       placeholder="Cerca nel database..."
                       value="${searchTerm}"
                       data-action="search-items"
                       autofocus>
            </div>
            
            <div class="add-item-categories">
                ${categories.map(cat => `
                    <button class="category-btn" data-category="${cat.index}">
                        ${cat.name}
                    </button>
                `).join('')}
            </div>
            
            <div class="add-item-results">
                ${searchResults.length > 0 
                    ? searchResults.map(item => renderSearchResult(item)).join('')
                    : '<div class="no-results">Digita per cercare oggetti</div>'
                }
            </div>
            
            <div class="add-item-custom">
                <button class="custom-item-btn" data-action="create-custom">
                    ✏️ Crea oggetto personalizzato
                </button>
            </div>
        </div>
    `;
}

/**
 * Renderizza un risultato della ricerca
 * @param {Object} item - L'oggetto trovato
 * @returns {string} HTML
 */
function renderSearchResult(item) {
    const icon = getItemIcon(item);
    
    return `
        <div class="search-result-item" data-item-index="${item.index}" data-item-source="${item.source}">
            <span class="result-icon">${icon}</span>
            <div class="result-info">
                <span class="result-name">${item.name}</span>
                <span class="result-meta">
                    ${item.equipment_category?.name || ''}
                    ${item.cost ? `• ${formatCost(item.cost)}` : ''}
                    ${item.weight ? `• ${formatWeight(item.weight)}` : ''}
                </span>
            </div>
            <button class="add-result-btn" data-action="add-to-inventory">+</button>
        </div>
    `;
}

/**
 * Renderizza il pannello dettaglio oggetto
 * @param {Object} item - L'oggetto
 * @returns {string} HTML
 */
export function renderItemDetail(item) {
    if (!item) {
        return `
            <div class="item-detail-empty">
                <span class="detail-icon">📋</span>
                <span class="detail-text">Seleziona un oggetto per vedere i dettagli</span>
            </div>
        `;
    }
    
    const icon = getItemIcon(item);
    const needsAttunement = itemRequiresAttunement(item);
    
    return `
        <div class="item-detail">
            <div class="detail-header">
                <span class="detail-icon-large">${icon}</span>
                <div class="detail-title">
                    <h4>${item.customName || item.name}</h4>
                    ${item.rarity ? `<span class="detail-rarity ${item.rarity?.name?.toLowerCase()}">${item.rarity.name}</span>` : ''}
                </div>
            </div>
            
            <div class="detail-stats">
                ${item.equipment_category ? `
                    <div class="detail-row">
                        <span class="detail-label">Categoria:</span>
                        <span class="detail-value">${item.equipment_category.name}</span>
                    </div>
                ` : ''}
                
                ${item.weapon_category ? `
                    <div class="detail-row">
                        <span class="detail-label">Tipo Arma:</span>
                        <span class="detail-value">${item.weapon_category}</span>
                    </div>
                ` : ''}
                
                ${item.armor_category ? `
                    <div class="detail-row">
                        <span class="detail-label">Tipo Armatura:</span>
                        <span class="detail-value">${item.armor_category}</span>
                    </div>
                ` : ''}
                
                ${item.damage ? `
                    <div class="detail-row">
                        <span class="detail-label">Danno:</span>
                        <span class="detail-value">${item.damage.damage_dice} ${item.damage.damage_type?.name || ''}</span>
                    </div>
                ` : ''}
                
                ${item.armor_class ? `
                    <div class="detail-row">
                        <span class="detail-label">CA:</span>
                        <span class="detail-value">
                            ${item.armor_class.base}
                            ${item.armor_class.dex_bonus ? ' + DES' : ''}
                            ${item.armor_class.max_bonus ? ` (max +${item.armor_class.max_bonus})` : ''}
                        </span>
                    </div>
                ` : ''}
                
                ${item.cost ? `
                    <div class="detail-row">
                        <span class="detail-label">Costo:</span>
                        <span class="detail-value">${formatCost(item.cost)}</span>
                    </div>
                ` : ''}
                
                ${item.weight ? `
                    <div class="detail-row">
                        <span class="detail-label">Peso:</span>
                        <span class="detail-value">${formatWeight(item.weight)}</span>
                    </div>
                ` : ''}
                
                ${needsAttunement ? `
                    <div class="detail-row attunement">
                        <span class="detail-label">Sintonizzazione:</span>
                        <span class="detail-value">${item.isAttuned ? '✅ Attiva' : '🔮 Richiesta'}</span>
                    </div>
                ` : ''}
            </div>
            
            ${item.desc ? `
                <div class="detail-description">
                    <h5>Descrizione</h5>
                    <div class="description-text">
                        ${Array.isArray(item.desc) ? item.desc.join('<br><br>') : item.desc}
                    </div>
                </div>
            ` : ''}
            
            ${item.properties?.length ? `
                <div class="detail-properties">
                    <h5>Proprietà</h5>
                    <div class="properties-list">
                        ${item.properties.map(p => `
                            <span class="property-tag">${typeof p === 'string' ? p : p.name}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Ottiene l'icona per un oggetto
 * @param {Object} item 
 * @returns {string} Emoji
 */
function getItemIcon(item) {
    if (!item) return '❓';
    if (item.icon) return item.icon;
    
    const category = item.equipment_category?.index || item.equipment_category?.name?.toLowerCase();
    const name = item.name?.toLowerCase() || '';
    
    if (category === 'weapon') {
        if (name.includes('spada') || name.includes('sword')) return '🗡️';
        if (name.includes('ascia') || name.includes('axe')) return '🪓';
        if (name.includes('arco') || name.includes('bow')) return '🏹';
        if (name.includes('lancia') || name.includes('spear')) return '🔱';
        if (name.includes('pugnale') || name.includes('dagger')) return '🔪';
        return '⚔️';
    }
    
    if (category === 'armor') {
        if (name.includes('scudo')) return '🛡️';
        if (name.includes('elmo')) return '🎩';
        if (name.includes('guanto')) return '🧤';
        if (name.includes('stivali')) return '👢';
        return '🦺';
    }
    
    if (item.rarity || item.isMagical) {
        if (name.includes('anello')) return '💍';
        if (name.includes('amuleto')) return '📿';
        if (name.includes('cintura')) return '🔗';
        if (name.includes('mantello')) return '🧥';
        if (name.includes('pozione')) return '🧪';
        if (name.includes('pergamena')) return '📜';
        return '✨';
    }
    
    return '📦';
}

export default {
    renderInventoryPanel,
    renderAddItemPopup,
    renderItemDetail
};
