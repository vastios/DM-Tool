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
            { id: 'campaignWiki', name: 'WIKI DELLA CAMPAGNA', modulePath: './modules/campagna/campaignWiki.js', requiresCampaign: true },
            { id: 'ChapterPlanner', name: 'PIANIFICATORE DI CAMPAGNA', modulePath: './modules/campagna/chapterPlanner.js', requiresCampaign: true },
            { id: 'session-notes', name: 'Note di Sessione', modulePath: './modules/campagna/sessionNotes.js', requiresCampaign: true }, 
        ],
        // SEZIONE: PERSONAGGI (NUOVA)
        characters: [
            { id: 'pgManager', name: 'PERSONAGGI GIOCANTI', modulePath: './modules/campagna/pg/index.js', requiresCampaign: true },
            { id: 'npcManager', name: 'PERSONAGGI NON GIOCANTI', modulePath: './modules/campagna/npcManager.js', requiresCampaign: true },
        ],
        // SEZIONE: IL MONDO (NUOVA)
        world: [
            { id: 'locationManager', name: 'LUOGHI', modulePath: './modules/campagna/locationManager.js', requiresCampaign: true },
            { id: 'factionManager', name: 'FAZIONI', modulePath: './modules/campagna/factionManager.js', requiresCampaign: true },
            { id: 'secretManager', name: 'SEGRETI', modulePath: './modules/campagna/secretManager.js', requiresCampaign: true },
            { id: 'uniqueItemManager', name: 'OGGETTI UNICI', modulePath: './modules/campagna/uniqueItemManager.js', requiresCampaign: true },
        ],
        // SEZIONE: STRUMENTI
        tools: [
            { id: 'encounterBuilder', name: 'COSTRUISCI INCONTRO', modulePath: './modules/campagna/encounterBuilder.js', requiresCampaign: true }, 
            { id: 'TravelManager', name: 'Gestione dei viaggi', modulePath: './modules/campagna/travelManager.js', requiresCampaign: true },
            { id: 'DungeonGenerator', name: 'Gestore dei dungeon', modulePath: './modules/campagna/dungeonGenerator.js', requiresCampaign: true },
        ],
        // SEZIONE: COMBATTI
        play: [
            { id: 'diceRoller', name: 'Lancia i dadi', modulePath: './modules/compendio/diceRoller.js', requiresCampaign: true },
            { id: 'combatGenerator', name: 'Generatore di combattimenti', modulePath: './modules/campagna/combatGenerator.js', requiresCampaign: true },
            { id: 'combatTracker', name: 'COMBAT TRACKER', modulePath: './modules/campagna/combatTracker.js', requiresCampaign: true },
        ],
        // SEZIONE: COMPENDIO
        compendium: [
            { id: 'monsterList', name: 'MOSTRI', modulePath: './modules/compendio/monsterList.js' }, 
            { id: 'spellList', name: 'INCANTESIMI', modulePath: './modules/compendio/spellList.js' },
            { id: 'itemList', name: 'OGGETTI', modulePath: './modules/compendio/itemList.js' }, 
            { id: 'magicItemList', name: 'OGGETTI MAGICI', modulePath: './modules/compendio/magicItemList.js', requiresCampaign: false },
            { id: 'classList', name: 'CLASSI', modulePath: './modules/compendio/classList.js' }, 
            { id: 'backgroundList', name: 'BACKGROUND', modulePath: './modules/compendio/backgroundList.js', requiresCampaign: false },
            { id: 'quickBuilder', name: 'CREAZIONE RAPIDA PG', modulePath: './modules/compendio/quickBuilder.js', requiresCampaign: false },
            { id: 'appendix', name: 'APPENDICE CONDIZIONI', modulePath: './modules/compendio/appendix.js' },
            { id: 'races', name: 'Razze', modulePath: './modules/compendio/raceList.js', requiresCampaign: false },
            { id: 'Alignment', name: 'Allineamento', modulePath: './modules/compendio/AlignmentGuide.js', requiresCampaign: false },
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
        const toolsTab = document.querySelector('.nav-tab[data-tab="tools"]'); 
        const playTab = document.querySelector('.nav-tab[data-tab="play"]');

        if (selectedCampaign) {
            if (campaignTab) {
                campaignTab.textContent = selectedCampaign.name;
                campaignTab.classList.remove('disabled');
            }
            if (charactersTab) charactersTab.classList.remove('disabled');
            if (worldTab) worldTab.classList.remove('disabled');
            if (toolsTab) toolsTab.classList.remove('disabled');
            if (playTab) playTab.classList.remove('disabled');
        } else {
            if (campaignTab) {
                campaignTab.textContent = 'Campagna';
                campaignTab.classList.add('disabled');
            }
            if (charactersTab) charactersTab.classList.add('disabled');
            if (worldTab) worldTab.classList.add('disabled');
            if (toolsTab) toolsTab.classList.add('disabled');
            if (playTab) playTab.classList.add('disabled');
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
            if (['campaign', 'characters', 'world', 'tools', 'play'].includes(activeMainTab)) {
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

        // Se siamo in una sezione diversa, cambia tab
        if (targetSection !== activeMainTab) {
            console.log(`🔄 [main.js] Cambio tab da ${activeMainTab} a ${targetSection}`);
            const targetTabButton = document.querySelector(`.nav-tab[data-tab="${targetSection}"]`);
            if (targetTabButton) {
                // Simula il click sul tab principale
                targetTabButton.click();
            }
        }

        // Passa un oggetto con id e section per il CampaignWiki
        pendingItemId = itemId ? { id: itemId, section: section } : null;
        activeSubTab = moduleId;
        
        // Piccolo delay per permettere il cambio tab di completarsi
        setTimeout(() => {
            const targetSubTab = subNavContainer.querySelector(`.sub-tab[data-sub-tab="${moduleId}"]`);
            if (targetSubTab) {
                targetSubTab.click();
            } else {
                console.error(`❌ [main.js] Sub-tab non trovato: ${moduleId}`);
            }
        }, targetSection !== activeMainTab ? 100 : 0);
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
            activeSubTab = toolConfig[activeMainTab][0].id;
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
});

function updateDisabledTabs() {
    const campaignTabs = document.querySelectorAll('.nav-tab[data-tab="campaign"], .nav-tab[data-tab="characters"], .nav-tab[data-tab="world"], .nav-tab[data-tab="tools"], .nav-tab[data-tab="play"]');
    const isCampaignSelected = !!getCurrentCampaignId();
    campaignTabs.forEach(tab => {
        isCampaignSelected ? tab.classList.remove('disabled') : tab.classList.add('disabled');
    });
}

window.updateDisabledTabs = updateDisabledTabs;
updateDisabledTabs();