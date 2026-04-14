/**
 * PgStep2Abilities.js
 * ─────────────────────────────────────────────────────────────
 * Renderizza lo Step 2 del wizard: Caratteristiche.
 * 
 * @author DM Tool
 * @version 2.0.0 - Aggiunta gestione ASI e separazione base/razziale/ASI
 */

import { 
    ABILITY_NAMES,
    ABILITY_KEY_TO_PROPERTY,
    calculateModifier,
    calculateAvailableASI
} from './PgConstants.js';

/**
 * Renderizza gli input per le caratteristiche
 * @param {Object} pgData - Dati del personaggio
 * @param {Array} racialBonuses - Bonus razziali alle caratteristiche
 * @param {Object} databases - Database con classe e razza selezionata
 * @returns {string} HTML degli input
 */
function renderAbilityInputs(pgData, racialBonuses, databases) {
    const keys = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    
    // Calcola ASI disponibili
    const totalASI = calculateAvailableASI(databases.selectedClass, pgData.level || 1);
    const asiBonuses = pgData._asiBonuses || {};
    const usedASI = Object.values(asiBonuses).reduce((sum, v) => sum + (v || 0), 0);
    const remainingASI = totalASI - usedASI;
    
    return keys.map(key => {
        const property = ABILITY_KEY_TO_PROPERTY[key];
        const baseScore = pgData.abilities?.[property] || 10;
        const racialBonus = racialBonuses.find(b => b.ability_score?.index === key)?.bonus || 0;
        const asiBonus = asiBonuses[property] || 0;
        const totalScore = baseScore + racialBonus + asiBonus;
        const modifier = calculateModifier(totalScore);
        
        return `
            <div class="ability-box">
                <label class="ability-label">${ABILITY_NAMES[key]} (${key.toUpperCase()})</label>
                <div class="ability-input-group">
                    <button class="btn btn-mini" data-ability="${key}" data-action="decrease">−</button>
                    <input type="number" id="ability-${key}" value="${baseScore}" min="1" max="20" class="ability-input">
                    <button class="btn btn-mini" data-ability="${key}" data-action="increase">+</button>
                </div>
                <div class="ability-bonuses-row">
                    ${racialBonus !== 0 ? `<div class="racial-bonus">Razza: ${racialBonus > 0 ? '+' : ''}${racialBonus}</div>` : ''}
                    ${totalASI > 0 ? `
                        <div class="asi-bonus" title="Bonus da miglioramento caratteristica (livello)">
                            <span class="asi-label">ASI:</span>
                            <button class="btn btn-mini btn-asi" data-asi-ability="${key}" data-asi-action="decrease">−</button>
                            <span class="asi-bonus-value">${asiBonus > 0 ? '+' + asiBonus : '0'}</span>
                            <button class="btn btn-mini btn-asi" data-asi-ability="${key}" data-asi-action="increase">+</button>
                        </div>
                    ` : ''}
                </div>
                <div class="ability-result">
                    <span class="total">Tot: ${totalScore}</span>
                    <span class="mod ${modifier >= 0 ? 'pos' : 'neg'}">${modifier >= 0 ? '+' : ''}${modifier}</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Renderizza il pannello ASI (se il livello lo prevede)
 */
function renderASIPanel(pgData, databases) {
    const totalASI = calculateAvailableASI(databases.selectedClass, pgData.level || 1);
    
    if (totalASI <= 0) return '';
    
    const asiBonuses = pgData._asiBonuses || {};
    const usedASI = Object.values(asiBonuses).reduce((sum, v) => sum + (v || 0), 0);
    const remainingASI = totalASI - usedASI;
    
    // Conta i livelli ASI
    const classData = databases.selectedClass;
    let asiLevels = [];
    if (classData?.tabella_progressione) {
        classData.tabella_progressione.forEach((lvl, i) => {
            if (lvl.privilegi?.some(p => p.includes('Aumento dei Punteggi di Caratteristica'))) {
                asiLevels.push(lvl.livello || i + 1);
            }
        });
    }
    // Solo livelli fino al livello del PG
    const pgLevel = pgData.level || 1;
    const relevantLevels = asiLevels.filter(l => l <= pgLevel);
    
    return `
        <div class="asi-panel">
            <h4>📈 Miglioramento Punteggi di Caratteristica</h4>
            <p class="asi-description">
                Il tuo livello ti concede <strong>${totalASI} punti</strong> da distribuire 
                (+2 a una caratteristica o +1 a due per ogni ASI guadagnato).
                ${relevantLevels.length > 0 ? ` ASI ai livelli: ${relevantLevels.join(', ')}` : ''}
            </p>
            <div class="asi-points-display">
                <span class="asi-points-label">Punti rimanenti:</span>
                <span class="asi-remaining ${remainingASI === 0 ? 'asi-exhausted' : 'asi-available'}">${remainingASI}/${totalASI}</span>
            </div>
            <p class="asi-hint">Usa i pulsanti <strong>−/+</strong> accanto a "ASI" per ogni caratteristica.</p>
        </div>
    `;
}

/**
 * Renderizza l'anteprima dei punti ferita
 * @param {Object} pgData - Dati del personaggio
 * @param {Object} databases - Database con classe selezionata
 * @returns {string} HTML dell'anteprima HP
 */
function renderHpPreview(pgData, databases) {
    const { selectedClass } = databases;
    if (!selectedClass) return '<div class="hp-preview disabled"><p>Seleziona una classe</p></div>';
    
    const hitDieSize = selectedClass.hit_die || parseInt(selectedClass.dado_vita?.replace('d', '') || 8);
    const racialBonuses = databases.selectedRace?.ability_bonuses || [];
    const asiBonuses = pgData._asiBonuses || {};
    const constitutionBase = pgData.abilities?.constitution || 10;
    const racialCon = racialBonuses.find(b => b.ability_score?.index === 'con')?.bonus || 0;
    const asiCon = asiBonuses.constitution || 0;
    const totalCon = constitutionBase + racialCon + asiCon;
    const conMod = calculateModifier(totalCon);
    const level = pgData.level || 1;
    const avgPerLevel = Math.floor(hitDieSize / 2) + 1;
    const calculatedHp = hitDieSize + (avgPerLevel * (level - 1)) + (conMod * level);
    
    // Usa sempre il valore calcolato come default nel box
    // L'utente può modificare manualmente se necessario
    const displayHp = calculatedHp;
    
    return `
        <div class="hp-preview">
            <h4>❤️ Punti Ferita</h4>
            <div class="hp-edit-row">
                <div class="hp-calc">
                    <span class="hp-formula">Calcolati: ${calculatedHp} PF (d${hitDieSize} + ${conMod >= 0 ? '+' : ''}${conMod} COS × ${level})</span>
                </div>
                <div class="hp-manual">
                    <label for="pg-max-hp">PF Massimi (editabile):</label>
                    <input type="number" id="pg-max-hp" value="${displayHp}" min="1" class="form-control hp-input">
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderizza lo Step 2: Caratteristiche
 * @param {Object} pgData - Dati del personaggio
 * @param {Object} databases - Database con razza, classe, etc.
 * @returns {string} HTML dello step
 */
export function renderStep2Abilities(pgData, databases) {
    const { selectedRace } = databases;
    const bonuses = selectedRace?.ability_bonuses || [];
    
    return `
        <div class="wizard-form">
            <div class="form-section">
                <h3>Punteggi Caratteristica</h3>
                <p class="form-description">Inserisci i punteggi base. I bonus razziali e i miglioramenti da livello sono applicati automaticamente.</p>
                
                ${renderASIPanel(pgData, databases)}
                
                <div class="abilities-grid">
                    ${renderAbilityInputs(pgData, bonuses, databases)}
                </div>
            </div>
            
            ${renderHpPreview(pgData, databases)}
            
            <div class="ability-roll-section">
                <button class="btn btn-secondary btn-sm" id="btn-roll-abilities">🎲 Genera Casuali</button>
                <button class="btn btn-secondary btn-sm" id="btn-standard-array">📊 Standard Array</button>
            </div>
        </div>
    `;
}

console.log('📋 [PgStep2Abilities] Modulo caricato (v2.0.0).');
