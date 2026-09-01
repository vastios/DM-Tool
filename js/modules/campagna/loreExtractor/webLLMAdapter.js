// webLLMAdapter.js
// ─────────────────────────────────────────────────────────────
// Adapter per WebLLM - AI vera nel browser via WebGPU.
// Caricamento on-demand, fallback automatico al parser regole.

import { parseLore } from './parser.js';

// URL CDN per WebLLM (caricamento dinamico, solo quando richiesto)
const WEBLLM_CDN_URL = 'https://esm.run/@mlc-ai/web-llm@0.2.78';

// Modelli disponibili (dal più leggero al più potente)
// NOTA: nelle versioni recenti di @mlc-ai/web-llm (>= 0.2.78), i model ID
// richiedono il suffisso "-MLC" per i modelli sulla piattaforma MLC.
// Vedi: https://github.com/mlc-ai/web-llm/blob/main/src/config.ts
const AVAILABLE_MODELS = [
    {
        id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
        name: 'Llama 3.2 3B',
        size: '~2.0 GB',
        description: 'Meta Llama 3.2 - Buon equilibrio qualità/dimensione',
        recommended: true,
    },
    {
        id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
        name: 'Llama 3.2 1B',
        size: '~0.9 GB',
        description: 'Più leggero, più veloce ma meno accurato',
        recommended: false,
    },
    {
        id: 'Phi-3.5-mini-instruct-q4f16_1-MLC',
        name: 'Phi 3.5 Mini',
        size: '~2.2 GB',
        description: 'Microsoft Phi 3.5 - Ottimo per compiti strutturati',
        recommended: false,
    },
    {
        id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
        name: 'Qwen 2.5 1.5B',
        size: '~1.0 GB',
        description: 'Alibaba Qwen - Leggero e veloce',
        recommended: false,
    },
];

let webllmEngine = null;
let webllmLib = null;
let isLoadingModel = false;
let currentModelId = null;

/**
 * Verifica se il browser supporta WebGPU (necessario per WebLLM).
 * Nota: questo check è superficiale — navigator.gpu esiste ma requestAdapter()
 * potrebbe comunque ritornare null se la GPU fisica non è disponibile.
 * @returns {boolean} true se WebGPU è esposto dal browser
 */
export function isWebGPUAvailable() {
    return typeof navigator !== 'undefined' && !!navigator.gpu;
}

/**
 * Verifica se WebGPU è effettivamente utilizzabile (non solo esposto).
 * Chiama navigator.gpu.requestAdapter() per verificare che ci sia una GPU compatibile.
 * @returns {Promise<boolean>} true se WebGPU è effettivamente disponibile
 */
export async function isWebGPUUsable() {
    if (!isWebGPUAvailable()) return false;
    try {
        const adapter = await navigator.gpu.requestAdapter({
            powerPreference: 'high-performance'
        });
        return adapter !== null;
    } catch (e) {
        console.warn('⚠️ [WebLLM] requestAdapter() fallito:', e.message);
        return false;
    }
}

/**
 * Verifica se WebLLM è già stato caricato e inizializzato.
 * @returns {boolean} true se l'engine è pronto
 */
export function isWebLLMReady() {
    return webllmEngine !== null && !isLoadingModel;
}

/**
 * Verifica se un modello è in fase di caricamento.
 * @returns {boolean} true se in caricamento
 */
export function isWebLLMLoading() {
    return isLoadingModel;
}

/**
 * Ritorna la lista dei modelli disponibili.
 * @returns {Array} Lista di modelli con metadati
 */
export function getAvailableModels() {
    return AVAILABLE_MODELS;
}

/**
 * Ritorna il modello raccomandato (Llama 3.2 3B).
 * @returns {Object} Modello raccomandato
 */
export function getRecommendedModel() {
    return AVAILABLE_MODELS.find(m => m.recommended) || AVAILABLE_MODELS[0];
}

/**
 * Carica dinamicamente la libreria WebLLM da CDN.
 * @returns {Promise<Object>} La libreria webllm
 */
async function loadWebLLMLibrary() {
    if (webllmLib) return webllmLib;
    
    try {
        console.log('📥 [WebLLM] Caricamento libreria da CDN...');
        webllmLib = await import(/* @vite-ignore */ WEBLLM_CDN_URL);
        console.log('✅ [WebLLM] Libreria caricata');
        return webllmLib;
    } catch (e) {
        console.error('❌ [WebLLM] Errore caricamento libreria:', e);
        throw new Error('Impossibile caricare WebLLM. Verifica la connessione internet.');
    }
}

/**
 * Inizializza e carica il modello WebLLM.
 * @param {string} modelId - ID del modello da caricare (opzionale, default: raccomandato)
 * @param {Function} progressCallback - Callback per progresso caricamento
 * @returns {Promise<Object>} L'engine WebLLM
 */
export async function initWebLLM(modelId = null, progressCallback = null) {
    // Verifica WebGPU esposto dal browser
    if (!isWebGPUAvailable()) {
        throw new Error(
            'WebGPU non disponibile in questo browser. WebLLM richiede Chrome 113+, Edge 113+ o un browser compatibile con WebGPU abilitato.'
        );
    }

    // Verifica WebGPU effettivamente utilizzabile (GPU fisica accessibile)
    if (progressCallback) {
        progressCallback({ stage: 'checking_gpu', progress: 0, message: 'Verifica GPU in corso...' });
    }
    const gpuUsable = await isWebGPUUsable();
    if (!gpuUsable) {
        throw new Error(
            'GPU non disponibile per WebGPU. Possibili cause:\n' +
            '• Il computer non ha una GPU compatibile\n' +
            '• I driver della GPU non sono aggiornati\n' +
            '• L\'accelerazione hardware è disabilitata nelle impostazioni del browser\n' +
            '• Stai usando un ambiente virtuale/remote desktop senza GPU passthrough\n\n' +
            'Soluzioni:\n' +
            '• Aggiorna i driver video (NVIDIA/AMD/Intel)\n' +
            '• Verifica che l\'accelerazione hardware sia attiva (chrome://gpu)\n' +
            '• Disabilita eventuali estensioni che bloccano WebGPU\n\n' +
            'Puoi comunque usare il parser basato su regole (offline, no AI).'
        );
    }

    // Se già caricato con lo stesso modello, ritorna
    const targetModelId = modelId || getRecommendedModel().id;
    if (webllmEngine && currentModelId === targetModelId) {
        return webllmEngine;
    }

    if (isLoadingModel) {
        throw new Error('Caricamento modello già in corso. Attendi...');
    }

    isLoadingModel = true;

    try {
        const lib = await loadWebLLMLibrary();

        console.log(`🤖 [WebLLM] Caricamento modello: ${targetModelId}`);
        if (progressCallback) {
            progressCallback({ stage: 'loading', progress: 0, message: 'Inizializzazione...' });
        }
        
        webllmEngine = await lib.CreateMLCEngine(
            targetModelId,
            {
                initProgressCallback: (report) => {
                    console.log(`📦 [WebLLM] ${report.progress.toFixed(1)}% - ${report.text}`);
                    if (progressCallback) {
                        progressCallback({
                            stage: 'loading',
                            progress: report.progress,
                            message: report.text,
                        });
                    }
                },
            }
        );
        
        currentModelId = targetModelId;
        console.log('✅ [WebLLM] Modello pronto!');
        if (progressCallback) {
            progressCallback({ stage: 'ready', progress: 1, message: 'Modello pronto!' });
        }
        
        return webllmEngine;
    } catch (e) {
        console.error('❌ [WebLLM] Errore inizializzazione:', e);
        throw new Error(`Errore caricamento modello: ${e.message}`);
    } finally {
        isLoadingModel = false;
    }
}

/**
 * Distrugge l'engine WebLLM e libera la memoria.
 */
export async function destroyWebLLM() {
    if (webllmEngine) {
        try {
            await webllmEngine.unload();
            console.log('🗑️ [WebLLM] Modello scaricato');
        } catch (e) {
            console.error('Errore unload:', e);
        }
        webllmEngine = null;
        currentModelId = null;
    }
}

// --- PROMPT ENGINEERING ---

/**
 * System prompt per l'estrazione entità.
 * Definisce il formato JSON atteso e le regole.
 */
const SYSTEM_PROMPT = `Sei un assistente specializzato nell'estrazione di entità da testi narrativi di D&D in italiano.

Il tuo compito è analizzare il testo fornito e estrarre tutte le entità rilevanti, restituendole in formato JSON strutturato.

Categorie di entità da estrarre:

1. **npcs** (Personaggi Non Giocanti): personaggi nominati nel testo
   - name: nome proprio del personaggio
   - role: ruolo/occupazione (es. Re, Mago, Mercante, Soldato)
   - race: razza (es. Umano, Elfo, Nano, Goblin, Orco)
   - faction: fazione a cui appartiene (se menzionata)
   - location: luogo associato (se menzionato)
   - description: breve contesto (1-2 frasi)

2. **factions**: organizzazioni, tribù, gilde, sette
   - name: nome della fazione
   - factionType: tipo (Tribù, Gilda, Ordine, Setta, Clan, ecc.)
   - leader: capo (se menzionato)
   - headquarters: sede (se menzionata)
   - description: breve contesto

3. **locations**: luoghi nominati
   - name: nome del luogo
   - locationType: tipo (Città, Castello, Taverna, Foresta, Caverna, ecc.)
   - description: breve contesto

4. **items**: oggetti significativi (armi magiche, artefatti, reliquie)
   - name: nome dell'oggetto
   - itemType: tipo (Arma, Armatura, Amuleto, Pozione, Artefatto, ecc.)
   - rarity: rarità (Comune, Non Comune, Raro, Molto Raro, Leggendario, Artefatto)
   - description: breve contesto

5. **events**: eventi storici o narrativi significativi
   - name: nome/titolo dell'evento
   - eventType: tipo (Battaglia, Fondazione, Tradimento, Incoronazione, ecc.)
   - description: breve contesto

REGOLE IMPORTANTI:
- Estrai SOLO entità esplicitamente menzionate nel testo
- I nomi propri devono iniziare con maiuscola
- Non inventare informazioni non presenti nel testo
- Se un'informazione non è presente, usa null
- Mantieni le descrizioni brevi (massimo 2 frasi)
- Ritorna SOLO il JSON, nessun testo aggiuntivo

Formato di output (JSON):
{
  "npcs": [{"name": "...", "role": "...", "race": "...", "faction": "...", "location": "...", "description": "..."}],
  "factions": [{"name": "...", "factionType": "...", "leader": "...", "headquarters": "...", "description": "..."}],
  "locations": [{"name": "...", "locationType": "...", "description": "..."}],
  "items": [{"name": "...", "itemType": "...", "rarity": "...", "description": "..."}],
  "events": [{"name": "...", "eventType": "...", "description": "..."}]
}`;

/**
 * Esegue l'estrazione con AI usando WebLLM.
 * @param {string} text - Il testo da analizzare
 * @param {Function} progressCallback - Callback per stato
 * @returns {Promise<Object>} Risultato con same schema del parser regole
 */
export async function extractWithAI(text, progressCallback = null) {
    if (!isWebGPUAvailable()) {
        throw new Error('WebGPU non disponibile. Impossibile usare l\'AI.');
    }
    
    if (!webllmEngine) {
        // Auto-inizializza con modello raccomandato
        if (progressCallback) progressCallback({ stage: 'init', message: 'Inizializzazione AI...' });
        await initWebLLM(null, progressCallback);
    }
    
    if (progressCallback) progressCallback({ stage: 'thinking', message: 'AI sta analizzando il testo...' });
    
    const startTime = performance.now();
    
    try {
        const response = await webllmEngine.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `Analizza questo testo ed estrai tutte le entità:\n\n${text}` },
            ],
            temperature: 0.3, // Bassa temperatura per output più deterministico
            max_tokens: 4096,
        });
        
        const content = response.choices[0]?.message?.content || '';
        const endTime = performance.now();
        
        // Parsing del JSON dalla risposta
        const result = parseAIResponse(content);
        
        return {
            ...result,
            stats: {
                totalEntities: countEntities(result),
                textLength: text.length,
                parseTime: Math.round(endTime - startTime),
                source: 'ai',
                model: currentModelId,
            },
        };
    } catch (e) {
        console.error('❌ [WebLLM] Errore estrazione:', e);
        throw new Error(`Errore AI: ${e.message}`);
    }
}

/**
 * Parsa la risposta dell'AI estrando il JSON.
 * L'AI potrebbe includere testo extra, markdown, ecc.
 * @param {string} content - Il contenuto della risposta
 * @returns {Object} JSON parsato con le 5 categorie
 */
function parseAIResponse(content) {
    let jsonStr = content.trim();
    
    // Rimuovi markdown code fences se presenti
    if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.substring(7);
    } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.substring(3);
    }
    if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.substring(0, jsonStr.length - 3);
    }
    jsonStr = jsonStr.trim();
    
    // Trova il primo { e l'ultimo }
    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
    }
    
    try {
        const parsed = JSON.parse(jsonStr);
        
        // Normalizza la struttura per matchare il parser regole
        return {
            npcs: (parsed.npcs || []).map(normalizeNpc),
            factions: (parsed.factions || []).map(normalizeFaction),
            locations: (parsed.locations || []).map(normalizeLocation),
            items: (parsed.items || []).map(normalizeItem),
            events: (parsed.events || []).map(normalizeEvent),
        };
    } catch (e) {
        console.error('❌ [WebLLM] JSON non valido:', e, jsonStr);
        // Fallback: ritorna vuoto
        return { npcs: [], factions: [], locations: [], items: [], events: [] };
    }
}

function normalizeNpc(npc) {
    return {
        type: 'npc',
        name: npc.name || '',
        role: npc.role || null,
        race: npc.race || null,
        faction: npc.faction || null,
        location: npc.location || null,
        description: npc.description || null,
        confidence: 0.95, // AI ha alta confidenza
    };
}

function normalizeFaction(faction) {
    return {
        type: 'faction',
        name: faction.name || '',
        factionType: faction.factionType || null,
        leader: faction.leader || null,
        headquarters: faction.headquarters || null,
        description: faction.description || null,
        confidence: 0.95,
    };
}

function normalizeLocation(location) {
    return {
        type: 'location',
        name: location.name || '',
        locationType: location.locationType || null,
        description: location.description || null,
        parentLocation: null,
        confidence: 0.95,
    };
}

function normalizeItem(item) {
    return {
        type: 'item',
        name: item.name || '',
        itemType: item.itemType || null,
        rarity: item.rarity || 'Non Comune',
        description: item.description || null,
        confidence: 0.95,
    };
}

function normalizeEvent(event) {
    return {
        type: 'event',
        name: event.name || '',
        eventType: event.eventType || null,
        target: null,
        description: event.description || null,
        confidence: 0.95,
    };
}

function countEntities(result) {
    return (result.npcs?.length || 0) +
           (result.factions?.length || 0) +
           (result.locations?.length || 0) +
           (result.items?.length || 0) +
           (result.events?.length || 0);
}

/**
 * Estrae entità con fallback intelligente.
 * - Prima prova con AI (se WebLLM pronto e WebGPU disponibile)
 * - Se AI fallisce, fallback al parser regole
 * 
 * @param {string} text - Il testo da analizzare
 * @param {Object} options - { useAI: bool, progressCallback: fn }
 * @returns {Promise<Object>} Risultato estrazione
 */
export async function extractWithFallback(text, options = {}) {
    const { useAI = false, progressCallback = null } = options;
    
    // Se AI richiesta e disponibile, prova prima
    if (useAI && isWebGPUAvailable()) {
        try {
            if (progressCallback) progressCallback({ stage: 'ai_start', message: 'Estrazione con AI...' });
            const aiResult = await extractWithAI(text, progressCallback);
            if (progressCallback) progressCallback({ stage: 'ai_done', message: 'AI completata' });
            return aiResult;
        } catch (e) {
            console.warn('⚠️ [WebLLM] AI fallita, fallback al parser regole:', e.message);
            if (progressCallback) progressCallback({ stage: 'ai_error', message: e.message });
            // Fallback al parser regole
        }
    }
    
    // Parser regole (sempre disponibile, offline)
    if (progressCallback) progressCallback({ stage: 'rules_start', message: 'Estrazione con regole...' });
    const ruleResult = parseLore(text);
    if (progressCallback) progressCallback({ stage: 'rules_done', message: 'Parser regole completato' });
    return ruleResult;
}

console.log('🤖 [WebLLM] Adapter caricato. WebGPU disponibile:', isWebGPUAvailable());
