/**
 * MapRenderer.js
 * ─────────────────────────────────────────────────────────────
 * Renderer per le mappe generate dal WFC Engine.
 * 
 * Supporta:
 * - Rendering a tiles grafici
 * - Overlay per incontri e tesori
 * - Info tooltip sui tile
 * - Esportazione immagine
 * 
 * @version 1.0.0
 */

export class MapRenderer {
    constructor(options = {}) {
        this.options = {
            tileSize: options.tileSize || 64,
            showGrid: options.showGrid || false,
            highlightPOI: options.highlightPOI || true,
            ...options
        };
        
        this.container = null;
        this.grid = null;
        this.encounters = [];
        this.treasures = [];
        this.tileDatabase = null;
        this.tilesPath = '';
    }

    /**
     * Configura il renderer
     * @param {Object} config 
     */
    configure(config) {
        this.tileDatabase = config.tileDatabase;
        this.tilesPath = config.tilesPath || '';
        return this;
    }

    /**
     * Renderizza la mappa nel container
     * @param {HTMLElement} container 
     * @param {Array<Array<string>>} grid 
     * @param {Object} data - Dati aggiuntivi (encounters, treasures)
     */
    render(container, grid, data = {}) {
        this.container = container;
        this.grid = grid;
        this.encounters = data.encounters || [];
        this.treasures = data.treasures || [];
        
        if (!grid || grid.length === 0) {
            container.innerHTML = this.renderEmptyState();
            return;
        }
        
        const height = grid.length;
        const width = grid[0].length;
        
        // Calcola dimensione tile ottimale
        const containerWidth = container.clientWidth || 500;
        const containerHeight = container.clientHeight || 400;
        const optimalSize = Math.min(
            Math.floor(containerWidth / width) - 4,
            Math.floor(containerHeight / height) - 4,
            128
        );
        this.options.tileSize = Math.max(optimalSize, 32);
        
        let html = `<div class="wfc-map-grid" style="grid-template-columns: repeat(${width}, ${this.options.tileSize}px);">`;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tileId = grid[y][x];
                const tile = this.tileDatabase?.getTile(tileId);
                const filePath = this.tileDatabase?.getTileFilePath(tileId);
                
                // Verifica se c'è un incontro o tesoro su questa cella
                const encounter = this.encounters.find(e => e.position.x === x && e.position.y === y);
                const treasure = this.treasures.find(t => t.position.x === x && t.position.y === y);
                
                const markerClass = encounter ? 'has-encounter' : (treasure ? 'has-treasure' : '');
                const poiClass = tile?.isPOI ? 'is-poi' : '';
                const passableClass = tile?.passable ? 'passable' : 'obstacle';
                
                html += `
                    <div class="wfc-tile ${markerClass} ${poiClass} ${passableClass}" 
                         data-x="${x}" data-y="${y}"
                         data-tile-id="${tileId}"
                         data-passable="${tile?.passable || false}"
                         data-category="${tile?.category || 'unknown'}"
                         title="${this.getTileTooltip(tile, x, y, encounter, treasure)}">
                        <img src="${this.tilesPath}${filePath}" 
                             alt="${tile?.name || tileId}"
                             width="${this.options.tileSize}" 
                             height="${this.options.tileSize}"
                             loading="lazy"
                             onerror="this.src='${this.tilesPath}01_erba_base.png'">
                        ${this.renderMarkers(encounter, treasure)}
                    </div>
                `;
            }
        }
        
        html += '</div>';
        container.innerHTML = html;
        
        // Registra event listeners
        this.bindEvents();
    }

    /**
     * Renderizza lo stato vuoto
     */
    renderEmptyState() {
        return `
            <div class="wfc-placeholder">
                <div class="wfc-placeholder-icon">🗺️</div>
                <p>Clicca <strong>"Genera Mappa"</strong> per creare una nuova area</p>
                <p class="wfc-placeholder-hint">L'algoritmo WFC genererà una mappa coerente con connessioni logiche</p>
            </div>
        `;
    }

    /**
     * Renderizza i marker (incontri, tesori)
     */
    renderMarkers(encounter, treasure) {
        let html = '';
        
        if (encounter) {
            html += `<span class="wfc-marker encounter" title="${encounter.monster.name} x${encounter.count}">⚔️</span>`;
        }
        
        if (treasure) {
            html += `<span class="wfc-marker treasure" title="${treasure.name}">💎</span>`;
        }
        
        return html;
    }

    /**
     * Genera il tooltip per un tile
     */
    getTileTooltip(tile, x, y, encounter, treasure) {
        let tip = tile?.name || 'Sconosciuto';
        tip += ` (${x},${y})`;
        
        if (encounter) {
            tip += ` | Incontro: ${encounter.monster.name} x${encounter.count}`;
        }
        
        if (treasure) {
            tip += ` | Tesoro: ${treasure.name}`;
        }
        
        return tip;
    }

    /**
     * Registra event listeners
     */
    bindEvents() {
        if (!this.container) return;
        
        // Click sui tile
        this.container.querySelectorAll('.wfc-tile').forEach(tileEl => {
            tileEl.addEventListener('click', (e) => {
                const x = parseInt(tileEl.dataset.x);
                const y = parseInt(tileEl.dataset.y);
                this.onTileClick(x, y, tileEl.dataset.tileId, e);
            });
            
            // Hover effect
            tileEl.addEventListener('mouseenter', () => {
                tileEl.classList.add('hovered');
            });
            
            tileEl.addEventListener('mouseleave', () => {
                tileEl.classList.remove('hovered');
            });
        });
    }

    /**
     * Handler click su tile
     */
    onTileClick(x, y, tileId, event) {
        const tile = this.tileDatabase?.getTile(tileId);
        const encounter = this.encounters.find(e => e.position.x === x && e.position.y === y);
        const treasure = this.treasures.find(t => t.position.x === x && t.position.y === y);
        
        // Emetti evento custom
        const customEvent = new CustomEvent('tileClick', {
            detail: { x, y, tileId, tile, encounter, treasure },
            bubbles: true
        });
        
        this.container.dispatchEvent(customEvent);
    }

    /**
     * Evidenzia una cella
     */
    highlightCell(x, y, className = 'highlighted') {
        if (!this.container) return;
        
        const cell = this.container.querySelector(`.wfc-tile[data-x="${x}"][data-y="${y}"]`);
        if (cell) {
            cell.classList.add(className);
        }
    }

    /**
     * Rimuove evidenziazione
     */
    clearHighlights() {
        if (!this.container) return;
        
        this.container.querySelectorAll('.wfc-tile.highlighted').forEach(el => {
            el.classList.remove('highlighted');
        });
    }

    /**
     * Esporta la mappa come immagine (Canvas)
     * @returns {Promise<Blob>}
     */
    async exportAsImage() {
        if (!this.grid || this.grid.length === 0) {
            throw new Error('Nessuna mappa da esportare');
        }
        
        const height = this.grid.length;
        const width = this.grid[0].length;
        const tileSize = this.options.tileSize;
        
        // Crea canvas
        const canvas = document.createElement('canvas');
        canvas.width = width * tileSize;
        canvas.height = height * tileSize;
        
        const ctx = canvas.getContext('2d');
        
        // Carica e disegna ogni tile
        const promises = [];
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tileId = this.grid[y][x];
                const filePath = this.tileDatabase?.getTileFilePath(tileId);
                
                if (filePath) {
                    promises.push(this.drawTile(ctx, x, y, `${this.tilesPath}${filePath}`, tileSize));
                }
            }
        }
        
        await Promise.all(promises);
        
        // Disegna marker
        for (const encounter of this.encounters) {
            this.drawMarker(ctx, encounter.position.x, encounter.position.y, '⚔️', tileSize);
        }
        
        for (const treasure of this.treasures) {
            this.drawMarker(ctx, treasure.position.x, treasure.position.y, '💎', tileSize);
        }
        
        // Converti a blob
        return new Promise((resolve) => {
            canvas.toBlob(resolve, 'image/png');
        });
    }

    /**
     * Disegna un tile sul canvas
     */
    drawTile(ctx, x, y, src, tileSize) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, x * tileSize, y * tileSize, tileSize, tileSize);
                resolve();
            };
            img.onerror = () => {
                // Disegna placeholder
                ctx.fillStyle = '#4a7c3f';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                resolve();
            };
            img.src = src;
        });
    }

    /**
     * Disegna un marker sul canvas
     */
    drawMarker(ctx, x, y, emoji, tileSize) {
        ctx.font = `${tileSize / 3}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, x * tileSize + tileSize / 2, y * tileSize + tileSize / 4);
    }

    /**
     * Distrugge il renderer
     */
    destroy() {
        this.container = null;
        this.grid = null;
        this.encounters = [];
        this.treasures = [];
    }
}

export default MapRenderer;
