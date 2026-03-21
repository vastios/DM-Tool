/**
 * PgStep5Notes.js
 * ─────────────────────────────────────────────────────────────
 * Renderizza lo Step 5 del wizard: Background e Note.
 * 
 * @author DM Tool
 * @version 1.0.0
 */

/**
 * Escape HTML per prevenire XSS
 * @param {string} text - Testo da escapare
 * @returns {string} Testo escapato
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Renderizza lo Step 5: Background e Note
 * @param {Object} pgData - Dati del personaggio
 * @returns {string} HTML dello step
 */
export function renderStep5Notes(pgData) {
    return `
        <div class="wizard-form">
            <div class="form-section">
                <h3>Background e Note</h3>
                <p class="form-description">Usa @ per linkare elementi della campagna (es. @NomePNG, @Luogo)</p>
                <div class="form-group">
                    <label for="pg-backstory">Storia del Personaggio</label>
                    <textarea id="pg-backstory" rows="5" class="form-control tag-autocomplete" 
                              placeholder="Origini, motivazioni...">${escapeHtml(pgData.backstory || '')}</textarea>
                    <div class="autocomplete-dropdown" id="autocomplete-pg-backstory"></div>
                </div>
                <div class="form-group">
                    <label for="pg-notes">Note</label>
                    <textarea id="pg-notes" rows="3" class="form-control tag-autocomplete" 
                              placeholder="Appunti, obbiettivi...">${escapeHtml(pgData.notes || '')}</textarea>
                    <div class="autocomplete-dropdown" id="autocomplete-pg-notes"></div>
                </div>
            </div>
        </div>
    `;
}

console.log('📋 [PgStep5Notes] Modulo caricato.');
