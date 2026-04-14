// modules/monsterList.js

import { monsterDatabase } from '../../../database/monsterDatabase.js'; // Percorso corretto per la tua struttura
import { addMonsterToCombat } from '../../../stateManager.js';
import { escapeHtml, linkifyConditions } from '../../../utils/htmlHelpers.js';
import { showToast } from '../../../utils/toast.js';

// --- FUNZIONE HELPER PER CALCOLARE IL MODIFICATORE DI UNA CARATTERISTICA ---
function getModString(score) {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

// --- FUNZIONI HELPER PER FORMATTARE LE STATISTICHE ---
function formatResistances(monster) {
    const immunities = monster.damage_immunities?.join(', ') || 'Nessuna';
    const resistances = monster.damage_resistances?.join(', ') || 'Nessuna';
    const vulnerabilities = monster.damage_vulnerabilities?.join(', ') || 'Nessuna';

    return `
        <p><strong>Immunità:</strong> ${immunities}</p>
        <p><strong>Resistenze:</strong> ${resistances}</p>
        <p><strong>Vulnerabilità:</strong> ${vulnerabilities}</p>
    `;
}

function formatSaves(monster) {
    if (!monster.proficiencies) return 'Nessuno';
    
    const saves = {};
    monster.proficiencies.forEach(p => {
        if (p.proficiency.name.startsWith("Tiro Salvezza")) {
            const saveName = p.proficiency.name.split(": ")[1].substring(0, 3); // FOR, DES, etc.
            saves[saveName] = p.value >= 0 ? `+${p.value}` : `${p.value}`;
        }
    });
    
    const positiveSaves = Object.entries(saves)
        .filter(([name, bonus]) => parseInt(bonus, 10) > 0)
        .map(([name, bonus]) => `${name} ${bonus}`)
        .join(', ');

    return positiveSaves || 'Nessuno';
}

function formatSpeed(monster) {
    if (!monster.speed) return 'Nessuna';
    return Object.entries(monster.speed).map(([key, value]) => {
        const label = key === 'camminare' ? 'Camminata' : key.charAt(0).toUpperCase() + key.slice(1);
        return `${label} ${value}`;
    }).join(', ');
}

function formatSpecialActions(monster) {
    const actions = [];
    if (monster.special_abilities) actions.push(...monster.special_abilities);
    if (monster.legendary_actions) actions.push(...monster.legendary_actions);
    if (monster.reactions) actions.push(...monster.reactions);

    if (actions.length === 0) return 'Nessuna';

    return actions.map(action => {
        const cleanDesc = escapeHtml(action.desc);
        return `<span class="special-action-link" data-name="${action.name}" data-desc="${cleanDesc}">${action.name}</span>`;
    }).join(', ');
}

// --- NUOVA FUNZIONE HELPER PER FORMATTARE LE AZIONI IN MODO CHIARO ---
function formatAction(action) {
    let formattedName = `<strong>${action.name}.</strong> `;
    let details = [];
    let hitText = '';

    // 1. Gestione dell'Uso/Ricarica
    if (action.usage) {
        if (action.usage.type === 'per day') {
            details.push(`(${action.usage.times}/giorno)`);
        } else if (action.usage.type === 'ricarica_su_tiro') {
            details.push(`(Ricarica ${action.usage.min_value}-${action.usage.dice.replace('d', '')})`);
        }
    }
    
    // 2. Gestione del Tiro per Colpire e Portata
    if (action.attack_bonus !== undefined) {
        const attackBonus = action.attack_bonus >= 0 ? `+${action.attack_bonus}` : `${action.attack_bonus}`;
        // Estrae portata e bersaglio dalla descrizione
        const rangeMatch = action.desc.match(/portata ([\d.,\s]+m\.)(?:, ([\w\s]+))?/);
        const range = rangeMatch ? rangeMatch[1] : 'N/A';
        const target = rangeMatch && rangeMatch[2] ? `, ${rangeMatch[2]}` : '';
        details.push(`*Attacco con Arma da Mischia:* ${attackBonus} per colpire, **portata ${range}${target}**.`);
    }
    
    // 3. Gestione del Tiro Salvezza
    if (action.dc) {
        const dcType = action.dc.dc_type ? action.dc.dc_type.name : 'N/A';
        details.push(`Ogni creatura nell'area deve superare un Tiro Salvezza su ${dcType} **CD ${action.dc.dc_value}**`);
    }

    // 4. Gestione dei Danni
    if (action.damage && action.damage.length > 0) {
        const damageStrings = action.damage.map(d => {
            const damageType = d.damage_type.name.toLowerCase();
            // Pluralizza il tipo di danno per una lettura più naturale
            const pluralizedType = (damageType === 'contundente' || damageType === 'tagliente' || damageType === 'perforante') ? `danni ${damageType}` : `danno da ${damageType}`;
            return `${d.damage_dice} ${pluralizedType}`;
        });
        hitText = `<br><strong>Colpito:</strong> ${damageStrings.join(' e ')}.`;
    }

    // 5. Gestione del Danno Metà su Salvataggio
    if (action.dc && action.dc.success_type === 'half') {
        hitText += ' se fallisce, o la metà se riesce.';
    } else if (action.dc) {
        hitText += ' se fallisce il tiro salvezza.';
    }

    // Assembla la descrizione finale
    let description = action.desc;
    
    // Rimuove le parti che abbiamo già estratto per evitare duplicazioni
    if (action.attack_bonus) {
        description = description.replace(/Attacco con Arma da Mischia: [+-]?\d+ per colpire, portata [\d.,\s]+m\.(?:, [\w\s]+)?\s?Colpito: /, '');
    }
    if (action.dc) {
        description = description.replace(/Ogni creatura [\w\s]+ deve superare un Tiro Salvezza su \w+ CD \d+, subendo [\d(d+\s+)+] danno [\w\s]+ se fallisce il tiro salvezza, o la metà di questo danno se lo riesce\./, '');
    }
    if(action.damage && action.damage.length > 0) {
        // Rimuove la parte del danno dalla descrizione originale
        description = description.replace(/, subendo [\d(d+\s+)+] danno [\w\s]+( più [\d(d+\s+)+] danno [\w\s]+)?\./, '');
    }

    return `
        <p>${formattedName}${details.join(' ')} ${linkifyConditions(escapeHtml(description.trim()))}${hitText}</p>
    `;
}


const MonsterList = {
    render(containerElement) {
        // --- 1. GENERA I DATI PER I FILTRI DINAMICAMENTE ---
        const types = [...new Set(monsterDatabase.map(m => m.type))].sort();
        const crs = ['Tutti', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '30'];

        // --- 2. CREA LA STRUTTURA HTML DEL MODULO (NUOVO LAYOUT) ---
        containerElement.innerHTML = `
            <div class="monster-list-container">
                <div class="monster-search-cell">
                    <h2>Cerca e Filtra</h2>
                    <input type="text" class="list-search" placeholder="Nome mostro...">
                    
                    <!-- NUOVA STRUTTURA A SCHEDE -->
                    <div class="monster-filters-card">
                        <div class="filter-group-title">Tipo</div>
                        <div class="filter-buttons-container" id="type-filters"></div>
                    </div>
                    <div class="monster-filters-card">
                        <div class="filter-group-title">Challenge Rating</div>
                        <div class="filter-buttons-container" id="cr-filters"></div>
                    </div>
                    
                    <button class="reset-filters-btn">Resetta Filtri</button>
                </div>
                <div class="monster-list-cell">
                    <h2>Lista Mostri</h2>
                    <ul class="monster-full-list"></ul>
                    <p class="monster-list-counter"></p>
                </div>
                <div class="monster-details-cell">
                    <p style="text-align: center; margin-top: 3rem; color: #8a7d60;">Seleziona un mostro dalla lista per visualizzarne i dettagli.</p>
                </div>
            </div>
        `;

        // --- 3. OTTIENE I RIFERIMENTI AGLI ELEMENTI DEL DOM ---
        const listContainer = containerElement.querySelector('.monster-list-container');
        const searchInput = listContainer.querySelector('.list-search');
        const fullList = listContainer.querySelector('.monster-full-list');
        const detailsElement = listContainer.querySelector('.monster-details-cell');
        const counterElement = listContainer.querySelector('.monster-list-counter');
        const typeFilterContainer = listContainer.querySelector('#type-filters');
        const crFilterContainer = listContainer.querySelector('#cr-filters');
        const resetBtn = listContainer.querySelector('.reset-filters-btn');

        // --- 4. INIZIALIZZA LO STATO DEI FILTRI ---
        let activeTypeFilter = 'Tutti';
        let activeCrFilter = 'Tutti';

        // --- 5. FUNZIONE DI RESET ---
        function resetFilters() {
            activeTypeFilter = 'Tutti';
            activeCrFilter = 'Tutti';
            searchInput.value = '';
            
            listContainer.querySelector('.type-filter.active')?.classList.remove('active');
            listContainer.querySelector('.cr-filter.active')?.classList.remove('active');
            listContainer.querySelector('[data-filter="Tutti"].type-filter')?.classList.add('active');
            listContainer.querySelector('[data-filter="Tutti"].cr-filter')?.classList.add('active');
            
            renderList();
        }

        // --- 6. FUNZIONE DI RENDERING DELLA LISTA (AGGIORNATA PER LE SCHEDE) ---
        function renderList() {
            fullList.innerHTML = '';
            const searchTerm = searchInput.value.toLowerCase();
            let foundCount = 0;
            const fragment = document.createDocumentFragment();

            for (const monster of monsterDatabase) {
                const matchesSearch = monster.name.toLowerCase().includes(searchTerm);
                const matchesType = activeTypeFilter === 'Tutti' || monster.type.toLowerCase() === activeTypeFilter;
                const matchesCr = activeCrFilter === 'Tutti' || String(monster.challenge_rating) === activeCrFilter;

                if (matchesSearch && matchesType && matchesCr) {
                    foundCount++;
                    const ac = monster.armor_class[0]?.value || 'N/A';
                    
                    // --- NUOVO HTML PER LA SCHEDA ---
                    const li = document.createElement('li');
                    li.dataset.monsterIndex = monster.index;
                    li.innerHTML = `
                        <h3 class="monster-card-name">${monster.name}</h3>
                        <p class="monster-card-meta"><em>${monster.size} ${monster.type}, ${monster.alignment}</em></p>
                        <p class="monster-card-stats">
                            <span><strong>CR:</strong> ${monster.challenge_rating}</span>
                            <span><strong>PF:</strong> ${monster.hit_points}</span>
                            <span><strong>CA:</strong> ${ac}</span>
                        </p>
                    `;
                    fragment.appendChild(li);
                }
            }
            
            fullList.appendChild(fragment);
            counterElement.textContent = `${foundCount} mostri trovati`;
        }
        
        // --- 7. FUNZIONE PER MOSTRARE I DETTAGLI (STAT BLOCK) ---
        function showDetails(monsterIndex) {
            const monster = monsterDatabase.find(m => m.index === monsterIndex);
            if (!monster) return;

            detailsElement.style.opacity = '0';
            setTimeout(() => {
                const formatProficiencies = (profArray) => {
                    const saves = [];
                    const skills = [];
                    profArray.forEach(p => {
                        if (p.proficiency.name.startsWith("Tiro Salvezza")) {
                            saves.push(`${p.proficiency.name.split(": ")[1].substring(0, 3)}: ${p.value >= 0 ? '+' : ''}${p.value}`);
                        } else if (p.proficiency.name.startsWith("Abilità")) {
                            skills.push(`${p.proficiency.name.split(": ")[1]}: ${p.value >= 0 ? '+' : ''}${p.value}`);
                        }
                    });
                    return { saves, skills };
                };

                const { saves, skills } = formatProficiencies(monster.proficiencies || []);
                const ac = monster.armor_class[0];
                
                let detailsHTML = `
                    <button class="details-close-btn">&times;</button>
                    <div class="monster-stat-block">
                        <div class="monster-details-header">
                            <h3 class="monster-name">${monster.name}</h3>
                            <p class="monster-meta"><em>${monster.size} ${monster.type}, ${monster.alignment}</em></p>
                            <!-- <<< MODIFICA: Spostato qui il pulsante per maggior visibilità -->
                            <button class="action-btn add-to-combat-btn" data-monster-index="${monster.index}">Aggiungi al Combattimento</button>
                        </div>
                        
                        <div class="monster-top-stats">
                            <div class="monster-stats-left">
                                <p><strong>Classe Armatura:</strong> ${ac.value} (${ac.type})</p>
                                <p><strong>Punti Ferita:</strong> ${monster.hit_points} (${monster.hit_dice})</p>
                                <p><strong>Velocità:</strong> ${formatSpeed(monster)}</p>
                            </div>
                            <div class="monster-stats-right">
                                <div class="monster-abilities-grid">
                                    <div><strong>FOR</strong> ${monster.strength} (${getModString(monster.strength)})</div>
                                    <div><strong>DES</strong> ${monster.dexterity} (${getModString(monster.dexterity)})</div>
                                    <div><strong>COS</strong> ${monster.constitution} (${getModString(monster.constitution)})</div>
                                    <div><strong>INT</strong> ${monster.intelligence} (${getModString(monster.intelligence)})</div>
                                    <div><strong>SAG</strong> ${monster.wisdom} (${getModString(monster.wisdom)})</div>
                                    <div><strong>CAR</strong> ${monster.charisma} (${getModString(monster.charisma)})</div>
                                </div>
                            </div>
                        </div>
                        
                        <hr>
                        <div class="monster-property-list">
                            ${saves.length > 0 ? `<p><strong>Tiri Salvezza:</strong> ${saves.join(', ')}</p>` : ''}
                            ${skills.length > 0 ? `<p><strong>Abilità:</strong> ${skills.join(', ')}</p>` : ''}
                            <p><strong>Sensi:</strong> ${Object.entries(monster.senses).map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)} ${v}`).join(', ')}</p>
                            <p><strong>Linguaggi:</strong> ${monster.languages}</p>
                            <p><strong>Challenge Rating:</strong> ${monster.challenge_rating} (${monster.xp} PF)</p>
                        </div>
                `;

                // --- NUOVA LOGICA DI RENDERING PER LE SEZIONI ---
                const renderSection = (title, actions) => {
                    if (!actions || actions.length === 0) return '';
                    return `
                        <div class="monster-section">
                            <h4>${title}</h4>
                            ${actions.map(a => formatAction(a)).join('')}
                        </div>
                    `;
                };

                detailsHTML += renderSection("Azioni Speciali", monster.special_abilities);
                detailsHTML += renderSection("Azioni", monster.actions);
                detailsHTML += renderSection("Azioni Leggendarie", monster.legendary_actions);
                detailsHTML += renderSection("Reazioni", monster.reactions);

                detailsHTML += `</div>`; // Chiusura di monster-stat-block

                detailsElement.innerHTML = detailsHTML;
                detailsElement.style.opacity = '1';
            }, 150);
        }

        // --- 8. CREAZIONE DEI PULSANTI DEI FILTRI ---
        const createFilterButtons = (container, items, cssClass, activeItem = 'Tutti', itemRenderer = (item) => item) => {
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
        };

        createFilterButtons(typeFilterContainer, ['Tutti', ...types], 'type-filter');
        createFilterButtons(crFilterContainer, crs, 'cr-filter');

        // --- 9. EVENT LISTENERS ---
        searchInput.addEventListener('input', renderList);
        resetBtn.addEventListener('click', resetFilters);

        listContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('type-filter')) {
                listContainer.querySelector('.type-filter.active')?.classList.remove('active');
                e.target.classList.add('active');
                activeTypeFilter = e.target.dataset.filter;
                renderList();
            }
            if (e.target.classList.contains('cr-filter')) {
                listContainer.querySelector('.cr-filter.active')?.classList.remove('active');
                e.target.classList.add('active');
                activeCrFilter = e.target.dataset.filter;
                renderList();
            }

            const li = e.target.closest('.monster-full-list li');
            if (li) {
                showDetails(li.dataset.monsterIndex);
            }
        });
        
        detailsElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('details-close-btn')) {
                detailsElement.innerHTML = `<p style="text-align: center; margin-top: 3rem; color: #8a7d60;">Seleziona un mostro dalla lista per visualizzarne i dettagli.</p>`;
            }
            
            // INTEGRAZIONE DELLA TOAST NOTIFICATION
            if (e.target.classList.contains('add-to-combat-btn')) {
                const monsterIndex = e.target.dataset.monsterIndex;
                const monster = monsterDatabase.find(m => m.index === monsterIndex);

                if (monster) {
                    addMonsterToCombat(monster);
                    showToast(`${monster.name} aggiunto al combattimento!`, 'success');
                }
            }
        });

        renderList();
    }
};

export default MonsterList;