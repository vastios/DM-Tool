/**
 * DungeonGenerator - Entry Point
 * ─────────────────────────────────────────────────────────────
 * Generatore di mappe procedurali usando Wave Function Collapse.
 * 
 * Moduli:
 * - WFCEngine: Algoritmo WFC per generazione
 * - TileDatabase: Gestione tiles e constraints
 * - MapRenderer: Rendering visivo
 * - EncounterGenerator: Incontri e tesori
 * 
 * @version 2.0.0 - WFC-based generation
 */

import { WFCEngine } from './WFCEngine.js';
import { TileDatabase } from './TileDatabase.js';
import { MapRenderer } from './MapRenderer.js';
import { EncounterGenerator } from './EncounterGenerator.js';
import { monsterDatabase } from '../../../../database/monsterDatabase.js';
import { showToast } from '../../../../utils/toast.js';
import { getCurrentCampaignId } from '../../../../stateManager.js';

// ═══════════════════════════════════════════════════════════════
// CONFIGURAZIONE BIOMI
// ═══════════════════════════════════════════════════════════════

const BIOME_CONFIG = {
    foresta: {
        name: 'Foresta',
        tilesPath: 'ASSET/TILES/FORESTA/',
        tilesJson: 'ASSET/TILES/FORESTA/tiles.json'
    }
    // Futuri biomi:
    // dungeon: { ... },
    // citta: { ... }
};

// ═══════════════════════════════════════════════════════════════
// MODULO PRINCIPALE
// ═══════════════════════════════════════════════════════════════

const DungeonGenerator = {
    // Stato
    state: {
        currentBiome: 'foresta',
        gridSize: 5,
        partyLevel: 1,
        grid: null,
        encounters: [],
        treasures: [],
        description: ''
    },

    // Istanze moduli
    wfcEngine: null,
    tileDatabase: null,
    mapRenderer: null,
    encounterGenerator: null,
    container: null,

    // ═══════════════════════════════════════════════════════════════
    // RENDER PRINCIPALE
    // ═══════════════════════════════════════════════════════════════

    render(containerElement) {
        this.container = containerElement;
        
        // Inizializza moduli
        this.initializeModules();
        
        // Render UI
        containerElement.innerHTML = this.getMainHTML();
        
        // Bind eventi
        this.bindEvents();
        
        // Carica database tiles
        this.loadTilesDatabase();
    },

    /**
     * Inizializza i moduli
     */
    initializeModules() {
        this.tileDatabase = new TileDatabase();
        this.mapRenderer = new MapRenderer();
        this.encounterGenerator = new EncounterGenerator();
    },

    /**
     * Carica il database dei tiles
     */
    async loadTilesDatabase() {
        const biomeConfig = BIOME_CONFIG[this.state.currentBiome];
        
        try {
            await this.tileDatabase.load(biomeConfig.tilesJson);
            
            // Configura altri moduli
            this.mapRenderer.configure({
                tileDatabase: this.tileDatabase,
                tilesPath: biomeConfig.tilesPath
            });
            
            this.encounterGenerator.configure({
                monsterDatabase: monsterDatabase,
                tileDatabase: this.tileDatabase,
                biomeConfig: this.tileDatabase.getBiomeConfig()
            });
            
            console.log('✅ [DungeonGenerator] Moduli inizializzati');
            
        } catch (error) {
            console.error('❌ [DungeonGenerator] Errore caricamento:', error);
            showToast('Errore nel caricamento dei tiles', 'error');
        }
    },

    /**
     * HTML principale
     */
    getMainHTML() {
        return `
            <div class="dg-container-v2">
                <!-- Header Controls -->
                <div class="dg-header">
                    <h2>🗺️ Generatore Mappe WFC</h2>
                    <div class="dg-controls">
                        <div class="control-group">
                            <label>Bioma:</label>
                            <select id="dg-biome">
                                <option value="foresta">🌲 Foresta</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Dimensione:</label>
                            <select id="dg-size">
                                <option value="5">5×5 (Piccola)</option>
                                <option value="7">7×7 (Media)</option>
                                <option value="10">10×10 (Grande)</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Livello Party:</label>
                            <input type="number" id="dg-party-level" value="${this.state.partyLevel}" min="1" max="20" style="width: 60px;">
                        </div>
                        <button id="dg-generate" class="btn-primary">
                            ⚡ Genera Mappa
                        </button>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="dg-main">
                    <!-- Map Display -->
                    <div class="dg-map-section">
                        <div class="dg-map-container" id="dg-map-container">
                            <div class="wfc-placeholder">
                                <div class="wfc-placeholder-icon">🗺️</div>
                                <p>Clicca <strong>"Genera Mappa"</strong> per creare una nuova area</p>
                                <p class="wfc-placeholder-hint">L'algoritmo WFC genera mappe coerenti con sentieri collegati, fiumi continui e posizioni logiche</p>
                            </div>
                        </div>
                    </div>

                    <!-- Info Panel -->
                    <div class="dg-info-panel">
                        <div class="dg-card">
                            <h3>📋 Dettagli Area</h3>
                            <div id="dg-area-info">
                                <p class="text-muted">Nessuna mappa generata</p>
                            </div>
                        </div>

                        <div class="dg-card">
                            <h3>⚔️ Incontri (<span id="dg-encounter-count">0</span>)</h3>
                            <div id="dg-encounters">
                                <p class="text-muted">Nessun incontro</p>
                            </div>
                        </div>

                        <div class="dg-card">
                            <h3>💎 Tesori (<span id="dg-treasure-count">0</span>)</h3>
                            <div id="dg-treasures">
                                <p class="text-muted">Nessun tesoro</p>
                            </div>
                        </div>

                        <div class="dg-card">
                            <h3>💾 Esporta</h3>
                            <div class="dg-export-btns">
                                <button id="dg-export-image" class="btn-secondary" disabled>📷 Immagine</button>
                                <button id="dg-export-json" class="btn-secondary" disabled>📄 JSON</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Legend -->
                <div class="dg-legend">
                    <span class="legend-item"><span class="legend-dot" style="background:#4CAF50"></span> Passabile</span>
                    <span class="legend-item"><span class="legend-dot" style="background:#f44336"></span> Ostacolo</span>
                    <span class="legend-item"><span class="legend-dot" style="background:#2196F3"></span> Acqua</span>
                    <span class="legend-item"><span class="legend-dot" style="background:#FF9800"></span> Tesoro</span>
                    <span class="legend-item"><span class="legend-dot" style="background:#9C27B0"></span> Incontro</span>
                </div>
            </div>
        `;
    },

    // ═══════════════════════════════════════════════════════════════
    // EVENTI
    // ═══════════════════════════════════════════════════════════════

    bindEvents() {
        // Genera mappa
        this.container.querySelector('#dg-generate').onclick = () => this.generateMap();

        // Cambio bioma
        this.container.querySelector('#dg-biome').onchange = async (e) => {
            this.state.currentBiome = e.target.value;
            await this.loadTilesDatabase();
        };

        // Cambio dimensione
        this.container.querySelector('#dg-size').onchange = (e) => {
            this.state.gridSize = parseInt(e.target.value);
        };

        // Cambio livello party
        this.container.querySelector('#dg-party-level').onchange = (e) => {
            this.state.partyLevel = parseInt(e.target.value) || 1;
        };

        // Click su tile
        this.container.querySelector('#dg-map-container').addEventListener('tileClick', (e) => {
            this.handleTileClick(e.detail);
        });

        // Click su inizia combattimento
        this.container.querySelector('#dg-encounters').onclick = (e) => {
            const btn = e.target.closest('.btn-start-combat');
            if (btn) {
                this.startCombat(btn.dataset.encounterId);
            }
        };

        // Export JSON
        this.container.querySelector('#dg-export-json').onclick = () => this.exportJSON();

        // Export Image
        this.container.querySelector('#dg-export-image').onclick = () => this.exportImage();
    },

    /**
     * Handler click su tile
     */
    handleTileClick(detail) {
        const { x, y, tileId, tile, encounter, treasure } = detail;
        
        let info = `<strong>${tile?.name || tileId}</strong>`;
        info += `<br><em>${tile?.description || ''}</em>`;
        info += `<br>Posizione: (${x}, ${y})`;
        info += `<br>Passabile: ${tile?.passable ? '✅' : '❌'}`;
        info += `<br>Categoria: ${tile?.category || 'N/A'}`;
        
        if (encounter) {
            info += `<br><br>⚔️ <strong>${encounter.monster.name} x${encounter.count}</strong>`;
            info += `<br>CR ${encounter.cr} | ${encounter.xp} XP | ${encounter.difficulty}`;
        }
        
        if (treasure) {
            info += `<br><br>💎 <strong>${treasure.name}${treasure.details}</strong>`;
            info += `<br>${treasure.description}`;
        }
        
        showToast(info, 'info');
    },

    // ═══════════════════════════════════════════════════════════════
    // GENERAZIONE
    // ═══════════════════════════════════════════════════════════════

    /**
     * Genera una nuova mappa
     */
    async generateMap() {
        if (!this.tileDatabase.isLoaded()) {
            showToast('Tiles non ancora caricati, attendere...', 'warning');
            return;
        }

        const size = this.state.gridSize;
        const partyLevel = this.state.partyLevel;

        console.log(`🗺️ [DungeonGenerator] Generazione mappa ${size}×${size} con WFC...`);

        try {
            // Crea WFC Engine
            this.wfcEngine = new WFCEngine(this.tileDatabase, {
                width: size,
                height: size,
                maxRetries: 15
            });

            // Genera mappa
            const startTime = performance.now();
            this.state.grid = this.wfcEngine.generate();
            const endTime = performance.now();

            console.log(`⏱️ [DungeonGenerator] Generazione completata in ${(endTime - startTime).toFixed(2)}ms`);
            console.log(`🔄 [DungeonGenerator] Tentativi: ${this.wfcEngine.generationAttempts}`);

            // Genera incontri
            this.state.encounters = this.encounterGenerator.generateEncounters(
                this.state.grid, 
                partyLevel
            );

            // Genera tesori
            this.state.treasures = this.encounterGenerator.generateTreasures(
                this.state.grid,
                partyLevel
            );

            // Genera descrizione
            this.state.description = this.generateDescription();

            // Renderizza
            this.renderMap();
            this.renderInfoPanel();

            // Abilita export
            this.container.querySelector('#dg-export-image').disabled = false;
            this.container.querySelector('#dg-export-json').disabled = false;

            showToast(`Mappa ${size}×${size} generata! (${this.state.encounters.length} incontri)`, 'success');

        } catch (error) {
            console.error('❌ [DungeonGenerator] Errore generazione:', error);
            showToast(`Errore nella generazione: ${error.message}`, 'error');
        }
    },

    /**
     * Renderizza la mappa
     */
    renderMap() {
        const mapContainer = this.container.querySelector('#dg-map-container');
        const biomeConfig = BIOME_CONFIG[this.state.currentBiome];

        this.mapRenderer.configure({
            tileDatabase: this.tileDatabase,
            tilesPath: biomeConfig.tilesPath
        });

        this.mapRenderer.render(mapContainer, this.state.grid, {
            encounters: this.state.encounters,
            treasures: this.state.treasures
        });
    },

    /**
     * Renderizza il pannello info
     */
    renderInfoPanel() {
        // Area Info
        const areaInfo = this.container.querySelector('#dg-area-info');
        const biomeConfig = BIOME_CONFIG[this.state.currentBiome];
        
        areaInfo.innerHTML = `
            <p class="area-description">${this.state.description}</p>
            <div class="area-stats">
                <span>📐 Dimensione: ${this.state.gridSize}×${this.state.gridSize}</span>
                <span>🌲 Bioma: ${biomeConfig.name}</span>
                <span>🎯 Tentativi WFC: ${this.wfcEngine?.generationAttempts || 1}</span>
            </div>
        `;

        // Encounters
        const encountersDiv = this.container.querySelector('#dg-encounters');
        this.container.querySelector('#dg-encounter-count').textContent = this.state.encounters.length;

        if (this.state.encounters.length > 0) {
            encountersDiv.innerHTML = this.state.encounters.map(enc => `
                <div class="encounter-item" data-encounter-id="${enc.id}">
                    <span class="encounter-name">${enc.monster.name} ×${enc.count}</span>
                    <span class="encounter-cr">CR ${enc.cr}</span>
                    <span class="encounter-xp">${enc.xp} XP</span>
                    <span class="encounter-difficulty ${enc.difficulty.toLowerCase()}">${enc.difficulty}</span>
                    <button class="btn-start-combat" data-encounter-id="${enc.id}" title="Inizia combattimento">⚔️</button>
                </div>
            `).join('');
        } else {
            encountersDiv.innerHTML = '<p class="text-muted">Nessun incontro</p>';
        }

        // Treasures
        const treasuresDiv = this.container.querySelector('#dg-treasures');
        this.container.querySelector('#dg-treasure-count').textContent = this.state.treasures.length;

        if (this.state.treasures.length > 0) {
            treasuresDiv.innerHTML = this.state.treasures.map(t => `
                <div class="treasure-item">
                    <span class="treasure-name">${t.name}${t.details}</span>
                    <span class="treasure-type">${t.type}</span>
                </div>
            `).join('');
        } else {
            treasuresDiv.innerHTML = '<p class="text-muted">Nessun tesoro</p>';
        }
    },

    /**
     * Genera descrizione testuale
     */
    generateDescription() {
        const biomeConfig = BIOME_CONFIG[this.state.currentBiome];
        const biomeInfo = this.tileDatabase.getBiomeConfig();
        
        const descriptions = [
            'Una fitta foresta si estende davanti a voi, i raggi del sole filtrano tra le fronde.',
            'Il terreno è coperto da un tappeto di foglie che scricchiolano sotto i vostri passi.',
            'L\'aria è fresca e profumata di resina e terriccio umido.',
            'Sentieri tortuosi si snodano tra gli alberi secolari.',
            'Un ruscello gorgoglia nelle vicinanze.'
        ];

        const selected = descriptions.sort(() => 0.5 - Math.random()).slice(0, 2);
        return `${biomeInfo?.description || biomeConfig.name}. ${selected.join(' ')}`;
    },

    // ═══════════════════════════════════════════════════════════════
    // AZIONI
    // ═══════════════════════════════════════════════════════════════

    /**
     * Avvia combattimento
     */
    startCombat(encounterId) {
        const encounter = this.state.encounters.find(e => e.id === encounterId);
        if (!encounter) return;

        // Prepara mostri
        const monsters = [];
        for (let i = 0; i < encounter.count; i++) {
            monsters.push({ ...encounter.monster, count: 1 });
        }

        // Dispatch evento
        const event = new CustomEvent('openModuleWithItem', {
            detail: {
                moduleId: 'combatTracker',
                itemData: {
                    monsters: monsters,
                    encounterTitle: `${encounter.monster.name} (${this.state.currentBiome})`,
                    source: 'dungeonGenerator'
                }
            }
        });
        document.dispatchEvent(event);

        showToast(`Combattimento avviato con ${encounter.count}× ${encounter.monster.name}!`, 'success');
    },

    /**
     * Esporta JSON
     */
    exportJSON() {
        const data = {
            version: '2.0.0-wfc',
            biome: this.state.currentBiome,
            size: this.state.gridSize,
            partyLevel: this.state.partyLevel,
            grid: this.state.grid,
            encounters: this.state.encounters.map(e => ({
                monster: e.monster.name,
                count: e.count,
                position: e.position,
                cr: e.cr,
                xp: e.xp,
                difficulty: e.difficulty
            })),
            treasures: this.state.treasures,
            description: this.state.description,
            wfcAttempts: this.wfcEngine?.generationAttempts,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mappa_wfc_${this.state.currentBiome}_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        showToast('Mappa esportata in JSON!', 'success');
    },

    /**
     * Esporta immagine
     */
    async exportImage() {
        try {
            const blob = await this.mapRenderer.exportAsImage();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mappa_wfc_${this.state.currentBiome}_${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);

            showToast('Mappa esportata come immagine!', 'success');
        } catch (error) {
            console.error('Errore export immagine:', error);
            showToast('Errore nell\'esportazione immagine', 'error');
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════════════════════════════════

    destroy() {
        this.state = {
            currentBiome: 'foresta',
            gridSize: 5,
            partyLevel: 1,
            grid: null,
            encounters: [],
            treasures: [],
            description: ''
        };
        
        if (this.mapRenderer) this.mapRenderer.destroy();
        if (this.container) this.container.innerHTML = '';
        
        this.container = null;
        this.wfcEngine = null;
    }
};

export default DungeonGenerator;
