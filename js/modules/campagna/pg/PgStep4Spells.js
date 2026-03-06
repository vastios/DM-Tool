/**
 * PgStep4Spells.js
 * ─────────────────────────────────────────────────────────────
 * Renderizza lo Step 4 del wizard: Incantesimi.
 * 
 * @author DM Tool
 * @version 1.0.0
 */

import { calculateModifier } from './PgConstants.js';
import { 
    spellLevelsByClass, 
    getMaxSpellLevel,
    getCasterType,
    getCasterTypeDescription,
    getMaxSpellsKnown,
    isKnownCaster,
    isPreparedCaster,
    getSpellSlots
} from '/database/classSpells.js';

// Mappatura indici classi (inglese) -> nomi italiani (solo incantatori)
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
 * Ottiene l'etichetta del tipo di incantatore
 * @param {string} casterType - Tipo di incantatore
 * @returns {string} Etichetta localizzata
 */
function getCasterTypeLabel(casterType) {
    const labels = {
        'pact': '🔮 Pact Magic',
        'known': '📚 Incantesimi Conosciuti',
        'prepared': '📖 Incantesimi Preparati',
        'none': '⚔️ Non Incantatore'
    };
    return labels[casterType] || 'Sconosciuto';
}

/**
 * Ottiene la caratteristica da usare per incantesimi per una classe
 * @param {string} classNameIt - Nome italiano della classe
 * @returns {string} Nome della caratteristica
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
 * Converte il nome della caratteristica nella chiave della proprietà
 * @param {string} abilityName - Nome della caratteristica
 * @returns {string} Chiave della proprietà
 */
function abilityNameToKey(abilityName) {
    const mapping = {
        'strength': 'strength',
        'dexterity': 'dexterity',
        'constitution': 'constitution',
        'intelligence': 'intelligence',
        'wisdom': 'wisdom',
        'charisma': 'charisma'
    };
    return mapping[abilityName] || 'intelligence';
}

/**
 * Ottiene il numero massimo di trucchetti conosciuti per classe e livello
 * @param {string} className - Nome della classe
 * @param {number} pgLevel - Livello del personaggio
 * @returns {number|null} Numero massimo di trucchetti o null
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
 * Trova il livello PG necessario per un livello incantesimo
 * @param {string} className - Nome della classe
 * @param {number} spellLevel - Livello dell'incantesimo
 * @returns {number|string} Livello richiesto o '?'
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
 * Renderizza lo Step 4: Incantesimi
 * @param {Object} pgData - Dati del personaggio
 * @param {Object} databases - Database con classe selezionata
 * @returns {string} HTML dello step
 */
export function renderStep4Spells(pgData, databases) {
    const { selectedClass } = databases;
    
    const classNameIt = CLASS_NAME_IT[selectedClass?.index];
    
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
    
    const knownSpells = pgData.spellcasting?.spellsKnown || [];
    const pgLevel = pgData.level || 1;
    const maxSpellLevel = getMaxSpellLevel(classNameIt, pgLevel);
    
    // Determina il tipo di incantatore
    const casterType = getCasterType(classNameIt);
    const casterDesc = getCasterTypeDescription(classNameIt);
    const maxKnown = getMaxSpellsKnown(classNameIt, pgLevel);
    const isKnown = isKnownCaster(classNameIt);
    const isPrepared = isPreparedCaster(classNameIt);
    
    // Ottieni gli slot incantesimi
    const spellSlots = getSpellSlots(classNameIt, pgLevel);
    
    // Conta incantesimi selezionati per livello
    const countByLevel = {};
    let totalCantrips = 0;
    let totalNonCantrips = 0;
    knownSpells.forEach(spell => {
        for (const [level, spells] of Object.entries(classSpellsByLevel)) {
            if (spells.includes(spell)) {
                countByLevel[level] = (countByLevel[level] || 0) + 1;
                if (parseInt(level) === 0) totalCantrips++;
                else totalNonCantrips++;
                break;
            }
        }
    });
    
    // Calcola trucchetti massimi
    const maxCantrips = getMaxCantripsKnown(classNameIt, pgLevel);
    
    // Calcola incantesimi preparati/preparabili per i preparatori
    const spellAbility = getSpellcastingAbilityForClass(classNameIt);
    const abilityKey = abilityNameToKey(spellAbility);
    const abilityScore = (pgData.abilities?.[abilityKey] || 10);
    const abilityMod = calculateModifier(abilityScore);
    const preparedCount = abilityMod + pgLevel;
    
    // Verifica se ha superato il limite
    const isOverLimit = maxKnown !== null && totalNonCantrips > maxKnown;
    const overBy = isOverLimit ? totalNonCantrips - maxKnown : 0;
    const isCantripsOver = maxCantrips !== null && totalCantrips > maxCantrips;
    const cantripsOverBy = isCantripsOver ? totalCantrips - maxCantrips : 0;
    
    // Etichette dei livelli
    const levelLabels = {
        0: 'Trucchetti',
        1: '1° Livello',
        2: '2° Livello',
        3: '3° Livello',
        4: '4° Livello',
        5: '5° Livello',
        6: '6° Livello',
        7: '7° Livello',
        8: '8° Livello',
        9: '9° Livello'
    };
    
    // Renderizza tabella slot incantesimi
    let slotsHtml = '';
    if (casterType !== 'none') {
        const slotsToShow = Object.entries(spellSlots)
            .filter(([level, count]) => count > 0 && parseInt(level) <= maxSpellLevel)
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
        
        if (slotsToShow.length > 0) {
            slotsHtml = `
                <div class="spell-slots-box">
                    <h4>🔮 Slot Incantesimi Disponibili</h4>
                    <div class="slots-grid">
                        ${slotsToShow.map(([level, count]) => `
                            <div class="slot-item">
                                <span class="slot-level">${levelLabels[level]}</span>
                                <span class="slot-count">${count}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    // Counter per trucchetti
    let counterHtml = '';
    if (maxCantrips !== null) {
        counterHtml += `
            <div class="spells-known-counter ${isCantripsOver ? 'over-limit' : ''}">
                <div class="counter-row">
                    <span class="counter-label">✨ Trucchetti:</span>
                    <span class="counter-value">
                        <strong>${totalCantrips}</strong> / ${maxCantrips}
                    </span>
                </div>
                ${isCantripsOver ? `
                    <div class="counter-warning">
                        ⚠️ Hai superato il limite di ${cantripsOverBy} trucchett${cantripsOverBy > 1 ? 'i' : 'o'}!
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // Counter incantesimi per classi "known" (Bardo, Stregone, Warlock)
    if (isKnown && maxKnown !== null) {
        counterHtml += `
            <div class="spells-known-counter ${isOverLimit ? 'over-limit' : ''}">
                <div class="counter-row">
                    <span class="counter-label">📚 Incantesimi Conosciuti:</span>
                    <span class="counter-value">
                        <strong>${totalNonCantrips}</strong> / ${maxKnown}
                    </span>
                </div>
                ${isOverLimit ? `
                    <div class="counter-warning">
                        ⚠️ Hai superato il limite di ${overBy} incantesim${overBy > 1 ? 'i' : 'o'}!
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // Per i preparatori (Mago, Chierico, Druido, Paladino, Ranger)
    if (isPrepared) {
        // Per il Mago: mostra incantesimi nel libro (INT mod + livello)
        if (classNameIt === 'Mago') {
            // Un Mago di 1° livello inizia con 6 incantesimi di 1° livello nel grimorio
            const startingSpells = pgLevel === 1 ? 6 : Math.max(1, preparedCount);
            counterHtml += `
                <div class="spells-prepared-info">
                    <div class="prepared-row">
                        <span class="prepared-label">📚 Incantesimi nel Grimorio (1° liv):</span>
                        <span class="prepared-value"><strong>${startingSpells}</strong></span>
                    </div>
                    <div class="prepared-row">
                        <span class="prepared-label">🔮 Incantesimi Preparabili:</span>
                        <span class="prepared-value"><strong>${Math.max(1, preparedCount)}</strong> (${pgLevel} liv + ${abilityMod >= 0 ? '+' : ''}${abilityMod} INT)</span>
                    </div>
                    <p class="prepared-hint">Seleziona ${startingSpells} incantesimi di 1° livello per il tuo grimorio. Puoi preparare ${Math.max(1, preparedCount)} incantesimi dopo un riposo lungo.</p>
                </div>
            `;
        } else {
            counterHtml += `
                <div class="spells-prepared-info">
                    <div class="prepared-row">
                        <span class="prepared-label">📖 Incantesimi Preparabili:</span>
                        <span class="prepared-value"><strong>${Math.max(1, preparedCount)}</strong> (${pgLevel} liv + ${abilityMod >= 0 ? '+' : ''}${abilityMod} ${spellAbility.substring(0, 3).toUpperCase()})</span>
                    </div>
                    <p class="prepared-hint">Puoi cambiare gli incantesimi preparati dopo un riposo lungo.</p>
                </div>
            `;
        }
    }
    
    // Renderizza sezioni per ogni livello accessibile
    let sectionsHtml = '';
    
    // Calcola limite per incantesimi di 1° livello per Mago
    const maxLevel1Spells = (classNameIt === 'Mago' && pgLevel === 1) ? 6 : null;
    const isOverLevel1 = maxLevel1Spells !== null && (countByLevel[1] || 0) > maxLevel1Spells;
    
    for (let level = 0; level <= maxSpellLevel; level++) {
        const spells = classSpellsByLevel[level] || [];
        if (spells.length === 0) continue;
        
        const selectedCount = countByLevel[level] || 0;
        const slotsForLevel = spellSlots[level] || 0;
        
        // Per ogni livello, mostra il max selezionabile
        let maxForLevel = spells.length;
        if (level === 0 && maxCantrips !== null) {
            maxForLevel = maxCantrips;
        } else if (level === 1 && maxLevel1Spells !== null) {
            maxForLevel = maxLevel1Spells;
        } else if (level > 0 && isKnown && maxKnown !== null) {
            // Per known casters, non c'è un limite per livello ma un totale
            maxForLevel = null;
        }
        
        let counterText = '';
        if (level === 0) {
            counterText = `<span class="spells-counter ${isCantripsOver ? 'over-limit' : ''}">Selezionati: <strong>${selectedCount}</strong> / ${maxCantrips || '∞'}</span>`;
        } else if (level === 1 && maxLevel1Spells !== null) {
            counterText = `<span class="spells-counter ${isOverLevel1 ? 'over-limit' : ''}">Selezionati: <strong>${selectedCount}</strong> / ${maxLevel1Spells}</span>`;
        } else if (maxForLevel !== null) {
            counterText = `<span class="spells-counter">Selezionati: <strong>${selectedCount}</strong> / ${maxForLevel}</span>`;
        } else {
            counterText = `<span class="spells-counter">Selezionati: <strong>${selectedCount}</strong></span>`;
        }
        
        sectionsHtml += `
            <div class="spells-level-section">
                <div class="spells-level-header">
                    <h4>${levelLabels[level]}</h4>
                    ${counterText}
                    ${level > 0 && slotsForLevel > 0 ? `<span class="slots-badge">${slotsForLevel} slot</span>` : ''}
                </div>
                <div class="spells-level-grid">
                    ${spells.map(spellName => {
                        const isSelected = knownSpells.includes(spellName);
                        return `
                            <label class="spell-cb ${isSelected ? 'selected' : ''}">
                                <input type="checkbox" data-spell="${spellName}" data-level="${level}" ${isSelected ? 'checked' : ''}>
                                <span class="sk-name">${spellName}</span>
                            </label>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    // Livelli non ancora accessibili
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
                
                <div class="caster-type-info ${casterType}">
                    <span class="caster-type-badge">${getCasterTypeLabel(casterType)}</span>
                    <p class="caster-desc">${casterDesc}</p>
                </div>
                
                ${slotsHtml}
                ${counterHtml}
                
                <div class="spells-summary">
                    <p>Totale selezionati: <strong>${knownSpells.length}</strong> (${totalCantrips} trucchetti + ${totalNonCantrips} incantesimi)</p>
                    <p class="hint">Livello PG: ${pgLevel} | Livello incantesimi max: ${levelLabels[maxSpellLevel]}</p>
                </div>
                
                <div class="spells-accordion">
                    ${sectionsHtml}
                    ${lockedHtml}
                </div>
            </div>
        </div>
    `;
}

console.log('📋 [PgStep4Spells] Modulo caricato.');
