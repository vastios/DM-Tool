//../js/main.js

// La funzione linkifyConditions è stata spostata in utils/htmlHelpers.js per evitare duplicazioni.
// I moduli ora la importeranno direttamente da lì.

// --- Import delle funzioni per la gestione delle campagne ---
import { getCampaignsList, createCampaign, deleteCampaign, selectCampaign, getCurrentCampaignId, getState } from '../stateManager.js';
import {setLastViewedWikiElement, getLastViewedWikiElement} from '../stateManager.js';
import { showToast } from '../utils/toast.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("🟢 DEBUG: Applicazione avviata.");

    const mainTabs = document.querySelectorAll('.nav-tab');
    const subNavContainer = document.querySelector('.sub-nav');
    const contentArea = document.querySelector('.content-area');
    
    // --- Riferimenti agli elementi del DOM per la gestione delle campagne ---
    const campaignSelector = document.getElementById('campaign-selector');
    const newCampaignBtn = document.getElementById('new-campaign-btn');
    const deleteCampaignBtn = document.getElementById('delete-campaign-btn');

    // --- VARIABILI DI STATO DELL'INTERFACCIA ---
    let activeMainTab = 'home';
    let activeSubTab = 'campaignWiki';

    // --- VARIABILE PER LA GESTIONE DEL CICLO DI VITA DEI MODULI ---
    // Mantiene un riferimento all'istanza del modulo corrente (es. PgManager)
    // per poterla distruggere quando se ne carica uno nuovo.
    let currentModuleInstance = null;

    const toolConfig = {
        // SEZIONE: CAMPAGNA
        campaign: [
            { id: 'campaignWiki', name: 'Wiki della Campagna', modulePath: './modules/campagna/campaignWiki.js', requiresCampaign: true },
            { id: 'ChapterPlanner', name: 'Pianificatore di Campagna', modulePath: './modules/campagna/chapterPlanner.js', requiresCampaign: true },
            { id: 'session-notes', name: 'Note di Sessione', modulePath: './modules/campagna/sessionNotes.js', requiresCampaign: true }, 
        ],
        // SEZIONE: PERSONAGGI
        characters: [
            { id: 'quickBuilder', name: 'Creazione Rapida', modulePath: './modules/compendio/quickBuilder.js', requiresCampaign: false },
            { id: 'pgManager', name: 'Personaggi Giocanti', modulePath: './modules/campagna/pg/index.js', requiresCampaign: true, entityType: 'pg' },
            { id: 'npcManager', name: 'Personaggi Non Giocanti', modulePath: './modules/campagna/npcManager.js', requiresCampaign: true, entityType: 'npc' },
        ],
        // SEZIONE: IL MONDO
        world: [
            { id: 'locationManager', name: 'Luoghi', modulePath: './modules/campagna/locationManager.js', requiresCampaign: true, entityType: 'location' },
            { id: 'factionManager', name: 'Fazioni', modulePath: './modules/campagna/factionManager.js', requiresCampaign: true, entityType: 'faction' },
            { id: 'secretManager', name: 'Segreti', modulePath: './modules/campagna/secretManager.js', requiresCampaign: true, entityType: 'secret' },
            { id: 'uniqueItemManager', name: 'Oggetti Unici', modulePath: './modules/campagna/uniqueItemManager.js', requiresCampaign: true, entityType: 'uniqueItem' },
        ],
        // SEZIONE: COMBATTIMENTO
        combat: [
            { id: 'encounterBuilder', name: 'Costruisci Incontro', modulePath: './modules/campagna/encounterBuilder.js', requiresCampaign: true }, 
            { id: 'combatGenerator', name: 'Generatore di Combattimenti', modulePath: './modules/campagna/combatGenerator.js', requiresCampaign: true },
            { id: 'combatTracker', name: 'Combat Tracker', modulePath: './modules/campagna/combatTracker.js', requiresCampaign: true },
            { id: 'diceRoller', name: 'Lancia i Dadi', modulePath: './modules/compendio/diceRoller.js', requiresCampaign: false },
        ],
        // SEZIONE: ESPLORAZIONE
        exploration: [
            { id: 'TravelManager', name: 'Viaggi', modulePath: './modules/campagna/travelManager.js', requiresCampaign: true },
            { id: 'DungeonGenerator', name: 'Generatore Dungeon', modulePath: './modules/campagna/dungeonGenerator.js', requiresCampaign: true },
        ],
        // SEZIONE: COMPENDIO
        compendium: [
            { id: 'races', name: 'Razze', modulePath: './modules/compendio/raceList.js', requiresCampaign: false },
            { id: 'classList', name: 'Classi', modulePath: './modules/compendio/classList.js' }, 
            { id: 'backgroundList', name: 'Background', modulePath: './modules/compendio/backgroundList.js', requiresCampaign: false },
            { id: 'monsterList', name: 'Mostri', modulePath: './modules/compendio/monsterList.js' }, 
            { id: 'spellList', name: 'Incantesimi', modulePath: './modules/compendio/spellList.js' },
            { id: 'itemList', name: 'Oggetti', modulePath: './modules/compendio/itemList.js' }, 
            { id: 'magicItemList', name: 'Oggetti Magici', modulePath: './modules/compendio/magicItemList.js', requiresCampaign: false },
            { id: 'appendix', name: 'Condizioni', modulePath: './modules/compendio/appendix.js' },
            { id: 'Alignment', name: 'Allineamento', modulePath: './modules/compendio/AlignmentGuide.js', requiresCampaign: false },
            { id: 'combatRules', name: 'Regole di Combattimento', modulePath: './modules/compendio/combatRules.js', requiresCampaign: false },
        ]
    };

    function updateMainTabsUI() {
        const campaigns = getCampaignsList();
        const currentCampaignId = getCurrentCampaignId();
        const selectedCampaign = campaigns.find(c => c.id === currentCampaignId);

        // Ricerca sicura dei tab ogni volta
        const campaignTab = document.querySelector('.nav-tab[data-tab="campaign"]');
        const charactersTab = document.querySelector('.nav-tab[data-tab="characters"]');
        const worldTab = document.querySelector('.nav-tab[data-tab="world"]');
        const combatTab = document.querySelector('.nav-tab[data-tab="combat"]'); 
        const explorationTab = document.querySelector('.nav-tab[data-tab="exploration"]');

        if (selectedCampaign) {
            if (campaignTab) {
                campaignTab.textContent = selectedCampaign.name;
                campaignTab.classList.remove('disabled');
            }
            if (charactersTab) charactersTab.classList.remove('disabled');
            if (worldTab) worldTab.classList.remove('disabled');
            if (combatTab) combatTab.classList.remove('disabled');
            if (explorationTab) explorationTab.classList.remove('disabled');
        } else {
            if (campaignTab) {
                campaignTab.textContent = 'Campagna';
                campaignTab.classList.add('disabled');
            }
            if (charactersTab) charactersTab.classList.add('disabled');
            if (worldTab) worldTab.classList.add('disabled');
            if (combatTab) combatTab.classList.add('disabled');
            if (explorationTab) explorationTab.classList.add('disabled');
        }
    }

    // --- FUNZIONI CAMPAGNA ---
    function populateCampaignSelector() {
        const campaigns = getCampaignsList();
        campaignSelector.innerHTML = '<option value="">Seleziona o crea una campagna...</option>';
        if (campaigns.length === 0) {
            campaignSelector.value = "";
            updateCampaignUI();
            updateMainTabsUI();
            return;
        }
        campaigns.forEach(campaign => {
            const option = document.createElement('option');
            option.value = campaign.id;
            option.textContent = campaign.name;
            campaignSelector.appendChild(option);
        });
        const lastSelectedCampaignId = localStorage.getItem('lastSelectedCampaignId');
        if (lastSelectedCampaignId && campaigns.find(c => c.id === lastSelectedCampaignId)) {
            campaignSelector.value = lastSelectedCampaignId;
            selectCampaign(lastSelectedCampaignId);
        } else {
            const firstCampaignId = campaigns[0].id;
            campaignSelector.value = firstCampaignId;
            selectCampaign(firstCampaignId);
        }
        updateCampaignUI();
        updateMainTabsUI();
    }

    function updateCampaignUI() {
        const hasSelection = !!campaignSelector.value;
        deleteCampaignBtn.disabled = !hasSelection;
    }

    function handleCampaignChange() {
        const selectedId = campaignSelector.value;
        if (selectedId) {
            selectCampaign(selectedId);
            localStorage.setItem('lastSelectedCampaignId', selectedId);
            const campaignName = campaignSelector.options[campaignSelector.selectedIndex].text;
            showToast(`Campagna "${campaignName}" selezionata.`, 'info');
            if (['campaign', 'characters', 'world', 'combat', 'exploration'].includes(activeMainTab)) {
                updateContent();
            }
        } else {
            updateCampaignUI();
        }
        updateMainTabsUI();
    }

    function handleNewCampaign() {
        const name = prompt("Inserisci il nome per la nuova campagna:");
        if (name && name.trim() !== '') {
            createCampaign(name.trim());
            populateCampaignSelector();
        } else if (name !== null) {
            showToast("Il nome della campagna non può essere vuoto.", 'error');
        }
    }

    function handleDeleteCampaign() {
        const selectedId = campaignSelector.value;
        if (selectedId) {
            deleteCampaign(selectedId);
            populateCampaignSelector();
        }
    }

    function toggleMainContent(showMain) {
        if (showMain) {
            document.getElementById('home-container').classList.add('hidden');
            document.getElementById('main-content').classList.remove('hidden');
        } else {
            document.getElementById('home-container').classList.remove('hidden');
            document.getElementById('main-content').classList.add('hidden');
        }
    }

    function showSubTabs(mainTabId) {
        subNavContainer.innerHTML = '';
        if (mainTabId === 'home') return;
        const tools = toolConfig[mainTabId];
        if (!tools) return;
        tools.forEach(tool => {
            const button = document.createElement('button');
            button.className = 'sub-tab';
            button.textContent = tool.name;
            button.dataset.subTab = tool.id;
            // Aggiungi data-entity-type se il tool ha un tipo di entità associato
            if (tool.entityType) {
                button.dataset.entityType = tool.entityType;
            }
            if (tool.id === activeSubTab) button.classList.add('active');
            subNavContainer.appendChild(button);
        });
    }

    // --- FUNZIONE DI CARICAMENTO MODULI (CON DEBUG AGGIUNTIVO) ---
    async function loadModule(modulePath, containerElement, itemToLoad = null) {
        console.log(`🚀 [main.js] Inizio caricamento modulo: ${modulePath}`);
        try {
            // 1. Pulisce il contenitore e distrugge il modulo precedente
            containerElement.innerHTML = '';
            if (currentModuleInstance && typeof currentModuleInstance.destroy === 'function') {
                console.log('🧹 [main.js] Distruzione del modulo precedente...');
                currentModuleInstance.destroy();
            }
            currentModuleInstance = null;

            console.log(`📦 [main.js] Import dinamico del modulo: ${modulePath}`);
            const module = await import(modulePath);
            const ModuleExport = module.default || module;
            console.log(`🔍 [main.js] Esportazione trovata:`, ModuleExport);

            // 2. Controlla se l'esportazione è una CLASSE (nuovo pattern)
            if (typeof ModuleExport === 'function' && ModuleExport.prototype) {
                console.log(`🏗️ [main.js] Rilevato modulo di tipo CLASSE.`);
                const fullState = getState();
                const dataForModule = { ...fullState, selectedId: itemToLoad };
                console.log(`🏗️ [main.js] Dati per il modulo:`, dataForModule);
                console.log(`🏗️ [main.js] Istanziazione del modulo...`);
                currentModuleInstance = new ModuleExport(containerElement, dataForModule);
                console.log(`✅ [main.js] Modulo classe istanziato con successo.`);
                
                // Controlla se il modulo ha un metodo render() e invocalo
                if (currentModuleInstance.render && typeof currentModuleInstance.render === 'function') {
                    console.log(`✅ [main.js] Metodo render() trovato nell'istanza. Invocazione...`);
                    currentModuleInstance.render();
                } else {
                    console.error(`❌ [main.js] Errore: L'istanza della classe ${modulePath} non ha un metodo render().`);
                    containerElement.innerHTML = `<p style="color: red;">Errore: Il modulo ${modulePath} non ha un metodo render().</p>`;
                }

            } 
            // 3. Controlla se l'esportazione è un OGGETTO con un metodo render (vecchio pattern)
            else if (ModuleExport && typeof ModuleExport.render === 'function') {
                console.log(`🎨 [main.js] Rilevato modulo di tipo OGGETTO.`);
                console.log(`🎨 [main.js] Invocazione di ModuleExport.render(...).`);
                ModuleExport.render(containerElement, itemToLoad);
                console.log(`✅ [main.js] Modulo oggetto renderizzato con successo.`);
            } 
            // 4. Se non è nessuno dei due, lancia un errore
            else {
                const errorMsg = `Il modulo in ${modulePath} non esporta né una classe né un oggetto con un metodo render() valido.`;
                console.error(`❌ [main.js] Errore: ${errorMsg}`);
                console.error(`'typeof ModuleExport' è:`, typeof ModuleExport);
                console.error(`'ModuleExport.prototype' esiste?`, !!ModuleExport.prototype);
                console.error(`'typeof ModuleExport.render' è:`, typeof ModuleExport.render);
                throw new Error(errorMsg);
            }
            
        } catch (error) {
            console.error(`❌ ERRORE GENERICO nel caricamento del modulo ${modulePath}:`, error);
            containerElement.innerHTML = `<div class="error-msg"><strong>Errore Critico:</strong> ${error.message}</div>`;
        }
    }

    // Variabile temporanea per passare l'ID tra l'evento e l'update
    let pendingItemId = null;
    
    /**
     * Variabile per salvare il sub-tab target quando si cambia tab principale.
     * Necessario perché handleMainTabClick resetta activeSubTab al primo elemento.
     */
    let pendingSubTab = null;

    /**
     * Trova in quale sezione si trova un modulo.
     * @param {string} moduleId - L'ID del modulo da cercare
     * @returns {string|null} - La sezione (es. 'characters', 'world') o null se non trovato
     */
    function findModuleSection(moduleId) {
        for (const [section, tools] of Object.entries(toolConfig)) {
            if (tools.some(tool => tool.id === moduleId)) {
                return section;
            }
        }
        return null;
    }

    // --- EVENT LISTENER GLOBALE PER COMUNICAZIONE TRA MODULI ---
    document.addEventListener('openModuleWithItem', (e) => {
        const { moduleId, itemId, section } = e.detail;
        
        if (!moduleId) {
            console.error('❌ [main.js] moduleId mancante nell\'evento openModuleWithItem');
            return;
        }

        // Cerca in quale sezione si trova il modulo
        const targetSection = findModuleSection(moduleId);
        if (!targetSection) {
            console.error(`❌ [main.js] Modulo non trovato in nessuna sezione: ${moduleId}`);
            return;
        }

        console.log(`🔗 [main.js] Trovato modulo ${moduleId} in sezione ${targetSection}`);

        // Imposta pendingItemId E pendingSubTab PRIMA di qualsiasi altra operazione
        // Questo è critico per evitare race condition
        pendingItemId = itemId ? { id: itemId, section: section } : null;
        pendingSubTab = moduleId;
        
        // Se siamo in una sezione diversa, cambia tab
        if (targetSection !== activeMainTab) {
            console.log(`🔄 [main.js] Cambio tab da ${activeMainTab} a ${targetSection}`);
            const targetTabButton = document.querySelector(`.nav-tab[data-tab="${targetSection}"]`);
            if (targetTabButton) {
                // Il click chiamerà handleMainTabClick che ora controlla pendingSubTab
                targetTabButton.click();
                // Il cambio tab è gestito, non serve il setTimeout per il sub-tab
                return;
            }
        }

        // Se siamo già nel tab corretto, cambia solo il sub-tab
        activeSubTab = moduleId;
        
        // Piccolo delay per permettere eventuali operazioni pending di completarsi
        setTimeout(() => {
            const targetSubTab = subNavContainer.querySelector(`.sub-tab[data-sub-tab="${moduleId}"]`);
            if (targetSubTab) {
                targetSubTab.click();
            } else {
                console.error(`❌ [main.js] Sub-tab non trovato: ${moduleId}`);
            }
        }, 50); // Delay fisso di 50ms per evitare race condition
    });

    function updateContent() {
        if (activeMainTab === 'home') return;

        const tools = toolConfig[activeMainTab];
        if (!tools) return;
        
        const activeTool = tools.find(tool => tool.id === activeSubTab);
        if (!activeTool) return;

        if (activeTool.requiresCampaign && !getCurrentCampaignId()) {
            contentArea.innerHTML = `<div style="text-align: center; margin-top: 3rem; color: #888;"><h3>Nessuna Campagna Selezionata</h3></div>`;
            pendingItemId = null;
            return;
        }

        // Controlla se c'è un itemId in attesa di essere caricato
        if (pendingItemId !== null) {
            const itemIdToLoad = pendingItemId;
            pendingItemId = null;
            loadModule(activeTool.modulePath, contentArea, itemIdToLoad);
        } else {
            loadModule(activeTool.modulePath, contentArea);
        }
    }

    function handleMainTabClick(tabElement) {
        if (updateDisabledTabs()) {
            showToast("Devi prima selezionare una campagna per accedere a questa sezione.", 'warning');
            return;
        }
        document.querySelector('.nav-tab.active')?.classList.remove('active');
        tabElement.classList.add('active');
        activeMainTab = tabElement.dataset.tab;

        if (toolConfig[activeMainTab] && toolConfig[activeMainTab].length > 0) {
            // Se c'è un pendingSubTab per questa sezione, usalo invece del default
            if (pendingSubTab && toolConfig[activeMainTab].some(tool => tool.id === pendingSubTab)) {
                activeSubTab = pendingSubTab;
                pendingSubTab = null; // Reset dopo l'uso
            } else {
                activeSubTab = toolConfig[activeMainTab][0].id;
            }
        }

        if (activeMainTab === 'home') {
            toggleMainContent(false);
            subNavContainer.classList.add('hidden');
        } else {
            toggleMainContent(true);
            subNavContainer.classList.remove('hidden');
            showSubTabs(activeMainTab);
            updateContent();
        }
    }

    function handleSubTabClick(event) {
        const clickedTab = event.target.closest('.sub-tab');
        if (clickedTab) {
            document.querySelector('.sub-tab.active')?.classList.remove('active');
            clickedTab.classList.add('active');
            activeSubTab = clickedTab.dataset.subTab;
            updateContent();
        }
    }

    // --- EVENT LISTENER ---
    mainTabs.forEach(tab => tab.addEventListener('click', () => handleMainTabClick(tab)));
    subNavContainer.addEventListener('click', handleSubTabClick);
    campaignSelector.addEventListener('change', handleCampaignChange);
    newCampaignBtn.addEventListener('click', handleNewCampaign);
    deleteCampaignBtn.addEventListener('click', handleDeleteCampaign);

    populateCampaignSelector();
    toggleMainContent(false);
});

// --- TOOLTIP CONDIZIONI (MANUTENZIONE INTEGRALE) ---
document.body.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('condition-link')) {
        const name = e.target.dataset.name;
        const desc = e.target.dataset.desc;
        const existingTooltip = document.querySelector('.ability-tooltip');
        if (event.target.classList.contains('condition-link')) existingTooltip.remove();

        const tooltip = document.createElement('div');
        tooltip.className = 'ability-tooltip condition-tooltip';
        tooltip.innerHTML = `<h4>${name}</h4><p>${desc}</p>`;
        document.body.appendChild(tooltip);

        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
        tooltip.style.opacity = '1';
    }
});

document.body.addEventListener('mouseout', (e) => {
    if (e.target.classList.contains('condition-link')) {
        const tooltip = document.querySelector('.ability-tooltip');
        if (tooltip) tooltip.remove();
    }
});

// --- LOGICA CROSS-REFERENCING (LINK CAMPAGNA) ---
// Tutti i link puntano al CampaignWiki per visualizzare l'elemento
document.body.addEventListener('click', (e) => {
    const campaignLink = e.target.closest('.campaign-link');
    if (campaignLink) {
        e.preventDefault();
        e.stopPropagation();
        
        const { id, section } = campaignLink.dataset;
        const linkName = campaignLink.textContent;
        
        console.log(`🔗 [main.js] Click su link campagna: ${linkName} (${section}/${id})`);

        // Tutti i link aprono il CampaignWiki che mostrerà l'elemento
        const event = new CustomEvent('openModuleWithItem', {
            detail: { moduleId: 'campaignWiki', itemId: id, section: section }
        });
        document.dispatchEvent(event);
    }
    
    // Gestione click su link incantesimi
    const spellLink = e.target.closest('.spell-link');
    if (spellLink) {
        e.preventDefault();
        e.stopPropagation();
        
        const spellName = spellLink.dataset.spellName;
        
        console.log(`🔮 [main.js] Click su link incantesimo: ${spellName}`);

        // Apri il compendio incantesimi con l'incantesimo selezionato
        const event = new CustomEvent('openModuleWithItem', {
            detail: { moduleId: 'spellList', itemId: spellName, section: null }
        });
        document.dispatchEvent(event);
    }
});

function updateDisabledTabs() {
    const campaignTabs = document.querySelectorAll('.nav-tab[data-tab="campaign"], .nav-tab[data-tab="characters"], .nav-tab[data-tab="world"], .nav-tab[data-tab="combat"], .nav-tab[data-tab="exploration"]');
    const isCampaignSelected = !!getCurrentCampaignId();
    campaignTabs.forEach(tab => {
        isCampaignSelected ? tab.classList.remove('disabled') : tab.classList.add('disabled');
    });
}

window.updateDisabledTabs = updateDisabledTabs;
updateDisabledTabs();