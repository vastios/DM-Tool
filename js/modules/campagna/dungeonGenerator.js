import { monsterDatabase } from '../../../database/monsterDatabase.js';

const DungeonGenerator = {
    state: {
        rooms: {}, // Database delle stanze generate: { id: { data, grid, exits } }
        currentRoomId: null,
        nextRoomId: 1
    },

    data: {
        types: ["Cripta", "Laboratorio", "Prigione", "Santuario", "Corridoio", "Miniera", "Tempio", "Fossa", "Archivio", "Armeria"],
        atmospheres: ["Aria pesante.", "Gelo innaturale.", "Nebbia sottile.", "Silenzio assordante."],
        shapes: ["rettangolo", "corridoio_h", "corridoio_v", "irregolare"],
        loot: [{ item: "Monete", rarity: "Comune" }, { item: "Pozione", rarity: "Rara" }]
    },

    render(containerElement) {
        containerElement.innerHTML = `
            <div class="dg-container">
                <aside class="dg-controls">
                    <div class="dg-card">
                        <h2><i class="fas fa-door-open"></i> Navigazione</h2>
                        <div id="navigation-info">Nessuna stanza attiva</div>
                        <button id="reset-dungeon" class="btn-util" style="margin-top:10px">Reset Dungeon</button>
                    </div>
                    <div id="room-info" class="dg-card info-panel"></div>
                    <div class="dg-card">
                        <button id="add-monster" class="btn-secondary">Evoca Mostro</button>
                        <button id="add-loot" class="btn-secondary">Cerca Loot</button>
                    </div>
                </aside>

                <main class="dg-display">
                    <div class="dg-legend">
                        <span class="leg-item"><b style="color:#00ff00">#</b> Muro</span>
                        <span class="leg-item"><b style="color:#ffffff">.</b> Pavimento</span>
                        <span class="leg-item"><b style="color:#00d4ff">+</b> Porta (Clicca)</span>
                        <span class="leg-item"><b style="color:#ff4444">M</b> Mostro</span>
                    </div>

                    <div class="map-wrapper">
                        <div class="compass north">N</div>
                        <div class="compass south">S</div>
                        <div class="compass west">O</div>
                        <div class="compass east">E</div>
                        <div id="ascii-canvas" class="ascii-canvas"></div>
                    </div>
                </main>
            </div>
        `;
        this.initEventListeners(containerElement);
        // Genera la prima stanza automaticamente
        if (!this.state.currentRoomId) this.generateNewRoom(containerElement);
    },

    initEventListeners(container) {
        container.querySelector('#reset-dungeon').onclick = () => {
            this.state.rooms = {};
            this.state.currentRoomId = null;
            this.state.nextRoomId = 1;
            this.generateNewRoom(container);
        };
        container.querySelector('#add-monster').onclick = () => this.addEntity('M ', container);
        container.querySelector('#add-loot').onclick = () => this.addEntity('$ ', container);
    },

    generateNewRoom(container, fromDir = null) {
        const id = this.state.nextRoomId++;
        const shape = this.data.shapes[Math.floor(Math.random() * this.data.shapes.length)];
        
        // Definiamo dimensioni in base alla forma
        let w = 12, h = 8;
        if (shape === "corridoio_h") { w = 20; h = 4; }
        if (shape === "corridoio_v") { w = 6; h = 14; }

        let grid = Array.from({ length: h }, () => Array(w).fill(". "));
        
        // Creazione mura e bordi
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (y === 0 || y === h - 1 || x === 0 || x === w - 1) grid[y][x] = "##";
                if (shape === "irregolare" && Math.random() > 0.8) grid[y][x] = "##";
            }
        }

        // Aggiunta Porte casuali (1-3 porte)
        const exits = {};
        const numExits = Math.floor(Math.random() * 3) + 1;
        const dirs = ['N', 'S', 'E', 'O'];

        for (let i = 0; i < numExits; i++) {
            const d = dirs[Math.floor(Math.random() * dirs.length)];
            let py = 0, px = 0;
            if (d === 'N') { py = 0; px = Math.floor(w/2); }
            if (d === 'S') { py = h-1; px = Math.floor(w/2); }
            if (d === 'E') { py = Math.floor(h/2); px = w-1; }
            if (d === 'O') { py = Math.floor(h/2); px = 0; }
            
            grid[py][px] = `<span class="door" data-dir="${d}">+ </span>`;
            exits[d] = null; // Sarà l'ID della stanza collegata
        }

        this.state.rooms[id] = {
            id,
            type: shape === "corridoio_h" || shape === "corridoio_v" ? "Corridoio" : this.data.types[Math.floor(Math.random() * this.data.types.length)],
            grid,
            exits,
            description: this.data.atmospheres[Math.floor(Math.random() * this.data.atmospheres.length)]
        };

        this.switchRoom(id, container);
    },

    switchRoom(id, container) {
        this.state.currentRoomId = id;
        this.renderMap(container);
    },

    renderMap(container) {
        const room = this.state.rooms[this.state.currentRoomId];
        const canvas = container.querySelector('#ascii-canvas');
        
        // Render della griglia (usiamo innerHTML perché abbiamo le porte cliccabili)
        canvas.innerHTML = room.grid.map(row => row.join('')).join('\n');

        // Info pannello
        container.querySelector('#room-info').innerHTML = `
            <h3>Stanza #${room.id}: ${room.type}</h3>
            <p><em>${room.description}</em></p>
        `;

        container.querySelector('#navigation-info').innerText = `Ti trovi nella Stanza #${room.id}`;

        // Eventi sulle porte
        canvas.querySelectorAll('.door').forEach(doorEl => {
            doorEl.onclick = () => {
                const dir = doorEl.dataset.dir;
                if (!room.exits[dir]) {
                    // Crea nuova stanza se non esiste
                    this.generateNewRoom(container, dir);
                    room.exits[dir] = this.state.currentRoomId; // Collega
                } else {
                    this.switchRoom(room.exits[dir], container);
                }
            };
        });
    },

    addEntity(symbol, container) {
        const room = this.state.rooms[this.state.currentRoomId];
        // Posiziona casualmente al centro
        const y = Math.floor(room.grid.length / 2);
        const x = Math.floor(room.grid[0].length / 2);
        room.grid[y][x] = `<span style="color: ${symbol === 'M ' ? '#ff4444' : '#ffcc00'}">${symbol}</span>`;
        this.renderMap(container);
    }
};

export default DungeonGenerator;