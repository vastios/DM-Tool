// aiMapClient.js
// ─────────────────────────────────────────────────────────────
// Client per comunicare con il server Node.js AI Map Server.
// Rileva automaticamente se il server è attivo e offre fallback.

const SERVER_URL = 'http://localhost:3001';

/**
 * Verifica se il server AI è attivo.
 * @returns {Promise<boolean>} true se il server risponde
 */
export async function checkAIServerStatus() {
    try {
        const response = await fetch(`${SERVER_URL}/api/health`, {
            method: 'GET',
            timeout: 3000,
        });
        if (!response.ok) return false;
        const data = await response.json();
        return data.status === 'ok';
    } catch (e) {
        return false;
    }
}

/**
 * Genera una mappa con AI tramite il server.
 * @param {string} prompt - Descrizione della mappa
 * @param {string} size - Dimensioni (default "1344x768")
 * @param {Function} onProgress - Callback opzionale per stato
 * @returns {Promise<string>} Base64 data URL dell'immagine
 */
export async function generateMapWithAI(prompt, size = '1344x768', onProgress = null) {
    if (onProgress) onProgress({ stage: 'sending', message: 'Invio richiesta al server AI...' });
    
    const response = await fetch(`${SERVER_URL}/api/generate-map`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size }),
    });
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Errore server' }));
        throw new Error(error.error || `Errore ${response.status}`);
    }
    
    if (onProgress) onProgress({ stage: 'generating', message: 'AI sta generando la mappa (10-30s)...' });
    
    const data = await response.json();
    
    if (!data.success || !data.image) {
        throw new Error(data.error || 'Risposta non valida dal server');
    }
    
    if (onProgress) onProgress({ stage: 'done', message: 'Mappa generata!' });
    
    return data.image;
}

/**
 * Dimensioni supportate per la generazione AI.
 */
export const AI_MAP_SIZES = [
    { value: '1344x768', label: 'Panoramica (1344×768) - Consigliata', },
    { value: '1024x1024', label: 'Quadrata (1024×1024)', },
    { value: '1152x864', label: 'Orizzontale (1152×864)', },
    { value: '1440x720', label: 'Wide (1440×720)', },
    { value: '768x1344', label: 'Verticale (768×1344)', },
    { value: '864x1152', label: 'Ritratto (864×1152)', },
];

/**
 * Prompt suggeriti per tipi di mappa comuni.
 */
export const PROMPT_SUGGESTIONS = [
    'forest battlemap with river crossing',
    'snowy mountain village',
    'underground lava cavern',
    'abandoned haunted mansion interior',
    'coastal cliff fortress',
    'ancient elven ruins in jungle',
    'frozen lake with ice fishing huts',
    'volcanic wasteland with lava rivers',
    'floating island with waterfalls',
    'underwater coral city ruins',
    'desert canyon with rope bridge',
    'misty graveyard at night',
];

console.log('🤖 [AIMapClient] Client caricato. Server URL:', SERVER_URL);
