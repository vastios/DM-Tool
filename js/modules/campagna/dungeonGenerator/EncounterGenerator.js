/**
 * EncounterGenerator.js
 * ─────────────────────────────────────────────────────────────
 * Generatore di incontri e tesori coerenti con la mappa.
 * 
 * Considera:
 * - Posizione tile (POI, nascondigli, aree aperte)
 * - Livello party
 * - Tipi mostri appropriati al bioma
 * - Difficoltà bilanciata
 * 
 * @version 1.0.0
 */

import { rollDice } from '../../../../utils/dice.js';

export class EncounterGenerator {
    constructor() {
        this.monsterDatabase = null;
        this.tileDatabase = null;
        this.biomeConfig = null;
    }

    /**
     * Configura il generatore
     * @param {Object} config 
     */
    configure(config) {
        this.monsterDatabase = config.monsterDatabase;
        this.tileDatabase = config.tileDatabase;
        this.biomeConfig = config.biomeConfig;
        return this;
    }

    /**
     * Genera incontri per la mappa
     * @param {Array<Array<string>>} grid 
     * @param {number} partyLevel 
     * @returns {Array<Object>}
     */
    generateEncounters(grid, partyLevel) {
        if (!grid || grid.length === 0) return [];
        
        const encounters = [];
        const height = grid.length;
        const width = grid[0].length;
        const encounterDensity = this.biomeConfig?.encounterDensity || 0.12;
        
        // Calcola numero incontri
        const totalCells = width * height;
        const numEncounters = Math.floor(totalCells * encounterDensity);
        
        // Trova celle candidate per incontri
        const candidates = this.findEncounterCandidates(grid);
        
        if (candidates.length === 0) {
            console.warn('⚠️ [EncounterGenerator] Nessuna cella adatta per incontri');
            return [];
        }
        
        // Filtra mostri appropriati
        const suitableMonsters = this.getSuitableMonsters(partyLevel);
        
        if (suitableMonsters.length === 0) {
            console.warn('⚠️ [EncounterGenerator] Nessun mostro adatto trovato');
            return [];
        }
        
        // Genera incontri
        const usedPositions = new Set();
        
        for (let i = 0; i < numEncounters && candidates.length > 0; i++) {
            // Scegli una cella candidato
            const candidateIndex = Math.floor(Math.random() * candidates.length);
            const candidate = candidates.splice(candidateIndex, 1)[0];
            
            // Evita posizioni già usate
            const posKey = `${candidate.x},${candidate.y}`;
            if (usedPositions.has(posKey)) continue;
            usedPositions.add(posKey);
            
            // Scegli un mostro
            const monster = this.selectWeightedMonster(suitableMonsters, candidate);
            
            // Calcola numero mostri
            const count = this.calculateMonsterCount(monster, partyLevel);
            
            // Calcola XP
            const xp = (monster.xp || 0) * count;
            
            encounters.push({
                id: `enc_${i}`,
                monster: monster,
                count: count,
                position: { x: candidate.x, y: candidate.y },
                cr: monster.challenge_rating,
                xp: xp,
                difficulty: this.calculateDifficulty(monster, count, partyLevel),
                context: candidate.context // 'poi', 'ambush', 'patrol', etc.
            });
        }
        
        console.log(`⚔️ [EncounterGenerator] Generati ${encounters.length} incontri`);
        return encounters;
    }

    /**
     * Trova celle candidate per incontri
     */
    findEncounterCandidates(grid) {
        const candidates = [];
        const height = grid.length;
        const width = grid[0].length;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tileId = grid[y][x];
                const tile = this.tileDatabase?.getTile(tileId);
                
                if (!tile) continue;
                
                // Skip tile non passabili
                if (!tile.passable) continue;
                
                // Determina contesto
                let context = 'random';
                let priority = 1;
                
                // POI hanno priorità alta
                if (tile.isPOI) {
                    context = 'poi';
                    priority = 3;
                }
                // Rovine = ambuscata
                else if (tile.tags?.includes('rovine')) {
                    context = 'ambush';
                    priority = 2;
                }
                // Vicino ad acqua = mostri acquatici
                else if (this.isNearWater(grid, x, y)) {
                    context = 'water';
                    priority = 2;
                }
                // Sentiero = pattuglia
                else if (tile.category === 'sentiero') {
                    context = 'patrol';
                    priority = 1.5;
                }
                // Folto = nascondiglio
                else if (tile.tags?.some(t => ['albero', 'cespuglio', 'foliage'].includes(t))) {
                    context = 'hidden';
                    priority = 1.2;
                }
                
                // Aggiungi candidato (più volte per priorità)
                for (let i = 0; i < priority; i++) {
                    candidates.push({ x, y, context, tile });
                }
            }
        }
        
        return candidates;
    }

    /**
     * Verifica se una cella è vicino all'acqua
     */
    isNearWater(grid, x, y) {
        const directions = [
            { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
            { dx: -1, dy: 0 }, { dx: 1, dy: 0 }
        ];
        
        for (const dir of directions) {
            const nx = x + dir.dx;
            const ny = y + dir.dy;
            
            if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[0].length) {
                const neighborTile = this.tileDatabase?.getTile(grid[ny][nx]);
                if (neighborTile?.category === 'acqua') {
                    return true;
                }
            }
        }
        
        return false;
    }

    /**
     * Ottiene mostri adatti al bioma e livello
     */
    getSuitableMonsters(partyLevel) {
        if (!this.monsterDatabase) return [];
        
        const biomeTypes = this.biomeConfig?.monsterTypes || [];
        const crRange = this.biomeConfig?.crRange || { min: 0.25, max: 10 };
        
        // Calcola CR range appropriato
        const minCR = crRange.min;
        const maxCR = Math.min(crRange.max, Math.ceil(partyLevel * 1.5));
        
        return this.monsterDatabase.filter(monster => {
            // Verifica tipo
            const typeMatch = biomeTypes.includes(monster.type);
            
            // Verifica CR
            const cr = monster.challenge_rating;
            const crMatch = typeof cr === 'number' && cr >= minCR && cr <= maxCR;
            
            return typeMatch && crMatch;
        });
    }

    /**
     * Seleziona un mostro pesato per contesto
     */
    selectWeightedMonster(monsters, candidate) {
        // Pesata per contesto
        const weightedMonsters = monsters.map(monster => {
            let weight = 1;
            
            // Mostri acquatici vicino all'acqua
            if (candidate.context === 'water' && 
                (monster.type === 'beast' && monster.swimSpeed)) {
                weight *= 3;
            }
            
            // Undead nelle rovine
            if (candidate.context === 'ambush' && monster.type === 'undead') {
                weight *= 2;
            }
            
            // Fey in contesti magici
            if (candidate.context === 'poi' && monster.type === 'fey') {
                weight *= 1.5;
            }
            
            return { monster, weight };
        });
        
        // Selezione pesata
        const totalWeight = weightedMonsters.reduce((sum, m) => sum + m.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const { monster, weight } of weightedMonsters) {
            random -= weight;
            if (random <= 0) {
                return monster;
            }
        }
        
        return monsters[0];
    }

    /**
     * Calcola numero di mostri basato su CR e livello party
     */
    calculateMonsterCount(monster, partyLevel) {
        const cr = monster.challenge_rating;
        
        // Basato su CR del mostro
        if (cr < 0.5) return rollDice('2d4');
        if (cr < 1) return rollDice('1d4');
        if (cr <= 2) return rollDice('1d4');
        if (cr <= 4) return rollDice('1d3');
        if (cr <= partyLevel) return rollDice('1d2');
        
        return 1;
    }

    /**
     * Calcola difficoltà incontro
     */
    calculateDifficulty(monster, count, partyLevel) {
        const cr = monster.challenge_rating;
        const totalCR = cr * count;
        
        // Threshold approssimativi
        if (totalCR <= partyLevel * 0.5) return 'Facile';
        if (totalCR <= partyLevel) return 'Media';
        if (totalCR <= partyLevel * 1.5) return 'Difficile';
        return 'Mortale';
    }

    /**
     * Genera tesori per la mappa
     * @param {Array<Array<string>>} grid 
     * @param {number} partyLevel 
     * @returns {Array<Object>}
     */
    generateTreasures(grid, partyLevel) {
        if (!grid || grid.length === 0) return [];
        
        const treasures = [];
        const height = grid.length;
        const width = grid[0].length;
        const treasureDensity = this.biomeConfig?.treasureDensity || 0.08;
        
        // Calcola numero tesori
        const totalCells = width * height;
        const numTreasures = Math.floor(totalCells * treasureDensity);
        
        // Trova celle candidate
        const candidates = [];
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tileId = grid[y][x];
                const tile = this.tileDatabase?.getTile(tileId);
                
                if (!tile) continue;
                
                // POI hanno più probabilità
                if (tile.isPOI || tile.treasureChance) {
                    candidates.push({ x, y, tile, bonus: tile.treasureChance || 10 });
                }
                // Celle normali
                else if (tile.passable && tile.category !== 'acqua') {
                    candidates.push({ x, y, tile, bonus: 0 });
                }
            }
        }
        
        // Genera tesori
        const usedPositions = new Set();
        
        for (let i = 0; i < numTreasures && candidates.length > 0; i++) {
            // Scegli candidato con bonus
            const weighted = candidates.map(c => ({ ...c, weight: 1 + c.bonus }));
            const totalWeight = weighted.reduce((sum, c) => sum + c.weight, 0);
            let random = Math.random() * totalWeight;
            
            let selected = weighted[0];
            for (const c of weighted) {
                random -= c.weight;
                if (random <= 0) {
                    selected = c;
                    break;
                }
            }
            
            // Rimuovi dai candidati
            const idx = candidates.findIndex(c => c.x === selected.x && c.y === selected.y);
            if (idx >= 0) candidates.splice(idx, 1);
            
            // Evita duplicati
            const posKey = `${selected.x},${selected.y}`;
            if (usedPositions.has(posKey)) continue;
            usedPositions.add(posKey);
            
            // Genera tesoro
            const treasure = this.generateTreasureItem(partyLevel, selected.tile);
            
            treasures.push({
                id: `treas_${i}`,
                ...treasure,
                position: { x: selected.x, y: selected.y },
                hidden: selected.tile.tags?.includes('nascosto') || false
            });
        }
        
        console.log(`💎 [EncounterGenerator] Generati ${treasures.length} tesori`);
        return treasures;
    }

    /**
     * Genera un singolo tesoro
     */
    generateTreasureItem(partyLevel, tile) {
        // Tabella tesori per livello
        const treasureTables = {
            low: [
                { name: 'Monete di rame', type: 'coins', min: 10, max: 100 },
                { name: 'Monete d\'argento', type: 'coins', min: 5, max: 50 },
                { name: 'Pozione Curativa Minore', type: 'potion', value: '50mo' },
                { name: 'Gemma Grezza', type: 'gem', value: '10mo' }
            ],
            medium: [
                { name: 'Monete d\'oro', type: 'coins', min: 20, max: 200 },
                { name: 'Pozione Curativa', type: 'potion', value: '150mo' },
                { name: 'Gemma Preziosa', type: 'gem', value: '50mo' },
                { name: 'Pergamena Incantesimo 1° liv', type: 'scroll', value: '100mo' },
                { name: 'Arma +1', type: 'weapon', value: '500mo' }
            ],
            high: [
                { name: 'Forziere d\'oro', type: 'coins', min: 100, max: 1000 },
                { name: 'Pozione Superiore', type: 'potion', value: '500mo' },
                { name: 'Gemma Rara', type: 'gem', value: '200mo' },
                { name: 'Pergamena Rara', type: 'scroll', value: '300mo' },
                { name: 'Oggetto Magico Minore', type: 'magic', value: '1000mo' }
            ]
        };
        
        // Seleziona tabella basata su livello
        let table;
        if (partyLevel <= 3) table = treasureTables.low;
        else if (partyLevel <= 8) table = treasureTables.medium;
        else table = treasureTables.high;
        
        // Seleziona tesoro casuale
        const treasure = table[Math.floor(Math.random() * table.length)];
        
        // Aggiungi quantità se applicable
        let details = '';
        if (treasure.min && treasure.max) {
            const amount = Math.floor(Math.random() * (treasure.max - treasure.min + 1)) + treasure.min;
            details = ` (${amount})`;
        }
        
        return {
            ...treasure,
            details,
            description: this.generateTreasureDescription(treasure)
        };
    }

    /**
     * Genera descrizione tesoro
     */
    generateTreasureDescription(treasure) {
        const descriptors = {
            coins: ['lucide', 'ossidate', 'antiche', 'misteriose'],
            potion: ['scintillante', 'opaca', 'effervescente', 'profumata'],
            gem: ['splendente', 'intagliata', 'grezza', 'preziosa'],
            scroll: ['logora', 'intatta', 'illuminata', 'criptica'],
            weapon: ['affilata', 'decorata', 'antica', 'emanante luce'],
            magic: ['pulsante di energia', 'coperto di rune', 'lucente', 'misterioso']
        };
        
        const descList = descriptors[treasure.type] || ['interessante'];
        const desc = descList[Math.floor(Math.random() * descList.length)];
        
        return `${treasure.name} ${desc}`;
    }
}

export default EncounterGenerator;
