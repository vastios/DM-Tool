// utils/htmlHelpers.js
import { conditionsDatabase, getConditionDescription } from '../database/conditions.js';

/**
 * Converte i nomi delle condizioni in link HTML con attributi data per i tooltip.
 * Questa versione è "case-insensitive" e usa lookaround per una maggiore robustezza con il testo italiano.
 * 
 * AGGIORNATO v2.0: Ora supporta la nuova struttura del database condizioni
 * dove ogni condizione è un oggetto con {description, summary} invece di una stringa.
 * 
 * @param {string} text Il testo in cui cercare le condizioni.
 * @returns {string} Il testo HTML con i link alle condizioni.
 */
export function linkifyConditions(text) {
    // --- CONTROLLO DI SICUREZZA ---
    // Se conditionsDatabase non è disponibile (es. errore di importazione), 
    // restituisce il testo originale per evitare il crash dell'applicazione.
    if (!conditionsDatabase) {
        console.error("linkifyConditions: Impossibile trovare il database delle condizioni. L'import è fallito o il file non esiste.");
        return text;
    }
    
    if (typeof text !== 'string' || text === '') return text;
    
    const conditionNames = Object.keys(conditionsDatabase);
    // <<< MODIFICA CHIAVE: Sostituito \b con lookaround per una gestione robusta dei caratteri accentati
    const regex = new RegExp(`(?<!\\w)(${conditionNames.join('|')})(?!\\w)`, 'gi');
    
    return text.replace(regex, (match) => {
        // Trova la chiave corretta (con la maiuscola) nel database
        const canonicalKey = conditionNames.find(name => name.toLowerCase() === match.toLowerCase());
        
        // Se per qualche motivo non la trova, restituisce il match originale senza linkarlo
        if (!canonicalKey) {
            return match;
        }

        // --- MODIFICA v2.0: Usa getConditionDescription invece di accedere direttamente alla proprietà ---
        // Prima: const description = conditionsDatabase[canonicalKey];
        // Ora: Usa l'helper che gestisce la nuova struttura {description, summary}
        const description = getConditionDescription(canonicalKey);
        
        // Controllo di sicurezza aggiuntivo
        if (!description) {
            console.warn(`linkifyConditions: Descrizione non trovata per la condizione "${canonicalKey}"`);
            return match;
        }
        
        const cleanDesc = description.replace(/'/g, "&apos;");
        // Usa canonicalKey per data-name e data-desc per coerenza, ma 'match' per il testo visibile
        return `<span class="condition-link" data-name="${canonicalKey}" data-desc="${cleanDesc}">${match}</span>`;
    });
}

/**
 * Pulisce una stringa per prevenire attacchi XSS quando inserita come HTML.
 * @param {string} unsafe La stringa non sicura.
 * @returns {string} La stringa sicura per l'uso in HTML.
 */
export function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
         .replace(/`/g, "&#96;");
}

console.log('🔧 [htmlHelpers] Modulo caricato con supporto nuova struttura condizioni.');
