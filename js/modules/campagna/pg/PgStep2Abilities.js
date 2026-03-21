/**
 * PgStep2Abilities.js
 * ─────────────────────────────────────────────────────────────
 * Renderizza lo Step 2 del wizard: Caratteristiche.
 * 
 * @author DM Tool
 * @version 1.0.0
 */

import { 
    ABILITY_NAMES,
    ABILITY_KEY_TO_PROPERTY,
    calculateModifier 
} from './PgConstants.js';

/**
 * Renderizza gli input per le caratteristiche
 * @param {Object} pgData - Dati del personaggio
 * @param {Array} racialBonuses - Bonus razziali alle caratteristiche
 * @returns {string} HTML degli input
 */
function renderAbilityInputs(pgData, racialBonuses) {
    const keys = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    
    return keys.map(key => {
        const property = ABILITY_KEY_TO_PROPERTY[key];
        const baseScore = pgData.abilities?.[property] || 10;
        const bonus = racialBonuses.find(b => b.ability_score?.index === key)?.bonus || 0;
        const totalScore = baseScore + bonus;
        const modifier = calculateModifier(totalScore);
        
        return `
            <div class="ability-box">
                <label class="ability-label">${ABILITY_NAMES[key]} (${key.toUpperCase()})</label>
                <div class="ability-input-group">
                    <button class="btn btn-mini" data-ability="${key}" data-action="decrease">−</button>
                    <input type="number" id="ability-${key}" value="${baseScore}" min="1" max="20" class="ability-input">
                    <button class="btn btn-mini" data-ability="${key}" data-action="increase">+</button>
                </div>
                ${bonus !== 0 ? `<div class="racial-bonus">Razza: ${bonus > 0 ? '+' : ''}${bonus}</div>` : ''}
                <div class="ability-result">
                    <span class="total">Tot: ${totalScore}</span>
                    <span class="mod ${modifier >= 0 ? 'pos' : 'neg'}">${modifier >= 0 ? '+' : ''}${modifier}</span>
                </div>
            </div>
        `;
    }).join('');
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
    const conMod = calculateModifier(pgData.abilities?.constitution || 10);
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
                <p class="form-description">Inserisci i punteggi base. I bonus razziali sono applicati automaticamente.</p>
                
                <div class="abilities-grid">
                    ${renderAbilityInputs(pgData, bonuses)}
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

console.log('📋 [PgStep2Abilities] Modulo caricato.');
