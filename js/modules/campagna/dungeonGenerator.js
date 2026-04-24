/**
 * DungeonGenerator v2.0
 * ─────────────────────────────────────────────────────────────
 * Generatore di mappe procedurali con tiles grafici.
 * Supporta diversi biomi con mostri coerenti per contesto.
 * 
 * @version 2.0.0 - Complete rewrite with graphical tiles
 */

import { monsterDatabase } from '../../../database/monsterDatabase.js';
import { showToast } from '../../../utils/toast.js';
import { getCurrentCampaignId } from '../../../stateManager.js';
import { rollDice } from '../../../utils/dice.js';

// ═══════════════════════════════════════════════════════════════
// CONFIGURAZIONE BIOMI
// ═══════════════════════════════════════════════════════════════

const BIOME_CONFIG = {
    foresta: {
        name: 'Foresta',
        description: 'Una foresta lussureggiante piena di vita e misteri',
        tilesPath: 'ASSET/TILES/FORESTA/',
        tilesJson: 'ASSET/TILES/FORESTA/tiles.json',
        monsterTypes: ['beast', 'fey', 'plant', 'humanoid', 'monstrosity'],
        crRange: { min: 0.25, max: 8 },
        encounterDensity: 0.15,
        treasureDensity: 0.1
    }
    // Futuri biomi:
    // dungeon: { ... },
    // citta: { ... },
    // nave: { ... }
};

// ═══════════════════════════════════════════════════════════════
// STATO DEL MODULO
// ═══════════════════════════════════════════════════════════════

const DungeonGenerator = {
    // Stato interno
    state: {
        currentBiome: 'foresta',
        gridSize: 5,
        grid: [],           // Matrice 5x5 di ID tile
        tiles: [],          // Database tiles caricati
        encounters: [],     // Incontri generati
        treasures: [],      // Tesori generati
        description: ''     // Descrizione testuale
    },

    container: null,
    tilesLoaded: false,

    // ═══════════════════════════════════════════════════════════════
    // RENDER PRINCIPALE
    // ═══════════════════════════════════════════════════════════════

    render(containerElement) {
        this.container = containerElement;
        
        containerElement.innerHTML = `
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
                                <option value="5">5x5 (Piccola)</option>
                                <option value="7">7x7 (Media)</option>
                                <option value="10">10x10 (Grande)</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Livello Party:</label>
                            <input type="number" id="dg-party-level" value="1" min="1" max="20" style="width: 60px;">
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
                            <div class="dg-placeholder">
                                <p>🌲 Clicca "Genera Mappa" per creare una nuova area</p>
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
                            <h3>⚔️ Incontri (${this.state.encounters.length})</h3>
                            <div id="dg-encounters">
                                <p class="text-muted">Nessun incontro</p>
                            </div>
                        </div>

                        <div class="dg-card">
                            <h3>💎 Tesori (${this.state.treasures.length})</h3>
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

        this.bindEvents();
        this.loadTilesDatabase();
    },

    // ═══════════════════════════════════════════════════════════════
    // CARICAMENTO TILES
    // ═══════════════════════════════════════════════════════════════

    async loadTilesDatabase() {
        try {
            const biomeConfig = BIOME_CONFIG[this.state.currentBiome];
            const response = await fetch(biomeConfig.tilesJson);
            
            if (!response.ok) {
                throw new Error(`Impossibile caricare ${biomeConfig.tilesJson}`);
            }
            
            const data = await response.json();
            this.state.tiles = data.tiles;
            this.tilesLoaded = true;
            
            console.log(`✅ [DungeonGenerator] Caricati ${this.state.tiles.length} tiles per bioma: ${data.name}`);
        } catch (error) {
            console.error('❌ [DungeonGenerator] Errore caricamento tiles:', error);
            showToast('Errore nel caricamento dei tiles', 'error');
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // GENERAZIONE MAPPA
    // ═══════════════════════════════════════════════════════════════

    generateMap() {
        if (!this.tilesLoaded) {
            showToast('Tiles non ancora caricati, riprova...', 'warning');
            return;
        }

        const biome = BIOME_CONFIG[this.state.currentBiome];
        const size = this.state.gridSize;
        const partyLevel = parseInt(this.container.querySelector('#dg-party-level').value) || 1;

        console.log(`🗺️ [DungeonGenerator] Generazione mappa ${size}x${size} per bioma ${this.state.currentBiome}`);

        // Reset stato
        this.state.grid = [];
        this.state.encounters = [];
        this.state.treasures = [];

        // Crea griglia vuota
        for (let y = 0; y < size; y++) {
            this.state.grid[y] = [];
            for (let x = 0; x < size; x++) {
                this.state.grid[y][x] = this.selectTile(x, y, size);
            }
        }

        // Assicura passabilità minima (almeno 60% passabile)
        this.ensurePassability(size);

        // Genera incontri
        this.generateEncounters(biome, partyLevel, size);

        // Genera tesori
        this.generateTreasures(biome, partyLevel, size);

        // Genera descrizione
        this.state.description = this.generateDescription();

        // Renderizza la mappa
        this.renderMap();
        this.renderInfoPanel();

        // Abilita pulsanti export
        this.container.querySelector('#dg-export-image').disabled = false;
        this.container.querySelector('#dg-export-json').disabled = false;

        showToast(`Mappa ${size}x${size} generata con ${this.state.encounters.length} incontri!`, 'success');
    },

    selectTile(x, y, size) {
        const tiles = this.state.tiles;
        
        // Calcola pesi totali
        const totalWeight = tiles.reduce((sum, t) => sum + (t.weight || 1), 0);
        let random = Math.random() * totalWeight;
        
        // Seleziona tile basato sul peso
        for (const tile of tiles) {
            random -= (tile.weight || 1);
            if (random <= 0) {
                return tile.id;
            }
        }
        
        return tiles[0].id; // Fallback
    },

    ensurePassability(size) {
        const tiles = this.state.tiles;
        let passableCount = 0;
        const total = size * size;

        // Conta passabili
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const tile = tiles.find(t => t.id === this.state.grid[y][x]);
                if (tile && tile.passable) passableCount++;
            }
        }

        // Se meno del 60% passabile, sostituisci alcuni ostacoli
        while (passableCount < total * 0.6) {
            const rx = Math.floor(Math.random() * size);
            const ry = Math.floor(Math.random() * size);
            const currentTile = tiles.find(t => t.id === this.state.grid[ry][rx]);
            
            if (currentTile && !currentTile.passable) {
                // Sostituisci con un tile passabile
                const passableTiles = tiles.filter(t => t.passable);
                const newTile = passableTiles[Math.floor(Math.random() * passableTiles.length)];
                this.state.grid[ry][rx] = newTile.id;
                passableCount++;
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // GENERAZIONE INCONTRI
    // ═══════════════════════════════════════════════════════════════

    generateEncounters(biome, partyLevel, size) {
        const encounterCount = Math.floor(size * size * biome.encounterDensity);
        
        // Filtra mostri appropriati per tipo e CR
        const suitableMonsters = monsterDatabase.filter(m => {
            const typeMatch = biome.monsterTypes.includes(m.type);
            const cr = m.challenge_rating;
            const crMatch = typeof cr === 'number' && 
                           cr >= biome.crRange.min && 
                           cr <= Math.min(biome.crRange.max, partyLevel + 2);
            return typeMatch && crMatch;
        });

        if (suitableMonsters.length === 0) {
            console.warn('⚠️ [DungeonGenerator] Nessun mostro adatto trovato');
            return;
        }

        for (let i = 0; i < encounterCount; i++) {
            const monster = suitableMonsters[Math.floor(Math.random() * suitableMonsters.length)];
            const x = Math.floor(Math.random() * size);
            const y = Math.floor(Math.random() * size);
            
            // Determina numero di mostri basato su CR
            let count = 1;
            const cr = monster.challenge_rating;
            if (cr < 1) count = rollDice('2d4');
            else if (cr <= 2) count = rollDice('1d4');
            else if (cr <= 4) count = rollDice('1d3');

            this.state.encounters.push({
                id: `enc_${i}`,
                monster: monster,
                count: count,
                position: { x, y },
                cr: cr,
                xp: (monster.xp || 0) * count
            });
        }

        console.log(`⚔️ [DungeonGenerator] Generati ${this.state.encounters.length} incontri`);
    },

    // ═══════════════════════════════════════════════════════════════
    // GENERAZIONE TESORI
    // ═══════════════════════════════════════════════════════════════

    generateTreasures(biome, partyLevel, size) {
        const treasureCount = Math.floor(size * size * biome.treasureDensity);
        
        const treasureTypes = [
            { name: 'Monete d\'oro', type: 'coins', min: 10, max: 100 },
            { name: 'Pozione Curativa', type: 'potion', value: '50mo' },
            { name: 'Gemma Preziosa', type: 'gem', min: 1, max: 3 },
            { name: 'Arma Magica Minore', type: 'weapon', value: '100mo' },
            { name: 'Pergamena Incantesimo', type: 'scroll', value: '75mo' },
            { name: 'Amuleto Misterioso', type: 'trinket', value: '40mo' }
        ];

        for (let i = 0; i < treasureCount; i++) {
            const treasure = treasureTypes[Math.floor(Math.random() * treasureTypes.length)];
            const x = Math.floor(Math.random() * size);
            const y = Math.floor(Math.random() * size);
            
            let details = '';
            if (treasure.min && treasure.max) {
                const amount = Math.floor(Math.random() * (treasure.max - treasure.min + 1)) + treasure.min;
                details = ` (${amount})`;
            }

            this.state.treasures.push({
                id: `treas_${i}`,
                ...treasure,
                details,
                position: { x, y }
            });
        }

        console.log(`💎 [DungeonGenerator] Generati ${this.state.treasures.length} tesori`);
    },

    // ═══════════════════════════════════════════════════════════════
    // GENERAZIONE DESCRIZIONE
    // ═══════════════════════════════════════════════════════════════

    generateDescription() {
        const biome = BIOME_CONFIG[this.state.currentBiome];
        const size = this.state.gridSize;
        
        const descriptions = {
            foresta: [
                'Una fitta foresta si estende davanti a voi, i raggi del sole filtrano a malapena tra le fronde degli alberi secolari.',
                'Il terreno è coperto da un tappeto di foglie cadute che scricchiolano sotto i vostri passi.',
                'L\'aria è fresca e profumata di resina e terriccio umido.',
                'Uccelli cantano tra i rami, ma il loro canto sembra distante e ovattato.'
            ]
        };

        const biomeDescs = descriptions[this.state.currentBiome] || [];
        const selectedDescs = biomeDescs.sort(() => 0.5 - Math.random()).slice(0, 2);
        
        return `${biome.description}. ${selectedDescs.join(' ')}`;
    },

    // ═══════════════════════════════════════════════════════════════
    // RENDERING
    // ═══════════════════════════════════════════════════════════════

    renderMap() {
        const mapContainer = this.container.querySelector('#dg-map-container');
        const biome = BIOME_CONFIG[this.state.currentBiome];
        const size = this.state.gridSize;
        const tiles = this.state.tiles;

        // Calcola dimensione tile
        const tileSize = Math.min(Math.floor(400 / size), 128);

        let html = `<div class="dg-map-grid" style="grid-template-columns: repeat(${size}, ${tileSize}px);">`;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const tileId = this.state.grid[y][x];
                const tile = tiles.find(t => t.id === tileId);
                const encounter = this.state.encounters.find(e => e.position.x === x && e.position.y === y);
                const treasure = this.state.treasures.find(t => t.position.x === x && t.position.y === y);

                const hasEncounter = !!encounter;
                const hasTreasure = !!treasure;
                const markerClass = hasEncounter ? 'has-encounter' : (hasTreasure ? 'has-treasure' : '');

                html += `
                    <div class="dg-tile ${markerClass}" 
                         data-x="${x}" data-y="${y}"
                         data-tile-id="${tileId}"
                         data-passable="${tile?.passable || false}"
                         title="${tile?.name || 'Sconosciuto'}">
                        <img src="${biome.tilesPath}${tile?.file || ''}" 
                             alt="${tile?.name || ''}"
                             width="${tileSize}" height="${tileSize}">
                        ${hasEncounter ? `<span class="dg-marker encounter" title="${encounter.monster.name} x${encounter.count}">⚔️</span>` : ''}
                        ${hasTreasure ? `<span class="dg-marker treasure" title="${treasure.name}">💎</span>` : ''}
                    </div>
                `;
            }
        }

        html += '</div>';
        mapContainer.innerHTML = html;
    },

    renderInfoPanel() {
        // Area Info
        const areaInfo = this.container.querySelector('#dg-area-info');
        areaInfo.innerHTML = `
            <p class="area-description">${this.state.description}</p>
            <div class="area-stats">
                <span>📐 Dimensione: ${this.state.gridSize}x${this.state.gridSize}</span>
                <span>🌲 Bioma: ${BIOME_CONFIG[this.state.currentBiome].name}</span>
            </div>
        `;

        // Encounters
        const encountersDiv = this.container.querySelector('#dg-encounters');
        if (this.state.encounters.length > 0) {
            encountersDiv.innerHTML = this.state.encounters.map(enc => `
                <div class="encounter-item" data-encounter-id="${enc.id}">
                    <span class="encounter-name">${enc.monster.name} x${enc.count}</span>
                    <span class="encounter-cr">CR ${enc.cr}</span>
                    <span class="encounter-xp">${enc.xp} XP</span>
                    <button class="btn-start-combat" data-encounter-id="${enc.id}" title="Inizia combattimento">⚔️</button>
                </div>
            `).join('');
        } else {
            encountersDiv.innerHTML = '<p class="text-muted">Nessun incontro</p>';
        }

        // Treasures
        const treasuresDiv = this.container.querySelector('#dg-treasures');
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

        // Click su tile
        this.container.querySelector('#dg-map-container').onclick = (e) => {
            const tile = e.target.closest('.dg-tile');
            if (tile) {
                this.showTileInfo(tile.dataset.x, tile.dataset.y);
            }
        };

        // Click su inizia combattimento
        this.container.querySelector('#dg-encounters').onclick = (e) => {
            const btn = e.target.closest('.btn-start-combat');
            if (btn) {
                const encId = btn.dataset.encounterId;
                this.startCombat(encId);
            }
        };

        // Export JSON
        this.container.querySelector('#dg-export-json').onclick = () => this.exportJSON();

        // Export Image
        this.container.querySelector('#dg-export-image').onclick = () => this.exportImage();
    },

    showTileInfo(x, y) {
        const tileId = this.state.grid[y][x];
        const tile = this.state.tiles.find(t => t.id === tileId);
        const encounter = this.state.encounters.find(e => e.position.x == x && e.position.y == y);
        const treasure = this.state.treasures.find(t => t.position.x == x && t.position.y == y);

        let info = `<strong>${tile?.name || 'Sconosciuto'}</strong>`;
        info += `<br><em>${tile?.description || ''}</em>`;
        info += `<br>Passabile: ${tile?.passable ? '✅' : '❌'}`;
        
        if (encounter) {
            info += `<br><br>⚔️ <strong>${encounter.monster.name} x${encounter.count}</strong> (CR ${encounter.cr})`;
        }
        
        if (treasure) {
            info += `<br><br>💎 <strong>${treasure.name}${treasure.details}</strong>`;
        }

        showToast(info, 'info');
    },

    startCombat(encounterId) {
        const encounter = this.state.encounters.find(e => e.id === encounterId);
        if (!encounter) return;

        // Prepara i mostri per il CombatTracker
        const monsters = [];
        for (let i = 0; i < encounter.count; i++) {
            monsters.push({
                ...encounter.monster,
                count: 1
            });
        }

        // Dispatch evento per aprire CombatTracker
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

        showToast(`Combattimento avviato con ${encounter.count}x ${encounter.monster.name}!`, 'success');
    },

    exportJSON() {
        const data = {
            biome: this.state.currentBiome,
            size: this.state.gridSize,
            grid: this.state.grid,
            encounters: this.state.encounters.map(e => ({
                monster: e.monster.name,
                count: e.count,
                position: e.position,
                cr: e.cr
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

    exportImage() {
        showToast('Esportazione immagine in sviluppo...', 'info');
        // TODO: Implementare con Canvas
    },

    // ═══════════════════════════════════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════════════════════════════════

    destroy() {
        this.state = {
            currentBiome: 'foresta',
            gridSize: 5,
            grid: [],
            tiles: [],
            encounters: [],
            treasures: [],
            description: ''
        };
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.container = null;
    }
};

export default DungeonGenerator;
