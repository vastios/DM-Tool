// js/modules/campagna/campaignWiki.js

import { getCurrentCampaignId } from '../../../stateManager.js';
import { escapeHtml } from '../../../utils/htmlHelpers.js';
import { linkifyCampaignReferences } from '../../../utils/campaignLinker.js';

// --- FUNZIONE HELPER PER CARICARE I DATI AGGIORNATI ---
function getWikiData() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return {};
    const keys = ['npcs', 'locations', 'secrets', 'factions', 'uniqueItems', 'sessionNotes'];
    const data = {};
    keys.forEach(key => {
        const storageKey = `dungeonMasterTool${key.charAt(0).toUpperCase() + key.slice(1)}_${campaignId}`;
        data[key] = JSON.parse(localStorage.getItem(storageKey) || '[]');
    });
    return data;
}

// --- COSTANTI PER I FILTRI ---
const statusLabels = { 'Active': 'Attiva', 'Defunct': 'Sciolta', 'Hidden': 'Segreta' };

const filterConfig = {
    types: ['Tutti', 'npcs', 'locations', 'factions', 'uniqueItems', 'secrets', 'sessionNotes'],
    uniqueItems: {
        fields: {
            rarity: {
                values: ['Comune', 'Non Comune', 'Rara', 'Molto Rara', 'Leggendaria']
            }
        }
    }
};

// --- SCHEMA DI BASE (DIZIONARIO ETICHETTE) ---
const schemaConfig = {
    npcs: { 
        label: 'PNG', 
        fields: { 
            race: 'Razza', 
            alignment: 'Allineamento', 
            role: 'Ruolo', 
            class: 'Classe', 
            level: 'Livello',
            ac: 'Classe Armatura (CA)', 
            hp: 'Punti Ferita (PF)', 
            speed: 'Velocità', 
            initiative: 'Iniziativa',
            proficiencyBonus: 'Bonus Competenza',
            size: 'Taglia',
            type: 'Tipo',
            senses: 'Percezione Passiva',
            languages: 'Linguaggi',
            damageResistances: 'Resistenze Danno',
            conditionImmunities: 'Immunità Condizioni',
            savingThrows: 'Tiri Salvezza con Competenza',
            skills: 'Competenze Abilità',
            attacks: 'Attacchi e Incantesimi',
            personality: 'Personalità',
            ideals: 'Ideali',
            bonds: 'Legami',
            flaws: 'Difetti',
            location: 'Luogo Operativo',
            notes: 'Note DM'
        } 
    },
    locations: { label: 'Luogo', fields: { type: 'Tipo', inhabitants: 'Abitanti', pointsofinterest: 'Punti di Interesse', history: 'Storia', secrets: 'Segreti', position: 'Posizione' } },
    factions: { label: 'Fazione', fields: { status: 'Stato', leader: 'Leader', headquarters: 'Sede', description: 'Descrizione', members: 'Membri Noti', allies: 'Alleati', enemies: 'Nemici', secrets: 'Segreti DM' } },
    uniqueItems: { label: 'Oggetto', fields: { category: 'Categoria', rarity: 'Rarità', currentOwner: 'Possessore Attuale', history: 'Storia', properties: 'Proprietà', curses: 'Maledizioni' } },
    secrets: { label: 'Segreto', fields: { linkedTo: 'Collegato a', knownBy: 'Conosciuto da', isRevealed: 'conosciuto dai personaggi' } },
    sessionNotes: {
        label: 'Nota di Sessione',
        fields: {
            sessionNumber: 'N° Sessione',
            gameDate: 'Data di Gioco',
            keyEvents: 'Eventi Chiave',
            npcs: 'PNG Incontrati',
            locations: 'Luoghi Visitati',
            loot: 'Tesoro Ottenuto',
            playerNotes: 'Note per i Giocatori'
        }
    }
};

const CampaignWiki = {
    render(containerElement, itemToLoad = null) {
        console.log('📚 [CampaignWiki] Rendering...', itemToLoad ? `Item to load: ${itemToLoad.section}/${itemToLoad.id}` : 'No item to load');
        
        let allData = getWikiData();
        let activeFilters = { type: 'Tutti', rarity: 'Tutti', status: 'Tutti' };
        const typeLabels = { 'Tutti': 'Tutti', 'npcs': 'PNG', 'locations': 'Luoghi', 'factions': 'Fazioni', 'uniqueItems': 'Oggetti', 'secrets': 'Segreti', 'sessionNotes': 'Note' };

        // SOSTITUISCI IL BLOCCO `layoutHTML` IN campaignWiki.js CON QUESTO
        const layoutHTML = `
            <div class="wiki-container wiki-detail-panel" style="display: grid; grid-template-columns: 350px 1fr; height: calc(100vh - 100px); background: #f6f5ee;">
                <aside style="border-right: 2px solid #742307; display: flex; flex-direction: column; padding: 15px; background: #eee; overflow-y: auto;">
                    <h2 class="wiki-label" style="font-size: 1.5rem; margin-bottom: 15px;">Archivio Campagna</h2>
                    <input type="text" id="wiki-search" placeholder="Cerca nel database..." style="width: 100%; padding: 10px; margin-bottom: 5px; border: 1px solid #742307; border-radius: 4px;">
                    <button id="reset-filters-btn" class="action-btn small" style="width: 100%; margin-bottom: 15px; font-size: 0.7rem;">RESETTA FILTRI</button>
                    <div id="type-filters" class="wiki-section-tabs" style="margin-bottom: 15px; display: flex; flex-wrap: wrap; gap: 5px;"></div>
                    <div id="rarity-filters" class="wiki-section-tabs" style="margin-bottom: 15px; display: none; flex-wrap: wrap; gap: 5px;"></div>
                    <div id="status-filters" class="wiki-section-tabs" style="margin-bottom: 15px; display: none; flex-wrap: wrap; gap: 5px;"></div>
                    <ul id="wiki-items-list" style="list-style: none; padding: 0; border-top: 1px solid #ccc;"></ul>
                </aside>
                <!-- Il main ora gestisce il suo scroll direttamente -->
                <main id="wiki-viewer" class="note-viewer" style="padding: 0; overflow-y: auto; background-color: #f6f5ee; position: relative;">
                    <div id="editor-content" style="padding: 40px;">
                        <p style="text-align:center; color:#999; margin-top:100px; font-style: italic;">Seleziona un elemento per visualizzare i dettagli.</p>
                    </div>
                </main>
            </div>
        `;

        containerElement.innerHTML = layoutHTML;

        const contentTarget = containerElement.querySelector('#editor-content');
        const listElement = containerElement.querySelector('#wiki-items-list');
        const searchInput = containerElement.querySelector('#wiki-search');
        const viewerElement = containerElement.querySelector('#wiki-viewer');
        
        const typeFiltersBtnContainer = containerElement.querySelector('#type-filters');
        const rarityFiltersBtnContainer = containerElement.querySelector('#rarity-filters');
        const statusFiltersBtnContainer = containerElement.querySelector('#status-filters');

        const createFilterButtons = (container, items, activeFilter, labels = {}) => {
            if (!container) return;
            container.innerHTML = '';
            items.forEach(item => {
                const button = document.createElement('button');
                button.className = 'wiki-section-tab';
                button.dataset.filter = item;
                button.textContent = labels[item] || item;
                if (item === activeFilter) button.classList.add('active');
                container.appendChild(button);
            });
        };

        const displayItem = (section, id) => {
            const currentData = getWikiData();
            const item = currentData[section]?.find(i => i.id === id);
            if (!item) return;

            if (section === 'npcs') {
                // === VISUALIZZAZIONE SCHEDA PNG STILE PG MANAGER ===
                const stats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
                const statAbbr = { strength: 'FOR', dexterity: 'DES', constitution: 'COS', intelligence: 'INT', wisdom: 'SAG', charisma: 'CAR' };
                
                // Calcola modificatori
                const getMod = (val) => {
                    const v = val || 10;
                    const m = Math.floor((v - 10) / 2);
                    return m >= 0 ? `+${m}` : `${m}`;
                };
                
                // Calcola statistiche derivate
                const dexMod = Math.floor((item.dexterity || 10) - 10) / 2;
                const conMod = Math.floor((item.constitution || 10) - 10) / 2;
                const estimatedLevel = Math.max(1, Math.floor((Math.max(
                    item.strength || 10, item.dexterity || 10, item.constitution || 10,
                    item.intelligence || 10, item.wisdom || 10, item.charisma || 10
                ) - 10) / 2));
                const calculatedHP = 8 + conMod + (estimatedLevel * 8);
                const calculatedAC = 10 + dexMod;
                
                // Caratteristiche in colonna
                const abilitiesHTML = stats.map(stat => {
                    const value = item[stat] || 10;
                    const mod = getMod(value);
                    return `
                        <div class="npc-ability-block">
                            <span class="npc-ab-name">${statAbbr[stat]}</span>
                            <span class="npc-ab-score">${value}</span>
                            <span class="npc-ab-mod">${mod}</span>
                        </div>
                    `;
                }).join('');

                // Statistiche combattimento (calcolate)
                const combatStats = [
                    { label: 'CA', value: calculatedAC },
                    { label: 'PF', value: calculatedHP },
                    { label: 'Velocità', value: '9m' },
                    { label: 'Iniziativa', value: getMod(item.dexterity) }
                ];
                const combatHTML = combatStats.map(s => `
                    <div class="npc-combat-stat">
                        <label>${s.label}</label>
                        <span class="npc-big-val">${s.value}</span>
                    </div>
                `).join('');

                // Identità
                const identityFields = [
                    { label: 'Razza', value: item.race },
                    { label: 'Ruolo', value: item.role },
                    { label: 'Allineamento', value: item.alignment },
                    { label: 'Luogo', value: item.location }
                ];
                const identityHTML = identityFields.filter(f => f.value).map(f => `
                    <div class="npc-id-col">
                        <span class="npc-id-label">${f.label}</span>
                        <span class="npc-id-value">${escapeHtml(f.value)}</span>
                    </div>
                `).join('');

                // Aspetto Fisico
                const appearanceHTML = item.appearance ? `
                    <div class="npc-sheet-section npc-section-appearance">
                        <h3>Aspetto Fisico</h3>
                        <div class="npc-description-content">
                            ${linkifyCampaignReferences(escapeHtml(item.appearance)).replace(/\n/g, '<br>')}
                        </div>
                    </div>
                ` : '';

                // Personalità
                const personalityHTML = item.personality ? `
                    <div class="npc-sheet-section npc-section-personality">
                        <h3>Personalità</h3>
                        <div class="npc-description-content">
                            ${linkifyCampaignReferences(escapeHtml(item.personality)).replace(/\n/g, '<br>')}
                        </div>
                    </div>
                ` : '';

                // Relazioni
                const relationsHTML = item.relazioni ? `
                    <div class="npc-sheet-section npc-section-relations">
                        <h3>Relazioni</h3>
                        <div class="npc-description-content">
                            ${linkifyCampaignReferences(escapeHtml(item.relazioni)).replace(/\n/g, '<br>')}
                        </div>
                    </div>
                ` : '';

                // Inventario
                const inventoryHTML = (item.inventory && item.inventory.length > 0) ? `
                    <div class="npc-sheet-section npc-section-inventory">
                        <h3>🎒 Inventario</h3>
                        <ul class="npc-inventory-list">
                            ${item.inventory.map(i => `<li>${escapeHtml(i)}</li>`).join('')}
                        </ul>
                    </div>
                ` : '';

                // Oggetti Speciali
                const specialItemsHTML = (item.specialItems && item.specialItems.length > 0) ? `
                    <div class="npc-sheet-section npc-section-special-items">
                        <h3>✨ Oggetti Speciali</h3>
                        <div class="npc-special-items-list">
                            ${item.specialItems.map(i => `
                                <div class="npc-special-item">
                                    <strong>${escapeHtml(i.name)}</strong>
                                    <p>${escapeHtml(i.description)}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : '';

                // Incantesimi
                const spellsHTML = (item.spells && item.spells.length > 0) ? `
                    <div class="npc-sheet-section npc-section-spells">
                        <h3>📖 Incantesimi</h3>
                        <div class="npc-spells-list">
                            ${item.spells.map(s => `<span class="npc-spell-tag">${escapeHtml(s)}</span>`).join('')}
                        </div>
                    </div>
                ` : '';

                // Costruisci il sottotitolo (razza, ruolo)
                const subtitleParts = [item.race, item.role].filter(Boolean);
                
                contentTarget.innerHTML = `
                    <div class="npc-sheet">
                        <!-- HEADER -->
                        <div class="npc-sheet-header">
                            <div class="npc-header-left">
                                <h2 class="npc-char-name">${escapeHtml(item.name)}</h2>
                                <p class="npc-char-class-info">${subtitleParts.join(' | ')}</p>
                            </div>
                            <div class="npc-header-icon">👤</div>
                        </div>

                        <div class="npc-sheet-body">
                            <!-- RIGA 1: Identità + Combattimento -->
                            <div class="npc-sheet-row-top">
                                <div class="npc-sheet-section npc-section-identity">
                                    <h3>Identità</h3>
                                    <div class="npc-identity-cols">
                                        ${identityHTML || '<p style="color: #888; font-style: italic;">Nessuna informazione</p>'}
                                    </div>
                                </div>
                                
                                <div class="npc-sheet-section npc-section-combat">
                                    <h3>Combattimento</h3>
                                    <div class="npc-combat-grid">
                                        ${combatHTML}
                                    </div>
                                </div>
                            </div>

                            <!-- RIGA 2: Caratteristiche -->
                            <div class="npc-sheet-section npc-section-abilities">
                                <h3>Caratteristiche</h3>
                                <div class="npc-abilities-col">
                                    ${abilitiesHTML}
                                </div>
                            </div>

                            <!-- Aspetto Fisico -->
                            ${appearanceHTML}

                            <!-- Personalità -->
                            ${personalityHTML}

                            <!-- Relazioni -->
                            ${relationsHTML}

                            <!-- Inventario -->
                            ${inventoryHTML}

                            <!-- Oggetti Speciali -->
                            ${specialItemsHTML}

                            <!-- Incantesimi -->
                            ${spellsHTML}

                            <!-- Nota Segreta DM -->
                            ${item.secretNote ? `
                                <div class="npc-sheet-section npc-section-secrets">
                                    <h3>🕵️ Nota Segreta del Master</h3>
                                    <div class="npc-secrets-content">
                                        ${linkifyCampaignReferences(escapeHtml(item.secretNote)).replace(/\n/g, '<br>')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            } else {
                // --- LOGICA GENERICA PER TUTTE LE ALTRE CATEGORIE ---
                const config = schemaConfig[section];
                const internalKeys = ['id', 'name', 'title', 'description', 'content', 'secrets', 'secretNote', 'lastModified', '_section', 'linkedChapterId', 'dmNotes', 'summary'];
                
                const allKeys = [...new Set([...Object.keys(config.fields), ...Object.keys(item)])];
                const isSessionNote = section === 'sessionNotes';

                let fieldsHTML = allKeys
                    .filter(key => {
                        if (isSessionNote && key === 'summary') return false;
                        return !internalKeys.includes(key);
                    })
                    .map(key => {
                        let val = item[key];
                        const label = config.fields[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();

                        if (key === 'keyEvents' && Array.isArray(val)) {
                            val = val.map(e => `- ${e}`).join('\n');
                        }
                        if (val === true) val = "Sì";
                        else if (val === false) val = "No";
                        else if (val === null || val === undefined) val = "";

                        const escapedVal = escapeHtml(val.toString());
                        const linkifiedVal = linkifyCampaignReferences(escapedVal);
                        const isUnfilled = linkifiedVal.trim() === "";
                        let displayVal = isUnfilled ? `<span style="color: #888; font-style: italic; font-size: 0.8rem;">Non compilato</span>` : linkifiedVal.replace(/\n/g, '<br>');
                        
                        if (section === 'factions' && key === 'status') {
                            const factionStatusLabel = { 'Active': 'Attiva', 'Defunct': 'Sciolta', 'Hidden': 'Segreta' };
                            displayVal = factionStatusLabel[val] || val;
                        }

                        return `
                            <div style="margin-bottom: 12px; padding: 10px; background: #1e1e1e; border-radius: 4px; border-left: 3px solid #742307;">
                                <label style="display: block; color: #d4af37; font-size: 0.7rem; text-transform: uppercase; font-weight: bold; margin-bottom: 4px; letter-spacing: 0.5px;">${label}</label>
                                <div style="color: #eee; line-height: 1.4; font-size: 0.95rem;">${displayVal}</div>
                            </div>
                        `;
                    }).join('');

                const descriptionTitle = isSessionNote ? 'Note di Sessione' : 'Descrizione';
                const descriptionContent = linkifyCampaignReferences(escapeHtml(item.summary || item.description || item.content || 'Nessuna descrizione presente.'));

                contentTarget.innerHTML = `
                    <div class="wiki-entry-fade-in">
                        <div class="note-viewer-header" style="border-bottom: 2px solid #742307; margin-bottom: 25px; padding-bottom: 10px;">
                            <h2 style="font-size: 2.8rem; color: #401101; margin: 0;">${escapeHtml(item.name || item.title)}</h2>
                            <span class="wiki-label" style="opacity: 0.8; text-transform: uppercase; letter-spacing: 1px;">${config.label}</span>
                        </div>

                        <div class="wiki-details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 30px;">
                            ${fieldsHTML}
                        </div>

                        <div style="background: rgba(116, 35, 7, 0.03); padding: 20px; border-left: 4px solid #742307; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                            <h3 class="wiki-label" style="margin-top: 0; font-size: 1.2rem;">${descriptionTitle}</h3>
                            <div class="npc-narrative-content" style="color: #000 !important; line-height: 1.6;">
                                ${descriptionContent.replace(/\n/g, '<br>')}
                            </div>
                        </div>

                        ${(item.secrets || item.secretNote || item.dmNotes) ? `
                            <div class="unrevealed-status" style="margin-top: 20px; padding: 20px; border: 1px dashed #742307; background: #fffcf5;">
                                <h3 class="wiki-label" style="margin-top: 0;">🕵️ Segreti e Note DM</h3>
                                <div style="color: #eee !important; font-style: italic;">
                                    ${linkifyCampaignReferences(escapeHtml(item.secrets || item.secretNote || item.dmNotes || '')).replace(/\n/g, '<br>')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `;
            }
            viewerElement.scrollTop = 0;
        };

        const renderList = () => {
            const searchTerm = searchInput.value.toLowerCase();
            let items = [];
            Object.keys(allData).forEach(section => {
                if (activeFilters.type !== 'Tutti' && section !== activeFilters.type) return;
                allData[section].forEach(item => {
                    if ((item.name || item.title || '').toLowerCase().includes(searchTerm)) {
                        items.push({ ...item, _section: section });
                    }
                });
            });
            if (activeFilters.rarity !== 'Tutti') items = items.filter(i => i.rarity === activeFilters.rarity);
            if (activeFilters.status !== 'Tutti') items = items.filter(i => i.status === activeFilters.status);
            items.sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0));

            listElement.innerHTML = items.length === 0 ? '<li style="padding: 20px; color: #999; text-align: center;">Nessun elemento trovato.</li>' :
                items.map(item => `<li class="wiki-item" data-id="${item.id}" data-section="${item._section}" style="padding: 12px; border-bottom: 1px solid #ddd; cursor: pointer;">
                    <div style="font-weight: bold; color: #401101;">${escapeHtml(item.name || item.title || 'Senza Titolo')}</div>
                    <small style="color: #777;">${typeLabels[item._section]}</small></li>`).join('');
        };

        const setupEventListeners = () => {
            searchInput.addEventListener('input', renderList);
            listElement.addEventListener('click', (e) => {
                const li = e.target.closest('.wiki-item');
                if (li) displayItem(li.dataset.section, li.dataset.id);
            });

            viewerElement.addEventListener('click', (e) => {
                const tag = e.target.closest('[data-section][data-id]');
                if (tag) {
                    e.preventDefault();
                    displayItem(tag.dataset.section, tag.dataset.id);
                }
            });

            const handleFilterClick = (e) => {
                const btn = e.target.closest('.wiki-section-tab');
                if (!btn) return;
                const filterType = btn.parentElement.id.replace('-filters', '');
                const filterValue = btn.dataset.filter;
                if (filterType === 'type') {
                    activeFilters.type = (activeFilters.type === filterValue) ? 'Tutti' : filterValue;
                    containerElement.querySelector('#rarity-filters').style.display = (activeFilters.type === 'uniqueItems') ? 'flex' : 'none';
                    containerElement.querySelector('#status-filters').style.display = (activeFilters.type === 'secrets' || activeFilters.type === 'factions') ? 'flex' : 'none';
                } else if (filterType === 'rarity') activeFilters.rarity = filterValue;
                else if (filterType === 'status') activeFilters.status = filterValue;
                
                createFilterButtons(typeFiltersBtnContainer, filterConfig.types, activeFilters.type, typeLabels);
                createFilterButtons(rarityFiltersBtnContainer, ['Tutti', ...filterConfig.uniqueItems.fields.rarity.values], activeFilters.rarity);
                createFilterButtons(statusFiltersBtnContainer, ['Tutti', ...Object.keys(statusLabels)], activeFilters.status);
                renderList();
            };

            [typeFiltersBtnContainer, rarityFiltersBtnContainer, statusFiltersBtnContainer].forEach(c => c?.addEventListener('click', handleFilterClick));
            
            containerElement.querySelector('#reset-filters-btn').addEventListener('click', () => {
                activeFilters = { type: 'Tutti', rarity: 'Tutti', status: 'Tutti' };
                createFilterButtons(typeFiltersBtnContainer, filterConfig.types, activeFilters.type, typeLabels);
                createFilterButtons(rarityFiltersBtnContainer, ['Tutti', ...filterConfig.uniqueItems.fields.rarity.values], activeFilters.rarity);
                createFilterButtons(statusFiltersBtnContainer, ['Tutti', ...Object.keys(statusLabels)], activeFilters.status);
                renderList();
            });
        };

        createFilterButtons(typeFiltersBtnContainer, filterConfig.types, activeFilters.type, typeLabels);
        createFilterButtons(rarityFiltersBtnContainer, ['Tutti', ...filterConfig.uniqueItems.fields.rarity.values], activeFilters.rarity);
        createFilterButtons(statusFiltersBtnContainer, ['Tutti', ...Object.keys(statusLabels)], activeFilters.status);
        renderList();
        setupEventListeners();
        
        // Se c'è un elemento da caricare, mostralo
        if (itemToLoad && itemToLoad.id && itemToLoad.section) {
            console.log(`📚 [CampaignWiki] Caricamento elemento: ${itemToLoad.section}/${itemToLoad.id}`);
            
            // Imposta il filtro corretto
            activeFilters.type = itemToLoad.section;
            createFilterButtons(typeFiltersBtnContainer, filterConfig.types, activeFilters.type, typeLabels);
            renderList();
            
            // Mostra l'elemento
            setTimeout(() => {
                displayItem(itemToLoad.section, itemToLoad.id);
                
                // Evidenzia l'elemento nella lista
                const listItem = listElement.querySelector(`[data-id="${itemToLoad.id}"]`);
                if (listItem) {
                    listItem.style.backgroundColor = '#fff3cd';
                    listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 50);
        }
    }
};

export default CampaignWiki;