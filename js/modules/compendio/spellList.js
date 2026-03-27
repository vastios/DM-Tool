// modules/spellList.js

import { spellDatabase } from '../../../database/spells.js';
import { classSpellList } from '../../../database/classSpells.js';
import { linkifyConditions, escapeHtml } from '../../../utils/htmlHelpers.js';

// --- FUNZIONE HELPER PER I NUMERI ROMANI ---
function toRoman(num) {
    if (isNaN(num)) return 'N/A';
    const romanNumerals = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return romanNumerals[num] || 'N/A';
}

// --- OGGETTO CON LE ABBREVIAZIONI DELLE SCUOLE ---
const schoolAbbreviations = {
    'Tutti': 'Tutti',
    'Evocazione': 'Evo',
    'Illusione': 'Illu',
    'Necromanzia': 'Necro',
    'Ammaliamento': 'Ammal',
    'Abiurazione': 'Abiu',
    'Invocazione': 'Invoc',
    'Divinazione': 'Divin',
    'Trasmutazione': 'Trasm'
};

// --- FUNZIONE HELPER PER CREARE I PULSANTI DI FILTRO ---
function createFilterButtons(container, items, cssClass, activeItem = 'Tutti', itemRenderer = (item) => item) {
    items.forEach(item => {
        const button = document.createElement('button');
        button.className = `filter-btn ${cssClass}`;
        button.dataset.filter = item;
        button.innerHTML = itemRenderer(item);

        if (item === activeItem) {
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
        } else {
            button.setAttribute('aria-pressed', 'false');
        }

        container.appendChild(button);
    });
}

const SpellList = {
    render(containerElement, spellToSelect = null) {
        const schools = {
            'Evocazione': '🔥', 'Illusione': '🎭', 'Necromanzia': '💀',
            'Ammaliamento': '🧠', 'Abiurazione': '🛡️', 'Invocazione': '✨',
            'Divinazione': '🔮', 'Trasmutazione': '🧪',
            'Tutti': '📖'
        };

        // Array con "Tutti" alla fine per l'ordinamento corretto
        const levels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Tutti'];
        const classes = [...Object.keys(classSpellList), 'Tutti'];

        containerElement.innerHTML = `
            <div class="spell-list-container">
                <div class="spell-search-cell">
                    <h2>Cerca e Filtra</h2>
                    <input type="text" class="list-search" placeholder="Nome incantesimo...">
                    
                    <div class="compact-filters" id="class-filters">
                        <div class="filter-group-title">Classe</div>
                        <div class="filter-buttons-container"></div>
                    </div>
                    
                    <div class="compact-filters" id="school-filters">
                        <div class="filter-group-title">Scuola Magica</div>
                        <div class="filter-buttons-container"></div>
                    </div>
                    
                    <div class="compact-filters" id="level-filters">
                        <div class="filter-group-title">Livello</div>
                        <div class="filter-buttons-container"></div>
                    </div>
                    
                    <button class="reset-filters-btn">Resetta Filtri</button>
                </div>
                <div class="spell-list-cell">
                    <h2>Lista Incantesimi</h2>
                    <ul class="spell-full-list"></ul>
                    <p class="spell-list-counter"></p>
                </div>
                <div class="spell-details-cell">
                    <p style="text-align: center; margin-top: 3rem; color: #a0783a;">Seleziona un incantesimo dalla lista per visualizzarne i dettagli.</p>
                </div>
            </div>
        `;

        const listContainer = containerElement.querySelector('.spell-list-container');
        const searchInput = listContainer.querySelector('.list-search');
        const fullList = listContainer.querySelector('.spell-full-list');
        const detailsElement = listContainer.querySelector('.spell-details-cell');
        const counterElement = listContainer.querySelector('.spell-list-counter');
        const classFilterContainer = listContainer.querySelector('#class-filters .filter-buttons-container');
        const schoolFilterContainer = listContainer.querySelector('#school-filters .filter-buttons-container');
        const levelFilterContainer = listContainer.querySelector('#level-filters .filter-buttons-container');
        const resetBtn = listContainer.querySelector('.reset-filters-btn');

        let activeSchoolFilter = 'Tutti';
        let activeLevelFilter = 'Tutti';
        let activeClassFilter = 'Tutti';

        function resetFilters() {
            activeSchoolFilter = 'Tutti';
            activeLevelFilter = 'Tutti';
            activeClassFilter = 'Tutti';
            searchInput.value = '';
            
            const allFilterContainers = [classFilterContainer, schoolFilterContainer, levelFilterContainer];
            allFilterContainers.forEach(container => {
                const allButtons = container.querySelectorAll('.filter-btn');
                allButtons.forEach(button => {
                    if (button.dataset.filter === 'Tutti') {
                        button.classList.add('active');
                        button.setAttribute('aria-pressed', 'true');
                    } else {
                        button.classList.remove('active');
                        button.setAttribute('aria-pressed', 'false');
                    }
                });
            });
            
            renderList();
        }

        function renderList() {
            fullList.innerHTML = '';
            const searchTerm = searchInput.value.toLowerCase();
            let foundCount = 0;
            const fragment = document.createDocumentFragment();

            for (const name in spellDatabase) {
                const spell = spellDatabase[name];
                const schoolIcon = schools[spell.school] || '📜';

                const matchesSearch = name.toLowerCase().includes(searchTerm);
                const matchesSchool = activeSchoolFilter === 'Tutti' || spell.school === activeSchoolFilter;
                const matchesLevel = activeLevelFilter === 'Tutti' || (String(spell.level) === activeLevelFilter);
                const matchesClass = activeClassFilter === 'Tutti' || (classSpellList[activeClassFilter]?.includes(name));

                if (matchesSearch && matchesSchool && matchesLevel && matchesClass) {
                    foundCount++;
                    const li = document.createElement('li');
                    const levelRoman = toRoman(spell.level);
                    li.textContent = `${name} (${levelRoman}°)`;
                    li.dataset.spellName = name;

                    const iconSpan = document.createElement('span');
                    iconSpan.className = 'school-icon';
                    iconSpan.textContent = schoolIcon;
                    li.prepend(iconSpan);
                    
                    fragment.appendChild(li);
                }
            }
            
            fullList.appendChild(fragment);
            counterElement.textContent = `${foundCount} incantesimi trovati`;
        }
        
        function showDetails(spellName) {
            const spell = spellDatabase[spellName];
            if (!spell) return;

            detailsElement.style.opacity = '0';
            setTimeout(() => {
                let detailsHTML = `
                    <h3>${spell.name}</h3>
                    <p><strong>Livello:</strong> ${toRoman(spell.level)}° | <strong>Scuola:</strong> ${spell.school}</p>
                    <p><strong>Tempo di Lancio:</strong> ${spell.casting_time}</p>
                    <p><strong>Gittata:</strong> ${spell.range}</p>
                    <p><strong>Componenti:</strong> ${spell.components}</p>
                    <p><strong>Durata:</strong> ${spell.duration}</p>
                    <hr>
                    <p>${escapeHtml(spell.description)}</p>
                `;
                if (spell.tableHTML) detailsHTML += spell.tableHTML;
                if (spell.descriptionAfterTable) detailsHTML += `<hr><p>${escapeHtml(spell.descriptionAfterTable)}</p>`;

                const linkedDetailsHTML = linkifyConditions(detailsHTML);

                detailsElement.innerHTML = linkedDetailsHTML;
                detailsElement.style.opacity = '1';
            }, 150);
        }

        // Creazione dei pulsanti per ogni filtro
        createFilterButtons(classFilterContainer, classes, 'class-filter');
        createFilterButtons(schoolFilterContainer, Object.keys(schools), 'school-filter', 'Tutti', (school) => `<span class="school-icon">${schools[school]}</span>${schoolAbbreviations[school]}`);
        createFilterButtons(levelFilterContainer, levels, 'level-filter', 'Tutti', (level) => level === 'Tutti' ? 'Tutti' : toRoman(parseInt(level, 10)));

        // Event Listeners
        listContainer.addEventListener('click', (e) => {
            const clickedButton = e.target.closest('.filter-btn');
            if (clickedButton) {
                const filterType = clickedButton.closest('.compact-filters').id.replace('-filters', '');
                const newFilter = clickedButton.dataset.filter;

                // Aggiorna lo stato attivo
                if (filterType === 'class') activeClassFilter = newFilter;
                if (filterType === 'school') activeSchoolFilter = newFilter;
                if (filterType === 'level') activeLevelFilter = newFilter;

                // Aggiorna l'interfaccia grafica
                clickedButton.closest('.compact-filters').querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                clickedButton.classList.add('active');
                clickedButton.setAttribute('aria-pressed', 'true');

                renderList();
            }

            const clickedListItem = e.target.closest('.spell-full-list li');
            if (clickedListItem) {
                showDetails(clickedListItem.dataset.spellName);
            }
        });

        detailsElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('details-close-btn')) {
                detailsElement.innerHTML = `<p style="text-align: center; margin-top: 3rem; color: #a0783a;">Seleziona un incantesimo dalla lista per visualizzarne i dettagli.</p>`;
            }
        });

        searchInput.addEventListener('input', renderList);
        resetBtn.addEventListener('click', resetFilters);

        // Render iniziale
        renderList();
        
        // Se è stato passato un incantesimo da selezionare, mostrane i dettagli
        if (spellToSelect) {
            // spellToSelect può essere una stringa (nome) o un oggetto { id, section }
            const spellName = typeof spellToSelect === 'string' ? spellToSelect : spellToSelect.id;
            if (spellName && spellDatabase[spellName]) {
                // Piccolo delay per assicurarsi che la lista sia renderizzata
                setTimeout(() => {
                    // Evidenzia l'elemento nella lista
                    const listItem = fullList.querySelector(`li[data-spell-name="${spellName}"]`);
                    if (listItem) {
                        listItem.classList.add('highlighted');
                        listItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    // Mostra i dettagli
                    showDetails(spellName);
                }, 100);
            }
        }
    }
};

export default SpellList;