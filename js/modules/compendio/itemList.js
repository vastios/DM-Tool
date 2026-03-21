// js/modules/compendio/itemList.js

import { itemDatabase } from '../../../database/items.js';
import { weaponPropertiesDatabase } from '../../../database/weaponProperties.js'; // NUOVO IMPORT
import { escapeHtml } from '../../../utils/htmlHelpers.js';

// --- CONFIGURAZIONE DEI FILTRI (DATA-DRIVEN) ---
const filterConfig = {
    'Armi': { secondaryField: 'weapon_category' },
    'Armature': { secondaryField: 'armor_category' },
    'Equipaggiamento da Avventura': { secondaryField: 'gear_category.name' },
    'Strumenti': { secondaryField: 'tool_category' },
    'Oggetti Magici': { secondaryField: 'rarity.name' },
    'Cavalcature e Veicoli': { secondaryField: 'vehicle_category' }
};

// --- FUNZIONI HELPER SICURE ---
const safeGet = (obj, path, fallback = 'N/A') => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || fallback;
};

const formatCost = (cost) => {
    if (!cost) return 'N/A';
    if (cost.quantity === 0 && cost.unit === 'mo') return '0 mo';
    return `${cost.quantity} ${cost.unit}`;
};

// --- NUOVA FUNZIONE PER GESTIRE I TOOLTIP ---
const showTooltip = (e, text) => {
    let tooltip = document.querySelector('.item-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'item-tooltip';
        document.body.appendChild(tooltip);
    }
    tooltip.textContent = text;
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
    tooltip.style.opacity = '1';
};

const hideTooltip = () => {
    const tooltip = document.querySelector('.item-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
    }
};


const ItemList = {
    render(containerElement) {
        containerElement.innerHTML = `
            <div class="item-list-container">
                <div class="monster-search-cell">
                    <h2>Cerca e Filtra</h2>
                    <input type="text" class="list-search" placeholder="Nome oggetto...">
                    <div class="monster-filters-card">
                        <div class="filter-group-title">Categoria</div>
                        <div class="filter-buttons-container" id="primary-filters"></div>
                    </div>
                    <div id="secondary-filter-container" class="monster-filters-card" style="display: none;">
                        <div class="filter-group-title" id="secondary-filter-title"></div>
                        <div class="filter-buttons-container" id="secondary-filters"></div>
                    </div>
                    <button class="reset-filters-btn">Resetta Filtri</button>
                </div>
                <div class="monster-list-cell">
                    <h2>Lista Oggetti</h2>
                    <div class="list-scroll-wrapper">
                        <ul class="monster-full-list"></ul>
                    </div>
                    <p class="monster-list-counter"></p>
                </div>
                <div class="monster-details-cell">
                    <div id="details-content">
                        <p style="text-align: center; margin-top: 3rem; color: #8a7d60;">
                            Seleziona un oggetto dalla lista per visualizzarne i dettagli.
                        </p>
                    </div>
                </div>
            </div>
        `;

        const listContainer = containerElement.querySelector('.item-list-container');
        const searchInput = listContainer.querySelector('.list-search');
        const fullList = listContainer.querySelector('.monster-full-list');
        const detailsElement = listContainer.querySelector('.monster-details-cell');
        const counterElement = listContainer.querySelector('.monster-list-counter');
        const primaryFilterContainer = listContainer.querySelector('#primary-filters');
        const secondaryFilterContainer = listContainer.querySelector('#secondary-filter-container');
        const secondaryFilterTitle = listContainer.querySelector('#secondary-filter-title');
        const secondaryFilterButtons = listContainer.querySelector('#secondary-filters');
        const resetBtn = listContainer.querySelector('.reset-filters-btn');

        let activePrimaryFilter = 'Tutti';
        let activeSecondaryFilter = 'Tutti';

        // --- FUNZIONI DI LOGICA ---
        function resetFilters() {
            activePrimaryFilter = 'Tutti';
            activeSecondaryFilter = 'Tutti';
            searchInput.value = '';
            listContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            listContainer.querySelector('.primary-filter[data-filter="Tutti"]')?.classList.add('active');
            updateSecondaryFilterPanel();
            renderList();
        }

        function updateSecondaryFilterPanel() {
            const config = filterConfig[activePrimaryFilter];
            if (!config) {
                secondaryFilterContainer.style.display = 'none';
                activeSecondaryFilter = null;
                return;
            }

            const secondaryValues = [...new Set(itemDatabase.map(item => safeGet(item, config.secondaryField)))].sort();
            const filters = ['Tutti', ...secondaryValues];

            secondaryFilterContainer.style.display = 'block';
            secondaryFilterTitle.textContent = `Tipo di ${activePrimaryFilter}`;
            secondaryFilterButtons.innerHTML = '';
            filters.forEach(filter => {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                button.dataset.filter = filter;
                button.textContent = filter;
                if (filter === 'Tutti') button.classList.add('active');
                secondaryFilterButtons.appendChild(button);
            });
            activeSecondaryFilter = 'Tutti';
        }

        function renderList() {
            fullList.innerHTML = '';
            const searchTerm = searchInput.value.toLowerCase();
            let foundCount = 0;
            const fragment = document.createDocumentFragment();

            for (const item of itemDatabase) {
                const matchesSearch = item.name.toLowerCase().includes(searchTerm);
                const matchesPrimary = activePrimaryFilter === 'Tutti' || safeGet(item, 'equipment_category.name') === activePrimaryFilter;
                
                let matchesSecondary = true;
                if (activeSecondaryFilter && activeSecondaryFilter !== 'Tutti') {
                    const config = filterConfig[activePrimaryFilter];
                    if (config) {
                        matchesSecondary = safeGet(item, config.secondaryField) === activeSecondaryFilter;
                    }
                }

                if (matchesSearch && matchesPrimary && matchesSecondary) {
                    foundCount++;
                    const li = document.createElement('li');
                    li.dataset.itemIndex = item.index;
                    const subCategory = safeGet(item, 'gear_category.name') || safeGet(item, 'weapon_category') || safeGet(item, 'armor_category') || safeGet(item, 'tool_category') || '';
                    
                    li.innerHTML = `
                        <div class="item-card-content">
                            <span class="item-name">${escapeHtml(item.name)}</span>
                            <span class="item-meta">${escapeHtml(subCategory)}</span>
                            <div class="item-card-stats">
                                <span><strong>Costo:</strong> ${formatCost(item.cost)}</span>
                                <span><strong>Peso:</strong> ${item.weight ? `${item.weight} kg` : 'N/A'}</span>
                            </div>
                        </div>
                    `;
                    fragment.appendChild(li);
                }
            }
            fullList.appendChild(fragment);
            counterElement.textContent = `${foundCount} oggetti trovati`;
        }
        
        function showDetails(itemIndex) {
            const item = itemDatabase.find(i => i.index === itemIndex);
            if (!item) return;

            detailsElement.style.opacity = '0';
            setTimeout(() => {
                let detailsHTML = `
                    <h3>${escapeHtml(item.name)}</h3>
                    <p><strong>Categoria:</strong> ${escapeHtml(safeGet(item, 'equipment_category.name'))}</p>
                    ${item.gear_category ? `<p><strong>Tipo:</strong> ${escapeHtml(safeGet(item, 'gear_category.name'))}</p>` : ''}
                    <p><strong>Costo:</strong> ${formatCost(item.cost)}</p>
                    <p><strong>Peso:</strong> ${item.weight ? `${item.weight} kg` : 'N/A'}</p>
                `;

                // --- Quantità (per munizioni e oggetti multipli) ---
                if (item.quantity && item.quantity > 1) {
                    detailsHTML += `<p><strong>Quantità:</strong> ${item.quantity}</p>`;
                }

                // --- Velocità (per cavalcature e veicoli) ---
                if (item.speed) {
                    const speedValue = typeof item.speed === 'object' 
                        ? `${item.speed.quantity} ${item.speed.unit}` 
                        : item.speed;
                    detailsHTML += `<p><strong>Velocità:</strong> ${escapeHtml(speedValue)}</p>`;
                }

                // --- Capacità (per cavalcature e veicoli) ---
                if (item.capacity) {
                    detailsHTML += `<p><strong>Capacità:</strong> ${escapeHtml(item.capacity)}</p>`;
                }

                // --- Dettagli specifici per le Armi ---
                if (item.damage) {
                    detailsHTML += `<hr><h4>Proprietà dell'Arma</h4>`;
                    
                    // Categoria arma
                    if (item.weapon_category) {
                        detailsHTML += `<p><strong>Categoria:</strong> ${escapeHtml(item.weapon_category)}</p>`;
                    }
                    if (item.category_range) {
                        detailsHTML += `<p><strong>Tipo:</strong> ${escapeHtml(item.category_range)}</p>`;
                    }
                    
                    detailsHTML += `<p><strong>Danno:</strong> ${escapeHtml(item.damage.damage_dice)} ${escapeHtml(safeGet(item, 'damage.damage_type.name'))}</p>`;
                    
                    // Gittata normale
                    if (item.range) {
                        let rangeText = `${item.range.normal}m`;
                        if (item.range.long) {
                            rangeText += ` / ${item.range.long}m (lunga)`;
                        }
                        detailsHTML += `<p><strong>Gittata:</strong> ${rangeText}</p>`;
                    }
                    
                    // Gittata lancio (per armi lanciabili)
                    if (item.throw_range) {
                        let throwText = `${item.throw_range.normal}m`;
                        if (item.throw_range.long) {
                            throwText += ` / ${item.throw_range.long}m (lunga)`;
                        }
                        detailsHTML += `<p><strong>Gittata Lancio:</strong> ${throwText}</p>`;
                    }
                    
                    if (item.two_handed_damage) {
                        detailsHTML += `<p><strong>Danno a due mani:</strong> ${escapeHtml(item.two_handed_damage.damage_dice)} ${escapeHtml(safeGet(item, 'two_handed_damage.damage_type.name'))}</p>`;
                    }
                    
                    // Proprietà speciali
                    if (item.special && item.special.length > 0) {
                        detailsHTML += `<p><strong>Speciale:</strong> ${item.special.map(s => escapeHtml(s)).join(', ')}</p>`;
                    }
                }
                
                // --- Dettagli specifici per le Armature ---
                if (item.armor_class) {
                    const acBase = item.armor_class.base;
                    let acBonus = "";
                    if (item.armor_class.dex_bonus) {
                        acBonus = item.armor_class.max_bonus 
                            ? ` + DES (max ${item.armor_class.max_bonus})` 
                            : " + DES";
                    }
                    detailsHTML += `<hr><h4>Proprietà dell'Armatura</h4>`;
                    detailsHTML += `<p><strong>Classe Armatura:</strong> ${acBase}${acBonus}</p>`;
                    if (item.str_minimum && item.str_minimum > 0) {
                        detailsHTML += `<p><strong>Forza minima:</strong> ${item.str_minimum}</p>`;
                    }
                    if (item.stealth_disadvantage) {
                        detailsHTML += `<p><strong>Stealth:</strong> Svantaggio</p>`;
                    }
                }

                // --- Dettagli specifici per gli Strumenti ---
                if (safeGet(item, 'equipment_category.name') === 'Strumenti') {
                    const toolType = item.tool_category || safeGet(item, 'gear_category.name');
                    detailsHTML += `<hr><h4>Proprietà dello Strumento</h4><p><strong>Tipo:</strong> ${escapeHtml(toolType)}</p>`;
                }

                // --- CONTENUTI DELLE DOTAZIONI (Equipment Packs) ---
                if (item.contents && item.contents.length > 0) {
                    detailsHTML += `<hr><h4>📦 Contenuti della Dotazione</h4>`;
                    detailsHTML += `<ul class="pack-contents-list">`;
                    item.contents.forEach(content => {
                        const itemName = content.item?.name || 'Oggetto sconosciuto';
                        const quantity = content.quantity || 1;
                        const quantityText = quantity > 1 ? ` <span class="pack-item-qty">(x${quantity})</span>` : '';
                        detailsHTML += `<li class="pack-item">${escapeHtml(itemName)}${quantityText}</li>`;
                    });
                    detailsHTML += `</ul>`;
                    
                    // Calcola peso totale se disponibile
                    let totalWeight = 0;
                    let weightAvailable = true;
                    item.contents.forEach(content => {
                        const subItem = itemDatabase.find(i => i.index === content.item?.index);
                        if (subItem && subItem.weight) {
                            totalWeight += (subItem.weight * (content.quantity || 1));
                        } else if (content.item?.index) {
                            weightAvailable = false;
                        }
                    });
                    if (totalWeight > 0) {
                        detailsHTML += `<p class="pack-total-weight"><strong>Peso totale stimato:</strong> ${totalWeight.toFixed(1)} kg${weightAvailable ? '' : ' (parziale)'}</p>`;
                    }
                }
                
                // --- Proprietà Generali con Tooltip ---
                if (item.properties && item.properties.length > 0) {
                    const propertiesHTML = item.properties.map(p => {
                        const prop = weaponPropertiesDatabase.find(dbProp => dbProp.index === p.index);
                        const tooltipText = prop ? prop.desc.join(' ') : 'Descrizione non disponibile.';
                        return `<span class="property-link" data-tooltip="${escapeHtml(tooltipText)}">${escapeHtml(p.name)}</span>`;
                    }).join(', ');
                    detailsHTML += `<hr><h4>Proprietà</h4><p>${propertiesHTML}</p>`;
                }

                // --- Descrizione ---
                if (item.desc && item.desc.length > 0) {
                    const safeLines = item.desc.map(line => escapeHtml(line)).join('<br>');
                    detailsHTML += `<hr><p class="item-description">${safeLines}</p>`;
                }

                detailsElement.innerHTML = `<div id="details-content">${detailsHTML}</div>`;
                detailsElement.style.opacity = '1';
                detailsElement.scrollTop = 0; 
            }, 150);
        }

        // --- INIZIALIZZAZIONE ED EVENT LISTENERS ---
        const primaryCategories = ['Tutti', ...new Set(itemDatabase.map(i => safeGet(i, 'equipment_category.name')))].sort();

        primaryCategories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn primary-filter';
            button.dataset.filter = category;
            button.textContent = category;
            if (category === 'Tutti') button.classList.add('active');
            primaryFilterContainer.appendChild(button);
        });

        listContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('primary-filter')) {
                listContainer.querySelectorAll('.primary-filter').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                activePrimaryFilter = e.target.dataset.filter;
                updateSecondaryFilterPanel();
                renderList();
            }
            if (e.target.classList.contains('filter-btn') && e.target.closest('#secondary-filters')) {
                listContainer.querySelectorAll('#secondary-filters .filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                activeSecondaryFilter = e.target.dataset.filter;
                renderList();
            }
            const li = e.target.closest('.monster-full-list li');
            if (li) showDetails(li.dataset.itemIndex);
        });

        // --- NUOVO EVENT LISTENER PER I TOOLTIP ---
        listContainer.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('property-link')) {
                const text = e.target.dataset.tooltip;
                if (text) {
                    showTooltip(e, text);
                }
            }
        });

        listContainer.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('property-link')) {
                hideTooltip();
            }
        });


        searchInput.addEventListener('input', renderList);
        resetBtn.addEventListener('click', resetFilters);

        updateSecondaryFilterPanel();
        renderList();
    }
};

export default ItemList;