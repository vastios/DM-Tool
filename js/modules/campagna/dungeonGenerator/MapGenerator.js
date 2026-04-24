/**
 * MapGenerator.js
 * ─────────────────────────────────────────────────────────────
 * Generatore mappe intelligente con approccio ibrido.
 * 
 * FASE 1: Generazione struttura (fiumi, sentieri, POI)
 * FASE 2: Riempimento con WFC per dettagli
 * 
 * @version 2.1.0 - Hybrid generation
 */

export class MapGenerator {
    constructor(options = {}) {
        this.width = options.width || 5;
        this.height = options.height || 5;
        this.grid = [];
        this.features = {
            rivers: [],
            paths: [],
            pois: []
        };
        
        // Configurazione generazione
        this.config = {
            riverChance: 0.4,        // Probabilità di avere un fiume
            pathDensity: 0.15,       // Densità sentieri
            poiCount: { min: 1, max: 3 },  // Numero POI
            forestDensity: 0.3       // Densità vegetazione
        };
    }

    /**
     * Genera la mappa completa
     */
    generate() {
        console.log('🗺️ [MapGenerator] Inizio generazione ibrida...');
        
        // Reset
        this.initializeEmptyGrid();
        this.features = { rivers: [], paths: [], pois: [] };
        
        // FASE 1: Genera struttura
        this.generateRivers();
        this.generatePaths();
        this.generatePOIs();
        
        // FASE 2: Riempimento intelligente
        this.fillRemaining();
        
        // FASE 3: Post-processing
        this.ensureConnectivity();
        
        console.log('✅ [MapGenerator] Generazione completata');
        console.log(`   🌊 Fiumi: ${this.features.rivers.length} celle`);
        console.log(`   🛤️ Sentieri: ${this.features.paths.length} celle`);
        console.log(`   📍 POI: ${this.features.pois.length}`);
        
        return this.grid;
    }

    /**
     * Inizializza griglia vuota
     */
    initializeEmptyGrid() {
        this.grid = [];
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x] = {
                    tileId: null,
                    feature: null,  // 'river', 'path', 'poi'
                    poiType: null
                };
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // FASE 1: GENERAZIONE STRUTTURA
    // ═══════════════════════════════════════════════════════════════

    /**
     * Genera fiumi che attraversano la mappa
     */
    generateRivers() {
        if (Math.random() > this.config.riverChance) return;
        
        // Il fiume parte da un bordo e attraversa fino al lato opposto
        const startSide = Math.floor(Math.random() * 4); // 0=N, 1=S, 2=E, 3=O
        
        let x, y, dx, dy;
        
        switch (startSide) {
            case 0: // Nord -> Sud
                x = Math.floor(Math.random() * this.width);
                y = 0;
                dx = 0; dy = 1;
                break;
            case 1: // Sud -> Nord
                x = Math.floor(Math.random() * this.width);
                y = this.height - 1;
                dx = 0; dy = -1;
                break;
            case 2: // Est -> Ovest
                x = this.width - 1;
                y = Math.floor(Math.random() * this.height);
                dx = -1; dy = 0;
                break;
            case 3: // Ovest -> Est
                x = 0;
                y = Math.floor(Math.random() * this.height);
                dx = 1; dy = 0;
                break;
        }
        
        // Traccia il fiume con leggera curvatura
        let steps = 0;
        const maxSteps = this.width + this.height + 10;
        
        while (x >= 0 && x < this.width && y >= 0 && y < this.height && steps < maxSteps) {
            // Posiziona tile acqua
            this.grid[y][x].tileId = this.getRiverTile(x, y, dx, dy);
            this.grid[y][x].feature = 'river';
            this.features.rivers.push({ x, y });
            
            // Movimento con curvatura casuale
            if (Math.random() < 0.3) {
                // Curve
                const turn = Math.random() < 0.5 ? -1 : 1;
                if (dx === 0) {
                    dx = turn;
                    dy = 0;
                } else {
                    dx = 0;
                    dy = turn;
                }
            }
            
            x += dx;
            y += dy;
            steps++;
        }
        
        // Aggiungi laghetto se il fiume è breve
        if (this.features.rivers.length < 3) {
            this.addPond();
        }
    }

    /**
     * Determina il tile fiume corretto
     */
    getRiverTile(x, y, dx, dy) {
        const prev = this.getPreviousRiverTile(x - dx, y - dy);
        
        // Determina direzione
        if (dx !== 0) {
            return 'ruscello_h';
        } else {
            return 'ruscello_v';
        }
    }

    /**
     * Ottiene tile fiume precedente
     */
    getPreviousRiverTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
        return this.grid[y][x].feature === 'river' ? this.grid[y][x].tileId : null;
    }

    /**
     * Aggiunge un laghetto
     */
    addPond() {
        const px = Math.floor(Math.random() * (this.width - 2)) + 1;
        const py = Math.floor(Math.random() * (this.height - 2)) + 1;
        
        if (this.grid[py][px].feature === null) {
            this.grid[py][px].tileId = 'laghetto';
            this.grid[py][px].feature = 'river';
            this.features.rivers.push({ x: px, y: py });
        }
    }

    /**
     * Genera sentieri che collegano POI
     */
    generatePaths() {
        // Trova celle libere per iniziare sentieri
        const freeCells = this.getFreeCells();
        
        if (freeCells.length < 2) return;
        
        // Crea sentiero principale
        const pathCount = Math.floor(this.width * this.height * this.config.pathDensity);
        
        // Punti di partenza sui bordi
        const startPoints = this.getPathStartPoints();
        
        if (startPoints.length < 2) return;
        
        // Collega punti con sentiero
        for (let i = 0; i < startPoints.length - 1; i++) {
            this.connectWithPath(startPoints[i], startPoints[i + 1]);
        }
        
        // Aggiungi qualche sentiero morto
        for (let i = 0; i < pathCount / 2; i++) {
            const start = freeCells[Math.floor(Math.random() * freeCells.length)];
            this.growPath(start.x, start.y, Math.floor(Math.random() * 3) + 2);
        }
    }

    /**
     * Ottiene punti di partenza per sentieri sui bordi
     */
    getPathStartPoints() {
        const points = [];
        
        // Bordo sinistro
        points.push({ x: 0, y: Math.floor(this.height / 2) });
        
        // Bordo destro
        points.push({ x: this.width - 1, y: Math.floor(this.height / 2) });
        
        // Bordo alto (opzionale)
        if (this.height > 4 && Math.random() < 0.5) {
            points.push({ x: Math.floor(this.width / 2), y: 0 });
        }
        
        // Bordo basso (opzionale)
        if (this.height > 4 && Math.random() < 0.5) {
            points.push({ x: Math.floor(this.width / 2), y: this.height - 1 });
        }
        
        return points;
    }

    /**
     * Collega due punti con un sentiero (A* semplificato)
     */
    connectWithPath(start, end) {
        let current = { ...start };
        const path = [current];
        
        while (current.x !== end.x || current.y !== end.y) {
            // Movimento verso la destinazione
            const dx = Math.sign(end.x - current.x);
            const dy = Math.sign(end.y - current.y);
            
            // Alternanza con casualità
            if (Math.random() < 0.5 && dx !== 0) {
                current = { x: current.x + dx, y: current.y };
            } else if (dy !== 0) {
                current = { x: current.x, y: current.y + dy };
            } else if (dx !== 0) {
                current = { x: current.x + dx, y: current.y };
            }
            
            // Verifica bounds
            if (current.x < 0) current.x = 0;
            if (current.x >= this.width) current.x = this.width - 1;
            if (current.y < 0) current.y = 0;
            if (current.y >= this.height) current.y = this.height - 1;
            
            // Posiziona sentiero se non c'è acqua
            if (this.grid[current.y][current.x].feature !== 'river') {
                this.grid[current.y][current.x].tileId = this.selectPathTile(current.x, current.y);
                this.grid[current.y][current.x].feature = 'path';
                this.features.paths.push({ x: current.x, y: current.y });
            }
        }
    }

    /**
     * Seleziona tile sentiero appropriato
     */
    selectPathTile(x, y) {
        const neighbors = this.getPathNeighbors(x, y);
        
        // Incrocio
        if (neighbors.count >= 3) return 'incrocio';
        
        // Bivio T
        if (neighbors.count === 2) {
            if (!neighbors.top || !neighbors.bottom) return 't_sentiero';
            return 'sentiero_h'; // or sentiero_v
        }
        
        // Linea retta o curva
        if (neighbors.count === 1) {
            if (neighbors.top || neighbors.bottom) return 'sentiero_v';
            return 'sentiero_h';
        }
        
        // Fine sentiero
        return 'sentiero_h';
    }

    /**
     * Conta vicini che sono sentieri
     */
    getPathNeighbors(x, y) {
        const neighbors = { top: false, bottom: false, left: false, right: false, count: 0 };
        
        if (y > 0 && this.grid[y-1][x].feature === 'path') { neighbors.top = true; neighbors.count++; }
        if (y < this.height-1 && this.grid[y+1][x].feature === 'path') { neighbors.bottom = true; neighbors.count++; }
        if (x > 0 && this.grid[y][x-1].feature === 'path') { neighbors.left = true; neighbors.count++; }
        if (x < this.width-1 && this.grid[y][x+1].feature === 'path') { neighbors.right = true; neighbors.count++; }
        
        return neighbors;
    }

    /**
     * Fa crescere un sentiero da un punto
     */
    growPath(startX, startY, length) {
        let x = startX;
        let y = startY;
        
        // Direzione casuale
        const dirs = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 }
        ];
        let dir = dirs[Math.floor(Math.random() * dirs.length)];
        
        for (let i = 0; i < length; i++) {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) break;
            
            if (this.grid[y][x].feature !== 'river') {
                this.grid[y][x].tileId = 'sentiero_h';
                this.grid[y][x].feature = 'path';
                this.features.paths.push({ x, y });
            }
            
            // Occasionale cambio direzione
            if (Math.random() < 0.3) {
                dir = dirs[Math.floor(Math.random() * dirs.length)];
            }
            
            x += dir.dx;
            y += dir.dy;
        }
    }

    /**
     * Genera POI (Punti di Interesse)
     */
    generatePOIs() {
        const poiCount = Math.floor(Math.random() * (this.config.poiCount.max - this.config.poiCount.min + 1)) + this.config.poiCount.min;
        
        const poiTypes = [
            { tileId: 'capanna', requiresPath: true, weight: 3 },
            { tileId: 'campo_falo', requiresPath: true, weight: 2 },
            { tileId: 'rovine', requiresPath: false, weight: 2 },
            { tileId: 'pozzo', requiresPath: false, weight: 2 }
        ];
        
        for (let i = 0; i < poiCount; i++) {
            // Trova cella adatta
            const cell = this.findPOICell(poiTypes);
            
            if (cell) {
                const poiType = this.selectWeightedPOI(poiTypes, cell.nearPath);
                
                this.grid[cell.y][cell.x].tileId = poiType.tileId;
                this.grid[cell.y][cell.x].feature = 'poi';
                this.grid[cell.y][cell.x].poiType = poiType.tileId;
                this.features.pois.push({ x: cell.x, y: cell.y, type: poiType.tileId });
            }
        }
    }

    /**
     * Trova cella adatta per un POI
     */
    findPOICell(poiTypes) {
        const freeCells = this.getFreeCells();
        const candidates = [];
        
        for (const cell of freeCells) {
            const nearPath = this.isNearFeature(cell.x, cell.y, 'path');
            const nearRiver = this.isNearFeature(cell.x, cell.y, 'river');
            
            // POI vicino a sentiero sono preferiti
            candidates.push({
                ...cell,
                nearPath,
                nearRiver,
                score: nearPath ? 3 : (nearRiver ? 1 : 0)
            });
        }
        
        // Ordina per score e prendi uno dei migliori
        candidates.sort((a, b) => b.score - a.score);
        
        if (candidates.length === 0) return null;
        
        // Scegli tra i primi candidati
        const topCandidates = candidates.slice(0, Math.min(5, candidates.length));
        return topCandidates[Math.floor(Math.random() * topCandidates.length)];
    }

    /**
     * Seleziona POI pesato
     */
    selectWeightedPOI(poiTypes, nearPath) {
        const validTypes = poiTypes.filter(t => !t.requiresPath || nearPath);
        
        const totalWeight = validTypes.reduce((sum, t) => sum + t.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const type of validTypes) {
            random -= type.weight;
            if (random <= 0) return type;
        }
        
        return validTypes[0];
    }

    // ═══════════════════════════════════════════════════════════════
    // FASE 2: RIEMPIMENTO
    // ═══════════════════════════════════════════════════════════════

    /**
     * Riempie le celle rimanenti
     */
    fillRemaining() {
        const freeCells = this.getFreeCells();
        
        // Raggruppa celle libere in "zone"
        const zones = this.identifyZones(freeCells);
        
        for (const zone of zones) {
            // Determina tipo di zona
            const zoneType = this.determineZoneType(zone);
            
            // Riempimento zona
            for (const cell of zone.cells) {
                this.grid[cell.y][cell.x].tileId = this.selectFillTile(cell.x, cell.y, zoneType);
            }
        }
    }

    /**
     * Identifica zone contigue
     */
    identifyZones(freeCells) {
        const visited = new Set();
        const zones = [];
        
        for (const cell of freeCells) {
            const key = `${cell.x},${cell.y}`;
            if (visited.has(key)) continue;
            
            // Flood fill per trovare zona
            const zone = { cells: [], type: null };
            const queue = [cell];
            
            while (queue.length > 0) {
                const current = queue.shift();
                const currentKey = `${current.x},${current.y}`;
                
                if (visited.has(currentKey)) continue;
                if (!this.isFreeCell(current.x, current.y)) continue;
                
                visited.add(currentKey);
                zone.cells.push(current);
                
                // Aggiungi vicini
                const neighbors = [
                    { x: current.x - 1, y: current.y },
                    { x: current.x + 1, y: current.y },
                    { x: current.x, y: current.y - 1 },
                    { x: current.x, y: current.y + 1 }
                ];
                
                for (const n of neighbors) {
                    const nKey = `${n.x},${n.y}`;
                    if (!visited.has(nKey) && this.isFreeCell(n.x, n.y)) {
                        queue.push(n);
                    }
                }
            }
            
            if (zone.cells.length > 0) {
                zones.push(zone);
            }
        }
        
        return zones;
    }

    /**
     * Determina il tipo di zona
     */
    determineZoneType(zone) {
        // Conta feature vicine
        let nearRiver = 0;
        let nearPath = 0;
        
        for (const cell of zone.cells) {
            if (this.isNearFeature(cell.x, cell.y, 'river')) nearRiver++;
            if (this.isNearFeature(cell.x, cell.y, 'path')) nearPath++;
        }
        
        // Determina tipo
        if (nearRiver > zone.cells.length * 0.3) return 'riverside';
        if (nearPath > zone.cells.length * 0.3) return 'roadside';
        if (zone.cells.length > 4) return 'clearing';
        
        return 'forest';
    }

    /**
     * Seleziona tile di riempimento
     */
    selectFillTile(x, y, zoneType) {
        const roll = Math.random();
        
        switch (zoneType) {
            case 'riverside':
                if (roll < 0.6) return 'erba_base';
                if (roll < 0.8) return 'cespuglio';
                return 'roccia_grande';
                
            case 'roadside':
                if (roll < 0.5) return 'erba_base';
                if (roll < 0.75) return 'cespuglio';
                if (roll < 0.9) return 'albero_medio';
                return 'funghi';
                
            case 'clearing':
                if (roll < 0.7) return 'radura_aperta';
                if (roll < 0.85) return 'radura_fiori';
                return 'cespuglio_fiori';
                
            case 'forest':
            default:
                if (roll < 0.25) return 'erba_base';
                if (roll < 0.45) return 'albero_grande';
                if (roll < 0.6) return 'albero_medio';
                if (roll < 0.72) return 'albero_pino';
                if (roll < 0.82) return 'alberi_doppi';
                if (roll < 0.9) return 'cespuglio';
                if (roll < 0.95) return 'tronco_caduto';
                return 'funghi';
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // FASE 3: POST-PROCESSING
    // ═══════════════════════════════════════════════════════════════

    /**
     * Assicura che la mappa sia esplorabile
     */
    ensureConnectivity() {
        // Verifica che ci sia almeno 60% passabile
        let passable = 0;
        const total = this.width * this.height;
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tileId = this.grid[y][x].tileId;
                if (this.isPassableTile(tileId)) {
                    passable++;
                }
            }
        }
        
        const passablePercent = passable / total;
        
        // Se troppo denso, rimuovi alcuni ostacoli
        if (passablePercent < 0.6) {
            this.thinOutObstacles();
        }
        
        // Correggi tile sentiero/fiume
        this.fixLinearTiles();
    }

    /**
     * Rimuove alcuni ostacoli
     */
    thinOutObstacles() {
        const obstacles = [];
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (!this.isPassableTile(this.grid[y][x].tileId)) {
                    obstacles.push({ x, y });
                }
            }
        }
        
        // Rimuovi casualmente
        const toRemove = Math.ceil(obstacles.length * 0.3);
        
        for (let i = 0; i < toRemove && obstacles.length > 0; i++) {
            const idx = Math.floor(Math.random() * obstacles.length);
            const cell = obstacles.splice(idx, 1)[0];
            this.grid[cell.y][cell.x].tileId = 'erba_base';
        }
    }

    /**
     * Corregge orientamento tile lineari
     */
    fixLinearTiles() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tileId = this.grid[y][x].tileId;
                
                // Correggi sentieri
                if (tileId === 'sentiero_h' || tileId === 'sentiero_v') {
                    this.grid[y][x].tileId = this.determineCorrectPathTile(x, y);
                }
                
                // Correggi fiumi
                if (tileId === 'ruscello_h' || tileId === 'ruscello_v') {
                    this.grid[y][x].tileId = this.determineCorrectRiverTile(x, y);
                }
            }
        }
    }

    /**
     * Determina tile sentiero corretto
     */
    determineCorrectPathTile(x, y) {
        const neighbors = this.getPathNeighbors(x, y);
        
        // Incrocio
        if (neighbors.count >= 3) return 'incrocio';
        
        // Curva o linea
        if (neighbors.top || neighbors.bottom) {
            if (neighbors.left || neighbors.right) {
                return 'curva_sentiero'; // FIXME: dovrebbe determinare la rotazione corretta
            }
            return 'sentiero_v';
        }
        
        if (neighbors.left || neighbors.right) {
            return 'sentiero_h';
        }
        
        return 'sentiero_h';
    }

    /**
     * Determina tile fiume corretto
     */
    determineCorrectRiverTile(x, y) {
        const hasTop = y > 0 && this.grid[y-1][x].feature === 'river';
        const hasBottom = y < this.height-1 && this.grid[y+1][x].feature === 'river';
        const hasLeft = x > 0 && this.grid[y][x-1].feature === 'river';
        const hasRight = x < this.width-1 && this.grid[y][x+1].feature === 'river';
        
        // Verticale
        if ((hasTop || hasBottom) && !hasLeft && !hasRight) {
            return 'ruscello_v';
        }
        
        // Orizzontale
        if ((hasLeft || hasRight) && !hasTop && !hasBottom) {
            return 'ruscello_h';
        }
        
        // Curva o laghetto
        if ((hasTop || hasBottom) && (hasLeft || hasRight)) {
            return 'laghetto';
        }
        
        return 'ruscello_h';
    }

    // ═══════════════════════════════════════════════════════════════
    // UTILITY
    // ═══════════════════════════════════════════════════════════════

    getFreeCells() {
        const cells = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x].feature === null) {
                    cells.push({ x, y });
                }
            }
        }
        return cells;
    }

    isFreeCell(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
        return this.grid[y][x].feature === null;
    }

    isNearFeature(x, y, feature) {
        const neighbors = [
            { x: x - 1, y }, { x: x + 1, y },
            { x, y: y - 1 }, { x, y: y + 1 }
        ];
        
        for (const n of neighbors) {
            if (n.x >= 0 && n.x < this.width && n.y >= 0 && n.y < this.height) {
                if (this.grid[n.y][n.x].feature === feature) return true;
            }
        }
        
        return false;
    }

    isPassableTile(tileId) {
        const passableTiles = [
            'erba_base', 'radura_aperta', 'radura_fiori',
            'cespuglio', 'cespuglio_fiori', 'funghi',
            'sentiero_h', 'sentiero_v', 'incrocio',
            'ruscello_h', 'ruscello_v', 'ponte',
            'rovine', 'pozzo', 'campo_falo'
        ];
        return passableTiles.includes(tileId);
    }

    /**
     * Ottiene solo gli ID dei tile
     */
    getTileIds() {
        const result = [];
        for (let y = 0; y < this.height; y++) {
            result[y] = [];
            for (let x = 0; x < this.width; x++) {
                result[y][x] = this.grid[y][x].tileId || 'erba_base';
            }
        }
        return result;
    }
}

export default MapGenerator;
