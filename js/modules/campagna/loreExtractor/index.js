// index.js
// ─────────────────────────────────────────────────────────────
// Lore Extractor - Modulo principale con UI.
// Editor testo libero + estrazione su bottone + anteprima + integrazione.
// Supporto doppia modalità: parser regole (offline) + WebLLM (AI opzionale).

import { parseLore } from './parser.js';
import {
    integrateNpcs, integrateFactions, integrateLocations,
    integrateItems, integrateEvents
} from './integrators.js';
import {
    isWebGPUAvailable, isWebLLMReady, isWebLLMLoading,
    initWebLLM, destroyWebLLM, extractWithAI, extractWithFallback,
    getAvailableModels, getRecommendedModel
} from './webLLMAdapter.js';
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

// --- STORAGE PER LA CRONOLOGIA ESTRAZIONI ---

function getHistoryStorageKey() {
    const campaignId = getCurrentCampaignId();
    return campaignId ? `dungeonMasterToolLoreHistory_${campaignId}` : null;
}

function loadHistory() {
    const key = getHistoryStorageKey();
    if (!key) return [];
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Errore caricamento cronologia:', e);
        return [];
    }
}

function saveToHistory(extraction) {
    const key = getHistoryStorageKey();
    if (!key) return false;
    try {
        const history = loadHistory();
        // Aggiungi in cima
        history.unshift({
            id: Date.now(),
            timestamp: new Date().toISOString(),
            source: extraction.stats?.source || 'rules',
            totalEntities: extraction.stats?.totalEntities || 0,
            parseTime: extraction.stats?.parseTime || 0,
            npcsCount: extraction.npcs?.length || 0,
            factionsCount: extraction.factions?.length || 0,
            locationsCount: extraction.locations?.length || 0,
            itemsCount: extraction.items?.length || 0,
            eventsCount: extraction.events?.length || 0,
            // Salva solo i nomi per risparmiare spazio
            summary: {
                npcs: (extraction.npcs || []).map(n => n.name).slice(0, 10),
                factions: (extraction.factions || []).map(f => f.name).slice(0, 10),
                locations: (extraction.locations || []).map(l => l.name).slice(0, 10),
                items: (extraction.items || []).map(i => i.name).slice(0, 10),
                events: (extraction.events || []).map(e => e.name).slice(0, 10),
            },
        });
        // Mantieni solo le ultime 20 estrazioni
        if (history.length > 20) history.length = 20;
        localStorage.setItem(key, JSON.stringify(history));
        return true;
    } catch (e) {
        console.error('Errore salvataggio cronologia:', e);
        return false;
    }
}

function clearHistory() {
    const key = getHistoryStorageKey();
    if (!key) return;
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.error('Errore cancellazione cronologia:', e);
    }
}

// --- MODULO ---

const LoreExtractor = {
    lastExtraction: null,
    useAIMode: false,
    aiProgressCallback: null,
    
    render(containerElement) {
        this.container = containerElement;
        const savedNote = loadNote();
        const webgpuAvailable = isWebGPUAvailable();
        
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
            <button id="lore-history-btn" class="lore-btn lore-btn-secondary" title="Cronologia estrazioni">
                📚 Cronologia
            </button>
            <button id="lore-extract-btn" class="lore-btn lore-btn-primary" title="Estrai entità dal testo">
                🪄 Estrai dati
            </button>
            <button id="lore-clear-btn" class="lore-btn lore-btn-danger" title="Cancella testo">
                🗑️ Pulisci
            </button>
            <div class="lore-ai-toggle-container">
                <button id="lore-ai-toggle-btn" class="lore-btn lore-btn-ai ${webgpuAvailable ? '' : 'disabled'}" title="${webgpuAvailable ? 'Attiva modalità AI (richiede download modello ~2GB, poi funziona offline)' : 'WebGPU non disponibile. Usa Chrome/Edge 113+'}" ${webgpuAvailable ? '' : 'disabled'}>
                    🤖 <span class="lore-ai-toggle-label">AI</span>
                </button>
                <span id="lore-ai-status" class="lore-ai-status ${webgpuAvailable ? '' : 'unavailable'}">
                    ${webgpuAvailable ? 'Off' : 'N/A'}
                </span>
            </div>
        </div>
    </div>
    
    <!-- AI Progress bar (nascosta di default) -->
    <div id="lore-ai-progress" class="lore-ai-progress hidden">
        <div class="lore-ai-progress-bar">
            <div id="lore-ai-progress-fill" class="lore-ai-progress-fill"></div>
        </div>
        <span id="lore-ai-progress-text" class="lore-ai-progress-text">Inizializzazione...</span>
    </div>
    
    <!-- Layout principale: editor + pannello estrazione -->
    <div class="lore-main-layout">
        <!-- Editor testo -->
        <div class="lore-editor-panel">
            <div class="lore-editor-header">
                <h3>📝 Testo libero</h3>
                <span id="lore-word-count" class="lore-word-count">0 parole • 0 caratteri</span>
            </div>
            <!-- Toolbar formattazione -->
            <div class="lore-editor-toolbar">
                <button class="lore-toolbar-btn" data-action="h1" title="Titolo 1">H1</button>
                <button class="lore-toolbar-btn" data-action="h2" title="Titolo 2">H2</button>
                <button class="lore-toolbar-btn" data-action="h3" title="Titolo 3">H3</button>
                <span class="lore-toolbar-divider"></span>
                <button class="lore-toolbar-btn" data-action="bold" title="Grassetto"><b>B</b></button>
                <button class="lore-toolbar-btn" data-action="italic" title="Corsivo"><i>I</i></button>
                <span class="lore-toolbar-divider"></span>
                <button class="lore-toolbar-btn" data-action="list" title="Lista">•</button>
                <button class="lore-toolbar-btn" data-action="quote" title="Citazione">"</button>
                <span class="lore-toolbar-divider"></span>
                <button class="lore-toolbar-btn" data-action="separator" title="Separatore">―</button>
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
    
    <!-- History Popup Overlay -->
    <div id="lore-history-overlay" class="popup-overlay hidden" role="dialog" aria-modal="true" aria-label="Cronologia estrazioni">
        <div class="lore-history-popup-container">
            <button class="popup-close" title="Chiudi" aria-label="Chiudi popup">×</button>
            <div class="lore-history-content">
                <div class="lore-history-header">
                    <h3>📚 Cronologia Estrazioni</h3>
                    <button id="lore-clear-history-btn" class="lore-btn lore-btn-danger lore-btn-small">🗑️ Cancella cronologia</button>
                </div>
                <div id="lore-history-list" class="lore-history-list"></div>
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
        
        // AI Toggle
        container.querySelector('#lore-ai-toggle-btn')?.addEventListener('click', () => {
            this.handleAIToggle();
        });
        
        // Toolbar formattazione
        container.querySelectorAll('.lore-toolbar-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleToolbarAction(btn.dataset.action);
            });
        });
        
        // Cronologia
        container.querySelector('#lore-history-btn')?.addEventListener('click', () => {
            this.openHistory();
        });
        container.querySelector('#lore-history-overlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'lore-history-overlay') {
                this.closeHistory();
            }
        });
        container.querySelector('#lore-history-overlay .popup-close')?.addEventListener('click', () => {
            this.closeHistory();
        });
        container.querySelector('#lore-clear-history-btn')?.addEventListener('click', () => {
            this.handleClearHistory();
        });
    },
    
    /**
     * Gestisce le azioni della toolbar di formattazione.
     * Inserisce marker markdown nella posizione del cursore.
     */
    handleToolbarAction(action) {
        const textInput = this.container.querySelector('#lore-text-input');
        if (!textInput) return;
        
        const start = textInput.selectionStart;
        const end = textInput.selectionEnd;
        const selectedText = textInput.value.substring(start, end);
        const before = textInput.value.substring(0, start);
        const after = textInput.value.substring(end);
        
        let insertion = '';
        let newCursorPos = start;
        
        switch (action) {
            case 'h1':
                insertion = `# ${selectedText || 'Titolo'}\n`;
                newCursorPos = start + insertion.length;
                break;
            case 'h2':
                insertion = `## ${selectedText || 'Sottotitolo'}\n`;
                newCursorPos = start + insertion.length;
                break;
            case 'h3':
                insertion = `### ${selectedText || 'Sezione'}\n`;
                newCursorPos = start + insertion.length;
                break;
            case 'bold':
                insertion = `**${selectedText || 'testo in grassetto'}**`;
                newCursorPos = start + insertion.length;
                break;
            case 'italic':
                insertion = `*${selectedText || 'testo in corsivo'}*`;
                newCursorPos = start + insertion.length;
                break;
            case 'list':
                insertion = `- ${selectedText || 'elemento lista'}\n`;
                newCursorPos = start + insertion.length;
                break;
            case 'quote':
                insertion = `> ${selectedText || 'citazione'}\n`;
                newCursorPos = start + insertion.length;
                break;
            case 'separator':
                insertion = `\n---\n`;
                newCursorPos = start + insertion.length;
                break;
        }
        
        textInput.value = before + insertion + after;
        textInput.focus();
        textInput.setSelectionRange(newCursorPos, newCursorPos);
        this.updateWordCount();
        // Auto-save
        clearTimeout(this._autoSaveTimer);
        this._autoSaveTimer = setTimeout(() => {
            saveNote(textInput.value);
        }, 2000);
    },
    
    /**
     * Apre il popup cronologia estrazioni.
     */
    openHistory() {
        const overlay = this.container.querySelector('#lore-history-overlay');
        const list = this.container.querySelector('#lore-history-list');
        if (!overlay || !list) return;
        
        const history = loadHistory();
        
        if (history.length === 0) {
            list.innerHTML = `
                <div class="lore-empty-state">
                    <div class="lore-empty-icon">📭</div>
                    <p>Nessuna estrazione nella cronologia</p>
                    <p class="lore-empty-hint">Le estrazioni verranno salvate automaticamente qui dopo ogni analisi</p>
                </div>
            `;
        } else {
            list.innerHTML = history.map(entry => this.renderHistoryEntry(entry)).join('');
        }
        
        overlay.classList.remove('hidden');
    },
    
    closeHistory() {
        const overlay = this.container.querySelector('#lore-history-overlay');
        if (overlay) overlay.classList.add('hidden');
    },
    
    renderHistoryEntry(entry) {
        const date = new Date(entry.timestamp);
        const dateStr = date.toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        const sourceIcon = entry.source === 'ai' ? '🤖' : '📋';
        const sourceLabel = entry.source === 'ai' ? 'AI' : 'Regole';
        
        const summaryParts = [];
        if (entry.summary?.npcs?.length > 0) {
            summaryParts.push(`🧙 ${entry.summary.npcs.slice(0, 3).join(', ')}${entry.summary.npcs.length > 3 ? '...' : ''}`);
        }
        if (entry.summary?.factions?.length > 0) {
            summaryParts.push(`🏛️ ${entry.summary.factions.slice(0, 2).join(', ')}`);
        }
        if (entry.summary?.locations?.length > 0) {
            summaryParts.push(`📍 ${entry.summary.locations.slice(0, 2).join(', ')}`);
        }
        
        return `
            <div class="lore-history-entry">
                <div class="lore-history-entry-header">
                    <span class="lore-history-date">${dateStr}</span>
                    <span class="lore-history-source">${sourceIcon} ${sourceLabel}</span>
                    <span class="lore-history-count">${entry.totalEntities} entità • ${entry.parseTime}ms</span>
                </div>
                <div class="lore-history-summary">
                    ${summaryParts.length > 0 ? summaryParts.join(' • ') : '<em>Nessuna entità estratta</em>'}
                </div>
                <div class="lore-history-breakdown">
                    ${entry.npcsCount > 0 ? `<span class="lore-history-tag">🧙 ${entry.npcsCount} PNG</span>` : ''}
                    ${entry.factionsCount > 0 ? `<span class="lore-history-tag">🏛️ ${entry.factionsCount} Fazioni</span>` : ''}
                    ${entry.locationsCount > 0 ? `<span class="lore-history-tag">📍 ${entry.locationsCount} Luoghi</span>` : ''}
                    ${entry.itemsCount > 0 ? `<span class="lore-history-tag">⚔️ ${entry.itemsCount} Oggetti</span>` : ''}
                    ${entry.eventsCount > 0 ? `<span class="lore-history-tag">⚡ ${entry.eventsCount} Eventi</span>` : ''}
                </div>
            </div>
        `;
    },
    
    handleClearHistory() {
        if (confirm('Cancellare tutta la cronologia delle estrazioni?')) {
            clearHistory();
            this.openHistory(); // Refresh
            showToast('Cronologia cancellata', 'info');
        }
    },
    
    /**
     * Gestisce l'attivazione/disattivazione della modalità AI.
     */
    async handleAIToggle() {
        if (!isWebGPUAvailable()) {
            showToast('WebGPU non disponibile. Usa Chrome 113+ o Edge 113+.', 'warning', 5000);
            return;
        }
        
        if (this.useAIMode) {
            // Disattiva AI
            this.useAIMode = false;
            this.updateAIStatus('Off');
            this.updateAIToggleButton(false);
            showToast('Modalità AI disattivata. Uso parser regole.', 'info');
            return;
        }
        
        // Attiva AI: se già pronto, attiva subito
        if (isWebLLMReady()) {
            this.useAIMode = true;
            this.updateAIStatus('Pronto');
            this.updateAIToggleButton(true);
            showToast('✅ Modalità AI attiva! Estrazione con intelligenza artificiale.', 'success');
            return;
        }
        
        // Se in caricamento, ignora
        if (isWebLLMLoading()) {
            showToast('Caricamento modello già in corso...', 'warning');
            return;
        }
        
        // Altrimenti: avvia caricamento modello
        const recommended = getRecommendedModel();
        const confirmMsg = `L'attivazione della modalità AI richiede il download del modello "${recommended.name}" (${recommended.size}).\n\n` +
            `Una volta scaricato, funzionerà completamente offline.\n` +
            `Vuoi procedere?`;
        
        if (!confirm(confirmMsg)) return;
        
        try {
            this.updateAIStatus('Caricamento...');
            this.showAIProgress(true);
            this.updateAIToggleButton(true, true); // loading state
            
            await initWebLLM(null, (progress) => {
                this.updateAIProgress(progress);
            });
            
            this.useAIMode = true;
            this.updateAIStatus('Pronto');
            this.updateAIToggleButton(true);
            this.showAIProgress(false);
            showToast('🎉 Modello AI caricato! Modalità AI attiva.', 'success', 5000);
        } catch (e) {
            console.error('Errore caricamento AI:', e);
            this.updateAIStatus('Errore');
            this.updateAIToggleButton(false);
            this.showAIProgress(false);
            // Per errori lunghi (es. GPU non disponibile), mostra toast più a lungo
            const isLongError = e.message && e.message.length > 100;
            const duration = isLongError ? 15000 : 5000;
            const prefix = isLongError ? '❌ Impossibile attivare AI.' : '❌ Errore:';
            const msg = isLongError
                ? `${prefix}\n\n${e.message}\n\nℹ️ Puoi usare comunque il parser regole (offline).`
                : `${prefix} ${e.message}`;
            showToast(msg, 'error', duration);
        }
    },
    
    updateAIStatus(text) {
        const status = this.container.querySelector('#lore-ai-status');
        if (status) {
            status.textContent = text;
            status.className = 'lore-ai-status';
            if (text === 'Pronto') status.classList.add('ready');
            else if (text === 'Caricamento...') status.classList.add('loading');
            else if (text === 'Errore') status.classList.add('error');
            else if (text === 'N/A') status.classList.add('unavailable');
        }
    },
    
    updateAIToggleButton(active, loading = false) {
        const btn = this.container.querySelector('#lore-ai-toggle-btn');
        const label = this.container.querySelector('.lore-ai-toggle-label');
        if (!btn) return;
        btn.classList.toggle('active', active);
        btn.classList.toggle('loading', loading);
        if (label) {
            label.textContent = loading ? '...' : 'AI';
        }
    },
    
    showAIProgress(show) {
        const progress = this.container.querySelector('#lore-ai-progress');
        if (progress) {
            progress.classList.toggle('hidden', !show);
        }
    },
    
    updateAIProgress(progress) {
        const fill = this.container.querySelector('#lore-ai-progress-fill');
        const text = this.container.querySelector('#lore-ai-progress-text');
        if (!fill || !text) return;
        
        if (progress.progress !== undefined) {
            fill.style.width = `${Math.round(progress.progress * 100)}%`;
        }
        if (progress.message) {
            text.textContent = progress.message;
        }
    },
    
    updateWordCount() {
        const textInput = this.container.querySelector('#lore-text-input');
        const wordCount = this.container.querySelector('#lore-word-count');
        if (!textInput || !wordCount) return;
        const text = textInput.value;
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const lines = text ? text.split('\n').length : 0;
        wordCount.textContent = `${words} parol${words === 1 ? 'a' : 'e'} • ${chars} caratteri • ${lines} rig${lines === 1 ? 'a' : 'he'}`;
    },
    
    async handleExtract() {
        const textInput = this.container.querySelector('#lore-text-input');
        if (!textInput || !textInput.value.trim()) {
            showToast('Inserisci del testo da analizzare', 'warning');
            return;
        }
        
        const text = textInput.value;
        
        // Se AI attiva, usa estrazione async con fallback
        if (this.useAIMode) {
            showToast('🤖 AI sta analizzando il testo...', 'info');
            this.showAIProgress(true);
            this.updateAIProgress({ progress: 0, message: 'AI in elaborazione...' });
            
            try {
                const result = await extractWithFallback(text, {
                    useAI: true,
                    progressCallback: (progress) => {
                        if (progress.stage === 'thinking') {
                            this.updateAIProgress({ progress: 0.5, message: progress.message });
                        }
                    }
                });
                
                this.showAIProgress(false);
                this.lastExtraction = result;
                saveToHistory(result);
                this.updateExtractionStats(result.stats);
                this.updateTabBadges(result);
                this.currentCategory = 'npcs';
                this.container.querySelectorAll('.lore-tab-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.category === 'npcs');
                });
                this.renderEntities();
                this.container.querySelector('#lore-extraction-actions').style.display = 'flex';
                saveNote(text);
                
                const source = result.stats.source === 'ai' ? '🤖 AI' : '📋 Regole';
                const msg = `${result.stats.totalEntities} entità trovate (${source}, ${result.stats.parseTime}ms): ${result.npcs.length} PNG, ${result.factions.length} fazioni, ${result.locations.length} luoghi, ${result.items.length} oggetti, ${result.events.length} eventi`;
                showToast(msg, 'success', 6000);
            } catch (e) {
                this.showAIProgress(false);
                showToast(`❌ Errore estrazione AI: ${e.message}`, 'error', 5000);
                console.error(e);
            }
            return;
        }
        
        // Parser regole (sincrono, veloce, offline)
        showToast('🔍 Analisi testo in corso...', 'info');
        
        const result = parseLore(text);
        this.lastExtraction = result;
        saveToHistory(result);
        
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
        saveNote(text);
        
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
