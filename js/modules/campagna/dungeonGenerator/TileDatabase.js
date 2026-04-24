/**
 * TileDatabase.js
 * ─────────────────────────────────────────────────────────────
 * Gestione del database dei tiles e dei constraints di compatibilità.
 * 
 * Funzionalità:
 * - Caricamento tiles da JSON
 * - Gestione rotazioni tile
 * - Verifica compatibilità socket
 * - Query per categoria/tag
 * 
 * @version 1.0.0
 */

export class TileDatabase {
    constructor() {
        this.tiles = new Map();
        this.socketCompatibility = {};
        this.generationRules = {};
        this.biomeConfig = null;
        this.loaded = false;
    }

    /**
     * Carica il database da file JSON
     * @param {string} jsonPath - Percorso al file tiles.json
     */
    async load(jsonPath) {
        try {
            const response = await fetch(jsonPath);
            
            if (!response.ok) {
                throw new Error(`Impossibile caricare ${jsonPath}`);
            }
            
            const data = await response.json();
            
            // Salva config biome
            this.biomeConfig = {
                name: data.name,
                description: data.description,
                monsterTypes: data.monsterTypes,
                crRange: data.crRange,
                encounterDensity: data.encounterDensity,
                treasureDensity: data.treasureDensity
            };
            
            // Salva compatibilità socket
            this.socketCompatibility = data.socketCompatibility || {};
            
            // Salva regole generazione
            this.generationRules = data.generationRules || {};
            
            // Processa e salva i tiles
            this.tiles.clear();
            
            for (const tile of data.tiles) {
                this.tiles.set(tile.id, {
                    ...tile,
                    // Calcola il file corretto (per le rotazioni)
                    actualFile: tile.file
                });
            }
            
            // Genera automaticamente tiles composti e varianti
            this.generateDerivedTiles();
            
            this.loaded = true;
            
            console.log(`✅ [TileDatabase] Caricati ${this.tiles.size} tiles`);
            console.log(`📊 [TileDatabase] Socket types:`, Object.keys(this.socketCompatibility));
            
        } catch (error) {
            console.error('❌ [TileDatabase] Errore caricamento:', error);
            throw error;
        }
    }

    /**
     * Genera tiles derivati (rotazioni, varianti)
     */
    generateDerivedTiles() {
        // Per ogni tile che ha rotazioni definite, assicurati che esistano
        const tilesToAdd = [];
        
        for (const [id, tile] of this.tiles) {
            if (tile.rotations && !tile.isRotation) {
                for (const rotId of tile.rotations) {
                    if (!this.tiles.has(rotId)) {
                        console.warn(`⚠️ [TileDatabase] Rotazione mancante: ${rotId} (da ${id})`);
                    }
                }
            }
        }
        
        // Aggiungi tiles mancanti
        for (const tile of tilesToAdd) {
            this.tiles.set(tile.id, tile);
        }
    }

    /**
     * Ottiene un tile per ID
     * @param {string} tileId 
     * @returns {Object|null}
     */
    getTile(tileId) {
        return this.tiles.get(tileId) || null;
    }

    /**
     * Ottiene tutti gli ID dei tile
     * @returns {string[]}
     */
    getAllTileIds() {
        return Array.from(this.tiles.keys()).filter(id => {
            const tile = this.tiles.get(id);
            // Escludi tiles con peso 0 (sono solo varianti rotazionali)
            return tile.weight > 0;
        });
    }

    /**
     * Ottiene tutti i tiles
     * @returns {Object[]}
     */
    getAllTiles() {
        return Array.from(this.tiles.values());
    }

    /**
     * Verifica se due socket sono compatibili
     * @param {string} socketA 
     * @param {string} socketB 
     * @returns {boolean}
     */
    areSocketsCompatible(socketA, socketB) {
        // Socket identici sono sempre compatibili
        if (socketA === socketB) return true;
        
        // Verifica nella tabella di compatibilità
        const compatA = this.socketCompatibility[socketA];
        if (compatA && compatA.includes(socketB)) return true;
        
        const compatB = this.socketCompatibility[socketB];
        if (compatB && compatB.includes(socketA)) return true;
        
        return false;
    }

    /**
     * Ottiene tiles per categoria
     * @param {string} category 
     * @returns {Object[]}
     */
    getTilesByCategory(category) {
        return this.getAllTiles().filter(t => t.category === category);
    }

    /**
     * Ottiene tiles per tag
     * @param {string} tag 
     * @returns {Object[]}
     */
    getTilesByTag(tag) {
        return this.getAllTiles().filter(t => t.tags && t.tags.includes(tag));
    }

    /**
     * Ottiene tiles passabili
     * @returns {Object[]}
     */
    getPassableTiles() {
        return this.getAllTiles().filter(t => t.passable);
    }

    /**
     * Ottiene tiles ostacolo
     * @returns {Object[]}
     */
    getObstacleTiles() {
        return this.getAllTiles().filter(t => !t.passable);
    }

    /**
     * Ottiene POI (Punti di Interesse)
     * @returns {Object[]}
     */
    getPOITiles() {
        return this.getAllTiles().filter(t => t.isPOI);
    }

    /**
     * Ottiene tiles che richiedono un percorso vicino
     * @returns {Object[]}
     */
    getPathRequiredTiles() {
        return this.getAllTiles().filter(t => t.requiresPath);
    }

    /**
     * Ottiene tiles che richiedono acqua
     * @returns {Object[]}
     */
    getWaterRequiredTiles() {
        return this.getAllTiles().filter(t => t.requiresWater);
    }

    /**
     * Ottiene il percorso file corretto per un tile
     * @param {string} tileId 
     * @returns {string}
     */
    getTileFilePath(tileId) {
        const tile = this.tiles.get(tileId);
        if (!tile) return null;
        
        // Se è una rotazione, usa il file del tile originale
        if (tile.isRotation && tile.rotationOf) {
            const originalTile = this.tiles.get(tile.rotationOf);
            return originalTile ? originalTile.file : tile.file;
        }
        
        return tile.file;
    }

    /**
     * Ottiene la configurazione del bioma
     * @returns {Object}
     */
    getBiomeConfig() {
        return this.biomeConfig;
    }

    /**
     * Ottiene le regole di generazione
     * @returns {Object}
     */
    getGenerationRules() {
        return this.generationRules;
    }

    /**
     * Calcola il peso totale dei tiles
     * @returns {number}
     */
    getTotalWeight() {
        return this.getAllTiles()
            .filter(t => t.weight > 0)
            .reduce((sum, t) => sum + t.weight, 0);
    }

    /**
     * Seleziona un tile casuale pesato
     * @param {string[]} excludeIds - IDs da escludere
     * @returns {string}
     */
    selectWeightedRandom(excludeIds = []) {
        const candidates = this.getAllTiles()
            .filter(t => t.weight > 0 && !excludeIds.includes(t.id));
        
        const totalWeight = candidates.reduce((sum, t) => sum + t.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const tile of candidates) {
            random -= tile.weight;
            if (random <= 0) {
                return tile.id;
            }
        }
        
        return candidates[0]?.id || 'erba_base';
    }

    /**
     * Ottiene tiles compatibili con un dato socket in una direzione
     * @param {string} socket 
     * @param {string} direction 
     * @returns {string[]}
     */
    getCompatibleTiles(socket, direction) {
        const compatible = [];
        
        for (const [id, tile] of this.tiles) {
            if (tile.weight <= 0) continue;
            
            const tileSocket = tile.sockets?.[direction];
            if (tileSocket && this.areSocketsCompatible(socket, tileSocket)) {
                compatible.push(id);
            }
        }
        
        return compatible;
    }

    /**
     * Verifica se il database è caricato
     * @returns {boolean}
     */
    isLoaded() {
        return this.loaded;
    }
}

export default TileDatabase;
