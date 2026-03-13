/**
 * PgStep4Spells.js
 * ─────────────────────────────────────────────────────────────
 * Renderizza lo Step 4 del wizard: Incantesimi.
 * 
 * TRUCCHETTI: Tutti gli incantatori selezionano quali conoscono (limite per classe)
 * INCANTESIMI 1+:
 *   - Known casters (Bardo, Stregone, Warlock): Selezionano conosciuti (limite totale)
 *   - Mago: Seleziona incantesimi grimorio (6 + 2/livello)
 *   - Prepared full (Chierico, Druido): Conoscono TUTTI → nessuna selezione
 *   - Half-casters (Paladino, Ranger): Conoscono TUTTI → nessuna selezione
 * 
 * @author DM Tool
 * @version 2.3.0 - Contatori aggiornabili in tempo reale
 */

import { calculateModifier } from './PgConstants.js';
import { 
    spellLevelsByClass, 
    getMaxSpellLevel,
    getCasterType,
    getCasterTypeDescription,
    getMaxSpellsKnown,
    isKnownCaster,
    isPreparedCaster
} from '/database/classSpells.js';

// Mappatura indizi classi (inglese) -> nomi italiani
const CLASS_NAME_IT = {
    'bard': 'Bardo',
    'cleric': 'Chierico',
    'druid': 'Druido',
    'paladin': 'Paladino',
    'ranger': 'Ranger',
    'sorcerer': 'Stregone',
    'warlock': 'Warlock',
    'wizard': 'Mago'
};

/**
 * Ottiene la caratteristica da usare per incantesimi per una classe
 */
function getSpellcastingAbilityForClass(classNameIt) {
    const mapping = {
        'Bardo': 'charisma',
        'Chierico': 'wisdom',
        'Druido': 'wisdom',
        'Mago': 'intelligence',
        'Paladino': 'charisma',
        'Ranger': 'wisdom',
        'Stregone': 'charisma',
        'Warlock': 'charisma'
    };
    return mapping[classNameIt] || 'intelligence';
}

/**
 * Ottiene il numero massimo di trucchetti conosciuti per classe e livello
 */
function getMaxCantripsKnown(className, pgLevel) {
    const cantripsByLevel = {
        'Bardo': { 1: 2, 4: 3, 10: 4 },
        'Chierico': { 1: 3 },
        'Druido': { 1: 2 },
        'Mago': { 1: 3, 10: 4 },
        'Paladino': null,
        'Ranger': null,
        'Stregone': { 1: 4 },
        'Warlock': { 1: 2, 4: 3, 10: 4 }
    };
    
    const classData = cantripsByLevel[className];
    if (classData === null || classData === undefined) return null;
    
    const levels = Object.keys(classData).map(Number).sort((a, b) => b - a);
    for (const lvl of levels) {
        if (pgLevel >= lvl) return classData[lvl];
    }
    return classData[1] || null;
}

/**
 * Ottiene il numero di incantesimi nel grimorio per il Mago
 */
function getWizardSpellbookCount(pgLevel) {
    return 6 + (pgLevel - 1) * 2;
}

/**
 * Trova il livello PG necessario per un livello incantesimo
 */
function getLevelForSpellLevel(className, spellLevel) {
    for (let lvl = 1; lvl <= 20; lvl++) {
        if (getMaxSpellLevel(className, lvl) >= spellLevel) {
            return lvl;
        }
    }
    return '?';
}

/**
 * Renderizza il counter box con ID per aggiornamento JS
 */
function renderCounterBox(id, icon, title, current, max, showWarning = true) {
    const isOver = current > max;
    const isAtLimit = current === max;
    
    return `
        <div id="${id}" class="spell-counter-box ${isOver ? 'over-limit' : isAtLimit ? 'at-limit' : ''}">
            <div class="counter-header">
                <span class="counter-icon">${icon}</span>
                <span class="counter-title">${title}</span>
            </div>
            <div class="counter-values">
                <span class="counter-current">${current}</span>
                <span class="counter-separator">/</span>
                <span class="counter-max">${max}</span>
            </div>
            <div class="counter-hint">
                ${isOver ? `⚠️ Superato di ${current - max}!` : 
                  isAtLimit ? '✓ Limite raggiunto' : 
                  `Puoi sceglierne altri ${max - current}`}
            </div>
        </div>
    `;
}

/**
 * Renderizza lo Step 4 per PREPARED CASTERS (Chierico, Druido, Paladino, Ranger)
 * Solo trucchetti selezionabili, incantesimi in sola lettura
 */
function renderPreparedCasterView(classNameIt, pgLevel, classSpellsByLevel, maxSpellLevel, knownSpells) {
    const spellAbility = getSpellcastingAbilityForClass(classNameIt);
    const abilityNames = { 'intelligence': 'INT', 'wisdom': 'SAG', 'charisma': 'CAR' };
    const abbr = abilityNames[spellAbility] || 'INT';
    
    const maxCantrips = getMaxCantripsKnown(classNameIt, pgLevel);
    
    // Conta trucchetti selezionati
    const cantrips = classSpellsByLevel[0] || [];
    const selectedCantrips = knownSpells.filter(s => cantrips.includes(s));
    const cantripsCount = selectedCantrips.length;
    
    // Info specifiche per classe
    let classInfo = '';
    if (classNameIt === 'Chierico' || classNameIt === 'Druido') {
        classInfo = `
            <div class="prepared-info-box">
                <h4>📖 Come funzionano gli incantesimi</h4>
                <ul>
                    <li><strong>Conosci TUTTI</strong> gli incantesimi della tua lista</li>
                    <li>Dopo un <strong>riposo lungo</strong> prepari: ${pgLevel} + mod ${abbr}</li>
                    <li>La gestione della preparazione avverrà <strong>in-game</strong></li>
                </ul>
            </div>
        `;
    } else if (classNameIt === 'Paladino' || classNameIt === 'Ranger') {
        classInfo = `
            <div class="prepared-info-box">
                <h4>📖 Come funzionano gli incantesimi</h4>
                <ul>
                    <li><strong>Conosci TUTTI</strong> gli incantesimi accessibili</li>
                    <li>Dopo un <strong>riposo lungo</strong> prepari: ${pgLevel} + mod ${abbr}</li>
                    <li>La gestione della preparazione avverrà <strong>in-game</strong></li>
                </ul>
            </div>
        `;
    }
    
    // Level labels
    const levelLabels = {
        0: 'Trucchetti',
        1: '1° Livello', 2: '2° Livello', 3: '3° Livello',
        4: '4° Livello', 5: '5° Livello', 6: '6° Livello',
        7: '7° Livello', 8: '8° Livello', 9: '9° Livello'
    };
    
    // Sezione trucchetti (selezionabili)
    let cantripsSection = '';
    if (maxCantrips !== null && cantrips.length > 0) {
        const isOver = cantripsCount > maxCantrips;
        
        cantripsSection = `
            <div class="spells-level-section" data-level="0">
                <div class="spells-level-header">
                    <h4>✨ ${levelLabels[0]}</h4>
                    <span class="level-counter ${isOver ? 'over-limit' : cantripsCount === maxCantrips ? 'at-limit' : ''}">
                        <strong class="level-count">${cantripsCount}</strong> / ${maxCantrips}
                    </span>
                </div>
                ${isOver ? `<div class="level-warning">⚠️ Superato il limite di ${maxCantrips}!</div>` : ''}
                <div class="spells-level-grid">
                    ${cantrips.map(spellName => `
                        <label class="spell-cb ${knownSpells.includes(spellName) ? 'selected' : ''}">
                            <input type="checkbox" data-spell="${spellName}" data-level="0" 
                                   ${knownSpells.includes(spellName) ? 'checked' : ''}>
                            <span class="sk-name">${spellName}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Sezioni incantesimi (sola lettura)
    let spellsSections = '';
    for (let level = 1; level <= maxSpellLevel; level++) {
        const spells = classSpellsByLevel[level] || [];
        if (spells.length === 0) continue;
        
        spellsSections += `
            <div class="spells-level-section readonly" data-level="${level}">
                <div class="spells-level-header">
                    <h4>${levelLabels[level]}</h4>
                    <span class="level-counter auto-known">✓ Conosciuti automaticamente</span>
                </div>
                <div class="spells-list-readonly">
                    ${spells.map(s => `<span class="spell-tag-readonly">${s}</span>`).join('')}
                </div>
            </div>
        `;
    }
    
    return `
        <div class="wizard-form">
            <div class="form-section">
                <h3>🔮 Incantesimi di ${classNameIt}</h3>
                
                <div class="caster-type-info prepared">
                    <span class="caster-type-badge">📖 Incantesimi Preparati</span>
                    <p class="caster-desc">${getCasterTypeDescription(classNameIt)}</p>
                </div>
                
                ${classInfo}
                
                ${maxCantrips !== null ? `
                    <div class="spells-counters-container">
                        ${renderCounterBox('cantrips-counter', '✨', 'Trucchetti', cantripsCount, maxCantrips)}
                    </div>
                ` : ''}
                
                <div class="spells-accordion">
                    ${cantripsSection}
                    ${spellsSections}
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderizza lo Step 4 per KNOWN CASTERS e MAGO
 * Selezione attiva di trucchetti e incantesimi
 */
function renderKnownCasterView(classNameIt, pgLevel, classSpellsByLevel, maxSpellLevel, knownSpells, maxKnown) {
    const maxCantrips = getMaxCantripsKnown(classNameIt, pgLevel);
    
    // Conta selezionati
    const cantrips = classSpellsByLevel[0] || [];
    const selectedCantrips = knownSpells.filter(s => cantrips.includes(s));
    const cantripsCount = selectedCantrips.length;
    
    // Conta incantesimi (non trucchetti)
    let spellsCount = 0;
    for (let level = 1; level <= 9; level++) {
        const spells = classSpellsByLevel[level] || [];
        spellsCount += knownSpells.filter(s => spells.includes(s)).length;
    }
    
    // Level labels
    const levelLabels = {
        0: 'Trucchetti',
        1: '1° Livello', 2: '2° Livello', 3: '3° Livello',
        4: '4° Livello', 5: '5° Livello', 6: '6° Livello',
        7: '7° Livello', 8: '8° Livello', 9: '9° Livello'
    };
    
    // Badge tipo
    const isWizard = classNameIt === 'Mago';
    const badgeIcon = isWizard ? '📖' : '📚';
    const badgeText = isWizard ? 'Grimorio del Mago' : 'Incantesimi Conosciuti';
    
    // Contatori
    let countersHtml = '<div class="spells-counters-container">';
    
    // Counter trucchetti
    if (maxCantrips !== null) {
        countersHtml += renderCounterBox('cantrips-counter', '✨', 'Trucchetti', cantripsCount, maxCantrips);
    }
    
    // Counter incantesimi
    if (maxKnown !== null) {
        const icon = isWizard ? '📖' : '📚';
        const title = isWizard ? 'Grimorio' : 'Incantesimi Conosciuti';
        countersHtml += renderCounterBox('spells-counter', icon, title, spellsCount, maxKnown);
    }
    
    countersHtml += '</div>';
    
    // Riepilogo
    const summaryHtml = `
        <div class="spells-summary" id="spells-summary">
            <p>Selezionati: <strong class="total-count">${knownSpells.length}</strong> 
               (<span class="cantrips-total">${cantripsCount}</span> trucchetti + <span class="spells-total">${spellsCount}</span> incantesimi)</p>
            <p class="hint">Livello PG: ${pgLevel} | Max: ${levelLabels[maxSpellLevel]}</p>
        </div>
    `;
    
    // Sezioni incantesimi
    let sectionsHtml = '';
    
    // Trucchetti
    if (cantrips.length > 0 && maxCantrips !== null) {
        const isOver = cantripsCount > maxCantrips;
        
        sectionsHtml += `
            <div class="spells-level-section" data-level="0">
                <div class="spells-level-header">
                    <h4>✨ ${levelLabels[0]}</h4>
                    <span class="level-counter ${isOver ? 'over-limit' : cantripsCount === maxCantrips ? 'at-limit' : ''}">
                        <strong class="level-count">${cantripsCount}</strong> / ${maxCantrips}
                    </span>
                </div>
                ${isOver ? `<div class="level-warning">⚠️ Superato il limite di ${maxCantrips}!</div>` : ''}
                <div class="spells-level-grid">
                    ${cantrips.map(spellName => `
                        <label class="spell-cb ${knownSpells.includes(spellName) ? 'selected' : ''}">
                            <input type="checkbox" data-spell="${spellName}" data-level="0" 
                                   ${knownSpells.includes(spellName) ? 'checked' : ''}>
                            <span class="sk-name">${spellName}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Incantesimi per livello
    for (let level = 1; level <= maxSpellLevel; level++) {
        const spells = classSpellsByLevel[level] || [];
        if (spells.length === 0) continue;
        
        const levelSelected = knownSpells.filter(s => spells.includes(s));
        const levelCount = levelSelected.length;
        
        sectionsHtml += `
            <div class="spells-level-section" data-level="${level}">
                <div class="spells-level-header">
                    <h4>${levelLabels[level]}</h4>
                    <span class="level-counter">
                        Selezionati: <strong class="level-count">${levelCount}</strong>
                    </span>
                </div>
                <div class="spells-level-grid">
                    ${spells.map(spellName => `
                        <label class="spell-cb ${knownSpells.includes(spellName) ? 'selected' : ''}">
                            <input type="checkbox" data-spell="${spellName}" data-level="${level}" 
                                   ${knownSpells.includes(spellName) ? 'checked' : ''}>
                            <span class="sk-name">${spellName}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Livelli bloccati
    let lockedHtml = '';
    for (let level = maxSpellLevel + 1; level <= 9; level++) {
        const spells = classSpellsByLevel[level] || [];
        if (spells.length === 0) continue;
        
        lockedHtml += `
            <div class="spells-level-section locked">
                <div class="spells-level-header">
                    <h4>🔒 ${levelLabels[level]}</h4>
                    <span class="spells-locked-hint">Disponibile dal livello ${getLevelForSpellLevel(classNameIt, level)}</span>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="wizard-form">
            <div class="form-section">
                <h3>🔮 Incantesimi di ${classNameIt}</h3>
                
                <div class="caster-type-info ${isWizard ? 'wizard' : 'known'}">
                    <span class="caster-type-badge">${badgeIcon} ${badgeText}</span>
                    <p class="caster-desc">${getCasterTypeDescription(classNameIt)}</p>
                </div>
                
                ${countersHtml}
                ${summaryHtml}
                
                <div class="spells-accordion">
                    ${sectionsHtml}
                    ${lockedHtml}
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderizza lo Step 4: Incantesimi
 */
export function renderStep4Spells(pgData, databases) {
    const { selectedClass } = databases;
    const classNameIt = CLASS_NAME_IT[selectedClass?.index];
    
    // Verifica se è un incantatore
    if (!selectedClass || !classNameIt) {
        return `
            <div class="wizard-form">
                <div class="info-box">
                    <h4>⚔️ Non Incantatore</h4>
                    <p>La classe selezionata non è un'incantatrice. Procedi oltre.</p>
                </div>
            </div>
        `;
    }
    
    const classSpellsByLevel = spellLevelsByClass[classNameIt];
    
    if (!classSpellsByLevel || Object.keys(classSpellsByLevel).length === 0) {
        return `
            <div class="wizard-form">
                <div class="warning-box">
                    <h4>⚠️ Incantesimi non trovati</h4>
                    <p>Non ci sono incantesimi definiti per ${classNameIt}.</p>
                </div>
            </div>
        `;
    }
    
    const pgLevel = pgData.level || 1;
    const maxSpellLevel = getMaxSpellLevel(classNameIt, pgLevel);
    const knownSpells = pgData.spellcasting?.spellsKnown || [];
    
    // Determina tipo
    const isKnown = isKnownCaster(classNameIt);
    const isPrepared = isPreparedCaster(classNameIt);
    const maxKnown = isKnown ? getMaxSpellsKnown(classNameIt, pgLevel) : 
                   (classNameIt === 'Mago' ? getWizardSpellbookCount(pgLevel) : null);
    
    // Determina se seleziona incantesimi
    const selectSpells = isKnown || classNameIt === 'Mago';
    
    if (!selectSpells) {
        // Prepared casters: solo trucchetti selezionabili
        return renderPreparedCasterView(classNameIt, pgLevel, classSpellsByLevel, maxSpellLevel, knownSpells);
    }
    
    // Known casters + Mago: selezione attiva
    return renderKnownCasterView(classNameIt, pgLevel, classSpellsByLevel, maxSpellLevel, knownSpells, maxKnown);
}

console.log('📋 [PgStep4Spells] Modulo caricato v2.3.0');
