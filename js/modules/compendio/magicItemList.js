// js/modules/compendio/magicItemList.js

import { magicItemsDatabase } from '../../../database/magicItems.js';
import { escapeHtml } from '../../../utils/htmlHelpers.js';

const MagicItemList = {
    render(containerElement) {
        const extractValue = (field) => {
            if (!field) return 'Sconosciuto';
            if (typeof field === 'string') return field;
            if (typeof field === 'object' && field.name) return field.name;
            return 'Sconosciuto';
        };

        const getItemType = (item) => {
            if (item.type) {
                return extractValue(item.type);
            }
            if (item.equipment_category && item.equipment_category.name) {
                return item.equipment_category.name;
            }
            return 'Sconosciuto';
        };

        // --- CORREZIONE FILTRI: RENDERE LA FUNZIONE GENERICA ---
        // Ora usa `extractValue(item[field])` per funzionare con qualsiasi campo (tipo, rarità, ecc.).
        // Per il campo 'type', usa getItemType() che gestisce sia 'type' che 'equipment_category'
        function getDynamicFilters(data, field) {
            const filters = data.map(item => {
                let value;
                if (field === 'type') {
                    value = getItemType(item);
                } else {
                    value = extractValue(item[field]);
                }
                if (value && value.includes('(')) {
                    return value.split('(')[0].trim();
                }
                return value;
            });
            const uniqueFilters = [...new Set(filters)].sort();
            return ['Tutti', ...uniqueFilters];
        }

        containerElement.innerHTML = `
            <div class="item-list-container">
                <div class="monster-search-cell">
                    <h2>Cerca e Filtra</h2>
                    <input type="text" class="list-search" placeholder="Nome oggetto magico...">
                    <div class="monster-filters-card">
                        <div class="filter-group-title">Tipo</div>
                        <div class="filter-buttons-container" id="type-filters"></div>
                    </div>
                    <div class="monster-filters-card">
                        <div class="filter-group-title">Rarità</div>
                        <div class="filter-buttons-container" id="rarity-filters"></div>
                    </div>
                    <button class="reset-filters-btn">Resetta Filtri</button>
                </div>
                <div class="monster-list-cell">
                    <h2>Lista Oggetti Magici</h2>
                    <div class="list-scroll-wrapper">
                        <ul class="monster-full-list"></ul>
                    </div>
                    <p class="monster-list-counter"></p>
                </div>
                <div class="monster-details-cell">
                    <div id="details-content">
                        <p style="text-align: center; margin-top: 3rem; color: #8a7d60;">
                            Seleziona un oggetto magico dalla lista per visualizzarne i dettagli.
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
        const typeFilterContainer = listContainer.querySelector('#type-filters');
        const rarityFilterContainer = listContainer.querySelector('#rarity-filters');
        const resetBtn = listContainer.querySelector('.reset-filters-btn');

        let activeTypeFilter = 'Tutti';
        let activeRarityFilter = 'Tutti';

        function renderFilterButtons(container, filters, activeFilter, filterType) {
            container.innerHTML = '';
            filters.forEach(filter => {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                button.dataset.filter = filter;
                button.dataset.filterType = filterType;
                button.textContent = filter;
                if (filter === activeFilter) button.classList.add('active');
                container.appendChild(button);
            });
        }

        function renderList() {
            fullList.innerHTML = '';
            const searchTerm = searchInput.value.toLowerCase();
            let foundCount = 0;
            const fragment = document.createDocumentFragment();

            for (const item of magicItemsDatabase) {
                if (!item || typeof item.name !== 'string') {
                    console.warn("⚠️ Oggetto magico malformato o senza nome, saltato:", item);
                    continue;
                }

                // --- CORREZIONE FILTRI: PULIZIA E CONFRONTO PER TIPO ---
                let itemType = getItemType(item);
                const cleanItemType = itemType.includes('(') ? itemType.split('(')[0].trim() : itemType;

                // --- CORREZIONE FILTRI: PULIZIA E CONFRONTO PER RARITÀ ---
                const itemRarity = extractValue(item.rarity);
                const cleanItemRarity = itemRarity.includes('(') ? itemRarity.split('(')[0].trim() : itemRarity;

                const matchesSearch = item.name.toLowerCase().includes(searchTerm);
                const matchesType = activeTypeFilter === 'Tutti' || cleanItemType === activeTypeFilter;
                const matchesRarity = activeRarityFilter === 'Tutti' || cleanItemRarity === activeRarityFilter;

                if (matchesSearch && matchesType && matchesRarity) {
                    foundCount++;
                    const li = document.createElement('li');
                    li.dataset.itemIndex = item.index || `unknown-${foundCount}`;
                    
                    const itemName = item.name;
                    const rarityClass = itemRarity.toLowerCase().replace(' ', '-');

                    li.innerHTML = `
                        <div class="item-card-content">
                            <span class="item-name">${escapeHtml(itemName)}</span>
                            <span class="item-meta">${escapeHtml(itemType)}</span>
                            <div class="item-card-stats">
                                <span class="rarity-badge rarity-${rarityClass}">${escapeHtml(itemRarity)}</span>
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
            const item = magicItemsDatabase.find(i => i.index === itemIndex);
            if (!item) {
                detailsElement.innerHTML = `<p style="text-align:center; color: #e74c3c;">Dettagli non trovati per l'ID: ${itemIndex}.</p>`;
                return;
            }

            const itemName = item.name;
            const itemType = getItemType(item);
            const itemRarity = extractValue(item.rarity);
            const rarityClass = itemRarity.toLowerCase().replace(' ', '-');
            const requiresAttunement = item.requires_attunement || false;

            let detailsHTML = `
                <h3>${escapeHtml(itemName)}</h3>
                <p><strong>Tipo:</strong> ${escapeHtml(itemType)}</p>
                <p><strong>Rarità:</strong> <span class="rarity-badge rarity-${rarityClass}">${escapeHtml(itemRarity)}</span></p>
                <p><strong>Richiede Sintonizzazione:</strong> ${requiresAttunement ? 'Sì' : 'No'}</p>
            `;

            if (item.desc && Array.isArray(item.desc) && item.desc.length > 0) {
                const safeLines = item.desc
                    .filter(line => typeof line === 'string')
                    .map(line => escapeHtml(line))
                    .join('<br>');
                detailsHTML += `<hr><p>${safeLines}</p>`;
            }
            
            detailsElement.innerHTML = `<div id="details-content">${detailsHTML}</div>`;
        }

        function resetFilters() {
            activeTypeFilter = 'Tutti';
            activeRarityFilter = 'Tutti';
            searchInput.value = '';
            listContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            renderList();
        }

        const typeFilters = getDynamicFilters(magicItemsDatabase, 'type');
        const rarityFilters = getDynamicFilters(magicItemsDatabase, 'rarity');
        renderFilterButtons(typeFilterContainer, typeFilters, activeTypeFilter, 'type');
        renderFilterButtons(rarityFilterContainer, rarityFilters, activeRarityFilter, 'rarity');

        renderList();

        listContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const filterType = e.target.dataset.filterType;
                const filterValue = e.target.dataset.filter;
                
                listContainer.querySelectorAll(`.filter-btn[data-filter-type="${filterType}"]`).forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                if (filterType === 'type') {
                    activeTypeFilter = filterValue;
                } else if (filterType === 'rarity') {
                    activeRarityFilter = filterValue;
                }
                renderList();
            }
            const li = e.target.closest('.monster-full-list li');
            if (li) {
                showDetails(li.dataset.itemIndex);
            }
        });

        searchInput.addEventListener('input', renderList);
        resetBtn.addEventListener('click', resetFilters);
    }
};

export default MagicItemList;