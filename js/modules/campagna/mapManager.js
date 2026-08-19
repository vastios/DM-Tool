/**
 * mapManager.js
 * ─────────────────────────────────────────────────────────────
 * Modulo per la gestione di Mappe Interattive con Pin.
 *
 * Features:
 * - Caricamento mappe multiple (mondo, dungeon, città)
 * - Pin collegati ai luoghi del locationManager
 * - Trascinamento pin per riposizionamento
 * - Token party per tracciare posizione
 * - Zoom e pan per mappe grandi
 * - Modal dettagli luogo con click
 *
 * @version 1.0.0
 */

import { getCurrentCampaignId } from '../../../stateManager.js';
import { showToast } from '../../../utils/toast.js';
import { escapeHtml } from '../../../utils/htmlHelpers.js';
import { monsterDatabase } from '../../../database/monsterDatabase.js';
import { generateMonsterTokenHTML, buildTokenFromMonster, buildTokensFromEncounter, getColorForMonsterType } from './mapManager/monsterTokenGenerator.js';

// ═══════════════════════════════════════════════════════════════
// COSTANTI E CONFIGURAZIONE
// ═══════════════════════════════════════════════════════════════

const PIN_COLORS = {
    // Per tipo luogo
    mondo: '#22c55e',      // verde
    regione: '#3b82f6',    // blu
    dominio: '#a855f7',    // viola
    area: '#f59e0b',       // arancione
    insediamento: '#ef4444', // rosso
    edificio: '#6b7280',   // grigio
    stanza: '#64748b',     // slate

    // Per pericolo
    sicuro: '#22c55e',
    neutrale: '#6b7280',
    pericoloso: '#f97316',
    ostile: '#ef4444',
    letale: '#7f1d1d',

    // Speciali
    party: '#fbbf24',      // gold
    custom: '#0891b2'      // cyan
};

const PARTY_TOKEN_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" class="party-token-icon">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
</svg>`;

// ═══════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════

function getMapsStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return null;
    return `dungeonMasterToolMaps_${campaignId}`;
}

function getPinsStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return null;
    return `dungeonMasterToolMapPins_${campaignId}`;
}

function getPartyStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return null;
    return `dungeonMasterToolPartyPosition_${campaignId}`;
}

function saveMaps(maps) {
    const key = getMapsStorageKey();
    if (!key) return;
    try {
        localStorage.setItem(key, JSON.stringify(maps));
    } catch (e) {
        console.error('Errore salvataggio mappe:', e);
    }
}

function loadMaps() {
    const key = getMapsStorageKey();
    if (!key) return [];
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function savePins(pins) {
    const key = getPinsStorageKey();
    if (!key) return;
    try {
        localStorage.setItem(key, JSON.stringify(pins));
    } catch (e) {
        console.error('Errore salvataggio pin:', e);
    }
}

function loadPins() {
    const key = getPinsStorageKey();
    if (!key) return {};
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
}

function savePartyPosition(mapId, position) {
    const key = getPartyStorageKey();
    if (!key) return;
    try {
        const all = JSON.parse(localStorage.getItem(key) || '{}');
        if (position) {
            all[mapId] = position;
        } else {
            delete all[mapId];
        }
        localStorage.setItem(key, JSON.stringify(all));
    } catch (e) {
        console.error('Errore salvataggio posizione party:', e);
    }
}

function loadPartyPositions() {
    const key = getPartyStorageKey();
    if (!key) return {};
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
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

// --- TOKEN STORAGE (mostri/NPC/PG sulla mappa) ---

function getTokensStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return null;
    return `dungeonMasterToolMapTokens_${campaignId}`;
}

function saveTokens(tokens) {
    const key = getTokensStorageKey();
    if (!key) return;
    try {
        localStorage.setItem(key, JSON.stringify(tokens));
    } catch (e) {
        console.error('Errore salvataggio token:', e);
        showToast('Errore salvataggio token (spazio esaurito?)', 'error');
    }
}

function loadTokens() {
    const key = getTokensStorageKey();
    if (!key) return {};
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
}

// ═══════════════════════════════════════════════════════════════
// MODULO PRINCIPALE
// ═══════════════════════════════════════════════════════════════

const MapManager = {
    render(containerElement) {
        this.container = containerElement;
        this.maps = loadMaps();
        this.pins = loadPins();
        this.partyPositions = loadPartyPositions();
        this.tokens = loadTokens();
        this.locations = loadLocations();
        this.currentMapId = null;
        this.selectedPinId = null;
        this.selectedTokenId = null;
        this.isDragging = false;
        this.dragTarget = null;
        this.zoom = 1;
        this.pan = { x: 0, y: 0 };
        this.isPanning = false;
        this.lastPanPoint = null;

        this.container.innerHTML = this.getMainLayout();
        this.bindEvents();

        // Se ci sono mappe, seleziona la prima
        if (this.maps.length > 0) {
            this.selectMap(this.maps[0].id);
        }

        console.log('🗺️ [MapManager] Modulo inizializzato v1.0');
    },

    getMainLayout() {
        return `
<style>
${this.getStyles()}
</style>
<div class="map-manager-layout">
    <!-- Sidebar Mappe -->
    <div class="map-sidebar">
        <div class="map-sidebar-header">
            <h2>🗺️ Mappe</h2>
            <button class="map-new-btn" id="map-new-btn" title="Nuova Mappa">+ Nuova</button>
        </div>

        <div class="map-list" id="map-list">
            ${this.renderMapsList()}
        </div>

        <div class="map-sidebar-section">
            <h3>📍 Pin Luoghi</h3>
            <div class="map-pin-controls">
                <select id="pin-location-select" class="map-pin-select">
                    <option value="">Seleziona un luogo...</option>
                    ${this.renderLocationOptions()}
                </select>
                <button class="map-add-pin-btn" id="add-pin-btn" disabled>Aggiungi Pin</button>
            </div>
            <p class="map-pin-hint">Clicca sulla mappa per posizionare il pin</p>
        </div>

        <div class="map-sidebar-section">
            <h3>👥 Party</h3>
            <div class="party-controls">
                <button class="party-set-btn" id="set-party-btn">📍 Posiziona Party</button>
                <button class="party-clear-btn" id="clear-party-btn">❌ Rimuovi</button>
            </div>
            <p class="map-pin-hint">Clicca sulla mappa per posizionare il party</p>
        </div>

        <div class="map-sidebar-section">
            <h3>👹 Token Mostri</h3>
            <div class="token-controls">
                <input type="text" id="token-search-input" class="token-search-input" placeholder="Cerca mostro..." list="monster-list-datalist">
                <datalist id="monster-list-datalist">
                    ${this.renderMonsterDatalist()}
                </datalist>
                <button class="token-add-btn" id="add-token-btn" disabled>➕ Aggiungi</button>
            </div>
            <div class="token-list" id="token-list">
                <p class="token-list-empty">Nessun token sulla mappa</p>
            </div>
            <p class="map-pin-hint">I token appaiono sulla mappa e sono trascinabili</p>
        </div>
    </div>

    <!-- Area Mappa Principale -->
    <div class="map-main-area">
        <div class="map-toolbar" id="map-toolbar">
            <div class="map-toolbar-left">
                <span class="map-name-display" id="map-name-display">Nessuna mappa selezionata</span>
            </div>
            <div class="map-toolbar-center">
                <button class="zoom-btn" id="zoom-out-btn" title="Zoom Out">−</button>
                <span class="zoom-display" id="zoom-display">100%</span>
                <button class="zoom-btn" id="zoom-in-btn" title="Zoom In">+</button>
                <button class="zoom-btn" id="zoom-reset-btn" title="Reset Zoom">⟲</button>
            </div>
            <div class="map-toolbar-right">
                <button class="map-toolbar-btn" id="edit-map-btn" disabled>✏️ Modifica</button>
                <button class="map-toolbar-btn danger" id="delete-map-btn" disabled>🗑️ Elimina</button>
            </div>
        </div>

        <div class="map-canvas-container" id="map-canvas-container">
            <div class="map-empty-state" id="map-empty-state">
                <div class="map-empty-icon">🗺️</div>
                <h3>Nessuna Mappa</h3>
                <p>Crea una nuova mappa o carica un'immagine esistente</p>
            </div>
            <div class="map-canvas-wrapper" id="map-canvas-wrapper" style="display: none;">
                <img id="map-image" class="map-image" src="" alt="Mappa">
                <div class="map-pins-layer" id="map-pins-layer"></div>
                <div class="map-party-layer" id="map-party-layer"></div>
                <div class="map-tokens-layer" id="map-tokens-layer"></div>
            </div>
        </div>
    </div>

    <!-- Modal: Nuova/Modifica Mappa -->
    <div class="map-modal-overlay" id="map-modal-overlay"></div>
    <div class="map-modal" id="map-modal">
        <div class="map-modal-header">
            <h3 id="map-modal-title">🗺️ Nuova Mappa</h3>
            <button class="map-modal-close" id="close-map-modal">✕</button>
        </div>
        <div class="map-modal-content">
            <div class="map-form-group">
                <label>Nome Mappa</label>
                <input type="text" id="map-name-input" placeholder="Es. Mondo di Faerûn, Dungeon livello 1...">
            </div>
            <div class="map-form-group">
                <label>Tipo</label>
                <select id="map-type-select">
                    <option value="world">Mondo / Continente</option>
                    <option value="region">Regione</option>
                    <option value="city">Città / Insediamento</option>
                    <option value="dungeon">Dungeon</option>
                    <option value="building">Edificio</option>
                    <option value="other">Altro</option>
                </select>
            </div>
            <div class="map-form-group">
                <label>Immagine Mappa</label>
                <div class="map-image-upload-area" id="map-upload-area">
                    <input type="file" id="map-file-input" accept="image/*" hidden>
                    <div class="upload-placeholder">
                        <span class="upload-icon">📁</span>
                        <span>Trascina un'immagine o clicca per selezionare</span>
                    </div>
                    <img id="map-preview-img" class="map-preview-img" style="display: none;">
                </div>
            </div>
            <div class="map-form-group">
                <label>Note (opzionale)</label>
                <textarea id="map-notes-input" placeholder="Note sulla mappa..."></textarea>
            </div>
        </div>
        <div class="map-modal-footer">
            <button class="map-btn secondary" id="map-cancel-btn">Annulla</button>
            <button class="map-btn primary" id="map-save-btn">Salva Mappa</button>
        </div>
    </div>

    <!-- Modal: Dettagli Pin -->
    <div class="pin-modal-overlay" id="pin-modal-overlay"></div>
    <div class="pin-modal" id="pin-modal">
        <div class="pin-modal-header">
            <h3 id="pin-modal-title">📍 Dettagli Luogo</h3>
            <button class="pin-modal-close" id="close-pin-modal">✕</button>
        </div>
        <div class="pin-modal-content" id="pin-modal-content">
            <!-- Contenuto dinamico -->
        </div>
        <div class="pin-modal-footer">
            <button class="map-btn secondary" id="pin-close-btn">Chiudi</button>
            <button class="map-btn danger" id="pin-remove-btn">Rimuovi Pin</button>
            <button class="map-btn primary" id="pin-goto-btn">Vai al Luogo</button>
        </div>
    </div>

    <!-- Modal: Dettagli Token -->
    <div class="pin-modal-overlay" id="token-modal-overlay"></div>
    <div class="pin-modal" id="token-modal">
        <div class="pin-modal-header">
            <h3 id="token-modal-title">👹 Dettagli Token</h3>
            <button class="pin-modal-close" id="close-token-modal">✕</button>
        </div>
        <div class="pin-modal-content" id="token-modal-content">
            <!-- Contenuto dinamico -->
        </div>
        <div class="pin-modal-footer">
            <button class="map-btn secondary" id="token-close-btn">Chiudi</button>
            <button class="map-btn danger" id="token-remove-btn">Rimuovi Token</button>
        </div>
    </div>
</div>
        `;
    },

    getStyles() {
        return `
/* Layout principale */
.map-manager-layout {
    display: flex;
    height: 100%;
    background: var(--bg-secondary, #1a1a1a);
    overflow: hidden;
}

/* Sidebar */
.map-sidebar {
    flex: 0 0 280px;
    background: var(--card-bg, #252525);
    border-right: 1px solid var(--border-color, #333);
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    gap: 0.75rem;
    overflow-y: auto;
}

.map-sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.map-sidebar-header h2 {
    margin: 0;
    font-family: 'Cinzel', serif;
    font-size: 1rem;
    color: var(--text-primary, #fff);
}

.map-new-btn {
    padding: 0.35rem 0.8rem;
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    border: none;
    border-radius: 4px;
    color: #fff;
    font-family: 'Cinzel', serif;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
}

.map-new-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(8, 145, 178, 0.3);
}

/* Lista mappe */
.map-list {
    flex: 1;
    overflow-y: auto;
    min-height: 100px;
}

.map-list-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem;
    background: var(--bg-tertiary, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 6px;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
}

.map-list-item:hover {
    background: var(--hover-bg, #3a3a3a);
    border-color: #0891b2;
}

.map-list-item.selected {
    border-color: #0891b2;
    background: rgba(8, 145, 178, 0.15);
}

.map-list-item-icon {
    font-size: 1.25rem;
}

.map-list-item-info {
    flex: 1;
    min-width: 0;
}

.map-list-item-name {
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    color: var(--text-primary, #fff);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.map-list-item-type {
    font-size: 0.7rem;
    color: var(--text-muted, #888);
    text-transform: capitalize;
}

.map-empty-list {
    text-align: center;
    color: var(--text-muted, #666);
    padding: 1rem;
    font-size: 0.85rem;
}

/* Sezioni sidebar */
.map-sidebar-section {
    background: var(--bg-tertiary, #2a2a2a);
    border-radius: 6px;
    padding: 0.75rem;
}

.map-sidebar-section h3 {
    margin: 0 0 0.5rem;
    font-family: 'Cinzel', serif;
    font-size: 0.85rem;
    color: var(--text-primary, #fff);
}

.map-pin-controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.map-pin-select {
    width: 100%;
    padding: 0.5rem;
    background: var(--input-bg, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-size: 0.85rem;
}

.map-add-pin-btn,
.party-set-btn,
.party-clear-btn {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
}

.map-add-pin-btn {
    background: #0891b2;
    color: #fff;
}

.map-add-pin-btn:disabled {
    background: #444;
    color: #888;
    cursor: not-allowed;
}

.map-add-pin-btn:not(:disabled):hover {
    background: #0e7490;
}

.party-set-btn {
    background: #f59e0b;
    color: #000;
}

.party-set-btn:hover {
    background: #d97706;
}

.party-clear-btn {
    background: #ef4444;
    color: #fff;
}

.party-clear-btn:hover {
    background: #dc2626;
}

.party-controls {
    display: flex;
    gap: 0.5rem;
}

.map-pin-hint {
    margin: 0.5rem 0 0;
    font-size: 0.7rem;
    color: var(--text-muted, #888);
    font-style: italic;
}

/* Area principale */
.map-main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Toolbar */
.map-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background: var(--card-bg, #252525);
    border-bottom: 1px solid var(--border-color, #333);
}

.map-toolbar-left,
.map-toolbar-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.map-toolbar-center {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.map-name-display {
    font-family: 'Cinzel', serif;
    font-size: 0.95rem;
    color: var(--text-primary, #fff);
}

.zoom-btn {
    width: 28px;
    height: 28px;
    border: 1px solid var(--border-color, #444);
    background: var(--bg-tertiary, #333);
    color: var(--text-primary, #fff);
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.zoom-btn:hover {
    background: #0891b2;
    border-color: #0891b2;
}

.zoom-display {
    font-size: 0.8rem;
    color: var(--text-muted, #888);
    min-width: 50px;
    text-align: center;
}

.map-toolbar-btn {
    padding: 0.35rem 0.75rem;
    border: 1px solid var(--border-color, #444);
    background: var(--bg-tertiary, #333);
    color: var(--text-primary, #fff);
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
}

.map-toolbar-btn:hover {
    background: var(--hover-bg, #444);
}

.map-toolbar-btn.danger:hover {
    background: #ef4444;
    border-color: #ef4444;
}

.map-toolbar-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Canvas container */
.map-canvas-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    background: #0a0a0a;
    cursor: grab;
}

.map-canvas-container.placing-pin {
    cursor: crosshair;
}

.map-canvas-container.placing-party {
    cursor: crosshair;
}

.map-canvas-container.grabbing {
    cursor: grabbing;
}

.map-empty-state {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-muted, #666);
}

.map-empty-icon {
    font-size: 4rem;
    opacity: 0.5;
    margin-bottom: 1rem;
}

.map-empty-state h3 {
    margin: 0;
    font-family: 'Cinzel', serif;
}

.map-empty-state p {
    margin: 0.5rem 0 0;
    font-size: 0.9rem;
}

/* Canvas wrapper */
.map-canvas-wrapper {
    position: absolute;
    transform-origin: 0 0;
}

.map-image {
    display: block;
    max-width: none;
    user-select: none;
    -webkit-user-drag: none;
}

/* Layer pin */
.map-pins-layer,
.map-party-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

/* Pin */
.map-pin {
    position: absolute;
    width: 32px;
    height: 32px;
    margin-left: -16px;
    margin-top: -32px;
    cursor: pointer;
    pointer-events: auto;
    transition: transform 0.15s, filter 0.15s;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}

.map-pin:hover {
    transform: scale(1.2);
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.7));
}

.map-pin.dragging {
    cursor: grabbing;
    transform: scale(1.3);
    z-index: 100;
}

.map-pin.selected {
    animation: pin-pulse 1s infinite;
}

@keyframes pin-pulse {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(8, 145, 178, 0.8)); }
    50% { filter: drop-shadow(0 0 16px rgba(8, 145, 178, 1)); }
}

.map-pin-icon {
    width: 100%;
    height: 100%;
}

.map-pin-label {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    margin-bottom: 4px;
}

.map-pin:hover .map-pin-label {
    opacity: 1;
}

/* Party token */
.party-token {
    position: absolute;
    width: 40px;
    height: 40px;
    margin-left: -20px;
    margin-top: -20px;
    cursor: grab;
    pointer-events: auto;
    color: #fbbf24;
    filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.8));
    animation: party-glow 2s infinite;
    transition: transform 0.15s;
}

.party-token:hover {
    transform: scale(1.2);
}

.party-token.dragging {
    cursor: grabbing;
    animation: none;
    transform: scale(1.3);
}

@keyframes party-glow {
    0%, 100% { filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.6)); }
    50% { filter: drop-shadow(0 0 20px rgba(251, 191, 36, 1)); }
}

.party-token-icon {
    width: 100%;
    height: 100%;
}

/* Modal mappa */
.map-modal-overlay,
.pin-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
    display: none;
}

.map-modal-overlay.active,
.pin-modal-overlay.active {
    display: block;
}

.map-modal,
.pin-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 500px;
    background: var(--card-bg, #252525);
    border-radius: 12px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: none;
    flex-direction: column;
}

.map-modal.active,
.pin-modal.active {
    display: flex;
}

.map-modal-header,
.pin-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color, #333);
}

.map-modal-header h3,
.pin-modal-header h3 {
    margin: 0;
    font-family: 'Cinzel', serif;
    color: var(--text-primary, #fff);
}

.map-modal-close,
.pin-modal-close {
    background: none;
    border: none;
    color: var(--text-muted, #888);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    line-height: 1;
}

.map-modal-close:hover,
.pin-modal-close:hover {
    color: var(--text-primary, #fff);
}

.map-modal-content,
.pin-modal-content {
    padding: 1.5rem;
    overflow-y: auto;
    max-height: 60vh;
}

.map-form-group {
    margin-bottom: 1rem;
}

.map-form-group:last-child {
    margin-bottom: 0;
}

.map-form-group label {
    display: block;
    font-size: 0.8rem;
    color: var(--text-muted, #888);
    margin-bottom: 0.35rem;
    text-transform: uppercase;
}

.map-form-group input,
.map-form-group select,
.map-form-group textarea {
    width: 100%;
    padding: 0.6rem;
    background: var(--input-bg, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-family: 'Lora', serif;
    font-size: 0.9rem;
}

.map-form-group textarea {
    min-height: 80px;
    resize: vertical;
}

/* Upload area */
.map-image-upload-area {
    border: 2px dashed var(--border-color, #444);
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
}

.map-image-upload-area:hover,
.map-image-upload-area.dragover {
    border-color: #0891b2;
    background: rgba(8, 145, 178, 0.1);
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-muted, #888);
}

.upload-icon {
    font-size: 2rem;
}

.map-preview-img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 4px;
}

/* Modal footer */
.map-modal-footer,
.pin-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border-color, #333);
}

.map-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
}

.map-btn.primary {
    background: #0891b2;
    color: #fff;
}

.map-btn.primary:hover {
    background: #0e7490;
}

.map-btn.secondary {
    background: var(--bg-tertiary, #333);
    color: var(--text-primary, #fff);
    border: 1px solid var(--border-color, #444);
}

.map-btn.secondary:hover {
    background: var(--hover-bg, #444);
}

.map-btn.danger {
    background: #ef4444;
    color: #fff;
}

.map-btn.danger:hover {
    background: #dc2626;
}

/* Pin modal content */
.pin-detail-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color, #333);
}

.pin-detail-icon {
    font-size: 2.5rem;
}

.pin-detail-title {
    font-family: 'Cinzel Decorative', serif;
    font-size: 1.25rem;
    color: #0891b2;
    margin: 0;
}

.pin-detail-type {
    font-size: 0.8rem;
    color: var(--text-muted, #888);
    margin-top: 0.25rem;
}

.pin-detail-section {
    margin-bottom: 1rem;
}

.pin-detail-section h4 {
    margin: 0 0 0.5rem;
    font-family: 'Cinzel', serif;
    font-size: 0.85rem;
    color: #0891b2;
    text-transform: uppercase;
}

.pin-detail-section p {
    margin: 0;
    color: var(--text-primary, #fff);
    line-height: 1.5;
}

.pin-detail-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
}

.pin-detail-tag {
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    font-size: 0.7rem;
    color: #fff;
}

/* === TOKEN LAYER === */
.map-tokens-layer {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 15;
}

.map-token-wrapper {
    position: absolute;
    pointer-events: auto;
    cursor: grab;
    z-index: 20;
    transition: filter 0.2s;
}
.map-token-wrapper:hover {
    filter: brightness(1.3) drop-shadow(0 0 6px rgba(255,255,255,0.5));
    z-index: 25;
}
.map-token-wrapper:active {
    cursor: grabbing;
}
.map-token-wrapper.flash {
    animation: tokenFlash 1s ease;
}
@keyframes tokenFlash {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(2) drop-shadow(0 0 10px #fff); }
}

.monster-token {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.monster-token-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 3px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.5);
    position: relative;
}

.monster-token-initial {
    font-size: 0.9rem;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    text-transform: uppercase;
}

.monster-token-hp-bar {
    position: absolute;
    bottom: -6px;
    left: 10%;
    width: 80%;
    height: 5px;
    background: rgba(0,0,0,0.6);
    border-radius: 3px;
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.8);
}

.monster-token-hp-fill {
    height: 100%;
    transition: width 0.3s ease;
}

.monster-token-label {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 0.65rem;
    color: #fff;
    background: rgba(0,0,0,0.75);
    padding: 1px 5px;
    border-radius: 3px;
    margin-top: 8px;
    pointer-events: none;
}

.token-condition-badge {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    border: 1px solid rgba(255,255,255,0.3);
    transform: translate(-50%, -50%);
}

/* === SIDEBAR TOKEN CONTROLS === */
.token-controls {
    display: flex;
    gap: 4px;
    margin-bottom: 6px;
}

.token-search-input {
    flex: 1;
    min-width: 0;
    padding: 5px 8px;
    background: var(--bg-secondary, #1a1a1a);
    border: 1px solid var(--border-color, #3a3a3a);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-size: 0.8rem;
}

.token-search-input:focus {
    outline: none;
    border-color: var(--accent-color, #0891b2);
}

.token-add-btn {
    padding: 5px 10px;
    background: var(--accent-color, #0891b2);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    white-space: nowrap;
}
.token-add-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
.token-add-btn:not(:disabled):hover {
    background: #0e7490;
}

.token-list {
    max-height: 200px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-bottom: 6px;
}

.token-list-empty {
    color: var(--text-muted, #666);
    font-size: 0.75rem;
    text-align: center;
    padding: 10px;
    font-style: italic;
}

.token-list-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 8px;
    background: var(--bg-tertiary, #2a2a2a);
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s;
}
.token-list-item:hover {
    background: var(--hover-bg, #3a3a3a);
}

.token-list-color {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
}

.token-list-name {
    flex: 1;
    font-size: 0.75rem;
    color: var(--text-primary, #fff);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.token-list-hp {
    font-size: 0.65rem;
    color: var(--text-muted, #888);
    background: rgba(0,0,0,0.3);
    padding: 1px 4px;
    border-radius: 3px;
}

.token-list-remove {
    background: none;
    border: none;
    color: var(--text-muted, #666);
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0 2px;
}
.token-list-remove:hover {
    color: #ef4444;
}

/* === TOKEN MODAL === */
.token-detail-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.token-detail-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    border: 3px solid rgba(0,0,0,0.3);
}

.token-detail-header h4 {
    margin: 0;
    font-size: 1rem;
    color: var(--text-primary, #fff);
}

.token-detail-header p {
    margin: 2px 0 0;
    font-size: 0.8rem;
    color: var(--text-muted, #888);
}

.token-detail-section {
    margin-bottom: 14px;
}

.token-detail-section h5 {
    margin: 0 0 6px;
    font-size: 0.85rem;
    color: var(--accent-color, #0891b2);
}

.token-hp-display {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
}

.token-hp-display input {
    padding: 4px 8px;
    background: var(--bg-secondary, #1a1a1a);
    border: 1px solid var(--border-color, #3a3a3a);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    text-align: center;
}

.token-hp-bar-large {
    width: 100%;
    height: 10px;
    background: rgba(0,0,0,0.4);
    border-radius: 5px;
    overflow: hidden;
}

.token-hp-fill-large {
    height: 100%;
    border-radius: 5px;
    transition: width 0.3s ease;
}

.token-conditions-list {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
}

.token-condition-tag {
    font-size: 0.7rem;
    padding: 2px 8px;
    background: rgba(255, 152, 0, 0.2);
    border: 1px solid rgba(255, 152, 0, 0.4);
    border-radius: 10px;
    color: #ffb74d;
}
        `;
    },

    // ═══════════════════════════════════════════════════════════════
    // RENDER HELPERS
    // ═══════════════════════════════════════════════════════════════

    renderMapsList() {
        if (this.maps.length === 0) {
            return '<div class="map-empty-list">Nessuna mappa creata</div>';
        }

        const typeIcons = {
            world: '🌍',
            region: '🗺️',
            city: '🏘️',
            dungeon: '🏰',
            building: '🏠',
            other: '📍'
        };

        return this.maps.map(map => `
            <div class="map-list-item" data-map-id="${map.id}">
                <span class="map-list-item-icon">${typeIcons[map.type] || '📍'}</span>
                <div class="map-list-item-info">
                    <div class="map-list-item-name">${escapeHtml(map.name)}</div>
                    <div class="map-list-item-type">${map.type}</div>
                </div>
            </div>
        `).join('');
    },

    renderLocationOptions() {
        if (this.locations.length === 0) {
            return '<option value="">Nessun luogo disponibile</option>';
        }

        return this.locations
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
            .map(loc => `<option value="${loc.id}">${escapeHtml(loc.name)} (${loc.type || 'Luogo'})</option>`)
            .join('');
    },

    // ═══════════════════════════════════════════════════════════════
    // EVENT BINDING
    // ═══════════════════════════════════════════════════════════════

    bindEvents() {
        // Toolbar buttons
        this.container.querySelector('#zoom-in-btn').addEventListener('click', () => this.adjustZoom(0.25));
        this.container.querySelector('#zoom-out-btn').addEventListener('click', () => this.adjustZoom(-0.25));
        this.container.querySelector('#zoom-reset-btn').addEventListener('click', () => this.resetZoom());

        // Map management
        this.container.querySelector('#map-new-btn').addEventListener('click', () => this.openMapModal());
        this.container.querySelector('#edit-map-btn').addEventListener('click', () => this.openMapModal(this.currentMapId));
        this.container.querySelector('#delete-map-btn').addEventListener('click', () => this.deleteCurrentMap());

        // Map list selection
        this.container.querySelector('#map-list').addEventListener('click', (e) => {
            const item = e.target.closest('.map-list-item');
            if (item) {
                this.selectMap(item.dataset.mapId);
            }
        });

        // Pin controls
        const pinSelect = this.container.querySelector('#pin-location-select');
        pinSelect.addEventListener('change', () => {
            this.container.querySelector('#add-pin-btn').disabled = !pinSelect.value || !this.currentMapId;
        });

        this.container.querySelector('#add-pin-btn').addEventListener('click', () => {
            if (pinSelect.value && this.currentMapId) {
                this.startPlacingPin(pinSelect.value);
            }
        });

        // Party controls
        this.container.querySelector('#set-party-btn').addEventListener('click', () => {
            if (this.currentMapId) {
                this.startPlacingParty();
            } else {
                showToast('Seleziona prima una mappa', 'warning');
            }
        });

        this.container.querySelector('#clear-party-btn').addEventListener('click', () => {
            this.clearPartyPosition();
        });

        // Token management events
        const tokenSearchInput = this.container.querySelector('#token-search-input');
        const addTokenBtn = this.container.querySelector('#add-token-btn');
        
        tokenSearchInput?.addEventListener('input', (e) => {
            const name = e.target.value.trim();
            // Verifica se il mostro esiste nel database
            const found = name.length >= 2 && monsterDatabase.some(m => 
                m.name.toLowerCase().includes(name.toLowerCase())
            );
            if (addTokenBtn) addTokenBtn.disabled = !found;
        });
        
        addTokenBtn?.addEventListener('click', () => {
            const name = tokenSearchInput.value.trim();
            if (name) {
                // Trova il mostro esatto
                const monster = monsterDatabase.find(m => 
                    m.name.toLowerCase() === name.toLowerCase()
                );
                if (monster) {
                    this.addToken(monster.name);
                    tokenSearchInput.value = '';
                    addTokenBtn.disabled = true;
                } else {
                    // Cerca il primo match parziale
                    const partial = monsterDatabase.find(m => 
                        m.name.toLowerCase().includes(name.toLowerCase())
                    );
                    if (partial) {
                        this.addToken(partial.name);
                        tokenSearchInput.value = '';
                        addTokenBtn.disabled = true;
                    }
                }
            }
        });
        
        tokenSearchInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !addTokenBtn.disabled) {
                addTokenBtn.click();
            }
        });

        // Token modal events
        this.container.querySelector('#close-token-modal')?.addEventListener('click', () => {
            this.closeTokenModal();
        });
        this.container.querySelector('#token-close-btn')?.addEventListener('click', () => {
            this.closeTokenModal();
        });
        this.container.querySelector('#token-modal-overlay')?.addEventListener('click', () => {
            this.closeTokenModal();
        });
        this.container.querySelector('#token-remove-btn')?.addEventListener('click', () => {
            if (this.selectedTokenId) {
                this.removeToken(this.selectedTokenId);
                this.closeTokenModal();
            }
        });

        // Canvas interactions
        const canvasContainer = this.container.querySelector('#map-canvas-container');
        canvasContainer.addEventListener('mousedown', (e) => this.handleCanvasMouseDown(e));
        canvasContainer.addEventListener('mousemove', (e) => this.handleCanvasMouseMove(e));
        canvasContainer.addEventListener('mouseup', (e) => this.handleCanvasMouseUp(e));
        canvasContainer.addEventListener('mouseleave', (e) => this.handleCanvasMouseUp(e));
        canvasContainer.addEventListener('wheel', (e) => this.handleCanvasWheel(e));

        // Modal events
        this.bindModalEvents();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    },

    bindModalEvents() {
        // Map modal
        const mapModal = this.container.querySelector('#map-modal');
        const mapOverlay = this.container.querySelector('#map-modal-overlay');
        const closeBtn = this.container.querySelector('#close-map-modal');
        const cancelBtn = this.container.querySelector('#map-cancel-btn');
        const saveBtn = this.container.querySelector('#map-save-btn');
        const uploadArea = this.container.querySelector('#map-upload-area');
        const fileInput = this.container.querySelector('#map-file-input');

        closeBtn.addEventListener('click', () => this.closeMapModal());
        cancelBtn.addEventListener('click', () => this.closeMapModal());
        mapOverlay.addEventListener('click', () => this.closeMapModal());
        saveBtn.addEventListener('click', () => this.saveMap());

        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleImageFile(file);
            }
        });
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleImageFile(file);
            }
        });

        // Pin modal
        const pinModal = this.container.querySelector('#pin-modal');
        const pinOverlay = this.container.querySelector('#pin-modal-overlay');
        const pinCloseBtn = this.container.querySelector('#close-pin-modal');
        const pinCloseAction = this.container.querySelector('#pin-close-btn');
        const pinRemoveBtn = this.container.querySelector('#pin-remove-btn');
        const pinGotoBtn = this.container.querySelector('#pin-goto-btn');

        pinCloseBtn.addEventListener('click', () => this.closePinModal());
        pinCloseAction.addEventListener('click', () => this.closePinModal());
        pinOverlay.addEventListener('click', () => this.closePinModal());
        pinRemoveBtn.addEventListener('click', () => this.removeSelectedPin());
        pinGotoBtn.addEventListener('click', () => this.goToLocation());
    },

    // ═══════════════════════════════════════════════════════════════
    // MAP MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    selectMap(mapId) {
        this.currentMapId = mapId;
        const map = this.maps.find(m => m.id === mapId);

        if (!map) return;

        // Update UI
        this.container.querySelectorAll('.map-list-item').forEach(item => {
            item.classList.toggle('selected', item.dataset.mapId === mapId);
        });

        this.container.querySelector('#map-name-display').textContent = map.name;
        this.container.querySelector('#edit-map-btn').disabled = false;
        this.container.querySelector('#delete-map-btn').disabled = false;

        // Show map
        const emptyState = this.container.querySelector('#map-empty-state');
        const wrapper = this.container.querySelector('#map-canvas-wrapper');
        const mapImage = this.container.querySelector('#map-image');

        emptyState.style.display = 'none';
        wrapper.style.display = 'block';
        mapImage.src = map.imageData;

        // Reset zoom
        this.resetZoom();

        // Render pins
        this.renderPins();

        // Render party
        this.renderPartyToken();

        // Render tokens
        this.renderTokens();
        this.renderTokenList();

        console.log(`🗺️ [MapManager] Mappa selezionata: ${map.name}`);
    },

    openMapModal(mapId = null) {
        const modal = this.container.querySelector('#map-modal');
        const overlay = this.container.querySelector('#map-modal-overlay');
        const title = this.container.querySelector('#map-modal-title');

        this.editingMapId = mapId;

        if (mapId) {
            const map = this.maps.find(m => m.id === mapId);
            if (map) {
                title.textContent = '✏️ Modifica Mappa';
                this.container.querySelector('#map-name-input').value = map.name;
                this.container.querySelector('#map-type-select').value = map.type;
                this.container.querySelector('#map-notes-input').value = map.notes || '';

                const preview = this.container.querySelector('#map-preview-img');
                const placeholder = this.container.querySelector('.upload-placeholder');
                preview.src = map.imageData;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
                this.pendingImageData = map.imageData;
            }
        } else {
            title.textContent = '🗺️ Nuova Mappa';
            this.container.querySelector('#map-name-input').value = '';
            this.container.querySelector('#map-type-select').value = 'world';
            this.container.querySelector('#map-notes-input').value = '';

            const preview = this.container.querySelector('#map-preview-img');
            const placeholder = this.container.querySelector('.upload-placeholder');
            preview.style.display = 'none';
            placeholder.style.display = 'flex';
            this.pendingImageData = null;
        }

        modal.classList.add('active');
        overlay.classList.add('active');
    },

    closeMapModal() {
        this.container.querySelector('#map-modal').classList.remove('active');
        this.container.querySelector('#map-modal-overlay').classList.remove('active');
        this.editingMapId = null;
        this.pendingImageData = null;
    },

    handleImageFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = this.container.querySelector('#map-preview-img');
            const placeholder = this.container.querySelector('.upload-placeholder');

            preview.src = e.target.result;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
            this.pendingImageData = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    saveMap() {
        const name = this.container.querySelector('#map-name-input').value.trim();
        const type = this.container.querySelector('#map-type-select').value;
        const notes = this.container.querySelector('#map-notes-input').value.trim();

        if (!name) {
            showToast('Inserisci un nome per la mappa', 'warning');
            return;
        }

        if (!this.pendingImageData && !this.editingMapId) {
            showToast('Seleziona un\'immagine per la mappa', 'warning');
            return;
        }

        if (this.editingMapId) {
            // Update existing
            const map = this.maps.find(m => m.id === this.editingMapId);
            if (map) {
                map.name = name;
                map.type = type;
                map.notes = notes;
                if (this.pendingImageData) {
                    map.imageData = this.pendingImageData;
                }
                showToast('Mappa aggiornata!', 'success');
            }
        } else {
            // Create new
            const newMap = {
                id: `map_${Date.now()}`,
                name,
                type,
                notes,
                imageData: this.pendingImageData,
                createdAt: Date.now()
            };
            this.maps.push(newMap);
            showToast('Mappa creata!', 'success');
        }

        saveMaps(this.maps);
        this.closeMapModal();

        // Refresh list
        this.container.querySelector('#map-list').innerHTML = this.renderMapsList();

        // Select new/edited map
        const targetId = this.editingMapId || this.maps[this.maps.length - 1].id;
        this.selectMap(targetId);
    },

    deleteCurrentMap() {
        if (!this.currentMapId) return;

        const map = this.maps.find(m => m.id === this.currentMapId);
        if (!map) return;

        if (!confirm(`Eliminare la mappa "${map.name}"? I pin associati verranno rimossi.`)) return;

        // Remove map
        this.maps = this.maps.filter(m => m.id !== this.currentMapId);
        saveMaps(this.maps);

        // Remove pins for this map
        delete this.pins[this.currentMapId];
        savePins(this.pins);

        // Remove party position
        delete this.partyPositions[this.currentMapId];
        savePartyPosition(this.currentMapId, null);

        // Remove tokens for this map
        delete this.tokens[this.currentMapId];
        saveTokens(this.tokens);

        // Update UI
        this.container.querySelector('#map-list').innerHTML = this.renderMapsList();
        this.currentMapId = null;

        // Show empty state
        this.container.querySelector('#map-empty-state').style.display = 'flex';
        this.container.querySelector('#map-canvas-wrapper').style.display = 'none';
        this.container.querySelector('#map-name-display').textContent = 'Nessuna mappa selezionata';
        this.container.querySelector('#edit-map-btn').disabled = true;
        this.container.querySelector('#delete-map-btn').disabled = true;

        showToast('Mappa eliminata', 'info');
    },

    // ═══════════════════════════════════════════════════════════════
    // PIN MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    startPlacingPin(locationId) {
        const canvasContainer = this.container.querySelector('#map-canvas-container');
        canvasContainer.classList.add('placing-pin');
        this.placingPinLocationId = locationId;
        showToast('Clicca sulla mappa per posizionare il pin', 'info');
    },

    startPlacingParty() {
        const canvasContainer = this.container.querySelector('#map-canvas-container');
        canvasContainer.classList.add('placing-party');
        showToast('Clicca sulla mappa per posizionare il party', 'info');
    },

    placePin(x, y, locationId) {
        if (!this.currentMapId || !locationId) return;

        const location = this.locations.find(l => l.id === locationId);
        if (!location) return;

        // Initialize pins array for this map if needed
        if (!this.pins[this.currentMapId]) {
            this.pins[this.currentMapId] = [];
        }

        // Check if pin already exists for this location
        const existingIndex = this.pins[this.currentMapId].findIndex(p => p.locationId === locationId);
        if (existingIndex >= 0) {
            // Update position
            this.pins[this.currentMapId][existingIndex].x = x;
            this.pins[this.currentMapId][existingIndex].y = y;
        } else {
            // Add new pin
            this.pins[this.currentMapId].push({
                id: `pin_${Date.now()}`,
                locationId,
                x,
                y
            });
        }

        savePins(this.pins);
        this.renderPins();

        // Reset state
        const canvasContainer = this.container.querySelector('#map-canvas-container');
        canvasContainer.classList.remove('placing-pin');
        this.placingPinLocationId = null;

        // Reset select
        this.container.querySelector('#pin-location-select').value = '';
        this.container.querySelector('#add-pin-btn').disabled = true;

        showToast(`Pin posizionato per "${location.name}"`, 'success');
    },

    placePartyToken(x, y) {
        if (!this.currentMapId) return;

        this.partyPositions[this.currentMapId] = { x, y };
        savePartyPosition(this.currentMapId, { x, y });
        this.renderPartyToken();

        // Reset state
        const canvasContainer = this.container.querySelector('#map-canvas-container');
        canvasContainer.classList.remove('placing-party');

        showToast('Party posizionato!', 'success');
    },

    clearPartyPosition() {
        if (!this.currentMapId) return;

        delete this.partyPositions[this.currentMapId];
        savePartyPosition(this.currentMapId, null);
        this.renderPartyToken();

        showToast('Posizione party rimossa', 'info');
    },

    renderPins() {
        const layer = this.container.querySelector('#map-pins-layer');
        layer.innerHTML = '';

        if (!this.currentMapId || !this.pins[this.currentMapId]) return;

        const pins = this.pins[this.currentMapId];

        pins.forEach(pin => {
            const location = this.locations.find(l => l.id === pin.locationId);
            if (!location) return;

            const pinEl = document.createElement('div');
            pinEl.className = 'map-pin';
            pinEl.dataset.pinId = pin.id;
            pinEl.style.left = `${pin.x}%`;
            pinEl.style.top = `${pin.y}%`;

            const color = this.getPinColor(location);

            pinEl.innerHTML = `
                <svg class="map-pin-icon" viewBox="0 0 24 24" fill="${color}">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span class="map-pin-label">${escapeHtml(location.name)}</span>
            `;

            // Click to show details
            pinEl.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showPinDetails(pin);
            });

            // Drag to move
            pinEl.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                this.startPinDrag(e, pin);
            });

            layer.appendChild(pinEl);
        });
    },

    renderPartyToken() {
        const layer = this.container.querySelector('#map-party-layer');
        layer.innerHTML = '';

        if (!this.currentMapId || !this.partyPositions[this.currentMapId]) return;

        const pos = this.partyPositions[this.currentMapId];

        const token = document.createElement('div');
        token.className = 'party-token';
        token.style.left = `${pos.x}%`;
        token.style.top = `${pos.y}%`;
        token.innerHTML = PARTY_TOKEN_SVG;

        // Drag to move
        token.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.startPartyDrag(e);
        });

        layer.appendChild(token);
    },

    // ═══════════════════════════════════════════════════════════════
    // TOKEN MANAGEMENT (Mostri/NPC sulla mappa)
    // ═══════════════════════════════════════════════════════════════

    renderMonsterDatalist() {
        // Mostra solo i primi 100 mostri per non appesantire il DOM
        return monsterDatabase.slice(0, 100).map(m => 
            `<option value="${escapeHtml(m.name)}">${m.size} ${m.type}, CR ${m.challenge_rating}</option>`
        ).join('');
    },

    renderTokens() {
        const layer = this.container.querySelector('#map-tokens-layer');
        if (!layer) return;
        layer.innerHTML = '';

        if (!this.currentMapId || !this.tokens[this.currentMapId]) return;

        const mapTokens = this.tokens[this.currentMapId];
        mapTokens.forEach(token => {
            const tokenEl = document.createElement('div');
            tokenEl.className = 'map-token-wrapper';
            tokenEl.dataset.tokenId = token.id;
            tokenEl.style.left = `${token.x}%`;
            tokenEl.style.top = `${token.y}%`;
            tokenEl.style.transform = 'translate(-50%, -50%)';
            tokenEl.innerHTML = generateMonsterTokenHTML({
                name: token.name,
                type: token.monsterType,
                size: token.monsterSize,
                color: token.color,
                hp: token.hp?.current,
                maxHp: token.hp?.max,
                conditions: token.conditions || []
            });

            // Click to show details
            tokenEl.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showTokenDetails(token.id);
            });

            // Drag to move
            tokenEl.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                this.startTokenDrag(e, token.id);
            });

            layer.appendChild(tokenEl);
        });
    },

    renderTokenList() {
        const list = this.container.querySelector('#token-list');
        if (!list) return;

        if (!this.currentMapId || !this.tokens[this.currentMapId] || this.tokens[this.currentMapId].length === 0) {
            list.innerHTML = '<p class="token-list-empty">Nessun token sulla mappa</p>';
            return;
        }

        const mapTokens = this.tokens[this.currentMapId];
        list.innerHTML = mapTokens.map(token => `
            <div class="token-list-item" data-token-id="${token.id}">
                <div class="token-list-color" style="background: ${token.color};"></div>
                <span class="token-list-name">${escapeHtml(token.name)}</span>
                <span class="token-list-hp">${token.hp?.current || '?'}/${token.hp?.max || '?'}</span>
                <button class="token-list-remove" data-token-id="${token.id}" title="Rimuovi">✕</button>
            </div>
        `).join('');

        // Bind remove buttons
        list.querySelectorAll('.token-list-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeToken(btn.dataset.tokenId);
            });
        });

        // Click to select token on map
        list.querySelectorAll('.token-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const tokenId = item.dataset.tokenId;
                // Flash the token on the map
                const tokenEl = this.container.querySelector(`.map-token-wrapper[data-token-id="${tokenId}"]`);
                if (tokenEl) {
                    tokenEl.classList.add('flash');
                    setTimeout(() => tokenEl.classList.remove('flash'), 1000);
                }
            });
        });
    },

    addToken(monsterName) {
        if (!this.currentMapId) {
            showToast('Seleziona prima una mappa', 'warning');
            return;
        }

        // Cerca il mostro nel database per nome
        const monster = monsterDatabase.find(m => 
            m.name.toLowerCase() === monsterName.toLowerCase()
        );
        
        if (!monster) {
            showToast(`Mostro "${monsterName}" non trovato`, 'error');
            return;
        }

        // Crea il token
        const token = buildTokenFromMonster(monster.index, {
            x: 50 + (Math.random() - 0.5) * 20,
            y: 50 + (Math.random() - 0.5) * 20,
        });

        if (!token) {
            showToast('Errore creazione token', 'error');
            return;
        }

        // Aggiungi alla mappa corrente
        if (!this.tokens[this.currentMapId]) {
            this.tokens[this.currentMapId] = [];
        }
        this.tokens[this.currentMapId].push(token);
        saveTokens(this.tokens);

        // Re-render
        this.renderTokens();
        this.renderTokenList();
        showToast(`${token.name} aggiunto alla mappa`, 'success');
    },

    removeToken(tokenId) {
        if (!this.currentMapId || !this.tokens[this.currentMapId]) return;

        this.tokens[this.currentMapId] = this.tokens[this.currentMapId].filter(t => t.id !== tokenId);
        saveTokens(this.tokens);

        this.renderTokens();
        this.renderTokenList();
        showToast('Token rimosso', 'info');
    },

    showTokenDetails(tokenId) {
        if (!this.currentMapId || !this.tokens[this.currentMapId]) return;
        
        const token = this.tokens[this.currentMapId].find(t => t.id === tokenId);
        if (!token) return;

        this.selectedTokenId = tokenId;

        const modal = this.container.querySelector('#token-modal');
        const overlay = this.container.querySelector('#token-modal-overlay');
        const content = this.container.querySelector('#token-modal-content');
        const title = this.container.querySelector('#token-modal-title');

        title.textContent = `👹 ${token.name}`;

        const hpPercent = token.hp?.max > 0 ? Math.round((token.hp.current / token.hp.max) * 100) : 100;
        
        content.innerHTML = `
            <div class="token-detail-header">
                <div class="token-detail-icon" style="background: ${token.color};">
                    ${escapeHtml(token.name.charAt(0).toUpperCase())}
                </div>
                <div>
                    <h4>${escapeHtml(token.name)}</h4>
                    <p>${token.monsterType || 'Tipo sconosciuto'} • ${token.monsterSize || 'Media'}</p>
                </div>
            </div>
            <div class="token-detail-section">
                <h5>❤️ Punti Ferita</h5>
                <div class="token-hp-display">
                    <input type="number" id="token-hp-current" value="${token.hp?.current || 0}" min="0" max="${token.hp?.max || 999}" style="width: 60px;">
                    <span>/</span>
                    <input type="number" id="token-hp-max" value="${token.hp?.max || 0}" min="1" style="width: 60px;">
                    <button class="map-btn primary" id="token-update-hp-btn" style="margin-left: 10px;">Aggiorna</button>
                </div>
                <div class="token-hp-bar-large">
                    <div class="token-hp-fill-large" style="width: ${hpPercent}%; background: ${hpPercent <= 25 ? '#ef4444' : hpPercent <= 50 ? '#f59e0b' : '#22c55e'};"></div>
                </div>
            </div>
            ${token.conditions && token.conditions.length > 0 ? `
                <div class="token-detail-section">
                    <h5>⚠️ Condizioni</h5>
                    <div class="token-conditions-list">
                        ${token.conditions.map(c => `<span class="token-condition-tag">${escapeHtml(c)}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            <div class="token-detail-section">
                <h5>📍 Posizione</h5>
                <p>X: ${token.x.toFixed(1)}% • Y: ${token.y.toFixed(1)}%</p>
            </div>
        `;

        overlay.classList.add('show');
        modal.classList.add('show');

        // Bind HP update
        this.container.querySelector('#token-update-hp-btn')?.addEventListener('click', () => {
            const currentHp = parseInt(this.container.querySelector('#token-hp-current').value, 10) || 0;
            const maxHp = parseInt(this.container.querySelector('#token-hp-max').value, 10) || 1;
            token.hp = { current: currentHp, max: maxHp };
            saveTokens(this.tokens);
            this.renderTokens();
            this.renderTokenList();
            showToast('HP aggiornato', 'success');
            this.closeTokenModal();
        });
    },

    closeTokenModal() {
        this.container.querySelector('#token-modal-overlay')?.classList.remove('show');
        this.container.querySelector('#token-modal')?.classList.remove('show');
        this.selectedTokenId = null;
    },

    startTokenDrag(e, tokenId) {
        e.preventDefault();
        this.isDragging = true;
        this.dragTarget = { type: 'token', id: tokenId };
        
        const wrapper = this.container.querySelector('#map-canvas-wrapper');
        const img = this.container.querySelector('#map-image');
        if (!wrapper || !img) return;

        const onMove = (e) => {
            if (!this.isDragging || this.dragTarget?.type !== 'token') return;
            const rect = img.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            const clampedX = Math.max(0, Math.min(100, x));
            const clampedY = Math.max(0, Math.min(100, y));
            
            // Update token position
            if (this.tokens[this.currentMapId]) {
                const token = this.tokens[this.currentMapId].find(t => t.id === tokenId);
                if (token) {
                    token.x = clampedX;
                    token.y = clampedY;
                    // Update DOM directly for smooth dragging
                    const tokenEl = this.container.querySelector(`.map-token-wrapper[data-token-id="${tokenId}"]`);
                    if (tokenEl) {
                        tokenEl.style.left = `${clampedX}%`;
                        tokenEl.style.top = `${clampedY}%`;
                    }
                }
            }
        };

        const onUp = () => {
            if (this.isDragging && this.dragTarget?.type === 'token') {
                saveTokens(this.tokens);
            }
            this.isDragging = false;
            this.dragTarget = null;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    },

    getPinColor(location) {
        // Try to get color from danger tags
        if (location.tags && location.tags.length > 0) {
            const dangerTags = ['letale', 'ostile', 'pericoloso', 'neutrale', 'sicuro'];
            for (const tag of dangerTags) {
                if (location.tags.includes(tag)) {
                    return PIN_COLORS[tag] || PIN_COLORS.custom;
                }
            }
        }

        // Get color from location level
        const levelColors = {
            1: PIN_COLORS.mondo,
            2: PIN_COLORS.regione,
            3: PIN_COLORS.dominio,
            4: PIN_COLORS.area,
            5: PIN_COLORS.insediamento,
            6: PIN_COLORS.edificio,
            7: PIN_COLORS.stanza
        };

        return levelColors[location.level] || PIN_COLORS.custom;
    },

    showPinDetails(pin) {
        const location = this.locations.find(l => l.id === pin.locationId);
        if (!location) return;

        this.selectedPinId = pin.id;

        const modal = this.container.querySelector('#pin-modal');
        const overlay = this.container.querySelector('#pin-modal-overlay');
        const content = this.container.querySelector('#pin-modal-content');

        const levelNames = {
            1: 'Mondo', 2: 'Regione', 3: 'Dominio', 4: 'Area',
            5: 'Insediamento', 6: 'Edificio', 7: 'Stanza'
        };

        let tagsHtml = '';
        if (location.tags && location.tags.length > 0) {
            tagsHtml = `
                <div class="pin-detail-section">
                    <h4>Tag</h4>
                    <div class="pin-detail-tags">
                        ${location.tags.map(tag => `<span class="pin-detail-tag" style="background: ${PIN_COLORS[tag] || '#6b7280'}">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        let descriptionHtml = '';
        if (location.description) {
            descriptionHtml = `
                <div class="pin-detail-section">
                    <h4>Descrizione</h4>
                    <p>${escapeHtml(location.description)}</p>
                </div>
            `;
        }

        let secretHtml = '';
        if (location.secret) {
            secretHtml = `
                <div class="pin-detail-section">
                    <h4>🔒 Segreto</h4>
                    <p style="color: #a78bfa;">${escapeHtml(location.secret)}</p>
                </div>
            `;
        }

        content.innerHTML = `
            <div class="pin-detail-header">
                <span class="pin-detail-icon">📍</span>
                <div>
                    <h3 class="pin-detail-title">${escapeHtml(location.name)}</h3>
                    <div class="pin-detail-type">${location.type || 'Luogo'} • ${levelNames[location.level] || 'Livello ?'}</div>
                </div>
            </div>
            ${descriptionHtml}
            ${tagsHtml}
            ${secretHtml}
        `;

        modal.classList.add('active');
        overlay.classList.add('active');
    },

    closePinModal() {
        this.container.querySelector('#pin-modal').classList.remove('active');
        this.container.querySelector('#pin-modal-overlay').classList.remove('active');
        this.selectedPinId = null;
    },

    removeSelectedPin() {
        if (!this.currentMapId || !this.selectedPinId) return;

        this.pins[this.currentMapId] = this.pins[this.currentMapId].filter(p => p.id !== this.selectedPinId);
        savePins(this.pins);
        this.renderPins();
        this.closePinModal();

        showToast('Pin rimosso', 'info');
    },

    goToLocation() {
        if (!this.currentMapId || !this.selectedPinId) return;

        const pin = this.pins[this.currentMapId].find(p => p.id === this.selectedPinId);
        if (!pin) return;

        // Dispatch event to open location manager
        const event = new CustomEvent('openModuleWithItem', {
            detail: { moduleId: 'locationManager', itemId: pin.locationId, section: 'location' }
        });
        document.dispatchEvent(event);
        this.closePinModal();
    },

    // ═══════════════════════════════════════════════════════════════
    // DRAG & DROP
    // ═══════════════════════════════════════════════════════════════

    startPinDrag(e, pin) {
        this.isDragging = true;
        this.dragTarget = { type: 'pin', data: pin };
        const pinEl = e.target.closest('.map-pin');
        pinEl.classList.add('dragging');
    },

    startPartyDrag(e) {
        this.isDragging = true;
        this.dragTarget = { type: 'party' };
        const token = e.target.closest('.party-token');
        token.classList.add('dragging');
    },

    // ═══════════════════════════════════════════════════════════════
    // CANVAS INTERACTIONS
    // ═══════════════════════════════════════════════════════════════

    handleCanvasMouseDown(e) {
        const canvasContainer = this.container.querySelector('#map-canvas-container');

        // Check if we're placing something
        if (canvasContainer.classList.contains('placing-pin') && this.placingPinLocationId) {
            const pos = this.getClickPosition(e);
            this.placePin(pos.x, pos.y, this.placingPinLocationId);
            return;
        }

        if (canvasContainer.classList.contains('placing-party')) {
            const pos = this.getClickPosition(e);
            this.placePartyToken(pos.x, pos.y);
            return;
        }

        // Check if clicking on a pin (already handled by pin event listener)
        if (e.target.closest('.map-pin') || e.target.closest('.party-token')) {
            return;
        }

        // Start panning
        this.isPanning = true;
        this.lastPanPoint = { x: e.clientX, y: e.clientY };
        canvasContainer.classList.add('grabbing');
    },

    handleCanvasMouseMove(e) {
        if (this.isPanning && this.lastPanPoint) {
            const dx = e.clientX - this.lastPanPoint.x;
            const dy = e.clientY - this.lastPanPoint.y;

            this.pan.x += dx;
            this.pan.y += dy;

            this.applyTransform();
            this.lastPanPoint = { x: e.clientX, y: e.clientY };
            return;
        }

        if (this.isDragging && this.dragTarget) {
            const pos = this.getClickPosition(e);

            if (this.dragTarget.type === 'pin') {
                // Update pin position
                const pin = this.pins[this.currentMapId].find(p => p.id === this.dragTarget.data.id);
                if (pin) {
                    pin.x = pos.x;
                    pin.y = pos.y;
                    this.renderPins();
                }
            } else if (this.dragTarget.type === 'party') {
                // Update party position
                this.partyPositions[this.currentMapId] = { x: pos.x, y: pos.y };
                this.renderPartyToken();
            }
        }
    },

    handleCanvasMouseUp(e) {
        const canvasContainer = this.container.querySelector('#map-canvas-container');

        // End panning
        if (this.isPanning) {
            this.isPanning = false;
            this.lastPanPoint = null;
            canvasContainer.classList.remove('grabbing');
        }

        // End dragging
        if (this.isDragging) {
            this.isDragging = false;

            if (this.dragTarget) {
                // Save changes
                if (this.dragTarget.type === 'pin') {
                    savePins(this.pins);
                } else if (this.dragTarget.type === 'party') {
                    savePartyPosition(this.currentMapId, this.partyPositions[this.currentMapId]);
                }

                // Remove dragging class
                const draggingEl = canvasContainer.querySelector('.dragging');
                if (draggingEl) draggingEl.classList.remove('dragging');
            }

            this.dragTarget = null;
        }
    },

    handleCanvasWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        this.adjustZoom(delta, e.clientX, e.clientY);
    },

    getClickPosition(e) {
        const wrapper = this.container.querySelector('#map-canvas-wrapper');
        const rect = wrapper.getBoundingClientRect();

        // Account for zoom and pan
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        return {
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y))
        };
    },

    // ═══════════════════════════════════════════════════════════════
    // ZOOM & PAN
    // ═══════════════════════════════════════════════════════════════

    adjustZoom(delta, pivotX, pivotY) {
        const oldZoom = this.zoom;
        this.zoom = Math.max(0.25, Math.min(4, this.zoom + delta));

        // Adjust pan to zoom toward cursor
        if (pivotX !== undefined && pivotY !== undefined) {
            const wrapper = this.container.querySelector('#map-canvas-wrapper');
            const rect = wrapper.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const zoomRatio = this.zoom / oldZoom;
            this.pan.x = pivotX - (pivotX - this.pan.x) * zoomRatio;
            this.pan.y = pivotY - (pivotY - this.pan.y) * zoomRatio;
        }

        this.applyTransform();
        this.updateZoomDisplay();
    },

    resetZoom() {
        this.zoom = 1;
        this.pan = { x: 0, y: 0 };
        this.applyTransform();
        this.updateZoomDisplay();
    },

    applyTransform() {
        const wrapper = this.container.querySelector('#map-canvas-wrapper');
        if (wrapper) {
            wrapper.style.transform = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.zoom})`;
        }
    },

    updateZoomDisplay() {
        const display = this.container.querySelector('#zoom-display');
        if (display) {
            display.textContent = `${Math.round(this.zoom * 100)}%`;
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // KEYBOARD SHORTCUTS
    // ═══════════════════════════════════════════════════════════════

    handleKeyDown(e) {
        // Only handle if this module is active and has content
        if (!this.container || !this.container.isConnected) return;
        if (!this.container.querySelector('#map-canvas-wrapper')) return;

        // Escape to cancel placing
        if (e.key === 'Escape') {
            const canvasContainer = this.container.querySelector('#map-canvas-container');
            canvasContainer.classList.remove('placing-pin', 'placing-party');
            this.placingPinLocationId = null;
            this.closeMapModal();
            this.closePinModal();
        }

        // Zoom shortcuts
        if (e.key === '+' || e.key === '=') {
            this.adjustZoom(0.25);
        }
        if (e.key === '-') {
            this.adjustZoom(-0.25);
        }
        if (e.key === '0') {
            this.resetZoom();
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════════════════════════════════

    destroy() {
        // Remove keyboard listener
        document.removeEventListener('keydown', this.handleKeyDown);
        console.log('🗺️ [MapManager] Modulo distrutto');
    }
};

export default MapManager;
