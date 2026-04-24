/**
 * PgStep6Notes.js
 * ─────────────────────────────────────────────────────────────
 * Renderizza lo Step 6 del wizard: Background e Note.
 * 
 * @author DM Tool
 * @version 1.1.0 - escapeHtml importata da PgConstants
 */

import { escapeHtml } from './PgConstants.js';

/**
 * Renderizza lo Step 6: Background e Note
 * @param {Object} pgData - Dati del personaggio
 * @returns {string} HTML dello step
 */
export function renderStep6Notes(pgData) {
    return `
        <div class="wizard-form">
            <div class="form-section">
                <h3>Background e Note</h3>
                <p class="form-description">Usa @ per linkare elementi della campagna (es. @NomePNG, @Luogo)</p>
                <div class="form-group">
                    <label for="pg-backstory">Storia del Personaggio</label>
                    <textarea id="pg-backstory" rows="4" class="form-control tag-autocomplete" 
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
            
            <div class="form-section dm-secrets-section">
                <h3>🔒 Segreti del DM</h3>
                <p class="form-description">Note riservate visibili solo al Dungeon Master. Il giocatore non potrà vederle.</p>
                <div class="form-group">
                    <label for="pg-dm-secrets">Segreti e Trame Nascoste</label>
                    <textarea id="pg-dm-secrets" rows="4" class="form-control tag-autocomplete dm-secrets-input" 
                              placeholder="Segreti del personaggio, trame future, connessioni nascoste...">${escapeHtml(pgData.dmSecrets || '')}</textarea>
                    <div class="autocomplete-dropdown" id="autocomplete-pg-dm-secrets"></div>
                </div>
            </div>
        </div>
    `;
}

console.log('📋 [PgStep6Notes] Modulo caricato.');
