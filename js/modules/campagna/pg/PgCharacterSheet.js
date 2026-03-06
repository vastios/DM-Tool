/**
 * PgCharacterSheet.js
 * ─────────────────────────────────────────────────────────────
 * Renderizza la scheda personaggio completa e le sezioni correlate.
 * 
 * @author DM Tool
 * @version 1.0.0
 */

import { 
    ABILITY_KEY_TO_PROPERTY,
    SKILL_ABILITY_MAP,
    ALL_SKILLS,
    calculateModifier 
} from './PgConstants.js';
import { linkifyConditions } from '/utils/htmlHelpers.js';
import { linkifyCampaignReferences } from '/utils/campaignLinker.js';
import { getRaceTraitsWithDescriptions } from '/database/traitDescriptions.js';

// ========================================================================
// HELPER FUNCTIONS
// ========================================================================

/**
 * Escape HTML per prevenire XSS
 * @param {string} text - Testo da escapare
 * @returns {string} Testo escapato
 */
export function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================================================
// TRATTI E PRIVILEGI
// ========================================================================

/**
 * Crea un tag con tooltip per tratti/privilegi
 * @param {string} name - Nome del tratto
 * @param {string} description - Descrizione
 * @param {string} type - Tipo (racial, class, subclass, background)
 * @returns {string} HTML del tag
 */
export function renderTraitTag(name, description, type = 'trait') {
    const escapedDesc = escapeHtml(description || '');
    const truncatedDesc = escapedDesc.length > 300 
        ? escapedDesc.substring(0, 300) + '...' 
        : escapedDesc;
    
    return `
        <span class="trait-tag ${type}" data-tooltip="${truncatedDesc}">
            ${name}
        </span>
    `;
}

/**
 * Ottiene i privilegi di classe in base al livello
 * @param {Object} selectedClass - Classe selezionata
 * @param {number} level - Livello del PG
 * @returns {Array} Lista privilegi
 */
export function getClassPrivileges(selectedClass, level) {
    if (!selectedClass || !selectedClass.tabella_progressione) return [];
    
    const privileges = [];
    const table = selectedClass.tabella_progressione;
    
    for (let i = 0; i < Math.min(level, 20); i++) {
        const rowData = table[i];
        if (rowData && rowData.privilegi) {
            rowData.privilegi.forEach(priv => {
                // Evita duplicati
                if (!privileges.find(p => p.nome === priv)) {
                    privileges.push({
                        nome: priv,
                        livello: rowData.livello,
                        descrizione: selectedClass.descrizione_privilegi?.[priv] || ''
                    });
                }
            });
        }
    }
    
    return privileges;
}

/**
 * Ottiene i privilegi della sottoclasse in base al livello
 * @param {Object} selectedClass - Classe selezionata
 * @param {number} level - Livello del PG
 * @returns {Array} Lista privilegi sottoclasse
 */
export function getSubclassPrivileges(selectedClass, level) {
    if (!selectedClass || !selectedClass.sottoclasse) return [];
    
    const privileges = [];
    const subclassPrivs = selectedClass.sottoclasse.privilegi;
    
    if (!subclassPrivs) return privileges;
    
    Object.entries(subclassPrivs).forEach(([livello, data]) => {
        const livNum = parseInt(livello);
        if (livNum <= level) {
            // Se è un array (più privilegi allo stesso livello)
            if (Array.isArray(data)) {
                data.forEach(d => {
                    privileges.push({
                        nome: d.nome,
                        livello: livNum,
                        descrizione: d.descrizione || ''
                    });
                });
            } else {
                privileges.push({
                    nome: data.nome,
                    livello: livNum,
                    descrizione: data.descrizione || ''
                });
            }
        }
    });
    
    return privileges;
}

/**
 * Ottiene i tratti raziali con descrizioni dal database traitDescriptions.js
 * @param {Object} selectedRace - Razza selezionata
 * @returns {Array} Lista tratti raziali
 */
export function getRacialTraits(selectedRace) {
    if (!selectedRace) return [];
    
    // Usa la funzione del database per ottenere tratti con descrizioni
    return getRaceTraitsWithDescriptions(selectedRace);
}

/**
 * Renderizza la sezione tratti e privilegi (usata nel wizard)
 * @param {Object} pgData - Dati del personaggio
 * @param {Object} databases - Database con razza, classe, background
 * @returns {string} HTML della sezione
 */
export function renderTraitsAndPrivileges(pgData, databases) {
    const { selectedRace, selectedClass, selectedBackground } = databases;
    const level = pgData.level || 1;
    
    let html = '<div class="traits-privileges-panel">';
    
    // Tratti Raziali
    if (selectedRace) {
        const racialTraits = getRacialTraits(selectedRace);
        html += `
            <div class="tp-section">
                <h4>🌍 Tratti Raziali</h4>
                <div class="tp-tags">
                    ${racialTraits.length > 0 
                        ? racialTraits.map(t => renderTraitTag(t.nome, t.descrizione, 'racial')).join('')
                        : '<span class="no-traits">Nessun tratto definito</span>'
                    }
                </div>
            </div>
        `;
    }
    
    // Privilegi di Classe
    if (selectedClass) {
        const classPrivs = getClassPrivileges(selectedClass, level);
        html += `
            <div class="tp-section">
                <h4>⚔️ Privilegi di Classe (Liv. ${level})</h4>
                <div class="tp-tags">
                    ${classPrivs.length > 0 
                        ? classPrivs.map(p => renderTraitTag(p.nome, p.descrizione, 'class')).join('')
                        : '<span class="no-traits">Nessun privilegio</span>'
                    }
                </div>
            </div>
        `;
        
        // Privilegi Sottoclasse
        if (pgData.subclass || selectedClass.sottoclasse) {
            const subclassPrivs = getSubclassPrivileges(selectedClass, level);
            if (subclassPrivs.length > 0) {
                html += `
                    <div class="tp-section">
                        <h4>🔮 ${pgData.subclass || selectedClass.sottoclasse?.nome || 'Sottoclasse'}</h4>
                        <div class="tp-tags">
                            ${subclassPrivs.map(p => renderTraitTag(p.nome, p.descrizione, 'subclass')).join('')}
                        </div>
                    </div>
                `;
            }
        }
    }
    
    // Privilegi del Background
    if (selectedBackground && selectedBackground.privilegio) {
        const priv = selectedBackground.privilegio;
        html += `
            <div class="tp-section">
                <h4>📖 Privilegio del Background</h4>
                <div class="tp-tags">
                    ${renderTraitTag(priv.nome, priv.descrizione, 'background')}
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

// ========================================================================
// SCHEDA PG DETTAGLIO
// ========================================================================

/**
 * Renderizza la lista abilità
 * @param {Object} pg - Dati del personaggio
 * @param {Object} abilities - Caratteristiche
 * @returns {string} HTML della lista abilità
 */
export function renderSkillList(pg, abilities) {
    const profBonus = pg.proficiencyBonus || 2;
    const skills = pg.skills || [];
    
    const ABILITY_IT_ABBR = {
        strength: 'FOR', dexterity: 'DES', constitution: 'COS',
        intelligence: 'INT', wisdom: 'SAG', charisma: 'CAR'
    };
    
    const half = Math.ceil(ALL_SKILLS.length / 2);
    const leftSkills = ALL_SKILLS.slice(0, half);
    const rightSkills = ALL_SKILLS.slice(half);
    
    const renderSkill = (skill) => {
        const ability = SKILL_ABILITY_MAP[skill];
        const prop = ABILITY_KEY_TO_PROPERTY[ability];
        const score = abilities[prop] || 10;
        let mod = calculateModifier(score);
        const hasProf = skills.includes(skill);
        if (hasProf) mod += profBonus;
        const abbr = ABILITY_IT_ABBR[ability] || '';
        
        return `
            <div class="skill-item ${hasProf ? 'prof' : ''}">
                <span class="sk-icon">${hasProf ? '⚔' : '·'}</span>
                <span class="sk-name">${skill}</span>
                <span class="sk-abbr">${abbr}</span>
                <span class="sk-val">${mod >= 0 ? '+' : ''}${mod}</span>
            </div>
        `;
    };
    
    return `
        <div class="skills-list-2col">
            <div class="skills-col">
                ${leftSkills.map(renderSkill).join('')}
            </div>
            <div class="skills-col">
                ${rightSkills.map(renderSkill).join('')}
            </div>
        </div>
    `;
}

/**
 * Renderizza il blocco incantesimi
 * @param {Object} pg - Dati del personaggio
 * @returns {string} HTML del blocco incantesimi
 */
export function renderSpellBlock(pg) {
    return `
        <div class="sheet-section">
            <h3>Incantesimi</h3>
            <p class="spell-info">
                CD: <strong>${pg.spellcasting.spellSaveDC || 0}</strong> | 
                Attacco: <strong>+${pg.spellcasting.spellAttackBonus || 0}</strong>
            </p>
            <div class="spells-known-list">
                ${(pg.spellcasting.spellsKnown || []).map(s => `<span class="spell-tag">${s}</span>`).join('') || '<span>Nessuno</span>'}
            </div>
        </div>
    `;
}

/**
 * Processa l'equipaggiamento applicando le scelte salvate
 * @param {Array} equipmentList - Lista equipaggiamento
 * @param {Object} choices - Scelte effettuate
 * @returns {Array} Lista processata
 */
export function processEquipmentWithChoices(equipmentList, choices) {
    if (!Array.isArray(equipmentList)) return [];
    
    return equipmentList.map((item, index) => {
        const choiceKey = `class-${index}`;
        const choice = choices[choiceKey];
        
        // Verifica se è una scelta (a)/(b)
        const choiceMatch = item.match(/^\(a\)\s*(.+?)\s*o\s*\(b\)\s*(.+)$/i);
        if (choiceMatch && choice) {
            if (choice === 'a') return choiceMatch[1].trim();
            if (choice === 'b') return choiceMatch[2].trim();
        }
        
        // Verifica scelte multiple
        const multiMatch = item.match(/\(([a-z])\)\s*([^()]+?)(?=\s*(?:\([a-z]\)|$))/gi);
        if (multiMatch && multiMatch.length > 1 && choice) {
            for (const opt of multiMatch) {
                const m = opt.match(/\(([a-z])\)\s*(.+)/i);
                if (m && m[1].toLowerCase() === choice.toLowerCase()) {
                    return m[2].trim();
                }
            }
        }
        
        return item;
    }).filter(Boolean);
}

/**
 * Renderizza la sezione Inventario nella scheda PG
 * @param {Object} pg - Dati del personaggio
 * @param {Object} pgClass - Classe del personaggio
 * @returns {string} HTML della sezione inventario
 */
export function renderInventorySection(pg, pgClass) {
    // Equipaggiamento dalla classe (con scelte applicate)
    const classEquipment = pgClass?.equipaggiamento || [];
    const equipmentChoices = pg.equipmentChoices || {};
    
    // Processa l'equipaggiamento con le scelte
    const processedEquipment = processEquipmentWithChoices(classEquipment, equipmentChoices);
    
    // Equipaggiamento extra
    const extraEquipment = pg.extraEquipment || '';
    
    // Oro
    const treasure = pg.treasure || {};
    
    if (processedEquipment.length === 0 && !extraEquipment) {
        return '';
    }
    
    return `
        <div class="sheet-section section-inventory">
            <h3>🎒 Inventario</h3>
            
            ${processedEquipment.length > 0 ? `
                <div class="equipment-list">
                    ${processedEquipment.map(item => `
                        <span class="equip-tag">${escapeHtml(item)}</span>
                    `).join('')}
                </div>
            ` : ''}
            
            ${extraEquipment ? `
                <div class="extra-equipment">
                    <p>${linkifyCampaignReferences(escapeHtml(extraEquipment))}</p>
                </div>
            ` : ''}
            
            ${treasure.gp || treasure.sp || treasure.ep || treasure.cp || treasure.pp ? `
                <div class="treasure-row">
                    ${treasure.pp ? `<span class="treasure-tag pp">${treasure.pp} pp</span>` : ''}
                    ${treasure.gp ? `<span class="treasure-tag gp">${treasure.gp} mo</span>` : ''}
                    ${treasure.ep ? `<span class="treasure-tag ep">${treasure.ep} me</span>` : ''}
                    ${treasure.sp ? `<span class="treasure-tag sp">${treasure.sp} ma</span>` : ''}
                    ${treasure.cp ? `<span class="treasure-tag cp">${treasure.cp} mr</span>` : ''}
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Renderizza la scheda PG completa
 * @param {Object} pg - Dati del personaggio
 * @param {Object} databases - Database con classi, razze, etc.
 * @returns {string} HTML della scheda
 */
export function renderCharacterSheet(pg, databases) {
    console.log('🎨 [PgCharacterSheet] Render scheda:', pg.name);
    
    const hp = pg.hp || { current: 0, max: 0, temp: 0 };
    const abilities = pg.abilities || {
        strength: 10, dexterity: 10, constitution: 10,
        intelligence: 10, wisdom: 10, charisma: 10
    };
    
    const ABILITY_IT = {
        str: 'FOR', dex: 'DES', con: 'COS',
        int: 'INT', wis: 'SAG', cha: 'CAR'
    };
    
    const CLASS_IMAGE_MAP = {
        'barbarian': 'barbaro', 'bard': 'bardo', 'cleric': 'chierico',
        'druid': 'druido', 'fighter': 'guerriero', 'monk': 'monaco',
        'paladin': 'paladino', 'ranger': 'ranger', 'rogue': 'ladro',
        'sorcerer': 'stregone', 'warlock': 'warlock', 'wizard': 'mago'
    };
    
    const classIndex = (pg.class || '').toLowerCase();
    const classImageName = CLASS_IMAGE_MAP[classIndex] || classIndex;
    const classImagePath = `/assets/classes/${classImageName}.png`;
    
    // Ottieni tratti e privilegi per la scheda - cerca dal PG corrente, NON dalle variabili del wizard
    const pgClass = databases.classes?.find(c => c.index === pg.class);
    const pgRace = databases.races?.find(r => r.index === pg.race);
    const classPrivs = pgClass ? getClassPrivileges(pgClass, pg.level || 1) : [];
    const subclassPrivs = pgClass ? getSubclassPrivileges(pgClass, pg.level || 1) : [];
    const racialTraits = getRacialTraits(pgRace);
    
    return `
        <div class="pg-sheet">
            <!-- HEADER -->
            <div class="sheet-header">
                <div class="header-left">
                    <h2 class="char-name">${pg.name || 'Senza Nome'}</h2>
                    <p class="char-class-info">${pg.raceName || pg.race || ''} ${pg.className || pg.class || ''} Lv.${pg.level || 1}</p>
                    <p class="char-player">giocato da: ${pg.playerName || 'Nessun giocatore'}</p>
                </div>
                <img class="class-icon" src="${classImagePath}" alt="${pg.className || 'Classe'}" onerror="this.style.display='none'">
            </div>
            
            <div class="sheet-body">
                <!-- RIGA 1: Identità + Combattimento -->
                <div class="sheet-row-top">
                    <div class="sheet-section section-identity">
                        <h3>Identità</h3>
                        <div class="identity-cols">
                            <div class="id-col">
                                <span class="id-label">Background</span>
                                <span class="id-value">${pg.backgroundName || pg.background || '-'}</span>
                            </div>
                            <div class="id-col">
                                <span class="id-label">Allineamento</span>
                                <span class="id-value">${pg.alignment || '-'}</span>
                            </div>
                            <div class="id-col">
                                <span class="id-label">Livello</span>
                                <span class="id-value">${pg.level || 1}</span>
                            </div>
                            <div class="id-col">
                                <span class="id-label">Competenza</span>
                                <span class="id-value">+${pg.proficiencyBonus || 2}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sheet-section section-combat">
                        <h3>Combattimento</h3>
                        <div class="combat-grid">
                            <div class="combat-stat">
                                <label>HP</label>
                                <div class="hp-input-group">
                                    <input type="number" id="hp-current" value="${hp.current}" min="0" max="${hp.max}">
                                    <span>/ ${hp.max}</span>
                                    ${hp.temp > 0 ? `<span class="temp">(+${hp.temp})</span>` : ''}
                                </div>
                            </div>
                            <div class="combat-stat">
                                <label>CA</label>
                                <span class="big-val">${pg.armorClass || 10}</span>
                            </div>
                            <div class="combat-stat">
                                <label>Iniziativa</label>
                                <span class="big-val">${pg.initiative >= 0 ? '+' : ''}${pg.initiative || 0}</span>
                            </div>
                            <div class="combat-stat">
                                <label>Velocità</label>
                                <span class="big-val">${pg.speed || 9}m</span>
                            </div>
                            <div class="combat-stat">
                                <label>Dado Vita</label>
                                <span class="big-val">${pg.hitDice?.current ?? pg.level}/${pg.hitDice?.total ?? pg.level}d${pgClass?.hit_die || pg.hitDice?.size?.replace('d', '') || 8}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- RIGA 2: Caratteristiche + Abilità -->
                <div class="sheet-row-middle">
                    <div class="sheet-section section-abilities">
                        <h3>Caratteristiche</h3>
                        <div class="abilities-col">
                            ${['str', 'dex', 'con', 'int', 'wis', 'cha'].map(key => {
                                const prop = ABILITY_KEY_TO_PROPERTY[key];
                                const score = abilities[prop] || 10;
                                const mod = calculateModifier(score);
                                const hasSave = (pg.savingThrows || []).includes(key.toUpperCase());
                                
                                return `
                                    <div class="ability-block ${hasSave ? 'has-save' : ''}">
                                        <span class="ab-name">${ABILITY_IT[key]}</span>
                                        <span class="ab-score">${score}</span>
                                        <span class="ab-mod">${mod >= 0 ? '+' : ''}${mod}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <div class="sheet-section section-skills">
                        <h3>Abilità</h3>
                        ${renderSkillList(pg, abilities)}
                    </div>
                </div>
                
                <!-- RIGA: Tratti e Privilegi -->
                <div class="sheet-row-traits">
                    ${racialTraits.length > 0 ? `
                        <div class="sheet-section section-traits">
                            <h3>🌍 Tratti Raziali</h3>
                            <div class="traits-list">
                                ${racialTraits.map(t => renderTraitTag(t.nome, t.descrizione, 'racial')).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${classPrivs.length > 0 ? `
                        <div class="sheet-section section-privileges">
                            <h3>⚔️ Privilegi di Classe</h3>
                            <div class="privileges-list">
                                ${classPrivs.map(p => renderTraitTag(p.nome, p.descrizione, 'class')).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${subclassPrivs.length > 0 ? `
                        <div class="sheet-section section-subclass">
                            <h3>🔮 ${pgClass?.sottoclasse?.nome || 'Sottoclasse'}</h3>
                            <div class="subclass-privs-list">
                                ${subclassPrivs.map(p => renderTraitTag(p.nome, p.descrizione, 'subclass')).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <!-- RIGA: Inventario -->
                <div class="sheet-row-inventory">
                    ${renderInventorySection(pg, pgClass)}
                </div>
                
                <!-- RIGA 3: Background e Note -->
                <div class="sheet-row-bottom">
                    ${pg.backstory ? `
                        <div class="sheet-section section-backstory">
                            <h3>Background</h3>
                            <div class="note-content">
                                <p>${linkifyCampaignReferences(linkifyConditions(escapeHtml(pg.backstory)))}</p>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${pg.notes ? `
                        <div class="sheet-section section-notes">
                            <h3>Note</h3>
                            <div class="note-content">
                                <p>${linkifyCampaignReferences(linkifyConditions(escapeHtml(pg.notes)))}</p>
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <!-- RIGA 4: Incantesimi (in fondo) -->
                ${pg.spellcasting ? `
                    <div class="sheet-row-spells">
                        ${renderSpellBlock(pg)}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

console.log('📋 [PgCharacterSheet] Modulo caricato.');