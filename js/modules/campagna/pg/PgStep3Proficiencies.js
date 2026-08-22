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
 * Estrae il numero di scelte e la lista di abilità disponibili dalla stringa
 * "competenze.abilita" della classe.
 * 
 * Esempi di formato nel database:
 * - "Scegli quattro abilità tra Acrobazia, Atletica, Furtività, ..."
 * - "Scegli due abilità tra: Addestrare Animali, Atletica, ..."
 * - "Scegli tre abilità qualsiasi" (Bardo → tutte)
 * - ["Atletica","Intimidire","Intuizione","Medicina","Persuasione","Religione"] (Paladino, array)
 * - ["Scegli due tra Intuizione, Medicina, Persuasione, Religione e Storia"] (Chierico, array con stringa)
 * 
 * @param {Object} selectedClass - La classe selezionata
 * @returns {Object} { numChoices: number, availableSkills: string[] }
 */
function parseClassSkills(selectedClass) {
    const abilita = selectedClass.competenze?.abilita;
    
    // Default: 2 scelte tra tutte le abilità
    if (!abilita) {
        return { numChoices: 2, availableSkills: ALL_SKILLS };
    }
    
    let text = '';
    
    // Gestione array (Paladino = array di stringhe, Chierico = array con una stringa)
    if (Array.isArray(abilita)) {
        if (abilita.length === 1 && typeof abilita[0] === 'string') {
            // Chierico: ["Scegli due tra Intuizione, Medicina, ..."]
            text = abilita[0];
        } else {
            // Paladino: ["Atletica","Intimidire",...] → scegli 2 tra queste
            return { numChoices: 2, availableSkills: abilita };
        }
    } else if (typeof abilita === 'string') {
        text = abilita;
    } else {
        return { numChoices: 2, availableSkills: ALL_SKILLS };
    }
    
    // Parse numero di scelte
    const numberWords = {
        'una': 1, 'uno': 1, 'un': 1, 'due': 2, 'tre': 3, 'quattro': 4, 'cinque': 5, 'sei': 6
    };
    
    let numChoices = 2; // default
    const numMatch = text.match(/scegli\s+(\w+)/i);
    if (numMatch) {
        const word = numMatch[1].toLowerCase();
        if (numberWords[word]) {
            numChoices = numberWords[word];
        } else if (/^\d+$/.test(word)) {
            numChoices = parseInt(word, 10);
        }
    }
    
    // Se dice "qualsiasi" (Bardo), usa tutte le abilità
    if (/qualsiasi|a tua scelta/i.test(text)) {
        return { numChoices, availableSkills: ALL_SKILLS };
    }
    
    // Estrai la lista di abilità dopo "tra" o "tra:"
    // Pattern: "Scegli N abilità tra: A, B, C, D"
    // o: "Scegli N tra A, B, C, D"
    const listMatch = text.match(/tra:?\s+(.+)$/i);
    if (!listMatch) {
        return { numChoices, availableSkills: ALL_SKILLS };
    }
    
    let listText = listMatch[1].trim();
    // Rimuovi "e " finale prima dell'ultima abilità
    listText = listText.replace(/\s+e\s+/g, ', ');
    // Dividi per virgola
    const skills = listText.split(/,\s*/)
        .map(s => s.trim())
        .filter(s => s && s.length > 2);
    
    // Normalizza nomi: mappa varianti al nome standard in SKILL_ABILITY_MAP
    const normalizedSkills = skills.map(s => normalizeSkillName(s)).filter(s => s);
    
    return { numChoices, availableSkills: normalizedSkills };
}

/**
 * Normalizza il nome di un'abilità per matchare SKILL_ABILITY_MAP.
 * Gestisce varianti come "Arcana" → "Arcano", "Indagine" → "Indagare",
 * "Intrattenere" → "Esibizione", "Addestrare animali" → "Addestrare Animali"
 */
function normalizeSkillName(name) {
    const nameLower = name.toLowerCase().trim();
    
    // Mappa varianti comuni
    const variants = {
        'arcana': 'Arcano',
        'indagine': 'Indagare',
        'intrattenere': 'Esibizione',
        'rapidità di mano': 'Rapidità di Mano',
        'addestrare animali': 'Addestrare Animali',
        'rapidita di mano': 'Rapidità di Mano',
    };
    
    if (variants[nameLower]) return variants[nameLower];
    
    // Cerca match case-insensitive nella mappa standard
    const match = ALL_SKILLS.find(s => s.toLowerCase() === nameLower);
    if (match) return match;
    
    // Cerca match parziale (es. "Arcana" matcha "Arcano")
    const partial = ALL_SKILLS.find(s => 
        s.toLowerCase().startsWith(nameLower.substring(0, 4)) ||
        s.toLowerCase().includes(nameLower)
    );
    if (partial) return partial;
    
    return null;
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
    const classSkillsData = parseClassSkills(selectedClass);
    const numChoices = classSkillsData.numChoices;
    const availableSkills = classSkillsData.availableSkills;
    
    // SRD 5e rules for skill proficiencies:
    // 1. Background skills are applied FIRST (always proficient, shown blue)
    // 2. Class skills: player chooses N from the class list
    // 3. If a background skill is ALSO in the class list, it's shown PURPLE
    //    and the player gets to choose an ADDITIONAL skill (replacement)
    // 4. Background skills NOT in the class list are still proficient (blue)
    //    but don't grant additional choices
    
    const allSelectedSkills = pgData.skills || [];
    
    // Background skills in class list (purple) - grant extra choice
    const bgInClassList = bgSkills.filter(s => availableSkills.includes(s));
    const numExtraChoices = bgInClassList.length;
    const effectiveNumChoices = numChoices + numExtraChoices;
    
    // Background skills NOT in class list (blue only, no extra choice)
    const bgNotInClassList = bgSkills.filter(s => !availableSkills.includes(s));
    
    // Skills chosen by the user (from class list, excluding background skills)
    const userSelectedSkills = allSelectedSkills.filter(s => 
        !bgSkills.includes(s) && availableSkills.includes(s)
    );
    const userSelectedCount = userSelectedSkills.length;
    
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
                        
                        <div class="skill-counter-box ${userSelectedCount > effectiveNumChoices ? 'over-limit' : ''}">
                            <div class="counter-label">Competenze da classe (scegli ${effectiveNumChoices}${numExtraChoices > 0 ? ` (${numChoices} + ${numExtraChoices} sostituzione background)` : ''}):</div>
                            <div class="counter-value">
                                <span class="selected-num">${userSelectedCount}</span>
                                <span class="separator">/</span>
                                <span class="max-num">${effectiveNumChoices}</span>
                            </div>
                            ${userSelectedCount > effectiveNumChoices ? `<span class="counter-warning">⚠️ ${userSelectedCount - effectiveNumChoices} oltre il limite</span>` : ''}
                        </div>
                        
                        <div class="skills-grid with-bonus">
                            ${availableSkills.map(skill => {
                                const isSelectedByUser = userSelectedSkills.includes(skill);
                                const isFromBackground = bgSkills.includes(skill);
                                const isBgInClassList = isFromBackground && availableSkills.includes(skill);
                                
                                const ability = SKILL_ABILITY_MAP[skill];
                                const abilityKey = PROPERTY_TO_ABILITY_KEY[ability];
                                const racialBonus = (selectedRace?.ability_bonuses || []).find(b => b.ability_score?.index === abilityKey)?.bonus || 0;
                                const asiBonus = pgData._asiBonuses?.[ability] || 0;
                                const abilityScore = (pgData.abilities?.[ability] || 10) + racialBonus + asiBonus;
                                const abilityMod = calculateModifier(abilityScore);
                                
                                const isProficient = isFromBackground || isSelectedByUser;
                                const totalBonus = abilityMod + (isProficient ? profBonus : 0);
                                
                                let skillClass = '';
                                if (isBgInClassList) {
                                    skillClass = 'double-prof'; // viola: background + nella lista classe
                                } else if (isFromBackground) {
                                    skillClass = 'from-background'; // blu: solo background
                                } else if (isSelectedByUser && userSelectedCount > effectiveNumChoices) {
                                    skillClass = 'over-limit'; // arancio
                                } else if (isSelectedByUser) {
                                    skillClass = 'selected'; // verde
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
                            <span class="legend-item"><span class="dot green"></span> Da classe (scelta)</span>
                            <span class="legend-item"><span class="dot blue"></span> Dal background</span>
                            <span class="legend-item"><span class="dot purple"></span> Background + classe (sostituzione)</span>
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
