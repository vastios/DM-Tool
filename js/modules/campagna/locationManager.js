/**
 * locationManager.js
 * ─────────────────────────────────────────────────────────────
 * Modulo per la gestione dei Luoghi della campagna.
 * 
 * Layout: 2 Pannelli (Lista + Editor/Viewer)
 * 
 * Features:
 * - Tipi di luogo espansi (25 tipi in 6 categorie)
 * - Gerarchia luoghi (luogo padre selezionabile)
 * - Sistema tag con colori personalizzati
 * - URL immagine con preview
 * - Collegamenti NPC e Fazioni
 * - Toast notifications
 * 
 * @version 2.0.0 - Refactoring con nuovi miglioramenti
 */

import { getCurrentCampaignId } from '../../../stateManager.js';
import { showToast } from '../../../utils/toast.js';
import { escapeHtml } from '../../../utils/htmlHelpers.js';
import { linkifyCampaignReferences, getAllCampaignElements } from '../../../utils/campaignLinker.js';
import { initAutocomplete } from '../../../utils/autocomplete.js';

// ═══════════════════════════════════════════════════════════════
// COSTANTI E CONFIGURAZIONE
// ═══════════════════════════════════════════════════════════════

// Tipi di luogo espansi (25 tipi in 6 categorie)
const LOCATION_TYPES = [
    // Insediamenti
    { value: 'regno', label: 'Regno', category: 'Insediamenti' },
    { value: 'città', label: 'Città', category: 'Insediamenti' },
    { value: 'villaggio', label: 'Villaggio', category: 'Insediamenti' },
    { value: 'accampamento', label: 'Accampamento', category: 'Insediamenti' },
    { value: 'avamposto', label: 'Avamposto', category: 'Insediamenti' },
    // Luoghi di Interesse
    { value: 'dungeon', label: 'Dungeon', category: 'Luoghi di Interesse' },
    { value: 'rovine', label: 'Rovine', category: 'Luoghi di Interesse' },
    { value: 'tempio', label: 'Tempio', category: 'Luoghi di Interesse' },
    { value: 'torre', label: 'Torre', category: 'Luoghi di Interesse' },
    { value: 'nascondiglio', label: 'Nascondiglio', category: 'Luoghi di Interesse' },
    // Natura
    { value: 'foresta', label: 'Foresta', category: 'Natura' },
    { value: 'montagna', label: 'Montagna', category: 'Natura' },
    { value: 'deserto', label: 'Deserto', category: 'Natura' },
    { value: 'pianura', label: 'Pianura', category: 'Natura' },
    { value: 'palude', label: 'Palude', category: 'Natura' },
    // Acqua
    { value: 'mare', label: 'Mare', category: 'Acqua' },
    { value: 'lago', label: 'Lago', category: 'Acqua' },
    { value: 'fiume', label: 'Fiume', category: 'Acqua' },
    { value: 'porto', label: 'Porto', category: 'Acqua' },
    // Piani dimensionali
    { value: 'piano_materiale', label: 'Piano Materiale', category: 'Piani' },
    { value: 'piano_etereo', label: 'Piano Etereo', category: 'Piani' },
    { value: 'piano_ombre', label: 'Piano delle Ombre', category: 'Piani' },
    { value: 'piano_elementale', label: 'Piano Elementale', category: 'Piani' },
    // Altro
    { value: 'edificio', label: 'Edificio', category: 'Altro' },
    { value: 'altro', label: 'Altro', category: 'Altro' },
];

// Colori predefiniti per i tag
const PREDEFINED_TAG_COLORS = [
    '#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d', 
    '#16a34a', '#059669', '#0d9488', '#0891b2', '#0284c7',
    '#2563eb', '#4f46e5', '#7c3aed', '#9333ea', '#c026d3',
    '#db2777', '#e11d48', '#78716c', '#57534e', '#1f2937'
];

// Tag predefiniti per i luoghi
const DEFAULT_LOCATION_TAGS = [
    { id: 'visitato', name: 'Visitato', color: '#16a34a' },
    { id: 'segreto', name: 'Segreto', color: '#7c3aed' },
    { id: 'pericoloso', name: 'Pericoloso', color: '#dc2626' },
    { id: 'sicuro', name: 'Zona Sicura', color: '#059669' },
    { id: 'merce', name: 'Mercanzia', color: '#ca8a04' },
];

// ═══════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════

function getStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) {
        console.warn("⚠️ [LocationManager] Tentativo di accedere al localStorage senza una campagna selezionata.");
        return null;
    }
    return `dungeonMasterToolLocations_${campaignId}`;
}

function getTagsStorageKey() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return null;
    return `dungeonMasterToolLocationTags_${campaignId}`;
}

function saveLocations(locations) {
    const storageKey = getStorageKey();
    if (!storageKey) return;
    try {
        localStorage.setItem(storageKey, JSON.stringify(locations));
        console.log(`💾 [LocationManager] Luoghi salvati per la campagna ${getCurrentCampaignId()}.`);
    } catch (error) {
        console.error("❌ [LocationManager] Impossibile salvare i luoghi:", error);
    }
}

function loadLocations() {
    const storageKey = getStorageKey();
    if (!storageKey) return [];
    try {
        const savedLocationsJSON = localStorage.getItem(storageKey);
        return savedLocationsJSON ? JSON.parse(savedLocationsJSON) : [];
    } catch (error) {
        console.error("❌ [LocationManager] Impossibile caricare i luoghi:", error);
        return [];
    }
}

function saveTags(tags) {
    const storageKey = getTagsStorageKey();
    if (!storageKey) return;
    try {
        localStorage.setItem(storageKey, JSON.stringify(tags));
    } catch (error) {
        console.error("❌ [LocationManager] Impossibile salvare i tag:", error);
    }
}

function loadTags() {
    const storageKey = getTagsStorageKey();
    if (!storageKey) return [...DEFAULT_LOCATION_TAGS];
    try {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : [...DEFAULT_LOCATION_TAGS];
    } catch (error) {
        return [...DEFAULT_LOCATION_TAGS];
    }
}

// Carica NPC per i collegamenti
function loadNpcs() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return [];
    try {
        const data = localStorage.getItem(`dungeonMasterToolNpcs_${campaignId}`);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

// Carica Fazioni per i collegamenti
function loadFactions() {
    const campaignId = getCurrentCampaignId();
    if (!campaignId) return [];
    try {
        const data = localStorage.getItem(`dungeonMasterToolFactions_${campaignId}`);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

// ═══════════════════════════════════════════════════════════════
// MODULO PRINCIPALE
// ═══════════════════════════════════════════════════════════════

const LocationManager = {
    render(containerElement, itemIdToLoad = null) {
        this.container = containerElement;
        this.locations = loadLocations();
        this.tags = loadTags();
        this.npcs = loadNpcs();
        this.factions = loadFactions();
        this.currentEditingId = null;
        this.selectedTags = [];
        this.linkedNpcs = [];
        this.linkedFactions = [];
        
        this.container.innerHTML = this.getMainLayout();
        this.bindEvents();
        this.renderLocationsList();
        
        // Carica luogo specifico se richiesto
        if (itemIdToLoad) {
            const location = this.locations.find(l => l.id === itemIdToLoad);
            if (location) {
                this.currentEditingId = itemIdToLoad;
                this.renderLocationEditor(location);
            }
        } else if (this.locations.length > 0) {
            // Mostra il luogo più recente
            const recent = [...this.locations].sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0))[0];
            this.renderLocationViewer(recent);
        }
        
        console.log('📍 [LocationManager] Modulo inizializzato v2.0');
    },
    
    getMainLayout() {
        return `
<style>
${this.getStyles()}
</style>
<div class="location-manager-layout">
    <!-- Pannello di Sinistra: Lista dei Luoghi -->
    <div class="location-sidebar">
        <div class="location-sidebar-header">
            <h2>📍 Luoghi della Campagna</h2>
            <button class="location-new-btn" id="new-location-btn">+ Nuovo</button>
        </div>
        
        <div class="location-search-box">
            <input type="text" id="location-search" class="location-search-input" placeholder="Cerca un luogo...">
        </div>
        
        <div class="location-filter-tags" id="location-filter-tags">
            ${this.tags.map(tag => `
                <span class="location-filter-tag" data-tag-id="${tag.id}" style="border-color: ${tag.color}; color: ${tag.color}">
                    ${escapeHtml(tag.name)}
                </span>
            `).join('')}
        </div>
        
        <div class="location-list" id="saved-locations-list"></div>
    </div>

    <!-- Pannello di Destra: Visualizzatore/Editor del Luogo -->
    <div class="location-main" id="location-main">
        <div class="location-empty-state">
            <div class="location-empty-icon">📍</div>
            <p>Seleziona un luogo esistente o creane uno nuovo</p>
        </div>
    </div>
</div>
        `;
    },
    
    getStyles() {
        return `
/* Layout principale */
.location-manager-layout {
    display: flex;
    height: 100%;
    gap: 0;
    background: var(--bg-secondary, #1a1a1a);
    overflow: hidden;
}

/* Sidebar */
.location-sidebar {
    flex: 0 0 300px;
    background: var(--card-bg, #252525);
    border-right: 1px solid var(--border-color, #333);
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
}

.location-sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.location-sidebar-header h2 {
    margin: 0;
    font-family: 'Cinzel', serif;
    font-size: 1rem;
    color: var(--text-primary, #fff);
}

.location-new-btn {
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

.location-new-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(8, 145, 178, 0.3);
}

.location-search-box {
    margin-bottom: 0.5rem;
}

.location-search-input {
    width: 100%;
    padding: 0.5rem;
    background: var(--input-bg, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-family: 'Lora', serif;
    font-size: 0.85rem;
}

.location-filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin-bottom: 0.5rem;
}

.location-filter-tag {
    padding: 0.15rem 0.4rem;
    border: 1px solid;
    border-radius: 3px;
    font-size: 0.65rem;
    cursor: pointer;
    transition: all 0.2s;
    opacity: 0.7;
}

.location-filter-tag:hover,
.location-filter-tag.active {
    opacity: 1;
    background: currentColor;
    color: #fff !important;
}

.location-list {
    flex: 1;
    overflow-y: auto;
}

.location-list-item {
    background: var(--bg-tertiary, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 6px;
    padding: 0.6rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
}

.location-list-item:hover {
    background: var(--hover-bg, #3a3a3a);
    border-color: #0891b2;
}

.location-list-item.selected {
    border-color: #0891b2;
    background: rgba(8, 145, 178, 0.15);
}

.location-list-item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.3rem;
}

.location-list-item-name {
    font-family: 'Cinzel', serif;
    font-size: 0.95rem;
    color: var(--text-primary, #fff);
}

.location-list-item-type {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
    background: rgba(8, 145, 178, 0.2);
    border-radius: 3px;
    color: #0891b2;
}

.location-list-item-parent {
    font-size: 0.75rem;
    color: var(--text-muted, #888);
    margin-bottom: 0.2rem;
}

.location-list-item-desc {
    font-size: 0.75rem;
    color: var(--text-muted, #aaa);
    line-height: 1.3;
    margin-bottom: 0.3rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.location-list-item-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
    margin-bottom: 0.4rem;
}

.location-list-item-tag {
    font-size: 0.6rem;
    padding: 0.1rem 0.3rem;
    border-radius: 2px;
}

.location-list-item-actions {
    display: flex;
    gap: 0.3rem;
}

.location-list-item-actions button {
    flex: 1;
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
    border-radius: 3px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
}

/* Area principale */
.location-main {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    background: var(--bg-secondary, #1a1a1a);
}

.location-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-muted, #666);
}

.location-empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

/* Viewer */
.location-viewer {
    background: var(--card-bg, #252525);
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid var(--border-color, #333);
}

.location-viewer-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #0891b2;
}

.location-viewer-title {
    font-family: 'Cinzel Decorative', serif;
    font-size: 1.5rem;
    color: #0891b2;
    margin: 0;
}

.location-viewer-subtitle {
    font-size: 0.85rem;
    color: var(--text-muted, #888);
    margin-top: 0.25rem;
}

.location-viewer-actions {
    display: flex;
    gap: 0.5rem;
}

.location-viewer-image {
    width: 100%;
    max-height: 250px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 1rem;
}

.location-viewer-section {
    margin-bottom: 1rem;
}

.location-viewer-section h4 {
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    color: #0891b2;
    margin: 0 0 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.location-viewer-section p {
    margin: 0;
    color: var(--text-primary, #fff);
    line-height: 1.5;
}

.location-secret {
    background: rgba(124, 58, 237, 0.1);
    border-left: 3px solid #7c3aed;
    padding: 0.75rem;
    border-radius: 0 4px 4px 0;
}

.location-links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.5rem;
}

.location-link-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.6rem;
    background: var(--bg-tertiary, #333);
    border-radius: 4px;
    font-size: 0.85rem;
}

.location-link-item .role {
    font-size: 0.7rem;
    color: var(--text-muted, #888);
}

/* Editor */
.location-editor {
    background: var(--card-bg, #252525);
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid var(--border-color, #333);
}

.location-editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #0891b2;
}

.location-editor-title {
    font-family: 'Cinzel', serif;
    font-size: 1.2rem;
    color: var(--text-primary, #fff);
}

/* Tabs */
.location-editor-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--border-color, #444);
    padding-bottom: 0.5rem;
}

.location-tab {
    padding: 0.5rem 1rem;
    background: transparent;
    border: none;
    color: var(--text-muted, #888);
    font-family: 'Cinzel', serif;
    font-size: 0.85rem;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
}

.location-tab:hover {
    color: var(--text-primary, #fff);
}

.location-tab.active {
    color: #0891b2;
    border-bottom-color: #0891b2;
}

.location-tab-content {
    display: none;
}

.location-tab-content.active {
    display: block;
}

/* Form */
.location-form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.location-form-group {
    flex: 1;
    margin-bottom: 1rem;
}

.location-form-group label {
    display: block;
    font-size: 0.8rem;
    color: var(--text-muted, #888);
    margin-bottom: 0.25rem;
    text-transform: uppercase;
}

.location-form-group input,
.location-form-group select,
.location-form-group textarea {
    width: 100%;
    padding: 0.6rem;
    background: var(--input-bg, #333);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    color: var(--text-primary, #fff);
    font-family: 'Lora', serif;
    font-size: 0.9rem;
}

.location-form-group textarea {
    min-height: 100px;
    resize: vertical;
}

/* Image preview */
.location-image-preview {
    margin-top: 0.5rem;
    border-radius: 6px;
    overflow: hidden;
    max-height: 200px;
}

.location-image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Tags editor */
.location-tags-editor {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.location-tag-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
}

.location-tag-badge.selected {
    color: #fff;
}

.location-tag-badge:not(.selected) {
    background: transparent !important;
    border: 1px solid;
}

.location-tag-badge .remove {
    font-size: 0.7rem;
    opacity: 0.7;
}

.location-tag-badge .remove:hover {
    opacity: 1;
}

/* New tag form */
.location-new-tag-form {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.location-color-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    padding: 0.5rem;
    background: var(--bg-tertiary, #333);
    border-radius: 4px;
    margin-top: 0.5rem;
}

.location-color-option {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition: transform 0.2s;
}

.location-color-option:hover {
    transform: scale(1.1);
}

.location-color-option.selected {
    border-color: #fff;
}

/* Links editor */
.location-links-editor {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.location-link-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--bg-tertiary, #333);
    border-radius: 4px;
}

.location-link-row select {
    flex: 1;
    padding: 0.4rem;
    background: var(--input-bg, #444);
    border: 1px solid var(--border-color, #555);
    border-radius: 4px;
    color: var(--text-primary, #fff);
}

.location-link-row input {
    flex: 1;
    padding: 0.4rem;
    background: var(--input-bg, #444);
    border: 1px solid var(--border-color, #555);
    border-radius: 4px;
    color: var(--text-primary, #fff);
}

/* Buttons */
.location-btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-family: 'Cinzel', serif;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.location-btn-primary {
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    color: #fff;
}

.location-btn-secondary {
    background: var(--bg-tertiary, #333);
    border: 1px solid var(--border-color, #444);
    color: var(--text-primary, #fff);
}

.location-btn-danger {
    background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
    color: #fff;
}

.location-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.location-btn-sm {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
}

/* Status badge */
.location-status {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-size: 0.75rem;
}

.location-status.visited {
    background: rgba(22, 163, 74, 0.2);
    color: #16a34a;
}

.location-status.not-visited {
    background: rgba(107, 114, 128, 0.2);
    color: #6b7280;
}

/* Responsive */
@media (max-width: 768px) {
    .location-manager-layout {
        flex-direction: column;
    }
    
    .location-sidebar {
        flex: 0 0 auto;
        max-height: 250px;
    }
}
        `;
    },
    
    // ─────────────────────────────────────────────────────────────
    // RENDERING LISTA
    // ─────────────────────────────────────────────────────────────
    
    renderLocationsList(searchTerm = '', filterTagId = null) {
        const list = this.container.querySelector('#saved-locations-list');
        if (!list) return;
        
        let filtered = this.locations;
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(loc => 
                (loc.name || '').toLowerCase().includes(term) ||
                (loc.type || '').toLowerCase().includes(term) ||
                (loc.description || '').toLowerCase().includes(term)
            );
        }
        
        if (filterTagId) {
            filtered = filtered.filter(loc => 
                (loc.tags || []).includes(filterTagId)
            );
        }
        
        if (filtered.length === 0) {
            list.innerHTML = '<p class="location-empty">Nessun luogo trovato</p>';
            return;
        }
        
        const sorted = [...filtered].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        
        list.innerHTML = sorted.map(loc => {
            const parentLocation = loc.parentId ? this.locations.find(l => l.id === loc.parentId) : null;
            const tags = (loc.tags || []).map(tagId => this.tags.find(t => t.id === tagId)).filter(Boolean);
            const isSelected = loc.id === this.currentEditingId;
            
            return `
                <div class="location-list-item ${isSelected ? 'selected' : ''}" data-location-id="${loc.id}">
                    <div class="location-list-item-header">
                        <span class="location-list-item-name">${escapeHtml(loc.name || 'Senza Nome')}</span>
                        ${loc.type ? `<span class="location-list-item-type">${escapeHtml(this.getTypeLabel(loc.type))}</span>` : ''}
                    </div>
                    ${parentLocation ? `
                        <div class="location-list-item-parent">
                            📍 ${escapeHtml(parentLocation.name)}
                        </div>
                    ` : ''}
                    ${loc.description ? `
                        <div class="location-list-item-desc">${escapeHtml(loc.description.substring(0, 80))}${loc.description.length > 80 ? '...' : ''}</div>
                    ` : ''}
                    ${tags.length > 0 ? `
                        <div class="location-list-item-tags">
                            ${tags.map(tag => `
                                <span class="location-list-item-tag" style="background: ${tag.color}; color: #fff;">
                                    ${escapeHtml(tag.name)}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="location-list-item-actions">
                        <button class="location-btn location-btn-secondary location-btn-sm btn-view" data-location-id="${loc.id}">👁️ Vedi</button>
                        <button class="location-btn location-btn-secondary location-btn-sm btn-edit" data-location-id="${loc.id}">✏️ Modifica</button>
                        <button class="location-btn location-btn-danger location-btn-sm btn-delete" data-location-id="${loc.id}">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    getTypeLabel(typeValue) {
        const type = LOCATION_TYPES.find(t => t.value === typeValue);
        return type ? type.label : typeValue;
    },
    
    // ─────────────────────────────────────────────────────────────
    // VIEWER
    // ─────────────────────────────────────────────────────────────
    
    renderLocationViewer(location) {
        const main = this.container.querySelector('#location-main');
        if (!main) return;
        
        const parentLocation = location.parentId ? this.locations.find(l => l.id === location.parentId) : null;
        const tags = (location.tags || []).map(tagId => this.tags.find(t => t.id === tagId)).filter(Boolean);
        const linkedNpcs = (location.linkedNpcs || []).map(link => ({
            ...link,
            npc: this.npcs.find(n => n.id === link.npcId)
        })).filter(l => l.npc);
        const linkedFactions = (location.linkedFactions || []).map(link => ({
            ...link,
            faction: this.factions.find(f => f.id === link.factionId)
        })).filter(l => l.faction);
        
        const date = new Date(location.lastModified).toLocaleString('it-IT');
        
        main.innerHTML = `
            <div class="location-viewer">
                <div class="location-viewer-header">
                    <div>
                        <h3 class="location-viewer-title">${escapeHtml(location.name)}</h3>
                        <div class="location-viewer-subtitle">
                            ${location.type ? this.getTypeLabel(location.type) : ''}
                            ${parentLocation ? ` → 📍 ${escapeHtml(parentLocation.name)}` : ''}
                        </div>
                    </div>
                    <div class="location-viewer-actions">
                        <button class="location-btn location-btn-secondary btn-edit-viewer" data-location-id="${location.id}">✏️ Modifica</button>
                        <button class="location-btn location-btn-danger btn-delete-viewer" data-location-id="${location.id}">🗑️ Elimina</button>
                    </div>
                </div>
                
                ${location.imageUrl ? `
                    <img src="${escapeHtml(location.imageUrl)}" alt="${escapeHtml(location.name)}" class="location-viewer-image" onerror="this.style.display='none'">
                ` : ''}
                
                <div class="location-status ${location.isVisited ? 'visited' : 'not-visited'}">
                    ${location.isVisited ? '✅ Visitato' : '❓ Non ancora visitato'}
                </div>
                
                ${tags.length > 0 ? `
                    <div class="location-viewer-section">
                        <h4>🏷️ Tag</h4>
                        <div class="location-tags-editor">
                            ${tags.map(tag => `
                                <span class="location-tag-badge selected" style="background: ${tag.color};">
                                    ${escapeHtml(tag.name)}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${location.description ? `
                    <div class="location-viewer-section">
                        <h4>📝 Descrizione</h4>
                        <p>${linkifyCampaignReferences(escapeHtml(location.description)).replace(/\n/g, '<br>')}</p>
                    </div>
                ` : ''}
                
                ${location.inhabitants ? `
                    <div class="location-viewer-section">
                        <h4>👥 Abitanti</h4>
                        <p>${linkifyCampaignReferences(escapeHtml(location.inhabitants))}</p>
                    </div>
                ` : ''}
                
                ${location.pointsofinterest ? `
                    <div class="location-viewer-section">
                        <h4>🎯 Punti di Interesse</h4>
                        <p>${linkifyCampaignReferences(escapeHtml(location.pointsofinterest))}</p>
                    </div>
                ` : ''}
                
                ${linkedNpcs.length > 0 ? `
                    <div class="location-viewer-section">
                        <h4>👤 PNG Presenti</h4>
                        <div class="location-links-grid">
                            ${linkedNpcs.map(link => `
                                <div class="location-link-item campaign-link" data-link-type="npc" data-link-id="${link.npcId}">
                                    👤 ${escapeHtml(link.npc.name)}
                                    ${link.role ? `<span class="role">(${escapeHtml(link.role)})</span>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${linkedFactions.length > 0 ? `
                    <div class="location-viewer-section">
                        <h4>🚩 Fazioni</h4>
                        <div class="location-links-grid">
                            ${linkedFactions.map(link => `
                                <div class="location-link-item campaign-link" data-link-type="faction" data-link-id="${link.factionId}">
                                    🚩 ${escapeHtml(link.faction.name)}
                                    ${link.description ? `<span class="role">(${escapeHtml(link.description)})</span>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${location.secrets ? `
                    <div class="location-viewer-section">
                        <h4>🔒 Segreti del DM</h4>
                        <div class="location-secret">
                            <p>${linkifyCampaignReferences(escapeHtml(location.secrets)).replace(/\n/g, '<br>')}</p>
                        </div>
                    </div>
                ` : ''}
                
                <small style="color: var(--text-muted, #888); display: block; margin-top: 1rem;">
                    Ultima modifica: ${date}
                </small>
            </div>
        `;
        
        this.currentEditingId = location.id;
        this.renderLocationsList();
    },
    
    // ─────────────────────────────────────────────────────────────
    // EDITOR
    // ─────────────────────────────────────────────────────────────
    
    renderLocationEditor(location = null) {
        const main = this.container.querySelector('#location-main');
        if (!main) return;
        
        const isNew = !location;
        
        // Reset state
        this.selectedTags = location ? [...(location.tags || [])] : [];
        this.linkedNpcs = location ? [...(location.linkedNpcs || [])] : [];
        this.linkedFactions = location ? [...(location.linkedFactions || [])] : [];
        
        const availableParents = this.locations.filter(l => !location || l.id !== location.id);
        
        main.innerHTML = `
            <div class="location-editor">
                <div class="location-editor-header">
                    <h3 class="location-editor-title">${isNew ? '➕ Nuovo Luogo' : '✏️ Modifica Luogo'}</h3>
                </div>
                
                <div class="location-editor-tabs">
                    <button class="location-tab active" data-tab="basic">Base</button>
                    <button class="location-tab" data-tab="details">Dettagli</button>
                    <button class="location-tab" data-tab="links">Collegamenti</button>
                    <button class="location-tab" data-tab="tags">Tag</button>
                </div>
                
                <!-- TAB BASE -->
                <div class="location-tab-content active" id="tab-basic">
                    <div class="location-form-group">
                        <label for="loc-name">Nome *</label>
                        <input type="text" id="loc-name" value="${escapeHtml(location?.name || '')}" placeholder="Nome del luogo">
                    </div>
                    
                    <div class="location-form-row">
                        <div class="location-form-group">
                            <label for="loc-type">Tipo</label>
                            <select id="loc-type">
                                <option value="">Seleziona tipo...</option>
                                ${this.renderTypeOptions(location?.type)}
                            </select>
                        </div>
                        
                        <div class="location-form-group">
                            <label for="loc-parent">Luogo Padre</label>
                            <select id="loc-parent">
                                <option value="">Nessun padre</option>
                                ${availableParents.map(loc => `
                                    <option value="${loc.id}" ${location?.parentId === loc.id ? 'selected' : ''}>
                                        ${escapeHtml(loc.name)} ${loc.type ? `(${this.getTypeLabel(loc.type)})` : ''}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="location-form-group">
                        <label for="loc-description">Descrizione</label>
                        <textarea id="loc-description" rows="5" placeholder="Descrivi il luogo...">${escapeHtml(location?.description || '')}</textarea>
                    </div>
                </div>
                
                <!-- TAB DETTAGLI -->
                <div class="location-tab-content" id="tab-details">
                    <div class="location-form-group">
                        <label for="loc-image">🖼️ URL Immagine</label>
                        <input type="url" id="loc-image" value="${escapeHtml(location?.imageUrl || '')}" placeholder="https://esempio.com/immagine.jpg">
                        ${location?.imageUrl ? `
                            <div class="location-image-preview">
                                <img src="${escapeHtml(location.imageUrl)}" alt="Preview" onerror="this.parentElement.style.display='none'">
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="location-form-group">
                        <label for="loc-inhabitants">👥 Abitanti</label>
                        <input type="text" id="loc-inhabitants" value="${escapeHtml(location?.inhabitants || '')}" placeholder="Chi vive qui?">
                    </div>
                    
                    <div class="location-form-group">
                        <label for="loc-poi">🎯 Punti di Interesse</label>
                        <input type="text" id="loc-poi" value="${escapeHtml(location?.pointsofinterest || '')}" placeholder="Luoghi notevoli...">
                    </div>
                    
                    <div class="location-form-group">
                        <label for="loc-secrets">🔒 Segreti del DM</label>
                        <textarea id="loc-secrets" rows="4" placeholder="Informazioni nascoste...">${escapeHtml(location?.secrets || '')}</textarea>
                    </div>
                    
                    <div class="location-form-group">
                        <label>
                            <input type="checkbox" id="loc-visited" ${location?.isVisited ? 'checked' : ''}>
                            Già visitato dal party
                        </label>
                    </div>
                </div>
                
                <!-- TAB COLLEGAMENTI -->
                <div class="location-tab-content" id="tab-links">
                    <div class="location-form-group">
                        <label>👤 PNG Collegati</label>
                        <div class="location-links-editor" id="npc-links-editor">
                            ${this.linkedNpcs.map((link, idx) => `
                                <div class="location-link-row" data-link-idx="${idx}">
                                    <select class="npc-select">
                                        ${this.npcs.map(npc => `
                                            <option value="${npc.id}" ${link.npcId === npc.id ? 'selected' : ''}>
                                                ${escapeHtml(npc.name)}
                                            </option>
                                        `).join('')}
                                    </select>
                                    <input type="text" class="npc-role" placeholder="Ruolo" value="${escapeHtml(link.role || '')}">
                                    <button class="location-btn location-btn-danger location-btn-sm btn-remove-npc">✕</button>
                                </div>
                            `).join('')}
                        </div>
                        <button class="location-btn location-btn-secondary location-btn-sm" id="add-npc-link">+ Aggiungi PNG</button>
                    </div>
                    
                    <div class="location-form-group">
                        <label>🚩 Fazioni Collegati</label>
                        <div class="location-links-editor" id="faction-links-editor">
                            ${this.linkedFactions.map((link, idx) => `
                                <div class="location-link-row" data-link-idx="${idx}">
                                    <select class="faction-select">
                                        ${this.factions.map(faction => `
                                            <option value="${faction.id}" ${link.factionId === faction.id ? 'selected' : ''}>
                                                ${escapeHtml(faction.name)}
                                            </option>
                                        `).join('')}
                                    </select>
                                    <input type="text" class="faction-desc" placeholder="Descrizione (es: QG)" value="${escapeHtml(link.description || '')}">
                                    <button class="location-btn location-btn-danger location-btn-sm btn-remove-faction">✕</button>
                                </div>
                            `).join('')}
                        </div>
                        <button class="location-btn location-btn-secondary location-btn-sm" id="add-faction-link">+ Aggiungi Fazione</button>
                    </div>
                </div>
                
                <!-- TAB TAG -->
                <div class="location-tab-content" id="tab-tags">
                    <div class="location-form-group">
                        <label>🏷️ Tag Esistenti</label>
                        <div class="location-tags-editor" id="tags-editor">
                            ${this.tags.map(tag => `
                                <span class="location-tag-badge ${this.selectedTags.includes(tag.id) ? 'selected' : ''}" 
                                      data-tag-id="${tag.id}"
                                      style="background: ${this.selectedTags.includes(tag.id) ? tag.color : 'transparent'}; border-color: ${tag.color}; color: ${this.selectedTags.includes(tag.id) ? '#fff' : tag.color};">
                                    ${escapeHtml(tag.name)}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="location-form-group">
                        <label>➕ Nuovo Tag</label>
                        <div class="location-new-tag-form">
                            <input type="text" id="new-tag-name" placeholder="Nome tag">
                            <input type="color" id="new-tag-color" value="#0891b2" style="width: 40px; height: 36px; padding: 2px; cursor: pointer;">
                            <button class="location-btn location-btn-primary" id="create-tag-btn">Crea</button>
                        </div>
                        <div class="location-color-picker" id="color-picker">
                            ${PREDEFINED_TAG_COLORS.map(color => `
                                <div class="location-color-option" style="background: ${color};" data-color="${color}"></div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem; justify-content: flex-end;">
                    <button class="location-btn location-btn-secondary" id="cancel-edit-btn">Annulla</button>
                    <button class="location-btn location-btn-primary" id="save-location-btn">${isNew ? 'Crea Luogo' : 'Salva Modifiche'}</button>
                </div>
            </div>
        `;
        
        this.bindEditorEvents();
    },
    
    renderTypeOptions(selectedType) {
        const categories = [...new Set(LOCATION_TYPES.map(t => t.category))];
        return categories.map(cat => `
            <optgroup label="${cat}">
                ${LOCATION_TYPES.filter(t => t.category === cat).map(t => `
                    <option value="${t.value}" ${selectedType === t.value ? 'selected' : ''}>
                        ${t.label}
                    </option>
                `).join('')}
            </optgroup>
        `).join('');
    },
    
    // ─────────────────────────────────────────────────────────────
    // EVENT BINDING
    // ─────────────────────────────────────────────────────────────
    
    bindEvents() {
        // New location button
        this.container.querySelector('#new-location-btn')?.addEventListener('click', () => {
            this.currentEditingId = null;
            this.renderLocationEditor();
        });
        
        // Search
        this.container.querySelector('#location-search')?.addEventListener('input', (e) => {
            this.renderLocationsList(e.target.value);
        });
        
        // Filter tags
        this.container.querySelector('#location-filter-tags')?.addEventListener('click', (e) => {
            const tag = e.target.closest('.location-filter-tag');
            if (!tag) return;
            
            document.querySelectorAll('.location-filter-tag').forEach(t => t.classList.remove('active'));
            tag.classList.toggle('active');
            
            const tagId = tag.classList.contains('active') ? tag.dataset.tagId : null;
            const searchTerm = this.container.querySelector('#location-search')?.value || '';
            this.renderLocationsList(searchTerm, tagId);
        });
        
        // List actions
        this.container.querySelector('#saved-locations-list')?.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            const item = e.target.closest('.location-list-item');
            if (!item) return;
            
            const locationId = item.dataset.locationId;
            const location = this.locations.find(l => l.id === locationId);
            
            if (btn?.classList.contains('btn-view') || (!btn && item)) {
                this.renderLocationViewer(location);
            } else if (btn?.classList.contains('btn-edit')) {
                this.currentEditingId = locationId;
                this.renderLocationEditor(location);
            } else if (btn?.classList.contains('btn-delete')) {
                this.deleteLocation(locationId);
            }
        });
        
        // Main area actions
        this.container.querySelector('#location-main')?.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            
            if (btn.classList.contains('btn-edit-viewer')) {
                const location = this.locations.find(l => l.id === btn.dataset.locationId);
                if (location) {
                    this.currentEditingId = location.id;
                    this.renderLocationEditor(location);
                }
            } else if (btn.classList.contains('btn-delete-viewer')) {
                this.deleteLocation(btn.dataset.locationId);
            }
        });
    },
    
    bindEditorEvents() {
        // Tabs
        this.container.querySelectorAll('.location-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.container.querySelectorAll('.location-tab').forEach(t => t.classList.remove('active'));
                this.container.querySelectorAll('.location-tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                this.container.querySelector(`#tab-${tab.dataset.tab}`)?.classList.add('active');
            });
        });
        
        // Tags selection
        this.container.querySelector('#tags-editor')?.addEventListener('click', (e) => {
            const badge = e.target.closest('.location-tag-badge');
            if (!badge) return;
            
            const tagId = badge.dataset.tagId;
            if (this.selectedTags.includes(tagId)) {
                this.selectedTags = this.selectedTags.filter(id => id !== tagId);
            } else {
                this.selectedTags.push(tagId);
            }
            
            // Update visual
            const tag = this.tags.find(t => t.id === tagId);
            if (tag) {
                badge.classList.toggle('selected');
                badge.style.background = this.selectedTags.includes(tagId) ? tag.color : 'transparent';
                badge.style.color = this.selectedTags.includes(tagId) ? '#fff' : tag.color;
            }
        });
        
        // Color picker
        this.container.querySelector('#color-picker')?.addEventListener('click', (e) => {
            const option = e.target.closest('.location-color-option');
            if (!option) return;
            
            const color = option.dataset.color;
            const colorInput = this.container.querySelector('#new-tag-color');
            if (colorInput) colorInput.value = color;
            
            this.container.querySelectorAll('.location-color-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
        });
        
        // Create tag
        this.container.querySelector('#create-tag-btn')?.addEventListener('click', () => {
            const nameInput = this.container.querySelector('#new-tag-name');
            const colorInput = this.container.querySelector('#new-tag-color');
            
            const name = nameInput?.value.trim();
            const color = colorInput?.value || '#0891b2';
            
            if (!name) {
                showToast('Inserisci un nome per il tag', 'error');
                return;
            }
            
            // Check if tag already exists
            if (this.tags.some(t => t.name.toLowerCase() === name.toLowerCase())) {
                showToast('Tag già esistente', 'warning');
                return;
            }
            
            const newTag = {
                id: Date.now().toString(),
                name,
                color
            };
            
            this.tags.push(newTag);
            saveTags(this.tags);
            this.selectedTags.push(newTag.id);
            
            // Re-render tags section
            this.renderLocationEditor(this.locations.find(l => l.id === this.currentEditingId));
            showToast(`Tag "${name}" creato`, 'success');
        });
        
        // Add NPC link
        this.container.querySelector('#add-npc-link')?.addEventListener('click', () => {
            if (this.npcs.length === 0) {
                showToast('Nessun PNG disponibile', 'warning');
                return;
            }
            this.linkedNpcs.push({ npcId: this.npcs[0].id, role: '' });
            this.renderLinksEditor();
        });
        
        // Add Faction link
        this.container.querySelector('#add-faction-link')?.addEventListener('click', () => {
            if (this.factions.length === 0) {
                showToast('Nessuna fazione disponibile', 'warning');
                return;
            }
            this.linkedFactions.push({ factionId: this.factions[0].id, description: '' });
            this.renderLinksEditor();
        });
        
        // Remove NPC/Faction links
        this.container.querySelector('#npc-links-editor')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-remove-npc')) {
                const row = e.target.closest('.location-link-row');
                const idx = parseInt(row?.dataset.linkIdx);
                if (!isNaN(idx)) {
                    this.linkedNpcs.splice(idx, 1);
                    this.renderLinksEditor();
                }
            }
        });
        
        this.container.querySelector('#faction-links-editor')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-remove-faction')) {
                const row = e.target.closest('.location-link-row');
                const idx = parseInt(row?.dataset.linkIdx);
                if (!isNaN(idx)) {
                    this.linkedFactions.splice(idx, 1);
                    this.renderLinksEditor();
                }
            }
        });
        
        // Cancel
        this.container.querySelector('#cancel-edit-btn')?.addEventListener('click', () => {
            if (this.currentEditingId) {
                const location = this.locations.find(l => l.id === this.currentEditingId);
                if (location) {
                    this.renderLocationViewer(location);
                    return;
                }
            }
            this.currentEditingId = null;
            this.container.querySelector('#location-main').innerHTML = `
                <div class="location-empty-state">
                    <div class="location-empty-icon">📍</div>
                    <p>Seleziona un luogo esistente o creane uno nuovo</p>
                </div>
            `;
        });
        
        // Save
        this.container.querySelector('#save-location-btn')?.addEventListener('click', () => {
            this.saveLocation();
        });
        
        // Image preview
        this.container.querySelector('#loc-image')?.addEventListener('input', (e) => {
            const url = e.target.value;
            let preview = this.container.querySelector('.location-image-preview');
            
            if (url) {
                if (!preview) {
                    preview = document.createElement('div');
                    preview.className = 'location-image-preview';
                    e.target.parentElement.appendChild(preview);
                }
                preview.innerHTML = `<img src="${escapeHtml(url)}" alt="Preview" onerror="this.parentElement.style.display='none'">`;
            } else if (preview) {
                preview.remove();
            }
        });
        
        // Update linked NPCs/Factions when changing selects
        this.container.querySelector('#npc-links-editor')?.addEventListener('change', (e) => {
            if (e.target.classList.contains('npc-select') || e.target.classList.contains('npc-role')) {
                this.updateLinkedNpcsFromUI();
            }
        });
        
        this.container.querySelector('#faction-links-editor')?.addEventListener('change', (e) => {
            if (e.target.classList.contains('faction-select') || e.target.classList.contains('faction-desc')) {
                this.updateLinkedFactionsFromUI();
            }
        });
    },
    
    renderLinksEditor() {
        const npcEditor = this.container.querySelector('#npc-links-editor');
        const factionEditor = this.container.querySelector('#faction-links-editor');
        
        if (npcEditor) {
            npcEditor.innerHTML = this.linkedNpcs.map((link, idx) => `
                <div class="location-link-row" data-link-idx="${idx}">
                    <select class="npc-select">
                        ${this.npcs.map(npc => `
                            <option value="${npc.id}" ${link.npcId === npc.id ? 'selected' : ''}>
                                ${escapeHtml(npc.name)}
                            </option>
                        `).join('')}
                    </select>
                    <input type="text" class="npc-role" placeholder="Ruolo" value="${escapeHtml(link.role || '')}">
                    <button class="location-btn location-btn-danger location-btn-sm btn-remove-npc">✕</button>
                </div>
            `).join('');
        }
        
        if (factionEditor) {
            factionEditor.innerHTML = this.linkedFactions.map((link, idx) => `
                <div class="location-link-row" data-link-idx="${idx}">
                    <select class="faction-select">
                        ${this.factions.map(faction => `
                            <option value="${faction.id}" ${link.factionId === faction.id ? 'selected' : ''}>
                                ${escapeHtml(faction.name)}
                            </option>
                        `).join('')}
                    </select>
                    <input type="text" class="faction-desc" placeholder="Descrizione (es: QG)" value="${escapeHtml(link.description || '')}">
                    <button class="location-btn location-btn-danger location-btn-sm btn-remove-faction">✕</button>
                </div>
            `).join('');
        }
    },
    
    updateLinkedNpcsFromUI() {
        const rows = this.container.querySelectorAll('#npc-links-editor .location-link-row');
        this.linkedNpcs = Array.from(rows).map(row => ({
            npcId: row.querySelector('.npc-select')?.value,
            role: row.querySelector('.npc-role')?.value || ''
        })).filter(link => link.npcId);
    },
    
    updateLinkedFactionsFromUI() {
        const rows = this.container.querySelectorAll('#faction-links-editor .location-link-row');
        this.linkedFactions = Array.from(rows).map(row => ({
            factionId: row.querySelector('.faction-select')?.value,
            description: row.querySelector('.faction-desc')?.value || ''
        })).filter(link => link.factionId);
    },
    
    saveLocation() {
        const name = this.container.querySelector('#loc-name')?.value.trim();
        const type = this.container.querySelector('#loc-type')?.value;
        const parentId = this.container.querySelector('#loc-parent')?.value || null;
        const description = this.container.querySelector('#loc-description')?.value.trim();
        const imageUrl = this.container.querySelector('#loc-image')?.value.trim();
        const inhabitants = this.container.querySelector('#loc-inhabitants')?.value.trim();
        const poi = this.container.querySelector('#loc-poi')?.value.trim();
        const secrets = this.container.querySelector('#loc-secrets')?.value.trim();
        const isVisited = this.container.querySelector('#loc-visited')?.checked || false;
        
        if (!name) {
            showToast('Il nome del luogo è obbligatorio', 'error');
            return;
        }
        
        // Update linked from UI
        this.updateLinkedNpcsFromUI();
        this.updateLinkedFactionsFromUI();
        
        const now = Date.now();
        const locationData = {
            name,
            type,
            parentId,
            description,
            imageUrl,
            inhabitants,
            pointsofinterest: poi,
            secrets,
            isVisited,
            tags: [...this.selectedTags],
            linkedNpcs: [...this.linkedNpcs],
            linkedFactions: [...this.linkedFactions],
            lastModified: now,
        };
        
        if (this.currentEditingId) {
            const idx = this.locations.findIndex(l => l.id === this.currentEditingId);
            if (idx >= 0) {
                this.locations[idx] = { ...this.locations[idx], ...locationData };
                showToast(`Luogo "${name}" aggiornato`, 'success');
            }
        } else {
            const newLocation = {
                id: now.toString(),
                ...locationData
            };
            this.locations.push(newLocation);
            this.currentEditingId = newLocation.id;
            showToast(`Luogo "${name}" creato`, 'success');
        }
        
        saveLocations(this.locations);
        this.renderLocationsList();
        
        const savedLocation = this.locations.find(l => l.id === this.currentEditingId);
        if (savedLocation) {
            this.renderLocationViewer(savedLocation);
        }
    },
    
    deleteLocation(locationId) {
        const location = this.locations.find(l => l.id === locationId);
        if (!location) return;
        
        if (!confirm(`Sei sicuro di voler eliminare "${location.name}"?`)) return;
        
        this.locations = this.locations.filter(l => l.id !== locationId);
        
        // Update children to have no parent
        this.locations.forEach(loc => {
            if (loc.parentId === locationId) {
                loc.parentId = null;
            }
        });
        
        saveLocations(this.locations);
        
        if (this.currentEditingId === locationId) {
            this.currentEditingId = null;
        }
        
        this.renderLocationsList();
        
        this.container.querySelector('#location-main').innerHTML = `
            <div class="location-empty-state">
                <div class="location-empty-icon">📍</div>
                <p>Luogo eliminato</p>
            </div>
        `;
        
        showToast(`Luogo "${location.name}" eliminato`, 'warning');
    }
};

export default LocationManager;
