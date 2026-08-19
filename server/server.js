// server.js
// ─────────────────────────────────────────────────────────────
// Server Node.js per generazione AI on-demand di mappe D&D.
// Usa z-ai-web-dev-sdk per generare immagini da prompt personalizzati.
//
// Avvio: node server/server.js
// Porta: 3001 (per non confliggere con il frontend)
//
// Endpoint:
//   POST /api/generate-map
//     Body: { prompt: "forest battlemap with river", size: "1344x768" }
//     Response: { success: true, image: "data:image/png;base64,..." }
//
//   GET /api/health
//     Response: { status: "ok", model: "z-ai-web-dev-sdk" }

import ZAI from 'z-ai-web-dev-sdk';
import http from 'http';

const PORT = 3001;
const CORS_ORIGIN = '*';

// Dimensioni supportate dall'API
const SUPPORTED_SIZES = [
    '1024x1024',
    '768x1344', '864x1152',
    '1344x768', '1152x864',
    '1440x720', '720x1440',
];

let zaiInstance = null;

async function initZAI() {
    if (zaiInstance) return zaiInstance;
    console.log('🤖 [Server] Inizializzazione z-ai-web-dev-sdk...');
    zaiInstance = await ZAI.create();
    console.log('✅ [Server] z-ai-web-dev-sdk pronto');
    return zaiInstance;
}

/**
 * Genera un'immagine da prompt.
 * @param {string} prompt - Descrizione dell'immagine
 * @param {string} size - Dimensioni (es. "1344x768")
 * @returns {Promise<string>} Base64 data URL
 */
async function generateImage(prompt, size = '1344x768') {
    const zai = await initZAI();
    
    if (!SUPPORTED_SIZES.includes(size)) {
        throw new Error(`Dimensione non supportata: ${size}. Valide: ${SUPPORTED_SIZES.join(', ')}`);
    }
    
    console.log(`🎨 [Server] Generazione immagine: "${prompt.substring(0, 50)}..." (${size})`);
    
    const response = await zai.images.generations.create({
        prompt: prompt,
        size: size,
    });
    
    if (!response.data || !response.data[0] || !response.data[0].base64) {
        throw new Error('Risposta API non valida: nessun dato immagine');
    }
    
    const base64 = response.data[0].base64;
    const dataUrl = `data:image/png;base64,${base64}`;
    
    console.log(`✅ [Server] Immagine generata (${Math.round(base64.length * 0.75 / 1024)}KB)`);
    return dataUrl;
}

/**
 * Parse del body JSON da una richiesta HTTP.
 */
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                reject(new Error('JSON non valido'));
            }
        });
        req.on('error', reject);
    });
}

/**
 * Invia una risposta JSON con CORS headers.
 */
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': CORS_ORIGIN,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(JSON.stringify(data));
}

// --- SERVER HTTP ---

const server = http.createServer(async (req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        sendJSON(res, 200, {});
        return;
    }
    
    // Health check
    if (req.method === 'GET' && req.url === '/api/health') {
        sendJSON(res, 200, {
            status: 'ok',
            model: 'z-ai-web-dev-sdk',
            templates: 56,
            supportedSizes: SUPPORTED_SIZES,
        });
        return;
    }
    
    // Generate map
    if (req.method === 'POST' && req.url === '/api/generate-map') {
        try {
            const body = await parseBody(req);
            
            if (!body.prompt || body.prompt.trim().length < 5) {
                sendJSON(res, 400, { success: false, error: 'Prompt troppo corto (min 5 caratteri)' });
                return;
            }
            
            const size = body.size || '1344x768';
            const fullPrompt = body.prompt + ', top-down, D&D tactical map, high quality, detailed, no grid, no text';
            
            const imageDataUrl = await generateImage(fullPrompt, size);
            
            sendJSON(res, 200, {
                success: true,
                image: imageDataUrl,
                prompt: body.prompt,
                size: size,
            });
        } catch (e) {
            console.error('❌ [Server] Errore generazione:', e.message);
            sendJSON(res, 500, { success: false, error: e.message });
        }
        return;
    }
    
    // 404
    sendJSON(res, 404, { error: 'Endpoint non trovato' });
});

// --- AVVIO ---

async function start() {
    try {
        await initZAI();
        server.listen(PORT, () => {
            console.log('');
            console.log('╔══════════════════════════════════════════════════╗');
            console.log('║  🗺️  DM-Tool AI Map Server                       ║');
            console.log('╠══════════════════════════════════════════════════╣');
            console.log(`║  ✅ Server attivo su http://localhost:${PORT}        ║`);
            console.log('║                                                  ║');
            console.log('║  Endpoints:                                      ║');
            console.log('║    GET  /api/health     - Stato server           ║');
            console.log('║    POST /api/generate-map - Genera mappa AI       ║');
            console.log('║                                                  ║');
            console.log('║  Il frontend rileverà automaticamente            ║');
            console.log('║  questo server e abiliterà la generazione AI.    ║');
            console.log('╚══════════════════════════════════════════════════╝');
            console.log('');
        });
    } catch (e) {
        console.error('❌ [Server] Errore avvio:', e.message);
        console.error('   Verifica che z-ai-web-dev-sdk sia installato: npm install z-ai-web-dev-sdk');
        process.exit(1);
    }
}

start();
