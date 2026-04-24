/**
 * DungeonGenerator - Entry Point
 * ─────────────────────────────────────────────────────────────
 * Generatore di mappe procedurali con approccio ibrido.
 * 
 * FASE 1: Generazione struttura (fiumi, sentieri, POI)
 * FASE 2: Riempimento intelligente
 * FASE 3: Post-processing
 * 
 * @version 2.1.0 - Hybrid generation
 */

import { MapGenerator } from './MapGenerator.js';
import { TileDatabase } from './TileDatabase.js';
import { MapRenderer } from './MapRenderer.js';
import { EncounterGenerator } from './EncounterGenerator.js';
import { monsterDatabase } from '../../../../database/monsterDatabase.js';
import { showToast } from '../../../../utils/toast.js';

// ═══════════════════════════════════════════════════════════════
// CONFIGURAZIONE BIOMI
// ═══════════════════════════════════════════════════════════════

const BIOME_CONFIG = {
    foresta: {
        name: 'Foresta',
        tilesPath: 'ASSET/TILES/FORESTA/',
        tilesJson: 'ASSET/TILES/FORESTA/tiles.json'
    }
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
    mapGenerator: null,
    tileDatabase: null,
    mapRenderer: null,
    encounterGenerator: null,
    container: null,
    
    // Modal editing state
    editingTile: null,
    editingPosition: null,

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
                    <h2>🗺️ Generatore Mappe</h2>
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
                                <p class="wfc-placeholder-hint">Generazione ibrida: fiumi continui, sentieri collegati, POI logici</p>
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
                            <h3>🗺️ Struttura</h3>
                            <div id="dg-structure">
                                <p class="text-muted">-</p>
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
                    <span class="legend-item"><span class="legend-dot" style="background:#795548"></span> Sentiero</span>
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
     * Handler click su tile - Apre modal di editing
     */
    handleTileClick(detail) {
        const { x, y, tileId, tile, encounter, treasure } = detail;
        
        // Apri modal di editing
        this.openTileEditor(x, y, tileId, tile);
    },
    
    /**
     * Apre il modal per editare un tile
     */
    openTileEditor(x, y, tileId, tile) {
        // Salva stato editing
        this.editingPosition = { x, y };
        this.editingTile = tileId;
        
        const biomeConfig = BIOME_CONFIG[this.state.currentBiome];
        const allTiles = this.tileDatabase.getAllTiles();
        
        // Raggruppa tile per categoria
        const categories = {};
        allTiles.forEach(t => {
            const cat = t.category || 'altro';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(t);
        });
        
        // Calcola compatibilità
        const compatibleTiles = this.getCompatibleTilesForPosition(x, y);
        
        // Genera HTML modal
        const modalHTML = `
            <div class="dg-modal-overlay" id="dg-tile-modal-overlay">
                <div class="dg-tile-modal">
                    <div class="dg-modal-header">
                        <h3>🎨 Modifica Tile</h3>
                        <button class="dg-modal-close" id="dg-modal-close">×</button>
                    </div>
                    
                    <div class="dg-current-tile">
                        <img src="${biomeConfig.tilesPath}${this.tileDatabase.getTileFilePath(tileId)}" 
                             alt="${tile?.name}" 
                             class="dg-current-tile-img"
                             style="${this.tileDatabase.getTileRotation(tileId) ? `transform: rotate(${this.tileDatabase.getTileRotation(tileId)}deg)` : ''}">
                        <div class="dg-current-tile-info">
                            <div class="dg-current-tile-name">${tile?.name || tileId}</div>
                            <div class="dg-current-tile-pos">Posizione: (${x}, ${y})</div>
                        </div>
                    </div>
                    
                    <div class="dg-tile-selector">
                        ${Object.entries(categories).map(([cat, tiles]) => `
                            <div class="dg-tile-category">
                                <div class="dg-tile-category-title">${this.getCategoryLabel(cat)}</div>
                                <div class="dg-tile-grid">
                                    ${tiles.map(t => {
                                        const isCompatible = compatibleTiles.has(t.id);
                                        const isSelected = t.id === tileId;
                                        const rotation = this.tileDatabase.getTileRotation(t.id);
                                        return `
                                            <div class="dg-tile-option ${isSelected ? 'selected' : ''} ${!isCompatible ? 'incompatible' : ''}" 
                                                 data-tile-id="${t.id}"
                                                 data-compatible="${isCompatible}"
                                                 title="${t.name}${!isCompatible ? ' (Non compatibile)' : ''}">
                                                <img src="${biomeConfig.tilesPath}${this.tileDatabase.getTileFilePath(t.id)}" 
                                                     alt="${t.name}"
                                                     style="${rotation ? `transform: rotate(${rotation}deg)` : ''}">
                                                <span class="dg-tile-option-name">${t.name}</span>
                                                ${!isCompatible ? '<span class="dg-compat-badge warning">⚠</span>' : ''}
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="dg-modal-footer">
                        <button class="dg-btn-cancel" id="dg-modal-cancel">Annulla</button>
                        <button class="dg-btn-apply" id="dg-modal-apply" ${!compatibleTiles.has(this.editingTile) ? 'disabled' : ''}>
                            Applica Modifiche
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Aggiungi modal al DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstElementChild);
        
        // Bind eventi modal
        this.bindModalEvents();
    },
    
    /**
     * Bind eventi del modal
     */
    bindModalEvents() {
        const overlay = document.getElementById('dg-tile-modal-overlay');
        const closeBtn = document.getElementById('dg-modal-close');
        const cancelBtn = document.getElementById('dg-modal-cancel');
        const applyBtn = document.getElementById('dg-modal-apply');
        
        // Chiudi modal
        const closeModal = () => {
            overlay?.remove();
            this.editingTile = null;
            this.editingPosition = null;
        };
        
        closeBtn?.addEventListener('click', closeModal);
        cancelBtn?.addEventListener('click', closeModal);
        overlay?.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        
        // Selezione tile
        overlay.querySelectorAll('.dg-tile-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                const tileId = opt.dataset.tileId;
                const isCompatible = opt.dataset.compatible === 'true';
                
                if (!isCompatible) {
                    showToast('Questo tile non è compatibile con i vicini!', 'warning');
                    return;
                }
                
                // Aggiorna selezione
                overlay.querySelectorAll('.dg-tile-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                
                this.editingTile = tileId;
                applyBtn.disabled = false;
            });
        });
        
        // Applica modifiche
        applyBtn?.addEventListener('click', () => {
            if (this.editingTile && this.editingPosition) {
                this.applyTileChange(this.editingPosition.x, this.editingPosition.y, this.editingTile);
                closeModal();
            }
        });
        
        // ESC per chiudere
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    },
    
    /**
     * Ottiene i tile compatibili per una posizione
     */
    getCompatibleTilesForPosition(x, y) {
        const compatible = new Set();
        const allTiles = this.tileDatabase.getAllTiles();
        
        // Se non c'è una griglia, tutti i tile sono compatibili
        if (!this.state.grid || !this.state.grid.length) {
            allTiles.forEach(t => compatible.add(t.id));
            return compatible;
        }
        
        // Ottieni tile dei vicini
        const neighbors = {
            top: y > 0 ? this.state.grid[y - 1]?.[x] : null,
            bottom: y < this.state.grid.length - 1 ? this.state.grid[y + 1]?.[x] : null,
            left: x > 0 ? this.state.grid[y]?.[x - 1] : null,
            right: x < this.state.grid[0].length - 1 ? this.state.grid[y]?.[x + 1] : null
        };
        
        // Verifica ogni tile
        allTiles.forEach(tile => {
            let isCompatible = true;
            
            // Verifica compatibilità con ogni vicino
            if (neighbors.top) {
                const topTile = this.tileDatabase.getTile(neighbors.top);
                const topSocket = topTile?.sockets?.bottom;
                const myTopSocket = tile.sockets?.top;
                if (topSocket && myTopSocket && !this.tileDatabase.areSocketsCompatible(myTopSocket, topSocket)) {
                    isCompatible = false;
                }
            }
            
            if (neighbors.bottom) {
                const bottomTile = this.tileDatabase.getTile(neighbors.bottom);
                const bottomSocket = bottomTile?.sockets?.top;
                const myBottomSocket = tile.sockets?.bottom;
                if (bottomSocket && myBottomSocket && !this.tileDatabase.areSocketsCompatible(myBottomSocket, bottomSocket)) {
                    isCompatible = false;
                }
            }
            
            if (neighbors.left) {
                const leftTile = this.tileDatabase.getTile(neighbors.left);
                const leftSocket = leftTile?.sockets?.right;
                const myLeftSocket = tile.sockets?.left;
                if (leftSocket && myLeftSocket && !this.tileDatabase.areSocketsCompatible(myLeftSocket, leftSocket)) {
                    isCompatible = false;
                }
            }
            
            if (neighbors.right) {
                const rightTile = this.tileDatabase.getTile(neighbors.right);
                const rightSocket = rightTile?.sockets?.left;
                const myRightSocket = tile.sockets?.right;
                if (rightSocket && myRightSocket && !this.tileDatabase.areSocketsCompatible(myRightSocket, rightSocket)) {
                    isCompatible = false;
                }
            }
            
            if (isCompatible) {
                compatible.add(tile.id);
            }
        });
        
        return compatible;
    },
    
    /**
     * Applica il cambio di tile
     */
    applyTileChange(x, y, newTileId) {
        // Aggiorna la griglia
        this.state.grid[y][x] = newTileId;
        
        // Re-renderizza la mappa
        this.renderMap();
        
        // Feedback
        const tile = this.tileDatabase.getTile(newTileId);
        showToast(`Tile cambiato in "${tile?.name || newTileId}"`, 'success');
        
        console.log(`🎨 [DungeonGenerator] Tile (${x},${y}) cambiato in ${newTileId}`);
    },
    
    /**
     * Traduce le categorie in italiano
     */
    getCategoryLabel(category) {
        const labels = {
            'terreno': '🌿 Terreno',
            'vegetazione': '🌳 Vegetazione',
            'acqua': '💧 Acqua',
            'sentiero': '🛤️ Sentieri',
            'struttura': '🏠 Strutture',
            'punto_interesse': '⭐ Punti Interesse',
            'altro': '📦 Altro'
        };
        return labels[category] || `📁 ${category}`;
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

        console.log(`🗺️ [DungeonGenerator] Generazione mappa ${size}×${size} (ibrida)...`);

        try {
            // Crea MapGenerator
            this.mapGenerator = new MapGenerator({
                width: size,
                height: size
            });

            // Genera mappa
            const startTime = performance.now();
            this.mapGenerator.generate();
            const endTime = performance.now();

            // Estrai griglia semplice (solo ID)
            this.state.grid = this.mapGenerator.getTileIds();

            console.log(`⏱️ [DungeonGenerator] Generazione completata in ${(endTime - startTime).toFixed(2)}ms`);
            console.log(`📊 [DungeonGenerator] Features:`, this.mapGenerator.features);

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

            showToast(`Mappa ${size}×${size} generata!`, 'success');

        } catch (error) {
            console.error('❌ [DungeonGenerator] Errore generazione:', error);
            showToast(`Errore: ${error.message}`, 'error');
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
            </div>
        `;

        // Structure Info
        const structDiv = this.container.querySelector('#dg-structure');
        const features = this.mapGenerator?.features || { rivers: [], paths: [], pois: [] };
        
        structDiv.innerHTML = `
            <div class="structure-stats">
                <span>🌊 Celle acqua: ${features.rivers.length}</span>
                <span>🛤️ Celle sentiero: ${features.paths.length}</span>
                <span>📍 POI: ${features.pois.length}</span>
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
        const features = this.mapGenerator?.features || { rivers: [], paths: [], pois: [] };
        
        let desc = `Una zona di ${biomeConfig.name.toLowerCase()}`;
        
        if (features.rivers.length > 0) {
            desc += ` attraversata da un corso d'acqua`;
        }
        
        if (features.paths.length > 0) {
            desc += `. Sentieri tortuosi si snodano tra la vegetazione`;
        }
        
        if (features.pois.length > 0) {
            const poiTypes = features.pois.map(p => p.type);
            if (poiTypes.includes('capanna')) desc += `. Si intravede una capanna`;
            if (poiTypes.includes('rovine')) desc += `. Antiche rovine emergono tra gli alberi`;
            if (poiTypes.includes('campo_falo')) desc += `. Un falò brucia in una radura`;
        }
        
        desc += `.`;
        
        return desc;
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

        const monsters = [];
        for (let i = 0; i < encounter.count; i++) {
            monsters.push({ ...encounter.monster, count: 1 });
        }

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
            version: '2.1.0-hybrid',
            biome: this.state.currentBiome,
            size: this.state.gridSize,
            partyLevel: this.state.partyLevel,
            grid: this.state.grid,
            features: this.mapGenerator?.features,
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
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mappa_${this.state.currentBiome}_${Date.now()}.json`;
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
            a.download = `mappa_${this.state.currentBiome}_${Date.now()}.png`;
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
        this.mapGenerator = null;
    }
};

export default DungeonGenerator;
