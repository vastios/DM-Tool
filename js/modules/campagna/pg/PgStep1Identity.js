/**
 * PgStep1Identity.js
 * ─────────────────────────────────────────────────────────────
 * Renderizza lo Step 1 del wizard: Identità del personaggio.
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
 * Determina il livello minimo per scegliere la sottoclasse
 * @param {Object} selectedClass - Classe selezionata
 * @returns {number} Livello minimo
 */
function getSubclassMinLevel(selectedClass) {
    if (!selectedClass) return 1;
    
    // Nomi comuni dei privilegi che introducono la sottoclasse
    const subclassKeywords = [
        'Cammino', 'Tradizione', 'College', 'Dominio', 'Cerchio', 
        'Archetipo', 'Monachesimo', 'Giuramento', 'Conclave', 
        'Origine', 'Patrono', 'Sottoclasse'
    ];
    
    // Cerca nella tabella progressione
    const table = selectedClass.tabella_progressione || [];
    for (const row of table) {
        if (row.privilegi) {
            for (const priv of row.privilegi) {
                if (subclassKeywords.some(k => priv.includes(k))) {
                    return row.livello || 1;
                }
            }
        }
    }
    
    // Default per classe
    const index = selectedClass.index;
    if (['sorcerer', 'warlock', 'cleric'].includes(index)) {
        return 1;
    }
    if (['wizard'].includes(index)) {
        return 2;
    }
    return 3;
}

/**
 * Renderizza il selettore della sottoclasse con controllo livello
 * @param {Object} pgData - Dati del personaggio
 * @param {Object} databases - Database con classe selezionata
 * @returns {string} HTML del selettore
 */
function renderSubclassSelect(pgData, databases) {
    const { selectedClass } = databases;
    
    // Se non c'è una classe selezionata
    if (!selectedClass) {
        return `
            <select id="pg-subclass" class="form-control" disabled>
                <option value="">-- Seleziona prima una classe --</option>
            </select>
        `;
    }
    
    // Ottieni le sottoclassi dalla classe (sia chiave italiana che inglese)
    const subclassOptions = selectedClass.sottoclassi || selectedClass.subclasses || [];
    
    // Se non ci sono sottoclassi disponibili
    if (subclassOptions.length === 0) {
        return `
            <select id="pg-subclass" class="form-control" disabled>
                <option value="">-- Nessuna sottoclasse disponibile --</option>
            </select>
        `;
    }
    
    // Determina il livello minimo per la sottoclasse
    const currentLevel = pgData.level || 1;
    const minLevel = getSubclassMinLevel(selectedClass);
    
    // Se il livello è insufficiente
    if (currentLevel < minLevel) {
        return `
            <div class="subclass-locked">
                <select id="pg-subclass" class="form-control" disabled>
                    <option value="">🔒 Disponibile dal Liv. ${minLevel}</option>
                </select>
                <span class="subclass-hint">Attualmente al Liv. ${currentLevel}</span>
            </div>
        `;
    }
    
    // Mostra le opzioni della sottoclasse
    return `
        <select id="pg-subclass" class="form-control">
            <option value="">-- Opzionale --</option>
            ${subclassOptions.map(s => `
                <option value="${s.nome}" ${pgData.subclass === s.nome ? 'selected' : ''}>${s.nome}</option>
            `).join('')}
        </select>
    `;
}

/**
 * Renderizza le informazioni su razza e classe
 * @param {Object} pgData - Dati del personaggio
 * @param {Object} databases - Database con razza e classe
 * @param {string} traitsHtml - HTML dei tratti e privilegi (già renderizzati)
 * @returns {string} HTML del pannello info
 */
function renderRaceClassInfo(pgData, databases, traitsHtml = '') {
    const { selectedRace, selectedClass } = databases;
    if (!selectedRace && !selectedClass) return '';
    
    let html = '<div class="info-panel">';
    
    if (selectedRace) {
        const bonuses = selectedRace.ability_bonuses || [];
        const speed = selectedRace.speed || selectedRace.velocita || '9';
        const size = selectedRace.size || selectedRace.taglia || 'Media';
        
        html += `
            <div class="info-section">
                <h4>🌍 ${selectedRace.name || selectedRace.nome || 'Razza'}</h4>
                <p>Velocità: ${speed}m | Taglia: ${size}</p>
                <p>Bonus: ${bonuses.map(b => `${b.ability_score?.name || b.caratteristica} +${b.bonus}`).join(', ') || 'Nessuno'}</p>
            </div>
        `;
    }
    
    if (selectedClass) {
        const className = selectedClass.classe || selectedClass.name;
        html += `
            <div class="info-section">
                <h4>⚔️ ${className}</h4>
                <p>Dado Vita: ${selectedClass.dado_vita || 'd' + selectedClass.hit_die}</p>
                <p>Primaria: ${selectedClass.caratteristica_primaria || 'N/D'}</p>
                <p>TS: ${selectedClass.saving_throws?.map(st => st.name).join(', ') || selectedClass.competenze?.tiri_salvezza?.join(', ') || 'Nessuno'}</p>
            </div>
        `;
    }
    
    html += '</div>';
    
    // Aggiungi sezione tratti e privilegi
    html += traitsHtml;
    
    return html;
}

/**
 * Renderizza lo Step 1: Identità del personaggio
 * @param {Object} pgData - Dati del personaggio
 * @param {Object} databases - Database con razze, classi, etc.
 * @param {string} traitsHtml - HTML dei tratti e privilegi (già renderizzati)
 * @returns {string} HTML dello step
 */
export function renderStep1Identity(pgData, databases, traitsHtml = '') {
    const { races, classes, alignments, backgrounds } = databases;
    
    return `
        <div class="wizard-form">
            <div class="form-section">
                <h3>Dati Anagrafici</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="pg-name">Nome Personaggio *</label>
                        <input type="text" id="pg-name" value="${escapeHtml(pgData.name || '')}" 
                               placeholder="Nome del personaggio" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="pg-player">Nome Giocatore</label>
                        <input type="text" id="pg-player" value="${escapeHtml(pgData.playerName || '')}" 
                               placeholder="Chi gioca questo PG?" class="form-control">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="pg-race">Razza *</label>
                        <select id="pg-race" class="form-control">
                            <option value="">-- Seleziona --</option>
                            ${(races || []).map(r => `
                                <option value="${r.index}" ${pgData.race === r.index ? 'selected' : ''}>${r.classe || r.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="pg-class">Classe *</label>
                        <select id="pg-class" class="form-control">
                            <option value="">-- Seleziona --</option>
                            ${(classes || []).map(c => `
                                <option value="${c.index}" ${pgData.class === c.index ? 'selected' : ''}>${c.classe || c.name}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="pg-subclass">Sottoclasse</label>
                        ${renderSubclassSelect(pgData, databases)}
                    </div>
                    <div class="form-group">
                        <label for="pg-level">Livello *</label>
                        <input type="number" id="pg-level" value="${pgData.level || 1}" min="1" max="20" class="form-control">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="pg-background">Background</label>
                        <select id="pg-background" class="form-control">
                            <option value="">-- Seleziona --</option>
                            ${(backgrounds || []).map(b => `
                                <option value="${b.index}" ${pgData.background === b.index ? 'selected' : ''}>${b.nome}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="pg-alignment">Allineamento</label>
                        <select id="pg-alignment" class="form-control">
                            <option value="">-- Seleziona --</option>
                            ${Object.keys(alignments || {}).map(a => `
                                <option value="${a}" ${pgData.alignment === a ? 'selected' : ''}>${a}</option>
                            `).join('')}
                        </select>
                    </div>
                </div>
            </div>
            
            ${renderRaceClassInfo(pgData, databases, traitsHtml)}
        </div>
    `;
}

console.log('📋 [PgStep1Identity] Modulo caricato.');
