/**
 * PgStep3Proficiencies.js
 * ─────────────────────────────────────────────────────────────
 * Renderizza lo Step 3 del wizard: Competenze.
 * 
 * @author DM Tool
 * @version 1.0.0
 */

import { 
    ABILITY_NAMES,
    PROPERTY_TO_ABILITY_KEY,
    SKILL_ABILITY_MAP,
    ALL_SKILLS,
    calculateModifier 
} from './PgConstants.js';

// Lingue standard D&D 5e (SRD)
const STANDARD_LANGUAGES = [
    'Comune', 'Elfico', 'Nanico', 'Gigante', 'Gnomo', 'Goblin', 'Halfling',
    'Orchesco', 'Abissale', 'Celestiale', 'Draconico', 'Primordiale',
    'Sylvano', 'Sottocomune', 'Infernale'
];

/**
 * Renderizza una lista di competenze come tag
 * @param {Array} items - Lista di competenze
 * @returns {string} HTML dei tag
 */
function renderProfList(items) {
    if (!items || items.length === 0) {
        return '<span class="no-prof">Nessuna</span>';
    }
    return items.map(item => `<span class="prof-tag auto">✓ ${item}</span>`).join('');
}

/**
 * Estrae le abilità disponibili dalla scelta di competenza della classe
 * @param {Object} proficiencyChoice - Oggetto proficiency_choices della classe
 * @returns {Array} Lista di abilità disponibili
 */
function extractAvailableSkills(proficiencyChoice) {
    if (!proficiencyChoice?.from?.options) return ALL_SKILLS;
    return proficiencyChoice.from.options
        .map(opt => (opt.item?.name || '').replace('Abilità: ', '').trim())
        .filter(name => name && SKILL_ABILITY_MAP[name]);
}

/**
 * Renderizza lo Step 3: Competenze
 * @param {Object} pgData - Dati del personaggio
 * @param {Object} databases - Database con classe, razza, background
 * @returns {string} HTML dello step
 */
export function renderStep3Proficiencies(pgData, databases) {
    const { selectedClass, selectedRace, selectedBackground } = databases;
    
    if (!selectedClass) {
        return '<div class="wizard-form"><div class="warning-box"><p>⚠️ Seleziona prima una classe.</p></div></div>';
    }
    
    // Estrai competenze dal background (con controllo tipo)
    const bgSkills = Array.isArray(selectedBackground?.competenze?.abilita) 
        ? selectedBackground.competenze.abilita : [];
    const bgTools = Array.isArray(selectedBackground?.competenze?.strumenti) 
        ? selectedBackground.competenze.strumenti : [];
    
    // Estrai competenze dalla classe (con controllo tipo)
    const classArmor = Array.isArray(selectedClass.competenze?.armature) 
        ? selectedClass.competenze.armature : [];
    const classWeapons = Array.isArray(selectedClass.competenze?.armi) 
        ? selectedClass.competenze.armi : [];
    const classTools = Array.isArray(selectedClass.competenze?.strumenti) 
        ? selectedClass.competenze.strumenti : [];
    
    // Competenze abilità dalla classe (da selezionare)
    const numChoices = selectedClass.proficiency_choices?.[0]?.choose || 2;
    const availableSkills = extractAvailableSkills(selectedClass.proficiency_choices?.[0]);
    
    // Skill selezionate dall'utente
    const selectedSkills = pgData.skills || [];
    // Escludi le skill del background dal conteggio classe
    const userSelectedCount = selectedSkills.filter(s => !bgSkills.includes(s)).length;
    
    // Calcola bonus competenza
    const profBonus = pgData.proficiencyBonus || 2;
    
    return `
        <div class="wizard-form">
            <div class="step3-two-column">
                <!-- COLONNA SINISTRA: Competenze base -->
                <div>
                    <!-- Tiri Salvezza -->
                    <div class="form-section">
                        <h3>🛡️ Tiri Salvezza</h3>
                        <div class="prof-list">
                            ${(selectedClass.saving_throws || []).map(st => `
                                <span class="prof-tag auto">✓ ${st.name}</span>
                            `).join('') || 
                            (selectedClass.competenze?.tiri_salvezza || []).map(ts => `
                                <span class="prof-tag auto">✓ ${ts}</span>
                            `).join('') || '<span class="no-prof">Nessuno</span>'}
                        </div>
                    </div>
                    
                    <!-- Armature e Scudi -->
                    <div class="form-section">
                        <h3>🦺 Armature e Scudi</h3>
                        <div class="prof-list">
                            ${renderProfList(classArmor)}
                        </div>
                    </div>
                    
                    <!-- Armi -->
                    <div class="form-section">
                        <h3>⚔️ Armi</h3>
                        <div class="prof-list">
                            ${renderProfList(classWeapons)}
                        </div>
                    </div>
                    
                    <!-- Strumenti -->
                    <div class="form-section">
                        <h3>🔧 Strumenti</h3>
                        ${bgTools.length > 0 ? `
                            <div class="prof-subsection">
                                <span class="sub-label">📖 Dal Background:</span>
                                <div class="prof-list inline">
                                    ${bgTools.map(t => `<span class="prof-tag background">✓ ${t}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        ${classTools.length > 0 && !classTools.includes('Nessuno') ? `
                            <div class="prof-subsection">
                                <span class="sub-label">⚔️ Dalla Classe:</span>
                                <div class="prof-list inline">
                                    ${classTools.map(t => `<span class="prof-tag auto">✓ ${t}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        ${bgTools.length === 0 && (classTools.length === 0 || classTools.includes('Nessuno')) ? `
                            <p class="no-prof">Nessuna competenza in strumenti</p>
                        ` : ''}
                    </div>
                </div>
                
                <!-- COLONNA DESTRA: Abilità -->
                <div>
                    <!-- Abilità -->
                    <div class="form-section">
                        <h3>🎯 Abilità</h3>
                        
                        ${bgSkills.length > 0 ? `
                            <div class="bg-skills-info">
                                <span class="bg-label">📖 Dal Background (${selectedBackground?.nome || ''}):</span>
                                <div class="bg-skills-list">
                                    ${bgSkills.map(s => `<span class="prof-tag background">✓ ${s}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="skill-counter-box ${userSelectedCount > numChoices ? 'over-limit' : ''}">
                            <div class="counter-label">Competenze da classe (scegli ${numChoices}):</div>
                            <div class="counter-value">
                                <span class="selected-num">${userSelectedCount}</span>
                                <span class="separator">/</span>
                                <span class="max-num">${numChoices}</span>
                            </div>
                            ${userSelectedCount > numChoices ? `<span class="counter-warning">⚠️ ${userSelectedCount - numChoices} oltre il limite</span>` : ''}
                        </div>
                        
                        <div class="skills-grid with-bonus">
                            ${availableSkills.map(skill => {
                                const skillIndex = selectedSkills.indexOf(skill);
                                const isSelectedByUser = skillIndex !== -1;
                                const isFromBackground = bgSkills.includes(skill);
                                const isDoubleProf = isFromBackground && isSelectedByUser;
                                
                                const ability = SKILL_ABILITY_MAP[skill];
                                const abilityKey = PROPERTY_TO_ABILITY_KEY[ability];
                                const racialBonus = (selectedRace?.ability_bonuses || []).find(b => b.ability_score?.index === abilityKey)?.bonus || 0;
                                const asiBonus = pgData._asiBonuses?.[ability] || 0;
                                const abilityScore = (pgData.abilities?.[ability] || 10) + racialBonus + asiBonus;
                                const abilityMod = calculateModifier(abilityScore);
                                
                                const isProficient = isFromBackground || isSelectedByUser;
                                const totalBonus = abilityMod + (isProficient ? profBonus : 0);
                                
                                let skillClass = '';
                                if (isDoubleProf) {
                                    skillClass = 'double-prof';
                                } else if (isFromBackground) {
                                    skillClass = 'from-background';
                                } else if (isSelectedByUser && skillIndex >= numChoices) {
                                    skillClass = 'over-limit';
                                } else if (isSelectedByUser) {
                                    skillClass = 'selected';
                                }
                                
                                const abbr = ABILITY_NAMES[ability]?.substring(0, 3).toUpperCase() || '';
                                
                                return `
                                    <label class="skill-cb ${skillClass}">
                                        <input type="checkbox" 
                                               data-skill="${skill}" 
                                               ${isSelectedByUser || isFromBackground ? 'checked' : ''} 
                                               ${isFromBackground ? 'disabled' : ''}>
                                        <span class="sk-name">${skill}</span>
                                        <span class="sk-abbr">(${abbr})</span>
                                        <span class="sk-bonus ${totalBonus >= 0 ? 'pos' : 'neg'}">${totalBonus >= 0 ? '+' : ''}${totalBonus}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                        
                        <div class="skill-legend">
                            <span class="legend-item"><span class="dot green"></span> Da classe</span>
                            <span class="legend-item"><span class="dot blue"></span> Da background</span>
                            <span class="legend-item"><span class="dot purple"></span> Doppia competenza</span>
                            <span class="legend-item"><span class="dot orange"></span> Oltre limite</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Lingue (full width) -->
            <div class="form-section">
                <h3>🗣️ Lingue</h3>
                <div class="languages-row" style="margin-bottom: 0.75rem;">
                    <span style="font-size: 0.85rem; color: #aaa;">Automatiche: </span>
                    ${(selectedRace?.languages || []).map(l => `<span class="prof-tag auto">✓ ${l.name}</span>`).join('') || '<span class="no-prof">Comune</span>'}
                </div>
                <div class="form-group" style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                    <select id="pg-language-select" class="language-select">
                        <option value="">-- Seleziona una lingua --</option>
                        ${STANDARD_LANGUAGES.filter(l => 
                            !(selectedRace?.languages || []).some(rl => rl.name === l) &&
                            !(pgData.extraLanguagesArray || []).includes(l)
                        ).map(l => `<option value="${l}">${l}</option>`).join('')}
                    </select>
                    <button type="button" class="add-language-btn" id="add-language-btn">➕ Aggiungi</button>
                </div>
                <div id="extra-languages-list" style="margin-top: 0.5rem;">
                    ${(pgData.extraLanguagesArray || []).map((l, i) => 
                        `<span class="prof-tag" style="background: rgba(156,39,176,0.2); border-color: #9c27b0; color: #ce93d8; cursor: pointer;" data-remove-lang="${i}" title="Clicca per rimuovere">✓ ${l} ✕</span>`
                    ).join('')}
                </div>
                <!-- Input nascosto per compatibilità con salvataggio esistente -->
                <input type="hidden" id="pg-extra-languages" value="${pgData.extraLanguages || ''}">
            </div>
        </div>
    `;
}

console.log('📋 [PgStep3Proficiencies] Modulo caricato.');
