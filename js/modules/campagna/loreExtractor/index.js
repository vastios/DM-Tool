// index.js
// ─────────────────────────────────────────────────────────────
// Lore Extractor - Modulo principale con UI.
// Editor testo libero + estrazione su bottone + anteprima + integrazione.

import { parseLore } from './parser.js';
import {
    integrateNpcs, integrateFactions, integrateLocations,
    integrateItems, integrateEvents
} from './integrators.js';
import { showToast } from '../../../../utils/toast.js';
import { getCurrentCampaignId } from '../../../../stateManager.js';

// --- STORAGE PER LE NOTE ---

function getNotesStorageKey() {
    const campaignId = getCurrentCampaignId();
    return campaignId ? `dungeonMasterToolLoreNotes_${campaignId}` : null;
}

function saveNote(text) {
    const key = getNotesStorageKey();
    if (!key) return false;
    try {
        localStorage.setItem(key, JSON.stringify({
            text,
            lastModified: Date.now()
        }));
        return true;
    } catch (e) {
        console.error('Errore salvataggio nota:', e);
        return false;
    }
}

function loadNote() {
    const key = getNotesStorageKey();
    if (!key) return '';
    try {
        const data = localStorage.getItem(key);
        if (!data) return '';
        const parsed = JSON.parse(data);
        return parsed.text || '';
    } catch (e) {
        return '';
    }
}

// --- MODULO ---

const LoreExtractor = {
    lastExtraction: null,
    
    render(containerElement) {
        this.container = containerElement;
        const savedNote = loadNote();
        
        containerElement.innerHTML = `
<div class="lore-extractor-container">
    <!-- Header -->
    <div class="lore-header">
        <div class="lore-header-left">
            <h2>📜 Lore Extractor</h2>
            <p class="lore-subtitle">Scrivi liberamente la tua storia e lascia che il tool estragga PNG, fazioni, luoghi, oggetti ed eventi</p>
        </div>
        <div class="lore-header-right">
            <button id="lore-save-note-btn" class="lore-btn lore-btn-secondary" title="Salva nota">
                💾 Salva
            </button>
            <button id="lore-extract-btn" class="lore-btn lore-btn-primary" title="Estrai entità dal testo">
                🪄 Estrai dati
            </button>
            <button id="lore-clear-btn" class="lore-btn lore-btn-danger" title="Cancella testo">
                🗑️ Pulisci
            </button>
        </div>
    </div>
    
    <!-- Layout principale: editor + pannello estrazione -->
    <div class="lore-main-layout">
        <!-- Editor testo -->
        <div class="lore-editor-panel">
            <div class="lore-editor-header">
                <h3>📝 Testo libero</h3>
                <span id="lore-word-count" class="lore-word-count">0 parole</span>
            </div>
            <textarea id="lore-text-input" class="lore-text-input" placeholder="Es: Il capo dei goblin Grishnak guida la tribù Fango Nero. Vive nella caverna di Pietra Nera insieme al suo luogotenente, l'orco Grom. Il regno è governato dal re Aldric dal Castello Veliero. Durante la battaglia delle Acque Rosse, l'esercito del regno fu distrutto da un'antica spada chiamata Distruttrice...">${savedNote}</textarea>
        </div>
        
        <!-- Pannello estrazione -->
        <div class="lore-extraction-panel">
            <div class="lore-extraction-header">
                <h3>🔍 Entità estratte</h3>
                <span id="lore-extraction-stats" class="lore-extraction-stats">Nessuna estrazione</span>
            </div>
            
            <!-- Tab categorie -->
            <div class="lore-category-tabs" id="lore-category-tabs">
                <button class="lore-tab-btn active" data-category="npcs">🧙 PNG <span class="lore-tab-badge" data-badge="npcs">0</span></button>
                <button class="lore-tab-btn" data-category="factions">🏛️ Fazioni <span class="lore-tab-badge" data-badge="factions">0</span></button>
                <button class="lore-tab-btn" data-category="locations">📍 Luoghi <span class="lore-tab-badge" data-badge="locations">0</span></button>
                <button class="lore-tab-btn" data-category="items">⚔️ Oggetti <span class="lore-tab-badge" data-badge="items">0</span></button>
                <button class="lore-tab-btn" data-category="events">⚡ Eventi <span class="lore-tab-badge" data-badge="events">0</span></button>
            </div>
            
            <!-- Lista entità -->
            <div class="lore-entities-list" id="lore-entities-list">
                <div class="lore-empty-state">
                    <div class="lore-empty-icon">🪄</div>
                    <p>Clicca <strong>"Estrai dati"</strong> per analizzare il testo</p>
                    <p class="lore-empty-hint">Le entità trovate appariranno qui, pronte per essere importate nei moduli della campagna</p>
                </div>
            </div>
            
            <!-- Azioni globali -->
            <div class="lore-extraction-actions" id="lore-extraction-actions" style="display: none;">
                <button id="lore-select-all-btn" class="lore-btn lore-btn-small">☑️ Seleziona tutti</button>
                <button id="lore-deselect-all-btn" class="lore-btn lore-btn-small">🔲 Deseleziona tutti</button>
                <button id="lore-import-btn" class="lore-btn lore-btn-primary">📥 Importa selezionati</button>
            </div>
        </div>
    </div>
</div>
        `;
        
        this.bindEvents();
        this.updateWordCount();
    },
    
    bindEvents() {
        const container = this.container;
        
        // Editor - update word count + auto-save (debounced)
        const textInput = container.querySelector('#lore-text-input');
        textInput?.addEventListener('input', () => {
            this.updateWordCount();
            // Auto-save debounce 2s
            clearTimeout(this._autoSaveTimer);
            this._autoSaveTimer = setTimeout(() => {
                saveNote(textInput.value);
            }, 2000);
        });
        
        // Salva nota
        container.querySelector('#lore-save-note-btn')?.addEventListener('click', () => {
            const text = textInput.value;
            if (saveNote(text)) {
                showToast('Nota salvata', 'success');
            } else {
                showToast('Errore salvataggio nota', 'error');
            }
        });
        
        // Estrai dati
        container.querySelector('#lore-extract-btn')?.addEventListener('click', () => {
            this.handleExtract();
        });
        
        // Pulisci
        container.querySelector('#lore-clear-btn')?.addEventListener('click', () => {
            if (confirm('Cancellare tutto il testo? Le entità già importate non verranno rimosse.')) {
                textInput.value = '';
                this.updateWordCount();
                saveNote('');
                this.lastExtraction = null;
                this.renderEntities();
                showToast('Testo cancellato', 'info');
            }
        });
        
        // Tab switch
        container.querySelectorAll('.lore-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.lore-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.category;
                this.renderEntities();
            });
        });
        
        // Azioni globali
        container.querySelector('#lore-select-all-btn')?.addEventListener('click', () => {
            this.selectAll(true);
        });
        container.querySelector('#lore-deselect-all-btn')?.addEventListener('click', () => {
            this.selectAll(false);
        });
        container.querySelector('#lore-import-btn')?.addEventListener('click', () => {
            this.handleImport();
        });
        
        // Delegazione: click su checkbox e bottoni "importa singolo"
        container.querySelector('#lore-entities-list')?.addEventListener('click', (e) => {
            // Importa singolo
            if (e.target.classList.contains('lore-import-single-btn')) {
                this.handleImportSingle(e.target.dataset.category, parseInt(e.target.dataset.index, 10));
            }
        });
    },
    
    updateWordCount() {
        const textInput = this.container.querySelector('#lore-text-input');
        const wordCount = this.container.querySelector('#lore-word-count');
        if (!textInput || !wordCount) return;
        const words = textInput.value.trim() ? textInput.value.trim().split(/\s+/).length : 0;
        wordCount.textContent = `${words} parol${words === 1 ? 'a' : 'e'}`;
    },
    
    handleExtract() {
        const textInput = this.container.querySelector('#lore-text-input');
        if (!textInput || !textInput.value.trim()) {
            showToast('Inserisci del testo da analizzare', 'warning');
            return;
        }
        
        showToast('🔍 Analisi testo in corso...', 'info');
        
        // Parsing (sincrono, veloce)
        const result = parseLore(textInput.value);
        this.lastExtraction = result;
        
        // Aggiorna UI
        this.updateExtractionStats(result.stats);
        this.updateTabBadges(result);
        this.currentCategory = 'npcs';
        this.container.querySelectorAll('.lore-tab-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.category === 'npcs');
        });
        this.renderEntities();
        
        // Mostra azioni globali
        this.container.querySelector('#lore-extraction-actions').style.display = 'flex';
        
        // Salva nota
        saveNote(textInput.value);
        
        const msg = `${result.stats.totalEntities} entità trovate (${result.stats.parseTime}ms): ${result.npcs.length} PNG, ${result.factions.length} fazioni, ${result.locations.length} luoghi, ${result.items.length} oggetti, ${result.events.length} eventi`;
        showToast(msg, 'success', 5000);
    },
    
    updateExtractionStats(stats) {
        const el = this.container.querySelector('#lore-extraction-stats');
        if (!el) return;
        if (stats.totalEntities === 0) {
            el.textContent = 'Nessuna entità trovata';
            el.classList.remove('has-results');
        } else {
            el.textContent = `${stats.totalEntities} entità • ${stats.parseTime}ms`;
            el.classList.add('has-results');
        }
    },
    
    updateTabBadges(result) {
        const badges = this.container.querySelectorAll('.lore-tab-badge');
        badges.forEach(badge => {
            const category = badge.dataset.badge;
            const count = result[category]?.length || 0;
            badge.textContent = count;
            badge.classList.toggle('has-items', count > 0);
        });
    },
    
    renderEntities() {
        const list = this.container.querySelector('#lore-entities-list');
        if (!list) return;
        
        if (!this.lastExtraction || this.lastExtraction.stats.totalEntities === 0) {
            list.innerHTML = `
                <div class="lore-empty-state">
                    <div class="lore-empty-icon">🪄</div>
                    <p>Clicca <strong>"Estrai dati"</strong> per analizzare il testo</p>
                    <p class="lore-empty-hint">Le entità trovate appariranno qui, pronte per essere importate nei moduli della campagna</p>
                </div>
            `;
            return;
        }
        
        const category = this.currentCategory || 'npcs';
        const entities = this.lastExtraction[category] || [];
        
        if (entities.length === 0) {
            list.innerHTML = `
                <div class="lore-empty-state">
                    <div class="lore-empty-icon">📭</div>
                    <p>Nessuna entità di tipo "${category}" trovata</p>
                </div>
            `;
            return;
        }
        
        list.innerHTML = entities.map((entity, idx) => this.renderEntityCard(entity, category, idx)).join('');
    },
    
    renderEntityCard(entity, category, idx) {
        const typeLabels = {
            npcs: '🧙 PNG',
            factions: '🏛️ Fazione',
            locations: '📍 Luogo',
            items: '⚔️ Oggetto',
            events: '⚡ Evento'
        };
        
        let detailsHtml = '';
        if (category === 'npcs') {
            const parts = [];
            if (entity.role) parts.push(`<span class="lore-detail">💼 ${entity.role}</span>`);
            if (entity.race) parts.push(`<span class="lore-detail">🧬 ${entity.race}</span>`);
            if (entity.faction) parts.push(`<span class="lore-detail">🏛️ ${entity.faction}</span>`);
            if (entity.location) parts.push(`<span class="lore-detail">📍 ${entity.location}</span>`);
            detailsHtml = parts.join('');
        } else if (category === 'factions') {
            const parts = [];
            if (entity.factionType) parts.push(`<span class="lore-detail">🏷️ ${entity.factionType}</span>`);
            if (entity.headquarters) parts.push(`<span class="lore-detail">🏰 ${entity.headquarters}</span>`);
            detailsHtml = parts.join('');
        } else if (category === 'locations') {
            const parts = [];
            if (entity.locationType) parts.push(`<span class="lore-detail">🏷️ ${entity.locationType}</span>`);
            detailsHtml = parts.join('');
        } else if (category === 'items') {
            const parts = [];
            if (entity.itemType) parts.push(`<span class="lore-detail">🏷️ ${entity.itemType}</span>`);
            if (entity.rarity) parts.push(`<span class="lore-detail">💎 ${entity.rarity}</span>`);
            detailsHtml = parts.join('');
        } else if (category === 'events') {
            const parts = [];
            if (entity.eventType) parts.push(`<span class="lore-detail">🏷️ ${entity.eventType}</span>`);
            if (entity.target) parts.push(`<span class="lore-detail">🎯 ${entity.target}</span>`);
            detailsHtml = parts.join('');
        }
        
        const confidence = Math.round(entity.confidence * 100);
        const confidenceClass = confidence >= 80 ? 'high' : confidence >= 60 ? 'medium' : 'low';
        
        return `
            <div class="lore-entity-card" data-category="${category}" data-index="${idx}">
                <div class="lore-entity-header">
                    <label class="lore-entity-checkbox">
                        <input type="checkbox" class="lore-entity-check" data-category="${category}" data-index="${idx}" checked>
                        <span class="lore-entity-name">${entity.name}</span>
                    </label>
                    <span class="lore-entity-type">${typeLabels[category]}</span>
                </div>
                ${detailsHtml ? `<div class="lore-entity-details">${detailsHtml}</div>` : ''}
                ${entity.description ? `<div class="lore-entity-context">"${entity.description}"</div>` : ''}
                <div class="lore-entity-footer">
                    <span class="lore-confidence ${confidenceClass}" title="Confidenza estrazione">${confidence}%</span>
                    <button class="lore-btn lore-btn-small lore-import-single-btn" data-category="${category}" data-index="${idx}">
                        📥 Importa
                    </button>
                </div>
            </div>
        `;
    },
    
    selectAll(checked) {
        this.container.querySelectorAll('.lore-entity-check').forEach(cb => {
            cb.checked = checked;
        });
    },
    
    handleImport() {
        if (!this.lastExtraction) {
            showToast('Nessuna estrazione da importare', 'warning');
            return;
        }
        
        // Raccogli entità selezionate per categoria
        const selected = { npcs: [], factions: [], locations: [], items: [], events: [] };
        this.container.querySelectorAll('.lore-entity-check:checked').forEach(cb => {
            const category = cb.dataset.category;
            const idx = parseInt(cb.dataset.index, 10);
            if (this.lastExtraction[category] && this.lastExtraction[category][idx]) {
                selected[category].push(this.lastExtraction[category][idx]);
            }
        });
        
        const total = Object.values(selected).reduce((sum, arr) => sum + arr.length, 0);
        if (total === 0) {
            showToast('Nessuna entità selezionata', 'warning');
            return;
        }
        
        // Esegui integrazioni
        const results = {
            npcs: integrateNpcs(selected.npcs),
            factions: integrateFactions(selected.factions),
            locations: integrateLocations(selected.locations),
            items: integrateItems(selected.items),
            events: integrateEvents(selected.events),
        };
        
        // Riepilogo
        let totalSaved = 0;
        let totalSkipped = 0;
        const errors = [];
        Object.entries(results).forEach(([cat, r]) => {
            totalSaved += r.saved;
            totalSkipped += r.skipped;
            if (r.errors.length > 0) errors.push(`${cat}: ${r.errors.join(', ')}`);
        });
        
        if (errors.length > 0) {
            showToast(`Importati ${totalSaved} elementi con ${errors.length} errori`, 'warning', 5000);
        } else {
            showToast(`✅ ${totalSaved} entità importate! (${totalSkipped} già esistenti saltate)`, 'success', 5000);
        }
        
        console.log('📥 [LoreExtractor] Risultati import:', results);
    },
    
    handleImportSingle(category, idx) {
        if (!this.lastExtraction || !this.lastExtraction[category]) return;
        const entity = this.lastExtraction[category][idx];
        if (!entity) return;
        
        let result;
        switch (category) {
            case 'npcs': result = integrateNpcs([entity]); break;
            case 'factions': result = integrateFactions([entity]); break;
            case 'locations': result = integrateLocations([entity]); break;
            case 'items': result = integrateItems([entity]); break;
            case 'events': result = integrateEvents([entity]); break;
        }
        
        if (result.saved > 0) {
            showToast(`✅ ${entity.name} importato!`, 'success');
        } else if (result.skipped > 0) {
            showToast(`⚠️ ${entity.name} già esistente`, 'info');
        } else {
            showToast(`❌ Errore importazione: ${result.errors.join(', ')}`, 'error');
        }
    },
};

export default LoreExtractor;

console.log('📜 [LoreExtractor] Modulo caricato.');
