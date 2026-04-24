// modules/compendio/appendix.js
/**
 * Modulo Appendice Condizioni
 * 
 * Visualizza tutte le condizioni di gioco in formato scheda.
 * Aggiornato per supportare la nuova struttura del database condizioni
 * dove ogni condizione è un oggetto {description, summary}.
 * 
 * @version 2.0.1 - Fix per regex in template literal
 */

import { conditionsDatabase } from '../../../database/conditions.js';

/**
 * Formatta la descrizione convertendo i newline in <br>
 * @param {string} description - La descrizione da formattare
 * @returns {string} La descrizione formattata in HTML
 */
function formatDescription(description) {
    if (!description || typeof description !== 'string') {
        return '';
    }
    // Uso RegExp come costruttore per evitare problemi in template literal
    const newlineRegex = new RegExp('\\n', 'g');
    return description.replace(newlineRegex, '<br>');
}

const Appendix = {
    render(containerElement) {
        // --- STEP 1: Prepara i dati prima del template literal ---
        const conditionCards = Object.entries(conditionsDatabase).map(([name, data]) => {
            // Gestisce la nuova struttura {description, summary}
            // Fallback per retrocompatibilità se data è ancora una stringa
            const description = (typeof data === 'object' && data.description) 
                ? data.description 
                : data;
            
            const formattedDescription = formatDescription(description);
            
            return `
                <div class="condition-card">
                    <h3>${name}</h3>
                    <p>${formattedDescription}</p>
                </div>
            `;
        }).join('');
        
        // --- STEP 2: Rendering del contenitore principale ---
        containerElement.innerHTML = `
            <div class="appendix-container">
                <h2>Appendice: Condizioni di Gioco</h2>
                <div class="conditions-list">
                    ${conditionCards}
                </div>
            </div>
        `;
    }
};

export default Appendix;
