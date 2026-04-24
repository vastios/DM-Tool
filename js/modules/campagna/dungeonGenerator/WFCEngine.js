/**
 * WFCEngine.js
 * ─────────────────────────────────────────────────────────────
 * Wave Function Collapse Engine per generazione mappe procedurali.
 * 
 * Algoritmo:
 * 1. Ogni cella inizia con tutti i tile possibili (superposition)
 * 2. Si seleziona la cella con minore entropia (meno opzioni)
 * 3. Si "collassa" la cella scegliendo un tile
 * 4. Si propagano i constraints ai vicini
 * 5. Si ripete fino al collasso completo o contraddizione
 * 
 * @version 1.0.0
 */

/**
 * Direzioni per l'adiacenza
 */
const DIRECTIONS = {
    TOP: { dx: 0, dy: -1, opposite: 'BOTTOM', socket: 'top' },
    BOTTOM: { dx: 0, dy: 1, opposite: 'TOP', socket: 'bottom' },
    LEFT: { dx: -1, dy: 0, opposite: 'RIGHT', socket: 'left' },
    RIGHT: { dx: 1, dy: 0, opposite: 'LEFT', socket: 'right' }
};

/**
 * Classe principale WFC Engine
 */
export class WFCEngine {
    constructor(tileDatabase, options = {}) {
        this.tileDatabase = tileDatabase;
        this.options = {
            width: options.width || 10,
            height: options.height || 10,
            maxRetries: options.maxRetries || 10,
            entropyNoise: options.entropyNoise || 0.001,
            ...options
        };
        
        // Stato
        this.grid = [];
        this.collapsed = new Set();
        this.propagationQueue = [];
        this.generationAttempts = 0;
    }

    /**
     * Genera una mappa usando WFC
     * @returns {Array<Array<string>>} Griglia con ID tile collassati
     */
    generate() {
        let attempts = 0;
        
        while (attempts < this.options.maxRetries) {
            attempts++;
            this.generationAttempts = attempts;
            
            console.log(`🗺️ [WFC] Tentativo generazione #${attempts}`);
            
            try {
                this.initializeGrid();
                this.runWFC();
                
                console.log(`✅ [WFC] Mappa generata con successo al tentativo #${attempts}`);
                return this.extractResult();
                
            } catch (error) {
                if (error.message === 'CONTRADICTION') {
                    console.warn(`⚠️ [WFC] Contraddizione al tentativo #${attempts}, riprovo...`);
                    continue;
                }
                throw error;
            }
        }
        
        throw new Error(`Impossibile generare mappa dopo ${attempts} tentativi`);
    }

    /**
     * Inizializza la griglia con superposizione completa
     */
    initializeGrid() {
        const { width, height } = this.options;
        const allTileIds = this.tileDatabase.getAllTileIds();
        
        this.grid = [];
        this.collapsed = new Set();
        this.propagationQueue = [];
        
        for (let y = 0; y < height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < width; x++) {
                this.grid[y][x] = {
                    possible: new Set(allTileIds),
                    collapsed: null,
                    entropy: allTileIds.length
                };
            }
        }
        
        // Applica constraints iniziali (bordi, POI richiesti, etc.)
        this.applyInitialConstraints();
    }

    /**
     * Applica constraints iniziali alla griglia
     */
    applyInitialConstraints() {
        const { width, height } = this.options;
        
        // Forza tile "aperti" sui bordi per evitare ostacoli
        for (let x = 0; x < width; x++) {
            // Bordo superiore - preferibilmente passabile
            this.constrainCell(0, x, (tile) => {
                const tileData = this.tileDatabase.getTile(tile);
                return tileData.passable || tileData.category === 'acqua';
            });
            
            // Bordo inferiore
            this.constrainCell(height - 1, x, (tile) => {
                const tileData = this.tileDatabase.getTile(tile);
                return tileData.passable || tileData.category === 'acqua';
            });
        }
        
        for (let y = 0; y < height; y++) {
            // Bordo sinistro
            this.constrainCell(y, 0, (tile) => {
                const tileData = this.tileDatabase.getTile(tile);
                return tileData.passable || tileData.category === 'acqua';
            });
            
            // Bordo destro
            this.constrainCell(y, width - 1, (tile) => {
                const tileData = this.tileDatabase.getTile(tile);
                return tileData.passable || tileData.category === 'acqua';
            });
        }
    }

    /**
     * Esegue l'algoritmo WFC principale
     */
    runWFC() {
        const totalCells = this.options.width * this.options.height;
        
        while (this.collapsed.size < totalCells) {
            // 1. Trova la cella con minore entropia
            const cell = this.selectMinEntropyCell();
            
            if (!cell) {
                // Tutte le celle collassate
                break;
            }
            
            // 2. Collassa la cella
            this.collapseCell(cell.y, cell.x);
            
            // 3. Propaga i constraints
            this.propagate();
        }
    }

    /**
     * Seleziona la cella con minore entropia (meno opzioni)
     * @returns {{x: number, y: number}|null}
     */
    selectMinEntropyCell() {
        let minEntropy = Infinity;
        let candidates = [];
        
        const { width, height } = this.options;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cell = this.grid[y][x];
                
                // Salta celle già collassate
                if (cell.collapsed !== null) continue;
                
                // Salta celle contraddittorie
                if (cell.possible.size === 0) {
                    throw new Error('CONTRADICTION');
                }
                
                const entropy = cell.possible.size + (Math.random() * this.options.entropyNoise);
                
                if (entropy < minEntropy) {
                    minEntropy = entropy;
                    candidates = [{ x, y }];
                } else if (entropy === minEntropy) {
                    candidates.push({ x, y });
                }
            }
        }
        
        if (candidates.length === 0) return null;
        
        // Scegli casualmente tra le celle con stessa entropia
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    /**
     * Collassa una cella scegliendo un tile
     */
    collapseCell(y, x) {
        const cell = this.grid[y][x];
        
        if (cell.collapsed !== null) return;
        
        // Ottieni tile possibili con i loro pesi
        const possibleTiles = Array.from(cell.possible);
        const weights = possibleTiles.map(tileId => {
            const tile = this.tileDatabase.getTile(tileId);
            return tile.weight || 1;
        });
        
        // Selezione pesata
        const selectedTile = this.weightedRandomSelect(possibleTiles, weights);
        
        cell.collapsed = selectedTile;
        cell.possible = new Set([selectedTile]);
        cell.entropy = 1;
        
        this.collapsed.add(`${x},${y}`);
        
        // Aggiungi vicini alla coda di propagazione
        this.enqueueNeighbors(y, x);
        
        console.log(`🎯 [WFC] Collassata cella (${x},${y}) -> ${selectedTile}`);
    }

    /**
     * Propaga i constraints nella griglia
     */
    propagate() {
        while (this.propagationQueue.length > 0) {
            const { y, x } = this.propagationQueue.shift();
            const cell = this.grid[y][x];
            
            if (cell.collapsed !== null) continue;
            
            // Calcola i tile possibili basandosi sui vicini
            const validTiles = new Set();
            
            for (const tileId of cell.possible) {
                if (this.isTileValidAt(y, x, tileId)) {
                    validTiles.add(tileId);
                }
            }
            
            // Se non ci sono tile validi, contraddizione
            if (validTiles.size === 0) {
                throw new Error('CONTRADICTION');
            }
            
            // Se il set è cambiato, propaga
            if (validTiles.size !== cell.possible.size) {
                cell.possible = validTiles;
                cell.entropy = validTiles.size;
                
                // Se collassato a un solo tile
                if (validTiles.size === 1) {
                    cell.collapsed = Array.from(validTiles)[0];
                    this.collapsed.add(`${x},${y}`);
                }
                
                // Propaga ai vicini
                this.enqueueNeighbors(y, x);
            }
        }
    }

    /**
     * Verifica se un tile è valido in una posizione
     */
    isTileValidAt(y, x, tileId) {
        const tile = this.tileDatabase.getTile(tileId);
        const sockets = tile.sockets;
        
        for (const [dirName, dir] of Object.entries(DIRECTIONS)) {
            const ny = y + dir.dy;
            const nx = x + dir.dx;
            
            // Fuori dalla griglia - verifica compatibilità col bordo
            if (ny < 0 || ny >= this.options.height || nx < 0 || nx >= this.options.width) {
                continue;
            }
            
            const neighbor = this.grid[ny][nx];
            
            // Se il vicino non è collassato, è sempre compatibile
            if (neighbor.collapsed === null) continue;
            
            const neighborTile = this.tileDatabase.getTile(neighbor.collapsed);
            const neighborSocket = neighborTile.sockets[dir.opposite.toLowerCase()];
            const mySocket = sockets[dir.socket];
            
            // Verifica compatibilità socket
            if (!this.tileDatabase.areSocketsCompatible(mySocket, neighborSocket)) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Vincola una cella con un filtro
     */
    constrainCell(y, x, filterFn) {
        const cell = this.grid[y][x];
        const filtered = Array.from(cell.possible).filter(filterFn);
        
        if (filtered.length === 0) {
            throw new Error('CONTRADICTION');
        }
        
        cell.possible = new Set(filtered);
        cell.entropy = filtered.length;
        
        this.enqueueNeighbors(y, x);
    }

    /**
     * Aggiunge i vicini alla coda di propagazione
     */
    enqueueNeighbors(y, x) {
        for (const dir of Object.values(DIRECTIONS)) {
            const ny = y + dir.dy;
            const nx = x + dir.dx;
            
            if (ny >= 0 && ny < this.options.height && 
                nx >= 0 && nx < this.options.width) {
                
                const key = `${nx},${ny}`;
                if (!this.collapsed.has(key)) {
                    // Evita duplicati nella coda
                    if (!this.propagationQueue.some(p => p.x === nx && p.y === ny)) {
                        this.propagationQueue.push({ x: nx, y: ny });
                    }
                }
            }
        }
    }

    /**
     * Selezione casuale pesata
     */
    weightedRandomSelect(items, weights) {
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < items.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return items[i];
            }
        }
        
        return items[items.length - 1];
    }

    /**
     * Estrae il risultato finale
     */
    extractResult() {
        const result = [];
        
        for (let y = 0; y < this.options.height; y++) {
            result[y] = [];
            for (let x = 0; x < this.options.width; x++) {
                result[y][x] = this.grid[y][x].collapsed;
            }
        }
        
        return result;
    }

    /**
     * Forza un tile specifico in una posizione
     */
    setTile(y, x, tileId) {
        const cell = this.grid[y][x];
        
        if (!cell.possible.has(tileId)) {
            throw new Error(`Tile ${tileId} non compatibile con la posizione (${x},${y})`);
        }
        
        cell.collapsed = tileId;
        cell.possible = new Set([tileId]);
        cell.entropy = 1;
        
        this.collapsed.add(`${x},${y}`);
        this.enqueueNeighbors(y, x);
        this.propagate();
    }
}

export default WFCEngine;
