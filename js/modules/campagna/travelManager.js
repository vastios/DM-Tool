/**
 * travelManager.js
 * ─────────────────────────────────────────────────────────────
 * Modulo per la gestione dei Viaggi e Incontri in D&D 5e.
 *
 * Features:
 * - Integrazione con locationManager per selezione partenza/destinazione
 * - Calcolo distanze e giorni di viaggio
 * - Generazione incontri con mostri reali dal database
 * - Tracciamento risorse (razioni, acqua, cavalcature)
 * - Meteo dinamico con effetti sul viaggio
 * - Log del viaggio con cronologia eventi
 *
 * @version 2.0.0
 */

import { getCurrentCampaignId } from '../../../stateManager.js';
import { showToast } from '../../../utils/toast.js';
import { escapeHtml } from '../../../utils/htmlHelpers.js';
import { monsterDatabase } from '../../../database/monsterDatabase.js';

// ═══════════════════════════════════════════════════════════════
// COSTANTI E CONFIGURAZIONE
// ═══════════════════════════════════════════════════════════════

const TERRAIN_CONFIG = {
    pianura: {
        name: 'Pianura',
        icon: '🌾',
        speedMultiplier: 1,
        encounterDC: 15,
        description: 'Terreno aperto, marcia agevole',
        waterConsumption: 1,
        foragingDC: 10,
        // Tipi mostro in inglese per compatibilità con monsterDatabase
        monsterTypes: ['humanoid', 'beast', 'giant']
    },
    foresta: {
        name: 'Foresta',
        icon: '🌲',
        speedMultiplier: 0.5,
        encounterDC: 13,
        description: 'Visibilità ridotta, terreno difficile',
        waterConsumption: 1,
        foragingDC: 10,
        monsterTypes: ['beast', 'plant', 'fey', 'humanoid']
    },
    montagna: {
        name: 'Montagna',
        icon: '🏔️',
        speedMultiplier: 0.25,
        encounterDC: 16,
        description: 'Clima rigido, pericolo cadute',
        waterConsumption: 1.5,
        foragingDC: 15,
        monsterTypes: ['giant', 'dragon', 'elemental', 'monstrosity']
    },
    deserto: {
        name: 'Deserto',
        icon: '🏜️',
        speedMultiplier: 0.75,
        encounterDC: 14,
        description: 'Calore estremo, consumo acqua raddoppiato',
        waterConsumption: 2,
        foragingDC: 20,
        monsterTypes: ['elemental', 'monstrosity', 'undead', 'beast']
    },
    palude: {
        name: 'Palude',
        icon: '🌿',
        speedMultiplier: 0.5,
        encounterDC: 14,
        description: 'Terreno paludoso, malattie possibili',
        waterConsumption: 1.5,
        foragingDC: 12,
        monsterTypes: ['beast', 'plant', 'dragon', 'monstrosity']
    },
    collina: {
        name: 'Collina',
        icon: '⛰️',
        speedMultiplier: 0.75,
        encounterDC: 14,
        description: 'Terreno ondulato, buona visibilità',
        waterConsumption: 1,
        foragingDC: 12,
        monsterTypes: ['humanoid', 'beast', 'giant']
    },
    acqua: {
        name: 'Acqua/Navigazione',
        icon: '🌊',
        speedMultiplier: 1,
        encounterDC: 12,
        description: 'Viaggio per nave o barca',
        waterConsumption: 1,
        foragingDC: 18,
        monsterTypes: ['beast', 'elemental', 'dragon', 'giant']
    },
    sottosuolo: {
        name: 'Sottosuolo',
        icon: '🕳️',
        speedMultiplier: 0.5,
        encounterDC: 12,
        description: 'Grotte e tunnel, nessuna luce naturale',
        waterConsumption: 1,
        foragingDC: 25,
        monsterTypes: ['aberration', 'monstrosity', 'undead', 'elemental']
    }
};

const WEATHER_TABLE = [
    { condition: 'Sereno', icon: '☀️', temp: 'Gradevole', wind: 'Assente', modifier: 0, description: 'Cielo limpido, perfetto per viaggiare' },
    { condition: 'Soleggiato', icon: '🌤️', temp: 'Caldo', wind: 'Brezza Leggera', modifier: 0, description: 'Sole intenso, buona visibilità' },
    { condition: 'Nuvoloso', icon: '☁️', temp: 'Gradevole', wind: 'Moderato', modifier: 0, description: 'Cielo coperto, temperatura mite' },
    { condition: 'Nebbioso', icon: '🌫️', temp: 'Umido', wind: 'Assente', modifier: -2, description: 'Visibilità molto ridotta (1d4 km)' },
    { condition: 'Pioggia', icon: '🌧️', temp: 'Fresco', wind: 'Moderato', modifier: -2, description: 'Pioggia costante, terreno scivoloso' },
    { condition: 'Temporale', icon: '⛈️', temp: 'Freddo', wind: 'Molto Forte', modifier: -4, description: 'Temporale violento, difficile procedere' },
    { condition: 'Neve', icon: '🌨️', temp: 'Gelido', wind: 'Moderato', modifier: -4, description: 'Nevicata, tracce visibili, freddo intenso' },
    { condition: 'Bufera', icon: '🌀', temp: 'Gelido', wind: 'Molto Forte', modifier: -6, description: 'Bufera di neve, impossibile viaggiare' }
];

const PACE_CONFIG = {
    slow: { name: 'Lento', icon: '🐢', speedMod: 0.66, stealthAdvantage: true, description: 'Nascondere tracce, esplorare attentamente' },
    normal: { name: 'Normale', icon: '🚶', speedMod: 1, stealthAdvantage: false, description: 'Ritmo di marcia standard' },
    fast: { name: 'Veloce', icon: '🏃', speedMod: 1.33, stealthAdvantage: false, passivePenalty: -5, description: 'Marcia forzata, -5 passiva Percezione' }
};

const ENCOUNTER_TEMPLATES = {
    hostile: [
        { title: 'Imboscata!', description: 'Creature ostili tendono un\'imboscata al gruppo.' },
        { title: 'Predone sulla Strada', description: 'Un gruppo di creature blocca il passaggio.' },
        { title: 'Caccia', description: 'Un predatore sta dando la caccia al gruppo.' },
        { title: 'Territorio', description: 'Il gruppo è entrato in un territorio difeso.' }
    ],
    neutral: [
        { title: 'Viaggiatori', description: 'Un gruppo di viaggiatori incrocia il vostro cammino.' },
        { title: 'Mercanti', description: 'Una carovana di mercanti offre scambi.' },
        { title: 'Pattuglia', description: 'Una pattuglia controlla i documenti di viaggio.' },
        { title: 'Pellegrini', description: 'Un gruppo di devi in viaggio verso un tempio.' }
    ],
    friendly: [
        { title: 'Accampamento', description: 'Un accampamento amichevole offre rifugio.' },
        { title: 'Guida', description: 'Qualuno si offre di guidare il gruppo.' },
        { title: 'Rifugio', description: 'Un luogo sicuro per riposare.' },
        { title: 'Messaggero', description: 'Un messaggero porta notizie importanti.' }
    ],
    environmental: [
        { title: 'Tracce', description: 'Il gruppo trova tracce recenti di creature.' },
        { title: 'Rovine', description: 'Antiche rovine emergono dal paesaggio.' },
        { title: 'Segnale', description: 'Un segnale di fumo o luce attira l\'attenzione.' },
        { title: 'Anomalia', description: 'Qualcosa di strano attira la curiosità.' }
    ]
};

// ═══════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════

function getStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return null;
    return `dungeonMasterToolTravels_${campaignId}`;
}

function saveTravelState(state) {
    const key = getStorageKey();
    if (!key) return;
    try {
        localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
        console.error('Errore salvataggio viaggio:', e);
    }
}

function loadTravelState() {
    const key = getStorageKey();
    if (!key) return null;
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

function loadLocations() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return [];
    try {
        const data = localStorage.getItem(`dungeonMasterToolLocations_${campaignId}`);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

// ═══════════════════════════════════════════════════════════════
// UTILITÀ
// ═══════════════════════════════════════════════════════════════

function rollDice(formula) {
    const match = formula.match(/(\d+)?d(\d+)([+-]\d+)?/);
    if (!match) return 0;
    
    const num = parseInt(match[1]) || 1;
    const sides = parseInt(match[2]);
    const modifier = parseInt(match[3]) || 0;
    
    let total = 0;
    for (let i = 0; i < num; i++) {
        total += Math.floor(Math.random() * sides) + 1;
    }
    return total + modifier;
}

function rollD20() {
    return Math.floor(Math.random() * 20) + 1;
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getMonstersByTerrainAndCR(terrain, minCR = 0, maxCR = 20) {
    const config = TERRAIN_CONFIG[terrain];
    if (!config) return [];

    return monsterDatabase.filter(monster => {
        const cr = monster.challenge_rating;
        const type = monster.type?.toLowerCase();
        return cr >= minCR && cr <= maxCR && 
               config.monsterTypes.some(t => type?.includes(t));
    });
}

function calculateTravelTime(distance, pace, terrain) {
    const baseDays = Math.ceil(distance / 40); // 40 km/giorno base (marcia normale)
    const terrainMod = TERRAIN_CONFIG[terrain]?.speedMultiplier || 1;
    const paceMod = PACE_CONFIG[pace]?.speedMod || 1;
    
    return Math.max(1, Math.ceil(baseDays / (terrainMod * paceMod)));
}

// ═══════════════════════════════════════════════════════════════
// MODULO PRINCIPALE
// ═══════════════════════════════════════════════════════════════

const TravelManager = {
    render(containerElement) {
        this.container = containerElement;
        this.locations = loadLocations();
        this.savedState = loadTravelState();

        // Inizializza stato
        this.state = this.savedState || {
            origin: null,
            destination: null,
            terrain: 'pianura',
            pace: 'normal',
            distance: 0,
            travelDays: 0,
            currentDay: 1,
            weather: null,
            resources: {
                rations: 0,
                water: 0,
                fodder: 0,
                gold: 0
            },
            partySize: 4,
            travelLog: [],
            encounters: [],
            active: false
        };

        this.container.innerHTML = this.getMainLayout();
        this.bindEvents();
        this.updateUI();

        // Ripristina se c'era un viaggio attivo
        if (this.state.active) {
            this.renderTravelLog();
        }

        console.log('🧭 [TravelManager] Modulo inizializzato v2.0');
    },

    getMainLayout() {
        return `
<style>
${this.getStyles()}
</style>
<div class="travel-manager-layout">
    <!-- Sidebar Pianificazione -->
    <div class="travel-sidebar">
        <div class="travel-sidebar-header">
            <h2>🧭 Viaggio</h2>
        </div>

        <!-- Selezione Luoghi -->
        <div class="travel-card">
            <h3>📍 Percorso</h3>
            <div class="travel-form-group">
                <label>Partenza</label>
                <select id="origin-select" class="travel-select">
                    <option value="">Seleziona luogo di partenza...</option>
                    ${this.renderLocationOptions(this.state.origin)}
                </select>
            </div>
            <div class="travel-form-group">
                <label>Destinazione</label>
                <select id="destination-select" class="travel-select">
                    <option value="">Seleziona destinazione...</option>
                    ${this.renderLocationOptions(this.state.destination)}
                </select>
            </div>
            <div class="travel-form-group">
                <label>Distanza (km)</label>
                <input type="number" id="distance-input" class="travel-input" 
                       value="${this.state.distance || ''}" min="1" max="9999"
                       placeholder="Es. 150">
            </div>
        </div>

        <!-- Terreno e Andatura -->
        <div class="travel-card">
            <h3>🏞️ Terreno</h3>
            <div class="terrain-grid">
                ${Object.entries(TERRAIN_CONFIG).map(([key, config]) => `
                    <button class="terrain-btn ${this.state.terrain === key ? 'selected' : ''}" 
                            data-terrain="${key}" title="${config.description}">
                        <span class="terrain-icon">${config.icon}</span>
                        <span class="terrain-name">${config.name}</span>
                    </button>
                `).join('')}
            </div>
        </div>

        <div class="travel-card">
            <h3>⚡ Andatura</h3>
            <div class="pace-options">
                ${Object.entries(PACE_CONFIG).map(([key, config]) => `
                    <button class="pace-btn ${this.state.pace === key ? 'selected' : ''}" 
                            data-pace="${key}">
                        <span class="pace-icon">${config.icon}</span>
                        <div class="pace-info">
                            <span class="pace-name">${config.name}</span>
                            <span class="pace-desc">${config.description}</span>
                        </div>
                    </button>
                `).join('')}
            </div>
        </div>

        <!-- Risorse -->
        <div class="travel-card">
            <h3>🎒 Risorse</h3>
            <div class="resource-grid">
                <div class="resource-item">
                    <label>🍞 Razioni</label>
                    <input type="number" id="rations-input" class="resource-input" 
                           value="${this.state.resources.rations}" min="0">
                </div>
                <div class="resource-item">
                    <label>💧 Acqua (litri)</label>
                    <input type="number" id="water-input" class="resource-input" 
                           value="${this.state.resources.water}" min="0">
                </div>
                <div class="resource-item">
                    <label>🌾 Foraggio</label>
                    <input type="number" id="fodder-input" class="resource-input" 
                           value="${this.state.resources.fodder}" min="0">
                </div>
                <div class="resource-item">
                    <label>👥 Dimensione Party</label>
                    <input type="number" id="party-size-input" class="resource-input" 
                           value="${this.state.partySize}" min="1" max="20">
                </div>
            </div>
        </div>

        <!-- Azioni -->
        <div class="travel-actions">
            <button class="travel-btn primary" id="start-travel-btn">
                🚀 Inizia Viaggio
            </button>
            <button class="travel-btn secondary" id="reset-travel-btn">
                🔄 Reset
            </button>
        </div>
    </div>

    <!-- Area Principale -->
    <div class="travel-main">
        <!-- Header con info viaggio -->
        <div class="travel-header" id="travel-header">
            <div class="travel-title-area">
                <h2 id="travel-title">Pianifica il Viaggio</h2>
                <p id="travel-subtitle">Seleziona partenza e destinazione</p>
            </div>
            <div class="travel-stats" id="travel-stats" style="display: none;">
                <div class="stat-item">
                    <span class="stat-label">Giorno</span>
                    <span class="stat-value" id="day-counter">${this.state.currentDay}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Rimanenti</span>
                    <span class="stat-value" id="days-remaining">${this.state.travelDays - this.state.currentDay + 1}</span>
                </div>
                <div class="stat-item weather-stat">
                    <span class="stat-label">Meteo</span>
                    <span class="stat-value" id="weather-display">-</span>
                </div>
            </div>
        </div>

        <!-- Riepilogo Viaggio -->
        <div class="travel-summary-card" id="travel-summary">
            <div class="summary-empty">
                <span class="empty-icon">🗺️</span>
                <p>Configura il viaggio per vedere il riepilogo</p>
            </div>
        </div>

        <!-- Area Gioco -->
        <div class="travel-game-area" id="travel-game-area" style="display: none;">
            <!-- Meteo del giorno -->
            <div class="day-weather-card">
                <div class="weather-main">
                    <span class="weather-icon" id="day-weather-icon">☀️</span>
                    <div class="weather-info">
                        <span class="weather-condition" id="day-weather-condition">Sereno</span>
                        <span class="weather-desc" id="day-weather-desc">Cielo limpido</span>
                    </div>
                </div>
                <button class="reroll-weather-btn" id="reroll-weather-btn" title="Ritira meteo">
                    🎲
                </button>
            </div>

            <!-- Azioni Giornaliere -->
            <div class="day-actions-card">
                <h3>⚙️ Azioni del Giorno</h3>
                <div class="action-buttons">
                    <button class="action-btn" id="roll-encounter-btn">
                        🎲 Genera Incontro
                    </button>
                    <button class="action-btn" id="forage-btn">
                        🌿 Foraggia
                    </button>
                    <button class="action-btn" id="navigate-btn">
                        🧭 Naviga
                    </button>
                    <button class="action-btn warning" id="rest-btn">
                        🏕️ Riposa
                    </button>
                </div>
            </div>

            <!-- Incontri del Giorno -->
            <div class="encounters-card" id="encounters-card">
                <h3>⚔️ Incontri Oggi</h3>
                <div class="encounters-list" id="encounters-list">
                    <p class="no-encounters">Nessun incontro generato oggi</p>
                </div>
            </div>

            <!-- Consumo Risorse -->
            <div class="consumption-card">
                <h3>📊 Consumo Giornaliero</h3>
                <div class="consumption-grid" id="consumption-grid">
                    <!-- Generato dinamicamente -->
                </div>
                <button class="apply-consumption-btn" id="apply-consumption-btn">
                    ✅ Applica Consumo e Avanza Giorno
                </button>
            </div>
        </div>

        <!-- Log Viaggio -->
        <div class="travel-log-card" id="travel-log-card" style="display: none;">
            <h3>📜 Log del Viaggio</h3>
            <div class="travel-log" id="travel-log">
                <!-- Generato dinamicamente -->
            </div>
        </div>
    </div>

    <!-- Modal Incontro -->
    <div class="encounter-modal-overlay" id="encounter-modal-overlay"></div>
    <div class="encounter-modal" id="encounter-modal">
        <div class="encounter-modal-header">
            <h3 id="encounter-modal-title">⚔️ Incontro</h3>
            <button class="encounter-modal-close" id="close-encounter-modal">✕</button>
        </div>
        <div class="encounter-modal-content" id="encounter-modal-content">
            <!-- Contenuto dinamico -->
        </div>
        <div class="encounter-modal-footer">
            <button class="travel-btn secondary" id="encounter-close-btn">Chiudi</button>
            <button class="travel-btn primary" id="encounter-combat-btn">⚔️ Combatti</button>
        </div>
    </div>
</div>
        `;
    },

    getStyles() {
        return `
/* Layout principale */
.travel-manager-layout {
    display: flex;
    height: 100%;
    gap: 0;
    background: var(--bg-secondary, #1a1a1a);
    overflow: hidden;
}

/* Sidebar */
.travel-sidebar {
    flex: 0 0 300px;
    background: var(--card-bg, #252525);
    border-right: 1px solid var(--border-color, #333);
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    gap: 0.75rem;
    overflow-y: auto;
}

.travel-sidebar-header h2 {
    margin: 0;
    font-family: 'Cinzel', serif;
    font-size: 1.1rem;
    color: var(--text-primary, #fff);
}

/* Cards */
.travel-card {
    background: var(--bg-tertiary, #2a2a2a);
    border-radius: 8px;
    padding: 0.75rem;
    border: 1px solid var(--border-color, #333);
}

.travel-card h3 {
    margin: 0 0 0.75rem;
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    color: var(--text-primary, #fff);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* Form elements */
.travel-form-group {
    margin-bottom: 0.75rem;
}

.travel-form-group:last-child {
    margin-bottom: 0;
}

.travel-form-group label {
    display: block;
    font-size: 0.75rem;
    color: var(--text-muted, #888);
    margin-bottom: 0.25rem;
    text-transform: uppercase;
}

.travel-select, .travel-input {
    width: 100%;
    padding: 0.5rem;
    background: var(--input-bg, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-size: 0.85rem;
}

.travel-select:focus, .travel-input:focus {
    outline: none;
    border-color: #0891b2;
}

/* Terrain grid */
.terrain-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
}

.terrain-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    background: var(--bg-secondary, #1a1a1a);
    border: 1px solid var(--border-color, #444);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.terrain-btn:hover {
    border-color: #0891b2;
    background: rgba(8, 145, 178, 0.1);
}

.terrain-btn.selected {
    border-color: #0891b2;
    background: rgba(8, 145, 178, 0.2);
}

.terrain-icon {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
}

.terrain-name {
    font-size: 0.7rem;
    color: var(--text-primary, #fff);
}

/* Pace options */
.pace-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.pace-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    background: var(--bg-secondary, #1a1a1a);
    border: 1px solid var(--border-color, #444);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
}

.pace-btn:hover {
    border-color: #0891b2;
}

.pace-btn.selected {
    border-color: #0891b2;
    background: rgba(8, 145, 178, 0.2);
}

.pace-icon {
    font-size: 1.25rem;
}

.pace-info {
    display: flex;
    flex-direction: column;
}

.pace-name {
    font-size: 0.85rem;
    color: var(--text-primary, #fff);
    font-weight: 500;
}

.pace-desc {
    font-size: 0.7rem;
    color: var(--text-muted, #888);
}

/* Resource grid */
.resource-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
}

.resource-item {
    display: flex;
    flex-direction: column;
}

.resource-item label {
    font-size: 0.7rem;
    color: var(--text-muted, #888);
    margin-bottom: 0.25rem;
}

.resource-input {
    width: 100%;
    padding: 0.4rem;
    background: var(--input-bg, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-size: 0.85rem;
    text-align: center;
}

/* Actions */
.travel-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: auto;
    padding-top: 0.5rem;
}

.travel-btn {
    flex: 1;
    padding: 0.6rem;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Cinzel', serif;
}

.travel-btn.primary {
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    color: #fff;
}

.travel-btn.primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(8, 145, 178, 0.3);
}

.travel-btn.secondary {
    background: var(--bg-tertiary, #333);
    color: var(--text-primary, #fff);
    border: 1px solid var(--border-color, #444);
}

.travel-btn.secondary:hover {
    background: var(--hover-bg, #444);
}

/* Main area */
.travel-main {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Header */
.travel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--card-bg, #252525);
    padding: 1rem 1.25rem;
    border-radius: 8px;
    border: 1px solid var(--border-color, #333);
}

.travel-title-area h2 {
    margin: 0;
    font-family: 'Cinzel Decorative', serif;
    font-size: 1.25rem;
    color: #0891b2;
}

.travel-title-area p {
    margin: 0.25rem 0 0;
    font-size: 0.85rem;
    color: var(--text-muted, #888);
}

.travel-stats {
    display: flex;
    gap: 1.5rem;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-label {
    font-size: 0.7rem;
    color: var(--text-muted, #888);
    text-transform: uppercase;
}

.stat-value {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--text-primary, #fff);
}

/* Summary card */
.travel-summary-card {
    background: var(--card-bg, #252525);
    border-radius: 8px;
    padding: 1.25rem;
    border: 1px solid var(--border-color, #333);
}

.summary-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-muted, #666);
    padding: 1rem;
}

.summary-empty .empty-icon {
    font-size: 3rem;
    opacity: 0.5;
}

.summary-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.summary-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.summary-section h4 {
    margin: 0;
    font-family: 'Cinzel', serif;
    font-size: 0.85rem;
    color: #0891b2;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
}

.summary-row .label {
    color: var(--text-muted, #888);
}

.summary-row .value {
    color: var(--text-primary, #fff);
    font-weight: 500;
}

.summary-row.warning .value {
    color: #f97316;
}

.summary-row.danger .value {
    color: #ef4444;
}

/* Game area */
.travel-game-area {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.day-weather-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--card-bg, #252525);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color, #333);
}

.weather-main {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.weather-icon {
    font-size: 2.5rem;
}

.weather-info {
    display: flex;
    flex-direction: column;
}

.weather-condition {
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--text-primary, #fff);
}

.weather-desc {
    font-size: 0.8rem;
    color: var(--text-muted, #888);
}

.reroll-weather-btn {
    width: 40px;
    height: 40px;
    border: 1px solid var(--border-color, #444);
    background: var(--bg-tertiary, #333);
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.25rem;
    transition: all 0.2s;
}

.reroll-weather-btn:hover {
    background: #0891b2;
    border-color: #0891b2;
}

/* Day actions */
.day-actions-card {
    background: var(--card-bg, #252525);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color, #333);
}

.day-actions-card h3 {
    margin: 0 0 0.75rem;
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    color: var(--text-primary, #fff);
}

.action-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.action-btn {
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 6px;
    color: var(--text-primary, #fff);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
}

.action-btn:hover {
    background: #0891b2;
    border-color: #0891b2;
}

.action-btn.warning {
    border-color: #f59e0b;
    color: #f59e0b;
}

.action-btn.warning:hover {
    background: #f59e0b;
    color: #000;
}

/* Encounters card */
.encounters-card {
    background: var(--card-bg, #252525);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color, #333);
}

.encounters-card h3 {
    margin: 0 0 0.75rem;
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    color: var(--text-primary, #fff);
}

.encounters-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.no-encounters {
    color: var(--text-muted, #666);
    font-style: italic;
    margin: 0;
    text-align: center;
    padding: 1rem;
}

.encounter-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: var(--bg-tertiary, #1a1a1a);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.encounter-item:hover {
    background: rgba(8, 145, 178, 0.1);
}

.encounter-item .encounter-name {
    font-weight: 500;
    color: var(--text-primary, #fff);
}

.encounter-item .encounter-type {
    font-size: 0.75rem;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    background: rgba(8, 145, 178, 0.2);
    color: #0891b2;
}

.encounter-item.hostile .encounter-type {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
}

.encounter-item.friendly .encounter-type {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
}

/* Consumption card */
.consumption-card {
    background: var(--card-bg, #252525);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color, #333);
}

.consumption-card h3 {
    margin: 0 0 0.75rem;
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    color: var(--text-primary, #fff);
}

.consumption-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.consumption-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem;
    background: var(--bg-tertiary, #1a1a1a);
    border-radius: 6px;
}

.consumption-item .consumption-icon {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
}

.consumption-item .consumption-label {
    font-size: 0.7rem;
    color: var(--text-muted, #888);
}

.consumption-item .consumption-value {
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--text-primary, #fff);
}

.consumption-item.warning .consumption-value {
    color: #f97316;
}

.consumption-item.danger .consumption-value {
    color: #ef4444;
}

.apply-consumption-btn {
    width: 100%;
    padding: 0.75rem;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    border: none;
    border-radius: 6px;
    color: #fff;
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
}

.apply-consumption-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

/* Travel log */
.travel-log-card {
    background: var(--card-bg, #252525);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color, #333);
}

.travel-log-card h3 {
    margin: 0 0 0.75rem;
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    color: var(--text-primary, #fff);
}

.travel-log {
    max-height: 300px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.log-entry {
    padding: 0.5rem 0.75rem;
    background: var(--bg-tertiary, #1a1a1a);
    border-radius: 4px;
    border-left: 3px solid #0891b2;
    font-size: 0.85rem;
}

.log-entry .log-time {
    font-size: 0.7rem;
    color: var(--text-muted, #888);
}

.log-entry .log-text {
    color: var(--text-primary, #fff);
    margin-top: 0.25rem;
}

.log-entry.encounter {
    border-left-color: #ef4444;
}

.log-entry.weather {
    border-left-color: #f59e0b;
}

.log-entry.resource {
    border-left-color: #22c55e;
}

/* Modal */
.encounter-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
    display: none;
}

.encounter-modal-overlay.active {
    display: block;
}

.encounter-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    background: var(--card-bg, #252525);
    border-radius: 12px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: none;
    flex-direction: column;
}

.encounter-modal.active {
    display: flex;
}

.encounter-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color, #333);
}

.encounter-modal-header h3 {
    margin: 0;
    font-family: 'Cinzel', serif;
    color: var(--text-primary, #fff);
}

.encounter-modal-close {
    background: none;
    border: none;
    color: var(--text-muted, #888);
    font-size: 1.5rem;
    cursor: pointer;
}

.encounter-modal-content {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
}

.encounter-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border-color, #333);
}

/* Monster card in modal */
.monster-card {
    background: var(--bg-tertiary, #1a1a1a);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 0.75rem;
}

.monster-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
}

.monster-name {
    font-family: 'Cinzel', serif;
    font-size: 1.1rem;
    color: #ef4444;
}

.monster-cr {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
    background: rgba(239, 68, 68, 0.2);
    border-radius: 4px;
    color: #ef4444;
}

.monster-stats {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: var(--text-muted, #888);
}

.monster-stat {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.monster-count {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: var(--text-primary, #fff);
}

.monster-xp {
    font-size: 0.8rem;
    color: #fbbf24;
    margin-top: 0.25rem;
}
        `;
    },

    // ═══════════════════════════════════════════════════════════════
    // RENDER HELPERS
    // ═══════════════════════════════════════════════════════════════

    renderLocationOptions(selectedId) {
        if (this.locations.length === 0) {
            return '<option value="">Nessun luogo disponibile</option>';
        }

        return this.locations
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
            .map(loc => `<option value="${loc.id}" ${loc.id === selectedId ? 'selected' : ''}>${escapeHtml(loc.name)} (${loc.type || 'Luogo'})</option>`)
            .join('');
    },

    // ═══════════════════════════════════════════════════════════════
    // EVENT BINDING
    // ═══════════════════════════════════════════════════════════════

    bindEvents() {
        // Origin/Destination
        this.container.querySelector('#origin-select').addEventListener('change', (e) => {
            this.state.origin = e.target.value || null;
            this.updateSummary();
            this.saveState();
        });

        this.container.querySelector('#destination-select').addEventListener('change', (e) => {
            this.state.destination = e.target.value || null;
            this.updateSummary();
            this.saveState();
        });

        this.container.querySelector('#distance-input').addEventListener('input', (e) => {
            this.state.distance = parseInt(e.target.value) || 0;
            this.updateSummary();
            this.saveState();
        });

        // Terrain selection
        this.container.querySelectorAll('.terrain-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.container.querySelectorAll('.terrain-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.terrain = btn.dataset.terrain;
                this.updateSummary();
                this.saveState();
            });
        });

        // Pace selection
        this.container.querySelectorAll('.pace-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.container.querySelectorAll('.pace-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.state.pace = btn.dataset.pace;
                this.updateSummary();
                this.saveState();
            });
        });

        // Resources
        ['rations', 'water', 'fodder'].forEach(res => {
            this.container.querySelector(`#${res}-input`).addEventListener('input', (e) => {
                this.state.resources[res] = parseInt(e.target.value) || 0;
                this.saveState();
            });
        });

        this.container.querySelector('#party-size-input').addEventListener('input', (e) => {
            this.state.partySize = parseInt(e.target.value) || 4;
            this.updateConsumption();
            this.saveState();
        });

        // Actions
        this.container.querySelector('#start-travel-btn').addEventListener('click', () => this.startTravel());
        this.container.querySelector('#reset-travel-btn').addEventListener('click', () => this.resetTravel());

        // Game actions
        this.container.querySelector('#roll-encounter-btn').addEventListener('click', () => this.generateEncounter());
        this.container.querySelector('#forage-btn').addEventListener('click', () => this.forage());
        this.container.querySelector('#navigate-btn').addEventListener('click', () => this.navigate());
        this.container.querySelector('#rest-btn').addEventListener('click', () => this.rest());
        this.container.querySelector('#reroll-weather-btn').addEventListener('click', () => this.rerollWeather());
        this.container.querySelector('#apply-consumption-btn').addEventListener('click', () => this.applyConsumption());

        // Modal
        this.container.querySelector('#encounter-modal-overlay').addEventListener('click', () => this.closeEncounterModal());
        this.container.querySelector('#close-encounter-modal').addEventListener('click', () => this.closeEncounterModal());
        this.container.querySelector('#encounter-close-btn').addEventListener('click', () => this.closeEncounterModal());
        this.container.querySelector('#encounter-combat-btn').addEventListener('click', () => this.startCombat());
    },

    // ═══════════════════════════════════════════════════════════════
    // UI UPDATES
    // ═══════════════════════════════════════════════════════════════

    updateUI() {
        this.updateSummary();
        if (this.state.active) {
            this.showGameArea();
            this.updateWeather();
            this.updateConsumption();
        }
    },

    updateSummary() {
        const summaryCard = this.container.querySelector('#travel-summary');
        const origin = this.locations.find(l => l.id === this.state.origin);
        const destination = this.locations.find(l => l.id === this.state.destination);
        const terrain = TERRAIN_CONFIG[this.state.terrain];
        const pace = PACE_CONFIG[this.state.pace];

        if (!this.state.distance && !origin && !destination) {
            summaryCard.innerHTML = `
                <div class="summary-empty">
                    <span class="empty-icon">🗺️</span>
                    <p>Configura il viaggio per vedere il riepilogo</p>
                </div>
            `;
            return;
        }

        const travelDays = calculateTravelTime(
            this.state.distance || 0,
            this.state.pace,
            this.state.terrain
        );

        this.state.travelDays = travelDays;

        const dailyWater = Math.ceil(this.state.partySize * terrain.waterConsumption);
        const totalWater = dailyWater * travelDays;
        const totalRations = this.state.partySize * travelDays;

        const waterOk = this.state.resources.water >= totalWater;
        const rationsOk = this.state.resources.rations >= totalRations;

        summaryCard.innerHTML = `
            <div class="summary-content">
                <div class="summary-section">
                    <h4>📍 Percorso</h4>
                    <div class="summary-row">
                        <span class="label">Partenza:</span>
                        <span class="value">${origin ? escapeHtml(origin.name) : 'Non selezionato'}</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Destinazione:</span>
                        <span class="value">${destination ? escapeHtml(destination.name) : 'Non selezionato'}</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Distanza:</span>
                        <span class="value">${this.state.distance || 0} km</span>
                    </div>
                </div>

                <div class="summary-section">
                    <h4>${terrain.icon} Condizioni</h4>
                    <div class="summary-row">
                        <span class="label">Terreno:</span>
                        <span class="value">${terrain.name}</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Andatura:</span>
                        <span class="value">${pace.name} (${pace.icon})</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Durata:</span>
                        <span class="value">${travelDays} giorni</span>
                    </div>
                </div>

                <div class="summary-section">
                    <h4>🎒 Risorse Necessarie</h4>
                    <div class="summary-row ${rationsOk ? '' : 'warning'}">
                        <span class="label">Razioni:</span>
                        <span class="value">${this.state.resources.rations}/${totalRations}</span>
                    </div>
                    <div class="summary-row ${waterOk ? '' : 'warning'}">
                        <span class="label">Acqua:</span>
                        <span class="value">${this.state.resources.water}/${totalWater}L</span>
                    </div>
                    <div class="summary-row">
                        <span class="label">Consumo/giorno:</span>
                        <span class="value">${this.state.partySize} razioni, ${dailyWater}L acqua</span>
                    </div>
                </div>
            </div>
        `;
    },

    showGameArea() {
        const gameArea = this.container.querySelector('#travel-game-area');
        const logCard = this.container.querySelector('#travel-log-card');
        const stats = this.container.querySelector('#travel-stats');
        const summaryCard = this.container.querySelector('#travel-summary');

        gameArea.style.display = 'flex';
        logCard.style.display = 'block';
        stats.style.display = 'flex';
        summaryCard.style.display = 'none';

        // Update header
        const origin = this.locations.find(l => l.id === this.state.origin);
        const destination = this.locations.find(l => l.id === this.state.destination);

        this.container.querySelector('#travel-title').textContent = 
            `${origin?.name || '???' } → ${destination?.name || '???'}`;
        this.container.querySelector('#travel-subtitle').textContent = 
            `${this.state.distance} km attraverso ${TERRAIN_CONFIG[this.state.terrain].name}`;

        // Update day counter
        this.container.querySelector('#day-counter').textContent = this.state.currentDay;
        this.container.querySelector('#days-remaining').textContent = 
            Math.max(0, this.state.travelDays - this.state.currentDay + 1);

        // Clear today's encounters
        this.state.encounters = [];
        this.renderEncounters();
    },

    updateWeather() {
        if (!this.state.weather) {
            this.state.weather = getRandomElement(WEATHER_TABLE);
        }

        const weatherIcon = this.container.querySelector('#day-weather-icon');
        const weatherCondition = this.container.querySelector('#day-weather-condition');
        const weatherDesc = this.container.querySelector('#day-weather-desc');
        const weatherDisplay = this.container.querySelector('#weather-display');

        weatherIcon.textContent = this.state.weather.icon;
        weatherCondition.textContent = this.state.weather.condition;
        weatherDesc.textContent = this.state.weather.description;
        weatherDisplay.textContent = `${this.state.weather.icon} ${this.state.weather.condition}`;
    },

    updateConsumption() {
        const terrain = TERRAIN_CONFIG[this.state.terrain];
        const dailyRations = this.state.partySize;
        const dailyWater = Math.ceil(this.state.partySize * terrain.waterConsumption);

        const grid = this.container.querySelector('#consumption-grid');

        const rationsClass = this.state.resources.rations < dailyRations ? 'danger' : 
                             this.state.resources.rations < dailyRations * 2 ? 'warning' : '';
        const waterClass = this.state.resources.water < dailyWater ? 'danger' : 
                           this.state.resources.water < dailyWater * 2 ? 'warning' : '';

        grid.innerHTML = `
            <div class="consumption-item ${rationsClass}">
                <span class="consumption-icon">🍞</span>
                <span class="consumption-label">Razioni</span>
                <span class="consumption-value">-${dailyRations}</span>
            </div>
            <div class="consumption-item ${waterClass}">
                <span class="consumption-icon">💧</span>
                <span class="consumption-label">Acqua (L)</span>
                <span class="consumption-value">-${dailyWater}</span>
            </div>
            <div class="consumption-item">
                <span class="consumption-icon">🎒</span>
                <span class="consumption-label">Rimanenti</span>
                <span class="consumption-value">${this.state.resources.rations} / ${this.state.resources.water}L</span>
            </div>
            <div class="consumption-item">
                <span class="consumption-icon">📅</span>
                <span class="consumption-label">Giorno</span>
                <span class="consumption-value">${this.state.currentDay}/${this.state.travelDays}</span>
            </div>
        `;
    },

    renderEncounters() {
        const list = this.container.querySelector('#encounters-list');

        if (this.state.encounters.length === 0) {
            list.innerHTML = '<p class="no-encounters">Nessun incontro generato oggi</p>';
            return;
        }

        list.innerHTML = this.state.encounters.map((enc, index) => `
            <div class="encounter-item ${enc.type}" data-index="${index}">
                <span class="encounter-name">${enc.title}</span>
                <span class="encounter-type">${enc.typeLabel}</span>
            </div>
        `).join('');

        // Bind click events
        list.querySelectorAll('.encounter-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.showEncounterDetails(this.state.encounters[index]);
            });
        });
    },

    renderTravelLog() {
        const log = this.container.querySelector('#travel-log');

        if (this.state.travelLog.length === 0) {
            log.innerHTML = '<p class="no-encounters">Il log è vuoto</p>';
            return;
        }

        // Show last 20 entries
        const entries = this.state.travelLog.slice(-20).reverse();

        log.innerHTML = entries.map(entry => `
            <div class="log-entry ${entry.type || ''}">
                <span class="log-time">Giorno ${entry.day} - ${entry.time || ''}</span>
                <div class="log-text">${entry.text}</div>
            </div>
        `).join('');
    },

    // ═══════════════════════════════════════════════════════════════
    // ACTIONS
    // ═══════════════════════════════════════════════════════════════

    startTravel() {
        if (!this.state.distance || this.state.distance < 1) {
            showToast('Inserisci una distanza valida', 'warning');
            return;
        }

        this.state.active = true;
        this.state.currentDay = 1;
        this.state.weather = null;
        this.state.travelLog = [];
        this.state.encounters = [];

        // Add initial log entry
        const origin = this.locations.find(l => l.id === this.state.origin);
        const destination = this.locations.find(l => l.id === this.state.destination);

        this.addLogEntry(`Inizio viaggio da ${origin?.name || 'origine'} a ${destination?.name || 'destinazione'}. Distanza: ${this.state.distance} km.`);

        this.saveState();
        this.showGameArea();
        this.updateWeather();
        this.updateConsumption();
        this.renderTravelLog();

        showToast('Viaggio iniziato!', 'success');
    },

    resetTravel() {
        this.state = {
            origin: null,
            destination: null,
            terrain: 'pianura',
            pace: 'normal',
            distance: 0,
            travelDays: 0,
            currentDay: 1,
            weather: null,
            resources: {
                rations: 0,
                water: 0,
                fodder: 0,
                gold: 0
            },
            partySize: 4,
            travelLog: [],
            encounters: [],
            active: false
        };

        // Reset UI
        this.container.querySelector('#origin-select').value = '';
        this.container.querySelector('#destination-select').value = '';
        this.container.querySelector('#distance-input').value = '';

        this.container.querySelectorAll('.terrain-btn').forEach(b => b.classList.remove('selected'));
        this.container.querySelector('.terrain-btn[data-terrain="pianura"]').classList.add('selected');

        this.container.querySelectorAll('.pace-btn').forEach(b => b.classList.remove('selected'));
        this.container.querySelector('.pace-btn[data-pace="normal"]').classList.add('selected');

        this.container.querySelector('#travel-game-area').style.display = 'none';
        this.container.querySelector('#travel-log-card').style.display = 'none';
        this.container.querySelector('#travel-stats').style.display = 'none';
        this.container.querySelector('#travel-summary').style.display = 'block';

        this.saveState();
        this.updateSummary();

        showToast('Viaggio resettato', 'info');
    },

    generateEncounter() {
        const terrain = TERRAIN_CONFIG[this.state.terrain];
        const roll = rollD20();
        const modifiedRoll = roll + (this.state.weather?.modifier || 0);
        const paceMod = PACE_CONFIG[this.state.pace].passivePenalty || 0;
        const finalRoll = modifiedRoll + paceMod;

        let encounterType, encounter;

        // DC check based on terrain
        if (finalRoll >= terrain.encounterDC + 5) {
            // Hard encounter - hostile
            encounterType = 'hostile';
            encounter = this.createHostileEncounter();
        } else if (finalRoll >= terrain.encounterDC) {
            // Medium encounter
            encounterType = rollD20() % 2 === 0 ? 'hostile' : 'neutral';
            encounter = encounterType === 'hostile' ? 
                this.createHostileEncounter() : this.createNeutralEncounter();
        } else if (finalRoll >= terrain.encounterDC - 5) {
            // Easy encounter or environmental
            encounterType = 'environmental';
            encounter = this.createEnvironmentalEncounter();
        } else {
            // Nothing or friendly
            encounterType = rollD20() % 3 === 0 ? 'friendly' : null;
            encounter = encounterType ? this.createFriendlyEncounter() : null;
        }

        if (encounter) {
            encounter.type = encounterType;
            encounter.typeLabel = {
                hostile: 'Ostile',
                neutral: 'Neutrale',
                friendly: 'Amichevole',
                environmental: 'Ambientale'
            }[encounterType];

            this.state.encounters.push(encounter);
            this.renderEncounters();
            this.addLogEntry(encounter.description, 'encounter');
            this.showEncounterDetails(encounter);
        } else {
            this.addLogEntry('Nessun incontro significativo oggi.', '');
            showToast('Nessun incontro', 'info');
        }

        this.saveState();
    },

    createHostileEncounter() {
        const template = getRandomElement(ENCOUNTER_TEMPLATES.hostile);
        const terrain = TERRAIN_CONFIG[this.state.terrain];

        // Get appropriate monsters
        const monsters = getMonstersByTerrainAndCR(this.state.terrain, 0, 10);

        let encounterMonsters = [];
        if (monsters.length > 0) {
            // Pick 1-3 monster types
            const numTypes = Math.floor(Math.random() * 2) + 1;
            const selectedMonsters = [];

            for (let i = 0; i < numTypes && monsters.length > 0; i++) {
                const monster = getRandomElement(monsters);
                if (!selectedMonsters.find(m => m.name === monster.name)) {
                    selectedMonsters.push(monster);
                }
            }

            // Determine quantity based on CR
            encounterMonsters = selectedMonsters.map(monster => {
                const cr = monster.challenge_rating;
                let count;
                if (cr < 1) count = rollDice('2d4');
                else if (cr < 2) count = rollDice('1d4');
                else if (cr < 5) count = rollDice('1d3');
                else count = 1;

                return {
                    ...monster,
                    count
                };
            });
        }

        return {
            title: template.title,
            description: template.description,
            monsters: encounterMonsters,
            roll: rollD20()
        };
    },

    createNeutralEncounter() {
        const template = getRandomElement(ENCOUNTER_TEMPLATES.neutral);
        return {
            title: template.title,
            description: template.description,
            monsters: [],
            roll: rollD20()
        };
    },

    createFriendlyEncounter() {
        const template = getRandomElement(ENCOUNTER_TEMPLATES.friendly);
        return {
            title: template.title,
            description: template.description,
            monsters: [],
            roll: rollD20(),
            benefit: getRandomElement(['Riposo sicuro', 'Informazioni', 'Risorse', 'Guida'])
        };
    },

    createEnvironmentalEncounter() {
        const template = getRandomElement(ENCOUNTER_TEMPLATES.environmental);
        const terrain = TERRAIN_CONFIG[this.state.terrain];

        const discoveries = [
            'Tracce fresche di una creatura grande',
            'Antiche rovine coperte di vegetazione',
            'Un piccolo rifugio abbandonato',
            'Un corso d\'acqua cristallino',
            'Un tumulo funerario antico',
            'Segni di un accampamento recente',
            'Un albero con incisioni mistiche',
            'Un precipizio con vista panoramica',
            'Una grotta poco profonda',
            'Resti di un vecchio carro'
        ];

        return {
            title: template.title,
            description: `${template.description} ${getRandomElement(discoveries)}`,
            monsters: [],
            roll: rollD20()
        };
    },

    showEncounterDetails(encounter) {
        const modal = this.container.querySelector('#encounter-modal');
        const overlay = this.container.querySelector('#encounter-modal-overlay');
        const title = this.container.querySelector('#encounter-modal-title');
        const content = this.container.querySelector('#encounter-modal-content');

        title.textContent = `${encounter.title}`;

        let monstersHtml = '';
        if (encounter.monsters && encounter.monsters.length > 0) {
            let totalXP = 0;
            monstersHtml = '<div class="monsters-section">' +
                encounter.monsters.map(m => {
                    const xp = (m.xp || 0) * m.count;
                    totalXP += xp;
                    return `
                        <div class="monster-card">
                            <div class="monster-header">
                                <span class="monster-name">${escapeHtml(m.name)}</span>
                                <span class="monster-cr">CR ${m.challenge_rating}</span>
                            </div>
                            <div class="monster-stats">
                                <span class="monster-stat">❤️ ${m.hit_points} PF</span>
                                <span class="monster-stat">🛡️ CA ${m.armor_class?.[0]?.value || '?'}</span>
                                <span class="monster-stat">📏 ${m.size}</span>
                            </div>
                            <div class="monster-count">Quantità: ${m.count}</div>
                            <div class="monster-xp">XP: ${xp} (${m.xp} × ${m.count})</div>
                        </div>
                    `;
                }).join('') +
                `<div style="text-align: right; margin-top: 0.5rem; font-weight: bold; color: #fbbf24;">Totale XP: ${totalXP}</div>` +
                '</div>';
        }

        const benefitHtml = encounter.benefit ? 
            `<div style="padding: 0.75rem; background: rgba(34, 197, 94, 0.1); border-radius: 6px; margin-top: 0.75rem;">
                <strong style="color: #22c55e;">Beneficio: ${encounter.benefit}</strong>
            </div>` : '';

        content.innerHTML = `
            <p style="color: var(--text-primary); margin-bottom: 1rem;">${encounter.description}</p>
            ${monstersHtml}
            ${benefitHtml}
        `;

        // Show/hide combat button based on encounter type
        const combatBtn = this.container.querySelector('#encounter-combat-btn');
        combatBtn.style.display = encounter.type === 'hostile' && encounter.monsters?.length > 0 ? 'block' : 'none';

        modal.classList.add('active');
        overlay.classList.add('active');

        this.currentEncounter = encounter;
    },

    closeEncounterModal() {
        const modal = this.container.querySelector('#encounter-modal');
        const overlay = this.container.querySelector('#encounter-modal-overlay');
        if (modal) modal.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        this.currentEncounter = null;
    },

    startCombat() {
        if (!this.currentEncounter) return;

        // Salva i mostri prima di chiudere il modal
        const monstersToTransfer = this.currentEncounter.monsters || [];
        
        // Close modal FIRST before changing modules
        this.closeEncounterModal();

        if (monstersToTransfer.length === 0) {
            showToast('Nessun mostro da trasferire al Combat Tracker', 'warning');
            return;
        }

        // Dispatch event to open combat tracker con i mostri dell'incontro
        const event = new CustomEvent('openModuleWithItem', {
            detail: { 
                moduleId: 'combatTracker', 
                itemData: { 
                    monsters: monstersToTransfer,
                    encounterTitle: this.currentEncounter.title,
                    source: 'travelManager'
                }
            }
        });
        document.dispatchEvent(event);
        
        showToast(`${monstersToTransfer.length} tipi di mostri trasferiti al Combat Tracker`, 'success');
    },

    forage() {
        const terrain = TERRAIN_CONFIG[this.state.terrain];
        const roll = rollD20();
        const success = roll >= terrain.foragingDC;

        if (success) {
            const foodFound = rollDice('1d6') + Math.floor(this.state.partySize / 2);
            const waterFound = rollDice('2d4') * this.state.partySize;

            this.state.resources.rations += foodFound;
            this.state.resources.water += waterFound;

            this.addLogEntry(`Foraggia: Successo! Trovati ${foodFound} razioni e ${waterFound}L acqua.`, 'resource');
            showToast(`Foraggia: +${foodFound} razioni, +${waterFound}L acqua`, 'success');
        } else {
            this.addLogEntry(`Foraggia: Fallito. Nessuna risorsa trovata.`, 'resource');
            showToast('Foraggia: Nessuna risorsa trovata', 'warning');
        }

        this.updateConsumption();
        this.saveState();
    },

    navigate() {
        const terrain = TERRAIN_CONFIG[this.state.terrain];
        const paceMod = PACE_CONFIG[this.state.pace].passivePenalty || 0;
        const weatherMod = this.state.weather?.modifier || 0;
        const roll = rollD20();
        const totalRoll = roll + paceMod + weatherMod;
        
        // DC base 15, modificata da terreno difficile
        const navigationDC = 15 - (terrain.speedMultiplier < 1 ? 2 : 0);
        const success = totalRoll >= navigationDC;

        if (success) {
            // Successo critico (nat 20 o 20+ totale)
            if (roll === 20 || totalRoll >= 25) {
                // Avanzamento straordinario: salva un giorno di viaggio
                if (this.state.travelDays > 1 && this.state.currentDay < this.state.travelDays) {
                    this.state.travelDays = Math.max(1, this.state.travelDays - 1);
                    this.addLogEntry(`Naviga: Successo critico (roll ${roll})! Percorso trovato, 1 giorno risparmiato.`, '');
                    showToast('Navigazione eccellente! Giorno risparmiato!', 'success');
                } else {
                    this.addLogEntry(`Naviga: Successo critico! Percorso ottimale trovato.`, '');
                    showToast('Navigazione perfetta!', 'success');
                }
            } else {
                this.addLogEntry(`Naviga: Successo (roll ${roll}). Percorso corretto.`, '');
                showToast('Navigazione corretta', 'success');
            }
        } else {
            // Fallimento
            if (roll === 1 || totalRoll <= 5) {
                // Disastro: persi! Consumo risorse extra
                const extraRations = Math.ceil(this.state.partySize / 2);
                const extraWater = Math.ceil(this.state.partySize * 0.5);
                this.state.resources.rations = Math.max(0, this.state.resources.rations - extraRations);
                this.state.resources.water = Math.max(0, this.state.resources.water - extraWater);
                this.addLogEntry(`Naviga: DISASTRO (roll ${roll})! Persi nel territorio. Consumate ${extraRations} razioni e ${extraWater}L acqua extra.`, 'resource');
                showToast(`Persi! -${extraRations} razioni, -${extraWater}L acqua`, 'error');
            } else {
                // Rallentamento
                this.state.navigationPenalty = true;
                this.addLogEntry(`Naviga: Fallimento (roll ${roll}). Avanzamento rallentato.`, '');
                showToast('Navigazione difficoltosa, percorso rallentato', 'warning');
            }
        }

        // Aggiorna UI
        this.updateConsumption();
        this.updateSummary();
        this.saveState();
    },

    rest() {
        this.addLogEntry('Il gruppo si riposa. Riposo breve effettuato.', 'resource');
        showToast('Riposo effettuato', 'info');
        this.saveState();
    },

    rerollWeather() {
        this.state.weather = getRandomElement(WEATHER_TABLE);
        this.updateWeather();
        this.addLogEntry(`Meteo cambiato: ${this.state.weather.condition}`, 'weather');
        this.saveState();
    },

    applyConsumption() {
        const terrain = TERRAIN_CONFIG[this.state.terrain];
        const dailyRations = this.state.partySize;
        const dailyWater = Math.ceil(this.state.partySize * terrain.waterConsumption);

        // Consume resources
        this.state.resources.rations = Math.max(0, this.state.resources.rations - dailyRations);
        this.state.resources.water = Math.max(0, this.state.resources.water - dailyWater);

        // Check if arrived
        if (this.state.currentDay >= this.state.travelDays) {
            this.completeTravel();
            return;
        }

        // Advance day
        this.state.currentDay++;
        this.state.weather = null;
        this.state.encounters = [];

        // Update UI
        this.container.querySelector('#day-counter').textContent = this.state.currentDay;
        this.container.querySelector('#days-remaining').textContent = 
            Math.max(0, this.state.travelDays - this.state.currentDay + 1);

        this.updateWeather();
        this.updateConsumption();
        this.renderEncounters();

        this.addLogEntry(`--- Giorno ${this.state.currentDay} ---`, '');

        // Check for resource warnings
        if (this.state.resources.rations < dailyRations * 2) {
            showToast('Attenzione: Razioni scarseggianti!', 'warning');
        }
        if (this.state.resources.water < dailyWater * 2) {
            showToast('Attenzione: Acqua scarsa!', 'warning');
        }

        this.saveState();
    },

    completeTravel() {
        const destination = this.locations.find(l => l.id === this.state.destination);

        this.addLogEntry(`Viaggio completato! Arrivati a ${destination?.name || 'destinazione'}.`, '');
        showToast('Viaggio completato!', 'success');

        this.state.active = false;
        this.saveState();

        // Show completion message
        this.container.querySelector('#travel-title').textContent = '✅ Viaggio Completato!';
        this.container.querySelector('#travel-subtitle').textContent = 
            `Arrivati a ${destination?.name || 'destinazione'} in ${this.state.currentDay} giorni`;
    },

    addLogEntry(text, type) {
        const entry = {
            day: this.state.currentDay,
            time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
            text,
            type
        };

        this.state.travelLog.push(entry);
        this.renderTravelLog();
    },

    saveState() {
        saveTravelState(this.state);
    },

    // ═══════════════════════════════════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════════════════════════════════

    /**
     * Distrugge il modulo, rimuovendo tutti i riferimenti e listeners.
     * Da chiamare quando si cambia modulo.
     */
    destroy() {
        console.log('🧭 [TravelManager] Destroying module...');
        
        // Salva lo stato prima di distruggere
        if (this.state) {
            this.saveState();
        }
        
        // Rimuovi eventuali modal aperti
        this.closeEncounterModal();
        
        // Pulisci il container
        if (this.container) {
            this.container.innerHTML = '';
            this.container = null;
        }
        
        // Reset riferimenti
        this.locations = null;
        this.savedState = null;
        this.state = null;
        this.currentEncounter = null;
        
        console.log('🧭 [TravelManager] Module destroyed');
    }
};

export default TravelManager;
