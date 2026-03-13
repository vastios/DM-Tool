/**
 * PgCharacterSheet.js
 * ─────────────────────────────────────────────────────────────
 * Renderizza la scheda personaggio con layout a 2 card flippabili.
 * 
 * Layout:
 * - Header fisso: Nome sx, info dx
 * - Card 1: Identità + Caratteristiche + Abilità | Note/Backstory/Segreti
 * - Card 2: Combattimento + TS + Magia | Tratti + Inventario
 * 
 * @author DM Tool
 * @version 2.1.0 - Layout ottimizzato
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

export function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================================================
// TRATTI E PRIVILEGI
// ========================================================================

export function renderTraitTag(name, description, type = 'trait') {
    const escapedDesc = escapeHtml(description || '');
    const truncatedDesc = escapedDesc.length > 500 
        ? escapedDesc.substring(0, 500) + '...' 
        : escapedDesc;
    
    // Aggiunge padding-top per il titolo del tooltip
    const descWithPadding = truncatedDesc ? `• ${name}\n\n${truncatedDesc}` : 'Nessuna descrizione disponibile';
    
    return `
        <span class="trait-tag ${type}" data-tooltip="${descWithPadding}" data-title="${name}">
            ${name}
        </span>
    `;
}

export function getClassPrivileges(selectedClass, level) {
    if (!selectedClass || !selectedClass.tabella_progressione) return [];
    
    const privileges = [];
    const table = selectedClass.tabella_progressione;
    
    for (let i = 0; i < Math.min(level, 20); i++) {
        const rowData = table[i];
        if (rowData && rowData.privilegi) {
            rowData.privilegi.forEach(priv => {
                if (!privileges.find(p => p.nome === priv)) {
                    // Le descrizioni possono essere stringhe o oggetti con descrizione_completa/riassunto
                    const descData = selectedClass.descrizione_privilegi?.[priv];
                    let description = '';
                    if (descData) {
                        if (typeof descData === 'string') {
                            description = descData;
                        } else if (descData.descrizione_completa) {
                            description = descData.descrizione_completa;
                        } else if (descData.riassunto) {
                            description = descData.riassunto;
                        }
                    }
                    
                    privileges.push({
                        nome: priv,
                        livello: rowData.livello,
                        descrizione: description
                    });
                }
            });
        }
    }
    
    return privileges;
}

export function getSubclassPrivileges(selectedClass, level) {
    if (!selectedClass || !selectedClass.sottoclasse) return [];
    
    const privileges = [];
    const subclassPrivs = selectedClass.sottoclasse.privilegi;
    
    if (!subclassPrivs) return privileges;
    
    Object.entries(subclassPrivs).forEach(([livello, data]) => {
        const livNum = parseInt(livello);
        if (livNum <= level) {
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

export function getRacialTraits(selectedRace) {
    if (!selectedRace) return [];
    return getRaceTraitsWithDescriptions(selectedRace);
}

/**
 * Ottiene i privilegi del background
 */
export function getBackgroundPrivileges(selectedBackground) {
    if (!selectedBackground) return [];
    
    const privileges = [];
    
    // Il background ha un privilegio principale
    if (selectedBackground.privilegio) {
        privileges.push({
            nome: selectedBackground.privilegio.nome || 'Privilegio',
            descrizione: selectedBackground.privilegio.descrizione || ''
        });
    }
    
    return privileges;
}

// ========================================================================
// SEZIONI CARD
// ========================================================================

/**
 * Renderizza l'header: Nome a sinistra, info a destra
 */
function renderSheetHeader(pg) {
    return `
        <div class="sheet-header-split">
            <div class="header-left">
                <h2 class="char-name">${pg.name || 'Senza Nome'}</h2>
            </div>
            <div class="header-right">
                <p class="char-class-info">${pg.raceName || pg.race || ''} ${pg.className || pg.class || ''} Liv.${pg.level || 1}</p>
                <p class="char-player">Giocato da: ${pg.playerName || 'Nessun giocatore'}</p>
            </div>
        </div>
    `;
}

/**
 * Renderizza il fronte della Card 1: Identità + Caratteristiche + Abilità
 */
function renderCard1Front(pg, databases) {
    const abilities = pg.abilities || {
        strength: 10, dexterity: 10, constitution: 10,
        intelligence: 10, wisdom: 10, charisma: 10
    };
    
    const ABILITY_IT = {
        str: 'FOR', dex: 'DES', con: 'COS',
        int: 'INT', wis: 'SAG', cha: 'CAR'
    };
    
    // Abilità
    const skills = pg.skills || [];
    const profBonus = pg.proficiencyBonus || 2;
    const ABILITY_IT_ABBR = {
        strength: 'FOR', dexterity: 'DES', constitution: 'COS',
        intelligence: 'INT', wisdom: 'SAG', charisma: 'CAR'
    };
    
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
                <span class="sk-icon">${hasProf ? '●' : '○'}</span>
                <span class="sk-name">${skill}</span>
                <span class="sk-abbr">${abbr}</span>
                <span class="sk-val">${mod >= 0 ? '+' : ''}${mod}</span>
            </div>
        `;
    };
    
    // Dividi abilità in 2 colonne
    const half = Math.ceil(ALL_SKILLS.length / 2);
    const leftSkills = ALL_SKILLS.slice(0, half);
    const rightSkills = ALL_SKILLS.slice(half);
    
    return `
        <div class="card-face card-front">
            <div class="card-section identity-section compact">
                <h3>🎭 Identità</h3>
                <div class="identity-grid-compact">
                    <div class="id-item">
                        <span class="id-label">Background</span>
                        <span class="id-value">${pg.backgroundName || pg.background || '-'}</span>
                    </div>
                    <div class="id-item">
                        <span class="id-label">Allineamento</span>
                        <span class="id-value">${pg.alignment || '-'}</span>
                    </div>
                    <div class="id-item">
                        <span class="id-label">Competenza</span>
                        <span class="id-value">+${pg.proficiencyBonus || 2}</span>
                    </div>
                    <div class="id-item">
                        <span class="id-label">Velocità</span>
                        <span class="id-value">${pg.speed || 9}m</span>
                    </div>
                </div>
            </div>
            
            <div class="card-section abilities-section compact">
                <h3>📊 Caratteristiche</h3>
                <div class="abilities-grid-sheet">
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
            
            <div class="card-section skills-section flex-grow">
                <h3>🎯 Abilità</h3>
                <div class="skills-list-2col">
                    <div class="skills-col">
                        ${leftSkills.map(renderSkill).join('')}
                    </div>
                    <div class="skills-col">
                        ${rightSkills.map(renderSkill).join('')}
                    </div>
                </div>
            </div>
            
            <div class="flip-hint">↻ Click per girare</div>
        </div>
    `;
}

/**
 * Renderizza il retro della Card 1: Combattimento + TS + Magia
 */
function renderCard1Back(pg, databases) {
    const hp = pg.hp || { current: 0, max: 0, temp: 0 };
    const abilities = pg.abilities || {
        strength: 10, dexterity: 10, constitution: 10,
        intelligence: 10, wisdom: 10, charisma: 10
    };
    const pgClass = databases.classes?.find(c => c.index === pg.class);
    
    // Calcola iniziativa
    const dexMod = calculateModifier(abilities.dexterity);
    const initiative = pg.initiative !== null ? pg.initiative : dexMod;
    
    // Tiri Salvezza
    const saves = pg.savingThrows || [];
    const profBonus = pg.proficiencyBonus || 2;
    
    const ABILITY_IT = {
        str: 'FOR', dex: 'DES', con: 'COS',
        int: 'INT', wis: 'SAG', cha: 'CAR'
    };
    
    // Incantesimi per livello
    const spellcasting = pg.spellcasting || {};
    const spellsByLevel = organizeSpellsByLevel(spellcasting.spellsKnown || []);
    
    return `
        <div class="card-face card-back">
            <div class="card-section combat-section compact">
                <h3>⚔️ Combattimento</h3>
                <div class="combat-grid-sheet">
                    <div class="combat-stat">
                        <label>PF</label>
                        <div class="hp-display">
                            <input type="number" id="hp-current" value="${hp.current}" min="0" max="${hp.max}">
                            <span class="hp-max">/ ${hp.max}</span>
                            ${hp.temp > 0 ? `<span class="hp-temp">(+${hp.temp})</span>` : ''}
                        </div>
                    </div>
                    <div class="combat-stat ca-stat">
                        <label>CA</label>
                        <div class="ca-display">
                            <span class="big-val" id="ca-value">${pg.armorClass || 10}</span>
                            <button class="btn-edit-ca" id="btn-edit-ac" title="Modifica CA">✏️</button>
                        </div>
                    </div>
                    <div class="combat-stat">
                        <label>Iniziativa</label>
                        <span class="big-val">${initiative >= 0 ? '+' : ''}${initiative}</span>
                    </div>
                    <div class="combat-stat">
                        <label>Dado Vita</label>
                        <span class="big-val">${pg.hitDice?.current ?? pg.level}/${pg.hitDice?.total ?? pg.level}d${pgClass?.hit_die || 8}</span>
                    </div>
                </div>
            </div>
            
            <div class="card-section saves-section compact">
                <h3>🛡️ Tiri Salvezza</h3>
                <div class="saves-grid">
                    ${['str', 'dex', 'con', 'int', 'wis', 'cha'].map(key => {
                        const prop = ABILITY_KEY_TO_PROPERTY[key];
                        const score = abilities[prop] || 10;
                        let mod = calculateModifier(score);
                        const hasSave = saves.includes(key.toUpperCase());
                        if (hasSave) mod += profBonus;
                        return `
                            <div class="save-item ${hasSave ? 'prof' : ''}">
                                <span class="save-name">${ABILITY_IT[key]}</span>
                                <span class="save-val">${mod >= 0 ? '+' : ''}${mod}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            ${spellcasting.spellsKnown?.length > 0 ? `
                <div class="card-section spells-section flex-grow">
                    <h3>🔮 Magia</h3>
                    <p class="spell-info">
                        CD: <strong>${spellcasting.spellSaveDC || 0}</strong> | 
                        Attacco: <strong>+${spellcasting.spellAttackBonus || 0}</strong>
                    </p>
                    ${renderSpellsByLevel(spellsByLevel)}
                </div>
            ` : `
                <div class="card-section spells-section flex-grow empty-section">
                    <h3>🔮 Magia</h3>
                    <p class="empty-note">Nessun incantesimo</p>
                </div>
            `}
            
            <div class="flip-hint">↻ Click per girare</div>
        </div>
    `;
}

/**
 * Renderizza il fronte della Card 2: Note + Backstory + Segreti DM
 */
function renderCard2Front(pg) {
    return `
        <div class="card-face card-front">
            <div class="card-section notes-section flex-third">
                <h3>📝 Note</h3>
                <div class="note-content">
                    ${pg.notes 
                        ? `<p>${linkifyCampaignReferences(linkifyConditions(escapeHtml(pg.notes)))}</p>`
                        : '<p class="empty-note">Nessuna nota</p>'
                    }
                </div>
            </div>
            
            <div class="card-section backstory-section flex-third">
                <h3>📖 Storia</h3>
                <div class="note-content">
                    ${pg.backstory 
                        ? `<p>${linkifyCampaignReferences(linkifyConditions(escapeHtml(pg.backstory)))}</p>`
                        : '<p class="empty-note">Nessuna backstory</p>'
                    }
                </div>
            </div>
            
            <div class="card-section secrets-section flex-third">
                <h3>🔒 Segreti DM</h3>
                <div class="note-content dm-secrets">
                    ${pg.dmSecrets 
                        ? `<p>${linkifyCampaignReferences(linkifyConditions(escapeHtml(pg.dmSecrets)))}</p>`
                        : '<p class="empty-note">Nessun segreto</p>'
                    }
                </div>
            </div>
            
            <div class="flip-hint">↻ Click per girare</div>
        </div>
    `;
}

/**
 * Organizza gli incantesimi per livello
 */
function organizeSpellsByLevel(spells) {
    const byLevel = {
        0: [], // Trucchetti
        1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
    };
    
    if (!spells || spells.length === 0) return byLevel;
    
    // Se sono stringhe semplici, mettile tutte al livello 1
    if (typeof spells[0] === 'string') {
        spells.forEach(spell => {
            byLevel[1].push({ name: spell, level: 1 });
        });
    } else if (typeof spells[0] === 'object') {
        spells.forEach(spell => {
            const level = spell.level || 1;
            if (byLevel[level] !== undefined) {
                byLevel[level].push(spell);
            }
        });
    }
    
    return byLevel;
}

/**
 * Renderizza gli incantesimi organizzati per livello
 */
function renderSpellsByLevel(spellsByLevel) {
    const levelNames = {
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
    
    let html = '<div class="spells-by-level">';
    
    for (let level = 0; level <= 9; level++) {
        const spells = spellsByLevel[level];
        if (spells && spells.length > 0) {
            html += `
                <div class="spell-level-group">
                    <span class="spell-level-label">${levelNames[level]}</span>
                    <div class="spell-level-list">
                        ${spells.map(s => `<span class="spell-tag">${typeof s === 'string' ? s : s.name}</span>`).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    html += '</div>';
    return html;
}

/**
 * Renderizza il retro della Card 2: Tratti + Inventario
 */
function renderCard2Back(pg, databases) {
    const pgClass = databases.classes?.find(c => c.index === pg.class);
    const pgRace = databases.races?.find(r => r.index === pg.race);
    const pgBackground = databases.backgrounds?.find(b => b.index === pg.background);
    
    // Tratti
    const racialTraits = getRacialTraits(pgRace);
    const classPrivs = pgClass ? getClassPrivileges(pgClass, pg.level || 1) : [];
    const subclassPrivs = pgClass ? getSubclassPrivileges(pgClass, pg.level || 1) : [];
    const backgroundPrivs = getBackgroundPrivileges(pgBackground);
    
    // Inventario
    const inventory = pg.inventory || [];
    const totalWeight = inventory.reduce((total, item) => {
        const weight = item.weight || 0;
        const qty = item.quantity || 1;
        return total + (weight * qty);
    }, 0);
    
    return `
        <div class="card-face card-back">
            <div class="card-section traits-section flex-half">
                <h3>🌟 Tratti & Privilegi</h3>
                ${racialTraits.length > 0 ? `
                    <div class="traits-group">
                        <span class="traits-label">Raziali:</span>
                        <div class="traits-tags">
                            ${racialTraits.map(t => renderTraitTag(t.nome, t.descrizione, 'racial')).join('')}
                        </div>
                    </div>
                ` : ''}
                ${classPrivs.length > 0 ? `
                    <div class="traits-group">
                        <span class="traits-label">Classe:</span>
                        <div class="traits-tags">
                            ${classPrivs.slice(0, 6).map(p => renderTraitTag(p.nome, p.descrizione, 'class')).join('')}
                            ${classPrivs.length > 6 ? `<span class="more-hint">+${classPrivs.length - 6}</span>` : ''}
                        </div>
                    </div>
                ` : ''}
                ${subclassPrivs.length > 0 ? `
                    <div class="traits-group">
                        <span class="traits-label">Sottoclasse:</span>
                        <div class="traits-tags">
                            ${subclassPrivs.map(p => renderTraitTag(p.nome, p.descrizione, 'subclass')).join('')}
                        </div>
                    </div>
                ` : ''}
                ${backgroundPrivs.length > 0 ? `
                    <div class="traits-group">
                        <span class="traits-label">Background:</span>
                        <div class="traits-tags">
                            ${backgroundPrivs.map(p => renderTraitTag(p.nome, p.descrizione, 'background')).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <div class="card-section inventory-section flex-half">
                <h3>🎒 Inventario</h3>
                <div class="inventory-summary">
                    <span>📦 ${inventory.length} oggetti</span>
                    <span>⚖️ ${totalWeight.toFixed(1)} kg</span>
                </div>
                <div class="inventory-compact">
                    ${inventory.length > 0 
                        ? inventory.slice(0, 12).map(item => {
                            const qty = item.quantity || 1;
                            const displayText = qty > 1 ? `${qty}× ${item.name}` : item.name;
                            return `<span class="inv-item">${escapeHtml(displayText)}</span>`;
                        }).join('')
                        : '<span class="empty-inv">Inventario vuoto</span>'
                    }
                    ${inventory.length > 12 ? `<span class="more-hint">+${inventory.length - 12}</span>` : ''}
                </div>
            </div>
            
            <div class="flip-hint">↻ Click per girare</div>
        </div>
    `;
}

// ========================================================================
// SCHEDA PRINCIPALE
// ========================================================================

export function renderCharacterSheet(pg, databases) {
    console.log('🎨 [PgCharacterSheet] Render scheda:', pg.name);
    
    return `
        <div class="pg-sheet-v2">
            ${renderSheetHeader(pg)}
            
            <div class="cards-container">
                <div class="flip-card" data-card="1">
                    <div class="flip-card-inner">
                        ${renderCard1Front(pg, databases)}
                        ${renderCard1Back(pg, databases)}
                    </div>
                </div>
                
                <div class="flip-card" data-card="2">
                    <div class="flip-card-inner">
                        ${renderCard2Front(pg)}
                        ${renderCard2Back(pg, databases)}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Modal per modificare CA -->
        <div class="ca-modal hidden" id="ca-modal">
            <div class="ca-modal-content">
                <h4>Modifica Classe Armatura</h4>
                <input type="number" id="ca-input" value="${pg.armorClass || 10}" min="1" max="30">
                <div class="ca-modal-actions">
                    <button class="btn btn-secondary btn-sm" id="btn-ca-cancel">Annulla</button>
                    <button class="btn btn-primary btn-sm" id="btn-ca-save">Salva</button>
                </div>
            </div>
        </div>
    `;
}

// ========================================================================
// FUNZIONI COMPATIBILITÀ
// ========================================================================

export function renderTraitsAndPrivileges(pgData, databases) {
    const { selectedRace, selectedClass, selectedBackground } = databases;
    const level = pgData.level || 1;
    
    let html = '<div class="traits-privileges-panel">';
    
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
    }
    
    html += '</div>';
    return html;
}

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
                <span class="sk-icon">${hasProf ? '●' : '○'}</span>
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

export function renderInventorySection(pg, pgClass) {
    const inventory = pg.inventory || [];
    
    if (inventory.length === 0) {
        return `
            <div class="sheet-section section-inventory">
                <h3>🎒 Inventario</h3>
                <p class="empty-inventory">Nessun oggetto</p>
            </div>
        `;
    }
    
    const totalWeight = inventory.reduce((total, item) => {
        const weight = item.weight || 0;
        const qty = item.quantity || 1;
        return total + (weight * qty);
    }, 0);
    
    return `
        <div class="sheet-section section-inventory">
            <h3>🎒 Inventario</h3>
            <div class="inventory-summary">
                <span class="inv-stat">📦 ${inventory.length} oggetti</span>
                <span class="inv-stat">⚖️ ${totalWeight.toFixed(1)} kg</span>
            </div>
        </div>
    `;
}

console.log('📋 [PgCharacterSheet] Modulo caricato v2.1');
